# Sook Sout — Project Guide

## Quick Start

```bash
cd web-app
npm install
npm run dev          # port 3000 is often taken by another project
                     # on this machine — use `npm run dev -- --port 5180`
                     # and open 127.0.0.1, not localhost (IPv4/IPv6 clash)
npm run typecheck    # TypeScript errors
npm run lint         # ESLint warnings/errors
```

**Expo mobile:** `cd expo-app && npx expo start` (or `expo start --web` for web preview)

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind + shadcn/ui + Framer Motion
- **Mobile:** Expo + React Native (simpler, older version)
- **Audio:** Bundled static mp3s in `web-app/public/audio/` (~9 MB, same-origin,
  service-worker cached; ranges sliced from the cached file). Supabase is no longer used — the old project was
  paused/deleted and its host stopped resolving (Nov 2026).
- **Dialects:** Levantine/Jordanian (Habib, Ghaina, Khalid, Salim), Egyptian/Cairene
  (Mario, Karim, Omar, Ali — 145 of 148 phrases; the rest fall back to MSA with a notice)

## Project State

- **Web app:** Redesigned UI with real 153-phrase Jordanian audio (Habib, Ghaina, Halad, Salim)
- **Expo app:** Simpler prototype with placeholder data, not synced with web
- **Audio pipeline:** raw takes live in `Audios/` (gitignored; Drive download).
  `scripts/audio-sources.json` maps each app clip → raw take(s);
  `node scripts/build-audio.mjs` trims silence, loudness-normalises, joins
  multi-take clips (counting) and writes `web-app/public/audio/{jo,eg}/<speaker>/<NNN>.mp3`.
  A source can be `{file, from, to}` to cut a span out of a long uncut session.
  Trimming is relative to each clip's own peak (a fixed gate ate soft onsets);
  loudness is two-pass linear; each clip gets short fades plus 180 ms of
  silence before and 300 ms after (many raw takes start/stop exactly on a word,
  and phones swallow the first moment of playback). A clip rebuilds when its
  sources or the pipeline change (hashes in `scripts/audio-built.json`); the
  app appends each hash to the clip URL (`src/data/audio-versions.json`,
  `clipUrl`) so a rebuilt clip is never served stale from a phone cache.
  Commit the built mp3s and audio-built.json. `--force` rebuilds all.
- **Egyptian:** `data/egyptian.ts` — wording drafted from Whisper transcripts of
  the takes themselves, NOT yet native-speaker reviewed. Each phrase lists only
  the voices whose take says exactly the wording shown.
  - Mario: `Audios/Mario/` — sets are "English prompt take, then Egyptian take(s)".
  - Karim, Omar, Ali: `Audios/MULTI/Ali, Omar, Karim /` — long uncut sessions
    (prompt, then each speaker in turn). Split on silence, transcribed per
    utterance, speakers identified with SpeechBrain ECAPA against their recorded
    bios (14/14 on held-out bio clips), takes hand-picked; the chosen spans are
    the `{file, from, to}` entries in audio-sources.json. `Extra.wav` is them
    talking about the dialect in English (Culture-tab material, unused).
  - Never present Jordanian wording or audio as Egyptian.
- **Next:** native review of Egyptian text; Mario's portrait; speaker bios (recorded in `Ali, Omar, Karim Bios_.wav`)
- **Contact form:** `components/Contact.tsx` posts to Netlify Forms (static
  form named `contact` in index.html). Form detection must be enabled in the
  Netlify dashboard; submissions show under Forms there.
- **Playback speed:** Normal / Slow (0.75) / Slower (0.5), pitch preserved,
  remembered per device (`lib/audio.tsx`).

## Design Direction

Cute and animated: "the souk at dusk, with Bisbis". Chosen by the owner in
Nov 2026 over the earlier editorial look. Keep to it:

- **Bisbis (بسبس), the street-cat guide** (`components/art/Bisbis.tsx`). She
  sits on the awning on Home, peeks over sheets and category pages, naps on an
  empty Saved tab, and talks along (`talking`) whenever audio plays.
- **Dusk souk** (`art/DuskHero.tsx`, `art/Souk.tsx`): swaying lanterns,
  twinkling stars, stall skyline. The sky colours are per-dialect variables
  (`--sky-1..3` in index.css): Egyptian dusk orange, Jordanian evening teal.
- **Every category is its own place**, with colours in
  `lib/categoryThemes.ts` (applied as `--cat*` CSS vars via `themeVars()`) and
  an animated scene in `art/CategoryArt.tsx`: the ahwa, a food cart, the
  pyramids (Petra for Jordanian), a taxi at dusk (white in Cairo, yellow in
  Amman), a train, a market scale, a pharmacy. Cards, voice chips and the
  phrase sheet pick up the category's colours.
- **Soft, round, tactile**: `rounded-card` (22px), solid "sticker" drop
  shadows (`shadow-card`), Fredoka for display, Nunito for body, Noto Naskh
  for Arabic, Reem Kufi for the wordmark.
- **Motion everywhere, but CSS-first**: keyframes live in index.css
  (`anim-*`), and the reduced-motion rule turns them all off.
- **Arabic is still the biggest thing on every card.**
- **No emoji.** All art is inline SVG.
- Levantine is shown as **Jordanian** everywhere (`DIALECTS[id].name`); the
  stored settings value stays 'Levantine' for old saves.

## Files & Folders

```
web-app/
  src/
    index.css       Design system: tokens, dark mode, per-dialect accents.
                    Real Tailwind v4 build via @tailwindcss/vite — do NOT
                    hand-edit generated CSS; new utility classes just work.
    components/     Explore, Search, Bookmarks, Culture, Settings, onboarding,
                    PhraseCard, PhraseDetail, SpeakerChip, DialectNotice
    components/icons/  CategoryIcons (24px grid, 1.5 stroke, currentColor) and
                    DialectFlag (SVG — flag emoji do not render on Windows).
                    No emoji anywhere in app source; keep it that way.
    components/Logo.tsx  Stacked lockup: سوق صوت in Reem Kufi over the Latin
    lib/brand.ts       Name, Arabic wordmark, taglines — single source of truth
  public/
    manifest.webmanifest  PWA metadata; icons/ holds the Reem Kufi marks whose
                    outlines were extracted from the real font via HarfBuzz —
                    never hand-draw Arabic as SVG paths, the joins break.
    sw.js           Hand-written service worker. navigation=network-first,
                    /assets/*=cache-first (content-hashed), mp3=cache-first
                    (capped). Bump VERSION to purge caches on next visit.
    components/SpeakerAvatar.tsx  Deterministic geometric avatar per speaker name
    data/phrases.ts    148 phrases; each carries DialectEntry[] keyed by dialectId
    data/egyptian.ts   Egyptian entries (Mario), merged into phrases.ts
    lib/dialects.ts    DIALECTS registry — single source of truth for a dialect's
                       name, flag, region, and audio status. Add a dialect here
                       plus a 5-line accent block in index.css.
    lib/audio.tsx      AudioProvider: one <audio> for the app, tracks failures
    lib/phrase.ts      entryFor / viewFor — MSA fallback when a dialect has no entry
    lib/storage.ts     User state only (bookmarks, view counts, folders), keyed
                       by phrase id; migrates the old whole-corpus blob once
    types/index.ts     Phrase, DialectEntry, VoiceSample, PhraseState, Category
    components/ui/     Unused shadcn dump — nothing imports it, not bundled
  package.json      eslint, typescript, vite scripts added in this session

expo-app/          Simpler mobile version (older, not synced)
Audios/             raw takes (Habib Ghaina, Halad Salim, Mario) — gitignored
scripts/            audio-sources.json + build-audio.mjs (see Audio pipeline)
```

## Commands

```bash
# Dev
npm run dev           # Vite dev server, hot reload
npm run build         # Production build → build/

# Validation (run before commits)
npm run typecheck     # tsc --noEmit, catches TS errors
npm run lint          # ESLint, catches bugs + purity issues

# Rebuild audio after changing scripts/audio-sources.json (needs ffmpeg)
cd .. && node scripts/build-audio.mjs
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

- **Egyptian wording** — machine-drafted, needs a native speaker pass
- **HGC_05_Track 1–6** are uncut 9.5-minute session recordings (phrase 5 is not in the app)
- **Expo app** — out of sync with web app, simpler version
- **Mobile responsive** — web app uses `max-w-md mx-auto`, Expo needed for real mobile

## For Teammates

Share only:
- `web-app/` folder
- This CLAUDE.md

Built audio is in the repo; `Audios/` is only needed to rebuild clips.

## Links

- NotebookLM research: "my ai tools" notebook in your NotebookLM account
- Figma designs: embedded in web-app/src/assets/ (from Figma export)
