import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, Clock, Mic } from 'lucide-react';
import { DialectId } from '../types';
import { DIALECTS, DIALECT_IDS } from '../lib/dialects';
import { Logo } from './Logo';
import { DialectFlag } from './icons/DialectFlag';

interface OnboardingDialogProps {
  onSelectDialect: (dialect: DialectId) => void;
  /** Lets the accent colour follow the highlighted choice before committing. */
  onPreviewDialect: (dialect: DialectId) => void;
}

export function OnboardingDialog({ onSelectDialect, onPreviewDialect }: OnboardingDialogProps) {
  const [selected, setSelected] = useState<DialectId | null>(null);

  const choose = (dialect: DialectId) => {
    setSelected(dialect);
    onPreviewDialect(dialect);
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface p-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size="lg" />
          <p lang="ar" dir="rtl" className="mt-7 text-2xl text-ink-muted">
            أهلاً وسهلاً
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
            Everyday Arabic for travellers — the way people actually speak it, not the textbook
            version.
          </p>
        </div>

        <fieldset className="space-y-3">
          <legend className="sr-only">Choose a dialect</legend>

          {DIALECT_IDS.map((id) => {
            const config = DIALECTS[id];
            const isSelected = selected === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => choose(id)}
                aria-pressed={isSelected}
                className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-brand bg-brand-softer shadow-lift'
                    : 'border-line bg-card shadow-card hover:border-brand-line'
                }`}
              >
                <DialectFlag dialect={id} size={34} className="mt-0.5" />

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="font-semibold text-ink">{config.label} Arabic</span>
                    <span lang="ar" dir="rtl" className="text-sm text-ink-soft">
                      {config.nativeName}
                    </span>
                  </span>

                  <span className="mt-1 block text-xs leading-relaxed text-ink-soft">
                    {config.region}
                  </span>

                  <span className="mt-2.5 inline-flex items-center gap-1.5 text-[0.6875rem] font-medium">
                    {config.audio === 'available' ? (
                      <>
                        <Mic className="h-3 w-3 text-brand" aria-hidden="true" />
                        <span className="text-brand-ink">
                          Native {config.variant} recordings
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3 text-ink-soft" aria-hidden="true" />
                        <span className="text-ink-soft">Recordings in production</span>
                      </>
                    )}
                  </span>
                </span>

                {isSelected && (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand">
                    <Check className="h-3.5 w-3.5 text-on-brand" aria-hidden="true" />
                  </span>
                )}
              </button>
            );
          })}
        </fieldset>

        <button
          type="button"
          onClick={() => selected && onSelectDialect(selected)}
          disabled={!selected}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-3.5 font-semibold text-on-brand transition-opacity disabled:cursor-not-allowed disabled:opacity-35"
        >
          Start learning
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>

        <p className="mt-4 text-center text-xs text-ink-soft">
          You can switch dialects any time in Settings.
        </p>
      </motion.div>
    </div>
  );
}
