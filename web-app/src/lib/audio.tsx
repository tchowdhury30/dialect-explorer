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
      el.onerror = () => {
        setFailedIds((prev) => new Set(prev).add(id));
        settle('error');
      };

      el.play().catch(() => {
        setFailedIds((prev) => new Set(prev).add(id));
        settle('error');
      });
    },
    [stop, teardown]
  );

  useEffect(() => teardown, [teardown]);

  const value = useMemo(
    () => ({ activeId, status, failedIds, play, stop }),
    [activeId, status, failedIds, play, stop]
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio must be used inside <AudioProvider>');
  return ctx;
}
