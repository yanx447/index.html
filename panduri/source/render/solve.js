/* Pose solver for one hand on the panduri neck. Only joint rotations change (bone lengths are fixed),
   so fingers can never stretch. The objective: fingertip pads on their string/fret targets, every other
   part of the hand outside the neck and above the strings (rounded, arched fingers), natural joint ranges,
   a relaxed hand (ring/little finger loosely curled), and continuity with a previous pose. */
const { V, Q } = window.HS;
const D2R = Math.PI / 180;
export const FING = ['index', 'middle', 'ring', 'pinky'];
/** Squared distance between two finite bone segments, including parallel cases. */
export function segmentDistance(a, b, c, d) {
  const u = V.sub(b, a), v = V.sub(d, c), w = V.sub(a, c);
  const A = V.dot(u, u), B = V.dot(u, v), C = V.dot(v, v), D = V.dot(u, w), E = V.dot(v, w);
  const den = A * C - B * B, clamp = x => Math.max(0, Math.min(1, x));
  let t = den > 1e-9 ? clamp((B * E - C * D) / den) : 0;
  let q = C > 1e-9 ? (B * t + E) / C : 0;
  if (q < 0) { q = 0; t = A > 1e-9 ? clamp(-D / A) : 0; }
  else if (q > 1) { q = 1; t = A > 1e-9 ? clamp((B - D) / A) : 0; }
  return V.len(V.sub(V.add(a, V.mul(u, t)), V.add(c, V.mul(v, q))));
}
export function neckGeo(HS) {
  const X = HS.X, G = HS.G3, L = G.L, BR = -L;
  const fy = n => -L * HS.TH.fretFrac(n);
  const sx = (s, y) => X.SX_NUT[s] + (X.SX_BR[s] - X.SX_NUT[s]) * (y / BR), sz = y => X.SZ_NUT + (X.SZ_BR - X.SZ_NUT) * (y / BR);
  const hw = y => (y >= G.BT ? 15 + 3 * Math.min(1, Math.max(0, y / G.BT)) : 18 + (G.BT-y)*.08), dep = y => (y >= G.BT ? 19 + 6 * Math.min(1, Math.max(0, y / G.BT)) : 25 + (G.BT-y)*.55);
  const interp=(pts,t)=>{let i=0;while(i<pts.length-2 && pts[i+1][0]<t)i++;const a=pts[i],b=pts[i+1];return a[1]+(b[1]-a[1])*Math.max(0,Math.min(1,(t-a[0])/(b[0]-a[0])));};
  /** where a fingertip goes for string s at fret f: just behind the fret, on top of the string */
  const target = (s, f, lift) => { const y = fy(f) + .3 * (fy(f - 1) - fy(f)); return [sx(s, y), y, sz(y) + X.SRAD[s] + (lift || 0)]; };
  /** how deep a sphere (p, r) sits inside the neck or the string band */
  function pen(p, r, strings) {
    const [x, y, z] = p; if (y > 4) return 0;
    let depth = 0;
    if (HS.body && y <= G.BT && y >= G.BT-HS.body.lengthMm) {
      const t=(G.BT-y)/HS.body.lengthMm, bw=interp(HS.body.outline,t)*(1+.012*Math.sin(t*5.2)), bd=interp(HS.body.depth,t);
      if(Math.abs(x)<bw+r){const bottom=-3.2-bd*Math.pow(Math.max(0,1-Math.pow(Math.min(1,Math.abs(x)/bw),2.6)),1/2.6);depth=Math.max(0,Math.min(bw+r-Math.abs(x),r-z,z-bottom+r));}
    }
    if(y<G.BT-34)return depth;
    const w = hw(y), d = dep(y);
    if (z >= 0) {
      const band = Math.max(Math.abs(sx(1, y)), Math.abs(sx(3, y))) + 2.5;
      const top = strings !== false && Math.abs(x) < band + r ? sz(y) + 1.2 : y >= G.BT-12 ? 5 : 0;
      if (Math.abs(x) < w + r) depth = Math.max(depth, Math.min(top + r - z, w + r - Math.abs(x)));
    } else {
      const e = Math.pow(x / (w + r), 2) + Math.pow(z / (d + r), 2);
      if (e < 1) depth = Math.max(depth, (1 - Math.sqrt(e)) * (w + r));
    }
    if(r===0 && z>4.2 && z<6.2 && Math.abs(x)<w)for(let f=1;f<=17;f++)depth=Math.max(depth,.9-Math.hypot(y-fy(f),z-5.2));
    return Math.max(0, depth);
  }
  return { fy, sx, sz, hw, dep, target, pen };
}

/** parameter vector <-> pose */
export function pack(p) { return [...p.rv, ...p.rp, p.wflex, p.wdev, ...p.f.flat(), ...p.t]; }
export function unpack(v) { return { rv: v.slice(0, 3), rp: v.slice(3, 6), wflex: v[6], wdev: v[7], f: [v.slice(8, 12), v.slice(12, 16), v.slice(16, 20), v.slice(20, 24)], t: v.slice(24, 29) }; }
/** the hand is placed directly (rv/rp = hand rotation and wrist position in mm); the forearm follows from the wrist angles */
export function toPose(rg, SC, u) {
  const S = rg.S, ax = rg.axes[`hand.${S}`], Lh = Q.mul(Q.axis(ax.abd, u.wdev), Q.axis(ax.flex, u.wflex)), hq = Q.fromVec(u.rv);
  const conj = q => [-q[0], -q[1], -q[2], q[3]], rootQ = Q.mul(hq, conj(Lh));
  const wrist = V.mul(u.rp, 1 / SC), rootP = V.sub(wrist, Q.rot(rootQ, V.sub(rg.H[`hand.${S}`], rg.H[rg.root])));
  return { rootQ, rootP, wflex: u.wflex, wdev: u.wdev, f: u.f, t: u.t };
}

const LIM = { f: [[-15, 95], [-22, 22], [0, 105], [-5, 80]], t: [[-70, 70], [-70, 70], [-45, 80], [-25, 75], [-25, 85]], w: [[-65, 65], [-30, 30]] };

export function solver(HS, S) {
  const rg = HS.rigs[S], SC = HS.SC, N = neckGeo(HS), rad = b => (HS.radius[b] || .03) * SC;
  /** evaluate a parameter vector */
  function evalV(v, task) {
    const u = unpack(v), pose = toPose(rg, SC, u), F = rg.fk(pose), Wp = n => V.mul(F.W[n].p, SC), Wq = n => F.W[n].q;
    let E = 0;
    const skinMatrices = {};
    const skin = weights => {
      let x=0,y=0,z=0;
      for (const a of weights) {
        let m=skinMatrices[a.n];
        if(!m){const w=F.W[a.n],q=w.q,[qx,qy,qz,qw]=q,xx=qx*qx,yy=qy*qy,zz=qz*qz,xy=qx*qy,xz=qx*qz,yz=qy*qz,wx=qw*qx,wy=qw*qy,wz=qw*qz;
          m=skinMatrices[a.n]=[(1-2*(yy+zz))*SC,2*(xy-wz)*SC,2*(xz+wy)*SC,2*(xy+wz)*SC,(1-2*(xx+zz))*SC,2*(yz-wx)*SC,2*(xz-wy)*SC,2*(yz+wx)*SC,(1-2*(xx+yy))*SC,w.p[0]*SC,w.p[1]*SC,w.p[2]*SC];}
        const p=a.p; x+=(m[0]*p[0]+m[1]*p[1]+m[2]*p[2]+m[9])*a.w;y+=(m[3]*p[0]+m[4]*p[1]+m[5]*p[2]+m[10])*a.w;z+=(m[6]*p[0]+m[7]*p[1]+m[8]*p[2]+m[11])*a.w;
      }
      return [x,y,z];
    };
    const tipPad = (last, dorsalAxis) => { const tip = V.mul(F.tip(last), SC), q = Wq(last), d = V.nrm(Q.rot(q, rg.axes[last].d)), dr = V.nrm(Q.rot(q, dorsalAxis)); const r = rad(last); let pad = V.sub(V.sub(tip, V.mul(d, .55 * r)), V.mul(dr, .55 * r));
      if (HS.padSamples && HS.padSamples[last]) pad = skin(HS.padSamples[last]);
      return { pad, d, dr, r }; };
    const pads = {};
    FING.forEach(fn => { pads[fn] = tipPad(`finger_${fn}.03.${S}`, rg.dorsal); });
    pads.thumb = tipPad(`thumb.03.${S}`, rg.axes[`thumb.03.${S}`].dorsal);
    // Match the string to the actual distal surface, not an imaginary point
    // inside the thumb. A barre has a separate contact on each covered string.
    const contactErrors = {};
    Object.keys(task.targets).forEach(k => {
      const targets = (task.contacts && task.contacts[k]) || [task.targets[k]];
      const samples = HS.contactSamples && HS.contactSamples[k];
      const points = samples ? samples.map(skin) : [pads[k].pad];
      let worst = 0;
      for (const target of targets) {
        let best = Infinity, chosen = pads[k].pad;
        for (const p of points) { const dx=p[0]-target[0],dy=p[1]-target[1],dz=p[2]-target[2],d=dx*dx+dy*dy+dz*dz;if(d<best){best=d;chosen=p;} }
        pads[k].pad = chosen; worst = Math.max(worst, Math.sqrt(best)); E += (task.tw || 40) * best;
      }
      contactErrors[k] = worst;
    });
    // 2 · nothing inside the neck; arched fingers above the strings (the contact pad itself is exempt)
    const pts = [];
    const seg = (a, b, ra, rb, n, strings) => { for (let i = 0; i <= n; i++) { const k = i / n; pts.push([V.add(a, V.mul(V.sub(b, a), k)), ra + (rb - ra) * k, strings]); } };
    FING.concat(['thumb']).forEach(fn => {
      const ch = fn === 'thumb' ? ['thumb.01', 'thumb.02', 'thumb.03'] : [`finger_${fn}.01`, `finger_${fn}.02`, `finger_${fn}.03`];
      const pressing = task.targets[fn] != null;
      ch.forEach((b, i) => { const n = `${b}.${S}`, a = Wp(n), e = i < 2 ? Wp(`${ch[i + 1]}.${S}`) : V.mul(F.tip(n), SC); seg(a, i < 2 ? e : V.add(a, V.mul(V.sub(e, a), pressing ? .45 : 1)), rad(n) * .95, rad(n) * .9, i < 2 ? 3 : 2, true); });
    });
    // palm: keep a gap (the "ball") between the palm and the back of the neck
    [`hand.${S}`, `palm.01.${S}`, `palm.02.${S}`, `palm.03.${S}`, `palm.04.${S}`].forEach(b => { const a = Wp(b), kid = (rg.kids[b] || [])[0]; if (kid) seg(a, Wp(kid), 13, 12, 3, false); });
    let neck = 0; pts.forEach(([p, r, st]) => { const d = N.pen(p, r, st); neck = Math.max(neck, d); E += (HS.surface && st ? 0 : 150) * d * d; });
    // Check the skinned surface too. The thumb is elliptical, so a radius
    // around its bone cannot reliably describe its contact with the wood.
    let surface = 0;
    if (HS.surface) for (const weights of HS.surface) {
      const p = skin(weights);
      const depth = N.pen(p, 0, false);
      surface = Math.max(surface, depth);
      if (depth > .05) E += (task.surfaceWeight || 15000) * (depth - .02) ** 2;
    }
    // Every phalanx against every other digit, including the thumb. Checking only
    // adjacent middle knuckles missed the intersections visible in Csus2 and Am.
    const digits = FING.concat(['thumb']).map(fn => {
      const prefix = fn === 'thumb' ? 'thumb' : 'finger_' + fn;
      return [1, 2, 3].map(i => {
        const n = `${prefix}.0${i}.${S}`, a = Wp(n), b = i < 3 ? Wp(`${prefix}.0${i + 1}.${S}`) : V.mul(F.tip(n), SC);
        return { a: i === 1 ? V.add(a, V.mul(V.sub(b, a), .22)) : a, b, r: rad(n) * .86 };
      });
    });
    let collision = 0;
    for (let i = 0; i < digits.length; i++) for (let j = i + 1; j < digits.length; j++) {
      for (const a of digits[i]) for (const b of digits[j]) {
        const overlap = a.r + b.r + .8 - segmentDistance(a.a, a.b, b.a, b.b);
        if (overlap > 0) { collision = Math.max(collision, overlap); E += (task.collisionWeight || 5000) * overlap * overlap; }
      }
    }
    // 4 · pressing fingertips come down onto the string (not flat)
    Object.keys(task.targets).forEach(k => { if (k === 'thumb' || (task.flat || []).includes(k)) return; const dz = -pads[k].d[2]; if (dz < .55) E += 60 * (.55 - dz) ** 2; });
    // the thumb, when pressing, comes over the edge onto the string (from the side, down onto the board)
    if (task.targets.thumb && task.thumbDir) { const c = V.dot(pads.thumb.d, task.thumbDir); if (c < .4) E += 40 * (.4 - c) ** 2; }
    // 5 · natural ranges, gentle preferences
    const lim = (x, [a, b], w) => { const xa = x / D2R; if (xa < a) E += w * ((a - xa) / 10) ** 2; if (xa > b) E += w * ((xa - b) / 10) ** 2; };
    u.f.forEach((f, i) => { f.forEach((x, k) => lim(x, LIM.f[k], 45)); E += .4 * ((f[3] - .62 * f[2]) / (30 * D2R)) ** 2; });
    u.t.forEach((x, k) => lim(x, LIM.t[k], 30)); lim(u.wflex, LIM.w[0], 20); lim(u.wdev, LIM.w[1], 20);
    // free fingers stay clear of the strings and the fretboard (they rest below the neck)
    (task.free || []).forEach(fn => {
      const tip = pads[fn].pad, w = N.hw(tip[1]);
      if (tip[0] < w + 6) E += 8 * (w + 6 - tip[0]) ** 2;             // out past the edge of the board
      if (tip[2] > -4) E += 9 * (tip[2] + 4) ** 2;                     // and below its face, never over the strings
    });
    // no fingertip hides another: the tips keep a little air between them
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
      const a = pads[FING[i]].pad, b = pads[FING[j]].pad, dd = V.len(V.sub(a, b));
      if (dd < 16) E += 10 * (16 - dd) ** 2;
    }
    // resting places for the free fingers (curled under the neck)
    Object.entries(task.restTips || {}).forEach(([fn, f]) => { if (task.targets[fn]) return; const e = V.sub(pads[fn].pad, f()); E += 5 * V.dot(e, e) / 10; });
    // relaxed ring / little finger: loosely curled, following the middle finger
    if (!task.targets.ring) { const f = u.f[2], m = u.f[1]; E += .5 * ((f[0] - m[0] * .9) / (25 * D2R)) ** 2 + .3 * ((f[2] - Math.max(.6, m[2])) / (30 * D2R)) ** 2; }
    if (!task.targets.pinky) { const f = u.f[3], r = u.f[2]; E += .5 * ((f[0] - r[0]) / (25 * D2R)) ** 2 + .3 * ((f[2] - r[2]) / (30 * D2R)) ** 2; }
    // forearm comes from the elbow side
    if (task.elbowDir) { const fa = V.nrm(Q.rot(pose.rootQ, V.sub(rg.H[`forearm.${S}`], rg.H[`hand.${S}`]))); const c = V.dot(fa, task.elbowDir); E += (task.elbowW || 4) * (1 - c) ** 2; }
    // soft guides: where the palm, the knuckles and the thumb base should be (hand behind the neck)
    (task.guides || []).forEach(([b, pt, w]) => { const pp = b === 'palm' ? V.mul([`palm.01.${S}`, `palm.02.${S}`, `palm.03.${S}`, `palm.04.${S}`, `hand.${S}`].map(n => Wp(n)).reduce((a, c) => V.add(a, c), [0, 0, 0]), 1 / 5) : Wp(`${b}.${S}`); const e = V.sub(pp, pt); E += w * V.dot(e, e) / 100; });
    // task-specific structure (e.g. which side of the neck the palm and knuckles stay on)
    if (task.extra) E += task.extra(Wp, S);
    // continuity with a reference pose
    if (task.ref) { for (let i = 0; i < v.length; i++) { const w = i < 3 ? (task.refRot || 6) : i < 6 ? .004 : i < 8 ? 2 : (task.refJ || 0); E += w * (v[i] - task.ref[i]) ** 2; } }
    return { E, pads, F, u, collision, neck, surface, contactErrors };
  }
  /** coordinate descent with shrinking steps and random kicks */
  function solve(task, v0, iters) {
    const bounded=(x,i)=>{const lim=i===6?LIM.w[0]:i===7?LIM.w[1]:i>=8&&i<24?LIM.f[(i-8)%4]:i>=24?LIM.t[i-24]:null;return lim?Math.max(lim[0]*D2R,Math.min(lim[1]*D2R,x)):x;};
    let v = v0.map(bounded), best = evalV(v, task).E;
    const step = v.map((_, i) => i < 3 ? .2 : i < 6 ? 12 : .25);
    for (let it = 0; it < (iters || 60); it++) {
      let improved = false;
      for (let i = 0; i < v.length; i++) {
        for (const sg of [1, -1]) { const w = v.slice(); w[i] = bounded(w[i] + sg * step[i], i); const e = evalV(w, task).E; if (e < best) { best = e; v = w; improved = true; break; } }
      }
      if (!improved) for (let i = 0; i < step.length; i++) step[i] *= .6;
      if (Math.max(...step.slice(6)) < .002 && step[3] < .05) break;
    }
    return { v, E: best };
  }
  return { evalV, solve, N, rg, SC };
}
