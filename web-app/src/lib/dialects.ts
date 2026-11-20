import { DialectId, DialectLabel } from '../types';

export interface DialectConfig {
  id: DialectId;
  /** Value persisted in settings. Internal: 'Levantine' is kept for old saves. */
  label: DialectLabel;
  /** What users see. Our Levantine recordings are all Jordanian, so say so. */
  name: string;
  /** Hello in this dialect, for Bisbis's speech bubble. */
  greeting: { ar: string; tr: string };
  /** Endonym, shown under the label. */
  nativeName: string;
  /** Where the dialect is spoken — one line, for onboarding and settings. */
  region: string;
  /** Which regional variant the phrase data actually represents. */
  variant: string;
  /** Where its recordings were made, for credits. */
  recordedIn: string;
  /**
   * Recording status. `partial` means some phrases have audio; `pending` means
   * the recordings exist but are not published yet. The UI must never imply a
   * dialect has audio it does not have.
   */
  audio: 'available' | 'pending';
  /** Shown wherever we would otherwise be silent about missing audio. */
  audioNote?: string;
}

export const DIALECTS: Record<DialectId, DialectConfig> = {
  egyptian: {
    id: 'egyptian',
    label: 'Egyptian',
    name: 'Egyptian',
    greeting: { ar: 'أهلاً! إزيك؟', tr: 'ahlan! izzayyak?' },
    nativeName: 'المصرية',
    region: 'Egypt · recorded in Cairo',
    variant: 'Cairene',
    recordedIn: 'Cairo',
    audio: 'available',
    audioNote:
      'No Egyptian recording for this phrase yet. Modern Standard Arabic is shown instead.',
  },
  levantine: {
    id: 'levantine',
    label: 'Levantine',
    name: 'Jordanian',
    greeting: { ar: 'مرحبا! كيفك؟', tr: 'marhaba! kifak?' },
    nativeName: 'الأردنية',
    region: 'Jordan · recorded in Amman',
    variant: 'Jordanian',
    recordedIn: 'Amman',
    audio: 'available',
  },
};

export const DIALECT_IDS = Object.keys(DIALECTS) as DialectId[];

export function dialectFromLabel(label: string): DialectId {
  return label === 'Levantine' ? 'levantine' : 'egyptian';
}

/** Applies the dialect + colour-scheme axes to <html>. */
export function applyDocumentTheme(dialect: DialectId, dark: boolean) {
  const root = document.documentElement;
  root.setAttribute('data-dialect', dialect);
  root.classList.toggle('dark', dark);
}
