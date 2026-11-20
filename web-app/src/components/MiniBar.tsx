import { motion } from 'motion/react';
import { Settings as SettingsIcon } from 'lucide-react';
import { DialectId } from '../types';
import { DIALECTS, DIALECT_IDS } from '../lib/dialects';
import { BRAND } from '../lib/brand';
import { useAudio } from '../lib/audio';
import { DialectFlag } from './icons/DialectFlag';
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
  const config = DIALECTS[dialect];
  const next = DIALECT_IDS[(DIALECT_IDS.indexOf(dialect) + 1) % DIALECT_IDS.length];

  return (
    <header
      className="safe-top relative flex items-center gap-2 overflow-hidden px-3 pb-2.5 pt-3"
      style={{ background: 'linear-gradient(100deg, var(--sky-1), var(--sky-2) 60%, var(--sky-3))' }}
    >
      <Bisbis pose="peek" talking={status === 'playing'} className="h-9 w-12 shrink-0 translate-y-1.5" />
      <span lang="ar" dir="rtl" className="font-kufi text-xl leading-none text-white">
        {BRAND.arabic}
      </span>
      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={() => onDialectChange(next)}
        aria-label={`Dialect: ${config.name} Arabic. Tap to switch to ${DIALECTS[next].name}.`}
        className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white/90 py-1 pl-1.5 pr-2.5 font-display text-xs font-semibold text-ink"
      >
        <DialectFlag dialect={dialect} size={16} />
        {config.name}
      </motion.button>
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
