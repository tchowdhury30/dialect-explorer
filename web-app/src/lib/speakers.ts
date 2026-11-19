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
  // Jordanian — the four voices behind every Levantine recording. Habib and
  // Ghaina have no portrait yet and render the generated motif instead.
  { id: 'habib', name: 'Habib', dialectId: 'levantine', nameConfirmed: true },
  { id: 'ghaina', name: 'Ghaina', dialectId: 'levantine', nameConfirmed: true },
  { id: 'khalid', name: 'Khalid', dialectId: 'levantine', photo: '/speakers/khalid.jpg', nameConfirmed: true },
  { id: 'salim', name: 'Salim', dialectId: 'levantine', photo: '/speakers/salim.jpg', nameConfirmed: true },

  // Egyptian — Mario voices every Egyptian recording. Which portrait is his is
  // not confirmed yet, so he renders the generated motif.
  { id: 'mario', name: 'Mario', dialectId: 'egyptian', nameConfirmed: true },
  // Portraits in hand, names to confirm. Not counted as voices until they are.
  { id: 'eg1', name: 'Egyptian voice', dialectId: 'egyptian', photo: '/speakers/egypt1.jpg', nameConfirmed: false },
  { id: 'eg2', name: 'Egyptian voice', dialectId: 'egyptian', photo: '/speakers/egypt2.jpg', nameConfirmed: false },
  { id: 'eg3', name: 'Egyptian voice', dialectId: 'egyptian', photo: '/speakers/egypt3.jpg', nameConfirmed: false },
];

export function speakersFor(dialect: DialectId): Speaker[] {
  return SPEAKERS.filter((s) => s.dialectId === dialect);
}

/** Speakers we can name — the ones that actually have recordings. */
export function voicesFor(dialect: DialectId): Speaker[] {
  return speakersFor(dialect).filter((s) => s.nameConfirmed);
}

/** Portrait for a speaker who appears on a phrase, if we have one. */
export function photoFor(name: SpeakerName | string): string | undefined {
  return SPEAKERS.find((s) => s.name === name)?.photo;
}

export function voiceCount(n: number): string {
  return n === 1 ? 'One voice' : `${n} voices`;
}
