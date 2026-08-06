import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { Explore } from './components/Explore';
import { Search } from './components/Search';
import { Bookmarks } from './components/Bookmarks';
import { Culture } from './components/Culture';
import { Settings } from './components/Settings';
import { OnboardingDialog } from './components/OnboardingDialog';
import { PhraseDetail } from './components/PhraseDetail';
import { Masthead } from './components/Masthead';
import { Logo } from './components/Logo';
import { PreviewSizer, usePhoneSize } from './components/PreviewSizer';

import { phrases as PHRASES } from './data/phrases';
import { DIALECTS, applyDocumentTheme, dialectFromLabel } from './lib/dialects';
import {
  AppSettings,
  EMPTY_PHRASE_STATE,
  PhraseStateMap,
  loadFolders,
  loadPhraseState,
  loadSettings,
  saveFolders,
  savePhraseState,
  saveSettings,
} from './lib/storage';
import { DialectId, Folder, Phrase, ThemePreference } from './types';

type Tab = 'explore' | 'search' | 'saved' | 'culture';

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'explore', label: 'Explore' },
  { id: 'search', label: 'Search' },
  { id: 'saved', label: 'Saved' },
  { id: 'culture', label: 'Culture' },
];

function prefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function resolveDark(theme: ThemePreference) {
  return theme === 'dark' || (theme === 'system' && prefersDark());
}

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [states, setStates] = useState<PhraseStateMap>(loadPhraseState);
  const [folders, setFolders] = useState<Folder[]>(loadFolders);

  const [activeTab, setActiveTab] = useState<Tab>('explore');
  const [showSettings, setShowSettings] = useState(false);
  const [openPhraseId, setOpenPhraseId] = useState<string | null>(null);

  const dialect = dialectFromLabel(settings.currentDialect);

  useEffect(() => saveSettings(settings), [settings]);
  useEffect(() => savePhraseState(states), [states]);
  useEffect(() => saveFolders(folders), [folders]);

  useEffect(() => {
    applyDocumentTheme(dialect, resolveDark(settings.theme));
    if (settings.theme !== 'system') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyDocumentTheme(dialect, prefersDark());
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [dialect, settings.theme]);

  const getState = useCallback((id: string) => states[id] ?? EMPTY_PHRASE_STATE, [states]);

  const toggleBookmark = useCallback((id: string) => {
    setStates((prev) => {
      const current = prev[id] ?? EMPTY_PHRASE_STATE;
      return { ...prev, [id]: { ...current, isBookmarked: !current.isBookmarked } };
    });
  }, []);

  const openPhrase = useCallback((phrase: Phrase) => {
    setStates((prev) => {
      const current = prev[phrase.id] ?? EMPTY_PHRASE_STATE;
      return { ...prev, [phrase.id]: { ...current, timesQueried: current.timesQueried + 1 } };
    });
    setOpenPhraseId(phrase.id);
  }, []);

  const assignFolder = useCallback((phraseId: string, folderId?: string) => {
    setStates((prev) => {
      const current = prev[phraseId] ?? EMPTY_PHRASE_STATE;
      return { ...prev, [phraseId]: { ...current, folderId } };
    });
  }, []);

  const addFolder = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setFolders((prev) => [...prev, { id: crypto.randomUUID(), name: trimmed }]);
  }, []);

  const setDialect = useCallback((next: DialectId) => {
    setSettings((prev) => ({ ...prev, currentDialect: DIALECTS[next].label }));
  }, []);

  const activePhrase = useMemo(
    () => PHRASES.find((p) => p.id === openPhraseId) ?? null,
    [openPhraseId]
  );

  const { size, setSize } = usePhoneSize();

  /** Drag the panel's corner to resize. Desktop only — the handle is hidden
      below lg, where the app fills the viewport anyway. */
  const startResize = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const x0 = e.clientX;
      const y0 = e.clientY;
      const w0 = size.w;
      const h0 = size.h;

      const onMove = (ev: PointerEvent) =>
        setSize({ w: w0 + (ev.clientX - x0), h: h0 + (ev.clientY - y0) });
      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        document.body.style.userSelect = '';
      };

      document.body.style.userSelect = 'none';
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [size, setSize]
  );

  if (!settings.hasCompletedOnboarding) {
    return (
      <OnboardingDialog
        onPreviewDialect={(next) => applyDocumentTheme(next, resolveDark(settings.theme))}
        onSelectDialect={(next) =>
          setSettings((prev) => ({
            ...prev,
            currentDialect: DIALECTS[next].label,
            hasCompletedOnboarding: true,
          }))
        }
      />
    );
  }

  const shared = {
    dialect,
    getState,
    onOpenPhrase: openPhrase,
    onToggleBookmark: toggleBookmark,
  };

  return (
    <div className="min-h-dvh bg-surface lg:grid lg:place-items-center lg:p-10">
      <div className="lg:flex lg:items-center lg:gap-16">
        {/* On a laptop the phone column alone reads as a broken page, so the
            surrounding space carries the edition statement instead. */}
        <aside className="hidden max-w-sm lg:block">
          <Logo size="lg" />
          <h2 className="mt-8 text-3xl font-normal leading-tight tracking-[-0.015em] text-ink">
            Everyday Arabic, recorded by the people who speak it
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            Not synthesised, not textbook. {PHRASES.length} phrases a traveller actually needs,
            in the dialect they will actually hear.
          </p>
          <dl className="mt-9 flex gap-9 border-t border-line pt-5">
            {[
              ['Phrases', String(PHRASES.length)],
              ['Voices', '4'],
              ['Dialects', '2'],
            ].map(([term, value]) => (
              <div key={term}>
                <dt className="text-[0.59375rem] uppercase tracking-[0.16em] text-ink-soft">
                  {term}
                </dt>
                <dd className="mt-1.5 text-2xl tabular-nums text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <PreviewSizer size={size} onChange={setSize} />
        </aside>

        {/* Fixed on mobile (the app owns the viewport); on desktop the panel
            takes its dimensions from the preview controls. */}
        <div
          style={{ '--pw': `${size.w}px`, '--ph': `${size.h}px` } as React.CSSProperties}
          className="relative flex h-dvh w-full flex-col overflow-hidden bg-surface lg:h-[var(--ph)] lg:max-h-[92vh] lg:w-[var(--pw)] lg:rounded-[1.25rem] lg:border lg:border-line lg:shadow-lift"
        >
          <button
            type="button"
            onPointerDown={startResize}
            aria-label={`Resize preview — currently ${size.w} by ${size.h} pixels`}
            className="absolute -bottom-1 -right-1 z-30 hidden h-6 w-6 cursor-nwse-resize items-center justify-center rounded-full border border-line bg-card text-ink-soft transition-colors hover:border-brand hover:text-brand lg:flex"
          >
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path
                d="M9 1 1 9M9 5.5 5.5 9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {showSettings ? (
            <Settings
              dialect={dialect}
              theme={settings.theme}
              onDialectChange={setDialect}
              onThemeChange={(theme) => setSettings((prev) => ({ ...prev, theme }))}
              onClose={() => setShowSettings(false)}
            />
          ) : (
            <>
              <Masthead
                dialect={dialect}
                onDialectChange={setDialect}
                onOpenSettings={() => setShowSettings(true)}
              />

              <nav
                aria-label="Sections"
                className="flex justify-center gap-6 border-y border-line px-[22px] pb-3 pt-[11px]"
              >
                {TABS.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    aria-current={activeTab === id ? 'page' : undefined}
                    className={`border-b pb-[3px] text-[0.59375rem] font-medium uppercase tracking-[0.2em] transition-colors ${
                      activeTab === id
                        ? 'border-brand text-ink'
                        : 'border-transparent text-ink-soft hover:text-ink-muted'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>

              <main className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="h-full"
                  >
                    {activeTab === 'explore' && <Explore phrases={PHRASES} {...shared} />}
                    {activeTab === 'search' && <Search phrases={PHRASES} {...shared} />}
                    {activeTab === 'culture' && <Culture dialect={dialect} />}
                    {activeTab === 'saved' && (
                      <Bookmarks
                        phrases={PHRASES}
                        folders={folders}
                        onAddFolder={addFolder}
                        onAssignFolder={assignFolder}
                        {...shared}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </main>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {activePhrase && (
          <PhraseDetail
            key={activePhrase.id}
            phrase={activePhrase}
            dialect={dialect}
            state={getState(activePhrase.id)}
            onClose={() => setOpenPhraseId(null)}
            onToggleBookmark={() => toggleBookmark(activePhrase.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
