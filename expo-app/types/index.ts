export interface Dialect {
  name: string;
  arabicScript: string;
  transliteration: string;
  audioUrl?: string;
  samples?: VoiceSample[];
}

export interface VoiceSample {
  id: string;
  speaker?: string;
  note?: string;
  audioUrl?: string;
}

export interface Phrase {
  id: string;
  english: string;
  fushaArabic: string;
  fushaTransliteration: string;
  dialects: Dialect[];
  category: string;
  timesQueried: number;
  isBookmarked: boolean;
  folderId?: string;
  context?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  phraseCount: number;
}

export interface Folder {
  id: string;
  name: string;
}
