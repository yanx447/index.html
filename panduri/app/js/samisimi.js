/* =====================================================================
   „სამი სიმი“ — the teacher's own panduri tuner app, included as it is.
   Its files are copied unchanged next to this app (tuner/) and it opens
   full screen over the current page, with a thin bar to come back.
   Back (browser, Android, TV) closes it like any other layer. The
   microphone is released by this app first, so the tuner can take it.
   ===================================================================== */
PD.i18n.add({ 'ss.title': ['სამი სიმი', 'Sami Simi'], 'ss.sub': ['ფანდურის ტიუნერი', 'Panduri tuner'], 'ss.back': ['ფანდური', 'Panduri'] });
PD.samiSimi = (() => {
  const h = PD.h, t = PD.i18n.t;
  let el = null, lid = 0;
  const src = () => (PD.CONFIG && PD.CONFIG.tunerUrl) || 'tuner/index.html';
  function open(qs) {
    if (el) return;
    try { if (PD.detector && PD.detector.active) PD.detector.stop(); } catch (_) {}
    // the tuner speaks the same language as this app, unless a language was already chosen inside the tuner (same origin, its own settings key)
    try { const K = 'sami-simi:v1', o = JSON.parse(localStorage.getItem(K) || '{}') || {}; if (!o.lang || o.lang === 'auto') { o.lang = PD.i18n.lang === 'en' ? 'en' : 'ka'; localStorage.setItem(K, JSON.stringify(o)); } } catch (_) {}
    const frame = h('iframe', { class: 'ss-frame', src: src() + (qs ? '?' + qs : ''), title: t('ss.title') + ' — ' + t('ss.sub'), allow: 'microphone; autoplay; fullscreen; clipboard-write', loading: 'eager' });
    el = h('div', { class: 'ss-wrap', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('ss.title') }, [
      h('div', { class: 'ss-bar' }, [h('button', { class: 'ss-back', onclick: () => close() , html: PD.ic.back + '<span>' + PD.esc(t('ss.back')) + '</span>' }), h('div', { class: 'ss-name' }, [h('b', { text: t('ss.title') }), h('small', { text: t('ss.sub') })])]),
      frame]);
    document.body.appendChild(el); document.body.style.overflow = 'hidden';
    lid = PD.layers.push(() => close(true));
    requestAnimationFrame(() => el && el.classList.add('in'));
  }
  function close(fromBack) {
    if (!el) return; const e = el; el = null;
    if (fromBack !== true) PD.layers.done(lid);
    document.body.style.overflow = '';
    const fr = e.querySelector('iframe');
    const gone = () => { try { fr.src = 'about:blank'; } catch (_) {} e.remove(); };   // unloading the page stops its microphone
    if (PD.ui.motion()) { e.classList.add('out'); setTimeout(gone, 260); } else gone();
  }
  return { open, close, get available() { return !(location.protocol === 'file:'); }, get isOpen() { return !!el; } };
})();
