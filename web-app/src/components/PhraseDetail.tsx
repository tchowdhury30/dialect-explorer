import { Phrase } from '../types';
import { X, Bookmark, Volume2, Copy } from 'lucide-react';
import { useState } from 'react';

interface PhraseDetailProps {
  phrase: Phrase;
  onClose: () => void;
  onBookmarkToggle: () => void;
}

export function PhraseDetail({ phrase, onClose, onBookmarkToggle }: PhraseDetailProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handlePlayAudio = (dialectName: string) => {
    // Placeholder for audio playback
    console.log(`Playing audio for ${phrase.english} in ${dialectName}`);
    alert(`Audio playback for ${dialectName} dialect\n(Feature coming soon)`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-lg max-h-[90vh] overflow-y-auto rounded-t-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-gray-900">Phrase Details</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onBookmarkToggle}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bookmark
                className={`w-6 h-6 ${
                  phrase.isBookmarked
                    ? 'fill-emerald-600 text-emerald-600'
                    : 'text-gray-400'
                }`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* English */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">English</p>
                <p className="text-gray-900">{phrase.english}</p>
              </div>
              <button
                onClick={() => handleCopy(phrase.english, 'English')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
              >
                <Copy className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            {copiedText === 'English' && (
              <p className="text-emerald-600 text-sm mt-2">Copied!</p>
            )}
          </div>

          {/* Fusha (Modern Standard Arabic) */}
          <div className="space-y-3">
            <h3 className="text-gray-900">Modern Standard Arabic (Fusha)</h3>
            
            <div className="bg-emerald-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Arabic Script</p>
                  <p className="text-gray-900 text-xl" dir="rtl">{phrase.fushaArabic}</p>
                </div>
                <button
                  onClick={() => handleCopy(phrase.fushaArabic, 'Fusha Arabic')}
                  className="p-2 hover:bg-emerald-100 rounded transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              {copiedText === 'Fusha Arabic' && (
                <p className="text-emerald-600 text-sm">Copied!</p>
              )}
              
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Transliteration</p>
                  <p className="text-gray-700">{phrase.fushaTransliteration}</p>
                </div>
                <button
                  onClick={() => handleCopy(phrase.fushaTransliteration, 'Fusha Trans')}
                  className="p-2 hover:bg-emerald-100 rounded transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              {copiedText === 'Fusha Trans' && (
                <p className="text-emerald-600 text-sm">Copied!</p>
              )}
            </div>
          </div>

          {/* Dialects */}
          <div className="space-y-3">
            <h3 className="text-gray-900">Dialects</h3>
            
            {phrase.dialects.map((dialect, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-emerald-700">{dialect.name}</h4>
                  <button
                    onClick={() => handlePlayAudio(dialect.name)}
                    className="flex items-center gap-2 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm">Play</span>
                  </button>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Arabic Script</p>
                    <p className="text-gray-900 text-xl" dir="rtl">{dialect.arabicScript}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(dialect.arabicScript, `${dialect.name} Arabic`)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                {copiedText === `${dialect.name} Arabic` && (
                  <p className="text-emerald-600 text-sm">Copied!</p>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Transliteration</p>
                    <p className="text-gray-700">{dialect.transliteration}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(dialect.transliteration, `${dialect.name} Trans`)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                {copiedText === `${dialect.name} Trans` && (
                  <p className="text-emerald-600 text-sm">Copied!</p>
                )}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              Times accessed: <span className="text-gray-900">{phrase.timesQueried}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
