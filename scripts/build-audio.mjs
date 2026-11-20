#!/usr/bin/env node
/**
 * Builds the app's audio from the raw recordings.
 *
 *   node scripts/build-audio.mjs            # only missing outputs
 *   node scripts/build-audio.mjs --force    # rebuild everything
 *
 * Reads scripts/audio-sources.json — { "<output path>": [source, ...] } — and
 * writes web-app/public/audio/<output path>. A source is a raw file path
 * relative to Audios/, or { "file": ..., "from": s, "to": s } to cut a span out
 * of a long uncut session recording.
 *
 * For each clip:
 *   - several sources (counting, days) are joined in order
 *   - leading and trailing silence is cut relative to the clip's own peak, so
 *     playback starts on the first word without clipping soft onsets
 *   - loudness is normalised with one constant gain (many raw takes peak near
 *     -28 dB, too quiet for a phone speaker in the street)
 *   - 10/20 ms fades and a little silence either side (LEAD_MS / TAIL_MS):
 *     many raw takes start and stop exactly on a word, and phones and
 *     Bluetooth speakers swallow the first fraction of a second while the
 *     output wakes, so a clip with no air around it sounds cut short
 *   - encoded mono 64 kbps — speech needs no more, and clips stay ~10–20 KB
 *
 * A clip is rebuilt when its sources or PIPELINE change (hashes are kept in
 * scripts/audio-built.json), so editing audio-sources.json is enough.
 *
 * The clips ship with the site and are served from the same origin, so there
 * is no third-party storage to pause, expire, or rate-limit.
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RAW = join(ROOT, 'Audios');
const OUT = join(ROOT, 'web-app', 'public', 'audio');
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const force = process.argv.includes('--force');

/** Bump when the processing below changes, so every clip is rebuilt once. */
const PIPELINE = 3;
const LEAD_MS = 180;
const TAIL_MS = 300;
const BUILT = join(ROOT, 'scripts', 'audio-built.json');
// The app appends each clip's hash to its URL (?v=…), so a rebuilt clip is a
// new URL and no browser or CDN can keep playing a stale copy.
const VERSIONS = join(ROOT, 'web-app', 'src', 'data', 'audio-versions.json');
const builtHashes = existsSync(BUILT) ? JSON.parse(readFileSync(BUILT, 'utf8')) : {};
const hashOf = (inputs) =>
  createHash('sha1').update(JSON.stringify({ PIPELINE, LEAD_MS, TAIL_MS, inputs })).digest('hex').slice(0, 12);

const sources = JSON.parse(readFileSync(join(ROOT, 'scripts', 'audio-sources.json'), 'utf8'));

const srcFile = (src) => (typeof src === 'object' ? src.file : src);

/** ffmpeg input args for one source (seeks into long session recordings). */
function inputArgs(src) {
  const seek = typeof src === 'object' ? ['-ss', String(src.from), '-to', String(src.to)] : [];
  return [...seek, '-i', join(RAW, srcFile(src))];
}

function ffmpeg(args) {
  const r = spawnSync(FFMPEG, args, { encoding: 'utf8' });
  if (r.error) {
    console.error(`Could not run ffmpeg (${FFMPEG}): ${r.error.message}. Install it or set FFMPEG.`);
    process.exit(2);
  }
  return r;
}

function analyse(src, filter) {
  return ffmpeg(['-hide_banner', '-nostats', ...inputArgs(src), '-af', filter, '-f', 'null', '-']).stderr;
}

/**
 * Speech span of one source, in seconds from its own start.
 *
 * The threshold is relative to the clip's own peak (35 dB below it), not a
 * fixed level: the session recordings peak around -16 dB, and a fixed -45 dB
 * gate was eating soft word onsets ("أنا آسف" came out as "أو أنت").
 * Keeps 120 ms of air before the first word so its consonant is never clipped.
 *
 * The end is found separately and much more gently (50 dB below peak, then
 * 250 ms of air): words fade out, and the 35 dB gate was cutting the tail of
 * the last syllable on quiet takes.
 */
function speechSpan(src) {
  const stats = analyse(src, 'aformat=channel_layouts=mono,volumedetect');
  const peak = Number(/max_volume: (-?[\d.]+) dB/.exec(stats)?.[1] ?? -20);
  const whole = /Duration: (\d+):(\d+):([\d.]+)/.exec(stats);
  const dur =
    typeof src === 'object'
      ? src.to - src.from
      : whole
        ? Number(whole[1]) * 3600 + Number(whole[2]) * 60 + Number(whole[3])
        : 0;
  const det = analyse(src, `aformat=channel_layouts=mono,silencedetect=n=${(peak - 35).toFixed(1)}dB:d=0.15`);
  const starts = [...det.matchAll(/silence_start: (-?[\d.]+)/g)].map((m) => Math.max(0, Number(m[1])));
  const ends = [...det.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  let from = 0;
  let to = dur;
  if (starts.length && starts[0] <= 0.02 && ends.length) from = ends[0];
  const lastStart = starts[starts.length - 1];
  const trailing = starts.length > ends.length || (ends.length && ends[ends.length - 1] >= dur - 0.05);
  if (starts.length && trailing && lastStart > from) to = lastStart;
  const soft = analyse(src, `aformat=channel_layouts=mono,silencedetect=n=${(peak - 50).toFixed(1)}dB:d=0.25`);
  const sStarts = [...soft.matchAll(/silence_start: (-?[\d.]+)/g)].map((m) => Number(m[1]));
  const sEnds = [...soft.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  const softTrailing =
    sStarts.length > sEnds.length || (sEnds.length && sEnds[sEnds.length - 1] >= dur - 0.05);
  const softEnd = sStarts.length && softTrailing ? sStarts[sStarts.length - 1] : dur;
  to = Math.max(to, softEnd);
  if (!(to > from)) return { from: 0, to: dur };
  return { from: Math.max(0, from - 0.12), to: Math.min(dur, to + 0.25) };
}

let built = 0;
let skipped = 0;
const failed = [];

for (const [out, inputs] of Object.entries(sources)) {
  const dst = join(OUT, out);
  const hash = hashOf(inputs);
  if (!force && existsSync(dst) && builtHashes[out] === hash) {
    skipped++;
    continue;
  }

  const missing = inputs.map(srcFile).filter((f) => !existsSync(join(RAW, f)));
  if (missing.length) {
    failed.push(`${out}: missing ${missing.join(', ')}`);
    continue;
  }

  mkdirSync(dirname(dst), { recursive: true });

  // Trim each piece before joining, so the gaps between counted numbers are
  // natural pauses rather than whatever the recorder left running.
  const spans = inputs.map(speechSpan);
  const inputsArgs = inputs.flatMap(inputArgs);
  const pieces = spans.map(
    (sp, i) =>
      `[${i}:a]aformat=channel_layouts=mono,atrim=start=${sp.from.toFixed(3)}:end=${sp.to.toFixed(3)},asetpts=PTS-STARTPTS[p${i}]`
  );
  const joined =
    inputs.length > 1
      ? `${inputs.map((_, i) => `[p${i}]`).join('')}concat=n=${inputs.length}:v=0:a=1[j]`
      : `[p0]anull[j]`;

  // Two-pass loudness normalisation in linear mode: measure, then apply one
  // constant gain. Single-pass loudnorm is dynamic and audibly warps clips
  // shorter than its 3 s window — most of ours.
  const measure = ffmpeg(
    ['-hide_banner', '-nostats', ...inputsArgs, '-filter_complex',
      [...pieces, joined, '[j]loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json[out]'].join(';'),
      '-map', '[out]', '-f', 'null', '-']
  ).stderr;
  let m = {};
  try {
    m = JSON.parse(measure.slice(measure.lastIndexOf('{'), measure.lastIndexOf('}') + 1));
  } catch {
    // fall through to no normalisation for this clip
  }
  const norm =
    m.input_i && Number.isFinite(Number(m.input_i))
      ? `loudnorm=I=-16:TP=-1.5:LRA=11:linear=true:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}`
      : 'anull';

  const args = ['-v', 'error', '-y', ...inputsArgs,
    '-filter_complex', [...pieces, joined,
      `[j]${norm},afade=t=in:d=0.01,areverse,afade=t=in:d=0.02,areverse,` +
      `adelay=${LEAD_MS}:all=1,apad=pad_dur=${TAIL_MS / 1000}[out]`].join(';'),
    '-map', '[out]',
    '-ar', '44100', '-ac', '1', '-b:a', '64k',
    '-map_metadata', '-1',
    dst,
  ];

  const r = ffmpeg(args);
  if (r.status !== 0 || !existsSync(dst) || statSync(dst).size < 1000) {
    failed.push(`${out}: ${(r.stderr || 'empty output').trim().split('\n').pop()}`);
    // Never leave a broken file behind for the next run to treat as built.
    try {
      unlinkSync(dst);
    } catch {
      // nothing written
    }
    delete builtHashes[out];
    continue;
  }
  builtHashes[out] = hash;
  built++;
  if (built % 25 === 0) console.log(`  ${built} built…`);
}

writeFileSync(BUILT, JSON.stringify(builtHashes, null, 1) + '\n');
const versions = Object.fromEntries(Object.keys(sources).filter((k) => builtHashes[k]).map((k) => [k, builtHashes[k].slice(0, 8)]));
writeFileSync(VERSIONS, JSON.stringify(versions, null, 1) + '\n');
console.log(`\nBuilt ${built}, kept ${skipped} existing, ${failed.length} failed.`);
for (const f of failed) console.log(`  FAILED ${f}`);
process.exit(failed.length ? 1 : 0);
