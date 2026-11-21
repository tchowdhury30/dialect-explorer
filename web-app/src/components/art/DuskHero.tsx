import { Settings as SettingsIcon } from 'lucide-react';
import { DialectId } from '../../types';
import { DIALECTS } from '../../lib/dialects';
import { BRAND } from '../../lib/brand';
import { useAudio } from '../../lib/audio';
import { DialectSelect } from '../DialectSelect';
import { Bisbis } from './Bisbis';
import { Lantern, LanternString, Stalls, Stars } from './Souk';

/**
 * Home's header: the souk at dusk. Lanterns sway on a string, stars twinkle,
 * and Bisbis sits on an awning greeting you in your dialect — and talks along
 * whenever a recording plays.
 */
export function DuskHero({
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

  return (
    <header
      className="safe-top relative h-[19rem] overflow-hidden"
      style={{ background: 'linear-gradient(var(--sky-1) 0%, var(--sky-2) 55%, var(--sky-3) 100%)' }}
    >
      <Stars />
      <span
        aria-hidden="true"
        className="absolute right-16 top-6 h-6 w-6 -rotate-[20deg] rounded-full"
        style={{ boxShadow: '7px -3px 0 0 #ffe9b0' }}
      />
      <LanternString />
      <Lantern color="terracotta" style={{ left: '30%', top: 22 }} />
      <Lantern color="teal" style={{ left: '50%', top: 34, animationDuration: '3.8s', animationDelay: '-1s' }} />
      <Lantern color="saffron" style={{ left: '68%', top: 30, animationDuration: '3.1s' }} />
      <Lantern color="rose" style={{ left: '86%', top: 20, animationDuration: '4s', animationDelay: '-2s' }} />

      <button
        type="button"
        onClick={onOpenSettings}
        aria-label="Settings"
        className="absolute right-3 top-3 z-10 rounded-full bg-white/15 p-2 text-white backdrop-blur-sm transition hover:bg-white/25"
      >
        <SettingsIcon className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="absolute left-5 top-[4.25rem] text-white">
        <h1 className="font-kufi text-[2.125rem] leading-none drop-shadow-[0_2px_0_rgba(0,0,0,0.25)]" lang="ar" dir="rtl">
          {BRAND.arabic}
        </h1>
        <p className="mt-1 font-display text-xs font-semibold uppercase tracking-[0.1em] text-white/85">
          {BRAND.name}
        </p>
        <DialectSelect dialect={dialect} onChange={onDialectChange} className="mt-3" />
      </div>

      <Stalls className="absolute bottom-0 left-0 h-24 w-full" />

      <div
        key={dialect}
        className="anim-bubble absolute bottom-[7.5rem] right-[8.25rem] max-w-[9.5rem] rounded-[18px_18px_4px_18px] bg-white px-3 py-2 font-display text-xs font-medium text-brand-ink shadow-float"
      >
        <span lang="ar" dir="rtl" className="block text-base font-bold text-brand">
          {config.greeting.ar}
        </span>
        {config.greeting.tr}
      </div>
      <Bisbis
        pose="sit"
        talking={status === 'playing'}
        className="absolute bottom-10 right-4 w-[7.5rem]"
      />
    </header>
  );
}
