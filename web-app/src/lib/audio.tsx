import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';

export type AudioStatus = 'idle' | 'loading' | 'playing' | 'error';

interface AudioContextValue {
  /** Identifier of the clip currently loading/playing, or null. */
  activeId: string | null;
  status: AudioStatus;
  /** Ids that failed to load this session, so the UI can mark them unavailable. */
  failedIds: ReadonlySet<string>;
  play: (id: string, url: string) => void;
  stop: () => void;
  /** Playback speed. Pitch is preserved, so slow speech still sounds natural. */
  rate: PlaybackRate;
  setRate: (rate: PlaybackRate) => void;
}

export const RATES = [1, 0.75, 0.5] as const;
export type PlaybackRate = (typeof RATES)[number];
const RATE_KEY = 'playbackRate';

function loadRate(): PlaybackRate {
  try {
    const n = Number(localStorage.getItem(RATE_KEY));
    return (RATES as readonly number[]).includes(n) ? (n as PlaybackRate) : 1;
  } catch {
    return 1;
  }
}

function applyRate(el: HTMLAudioElement, rate: number) {
  el.playbackRate = rate;
  el.preservesPitch = true;
  // Older Safari only knows the prefixed name.
  (el as HTMLAudioElement & { webkitPreservesPitch?: boolean }).webkitPreservesPitch = true;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

/**
 * One <audio> element for the whole app.
 *
 * Previously every speaker button owned its own element, so tapping four
 * speakers played four clips on top of each other. Centralising playback also
 * gives a single place to track load failures — some phrases are missing a
 * recording for some speakers.
 */
export function AudioProvider({ children }: { children: ReactNode }) {
  const elementRef = useRef<HTMLAudioElement | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [status, setStatus] = useState<AudioStatus>('idle');
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());
  const [rate, setRateState] = useState<PlaybackRate>(loadRate);
  const rateRef = useRef<PlaybackRate>(rate);

  const setRate = useCallback((next: PlaybackRate) => {
    rateRef.current = next;
    setRateState(next);
    if (elementRef.current) applyRate(elementRef.current, next);
    try {
      localStorage.setItem(RATE_KEY, String(next));
    } catch {
      // not remembered this session; still applies
    }
  }, []);

  const teardown = useCallback(() => {
    const el = elementRef.current;
    if (el) {
      el.pause();
      el.removeAttribute('src');
      el.load();
      elementRef.current = null;
    }
    activeIdRef.current = null;
  }, []);

  const stop = useCallback(() => {
    teardown();
    setActiveId(null);
    setStatus('idle');
  }, [teardown]);

  const play = useCallback(
    (id: string, url: string) => {
      // Tapping the clip that is already active acts as stop.
      if (activeIdRef.current === id) {
        stop();
        return;
      }

      teardown();

      const el = new Audio(url);
      el.preload = 'auto';
      applyRate(el, rateRef.current);
      elementRef.current = el;
      activeIdRef.current = id;
      setActiveId(id);
      setStatus('loading');

      const settle = (next: AudioStatus) => {
        if (activeIdRef.current !== id) return;
        setStatus(next);
        if (next === 'idle' || next === 'error') {
          activeIdRef.current = null;
          setActiveId(null);
        }
      };

      el.onplaying = () => activeIdRef.current === id && setStatus('playing');
      el.onended = () => settle('idle');
      // Only a clip that is still current can fail. Switching voices or
      // closing the sheet tears the element down, which rejects its pending
      // play() with AbortError — that is an interruption, not a bad file.
      const fail = () => {
        if (elementRef.current !== el) return;
        setFailedIds((prev) => new Set(prev).add(id));
        settle('error');
      };
      el.onerror = fail;
      el.play().catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        fail();
      });
    },
    [stop, teardown]
  );

  useEffect(() => teardown, [teardown]);

  const value = useMemo(
    () => ({ activeId, status, failedIds, play, stop, rate, setRate }),
    [activeId, status, failedIds, play, stop, rate, setRate]
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio must be used inside <AudioProvider>');
  return ctx;
}
