/* =====================================================================
   PD.aiRoll — the AI studio's piano roll, drawn on one canvas.

   The same contract as PD.aiPiano (aipiano.js), which the single file
   keeps: (M, o) → { el, tick, draw, stop }, and every edit goes through
   o.change / o.add / o.remove / o.undo, so the transcription, its undo and
   everything written from it (staff, tab, MIDI) stay as they were.

   What it shows:
   · a real keyboard down the side (C's named, the playing keys lit);
   · bars, beats and the snap grid; the song's key shaded across the rows
     (its scale degrees), and the panduri's own range banded — computed
     from the tuning and the 17 frets;
   · the AI's chords in a lane above the notes;
   · the notes: brighter for louder, translucent when the AI was unsure,
     striped when the panduri cannot play them, glowing while they sound;
   · a velocity lane under the grid, edited by dragging.
   How it is used: tap a note to select and hear it; drag to move it in time
   and pitch, its right edge to lengthen it; the pencil adds, the eraser
   removes; drag the background (or two fingers) to move around; the wheel
   scrolls, with ⌘/Ctrl it zooms in time, with Alt in pitch. The arrow keys
   move the selected note, Delete removes it, ⌘/Ctrl-Z takes it back.

   In the app only (APP_ONLY): the single file has no room; there the
   older DOM roll is used.
   ===================================================================== */
'use strict';
PD.i18n.add({
  'rl.select': ['არჩევა', 'Select'], 'rl.draw': ['ფანქარი', 'Pencil'], 'rl.erase': ['საშლელი', 'Eraser'],
  'rl.tool': ['ხელსაწყო', 'Tool'], 'rl.scale': ['ტონალობა', 'Key'], 'rl.range': ['ფანდურის დიაპაზონი', 'Fanduri range'],
  'rl.hear': ['მოსმენა', 'Hear notes'], 'rl.vel': ['სიმძლავრე', 'Velocity'], 'rl.chords': ['აკორდები', 'Chords'],
  'rl.hint': ['შეეხე ნოტს — აირჩევ და მოისმენ · გადაათრიე — დრო და სიმაღლე · მარჯვენა კიდე — ხანგრძლივობა · ფონის გადათრევა — გადაადგილება · ⌘/Ctrl + ბორბალი — მასშტაბი', 'Tap a note to select and hear it · drag it to move in time and pitch · its right edge to lengthen · drag the background to move around · ⌘/Ctrl + wheel to zoom'],
  'rl.count': ['{n} ნოტი', '{n} notes'], 'rl.pan': ['ფანდური', 'panduri']
});

PD.aiRollStyle = (() => { let done = false; return () => { if (done) return; done = true; document.head.appendChild(PD.h('style', { text: `
.rl{min-width:0;border:1px solid rgba(255,255,255,.09);border-radius:18px;overflow:hidden;background:#0e0f10}
.rl-bar{display:flex;flex-wrap:wrap;gap:8px 10px;align-items:center;padding:10px 12px;background:#151618;border-bottom:1px solid rgba(255,255,255,.07)}
.rl-seg{display:inline-flex;padding:3px;border-radius:12px;background:#0e0f10;border:1px solid rgba(255,255,255,.08)}
.rl-seg button{display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:0 10px;border:0;border-radius:9px;background:none;color:#a9a9ae;font:600 13px/1 inherit;cursor:pointer}
.rl-seg button svg{width:16px;height:16px}.rl-seg button.on{background:#2a2622;color:#f2d2b3;box-shadow:inset 0 0 0 1px rgba(217,154,100,.45)}
.rl-lab,.rl-zoom{display:inline-flex;align-items:center;gap:6px}.rl-lab small,.rl-zoom small{color:#8a8a90;font-size:12px}
.rl-sel{min-height:32px;border-radius:9px;background:#0e0f10;color:#e6e6ea;border:1px solid rgba(255,255,255,.12);padding:0 8px}
.rl-ib{width:32px;height:32px;border-radius:9px;border:1px solid rgba(255,255,255,.12);background:#0e0f10;color:#e6e6ea;font-size:16px;cursor:pointer}
.rl-tg[aria-pressed="true"]{background:#2a2622;color:#f2d2b3;border-color:rgba(217,154,100,.5)}
.rl-stage{position:relative;height:min(62vh,560px);min-height:300px;touch-action:none;outline:none}.rl-stage:focus-visible{box-shadow:inset 0 0 0 2px rgba(217,154,100,.7)}
.rl-cv{display:block;width:100%;height:100%}
.rl .apr-hint{margin:0;padding:8px 12px;color:#8a8a90;font-size:12px;background:#121315}
.rl .apr-inspector{border-top:1px solid rgba(255,255,255,.07)}
@media (max-width:640px){.rl-stage{height:58vh}.rl-seg button span{display:none}.rl-bar{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}.rl-bar::-webkit-scrollbar{display:none}.rl-bar>*{flex:0 0 auto}.rl .apr-hint{display:none}}
` })); }; })();
PD.aiRoll = function (M, o) {
  PD.aiRollStyle();
  const h = PD.h, t = PD.i18n.t, T = PD.theory, A = PD.aiScore, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const state = o.state, LO = 21, HI = 108;
  const KW = 58, RH = 24, CH = M.chords && M.chords.length ? 24 : 0, VH0 = 64;   // keys, ruler, chord lane, velocity lane (CSS px)
  let px = state.px || 110, rh = state.rh || 16, snap = state.snap ?? .25, follow = state.follow ?? true;
  let tool = state.tool || 'select', showScale = state.scale ?? true, showRange = state.range ?? true, hear = state.hear ?? true, showVel = state.vel ?? true;
  let sx = state.left || 0, sy = state.top == null ? null : state.top, selected = null, drag = null, hover = null, dead = false, playPos = 0, active = new Set(), dirty = true, raf = 0;
  const origin = A.beatAt(0, M.beats, M.bpm), beat = tm => A.beatAt(tm, M.beats, M.bpm) - origin, time = b => A.secondsAt(b + origin, M.beats, M.bpm);
  const total = Math.max(4, Math.ceil(beat(M.dur)) + 1), bpb = (M.metre && M.metre.beatsPerBar) || 4;
  // the panduri: from the lowest open string to the 17th fret of the highest — computed from the tuning
  let panLo = 57, panHi = 81;
  try { const S = [1, 2, 3].map(s => T.midi(s, 0)); panLo = Math.min(...S); panHi = Math.max(...S) + (T.FRETS || 17); } catch (_) {}
  // the key's scale, when the AI is sure enough of it
  const key = M.key && M.key.r != null && M.key.r >= 0 ? M.key : null;
  const scaleSet = key ? new Set((key.q ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11]).map(d => (key.r + d) % 12)) : null;
  const isBlack = m => [1, 3, 6, 8, 10].includes(((m % 12) + 12) % 12);

  /* ---------- the frame ---------- */
  const el = h('section', { class: 'rl' }), bar = h('div', { class: 'rl-bar' });
  const stage = h('div', { class: 'rl-stage', tabindex: 0, role: 'application', 'aria-label': t('apr.piano') + ' · ' + t('rl.count', { n: M.notes.length }) });
  const cv = h('canvas', { class: 'rl-cv' }), g = cv.getContext('2d'); stage.append(cv);
  const inspector = h('div', { class: 'apr-inspector' }), error = h('small', { class: 'apr-error', role: 'alert' });
  const seg = (items, cur, on) => h('div', { class: 'rl-seg', role: 'radiogroup' }, items.map(([k, label, icon]) => h('button', { type: 'button', role: 'radio', class: k === cur ? 'on' : '', 'aria-checked': String(k === cur), title: label, html: (icon || '') + '<span>' + PD.esc(label) + '</span>', onclick: e => { e.currentTarget.parentNode.querySelectorAll('button').forEach(b => { const me = b === e.currentTarget; b.classList.toggle('on', me); b.setAttribute('aria-checked', String(me)); }); on(k); } })));
  const I = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  const toggle = (label, get, set) => { const b = h('button', { type: 'button', class: 'chip rl-tg', 'aria-pressed': String(get()), text: label, onclick: () => { set(!get()); b.setAttribute('aria-pressed', String(get())); save(); paint(); } }); return b; };
  const snapSel = h('select', { class: 'rl-sel', 'aria-label': t('apr.snap'), onchange: e => { snap = +e.target.value; save(); paint(); } });
  [[0, t('apr.off')], [1, '1/4'], [.5, '1/8'], [.25, '1/16'], [1 / 3, '1/8 ³']].forEach(([v, k]) => snapSel.append(h('option', { value: v, text: k, selected: Math.abs(snap - v) < 1e-6 })));
  const zoomB = (label, f) => h('button', { type: 'button', class: 'rl-ib', 'aria-label': label, text: label.slice(-1), onclick: () => f() });
  [
    seg([['select', t('rl.select'), I('<path d="M5 3l14 8-6 1.6L10 19z"/>')], ['draw', t('rl.draw'), I('<path d="M4 20l4-1 11-11-3-3L5 16z"/>')], ['erase', t('rl.erase'), I('<path d="M7 19h12M5 15l8-8 5 5-6 6H8z"/>')]], tool, k => { tool = k; save(); paint(); }),
    h('label', { class: 'rl-lab' }, [h('small', { text: t('apr.snap') }), snapSel]),
    h('div', { class: 'rl-zoom' }, [h('small', { text: t('apr.zoomX') }), zoomB('−', () => zoomX(1 / 1.25)), zoomB('+', () => zoomX(1.25))]),
    h('div', { class: 'rl-zoom' }, [h('small', { text: t('apr.zoomY') }), zoomB('−', () => zoomY(1 / 1.2)), zoomB('+', () => zoomY(1.2))]),
    key ? toggle(t('rl.scale') + ' · ' + PD.ai.cname(key.r, key.q ? 'm' : ''), () => showScale, v => { showScale = v; }) : null,
    toggle(t('rl.range'), () => showRange, v => { showRange = v; }),
    toggle(t('rl.vel'), () => showVel, v => { showVel = v; resize(); }),
    toggle(t('rl.hear'), () => hear, v => { hear = v; }),
    toggle(t('as.follow'), () => follow, v => { follow = v; }),
    h('button', { type: 'button', class: 'chip', text: t('apr.fit'), onclick: () => { fit(); paint(); } }),
    h('button', { type: 'button', class: 'chip', text: t('apr.undo'), disabled: !o.canUndo(), onclick: () => { save(); o.undo(); } })].filter(Boolean).forEach(c => bar.append(c));
  el.append(bar, h('p', { class: 'apr-hint', text: t('rl.hint') }), stage, inspector);

  /* ---------- geometry ---------- */
  let W = 0, H = 0, dpr = 1;
  const VH = () => showVel ? VH0 : 0;
  const gridTop = () => RH + CH, gridH = () => H - gridTop() - VH();
  const worldW = () => total * px, worldH = () => (HI - LO + 1) * rh;
  const maxX = () => Math.max(0, worldW() - (W - KW)), maxY = () => Math.max(0, worldH() - gridH());
  const X = tm => KW + beat(tm) * px - sx, Ytop = m => gridTop() + (HI - m) * rh - sy;
  const atX = cx => time((cx - KW + sx) / px), atM = cy => clamp(HI - Math.floor((cy - gridTop() + sy) / rh), LO, HI);
  function clampView() { sx = clamp(sx, 0, maxX()); sy = clamp(sy, 0, maxY()); }
  function resize() {
    const r = stage.getBoundingClientRect(); if (!r.width) return;
    dpr = Math.min(2, window.devicePixelRatio || 1); W = Math.round(r.width); H = Math.round(r.height);
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
    if (sy == null) fit(); clampView(); paint(true);
  }
  function fit() {
    const ps = M.notes.map(n => n.m); if (!ps.length) { sy = clamp((HI - 72) * rh - gridH() / 2, 0, maxY()); return; }
    const top = Math.max(...ps) + 3, bot = Math.min(...ps) - 3, span = Math.max(12, top - bot + 1);
    rh = clamp(Math.floor(gridH() / span), 10, 26);
    sy = clamp((HI - top) * rh, 0, maxY()); sx = clamp((beat(Math.min(...M.notes.map(n => n.t0))) - .5) * px, 0, maxX());
  }
  function zoomX(f, cx) { const c = cx == null ? KW + (W - KW) / 2 : cx, b = (c - KW + sx) / px; px = clamp(px * f, 24, 480); sx = b * px - (c - KW); clampView(); save(); paint(); }
  function zoomY(f, cy) { const c = cy == null ? gridTop() + gridH() / 2 : cy, r0 = (c - gridTop() + sy) / rh; rh = clamp(Math.round(rh * f), 8, 34); sy = r0 * rh - (c - gridTop()); clampView(); save(); paint(); }
  const save = () => Object.assign(state, { px, rh, snap, follow, tool, scale: showScale, range: showRange, hear, vel: showVel, left: sx, top: sy, selected: selected ? selected.id : state.selected });

  /* ---------- drawing ---------- */
  const C = { bg: '#0e0f10', row: '#141517', rowB: '#0f1011', inKey: 'rgba(199,139,94,.055)', pan: 'rgba(120,190,255,.045)', panEdge: 'rgba(120,190,255,.35)',
    sub: 'rgba(255,255,255,.035)', beat: 'rgba(255,255,255,.075)', bar: 'rgba(255,255,255,.17)', cRow: 'rgba(255,255,255,.10)',
    note: [214, 146, 92], sel: '#fff4e2', play: '#ffd9a8', txt: 'rgba(20,12,6,.86)', head: '#151618', fg: '#d8d8dc', fg3: '#85858b', acc: '#d99a64' };
  let hatch = null;
  function stripes() {
    if (hatch) return hatch; const c = document.createElement('canvas'); c.width = c.height = 8; const x = c.getContext('2d');
    x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 2; x.beginPath(); x.moveTo(-2, 10); x.lineTo(10, -2); x.stroke(); return (hatch = g.createPattern(c, 'repeat'));
  }
  function rr(x, y, w, hh, r) { r = Math.min(r, w / 2, hh / 2); g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + hh, r); g.arcTo(x + w, y + hh, x, y + hh, r); g.arcTo(x, y + hh, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function paint(now) { dirty = true; if (now) draw0(); else if (!raf) raf = requestAnimationFrame(() => { raf = 0; draw0(); }); }
  function draw0() {
    if (dead || !W || !dirty) return; dirty = false;
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    const gt = gridTop(), gh = gridH(), gb = gt + gh;
    g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
    // rows
    g.save(); g.beginPath(); g.rect(KW, gt, W - KW, gh); g.clip();
    const mTop = clamp(HI - Math.floor(sy / rh), LO, HI), mBot = clamp(HI - Math.floor((sy + gh) / rh), LO, HI);
    for (let m = mTop; m >= mBot; m--) {
      const y = Ytop(m), pc = ((m % 12) + 12) % 12;
      g.fillStyle = isBlack(m) ? C.rowB : C.row; g.fillRect(KW, y, W - KW, rh);
      if (showScale && scaleSet && scaleSet.has(pc)) { g.fillStyle = C.inKey; g.fillRect(KW, y, W - KW, rh); }
      if (showRange && m >= panLo && m <= panHi) { g.fillStyle = C.pan; g.fillRect(KW, y, W - KW, rh); }
      if (pc === 0) { g.fillStyle = C.cRow; g.fillRect(KW, y + rh - 1, W - KW, 1); }
    }
    if (showRange) { g.fillStyle = C.panEdge; [Ytop(panHi), Ytop(panLo) + rh].forEach(y => { if (y > gt - 1 && y < gb + 1) g.fillRect(KW, y - .5, W - KW, 1); }); }
    // the time grid
    const b0 = Math.max(0, Math.floor(sx / px)), b1 = Math.min(total, Math.ceil((sx + W - KW) / px) + 1);
    if (snap && px * snap >= 10) { g.fillStyle = C.sub; for (let b = b0; b < b1; b += snap) g.fillRect(Math.round(KW + b * px - sx), gt, 1, gh); }
    for (let b = b0; b <= b1; b++) { g.fillStyle = b % bpb === 0 ? C.bar : C.beat; g.fillRect(Math.round(KW + b * px - sx), gt, 1, gh); }
    // notes
    const tL = atX(KW), tR = atX(W);
    M.notes.forEach(n => {
      if (n.t1 < tL || n.t0 > tR || n.m > mTop + 1 || n.m < mBot - 1) return;
      const x = X(n.t0), w = Math.max(5, X(n.t1) - x), y = Ytop(n.m) + 1, hh = Math.max(4, rh - 2);
      const v = clamp((n.velocity == null ? 90 : n.velocity) / 127, .15, 1), unsure = (n.conf ?? 1) < .5, sel = n === selected, on = active.has(n);
      const k = .55 + .45 * v, [r0, g0, b0c] = C.note;
      g.globalAlpha = unsure && !sel ? .55 : 1;
      if (on) { g.shadowColor = 'rgba(255,190,120,.85)'; g.shadowBlur = 14; }
      const grd = g.createLinearGradient(0, y, 0, y + hh);
      grd.addColorStop(0, on ? C.play : 'rgb(' + Math.round(r0 * k + 40) + ',' + Math.round(g0 * k + 30) + ',' + Math.round(b0c * k + 20) + ')');
      grd.addColorStop(1, on ? '#f0b779' : 'rgb(' + Math.round(r0 * k * .82) + ',' + Math.round(g0 * k * .78) + ',' + Math.round(b0c * k * .72) + ')');
      rr(x, y, w, hh, Math.min(5, hh / 2)); g.fillStyle = grd; g.fill(); g.shadowBlur = 0;
      if (n.reach === false) { g.fillStyle = stripes(); g.fill(); }
      g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(x, y, Math.min(3, w), hh);   // the attack
      if (sel) { g.lineWidth = 2; g.strokeStyle = C.sel; rr(x, y, w, hh, Math.min(5, hh / 2)); g.stroke(); }
      else if (unsure) { g.setLineDash([3, 3]); g.lineWidth = 1; g.strokeStyle = 'rgba(255,220,180,.7)'; rr(x + .5, y + .5, w - 1, hh - 1, Math.min(5, hh / 2)); g.stroke(); g.setLineDash([]); }
      if (w > 28 && hh >= 11) { g.fillStyle = C.txt; g.font = '600 ' + Math.min(11, hh - 3) + 'px system-ui, sans-serif'; g.textBaseline = 'middle'; g.fillText(T.name(n.m), x + 6, y + hh / 2 + .5, w - 9); }
      g.globalAlpha = 1;
    });
    if (drag && drag.kind === 'new') { const x = X(drag.t0), w = Math.max(6, X(drag.t1) - x), y = Ytop(drag.m) + 1; rr(x, y, w, rh - 2, 4); g.fillStyle = 'rgba(255,230,200,.8)'; g.fill(); }   // the note the pencil is drawing
    if (hover && tool !== 'select' && !drag) { const x = X(hover.t), y = Ytop(hover.m) + 1; g.strokeStyle = tool === 'erase' ? 'rgba(255,120,110,.8)' : 'rgba(255,255,255,.55)'; g.setLineDash([4, 3]); g.strokeRect(x, y, Math.max(8, (snap || .25) * px), rh - 2); g.setLineDash([]); }
    g.restore();
    // the keyboard
    g.save(); g.beginPath(); g.rect(0, gt, KW, gh); g.clip();
    const playing = new Set([...active].map(n => n.m));
    for (let m = mTop; m >= mBot; m--) {
      const y = Ytop(m), blk = isBlack(m), lit = playing.has(m) || (selected && selected.m === m);
      g.fillStyle = lit ? C.acc : blk ? '#1b1c1f' : '#e9e7e2'; g.fillRect(blk ? 0 : 0, y, blk ? KW * .62 : KW, rh);
      if (blk && !lit) { g.fillStyle = '#d6d3cd'; g.fillRect(KW * .62, y, KW * .38, rh); }
      g.fillStyle = blk ? 'rgba(0,0,0,.6)' : 'rgba(0,0,0,.16)'; g.fillRect(0, y + rh - 1, KW, 1);
      if ((m % 12 === 0 || rh >= 18) && !blk) { g.fillStyle = lit ? '#1a0f07' : m % 12 === 0 ? '#2b2b2f' : '#8f8d88'; g.font = (m % 12 === 0 ? '700 ' : '500 ') + Math.min(11, rh - 3) + 'px system-ui, sans-serif'; g.textBaseline = 'middle'; g.textAlign = 'right'; g.fillText(T.name(m), KW - 6, y + rh / 2 + .5); g.textAlign = 'left'; }
    }
    if (showRange) { const y1 = Ytop(panHi), y2 = Ytop(panLo) + rh; g.fillStyle = 'rgba(120,190,255,.75)'; g.fillRect(KW - 3, Math.max(gt, y1), 3, Math.max(0, Math.min(gb, y2) - Math.max(gt, y1))); }
    g.restore();
    // the ruler and the chord lane
    g.fillStyle = C.head; g.fillRect(0, 0, W, gt); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(0, gt - 1, W, 1);
    g.save(); g.beginPath(); g.rect(KW, 0, W - KW, gt); g.clip();
    g.font = '600 11px system-ui, sans-serif'; g.textBaseline = 'middle';
    for (let b = b0; b <= b1; b++) {
      const x = Math.round(KW + b * px - sx);
      if (b % bpb === 0) { g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(x, 4, 1, RH - 4); g.fillStyle = C.fg; g.fillText(String(Math.floor(b / bpb) + 1), x + 5, RH / 2); }
      else if (px >= 30) { g.fillStyle = 'rgba(255,255,255,.16)'; g.fillRect(x, RH - 8, 1, 8); }
    }
    if (CH) (M.chords || []).forEach((c, i) => {
      if (!c.name || c.t1 < tL || c.t0 > tR) return;
      const x = X(c.t0), w = Math.max(2, X(c.t1) - x - 2), y = RH + 3;
      rr(x + 1, y, w, CH - 6, 6); g.fillStyle = i % 2 ? 'rgba(199,139,94,.22)' : 'rgba(199,139,94,.34)'; g.fill();
      if (w > 18) { g.fillStyle = '#f3dcc6'; g.font = '700 11px system-ui, sans-serif'; g.fillText(c.name, x + 7, y + (CH - 6) / 2 + .5, w - 10); }
    });
    g.restore();
    g.fillStyle = C.head; g.fillRect(0, 0, KW, gt); g.fillStyle = C.fg3; g.font = '600 10px system-ui, sans-serif'; g.textBaseline = 'middle';
    g.fillText(t('apr.pitch'), 8, RH / 2); if (CH) g.fillText(t('rl.chords'), 8, RH + CH / 2);
    // the velocity lane
    if (VH()) {
      const vt = gb, vh = VH();
      g.fillStyle = '#121315'; g.fillRect(0, vt, W, vh); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(0, vt, W, 1);
      g.fillStyle = C.fg3; g.fillText(t('rl.vel'), 8, vt + 12);
      g.save(); g.beginPath(); g.rect(KW, vt, W - KW, vh); g.clip();
      M.notes.forEach(n => { if (n.t1 < tL || n.t0 > tR) return; const x = X(n.t0), v = clamp((n.velocity == null ? 90 : n.velocity) / 127, 0, 1), hh = (vh - 14) * v;
        g.fillStyle = n === selected ? C.sel : active.has(n) ? C.play : 'rgba(217,154,100,.8)'; g.fillRect(x, vt + vh - 4 - hh, 2, hh); g.beginPath(); g.arc(x + 1, vt + vh - 4 - hh, 3, 0, Math.PI * 2); g.fill(); });
      g.restore();
    }
    // the playhead
    const ph = X(playPos);
    if (ph >= KW && ph <= W) { g.fillStyle = 'rgba(255,200,140,.18)'; g.fillRect(ph - 3, 0, 6, H); g.fillStyle = '#ffcf9a'; g.fillRect(Math.round(ph), 0, 1.5, H);
      g.beginPath(); g.moveTo(ph - 6, 0); g.lineTo(ph + 6, 0); g.lineTo(ph, 8); g.closePath(); g.fill(); }
    // scroll bars, thin
    if (maxX() > 0) { const w = (W - KW) * (W - KW) / worldW(), x = KW + (W - KW - w) * (sx / maxX()); g.fillStyle = 'rgba(255,255,255,.16)'; rr(x, H - 4, w, 3, 2); g.fill(); }
    if (maxY() > 0) { const hh = gh * gh / worldH(), y = gt + (gh - hh) * (sy / maxY()); g.fillStyle = 'rgba(255,255,255,.16)'; rr(W - 4, y, 3, hh, 2); g.fill(); }
  }

  /* ---------- editing ---------- */
  function hit(cx, cy) {
    if (cx < KW || cy < gridTop() || cy > gridTop() + gridH()) return null;
    for (let i = M.notes.length - 1; i >= 0; i--) { const n = M.notes[i], x = X(n.t0), w = Math.max(5, X(n.t1) - x), y = Ytop(n.m);
      if (cx >= x && cx <= x + w && cy >= y && cy <= y + rh) return { n, edge: cx > x + w - Math.min(8, w / 3) }; }
    return null;
  }
  const snapped = s => snap ? clamp(time(Math.round(beat(s) / snap) * snap), 0, M.dur) : clamp(s, 0, M.dur);
  const audition = m => { if (!hear) return; try { PD.audio.theory.midi(m, { dur: .45, vel: .7 }); } catch (_) {} };
  function select(n, seek) { selected = n; state.selected = n ? n.id : null; inspect(); paint(); if (n && seek) o.seek(n.t0); }
  function commit(n, patch) {
    if (!o.canEdit()) return;
    const a = Number(patch.t0 ?? n.t0), end = Number(patch.t1 ?? n.t1), m = Number(patch.m ?? n.m), vel = Number(patch.velocity ?? n.velocity ?? 90);
    if (!Number.isFinite(a) || !Number.isFinite(end) || !Number.isInteger(m) || a < 0 || end > M.dur || end - a < .02 || m < LO || m > HI || !Number.isFinite(vel) || vel < 1 || vel > 127) return false;
    save(); o.change(n, Object.assign({}, patch, { m, t0: a, t1: end, velocity: Math.round(vel), corrected: true, lockPosition: false })); return true;
  }
  function inspect() {
    inspector.replaceChildren(); error.textContent = '';
    if (!selected) { inspector.append(h('p', { class: 'muted', text: t('apr.choose') })); return; }
    const n = selected, pitch = h('select', { 'aria-label': t('apr.pitch') }); for (let m = LO; m <= HI; m++) pitch.append(h('option', { value: m, text: T.name(m), selected: m === n.m }));
    const start = h('input', { type: 'number', min: 0, max: M.dur, step: .01, value: n.t0.toFixed(3), 'aria-label': t('as.onset') }), duration = h('input', { type: 'number', min: .02, max: M.dur, step: .01, value: (n.t1 - n.t0).toFixed(3), 'aria-label': t('as.duration') }), velocity = h('input', { type: 'number', min: 1, max: 127, value: n.velocity ?? 90, 'aria-label': t('apr.velocity') });
    inspector.append(h('div', { class: 'apr-inspect-title' }, [h('b', { text: t('apr.selected') + ' · ' + T.name(n.m) }), h('small', { text: t('tr.conf') + ' ' + Math.round((n.conf || 0) * 100) + '/100' + (n.reach === false ? ' · ' + t('tr.unplay') : '') })]));
    [[pitch, 'apr.pitch'], [start, 'as.onset'], [duration, 'as.duration'], [velocity, 'apr.velocity']].forEach(([input, k]) => inspector.append(h('label', {}, [h('span', { text: t(k) }), input])));
    inspector.append(h('button', { class: 'btn small primary', text: t('as.apply'), disabled: !o.canEdit(), onclick: () => { if (commit(n, { m: +pitch.value, t0: +start.value, t1: +start.value + +duration.value, velocity: +velocity.value }) === false) error.textContent = t('apr.invalid'); } }),
      h('button', { class: 'btn small ghost', text: t('apr.delete'), disabled: !o.canEdit(), onclick: () => { save(); o.remove(n); } }), error);
  }
  const pt = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const pointers = new Map(); let pinch = null, lastTap = 0;
  cv.addEventListener('pointerdown', e => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    stage.focus({ preventScroll: true }); cv.setPointerCapture(e.pointerId);
    const p = pt(e); pointers.set(e.pointerId, p);
    if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = { d: Math.abs(a.x - b.x) || 1, px, cx: (a.x + b.x) / 2, sx, sy, cy: (a.y + b.y) / 2 }; drag = null; return; }
    const gt = gridTop(), gb = gt + gridH();
    if (p.y < gt) { if (p.x > KW) o.seek(clamp(atX(p.x), 0, M.dur)); return; }   // the ruler: go there
    if (p.x < KW && p.y < gb) { audition(atM(p.y)); return; }   // a key: hear it
    if (p.y >= gb) { const near = nearestByX(p.x); if (near && o.canEdit()) { select(near, false); drag = { kind: 'vel', n: near, orig: Object.assign({}, near) }; setVel(near, p.y); } return; }
    const hN = hit(p.x, p.y);
    if (tool === 'erase') { if (hN && o.canEdit()) { save(); o.remove(hN.n); } return; }
    if (hN) {
      select(hN.n, true); audition(hN.n.m);
      drag = { kind: hN.edge ? 'len' : 'move', n: hN.n, x: p.x, y: p.y, orig: Object.assign({}, hN.n), moved: false };
      return;
    }
    const now = performance.now(), dbl = now - lastTap < 320; lastTap = now;
    if ((tool === 'draw' || dbl) && o.canEdit()) {
      const t0 = snapped(atX(p.x)), m = atM(p.y); if (t0 >= M.dur - .02) return;
      const len = Math.max(.06, time(beat(t0) + (snap || .5)) - t0);
      drag = { kind: 'new', x: p.x, t0, m, t1: Math.min(M.dur, t0 + len) }; audition(m); paint(); return;
    }
    select(null); drag = { kind: 'pan', x: p.x, y: p.y, sx, sy, moved: false };
  });
  function nearestByX(cx) { let best = null, d = 12; M.notes.forEach(n => { const dd = Math.abs(X(n.t0) - cx); if (dd < d) { d = dd; best = n; } }); return selected && Math.abs(X(selected.t0) - cx) < 14 ? selected : best; }
  function setVel(n, cy) { const vt = gridTop() + gridH(), v = clamp(Math.round((1 - (cy - vt - 4) / (VH() - 14)) * 127), 1, 127); n.velocity = v; paint(); }
  cv.addEventListener('pointermove', e => {
    const p = pt(e);
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, p);
    if (pinch && pointers.size === 2) { const [a, b] = [...pointers.values()], d = Math.abs(a.x - b.x) || 1, cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
      const bt = (pinch.cx - KW + pinch.sx) / pinch.px; px = clamp(pinch.px * d / pinch.d, 24, 480); sx = bt * px - (cx - KW); sy = pinch.sy - (cy - pinch.cy); clampView(); paint(); return; }
    if (!drag) { const hN = hit(p.x, p.y); cv.style.cursor = p.x < KW ? 'pointer' : hN ? (tool === 'erase' ? 'not-allowed' : hN.edge ? 'ew-resize' : 'grab') : tool === 'draw' ? 'crosshair' : 'default';
      const hv = tool !== 'select' && p.x > KW && p.y > gridTop() && p.y < gridTop() + gridH() ? { t: snapped(atX(p.x)), m: atM(p.y) } : null;
      if ((hv && (!hover || hv.t !== hover.t || hv.m !== hover.m)) || (!hv && hover)) { hover = hv; paint(); } return; }
    const n = drag.n;
    if (drag.kind === 'pan') { if (Math.abs(p.x - drag.x) + Math.abs(p.y - drag.y) > 3) drag.moved = true; sx = drag.sx - (p.x - drag.x); sy = drag.sy - (p.y - drag.y); clampView(); paint(); return; }
    if (drag.kind === 'vel') { setVel(n, p.y); return; }
    if (drag.kind === 'new') { drag.t1 = Math.max(drag.t0 + .04, snapped(atX(p.x))); paint(); return; }
    if (!o.canEdit()) return;
    const dx = p.x - drag.x, dy = p.y - drag.y; if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 4) return; drag.moved = true;
    const old = drag.orig;
    if (drag.kind === 'len') n.t1 = clamp(snapped(time(beat(old.t1) + dx / px)), n.t0 + .02, M.dur);
    else { const len = old.t1 - old.t0; n.t0 = clamp(snapped(time(beat(old.t0) + dx / px)), 0, M.dur - len); n.t1 = n.t0 + len; const m = clamp(old.m - Math.round(dy / rh), LO, HI); if (m !== n.m) { n.m = m; audition(m); } }
    paint();
  });
  function end(e) {
    pointers.delete(e.pointerId); if (pointers.size < 2) pinch = null;
    const d = drag; drag = null; if (!d) { save(); return; }
    if (d.kind === 'pan') { if (!d.moved) o.seek(clamp(atX(d.x), 0, M.dur)); save(); return; }
    if (d.kind === 'new') { save(); o.add({ m: d.m, t0: d.t0, t1: Math.min(M.dur, Math.max(d.t1, d.t0 + .04)), velocity: 90, conf: 1, corrected: true }); return; }
    if (d.kind === 'vel') { const v = d.n.velocity; Object.assign(d.n, d.orig); if (v !== d.orig.velocity) commit(d.n, { velocity: v }); else paint(); return; }
    if (d.moved) { const patch = { m: d.n.m, t0: d.n.t0, t1: d.n.t1 }; Object.assign(d.n, d.orig); if (commit(d.n, patch) === false) paint(); }
  }
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', e => { if (drag && drag.orig && drag.n) Object.assign(drag.n, drag.orig); drag = null; pointers.delete(e.pointerId); pinch = null; paint(); });
  cv.addEventListener('pointerleave', () => { if (hover) { hover = null; paint(); } });
  cv.addEventListener('wheel', e => {
    e.preventDefault(); const p = pt(e);
    if (e.ctrlKey || e.metaKey) { zoomX(Math.exp(-e.deltaY * .0025), p.x); return; }
    if (e.altKey) { zoomY(Math.exp(-e.deltaY * .002), p.y); return; }
    const dx = e.shiftKey ? e.deltaY : e.deltaX, dy = e.shiftKey ? 0 : e.deltaY; sx += dx; sy += dy; clampView(); save(); paint();
  }, { passive: false });
  stage.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); if (o.canUndo()) { save(); o.undo(); } return; }
    if (!selected) return; const n = selected, d = snap || .25;
    if (e.key === 'Escape') { select(null); return; }
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); if (o.canEdit()) { save(); o.remove(n); } return; }
    const step = { ArrowUp: [0, e.shiftKey ? 12 : 1], ArrowDown: [0, e.shiftKey ? -12 : -1], ArrowLeft: [-d, 0], ArrowRight: [d, 0] }[e.key]; if (!step) return;
    e.preventDefault(); const t0 = step[0] ? snapped(time(beat(n.t0) + step[0])) : n.t0, len = n.t1 - n.t0;
    if (step[1]) audition(n.m + step[1]);
    commit(n, { m: n.m + step[1], t0, t1: t0 + len });
  });

  /* ---------- life ---------- */
  const ro = window.ResizeObserver ? new ResizeObserver(() => resize()) : null; if (ro) ro.observe(stage); else addEventListener('resize', resize);
  // every edit draws the roll anew: the keyboard stays with it, so the next arrow or ⌘Z still reaches it
  stage.addEventListener('focus', () => { state.focus = true; });
  stage.addEventListener('blur', () => { if (stage.isConnected && !dead) state.focus = false; });
  requestAnimationFrame(() => { if (dead) return; resize(); if (state.focus) stage.focus({ preventScroll: true }); const n = M.notes.find(x => x.id === state.selected); if (n) select(n, false); else inspect(); });
  let lastKey = '';
  function tick(p) {
    playPos = p; const act = M.notes.filter(n => n.t0 <= p && n.t1 > p), k = act.map(n => n.id).join(); if (k !== lastKey) { lastKey = k; active = new Set(act); }
    if (follow && !drag && o.playing && o.playing()) { const at = KW + beat(p) * px - sx; if (at > W - 60 || at < KW) { sx = clamp(beat(p) * px - 80, 0, maxX()); } }
    paint();
  }
  /** where a note is on the screen (client px) — scrolled into view first; for the tests, which cannot see into a canvas */
  el.noteRect = id => { const n = M.notes.find(x => x.id === id); if (!n) return null; stage.scrollIntoView({ block: 'center', behavior: 'instant' }); if (!W) resize(); sx = clamp(beat(n.t0) * px - 60, 0, maxX()); sy = clamp((HI - n.m) * rh - gridH() / 2, 0, maxY()); paint(true);
    const r = cv.getBoundingClientRect(), x = X(n.t0), w = Math.max(5, X(n.t1) - x), y = Ytop(n.m); return { x: r.left + x, y: r.top + y, width: w, height: rh }; };
  inspect();
  return { el, tick, draw() { tick(o.pos()); }, stop() { dead = true; cancelAnimationFrame(raf); if (ro) ro.disconnect(); if (drag && drag.orig && drag.n) Object.assign(drag.n, drag.orig); save(); } };
};
