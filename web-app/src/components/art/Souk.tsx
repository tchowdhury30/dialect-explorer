import { CSSProperties } from 'react';

/** Shared souk props: lanterns, stars and the stall skyline. */

const LANTERNS = {
  terracotta: ['#e2785a', '#9a3c2a', '#ffd98a', '#ffcf6b'],
  teal: ['#2e9c8f', '#1d5f58', '#c9fff3', '#9ff0e0'],
  saffron: ['#f2b33d', '#a8721a', '#fff0b8', '#ffcf6b'],
  rose: ['#c2477f', '#7a2650', '#ffd6e4', '#ffb3c7'],
  violet: ['#7d6ad6', '#45389a', '#e6e0ff', '#c9bfff'],
} as const;

export type LanternColor = keyof typeof LANTERNS;

export function Lantern({
  color = 'terracotta',
  style,
  className = '',
}: {
  color?: LanternColor;
  style?: CSSProperties;
  className?: string;
}) {
  const [body, cap, window, halo] = LANTERNS[color];
  return (
    <svg
      viewBox="0 0 30 56"
      width="30"
      height="56"
      aria-hidden="true"
      style={style}
      className={`anim-sway absolute ${className}`}
    >
      <line x1="15" y1="0" x2="15" y2="10" stroke="#f3c98b" />
      <circle className="anim-glow" cx="15" cy="30" r="16" fill={halo} opacity="0.35" />
      <path d="M8 12h14l4 8-2 16H6L4 20z" fill={body} />
      <path d="M8 12h14l-2 4H10z" fill={cap} />
      <rect x="11" y="18" width="8" height="14" rx="3" fill={window} />
      <path d="M6 36h18l-4 6H10z" fill={cap} />
    </svg>
  );
}

const STAR_SPOTS = [
  [12, 30, 0],
  [35, 16, 0.6],
  [58, 44, 1.1],
  [74, 12, 0.3],
  [6, 108, 1.6],
  [46, 118, 2],
  [90, 70, 0.9],
] as const;

export function Stars({ count = 7 }: { count?: number }) {
  return (
    <>
      {STAR_SPOTS.slice(0, count).map(([x, y, d]) => (
        <i
          key={`${x}-${y}`}
          aria-hidden="true"
          className="anim-twinkle absolute h-[3px] w-[3px] rounded-full bg-white"
          style={{ left: `${x}%`, top: y, animationDelay: `${d}s` }}
        />
      ))}
    </>
  );
}

/** Market stalls along the bottom of the dusk sky. */
export function Stalls({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 96" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d="M0 96V58l30-14 30 14v38z" fill="#3a2440" />
      <path d="M60 96V46h70v50z" fill="#43284a" />
      <path d="M55 46h80l-6 14H61z" fill="#e2785a" />
      <path d="M65 46h10l-2 14h-8zM85 46h10l-1 14h-8zM105 46h10v14h-9zM125 46h10l-1 14h-8z" fill="#fff3e0" />
      <rect x="74" y="70" width="12" height="12" rx="2" fill="#ffd98a" />
      <rect x="102" y="70" width="12" height="12" rx="2" fill="#ffd98a" />
      <path d="M130 96V64q40-34 80 0v32z" fill="#2f1f38" />
      <circle cx="170" cy="46" r="5" fill="#2f1f38" />
      <path d="M210 96V50h120v46z" fill="#43284a" />
      <path d="M205 50h130l-6 14H211z" fill="#2e9c8f" />
      <path d="M215 50h10l-2 14h-8zM239 50h10l-1 14h-8zM263 50h10v14h-9zM287 50h10l-1 14h-8zM311 50h10l-1 14h-8z" fill="#fff3e0" />
      <path d="M330 96V40h8V30h4v10h8v56z" fill="#2f1f38" />
    </svg>
  );
}

/** The lantern string draped across the sky. */
export function LanternString() {
  return (
    <svg
      viewBox="0 0 380 70"
      preserveAspectRatio="none"
      className="absolute -left-2.5 top-0 h-[70px] w-[calc(100%+20px)]"
      aria-hidden="true"
    >
      <path d="M0 8 Q190 46 380 8" stroke="#f3c98b" strokeWidth="1.5" fill="none" opacity="0.7" />
    </svg>
  );
}
