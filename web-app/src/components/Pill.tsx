import { ReactNode } from 'react';

/**
 * The one fully-round shape in the system.
 *
 * Everything else — blocks, rows, the index — carries a small 12px radius. The
 * pill's full roundness is what makes it read as a distinct object (a tag, a
 * control) rather than another panel.
 */
export function Pill({
  children,
  tone = 'muted',
  className = '',
}: {
  children: ReactNode;
  tone?: 'muted' | 'accent' | 'solid';
  className?: string;
}) {
  const tones = {
    muted: 'border-line text-ink-soft',
    accent: 'border-brand-line bg-brand-softer text-brand-ink',
    solid: 'border-brand bg-brand text-on-brand',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem] font-medium leading-none ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
