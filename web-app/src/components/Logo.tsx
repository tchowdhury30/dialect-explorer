import { BRAND } from '../lib/brand';

/**
 * The stacked lockup: سوق صوت as the hero in Reem Kufi, the Latin
 * transliteration tracked underneath.
 *
 * The Arabic leads because it is the name — the Latin is a transliteration of
 * it, not a parallel brand. Reem Kufi's geometric Kufi forms sit naturally
 * against the ruled, tracked Latin the rest of the app is set in.
 */
export function Logo({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const scale = {
    sm: { ar: 'text-[1.75rem]', la: 'text-[0.5625rem] tracking-[0.34em]', gap: 'gap-1' },
    md: { ar: 'text-[2.5rem]', la: 'text-[0.6875rem] tracking-[0.34em]', gap: 'gap-1.5' },
    lg: { ar: 'text-[3.75rem]', la: 'text-[0.8125rem] tracking-[0.34em]', gap: 'gap-2.5' },
  }[size];

  return (
    <span
      className={`inline-flex flex-col items-center ${scale.gap} ${className}`}
      role="img"
      aria-label={`${BRAND.name} — ${BRAND.arabic}`}
    >
      <span
        lang="ar"
        dir="rtl"
        aria-hidden="true"
        className={`font-kufi leading-none text-brand ${scale.ar}`}
      >
        {BRAND.arabic}
      </span>
      <span
        aria-hidden="true"
        className={`font-semibold uppercase leading-none text-ink-soft ${scale.la}`}
      >
        {BRAND.name}
      </span>
    </span>
  );
}
