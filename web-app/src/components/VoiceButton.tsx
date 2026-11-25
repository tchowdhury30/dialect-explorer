import { VoiceSample } from '../types';
import { useAudio } from '../lib/audio';
import { photoFor } from '../lib/speakers';
import { SpeakerAvatar } from './SpeakerAvatar';

/**
 * A speaker chip: their face and name. Tap to hear them say the phrase. While
 * it sounds, the chip fills with the category colour, a ring pulses out from
 * it and an equalizer dances — so "who is talking" never rests on colour alone.
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
      aria-label={sample.spokenArabic ? `${label}: ${sample.spokenArabic}` : label}
      aria-pressed={isPlaying}
      className={`relative z-10 inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3.5 font-display text-sm font-semibold transition-[background,transform,color] duration-200 active:scale-95 ${
        hasFailed
          ? 'bg-surface text-ink-soft line-through'
          : isActive
            ? 'playing-ring bg-cat text-white'
            : 'bg-cat-soft text-cat-ink hover:-translate-y-0.5'
      }`}
    >
      <SpeakerAvatar name={sample.speaker} photo={photoFor(sample.speaker)} size={30} />
      {sample.speaker}
      {sample.spokenArabic && (
        <span lang="ar" dir="rtl" className="text-sm font-normal">{sample.spokenArabic}</span>
      )}
      {isPlaying || isLoading ? (
        <span aria-hidden="true" className={`inline-flex h-3.5 items-end gap-[2px] ${isLoading ? 'opacity-50' : ''}`}>
          <i className="eq-bar-lg" />
          <i className="eq-bar-lg" />
          <i className="eq-bar-lg" />
          <i className="eq-bar-lg" />
        </span>
      ) : (
        <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true" className="opacity-70">
          <path d="M3 1.5 10.5 6 3 10.5z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
