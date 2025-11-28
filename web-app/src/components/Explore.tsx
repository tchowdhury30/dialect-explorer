import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { categories } from '../data/phrases';
import { CategoryCard } from './CategoryCard';
import { PhraseCard } from './PhraseCard';
import { PhraseDetail } from './PhraseDetail';
import { ArrowLeft } from 'lucide-react';
import { Phrase } from '../types';

interface ExploreProps {
  phrases: Phrase[];
  onPhraseUpdate: (phrase: Phrase) => void;
  currentDialect: 'Egyptian' | 'Levantine';
}

export function Explore({ phrases, onPhraseUpdate, currentDialect }: ExploreProps) {
  const dialectColors = {
    Egyptian: {
      bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      light: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-200',
    },
    Levantine: {
      bg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      light: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-200',
    },
  };
  
  const colors = dialectColors[currentDialect];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null);

  const categoryPhrases = selectedCategory
    ? phrases.filter((p) => p.category === selectedCategory)
    : [];

  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    phrases.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return categories.map((c) => ({
      ...c,
      phraseCount: counts[c.id] || 0,
    }));
  }, [phrases]);

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

  if (selectedCategory) {
    const category = categories.find((c) => c.id === selectedCategory);
    
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-gray-900">{category?.name}</h2>
            <p className="text-sm text-gray-500">{categoryPhrases.length} phrases</p>
          </div>
        </div>

        {/* Phrase List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {categoryPhrases.map((phrase) => (
            <PhraseCard
              key={phrase.id}
              phrase={phrase}
              onClick={() => handlePhraseClick(phrase)}
              onBookmarkToggle={(e) => {
                e.stopPropagation();
                handleBookmarkToggle(phrase);
              }}
              currentDialect={currentDialect}
            />
          ))}
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h2 className="text-gray-900">Explore Categories</h2>
        <p className="text-sm text-gray-500">Choose a situation to learn phrases</p>
      </div>

      {/* Category Grid */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {categoriesWithCounts.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <CategoryCard
              category={category}
              phraseCount={category.phraseCount}
              onClick={() => setSelectedCategory(category.id)}
              currentDialect={currentDialect}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
