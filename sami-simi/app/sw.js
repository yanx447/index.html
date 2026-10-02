// Service worker — offline app shell. Bump VERSION on every release; the old cache is dropped.
// Nothing here touches microphone permissions: those stay with the browser.

const VERSION = 'sami-simi-v1.2.1';
const SHELL = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './js/main.js',
  './js/tuning.js',
  './js/guidance.js',
  './js/i18n.js',
  './js/pitch-detector.js',
  './js/tracker.js',
  './js/audio-input.js',
  './js/reference.js',
  './js/settings.js',
  './js/view/meter.js',
  './js/view/strobe.js',
  './js/view/headstock.js',
  './js/view/headstock3d.js',
  './vendor/three-lite.js',
  './vendor/qrcode.js',
  './js/music.js',
  './js/tools/ui.js',
  './js/tools/chords.js',
  './js/tools/chordrec.js',
  './js/tools/metronome.js',
  './js/tools/ear.js',
  './js/tools/playalong.js',
  './js/tools/newstring.js',
  './js/tools/recorder.js',
  './js/tools/songs.js',
  './js/tools/share.js',
  './js/view/trace.js',
  './js/view/diagnostics.js',
  './fonts/NotoSansGeorgian.woff',
  './fonts/NotoSerifGeorgian.woff',
  './fonts/JetBrainsMono.woff',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];
const FONT_CACHE = 'sami-simi-fonts-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== FONT_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: stale-while-revalidate
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONT_CACHE).then(async (c) => {
      const hit = await c.match(req);
      const net = fetch(req).then((r) => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }

  if (url.origin !== self.location.origin) return;

  // app shell: network-first for navigations (fresh updates), cache-first for assets
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((r) => { const copy = r.clone(); caches.open(VERSION).then((c) => c.put('./index.html', copy)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => {
    if (r.ok) { const copy = r.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
    return r;
  })));
});
