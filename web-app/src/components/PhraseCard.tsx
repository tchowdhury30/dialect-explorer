import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Phrase, VoiceSample } from '../types';
import { Bookmark, Sparkles, Play, Loader2 } from 'lucide-react';

interface PhraseCardProps {
  phrase: Phrase;
  onClick: () => void;
  onBookmarkToggle: (e: React.MouseEvent) => void;
  currentDialect: 'Egyptian' | 'Levantine';
}

function SpeakerButton({ sample, colors }: { sample: VoiceSample; colors: { bookmarkBg: string; text: string } }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      return;
    }
    const audio = new Audio(sample.audioUrl);
    audioRef.current = audio;
    audio.onended = () => { setIsPlaying(false); audioRef.current = null; };
    audio.onerror = () => { setIsPlaying(false); audioRef.current = null; };
    setIsPlaying(true);
    try { await audio.play(); } catch { setIsPlaying(false); }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={play}
      className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg ${colors.bookmarkBg} ${colors.text} transition-colors`}
      aria-label={`Play ${sample.speaker}`}
    >
      {isPlaying
        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
        : <Play className="w-3.5 h-3.5" />}
      <span className="text-[9px] leading-none font-medium">{sample.speaker}</span>
    </motion.button>
  );
}

export function PhraseCard({ phrase, onClick, onBookmarkToggle, currentDialect }: PhraseCardProps) {
  const dialectColors = {
    Egyptian: {
      border: 'hover:border-amber-400',
      bg: 'hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50',
      text: 'text-amber-600',
      bookmark: 'fill-amber-600 text-amber-600',
      bookmarkBg: 'bg-amber-100',
    },
    Levantine: {
      border: 'hover:border-indigo-400',
      bg: 'hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50',
      text: 'text-indigo-600',
      bookmark: 'fill-indigo-600 text-indigo-600',
      bookmarkBg: 'bg-indigo-100',
    },
  };

  const colors = dialectColors[currentDialect];
  const dialectEntry = phrase.dialects[0];
  const samples = dialectEntry?.samples ?? [];
  const displayLine = dialectEntry?.transliteration || phrase.fushaTransliteration;

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full bg-white rounded-xl p-4 shadow-sm border-2 border-gray-200 ${colors.border} ${colors.bg} transition-all text-left relative overflow-hidden group`}
    >
      <div className={`absolute top-0 right-0 w-20 h-20 ${currentDialect === 'Egyptian' ? 'bg-amber-100' : 'bg-indigo-100'} rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity -mr-10 -mt-10`} />

      <div className="relative">
        {/* Top row: English + bookmark */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex-1">
            <div className="flex items-start gap-2">
              <p className="text-gray-900 flex-1 text-sm font-medium">{phrase.english}</p>
              {phrase.timesQueried > 0 && (
                <span className={`text-xs px-1.5 py-0.5 ${colors.bookmarkBg} ${colors.text} rounded-full flex items-center gap-1 shrink-0`}>
                  <Sparkles className="w-3 h-3" />
                  {phrase.timesQueried}
                </span>
              )}
            </div>
            <p className={`${colors.text} text-xs mt-0.5`}>{displayLine}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBookmarkToggle}
            className={`p-1.5 rounded-xl transition-colors shrink-0 ${phrase.isBookmarked ? colors.bookmarkBg : 'hover:bg-gray-100'}`}
          >
            <Bookmark className={`w-4 h-4 ${phrase.isBookmarked ? colors.bookmark : 'text-gray-400'}`} />
          </motion.button>
        </div>

        {/* Speaker buttons row */}
        {samples.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {samples.map((sample) => (
              <SpeakerButton key={sample.speaker} sample={sample} colors={colors} />
            ))}
          </div>
        )}
      </div>
    </motion.button>
  );
}
