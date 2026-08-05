import { ChevronDown, SettingsIcon } from 'lucide-react';
import { DialectId } from '../types';
import { DIALECTS, DIALECT_IDS } from '../lib/dialects';
import { BRAND } from '../lib/brand';
import { Logo } from './Logo';

interface MastheadProps {
  dialect: DialectId;
  onDialectChange: (dialect: DialectId) => void;
  onOpenSettings: () => void;
}

/**
 * The masthead: wordmark, a single rule, then the standfirst.
 *
 * The dialect control *is* the standfirst — tapping "Egyptian Arabic" switches
 * the guide. An earlier version put a flag toggle up here; at the size a
 * masthead allows, flag artwork degrades into coloured mush (the Egyptian
 * tricolour especially), and it competed with the wordmark for the same
 * horizontal band. Naming the dialect in words is both legible and more
 * honest about what the control does.
 */
export function Masthead({ dialect, onDialectChange, onOpenSettings }: MastheadProps) {
  const config = DIALECTS[dialect];

  const cycleDialect = () => {
    const i = DIALECT_IDS.indexOf(dialect);
    onDialectChange(DIALECT_IDS[(i + 1) % DIALECT_IDS.length]);
  };

  return (
    <header className="safe-top px-[22px] pt-7">
      <div className="relative flex items-start justify-center">
        <h1>
          <Logo size="md" />
        </h1>

        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Settings"
          className="absolute -right-1.5 top-0 p-1.5 text-ink-soft transition-colors hover:text-ink"
        >
          <SettingsIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-6 border-t border-line" />

      <div className="flex flex-col items-center pb-6 pt-5 text-center">
        <h2 className="max-w-[15rem] text-[1.3125rem] font-normal leading-[1.35] tracking-[-0.012em] text-ink">
          {BRAND.standfirst}{' '}
          <button
            type="button"
            onClick={cycleDialect}
            aria-label={`Dialect: ${config.label} Arabic. Tap to switch.`}
            className="group inline-flex items-baseline gap-1 border-b border-brand/40 pb-0.5 italic text-brand-ink transition-colors hover:border-brand"
          >
            {config.label} Arabic
            <ChevronDown
              className="h-3.5 w-3.5 shrink-0 self-center text-brand opacity-60 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </button>
        </h2>
      </div>
    </header>
  );
}
