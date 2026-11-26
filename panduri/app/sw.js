/* Panduri Learning — service worker.
   Shell: cache-first with versioned caches. Navigation: network-first, offline fallback.
   Teacher media: served from the 'pd-media-*' cache ONLY when the learner explicitly downloaded it;
   large audio/video is never cached silently. The one exception is the instrument itself: the recorded notes
   (media/strings/, 54 files, about 1.4 MB), the recorded piano keys (media/piano/, 88 files, 1.9 MB — each only once
   it has been played) and the tuner's three plucks are kept in 'pd-sound-*' the first time they are played, so the
   panduri sounds like a panduri — and the piano like a piano — offline too. Old shell caches are deleted on activate;
   learner data (localStorage / IndexedDB) is never touched. */
const VERSION = '0cd3e5d5b4';
const SHELL_CACHE = 'pd-shell-' + VERSION;
const SHELL = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "js/three3d.js", "tuner/fonts/JetBrainsMono.woff", "tuner/fonts/NotoSansGeorgian.woff", "tuner/fonts/NotoSerifGeorgian.woff", "tuner/index.html", "tuner/js/audio-input.js", "tuner/js/drift.js", "tuner/js/guidance.js", "tuner/js/i18n.js", "tuner/js/main.js", "tuner/js/music.js", "tuner/js/pitch-detector.js", "tuner/js/reference.js", "tuner/js/settings.js", "tuner/js/tools/chordrec.js", "tuner/js/tools/chords.js", "tuner/js/tools/ear.js", "tuner/js/tools/ensemble.js", "tuner/js/tools/intonation.js", "tuner/js/tools/metronome.js", "tuner/js/tools/newstring.js", "tuner/js/tools/playalong.js", "tuner/js/tools/recorder.js", "tuner/js/tools/share.js", "tuner/js/tools/songs.js", "tuner/js/tools/strumtune.js", "tuner/js/tools/ui.js", "tuner/js/tracker.js", "tuner/js/tuning.js", "tuner/js/view/diagnostics.js", "tuner/js/view/headstock.js", "tuner/js/view/headstock3d.js", "tuner/js/view/meter.js", "tuner/js/view/strobe.js", "tuner/js/view/trace.js", "tuner/styles.css", "tuner/sw.js", "tuner/vendor/qrcode.js", "tuner/vendor/three-lite.js", "stickers/bolt-still.webp", "stickers/bolt.webp", "stickers/cassette-still.webp", "stickers/cassette.webp", "stickers/check-still.webp", "stickers/check.webp", "stickers/cloud-still.webp", "stickers/cloud.webp", "stickers/equalizer-still.webp", "stickers/equalizer.webp", "stickers/flower-still.webp", "stickers/flower.webp", "stickers/gift-still.webp", "stickers/gift.webp", "stickers/headphones-still.webp", "stickers/headphones.webp", "stickers/heart-still.webp", "stickers/heart.webp", "stickers/instrument-cello-still.webp", "stickers/instrument-changi-still.webp", "stickers/instrument-chiboni-still.webp", "stickers/instrument-chonguri-still.webp", "stickers/instrument-chuniri-still.webp", "stickers/instrument-daira-still.webp", "stickers/instrument-diplipito-still.webp", "stickers/instrument-doli-still.webp", "stickers/instrument-drumkit-still.webp", "stickers/instrument-duduki-still.webp", "stickers/instrument-garmoni-still.webp", "stickers/instrument-guitar-still.webp", "stickers/instrument-larchemi-still.webp", "stickers/instrument-mandolin-still.webp", "stickers/instrument-panduri-still.webp", "stickers/instrument-piano-still.webp", "stickers/instrument-salamuri-still.webp", "stickers/instrument-saxophone-still.webp", "stickers/instrument-trumpet-still.webp", "stickers/instrument-violin-still.webp", "stickers/metronome-still.webp", "stickers/metronome.webp", "stickers/mic-still.webp", "stickers/mic.webp", "stickers/moon-still.webp", "stickers/moon.webp", "stickers/panduri-still.webp", "stickers/panduri.webp", "stickers/piano-still.webp", "stickers/piano.webp", "stickers/star-still.webp", "stickers/star.webp", "stickers/vinyl-still.webp", "stickers/vinyl.webp", "chat-fonts/FiraGO-Regular.otf", "chat-fonts/OFL.txt", "chat-fonts/bricolagegrotesque-OFL.txt", "chat-fonts/bricolagegrotesque.woff2", "chat-fonts/dmsans-OFL.txt", "chat-fonts/dmsans.woff2", "chat-fonts/ibmplexmono-OFL.txt", "chat-fonts/ibmplexmono.woff2", "chat-fonts/notosansgeorgian-OFL.txt", "chat-fonts/notosansgeorgian.woff2", "chat-fonts/notoserifgeorgian-OFL.txt", "chat-fonts/notoserifgeorgian.woff2", "lessons/songs.json", "js/core.js?v=d1653d1232", "js/instrument.js?v=d1653d1232", "js/theory.js?v=d1653d1232", "js/geom.js?v=d1653d1232", "js/songdata.js?v=d1653d1232", "js/sounddata.js?v=d1653d1232", "js/pianodata.js?v=d1653d1232", "js/curriculum.js?v=d1653d1232", "js/lessons.js?v=d1653d1232", "js/audio.js?v=d1653d1232", "js/samples.js?v=d1653d1232", "js/media.js?v=d1653d1232", "js/music-community.js?v=d1653d1232", "js/detector.js?v=d1653d1232", "js/engine.js?v=d1653d1232", "js/coach.js?v=d1653d1232", "js/ui.js?v=d1653d1232", "js/motion.js?v=d1653d1232", "js/fx.js?v=d1653d1232", "js/cloud.js?v=d1653d1232", "js/devices.js?v=d1653d1232", "js/auth.js?v=d1653d1232", "js/billing.js?v=d1653d1232", "js/premium.js?v=d1653d1232", "js/paywallet.js?v=d1653d1232", "js/checkout.js?v=d1653d1232", "js/tv.js?v=d1653d1232", "js/rhythms.js?v=d1653d1232", "js/neck.js?v=d1653d1232", "js/lanes.js?v=d1653d1232", "js/trainers.js?v=d1653d1232", "js/practice.js?v=d1653d1232", "js/camera.js?v=d1653d1232", "js/community.js?v=d1653d1232", "js/guard.js?v=d1653d1232", "js/social.js?v=d1653d1232", "js/cmprofile.js?v=d1653d1232", "js/market.js?v=d1653d1232", "js/mixrack.js?v=d1653d1232", "js/vedit.js?v=d1653d1232", "js/stickers.js?v=d1653d1232", "js/chatkit.js?v=d1653d1232", "js/chatui.js?v=d1653d1232", "js/voicewave.js?v=d1653d1232", "js/messenger.js?v=d1653d1232", "js/tools.js?v=d1653d1232", "js/notesart.js?v=d1653d1232", "js/simple.js?v=d1653d1232", "js/notes.js?v=d1653d1232", "js/fig.js?v=d1653d1232", "js/tips.js?v=d1653d1232", "js/solfege.js?v=d1653d1232", "js/exam.js?v=d1653d1232", "js/notify.js?v=d1653d1232", "js/shapes.js?v=d1653d1232", "js/circle.js?v=d1653d1232", "js/genres.js?v=d1653d1232", "js/mtheory.js?v=d1653d1232", "js/advdata.js?v=d1653d1232", "js/advjazz.js?v=d1653d1232", "js/advtheory.js?v=d1653d1232", "js/pstcore.js?v=d1653d1232", "js/pstudio.js?v=d1653d1232", "js/book.js?v=d1653d1232", "js/install.js?v=d1653d1232", "js/simatheory.js?v=d1653d1232", "js/sima.js?v=d1653d1232", "js/simaplus.js?v=d1653d1232", "js/aiworker.js?v=d1653d1232", "js/aispl.js?v=d1653d1232", "js/aideck.js?v=d1653d1232", "js/aiscore.js?v=d1653d1232", "js/aipiano.js?v=d1653d1232", "js/airoll.js?v=d1653d1232", "js/aitab3d.js?v=d1653d1232", "js/aimus.js?v=d1653d1232", "js/ailesson.js?v=d1653d1232", "js/aistage.js?v=d1653d1232", "js/songbook.js?v=d1653d1232", "js/musiclib.js?v=d1653d1232", "js/lessoned.js?v=d1653d1232", "js/crdsp.js?v=d1653d1232", "js/creator.js?v=d1653d1232", "js/ai.js?v=d1653d1232", "js/s3core.js?v=d1653d1232", "js/studio-sync.js?v=d1653d1232", "js/studio3.js?v=d1653d1232", "js/samisimi.js?v=d1653d1232", "js/studio.js?v=d1653d1232", "js/authortools.js?v=d1653d1232", "js/onboard.js?v=d1653d1232", "js/intro.js?v=d1653d1232", "js/pwa.js?v=d1653d1232", "js/practice-streak.js?v=d1653d1232", "js/gamecore.js?v=d1653d1232", "js/gameaudio.js?v=d1653d1232", "js/gameplay.js?v=d1653d1232", "js/games.js?v=d1653d1232", "js/app.js?v=d1653d1232", "js/boot.js?v=d1653d1232", "js/assets.js?v=d1653d1232", "js/config.js?v=d1653d1232", "app.css?v=d1653d1232"];
const SOUND_CACHE = 'pd-sound-c877aa3d87';   // the build names it after the sound files, so new recordings replace the old ones
// a new version's shell comes from the server, never from the browser's HTTP cache (GitHub Pages lets it keep a file for
// 10 minutes): otherwise an update right after a deploy could pack yesterday's index.html or tuner beside today's scripts
self.addEventListener('install', e => { e.waitUntil(caches.open(SHELL_CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' }))))); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => (k.startsWith('pd-shell-') && k !== SHELL_CACHE) || (k.startsWith('pd-sound-') && k !== SOUND_CACHE)).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data && e.data.type === 'skipWaiting') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (req.mode === 'navigate') {
    const scope = new URL(self.registration.scope);
    const key = url.pathname === scope.pathname ? new URL('index.html', scope).href : url.origin + url.pathname.replace(/\/$/, '/index.html');
    e.respondWith(fetch(req).then(r => { if (r.ok) { const copy = r.clone(); caches.open(SHELL_CACHE).then(c => c.put(key, copy)); } return r; }).catch(() => caches.match(key, { ignoreSearch: true }).then(hit => hit || Response.error())));
    return;
  }
  if (url.origin === location.origin && /\/js\/config\.js$/.test(url.pathname)) {   // settings: always the newest copy, cached for offline
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(SHELL_CACHE).then(c => c.put(req, copy)); return r; }).catch(() => caches.match(req)));
    return;
  }
  if (url.origin === location.origin && /\/(media\/strings|media\/piano|tuner\/audio)\/[^/]+\.mp3$/.test(url.pathname)) {
    e.respondWith(caches.open(SOUND_CACHE).then(c => c.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }))));
    return;
  }
  if (/\.(mp4|webm|mov|m4v|wav|mp3|m4a|flac|ogg)$/i.test(url.pathname) || req.destination === 'video' || req.destination === 'audio') {
    e.respondWith(caches.open('pd-media-v1').then(c => c.match(req)).then(hit => hit || fetch(req)));
    return;
  }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open('pd-fonts').then(c => c.match(req).then(hit => { const net = fetch(req).then(r => { c.put(req, r.clone()); return r; }).catch(() => hit); return hit || net; })));
    return;
  }
  if (url.origin === location.origin && /\/js\/lang\/[^/]+\.js$/.test(url.pathname)) {   // a language pack: the newest when online, the last one used when offline
    e.respondWith(caches.open('pd-lang').then(c => fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => c.match(req).then(hit => hit || Response.error()))));
    return;
  }
  if (url.origin === location.origin) e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});

/* ---- notifications ---------------------------------------------------
   push: one of Sima's notifications from the server (a friend wrote,
   reacted or posted; a request; a record; the daily reminder; a new
   version). Shown even when the app is closed; an open app is told at
   once so its inbox catches up. click: open the app where the
   notification points (and mark it read). periodicsync: show what the
   local plan says is due, when the browser allows the check. ---------- */
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { title: e.data ? e.data.text() : '' }; }
  const title = d.title || 'სიმა · ფანდური';
  e.waitUntil((async () => {
    await self.registration.showNotification(title, {
      body: d.body || '', icon: 'icons/icon-192.png', badge: 'icons/icon-192.png',
      tag: d.tag || d.kind || 'pd', renotify: !!d.tag, timestamp: Date.now(),
      data: { go: d.go || null, kind: d.kind || null, id: d.id || null }
    });
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    all.forEach(c => c.postMessage({ type: 'push', id: d.id || null }));
  })());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const d = e.notification.data || {}, go = d.go || null, id = d.id || null;
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) { if ('focus' in c) { await c.focus(); c.postMessage({ type: 'notification', go, id }); return; } }
    await self.clients.openWindow(go ? 'index.html?go=' + encodeURIComponent(go) + (id ? '&nid=' + encodeURIComponent(id) : '') : 'index.html');
  })());
});
self.addEventListener('periodicsync', e => {
  if (e.tag !== 'pd-check') return;
  e.waitUntil((async () => {
    try {
      const c = await caches.open('pd-notify'), r = await c.match('/__plan'); if (!r) return;
      const plan = await r.json(), now = Date.now(), hh = new Date().getHours();
      if (plan.quiet && (hh >= 23 || hh < 8)) return;
      const due = (plan.list || []).filter(x => x.at <= now && x.at > now - 36e5 * 18);
      const shown = [];
      for (const x of due) { await self.registration.showNotification(x.title, { body: x.body || '', icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: x.kind + ':' + x.id, data: { go: x.go, kind: x.kind } }); shown.push(x.id); }
      if (shown.length) { plan.list = (plan.list || []).filter(x => !shown.includes(x.id)); await c.put('/__plan', new Response(JSON.stringify(plan), { headers: { 'content-type': 'application/json' } })); }
    } catch (_) {}
  })());
});
