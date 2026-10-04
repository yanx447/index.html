/* =====================================================================
   Drawing for the theory lessons: staff, clefs, notes, rests, keyboard.
   Everything is plain SVG (no music font), so it looks the same on every
   phone, computer and TV, also offline.
   Staff coordinates: line spacing 10, bottom line (E4 in the treble clef) = step 0,
   every step = one line or space (5 px).
   ===================================================================== */
PD.notesArt = (() => {
  const INK = '#F4E6D2', DIM = 'rgba(244,230,210,.55)', ACC = '#F6C987';
  const LET = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  /** diatonic step of a written note relative to E4 (bottom line of the treble staff) */
  const step = (l, o) => (o * 7 + LET.indexOf(l)) - (4 * 7 + 2);
  const TREBLE = 'M19 31c-5 0-6-6-1-7 7-1 10 7 6 12-4 5-14 4-17-3-3-7 2-14 9-18 5-3 9-8 9-14 0-8-4-13-7-13-4 0-6 7-5 14l7 49c1 6-2 10-7 9-4-1-5-6-1-8';
  const BASS = 'M8 14c0-7 6-11 12-10 7 1 10 7 9 13-1 10-11 18-22 23M8 14a3.5 3.5 0 1 0 0 .1M35 9a2 2 0 1 0 0 .1M35 19a2 2 0 1 0 0 .1';
  /** staff with a clef and notes. notes: [{l:'A', o:3, acc:'♯'|'♭'|'♮', d:'w'|'h'|'q'|'e'|'s', dot, label, col}] */
  function staff(notes, opt) {
    opt = opt || {};
    const clef = opt.clef || 'treble', gap = opt.gap || 42, x0 = 54, W = opt.width || Math.max(260, x0 + 20 + notes.length * gap), top = 34, H = opt.height || 132;
    const yb = top + 40, y = st => yb - st * 5;
    let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="tb-svg" role="img" aria-label="' + PD.esc(opt.label || 'staff') + '">';
    for (let i = 0; i < 5; i++) s += '<line x1="6" x2="' + (W - 6) + '" y1="' + (top + i * 10) + '" y2="' + (top + i * 10) + '" stroke="' + DIM + '" stroke-width="1.2"/>';
    if (opt.bars) opt.bars.forEach(bx => { s += '<line x1="' + bx + '" x2="' + bx + '" y1="' + top + '" y2="' + yb + '" stroke="' + DIM + '" stroke-width="1.4"/>'; });
    if (opt.end) s += '<line x1="' + (W - 12) + '" x2="' + (W - 12) + '" y1="' + top + '" y2="' + yb + '" stroke="' + DIM + '" stroke-width="1.2"/><line x1="' + (W - 7) + '" x2="' + (W - 7) + '" y1="' + top + '" y2="' + yb + '" stroke="' + INK + '" stroke-width="3.5"/>';
    if (clef === 'treble') s += '<path d="' + TREBLE + '" transform="translate(6 ' + top + ')" fill="none" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>';
    if (clef === 'bass') s += '<path d="' + BASS + '" transform="translate(6 ' + (top - 1) + ')" fill="none" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>';
    if (opt.time) s += '<text x="' + (x0 - 8) + '" y="' + (top + 18) + '" fill="' + INK + '" font-size="21" font-weight="800" text-anchor="middle" font-family="Georgia,serif">' + opt.time[0] + '</text><text x="' + (x0 - 8) + '" y="' + (top + 38) + '" fill="' + INK + '" font-size="21" font-weight="800" text-anchor="middle" font-family="Georgia,serif">' + opt.time[1] + '</text>';
    const xs = opt.time ? x0 + 20 : x0;
    notes.forEach((n, i) => {
      const x = n.x != null ? n.x : xs + i * gap + gap / 2, st = n.rest ? null : (clef === 'bass' ? step(n.l, n.o) + 12 : step(n.l, n.o)), col = n.col || INK;
      if (n.rest) { s += rest(n.rest, x, top, col); if (n.label) s += label(n.label, x, H); return; }
      // ledger lines
      for (let k = -2; k >= st; k -= 2) s += '<line x1="' + (x - 11) + '" x2="' + (x + 11) + '" y1="' + y(k) + '" y2="' + y(k) + '" stroke="' + INK + '" stroke-width="1.3"/>';
      for (let k = 10; k <= st; k += 2) s += '<line x1="' + (x - 11) + '" x2="' + (x + 11) + '" y1="' + y(k) + '" y2="' + y(k) + '" stroke="' + INK + '" stroke-width="1.3"/>';
      s += note(n.d || 'q', x, y(st), st >= 4 ? 'down' : 'up', col, n.dot);
      if (n.acc) s += '<text x="' + (x - 15) + '" y="' + (y(st) + 5) + '" fill="' + col + '" font-size="17" text-anchor="middle" font-family="Georgia,serif">' + n.acc + '</text>';
      if (n.label) s += label(n.label, x, H, n.col);
    });
    return s + '</svg>';
  }
  function label(t, x, H, col) { return '<text x="' + x + '" y="' + (H - 6) + '" fill="' + (col || ACC) + '" font-size="12" font-weight="700" text-anchor="middle" font-family="Noto Sans Georgian,system-ui">' + PD.esc(t) + '</text>'; }
  /** one note: w whole · h half · q quarter · e eighth · s sixteenth */
  function note(d, x, y, dir, col, dot) {
    const open = d === 'w' || d === 'h';
    let s = '<ellipse cx="' + x + '" cy="' + y + '" rx="6.3" ry="4.5" transform="rotate(-20 ' + x + ' ' + y + ')" fill="' + (open ? 'none' : col) + '" stroke="' + col + '" stroke-width="' + (open ? 2 : 1) + '"/>';
    if (d !== 'w') {
      const sx = dir === 'up' ? x + 5.6 : x - 5.6, y2 = dir === 'up' ? y - 32 : y + 32;
      s += '<line x1="' + sx + '" x2="' + sx + '" y1="' + y + '" y2="' + y2 + '" stroke="' + col + '" stroke-width="1.6"/>';
      const flags = d === 'e' ? 1 : d === 's' ? 2 : 0;
      for (let k = 0; k < flags; k++) { const fy = y2 + (dir === 'up' ? k * 8 : -k * 8); s += dir === 'up' ? '<path d="M' + sx + ' ' + fy + 'c1 6 10 8 9 17-.2 1-.8 1-1 0-1-6-5-8-8-9z" fill="' + col + '"/>' : '<path d="M' + sx + ' ' + fy + 'c1-6 10-8 9-17-.2-1-.8-1-1 0-1 6-5 8-8 9z" fill="' + col + '"/>'; }
    }
    if (dot) s += '<circle cx="' + (x + 11) + '" cy="' + (y - 2) + '" r="2.2" fill="' + col + '"/>';
    return s;
  }
  /** rests (top = y of the top staff line) */
  function rest(d, x, top, col) {
    col = col || INK;
    if (d === 'w') return '<rect x="' + (x - 7) + '" y="' + (top + 10) + '" width="14" height="5" fill="' + col + '"/>';
    if (d === 'h') return '<rect x="' + (x - 7) + '" y="' + (top + 15) + '" width="14" height="5" fill="' + col + '"/>';
    if (d === 'q') return '<path d="M' + (x - 3) + ' ' + (top + 6) + 'l6 8-5 6 6 8c-6-3-10 1-6 7-8-5-4-12 1-10l-6-7 5-6z" fill="' + col + '"/>';
    const one = (yy, len) => '<circle cx="' + (x - 3) + '" cy="' + yy + '" r="2.6" fill="' + col + '"/><path d="M' + (x - 3) + ' ' + (yy + 1.5) + 'q4 1 7-3l-5 ' + len + '" fill="none" stroke="' + col + '" stroke-width="1.8" stroke-linecap="round"/>';
    if (d === 'e') return one(top + 16, 16);
    if (d === 's') return one(top + 13, 22) + '<circle cx="' + (x - 5) + '" cy="' + (top + 22) + '" r="2.6" fill="' + col + '"/><path d="M' + (x - 5) + ' ' + (top + 23.5) + 'q4 1 7-3" fill="none" stroke="' + col + '" stroke-width="1.8"/>';
    return '';
  }
  /** a small standalone symbol (for tables): a note or a rest on a short staff piece */
  function symbol(kind, d, dot) {
    let s = '<svg viewBox="0 0 54 70" class="tb-sym" aria-hidden="true">';
    for (let i = 0; i < 5; i++) s += '<line x1="2" x2="52" y1="' + (12 + i * 10) + '" y2="' + (12 + i * 10) + '" stroke="rgba(244,230,210,.22)" stroke-width="1"/>';
    s += kind === 'rest' ? rest(d, 27, 12) : note(d, 24, 37, 'up', INK, dot);
    return s + '</svg>';
  }
  /** one octave of a keyboard, white keys labelled (both naming systems), black keys with ♯/♭ */
  function keyboard(opt) {
    opt = opt || {};
    const W = 7 * 44 + 4, H = 150, wk = ['C', 'D', 'E', 'F', 'G', 'A', 'B'], ka = ['დო', 'რე', 'მი', 'ფა', 'სოლ', 'ლა', 'სი'], hi = opt.hi || [];
    let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="tb-svg" role="img" aria-label="keyboard">';
    wk.forEach((n, i) => { const on = hi.includes(n); s += '<rect x="' + (2 + i * 44) + '" y="2" width="42" height="140" rx="5" fill="' + (on ? '#F6C987' : '#F8EEDF') + '" stroke="#2A1A0E"/><text x="' + (23 + i * 44) + '" y="118" font-size="15" font-weight="800" text-anchor="middle" fill="#24140A">' + n + '</text><text x="' + (23 + i * 44) + '" y="134" font-size="11" text-anchor="middle" fill="#5A4030" font-family="Noto Sans Georgian,system-ui">' + ka[i] + '</text>'; });
    [[0, 'C♯', 'D♭'], [1, 'D♯', 'E♭'], [3, 'F♯', 'G♭'], [4, 'G♯', 'A♭'], [5, 'A♯', 'B♭']].forEach(([i, a, b]) => { const on = hi.includes(a) || hi.includes(b); s += '<rect x="' + (32 + i * 44) + '" y="2" width="26" height="86" rx="4" fill="' + (on ? '#E9A55A' : '#1B120B') + '"/><text x="' + (45 + i * 44) + '" y="62" font-size="9.5" font-weight="700" text-anchor="middle" fill="' + (on ? '#24140A' : '#F4E6D2') + '">' + a + '</text><text x="' + (45 + i * 44) + '" y="76" font-size="9.5" font-weight="700" text-anchor="middle" fill="' + (on ? '#24140A' : '#F4E6D2') + '">' + b + '</text>'; });
    return s + '</svg>';
  }
  return { staff, note, rest, symbol, keyboard, step };
})();
