/* =====================================================================
   ბიბლიოთეკა — the whole app as a book you can open at any page.

   The learning path is a road: it takes you from the first step to the
   last and it decides the order. This is the opposite — a reference.
   Nothing here is locked, nothing has to be finished first, and every
   entry is one tap from the real page it describes. Someone who opens
   the app only to find the 12-bar blues can type it in the search box
   and be on that page, without walking through the course.

   The entries are not a second copy of the material: each one carries
   a short "what · how · where · why" and then opens the page that
   already holds it, so there is only ever one source for a fact.
   Counts are read from the app itself, so this page cannot drift out
   of date when the material grows.
   ===================================================================== */
PD.i18n.add({
  'bk.title': ['ბიბლიოთეკა', 'Library'],
  'bk.lead': ['მთელი აპი ერთ ადგილას — წიგნივით. რომელი გვერდიც გინდა, პირდაპირ იქ გადადი: სწავლის გავლა საჭირო არ არის.', 'The whole app in one place, like a book. Open any page directly — you do not have to walk the course to get there.'],
  'bk.search': ['მოძებნე — მაგალითად „12-ტაქტიანი ბლუზი“ ან „ტიუნერი“', 'Search — for example “12-bar blues” or “tuner”'],
  'bk.found': ['{n} ნაპოვნი', '{n} found'],
  'bk.none': ['ვერაფერი ვიპოვე. სცადე სხვა სიტყვა — მაგალითად „აკორდი“, „გამა“, „რითმი“.', 'Nothing found. Try another word — “chord”, “scale”, “rhythm”.'],
  'bk.open': ['გახსნა', 'Open'],
  'bk.all': ['ყველა თავი', 'All chapters'],
  'bk.what': ['რა არის', 'What it is'],
  'bk.how': ['როგორ', 'How to use it'],
  'bk.where': ['სად არის', 'Where it is'],
  'bk.why': ['რატომ', 'Why it matters'],
  'bk.inside': ['რა დევს ამ თავში', 'What is in this chapter'],
  'bk.n': ['{n} გვერდი', '{n} pages'],
  'bk.srcT': ['მასწავლებლის მასალა', "The teacher's own material"],
  'bk.srcG': ['ზოგადი მუსიკის თეორია', 'General music theory'],
  'bk.srcD': ['მონახაზი — მასწავლებელს ჯერ არ დაუდასტურებია', 'Draft — not yet confirmed by the teacher'],
  'bk.jump': ['პირდაპირ გვერდზე', 'Straight to the page'],
  'bk.profile': ['ბიბლიოთეკა', 'Library'],
  'bk.profileD': ['მთელი მასალა — წიგნივით, სწავლის გარეშე', 'All the material — like a book, without the course']
});

PD.book = (() => {
  const h = PD.h, t = PD.i18n.t, TH = PD.theory, ic = PD.ic;
  const L = (ka, en) => PD.i18n.pick({ ka, en });
  const go = (r, p) => PD.app.go(r, p);
  const num = (a, b) => a + '.' + b;

  /* counts come from the app, never from a number typed here */
  const N = {
    get chords() { return (TH.chordLibrary() || []).length; },
    get chordTypes() { return TH.CHORD_TYPES.length; },
    get scales() { return Object.keys(PD.shapes.SCALES).length; },
    get chapters() { return (PD.theoryBook.CHAPTERS || []).length; },
    get tips() { return (PD.tips.all() || []).length; },
    get rhythms() { return (PD.curriculum.rhythms() || []).length; },
    get songs() { return Object.keys(PD.SONGS || {}).length; },
    get frets() { return TH.FRETS; },
    get forms() { return (PD.genres && PD.genres.FORMS || []).length; }
  };

  /* ---------------- the book ----------------
     Each chapter: what it is, how it is used, where it lives, why it matters —
     then its pages, numbered, each one opening the real screen. */
  const CH = [
    { id: 'tuner', t: ['ინსტრუმენტი და ტიუნერი', 'The instrument and the tuner'],
      icon: 'tune',
      what: ['ფანდური სამსიმიანი ქართული ინსტრუმენტია. ამ აპში მისი აწყობაა <b>A · C♯ · E</b> და ტარზე <b>{f} ლადია</b>. მასწავლებელი სიმებს ასე ასახელებს: <b>მე-3 სიმი — ბანი</b> (ყველაზე სქელი, A), <b>მე-2 სიმი — მე-2 ხმა</b> (C♯), <b>1-ლი სიმი — 1-ლი ხმა</b> (ყველაზე თხელი, E).', 'The panduri is a three-string Georgian instrument. In this app it is tuned <b>A · C♯ · E</b> and the neck has <b>{f} frets</b>. The teacher names the strings: <b>3rd string — the bass</b> (thickest, A), <b>2nd string — the second voice</b> (C♯), <b>1st string — the first voice</b> (thinnest, E).'],
      how: ['ტიუნერი მიკროფონით გისმენს: დაჰკარი ერთი სიმი და ეკრანზე დაინახავ, რამდენად მაღლა ან დაბლა ხარ. ისარი შუაში რომ გაჩერდება — სიმი აწყობილია. აწყობა ყოველი დაკვრის წინ საჭიროა.', 'The tuner listens through the microphone: play one string and the screen shows how far above or below you are. When the needle settles in the middle the string is in tune. Tune before every session.'],
      where: ['ქვედა ნავიგაციაში — <b>ტიუნერი</b>. ასევე მთავარ გვერდზე და აქედან.', 'In the bottom navigation — <b>Tuner</b>. Also on the home screen, and from here.'],
      why: ['აუწყობელ ინსტრუმენტზე ვარჯიში სმენას აფუჭებს: სწორად დაჭერილი აკორდიც კი ყალბად ჟღერს და ვერ გაიგებ, შენ შეცდი თუ ინსტრუმენტი.', 'Practising on an out-of-tune instrument spoils the ear: even a correctly held chord sounds wrong, and you cannot tell whether the mistake is yours or the instrument\'s.'],
      pages: [
        { t: ['ტიუნერი', 'Tuner'], d: ['მიკროფონით — სიმი სიმის მიყოლებით', 'With the microphone, string by string'], go: ['tuner'] },
        { t: ['აწყობა: A · C♯ · E', 'Tuning: A · C♯ · E'], d: ['რომელი სიმი რომელ ბგერაზეა', 'Which string is which note'], go: ['tips', 'tune'], src: 'fact' },
        { t: ['სიმები: რომელი სადაა', 'The strings: which is where'], d: ['მასწავლებლის ნუმერაცია', "The teacher's numbering"], go: ['tips', 'strings'], src: 'fact' },
        { t: ['გაიცანი შენი ფანდური', 'Meet your panduri'], d: ['ინსტრუმენტის ნაწილები', 'The parts of the instrument'], go: ['tips', 'parts'], src: 'fact' },
        { t: ['ყვითელი წერტილები — ორიენტირები', 'The yellow dots — landmarks'], d: ['როგორ იპოვო ლადი დათვლის გარეშე', 'How to find a fret without counting'], go: ['tips', 'dots'], src: 'fact' },
        { t: ['ნოტები ფანდურის ტარზე', 'The notes on the neck'], d: ['ყოველი სიმის ყოველი ლადი', 'Every fret of every string'], go: ['theory', 'neck'], src: 'fact' },
        { t: ['ტარი — თავისუფალი დათვალიერება', 'The fretboard — free exploration'], d: ['დააჭირე ნებისმიერ ლადს და მოუსმინე', 'Tap any fret and listen'], go: ['fretboard'] },
        { t: ['როგორ დავჯდეთ', 'How to sit'], d: ['სხეულის მდებარეობა', 'How the body sits'], go: ['tips', 'sit'], src: 'draft' },
        { t: ['როგორ დავიჭიროთ ფანდური', 'How to hold the panduri'], d: ['ინსტრუმენტის დაჭერა', 'Holding the instrument'], go: ['tips', 'hold'], src: 'draft' },
        { t: ['როგორ მოვუაროთ ინსტრუმენტს', 'Caring for the instrument'], d: ['სიმები, ტენიანობა, შენახვა', 'Strings, humidity, storage'], go: ['tips', 'care'], src: 'general' }] },

    { id: 'chords', t: ['აკორდები', 'Chords'],
      icon: 'chord',
      what: ['აკორდი რამდენიმე ბგერაა ერთდროულად. ამ აპში <b>{c} აკორდია</b> — {k} სახე თითოეულ 12 ტონიკაზე — და ყველა მათგანი გამოთვლილია <b>შენი ინსტრუმენტის აწყობიდან</b>, არა სიიდან გადმოწერილი. ამიტომ, თუ აწყობას შეცვლი, პოზიციებიც შეიცვლება.', 'A chord is several notes at once. The app holds <b>{c} chords</b> — {k} types on each of the 12 roots — and every one of them is computed <b>from your instrument\'s own tuning</b> rather than copied from a list. Change the tuning and the positions change with it.'],
      how: ['თითოეულ აკორდს აქვს ლადები, თითების ნომრები, ხმა და <b>3D ხელი</b>, რომელიც ზუსტად გიჩვენებს, რომელი თითი სად დგას. ერთ აკორდს ხშირად რამდენიმე პოზიცია აქვს — დაბალი, შუა და მაღალი: აირჩიე ის, რომელიც შემდეგ აკორდთან ახლოსაა.', 'Every chord carries its frets, its finger numbers, its sound and a <b>3D hand</b> that shows exactly where each finger stands. Most chords have several positions — low, middle and high: take the one nearest the chord that follows.'],
      where: ['ქვედა ნავიგაციაში — <b>აკორდები</b>. „როგორ აიღო“ კი სწავლაშიც და აქედანაც.', 'In the bottom navigation — <b>Chords</b>. “How to take it” is in Learn and here.'],
      why: ['აკორდი სიმღერის საძირკველია: ოთხი აკორდი საკმარისია ასობით სიმღერისთვის. ფანდურზე კი განსაკუთრებით მნიშვნელოვანია თითების წესი — მასწავლებლის წესით <b>ბანს ცერა თითი იჭერს</b>, დანარჩენს კი საჩვენებელი და მისი მეზობლები.', 'Chords are the floor a song stands on: four of them carry hundreds of songs. On the panduri the fingering matters especially — by the teacher\'s rule <b>the thumb holds the bass</b> and the index and its neighbours take the rest.'],
      pages: [
        { t: ['აკორდების ბიბლიოთეკა', 'The chord library'], d: ['ყველა აკორდი, ძებნით და ფილტრით', 'Every chord, with search and filters'], go: ['chords'] },
        { t: ['აკორდი როგორ აიღო', 'How to take a chord'], d: ['ლადები, თითები და 3D ხელი', 'Frets, fingers and the 3D hand'], go: ['chordhow'] },
        { t: ['რა არის აკორდი', 'What a chord is'], d: ['მოკლე ბარათი ანიმაციით', 'A short card with an animation'], go: ['tips', 'chordwhat'], src: 'fact' },
        { t: ['აკორდი როგორ იგება', 'How a chord is built'], d: ['ტერცია, კვინტა, სეპტიმა', 'Thirds, fifths, sevenths'], go: ['theory', 'chords'], src: 'fact' },
        { t: ['აკორდი: ჯერ ფორმა, მერე დარტყმა', 'Shape first, then strum'], d: ['რიგი, რომელიც შეცდომას აცილებს', 'The order that prevents mistakes'], go: ['tips', 'shapefirst'], src: 'general' },
        { t: ['აკორდზე გადასვლა: ადრე დაიწყე', 'Changing chords: start early'], d: ['როგორ არ გაწყდეს რითმი', 'How not to break the rhythm'], go: ['tips', 'change'], src: 'general' },
        { t: ['ერთწუთიანი გადასვლები', 'One-minute changes'], d: ['სავარჯიშო, რომელიც მართლა მუშაობს', 'The exercise that actually works'], go: ['tips', 'minute'], src: 'general' },
        { t: ['ბარე: ერთი თითი — ორი სიმი', 'Barre: one finger, two strings'], d: ['როდის და როგორ', 'When and how'], go: ['tips', 'barre'], src: 'draft' },
        { t: ['აკორდის მიქცევები', 'Chord inversions'], d: ['იგივე აკორდი, სხვა ბანი', 'The same chord, a different bass'], go: ['tips', 'inversion'], src: 'fact' },
        { t: ['ტრანსპოზიცია', 'Transposing'], d: ['აკორდის სხვა ტონალობაში გადატანა', 'Moving a chord to another key'], go: ['tips', 'transpose'], src: 'fact' },
        { t: ['აკორდების თანმიმდევრობები', 'Chord progressions'], d: ['მზა რიგები, რომლებზეც სიმღერები დგას', 'Ready-made runs that songs are built on'], go: ['explore'] },
        { t: ['ტონალობა და საფეხურები', 'Keys and degrees'], d: ['რატომ მიჰყვება ერთი აკორდი მეორეს', 'Why one chord follows another'], go: ['theory', 'key'], src: 'fact' }] },

    { id: 'songs', t: ['მუსიკა და სიმღერები', 'Music and songs'],
      icon: 'song',
      what: ['აპში <b>{s} სიმღერაა</b> მასწავლებლის ჩანაწერით. სიმღერა აქ უბრალოდ აუდიო არ არის: აკორდები და მათი თანმიმდევრობა მასწავლებლისაა, დრო კი თვითონ ჩანაწერიდანაა აღებული — აპი ცოცხალი შესრულების ყოველ დარტყმას მიჰყვება.', 'The app holds <b>{s} song(s)</b> with the teacher\'s own recording. A song here is not just audio: the chords and their order are the teacher\'s, and the timing is taken from the recording itself — the app follows every beat of the live performance.'],
      how: ['სიმღერა შეგიძლია ნელა დაუკრა (60% ან 70%), ვოკალის გარეშე მოუსმინო, ან მარტო მეტრონომით ივარჯიშო. ზოლები („lanes“) გიჩვენებს, როდის რომელი დარტყმა მოდის — მიკროფონი კი ისმენს, მოხვდი თუ არა.', 'You can play a song slowly (60% or 70%), listen without the vocal, or practise with the metronome alone. The lanes show which stroke falls when — and the microphone listens for whether you hit it.'],
      where: ['სწავლა → სიმღერები. ასევე მთავარ გვერდზე.', 'Learn → Songs. Also on the home screen.'],
      why: ['სიმღერა ის ადგილია, სადაც აკორდი, რითმი და სმენა ერთად მუშაობს. ცალკე ვარჯიში ამას ვერ ჩაანაცვლებს.', 'A song is where chords, rhythm and ear work together. No separate exercise replaces that.'],
      pages: [
        { t: ['სიმღერები', 'Songs'], d: ['მასწავლებლის ჩანაწერით', "With the teacher's recording"], go: ['songs'] },
        { t: ['ბიბლიოთეკა — ყველა გაკვეთილი', 'The library — every lesson'], d: ['სიმღერები, მელოდიები, სოლოები', 'Songs, melodies, solos'], go: ['library'] },
        { t: ['როგორ წავიკითხოთ აპის ზოლები', "How to read the app's lanes"], d: ['რა ნიშნავს თითოეული ნიშანი', 'What each mark means'], go: ['tips', 'tab'], src: 'fact' },
        { t: ['AI ანალიზი', 'AI analysis'], d: ['ჩააგდე მუსიკა — აპი აკორდებს და რითმს გამოიცნობს', 'Drop in music — the app works out the chords and the rhythm'], go: ['ai'] },
        { t: ['ჯერ მოუსმინე', 'Listen first'], d: ['რატომ არის სმენა პირველი ნაბიჯი', 'Why listening is the first step'], go: ['tips', 'listen'], src: 'general' },
        { t: ['მხოლოდ რთული ადგილი', 'Only the hard spot'], d: ['მთელი სიმღერის ნაცვლად', 'Instead of the whole song'], go: ['tips', 'loop'], src: 'general' },
        { t: ['ჩაიწერე და მოისმინე', 'Record and listen back'], d: ['ყველაზე პატიოსანი მასწავლებელი', 'The most honest teacher there is'], go: ['tips', 'record'], src: 'general' }] },

    { id: 'music', t: ['ჯაზი, ბლუზი და 12-ტაქტიანი', 'Jazz, blues and the 12-bar form'],
      icon: 'world',
      what: ['საიდან მოდის მუსიკა, საიდან მოვიდა ბლუზი და ჯაზი, და სად დგას ამ ყველაფერში ქართული მრავალხმიანობა. <b>{g} თავი</b> და <b>{f} ფორმა</b> 12-ტაქტიანი ბლუზისა — ტრადიციული, ჯაზური და „Bird changes“.', 'Where music comes from, where the blues and jazz came from, and where Georgian polyphony stands in all of it. <b>{g} chapters</b> and <b>{f} forms</b> of the 12-bar blues — traditional, jazz and the “Bird changes”.'],
      how: ['12-ტაქტიან გვერდზე ტაქტს რომ დააჭერ, გაიგონებ აკორდს და დაინახავ, როგორ აიღო ფანდურზე — ლადებით, თითებით და 3D ხელით. „▶ 12 ტაქტი“ მთლიან ფორმას უკრავს ტემპით, და ფორმა <b>12-ვე ტონალობაში</b> მუშაობს.', 'On the 12-bar page, tapping a bar plays the chord and shows how it is taken on the panduri — frets, fingers and the 3D hand. “▶ Play the 12 bars” runs the whole form in time, and it works in <b>all twelve keys</b>.'],
      where: ['სწავლა → „საიდან მოდის მუსიკა“, ან პირდაპირ აქედან.', 'Learn → “Where music comes from”, or straight from here.'],
      why: ['ეს ზოგადი მუსიკის თეორიაა, არა ფანდურის ხალხური რეპერტუარი — და აპში იმიტომაა, რომ ჰარმონიის ლოგიკა გასაგები გახდეს. ბლუზი და ჯაზი დასავლური პოპულარული მუსიკის ენაა; ქართული მრავალხმიანობა კი მათზე ბევრად ძველია და მათგან არ მოდის.', 'This is general music theory, not the panduri\'s folk repertoire — it is here so the logic of harmony becomes clear. The blues and jazz are the language of Western popular music; Georgian polyphony is far older and does not descend from them.'],
      pages: [
        { t: ['საიდან მოდის მუსიკა — ყველა თავი', 'Where music comes from — all chapters'], d: ['დასაწყისი, მრავალხმიანობა, ბლუზი, ჯაზი, სტანდარტები', 'The beginning, polyphony, the blues, jazz, standards'], go: ['music'], src: 'general' },
        { t: ['12-ტაქტიანი ბლუზი და ჯაზი', 'The 12-bar blues and jazz'], d: ['სამივე ფორმა, 12-ვე ტონალობაში, ფანდურის აკორდებით', 'All three forms, all twelve keys, with the panduri shapes'], go: ['music', '12bar'], src: 'general' },
        { t: ['მუსიკის დასაწყისი', 'How music began'], d: ['რა იცის არქეოლოგიამ', 'What archaeology knows'], go: ['music', 'origin'], src: 'general' },
        { t: ['ქართული მრავალხმიანობა', 'Georgian polyphony'], d: ['UNESCO, VIII საუკუნე — და სიმართლე „ყველაფერი ჯაზიდან მოდის“-ზე', 'UNESCO, the 8th century — and the truth about “it all comes from jazz”'], go: ['music', 'geo'], src: 'general' },
        { t: ['ბლუზი', 'The blues'], d: ['~1870–1900, ბლუზური ნოტები ♭3 ♭5 ♭7', '~1870–1900, the blue notes ♭3 ♭5 ♭7'], go: ['music', 'blues'], src: 'general' },
        { t: ['ჯაზი', 'Jazz'], d: ['ახალი ორლეანი, ii–V–I, ბებოპი', 'New Orleans, ii–V–I, bebop'], go: ['music', 'jazz'], src: 'general' },
        { t: ['სტანდარტები', 'Standards'], d: ['რა არის ფორმა და რატომ შეიძლება ჯემი', 'What a form is, and why a jam works'], go: ['music', 'std'], src: 'general' },
        { t: ['ბლუზური გამა ფანდურზე', 'The blues scale on the panduri'], d: ['მინორული პენტატონიკა + ♭5', 'The minor pentatonic plus ♭5'], go: ['scales', '5:mblues'], src: 'general' }] },

    { id: 'scales', t: ['გამები (scales)', 'Scales'],
      icon: 'frets',
      what: ['გამა ბგერების რიგია, რომელზეც მელოდია დგას. აპში <b>{n} გამაა</b> — მაჟორი და მინორი, შვიდივე მოდუსი, პენტატონიკა, ბლუზური, მთელტონიანი, ორივე შემცირებული და ქრომატული — თითოეული 12-ვე ტონიკაზე.', 'A scale is the row of notes a melody stands on. The app holds <b>{n} scales</b> — major and minor, all seven modes, the pentatonics, the blues scales, whole tone, both diminished scales and chromatic — each on all twelve roots.'],
      how: ['ყოველი გამა ნაჩვენებია <b>ნამდვილ პოზიციაში</b>: ხელი ერთ ადგილას დგას — ოთხი ლადი, ერთი თითი ერთ ლადზე — და გამა სამივე სიმზე გადადის; ტარზე ზემოთ მხოლოდ მაშინ იწევს, როცა პოზიცია ამოიწურება (ეს ↷ ნიშნითაა მონიშნული). დააჭირე ნოტს — გაიგონებ და 3D ხელში დაინახავ.', 'Every scale is shown <b>in a real position</b>: the hand stands in one place — four frets, one finger per fret — and the scale crosses all three strings, moving up the neck only when the position runs out (marked ↷). Tap a note to hear it and see it in the 3D hand.'],
      where: ['სწავლა → გამები ფანდურზე, ან პირდაპირ აქედან ჯგუფების მიხედვით.', 'Learn → Scales on the panduri, or straight from here by family.'],
      why: ['გამა სავარჯიშო არ არის — ის მელოდიის ანბანია. თითების წესიც აქ ისწავლება: ერთ პოზიციაში ერთი თითი ერთ ლადზე დგას, და ხელი ზედმეტად არ დადის.', 'A scale is not an exercise — it is the alphabet of melody. It is also where the fingering is learned: in one position each finger owns one fret, and the hand stops wandering.'],
      pages: [
        { t: ['გამები ფანდურზე — ყველა', 'Scales on the panduri — all of them'], d: ['{n} გამა, 12 ტონიკა, 3D ხელით', '{n} scales, 12 roots, with the 3D hand'], go: ['scales'] },
        { t: ['მაჟორი და მინორი', 'Major and minor'], d: ['ოთხი ძირითადი: მაჟორი, ნატურალური, ჰარმონიული, მელოდიური', 'The four basic ones: major, natural, harmonic, melodic'], go: ['scales', '9:major'] },
        { t: ['მოდუსები (7 კილო)', 'The modes'], d: ['იონიური, დორიული, ფრიგიული, ლიდიური, მიქსოლიდიური, ეოლიური, ლოკრიული', 'Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian'], go: ['scales', '0:dorian'], src: 'general' },
        { t: ['პენტატონიკა და ბლუზური', 'Pentatonic and blues'], d: ['ხუთბგერიანი გამები და ბლუზური ნოტი', 'The five-note scales and the blue note'], go: ['scales', '9:mpenta'], src: 'general' },
        { t: ['სიმეტრიული გამები', 'Symmetrical scales'], d: ['მთელტონიანი, შემცირებული, ქრომატული', 'Whole tone, diminished, chromatic'], go: ['scales', '0:whole'], src: 'general' },
        { t: ['გამები: მაჟორი და მინორი — თეორია', 'Scales: major and minor — the theory'], d: ['ტონი, ნახევარტონი, საფეხურები', 'Tones, semitones, degrees'], go: ['theory', 'scales'], src: 'fact' },
        { t: ['ინტერვალები', 'Intervals'], d: ['მანძილი ორ ბგერას შორის', 'The distance between two notes'], go: ['theory', 'intervals'], src: 'fact' }] },

    { id: 'rhythm', t: ['რითმები', 'Rhythms'],
      icon: 'pulse',
      what: ['აპში <b>{r} ქართული რითმია</b> და ოთხივე მასწავლებლისგანაა — <b>ყაზბეგური, მთიულური, ხორუმი, აჭარული</b>. თითოეულს თავისი დარტყმები და აქცენტები აქვს, და მათი რიგი არ იცვლება.', 'The app holds <b>{r} Georgian rhythms</b>, all four from the teacher — <b>kazbeguri, mtiuluri, khorumi, acharuli</b>. Each has its own strokes and accents, and their order does not change.'],
      how: ['ყოველი რითმი ნაჩვენებია დარტყმა-დარტყმით: <b>ჩამოკვრა</b> (ქვემოთ) და <b>ამოკვრა</b> (ზემოთ), აქცენტი კი უფრო ძლიერი დარტყმაა. ხორუმს თავისი ათვლა აქვს — <b>5/8 = 3/8 + 2/8</b>, ანუ „1-2-3, 1-2“. მეტრონომში ოთხივე რითმის კლიკი პირდაპირ დევს.', 'Each rhythm is shown stroke by stroke: <b>down</b> and <b>up</b>, with the accent as the stronger stroke. Khorumi has its own count — <b>5/8 = 3/8 + 2/8</b>, that is “1-2-3, 1-2”. The metronome carries all four rhythms as clicks.'],
      where: ['სწავლა → რითმები; მეტრონომი — ვარჯიშში.', 'Learn → Rhythms; the metronome is in Practice.'],
      why: ['რითმი ფანდურის ყველაზე ქართული ნაწილია. აკორდი შეიძლება მსოფლიოს ნებისმიერ ინსტრუმენტზე იყოს — ყაზბეგური და ხორუმი კი აქაურია.', 'Rhythm is the most Georgian part of the panduri. A chord can live on any instrument in the world — kazbeguri and khorumi belong here.'],
      pages: [
        { t: ['ყველა რითმი', 'All the rhythms'], d: ['ოთხივე, დარტყმა-დარტყმით', 'All four, stroke by stroke'], go: ['rhythms'], src: 'teacher' },
        { t: ['ყაზბეგური', 'Kazbeguri'], d: ['3 დარტყმა', '3 strokes'], go: ['rhythm', 'kazbeguri'], src: 'teacher' },
        { t: ['მთიულური', 'Mtiuluri'], d: ['მასწავლებლის დარტყმები', "The teacher's strokes"], go: ['rhythm', 'mtiuluri'], src: 'teacher' },
        { t: ['ხორუმი', 'Khorumi'], d: ['5/8 = 3/8 + 2/8 · „1-2-3, 1-2“', '5/8 = 3/8 + 2/8 · “1-2-3, 1-2”'], go: ['rhythm', 'khorumi'], src: 'teacher' },
        { t: ['აჭარული', 'Acharuli'], d: ['ჩაკვრა · ჩაკვრა · ამოკვრა', 'down · down · up'], go: ['rhythm', 'acharuli'], src: 'teacher' },
        { t: ['ხორუმის თვლა', 'The khorumi count'], d: ['როგორ ითვლება 5/8', 'How 5/8 is counted'], go: ['tips', 'khorumi'], src: 'teacher' },
        { t: ['ჩამოკვრა და ამოკვრა: რომელი თითით', 'Down and up strokes: which finger'], d: ['მარჯვენა ხელის წესი', 'The right-hand rule'], go: ['tips', 'strokes'], src: 'teacher' },
        { t: ['მეტრონომი', 'The metronome'], d: ['ოთხივე ქართული რითმის კლიკით', 'With the click of all four Georgian rhythms'], go: ['metronome'] },
        { t: ['რა არის დარტყმა (ბითი)', 'What the beat is'], d: ['პულსი, რომელზეც ყველაფერი დგას', 'The pulse everything stands on'], go: ['tips', 'beat'], src: 'fact' },
        { t: ['ზომა, ტაქტი და 6/8', 'Metre, bars and 6/8'], d: ['როგორ იყოფა დრო', 'How time is divided'], go: ['theory', 'meter'], src: 'fact' },
        { t: ['ტემპი და მეტრონომი', 'Tempo and the metronome'], d: ['რამდენად სწრაფად', 'How fast'], go: ['theory', 'tempo'], src: 'fact' },
        { t: ['სინკოპა', 'Syncopation'], d: ['აქცენტი იქ, სადაც არ ელოდები', 'The accent where you do not expect it'], go: ['tips', 'sync'], src: 'fact' },
        { t: ['ტრიოლი და 6/8', 'Triplets and 6/8'], d: ['სამი ერთი დარტყმის ადგილას', 'Three in the place of one'], go: ['tips', 'triplet'], src: 'fact' },
        { t: ['აქცენტი', 'The accent'], d: ['რომელი დარტყმაა ძლიერი', 'Which stroke is the strong one'], go: ['tips', 'accent'], src: 'fact' }] },

    { id: 'theory', t: ['ნოტები და თეორია', 'Notes and theory'],
      icon: 'learn',
      what: ['<b>{ch} თავი</b> ნოტებზე — ბგერის სახელებიდან ტონალობამდე, ყველაფერი ფანდურის სიმებზე ნაჩვენები და ხმით. ბოლოში ლექსიკონია: მუსიკის ყველა სიტყვა მარტივად.', '<b>{ch} chapters</b> on notes — from the names of sounds to keys, all shown on the panduri\'s own strings and with sound. At the end there is a glossary: every music word, simply.'],
      how: ['ყოველი თავი ჯერ მარტივად ხსნის, შემდეგ დეტალურად, და თავდება თვითშემოწმებით. ბგერაზე დაჭერით გაიგონებ, რომელ სიმზე და რომელ ლადზე ჟღერს.', 'Each chapter explains it plainly first, then in full, and ends with a short self-check. Tap any note to hear it and see which string and fret it sits on.'],
      where: ['სწავლა → თეორია, ან პირდაპირ აქედან თავების მიხედვით.', 'Learn → Theory, or straight from here, chapter by chapter.'],
      why: ['თეორია წესების სია არ არის — ის იმის ახსნაა, რასაც ყურით უკვე გესმის. როცა იცი, რატომ ჟღერს მინორი სევდიანად, აღარ იმახსოვრებ — გესმის.', 'Theory is not a list of rules — it explains what your ear already hears. Once you know why a minor chord sounds sad you stop memorising and start understanding.'],
      pages: (PD.theoryBook.CHAPTERS || []).map(c => ({ t: c.t, d: ['ხმით და ფანდურის სიმებზე', 'With sound, on the panduri strings'], go: ['theory', c.id], src: 'fact' }))
        .concat([{ t: ['ლექსიკონი', 'Glossary'], d: ['მუსიკის ყველა სიტყვა მარტივად', 'Every music word, simply'], go: ['theory', 'glossary'], src: 'fact' }]) },

    { id: 'cards', t: ['მოკლე ბარათები', 'Short cards'],
      icon: 'star',
      what: ['<b>{tp} ბარათი</b> — თითოეული ერთი აზრი, ანიმაციით და 30 წამში წასაკითხი. ბარათებს წყარო აწერია: <b>მასწავლებლის</b>, <b>ზოგადი</b>, <b>ფაქტი</b> ან <b>მონახაზი</b> (რაც ჯერ არ დაუდასტურებია).', '<b>{tp} cards</b> — one idea each, with an animation, readable in thirty seconds. Every card carries its source: <b>the teacher\'s</b>, <b>general</b>, <b>fact</b> or <b>draft</b> (not yet confirmed by him).'],
      how: ['ბარათები ნებისმიერი რიგით იკითხება. წყაროს ნიშანს ყოველთვის უყურე: მასწავლებლის ბარათი მისი სიტყვებია, მონახაზი კი ჯერ შესამოწმებელია.', 'The cards read in any order. Always look at the source badge: a teacher card is his own words, a draft still has to be checked.'],
      where: ['სწავლა → მოკლე ბარათები.', 'Learn → Short cards.'],
      why: ['ვარჯიშის შუაში სრული თავის წაკითხვა არავის უნდა — ერთი ბარათი კი ზუსტად იმას ეუბნება, რაც იმ წამში სჭირდება.', 'Nobody wants to read a full chapter in the middle of practice — a single card says exactly what is needed at that moment.'],
      pages: [{ t: ['ყველა ბარათი', 'All the cards'], d: ['{tp} ბარათი, თემების მიხედვით', '{tp} cards, by topic'], go: ['tips'] }]
        .concat((PD.tips.all() || []).map(c => ({ t: Array.isArray(c.title) ? c.title : [c.title, c.title], d: Array.isArray(c.short) ? c.short : [c.short, c.short], go: ['tips', c.id], src: c.src }))) },

    { id: 'practice', t: ['ვარჯიში და შემოწმება', 'Practice and checking'],
      icon: 'target',
      what: ['ხელსაწყოები, რომლებიც გისმენენ: ტრენაჟორები, სმენის ვარჯიში (სოლფეჯიო), მეტრონომი, დღის სავარჯიშო და გამოცდები.', 'The tools that listen to you: the trainers, ear training (solfège), the metronome, the daily exercise and the exams.'],
      how: ['მიკროფონი ადგილობრივად მუშაობს — ხმა არსად იგზავნება. ტრენაჟორი გიჩვენებს, სწორ ბგერაზე ხარ თუ არა და დროში ხვდები თუ არა; გამოცდა კი თავს არ გავლებს, სანამ არ ჩააბარებ.', 'The microphone works locally — nothing is sent anywhere. A trainer shows whether you are on the right note and in time; an exam does not let you past until you pass it.'],
      where: ['ვარჯიში (მთავარი გვერდიდან) და სწავლა → გამოცდები.', 'Practice (from the home screen) and Learn → Exams.'],
      why: ['თვითონ ვერ გაიგებ, ცდები თუ არა — ყური შენსავე შეცდომას ეჩვევა. ამიტომ არის საჭირო რაღაც, რაც გარედან ისმენს.', 'You cannot judge yourself — the ear gets used to its own mistakes. That is why something has to listen from outside.'],
      pages: [
        { t: ['ვარჯიში', 'Practice'], d: ['ყველა ტრენაჟორი ერთად', 'All the trainers together'], go: ['practice'] },
        { t: ['ტრენაჟორი', 'The trainer'], d: ['ბგერა და დრო — მიკროფონით', 'Pitch and timing — through the microphone'], go: ['trainer'] },
        { t: ['სმენის ვარჯიში (სოლფეჯიო)', 'Ear training (solfège)'], d: ['გაიგონე და იპოვე ბგერა', 'Hear it and find it'], go: ['solfege'] },
        { t: ['მეტრონომი', 'The metronome'], d: ['ქართული რითმების კლიკით', 'With the Georgian rhythms as clicks'], go: ['metronome'] },
        { t: ['დღის სავარჯიშო', "Today's exercise"], d: ['მოკლე, ყოველდღიური', 'Short, every day'], go: ['daily'] },
        { t: ['გამოცდები', 'Exams'], d: ['რასაც ისწავლე — შემოწმებით', 'What you learned, checked'], go: ['exams'] },
        { t: ['პროგრესი', 'Progress'], d: ['რა გამოგდის და რა — ჯერ არა', 'What is working and what is not yet'], go: ['progress'] },
        { t: ['ჯერ ნელა — მერე სწრაფად', 'Slow first, then fast'], d: ['ტემპის წესი', 'The rule about tempo'], go: ['tips', 'tempo'], src: 'general' },
        { t: ['ყოველდღე ცოტ-ცოტა', 'A little every day'], d: ['რატომ სჯობს 15 წუთი კვირაში ერთხელ 2 საათს', 'Why 15 minutes beats two hours once a week'], go: ['tips', 'daily'], src: 'general' },
        { t: ['ხელების გახურება', 'Warming up'], d: ['სანამ დაიწყებ', 'Before you start'], go: ['tips', 'warmup'], src: 'general' },
        { t: ['თითების წვერები თავიდან გტკივა', 'Sore fingertips at first'], d: ['ეს ნორმალურია — და გაივლის', 'It is normal, and it passes'], go: ['tips', 'sore'], src: 'general' }] }
  ];

  const VARS = () => ({ f: N.frets, c: N.chords, k: N.chordTypes, n: N.scales, ch: N.chapters, tp: N.tips, r: N.rhythms, s: N.songs, g: (PD.genres.CHAPTERS || []).length, forms: N.forms });
  const fill = s => String(s).replace(/\{(\w+)\}/g, (m, k) => { const v = VARS()[k]; return v == null ? m : v; });
  const SRC = { teacher: 'bk.srcT', general: 'bk.srcG', draft: 'bk.srcD' };

  /* ---------------- flat search index ---------------- */
  const norm = s => String(s || '').toLowerCase().replace(/[«»„“”"'`.,!?()\[\]:;·—–-]/g, ' ').replace(/\s+/g, ' ').trim();
  function flat() {
    const out = [];
    CH.forEach((c, i) => c.pages.forEach((p, j) => out.push({
      no: num(i + 1, j + 1), ch: c, p,
      title: L(p.t[0], p.t[1]), sub: fill(L(p.d[0], p.d[1])),
      // kept apart so a hit on the page's own name outranks a hit on the chapter it sits in
      kT: norm([p.t[0], p.t[1], p.go.join(' ')].join(' ')),
      kD: norm([p.d[0], p.d[1]].join(' ')),
      kC: norm([c.t[0], c.t[1]].join(' '))
    })));
    return out;
  }

  /* ---------------- pieces ---------------- */
  function row(e, showCh) {
    return h('button', { class: 'bk-row', onclick: () => go(e.p.go[0], e.p.go[1]) }, [
      h('span', { class: 'bk-no', text: e.no }),
      h('span', { class: 'grow' }, [h('b', { text: e.title }), h('small', { text: e.sub }),
        h('span', { class: 'bk-tags' }, [
          showCh && e.ch ? h('em', { class: 'bk-src bk-in', text: L(e.ch.t[0], e.ch.t[1]) }) : null,
          e.p.src && SRC[e.p.src] ? h('em', { class: 'bk-src bk-' + e.p.src, 'data-t': SRC[e.p.src] }) : null].filter(Boolean))]),
      h('span', { class: 'chev', html: ic.chevron })]);
  }
  const BLOCK = (k, ka, en) => h('div', { class: 'bk-b' }, [h('b', { 'data-t': k }), h('p', { html: fill(L(ka, en)) })]);

  /* ---------------- the index ---------------- */
  function page(w, param) {
    const c0 = CH.find(x => x.id === param);
    if (c0) return chapter(w, c0);
    w.append(h('div', { class: 'row pg-head' }, [h('button', { class: 'btn small backbtn', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('profile') }), h('h1', { 'data-t': 'bk.title', style: 'margin:0' })]),
      h('p', { class: 'fg2', 'data-t': 'bk.lead' }));
    const q = h('input', { class: 'bk-q', type: 'search', placeholder: t('bk.search'), 'aria-label': t('bk.search'), oninput: () => draw() });
    const hits = h('div', { class: 'bk-hits' }), toc = h('div', { class: 'bk-toc' });
    w.append(h('div', { class: 'bk-qw' }, [h('span', { class: 'bk-qi', html: ic.search || '' }), q]), hits, toc);
    // the table of contents: every chapter, every page, all visible, nothing locked
    CH.forEach((c, i) => {
      const list = h('div', { class: 'bk-list' }, c.pages.map((p, j) => row({ no: num(i + 1, j + 1), ch: c, p, title: L(p.t[0], p.t[1]), sub: fill(L(p.d[0], p.d[1])) })));
      const open = i === 0;
      const head = h('button', { class: 'bk-ch', 'aria-expanded': String(open), onclick: () => { const on = head.getAttribute('aria-expanded') !== 'true'; head.setAttribute('aria-expanded', String(on)); list.hidden = !on; } }, [
        h('span', { class: 'bk-cn', text: String(i + 1) }),
        h('span', { class: 'grow' }, [h('b', { text: L(c.t[0], c.t[1]) }), h('small', { text: t('bk.n', { n: c.pages.length }) })]),
        h('span', { class: 'bk-more', html: ic.chevron })]);
      list.hidden = !open;
      toc.append(h('section', { class: 'bk-sec' }, [head,
        h('button', { class: 'bk-intro', onclick: () => go('book', c.id) }, [h('small', { text: fill(L(c.what[0], c.what[1])).replace(/<[^>]+>/g, '').split('.')[0] + '.' }), h('em', { 'data-t': 'bk.inside' })]),
        list]));
    });
    function draw() {
      const s = norm(q.value); hits.innerHTML = '';
      if (!s) { hits.hidden = true; toc.hidden = false; return; }
      hits.hidden = false; toc.hidden = true;
      /* Every word must appear somewhere, but where it appears decides the order: the page you
         named comes first, the rest of its chapter after it — otherwise searching "tuner" would
         hand back the whole tuner chapter with the tuner itself somewhere in the middle. */
      const ws = s.split(' ').filter(Boolean);
      const found = flat().map(e => {
        let sc = 0, all = true;
        ws.forEach(wd => {
          if (e.kT.includes(wd)) sc += e.kT === wd ? 9 : 5;
          else if (e.kD.includes(wd)) sc += 2;
          else if (e.kC.includes(wd)) sc += .5;
          else all = false;
        });
        return { e, s: all ? sc : 0 };
      }).filter(x => x.s > 0).sort((a, b) => b.s - a.s);
      hits.append(h('small', { class: 'muted', text: found.length ? t('bk.found', { n: found.length }) : '' }));
      if (!found.length) return hits.append(h('p', { class: 'notice', 'data-t': 'bk.none' })), PD.i18n.apply(hits);
      found.slice(0, 40).forEach(x => hits.append(row(x.e, true)));
      PD.i18n.apply(hits);
    }
    draw();                       // an empty results block would otherwise leave a hole above the contents
    PD.i18n.apply(w);
  }

  /* ---------------- one chapter: what · how · where · why, then its pages ---------------- */
  function chapter(w, c) {
    const i = CH.indexOf(c);
    w.append(h('div', { class: 'row', style: 'align-items:center;gap:10px' }, [h('button', { class: 'btn small', html: ic.back + '<span data-t="bk.all"></span>', onclick: () => go('book') }), h('small', { class: 'muted grow', style: 'text-align:right', text: (i + 1) + ' / ' + CH.length })]),
      h('h1', { class: 'tb-title', text: (i + 1) + '. ' + L(c.t[0], c.t[1]) }));
    w.append(h('article', { class: 'bk-body' }, [
      BLOCK('bk.what', c.what[0], c.what[1]), BLOCK('bk.how', c.how[0], c.how[1]),
      BLOCK('bk.where', c.where[0], c.where[1]), BLOCK('bk.why', c.why[0], c.why[1])]));
    w.append(h('h2', { class: 'bk-h2', 'data-t': 'bk.inside' }),
      h('div', { class: 'bk-list' }, c.pages.map((p, j) => row({ no: num(i + 1, j + 1), ch: c, p, title: L(p.t[0], p.t[1]), sub: fill(L(p.d[0], p.d[1])) }))));
    const nx = CH[i + 1], pv = CH[i - 1];
    w.append(h('div', { class: 'tb-nav' }, [pv ? h('button', { class: 'btn', text: '‹ ' + L(pv.t[0], pv.t[1]), onclick: () => go('book', pv.id) }) : h('span'),
      nx ? h('button', { class: 'btn', text: L(nx.t[0], nx.t[1]) + ' ›', onclick: () => go('book', nx.id) }) : h('span')]));
    PD.i18n.apply(w);
  }

  return { page, CHAPTERS: CH, flat };
})();
