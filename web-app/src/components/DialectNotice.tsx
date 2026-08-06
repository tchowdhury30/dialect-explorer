import { Info } from 'lucide-react';
import { DialectId } from '../types';
import { DIALECTS } from '../lib/dialects';

/**
 * Shown wherever a dialect's recordings are not published yet. Being explicit
 * here is what lets the rest of the UI stay honest instead of quietly serving
 * another dialect's audio.
 */
export function DialectNotice({ dialect }: { dialect: DialectId }) {
  const config = DIALECTS[dialect];
  if (config.audio === 'available' || !config.audioNote) return null;

  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-brand-line bg-brand-softer px-3.5 py-3">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
      <p className="text-xs leading-relaxed text-ink-muted">
        <span className="font-semibold text-ink">{config.label} audio is in production.</span>{' '}
        {config.audioNote}
      </p>
    </div>
  );
}
