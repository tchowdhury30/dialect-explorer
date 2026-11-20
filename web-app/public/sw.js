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
 *                                 session cannot fill the device. Browsers
 *                                 request media in byte ranges, so the whole
 *                                 file is cached once and ranges are sliced
 *                                 from it.
 *
 * Bump VERSION to retire every old cache on the next visit.
 */

const VERSION = 'v3';
const SHELL = `shell-${VERSION}`;
const ASSETS = `assets-${VERSION}`;
const AUDIO = `audio-${VERSION}`;
const FONTS = `fonts-${VERSION}`;

const AUDIO_MAX_ENTRIES = 600;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) => cache.addAll(['/', '/manifest.webmanifest', '/theme-init.js']))
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

/** Whole-file cache for a clip; Range requests get a 206 sliced from it. */
async function audioResponse(request) {
  const cache = await caches.open(AUDIO);
  const url = request.url;
  let full = await cache.match(url);
  if (!full) {
    full = await fetch(url); // no Range header: always the complete file
    if (full.ok && full.status === 200) {
      await cache.put(url, full.clone());
      trim(AUDIO, AUDIO_MAX_ENTRIES);
    } else {
      return full;
    }
  }
  const range = request.headers.get('range');
  const m = range && /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (!m) return full;
  const buf = await full.arrayBuffer();
  const size = buf.byteLength;
  let start = m[1] === '' ? size - Number(m[2]) : Number(m[1]);
  let end = m[1] !== '' && m[2] !== '' ? Number(m[2]) : size - 1;
  start = Math.max(0, start);
  end = Math.min(end, size - 1);
  if (start > end) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  }
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': full.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
    },
  });
}

async function networkFirst(request) {
  const cache = await caches.open(SHELL);
  try {
    const response = await fetch(request);
    // Only the HTML app shell may become the offline fallback — never an mp3,
    // image or 404 page someone opened directly in a tab.
    const isShell =
      response.ok &&
      !/\.[a-z0-9]+$/i.test(new URL(request.url).pathname) &&
      (response.headers.get('Content-Type') || '').includes('text/html');
    if (isShell) cache.put('/', response.clone());
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
    } else if (url.pathname === '/theme-init.js') {
      // Not content-hashed: network first so edits roll out, cache offline.
      event.respondWith(
        fetch(request)
          .then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(SHELL).then((c) => c.put(request, copy));
            }
            return res;
          })
          .catch(() => caches.match(request))
      );
    } else if (url.pathname.startsWith('/audio/')) {
      event.respondWith(audioResponse(request));
    }
    return;
  }

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, FONTS));
  }
});
