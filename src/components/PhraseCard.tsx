import { motion } from 'motion/react';
import { Phrase } from '../types';
import { Bookmark, Sparkles, Play } from 'lucide-react';

interface PhraseCardProps {
  phrase: Phrase;
  onClick: () => void;
  onBookmarkToggle: (e: React.MouseEvent) => void;
  currentDialect: 'Egyptian' | 'Levantine';
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
  const dialectEntry = phrase.dialects.find((d) => d.name === currentDialect);

  const displayLine = dialectEntry?.transliteration || phrase.fushaTransliteration;

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full bg-white rounded-xl p-5 shadow-sm border-2 border-gray-200 ${colors.border} ${colors.bg} transition-all text-left relative overflow-hidden group`}
    >
      {/* Decorative corner accent */}
      <div className={`absolute top-0 right-0 w-20 h-20 ${currentDialect === 'Egyptian' ? 'bg-amber-100' : 'bg-indigo-100'} rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity -mr-10 -mt-10`} />
      
      <div className="relative">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-start gap-2 mb-2">
              <p className="text-gray-900 flex-1">{phrase.english}</p>
              {phrase.timesQueried > 0 && (
                <span className={`text-xs px-2 py-1 ${colors.bookmarkBg} ${colors.text} rounded-full flex items-center gap-1`}>
                  <Sparkles className="w-3 h-3" />
                  {phrase.timesQueried}
                </span>
              )}
            </div>
            <p className={`${colors.text} text-sm`}>
              {displayLine}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                alert(`Play ${currentDialect} audio for "${phrase.english}" (placeholder)`);
              }}
              className={`p-2 rounded-xl ${colors.bookmarkBg} ${colors.text} transition-colors`}
              aria-label="Play audio"
            >
              <Play className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBookmarkToggle}
              className={`p-2 rounded-xl transition-colors ${
                phrase.isBookmarked ? colors.bookmarkBg : 'hover:bg-gray-100'
              }`}
            >
              <Bookmark
                className={`w-5 h-5 ${
                  phrase.isBookmarked
                    ? colors.bookmark
                    : 'text-gray-400'
                }`}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
