import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const AUDIO_ROOT = new URL('./Audios', import.meta.url).pathname;
const BUCKET = 'audio';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function getAllHashFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...getAllHashFiles(full));
    } else if (entry.includes('#') && entry.endsWith('.mp3')) {
      files.push(full);
    }
  }
  return files;
}

function safeStoragePath(filepath) {
  const match = basename(filepath).match(/_(\d+)_Track/);
  const phraseNum = match ? match[1] : 'unknown';
  const folder = filepath.includes('Habib') ? 'habib-ghaina' : 'halad-salim';
  // Replace # with nothing
  const safeName = basename(filepath).replace(/#/g, '');
  return `jordanian/${folder}/${phraseNum}/${safeName}`;
}

async function main() {
  const files = getAllHashFiles(AUDIO_ROOT);
  console.log(`Re-uploading ${files.length} files with # in name (using safe filenames)...\n`);

  let done = 0, failed = 0;
  for (const filepath of files) {
    const storagePath = safeStoragePath(filepath);
    const fileBuffer = readFileSync(filepath);
    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, fileBuffer, {
      contentType: 'audio/mpeg',
      upsert: true,
    });
    if (error) {
      console.error(`FAILED: ${storagePath} — ${error.message}`);
      failed++;
    } else {
      done++;
      if (done % 20 === 0) console.log(`[${done}/${files.length}] uploaded...`);
    }
  }
  console.log(`\nDone. ${done} uploaded, ${failed} failed.`);
}

main();
