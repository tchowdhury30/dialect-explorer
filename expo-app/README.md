# Dialect Explorer (Expo)

## Sun Dec 21 Log
- Dialect-aware theming across the app (warm amber for Egyptian, cool indigo for Levantine).
- Explore/Search/Bookmarks with compact phrase cards and phrase detail (voice samples per dialect).
- Culture screen with speaker profiles (modal) and blog tiles (modal reader).
- Settings tab with dialect selection, offline download toggles (placeholder), and info cards.
- Onboarding screen that asks for a dialect on first launch.

## Proposed backend stack (Supabase + optional AWS)
- **Supabase Postgres** for metadata  
  - `dialects` (id, name, code, accent_color, order)  
  - `phrases` (id, category_id, english, fusha_arabic, fusha_translit, context, is_active, updated_at)  
  - `phrase_dialects` (id, phrase_id, dialect_id, arabic_script, transliteration)  
  - `voice_samples` (id, phrase_dialect_id, speaker_id, title, audio_url, duration_s, updated_at)  
  - `speakers` (id, name, dialect_id, role, bio, avatar_url)  
  - `blog_posts` (id, title, excerpt, body_richtext/json, dialect_id, tag, image_url, published_at)  
  - Optional: `content_versions` to signal client refresh.

- **Storage for audio/images**  
  - Option A: Supabase Storage (simpler).  
  - Option B: AWS S3 + CloudFront (if you already run AWS).  
  - Pathing: `audio/{dialect}/{phraseId}/{sampleId}.mp3`, `avatars/{speakerId}.png`, `blog_images/{postId}.jpg`.  
  - Public read for smooth UX; signed URLs if you need tighter control.

## Client data flow (Expo)
- **Metadata fetch** from Supabase REST/GraphQL; cache locally (AsyncStorage/SQLite) with a `content_version`. Check version on app start; refresh if newer.
- **Streaming** uses the remote audio_url directly.
- **Offline download per dialect** (hook to Settings toggles):
  1) Query `voice_samples` for the chosen dialect.  
  2) Download each audio file to `expo-file-system`, e.g. `FileSystem.documentDirectory/audio/{dialect}/{sampleId}.mp3`.  
  3) Save a manifest (sampleId -> localPath + version) in AsyncStorage/SQLite.  
  4) Playback checks manifest first; falls back to streaming.  
  5) Removing a dialect deletes the local folder and manifest entries.
- **Images**: prefetch lazily or download alongside audio for full offline.

## Next steps
- Wire the app to Supabase (client + fetch/cache layer).
- Implement the download manager and hook it to Settings toggles.
- Replace placeholder text/audio/blog content with real data from Supabase.
- Add gradients/patterns from the reference mocks once assets are ready.
