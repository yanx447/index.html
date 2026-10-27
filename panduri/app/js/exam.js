/* =====================================================================
   Exams · ზოგადი და ფანდურის თეორიის გამოცდები
   Every question comes from material that is already in the app — the
   theory book's own chapters (their self-check questions are reused
   word for word), the teacher's rhythms and fingering, the instrument
   profile (strings, frets, tuning) and the solfège material. Nothing
   here invents a fact: the generated questions are computed from
   PD.theory / PD.instrument, so they stay true if the tuning or the
   fret count ever changes.

   Six exams, each with its own time limit and pass mark. While an exam
   is running the app opens nothing else (PD.app.go sends every other
   route back to the exam) — the student passes it first. The same
   question bank runs untimed as an exercise ("ვარჯიში"), where every
   answer is explained at once.
   ===================================================================== */
PD.i18n.add({
  'ex.title': ['გამოცდები', 'Exams'],
  'ex.tab': ['გამოცდა', 'Exams'],
  'ex.lead': ['თეორიის გამოცდები: სიმები და ლადები, ნოტები და ნიშნები, რითმი და ზომა, ინტერვალები, გამები, აკორდები, სოლფეჯიო. ყოველი კითხვა აპის თეორიის მასალიდანაა.', 'Theory exams: strings and frets, notes and signs, rhythm and metre, intervals, scales, chords, solfège. Every question comes from the app\'s own theory material.'],
  'ex.start': ['გამოცდის დაწყება', 'Start the exam'], 'ex.retry': ['ხელახლა', 'Try again'], 'ex.drill': ['ვარჯიში', 'Exercise'],
  'ex.drillD': ['ვარჯიში დროის გარეშე — ყოველი პასუხი მაშინვე აიხსნება. რამდენჯერაც გინდა.', 'Practice with no clock — every answer is explained at once. As often as you like.'],
  'ex.passed': ['ჩაბარებულია', 'Passed'], 'ex.passedOn': ['ჩაბარდა {d} · {p}%', 'Passed {d} · {p}%'],
  'ex.locked': ['ჯერ წინა გამოცდა ჩააბარე', 'Pass the exam before it first'],
  'ex.qN': ['კითხვა {a} / {b}', 'Question {a} / {b}'], 'ex.left': ['დარჩა {t}', '{t} left'],
  'ex.rule': ['{n} კითხვა · {m} წუთი · ჩასაბარებლად {p}%', '{n} questions · {m} min · {p}% to pass'],
  'ex.lock': ['გამოცდა მიმდინარეობს — სანამ არ ჩააბარებ, სხვა გვერდი არ იხსნება.', 'An exam is running — no other page opens until you pass it.'],
  'ex.lockShort': ['ჯერ გამოცდა დაასრულე', 'Finish the exam first'],
  'ex.submit': ['დასრულება', 'Finish'], 'ex.next': ['შემდეგი', 'Next'], 'ex.prev': ['უკან', 'Back'],
  'ex.unanswered': ['{n} კითხვა უპასუხოდ დარჩა', '{n} question(s) left unanswered'],
  'ex.timeUp': ['დრო ამოიწურა', 'Time is up'],
  'ex.result': ['{a} / {b} სწორი · {p}%', '{a} / {b} correct · {p}%'],
  'ex.pass': ['გამოცდა ჩაბარებულია!', 'Exam passed!'], 'ex.fail': ['ჯერ არ ჩაბარდა — საჭიროა {p}%', 'Not passed yet — {p}% is needed'],
  'ex.again': ['ხელახლა გამოცდა', 'Take the exam again'], 'ex.go': ['გაგრძელება', 'Continue'],
  'ex.review': ['პასუხების გარჩევა', 'Your answers'], 'ex.yours': ['შენი პასუხი', 'Your answer'], 'ex.right': ['სწორი პასუხი', 'Correct answer'], 'ex.none': ['პასუხი არ არის', 'No answer'],
  'ex.learn': ['მასალა გავიმეორო', 'Read the material again'],
  'ex.xp': ['+{n} XP გამოცდისთვის', '+{n} XP for the exam'],
  'ex.listen': ['▶ მოსმენა', '▶ Listen'], 'ex.again1': ['▶ კიდევ', '▶ Again'],
  'ex.score': ['{a} / {b}', '{a} / {b}'], 'ex.more': ['შემდეგი კითხვა', 'Next question'],
  'ex.why': ['რატომ', 'Why'], 'ex.exit': ['გასვლა', 'Leave'],
  'ex.e1': ['ფანდური: სიმები, ლადები, თითები', 'The panduri: strings, frets, fingers'],
  'ex.e2': ['რითმი, ზომა და ხანგრძლივობა', 'Rhythm, metre and note values'],
  'ex.e3': ['ნოტები, ნიშნები და ტარის რუკა', 'Notes, signs and the map of the neck'],
  'ex.e4': ['ინტერვალები, გამები, აკორდები', 'Intervals, scales and chords'],
  'ex.e5': ['სოლფეჯიო', 'Solfège'],
  'ex.e6': ['საბოლოო გამოცდა — მთელი თეორია', 'Final exam — the whole theory'],
  'ex.t1': ['ფანდური', 'The panduri'], 'ex.t2': ['რითმი', 'Rhythm'], 'ex.t3': ['ნოტები', 'Notes'], 'ex.t4': ['ჰარმონია', 'Harmony'], 'ex.t5': ['სოლფეჯიო', 'Solfège'], 'ex.t6': ['ყველაფერი', 'Everything'],
  'ex.sec': ['გამოცდა', 'Exam'], 'ex.of': ['კითხვები ყოველ ჯერზე ახლიდან ირჩევა — თეორიის თავებიდან და ინსტრუმენტის ნამდვილი მონაცემებიდან.', 'The questions are drawn fresh every time — from the theory chapters and from the instrument\'s own data.']
});

PD.exam = (() => {
  const h = PD.h, t = PD.i18n.t, TH = PD.theory, ic = PD.ic;
  const L = (ka, en) => PD.i18n.pick({ ka, en });
  const LX = x => Array.isArray(x) ? L(x[0], x[1]) : String(x);
  const rnd = n => Math.floor(Math.random() * n), pick = a => a[rnd(a.length)];
  const pickQ = a => pick(a)();   // one of several question shapes
  const shuf = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = rnd(i + 1); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  /** a question: text, options (string or [ka,en]), the index of the right one, why, and an optional sound */
  const Q = (q, opts, ok, why, play) => ({ q, opts, ok, why, play: play || null });
  /** three wrong answers that are not the right one and not repeated */
  function others(right, poolFn, n) {
    const out = []; let guard = 0;
    while (out.length < (n || 2) && guard++ < 200) { const v = poolFn(); if (v != null && String(v) !== String(right) && !out.some(x => String(x) === String(v))) out.push(v); }
    return out;
  }
  function mc(q, right, wrong, why, play) {   // multiple choice from one right and some wrong answers
    const opts = shuf([right].concat(wrong));
    return Q(q, opts, opts.findIndex(o => o === right), why, play);
  }

  /* ---------------- the instrument's own facts ---------------- */
  // the teacher counts the strings from the floor up: 1st = E (first voice), 2nd = C♯, 3rd = the bass A.
  // inside the app the strings are numbered the other way (s = 1 is A), so this is the bridge between the two.
  const TNUM = { 1: 3, 2: 2, 3: 1 };                   // internal string → the teacher's number
  const SIN = { 1: 3, 2: 2, 3: 1 };                    // the teacher's number → internal string
  const ORD = n => L(n === 1 ? '1-ლი' : 'მე-' + n, String(n));
  const ORDS = ns => ns.length ? ns.map(ORD).join(L(' და ', ' and ')) + L(' დარტყმაზე', '') : L('არცერთზე', 'none');
  const sName = s => TH.stringName(s);                 // 'A' · 'C♯' · 'E'
  const nLab = m => { const pc = TH.pc(m); return TH.ROOT_NAMES[pc] + (PD.i18n.lang === 'ka' ? ' (' + TH.ROOT_NAMES_KA[pc] + ')' : ''); };
  const sLab = s => nLab(TH.midi(s, 0));               // 'A (ლა)' · 'C♯ (დო დიეზი)' · 'E (მი)'
  const sOrd = n => L((n === 1 ? '1-ლი' : 'მე-' + n) + ' სიმი' + (n === 3 ? ' (ბანი)' : ''), 'string ' + n + (n === 3 ? ' (the bass)' : ''));
  const noteAt = (s, f) => TH.pcName(TH.midi(s, f));
  const kaAt = (s, f) => TH.nameKa(TH.midi(s, f));
  const FR = () => TH.FRETS;
  const SYL = [['დო', 'do'], ['რე', 're'], ['მი', 'mi'], ['ფა', 'fa'], ['სოლ', 'sol'], ['ლა', 'la'], ['სი', 'si']];
  const LET = ['C', 'D', 'E', 'F', 'G', 'A', 'B'], STEP = [0, 2, 4, 5, 7, 9, 11, 12];
  const IV = [['წმინდა პრიმა', 'perfect unison'], ['პატარა სეკუნდა', 'minor 2nd'], ['დიდი სეკუნდა', 'major 2nd'], ['პატარა ტერცია', 'minor 3rd'], ['დიდი ტერცია', 'major 3rd'], ['წმინდა კვარტა', 'perfect 4th'], ['ტრიტონი', 'tritone'], ['წმინდა კვინტა', 'perfect 5th'], ['პატარა სექსტა', 'minor 6th'], ['დიდი სექსტა', 'major 6th'], ['პატარა სეპტიმა', 'minor 7th'], ['დიდი სეპტიმა', 'major 7th'], ['წმინდა ოქტავა', 'perfect octave']];
  const DUR = [[['მთელი', 'whole'], 4], [['ნახევარი', 'half'], 2], [['მეოთხედი', 'quarter'], 1], [['მერვედი', 'eighth'], .5], [['მეთექვსმეტედი', 'sixteenth'], .25]];
  const BEATS = { 4: '4', 2: '2', 1: '1', .5: '½', .25: '¼' };
  const TEMPO = [['Largo', ['ძალიან ნელა', 'very slow'], '40–60'], ['Adagio', ['ნელა', 'slow'], '66–76'], ['Andante', ['ნაბიჯის ტემპით', 'walking pace'], '76–108'], ['Moderato', ['ზომიერად', 'moderate'], '108–120'], ['Allegro', ['სწრაფად', 'fast'], '120–156'], ['Presto', ['ძალიან სწრაფად', 'very fast'], '168–200']];
  const DYN = [['pp', ['ძალიან ჩუმად', 'very soft']], ['p', ['ჩუმად', 'soft']], ['mp', ['ზომიერად ჩუმად', 'moderately soft']], ['mf', ['ზომიერად ხმამაღლა', 'moderately loud']], ['f', ['ხმამაღლა', 'loud']], ['ff', ['ძალიან ხმამაღლა', 'very loud']]];
  const EXIC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h9l4 4v9.5"/><path d="M15 3v4h4"/><path d="M6 3v13"/><path d="M6 16h6"/><circle cx="16.5" cy="18" r="3.4"/><path d="M15.1 18l1 1.1 2-2.2"/></svg>';
  const sound = (ms, gap) => () => { PD.audio.ensure(); const c = PD.audio.ctx; if (!c) return; let t0 = c.currentTime + .06; [].concat(ms).forEach(m => { const p = TH.positions(m).sort((a, b) => a.f - b.f)[0]; if (p) PD.audio.note(p.s, p.f, { when: t0 }); t0 += (gap || .6); }); };

  /* ---------------- generators ---------------- */
  const GEN = {
    /* --- the instrument --- */
    stringNum: () => { const n = 1 + rnd(3), s = SIN[n];
      return mc(L((n === 1 ? '1-ლი' : 'მე-' + n) + ' სიმი რომელ ნოტზეა აწყობილი?', 'Which note is string ' + n + ' tuned to?'),
        sLab(s), [1, 2, 3].filter(x => x !== n).map(x => sLab(SIN[x])),
        L('ქვემოდან ითვლი: 1-ლი სიმი E (მი), მე-2 C♯ (დო დიეზი), მე-3 A (ლა) — ბანი.', 'Count from the bottom: string 1 is E, string 2 C♯, string 3 A — the bass.'), sound([TH.midi(s, 0)])); },
    stringVoice: () => { const n = 1 + rnd(3), s = SIN[n];
      return mc(L(sLab(s) + ' რომელი სიმია?', 'Which string is ' + sName(s) + '?'),
        sOrd(n), [1, 2, 3].filter(x => x !== n).map(sOrd),
        L('E (მი) — 1-ლი სიმი, 1-ლი ხმა · C♯ (დო დიეზი) — მე-2 სიმი, მე-2 ხმა · A (ლა) — მე-3 სიმი, ბანი.', 'E — string 1, the first voice · C♯ — string 2, the second voice · A — string 3, the bass.'), sound([TH.midi(s, 0)])); },
    tuning: () => mc(L('ფანდურის სამი ღია სიმი ერთად რომელი აკორდია?', 'The three open strings together make which chord?'),
      'A ' + L('მაჟორი', 'major'), ['A ' + L('მინორი', 'minor'), 'D ' + L('მაჟორი', 'major'), 'E ' + L('მინორი', 'minor')],
      L('A · C♯ · E = A მაჟორული ტრიადა.', 'A · C♯ · E = an A major triad.'), sound([TH.midi(1, 0), TH.midi(2, 0), TH.midi(3, 0)], .18)),
    fretCount: () => mc(L('რამდენი ლადი აქვს აპის ფანდურს?', 'How many frets does the app\'s panduri have?'),
      String(FR()), [String(FR() - 2), String(FR() + 3), '12'].filter(x => x !== String(FR())).slice(0, 2),
      L(FR() + ' ლადი — 0 ღია სიმია, შემდეგ 1-დან ' + FR() + '-მდე.', FR() + ' frets — 0 is the open string, then 1 to ' + FR() + '.')),
    range: () => mc(L('ფანდურის ყველაზე დაბალი ბგერა რომელია?', 'Which is the panduri\'s lowest sound?'),
      L('A3 — ღია A სიმი (ბანი)', 'A3 — the open A string (the bass)'), [L('E4 — ღია E სიმი', 'E4 — the open E string'), L('C♯4 — ღია შუა სიმი', 'C♯4 — the open middle string'), 'C4'],
      L('A სიმი ყველაზე დაბალია; ' + FR() + ' ლადით ფანდური A3-დან A5-მდე უკრავს.', 'The A string is the lowest; with ' + FR() + ' frets the panduri plays A3 to A5.')),
    markers: () => { const MK = (PD.instrument.profile && PD.instrument.profile.markers) || { single: [3, 5, 7, 9, 15], double: [12] };
      const all = MK.single.concat(MK.double || []).sort((a, b) => a - b), d = (MK.double || [])[0] || 12;
      return mc(L('რომელ ლადზეა ორმაგი ნიშანი (წერტილი)?', 'Which fret carries the double marker?'),
        String(d), all.filter(x => x !== d).slice(0, 3).map(String),
        L('ნიშნები ' + all.join(', ') + ' ლადზეა; მე-' + d + ' — ორმაგი (ოქტავა).', 'Markers sit at frets ' + all.join(', ') + '; ' + d + ' is double (the octave).')); },
    fingers: () => { const F = [[1, ['საჩვენებელი', 'index']], [2, ['შუა', 'middle']], [3, ['არათითი', 'ring']], [4, ['ნეკი', 'little']]], [n, nm] = pick(F);
      return mc(L('მარცხენა ხელის მე-' + n + ' თითი რომელია?', 'Which finger is left-hand finger ' + n + '?'),
        LX(nm), F.filter(x => x[0] !== n).map(x => LX(x[1])),
        L('1 = საჩვენებელი, 2 = შუა, 3 = არათითი, 4 = ნეკი. ცერს ნომერი არ აქვს (T).', '1 = index, 2 = middle, 3 = ring, 4 = little. The thumb has no number (T).')); },
    zero: () => mc(L('ტაბულატურაში „0“ რას ნიშნავს?', 'What does “0” mean in the tab?'),
      L('ღია სიმი — თითს არ აჭერ', 'An open string — no finger'), [L('პირველი ლადი', 'The first fret'), L('პაუზა', 'A rest'), L('ცერა თითი', 'The thumb')],
      L('0 = ღია სიმი; 1–' + FR() + ' = ლადის ნომერი.', '0 = open string; 1–' + FR() + ' = the fret number.')),
    thumb: () => mc(L('მასწავლებლის წესით ბანს — მე-3 სიმს, A (ლა) — რომელი თითით იჭერ?', 'By the teacher\'s rule, which finger holds the bass — string 3, A?'),
      L('T — ცერა თითი', 'T — the thumb'), [L('1 — საჩვენებელი', '1 — index'), L('2 — შუა', '2 — middle'), L('4 — ნეკი', '4 — little')],
      L('ბანს ცერით იჭერ; რითმში ხანდახან მეორე (შუა) თითს ამატებ ბანის მოძრაობისთვის.', 'The thumb holds the bass; in the rhythm the middle finger is sometimes added to move the bass.')),

    /* --- notes, frets, signs --- */
    fretNote: () => { const s = 1 + rnd(3), f = rnd(FR() + 1), m = TH.midi(s, f), right = nLab(m);
      return mc(L(sLab(s) + ' სიმის ' + (f ? 'მე-' + f + ' ლადი' : 'ღია ბგერა') + ' რომელი ნოტია?', (f ? 'Fret ' + f : 'The open sound') + ' of the ' + sName(s) + ' string is which note?'),
        right, others(right, () => nLab(m + (1 + rnd(4)) * (Math.random() < .5 ? 1 : -1)), 3),
        L(sName(s) + ' + ' + f + ' ნახევარტონი = ' + TH.pcName(m) + ' (' + kaAt(s, f) + ').', sName(s) + ' + ' + f + ' semitones = ' + TH.pcName(m) + '.'), sound([m])); },
    noteWhere: () => { const s = 1 + rnd(3), f = 1 + rnd(FR()), m = TH.midi(s, f), nm = TH.pcName(m);
      return mc(L(nLab(m) + ' ნოტი ' + sLab(s) + ' სიმზე რომელ ლადზეა?', 'On which fret of the ' + sName(s) + ' string is ' + nm + '?'),
        String(f), others(f, () => { const x = f + (1 + rnd(3)) * (Math.random() < .5 ? 1 : -1); return x >= 0 && x <= FR() ? String(x) : null; }, 3),
        L('ღია ' + sName(s) + '-დან ' + f + ' ნახევარტონი ზემოთ = ' + nm + '.', f + ' semitones above the open ' + sName(s) + ' = ' + nm + '.'), sound([m])); },
    semitone: () => pickQ([
      () => mc(L('რამდენი ლადია ერთი ტონი?', 'How many frets make a tone?'), '2', ['1', '3', '12'], L('1 ლადი = ნახევარტონი, 2 ლადი = ტონი.', '1 fret = a semitone, 2 frets = a tone.')),
      () => mc(L('რამდენი ლადია ოქტავა?', 'How many frets make an octave?'), '12', ['7', '8', '17'], L('12 ნახევარტონი = ოქტავა; მე-12 ლადზე ღია სიმის ბგერა მეორდება.', '12 semitones = an octave; at fret 12 the open string\'s note returns.')),
      () => mc(L('ოქტავაში რამდენი სხვადასხვა ბგერაა?', 'How many different notes are in an octave?'), '12', ['7', '8', '5'], L('7 ძირითადი სახელი, სულ 12 ბგერა (ქრომატული გამა).', '7 basic names, 12 notes in all (the chromatic scale).')),
      () => mc(L('რომელ ნოტებს შორის არის მხოლოდ ნახევარტონი?', 'Which notes are only a semitone apart?'), L('მი–ფა და სი–დო (E–F, B–C)', 'E–F and B–C'), [L('დო–რე და ფა–სოლ', 'C–D and F–G'), L('ლა–სი', 'A–B'), L('სოლ–ლა', 'G–A')], L('E–F და B–C შორის შავი კლავიში არ არის.', 'There is no black key between E–F and B–C.'))]),
    accidental: () => pickQ([
      () => mc(L('რას აკეთებს დიეზი (♯)?', 'What does a sharp (♯) do?'), L('ნახევარტონით ამაღლებს (+1 ლადი)', 'Raises by a semitone (+1 fret)'), [L('ნახევარტონით ადაბლებს', 'Lowers by a semitone'), L('ტონით ამაღლებს', 'Raises by a tone'), L('აუქმებს ნიშნებს', 'Cancels the signs')], L('♯ = +1 ნახევარტონი, ♭ = −1, ♮ აუქმებს.', '♯ = +1 semitone, ♭ = −1, ♮ cancels.')),
      () => mc(L('რას ნიშნავს ბეკარი (♮)?', 'What does a natural (♮) mean?'), L('აუქმებს დიეზს ან ბემოლს', 'Cancels a sharp or a flat'), [L('ამაღლებს ტონით', 'Raises by a tone'), L('ადაბლებს ნახევარტონით', 'Lowers by a semitone'), L('ხმამაღლა დაკვრას', 'Play loudly')], L('ბეკარი ნოტს ჩვეულ სახეს უბრუნებს.', 'A natural returns the note to its plain form.')),
      () => mc(L('რას აკეთებს დუბლ-ბემოლი (𝄫)?', 'What does a double flat (𝄫) do?'), L('ტონით ადაბლებს (−2 ლადი)', 'Lowers by a tone (−2 frets)'), [L('ნახევარტონით ადაბლებს', 'Lowers by a semitone'), L('ტონით ამაღლებს', 'Raises by a tone'), L('არაფერს', 'Nothing')], L('ორი ბემოლი = ორი ნახევარტონი ქვემოთ.', 'Two flats = two semitones down.')),
      () => { const i = pick([1, 3, 6, 8, 10]), sh = TH.NN[i], fl = TH.NN_FLAT[i];
        return mc(L(sh + ' იმავე ბგერას რომელი სახელით წერენ ბემოლით?', 'Which flat name is the same sound as ' + sh + '?'), fl, others(fl, () => TH.NN_FLAT[(i + 1 + rnd(10)) % 12], 3), L(sh + ' = ' + fl + ' — ენჰარმონიულად თანაბარი: ჟღერს ერთნაირად, იწერება სხვანაირად.', sh + ' = ' + fl + ' — enharmonic: the same sound, written differently.'), sound([60 + i])); },
      () => mc(L('ალტერაციის ნიშანი, რომელიც ნოტის წინ წერია, სადამდე მოქმედებს?', 'A sign written before a note lasts until…'), L('ამ ტაქტის ბოლომდე', 'the end of that bar'), [L('მთელ ნაწარმოებზე', 'the end of the piece'), L('მხოლოდ ამ ნოტზე', 'only that one note'), L('შემდეგ სტრიქონამდე', 'the next line')], L('გასაღებთან დაწერილი ნიშნები კი მთელ ნაწარმოებზე მოქმედებს.', 'Signs in the key signature apply to the whole piece.'))]),
    staff: () => pickQ([
      () => mc(L('სოლის გასაღებში ხაზებზე მდგარი ნოტები (ქვემოდან):', 'In the treble clef the notes on the lines (bottom up) are:'), 'E G B D F', ['F A C E', 'E G B D E', 'G B D F A'], L('ხაზები: მი სოლ სი რე ფა.', 'Lines: E G B D F.')),
      () => mc(L('სოლის გასაღებში შუალედების ნოტები:', 'In the treble clef the notes in the spaces are:'), 'F A C E', ['E G B D F', 'A C E G', 'D F A C'], L('შუალედები: ფა ლა დო მი.', 'Spaces: F A C E.')),
      () => mc(L('სოლის გასაღები რომელ ხაზზე ამბობს „აქ სოლია (G4)“?', 'Which line does the treble clef name as G4?'), L('მეორეზე (ქვემოდან)', 'The second (from the bottom)'), [L('პირველზე', 'The first'), L('მესამეზე', 'The third'), L('მეოთხეზე', 'The fourth')], L('𝄞 მეორე ხაზს უვლის გარშემო.', '𝄞 curls around the second line.')),
      () => mc(L('ფას (ბანის) გასაღების ორი წერტილი რომელ ხაზს აკრავს?', 'The two dots of the bass clef surround which line?'), L('მეოთხეს — F3', 'The fourth — F3'), [L('მეორეს — G4', 'The second — G4'), L('მესამეს', 'The third'), L('პირველს', 'The first')], L('𝄢 = ფას გასაღები, მეოთხე ხაზი ფაა.', '𝄢 = bass clef, the fourth line is F.')),
      () => mc(L('ხუთხაზედის ხაზებს და შუალედებს როგორ ვითვლით?', 'How are the staff\'s lines and spaces counted?'), L('ქვემოდან ზემოთ', 'From the bottom up'), [L('ზემოდან ქვემოთ', 'From the top down'), L('შუიდან', 'From the middle'), L('მარჯვნიდან მარცხნივ', 'Right to left')], L('ქვემოდან ზემოთ — რაც მაღლაა, მით მაღალი ბგერაა.', 'Bottom up — the higher it sits, the higher it sounds.'))]),
    octave: () => pickQ([
      () => mc(L('A4 = 440 ჰც. რამდენია A5?', 'A4 = 440 Hz. What is A5?'), L('880 ჰც', '880 Hz'), [L('660 ჰც', '660 Hz'), L('220 ჰც', '220 Hz'), L('440 ჰც', '440 Hz')], L('ოქტავით ზემოთ — ორჯერ მეტი სიხშირე.', 'One octave up — twice the frequency.')),
      () => mc(L('ორ ერთსახელიან ნოტს შორის მანძილი რა ჰქვია?', 'What is the distance between two notes with the same name called?'), L('ოქტავა', 'An octave'), [L('კვინტა', 'A fifth'), L('ტერცია', 'A third'), L('პრიმა', 'A unison')], L('ოქტავა = 12 ნახევარტონი.', 'An octave = 12 semitones.')),
      () => mc(L('C4 რას ჰქვია პიანინოზე?', 'What is C4 called on the piano?'), L('შუა დო', 'Middle C'), [L('ყველაზე დაბალი დო', 'The lowest C'), L('ყველაზე მაღალი დო', 'The highest C'), L('ბანის დო', 'The bass C')], L('C4-დან B4-მდე ყველა ნოტს ნომერი 4 აქვს.', 'Every note from C4 to B4 carries the number 4.'))]),
    names: () => pickQ([
      () => { const i = rnd(7);
        return mc(L('„' + SYL[i][0] + '“ რომელი ასოა?', 'Which letter is “' + SYL[i][1] + '”?'), LET[i], others(LET[i], () => LET[rnd(7)], 3),
          L('დო C, რე D, მი E, ფა F, სოლ G, ლა A, სი B.', 'do C, re D, mi E, fa F, sol G, la A, si B.'), sound([60 + STEP[i]])); },
      () => { const i = rnd(7);
        return mc(L(LET[i] + ' სილაბურად როგორ იკითხება?', 'What is the solfège name of ' + LET[i] + '?'), SYL[i][0] === 'დო' ? L('დო', 'do') : L(SYL[i][0], SYL[i][1]), others(L(SYL[i][0], SYL[i][1]), () => { const k = rnd(7); return L(SYL[k][0], SYL[k][1]); }, 3),
          L('ასოები და სილაბური სახელები ერთსა და იმავეს ნიშნავს.', 'Letters and solfège names mean the same thing.')); },
      () => mc(L('სი-ს (B) შემდეგ რომელი ნოტი მოდის?', 'Which note comes after B?'), L('დო (C)', 'C (do)'), [L('ლა (A)', 'A (la)'), L('რე (D)', 'D (re)'), L('მი (E)', 'E (mi)')], L('სახელები წრეზე მეორდება: … ლა სი დო რე …', 'The names repeat: … A B C D …')),
      () => mc(L('მუსიკაში რამდენი ძირითადი ნოტის სახელია?', 'How many basic note names are there?'), '7', ['5', '8', '12'], L('დო რე მი ფა სოლ ლა სი — შვიდი.', 'do re mi fa sol la si — seven.'))]),

    /* --- rhythm, metre, durations --- */
    duration: () => pickQ([
      () => { const [nm, v] = pick(DUR);
        return mc(L(LX(nm) + ' ნოტი 4/4-ში რამდენი დარტყმაა?', 'How many beats is a ' + nm[1] + ' note in 4/4?'), BEATS[v], others(BEATS[v], () => BEATS[pick(DUR)[1]], 3),
          L('მთელი 4, ნახევარი 2, მეოთხედი 1, მერვედი ½, მეთექვსმეტედი ¼.', 'Whole 4, half 2, quarter 1, eighth ½, sixteenth ¼.')); },
      () => mc(L('რამდენი მერვედია ერთ ნახევარში?', 'How many eighths are in a half note?'), '4', ['2', '8', '6'], L('ნახევარი = 2 მეოთხედი = 4 მერვედი.', 'Half = 2 quarters = 4 eighths.')),
      () => mc(L('რამდენი მეთექვსმეტედია მთელ ნოტში?', 'How many sixteenths are in a whole note?'), '16', ['8', '4', '12'], L('1 მთელი = 2 ნახევარი = 4 მეოთხედი = 8 მერვედი = 16 მეთექვსმეტედი.', '1 whole = 2 halves = 4 quarters = 8 eighths = 16 sixteenths.')),
      () => mc(L('წერტილიანი მეოთხედი რამდენი დარტყმაა?', 'How many beats is a dotted quarter?'), '1½', ['2', '1¼', '3'], L('წერტილი ხანგრძლივობას ნახევრით ზრდის: 1 + ½.', 'A dot adds half the value: 1 + ½.')),
      () => mc(L('რას აკეთებს ლიგა (რკალი ორ ერთნაირ ნოტს შორის)?', 'What does a tie (an arc between two equal notes) do?'), L('ხანგრძლივობებს აერთებს — მეორე ნოტი აღარ იკვრება', 'Adds their lengths — the second note is not struck again'), [L('ორჯერ ამოკვრას ნიშნავს', 'Means striking twice'), L('ტრიოლია', 'Is a triplet'), L('პაუზაა', 'Is a rest')], L('ლიგით ბგერა გრძელდება.', 'A tie lengthens the sound.')),
      () => mc(L('ტრიოლი რას ნიშნავს?', 'What is a triplet?'), L('სამი თანაბარი ნოტი ორის ადგილას', 'Three equal notes in the time of two'), [L('სამი ტაქტი', 'Three bars'), L('სამი სიმი ერთად', 'Three strings together'), L('სამჯერ გამეორება', 'Three repeats')], L('6/8-ში დარტყმა ისედაც სამ მერვედად იყოფა — ტრიოლის ნიშნის გარეშე.', 'In 6/8 a beat is already three eighths — no triplet sign needed.'))]),
    rest: () => pickQ([
      () => { const [nm, v] = pick(DUR);
        return mc(L(LX(nm) + ' პაუზა რამდენი დარტყმაა?', 'How many beats is a ' + nm[1] + ' rest?'), BEATS[v], others(BEATS[v], () => BEATS[pick(DUR)[1]], 3),
          L('ყოველ ხანგრძლივობას თავისი პაუზა აქვს — იმავე ხანგრძლივობის.', 'Every note value has a rest of the same length.')); },
      () => mc(L('რომელი პაუზა „კიდია“ ხაზზე?', 'Which rest hangs below a line?'), L('მთელი', 'The whole rest'), [L('ნახევარი', 'The half rest'), L('მეოთხედი', 'The quarter rest'), L('მერვედი', 'The eighth rest')], L('მთელი კიდია, ნახევარი ხაზზე ზის.', 'The whole rest hangs, the half rest sits.')),
      () => mc(L('პაუზის დროს ფანდურზე რას აკეთებ?', 'What do you do on the panduri during a rest?'), L('სიმებს ხელს ოდნავ ადებ, რომ ბგერა გაჩუმდეს', 'Lightly touch the strings so the sound stops'), [L('უფრო ძლიერად უკრავ', 'Play louder'), L('ტემპს ანელებ', 'Slow the tempo'), L('ლადს ცვლი', 'Change fret')], L('პაუზა დუმილია — მუსიკა გრძელდება, ბგერა არა.', 'A rest is silence — the music goes on, the sound does not.'))]),
    meter: () => pickQ([
      () => { const n = pick([2, 3, 4]);
        return mc(L(n + '/4 ზომაში რამდენი მეოთხედია ტაქტში?', 'How many quarters in a bar of ' + n + '/4?'), String(n), others(String(n), () => String(1 + rnd(7)), 3),
          L('ზედა რიცხვი — წილების რაოდენობა, ქვედა — რომელი ნოტია წილი.', 'The top number is how many beats, the bottom which note is one beat.')); },
      () => mc(L('ზომის ქვედა რიცხვი რას ნიშნავს?', 'What does the bottom number of a time signature mean?'), L('რომელი ნოტია ერთი წილი (4 = მეოთხედი, 8 = მერვედი)', 'Which note is one beat (4 = quarter, 8 = eighth)'), [L('რამდენი წილია ტაქტში', 'How many beats a bar has'), L('ტემპს', 'The tempo'), L('აქცენტს', 'The accent')], L('ზედა — რამდენი, ქვედა — რა.', 'Top — how many, bottom — of what.')),
      () => mc(L('6/8 ზომაში ტაქტი რამდენ დიდ წილად იყოფა?', 'A bar of 6/8 divides into how many big beats?'), '2', ['6', '3', '4'], L('ორ ჯგუფად: 1 2 3 · 4 5 6 — თითოეული სამი მერვედი.', 'Into two groups: 1 2 3 · 4 5 6 — three eighths each.')),
      () => mc(L('აჭარულის ერთი რითმი (↓ ↓ ↑) 6/8-ში რამდენი მერვედია?', 'One Acharuli rhythm (↓ ↓ ↑) in 6/8 is how many eighths?'), '3', ['6', '2', '4'], L('სამი დარტყმა = სამი მერვედი; ერთ ტაქტში ორი რითმია.', 'Three strokes = three eighths; a bar holds two rhythms.')),
      () => mc(L('3/4-ში აქცენტები როგორ არის?', 'How do the accents fall in 3/4?'), L('ძლიერი – სუსტი – სუსტი (ვალსი)', 'strong – weak – weak (waltz)'), [L('ძლიერი – სუსტი – საშუალო – სუსტი', 'strong – weak – medium – weak'), L('სუსტი – ძლიერი – სუსტი', 'weak – strong – weak'), L('ყველა თანაბარი', 'all equal')], L('ვალსი: 1 ძლიერი, 2 და 3 სუსტი.', 'A waltz: 1 strong, 2 and 3 weak.')),
      () => mc(L('ტაქტებს შორის რა იწერება?', 'What is written between bars?'), L('ტაქტის ხაზი', 'A bar line'), [L('გასაღები', 'A clef'), L('რეპრიზა', 'A repeat sign'), L('ფერმატა', 'A fermata')], L('ტაქტის ხაზი მუსიკას თანაბარ ნაწილებად ყოფს.', 'The bar line divides music into equal parts.'))]),
    tempo: () => pickQ([
      () => mc(L('120 BPM — წამში რამდენი დარტყმაა?', '120 BPM — how many beats per second?'), '2', ['1', '4', '120'], L('120 / 60 წამი = 2.', '120 / 60 s = 2.')),
      () => mc(L('რას ზომავს BPM?', 'What does BPM measure?'), L('დარტყმებს წუთში (ტემპს)', 'Beats per minute (the tempo)'), [L('ბგერის სიმაღლეს', 'Pitch'), L('ხმის სიძლიერეს', 'Loudness'), L('ლადების რაოდენობას', 'The number of frets')], L('60 BPM = წამში ერთი დარტყმა.', '60 BPM = one beat per second.')),
      () => { const [nm, mean] = pick(TEMPO);
        return mc(L(nm + ' რას ნიშნავს?', 'What does ' + nm + ' mean?'), LX(mean), others(LX(mean), () => LX(pick(TEMPO)[1]), 3),
          L('Largo ძალიან ნელა · Adagio ნელა · Andante ნაბიჯით · Moderato ზომიერად · Allegro სწრაფად · Presto ძალიან სწრაფად.', 'Largo very slow · Adagio slow · Andante walking · Moderato moderate · Allegro fast · Presto very fast.')); },
      () => mc(L('ritardando რას ნიშნავს?', 'What does ritardando mean?'), L('თანდათან შენელებას', 'Gradually slowing down'), [L('თანდათან აჩქარებას', 'Gradually speeding up'), L('პირვანდელ ტემპზე დაბრუნებას', 'Back to the first tempo'), L('ხმამაღლა დაკვრას', 'Playing loudly')], L('accelerando აჩქარება, ritardando შენელება, a tempo დაბრუნება.', 'accelerando speeds up, ritardando slows down, a tempo returns.'))]),
    rhythm: () => { const RS = (PD.curriculum.rhythms() || []).filter(r => r.source === 'teacher' && r.strokes && r.strokes.length);
      if (!RS.length) return GEN.meter();
      const r = pick(RS), arrow = k => k.direction === 'down' ? '↓' : '↑', pat = r.strokes.map(arrow).join(' ');
      const acc = r.strokes.map((k, i) => k.accent ? i + 1 : 0).filter(Boolean);
      return pick([
        () => mc(L('„' + PD.i18n.pick(r.name) + '“ რამდენი დარტყმისგან შედგება?', 'How many strokes does “' + PD.i18n.pick(r.name) + '” have?'),
          String(r.strokes.length), others(String(r.strokes.length), () => { const o = pick(RS); return String(o.strokes.length); }, 3).concat(['2']).slice(0, 3),
          L('„' + PD.i18n.pick(r.name) + '“ = ' + pat + ' (' + r.strokes.length + ' დარტყმა).', '“' + PD.i18n.pick(r.name) + '” = ' + pat + ' (' + r.strokes.length + ' strokes).')),
        () => mc(L('რომელი რითმია ' + pat + '?', 'Which rhythm is ' + pat + '?'),
          PD.i18n.pick(r.name), others(PD.i18n.pick(r.name), () => PD.i18n.pick(pick(RS).name), 3),
          L('მასწავლებლის რითმები: ' + RS.map(x => PD.i18n.pick(x.name) + ' ' + x.strokes.map(arrow).join('')).join(' · ') + '.', 'The teacher\'s rhythms: ' + RS.map(x => PD.i18n.pick(x.name) + ' ' + x.strokes.map(arrow).join('')).join(' · ') + '.')),
        () => mc(L('„' + PD.i18n.pick(r.name) + '“-ში რომელ დარტყმაზეა აქცენტი?', 'Which stroke of “' + PD.i18n.pick(r.name) + '” is accented?'),
          ORDS(acc),
          others(ORDS(acc), () => { const o = pick(RS), a2 = o.strokes.map((k, i) => k.accent ? i + 1 : 0).filter(Boolean); return a2.length ? ORDS(a2) : null; }, 2).concat([L('ყველა დარტყმაზე', 'All of them')]).slice(0, 3),
          L('აქცენტიანი დარტყმა აპში წითელია; ' + PD.i18n.pick(r.name) + ': ' + r.strokes.map((k, i) => arrow(k) + (k.accent ? '(>)' : '')).join(' ') + '.', 'An accented stroke is red in the app; ' + PD.i18n.pick(r.name) + ': ' + r.strokes.map(k => arrow(k) + (k.accent ? '(>)' : '')).join(' ') + '.'))])(); },
    strokes: () => pickQ([
      () => mc(L('„↓“ რას ნიშნავს აპში?', 'What does “↓” mean in the app?'), L('ჩაკვრა — ზემოდან ქვემოთ', 'A down-stroke'), [L('ამოკვრა — ქვემოდან ზემოთ', 'An up-stroke'), L('პაუზა', 'A rest'), L('აქცენტი', 'An accent')], L('↓ ჩაკვრა, ↑ ამოკვრა, წითელი = აქცენტი.', '↓ down, ↑ up, red = accent.')),
      () => mc(L('წითელი ისარი აპში რას ნიშნავს?', 'What does a red arrow mean in the app?'), L('აქცენტს — ძლიერად დაკვრას', 'An accent — a stronger stroke'), [L('შეცდომას', 'A mistake'), L('ამოკვრას', 'An up-stroke'), L('პაუზას', 'A rest')], L('წითელი და უფრო სქელი ისარი = აქცენტი.', 'A red, thicker arrow = an accent.')),
      () => mc(L('რა არის დარტყმა (ბითი)?', 'What is the beat?'), L('მუსიკის თანაბარი პულსი — რასაც ფეხით აყოლებ', 'The even pulse of music — what you tap your foot to'), [L('ყველაზე ხმამაღალი ნოტი', 'The loudest note'), L('ტაქტის ხაზი', 'The bar line'), L('აკორდის ნოტი', 'A chord tone')], L('„1“ ჩვეულებრივ ყველაზე ძლიერია.', '“1” is usually the strongest.'))]),

    /* --- intervals, scales, chords, keys, signs --- */
    interval: () => pickQ([
      () => { const k = rnd(13);
        return mc(L(LX(IV[k]) + ' რამდენი ნახევარტონია?', 'How many semitones is a ' + IV[k][1] + '?'), String(k), others(String(k), () => String(rnd(13)), 3),
          L('ფანდურზე ინტერვალი ლადების რაოდენობაა ერთ სიმზე.', 'On the panduri an interval is simply the number of frets on one string.'), sound([69, 69 + k, [69, 69 + k]], .5)); },
      () => { const k = 1 + rnd(12);
        return mc(L(k + ' ნახევარტონი რომელი ინტერვალია?', 'Which interval is ' + k + ' semitones?'), LX(IV[k]), others(LX(IV[k]), () => LX(IV[rnd(13)]), 3),
          L('0 პრიმა · 3 პატარა ტერცია · 4 დიდი ტერცია · 5 კვარტა · 7 კვინტა · 12 ოქტავა.', '0 unison · 3 minor 3rd · 4 major 3rd · 5 fourth · 7 fifth · 12 octave.'), sound([69, 69 + k], .5)); },
      () => mc(L('A → C♯ (ფანდურის ორი ქვედა სიმი) რომელი ინტერვალია?', 'A → C♯ (the panduri\'s two lower strings) is which interval?'), L('დიდი ტერცია (4)', 'A major third (4)'), [L('პატარა ტერცია (3)', 'A minor third (3)'), L('წმინდა კვარტა (5)', 'A perfect fourth (5)'), L('წმინდა კვინტა (7)', 'A perfect fifth (7)')], L('A სიმის მე-4 ლადი = C♯ → 4 ნახევარტონი.', 'The A string\'s 4th fret = C♯ → 4 semitones.')),
      () => mc(L('A → E (ქვედა და ზედა სიმი) რომელი ინტერვალია?', 'A → E (the lowest and highest string) is which interval?'), L('წმინდა კვინტა (7)', 'A perfect fifth (7)'), [L('წმინდა კვარტა (5)', 'A perfect fourth (5)'), L('დიდი სექსტა (9)', 'A major sixth (9)'), L('ოქტავა (12)', 'An octave (12)')], L('A სიმის მე-7 ლადი = E.', 'The A string\'s 7th fret = E.'))]),
    chordType: () => { const CT = TH.CHORD_TYPES.filter(x => ['', 'm', '7', 'm7', 'maj7', 'dim', 'aug', 'sus2', 'sus4', '6'].includes(x.k)), c = pick(CT);
      const fmt = x => x.iv.join(' · ');
      return pick([
        () => mc(L(L(c.ka, c.en) + ' აკორდი ნახევარტონებით როგორ იგება?', 'How is a ' + c.en + ' chord built, in semitones?'), fmt(c), others(fmt(c), () => fmt(pick(CT)), 3),
          L('მთავარი ბგერიდან დათვლილი ნახევარტონები.', 'Semitones counted from the root.')),
        () => mc(L('0 · ' + c.iv.slice(1).join(' · ') + ' — რომელი აკორდია?', 'Which chord is 0 · ' + c.iv.slice(1).join(' · ') + '?'), L(c.ka, c.en), others(L(c.ka, c.en), () => { const o = pick(CT); return L(o.ka, o.en); }, 3),
          L('მაჟორი 0·4·7, მინორი 0·3·7, შემცირებული 0·3·6, გადიდებული 0·4·8.', 'Major 0·4·7, minor 0·3·7, diminished 0·3·6, augmented 0·4·8.'))])(); },
    barre: () => { const f = 1 + rnd(Math.min(12, FR())), root = TH.ROOT_NAMES[TH.pc(TH.midi(1, f))];
      return mc(L('სამივე სიმი მე-' + f + ' ლადზე (ბარე) — რომელი აკორდია?', 'All three strings on fret ' + f + ' (barre) — which chord?'),
        root + ' ' + L('მაჟორი', 'major'), others(root + ' ' + L('მაჟორი', 'major'), () => { const r2 = TH.ROOT_NAMES[rnd(12)]; return r2 + ' ' + (Math.random() < .5 ? L('მაჟორი', 'major') : L('მინორი', 'minor')); }, 3),
        L('აწყობა A C♯ E თავად მაჟორული ტრიადაა, ამიტომ ბარე ყოველთვის მაჟორს იძლევა: ' + f + ' ლადი = ' + root + '.', 'The tuning A C♯ E is itself a major triad, so a barre always gives a major chord: fret ' + f + ' = ' + root + '.'),
        () => { PD.audio.ensure(); PD.audio.strum([f, f, f], 'down', { gap: .03 }); }); },
    scale: () => pickQ([
      () => mc(L('მაჟორული გამის ნაბიჯები:', 'The major scale\'s steps:'), L('ტ ტ ნ ტ ტ ტ ნ', 'T T S T T T S'), [L('ტ ნ ტ ტ ნ ტ ტ', 'T S T T S T T'), L('ტ ტ ტ ნ ტ ტ ნ', 'T T T S T T S'), L('ნ ტ ტ ნ ტ ტ ტ', 'S T T S T T T')], L('C D E F G A B C — ტ ტ ნ ტ ტ ტ ნ.', 'C D E F G A B C — T T S T T T S.'), sound([60, 62, 64, 65, 67, 69, 71, 72], .32)),
      () => mc(L('ნატურალური მინორის ნაბიჯები:', 'The natural minor\'s steps:'), L('ტ ნ ტ ტ ნ ტ ტ', 'T S T T S T T'), [L('ტ ტ ნ ტ ტ ტ ნ', 'T T S T T T S'), L('ნ ტ ტ ტ ნ ტ ტ', 'S T T T S T T'), L('ტ ტ ნ ნ ტ ტ ნ', 'T T S S T T S')], L('A B C D E F G A — ტ ნ ტ ტ ნ ტ ტ.', 'A B C D E F G A — T S T T S T T.'), sound([57, 59, 60, 62, 64, 65, 67, 69], .32)),
      () => mc(L('ჰარმონიულ მინორში რომელი საფეხურია ამაღლებული?', 'Which degree is raised in the harmonic minor?'), L('მე-7', 'The 7th'), [L('მე-6', 'The 6th'), L('მე-3', 'The 3rd'), L('მე-5', 'The 5th')], L('A B C D E F G♯ A.', 'A B C D E F G♯ A.')),
      () => mc(L('რამდენი ბემოლია რე მინორში (ბანი-აჭარულის გამა)?', 'How many flats does D minor have (the scale of Bani-Acharuli)?'), '1 (B♭)', ['2', '0', '3'], L('D E F G A B♭ C D.', 'D E F G A B♭ C D.')),
      () => mc(L('პენტატონიკა რამდენი ნოტისგან შედგება?', 'How many notes does a pentatonic scale have?'), '5', ['7', '6', '8'], L('მაჟორული პენტატონიკა: C D E G A.', 'Major pentatonic: C D E G A.')),
      () => mc(L('გამის პირველ ბგერას რა ჰქვია?', 'What is the first note of a scale called?'), L('ტონიკა', 'The tonic'), [L('დომინანტა', 'The dominant'), L('სუბდომინანტა', 'The subdominant'), L('ტრიადა', 'The triad')], L('ტონიკა — „სახლი“, I საფეხური.', 'The tonic — “home”, degree I.'))]),
    key: () => pickQ([
      () => mc(L('რე მინორში რომელი საფეხურია B♭?', 'In D minor, which degree is B♭?'), 'VI', ['IV', 'VII', 'II'], L('D(I) E(II) F(III) G(IV) A(V) B♭(VI) C(VII).', 'D(I) E(II) F(III) G(IV) A(V) B♭(VI) C(VII).')),
      () => mc(L('რომელი საფეხური ქმნის დაძაბულობას და ტონიკაში დაბრუნებას „ითხოვს“?', 'Which degree creates tension that wants to return home?'), L('V — დომინანტა', 'V — the dominant'), [L('I — ტონიკა', 'I — the tonic'), L('IV — სუბდომინანტა', 'IV — the subdominant'), 'III'], L('V → I ყველაზე ძლიერი დასასრულია.', 'V → I is the strongest ending.')),
      () => mc(L('დო მაჟორში II საფეხურის აკორდი რომელია?', 'In C major, which chord is degree II?'), 'Dm', ['Em', 'F', 'G'], L('C · Dm · Em · F · G · Am · B°.', 'C · Dm · Em · F · G · Am · B°.')),
      () => mc(L('„ბანი-აჭარული“ რომელ ტონალობაშია?', 'Which key is “Bani-Acharuli” in?'), L('რე მინორი', 'D minor'), [L('დო მაჟორი', 'C major'), L('ლა მინორი', 'A minor'), L('სოლ მაჟორი', 'G major')], L('Dm (I) · B♭ (VI) · C (VII).', 'Dm (I) · B♭ (VI) · C (VII).')),
      () => mc(L('ტრიადა რისგან შედგება?', 'What is a triad made of?'), L('ტონიკა + ტერცია + კვინტა (1 · 3 · 5)', 'Root + third + fifth (1 · 3 · 5)'), [L('ოთხი ნოტისგან', 'Four notes'), L('ტონიკა + კვარტა', 'Root + fourth'), L('ორი ნოტისგან', 'Two notes')], L('გამის ყოველი მეორე ნოტი.', 'Every other note of the scale.'))]),
    signs: () => pickQ([
      () => { const [sg, mean] = pick(DYN);
        return mc(L('რას ნიშნავს ' + sg + '?', 'What does ' + sg + ' mean?'), LX(mean), others(LX(mean), () => LX(pick(DYN)[1]), 3),
          L('pp ძალიან ჩუმად · p ჩუმად · mp · mf · f ხმამაღლა · ff ძალიან ხმამაღლა.', 'pp very soft · p soft · mp · mf · f loud · ff very loud.')); },
      () => mc(L('რეპრიზა (𝄆 … 𝄇) რას ნიშნავს?', 'What does a repeat sign (𝄆 … 𝄇) mean?'), L('ამ ნაწილის გამეორებას', 'Play this part again'), [L('ტემპის შენელებას', 'Slow down'), L('ხმამაღლა დაკვრას', 'Play loudly'), L('პაუზას', 'A rest')], L('1. 2. ვოლტები — პირველად პირველი ბოლო, მეორედ მეორე.', '1. 2. endings — first time ending 1, second time ending 2.')),
      () => mc(L('ფერმატა (𝄐) რას ნიშნავს?', 'What does a fermata (𝄐) mean?'), L('ნოტი ან პაუზა ჩვეულებრივზე დიდხანს გრძელდება', 'Hold the note or rest longer than written'), [L('ძალიან ჩუმად', 'Very soft'), L('გაორმაგებულ ტემპს', 'Double tempo'), L('აქცენტს', 'An accent')], L('ფერმატა დროს „აჩერებს“.', 'A fermata stretches the time.')),
      () => mc(L('ნიშანი „>“ ნოტთან რას ნიშნავს?', 'What does “>” on a note mean?'), L('აქცენტს — ეს ნოტი ძლიერად', 'An accent — play it strongly'), [L('ჩუმად', 'Softly'), L('გრძლად', 'Longer'), L('მოკლედ', 'Shorter')], L('აპში აქცენტიანი დარტყმა წითელია.', 'In the app an accented stroke is red.'))]),

    /* --- solfège --- */
    solfSyl: () => { const i = rnd(7);
      return mc(L('„' + SYL[i][0] + '“ გამის რომელი საფეხურია?', 'Which degree of the scale is “' + SYL[i][1] + '”?'), String(i + 1), others(String(i + 1), () => String(1 + rnd(7)), 3),
        L('დო 1 · რე 2 · მი 3 · ფა 4 · სოლ 5 · ლა 6 · სი 7.', 'do 1 · re 2 · mi 3 · fa 4 · sol 5 · la 6 · si 7.'), sound([60, 60 + STEP[i]], .55)); },
    solfStep: () => { const i = 1 + rnd(6);
      return mc(L('„დო“-დან „' + SYL[i][0] + '“-მდე რამდენი ნახევარტონია?', 'How many semitones from “do” to “' + SYL[i][1] + '”?'), String(STEP[i]), others(String(STEP[i]), () => String(STEP[1 + rnd(6)]), 3),
        L('დო-რე 2 · დო-მი 4 · დო-ფა 5 · დო-სოლ 7 · დო-ლა 9 · დო-სი 11 · დო-დო 12.', 'do-re 2 · do-mi 4 · do-fa 5 · do-sol 7 · do-la 9 · do-si 11 · do-do 12.'), sound([60, 60 + STEP[i], [60, 60 + STEP[i]]], .5)); },
    solfIv: () => { const names = [['სეკუნდა', '2nd'], ['ტერცია', '3rd'], ['კვარტა', '4th'], ['კვინტა', '5th'], ['სექსტა', '6th'], ['სეპტიმა', '7th'], ['ოქტავა', 'octave']], k = rnd(7);
      return mc(L('„' + names[k][0] + '“ რამდენ საფეხურს მოიცავს?', 'How many steps does a ' + names[k][1] + ' span?'), String(k + 2), others(String(k + 2), () => String(2 + rnd(7)), 3),
        L('სეკუნდა 2, ტერცია 3, კვარტა 4, კვინტა 5, სექსტა 6, სეპტიმა 7, ოქტავა 8 საფეხური.', 'A 2nd spans 2 steps, a 3rd 3, a 4th 4, a 5th 5, a 6th 6, a 7th 7, an octave 8.')); },
    ear: () => { const i = 1 + rnd(6), m = 60 + STEP[i];
      return mc(L('მოუსმინე: ჯერ „დო“ ჟღერს, მერე ნოტი. რომელია მეორე?', 'Listen: “do” sounds first, then a note. Which is the second?'),
        L(SYL[i][0], SYL[i][1]), others(L(SYL[i][0], SYL[i][1]), () => { const k = 1 + rnd(6); return L(SYL[k][0], SYL[k][1]); }, 3),
        L('„დო“-დან ' + STEP[i] + ' ნახევარტონი = ' + SYL[i][0] + '.', STEP[i] + ' semitones from “do” = ' + SYL[i][1] + '.'), sound([60, m], .7)); },
    earIv: () => { const k = pick([2, 3, 4, 5, 7, 9, 12]);
      return mc(L('მოუსმინე ორ ნოტს: რომელი ინტერვალია?', 'Listen to the two notes: which interval is it?'),
        LX(IV[k]), others(LX(IV[k]), () => LX(IV[pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])]), 3),
        L(k + ' ნახევარტონი = ' + IV[k][0] + '.', k + ' semitones = ' + IV[k][1] + '.'), sound([60, 60 + k, [60, 60 + k]], .55)); }
  };

  /* ---------------- the theory book's own self-check questions ---------------- */
  function chapterQs(ids) {
    const out = [];
    (PD.theoryBook && PD.theoryBook.CHAPTERS || []).forEach(c => {
      if (ids && !ids.includes(c.id)) return;
      (c.q || []).forEach(([q, opts, ok, why]) => out.push({ q: L(q[0], q[1]), opts: opts.map(o => Array.isArray(o) ? L(o[0], o[1]) : String(o)), ok, why: L(why[0], why[1]), play: null, src: c.id }));
    });
    return out;
  }

  /* ---------------- topics and exams ---------------- */
  const TOPICS = {
    inst: { title: 'ex.t1', gens: ['stringNum', 'stringVoice', 'tuning', 'fretCount', 'range', 'markers', 'fingers', 'zero', 'thumb', 'strokes'], ch: ['octave', 'neck', 'app'] },
    rhythm: { title: 'ex.t2', gens: ['duration', 'rest', 'meter', 'tempo', 'rhythm', 'strokes'], ch: ['durations', 'rests', 'meter', 'tempo', 'app'] },
    notes: { title: 'ex.t3', gens: ['fretNote', 'noteWhere', 'semitone', 'accidental', 'staff', 'octave', 'names'], ch: ['names', 'octave', 'semitone', 'accidentals', 'neck', 'staff'] },
    harmony: { title: 'ex.t4', gens: ['interval', 'chordType', 'barre', 'scale', 'key', 'signs'], ch: ['intervals', 'scales', 'chords', 'key', 'signs'] },
    solfege: { title: 'ex.t5', gens: ['solfSyl', 'solfStep', 'solfIv', 'names', 'ear', 'earIv', 'interval'], ch: [] },
    all: { title: 'ex.t6', gens: null, ch: null }
  };
  const EXAMS = [
    { id: 'ex-inst', topic: 'inst', name: 'ex.e1', n: 10, min: 8, pass: 80, after: 'instrument' },
    { id: 'ex-rhythm', topic: 'rhythm', name: 'ex.e2', n: 12, min: 10, pass: 80, after: 'rhythms' },
    { id: 'ex-notes', topic: 'notes', name: 'ex.e3', n: 14, min: 12, pass: 80, after: 'notes' },
    { id: 'ex-harmony', topic: 'harmony', name: 'ex.e4', n: 14, min: 12, pass: 80, after: 'scales' },
    { id: 'ex-solfege', topic: 'solfege', name: 'ex.e5', n: 12, min: 10, pass: 80, after: 'solfege' },
    { id: 'ex-final', topic: 'all', name: 'ex.e6', n: 24, min: 20, pass: 85, after: 'deeper' }
  ];
  const genNames = tp => tp.gens || Object.keys(GEN);
  /** one fresh set of questions: the chapters' own questions first, then generated ones, no repeats */
  function draw(topic, n) {
    const tp = TOPICS[topic] || TOPICS.all, out = [], seen = new Set();
    const add = q => { const k = String(q.q); if (!q || seen.has(k)) return false; seen.add(k); out.push(q); return true; };
    shuf(chapterQs(tp.ch)).slice(0, Math.ceil(n * .4)).forEach(add);
    const gens = shuf(genNames(tp)); let i = 0, guard = 0;
    while (out.length < n && guard++ < n * 40) { const g = gens[i++ % gens.length]; try { add(GEN[g]()); } catch (_) {} }
    return shuf(out).slice(0, n);
  }
  const bankSize = topic => { const tp = TOPICS[topic] || TOPICS.all; return chapterQs(tp.ch).length + genNames(tp).length * 4; };

  /* ---------------- progress ---------------- */
  const results = () => PD.store.get('exam.done', {});
  const passed = id => !!results()[id];
  const list = () => EXAMS.map((e, i) => Object.assign({}, e, { done: results()[e.id] || null, open: i === 0 || passed(EXAMS[i - 1].id) }));
  const get = id => EXAMS.find(e => e.id === id) || null;
  const active = () => { const a = PD.store.get('exam.on', null); return a && a.id && get(a.id) && !passed(a.id) ? a : null; };
  function begin(id) { const e = get(id); if (!e) return; PD.store.set('exam.on', { id, at: Date.now() }); PD.bus.emit('exam', { id, on: true }); open(id); }
  function finish(id, score) {
    const e = get(id), r = results();
    if (score >= e.pass) { r[id] = { at: Date.now(), p: score }; PD.store.set('exam.done', r); PD.store.set('exam.on', null);
      const k = 'exam.xp.' + id; if (!PD.store.get(k, false)) { PD.store.set(k, true); if (PD.levels) PD.levels.add(60, 'exam'); }
      PD.bus.emit('exam', { id, on: false, passed: true }); }
    else PD.bus.emit('exam', { id, on: true, passed: false });
    return score >= e.pass;
  }
  function blocked() { if (PD.ui && PD.ui.toast) PD.ui.toast(t('ex.lockShort'), 2200); }

  /* =================================================================
     The exam screen. It is not a page inside the app: it covers the
     whole screen, has no way out and no tab bar, and it stays there
     (also after a reload) until the exam is passed. The only thing
     that opens from it is the exercise for its own subject.
     ================================================================= */
  let Z = null;   // the open exam screen
  const openNow = () => !!Z;
  function close() { if (!Z) return; const z = Z; Z = null; clearInterval(z.timer); z.root.remove(); document.body.style.overflow = ''; document.body.classList.remove('exam-on'); if (PD.app && PD.app.render) PD.app.render(); }
  function open(id) {
    const e = get(id); if (!e) return;
    if (Z && Z.id === id) return; if (Z) close();
    let a = active();
    if (!a || a.id !== id) { PD.store.set('exam.on', { id, at: Date.now() }); a = active(); }
    const root = h('div', { class: 'exz', role: 'dialog', 'aria-modal': 'true', 'aria-label': t(e.name) });
    const head2 = h('header', { class: 'exz-top' }), body = h('div', { class: 'exz-body' }), foot = h('footer', { class: 'exz-foot' });
    root.append(head2, body, foot);
    document.body.appendChild(root); document.body.style.overflow = 'hidden'; document.body.classList.add('exam-on');
    Z = { id, root, head: head2, body, foot, timer: 0 };
    runExam(e, a);
    PD.i18n.apply(root);
  }
  /** the exam itself */
  function runExam(e, a) {
    const qs = draw(e.topic, e.n), answers = new Array(qs.length).fill(-1);
    api._cur = { id: e.id, qs, answers };   // the running exam, for the automated tests
    const until = a.at + e.min * 60000;
    let i = 0, over = false, warned = false;
    const { head: head2, body, foot } = Z;
    clearInterval(Z.timer);
    const fmt = ms => { const s2 = Math.max(0, Math.round(ms / 1000)); return (s2 / 60 | 0) + ':' + String(s2 % 60).padStart(2, '0'); };
    const clock = h('span', { class: 'exz-clock' }), bar = h('i'), cnt = h('span', { class: 'exz-n' });
    head2.innerHTML = '';
    head2.append(h('div', { class: 'exz-row' }, [h('b', { text: t(e.name) }), h('span', { class: 'spacer' }), clock]),
      h('div', { class: 'exz-row sub' }, [cnt, h('span', { class: 'spacer' }), h('small', { text: t('ex.rule', { n: e.n, m: e.min, p: e.pass }) })]),
      h('div', { class: 'exz-prog' }, [bar]));
    function tick() {
      const left = until - Date.now();
      clock.textContent = fmt(left); clock.classList.toggle('hot', left < 60000);
      cnt.textContent = t('ex.qN', { a: i + 1, b: qs.length });
      bar.style.width = Math.round(answers.filter(x => x >= 0).length / qs.length * 100) + '%';
      if (left <= 0) done(true);
    }
    function drawQ() {
      const q = qs[i]; body.innerHTML = '';
      const card = h('section', { class: 'exq' }, [h('p', { class: 'exq-q', html: LX(q.q) })]);
      if (q.play) card.append(h('button', { class: 'btn small', 'data-t': 'ex.listen', onclick: () => q.play() }));
      const box = h('div', { class: 'exq-opts' }, q.opts.map((o, k) => h('button', { class: 'btn' + (answers[i] === k ? ' on' : ''), html: LX(o), onclick: () => {
        answers[i] = k; tick();
        if (i < qs.length - 1) setTimeout(() => { if (!over) { i++; drawQ(); tick(); } }, 170); else drawQ();
      } })));
      card.append(box); body.append(card);
      foot.innerHTML = '';
      foot.append(h('button', { class: 'btn small', 'data-t': 'ex.prev', disabled: i === 0, onclick: () => { i--; drawQ(); tick(); } }),
        h('span', { class: 'spacer' }),
        i < qs.length - 1 ? h('button', { class: 'btn small', 'data-t': 'ex.next', onclick: () => { i++; drawQ(); tick(); } })
          : h('button', { class: 'btn primary', 'data-t': 'ex.submit', onclick: () => {
            const miss = answers.filter(x => x < 0).length;
            if (miss && !warned) { warned = true; i = answers.findIndex(x => x < 0); drawQ(); tick(); body.append(h('p', { class: 'notice', text: t('ex.unanswered', { n: miss }) })); return; }
            done(false);
          } }));
      PD.i18n.apply(body); PD.i18n.apply(foot);
      body.scrollTop = 0;
    }
    function done(timeUp) {
      if (over) return; over = true; clearInterval(Z.timer);
      const right = answers.filter((x, k) => x === qs[k].ok).length, p = Math.round(right / qs.length * 100);
      const ok = finish(e.id, p);
      result(e, qs, answers, right, p, ok, timeUp);
    }
    Z.timer = setInterval(tick, 1000);
    tick(); drawQ();
  }
  /** the result, inside the same screen */
  function result(e, qs, answers, right, p, ok, timeUp) {
    const { head: head2, body, foot } = Z;
    head2.innerHTML = ''; head2.append(h('div', { class: 'exz-row' }, [h('b', { text: t(e.name) })]));
    body.innerHTML = '';
    body.append(h('div', { class: 'exr' + (ok ? ' ok' : ' bad') }, [
      h('span', { class: 'exr-ic', html: ok ? (ic.check || '✓') : '!' }),
      h('h1', { text: ok ? t('ex.pass') : t('ex.fail', { p: e.pass }) }),
      h('b', { text: t('ex.result', { a: right, b: qs.length, p }) }),
      timeUp ? h('small', { 'data-t': 'ex.timeUp' }) : null,
      ok ? h('small', { text: t('ex.xp', { n: 60 }) }) : null].filter(Boolean)));
    if (!ok) body.append(h('p', { class: 'notice', 'data-t': 'ex.lock' }));
    const rev = h('section', { class: 'exrev' }, [h('h2', { 'data-t': 'ex.review' })]);
    qs.forEach((q, k) => {
      const good = answers[k] === q.ok;
      rev.append(h('div', { class: 'exrev-q' + (good ? ' ok' : ' bad') }, [
        h('b', { html: LX(q.q) }),
        h('small', { html: t('ex.yours') + ': ' + (answers[k] >= 0 ? LX(q.opts[answers[k]]) : t('ex.none')) }),
        good ? null : h('small', { class: 'exrev-r', html: t('ex.right') + ': ' + LX(q.opts[q.ok]) }),
        h('small', { class: 'exrev-w', html: LX(q.why) })].filter(Boolean)));
    });
    body.append(rev);
    foot.innerHTML = '';
    if (ok) foot.append(h('button', { class: 'btn primary big', 'data-t': 'ex.go', onclick: close }));
    else foot.append(h('button', { class: 'btn', 'data-t': 'ex.drill', onclick: () => drillMode(e) }), h('span', { class: 'spacer' }),
      h('button', { class: 'btn primary', 'data-t': 'ex.retry', onclick: () => { PD.store.set('exam.on', { id: e.id, at: Date.now() }); runExam(e, active()); } }));
    PD.i18n.apply(Z.root); body.scrollTop = 0;
  }
  /** the exercise for this subject, inside the exam screen: nothing else opens from here */
  function drillMode(e) {
    const { head: head2, body, foot } = Z;
    clearInterval(Z.timer);
    head2.innerHTML = ''; head2.append(h('div', { class: 'exz-row' }, [h('b', { text: t('ex.drill') + ' · ' + t(TOPICS[e.topic].title) })]));
    let a = 0, b = 0;
    function next() {
      const q = draw(e.topic, 1)[0];
      body.innerHTML = '';
      const sc = h('div', { class: 'exd-score', text: t('ex.score', { a, b }) });
      const card = h('section', { class: 'exq' }, [h('p', { class: 'exq-q', html: LX(q.q) })]);
      if (q.play) { card.append(h('button', { class: 'btn small', 'data-t': 'ex.listen', onclick: () => q.play() })); try { q.play(); } catch (_) {} }
      const fb = h('p', { class: 'tb-fb', hidden: true });
      const box = h('div', { class: 'exq-opts' }, q.opts.map((o, k) => h('button', { class: 'btn', html: LX(o), onclick: ev => {
        const good = k === q.ok; b++; if (good) a++;
        box.querySelectorAll('button').forEach(x => { x.disabled = true; });
        ev.currentTarget.classList.add(good ? 'ok' : 'bad');
        if (!good) box.querySelectorAll('button')[q.ok].classList.add('ok');
        fb.hidden = false; fb.className = 'tb-fb ' + (good ? 'ok' : 'bad'); fb.innerHTML = LX(q.why);
        if (good && PD.audio.ok) PD.audio.ok();
        sc.textContent = t('ex.score', { a, b });
        card.append(h('button', { class: 'btn primary', 'data-t': 'ex.more', onclick: next }));
        PD.i18n.apply(card);
      } })));
      card.append(box, fb);
      body.append(sc, card, h('p', { class: 'muted', 'data-t': 'ex.of' }));
      foot.innerHTML = '';
      foot.append(h('span', { class: 'spacer' }), h('button', { class: 'btn primary', 'data-t': 'ex.again', onclick: () => { PD.store.set('exam.on', { id: e.id, at: Date.now() }); runExam(e, active()); } }));
      PD.i18n.apply(Z.root); body.scrollTop = 0;
    }
    next();
  }

  /* ---------------- compulsory: the exam opens by itself ----------------
     As soon as every other step of a learning unit is done, that unit's
     exam opens and holds the screen until it is passed. */
  function dueExam() {
    const PATHS = (PD.lessons && PD.lessons.PATHS) || [], sd = PD.app && PD.app.stepDone;
    if (!sd) return null;
    for (const p of PATHS) {
      const ex = p.steps.find(s2 => s2.kind === 'exam'); if (!ex || passed(ex.id)) continue;
      const rest = p.steps.filter(s2 => s2.kind !== 'exam' && s2.kind !== 'needs');
      if (rest.length && rest.every(sd)) return ex.id;
    }
    return null;
  }
  /** called on every screen the app draws */
  function guard() {
    if (PD.store.get('author', false)) return;
    const a = active();
    if (a) { if (!Z) open(a.id); return; }
    if (Z) close();
    if (document.querySelector('.pz, .ss-full, .ag, .ob')) return;   // not in the middle of a lesson, the tuner or a gate
    const due = dueExam(); if (due) open(due);
  }

  /* ---------------- the list (a page inside Learn) ---------------- */
  function page(w, param) {
    if (param && get(param)) { open(param); PD.app.go('exams', null, true); return; }
    w.append(h('div', { class: 'row pg-head' }, [h('button', { class: 'btn small backbtn', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('learn') }), h('h1', { 'data-t': 'ex.title', style: 'margin:0' })]),
      h('p', { class: 'fg2', 'data-t': 'ex.lead' }));
    list().forEach(e => {
      const d = e.done, open2 = e.open || d;
      w.append(h('section', { class: 'exc' + (d ? ' done' : '') + (open2 ? '' : ' locked') }, [
        h('div', { class: 'exc-top' }, [h('span', { class: 'exc-ic', html: d ? (ic.check || EXIC) : EXIC }),
          h('div', { class: 'grow' }, [h('b', { 'data-t': e.name }), h('small', { text: t('ex.rule', { n: e.n, m: e.min, p: e.pass }) })]),
          d ? h('span', { class: 'exc-st', text: t('ex.passedOn', { d: new Date(d.at).toLocaleDateString(PD.i18n.lang === 'ka' ? 'ka-GE' : 'en-GB'), p: d.p }) }) : null]),
        h('div', { class: 'exc-acts' }, [
          h('button', { class: 'btn' + (d ? '' : ' primary'), 'data-t': d ? 'ex.again' : 'ex.start', disabled: !open2, onclick: () => begin(e.id) }),
          h('button', { class: 'btn small ghost', 'data-t': 'ex.drill', onclick: () => PD.app.go('drill', e.topic) })]),
        open2 ? null : h('small', { class: 'muted', 'data-t': 'ex.locked' })].filter(Boolean)));
    });
    w.append(h('p', { class: 'muted', style: 'text-align:center', text: t('ex.drillD') }));
    PD.i18n.apply(w);
  }

  /* ---------------- the exercise as its own page (outside an exam) ---------------- */
  function drill(w, topic) {
    topic = TOPICS[topic] ? topic : 'all';
    w.append(h('div', { class: 'row pg-head' }, [h('button', { class: 'btn small backbtn', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('exams') }), h('h1', { text: t('ex.drill') + ' · ' + t(TOPICS[topic].title), style: 'margin:0' })]));
    w.append(h('p', { class: 'fg2', 'data-t': 'ex.drillD' }));
    const tabs = h('div', { class: 'chips-row' }, Object.keys(TOPICS).map(k => h('button', { class: 'chip', 'aria-pressed': String(k === topic), text: t(TOPICS[k].title), onclick: () => PD.app.go('drill', k) })));
    const score = h('div', { class: 'exd-score' }), card = h('section', { class: 'exq' });
    w.append(tabs, score, card, h('p', { class: 'muted', style: 'text-align:center', 'data-t': 'ex.of' }));
    let a = 0, b = 0, q = null;
    function next() {
      q = draw(topic, 1)[0]; card.innerHTML = '';
      card.append(h('p', { class: 'exq-q', html: LX(q.q) }));
      if (q.play) { card.append(h('button', { class: 'btn small', 'data-t': 'ex.listen', onclick: () => q.play() })); try { q.play(); } catch (_) {} }
      const fb = h('p', { class: 'tb-fb', hidden: true });
      const box = h('div', { class: 'exq-opts' }, q.opts.map((o, k) => h('button', { class: 'btn', html: LX(o), onclick: ev => {
        const good = k === q.ok; b++; if (good) a++;
        box.querySelectorAll('button').forEach(x => { x.disabled = true; });
        ev.currentTarget.classList.add(good ? 'ok' : 'bad');
        if (!good) box.querySelectorAll('button')[q.ok].classList.add('ok');
        fb.hidden = false; fb.className = 'tb-fb ' + (good ? 'ok' : 'bad'); fb.innerHTML = LX(q.why);
        if (good && PD.audio.ok) PD.audio.ok();
        score.textContent = t('ex.score', { a, b });
        card.append(h('button', { class: 'btn primary', 'data-t': 'ex.more', onclick: next }));
        PD.i18n.apply(card);
      } })));
      card.append(box, fb);
      PD.i18n.apply(card);
    }
    score.textContent = t('ex.score', { a, b });
    next(); PD.i18n.apply(w);
  }

  const api = { page, drill, list, passed, active, begin, blocked, finish, draw, bankSize, open, close, guard, dueExam, openNow, EXAMS, TOPICS, get, GEN };
  return api;
})();
