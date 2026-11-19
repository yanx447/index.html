/* =====================================================================
   PD.aiTab3d — the transcription's TAB on the panduri's neck, in depth.

   The neck lies in front of the player and runs away from them; the frets
   go across it, the three strings are three rails at the near edge (A at
   the bottom, C♯, E on top, as in the tab), and every note of the TAB
   comes towards the player on its string's rail, at its fret, as the song
   plays. When it reaches the line at the near edge it lights up: that is
   the moment to play it. A held note trails behind; notes struck together
   are framed as one chord, with the AI's chord name. The view follows the
   frets the coming notes need.

   It only shows what the transcription already says (string, fret,
   time). Drawn on a 2D canvas in perspective: no WebGL, so it runs on any
   phone. In the app only (APP_ONLY).
   ===================================================================== */
'use strict';
PD.i18n.add({
  't3.title': ['TAB ფანდურის ტარზე', 'TAB on the panduri neck'],
  't3.ahead': ['წინ ჩანს', 'Look ahead'], 't3.sec': ['{n} წმ', '{n} s'],
  't3.hint': ['ნოტი მოდის თავისი სიმითა და ფრეტით — დაუკარი, როცა ნათელ ხაზს მიაღწევს. შეეხე ტარს, რომ იქ გადახვიდე.', 'Each note comes along its string, at its fret — play it as it reaches the bright line. Tap the neck to go there.'],
  't3.none': ['ამ ნოტებს ფანდურზე ადგილი ვერ მოეძებნა.', 'None of these notes has a place on the panduri.'],
  't3.open': ['ღია', 'open']
});

PD.aiTab3d = function (M, o) {
  const h = PD.h, t = PD.i18n.t, T = PD.theory, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const COL = { 1: [229, 138, 78], 2: [111, 169, 224], 3: [239, 227, 196] };   // A · C♯ · E, as on the app's neck
  const FR = (T && T.FRETS) || 17;
  const notes = M.notes.filter(n => n.reach !== false && n.s >= 1 && n.s <= 3 && n.f >= 0).slice().sort((a, b) => a.t0 - b.t0);
  // notes struck together: one chord frame
  const groups = []; notes.forEach(n => { const g = groups[groups.length - 1]; if (g && Math.abs(g.t0 - n.t0) < .035) g.ns.push(n); else groups.push({ t0: n.t0, ns: [n] }); });
  const chordAt = tm => { const c = (M.chords || []).find(c => c.t0 <= tm + .02 && c.t1 > tm); return c && c.name ? c.name : null; };
  let ahead = PD.store.get('t3.ahead', 3), now = 0, dead = false, raf = 0, dirty = true, lo = 0, hi = 7, W = 0, H = 0, dpr = 1;
  const flashes = [];

  const el = h('section', { class: 't3' }), cv = h('canvas', { class: 't3-cv', role: 'img', 'aria-label': t('t3.title') }), g = cv.getContext('2d');
  const sel = h('div', { class: 't3-seg', role: 'radiogroup', 'aria-label': t('t3.ahead') });
  [2, 3, 5].forEach(n => sel.append(h('button', { type: 'button', role: 'radio', 'aria-checked': String(n === ahead), class: n === ahead ? 'on' : '', text: t('t3.sec', { n }), onclick: e => { ahead = n; PD.store.set('t3.ahead', n); sel.querySelectorAll('button').forEach(b => { const me = b === e.currentTarget; b.classList.toggle('on', me); b.setAttribute('aria-checked', String(me)); }); paint(); } })));
  el.append(h('div', { class: 't3-top' }, [h('b', { text: t('t3.title') }), h('span', { class: 'ai-badge', text: '3D' }), h('span', { class: 't3-grow' }), h('small', { class: 'muted', text: t('t3.ahead') }), sel]),
    notes.length ? cv : h('p', { class: 'notice', text: t('t3.none') }), h('small', { class: 'muted t3-hint', text: t('t3.hint') }));
  style();

  /* ---------- the projection ---------- */
  const G = () => { const y0 = 26, y1 = H - 56, L = 44, R = W - 22; return { y0, y1, L, R, cx: (L + R) / 2, laneH: Math.min(26, (H - 56 - 26) * .085) }; };
  const SF = .26, DEPTH = 2.8, s1 = 1 / (1 + DEPTH);
  const prog = z => { const s = 1 / (1 + DEPTH * clamp(z, -.2, 1.05)); return (s - s1) / (1 - s1); };   // 1 at the near edge, 0 at the far end
  function P(slot, z, lane) {   // slot: 0 = open, k = the k-th fret's place; lane: the string's height
    const q = G(), p = prog(z), sc = SF + (1 - SF) * p, span = hi - lo + 1, u = (q.R - q.L) / span;
    const xn = q.L + (slot - lo + .5) * u, y = q.y0 + (q.y1 - q.y0) * p - lane * q.laneH * sc;
    return { x: q.cx + (xn - q.cx) * sc, y, sc, u: u * sc };
  }
  const wireX = (w, z) => { const q = G(), p = prog(z), sc = SF + (1 - SF) * p, u = (q.R - q.L) / (hi - lo + 1), xn = q.L + (w - lo) * u; return q.cx + (xn - q.cx) * sc; };
  const zOf = tm => (tm - now) / ahead;

  /* ---------- drawing ---------- */
  function rr(x, y, w, hh, r) { r = Math.min(r, w / 2, hh / 2); g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + hh, r); g.arcTo(x + w, y + hh, x, y + hh, r); g.arcTo(x, y + hh, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function follow() {
    const soon = notes.filter(n => n.t1 > now - .2 && n.t0 < now + ahead);
    const fs = soon.length ? soon.map(n => n.f) : [0, 5];
    const want = Math.max(6, Math.min(FR, Math.max(...fs)) - Math.max(0, Math.min(...fs)) + 3);
    let a = Math.max(0, Math.min(...fs) - 1), b = a + want; if (b > FR) { b = FR; a = Math.max(0, b - want); }
    lo += (a - lo) * .08; hi += (b - hi) * .08; if (Math.abs(a - lo) > .01 || Math.abs(b - hi) > .01) dirty = true;
  }
  function draw() {
    if (dead || !W) return;
    follow();
    const q = G();
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    // the room
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#060607'); bg.addColorStop(1, '#0d0d0f'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    // the board, a trapezoid of dark wood running away
    const nL = wireX(lo, 0) , nR = wireX(hi + 1, 0), fL = wireX(lo, 1), fR = wireX(hi + 1, 1);
    g.beginPath(); g.moveTo(nL - 8, q.y1 + 14); g.lineTo(nR + 8, q.y1 + 14); g.lineTo(fR, q.y0); g.lineTo(fL, q.y0); g.closePath();
    const wood = g.createLinearGradient(0, q.y0, 0, q.y1); wood.addColorStop(0, '#140d08'); wood.addColorStop(.55, '#3b2415'); wood.addColorStop(1, '#5b3620');
    g.fillStyle = wood; g.fill();
    g.save(); g.clip();
    // grain, running with the neck
    g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1;
    for (let i = 0; i < 22; i++) { const f = i / 21, xn = nL + (nR - nL) * f, xf = fL + (fR - fL) * f; g.beginPath(); g.moveTo(xn + Math.sin(i * 7.1) * 6, q.y1 + 14); g.lineTo(xf, q.y0); g.stroke(); }
    // the lanes the coming notes need glow a little
    const soonSlots = new Set(notes.filter(n => n.t0 > now - .1 && n.t0 < now + ahead).map(n => n.f));
    soonSlots.forEach(k => { const a = wireX(k, 0), b = wireX(k + 1, 0), c = wireX(k + 1, 1), d = wireX(k, 1); g.beginPath(); g.moveTo(a, q.y1 + 14); g.lineTo(b, q.y1 + 14); g.lineTo(c, q.y0); g.lineTo(d, q.y0); g.closePath(); g.fillStyle = 'rgba(255,210,160,.045)'; g.fill(); });
    // the time lines (one a beat), fading into the distance
    const bt = 60 / (M.bpm || 100);
    for (let k = Math.ceil(now / bt); k * bt < now + ahead; k++) { const z = zOf(k * bt), p = P(lo, z, 0), sc = p.sc; g.fillStyle = 'rgba(255,255,255,' + (.05 + .07 * prog(z)) + ')'; g.fillRect(wireX(lo, z), p.y, wireX(hi + 1, z) - wireX(lo, z), Math.max(1, sc * 1.4)); }
    // fret wires; the nut cream and thicker; the inlays
    for (let w = Math.floor(lo); w <= Math.ceil(hi) + 1; w++) {
      if (w < 0 || w > FR + 1) continue;
      const xn = wireX(w, 0), xf = wireX(w, 1);
      const gr = g.createLinearGradient(0, q.y0, 0, q.y1); gr.addColorStop(0, w === 1 ? 'rgba(238,226,200,.25)' : 'rgba(210,210,220,.10)'); gr.addColorStop(1, w === 1 ? 'rgba(238,226,200,.95)' : 'rgba(225,225,232,.55)');
      g.strokeStyle = gr; g.lineWidth = w === 1 ? 4 : 1.6; g.beginPath(); g.moveTo(xn, q.y1 + 14); g.lineTo(xf, q.y0); g.stroke();
    }
    [3, 5, 7, 9, 12, 15].forEach(k => { if (k < lo - .5 || k > hi + .5) return; const p = P(k, -.06, 0); g.fillStyle = 'rgba(240,200,90,.55)'; const ds = k === 12 ? [-.22, .22] : [0];
      ds.forEach(d => { g.beginPath(); g.ellipse(p.x + d * p.u, q.y1 + 6, 3.4, 2.2, 0, 0, Math.PI * 2); g.fill(); }); });
    g.restore();
    // the strings at the near edge: three rails, A low, E high
    const sounding = new Set(notes.filter(n => n.t0 <= now && n.t1 > now).map(n => n.s));
    [1, 2, 3].forEach(s => { const y = q.y1 - (s - 1) * q.laneH, c = COL[s], on = sounding.has(s);
      g.strokeStyle = 'rgba(' + c.join(',') + ',' + (on ? .95 : .45) + ')'; g.lineWidth = on ? 3 : 1.6; if (on) { g.shadowColor = 'rgba(' + c.join(',') + ',.9)'; g.shadowBlur = 12; }
      g.beginPath(); g.moveTo(nL - 6, y); g.lineTo(nR + 6, y); g.stroke(); g.shadowBlur = 0;
      g.fillStyle = 'rgb(' + c.join(',') + ')'; g.font = '700 12px system-ui, sans-serif'; g.textBaseline = 'middle'; g.textAlign = 'right'; g.fillText(T.stringName(s), nL - 12, y); g.textAlign = 'left'; });
    // the now line
    g.fillStyle = 'rgba(255,214,160,.16)'; g.fillRect(nL - 6, q.y1 - 2 * q.laneH - 10, nR - nL + 12, 2 * q.laneH + 20);
    // the notes, far first; a note's tail is its length
    const vis = notes.filter(n => n.t1 > now && n.t0 < now + ahead * 1.04);
    vis.slice().reverse().forEach(n => {
      const z0 = Math.max(zOf(n.t0), 0), z1 = Math.min(zOf(n.t1), 1.04), lane = n.s - 1, c = COL[n.s];
      const a = P(n.f, z0, lane), b = P(n.f, z1, lane), hit = n.t0 <= now && n.t1 > now;
      if (z1 > z0 + .02) {   // the held part: a thin ribbon that fades into the distance
        const tg = g.createLinearGradient(0, a.y, 0, b.y); tg.addColorStop(0, 'rgba(' + c.join(',') + ',' + (hit ? .6 : .34) + ')'); tg.addColorStop(1, 'rgba(' + c.join(',') + ',0)');
        g.fillStyle = tg; g.beginPath(); g.moveTo(a.x - a.u * .07, a.y); g.lineTo(a.x + a.u * .07, a.y); g.lineTo(b.x + b.u * .07, b.y); g.lineTo(b.x - b.u * .07, b.y); g.closePath(); g.fill(); }
      if (zOf(n.t0) < -.03) return;   // past the line: only its ringing tail is left
      // a drop line to the board shows how high the rail is
      const base = P(n.f, z0, 0); if (lane) { g.strokeStyle = 'rgba(' + c.join(',') + ',.35)'; g.lineWidth = 1; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(base.x, base.y); g.stroke(); }
      const w = Math.max(10, a.u * .74), hh = Math.max(7, 22 * a.sc), x = a.x - w / 2, y = a.y - hh / 2, near = prog(z0);
      if (hit || zOf(n.t0) < .02) { g.shadowColor = 'rgba(' + c.join(',') + ',1)'; g.shadowBlur = 20; }
      const gr = g.createLinearGradient(0, y, 0, y + hh); gr.addColorStop(0, 'rgba(' + c.map(v => Math.min(255, v + 40)).join(',') + ',' + (.55 + .45 * near) + ')'); gr.addColorStop(1, 'rgba(' + c.map(v => Math.round(v * .7)).join(',') + ',' + (.55 + .45 * near) + ')');
      rr(x, y, w, hh, Math.min(7, hh / 2)); g.fillStyle = gr; g.fill(); g.shadowBlur = 0;
      g.strokeStyle = 'rgba(255,255,255,' + (.25 + .5 * near) + ')'; g.lineWidth = 1; g.stroke();
      if (hh >= 9) { g.fillStyle = n.s === 3 ? '#2a2117' : '#fff'; g.font = '800 ' + Math.round(Math.min(15, hh * .72)) + 'px system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(n.f === 0 ? '0' : String(n.f), a.x, a.y + .5); g.textAlign = 'left'; }
    });
    // chords: a frame round the notes struck together, and the chord's name
    let prevName = null;
    groups.forEach(gp => {
      if (gp.ns.length < 2) return;
      const nm0 = chordAt(gp.t0), changed = nm0 !== prevName; prevName = nm0; const z = zOf(gp.t0); if (z < -.02 || z > 1) return;
      const ps = gp.ns.map(n => P(n.f, z, n.s - 1)), x0 = Math.min(...ps.map(p => p.x - p.u * .45)), x1 = Math.max(...ps.map(p => p.x + p.u * .45)), y0 = Math.min(...ps.map(p => p.y)) - 16 * ps[0].sc, y1 = Math.max(...ps.map(p => p.y)) + 14 * ps[0].sc;
      g.strokeStyle = 'rgba(255,230,200,' + (.15 + .45 * prog(z)) + ')'; g.lineWidth = 1.2; rr(x0, y0, x1 - x0, y1 - y0, 8 * ps[0].sc); g.stroke();
      const nm = changed ? nm0 : null; if (nm && ps[0].sc > .4) { g.fillStyle = 'rgba(255,236,214,' + (.4 + .6 * prog(z)) + ')'; g.font = '800 ' + Math.round(12 + 6 * ps[0].sc) + 'px system-ui, sans-serif'; g.textAlign = 'center'; g.fillText(nm, (x0 + x1) / 2, y0 - 8 * ps[0].sc); g.textAlign = 'left'; }
    });
    // the bright line, and a flash where a note lands
    g.fillStyle = '#ffd7a8'; g.shadowColor = 'rgba(255,190,120,.9)'; g.shadowBlur = 14; g.fillRect(nL - 6, q.y1 + 11, nR - nL + 12, 2.5); g.shadowBlur = 0;
    const tn = performance.now();
    for (let i = flashes.length - 1; i >= 0; i--) { const f = flashes[i], age = (tn - f.at) / 380; if (age > 1) { flashes.splice(i, 1); continue; }
      const p = P(f.f, 0, f.s - 1), c = COL[f.s]; g.strokeStyle = 'rgba(' + c.join(',') + ',' + (1 - age) + ')'; g.lineWidth = 2.5; g.beginPath(); g.arc(p.x, p.y, 8 + 26 * age, 0, Math.PI * 2); g.stroke(); dirty = true; }
    // fret numbers under the board
    g.font = '600 12px system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let k = Math.max(0, Math.ceil(lo - .5)); k <= Math.min(FR, Math.floor(hi + .5)); k++) { const p = P(k, 0, 0), on = [...sounding].length && notes.some(n => n.f === k && n.t0 <= now && n.t1 > now);
      g.fillStyle = on ? '#ffd7a8' : [3, 5, 7, 9, 12, 15].includes(k) ? '#cbb27a' : '#77777d'; g.fillText(k === 0 ? t('t3.open') : String(k), p.x, H - 22); }
    g.textAlign = 'left';
  }
  function loop() { raf = 0; if (dead) return; if (dirty) { dirty = false; draw(); } if (dirty || (o.playing && o.playing())) raf = requestAnimationFrame(loop); }
  const paint = () => { dirty = true; if (!raf) raf = requestAnimationFrame(loop); };
  function resize() { const r = cv.getBoundingClientRect(); if (!r.width) return; dpr = Math.min(2, devicePixelRatio || 1); W = Math.round(r.width); H = Math.round(r.height); cv.width = W * dpr; cv.height = H * dpr; paint(); }
  const ro = window.ResizeObserver ? new ResizeObserver(resize) : null; if (ro) ro.observe(cv);
  requestAnimationFrame(resize);
  cv.addEventListener('click', e => { const r = cv.getBoundingClientRect(), y = e.clientY - r.top, q = G(); const p = clamp((y - q.y0) / (q.y1 - q.y0), 0, 1);
    // invert the depth: p = (s - s1)/(1 - s1), s = 1/(1 + D z)
    const s = p * (1 - s1) + s1, z = (1 / s - 1) / DEPTH; o.seek && o.seek(clamp(now + z * ahead, 0, M.dur)); });
  let lastT = -1;
  function tick(p) {
    if (Math.abs(p - now) > 1e-4) { if (p > now && p - now < .5) notes.forEach(n => { if (n.t0 > now && n.t0 <= p) flashes.push({ s: n.s, f: n.f, at: performance.now() }); }); now = p; paint(); }
    lastT = p;
  }
  function style() {
    if (PD.aiTab3d._styled) return; PD.aiTab3d._styled = true;
    document.head.appendChild(h('style', { text: `
.t3{display:grid;gap:10px;padding:14px;border-radius:20px;background:#09090a;border:1px solid rgba(255,255,255,.08);margin-bottom:12px;min-width:0}
.t3-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.t3-top b{font-size:16px}.t3-grow{flex:1}
.t3-seg{display:inline-flex;padding:3px;border-radius:11px;background:#141416;border:1px solid rgba(255,255,255,.08)}
.t3-seg button{min-height:30px;padding:0 10px;border:0;border-radius:8px;background:none;color:#a9a9ae;font:600 12px/1 inherit;cursor:pointer}.t3-seg button.on{background:#2a2622;color:#f2d2b3}
.t3-cv{display:block;width:100%;height:clamp(260px,46vh,420px);border-radius:14px;cursor:pointer}
.t3-hint{line-height:1.45}
` }));
  }
  return { el, tick, draw: paint, stop() { dead = true; cancelAnimationFrame(raf); if (ro) ro.disconnect(); } };
};
