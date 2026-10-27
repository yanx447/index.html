/* =====================================================================
   PWA: service-worker registration with safe updates, persistent
   storage request. Progress, settings, user lessons and recordings live
   in localStorage/IndexedDB and are never touched by cache updates.
   (Inside an embedded preview the service worker is not registered.)
   ===================================================================== */
PD.i18n.add({ 'pwa.update': ['ახალი ვერსია მზადაა', 'A new version is ready'], 'pwa.reload': ['განახლება', 'Update'] });
PD.pwa = (() => {
  let waiting = null, asked = false;
  function offer(reg) {
    waiting = reg.waiting; if (!waiting) return;
    const bar = PD.h('div', { class: 'toast', role: 'status', style: 'display:flex;gap:12px;align-items:center' }, [PD.h('span', { text: t('pwa.update') }), PD.h('button', { class: 'btn small primary', text: t('pwa.reload'), onclick: () => { asked = true; waiting.postMessage({ type: 'skipWaiting' }); } })]);
    document.body.appendChild(bar);
  }
  function register() {
    try {
      if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) return;   // the installed native app ships its files itself
      if (!('serviceWorker' in navigator) || window.top !== window || !document.querySelector('link[rel="manifest"]')) return;   // only the installable build
      if (!(location.protocol === 'https:' || location.hostname === 'localhost')) return;
      navigator.serviceWorker.register('sw.js').then(reg => {
        // a fresh launch is a safe moment to take a waiting update: the learner gets fixes without having to notice a toast
        if (reg.waiting) { asked = true; try { reg.waiting.postMessage({ type: 'skipWaiting' }); } catch (_) { offer(reg); } }
        try { reg.update(); } catch (_) {}
        reg.addEventListener('updatefound', () => { const nw = reg.installing; if (nw) nw.addEventListener('statechange', () => { if (nw.state === 'installed' && navigator.serviceWorker.controller) offer(reg); }); });
      }).catch(() => {});
      // reload only for an update the learner asked for — never during the first visit (the first install also takes control of the page)
      let reloaded = false; navigator.serviceWorker.addEventListener('controllerchange', () => { if (asked && !reloaded) { reloaded = true; location.reload(); } });
    } catch (_) {}
  }
  /** ask the browser not to evict the learner's data */
  function persist() { try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (_) {} }
  /** ask the browser for a new version now; true when one was found and applied */
  async function update() {
    try {
      if (!('serviceWorker' in navigator)) return false;
      const reg = await navigator.serviceWorker.getRegistration(); if (!reg) return false;
      await reg.update();
      const w = reg.waiting || reg.installing;
      if (!w) return false;
      asked = true;
      if (reg.waiting) reg.waiting.postMessage({ type: 'skipWaiting' });
      else w.addEventListener('statechange', () => { if (w.state === 'installed' && reg.waiting) reg.waiting.postMessage({ type: 'skipWaiting' }); });
      return true;
    } catch (_) { return false; }
  }
  return { register, persist, update };
})();
