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
  'ex.unansN': ['{n} უპასუხო', '{n} unanswered'],
  'ex.goUnans': ['უპასუხოზე გადასვლა', 'Go to it'],
  'ex.anyway': ['მაინც დასრულება', 'Finish anyway'],
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
  'ex.e0': ['პირველი ნაბიჯები: დაჯდომა, ხელები, მოვლა', 'First steps: sitting, the hands, care'],
  'ex.e1': ['ფანდური: სიმები, ლადები, თითები', 'The panduri: strings, frets, fingers'],
  'ex.e2': ['რითმი, ზომა და ხანგრძლივობა', 'Rhythm, metre and note values'],
  'ex.e3': ['ნოტები, ნიშნები და ტარის რუკა', 'Notes, signs and the map of the neck'],
  'ex.e4': ['ინტერვალები, გამები, აკორდები', 'Intervals, scales and chords'],
  'ex.e5': ['სოლფეჯიო', 'Solfège'],
  'ex.e6': ['საბოლოო გამოცდა — მთელი თეორია', 'Final exam — the whole theory'],
  'ex.t0': ['პირველი ნაბიჯები', 'First steps'], 'ex.t1': ['ფანდური', 'The panduri'], 'ex.t2': ['რითმი', 'Rhythm'], 'ex.t3': ['ნოტები', 'Notes'], 'ex.t4': ['ჰარმონია', 'Harmony'], 'ex.t5': ['სოლფეჯიო', 'Solfège'], 'ex.t6': ['ყველაფერი', 'Everything'],
  'ex.later': ['მოგვიანებით', 'Later'],
  'ex.laterD': ['გამოცდა დარჩება — სანამ არ ჩააბარებ, შემდეგი ბლოკის გაკვეთილები დაკეტილია.', 'The exam stays — until you pass it the next unit\'s lessons are locked.'],
  'ex.waiting': ['გამოცდა გელოდება', 'An exam is waiting'],
  'ex.waitingD': ['„{s}“ — სანამ არ ჩააბარებ, შემდეგი ბლოკი დაკეტილია.', '“{s}” — the next unit is locked until you pass it.'],
  'ex.blocked': ['ჯერ გამოცდა ჩააბარე', 'Pass the exam first'],
  'ex.blockedD': ['„{s}“ გამოცდა ჩააბარე და ეს ბლოკი გაიხსნება.', 'Pass “{s}” and this unit opens.'],
  'ex.go2': ['გამოცდაზე გადასვლა', 'Go to the exam'],
  'ex.certT': ['გილოცავ! კურსი დასრულებულია 🎓', 'Congratulations! The course is complete 🎓'],
  'ex.certD': ['ყველა გამოცდა ჩაბარებულია — პირველი ნაბიჯებიდან რთულ პრაქტიკამდე. გმადლობ, რომ ფანდური ისწავლე ამ აპით.', 'Every exam is passed — from the first steps to the advanced practice. Thank you for learning the panduri with this app.'],
  'ex.cert': ['სერთიფიკატი', 'Certificate'],
  'ex.certName': ['ფანდურის სწავლების სრული კურსი', 'The complete panduri course'],
  'ex.certLine': ['ამ სერთიფიკატს ადასტურებს, რომ', 'This certifies that'],
  'ex.certFin': ['გაიარა ფანდურის სწავლების სრული კურსი და ჩააბარა ყველა გამოცდა', 'has completed the full panduri course and passed every exam'],
  'ex.certWho': ['ფანდურის სასწავლო აპლიკაცია', 'The panduri learning app'],
  'ex.certDate': ['თარიღი', 'Date'],
  'ex.certLv': ['ლეველი {n} · {x} XP', 'Level {n} · {x} XP'],
  'ex.certSave': ['სურათად შენახვა', 'Save as a picture'],
  'ex.certShare': ['გაზიარება', 'Share'],
  'ex.certSaved': ['სერთიფიკატი შენახულია.', 'The certificate is saved.'],
  'ex.gift': ['საჩუქარი', 'Your gift'],
  'ex.giftD': ['კურსდამთავრებულის ნიშანი პროფილში · სერთიფიკატი შენი სახელით · ყველა გამოცდის ხელახლა გავლა ნებისმიერ დროს', 'A graduate badge on your profile · a certificate with your name · every exam open to retake whenever you like'],
  'ex.grad': ['კურსდამთავრებული', 'Graduate'],
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
  const Q = (q, opts, ok, why, play, art) => ({ q, opts, ok, why, play: play || null, art: art || null });
  /** three wrong answers that are not the right one and not repeated */
  function others(right, poolFn, n) {
    const out = []; let guard = 0;
    while (out.length < (n || 2) && guard++ < 200) { const v = poolFn(); if (v != null && String(v) !== String(right) && !out.some(x => String(x) === String(v))) out.push(v); }
    return out;
  }
  function mc(q, right, wrong, why, play, art) {   // multiple choice from one right and some wrong answers
    const opts = shuf([right].concat(wrong));
    return Q(q, opts, opts.findIndex(o => o === right), why, play, art);
  }
  const ART = () => PD.notesArt;

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
  const fLab = f => f === 0 ? L('ღია სიმი (0)', 'the open string (0)') : L((f === 1 ? '1-ლი' : 'მე-' + f) + ' ლადი', 'fret ' + f);
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

  /* ---------------- the teaching cards' own material ----------------
     Every line below is taken from a card the learner reads in the app
     (tips.js) — the teacher's own words about sitting, holding, the
     hands, the fingers, caring for the instrument, the beat and so on.
     g = which part of the programme it belongs to. ------------------ */
  const TIPQ = [
    ['first', ['როგორ უნდა დაჯდე დაკვრისას?', 'How should you sit when you play?'],
      ['სკამის წინა ნაწილზე, წელი სწორი, ფეხები იატაკზე', 'On the front of the chair, back straight, feet on the floor'],
      [['სავარძელში, ზურგით მიყრდნობილი', 'In an armchair, leaning back'], ['იატაკზე, ფეხმორთხმული', 'On the floor, cross-legged'], ['ფეხზე მდგომი', 'Standing up']],
      ['სკამი სახელურების გარეშე, მხრები მოდუნებული.', 'A chair without armrests, shoulders relaxed.']],
    ['first', ['ფანდურის ტარი საით არის მიმართული?', 'Where does the panduri\'s neck point?'],
      ['მარცხნივ და ოდნავ ზემოთ', 'To the left and slightly up'],
      [['მარჯვნივ და ქვემოთ', 'To the right and down'], ['პირდაპირ წინ', 'Straight forward'], ['ზემოთ, ვერტიკალურად', 'Straight up']],
      ['ტანი შენს სხეულს ეხება, მარჯვენა მკლავი ზემოდან აკავებს.', 'The body touches you and the right arm holds it from above.']],
    ['first', ['რომელი ხელი უკრავს სიმებს?', 'Which hand plays the strings?'],
      ['მარჯვენა — ჩამოკვრა ↓ და ამოკვრა ↑', 'The right — down ↓ and up ↑'],
      [['მარცხენა', 'The left'], ['ორივე თანაბრად', 'Both the same'], ['მარცხენა ცერა თითი', 'The left thumb']],
      ['მარცხენა ხელი თითებით ლადებზე აჭერს სიმებს.', 'The left hand presses the strings on the frets.']],
    ['first', ['ამოკვრა ↑ რომელი თითით კეთდება?', 'Which finger makes the up-stroke ↑?'],
      ['ცერა თითით, ფრჩხილის წვერით', 'With the thumb, on the nail tip'],
      [['საჩვენებელი თითით', 'With the index finger'], ['ნეკით', 'With the little finger'], ['მთელი ხელისგულით', 'With the whole palm']],
      ['ჩამოკვრისას თითები იშლება და სიმებს ფრჩხილის წვერები ეხება.', 'On the down-stroke the fingers open and the nail tips touch the strings.']],
    ['first', ['ჩამოკვრისა და ამოკვრის დროს რა მოძრაობს?', 'What moves on a down- and up-stroke?'],
      ['მხოლოდ მაჯა', 'Only the wrist'],
      [['მთელი მკლავი', 'The whole arm'], ['მხარი', 'The shoulder'], ['სხეული', 'The body']],
      ['მკლავი ადგილზე რჩება — მოძრაობს მაჯა.', 'The arm stays put — the wrist moves.']],
    ['first', ['მარცხენა ხელის ფრჩხილები როგორი უნდა იყოს?', 'What about the left hand\'s nails?'],
      ['მოკლე', 'Short'],
      [['გრძელი', 'Long'], ['მნიშვნელობა არ აქვს', 'It does not matter'], ['ლაკით დაფარული', 'Polished']],
      ['გრძელი ფრჩხილი წვერით დაჭერას არ გაძლევს.', 'A long nail stops you pressing with the tip.']],
    ['first', ['თითი ლადთან სად უნდა იდგეს?', 'Where does the finger go in relation to the fret?'],
      ['ზუსტად ლადის უკან, ახლოს', 'Just behind the fret, close to it'],
      [['ზუსტად ლადზე', 'Right on the fret'], ['ორ ლადს შუაში', 'In the middle between two frets'], ['ლადის წინ', 'In front of the fret']],
      ['ლადის უკან დაჭერა სუფთა ბგერას იძლევა.', 'Pressing behind the fret gives a clean sound.']],
    ['first', ['როგორ უნდა შეეხო თითი სიმს?', 'How should the finger touch the string?'],
      ['მოხრილი თითი, წვერით', 'A curved finger, on its tip'],
      [['ბრტყელი თითით', 'Flat'], ['თითის ბალიშით', 'With the pad'], ['ფრჩხილით', 'With the nail']],
      ['ბრტყელი თითი გვერდით სიმს აჩუმებს.', 'A flat finger mutes the string next to it.']],
    ['first', ['რამდენად ძლიერად უნდა დააჭირო სიმს?', 'How hard should you press the string?'],
      ['იმდენად, რამდენიც საჭიროა სუფთა ბგერისთვის', 'Only as hard as a clean sound needs'],
      [['რაც შეიძლება ძლიერად', 'As hard as you can'], ['ძალიან სუსტად', 'Very lightly'], ['ორივე ხელით', 'With both hands']],
      ['ზედმეტი ძალა ხელს ღლის და ბგერასაც ამაღლებს.', 'Too much force tires the hand and raises the pitch.']],
    ['first', ['დაკვრამდე რა უნდა გააკეთო?', 'What should you do before playing?'],
      ['1–2 წუთი ხელები გაახურო', 'Warm the hands up for 1–2 minutes'],
      [['პირდაპირ სწრაფად დაუკრა', 'Start fast straight away'], ['სიმები შეცვალო', 'Change the strings'], ['არაფერი', 'Nothing']],
      ['გაშალე და მოკუმე ხელები, დაატრიალე მაჯები.', 'Open and close the hands, roll the wrists.']],
    ['first', ['სად ინახება ფანდური?', 'Where should the panduri be kept?'],
      ['ბუდეში ან ჩანთაში, მშრალ ადგილას', 'In a case or bag, somewhere dry'],
      [['მანქანაში', 'In the car'], ['გამათბობელთან', 'By the heater'], ['მზეზე, აივანზე', 'In the sun, on the balcony']],
      ['ხის ინსტრუმენტს სიცხე, სიცივე და ნესტი აზიანებს.', 'Heat, cold and damp harm a wooden instrument.']],
    ['first', ['რა სჯობს ვარჯიშში?', 'Which is better practice?'],
      ['15 წუთი ყოველდღე', '15 minutes every day'],
      [['2 საათი კვირაში ერთხელ', 'Two hours once a week'], ['5 საათი თვეში ერთხელ', 'Five hours once a month'], ['ერთნაირია', 'They are the same']],
      ['ყოველდღე ცოტ-ცოტა — ხელი ასე იმახსოვრებს.', 'A little every day — that is how the hand remembers.']],
    ['inst', ['რომელია ფანდურის ნაწილები?', 'Which are the parts of the panduri?'],
      ['თავი, მექანიკები, ტარი, ლადები, დეკა, ხიდი', 'Head, tuners, neck, frets, soundboard, bridge'],
      [['თავი, კლავიატურა, პედალი', 'Head, keyboard, pedal'], ['ტარი, სიმები, მიკროფონი', 'Neck, strings, microphone'], ['დეკა, ზარები, ჩაქუჩები', 'Soundboard, bells, hammers']],
      ['ეს ნაწილები შენი ინსტრუმენტის ფოტოებზეა ნაჩვენები.', 'These parts are shown on the photographs of your own instrument.']],
    ['inst', ['რისთვის არის ტარზე ყვითელი წერტილები?', 'What are the dots on the neck for?'],
      ['ორიენტირისთვის — ლადს წერტილით პოულობ', 'As markers — you find the fret by the dot'],
      [['მორთულობისთვის', 'For decoration'], ['იქ დაჭერა არ შეიძლება', 'You must not press there'], ['სიმების გასამაგრებლად', 'To hold the strings']],
      ['წერტილები 3 · 5 · 7 · 9 · 15 ლადზეა, ორმაგი — მე-12-ზე.', 'The dots sit at frets 3 · 5 · 7 · 9 · 15, a double one at 12.']],
    ['inst', ['აპის ზოლებში ციფრი ხაზზე რას ნიშნავს?', 'In the app\'s lanes, what does a number on a line mean?'],
      ['რომელ ლადზე დააჭირო', 'Which fret to press'],
      [['რამდენჯერ დაუკრა', 'How many times to play'], ['რომელი თითით დააჭირო', 'Which finger to use'], ['ტემპს', 'The tempo']],
      ['ხაზი = სიმი, ციფრი = ლადი, 0 = ღია სიმი.', 'The line is the string, the number the fret, 0 the open string.']],
    ['inst', ['ლადზე დაჭერა რას უშვრება ბგერას?', 'What does pressing a fret do to the sound?'],
      ['ამაღლებს — სიმი მოკლდება', 'Raises it — the string gets shorter'],
      [['ადაბლებს', 'Lowers it'], ['არ ცვლის', 'Changes nothing'], ['ხმამაღალს ხდის', 'Makes it louder']],
      ['რაც უფრო ჩქარა ირხევა სიმი, მით მაღალია ბგერა.', 'The faster the string vibrates, the higher the sound.']],
    ['inst', ['როდის უნდა ააწყო ფანდური?', 'When should you tune the panduri?'],
      ['ყოველ ჯერზე, დაკვრამდე', 'Every time, before playing'],
      [['თვეში ერთხელ', 'Once a month'], ['მხოლოდ სიმის გაწყვეტის შემდეგ', 'Only after a string breaks'], ['კონცერტის წინ', 'Only before a concert']],
      ['აწყობილი ფანდური ნახევარ სამუშაოს აკეთებს.', 'A tuned panduri does half the work.']],
    ['inst', ['Dm-ში 1-ლი თითი რას აკეთებს?', 'In Dm, what does the first finger do?'],
      ['ერთდროულად აჭერს C♯ და E სიმებს 1-ლ ლადზე', 'Presses both the C♯ and E strings on fret 1'],
      [['მხოლოდ E სიმს აჭერს', 'Presses only the E string'], ['ბანს აჭერს', 'Presses the bass'], ['არაფერს — სიმები ღიაა', 'Nothing — the strings are open']],
      ['ერთი თითი ორ სიმზე — ეს ბარეა.', 'One finger across two strings — that is a barre.']],
    ['rhythm', ['ხმამაღლა თვლა რაში გეხმარება?', 'What does counting aloud do?'],
      ['რიტმს თავში ამაგრებს', 'It fixes the rhythm in your head'],
      [['ტემპს აჩქარებს', 'It speeds the tempo up'], ['ბგერას ასწორებს', 'It corrects the pitch'], ['არაფერში', 'Nothing']],
      ['„1 და 2 და“ — ხმამაღლა თვლა.', '“1 and 2 and” — counted aloud.']],
    ['rhythm', ['როდის უნდა აიწიო ტემპი?', 'When should you raise the tempo?'],
      ['როცა 3-ჯერ ზედიზედ სუფთად გამოგივა', 'When it comes out clean three times in a row'],
      [['მაშინვე, პირველივე დღეს', 'Straight away, on the first day'], ['როცა მოგწყინდება', 'When you get bored'], ['ყოველ გამეორებაზე', 'On every repeat']],
      ['ჯერ ნელა — მერე სწრაფად.', 'Slowly first — fast after.']],
    ['rhythm', ['რა არის სინკოპა?', 'What is syncopation?'],
      ['ძლიერი დარტყმა თვლებს შორის („და“-ზე) მოდის', 'The strong stroke falls between the counts (on the “and”)'],
      [['ტაქტის პირველი დარტყმა', 'The first beat of the bar'], ['ორი რითმი ერთად', 'Two rhythms at once'], ['პაუზა ტაქტის ბოლოს', 'A rest at the end of the bar']],
      ['თვალე: 1 და 2 და 3 და 4 და.', 'Count: 1 and 2 and 3 and 4 and.']],
    ['deep', ['თუ სამივე სიმს ერთნაირად აწევ (ბარეთი), ბგერა როგორ შეიცვლება?', 'If you barre all three strings higher, how does the sound change?'],
      ['იმდენი ნახევარტონით მაღლდება, რამდენი ლადიც აიწიე', 'rises by as many semitones as frets you moved'],
      [['არ იცვლება', 'does not change'], ['ოქტავით მაღლდება', 'rises by an octave'], ['ადაბლდება', 'goes lower']],
      ['ღია = A, ყველა მე-2 ლადზე = B, მე-3-ზე = C.', 'Open = A, all on fret 2 = B, on fret 3 = C.']],
    ['deep', ['აკორდის მიქცევას რა განსაზღვრავს?', 'What decides a chord\'s inversion?'],
      ['ყველაზე დაბალი (ქვედა) ნოტი', 'The lowest note'],
      [['ყველაზე მაღალი ნოტი', 'The highest note'], ['ნოტების რაოდენობა', 'How many notes it has'], ['რომელი თითებით იღებ', 'Which fingers you use']],
      ['ძირითადი სახე — ქვემოთ ტონიკაა; სექსტაკორდი — ტერცია; კვარტსექსტაკორდი — კვინტა.', 'Root position has the root at the bottom, then the third, then the fifth.']],
    ['deep', ['სანამ ნაწარმოებს დაუკრავ, რა სჯობს?', 'Before you play a piece, what is best?'],
      ['ჯერ რამდენჯერმე მოუსმინო', 'Listen to it a few times first'],
      [['პირდაპირ სწრაფად დაუკრა', 'Play it fast straight away'], ['ნოტები ზეპირად ისწავლო', 'Learn the notes by heart first'], ['ტემპი აიწიო', 'Raise the tempo']],
      ['ყურში ჩამჯდარი მელოდია ხელსაც ასწავლის.', 'A melody in the ear teaches the hand too.']],
    ['deep', ['რთულ ადგილს როგორ ვივარჯიშებთ?', 'How do you practise a hard spot?'],
      ['იპოვი სად გეშლება და მხოლოდ იმ ადგილს იმეორებ', 'Find where it goes wrong and repeat only that'],
      [['მთელ სიმღერას იმეორებ თავიდან', 'Play the whole song from the top again'], ['ტემპს აჩქარებ', 'Speed it up'], ['გამოტოვებ', 'Skip it']],
      ['წრეზე გამეორება სწორედ იმ ადგილს ასწორებს.', 'Looping that one place is what fixes it.']]
  ];
  const cnt2 = (r, pat) => mc(L('„' + PD.i18n.pick(r.name) + '“ რამდენი დარტყმაა?', 'How many strokes is “' + PD.i18n.pick(r.name) + '”?'),
    String(r.strokes.length), others(String(r.strokes.length), () => String(1 + rnd(8)), 3),
    L('„' + PD.i18n.pick(r.name) + '“ = ' + pat + '.', '“' + PD.i18n.pick(r.name) + '” = ' + pat + '.'));
  const tipQ = g => { const all = TIPQ.filter(x => x[0] === g), r = pick(all);
    return mc(L(r[1][0], r[1][1]), L(r[2][0], r[2][1]), r[3].map(w => L(w[0], w[1])), L(r[4][0], r[4][1])); };

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

    /* --- the teaching cards --- */
    tipFirst: () => tipQ('first'),
    tipInst: () => tipQ('inst'),
    tipRhythm: () => tipQ('rhythm'),
    tipDeep: () => tipQ('deep'),
    /** the famous rhythms (known from the guitar, not the teacher's own) */
    rhythmGen: () => { const RS = ((PD.curriculum.commonRhythms && PD.curriculum.commonRhythms()) || []).filter(r => r.strokes && r.strokes.length);
      if (!RS.length) return GEN.rhythm();
      const r = pick(RS), arrow = k => k.direction === 'down' ? '↓' : '↑', pat = r.strokes.map(arrow).join(' ');
      const unique = RS.filter(x => x.strokes.map(arrow).join(' ') === pat).length === 1;   // two patterns that look alike differ only in their timing: never ask by arrows alone
      return pick(unique ? [
        () => mc(L('რომელი რითმია ' + pat + '?', 'Which rhythm is ' + pat + '?'), PD.i18n.pick(r.name), others(PD.i18n.pick(r.name), () => PD.i18n.pick(pick(RS).name), 3),
          L('ზოგადი (გიტარიდან ცნობილი) რითმი — მასწავლებლის ოთხი რითმისგან განსხვავებული.', 'A general strumming pattern, not one of the teacher\'s four rhythms.')),
        () => cnt2(r, pat)] : [() => cnt2(r, pat)])(); },
    /** the chord progressions the teacher gave */
    prog: () => { const PR = ((PD.tools && PD.tools.PROGRESSIONS) || []).filter(x => x.src === 'teacher');
      if (!PR.length) return GEN.key();
      const r = pick(PR);
      return pick([
        () => mc(L('„' + L(r.ka, r.en) + '“ რომელი აკორდებია?', 'Which chords are “' + r.en + '”?'), r.id, others(r.id, () => pick(PR).id, 3),
          L('მასწავლებლის აკორდული პროგრესიები: ' + PR.map(x => x.id).join(' · ') + '.', 'The teacher\'s progressions: ' + PR.map(x => x.id).join(' · ') + '.')),
        () => mc(L(r.id + ' — რა ჰქვია ამ მოძრაობას?', 'What is the progression ' + r.id + ' called?'), L(r.ka, r.en), others(L(r.ka, r.en), () => { const o = pick(PR); return L(o.ka, o.en); }, 3),
          L('ეს პროგრესია სწავლების გვერდზეა — „' + L(r.ka, r.en) + '“.', 'This progression is in the lessons — “' + r.en + '”.'))])(); },
    /** the teacher's own exercise: moving the bass */
    bassMove: () => mc(L('სოლ მინორში ბანის გასამოძრავებლად რას ვამატებთ?', 'In G minor, what is added to move the bass?'),
      L('მე-2 (შუა) თითს ბანის სიმზე, ორი ლადით ზემოთ', 'The middle finger on the bass string, two frets higher'),
      [L('მე-4 თითს ზედა სიმზე', 'The little finger on the top string'), L('ცერა თითს ვხსნით', 'The thumb is lifted'), L('სხვა აკორდზე გადავდივართ', 'You change to another chord')],
      L('ბანს ცერა თითი იჭერს; რითმი იგივე რჩება.', 'The thumb holds the bass; the rhythm stays the same.')),

    /* --- notes, frets, signs --- */
    fretNote: () => { const s = 1 + rnd(3), f = 1 + rnd(FR()), m = TH.midi(s, f), right = nLab(m);
      return mc(L(sLab(s) + ' სიმზე ' + fLab(f) + ' — რომელი ნოტი გამოვა?', 'On the ' + sName(s) + ' string, ' + (f ? 'fret ' + f : 'the open string') + ' — which note sounds?'),
        right, others(right, () => nLab(m + (1 + rnd(4)) * (Math.random() < .5 ? 1 : -1)), 3),
        L('ღია ' + sName(s) + '-ს ზემოთ ' + f + ' ნახევარტონი (ლადი) = ' + TH.pcName(m) + ' (' + kaAt(s, f) + ').', f + ' semitones (frets) above the open ' + sName(s) + ' = ' + TH.pcName(m) + '.'), sound([m])); },
    noteWhere: () => { const s = 1 + rnd(3), f = 1 + rnd(12), m = TH.midi(s, f), nm = TH.pcName(m);   // up to the 12th fret: that is the lowest place for the note, so the answer is not ambiguous
      return mc(L(sLab(s) + ' სიმზე რომელ ლადზე დააჭირო, რომ ' + nLab(m) + ' გამოვიდეს?', 'Which fret of the ' + sName(s) + ' string do you press to get ' + nm + '?'),
        fLab(f), others(fLab(f), () => { const x = f + (1 + rnd(3)) * (Math.random() < .5 ? 1 : -1); return x >= 1 && x <= FR() ? fLab(x) : null; }, 3),
        L('ღია ' + sName(s) + '-ს ზემოთ ' + f + ' ნახევარტონი = ' + nm + '.', f + ' semitones above the open ' + sName(s) + ' = ' + nm + '.'), sound([m])); },
    semitone: () => pickQ([
      () => mc(L('რამდენი ლადია ერთი ტონი?', 'How many frets make a tone?'), '2', ['1', '3', '12'], L('1 ლადი = ნახევარტონი, 2 ლადი = ტონი.', '1 fret = a semitone, 2 frets = a tone.')),
      () => mc(L('რამდენი ლადია ოქტავა?', 'How many frets make an octave?'), '12', ['7', '8', '17'], L('12 ნახევარტონი = ოქტავა; მე-12 ლადზე ღია სიმის ბგერა მეორდება.', '12 semitones = an octave; at fret 12 the open string\'s note returns.')),
      () => mc(L('ოქტავაში რამდენი სხვადასხვა ბგერაა?', 'How many different notes are in an octave?'), '12', ['7', '8', '5'], L('7 ძირითადი სახელი, სულ 12 ბგერა (ქრომატული გამა).', '7 basic names, 12 notes in all (the chromatic scale).')),
      () => mc(L('რომელ ნოტებს შორის არის მხოლოდ ნახევარტონი?', 'Which notes are only a semitone apart?'), L('მი–ფა და სი–დო (E–F, B–C)', 'E–F and B–C'), [L('დო–რე და ფა–სოლ', 'C–D and F–G'), L('ლა–სი', 'A–B'), L('სოლ–ლა', 'G–A')], L('E–F და B–C შორის შავი კლავიში არ არის.', 'There is no black key between E–F and B–C.'), null, ART() ? ART().keyboard({ hi: ['E', 'F', 'B', 'C'] }) : null)]),
    accidental: () => pickQ([
      () => mc(L('რას აკეთებს დიეზი (♯)?', 'What does a sharp (♯) do?'), L('ნახევარტონით ამაღლებს (+1 ლადი)', 'Raises by a semitone (+1 fret)'), [L('ნახევარტონით ადაბლებს', 'Lowers by a semitone'), L('ტონით ამაღლებს', 'Raises by a tone'), L('აუქმებს ნიშნებს', 'Cancels the signs')], L('♯ = +1 ნახევარტონი, ♭ = −1, ♮ აუქმებს.', '♯ = +1 semitone, ♭ = −1, ♮ cancels.')),
      () => mc(L('რას ნიშნავს ბეკარი (♮)?', 'What does a natural (♮) mean?'), L('აუქმებს დიეზს ან ბემოლს', 'Cancels a sharp or a flat'), [L('ამაღლებს ტონით', 'Raises by a tone'), L('ადაბლებს ნახევარტონით', 'Lowers by a semitone'), L('ხმამაღლა დაკვრას', 'Play loudly')], L('ბეკარი ნოტს ჩვეულ სახეს უბრუნებს.', 'A natural returns the note to its plain form.')),
      () => mc(L('რას აკეთებს დუბლ-ბემოლი (𝄫)?', 'What does a double flat (𝄫) do?'), L('ტონით ადაბლებს (−2 ლადი)', 'Lowers by a tone (−2 frets)'), [L('ნახევარტონით ადაბლებს', 'Lowers by a semitone'), L('ტონით ამაღლებს', 'Raises by a tone'), L('არაფერს', 'Nothing')], L('ორი ბემოლი = ორი ნახევარტონი ქვემოთ.', 'Two flats = two semitones down.')),
      () => { const i = pick([1, 3, 6, 8, 10]), sh = TH.NN[i], fl = TH.NN_FLAT[i];
        return mc(L(sh + ' იმავე ბგერას რომელი სახელით წერენ ბემოლით?', 'Which flat name is the same sound as ' + sh + '?'), fl, others(fl, () => TH.NN_FLAT[(i + 1 + rnd(10)) % 12], 3), L(sh + ' = ' + fl + ' — ენჰარმონიულად თანაბარი: ჟღერს ერთნაირად, იწერება სხვანაირად.', sh + ' = ' + fl + ' — enharmonic: the same sound, written differently.'), sound([60 + i])); },
      () => mc(L('ალტერაციის ნიშანი, რომელიც ნოტის წინ წერია, სადამდე მოქმედებს?', 'A sign written before a note lasts until…'), L('ამ ტაქტის ბოლომდე', 'the end of that bar'), [L('მთელ ნაწარმოებზე', 'the end of the piece'), L('მხოლოდ ამ ნოტზე', 'only that one note'), L('შემდეგ სტრიქონამდე', 'the next line')], L('გასაღებთან დაწერილი ნიშნები კი მთელ ნაწარმოებზე მოქმედებს.', 'Signs in the key signature apply to the whole piece.'))]),
    staff: () => pickQ([
      () => { const A = ART(); const L5 = [['E', 4], ['G', 4], ['B', 4], ['D', 5], ['F', 5]], S4 = [['F', 4], ['A', 4], ['C', 5], ['E', 5]];
        const KA7 = ['დო', 'რე', 'მი', 'ფა', 'სოლ', 'ლა', 'სი'], LET7 = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const lab = l2 => l2 + ' (' + L(KA7[LET7.indexOf(l2)], l2) + ')';
        const set = Math.random() < .5 ? L5 : S4, one = pick(set), ltr = one[0], oc = one[1];
        return mc(L('სოლის გასაღებში — რომელი ნოტია სურათზე?', 'In the treble clef — which note is shown?'), lab(ltr),
          others(lab(ltr), () => lab(pick(L5.concat(S4))[0]), 3),
          L('ხაზები ქვემოდან: მი სოლ სი რე ფა (E G B D F) · შუალედები: ფა ლა დო მი (F A C E).', 'Lines bottom up: E G B D F · spaces: F A C E.'),
          sound([60 + { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[ltr] + (oc - 4) * 12]),
          A ? A.staff([{ l: ltr, o: oc, d: 'w' }], { width: 200 }) : null); },
      () => mc(L('სოლის გასაღებში ხაზებზე მდგარი ნოტები, ქვემოდან ზემოთ — რომელი რიგია სწორი?', 'In the treble clef, the notes on the lines from the bottom up — which row is right?'), 'E G B D F', ['F A C E', 'E G B D E', 'G B D F A'],
        L('ხაზები: მი სოლ სი რე ფა.', 'Lines: E G B D F.'), null, ART() ? ART().staff([{ l: 'E', o: 4, d: 'w' }, { l: 'G', o: 4, d: 'w' }, { l: 'B', o: 4, d: 'w' }, { l: 'D', o: 5, d: 'w' }, { l: 'F', o: 5, d: 'w' }], { width: 290 }) : null),
      () => mc(L('სოლის გასაღებში შუალედებში მდგარი ნოტები, ქვემოდან ზემოთ — რომელი რიგია სწორი?', 'In the treble clef, the notes in the spaces from the bottom up — which row is right?'), 'F A C E', ['E G B D F', 'A C E G', 'D F A C'],
        L('შუალედები: ფა ლა დო მი.', 'Spaces: F A C E.'), null, ART() ? ART().staff([{ l: 'F', o: 4, d: 'w' }, { l: 'A', o: 4, d: 'w' }, { l: 'C', o: 5, d: 'w' }, { l: 'E', o: 5, d: 'w' }], { width: 250 }) : null),
      () => mc(L('სოლის გასაღები რომელ ხაზს უვლის გარშემო (სადაც სოლია, G4)?', 'Which line does the treble clef curl around (where G4 sits)?'), L('მეორეს, ქვემოდან', 'The second from the bottom'), [L('პირველს, ქვემოდან', 'The first from the bottom'), L('მესამეს', 'The third'), L('მეოთხეს', 'The fourth')],
        L('𝄞 მეორე ხაზს უვლის — ამიტომ ჰქვია სოლის გასაღები.', '𝄞 curls around the second line — that is why it is the G clef.'), null, ART() ? ART().staff([{ l: 'G', o: 4, d: 'w' }], { width: 190 }) : null),
      () => mc(L('ფას (ბანის) გასაღების ორი წერტილი რომელ ხაზს აკრავს?', 'The two dots of the bass clef surround which line?'), L('მეოთხეს — F3', 'The fourth — F3'), [L('მეორეს — G4', 'The second — G4'), L('მესამეს', 'The third'), L('პირველს', 'The first')],
        L('𝄢 = ფას გასაღები, მეოთხე ხაზი ფაა.', '𝄢 = bass clef, the fourth line is F.'), null, ART() ? ART().staff([{ l: 'F', o: 3, d: 'w' }], { clef: 'bass', width: 190 }) : null),
      () => mc(L('ხუთხაზედის ხაზებს და შუალედებს როგორ ვითვლით?', 'How are the staff\'s lines and spaces counted?'), L('ქვემოდან ზემოთ', 'From the bottom up'), [L('ზემოდან ქვემოთ', 'From the top down'), L('შუიდან', 'From the middle'), L('მარჯვნიდან მარცხნივ', 'Right to left')],
        L('ქვემოდან ზემოთ — რაც მაღლაა, მით მაღალი ბგერაა.', 'Bottom up — the higher it sits, the higher it sounds.'))]),
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
      () => { const i = rnd(DUR.length), nm = DUR[i][0], v = DUR[i][1], d = ['w', 'h', 'q', 'e', 's'][i];
        return mc(L('ეს ნოტი 4/4-ში რამდენი დარტყმაა?', 'How many beats is this note in 4/4?'), BEATS[v], others(BEATS[v], () => BEATS[pick(DUR)[1]], 3),
          L(LX(nm) + ' = ' + BEATS[v] + ' დარტყმა. მთელი 4, ნახევარი 2, მეოთხედი 1, მერვედი ½, მეთექვსმეტედი ¼.', nm[1] + ' = ' + BEATS[v] + '. Whole 4, half 2, quarter 1, eighth ½, sixteenth ¼.'),
          null, ART() ? ART().symbol('note', d) : null); },
      () => mc(L('რამდენი მერვედია ერთ ნახევარში?', 'How many eighths are in a half note?'), '4', ['2', '8', '6'], L('ნახევარი = 2 მეოთხედი = 4 მერვედი.', 'Half = 2 quarters = 4 eighths.')),
      () => mc(L('რამდენი მეთექვსმეტედია მთელ ნოტში?', 'How many sixteenths are in a whole note?'), '16', ['8', '4', '12'], L('1 მთელი = 2 ნახევარი = 4 მეოთხედი = 8 მერვედი = 16 მეთექვსმეტედი.', '1 whole = 2 halves = 4 quarters = 8 eighths = 16 sixteenths.')),
      () => mc(L('წერტილიანი მეოთხედი რამდენი დარტყმაა?', 'How many beats is a dotted quarter?'), '1½', ['2', '1¼', '3'], L('წერტილი ხანგრძლივობას ნახევრით ზრდის: 1 + ½.', 'A dot adds half the value: 1 + ½.')),
      () => mc(L('რას აკეთებს ლიგა (რკალი ორ ერთნაირ ნოტს შორის)?', 'What does a tie (an arc between two equal notes) do?'), L('ხანგრძლივობებს აერთებს — მეორე ნოტი აღარ იკვრება', 'Adds their lengths — the second note is not struck again'), [L('ორჯერ ამოკვრას ნიშნავს', 'Means striking twice'), L('ტრიოლია', 'Is a triplet'), L('პაუზაა', 'Is a rest')], L('ლიგით ბგერა გრძელდება.', 'A tie lengthens the sound.')),
      () => mc(L('ტრიოლი რას ნიშნავს?', 'What is a triplet?'), L('სამი თანაბარი ნოტი ორის ადგილას', 'Three equal notes in the time of two'), [L('სამი ტაქტი', 'Three bars'), L('სამი სიმი ერთად', 'Three strings together'), L('სამჯერ გამეორება', 'Three repeats')], L('6/8-ში დარტყმა ისედაც სამ მერვედად იყოფა — ტრიოლის ნიშნის გარეშე.', 'In 6/8 a beat is already three eighths — no triplet sign needed.'))]),
    rest: () => pickQ([
      () => { const i = rnd(DUR.length), nm = DUR[i][0], v = DUR[i][1], d = ['w', 'h', 'q', 'e', 's'][i];
        return mc(L('ეს პაუზა რამდენი დარტყმაა?', 'How many beats is this rest?'), BEATS[v], others(BEATS[v], () => BEATS[pick(DUR)[1]], 3),
          L(LX(nm) + ' პაუზა = ' + BEATS[v] + ' დარტყმა — ნოტის იმავე ხანგრძლივობა.', 'The ' + nm[1] + ' rest = ' + BEATS[v] + ' — the same length as the note.'),
          null, ART() ? ART().symbol('rest', d) : null); },
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
      () => mc(L('მაჟორული გამა რომელი ნაბიჯებით იგება? (ტ = ტონი, ნ = ნახევარტონი)', 'Which steps build a major scale? (T = tone, S = semitone)'), L('ტ ტ ნ ტ ტ ტ ნ', 'T T S T T T S'), [L('ტ ნ ტ ტ ნ ტ ტ', 'T S T T S T T'), L('ტ ტ ტ ნ ტ ტ ნ', 'T T T S T T S'), L('ნ ტ ტ ნ ტ ტ ტ', 'S T T S T T T')], L('C D E F G A B C — ტ ტ ნ ტ ტ ტ ნ.', 'C D E F G A B C — T T S T T T S.'), sound([60, 62, 64, 65, 67, 69, 71, 72], .32)),
      () => mc(L('ნატურალური მინორი რომელი ნაბიჯებით იგება? (ტ = ტონი, ნ = ნახევარტონი)', 'Which steps build a natural minor? (T = tone, S = semitone)'), L('ტ ნ ტ ტ ნ ტ ტ', 'T S T T S T T'), [L('ტ ტ ნ ტ ტ ტ ნ', 'T T S T T T S'), L('ნ ტ ტ ტ ნ ტ ტ', 'S T T T S T T'), L('ტ ტ ნ ნ ტ ტ ნ', 'T T S S T T S')], L('A B C D E F G A — ტ ნ ტ ტ ნ ტ ტ.', 'A B C D E F G A — T S T T S T T.'), sound([57, 59, 60, 62, 64, 65, 67, 69], .32)),
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
      return mc(L('„' + names[k][0] + '“ რამდენ საფეხურს მოიცავს ორივე ნოტის ჩათვლით?', 'How many steps does a ' + names[k][1] + ' span, counting both notes?'), String(k + 2), others(String(k + 2), () => String(2 + rnd(7)), 3),
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
    first: { title: 'ex.t0', gens: ['tipFirst', 'fingers', 'zero', 'thumb', 'stringNum', 'stringVoice'], ch: [] },
    inst: { title: 'ex.t1', gens: ['stringNum', 'stringVoice', 'tuning', 'fretCount', 'range', 'markers', 'fingers', 'zero', 'thumb', 'strokes', 'tipInst'], ch: ['octave', 'neck', 'app'] },
    rhythm: { title: 'ex.t2', gens: ['duration', 'rest', 'meter', 'tempo', 'rhythm', 'rhythmGen', 'strokes', 'tipRhythm'], ch: ['durations', 'rests', 'meter', 'tempo', 'app'] },
    notes: { title: 'ex.t3', gens: ['fretNote', 'noteWhere', 'semitone', 'accidental', 'staff', 'octave', 'names'], ch: ['names', 'octave', 'semitone', 'accidentals', 'neck', 'staff'] },
    harmony: { title: 'ex.t4', gens: ['interval', 'chordType', 'barre', 'scale', 'key', 'signs', 'prog', 'bassMove', 'tipDeep'], ch: ['intervals', 'scales', 'chords', 'key', 'signs'] },
    solfege: { title: 'ex.t5', gens: ['solfSyl', 'solfStep', 'solfIv', 'names', 'ear', 'earIv', 'interval'], ch: [] },
    all: { title: 'ex.t6', gens: null, ch: null }
  };
  const EXAMS = [
    { id: 'ex-first', topic: 'first', name: 'ex.e0', n: 10, min: 8, pass: 80, after: 'first' },
    { id: 'ex-inst', topic: 'inst', name: 'ex.e1', n: 10, min: 8, pass: 80, after: 'instrument' },
    { id: 'ex-rhythm', topic: 'rhythm', name: 'ex.e2', n: 12, min: 10, pass: 80, after: 'rhythms' },
    { id: 'ex-notes', topic: 'notes', name: 'ex.e3', n: 14, min: 12, pass: 80, after: 'notes' },
    { id: 'ex-harmony', topic: 'harmony', name: 'ex.e4', n: 14, min: 12, pass: 80, after: 'scales' },
    { id: 'ex-solfege', topic: 'solfege', name: 'ex.e5', n: 12, min: 10, pass: 80, after: 'solfege' },
    { id: 'ex-final', topic: 'all', name: 'ex.e6', n: 30, min: 25, pass: 85, after: 'advanced', final: true }
  ];
  const genNames = tp => tp.gens || Object.keys(GEN);
  /* what this exam has already asked, so the next attempt is a different paper */
  const ASKED = 'exam.asked';
  const askedOf = id => (PD.store.get(ASKED, {}) || {})[id] || [];
  function remember(id, qs) {
    if (!id) return;
    const all = PD.store.get(ASKED, {}) || {}, prev = all[id] || [];
    all[id] = prev.concat(qs.map(q => String(q.q))).slice(-600);
    PD.store.set(ASKED, all);
  }
  const forgetAsked = id => { const all = PD.store.get(ASKED, {}) || {}; delete all[id]; PD.store.set(ASKED, all); };
  /** one fresh set of questions: the chapters' own first, then generated ones — none of them
      a question this exam has already asked, until the bank runs out and starts again */
  function draw(topic, n, examId) {
    const tp = TOPICS[topic] || TOPICS.all, out = [], seen = new Set();
    let old2 = new Set(examId ? askedOf(examId) : []);
    const add = (q, fresh) => { if (!q) return false; const k = String(q.q);
      if (seen.has(k) || (fresh && old2.has(k))) return false; seen.add(k); out.push(q); return true; };
    const fill = fresh => {
      shuf(chapterQs(tp.ch)).slice(0, Math.ceil(n * .4)).forEach(q => { if (out.length < n) add(q, fresh); });
      const gens = shuf(genNames(tp)); let i = 0, guard = 0;
      while (out.length < n && guard++ < n * 60) { const g = gens[i++ % gens.length]; try { add(GEN[g](), fresh); } catch (_) {} }
    };
    fill(true);
    if (out.length < n) { if (examId) forgetAsked(examId); old2 = new Set(); fill(false); }   // the whole bank has been seen: start it over
    const res = shuf(out).slice(0, n);
    remember(examId, res);
    return res;
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
  let Z = null;        // the open exam screen
  let snoozed = null;  // "later": it stays away until the app is opened again
  const openNow = () => !!Z;
  function close() { if (!Z) return; const z = Z; Z = null; clearInterval(z.timer); z.root.remove(); document.body.style.overflow = ''; document.body.classList.remove('exam-on'); if (PD.app && PD.app.render) PD.app.render(); }
  /** builds (or rebuilds) the screen itself; the content is drawn into it afterwards */
  function shell(e) {
    document.querySelectorAll('.exz').forEach(x => x.remove());   // never two screens, and never one left from an older session
    const root = h('div', { class: 'exz', role: 'dialog', 'aria-modal': 'true', 'aria-label': t(e.name) });
    const head2 = h('header', { class: 'exz-top' }), body = h('div', { class: 'exz-body' }), foot = h('footer', { class: 'exz-foot' });
    root.append(head2, body, foot);
    // the buttons that must always work are handled here, on the screen itself: no button needs a live closure
    root.addEventListener('click', ev => {
      const b2 = ev.target && ev.target.closest ? ev.target.closest('[data-act]') : null; if (!b2 || !root.contains(b2)) return;
      const act = b2.dataset.act;
      if (act === 'finish') { ev.preventDefault(); ev.stopPropagation(); finishNow(false); }
      else if (act === 'later') { ev.preventDefault(); ev.stopPropagation(); postpone(); }
      else if (act === 'retry') { ev.preventDefault(); ev.stopPropagation(); PD.store.set('exam.on', { id: e.id, at: Date.now() }); runExam(e, active()); }
      else if (act === 'close') { ev.preventDefault(); ev.stopPropagation(); close(); }
      else if (act === 'drill') { ev.preventDefault(); ev.stopPropagation(); drillMode(e); }
    }, true);
    document.body.appendChild(root); document.body.style.overflow = 'hidden'; document.body.classList.add('exam-on');
    Z = { id: e.id, root, head: head2, body, foot, timer: 0 };
    return Z;
  }
  function open(id) {
    const e = get(id); if (!e) return;
    if (Z && Z.id === id && Z.root && Z.root.isConnected) return; if (Z) close();
    let a = active();
    if (!a || a.id !== id) { PD.store.set('exam.on', { id, at: Date.now() }); a = active(); }
    shell(e);
    runExam(e, a);
    PD.i18n.apply(Z.root);
  }
  /** finishing, on its own: it reads the running exam from the module, not from a closure,
      and rebuilds the screen if the one on display is broken */
  function finishNow(timeUp) {
    const cur = api._cur; if (!cur) return;
    const e = get(cur.id); if (!e) return;
    if (Z && Z.root && Z.root.querySelector('.exr')) return;        // the result is already there
    const right = cur.answers.filter((x, k) => x === (cur.qs[k] || {}).ok).length;
    const p = cur.qs.length ? Math.round(right / cur.qs.length * 100) : 0;
    let ok = false;
    try { ok = finish(e.id, p); } catch (err) { console.error(err); ok = p >= e.pass; }
    if (!parts()) shell(e);
    try { result(e, cur.qs, cur.answers, right, p, ok, timeUp); }
    catch (err) {
      console.error(err);
      const P2 = parts(); if (!P2) return;
      P2.head.innerHTML = ''; P2.head.append(h('div', { class: 'exz-row' }, [h('b', { text: t(e.name) })]));
      P2.body.innerHTML = ''; P2.foot.innerHTML = '';
      P2.body.append(h('div', { class: 'exr ' + (ok ? 'ok' : 'bad') }, [h('h1', { text: ok ? t('ex.pass') : t('ex.fail', { p: e.pass }) }), h('b', { text: t('ex.result', { a: right, b: cur.qs.length, p }) })]));
      P2.foot.append(ok ? h('button', { class: 'btn primary big', 'data-act': 'close', 'data-t': 'ex.go' })
        : h('button', { class: 'btn primary big', 'data-act': 'retry', 'data-t': 'ex.retry' }));
      PD.i18n.apply(P2.head); PD.i18n.apply(P2.body); PD.i18n.apply(P2.foot);
    }
  }
  /** the exam itself */
  function runExam(e, a) {
    const qs = draw(e.topic, e.n, e.id), answers = new Array(qs.length).fill(-1);
    api._cur = { id: e.id, qs, answers };   // the running exam, for the automated tests
    const until = a.at + e.min * 60000;
    let i = 0, over = false, warned = false;
    const P = parts(); if (!P) return;
    const { head: head2, body, foot } = P;
    clearInterval(Z.timer);
    const fmt = ms => { const s2 = Math.max(0, Math.round(ms / 1000)); return (s2 / 60 | 0) + ':' + String(s2 % 60).padStart(2, '0'); };
    const clock = h('span', { class: 'exz-clock' }), bar = h('i'), cnt = h('span', { class: 'exz-n' });
    head2.innerHTML = '';
    head2.append(h('div', { class: 'exz-row' }, [h('b', { text: t(e.name) }), h('span', { class: 'spacer' }), clock,
        h('button', { class: 'btn small ghost exz-later', 'data-act': 'later', 'data-t': 'ex.later' })]),
      h('div', { class: 'exz-row sub' }, [cnt, h('span', { class: 'spacer' }), h('small', { text: t('ex.rule', { n: e.n, m: e.min, p: e.pass }) })]),
      h('div', { class: 'exz-prog' }, [bar]));
    function tick() {
      const left = until - Date.now();
      clock.textContent = fmt(left); clock.classList.toggle('hot', left < 60000);
      const miss0 = answers.filter(x => x < 0).length;
      cnt.textContent = t('ex.qN', { a: i + 1, b: qs.length }) + (miss0 ? ' · ' + t('ex.unansN', { n: miss0 }) : '');
      bar.style.width = Math.round(answers.filter(x => x >= 0).length / qs.length * 100) + '%';
      if (left <= 0) done(true);
    }
    function drawQ() {
      const q = qs[i]; body.innerHTML = '';
      const card = h('section', { class: 'exq' }, [h('p', { class: 'exq-q', html: LX(q.q) })]);
      if (q.art) card.append(h('div', { class: 'exq-art', html: q.art }));
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
            if (!miss) return finishNow(false);
            body.querySelectorAll('.exq-ask').forEach(x => x.remove());
            body.append(h('div', { class: 'exq-ask' }, [h('p', { class: 'notice', text: t('ex.unanswered', { n: miss }) }),
              h('div', { class: 'row', style: 'gap:8px;flex-wrap:wrap' }, [
                h('button', { class: 'btn small', 'data-t': 'ex.goUnans', onclick: () => { i = answers.findIndex(x => x < 0); drawQ(); tick(); } }),
                h('button', { class: 'btn small primary', 'data-act': 'finish', 'data-t': 'ex.anyway' })])]));
            PD.i18n.apply(body); body.scrollTop = body.scrollHeight;
          } }));
      PD.i18n.apply(body); PD.i18n.apply(foot);
      body.scrollTop = 0;
    }
    function done(timeUp) { over = true; try { clearInterval(Z.timer); } catch (_) {} finishNow(timeUp); }
    Z.timer = setInterval(tick, 1000);
    tick(); drawQ();
  }
  /** the result, inside the same screen */
  /** the screen's three parts, found again from the DOM: a stale piece can never swallow a tap */
  function parts() {
    if (!Z || !Z.root || !Z.root.isConnected) return null;
    const head2 = Z.root.querySelector('.exz-top'), body = Z.root.querySelector('.exz-body'), foot = Z.root.querySelector('.exz-foot');
    if (!head2 || !body || !foot) return null;
    Z.head = head2; Z.body = body; Z.foot = foot;
    return { head: head2, body, foot };
  }
  function result(e, qs, answers, right, p, ok, timeUp) {
    const P = parts(); if (!P) { open(e.id); return; }
    const { head: head2, body, foot } = P;
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
        q.art ? h('div', { class: 'exq-art small', html: q.art }) : null,
        h('small', { html: t('ex.yours') + ': ' + (answers[k] >= 0 ? LX(q.opts[answers[k]]) : t('ex.none')) }),
        good ? null : h('small', { class: 'exrev-r', html: t('ex.right') + ': ' + LX(q.opts[q.ok]) }),
        h('small', { class: 'exrev-w', html: LX(q.why) })].filter(Boolean)));
    });
    body.append(rev);
    foot.innerHTML = '';
    if (ok && graduated()) { certificate(); return; }
    if (ok) foot.append(h('button', { class: 'btn primary big', 'data-act': 'close', 'data-t': 'ex.go' }));
    else foot.append(h('button', { class: 'btn', 'data-act': 'drill', 'data-t': 'ex.drill' }),
      h('button', { class: 'btn small ghost', 'data-act': 'later', 'data-t': 'ex.later' }), h('span', { class: 'spacer' }),
      h('button', { class: 'btn primary', 'data-act': 'retry', 'data-t': 'ex.retry' }));
    PD.i18n.apply(Z.root); body.scrollTop = 0;
  }
  /** the exercise for this subject, inside the exam screen: nothing else opens from here */
  function drillMode(e) {
    const P = parts(); if (!P) { open(e.id); return; }
    const { head: head2, body, foot } = P;
    clearInterval(Z.timer);
    head2.innerHTML = ''; head2.append(h('div', { class: 'exz-row' }, [h('b', { text: t('ex.drill') + ' · ' + t(TOPICS[e.topic].title) })]));
    let a = 0, b = 0;
    function next() {
      const q = draw(e.topic, 1)[0];
      body.innerHTML = '';
      const sc = h('div', { class: 'exd-score', text: t('ex.score', { a, b }) });
      const card = h('section', { class: 'exq' }, [h('p', { class: 'exq-q', html: LX(q.q) })]);
      if (q.art) card.append(h('div', { class: 'exq-art', html: q.art }));
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
      foot.append(h('button', { class: 'btn small ghost', 'data-act': 'later', 'data-t': 'ex.later' }), h('span', { class: 'spacer' }),
        h('button', { class: 'btn primary', 'data-act': 'retry', 'data-t': 'ex.again' }));
      PD.i18n.apply(Z.root); body.scrollTop = 0;
    }
    next();
  }

  /* ---------------- the certificate ----------------
     Only the student's own name, picture, level and the date; nothing
     is invented. It is drawn as HTML and saved as a picture by the
     same drawing, so what is downloaded is what is on screen. */
  function certData() {
    const prof = (PD.account && PD.account.profile) || {}, lp = PD.levels ? PD.levels.progress : { level: 0 };
    const d = PD.store.get('exam.gradAt', 0) || (PD.store.set('exam.gradAt', Date.now()), PD.store.get('exam.gradAt', 0));
    return { name: (prof.name || '').trim(), avatar: prof.avatar || '', level: lp.level, xp: PD.levels ? PD.levels.xp : 0, at: d };
  }
  const fmtDay = ts => { const d = new Date(ts); return PD.i18n.lang === 'ka' ? d.getDate() + ' ' + KA_M2[d.getMonth()] + ' ' + d.getFullYear() : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); };
  const KA_M2 = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];
  /** the certificate card itself (the same markup on screen and in the picture) */
  function certCard() {
    const c = certData();
    return h('div', { class: 'cert', id: 'pd-cert' }, [
      h('div', { class: 'cert-in' }, [
        h('div', { class: 'cert-top' }, [h('span', { class: 'cert-seal', html: SEAL }), h('div', {}, [h('b', { 'data-t': 'ex.certName' }), h('small', { 'data-t': 'ex.certWho' })])]),
        h('p', { class: 'cert-lead', 'data-t': 'ex.certLine' }),
        h('div', { class: 'cert-who' }, [
          h('span', { class: 'cert-av', html: c.avatar ? '<img alt="" src="' + PD.esc(c.avatar) + '">' : '<span>' + PD.esc((c.name || '♪')[0] || '♪') + '</span>' }),
          h('b', { class: 'cert-name', text: c.name || t('acct.guest') })]),
        h('p', { class: 'cert-fin', 'data-t': 'ex.certFin' }),
        h('div', { class: 'cert-foot' }, [
          h('div', {}, [h('small', { 'data-t': 'ex.certDate' }), h('b', { text: fmtDay(c.at) })]),
          h('div', {}, [h('small', { 'data-t': 'ex.grad' }), h('b', { text: t('ex.certLv', { n: c.level, x: c.xp }) })])])])]);
  }
  const SEAL = '<svg viewBox="0 0 64 64" width="52" height="52" aria-hidden="true"><circle cx="32" cy="30" r="20" fill="none" stroke="#C98B5B" stroke-width="2"/><circle cx="32" cy="30" r="16" fill="none" stroke="#C98B5B" stroke-width="1" stroke-dasharray="2 3"/><path d="M26 22v14a4 4 0 1 0 2-3.5V25l9-2v9a4 4 0 1 0 2-3.5V18z" fill="#E8C49B"/><path d="M20 48l6-4 6 6 6-6 6 4-2 10-10-5-10 5z" fill="#C98B5B" opacity=".85"/></svg>';
  /** shown inside the exam screen when the last exam is passed */
  function certificate() {
    const P = parts(); if (!P) return;
    PD.store.set('exam.grad', true);
    const { head: head2, body, foot } = P;
    head2.innerHTML = ''; head2.append(h('div', { class: 'exz-row' }, [h('b', { 'data-t': 'ex.cert' })]));
    body.innerHTML = '';
    body.append(h('div', { class: 'exr ok' }, [h('span', { class: 'exr-ic', html: ic.check || '✓' }), h('h1', { 'data-t': 'ex.certT' }), h('p', { class: 'fg2', 'data-t': 'ex.certD' })]),
      certCard(),
      h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', 'data-t': 'ex.gift' }), h('small', { class: 'muted', 'data-t': 'ex.giftD' })]));
    foot.innerHTML = '';
    foot.append(h('button', { class: 'btn', 'data-t': 'ex.certSave', onclick: saveCert }), h('span', { class: 'spacer' }),
      h('button', { class: 'btn primary', 'data-act': 'close', 'data-t': 'ex.go' }));
    PD.i18n.apply(Z.root); if (PD.fx) try { PD.fx.celebrate({ y: innerHeight * .4 }); } catch (_) {}
    body.scrollTop = 0;
  }
  /** the certificate as a picture: the card is drawn into a canvas and handed over */
  async function saveCert() {
    const card = document.getElementById('pd-cert'); if (!card) return;
    const W = 1200, H = 820, cv = h('canvas', { width: W, height: H }), x = cv.getContext('2d');
    const c = certData();
    const bg = x.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#1C1511'); bg.addColorStop(1, '#0C0A09');
    x.fillStyle = bg; x.fillRect(0, 0, W, H);
    x.strokeStyle = '#C98B5B'; x.lineWidth = 3; x.strokeRect(28, 28, W - 56, H - 56);
    x.strokeStyle = 'rgba(201,139,91,.45)'; x.lineWidth = 1; x.strokeRect(44, 44, W - 88, H - 88);
    const F = (sz, w2) => (w2 || 400) + ' ' + sz + 'px system-ui, "Noto Sans Georgian", sans-serif';
    const mid = (txt, y, font, col) => { x.font = font; x.fillStyle = col; x.textAlign = 'center'; x.fillText(txt, W / 2, y); };
    mid(t('ex.certWho'), 110, F(22), '#C8A383');
    mid(t('ex.certName'), 165, F(38, 800), '#F4E7D8');
    mid(t('ex.certLine'), 285, F(22), '#C8A383');
    mid(c.name || t('acct.guest'), 360, F(52, 800), '#FFE2BA');
    const words = String(t('ex.certFin')).split(' ');
    let line = '', y = 430; x.font = F(22); x.fillStyle = '#D9C8B6';
    words.forEach(w2 => { const test = line ? line + ' ' + w2 : w2; if (x.measureText(test).width > W - 260) { mid(line, y, F(22), '#D9C8B6'); line = w2; y += 34; } else line = test; });
    if (line) mid(line, y, F(22), '#D9C8B6');
    mid(t('ex.certDate') + ': ' + fmtDay(c.at), H - 150, F(20), '#C8A383');
    mid(t('ex.certLv', { n: c.level, x: c.xp }), H - 112, F(20, 700), '#E8C49B');
    // the student's picture, when the browser lets it be drawn
    const draw = () => new Promise(res => {
      if (!c.avatar) return res(false);
      const im = new Image(); im.crossOrigin = 'anonymous';
      im.onload = () => { const r = 56, cx = W / 2, cy = 240; x.save(); x.beginPath(); x.arc(cx, cy, r, 0, 7); x.closePath(); x.clip(); x.drawImage(im, cx - r, cy - r, r * 2, r * 2); x.restore();
        x.beginPath(); x.arc(cx, cy, r, 0, 7); x.strokeStyle = '#C98B5B'; x.lineWidth = 3; x.stroke(); res(true); };
      im.onerror = () => res(false); im.src = c.avatar;
    });
    let okPic = false; try { okPic = await draw(); } catch (_) { okPic = false; }
    if (!okPic) { const cx = W / 2, cy = 240, r = 56; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fillStyle = 'rgba(201,139,91,.18)'; x.fill(); x.strokeStyle = '#C98B5B'; x.lineWidth = 3; x.stroke(); mid((c.name || '♪')[0] || '♪', cy + 16, F(44, 800), '#E8C49B'); }
    const blob = await new Promise(res => cv.toBlob(res, 'image/png'));
    if (!blob) return;
    const file = new File([blob], 'panduri-certificate.png', { type: 'image/png' });
    try { if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: t('ex.cert') }); return; } } catch (_) {}
    const url = URL.createObjectURL(blob), a = h('a', { href: url, download: 'panduri-certificate.png' });
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
    if (PD.ui && PD.ui.toast) PD.ui.toast(t('ex.certSaved'), 2600);
  }
  /** the certificate page, reachable from the profile at any time */
  function certPage(w) {
    w.append(h('div', { class: 'row pg-head' }, [h('button', { class: 'btn small backbtn', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('profile') }), h('h1', { 'data-t': 'ex.cert', style: 'margin:0' })]));
    if (!graduated()) { w.append(h('p', { class: 'fg2', text: t('ex.waitingD', { s: t(EXAMS[EXAMS.length - 1].name) }) })); PD.i18n.apply(w); return; }
    w.append(h('p', { class: 'fg2', 'data-t': 'ex.certD' }), certCard(),
      h('div', { class: 'row', style: 'gap:8px;justify-content:center' }, [h('button', { class: 'btn primary', 'data-t': 'ex.certSave', onclick: saveCert })]),
      h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', 'data-t': 'ex.gift' }), h('small', { class: 'muted', 'data-t': 'ex.giftD' })]));
    PD.i18n.apply(w);
  }

  /* ---------------- compulsory: the exam opens by itself ----------------
     As soon as every other step of a learning unit is done, that unit's
     exam opens and holds the screen until it is passed. */
  const KNOWN = 'exam.seen';   // the units that were already finished the last time this was looked at
  /** the units whose every other step is done */
  function doneUnits() {
    const PATHS = (PD.lessons && PD.lessons.PATHS) || [], sd = PD.app && PD.app.stepDone;
    if (!sd) return null;
    const out = [];
    for (const p of PATHS) {
      const ex = p.steps.find(s2 => s2.kind === 'exam'); if (!ex) continue;
      const e = get(ex.id);
      const rest = p.steps.filter(s2 => s2.kind !== 'exam' && s2.kind !== 'needs');
      if (!rest.length || !rest.every(sd)) continue;
      // the final exam closes the course: every other exam passed and every unit finished
      if (e && e.final && !courseDone()) continue;
      out.push({ p: p.id, id: ex.id });
    }
    return out;
  }
  /** every unit of the programme finished and every other exam passed */
  function courseDone() {
    const PATHS = (PD.lessons && PD.lessons.PATHS) || [], sd = PD.app && PD.app.stepDone;
    if (!sd) return false;
    if (EXAMS.filter(e => !e.final).some(e => !passed(e.id))) return false;
    return PATHS.every(p => p.steps.filter(s2 => s2.kind !== 'exam' && s2.kind !== 'needs').every(sd));
  }
  /** the whole course, the final exam included */
  const graduated = () => EXAMS.every(e => passed(e.id));
  /** the exam that is due now: a unit the student has just finished — never one that was
      already finished before the exams existed, and never again once it is passed */
  function dueExam() {
    const done = doneUnits(); if (!done) return null;
    const known = PD.store.get(KNOWN, null);
    if (known === null) { PD.store.set(KNOWN, done.map(x => x.p)); return null; }   // the first look only takes stock
    const fresh = done.filter(x => !known.includes(x.p) && !passed(x.id));
    // a unit stays "new" until its exam is passed, so closing the app brings the exam back
    const keep = done.filter(x => known.includes(x.p) || passed(x.id)).map(x => x.p);
    if (keep.join() !== known.join()) PD.store.set(KNOWN, keep);
    return fresh.length ? fresh[0].id : null;
  }
  /** "later": the screen closes, the exam stays waiting and the next unit stays shut */
  function postpone() { const a = active(); if (a) snoozed = a.id; close(); if (PD.ui && PD.ui.toast) PD.ui.toast(t('ex.laterD'), 4200); }
  /** the exam a unit has to wait for: an earlier unit is finished but its exam is not passed */
  function blocking(pathId) {
    const PATHS = (PD.lessons && PD.lessons.PATHS) || [], i = PATHS.findIndex(p => p.id === pathId);
    if (i < 0) return null;
    const sd = PD.app && PD.app.stepDone; if (!sd) return null;
    for (let k = 0; k < i; k++) {
      const p = PATHS[k], ex = p.steps.find(s2 => s2.kind === 'exam');
      if (!ex || passed(ex.id)) continue;
      const rest = p.steps.filter(s2 => s2.kind !== 'exam' && s2.kind !== 'needs');
      if (rest.length && rest.every(sd)) return ex.id;
    }
    return null;
  }
  /** which unit a lesson belongs to, so the lock also holds when it is opened from elsewhere */
  function pathOfLesson(id) {
    const PATHS = (PD.lessons && PD.lessons.PATHS) || [], rid = /^rhythm-/.test(id || '') ? String(id).slice(7) : null;
    const p = PATHS.find(q => q.steps.some(s2 => (s2.kind === 'lesson' && s2.id === id) || (s2.kind === 'rhythm' && s2.id === rid)));
    return p ? p.id : null;
  }
  /** the exam that stands in front of this lesson, or null */
  function blockingLesson(id) { const p = pathOfLesson(id); return p ? blocking(p) : null; }
  /** the exam that is waiting right now (for the banner and the reminder) */
  function waiting() { const a = active(); if (a) return a.id; const d = dueExam(); return d || null; }

  /** called on every screen the app draws */
  function guard() {
    if (PD.store.get('author', false)) return;
    const a = active();
    if (a) { if (!Z && snoozed !== a.id) open(a.id); return; }
    if (Z) close();
    const due = dueExam();                       // always takes stock, even while another screen is up
    if (!due || snoozed === due) return;
    if (document.querySelector('.pz, .ss-wrap, .ag, .ob, .exz')) return;   // the lesson screen, the tuner, a gate: the exam waits for it
    open(due);
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
      if (q.art) card.append(h('div', { class: 'exq-art', html: q.art }));
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

  const api = { page, drill, list, passed, active, begin, blocked, finish, finishNow, draw, bankSize, courseDone, graduated, certPage, certCard, saveCert, certificate, askedOf, forgetAsked, open, close, guard, dueExam, doneUnits, openNow, postpone, blocking, blockingLesson, pathOfLesson, waiting, EXAMS, TOPICS, get, GEN };
  return api;
})();
