/* =====================================================================
   The advanced theory book: what a conservatory teaches in harmony and
   theory, and what a jazz school teaches — as data, drawn by advtheory.js.
   General music theory, true of any instrument: nothing here is panduri
   technique. Every example can be heard (piano), every chapter ends with
   a self-check. In the app only (APP_ONLY).

   A chapter: { id, t: [ka, en], lead: [ka, en], b: blocks, q: quiz }
   blocks:  ['p', ka, en] · ['h', ka, en] · ['ul', [[ka, en], …]] · ['note', ka, en]
            ['tb', heads, rows]            (a cell: text, or [ka, en])
            ['play', [ka, en], { ch: ['C3 G3 E4', …], gap }]   chords, each a list of notes
            ['play', [ka, en], { mel: 'C4 D4 E4', gap }]        a melody
   quiz:    [[ka, en], options, right index, [ka, en] why]
   ===================================================================== */
'use strict';
PD.advData = (() => {
  const CONS = [
    { id: 'iv2', t: ['ინტერვალები სიღრმეში', 'Intervals in depth'],
      lead: ['შებრუნება, შედგენილი ინტერვალები, კონსონანსი და დისონანსი, ენჰარმონიული ტოლობა.', 'Inversion, compound intervals, consonance and dissonance, enharmonic equivalents.'],
      b: [
        ['h', 'ინტერვალის შებრუნება', 'Inverting an interval'],
        ['p', 'ინტერვალი <b>შებრუნდება</b>, როცა ქვედა ბგერა ოქტავით მაღლა გადადის (ან ზედა — ოქტავით დაბლა). ორი წესი: <b>რიცხვების ჯამი 9-ია</b> (ტერცია → სექსტა, სეკუნდა → სეპტიმა, კვარტა → კვინტა), ხოლო <b>ნახევარტონების ჯამი 12</b>. სახეობა იცვლება: დიდი ↔ პატარა, გადიდებული ↔ შემცირებული; წმინდა წმინდად რჩება.',
              'An interval is <b>inverted</b> when its lower note moves up an octave (or the upper note down an octave). Two rules: <b>the numbers add up to 9</b> (third → sixth, second → seventh, fourth → fifth) and <b>the semitones add up to 12</b>. The quality flips: major ↔ minor, augmented ↔ diminished; perfect stays perfect.'],
        ['tb', [['ინტერვალი', 'Interval'], ['შებრუნება', 'Inversion'], ['ნახევარტ.', 'Semitones']], [
          [['დიდი ტერცია C–E', 'major 3rd C–E'], ['პატარა სექსტა E–C', 'minor 6th E–C'], '4 + 8'],
          [['პატარა სეკუნდა E–F', 'minor 2nd E–F'], ['დიდი სეპტიმა F–E', 'major 7th F–E'], '1 + 11'],
          [['წმინდა კვარტა G–C', 'perfect 4th G–C'], ['წმინდა კვინტა C–G', 'perfect 5th C–G'], '5 + 7'],
          [['გადიდებული კვარტა F–B', 'augmented 4th F–B'], ['შემცირებული კვინტა B–F', 'diminished 5th B–F'], '6 + 6']]],
        ['play', ['C–E და E–C', 'C–E and E–C'], { ch: ['C4 E4', 'E4 C5'], gap: 1.1 }],
        ['h', 'შედგენილი ინტერვალები', 'Compound intervals'],
        ['p', 'ოქტავაზე ფართო ინტერვალი <b>შედგენილია</b>: ოქტავა + მარტივი ინტერვალი. ნონა = ოქტავა + სეკუნდა, დეციმა = ოქტავა + ტერცია, უნდეციმა = ოქტავა + კვარტა, დუოდეციმა = ოქტავა + კვინტა, ტერცდეციმა = ოქტავა + სექსტა. ნახევარტონებს 12 ემატება: დიდი ნონა = 2 + 12 = 14. ჯაზში სწორედ ესენია აკორდის „გაფართოებები“ — 9, 11, 13.',
              'An interval wider than an octave is <b>compound</b>: an octave plus a simple interval. Ninth = octave + second, tenth = octave + third, eleventh = octave + fourth, twelfth = octave + fifth, thirteenth = octave + sixth. Add 12 semitones: a major ninth = 2 + 12 = 14. In jazz these are the chord\'s “extensions” — 9, 11, 13.'],
        ['play', ['დიდი ნონა C4–D5', 'Major ninth C4–D5'], { mel: 'C4 D5', gap: .7 }],
        ['h', 'კონსონანსი და დისონანსი', 'Consonance and dissonance'],
        ['ul', [
          ['<b>სრული კონსონანსი</b>: წმინდა პრიმა, კვინტა, ოქტავა.', '<b>Perfect consonances</b>: unison, perfect fifth, octave.'],
          ['<b>არასრული კონსონანსი</b>: ტერციები და სექსტები (დიდი და პატარა).', '<b>Imperfect consonances</b>: thirds and sixths (major and minor).'],
          ['<b>წმინდა კვარტა</b> ორმაგია: ზედა ხმებს შორის კონსონანსია, ბასთან კი კლასიკურ ჰარმონიაში დისონანსად ითვლება და გახსნას მოითხოვს.', 'The <b>perfect fourth</b> is double-sided: consonant between upper voices, but against the bass it counts as a dissonance in classical harmony and wants to resolve.'],
          ['<b>დისონანსი</b>: სეკუნდები, სეპტიმები, ტრიტონი და ყველა გადიდებული და შემცირებული ინტერვალი. დისონანსი „მოძრაობს“ — ის კონსონანსისკენ იხსნება.', '<b>Dissonances</b>: seconds, sevenths, the tritone and every augmented and diminished interval. A dissonance “moves” — it resolves into a consonance.']]],
        ['h', 'ენჰარმონიული ტოლობა', 'Enharmonic equivalents'],
        ['p', 'C–F♯ (გადიდებული კვარტა) და C–G♭ (შემცირებული კვინტა) ერთნაირად ჟღერს — ორივე 6 ნახევარტონია, მაგრამ სხვადასხვა ფუნქცია აქვთ: <b>გადიდებული ინტერვალი გარეთ იხსნება</b> (C–F♯ → B–G, სექსტა), <b>შემცირებული — შიგნით</b> (C–G♭ → D♭–F, ტერცია). ნოტის სწორი სახელი გვეუბნება, საით წავა მუსიკა.',
              'C–F♯ (augmented fourth) and C–G♭ (diminished fifth) sound the same — both 6 semitones — but they do different jobs: <b>an augmented interval resolves outward</b> (C–F♯ → B–G, a sixth), <b>a diminished one inward</b> (C–G♭ → D♭–F, a third). The right spelling tells you where the music will go.'],
        ['play', ['C–F♯ → B–G', 'C–F♯ → B–G'], { ch: ['C4 F#4', 'B3 G4'], gap: 1 }]],
      q: [
        [['რა არის დიდი ტერციის შებრუნება?', 'What does a major third invert to?'], [['პატარა სექსტა', 'Minor sixth'], ['დიდი სექსტა', 'Major sixth'], ['წმინდა კვინტა', 'Perfect fifth']], 0, ['3 + 6 = 9, დიდი → პატარა.', '3 + 6 = 9, major → minor.']],
        [['რამდენი ნახევარტონია დიდი ნონა?', 'How many semitones is a major ninth?'], ['14', '13', '9'], 0, ['დიდი სეკუნდა (2) + ოქტავა (12).', 'Major second (2) + octave (12).']],
        [['C–F♯ რომელი ინტერვალია?', 'What interval is C–F♯?'], [['გადიდებული კვარტა', 'Augmented fourth'], ['შემცირებული კვინტა', 'Diminished fifth'], ['წმინდა კვარტა', 'Perfect fourth']], 0, ['ნოტის სახელი F — კვარტაა; 6 ნახევარტონი — გადიდებული.', 'The letter F makes it a fourth; 6 semitones make it augmented.']]] },

    { id: 'modes', t: ['ლადები', 'The modes'],
      lead: ['შვიდი დიატონური ლადი, თითოეულის დამახასიათებელი ბგერა და ჟღერადობა.', 'The seven diatonic modes, each one\'s characteristic note and colour.'],
      b: [
        ['p', 'თეთრ კლავიშებზე შვიდი ლადი იმალება — თითოეული სხვა ნოტიდან იწყება. ერთი და იგივე ნოტებია, მაგრამ ტონიკა იცვლება და მასთან ერთად ტონებისა და ნახევარტონების რიგი.', 'Seven modes hide on the white keys — each starts on a different note. The same notes, but the tonic changes, and with it the order of tones and semitones.'],
        ['tb', [['ლადი', 'Mode'], ['ნაბიჯები', 'Steps'], ['თეთრებზე', 'On white keys'], ['დამახასიათებელი', 'Characteristic']], [
          [['იონიური (მაჟორი)', 'Ionian (major)'], 'T T S T T T S', 'C–C', ['დიდი ტერცია, შესავალი ტონი', 'major 3rd, leading tone']],
          [['დორიული', 'Dorian'], 'T S T T T S T', 'D–D', ['დიდი სექსტა მინორში', 'major 6th in a minor mode']],
          [['ფრიგიული', 'Phrygian'], 'S T T T S T T', 'E–E', ['პატარა სეკუნდა', 'minor 2nd']],
          [['ლიდიური', 'Lydian'], 'T T T S T T S', 'F–F', ['გადიდებული კვარტა', 'augmented 4th']],
          [['მიქსოლიდიური', 'Mixolydian'], 'T T S T T S T', 'G–G', ['პატარა სეპტიმა მაჟორში', 'minor 7th in a major mode']],
          [['ეოლიური (ნატურ. მინორი)', 'Aeolian (natural minor)'], 'T S T T S T T', 'A–A', ['პატარა სექსტა', 'minor 6th']],
          [['ლოკრიული', 'Locrian'], 'S T T S T T T', 'B–B', ['შემცირებული კვინტა', 'diminished 5th']]]],
        ['note', 'შესადარებლად ყველა ლადი ერთი ტონიკიდან — C-დან — მოისმინე: ასე ყველაზე კარგად ჩანს, რომელი ბგერაა „სხვა“.', 'To compare, hear every mode from one tonic — C: that shows best which note is “different”.'],
        ['play', ['C იონიური', 'C Ionian'], { mel: 'C4 D4 E4 F4 G4 A4 B4 C5', gap: .3 }],
        ['play', ['C დორიული', 'C Dorian'], { mel: 'C4 D4 Eb4 F4 G4 A4 Bb4 C5', gap: .3 }],
        ['play', ['C ფრიგიული', 'C Phrygian'], { mel: 'C4 Db4 Eb4 F4 G4 Ab4 Bb4 C5', gap: .3 }],
        ['play', ['C ლიდიური', 'C Lydian'], { mel: 'C4 D4 E4 F#4 G4 A4 B4 C5', gap: .3 }],
        ['play', ['C მიქსოლიდიური', 'C Mixolydian'], { mel: 'C4 D4 E4 F4 G4 A4 Bb4 C5', gap: .3 }],
        ['play', ['C ეოლიური', 'C Aeolian'], { mel: 'C4 D4 Eb4 F4 G4 Ab4 Bb4 C5', gap: .3 }],
        ['play', ['C ლოკრიული', 'C Locrian'], { mel: 'C4 Db4 Eb4 F4 Gb4 Ab4 Bb4 C5', gap: .3 }],
        ['h', 'ნაშიკაშრით: ნათელიდან ბნელამდე', 'From brightest to darkest'],
        ['p', 'ლადები ერთ რიგში ლაგდება — ყოველი შემდეგი ერთი ბგერით „ბნელია“: <b>ლიდიური → იონიური → მიქსოლიდიური → დორიული → ეოლიური → ფრიგიული → ლოკრიული</b>. ყოველ ნაბიჯზე ერთი საფეხური ნახევარტონით დაბლდება.', 'The modes line up in one row, each one note “darker” than the last: <b>Lydian → Ionian → Mixolydian → Dorian → Aeolian → Phrygian → Locrian</b>. At every step one degree is lowered by a semitone.'],
        ['h', 'მინორის სამი სახე', 'The three forms of minor'],
        ['ul', [
          ['<b>ნატურალური</b> (ეოლიური): A B C D E F G A.', '<b>Natural</b> (Aeolian): A B C D E F G A.'],
          ['<b>ჰარმონიული</b>: VII საფეხური ამაღლებულია — G♯; ჩნდება შესავალი ტონი და მაჟორული დომინანტა (E). VI და VII შორის — გადიდებული სეკუნდა.', '<b>Harmonic</b>: the 7th degree is raised — G♯; a leading tone and a major dominant (E) appear. Between VI and VII lies an augmented second.'],
          ['<b>მელოდიური</b>: ზემოთ ასვლისას VI და VII ამაღლებულია (F♯ G♯), დაბლა — ნატურალური. ჯაზში მელოდიური მინორი ორივე მიმართულებით ამაღლებული რჩება.', '<b>Melodic</b>: going up, the 6th and 7th are raised (F♯ G♯); coming down, natural. In jazz the melodic minor stays raised both ways.']]],
        ['play', ['A ჰარმონიული მინორი', 'A harmonic minor'], { mel: 'A3 B3 C4 D4 E4 F4 G#4 A4', gap: .3 }],
        ['play', ['A მელოდიური მინორი (ზემოთ)', 'A melodic minor (up)'], { mel: 'A3 B3 C4 D4 E4 F#4 G#4 A4', gap: .3 }]],
      q: [
        [['რომელი ლადია მინორი დიდი სექსტით?', 'Which mode is minor with a major sixth?'], [['დორიული', 'Dorian'], ['ფრიგიული', 'Phrygian'], ['ეოლიური', 'Aeolian']], 0, ['დორიული: T S T T T S T — VI დიდია.', 'Dorian: T S T T T S T — the 6th is major.']],
        [['ლიდიურის დამახასიათებელი ბგერა:', 'Lydian\'s characteristic note:'], [['გადიდებული კვარტა', 'Augmented fourth'], ['პატარა სეპტიმა', 'Minor seventh'], ['პატარა სეკუნდა', 'Minor second']], 0, ['F ლიდიური: F G A B — B გადიდებული კვარტაა.', 'F Lydian: F G A B — B is an augmented fourth.']],
        [['ჰარმონიულ მინორში რომელი საფეხურია ამაღლებული?', 'Which degree is raised in harmonic minor?'], ['VII', 'VI', 'IV'], 0, ['VII — შესავალი ტონისთვის.', 'The 7th — to make a leading tone.']]] },

    { id: 'sevenths', t: ['სეპტაკორდები', 'Seventh chords'],
      lead: ['ხუთი სახის სეპტაკორდი, მათი ადგილი ტონალობაში, მიმართვები და გახსნა.', 'The five seventh chords, their place in a key, their inversions and resolution.'],
      b: [
        ['p', '<b>სეპტაკორდი</b> ოთხი ბგერისგანაა: ტრიადას ზემოდან კიდევ ერთი ტერცია ემატება — ტონიკიდან სეპტიმა.', 'A <b>seventh chord</b> has four notes: one more third on top of a triad — a seventh above the root.'],
        ['tb', [['სახე', 'Type'], ['სიმბოლო', 'Symbol'], ['აგებულება', 'Built of'], ['C-დან', 'On C']], [
          [['დიდი მაჟორული', 'major seventh'], 'Cmaj7 · CΔ', ['მაჟ. ტრიადა + დ. სეპტიმა', 'major triad + major 7th'], 'C E G B'],
          [['დომინანტსეპტაკორდი', 'dominant seventh'], 'C7', ['მაჟ. ტრიადა + პ. სეპტიმა', 'major triad + minor 7th'], 'C E G B♭'],
          [['მცირე მინორული', 'minor seventh'], 'Cm7 · C–7', ['მინ. ტრიადა + პ. სეპტიმა', 'minor triad + minor 7th'], 'C E♭ G B♭'],
          [['ნახევრად შემცირებული', 'half-diminished'], 'Cm7♭5 · Cø', ['შემც. ტრიადა + პ. სეპტიმა', 'diminished triad + minor 7th'], 'C E♭ G♭ B♭'],
          [['შემცირებული', 'diminished seventh'], 'Cdim7 · C°7', ['შემც. ტრიადა + შემც. სეპტიმა', 'diminished triad + diminished 7th'], 'C E♭ G♭ B♭♭ (A)']]],
        ['play', ['ხუთივე თანმიმდევრობით', 'All five in turn'], { ch: ['C3 E3 G3 B3', 'C3 E3 G3 Bb3', 'C3 Eb3 G3 Bb3', 'C3 Eb3 Gb3 Bb3', 'C3 Eb3 Gb3 A3'], gap: 1.15 }],
        ['h', 'დიატონური სეპტაკორდები', 'The diatonic sevenths'],
        ['tb', ['', 'I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii'], [
          [['C მაჟორი', 'C major'], 'Cmaj7', 'Dm7', 'Em7', 'Fmaj7', 'G7', 'Am7', 'Bø'],
          [['A ჰარმ. მინორი', 'A harmonic minor'], 'Am(maj7)', 'Bø', 'Cmaj7♯5', 'Dm7', 'E7', 'Fmaj7', 'G♯°7']]],
        ['p', 'მაჟორში დომინანტსეპტაკორდი მხოლოდ V საფეხურზეა — ამიტომ G7 ცალსახად C-ს მიუთითებს. მინორში შემცირებული სეპტაკორდი VII საფეხურზე ჩნდება (G♯°7).', 'In major the dominant seventh sits only on V — which is why G7 points so clearly to C. In minor the diminished seventh appears on VII (G♯°7).'],
        ['h', 'მიმართვები და ციფრული ბასი', 'Inversions and figured bass'],
        ['tb', [['ბასში', 'In the bass'], ['სახელი', 'Name'], ['ციფრები', 'Figures'], ['G7-ის მაგალითი', 'G7 example']], [
          [['ტონიკა', 'root'], ['სეპტაკორდი', 'seventh chord'], '7', 'G B D F'],
          [['ტერცია', 'third'], ['კვინტსექსტაკორდი', 'six-five chord'], '6/5', 'B D F G'],
          [['კვინტა', 'fifth'], ['ტერცკვარტაკორდი', 'four-three chord'], '4/3', 'D F G B'],
          [['სეპტიმა', 'seventh'], ['სეკუნდაკორდი', 'two chord'], '2 (4/2)', 'F G B D']]],
        ['h', 'დომინანტსეპტაკორდის გახსნა', 'Resolving the dominant seventh'],
        ['p', 'V7 → I: <b>ტერცია (შესავალი ტონი) ზემოთ ადის</b> ტონიკაზე (B → C), <b>სეპტიმა ერთი საფეხურით ეშვება</b> (F → E). ტრიტონი B–F იხსნება ტერციაზე C–E.', 'V7 → I: <b>the third (the leading tone) rises</b> to the tonic (B → C) and <b>the seventh falls by step</b> (F → E). The tritone B–F resolves to the third C–E.'],
        ['play', ['G7 → C', 'G7 → C'], { ch: ['G2 D4 F4 B4', 'C3 C4 E4 C5'], gap: 1.3 }]],
      q: [
        [['რომელი ნოტებია G7-ში?', 'Which notes are in G7?'], ['G B D F', 'G B D F♯', 'G B♭ D F'], 0, ['მაჟ. ტრიადა G B D + პ. სეპტიმა F.', 'Major triad G B D + minor seventh F.']],
        [['6/5 რას ნიშნავს?', 'What does 6/5 mean?'], [['პირველ მიმართვას (ბასში ტერცია)', 'First inversion (third in the bass)'], ['მეორე მიმართვას', 'Second inversion'], ['ძირითად სახეს', 'Root position']], 0, ['კვინტსექსტაკორდი: ბასში ტერცია.', 'Six-five: the third in the bass.']],
        [['მაჟორში VII საფეხურის სეპტაკორდი:', 'The seventh chord on VII in major:'], [['ნახევრად შემცირებული', 'Half-diminished'], ['შემცირებული', 'Fully diminished'], ['დომინანტსეპტაკორდი', 'Dominant seventh']], 0, ['B D F A = Bø.', 'B D F A = Bø.']]] },

    { id: 'function', t: ['ფუნქციური ჰარმონია და კადანსები', 'Functional harmony and cadences'],
      lead: ['ტონიკა, სუბდომინანტა, დომინანტა — და ფრაზის ოთხი დასასრული.', 'Tonic, subdominant, dominant — and the four ways a phrase ends.'],
      b: [
        ['p', 'ტონალობის აკორდები სამ <b>ფუნქციად</b> იყოფა. ფუნქცია აკორდის „როლია“: სად ვართ — სახლში, სახლიდან მოშორებით თუ სახლში დაბრუნების წინ.', 'A key\'s chords fall into three <b>functions</b>. A function is a chord\'s role: where we are — at home, away from home, or about to go home.'],
        ['tb', [['ფუნქცია', 'Function'], ['საფეხურები', 'Degrees'], ['C მაჟორში', 'In C major'], ['თვისება', 'Character']], [
          [['ტონიკა (T)', 'Tonic (T)'], 'I · vi · (iii)', 'C · Am · Em', ['სიმშვიდე, სახლი', 'rest, home']],
          [['სუბდომინანტა (S)', 'Subdominant (S)'], 'IV · ii', 'F · Dm', ['მოშორება, მომზადება', 'moving away, preparing']],
          [['დომინანტა (D)', 'Dominant (D)'], 'V · vii°', 'G · B°', ['დაძაბულობა, ტონიკისკენ სწრაფვა', 'tension, pulling home']]]],
        ['p', 'ყველაზე ბუნებრივი გზა: <b>T → S → D → T</b>. S-ის წინ D-ის დაბრუნება (V → IV) ძველ ჰარმონიაში ნაკლებად გვხვდება, ბლუზსა და როკში კი ჩვეულებრივია.', 'The most natural path is <b>T → S → D → T</b>. Going back from D to S (V → IV) is rare in classical harmony but common in blues and rock.'],
        ['play', ['T → S → D → T: C · F · G · C', 'T → S → D → T: C · F · G · C'], { ch: ['C3 G3 C4 E4', 'F2 A3 C4 F4', 'G2 G3 B3 D4', 'C3 G3 C4 E4'], gap: 1 }],
        ['h', 'კადანსები', 'Cadences'],
        ['tb', [['კადანსი', 'Cadence'], ['აკორდები', 'Chords'], ['შთაბეჭდილება', 'Effect']], [
          [['ავთენტური (სრული)', 'Authentic (perfect)'], 'V → I', ['დასრულება, „წერტილი“', 'closure, a full stop']],
          [['პლაგალური', 'Plagal'], 'IV → I', ['რბილი დასრულება, „ამინ“', 'soft close, the “amen”']],
          [['ნახევარი', 'Half'], '… → V', ['კითხვის ნიშანი — ფრაზა V-ზე ჩერდება', 'a question mark — the phrase stops on V']],
          [['შეწყვეტილი', 'Deceptive'], 'V → vi', ['მოლოდინის მოტყუება — ტონიკის ნაცვლად vi', 'a surprise — vi instead of the tonic']]]],
        ['play', ['ავთენტური: G → C', 'Authentic: G → C'], { ch: ['G2 G3 B3 D4', 'C3 G3 C4 E4'], gap: 1.1 }],
        ['play', ['პლაგალური: F → C', 'Plagal: F → C'], { ch: ['F2 A3 C4 F4', 'C3 G3 C4 E4'], gap: 1.1 }],
        ['play', ['ნახევარი: C → Dm → G', 'Half: C → Dm → G'], { ch: ['C3 G3 C4 E4', 'D3 A3 D4 F4', 'G2 G3 B3 D4'], gap: 1.1 }],
        ['play', ['შეწყვეტილი: G → Am', 'Deceptive: G → Am'], { ch: ['G2 G3 B3 D4', 'A2 A3 C4 E4'], gap: 1.1 }],
        ['h', 'სრული და არასრული ავთენტური', 'Perfect and imperfect authentic'],
        ['p', '<b>სრული ავთენტური</b> (PAC): V და I ორივე ძირითად სახეშია და ზედა ხმაში ბოლოს ტონიკაა. ყველა სხვა V–I <b>არასრულია</b> (IAC). კლასიკაში ხშირია <b>კადანსური კვარტსექსტაკორდი</b>: I6/4 → V → I — ბასში დომინანტა ორჯერ ჟღერს.', '<b>Perfect authentic</b> (PAC): V and I both in root position, the tonic on top at the end. Every other V–I is <b>imperfect</b> (IAC). Classical music often uses the <b>cadential six-four</b>: I6/4 → V → I — the dominant sounds twice in the bass.'],
        ['play', ['I6/4 → V7 → I', 'I6/4 → V7 → I'], { ch: ['G2 G3 C4 E4', 'G2 F3 B3 D4', 'C3 E3 C4 C4'], gap: 1.1 }]],
      q: [
        [['V → vi რომელი კადანსია?', 'V → vi is which cadence?'], [['შეწყვეტილი', 'Deceptive'], ['პლაგალური', 'Plagal'], ['ნახევარი', 'Half']], 0, ['ტონიკის ნაცვლად vi ჟღერს.', 'vi sounds instead of the tonic.']],
        [['რომელ ფუნქციას ეკუთვნის ii?', 'Which function does ii belong to?'], [['სუბდომინანტა', 'Subdominant'], ['დომინანტა', 'Dominant'], ['ტონიკა', 'Tonic']], 0, ['ii (Dm) IV-ის (F) ორ ნოტს იზიარებს.', 'ii (Dm) shares two notes with IV (F).']],
        [['ფრაზა V-ზე ჩერდება — ეს…', 'A phrase that stops on V is…'], [['ნახევარი კადანსი', 'a half cadence'], ['ავთენტური კადანსი', 'an authentic cadence'], ['პლაგალური კადანსი', 'a plagal cadence']], 0, ['ნახევარი კადანსი — „კითხვა“.', 'A half cadence — a “question”.']]] },

    { id: 'voice', t: ['ოთხხმიანი ხმათა მიყოლა', 'Four-part voice leading'],
      lead: ['სოპრანო, ალტი, ტენორი, ბასი: დიაპაზონები, დაშორება, გაორმაგება და აკრძალული პარალელები.', 'Soprano, alto, tenor, bass: ranges, spacing, doubling and the forbidden parallels.'],
      b: [
        ['p', 'კლასიკური ჰარმონია ოთხ ხმად ისწავლება — ისე, როგორც გუნდი მღერის. ყოველი ხმა ცალკე მელოდიაა და აკორდიდან აკორდზე მოკლე გზით უნდა გადავიდეს.', 'Classical harmony is learned in four voices — the way a choir sings. Each voice is a melody of its own and should go from chord to chord by the shortest way.'],
        ['tb', [['ხმა', 'Voice'], ['დიაპაზონი', 'Range']], [[['სოპრანო', 'Soprano'], 'C4 – G5'], [['ალტი', 'Alto'], 'G3 – C5'], [['ტენორი', 'Tenor'], 'C3 – G4'], [['ბასი', 'Bass'], 'E2 – C4']]],
        ['h', 'წესები', 'The rules'],
        ['ul', [
          ['<b>დაშორება</b>: მეზობელ ზედა ხმებს (S–A, A–T) შორის ოქტავაზე მეტი არ უნდა იყოს; ტენორსა და ბასს შორის — შეიძლება.', '<b>Spacing</b>: no more than an octave between neighbouring upper voices (S–A, A–T); tenor and bass may be further apart.'],
          ['<b>გაორმაგება</b>: ძირითად სახეში ტონიკა გაორმაგდება. შესავალი ტონი არასოდეს გაორმაგდება.', '<b>Doubling</b>: in root position double the root. Never double the leading tone.'],
          ['<b>პარალელური კვინტები და ოქტავები აკრძალულია</b>: ორი ხმა, რომელიც კვინტაზე (ან ოქტავაზე) დგას, ერთად არ უნდა გადავიდეს შემდეგ კვინტაზე (ოქტავაზე).', '<b>Parallel fifths and octaves are forbidden</b>: two voices a fifth (or an octave) apart must not move together to another fifth (octave).'],
          ['<b>ფარული კვინტები და ოქტავები</b> კიდურ ხმებში (S და B): ერთი მიმართულებით სრულ ინტერვალზე მისვლა — მხოლოდ მაშინ, როცა სოპრანო ნაბიჯით მოძრაობს.', '<b>Hidden fifths and octaves</b> in the outer voices (S and B): reaching a perfect interval by similar motion — only when the soprano moves by step.'],
          ['<b>შესავალი ტონი ზემოთ იხსნება</b>, <b>სეპტიმა — ქვემოთ</b>. საერთო ბგერა იმავე ხმაში რჩება.', '<b>The leading tone resolves up</b>, <b>the seventh down</b>. A common tone stays in the same voice.'],
          ['<b>საწინააღმდეგო მოძრაობა</b> (ბასი ზემოთ, ზედა ხმები ქვემოთ) პარალელებისგან გიცავს — განსაკუთრებით IV → V-ზე.', '<b>Contrary motion</b> (bass up, upper voices down) keeps parallels away — especially on IV → V.']]],
        ['h', 'მაგალითი: I – IV – V – I დო მაჟორში', 'Example: I – IV – V – I in C major'],
        ['tb', ['', 'I', 'IV', 'V', 'I'], [[['სოპრანო', 'Soprano'], 'E4', 'F4', 'D4', 'E4'], [['ალტი', 'Alto'], 'C4', 'C4', 'B3', 'C4'], [['ტენორი', 'Tenor'], 'G3', 'A3', 'G3', 'G3'], [['ბასი', 'Bass'], 'C3', 'F2', 'G2', 'C3']]],
        ['p', 'C ალტში რჩება (I → IV საერთო ბგერა). IV → V-ზე ბასი ზემოთ ადის, ზედა სამი ხმა — ქვემოთ: არცერთი პარალელი. V → I-ზე შესავალი ტონი B ზემოთ, C-ზე იხსნება.', 'C stays in the alto (the common tone of I → IV). On IV → V the bass rises and the three upper voices fall: no parallels. On V → I the leading tone B resolves up to C.'],
        ['play', ['I – IV – V – I', 'I – IV – V – I'], { ch: ['C3 G3 C4 E4', 'F2 A3 C4 F4', 'G2 G3 B3 D4', 'C3 G3 C4 E4'], gap: 1.1 }],
        ['play', ['პარალელური კვინტები (ასე არ ვწერთ)', 'Parallel fifths (not written this way)'], { ch: ['C3 G3', 'D3 A3', 'E3 B3'], gap: .8 }]],
      q: [
        [['რომელი პარალელებია აკრძალული?', 'Which parallels are forbidden?'], [['კვინტები და ოქტავები', 'Fifths and octaves'], ['ტერციები და სექსტები', 'Thirds and sixths'], ['სეკუნდები', 'Seconds']], 0, ['სრული ინტერვალების პარალელი ხმების დამოუკიდებლობას აქრობს.', 'Parallel perfect intervals erase the voices\' independence.']],
        [['საით იხსნება შესავალი ტონი?', 'Where does the leading tone resolve?'], [['ზემოთ, ტონიკაზე', 'Up, to the tonic'], ['ქვემოთ', 'Down'], ['რჩება', 'It stays']], 0, ['B → C დო მაჟორში.', 'B → C in C major.']],
        [['ძირითად სახეში რომელი ბგერა გაორმაგდება?', 'Which note is doubled in root position?'], [['ტონიკა', 'The root'], ['ტერცია', 'The third'], ['შესავალი ტონი', 'The leading tone']], 0, ['ტონიკის გაორმაგება ყველაზე მყარია.', 'Doubling the root is the most stable.']]] },

    { id: 'nct', t: ['არააკორდული ბგერები', 'Non-chord tones'],
      lead: ['გამავალი, დამხმარე, დაკავება, აპოჯიატურა, ანტიციპაცია, ორგანული პუნქტი.', 'Passing and neighbour tones, suspensions, appoggiaturas, anticipations, pedal points.'],
      b: [
        ['p', 'მელოდიაში ყველა ნოტი აკორდს არ ეკუთვნის. <b>არააკორდული ბგერა</b> დისონანსია, რომელსაც თავისი გზა აქვს: როგორ მიდის მასთან ხმა და როგორ ტოვებს.', 'Not every note of a melody belongs to the chord. A <b>non-chord tone</b> is a dissonance with its own path: how the voice reaches it and how it leaves.'],
        ['tb', [['სახე', 'Type'], ['მისვლა', 'Approach'], ['წასვლა', 'Leave'], ['მაგალითი C-ზე', 'Example over C']], [
          [['გამავალი', 'Passing tone'], ['ნაბიჯით', 'by step'], ['ნაბიჯით, იმავე მიმართულებით', 'by step, same direction'], 'C D E'],
          [['დამხმარე', 'Neighbour tone'], ['ნაბიჯით', 'by step'], ['ნაბიჯით, უკან', 'by step, back'], 'E F E'],
          [['დაკავება', 'Suspension'], ['იმავე ნოტით (მომზადება)', 'same note (prepared)'], ['ნაბიჯით ქვემოთ', 'by step down'], '4–3: F → E'],
          [['აპოჯიატურა', 'Appoggiatura'], ['ნახტომით', 'by leap'], ['ნაბიჯით', 'by step'], 'C → A → G'],
          [['გაქცევა', 'Escape tone'], ['ნაბიჯით', 'by step'], ['ნახტომით, საწინააღმდეგოდ', 'by leap, the other way'], 'D E C'],
          [['ანტიციპაცია', 'Anticipation'], ['ნაბიჯით', 'by step'], ['იმავე ნოტით — შემდეგი აკორდი', 'same note — the next chord'], 'G7: B → C … C'],
          [['ორგანული პუნქტი', 'Pedal point'], ['—', '—'], ['—', '—'], ['გაჭიმული ტონიკა ან დომინანტა ბასში', 'a held tonic or dominant in the bass']]]],
        ['h', 'დაკავება: მომზადება → დაკავება → გახსნა', 'The suspension: preparation → suspension → resolution'],
        ['p', 'ნოტი წინა აკორდიდან <b>რჩება</b>, როცა ჰარმონია იცვლება, ძლიერ დროზე დისონანსად ჟღერს და შემდეგ <b>ნაბიჯით ქვემოთ</b> იხსნება. სახელს ბასიდან ინტერვალები აძლევს: <b>4–3, 7–6, 9–8</b>; ბასში — <b>2–3</b>.', 'A note <b>stays</b> from the previous chord while the harmony changes, sounds as a dissonance on the strong beat, then resolves <b>down by step</b>. Its name comes from the intervals above the bass: <b>4–3, 7–6, 9–8</b>; in the bass, <b>2–3</b>.'],
        ['play', ['4–3 დაკავება G-ზე', '4–3 suspension over G'], { ch: ['G2 D4 G4 C5', 'G2 D4 G4 B4'], gap: 1.2 }],
        ['play', ['გამავალი ბგერები C-ზე', 'Passing tones over C'], { mel: 'C4 D4 E4 F4 G4', gap: .35 }],
        ['h', 'ორგანული პუნქტი', 'The pedal point'],
        ['p', 'ბასი ერთ ნოტზე „ჩერდება“, ზემოთ კი ჰარმონია იცვლება — ხშირად ტონიკაზე (დასასრულში) ან დომინანტაზე (რეპრიზის წინ). ფანდურზე ღია სიმიც ასე მოქმედებს — ბურდონი.', 'The bass “stays” on one note while the harmony moves above it — often the tonic (at the end) or the dominant (before a return). On the panduri an open string does the same — a drone.'],
        ['play', ['დომინანტის პუნქტი: G ბასში', 'A dominant pedal: G in the bass'], { ch: ['G2 C4 E4 G4', 'G2 B3 D4 F4', 'G2 C4 F4 A4', 'G2 B3 D4 G4', 'C3 C4 E4 G4'], gap: .9 }]],
      q: [
        [['4–3 დაკავება როგორ იხსნება?', 'How does a 4–3 suspension resolve?'], [['ნაბიჯით ქვემოთ', 'Down by step'], ['ნაბიჯით ზემოთ', 'Up by step'], ['ნახტომით', 'By leap']], 0, ['კვარტა ტერციაზე ეშვება.', 'The fourth falls to the third.']],
        [['ნახტომით მიდის და ნაბიჯით იხსნება — ეს…', 'Approached by leap, left by step — that is…'], [['აპოჯიატურა', 'an appoggiatura'], ['გამავალი ბგერა', 'a passing tone'], ['ანტიციპაცია', 'an anticipation']], 0, ['აპოჯიატურა ძლიერი დისონანსია ნახტომის შემდეგ.', 'An appoggiatura is a stressed dissonance after a leap.']],
        [['ორგანული პუნქტი ყველაზე ხშირად რომელ საფეხურზეა?', 'A pedal point is most often on which degree?'], [['ტონიკა ან დომინანტა', 'Tonic or dominant'], ['სუბდომინანტა', 'Subdominant'], ['II საფეხური', 'The 2nd degree']], 0, ['I და V ყველაზე მყარი ბასებია.', 'I and V are the steadiest basses.']]] },

    { id: 'modulation', t: ['მოდულაცია და მეორადი დომინანტები', 'Modulation and secondary dominants'],
      lead: ['როგორ გადადის მუსიკა ერთი ტონალობიდან მეორეში.', 'How music moves from one key to another.'],
      b: [
        ['h', 'მეორადი დომინანტები', 'Secondary dominants'],
        ['p', 'ნებისმიერ მაჟორულ ან მინორულ აკორდს შეიძლება თავისი დომინანტა ჰქონდეს. <b>V/V</b> („დომინანტა დომინანტისა“) დო მაჟორში არის <b>D7</b> — ის G-ს მიუთითებს, როგორც G7 — C-ს. მასში F♯ ჩნდება: ტონალობის გარეშე ნოტი, რომელიც G-ის „შესავალი ტონია“.', 'Any major or minor chord can have its own dominant. <b>V/V</b> (“five of five”) in C major is <b>D7</b> — it points to G the way G7 points to C. It brings F♯: a note from outside the key, the “leading tone” of G.'],
        ['tb', [['ფუნქცია', 'Function'], ['C მაჟორში', 'In C major'], ['გახსნა', 'Resolves to']], [['V/ii', 'A7', 'Dm'], ['V/iii', 'B7', 'Em'], ['V/IV', 'C7', 'F'], ['V/V', 'D7', 'G'], ['V/vi', 'E7', 'Am']]],
        ['play', ['C → A7 → Dm → G7 → C', 'C → A7 → Dm → G7 → C'], { ch: ['C3 G3 C4 E4', 'A2 G3 C#4 E4', 'D3 F3 A3 D4', 'G2 F3 B3 D4', 'C3 E3 G3 C4'], gap: 1 }],
        ['h', 'გადახრა და მოდულაცია', 'Tonicization and modulation'],
        ['p', '<b>გადახრა</b> (ტონიკალიზაცია) — მოკლე „სტუმრობაა“ სხვა აკორდზე, მისი დომინანტით, სახლის დაუტოვებლად. <b>მოდულაცია</b> — ნამდვილი გადასვლა: ახალი ტონალობა <b>კადანსით</b> მტკიცდება და მუსიკა იქ რჩება.', '<b>Tonicization</b> is a short “visit” to another chord, through its dominant, without leaving home. <b>Modulation</b> is a real move: the new key is <b>confirmed by a cadence</b> and the music stays there.'],
        ['h', 'ახლო ტონალობები', 'Closely related keys'],
        ['p', 'ახლოა ტონალობა, რომელიც <b>ერთზე მეტი ნიშნით</b> არ განსხვავდება. დო მაჟორისთვის: <b>G, F, Am, Em, Dm</b> — დომინანტა, სუბდომინანტა და სამივეს პარალელური მინორი. კვინტების წრეზე ისინი მეზობლები არიან.', 'A key is close when it differs by <b>no more than one sign</b>. For C major: <b>G, F, Am, Em, Dm</b> — the dominant, the subdominant and the relative minors of all three. On the circle of fifths they are neighbours.'],
        ['h', 'მოდულაცია საერთო აკორდით', 'Pivot-chord modulation'],
        ['p', 'ყველაზე რბილი გზა: აკორდი, რომელიც <b>ორივე ტონალობაში</b> არსებობს. C → G: <b>Am</b> არის vi დო მაჟორში და ii სოლ მაჟორში. Am-ის შემდეგ D7 (G-ის დომინანტა) და G — ახალი ტონალობა დამტკიცებულია.', 'The smoothest way: a chord that exists <b>in both keys</b>. C → G: <b>Am</b> is vi in C and ii in G. After Am comes D7 (the dominant of G) and G — the new key is confirmed.'],
        ['play', ['C → Am (საერთო) → D7 → G', 'C → Am (pivot) → D7 → G'], { ch: ['C3 G3 C4 E4', 'A2 A3 C4 E4', 'D3 F#3 C4 D4', 'G2 G3 B3 D4'], gap: 1.1 }],
        ['ul', [
          ['<b>პირდაპირი</b> (ფრაზული) მოდულაცია: ახალი ფრაზა უბრალოდ ახალ ტონალობაში იწყება.', '<b>Direct</b> (phrase) modulation: the new phrase simply starts in the new key.'],
          ['<b>ქრომატიული</b>: ერთი ხმა ნახევარტონით ინაცვლებს და ახალ ტონალობას ხსნის.', '<b>Chromatic</b>: one voice moves by a semitone and opens the new key.'],
          ['<b>ენჰარმონიული</b>: აკორდს სხვა სახელით ვკითხულობთ — მაგ. შემცირებული სეპტაკორდი ოთხ სხვადასხვა ტონალობაში შეიძლება გაიხსნას.', '<b>Enharmonic</b>: a chord is re-spelled — a diminished seventh, for instance, can resolve into four different keys.']]]],
      q: [
        [['V/V დო მაჟორში:', 'V/V in C major:'], ['D7', 'G7', 'A7'], 0, ['G-ის დომინანტა — D F♯ A C.', 'The dominant of G — D F♯ A C.']],
        [['რომელი არ არის დო მაჟორის ახლო ტონალობა?', 'Which is not closely related to C major?'], ['D', 'G', 'Am'], 0, ['D მაჟორს ორი დიეზი აქვს.', 'D major has two sharps.']],
        [['C → G მოდულაციისას საერთო აკორდი შეიძლება იყოს…', 'In C → G, a pivot chord can be…'], ['Am', 'F', 'B♭'], 0, ['Am = vi დოში და ii სოლში.', 'Am = vi in C and ii in G.']]] },

    { id: 'chromatic', t: ['ქრომატიული ჰარმონია', 'Chromatic harmony'],
      lead: ['ნასესხები აკორდები, ნეაპოლიტანური სექსტაკორდი, გადიდებული სექსტის აკორდები.', 'Borrowed chords, the Neapolitan sixth, augmented sixth chords.'],
      b: [
        ['h', 'ნასესხები აკორდები (მაჟორ-მინორი)', 'Borrowed chords (modal mixture)'],
        ['p', 'მაჟორი თავისი პარალელური <b>მინორიდან</b> „ისესხებს“ აკორდებს — ფერი ბნელდება, ტონიკა კი იგივე რჩება. დო მაჟორში: <b>Fm (iv), A♭ (♭VI), B♭ (♭VII), Dø (iiø)</b>.', 'Major “borrows” chords from its parallel <b>minor</b> — the colour darkens, the tonic stays. In C major: <b>Fm (iv), A♭ (♭VI), B♭ (♭VII), Dø (iiø)</b>.'],
        ['play', ['C → F → Fm → C', 'C → F → Fm → C'], { ch: ['C3 G3 C4 E4', 'F2 A3 C4 F4', 'F2 Ab3 C4 F4', 'C3 G3 C4 E4'], gap: 1.1 }],
        ['h', 'ნეაპოლიტანური სექსტაკორდი', 'The Neapolitan sixth'],
        ['p', '<b>N6</b> — მაჟორული ტრიადა <b>♭II</b> საფეხურზე, პირველ მიმართვაში (ბასში ტერცია). დო მინორში: D♭ F A♭, ბასში F. სუბდომინანტის ფუნქციაა და დომინანტას მიჰყავს — ხშირად კადანსური კვარტსექსტაკორდით: N6 → i6/4 → V → i.', '<b>N6</b> — a major triad on <b>♭II</b>, in first inversion (the third in the bass). In C minor: D♭ F A♭, with F in the bass. It works as a subdominant and leads to the dominant — often through the cadential six-four: N6 → i6/4 → V → i.'],
        ['play', ['N6 → V → i (C მინორი)', 'N6 → V → i (C minor)'], { ch: ['F2 Ab3 Db4 F4', 'G2 G3 B3 D4', 'C3 G3 C4 Eb4'], gap: 1.2 }],
        ['h', 'გადიდებული სექსტის აკორდები', 'Augmented sixth chords'],
        ['p', 'ბასში <b>♭6</b>, ზემოთ <b>♯4</b> — მათ შორის გადიდებული სექსტა, რომელიც <b>გარეთ, ოქტავაზე იხსნება</b> დომინანტის ნოტზე (დო-ში A♭–F♯ → G–G). სამი „ეროვნული“ სახე:', 'In the bass <b>♭6</b>, above it <b>♯4</b> — an augmented sixth between them that <b>opens outward to an octave</b> on the dominant note (in C, A♭–F♯ → G–G). Three “national” kinds:'],
        ['tb', [['სახე', 'Type'], ['ნოტები (C)', 'Notes (C)'], ['საფეხურები', 'Degrees']], [
          [['იტალიური It+6', 'Italian It+6'], 'A♭ C F♯', '♭6 1 ♯4'],
          [['ფრანგული Fr+6', 'French Fr+6'], 'A♭ C D F♯', '♭6 1 2 ♯4'],
          [['გერმანული Ger+6', 'German Ger+6'], 'A♭ C E♭ F♯', '♭6 1 ♭3 ♯4']]],
        ['play', ['Ger+6 → i6/4 → V (C მინორი)', 'Ger+6 → i6/4 → V (C minor)'], { ch: ['Ab2 C4 Eb4 F#4', 'G2 C4 Eb4 G4', 'G2 B3 D4 G4'], gap: 1.2 }],
        ['note', 'გერმანული +6 პირდაპირ V-ზე პარალელურ კვინტებს იძლევა (A♭–E♭ → G–D), ამიტომ შუაში ჩვეულებრივ კადანსური კვარტსექსტაკორდი დგება.', 'The German +6 straight to V gives parallel fifths (A♭–E♭ → G–D), so the cadential six-four usually stands between them.'],
        ['h', 'შემცირებული სეპტაკორდი — ოთხი კარი', 'The diminished seventh — four doors'],
        ['p', 'B D F A♭ მხოლოდ პატარა ტერციებისგანაა, ამიტომ მისი ნებისმიერი ნოტი შეიძლება „შესავალი ტონი“ იყოს: B → C, D → E♭, F → G♭, A♭(G♯) → A. ერთი აკორდი — ოთხი ტონალობა.', 'B D F A♭ is made only of minor thirds, so any of its notes can be a “leading tone”: B → C, D → E♭, F → G♭, A♭(G♯) → A. One chord — four keys.']],
      q: [
        [['N6 ლა მინორში:', 'N6 in A minor:'], [['B♭ მაჟორი, ბასში D', 'B♭ major, D in the bass'], ['B მაჟორი', 'B major'], ['Dm', 'Dm']], 0, ['♭II = B♭ (B♭ D F), პირველი მიმართვა — ბასში D.', '♭II = B♭ (B♭ D F), first inversion — D in the bass.']],
        [['გადიდებული სექსტა საით იხსნება?', 'Where does the augmented sixth resolve?'], [['გარეთ, ოქტავაზე', 'Outward, to an octave'], ['შიგნით, ტერციაზე', 'Inward, to a third'], ['რჩება', 'It stays']], 0, ['A♭ ქვემოთ, F♯ ზემოთ — ორივე G-ზე.', 'A♭ down, F♯ up — both to G.']],
        [['♭VI დო მაჟორში (ნასესხები):', '♭VI in C major (borrowed):'], ['A♭', 'Am', 'A'], 0, ['დო მინორიდან: A♭ C E♭.', 'From C minor: A♭ C E♭.']]] },

    { id: 'form', t: ['მუსიკალური ფორმა', 'Musical form'],
      lead: ['მოტივიდან სონატურ ფორმამდე.', 'From the motive to sonata form.'],
      b: [
        ['tb', [['ერთეული', 'Unit'], ['რა არის', 'What it is']], [
          [['მოტივი', 'Motive'], ['უმცირესი ცნობადი იდეა — რამდენიმე ნოტი და რიტმი', 'the smallest recognisable idea — a few notes and a rhythm']],
          [['ფრაზა', 'Phrase'], ['აზრი, რომელიც კადანსით მთავრდება (ხშირად 4 ტაქტი)', 'a thought that ends with a cadence (often 4 bars)']],
          [['პერიოდი', 'Period'], ['ორი ფრაზა: „კითხვა“ (ნახევარი კადანსი) და „პასუხი“ (ავთენტური)', 'two phrases: a “question” (half cadence) and an “answer” (authentic)']],
          [['წინადადება', 'Sentence'], ['ძირითადი იდეა × 2, შემდეგ გაგრძელება და კადანსი (2 + 2 + 4)', 'basic idea × 2, then continuation and cadence (2 + 2 + 4)']]]],
        ['h', 'დიდი ფორმები', 'Larger forms'],
        ['ul', [
          ['<b>ორნაწილიანი</b> (A B): მეორე ნაწილი ახალია; „მომრგვალებულ“ ორნაწილიანში ბოლოს A-ს დასაწყისი ბრუნდება.', '<b>Binary</b> (A B): the second part is new; in <b>rounded binary</b> the start of A returns at the end.'],
          ['<b>სამნაწილიანი</b> (A B A): კონტრასტი და დაბრუნება — სიმღერის, მენუეტის, ნოქტიურნის ფორმა.', '<b>Ternary</b> (A B A): contrast and return — the form of many songs, minuets, nocturnes.'],
          ['<b>რონდო</b> (A B A C A): რეფრენი ბრუნდება, შუაში — ეპიზოდები.', '<b>Rondo</b> (A B A C A): a refrain keeps returning, with episodes between.'],
          ['<b>ვარიაციები</b>: თემა და მისი ცვლილებები — მელოდია, ჰარმონია, რიტმი, ფაქტურა.', '<b>Theme and variations</b>: a theme and its transformations — melody, harmony, rhythm, texture.']]],
        ['h', 'სონატური ფორმა', 'Sonata form'],
        ['tb', [['ნაწილი', 'Section'], ['შინაარსი', 'Content']], [
          [['ექსპოზიცია', 'Exposition'], ['მთავარი პარტია ტონიკაში → გადასვლა → თანამდევი პარტია დომინანტაში (მინორში — პარალელურ მაჟორში) → დასკვნითი', 'first theme in the tonic → transition → second theme in the dominant (in minor, the relative major) → closing']],
          [['დამუშავება', 'Development'], ['თემების ნაწილები, მოდულაციები, დაძაბულობის ზრდა', 'pieces of the themes, modulations, rising tension']],
          [['რეპრიზა', 'Recapitulation'], ['ორივე თემა ბრუნდება — ახლა ორივე ტონიკაში', 'both themes return — now both in the tonic']],
          [['კოდა', 'Coda'], ['დასრულება', 'the ending']]]],
        ['p', 'სონატური ფორმის არსი ტონალური დრამაა: ექსპოზიციაში ორი ტონალობა უპირისპირდება, რეპრიზაში კი თანამდევი პარტიაც სახლში ბრუნდება.', 'The heart of sonata form is a drama of keys: the exposition sets two keys against each other, and in the recapitulation the second theme comes home too.']],
      q: [
        [['პერიოდის პირველი ფრაზა ჩვეულებრივ მთავრდება…', 'A period\'s first phrase usually ends with…'], [['ნახევარი კადანსით', 'a half cadence'], ['ავთენტური კადანსით', 'an authentic cadence'], ['მოდულაციით', 'a modulation']], 0, ['„კითხვა“ V-ზე ჩერდება.', 'The “question” stops on V.']],
        [['რეპრიზაში თანამდევი პარტია რომელ ტონალობაშია?', 'In the recapitulation the second theme is in…'], [['ტონიკაში', 'the tonic'], ['დომინანტაში', 'the dominant'], ['სუბდომინანტაში', 'the subdominant']], 0, ['ორივე თემა სახლში ბრუნდება.', 'Both themes come home.']],
        [['A B A C A —', 'A B A C A is…'], [['რონდო', 'a rondo'], ['სამნაწილიანი ფორმა', 'ternary form'], ['ვარიაციები', 'variations']], 0, ['რეფრენი A ბრუნდება.', 'The refrain A returns.']]] },

    { id: 'counterpoint', t: ['კონტრაპუნქტი', 'Counterpoint'],
      lead: ['ხმების ერთად სიარული: სახეობები, მოძრაობის ტიპები, კანონი და ფუგა.', 'Voices that move together: the species, the kinds of motion, canon and fugue.'],
      b: [
        ['p', '<b>კონტრაპუნქტი</b> რამდენიმე დამოუკიდებელი მელოდიის ერთად შეთავსებაა. ჰარმონია აკორდებს უყურებს „ვერტიკალურად“, კონტრაპუნქტი — ხმებს „ჰორიზონტალურად“.', '<b>Counterpoint</b> is fitting several independent melodies together. Harmony looks at chords “vertically”; counterpoint at the voices “horizontally”.'],
        ['h', 'მოძრაობის ოთხი სახე', 'The four kinds of motion'],
        ['ul', [['<b>პარალელური</b>: ერთი მიმართულებით, ერთი ინტერვალით.', '<b>Parallel</b>: same direction, same interval.'], ['<b>პირდაპირი</b>: ერთი მიმართულებით, სხვადასხვა ინტერვალით.', '<b>Similar</b>: same direction, different intervals.'], ['<b>საწინააღმდეგო</b>: საპირისპიროდ — ყველაზე დამოუკიდებელი.', '<b>Contrary</b>: opposite directions — the most independent.'], ['<b>ირიბი</b>: ერთი ხმა დგას, მეორე მოძრაობს.', '<b>Oblique</b>: one voice holds, the other moves.']]],
        ['h', 'ხუთი სახეობა (Fux)', 'The five species (Fux)'],
        ['tb', [['სახეობა', 'Species'], ['რიტმი cantus firmus-ზე', 'Rhythm against the cantus firmus'], ['დისონანსი', 'Dissonance']], [
          ['1', ['ნოტი ნოტზე', 'note against note'], ['არა — მხოლოდ კონსონანსი', 'none — consonances only']],
          ['2', ['ორი ნოტი ერთზე', 'two against one'], ['სუსტ დროზე, გამავალი', 'on the weak beat, passing']],
          ['3', ['ოთხი ნოტი ერთზე', 'four against one'], ['გამავალი და დამხმარე', 'passing and neighbour']],
          ['4', ['სინკოპები', 'syncopations'], ['დაკავებები, ქვემოთ გახსნით', 'suspensions, resolving down']],
          ['5', ['თავისუფალი (ფლორიდული)', 'free (florid)'], ['ყველა ზემოთქმული', 'all of the above']]]],
        ['ul', [
          ['დაიწყე და დაასრულე <b>სრულ კონსონანსზე</b> (პრიმა, კვინტა, ოქტავა).', 'Begin and end on a <b>perfect consonance</b> (unison, fifth, octave).'],
          ['<b>არანაირი პარალელური კვინტა და ოქტავა</b>; ურჩიე საწინააღმდეგო მოძრაობა.', '<b>No parallel fifths or octaves</b>; prefer contrary motion.'],
          ['მელოდია უმეტესად <b>ნაბიჯებით</b>; დიდი ნახტომის შემდეგ — საპირისპირო ნაბიჯი.', 'Move mostly <b>by step</b>; after a large leap, step back the other way.'],
          ['ერთი მწვერვალი — მელოდიის უმაღლესი ნოტი ერთხელ.', 'One climax — the melody\'s highest note, once.']]],
        ['play', ['საწინააღმდეგო მოძრაობა: ოქტავიდან ოქტავამდე', 'Contrary motion: octave to octave'], { ch: ['C3 C4', 'B2 D4', 'A2 E4', 'G2 G4', 'A2 F4', 'B2 D4', 'C3 C4'], gap: .55 }],
        ['h', 'კანონი და ფუგა', 'Canon and fugue'],
        ['p', '<b>კანონი</b>: ერთი მელოდია სხვადასხვა ხმაში დაგვიანებით მეორდება. <b>ფუგა</b>: <b>თემა</b> (subject) ჯერ ერთ ხმაში, შემდეგ <b>პასუხი</b> კვინტაზე (ზუსტი ან ტონალური), ამ დროს პირველი ხმა <b>კონტრასუბიექტს</b> უკრავს. თემის შესვლებს შორის <b>ინტერლუდიები</b>ა (ეპიზოდები), ბოლოსკენ — <b>სტრეტა</b>: შესვლები ერთმანეთს ეფარება.', '<b>Canon</b>: one melody repeated in different voices, each starting later. <b>Fugue</b>: the <b>subject</b> in one voice, then the <b>answer</b> at the fifth (real or tonal) while the first voice plays the <b>countersubject</b>. Between entries come <b>episodes</b>; near the end, <b>stretto</b>: entries overlap.']],
      q: [
        [['პირველი სახეობა:', 'First species is:'], [['ნოტი ნოტზე', 'note against note'], ['ორი ნოტი ერთზე', 'two against one'], ['სინკოპები', 'syncopations']], 0, ['მხოლოდ კონსონანსები, ერთი ერთზე.', 'Consonances only, one against one.']],
        [['ფუგის პასუხი ჩვეულებრივ რა ინტერვალზეა?', 'A fugue\'s answer is usually at…'], [['კვინტაზე', 'the fifth'], ['ტერციაზე', 'the third'], ['სეკუნდაზე', 'the second']], 0, ['დომინანტაზე — ზემოთ კვინტა ან ქვემოთ კვარტა.', 'On the dominant — a fifth up or a fourth down.']],
        [['ყველაზე დამოუკიდებელი მოძრაობა:', 'The most independent motion:'], [['საწინააღმდეგო', 'Contrary'], ['პარალელური', 'Parallel'], ['პირდაპირი', 'Similar']], 0, ['ხმები საპირისპიროდ მიდიან.', 'The voices go opposite ways.']]] },

    { id: 'metre', t: ['მეტრი და რიტმი სიღრმეში', 'Metre and rhythm in depth'],
      lead: ['მარტივი და რთული ზომები, ასიმეტრია, სინკოპა, ჰემიოლა, პოლირიტმი.', 'Simple and compound metres, asymmetry, syncopation, hemiola, polyrhythm.'],
      b: [
        ['tb', [['ზომა', 'Metre'], ['სახე', 'Kind'], ['დათვლა', 'Count']], [
          ['2/4 · 3/4 · 4/4', ['მარტივი: დარტყმა ორად იყოფა', 'simple: the beat divides in two'], '1 & 2 &'],
          ['6/8 · 9/8 · 12/8', ['რთული: დარტყმა სამად იყოფა', 'compound: the beat divides in three'], '1 2 3 4 5 6 → 1 · 2'],
          ['5/8 · 7/8', ['ასიმეტრიული: გრძელი და მოკლე დარტყმები', 'asymmetric: long and short beats'], '3+2 · 2+2+3']]],
        ['p', '3/4 და 6/8 ერთნაირ ნოტებს იტევს, მაგრამ სხვანაირად ჟღერს: 3/4 — სამი დარტყმა (1 2 3), 6/8 — ორი დარტყმა, თითო სამად დაყოფილი (1 2 3 4 5 6). ასიმეტრიული ზომის ცნობილი მაგალითია <b>ხორუმი</b>: 5/8 = 3/8 + 2/8, „1-2-3, 1-2“.', '3/4 and 6/8 hold the same notes but sound different: 3/4 is three beats (1 2 3), 6/8 is two beats each split in three (1 2 3 4 5 6). A well-known asymmetric metre is <b>Khorumi</b>: 5/8 = 3/8 + 2/8, “1-2-3, 1-2”.'],
        ['play', ['3/4: 1 2 3 · 1 2 3', '3/4: 1 2 3 · 1 2 3'], { mel: 'C5 G4 G4 C5 G4 G4', gap: .42 }],
        ['play', ['6/8: 1 2 3 4 5 6', '6/8: 1 2 3 4 5 6'], { mel: 'C5 G4 G4 E5 G4 G4', gap: .28 }],
        ['play', ['5/8 = 3 + 2', '5/8 = 3 + 2'], { mel: 'C5 G4 G4 E5 G4 C5 G4 G4 E5 G4', gap: .22 }],
        ['h', 'სინკოპა, ჰემიოლა, პოლირიტმი', 'Syncopation, hemiola, polyrhythm'],
        ['ul', [
          ['<b>სინკოპა</b>: მახვილი სუსტ დროზე ან დარტყმებს შორის — ძლიერი დრო „იცდება“.', '<b>Syncopation</b>: the accent on a weak beat or between beats — the strong beat is “skipped”.'],
          ['<b>ჰემიოლა</b>: ორი ტაქტი 3/4 ჟღერს, როგორც ერთი 3/2 (სამი გრძელი დარტყმა) — ბაროკოს კადანსების წინ ხშირია.', '<b>Hemiola</b>: two bars of 3/4 sound like one bar of 3/2 (three long beats) — common before Baroque cadences.'],
          ['<b>პოლირიტმი</b>: ორი დაყოფა ერთად — 3 : 2 (სამი ორის წინააღმდეგ), 4 : 3. ტრიოლი — სამი ნოტი ორის დროში.', '<b>Polyrhythm</b>: two divisions at once — 3 : 2 (three against two), 4 : 3. A triplet is three notes in the time of two.'],
          ['<b>ანაკრუზა</b> (ზეტაქტი): ფრაზა პირველი ძლიერი დროის წინ იწყება.', '<b>Anacrusis</b> (upbeat): the phrase starts before the first strong beat.']]],
        ['play', ['პოლირიტმი 3 : 2', 'Polyrhythm 3 : 2'], { ch: ['C3 G4', 'G4', 'C3', 'G4', 'C3 G4', 'G4', 'C3', 'G4'], gap: [.4, .2, .2, .4, .4, .2, .2, .4] }]],
      q: [
        [['6/8 არის…', '6/8 is…'], [['რთული ორწილადი', 'compound duple'], ['მარტივი სამწილადი', 'simple triple'], ['ასიმეტრიული', 'asymmetric']], 0, ['ორი დარტყმა, თითო სამად.', 'Two beats, each in three.']],
        [['ორი ტაქტი 3/4, რომელიც 3/2-ად ჟღერს —', 'Two bars of 3/4 heard as 3/2 is…'], [['ჰემიოლა', 'a hemiola'], ['სინკოპა', 'a syncopation'], ['ანაკრუზა', 'an anacrusis']], 0, ['სამი გრძელი დარტყმა ორი ტაქტის ნაცვლად.', 'Three long beats in place of two bars.']],
        [['ხორუმის ზომა:', 'Khorumi\'s metre:'], ['5/8 = 3 + 2', '6/8', '7/8 = 2 + 2 + 3'], 0, ['„1-2-3, 1-2“.', '“1-2-3, 1-2”.']]] }
  ];

  const JAZZ = window.PD_ADV_JAZZ || [];
  return { CONS, JAZZ };
})();
