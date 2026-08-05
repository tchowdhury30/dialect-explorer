import { ReactNode } from 'react';
import {
  Check,
  ChevronLeft,
  Clock,
  Download,
  Globe,
  Heart,
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

interface SettingsProps {
  dialect: DialectId;
  theme: ThemePreference;
  onDialectChange: (dialect: DialectId) => void;
  onThemeChange: (theme: ThemePreference) => void;
  onClose: () => void;
}

const THEMES: Array<{ id: ThemePreference; label: string; icon: typeof Sun }> = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

const UPCOMING = [
  { icon: User, title: 'Profile', desc: 'Track what you have practised' },
  { icon: Globe, title: 'App language', desc: 'Interface beyond English' },
  { icon: Heart, title: `Support ${BRAND.name}`, desc: 'Help keep the app free' },
];

const SPEAKERS = [
  { name: 'Habib', dialect: 'Jordanian' },
  { name: 'Ghaina', dialect: 'Jordanian' },
  { name: 'Halad', dialect: 'Jordanian' },
  { name: 'Salim', dialect: 'Jordanian' },
];

export function Settings({
  dialect,
  theme,
  onDialectChange,
  onThemeChange,
  onClose,
}: SettingsProps) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-line bg-surface-raised px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back"
          className="-ml-2 rounded-lg p-2 text-ink-muted transition-colors hover:bg-surface hover:text-ink"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <h2 className="font-semibold text-ink">Settings</h2>
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
                  className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                    isActive
                      ? 'border-brand bg-brand-softer'
                      : 'border-line bg-card hover:border-brand-line'
                  }`}
                >
                  <DialectFlag dialect={id} size={26} />

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-semibold text-ink">{config.label} Arabic</span>
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

        <Section title="Appearance">
          <div className="flex gap-2">
            {THEMES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onThemeChange(id)}
                aria-pressed={theme === id}
                className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-colors ${
                  theme === id
                    ? 'border-brand bg-brand-softer text-brand-ink'
                    : 'border-line bg-card text-ink-muted hover:border-brand-line'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Voices">
          <div className="rounded-xl border border-line bg-card p-4">
            <p className="text-sm leading-relaxed text-ink-muted">
              Every recording in this app was made by a native speaker. No synthesis.
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {SPEAKERS.map((speaker) => (
                <li key={speaker.name} className="flex items-center gap-2.5">
                  <SpeakerAvatar name={speaker.name} size={38} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">
                      {speaker.name}
                    </span>
                    <span className="block text-xs text-ink-soft">{speaker.dialect}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section title="Offline">
          <p className="mb-2 px-1 text-xs leading-relaxed text-ink-soft">
            Phrases, transliterations, and bookmarks work without a connection, and any recording
            you have already played is kept for offline replay. Downloading a whole dialect up
            front is still to come.
          </p>

          <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-card">
            {DIALECT_IDS.map((id) => {
              const config = DIALECTS[id];
              return (
                <div key={id} className="flex items-center gap-3 p-3.5">
                  <DialectFlag dialect={id} size={22} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink">
                      {config.label} audio pack
                    </span>
                    <span className="block text-xs text-ink-soft">
                      {config.audio === 'available'
                        ? 'Listen without a connection'
                        : 'Available once recordings ship'}
                    </span>
                  </span>
                  <SoonButton label={`Download ${config.label} audio pack`} />
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="Also coming">
          <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-card">
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
      <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">
        {title}
      </h3>
      {children}
    </section>
  );
}
