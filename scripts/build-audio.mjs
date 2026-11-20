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
 *   - encoded mono 64 kbps — speech needs no more, and clips stay ~10–20 KB
 *
 * The clips ship with the site and are served from the same origin, so there
 * is no third-party storage to pause, expire, or rate-limit.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RAW = join(ROOT, 'Audios');
const OUT = join(ROOT, 'web-app', 'public', 'audio');
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const force = process.argv.includes('--force');

const sources = JSON.parse(readFileSync(join(ROOT, 'scripts', 'audio-sources.json'), 'utf8'));

const srcFile = (src) => (typeof src === 'object' ? src.file : src);

/** ffmpeg input args for one source (seeks into long session recordings). */
function inputArgs(src) {
  const seek = typeof src === 'object' ? ['-ss', String(src.from), '-to', String(src.to)] : [];
  return [...seek, '-i', join(RAW, srcFile(src))];
}

function analyse(src, filter) {
  return spawnSync(FFMPEG, ['-hide_banner', '-nostats', ...inputArgs(src), '-af', filter, '-f', 'null', '-'], {
    encoding: 'utf8',
  }).stderr;
}

/**
 * Speech span of one source, in seconds from its own start.
 *
 * The threshold is relative to the clip's own peak (35 dB below it), not a
 * fixed level: the session recordings peak around -16 dB, and a fixed -45 dB
 * gate was eating soft word onsets ("أنا آسف" came out as "أو أنت").
 * Keeps 120 ms of air either side so first consonants are never clipped.
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
  if (!(to > from)) return { from: 0, to: dur };
  return { from: Math.max(0, from - 0.12), to: Math.min(dur, to + 0.12) };
}

let built = 0;
let skipped = 0;
const failed = [];

for (const [out, inputs] of Object.entries(sources)) {
  const dst = join(OUT, out);
  if (!force && existsSync(dst)) {
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
  const measure = spawnSync(
    FFMPEG,
    ['-hide_banner', '-nostats', ...inputsArgs, '-filter_complex',
      [...pieces, joined, '[j]loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json[out]'].join(';'),
      '-map', '[out]', '-f', 'null', '-'],
    { encoding: 'utf8' }
  ).stderr;
  const m = JSON.parse(measure.slice(measure.lastIndexOf('{'), measure.lastIndexOf('}') + 1) || '{}');
  const norm =
    m.input_i && Number.isFinite(Number(m.input_i))
      ? `loudnorm=I=-16:TP=-1.5:LRA=11:linear=true:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}`
      : 'anull';

  const args = ['-v', 'error', '-y', ...inputsArgs,
    '-filter_complex', [...pieces, joined, `[j]${norm}[out]`].join(';'),
    '-map', '[out]',
    '-ar', '44100', '-ac', '1', '-b:a', '64k',
    '-map_metadata', '-1',
    dst,
  ];

  const r = spawnSync(FFMPEG, args, { encoding: 'utf8' });
  if (r.status !== 0 || !existsSync(dst) || statSync(dst).size < 1000) {
    failed.push(`${out}: ${(r.stderr || 'empty output').trim().split('\n').pop()}`);
    continue;
  }
  built++;
  if (built % 25 === 0) console.log(`  ${built} built…`);
}

console.log(`\nBuilt ${built}, kept ${skipped} existing, ${failed.length} failed.`);
for (const f of failed) console.log(`  FAILED ${f}`);
process.exit(failed.length ? 1 : 0);
