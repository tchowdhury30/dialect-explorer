#!/usr/bin/env node
/**
 * Builds the app's audio from the raw recordings.
 *
 *   node scripts/build-audio.mjs            # only missing outputs
 *   node scripts/build-audio.mjs --force    # rebuild everything
 *
 * Reads scripts/audio-sources.json — { "<output path>": ["<raw file>", ...] },
 * raw paths relative to Audios/ — and writes web-app/public/audio/<output path>.
 *
 * For each clip:
 *   - several sources (counting, days) are joined in order
 *   - leading and trailing silence is cut, so playback starts on the first word
 *   - loudness is normalised (many raw takes peak near -28 dB, which is too
 *     quiet to hear on a phone speaker in the street)
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

// Cut silence quieter than -45 dB at both ends, keeping 60 ms of air so the
// first consonant is not clipped. areverse trims the tail with the same filter.
const TRIM =
  'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,' +
  'areverse,' +
  'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.12,' +
  'areverse';
const NORMALISE = 'loudnorm=I=-16:TP=-1.5:LRA=11';

let built = 0;
let skipped = 0;
const failed = [];

for (const [out, inputs] of Object.entries(sources)) {
  const dst = join(OUT, out);
  if (!force && existsSync(dst)) {
    skipped++;
    continue;
  }

  const missing = inputs.filter((f) => !existsSync(join(RAW, f)));
  if (missing.length) {
    failed.push(`${out}: missing ${missing.join(', ')}`);
    continue;
  }

  mkdirSync(dirname(dst), { recursive: true });

  const args = ['-v', 'error', '-y'];
  for (const f of inputs) args.push('-i', join(RAW, f));

  // Trim each piece before joining, so the gaps between counted numbers are
  // natural pauses rather than whatever the recorder left running.
  const pieces = inputs.map((_, i) => `[${i}:a]aformat=channel_layouts=mono,${TRIM}[p${i}]`);
  const join_ =
    inputs.length > 1
      ? `${inputs.map((_, i) => `[p${i}]`).join('')}concat=n=${inputs.length}:v=0:a=1[j];[j]${NORMALISE}[out]`
      : `[p0]${NORMALISE}[out]`;
  args.push(
    '-filter_complex', [...pieces, join_].join(';'),
    '-map', '[out]',
    '-ar', '44100', '-ac', '1', '-b:a', '64k',
    '-map_metadata', '-1',
    dst
  );

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
