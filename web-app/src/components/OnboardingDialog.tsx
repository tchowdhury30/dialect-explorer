import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, Clock, Mic } from 'lucide-react';
import { DialectId } from '../types';
import { DIALECTS, DIALECT_IDS } from '../lib/dialects';
import { Logo } from './Logo';
import { Bisbis } from './art/Bisbis';
import { Lantern, LanternString, Stars } from './art/Souk';
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
    <div className="flex min-h-dvh flex-col bg-surface">
      <div
        className="safe-top relative h-72 shrink-0 overflow-hidden"
        style={{ background: 'linear-gradient(var(--sky-1) 0%, var(--sky-2) 55%, var(--sky-3) 100%)' }}
      >
        <Stars />
        <LanternString />
        <Lantern color="terracotta" style={{ left: '14%', top: 18 }} />
        <Lantern color="teal" style={{ left: '40%', top: 30, animationDelay: '-1s' }} />
        <Lantern color="saffron" style={{ left: '64%', top: 28, animationDuration: '3s' }} />
        <Lantern color="rose" style={{ left: '86%', top: 16, animationDelay: '-2s' }} />
        <div className="anim-bubble absolute bottom-32 left-1/2 ml-[-9.5rem] max-w-[11rem] rounded-[18px_18px_18px_4px] bg-white px-3.5 py-2 font-display text-sm font-medium text-ink shadow-float" style={{ transformOrigin: '0 100%' }}>
          <span lang="ar" dir="rtl" className="block text-lg font-bold text-brand">
            أهلاً وسهلاً!
          </span>
          I'm Bisbis. Which Arabic are you learning?
        </div>
        <Bisbis pose="sit" className="absolute bottom-0 left-1/2 w-36 translate-x-[10%] translate-y-6" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26, delay: 0.2 }}
        className="relative -mt-6 w-full flex-1 rounded-t-[1.75rem] bg-surface px-5 pb-8 pt-6 sm:mx-auto sm:max-w-md"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo size="md" />
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Everyday Arabic for travellers, the way people actually speak it, recorded by real
            voices in Cairo and Amman.
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
                className={`press flex w-full items-start gap-4 rounded-card p-4 text-left shadow-card ${
                  isSelected ? 'bg-brand-soft ring-2 ring-brand' : 'bg-card'
                }`}
              >
                <DialectFlag dialect={id} size={34} className="mt-0.5" />

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="font-display text-lg font-semibold text-ink">{config.name} Arabic</span>
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
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-3.5 font-display text-lg font-semibold text-on-brand shadow-[0_3px_0_rgba(0,0,0,0.2)] transition active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35"
        >
          Yalla, let's go
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>

        <p className="mt-4 text-center text-xs text-ink-soft">
          You can switch dialects any time in Settings.
        </p>
      </motion.div>
    </div>
  );
}
