/* =====================================================================
   Music theory: notes — everything about notes, for the panduri.
   General music theory (names, octaves, semitones, staff, durations,
   rests, metre, tempo, intervals, scales, chords, keys, signs) shown on
   the panduri's own strings (A3 · C♯4 · E4, 17 frets) with sound.
   Each chapter ends with a short self-check. Progress is kept per device
   (and in the account backup).
   ===================================================================== */
PD.i18n.add({
  'tb.title': ['მუსიკის თეორია: ნოტები', 'Music theory: notes'], 'tb.lead': ['ყველაფერი ნოტებზე — სახელებიდან ტონალობამდე, ფანდურის სიმებზე და ხმით.', 'Everything about notes — from names to keys, on the panduri\'s strings and with sound.'],
  'tb.read': ['{a} / {b} თავი', '{a} / {b} chapters'], 'tb.next': ['შემდეგი თავი', 'Next chapter'], 'tb.prev': ['წინა', 'Previous'], 'tb.list': ['ყველა თავი', 'All chapters'], 'tb.done': ['დასრულებული', 'Done'],
  'tb.check': ['შეამოწმე თავი', 'Check yourself'], 'tb.right': ['სწორია!', 'Correct!'], 'tb.wrong': ['არა — ', 'Not quite — '], 'tb.play': ['▶ მოსმენა', '▶ Listen'], 'tb.finish': ['დასრულება', 'Finish'],
  'tb.tool': ['ნოტები, ოქტავა, ხუთხაზედი, ხანგრძლივობა, ინტერვალები, გამები, აკორდები.', 'Notes, octaves, staff, durations, intervals, scales, chords.'], 'tb.chapter': ['თავი {n}', 'Chapter {n}']
});

PD.theoryBook = (() => {
  const h = PD.h, A = PD.notesArt, TH = PD.theory;
  const L = (ka, en) => PD.i18n.pick({ ka, en });
  const LET = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  /** 'C♯4' → midi */
  const M = n => { const m = /^([A-G])([♯♭#b]?)(-?\d)$/.exec(n); return 12 * (+m[3] + 1) + LET[m[1]] + (m[2] === '♯' || m[2] === '#' ? 1 : m[2] === '♭' || m[2] === 'b' ? -1 : 0); };
  const NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'], KA = ['დო', 'დო♯', 'რე', 'რე♯', 'მი', 'ფა', 'ფა♯', 'სოლ', 'სოლ♯', 'ლა', 'ლა♯', 'სი'];
  /* ---------- sound ---------- */
  function playM(m, when) {
    const pos = TH.positions(m).sort((a, b) => a.f - b.f)[0];
    if (pos) PD.audio.note(pos.s, pos.f, { when, vel: .75 }); else PD.audio.tone(m, .9);
  }
  /** play a sequence: items are midi numbers, arrays (played together) or null (silence); gap in seconds (or an array of durations) */
  function seq(items, gap) {
    PD.audio.ensure(); const ctx = PD.audio.ctx; if (!ctx) return;
    let t = ctx.currentTime + .06;
    items.forEach((m, i) => { if (m != null) [].concat(m).forEach(x => playM(x, t)); t += Array.isArray(gap) ? gap[i] : gap; });
  }
  /* ---------- building blocks ---------- */
  const P = (ka, en) => h('p', { class: 'tb-p', html: L(ka, en) });
  const H = (ka, en) => h('h3', { class: 'tb-h', text: L(ka, en) });
  const UL = items => h('ul', { class: 'tb-ul' }, items.map(([ka, en]) => h('li', { html: L(ka, en) })));
  const SVG = html => h('div', { class: 'tb-art', html });
  const BTN = (ka, en, fn) => h('button', { class: 'btn small tb-play', text: '▶ ' + L(ka, en), onclick: fn });
  const NOTE = (m, label) => h('button', { class: 'tb-n', onclick: () => seq([m], .1) }, [h('b', { text: label || TH.name(m) }), h('small', { text: KA[TH.pc(m)] })]);
  const TABLE = (head, rows) => h('div', { class: 'tb-tw' }, [h('table', { class: 'tb-t' }, [h('thead', {}, [h('tr', {}, head.map(c => h('th', { text: c })))]), h('tbody', {}, rows.map(r => h('tr', {}, r.map(c => c && c.nodeType ? h('td', {}, [c]) : h('td', { html: String(c) })))))])]);
  const NOTICE = (ka, en) => h('p', { class: 'tb-note', html: L(ka, en) });
  const where = m => TH.positions(m).map(p => TH.stringName(p.s) + (p.f ? ' · ' + p.f : ' · 0')).join(' / ');

  /* ---------- the chapters ---------- */
  const CH = [
    { id: 'names', t: ['ბგერა და ნოტის სახელები', 'Sound and note names'], body: b => {
      b.append(P('<b>ბგერას</b> აქვს სიმაღლე: რაც უფრო სწრაფად ირხევა სიმი, მით უფრო მაღალია ბგერა. <b>ნოტი</b> ბგერის სახელი და მისი ჩაწერის ნიშანია.', 'A <b>sound</b> has a pitch: the faster a string vibrates, the higher the sound. A <b>note</b> is the name of a sound and the sign used to write it.'),
        P('მუსიკაში 7 ძირითადი ნოტია. მათ ორი სახელწოდების სისტემით ვწერთ — ორივე ერთსა და იმავეს ნიშნავს:', 'There are 7 basic notes. Two naming systems are used — they mean the same thing:'),
        TABLE([L('სილაბური', 'Solfège'), L('ასოებით', 'Letters')], [['დო', 'C'], ['რე', 'D'], ['მი', 'E'], ['ფა', 'F'], ['სოლ', 'G'], ['ლა', 'A'], ['სი', 'B']]),
        P('ფანდურზე ყველა მათგანის დაკვრა შეიძლება — დააჭირე და მოუსმინე:', 'All of them can be played on the panduri — tap to listen:'),
        h('div', { class: 'tb-ns' }, ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'].map(n => NOTE(M(n), n))),
        BTN('მთლიანად, ზემოთ', 'All, going up', () => seq(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'].map(M), .42)),
        P('სი-ს შემდეგ ისევ დო მოდის, ოღონდ უფრო მაღლა — სახელები წრეზე მეორდება.', 'After B comes C again, only higher — the names repeat in a circle.'),
        NOTICE('ზოგ ქვეყანაში B-ს ნაცვლად H-ს წერენ (გერმანული სისტემა). ამ აპში ყველგან B-ა.', 'Some countries write H instead of B (German system). This app always uses B.'));
    }, q: [
      [['რომელი ასოა „სოლ“?', 'Which letter is “sol”?'], ['G', 'F', 'A', 'E'], 0, ['დო C, რე D, მი E, ფა F, სოლ G.', 'do C, re D, mi E, fa F, sol G.']],
      [['რომელი ნოტი მოდის სი-ს (B) შემდეგ?', 'Which note comes after B?'], [['დო (C)', 'C (do)'], ['ლა (A)', 'A (la)'], ['რე (D)', 'D (re)']], 0, ['სახელები წრეზე მეორდება: … ლა სი დო რე …', 'The names repeat: … A B C D …']]] },

    { id: 'octave', t: ['ოქტავა და ბგერის სიმაღლე', 'Octaves and pitch'], body: b => {
      b.append(P('ორ ერთსახელიან ნოტს შორის მანძილს <b>ოქტავა</b> ჰქვია. ზედა ნოტი ორჯერ უფრო სწრაფად ირხევა: <b>ლა3 = 220 ჰც, ლა4 = 440 ჰც, ლა5 = 880 ჰც</b>.', 'The distance between two notes with the same name is an <b>octave</b>. The upper one vibrates twice as fast: <b>A3 = 220 Hz, A4 = 440 Hz, A5 = 880 Hz</b>.'),
        P('ოქტავას ნომრით აღვნიშნავთ: <b>C4</b> პიანინოს შუა „დო“ა; C4-დან B4-მდე ყველა ნოტს ნომერი 4 აქვს, C5-დან — 5.', 'Octaves are numbered: <b>C4</b> is middle C on the piano; every note from C4 up to B4 carries the number 4, from C5 on — 5.'),
        h('div', { class: 'tb-ns' }, ['A3', 'A4', 'A5'].map(n => NOTE(M(n), n))), BTN('ლა სამ ოქტავაში', 'A in three octaves', () => seq(['A3', 'A4', 'A5'].map(M), .7)),
        H('ფანდურის სიმები', 'The panduri\'s strings'),
        TABLE([L('სიმი', 'String'), L('ნოტი', 'Note'), L('სიხშირე', 'Frequency')], [['A (ლა)', 'A3', '220.0 ' + L('ჰც', 'Hz')], ['C♯ (დო დიეზი)', 'C♯4', '277.2 ' + L('ჰც', 'Hz')], ['E (მი)', 'E4', '329.6 ' + L('ჰც', 'Hz')]]),
        P('17 ლადით ფანდური <b>A3-დან A5-მდე</b> უკრავს — ზუსტად ორ ოქტავას. ყველაზე დაბალი ბგერა A სიმის ღია ბგერაა, ყველაზე მაღალი — E სიმის მე-17 ლადი.', 'With 17 frets the panduri plays from <b>A3 to A5</b> — exactly two octaves. The lowest sound is the open A string, the highest is the 17th fret of the E string.'),
        BTN('ფანდურის მთელი დიაპაზონი', 'The whole range', () => seq(['A3', 'A4', 'A5'].map(M), .8)));
    }, q: [
      [['A4 = 440 ჰც. რამდენია A5?', 'A4 = 440 Hz. What is A5?'], [['880 ჰც', '880 Hz'], ['660 ჰც', '660 Hz'], ['220 ჰც', '220 Hz']], 0, ['ოქტავით ზემოთ — ორჯერ მეტი.', 'One octave up — twice as much.']],
      [['რომელია ფანდურის ყველაზე დაბალი ბგერა?', 'Which is the panduri\'s lowest sound?'], ['A3 — ღია A სიმი', 'E4 — ღია E სიმი', 'C4'], 0, ['A სიმი (A3) ყველაზე დაბალია.', 'The A string (A3) is the lowest.']]] },

    { id: 'semitone', t: ['ნახევარტონი, ტონი და 12 ბგერა', 'Semitones, tones and the 12 notes'], body: b => {
      b.append(P('ოქტავაში სულ <b>12 სხვადასხვა ბგერაა</b>. ორ მეზობელ ბგერას შორის ყველაზე მცირე მანძილს <b>ნახევარტონი</b> ჰქვია; ორი ნახევარტონი = <b>ტონი</b>.', 'An octave holds <b>12 different notes</b>. The smallest step between two neighbours is a <b>semitone</b>; two semitones = a <b>tone</b>.'),
        SVG(A.keyboard({ hi: ['E', 'F', 'B'] })),
        P('კლავიატურაზე კარგად ჩანს: შავი კლავიში თეთრებს შორის ნახევარტონია. <b>მი–ფა (E–F)</b> და <b>სი–დო (B–C)</b> შორის შავი კლავიში არ არის — ისინი ერთმანეთისგან მხოლოდ ნახევარტონით არიან დაშორებული; დანარჩენი თეთრი ნოტები — ტონით.', 'On a keyboard: a black key between two white keys is a semitone away from each. Between <b>E–F</b> and <b>B–C</b> there is no black key — they are only a semitone apart; the other white notes are a tone apart.'),
        H('ფანდურზე', 'On the panduri'),
        UL([['<b>1 ლადი = 1 ნახევარტონი.</b> ერთი ლადით ზემოთ — ბგერა ნახევარტონით მაღლდება.', '<b>1 fret = 1 semitone.</b> One fret up raises the sound by a semitone.'], ['<b>2 ლადი = 1 ტონი.</b>', '<b>2 frets = 1 tone.</b>'], ['<b>12 ლადი = ოქტავა.</b> მე-12 ლადზე ღია სიმის ბგერა მეორდება, ოქტავით მაღლა.', '<b>12 frets = an octave.</b> At the 12th fret the open string\'s note returns, an octave higher.']]),
        BTN('A სიმი: 0 → 12 ლადი, ნახევარტონებით', 'A string: frets 0 → 12 in semitones', () => seq(Array.from({ length: 13 }, (_, i) => M('A3') + i), .3)),
        P('12 ბგერის რიგს <b>ქრომატული გამა</b> ჰქვია: C · C♯ · D · D♯ · E · F · F♯ · G · G♯ · A · A♯ · B.', 'The row of all 12 notes is the <b>chromatic scale</b>: C · C♯ · D · D♯ · E · F · F♯ · G · G♯ · A · A♯ · B.'));
    }, q: [
      [['რამდენი ლადია ერთი ტონი?', 'How many frets make a tone?'], ['2', '1', '12'], 0, ['1 ლადი = ნახევარტონი, 2 ლადი = ტონი.', '1 fret = a semitone, 2 frets = a tone.']],
      [['რომელ ნოტებს შორის არის მხოლოდ ნახევარტონი?', 'Which notes are only a semitone apart?'], [['მი–ფა და სი–დო', 'E–F and B–C'], ['დო–რე და ფა–სოლ', 'C–D and F–G'], ['ლა–სი', 'A–B']], 0, ['E–F და B–C შორის შავი კლავიში არ არის.', 'There is no black key between E–F and B–C.']],
      [['მე-12 ლადზე ღია A სიმის ბგერა…', 'At the 12th fret the open A string\'s note…'], ['ოქტავით მაღლა მეორდება (A4)', 'C ხდება', 'არ იცვლება'], 0, ['12 ნახევარტონი = ოქტავა.', '12 semitones = an octave.']]] },

    { id: 'accidentals', t: ['დიეზი, ბემოლი, ბეკარი', 'Sharps, flats, naturals'], body: b => {
      b.append(TABLE([L('ნიშანი', 'Sign'), L('სახელი', 'Name'), L('რას აკეთებს', 'What it does')], [
        ['♯', L('დიეზი', 'sharp'), L('ნახევარტონით ამაღლებს (ფანდურზე: +1 ლადი)', 'raises by a semitone (panduri: +1 fret)')],
        ['♭', L('ბემოლი', 'flat'), L('ნახევარტონით ადაბლებს (−1 ლადი)', 'lowers by a semitone (−1 fret)')],
        ['♮', L('ბეკარი', 'natural'), L('აუქმებს დიეზს ან ბემოლს', 'cancels a sharp or flat')],
        ['𝄪', L('დუბლ-დიეზი', 'double sharp'), L('ტონით ამაღლებს', 'raises by a tone')],
        ['𝄫', L('დუბლ-ბემოლი', 'double flat'), L('ტონით ადაბლებს', 'lowers by a tone')]]),
        P('ერთ ბგერას ორი სახელი შეიძლება ჰქონდეს — მაგ. <b>C♯ = D♭</b>, <b>A♯ = B♭</b>. ასეთ ნოტებს <b>ენჰარმონიულად თანაბარს</b> ვუწოდებთ: ჟღერს ერთნაირად, იწერება სხვადასხვანაირად.', 'One sound can have two names — e.g. <b>C♯ = D♭</b>, <b>A♯ = B♭</b>. Such notes are <b>enharmonic</b>: they sound the same but are written differently.'),
        SVG(A.staff([{ l: 'C', o: 4, label: 'C4' }, { l: 'C', o: 4, acc: '♯', label: 'C♯4' }, { l: 'D', o: 4, acc: '♭', label: 'D♭4' }, { l: 'B', o: 4, acc: '♭', label: 'B♭4' }, { l: 'B', o: 4, acc: '♮', label: 'B4' }], { width: 300 })),
        P('ფანდურის შუა სიმი თავად <b>C♯</b>-ზეა აწყობილი (დო დიეზი). „ბანი-აჭარულის“ <b>B♭</b> (სი ბემოლი) A სიმის პირველ ლადზეა.', 'The panduri\'s middle string is itself tuned to <b>C♯</b>. The <b>B♭</b> of “Bani-Acharuli” is on the 1st fret of the A string.'),
        P('<b>ალტერაციის ნიშნები გასაღებთან</b> (ტაქტის დასაწყისში) მთელ ნაწარმოებზე მოქმედებს; ნოტის წინ დაწერილი ნიშანი — მხოლოდ ამ ტაქტის ბოლომდე.', '<b>Key signatures</b> (at the start of each line) apply to the whole piece; a sign written before a note lasts only to the end of that bar.'),
        BTN('C → C♯ → D', 'C → C♯ → D', () => seq([M('C4'), M('C♯4'), M('D4')], .55)));
    }, q: [
      [['B♭ ფანდურის A სიმზე რომელ ლადზეა?', 'Where is B♭ on the A string?'], [['1-ზე', 'Fret 1'], ['2-ზე', 'Fret 2'], ['ღიაა', 'Open string']], 0, ['A + 1 ნახევარტონი = A♯ = B♭.', 'A + 1 semitone = A♯ = B♭.']],
      [['რა ნიშნავს ♮?', 'What does ♮ mean?'], [['აუქმებს ♯ ან ♭-ს', 'Cancels a ♯ or ♭'], ['ამაღლებს ტონით', 'Raises by a tone'], ['ხმამაღლა დაუკარი', 'Play loudly']], 0, ['ბეკარი ნოტს ჩვეულ სახეს უბრუნებს.', 'A natural returns the note to its plain form.']]] },

    { id: 'neck', t: ['ნოტები ფანდურის ტარზე', 'Notes on the panduri neck'], body: b => {
      const MK = (PD.instrument.profile && PD.instrument.profile.markers) || { single: [3, 5, 7, 9, 15], double: [12] }, MKS = MK.single.concat(MK.double || []).sort((x, y) => x - y);   // the instrument's own fret dots
      b.append(P('ყველა ბგერა ყველა ლადზე — <b>3 სიმი × 18 ადგილი</b> (0 = ღია სიმი, 1–17 = ლადები). დააჭირე ნებისმიერ უჯრას და მოისმენ.', 'Every sound on every fret — <b>3 strings × 18 places</b> (0 = open string, 1–17 = frets). Tap any cell to hear it.'));
      const rows = [3, 2, 1].map(s => [h('b', { text: TH.stringName(s), style: 'color:' + TH.color(s) })].concat(Array.from({ length: TH.FRETS + 1 }, (_, f) => { const m = TH.midi(s, f); return h('button', { class: 'tb-cell' + (MKS.includes(f) ? ' mk' : ''), onclick: () => { PD.audio.ensure(); PD.audio.note(s, f); } }, [h('b', { text: TH.pcName(m) }), h('small', { text: TH.nameKa(m) + ' ' + (Math.floor(Math.round(m) / 12) - 1) })]); })));
      b.append(TABLE([L('სიმი', 'String')].concat(Array.from({ length: TH.FRETS + 1 }, (_, f) => String(f))), rows),
        P('ზედა რიგი ეკრანზე ზედა (E) სიმია, ქვედა — A, ისე როგორც გაკვეთილების ტარზე.', 'The top row is the top (E) string on screen and the bottom row the A string — as on the lessons\' neck.'),
        H('ერთი ბგერა — რამდენიმე ადგილას', 'One sound — several places'),
        P('ზოგი ბგერა სხვადასხვა სიმზეა: მაგ. <b>E4</b> = ' + where(M('E4')) + '. ასე შეგიძლია აირჩიო, რომელი ადგილი უფრო მოსახერხებელია.', 'Some sounds sit on several strings: e.g. <b>E4</b> = ' + where(M('E4')) + '. So you can choose the most comfortable place.'),
        BTN('E4 სამ ადგილას', 'E4 in three places', () => { PD.audio.ensure(); const ctx = PD.audio.ctx, t0 = ctx.currentTime + .05; TH.positions(M('E4')).forEach((p, i) => PD.audio.note(p.s, p.f, { when: t0 + i * .6 })); }),
        NOTICE('ლადის ნიშნები (წერტილები) ' + MKS.join(', ') + ' ლადზეა' + ((MK.double || []).length ? ' (მე-' + MK.double.join(', ') + ' — ორმაგი)' : '') + ' — ცხრილში ეს სვეტები გამოყოფილია.', 'Fret markers sit at frets ' + MKS.join(', ') + ((MK.double || []).length ? ' (' + MK.double.join(', ') + ' double)' : '') + ' — those columns are highlighted.'));
    }, q: [
      [['C♯ სიმის მე-3 ლადი რომელი ნოტია?', 'Which note is the C♯ string, 3rd fret?'], ['E', 'D', 'F'], 0, ['C♯ + 3 ნახევარტონი = E.', 'C♯ + 3 semitones = E.']],
      [['A სიმის მე-5 ლადი?', 'A string, 5th fret?'], ['D', 'C', 'E'], 0, ['A → A♯ → B → C → C♯ → D.', 'A → A♯ → B → C → C♯ → D.']],
      [['E სიმის მე-12 ლადი?', 'E string, 12th fret?'], [['E (ოქტავით მაღლა)', 'E (an octave higher)'], 'A', 'B'], 0, ['12 ლადი = ოქტავა.', '12 frets = an octave.']]] },

    { id: 'staff', t: ['ხუთხაზედი და გასაღები', 'The staff and clefs'], body: b => {
      b.append(P('ნოტები იწერება <b>ხუთხაზედზე</b> — ხუთ ჰორიზონტალურ ხაზზე. ხაზებს და მათ შორის შუალედებს <b>ქვემოდან ზემოთ</b> ვითვლით; რაც უფრო მაღლაა ნოტი, მით უფრო მაღალია ბგერა.', 'Notes are written on a <b>staff</b> of five lines. Lines and spaces are counted <b>from the bottom up</b>; the higher the note sits, the higher the sound.'),
        P('<b>სოლის (ვიოლინოს) გასაღები</b> 𝄞 მეორე ხაზზე იწყება და ამბობს: „ამ ხაზზე სოლია (G4)“. აქედან ყველა სხვა ნოტის ადგილი გამომდინარეობს:', 'The <b>treble (G) clef</b> curls around the 2nd line and says: “this line is G4”. Every other note follows from it:'),
        SVG(A.staff([{ l: 'E', o: 4, d: 'w', label: 'E' }, { l: 'G', o: 4, d: 'w', label: 'G' }, { l: 'B', o: 4, d: 'w', label: 'B' }, { l: 'D', o: 5, d: 'w', label: 'D' }, { l: 'F', o: 5, d: 'w', label: 'F' }], { width: 320 })),
        UL([['<b>ხაზებზე</b> (ქვემოდან): მი · სოლ · სი · რე · ფა — E G B D F', '<b>Lines</b> (bottom up): E G B D F'], ['<b>შუალედებში</b>: ფა · ლა · დო · მი — F A C E', '<b>Spaces</b>: F A C E']]),
        SVG(A.staff([{ l: 'F', o: 4, d: 'w', label: 'F' }, { l: 'A', o: 4, d: 'w', label: 'A' }, { l: 'C', o: 5, d: 'w', label: 'C' }, { l: 'E', o: 5, d: 'w', label: 'E' }], { width: 270 })),
        H('დამატებითი ხაზები', 'Ledger lines'),
        P('ხუთხაზედს ქვემოთ ან ზემოთ მოკლე <b>დამატებითი ხაზები</b> იწერება. ფანდურის ღია სიმები ასე გამოიყურება (ნამდვილი სიმაღლით): A3 ორ დამატებით ხაზზე, C♯4 — პირველ დამატებით ხაზზე დიეზით, E4 — პირველ ხაზზე.', 'Short <b>ledger lines</b> extend the staff below or above. The panduri\'s open strings look like this (at sounding pitch): A3 on the second ledger line, C♯4 on the first ledger line with a sharp, E4 on the bottom line.'),
        SVG(A.staff([{ l: 'A', o: 3, d: 'w', label: 'A3' }, { l: 'C', o: 4, acc: '♯', d: 'w', label: 'C♯4' }, { l: 'E', o: 4, d: 'w', label: 'E4' }, { l: 'A', o: 5, d: 'w', label: 'A5' }], { width: 300 })),
        BTN('ღია სიმები', 'Open strings', () => seq([M('A3'), M('C♯4'), M('E4')], .6)),
        H('ფას (ბანის) გასაღები', 'Bass (F) clef'),
        P('დაბალი ინსტრუმენტებისთვის <b>ფას გასაღები</b> 𝄢 გამოიყენება: მისი ორი წერტილი მეოთხე ხაზს (F3) აკრავს.', 'Low instruments use the <b>bass clef</b> 𝄢: its two dots surround the 4th line (F3).'),
        SVG(A.staff([{ l: 'F', o: 3, d: 'w', label: 'F3' }, { l: 'A', o: 3, d: 'w', label: 'A3' }, { l: 'C', o: 4, d: 'w', label: 'C4' }], { clef: 'bass', width: 240 })));
    }, q: [
      [['სოლის გასაღებში რომელი ნოტია ქვედა ხაზზე?', 'In the treble clef, which note is on the bottom line?'], [['E (მი)', 'E (mi)'], ['G (სოლ)', 'G (sol)'], ['F (ფა)', 'F (fa)']], 0, ['ხაზები: E G B D F.', 'Lines: E G B D F.']],
      [['რა სიტყვას ქმნის შუალედები სოლის გასაღებში?', 'Which word do the spaces spell in the treble clef?'], ['F A C E', 'E G B D', 'A C E G'], 0, ['შუალედები: ფა ლა დო მი = F A C E.', 'Spaces: F A C E.']]] },

    { id: 'durations', t: ['ნოტის ხანგრძლივობა', 'Note values (durations)'], body: b => {
      b.append(P('ნოტის ფორმა გვეუბნება, <b>რამდენ ხანს</b> ჟღერს ბგერა. ითვლება დარტყმებით (წილებით); 4/4 ზომაში:', 'A note\'s shape tells <b>how long</b> it lasts, counted in beats; in 4/4:'));
      const row = (d, ka, en, beats, ms) => [h('span', { html: A.symbol('note', d) }), L(ka, en), beats, h('button', { class: 'btn small', text: '▶', onclick: () => seq(Array.from({ length: Math.max(1, Math.round(4 / ms)) }, () => M('A3')), ms * .6) })];
      b.append(TABLE([L('ნიშანი', 'Sign'), L('სახელი', 'Name'), L('დარტყმა', 'Beats'), ''], [row('w', 'მთელი', 'whole', '4', 4), row('h', 'ნახევარი', 'half', '2', 2), row('q', 'მეოთხედი', 'quarter', '1', 1), row('e', 'მერვედი', 'eighth', '½', .5), row('s', 'მეთექვსმეტედი', 'sixteenth', '¼', .25)]),
        P('ყოველი შემდეგი ორჯერ მოკლეა: 1 მთელი = 2 ნახევარი = 4 მეოთხედი = 8 მერვედი = 16 მეთექვსმეტედი. ნოტის ნაწილები: <b>თავი</b> (ოვალი), <b>ღერო</b> (ხაზი) და <b>დროშა</b>; რამდენიმე მერვედი ხშირად ერთი ხაზით ერთიანდება.', 'Each value is half the previous one: 1 whole = 2 halves = 4 quarters = 8 eighths = 16 sixteenths. A note has a <b>head</b>, a <b>stem</b> and <b>flags</b>; several eighths are often joined by a beam.'),
        H('წერტილი, ლიგა, ტრიოლი', 'Dot, tie, triplet'),
        UL([['<b>წერტილი ნოტთან</b> ხანგრძლივობას ნახევრით ზრდის: წერტილიანი მეოთხედი = 1½ დარტყმა (= 3 მერვედი).', '<b>A dot</b> adds half the value: a dotted quarter = 1½ beats (= 3 eighths).'], ['<b>ლიგა</b> (რკალი ერთნაირ ნოტებს შორის) მათ ხანგრძლივობას აერთებს — მეორე ნოტი აღარ იკვრება.', '<b>A tie</b> (an arc between two equal notes) adds their lengths — the second note is not struck again.'], ['<b>ტრიოლი</b> (3) — სამი თანაბარი ნოტი ორის ადგილას (მაგ. 2/4-ში). 6/8 ზომაში დარტყმა ისედაც სამ მერვედად იყოფა — ასე იწერება აჭარულის რითმიც (↓ ↓ ↑), ტრიოლის ნიშნის გარეშე.', '<b>A triplet</b> (3) — three equal notes in the time of two (e.g. in 2/4). In 6/8 a beat is already three eighths — that is how the Acharuli rhythm (↓ ↓ ↑) is written, without a triplet sign.']]),
        SVG(A.staff([{ l: 'A', o: 4, d: 'q', dot: 1, label: '1½' }, { l: 'A', o: 4, d: 'e', label: '½' }, { l: 'A', o: 4, d: 'h', label: '2' }, { l: 'A', o: 4, d: 'h', dot: 1, label: '3' }, { l: 'A', o: 4, d: 'q', label: '1' }], { width: 330, time: [4, 4], bars: [200], end: true })),   // two full bars: 1½+½+2 = 4 · 3+1 = 4
        BTN('წერტილიანი რიტმი', 'Dotted rhythm', () => seq([M('A4'), M('A4'), M('A4'), M('A4'), M('A4')], [.75, .25, 1, 1.5, .5])));
    }, q: [
      [['რამდენი მერვედია ერთ ნახევარში?', 'How many eighths are in a half note?'], ['4', '2', '8'], 0, ['ნახევარი = 2 მეოთხედი = 4 მერვედი.', 'Half = 2 quarters = 4 eighths.']],
      [['წერტილიანი მეოთხედი რამდენი დარტყმაა?', 'How many beats is a dotted quarter?'], ['1½', '2', '1¼'], 0, ['1 + ½ = 1½.', '1 + ½ = 1½.']]] },

    { id: 'rests', t: ['პაუზები', 'Rests'], body: b => {
      b.append(P('<b>პაუზა</b> დუმილის ნიშანია — მუსიკა გრძელდება, მაგრამ ამ დროს არ ვუკრავთ. ყოველ ხანგრძლივობას თავისი პაუზა აქვს:', 'A <b>rest</b> is a sign for silence — the music goes on, but you do not play. Every note value has its rest:'),
        TABLE([L('ნოტი', 'Note'), L('პაუზა', 'Rest'), L('სახელი', 'Name'), L('დარტყმა', 'Beats')], [
          [h('span', { html: A.symbol('note', 'w') }), h('span', { html: A.symbol('rest', 'w') }), L('მთელი პაუზა', 'whole rest'), '4'],
          [h('span', { html: A.symbol('note', 'h') }), h('span', { html: A.symbol('rest', 'h') }), L('ნახევარი პაუზა', 'half rest'), '2'],
          [h('span', { html: A.symbol('note', 'q') }), h('span', { html: A.symbol('rest', 'q') }), L('მეოთხედი პაუზა', 'quarter rest'), '1'],
          [h('span', { html: A.symbol('note', 'e') }), h('span', { html: A.symbol('rest', 'e') }), L('მერვედი პაუზა', 'eighth rest'), '½'],
          [h('span', { html: A.symbol('note', 's') }), h('span', { html: A.symbol('rest', 's') }), L('მეთექვსმეტედი პაუზა', 'sixteenth rest'), '¼']]),
        P('დასამახსოვრებლად: <b>მთელი პაუზა ხაზზე „კიდია“</b> (ქვემოთ), <b>ნახევარი ხაზზე „ზის“</b> (ზემოთ). ფანდურზე პაუზის დროს სიმებს ხელს ოდნავ ადებენ, რომ ბგერა გაჩუმდეს.', 'To remember: the <b>whole rest hangs</b> below a line, the <b>half rest sits</b> on top of one. On the panduri you lightly touch the strings during a rest to stop the sound.'),
        SVG(A.staff([{ l: 'A', o: 4, d: 'q', label: '1' }, { rest: 'q', label: '2' }, { l: 'A', o: 4, d: 'q', label: '3' }, { rest: 'q', label: '4' }], { width: 260, time: [4, 4] })),
        BTN('ნოტი · პაუზა · ნოტი · პაუზა', 'Note · rest · note · rest', () => seq([M('A4'), null, M('A4'), null], .55)));
    }, q: [
      [['რომელი პაუზა „კიდია“ ხაზზე?', 'Which rest hangs below a line?'], [['მთელი', 'Whole rest'], ['ნახევარი', 'Half rest'], ['მეოთხედი', 'Quarter rest']], 0, ['მთელი კიდია, ნახევარი ზის.', 'The whole rest hangs, the half rest sits.']]] },

    { id: 'meter', t: ['ზომა, ტაქტი და 6/8', 'Time signatures, bars and 6/8'], body: b => {
      b.append(P('მუსიკა თანაბარ ნაწილებად — <b>ტაქტებად</b> — იყოფა, ტაქტებს შორის <b>ტაქტის ხაზია</b>. დასაწყისში <b>ზომა</b> წერია — ორი რიცხვი:', 'Music is divided into equal parts — <b>bars</b> — separated by <b>bar lines</b>. At the start a <b>time signature</b> shows two numbers:'),
        UL([['<b>ზედა</b> — რამდენი წილია ტაქტში;', '<b>top</b> — how many beats in a bar;'], ['<b>ქვედა</b> — რომელი ნოტია ერთი წილი (4 = მეოთხედი, 8 = მერვედი).', '<b>bottom</b> — which note is one beat (4 = quarter, 8 = eighth).']]),
        TABLE([L('ზომა', 'Time'), L('წილები', 'Beats'), L('აქცენტები', 'Accents')], [['2/4', '2 × ♩', L('ძლიერი – სუსტი', 'strong – weak')], ['3/4', '3 × ♩', L('ძლიერი – სუსტი – სუსტი (ვალსი)', 'strong – weak – weak (waltz)')], ['4/4', '4 × ♩', L('ძლიერი – სუსტი – საშუალო – სუსტი', 'strong – weak – medium – weak')], ['6/8', '6 × ♪', L('ორ ჯგუფად: <b>1</b> 2 3 <b>4</b> 5 6', 'in two groups: <b>1</b> 2 3 <b>4</b> 5 6')]]),
        H('6/8 და აჭარულის რითმი', '6/8 and the Acharuli rhythm'),
        P('6/8-ში ტაქტი <b>ორ დიდ წილად</b> იყოფა, თითოეული — სამ მერვედად. სწორედ ასეა „ბანი-აჭარული“: <b>ერთი რითმი</b> (ჩაკვრა · ჩაკვრა · ამოკვრა = ↓ ↓ ↑) არის <b>სამი მერვედი</b> (= ერთი წერტილიანი მეოთხედი), ერთ ტაქტში <b>ორი რითმია</b>.', 'In 6/8 a bar has <b>two big beats</b>, each split into three eighths. That is exactly “Bani-Acharuli”: <b>one rhythm</b> (down · down · up = ↓ ↓ ↑) is <b>three eighths</b> (= one dotted quarter); a bar holds <b>two rhythms</b>.'),
        SVG(A.staff([{ l: 'A', o: 4, d: 'e', label: '↓' }, { l: 'A', o: 4, d: 'e', label: '↓' }, { l: 'A', o: 4, d: 'e', label: '↑' }, { l: 'A', o: 4, d: 'e', label: '↓' }, { l: 'A', o: 4, d: 'e', label: '↓' }, { l: 'A', o: 4, d: 'e', label: '↑' }], { width: 360, time: [6, 8], gap: 46, end: true })),
        P('ამიტომ: <b>Dm = 2 რითმი = 1 ტაქტი</b>; <b>B♭ + C = 1 + 1 რითმი = 1 ტაქტი</b>. ოთხი რითმი (2 ტაქტი) მთელ სიმღერაში მეორდება.', 'So: <b>Dm = 2 rhythms = 1 bar</b>; <b>B♭ + C = 1 + 1 rhythm = 1 bar</b>. Four rhythms (2 bars) repeat through the whole song.'),
        BTN('ერთი ტაქტი 6/8-ში', 'One bar of 6/8', () => seq(Array.from({ length: 6 }, (_, i) => i % 3 === 0 ? [M('A3'), M('C♯4'), M('E4')] : M('A3')), .2)));
    }, q: [
      [['3/4 ზომაში რამდენი მეოთხედია ტაქტში?', 'How many quarters in a bar of 3/4?'], ['3', '4', '6'], 0, ['ზედა რიცხვი — წილების რაოდენობა.', 'The top number is the number of beats.']],
      [['აჭარულის ერთი რითმი (↓ ↓ ↑) 6/8-ში რამდენი მერვედია?', 'One Acharuli rhythm (↓ ↓ ↑) in 6/8 is how many eighths?'], ['3', '6', '2'], 0, ['სამი დარტყმა = სამი მერვედი; ტაქტში ორი რითმია.', 'Three strokes = three eighths; a bar holds two rhythms.']]] },

    { id: 'tempo', t: ['ტემპი და მეტრონომი', 'Tempo and the metronome'], body: b => {
      b.append(P('<b>ტემპი</b> მუსიკის სისწრაფეა, იზომება <b>BPM</b>-ით — დარტყმები წუთში. 60 BPM = წამში ერთი დარტყმა, 120 BPM = წამში ორი. <b>მეტრონომი</b> ამ დარტყმებს ხმამაღლა ითვლის.', '<b>Tempo</b> is the speed of music, measured in <b>BPM</b> — beats per minute. 60 BPM = one beat per second, 120 BPM = two. A <b>metronome</b> clicks those beats.'),
        TABLE([L('ტერმინი', 'Term'), L('მნიშვნელობა', 'Meaning'), L('BPM (მიახლოებით)', 'BPM (about)')], [['Largo', L('ძალიან ნელა', 'very slow'), '40–60'], ['Adagio', L('ნელა', 'slow'), '66–76'], ['Andante', L('ნაბიჯის ტემპით', 'walking pace'), '76–108'], ['Moderato', L('ზომიერად', 'moderate'), '108–120'], ['Allegro', L('სწრაფად', 'fast'), '120–156'], ['Presto', L('ძალიან სწრაფად', 'very fast'), '168–200']]),
        UL([['<b>accelerando</b> — თანდათან აჩქარება; <b>ritardando</b> — თანდათან შენელება; <b>a tempo</b> — პირვანდელ ტემპზე დაბრუნება.', '<b>accelerando</b> — speed up; <b>ritardando</b> — slow down; <b>a tempo</b> — back to the original tempo.'], ['<b>ფერმატა</b> 𝄐 — ნოტი ან პაუზა ჩვეულებრივზე დიდხანს გრძელდება.', '<b>Fermata</b> 𝄐 — hold the note or rest longer than written.']]),
        P('„ბანი-აჭარული“ დაახლოებით <b>100 BPM</b>-ზეა (ერთი რითმი = ერთი დარტყმა). ცოცხალ შესრულებაში ტემპი ოდნავ ცოცხლობს — აპი ჩანაწერის ყოველ დარტყმას მიჰყვება.', '“Bani-Acharuli” is about <b>100 BPM</b> (one rhythm = one beat). In a live performance the tempo moves a little — the app follows every beat of the recording.'),
        BTN('60 BPM', '60 BPM', () => seq([M('A4'), M('A4'), M('A4'), M('A4')], 1)), BTN('120 BPM', '120 BPM', () => seq(Array(8).fill(M('A4')), .5)));
    }, q: [
      [['120 BPM — წამში რამდენი დარტყმაა?', '120 BPM — how many beats per second?'], ['2', '1', '120'], 0, ['120 დარტყმა / 60 წამი = 2.', '120 beats / 60 s = 2.']]] },

    { id: 'intervals', t: ['ინტერვალები', 'Intervals'], body: b => {
      b.append(P('<b>ინტერვალი</b> ორ ბგერას შორის მანძილია. ითვლება ნახევარტონებით — ფანდურზე ეს უბრალოდ <b>ლადების რაოდენობაა</b> ერთ სიმზე. დააჭირე ▶ და მოისმენ A-დან:', 'An <b>interval</b> is the distance between two sounds, counted in semitones — on the panduri simply the <b>number of frets</b> on one string. Press ▶ to hear it from A:'));
      const FROM_A = ['A', 'B♭', 'B', 'C', 'C♯', 'D', 'D♯ / E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A'];   // spelled by interval (a minor 2nd from A is B♭, not A♯)
      const IV = [['წმინდა პრიმა', 'perfect unison'], ['პატარა სეკუნდა', 'minor 2nd'], ['დიდი სეკუნდა', 'major 2nd'], ['პატარა ტერცია', 'minor 3rd'], ['დიდი ტერცია', 'major 3rd'], ['წმინდა კვარტა', 'perfect 4th'], ['ტრიტონი', 'tritone'], ['წმინდა კვინტა', 'perfect 5th'], ['პატარა სექსტა', 'minor 6th'], ['დიდი სექსტა', 'major 6th'], ['პატარა სეპტიმა', 'minor 7th'], ['დიდი სეპტიმა', 'major 7th'], ['წმინდა ოქტავა', 'perfect octave']];
      b.append(TABLE([L('ნახევარტ.', 'Semit.'), L('ინტერვალი', 'Interval'), L('A-დან', 'From A'), ''], IV.map((n, i) => [String(i), L(n[0], n[1]), 'A → ' + FROM_A[i], h('button', { class: 'btn small', text: '▶', onclick: () => seq([M('A3'), M('A3') + i, [M('A3'), M('A3') + i]], [.55, .65, .1]) })])),
        H('ფანდურის აწყობა ინტერვალებით', 'The tuning in intervals'),
        UL([['A → C♯ = <b>დიდი ტერცია</b> (4 ნახევარტონი): A სიმის მე-4 ლადი = C♯.', 'A → C♯ = <b>major third</b> (4 semitones): the A string\'s 4th fret = C♯.'], ['C♯ → E = <b>პატარა ტერცია</b> (3): C♯ სიმის მე-3 ლადი = E.', 'C♯ → E = <b>minor third</b> (3): the C♯ string\'s 3rd fret = E.'], ['A → E = <b>წმინდა კვინტა</b> (7): A სიმის მე-7 ლადი = E.', 'A → E = <b>perfect fifth</b> (7): the A string\'s 7th fret = E.']]),
        P('სამივე ღია სიმი ერთად <b>A მაჟორის</b> აკორდია (A · C♯ · E).', 'All three open strings together make an <b>A major</b> chord (A · C♯ · E).'));
    }, q: [
      [['რამდენი ნახევარტონია წმინდა კვინტა?', 'How many semitones is a perfect fifth?'], ['7', '5', '4'], 0, ['კვინტა = 7 ნახევარტონი (A → E).', 'Fifth = 7 semitones (A → E).']],
      [['A → C♯ რომელი ინტერვალია?', 'What interval is A → C♯?'], [['დიდი ტერცია', 'Major third'], ['პატარა ტერცია', 'Minor third'], ['კვარტა', 'Perfect fourth']], 0, ['4 ნახევარტონი = დიდი ტერცია.', '4 semitones = major third.']]] },

    { id: 'scales', t: ['გამები: მაჟორი და მინორი', 'Scales: major and minor'], body: b => {
      b.append(P('<b>გამა</b> ნოტების რიგია, რომელიც ერთი ბგერიდან (ტონიკიდან) ოქტავამდე ადის განსაზღვრული ნაბიჯებით (ტ = ტონი, ნ = ნახევარტონი):', 'A <b>scale</b> is a row of notes climbing from one note (the tonic) to its octave in fixed steps (T = tone, S = semitone):'),
        TABLE([L('გამა', 'Scale'), L('ნაბიჯები', 'Steps'), L('მაგალითი', 'Example')], [[L('მაჟორი', 'major'), L('ტ ტ ნ ტ ტ ტ ნ', 'T T S T T T S'), 'C D E F G A B C'], [L('ნატურალური მინორი', 'natural minor'), L('ტ ნ ტ ტ ნ ტ ტ', 'T S T T S T T'), 'A B C D E F G A'], [L('ჰარმონიული მინორი', 'harmonic minor'), L('მე-7 საფეხური ამაღლებულია', 'raised 7th'), 'A B C D E F G♯ A'], [L('მელოდიური მინორი', 'melodic minor'), L('მე-6 და მე-7 ამაღლებულია (ზემოთ)', 'raised 6th and 7th (going up)'), 'A B C D E F♯ G♯ A'], [L('მაჟორული პენტატონიკა', 'major pentatonic'), L('5 ნოტი', '5 notes'), 'C D E G A'], [L('მინორული პენტატონიკა', 'minor pentatonic'), L('5 ნოტი', '5 notes'), 'A C D E G']]),
        BTN('დო მაჟორი', 'C major', () => seq(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'].map(M), .38)), BTN('ლა მინორი', 'A minor', () => seq(['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4'].map(M), .38)),
        H('რე მინორი — „ბანი-აჭარულის“ გამა', 'D minor — the scale of “Bani-Acharuli”'),
        P('რე ნატურალური მინორი: <b>D · E · F · G · A · B♭ · C · D</b> — ერთი ბემოლი (B♭). სიმღერის სამივე აკორდი — <b>Dm, B♭, C</b> — მხოლოდ ამ ნოტებისგან შედგება.', 'D natural minor: <b>D · E · F · G · A · B♭ · C · D</b> — one flat (B♭). All three chords of the song — <b>Dm, B♭, C</b> — use only these notes.'),
        SVG(A.staff(['D4', 'E4', 'F4', 'G4', 'A4', 'B♭4', 'C5', 'D5'].map(n => ({ l: n[0], o: +n.slice(-1), acc: n.includes('♭') ? '♭' : undefined, label: n.replace(/\d/, '') })), { width: 400, gap: 40 })),
        P('ფანდურზე: ' + ['D4', 'E4', 'F4', 'G4', 'A4', 'B♭4', 'C5', 'D5'].map(n => '<b>' + n.replace(/\d/, '') + '</b> ' + where(M(n)).split(' / ')[0]).join(' · '), 'On the panduri: ' + ['D4', 'E4', 'F4', 'G4', 'A4', 'B♭4', 'C5', 'D5'].map(n => '<b>' + n.replace(/\d/, '') + '</b> ' + where(M(n)).split(' / ')[0]).join(' · ')),
        BTN('რე მინორი', 'D minor', () => seq(['D4', 'E4', 'F4', 'G4', 'A4', 'B♭4', 'C5', 'D5'].map(M), .38)));
    }, q: [
      [['მაჟორული გამის ნაბიჯები:', 'The major scale\'s steps:'], ['ტ ტ ნ ტ ტ ტ ნ', 'ტ ნ ტ ტ ნ ტ ტ', 'ტ ტ ტ ნ ტ ტ ნ'], 0, ['მაჟორი: ტ ტ ნ ტ ტ ტ ნ.', 'Major: T T S T T T S.']],
      [['რამდენი ბემოლია რე მინორში?', 'How many flats does D minor have?'], ['1 (B♭)', '2', '0'], 0, ['D E F G A B♭ C.', 'D E F G A B♭ C.']]] },

    { id: 'chords', t: ['აკორდი როგორ იგება', 'How chords are built'], body: b => {
      b.append(P('<b>აკორდი</b> ერთად ნაკვრი სამი ან მეტი ბგერაა. ყველაზე ხშირი — <b>ტრიადა</b>: ტონიკა (1) + ტერცია (3) + კვინტა (5), ანუ გამის ყოველი მეორე ნოტი.', 'A <b>chord</b> is three or more sounds together. The most common is the <b>triad</b>: root (1) + third (3) + fifth (5) — every other note of the scale.'),
        TABLE([L('სახე', 'Type'), L('ნახევარტონები', 'Semitones'), L('მაგალითი', 'Example')], [[L('მაჟორი', 'major'), '0 · 4 · 7', 'C = C E G'], [L('მინორი', 'minor'), '0 · 3 · 7', 'Dm = D F A'], [L('შემცირებული', 'diminished'), '0 · 3 · 6', 'B° = B D F'], [L('გადიდებული', 'augmented'), '0 · 4 · 8', 'C+ = C E G♯'], [L('დომინანტსეპტაკორდი', 'dominant 7th'), '0 · 4 · 7 · 10', 'A7 = A C♯ E G']]),
        H('მიმართვები', 'Inversions'),
        P('აკორდის ნოტები შეიძლება სხვადასხვა წესრიგში იყოს. ყველაზე დაბალი ნოტის მიხედვით: <b>ძირითადი სახე</b> (ქვემოთ ტონიკაა), <b>სექსტაკორდი</b> (ქვემოთ ტერციაა) და <b>კვარტსექსტაკორდი</b> (ქვემოთ კვინტაა).', 'A chord\'s notes can be stacked in different orders. By the lowest note: <b>root position</b> (root at the bottom), <b>first inversion</b> (third at the bottom) and <b>second inversion</b> (fifth at the bottom).'),
        H('„ბანი-აჭარულის“ აკორდები ფანდურზე', 'The chords of “Bani-Acharuli” on the panduri'),
        TABLE([L('აკორდი', 'Chord'), L('ლადები (A · C♯ · E)', 'Frets (A · C♯ · E)'), L('ნოტები (ქვემოდან)', 'Notes (from the bottom)'), L('სახე', 'Position'), ''], [
          ['Dm', '0 · 1 · 1', 'A · D · F', L('კვარტსექსტაკორდი (ქვემოთ კვინტა A)', '2nd inversion (fifth A at the bottom)'), h('button', { class: 'btn small', text: '▶', onclick: () => { PD.audio.ensure(); PD.audio.strum([0, 1, 1], 'down', { gap: .03 }); } })],
          ['B♭', '1 · 1 · 1', 'B♭ · D · F', L('ძირითადი', 'root position'), h('button', { class: 'btn small', text: '▶', onclick: () => { PD.audio.ensure(); PD.audio.strum([1, 1, 1], 'down', { gap: .03 }); } })],
          ['C', '3 · 3 · 3', 'C · E · G', L('ძირითადი', 'root position'), h('button', { class: 'btn small', text: '▶', onclick: () => { PD.audio.ensure(); PD.audio.strum([3, 3, 3], 'down', { gap: .03 }); } })]]),
        P('ფანდურის აწყობა (A C♯ E) თავად მაჟორული ტრიადაა, ამიტომ <b>ერთ ლადზე სამივე სიმის დაჭერა (ბარე) ყოველთვის მაჟორს იძლევა</b>: 1 ლადი = B♭, 3 ლადი = C, 5 ლადი = D …', 'The tuning (A C♯ E) is itself a major triad, so <b>pressing all three strings on one fret (barre) always gives a major chord</b>: fret 1 = B♭, fret 3 = C, fret 5 = D …'),
        h('button', { class: 'btn', text: L('ყველა აკორდი →', 'All chords →'), onclick: () => PD.app.go('chords') }));
    }, q: [
      [['მინორული ტრიადა ნახევარტონებით:', 'A minor triad in semitones:'], ['0 · 3 · 7', '0 · 4 · 7', '0 · 3 · 6'], 0, ['პატარა ტერცია (3) + კვინტა (7).', 'Minor third (3) + fifth (7).']],
      [['სამივე სიმი მე-5 ლადზე (ბარე) — რომელი აკორდია?', 'All strings on fret 5 (barre) — which chord?'], [['D მაჟორი', 'D major'], ['D მინორი', 'D minor'], ['E მაჟორი', 'E major']], 0, ['A+5 = D, C♯+5 = F♯, E+5 = A → D F♯ A.', 'A+5 = D, C♯+5 = F♯, E+5 = A → D F♯ A.']]] },

    { id: 'key', t: ['ტონალობა და საფეხურები', 'Keys and scale degrees'], body: b => {
      b.append(P('<b>ტონალობა</b> გამის „სახლია“: რომელი ბგერაა მთავარი (ტონიკა) და რომელი ნოტები გამოიყენება. გამის ყოველ ნოტზე (<b>საფეხურზე</b>) აკორდი შეიძლება ავაგოთ — მათ რომაული ციფრებით ვნიშნავთ.', 'A <b>key</b> is a scale\'s home: which note is central (the tonic) and which notes are used. A chord can be built on every note (<b>degree</b>) of the scale — written with Roman numerals.'),
        TABLE([L('საფეხური', 'Degree'), 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'], [[L('დო მაჟორი', 'C major'), 'C', 'Dm', 'Em', 'F', 'G', 'Am', 'B°'], [L('რე მინორი', 'D minor'), '<b>Dm</b>', 'E°', 'F', 'Gm', 'Am / A', '<b>B♭</b>', '<b>C</b>']]),
        UL([['<b>I — ტონიკა</b>: მშვიდი, „სახლი“.', '<b>I — tonic</b>: calm, “home”.'], ['<b>IV — სუბდომინანტა</b>: ტონიკიდან მოშორება.', '<b>IV — subdominant</b>: moving away from home.'], ['<b>V — დომინანტა</b>: დაძაბულობა, ტონიკაში დაბრუნება სურს. მინორში ხშირად მაჟორულია (რე მინორში — A = A C♯ E: ფანდურის ღია სიმები!).', '<b>V — dominant</b>: tension that wants to return home. In minor it is often major (in D minor — A = A C♯ E: the panduri\'s open strings!).']]),
        P('„ბანი-აჭარული“ რე მინორშია: <b>Dm (I) · B♭ (VI) · C (VII)</b> — ტონიკიდან ქვემოთ, VI და VII საფეხურებზე, და ისევ ტონიკაში.', '“Bani-Acharuli” is in D minor: <b>Dm (I) · B♭ (VI) · C (VII)</b> — from the tonic to degrees VI and VII and home again.'),
        BTN('Dm · Dm · B♭ · C', 'Dm · Dm · B♭ · C', () => { PD.audio.ensure(); const ctx = PD.audio.ctx, t0 = ctx.currentTime + .05; [[0, 1, 1], [0, 1, 1], [1, 1, 1], [3, 3, 3], [0, 1, 1]].forEach((f, i) => PD.audio.strum(f, 'down', { gap: .03, when: t0 + i * .6 })); }));
    }, q: [
      [['რე მინორში რომელი საფეხურია B♭?', 'In D minor, which degree is B♭?'], ['VI', 'IV', 'VII'], 0, ['D(I) E(II) F(III) G(IV) A(V) B♭(VI) C(VII).', 'D(I) E(II) F(III) G(IV) A(V) B♭(VI) C(VII).']],
      [['რომელი საფეხური ქმნის დაძაბულობას, რომელიც ტონიკაში დაბრუნებას „ითხოვს“?', 'Which degree creates tension that wants to return home?'], [['V — დომინანტა', 'V — dominant'], ['I — ტონიკა', 'I — tonic'], 'III'], 0, ['დომინანტა (V) ტონიკისკენ მიისწრაფვის.', 'The dominant (V) pulls back to the tonic.']]] },

    { id: 'signs', t: ['დინამიკა და შესრულების ნიშნები', 'Dynamics and performance signs'], body: b => {
      b.append(H('დინამიკა — ხმის სიძლიერე', 'Dynamics — loudness'),
        TABLE([L('ნიშანი', 'Sign'), L('იტალიურად', 'Italian'), L('როგორ', 'How')], [['<i><b>pp</b></i>', 'pianissimo', L('ძალიან ჩუმად', 'very soft')], ['<i><b>p</b></i>', 'piano', L('ჩუმად', 'soft')], ['<i><b>mp</b></i>', 'mezzo-piano', L('ზომიერად ჩუმად', 'moderately soft')], ['<i><b>mf</b></i>', 'mezzo-forte', L('ზომიერად ხმამაღლა', 'moderately loud')], ['<i><b>f</b></i>', 'forte', L('ხმამაღლა', 'loud')], ['<i><b>ff</b></i>', 'fortissimo', L('ძალიან ხმამაღლა', 'very loud')], ['&lt;', 'crescendo', L('თანდათან გაძლიერება', 'getting louder')], ['&gt;', 'diminuendo', L('თანდათან შესუსტება', 'getting softer')]]),
        H('ნოტთან დაწერილი ნიშნები', 'Signs on notes'),
        UL([['<b>&gt; აქცენტი</b> — ეს ნოტი ძლიერად. აპში აქცენტიანი დარტყმა <b style="color:#FF6B5B">წითელია</b> (აჭარულში მეორე და მესამე დარტყმა).', '<b>&gt; accent</b> — play this note strongly. In the app an accented stroke is <b style="color:#FF6B5B">red</b> (in Acharuli the 2nd and 3rd strokes).'], ['<b>· სტაკატო</b> — მოკლედ, დაყოვნების გარეშე.', '<b>· staccato</b> — short and detached.'], ['<b>⌒ ლეგატო</b> — შეკრულად, ერთი ბგერიდან მეორეში შეუწყვეტლად.', '<b>⌒ legato</b> — smoothly connected.'], ['<b>𝄐 ფერმატა</b> — დიდხანს გაგრძელება.', '<b>𝄐 fermata</b> — hold longer.']]),
        H('გამეორების ნიშნები', 'Repeat signs'),
        UL([['<b>𝄆 … 𝄇 რეპრიზა</b> — ამ ნაწილის გამეორება.', '<b>𝄆 … 𝄇 repeat</b> — play this part again.'], ['<b>1. 2. ვოლტები</b> — პირველად პირველი ბოლო, მეორედ — მეორე.', '<b>1. 2. endings</b> — the first time take ending 1, the second time ending 2.'], ['<b>D.C.</b> (da capo) — თავიდან; <b>D.S.</b> (dal segno) — 𝄋 ნიშნიდან; <b>Fine</b> — დასასრული; <b>Coda</b> 𝄌 — ბოლო ნაწილი.', '<b>D.C.</b> — from the beginning; <b>D.S.</b> — from the 𝄋 sign; <b>Fine</b> — the end; <b>Coda</b> 𝄌 — the final section.']]));
    }, q: [
      [['რას ნიშნავს <i>f</i>?', 'What does <i>f</i> mean?'], [['ხმამაღლა', 'Loud'], ['ჩუმად', 'Soft'], ['სწრაფად', 'Fast']], 0, ['forte = ხმამაღლა.', 'forte = loud.']],
      [['აპში წითელი ისარი ნიშნავს…', 'In the app a red arrow means…'], [['აქცენტს — ძლიერად დაკვრას', 'An accent — a stronger stroke'], ['შეცდომას', 'A mistake'], ['ამოკვრას', 'An up-stroke']], 0, ['წითელი = აქცენტი.', 'Red = accent.']]] },

    { id: 'app', t: ['როგორ წერს აპი ფანდურისთვის', 'How the app writes for the panduri'], body: b => {
      b.append(P('გაკვეთილებში ნოტები ხუთხაზედის ნაცვლად <b>ფანდურის ენით</b> იწერება — ასე უფრო სწრაფად იკითხება:', 'In the lessons notes are written in the <b>panduri\'s own language</b> instead of a staff — quicker to read:'),
        TABLE([L('ნიშანი', 'Sign'), L('ნიშნავს', 'Means')], [['↓', L('ჩაკვრა (ზემოდან ქვემოთ)', 'down-stroke')], ['↑', L('ამოკვრა (ქვემოდან ზემოთ)', 'up-stroke')], ['<b style="color:#FF6B5B">↓ ↑</b>', L('აქცენტი — ძლიერად', 'accent — strongly')], ['0', L('ღია სიმი', 'open string')], ['1 … 17', L('ლადის ნომერი', 'fret number')], [L('წრე ციფრით', 'circle with a number'), L('რომელი თითით: 1 საჩვენებელი · 2 შუა · 3 არათითი · 4 ნეკი', 'which finger: 1 index · 2 middle · 3 ring · 4 little')], [L('გრძელი კაფსულა', 'long capsule'), L('ბარე — ერთი თითი რამდენიმე სიმზე', 'barre — one finger across several strings')]]),
        P('<b>რითმი</b> აპში დარტყმების ჯგუფია: მაგ. აჭარული = <b>↓ ↓ ↑</b> (ჩაკვრა · ჩაკვრა · ამოკვრა) — ერთი რითმი. „2 რითმი“ = ↓ ↓ ↑ ↓ ↓ ↑.', 'A <b>rhythm</b> in the app is a group of strokes: e.g. Acharuli = <b>↓ ↓ ↑</b> — one rhythm. “2 rhythms” = ↓ ↓ ↑ ↓ ↓ ↑.'),
        P('სიმების წესრიგი ეკრანზე: <b>ზემოთ E, შუაში C♯, ქვემოთ A</b>. სიმები ფერითაც განსხვავდება.', 'String order on screen: <b>E at the top, C♯ in the middle, A at the bottom</b>; each string also has its colour.'),
        h('div', { class: 'row' }, [h('button', { class: 'btn', text: L('ტრენაჟორი: ნოტები და ლადები →', 'Trainer: notes and frets →'), onclick: () => PD.app.go('trainer') }), h('button', { class: 'btn', text: L('ტარის მკვლევარი →', 'Fretboard explorer →'), onclick: () => PD.app.go('fretboard') })]));
    }, q: [
      [['„↓ ↓ ↑“ აჭარულში რამდენი რითმია?', 'How many rhythms is “↓ ↓ ↑” in Acharuli?'], ['1', '3', '2'], 0, ['სამი დარტყმა = ერთი რითმი.', 'Three strokes = one rhythm.']]] }
  ];

  /* ---------- progress ---------- */
  const done = () => PD.store.get('theory.done', {});
  const mark = id => { const d = done(); if (!d[id]) { d[id] = Date.now(); PD.store.set('theory.done', d); PD.bus.emit('theory', d); } };
  const progress = () => CH.filter(c => done()[c.id]).length / CH.length;

  /* ---------- pages ---------- */
  function page(w, param) {
    const c = CH.find(x => x.id === param);
    if (c) return chapter(w, c);
    const d = done(), n = CH.filter(x => d[x.id]).length;
    w.append(h('div', { class: 'row' }, [h('button', { class: 'btn small', html: PD.ic.back + '<span data-t="back"></span>', onclick: () => history.length > 1 ? history.back() : PD.app.go('learn') }), h('h1', { 'data-t': 'tb.title', style: 'margin:0' })]),
      h('p', { class: 'fg2', 'data-t': 'tb.lead' }),
      h('div', { class: 'tb-prog' }, [h('div', { class: 'hx-bar' }, [h('i', { style: 'width:' + Math.round(n / CH.length * 100) + '%' })]), h('small', { class: 'muted', text: t('tb.read', { a: n, b: CH.length }) })]),
      h('div', { class: 'tb-list' }, CH.map((x, i) => h('button', { class: 'tb-card' + (d[x.id] ? ' done' : ''), onclick: () => PD.app.go('theory', x.id) }, [h('span', { class: 'tb-num', text: d[x.id] ? '✓' : String(i + 1) }), h('b', { text: L(x.t[0], x.t[1]) })]))));
  }
  function chapter(w, c) {
    const i = CH.indexOf(c);
    w.append(h('div', { class: 'row' }, [h('button', { class: 'btn small', html: PD.ic.back + '<span data-t="tb.list"></span>', onclick: () => PD.app.go('theory') }), h('small', { class: 'muted', text: t('tb.chapter', { n: i + 1 }) + ' / ' + CH.length })]),
      h('h1', { class: 'tb-title', text: L(c.t[0], c.t[1]) }));
    const body = h('article', { class: 'tb-body' }); w.append(body); c.body(body);
    // self-check
    if (c.q && c.q.length) {
      const qs = h('section', { class: 'tb-quiz' }, [h('h3', { 'data-t': 'tb.check' })]);
      let right = 0;
      c.q.forEach(([q, opts, ok, why]) => {
        const order = opts.map((o, k) => k).sort(() => Math.random() - .5), fb = h('p', { class: 'tb-fb', hidden: true });
        const box = h('div', { class: 'tb-q' }, [h('b', { html: L(q[0], q[1]) }), h('div', { class: 'tb-opts' }, order.map(k => h('button', { class: 'btn small', html: Array.isArray(opts[k]) ? L(opts[k][0], opts[k][1]) : opts[k], onclick: e => {
          const good = k === ok; box.querySelectorAll('.tb-opts button').forEach(bb => { bb.disabled = true; }); e.currentTarget.classList.add(good ? 'ok' : 'bad');
          if (!good) box.querySelectorAll('.tb-opts button')[order.indexOf(ok)].classList.add('ok');
          fb.hidden = false; fb.className = 'tb-fb ' + (good ? 'ok' : 'bad'); fb.innerHTML = (good ? t('tb.right') + ' ' : t('tb.wrong')) + L(why[0], why[1]);
          if (good && ++right === c.q.length) mark(c.id);
          if (good) PD.audio.ok && PD.audio.ok();
        } }))), fb]);
        qs.appendChild(box);
      });
      w.append(qs);
    }
    const nx = CH[i + 1], pv = CH[i - 1];
    w.append(h('div', { class: 'tb-nav' }, [pv ? h('button', { class: 'btn', text: '‹ ' + L(pv.t[0], pv.t[1]), onclick: () => PD.app.go('theory', pv.id) }) : h('span'),
      h('button', { class: 'btn primary', text: nx ? t('tb.next') + ' ›' : t('tb.finish'), onclick: () => { mark(c.id); PD.app.go('theory', nx ? nx.id : null); } })]));
    PD.i18n.apply(w);
  }
  return { page, progress, CHAPTERS: CH, M };
})();
