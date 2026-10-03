/* =====================================================================
   Teacher video layer.
   A lesson may carry synchronized teacher footage:
     lesson.media = [{ id, angle:'front'|'left'|'right'|'player', label?, blobId? | url?, offset (s) }]
   offset = video time (s) at lesson beat 0 at 100% tempo.
   The engine drives every media element from the same transport
   (PD.media.sync is called from the engine tick, never from rendering),
   so loops, A/B, seeks and slow tempos keep video, audio, highway,
   fretboard and hands together. Playback rate follows the tempo with
   pitch preserved where the browser supports it.
   Video files are loaded only when the video panel is opened.
   ===================================================================== */
PD.i18n.add({
  'mv.title': ['მასწავლებლის ვიდეო', 'Teacher video'], 'mv.front': ['წინიდან', 'Front'], 'mv.left': ['მარცხენა ხელი', 'Left hand'], 'mv.right': ['მარჯვენა ხელი', 'Right hand'], 'mv.player': ['მოთამაშის კუთხე', 'Player view'],
  'mv.none': ['ამ გაკვეთილს ვიდეო არ აქვს.', 'This lesson has no video.'], 'mv.mute': ['ვიდეოს ხმა', 'Video sound'], 'mv.missing': ['ვიდეო ვერ ჩაიტვირთა', 'Video could not be loaded'],
  'mv.offline': ['ოფლაინისთვის ჩამოტვირთვა', 'Download for offline'], 'mv.offlineOk': ['ვიდეო შენახულია ოფლაინისთვის', 'Video saved for offline'], 'mv.offlineNo': ['ოფლაინ შენახვა აქ მიუწვდომელია', 'Offline saving is not available here']
});

PD.media = (() => {
  const ANGLES = ['front', 'left', 'right', 'player'];
  let lesson = null, items = [], angle = null, el = null, url = null, muted = PD.store.get('mv.muted', false), host = null, last = { sec: 0, rate: 1, playing: false };
  function load(l) { unload(); lesson = l; items = (l && l.media || []).filter(m => m && (m.blobId || m.url)); angle = items.length ? (items.find(m => m.angle === PD.store.get('mv.angle', 'front')) || items[0]).angle : null; }
  function unload() { if (el) { el.pause(); el.removeAttribute('src'); el.load(); } if (url) URL.revokeObjectURL(url); el = null; url = null; lesson = null; items = []; if (host) host.innerHTML = ''; }
  const cur = () => items.find(m => m.angle === angle);
  async function attach() {
    const m = cur(); if (!m || !host) return;
    if (el) { el.pause(); }
    if (url) { URL.revokeObjectURL(url); url = null; }
    const v = el || PD.h('video', { playsinline: true, preload: 'auto', 'aria-label': t('mv.title') });
    v.muted = muted; v.preservesPitch = true; v.mozPreservesPitch = true; v.webkitPreservesPitch = true;
    if (m.blobId) { const b = await PD.blobs.get(m.blobId); if (!b) { host.querySelector('.mv-msg').textContent = t('mv.missing'); return; } url = URL.createObjectURL(b); v.src = url; }
    else v.src = m.url;
    v.onerror = () => { const mm = host && host.querySelector('.mv-msg'); if (mm) mm.textContent = t('mv.missing'); };
    el = v; const box = host.querySelector('.mv-box'); if (box && !box.contains(v)) box.prepend(v);
    sync(last.sec, last.rate, last.playing, true);
  }
  /** build the panel inside host (lazy: video files load only now) */
  function mount(h) {
    host = h; host.innerHTML = '';
    if (!items.length) { host.append(PD.h('p', { class: 'muted', style: 'font-size:13px', text: t('mv.none') })); return false; }
    const seg = PD.h('div', { class: 'seg', role: 'group', 'aria-label': t('mv.title') }, ANGLES.filter(a => items.some(m => m.angle === a)).map(a => PD.h('button', { 'aria-pressed': String(a === angle), text: t('mv.' + a), onclick: e => { angle = a; PD.store.set('mv.angle', a); seg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); attach(); } })));
    const mute = PD.h('button', { class: 'chip', 'aria-pressed': String(!muted), html: '<span class="dot"></span>' + PD.esc(t('mv.mute')), onclick: () => { muted = !muted; PD.store.set('mv.muted', muted); mute.setAttribute('aria-pressed', String(!muted)); if (el) el.muted = muted; } });
    const off = items.some(m => m.url) ? PD.h('button', { class: 'chip', text: t('mv.offline'), onclick: () => offline() }) : null;
    host.append(PD.h('div', { class: 'mv-box', style: 'position:relative;background:#000;border-radius:10px;overflow:hidden;aspect-ratio:16/9' }, [PD.h('span', { class: 'mv-msg muted', style: 'position:absolute;inset:auto 8px 8px;font-size:12px' })]),
      PD.h('div', { class: 'row', style: 'gap:6px' }, [seg, mute, off]));
    attach(); return true;
  }
  /** called by the engine tick: lessonSec = seconds of lesson time at 100% tempo */
  function sync(lessonSec, rate, playing, force) {
    last = { sec: lessonSec, rate, playing };
    if (!el) return; const m = cur(); if (!m) return;
    if (!playing) { if (!el.paused) el.pause(); if (force) { try { el.currentTime = Math.max(0, lessonSec + (m.offset || 0)); } catch (_) {} } return; }
    const target = lessonSec + (m.offset || 0);
    el.playbackRate = Math.max(.25, Math.min(4, rate));
    if (target < 0 || (el.duration && target > el.duration)) { if (!el.paused) el.pause(); return; }
    if (force || Math.abs(el.currentTime - target) > .15) { try { el.currentTime = target; } catch (_) {} }
    if (el.paused) el.play().catch(() => {});
  }
  /** explicit, user-requested offline download of URL-based teacher media (never automatic) */
  async function offline() {
    const urls = items.filter(m => m.url).map(m => m.url);
    if (!urls.length || !('caches' in window)) return PD.ui.toast(t('mv.offlineNo'));
    try { const c = await caches.open('pd-media-v1'); await c.addAll(urls); PD.ui.toast(t('mv.offlineOk')); } catch (_) { PD.ui.toast(t('mv.offlineNo')); }
  }
  return { ANGLES, load, unload, mount, sync, get has() { return items.length > 0; }, get angle() { return angle; } };
})();
