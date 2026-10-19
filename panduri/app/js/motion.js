/* =====================================================================
   Motion helpers that need a little JavaScript. The router owns screen
   transitions (app.js); this file adds the small things around them:
   - segmented controls: a thumb slides to the chosen option
   - play / pause and similar icon swaps morph instead of snapping
   - numbers that change (BPM, counters, stats) roll softly
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
  function spring(el) { if (!el || !ok() || !el.animate) return; el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.16) translateY(-1px)' }, { transform: 'scale(1)' }], { duration: 340, easing: 'cubic-bezier(.34,1.36,.64,1)' }); }
  return { ok, swap, spring, place };
})();
