/* =====================================================================
   Tips & tricks — short, simplified learning cards, each with a small
   animation (or a photo of the teacher's own panduri) and a "try it" link
   into the app.
   Every card says where its content comes from:
     fact    – from the app's own data: the instrument profile, the
               teacher's song data, music theory
     general – general practice advice for any fretted string instrument
     draft   – panduri technique written for the app, NOT yet checked by the
               teacher (shown as "for the teacher to check")
   The teacher can approve, edit, hide or add cards in Author Studio
   (stored as overrides; the built-in text stays as the fallback).
   ===================================================================== */
PD.i18n.add({
  'tp.title': ['ხრიკები და რჩევები', 'Tips & tricks'], 'tp.lead': ['მოკლედ და მარტივად: როგორ დაიჭირო, დააჭირო, ჩამოკრა, ივარჯიშო. ყველა ბარათს თავისი ანიმაცია აქვს.', 'Short and simple: how to hold, press, strum and practise. Every card has its own animation.'],
  'tp.all': ['ყველა', 'All'], 'tp.try': ['სცადე', 'Try it'], 'tp.steps': ['როგორ', 'How'], 'tp.why': ['რატომ', 'Why'], 'tp.more': ['ყველა რჩევა', 'All tips'],
  'tp.src.fact': ['შენი ფანდურიდან და აპის მონაცემებიდან', 'From your panduri and the app\'s data'], 'tp.src.general': ['ზოგადი რჩევა სიმიანი ინსტრუმენტისთვის', 'General advice for string instruments'],
  'tp.src.draft': ['მასწავლებელმა უნდა შეამოწმოს', 'For the teacher to check'], 'tp.src.teacher': ['მასწავლებლის დამოწმებული', 'Checked by the teacher'],
  'tp.c.inst': ['ინსტრუმენტი', 'Instrument'], 'tp.c.left': ['მარცხენა ხელი', 'Left hand'], 'tp.c.right': ['მარჯვენა ხელი', 'Right hand'], 'tp.c.chords': ['აკორდები', 'Chords'], 'tp.c.rhythm': ['რიტმი', 'Rhythm'], 'tp.c.practice': ['ვარჯიში', 'Practice'], 'tp.c.ear': ['სმენა და თეორია', 'Ear & theory'],
  'tp.listen': ['▶ მოსმენა', '▶ Listen'], 'tp.again': ['↻ თავიდან', '↻ Again'], 'tp.tap': ['შეეხე ნომერს — რა არის ეს ნაწილი', 'Tap a number to see what that part is'],
  'tp.ph.front': ['შენი ფანდური — წინიდან', 'Your panduri — from the front'], 'tp.ph.head': ['თავი: ღია ჭრილი, სამი ღერძი და მექანიკები (2 + 1)', 'Headstock: an open slot, three rollers and the tuners (2 + 1)'], 'tp.ph.body': ['დეკა, სახმო ხვრელი 26 პატარა ხვრელის წრით და ხიდი', 'Soundboard, the sound hole with its ring of 26 small holes, and the bridge'],
  'tp.edit': ['რჩევები და ხრიკები', 'Tips & tricks'], 'tp.editD': ['ყოველი ბარათი: დაამოწმე, შეასწორე ან დამალე. ახალი ბარათიც შეგიძლია დაამატო. ჩაშენებული ტექსტი რჩება სარეზერვოდ.', 'For every card: approve, correct or hide it. You can add new cards too. The built-in text stays as a fallback.'],
  'tp.ok': ['დამოწმებულია', 'Approved'], 'tp.hide': ['დამალვა', 'Hide'], 'tp.save': ['შენახვა', 'Save'], 'tp.reset': ['ჩაშენებულზე დაბრუნება', 'Back to built-in'], 'tp.add': ['+ ახალი ბარათი', '+ New card'], 'tp.newT': ['ახალი რჩევა', 'New tip'],
  'tp.fTitle': ['სათაური', 'Title'], 'tp.fShort': ['მოკლედ', 'In short'], 'tp.fSteps': ['ნაბიჯები (თითო ხაზზე)', 'Steps (one per line)'], 'tp.fWhy': ['რატომ', 'Why'], 'tp.lib': ['ბიბლიოთეკა', 'Library'], 'tp.parts': ['გაიცანი შენი ფანდური', 'Meet your panduri'], 'tp.partsD': ['ფოტოები და ნაწილების სახელები', 'Photos and the names of the parts']
});

/* the part names and descriptions (also in three3d.js, which loads only with the 3D view) */
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
  'pi.tuners': ['სამი კბილანიანი მექანიკა, 2 + 1: C♯ და A ერთ მხარეს, E — მეორეზე.', 'Three geared tuners, 2 + 1: C♯ and A on one side, E on the other.']
});
PD.tips = (() => {
  const h = PD.h, t = PD.i18n.t, L = a => PD.i18n.pick(Array.isArray(a) ? { ka: a[0], en: a[1] } : a);
  const M = () => !(PD.ui && PD.ui.motion && !PD.ui.motion());

  /* ---------------- small animated pictures (SVG; SMIL animation, still when motion is reduced) ---------------- */
  const C = { board: '#7A472B', board2: '#5E3420', fret: '#E2C487', dot: '#F2CE3A', str: '#E8E1D8', ink: '#F4EFE9', acc: '#FF6B5B', ok: '#8EF0B4', dim: 'rgba(255,240,228,.45)', sA: '#D9783F', sC: '#78B7DE', sE: '#EFE0B8' };
  const fcol = fi => (PD.fingers && PD.fingers.on && fi ? PD.fingers.color(fi) : '#E8574A');
  const svg = (w, hh, body) => '<svg viewBox="0 0 ' + w + ' ' + hh + '" role="img" aria-hidden="true" class="tp-svg">' + body + '</svg>';
  /** show element i of n in turn (each for 1/n of the loop) */
  const turn = (i, n, dur) => { if (!M()) return ''; const a = i / n, b = (i + 1) / n, e = .02; const kt = [0, Math.max(0, a - e), a, Math.min(1, b - e), b, 1].map(x => +x.toFixed(4)); return '<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="' + kt.join(';') + '" dur="' + dur + 's" repeatCount="indefinite"/>'; };
  const pulse = (dur, from, to, attr) => M() ? '<animate attributeName="' + (attr || 'r') + '" values="' + from + ';' + to + ';' + from + '" dur="' + dur + 's" repeatCount="indefinite"/>' : '';
  const ET = n => 1 - Math.pow(2, -n / 12);
  /** a short neck: frets 0..F, strings E (top) · C♯ · A (bottom), real fret proportions */
  function neck(F, w, opts) {
    opts = opts || {}; const x0 = 34, x1 = w - 10, top = 22, bot = 98, sy = { 3: 36, 2: 60, 1: 84 };
    const fx = n => x0 + (x1 - x0) * ET(n) / ET(F);
    let s = '<rect x="' + x0 + '" y="' + top + '" width="' + (x1 - x0) + '" height="' + (bot - top) + '" rx="4" fill="' + C.board + '"/>';
    s += '<rect x="' + x0 + '" y="' + top + '" width="' + (x1 - x0) + '" height="' + (bot - top) * .35 + '" rx="4" fill="rgba(255,240,228,.06)"/>';
    s += '<rect x="' + (x0 - 5) + '" y="' + (top - 2) + '" width="5" height="' + (bot - top + 4) + '" rx="1.5" fill="#E2DAD0"/>';
    const mk = (PD.geom && PD.geom.g.markers) || { single: [3, 5, 7, 9, 15], double: [12] };
    for (let n = 1; n <= F; n++) {
      const cx = (fx(n - 1) + fx(n)) / 2;
      if ((mk.single || []).includes(n) && opts.dots !== false) s += '<circle cx="' + cx + '" cy="60" r="3.2" fill="' + C.dot + '"/>';
      if ((mk.double || []).includes(n) && opts.dots !== false) s += '<circle cx="' + cx + '" cy="47" r="3.2" fill="' + C.dot + '"/><circle cx="' + cx + '" cy="73" r="3.2" fill="' + C.dot + '"/>';
      s += '<rect x="' + (fx(n) - 1.3) + '" y="' + top + '" width="2.6" height="' + (bot - top) + '" fill="' + C.fret + '"/>';
      if (opts.nums) s += '<text x="' + cx + '" y="' + (bot + 14) + '" class="tp-num">' + n + '</text>';
    }
    [3, 2, 1].forEach(k => { s += '<line x1="' + (x0 - 6) + '" y1="' + sy[k] + '" x2="' + x1 + '" y2="' + sy[k] + '" stroke="' + C.str + '" stroke-width="' + (k === 1 ? 2.2 : k === 2 ? 1.9 : 1.6) + '" opacity=".9"/>'; });
    if (opts.labels !== false) [[3, 'E', C.sE], [2, 'C♯', C.sC], [1, 'A', C.sA]].forEach(([k, l, c]) => { s += '<circle cx="15" cy="' + sy[k] + '" r="9.5" fill="#100E0D" stroke="' + c + '" stroke-width="1.5"/><text x="15" y="' + (sy[k] + .5) + '" class="tp-lab" fill="' + c + '">' + l + '</text>'; });
    const contact = n => n <= 0 ? x0 - 14 : fx(n) - Math.min(9, (fx(n) - fx(n - 1)) * .3);
    return { s, fx, sy, contact, x0, x1, top, bot };
  }
  const finger = (x, y, fi, r, extra) => '<g' + (extra || '') + '><circle cx="' + x + '" cy="' + y + '" r="' + (r || 10) + '" fill="' + fcol(fi) + '" stroke="rgba(255,255,255,.6)" stroke-width="1.4"/>' + (fi ? '<text x="' + x + '" y="' + (y + .5) + '" class="tp-fi">' + fi + '</text>' : '') + '</g>';
  /** a chord shape on a short neck: frets [A, C♯, E] and fingers; a barre is drawn as one bar */
  function shape(N, frets, fingers, extra) {
    let s = ''; const groups = {};
    frets.forEach((f, k) => { if (f > 0 && fingers[k]) (groups[fingers[k] + ':' + f] = groups[fingers[k] + ':' + f] || []).push(k + 1); });
    const done = {};
    frets.forEach((f, k) => {
      const st = k + 1;
      if (f <= 0) { s += '<g' + (extra || '') + '><circle cx="' + (N.x0 - 14) + '" cy="' + N.sy[st] + '" r="7.5" fill="#F4F2EE"/><text x="' + (N.x0 - 14) + '" y="' + (N.sy[st] + .5) + '" class="tp-fi" fill="#121317">0</text></g>'; return; }
      const key = fingers[k] + ':' + f, g = groups[key];
      if (g && g.length > 1) { if (done[key]) return; done[key] = 1; const ys = g.map(q => N.sy[q]), y0 = Math.min(...ys), y1 = Math.max(...ys), x = N.contact(f); s += '<g' + (extra || '') + '><rect x="' + (x - 9) + '" y="' + (y0 - 10) + '" width="18" height="' + (y1 - y0 + 20) + '" rx="9" fill="' + fcol(fingers[k]) + '" stroke="rgba(255,255,255,.6)" stroke-width="1.4"/><text x="' + x + '" y="' + ((y0 + y1) / 2 + .5) + '" class="tp-fi">' + fingers[k] + '</text></g>'; return; }
      s += finger(N.contact(f), N.sy[st], fingers[k], 10, extra);
    });
    return s;
  }
  const arrow = (x, y, up, size, col, w) => { const d = up ? -1 : 1, hy = y + d * size, ty = y - d * size; return '<path d="M' + x + ' ' + ty + 'V' + hy + 'M' + (x - size * .55) + ' ' + (hy - d * size * .55) + 'L' + x + ' ' + hy + 'L' + (x + size * .55) + ' ' + (hy - d * size * .55) + '" fill="none" stroke="' + col + '" stroke-width="' + (w || 3) + '" stroke-linecap="round" stroke-linejoin="round"/>'; };
  const song = () => (PD.SONGS || {})['bani-acharuli'] || {};
  const sh = n => (song().chords || {})[n];

  const ART = {
    /** where the fingertip goes: on the fret ✗ · mid-cell ~ · just behind the fret ✓ */
    fretpos() {
      const N = neck(4, 320, { labels: false, dots: false }), y = N.sy[2], f = 2, xs = [N.fx(f), (N.fx(f - 1) + N.fx(f)) / 2, N.contact(f)], lab = ['✗', '~', '✓'], col = [C.acc, '#FFD27A', C.ok];
      let s = N.s; xs.forEach((x, i) => { s += '<g opacity="' + (M() ? 0 : i === 2 ? 1 : 0) + '">' + turn(i, 3, 4.2) + finger(x, y, 1, 11) + '<text x="' + x + '" y="' + (y - 22) + '" class="tp-big" fill="' + col[i] + '">' + lab[i] + '</text></g>'; });
      return svg(320, 120, s);
    },
    /** a curved finger touches one string; a flat one also mutes the next */
    curve() {
      let s = '<rect x="10" y="78" width="300" height="16" rx="4" fill="' + C.board + '"/>';
      [70, 110, 150].forEach(x => { s += '<circle cx="' + x + '" cy="74" r="4" fill="' + C.str + '"/>'; });
      const good = '<path d="M110 70 C 112 40, 150 22, 200 18 L 300 16" fill="none" stroke="#FFC98A" stroke-width="18" stroke-linecap="round"/><text x="250" y="52" class="tp-big" fill="' + C.ok + '">✓</text>';
      const bad = '<path d="M70 66 L 150 64 C 200 60, 240 30, 300 22" fill="none" stroke="#FFC98A" stroke-width="18" stroke-linecap="round"/><text x="250" y="52" class="tp-big" fill="' + C.acc + '">✗</text>';
      s += '<g>' + turn(0, 2, 3.6) + good + '</g><g opacity="' + (M() ? 0 : 0) + '">' + turn(1, 2, 3.6) + bad + '</g>';
      return svg(320, 110, s);
    },
    /** barre: one finger flat over two strings (Dm on the teacher's chart) */
    barre() {
      const d = sh('Dm') || { frets: [0, 1, 1], fingers: [0, 1, 1] }, N = neck(4, 320, { dots: false }), x = N.contact(1), y0 = N.sy[3], y1 = N.sy[2];
      let s = N.s + '<circle cx="' + (N.x0 - 14) + '" cy="' + N.sy[1] + '" r="7.5" fill="#F4F2EE"/><text x="' + (N.x0 - 14) + '" y="' + (N.sy[1] + .5) + '" class="tp-fi" fill="#121317">0</text>';
      s += '<rect x="' + (x - 9) + '" y="' + (y0 - 10) + '" width="18" rx="9" height="' + (y1 - y0 + 20) + '" fill="' + fcol(1) + '" stroke="rgba(255,255,255,.6)" stroke-width="1.4">' + (M() ? '<animate attributeName="height" values="20;20;' + (y1 - y0 + 20) + ';' + (y1 - y0 + 20) + ';20" keyTimes="0;.15;.4;.85;1" dur="3s" repeatCount="indefinite"/>' : '') + '</rect>';
      s += '<text x="' + x + '" y="' + (y0 + .5) + '" class="tp-fi">1</text><text x="' + (N.x1 - 4) + '" y="16" class="tp-cap" text-anchor="end">Dm · ' + d.frets.join('-') + '</text>';
      return svg(320, 120, s);
    },
    /** the song's chord changes, one after another (Dm → B♭ → C) */
    change() {
      const names = (song().cycle || ['Dm', 'B♭', 'C']).filter((c, i, a) => a.indexOf(c) === i), N = neck(5, 320, { dots: false }), n = names.length;
      let s = N.s;
      names.forEach((c, i) => { const d = sh(c); if (!d) return; s += '<g opacity="' + (M() ? 0 : i === 0 ? 1 : 0) + '">' + turn(i, n, n * 1.6) + shape(N, d.frets, d.fingers) + '<text x="' + (N.x1 - 4) + '" y="16" class="tp-cap" text-anchor="end">' + c + (i < n - 1 ? ' → ' + names[i + 1] : ' → ' + names[0]) + '</text></g>'; });
      return svg(320, 120, s);
    },
    /** one rhythm: ↓ ↓ ↑ with the accents of the teacher's pattern */
    strum() {
      const acc = [false, true, true], xs = [80, 160, 240]; let s = '';
      [44, 60, 76].forEach(y => { s += '<line x1="40" y1="' + y + '" x2="280" y2="' + y + '" stroke="rgba(255,240,228,.25)" stroke-width="1.5"/>'; });
      xs.forEach((x, i) => { const up = i === 2, col = acc[i] ? C.acc : C.ink; s += '<g opacity=".35">' + arrow(x, 60, up, 22, col, acc[i] ? 4.5 : 3) + '</g><g opacity="' + (M() ? 0 : 1) + '">' + turn(i, 3, 1.8) + '<circle cx="' + x + '" cy="60" r="30" fill="rgba(255,240,228,.1)"/>' + arrow(x, 60, up, 25, col, acc[i] ? 5 : 3.4) + '</g><text x="' + x + '" y="108" class="tp-cap">' + (up ? L(['ამოკვრა', 'up']) : L(['ჩაკვრა', 'down'])) + '</text>'; });
      return svg(320, 118, s);
    },
    /** tuning: each string's needle settles in the middle and turns green */
    tune() {
      let s = '';
      [['A', C.sA, 60], ['C♯', C.sC, 160], ['E', C.sE, 260]].forEach(([l, c, x], i) => {
        s += '<path d="M' + (x - 36) + ' 70 A 36 36 0 0 1 ' + (x + 36) + ' 70" fill="none" stroke="rgba(255,240,228,.18)" stroke-width="6" stroke-linecap="round"/><line x1="' + x + '" y1="30" x2="' + x + '" y2="38" stroke="' + C.ok + '" stroke-width="2"/>';
        s += '<g><line x1="' + x + '" y1="70" x2="' + x + '" y2="38" stroke="' + C.ink + '" stroke-width="3" stroke-linecap="round">' + (M() ? '<animateTransform attributeName="transform" type="rotate" values="-38 ' + x + ' 70;18 ' + x + ' 70;-8 ' + x + ' 70;3 ' + x + ' 70;0 ' + x + ' 70;0 ' + x + ' 70" keyTimes="0;.2;.4;.55;.7;1" dur="3.4s" begin="' + (i * .4) + 's" repeatCount="indefinite"/>' : '') + '</line></g>';
        s += '<circle cx="' + x + '" cy="70" r="5" fill="' + C.ink + '"/><circle cx="' + x + '" cy="96" r="12" fill="#100E0D" stroke="' + c + '" stroke-width="1.6"/><text x="' + x + '" y="96.5" class="tp-lab" fill="' + c + '">' + l + '</text>';
      });
      return svg(320, 116, s);
    },
    /** the inlay dots light up in order: 3 · 5 · 7 · 9 · 12 · 15 */
    dots() {
      const N = neck(17, 320, { labels: false, nums: true }), mk = (PD.geom && PD.geom.g.markers) || { single: [3, 5, 7, 9, 15], double: [12] }, all = [].concat(mk.single || [], mk.double || []).sort((a, b) => a - b);
      let s = N.s; all.forEach((n, i) => { const cx = (N.fx(n - 1) + N.fx(n)) / 2; s += '<g opacity="' + (M() ? 0 : .9) + '">' + turn(i, all.length, all.length * .7) + '<circle cx="' + cx + '" cy="60" r="11" fill="none" stroke="' + C.dot + '" stroke-width="2.4"/><text x="' + cx + '" y="14" class="tp-cap" fill="' + C.dot + '">' + n + '</text></g>'; });
      return svg(320, 120, s);
    },
    /** every fret = one semitone: a fingertip walks up the A string */
    semitone() {
      const N = neck(12, 320, { nums: true }), names = ['A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A'];
      let s = N.s; names.forEach((nm, f) => { s += '<g opacity="' + (M() ? 0 : f === 0 ? 1 : 0) + '">' + turn(f, 13, 13 * .55) + finger(N.contact(f), N.sy[1], f ? 1 : 0, 9) + '<text x="' + N.contact(f) + '" y="14" class="tp-cap" fill="#FFE2BA">' + nm + '</text></g>'; });
      return svg(320, 120, s);
    },
    /** the 12th fret: the same note an octave higher */
    octave() {
      const N = neck(12, 320, { nums: true }); let s = N.s;
      s += '<g>' + turn(0, 2, 2.6) + '<circle cx="' + (N.x0 - 14) + '" cy="' + N.sy[1] + '" r="9" fill="#F4F2EE"/><text x="' + (N.x0 - 14) + '" y="' + (N.sy[1] + .5) + '" class="tp-fi" fill="#121317">0</text><text x="60" y="14" class="tp-cap" fill="#FFE2BA">A3</text></g>';
      s += '<g opacity="' + (M() ? 0 : 1) + '">' + turn(1, 2, 2.6) + finger(N.contact(12), N.sy[1], 1, 9) + '<text x="' + N.contact(12) + '" y="14" class="tp-cap" fill="#FFE2BA">A4 = A3 × 2</text></g>';
      return svg(320, 120, s);
    },
    /** slow first: the tempo steps up only after clean repeats */
    tempo() {
      const st = [60, 70, 80, 90, 100]; let s = '';
      st.forEach((v, i) => { const x = 30 + i * 56, hh = 20 + i * 14; s += '<rect x="' + x + '" y="' + (96 - hh) + '" width="44" height="' + hh + '" rx="6" fill="rgba(201,139,91,.18)" stroke="rgba(201,139,91,.5)"/><text x="' + (x + 22) + '" y="110" class="tp-cap">' + v + '%</text>'; s += '<g opacity="' + (M() ? 0 : 1) + '">' + turn(i, 5, 6) + '<rect x="' + x + '" y="' + (96 - hh) + '" width="44" height="' + hh + '" rx="6" fill="#C98B5B"/><text x="' + (x + 22) + '" y="' + (90 - hh) + '" class="tp-cap" fill="' + C.ok + '">✓✓✓</text></g>'; });
      return svg(320, 118, s);
    },
    /** count aloud: 1 · and · 2 · and with a pulsing beat */
    count() {
      const w = ['1', L(['და', 'and']), '2', L(['და', 'and'])]; let s = '';
      w.forEach((x, i) => { const cx = 50 + i * 74, big = i % 2 === 0; s += '<circle cx="' + cx + '" cy="52" r="' + (big ? 20 : 13) + '" fill="rgba(201,139,91,.15)"/><g opacity="' + (M() ? 0 : 1) + '">' + turn(i, 4, 2) + '<circle cx="' + cx + '" cy="52" r="' + (big ? 22 : 15) + '" fill="#C98B5B"/></g><text x="' + cx + '" y="53" class="tp-big" fill="#F4EFE9" style="font-size:' + (big ? 18 : 13) + 'px">' + x + '</text>'; });
      return svg(320, 100, s);
    },
    /** a little every day */
    daily() {
      let s = ''; const d = L(['ორ სა ოთ ხუ პა შა კვ', 'Mo Tu We Th Fr Sa Su']).split(' ');
      d.forEach((x, i) => { const cx = 30 + i * 43; s += '<rect x="' + (cx - 17) + '" y="30" width="34" height="40" rx="8" fill="rgba(255,240,228,.06)" stroke="rgba(255,240,228,.18)"/><g opacity="' + (M() ? 0 : 1) + '">' + (M() ? '<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;' + (i / 7).toFixed(3) + ';' + ((i + .5) / 7).toFixed(3) + ';1" dur="5s" repeatCount="indefinite"/>' : '') + '<rect x="' + (cx - 17) + '" y="30" width="34" height="40" rx="8" fill="rgba(142,240,180,.18)" stroke="' + C.ok + '"/><text x="' + cx + '" y="52" class="tp-cap" fill="' + C.ok + '">15′</text></g><text x="' + cx + '" y="88" class="tp-cap">' + x + '</text>'; });
      return svg(320, 100, s);
    },
    /** listen before you play */
    listen() {
      let s = '<path d="M120 70 V58 a40 40 0 0 1 80 0 V70" fill="none" stroke="' + C.ink + '" stroke-width="5" stroke-linecap="round"/><rect x="108" y="64" width="22" height="30" rx="8" fill="#C98B5B"/><rect x="190" y="64" width="22" height="30" rx="8" fill="#C98B5B"/>';
      [0, 1, 2].forEach(i => { s += '<circle cx="160" cy="80" r="20" fill="none" stroke="rgba(201,139,91,.6)" stroke-width="2">' + (M() ? '<animate attributeName="r" values="20;70" dur="2.4s" begin="' + (i * .8) + 's" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0" dur="2.4s" begin="' + (i * .8) + 's" repeatCount="indefinite"/>' : '') + '</circle>'; });
      return svg(320, 110, s);
    },
    /** loop only the hard part */
    loop() {
      let s = '<rect x="20" y="52" width="280" height="10" rx="5" fill="rgba(255,240,228,.12)"/><rect x="130" y="52" width="80" height="10" rx="5" fill="#C98B5B"/>';
      s += '<path d="M130 44 C 130 14, 210 14, 210 44" fill="none" stroke="#C98B5B" stroke-width="3" stroke-dasharray="6 5"/><path d="M204 38 L210 46 L216 38" fill="none" stroke="#C98B5B" stroke-width="3" stroke-linecap="round"/>';
      s += '<circle cx="130" cy="57" r="8" fill="' + C.ink + '">' + (M() ? '<animate attributeName="cx" values="130;210" dur="1.6s" repeatCount="indefinite"/>' : '') + '</circle><text x="170" y="88" class="tp-cap">' + L(['მხოლოდ რთული ადგილი, ბევრჯერ', 'only the hard spot, many times']) + '</text>';
      return svg(320, 100, s);
    },
    /** press only as hard as needed */
    press() {
      let s = '<path d="M60 90 A 100 100 0 0 1 260 90" fill="none" stroke="rgba(255,240,228,.14)" stroke-width="14" stroke-linecap="round"/><path d="M60 90 A 100 100 0 0 1 120 30" fill="none" stroke="rgba(255,138,125,.55)" stroke-width="14" stroke-linecap="round"/><path d="M135 22 A 100 100 0 0 1 190 22" fill="none" stroke="rgba(142,240,180,.6)" stroke-width="14" stroke-linecap="round"/><path d="M205 28 A 100 100 0 0 1 260 90" fill="none" stroke="rgba(255,138,125,.55)" stroke-width="14" stroke-linecap="round"/>';
      s += '<text x="75" y="108" class="tp-cap">' + L(['ზუზუნი', 'buzz']) + '</text><text x="160" y="56" class="tp-cap" fill="' + C.ok + '">' + L(['საკმარისი', 'enough']) + '</text><text x="248" y="108" class="tp-cap">' + L(['ზედმეტი', 'too hard']) + '</text>';
      s += '<line x1="160" y1="96" x2="160" y2="30" stroke="' + C.ink + '" stroke-width="4" stroke-linecap="round">' + (M() ? '<animateTransform attributeName="transform" type="rotate" values="62 160 96;62 160 96;-50 160 96;-4 160 96;-4 160 96" keyTimes="0;.1;.4;.7;1" dur="3.6s" repeatCount="indefinite"/>' : '<animateTransform attributeName="transform" type="rotate" values="-4 160 96" dur="1s" fill="freeze"/>') + '</line><circle cx="160" cy="96" r="7" fill="' + C.ink + '"/>';
      return svg(320, 118, s);
    },
    /** a loose wrist swings like a pendulum, also on the silent beats */
    wrist() {
      let s = '<path d="M90 30 A 90 90 0 0 0 230 30" fill="none" stroke="rgba(255,240,228,.2)" stroke-width="2" stroke-dasharray="4 6"/><circle cx="160" cy="10" r="6" fill="#C98B5B"/>';
      s += '<g>' + (M() ? '<animateTransform attributeName="transform" type="rotate" values="-32 160 10;32 160 10;-32 160 10" dur="1.5s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>' : '') + '<line x1="160" y1="10" x2="160" y2="88" stroke="#FFC98A" stroke-width="10" stroke-linecap="round"/><circle cx="160" cy="96" r="11" fill="#FFC98A"/></g>';
      return svg(320, 118, s);
    },
    /** where the strings are struck: between the end of the fingerboard and the sound hole */
    zone() {
      let s = '<path d="M20 52 H150 C 180 52, 200 18, 250 14 H310 V106 H250 C 200 102, 180 68, 150 68 H20 Z" fill="#E2C99A"/><rect x="20" y="52" width="140" height="16" fill="' + C.board + '"/><path d="M160 52 q 12 8 0 16 Z" fill="' + C.board + '"/>';
      s += '<circle cx="262" cy="60" r="20" fill="#1C1917"/>'; for (let k = 0; k < 18; k++) { const a = k / 18 * Math.PI * 2; s += '<circle cx="' + (262 + Math.cos(a) * 30).toFixed(1) + '" cy="' + (60 + Math.sin(a) * 30).toFixed(1) + '" r="2.4" fill="#1C1917"/>'; }
      [55, 60, 65].forEach(y => { s += '<line x1="20" y1="' + y + '" x2="310" y2="' + y + '" stroke="' + C.str + '" stroke-width="1.2"/>'; });
      s += '<rect x="176" y="40" width="44" height="40" rx="8" fill="rgba(142,240,180,.18)" stroke="' + C.ok + '" stroke-width="2">' + (M() ? '<animate attributeName="opacity" values=".4;1;.4" dur="1.6s" repeatCount="indefinite"/>' : '') + '</rect><text x="198" y="96" class="tp-cap" fill="' + C.ok + '">' + L(['აქ', 'here']) + '</text>';
      return svg(320, 118, s);
    },
    /** record and listen back */
    record() {
      let s = '<rect x="140" y="20" width="40" height="56" rx="20" fill="none" stroke="' + C.ink + '" stroke-width="4"/><path d="M126 60 a34 34 0 0 0 68 0 M160 94 v12" fill="none" stroke="' + C.ink + '" stroke-width="4" stroke-linecap="round"/>';
      s += '<circle cx="230" cy="34" r="9" fill="' + C.acc + '">' + pulse(1.2, 7, 10) + '</circle><text x="246" y="38" class="tp-cap" text-anchor="start" fill="' + C.acc + '">REC</text>';
      return svg(320, 112, s);
    },
    /** sing (hum) the note before you play it */
    sing() {
      let s = '<text x="80" y="70" class="tp-big" style="font-size:44px" fill="#FFE2BA">♪</text><path d="M120 60 q 15 -20 30 0 t 30 0 t 30 0 t 30 0" fill="none" stroke="#C98B5B" stroke-width="3" stroke-linecap="round">' + (M() ? '<animate attributeName="stroke-dasharray" values="0 200;200 0" dur="1.8s" repeatCount="indefinite"/>' : '') + '</path><text x="270" y="68" class="tp-big" fill="' + C.ok + '">=</text>';
      return svg(320, 100, s);
    },
    /** check every string of a chord: they light one by one */
    shapefirst() {
      const d = sh('Dm') || { frets: [0, 1, 1], fingers: [0, 1, 1] }, N = neck(4, 320, { dots: false }); let s = N.s + shape(N, d.frets, d.fingers);
      [1, 2, 3].forEach((k, i) => { s += '<line x1="' + (N.contact(Math.max(1, d.frets[k - 1])) + 12) + '" y1="' + N.sy[k] + '" x2="' + N.x1 + '" y2="' + N.sy[k] + '" stroke="#FFE2BA" stroke-width="4" opacity="' + (M() ? 0 : .8) + '">' + turn(i, 3, 2.4) + '</line>'; });
      return svg(320, 120, s);
    },
    /** fingertips get used to it: short sessions, rest */
    sore() {
      let s = '<circle cx="160" cy="56" r="38" fill="none" stroke="rgba(255,240,228,.2)" stroke-width="6"/><path d="M160 18 A 38 38 0 0 1 196 66" fill="none" stroke="#C98B5B" stroke-width="6" stroke-linecap="round">' + (M() ? '<animate attributeName="stroke-dasharray" values="0 240;120 240" dur="3s" repeatCount="indefinite"/>' : '') + '</path><text x="160" y="62" class="tp-big" fill="#FFE2BA" style="font-size:18px">15′</text><text x="160" y="108" class="tp-cap">' + L(['ვარჯიში → დასვენება', 'practise → rest']) + '</text>';
      return svg(320, 116, s);
    },
    /** accents: the red arrows are stronger strokes */
    accent() {
      let s = ''; [[70, false, false], [160, false, true], [250, true, true]].forEach(([x, up, acc], i) => { s += '<g>' + (acc && M() ? '<animateTransform attributeName="transform" type="scale" values="1;1.18;1" dur="1.8s" begin="' + (i * .6) + 's" repeatCount="indefinite" additive="sum"/>' : '') + arrow(x, 56, up, acc ? 28 : 22, acc ? C.acc : C.ink, acc ? 5 : 3) + '</g>'; });
      return svg(320, 110, s);
    },
    /** the strings in the app's picture and from the front */
    strings() {
      const N = neck(5, 320, { dots: false }); let s = N.s;
      [[3, 'E'], [2, 'C♯'], [1, 'A']].forEach(([k, l], i) => { s += '<line x1="' + N.x0 + '" y1="' + N.sy[k] + '" x2="' + N.x1 + '" y2="' + N.sy[k] + '" stroke="' + [C.sE, C.sC, C.sA][i] + '" stroke-width="4" opacity="' + (M() ? 0 : .9) + '">' + turn(i, 3, 3) + '</line>'; });
      return svg(320, 120, s);
    }
  };

  /* ---------------- the cards ---------------- */
  // [id, category, source, art, title, in short, steps[], why, try-it]
  const T = (id, cat, src, art, title, short, steps, why, go) => ({ id, cat, src, art, title, short, steps, why, go });
  const BUILT = [
    T('parts', 'inst', 'fact', null, ['გაიცანი შენი ფანდური', 'Meet your panduri'], ['ნაწილები შენი ინსტრუმენტის ფოტოებზე: თავი, მექანიკები, ტარი, ლადები, დეკა, ხიდი.', 'The parts on photos of your own instrument: headstock, tuners, neck, frets, soundboard, bridge.'], [], null, { route: 'explore', label: ['3D ტური', '3D tour'] }),
    T('tune', 'inst', 'fact', 'tune', ['აწყობა: A · C♯ · E', 'Tuning: A · C♯ · E'], ['ყოველ ჯერზე, დაკვრამდე — აწყობილი ფანდური ნახევარ სამუშაოს აკეთებს.', 'Every time, before you play — an in-tune panduri does half the work.'],
      [['გახსენი ტიუნერი და დაუკარი ერთი ღია სიმი.', 'Open the tuner and play one open string.'], ['ისარი შუაში უნდა დადგეს და გამწვანდეს.', 'The needle should settle in the middle and turn green.'], ['მერე მეორე და მესამე სიმი. ბოლოს ისევ შეამოწმე პირველი.', 'Then the second and third string. Finally check the first again.']],
      ['სიმები ჭიმვას თანდათან კარგავს, განსაკუთრებით ახალი ნეილონის სიმები.', 'Strings slowly lose tension, especially new nylon ones.'], { route: 'tuner', label: ['ტიუნერი', 'Tuner'] }),
    T('strings', 'inst', 'fact', 'strings', ['სიმები: რომელი სადაა', 'The strings: which is where'], ['აპის სურათზე: E ზემოთ, C♯ შუაში, A ქვემოთ. წინიდან შეხედვისას: მარცხნიდან A · C♯ · E.', 'In the app\'s picture: E on top, C♯ in the middle, A at the bottom. Seen from the front: A · C♯ · E from the left.'],
      [['A — ყველაზე დაბალი ბგერა.', 'A — the lowest sound.'], ['C♯ — შუა სიმი.', 'C♯ — the middle string.'], ['E — ყველაზე მაღალი ბგერა.', 'E — the highest sound.']], ['ასე ერთნაირად ვკითხულობთ ზოლს, ტარს და აკორდის ჩანაწერს (A·C♯·E).', 'This way the lanes, the neck and a chord\'s numbers (A·C♯·E) all read the same.'], { route: 'fretboard', label: ['ტარის რუკა', 'Fretboard map'] }),
    T('dots', 'inst', 'fact', 'dots', ['ყვითელი წერტილები = ორიენტირები', 'Yellow dots = landmarks'], ['წერტილები 3·5·7·9·15 ლადზე, ორი — მე-12-ზე. ლადს თვლით კი არა, წერტილით პოულობ.', 'Dots at frets 3·5·7·9·15, two at the 12th. You find a fret by its dot, not by counting.'],
      [['ჯერ იპოვე უახლოესი წერტილი.', 'First find the nearest dot.'], ['მერე ერთი ლადი წინ ან უკან.', 'Then one fret up or down.'], ['მე-12 ლადი = სიმის შუა, იგივე ნოტი ოქტავით მაღლა.', 'The 12th fret = the middle of the string, the same note an octave higher.']], null, { route: 'fretboard', label: ['ტარის რუკა', 'Fretboard map'] }),
    T('fretpos', 'left', 'general', 'fretpos', ['თითი — ლადთან ახლოს, მის უკან', 'Fingertip just behind the fret'], ['არა ლადზე და არა ორ ლადს შორის შუაში — ლადის ზუსტად უკან.', 'Not on the fret and not in the middle — right behind the fret.'],
      [['თითის წვერი დაადე ლადის ლითონთან ახლოს.', 'Put the fingertip close to the fret wire.'], ['ლადზე თუ დადებ, ბგერა ჩაკმენდილია.', 'On top of the fret the sound is choked.'], ['შუაში თუ დადებ, მეტი ძალა გინდა და ზუზუნებს.', 'In the middle you need more force and it buzzes.']],
      ['ასე ყველაზე ცოტა ძალით ყველაზე სუფთა ბგერა გამოდის.', 'This gives the cleanest sound with the least force.'], { route: 'trainer', label: ['ნოტების ტრენაჟორი', 'Notes trainer'] }),
    T('curve', 'left', 'general', 'curve', ['მრგვალი თითი, წვერით', 'Curved finger, use the tip'], ['თითი მოხარე და სიმს წვერით შეეხე — ბრტყელი თითი გვერდით სიმს აჩუმებს.', 'Curve the finger and press with the tip — a flat finger mutes the next string.'],
      [['ხელი ისე, თითქოს პატარა ბურთი გიჭირავს.', 'Shape the hand as if holding a small ball.'], ['თითის წვერი სიმზე ზემოდან ეცემა.', 'The fingertip comes down on the string from above.'], ['შეამოწმე: ყველა სიმი უნდა ჟღერდეს.', 'Check: every string should ring.']], null, { route: 'chords', label: ['აკორდები', 'Chords'] }),
    T('press', 'left', 'general', 'press', ['დააჭირე იმდენად, რამდენიც საჭიროა', 'Press only as hard as needed'], ['ზედმეტი ძალა ხელს ღლის და ბგერასაც ამაღლებს.', 'Too much force tires the hand and even pushes the pitch up.'],
      [['დააჭირე და დაუკარი.', 'Press and play.'], ['ნელა მოუშვი, სანამ ზუზუნი არ დაიწყება.', 'Slowly ease off until it starts to buzz.'], ['ცოტა მოუმატე — ეს არის „საკმარისი“.', 'Add a little — that is “enough”.']], null, null),
    T('barre', 'left', 'draft', 'barre', ['ბარე: ერთი თითი — ორი სიმი', 'Barre: one finger, two strings'], ['Dm-ში 1-ლი თითი ერთდროულად აჭერს C♯ და E სიმებს 1-ლ ლადზე.', 'In Dm the 1st finger presses C♯ and E together at fret 1.'],
      [['თითი ბრტყლად გაშალე ორივე სიმზე.', 'Lay the finger flat across both strings.'], ['ლადის ახლოს, მის უკან, როგორც ჩვეულებრივ.', 'Close behind the fret, as usual.'], ['A სიმი ღიაა — თითი არ უნდა შეეხოს.', 'The A string is open — the finger must not touch it.'], ['თითოეული სიმი ცალკე დაუკარი და შეამოწმე.', 'Play each string alone to check it.']],
      null, { route: 'chords', param: 'Dm', label: ['Dm ტარზე', 'Dm on the neck'] }),
    T('nails', 'left', 'general', 'curve', ['მოკლე ფრჩხილები მარცხენა ხელზე', 'Short nails on the left hand'], ['გრძელი ფრჩხილი წვერით დაჭერას არ გაძლევს.', 'Long nails stop you pressing with the tip.'], [['ფრჩხილი თითის ბალიშს არ უნდა სცდებოდეს.', 'The nail should not go past the fingertip.']], null, null),
    T('sore', 'left', 'general', 'sore', ['თითის წვერები თავიდან გტკივა — ეს ნორმალურია', 'Sore fingertips at first are normal'], ['პირველ კვირებში წვერები მიეჩვევა. ხშირად და მოკლედ ივარჯიშე.', 'In the first weeks the tips get used to it. Practise often and briefly.'],
      [['10–15 წუთი, მერე შესვენება.', '10–15 minutes, then a break.'], ['ძლიერი ან მკვეთრი ტკივილისას შეჩერდი.', 'Stop if the pain is strong or sharp.']], null, null),
    T('rhythm', 'right', 'fact', 'strum', ['აჭარული: ჩაკვრა · ჩაკვრა · ამოკვრა', 'Acharuli: down · down · up'], ['ერთი რითმი = ↓ ↓ ↑. მეორე და მესამე დარტყმა უფრო ძლიერია (წითელი).', 'One rhythm = ↓ ↓ ↑. The second and third strokes are stronger (red).'],
      [['თქვი ხმამაღლა: ჩაკვრა · ჩაკვრა · ამოკვრა.', 'Say it aloud: down · down · up.'], ['ჯერ აკორდის გარეშე, ღია სიმებზე.', 'First without a chord, on open strings.'], ['მერე Dm-ზე, ნელა.', 'Then on Dm, slowly.']],
      ['ბანი-აჭარული მთლიანად ამ რითმზეა — მასწავლებლის ჩანაწერიდან.', 'All of Bani-Acharuli uses this rhythm — from the teacher\'s chart.'], { route: 'lesson', param: 'bani-acharuli', label: ['ბანი-აჭარული', 'Bani-Acharuli'] }, true),
    T('accent', 'right', 'fact', 'accent', ['აქცენტი = უფრო ძლიერი დარტყმა', 'Accent = a stronger stroke'], ['აპში აქცენტი წითელი ისარია. დანარჩენი თეთრია და უფრო მსუბუქი.', 'In the app an accent is a red arrow. The rest are white and lighter.'],
      [['აქცენტზე ცოტა მეტი ძალა, არა მეტი სიჩქარე.', 'A little more force on the accent, not more speed.'], ['ტემპი იგივე რჩება.', 'The tempo stays the same.']], null, { route: 'rhythms', label: ['რიტმები', 'Rhythms'] }),
    T('wrist', 'right', 'draft', 'wrist', ['მოდუნებული მაჯა, უწყვეტი მოძრაობა', 'Loose wrist, steady motion'], ['ხელი ქანქარასავით მოძრაობს ზემოთ-ქვემოთ, ჩუმ დარტყმაზეც.', 'The hand swings down and up like a pendulum, even on silent beats.'],
      [['მოძრაობა მაჯიდან, არა მთელი მკლავიდან.', 'Move from the wrist, not the whole arm.'], ['მხარი და იდაყვი მოდუნებული.', 'Shoulder and elbow relaxed.'], ['თუ დაიძაბე — შეჩერდი და ხელი გაიქნიე.', 'If you tense up, stop and shake the hand out.']], null, { route: 'rhythms', label: ['რიტმები', 'Rhythms'] }),
    T('zone', 'right', 'draft', 'zone', ['სად უნდა დაარტყა სიმებს', 'Where to strike the strings'], ['ტარის ბოლოსა და სახმო ხვრელს შორის.', 'Between the end of the fingerboard and the sound hole.'],
      [['ხვრელთან ახლოს — უფრო რბილი ბგერა.', 'Nearer the hole — a softer sound.'], ['ხიდთან ახლოს — უფრო მკვეთრი.', 'Nearer the bridge — a sharper one.']], null, null),
    T('shapefirst', 'chords', 'general', 'shapefirst', ['აკორდი: ჯერ ფორმა, მერე დარტყმა', 'A chord: shape first, then strum'], ['თითები დასვი, მერე თითო სიმი ცალკე დაუკარი — ყველა უნდა ჟღერდეს.', 'Place the fingers, then play each string alone — all of them should ring.'],
      [['დასვი თითები და დაუკარი A, მერე C♯, მერე E.', 'Place the fingers and play A, then C♯, then E.'], ['თუ ერთი ჩუმია — რომელი თითი ეხება?', 'If one is dull — which finger touches it?'], ['მერე ჩამოკარი სამივე ერთად.', 'Then strum all three together.']], null, { route: 'chords', label: ['აკორდები', 'Chords'] }),
    T('change', 'chords', 'general', 'change', ['აკორდზე გადასვლა: ადრე დაიწყე', 'Changing chords: start early'], ['ბოლო დარტყმაზე ხელი უკვე შემდეგ აკორდზე იწყებს მოძრაობას.', 'On the last stroke the hand already starts moving to the next chord.'],
      [['ჯერ შეხედე, რომელი თითი სად მიდის.', 'First look where each finger goes.'], ['გადასვლა ივარჯიშე რიტმის გარეშე: Dm → B♭ → C.', 'Practise the change without the rhythm: Dm → B♭ → C.'], ['მერე ნელ ტემპში, რიტმთან ერთად.', 'Then at a slow tempo with the rhythm.']],
      ['მიზანი: ბგერა არ უნდა შეწყდეს აკორდებს შორის.', 'The goal: no gap in the sound between chords.'], { route: 'chords', param: 'Dm', label: ['გადასვლის სავარჯიშო', 'Change exercise'] }),
    T('minute', 'chords', 'general', 'change', ['ერთწუთიანი გადასვლები', 'One-minute changes'], ['ერთი წუთი მხოლოდ ორ აკორდს შორის გადადი და დათვალე.', 'For one minute switch only between two chords and count.'],
      [['აირჩიე ორი აკორდი, მაგ. Dm და B♭.', 'Pick two chords, e.g. Dm and B♭.'], ['ჩართე წამზომი — 1 წუთი.', 'Start a one-minute timer.'], ['ჩაიწერე რამდენჯერ მოასწარი. ხვალ — ერთით მეტი.', 'Write down how many. Tomorrow — one more.']], null, { route: 'chords', param: 'Dm', label: ['აკორდები', 'Chords'] }),
    T('count', 'rhythm', 'general', 'count', ['თვალე ხმამაღლა', 'Count aloud'], ['„1 და 2 და“ — ხმამაღლა თვლა რიტმს თავში ამაგრებს.', '“1 and 2 and” — counting aloud fixes the rhythm in your head.'],
      [['ჩართე მეტრონომი.', 'Turn on the metronome.'], ['თვალე და ფეხით თქვი დარტყმა.', 'Count and tap the beat with your foot.'], ['მერე დაუმატე დაკვრა.', 'Then add the playing.']], null, { route: 'metronome', label: ['მეტრონომი', 'Metronome'] }),
    T('tempo', 'rhythm', 'general', 'tempo', ['ჯერ ნელა — მერე სწრაფად', 'Slow first, then faster'], ['ტემპი მხოლოდ მაშინ აწიე, როცა 3-ჯერ ზედიზედ სუფთად გამოგივა.', 'Raise the tempo only after 3 clean times in a row.'],
      [['დაიწყე 60%-ზე.', 'Start at 60%.'], ['3 სუფთა გამეორება → +10%.', '3 clean repeats → +10%.'], ['თუ არეულდება — ერთი საფეხურით უკან.', 'If it falls apart — one step back.']], ['ნელი და სწორი ვარჯიში უფრო სწრაფად გასწავლის, ვიდრე სწრაფი და არეული.', 'Slow and right teaches you faster than fast and messy.'], { route: 'metronome', label: ['მეტრონომი', 'Metronome'] }),
    T('daily', 'practice', 'general', 'daily', ['ყოველდღე ცოტ-ცოტა', 'A little every day'], ['15 წუთი ყოველდღე სჯობს 2 საათს კვირაში ერთხელ.', '15 minutes every day beats 2 hours once a week.'],
      [['აირჩიე ერთი და იგივე დრო დღეში.', 'Pick the same time each day.'], ['დაიწყე აწყობით და ერთი ნაცნობი რამით.', 'Start with tuning and something you know.'], ['მერე ერთი ახალი ნაწილი.', 'Then one new piece.']], null, { route: 'daily', label: ['დღის გეგმა', 'Daily plan'] }),
    T('listen', 'practice', 'general', 'listen', ['ჯერ მოუსმინე', 'Listen first'], ['სანამ დაუკრავ, სიმღერა ან ნაწილი რამდენჯერმე მოისმინე.', 'Before you play, listen to the song or part a few times.'],
      [['მოუსმინე და იმღერე ან დაუსტვინე.', 'Listen and sing or whistle along.'], ['ფეხით აიყოლიე რიტმი.', 'Tap the rhythm with your foot.'], ['მერე დაუკარი.', 'Then play.']], null, { route: 'lesson', param: 'bani-acharuli', label: ['ბანი-აჭარული', 'Bani-Acharuli'] }),
    T('loop', 'practice', 'general', 'loop', ['მხოლოდ რთული ადგილი', 'Only the hard spot'], ['მთელ სიმღერას ნუ თავიდან უკრავ — რთული 2–4 დარტყმა ცალკე გაიმეორე.', 'Don\'t restart the whole song — repeat the hard 2–4 strokes alone.'],
      [['იპოვე სად გეშლება.', 'Find where it goes wrong.'], ['გაიმეორე მხოლოდ ის, ნელა, 5-ჯერ.', 'Repeat only that, slowly, 5 times.'], ['მერე ჩასვი უკან, წინა და შემდეგ ნაწილთან ერთად.', 'Then put it back with the parts before and after.']], null, null),
    T('record', 'practice', 'general', 'record', ['ჩაიწერე და მოისმინე', 'Record and listen back'], ['ჩანაწერში ის გესმის, რასაც დაკვრისას ვერ ამჩნევ.', 'On a recording you hear what you miss while playing.'],
      [['ჩაიწერე ერთი ნაწილი ტელეფონით.', 'Record one part on your phone.'], ['მოუსმინე: სადაა ჩუმი სიმი, სად ჩქარდები.', 'Listen: where is a dull string, where do you rush.'], ['შეადარე ორიგინალს.', 'Compare it with the original.']], null, null),
    T('semitone', 'ear', 'fact', 'semitone', ['ყოველი ლადი = ნახევარტონი', 'Every fret = one semitone'], ['ერთი ლადით ზემოთ — ბგერა ნახევარტონით მაღალია. 12 ლადი = ოქტავა.', 'One fret up — the sound is a semitone higher. 12 frets = an octave.'],
      [['A სიმი: 0 = A, 1 = A♯, 2 = B, 3 = C…', 'A string: 0 = A, 1 = A♯, 2 = B, 3 = C…'], ['მე-12 ლადზე ისევ A, ოქტავით მაღლა.', 'At the 12th fret it is A again, an octave higher.']], null, { route: 'theory', param: 'semitone', label: ['თეორიის თავი', 'Theory chapter'] }),
    T('octave', 'ear', 'fact', 'octave', ['მე-12 ლადი = ოქტავა', 'The 12th fret = an octave'], ['მე-12 ლადი სიმის ზუსტად შუაშია: იგივე ნოტი, ორჯერ მაღალი სიხშირით.', 'The 12th fret is the exact middle of the string: the same note at twice the frequency.'],
      [['დაუკარი ღია A, მერე A მე-12 ლადზე.', 'Play open A, then A at the 12th fret.'], ['მოუსმინე: ერთი და იგივე ნოტია, უფრო მაღლა.', 'Listen: the same note, higher.']], null, { route: 'theory', param: 'octave', label: ['თეორიის თავი', 'Theory chapter'] }),
    T('sing', 'ear', 'general', 'sing', ['ჯერ იმღერე ნოტი', 'Sing the note first'], ['სანამ დაუკრავ, ნოტი ხმით ან ჩუმად წარმოიდგინე.', 'Before you play, hum the note or hear it in your head.'],
      [['დაუკარი ნოტი და იმღერე.', 'Play a note and sing it.'], ['მერე ჯერ იმღერე, მერე დაუკარი და შეადარე.', 'Then sing first, play, and compare.']], ['ასე სმენა და ხელი ერთად ვითარდება.', 'This grows the ear and the hand together.'], { route: 'trainer', label: ['ნოტების ტრენაჟორი', 'Notes trainer'] })
  ];

  /* ---------------- overrides from Author Studio ---------------- */
  const KEY = 'tips.edit';
  const edits = () => PD.store.get(KEY, {}) || {};
  function all(withHidden) {
    const E = edits(), lang = PD.i18n.lang === 'en' ? 1 : 0;
    const merge = c => { const e = E[c.id]; if (!e) return c; const o = Object.assign({}, c); const pick = (k, base) => e[k] != null ? (lang ? base : e[k]) : base;   // teacher text is Georgian; English keeps the built-in text
      if (e.title) o.title = [e.title, c.title ? c.title[1] : e.title]; if (e.short) o.short = [e.short, c.short ? c.short[1] : e.short]; if (e.why) o.why = [e.why, c.why ? c.why[1] : e.why];
      if (e.steps) o.steps = e.steps.map((s, i) => [s, (c.steps && c.steps[i] && c.steps[i][1]) || s]); if (e.ok) o.src = 'teacher'; o.hidden = !!e.hide; void pick; return o; };
    const custom = Object.keys(E).filter(k => E[k] && E[k].custom).map(k => ({ id: k, cat: E[k].cat || 'practice', src: 'teacher', art: null, title: [E[k].title || '', E[k].title || ''], short: [E[k].short || '', E[k].short || ''], steps: (E[k].steps || []).map(s => [s, s]), why: E[k].why ? [E[k].why, E[k].why] : null, go: null, hidden: !!E[k].hide }));
    return BUILT.map(merge).concat(custom).filter(c => withHidden || !c.hidden);
  }
  const CATS = ['inst', 'left', 'right', 'chords', 'rhythm', 'practice', 'ear'];
  const badge = c => h('span', { class: 'tp-src ' + c.src, text: t('tp.src.' + c.src) });

  /* ---------------- the photo guide (your own instrument) ---------------- */
  const SPOTS = [['head', 4.6, 56], ['tuners', 11, 70], ['nut', 16.3, 55], ['fret', 33, 55], ['neck', 47, 55], ['hole', 67, 52], ['string', 58, 49], ['bridge', 79.5, 44], ['top', 88, 75]];
  function photos(box) {
    const ph = (PD.assets && PD.assets.photos) || {};
    if (!ph.front) { box.append(h('p', { class: 'muted', text: t('tp.ph.front') })); return; }
    const info = h('div', { class: 'tp-info', 'aria-live': 'polite' }, [h('span', { class: 'muted', text: t('tp.tap') })]);
    const wrap = h('div', { class: 'tp-photo' }, [h('img', { src: ph.front, alt: t('tp.ph.front'), loading: 'lazy' })]);
    SPOTS.forEach(([k, x, y], i) => wrap.append(h('button', { class: 'tp-spot', style: 'left:' + x + '%;top:' + y + '%', 'aria-label': t('x3p.' + k), text: String(i + 1), onclick: e => { wrap.querySelectorAll('.tp-spot').forEach(b => b.classList.toggle('on', b === e.currentTarget)); info.innerHTML = ''; info.append(h('b', { text: (i + 1) + '. ' + t('x3p.' + k) }), h('span', { text: t('pi.' + k) })); } })));
    box.append(h('figure', { class: 'tp-fig' }, [h('div', { class: 'tp-scroll' }, [wrap]), h('figcaption', { text: t('tp.ph.front') })]), info);   // on a phone the photo is wider than the screen: swipe along it
    if (ph.head) box.append(h('figure', { class: 'tp-fig' }, [h('img', { src: ph.head, alt: t('tp.ph.head'), loading: 'lazy' }), h('figcaption', { text: t('tp.ph.head') })]));
    if (ph.body) box.append(h('figure', { class: 'tp-fig narrow' }, [h('img', { src: ph.body, alt: t('tp.ph.body'), loading: 'lazy' }), h('figcaption', { text: t('tp.ph.body') })]));
  }

  /* ---------------- pages ---------------- */
  const openGo = g => g && PD.app.go(g.route, g.param || null);
  function playRhythm() {
    PD.audio.ensure(); const ctx = PD.audio.ctx; if (!ctx) return; const d = (sh('Dm') || { frets: [0, 1, 1] }).frets, t0 = ctx.currentTime + .08, step = .2;
    for (let r = 0; r < 4; r++) [['down', .55], ['down', .95], ['up', .9]].forEach(([dir, vel], i) => PD.audio.strum(d, dir, { when: t0 + (r * 3 + i) * step, vel, gap: .012 }));
  }
  function card(c) {
    return h('button', { class: 'tp-card', onclick: () => PD.app.go('tips', c.id) }, [
      h('div', { class: 'tp-art', html: c.id === 'parts' && PD.assets && PD.assets.photos && PD.assets.photos.front ? '<img src="' + PD.assets.photos.front + '" alt="">' : c.art && ART[c.art] ? ART[c.art]() : '' }),
      h('div', { class: 'tp-tx' }, [h('small', { class: 'tp-cat', text: t('tp.c.' + c.cat) }), h('b', { text: L(c.title) }), h('span', { text: L(c.short) })])]);
  }
  function page(w, param) {
    const list = all(), back = () => history.length > 1 ? history.back() : PD.app.go('learn');
    const c = param && list.find(x => x.id === param);
    if (c) {
      w.append(h('div', { class: 'row pg-head' }, [h('button', { class: 'btn small backbtn', html: PD.ic.back + '<span class="sr" data-t="back"></span>', onclick: back }), h('h1', { text: L(c.title), style: 'margin:0' })]));
      w.append(h('div', { class: 'row', style: 'gap:8px;flex-wrap:wrap' }, [h('span', { class: 'tp-cat chip-s', text: t('tp.c.' + c.cat) }), badge(c)]));
      const artBox = h('div', { class: 'tp-hero', html: c.art && ART[c.art] ? ART[c.art]() : '' });
      if (c.id === 'parts') { const b = h('div', { class: 'tp-photos' }); photos(b); w.append(h('p', { class: 'tp-short', text: L(c.short) }), b); }
      else {
        w.append(artBox, h('p', { class: 'tp-short', text: L(c.short) }));
        const acts = h('div', { class: 'row', style: 'gap:8px;flex-wrap:wrap' });
        if (c.art) acts.append(h('button', { class: 'btn small', text: t('tp.again'), onclick: () => { artBox.innerHTML = ART[c.art](); } }));
        if (c.id === 'rhythm' || c.art === 'strum' || c.art === 'accent') acts.append(h('button', { class: 'btn small', text: t('tp.listen'), onclick: playRhythm }));
        if (c.id === 'octave') acts.append(h('button', { class: 'btn small', text: t('tp.listen'), onclick: () => { PD.audio.ensure(); const t0 = PD.audio.ctx.currentTime + .05; PD.audio.note(1, 0, { when: t0 }); PD.audio.note(1, 12, { when: t0 + .7 }); } }));
        if (c.id === 'semitone') acts.append(h('button', { class: 'btn small', text: t('tp.listen'), onclick: () => { PD.audio.ensure(); const t0 = PD.audio.ctx.currentTime + .05; for (let f = 0; f <= 12; f++) PD.audio.note(1, f, { when: t0 + f * .32, vel: .7 }); } }));
        if (acts.childNodes.length) w.append(acts);
        if (c.steps && c.steps.length) w.append(h('section', { class: 'tp-sec' }, [h('h3', { 'data-t': 'tp.steps' }), h('ol', { class: 'tp-steps' }, c.steps.map(s => h('li', { text: L(s) })))]));
        if (c.why) w.append(h('section', { class: 'tp-sec' }, [h('h3', { 'data-t': 'tp.why' }), h('p', { text: L(c.why) })]));
      }
      if (c.go) w.append(h('button', { class: 'btn primary', style: 'align-self:flex-start', text: t('tp.try') + ': ' + L(c.go.label), onclick: () => openGo(c.go) }));
      // more from the same group
      const more = list.filter(x => x.cat === c.cat && x.id !== c.id).slice(0, 4);
      if (more.length) w.append(h('h2', { text: t('tp.c.' + c.cat), style: 'margin-top:10px' }), h('div', { class: 'tp-grid' }, more.map(card)));
      w.append(h('button', { class: 'btn small', style: 'align-self:flex-start', text: t('tp.more'), onclick: () => PD.app.go('tips') }));
      return;
    }
    w.append(h('div', { class: 'row pg-head' }, [h('button', { class: 'btn small backbtn', html: PD.ic.back + '<span class="sr" data-t="back"></span>', onclick: back }), h('h1', { 'data-t': 'tp.title', style: 'margin:0' })]), h('p', { class: 'muted', 'data-t': 'tp.lead' }));
    let cat = PD.store.get('tips.cat', 'all');
    const grid = h('div', { class: 'tp-grid' });
    const draw = () => { grid.innerHTML = ''; list.filter(x => cat === 'all' || x.cat === cat).forEach(x => grid.append(card(x))); };
    const chips = h('div', { class: 'chips-row', role: 'group' }, ['all'].concat(CATS).filter(k => k === 'all' || list.some(x => x.cat === k)).map(k => h('button', { class: 'chip', 'aria-pressed': String(k === cat), text: k === 'all' ? t('tp.all') : t('tp.c.' + k), onclick: e => { cat = k; PD.store.set('tips.cat', k); chips.querySelectorAll('.chip').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); draw(); } })));
    w.append(chips, grid); draw();
  }

  /* ---------------- Author Studio: approve · correct · hide · add ---------------- */
  function editor() {
    const back = h('div', { class: 'studio', role: 'dialog', 'aria-modal': 'true', style: 'z-index:45;grid-template-rows:auto minmax(0,1fr)' });
    const close = () => { back.remove(); document.removeEventListener('keydown', esc, true); };
    const esc = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    document.addEventListener('keydown', esc, true);
    const body = h('div', { class: 'wrap', style: 'max-width:900px;gap:14px' });
    back.append(h('div', { class: 'st-top' }, [h('button', { class: 'btn icon quiet', 'aria-label': t('close'), html: PD.ic.back, onclick: close }), h('b', { text: t('tp.edit') })]), h('div', { style: 'overflow:auto;padding:16px clamp(12px,3vw,32px) 40px' }, [body]));
    document.body.appendChild(back);
    const render = () => {
      body.innerHTML = ''; body.append(h('p', { class: 'fg2', text: t('tp.editD') }));
      const E = edits();
      body.append(h('button', { class: 'btn small', style: 'align-self:flex-start', text: t('tp.add'), onclick: () => { const id = 'c' + Date.now().toString(36), x = edits(); x[id] = { custom: true, cat: 'practice', title: t('tp.newT'), short: '', steps: [] }; PD.store.set(KEY, x); render(); } }));
      all(true).forEach(c => {
        const e = E[c.id] || {}, base = BUILT.find(b => b.id === c.id);
        const fT = h('input', { class: 'input', value: e.title != null ? e.title : (c.title ? c.title[0] : '') }), fS = h('textarea', { class: 'input', rows: 2, text: e.short != null ? e.short : (c.short ? c.short[0] : '') });
        const fSt = h('textarea', { class: 'input', rows: 3, text: (e.steps || (c.steps || []).map(s => s[0])).join('\n') }), fW = h('textarea', { class: 'input', rows: 2, text: e.why != null ? e.why : (c.why ? c.why[0] : '') });
        const ok = h('input', { type: 'checkbox', checked: !!e.ok || !!e.custom }), hide = h('input', { type: 'checkbox', checked: !!e.hide });
        const catSel = e.custom ? h('select', { class: 'input', style: 'width:auto' }, CATS.map(k => h('option', { value: k, text: t('tp.c.' + k), selected: k === (e.cat || 'practice') }))) : null;
        const save = () => { const x = edits(), o = Object.assign({}, x[c.id] || {}); o.title = fT.value.trim(); o.short = fS.value.trim(); o.steps = fSt.value.split('\n').map(s => s.trim()).filter(Boolean); o.why = fW.value.trim() || null; o.ok = ok.checked; o.hide = hide.checked; if (catSel) o.cat = catSel.value; x[c.id] = o; PD.store.set(KEY, x); PD.ui.toast('✓', 1000); render(); };
        body.append(h('details', { class: 'card', style: 'padding:12px 14px' }, [
          h('summary', { style: 'cursor:pointer;display:flex;gap:8px;align-items:center;flex-wrap:wrap' }, [h('b', { text: L(c.title) || '—' }), badge(c), c.hidden ? h('span', { class: 'muted', text: '· ' + t('tp.hide') }) : null].filter(Boolean)),
          h('div', { style: 'display:flex;flex-direction:column;gap:8px;margin-top:10px' }, [
            h('label', { class: 'muted', text: t('tp.fTitle') }), fT, h('label', { class: 'muted', text: t('tp.fShort') }), fS, h('label', { class: 'muted', text: t('tp.fSteps') }), fSt, h('label', { class: 'muted', text: t('tp.fWhy') }), fW,
            catSel, h('label', { class: 'row', style: 'gap:8px' }, [ok, h('span', { text: t('tp.ok') })]), h('label', { class: 'row', style: 'gap:8px' }, [hide, h('span', { text: t('tp.hide') })]),
            h('div', { class: 'row', style: 'gap:8px' }, [h('button', { class: 'btn primary small', text: t('tp.save'), onclick: save }), h('button', { class: 'btn small', text: t('tp.reset'), onclick: () => { const x = edits(); delete x[c.id]; PD.store.set(KEY, x); render(); } })])].filter(Boolean))]));
        void base;
      });
    };
    render(); PD.i18n.apply(back);
  }

  return { page, editor, all, ART, photos };
})();
