/* =====================================================================
   Songbook — well-known Georgian songs with chords found on the web.

   NOTHING HERE IS THE TEACHER'S. Every song is marked `draft` (not yet
   confirmed by him) and lists the pages its chords were read from, on
   the page itself. What each part is:
     · chords, their order, the song's form ......... the web page cited (draft)
     · the panduri shape of a chord ................. PD.curriculum.chords(), computed
                                                       from the tuning (fact), unless the
                                                       source itself is a panduri chart
     · the rhythm ................................... only Suliko's source gives one (↓↓↑);
                                                       for the others no source does, so the
                                                       learner chooses it and the page says so
     · how long each chord lasts .................... no source gives it: one rhythm per
                                                       chord by default, a practice setting
   Lyrics are not reproduced (only chord symbols).
   Slash chords (C/G) are taken as the plain chord: a G below the A string
   does not exist on this instrument. The page says so.
   ===================================================================== */
PD.i18n.add({
  'sb.draft': ['აკორდები ინტერნეტიდანაა — წყაროები ქვემოთ წერია. მასწავლებელს ჯერ არ შეუმოწმებია: შეიძლება მისი დაკვრა სხვანაირი იყოს.', 'The chords come from the web — the sources are listed below. The teacher has not checked them yet: the way he plays it may differ.'],
  'sb.rhythm': ['რითმი', 'Rhythm'],
  'sb.rhSrc': ['წყაროს რითმი: ↓ ↓ ↑', 'The source\'s rhythm: ↓ ↓ ↑'],
  'sb.rhSrcD': ['ეს რითმი წყაროშივე წერია (ფანდურის სქემაზე). მახვილები და ხანგრძლივობა იქ არ არის — აპი სამივე დარტყმას თანაბრად უკრავს.', 'This rhythm is written in the source itself (on the panduri chart). Accents and durations are not — the app plays the three strokes evenly.'],
  'sb.rhNone': ['წყაროში რითმი არ წერია. აირჩიე შენ — ნაგულისხმევი „ოთხი ჩაკვრა“ უბრალოდ ყველაზე მარტივია, მასწავლებლის მითითება არ არის.', 'The source does not give a rhythm. Choose one — the default “four downs” is simply the easiest, not the teacher\'s advice.'],
  'sb.rhPick': ['სხვა რითმის არჩევა', 'Choose another rhythm'],
  'sb.grpSrc': ['წყაროდან', 'From the source'], 'sb.grpT': ['მასწავლებლის რითმები', 'The teacher\'s rhythms'], 'sb.grpG': ['ზოგადი რითმები', 'General rhythms'],
  'sb.per': ['ერთ აკორდზე', 'Per chord'], 'sb.perN': ['{n} რითმი', '{n} × rhythm'],
  'sb.perD': ['რამდენ ხანს ჟღერს თითო აკორდი, წყარო არ წერს — ეს ვარჯიშის პარამეტრია, სიმღერის ნამდვილი დრო არ არის. სიმღერას ჩანაწერთან შეამოწმე.', 'No source says how long each chord lasts — this is a practice setting, not the song\'s real timing. Check it against a recording.'],
  'sb.chart': ['აკორდები', 'Chords'], 'sb.form': ['ფორმა', 'Form'], 'sb.part': ['ნაწილი {s}', 'Part {s}'],
  'sb.shapes': ['ფანდურზე', 'On the panduri'], 'sb.tap': ['დააჭირე — გაიგონებ.', 'Tap to hear it.'],
  'sb.shWeb': ['წყაროს სქემა', 'from the source chart'], 'sb.shCalc': ['გამოთვლილი აწყობიდან', 'computed from the tuning'],
  'sb.noShape': ['ამ აკორდს სამ სიმზე პოზიცია არ აქვს — სიმღერაში გამოტოვებულია.', 'This chord has no three-string position — it is left out of the song.'],
  'sb.slash': ['{a} აქ {b}-ადაა აღებული: ბანის ბგერა A სიმზე დაბლა ფანდურზე არ არსებობს.', '{a} is taken here as {b}: its bass note lies below the A string, which the panduri does not have.'],
  'sb.sources': ['წყაროები', 'Sources'], 'sb.who': ['ავტორები', 'Authors']
});

PD.songbook = (() => {
  const h = PD.h, t = PD.i18n.t;
  const L = (ka, en) => ({ ka, en });
  /* ---------------- the songs (chords exactly as the cited page writes them, apart from the notes above) ---------------- */
  const SONGS = [
    { id: 'sb-suliko', title: L('სულიკო', 'Suliko'), level: 1, bpm: 66,
      who: L('ლექსი — აკაკი წერეთელი (1895), მუსიკა — ვარინკა წერეთელი.', 'Words — Akaki Tsereteli (1895), music — Varinka Tsereteli.'),
      // the source is a panduri chart (A · C♯ · E): its own three shapes and its own stroke pattern
      shapes: { 'B♭': [1, 1, 1], 'E♭': [1, 2, 3], 'F': [3, 4, 5] },
      rhythm: ['down', 'down', 'up'],
      parts: { A: [['B♭', 'E♭', 'B♭'], ['F', 'E♭', 'B♭'], ['E♭', 'F', 'E♭', 'B♭'], ['E♭', 'B♭', 'F', 'E♭'], ['E♭', 'F', 'E♭', 'B♭'], ['E♭', 'B♭', 'F', 'E♭']] },
      form: ['A'],
      sources: [[L('hangebi.ge — „სულიკოს“ აკორდები ფანდურისთვის (A · C♯ · E), რითმი ↓↓↑', 'hangebi.ge — Suliko chords for the panduri (A · C♯ · E), rhythm ↓↓↑'), 'https://hangebi.ge/rus/suliko_chords.html'],
        [L('Guitar Songs Club — იგივე ჰარმონია G-ში (გიტარა), შედარებისთვის', 'Guitar Songs Club — the same harmony in G (guitar), for comparison'), 'https://eo.guitarsongs.club/song/34798'],
        [L('Wikipedia — Suliko', 'Wikipedia — Suliko'), 'https://en.wikipedia.org/wiki/Suliko']] },
    { id: 'sb-tbiliso', title: L('თბილისო', 'Tbiliso'), level: 2, bpm: 72,
      who: L('მუსიკა — რევაზ ლაღიძე, ლექსი — პეტრე გრუზინსკი.', 'Music — Revaz Lagidze, words — Petre Gruzinsky.'),
      parts: { A: [['Am', 'Dm', 'Am', 'Dm'], ['Am', 'F', 'Am', 'E7'], ['Am', 'Dm', 'Am', 'Dm'], ['G7', 'C', 'E7'], ['A7', 'Dm'], ['G7', 'C', 'C7'], ['Dm', 'Am'], ['B7', 'E7', 'Am']] },
      form: ['A'],
      sources: [[L('geolyrics.ru — „თბილისო“ (ნანი ბრეგვაძე), აკორდები', 'geolyrics.ru — Tbiliso (Nani Bregvadze), chords'), 'https://geolyrics.ru/simgherebi/nani-bregvadze/tbiliso.html'],
        [L('Wikipedia — რევაზ ლაღიძე', 'Wikipedia — Revaz Lagidze'), 'https://en.wikipedia.org/wiki/Rezo_Lagidze']] },
    { id: 'sb-chito-gvrito', title: L('ჩიტო-გვრიტო', 'Chito-gvrito'), level: 2, bpm: 72,
      who: L('მუსიკა — გია ყანჩელი, ფილმიდან „მიმინო“ (1977); მღერის ვახტანგ კიკაბიძე.', 'Music — Giya Kancheli, from the film “Mimino” (1977); sung by Vakhtang Kikabidze.'),
      slash: [['C/G', 'C']],
      parts: { A: [['Fm', 'C'], ['C', 'C7', 'Fm']], B: [['Fm', 'D♯m'], ['Fm', 'D♯m']] },
      form: ['A', 'A', 'B', 'A', 'A', 'B', 'A', 'A'],
      sources: [[L('mytabs.ru — „Чито-грито“, აკორდები', 'mytabs.ru — Chito-grito, chords'), 'https://mytabs.ru/akkordy/v-r/vahtang-kikabidze/chito-grito_80985.html']] },
    { id: 'sb-me-movigone', title: L('მე მოვიგონე', 'Me Movigone'), level: 1, bpm: 76,
      who: L('მგზავრები.', 'Mgzavrebi.'),
      parts: { A: [['G', 'Bm', 'Am', 'D7'], ['G', 'Bm', 'Am', 'D7'], ['G', 'Bm', 'Am', 'D7'], ['G', 'Bm', 'Am', 'D7']], B: [['G', 'Em'], ['Am', 'D7']] },
      // the page: verse · refrain ×2 · verse (chords written only over the first) · refrain ×6
      form: ['A', 'B', 'B', 'A', 'B', 'B', 'B', 'B', 'B', 'B'],
      sources: [[L('guitaretab.com (chordie.com-ის გავლით) — მგზავრები, „მე მოვიგონე“', 'guitaretab.com (via chordie.com) — Mgzavrebi, Me Movigone'), 'https://www.chordie.com/chord.pere/www.guitaretab.com/m/mgzavrebi/230109.html']] }
  ];

  /* ---------------- per-device practice choices: rhythm and rhythms per chord ---------------- */
  const KEY = 'songbook.prefs';
  const prefs = id => Object.assign({ per: 1 }, (PD.store.get(KEY, {}) || {})[id]);
  function setPref(id, o) { const all = PD.store.get(KEY, {}) || {}; all[id] = Object.assign(prefs(id), o); PD.store.set(KEY, all); PD.bus.emit('curriculum'); }

  /** the rhythm in use: { id, strokes:[{direction,accent}], durations (beats), src } */
  function rhythmOf(S) {
    const want = prefs(S.id).rh || (S.rhythm ? 'src' : 'g-down4');
    if (want === 'src' && S.rhythm) return { id: 'src', strokes: S.rhythm.map(d => ({ direction: d, accent: false })), durations: S.rhythm.map(() => 1), src: 'web' };
    const R = PD.curriculum.anyRhythm(want) || PD.curriculum.anyRhythm('g-down4');
    return { id: R.id, strokes: R.strokes, durations: (R.timing && R.timing.durations && R.timing.durations.length === R.strokes.length) ? R.timing.durations : R.strokes.map(() => 1), src: R.source, name: R.name };
  }
  /** the shape of one chord: the source's own panduri shape, or the library's first playable one */
  function shapeOf(S, name) {
    if (S.shapes && S.shapes[name]) { const fr = S.shapes[name], tf = PD.theory.teacherFingers(fr); return { frets: fr, fingers: tf ? tf.fingers : fr.map(f => f ? 1 : 0), src: 'web' }; }
    const lib = PD.curriculum.chords(), c = lib.find(x => x.name === name || x.alias === name);
    if (!c || c.none) return null;
    return { frets: c.frets, fingers: c.fingers, src: c.src === 'teacher' ? 'teacher' : 'fact' };
  }
  const chordsOf = S => [...new Set([].concat(...Object.values(S.parts).map(p => [].concat(...p))))];

  function lessonOf(S) {
    const { chord, sec } = PD.build, R = rhythmOf(S), per = prefs(S.id).per, cyc = R.durations.reduce((a, b) => a + b, 0);
    const ev = [], secs = [], seen = {};
    let t0 = 0;
    S.form.forEach(pk => {
      const from = t0;
      S.parts[pk].forEach(line => line.forEach(name => {
        const sh = shapeOf(S, name); if (!sh) return;
        for (let k = 0; k < per; k++) {
          let tt = t0;
          R.strokes.forEach((st, j) => { ev.push(...chord(tt, name, sh.frets, sh.fingers, st.direction, R.durations[j], !!st.accent, 'strum')); tt += R.durations[j]; });
          t0 += cyc;
        }
      }));
      seen[pk] = (seen[pk] || 0) + 1;
      const many = S.form.filter(x => x === pk).length > 1, n = many ? ' · ' + seen[pk] : '';
      if (t0 > from) secs.push(sec('ნაწილი ' + pk + n, 'Part ' + pk + n, from, t0));
    });
    return { id: S.id, type: 'song', level: S.level, demo: false, source: 'draft', songbook: true,
      title: S.title, desc: L('ცნობილი ქართული სიმღერა — აკორდები ინტერნეტიდან, ფანდურზე გადატანილი. მასწავლებელს ჯერ არ შეუმოწმებია.', 'A well-known Georgian song — chords from the web, set on the panduri. Not yet checked by the teacher.'),
      bpm: prefs(S.id).bpm || S.bpm, meter: [cyc, 4], events: ev, sections: secs, sbRhythm: R.id, skills: ['chords', 'strumming'] };
  }
  PD.lessons.provide(() => SONGS.map(S => { try { return lessonOf(S); } catch (_) { return null; } }).filter(Boolean));

  /* ---------------- the block on the song's page ---------------- */
  function diagram(sh) {
    const maxF = Math.max(4, ...sh.frets), x0 = 30, fw = 22, W = x0 + fw * maxF + 4, ys = { 3: 14, 2: 32, 1: 50 };
    let g = '<svg viewBox="0 0 ' + W + ' 62" aria-hidden="true"><rect x="' + x0 + '" y="6" width="' + (fw * maxF) + '" height="52" rx="3" fill="#4a1c0e"/><rect x="' + (x0 - 3) + '" y="5" width="4" height="54" rx="1" fill="#dedee1"/>';
    for (let f = 1; f <= maxF; f++) g += '<line x1="' + (x0 + f * fw) + '" x2="' + (x0 + f * fw) + '" y1="6" y2="58" stroke="#d1d1d4" stroke-width="1.5"/>';
    [1, 2, 3].forEach(s => { g += '<line x1="' + (x0 - 3) + '" x2="' + (x0 + fw * maxF) + '" y1="' + ys[s] + '" y2="' + ys[s] + '" stroke="#e1e1e4" stroke-width="' + (s === 1 ? 2.2 : s === 2 ? 1.8 : 1.4) + '"/><text x="2" y="' + (ys[s] + 4) + '" fill="#c38c63" font-size="10" font-weight="600">' + PD.theory.stringName(s) + '</text>'; });
    sh.frets.forEach((f, i) => {
      const y = ys[i + 1];
      if (f === 0) { g += '<circle cx="' + (x0 - 10) + '" cy="' + y + '" r="4" fill="none" stroke="#e1e1e4" stroke-width="1.5"/>'; return; }
      const fi = sh.fingers[i], cx = x0 + (f - .5) * fw, col = PD.fingers ? PD.fingers.color(fi) : '#c78b5e', ink = PD.fingers ? PD.fingers.ink(fi) : '#111';
      g += '<circle cx="' + cx + '" cy="' + y + '" r="8" fill="' + col + '" stroke="rgba(255,255,255,.6)"/><text x="' + cx + '" y="' + (y + 4) + '" fill="' + ink + '" font-size="10" font-weight="700" text-anchor="middle">' + (fi || '') + '</text>';
    });
    return g + '</svg>';
  }
  function select(label, opts, cur, on) {
    const s = h('select', { class: 'input sb-sel', 'aria-label': label, onchange: e => on(e.target.value) });
    opts.forEach(o => {
      if (o.group) { const gr = h('optgroup', { label: o.group }); o.items.forEach(([v, tx]) => gr.appendChild(h('option', { value: v, text: tx, selected: String(v) === String(cur) || null }))); s.appendChild(gr); }
      else s.appendChild(h('option', { value: o[0], text: o[1], selected: String(o[0]) === String(cur) || null }));
    });
    return s;
  }
  function block(l) {
    const S = SONGS.find(x => x.id === l.id); if (!S) return null;
    const R = rhythmOf(S), P = prefs(S.id), pick = PD.i18n.pick;
    const wrap = h('div', { class: 'sb' });
    // honesty first
    wrap.append(h('p', { class: 'notice' }, [h('span', { class: 'tag demo', text: PD.ui.srcLabel('tp.src.draft') }), h('span', { 'data-t': 'sb.draft' })]));
    // the rhythm: what the source says (or that it says nothing), then the choice
    const rhOpts = [];
    if (S.rhythm) rhOpts.push({ group: t('sb.grpSrc'), items: [['src', t('sb.rhSrc')]] });
    rhOpts.push({ group: t('sb.grpT'), items: PD.curriculum.rhythms().map(r => [r.id, pick(r.name)]) });
    rhOpts.push({ group: t('sb.grpG'), items: PD.curriculum.commonRhythms().map(r => [r.id, pick(r.name)]) });
    const srcBadge = R.id === 'src' ? null : R.src === 'teacher' ? 'tp.src.teacher' : 'tp.src.general';
    wrap.append(h('section', { class: 'sx-block sb-rh' + (R.id === 'src' ? ' noacc' : '') }, [
      h('h3', { 'data-t': 'sb.rhythm' }),
      PD.rhythmsUI && PD.rhythmsUI.patternRow ? PD.rhythmsUI.patternRow({ strokes: R.strokes, timing: { durations: R.durations } }) : null,
      h('small', { class: 'muted', 'data-t': S.rhythm ? 'sb.rhSrcD' : 'sb.rhNone' }),
      h('div', { class: 'sb-ctl' }, [
        h('label', {}, [h('span', { 'data-t': 'sb.rhPick' }), select(t('sb.rhPick'), rhOpts, R.id, v => setPref(S.id, { rh: v }))]),
        h('label', {}, [h('span', { 'data-t': 'sb.per' }), select(t('sb.per'), [1, 2, 4].map(n => [n, t('sb.perN', { n })]), P.per, v => setPref(S.id, { per: +v }))]),
        srcBadge ? h('span', { class: 'tag demo', text: PD.ui.srcLabel(srcBadge) }) : null]),
      h('small', { class: 'muted', 'data-t': 'sb.perD' })]));
    // the chart: each part once, then the order the parts come in
    const parts = Object.keys(S.parts), chart = h('section', { class: 'sx-block sb-chart' }, [h('h3', { 'data-t': 'sb.chart' })]);
    parts.forEach(pk => chart.append(h('div', { class: 'sb-part' }, [h('b', { text: t('sb.part', { s: pk }) }),
      h('div', { class: 'sb-lines' }, S.parts[pk].map(line => h('div', { class: 'sb-line' }, line.map(c => h('span', { class: 'sb-c' + (shapeOf(S, c) ? '' : ' none'), text: c })))))])));
    if (S.form.length > 1) chart.append(h('p', { class: 'sb-form' }, [h('b', { 'data-t': 'sb.form' }), ' ' + S.form.join(' · ')]));
    (S.slash || []).forEach(([a, b]) => chart.append(h('small', { class: 'muted', text: t('sb.slash', { a, b }) })));
    wrap.append(chart);
    // the shapes, each playable
    const names = chordsOf(S);
    wrap.append(h('section', { class: 'sx-block' }, [h('h3', { 'data-t': 'sb.shapes' }), h('div', { class: 'chd-row' }, names.map(n => {
      const sh = shapeOf(S, n);
      if (!sh) return h('div', { class: 'chd' }, [h('b', { text: n }), h('small', { class: 'muted', 'data-t': 'sb.noShape' })]);
      return h('button', { class: 'chd sb-chd', onclick: () => PD.audio.strum(sh.frets, 'down') }, [h('b', { text: n }), h('div', { html: diagram(sh) }),
        h('small', { class: 'muted', text: sh.frets.map((f, i) => PD.theory.stringName(i + 1) + ' ' + f).join(' · ') + ' · ' + t(sh.src === 'web' ? 'sb.shWeb' : 'sb.shCalc') })]);
    })), h('small', { class: 'muted', 'data-t': 'sb.tap' })]));
    // authors and sources
    wrap.append(h('section', { class: 'sx-block gn-src' }, [h('b', { 'data-t': 'sb.who' }), h('p', { class: 'fg2', text: pick(S.who) }),
      h('b', { 'data-t': 'sb.sources' }), h('ul', {}, S.sources.map(([tx, u]) => h('li', {}, [h('a', { href: u, target: '_blank', rel: 'noopener noreferrer', text: pick(tx) })])))]));
    PD.i18n.apply(wrap);
    return wrap;
  }
  return { SONGS, block, lessonOf };
})();
