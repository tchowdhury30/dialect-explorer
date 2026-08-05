import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { categories } from '../data/phrases';
import { CategoryCell } from './CategoryCard';
import { PhraseCard, PhraseList } from './PhraseCard';
import { DialectNotice } from './DialectNotice';
import { SectionHead } from './SectionHead';
import { CategoryIcon } from './icons/CategoryIcons';
import { DialectId, Phrase, PhraseState } from '../types';
import { DIALECTS } from '../lib/dialects';
import { BRAND } from '../lib/brand';

interface ExploreProps {
  phrases: Phrase[];
  dialect: DialectId;
  getState: (id: string) => PhraseState;
  onOpenPhrase: (phrase: Phrase) => void;
  onToggleBookmark: (id: string) => void;
}

export function Explore({
  phrases,
  dialect,
  getState,
  onOpenPhrase,
  onToggleBookmark,
}: ExploreProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categoriesWithCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of phrases) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return categories.map((c) => ({ ...c, phraseCount: counts.get(c.id) ?? 0 }));
  }, [phrases]);

  const categoryPhrases = useMemo(
    () => (selectedCategory ? phrases.filter((p) => p.category === selectedCategory) : []),
    [phrases, selectedCategory]
  );

  const config = DIALECTS[dialect];

  if (selectedCategory) {
    const category = categories.find((c) => c.id === selectedCategory);

    return (
      <div className="scroll-clean h-full overflow-y-auto">
        <div className="flex items-center gap-3 px-[22px] pb-[11px] pt-6">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            aria-label="Back to index"
            className="-ml-1 p-1 text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <CategoryIcon category={selectedCategory} className="h-4 w-4 text-brand" />
          <h2 className="flex-1 text-[0.625rem] font-semibold uppercase tracking-[0.24em] text-ink">
            {category?.name}
          </h2>
          <span className="text-[0.59375rem] uppercase tabular-nums tracking-[0.12em] text-ink-soft">
            {categoryPhrases.length} phrases
          </span>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <PhraseList>
            {categoryPhrases.map((phrase, i) => (
              <PhraseCard
                key={phrase.id}
                phrase={phrase}
                dialect={dialect}
                index={i}
                state={getState(phrase.id)}
                onOpen={() => onOpenPhrase(phrase)}
                onToggleBookmark={() => onToggleBookmark(phrase.id)}
              />
            ))}
          </PhraseList>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="scroll-clean h-full overflow-y-auto">
      <SectionHead
        title="Index"
        meta={`${categoriesWithCounts.length} chapters · ${phrases.length} phrases`}
      />

      {/* The one softened edge in the layout — everything else stays ruled. */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-[22px] grid grid-cols-2 overflow-hidden rounded-card border border-line"
      >
        {categoriesWithCounts.map((category, i) => (
          <CategoryCell
            key={category.id}
            category={category}
            phraseCount={category.phraseCount}
            wide={i === categoriesWithCounts.length - 1 && categoriesWithCounts.length % 2 === 1}
            onClick={() => setSelectedCategory(category.id)}
          />
        ))}
      </motion.div>

      {config.audio !== 'available' && (
        <div className="px-[22px] pt-5">
          <DialectNotice dialect={dialect} />
        </div>
      )}

      <SectionHead
        title="Phrases"
        meta={
          config.audio === 'available' ? `${config.variant} · Four voices` : 'Recordings pending'
        }
      />

      <PhraseList>
        {phrases.slice(0, 12).map((phrase, i) => (
          <PhraseCard
            key={phrase.id}
            phrase={phrase}
            dialect={dialect}
            index={i}
            state={getState(phrase.id)}
            onOpen={() => onOpenPhrase(phrase)}
            onToggleBookmark={() => onToggleBookmark(phrase.id)}
          />
        ))}
      </PhraseList>

      <footer className="flex flex-col items-center gap-1.5 px-[22px] pb-8 pt-7 text-center">
        <span lang="ar" dir="rtl" className="text-base text-ink-soft">
          {BRAND.arabic}
        </span>
        <p className="text-[0.59375rem] uppercase leading-relaxed tracking-[0.16em] text-ink-soft">
          {phrases.length} phrases · 4 voices
          <br />
          Recorded in Amman
        </p>
      </footer>
    </div>
  );
}
