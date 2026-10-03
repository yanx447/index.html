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
  // The learner's own song: recorded in the app (no notes are invented here)
  B.push(L({ id: 'bani-acharuli', type: 'song', path: 'songs', title: { ka: 'ბანი-აჭარული', en: 'Bani-Acharuli' }, bpm: 120, meter: [6, 8], grid: .5, user: true, builtinUser: true, demo: false, supplied: 'teacher (title + reference link)',
    link: 'https://youtu.be/7kTu3Uai0kw?si=42oTnRz-BTrayIJY', desc: { ka: 'აჭარა · ბანის პარტია. ნოტები შენი დაკვრით იწერება.', en: 'Adjara · bass part. Notes are recorded from your playing.' } }));

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
  const PATHS = [
    { id: 'foundation', level: 'foundation', title: { ka: 'საფუძვლები', en: 'Foundation' }, steps: [
      { kind: 'tour', title: { ka: 'ფანდურის გაცნობა', en: 'Meet the panduri' } },
      NEED('როგორ დავიჭიროთ ფანდური', 'How to hold the panduri'),
      { kind: 'tuner', title: { ka: 'სამი სიმი: აწყობა A · C♯ · E', en: 'Three strings: tuning A · C♯ · E' } },
      { kind: 'lesson', id: 'poc-three' }, { kind: 'lesson', id: 'rh-down' }, { kind: 'lesson', id: 'rh-up' }, { kind: 'lesson', id: 'poc-fret' }, { kind: 'lesson', id: 'poc-rhythm' }] },
    { id: 'beginner', level: 'beginner', title: { ka: 'დამწყები', en: 'Beginner' }, steps: [
      { kind: 'trainer', title: { ka: 'ნოტები და ლადები', en: 'Notes and frets' } }, { kind: 'lesson', id: 'lh-fingers' }, { kind: 'lesson', id: 'm1' }, { kind: 'lesson', id: 'rh-alt' },
      { kind: 'rhythm', id: 'kazbeguri' }, { kind: 'rhythm', id: 'acharuli' }, NEED('მარტივი სიმღერები', 'Simple songs')] },
    { id: 'intermediate', level: 'intermediate', title: { ka: 'საშუალო', en: 'Intermediate' }, steps: [
      { kind: 'lesson', id: 'pos-shift' }, { kind: 'lesson', id: 'r1' }, { kind: 'rhythm', id: 'mtiuluri' }, NEED('ტეხილები', 'Tekhili'), { kind: 'lesson', id: 'm2' }, { kind: 'lesson', id: 'c1' }] },
    { id: 'advanced', level: 'advanced', title: { ka: 'რთული', en: 'Advanced' }, steps: [
      { kind: 'rhythm', id: 'khorumi' }, NEED('სოლო', 'Solo'), NEED('სწრაფი ტექნიკა', 'Fast technique'), NEED('ტრადიციული სტილები', 'Traditional styles'), { kind: 'lesson', id: 'bani-acharuli' }] }
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


  /* chord library (DEMO): pitch content computed from the tuning; the finger numbers are placeholders */
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
  const RH_KEY = 'rhythms.timing';   // teacher-edited timing overrides (stroke order/accents are never changed here)
  function rhythmsWithTiming(list) { const ov = PD.store.get(RH_KEY, {}); return list.map(r => ov[r.id] && ov[r.id].durations && ov[r.id].durations.length === r.strokes.length ? Object.assign({}, r, { timing: ov[r.id] }) : r); }

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
    setRhythmTiming(id, timing) { const ov = PD.store.get(RH_KEY, {}); ov[id] = Object.assign({}, timing, { src: 'teacher' }); PD.store.set(RH_KEY, ov); PD.bus.emit('rhythms'); },
    chords() { const a = active(); return (a.chords && a.chords.length) ? a.chords : demoChords(); },
    get chordsAreDemo() { const a = active(); return !(a.chords && a.chords.length) || a.chords.some(c => c.demo); },
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
