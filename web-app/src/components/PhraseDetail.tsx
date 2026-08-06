import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Bookmark, Check, Copy, MicOff, X } from 'lucide-react';
import { DialectId, Phrase, PhraseState } from '../types';
import { DIALECTS } from '../lib/dialects';
import { viewFor } from '../lib/phrase';
import { VoiceButton } from './VoiceButton';
import { Pill } from './Pill';
import { useAudio } from '../lib/audio';

interface PhraseDetailProps {
  phrase: Phrase;
  dialect: DialectId;
  state: PhraseState;
  onClose: () => void;
  onToggleBookmark: () => void;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
        } catch {
          // Clipboard is unavailable over plain http or without permission.
        }
      }}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-surface hover:text-ink"
    >
      {copied ? (
        <Check className="h-4 w-4 text-brand" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}

export function PhraseDetail({
  phrase,
  dialect,
  state,
  onClose,
  onToggleBookmark,
}: PhraseDetailProps) {
  const view = viewFor(phrase, dialect);
  const config = DIALECTS[dialect];
  const { stop } = useAudio();
  const closeRef = useRef<HTMLButtonElement>(null);

  // Stop playback when the sheet closes, so audio never outlives its context.
  useEffect(() => stop, [stop]);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-[2px] sm:items-center sm:p-6"
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${phrase.english} — phrase details`}
          initial={{ y: '4%', opacity: 0.6 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '4%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-2xl bg-card shadow-sheet sm:max-w-lg sm:rounded-2xl"
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <Pill tone={view.isFallback ? 'muted' : 'accent'}>
              {view.variant ?? 'Modern Standard Arabic'}
            </Pill>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onToggleBookmark}
                aria-pressed={state.isBookmarked}
                aria-label={state.isBookmarked ? 'Remove bookmark' : 'Bookmark this phrase'}
                className={`rounded-lg p-2 transition-colors ${
                  state.isBookmarked ? 'text-brand' : 'text-ink-soft hover:text-ink'
                }`}
              >
                <Bookmark
                  className="h-5 w-5"
                  fill={state.isBookmarked ? 'currentColor' : 'none'}
                />
              </button>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-surface hover:text-ink"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="scroll-clean flex-1 overflow-y-auto">
            {/* Hero: the phrase itself, sized to be readable at arm's length. */}
            <div className="border-b border-line bg-brand-softer px-6 py-7">
              <p className="text-sm text-ink-muted">{phrase.english}</p>
              <p
                dir="rtl"
                lang="ar"
                className="mt-3 text-right text-[2rem] leading-[1.7] text-ink"
              >
                {view.arabic}
              </p>
              <p className="mt-1 text-lg font-medium text-brand-ink">{view.transliteration}</p>

              {view.isFallback ? (
                <div className="mt-5 flex items-start gap-2.5 rounded-card border border-line bg-card p-3.5">
                  <MicOff className="mt-0.5 h-4 w-4 shrink-0 text-ink-soft" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-ink-muted">
                    {config.audioNote ??
                      `${config.label} recordings are not published yet.`}
                  </p>
                </div>
              ) : view.samples.length > 0 ? (
                <div className="mt-5">
                  <p className="mb-1 text-[0.59375rem] font-semibold uppercase tracking-[0.2em] text-ink-soft">
                    Voices
                  </p>
                  <div className="flex flex-wrap items-center border-t border-line pt-3">
                    {view.samples.map((sample) => (
                      <VoiceButton key={sample.speaker} sample={sample} phraseId={phrase.id} />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-5 text-sm text-ink-soft">
                  No recording for this phrase yet.
                </p>
              )}
            </div>

            <div className="space-y-1 p-5">
              <Row label="English" value={phrase.english} />
              {!view.isFallback && (
                <>
                  <Row
                    label={`${view.variant} script`}
                    value={view.arabic}
                    arabic
                  />
                  <Row label={`${view.variant} transliteration`} value={view.transliteration} />
                </>
              )}
              <Row label="Modern Standard Arabic" value={phrase.fushaArabic} arabic />
              <Row label="MSA transliteration" value={phrase.fushaTransliteration} />
            </div>

            <div className="border-t border-line px-5 py-4 text-xs text-ink-soft">
              Viewed {state.timesQueried} {state.timesQueried === 1 ? 'time' : 'times'} ·{' '}
              {phrase.category}
            </div>
          </div>
        </motion.div>
      </motion.div>
  );
}

function Row({ label, value, arabic = false }: { label: string; value: string; arabic?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface">
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wide text-ink-soft">{label}</p>
        {arabic ? (
          <p dir="rtl" lang="ar" className="mt-0.5 truncate text-right text-lg text-ink">
            {value}
          </p>
        ) : (
          <p className="mt-0.5 truncate text-ink">{value}</p>
        )}
      </div>
      <CopyButton text={value} label={label} />
    </div>
  );
}
