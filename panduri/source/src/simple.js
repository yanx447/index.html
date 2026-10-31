/* =====================================================================
   Music theory in plain words — a simple layer over every chapter of
   the theory book (notes.js). Same facts as the chapters, said simply:
     easy     — short explanations with everyday comparisons
     remember — the few things to keep
     try      — one small check on the panduri itself
     words    — every technical word of the chapter, in plain language
   The words also make up the glossary and the tappable terms in the text.
   Each entry is [Georgian, English].
   ===================================================================== */
PD.theorySimple = (() => {
  const C = {
    names: {
      easy: [['მუსიკაში ყოველ ბგერას თავისი სახელი აქვს — ისევე, როგორც ადამიანებს.', 'In music every sound has its own name — just like people do.'],
        ['ძირითადი სახელი სულ <b>7</b>-ია: <b>დო, რე, მი, ფა, სოლ, ლა, სი</b>.', 'There are only <b>7</b> basic names: <b>do, re, mi, fa, sol, la, si</b>.'],
        ['იგივე სახელები ასოებითაც იწერება: <b>C D E F G A B</b>. „დო“ და „C“ ერთი და იგივეა — უბრალოდ ორი ენაა.', 'The same names are written with letters too: <b>C D E F G A B</b>. “do” and “C” are the same thing — just two languages.'],
        ['„სი“-ს შემდეგ ისევ „დო“ იწყება, ოღონდ უფრო მაღლა — როგორც კვირის დღეები: კვირის შემდეგ ისევ ორშაბათია.', 'After “si” comes “do” again, only higher — like the days of the week: after Sunday comes Monday again.']],
      remember: [['7 სახელი: დო რე მი ფა სოლ ლა სი', '7 names: do re mi fa sol la si'], ['დო = C · რე = D · მი = E · ფა = F · სოლ = G · ლა = A · სი = B', 'do = C · re = D · mi = E · fa = F · sol = G · la = A · si = B'], ['ფანდურის სიმები ასოებით: A · C♯ · E', 'The panduri\'s strings in letters: A · C♯ · E']],
      try: ['დაუკარი ღია A სიმი (არაფერს აჭერ) — ეს ნოტი „ლა“ა. თქვი ხმამაღლა: „ლა“.', 'Play the open A string (press nothing) — this note is “la”. Say it out loud: “la”.'],
      words: [['ბგერა', 'sound', 'ის, რაც გესმის, როცა სიმი ირხევა.', 'What you hear when a string vibrates.'], ['ნოტი', 'note', 'ბგერის სახელი და მისი დაწერილი ნიშანი.', 'The name of a sound and the sign used to write it.'], ['სიმაღლე', 'pitch', 'რამდენად მაღალი („წვრილი“) ან დაბალი („სქელი“) არის ბგერა.', 'How high (“thin”) or low (“thick”) a sound is.']]
    },
    octave: {
      easy: [['როცა ერთსა და იმავე სიმღერას კაცი და ბავშვი ერთად მღერიან, ბავშვის ხმა მაღალია, მაგრამ მელოდია იგივეა. ასეთი განსხვავება ხშირად <b>ოქტავაა</b>.', 'When a man and a child sing the same song together, the child\'s voice is higher but the tune is the same. That difference is often an <b>octave</b>.'],
        ['ოქტავა არის მანძილი ორ ერთსახელიან ნოტს შორის — მაგალითად, დაბალ „ლა“-სა და მაღალ „ლა“-ს შორის.', 'An octave is the distance between two notes with the same name — for example, a low “la” and a high “la”.'],
        ['ოქტავით მაღალი ნოტი ისე ჟღერს, თითქოს „იგივე ნოტია, ოღონდ უფრო წვრილად“.', 'A note an octave higher sounds like “the same note, only thinner”.'],
        ['ნოტის გვერდით ციფრი გვეუბნება, რომელ ოქტავაშია: <b>A3</b> დაბალია, <b>A4</b> — ერთი ოქტავით მაღალი.', 'The number next to a note tells its octave: <b>A3</b> is low, <b>A4</b> is one octave higher.']],
      remember: [['ერთი ოქტავა = 12 ლადი ფანდურზე', 'One octave = 12 frets on the panduri'], ['ციფრი ნოტთან = ოქტავის ნომერი (A3, A4)', 'The number on a note = its octave (A3, A4)'], ['ფანდური A3-დან A5-მდე უკრავს — ორი ოქტავა', 'The panduri plays from A3 to A5 — two octaves']],
      try: ['დაუკარი ღია A სიმი, შემდეგ იმავე სიმზე მე-12 ლადი. ორივე „ლა“ა — მეორე ზუსტად ოქტავით მაღალია.', 'Play the open A string, then the 12th fret of the same string. Both are “la” — the second is exactly an octave higher.'],
      words: [['ოქტავა', 'octave', 'მანძილი ორ ერთსახელიან ნოტს შორის (მაგ. დაბალი ლა → მაღალი ლა). ფანდურზე = 12 ლადი.', 'The distance between two notes with the same name (e.g. low A → high A). On the panduri = 12 frets.'], ['ჰერცი', 'hertz', 'რამდენჯერ ირხევა სიმი ერთ წამში. 440 ჰც = 440-ჯერ.', 'How many times a string vibrates per second. 440 Hz = 440 times.'], ['დიაპაზონი', 'range', 'ყველაზე დაბალიდან ყველაზე მაღალ ბგერამდე — ყველაფერი, რისი დაკვრაც ინსტრუმენტს შეუძლია.', 'From the lowest to the highest sound — everything an instrument can play.']]
    },
    semitone: {
      easy: [['წარმოიდგინე კიბე. მის ყველაზე პატარა საფეხურს მუსიკაში <b>ნახევარტონი</b> ჰქვია.', 'Picture a staircase. Its smallest step is called a <b>semitone</b> in music.'],
        ['ფანდურზე ეს ძალიან მარტივია: <b>ერთი ლადით ზემოთ = ერთი ნახევარტონით მაღლა</b>.', 'On the panduri it is very simple: <b>one fret up = one semitone higher</b>.'],
        ['ორი ნახევარტონი ერთად <b>ტონია</b> — ანუ ორი ლადი.', 'Two semitones together make a <b>tone</b> — that is, two frets.'],
        ['ერთ ოქტავაში სულ 12 ასეთი საფეხურია. ამიტომაა, რომ მე-12 ლადზე ისევ იგივე ნოტი ბრუნდება.', 'An octave holds 12 such steps. That is why the same note comes back at the 12th fret.']],
      remember: [['1 ლადი = ნახევარტონი', '1 fret = a semitone'], ['2 ლადი = ტონი', '2 frets = a tone'], ['12 ლადი = ოქტავა', '12 frets = an octave'], ['მი–ფა და სი–დო შორის მხოლოდ ნახევარტონია', 'E–F and B–C are only a semitone apart']],
      try: ['A სიმზე ზედიზედ დაუკარი ღია, მერე 1, 2, 3 ლადი. ყოველი ნაბიჯი ერთი ნახევარტონია.', 'On the A string play open, then frets 1, 2, 3 in a row. Every step is one semitone.'],
      words: [['ნახევარტონი', 'semitone', 'ორ ბგერას შორის ყველაზე პატარა ნაბიჯი. ფანდურზე = 1 ლადი.', 'The smallest step between two sounds. On the panduri = 1 fret.'], ['ტონი', 'tone', 'ორი ნახევარტონი. ფანდურზე = 2 ლადი.', 'Two semitones. On the panduri = 2 frets.'], ['ქრომატული გამა', 'chromatic scale', 'ყველა 12 ბგერა ზედიზედ, ნახევარტონ-ნახევარტონ.', 'All 12 sounds in a row, one semitone at a time.'], ['ლადი', 'fret', 'ტარზე განივი ლითონის ზოლი. მის წინ თითის დაჭერა ბგერას ცვლის.', 'A metal strip across the neck. Pressing just behind it changes the sound.']]
    },
    accidentals: {
      easy: [['ზოგჯერ ნოტს „ოდნავ მაღლა“ ან „ოდნავ დაბლა“ ვუკრავთ. ამისთვის სამი პატარა ნიშანი გვაქვს.', 'Sometimes a note is played “a little higher” or “a little lower”. Three small signs say so.'],
        ['<b>♯ დიეზი</b> — ნოტი ნახევარტონით მაღლა: ფანდურზე ერთი ლადით ზემოთ.', '<b>♯ sharp</b> — the note a semitone higher: one fret up on the panduri.'],
        ['<b>♭ ბემოლი</b> — ნოტი ნახევარტონით დაბლა: ერთი ლადით ქვემოთ.', '<b>♭ flat</b> — the note a semitone lower: one fret down.'],
        ['<b>♮ ბეკარი</b> — „დაივიწყე ♯ და ♭, ჩვეულებრივი ნოტი დაუკარი“.', '<b>♮ natural</b> — “forget the ♯ and ♭, play the plain note”.'],
        ['ერთ ბგერას შეიძლება ორი სახელი ჰქონდეს: <b>C♯</b> და <b>D♭</b> ზუსტად ერთნაირად ჟღერს.', 'One sound can have two names: <b>C♯</b> and <b>D♭</b> sound exactly the same.']],
      remember: [['♯ = +1 ლადი', '♯ = +1 fret'], ['♭ = −1 ლადი', '♭ = −1 fret'], ['♮ = ჩვეულებრივი ნოტი', '♮ = the plain note'], ['ფანდურის შუა სიმი C♯-ზეა (დო დიეზი)', 'The panduri\'s middle string is C♯ (do sharp)']],
      try: ['A სიმზე დაუკარი ღია (A), შემდეგ 1-ლი ლადი — ეს არის A♯, იგივე B♭.', 'On the A string play it open (A), then fret 1 — that is A♯, the same as B♭.'],
      words: [['დიეზი', 'sharp', 'ნიშანი ♯: ნოტს ნახევარტონით ამაღლებს (+1 ლადი).', 'The sign ♯: raises a note by a semitone (+1 fret).'], ['ბემოლი', 'flat', 'ნიშანი ♭: ნოტს ნახევარტონით ადაბლებს (−1 ლადი).', 'The sign ♭: lowers a note by a semitone (−1 fret).'], ['ბეკარი', 'natural', 'ნიშანი ♮: აუქმებს დიეზს ან ბემოლს.', 'The sign ♮: cancels a sharp or a flat.'], ['ენჰარმონიული', 'enharmonic', 'ერთი და იგივე ბგერა ორი სხვადასხვა სახელით (C♯ = D♭).', 'One and the same sound with two different names (C♯ = D♭).'], ['ალტერაცია', 'key signature', 'ნოტის ამაღლება ან დადაბლება ნიშნით (♯, ♭). ხაზის დასაწყისში დაწერილი მთელ ნაწარმოებზე მოქმედებს.', 'Raising or lowering notes with signs (♯, ♭). Written at the start of a line, it applies to the whole piece.']]
    },
    neck: {
      easy: [['ფანდურის ტარი ნოტების რუკაა: ყოველ სიმზე ყოველ ლადს თავისი ნოტი აქვს.', 'The panduri\'s neck is a map of notes: every fret on every string has its own note.'],
        ['ღია სიმი (არაფერს აჭერ) აღინიშნება <b>0</b>-ით. ყოველი ლადი ზემოთ — ერთი ნახევარტონით მაღლა.', 'An open string (pressing nothing) is written <b>0</b>. Every fret up is one semitone higher.'],
        ['ერთი და იგივე ნოტი ხშირად რამდენიმე ადგილას გვხვდება — შეგიძლია აირჩიო, სადაც უფრო მოსახერხებელია.', 'The same note often appears in several places — you can choose the most comfortable one.'],
        ['ტარზე წერტილები გზის ნიშნებივითაა — გეხმარება, ლადი სწრაფად იპოვო, ითვლის გარეშე.', 'The dots on the neck are like road signs — they help you find a fret quickly without counting.']],
      remember: [['0 = ღია სიმი', '0 = open string'], ['ყოველი ლადი = +1 ნახევარტონი', 'Every fret = +1 semitone'], ['მე-12 ლადი = ღია სიმის ნოტი, ოქტავით მაღლა', 'Fret 12 = the open string\'s note, an octave higher']],
      try: ['იპოვე E ნოტი სამ ადგილას: E სიმი ღია, C♯ სიმის მე-3 ლადი და A სიმის მე-7 ლადი. სამივე ერთნაირად ჟღერს.', 'Find E in three places: the open E string, the C♯ string\'s 3rd fret and the A string\'s 7th fret. All three sound the same.'],
      words: [['ღია სიმი', 'open string', 'სიმი, რომელსაც თითით არ აჭერ. აღინიშნება 0-ით.', 'A string you do not press. Written as 0.'], ['ტარი', 'neck', 'ფანდურის გრძელი ნაწილი, რომელზეც ლადებია.', 'The long part of the panduri that carries the frets.'], ['ლადის ნიშნები', 'fret marker', 'ტარზე დახატული წერტილები, ლადის სწრაფად საპოვნელად.', 'Dots on the neck that help you find a fret quickly.']]
    },
    staff: {
      easy: [['<b>ხუთხაზედი</b> ხუთი ხაზია, რომელზეც ნოტებს წერენ — ისევე, როგორც სიტყვებს რვეულის ხაზებზე.', 'The <b>staff</b> is five lines on which notes are written — like words on the lines of a notebook.'],
        ['რაც უფრო მაღლაა ნოტი ხაზებზე, მით უფრო მაღალია ბგერა.', 'The higher a note sits on the lines, the higher the sound.'],
        ['ხაზების დასაწყისში დახატული <b>გასაღები</b> 𝄞 გვეუბნება, რომელი ხაზი რომელი ნოტია.', 'The <b>clef</b> 𝄞 drawn at the start tells which line is which note.'],
        ['აპის გაკვეთილებში ხუთხაზედი არ გჭირდება — აპი ფანდურის ენით წერს (ლადები და ისრები). ხუთხაზედი სხვა ნოტების წასაკითხად გამოგადგება.', 'You do not need the staff in the app\'s lessons — the app writes in the panduri\'s language (frets and arrows). The staff helps you read other sheet music.']],
      remember: [['ხაზები ქვემოდან: E G B D F', 'Lines from the bottom: E G B D F'], ['შუალედები: F A C E', 'Spaces: F A C E'], ['ზემოთ = მაღალი ბგერა', 'Higher up = higher sound']],
      try: ['დაუკარი ღია სიმები ზედიზედ — A, C♯, E — და სურათზე ნახე, როგორ ადის ნოტი ხაზებზე ზემოთ.', 'Play the open strings in a row — A, C♯, E — and watch the note climb up the lines in the picture.'],
      words: [['ხუთხაზედი', 'staff', 'ხუთი ხაზი, რომელზეც ნოტები იწერება.', 'Five lines on which notes are written.'], ['გასაღები', 'clef', 'ნიშანი ხაზების დასაწყისში; განსაზღვრავს, რომელი ხაზი რომელი ნოტია.', 'A sign at the start of the lines; it fixes which line is which note.'], ['დამატებითი ხაზი', 'ledger line', 'მოკლე ხაზი ხუთხაზედის ზემოთ ან ქვემოთ — ძალიან მაღალი ან დაბალი ნოტისთვის.', 'A short line above or below the staff — for very high or low notes.']]
    },
    durations: {
      easy: [['ნოტი მარტო იმას კი არ გვეუბნება, <b>რომელი</b> ბგერაა, არამედ იმასაც, <b>რამდენ ხანს</b> ჟღერს.', 'A note tells not only <b>which</b> sound it is, but also <b>how long</b> it lasts.'],
        ['დრო ითვლება დარტყმებით — ისე, როგორც ფეხს აბაკუნებ მუსიკაზე: ერთი, ორი, სამი, ოთხი.', 'Time is counted in beats — like tapping your foot to music: one, two, three, four.'],
        ['<b>მთელი</b> ნოტი 4 დარტყმაა, <b>ნახევარი</b> — 2, <b>მეოთხედი</b> — 1, <b>მერვედი</b> — ნახევარი დარტყმა.', 'A <b>whole</b> note is 4 beats, a <b>half</b> is 2, a <b>quarter</b> is 1, an <b>eighth</b> is half a beat.'],
        ['ყოველი შემდეგი ნოტი წინაზე ორჯერ მოკლეა — როგორც ნამცხვრის ჭრა: მთელი → ნახევარი → მეოთხედი.', 'Each next value is half as long — like cutting a cake: whole → half → quarter.']],
      remember: [['მთელი = 4 · ნახევარი = 2 · მეოთხედი = 1 · მერვედი = ½', 'whole = 4 · half = 2 · quarter = 1 · eighth = ½'], ['წერტილი ნოტთან = კიდევ ნახევარი', 'A dot = add half again'], ['ლიგა = ორი ნოტი, ერთხელ დაკვრით', 'A tie = two notes, struck once']],
      try: ['თანაბრად აბაკუნე ფეხი და თვალე „ერთი-ორი-სამი-ოთხი“. ყოველ ბაკუნზე ერთხელ დაუკარი A სიმი — ეს მეოთხედებია.', 'Tap your foot evenly and count “one-two-three-four”. Play the A string once on each tap — those are quarter notes.'],
      words: [['დარტყმა', 'beat', 'მუსიკის თანაბარი პულსი — ის, რასაც ფეხით აბაკუნებ.', 'The steady pulse of music — what you tap with your foot.'], ['ღერო', 'stem', 'ნოტის თავზე მიმაგრებული ხაზი.', 'The line attached to a note\'s head.'], ['დროშა', 'flag', 'ღეროზე პატარა „ალამი“: მერვედს ერთი აქვს, მეთექვსმეტედს — ორი.', 'A small “banner” on the stem: an eighth has one, a sixteenth two.'], ['ლიგა', 'tie', 'რკალი ორ ერთნაირ ნოტს შორის: ერთხელ უკრავ, ხოლო ორივეს დრო ერთად გრძელდება.', 'An arc between two equal notes: you play once and both lengths add up.'], ['ტრიოლი', 'triplet', 'სამი თანაბარი ნოტი ორის ადგილას.', 'Three equal notes in the time of two.']]
    },
    rests: {
      easy: [['<b>პაუზა</b> მუსიკაში სიჩუმეა — დრო გრძელდება, მაგრამ ამ მომენტში არ უკრავ.', 'A <b>rest</b> is silence in music — time goes on, but you do not play at that moment.'],
        ['სიჩუმესაც აქვს სიგრძე, ისევე როგორც ნოტს: მთელი პაუზა 4 დარტყმაა, ნახევარი — 2, მეოთხედი — 1.', 'Silence has a length too, just like a note: a whole rest is 4 beats, a half rest 2, a quarter rest 1.'],
        ['ფანდურზე პაუზის დროს სიმებს ხელს მსუბუქად დაადებ, რომ ბგერა გაჩუმდეს.', 'On the panduri you lightly lay your hand on the strings during a rest so the sound stops.']],
      remember: [['პაუზა = სიჩუმე, დათვლა კი არ ჩერდება', 'A rest = silence, but the counting goes on'], ['მთელი პაუზა „კიდია“, ნახევარი „ზის“', 'The whole rest “hangs”, the half rest “sits”']],
      try: ['თვალე „1 2 3 4“: 1-ზე დაუკარი, 2-ზე ხელი დაადე სიმებს (პაუზა), 3-ზე დაუკარი, 4-ზე ისევ პაუზა.', 'Count “1 2 3 4”: play on 1, rest your hand on the strings on 2, play on 3, rest again on 4.'],
      words: [['პაუზა', 'rest', 'სიჩუმის ნიშანი: დათვლა გრძელდება, მაგრამ არ უკრავ.', 'A sign for silence: the counting goes on, but you do not play.']]
    },
    meter: {
      easy: [['მუსიკა თანაბარ ნაწილებად იყოფა — <b>ტაქტებად</b>, ისევე როგორც ლექსი სტრიქონებად.', 'Music is split into equal parts — <b>bars</b> — just as a poem is split into lines.'],
        ['<b>ზომა</b> (მაგ. 4/4) ორი რიცხვია: ზედა ამბობს, რამდენი დარტყმაა ერთ ტაქტში; ქვედა — რომელი ნოტია ერთი დარტყმა.', 'The <b>time signature</b> (e.g. 4/4) is two numbers: the top says how many beats are in a bar; the bottom says which note is one beat.'],
        ['ტაქტის პირველი დარტყმა ყველაზე ძლიერია — თითქოს მასზე ფეხს უფრო მაგრად ურტყამ.', 'The first beat of a bar is the strongest — as if you tap your foot harder on it.'],
        ['6/8-ში ტაქტი ორ ნაწილად იყოფა, თითოეული — სამად: „ერთი-ორი-სამ, ოთხი-ხუთი-ექვს“. აჭარული სწორედ ასე „ქანაობს“: ↓ ↓ ↑, ↓ ↓ ↑.', 'In 6/8 a bar splits into two parts of three: “one-two-three, four-five-six”. Acharuli sways exactly like that: ↓ ↓ ↑, ↓ ↓ ↑.']],
      remember: [['ზედა რიცხვი = დარტყმები ტაქტში', 'Top number = beats in a bar'], ['ქვედა რიცხვი: 4 = მეოთხედი, 8 = მერვედი', 'Bottom number: 4 = quarter, 8 = eighth'], ['აჭარულის ერთი რითმი (↓ ↓ ↑) = 3 მერვედი; ტაქტში 2 რითმია', 'One Acharuli rhythm (↓ ↓ ↑) = 3 eighths; a bar holds 2 rhythms']],
      try: ['ხმამაღლა თვალე „ერთი-ორი-სამ, ოთხი-ხუთი-ექვს“ და თითო თვლაზე თითო დარტყმა დაუკარი: ↓ ↓ ↑ ↓ ↓ ↑.', 'Count out loud “one-two-three, four-five-six” and play one stroke per count: ↓ ↓ ↑ ↓ ↓ ↑.'],
      words: [['ტაქტი', 'bar', 'მუსიკის მოკლე, თანაბარი ნაწილი.', 'A short, equal part of music.'], ['ზომა', 'time signature', 'ორი რიცხვი დასაწყისში: რამდენი და რა სიგრძის დარტყმაა ტაქტში.', 'Two numbers at the start: how many beats, and how long each, are in a bar.'], ['აქცენტი', 'accent', 'ძლიერად დაკრული დარტყმა.', 'A stroke played strongly.']]
    },
    tempo: {
      easy: [['<b>ტემპი</b> ის არის, რამდენად სწრაფად მიდის მუსიკა.', '<b>Tempo</b> is how fast the music goes.'],
        ['იზომება <b>BPM</b>-ით — დარტყმები წუთში. 60 BPM = წამში ერთი დარტყმა, როგორც საათის წიკწიკი. 120 BPM = წამში ორი.', 'It is measured in <b>BPM</b> — beats per minute. 60 BPM = one beat per second, like a clock\'s tick. 120 BPM = two per second.'],
        ['<b>მეტრონომი</b> პატარა „საათია“, რომელიც დარტყმებს წკაპუნით გითვლის, რომ არ აჩქარდე და არ შენელდე.', 'A <b>metronome</b> is a little “clock” that clicks the beats so you neither rush nor drag.'],
        ['ახალ სიმღერას ჯერ ნელა სწავლობენ, მერე თანდათან აჩქარებენ.', 'A new song is learned slowly first, then sped up step by step.']],
      remember: [['ტემპი = სისწრაფე', 'Tempo = speed'], ['BPM = დარტყმები წუთში', 'BPM = beats per minute'], ['60 BPM = წამში 1 დარტყმა', '60 BPM = 1 beat per second']],
      try: ['ჩართე მეტრონომი 60 BPM-ზე და ყოველ წკაპუნზე ერთხელ დაუკარი. მერე სცადე 80-ზე.', 'Set the metronome to 60 BPM and play once on every click. Then try 80.'],
      words: [['ტემპი', 'tempo', 'მუსიკის სისწრაფე.', 'The speed of music.'], ['BPM', 'BPM', 'დარტყმები წუთში (beats per minute).', 'Beats per minute.'], ['მეტრონომი', 'metronome', 'ხელსაწყო, რომელიც თანაბრად წკაპუნებს.', 'A tool that clicks evenly.'], ['ფერმატა', 'fermata', 'ნიშანი 𝄐: ნოტი ჩვეულებრივზე დიდხანს გააგრძელე.', 'The sign 𝄐: hold the note longer than usual.']]
    },
    intervals: {
      easy: [['<b>ინტერვალი</b> ორ ნოტს შორის მანძილია — როგორც მანძილი კიბის ორ საფეხურს შორის.', 'An <b>interval</b> is the distance between two notes — like the distance between two steps of a staircase.'],
        ['ფანდურზე მისი დათვლა ადვილია: რამდენი ლადია ერთი ნოტიდან მეორემდე იმავე სიმზე.', 'On the panduri it is easy to count: how many frets from one note to the other on the same string.'],
        ['ყოველ მანძილს თავისი სახელი და „ხასიათი“ აქვს: ზოგი ტკბილად ჟღერს, ზოგი — დაძაბულად.', 'Each distance has its own name and “character”: some sound sweet, some tense.'],
        ['ფანდურის ღია სიმებიც ინტერვალებითაა აწყობილი: A-დან C♯-მდე 4 ლადია, C♯-დან E-მდე — 3.', 'The panduri\'s open strings are tuned in intervals too: A to C♯ is 4 frets, C♯ to E is 3.']],
      remember: [['ინტერვალი = ლადების რაოდენობა', 'Interval = number of frets'], ['3 = პატარა ტერცია · 4 = დიდი ტერცია', '3 = minor third · 4 = major third'], ['7 = კვინტა · 12 = ოქტავა', '7 = fifth · 12 = octave']],
      try: ['A სიმზე დაუკარი ღია და მე-4 ლადი — ეს დიდი ტერციაა. მერე ღია და მე-7 ლადი — კვინტა.', 'On the A string play open, then fret 4 — a major third. Then open and fret 7 — a fifth.'],
      words: [['ინტერვალი', 'interval', 'მანძილი ორ ნოტს შორის; ითვლება ნახევარტონებით (ლადებით).', 'The distance between two notes, counted in semitones (frets).'], ['ტერცია', 'third', '3 ან 4 ნახევარტონის მანძილი; აკორდის „გული“.', 'A distance of 3 or 4 semitones; the “heart” of a chord.'], ['კვინტა', 'fifth', '7 ნახევარტონი; მყარი, „ღია“ ჟღერადობა.', '7 semitones; a firm, “open” sound.'], ['პრიმა', 'unison', 'ერთი და იგივე ნოტი ორჯერ (0 ნახევარტონი).', 'The same note twice (0 semitones).'], ['ტრიტონი', 'tritone', '6 ნახევარტონი; ძალიან დაძაბული ჟღერადობა.', '6 semitones; a very tense sound.']]
    },
    scales: {
      easy: [['<b>გამა</b> ნოტების კიბეა: ერთი ნოტიდან ადიხარ ზემოთ, იმავე სახელის მაღალ ნოტამდე.', 'A <b>scale</b> is a staircase of notes: you climb from one note up to the higher note with the same name.'],
        ['კიბის საფეხურები სხვადასხვა ზომისაა: ზოგი ტონია (2 ლადი), ზოგი — ნახევარტონი (1 ლადი). სწორედ ეს წესრიგი ქმნის გამის ხასიათს.', 'The steps are of different sizes: some are tones (2 frets), some semitones (1 fret). That order gives the scale its character.'],
        ['<b>მაჟორი</b> ნათლად და ხალისიანად ჟღერს, <b>მინორი</b> — უფრო სევდიანად და ღრმად.', '<b>Major</b> sounds bright and cheerful, <b>minor</b> more sad and deep.'],
        ['„ბანი-აჭარული“ რე მინორშია: D E F G A B♭ C D.', '“Bani-Acharuli” is in D minor: D E F G A B♭ C D.']],
      remember: [['მაჟორი: ტ ტ ნ ტ ტ ტ ნ', 'Major: T T S T T T S'], ['მინორი: ტ ნ ტ ტ ნ ტ ტ', 'Minor: T S T T S T T'], ['მაჟორი = ნათელი · მინორი = სევდიანი', 'Major = bright · minor = sad']],
      try: ['მოუსმინე „დო მაჟორს“ და „ლა მინორს“ ზედიზედ (ღილაკები ქვემოთაა). რომელი უფრო სევდიანია?', 'Listen to “C major” and “A minor” one after the other (buttons below). Which sounds sadder?'],
      words: [['გამა', 'scale', 'ნოტების რიგი ერთი ნოტიდან მის ოქტავამდე, განსაზღვრული ნაბიჯებით.', 'A row of notes from one note to its octave, in fixed steps.'], ['ტონიკა', 'tonic', 'გამის პირველი, მთავარი ნოტი — „სახლი“.', 'The first, main note of a scale — “home”.'], ['მაჟორი', 'major', 'ნათელი, ხალისიანი ჟღერადობის გამა ან აკორდი.', 'A scale or chord with a bright, cheerful sound.'], ['მინორი', 'minor', 'უფრო სევდიანი, რბილი ჟღერადობის გამა ან აკორდი.', 'A scale or chord with a sadder, softer sound.'], ['პენტატონიკა', 'pentatonic', 'მხოლოდ 5-ნოტიანი გამა.', 'A scale of only 5 notes.']]
    },
    chords: {
      easy: [['<b>აკორდი</b> რამდენიმე ნოტია, რომლებიც ერთად ჟღერს — მაგალითად, სამივე სიმზე ერთად დაკვრა.', 'A <b>chord</b> is several notes sounding together — for example, playing all three strings at once.'],
        ['უმეტესად აკორდი სამი ნოტისგან შედგება: მთავარი ნოტი, მისგან ტერცია და კვინტა.', 'Most chords are three notes: the main note, a third above it and a fifth above it.'],
        ['თუ ტერცია „დიდია“ (4 ლადი) — აკორდი <b>მაჟორულია</b>, ნათელი. თუ „პატარაა“ (3 ლადი) — <b>მინორულია</b>, სევდიანი.', 'If the third is “big” (4 frets) the chord is <b>major</b>, bright. If it is “small” (3 frets) it is <b>minor</b>, sad.'],
        ['ფანდური ისეა აწყობილი, რომ სამივე სიმზე ერთსა და იმავე ლადზე დაჭერა ყოველთვის მაჟორულ აკორდს იძლევა.', 'The panduri is tuned so that pressing all three strings on the same fret always gives a major chord.']],
      remember: [['აკორდი = 3 ან მეტი ნოტი ერთად', 'Chord = 3 or more notes together'], ['მაჟორი: 0 · 4 · 7 · მინორი: 0 · 3 · 7', 'Major: 0 · 4 · 7 · minor: 0 · 3 · 7'], ['Dm, B♭, C — „ბანი-აჭარულის“ აკორდები', 'Dm, B♭, C — the chords of “Bani-Acharuli”']],
      try: ['დააჭირე სამივე სიმს 1-ელ ლადზე და დაუკარი — ეს B♭ აკორდია. მერე იგივე მე-3 ლადზე — C.', 'Press all three strings at fret 1 and strum — that is B♭. Then the same at fret 3 — C.'],
      words: [['აკორდი', 'chord', 'სამი ან მეტი ნოტი ერთად.', 'Three or more notes together.'], ['ტრიადა', 'triad', 'სამნოტიანი აკორდი: მთავარი ნოტი + ტერცია + კვინტა.', 'A three-note chord: main note + third + fifth.'], ['ბარე', 'barre', 'ერთი თითით რამდენიმე სიმის ერთად დაჭერა.', 'Pressing several strings with one finger.'], ['მიმართვა', 'inversion', 'იგივე აკორდი, ოღონდ ნოტები სხვა წესრიგშია (ქვემოთ სხვა ნოტია).', 'The same chord with its notes in another order (another note at the bottom).']]
    },
    key: {
      easy: [['<b>ტონალობა</b> სიმღერის „სახლია“: რომელი ნოტია მთავარი და რომელი ნოტებისგან არის სიმღერა აგებული.', 'A <b>key</b> is a song\'s “home”: which note is the main one and which notes the song is built from.'],
        ['სიმღერა ხშირად სახლიდან გადის, „მოგზაურობს“ და ბოლოს ისევ სახლში ბრუნდება — ამიტომ ჟღერს დასასრული დასრულებულად.', 'A song often leaves home, “travels” and finally comes back — that is why the ending feels finished.'],
        ['გამის ყოველ ნოტზე შეიძლება აკორდის აგება. მათ რომაული ციფრებით ნიშნავენ: I, II, III …', 'A chord can be built on every note of the scale. They are numbered with Roman numerals: I, II, III …'],
        ['„ბანი-აჭარული“ რე მინორშია: Dm (სახლი) → B♭ → C → ისევ Dm.', '“Bani-Acharuli” is in D minor: Dm (home) → B♭ → C → back to Dm.']],
      remember: [['ტონალობა = სიმღერის სახლი', 'Key = the song\'s home'], ['I = ტონიკა (სახლი)', 'I = tonic (home)'], ['V = დომინანტა (სახლში დაბრუნება „სურს“)', 'V = dominant (it “wants” to go home)']],
      try: ['დაუკარი Dm → B♭ → C და გაჩერდი C-ზე. გრძნობ, რომ რაღაც აკლია? ახლა დაუკარი Dm — „სახლში დაბრუნდი“.', 'Play Dm → B♭ → C and stop on C. Feel that something is missing? Now play Dm — you are “home”.'],
      words: [['ტონალობა', 'key', 'სიმღერის მთავარი ნოტი და მისი გამა.', 'A song\'s main note and its scale.'], ['საფეხური', 'degree', 'გამის ნოტის რიგითი ნომერი (I, II, III …).', 'The position number of a note in the scale (I, II, III …).'], ['დომინანტა', 'dominant', 'V საფეხური; დაძაბულობას ქმნის და სახლისკენ „იწევს“.', 'Degree V; it builds tension and pulls towards home.'], ['სუბდომინანტა', 'subdominant', 'IV საფეხური; სახლიდან „გასვლა“.', 'Degree IV; “leaving” home.']]
    },
    signs: {
      easy: [['ნოტებთან დაწერილი პატარა ნიშნები გეუბნება, <b>როგორ</b> დაუკრა: ხმამაღლა თუ ჩუმად, მოკლედ თუ შეკრულად.', 'Small signs next to notes tell <b>how</b> to play: loud or soft, short or connected.'],
        ['<b>p</b> (პიანო) = ჩუმად, <b>f</b> (ფორტე) = ხმამაღლა. რაც მეტი ასოა (pp, ff), მით უფრო.', '<b>p</b> (piano) = soft, <b>f</b> (forte) = loud. More letters (pp, ff) = even more so.'],
        ['აპში წითელი ისარი <b>აქცენტია</b> — ის დარტყმა ცოტა უფრო ძლიერად დაუკარი.', 'In the app a red arrow is an <b>accent</b> — play that stroke a little stronger.'],
        ['გამეორების ნიშნები გეუბნება, რომელი ნაწილი უნდა დაუკრა ხელახლა.', 'Repeat signs tell which part to play again.']],
      remember: [['p = ჩუმად · f = ხმამაღლა', 'p = soft · f = loud'], ['წითელი = აქცენტი', 'Red = accent'], ['𝄆 … 𝄇 = გაიმეორე', '𝄆 … 𝄇 = repeat']],
      try: ['დაუკარი ↓ ↓ ↑ ჯერ ძალიან ჩუმად (p), მერე ხმამაღლა (f). მოუსმინე განსხვავებას.', 'Play ↓ ↓ ↑ very softly (p), then loudly (f). Listen to the difference.'],
      words: [['დინამიკა', 'dynamics', 'ხმის სიძლიერე — ჩუმად ან ხმამაღლა.', 'Loudness — soft or loud.'], ['სტაკატო', 'staccato', 'მოკლედ, დაყოვნების გარეშე.', 'Short and detached.'], ['ლეგატო', 'legato', 'შეკრულად, შეუწყვეტლად.', 'Smoothly connected.'], ['რეპრიზა', 'repeat', 'გამეორების ნიშანი.', 'A sign to play a part again.']]
    },
    app: {
      easy: [['გაკვეთილებში ხუთხაზედს არ ვიყენებთ — აპი უფრო მარტივად, ფანდურის ენით წერს.', 'The lessons do not use the staff — the app writes more simply, in the panduri\'s language.'],
        ['<b>↓</b> = ჩაკვრა (ზემოდან ქვემოთ), <b>↑</b> = ამოკვრა (ქვემოდან ზემოთ). წითელი ისარი = ძლიერად.', '<b>↓</b> = down-stroke, <b>↑</b> = up-stroke. A red arrow = strongly.'],
        ['ციფრი ლადია: <b>0</b> ღია სიმია, <b>1</b> — პირველი ლადი და ა.შ.', 'A number is a fret: <b>0</b> is the open string, <b>1</b> the first fret and so on.'],
        ['წრეში ჩაწერილი ციფრი გეუბნება, რომელი თითით დააჭირო: 1 საჩვენებელი, 2 შუა, 3 არათითი, 4 ნეკი.', 'A number in a circle tells which finger to use: 1 index, 2 middle, 3 ring, 4 little.']],
      remember: [['↓ ჩაკვრა · ↑ ამოკვრა', '↓ down-stroke · ↑ up-stroke'], ['0 = ღია სიმი', '0 = open string'], ['ეკრანზე: ზემოთ E, შუაში C♯, ქვემოთ A', 'On screen: E at the top, C♯ in the middle, A at the bottom']],
      try: ['გახსენი ნებისმიერი გაკვეთილი და იპოვე ეკრანზე: ისარი, ლადის ციფრი და თითის წრე.', 'Open any lesson and find on screen: an arrow, a fret number and a finger circle.'],
      words: [['ჩაკვრა', 'down-stroke', 'სიმებზე ზემოდან ქვემოთ დაკვრა (↓).', 'Striking the strings from top to bottom (↓).'], ['ამოკვრა', 'up-stroke', 'სიმებზე ქვემოდან ზემოთ დაკვრა (↑).', 'Striking the strings from bottom to top (↑).'], ['რითმი', 'rhythm', 'აპში: დარტყმების ჯგუფი, მაგ. ↓ ↓ ↑.', 'In the app: a group of strokes, e.g. ↓ ↓ ↑.']]
    }
  };
  /** every word, once, A–Z by the current language: { ka, en, dka, den, ch } */
  function glossary() {
    const seen = new Map();
    Object.keys(C).forEach(ch => (C[ch].words || []).forEach(([ka, en, dka, den]) => { const k = en.toLowerCase(); if (!seen.has(k)) seen.set(k, { ka, en, dka, den, ch }); }));
    return [...seen.values()];
  }
  return { get: id => C[id], glossary };
})();
