/**
 * Generated speaker avatars.
 *
 * The four native speakers are the product's whole differentiator — real
 * people, not synthesis — and they were previously four grey text chips. Each
 * name deterministically picks one of four geometric motifs drawn from Islamic
 * tiling, tinted with the current dialect accent, so the set stays palette-
 * coherent while every speaker stays individually recognisable.
 */

const MOTIFS = [
  // Eight-point star: two overlapping squares.
  <g key="star">
    <rect x="12" y="12" width="24" height="24" rx="2" />
    <rect x="12" y="12" width="24" height="24" rx="2" transform="rotate(45 24 24)" />
  </g>,
  // Concentric hexagons.
  <g key="hex">
    <path d="M24 7 38.7 15.5V32.5L24 41 9.3 32.5V15.5Z" />
    <path d="M24 15 31.8 19.5V28.5L24 33 16.2 28.5V19.5Z" />
  </g>,
  // Four-petal rosette.
  <g key="rosette">
    <circle cx="24" cy="16" r="9" />
    <circle cx="24" cy="32" r="9" />
    <circle cx="16" cy="24" r="9" />
    <circle cx="32" cy="24" r="9" />
  </g>,
  // Diamond lattice.
  <g key="lattice">
    <rect x="17" y="17" width="14" height="14" transform="rotate(45 24 24)" />
    <rect x="7" y="19" width="10" height="10" transform="rotate(45 12 24)" />
    <rect x="31" y="19" width="10" height="10" transform="rotate(45 36 24)" />
  </g>,
];

/** Stable across renders and reloads — no randomness, no stored state. */
function motifFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return hash % MOTIFS.length;
}

interface SpeakerAvatarProps {
  name: string;
  size?: number;
  className?: string;
}

export function SpeakerAvatar({ name, size = 44, className = '' }: SpeakerAvatarProps) {
  const index = motifFor(name);
  const initial = name.trim().charAt(0).toUpperCase();
  const clipId = `avatar-clip-${name.toLowerCase()}`;

  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      role="img"
      aria-label={name}
      className={`shrink-0 ${className}`}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="24" cy="24" r="24" />
        </clipPath>
      </defs>

      <circle cx="24" cy="24" r="24" fill="var(--brand-soft)" />

      <g
        clipPath={`url(#${clipId})`}
        fill="none"
        stroke="var(--brand)"
        strokeWidth="1.25"
        opacity="0.32"
        transform={`rotate(${index * 15} 24 24)`}
      >
        {MOTIFS[index]}
      </g>

      <text
        x="24"
        y="24"
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--brand-ink)"
        fontSize="17"
        fontWeight="600"
        fontFamily="Inter, system-ui, sans-serif"
      >
        {initial}
      </text>
    </svg>
  );
}
