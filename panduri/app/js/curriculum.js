/* =====================================================================
   Curriculum DATA layer — WHAT is taught. The lesson engine only knows
   HOW to teach and never contains content.
   The package below is DEMO CONTENT written while building the app.
   It is NOT verified panduri pedagogy: fingerings, exercises, chord
   shapes and melodies here were not supplied by the teacher. Every item
   carries demo:true and is labelled as such in the UI. The teacher
   replaces it by importing a curriculum package (Studio → Curriculum)
   or by editing lessons; the engine does not change.
   Package schema: { schema:'panduri-curriculum', v:1, meta:{title,author,verified},
     lessons:[Lesson], paths:[Path], chords:[Chord] }
   ===================================================================== */
PD.build = (() => {
  let uid = 1;
  const id = () => 'e' + (uid++).toString(36);
  const N = (t, s, f, fi, st, d, acc, hint) => ({ id: id(), t, d, s, f, fi, st, acc: !!acc, technique: 'pluck', hint });
  const chord = (t, name, frets, fingers, st, d, acc, technique) => {
    const cid = 'c' + (uid++).toString(36);
    return frets.map((f, i) => ({ id: id(), t, d, s: i + 1, f, fi: fingers[i], st, acc: !!acc, chordId: cid, chord: name, technique: technique || 'strum' })).filter(e => e.f != null);
  };
  const strum = (t, st, d, acc) => chord(t, 'A', [0, 0, 0], [0, 0, 0], st, d, acc, 'strum');
  const sec = (ka, en, from, to) => ({ id: 's' + (uid++).toString(36), name: { ka, en }, from, to });
  return { id, N, chord, strum, sec, newChordId: () => 'c' + (uid++).toString(36) };
})();

PD.curriculum = (() => {
  const { N, chord, strum, sec } = PD.build;
  const L = o => Object.assign({ v: 2, level: 1, tuning: 'std', meter: [4, 4], sections: [], events: [], demo: true }, o);
  const DEMO_NOTE = { ka: 'სადემონსტრაციო მასალა — მასწავლებლის მიერ არ არის დამოწმებული.', en: 'Demo material — not verified by the teacher.' };
  /* ---- DEMO lessons (placeholders until the teacher's curriculum is imported) ---- */
  const B = [];
  // Getting started: open strings, one at a time (pitch is unique for open A and E; open C♯ shares pitch with A fret 4)
  B.push(L({ id: 'gs-open-a', type: 'exercise', path: 'start', title: { ka: 'ღია სიმი A', en: 'Open string A' }, bpm: 60,
    desc: { ka: 'ერთი სიმი, ერთი ბგერა. დაუკარი A სიმი ოთხჯერ.', en: 'One string, one sound. Play the A string four times.' },
    events: [0, 1, 2, 3].map(b => N(b, 1, 0, 0, 'down', 1, b === 0)), sections: [sec('ღია A', 'Open A', 0, 4)] }));
  B.push(L({ id: 'gs-open-c', type: 'exercise', path: 'start', title: { ka: 'ღია სიმი C♯', en: 'Open string C♯' }, bpm: 60,
    desc: { ka: 'შუა სიმი. მიკროფონი ამ ბგერას A სიმის მე-4 ლადისგან ვერ განასხვავებს — სიმს გაკვეთილის კონტექსტი ადასტურებს.', en: 'The middle string. The microphone cannot tell this pitch apart from A string fret 4 — the lesson context confirms the string.' },
    events: [0, 1, 2, 3].map(b => N(b, 2, 0, 0, 'down', 1, b === 0)), sections: [sec('ღია C♯', 'Open C♯', 0, 4)] }));
  B.push(L({ id: 'gs-open-e', type: 'exercise', path: 'start', title: { ka: 'ღია სიმი E', en: 'Open string E' }, bpm: 60,
    events: [0, 1, 2, 3].map(b => N(b, 3, 0, 0, 'down', 1, b === 0)), sections: [sec('ღია E', 'Open E', 0, 4)] }));
  B.push(L({ id: 'gs-three', type: 'exercise', path: 'start', title: { ka: 'სამი სიმი რიგრიგობით', en: 'Three strings in turn' }, bpm: 66,
    events: [1, 2, 3, 2, 1, 2, 3, 3].map((s, i) => N(i, s, 0, 0, 'down', 1, i % 4 === 0)), sections: [sec('ზევით', 'Up', 0, 4), sec('და უკან', 'And back', 4, 8)] }));
  // Right hand
  B.push(L({ id: 'rh-down', type: 'exercise', path: 'right', title: { ka: 'ჩაკვრა ↓', en: 'Down stroke ↓' }, bpm: 60,
    events: [].concat(...[0, 1, 2, 3, 4, 5, 6, 7].map(b => strum(b, 'down', 1, b % 4 === 0))), sections: [sec('ტაქტი 1', 'Bar 1', 0, 4), sec('ტაქტი 2', 'Bar 2', 4, 8)] }));
  B.push(L({ id: 'rh-up', type: 'exercise', path: 'right', title: { ka: 'ამოკვრა ↑', en: 'Up stroke ↑' }, bpm: 60,
    events: [].concat(...[0, 1, 2, 3, 4, 5, 6, 7].map(b => strum(b, 'up', 1, false))), sections: [sec('ტაქტი 1', 'Bar 1', 0, 4), sec('ტაქტი 2', 'Bar 2', 4, 8)] }));
  B.push(L({ id: 'rh-alt', type: 'exercise', path: 'right', title: { ka: 'ჩაკვრა + ამოკვრა', en: 'Down + up' }, bpm: 60,
    events: [].concat(...Array.from({ length: 16 }, (_, i) => strum(i / 2, i % 2 ? 'up' : 'down', .5, i % 8 === 0))), sections: [sec('ტაქტი 1', 'Bar 1', 0, 4), sec('ტაქტი 2', 'Bar 2', 4, 8)] }));
  const rhythmBar = o => [].concat(strum(o, 'down', 1, true), strum(o + 1, 'down', .5), strum(o + 1.5, 'up', .5), strum(o + 2.5, 'up', .5), strum(o + 3, 'down', .5), strum(o + 3.5, 'up', .5));
  B.push(L({ id: 'r1', type: 'exercise', path: 'rhythm', level: 2, title: { ka: 'რიტმი: აქცენტი და პაუზა', en: 'Rhythm: accent and rest' }, bpm: 72,
    events: [].concat(rhythmBar(0), rhythmBar(4), rhythmBar(8), rhythmBar(12)), sections: [sec('ტაქტები 1–2', 'Bars 1–2', 0, 8), sec('ტაქტები 3–4', 'Bars 3–4', 8, 16)] }));
  // Left hand: finger numbers on one string (fingers 1–4 on frets 1–4)
  B.push(L({ id: 'lh-fingers', type: 'exercise', path: 'left', title: { ka: 'თითები 1–4', en: 'Fingers 1–4' }, bpm: 60,
    desc: { ka: 'ყოველ ლადს თავისი თითი: 1 — საჩვენებელი, 4 — ნეკი.', en: 'One finger per fret: 1 — index, 4 — little finger.' },
    events: [1, 2, 3, 4, 4, 3, 2, 1].map((f, i) => N(i, 3, f, f, 'down', 1, i % 4 === 0)), sections: [sec('ზევით', 'Up', 0, 4), sec('ქვევით', 'Down', 4, 8)] }));
  B.push(L({ id: 'lh-strings', type: 'exercise', path: 'left', title: { ka: 'ლადები სამივე სიმზე', en: 'Frets on all three strings' }, bpm: 60,
    events: [].concat(...[1, 2, 3].map((s, k) => [1, 2, 3, 4].map((f, i) => N(k * 4 + i, s, f, f, 'down', 1, i === 0)))), sections: [sec('A', 'A', 0, 4), sec('C♯', 'C♯', 4, 8), sec('E', 'E', 8, 12)] }));
  B.push(L({ id: 'm1', type: 'melody', path: 'melody', title: { ka: 'პირველი მელოდია · I პოზიცია', en: 'First melody · position I' }, bpm: 76,
    events: [N(0, 1, 0, 0, 'down', 1), N(1, 1, 2, 2, 'down', 1), N(2, 1, 4, 4, 'down', 1), N(3, 2, 1, 1, 'down', 1), N(4, 3, 0, 0, 'down', 1, true), N(5, 3, 2, 2, 'down', .5), N(5.5, 3, 4, 4, 'up', .5), N(6, 3, 2, 2, 'down', 1), N(7, 3, 0, 0, 'down', 1), N(8, 2, 1, 1, 'down', 1, true), N(9, 1, 4, 4, 'down', 1), N(10, 1, 2, 2, 'down', 1), N(11, 1, 0, 0, 'down', 1)],
    sections: [sec('ფრაზა 1', 'Phrase 1', 0, 4), sec('ფრაზა 2', 'Phrase 2', 4, 8), sec('ფრაზა 3', 'Phrase 3', 8, 12)] }));
  B.push(L({ id: 'm2', type: 'melody', path: 'melody', level: 2, title: { ka: 'V პოზიცია · F♯-დან', en: 'Position V · from F♯' }, bpm: 84,
    events: [N(0, 2, 5, 1, 'down', 1), N(1, 2, 7, 3, 'up', .5), N(1.5, 2, 8, 4, 'down', .5), N(2, 3, 5, 1, 'down', 1, true), N(3, 3, 7, 3, 'up', .5), N(3.5, 1, 7, 3, 'down', .5), N(4, 1, 5, 1, 'down', 1, true), N(5, 2, 5, 1, 'down', .5), N(5.5, 2, 7, 3, 'up', .5), N(6, 3, 5, 1, 'down', 1), N(7, 2, 8, 4, 'down', .5), N(7.5, 2, 7, 3, 'up', .5), N(8, 2, 5, 1, 'down', 4, true)],
    sections: [sec('ფრაზა 1', 'Phrase 1', 0, 4), sec('ფრაზა 2', 'Phrase 2', 4, 8), sec('დასასრული', 'Ending', 8, 12)] }));
  B.push(L({ id: 'pos-shift', type: 'exercise', path: 'left', level: 2, title: { ka: 'პოზიციის ცვლა I → V', en: 'Position shift I → V' }, bpm: 66,
    events: [N(0, 2, 1, 1, 'down', 1), N(1, 2, 2, 2, 'down', 1), N(2, 2, 3, 3, 'down', 1), N(3, 2, 4, 4, 'down', 1), N(4, 2, 5, 1, 'down', 1, true, { ka: 'მთელი ხელი მე-5 ლადამდე გადაიწიე', en: 'Move the whole hand to fret 5' }), N(5, 2, 6, 2, 'down', 1), N(6, 2, 7, 3, 'down', 1), N(7, 2, 8, 4, 'down', 1)],
    sections: [sec('I პოზიცია', 'Position I', 0, 4), sec('V პოზიცია', 'Position V', 4, 8)] }));
  // Chords
  B.push(L({ id: 'c1', type: 'exercise', path: 'chords', level: 2, title: { ka: 'აკორდები · Dm → Em, A · E · D', en: 'Chords · Dm → Em, A · E · D' }, bpm: 70,
    events: [].concat(chord(0, 'Dm', [5, 4, 5], [2, 1, 3], 'down', 2, true), chord(2, 'Em', [7, 6, 7], [2, 1, 3], 'down', 2), chord(4, 'Dm', [5, 4, 5], [2, 1, 3], 'down', 2, true), chord(6, 'Em', [7, 6, 7], [2, 1, 3], 'down', 2),
      chord(8, 'A', [0, 0, 0], [0, 0, 0], 'down', 2, true), chord(10, 'E', [7, 7, 7], [1, 1, 1], 'down', 2), chord(12, 'D', [5, 5, 5], [1, 1, 1], 'down', 2, true), chord(14, 'A', [0, 0, 0], [0, 0, 0], 'down', 2)),
    sections: [sec('Dm ↔ Em', 'Dm ↔ Em', 0, 8), sec('A · E · D · A', 'A · E · D · A', 8, 16)] }));
  B.push(L({ id: 'c-majors', type: 'exercise', path: 'chords', title: { ka: 'მაჟორი ბარეთი: A → D → E', en: 'Barre majors: A → D → E' }, bpm: 60,
    events: [].concat(chord(0, 'A', [0, 0, 0], [0, 0, 0], 'down', 4, true), chord(4, 'D', [5, 5, 5], [1, 1, 1], 'down', 4, true), chord(8, 'E', [7, 7, 7], [1, 1, 1], 'down', 4, true), chord(12, 'A', [0, 0, 0], [0, 0, 0], 'down', 4, true)),
    sections: [sec('A → D', 'A → D', 0, 8), sec('E → A', 'E → A', 8, 16)] }));

  /* ---- CORE lessons: specified in the product brief (not invented pedagogy): open strings, one fretted note, one stroke pattern.
     They exist in every curriculum so the microphone flow can always be tried. ---- */
  const CORE = [
    L({ id: 'poc-three', type: 'exercise', demo: false, source: 'spec', level: 1, bpm: 60, skills: ['notes', 'strings', 'rhythm'],
      title: { ka: 'პირველი სამი ნოტი', en: 'The first three notes' },
      desc: { ka: 'ღია სიმები A, C♯ და E, შემდეგ შემთხვევითი რიგი და მარტივი რიტმი. აპი შენს დაკვრას მიკროფონით ამოწმებს.', en: 'Open strings A, C♯ and E, then a mixed order and a simple rhythm. The app checks your playing through the microphone.' },
      events: [N(0, 1, 0, 0, 'down', 2), N(2, 2, 0, 0, 'down', 2), N(4, 3, 0, 0, 'down', 2)]
        .concat([3, 1, 2, 1, 3, 2].map((st, i) => N(6 + i * 2, st, 0, 0, 'down', 2)))
        .concat([0, 1, 2, 3, 4, 5, 6, 7].map(b => Object.assign(N(18 + b, 1, 0, 0, 'down', 1, b % 4 === 0), { wait: false }))),
      sections: [sec('სამი სიმი', 'Three strings', 0, 6), sec('შემთხვევითი რიგი', 'Mixed order', 6, 18), sec('მარტივი რიტმი', 'Simple rhythm', 18, 26)] }),
    L({ id: 'poc-fret', type: 'exercise', demo: false, source: 'spec', level: 1, bpm: 60, skills: ['frets', 'fingering'],
      title: { ka: 'პირველი ლადი: A სიმი, ლადი 2', en: 'First fret: A string, fret 2' },
      desc: { ka: 'A სიმის მე-2 ლადი (B3). თითი 2 — „თითი ლადზე“ წესით; მასწავლებელს შეუძლია შეცვალოს სტუდიაში.', en: 'A string, fret 2 (B3). Finger 2 — one finger per fret; the teacher can change it in the Studio.' },
      fingeringSrc: 'convention',
      events: [N(0, 1, 2, 2, 'down', 2), N(2, 1, 2, 2, 'down', 2), N(4, 1, 2, 2, 'down', 2)]
        .concat([0, 2, 0, 2, 0, 2, 2, 0].map((f, i) => N(6 + i, 1, f, f ? 2 : 0, 'down', 1, i % 4 === 0))),
      sections: [sec('ლადი 2', 'Fret 2', 0, 6), sec('ღია ↔ ლადი 2', 'Open ↔ fret 2', 6, 14)] }),
    L({ id: 'poc-rhythm', type: 'exercise', demo: false, source: 'spec', level: 1, bpm: 60, skills: ['rhythm', 'strumming'], metro: true,
      title: { ka: 'პირველი რიტმი: ↓ ↑ ↓ ↑', en: 'First rhythm: ↓ ↑ ↓ ↑' },
      desc: { ka: 'მეტრონომთან. აპი მიკროფონით ზომავს, როდის დაუკარი: ზუსტად, ადრე, გვიან თუ გამოტოვე.', en: 'With the metronome. The microphone measures when you played: on time, early, late or missed.' },
      events: [].concat(...[0, 1, 2, 3, 4, 5, 6, 7].map(b => strum(b, b % 2 ? 'up' : 'down', 1, false).map(e => Object.assign(e, { wait: false })))),
      sections: [sec('ტაქტი 1', 'Bar 1', 0, 4), sec('ტაქტი 2', 'Bar 2', 4, 8)] })
  ];

  /* ---- Curriculum paths: steps are lessons or explanatory cards. Missing teaching media is marked, not faked. ---- */
  const NEED = (ka, en) => ({ kind: 'needs', media: 'teacher', title: { ka, en } });
  /* the order of learning: first the instrument, then notes, scales, rhythm and the ear (solfège) — only then practice on the panduri */
  const CH = id => ({ kind: 'chapter', id }), TIP = id => ({ kind: 'tip', id }), SF = (ex, lv) => ({ kind: 'solfege', id: ex + ':' + lv });
  const EX = id => ({ kind: 'exam', id });   // a theory unit ends with its exam
  const PATHS = [
    /* Theory, easy → hard. "first" comes before everything: sitting, holding, which hand does what, finger and string numbers, care.
       Those cards are drafts for the teacher to check (tips.js, source 'draft') and editable in Author Studio. */
    { id: 'first', theory: true, title: { ka: 'პირველი ნაბიჯები: დაჯდომა და დაჭერა', en: 'First steps: sitting and holding' }, steps: [
      TIP('sit'), TIP('hold'), TIP('hands'), TIP('strokes'), TIP('fingers'), TIP('lefthand'), TIP('stringnum'), TIP('warmup'), TIP('care'), EX('ex-first'),
      NEED('ვიდეო: მასწავლებელი აჩვენებს დაჯდომას და დაჭერას', 'Video: the teacher shows sitting and holding')] },
    { id: 'instrument', theory: true, title: { ka: 'გაიცანი ფანდური', en: 'Meet the panduri' }, steps: [
      TIP('parts'), { kind: 'tour', title: { ka: 'ფანდური 3D-ში', en: 'The panduri in 3D' } }, TIP('strings'), TIP('dots'), TIP('tab'),
      { kind: 'tuner', title: { ka: 'აწყობა: A · C♯ · E (სამი სიმი)', en: 'Tuning: A · C♯ · E (Sami Simi)' } }, EX('ex-inst')] },
    { id: 'rhythms', theory: true, title: { ka: 'რითმი: დათვლა და დარტყმა', en: 'Rhythm: counting and the beat' }, steps: [
      TIP('beat'), CH('meter'), CH('tempo'), TIP('count'), TIP('rhythm'), TIP('accent'), { kind: 'rhythms', title: { ka: 'ფანდურის და ცნობილი რითმები', en: 'Panduri and famous rhythms' } }, EX('ex-rhythm')] },
    { id: 'notes', theory: true, title: { ka: 'ნოტები', en: 'Notes' }, steps: [
      TIP('pitch'), CH('names'), CH('octave'), CH('semitone'), CH('accidentals'), CH('neck'), TIP('semitone'), CH('staff'), CH('durations'), CH('rests'), { kind: 'fretboard', title: { ka: 'ნოტები ტარზე: რუკა', en: 'Notes on the neck: the map' } }, EX('ex-notes')] },
    { id: 'scales', theory: true, title: { ka: 'ინტერვალები, გამები, აკორდები', en: 'Intervals, scales, chords' }, steps: [
      TIP('chordwhat'), CH('intervals'), TIP('octave'), CH('scales'), CH('key'), CH('chords'), { kind: 'chords', title: { ka: 'აკორდების ბიბლიოთეკა', en: 'Chord library' } }, CH('signs'), EX('ex-harmony')] },
    { id: 'solfege', theory: true, title: { ka: 'სოლფეჯიო', en: 'Solfège' }, steps: [
      SF('hear', 1), SF('hear', 2), SF('iv', 1), SF('sing', 1), SF('hear', 3), SF('iv', 2), SF('sing', 2), TIP('sing'), SF('iv', 3), SF('sing', 3), EX('ex-solfege')] },
    { id: 'deeper', theory: true, title: { ka: 'რთული თეორია', en: 'Harder theory' }, steps: [
      TIP('dyn'), TIP('sync'), TIP('triplet'), TIP('transpose'), TIP('inversion')] },
    { id: 'foundation', level: 'foundation', title: { ka: 'პრაქტიკა: საფუძვლები', en: 'Practice: foundation' }, steps: [
      CH('app'), TIP('fretpos'), TIP('curve'),
      { kind: 'lesson', id: 'poc-three' }, { kind: 'lesson', id: 'rh-down' }, { kind: 'lesson', id: 'rh-up' }, { kind: 'lesson', id: 'poc-fret' }, { kind: 'lesson', id: 'poc-rhythm' }, { kind: 'rhythm', id: 'g-down4' }, { kind: 'rhythm', id: 'g-du8' }] },
    { id: 'beginner', level: 'beginner', title: { ka: 'პრაქტიკა: დამწყები', en: 'Practice: beginner' }, steps: [
      { kind: 'trainer', title: { ka: 'ნოტები და ლადები', en: 'Notes and frets' } }, { kind: 'lesson', id: 'lh-fingers' }, { kind: 'lesson', id: 'm1' }, { kind: 'lesson', id: 'rh-alt' },
      { kind: 'rhythm', id: 'kazbeguri' }, { kind: 'rhythm', id: 'acharuli' }, { kind: 'rhythm', id: 'g-waltz' }, { kind: 'rhythm', id: 'g-folk' }, NEED('მარტივი სიმღერები', 'Simple songs')] },
    { id: 'intermediate', level: 'intermediate', title: { ka: 'პრაქტიკა: საშუალო', en: 'Practice: intermediate' }, steps: [
      { kind: 'lesson', id: 'pos-shift' }, { kind: 'lesson', id: 'r1' }, { kind: 'rhythm', id: 'mtiuluri' }, { kind: 'lesson', id: 'bass-move' }, { kind: 'lesson', id: 'prog-geo' }, NEED('ტეხილები', 'Tekhili'), { kind: 'lesson', id: 'm2' }, { kind: 'lesson', id: 'c1' }, { kind: 'rhythm', id: 'g-pop' }, { kind: 'rhythm', id: 'g-backbeat' }, { kind: 'rhythm', id: 'g-68' }] },
    { id: 'advanced', level: 'advanced', title: { ka: 'პრაქტიკა: რთული', en: 'Practice: advanced' }, steps: [
      { kind: 'rhythm', id: 'khorumi' }, NEED('სოლო', 'Solo'), NEED('სწრაფი ტექნიკა', 'Fast technique'), NEED('ტრადიციული სტილები', 'Traditional styles'), { kind: 'lesson', id: 'bani-acharuli' }, { kind: 'rhythm', id: 'g-shuffle' }, { kind: 'rhythm', id: 'g-gallop' }, { kind: 'rhythm', id: 'g-16' }, EX('ex-final')] }
  ];
  const PATHS_OLD = [
    { id: 'start', title: { ka: 'დასაწყისი', en: 'Getting started' }, steps: [
      { kind: 'tour', title: { ka: 'ფანდურის ნაწილები', en: 'Parts of the panduri' } },
      { kind: 'tuner', title: { ka: 'აწყობა: A · C♯ · E', en: 'Tuning: A · C♯ · E' } },
      { kind: 'needs', media: 'video', title: { ka: 'როგორ დავიჭიროთ ფანდური', en: 'Holding the instrument' } },
      { kind: 'lesson', id: 'gs-open-a' }, { kind: 'lesson', id: 'gs-open-c' }, { kind: 'lesson', id: 'gs-open-e' }, { kind: 'lesson', id: 'gs-three' }] },
    { id: 'right', title: { ka: 'მარჯვენა ხელი', en: 'Right hand' }, steps: [{ kind: 'lesson', id: 'rh-down' }, { kind: 'lesson', id: 'rh-up' }, { kind: 'lesson', id: 'rh-alt' }, { kind: 'lesson', id: 'r1' }] },
    { id: 'left', title: { ka: 'მარცხენა ხელი', en: 'Left hand' }, steps: [{ kind: 'lesson', id: 'lh-fingers' }, { kind: 'lesson', id: 'lh-strings' }, { kind: 'lesson', id: 'pos-shift' }] },
    { id: 'chords', title: { ka: 'აკორდები', en: 'Chords' }, steps: [{ kind: 'chords', title: { ka: 'აკორდების მკვლევარი', en: 'Chord explorer' } }, { kind: 'lesson', id: 'c-majors' }, { kind: 'lesson', id: 'c1' }] },
    { id: 'melody', title: { ka: 'მელოდიები', en: 'Melodies' }, steps: [{ kind: 'fretboard', title: { ka: 'ტარის რუკა', en: 'Fretboard map' } }, { kind: 'lesson', id: 'm1' }, { kind: 'lesson', id: 'm2' }] },
    { id: 'songs', title: { ka: 'სიმღერები', en: 'Songs' }, steps: [{ kind: 'lesson', id: 'bani-acharuli' }] }
  ];


  /* ---- The teacher's chord turn: Am → Em → F → G, which he says runs through Georgian songs and dance
     melodies (Mtiuluri, Acharuli and the rest). His own shapes; the bass walks C–B–C–B under them, because
     that is where his thumb sits in each one. Four down-strokes per chord, no rhythm invented. ---- */
  (() => {
    const SH = [['Am', [3, 3, 5], ['T', 1, 3]], ['Em', [2, 3, 3], ['T', 1, 1]], ['F', [3, 4, 5], ['T', 1, 2]], ['G', [2, 1, 3], ['T', 1, 3]]];
    const ev = [];
    for (let r = 0; r < 4; r++) SH.forEach(([nm, fr, fi], i) => { const t0 = (r * SH.length + i) * 4; for (let k = 0; k < 4; k++) ev.push(...chord(t0 + k, nm, fr, fi, 'down', 1, k === 0, 'strum')); });
    B.push(L({ id: 'prog-geo', type: 'exercise', demo: false, source: 'teacher', level: 2, bpm: 68, path: 'chords',
      title: { ka: 'ქართული მოძრაობა: Am → Em → F → G', en: 'The Georgian turn: Am → Em → F → G' },
      desc: { ka: 'მასწავლებლის აკორდული მოძრაობა — ქართულ სიმღერებსა და საცეკვაო მელოდიებში (მთიულური, აჭარული და სხვა). ბანი ქვემოთ დადის დო–სი–დო–სი, რადგან ცერა ყოველ აკორდში თავის ადგილზეა.', en: 'The teacher\u2019s chord turn — it runs through Georgian songs and dance melodies (Mtiuluri, Acharuli and others). The bass walks C–B–C–B underneath, because that is where his thumb sits in each shape.' },
      events: ev, skills: ['chords', 'strumming'], stages: ['demo', 'slow', 'perform'] }));
  })();

  /* ---- CHORD SHAPES the teacher gave by hand (teaching data, not computed).
     Everything else in the library is worked out from the tuning; these are his own. ---- */
  const TEACHER_CHORDS = {
    'C♯': [{ frets: [4, 0, 4], fingers: ['T', 0, 2], src: 'teacher',
      note: { ka: 'გამარტივებული: საჩვენებელი აწეული — მხოლოდ ცერა და შუა თითი. შუა სიმი ღიაა და ისედაც დო♯-ს იძლევა.', en: 'Simplified: the index lifted — only the thumb and the middle finger. The middle string is open and already sounds C♯.' } }]
  };

  /* chord library: every root × chord type computed from the tuning (PD.theory); shapes the teacher gave win */
  function library() {
    const lib = PD.theory.chordLibrary().map(c => Object.assign({}, c));
    Object.values(PD.SONGS || {}).forEach(S => Object.entries(S.chords || {}).forEach(([n, sh]) => {
      const c = lib.find(x => x.name === n || x.alias === n); if (!c || c.none) return;
      const tf = PD.theory.teacherFingers(sh.frets), fing = tf ? tf.fingers : sh.fingers;   // his fingering rule also decides the song's own shapes
      const same = v => v.frets.join() === sh.frets.join(), v0 = { frets: sh.frets, fingers: fing, fsrc: tf ? tf.fsrc : undefined, barre: new Set(fing.filter(Boolean)).size === 1 && fing.filter(Boolean).length > 1, pos: sh.frets.some(f => f > 0) ? Math.min(...sh.frets.filter(f => f > 0)) : 0 };
      c.voicings = [v0].concat(c.voicings.filter(v => !same(v))).slice(0, 3);
      Object.assign(c, { frets: v0.frets, fingers: v0.fingers, barre: v0.barre, fsrc: v0.fsrc || c.fsrc, src: sh.src === 'teacher' ? 'teacher' : 'song' });
    }));
    // his second way of taking a closed chord: the index alone across all three strings
    lib.forEach(c2 => {
      if (c2.none || !c2.frets) return;
      const f = c2.frets;
      if (!(f[0] > 0 && f[0] === f[1] && f[1] === f[2])) return;
      if ((c2.voicings || []).some(v => v.fingers && v.fingers.join() === '1,1,1' && v.frets.join() === f.join())) return;
      c2.voicings = (c2.voicings || []).concat([{ frets: f.slice(), fingers: [1, 1, 1], barre: true, pos: f[0], fsrc: 'teacher-barre1',
        note: { ka: 'მეორე ხერხი: საჩვენებელი კეტავს სამივე სიმს — ბანსაც.', en: 'The second way: the index closes all three strings, the bass too.' } }]);
    });
    // the teacher's own extra positions, kept after the computed ones
    Object.entries(TEACHER_CHORDS).forEach(([n, adds]) => {
      const c2 = lib.find(x => x.name === n || x.alias === n); if (!c2 || c2.none) return;
      adds.forEach(a => {
        if ((c2.voicings || []).some(v => v.frets.join() === a.frets.join())) return;
        const fretted = a.frets.filter(f => f > 0);
        c2.voicings = (c2.voicings || []).concat([{ frets: a.frets, fingers: a.fingers, barre: false, pos: fretted.length ? Math.min(...fretted) : 0, fsrc: 'teacher', note: a.note }]);
      });
    });
    return lib;
  }
  /* (old) demo chord list — kept for reference, no longer used */
  function demoChords() {
    const out = [], NN = PD.theory.NN, root0 = 57;
    for (let n = 0; n <= 12; n++) {
      const r = NN[(root0 + n) % 12];
      out.push({ id: 'maj' + n, name: r, kind: 'maj', frets: [n, n, n], fingers: n ? [1, 1, 1] : [0, 0, 0], barre: n > 0, demo: true });
      if (n >= 1) out.push({ id: 'min' + n, name: r + 'm', kind: 'min', frets: [n, n - 1, n], fingers: [2, n - 1 ? 1 : 0, 3], barre: false, demo: true });
    }
    return out;
  }
  /* ---- RHYTHMS supplied by the teacher (verified teaching data — NOT demo).
     Stroke order and accents are exactly as given: ↓ = ჩაკვრა, ↑ = ამოკვრა, accent = მძიმე (red).
     Timing was not supplied: every stroke defaults to an equal step (d = 1 beat) and the tempo to 60 BPM.
     Both are marked timing.src = 'default' and are editable in the Studio until the teacher gives them. ---- */
  const S = (direction, accent) => ({ direction, accent });
  const TEACHER_RHYTHMS = [
    { id: 'kazbeguri', name: { ka: 'ყაზბეგური', en: 'Kazbeguri' }, usage: { ka: ['მელოდიები', 'ტეხილები', 'თუშური მელოდიები'], en: ['Melodies', 'Tekhili', 'Tushetian melodies'] },
      strokes: [S('down', true), S('up', false), S('down', false)], source: 'teacher' },
    { id: 'mtiuluri', name: { ka: 'მთიულური', en: 'Mtiuluri' }, usage: { ka: ['მელოდიები', 'სიმღერები'], en: ['Melodies', 'Songs'] },
      strokes: [S('down', true), S('down', false), S('up', true), S('down', false), S('up', false)], source: 'teacher' },
    { id: 'khorumi', name: { ka: 'ხორუმი', en: 'Khorumi' }, usage: { ka: ['მელოდიები'], en: ['Melodies'] },
      strokes: [S('down', true), S('down', false), S('up', false), S('down', false), S('down', true), S('down', false), S('up', false)], source: 'teacher' },
    { id: 'acharuli', name: { ka: 'აჭარული', en: 'Acharuli' }, usage: { ka: ['მელოდიები', 'სიმღერები'], en: ['Melodies', 'Songs'] },
      strokes: [S('down', false), S('down', true), S('up', true)], source: 'teacher' }
  ].map(r => Object.assign({ timing: { bpm: 60, durations: r.strokes.map(() => 1), src: 'default' } }, r));
  /* ---- The teacher's own exercise: moving the bass.
     In Gm the thumb holds the bass at fret 1 (A♯3); to move the bass the middle finger is added two frets up,
     on the bass string, and the same rhythm is played again. His words, his shapes, his rhythm. ---- */
  (() => {
    const R = TEACHER_RHYTHMS.find(r => r.id === 'mtiuluri') || TEACHER_RHYTHMS[0];
    const BASE = { frets: [1, 1, 3], fingers: ['T', 1, 3] }, MOVED = { frets: [3, 1, 3], fingers: [2, 1, 3] };
    const per = R.strokes.length, d = 1 / per, ev = [];
    for (let r = 0; r < 16; r++) {
      const sh = (r % 2) ? MOVED : BASE;
      R.strokes.forEach((k, j) => ev.push(...chord(r + j * d, 'Gm', sh.frets, sh.fingers, k.direction, d, k.accent, 'strum')));
    }
    B.push(L({ id: 'bass-move', type: 'exercise', demo: false, source: 'teacher', level: 2, bpm: 72, path: 'rhythm',
      title: { ka: 'ბანის მოძრაობა', en: 'Moving the bass' },
      desc: { ka: 'სოლ მინორი: ცერა ბანს პირველ ლადში იჭერს. ბანის გასამოძრავებლად შუა თითს ვამატებთ ორი ლადით ზემოთ, იმავე ბანის სიმზე, და იგივე რითმს ვიმეორებთ.', en: 'G minor: the thumb holds the bass at the first fret. To move the bass, the middle finger is added two frets higher on the same bass string, and the same rhythm is played again.' },
      rhythm: R.id, events: ev, skills: ['chords', 'strumming', 'rhythm'], meter: [5, 4],
      stages: ['demo', 'slow', 'perform'] }));
  })();
  /* ---- FAMOUS RHYTHMS: general strumming patterns known from the guitar and popular music (NOT the teacher's data).
     Here the timing IS part of the pattern (durations in beats, 1 = a quarter note), so a stroke can be followed by a gap.
     Shown in their own section, marked "general". The teacher's four rhythms above are untouched. ---- */
  const G = (id, ka, en, uka, uen, level, bpm, pat) => ({ id, name: { ka, en }, usage: { ka: uka, en: uen }, level, source: 'general',
    strokes: pat.map(([d, , a]) => S(d === 'D' ? 'down' : 'up', !!a)), timing: { bpm, durations: pat.map(p => p[1]), src: 'general' } });
  const RLV = { 'g-down4': 1, 'g-du8': 1, 'g-waltz': 1, 'g-folk': 2, 'g-pop': 2, 'g-backbeat': 2, 'g-68': 3, 'g-shuffle': 3, 'g-gallop': 3, 'g-16': 4 };
  const COMMON_RHYTHMS = [
    G('g-down4', 'ოთხი ჩაკვრა (4/4)', 'Four downs (4/4)', ['პირველი რითმი ყველა დამწყებისთვის', 'როკი, პოპი'], ['The first rhythm for every beginner', 'Rock, pop'], 1, 70,
      [['D', 1, 1], ['D', 1], ['D', 1], ['D', 1]]),
    G('g-du8', 'ჩაკვრა-ამოკვრა (მერვედები)', 'Down-up eighths', ['ქანქარა: ჩაკვრა თვლაზე, ამოკვრა „და“-ზე'], ['The pendulum: down on the number, up on “and”'], 1, 70,
      [['D', .5, 1], ['U', .5], ['D', .5], ['U', .5], ['D', .5], ['U', .5], ['D', .5], ['U', .5]]),
    G('g-waltz', 'ვალსი (3/4)', 'Waltz (3/4)', ['ვალსი, ნანა, ნელი სიმღერები'], ['Waltz, lullabies, slow songs'], 2, 80,
      [['D', 1, 1], ['D', 1], ['D', 1]]),
    G('g-folk', 'ფოლკი: ↓ ↓↑ ↓ ↓↑', 'Folk: ↓ ↓↑ ↓ ↓↑', ['ფოლკი, კანტრი, საბანაკე სიმღერები'], ['Folk, country, campfire songs'], 2, 76,
      [['D', 1, 1], ['D', .5], ['U', .5], ['D', 1], ['D', .5], ['U', .5]]),
    G('g-pop', 'პოპ-რითმი: ↓ ↓↑ ↑↓↑', 'Pop strum: ↓ ↓↑ ↑↓↑', ['გიტარაზე ყველაზე ცნობილი რითმი — უამრავი პოპ და აკუსტიკური სიმღერა', '3-ზე ხელი ჰაერში ჩადის, სიმს არ ეხება'], ['The best-known guitar strum — countless pop and acoustic songs', 'On 3 the hand goes down in the air without touching'], 3, 80,
      [['D', 1, 1], ['D', .5], ['U', 1], ['U', .5], ['D', .5], ['U', .5]]),
    G('g-backbeat', 'ბექბიტი: აქცენტი 2-ზე და 4-ზე', 'Backbeat: accents on 2 and 4', ['როკი, პოპი — დასარტყამის „სნეარი“ 2-ზე და 4-ზე'], ['Rock, pop — like the snare drum on 2 and 4'], 3, 84,
      [['D', .5], ['U', .5], ['D', .5, 1], ['U', .5], ['D', .5], ['U', .5], ['D', .5, 1], ['U', .5]]),
    G('g-68', 'ბალადა 6/8', '6/8 ballad', ['ნელი ბალადები; ექვსი მერვედი, აქცენტი 1-ზე და 4-ზე'], ['Slow ballads; six eighths, accents on 1 and 4'], 3, 60,
      [['D', .5, 1], ['D', .5], ['U', .5], ['D', .5, 1], ['D', .5], ['U', .5]]),
    G('g-shuffle', 'შაფლი (სვინგი)', 'Shuffle (swing)', ['ბლუზი, ჯაზი, როკ-ენ-როლი: გრძელი ჩაკვრა, მოკლე ამოკვრა'], ['Blues, jazz, rock and roll: long down, short up'], 4, 90,
      [['D', 2 / 3, 1], ['U', 1 / 3], ['D', 2 / 3], ['U', 1 / 3], ['D', 2 / 3, 1], ['U', 1 / 3], ['D', 2 / 3], ['U', 1 / 3]]),
    G('g-gallop', 'გალოპი: ↓ ↓↑', 'Gallop: ↓ ↓↑', ['როკი, კანტრი: „ცხენის თქარუნი“ — მერვედი და ორი მეთექვსმეტედი'], ['Rock, country: the “horse gallop” — an eighth and two sixteenths'], 4, 72,
      [['D', .5, 1], ['D', .25], ['U', .25], ['D', .5, 1], ['D', .25], ['U', .25], ['D', .5, 1], ['D', .25], ['U', .25], ['D', .5, 1], ['D', .25], ['U', .25]]),
    G('g-16', 'მეთექვსმეტედები (ფანკი)', 'Sixteenths (funk)', ['ფანკი, სწრაფი სიმღერები: ↓↑↓↑ ყოველ დარტყმაზე'], ['Funk, fast songs: ↓↑↓↑ on every beat'], 5, 70,
      [['D', .25, 1], ['U', .25], ['D', .25], ['U', .25], ['D', .25, 1], ['U', .25], ['D', .25], ['U', .25], ['D', .25, 1], ['U', .25], ['D', .25], ['U', .25], ['D', .25, 1], ['U', .25], ['D', .25], ['U', .25]])
  ].map(r => Object.assign(r, { level: RLV[r.id] || r.level }, r.id === 'g-68' ? { eighths: true } : {}));
  const RH_KEY = 'rhythms.timing';   // teacher-edited timing overrides (stroke order/accents are never changed here)
  function rhythmsWithTiming(list) { const ov = PD.store.get(RH_KEY, {}); return list.map(r => ov[r.id] && ov[r.id].durations && ov[r.id].durations.length === r.strokes.length ? Object.assign({}, r, { timing: ov[r.id] }) : r); }

  /* ---- SONGS with supplied recordings: chords from the teacher, chart timed to the recording (PD.SONGS) ---- */
  function songLesson(id, title, desc) {
    const S = PD.SONGS && PD.SONGS[id];
    if (!S) return L({ id, type: 'song', title, desc, demo: false, events: [] });
    const R = TEACHER_RHYTHMS.find(r => r.id === S.rhythm) || TEACHER_RHYTHMS[0];
    const per = R.strokes.length, d = 1 / per, ev = [];
    // one beat of the lesson = one rhythm (↓ ↓ ↑). The chord of every rhythm comes from the teacher's cycle.
    const n = S.beats ? S.beats.length - 1 : (S.bars || []).length * S.beatsPerBar;
    for (let r = 0; r < n; r++) {
      const c = S.cycle ? S.cycle[r % S.cycle.length] : S.bars[Math.floor(r / S.beatsPerBar)];
      if (!c || !S.chords[c]) continue;
      const sh = S.chords[c];
      R.strokes.forEach((k, j) => ev.push(...chord(r + j * d, c, sh.frets, sh.fingers, k.direction, d, k.accent, 'strum')));
    }
    const NAMES = { intro: ['შესავალი', 'Intro'], verse: ['მუხლი', 'Verse'], inst: ['ინსტრუმენტული', 'Instrumental'], outro: ['დასასრული', 'Ending'], listen: ['მოუსმინე', 'Listen'] };
    let vn = 0, inn = 0;
    const scale = S.beats ? 1 : S.beatsPerBar;   // new data: sections in rhythms; old data: in bars
    const secs = S.sections.map(([k, a, b]) => {
      const num = k === 'verse' ? ++vn : k === 'inst' ? ++inn : 0, nm = NAMES[k] || NAMES.inst;
      return Object.assign(sec(nm[0] + (num ? ' ' + num : ''), nm[1] + (num ? ' ' + num : ''), a * scale, b * scale), { kind: k });
    });
    return L({ id, type: 'song', level: 1, demo: false, source: 'teacher chords + supplied recording', title, desc, bpm: S.bpm, meter: [S.beatsPerBar, 8], meterLabel: S.meterLabel,
      song: id, stems: S.stems, refOffset: S.beats ? 0 : S.offset, beatMap: S.beats || null, countIn: S.countIn || 0, cycle: S.cycle || null,
      chartSrc: S.chartSrc, rhythm: undefined, songRhythm: R.id, events: ev, sections: secs,
      stages: ['demo', 'technique', 'chords', 'slow', 'perform'], technique: { kind: 'rhythm' }, skills: ['chords', 'strumming', 'accents', 'rhythm'] });
  }
  B.push(songLesson('bani-acharuli', { ka: 'ბანი-აჭარული', en: 'Bani-Acharuli' },
    { ka: 'Dm (2 რითმი) · B♭ (1 რითმი) · C (1 რითმი) — მთელ სიმღერაში მეორდება. რითმი: ჩაკვრა · ჩაკვრა · ამოკვრა (აჭარული). იკვრება ორიგინალ ჩანაწერთან ერთად — ვოკალით ან მის გარეშე.', en: 'Dm (2 rhythms) · B♭ (1 rhythm) · C (1 rhythm), repeated through the whole song. Rhythm: down · down · up (Acharuli). Played along with the original recording — with or without vocals.' }));

  const DEMO = { schema: 'panduri-curriculum', v: 1, meta: { title: { ka: 'სადემონსტრაციო მასალა', en: 'Demo material' }, author: null, verified: false, note: DEMO_NOTE }, lessons: B, paths: PATHS, chords: null };
  const KEY = 'curriculum.package';
  function active() {
    const p = PD.store.get(KEY, null);
    if (p && p.schema === 'panduri-curriculum') return p;
    return DEMO;
  }
  return {
    DEMO_NOTE,
    get isDemo() { return active() === DEMO; },
    get meta() { return active().meta; },
    lessons() { const own = active().lessons, ids = new Set(own.map(l => l.id)); return CORE.filter(l => !ids.has(l.id)).concat(own).map(l => Object.assign({}, l)); },
    paths() { return active().paths || []; },
    /** teacher rhythms (a package may carry its own list; the teacher-supplied four are the default) */
    rhythms() { const a = active(); return rhythmsWithTiming(a.rhythms && a.rhythms.length ? a.rhythms : TEACHER_RHYTHMS); },
    commonRhythms: () => COMMON_RHYTHMS,
    anyRhythm(id) { return PD.curriculum.rhythms().find(r => r.id === id) || COMMON_RHYTHMS.find(r => r.id === id); },
    setRhythmTiming(id, timing) { const ov = PD.store.get(RH_KEY, {}); ov[id] = Object.assign({}, timing, { src: 'teacher' }); PD.store.set(RH_KEY, ov); PD.bus.emit('rhythms'); },
    chords() { const a = active(); return (a.chords && a.chords.length) ? a.chords : library(); },
    get chordsAreDemo() { const a = active(); return !!(a.chords && a.chords.some(c => c.demo)); },
    /** replace the whole curriculum with a teacher package (validated) */
    install(pkg) {
      if (!pkg || pkg.schema !== 'panduri-curriculum' || !Array.isArray(pkg.lessons)) throw new Error('not a panduri-curriculum package');
      pkg.lessons.forEach(l => { if (!l.id || !Array.isArray(l.events)) throw new Error('lesson without id/events'); delete l.demo; });
      PD.store.set(KEY, pkg); PD.bus.emit('curriculum');
    },
    uninstall() { PD.store.del(KEY); PD.bus.emit('curriculum'); },
    /** export the current curriculum (+ the user's own lessons) as a package */
    export(userLessons) { const a = active(); return JSON.stringify({ schema: 'panduri-curriculum', v: 1, meta: Object.assign({}, a.meta, { exported: new Date().toISOString() }), lessons: a.lessons.concat(userLessons || []), paths: a.paths, chords: a.chords || demoChords(), rhythms: rhythmsWithTiming(a.rhythms && a.rhythms.length ? a.rhythms : TEACHER_RHYTHMS) }, null, 1); }
  };
})();
