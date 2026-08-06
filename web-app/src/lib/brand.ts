/**
 * Product identity, in one place.
 *
 * سوق صوت — "market of voices". The Latin wordmark is a transliteration of
 * that, not an independent name, so the two always read as the same thing.
 * Changing either is a one-line edit here rather than a grep.
 */
export const BRAND = {
  /** Latin transliteration of سوق صوت. */
  name: 'Sook Sout',
  /** Arabic wordmark, set in Reem Kufi. */
  arabic: 'سوق صوت',
  /** The two words separately, for the stacked lockup and the icon. */
  arabicWords: ['سوق', 'صوت'] as const,
  /** Sits under the masthead rule. */
  standfirst: 'A field phrasebook for',
  tagline: 'Arabic for travellers',
} as const;
