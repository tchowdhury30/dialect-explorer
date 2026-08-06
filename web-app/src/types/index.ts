export type SpeakerName = 'Habib' | 'Ghaina' | 'Khalid' | 'Salim';
export type SpeakerFolder = 'habib-ghaina' | 'halad-salim';

/** Stable dialect keys. Also used as the `data-dialect` value on <html>. */
export type DialectId = 'egyptian' | 'levantine';

/** Legacy display names kept for the persisted settings blob. */
export type DialectLabel = 'Egyptian' | 'Levantine';

export interface VoiceSample {
  speaker: SpeakerName;
  folder: SpeakerFolder;
  prefix: string;
  phraseNum: number;
  trackNum: number;
  audioUrl: string;
}

/**
 * A phrase rendered in one dialect. A phrase carries an entry only for the
 * dialects it has actually been translated into — absence is meaningful and
 * drives the "not recorded yet" UI rather than falling back to another dialect.
 */
export interface DialectEntry {
  dialectId: DialectId;
  /** Regional name shown to the user, e.g. "Jordanian". */
  name: string;
  arabicScript: string;
  transliteration: string;
  samples: VoiceSample[];
}

export interface Phrase {
  id: string;
  phraseNum: number;
  english: string;
  fushaArabic: string;
  fushaTransliteration: string;
  dialects: DialectEntry[];
  category: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  phraseCount: number;
}

export interface Folder {
  id: string;
  name: string;
}

/**
 * Per-phrase user state, stored separately from the (static, large) phrase
 * corpus so that toggling one bookmark does not rewrite every audio URL.
 */
export interface PhraseState {
  isBookmarked: boolean;
  timesQueried: number;
  folderId?: string;
}

export type ThemePreference = 'light' | 'dark' | 'system';
