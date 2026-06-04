import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getAudioUrl(phraseNum: number, filename: string): string {
  const { data } = supabase.storage
    .from('audio')
    .getPublicUrl(`jordanian/${phraseNum}/${filename}`);
  return data.publicUrl;
}
