import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { PhraseCard } from './PhraseCard';
import { PhraseDetail } from './PhraseDetail';
import { Search as SearchIcon, WifiOff } from 'lucide-react';
import { Phrase } from '../types';

interface SearchProps {
  phrases: Phrase[];
  onPhraseUpdate: (phrase: Phrase) => void;
  downloadedDialects: string[];
  currentDialect: 'Egyptian' | 'Levantine';
}

export function Search({ phrases, onPhraseUpdate, downloadedDialects, currentDialect }: SearchProps) {
  const dialectColors = {
    Egyptian: {
      ring: 'focus:ring-amber-500',
      text: 'text-amber-600',
    },
    Levantine: {
      ring: 'focus:ring-indigo-500',
      text: 'text-indigo-600',
    },
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const filteredPhrases = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    let results = phrases.filter(
      (phrase) =>
        phrase.english.toLowerCase().includes(query) ||
        phrase.fushaArabic.includes(query) ||
        phrase.fushaTransliteration.toLowerCase().includes(query) ||
        phrase.dialects.some(
          (d) =>
            d.arabicScript.includes(query) ||
            d.transliteration.toLowerCase().includes(query)
        )
    );

    // If offline, only show phrases from downloaded dialects
    if (!isOnline && downloadedDialects.length > 0) {
      results = results.filter((phrase) =>
        phrase.dialects.some((d) => downloadedDialects.includes(d.name))
      );
    }

    return results;
  }, [searchQuery, isOnline, downloadedDialects]);

  const handlePhraseClick = (phrase: Phrase) => {
    const updatedPhrase = { ...phrase, timesQueried: phrase.timesQueried + 1 };
    onPhraseUpdate(updatedPhrase);
    setSelectedPhrase(updatedPhrase);
  };

  const handleBookmarkToggle = (phrase: Phrase) => {
    const updatedPhrase = { ...phrase, isBookmarked: !phrase.isBookmarked };
    onPhraseUpdate(updatedPhrase);
    if (selectedPhrase?.id === phrase.id) {
      setSelectedPhrase(updatedPhrase);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h2 className="text-gray-900 mb-3">Search Phrases</h2>
        
        {/* Offline indicator */}
        {!isOnline && (
          <div className="mb-3 bg-orange-100 text-orange-800 p-3 rounded-lg flex items-center gap-2 text-sm">
            <WifiOff className="w-4 h-4 flex-shrink-0" />
            <p>
              {downloadedDialects.length > 0
                ? `Offline mode - Searching in ${downloadedDialects.join(' & ')} only`
                : 'You\'re offline. Download dialects in Settings to use offline search.'}
            </p>
          </div>
        )}
        
        <div className="relative">
          <SearchIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${searchQuery ? dialectColors[currentDialect].text : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search in Arabic, English, or transliteration..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 ${dialectColors[currentDialect].ring} focus:border-transparent transition-all`}
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {!searchQuery.trim() ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <SearchIcon className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-gray-900 mb-2">Search for phrases</h3>
            <p className="text-gray-500">
              Enter Arabic text, English, or transliteration to find phrases
            </p>
          </div>
        ) : filteredPhrases.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <SearchIcon className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm ${dialectColors[currentDialect].text} mb-3`}
            >
              ✨ {filteredPhrases.length} {filteredPhrases.length === 1 ? 'result' : 'results'} found
            </motion.p>
            {filteredPhrases.map((phrase, index) => (
              <motion.div
                key={phrase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PhraseCard
                  phrase={phrase}
                  onClick={() => handlePhraseClick(phrase)}
                  onBookmarkToggle={(e) => {
                    e.stopPropagation();
                    handleBookmarkToggle(phrase);
                  }}
                  currentDialect={currentDialect}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Phrase Detail Modal */}
      {selectedPhrase && (
        <PhraseDetail
          phrase={selectedPhrase}
          onClose={() => setSelectedPhrase(null)}
          onBookmarkToggle={() => {
            handleBookmarkToggle(selectedPhrase);
          }}
        />
      )}
    </div>
  );
}
