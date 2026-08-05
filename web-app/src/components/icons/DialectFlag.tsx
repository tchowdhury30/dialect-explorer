import { useId } from 'react';
import { DialectId } from '../../types';
import { DIALECTS } from '../../lib/dialects';

/**
 * Flags as SVG rather than emoji.
 *
 * Flag emoji do not render at all on Windows (they fall back to two letters in
 * a box) and vary wildly across platforms elsewhere — not acceptable for a
 * control that identifies which dialect you are looking at.
 */

interface FlagProps {
  dialect: DialectId;
  size?: number;
  className?: string;
}

const BAND = 16 / 3;

export function DialectFlag({ dialect, size = 20, className = '' }: FlagProps) {
  const clipId = useId();
  const label = `${DIALECTS[dialect].label} flag`;

  return (
    <svg
      viewBox="0 0 24 16"
      width={size}
      height={(size * 2) / 3}
      role="img"
      aria-label={label}
      className={`shrink-0 ${className}`}
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="24" height="16" rx="2.5" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {dialect === 'egyptian' ? (
          <>
            <rect width="24" height={BAND} fill="#CE1126" />
            <rect y={BAND} width="24" height={BAND} fill="#FFFFFF" />
            <rect y={BAND * 2} width="24" height={BAND} fill="#000000" />
            <circle cx="12" cy="8" r="1.7" fill="#C09300" />
          </>
        ) : (
          <>
            <rect width="24" height={BAND} fill="#000000" />
            <rect y={BAND} width="24" height={BAND} fill="#FFFFFF" />
            <rect y={BAND * 2} width="24" height={BAND} fill="#007A3D" />
            <path d="M0 0 0 16 9.8 8Z" fill="#CE1126" />
            <circle cx="3.3" cy="8" r="1.15" fill="#FFFFFF" />
          </>
        )}
      </g>

      <rect
        width="24"
        height="16"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.12"
      />
    </svg>
  );
}
