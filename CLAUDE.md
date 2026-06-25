# World Peas — Project Guide

## Quick Start

```bash
cd web-app
npm install
npm run dev          # localhost:3000
npm run typecheck    # TypeScript errors
npm run lint         # ESLint warnings/errors
```

**Expo mobile:** `cd expo-app && npx expo start` (or `expo start --web` for web preview)

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind + shadcn/ui + Framer Motion
- **Mobile:** Expo + React Native (simpler, older version)
- **Audio:** Supabase Storage (jordanian/ bucket, public, 970 mp3 files)
- **Data:** Supabase (free tier, currently ~122 MB audio)
- **Dialects:** Egyptian (text-only for now), Levantine/Jordanian (4 native speakers with real audio)

## Project State

- **Web app:** Production-ready UI with real 153-phrase Jordanian audio (Habib, Ghaina, Halad, Salim)
- **Expo app:** Simpler prototype with placeholder data, not synced with web
- **Audio:** 970 files on Supabase (1 failed during last upload: SHC_126_Track3.mp3)
- **Next:** Polish for funding pitch demo, then add Egyptian audio

## Files & Folders

```
web-app/
  src/
    components/    UI tabs: Explore, Search, Bookmarks, Settings, Culture, onboarding
    data/phrases.ts    153 Jordanian phrases, 4 speakers, maps to Supabase audio
    hooks/useAudioPlayer.ts   Speaker cycling, playback, error recovery
    lib/supabase.ts    Supabase client + getAudioUrl()
    types/index.ts     Phrase, VoiceSample, Category types
  .env              VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (add to .env.local for dev)
  package.json      eslint, typescript, vite scripts added in this session

expo-app/          Simpler mobile version (older, not synced)
Audios/             970 mp3 files locally (Habib Ghaina, Halad Salim folders)
audio-manifest.json Whisper transcriptions of all audio
```

## Commands

```bash
# Dev
npm run dev           # Vite dev server, hot reload
npm run build         # Production build → build/

# Validation (run before commits)
npm run typecheck     # tsc --noEmit, catches TS errors
npm run lint          # ESLint, catches bugs + purity issues

# Supabase audio re-upload (if needed)
cd ..
SUPABASE_URL=https://wfxjcjvjfeppsbxvdlkn.supabase.co \
SUPABASE_SERVICE_KEY=<service-key> \
node upload-audio.mjs
```

## AI Tools & Skills (from "my ai tools" notebook)

### Use `nlm` CLI for research phases
```bash
nlm notebook create "Egyptian Dialect UX Research"
nlm alias set eg-ux <uuid>
nlm add url eg-ux <url>
nlm notebook query eg-ux "What's the best UX for multiple dialect speakers?"
nlm report create eg-ux && nlm download report eg-ux
```
**Why:** Synthesize research before coding new features (phrases, UX decisions).

### Use `nano-banana-2` skill for promo graphics
```bash
# After skill installed: ~/.claude/skills/nano-banana-2
# Generate app store screenshots, promo images, demo videos
# Gemini 3.1 Flash: 4 resolutions, 14 aspect ratios, draft-iterate-final workflow
```
**Why:** Funding pitch needs polished visuals. Auto-generate from CLI.

### Use `open-design` for UI design variations (optional)
- 142+ design systems, 259+ skills
- Generates web/desktop/mobile prototypes, slides, images, videos
- Export HTML/PDF/PPTX/MP4
- **Use for:** Testing multiple UI layouts for dialect switcher, speaker selection, bookmark UX
- **When:** After MVP demo, if iterating on design before launch

### Use `chrome-devtools MCP` for audio debugging
- Already installed in `~/.claude.json`
- Use when audio doesn't play: see console errors, 404s, CORS issues, auth state
- Pair with `playwright CLI` for e2e testing

### Don't use (overkill for this scope)
- `M2C1` orchestration — only if adding 5+ major features
- `branch-and-prune` — only if testing radical design variants
- `graphify` — only if codebase gets huge (currently ~1K LOC)

## Validation Workflow

```
1. Make code changes
2. npm run typecheck  ← fix TS errors
3. npm run lint       ← fix linting errors
4. npm run dev        ← test in browser
5. git add + commit   ← conventional commit format
6. /security-review   ← before pushing user-facing or auth features
7. Push & open PR
```

## Known Issues

- **SHC_126_Track3.mp3** failed during upload (Gateway Timeout) — re-upload if needed
- **Egyptian audio** — text-only until audio arrives from researcher
- **Expo app** — out of sync with web app, simpler version
- **Mobile responsive** — web app uses `max-w-md mx-auto`, Expo needed for real mobile

## For Teammates

Share only:
- `web-app/` folder
- `.env` with anon key (NOT service key)
- This CLAUDE.md

Audio files are on Supabase, no need to copy `Audios/` locally.

## Links

- Supabase: https://wfxjcjvjfeppsbxvdlkn.supabase.co (project "sook")
- NotebookLM research: "my ai tools" notebook in your NotebookLM account
- Figma designs: embedded in web-app/src/assets/ (from Figma export)
