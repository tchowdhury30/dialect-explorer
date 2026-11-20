import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Copy, MicOff, Turtle, X } from 'lucide-react';
import { DialectId, Phrase, PhraseState } from '../types';
import { DIALECTS } from '../lib/dialects';
import { viewFor } from '../lib/phrase';
import { themeFor, themeVars } from '../lib/categoryThemes';
import { RATES, useAudio } from '../lib/audio';
import { VoiceButton } from './VoiceButton';
import { HeartButton } from './HeartButton';
import { Bisbis } from './art/Bisbis';
import { CategoryScene } from './art/CategoryArt';

interface PhraseDetailProps {
  phrase: Phrase;
  dialect: DialectId;
  state: PhraseState;
  onClose: () => void;
  onToggleBookmark: () => void;
}

function useCopied() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Clipboard is unavailable over plain http or without permission.
    }
  };
  return { copied, copy };
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const { copied, copy } = useCopied();
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className="rounded-full p-2 text-ink-soft transition-colors hover:bg-surface hover:text-ink"
    >
      {copied ? (
        <Check className="h-4 w-4 text-cat" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}

/** Speed: normal, slow, slower. Pitch is kept, so slow speech sounds natural. */
function SpeedControl() {
  const { rate, setRate } = useAudio();
  return (
    <div className="mt-4 flex items-center gap-2">
      <Turtle className="h-4 w-4 text-cat-ink" aria-hidden="true" />
      <span className="font-display text-sm font-semibold text-ink-muted">Speed</span>
      <div role="radiogroup" aria-label="Playback speed" className="ml-auto flex gap-1 rounded-full bg-card p-1 shadow-card">
        {RATES.map((r) => (
          <button
            key={r}
            type="button"
            role="radio"
            aria-checked={rate === r}
            onClick={() => setRate(r)}
            className={`rounded-full px-3 py-1 font-display text-sm font-semibold transition ${
              rate === r ? 'bg-cat text-white' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {r === 1 ? 'Normal' : r === 0.75 ? 'Slow' : 'Slower'}
          </button>
        ))}
      </div>
    </div>
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
  const theme = themeFor(phrase.category);
  const { stop, status } = useAudio();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { copied, copy } = useCopied();

  // Stop playback when the sheet closes, so audio never outlives its context.
  useEffect(() => stop, [stop]);

  // The parent passes a new onClose each render; read it through a ref so the
  // effect below runs once per open and focus is not yanked back to Close
  // every time something (a bookmark toggle) re-renders the app.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, []);

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { delay },
  });

  return (
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={themeVars(phrase.category)}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-[2px] sm:items-center sm:p-6"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${view.english} — phrase details`}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90vh] w-full flex-col rounded-t-[1.75rem] bg-surface shadow-float sm:max-w-lg sm:rounded-[1.75rem]"
      >
        {/* The category's scene as a strip across the top, with Bisbis
            peeking over the edge. She talks along while a voice plays. */}
        <div className="relative h-24 shrink-0 overflow-hidden rounded-t-[1.75rem]">
          <CategoryScene category={phrase.category} dialect={dialect} className="absolute inset-0 h-full w-full" />
        </div>
        <Bisbis
          pose="peek"
          talking={status === 'playing'}
          className="pointer-events-none absolute right-6 top-[2.1rem] z-10 w-[5.5rem]"
        />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute left-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink shadow-[0_2px_0_rgba(0,0,0,0.15)] transition active:scale-90"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="scroll-clean relative -mt-4 flex-1 overflow-y-auto rounded-t-[1.5rem] bg-surface px-5 pb-6 pt-5">
          <span className="inline-flex rounded-full bg-cat-soft px-3 py-1 font-display text-xs font-semibold text-cat-ink">
            {theme.title} · {view.variant ?? 'Standard Arabic'}
          </span>

          <motion.p {...rise(0.15)} className="mt-3 font-display text-base font-medium text-cat-ink">
            {view.english}
          </motion.p>
          <motion.p
            {...rise(0.22)}
            dir="rtl"
            lang="ar"
            className="mt-1 text-right text-[2.25rem] font-bold leading-[1.6] text-ink"
          >
            {view.arabic}
          </motion.p>
          <motion.p {...rise(0.28)} className="text-lg italic text-ink-muted">
            {view.transliteration}
          </motion.p>

          {view.isFallback ? (
            <div className="mt-5 flex items-start gap-2.5 rounded-card bg-card p-3.5 shadow-card">
              <MicOff className="mt-0.5 h-4 w-4 shrink-0 text-ink-soft" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-ink-muted">
                {config.audioNote ?? `${config.name} recordings are not published yet.`}
              </p>
            </div>
          ) : view.samples.length > 0 ? (
            <motion.div {...rise(0.34)}>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {view.samples.map((sample) => (
                  <VoiceButton key={sample.speaker} sample={sample} phraseId={phrase.id} />
                ))}
              </div>
              <SpeedControl />
            </motion.div>
          ) : (
            <p className="mt-5 text-sm text-ink-soft">No recording for this phrase yet.</p>
          )}

          <dl className="mt-5 rounded-card bg-card px-2 shadow-card">
            {view.isLocalised && <Row label="Original phrase" value={phrase.english} />}
            <Row label="Modern Standard Arabic" value={phrase.fushaArabic} arabic />
            <Row label="MSA transliteration" value={phrase.fushaTransliteration} />
          </dl>

          <div className="mt-4 flex gap-3">
            <HeartButton saved={state.isBookmarked} onToggle={onToggleBookmark} label="this phrase" withText />
            <button
              type="button"
              onClick={() => copy(view.arabic)}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-cat font-display font-semibold text-white shadow-[0_3px_0_rgba(0,0,0,0.18)] transition active:translate-y-0.5"
            >
              {copied ? <Check className="h-5 w-5" aria-hidden="true" /> : <Copy className="h-5 w-5" aria-hidden="true" />}
              {copied ? 'Copied' : 'Copy Arabic'}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-ink-soft">
            Viewed {state.timesQueried} {state.timesQueried === 1 ? 'time' : 'times'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Row({ label, value, arabic = false }: { label: string; value: string; arabic?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b-2 border-dashed border-line px-2 py-2.5 last:border-b-0">
      <div className="min-w-0 flex-1">
        <dt className="text-xs font-bold text-ink-soft">{label}</dt>
        {arabic ? (
          <dd dir="rtl" lang="ar" className="mt-0.5 truncate text-right text-lg text-ink">
            {value}
          </dd>
        ) : (
          <dd className="mt-0.5 truncate text-ink">{value}</dd>
        )}
      </div>
      <CopyButton text={value} label={label} />
    </div>
  );
}
