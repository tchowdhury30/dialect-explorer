import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { Explore } from './components/Explore';
import { Search } from './components/Search';
import { Bookmarks } from './components/Bookmarks';
import { Culture } from './components/Culture';
import { Settings } from './components/Settings';
import { OnboardingDialog } from './components/OnboardingDialog';
import { PhraseDetail } from './components/PhraseDetail';
import { MiniBar } from './components/MiniBar';
import { ContactSheet } from './components/Contact';
import { Logo } from './components/Logo';
import { Compass, Heart, Search as SearchGlyph, Sparkles } from 'lucide-react';

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

const TABS: Array<{ id: Tab; label: string; icon: typeof Compass }> = [
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'search', label: 'Search', icon: SearchGlyph },
  { id: 'saved', label: 'Saved', icon: Heart },
  { id: 'culture', label: 'Culture', icon: Sparkles },
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
  const [contactOpen, setContactOpen] = useState(false);
  const closeContact = useCallback(() => setContactOpen(false), []);

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
    <div className="min-h-dvh bg-surface">
        <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-surface">
          {showSettings ? (
            <Settings
              dialect={dialect}
              theme={settings.theme}
              onDialectChange={setDialect}
              onThemeChange={(theme) => setSettings((prev) => ({ ...prev, theme }))}
              onClose={() => setShowSettings(false)}
              onOpenContact={() => setContactOpen(true)}
            />
          ) : (
            <>
              {activeTab !== 'explore' && (
                <MiniBar
                  dialect={dialect}
                  onDialectChange={setDialect}
                  onOpenSettings={() => setShowSettings(true)}
                />
              )}

              <main className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    {activeTab === 'explore' && (
                      <Explore
                        phrases={PHRASES}
                        {...shared}
                        onDialectChange={setDialect}
                        onOpenSettings={() => setShowSettings(true)}
                        onOpenContact={() => setContactOpen(true)}
                      />
                    )}
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

              <nav
                aria-label="Sections"
                className="safe-bottom relative z-20 mx-3 mb-3 flex items-center justify-around rounded-[1.375rem] bg-card py-1.5 shadow-float lg:order-first lg:mx-0 lg:mb-0 lg:justify-start lg:gap-3 lg:rounded-none lg:border-b lg:border-line lg:px-8 lg:py-2"
              >
                <div className="mr-8 hidden lg:block"><Logo size="sm" /></div>
                {TABS.map(({ id, label, icon: Icon }) => {
                  const on = activeTab === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveTab(id)}
                      aria-current={on ? 'page' : undefined}
                      className={`flex w-16 flex-col items-center gap-0.5 rounded-2xl py-1.5 font-display text-[0.6875rem] font-semibold transition-colors lg:w-auto lg:flex-row lg:gap-2 lg:px-4 lg:py-2 lg:text-sm ${
                        on ? 'text-brand' : 'text-ink-soft hover:text-ink-muted'
                      }`}
                    >
                      <motion.span
                        key={on ? `${id}-on` : id}
                        initial={on ? { y: 0 } : false}
                        animate={on ? { y: [0, -7, 0] } : { y: 0 }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                      >
                        <Icon className="h-[1.375rem] w-[1.375rem]" fill={on && id === 'saved' ? 'currentColor' : 'none'} strokeWidth={on ? 2.4 : 2} aria-hidden="true" />
                      </motion.span>
                      {label}
                    </button>
                  );
                })}
              </nav>
            </>
          )}
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

      <ContactSheet open={contactOpen} onClose={closeContact} />
    </div>
  );
}
