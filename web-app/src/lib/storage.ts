import { Folder, PhraseState, ThemePreference, DialectLabel } from '../types';

const KEYS = {
  phraseState: 'phraseState',
  folders: 'folders',
  settings: 'appSettings',
  legacyPhrases: 'phrases',
  legacyVersion: 'dataVersion',
} as const;

export interface AppSettings {
  currentDialect: DialectLabel;
  hasCompletedOnboarding: boolean;
  theme: ThemePreference;
  preferredSpeaker?: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  currentDialect: 'Egyptian',
  hasCompletedOnboarding: false,
  theme: 'system',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
  } catch {
    return fallback;
  }
}

function readRaw<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or private-mode failures are non-fatal: the app stays usable,
    // it just will not remember this session.
  }
}

export function loadSettings(): AppSettings {
  return read<AppSettings>(KEYS.settings, DEFAULT_SETTINGS);
}

export function saveSettings(settings: AppSettings) {
  write(KEYS.settings, settings);
}

export function loadFolders(): Folder[] {
  const folders = readRaw<Folder[]>(KEYS.folders, []);
  return Array.isArray(folders) ? folders : [];
}

export function saveFolders(folders: Folder[]) {
  write(KEYS.folders, folders);
}

export type PhraseStateMap = Record<string, PhraseState>;

/**
 * Earlier builds persisted the entire phrase corpus — audio URLs and all — and
 * rewrote it on every bookmark tap, then wiped it whenever the bundled data
 * changed. Lift just the user-owned fields out of that blob once, then drop it.
 */
function migrateLegacyPhrases(): PhraseStateMap | null {
  const legacy = readRaw<unknown>(KEYS.legacyPhrases, null);
  if (!Array.isArray(legacy)) return null;

  const migrated: PhraseStateMap = {};
  for (const entry of legacy) {
    if (!entry || typeof entry !== 'object') continue;
    const { id, isBookmarked, timesQueried, folderId } = entry as Record<string, unknown>;
    if (typeof id !== 'string') continue;
    if (!isBookmarked && !timesQueried && !folderId) continue;
    migrated[id] = {
      isBookmarked: Boolean(isBookmarked),
      timesQueried: typeof timesQueried === 'number' ? timesQueried : 0,
      folderId: typeof folderId === 'string' ? folderId : undefined,
    };
  }

  localStorage.removeItem(KEYS.legacyPhrases);
  localStorage.removeItem(KEYS.legacyVersion);
  return migrated;
}

export function loadPhraseState(): PhraseStateMap {
  const existing = readRaw<PhraseStateMap | null>(KEYS.phraseState, null);
  if (existing && typeof existing === 'object') return existing;

  const migrated = migrateLegacyPhrases();
  if (migrated) {
    write(KEYS.phraseState, migrated);
    return migrated;
  }
  return {};
}

export function savePhraseState(state: PhraseStateMap) {
  write(KEYS.phraseState, state);
}

export const EMPTY_PHRASE_STATE: PhraseState = { isBookmarked: false, timesQueried: 0 };
