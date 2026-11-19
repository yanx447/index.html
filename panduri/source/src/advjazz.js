/* =====================================================================
   The jazz course of the advanced theory book (data; drawn by
   advtheory.js). What a jazz school teaches: chord symbols and tensions,
   ii–V–I, chord-scale theory, voicings, substitutions, the blues, the
   bebop language, swing and comping, the standard forms, how to practise
   improvising. General music theory. In the app only (APP_ONLY).
   ===================================================================== */
'use strict';
PD.advData.JAZZ = [
  { id: 'symbols', t: ['აკორდის სიმბოლოები და გაფართოებები', 'Chord symbols and extensions'],
    lead: ['როგორ იკითხება ჯაზის აკორდი და რომელი ბგერები ემატება მას.', 'How a jazz chord is read, and which notes can be added to it.'],
    b: [
      ['tb', [['სიმბოლო', 'Symbol'], ['სახელი', 'Name'], ['C-დან', 'On C']], [
        ['Cmaj7 · CΔ7', ['დიდი სეპტაკორდი', 'major seventh'], 'C E G B'], ['C7', ['დომინანტა', 'dominant seventh'], 'C E G B♭'],
        ['Cm7 · C–7', ['მინორული სეპტაკორდი', 'minor seventh'], 'C E♭ G B♭'], ['Cø · Cm7♭5', ['ნახევრად შემცირებული', 'half-diminished'], 'C E♭ G♭ B♭'],
        ['C°7 · Cdim7', ['შემცირებული', 'diminished'], 'C E♭ G♭ A'], ['C6 · Cm6', ['სექსტით', 'sixth chords'], 'C E G A · C E♭ G A'],
        ['C7sus4', ['კვარტით, ტერციის ნაცვლად', 'fourth instead of the third'], 'C F G B♭'], ['Cm(maj7)', ['მინორი დიდი სეპტიმით', 'minor with a major seventh'], 'C E♭ G B']]],
      ['h', 'გაფართოებები: 9, 11, 13', 'Extensions: 9, 11, 13'],
      ['p', 'სეპტაკორდზე ტერციების დალაგება გრძელდება: <b>9 = 2, 11 = 4, 13 = 6</b>, ოქტავით მაღლა. C13 სრულად C E G B♭ D F A-ა, მაგრამ არასოდეს ვუკრავთ ყველას — ტონიკა და კვინტა ხშირად გამოიტოვება, ხოლო 11 დომინანტაზე ტერციას ეჯახება.', 'The stack of thirds goes on above the seventh: <b>9 = 2, 11 = 4, 13 = 6</b>, an octave up. C13 in full is C E G B♭ D F A, but never all of it is played — the root and fifth are often left out, and the 11 clashes with the third on a dominant.'],
      ['tb', [['აკორდი', 'Chord'], ['ხელმისაწვდომი გაფართოებები', 'Available tensions'], ['თავიდან ასარიდებელი', 'Avoid']], [
        ['maj7', '9 · ♯11 · 13', ['11 (ტერციასთან პატარა სეკუნდა)', '11 (a minor 9th over the third)']],
        ['m7', '9 · 11 · 13', ['—', '—']],
        ['7', ['9 · 13 (ნატურალური) · ♭9 ♯9 ♯11 ♭13 (ალტერაციები)', '9 · 13 (natural) · ♭9 ♯9 ♯11 ♭13 (altered)'], ['11 — მაშინ sus4', '11 — then use sus4']],
        ['ø', '9 · 11 · ♭13', ['♭9 (ხშირად)', '♭9 (usually)']]]],
      ['play', ['Cmaj9 · C13 · Cm11', 'Cmaj9 · C13 · Cm11'], { ch: ['C3 E3 B3 D4 G4', 'C3 Bb3 E4 A4', 'C3 Bb3 Eb4 F4 D5'], gap: 1.3 }]],
    q: [
      [['C13-ში რომელი ნოტია 13?', 'In C13, which note is the 13?'], ['A', 'F', 'D'], 0, ['13 = სექსტა ოქტავით მაღლა: A.', '13 = the sixth an octave up: A.']],
      [['Cø-ის ნოტები:', 'The notes of Cø:'], ['C E♭ G♭ B♭', 'C E♭ G♭ A', 'C E G B♭'], 0, ['შემცირებული ტრიადა + პატარა სეპტიმა.', 'A diminished triad + a minor seventh.']],
      [['Cmaj7-ზე ასარიდებელი ბგერა:', 'The avoid note on Cmaj7:'], [['F (11)', 'F (11)'], ['D (9)', 'D (9)'], ['A (13)', 'A (13)']], 0, ['F ტერციას (E) ზემოდან პატარა ნონით ეჯახება.', 'F sits a minor ninth above the third (E).']]] },

  { id: 'iivi', t: ['ii – V – I', 'ii – V – I'],
    lead: ['ჯაზის ყველაზე მნიშვნელოვანი გადასვლა — მაჟორში და მინორში — და მისი სახელმძღვანელო ბგერები.', 'The most important progression in jazz — in major and minor — and its guide tones.'],
    b: [
      ['p', 'სტანდარტების უმეტესობა ii – V – I-ების ჯაჭვია: <b>Dm7 – G7 – Cmaj7</b> დო მაჟორში. ესაა S → D → T, სეპტაკორდებით.', 'Most standards are chains of ii – V – I: <b>Dm7 – G7 – Cmaj7</b> in C major. It is S → D → T, with sevenths.'],
      ['h', 'სახელმძღვანელო ბგერები (guide tones)', 'Guide tones'],
      ['p', 'აკორდის ხასიათს <b>ტერცია და სეპტიმა</b> განსაზღვრავს. ii – V – I-ზე ისინი ნახევარტონით ან ადგილზე მოძრაობენ: <b>C → B → B</b> და <b>F → F → E</b>. ეს ორი ხაზი თავისთავად „მღერის“ ჰარმონიას — ბასის გარეშეც.', 'The <b>third and seventh</b> decide a chord\'s character. Over ii – V – I they move by a semitone or stay: <b>C → B → B</b> and <b>F → F → E</b>. These two lines “sing” the harmony on their own — even without a bass.'],
      ['play', ['ii – V – I · shell voicing-ებით', 'ii – V – I · shell voicings'], { ch: ['D3 C4 F4', 'G2 B3 F4', 'C3 B3 E4'], gap: 1.2 }],
      ['play', ['მხოლოდ guide tones', 'Guide tones alone'], { ch: ['F3 C4', 'F3 B3', 'E3 B3'], gap: 1 }],
      ['h', 'მინორული ii – V – i', 'The minor ii – V – i'],
      ['p', 'მინორში ii ნახევრად შემცირებულია, V კი ხშირად ♭9-ით: <b>Dø – G7♭9 – Cm6</b> (ან Cm(maj7)). ♭9 (A♭) ჰარმონიული მინორიდან მოდის.', 'In minor, ii is half-diminished and V often carries ♭9: <b>Dø – G7♭9 – Cm6</b> (or Cm(maj7)). The ♭9 (A♭) comes from harmonic minor.'],
      ['play', ['Dø – G7♭9 – Cm6', 'Dø – G7♭9 – Cm6'], { ch: ['D3 Ab3 C4 F4', 'G2 F3 Ab3 B3', 'C3 Eb3 G3 A3'], gap: 1.2 }],
      ['h', 'ტერნარაუნდები', 'Turnarounds'],
      ['ul', [['<b>I – vi – ii – V</b>: Cmaj7 – Am7 – Dm7 – G7 — ფორმის ბოლოს თავისკენ „აბრუნებს“.', '<b>I – vi – ii – V</b>: Cmaj7 – Am7 – Dm7 – G7 — turns the form back to its start.'], ['<b>iii – vi – ii – V</b>: Em7 – Am7 – Dm7 – G7.', '<b>iii – vi – ii – V</b>: Em7 – Am7 – Dm7 – G7.'], ['<b>I – VI7 – ii – V</b>: A7 — ii-ს მეორადი დომინანტა.', '<b>I – VI7 – ii – V</b>: A7 — the secondary dominant of ii.']]],
      ['play', ['I – vi – ii – V – I', 'I – vi – ii – V – I'], { ch: ['C3 B3 E4', 'A2 G3 C4', 'D3 C4 F4', 'G2 B3 F4', 'C3 B3 E4'], gap: 1 }]],
    q: [
      [['ii – V – I სი-ბემოლ მაჟორში:', 'ii – V – I in B♭ major:'], ['Cm7 – F7 – B♭maj7', 'Dm7 – G7 – Cmaj7', 'Fm7 – B♭7 – E♭maj7'], 0, ['B♭-ის ii = C, V = F.', 'B♭\'s ii = C, V = F.']],
      [['guide tones არის…', 'Guide tones are…'], [['ტერცია და სეპტიმა', 'the third and the seventh'], ['ტონიკა და კვინტა', 'the root and the fifth'], ['9 და 13', '9 and 13']], 0, ['ისინი აკორდის სახეს განსაზღვრავენ.', 'They define the chord\'s quality.']],
      [['მინორულ ii – V – i-ში ii არის…', 'In a minor ii – V – i, ii is…'], [['ნახევრად შემცირებული', 'half-diminished'], ['მინორული სეპტაკორდი', 'a minor seventh'], ['დომინანტა', 'a dominant']], 0, ['Dø ცე მინორში.', 'Dø in C minor.']]] },

  { id: 'chordscale', t: ['აკორდი და გამა (chord-scale)', 'Chord-scale theory'],
    lead: ['რომელი გამა ჟღერს რომელ აკორდზე — იმპროვიზაციის რუკა.', 'Which scale sounds over which chord — the improviser\'s map.'],
    b: [
      ['p', 'ყოველ აკორდს თავისი „ფერი“ აქვს და მას შეესაბამება გამა, რომლის ნოტებიც ამ აკორდის ბგერებს და გაფართოებებს მოიცავს.', 'Every chord has its own colour, and a scale whose notes contain that chord\'s tones and tensions.'],
      ['tb', [['აკორდი', 'Chord'], ['გამა', 'Scale'], ['მაგალითი', 'Example']], [
        ['maj7', ['იონიური · ლიდიური (♯11)', 'Ionian · Lydian (♯11)'], 'C: C D E F♯ G A B'],
        ['m7', ['დორიული', 'Dorian'], 'Dm7: D E F G A B C'],
        ['7', ['მიქსოლიდიური', 'Mixolydian'], 'G7: G A B C D E F'],
        ['7♯11', ['ლიდიური დომინანტა (მელ. მინორის IV)', 'Lydian dominant (4th mode of melodic minor)'], 'G A B C♯ D E F'],
        ['7alt', ['ალტერირებული (მელ. მინორის VII)', 'altered (7th mode of melodic minor)'], 'G A♭ B♭ B C♯ D♯ F'],
        ['7♭9', ['ნახევარტონი-ტონი დიმინიშ', 'half-whole diminished'], 'G A♭ B♭ B C♯ D E F'],
        ['7♯5', ['მთელტონიანი', 'whole tone'], 'G A B C♯ D♯ F'],
        ['ø', ['ლოკრიული · ლოკრიული ♮2', 'Locrian · Locrian ♮2'], 'Bø: B C D E F G A'],
        ['°7', ['ტონი-ნახევარტონი დიმინიშ', 'whole-half diminished'], 'B° : B C♯ D E F G A♭ B♭'],
        ['m(maj7)', ['მელოდიური მინორი', 'melodic minor'], 'C D E♭ F G A B']]],
      ['play', ['G მიქსოლიდიური', 'G Mixolydian'], { mel: 'G3 A3 B3 C4 D4 E4 F4 G4', gap: .28 }],
      ['play', ['G ალტერირებული', 'G altered'], { mel: 'G3 Ab3 Bb3 B3 C#4 D#4 F4 G4', gap: .28 }],
      ['play', ['G ნახევარტონი-ტონი', 'G half-whole'], { mel: 'G3 Ab3 Bb3 B3 C#4 D4 E4 F4 G4', gap: .26 }],
      ['play', ['G მთელტონიანი', 'G whole tone'], { mel: 'G3 A3 B3 C#4 D#4 F4 G4', gap: .3 }],
      ['note', 'გამა „აკრძალული ნოტების“ სია არ არის — ის აჩვენებს, რომელი ნოტი ჟღერს მშვიდად და რომელი ქმნის დაძაბულობას. აკორდის ბგერები (1 3 5 7) ძლიერ დროზე, დანარჩენი — მათ შორის.', 'A scale is not a list of forbidden notes — it shows which notes sound at rest and which create tension. Chord tones (1 3 5 7) on the strong beats, the rest between them.']],
    q: [
      [['Dm7-ზე (ii) ყველაზე ჩვეული გამა:', 'The usual scale over Dm7 (ii):'], [['დორიული', 'Dorian'], ['ეოლიური', 'Aeolian'], ['ფრიგიული', 'Phrygian']], 0, ['D E F G A B C — დო მაჟორის ნოტები.', 'D E F G A B C — the notes of C major.']],
      [['G7alt-ის გამა რომელი მელოდიური მინორის მოდუსია?', 'The scale of G7alt is a mode of which melodic minor?'], ['A♭', 'G', 'D'], 0, ['A♭ მელ. მინორის VII მოდუსი: G A♭ B♭ C♭ D♭ E♭ F.', 'The 7th mode of A♭ melodic minor: G A♭ B♭ C♭ D♭ E♭ F.']],
      [['7♯11-ზე:', 'Over 7♯11:'], [['ლიდიური დომინანტა', 'Lydian dominant'], ['ლოკრიული', 'Locrian'], ['ეოლიური', 'Aeolian']], 0, ['მიქსოლიდიური ამაღლებული კვარტით.', 'Mixolydian with a raised fourth.']]] },

  { id: 'voicings', t: ['Voicing-ები', 'Voicings'],
    lead: ['shell, rootless, drop 2 და კვარტული აკორდები — როგორ ჟღერს ჯაზის პიანისტი.', 'Shells, rootless, drop 2 and quartal chords — how a jazz pianist sounds.'],
    b: [
      ['ul', [
        ['<b>Shell</b>: ტონიკა + ტერცია + სეპტიმა (1-3-7 ან 1-7-3). ყველაზე მარტივი და მკაფიო.', '<b>Shell</b>: root + third + seventh (1-3-7 or 1-7-3). The simplest and clearest.'],
        ['<b>Rootless</b> (ბილ ევანსის სტილი): ტონიკას ბასისტი უკრავს, პიანისტი კი 3-5-7-9 (A ფორმა) ან 7-9-3-5 (B ფორმა).', '<b>Rootless</b> (the Bill Evans way): the bassist plays the root; the pianist plays 3-5-7-9 (A form) or 7-9-3-5 (B form).'],
        ['<b>Drop 2</b>: ახლო განლაგებიდან ზემოდან მეორე ნოტი ოქტავით დაბლა ჩამოდის — გიტარისა და სექციების ჟღერადობა.', '<b>Drop 2</b>: from a close voicing, the second note from the top drops an octave — the sound of guitar and horn sections.'],
        ['<b>კვარტული</b>: აკორდი კვარტებით, ტერციების ნაცვლად — ღია, მოდალური ფერი („So What“: E A D G B).', '<b>Quartal</b>: a chord in fourths instead of thirds — open, modal colour (“So What”: E A D G B).']]],
      ['tb', [['', 'Dm7', 'G7', 'Cmaj7']], [
        ['Rootless', 'F A C E (A)', 'F A B E (B: 7 9 3 13)', 'E G B D (A)']]],
      ['p', 'ხმები მეზობელ ნოტებზე გადადიან: F → F → E, A → A → G, C → B → B, E → E → D. ხელი თითქმის არ მოძრაობს — ჰარმონია კი სრულად ისმის.', 'The voices move to neighbouring notes: F → F → E, A → A → G, C → B → B, E → E → D. The hand hardly moves — and the harmony is heard in full.'],
      ['play', ['rootless ii – V – I (ბასით)', 'rootless ii – V – I (with bass)'], { ch: ['D2 F3 A3 C4 E4', 'G2 F3 A3 B3 E4', 'C2 E3 G3 B3 D4'], gap: 1.3 }],
      ['play', ['Cmaj7: ახლო → drop 2', 'Cmaj7: close → drop 2'], { ch: ['C4 E4 G4 B4', 'G3 C4 E4 B4'], gap: 1.2 }],
      ['play', ['„So What“ აკორდი', 'The “So What” chord'], { ch: ['E3 A3 D4 G4 B4'], gap: 1.5 }]],
    q: [
      [['Dm7-ის rootless A ფორმა:', 'The rootless A form of Dm7:'], ['F A C E', 'D F A C', 'C E F A'], 0, ['3-5-7-9: F A C E.', '3-5-7-9: F A C E.']],
      [['drop 2-ში რომელი ნოტი ჩამოდის?', 'In drop 2, which note drops?'], [['ზემოდან მეორე', 'the second from the top'], ['ყველაზე ზედა', 'the top one'], ['ყველაზე ქვედა', 'the lowest']], 0, ['ოქტავით დაბლა.', 'An octave down.']],
      [['კვარტული voicing აგებულია…', 'A quartal voicing is built in…'], [['კვარტებით', 'fourths'], ['ტერციებით', 'thirds'], ['სეკუნდებით', 'seconds']], 0, ['E A D G — კვარტები.', 'E A D G — fourths.']]] },

  { id: 'subs', t: ['ჩანაცვლებები', 'Substitutions'],
    lead: ['ტრიტონული ჩანაცვლება, backdoor, გაგრძელებული დომინანტები, გამავალი დიმინიშ, ნასესხები აკორდები.', 'Tritone substitution, the backdoor, extended dominants, passing diminished chords, borrowed chords.'],
    b: [
      ['h', 'ტრიტონული ჩანაცვლება', 'Tritone substitution'],
      ['p', 'G7-ის ტრიტონი B–F ასევე D♭7-შია (C♭–F). ამიტომ <b>G7 შეიძლება D♭7-ით შეიცვალოს</b> — ტონიკიდან ტრიტონით დაშორებული დომინანტა. ბასი ქრომატიულად ეშვება: <b>Dm7 – D♭7 – Cmaj7</b>.', 'G7\'s tritone B–F is also in D♭7 (C♭–F). So <b>G7 can be replaced by D♭7</b> — the dominant a tritone away. The bass falls by semitones: <b>Dm7 – D♭7 – Cmaj7</b>.'],
      ['play', ['Dm7 – G7 – Cmaj7', 'Dm7 – G7 – Cmaj7'], { ch: ['D3 C4 F4', 'G2 B3 F4', 'C3 B3 E4'], gap: 1.1 }],
      ['play', ['Dm7 – D♭7 – Cmaj7', 'Dm7 – D♭7 – Cmaj7'], { ch: ['D3 C4 F4', 'Db3 B3 F4', 'C3 B3 E4'], gap: 1.1 }],
      ['h', 'Backdoor ii – V', 'The backdoor ii – V'],
      ['p', 'ტონიკაში „უკანა კარიდან“: <b>Fm7 – B♭7 – Cmaj7</b> (iv – ♭VII7 – I). B♭7 დო მინორიდან ნასესხებია.', 'Into the tonic through the “back door”: <b>Fm7 – B♭7 – Cmaj7</b> (iv – ♭VII7 – I). B♭7 is borrowed from C minor.'],
      ['play', ['Fm7 – B♭7 – Cmaj7', 'Fm7 – B♭7 – Cmaj7'], { ch: ['F2 Eb3 Ab3', 'Bb2 Ab3 D4', 'C3 B3 E4'], gap: 1.1 }],
      ['h', 'გაგრძელებული დომინანტები და გამავალი დიმინიშ', 'Extended dominants and passing diminished'],
      ['ul', [
        ['<b>დომინანტების ჯაჭვი</b>: E7 – A7 – D7 – G7 – C — ყოველი შემდეგის დომინანტაა, კვინტების წრეზე.', '<b>A chain of dominants</b>: E7 – A7 – D7 – G7 – C — each the dominant of the next, round the circle of fifths.'],
        ['<b>გამავალი დიმინიშ</b>: Cmaj7 – C♯°7 – Dm7 — ბასი ქრომატიულად ადის, C♯°7 მოქმედებს, როგორც A7♭9 ტონიკის გარეშე.', '<b>Passing diminished</b>: Cmaj7 – C♯°7 – Dm7 — the bass climbs by semitones; C♯°7 acts as A7♭9 without its root.'],
        ['<b>ნასესხები</b>: Fm6, A♭maj7, B♭7 მაჟორში — მინორის ფერი.', '<b>Borrowed</b>: Fm6, A♭maj7, B♭7 in major — the colour of minor.'],
        ['<b>კოლტრეინის ცვლილებები</b>: ტონალური ცენტრები დიდი ტერციით (B – G – E♭), რომლებიც ოქტავას სამად ყოფს; ყოველ ცენტრს თავისი დომინანტა მიჰყავს.', '<b>Coltrane changes</b>: key centres a major third apart (B – G – E♭), dividing the octave in three; each centre is reached through its own dominant.']]],
      ['play', ['Cmaj7 – C♯°7 – Dm7', 'Cmaj7 – C♯°7 – Dm7'], { ch: ['C3 E3 G3 B3', 'C#3 E3 G3 Bb3', 'D3 F3 A3 C4'], gap: 1.1 }]],
    q: [
      [['G7-ის ტრიტონული ჩანაცვლება:', 'The tritone substitute of G7:'], ['D♭7', 'D7', 'C♯m7'], 0, ['G-დან ტრიტონი D♭-ია; ტრიტონი B–F საერთოა.', 'A tritone from G is D♭; they share the tritone B–F.']],
      [['backdoor დომინანტა დო მაჟორში:', 'The backdoor dominant in C major:'], ['B♭7', 'G7', 'D♭7'], 0, ['iv – ♭VII7 – I: Fm7 – B♭7 – C.', 'iv – ♭VII7 – I: Fm7 – B♭7 – C.']],
      [['Cmaj7 – C♯°7 – Dm7-ში C♯°7 არის…', 'In Cmaj7 – C♯°7 – Dm7, C♯°7 is…'], [['გამავალი დიმინიშ', 'a passing diminished chord'], ['ტრიტონული ჩანაცვლება', 'a tritone substitute'], ['ნასესხები აკორდი', 'a borrowed chord']], 0, ['ბასი C → C♯ → D.', 'The bass goes C → C♯ → D.']]] },

  { id: 'blues', t: ['ბლუზი', 'The blues'],
    lead: ['12-ტაქტიანი ფორმა — მარტივი, ჯაზის და მინორული — და ბლუზის გამა.', 'The 12-bar form — basic, jazz and minor — and the blues scale.'],
    b: [
      ['tb', [['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']], [
        [['მარტივი (F)', 'Basic (F)'], 'F7', 'F7', 'F7', 'F7', 'B♭7', 'B♭7', 'F7', 'F7', 'C7', 'B♭7', 'F7', 'C7'],
        [['ჯაზის (F)', 'Jazz (F)'], 'F7', 'B♭7', 'F7', 'Cm7 F7', 'B♭7', 'B°7', 'F7', 'D7', 'Gm7', 'C7', 'F7 D7', 'Gm7 C7'],
        [['მინორული (C)', 'Minor (C)'], 'Cm7', 'Cm7', 'Cm7', 'Cm7', 'Fm7', 'Fm7', 'Cm7', 'Cm7', 'A♭7', 'G7', 'Cm7', 'G7']]],
      ['p', 'ჯაზის ბლუზში ჩნდება ii – V-ები (Cm7 – F7 → B♭7; Gm7 – C7 → F), მეორადი დომინანტა D7 (Gm7-ისკენ) და გამავალი B°7. ფორმა ისევ 12 ტაქტია.', 'In the jazz blues come ii – V\'s (Cm7 – F7 → B♭7; Gm7 – C7 → F), the secondary dominant D7 (towards Gm7) and the passing B°7. The form is still 12 bars.'],
      ['play', ['მარტივი ბლუზის პირველი 4 ტაქტი + IV', 'The first bars of the basic blues'], { ch: ['F2 Eb3 A3', 'F2 Eb3 A3', 'Bb2 Ab3 D4', 'Bb2 Ab3 D4', 'F2 Eb3 A3', 'C3 Bb3 E4', 'F2 Eb3 A3'], gap: .9 }],
      ['h', 'ბლუზის გამა', 'The blues scale'],
      ['p', 'მინორული პენტატონიკა + ♭5 („ლურჯი ნოტი“): <b>C E♭ F F♯ G B♭</b>. მას ხშირად მაჟორულ აკორდებზეც უკრავენ — პატარა ტერცია დიდზე „იხრება“: ეს ბლუზის ხმაა.', 'The minor pentatonic + ♭5 (the “blue note”): <b>C E♭ F F♯ G B♭</b>. It is often played over major chords too — the minor third bends into the major one: that is the sound of the blues.'],
      ['play', ['C ბლუზის გამა', 'The C blues scale'], { mel: 'C4 Eb4 F4 F#4 G4 Bb4 C5', gap: .32 }],
      ['play', ['ლურჯი ნოტი: E♭ → E', 'The blue note: E♭ → E'], { mel: 'C4 Eb4 E4 G4', gap: .3 }]],
    q: [
      [['12-ტაქტიან ბლუზში მე-5 ტაქტი:', 'Bar 5 of a 12-bar blues:'], ['IV7', 'V7', 'I7'], 0, ['F-ის ბლუზში B♭7.', 'B♭7 in an F blues.']],
      [['რამდენი ნოტია ბლუზის გამაში?', 'How many notes are in the blues scale?'], ['6', '5', '7'], 0, ['C E♭ F F♯ G B♭.', 'C E♭ F F♯ G B♭.']],
      [['ჯაზის ბლუზში (F) მე-8 ტაქტის D7 არის…', 'In the jazz blues (F), the D7 of bar 8 is…'], [['V/ii (Gm7-ის დომინანტა)', 'V/ii (the dominant of Gm7)'], ['ტრიტონული ჩანაცვლება', 'a tritone substitute'], ['ტონიკა', 'the tonic']], 0, ['D7 → Gm7.', 'D7 → Gm7.']]] },

  { id: 'bebop', t: ['ბიბოპის ენა', 'The bebop language'],
    lead: ['ბიბოპის გამები, შემოხვევა, ქრომატული მიდგომა, არპეჯიოები „3-დან 9-მდე“.', 'Bebop scales, enclosures, chromatic approach, “3 to 9” arpeggios.'],
    b: [
      ['h', 'ბიბოპის დომინანტური გამა', 'The bebop dominant scale'],
      ['p', 'მიქსოლიდიურს ემატება <b>დიდი სეპტიმა გამავალ ბგერად</b>: G A B C D E F F♯ G. რვა ნოტია, ამიტომ მერვედებით სვლისას <b>აკორდის ბგერები ძლიერ დროზე ხვდება</b>.', 'Mixolydian with the <b>major seventh added as a passing note</b>: G A B C D E F F♯ G. Eight notes, so running in eighths <b>puts the chord tones on the beats</b>.'],
      ['play', ['G ბიბოპ-დომინანტი ქვემოთ', 'G bebop dominant, descending'], { mel: 'G4 F#4 F4 E4 D4 C4 B3 A3 G3', gap: .22 }],
      ['p', 'ბიბოპის მაჟორული: C D E F G <b>G♯</b> A B — გამავალი ბგერა კვინტასა და სექსტას შორის.', 'Bebop major: C D E F G <b>G♯</b> A B — a passing note between the fifth and the sixth.'],
      ['h', 'შემოხვევა (enclosure)', 'Enclosure'],
      ['p', 'სამიზნე ნოტს ჯერ ზემოდან და ქვემოდან ვუვლით, შემდეგ ვხვდებით: E-სკენ — <b>F – D♯ – E</b> (დიატონური ზემოთ, ქრომატიული ქვემოთ).', 'Circle the target from above and below, then land on it: towards E — <b>F – D♯ – E</b> (diatonic above, chromatic below).'],
      ['play', ['F – D♯ – E', 'F – D♯ – E'], { mel: 'F4 D#4 E4', gap: .25 }],
      ['h', 'არპეჯიო 3-დან 9-მდე', 'The 3-to-9 arpeggio'],
      ['p', 'G7-ზე ვიწყებთ ტერციიდან: <b>B D F A</b> — Bø-ის არპეჯიო, რომელიც G7-ზე 3 5 7 9-ს იძლევა. ჩარლი პარკერისა და დიზი გილესპის ხაზების ერთ-ერთი საფუძველია.', 'Over G7 start from the third: <b>B D F A</b> — a Bø arpeggio that gives 3 5 7 9 over G7. One of the cornerstones of Charlie Parker\'s and Dizzy Gillespie\'s lines.'],
      ['play', ['G7-ზე: B D F A → C-ზე E', 'Over G7: B D F A → E over C'], { mel: 'B3 D4 F4 A4 G4 E4', gap: .22 }]],
    q: [
      [['G ბიბოპ-დომინანტს რომელი ნოტი ემატება?', 'Which note does G bebop dominant add?'], ['F♯', 'G♯', 'C♯'], 0, ['დიდი სეპტიმა, გამავალი.', 'The major seventh, as a passing note.']],
      [['შემოხვევა არის…', 'An enclosure is…'], [['სამიზნეზე ზემოდან და ქვემოდან მიდგომა', 'approaching a target from above and below'], ['გამის უკუღმა დაკვრა', 'playing a scale backwards'], ['აკორდის გამეორება', 'repeating a chord']], 0, ['F – D♯ – E.', 'F – D♯ – E.']],
      [['3-დან 9-მდე არპეჯიო G7-ზე:', 'The 3-to-9 arpeggio over G7:'], ['B D F A', 'G B D F', 'D F A C'], 0, ['3 5 7 9.', '3 5 7 9.']]] },

  { id: 'swing', t: ['სვინგი, კომპინგი, ფრაზირება', 'Swing, comping, phrasing'],
    lead: ['როგორ „ირხევა“ ჯაზის რიტმი და როგორ აკომპანირებენ.', 'How the jazz rhythm swings, and how players accompany.'],
    b: [
      ['ul', [
        ['<b>სვინგის მერვედები</b>: წყვილის პირველი გრძელია, მეორე მოკლე — დაახლოებით ტრიოლის 2 : 1. სწრაფ ტემპზე უფრო „სწორდება“, ნელზე — უფრო ღრმავდება.', '<b>Swing eighths</b>: the first of each pair long, the second short — about the 2 : 1 of a triplet. Straighter at fast tempos, deeper at slow ones.'],
        ['<b>მეორე და მეოთხე დარტყმა</b> ხაზგასმულია (ჰაი-ჰეტი, თითების ტკაცუნი) — „backbeat“.', '<b>Beats two and four</b> are stressed (the hi-hat, the finger snaps) — the backbeat.'],
        ['<b>კომპინგი</b>: აკორდები არა ყოველ დარტყმაზე, არამედ რიტმული ფრაზებით; კლასიკური — <b>ჩარლსტონი</b>: 1 და „2-ის და“.', '<b>Comping</b>: chords not on every beat, but in rhythmic phrases; the classic is the <b>Charleston</b>: 1 and the “and of 2”.'],
        ['<b>წინსწრება (push)</b>: აკორდი წინა ტაქტის „4-ის და“-ზე ჟღერს.', '<b>Anticipation (push)</b>: the chord sounds on the “and of 4” of the previous bar.'],
        ['<b>Walking bass</b>: მეოთხედებით, აკორდის ბგერები 1-ზე და 3-ზე, მე-4-ზე — ქრომატიული მიდგომა შემდეგ აკორდზე.', '<b>Walking bass</b>: quarter notes, chord tones on 1 and 3, a chromatic approach to the next chord on 4.']]],
      ['play', ['სწორი მერვედები', 'Straight eighths'], { mel: 'G4 E4 G4 E4 G4 E4 G4 E4', gap: .25 }],
      ['play', ['სვინგის მერვედები', 'Swing eighths'], { mel: 'G4 E4 G4 E4 G4 E4 G4 E4', gap: [.333, .167, .333, .167, .333, .167, .333, .167] }],
      ['play', ['ჩარლსტონის კომპინგი (Dm7 – G7)', 'Charleston comping (Dm7 – G7)'], { ch: ['F3 A3 C4 E4', 'F3 A3 C4 E4', 'F3 A3 B3 E4', 'F3 A3 B3 E4'], gap: [.75, 1.25, .75, 1.25] }],
      ['play', ['walking bass: Dm7 – G7 – C', 'Walking bass: Dm7 – G7 – C'], { mel: 'D2 F2 A2 Ab2 G2 B2 D3 Db3 C3', gap: .5 }]],
    q: [
      [['სვინგის მერვედების თანაფარდობა დაახლოებით:', 'Swing eighths are roughly:'], ['2 : 1', '1 : 1', '3 : 1'], 0, ['ტრიოლის პირველი ორი + მესამე.', 'The first two notes of a triplet + the third.']],
      [['backbeat არის…', 'The backbeat is…'], [['2 და 4', 'beats 2 and 4'], ['1 და 3', 'beats 1 and 3'], ['მხოლოდ 1', 'beat 1 only']], 0, ['ჰაი-ჰეტი 2-ზე და 4-ზე.', 'The hi-hat on 2 and 4.']],
      [['ჩარლსტონის რიტმი:', 'The Charleston rhythm:'], [['1 და „2-ის და“', '1 and the “and of 2”'], ['ყოველი დარტყმა', 'every beat'], ['2 და 4', '2 and 4']], 0, ['პუნქტირიანი მეოთხედი + მერვედი.', 'A dotted quarter + an eighth.']]] },

  { id: 'forms', t: ['სტანდარტების ფორმები', 'The forms of the standards'],
    lead: ['AABA, ABAC, ბლუზი, Rhythm changes — და როგორ იკითხება lead sheet.', 'AABA, ABAC, the blues, rhythm changes — and how a lead sheet is read.'],
    b: [
      ['tb', [['ფორმა', 'Form'], ['აგებულება', 'Shape'], ['ტაქტები', 'Bars']], [
        ['AABA', ['ორი A, ბრიჯი (B), ისევ A', 'two A\'s, a bridge (B), A again'], '8 + 8 + 8 + 8 = 32'],
        ['ABAC', ['ორი ნახევარი, მეორე სხვანაირად მთავრდება', 'two halves, the second ending differently'], '8 + 8 + 8 + 8 = 32'],
        [['ბლუზი', 'Blues'], ['ერთი 12-ტაქტიანი ქორუსი', 'one 12-bar chorus'], '12'],
        ['Rhythm changes', ['AABA B♭-ში: A = I – vi – ii – V', 'AABA in B♭: A = I – vi – ii – V'], '32']]],
      ['p', 'Rhythm changes-ის ბრიჯი დომინანტების ჯაჭვია, თითო ორი ტაქტი: <b>D7 – G7 – C7 – F7</b> (III7 – VI7 – II7 – V7) — და ისევ B♭-ში.', 'The bridge of rhythm changes is a chain of dominants, two bars each: <b>D7 – G7 – C7 – F7</b> (III7 – VI7 – II7 – V7) — and back to B♭.'],
      ['play', ['Rhythm changes — ბრიჯი', 'Rhythm changes — the bridge'], { ch: ['D3 C4 F#4', 'G2 F3 B3', 'C3 Bb3 E4', 'F2 Eb3 A3', 'Bb2 A3 D4'], gap: 1.1 }],
      ['h', 'როგორ უკრავენ სტანდარტს', 'How a standard is played'],
      ['ul', [
        ['<b>Lead sheet</b>: მელოდია და აკორდის სიმბოლოები — დანარჩენს მუსიკოსი თვითონ ქმნის.', '<b>Lead sheet</b>: the melody and the chord symbols — the musician makes the rest.'],
        ['<b>Head – solos – head</b>: თემა, შემდეგ სოლოები ფორმის მთლიან „ქორუსებზე“, ბოლოს ისევ თემა.', '<b>Head – solos – head</b>: the theme, then solos over whole “choruses” of the form, then the theme again.'],
        ['<b>Trading fours</b>: სოლისტები და დრამერი ოთხ-ოთხ ტაქტს ცვლიან.', '<b>Trading fours</b>: soloists and drummer take turns of four bars.'],
        ['<b>Intro, tag, outro</b>: შესავალი, ბოლო ფრაზის გამეორება, დასასრული.', '<b>Intro, tag, outro</b>: an introduction, a repeated last phrase, an ending.']]]],
    q: [
      [['AABA ფორმაში რამდენი ტაქტია?', 'How many bars in AABA?'], ['32', '12', '24'], 0, ['ოთხი 8-ტაქტიანი ნაწილი.', 'Four 8-bar sections.']],
      [['Rhythm changes-ის ბრიჯი:', 'The bridge of rhythm changes:'], ['D7 G7 C7 F7', 'Cm7 F7 B♭ G7', 'E♭ E°7 B♭ F7'], 0, ['III7 – VI7 – II7 – V7.', 'III7 – VI7 – II7 – V7.']],
      [['„head“ არის…', 'The “head” is…'], [['თემა', 'the theme'], ['სოლო', 'a solo'], ['დასასრული', 'the ending']], 0, ['თემით იწყება და მთავრდება.', 'The tune starts and ends with it.']]] },

  { id: 'improv', t: ['იმპროვიზაციის მეთოდი', 'How to practise improvising'],
    lead: ['სამიზნე ნოტები, მოტივის განვითარება, პენტატონიკის ზედდება, ყურით სწავლა.', 'Target notes, motivic development, pentatonic superimposition, learning by ear.'],
    b: [
      ['ul', [
        ['<b>სამიზნე ნოტები</b>: ძლიერ დროზე — აკორდის ბგერა, განსაკუთრებით ტერცია ან სეპტიმა. ჰარმონია ასე ისმის, აკომპანიმენტის გარეშეც.', '<b>Target notes</b>: on the strong beats, a chord tone — the third or the seventh above all. That way the harmony is heard even without accompaniment.'],
        ['<b>მოტივი</b>: მოკლე იდეა გაიმეორე, გადაიტანე სხვა სიმაღლეზე (<b>სეკვენცია</b>), შეცვალე რიტმი, შეაბრუნე — ერთი იდეიდან მთელი სოლო იზრდება.', '<b>Motive</b>: take a short idea, repeat it, move it to another pitch (a <b>sequence</b>), change its rhythm, turn it upside down — a whole solo grows from one idea.'],
        ['<b>პენტატონიკის ზედდება</b>: Cmaj7-ზე D მაჟორული პენტატონიკა (D E F♯ A B) = 9 3 ♯11 13 7 — ლიდიური ფერი ხუთი ნოტით.', '<b>Pentatonic superimposition</b>: over Cmaj7, D major pentatonic (D E F♯ A B) = 9 3 ♯11 13 7 — the Lydian colour in five notes.'],
        ['<b>ყურით სწავლა</b>: სოლოს გადაწერა (ტრანსკრიფცია) ჯაზის მთავარი სკოლაა — მოუსმინე, იმღერე, დაუკარი. AI სტუდიაში ნებისმიერ ჩანაწერს შეანელებ და ნოტებს ნახავ.', '<b>Learning by ear</b>: transcribing solos is jazz\'s main school — listen, sing, play. In the AI studio any recording can be slowed down and its notes seen.'],
        ['<b>12 ტონალობა</b>: ყოველი იდეა ყველა ტონალობაში — კვინტების წრის გავლით.', '<b>All 12 keys</b>: every idea in every key — around the circle of fifths.'],
        ['<b>რიტმი პირველია</b>: კარგი რიტმით ნაკვრი „არასწორი“ ნოტი უკეთ ჟღერს, ვიდრე სწორი ნოტი რიტმის გარეშე.', '<b>Rhythm first</b>: a “wrong” note played in time sounds better than the right note out of time.']]],
      ['play', ['მოტივი და სეკვენცია', 'A motive and its sequence'], { mel: 'C4 D4 E4 G4 D4 E4 F4 A4 E4 F4 G4 B4', gap: .2 }],
      ['play', ['D პენტატონიკა Cmaj7-ზე', 'D pentatonic over Cmaj7'], { ch: ['C3 E3 B3', 'D4', 'E4', 'F#4', 'A4', 'B4', 'A4', 'F#4', 'E4'], gap: [.1, .25, .25, .25, .25, .25, .25, .25, .6] }]],
    q: [
      [['სამიზნე ნოტი ძლიერ დროზე ჩვეულებრივ არის…', 'A target note on a strong beat is usually…'], [['აკორდის ბგერა (3 ან 7)', 'a chord tone (3 or 7)'], ['ქრომატიული გამავალი', 'a chromatic passing note'], ['ასარიდებელი ნოტი', 'an avoid note']], 0, ['ასე ისმის ჰარმონია.', 'That is how the harmony is heard.']],
      [['Cmaj7-ზე ლიდიური ფერისთვის რომელი პენტატონიკა?', 'Which pentatonic gives a Lydian colour over Cmaj7?'], [['D მაჟორული', 'D major'], ['C მაჟორული', 'C major'], ['A მინორული', 'A minor']], 0, ['D E F♯ A B — F♯ = ♯11.', 'D E F♯ A B — F♯ = ♯11.']],
      [['სეკვენცია არის…', 'A sequence is…'], [['მოტივის გამეორება სხვა სიმაღლეზე', 'a motive repeated at another pitch'], ['აკორდების რიგი', 'a row of chords'], ['სწრაფი გამა', 'a fast scale']], 0, ['ერთი იდეა — სხვადასხვა საფეხურიდან.', 'One idea — from different degrees.']]] }
];
