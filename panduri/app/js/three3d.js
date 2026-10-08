/* =====================================================================
   3D instrument (plain WebGL, no external library): the learner's own
   panduri built from measured proportions. PBR-style shading (wood,
   clear-coated back, metal, nylon), baked ambient occlusion,
   real sound-hole openings with depth, contact shadow, vibrating
   strings that start from the fretted point, 
   10 camera presets, clickable parts and a guided tour.
   One WebGL context; its canvas is moved between screens.
   Coordinates (mm): nut at y = 0, headstock +y, soundboard faces +z,
   string 1 (A) at -x, string 3 (E) at +x (front view).
   ===================================================================== */
PD.i18n.add({
  'x3p.body': ['ტანი', 'Body'], 'x3p.top': ['დეკა', 'Soundboard'], 'x3p.neck': ['ტარი', 'Neck'], 'x3p.fret': ['ლადი', 'Fret'], 'x3p.string': ['სიმი', 'String'],
  'x3p.nut': ['ნულოვანი ლადი', 'Nut'], 'x3p.bridge': ['ხიდი', 'Bridge'], 'x3p.hole': ['სახმო ხვრელი', 'Sound hole'], 'x3p.head': ['თავი', 'Headstock'], 'x3p.tuners': ['მექანიკა', 'Tuners'],
  'pi.body': ['ამოთლილი, ღრმა ზურგი — მუქი, პრიალა. ჰაერი შიგნით ჟღერადობას აძლიერებს.', 'A deep carved back with a dark gloss finish. The air inside amplifies the sound.'],
  'pi.top': ['ღია ფერის დეკა — სწორი, ვერტიკალური ბოჭკოთი. სიმების რხევა ხიდიდან დეკაზე გადადის და ის ჟღერს.', 'The pale soundboard, with straight vertical grain. String vibration passes through the bridge into it and it radiates the sound.'],
  'pi.neck': ['გრძელი, ვიწრო ტარი წითელ-ყავისფერი ლადფიცრით და ყვითელი მარკერებით 3·5·7·9·12·15 ლადებზე.', 'A long narrow neck with a red-brown fingerboard and yellow markers at frets 3·5·7·9·12·15.'],
  'pi.fret': ['17 ლადი. ყოველი ლადი სიმს ნახევარტონით ამაღლებს; მე-12 ლადი სიმის ზუსტად შუაშია.', '17 frets. Each fret raises the string by one semitone; fret 12 is exactly half the string length.'],
  'pi.string': ['სამი ნეილონის სიმი: A · C♯ · E. სიმი ჟღერს დაჭერილი ლადიდან ხიდამდე.', 'Three nylon strings: A · C♯ · E. A string sounds from the pressed fret to the bridge.'],
  'pi.nut': ['მუქი ზღურბლი — აქ იწყება სიმის ჟღერადი ნაწილი, როცა სიმი ღიაა.', 'The dark nut — the sounding part of an open string starts here.'],
  'pi.bridge': ['ღია ფერის ხიდი მუქ საფუძველზე: სიმების რხევას დეკაზე გადასცემს.', 'A light bridge on a dark base: it passes string vibration to the soundboard.'],
  'pi.hole': ['დიდი მრგვალი ხვრელი მუქი რგოლით და 26 პატარა ხვრელის წრე.', 'A large round hole with a dark ring, surrounded by a circle of 26 small holes.'],
  'pi.head': ['ღია თავი, ზემოთ უკან მოხრილი. სამი სიმი სამ ღერძზეა დახვეული.', 'An open, slotted headstock hooked backward at the top. Three strings wind on three posts.'],
  'pi.tuners': ['სამი კბილანიანი მექანიკა, 2 + 1: C♯ და A ერთ მხარეს, E — მეორეზე.', 'Three geared tuners, 2 + 1: C♯ and A on one side, E on the other.'],
  'v.front': ['წინიდან', 'Front'], 'v.player': ['მოთამაშის', 'Player'], 'v.fretboard': ['ტარი', 'Fretboard'], 'v.right': ['მარჯვენა ხელი', 'Right hand'], 'v.left': ['მარცხენა ხელი', 'Left hand'],
  'v.head': ['თავი', 'Headstock'], 'v.sound': ['ხიდი · ხვრელი', 'Bridge · hole'], 'v.side': ['გვერდიდან', 'Side'], 'v.back': ['უკნიდან', 'Back'], 'v.teacher': ['მასწავლებელი', 'Teacher'], 'v.full': ['მთლიანი', 'Full instrument'], 'v.free': ['თავისუფალი', 'Free orbit'],
  'r3.nogl': ['ეს მოწყობილობა 3D-ს ვერ აჩვენებს (WebGL მიუწვდომელია). 2D ხედი მუშაობს.', 'This device cannot show 3D (WebGL unavailable). The 2D view works.'],
  'r3.lost': ['3D დაიკარგა (გრაფიკული კონტექსტი). გადატვირთე გვერდი.', '3D was lost (graphics context). Reload the page.']
});

PD._R3D = (() => {
  const TH = PD.theory, IP = PD.instrument.profile;
  /* all dimensions come from the approved instrument profile (mm) */
  const L = IP.scaleLength.mm, BT = -IP.neckJoin.mm, B = IP.body.lengthMm, BOT = BT - B, BR = -L, TONGUE = -IP.fingerboardEnd.mm, SH_Y = BT - IP.soundHole.fromBodyTopMm;
  const NF = IP.frets.count, HR = IP.soundHole.diameterMm / 2, RW = IP.soundHole.rosetteWidthMm || 3, RING = IP.soundHole.ring;
  const fy = n => -L * TH.fretFrac(n);
  const SCOL = ['', '#D9783F', '#78B7DE', '#EFE0B8'];
  const SNs = IP.stringSpacing.nutMm / 2, SBs = IP.stringSpacing.bridgeMm / 2, SX_NUT = [0, -SNs, 0, SNs], SX_BR = [0, -SBs, 0, SBs], SZ_NUT = 7.6, SZ_BR = 9.6, SRAD = [0, .58, .5, .42];
  const sxAt = (s, y) => SX_NUT[s] + (SX_BR[s] - SX_NUT[s]) * (y / BR), szAt = y => SZ_NUT + (SZ_BR - SZ_NUT) * (y / BR);
  function mono(pts) {
    const n = pts.length, xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), d = [], m = [];
    for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
    m[0] = d[0]; m[n - 1] = d[n - 2]; for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    return t => { if (t <= xs[0]) return ys[0]; if (t >= xs[n - 1]) return ys[n - 1]; let i = 0; while (t > xs[i + 1]) i++; const h = xs[i + 1] - xs[i], s = (t - xs[i]) / h, s2 = s * s, s3 = s2 * s; return (2 * s3 - 3 * s2 + 1) * ys[i] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * ys[i + 1] + (s3 - s2) * h * m[i + 1]; };
  }
  // measured body outline (half width) from the neck joint (t = 0) to the flat bottom (t = 1); slight asymmetry like the real instrument
  const HW = mono(IP.body.outline);
  const ASYM = t => 1 + .012 * Math.sin(t * 5.2);
  const DEP = mono(IP.body.depth);
  const fbHalf = y => y >= BT ? 15 + 3 * (y / BT) : (y >= TONGUE + 18 ? 18 : Math.sqrt(Math.max(0, 324 - (TONGUE + 18 - y) ** 2)));
  const HOLES = [[0, SH_Y, HR]]; for (let k = 0; k < RING.smallHoles; k++) { const a = k / RING.smallHoles * Math.PI * 2 + Math.PI / RING.smallHoles; HOLES.push([Math.cos(a) * RING.ringRadiusMm, SH_Y + Math.sin(a) * RING.ringRadiusMm, RING.holeDiameterMm / 2]); }

  /* ---------- math ---------- */
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const len = a => Math.hypot(a[0], a[1], a[2]), norm = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const M4 = {
    persp(f, a, n, fa) { const t = 1 / Math.tan(f / 2), r = new Float32Array(16); r[0] = t / a; r[5] = t; r[10] = (fa + n) / (n - fa); r[11] = -1; r[14] = 2 * fa * n / (n - fa); return r; },
    look(e, c, u) { const z = norm(sub(e, c)), x = norm(cross(u, z)), y = cross(z, x); return new Float32Array([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, e), -dot(y, e), -dot(z, e), 1]); },
    mul(a, b) { const r = new Float32Array(16); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k]; r[i * 4 + j] = s; } return r; },
    model(rx, rz, ty) { const cx = Math.cos(rx), sx = Math.sin(rx), cz = Math.cos(rz), sz = Math.sin(rz); const R = [cz, cx * sz, sx * sz, -sz, cx * cz, sx * cz, 0, -sx, cx]; return new Float32Array([R[0], R[1], R[2], 0, R[3], R[4], R[5], 0, R[6], R[7], R[8], 0, R[3] * ty, R[4] * ty, R[5] * ty, 1]); },
    xf(m, p) { const x = p[0], y = p[1], z = p[2], w = m[3] * x + m[7] * y + m[11] * z + m[15]; return [(m[0] * x + m[4] * y + m[8] * z + m[12]) / w, (m[1] * x + m[5] * y + m[9] * z + m[13]) / w, (m[2] * x + m[6] * y + m[10] * z + m[14]) / w]; },
    /** rotation from local +y to dir, then translation to p */
    bone(p, dir, up) { const y = norm(dir); let x = cross(y, up || [0, 0, 1]); if (len(x) < 1e-4) x = cross(y, [1, 0, 0]); x = norm(x); const z = cross(x, y); return new Float32Array([x[0], x[1], x[2], 0, y[0], y[1], y[2], 0, z[0], z[1], z[2], 0, p[0], p[1], p[2], 1]); },
    invert(a) {
      const inv = new Float32Array(16);
      inv[0] = a[5] * a[10] * a[15] - a[5] * a[11] * a[14] - a[9] * a[6] * a[15] + a[9] * a[7] * a[14] + a[13] * a[6] * a[11] - a[13] * a[7] * a[10];
      inv[4] = -a[4] * a[10] * a[15] + a[4] * a[11] * a[14] + a[8] * a[6] * a[15] - a[8] * a[7] * a[14] - a[12] * a[6] * a[11] + a[12] * a[7] * a[10];
      inv[8] = a[4] * a[9] * a[15] - a[4] * a[11] * a[13] - a[8] * a[5] * a[15] + a[8] * a[7] * a[13] + a[12] * a[5] * a[11] - a[12] * a[7] * a[9];
      inv[12] = -a[4] * a[9] * a[14] + a[4] * a[10] * a[13] + a[8] * a[5] * a[14] - a[8] * a[6] * a[13] - a[12] * a[5] * a[10] + a[12] * a[6] * a[9];
      inv[1] = -a[1] * a[10] * a[15] + a[1] * a[11] * a[14] + a[9] * a[2] * a[15] - a[9] * a[3] * a[14] - a[13] * a[2] * a[11] + a[13] * a[3] * a[10];
      inv[5] = a[0] * a[10] * a[15] - a[0] * a[11] * a[14] - a[8] * a[2] * a[15] + a[8] * a[3] * a[14] + a[12] * a[2] * a[11] - a[12] * a[3] * a[10];
      inv[9] = -a[0] * a[9] * a[15] + a[0] * a[11] * a[13] + a[8] * a[1] * a[15] - a[8] * a[3] * a[13] - a[12] * a[1] * a[11] + a[12] * a[3] * a[9];
      inv[13] = a[0] * a[9] * a[14] - a[0] * a[10] * a[13] - a[8] * a[1] * a[14] + a[8] * a[2] * a[13] + a[12] * a[1] * a[10] - a[12] * a[2] * a[9];
      inv[2] = a[1] * a[6] * a[15] - a[1] * a[7] * a[14] - a[5] * a[2] * a[15] + a[5] * a[3] * a[14] + a[13] * a[2] * a[7] - a[13] * a[3] * a[6];
      inv[6] = -a[0] * a[6] * a[15] + a[0] * a[7] * a[14] + a[4] * a[2] * a[15] - a[4] * a[3] * a[14] - a[12] * a[2] * a[7] + a[12] * a[3] * a[6];
      inv[10] = a[0] * a[5] * a[15] - a[0] * a[7] * a[13] - a[4] * a[1] * a[15] + a[4] * a[3] * a[13] + a[12] * a[1] * a[7] - a[12] * a[3] * a[5];
      inv[14] = -a[0] * a[5] * a[14] + a[0] * a[6] * a[13] + a[4] * a[1] * a[14] - a[4] * a[2] * a[13] - a[12] * a[1] * a[6] + a[12] * a[2] * a[5];
      inv[3] = -a[1] * a[6] * a[11] + a[1] * a[7] * a[10] + a[5] * a[2] * a[11] - a[5] * a[3] * a[10] - a[9] * a[2] * a[7] + a[9] * a[3] * a[6];
      inv[7] = a[0] * a[6] * a[11] - a[0] * a[7] * a[10] - a[4] * a[2] * a[11] + a[4] * a[3] * a[10] + a[8] * a[2] * a[7] - a[8] * a[3] * a[6];
      inv[11] = -a[0] * a[5] * a[11] + a[0] * a[7] * a[9] + a[4] * a[1] * a[11] - a[4] * a[3] * a[9] - a[8] * a[1] * a[7] + a[8] * a[3] * a[5];
      inv[15] = a[0] * a[5] * a[10] - a[0] * a[6] * a[9] - a[4] * a[1] * a[10] + a[4] * a[2] * a[9] + a[8] * a[1] * a[6] - a[8] * a[2] * a[5];
      let det = a[0] * inv[0] + a[1] * inv[4] + a[2] * inv[8] + a[3] * inv[12]; det = 1 / det; for (let i = 0; i < 16; i++) inv[i] *= det; return inv;
    }
  };

  /* ---------- geometry builders ---------- */
  const meshes = [];
  let curPart = 'body';
  function normals(p, idx) {
    const n = new Float32Array(p.length);
    for (let i = 0; i < idx.length; i += 3) { const a = idx[i] * 3, b = idx[i + 1] * 3, c = idx[i + 2] * 3; const f = cross([p[b] - p[a], p[b + 1] - p[a + 1], p[b + 2] - p[a + 2]], [p[c] - p[a], p[c + 1] - p[a + 1], p[c + 2] - p[a + 2]]); for (const k of [a, b, c]) { n[k] += f[0]; n[k + 1] += f[1]; n[k + 2] += f[2]; } }
    for (let i = 0; i < n.length; i += 3) { const v = norm([n[i], n[i + 1], n[i + 2]]); n[i] = v[0]; n[i + 1] = v[1]; n[i + 2] = v[2]; }
    return n;
  }
  function mesh(pos, idx, uv, mat, ao) {
    const m = { pos: new Float32Array(pos), nrm: normals(pos, idx), uv: new Float32Array(uv || new Array(pos.length / 3 * 2).fill(0)), idx: new Uint32Array(idx), mat, part: curPart, local: null, visible: true };
    m.ao = new Float32Array(pos.length / 3); for (let i = 0; i < m.ao.length; i++) m.ao[i] = ao ? ao(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]) : 1;
    meshes.push(m); return m;
  }
  function grid(nu, nv, fn, uvfn, mat, ao) {
    const pos = [], uv = [], idx = [];
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) { const u = i / nu, v = j / nv; pos.push(...fn(u, v)); uv.push(...(uvfn ? uvfn(u, v) : [u, v])); }
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) { const a = j * (nu + 1) + i, b = a + nu + 1; idx.push(a, b, a + 1, a + 1, b, b + 1); }
    return mesh(pos, idx, uv, mat, ao);
  }
  function box(cx, cy, cz, w, h, d, mat) {
    const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2, z0 = cz - d / 2, z1 = cz + d / 2, pos = [], idx = [];
    const F = [[[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]], [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]], [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]], [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]]];
    F.forEach((f, k) => { f.forEach(p => pos.push(...p)); const o = k * 4; idx.push(o, o + 1, o + 2, o, o + 2, o + 3); });
    return mesh(pos, idx, null, mat);
  }
  function cyl(c, axis, r, h, seg, mat, r2, open) {
    r2 = r2 == null ? r : r2; const pos = [], idx = [];
    const P = (a, t, rr) => { const u = Math.cos(a) * rr, v = Math.sin(a) * rr, w = (t - .5) * h; return axis === 'x' ? [c[0] + w, c[1] + u, c[2] + v] : axis === 'y' ? [c[0] + u, c[1] + w, c[2] + v] : [c[0] + u, c[1] + v, c[2] + w]; };
    for (let i = 0; i <= seg; i++) { const a = i / seg * Math.PI * 2; pos.push(...P(a, 0, r), ...P(a, 1, r2)); }
    for (let i = 0; i < seg; i++) { const o = i * 2; idx.push(o, o + 2, o + 1, o + 1, o + 2, o + 3); }
    if (!open) { const c0 = pos.length / 3; pos.push(...P(0, 0, 0)); const c1 = pos.length / 3; pos.push(...P(0, 1, 0)); for (let i = 0; i < seg; i++) idx.push(c0, i * 2 + 2, i * 2, c1, i * 2 + 1, i * 2 + 3); }
    return mesh(pos, idx, null, mat);
  }
  function sphere(c, r, sc, mat, nu, nv) { return grid(nu || 20, nv || 12, (u, v) => { const a = u * Math.PI * 2, b = v * Math.PI; return [c[0] + Math.cos(a) * Math.sin(b) * r * sc[0], c[1] + Math.cos(b) * r * sc[1], c[2] + Math.sin(a) * Math.sin(b) * r * sc[2]]; }, null, mat); }
  function disc(c, r, mat) { const pos = [c[0], c[1], c[2]], idx = [], N = 32; for (let i = 0; i <= N; i++) { const a = i / N * Math.PI * 2; pos.push(c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r, c[2]); if (i) idx.push(0, i, i + 1); } return mesh(pos, idx, null, mat); }
  function ring(c, r0, r1, mat) { return grid(72, 1, (u, v) => { const a = u * Math.PI * 2, r = r0 + (r1 - r0) * v; return [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r, c[2]]; }, null, mat); }
  /** a capsule along +y from 0 to len, radius r0 at the base and r1 at the tip */
  function capsule(lenY, r0, r1, mat) {
    return grid(14, 18, (u, v) => {
      const a = u * Math.PI * 2; let y, r;
      if (v < .2) { const q = v / .2, ang = -Math.PI / 2 + q * Math.PI / 2; y = Math.sin(ang) * r0; r = Math.cos(ang) * r0; }
      else if (v > .8) { const q = (v - .8) / .2, ang = q * Math.PI / 2; y = lenY + Math.sin(ang) * r1; r = Math.cos(ang) * r1; }
      else { const q = (v - .2) / .6; y = q * lenY; r = r0 + (r1 - r0) * q; }
      return [Math.cos(a) * r, y, Math.sin(a) * r];
    }, null, mat);
  }
  function earclip(P) {
    const n = P.length, V = [...Array(n).keys()], out = []; let area = 0; for (let i = 0; i < n; i++) { const a = P[i], b = P[(i + 1) % n]; area += a[0] * b[1] - b[0] * a[1]; } if (area < 0) V.reverse();
    const inside = (p, a, b, c) => { const d = (u, v, w) => (u[0] - w[0]) * (v[1] - w[1]) - (v[0] - w[0]) * (u[1] - w[1]); const d1 = d(p, a, b), d2 = d(p, b, c), d3 = d(p, c, a); return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0)); };
    let guard = 0; while (V.length > 3 && guard++ < 5000) { let cut = false; for (let i = 0; i < V.length; i++) { const ia = V[(i + V.length - 1) % V.length], ib = V[i], ic = V[(i + 1) % V.length], a = P[ia], b = P[ib], c = P[ic]; if ((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) <= 0) continue; let ok = true; for (const j of V) { if (j === ia || j === ib || j === ic) continue; if (inside(P[j], a, b, c)) { ok = false; break; } } if (ok) { out.push(ia, ib, ic); V.splice(i, 1); cut = true; break; } } if (!cut) break; }
    if (V.length === 3) out.push(V[0], V[1], V[2]); return out;
  }
  function extrude(P, e0, e1, map, mat) {
    const n = P.length, tri = earclip(P), pos = [], idx = [];
    P.forEach(p => pos.push(...map(p[0], p[1], e1))); P.forEach(p => pos.push(...map(p[0], p[1], e0)));
    for (let i = 0; i < tri.length; i += 3) idx.push(tri[i], tri[i + 1], tri[i + 2], n + tri[i], n + tri[i + 2], n + tri[i + 1]);
    const s0 = pos.length / 3;
    for (let i = 0; i < n; i++) { const a = P[i], b = P[(i + 1) % n]; pos.push(...map(a[0], a[1], e1), ...map(b[0], b[1], e1), ...map(b[0], b[1], e0), ...map(a[0], a[1], e0)); const o = s0 + i * 4; idx.push(o, o + 2, o + 1, o, o + 3, o + 2); }
    return mesh(pos, idx, null, mat);
  }

  /* ---------- procedural textures (wood grain follows each piece) ---------- */
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const tex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return c; };
  const TEX = {
    spruce: tex(512, 1024, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#DFC08D'); gr.addColorStop(.5, '#EED7AA'); gr.addColorStop(1, '#DDBD8A'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 260; i++) { const x = rnd() * w; g.strokeStyle = 'rgba(150,104,52,' + (.05 + rnd() * .17) + ')'; g.lineWidth = .6 + rnd() * 1.5; g.beginPath(); g.moveTo(x, 0); for (let y = 0; y <= h; y += 64) g.lineTo(x + Math.sin(y * .004 + i) * 1.2, y); g.stroke(); }
      // play wear above the rosette (strumming zone) and a worn patch at the upper right of the ring, as on the real top
      for (let i = 0; i < 70; i++) { g.strokeStyle = 'rgba(70,50,30,' + (.05 + rnd() * .16) + ')'; g.lineWidth = 1; const x = w * (.36 + rnd() * .32), y0 = h * (.84 + rnd() * .06); g.beginPath(); g.moveTo(x, y0); g.lineTo(x + rnd() * 2, y0 + 12 + rnd() * 60); g.stroke(); }
      g.fillStyle = 'rgba(246,236,214,.55)'; g.beginPath(); for (let k = 0; k < 18; k++) { const a = k / 18 * Math.PI * 2, r = 22 + rnd() * 14; const x = w * .66 + Math.cos(a) * r, y = h * .82 + Math.sin(a) * r * 1.3; k ? g.lineTo(x, y) : g.moveTo(x, y); } g.fill();
    }),
    oak: tex(256, 1024, (g, w, h) => { g.fillStyle = '#C69C66'; g.fillRect(0, 0, w, h); for (let i = 0; i < 130; i++) { g.strokeStyle = 'rgba(120,78,40,' + (.06 + rnd() * .2) + ')'; g.lineWidth = .5 + rnd() * 2; const x = rnd() * w; g.beginPath(); g.moveTo(x, 0); for (let y = 0; y <= h; y += 32) g.lineTo(x + Math.sin(y * .01 + i * 1.7) * 3, y); g.stroke(); } for (let i = 0; i < 70; i++) { g.fillStyle = 'rgba(90,60,30,' + rnd() * .14 + ')'; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 6 + rnd() * 22); } }),
    board: tex(128, 1024, (g, w, h) => { g.fillStyle = '#743420'; g.fillRect(0, 0, w, h); for (let i = 0; i < 180; i++) { g.strokeStyle = 'rgba(40,14,6,' + (.08 + rnd() * .22) + ')'; g.lineWidth = .5 + rnd(); const x = rnd() * w; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + rnd() * 4 - 2, h); g.stroke(); } for (let i = 0; i < 400; i++) { g.fillStyle = 'rgba(150,80,50,' + rnd() * .12 + ')'; g.fillRect(rnd() * w, rnd() * h, 1, 2 + rnd() * 4); } }),
    back: tex(256, 512, (g, w, h) => { g.fillStyle = '#1A0D07'; g.fillRect(0, 0, w, h); for (let i = 0; i < 90; i++) { g.strokeStyle = 'rgba(70,32,16,' + (.05 + rnd() * .12) + ')'; g.lineWidth = 1 + rnd() * 3; const x = rnd() * w; g.beginPath(); g.moveTo(x, 0); for (let y = 0; y <= h; y += 32) g.lineTo(x + Math.sin(y * .02 + i) * 4, y); g.stroke(); } for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(210,190,170,' + rnd() * .25 + ')'; g.fillRect(rnd() * w, rnd() * h, 1 + rnd(), 1 + rnd() * 3); } }),
    shadow: null
  };
  const MAT = {
    spruce: { tex: 'spruce', rough: .55 }, back: { tex: 'back', rough: .25, coat: 1 }, interior: { color: [.13, .075, .04], rough: .9, dim: .35 }, oak: { tex: 'oak', rough: .6 }, board: { tex: 'board', rough: .5 },
    fret: { color: [.82, .78, .7], rough: .28, metal: .7 }, inlay: { color: [.95, .78, .16], rough: .35, emis: .2 }, nut: { color: [.06, .05, .045], rough: .35 },
    bone: { color: [.9, .86, .77], rough: .38 }, dark: { color: [.09, .06, .05], rough: .45 }, rosette: { color: [.33, .14, .07], rough: .5 }, veneer: { color: [.4, .2, .1], rough: .6 },
    chrome: { color: [.86, .86, .87], rough: .14, metal: 1 }, key: { color: [.9, .86, .74], rough: .3 }, holeWall: { color: [.08, .05, .035], rough: .9, dim: .5 }, panel: { color: [.05, .05, .05], rough: .45 }, knob: { color: [.03, .03, .03], rough: .5 },
    nylon: { color: [.92, .9, .86], rough: .25, alpha: .9 }, marker: { color: [.47, .72, .87], rough: .3, emis: .85 }, glow: { color: [.47, .72, .87], rough: 1, emis: 1, alpha: .26 }, cell: { color: [.47, .72, .87], rough: 1, emis: 1, alpha: .16 },
    shadowQ: { shadow: 1, alpha: .62 }, strShadow: { color: [0, 0, 0], rough: 1, alpha: .22, flat: 1 }, ghost: { color: [.95, .92, .86], rough: 1, emis: 1, alpha: .35 }
  };

  /* ---------- build the instrument ---------- */
  // baked AO: darker near the fingerboard tongue and bridge on the top, near the rim on the back
  const aoTop = (x, y) => { let a = 1; const dT = Math.hypot(x / 1.4, Math.max(0, y - TONGUE)); a -= .18 * Math.exp(-Math.pow(Math.max(0, Math.abs(x) - 18), 2) / 60) * (y > TONGUE - 20 && y < BT + 10 ? 1 : 0); a -= .14 * Math.exp(-((y - BR) * (y - BR)) / 30) * (Math.abs(x) < 32 ? 1 : 0); const t = (BT - y) / B, w = HW(Math.max(0, Math.min(1, t))); a -= .12 * Math.exp(-Math.pow(w - Math.abs(x), 2) / 40); return Math.max(.55, a + 0 * dT); };
  curPart = 'top';
  grid(56, 110, (u, v) => { const t = v, y = BT - t * B, w = HW(t) * ASYM(t); return [(u * 2 - 1) * w, y, 0]; }, (u, v) => { const t = v, w = HW(t); return [((u * 2 - 1) * w + 120) / 240, 1 - t]; }, MAT.spruce, aoTop).holes = true;
  curPart = 'body';
  [-1, 1].forEach(sd => grid(1, 110, (u, v) => { const t = v, y = BT - t * B; return [sd * HW(t) * ASYM(t), y, -u * 3.2]; }, null, MAT.veneer));
  box(0, BOT + 1.6, -2.6, HW(1) * 2 - 1, 3.2, 5.2, MAT.veneer);
  // carved back (outer) + interior (seen through the holes)
  const PEXP = 2.6, zb = (u, d) => -3.2 - d * Math.pow(1 - Math.pow(Math.abs(u), PEXP), 1 / PEXP);
  const aoBack = (x, y, z) => { const t = (BT - y) / B; return 1 - .25 * Math.exp(-Math.pow(z + 3.2, 2) / 50) - (t < .05 ? .15 : 0); };
  grid(48, 90, (u, v) => { const t = v, w = HW(t) * ASYM(t), d = DEP(t), uu = u * 2 - 1; return [uu * w, BT - t * B, zb(uu, d)]; }, (u, v) => [u, v], MAT.back, aoBack);
  grid(24, 40, (u, v) => { const t = .06 + v * .9, w = HW(t) - 3, d = DEP(t) - 3, uu = u * 2 - 1; return [uu * w, BT - t * B, zb(uu, d) + .5]; }, null, MAT.interior);
  { const pos = [0, BOT, -3.2 - DEP(1) * .45], idx = [], N = 48, w = HW(1), d = DEP(1); for (let i = 0; i <= N; i++) { const u = -1 + 2 * i / N; pos.push(u * w, BOT, zb(u, d)); if (i) idx.push(0, i, i + 1); } pos.push(w, BOT, -3.2, -w, BOT, -3.2); const a = N + 2, b = N + 3; idx.push(0, N + 1, a, 0, a, b, 0, b, 1); mesh(pos, idx, null, MAT.back); }
  // end button (cream) where the strings are tied, with its hole
  if (IP.hardware.endButton.present) { cyl([0, BOT - 2.2, -26], 'y', 8, 4.4, 28, MAT.key); cyl([0, BOT - 4.5, -26], 'y', 1.4, .4, 10, MAT.dark); }
  // preamp panel on the A side and output jack on the E side, as on the real instrument
  if (IP.hardware.preamp.present) { const t = IP.hardware.preamp.at || .46, y = BT - t * B, w = HW(t); box(-w * .99 + .2, y, -13, 2.4, 74, 22, MAT.panel); [-22, -6, 10].forEach(k => cyl([-w - 1.2, y + k, -8], 'x', 3.2, 3, 14, MAT.knob)); box(-w - 1, y + 24, -18, 1, 14, 9, { color: [.1, .12, .14], rough: .2, emis: .1 }); }
  if (IP.hardware.jack.present) { const t = .86, y = BT - t * B, w = HW(t); box(w * .99 - .2, y, -14, 2, 30, 18, MAT.panel); cyl([w + 1.2, y, -14], 'x', 4, 3, 16, MAT.chrome); }
  // neck back + heel; the dark back continues as a pointed tongue onto the heel
  curPart = 'neck';
  grid(26, 56, (u, v) => { const y = (BT - 34) + (1 - (BT - 34)) * v, k = Math.min(1, Math.max(0, y / BT)); const hw = y >= BT ? 15 + 3 * k : 18 + (BT - y) * .08, dep = y >= BT ? 19 + 6 * k : 25 + (BT - y) * .55, a = Math.PI * u; return [-Math.cos(a) * hw, y, -dep * Math.sin(a)]; }, (u, v) => [u, v * 3], MAT.oak);
  grid(10, 12, (u, v) => { const y = (BT - 34) + 90 * v, k = Math.min(1, Math.max(0, y / BT)), wv = 1 - v; const hw = (y >= BT ? 15 + 3 * k : 18 + (BT - y) * .08) * 1.012, dep = (y >= BT ? 19 + 6 * k : 25 + (BT - y) * .55) * 1.012; const a = Math.PI / 2 + (u * 2 - 1) * (Math.PI / 2) * wv * .6; return [-Math.cos(a) * hw, y, -dep * Math.sin(a)]; }, null, MAT.back);
  // fingerboard: top, side skirts, crowned frets, inlays, nut
  const FB_Y0 = 1, FB_Y1 = TONGUE;
  grid(12, 140, (u, v) => { const y = FB_Y0 + (FB_Y1 - FB_Y0) * v; return [(u * 2 - 1) * fbHalf(y), y, 5]; }, (u, v) => [u, v * 2], MAT.board);
  [-1, 1].forEach(sd => grid(1, 140, (u, v) => { const y = FB_Y0 + (FB_Y1 - FB_Y0) * v; return [sd * fbHalf(y), y, 5 - u * 5]; }, null, MAT.board));
  curPart = 'fret';
  for (let n = 1; n <= NF; n++) { const y = fy(n); cyl([0, y, 5.2], 'x', .9, fbHalf(y) * 2, 8, MAT.fret); }
  curPart = 'neck';
  IP.markers.single.forEach(n => disc([0, (fy(n - 1) + fy(n)) / 2, 5.04], 2.2, MAT.inlay));
  IP.markers.double.forEach(n => { disc([-8, (fy(n - 1) + fy(n)) / 2, 5.04], 2.2, MAT.inlay); disc([8, (fy(n - 1) + fy(n)) / 2, 5.04], 2.2, MAT.inlay); });
  curPart = 'nut'; box(0, 1.5, 3.9, 31, 3, 7.8, MAT.nut);
  // bridge: dark base, light bridge with a cut-out
  curPart = 'bridge';
  box(0, BR, 1.1, 62, 8, 2.2, MAT.dark); box(-17, BR, 6, 18, 6, 7.6, MAT.bone); box(17, BR, 6, 18, 6, 7.6, MAT.bone); box(0, BR, 7.9, 52, 6, 3.4, MAT.bone);
  cyl([-11, BR, 4.6], 'z', 1.8, 6.6, 12, MAT.dark); cyl([11, BR, 4.6], 'z', 1.8, 6.6, 12, MAT.dark);
  // sound hole: real openings (fragments are discarded), short walls, dark rosette ring
  curPart = 'hole';
  HOLES.forEach(([x, y, r], i) => cyl([x, y, -1.6], 'z', r, 3.2, i ? 14 : 48, MAT.holeWall, r, true));
  ring([0, SH_Y, .25], HR - .2, HR + RW, MAT.rosette);
  // slotted headstock: rails, throat, backward hook
  curPart = 'head';
  const SLOT0 = 16, SLOT1 = 108, HT = 136;
  box(-11.8, (SLOT0 + SLOT1) / 2, -6.5, 10.6, SLOT1 - SLOT0, 17, MAT.oak); box(11.8, (SLOT0 + SLOT1) / 2, -6.5, 10.6, SLOT1 - SLOT0, 17, MAT.oak);
  box(0, SLOT0 / 2, -6.5, 33, SLOT0, 17, MAT.oak);
  extrude([[2, SLOT1 - 1], [3, 126], [1, 133], [-8, HT], [-30, HT - 3], [-38, HT - 9], [-37, 122], [-29, 114], [-15, SLOT1 - 1]], -17, 17, (sx, sy, e) => [e, sy, sx], MAT.oak);
  // three geared tuners: C♯ upper-left, A lower-left, E alone on the right (as on the real headstock)
  curPart = 'tuners';
  const POST = { 2: { y: 94, side: -1 }, 1: { y: 46, side: -1 }, 3: { y: 70, side: 1 } };
  Object.keys(POST).forEach(k => {
    const { y, side } = POST[k];
    cyl([0, y, -6], 'x', 2.6, 13.6, 16, MAT.chrome); box(side * 18.6, y + 3, -6, 2.2, 30, 12, MAT.chrome);
    cyl([side * 21, y + 6, -6], 'x', 6.4, 2.6, 20, MAT.chrome);
    for (let g = 0; g < 12; g++) { const a = g / 12 * Math.PI * 2; box(side * 21, y + 6 + Math.cos(a) * 6.8, -6 + Math.sin(a) * 6.8, 2.4, 1.6, 1.6, MAT.chrome); }
    cyl([side * 28, y - 5, -9], 'x', 2, 14, 10, MAT.chrome); cyl([side * 34, y - 5, -9], 'x', 3.2, 2, 14, MAT.chrome);
    sphere([side * 41, y - 5, -9], 8, [.42, 1.15, .95], MAT.key);
  });
  /* ---- strings: post → nut → 64 segments → bridge → over the end → end button ---- */
  curPart = 'string';
  const SEG = 64, strings = {};
  for (let s = 1; s <= 3; s++) {
    const p = POST[s], px = Math.max(-5, Math.min(5, SX_NUT[s] * .6)), pts = [[px, p.y, -4], [SX_NUT[s], 1.5, SZ_NUT]];
    for (let i = 1; i < SEG; i++) { const y = BR * i / SEG; pts.push([sxAt(s, y), y, szAt(y)]); }
    pts.push([SX_BR[s], BR, SZ_BR], [SX_BR[s] * .45, BOT + .8, .8], [SX_BR[s] * .15, BOT - .8, -4], [SX_BR[s] * .07, BOT - 2.5, -22]);
    const arr = new Float32Array(pts.flat());
    strings[s] = { arr, base: arr.slice(), amp: 0, from: 0, phase: 0, tube: null };
  }
  // string shadows on the top (light from upper left)
  for (let s = 1; s <= 3; s++) grid(1, 24, (u, v) => { const y = TONGUE - 4 + (BR - TONGUE + 4) * v; return [sxAt(s, y) + 2.2 + (u - .5) * 1.4, y - 1.2, .35]; }, null, MAT.strShadow);
  // tubes (thickness differs per string)
  function tubeFor(s) {
    const st = strings[s], n = st.arr.length / 3, R = SRAD[s], SIDES = 6, pos = new Float32Array(n * SIDES * 3), idx = [];
    for (let i = 0; i < n - 1; i++) for (let k = 0; k < SIDES; k++) { const a = i * SIDES + k, b = i * SIDES + (k + 1) % SIDES, c = a + SIDES, d = b + SIDES; idx.push(a, c, b, b, c, d); }
    const m = mesh(Array.from(pos), idx, null, MAT.nylon); m.dynamic = true; m.tubeOf = s; m.R = R; m.SIDES = SIDES; st.tube = m; updateTube(s); return m;
  }
  function updateTube(s) {
    const st = strings[s], m = st.tube, a = st.arr, n = a.length / 3, P = m.pos, Nn = m.nrm, R = m.R, SIDES = m.SIDES;
    for (let i = 0; i < n; i++) {
      const j = Math.min(n - 1, i + 1), h = Math.max(0, i - 1);
      const dir = norm([a[j * 3] - a[h * 3], a[j * 3 + 1] - a[h * 3 + 1], a[j * 3 + 2] - a[h * 3 + 2]]);
      let ux = cross(dir, [0, 0, 1]); if (len(ux) < 1e-3) ux = [1, 0, 0]; ux = norm(ux); const uy = cross(dir, ux);
      for (let k = 0; k < SIDES; k++) { const an = k / SIDES * Math.PI * 2, c = Math.cos(an), sn = Math.sin(an), o = (i * SIDES + k) * 3; const nx = ux[0] * c + uy[0] * sn, ny = ux[1] * c + uy[1] * sn, nz = ux[2] * c + uy[2] * sn; P[o] = a[i * 3] + nx * R; P[o + 1] = a[i * 3 + 1] + ny * R; P[o + 2] = a[i * 3 + 2] + nz * R; Nn[o] = nx; Nn[o + 1] = ny; Nn[o + 2] = nz; }
    }
    m.dirty = true;
  }
  [1, 2, 3].forEach(tubeFor);
  // contact shadow behind the instrument
  curPart = 'shadow';
  TEX.shadow = tex(256, 1024, (g, w, h) => {
    g.filter = 'blur(14px)'; g.fillStyle = '#000'; g.beginPath();
    const sx = x => w / 2 + x * (w / 300), sy = y => (190 - y) * (h / 940);
    for (let i = 0; i <= 60; i++) { const tt = i / 60, y = BT - tt * B; const x = HW(tt) * .98; i ? g.lineTo(sx(x), sy(y)) : g.moveTo(sx(x), sy(y)); }
    for (let i = 60; i >= 0; i--) { const tt = i / 60, y = BT - tt * B; g.lineTo(sx(-HW(tt) * .98), sy(y)); }
    g.closePath(); g.fill(); g.fillRect(sx(-17), sy(140), sx(17) - sx(-17), sy(BT) - sy(140));
  });
  const shadowMesh = grid(1, 1, (u, v) => [(u - .5) * 300, 190 - v * 940, -105], (u, v) => [u, v], MAT.shadowQ); shadowMesh.part = 'shadow';
  // note marker + target cell
  curPart = 'ui';
  const markerA = sphere([0, 0, 0], 4.2, [1, 1, 1], MAT.marker), markerB = disc([0, 0, -1.2], 13, MAT.glow); markerA.local = markerB.local = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); markerA.visible = markerB.visible = false;
  const cellM = grid(1, 1, (u, v) => [u - .5, v - .5, 0], null, MAT.cell); cellM.local = new Float32Array(16); cellM.visible = false;
  const ghostM = [0, 1, 2].map(() => { const m = ring([0, 0, 0], 4.5, 6, MAT.ghost); m.local = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); m.visible = false; return m; });
  // teaching marks: TARGET contact points (now), PREVIOUS positions (fading) — NEXT positions use ghostM
  const targetM = [0, 1, 2].map(() => { const m = ring([0, 0, 0], 3.2, 6.2, MAT.ghost); m.local = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); m.visible = false; return m; });
  const prevM = [0, 1, 2].map(() => { const m = disc([0, 0, 0], 3.4, MAT.ghost); m.local = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); m.visible = false; return m; });
  let prevT0 = 0;

  /* ---------- WebGL ---------- */
  let gl = null, canvas = null, P = null, PL = null, U = {}, A = {}, glTex = {}, ready = false, failed = '';
  const VS = `attribute vec3 aP; attribute vec3 aN; attribute vec2 aU; attribute float aO; uniform mat4 uVP, uM; varying vec3 vN, vW, vL; varying vec2 vU; varying float vO;
void main(){ vec4 w = uM * vec4(aP,1.); vW = w.xyz; vL = aP; vN = mat3(uM) * aN; vU = aU; vO = aO; gl_Position = uVP * w; }`;
  const FS = `precision highp float; varying vec3 vN, vW, vL; varying vec2 vU; varying float vO;
uniform sampler2D uT; uniform float uHasT, uRough, uMetal, uCoat, uEmis, uAlpha, uWrap, uDim, uShadow, uFlat, uHoles; uniform vec3 uC, uEye; uniform vec3 uHole[27];
vec3 lin(vec3 c){ return pow(c, vec3(2.2)); }
vec3 env(vec3 r){ float t = smoothstep(-.3,.8,r.y); vec3 c = mix(vec3(.03,.025,.02), vec3(.3,.26,.21), t); c += vec3(2.4,2.,1.6) * pow(max(dot(r, normalize(vec3(-.55,.5,.65))),0.), 70.); c += vec3(.5,.6,.8) * pow(max(dot(r, normalize(vec3(.9,-.1,.3))),0.), 30.) * .5; c += vec3(1.2,1.,.8) * pow(max(dot(r, normalize(vec3(.2,.95,-.2))),0.), 40.) * .6; return c; }
void main(){
  if (uHoles > .5) { for (int i = 0; i < 27; i++) { vec3 h = uHole[i]; if (distance(vL.xy, h.xy) < h.z) discard; } }
  if (uShadow > .5) { gl_FragColor = vec4(0., 0., 0., texture2D(uT, vU).a * uAlpha); return; }
  if (uFlat > .5) { gl_FragColor = vec4(uC, uAlpha); return; }
  vec3 base = uHasT > .5 ? lin(texture2D(uT, vU).rgb) : uC;
  vec3 V = normalize(uEye - vW), N = normalize(vN); if (dot(N,V) < 0.) N = -N;
  vec3 col = base * mix(vec3(.04,.035,.03), vec3(.15,.13,.11), N.y*.5+.5);
  vec3 Ls[3]; vec3 Lc[3];
  Ls[0] = normalize(vec3(-.42,.52,.76)); Lc[0] = vec3(1.95,1.68,1.36);
  Ls[1] = normalize(vec3(.6,-.3,.4));   Lc[1] = vec3(.22,.27,.36);
  Ls[2] = normalize(vec3(.1,.35,-.9));  Lc[2] = vec3(.95,.78,.55);
  float sh = mix(260., 8., uRough);
  for (int i=0;i<3;i++){ vec3 l = Ls[i]; float nd = dot(N,l); float d = max((nd + uWrap) / (1. + uWrap), 0.); vec3 h = normalize(l+V); float s = pow(max(dot(N,h),0.), sh) * (1.-uRough*.85) * (sh + 8.) / 60.;
    col += Lc[i] * (base * d * (1.-uMetal) + mix(vec3(.04), base, uMetal) * s * max(nd, 0.)); }
  if (uWrap > 0.) col += base * vec3(.35,.08,.04) * pow(1. - max(dot(N,V),0.), 2.) * uWrap;
  float fr = .04 + .96 * pow(1. - max(dot(N,V),0.), 5.);
  vec3 R = reflect(-V, N);
  col += env(R) * mix(vec3(fr*(1.-uRough)), base, uMetal) * (uMetal > .5 ? 1. : .55);
  col += env(R) * fr * uCoat;
  col *= vO * uDim;
  col = mix(col, base * 1.35, uEmis);
  col = col / (col + vec3(.85)) * 1.55;
  gl_FragColor = vec4(pow(col, vec3(1./2.2)), uAlpha);
}`;
  const LVS = `attribute vec3 aP; uniform mat4 uVP, uM; void main(){ gl_Position = uVP * uM * vec4(aP,1.); }`;
  const LFS = `precision mediump float; uniform vec4 uC; void main(){ gl_FragColor = uC; }`;

  function init(cv) {
    if (ready || failed) return !failed;
    canvas = cv;
    try { gl = canvas.getContext('webgl', { antialias: true, alpha: true, preserveDrawingBuffer: false, premultipliedAlpha: false }); } catch (_) { gl = null; }
    if (!gl || !gl.getExtension('OES_element_index_uint')) { failed = 'nogl'; return false; }
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); failed = 'lost'; PD.bus.emit('r3d.lost'); });
    const prog = (v, f) => { const p = gl.createProgram(); [[gl.VERTEX_SHADER, v], [gl.FRAGMENT_SHADER, f]].forEach(([tp, s]) => { const sh = gl.createShader(tp); gl.shaderSource(sh, s); gl.compileShader(sh); if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh)); gl.attachShader(p, sh); }); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); return p; };
    try { P = prog(VS, FS); PL = prog(LVS, LFS); } catch (e) { console.error(e); failed = 'nogl'; return false; }
    ['uVP', 'uM', 'uT', 'uHasT', 'uRough', 'uMetal', 'uCoat', 'uEmis', 'uAlpha', 'uC', 'uEye', 'uWrap', 'uDim', 'uShadow', 'uFlat', 'uHoles', 'uHole'].forEach(n => U[n] = gl.getUniformLocation(P, n));
    A = { P: gl.getAttribLocation(P, 'aP'), N: gl.getAttribLocation(P, 'aN'), U: gl.getAttribLocation(P, 'aU'), O: gl.getAttribLocation(P, 'aO') };
    const af = gl.getExtension('EXT_texture_filter_anisotropic');
    Object.keys(TEX).forEach(k => { const tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, TEX[k]); gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT); if (af) gl.texParameterf(gl.TEXTURE_2D, af.TEXTURE_MAX_ANISOTROPY_EXT, 8); glTex[k] = tx; });
    meshes.forEach(upload);
    Object.values(strings).forEach(s => { s.buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, s.buf); gl.bufferData(gl.ARRAY_BUFFER, s.arr, gl.DYNAMIC_DRAW); });
    gl.useProgram(P); const ha = new Float32Array(27 * 3); HOLES.forEach((h, i) => { ha[i * 3] = h[0]; ha[i * 3 + 1] = h[1]; ha[i * 3 + 2] = h[2]; }); gl.uniform3fv(U.uHole, ha);
    bindInput(); ready = true;
    addEventListener('scroll', () => { if (!onScreen) kick(); }, { capture: true, passive: true });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
    kick(); return true;
  }
  function upload(m) {
    const usage = m.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
    m.b = [m.pos, m.nrm, m.uv, m.ao].map(a => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, a, usage); return b; });
    m.ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, m.idx, gl.STATIC_DRAW); m.n = m.idx.length;
  }

  /* ---------- camera ---------- */
  const VIEWS = {
    front: { theta: 0, phi: 1.53, r: 2300, t: [0, 30, 0], pz: 0 },
    player: { theta: 0, phi: .95, r: 1250, t: [0, -40, 0], pz: Math.PI / 2 },
    fretboard: { theta: .1, phi: 1.32, r: 820, t: [0, 150, 0], pz: Math.PI / 2 },
    right: { theta: -.25, phi: 1.1, r: 560, t: [240, -20, 10], pz: Math.PI / 2 },
    left: { theta: .25, phi: 1.15, r: 520, t: [0, 150, 0], pz: Math.PI / 2 },
    head: { theta: .75, phi: 1.32, r: 520, t: [0, 360, -10], pz: 0 },
    sound: { theta: .15, phi: 1.35, r: 620, t: [0, -165, 0], pz: 0 },
    side: { theta: Math.PI / 2, phi: 1.52, r: 2300, t: [0, 30, -20], pz: 0 },
    back: { theta: Math.PI, phi: 1.53, r: 2300, t: [0, 30, 0], pz: 0 },
    free: { theta: .5, phi: 1.2, r: 1900, t: [0, 30, 0], pz: 0, free: true },
    /* teaching cameras */
    teacher: { theta: 0, phi: 1.42, r: 1300, t: [0, -40, 0], pz: -Math.PI / 2 },
    full: { theta: 0, phi: 1.53, r: 2300, t: [0, 30, 0], pz: 0 },
    /* rhythm practice: right hand + strings over the sound hole, framed for a short viewport */
    strum: { theta: -.1, phi: 1.2, r: 720, t: [230, -10, 0], pz: Math.PI / 2 }
  };
  const rig = { theta: 0, phi: 1.53, r: 2300, t: [0, 30, 0], pz: 0 }, goal = { theta: 0, phi: 1.53, r: 2300, t: [0, 30, 0], pz: 0 };
  let view = 'front', base = VIEWS.front, dirty = true, W = 1, H = 1, MOD = null, MODinv = null, VP = null, VPinv = null, eye = [0, 0, 0];
  function setView(name, instant) {
    const v = VIEWS[name]; if (!v) return; view = name; base = v;
    Object.assign(goal, { theta: v.theta, phi: v.phi, r: v.r, t: v.t.slice(), pz: v.pz });
    while (goal.theta - rig.theta > Math.PI) goal.theta -= 2 * Math.PI; while (goal.theta - rig.theta < -Math.PI) goal.theta += 2 * Math.PI;
    if (instant) Object.assign(rig, goal, { t: goal.t.slice() });
    kick(); PD.bus.emit('r3d.view', name);
  }
  function focus(target, r, theta, phi) { Object.assign(goal, { t: target.slice(), r, theta: theta == null ? goal.theta : theta, phi: phi == null ? goal.phi : phi }); kick(); }
  // bounds: never lose the instrument
  const clampGoal = () => {
    const lim = base.free ? 99 : .65;
    if (!base.free) { goal.theta = Math.max(base.theta - lim, Math.min(base.theta + lim, goal.theta)); goal.phi = Math.max(base.phi - lim, Math.min(base.phi + lim, goal.phi)); }
    goal.phi = Math.max(.12, Math.min(Math.PI - .12, goal.phi)); goal.r = Math.max(260, Math.min(3000, goal.r));
    // panning can never lose the instrument: the look-at point stays on it
    goal.t = [Math.max(-260, Math.min(260, goal.t[0])), Math.max(BOT - 40, Math.min(180, goal.t[1])), Math.max(-120, Math.min(120, goal.t[2]))];
    goal.t[0] = Math.max(-140, Math.min(140, goal.t[0])); goal.t[1] = Math.max(-480, Math.min(500, goal.t[1])); goal.t[2] = Math.max(-80, Math.min(80, goal.t[2]));
  };
  let drag = null, pinch = 0, autoRot = false;
  function bindInput() {
    canvas.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, moved: 0, pan: e.button === 2 || e.shiftKey || e.pointerType === 'touch' && e.isPrimary === false }; try { canvas.setPointerCapture(e.pointerId); } catch (_) {} });
    canvas.addEventListener('pointermove', e => {
      if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY; drag.moved += Math.abs(dx) + Math.abs(dy);
      if (drag.moved < 5) return;
      if (drag.pan) { const k = goal.r / 900; const right = [Math.cos(goal.theta), 0, -Math.sin(goal.theta)]; goal.t = add(goal.t, add(mul(right, -dx * k), [0, dy * k, 0])); }
      else { goal.theta -= dx * .006; goal.phi -= dy * .006; }
      clampGoal(); kick();
    });
    canvas.addEventListener('pointerup', e => { if (drag && drag.moved < 5) tap(e.clientX, e.clientY); drag = null; });
    canvas.addEventListener('contextmenu', e => e.preventDefault());
    canvas.addEventListener('wheel', e => { e.preventDefault(); goal.r *= Math.exp(e.deltaY * .0012); clampGoal(); kick(); }, { passive: false });
    canvas.addEventListener('touchmove', e => { if (e.touches.length === 2) { const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); if (pinch) { goal.r *= pinch / d; clampGoal(); kick(); } pinch = d; if (drag) drag.pan = true; } }, { passive: true });
    canvas.addEventListener('touchend', () => { pinch = 0; });
    canvas.addEventListener('dblclick', () => setView(view === 'free' ? 'front' : view));
    new ResizeObserver(() => { kick(); }).observe(canvas);
  }

  /* ---------- picking ---------- */
  function ray(cx, cy) {
    const r = canvas.getBoundingClientRect(), nx = (cx - r.left) / r.width * 2 - 1, ny = -(cy - r.top) / r.height * 2 + 1;
    const a = M4.xf(MODinv, M4.xf(VPinv, [nx, ny, -1])), b = M4.xf(MODinv, M4.xf(VPinv, [nx, ny, 1]));
    return { a, b, at: z => { const t = (z - a[2]) / (b[2] - a[2]); return t > 0 ? [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t] : null; } };
  }
  function tap(cx, cy) {
    if (!VPinv) return;
    const R = ray(cx, cy); let p = R.at(5), f = -1;
    if (p && p[1] <= FB_Y0 && p[1] >= FB_Y1 && Math.abs(p[0]) <= fbHalf(p[1]) + 1) { f = 17; for (let n = 1; n <= 17; n++) if (p[1] >= fy(n)) { f = n; break; } }
    else { p = R.at(8); if (p && p[1] < TONGUE && p[1] > BR + 8 && Math.abs(p[0]) < 26) f = 0; }
    if (f < 0) { PD.bus.emit('r3d.tapEmpty', partAt(R)); return; }
    let s = 1, best = 1e9; for (let k = 1; k <= 3; k++) { const d = Math.abs(p[0] - sxAt(k, Math.min(0, p[1]))); if (d < best) { best = d; s = k; } }
    PD.bus.emit('r3d.tap', { s, f });
  }
  function partAt(R) {
    const p = R.at(0); if (!p) return null;
    if (p[1] > 0) return 'head';
    if (p[1] > BT) return 'neck';
    if (Math.hypot(p[0], p[1] - SH_Y) < 70) return 'hole';
    if (Math.abs(p[1] - BR) < 10 && Math.abs(p[0]) < 32) return 'bridge';
    const tt = (BT - p[1]) / B; if (tt >= 0 && tt <= 1 && Math.abs(p[0]) < HW(tt)) return 'top';
    return null;
  }

  /* ---------- note display / string vibration ---------- */
  const marker = { on: false, p: [0, 0, 0], s: 2, t0: 0 }, cell = { on: false, y: 0, h: 0, w: 0 };
  function hexLin(h) { return [1, 3, 5].map(i => Math.pow(parseInt(h.substr(i, 2), 16) / 255, 2.2)); }
  function pluck(s, f, vel) { const st = strings[s]; st.amp = vel == null ? 1 : vel; st.from = TH.fretFrac(f); kick(); }
  function showNote(s, f, opt) {
    opt = opt || {};
    const yDot = f === 0 ? -8 : fy(f) + (fy(f - 1) - fy(f)) * .3;
    marker.on = true; marker.s = s; marker.p = [sxAt(s, Math.min(0, yDot)), yDot, szAt(Math.min(0, yDot)) + 1.6]; marker.t0 = performance.now();
    const c = hexLin(SCOL[s]); markerA.mat = Object.assign({}, MAT.marker, { color: c }); markerB.mat = Object.assign({}, MAT.glow, { color: c });
    if (f > 0) { cell.on = true; cell.y = (fy(f - 1) + fy(f)) / 2; cell.h = fy(f - 1) - fy(f); cell.w = fbHalf(cell.y) * 2; cellM.mat = Object.assign({}, MAT.cell, { color: c }); } else cell.on = false;
    if (opt.pluck !== false) pluck(s, f);
    kick();
  }
  function clearNote() { marker.on = false; cell.on = false; kick(); }

  const cellY = f => fy(f) + (fy(f - 1) - fy(f)) * .32;
  function placeRings(arr, notes, mat, alpha) { arr.forEach((m, i) => { const n = notes && notes[i]; if (!n || n.f <= 0) { m.visible = false; return; } const y = cellY(n.f); m.visible = true; m.local.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, sxAt(n.s, y), y, szAt(y) + 1.4, 1]); m.mat = Object.assign({}, mat, { color: hexLin(SCOL[n.s]), alpha }); }); kick(); }
  /** exact fingertip contact points for the current step (bright); the previous ones fade out */
  function setTarget(notes) {
    const old = targetM.filter(m => m.visible).map(m => m.local.slice());
    prevM.forEach((m, i) => { if (old[i]) { m.local.set(old[i]); m.visible = true; m.mat = Object.assign({}, MAT.ghost, { color: [.8, .78, .74], alpha: .3 }); } else m.visible = false; }); prevT0 = performance.now();
    placeRings(targetM, notes, MAT.marker, .95);
  }
  function setGhost(notes) { ghostM.forEach((m, i) => { const n = notes && notes[i]; if (!n || n.f <= 0) { m.visible = false; return; } const y = fy(n.f) + (fy(n.f - 1) - fy(n.f)) * .32; m.visible = true; m.local.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, sxAt(n.s, y), y, szAt(y) + 1.2, 1]); m.mat = Object.assign({}, MAT.ghost, { color: hexLin(SCOL[n.s]) }); }); kick(); }
  /* ---------- render loop (on demand) ---------- */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let last = performance.now(), quality = PD.store.get('quality', 'auto'), showStrTubes = true;
  function dpr() { const q = quality === 'auto' ? (PD.device.low ? 'low' : PD.device.mobile ? 'medium' : 'high') : quality; return Math.min(window.devicePixelRatio || 1, q === 'low' ? 1 : q === 'medium' ? 1.5 : q === 'ultra' ? 3 : 2); }
  function resize() { const r = canvas.getBoundingClientRect(); if (r.width < 2) return false; W = r.width; H = r.height; const d = dpr(); const cw = Math.round(W * d), ch = Math.round(H * d); if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; } return true; }
  function drawMesh(m, model) {
    const mt = m.mat; gl.uniformMatrix4fv(U.uM, false, model);
    gl.uniform3fv(U.uC, mt.color || [1, 1, 1]); gl.uniform1f(U.uHasT, mt.tex || mt.shadow ? 1 : 0); gl.uniform1f(U.uRough, mt.rough == null ? .5 : mt.rough); gl.uniform1f(U.uMetal, mt.metal || 0); gl.uniform1f(U.uCoat, mt.coat || 0); gl.uniform1f(U.uEmis, mt.emis || 0); gl.uniform1f(U.uAlpha, mt.alpha || 1); gl.uniform1f(U.uWrap, mt.wrap || 0); gl.uniform1f(U.uDim, mt.dim || 1); gl.uniform1f(U.uShadow, mt.shadow || 0); gl.uniform1f(U.uFlat, mt.flat || 0); gl.uniform1f(U.uHoles, m.holes ? 1 : 0);
    if (mt.tex || mt.shadow) { gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, glTex[mt.shadow ? 'shadow' : mt.tex]); gl.uniform1i(U.uT, 0); }
    if (m.dynamic && m.dirty) { gl.bindBuffer(gl.ARRAY_BUFFER, m.b[0]); gl.bufferSubData(gl.ARRAY_BUFFER, 0, m.pos); gl.bindBuffer(gl.ARRAY_BUFFER, m.b[1]); gl.bufferSubData(gl.ARRAY_BUFFER, 0, m.nrm); m.dirty = false; }
    [A.P, A.N, A.U, A.O].forEach((loc, i) => { if (loc < 0) return; gl.bindBuffer(gl.ARRAY_BUFFER, m.b[i]); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, i === 2 ? 2 : i === 3 ? 1 : 3, gl.FLOAT, false, 0, 0); });
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.ib); gl.drawElements(gl.TRIANGLES, m.n, gl.UNSIGNED_INT, 0);
  }
  /* render loop runs only while something changes and the canvas is on screen */
  let rafId = 0, onScreen = true;
  function kick() { dirty = true; if (!rafId && ready && !failed) { last = performance.now(); rafId = requestAnimationFrame(frame); } }
  function frame(now) {
    rafId = 0;
    if (!ready || failed || !canvas.offsetParent || document.hidden) { last = now; return; }
    { const r = canvas.getBoundingClientRect(); onScreen = r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth; if (!onScreen) { last = now; return; } }   // off-screen: no GPU work
    const keep = () => { if (!rafId) rafId = requestAnimationFrame(frame); };
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!resize()) return;
    if (autoRot && !drag) { goal.theta += dt * .35; kick(); }
    const k = reduce ? 1 : 1 - Math.exp(-dt * 5);
    let moving = false;
    ['theta', 'phi', 'r', 'pz'].forEach(n => { const d = goal[n] - rig[n]; if (Math.abs(d) > 1e-4) moving = true; rig[n] += d * k; });
    for (let i = 0; i < 3; i++) { const d = goal.t[i] - rig.t[i]; if (Math.abs(d) > .01) moving = true; rig.t[i] += d * k; }
    const vib = Object.values(strings).some(s => s.amp);
    const markerLive = marker.on && now - marker.t0 < 4000, prevLive = prevM.some(m => m.visible) && now - prevT0 < 1600;
    if (prevLive) prevM.forEach(m => { if (m.visible) m.mat.alpha = .3 * (1 - (now - prevT0) / 1600); }); else prevM.forEach(m => { m.visible = false; });
    if (!(dirty || moving || vib || markerLive || prevLive || autoRot)) return;
    keep();
    dirty = false;
    const aspect = W / H, fov = 26 * Math.PI / 180, fit = rig.r > 1100 ? Math.max(1, .85 / aspect) : 1, rr = rig.r * fit;
    eye = [rig.t[0] + rr * Math.sin(rig.phi) * Math.sin(rig.theta), rig.t[1] + rr * Math.cos(rig.phi), rig.t[2] + rr * Math.sin(rig.phi) * Math.cos(rig.theta)];
    VP = M4.mul(M4.persp(fov, aspect, Math.max(20, rr * .05), 9000), M4.look(eye, rig.t, [0, 1, 0]));
    MOD = M4.model(0, rig.pz, 280); MODinv = M4.invert(MOD); VPinv = M4.invert(VP);
    gl.viewport(0, 0, canvas.width, canvas.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(P); gl.uniformMatrix4fv(U.uVP, false, VP); gl.uniform3fv(U.uEye, eye);
    // strings: vibrate from the fretted point to the bridge
    for (let s = 1; s <= 3; s++) {
      const st = strings[s];
      if (st.amp) {
        st.amp *= Math.exp(-dt * 2.2);
        if (st.amp < .003) { st.amp = 0; st.arr.set(st.base); }
        else { st.phase += dt * 75; for (let i = 1; i <= SEG; i++) { const p = (i - 1) / SEG, q = p <= st.from ? 0 : Math.sin(Math.PI * (p - st.from) / (1 - st.from)), o = i * 3; st.arr[o + 2] = st.base[o + 2] + st.amp * 1.3 * q * Math.sin(st.phase); st.arr[o] = st.base[o] + st.amp * .5 * q * Math.cos(st.phase * .97); } }
        updateTube(s); gl.bindBuffer(gl.ARRAY_BUFFER, st.buf); gl.bufferSubData(gl.ARRAY_BUFFER, 0, st.arr);
      }
    }
    const transparent = [], low = (quality === 'low' || quality === 'auto' && PD.device.low);
    meshes.forEach(m => {
      if (!m.visible) return;
      if (m.part === 'shadow' && (low || view === 'side')) return;
      const model = m.local ? M4.mul(MOD, m.local) : MOD;
      if (m === markerA || m === markerB) { if (!marker.on) return; const mm = M4.mul(MOD, new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, marker.p[0], marker.p[1], marker.p[2], 1])); transparent.push([m, mm]); return; }
      if (m === cellM) { if (!cell.on) return; transparent.push([m, M4.mul(MOD, new Float32Array([cell.w, 0, 0, 0, 0, cell.h, 0, 0, 0, 0, 1, 0, 0, cell.y, 5.15, 1]))]); return; }
      if (m.tubeOf && (!showStrTubes || rig.r > 1300)) return;
      if (m.mat.alpha) { transparent.push([m, model]); return; }
      drawMesh(m, model);
    });
    if (rig.r > 900 || !showStrTubes) {
      gl.useProgram(PL); gl.uniformMatrix4fv(gl.getUniformLocation(PL, 'uVP'), false, VP); gl.uniformMatrix4fv(gl.getUniformLocation(PL, 'uM'), false, MOD);
      const aPL = gl.getAttribLocation(PL, 'aP');
      for (let s = 1; s <= 3; s++) { const st = strings[s]; gl.bindBuffer(gl.ARRAY_BUFFER, st.buf); gl.enableVertexAttribArray(aPL); gl.vertexAttribPointer(aPL, 3, gl.FLOAT, false, 0, 0); gl.uniform4fv(gl.getUniformLocation(PL, 'uC'), marker.on && marker.s === s && st.amp ? [...hexLin(SCOL[s]).map(c => Math.pow(c, 1 / 2.2)), 1] : [.9, .89, .86, .8]); gl.drawArrays(gl.LINE_STRIP, 0, st.arr.length / 3); }
      gl.useProgram(P); gl.uniformMatrix4fv(U.uVP, false, VP); gl.uniform3fv(U.uEye, eye);
    }
    gl.depthMask(false); transparent.forEach(([m, mm]) => drawMesh(m, mm)); gl.depthMask(true);
    if (marker.on) markerB.mat.alpha = .2 + .1 * Math.sin(now / 240);
    PD.bus.emit('r3d.frame', { project });
  }
  function project(p) { if (!MOD) return [0, 0, 2]; const c = M4.xf(VP, M4.xf(MOD, p)); return [(c[0] + 1) / 2 * W, (1 - c[1]) / 2 * H, c[2]]; }
  function eyeLocal() { return MODinv ? M4.xf(MODinv, eye) : [0, 0, 1]; }

  /* ---------- parts (labels, focus, tour) ---------- */
  const PARTS = [
    { id: 'body', p: [-HW(.6) - 4, BT - .6 * B, -40], focus: { t: [0, BT - .5 * B, -30], r: 1000, theta: Math.PI * .8, phi: 1.4 } },
    { id: 'top', p: [HW(.78) * .55, BT - .78 * B, 1], focus: { t: [0, BT - .55 * B, 0], r: 900, theta: .15, phi: 1.45 } },
    { id: 'neck', p: [26, -150, 6], focus: { t: [0, -150, 0], r: 900, theta: .35, phi: 1.4 } },
    { id: 'fret', p: [24, (fy(11) + fy(12)) / 2, 6], focus: { t: [0, fy(12), 0], r: 420, theta: .3, phi: 1.3 } },
    { id: 'string', p: [-22, (BT + BR) / 2, 10], focus: { t: [0, (BT + BR) / 2, 5], r: 520, theta: -.2, phi: 1.2 } },
    { id: 'nut', p: [24, 1.5, 9], focus: { t: [0, 10, 0], r: 300, theta: .5, phi: 1.2 } },
    { id: 'bridge', p: [40, BR - 12, 10], focus: { t: [0, BR, 0], r: 360, theta: .3, phi: 1.1 } },
    { id: 'hole', p: [0, SH_Y - HR - 22, 1], focus: { t: [0, SH_Y, 0], r: 480, theta: .1, phi: 1.3 } },
    { id: 'head', p: [0, 150, -10], focus: { t: [0, 70, -8], r: 420, theta: .75, phi: 1.32 } },
    { id: 'tuners', p: [-48, 90, -9], focus: { t: [0, 70, -8], r: 380, theta: -.9, phi: 1.3 } }
  ];

  return {
    init, setView, focus, showNote, clearNote, pluck, setGhost, setTarget, project, eyeLocal, PARTS, VIEWS, strings,
    get view() { return view; }, get failed() { return failed; }, get ready() { return ready; }, get canvas() { return canvas; },
    set autoRot(v) { autoRot = v; kick(); },
    set quality(q) { quality = q; PD.store.set('quality', q); kick(); },
    get quality() { return quality; },
    focusPart(id) { const p = PARTS.find(x => x.id === id); if (!p) return; base = VIEWS.free; view = 'free'; focus(p.focus.t, p.focus.r, p.focus.theta, p.focus.phi); PD.bus.emit('r3d.view', 'free'); },
    invalidate() { kick(); },
    get geometry() { return { L, BT, B, BOT, BR, SH_Y, HR }; },
    /** move the single canvas into a host element */
    mount(host) { if (!canvas) { const c = document.createElement('canvas'); c.className = 'gl3d'; c.setAttribute('aria-label', 'panduri 3D'); canvas = c; host.appendChild(c); if (!init(c)) return false; } else if (canvas.parentNode !== host) host.appendChild(canvas); kick(); return !failed; },
    fy, sxAt
  };
})();
