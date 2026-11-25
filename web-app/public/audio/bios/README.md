# Speaker introduction recordings

The app contains original speaker audio, not synthesized voices. Portraits are shown only when an existing photograph is available. Machine-drafted transcripts are not included in the app until a person verifies them against the audio.

## Egyptian introductions

Source: `MULTI/Ali, Omar, Karim /Ali, Omar, Karim Bios /Ali, Omar, Karim Bios_.wav` from the supplied archive, SHA-256 `3147f4f1e3c667e243deff56c70d66bff045991036991a42aaaafe8e5edef9fe`. Source offsets were selected using word-timestamped ASR; they should still receive a listening review.

| Speaker | Source interval | Output |
| --- | --- | --- |
| Karim | 9.15–33.55 s | `karim.mp3` |
| Omar | 36.30–46.25 s | `omar.mp3` |
| Ali | 47.70–81.80 s | `ali.mp3` |

Rebuild with `node scripts/build-speaker-bios.mjs <path-to-Bios_.wav>`, setting `FFMPEG` if needed. It validates the source checksum and writes version hashes to `src/data/speaker-bio-versions.json`, so the service worker can fetch revised audio.

## Jordanian introductions

Salim and Khalid introduce themselves in recordings from `MULTI/FOLDER05`. Their source paths, checksums, and offsets are in `scripts/audio-sources.json`; they are built by `scripts/build-audio.mjs` like the other phrase recordings. Both self-name, and their source intervals also match the existing speaker-reference embeddings. These clips have not been manually transcribed.
