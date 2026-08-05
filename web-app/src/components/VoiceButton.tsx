import { VoiceSample } from '../types';
import { useAudio } from '../lib/audio';

/**
 * A voice on the entry's speaker line.
 *
 * Set as text separated by hairline rules rather than as buttons — the line
 * reads as a credit line in a reference book. While a voice is sounding its
 * play mark is replaced by a moving equalizer, so playback state does not rest
 * on colour alone.
 */
export function VoiceButton({ sample, phraseId }: { sample: VoiceSample; phraseId: string }) {
  const { activeId, status, failedIds, play } = useAudio();

  const id = `${phraseId}:${sample.speaker}`;
  const isActive = activeId === id;
  const isPlaying = isActive && status === 'playing';
  const isLoading = isActive && status === 'loading';
  const hasFailed = failedIds.has(id);

  const label = hasFailed
    ? `${sample.speaker} — recording unavailable`
    : isPlaying
      ? `Stop ${sample.speaker}`
      : `Play ${sample.speaker}`;

  return (
    <button
      type="button"
      onClick={() => play(id, sample.audioUrl)}
      disabled={hasFailed}
      aria-label={label}
      aria-pressed={isPlaying}
      className={`relative z-10 inline-flex items-center gap-[7px] px-[13px] py-0.5 text-[0.71875rem] tracking-[0.03em] transition-colors first:pl-0 [&+&]:border-l [&+&]:border-line ${
        hasFailed
          ? 'text-ink-soft line-through decoration-line'
          : isActive
            ? 'font-medium text-brand-ink'
            : 'text-ink-muted hover:text-ink'
      }`}
    >
      {isPlaying || isLoading ? (
        <span
          aria-hidden="true"
          className={`inline-flex h-2.5 w-2.5 items-end gap-[1.5px] text-brand ${
            isLoading ? 'opacity-50' : ''
          }`}
        >
          <i className="eq-bar" />
          <i className="eq-bar" />
          <i className="eq-bar" />
        </span>
      ) : (
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          aria-hidden="true"
          className={isActive ? 'text-brand' : 'text-ink-soft'}
        >
          <path d="M3 1.8 10 6l-7 4.2V1.8Z" />
        </svg>
      )}
      {sample.speaker}
    </button>
  );
}
