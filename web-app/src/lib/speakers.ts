import { DialectId, SpeakerName } from '../types';

export interface Speaker {
  id: string;
  /** Display name. Must match SpeakerName for anyone with recordings. */
  name: string;
  dialectId: DialectId;
  /** Square photo in /public/speakers. Absent speakers fall back to a
      generated geometric avatar, so a missing photo is never a broken image. */
  photo?: string;
  /** False where we hold a portrait but have not confirmed the person's name. */
  nameConfirmed: boolean;
}

/**
 * Photos are served from /public/speakers as 320px square JPEGs, converted
 * from the original HEICs. Add a new portrait by dropping the file in and
 * pointing at it here.
 */
export const SPEAKERS: Speaker[] = [
  // Jordanian — the four voices behind every Levantine recording.
  { id: 'habib', name: 'Habib', dialectId: 'levantine', photo: '/speakers/habib.jpg', nameConfirmed: true },
  { id: 'ghaina', name: 'Ghaina', dialectId: 'levantine', nameConfirmed: true },
  // NOTE: photo file is khalid.jpg but the phrase data calls this speaker
  // "Halad". Very likely the same person with the name mis-typed in the data —
  // confirm, then either rename the file or fix SpeakerName across the corpus.
  { id: 'halad', name: 'Halad', dialectId: 'levantine', photo: '/speakers/khalid.jpg', nameConfirmed: false },
  { id: 'salim', name: 'Salim', dialectId: 'levantine', nameConfirmed: true },

  // Egyptian — portraits in hand, recordings still being edited, names to confirm.
  { id: 'eg1', name: 'Egyptian voice', dialectId: 'egyptian', photo: '/speakers/egypt1.jpg', nameConfirmed: false },
  { id: 'eg2', name: 'Egyptian voice', dialectId: 'egyptian', photo: '/speakers/egypt2.jpg', nameConfirmed: false },
  { id: 'eg3', name: 'Egyptian voice', dialectId: 'egyptian', photo: '/speakers/egypt3.jpg', nameConfirmed: false },
];

export function speakersFor(dialect: DialectId): Speaker[] {
  return SPEAKERS.filter((s) => s.dialectId === dialect);
}

/** Portrait for a speaker who appears on a phrase, if we have one. */
export function photoFor(name: SpeakerName | string): string | undefined {
  return SPEAKERS.find((s) => s.name === name)?.photo;
}
