/* =====================================================================
   Motion helpers that need a little JavaScript. The router owns screen
   transitions (app.js); this file adds the small things around them:
   - segmented controls: a thumb slides to the chosen option
   - play / pause and similar icon swaps morph instead of snapping
   - numbers that change (BPM, counters, stats) roll softly
   - a shared element: a card's cover flies into the screen it opens
   Everything respects "reduce motion" (system or the app's setting).
   One MutationObserver, batched per frame; nothing runs while idle.
   ===================================================================== */
PD.motion = (() => {
  const ok = () => !document.documentElement.classList.contains('rm') && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const OUT = 'cubic-bezier(.22,1,.36,1)';

  /* ---------- segmented controls ---------- */
  const segs = new Set();
  const ro = window.ResizeObserver ? new ResizeObserver(es => es.forEach(e => place(e.target, true))) : null;
  function adopt(seg) {
    if (seg.classList.contains('has-thumb') || seg.closest('.no-thumb')) return;
    const thumb = document.createElement('span'); thumb.className = 'seg-thumb jump'; thumb.setAttribute('aria-hidden', 'true');
    seg.prepend(thumb); seg.classList.add('has-thumb'); segs.add(seg); if (ro) ro.observe(seg);
    place(seg, true);
  }
  function place(seg, jump) {
    const thumb = seg.querySelector(':scope > .seg-thumb'); if (!thumb) return;
    const b = seg.querySelector(':scope > button[aria-pressed="true"]');
    if (!b || !b.offsetWidth) { thumb.style.opacity = '0'; return; }
    if (jump || !ok()) thumb.classList.add('jump');
    thumb.style.opacity = '1'; thumb.style.width = b.offsetWidth + 'px'; thumb.style.height = b.offsetHeight + 'px'; thumb.style.transform = 'translate(' + b.offsetLeft + 'px,' + b.offsetTop + 'px)';
    if (thumb.classList.contains('jump')) requestAnimationFrame(() => requestAnimationFrame(() => thumb.classList.remove('jump')));
  }

  /* ---------- icon morph (play ↔ pause and the like) ---------- */
  const MORPH = '.ai-play, .pz-ic, .tb-play, .mt-play, .srow-play, [data-morph]';
  function morph(btn) { if (!ok()) return; const svg = btn.querySelector('svg'); if (svg && svg.animate) svg.animate([{ transform: 'scale(.55) rotate(-25deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 200, easing: OUT }); }

  /* ---------- numbers ---------- */
  const NUM = '.mt-bpm, .ai-fact b, .pf2-stats b, .prow-n, .hx-goal2 b, .ai-bar';
  const lastText = new WeakMap();
  function roll(el) {
    const tx = el.textContent; if (lastText.get(el) === tx) return; const had = lastText.has(el); lastText.set(el, tx);
    if (!had || !ok() || !el.animate) return;
    el.animate([{ transform: 'translateY(35%)', opacity: .25 }, { transform: 'none', opacity: 1 }], { duration: 170, easing: OUT });
  }

  /* ---------- one observer, batched ---------- */
  let queued = false; const dirtySegs = new Set(), dirtyNums = new Set(), dirtyMorph = new Set();
  function flush() {
    queued = false;
    dirtySegs.forEach(s => { if (s.isConnected) { if (!s.classList.contains('has-thumb')) adopt(s); else place(s); } }); dirtySegs.clear();
    dirtyMorph.forEach(morph); dirtyMorph.clear();
    dirtyNums.forEach(roll); dirtyNums.clear();
    segs.forEach(s => { if (!s.isConnected) { segs.delete(s); if (ro) ro.unobserve(s); } });
  }
  const kick = () => { if (!queued) { queued = true; requestAnimationFrame(flush); } };
  function scan(root) {
    if (!root.querySelectorAll) return;
    if (root.matches && root.matches('.seg')) dirtySegs.add(root);
    root.querySelectorAll('.seg').forEach(s => dirtySegs.add(s));
    if (root.matches && root.matches(NUM)) lastText.set(root, root.textContent);
    root.querySelectorAll(NUM).forEach(n => lastText.set(n, n.textContent));
  }
  const mo = new MutationObserver(list => {
    for (const m of list) {
      const t = m.target.nodeType === 3 ? m.target.parentElement : m.target; if (!t) continue;
      if (m.type === 'attributes') { const seg = t.parentElement && t.parentElement.classList.contains('seg') ? t.parentElement : null; if (seg) dirtySegs.add(seg); continue; }
      if (m.type === 'childList') {
        m.addedNodes.forEach(n => { if (n.nodeType === 1) scan(n); });
        const btn = t.closest && t.closest(MORPH); if (btn && [...m.addedNodes].some(n => n.nodeName === 'svg' || (n.querySelector && n.querySelector('svg')))) dirtyMorph.add(btn);
      }
      const num = t.closest && t.closest(NUM); if (num) dirtyNums.add(num);
    }
    kick();
  });
  function start() {
    scan(document.body); kick();
    mo.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['aria-pressed'] });
    window.addEventListener('resize', () => segs.forEach(s => place(s, true)));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  /** a short directional swap for a block whose content was replaced (chord name, card) */
  function swap(el, dir) { if (!el || !ok() || !el.animate) return; el.animate([{ opacity: 0, transform: 'translateX(' + (dir || 0) * 16 + 'px) translateY(' + (dir ? 0 : 6) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: OUT }); }
  /** the active tab's icon answers with a small, controlled spring */
  function spring(el) { if (!el || !ok() || !el.animate) return; el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.14) translateY(-1px)' }, { transform: 'scale(1)' }], { duration: 360, easing: 'cubic-bezier(.34,1.36,.64,1)' }); }
  /** A bounded entrance, owned by the router, never by a same-screen redraw: the first blocks settle in order. */
  function reveal(root, delay = 0) {
    if (!root || !ok()) return [];
    return [...root.children].slice(0, 6).filter(el => el.animate).map((el, i) =>
      el.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
        { duration: 320, delay: delay + i * 30, easing: OUT, fill: 'backwards' }));
  }
  /* ---------- shared element: card → detail ----------
     share(el) remembers a picture and where it sat; fly(target) moves a copy of it from there to where the
     same picture sits on the new screen, growing into its shape, then hands over to the real one. */
  let shared = null;
  function share(el) {
    if (!el || !ok()) { shared = null; return; }
    const pic = el.querySelector('svg, img'); if (!pic) { shared = null; return; }
    shared = { el, pic: pic.outerHTML, r: el.getBoundingClientRect(), rad: getComputedStyle(el).borderRadius, t: performance.now() };
  }
  const takeShare = () => { const s2 = shared; shared = null; return s2 && performance.now() - s2.t < 1200 ? s2 : null; };
  function fly(src, target, dur) {
    if (!src || !target || !ok() || !document.body.animate) return null;
    const to = target.getBoundingClientRect(); if (!to.width || !to.height) return null;
    const box = document.createElement('div'); box.className = 'ds-fly'; box.setAttribute('aria-hidden', 'true'); box.innerHTML = src.pic;
    const rTo = getComputedStyle(target).borderRadius || '0px';
    document.body.appendChild(box);
    target.setAttribute('data-share-hide', ''); if (src.el && src.el.isConnected) src.el.style.visibility = 'hidden';
    const f = src.r, o = { duration: dur || 380, easing: 'cubic-bezier(.32,.72,0,1)', fill: 'both' };
    const a = box.animate([
      { left: f.left + 'px', top: f.top + 'px', width: f.width + 'px', height: f.height + 'px', borderRadius: src.rad, boxShadow: '0 0 0 rgba(0,0,0,0)' },
      { left: to.left + 'px', top: to.top + 'px', width: to.width + 'px', height: to.height + 'px', borderRadius: rTo, boxShadow: '0 30px 60px -30px rgba(0,0,0,.8)' }], o);
    const done = () => { target.removeAttribute('data-share-hide'); if (src.el) src.el.style.visibility = ''; box.remove(); };
    a.finished.then(done, done);
    return a;
  }
  // Changing accessibility preferences also finishes animations already in flight.
  function settleMotion() {
    if (!ok() && document.getAnimations) document.getAnimations().forEach(a => a.cancel());
  }
  if (window.matchMedia) matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', settleMotion);
  new MutationObserver(settleMotion).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  // A single delegated handler also covers dynamically rendered tool cards.
  document.addEventListener('click', e => {
    const card = e.target.closest && e.target.closest('.hm-tool, .hm-ib');
    if (card && !card.disabled) spring(card.querySelector('.hm-tool-ic, svg'));
  });
  return { ok, swap, spring, place, reveal, share, takeShare, fly };
})();
