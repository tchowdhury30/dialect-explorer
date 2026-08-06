import { useCallback, useEffect, useState } from 'react';

export interface PhoneSize {
  w: number;
  h: number;
}

export const PHONE_PRESETS: Array<{ id: string; label: string; size: PhoneSize }> = [
  { id: 'se', label: 'iPhone SE', size: { w: 375, h: 667 } },
  { id: '15', label: 'iPhone 15', size: { w: 393, h: 852 } },
  { id: 'pixel', label: 'Pixel 8', size: { w: 412, h: 915 } },
  { id: 'max', label: '15 Pro Max', size: { w: 430, h: 932 } },
];

export const SIZE_LIMITS = { minW: 300, maxW: 560, minH: 440, maxH: 1040 };

const STORAGE_KEY = 'previewSize';
const DEFAULT: PhoneSize = PHONE_PRESETS[1].size;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Desktop-only preview dimensions, remembered between sessions. */
export function usePhoneSize() {
  const [size, setSizeRaw] = useState<PhoneSize>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT;
      const p = JSON.parse(raw) as Partial<PhoneSize>;
      if (typeof p.w !== 'number' || typeof p.h !== 'number') return DEFAULT;
      return {
        w: clamp(p.w, SIZE_LIMITS.minW, SIZE_LIMITS.maxW),
        h: clamp(p.h, SIZE_LIMITS.minH, SIZE_LIMITS.maxH),
      };
    } catch {
      return DEFAULT;
    }
  });

  const setSize = useCallback((next: PhoneSize) => {
    setSizeRaw({
      w: clamp(Math.round(next.w), SIZE_LIMITS.minW, SIZE_LIMITS.maxW),
      h: clamp(Math.round(next.h), SIZE_LIMITS.minH, SIZE_LIMITS.maxH),
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(size));
    } catch {
      // Non-fatal — the size just won't persist.
    }
  }, [size]);

  return { size, setSize };
}

interface PreviewSizerProps {
  size: PhoneSize;
  onChange: (size: PhoneSize) => void;
}

export function PreviewSizer({ size, onChange }: PreviewSizerProps) {
  const active = PHONE_PRESETS.find((p) => p.size.w === size.w && p.size.h === size.h);

  return (
    <section className="mt-9 border-t border-line pt-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[0.59375rem] uppercase tracking-[0.16em] text-ink-soft">
          Preview size
        </h3>
        <output className="text-[0.59375rem] tabular-nums tracking-[0.1em] text-ink-soft">
          {size.w} × {size.h}
        </output>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {PHONE_PRESETS.map((preset) => {
          const isActive = active?.id === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChange(preset.size)}
              aria-pressed={isActive}
              className={`rounded-full border px-2.5 py-1 text-[0.6875rem] font-medium transition-colors ${
                isActive
                  ? 'border-brand bg-brand text-on-brand'
                  : 'border-line text-ink-muted hover:border-brand-line hover:text-ink'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 space-y-2">
        <Slider
          label="Width"
          value={size.w}
          min={SIZE_LIMITS.minW}
          max={SIZE_LIMITS.maxW}
          onChange={(w) => onChange({ ...size, w })}
        />
        <Slider
          label="Height"
          value={size.h}
          min={SIZE_LIMITS.minH}
          max={SIZE_LIMITS.maxH}
          onChange={(h) => onChange({ ...size, h })}
        />
      </div>

      <p className="mt-2.5 text-[0.6875rem] italic leading-relaxed text-ink-soft">
        Or drag the corner of the phone.
      </p>
    </section>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="flex items-center gap-3">
      <span className="w-12 shrink-0 text-[0.6875rem] text-ink-soft">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-line accent-brand"
      />
    </label>
  );
}
