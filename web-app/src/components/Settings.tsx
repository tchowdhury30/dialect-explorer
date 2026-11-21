import { ReactNode } from 'react';
import {
  Check,
  ChevronLeft,
  Clock,
  Turtle,
  Monitor,
  Moon,
  Sun,
} from 'lucide-react';
import { DialectId, ThemePreference } from '../types';
import { DIALECTS, DIALECT_IDS } from '../lib/dialects';
import { BRAND } from '../lib/brand';
import { DialectFlag } from './icons/DialectFlag';
import { SpeakerAvatar } from './SpeakerAvatar';
import { speakersFor, voiceCount } from '../lib/speakers';
import { RATES, useAudio } from '../lib/audio';
import { GrowCard } from './Contact';

interface SettingsProps {
  dialect: DialectId;
  theme: ThemePreference;
  onDialectChange: (dialect: DialectId) => void;
  onThemeChange: (theme: ThemePreference) => void;
  onClose: () => void;
  onOpenContact: () => void;
}

const THEMES: Array<{ id: ThemePreference; label: string; icon: typeof Sun }> = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

export function Settings({
  dialect,
  theme,
  onDialectChange,
  onThemeChange,
  onClose,
  onOpenContact,
}: SettingsProps) {
  const { rate, setRate } = useAudio();
  return (
    <div className="flex h-full flex-col">
      <header
        className="safe-top flex items-center gap-3 px-4 py-3 text-white"
        style={{ background: 'linear-gradient(100deg, var(--sky-1), var(--sky-2) 60%, var(--sky-3))' }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Back"
          className="-ml-1 rounded-full bg-white/15 p-2 text-white transition-colors hover:bg-white/25"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <h2 className="font-display text-lg font-semibold">Settings</h2>
      </header>

      <div className="scroll-clean flex-1 space-y-6 overflow-y-auto p-4 lg:mx-auto lg:w-full lg:max-w-4xl lg:p-8">
        <Section title="Dialect">
          <div className="space-y-2">
            {DIALECT_IDS.map((id) => {
              const config = DIALECTS[id];
              const isActive = dialect === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onDialectChange(id)}
                  aria-pressed={isActive}
                  className={`flex w-full items-center gap-3 rounded-card p-3.5 shadow-card text-left transition-colors ${
                    isActive
                      ? 'bg-brand-soft ring-2 ring-brand'
                      : 'bg-card'
                  }`}
                >
                  <DialectFlag dialect={id} size={26} />

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-display font-semibold text-ink">{config.name} Arabic</span>
                      <span lang="ar" dir="rtl" className="text-sm text-ink-soft">
                        {config.nativeName}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-soft">{config.region}</span>
                    <span className="mt-1.5 inline-flex items-center gap-1 text-[0.6875rem] font-medium">
                      {config.audio === 'available' ? (
                        <span className="text-brand-ink">
                          Native recordings · {config.variant}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-ink-soft">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          Recordings in production
                        </span>
                      )}
                    </span>
                  </span>

                  {isActive && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand">
                      <Check className="h-3 w-3 text-on-brand" aria-hidden="true" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Section>

        <Section title="Listening speed">
          <div className="flex items-center gap-3 rounded-card bg-card p-3 shadow-card">
            <Turtle className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
            <div role="radiogroup" aria-label="Playback speed" className="flex flex-1 gap-1">
              {RATES.map((r) => (
                <button
                  key={r}
                  type="button"
                  role="radio"
                  aria-checked={rate === r}
                  onClick={() => setRate(r)}
                  className={`flex-1 rounded-full py-1.5 font-display text-sm font-semibold transition ${
                    rate === r ? 'bg-brand text-on-brand' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {r === 1 ? 'Normal' : r === 0.75 ? 'Slow' : 'Slower'}
                </button>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Appearance">
          <div className="flex gap-2">
            {THEMES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onThemeChange(id)}
                aria-pressed={theme === id}
                className={`flex flex-1 flex-col items-center gap-1.5 rounded-card p-3 font-display text-sm font-semibold shadow-card transition-colors ${
                  theme === id
                    ? 'bg-brand-soft text-brand-ink ring-2 ring-brand'
                    : 'bg-card text-ink-muted'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Voices">
          <div className="space-y-2">
            <p className="px-1 text-xs leading-relaxed text-ink-soft">
              Every recording is a native speaker. No synthesis.
            </p>

            {DIALECT_IDS.map((id) => {
              const people = speakersFor(id);
              if (!people.length) return null;
              const config = DIALECTS[id];

              return (
                <div key={id} className="overflow-hidden rounded-card bg-card shadow-card">
                  <div className="flex items-baseline justify-between gap-2 border-b border-line px-3.5 py-2.5">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink">
                      {config.variant}
                    </span>
                    <span className="text-[0.6875rem] text-ink-soft">
                      {config.audio === 'available'
                        ? voiceCount(people.filter((p) => p.nameConfirmed).length)
                        : 'recordings pending'}
                    </span>
                  </div>

                  <ul className="grid grid-cols-2 gap-3 p-3.5">
                    {people.map((speaker) => (
                      <li key={speaker.id} className="flex items-center gap-2.5">
                        <SpeakerAvatar
                          name={speaker.name}
                          photo={speaker.photo}
                          size={38}
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-ink">
                            {speaker.name}
                          </span>
                          {!speaker.nameConfirmed && (
                            <span className="block text-[0.6875rem] text-ink-soft">
                              name to confirm
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="Get involved">
          <GrowCard onOpen={onOpenContact} />
        </Section>

        <p className="pb-2 text-center text-xs text-ink-soft">
          {BRAND.name} · {BRAND.tagline}
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 px-1 font-display text-base font-semibold text-ink">
        {title}
      </h3>
      {children}
    </section>
  );
}
