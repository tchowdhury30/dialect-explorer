import { useState, useRef, useCallback, useEffect } from 'react';
import { VoiceSample, SpeakerName } from '../types';

const PREF_KEY = 'preferredSpeaker';
const SPEAKERS: SpeakerName[] = ['Habib', 'Ghaina', 'Halad', 'Salim'];

function getPreferredSpeaker(): SpeakerName {
  return (localStorage.getItem(PREF_KEY) as SpeakerName) || 'Habib';
}

export function useAudioPlayer(samples: VoiceSample[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<SpeakerName>(getPreferredSpeaker);

  // Find the sample for the current speaker, falling back to first available
  const getSample = useCallback((speaker: SpeakerName): VoiceSample | undefined => {
    return samples.find(s => s.speaker === speaker) ?? samples[0];
  }, [samples]);

  const play = useCallback(async (speakerOverride?: SpeakerName) => {
    const speaker = speakerOverride ?? currentSpeaker;
    const sample = getSample(speaker);
    if (!sample) return;

    // Stop any current playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(sample.audioUrl);
    audioRef.current = audio;

    audio.onended = () => {
      setIsPlaying(false);
      // Advance to next speaker for the next tap
      const idx = SPEAKERS.indexOf(speaker);
      const next = SPEAKERS[(idx + 1) % SPEAKERS.length];
      setCurrentSpeaker(next);
    };

    audio.onerror = () => {
      // File missing for this speaker — silently skip
      setIsPlaying(false);
      const idx = SPEAKERS.indexOf(speaker);
      const next = SPEAKERS[(idx + 1) % SPEAKERS.length];
      setCurrentSpeaker(next);
    };

    try {
      setIsPlaying(true);
      await audio.play();
    } catch {
      setIsPlaying(false);
    }
  }, [currentSpeaker, getSample]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const setSpeaker = useCallback((speaker: SpeakerName) => {
    setCurrentSpeaker(speaker);
    localStorage.setItem(PREF_KEY, speaker);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return { play, stop, isPlaying, currentSpeaker, setSpeaker, speakers: SPEAKERS };
}
