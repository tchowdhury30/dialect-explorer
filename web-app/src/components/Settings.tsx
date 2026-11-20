import { ReactNode } from 'react';
import {
  Check,
  ChevronLeft,
  Clock,
  Download,
  Globe,
  Turtle,
  Monitor,
  Moon,
  Sun,
  User,
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

const UPCOMING = [
  { icon: User, title: 'Profile', desc: 'Track what you have practised' },
  { icon: Globe, title: 'App language', desc: 'Interface beyond English' },
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

      <div className="scroll-clean flex-1 space-y-6 overflow-y-auto p-4">
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

        <Section title="Offline">
          <p className="mb-2 px-1 text-xs leading-relaxed text-ink-soft">
            Phrases, transliterations, and bookmarks work without a connection, and any recording
            you have already played is kept for offline replay. Downloading a whole dialect up
            front is still to come.
          </p>

          <div className="divide-y divide-line overflow-hidden rounded-card bg-card shadow-card">
            {DIALECT_IDS.map((id) => {
              const config = DIALECTS[id];
              return (
                <div key={id} className="flex items-center gap-3 p-3.5">
                  <DialectFlag dialect={id} size={22} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink">
                      {config.name} audio pack
                    </span>
                    <span className="block text-xs text-ink-soft">
                      {config.audio === 'available'
                        ? 'Listen without a connection'
                        : 'Available once recordings ship'}
                    </span>
                  </span>
                  <SoonButton label={`Download ${config.name} audio pack`} />
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="Get involved">
          <GrowCard onOpen={onOpenContact} />
        </Section>

        <Section title="Also coming">
          <div className="divide-y divide-line overflow-hidden rounded-card bg-card shadow-card">
            {UPCOMING.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface">
                  <Icon className="h-4 w-4 text-ink-soft" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-ink">{title}</span>
                  <span className="block text-xs text-ink-soft">{desc}</span>
                </span>
                <SoonPill />
              </div>
            ))}
          </div>
        </Section>

        <p className="pb-2 text-center text-xs text-ink-soft">
          {BRAND.name} · {BRAND.tagline}
        </p>
      </div>
    </div>
  );
}

/** Visible but inert, and labelled as such — an affordance that promises
    nothing it cannot do yet. */
function SoonPill() {
  return (
    <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider text-ink-soft">
      Soon
    </span>
  );
}

function SoonButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      aria-label={`${label} — coming soon`}
      title="Coming soon"
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft opacity-70"
    >
      <Download className="h-3.5 w-3.5" aria-hidden="true" />
      Soon
    </button>
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
