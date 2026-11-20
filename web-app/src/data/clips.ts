import versions from './audio-versions.json';

const V = versions as Record<string, string>;

/**
 * Public URL for a built clip, with its content hash as ?v=. Written by
 * scripts/build-audio.mjs; a rebuilt clip gets a new URL, so phones never keep
 * playing an old copy from their HTTP or service-worker cache.
 */
export function clipUrl(path: string): string {
  const v = V[path];
  return v ? `/audio/${path}?v=${v}` : `/audio/${path}`;
}
