import { useEffect, useMemo, useState, useRef, createContext, useContext, type ReactNode } from 'react';
import { NavigationContainer, DefaultTheme, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, type NativeStackNavigationProp, type NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  Alert,
  FlatList,
  ScrollView,
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

import { categories, phrases as initialPhrases } from './data/phrases';
import { speakers, blogPosts } from './data/culture';
import { Phrase, Folder, Category } from './types';

type DialectType = 'Egyptian' | 'Levantine';

interface AppSettings {
  currentDialect: DialectType;
  hasCompletedOnboarding: boolean;
  downloadedDialects: DialectType[];
}

const dialectTheme = {
  Egyptian: {
    accent: '#f59e0b',
    accent2: '#fb923c',
    softBg: '#fff7ed',
    chipBg: '#fef9c3',
    chipText: '#92400e',
  },
  Levantine: {
    accent: '#6366f1',
    accent2: '#3b82f6',
    softBg: '#eef2ff',
    chipBg: '#e0f2fe',
    chipText: '#1e3a8a',
  },
} as const;

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
  toggleDownload: (d: DialectType) => void;
  completeOnboarding: (dialect: DialectType) => void;
}

const AppContext = createContext<AppState | null>(null);
const Tab = createBottomTabNavigator();
type ExploreStackParamList = {
  ExploreHome: undefined;
  CategoryDetail: { categoryId: string };
  PhraseDetail: { phraseId: string };
};
const ExploreStack = createNativeStackNavigator<ExploreStackParamList>();

const STORAGE_KEYS = {
  phrases: 'phrases',
  folders: 'folders',
  settings: 'settings',
};

const fallbackSettings: AppSettings = {
  currentDialect: 'Egyptian',
  hasCompletedOnboarding: false,
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

  const toggleDownload = (dialect: DialectType) => {
    setSettings((prev) => {
      const has = prev.downloadedDialects.includes(dialect);
      return {
        ...prev,
        downloadedDialects: has
          ? prev.downloadedDialects.filter((d) => d !== dialect)
          : [...prev.downloadedDialects, dialect],
      };
    });
    Alert.alert('Downloads', `${dialect} ${settings.downloadedDialects.includes(dialect) ? 'removed' : 'downloaded'} for offline use (placeholder)`);
  };

  const completeOnboarding = (dialect: DialectType) => {
    setSettings((prev) => ({
      ...prev,
      currentDialect: dialect,
      hasCompletedOnboarding: true,
      downloadedDialects: [...new Set([...prev.downloadedDialects, dialect])],
    }));
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
    toggleDownload,
    completeOnboarding,
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

function MinimalPhraseCard({
  phrase,
  currentDialect,
  onPress,
  onPlay,
  onToggleBookmark,
}: {
  phrase: Phrase;
  currentDialect: DialectType;
  onPress: () => void;
  onPlay: () => void;
  onToggleBookmark: () => void;
}) {
  const dialectEntry = useMemo(
    () => phrase.dialects.find((d) => d.name === currentDialect),
    [phrase.dialects, currentDialect]
  );

  return (
    <TouchableOpacity style={styles.miniCard} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.miniCardText}>
        <Text style={styles.miniTitle}>{phrase.english}</Text>
        <Text style={styles.miniTranslit}>{dialectEntry?.transliteration || phrase.fushaTransliteration}</Text>
      </View>
      <View style={styles.miniActions}>
        <TouchableOpacity onPress={onPlay} style={styles.miniPlay}>
          <Ionicons name="play" size={18} color="#111827" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onToggleBookmark} style={styles.miniBookmark}>
          <Ionicons
            name={phrase.isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={phrase.isBookmarked ? '#4f46e5' : '#4b5563'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function CategoryTile({
  category,
  count,
  onPress,
  theme,
}: {
  category: Category;
  count: number;
  onPress: () => void;
  theme: typeof dialectTheme[DialectType];
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        styles.categoryTile,
        { backgroundColor: theme.softBg, borderColor: theme.accent2 },
      ]}
    >
      <View style={styles.categoryTileHeader}>
        <Text style={styles.categoryIcon}>{category.icon}</Text>
        <View style={[styles.categoryBadge, { backgroundColor: theme.accent }]}>
          <Text style={[styles.categoryBadgeText, { color: '#fff' }]}>{count}</Text>
        </View>
      </View>
      <Text style={styles.categoryTitle}>{category.name}</Text>
      <Text style={styles.categoryDescription} numberOfLines={2}>
        {category.description}
      </Text>
    </TouchableOpacity>
  );
}

function ExploreHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ExploreStackParamList>>();
  const { phrases, settings, setDialect } = useAppState();
  const theme = dialectTheme[settings.currentDialect];

  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    phrases.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return categories.map((c) => ({ ...c, phraseCount: counts[c.id] || 0 }));
  }, [phrases]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.rowBetween}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>Explore</Text>
          <Text style={styles.muted}>Choose a category to compare phrases</Text>
        </View>
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
        data={categoriesWithCounts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <CategoryTile
            category={item}
            count={item.phraseCount}
            onPress={() => navigation.navigate('CategoryDetail', { categoryId: item.id })}
            theme={theme}
          />
        )}
        contentContainerStyle={styles.categoryGrid}
      />
    </SafeAreaView>
  );
}

function CategoryDetailScreen({
  navigation,
  route,
}: NativeStackScreenProps<ExploreStackParamList, 'CategoryDetail'>) {
  const { categoryId } = route.params;
  const { phrases, settings, setDialect, toggleBookmark, incrementUsage } = useAppState();
  const category = categories.find((c) => c.id === categoryId);
  const categoryPhrases = useMemo(
    () => phrases.filter((p) => p.category === categoryId),
    [phrases, categoryId]
  );

  const playDefaultAudio = (phrase: Phrase) => {
    Alert.alert('Audio', `Play default audio for "${phrase.english}"`);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Text style={styles.categoryIcon}>{category?.icon}</Text>
            <Text style={styles.heading}>{category?.name || 'Category'}</Text>
          </View>
          <Text style={styles.muted}>{category?.description}</Text>
        </View>
        <View style={styles.countPill}>
          <Text style={styles.countPillText}>{categoryPhrases.length} phrases</Text>
        </View>
      </View>

      <View style={[styles.rowBetween, { marginBottom: 12 }]}>
        <Text style={styles.tableTitle}>Phrases</Text>
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
              <Text style={settings.currentDialect === d ? styles.dialectTextActive : styles.dialectText}>
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={categoryPhrases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MinimalPhraseCard
            phrase={item}
            currentDialect={settings.currentDialect}
            onPress={() => {
              incrementUsage(item.id);
              navigation.navigate('PhraseDetail', { phraseId: item.id });
            }}
            onPlay={() => playDefaultAudio(item)}
            onToggleBookmark={() => toggleBookmark(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.muted}>No phrases found.</Text>}
      />
    </SafeAreaView>
  );
}

function PhraseDetailScreen({
  navigation,
  route,
}: NativeStackScreenProps<ExploreStackParamList, 'PhraseDetail'>) {
  const { phraseId } = route.params;
  const scrollRef = useRef<ScrollView>(null);
  const { phrases, toggleBookmark, settings, setDialect } = useAppState();
  const phrase = phrases.find((p) => p.id === phraseId);
  const theme = dialectTheme[settings.currentDialect];

  if (!phrase) {
    return (
      <SafeAreaView style={styles.screen}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { alignSelf: 'flex-start' }]}>
          <Ionicons name="chevron-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.muted}>Phrase not found.</Text>
      </SafeAreaView>
    );
  }

  const currentDialectEntry = phrase.dialects.find((d) => d.name === settings.currentDialect);
  const otherDialects = phrase.dialects.filter((d) => d.name !== settings.currentDialect);

  const playDefaultAudio = () => {
    Alert.alert('Audio', `Play default audio for "${phrase.english}"`);
  };

  const playSampleAudio = (dialectName: string, speakerLabel: string) => {
    Alert.alert('Audio', `Play ${dialectName} sample (${speakerLabel}) for "${phrase.english}"`);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color="#111827" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.heading}>{phrase.english}</Text>
            <Text style={styles.muted}>Listen, read, and switch dialects</Text>
          </View>
          <TouchableOpacity onPress={() => toggleBookmark(phrase.id)} style={styles.bookmarkButton}>
            <Ionicons
              name={phrase.isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={phrase.isBookmarked ? '#4f46e5' : '#6b7280'}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.heroCard, { backgroundColor: theme.softBg, borderColor: theme.accent2 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroLabel}>Translation / Transliteration</Text>
            <Text style={styles.heroText}>{phrase.english}</Text>
            <Text style={styles.heroSubText}>
              {currentDialectEntry?.transliteration || phrase.fushaTransliteration}
            </Text>
          </View>
          <TouchableOpacity onPress={playDefaultAudio} style={styles.heroPlay}>
            <Ionicons name="play" size={20} color="#111827" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voice samples</Text>
          {currentDialectEntry ? (
            <View style={styles.audioRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.audioDialect}>{currentDialectEntry.name}</Text>
                <Text style={styles.audioScript}>{currentDialectEntry.arabicScript || '—'}</Text>
                <Text style={styles.audioTranslit}>{currentDialectEntry.transliteration || '—'}</Text>
                <View style={styles.sampleRow}>
                  {(currentDialectEntry.samples && currentDialectEntry.samples.length
                    ? currentDialectEntry.samples
                    : [
                        { id: `${currentDialectEntry.name}-1`, speaker: 'Speaker 1' },
                        { id: `${currentDialectEntry.name}-2`, speaker: 'Speaker 2' },
                      ]
                  ).map((s, idx) => (
                    <TouchableOpacity
                      key={s.id}
                      style={styles.sampleChip}
                      onPress={() =>
                        playSampleAudio(
                          currentDialectEntry.name,
                          s.speaker || `Sample ${idx + 1}`
                        )
                      }
                    >
                      <Ionicons name="play" size={14} color="#111827" />
                      <Text style={styles.sampleChipText}>{s.speaker || `Sample ${idx + 1}`}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <Text style={styles.muted}>No samples available for this dialect yet.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Standard Arabic (Fusha)</Text>
          <View style={styles.fushaCard}>
            <Text style={styles.fushaScript}>{phrase.fushaArabic}</Text>
            <Text style={styles.fushaSub}>{phrase.fushaTransliteration}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Context & Usage</Text>
          <Text style={styles.contextText}>
            {phrase.context || 'No additional context available for this phrase yet.'}
          </Text>
        </View>

        {otherDialects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Other dialects</Text>
            {otherDialects.map((d) => (
              <TouchableOpacity
                key={d.name}
                activeOpacity={0.85}
                style={styles.otherDialectCard}
                onPress={() => {
                  setDialect(d.name as DialectType);
                  scrollRef.current?.scrollTo({ y: 0, animated: true });
                }}
              >
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.audioDialect}>{d.name}</Text>
                    <Text style={styles.audioScript}>{d.arabicScript || '—'}</Text>
                    <Text style={styles.audioTranslit}>{d.transliteration || '—'}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#6b7280" />
                </View>
                <Text style={styles.viewDialectLink}>View in this dialect</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ExploreStackScreen() {
  return (
    <ExploreStack.Navigator screenOptions={{ headerShown: false }}>
      <ExploreStack.Screen name="ExploreHome" component={ExploreHomeScreen} />
      <ExploreStack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
      <ExploreStack.Screen name="PhraseDetail" component={PhraseDetailScreen} />
    </ExploreStack.Navigator>
  );
}

function SettingsScreen() {
  const { settings, setDialect, toggleDownload } = useAppState();
  const theme = dialectTheme[settings.currentDialect];
  const cards = [
    { title: 'Voice attribution', icon: 'mic' as const, subtitle: 'Credits for audio recordings' },
    { title: 'Support', icon: 'heart' as const, subtitle: 'Help keep World Peas free' },
    { title: 'Offline downloads', icon: 'cloud-download' as const, subtitle: `${settings.downloadedDialects.length} dialects downloaded` },
    { title: 'Dialects', icon: 'language' as const, subtitle: 'Switch or add dialects' },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={[styles.settingsHeader, { backgroundColor: theme.accent }]}>
        <Text style={styles.settingsTitle}>Settings</Text>
        <Text style={styles.settingsSubtitle}>Customize your experience</Text>
      </View>

      <View style={[styles.settingsCard, { borderColor: theme.accent2 }]}>
        <Text style={styles.settingsCardTitle}>Current dialect</Text>
        {(['Egyptian', 'Levantine'] as DialectType[]).map((d) => (
          <TouchableOpacity
            key={d}
            style={[
              styles.settingsOption,
              {
                borderColor: settings.currentDialect === d ? theme.accent : '#e5e7eb',
                backgroundColor: settings.currentDialect === d ? theme.softBg : '#fff',
              },
            ]}
            onPress={() => setDialect(d)}
          >
            <Text style={styles.settingsOptionText}>{d} Arabic</Text>
            {settings.currentDialect === d && <Ionicons name="checkmark-circle" size={20} color={theme.accent} />}
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.settingsCard, { borderColor: theme.accent2 }]}>
        <Text style={styles.settingsCardTitle}>Offline downloads</Text>
        {(['Egyptian', 'Levantine'] as DialectType[]).map((d) => {
          const downloaded = settings.downloadedDialects.includes(d);
          return (
            <TouchableOpacity
              key={d}
              style={[
                styles.settingsOption,
                { backgroundColor: downloaded ? theme.softBg : '#fff', borderColor: '#e5e7eb' },
              ]}
              onPress={() => toggleDownload(d)}
            >
              <Text style={styles.settingsOptionText}>{d} audio</Text>
              <Ionicons
                name={downloaded ? 'cloud-done' : 'cloud-download'}
                size={20}
                color={downloaded ? theme.accent : '#6b7280'}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.settingsList}>
        {cards.map((c) => (
          <View key={c.title} style={styles.settingsListItem}>
            <Ionicons name={c.icon} size={18} color={theme.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.settingsListTitle}>{c.title}</Text>
              <Text style={styles.settingsListSubtitle}>{c.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

function OnboardingScreen({ onSelect }: { onSelect: (d: DialectType) => void }) {
  return (
    <SafeAreaView style={styles.onboardWrapper}>
      <View style={styles.onboardCard}>
        <Text style={styles.onboardIcon}>✨</Text>
        <Text style={styles.onboardTitle}>Welcome to World Peas!</Text>
        <Text style={styles.onboardSubtitle}>Choose your Arabic adventure</Text>
        {(['Egyptian', 'Levantine'] as DialectType[]).map((d) => (
          <TouchableOpacity
            key={d}
            style={[
              styles.onboardOption,
              d === 'Egyptian' ? styles.onboardOptionEgyptian : styles.onboardOptionLevantine,
            ]}
            onPress={() => onSelect(d)}
          >
            <Text style={styles.onboardOptionTitle}>{d} Arabic</Text>
            <Text style={styles.onboardOptionSubtitle}>
              {d === 'Egyptian' ? 'Warm & friendly • Ancient culture' : 'Mediterranean • Rich heritage'}
            </Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.onboardFooter}>You can change this anytime in Settings</Text>
      </View>
    </SafeAreaView>
  );
}

function SearchScreen() {
  const navigation = useNavigation<any>();
  const { phrases, settings, toggleBookmark, incrementUsage } = useAppState();
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
        renderItem={({ item }) => (
          <MinimalPhraseCard
            phrase={item}
            currentDialect={settings.currentDialect}
            onPress={() => {
              incrementUsage(item.id);
              navigation.navigate('Explore', {
                screen: 'PhraseDetail',
                params: { phraseId: item.id },
              });
            }}
            onPlay={() => Alert.alert('Audio', `Play default audio for "${item.english}"`)}
            onToggleBookmark={() => toggleBookmark(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.muted}>
              {query ? 'No results' : 'Start typing to search'}
            </Text>
          </View>
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
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.muted}>No bookmarks yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function CultureScreen() {
  const { settings } = useAppState();
  const [activeSpeaker, setActiveSpeaker] = useState<typeof speakers[number] | null>(null);
  const [activeBlog, setActiveBlog] = useState<typeof blogPosts[number] | null>(null);

  const theme = dialectTheme[settings.currentDialect];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={[styles.cultureHero, { backgroundColor: theme.softBg }]}>
        <View style={styles.cultureHeroGradient} />
        <View style={styles.rowBetween}>
          <Text style={styles.cultureTitle}>Culture & Voices</Text>
        </View>
        <Text style={styles.cultureSubtitle}>Meet our speakers and dive into dialect stories.</Text>
        <View style={styles.cultureBadgesRow}>
          <View style={[styles.cultureBadge, { backgroundColor: theme.chipBg }]}>
            <Text style={[styles.cultureBadgeText, { color: theme.chipText }]}>
              {settings.currentDialect} theme
            </Text>
          </View>
          <View style={[styles.cultureBadge, { backgroundColor: '#fff' }]}>
            <Text style={styles.cultureBadgeText}>Art spot ready 🎨</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Featured voices</Text>
      <FlatList
        data={speakers}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.speakerRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.speakerCard, { backgroundColor: item.avatarColor }]}
            activeOpacity={0.85}
            onPress={() => setActiveSpeaker(item)}
          >
            <View style={styles.speakerAvatar}>
              <Text style={styles.speakerInitial}>{item.name[0]}</Text>
            </View>
            <Text style={styles.speakerName}>{item.name}</Text>
            <Text style={styles.speakerRole}>{item.role}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Blogs & Stories</Text>
      <FlatList
        data={blogPosts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={styles.blogGrid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.blogCard, { backgroundColor: item.imageColor }]}
            activeOpacity={0.9}
            onPress={() => setActiveBlog(item)}
          >
            <View style={styles.blogThumbPlaceholder}>
              <Text style={styles.blogImageText}>Art slot</Text>
            </View>
            <Text style={styles.blogTitle}>{item.title}</Text>
            <Text style={styles.blogExcerpt} numberOfLines={2}>
              {item.excerpt}
            </Text>
            <View style={styles.blogTagRow}>
              <View style={styles.blogTag}>
                <Text style={styles.blogTagText}>{item.tag}</Text>
              </View>
              <Text style={styles.blogDialect}>{item.dialect}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Speaker modal */}
      {activeSpeaker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={[styles.modalAvatar, { backgroundColor: activeSpeaker.avatarColor }]}>
              <Text style={styles.modalInitial}>{activeSpeaker.name[0]}</Text>
            </View>
            <Text style={styles.modalTitle}>{activeSpeaker.name}</Text>
            <Text style={styles.modalSubtitle}>{activeSpeaker.role}</Text>
            <View style={styles.modalChipRow}>
              <View style={[styles.cultureBadge, { backgroundColor: theme.chip }]}>
                <Text style={[styles.cultureBadgeText, { color: theme.chipText }]}>
                  {activeSpeaker.dialect}
                </Text>
              </View>
              <View style={styles.cultureBadge}>
                <Text style={styles.cultureBadgeText}>Voice</Text>
              </View>
            </View>
            <Text style={styles.modalBody}>{activeSpeaker.bio}</Text>
            <View style={styles.sampleRow}>
              {activeSpeaker.samples.map((s, idx) => (
                <TouchableOpacity
                  key={s.id}
                  style={styles.sampleChip}
                  onPress={() =>
                    Alert.alert('Audio', `Play ${activeSpeaker.name} sample ${idx + 1}`)
                  }
                >
                  <Ionicons name="play" size={14} color="#111827" />
                  <Text style={styles.sampleChipText}>{s.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={() => setActiveSpeaker(null)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Blog modal */}
      {activeBlog && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={[styles.blogThumbLarge, { backgroundColor: activeBlog.imageColor }]}>
              <Text style={styles.blogImageText}>Art slot</Text>
            </View>
            <Text style={styles.modalTitle}>{activeBlog.title}</Text>
            <Text style={styles.modalSubtitle}>{activeBlog.dialect} · {activeBlog.tag}</Text>
            <Text style={styles.modalBody}>{activeBlog.body}</Text>
            <TouchableOpacity onPress={() => setActiveBlog(null)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

function RootNavigator() {
  const { settings, completeOnboarding } = useAppState();

  if (!settings.hasCompletedOnboarding) {
    return <OnboardingScreen onSelect={completeOnboarding} />;
  }

  return (
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
                    : route.name === 'Bookmarks'
                      ? 'bookmark-outline'
                      : 'settings-outline';
            return <Ionicons name={icon as any} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Explore" component={ExploreStackScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Culture" component={CultureScreen} />
        <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Provider>
        <RootNavigator />
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryGrid: {
    paddingBottom: 32,
  },
  categoryTile: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flex: 0.48,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryTileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  categoryBadgeText: {
    fontWeight: '700',
    fontSize: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  categoryDescription: {
    color: '#4b5563',
    fontSize: 13,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    marginRight: 10,
  },
  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
  },
  countPillText: {
    fontWeight: '600',
    color: '#111827',
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  bookmarkButton: {
    padding: 8,
    backgroundColor: '#eef2ff',
    borderRadius: 10,
  },
  sampleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  sampleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 6,
  },
  sampleChipText: {
    marginLeft: 6,
    fontWeight: '600',
    color: '#111827',
  },
  miniCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  miniCardText: {
    flex: 1,
    marginRight: 10,
  },
  miniTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  miniTranslit: {
    color: '#4b5563',
    fontSize: 13,
  },
  miniActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniPlay: {
    padding: 10,
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    marginRight: 8,
  },
  miniBookmark: {
    padding: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  heroCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 14,
  },
  heroLabel: {
    color: '#6b7280',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  heroText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  heroSubText: {
    color: '#4b5563',
    marginTop: 4,
  },
  heroPlay: {
    padding: 12,
    backgroundColor: '#eef2ff',
    borderRadius: 14,
    marginLeft: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  audioRow: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  audioDialect: {
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  audioScript: {
    color: '#111827',
    marginBottom: 2,
  },
  audioTranslit: {
    color: '#4b5563',
    fontSize: 13,
  },
  audioPlay: {
    padding: 10,
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    marginLeft: 10,
  },
  fushaCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  fushaScript: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  fushaSub: {
    color: '#4b5563',
  },
  contextText: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    color: '#4b5563',
    lineHeight: 20,
  },
  otherDialectCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
  },
  viewDialectLink: {
    color: '#4f46e5',
    fontWeight: '700',
    marginTop: 6,
  },
  cultureHero: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cultureHeroGradient: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  cultureTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  cultureSubtitle: {
    color: '#4b5563',
    marginTop: 4,
    marginBottom: 8,
  },
  cultureBadgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cultureBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
  },
  cultureBadgeText: {
    fontWeight: '700',
    color: '#111827',
    fontSize: 12,
  },
  speakerRow: {
    paddingVertical: 8,
  },
  speakerCard: {
    width: 120,
    borderRadius: 16,
    padding: 10,
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  speakerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  speakerInitial: {
    fontWeight: '800',
    color: '#111827',
  },
  speakerName: {
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  speakerRole: {
    color: '#1f2937',
    fontSize: 12,
  },
  blogGrid: {
    paddingBottom: 80,
    paddingTop: 8,
  },
  blogCard: {
    borderRadius: 16,
    padding: 10,
    width: '48%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  blogThumbPlaceholder: {
    height: 80,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  blogThumbLarge: {
    height: 160,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  blogImageText: {
    color: '#6b7280',
    fontWeight: '700',
  },
  blogTitle: {
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  blogExcerpt: {
    color: '#374151',
    fontSize: 13,
    marginBottom: 8,
  },
  blogTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blogTag: {
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  blogTagText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  blogDialect: {
    color: '#374151',
    fontWeight: '700',
  },
  modalOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalInitial: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    color: '#111827',
  },
  modalSubtitle: {
    textAlign: 'center',
    color: '#4b5563',
    marginBottom: 8,
  },
  modalChipRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  modalBody: {
    color: '#374151',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalClose: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#111827',
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  settingsHeader: {
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
  },
  settingsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  settingsSubtitle: {
    color: '#fef3c7',
    marginTop: 4,
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  settingsCardTitle: {
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  settingsOption: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  settingsOptionText: {
    fontWeight: '700',
    color: '#111827',
  },
  settingsList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 8,
  },
  settingsListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  settingsListTitle: {
    fontWeight: '700',
    color: '#111827',
  },
  settingsListSubtitle: {
    color: '#6b7280',
    fontSize: 12,
  },
  onboardWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0f172a',
  },
  onboardCard: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  onboardIcon: {
    textAlign: 'center',
    fontSize: 28,
    marginBottom: 8,
  },
  onboardTitle: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  onboardSubtitle: {
    textAlign: 'center',
    color: '#475569',
    marginBottom: 12,
  },
  onboardOption: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
  },
  onboardOptionEgyptian: {
    backgroundColor: '#fff7ed',
    borderColor: '#f59e0b',
  },
  onboardOptionLevantine: {
    backgroundColor: '#eef2ff',
    borderColor: '#6366f1',
  },
  onboardOptionTitle: {
    fontWeight: '800',
    color: '#0f172a',
  },
  onboardOptionSubtitle: {
    color: '#475569',
    marginTop: 4,
  },
  onboardFooter: {
    textAlign: 'center',
    color: '#94a3b8',
    marginTop: 6,
  },
});
