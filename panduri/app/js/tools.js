/* =====================================================================
   Tools: premium tuner, chord explorer, fretboard explorer (+ "find
   this note"), 3D instrument explorer with clickable parts and a guided
   tour. Every tool that opens the microphone closes it when you leave.
   ===================================================================== */
PD.i18n.add({
  'ce.lib': ['აკორდების ბიბლიოთეკა', 'Chord library'],
  'ce.triFing': ['თითები მასწავლებლის Bm-ის მიხედვით: T ცერა — ბანი, 1 საჩვენებელი — მე-2 ხმა, 2 შუა — 1-ლი ხმა. იგივე სამკუთხა ფორმა, სხვა ლადზე.', 'Fingers as the teacher\'s Bm: T thumb — bass, 1 index — 2nd voice, 2 middle — 1st voice. The same triangle shape on another fret.'],
  'ce.thFing': ['დაკეტილი აკორდი მასწავლებლის ხერხით: ცერა — ბანი, საჩვენებელი — მე-2 ხმა, 1-ლი ხმა კი იმავე თითით (თუ იმავე ლადზეა), ერთით ზემოთ შუა თითით, ორით ზემოთ მე-3 თითით.', 'A closed chord the teacher\u2019s way: the thumb takes the bass, the index the 2nd voice, and the 1st voice goes to the same index when it sits on the same fret, to the middle finger one fret above, to the ring finger two frets above.'],
  'ce.thumb': ['ცერა', 'thumb'], 'ce.progT': ['მასწავლებლის', 'the teacher\u2019s'], 'ce.progOwn': ['მასწავლებლის ტონალობებში დაბრუნება', 'Back to the teacher\u2019s own keys'], 'ce.bassMove': ['ბანის მოძრაობა', 'Moving the bass'],
  'ce.bassMoveD': ['მასწავლებლის ხერხი: როცა ბანს მოძრაობა სჭირდება, ცერას ვუტოვებთ ადგილზე და შუა თითს ვამატებთ ორი ლადით ზემოთ, იმავე ბანის სიმზე.', 'The teacher\u2019s way: when the bass needs to move, the thumb stays where it is and the middle finger is added two frets higher on the same bass string.'],
  'ce.bassFrom': ['ბანი ახლა', 'The bass now'], 'ce.bassTo': ['გადაადგილებული ბანი', 'The bass moved'],
  'ce.bassHear': ['მოსმენა: ჯერ ასე, მერე ასე', 'Hear it: first one, then the other'],
  'ce.bassLesson': ['გაკვეთილი: ბანის მოძრაობა', 'Lesson: moving the bass'],
  'ce.bassSrc': ['მასწავლებლის ხერხია, სოლ მინორის მაგალითზე ნაჩვენები. ლადი ცერას პოზიციიდან ორით ზემოთ არის აღებული.', 'The teacher\u2019s technique, shown on his G minor example. The fret is taken two above the thumb\u2019s own.'],  'ce.filters': ['ფილტრები', 'Filters'], 'ce.allRoots': ['ყველა ბგერა', 'all roots'], 'ce.accNotes': ['ბგერები და თითები', 'Notes and fingers'], 'ce.accAbout': ['ამ აკორდის შესახებ', 'About this chord'], 'ce.accChange': ['გადასვლა სხვა აკორდზე', 'Change to another chord'], 'ce.accChangeD': ['აჩვენე და ივარჯიშე', 'Show it and practise'],
  'ce.allCh': ['ყველა აკორდი', 'All chords'], 'ce.h3front': ['წინიდან · სარკეში', 'Front · mirrored'], 'ce.h3player': ['შენი თვალით', 'Your view'], 'ce.h3load': ['3D ხელი იტვირთება…', 'Loading the 3D hand…'], 'ce.h3alt': ['3D-ში ნახე: {p}', 'See it in 3D: {p}'], 'ce.h3none': ['ამ პოზიციისთვის 3D ხელი ზუსტად ვერ დავსვით (ძირითადად მაღალ ლადებზე, სადაც ხელი ფანდურის ტანს ეხება). თითები 2D ხედში ჩანს.', 'The 3D hand could not be placed exactly for this position (mostly high frets, where the hand meets the body). See the fingers in 2D.'], 'ce.h3na': ['3D ხელი ამ ვერსიაში არ ჩაიტვირთა (ფაილი აკლია). 2D ხედი მუშაობს.', 'The 3D hand could not load in this version (file missing). 2D works.'], 'ce.catLead': ['მოძებნე სახელით, აირჩიე კატეგორია ან ბგერა — შეეხე აკორდს და გაიხსნება მისი გვერდი', 'Search by name, pick a category or root — tap a chord to open its page'],
  'ce.sh.none': ['ფორმა ვერ მოიძებნა', 'No form found'], 'ce.sh.noneD': ['ამ წყობით სამ სიმზე დასაკრავი ფორმა არ არსებობს', 'No playable three-string form in this tuning'],
  'ce.noForm': ['ფანდურზე ამ წყობით (A · C♯ · E, 17 ლადი) ხელმისაწვდომი ფორმა ვერ მოიძებნა. ყალბ დიაგრამას არ ვაჩვენებთ.', 'No playable form was found on the panduri in this tuning (A · C♯ · E, 17 frets). We don\'t show a fake diagram.'],
  'ce.sec.all': ['ყველა', 'All'], 'ce.sec.pop': ['პოპულარული', 'Popular'], 'ce.sec.easy': ['დამწყებთათვის', 'Beginner'], 'ce.sec.fav': ['ფავორიტები', 'Favourites'], 'ce.sec.prog': ['თანმიმდევრობები', 'Progressions'],
  'ce.cat.all': ['ყველა', 'All'], 'ce.cat.major': ['მაჟორი', 'Major'], 'ce.cat.minor': ['მინორი', 'Minor'], 'ce.cat.seventh': ['სეპტაკორდები', 'Seventh'], 'ce.cat.sus': ['შეჩერებული (sus)', 'Suspended'], 'ce.cat.ext': ['გაფართოებული (9, 11, 13)', 'Extended'], 'ce.cat.dim': ['შემცირებული', 'Diminished'], 'ce.cat.aug': ['გადიდებული', 'Augmented'], 'ce.cat.other': ['სხვა', 'Other'],
  'ce.fav': ['ფავორიტებში', 'Favourite'], 'ce.favNone': ['ჯერ ფავორიტი არ გაქვს — აკორდის სახელთან ☆ დააჭირე.', 'No favourites yet — tap ☆ next to a chord name.'],
  'ce.progD': ['ცნობილი აკორდების თანმიმდევრობები ნებისმიერ ტონალობაში: მოუსმინე ტარზე ან ივარჯიშე მიკროფონით.', 'Well-known chord progressions in any key: listen on the neck or practise with the microphone.'], 'ce.key': ['ტონალობა', 'Key'], 'ce.listen': ['▶ მოსმენა', '▶ Listen'], 'ce.practise': ['ვარჯიში', 'Practise'],
  'ce.i9': ['ნონა (9)', '9th'], 'ce.i11': ['უნდეციმა (11)', '11th'], 'ce.i13': ['ტერცდეციმა (13)', '13th'],
  'ce.sh.tri': ['სამკუთხა აკორდები', 'Triangle chords'], 'ce.sh.triD': ['განაპირა სიმები ერთ ლადზე, შუა — ერთი ლადით გვერდზე. მაგ. Bm = 2-1-2', 'Outer strings on one fret, the middle one fret beside. E.g. Bm = 2-1-2'],
  'ce.sh.barre': ['გადაკეტილი აკორდები', 'Barre chords'], 'ce.sh.barreD': ['ერთი თითი (1) ერთ ლადზე რამდენიმე სიმს კეტავს. მაგ. B = 2-2-2', 'One finger (1) closes several strings on one fret. E.g. B = 2-2-2'],
  'ce.sh.open': ['ღია სიმებით', 'With open strings'], 'ce.sh.openD': ['ერთი ან მეტი სიმი ღიაა (0)', 'One or more strings are open (0)'],
  'ce.sh.other': ['სხვა ფორმები', 'Other shapes'], 'ce.sh.otherD': ['ყველა დანარჩენი ფორმა', 'All remaining shapes'],
  'tu.title': ['ტიუნერი', 'Tuner'], 'tu.auto': ['ავტო', 'Auto'], 'tu.manual': ['სიმის არჩევა', 'Pick string'],
  'tu.start': ['მიკროფონის ჩართვა', 'Turn on microphone'], 'tu.stop': ['გამორთვა', 'Turn off'],
  'tu.idle': ['დაუკარი ერთი სიმი', 'Pluck one string'], 'tu.inTune': ['✓ აწყობილია', '✓ In tune'], 'tu.up': ['↑ ოდნავ მოუჭირე (ბგერა დაბალია)', '↑ Tighten a little (flat)'],
  'tu.down': ['↓ ოდნავ მოუშვი (ბგერა მაღალია)', '↓ Loosen a little (sharp)'], 'tu.far': ['შორსაა — შეამოწმე, სწორ სიმს უკრავ თუ არა', 'Far off — check you are plucking the right string'],
  'tu.unsure': ['სიგნალი არასტაბილურია — დაუკარი ხმამაღლა, სხვა სიმები დაადუმე', 'Signal unstable — pluck firmly and mute the other strings'],
  'tu.ref': ['საცნობარო ბგერა', 'Reference tone'], 'tu.hist': ['ისტორია (ცენტი)', 'History (cents)'], 'tu.a4': ['A4 = {f} Hz', 'A4 = {f} Hz'],
  'tu.sens': ['მგრძნობელობა', 'Sensitivity'], 'tu.preset': ['აწყობა', 'Tuning'], 'tu.custom': ['საკუთარი აწყობა', 'Custom tuning'], 'tu.addCustom': ['დამატება', 'Add'],
  'tu.customWarn': ['გაკვეთილები სტანდარტულ A · C♯ · E აწყობაზეა დაწერილი. სხვა აწყობით ლადები იგივე დარჩება, ბგერები კი შეიცვლება.', 'Lessons are written for standard A · C♯ · E. In another tuning the frets stay the same but the pitches change.'],
  'tu.name': ['სახელი', 'Name'], 'tu.level': ['შემავალი სიგნალი', 'Input level'], 'tu.locked': ['დაფიქსირდა', 'Locked'],
  'ce.title': ['აკორდები', 'Chords'], 'ce.search': ['მოძებნე აკორდი (A, Bm, …)', 'Search chord (A, Bm, …)'], 'ce.maj': ['მაჟორი', 'Major'], 'ce.min': ['მინორი', 'Minor'],
  'ce.play': ['▶ ჩამოკვრა', '▶ Strum'], 'ce.steps': ['✋ ნაბიჯ-ნაბიჯ', '✋ Step by step'], 'ce.showCh': ['▶ აჩვენე გადასვლა', '▶ Show the change'], 'ce.fStep': ['თითი {f} → {s} · ლადი {n}', 'Finger {f} → {s} · fret {n}'], 'ce.openStep': ['{s} — ღია სიმი, არ ეხები', '{s} — open string, don\'t touch it'], 'ce.allTog': ['ახლა სამივე ერთად', 'Now all three together'], 'ce.stay': ['თითი {f} რჩება ადგილზე', 'Finger {f} stays put'], 'ce.move': ['თითი {f}: {a} → {b}', 'Finger {f}: {a} → {b}'], 'ce.lift': ['თითი {f} იწევს', 'Finger {f} lifts'], 'ce.put': ['თითი {f} ჯდება: {b}', 'Finger {f} goes down: {b}'], 'ce.string': ['▶ {s} სიმი', '▶ {s} string'], 'ce.trans': ['გადასვლის სავარჯიშო', 'Transition exercise'],
  'ce.to': ['მეორე აკორდი', 'Second chord'], 'ce.notes': ['ბგერები', 'Notes'], 'ce.fingers': ['თითები', 'Fingers'], 'ce.barre': ['ბარე', 'barre'],
  'ce.majD': ['A · C♯ · E აწყობა თავად მაჟორული სამხმოვანებაა: ყველა სიმი ერთ ლადზე (ბარე) მაჟორს იძლევა.', 'A · C♯ · E is itself a major triad: all strings on one fret (barre) give a major chord.'],
  'ce.minD': ['მინორი: შუა (C♯) სიმი ერთი ლადით დაბლა — მესამე საფეხური ნახევარი ტონით ეცემა.', 'Minor: the middle (C♯) string one fret lower — the third drops a semitone.'],
  'ce.demo': ['ბგერები ინსტრუმენტის აწყობიდან არის გამოთვლილი. თითების ნომრები სადემონსტრაციოა — მასწავლებლის მიერ არ არის დამოწმებული.', 'Pitches are computed from the instrument tuning. Finger numbers are demo — not verified by the teacher.'],
  'ce.openD': ['ღია სიმები — A მაჟორი.', 'Open strings — A major.'], 'ce.none': ['ვერ მოიძებნა', 'Nothing found'],
  'ce.all': ['ყველა', 'All'], 'ce.root': ['ტონიკა (მთავარი ბგერა)', 'Root'], 'ce.type': ['აკორდის სახე', 'Chord type'], 'ce.pos': ['პოზიცია', 'Position'], 'ce.posN': ['{n} ლადი', 'fret {n}'], 'ce.open': ['ღია', 'open'],
  'ce.computed': ['ბგერები და თითები გამოთვლილია ფანდურის აწყობიდან (A · C♯ · E). მასწავლებელს შეუძლია შეცვალოს Author Studio-ში.', 'Notes and fingers are computed from the tuning (A · C♯ · E). The teacher can change them in Author Studio.'],
  'ce.teacher': ['ეს ფორმა მასწავლებლისაა.', 'This shape is the teacher\'s.'], 'ce.song': ['ამ ფორმით იკვრება „ბანი-აჭარულში“.', 'This shape is used in “Bani-Acharuli”.'],
  'ce.roles': ['ბგერების როლი', 'What each note is'], 'ce.count': ['{n} აკორდი', '{n} chords'],
  'ce.R': ['ტონიკა', 'root'], 'ce.i2': ['სეკუნდა/ნონა', '2nd/9th'], 'ce.i3m': ['პატ. ტერცია', 'minor 3rd'], 'ce.i3': ['დიდი ტერცია', 'major 3rd'], 'ce.i4': ['კვარტა', '4th'], 'ce.i5d': ['შემც. კვინტა', 'dim. 5th'], 'ce.i5': ['კვინტა', '5th'], 'ce.i5a': ['გად. კვინტა', 'aug. 5th'], 'ce.i6': ['სექსტა', '6th'], 'ce.i7m': ['პატ. სეპტიმა', 'minor 7th'], 'ce.i7': ['დიდი სეპტიმა', 'major 7th'],
  'fx.title': ['ტარის მკვლევარი', 'Fretboard explorer'], 'fx.names': ['სახელები', 'Names'], 'fx.ka': ['ქართ.', 'Georgian'], 'fx.oct': ['ოქტავა', 'Octave'], 'fx.none': ['არაფერი', 'None'],
  'fx.scale': ['გამა', 'Scale'], 'fx.root': ['ტონიკა', 'Root'], 'sc.none': ['არა', 'None'], 'sc.major': ['მაჟორი', 'Major'], 'sc.minor': ['ნატურალური მინორი', 'Natural minor'], 'sc.penta': ['მაჟორული პენტატონიკა', 'Major pentatonic'], 'sc.mpenta': ['მინორული პენტატონიკა', 'Minor pentatonic'],
  'fx.cap0': ['{n} — {s} ღიად ჟღერს, მარცხენა ხელი არ იჭერს.', '{n} — {s} rings open; the left hand holds nothing.'],
  'fx.capN': ['{n} — {s}, {f} ლადი, თითი {g} (პირველი პოზიცია: თითო ლადზე თითო თითი).', '{n} — {s}, fret {f}, finger {g} (first position: one finger per fret).'],
  'fx.capHi': ['{n} — {s}, {f} ლადი. მე-4 ლადს ზემოთ ხელი გადაინაცვლებს და 1-ლი თითი ამ ლადზე დგება.', '{n} — {s}, fret {f}. Above the 4th fret the hand shifts and finger 1 stands on this fret.'],
  'fx.same': ['იგივე ბგერა: {p}', 'Same pitch: {p}'], 'fx.find': ['იპოვე ეს ნოტი', 'Find this note'], 'fx.findGo': ['თამაშის დაწყება', 'Start game'], 'fx.findStop': ['დასრულება', 'Stop'],
  'fx.target': ['იპოვე: {n}', 'Find: {n}'], 'fx.exact': ['ზუსტი ოქტავა', 'Exact octave'], 'fx.any': ['ნებისმიერი ოქტავა', 'Any octave'], 'fx.score': ['{a}/{b} · სერია {s}', '{a}/{b} · streak {s}'],
  'fx.right': ['✓ სწორია', '✓ Correct'], 'fx.wrong': ['× ეს არის {n}', '× That is {n}'], 'fx.micHint': ['შეგიძლია ფანდურზეც დაუკრა — მიკროფონი ბგერას შეამოწმებს (სიმს ვერ განსაზღვრავს).', 'You can also play it on the panduri — the mic checks the pitch (it cannot tell which string).'],
  'x3.title': ['ფანდური 3D-ში', 'Panduri in 3D'], 'x3.reset': ['თავდაპირველი ხედი', 'Reset view'], 'x3.rotate': ['ბრუნვა', 'Rotate'], 'x3.labels': ['წარწერები', 'Labels'], 'x3.tour': ['როგორ მუშაობს ფანდური?', 'How does the panduri work?'],
  'x3.tap': ['შეეხე ტარს — ნოტი დაიკვრება. გადაატრიალე თითით/მაუსით, გაადიდე ორი თითით/ბორბლით.', 'Tap the neck to play a note. Drag to rotate, pinch or wheel to zoom.'],
  'x3.note': ['{n} · {s} სიმი · ლადი {f}', '{n} · {s} string · fret {f}'], 'x3.step': ['{a} / {b}', '{a} / {b}'],
  'x3.t0': ['სიმი ირხევა — ის, სადაც თითი აჭერს, ვიბრაციის საწყისი წერტილია. რაც მოკლეა რხევადი ნაწილი, მით მაღალია ბგერა.', 'The string vibrates from where the finger presses it. The shorter the vibrating part, the higher the pitch.'],
  'x3.t9': ['ასე: სიმი → ხიდი → დეკა → ჰაერი ტანში → ხვრელი. ახლა სცადე: შეეხე ნებისმიერ ლადს.', 'So: string → bridge → soundboard → air in the body → sound hole. Now try it: tap any fret.']
});

PD.tools = (() => {
  const TH = PD.theory, LS = PD.lessons, h = PD.h, ic = PD.ic;
  const SCOL = ['', '#D9783F', '#78B7DE', '#EFE0B8'];
  /** run fn(off) and release resources when the route changes */
  function scope() { const offs = []; const un = PD.bus.on('route', () => { offs.forEach(f => { try { f(); } catch (_) {} }); un(); }); return f => offs.push(f); }
  const header = (w, k) => w.append(h('div', { class: 'row' }, [h('button', { class: 'btn small backbtn', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('practice') }), h('h1', { 'data-t': k, style: 'margin:0' })]));

  /* =================== TUNER =================== */
  function tuner(w) {
    const own = scope();
    header(w, 'tu.title');
    let mode = 'auto', sel = 1, hist = [], frames = [], lockT = 0, locked = false, lastP = 0, wasOn = PD.detector.active;
    const box = h('div', { class: 'tuner' });
    const card = h('div', { class: 'card gauge' });
    const svg = h('div', { html: gaugeSVG() });
    const nn = h('div', { class: 'tnote', text: '—', 'aria-live': 'polite' }), rd = h('div', { class: 'tread', text: '— Hz · — ¢' }), msg = h('div', { class: 'tmsg', role: 'status', 'aria-live': 'polite', 'data-t': 'tu.idle' });
    const strs = h('div', { class: 'tstr', role: 'group', 'aria-label': t('tu.manual') });
    const modeSeg = h('div', { class: 'seg', role: 'group' }, [['auto', 'tu.auto'], ['manual', 'tu.manual']].map(([m, k]) => h('button', { 'aria-pressed': String(m === mode), 'data-t': k, onclick: e => { mode = m; modeSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); drawStr(); } })));
    const micBtn = h('button', { class: 'btn primary', html: ic.mic + '<span></span>', onclick: () => { if (PD.detector.active) { PD.detector.stop(); } else PD.practice.micOn(() => upd()); } });
    const lvl = h('div', { class: 'bar', style: 'width:140px', title: t('tu.level') }, [h('i', { style: 'width:0;background:var(--ok)' })]);
    const spark = h('div', { role: 'img', 'aria-label': t('tu.hist') });
    card.append(h('div', { class: 'row', style: 'justify-content:space-between;width:100%' }, [modeSeg, h('div', { class: 'row' }, [h('span', { class: 'muted', style: 'font-size:12px', 'data-t': 'tu.level' }), lvl])]), svg, nn, rd, msg, strs, h('div', { class: 'row' }, [micBtn]),
      h('div', { style: 'width:100%' }, [h('span', { class: 'kicker', 'data-t': 'tu.hist' }), spark]));
    // side panel: reference tones, A4, sensitivity, tunings
    const side = h('div', { style: 'display:flex;flex-direction:column;gap:16px' });
    const refs = h('div', { class: 'row' });
    const a4in = h('input', { type: 'number', min: '415', max: '466', step: '1', value: String(TH.a4()), class: 'input', style: 'width:110px', 'aria-label': 'A4', onchange: e => { const v = Math.max(415, Math.min(466, +e.target.value || 440)); PD.store.set('a4', v); e.target.value = v; drawStr(); } });
    const sens = h('input', { type: 'range', min: '0', max: '100', value: String(PD.detector.calib.sens == null ? 60 : PD.detector.calib.sens), 'aria-label': t('tu.sens'), oninput: e => PD.detector.setCalib({ sens: +e.target.value }) });
    const tsel = h('select', { class: 'input', 'aria-label': t('tu.preset'), onchange: e => { TH.setTuning(e.target.value); drawStr(); } }, TH.TUNINGS.map(x => h('option', { value: x.id, text: PD.i18n.pick(x.name), selected: x.id === TH.tuning.id })));
    side.append(h('div', { class: 'card', style: 'display:flex;flex-direction:column;gap:10px' }, [h('b', { 'data-t': 'tu.ref' }), refs]),
      h('div', { class: 'card', style: 'display:flex;flex-direction:column;gap:10px' }, [h('b', { 'data-t': 'tu.preset' }), tsel, h('p', { class: 'muted', style: 'font-size:12px', 'data-t': 'tu.customWarn' }), h('button', { class: 'btn small', 'data-t': 'tu.custom', onclick: customSheet })]),
      h('div', { class: 'card', style: 'display:flex;flex-direction:column;gap:10px' }, [h('label', { class: 'field' }, [h('span', { text: 'A4 (Hz)' }), a4in]), h('label', { class: 'field' }, [h('span', { 'data-t': 'tu.sens' }), sens])]));
    box.append(card, side); w.append(box);

    function drawStr() {
      strs.innerHTML = ''; refs.innerHTML = '';
      [1, 2, 3].forEach(s => {
        const m = TH.open(s);
        const b = h('button', { 'aria-pressed': String(mode === 'manual' && sel === s), style: 'color:' + SCOL[s] + ';position:relative', html: '<b>' + TH.pcName(m) + '</b><small>' + TH.name(m) + ' · ' + TH.freq(m).toFixed(1) + ' Hz</small>', onclick: () => { mode = 'manual'; sel = s; modeSeg.querySelectorAll('button').forEach((x, i) => x.setAttribute('aria-pressed', String(i === 1))); drawStr(); } });
        strs.appendChild(b);
        refs.appendChild(h('button', { class: 'btn small', text: '▶ ' + TH.pcName(m), onclick: () => { PD.audio.ensure(); PD.audio.tone(m, 2.2); } }));
      });
    }
    function customSheet() {
      PD.ui.sheet((b, close) => {
        const opts = []; for (let m = 50; m <= 72; m++) opts.push(m);
        const sels = [57, 61, 64].map((d, i) => h('select', { class: 'input', 'aria-label': String(i + 1) }, opts.map(m => h('option', { value: String(m), text: TH.name(m), selected: m === TH.tuning.strings[i] }))));
        const nm = h('input', { class: 'input', placeholder: t('tu.name') });
        b.append(h('h2', { 'data-t': 'tu.custom' }), h('p', { class: 'muted', 'data-t': 'tu.customWarn' }), h('div', { class: 'row' }, sels), nm,
          h('div', { class: 'row' }, [h('button', { class: 'btn primary', 'data-t': 'tu.addCustom', onclick: () => {
            const strings = sels.map(s => +s.value), name = nm.value.trim() || strings.map(m => TH.pcName(m)).join(' '), id = 'c' + Date.now().toString(36);
            const tu = { id, name: { ka: name, en: name }, strings }; const all = PD.store.get('tunings.custom', []); all.push(tu); PD.store.set('tunings.custom', all); TH.TUNINGS.push(tu); TH.setTuning(id);
            tsel.appendChild(h('option', { value: id, text: name, selected: true })); drawStr(); close();
          } }), h('button', { class: 'btn', 'data-t': 'cancel', onclick: close })]));
      });
    }
    function gaugeSVG() {
      let ticks = '';
      for (let c = -50; c <= 50; c += 5) { const a = c / 50 * 60 * Math.PI / 180, r1 = c % 25 === 0 ? 118 : 126, x1 = 160 + Math.sin(a) * r1, y1 = 150 - Math.cos(a) * r1, x2 = 160 + Math.sin(a) * 136, y2 = 150 - Math.cos(a) * 136; ticks += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="' + (c === 0 ? '#9AD7AE' : 'rgba(242,232,218,.35)') + '" stroke-width="' + (c % 25 === 0 ? 2 : 1) + '"/>'; }
      const lab = [-50, -25, 0, 25, 50].map(c => { const a = c / 50 * 60 * Math.PI / 180; return '<text x="' + (160 + Math.sin(a) * 104).toFixed(1) + '" y="' + (154 - Math.cos(a) * 104).toFixed(1) + '" fill="rgba(242,232,218,.5)" font-size="10" text-anchor="middle" font-family="Noto Sans Georgian">' + (c > 0 ? '+' : '') + c + '</text>'; }).join('');
      return '<svg viewBox="0 0 320 170" role="img" aria-label="cents"><path d="M' + (160 - Math.sin(Math.PI / 3) * 136).toFixed(1) + ' ' + (150 - Math.cos(Math.PI / 3) * 136).toFixed(1) + ' A136 136 0 0 1 ' + (160 + Math.sin(Math.PI / 3) * 136).toFixed(1) + ' ' + (150 - Math.cos(Math.PI / 3) * 136).toFixed(1) + '" fill="none" stroke="rgba(242,232,218,.12)" stroke-width="10"/><path id="tuOk" d="M' + (160 - Math.sin(5 / 50 * Math.PI / 3) * 136).toFixed(1) + ' ' + (150 - Math.cos(5 / 50 * Math.PI / 3) * 136).toFixed(1) + ' A136 136 0 0 1 ' + (160 + Math.sin(5 / 50 * Math.PI / 3) * 136).toFixed(1) + ' ' + (150 - Math.cos(5 / 50 * Math.PI / 3) * 136).toFixed(1) + '" fill="none" stroke="#3F6B4C" stroke-width="10"/>' + ticks + lab +
        '<g id="tuNeedle" style="transition:transform .12s linear;transform-origin:160px 150px"><line x1="160" y1="150" x2="160" y2="22" stroke="#F2E8DA" stroke-width="2.5" stroke-linecap="round"/></g><circle cx="160" cy="150" r="6" fill="#F2E8DA"/></svg>';
    }
    const needle = () => svg.querySelector('#tuNeedle');
    function setNeedle(c) { const n = needle(); if (n) n.style.transform = 'rotate(' + (Math.max(-50, Math.min(50, c)) / 50 * 60) + 'deg)'; }
    function upd() {
      const on = PD.detector.active;
      micBtn.lastChild.textContent = t(on ? 'tu.stop' : 'tu.start'); micBtn.classList.toggle('primary', !on);
    }
    function onPitch(m) {
      if (!(m.f > 0) || m.conf < .8) return;
      lastP = performance.now();
      frames.push(m.f); if (frames.length > 5) frames.shift();
      const f = frames.slice().sort((a, b) => a - b)[Math.floor(frames.length / 2)], mm = TH.midiOf(f);
      let target;
      if (mode === 'manual') target = TH.open(sel);
      else { target = TH.open(1); let best = 99; [1, 2, 3].forEach(s => { const d = Math.abs(mm - TH.open(s)); if (d < best) { best = d; target = TH.open(s); } }); if (best > 2.5) target = Math.round(mm); }
      const c = (mm - target) * 100;
      nn.textContent = TH.pcName(target); nn.style.color = Math.abs(c) <= 5 ? 'var(--ok)' : Math.abs(c) <= 20 ? 'var(--almost)' : 'var(--fix)';
      rd.textContent = f.toFixed(1) + ' Hz · ' + (c >= 0 ? '+' : '') + c.toFixed(0) + ' ¢ · ' + TH.freq(target).toFixed(1) + ' Hz';
      setNeedle(c);
      const ac = Math.abs(c);
      if (ac <= 5) { if (!lockT) lockT = performance.now(); if (performance.now() - lockT > 600 && !locked) { locked = true; PD.audio.ok && PD.audio.ok(); } }
      else { lockT = 0; locked = false; }
      msg.textContent = locked || ac <= 5 ? t('tu.inTune') + (locked ? ' · ' + t('tu.locked') : '') : ac > 300 ? t('tu.far') : c < 0 ? t('tu.up') : t('tu.down');
      msg.style.color = ac <= 5 ? 'var(--ok)' : ac <= 20 ? 'var(--almost)' : 'var(--fix)';
      strs.querySelectorAll('button').forEach((b, i) => b.classList.toggle('intune', TH.open(i + 1) === target && ac <= 5));
      hist.push(Math.max(-50, Math.min(50, c))); if (hist.length > 120) hist.shift();
      spark.innerHTML = '<svg class="spark" viewBox="0 0 240 46" preserveAspectRatio="none"><line x1="0" x2="240" y1="23" y2="23" stroke="#3F6B4C" stroke-width="1"/><polyline fill="none" stroke="#C98B5B" stroke-width="1.5" points="' + hist.map((v, i) => (i * 2).toFixed(0) + ',' + (23 - v * .44).toFixed(1)).join(' ') + '"/></svg>';
    }
    own(PD.detector.on('pitch', onPitch));
    own(PD.detector.on('note', m => { if (m.unsure && performance.now() - lastP > 700) { msg.textContent = t('tu.unsure'); msg.style.color = 'var(--almost)'; } }));
    own(PD.detector.on('level', m => { lvl.firstChild.style.width = Math.min(100, Math.sqrt(m.rms) * 260) + '%'; }));
    own(PD.detector.on('state', upd));
    own(() => { if (PD.detector.active && !wasOn) PD.detector.stop(); });   // leaving the tuner releases the mic it opened
    drawStr(); upd();
  }

  /* =================== CHORD EXPLORER =================== */
  function chordDiagram(c) {
    // player view: E on top, A at the bottom; frets left → right
    const lo = Math.max(1, Math.min(...c.frets.filter(f => f > 0), 99) === 99 ? 1 : Math.min(...c.frets.filter(f => f > 0))), span = 4, first = lo <= 2 ? 1 : lo;
    const W = 380, H = 170, x0 = 50, x1 = 360, y = s => 140 - (s - 1) * 50, fx = n => x0 + (n - first + 1) * (x1 - x0) / span;
    let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + PD.esc(c.name + ' ' + c.frets.join('-')) + '">';
    s += '<rect x="' + x0 + '" y="' + (y(3) - 14) + '" width="' + (x1 - x0) + '" height="' + (y(1) - y(3) + 28) + '" rx="6" fill="#2A1D14"/>';
    if (first === 1) s += '<rect x="' + (x0 - 4) + '" y="' + (y(3) - 14) + '" width="6" height="' + (y(1) - y(3) + 28) + '" fill="#EFE0B8"/>';
    for (let n = first; n < first + span; n++) s += '<line x1="' + fx(n) + '" x2="' + fx(n) + '" y1="' + (y(3) - 14) + '" y2="' + (y(1) + 14) + '" stroke="#B9B2A6" stroke-width="2"/><text x="' + ((fx(n) + fx(n - 1)) / 2) + '" y="' + (H - 2) + '" fill="rgba(242,232,218,.5)" font-size="11" text-anchor="middle" font-family="Noto Sans Georgian">' + n + '</text>';
    [1, 2, 3].forEach(k => { s += '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + y(k) + '" y2="' + y(k) + '" stroke="' + SCOL[k] + '" stroke-width="' + (4 - k * .6) + '"/><text x="' + (x0 - 20) + '" y="' + (y(k) + 4) + '" fill="' + SCOL[k] + '" font-size="13" text-anchor="middle" font-family="Noto Sans Georgian">' + TH.stringName(k) + '</text>'; });
    if (c.barre && c.frets[0] > 0) { const cx = (fx(c.frets[0]) + fx(c.frets[0] - 1)) / 2 + 8; s += '<rect x="' + (cx - 13) + '" y="' + (y(3) - 13) + '" width="26" height="' + (y(1) - y(3) + 26) + '" rx="13" fill="#E3C2A6"/><text x="' + cx + '" y="' + (y(2) + 5) + '" fill="#140D08" font-size="15" font-weight="700" text-anchor="middle" font-family="Noto Sans Georgian">1</text>'; }
    else c.frets.forEach((f, i) => { const k = i + 1; if (f > 0) { const cx = (fx(f) + fx(f - 1)) / 2 + 8; s += '<circle cx="' + cx + '" cy="' + y(k) + '" r="14" fill="' + SCOL[k] + '"/><text x="' + cx + '" y="' + (y(k) + 5) + '" fill="#140D08" font-size="14" font-weight="700" text-anchor="middle" font-family="Noto Sans Georgian">' + (c.fingers[i] || '') + '</text>'; } else s += '<circle cx="' + (x0 - 2) + '" cy="' + y(k) + '" r="7" fill="none" stroke="' + SCOL[k] + '" stroke-width="2"/>'; });
    return s + '</svg>';
  }
  /** every chord in each shape it can take; cached per tuning */
  let SHC = null;
  function shapeEntries(all, shapeOf) {
    const key = all.length + ':' + (PD.theory._libKey || '');
    if (SHC && SHC.key === key) return SHC.list;
    const TT = PD.theory, out = [];
    all.forEach(c => {
      if (c.none) { out.push({ c, v: c, shape: 'none' }); return; }
      const T = c.q != null ? TT.CHORD_TYPES.find(x => x.k === c.q) : null;
      const vs = (c.root != null && T ? TT.voicings(c.root, T) : []).concat(c.voicings || [c]);
      const best = {};
      vs.forEach(v => { const k = shapeOf(v), p = v.pos != null ? v.pos : Math.min(...v.frets.filter(x => x > 0).concat([0])); const pp = p + (v.frets.some(x => x === 0) ? .5 : 0); if (!best[k] || pp < best[k].p) best[k] = { v, p: pp }; });
      // the chord's own main shape always shows (teacher / song shapes win)
      const own = (c.voicings && c.voicings[0]) || c, ok = shapeOf(own); best[ok] = { v: own, p: -1 };
      Object.keys(best).forEach(k => out.push({ c, v: best[k].v, shape: k }));
    });
    const TI = k => { const i = PD.theory.CHORD_TYPES.findIndex(x => x.k === k); return i < 0 ? 99 : i; };
    out.sort((a, b) => TI(a.c.q) - TI(b.c.q) || ((a.c.root != null ? (a.c.root - 9 + 12) % 12 : 0) - (b.c.root != null ? (b.c.root - 9 + 12) % 12 : 0)));
    SHC = { key, list: out }; return out;
  }
  function chords(w, param) {
    const own = scope(), TT = PD.theory;
    // two screens: the catalogue (no parameter) and ONE chord (parameter = chord id, optionally |frets of a position)
    const [pid, pfr] = param ? String(param).split('|') : [];
    const all = PD.curriculum.chords();
    const isDet = !!(pid && all.some(c => c.id === pid || c.name === pid));
    if (isDet) w.append(h('div', { class: 'row pg-head ce-dhead' }, [h('button', { class: 'btn small backbtn', html: ic.back + '<span data-t="ce.allCh"></span>', onclick: () => PD.app.back('chords') })]));
    else w.append(h('div', { class: 'ce-chead' }, [h('h1', { 'data-t': 'ce.title', style: 'margin:0' }), h('p', { class: 'muted', 'data-t': 'ce.catLead' })]));
    let cur = all.find(c => c.id === pid) || all.find(c => c.name === pid) || all.find(c => c.name === 'Dm') || all[0], vi = 0, q = '', forced = null;
    if (isDet && pfr) { const k = (cur.voicings || []).findIndex(v => v.frets.join('-') === pfr); if (k >= 0) vi = k; else { const fr = pfr.split('-').map(Number); if (fr.length === 3 && fr.every(x => x >= 0 && x <= 17)) { const v0 = (cur.voicings || [])[0]; forced = Object.assign({}, v0 || cur, { frets: fr }); } } }
    /* shape sections: every chord in every shape it can be played in (triangle · barre · with open strings · other) */
    const SH = ['tri', 'barre', 'open', 'other', 'none'];
    const shapeOf = v => { const fr = v.frets; if (fr.every(x => x > 0) && fr[0] === fr[2] && Math.abs(fr[1] - fr[0]) === 1) return 'tri'; if (v.barre || (fr.every(x => x > 0) && fr[0] === fr[1] && fr[1] === fr[2])) return 'barre'; if (fr.some(x => x === 0)) return 'open'; return 'other'; };
    const entries = shapeEntries(all, shapeOf);
    let swapDir = 0, fRoot = PD.store.get('ce.root', -1), fCat = PD.store.get('ce.cat', 'all'), fSec = PD.store.get('ce.sec', 'all');
    const favs = () => PD.store.get('ce.fav', []);
    const POP_ROOTS = [0, 2, 4, 5, 7, 9, 10, 11];
    const popular = c => !c.none && ['', 'm', '7'].includes(c.q) && POP_ROOTS.includes(c.root);
    const easy = c => !c.none && ['', 'm'].includes(c.q) && (c.src === 'teacher' || (c.voicings || []).some(v => Math.max(...v.frets) <= 3));
    const vo = () => forced || (cur.voicings && cur.voicings[vi]) || cur;
    // the same neck and finger markers as the lessons, showing one still chord
    const nv = h('div', { class: 'neckview' }), ncv = h('canvas', { 'aria-label': t('ce.title') }); nv.appendChild(ncv);
    const view = PD.Neck(ncv); view.mirror = PD.store.get('lefty', false);
    let raf = 0; const loop = () => { raf = requestAnimationFrame(loop); if (!document.hidden && !PD.practice.active) view.draw(); };
    requestAnimationFrame(() => { view.layout(); raf = requestAnimationFrame(loop); }); own(() => { cancelAnimationFrame(raf); view.destroy(); });
    const ro = new ResizeObserver(() => { const nh = view.natH(nv.clientWidth) + 'px'; if (nv.style.height !== nh) nv.style.height = nh; view.layout(); preview(); }); ro.observe(nv); own(() => ro.disconnect());
    const preview = () => { const v = vo(); view.setTarget(v.frets.map((f, k) => ({ s: k + 1, f, fi: v.fingers[k] || 0 })), []); };
    const search = h('input', { class: 'input', type: 'search', 'data-t-ph': 'ce.search', 'aria-label': t('ce.search'), oninput: e => { q = e.target.value.trim().toLowerCase().replace('#', '♯'); grid(); } });
    const chipRow = (items, get, set) => h('div', { class: 'ce-chips', role: 'group' }, items.map(([v, label]) => h('button', { class: 'chip', 'aria-pressed': String(get() === v), text: label, onclick: e => { set(v); e.currentTarget.parentNode.querySelectorAll('.chip').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); grid(); } })));
    const rootRow = chipRow([[-1, t('ce.all')]].concat(TT.ROOT_NAMES.map((r, i) => [i, r])), () => fRoot, v => { fRoot = v; PD.store.set('ce.root', v); });
    const typeRow = chipRow(['all', 'major', 'minor', 'seventh', 'sus', 'ext', 'dim', 'aug', 'other'].map(k => [k, t('ce.cat.' + k)]), () => fCat, v => { fCat = v; PD.store.set('ce.cat', v); });
    const secRow = h('div', { class: 'seg ce-sec', role: 'tablist' }, ['all', 'pop', 'easy', 'fav', 'prog'].map(k => h('button', { role: 'tab', 'aria-pressed': String(fSec === k), text: t('ce.sec.' + k), onclick: e => { fSec = k; PD.store.set('ce.sec', k); secRow.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); grid(); } })));
    const count = h('small', { class: 'muted' });
    const g = h('div', { class: 'cgroups' });
    const detail = h('div', { class: 'ce-detail' });
    /** a collapsible block; its open/closed state is remembered */
    const acc = (key, title, sub, body, open0) => { const open = PD.store.get('ce.acc.' + key, !!open0); const d = h('details', { class: 'ce-acc', open: open || null, ontoggle: e => PD.store.set('ce.acc.' + key, e.currentTarget.open) }, [h('summary', {}, [h('span', { class: 'ce-acc-t' }, [h('b', { text: title }), sub ? h('small', { class: 'ce-acc-sub', text: sub }) : null]), h('span', { class: 'ce-acc-chev', 'aria-hidden': 'true' })]), h('div', { class: 'ce-acc-b' }, body)]); return d; };
    const filtSub = h('small', { class: 'ce-acc-sub' });
    const filters = h('details', { class: 'ce-acc ce-filt', open: PD.store.get('ce.acc.filters', false) || null, ontoggle: e => PD.store.set('ce.acc.filters', e.currentTarget.open) }, [h('summary', {}, [h('span', { class: 'ce-acc-t' }, [h('b', { 'data-t': 'ce.filters' }), filtSub]), h('span', { class: 'ce-acc-chev', 'aria-hidden': 'true' })]),
      h('div', { class: 'ce-acc-b' }, [h('span', { class: 'kicker', 'data-t': 'ce.type' }), typeRow, h('span', { class: 'kicker', 'data-t': 'ce.root' }), rootRow])]);
    const left = h('section', { class: 'ce-lib' }, [h('div', { class: 'ce-lib-h' }, [h('h2', { 'data-t': 'ce.lib' }), count]), filters]);
    const top = h('div', { class: 'ce-top' }, [search, secRow]);
    const nameBox = h('div', { class: 'ce-namebox' });
    // a caption under the neck for the step-by-step and change animations
    const cap = h('div', { class: 'ce-cap', 'aria-live': 'polite' }); let animT = [];
    const stopAnim = () => { animT.forEach(clearTimeout); animT = []; cap.textContent = ''; cap.classList.remove('on'); };
    const later = (ms, f) => animT.push(setTimeout(f, ms)); own(stopAnim);
    const say = txt => { cap.textContent = txt; cap.classList.remove('on'); void cap.offsetWidth; cap.classList.add('on'); };
    const placeOf = (v, k) => TT.stringName(k + 1) + (v.frets[k] ? ' ' + v.frets[k] : ' 0');
    /** place the fingers one at a time (barre = one step), then the open strings, then strum */
    function stepByStep(v) {
      stopAnim(); view.setTarget([], []); const groups = {}, order = [], on3 = new Set(); if (H3 && dim === '3d') H3.stepFingers(on3);
      v.frets.forEach((f, k) => { if (f > 0) { const key = (v.fingers[k] || 9) + ':' + f; if (!groups[key]) { groups[key] = []; order.push(key); } groups[key].push(k); } });
      order.sort((a, b) => parseInt(a) - parseInt(b));
      const shown = []; let tm = 300;
      order.forEach(key => { const ks = groups[key]; later(tm, () => { if (H3 && dim === '3d') { ks.forEach(k => { if (v.fingers[k]) on3.add(String(v.fingers[k])); }); H3.stepFingers(new Set(on3)); } ks.forEach(k => shown.push({ s: k + 1, f: v.frets[k], fi: v.fingers[k] || 0 })); view.setTarget(shown.slice(), []); PD.audio.ensure(); ks.forEach(k => { PD.audio.note(k + 1, v.frets[k], { vel: .6 }); view.pluck(k + 1, v.frets[k]); }); say(t('ce.fStep', { f: v.fingers[ks[0]] || '?', s: ks.map(k => TT.stringName(k + 1)).join(' · '), n: v.frets[ks[0]] })); }); tm += 1500; });
      v.frets.forEach((f, k) => { if (f === 0) { later(tm, () => { shown.push({ s: k + 1, f: 0, fi: 0 }); view.setTarget(shown.slice(), []); PD.audio.ensure(); PD.audio.note(k + 1, 0, { vel: .6 }); view.pluck(k + 1, 0); say(t('ce.openStep', { s: TT.stringName(k + 1) })); }); tm += 1300; } });
      later(tm, () => { PD.audio.ensure(); PD.audio.strum(v.frets, 'down', { gap: .03 }); v.frets.forEach((f, k) => view.pluck(k + 1, f)); say(t('ce.allTog')); });
      later(tm + 2600, () => cap.classList.remove('on'));
    }
    /** show the change to another chord: which finger stays, moves, lifts or goes down — twice there and back */
    function showChange(a, b, nameA, nameB) {
      stopAnim(); const fin = v => { const o = {}; v.frets.forEach((f, k) => { if (f > 0 && v.fingers[k]) (o[v.fingers[k]] = o[v.fingers[k]] || []).push(k); }); return o; };
      const desc = (x, y) => { const A = fin(x), B = fin(y), out = []; new Set(Object.keys(A).concat(Object.keys(B))).forEach(f => { const pa = (A[f] || []).map(k => placeOf(x, k)).join('+'), pb = (B[f] || []).map(k => placeOf(y, k)).join('+'); if (!A[f]) out.push(t('ce.put', { f, b: pb })); else if (!B[f]) out.push(t('ce.lift', { f })); else if (pa === pb) out.push(t('ce.stay', { f })); else out.push(t('ce.move', { f, a: pa, b: pb })); }); return out.join(' · '); };
      const pts = v => v.frets.map((f, k) => ({ s: k + 1, f, fi: v.fingers[k] || 0 })), go = (x, nm) => { view.setTarget(pts(x), []); if (H3 && dim === '3d') H3.setChord(x.frets, x.fingers.map(f => f || 0)); PD.audio.ensure(); PD.audio.strum(x.frets, 'down', { gap: .03 }); x.frets.forEach((f, k) => view.pluck(k + 1, f)); };
      let tm = 100; for (let r = 0; r < 2; r++) { later(tm, () => { go(a); say(nameA + ' → ' + nameB + ': ' + desc(a, b)); }); tm += 1800; later(tm, () => { go(b); say(nameB); }); tm += 1800; }
      later(tm, () => { go(a); say(nameA); }); later(tm + 2200, () => cap.classList.remove('on'));
    }
    const acts = h('div', { class: 'ce-acts' }), accs = h('div', { class: 'ce-accs' });
    /* 2D / 3D: the 3D hand (same model and cameras as the teacher's Bm) is loaded only when chosen */
    let dim = PD.store.get('ce.dim', '2d'), H3 = null, h3view = PD.store.get('ce.h3view', 'front');
    const h3stage = h('div', { class: 'h3-stage' }), h3msg = h('p', { class: 'h3-msg', hidden: true }), h3caps = h('ul', { class: 'h3-caps' });
    const h3seg = h('div', { class: 'seg h3-views', role: 'group' }, [['front', 'ce.h3front'], ['player', 'ce.h3player']].map(([k, lk]) => h('button', { 'aria-pressed': String(k === h3view), 'data-k': k, 'data-t': lk, onclick: () => { h3view = k; PD.store.set('ce.h3view', k); h3seg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === k))); if (H3) H3.setView(k); } })));
    const h3box = h('div', { class: 'h3-box', hidden: true }, [h3stage, h3msg, h3caps, h3seg]);
    const dimSeg = h('div', { class: 'seg h3-dim', role: 'group', 'aria-label': '2D / 3D' }, ['2d', '3d'].map(k => h('button', { 'aria-pressed': String(k === dim), 'data-k': k, text: k.toUpperCase(), onclick: () => setDim(k) })));
    const FNAME = { 1: ['საჩვენებელი', 'index'], 2: ['შუა', 'middle'], 3: ['არათითი', 'ring'], 4: ['ნეკი', 'little'], T: ['ცერა', 'thumb'] };
    const SNAME = { 1: ['ბანი (მე-3 სიმი)', 'bass (3rd string)'], 2: ['მე-2 ხმა (მე-2 სიმი)', '2nd voice (2nd string)'], 3: ['1-ლი ხმა (1-ლი სიმი)', '1st voice (1st string)'] };
    const ord = n => PD.i18n.lang === 'en' ? 'fret ' + n : (n === 1 ? '1-ლი' : 'მე-' + n) + ' ლადი', Lk = a => PD.i18n.lang === 'en' ? a[1] : a[0];
    function h3caption(v) { h3caps.innerHTML = ''; v.frets.forEach((f, k) => { const fi = v.fingers[k]; if (!(f > 0 && fi)) return; h3caps.append(h('li', {}, [h('span', { class: 'h3-dot', style: 'background:' + PD.fingers.color(fi) + ';color:' + PD.fingers.ink(fi), text: String(fi) }), h('span', { text: Lk(FNAME[fi] || ['', '']) + ': ' + Lk(SNAME[k + 1]) + ', ' + ord(f) })])); }); v.frets.forEach((f, k) => { if (f === 0) h3caps.append(h('li', { class: 'open' }, [h('span', { class: 'h3-dot o', text: '0' }), h('span', { text: Lk(SNAME[k + 1]) + ' — ' + t('ce.open') })])); }); }
    function upd3d() {
      if (dim !== '3d' || !isDet) return; const v = vo(); h3caption(v);
      if (!H3) { h3msg.hidden = false; h3msg.textContent = t('ce.h3load'); return; }
      const ok = H3.setChord(v.frets, v.fingers.map(f => f || 0)); h3stage.hidden = !ok; h3seg.hidden = !ok; h3msg.hidden = ok;
      if (!ok) { h3msg.innerHTML = ''; h3msg.append(t('ce.h3none'));
        // another position of the same chord that has a 3D hand
        const alt = (cur.voicings || []).map((x, k) => [x, k]).find(([x]) => H3.has(x.frets, x.fingers.map(f => f || 0)));
        if (alt) h3msg.append(h('br'), h('button', { class: 'btn small h3-alt', text: t('ce.h3alt', { p: alt[0].pos ? t('ce.posN', { n: alt[0].pos }) : t('ce.open') }), onclick: () => { vi = alt[1]; forced = null; grid(); show(); } })); }
    }
    function setDim(k) {
      dim = k; PD.store.set('ce.dim', k); dimSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === k)));
      nv.hidden = k === '3d'; h3box.hidden = k !== '3d';
      if (k === '3d' && !H3) {
        h3msg.hidden = false; h3msg.textContent = t('ce.h3load'); h3stage.hidden = true;
        (PD._h3p = PD._h3p || import(new URL('hand3d.js', document.baseURI).href)).then(mod => { if (!h3box.isConnected) return; if (!mod.mount(h3stage)) { h3msg.textContent = t('r3.nogl'); return; } H3 = mod; H3.setView(h3view); upd3d(); }, () => { PD._h3p = null; h3msg.textContent = t('ce.h3na'); });
      } else upd3d();
      if (k === '2d') preview();
    }
    if (isDet) { w.append(h('section', { class: 'ce-hero' }, [nameBox, dimSeg, nv, h3box, cap, acts]), accs); if (dim === '3d') requestAnimationFrame(() => setDim('3d')); } else w.append(top, left, g);
    const norm = x => (x || '').toLowerCase().replace(/#/g, '♯').replace(/([a-g])b/g, '$1♭').replace(/\s+/g, '');
    function match(c) {
      if (fSec === 'pop' && !popular(c)) return false;
      if (fSec === 'easy' && !easy(c)) return false;
      if (fSec === 'fav' && !favs().includes(c.id)) return false;
      if (q) { const n = norm(q); return [c.name, c.alias, c.ka, c.typeKa, c.typeEn].some(x => x && norm(x).includes(n)); }
      if (fRoot >= 0 && c.root !== fRoot) return false;
      return fCat === 'all' || c.cat === fCat || (c.cat == null && fCat === 'major');
    }
    const same = (a, b) => a && b && a.frets.join() === b.frets.join();
    let flat = [];
    function grid() {
      g.innerHTML = ''; flat = [];
      if (fSec === 'prog') { progressions(); return; }
      filtSub.textContent = (fCat === 'all' ? t('ce.cat.all') : t('ce.cat.' + fCat)) + ' · ' + (fRoot < 0 ? t('ce.allRoots') : TT.ROOT_NAMES[fRoot]);
      const list = entries.filter(e => match(e.c));
      count.textContent = t('ce.count', { n: new Set(list.map(e => e.c.id)).size });
      if (!list.length) g.appendChild(h('span', { class: 'muted', text: t(fSec === 'fav' ? 'ce.favNone' : 'ce.none') }));
      SH.forEach(k => {
        const part = list.filter(e => e.shape === k); if (!part.length) return;
        const row = h('div', { class: 'cgrid', role: 'listbox', 'aria-label': t('ce.sh.' + k) });
        part.forEach(e => { flat.push(e); const on = isDet && e.c === cur && same(vo(), e.v); row.appendChild(h('button', { role: 'option', 'aria-selected': String(on), 'aria-pressed': String(on), title: e.v.frets.join('-'), html: PD.esc(e.c.name) + '<small>' + e.v.frets.join('-') + '</small>', onclick: () => { pick(e); } })); });
        const op = PD.store.get('ce.acc.sh.' + k, k !== 'none');
        g.appendChild(h('details', { class: 'csec', open: op || null, ontoggle: e => PD.store.set('ce.acc.sh.' + k, e.currentTarget.open) }, [h('summary', { class: 'csec-h' }, [h('span', { class: 'csec-t' }, [h('b', { text: t('ce.sh.' + k) }), h('small', { text: t('ce.sh.' + k + 'D') })]), h('span', { class: 'csec-n mono', text: String(part.length) }), h('span', { class: 'ce-acc-chev', 'aria-hidden': 'true' })]), row]));
      });
    }
    /* progressions: common sequences in any key, played on the neck, or practised with the microphone */
    const PROG = PROGRESSIONS;
    let pKey = PD.store.get('ce.pkey', 9), tKey = PD.store.get('ce.ptkey', false);
    function progressions() {
      const keyRow = h('div', { class: 'ce-chips', role: 'group' }, TT.ROOT_NAMES.map((r, i) => h('button', { class: 'chip', 'aria-pressed': String(i === pKey), text: r, onclick: () => { pKey = i; tKey = true; PD.store.set('ce.pkey', i); PD.store.set('ce.ptkey', true); grid(); } })));
      g.append(h('p', { class: 'muted', text: t('ce.progD') }), h('span', { class: 'kicker', text: t('ce.key') }), keyRow,
        tKey ? h('button', { class: 'btn small ghost', text: t('ce.progOwn'), onclick: () => { tKey = false; PD.store.set('ce.ptkey', false); grid(); } }) : null);
      const find = (root, k) => all.find(c => c.root === root && c.q === k && !c.none);
      PROG.forEach(P => {
        const root = P.src === 'teacher' && !tKey ? P.key : pKey;
        const cs = P.deg.map(([d, k]) => find((root + d) % 12, k)).filter(Boolean); if (cs.length !== P.deg.length) return;
        // in a flat key his chords are written with flats, as he writes them
        const flat = TT.prefersFlat(root, P.deg[0][1] || '');
        const names = cs.map(c => (flat && c.alias) ? c.alias : c.name).join(' → ');
        let tm = [];
        const play = () => { tm.forEach(clearTimeout); tm = []; cs.forEach((c, i) => tm.push(setTimeout(() => { const v = (c.voicings && c.voicings[0]) || c; cur = c; vi = 0; forced = null; show(); PD.audio.ensure(); PD.audio.strum(v.frets, 'down', { gap: .03 }); v.frets.forEach((f, k) => view.pluck(k + 1, f)); }, i * 1100))); };
        own(() => tm.forEach(clearTimeout));
        g.append(h('div', { class: 'card ce-prog' }, [h('div', { class: 'row', style: 'justify-content:space-between' }, [h('b', { text: PD.i18n.pick({ ka: P.ka, en: P.en }) }), P.src === 'teacher' ? h('span', { class: 'chip tiny', text: t('ce.progT') }) : h('span', { class: 'mono muted', text: P.id })]), h('div', { class: 'ce-prog-n', text: names }),
          h('div', { class: 'row' }, [h('button', { class: 'btn small primary', text: t('ce.listen'), onclick: play }), h('button', { class: 'btn small', text: t('ce.practise'), onclick: () => PD.practice.open(LS.progression(cs.map(c => Object.assign({}, c, (c.voicings && c.voicings[0]) || c)), 60, { ka: names, en: names }), { wait: true, tempo: 1, mode: 'learn' }, null, null) })])]));
      });
      count.textContent = '';
    }
    function pick(e) { if (!isDet) return PD.app.go('chords', e.c.id + '|' + e.v.frets.join('-'));
      cur = e.c; const k = (cur.voicings || []).findIndex(x => same(x, e.v)); if (k >= 0) { vi = k; forced = null; } else { vi = 0; forced = e.v; } grid(); show(); }
    const ROLE = { 0: 'ce.R', 1: 'ce.i2', 2: 'ce.i2', 3: 'ce.i3m', 4: 'ce.i3', 5: 'ce.i4', 6: 'ce.i5d', 7: 'ce.i5', 8: 'ce.i5a', 9: 'ce.i6', 10: 'ce.i7m', 11: 'ce.i7' };
    function show() {
      if (typeof stopAnim === 'function') stopAnim();
      detail.innerHTML = '';
      if (cur.none) { nameBox.innerHTML = ''; nameBox.append(h('div', { class: 'ce-nb' }, [h('span'), h('div', { class: 'ce-name' }, [h('h2', { text: cur.name }), h('small', { text: [cur.alias, cur.ka].filter(Boolean).join(' · ') })]), h('span')])); acts.innerHTML = ''; acts.append(h('p', { class: 'notice', text: t('ce.noForm') })); accs.innerHTML = ''; view.setTarget([], []); return; }
      const v = vo(), ms = v.frets.map((f, i) => TT.midi(i + 1, f)), T = TT.CHORD_TYPES.find(x => x.k === cur.q), EXT = ['9', 'maj9', 'm9', '11', '13', 'add9', 'm(add9)'].includes(cur.q);
      const q0 = cur.q != null ? cur.q : cur.kind === 'min' ? 'm' : '', nm = m => cur.root != null ? TT.spell(m, cur.root, q0).name : TT.name(m), nmKa = m => cur.root != null ? TT.spell(m, cur.root, q0).ka : TT.nameKa(m);   // spelled from the root letter
      const list = all.filter(match), i = Math.max(0, list.indexOf(cur));
      const other = h('select', { class: 'input', 'aria-label': t('ce.to') }, all.filter(c => c !== cur && (c.q === '' || c.q === 'm' || c.q == null)).map(c => h('option', { value: c.id, text: c.name })));
      const posSeg = cur.voicings && cur.voicings.length > 1 ? h('div', { class: 'seg', role: 'group', 'aria-label': t('ce.pos') }, cur.voicings.map((x, k) => h('button', { 'aria-pressed': String(!forced && k === vi), text: x.pos ? t('ce.posN', { n: x.pos }) : t('ce.open'), onclick: () => { vi = k; forced = null; grid(); show(); } }))) : null;
      const src = cur.src === 'teacher' && vi === 0 ? 'ce.teacher' : cur.src === 'song' && vi === 0 ? 'ce.song' : cur.demo ? 'ce.demo' : 'ce.computed';
      const go = d => { swapDir = d; const j = flat.findIndex(e => e.c === cur && same(e.v, vo())); const e = flat[(j + d + flat.length) % flat.length]; if (e) pick(e); };
      const isFav = favs().includes(cur.id);
      nameBox.innerHTML = '';
      nameBox.append(h('div', { class: 'ce-nb' }, [
        h('button', { class: 'btn icon small ce-nav', 'aria-label': t('prev'), text: '‹', onclick: () => go(-1) }),
        h('div', { class: 'ce-name' }, [h('h2', { text: cur.name }), h('small', { text: [cur.alias, cur.ka].filter(Boolean).join(' · ') }), h('span', { class: 'ce-frets mono', text: v.frets.join(' · ') })]),
        h('button', { class: 'btn icon small ce-nav', 'aria-label': t('next'), text: '›', onclick: () => go(1) })]),
        h('button', { class: 'btn icon small ce-fav' + (isFav ? ' on' : ''), 'aria-label': t('ce.fav'), 'aria-pressed': String(isFav), text: isFav ? '★' : '☆', onclick: e => { const f = favs(), i = f.indexOf(cur.id); if (i >= 0) f.splice(i, 1); else f.push(cur.id); PD.store.set('ce.fav', f); e.currentTarget.textContent = i >= 0 ? '☆' : '★'; e.currentTarget.classList.toggle('on', i < 0); if (fSec === 'fav') grid(); } }));
      const strum = () => { PD.audio.ensure(); PD.audio.strum(v.frets, 'down', { gap: .03 }); v.frets.forEach((f, k) => view.pluck(k + 1, f)); };
      acts.innerHTML = '';
      acts.append(...[h('div', { class: 'ce-acts-row' }, [h('button', { class: 'btn primary ce-play', text: t('ce.play'), onclick: strum }),
        h('div', { class: 'ce-strs', role: 'group', 'aria-label': t('ce.roles') }, [1, 2, 3].map(sn => h('button', { class: 'ce-str', style: '--c:' + SCOL[sn], 'aria-label': t('ce.string', { s: TT.stringName(sn) }), text: TT.stringName(sn), onclick: () => { PD.audio.ensure(); PD.audio.note(sn, v.frets[sn - 1]); view.pluck(sn, v.frets[sn - 1]); } }))),
        h('button', { class: 'btn ce-stepb', text: t('ce.steps'), onclick: () => stepByStep(v) })]), posSeg ? h('div', { class: 'ce-pos' }, [h('small', { class: 'kicker', 'data-t': 'ce.pos' }), posSeg]) : null].filter(Boolean));
      const roles = h('div', { class: 'ce-rl' }, ms.map((m, k) => {
        const iv = cur.root != null ? ((TT.pc(m) - cur.root) % 12 + 12) % 12 : null, role = iv == null ? null : EXT && iv === 2 ? 'ce.i9' : cur.q === '11' && iv === 5 ? 'ce.i11' : cur.q === '13' && iv === 9 ? 'ce.i13' : ROLE[iv];
        return h('div', { class: 'ce-r', style: '--c:' + SCOL[k + 1] }, [h('small', { text: TT.stringName(k + 1) + ' · ' + (v.frets[k] ? t('ce.posN', { n: v.frets[k] }) : t('ce.open')) }), h('b', { text: nm(m) }), h('span', { text: nmKa(m) + (role ? ' · ' + t(role) : '') })]);
      }));
      const fingTxt = v.fingers.map(f => f || '0').join(' · ') + (v.barre ? ' · ' + t('ce.barre') : '');
      /** the teacher's bass movement: the thumb stays, the middle finger is added two frets up on the bass string */
      function bassMoveAcc(vv) {
        const f0 = vv.frets[0];
        if (vv.fingers[0] !== 'T' || !(f0 > 0) || f0 + 2 > TT.FRETS) return null;
        const f1 = f0 + 2, m0 = Math.round(TT.midi(1, f0)), m1 = Math.round(TT.midi(1, f1));
        const row = (lab, fr, fi, m) => h('div', { class: 'ce-bm-row' }, [h('small', { text: lab }), h('b', { text: nm(m) }),
          h('span', { class: 'muted', text: t('ce.posN', { n: fr }) + ' · ' + (fi === 'T' ? t('ce.thumb') : fi) })]);
        const play = shape => { PD.audio.ensure(); [1, 2, 3].forEach((sn, k) => PD.audio.note(sn, shape[k], { vel: .7, when: PD.audio.now() + k * .02 })); };
        const hear = h('button', { class: 'btn small', text: t('ce.bassHear'), onclick: () => {
          play(vv.frets); setTimeout(() => play([f1, vv.frets[1], vv.frets[2]]), 900);
        } });
        const les = PD.lessons && PD.lessons.get && PD.lessons.get('bass-move')
          ? h('button', { class: 'btn small ghost', text: t('ce.bassLesson'), onclick: () => PD.app.go('lesson', 'bass-move') }) : null;
        return acc('bassmove', t('ce.bassMove'), nm(m0) + ' → ' + nm(m1), [
          h('p', { class: 'fg2', text: t('ce.bassMoveD') }),
          row(t('ce.bassFrom'), f0, 'T', m0), row(t('ce.bassTo'), f1, 2, m1),
          h('div', { class: 'row' }, [hear, les].filter(Boolean)),
          h('p', { class: 'notice', text: t('ce.bassSrc') })]);
      }
      const about = T ? PD.i18n.pick({ ka: T.d[0], en: T.d[1] }) : v.frets.every(f => f === 0) ? t('ce.openD') : cur.kind === 'maj' ? t('ce.majD') : t('ce.minD');
      accs.innerHTML = '';
      accs.append(
        acc('notes', t('ce.accNotes'), ms.map(nm).join(' · ') + ' — ' + t('ce.fingers') + ' ' + fingTxt, [h('span', { class: 'kicker', 'data-t': 'ce.roles' }), roles, h('div', { class: 'kv' }, [h('span', { text: t('ce.fingers') }), h('b', { text: fingTxt })])], true),
        acc('about', t('ce.accAbout'), cur.cat ? t('ce.cat.' + cur.cat) : '', [h('p', { class: 'fg2', text: about }), v.fsrc === 'teacher-bm' ? h('p', { class: 'notice', text: t('ce.triFing') }) : v.fsrc === 'teacher-thumb' ? h('p', { class: 'notice', text: t('ce.thFing') }) : null, h('p', { class: 'notice', text: t(src) })]),
        bassMoveAcc(v),
        acc('change', t('ce.accChange'), t('ce.accChangeD'), [h('label', { class: 'field' }, [h('span', { text: t('ce.to') }), other]), h('div', { class: 'row' }, [h('button', { class: 'btn small', text: t('ce.showCh'), onclick: () => { const b = all.find(c => c.id === other.value); if (b) showChange(v, (b.voicings && b.voicings[0]) || b, cur.name, b.name); } }), h('button', { class: 'btn small', text: t('ce.trans'), onclick: () => { const b = all.find(c => c.id === other.value); PD.practice.open(LS.transition(Object.assign({}, cur, vo()), b, 60), { wait: true, tempo: 1, mode: 'learn' }, null, null); } })])]));
      if (PD.motion && nameBox.dataset.shown) PD.motion.swap(nameBox.querySelector('.ce-name'), swapDir); nameBox.dataset.shown = '1'; swapDir = 0;
      { const sel = g.querySelector('[aria-pressed="true"]'), row = sel && sel.parentNode; if (sel) requestAnimationFrame(() => { row.scrollLeft = Math.max(0, sel.offsetLeft - row.offsetLeft - (row.clientWidth - sel.offsetWidth) / 2); }); }
      preview(); upd3d();
    }
    grid(); show();
  }

  /* =================== FRETBOARD EXPLORER =================== */
  const SCALES = { none: [], major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], penta: [0, 2, 4, 7, 9], mpenta: [0, 3, 5, 7, 10] };
  function fretboard(w) {
    const own = scope();
    header(w, 'fx.title');
    let label = 'names', scale = 'none', root = 9, sel = null, game = null, wasOn = PD.detector.active;
    const seg = (items, get, set) => { const s = h('div', { class: 'seg', role: 'group' }, items.map(([v, k]) => h('button', { 'aria-pressed': String(get() === v), 'data-t': k, onclick: e => { set(v); s.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); draw(); } }))); return s; };
    const rootSel = h('select', { class: 'input', 'aria-label': t('fx.root'), onchange: e => { root = +e.target.value; draw(); } }, TH.NN.map((n, i) => h('option', { value: String(i), text: n + ' · ' + TH.NN_KA[i], selected: i === root })));
    const scSel = h('select', { class: 'input', 'aria-label': t('fx.scale'), onchange: e => { scale = e.target.value; draw(); } }, Object.keys(SCALES).map(k => h('option', { value: k, 'data-t': 'sc.' + k, text: t('sc.' + k) })));
    const fb = h('div', { class: 'fb card', style: 'padding:10px' });
    const info = h('p', { class: 'fg2', role: 'status', 'aria-live': 'polite' });
    const gameBox = h('div', { class: 'card', style: 'display:flex;flex-direction:column;gap:10px' });
    w.append(h('div', { class: 'row' }, [seg([['names', 'fx.names'], ['ka', 'fx.ka'], ['oct', 'fx.oct'], ['none', 'fx.none']], () => label, v => label = v), h('label', { class: 'field', style: 'flex-direction:row;align-items:center' }, [h('span', { 'data-t': 'fx.scale' }), scSel]), h('label', { class: 'field', style: 'flex-direction:row;align-items:center' }, [h('span', { 'data-t': 'fx.root' }), rootSel])]), fb, info);
    // the 3D hand for the note that is tapped: every place on the neck has one
    const h3 = PD.shapes && PD.shapes.handBox ? PD.shapes.handBox({ cls: 'fx-3d' }) : null;
    const h3cap = h('p', { class: 'sh-cap muted' });
    if (h3) w.append(h3.box, h3cap);
    w.append(gameBox);

    function draw() {
      const W = 980, H = 190, x0 = 46, x1 = 960, k = (x1 - x0) / TH.fretFrac(TH.FRETS), fx = n => x0 + k * TH.fretFrac(n), yS = s => 150 - (s - 1) * 55;
      const cx = n => n === 0 ? x0 - 22 : (fx(n) + fx(n - 1)) / 2;
      let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="grid" aria-label="' + PD.esc(t('fx.title')) + '"><rect x="' + x0 + '" y="' + (yS(3) - 22) + '" width="' + (x1 - x0) + '" height="' + (yS(1) - yS(3) + 44) + '" rx="6" fill="#2A1D14"/>';
      PD.instrument.profile.markers.single.forEach(n => { s += '<circle cx="' + cx(n) + '" cy="' + ((yS(1) + yS(3)) / 2) + '" r="5" fill="rgba(239,224,184,.25)"/>'; });
      PD.instrument.profile.markers.double.forEach(n => { s += '<circle cx="' + cx(n) + '" cy="' + (yS(2) - 27) + '" r="5" fill="rgba(239,224,184,.25)"/><circle cx="' + cx(n) + '" cy="' + (yS(2) + 27) + '" r="5" fill="rgba(239,224,184,.25)"/>'; });
      s += '<rect x="' + (x0 - 4) + '" y="' + (yS(3) - 22) + '" width="6" height="' + (yS(1) - yS(3) + 44) + '" fill="#EFE0B8"/>';
      for (let n = 1; n <= TH.FRETS; n++) s += '<line x1="' + fx(n) + '" x2="' + fx(n) + '" y1="' + (yS(3) - 22) + '" y2="' + (yS(1) + 22) + '" stroke="#B9B2A6" stroke-width="2"/><text x="' + cx(n) + '" y="' + (H - 4) + '" fill="rgba(242,232,218,.45)" font-size="11" text-anchor="middle" font-family="Noto Sans Georgian">' + n + '</text>';
      [1, 2, 3].forEach(st => { s += '<line x1="' + (x0 - 30) + '" x2="' + x1 + '" y1="' + yS(st) + '" y2="' + yS(st) + '" stroke="' + SCOL[st] + '" stroke-width="' + (3.4 - st * .5) + '" opacity=".85"/>'; });
      const scl = SCALES[scale], selM = sel ? TH.midi(sel.s, sel.f) : null;
      [1, 2, 3].forEach(st => { for (let f = 0; f <= TH.FRETS; f++) {
        const m = TH.midi(st, f), pc = TH.pc(m), inScale = scl.length && scl.includes((pc - root + 12) % 12), isRoot = scl.length && pc === root;
        const same = selM != null && m === selM, isSel = sel && sel.s === st && sel.f === f;
        const fill = isSel ? SCOL[st] : same ? 'rgba(201,139,91,.85)' : isRoot ? '#C98B5B' : inScale ? 'rgba(242,232,218,.85)' : 'rgba(20,14,10,.75)';
        const txt = label === 'names' ? TH.pcName(m) : label === 'ka' ? TH.nameKa(m) : label === 'oct' ? TH.name(m) : '';
        const show = label !== 'none' || inScale || same || isSel;
        if (show) s += '<g class="cell" data-s="' + st + '" data-f="' + f + '" role="button" tabindex="0" aria-label="' + PD.esc(TH.name(m) + ' ' + TH.stringName(st) + ' ' + f) + '"><circle cx="' + cx(f) + '" cy="' + yS(st) + '" r="15" fill="' + fill + '" stroke="' + (inScale || isSel || same ? 'none' : 'rgba(242,232,218,.2)') + '"/>' + (txt ? '<text x="' + cx(f) + '" y="' + (yS(st) + 4) + '" fill="' + (inScale || isRoot || isSel || same ? '#140D08' : '#F2E8DA') + '" font-size="' + (txt.length > 3 ? 9 : 11) + '" text-anchor="middle" font-family="Noto Sans Georgian" pointer-events="none">' + PD.esc(txt) + '</text>' : '') + (isRoot ? '<circle cx="' + cx(f) + '" cy="' + yS(st) + '" r="18" fill="none" stroke="#C98B5B" stroke-width="1.5"/>' : '') + '</g>';
        else s += '<g class="cell" data-s="' + st + '" data-f="' + f + '" role="button" tabindex="0" aria-label="' + PD.esc(TH.stringName(st) + ' ' + f) + '"><rect x="' + (cx(f) - 15) + '" y="' + (yS(st) - 15) + '" width="30" height="30" fill="transparent"/></g>';
      } });
      fb.innerHTML = s + '</svg>';
    }
    function show3d(s, f, m) {
      if (!h3) return;
      const g = PD.shapes.noteFinger(f), fr = [0, 0, 0], fg = [0, 0, 0];
      fr[s - 1] = f; fg[s - 1] = g;
      h3.set(fr, fg);
      h3cap.textContent = f === 0
        ? t('fx.cap0', { n: TH.pcName(m), s: TH.stringName(s) })
        : t(f <= 4 ? 'fx.capN' : 'fx.capHi', { n: TH.pcName(m), s: TH.stringName(s), f: f, g: g });
    }
    // keyboard and TV remote: every cell is a button (Enter / Space / OK)
    fb.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest && e.target.closest('.cell')) { e.preventDefault(); e.target.closest('.cell').dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
    fb.addEventListener('click', e => {
      const c = e.target.closest('.cell'); if (!c) return;
      const s = +c.dataset.s, f = +c.dataset.f, m = TH.midi(s, f), kb = document.activeElement === c;
      const refocus = () => { if (kb) { const n = fb.querySelector('.cell[data-s="' + s + '"][data-f="' + f + '"]'); if (n) n.focus({ preventScroll: true }); } };
      setTimeout(refocus, 0);
      PD.audio.ensure(); PD.audio.note(s, f, { vel: .7 });
      if (game) return guess(m, s, f);
      sel = { s, f }; draw();
      info.textContent = TH.name(m) + ' · ' + TH.nameKa(m) + ' · ' + TH.freq(m).toFixed(1) + ' Hz — ' + t('fx.same', { p: TH.positions(m).map(p => TH.stringName(p.s) + ' ' + p.f).join(', ') });
      show3d(s, f, m);
    });
    /* ---- Find this note ---- */
    let exact = false;
    function gameUI() {
      gameBox.innerHTML = '';
      gameBox.append(h('b', { 'data-t': 'fx.find', text: t('fx.find') }));
      if (!game) {
        const ex = h('div', { class: 'seg', role: 'group' }, [[false, 'fx.any'], [true, 'fx.exact']].map(([v, k]) => h('button', { 'aria-pressed': String(exact === v), text: t(k), onclick: e => { exact = v; ex.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); } })));
        gameBox.append(ex, h('p', { class: 'muted', style: 'font-size:13px', text: t('fx.micHint') }), h('div', { class: 'row' }, [h('button', { class: 'btn primary', text: t('fx.findGo'), onclick: () => { game = { ok: 0, n: 0, streak: 0 }; nextTarget(); gameUI(); } }), h('button', { class: 'btn', html: ic.mic + '<span>' + PD.esc(t(PD.detector.active ? 'mic.on' : 'mic.off')) + '</span>', onclick: () => { if (PD.detector.active) PD.detector.stop(); else PD.practice.micOn(() => gameUI()); gameUI(); } })]));
        return;
      }
      gameBox.append(h('div', { class: 'tnote', style: 'font-size:48px', text: exact ? TH.name(game.target) : TH.pcName(game.target) + ' · ' + TH.nameKa(game.target) }),
        h('div', { class: 'tmsg', role: 'status', 'aria-live': 'polite', id: 'fxMsg' }), h('div', { class: 'mono muted', text: t('fx.score', { a: game.ok, b: game.n, s: game.streak }) }),
        h('div', { class: 'row' }, [h('button', { class: 'btn small', text: '▶', 'aria-label': t('tu.ref'), onclick: () => PD.audio.tone(game.target, 1.2) }), h('button', { class: 'btn small', text: t('skip'), onclick: () => { nextTarget(); gameUI(); } }), h('button', { class: 'btn small', text: t('fx.findStop'), onclick: () => { game = null; gameUI(); draw(); } })]));
    }
    function nextTarget() { let m; do { m = TH.midi(1 + (Math.random() * 3 | 0), Math.random() * 18 | 0); } while (game.target === m); game.target = m; sel = null; draw(); }
    function guess(m, s, f, fromMic) {
      const ok = exact ? Math.round(m) === game.target : TH.pc(m) === TH.pc(game.target);
      game.n++; if (ok) { game.ok++; game.streak++; } else game.streak = 0;
      const msgText = ok ? t('fx.right') : t('fx.wrong', { n: exact ? TH.name(m) : TH.pcName(m) });
      sel = s ? { s, f } : null; draw();
      if (ok) { setTimeout(() => { if (game) { nextTarget(); gameUI(); } }, 700); }
      gameUI(); const el = document.getElementById('fxMsg'); if (el) { el.textContent = msgText; el.style.color = ok ? 'var(--ok)' : 'var(--fix)'; }
    }
    own(PD.detector.on('note', m => { if (!game) return; const el = document.getElementById('fxMsg'); if (m.unsure || m.conf < .7) { if (el) { el.textContent = t('h.unsure'); el.style.color = 'var(--almost)'; } return; } guess(m.midi, null, null, true); }));
    own(() => { if (PD.detector.active && !wasOn) PD.detector.stop(); });
    draw(); gameUI();
  }

  /* =================== 3D EXPLORER + TOUR =================== */
  /** chord progressions: the teacher's own, and the ones every learner meets */
  const PROGRESSIONS = [
      { id: 'I-IV-V-I', ka: 'კლასიკური', en: 'Classic', deg: [[0, ''], [5, ''], [7, ''], [0, '']] },
      { id: 'I-V-vi-IV', ka: 'პოპი', en: 'Pop', deg: [[0, ''], [7, ''], [9, 'm'], [5, '']] },
      { id: 'I-vi-IV-V', ka: '50-იანების', en: '50s', deg: [[0, ''], [9, 'm'], [5, ''], [7, '']] },
      { id: 'ii-V-I', ka: 'ჯაზური', en: 'Jazz ii–V–I', deg: [[2, 'm7'], [7, '7'], [0, 'maj7']] },
      { id: 'i-iv-v-i', ka: 'მინორული', en: 'Minor', deg: [[0, 'm'], [5, 'm'], [7, 'm'], [0, 'm']] },
      { id: 'i-VI-III-VII', ka: 'მინორული პოპი', en: 'Minor pop', deg: [[0, 'm'], [8, ''], [3, ''], [10, '']] },
      { id: 'i-VII-VI-VII', ka: 'ხალხური ფერი', en: 'Folk colour', deg: [[0, 'm'], [10, ''], [8, ''], [10, '']] },
      { id: 'i-iv-V-i', ka: 'ჰარმონიული მინორი', en: 'Harmonic minor', deg: [[0, 'm'], [5, 'm'], [7, '7'], [0, 'm']] },
      /* ---- the teacher's own progressions: what he says is played on the panduri, in Georgian songs and dance
         melodies (Mtiuluri, Acharuli and the rest). The key beside each one is the key he named them in. ---- */
      { id: 'Am–Em–F–G', ka: 'ქართული მოძრაობა', en: 'Georgian turn', deg: [[0, 'm'], [7, 'm'], [8, ''], [10, '']], key: 9, src: 'teacher' },
      { id: 'Gm–C', ka: 'ორი აკორდი', en: 'Two chords', deg: [[0, 'm'], [5, '']], key: 7, src: 'teacher' },
      { id: 'Cm–Gm–Dm–E♭m–F–Gm', ka: 'გრძელი მოძრაობა', en: 'The long turn', deg: [[0, 'm'], [7, 'm'], [2, 'm'], [3, 'm'], [5, ''], [7, 'm']], key: 0, src: 'teacher' },
      { id: 'C♯m–B–A', ka: 'ღია ლაზე დაბრუნება', en: 'Down to the open A', deg: [[0, 'm'], [10, ''], [8, '']], key: 1, src: 'teacher' },
      { id: 'Cm–B♭–E♭–B♭–Cm', ka: 'წრე მინორში', en: 'A circle in minor', deg: [[0, 'm'], [10, ''], [3, ''], [10, ''], [0, 'm']], key: 0, src: 'teacher' },
      { id: 'Cm–Fm–Cm–B♭–E♭–Bm–Cm', ka: 'სრული წრე', en: 'The full circle', deg: [[0, 'm'], [5, 'm'], [0, 'm'], [10, ''], [3, ''], [11, 'm'], [0, 'm']], key: 0, src: 'teacher' }
  ];
  function explore(w, param) {
    const own = scope(), R = PD.R3D;
    w.append(h('div', { class: 'row' }, [h('button', { class: 'btn small backbtn', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('practice') }), h('h1', { 'data-t': 'x3.title', style: 'margin:0' }), h('span', { class: 'spacer' }), h('button', { class: 'btn small primary', 'data-t': 'x3.tour', onclick: () => tour(0) })]));
    const host = h('div', { class: 'x3d' });
    const tags = h('div', { class: 'tags' }), views = h('div', { class: 'views' }), infoEl = h('div', { class: 'info', hidden: true, role: 'status', 'aria-live': 'polite' });
    host.append(tags, views, infoEl); tags.hidden = true;
    w.append(host, h('p', { class: 'muted', 'data-t': 'x3.tap' }));
    let showLabels = false, active = null;   // hotspots on demand: the default view stays clean
    const ok = R.mount(host);
    if (!ok) { host.appendChild(h('div', { class: 'msg', text: t('r3.nogl') })); return; }
    host.insertBefore(R.canvas, tags);
    R.setView(param === 'tour' ? 'front' : 'free'); R.autoRot = false; R.clearNote(); R.setGhost(null);
    views.appendChild(h('button', { class: 'chip', html: PD.ic.restart + '<span data-t="x3.reset"></span>', title: t('x3.reset'), onclick: () => { R.setView('front'); } }));
    ['front', 'player', 'head', 'sound', 'side', 'back', 'free'].forEach(v => views.appendChild(h('button', { class: 'chip', 'data-v': v, text: t('v.' + v), onclick: () => R.setView(v) })));
    const tgl = (k, get, set) => { const b = h('button', { class: 'chip', 'aria-pressed': String(get()), html: '<span class="dot"></span>' + PD.esc(t(k)), onclick: () => { set(!get()); b.setAttribute('aria-pressed', String(get())); } }); return b; };
    let rot = false;
    views.append(tgl('x3.rotate', () => rot, v => { rot = v; R.autoRot = v; }), tgl('x3.labels', () => showLabels, v => { showLabels = v; tags.hidden = !v; }));
    const syncViews = v => views.querySelectorAll('[data-v]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
    syncViews(R.view); own(PD.bus.on('r3d.view', syncViews));
    const tagEls = R.PARTS.map(p => { const el = h('button', { class: 'ptag', 'aria-pressed': 'false', text: t('x3p.' + p.id), onclick: () => pick(p.id) }); tags.appendChild(el); return el; });
    own(PD.bus.on('r3d.frame', ({ project }) => {
      if (!showLabels || !host.isConnected) return;
      R.PARTS.forEach((p, i) => { const q = project(p.p), el = tagEls[i]; const vis = q[2] < 1 && q[0] > 0 && q[1] > 0 && q[0] < host.clientWidth && q[1] < host.clientHeight; el.style.display = vis ? '' : 'none'; if (vis) el.style.transform = 'translate(' + Math.round(q[0] + 8) + 'px,' + Math.round(q[1] - 14) + 'px)'; });
    }));
    function pick(id, keepView) {
      active = id; tagEls.forEach((el, i) => el.setAttribute('aria-pressed', String(R.PARTS[i].id === id)));
      if (!keepView) R.focusPart(id);
      infoEl.hidden = false; infoEl.innerHTML = ''; infoEl.append(h('b', { text: t('x3p.' + id) }), h('p', { text: t('pi.' + id), style: 'margin-top:4px' }), h('button', { class: 'btn small quiet', style: 'margin-top:8px', 'data-t': 'close', text: t('close'), onclick: () => { infoEl.hidden = true; active = null; tagEls.forEach(el => el.setAttribute('aria-pressed', 'false')); } }));
    }
    own(PD.bus.on('r3d.tapEmpty', part => { if (part) pick(part, true); }));
    own(PD.bus.on('r3d.tap', p => { PD.audio.ensure(); PD.audio.note(p.s, p.f, { vel: .7 }); R.showNote(p.s, p.f); const m = TH.midi(p.s, p.f); infoEl.hidden = false; infoEl.innerHTML = ''; infoEl.append(h('b', { text: t('x3.note', { n: TH.name(m) + ' · ' + TH.nameKa(m), s: TH.stringName(p.s), f: p.f }) })); }));
    own(() => { R.autoRot = false; R.clearNote(); });

    /* guided tour: only facts stated in the part descriptions */
    const TOUR = [{ k: 'x3.t0', part: 'string', act: () => { PD.audio.ensure(); R.showNote(2, 5); PD.audio.note(2, 5); } }, { part: 'nut' }, { part: 'fret' }, { part: 'neck' }, { part: 'bridge' }, { part: 'top' }, { part: 'hole' }, { part: 'body' }, { part: 'head' }, { part: 'tuners' }, { k: 'x3.t9', view: 'front' }];
    function tour(i) {
      const st = TOUR[i]; if (!st) { infoEl.hidden = true; return; }
      if (st.part) R.focusPart(st.part); else if (st.view) R.setView(st.view);
      if (st.act) st.act();
      tagEls.forEach((el, j) => el.setAttribute('aria-pressed', String(R.PARTS[j].id === st.part)));
      infoEl.hidden = false; infoEl.innerHTML = '';
      infoEl.append(...[h('span', { class: 'kicker', text: t('x3.tour') + ' · ' + t('x3.step', { a: i + 1, b: TOUR.length }) }), st.part ? h('b', { text: t('x3p.' + st.part), style: 'display:block;margin-top:4px' }) : null,
        h('p', { text: st.k ? t(st.k) : t('pi.' + st.part), style: 'margin-top:4px' }),
        h('div', { class: 'row', style: 'margin-top:8px' }, [i ? h('button', { class: 'btn small', text: t('prev'), onclick: () => tour(i - 1) }) : null, i < TOUR.length - 1 ? h('button', { class: 'btn small primary', text: t('next'), onclick: () => tour(i + 1) }) : h('button', { class: 'btn small primary', text: t('done'), onclick: () => { infoEl.hidden = true; PD.store.set('seen.tour', true); } })])].filter(Boolean));
    }
    if (param === 'tour') setTimeout(() => tour(0), 300);
  }

  return { tuner, chords, fretboard, explore, chordDiagram, PROGRESSIONS };
})();
