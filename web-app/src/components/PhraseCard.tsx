import { ReactNode } from 'react';
import { Bookmark } from 'lucide-react';
import { DialectId, Phrase, PhraseState } from '../types';
import { viewFor } from '../lib/phrase';
import { VoiceButton } from './VoiceButton';
import { Pill } from './Pill';

interface PhraseCardProps {
  phrase: Phrase;
  dialect: DialectId;
  state: PhraseState;
  /** Position in the current list, printed as the entry number. */
  index: number;
  onOpen: () => void;
  onToggleBookmark: () => void;
  footer?: ReactNode;
}

/**
 * An entry in the phrasebook.
 *
 * Typographic hierarchy carries this, not boxes: a numbered kicker line with
 * the English set small and muted, the Arabic given the largest size and the
 * most leading, and the transliteration as an italic caption beneath it. The
 * voices sit below a hairline, like a credit line.
 */
export function PhraseCard({
  phrase,
  dialect,
  state,
  index,
  onOpen,
  onToggleBookmark,
  footer,
}: PhraseCardProps) {
  const view = viewFor(phrase, dialect);

  return (
    /* Not a <button>: it contains buttons. The English line is the control and
       stretches across the entry via a pseudo-element. */
    <article className="relative border-b border-line bg-card px-[22px] pb-[21px] pt-5">
      <div className="flex items-baseline gap-3">
        <span className="pt-0.5 text-[0.59375rem] tabular-nums tracking-[0.14em] text-ink-soft">
          {String(index + 1).padStart(2, '0')}
        </span>

        <button
          type="button"
          onClick={onOpen}
          className="flex-1 text-left after:absolute after:inset-0 after:content-['']"
        >
          <span className="block text-[0.9375rem] leading-snug tracking-[-0.008em] text-ink-muted">
            {phrase.english}
          </span>
        </button>

        <button
          type="button"
          onClick={onToggleBookmark}
          aria-pressed={state.isBookmarked}
          aria-label={state.isBookmarked ? 'Remove bookmark' : 'Bookmark this phrase'}
          className={`relative z-10 -mr-1 shrink-0 p-1 transition-colors ${
            state.isBookmarked ? 'text-brand' : 'text-ink-soft hover:text-brand'
          }`}
        >
          <Bookmark className="h-[0.9375rem] w-[0.9375rem]" fill={state.isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <p
        dir="rtl"
        lang="ar"
        className={`mt-3.5 text-[1.9375rem] leading-[1.95] ${
          view.isFallback ? 'text-ink-muted' : 'text-ink'
        }`}
      >
        {view.arabic}
      </p>

      <p className="mt-1.5 text-[0.78125rem] italic tracking-[0.015em] text-ink-soft">
        {view.transliteration}
      </p>

      {view.isFallback ? (
        <div className="mt-[17px] border-l border-brand py-0.5 pl-[11px]">
          <Pill tone="accent" className="mb-1">
            MSA
          </Pill>
          <p className="text-[0.71875rem] italic leading-relaxed text-ink-soft">
            Modern Standard Arabic — dialect recording coming
          </p>
        </div>
      ) : view.samples.length > 0 ? (
        <div className="mt-[17px] flex flex-wrap items-center border-t border-line pt-[13px]">
          {view.samples.map((sample) => (
            <VoiceButton key={sample.speaker} sample={sample} phraseId={phrase.id} />
          ))}
        </div>
      ) : null}

      {footer && <div className="relative z-10 mt-3">{footer}</div>}
    </article>
  );
}

/** The run of entries. Ruled, not stacked — no gaps between entries. */
export function PhraseList({ children }: { children: ReactNode }) {
  return <div className="border-t border-line">{children}</div>;
}
