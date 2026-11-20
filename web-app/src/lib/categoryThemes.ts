import type { CSSProperties } from 'react';

/**
 * Every category is its own little place in the souk, with its own colours
 * and scene (components/art/CategoryScene.tsx). Colours are applied as CSS
 * variables (--cat, --cat-soft, --cat-ink), so any card, chip or button
 * inside a category picks them up without props.
 */
export interface CategoryTheme {
  id: string;
  /** Friendly title shown on the category's banner. */
  title: string;
  arabic: string;
  tagline: string;
  accent: string;
  soft: string;
  ink: string;
  /** Dark-mode accent and soft surface. */
  accentDark: string;
  softDark: string;
}

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  conversation: {
    id: 'conversation', title: 'At the ahwa', arabic: 'على القهوة',
    tagline: 'Greetings and small talk over tea',
    accent: '#c8743a', soft: '#ffead3', ink: '#7a3e1c', accentDark: '#f0a466', softDark: '#3a2c2a',
  },
  restaurants: {
    id: 'restaurants', title: 'Food stalls', arabic: 'الأكل',
    tagline: 'Ordering, tasting, paying',
    accent: '#d9930f', soft: '#fff1c8', ink: '#7a5208', accentDark: '#f5c14d', softDark: '#3a3226',
  },
  tourism: {
    id: 'tourism', title: 'Sightseeing', arabic: 'السياحة',
    tagline: 'Tickets, sights and shopping',
    accent: '#3d8fd1', soft: '#dcefff', ink: '#1f5687', accentDark: '#7cbcf0', softDark: '#232f45',
  },
  taxis: {
    id: 'taxis', title: 'Taxi ride', arabic: 'تاكسي',
    tagline: 'Directions, prices and “stop here”',
    accent: '#d6a300', soft: '#fff6c2', ink: '#6e5400', accentDark: '#f7d046', softDark: '#38331f',
  },
  travel: {
    id: 'travel', title: 'On the move', arabic: 'السفر',
    tagline: 'Buses, trains and airports',
    accent: '#7d6ad6', soft: '#ece7ff', ink: '#45389a', accentDark: '#ad9ff5', softDark: '#2d2846',
  },
  numbers: {
    id: 'numbers', title: 'Counting', arabic: 'الأرقام',
    tagline: 'Numbers, prices and days',
    accent: '#d65a8f', soft: '#ffe3ef', ink: '#8a2c57', accentDark: '#f590bd', softDark: '#3c2636',
  },
  emergencies: {
    id: 'emergencies', title: 'Getting help', arabic: 'الطوارئ',
    tagline: 'When something goes wrong',
    accent: '#d94a4a', soft: '#ffe3e1', ink: '#8c2626', accentDark: '#f58a83', softDark: '#3d2529',
  },
};

export function themeFor(category: string): CategoryTheme {
  return CATEGORY_THEMES[category] ?? CATEGORY_THEMES.conversation;
}

/** CSS variables for a category, for a style prop. Dark mode reads the
    -dark pair through the .dark selector in index.css. */
export function themeVars(category: string): CSSProperties {
  const t = themeFor(category);
  return {
    '--cat-l': t.accent,
    '--cat-soft-l': t.soft,
    '--cat-ink-l': t.ink,
    '--cat-d': t.accentDark,
    '--cat-soft-d': t.softDark,
  } as CSSProperties;
}
