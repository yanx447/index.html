/* Panduri Learning — service worker.
   Shell: cache-first with versioned caches. Navigation: network-first, offline fallback.
   Teacher media: served from the 'pd-media-*' cache ONLY when the learner explicitly downloaded it;
   large audio/video is never cached silently. The one exception is the instrument itself: the recorded notes
   (media/strings/, 54 files, about 1.4 MB), the recorded piano keys (media/piano/, 88 files, 1.9 MB — each only once
   it has been played) and the tuner's three plucks are kept in 'pd-sound-*' the first time they are played, so the
   panduri sounds like a panduri — and the piano like a piano — offline too. Old shell caches are deleted on activate;
   learner data (localStorage / IndexedDB) is never touched. */
const VERSION = 'ccc198e483';
const SHELL_CACHE = 'pd-shell-' + VERSION;
const SHELL = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "js/three3d.js", "tuner/fonts/JetBrainsMono.woff", "tuner/fonts/NotoSansGeorgian.woff", "tuner/fonts/NotoSerifGeorgian.woff", "tuner/index.html", "tuner/js/audio-input.js", "tuner/js/drift.js", "tuner/js/guidance.js", "tuner/js/i18n.js", "tuner/js/main.js", "tuner/js/music.js", "tuner/js/pitch-detector.js", "tuner/js/reference.js", "tuner/js/settings.js", "tuner/js/tools/chordrec.js", "tuner/js/tools/chords.js", "tuner/js/tools/ear.js", "tuner/js/tools/ensemble.js", "tuner/js/tools/intonation.js", "tuner/js/tools/metronome.js", "tuner/js/tools/newstring.js", "tuner/js/tools/playalong.js", "tuner/js/tools/recorder.js", "tuner/js/tools/share.js", "tuner/js/tools/songs.js", "tuner/js/tools/strumtune.js", "tuner/js/tools/ui.js", "tuner/js/tracker.js", "tuner/js/tuning.js", "tuner/js/view/diagnostics.js", "tuner/js/view/headstock.js", "tuner/js/view/headstock3d.js", "tuner/js/view/meter.js", "tuner/js/view/strobe.js", "tuner/js/view/trace.js", "tuner/styles.css", "tuner/sw.js", "tuner/vendor/qrcode.js", "tuner/vendor/three-lite.js", "stickers/bolt-still.webp", "stickers/bolt.webp", "stickers/cassette-still.webp", "stickers/cassette.webp", "stickers/check-still.webp", "stickers/check.webp", "stickers/cloud-still.webp", "stickers/cloud.webp", "stickers/equalizer-still.webp", "stickers/equalizer.webp", "stickers/flower-still.webp", "stickers/flower.webp", "stickers/gift-still.webp", "stickers/gift.webp", "stickers/headphones-still.webp", "stickers/headphones.webp", "stickers/heart-still.webp", "stickers/heart.webp", "stickers/metronome-still.webp", "stickers/metronome.webp", "stickers/mic-still.webp", "stickers/mic.webp", "stickers/moon-still.webp", "stickers/moon.webp", "stickers/panduri-still.webp", "stickers/panduri.webp", "stickers/piano-still.webp", "stickers/piano.webp", "stickers/star-still.webp", "stickers/star.webp", "stickers/vinyl-still.webp", "stickers/vinyl.webp", "chat-fonts/FiraGO-Regular.otf", "chat-fonts/OFL.txt", "chat-fonts/bricolagegrotesque-OFL.txt", "chat-fonts/bricolagegrotesque.woff2", "chat-fonts/dmsans-OFL.txt", "chat-fonts/dmsans.woff2", "chat-fonts/ibmplexmono-OFL.txt", "chat-fonts/ibmplexmono.woff2", "chat-fonts/notosansgeorgian-OFL.txt", "chat-fonts/notosansgeorgian.woff2", "chat-fonts/notoserifgeorgian-OFL.txt", "chat-fonts/notoserifgeorgian.woff2", "js/core.js?v=882bbcdcad", "js/instrument.js?v=882bbcdcad", "js/theory.js?v=882bbcdcad", "js/geom.js?v=882bbcdcad", "js/songdata.js?v=882bbcdcad", "js/sounddata.js?v=882bbcdcad", "js/pianodata.js?v=882bbcdcad", "js/curriculum.js?v=882bbcdcad", "js/lessons.js?v=882bbcdcad", "js/audio.js?v=882bbcdcad", "js/samples.js?v=882bbcdcad", "js/media.js?v=882bbcdcad", "js/detector.js?v=882bbcdcad", "js/engine.js?v=882bbcdcad", "js/coach.js?v=882bbcdcad", "js/ui.js?v=882bbcdcad", "js/motion.js?v=882bbcdcad", "js/fx.js?v=882bbcdcad", "js/cloud.js?v=882bbcdcad", "js/devices.js?v=882bbcdcad", "js/auth.js?v=882bbcdcad", "js/billing.js?v=882bbcdcad", "js/premium.js?v=882bbcdcad", "js/checkout.js?v=882bbcdcad", "js/tv.js?v=882bbcdcad", "js/rhythms.js?v=882bbcdcad", "js/neck.js?v=882bbcdcad", "js/lanes.js?v=882bbcdcad", "js/trainers.js?v=882bbcdcad", "js/practice.js?v=882bbcdcad", "js/camera.js?v=882bbcdcad", "js/community.js?v=882bbcdcad", "js/guard.js?v=882bbcdcad", "js/social.js?v=882bbcdcad", "js/cmprofile.js?v=882bbcdcad", "js/market.js?v=882bbcdcad", "js/vedit.js?v=882bbcdcad", "js/stickers.js?v=882bbcdcad", "js/chatkit.js?v=882bbcdcad", "js/chatui.js?v=882bbcdcad", "js/voicewave.js?v=882bbcdcad", "js/messenger.js?v=882bbcdcad", "js/tools.js?v=882bbcdcad", "js/notesart.js?v=882bbcdcad", "js/simple.js?v=882bbcdcad", "js/notes.js?v=882bbcdcad", "js/fig.js?v=882bbcdcad", "js/tips.js?v=882bbcdcad", "js/solfege.js?v=882bbcdcad", "js/exam.js?v=882bbcdcad", "js/notify.js?v=882bbcdcad", "js/shapes.js?v=882bbcdcad", "js/circle.js?v=882bbcdcad", "js/genres.js?v=882bbcdcad", "js/mtheory.js?v=882bbcdcad", "js/advdata.js?v=882bbcdcad", "js/advjazz.js?v=882bbcdcad", "js/advtheory.js?v=882bbcdcad", "js/pstcore.js?v=882bbcdcad", "js/pstudio.js?v=882bbcdcad", "js/book.js?v=882bbcdcad", "js/install.js?v=882bbcdcad", "js/simatheory.js?v=882bbcdcad", "js/sima.js?v=882bbcdcad", "js/simaplus.js?v=882bbcdcad", "js/aiworker.js?v=882bbcdcad", "js/aispl.js?v=882bbcdcad", "js/aideck.js?v=882bbcdcad", "js/aiscore.js?v=882bbcdcad", "js/aipiano.js?v=882bbcdcad", "js/airoll.js?v=882bbcdcad", "js/aitab3d.js?v=882bbcdcad", "js/aimus.js?v=882bbcdcad", "js/ailesson.js?v=882bbcdcad", "js/aistage.js?v=882bbcdcad", "js/songbook.js?v=882bbcdcad", "js/ai.js?v=882bbcdcad", "js/s3core.js?v=882bbcdcad", "js/s3stems.js?v=882bbcdcad", "js/studio3.js?v=882bbcdcad", "js/samisimi.js?v=882bbcdcad", "js/studio.js?v=882bbcdcad", "js/authortools.js?v=882bbcdcad", "js/onboard.js?v=882bbcdcad", "js/intro.js?v=882bbcdcad", "js/pwa.js?v=882bbcdcad", "js/practice-streak.js?v=882bbcdcad", "js/app.js?v=882bbcdcad", "js/boot.js?v=882bbcdcad", "js/assets.js?v=882bbcdcad", "js/config.js?v=882bbcdcad", "app.css?v=882bbcdcad"];
const SOUND_CACHE = 'pd-sound-c877aa3d87';   // the build names it after the sound files, so new recordings replace the old ones
self.addEventListener('install', e => { e.waitUntil(caches.open(SHELL_CACHE).then(c => c.addAll(SHELL))); });
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
