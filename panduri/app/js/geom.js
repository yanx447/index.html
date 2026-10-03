/* =====================================================================
   Shared instrument geometry in millimetres, derived only from the
   approved instrument profile (PD.instrument). Used by the 2D stage.
   u = distance along the strings from the nut (toward the bridge)
   v = distance across the neck, centre line = 0; in player view
       string 3 (E) is at negative v (top of the screen), string 1 (A) positive.
   ===================================================================== */
PD.geom = (() => {
  function mono(pts) {
    const n = pts.length, xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), d = [], m = [];
    for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
    m[0] = d[0]; m[n - 1] = d[n - 2]; for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    return t => { if (t <= xs[0]) return ys[0]; if (t >= xs[n - 1]) return ys[n - 1]; let i = 0; while (t > xs[i + 1]) i++; const h = xs[i + 1] - xs[i], s = (t - xs[i]) / h, s2 = s * s, s3 = s2 * s; return (2 * s3 - 3 * s2 + 1) * ys[i] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * ys[i + 1] + (s3 - s2) * h * m[i + 1]; };
  }
  let G = null;
  function build() {
    const p = PD.instrument.profile, L = p.scaleLength.mm, J = p.neckJoin.mm, FE = p.fingerboardEnd.mm, B = p.body.lengthMm;
    const HW = mono(p.body.outline), SN = p.stringSpacing.nutMm, SB = p.stringSpacing.bridgeMm;
    const fb = p.fingerboard || { nutHalfMm: 15, joinHalfMm: 18 }, hs = p.headstock || {};
    const hole = { u: J + p.soundHole.fromBodyTopMm, r: p.soundHole.diameterMm / 2, rw: p.soundHole.rosetteWidthMm || 3, ring: p.soundHole.ring };
    G = {
      L, J, FE, B, bodyEnd: J + B, bridgeU: L, bridgeW: (p.bridge && p.bridge.widthMm) || 54, hole,
      head: { len: hs.lengthMm || 136, half: (hs.widthMm || 34) / 2, slot: hs.slotMm || [16, 108], slotHalf: (hs.slotWidthMm || 13) / 2, posts: hs.postsMm || { 1: 46, 2: 94, 3: 70 }, side: hs.postSide || { 1: 'A', 2: 'A', 3: 'E' } },
      bodyHalf: u => HW(Math.max(0, Math.min(1, (u - J) / B))),
      fbHalf: u => u <= J ? fb.nutHalfMm + (fb.joinHalfMm - fb.nutHalfMm) * Math.max(0, u) / J : Math.sqrt(Math.max(0, fb.joinHalfMm * fb.joinHalfMm - Math.pow(u - (FE - fb.joinHalfMm), 2))),
      spacing: u => SN + (SB - SN) * u / L,
      stringV: (s, u) => (2 - s) * (SN + (SB - SN) * u / L) / 2,
      fretMm: n => PD.instrument.fretMm(n),
      /** where a fingertip stops a string for fret n: just behind the fret wire (musically correct, not mid-cell) */
      contactU: n => { if (n <= 0) return -6; const a = PD.instrument.fretMm(n - 1), b = PD.instrument.fretMm(n); return b - Math.min(5.5, (b - a) * .3); },
      /** right-hand striking zone: between the end of the fingerboard and the sound hole */
      strumU: (FE + hole.u - hole.r) / 2,
      markers: p.markers
    };
    return G;
  }
  PD.bus.on('instrument', () => { G = null; });
  return { get g() { return G || build(); }, mono };
})();
