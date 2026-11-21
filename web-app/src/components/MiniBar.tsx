import { Settings as SettingsIcon } from 'lucide-react';
import { DialectId } from '../types';
import { BRAND } from '../lib/brand';
import { useAudio } from '../lib/audio';
import { DialectSelect } from './DialectSelect';
import { Bisbis } from './art/Bisbis';

/** Slim dusk-coloured bar for tabs other than Home. */
export function MiniBar({
  dialect,
  onDialectChange,
  onOpenSettings,
}: {
  dialect: DialectId;
  onDialectChange: (d: DialectId) => void;
  onOpenSettings: () => void;
}) {
  const { status } = useAudio();

  return (
    <header
      className="safe-top relative flex items-center gap-2 overflow-hidden px-3 pb-2.5 pt-3"
      style={{ background: 'linear-gradient(100deg, var(--sky-1), var(--sky-2) 60%, var(--sky-3))' }}
    >
      <Bisbis pose="peek" talking={status === 'playing'} className="h-9 w-12 shrink-0 translate-y-1.5" />
      <span lang="ar" dir="rtl" className="font-kufi text-xl leading-none text-white">
        {BRAND.arabic}
      </span>
      <DialectSelect dialect={dialect} onChange={onDialectChange} compact className="ml-auto" />
      <button
        type="button"
        onClick={onOpenSettings}
        aria-label="Settings"
        className="rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
      >
        <SettingsIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </header>
  );
}
