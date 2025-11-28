import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Explore } from './components/Explore';
import { Search } from './components/Search';
import { Bookmarks } from './components/Bookmarks';
import { Culture } from './components/Culture';
import { Settings } from './components/Settings';
import { OnboardingDialog } from './components/OnboardingDialog';
import { Compass, SearchIcon, Bookmark, Globe, SettingsIcon, Sparkles } from 'lucide-react';
import { phrases as initialPhrases } from './data/phrases';
import { Phrase, Folder } from './types';

type Tab = 'explore' | 'search' | 'bookmarks' | 'culture';
type DialectType = 'Egyptian' | 'Levantine';

interface AppSettings {
  currentDialect: DialectType;
  hasCompletedOnboarding: boolean;
  downloadedDialects: DialectType[];
}

// Color themes for each dialect
const dialectThemes = {
  Egyptian: {
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    light: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-500',
    hover: 'hover:bg-amber-700',
    active: 'bg-amber-50',
    activeText: 'text-amber-600',
    pattern: '🏺',
  },
  Levantine: {
    gradient: 'from-indigo-500 to-purple-600',
    bg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    light: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-500',
    hover: 'hover:bg-indigo-700',
    active: 'bg-indigo-50',
    activeText: 'text-indigo-600',
    pattern: '🌊',
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('explore');
  const [showSettings, setShowSettings] = useState(false);
  
  const [phrases, setPhrases] = useState<Phrase[]>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('phrases');
    const parsed = saved ? JSON.parse(saved) : null;
    // If storage is empty, corrupted, or outdated, fall back to bundled data
    if (Array.isArray(parsed) && parsed.length >= initialPhrases.length) {
      return parsed;
    }
    return initialPhrases;
  });
  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('folders');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('appSettings');
    return saved
      ? JSON.parse(saved)
      : {
          currentDialect: 'Egyptian',
          hasCompletedOnboarding: false,
          downloadedDialects: [],
        };
  });

  // Save to localStorage whenever phrases change
  useEffect(() => {
    localStorage.setItem('phrases', JSON.stringify(phrases));
  }, [phrases]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  // Save folders
  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [folders]);

  const handlePhraseUpdate = (updatedPhrase: Phrase) => {
    setPhrases((prev) =>
      prev.map((p) => (p.id === updatedPhrase.id ? updatedPhrase : p))
    );
  };

  const handleOnboardingComplete = (dialect: DialectType) => {
    setSettings((prev) => ({
      ...prev,
      currentDialect: dialect,
      hasCompletedOnboarding: true,
    }));
  };

  const handleDialectChange = (dialect: DialectType) => {
    setSettings((prev) => ({
      ...prev,
      currentDialect: dialect,
    }));
  };

  const handleDownloadDialect = (dialect: DialectType) => {
    if (settings.downloadedDialects.includes(dialect)) {
      return;
    }
    setSettings((prev) => ({
      ...prev,
      downloadedDialects: [...prev.downloadedDialects, dialect],
    }));
    // In a real app, this would trigger actual download of audio files and content
    alert(`${dialect} Arabic downloaded successfully! You can now use it offline.`);
  };

  const handleDeleteDialect = (dialect: DialectType) => {
    setSettings((prev) => ({
      ...prev,
      downloadedDialects: prev.downloadedDialects.filter((d) => d !== dialect),
    }));
    alert(`${dialect} Arabic removed from offline storage.`);
  };

  const handleAddFolder = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newFolder: Folder = { id: crypto.randomUUID(), name: trimmed };
    setFolders((prev) => [...prev, newFolder]);
  };

  const handleAssignFolder = (phraseId: string, folderId?: string) => {
    setPhrases((prev) =>
      prev.map((p) =>
        p.id === phraseId ? { ...p, folderId: folderId || undefined } : p
      )
    );
  };

  const theme = dialectThemes[settings.currentDialect];

  // Show onboarding if first time
  if (!settings.hasCompletedOnboarding) {
    return <OnboardingDialog onSelectDialect={handleOnboardingComplete} />;
  }

  // Show settings page
  if (showSettings) {
    return (
      <div className="h-screen bg-gray-50 max-w-md mx-auto">
        <Settings
          currentDialect={settings.currentDialect}
          downloadedDialects={settings.downloadedDialects}
          onDialectChange={handleDialectChange}
          onDownloadDialect={handleDownloadDialect}
          onDeleteDialect={handleDeleteDialect}
          onClose={() => setShowSettings(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto">
      {/* Header with gradient and animations */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`${theme.bg} text-white p-6 shadow-lg flex-shrink-0 relative overflow-hidden`}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-6xl"
              initial={{ 
                x: Math.random() * 400, 
                y: Math.random() * 200,
                rotate: Math.random() * 360,
                opacity: 0.3
              }}
              animate={{ 
                y: [null, Math.random() * 200],
                rotate: [null, Math.random() * 360 + 360],
              }}
              transition={{ 
                duration: 20 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {theme.pattern}
            </motion.div>
          ))}
        </div>

        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <h1 className="text-2xl mb-1">World Peas</h1>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`${settings.currentDialect === 'Egyptian' ? 'text-amber-100' : 'text-indigo-100'} text-sm`}
            >
              {settings.currentDialect === 'Egyptian' ? '🇪🇬 Egyptian' : '🇯🇴 Levantine'} Arabic
            </motion.p>
          </div>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSettings(true)}
            className={`p-2 ${theme.hover} rounded-lg transition-colors`}
            aria-label="Settings"
          >
            <SettingsIcon className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content with page transitions */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Explore 
                phrases={phrases}
                onPhraseUpdate={handlePhraseUpdate} 
                currentDialect={settings.currentDialect}
              />
            </motion.div>
          )}
          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Search
                phrases={phrases}
                onPhraseUpdate={handlePhraseUpdate}
                downloadedDialects={settings.downloadedDialects}
                currentDialect={settings.currentDialect}
              />
            </motion.div>
          )}
          {activeTab === 'bookmarks' && (
            <motion.div
              key="bookmarks"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Bookmarks 
                onPhraseUpdate={handlePhraseUpdate} 
                allPhrases={phrases} 
                currentDialect={settings.currentDialect}
                folders={folders}
                onAddFolder={handleAddFolder}
                onAssignFolder={handleAssignFolder}
              />
            </motion.div>
          )}
          {activeTab === 'culture' && (
            <motion.div
              key="culture"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Culture currentDialect={settings.currentDialect} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation with animations */}
      <nav className="bg-white border-t border-gray-200 safe-area-bottom flex-shrink-0 shadow-lg">
        <div className="flex items-center justify-around p-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('explore')}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors relative ${
              activeTab === 'explore'
                ? `${theme.activeText} ${theme.active}`
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Compass className="w-6 h-6" />
            <span className="text-xs">Explore</span>
            {activeTab === 'explore' && (
              <motion.div
                layoutId="activeTab"
                className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${theme.bg}`}
              />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors relative ${
              activeTab === 'search'
                ? `${theme.activeText} ${theme.active}`
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <SearchIcon className="w-6 h-6" />
            <span className="text-xs">Search</span>
            {activeTab === 'search' && (
              <motion.div
                layoutId="activeTab"
                className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${theme.bg}`}
              />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('culture')}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors relative ${
              activeTab === 'culture'
                ? `${theme.activeText} ${theme.active}`
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Globe className="w-6 h-6" />
            <span className="text-xs">Culture</span>
            {activeTab === 'culture' && (
              <motion.div
                layoutId="activeTab"
                className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${theme.bg}`}
              />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('bookmarks')}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors relative ${
              activeTab === 'bookmarks'
                ? `${theme.activeText} ${theme.active}`
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Bookmark className="w-6 h-6" />
            <span className="text-xs">Bookmarks</span>
            {activeTab === 'bookmarks' && (
              <motion.div
                layoutId="activeTab"
                className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${theme.bg}`}
              />
            )}
          </motion.button>
        </div>
      </nav>
    </div>
  );
}
