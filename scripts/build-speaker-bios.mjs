#!/usr/bin/env node
/** Build the three Egyptian introductions from the supplied bio recording.
 * Usage: node scripts/build-speaker-bios.mjs <path-to-Bios_.wav>
 * Set FFMPEG if ffmpeg is not on PATH. The checksum prevents replacing these
 * voices with a different recording that happens to have the same name.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = process.argv[2];
const expected = '3147f4f1e3c667e243deff56c70d66bff045991036991a42aaaafe8e5edef9fe';
if (!source || !existsSync(source)) {
  console.error('Usage: node scripts/build-speaker-bios.mjs <path-to-Bios_.wav>');
  process.exit(1);
}
const checksum = createHash('sha256').update(readFileSync(source)).digest('hex');
if (checksum !== expected) {
  console.error('Source checksum mismatch; expected the supplied MULTI bio recording.');
  process.exit(1);
}
const out = join(ROOT, 'web-app', 'public', 'audio', 'bios');
mkdirSync(out, { recursive: true });
const versions = {};
for (const [name, from, to] of [
  ['karim', 9.15, 33.55],
  ['omar', 36.30, 46.25],
  ['ali', 47.70, 81.80],
]) {
  const dest = join(out, `${name}.mp3`);
  const args = ['-v', 'error', '-y', '-ss', String(from), '-to', String(to), '-i', source,
    '-af', 'adelay=180:all=1,apad=pad_dur=0.3', '-ar', '44100', '-ac', '1', '-b:a', '64k', '-map_metadata', '-1', dest];
  const result = spawnSync(process.env.FFMPEG || 'ffmpeg', args, { encoding: 'utf8' });
  if (result.error || result.status !== 0) {
    console.error(`Could not build ${name}: ${result.error?.message || result.stderr}`);
    process.exit(1);
  }
  versions[name] = createHash('sha256').update(readFileSync(dest)).digest('hex').slice(0, 12);
}
writeFileSync(join(ROOT, 'web-app', 'src', 'data', 'speaker-bio-versions.json'), JSON.stringify(versions, null, 2) + '\n');
console.log('Built Egyptian speaker introductions.');
