import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Play } from 'lucide-react';
import { categories } from '../data/phrases';
import { PhraseCard, PhraseList } from './PhraseCard';
import { DialectNotice } from './DialectNotice';
import { GrowCard } from './Contact';
import { DialectId, Phrase, PhraseState } from '../types';
import { DIALECTS } from '../lib/dialects';
import { voicesFor, voiceCount } from '../lib/speakers';
import { viewFor } from '../lib/phrase';
import { themeFor, themeVars } from '../lib/categoryThemes';
import { useAudio } from '../lib/audio';
import { BRAND } from '../lib/brand';
import { DuskHero } from './art/DuskHero';
import { Bisbis } from './art/Bisbis';
import { CategoryScene, CategorySticker } from './art/CategoryArt';

interface ExploreProps {
  phrases: Phrase[];
  dialect: DialectId;
  getState: (id: string) => PhraseState;
  onOpenPhrase: (phrase: Phrase) => void;
  onToggleBookmark: (id: string) => void;
  onDialectChange: (dialect: DialectId) => void;
  onOpenSettings: () => void;
  onOpenContact: () => void;
}

export function Explore({
  phrases,
  dialect,
  getState,
  onOpenPhrase,
  onToggleBookmark,
  onDialectChange,
  onOpenSettings,
  onOpenContact,
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
    return (
      <CategoryPage
        category={selectedCategory}
        dialect={dialect}
        phrases={categoryPhrases}
        getState={getState}
        onBack={() => setSelectedCategory(null)}
        onOpenPhrase={onOpenPhrase}
        onToggleBookmark={onToggleBookmark}
      />
    );
  }

  return (
    <div className="scroll-clean h-full overflow-y-auto">
      <DuskHero dialect={dialect} onDialectChange={onDialectChange} onOpenSettings={onOpenSettings} />

      <div className="relative -mt-5 rounded-t-[1.75rem] bg-surface px-4 pb-6 pt-5 lg:mx-auto lg:max-w-7xl lg:px-10 lg:pt-8">
        <PhraseOfTheDay phrases={phrases} dialect={dialect} onOpen={onOpenPhrase} />

        {config.audio !== 'available' && (
          <div className="pt-4">
            <DialectNotice dialect={dialect} />
          </div>
        )}

        <div className="mb-3 mt-6 flex items-baseline justify-between px-1">
          <h2 className="font-display text-lg font-semibold text-ink">Where to?</h2>
          <span className="text-xs font-semibold text-ink-soft">{phrases.length} phrases</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-4">
          {categoriesWithCounts.map((category, i) => (
            <motion.button
              key={category.id}
              type="button"
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24, delay: 0.15 + i * 0.05 }}
              onClick={() => setSelectedCategory(category.id)}
              style={themeVars(category.id)}
              className={`press flex items-center gap-2.5 rounded-card bg-card py-2.5 pl-2 pr-3 text-left shadow-card lg:py-5 lg:pl-4 ${
                i === categoriesWithCounts.length - 1 && categoriesWithCounts.length % 2 === 1 ? 'col-span-2 lg:col-span-1' : ''
              }`}
            >
              <CategorySticker category={category.id} className="h-11 w-11 shrink-0" />
              <span className="min-w-0">
                <span className="block truncate font-display text-[0.9375rem] font-semibold text-ink">
                  {category.name}
                </span>
                <span className="block text-[0.6875rem] font-semibold text-cat-ink">
                  {category.phraseCount} phrases
                </span>
              </span>
            </motion.button>
          ))}
        </div>

        <div className="mt-6">
          <GrowCard onOpen={onOpenContact} />
        </div>

        <footer className="flex flex-col items-center gap-1 pb-4 pt-7 text-center">
          <span lang="ar" dir="rtl" className="font-kufi text-lg text-brand">
            {BRAND.arabic}
          </span>
          <p className="text-xs font-semibold text-ink-soft">
            {voiceCount(voicesFor(dialect).length)} · recorded in {config.recordedIn}
          </p>
        </footer>
      </div>
    </div>
  );
}

/** A phrase picked by date, so it changes daily but is the same all day. */
function PhraseOfTheDay({
  phrases,
  dialect,
  onOpen,
}: {
  phrases: Phrase[];
  dialect: DialectId;
  onOpen: (p: Phrase) => void;
}) {
  const { play, activeId, status } = useAudio();
  const phrase = useMemo(() => {
    const voiced = phrases.filter((p) => viewFor(p, dialect).samples.length > 0);
    if (!voiced.length) return null;
    const day = Math.floor(Date.now() / 86_400_000);
    return voiced[day % voiced.length];
  }, [phrases, dialect]);
  if (!phrase) return null;

  const view = viewFor(phrase, dialect);
  const sample = view.samples[0];
  const id = `${phrase.id}:${sample.speaker}`;
  const playing = activeId === id && status === 'playing';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26, delay: 0.1 }}
      style={themeVars(phrase.category)}
      className="relative flex items-center gap-3 rounded-card px-4 py-3.5 shadow-card"
    >
      <div className="absolute inset-0 rounded-card bg-gradient-to-br from-cat-soft to-card" aria-hidden="true" />
      <button type="button" onClick={() => onOpen(phrase)} className="relative min-w-0 flex-1 text-left">
        <span className="block font-display text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-cat-ink">
          Phrase of the day
        </span>
        <span lang="ar" dir="rtl" className="block truncate text-right text-2xl font-bold leading-[1.6] text-ink">
          {view.arabic}
        </span>
        <span className="block truncate text-[0.8125rem] text-ink-muted">{view.english}</span>
      </button>
      <motion.button
        type="button"
        whileTap={{ scale: 0.9, y: 2 }}
        onClick={() => play(id, sample.audioUrl)}
        aria-label={playing ? `Stop ${sample.speaker}` : `Hear ${sample.speaker} say it`}
        className={`relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cat text-white shadow-[0_3px_0_rgba(0,0,0,0.18)] ${
          playing ? 'playing-ring' : ''
        }`}
      >
        {playing ? (
          <span className="inline-flex h-3.5 items-end gap-[2px]" aria-hidden="true">
            <i className="eq-bar-lg" />
            <i className="eq-bar-lg" />
            <i className="eq-bar-lg" />
          </span>
        ) : (
          <Play className="ml-0.5 h-5 w-5" fill="currentColor" aria-hidden="true" />
        )}
      </motion.button>
    </motion.div>
  );
}

function CategoryPage({
  category,
  dialect,
  phrases,
  getState,
  onBack,
  onOpenPhrase,
  onToggleBookmark,
}: {
  category: string;
  dialect: DialectId;
  phrases: Phrase[];
  getState: (id: string) => PhraseState;
  onBack: () => void;
  onOpenPhrase: (p: Phrase) => void;
  onToggleBookmark: (id: string) => void;
}) {
  const theme = themeFor(category);
  const { status } = useAudio();
  const name = categories.find((c) => c.id === category)?.name ?? theme.title;

  return (
    <div className="scroll-clean h-full overflow-y-auto bg-cat-soft" style={themeVars(category)}>
      <div className="safe-top relative h-48 overflow-hidden">
        <CategoryScene category={category} dialect={dialect} className="absolute inset-0 h-full w-full" />
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to all categories"
          className="absolute left-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow-[0_3px_0_rgba(0,0,0,0.15)] transition active:scale-90"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="relative -mt-6 rounded-t-[1.75rem] bg-cat-soft px-5 pb-3 pt-5 lg:mx-auto lg:max-w-7xl lg:px-10">
        <Bisbis pose="peek" talking={status === 'playing'} className="absolute -top-[3.4rem] right-5 w-20" />
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p lang="ar" className="font-kufi text-base text-cat-ink">
            {theme.arabic}
          </p>
          <h2 className="font-display text-2xl font-semibold leading-tight text-ink">{name}</h2>
          <p className="mt-0.5 text-sm text-ink-muted">
            {theme.tagline} · {phrases.length} phrases
          </p>
        </motion.div>
      </div>

      <PhraseList>
        {phrases.map((phrase, i) => (
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
    </div>
  );
}
