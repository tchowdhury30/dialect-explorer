import { DialectId, DialectLabel } from '../types';

export interface DialectConfig {
  id: DialectId;
  /** Value persisted in settings and shown in copy. */
  label: DialectLabel;
  /** Endonym, shown under the label. */
  nativeName: string;
  /** Where the dialect is spoken — one line, for onboarding and settings. */
  region: string;
  /** Which regional variant the phrase data actually represents. */
  variant: string;
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
    nativeName: 'المصرية',
    region: 'Egypt · the most widely understood dialect',
    variant: 'Cairene',
    audio: 'pending',
    audioNote: 'Egyptian recordings are being edited. Modern Standard Arabic is shown meanwhile.',
  },
  levantine: {
    id: 'levantine',
    label: 'Levantine',
    nativeName: 'الشامية',
    region: 'Jordan, Palestine, Syria, Lebanon',
    variant: 'Jordanian',
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
