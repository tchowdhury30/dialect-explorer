#!/usr/bin/env python3
"""
Transcribes all audio files in the Audios folder using local Whisper.
Outputs audio-manifest.json mapping each file to its transcription.
"""

import os
import json
import re
from pathlib import Path

import whisper

AUDIO_ROOT = Path(__file__).parent / "Audios"
OUTPUT = Path(__file__).parent / "audio-manifest.json"
MODEL_SIZE = "small"  # small = fast + decent Arabic; use "medium" for better accuracy

def parse_filename(filename: str) -> dict:
    """Extract prefix, phrase number, and track number from filename."""
    stem = Path(filename).stem
    # e.g. "HGC_39_Track 2" or "H#onlyC_135_Track 10"
    m = re.match(r"^(.+?)_(\d+)_Track\s*(\d+)$", stem)
    if not m:
        return None
    return {
        "prefix": m.group(1),
        "phrase_num": int(m.group(2)),
        "track_num": int(m.group(3)),
    }

def speaker_from_prefix(prefix: str, folder: str) -> str:
    """Best-guess speaker label from prefix + folder."""
    is_habib_ghaina = "Habib" in folder
    is_halad_salim = "Halad" in folder

    if "#only" in prefix or "only#" in prefix:
        first_letter = prefix[0].upper()
        if is_habib_ghaina:
            return "Habib" if first_letter == "H" else "Ghaina"
        else:
            return "Halad" if first_letter == "H" else "Salim"
    elif "Days" in prefix:
        first_letter = prefix[0].upper()
        if is_habib_ghaina:
            return "Habib" if first_letter == "H" else "Ghaina"
        else:
            return "Halad" if first_letter == "H" else "Salim"
    elif "Agressive" in prefix or "nonagressive" in prefix:
        return "Habib+Ghaina"
    else:
        if is_habib_ghaina:
            return "Habib+Ghaina"
        else:
            return "Halad+Salim"

def main():
    print(f"Loading Whisper '{MODEL_SIZE}' model...")
    model = whisper.load_model(MODEL_SIZE)
    print("Model loaded.\n")

    results = []
    all_files = []

    for folder in sorted(AUDIO_ROOT.iterdir()):
        if not folder.is_dir():
            continue
        for f in sorted(folder.glob("*.mp3")):
            parsed = parse_filename(f.name)
            if parsed:
                all_files.append((folder.name, f, parsed))

    total = len(all_files)
    print(f"Found {total} files to transcribe.\n")

    for i, (folder_name, filepath, parsed) in enumerate(all_files, 1):
        print(f"[{i}/{total}] {folder_name}/{filepath.name}", end=" ... ", flush=True)
        try:
            result = model.transcribe(str(filepath), language="ar", fp16=False)
            text = result["text"].strip()
            print(text[:60])
        except Exception as e:
            text = f"ERROR: {e}"
            print(text)

        results.append({
            "file": f"{folder_name}/{filepath.name}",
            "phrase_num": parsed["phrase_num"],
            "track_num": parsed["track_num"],
            "prefix": parsed["prefix"],
            "speaker": speaker_from_prefix(parsed["prefix"], folder_name),
            "folder": folder_name,
            "transcript": text,
        })

    # Group by phrase number
    by_phrase = {}
    for r in results:
        num = r["phrase_num"]
        if num not in by_phrase:
            by_phrase[num] = []
        by_phrase[num].append(r)

    manifest = {
        "total_files": total,
        "by_phrase": {str(k): v for k, v in sorted(by_phrase.items())},
        "all_files": results,
    }

    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print(f"\nDone! Manifest written to {OUTPUT}")

if __name__ == "__main__":
    main()
