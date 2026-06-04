#!/bin/bash
# Merges individual number/day tracks into single audio files
# Then uploads them to Supabase with safe names

FFMPEG="/opt/homebrew/bin/ffmpeg"
AUDIO="/Users/bigga/cs/dialect-explorer/Audios"
OUT="/Users/bigga/cs/dialect-explorer/Audios/merged"
mkdir -p "$OUT"

merge() {
  local folder="$1"
  local prefix="$2"
  local filenum="$3"
  local start_track="$4"
  local end_track="$5"
  local out_name="$6"

  local inputs=""
  local filter=""
  local count=0

  for t in $(seq $start_track $end_track); do
    local f="$folder/${prefix}_${filenum}_Track ${t}.mp3"
    if [ -f "$f" ]; then
      inputs="$inputs -i \"$f\""
      filter="${filter}[${count}:a]"
      count=$((count + 1))
    fi
  done

  if [ $count -eq 0 ]; then
    echo "SKIP: no files found for $prefix $filenum"
    return
  fi

  local outfile="$OUT/$out_name"
  eval "$FFMPEG -y $inputs -filter_complex \"${filter}concat=n=${count}:v=0:a=1[out]\" -map \"[out]\" \"$outfile\"" 2>/dev/null
  echo "  ✓ $out_name ($count tracks)"
}

echo "Merging Habib (H#onlyC)..."
merge "$AUDIO/Habib Ghaina Conversation " "H#onlyC" "135" 2 11 "HonlyC_135_merged.mp3"
merge "$AUDIO/Habib Ghaina Conversation " "H#onlyC" "136" 2 11 "HonlyC_136_merged.mp3"
merge "$AUDIO/Habib Ghaina Conversation " "H#onlyC" "137" 1 10 "HonlyC_137_merged.mp3"
merge "$AUDIO/Habib Ghaina Conversation " "HDaysC"  "138" 2  8 "HDaysC_138_merged.mp3"

echo "Merging Ghaina (G#onlyC)..."
merge "$AUDIO/Habib Ghaina Conversation " "G#onlyC" "135" 2 11 "GonlyC_135_merged.mp3"
merge "$AUDIO/Habib Ghaina Conversation " "G#onlyC" "136" 2 11 "GonlyC_136_merged.mp3"
merge "$AUDIO/Habib Ghaina Conversation " "G#onlyC" "137" 2 11 "GonlyC_137_merged.mp3"
merge "$AUDIO/Habib Ghaina Conversation " "GDaysC"  "138" 2  8 "GDaysC_138_merged.mp3"

echo "Merging Halad (Honly#C)..."
merge "$AUDIO/Halad Salim Conversation" "Honly#C" "135" 2 11 "HalonlyC_135_merged.mp3"
merge "$AUDIO/Halad Salim Conversation" "Honly#C" "136" 2 11 "HalonlyC_136_merged.mp3"
merge "$AUDIO/Halad Salim Conversation" "Honly#C" "137" 2 10 "HalonlyC_137_merged.mp3"
merge "$AUDIO/Halad Salim Conversation" "HonlydaysC" "138" 2 8 "HalonlydaysC_138_merged.mp3"

echo "Merging Salim (Sonly#C)..."
merge "$AUDIO/Halad Salim Conversation" "Sonly#C" "136" 2 11 "SalonlyC_136_merged.mp3"
merge "$AUDIO/Halad Salim Conversation" "Sonly#C" "137" 2 11 "SalonlyC_137_merged.mp3"
merge "$AUDIO/Halad Salim Conversation" "SonlydaysC" "138" 2 8 "SalonlydaysC_138_merged.mp3"

echo ""
echo "Done. Files in $OUT:"
ls -lh "$OUT/"
