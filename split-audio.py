#!/usr/bin/env python3
"""
Splits and cleans audio files into individual speaker clips.

Naming logic:
  Prefix first letter = which speaker goes FIRST in track order
  GHC_ → Track 2 = Ghaina, Track 3 = Habib
  HGC_ → Track 2 = Habib,  Track 3 = Ghaina
  HSC_ → Track 2 = Halad,  Track 3 = Salim
  SHC_ → Track 2 = Salim,  Track 3 = Halad
  H#onlyC / Honly#C / HGConly → single speaker (Habib or Halad depending on folder)
  G#onlyC / GHonlyC          → single speaker (Ghaina)
  Sonly#C / SonlydaysC       → single speaker (Salim)

Output: Audios/clean/{phraseNum}/{speaker}.mp3
"""

import os
import re
import shutil
import subprocess
from pathlib import Path

AUDIO_ROOT = Path(__file__).parent / "Audios"
OUT_ROOT   = Path(__file__).parent / "Audios" / "clean"
FFMPEG     = "/opt/homebrew/bin/ffmpeg"

# Which track number maps to which speaker for each prefix
TRACK_SPEAKER_MAP = {
    "GHC":              {2: "ghaina",  3: "habib"},
    "HGC":              {2: "habib",   3: "ghaina"},
    "HSC":              {2: "halad",   3: "salim"},
    "SHC":              {2: "salim",   3: "halad"},
    "GDaysC":           {2: "ghaina",  3: "habib"},
    "HDaysC":           {2: "habib",   3: "ghaina"},
    "HonlydaysC":       {2: "halad"},
    "SonlydaysC":       {2: "salim"},
    "HGCAgressive":     {2: "habib",   3: "ghaina"},
    "HGCnonagressive":  {2: "habib",   3: "ghaina"},
    # solo tracks
    "H#onlyC":          {None: "habib"},
    "G#onlyC":          {None: "ghaina"},
    "GHonlyC":          {None: "ghaina"},
    "Honly#C":          {None: "halad"},
    "Sonly#C":          {None: "salim"},
}

def parse_filename(name: str):
    stem = Path(name).stem
    m = re.match(r"^(.+?)_(\d+)_Track\s*(\d+)$", stem)
    if m:
        return m.group(1), int(m.group(2)), int(m.group(3))
    return None, None, None

def trim_silence(src: Path, dst: Path):
    """Copy file, trimming leading silence (>500ms of < -40dB)."""
    dst.parent.mkdir(parents=True, exist_ok=True)
    result = subprocess.run([
        FFMPEG, "-y", "-i", str(src),
        "-af", "silenceremove=start_periods=1:start_duration=0.05:start_threshold=-40dB",
        str(dst)
    ], capture_output=True)
    if result.returncode != 0:
        # Fallback: just copy without trimming
        shutil.copy2(src, dst)

def process():
    done = 0
    skipped = 0

    for folder in sorted(AUDIO_ROOT.iterdir()):
        if not folder.is_dir() or folder.name == "clean":
            continue

        for f in sorted(folder.glob("*.mp3")):
            prefix, phrase_num, track_num = parse_filename(f.name)
            if not prefix or not phrase_num:
                continue

            mapping = TRACK_SPEAKER_MAP.get(prefix)
            if not mapping:
                print(f"  UNKNOWN PREFIX: {prefix} — {f.name}")
                skipped += 1
                continue

            # Solo tracks use None key
            if None in mapping:
                speaker = mapping[None]
            else:
                speaker = mapping.get(track_num)
                if not speaker:
                    skipped += 1
                    continue  # e.g. Track 4 repeat — skip

            out_path = OUT_ROOT / str(phrase_num) / f"{speaker}.mp3"

            # Don't overwrite a file we already wrote (first speaker wins)
            if out_path.exists():
                skipped += 1
                continue

            print(f"  [{phrase_num:03d}] {speaker:8s} ← {folder.name}/{f.name}")
            trim_silence(f, out_path)
            done += 1

    print(f"\n✓ {done} clips exported to {OUT_ROOT}")
    print(f"  {skipped} skipped (duplicates, unknown prefix, or extra takes)")

if __name__ == "__main__":
    OUT_ROOT.mkdir(parents=True, exist_ok=True)
    process()
