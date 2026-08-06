import { SVGProps } from 'react';

/**
 * Category glyphs — one geometric-line system.
 *
 * 24×24 grid, 1.5 stroke, round caps and joins, `currentColor` throughout so a
 * glyph inherits the dialect accent and the colour scheme without any prop
 * plumbing. These replace the emoji the categories used to ship with: emoji
 * render differently on every platform, ignore the type and colour system, and
 * flag emoji do not render at all on Windows.
 */

type IconProps = SVGProps<SVGSVGElement>;

function Glyph({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Speech bubble with a tail — talking to someone. */
export function ConversationIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M5.5 4.5h13A2.5 2.5 0 0 1 21 7v6.5a2.5 2.5 0 0 1-2.5 2.5H10l-4 3.5V16h-.5A2.5 2.5 0 0 1 3 13.5V7a2.5 2.5 0 0 1 2.5-2.5Z" />
      <path d="M8.5 10.25h.01M12 10.25h.01M15.5 10.25h.01" />
    </Glyph>
  );
}

/** Bowl with rising steam — eating out. */
export function RestaurantsIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M3 12h18a9 9 0 0 1-18 0Z" />
      <path d="M7 21h10" />
      <path d="M9.5 8.5c-1-1.5.5-2.25 0-4M14.5 8.5c-1-1.5.5-2.25 0-4" />
    </Glyph>
  );
}

/** Monumental arch — sights and landmarks. */
export function TourismIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M5 20v-8a7 7 0 0 1 14 0v8" />
      <path d="M2.5 20h19" />
      <path d="M9.5 20v-7.5a2.5 2.5 0 0 1 5 0V20" />
    </Glyph>
  );
}

/** Car with a roof sign. */
export function TaxisIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="9" y="3" width="6" height="3" rx="0.9" />
      <path d="M3.5 16.5v-3l2.2-4.5h12.6l2.2 4.5v3" />
      <path d="M3.5 16.5h17" />
      <path d="M6 13h12" />
      <circle cx="7.5" cy="18" r="1.6" />
      <circle cx="16.5" cy="18" r="1.6" />
    </Glyph>
  );
}

/** Bus — getting between places. */
export function TravelIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="4" y="3.5" width="16" height="13.5" rx="2.2" />
      <path d="M4 9.5h16" />
      <path d="M12 3.5v6" />
      <path d="M7 13.5h.01M17 13.5h.01" />
      <path d="M7.5 17v2M16.5 17v2" />
    </Glyph>
  );
}

/** Keypad — counting. */
export function NumbersIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="4.5" y="2.75" width="15" height="18.5" rx="2.4" />
      <path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01" />
    </Glyph>
  );
}

/** Alert triangle — urgent help. */
export function EmergenciesIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 3.75 21.5 20H2.5L12 3.75Z" />
      <path d="M12 10v3.75" />
      <path d="M12 16.75h.01" />
    </Glyph>
  );
}

export const CATEGORY_ICONS = {
  conversation: ConversationIcon,
  restaurants: RestaurantsIcon,
  tourism: TourismIcon,
  taxis: TaxisIcon,
  travel: TravelIcon,
  numbers: NumbersIcon,
  emergencies: EmergenciesIcon,
} as const;

export type CategoryIconKey = keyof typeof CATEGORY_ICONS;

export function CategoryIcon({
  category,
  ...props
}: IconProps & { category: string }) {
  const Icon = CATEGORY_ICONS[category as CategoryIconKey] ?? ConversationIcon;
  return <Icon {...props} />;
}
