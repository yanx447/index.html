/* =====================================================================
   Music theory — one page in the main menu for everything about notes:
   the theory book's chapters (grouped by topic), solfège, intervals
   (prima … octave), scales, how chords are built, the circle of fifths,
   the glossary and music history. The pages themselves stay in their
   own modules (notes.js, solfege.js, shapes.js, circle.js, genres.js);
   this module is the hub, plus the interval reference, which shows
   every interval from any root with sound and on the panduri's strings.
   All of it is general music theory (badge `general`) or something the
   app derives from the tuning itself (badge `fact`) — no technique.
   ===================================================================== */
PD.i18n.add({
  'nav.theory': ['თეორია', 'Theory'],
  'mth.title': ['მუსიკის თეორია', 'Music theory'],
  'mth.lead': ['ნოტები, სოლფეჯიო, ინტერვალები, გამები, აკორდები, კვინტური წრე — ყველაფერი ერთ ადგილას, ფანდურის ხმით.', 'Notes, solfège, intervals, scales, chords, the circle of fifths — all in one place, with the panduri\'s sound.'],
  'mth.read': ['წაკითხული თავები', 'Chapters read'], 'mth.sf': ['სოლფეჯიოს დონეები', 'Solfège levels'], 'mth.music': ['მუსიკის ისტორია', 'Music history'],
  'mth.tools': ['ინტერაქტიული', 'Interactive'],
  'mth.ivT': ['ინტერვალები', 'Intervals'], 'mth.ivD': ['პრიმა, სეკუნდა, ტერცია … ოქტავა — მოისმინე ნებისმიერი ნოტიდან', 'Unison, second, third … octave — hear them from any note'],
  'mth.sfT': ['სოლფეჯიო', 'Solfège'], 'mth.sfD': ['სმენის ვარჯიში: გაიგონე, დაასახელე, იმღერე', 'Ear training: hear it, name it, sing it'],
  'mth.cfD': ['ტონალობები, ნიშნები და აკორდები ერთ წრეზე', 'Keys, signatures and chords on one wheel'],
  'mth.scT': ['გამები ფანდურზე', 'Scales on the panduri'], 'mth.scD': ['მაჟორი, მინორი, პენტატონიკა — ტარზე და ხმით', 'Major, minor, pentatonic — on the neck and by ear'],
  'mth.chT': ['აკორდის აგება', 'Building a chord'], 'mth.chD': ['ტერციებით: ტონიკა · ტერცია · კვინტა', 'In thirds: root · third · fifth'],
  'mth.glT': ['ლექსიკონი', 'Glossary'], 'mth.glD': ['მუსიკის ყველა სიტყვა მარტივად', 'Every music word, simply'],
  'mth.gnD': ['ჟანრები, ფორმები და მათი ისტორია', 'Genres, forms and their history'],
  'mth.mtT': ['მეტრონომი', 'Metronome'], 'mth.mtD': ['ტემპი და ზომა — ყური და ხელი ერთად', 'Tempo and metre — ear and hand together'],
  'mth.g.sound': ['ბგერა და ნოტები', 'Sounds and notes'], 'mth.g.write': ['ნოტების ჩაწერა', 'Writing music down'], 'mth.g.time': ['რიტმი, ზომა, ტემპი', 'Rhythm, metre, tempo'], 'mth.g.harm': ['ინტერვალები და ჰარმონია', 'Intervals and harmony'], 'mth.g.other': ['სხვა თავები', 'More chapters'],
  'mth.sfEx': ['სავარჯიშო', 'Exercise'],
  // the interval page
  'mth.iv.lead': ['<b>ინტერვალი</b> ორ ბგერას შორის მანძილია. მას ორი რამ განსაზღვრავს: <b>რამდენ ნოტის სახელს</b> მოიცავს (ეს არის მისი სახელი — პრიმა, სეკუნდა, ტერცია…) და <b>რამდენ ნახევარტონს</b> (ეს არის მისი სახეობა — დიდი, პატარა, წმინდა).', 'An <b>interval</b> is the distance between two sounds. Two things define it: <b>how many note names</b> it spans (its name — unison, second, third…) and <b>how many semitones</b> (its quality — major, minor, perfect).'],
  'mth.iv.root': ['საწყისი ნოტი', 'Starting note'], 'mth.iv.up': ['▶ ზემოთ', '▶ Up'], 'mth.iv.tog': ['▶ ერთად', '▶ Together'], 'mth.iv.down': ['▶ ქვემოთ', '▶ Down'],
  'mth.iv.semi': ['{n} ნახევარტ.', '{n} semitones'], 'mth.iv.semi1': ['1 ნახევარტ.', '1 semitone'], 'mth.iv.on': ['ფანდურზე', 'On the panduri'],
  'mth.iv.oneStr': ['ერთ სიმზე: {n} ლადით ზემოთ', 'On one string: {n} frets up'], 'mth.iv.none': ['ფანდურის დიაპაზონის გარეთაა', 'Outside the panduri\'s range'],
  'mth.iv.namesH': ['სახელები: ლათინური რიცხვები', 'The names: Latin numbers'],
  'mth.iv.namesP': ['ინტერვალის სახელი ლათინური რიგობითი რიცხვია. ითვლება <b>ორივე კიდურა ნოტი</b>: დო → მი = დო, რე, მი = 3 ნოტი = <b>ტერცია</b>.', 'An interval\'s name is a Latin ordinal number. <b>Both end notes</b> are counted: C → E = C, D, E = 3 notes = a <b>third</b>.'],
  'mth.iv.qualH': ['სახეობა: წმინდა, დიდი, პატარა', 'Quality: perfect, major, minor'],
  'mth.iv.allH': ['ყველა ინტერვალი', 'Every interval'],
  'mth.iv.consH': ['კონსონანსი და დისონანსი', 'Consonance and dissonance'],
  'mth.iv.invH': ['ინტერვალის შებრუნება', 'Inverting an interval'],
  'mth.iv.tunH': ['ფანდურის აწყობა ინტერვალებით', 'The panduri\'s tuning in intervals'],
  'mth.iv.quizH': ['შეამოწმე თავი', 'Test yourself'], 'mth.iv.quizQ': ['{a} → {b}: რომელი ინტერვალია?', '{a} → {b}: which interval is it?'],
  'mth.iv.quizHear': ['მოისმინე: რომელი ინტერვალია?', 'Listen: which interval is it?'], 'mth.iv.mName': ['ნოტებით', 'By name'], 'mth.iv.mEar': ['სმენით', 'By ear'],
  'mth.iv.score': ['{a} / {b} სწორი', '{a} / {b} right'], 'mth.iv.next': ['შემდეგი', 'Next'], 'mth.iv.right': ['სწორია!', 'Right!'], 'mth.iv.wrong': ['არა — ეს არის {x}', 'No — it is {x}'],
  'mth.iv.chapter': ['თავი წიგნში: ინტერვალები', 'Book chapter: intervals'], 'mth.iv.ear': ['ივარჯიშე სმენით (სოლფეჯიო)', 'Train your ear (solfège)']
});

PD.mtheory = (() => {
  const h = PD.h, t = PD.i18n.t, TH = PD.theory, ic = PD.ic;
  const L = (ka, en) => PD.i18n.pick({ ka, en });
  const src = k => h('span', { class: 'tp-src ' + k, text: PD.ui.srcLabel(k === 'general' ? 'cf.srcGen' : 'tp.src.' + k) });   // the theory label, not the tips' "advice for string players"

  /* ---------- sound (the panduri's own notes where they exist) ---------- */
  function playM(m, when, dur) {
    if (PD.solfege && PD.solfege.playM) return PD.solfege.playM(m, when, .8, dur);   // panduri or piano: the learner's choice (solfège page)
    const pos = TH.positions(m).sort((a, b) => a.f - b.f)[0]; if (pos) PD.audio.note(pos.s, pos.f, { when, vel: .8 }); else if (PD.audio.tone) PD.audio.tone(m, .9);
  }
  function seq(items, gaps) {
    PD.audio.ensure(); const ctx = PD.audio.ctx; if (!ctx) return;
    let at = ctx.currentTime + .06;
    items.forEach((m, i) => { const g = Array.isArray(gaps) ? gaps[i] : gaps; if (m != null) [].concat(m).forEach(x => playM(x, at, i === items.length - 1 || Array.isArray(m) ? 1.8 : Math.max(.5, g * 1.15))); at += g; });
  }

  /* ---------- spelling: an interval is spelled by its name (a 3rd above C is E, never F♭) ---------- */
  const LET = ['C', 'D', 'E', 'F', 'G', 'A', 'B'], NAT = [0, 2, 4, 5, 7, 9, 11], SOL = ['დო', 'რე', 'მი', 'ფა', 'სოლ', 'ლა', 'სი'];
  const ACC = { '-2': '𝄫', '-1': '♭', 0: '', 1: '♯', 2: '𝄪' };
  const mod = (a, n) => ((a % n) + n) % n;
  /** a root: letter index, accidental, octave → midi */
  const R = (li, acc, oct) => ({ li, acc, oct, m: 12 * (oct + 1) + NAT[li] + acc });
  const ROOTS = [R(5, 0, 3), R(6, 0, 3), R(0, 0, 4), R(0, 1, 4), R(1, 0, 4), R(2, 0, 4), R(3, 0, 4), R(4, 0, 4), R(5, 0, 4)];
  /** the note `step` names above the root (1 = unison) and `semi` semitones above it */
  function above(r, step, semi) {
    const li = r.li + step - 1, oct = r.oct + Math.floor(li / 7), l = mod(li, 7), m = r.m + semi;
    const acc = m - (12 * (oct + 1) + NAT[l]);
    return { li: l, acc, oct, m };
  }
  const nm = (n, withOct) => {
    const a = ACC[n.acc] != null ? ACC[n.acc] : '';
    return PD.i18n.lang === 'ka' ? SOL[n.li] + a : LET[n.li] + a + (withOct ? n.oct : '');
  };

  /* ---------- the intervals (general music theory) ---------- */
  // step: 1 = prima … 8 = octave; q: quality key; s: semitones
  const NAMES = {
    1: ['პრიმა', 'Unison', 'prima — „პირველი“', 'prima — “first”'], 2: ['სეკუნდა', 'Second', 'secunda — „მეორე“', 'secunda — “second”'],
    3: ['ტერცია', 'Third', 'tertia — „მესამე“', 'tertia — “third”'], 4: ['კვარტა', 'Fourth', 'quarta — „მეოთხე“', 'quarta — “fourth”'],
    5: ['კვინტა', 'Fifth', 'quinta — „მეხუთე“', 'quinta — “fifth”'], 6: ['სექსტა', 'Sixth', 'sexta — „მეექვსე“', 'sexta — “sixth”'],
    7: ['სეპტიმა', 'Seventh', 'septima — „მეშვიდე“', 'septima — “seventh”'], 8: ['ოქტავა', 'Octave', 'octava — „მერვე“', 'octava — “eighth”']
  };
  const Q = { P: ['წმინდა', 'perfect', 'წმ.', 'P'], M: ['დიდი', 'major', 'დ.', 'M'], m: ['პატარა', 'minor', 'პ.', 'm'], A: ['გადიდებული', 'augmented', 'გად.', 'A'], d: ['შემცირებული', 'diminished', 'შემც.', 'd'] };
  const IV = [
    { step: 1, q: 'P', s: 0, c: 'perf' }, { step: 2, q: 'm', s: 1, c: 'dis' }, { step: 2, q: 'M', s: 2, c: 'dis' },
    { step: 3, q: 'm', s: 3, c: 'imp' }, { step: 3, q: 'M', s: 4, c: 'imp' }, { step: 4, q: 'P', s: 5, c: 'perf4' },
    { step: 4, q: 'A', s: 6, c: 'tri' }, { step: 5, q: 'd', s: 6, c: 'tri' }, { step: 5, q: 'P', s: 7, c: 'perf' },
    { step: 6, q: 'm', s: 8, c: 'imp' }, { step: 6, q: 'M', s: 9, c: 'imp' }, { step: 7, q: 'm', s: 10, c: 'dis' },
    { step: 7, q: 'M', s: 11, c: 'dis' }, { step: 8, q: 'P', s: 12, c: 'perf' }];
  const ivName = v => {
    const n = NAMES[v.step], q = Q[v.q];
    if (PD.i18n.lang === 'ka') return q[0] + ' ' + n[0];
    return v.step === 1 ? 'perfect unison' : v.step === 8 ? 'perfect octave' : q[1] + ' ' + n[1].toLowerCase();
  };
  const ivShort = v => (PD.i18n.lang === 'ka' ? Q[v.q][2] : Q[v.q][3]) + v.step;
  const semiTxt = n => n === 1 ? t('mth.iv.semi1') : t('mth.iv.semi', { n });
  const CONS = {
    perf: ['სრული კონსონანსი — „ცარიელი“, მყარი ჟღერადობა', 'perfect consonance — open, stable'],
    perf4: ['კონსონანსი (ჰარმონიაში ზოგჯერ მოითხოვს გახსნას)', 'consonant (in harmony it sometimes needs to resolve)'],
    imp: ['არასრული კონსონანსი — თბილი, სავსე', 'imperfect consonance — warm, full'],
    dis: ['დისონანსი — დაძაბული, გაგრძელებას ითხოვს', 'dissonance — tense, wants to move on'],
    tri: ['ტრიტონი — ყველაზე დაძაბული, 3 ტონი', 'tritone — the most tense, 3 whole tones']
  };
  const play = (r, v, how) => {
    const top = r.m + v.s;
    if (how === 'down') return seq([top, r.m], .6);
    if (how === 'tog') return seq([[r.m, top]], .1);
    seq([r.m, top, [r.m, top]], [.6, .7, .1]);
  };
  /** where a note lives on the panduri (string · fret), lowest fret first */
  const where = m => TH.positions(m).sort((a, b) => a.f - b.f).map(p => TH.stringName(p.s) + ' · ' + p.f);

  /* ---------- the interval page ---------- */
  function intervals(w) {
    const rootIx = Math.max(0, Math.min(ROOTS.length - 1, +PD.store.get('mth.root', 0) || 0));
    let root = ROOTS[rootIx];
    w.append(h('div', { class: 'row pg-head' }, [h('button', { class: 'btn small backbtn', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('mtheory') }), h('h1', { 'data-t': 'mth.ivT', style: 'margin:0' })]),
      h('p', { class: 'mth-lead', 'data-th': 'mth.iv.lead' }));

    // the starting note — every example on the page is rebuilt from it
    const rootRow = h('div', { class: 'chips-row mth-roots', role: 'group', 'aria-label': t('mth.iv.root') });
    const grid = h('div', { class: 'mth-ivgrid' });
    const table = h('div', { class: 'tb-tw' });
    function drawRoots() {
      rootRow.innerHTML = '';
      ROOTS.forEach((r, i) => rootRow.append(h('button', { class: 'chip', 'aria-pressed': String(r === root), text: nm(r, true), onclick: () => { root = r; PD.store.set('mth.root', i); drawRoots(); drawCards(); drawTable(); seq([r.m], .1); } })));
    }
    // one card per name (prima … octava), with each of its kinds inside
    function drawCards() {
      grid.innerHTML = '';
      for (let step = 1; step <= 8; step++) {
        const N = NAMES[step], kinds = IV.filter(v => v.step === step);
        grid.append(h('section', { class: 'mth-iv' }, [
          h('div', { class: 'mth-iv-h' }, [h('span', { class: 'mth-iv-n', text: String(step) }), h('div', {}, [h('b', { text: L(N[0], N[1]) }), h('small', { text: L(N[2], N[3]) })])]),
          ...kinds.map(v => {
            const top = above(root, v.step, v.s), pos = where(top.m);
            return h('div', { class: 'mth-iv-k' }, [
              h('div', { class: 'mth-iv-kt' }, [h('b', { text: ivName(v) }), h('span', { class: 'mth-ab', text: ivShort(v) }), h('small', { text: semiTxt(v.s) })]),
              h('div', { class: 'mth-iv-ex' }, [h('span', { class: 'mth-nn', text: nm(root) }), h('span', { class: 'mth-ar', text: '→' }), h('span', { class: 'mth-nn', text: nm(top) })]),
              h('small', { class: 'mth-iv-pos', text: pos.length ? t('mth.iv.on') + ': ' + pos.slice(0, 2).join(' / ') : t('mth.iv.none') }),
              h('div', { class: 'mth-iv-b' }, [
                h('button', { class: 'btn small', 'data-t': 'mth.iv.up', onclick: () => play(root, v, 'up') }),
                h('button', { class: 'btn small', 'data-t': 'mth.iv.tog', onclick: () => play(root, v, 'tog') }),
                h('button', { class: 'btn small quiet', 'data-t': 'mth.iv.down', onclick: () => play(root, v, 'down') })])]);
          })]));
      }
      PD.i18n.apply(grid);
    }
    function drawTable() {
      table.innerHTML = '';
      table.append(h('table', { class: 'tb-t mth-t' }, [
        h('thead', {}, [h('tr', {}, [L('ნახევარტ.', 'Semit.'), L('ინტერვალი', 'Interval'), L('ნიშანი', 'Symbol'), L('მაგალითი', 'Example'), L('ჟღერადობა', 'Sound'), ''].map(x => h('th', { text: x })))]),
        h('tbody', {}, IV.map(v => { const top = above(root, v.step, v.s); return h('tr', {}, [
          h('td', { text: String(v.s) }), h('td', { text: ivName(v) }), h('td', { text: ivShort(v) }), h('td', { text: nm(root) + ' → ' + nm(top) }),
          h('td', { class: 'mth-c ' + v.c, text: L(CONS[v.c][0], CONS[v.c][1]).split(' — ')[0] }),
          h('td', {}, [h('button', { class: 'btn small', text: '▶', 'aria-label': ivName(v), onclick: () => play(root, v, 'up') })])]); }))]));
    }

    const sec = (key, kids) => h('section', { class: 'mth-sec' }, [h('h2', { class: 'mth-h', 'data-t': key }), ...kids]);
    const P = (ka, en) => h('p', { class: 'tb-p', html: L(ka, en) });

    if (PD.solfege && PD.solfege.voiceSwitch) w.append(PD.solfege.voiceSwitch());
    w.append(h('div', { class: 'mth-rootbar' }, [h('b', { 'data-t': 'mth.iv.root' }), rootRow]), grid);

    w.append(sec('mth.iv.namesH', [h('p', { class: 'tb-p', 'data-th': 'mth.iv.namesP' }),
      h('div', { class: 'tb-tw' }, [h('table', { class: 'tb-t' }, [h('thead', {}, [h('tr', {}, [L('ნოტი', 'Notes'), L('სახელი', 'Name'), L('ლათინურად', 'In Latin')].map(x => h('th', { text: x })))]),
        h('tbody', {}, [1, 2, 3, 4, 5, 6, 7, 8].map(s => h('tr', {}, [h('td', { text: String(s) }), h('td', { text: L(NAMES[s][0], NAMES[s][1]) }), h('td', { text: L(NAMES[s][2], NAMES[s][3]) })])))])]), src('general')]));

    w.append(sec('mth.iv.qualH', [
      P('ერთსა და იმავე სახელს შეიძლება სხვადასხვა რაოდენობის ნახევარტონი ჰქონდეს. დო → მი 4 ნახევარტონია (<b>დიდი ტერცია</b>), დო → მი♭ — 3 (<b>პატარა ტერცია</b>). ორივე ტერციაა, რადგან სამ ნოტის სახელს მოიცავს.', 'The same name can hold a different number of semitones. C → E is 4 semitones (a <b>major third</b>), C → E♭ is 3 (a <b>minor third</b>). Both are thirds, because both span three note names.'),
      h('ul', { class: 'tb-ul' }, [
        ['<b>წმინდა</b> — პრიმა, კვარტა, კვინტა, ოქტავა. მათ დიდი და პატარა არ აქვთ.', '<b>Perfect</b> — unison, fourth, fifth, octave. They have no major or minor.'],
        ['<b>დიდი / პატარა</b> — სეკუნდა, ტერცია, სექსტა, სეპტიმა. პატარა ერთი ნახევარტონით ნაკლებია დიდზე.', '<b>Major / minor</b> — second, third, sixth, seventh. Minor is one semitone smaller than major.'],
        ['<b>გადიდებული / შემცირებული</b> — ნახევარტონით მეტი ან ნაკლები. ყველაზე ცნობილია <b>ტრიტონი</b> (6 ნახევარტონი): გადიდებული კვარტა = შემცირებული კვინტა.', '<b>Augmented / diminished</b> — a semitone more or less. The best known is the <b>tritone</b> (6 semitones): augmented fourth = diminished fifth.']
      ].map(([ka, en]) => h('li', { html: L(ka, en) }))), src('general')]));

    w.append(sec('mth.iv.allH', [table]));

    w.append(sec('mth.iv.consH', [
      P('ზოგი ინტერვალი მშვიდად და „დასრულებულად“ ჟღერს, ზოგი — დაძაბულად. ეს ეხება ერთდროულად აღებულ ორ ბგერას (<b>▶ ერთად</b>).', 'Some intervals sound calm and “finished”, others tense. This is about two sounds played together (<b>▶ Together</b>).'),
      h('div', { class: 'mth-cons' }, ['perf', 'imp', 'dis', 'tri'].map(c => h('div', { class: 'mth-c-card ' + c }, [h('b', { text: L(CONS[c][0], CONS[c][1]).split(' — ')[0] }), h('small', { text: L(CONS[c][0], CONS[c][1]).split(' — ')[1] || '' }),
        h('div', { class: 'mth-c-list' }, IV.filter(v => v.c === c || (c === 'perf' && v.c === 'perf4')).map(v => h('button', { class: 'chip', text: ivShort(v), title: ivName(v), onclick: () => play(root, v, 'tog') })))]))),
      h('p', { class: 'tb-note', html: L('წმინდა კვარტა მელოდიაში კონსონანსია, მაგრამ კლასიკურ ჰარმონიაში ბანთან ერთად დისონანსად ითვლება.', 'The perfect fourth is consonant in a melody, but in classical harmony it counts as a dissonance above the bass.') }), src('general')]));

    w.append(sec('mth.iv.invH', [
      P('თუ ქვედა ნოტს ოქტავით ავწევთ, ინტერვალი <b>შებრუნდება</b>: დო → მი (ტერცია) ხდება მი → დო (სექსტა).', 'Raise the lower note by an octave and the interval is <b>inverted</b>: C → E (a third) becomes E → C (a sixth).'),
      h('ul', { class: 'tb-ul' }, [
        ['სახელების ჯამი ყოველთვის <b>9</b>-ია: ტერცია ↔ სექსტა, სეკუნდა ↔ სეპტიმა, კვარტა ↔ კვინტა.', 'The names always add up to <b>9</b>: third ↔ sixth, second ↔ seventh, fourth ↔ fifth.'],
        ['ნახევარტონების ჯამი — <b>12</b> (ოქტავა): 4 + 8, 3 + 9, 5 + 7.', 'The semitones add up to <b>12</b> (an octave): 4 + 8, 3 + 9, 5 + 7.'],
        ['დიდი ↔ პატარა, გადიდებული ↔ შემცირებული, წმინდა რჩება წმინდა.', 'Major ↔ minor, augmented ↔ diminished, perfect stays perfect.']
      ].map(([ka, en]) => h('li', { html: L(ka, en) }))), src('general')]));

    // the tuning, in intervals — derived from the instrument profile, not typed in
    const open = [1, 2, 3].map(s => Math.round(TH.midi(s, 0))), byS = s => IV.find(v => v.s === s && v.q !== 'A') || null;
    const pairs = [[0, 1], [1, 2], [0, 2]].map(([a, b]) => { const d = open[b] - open[a], v = byS(d); return { a, b, d, v }; }).filter(p => p.v);
    if (pairs.length) w.append(sec('mth.iv.tunH', [
      h('ul', { class: 'tb-ul' }, pairs.map(p => h('li', {}, [h('b', { text: TH.stringName(p.a + 1) + ' → ' + TH.stringName(p.b + 1) }), ' = ' + ivName(p.v) + ' (' + semiTxt(p.d) + ') ',
        h('button', { class: 'btn small', text: '▶', 'aria-label': ivName(p.v), onclick: () => seq([open[p.a], open[p.b], [open[p.a], open[p.b]]], [.6, .7, .1]) })]))),
      P('ფანდურზე ინტერვალი ერთ სიმზე უბრალოდ <b>ლადების რაოდენობაა</b>: 1 ლადი = 1 ნახევარტონი.', 'On the panduri an interval on one string is simply the <b>number of frets</b>: 1 fret = 1 semitone.'), src('fact')]));

    // a short self-test: by note names, or by ear
    const quiz = h('div', { class: 'mth-quiz' });
    w.append(sec('mth.iv.quizH', [quiz]));
    let mode = 'name', right = 0, total = 0;
    function ask() {
      quiz.innerHTML = '';
      const pool = IV.filter(v => v.q !== 'A' && v.q !== 'd' || v.s === 6), v = pool[Math.floor(Math.random() * pool.length)];
      const r = ROOTS[Math.floor(Math.random() * ROOTS.length)], top = above(r, v.step, v.s);
      const opts = [v]; while (opts.length < 4) { const o = pool[Math.floor(Math.random() * pool.length)]; if (!opts.some(x => x.s === o.s)) opts.push(o); }
      opts.sort(() => Math.random() - .5);
      const fb = h('p', { class: 'tb-fb', hidden: true }), next = h('button', { class: 'btn primary small', 'data-t': 'mth.iv.next', hidden: true, onclick: ask });
      const seg = h('div', { class: 'seg', role: 'tablist' }, [['name', 'mth.iv.mName'], ['ear', 'mth.iv.mEar']].map(([k, key]) => h('button', { role: 'tab', 'aria-pressed': String(mode === k), 'data-t': key, onclick: () => { mode = k; ask(); } })));
      const q = mode === 'ear' ? h('div', { class: 'mth-q' }, [h('b', { 'data-t': 'mth.iv.quizHear' }), h('button', { class: 'btn small', 'data-t': 'tb.play', onclick: () => play(r, v, 'up') })])
        : h('div', { class: 'mth-q' }, [h('b', { text: t('mth.iv.quizQ', { a: nm(r), b: nm(top) }) })]);
      quiz.append(seg, q, h('div', { class: 'tb-opts' }, opts.map(o => h('button', { class: 'btn small', text: ivName(o), onclick: e => {
        const good = o.s === v.s; total++; if (good) right++;
        quiz.querySelectorAll('.tb-opts button').forEach(b => { b.disabled = true; }); e.currentTarget.classList.add(good ? 'ok' : 'bad');
        if (!good) quiz.querySelectorAll('.tb-opts button')[opts.indexOf(opts.find(x => x.s === v.s))].classList.add('ok');
        fb.hidden = false; fb.className = 'tb-fb ' + (good ? 'ok' : 'bad'); fb.textContent = (good ? t('mth.iv.right') : t('mth.iv.wrong', { x: ivName(v) })) + ' · ' + t('mth.iv.score', { a: right, b: total });
        if (good && PD.audio.ok) PD.audio.ok(); if (mode === 'name') play(r, v, 'up');
        next.hidden = false;
      } }))), fb, next);
      PD.i18n.apply(quiz);
      if (mode === 'ear') setTimeout(() => play(r, v, 'up'), 150);
    }
    ask();

    w.append(h('div', { class: 'mth-links' }, [
      h('button', { class: 'tbs-glb', onclick: () => PD.app.go('theory', 'intervals') }, [h('b', { 'data-t': 'mth.iv.chapter' }), h('small', { 'data-t': 'tb.tool' })]),
      h('button', { class: 'tbs-glb', onclick: () => PD.app.go('solfege', 'iv:1') }, [h('b', { 'data-t': 'mth.iv.ear' }), h('small', { 'data-t': 'sf.ivD' })])]));
    drawRoots(); drawCards(); drawTable();
  }

  /* ---------- the hub ---------- */
  const GROUPS = [
    ['sound', ['names', 'octave', 'semitone', 'accidentals', 'neck']],
    ['write', ['staff', 'durations', 'rests', 'signs', 'app']],
    ['time', ['meter', 'tempo']],
    ['harm', ['intervals', 'scales', 'chords', 'key']]];
  const II = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  const ICON = {
    iv: II('<path d="M5 19V9M5 9l10-3v10"/><circle cx="3.6" cy="19" r="1.8"/><circle cx="13.6" cy="16" r="1.8"/><path d="M19 7v10M17 9l2-2 2 2M17 15l2 2 2-2"/>'),
    book: II('<path d="M12 6.6C10.2 5.2 7.8 4.6 4 4.6v13c3.8 0 6.2.6 8 2 1.8-1.4 4.2-2 8-2v-13c-3.8 0-6.2.6-8 2z"/><path d="M12 6.6v13"/>'),
    gloss: II('<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11M9 8h6"/>'),
    world: II('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.6 5.4 3.6 8.5s-1.1 5.9-3.6 8.5c-2.5-2.6-3.6-5.4-3.6-8.5s1.1-5.9 3.6-8.5z"/>')
  };
  function page(w, param) {
    if (param === 'intervals') return intervals(w);
    const CH = (PD.theoryBook && PD.theoryBook.CHAPTERS) || [], d = PD.store.get('theory.done', {}), read = CH.filter(c => d[c.id]).length;
    const sfDone = ['hear', 'iv', 'sing'].reduce((a, e) => a + [1, 2, 3].filter(n => PD.solfege.done(e, n)).length, 0);
    const gn = PD.genres && PD.genres.progress ? Math.round(PD.genres.progress() * 100) : 0;
    w.append(h('div', { class: 'mth-head' }, [h('h1', { 'data-t': 'mth.title' }), h('p', { class: 'muted', 'data-t': 'mth.lead' })]));
    const stat = (k, a, b, pct) => h('div', { class: 'mth-stat' }, [h('small', { 'data-t': k }), h('b', { text: b == null ? a + '%' : a + ' / ' + b }), h('div', { class: 'hx-bar' }, [h('i', { style: 'width:' + pct + '%' })])]);
    if (PD.solfege && PD.solfege.voiceSwitch) w.append(PD.solfege.voiceSwitch());   // panduri or piano: every theory page plays with it
    w.append(h('div', { class: 'mth-stats' }, [stat('mth.read', read, CH.length, CH.length ? Math.round(read / CH.length * 100) : 0), stat('mth.sf', sfDone, 9, Math.round(sfDone / 9 * 100)), stat('mth.music', gn, null, gn)]));

    // the interactive pages first: what you can play with
    const tile = (k, dk, icon, go, cls) => h('button', { class: 'mth-tile' + (cls ? ' ' + cls : ''), onclick: go }, [h('span', { class: 'mth-ic', html: icon }), h('span', { class: 'mth-tt' }, [h('b', { 'data-t': k }), h('small', { 'data-t': dk })])]);
    w.append(h('h2', { class: 'mth-h', 'data-t': 'mth.tools' }), h('div', { class: 'mth-tiles' }, [
      PD.advTheory ? tile('av.title', 'av.tile', ICON.world, () => PD.app.go('adv'), 'big') : null,   // the advanced book (app only)
      tile('mth.ivT', 'mth.ivD', ICON.iv, () => PD.app.go('mtheory', 'intervals'), 'big'),
      tile('mth.sfT', 'mth.sfD', ic.ear, () => PD.app.go('solfege'), 'big'),
      tile('cf.title', 'mth.cfD', PD.circle.ICON, () => PD.app.go('circle')),
      tile('mth.scT', 'mth.scD', ic.frets, () => PD.app.go('scales')),
      tile('mth.chT', 'mth.chD', ic.chord, () => PD.app.go('chordhow')),
      tile('mth.glT', 'mth.glD', ICON.gloss, () => PD.app.go('theory', 'glossary')),
      tile('gn.title', 'mth.gnD', ICON.world, () => PD.app.go('music')),
      tile('mth.mtT', 'mth.mtD', ic.metro, () => PD.app.go('metronome'))]));

    // solfège: the three exercises, each with its three levels
    w.append(h('h2', { class: 'mth-h', 'data-t': 'mth.sfT' }), h('div', { class: 'mth-sf' }, ['hear', 'iv', 'sing'].map(e => h('button', { class: 'mth-sfc', onclick: () => PD.app.go('solfege', e + ':' + ([1, 2, 3].find(n => !PD.solfege.done(e, n)) || 3)) }, [
      h('b', { 'data-t': 'sf.' + e }), h('small', { 'data-t': 'sf.' + e + 'D' }),
      h('span', { class: 'mth-dots', 'aria-hidden': 'true' }, [1, 2, 3].map(n => h('i', { class: PD.solfege.done(e, n) ? 'on' : '' })))]))));

    // the book's chapters, by topic (a chapter the groups do not name still shows, under "more")
    const named = new Set([].concat(...GROUPS.map(g => g[1])));
    const groups = GROUPS.concat([['other', CH.filter(c => !named.has(c.id)).map(c => c.id)]]);
    groups.forEach(([k, ids]) => {
      const list = ids.map(id => CH.find(c => c.id === id)).filter(Boolean); if (!list.length) return;
      w.append(h('h2', { class: 'mth-h', 'data-t': 'mth.g.' + k }), h('div', { class: 'tb-list' }, list.map(c => {
        const S = PD.theorySimple && PD.theorySimple.get(c.id), one = S ? L(S.easy[0][0], S.easy[0][1]).replace(/<[^>]+>/g, '') : '';
        return h('button', { class: 'tb-card' + (d[c.id] ? ' done' : ''), onclick: () => PD.app.go('theory', c.id) }, [h('span', { class: 'tb-num', text: d[c.id] ? '✓' : String(CH.indexOf(c) + 1) }), h('span', { class: 'tb-ct' }, [h('b', { text: L(c.t[0], c.t[1]) }), one ? h('small', { text: one }) : null])]);
      })));
      if (k === 'harm') w.append(h('button', { class: 'tbs-glb mth-more', onclick: () => PD.app.go('mtheory', 'intervals') }, [h('b', { 'data-t': 'mth.ivT' }), h('small', { 'data-t': 'mth.ivD' })]));
    });
    w.append(h('p', { class: 'mth-src' }, [src('general'), ' ', src('fact')]));
  }
  return { page, intervals, ICON: ICON.iv };
})();
