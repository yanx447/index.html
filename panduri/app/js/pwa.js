/* =====================================================================
   PWA: service-worker registration with safe updates, persistent
   storage request. Progress, settings, user lessons and recordings live
   in localStorage/IndexedDB and are never touched by cache updates.
   (Inside an embedded preview the service worker is not registered.)
   ===================================================================== */
PD.i18n.add({ 'pwa.update': ['ახალი ვერსია მზადაა', 'A new version is ready'], 'pwa.reload': ['განახლება', 'Update'] });
PD.pwa = (() => {
  let waiting = null;
  function offer(reg) {
    waiting = reg.waiting; if (!waiting) return;
    const bar = PD.h('div', { class: 'toast', role: 'status', style: 'display:flex;gap:12px;align-items:center' }, [PD.h('span', { text: t('pwa.update') }), PD.h('button', { class: 'btn small primary', text: t('pwa.reload'), onclick: () => { waiting.postMessage({ type: 'skipWaiting' }); } })]);
    document.body.appendChild(bar);
  }
  function register() {
    try {
      if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) return;   // the installed native app ships its files itself
      if (!('serviceWorker' in navigator) || window.top !== window || !document.querySelector('link[rel="manifest"]')) return;   // only the installable build
      if (!(location.protocol === 'https:' || location.hostname === 'localhost')) return;
      navigator.serviceWorker.register('sw.js').then(reg => {
        if (reg.waiting) offer(reg);
        reg.addEventListener('updatefound', () => { const nw = reg.installing; if (nw) nw.addEventListener('statechange', () => { if (nw.state === 'installed' && navigator.serviceWorker.controller) offer(reg); }); });
      }).catch(() => {});
      let reloaded = false; navigator.serviceWorker.addEventListener('controllerchange', () => { if (!reloaded) { reloaded = true; location.reload(); } });
    } catch (_) {}
  }
  /** ask the browser not to evict the learner's data */
  function persist() { try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (_) {} }
  return { register, persist };
})();
