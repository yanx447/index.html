/* =====================================================================
   Effects: sound, touch, light and celebration.
   - sounds: tiny synthesized cues on the app's "feedback" volume
     (Settings › audio); off with "Button sounds"
   - haptics: short vibrations where the device supports them (Android;
     iPhone browsers do not expose vibration); off with "Vibration"
   - ripple: a copper ring spreads from the finger on tap
   - light: a soft copper light follows the pointer over cards (mouse only)
   - parallax: hero pictures move slower than the page
   - celebrate(): copper confetti + a short chime, once, for real wins
   Nothing loops forever; all of it stops with "reduce motion".
   ===================================================================== */
PD.fx = (() => {
  const motion = () => PD.motion ? PD.motion.ok() : true;
  const soundsOn = () => PD.store.get('uiSounds', true);
  const hapticsOn = () => PD.store.get('haptics', true);

  /* ---------- sounds ---------- */
  function sound(kind) {
    if (!soundsOn() || !PD.audio || !PD.audio.ensure || (PD.practice && PD.practice.active && kind === 'tap')) return;
    const A = PD.audio; if (!A.ctx && !A.ensure()) return; const c = A.ctx; if (!c || c.state !== 'running') { try { c && c.resume(); } catch (_) {} if (!c || c.state !== 'running') return; }
    const t = c.currentTime + .005, b = (f, d, g, ty, w) => A.blip(f, d, g, ty, t + (w || 0));
    if (kind === 'tap') b(1900, .025, .035, 'sine');
    else if (kind === 'toggle') { b(1200, .035, .05, 'triangle'); b(1600, .03, .03, 'sine', .028); }
    else if (kind === 'select') b(1450, .04, .045, 'sine');
    else if (kind === 'success') { b(880, .14, .07, 'sine'); b(1320, .2, .06, 'sine', .07); }
    else if (kind === 'error') { b(330, .12, .07, 'triangle'); b(262, .16, .06, 'triangle', .08); }
    else if (kind === 'celebrate') [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => { b(f, .5, .055, 'sine', i * .085); b(f * 2, .28, .015, 'sine', i * .085 + .01); });
  }
  function haptic(kind) {
    if (!hapticsOn() || !navigator.vibrate) return;
    const P = { tap: 6, toggle: 10, select: 8, success: [12, 40, 18], error: [30, 50, 30], celebrate: [20, 60, 30, 60, 40] }[kind];
    try { if (P) navigator.vibrate(P); } catch (_) {}
  }
  const feedback = kind => { sound(kind); haptic(kind); };

  /* ---------- ripple from the finger ---------- */
  const RIPPLE = '.btn, .prow, .srow, .door, .pf2-i, .lib-card, .hx-goal2, .ai-card, .chip, .cgrid button, .ag-btn, .sp-start, button.li, .pa-b, .navb, .seg > button, .ai-tg, .ai-ms';
  function ripple(el, x, y) {
    if (!motion()) return;
    const r = el.getBoundingClientRect(); if (!r.width) return;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';   // never changes the element's size
    // the ring lives in its own clipping layer, so the tapped element's layout is untouched
    let box = el.querySelector(':scope > .fx-rbox'); if (!box) { box = document.createElement('span'); box.className = 'fx-rbox'; box.setAttribute('aria-hidden', 'true'); el.appendChild(box); }
    const d = Math.max(r.width, r.height) * 2.2, s = document.createElement('span');
    s.className = 'fx-ripple'; s.style.width = s.style.height = d + 'px'; s.style.left = (x - r.left - d / 2) + 'px'; s.style.top = (y - r.top - d / 2) + 'px';
    box.appendChild(s); s.addEventListener('animationend', () => s.remove()); setTimeout(() => s.remove(), 900);
  }
  document.addEventListener('pointerdown', e => {
    if (e.button && e.button !== 0) return;
    const el = e.target.closest && e.target.closest(RIPPLE); if (!el || el.disabled) return;
    ripple(el, e.clientX, e.clientY);
    const sel = el.matches('.chip, .seg > button, .cgrid button, .navb') ? 'select' : 'tap';
    feedback(sel);
  }, { passive: true });
  document.addEventListener('change', e => { if (e.target && e.target.matches && e.target.matches('input[type=checkbox]')) feedback('toggle'); }, true);

  /* ---------- light that follows the pointer (mouse / trackpad only) ---------- */
  const LIGHT = '.door, .prow, .lib-card, .hx-goal2, .pf2-menu, .ce-hero, .ai-card, .srow';
  if (window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('pointermove', e => {
      const el = e.target.closest && e.target.closest(LIGHT); if (!el) return;
      const r = el.getBoundingClientRect(); el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px'); el.classList.add('fx-lit');
    }, { passive: true });
    document.addEventListener('pointerout', e => { const el = e.target.closest && e.target.closest(LIGHT); if (el && !el.contains(e.relatedTarget)) el.classList.remove('fx-lit'); }, { passive: true });
  }

  /* ---------- parallax on hero pictures ---------- */
  document.addEventListener('scroll', e => {
    const pg = e.target; if (!pg || !pg.classList || !pg.classList.contains('page') || !motion()) return;
    const y = pg.scrollTop; pg.querySelectorAll('.hx-hero .hx-art, .lx-art').forEach(a => { const top = a.closest('.hx-hero, .lx-hero'); if (!top) return; const off = Math.max(-80, Math.min(120, (y - top.offsetTop + 40) * .22)); a.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0) scale(1.08)'; });
  }, { passive: true, capture: true });

  /* ---------- celebration ---------- */
  let busy = false;
  function celebrate(opts) {
    opts = opts || {};
    feedback('celebrate'); if (!motion() || busy) return; busy = true;
    const cv = document.createElement('canvas'), W = innerWidth, H = innerHeight, dpr = Math.min(2, devicePixelRatio || 1);
    cv.className = 'fx-confetti'; cv.width = W * dpr; cv.height = H * dpr; cv.setAttribute('aria-hidden', 'true'); document.body.appendChild(cv);
    const x = cv.getContext('2d'); x.scale(dpr, dpr);
    const COL = ['#E3A87A', '#C98B5B', '#F2D2B0', '#A86A3E', '#FFF4E8', '#7FE3A8'], N = opts.n || 110, ox = opts.x != null ? opts.x : W / 2, oy = opts.y != null ? opts.y : H * .42;
    const P = Array.from({ length: N }, (_, i) => { const a = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.25, v = 6 + Math.random() * 9; return { x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, r: Math.random() * Math.PI, vr: (Math.random() - .5) * .3, w: 5 + Math.random() * 6, h: 3 + Math.random() * 4, c: COL[i % COL.length], s: i % 5 === 0 ? 'dot' : 'rect' }; });
    // a short ring of light at the origin
    const t0 = performance.now(), D = 1700;
    const step = now => {
      const k = (now - t0) / D; x.clearRect(0, 0, W, H);
      if (k < .35) { const rk = k / .35; x.beginPath(); x.arc(ox, oy, 20 + rk * 140, 0, Math.PI * 2); x.strokeStyle = 'rgba(227,168,122,' + (.5 * (1 - rk)).toFixed(3) + ')'; x.lineWidth = 3 * (1 - rk) + 1; x.stroke(); }
      P.forEach(p => { p.vy += .32; p.vx *= .985; p.vy *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr; const a = Math.max(0, 1 - Math.max(0, k - .55) / .45); x.save(); x.globalAlpha = a; x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; if (p.s === 'dot') { x.beginPath(); x.arc(0, 0, p.h * .6, 0, Math.PI * 2); x.fill(); } else { x.scale(1, Math.cos(p.r * 2)); x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); } x.restore(); });
      if (k < 1) requestAnimationFrame(step); else { cv.remove(); busy = false; }
    };
    requestAnimationFrame(step);
  }
  return { sound, haptic, feedback, celebrate, ripple };
})();
