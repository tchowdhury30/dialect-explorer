import { DialectEntry, DialectId, Phrase } from '../types';

/** The phrase rendered in the requested dialect, or undefined if untranslated. */
export function entryFor(phrase: Phrase, dialect: DialectId): DialectEntry | undefined {
  return phrase.dialects.find((d) => d.dialectId === dialect);
}

/**
 * What to show for a phrase in the current dialect.
 *
 * When a dialect has no entry yet we fall back to Modern Standard Arabic and
 * say so — we never present another dialect's wording or recordings as if they
 * belonged to the selected one.
 */
export interface PhraseView {
  arabic: string;
  transliteration: string;
  /** True when we are showing MSA because the dialect has no entry. */
  isFallback: boolean;
  /** Regional label, e.g. "Jordanian" — undefined when falling back. */
  variant?: string;
  samples: DialectEntry['samples'];
}

export function viewFor(phrase: Phrase, dialect: DialectId): PhraseView {
  const entry = entryFor(phrase, dialect);
  if (entry) {
    return {
      arabic: entry.arabicScript,
      transliteration: entry.transliteration,
      isFallback: false,
      variant: entry.name,
      samples: entry.samples,
    };
  }
  return {
    arabic: phrase.fushaArabic,
    transliteration: phrase.fushaTransliteration,
    isFallback: true,
    samples: [],
  };
}

export function matchesQuery(phrase: Phrase, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  if (phrase.english.toLowerCase().includes(q)) return true;
  if (phrase.fushaArabic.includes(query.trim())) return true;
  if (phrase.fushaTransliteration.toLowerCase().includes(q)) return true;
  return phrase.dialects.some(
    (d) => d.arabicScript.includes(query.trim()) || d.transliteration.toLowerCase().includes(q)
  );
}
