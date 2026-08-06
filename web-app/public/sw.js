/*
 * Service worker for Sook Sout.
 *
 * Deliberately hand-written rather than generated: the app has exactly three
 * kinds of request, and each wants a different strategy.
 *
 *   navigation   network-first  — a new deploy must win over a cached shell,
 *                                 so the app is never stale; cache is the
 *                                 offline fallback only.
 *   /assets/*    cache-first    — filenames are content-hashed by Vite, so a
 *                                 hit can never be the wrong version.
 *   audio (mp3)  cache-first    — recordings never change; capped so a long
 *                                 session cannot fill the device.
 *
 * Bump VERSION to retire every old cache on the next visit.
 */

const VERSION = 'v1';
const SHELL = `shell-${VERSION}`;
const ASSETS = `assets-${VERSION}`;
const AUDIO = `audio-${VERSION}`;
const FONTS = `fonts-${VERSION}`;

const AUDIO_MAX_ENTRIES = 220;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) => cache.addAll(['/', '/manifest.webmanifest']))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const keep = new Set([SHELL, ASSETS, AUDIO, FONTS]);
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((n) => !keep.has(n)).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

/** Keep a cache from growing without bound; evicts oldest-inserted first. */
async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= max) return;
  await Promise.all(keys.slice(0, keys.length - max).map((k) => cache.delete(k)));
}

async function cacheFirst(request, cacheName, opts = {}) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;

  const response = await fetch(request);
  // Range requests come back 206 and must never be cached as if complete.
  if (response.ok && response.status === 200) {
    cache.put(request, response.clone());
    if (opts.max) trim(cacheName, opts.max);
  }
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(SHELL);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put('/', response.clone());
    return response;
  } catch (err) {
    const cached = (await cache.match(request)) || (await cache.match('/'));
    if (cached) return cached;
    throw err;
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (url.origin === self.location.origin) {
    if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/icons/')) {
      event.respondWith(cacheFirst(request, ASSETS));
    }
    return;
  }

  if (url.hostname.endsWith('supabase.co') && url.pathname.endsWith('.mp3')) {
    // Only whole-file fetches; a partial response would poison the cache.
    if (!request.headers.has('range')) {
      event.respondWith(cacheFirst(request, AUDIO, { max: AUDIO_MAX_ENTRIES }));
    }
    return;
  }

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, FONTS));
  }
});
