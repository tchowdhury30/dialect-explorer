import { useState } from 'react';
import { Heart } from 'lucide-react';

const COLORS = ['#ff5d95', '#ffd166', '#7cc4f0', '#b9a3ff'];

/** Save toggle that bursts into confetti when a phrase is saved. */
export function HeartButton({
  saved,
  onToggle,
  label,
  size = 'md',
  withText = false,
}: {
  saved: boolean;
  onToggle: () => void;
  label: string;
  size?: 'sm' | 'md';
  withText?: boolean;
}) {
  const [bursts, setBursts] = useState<number[]>([]);

  const click = () => {
    if (!saved) {
      const id = Date.now();
      setBursts((b) => [...b, id]);
      setTimeout(() => setBursts((b) => b.filter((x) => x !== id)), 800);
    }
    onToggle();
  };

  const icon = size === 'sm' ? 'h-[1.1rem] w-[1.1rem]' : 'h-5 w-5';

  return (
    <button
      type="button"
      onClick={click}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${label} from saved` : `Save ${label}`}
      className={`relative z-10 inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-display font-semibold transition-colors ${
        withText ? 'h-12 flex-1 rounded-2xl bg-card text-[#c2477f] shadow-card' : 'p-2'
      } ${saved ? 'text-[#ff5d95]' : withText ? '' : 'text-ink-soft hover:text-[#ff5d95]'}`}
    >
      <Heart
        className={`${icon} transition-transform duration-300 ${saved ? 'scale-125' : ''}`}
        style={{ transitionTimingFunction: 'cubic-bezier(.2,1.8,.4,1)' }}
        fill={saved ? 'currentColor' : 'none'}
        aria-hidden="true"
      />
      {withText && (saved ? 'Saved' : 'Save')}
      {bursts.map((id) =>
        Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <span
              key={`${id}-${i}`}
              aria-hidden="true"
              className="burst-dot"
              style={
                {
                  left: 'calc(50% - 3px)',
                  top: 'calc(50% - 3px)',
                  background: COLORS[i % 4],
                  '--x': `${Math.cos(a) * 30}px`,
                  '--y': `${Math.sin(a) * 26}px`,
                } as React.CSSProperties
              }
            />
          );
        })
      )}
    </button>
  );
}
