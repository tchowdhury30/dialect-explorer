import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // use service key for uploads
const AUDIO_ROOT = new URL('./Audios', import.meta.url).pathname;
const BUCKET = 'audio';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_KEY env vars first');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function getAllMp3s(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...getAllMp3s(full));
    } else if (entry.endsWith('.mp3')) {
      files.push(full);
    }
  }
  return files;
}

function storagePathFor(filepath) {
  // Extract phrase number from filename e.g. HGC_39_Track 2.mp3 → 39
  const match = basename(filepath).match(/_(\d+)_Track/);
  const phraseNum = match ? match[1] : 'unknown';
  const folder = filepath.includes('Habib') ? 'habib-ghaina' : 'halad-salim';
  return `jordanian/${folder}/${phraseNum}/${basename(filepath)}`;
}

async function main() {
  const files = getAllMp3s(AUDIO_ROOT);
  console.log(`Uploading ${files.length} files to Supabase bucket '${BUCKET}'...\n`);

  let done = 0;
  let failed = 0;

  for (const filepath of files) {
    const storagePath = storagePathFor(filepath);
    const fileBuffer = readFileSync(filepath);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: 'audio/mpeg',
        upsert: true,
      });

    if (error) {
      console.error(`FAILED: ${storagePath} — ${error.message}`);
      failed++;
    } else {
      done++;
      if (done % 50 === 0) console.log(`[${done}/${files.length}] uploaded...`);
    }
  }

  console.log(`\nDone. ${done} uploaded, ${failed} failed.`);
}

main();
