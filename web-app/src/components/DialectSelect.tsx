import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check, ChevronDown } from 'lucide-react';
import { DIALECTS, DIALECT_IDS } from '../lib/dialects';
import { DialectId } from '../types';
import { DialectFlag } from './icons/DialectFlag';

/** Select a dialect without changing it until the user chooses an option. */
export function DialectSelect({
  dialect,
  onChange,
  compact = false,
  className = '',
}: {
  dialect: DialectId;
  onChange: (dialect: DialectId) => void;
  compact?: boolean;
  className?: string;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`Dialect: ${DIALECTS[dialect].name} Arabic`}
          className={`inline-flex items-center gap-2 rounded-full bg-white py-1.5 pl-2 pr-3 font-display font-semibold text-[#302018] shadow-[0_3px_0_rgba(0,0,0,0.2)] transition hover:bg-orange-50 ${compact ? 'text-xs' : 'text-sm'} ${className}`}
        >
          <DialectFlag dialect={dialect} size={compact ? 16 : 20} />
          {DIALECTS[dialect].name}
          <ChevronDown className="h-3.5 w-3.5 text-[#60443a]" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={compact ? 'end' : 'start'}
          sideOffset={8}
          className="z-50 min-w-44 rounded-2xl border border-[#eadbcc] bg-white p-1.5 font-display text-sm text-[#302018] shadow-float"
        >
          <DropdownMenu.RadioGroup value={dialect} onValueChange={(value) => onChange(value as DialectId)}>
            {DIALECT_IDS.map((id) => (
              <DropdownMenu.RadioItem
                key={id}
                value={id}
                className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 font-semibold outline-none data-[highlighted]:bg-[#fff1e3]"
              >
                <DialectFlag dialect={id} size={20} />
                {DIALECTS[id].name}
                <DropdownMenu.ItemIndicator className="ml-auto text-[#964b30]">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
