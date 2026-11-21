import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { DialectId, Phrase, PhraseState } from '../types';
import { viewFor } from '../lib/phrase';
import { themeVars } from '../lib/categoryThemes';
import { VoiceButton } from './VoiceButton';
import { HeartButton } from './HeartButton';
import { CategorySticker } from './art/CategoryArt';

interface PhraseCardProps {
  phrase: Phrase;
  dialect: DialectId;
  state: PhraseState;
  /** Position in the current list; staggers the pop-in. */
  index: number;
  onOpen: () => void;
  onToggleBookmark: () => void;
  footer?: ReactNode;
  /** Show the category sticker (lists that mix categories, like Search). */
  showCategory?: boolean;
}

/**
 * A phrase as a soft card in its category's colours: English kicker, big
 * Arabic, transliteration, then the voices as tappable face chips.
 */
export function PhraseCard({
  phrase,
  dialect,
  state,
  index,
  onOpen,
  onToggleBookmark,
  footer,
  showCategory = false,
}: PhraseCardProps) {
  const view = viewFor(phrase, dialect);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26, delay: Math.min(index, 8) * 0.045 }}
      style={themeVars(phrase.category)}
      className="relative rounded-card bg-card px-4 pb-4 pt-3.5 shadow-card"
    >
      <div className="flex items-start gap-2.5">
        {showCategory && <CategorySticker category={phrase.category} className="mt-0.5 h-7 w-7 shrink-0" />}

        {/* Not a <button> wrapper: the card contains buttons. The English line
            is the control and stretches over the card via a pseudo-element. */}
        <button
          type="button"
          onClick={onOpen}
          className="flex-1 pt-1 text-left font-display text-[0.9375rem] font-medium leading-snug text-cat-ink after:absolute after:inset-0 after:rounded-card after:content-['']"
        >
          {view.english}
        </button>

        <HeartButton saved={state.isBookmarked} onToggle={onToggleBookmark} label={`“${view.english}”`} size="sm" />
      </div>

      <p
        dir="rtl"
        lang="ar"
        className={`mt-1.5 text-[1.875rem] font-semibold leading-[1.8] ${view.isFallback ? 'text-ink-muted' : 'text-ink'}`}
      >
        {view.arabic}
      </p>

      <p className="text-[0.875rem] italic text-ink-muted">{view.transliteration}</p>

      {view.isFallback ? (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink-soft">
          Standard Arabic · dialect recording coming
        </p>
      ) : view.samples.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {view.samples.map((sample) => (
            <VoiceButton key={sample.speaker} sample={sample} phraseId={phrase.id} />
          ))}
        </div>
      ) : null}

      {footer && <div className="relative z-10 mt-3">{footer}</div>}
    </motion.article>
  );
}

/** The run of cards. */
export function PhraseList({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 px-4 pb-6 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-4 lg:px-10 xl:grid-cols-3">{children}</div>;
}
