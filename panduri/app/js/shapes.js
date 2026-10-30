/* =====================================================================
   Two teaching pages built on what the app already knows:
     · გამები — how a major or a minor scale is played on the panduri:
       every note of the scale on a real string and fret, with the
       finger that takes it, the sound, and the 3D hand;
     · აკორდი როგორ აიღო — every chord with its frets, its fingers,
       the teacher's rule and the same 3D hand.
   The positions are computed from the instrument's own tuning, so they
   stay true if the tuning or the fret count ever changes. Nothing is
   invented: the fingering is the plain position rule (one finger per
   fret), and the teacher's own rule is marked where it applies.
   ===================================================================== */
PD.i18n.add({
  'sh.scales': ['გამები ფანდურზე', 'Scales on the panduri'],
  'sh.scalesD': ['19 გამა — მაჟორიდან ბლუზურამდე: რომელ სიმზე, რომელ ლადზე და რომელი თითით.', '19 scales, from major to the blues — on which string, which fret and with which finger.'],
  'sh.chords': ['აკორდი როგორ აიღო', 'How to take a chord'],
  'sh.chordsD': ['თითოეული აკორდი: ლადები, თითები და 3D ხელი.', 'Every chord: the frets, the fingers and the 3D hand.'],
  'sh.root': ['ტონიკა', 'Root'],
  'sh.kind': ['გამა', 'Scale'],
  'sh.major': ['მაჟორი (იონიური)', 'Major (Ionian)'], 'sh.minor': ['ნატურალური მინორი (ეოლიური)', 'Natural minor (Aeolian)'],
  'sh.harm': ['ჰარმონიული მინორი', 'Harmonic minor'], 'sh.mel': ['მელოდიური მინორი', 'Melodic minor'],
  'sh.penta': ['მაჟორული პენტატონიკა', 'Major pentatonic'], 'sh.mpenta': ['მინორული პენტატონიკა', 'Minor pentatonic'],
  'sh.dorian': ['დორიული', 'Dorian'], 'sh.phrygian': ['ფრიგიული', 'Phrygian'], 'sh.lydian': ['ლიდიური', 'Lydian'],
  'sh.mixo': ['მიქსოლიდიური', 'Mixolydian'], 'sh.locrian': ['ლოკრიული', 'Locrian'],
  'sh.blues': ['მაჟორული ბლუზური', 'Major blues'], 'sh.mblues': ['ბლუზური (მინორული)', 'Blues (minor)'],
  'sh.whole': ['მთელტონიანი', 'Whole tone'], 'sh.dimwh': ['შემცირებული ტ–ნ', 'Diminished W–H'], 'sh.dimhw': ['შემცირებული ნ–ტ', 'Diminished H–W'],
  'sh.chrom': ['ქრომატული', 'Chromatic'],
  'sh.grp': ['ჯგუფი', 'Group'],
  'sh.g.base': ['მაჟორი და მინორი', 'Major & minor'], 'sh.g.mode': ['მოდუსები (7 კილო)', 'The modes'],
  'sh.g.penta': ['პენტატონიკა და ბლუზი', 'Pentatonic & blues'], 'sh.g.sym': ['სიმეტრიული', 'Symmetrical'],
  'sh.mode7': ['მოდუსები ერთი და იგივე შვიდი ნოტია, უბრალოდ სხვა ნოტიდან დათვლილი: დორიული = მაჟორი მე-2 საფეხურიდან, ფრიგიული — მე-3-დან და ასე შემდეგ. ამიტომ ჟღერს ყოველი სხვანაირად.', 'The modes are the same seven notes counted from a different one: Dorian is the major scale from its 2nd degree, Phrygian from the 3rd, and so on. That is why each has its own colour.'],
  'sh.symN': ['სიმეტრიულ გამებს ტონიკა სუსტად აქვს — ერთი და იგივე ნაბიჯი მეორდება, ამიტომ ყველა ნოტი თანაბრად ჟღერს. ჯაზში დომინანტ-აკორდებზე იყენებენ.', 'A symmetrical scale has a weak home note — the same step repeats, so every note weighs the same. In jazz they are used over dominant chords.'],
  'sh.bluesN': ['ბლუზური გამა = მინორული პენტატონიკა + ♭5 („ბლუზური ნოტი“). ფანდურზე ეს ნოტი ლადზე ზუსტად არის, ხმის „მოწევა“ (bend) კი ფანდურის ხერხი არ არის — მასწავლებლისგან ასეთი ხერხი ჩვენ არ გვაქვს.', 'The blues scale = the minor pentatonic plus the ♭5, the "blue note". On the panduri that note sits exactly on a fret; bending it is not a panduri technique — we have no such technique from the teacher.'],
  'sh.steps': ['ნაბიჯები: {s}', 'Steps: {s}'],
  'sh.notes': ['გამის ნოტები', 'The notes of the scale'],
  'sh.play': ['▶ მოსმენა (ზემოთ და ქვემოთ)', '▶ Listen (up and down)'],
  'sh.slow': ['▶ ნელა', '▶ Slowly'],
  'sh.where': ['{s} სიმი · {f}', '{s} string · {f}'],
  'sh.openF': ['ღია', 'open'], 'sh.fret': ['{n} ლადი', 'fret {n}'],
  'sh.finger': ['თითი {n}', 'finger {n}'], 'sh.fingerT': ['ცერა (T)', 'thumb (T)'], 'sh.open0': ['ღია სიმი (თითის გარეშე)', 'open string (no finger)'],
  'sh.tapNote': ['შეეხე ნოტს — გაიგონებ და 3D ხელში დაინახავ.', 'Tap a note — you hear it and see it in the 3D hand.'],
  'sh.capNote': ['{n} — {s}, {f}, {g}.', '{n} — {s}, {f}, {g}.'],
  'sh.capOpen': ['{n} — {s} ღიად ჟღერს, მარცხენა ხელი არ იჭერს.', '{n} — {s} rings open; the left hand holds nothing.'],
  'sh.rule': ['თითების წესი', 'The finger rule'],
  'sh.ruleD': ['ერთ პოზიციაში ერთი თითი — ერთი ლადი: ყველაზე დაბალ ლადზე 1-ლი თითი, შემდეგზე მე-2 და ასე შემდეგ. ღია სიმს თითი არ სჭირდება.', 'In one position each finger takes one fret: the first finger on the lowest fret, the second on the next, and so on. An open string needs no finger.'],
  'sh.posFrom': ['პოზიცია {n} ლადიდან', 'Position from fret {n}'],
  'sh.shift': ['↷ ნიშნავს, რომ ხელი ტარზე ზემოთ გადადის — ახალი პოზიცია.', '↷ means the hand moves up the neck — a new position.'],
  'sh.3d': ['3D ხელი', 'The 3D hand'],
  'sh.no3d': ['ამ ადგილისთვის 3D ხელი ჯერ არ არის — ბრტყელი სურათი ქვემოთაა.', 'No 3D hand for this place yet — the flat picture is below.'],
  'sh.cat': ['სახე', 'Type'],
  'sh.teacher': ['მასწავლებლის წესი', "The teacher's rule"],
  'sh.tRule': ['ბანს (მე-3 სიმს) ცერა თითი იჭერს. დაკეტილი აკორდი ორნაირად შეიძლება: T + საჩვენებელი ორ სიმზე, ან საჩვენებელი სამივე სიმზე.', 'The thumb holds the bass (string 3). A closed chord can be taken two ways: thumb plus index across two strings, or the index across all three.'],
  'sh.strum': ['▶ ჩამოკვრა', '▶ Strum'],
  'sh.openCh': ['ღია სიმები — თითი არ სჭირდება.', 'Open strings — no finger needed.'],
  'sh.more': ['სხვა პოზიციები', 'Other positions'],
  'sh.view1': ['წინიდან · სარკეში', 'From the front · mirrored'], 'sh.view2': ['შენი თვალით', 'Your own view']
});

PD.shapes = (() => {
  const h = PD.h, t = PD.i18n.t, TH = PD.theory, ic = PD.ic;
  const L = (ka, en) => PD.i18n.pick({ ka, en });
  const KA7 = ['დო', 'რე', 'მი', 'ფა', 'სოლ', 'ლა', 'სი'], LET7 = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const nLab = pc => TH.ROOT_NAMES[pc] + (PD.i18n.lang === 'ka' ? ' (' + TH.ROOT_NAMES_KA[pc] + ')' : '');
  const fLab = f => f === 0 ? t('sh.openF') : t('sh.fret', { n: f });
  /* Every scale here is its plain interval definition — the same one every music theory book gives.
     g = which group it is shown in; where a scale has a second standard name the name carries it
     (major = Ionian, natural minor = Aeolian). Nothing about panduri technique is invented: the
     positions and the fingers are computed from the instrument's own tuning by the rule below. */
  const SCALES = {
    major: { g: 'base', k: 'sh.major', iv: [0, 2, 4, 5, 7, 9, 11, 12], steps: ['ტ ტ ნ ტ ტ ტ ნ', 'T T S T T T S'] },
    minor: { g: 'base', k: 'sh.minor', iv: [0, 2, 3, 5, 7, 8, 10, 12], steps: ['ტ ნ ტ ტ ნ ტ ტ', 'T S T T S T T'] },
    harm: { g: 'base', k: 'sh.harm', iv: [0, 2, 3, 5, 7, 8, 11, 12], steps: ['ტ ნ ტ ტ ნ ტ+ნ ნ', 'T S T T S T+S S'] },
    mel: { g: 'base', k: 'sh.mel', iv: [0, 2, 3, 5, 7, 9, 11, 12], steps: ['ტ ნ ტ ტ ტ ტ ნ', 'T S T T T T S'] },
    ionian: { g: 'mode', k: 'sh.major', iv: [0, 2, 4, 5, 7, 9, 11, 12], steps: ['ტ ტ ნ ტ ტ ტ ნ', 'T T S T T T S'], deg: 1 },
    dorian: { g: 'mode', k: 'sh.dorian', iv: [0, 2, 3, 5, 7, 9, 10, 12], steps: ['ტ ნ ტ ტ ტ ნ ტ', 'T S T T T S T'], deg: 2 },
    phrygian: { g: 'mode', k: 'sh.phrygian', iv: [0, 1, 3, 5, 7, 8, 10, 12], steps: ['ნ ტ ტ ტ ნ ტ ტ', 'S T T T S T T'], deg: 3 },
    lydian: { g: 'mode', k: 'sh.lydian', iv: [0, 2, 4, 6, 7, 9, 11, 12], steps: ['ტ ტ ტ ნ ტ ტ ნ', 'T T T S T T S'], deg: 4 },
    mixo: { g: 'mode', k: 'sh.mixo', iv: [0, 2, 4, 5, 7, 9, 10, 12], steps: ['ტ ტ ნ ტ ტ ნ ტ', 'T T S T T S T'], deg: 5 },
    aeolian: { g: 'mode', k: 'sh.minor', iv: [0, 2, 3, 5, 7, 8, 10, 12], steps: ['ტ ნ ტ ტ ნ ტ ტ', 'T S T T S T T'], deg: 6 },
    locrian: { g: 'mode', k: 'sh.locrian', iv: [0, 1, 3, 5, 6, 8, 10, 12], steps: ['ნ ტ ტ ნ ტ ტ ტ', 'S T T S T T T'], deg: 7 },
    penta: { g: 'penta', k: 'sh.penta', iv: [0, 2, 4, 7, 9, 12], steps: ['ტ ტ ტ+ნ ტ ტ+ნ', 'T T T+S T T+S'] },
    mpenta: { g: 'penta', k: 'sh.mpenta', iv: [0, 3, 5, 7, 10, 12], steps: ['ტ+ნ ტ ტ ტ+ნ ტ', 'T+S T T T+S T'] },
    blues: { g: 'penta', k: 'sh.blues', iv: [0, 2, 3, 4, 7, 9, 12], steps: ['ტ ნ ნ ტ+ნ ტ ტ+ნ', 'T S S T+S T T+S'] },
    mblues: { g: 'penta', k: 'sh.mblues', iv: [0, 3, 5, 6, 7, 10, 12], steps: ['ტ+ნ ტ ნ ნ ტ+ნ ტ', 'T+S T S S T+S T'] },
    whole: { g: 'sym', k: 'sh.whole', iv: [0, 2, 4, 6, 8, 10, 12], steps: ['ტ ტ ტ ტ ტ ტ', 'T T T T T T'] },
    dimwh: { g: 'sym', k: 'sh.dimwh', iv: [0, 2, 3, 5, 6, 8, 9, 11, 12], steps: ['ტ ნ ტ ნ ტ ნ ტ ნ', 'T S T S T S T S'] },
    dimhw: { g: 'sym', k: 'sh.dimhw', iv: [0, 1, 3, 4, 6, 7, 9, 10, 12], steps: ['ნ ტ ნ ტ ნ ტ ნ ტ', 'S T S T S T S T'] },
    chrom: { g: 'sym', k: 'sh.chrom', iv: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], steps: ['ნ ნ ნ ნ ნ ნ ნ ნ ნ ნ ნ ნ', 'S S S S S S S S S S S S'] }
  };
  const GROUPS = [['base', 'sh.g.base'], ['mode', 'sh.g.mode'], ['penta', 'sh.g.penta'], ['sym', 'sh.g.sym']];
  const GNOTE = { mode: 'sh.mode7', penta: 'sh.bluesN', sym: 'sh.symN' };
  /** the scale across the three strings: each note on the nearest place above the last one,
      with the finger the hand takes it with; where the hand has to move up the neck the note
      is marked as a position change (that is how it is really played) */
  function scalePath(root, kind) {
    const iv = (SCALES[kind] || SCALES.major).iv, S = TH.STRINGS, F = TH.FRETS;
    /* The scale starts on the lowest string that can give the root — the bass, the teacher's
       "ban" — and not merely on the lowest fret. Starting on the thin string would trap the
       whole scale there (nothing is higher to cross to) and the hand would walk thirteen frets
       up one string instead of taking the scale across the three voices, which is how it is
       really played. */
    let s0 = 0, f0 = -1;
    for (let st = 1; st <= S && f0 < 0; st++) for (let f = 0; f <= F; f++) {
      if (TH.pc(TH.midi(st, f)) !== root % 12) continue;
      s0 = st; f0 = f; break;
    }
    if (f0 < 0) return null;
    /* The hand stands in one position — a window of four frets — and takes every note of the
       scale inside it, crossing from string to string, exactly as a position is played. The
       next note is always the nearest pitch up (so the scale stays a scale); among the places
       that give that pitch, one inside the window wins, an open string is free, and only when
       the window has nothing left does the hand move up the neck (marked ↷). */
    let base = f0 || 1;
    const notes = [{ s: s0, f: f0, m: TH.midi(s0, f0), base }];
    let lastM = notes[0].m;
    for (let i = 1; i < iv.length; i++) {
      const want = (root + iv[i]) % 12;
      let got = null;
      for (let st = 1; st <= S; st++) for (let f = 0; f <= F; f++) {
        const m = TH.midi(st, f);
        if (TH.pc(m) !== want || m <= lastM) continue;
        const open = f === 0, inWin = open || (f >= base && f <= base + 3);
        const score = (m - lastM) * 1000 + (inWin ? 0 : 500) + (open ? -2 : 0) + Math.abs(f - base);
        if (!got || score < got.score) got = { s: st, f, m, score, inWin };
      }
      if (!got) return null;
      if (!got.inWin) { got.shift = true; base = got.f; }
      got.base = base; lastM = got.m; notes.push(got);
    }
    // one finger per fret from where the hand stands; an open string needs no finger
    notes.forEach(n => { n.fi = n.f === 0 ? 0 : Math.max(1, Math.min(4, n.f - n.base + 1)); });
    notes.forEach(n => { n.name = nLab(TH.pc(n.m)); });
    const fr = notes.filter(n => n.f > 0).map(n => n.f);
    return { base: fr.length ? Math.min(...fr) : 0, notes, shifts: notes.filter(n => n.shift).length };
  }
  /** one 3D stage, shared by both pages */
  function stage3d(box, onReady) {
    const msg = h('p', { class: 'muted', 'data-t': 'ce.h3load' }), st = h('div', { class: 'sh-3d' });
    box.append(msg, st);
    // building the hand holds the thread for a moment, so it waits until the screen has slid in
    const start = () => (PD._h3p = PD._h3p || import(new URL('hand3d.js', document.baseURI).href)).then(mod => {
      if (!st.isConnected) return;
      if (!mod.mount(st)) { msg.textContent = t('r3.nogl'); return; }
      msg.remove(); onReady(mod);
    }).catch(() => { msg.textContent = t('r3.nogl'); });
    setTimeout(() => (window.requestIdleCallback ? requestIdleCallback(start, { timeout: 600 }) : start()), 520);
    return st;
  }

  /* ---------------- scales ---------------- */
  function scales(w, param) {
    let root = 9, kind = 'major';                       // A, as the panduri's own open chord
    if (param) { const [r, k] = String(param).split(':'); if (+r >= 0 && +r < 12) root = +r; if (SCALES[k]) kind = k; }
    let H3 = null, sel = 0, path = null, touched = false;
    w.append(h('div', { class: 'row pg-head' }, [h('button', { class: 'btn small backbtn', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('learn') }), h('h1', { 'data-t': 'sh.scales', style: 'margin:0' })]),
      h('p', { class: 'fg2', 'data-t': 'sh.scalesD' }));
    let grp = SCALES[kind].g;
    const roots = h('div', { class: 'chips-row' }), kinds = h('div', { class: 'chips-row' }), grps = h('div', { class: 'chips-row' });
    TH.ROOT_NAMES.forEach((n, i) => roots.append(h('button', { class: 'chip', 'aria-pressed': String(i === root), text: n, onclick: () => { root = i; redraw(); } })));
    GROUPS.forEach(([g, lab]) => grps.append(h('button', { class: 'chip', 'aria-pressed': String(g === grp), 'data-t': lab, onclick: () => { grp = g; kind = Object.keys(SCALES).find(k => SCALES[k].g === g); drawKinds(); redraw(); } })));
    const gnote = h('small', { class: 'muted' });
    function drawKinds() {
      kinds.innerHTML = '';
      Object.keys(SCALES).filter(k => SCALES[k].g === grp).forEach(k => kinds.append(h('button', { class: 'chip', 'aria-pressed': String(k === kind), text: (SCALES[k].deg ? SCALES[k].deg + '. ' : '') + t(SCALES[k].k), onclick: () => { kind = k; redraw(); } })));
      grps.querySelectorAll('.chip').forEach((b, i) => b.setAttribute('aria-pressed', String(GROUPS[i][0] === grp)));
      gnote.hidden = !GNOTE[grp]; if (GNOTE[grp]) gnote.textContent = t(GNOTE[grp]);
    }
    const head = h('div', { class: 'sh-head' }), notes = h('div', { class: 'sh-notes' }), box3 = h('section', { class: 'sh-box' }), cap = h('p', { class: 'sh-cap muted' }), foot = h('div', { class: 'sh-foot' });
    w.append(h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', 'data-t': 'sh.root' }), roots]),
      h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', 'data-t': 'sh.grp' }), grps]),
      h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', 'data-t': 'sh.kind' }), kinds]), gnote,
      head, box3, cap, notes, foot,
      h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', 'data-t': 'sh.rule' }), h('small', { class: 'muted', 'data-t': 'sh.ruleD' })]));
    stage3d(box3, mod => { H3 = mod; H3.setView('front'); show(sel); });
    function show(i) {
      sel = i; notes.querySelectorAll('.sh-n').forEach((x, k) => x.classList.toggle('on', k === i));
      const n = path && path.notes[i]; if (!n) return;
      PD.audio.ensure(); PD.audio.note(n.s, n.f);
      cap.textContent = n.f === 0
        ? t('sh.capOpen', { n: n.name, s: TH.stringName(n.s) })
        : t('sh.capNote', { n: n.name, s: TH.stringName(n.s), f: fLab(n.f), g: t('sh.finger', { n: n.fi }) });
      if (!H3) return;
      const fr = [0, 0, 0], fg = [0, 0, 0]; fr[n.s - 1] = n.f; fg[n.s - 1] = n.fi;
      const ok = n.f === 0 ? H3.setChord([0, 0, 0], [0, 0, 0]) : H3.setChord(fr, fg);
      box3.classList.toggle('no3d', !ok);
    }
    function redraw() {
      roots.querySelectorAll('.chip').forEach((b, i) => b.setAttribute('aria-pressed', String(i === root)));
      const ks = Object.keys(SCALES).filter(k => SCALES[k].g === grp);
      kinds.querySelectorAll('.chip').forEach((b, i) => b.setAttribute('aria-pressed', String(ks[i] === kind)));
      path = scalePath(root, kind);
      head.innerHTML = ''; notes.innerHTML = ''; foot.innerHTML = '';
      const SC = SCALES[kind];
      head.append(h('b', { text: nLab(root) + ' · ' + t(SC.k) }), h('small', { text: t('sh.steps', { s: L(SC.steps[0], SC.steps[1]) }) }));
      if (!path) { notes.append(h('p', { class: 'notice', 'data-t': 'ce.sh.noneD' })); PD.i18n.apply(w); return; }
      head.append(h('small', { class: 'muted', text: t('sh.posFrom', { n: path.base || 1 }) }));
      path.notes.forEach((n, i) => notes.append(h('button', { class: 'sh-n' + (i === sel ? ' on' : ''), onclick: () => { touched = true; show(i); } }, [
        h('b', { text: n.name }),
        h('small', { text: t('sh.where', { s: TH.stringName(n.s), f: fLab(n.f) }) }),

        h('small', { class: 'sh-fi', text: (n.shift ? '↷ ' : '') + (n.fi ? t('sh.finger', { n: n.fi }) : t('sh.open0')) })])));
      const seq = (rev, gap) => { PD.audio.ensure(); const c = PD.audio.ctx; if (!c) return; let t0 = c.currentTime + .06;
        const list = rev ? path.notes.concat(path.notes.slice(0, -1).reverse()) : path.notes;
        list.forEach(n => { PD.audio.note(n.s, n.f, { when: t0 }); t0 += gap; }); };
      foot.append(h('button', { class: 'btn primary', 'data-t': 'sh.play', onclick: () => seq(true, .38) }), h('button', { class: 'btn', 'data-t': 'sh.slow', onclick: () => seq(false, .7) }));
      foot.append(h('small', { class: 'muted', 'data-t': 'sh.tapNote' }));
      if (path.shifts) foot.append(h('small', { class: 'muted', 'data-t': 'sh.shift' }));
      PD.i18n.apply(w);
      // the hand is the point of this page, so a stopped note is shown first, not an open string
      if (!touched) { const k = path.notes.findIndex(n => n.f > 0); sel = k < 0 ? 0 : k; }
      show(Math.min(sel, path.notes.length - 1));
    }
    drawKinds(); redraw();
  }

  /* ---------------- how a chord is taken ---------------- */
  function chordHow(w, param) {
    const all = (PD.curriculum.chords() || []).filter(c => !c.none);
    let cat = 'major', cur = null, H3 = null, vi = 0;
    if (param) { const c = all.find(x => x.id === param || x.name === param); if (c) { cur = c; cat = c.cat || 'major'; } }
    w.append(h('div', { class: 'row pg-head' }, [h('button', { class: 'btn small backbtn', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('learn') }), h('h1', { 'data-t': 'sh.chords', style: 'margin:0' })]),
      h('p', { class: 'fg2', 'data-t': 'sh.chordsD' }));
    const CATS = [['major', 'ce.cat.major'], ['minor', 'ce.cat.minor'], ['seventh', 'ce.cat.seventh'], ['sus', 'ce.cat.sus'], ['other', 'ce.cat.other']];
    const cats = h('div', { class: 'chips-row' }), list = h('div', { class: 'sh-list' }), box = h('section', { class: 'sh-box' }), info = h('div', { class: 'sh-info' }), acts = h('div', { class: 'sh-foot' });
    CATS.forEach(([k, lab]) => cats.append(h('button', { class: 'chip', 'aria-pressed': String(k === cat), 'data-t': lab, onclick: () => { cat = k; drawList(); } })));
    w.append(h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', 'data-t': 'sh.cat' }), cats]), list, box, info, acts,
      h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', 'data-t': 'sh.teacher' }), h('small', { class: 'muted', 'data-t': 'sh.tRule' })]));
    stage3d(box, mod => { H3 = mod; H3.setView('front'); if (cur) pick(cur, vi); });
    function drawList() {
      cats.querySelectorAll('.chip').forEach((b, i) => b.setAttribute('aria-pressed', String(CATS[i][0] === cat)));
      list.innerHTML = '';
      all.filter(c => (c.cat || 'other') === cat).forEach(c => list.append(h('button', { class: 'chip' + (cur && cur.id === c.id ? ' on' : ''), text: c.name, onclick: () => pick(c, 0) })));
      PD.i18n.apply(list);
    }
    function pick(c, i) {
      cur = c; vi = i || 0;
      const vs = c.voicings && c.voicings.length ? c.voicings : [{ frets: c.frets, fingers: c.fingers }];
      const v = vs[Math.min(vi, vs.length - 1)];
      drawList();
      info.innerHTML = ''; acts.innerHTML = '';
      info.append(h('b', { text: c.name + ' · ' + (c.ka ? PD.i18n.pick({ ka: c.ka, en: c.name + ' ' + (c.typeEn || '') }) : '') }),
        h('div', { class: 'sh-frets', text: v.frets.map(f => f === 0 ? '0' : f).join(' · ') }));
      const FN = { 1: ['საჩვენებელი', 'index'], 2: ['შუა', 'middle'], 3: ['არათითი', 'ring'], 4: ['ნეკი', 'little'], T: ['ცერა', 'thumb'] };
      const rows = h('div', { class: 'sh-rows' });
      v.frets.forEach((f, k) => {
        const s = k + 1, fi = (v.fingers || [])[k];
        rows.append(h('div', { class: 'sh-row' }, [
          h('span', { class: 'sh-dot' + (f ? '' : ' open'), text: fi ? String(fi) : '0' }),
          h('small', { text: TH.stringName(s) + ' · ' + fLab(f) + (fi ? ' · ' + (fi === 'T' ? t('sh.fingerT') : t('sh.finger', { n: fi })) : ' · ' + t('sh.open0')) })]));
      });
      info.append(rows);
      if (vs.length > 1) { const row = h('div', { class: 'chips-row' });
        vs.forEach((x, k) => row.append(h('button', { class: 'chip' + (k === vi ? ' on' : ''), text: t('sh.fret', { n: Math.max(...x.frets) ? Math.min(...x.frets.filter(f => f > 0)) : 0 }), onclick: () => pick(c, k) })));
        info.append(h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', 'data-t': 'sh.more' }), row])); }
      acts.append(h('button', { class: 'btn primary', 'data-t': 'sh.strum', onclick: () => { PD.audio.ensure(); PD.audio.strum(v.frets, 'down', { gap: .03 }); } }),
        h('button', { class: 'btn', text: t('ce.title'), onclick: () => PD.app.go('chords', c.id) }));
      if (H3) { const ok = H3.setChord(v.frets, v.fingers || []); box.classList.toggle('no3d', !ok); if (!ok) info.append(h('p', { class: 'notice', 'data-t': 'sh.no3d' })); }
      PD.i18n.apply(w);
    }
    drawList();
    if (!cur) { const first = all.find(c => (c.cat || 'other') === cat); if (first) pick(first, 0); }
  }

  /** a ready-made 3D hand for any other page. Returns { box, set(frets, fingers) }; the hand
      loads on its own and the box dims when a position has no solved pose. */
  function handBox(opt) {
    const o = opt || {}, box = h('section', { class: 'sh-box' + (o.cls ? ' ' + o.cls : '') });
    let H3 = null, want = o.frets ? [o.frets, o.fingers || []] : null;
    stage3d(box, mod => { H3 = mod; mod.setView(o.view || 'front'); if (want) apply(); });
    function apply() { const ok = H3.setChord(want[0], want[1]); box.classList.toggle('no3d', !ok); return ok; }
    return { box, set(frets, fingers) { want = [frets, fingers || []]; return H3 ? apply() : null; } };
  }

  /** the finger a single note is taken with: first position uses one finger per fret, higher up
      the hand moves and the index stands on the note (the teacher's own rule for fingers 1–4). */
  function noteFinger(f) { return f <= 0 ? 0 : f <= 4 ? f : 1; }

  return { scales, chordHow, scalePath, SCALES, handBox, noteFinger };
})();
