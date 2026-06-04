export type SpeakerName = 'Habib' | 'Ghaina' | 'Halad' | 'Salim';
export type SpeakerFolder = 'habib-ghaina' | 'halad-salim';

export interface VoiceSample {
  speaker: SpeakerName;
  folder: SpeakerFolder;
  prefix: string;
  phraseNum: number;
  trackNum: number;
  audioUrl: string;
}

export interface Dialect {
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
  dialects: Dialect[];
  category: string;
  timesQueried: number;
  isBookmarked: boolean;
  folderId?: string;
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
