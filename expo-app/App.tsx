import { useEffect, useMemo, useState, createContext, useContext, type ReactNode } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { phrases as initialPhrases } from './data/phrases';
import { Phrase, Folder } from './types';

type DialectType = 'Egyptian' | 'Levantine';

interface AppSettings {
  currentDialect: DialectType;
  hasCompletedOnboarding: boolean;
  downloadedDialects: DialectType[];
}

interface AppState {
  phrases: Phrase[];
  folders: Folder[];
  settings: AppSettings;
  updatePhrase: (p: Phrase) => void;
  addFolder: (name: string) => void;
  assignFolder: (phraseId: string, folderId?: string) => void;
  toggleBookmark: (phraseId: string) => void;
  incrementUsage: (phraseId: string) => void;
  setDialect: (d: DialectType) => void;
}

const AppContext = createContext<AppState | null>(null);
const Tab = createBottomTabNavigator();

const STORAGE_KEYS = {
  phrases: 'phrases',
  folders: 'folders',
  settings: 'settings',
};

const fallbackSettings: AppSettings = {
  currentDialect: 'Egyptian',
  hasCompletedOnboarding: true,
  downloadedDialects: [],
};

function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('AppContext missing');
  return ctx;
}

function Provider({ children }: { children: ReactNode }) {
  const [phrases, setPhrases] = useState<Phrase[]>(initialPhrases);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [settings, setSettings] = useState<AppSettings>(fallbackSettings);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const [pRaw, fRaw, sRaw] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.phrases),
          AsyncStorage.getItem(STORAGE_KEYS.folders),
          AsyncStorage.getItem(STORAGE_KEYS.settings),
        ]);
        if (pRaw) {
          const parsed = JSON.parse(pRaw);
          if (Array.isArray(parsed) && parsed.length >= initialPhrases.length) {
            setPhrases(parsed);
          } else {
            setPhrases(initialPhrases);
          }
        }
        if (fRaw) {
          setFolders(JSON.parse(fRaw));
        }
        if (sRaw) {
          setSettings(JSON.parse(sRaw));
        }
      } catch (e) {
        console.warn('Failed to hydrate state', e);
        setPhrases(initialPhrases);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEYS.phrases, JSON.stringify(phrases));
  }, [phrases, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEYS.folders, JSON.stringify(folders));
  }, [folders, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  }, [settings, hydrated]);

  const updatePhrase = (updated: Phrase) => {
    setPhrases((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const toggleBookmark = (phraseId: string) => {
    setPhrases((prev) =>
      prev.map((p) =>
        p.id === phraseId ? { ...p, isBookmarked: !p.isBookmarked } : p
      )
    );
  };

  const incrementUsage = (phraseId: string) => {
    setPhrases((prev) =>
      prev.map((p) =>
        p.id === phraseId ? { ...p, timesQueried: p.timesQueried + 1 } : p
      )
    );
  };

  const addFolder = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = `folder-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setFolders((prev) => [...prev, { id, name: trimmed }]);
  };

  const assignFolder = (phraseId: string, folderId?: string) => {
    setPhrases((prev) =>
      prev.map((p) =>
        p.id === phraseId ? { ...p, folderId: folderId || undefined } : p
      )
    );
  };

  const setDialect = (dialect: DialectType) => {
    setSettings((prev) => ({ ...prev, currentDialect: dialect }));
  };

  const value: AppState = {
    phrases,
    folders,
    settings,
    updatePhrase,
    addFolder,
    assignFolder,
    toggleBookmark,
    incrementUsage,
    setDialect,
  };

  return (
    <AppContext.Provider value={value}>
      {hydrated ? children : <View style={styles.center}><Text>Loading...</Text></View>}
    </AppContext.Provider>
  );
}

function PhraseItem({
  phrase,
  showFolderPicker,
}: {
  phrase: Phrase;
  showFolderPicker?: boolean;
}) {
  const { settings, toggleBookmark, incrementUsage, assignFolder, folders } = useAppState();
  const dialectEntry = useMemo(
    () => phrase.dialects.find((d) => d.name === settings.currentDialect),
    [phrase.dialects, settings.currentDialect]
  );

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{phrase.english}</Text>
        <View style={styles.cardActions}>
          {phrase.timesQueried > 0 && (
            <View style={styles.badge}>
              <Ionicons name="sparkles-outline" size={14} color="#4f46e5" />
              <Text style={styles.badgeText}>{phrase.timesQueried}</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Audio', `Play ${settings.currentDialect} audio (todo)`)
            }
            style={[styles.iconButton, { marginLeft: 6 }]}
          >
            <Ionicons name="play" size={18} color="#4f46e5" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleBookmark(phrase.id)}
            style={[styles.iconButton, { marginLeft: 6 }]}
          >
            <Ionicons
              name={phrase.isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={phrase.isBookmarked ? '#4f46e5' : '#4b5563'}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          incrementUsage(phrase.id);
          if (dialectEntry?.transliteration) {
            Clipboard.setStringAsync(dialectEntry.transliteration);
          }
        }}
      >
        <Text style={styles.translit}>{dialectEntry?.transliteration || phrase.fushaTransliteration}</Text>
      </TouchableOpacity>
      {showFolderPicker && (
        <View style={styles.folderRow}>
          <Text style={styles.folderLabel}>Folder:</Text>
          <View style={styles.folderOptions}>
            <TouchableOpacity
              style={[
                styles.folderChip,
                !phrase.folderId && styles.folderChipActive,
              ]}
              onPress={() => assignFolder(phrase.id, undefined)}
            >
              <Text style={!phrase.folderId ? styles.folderChipTextActive : styles.folderChipText}>
                None
              </Text>
            </TouchableOpacity>
            {folders.map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[
                  styles.folderChip,
                  phrase.folderId === f.id && styles.folderChipActive,
                ]}
                onPress={() => assignFolder(phrase.id, f.id)}
              >
                <Text
                  style={phrase.folderId === f.id ? styles.folderChipTextActive : styles.folderChipText}
                >
                  {f.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

function ExploreScreen() {
  const { phrases, settings, setDialect } = useAppState();
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.rowBetween}>
        <Text style={styles.heading}>Explore</Text>
        <View style={styles.row}>
          {(['Egyptian', 'Levantine'] as DialectType[]).map((d) => (
            <TouchableOpacity
              key={d}
              onPress={() => setDialect(d)}
              style={[
                styles.dialectButton,
                settings.currentDialect === d && styles.dialectButtonActive,
              ]}
            >
              <Text
                style={
                  settings.currentDialect === d ? styles.dialectTextActive : styles.dialectText
                }
              >
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={phrases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PhraseItem phrase={item} />}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

function SearchScreen() {
  const { phrases } = useAppState();
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return phrases.filter(
      (p) =>
        p.english.toLowerCase().includes(lower) ||
        p.fushaTransliteration.toLowerCase().includes(lower) ||
        p.dialects.some(
          (d) =>
            d.transliteration.toLowerCase().includes(lower) ||
            d.arabicScript.includes(query)
        )
    );
  }, [phrases, query]);

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.heading}>Search</Text>
      <TextInput
        placeholder="Search phrases..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PhraseItem phrase={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          query ? <Text style={styles.muted}>No results</Text> : <Text style={styles.muted}>Start typing to search</Text>
        }
      />
    </SafeAreaView>
  );
}

function BookmarksScreen() {
  const { phrases, folders, addFolder } = useAppState();
  const [selectedFolder, setSelectedFolder] = useState<'all' | 'none' | string>('all');
  const [newFolderName, setNewFolderName] = useState('');

  const bookmarked = phrases.filter((p) => p.isBookmarked);
  const filtered = useMemo(() => {
    if (selectedFolder === 'all') return bookmarked;
    if (selectedFolder === 'none') return bookmarked.filter((p) => !p.folderId);
    return bookmarked.filter((p) => p.folderId === selectedFolder);
  }, [bookmarked, selectedFolder]);

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.heading}>Saved Phrases</Text>
      <View style={styles.folderRow}>
        {[
          { id: 'all', name: 'All' },
          { id: 'none', name: 'Unfiled' },
          ...folders,
        ].map((f) => (
          <TouchableOpacity
            key={f.id}
            onPress={() => setSelectedFolder(f.id as typeof selectedFolder)}
            style={[
              styles.folderChip,
              selectedFolder === f.id && styles.folderChipActive,
            ]}
          >
            <Text style={selectedFolder === f.id ? styles.folderChipTextActive : styles.folderChipText}>
              {f.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        <TextInput
          placeholder="New folder name"
          value={newFolderName}
          onChangeText={setNewFolderName}
          style={[styles.input, { flex: 1 }]}
        />
        <TouchableOpacity
          onPress={() => {
            addFolder(newFolderName);
            setNewFolderName('');
          }}
          style={[styles.primaryButton, { marginLeft: 8 }]}
        >
          <Text style={styles.primaryButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PhraseItem phrase={item} showFolderPicker />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.muted}>No bookmarks yet</Text>}
      />
    </SafeAreaView>
  );
}

function CultureScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.heading}>Culture</Text>
      <Text style={styles.muted}>Add cultural stories here.</Text>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Provider>
        <NavigationContainer theme={DefaultTheme}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ color, size }) => {
                const icon =
                  route.name === 'Explore'
                    ? 'compass-outline'
                    : route.name === 'Search'
                      ? 'search'
                      : route.name === 'Culture'
                        ? 'globe-outline'
                        : 'bookmark-outline';
                return <Ionicons name={icon as any} size={size} color={color} />;
              },
            })}
          >
            <Tab.Screen name="Explore" component={ExploreScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Culture" component={CultureScreen} />
            <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: '#f7f7f7',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#eef2ff',
    borderRadius: 999,
  },
  badgeText: {
    color: '#4f46e5',
    fontWeight: '600',
    fontSize: 12,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#eef2ff',
    borderRadius: 12,
  },
  translit: {
    color: '#4f46e5',
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 32,
  },
  folderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 8,
  },
  folderLabel: {
    color: '#4b5563',
    marginRight: 6,
  },
  folderOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  folderChip: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    marginRight: 6,
    marginBottom: 6,
  },
  folderChipActive: {
    backgroundColor: '#eef2ff',
    borderColor: '#4f46e5',
  },
  folderChipText: {
    color: '#4b5563',
    fontSize: 13,
  },
  folderChipTextActive: {
    color: '#4f46e5',
    fontWeight: '600',
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: '#111827',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  dialectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    marginLeft: 6,
  },
  dialectButtonActive: {
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#4f46e5',
  },
  dialectText: {
    color: '#374151',
  },
  dialectTextActive: {
    color: '#4f46e5',
    fontWeight: '700',
  },
  muted: {
    color: '#6b7280',
    marginTop: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
