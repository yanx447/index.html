/* =====================================================================
   Effects: sound, touch, light and celebration.
   - sounds: tiny synthesized cues on the app's "feedback" volume
     (Settings › audio); off with "Button sounds"
   - haptics: the native Taptic / vibration engine in the installed app
     (Capacitor Haptics), short vibrations in Android browsers; iPhone
     browsers expose neither; off with "Vibration"
   - touch: things you can tap sink under the finger and spring back (CSS, design.css);
     there is no ripple and no light that follows the pointer — that read as decoration
   - parallax: hero pictures move a little slower than the page
   - celebrate(): a short burst of copper flakes + a chime, once, for real wins
   Nothing loops forever; all of it stops with "reduce motion".
   ===================================================================== */
PD.fx = (() => {
  const motion = () => PD.motion ? PD.motion.ok() : true;
  const soundsOn = () => PD.store.get('uiSounds', true);
  const hapticsOn = () => PD.store.get('haptics', true);

  /* ---------- sounds ---------- */
  function sound(kind) {
    if (PD.store.get('soundPalette', 'wood') === 'silent' || !soundsOn() || !PD.audio || !PD.audio.ensure || ((PD.practice && PD.practice.active || PD.detector && PD.detector.active) && ['tap', 'select', 'toggle'].includes(kind))) return;
    const A = PD.audio; if (!A.ctx && !A.ensure()) return; const c = A.ctx; if (!c || c.state !== 'running') { try { c && c.resume(); } catch (_) {} if (!c || c.state !== 'running') return; }
    const t = c.currentTime + .005, b = (f, d, g, ty, w) => A.blip(f, d, g, ty, t + (w || 0));
    if (kind === 'tap') { const wood = PD.store.get('soundPalette', 'wood') === 'wood'; b(wood ? 196 : 523.25, .035, .023, 'sine'); b(wood ? 587.33 : 1046.5, .022, .008, 'sine', .004); }
    else if (kind === 'toggle') { b(440, .07, .035, 'triangle'); b(659.25, .09, .025, 'sine', .035); }
    else if (kind === 'select') { b(220, .065, .025, 'sine'); b(329.63, .09, .014, 'sine', .018); }
    else if (kind === 'success') { b(880, .14, .07, 'sine'); b(1320, .2, .06, 'sine', .07); }
    else if (kind === 'error') { b(330, .12, .07, 'triangle'); b(262, .16, .06, 'triangle', .08); }
    else if (kind === 'celebrate') [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => { b(f, .5, .055, 'sine', i * .085); b(f * 2, .28, .015, 'sine', i * .085 + .01); });
  }
  function haptic(kind) {
    if (!hapticsOn()) return;
    const H = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics;
    if (H) {   // the installed app: the phone's own haptic engine (iPhone included)
      try {
        if (kind === 'success' || kind === 'celebrate') H.notification({ type: 'SUCCESS' });
        else if (kind === 'error') H.notification({ type: 'ERROR' });
        else H.impact({ style: kind === 'toggle' ? 'MEDIUM' : 'LIGHT' });
      } catch (_) {}
      return;
    }
    if (!navigator.vibrate) return;
    const P = { tap: 6, toggle: 10, select: 8, success: [12, 40, 18], error: [30, 50, 30], celebrate: [20, 60, 30, 60, 40] }[kind];
    try { if (P) navigator.vibrate(P); } catch (_) {}
  }
  const feedback = kind => { sound(kind); haptic(kind); };

  /* ---------- what a tap sounds and feels like ---------- */
  const TAPS = '.hm-tool, .hm-stat, .hm-card, .hm-next, .hm-ri, .hm-ib, .btn, .prow, .srow, .door, .pf2-i, .lib-card, .ai-card, .chip, .cgrid button, .ag-btn, .sp-start, button.li, .pa-b, .nv, .seg > button, .ai-tg, .ai-ms';
  document.addEventListener('click', e => {
    const el = e.target.closest && e.target.closest(TAPS);
    if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true') return;
    feedback(el.matches('.hm-tool, .chip, .seg > button, .cgrid button, .nv') ? 'select' : 'tap');
  });
  document.addEventListener('change', e => { if (e.target && e.target.matches && e.target.matches('input[type=checkbox]')) feedback('toggle'); }, true);

  /* ---------- parallax on hero pictures ---------- */
  document.addEventListener('scroll', e => {
    const pg = e.target; if (!pg || !pg.classList || !pg.classList.contains('page') || !motion()) return;
    const y = pg.scrollTop; pg.querySelectorAll('.hx-hero .hx-art, .lx-art').forEach(a => { const top = a.closest('.hx-hero, .lx-hero'); if (!top) return; const off = Math.max(-80, Math.min(120, (y - top.offsetTop + 40) * .12)); a.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0) scale(1.08)'; });
  }, { passive: true, capture: true });

  document.documentElement.classList.toggle('solid-nav', !PD.store.get('glass', true));
  /* ---------- celebration ---------- */
  let busy = false;
  function celebrate(opts) {
    opts = opts || {};
    feedback('celebrate'); if (!motion() || busy) return; busy = true;
    const cv = document.createElement('canvas'), W = innerWidth, H = innerHeight, dpr = Math.min(2, devicePixelRatio || 1);
    cv.className = 'fx-confetti'; cv.width = W * dpr; cv.height = H * dpr; cv.setAttribute('aria-hidden', 'true'); document.body.appendChild(cv);
    const x = cv.getContext('2d'); x.scale(dpr, dpr);
    const COL = ['#c28a5f', '#c78b5e', '#ddb08a', '#8f5b38', '#f3f3f4', '#7fe3a8'], N = opts.n || 56, ox = opts.x != null ? opts.x : W / 2, oy = opts.y != null ? opts.y : H * .42;
    const P = Array.from({ length: N }, (_, i) => { const a = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.25, v = 6 + Math.random() * 9; return { x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, r: Math.random() * Math.PI, vr: (Math.random() - .5) * .3, w: 5 + Math.random() * 6, h: 3 + Math.random() * 4, c: COL[i % COL.length], s: i % 5 === 0 ? 'dot' : 'rect' }; });
    // a short ring of light at the origin
    const t0 = performance.now(), D = 1700;
    const step = now => {
      if (!motion()) { cv.remove(); busy = false; return; }
      const k = (now - t0) / D; x.clearRect(0, 0, W, H);
      if (k < .35) { const rk = k / .35; x.beginPath(); x.arc(ox, oy, 20 + rk * 140, 0, Math.PI * 2); x.strokeStyle = 'rgba(199,139,94,' + (.5 * (1 - rk)).toFixed(3) + ')'; x.lineWidth = 3 * (1 - rk) + 1; x.stroke(); }
      P.forEach(p => { p.vy += .32; p.vx *= .985; p.vy *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr; const a = Math.max(0, 1 - Math.max(0, k - .55) / .45); x.save(); x.globalAlpha = a; x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; if (p.s === 'dot') { x.beginPath(); x.arc(0, 0, p.h * .6, 0, Math.PI * 2); x.fill(); } else { x.scale(1, Math.cos(p.r * 2)); x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); } x.restore(); });
      if (k < 1) requestAnimationFrame(step); else { cv.remove(); busy = false; }
    };
    requestAnimationFrame(step);
  }
  return { sound, haptic, feedback, celebrate };
})();
