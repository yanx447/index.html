/* =====================================================================
   App shell: router, navigation, Home (content browser), Learn
   (paths), Lesson page (stages), Progress, Settings, Account.
   ===================================================================== */
PD.i18n.add({
  'nav.library': ['ბიბლიოთეკა', 'Library'], 'nav.more': ['მეტი', 'More'],
  'hm.resume': ['გააგრძელე იქიდან, სადაც გაჩერდი', 'Continue where you stopped'], 'hm.resumeD': ['{s} · ტაქტი {b}', '{s} · bar {b}'],
  'hm.today': ['დღევანდელი ვარჯიში', "Today's practice"], 'hm.where': ['შენი სავარჯიშო ოთახი', 'Your practice room'], 'hm.path': ['სწავლის გზა', 'Learning path'], 'hm.nextIs': ['შემდეგი: {l}', 'next: {l}'], 'hm.noRecent': ['ჯერ არ გივარჯიშია. დაიწყე ზემოთ.', 'No practice yet. Start above.'], 'hm.days': ['დღე', 'days'], 'hm.allProgress': ['სრული პროგრესი', 'Full progress'], 'hm.quick': ['სწრაფი წვდომა', 'Quick access'], 'hm.next': ['შემდეგი ნაბიჯი', 'Next step'], 'hm.song': ['გააგრძელე სიმღერა', 'Continue song'],
  'hm.demo': ['ახლა ჩატვირთულია სადემონსტრაციო მასალა. მასწავლებლის კურიკულუმი ჯერ არ არის დამატებული — სავარჯიშოები, თითები და აკორდები დამოწმებული არ არის.', 'Demo material is loaded. The teacher’s curriculum has not been added yet — exercises, fingerings and chords are not verified.'],
  'demo.badge': ['დემო', 'Demo'], 'demo.badgeD': ['სადემონსტრაციო — მასწავლებლის მიერ არ არის დამოწმებული', 'Demo — not verified by the teacher'],
  'st.intro': ['შესავალი', 'Introduction'], 'st.demo': ['დემონსტრაცია', 'Demonstration'], 'st.technique': ['ტექნიკა ცალკე', 'Isolated technique'], 'st.guided': ['ნელი, ნაბიჯ-ნაბიჯ', 'Guided slow practice'],
  'std.intro': ['რას ვისწავლით და რატომ — მასწავლებლის ტექსტი და ვიდეო.', 'What we will learn and why — teacher text and video.'],
  'std.demo': ['მოისმინე და ნახე: დაკვრა სრულ ტემპზე, ვიდეოსთან და ხელებთან ერთად.', 'Listen and watch: full tempo, together with video and hands.'],
  'std.technique': ['ერთი რამ ცალკე (მაგ. მხოლოდ დარტყმები) — ავტორის მიერ არჩეული.', 'One thing on its own (e.g. strokes only) — chosen by the author.'],
  'std.guided': ['„მაჩვენე“ → „შენი ჯერი“, ყოველ ნოტზე.', '“Show me” → “Your turn”, note by note.'],
  'les.resumeAt': ['გაგრძელება: {s} · ტაქტი {b}', 'Resume: {s} · bar {b}'], 'les.coach': ['ჭკვიანი ვარჯიში', 'Smart practice'],
  'more.tools': ['ხელსაწყოები', 'Tools'], 'more.profile': ['პროფილი', 'Profile'], 'more.settings': ['პარამეტრები', 'Settings'], 'more.settingsD': ['აუდიო, მიკროფონი, ენა, წვდომა, კონფიდენციალურობა', 'Audio, microphone, language, accessibility, privacy'],
  'pr.songs': ['ნასწავლი სიმღერები', 'Songs learned'], 'pr.cleanTempo': ['უმაღლესი სუფთა ტემპი', 'Highest clean tempo'], 'pr.firstAvg': ['პირველივე ცდით (ბოლო 10)', 'First try (last 10)'],
  'pr.timingStab': ['დროის სტაბილურობა', 'Timing stability'], 'pr.pitchStab': ['ბგერის სტაბილურობა', 'Pitch stability'], 'pr.difficult': ['რთული მონაკვეთები', 'Difficult sections'], 'pr.difficultD': ['შენი ისტორიიდან: სადაც ყველაზე ხშირად გჭირდება მეორე ცდა, გამოგრჩება ნოტი ან ანელებ ტემპს.', 'From your history: where you most often need a second try, miss notes or lower the tempo.'],
  'pr.title': ['პროგრესი', 'Progress'], 'pr.lead': ['მუსიკალური წინსვლა — არა ქულები.', 'Musical improvement — not points.'],
  'pr.lessons': ['გაკვეთილები', 'Lessons'], 'pr.completed': ['ათვისებული', 'Mastered'], 'pr.time': ['ვარჯიშის დრო', 'Practice time'], 'pr.tempo': ['კომფორტული ტემპი', 'Comfortable tempo'],
  'pr.pitchTrend': ['ბგერის სიზუსტე · ბოლო სესიები', 'Pitch accuracy · recent sessions'], 'pr.timingTrend': ['დრო (±90 მწ) · ბოლო სესიები', 'Timing (±90 ms) · recent sessions'],
  'pr.noData': ['ჯერ საკმარისი სესია არ არის. ტრენდი გამოჩნდება 2+ ვარჯიშის შემდეგ.', 'Not enough sessions yet. Trends appear after 2+ practice sessions.'],
  'pr.noTiming': ['დრო ფასდება მხოლოდ WAIT-ის გარეშე დაკვრისას.', 'Timing is scored only when playing without WAIT.'],
  'pr.chords': ['ათვისებული აკორდები', 'Mastered chords'], 'pr.melodies': ['ათვისებული მელოდიები', 'Mastered melodies'], 'pr.problems': ['პრობლემური ლადები', 'Problem frets'], 'pr.problemsD': ['სადაც ყველაზე ხშირად დაგჭირდა მეორე ცდა.', 'Where you most often needed a second try.'],
  'pr.sessions': ['ბოლო სესიები', 'Recent sessions'], 'pr.bests': ['პირადი რეკორდები', 'Personal bests'], 'pr.none': ['ჯერ არაფერი.', 'Nothing yet.'], 'pr.streak': ['სერია: {n} დღე', 'Streak: {n} days'],
  'pr.firstTry': ['პირველივე ცდით', 'first try'],
  'set.title': ['პარამეტრები', 'Settings'], 'set.general': ['ზოგადი', 'General'], 'set.lang': ['ენა', 'Language'], 'set.account': ['ანგარიში და მონაცემები', 'Account and data'], 'set.audio': ['აუდიო', 'Audio'], 'set.panduri': ['ფანდური', 'Panduri'], 'set.learning': ['სწავლა', 'Learning'], 'set.visual': ['ვიზუალი', 'Visuals'], 'set.a11y': ['წვდომა', 'Accessibility'], 'set.privacy': ['კონფიდენციალურობა', 'Privacy'], 'set.author': ['ავტორის რეჟიმი', 'Author mode'],
  'set.calib': ['მიკროფონის კალიბრაცია', 'Microphone calibration'], 'set.calibD': ['ხმაური, მგრძნობელობა, ღია სიმები, დაყოვნება.', 'Noise, sensitivity, open strings, latency.'], 'set.calibLast': ['ბოლო: {d} · დაყოვნება {l} მწ', 'Last: {d} · latency {l} ms'], 'set.calibNever': ['ჯერ არ ჩატარებულა', 'Not done yet'],
  'set.sens': ['მიკროფონის მგრძნობელობა', 'Mic sensitivity'], 'set.tol': ['ბგერის დაშვება (ცენტი)', 'Pitch tolerance (cents)'], 'set.guard': ['მეტრონომის დაწკაპუნების იგნორირება', 'Ignore metronome clicks'], 'set.guardD': ['დინამიკებით ვარჯიშისას', 'When practicing on speakers'],
  'set.vInst': ['ინსტრუმენტის ხმა', 'Instrument volume'], 'set.vMetro': ['მეტრონომი', 'Metronome'], 'set.vRef': ['ჩანაწერი', 'Reference audio'], 'set.vUi': ['ინტერფეისის ხმები', 'UI sounds'],
  'set.tuning': ['აწყობა', 'Tuning'], 'set.a4': ['A4 სიხშირე', 'A4 reference'], 'set.lefty': ['ცაციის რეჟიმი', 'Left-handed view'], 'set.leftyD': ['ტარი და ხელები სარკისებურად; ტექსტი არა', 'Neck and hands mirrored; text is not'],
  'set.samples': ['ჩაწერილი ნიმუშები', 'Recorded samples'], 'set.samplesD': ['ფანდურის ჩაწერილი ნიმუშები: {n}. სადაც ჩანაწერი არ არის, ხმა ფიზიკური მოდელით იქმნება. ნიმუშები სტუდიაში ემატება.', 'Recorded panduri samples: {n}. Where no recording exists the sound is physically modelled. Samples are added in the Studio.'],
  'set.assist': ['დახმარების დონე', 'Assistance level'], 'as.auto': ['ავტომატური', 'Automatic'], 'as.beginner': ['დამწყები', 'Beginner'], 'as.intermediate': ['საშუალო', 'Intermediate'], 'as.advanced': ['გამოცდილი', 'Advanced'], 'as.performance': ['შესრულება', 'Performance'],
  'set.assistD': ['ავტომატური: ათვისებასთან ერთად თანდათან იმალება სახელები, ლადები, თითები და ხელი.', 'Automatic: names, frets, fingers and hand fade out as you master a lesson.'],
  'set.countIn': ['ათვლა', 'Count-in'], 'set.metro': ['მეტრონომი ნაგულისხმევად', 'Metronome by default'], 'set.autoDemo': ['„მაჩვენე“ ავტომატურად ყოველ ნოტაზე', 'Auto “Show me” at every note'], 'set.touchSound': ['ხმა შეხებისას', 'Sound on touch'],
  'set.quality': ['გრაფიკის ხარისხი', 'Graphics quality'], 'q.auto': ['ავტო', 'Auto'], 'q.high': ['მაღალი', 'High'], 'q.medium': ['საშუალო', 'Medium'], 'q.low': ['დაბალი', 'Low'],
  'set.hc': ['მაღალი კონტრასტი', 'High contrast'], 'set.text': ['ტექსტის ზომა', 'Text size'], 'ts.m': ['ჩვეულებრივი', 'Normal'], 'ts.l': ['დიდი', 'Large'], 'ts.xl': ['ძალიან დიდი', 'Extra large'],
  'set.motion': ['მოძრაობის შემცირება სისტემის პარამეტრით კონტროლდება.', 'Reduced motion follows your system setting.'],
  'set.privacyD': ['მიკროფონის აუდიო მხოლოდ ამ მოწყობილობაზე ანალიზდება. არაფერი იწერება და არაფერი იგზავნება. ანალიტიკა არ გროვდება.', 'Microphone audio is analysed only on this device. Nothing is recorded or sent. No analytics are collected.'],
  'set.micNow': ['მიკროფონი ახლა: {s}', 'Microphone now: {s}'], 'set.micStop': ['მიკროფონის გამორთვა', 'Turn microphone off'], 'set.wipe': ['ყველა მონაცემის წაშლა', 'Delete all data'], 'set.wipeD': ['პროგრესი, პარამეტრები, შენი გაკვეთილები.', 'Progress, settings, your lessons.'],
  'set.authorD': ['ჩართავს სტუდიას: გაკვეთილების შექმნა და რედაქტირება.', 'Enables the Studio: create and edit lessons.'], 'set.onboard': ['საწყისი გაცნობა თავიდან', 'Run the welcome again'], 'set.keys': ['კლავიატურა', 'Keyboard'],
  'set.install': ['აპად დაყენება', 'Install as an app'], 'set.installD': ['ბრაუზერის მენიუდან: „Add to Home Screen“ / „Install“. ოფლაინ მუშაობს შენახული გაკვეთილებით.', 'From the browser menu: “Add to Home Screen” / “Install”. Saved lessons work offline.']
});


PD.i18n.add({
  'nav.songs': ['სიმღერები', 'Songs'], 'nav.practice': ['ვარჯიში', 'Practice'], 'nav.profile': ['პროფილი', 'Profile'],
  'gr.morning': ['დილა მშვიდობისა', 'Good morning'], 'gr.day': ['გამარჯობა', 'Hello'], 'gr.evening': ['საღამო მშვიდობისა', 'Good evening'],
  'hm.goal': ['დღეს: {a} / {b} წთ', 'Today: {a} / {b} min'], 'hm.streak': ['{n} დღე ზედიზედ', '{n}-day streak'], 'hm.daily': ['დღევანდელი ვარჯიში', 'Daily practice'], 'hm.dailyD': ['{d} / {n} ეტაპი · {m} წთ', '{d} / {n} parts · {m} min'],
  'hm.song': ['ისწავლე სიმღერა', 'Learn a song'], 'hm.songD': ['სიმღერები და მელოდიები', 'Songs and melodies'], 'hm.rhythms': ['რიტმები', 'Rhythms'], 'hm.rhythmsD': ['მასწავლებლის 4 რიტმი', 'The teacher’s 4 rhythms'],
  'hm.exercises': ['სავარჯიშოები', 'Exercises'], 'hm.exercisesD': ['ნოტები, ლადები, სმენა', 'Notes, frets, ear'], 'hm.recent': ['ბოლოს დაკრული', 'Recently played'], 'hm.recommended': ['რეკომენდებული შემდეგი', 'Recommended next'],
  'cat.rhythm': ['რიტმები', 'Rhythms'], 'cat.technique': ['ტექნიკა', 'Technique'], 'sg.title': ['სიმღერები და სავარჯიშოები', 'Songs and exercises'], 'sg.search': ['ძიება', 'Search'],
  'f.skill': ['უნარი', 'Skill'], 'f.anySkill': ['ნებისმიერი უნარი', 'Any skill'], 'f.dur': ['ხანგრძლივობა', 'Duration'], 'f.anyDur': ['ნებისმიერი ხანგრძლივობა', 'Any duration'], 'f.short': ['≤ 30 წმ', '≤ 30 s'], 'f.mid': ['30 წმ – 2 წთ', '30 s – 2 min'], 'f.long': ['> 2 წთ', '> 2 min'],
  'sk.notes': ['ნოტები', 'Notes'], 'sk.strings': ['სიმები', 'Strings'], 'sk.frets': ['ლადები', 'Frets'], 'sk.fingering': ['თითები', 'Fingering'], 'sk.rhythm': ['რიტმი', 'Rhythm'], 'sk.strumming': ['ჩაკვრა/ამოკვრა', 'Strumming'],
  'sk.accents': ['აქცენტები', 'Accents'], 'sk.positions': ['პოზიციები', 'Positions'], 'sk.chords': ['აკორდები', 'Chords'], 'sk.melody': ['მელოდია', 'Melody'], 'sk.speed': ['სისწრაფე', 'Speed'],
  'ls.learn': ['რას ისწავლი', 'What you will learn'], 'ls.technique': ['საჭირო ტექნიკა', 'Technique needed'], 'ls.duration': ['ხანგრძლივობა', 'Duration'], 'ls.tempo': ['ტემპი', 'Tempo'], 'ls.est': ['~{m} წთ ვარჯიში', '~{m} min of practice'],
  'ls.learnBtn': ['სწავლა', 'Learn'], 'ls.practiceBtn': ['ვარჯიში', 'Practice'], 'ls.fullBtn': ['სრულად დაკვრა', 'Play full song'], 'ls.listen': ['მოსმენა', 'Listen'], 'ls.sections': ['გაკვეთილის ნაწილები', 'Lesson sections'],
  'ls.intro': ['შესავალი', 'Intro'], 'ls.rhythm': ['რიტმი', 'Rhythm'], 'ls.combined': ['ერთად', 'Combined'], 'ls.full': ['სრული შესრულება', 'Full performance'], 'ls.introD': ['რას ვისწავლით — მასწავლებლის ტექსტი და ვიდეო', 'What we will learn — teacher text and video'],
  'ls.phraseD': ['ლოდინის რეჟიმი: ნოტი-ნოტ', 'Wait mode: note by note'], 'ls.rhythmD': ['მხოლოდ მარჯვენა ხელი, ღია სიმებზე', 'Right hand only, on open strings'], 'ls.combinedD': ['ყველა ნაწილი ერთად, უწყვეტად, ნელ ტემპზე', 'All parts together, continuous, slower tempo'], 'ls.fullD': ['სრული ტემპი, საბოლოო შეფასება', 'Full tempo, final score'],
  'ls.best': ['საუკეთესო: {p}%', 'Best: {p}%'],
  'pr.level': ['დონე', 'Level'], 'pr.rhythms': ['ნასწავლი რიტმები', 'Rhythms learned'], 'pr.noteAcc': ['ნოტების სიზუსტე', 'Note accuracy'], 'pr.timeAcc': ['დროის სიზუსტე', 'Timing accuracy'], 'pr.avgTempo': ['საშუალო ტემპი', 'Average tempo'],
  'pr.longest': ['ყველაზე გრძელი სერია', 'Longest streak'], 'pr.skills': ['უნარების რუკა', 'Skill map'], 'pr.trend': ['{k} ბოლო 7 დღეში: {a} → {b}', '{k} over the last 7 days: {a} → {b}'], 'pr.days': ['{n} დღე', '{n} days'],
  'lv.foundation': ['საფუძვლები', 'Foundation'], 'lv.beginner': ['დამწყები', 'Beginner'], 'lv.intermediate': ['საშუალო', 'Intermediate'], 'lv.advanced': ['რთული', 'Advanced'],
  'pf.title': ['პროფილი', 'Profile'], 'pf.photo': ['ფოტოს შეცვლა', 'Change photo'], 'pf.goal': ['დღიური მიზანი', 'Daily goal'], 'pf.achievements': ['მიღწევები', 'Achievements'], 'pf.saved': ['შენახული', 'Saved'],
  'pf.downloads': ['ოფლაინ', 'Offline'], 'pf.downloadsD': ['ჩაშენებული გაკვეთილები, რიტმები და ტრენაჟორები ოფლაინ მუშაობს, როცა აპი დაყენებულია. მასწავლებლის ვიდეოები ცალკე ინახება, მხოლოდ შენი არჩევით.', 'Built-in lessons, rhythms and trainers work offline when the app is installed. Teacher videos are saved separately, only when you choose.'],
  'pf.account': ['ანგარიში', 'Account'], 'pf.guest': ['სტუმარი · ამ მოწყობილობაზე', 'Guest · on this device'], 'pf.signin': ['შესვლა ან ანგარიშის შექმნა', 'Sign in or create account'], 'pf.links': ['მეტი', 'More'],
  'ac.firstMelody': ['პირველი მელოდია', 'First melody'], 'ac.firstMelodyD': ['მელოდია ბოლომდე დაკარი', 'Played a melody to the end'], 'ac.sessions10': ['10 ვარჯიში', '10 practice sessions'], 'ac.sessions10D': ['10 დასრულებული სესია', '10 finished sessions'],
  'ac.perfectRhythm': ['სუფთა რიტმი', 'Perfect rhythm'], 'ac.perfectRhythmD': ['რიტმი შეცდომის გარეშე, დროის გაზომვით', 'A rhythm without a mistake, timing measured'], 'ac.notes100': ['100 სწორი ნოტი', '100 notes correct'], 'ac.notes100D': ['მიკროფონით დადასტურებული', 'Confirmed by the microphone'],
  'ac.fullSong': ['სრული სიმღერა', 'Full song completed'], 'ac.fullSongD': ['სიმღერა სრულ ტემპზე, 80%+', 'A song at full tempo, 80%+'], 'ac.week': ['კვირა ზედიზედ', 'A week in a row'], 'ac.weekD': ['7 დღე ზედიზედ ვარჯიში', 'Practised 7 days in a row'],
  'ph.title': ['ვარჯიში', 'Practice'], 'ph.lead': ['ტრენაჟორები და ხელსაწყოები — ყველაფერი ნამდვილ ფანდურზე.', 'Trainers and tools — all on your real panduri.'],
  'ph.trainerD': ['„დაუკარი C♯“ — მიკროფონი ამოწმებს', '“Play C♯” — the microphone checks'], 'ph.rhythmsD': ['ჩაკვრა/ამოკვრა, აქცენტები, დრო', 'Down/up, accents, timing'], 'ph.metroD': ['BPM, ზომა, დაყოფა, ტაპი', 'BPM, signature, subdivision, tap'],
  'ln.title': ['სწავლა', 'Learn'], 'ln.lead': ['ეტაპობრივად: საფუძვლებიდან სოლომდე. სადაც მასწავლებლის მასალა ჯერ არ არის, ასე წერია.', 'Step by step: from foundations to solo. Where the teacher’s material is not in yet, it says so.'],
  'ln.awaiting': ['მასწავლებლის მასალას ელოდება', 'Awaiting the teacher’s material'], 'ln.open': ['გახსნა', 'Open'],
  'set.microphone': ['მიკროფონი', 'Microphone'], 'set.noise': ['ხმაურის ფილტრი', 'Noise filtering'], 'set.latency': ['დაყოვნების კალიბრაცია', 'Latency calibration'], 'set.vFeedback': ['უკუკავშირის ხმა', 'Feedback volume'],
  'set.waitDefault': ['ლოდინის რეჟიმი ნაგულისხმევად', 'Wait mode by default'], 'set.autoAdvance': ['სწორი ნოტის შემდეგ ავტომატურად გაგრძელება', 'Continue automatically after a correct note'], 'set.noteNames': ['ნოტების სახელები', 'Note names'], 'set.fretNums': ['ლადების ნომრები', 'Fret numbers'],
  'set.fps': ['კადრების სიხშირე', 'Frame rate'], 'fps.auto': ['ავტო', 'Auto'], 'fps.30': ['ეკონომიური · 30', 'Battery · 30'], 'set.reduceMotion': ['მოძრაობის შემცირება', 'Reduce motion'], 'set.hands': ['ხელების ჩვენება', 'Show hands'], 'set.haptics': ['ვიბრაცია', 'Haptic feedback'],
  'q.ultra': ['ულტრა', 'Ultra'], 'q.balanced': ['დაბალანსებული', 'Balanced'], 'set.colorblind': ['ფერის ნაცვლად ფორმებიც', 'Shapes as well as colours'], 'set.accountSec': ['ანგარიში', 'Account'], 'set.learningSec': ['სწავლა', 'Learning'], 'set.visualSec': ['ვიზუალი', 'Visual']
});

PD.i18n.add({
  'set.dev': ['დეველოპერი', 'Developer'], 'set.devTouch': ['შეხებით ტესტი (მიკროფონის გარეშე)', 'Touch test (without microphone)'],
  'set.devTouchD': ['მხოლოდ შემოწმებისთვის: ტარზე შეხება ნოტად ითვლება. სწავლისას ეს არ გამოიყენება — ნოტს მხოლოდ ნამდვილი ფანდურის ხმა ასრულებს.', 'For testing only: tapping the neck counts as a note. Not used for learning — only the sound of a real panduri completes a note.']
});
PD.i18n.add({
  'hx.hello': ['გამარჯობა, {n}', 'Hello, {n}'], 'hx.goal': ['დღევანდელი მიზანი', "Today's goal"], 'hx.goalV': ['{a} / {b} წუთი', '{a} / {b} min'],
  'hx.continue': ['გააგრძელე სწავლა', 'Continue learning'], 'hx.start': ['დაიწყე აქედან', 'Start here'], 'hx.go': ['გაგრძელება', 'Continue'], 'hx.all': ['ყველა', 'All'],
  'hx.forYou': ['შენთვის', 'For you'], 'hx.songs': ['სიმღერები', 'Songs'], 'hx.melodies': ['მელოდიები', 'Melodies'], 'hx.rhythms': ['რიტმები', 'Rhythms'], 'hx.exercises': ['სავარჯიშოები', 'Exercises'], 'hx.recent': ['ბოლოს ნავარჯიშები', 'Recently practised'],
  'ln.tool': ['ხელსაწყო', 'Tool']
});
PD.app = (() => {
  const $ = PD.$, h = PD.h, LS = PD.lessons, TH = PD.theory, ic = PD.ic;
  const NAV = [['home', 'nav.home', ic.home], ['learn', 'nav.learn', ic.learn], ['songs', 'nav.songs', ic.song], ['practice', 'nav.practice', ic.pulse], ['profile', 'nav.profile', ic.user]];
  const TOP = { home: 'home', learn: 'learn', path: 'learn', songs: 'songs', library: 'songs', lesson: 'songs', practice: 'practice', daily: 'practice', trainer: 'practice', metronome: 'practice', rhythms: 'practice', rhythm: 'practice', tuner: 'practice', chords: 'practice', fretboard: 'practice', explore: 'practice', tools: 'practice', profile: 'profile', progress: 'profile', settings: 'profile', more: 'profile' };
  let route = 'home', param = null;
  const st = { cat: PD.store.get('home.cat', 'song'), q: '', level: 0, tempo: 0, status: 'all', sort: 'rec', skill: '', dur: 0 };

  function shell() {
    document.documentElement.lang = PD.i18n.lang;
    if (PD.store.get('hc', false)) document.documentElement.classList.add('hc');
    if (PD.store.get('reduceMotion', false)) document.documentElement.classList.add('rm');
    const ts = PD.store.get('textSize', 'm'); if (ts !== 'm') document.documentElement.classList.add('ts-' + ts);
    const rail = h('nav', { class: 'rail', 'aria-label': 'main' }, [h('div', { class: 'mark', html: '<span data-t="app.name"></span><small>A · C♯ · E</small>' })]);
    const bar = h('nav', { class: 'tabbar', 'aria-label': 'main' });
    NAV.forEach(([id, key, icon]) => {
      const mk = () => h('button', { class: 'navb', 'data-go': id, html: icon + '<span data-t="' + key + '"></span>', onclick: () => go(id) });
      rail.appendChild(mk()); bar.appendChild(mk());
    });
    const main = h('main', { class: 'main', id: 'main' });
    document.body.append(h('div', { class: 'shell', id: 'shell' }, [rail, main]), bar);
    PD.i18n.apply(document);
    PD.bus.on('lang', () => render());
    PD.bus.on('lessons', () => { if (['home', 'lesson', 'learn', 'path', 'songs'].includes(route)) render(); });
    window.addEventListener('popstate', e => { const s = e.state || { r: 'home' }; route = s.r; param = s.p; render(true); });
  }
  function go(r, p, replace) {
    if (r === 'library') r = 'songs'; if (r === 'more') r = 'profile'; if (r === 'tools') r = 'practice';
    route = r; param = p == null ? null : p;
    try { (replace ? history.replaceState : history.pushState).call(history, { r, p: param }, ''); } catch (_) {}
    render();
  }
  function render(fromPop) {
    const main = $('main'); main.innerHTML = '';
    const top = TOP[route] || 'home';
    document.querySelectorAll('.navb').forEach(b => { if (b.dataset.go === top) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    const page = h('div', { class: 'page', id: 'page' }), wrap = h('div', { class: 'wrap' }); page.appendChild(wrap); main.appendChild(page);
    PD.bus.emit('route', route);
    ({ rhythms: () => PD.rhythmsUI.list(wrap), rhythm: () => PD.rhythmsUI.detail(wrap, param), home, learn, songs, path: pathView, lesson: lessonView, practice: practiceHub,
      daily: () => PD.daily.page(wrap), trainer: () => PD.trainer.page(wrap, param), metronome: () => PD.metronome.page(wrap),
      tuner: () => PD.tools.tuner(wrap), chords: () => PD.tools.chords(wrap, param), fretboard: () => PD.tools.fretboard(wrap), explore: () => PD.tools.explore(wrap, param),
      progress, settings, profile }[route] || home)(wrap);
    PD.i18n.apply(main);
    if (!fromPop) page.scrollTop = 0;
  }

  /* ---------- shared bits ---------- */
  const TECH = new Set(['rh-down', 'rh-up', 'rh-alt', 'lh-fingers', 'lh-strings', 'pos-shift']);
  const catOf = l => l.rhythm ? 'rhythm' : ['song', 'melody', 'solo'].includes(l.type) ? l.type : TECH.has(l.id) ? 'technique' : 'exercise';
  function skillsOf(l) {
    if (l.skills) return l.skills;
    const ss = LS.steps(l), out = [];
    if (ss.some(s => s.kind === 'note')) out.push('notes');
    if (ss.some(s => s.notes.some(n => n.f > 0))) out.push('fingering');
    if (ss.some(s => s.kind === 'chord')) out.push('chords');
    if (ss.some(s => s.kind !== 'note') || ss.some(s => s.st === 'up')) out.push('strumming');
    if (ss.some(s => s.acc)) out.push('accents');
    if (ss.some(s => s.notes.some(n => n.f > 5))) out.push('positions');
    if (['melody', 'song', 'solo'].includes(l.type)) out.push('melody');
    return out;
  }
  function glyph(l) {
    const ss = LS.steps(l).slice(0, 7);
    if (!ss.length) return '<span>● REC</span>';
    const col = ['', '#D9783F', '#78B7DE', '#E3D3A6'], y = s => 40 - s * 9;
    let svg = '<svg viewBox="0 0 56 44" width="52" height="40" aria-hidden="true"><g stroke="rgba(242,232,218,.14)">' + [1, 2, 3].map(s => '<line x1="2" x2="54" y1="' + y(s) + '" y2="' + y(s) + '"/>').join('') + '</g>';
    ss.forEach((st, i) => { const x = 6 + i * 7; if (st.kind === 'note') svg += '<circle cx="' + x + '" cy="' + y(st.notes[0].s) + '" r="2.6" fill="' + col[st.notes[0].s] + '"/>'; else svg += '<rect x="' + (x - 1.5) + '" y="' + (y(3) - 3) + '" width="3" height="' + (y(1) - y(3) + 6) + '" rx="1.5" fill="#D6A15A"/>'; });
    return svg + '</svg>';
  }
  /** cover artwork, generated from the lesson id and category (no stock images, no copyrighted art) */
  const ART = {
    song: [['#FF8A5B', '#7A2E8E'], 'hills'], melody: [['#3FC1C9', '#2B3A8C'], 'waves'], solo: [['#FF5EA8', '#4B1D7A'], 'burst'],
    rhythm: [['#FF6B5B', '#3A1C5C'], 'beats'], exercise: [['#8B7BFF', '#1E2A6B'], 'dots'], technique: [['#41D39A', '#13405A'], 'rings']
  };
  function seedOf(str) { let x = 7; for (const c of String(str)) x = (x * 31 + c.charCodeAt(0)) % 2147483647; return () => (x = (x * 16807) % 2147483647) / 2147483647; }
  function coverSVG(l) {
    const cat = catOf(l), [cols, motif] = ART[cat] || ART.exercise, R = seedOf(l.id || 'x'), id = 'g' + Math.floor(R() * 1e9);
    const [a, b] = cols; let art = '';
    if (motif === 'hills') { for (let k = 0; k < 4; k++) { const y = 110 + k * 22, amp = 26 - k * 4; let d = 'M0 ' + y; for (let x = 0; x <= 320; x += 40) d += ' Q' + (x + 20) + ' ' + (y - amp * (R() + .3)) + ' ' + (x + 40) + ' ' + y; art += '<path d="' + d + ' V200 H0Z" fill="rgba(20,8,30,' + (.18 + k * .14).toFixed(2) + ')"/>'; } art = '<circle cx="' + (200 + R() * 70) + '" cy="' + (60 + R() * 20) + '" r="' + (26 + R() * 12) + '" fill="rgba(255,236,200,.85)"/>' + art; }
    else if (motif === 'waves') { for (let k = 0; k < 7; k++) { const y = 40 + k * 22, ph = R() * 6; let d = 'M0 ' + y; for (let x = 0; x <= 320; x += 10) d += ' L' + x + ' ' + (y + Math.sin(x / 34 + ph) * (8 + k)).toFixed(1); art += '<path d="' + d + '" fill="none" stroke="rgba(255,255,255,' + (.12 + k * .06).toFixed(2) + ')" stroke-width="' + (2 + k * .4).toFixed(1) + '"/>'; } }
    else if (motif === 'burst') { const cx = 220 + R() * 50, cy = 80 + R() * 30; for (let k = 0; k < 18; k++) { const an = k / 18 * Math.PI * 2 + R() * .2, r2 = 140 + R() * 60; art += '<path d="M' + cx + ' ' + cy + ' L' + (cx + Math.cos(an) * r2).toFixed(1) + ' ' + (cy + Math.sin(an) * r2).toFixed(1) + '" stroke="rgba(255,255,255,' + (.08 + R() * .18).toFixed(2) + ')" stroke-width="' + (2 + R() * 6).toFixed(1) + '"/>'; } art += '<circle cx="' + cx + '" cy="' + cy + '" r="22" fill="rgba(255,240,250,.9)"/>'; }
    else if (motif === 'beats') { for (let k = 0; k < 6; k++) { const x = 30 + k * 50, up = R() < .4, acc = R() < .35, y = 100, s2 = acc ? 34 : 24, w2 = acc ? 9 : 5; art += '<path d="M' + x + ' ' + (y - (up ? -s2 : s2)) + ' L' + x + ' ' + (y + (up ? -s2 : s2)) + ' M' + (x - s2 * .5) + ' ' + (y + (up ? -s2 * .45 : s2 * .45)) + ' L' + x + ' ' + (y + (up ? -s2 : s2)) + ' L' + (x + s2 * .5) + ' ' + (y + (up ? -s2 * .45 : s2 * .45)) + '" fill="none" stroke="rgba(255,255,255,' + (acc ? .85 : .4) + ')" stroke-width="' + w2 + '" stroke-linecap="round" stroke-linejoin="round"/>'; } }
    else if (motif === 'dots') { for (let k = 0; k < 3; k++) art += '<line x1="0" x2="320" y1="' + (60 + k * 40) + '" y2="' + (60 + k * 40) + '" stroke="rgba(255,255,255,.22)" stroke-width="2"/>'; for (let k = 1; k < 8; k++) art += '<line x1="' + k * 40 + '" x2="' + k * 40 + '" y1="44" y2="156" stroke="rgba(255,255,255,.12)" stroke-width="2"/>'; const fc = ['#E5534B', '#3FBF7A', '#E8C547', '#4C8EEA']; for (let k = 0; k < 4; k++) art += '<circle cx="' + (20 + Math.floor(R() * 7) * 40) + '" cy="' + (60 + Math.floor(R() * 3) * 40) + '" r="13" fill="' + fc[k] + '" opacity=".9"/>'; }
    else { for (let k = 0; k < 6; k++) art += '<circle cx="' + (230 + R() * 20) + '" cy="' + (100 + R() * 10) + '" r="' + (20 + k * 22) + '" fill="none" stroke="rgba(255,255,255,' + (.35 - k * .05).toFixed(2) + ')" stroke-width="' + (3 + R() * 3).toFixed(1) + '"/>'; }
    return '<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient></defs><rect width="320" height="200" fill="url(#' + id + ')"/>' + art + '</svg>';
  }
  function cover(l, big) { return h('div', { class: 'art' + (big ? ' big' : ''), html: coverSVG(l) }); }
  function durSec(l) { return LS.end(l) / (l.bpm / 60); }
  function meta(l) {
    const p = [t('type.' + l.type), t('lvl.' + (l.level || 1)), l.bpm + ' BPM'];
    if (l.events.length) p.push(PD.fmtTime(durSec(l))); else p.push(t('l.empty'));
    return p.join(' · ');
  }
  const demoBadge = l => l && l.demo ? h('span', { class: 'tag demo', title: t('demo.badgeD'), text: t('demo.badge') }) : null;
  function lessonRow(l) {
    const p = LS.progress.lesson(l.id), fav = LS.progress.favorites().includes(l.id), m = Math.round((p.mastery || 0) * 100);
    const row = h('div', { class: 'lrow', role: 'listitem' });
    const open = h('button', { class: 'lrow', style: 'padding:0;border:0;min-height:0;grid-template-columns:44px minmax(0,1fr);display:grid;align-items:center;gap:14px', onclick: () => go('lesson', l.id) }, [
      h('div', { class: 'glyph', html: glyph(l) }),
      h('div', { style: 'min-width:0;display:flex;flex-direction:column;gap:2px' }, [h('span', { class: 't' }, [PD.i18n.pick(l.title) + ' ', demoBadge(l)]), h('span', { class: 'meta', text: meta(l) })])]);
    const side = h('div', { class: 'side' }, [h('div', { class: 'mast', html: '<span>' + (p.plays ? m + '%' : '—') + '</span><div class="bar"><i style="width:' + m + '%"></i></div>' }), favBtn(l, fav)]);
    row.style.display = 'grid'; row.style.gridTemplateColumns = 'minmax(0,1fr) auto'; row.append(open, side);
    return row;
  }
  function favBtn(l, fav) { return h('button', { class: 'fav', 'aria-pressed': String(fav), 'aria-label': t('f.fav'), html: fav ? ic.starF : ic.star, onclick: e => { e.stopPropagation(); const on = LS.progress.toggleFav(l.id); e.currentTarget.setAttribute('aria-pressed', String(on)); e.currentTarget.innerHTML = on ? ic.starF : ic.star; } }); }
  /** artwork card: cover · title · difficulty · progress */
  function card(l, wide) {
    const p = LS.progress.lesson(l.id), m = Math.round((p.mastery || 0) * 100);
    const open = () => l.rhythm ? go('rhythm', l.rhythm) : go('lesson', l.id);
    return h('button', { class: 'acard' + (wide ? ' wide' : ''), onclick: open }, [
      h('div', { class: 'acard-art', html: coverSVG(l) + (l.demo ? '<span class="art-tag">' + PD.esc(t('demo.badge')) + '</span>' : '') + (m >= 90 ? '<span class="art-done">✓</span>' : '') }),
      h('span', { class: 'acard-t', text: PD.i18n.pick(l.title) }),
      h('span', { class: 'acard-m', text: t('lvl.' + (l.level || 1)) + (l.events.length ? ' · ' + PD.fmtTime(durSec(l)) : ' · ' + t('l.empty')) }),
      p.plays ? h('div', { class: 'acard-p' }, [h('i', { style: 'width:' + m + '%' })]) : null]);
  }
  const visible = l => !l.derived;
  function stat(v, k) { return h('div', { class: 'stat' }, [h('b', { text: v }), h('span', { text: k })]); }
  function streaks() {
    const days = [...new Set(LS.progress.sessions().map(s => new Date(s.date).toDateString()))].map(d => new Date(d).getTime()).sort((a, b) => a - b);
    let cur = 0; const d = new Date(); const set = new Set(days.map(x => new Date(x).toDateString()));
    while (set.has(d.toDateString())) { cur++; d.setDate(d.getDate() - 1); }
    let longest = 0, run = 0; for (let i = 0; i < days.length; i++) { run = i && days[i] - days[i - 1] <= 864e5 * 1.5 ? run + 1 : 1; longest = Math.max(longest, run); }
    return { cur, longest };
  }
  const streak = () => streaks().cur;
  function recommended() {
    const out = [];
    for (const p of LS.PATHS) for (const s of p.steps) { if (s.kind !== 'lesson') continue; const l = LS.get(s.id); if (!l || !l.events.length) continue; const pr = LS.progress.lesson(l.id); if (pr.mastery < .9) { out.push(l); break; } }
    return out;
  }
  function stepDone(s) { if (s.kind === 'lesson') return LS.progress.lesson(s.id).mastery >= .9; if (s.kind === 'rhythm') return LS.progress.lesson('rhythm-' + s.id).mastery >= .9; if (s.kind === 'needs') return false; return !!PD.store.get('seen.' + s.kind, false); }
  function levelName() { const ps = LS.PATHS; let lv = ps[0]; for (const p of ps) { lv = p; if (p.steps.some(s => s.kind !== 'needs' && !stepDone(s))) break; } return lv && lv.level ? t('lv.' + lv.level) : PD.i18n.pick(lv.title); }
  const todayMin = () => Math.round(LS.progress.sessions().filter(s => new Date(s.date).toDateString() === new Date().toDateString()).reduce((a, s) => a + (s.dur || 0), 0) / 60);

  /* ---------- Home ---------- */
  function primaryAction() {
    const res = LS.all.concat(LS.rhythmLessons()).map(l => ({ l, r: LS.progress.lesson(l.id).resume })).filter(x => x.r && x.l.events.length && x.r.at > Date.now() - 21 * 864e5).sort((a, b) => b.r.at - a.r.at)[0];
    if (res) return { kicker: t('hm.resume'), l: res.l, sub: t('hm.resumeD', { s: t('st.' + res.r.stage), b: Math.floor(res.r.beat / LS.bpb(res.l)) + 1 }), go: () => startStage(res.l, res.r.stage, res.r.beat), label: t('home.go') };
    const sug = PD.coach.today();
    if (sug) return { kicker: t('hm.today'), l: sug.lesson, sub: t(sug.key) + ' · ' + t('co.where', { l: '', a: sug.barA, b: sug.barB }).replace(/^ · /, ''), go: () => PD.coach.start(sug), label: t('co.go') };
    const nx = recommended()[0];
    if (nx) return { kicker: LS.progress.lesson(nx.id).plays ? t('hm.next') : t('home.firstTime'), l: nx, sub: meta(nx), go: () => go('lesson', nx.id), label: t(LS.progress.lesson(nx.id).plays ? 'home.go' : 'home.start') };
    return null;
  }
  function home(w) {
    const prof = PD.account.profile, sk = streaks(), goal = PD.store.get('goalMin', 15), tm = todayMin();
    const name = (prof.name || '').trim().split(/\s+/)[0];
    const ring = (v) => { const r = 15, c = 2 * Math.PI * r, k = Math.max(0, Math.min(1, v)); return '<svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true"><circle cx="20" cy="20" r="' + r + '" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="4"/><circle cx="20" cy="20" r="' + r + '" fill="none" stroke="url(#gr1)" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + (c * k).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 20 20)"/><defs><linearGradient id="gr1"><stop offset="0" stop-color="#7C6CFF"/><stop offset="1" stop-color="#C17BFF"/></linearGradient></defs></svg>'; };
    w.append(h('div', { class: 'hx-top' }, [
      h('div', { class: 'hx-hello' }, [h('h1', { text: name ? t('hx.hello', { n: name }) : t('gr.day') }), sk.cur ? h('span', { class: 'hx-streak', text: '🔥 ' + t('hm.streak', { n: sk.cur }) }) : null]),
      h('button', { class: 'avatar', 'aria-label': t('nav.profile'), onclick: () => go('profile'), html: prof.avatar ? '<img alt="" src="' + PD.esc(prof.avatar) + '">' : ic.user })]));
    w.append(h('button', { class: 'hx-goal', onclick: () => go('daily') }, [h('span', { class: 'hx-ring', html: ring(tm / goal) }), h('div', { class: 'grow' }, [h('small', { 'data-t': 'hx.goal' }), h('b', { text: t('hx.goalV', { a: Math.min(tm, goal), b: goal }) })]), h('span', { class: 'chev', html: ic.chevron })]));
    // hero: continue learning
    const pa = primaryAction();
    if (pa) {
      const p = LS.progress.lesson(pa.l.id), m = Math.round((p.mastery || 0) * 100);
      w.append(h('section', { class: 'hx-hero', onclick: e => { if (!e.target.closest('button')) pa.go(); } }, [
        h('div', { class: 'hx-art', html: coverSVG(pa.l) }),
        h('div', { class: 'hx-body' }, [h('span', { class: 'hx-k', text: p.plays ? t('hx.continue') : t('hx.start') }), h('h2', { text: PD.i18n.pick(pa.l.title) }),
          h('div', { class: 'hx-pr' }, [h('div', { class: 'hx-bar' }, [h('i', { style: 'width:' + m + '%' })]), h('span', { text: m + '%' })]),
          h('button', { class: 'btn hx-btn', text: p.plays ? t('hx.go') : t('home.start'), onclick: pa.go })])]));
    }
    const row = (k, items, more) => { if (!items.length) return; w.append(h('section', { class: 'hrow' }, [h('div', { class: 'hrow-h' }, [h('h2', { 'data-t': k }), more ? h('button', { class: 'linkbtn', 'data-t': 'hx.all', onclick: more }) : null]), h('div', { class: 'hrow-s' }, items.map(l => card(l)))])); };
    const all = LS.all.filter(visible);
    const rec = []; for (const p of LS.PATHS) for (const s2 of p.steps) { const l = s2.kind === 'lesson' ? LS.get(s2.id) : s2.kind === 'rhythm' ? LS.get('rhythm-' + s2.id) : null; if (l && l.events.length && LS.progress.lesson(l.id).mastery < .9 && !rec.includes(l) && (!pa || l !== pa.l)) rec.push(l); }
    row('hx.forYou', rec.slice(0, 6));
    row('hx.songs', all.filter(l => l.type === 'song'), () => { st.cat = 'song'; go('songs'); });
    row('hx.melodies', all.filter(l => l.type === 'melody'), () => { st.cat = 'melody'; go('songs'); });
    row('hx.rhythms', LS.rhythmLessons(), () => go('rhythms'));
    row('hx.exercises', all.filter(l => catOf(l) === 'exercise' || catOf(l) === 'technique'));
    const recent = []; LS.progress.sessions().slice().reverse().forEach(se => { const l = LS.get(se.id); if (l && !recent.includes(l)) recent.push(l); });
    row('hx.recent', recent.slice(0, 8));
    if (PD.curriculum.isDemo) w.append(h('p', { class: 'hx-note', html: '<b>' + PD.esc(t('demo.badge')) + '</b> · ' + PD.esc(t('hm.demo')) }));
  }

  /* ---------- Songs: music-app browsing — songs · melodies · solos, by difficulty ---------- */
  function songs(w) {
    const cats = ['song', 'melody', 'solo']; if (!cats.includes(st.cat)) st.cat = 'song';
    const tabs = h('div', { class: 'sx-tabs', role: 'tablist' }, cats.map(k => h('button', { role: 'tab', 'aria-pressed': String(st.cat === k), 'data-t': 'cat.' + k, onclick: () => { st.cat = k; PD.store.set('home.cat', k); render(); } })));
    const lv = h('div', { class: 'sx-chips' }, [[0, 'f.all'], [1, 'lvl.1'], [2, 'lvl.2'], [3, 'lvl.3']].map(([v, k]) => h('button', { class: 'chip', 'aria-pressed': String(st.level === v), 'data-t': k, onclick: () => { st.level = v; render(); } })));
    const search = h('label', { class: 'search' }, [h('span', { html: ic.search }), h('input', { type: 'search', value: st.q, 'data-t-ph': 'home.search', 'aria-label': t('home.search'), oninput: e => { st.q = e.target.value; list(); } })]);
    const box = h('div', { class: 'sx-grid', role: 'list' });
    w.append(h('h1', { 'data-t': 'nav.songs' }), search, tabs, lv, box);
    function list() {
      box.innerHTML = '';
      const q = st.q.trim().toLowerCase();
      let ls = LS.all.filter(visible).filter(l => q ? (l.title.ka + ' ' + l.title.en).toLowerCase().includes(q) : catOf(l) === st.cat);
      if (st.level) ls = ls.filter(l => (l.level || 1) === st.level);
      ls.sort((a, b) => (a.level || 1) - (b.level || 1));
      ls.forEach(l => box.appendChild(card(l)));
      if (!ls.length) box.appendChild(h('div', { class: 'empty', text: !q && st.cat === 'solo' ? t('lib.noSolos') : t('lib.none') }));
      if (PD.store.get('author', false) && !q) box.appendChild(h('button', { class: 'acard add', onclick: () => PD.studio.open(null, st.cat), html: '<div class="acard-art">' + ic.plus + '</div><span class="acard-t">' + PD.esc(t('lib.new')) + '</span>' }));
      PD.i18n.apply(box);
    }
    list();
  }

  /* ---------- Learn: one visual path, Foundation → Beginner → Intermediate → Advanced ---------- */
  function learn(w) {
    w.append(h('div', {}, [h('h1', { 'data-t': 'ln.title' }), h('p', { class: 'muted', style: 'margin-top:6px', 'data-t': 'ln.lead' })]));
    const TOOL = { tour: ic.cube, tuner: ic.tune, trainer: ic.target, chords: ic.chord, fretboard: ic.frets };
    let curSet = false, focusEl = null;
    LS.PATHS.forEach((p, pi) => {
      const real = p.steps.filter(s2 => s2.kind !== 'needs'), d = real.filter(stepDone).length;
      const sec = h('section', { class: 'lp', id: 'lp-' + p.id }, [h('div', { class: 'lp-h' }, [h('span', { class: 'lp-n', text: String(pi + 1) }), h('div', { class: 'grow' }, [h('h2', { text: PD.i18n.pick(p.title) }), h('small', { text: t('learn.steps', { d, n: real.length }) })])])]);
      const path = h('ol', { class: 'lp-path' });
      p.steps.forEach(s2 => {
        const done = stepDone(s2), need = s2.kind === 'needs', cur = !need && !done && !curSet; if (cur) curSet = true;
        const l = s2.kind === 'lesson' ? LS.get(s2.id) : s2.kind === 'rhythm' ? LS.get('rhythm-' + s2.id) : null;
        const thumb = l ? h('div', { class: 'lp-th', html: coverSVG(l) }) : h('div', { class: 'lp-th tool' + (need ? ' need' : ''), html: need ? '…' : (TOOL[s2.kind] || ic.learn) });
        const meta2 = need ? t('ln.awaiting') : l ? t('lvl.' + (l.level || 1)) + (l.events.length ? ' · ' + PD.fmtTime(durSec(l)) : '') + (l.demo ? ' · ' + t('demo.badge') : '') : t('ln.tool');
        const li = h('li', { class: 'lp-s' + (done ? ' done' : '') + (cur ? ' cur' : '') + (need ? ' need' : '') }, [
          h('span', { class: 'lp-dot', html: done ? ic.check : '' }),
          h(need ? 'div' : 'button', need ? { class: 'lp-c' } : { class: 'lp-c', onclick: () => stepGo(s2) }, [thumb, h('div', { class: 'lp-tx' }, [h('b', { text: stepTitle(s2) }), h('small', { text: meta2 })]), cur ? h('span', { class: 'lp-go', 'data-t': 'home.start' }) : null])]);
        if (cur) focusEl = li;
        path.appendChild(li);
      });
      sec.appendChild(path); w.append(sec);
    });
    if (param && document.getElementById('lp-' + param)) requestAnimationFrame(() => document.getElementById('lp-' + param).scrollIntoView({ block: 'start' }));
    else if (focusEl) requestAnimationFrame(() => { const pg = document.getElementById('page'); if (pg && focusEl.offsetTop > pg.clientHeight * .6) focusEl.scrollIntoView({ block: 'center' }); });
  }
  function stepTitle(s) { const l = s.kind === 'lesson' ? LS.get(s.id) : s.kind === 'rhythm' ? LS.get('rhythm-' + s.id) : null; return l ? PD.i18n.pick(l.title) : PD.i18n.pick(s.title); }
  function stepGo(s) {
    if (s.kind === 'lesson') return go('lesson', s.id);
    if (s.kind === 'rhythm') return go('rhythm', s.id);
    PD.store.set('seen.' + s.kind, true);
    if (s.kind === 'tour') go('explore', 'tour'); else if (s.kind === 'tuner') go('tuner'); else if (s.kind === 'chords') go('chords'); else if (s.kind === 'fretboard') go('fretboard'); else if (s.kind === 'trainer') go('trainer');
  }
  function stepChip(s) {
    if (s.kind === 'needs') return h('span', { class: 'schip need', title: t('ln.awaiting'), text: PD.i18n.pick(s.title) });
    const l = s.kind === 'lesson' ? LS.get(s.id) : null;
    return h('button', { class: 'schip' + (stepDone(s) ? ' done' : ''), onclick: () => stepGo(s) }, [stepTitle(s), l && l.demo ? h('span', { class: 'tag demo', text: t('demo.badge') }) : null]);
  }
  function pathView(w) { return learn(w); }

  /* ---------- Song / lesson intro: what you learn → Learn · Practice · Play full song → sections ---------- */
  const OLD = { listen: 'demo', notes: 'guided', rhythm: 'technique' };
  const stagePct = (p, s) => { const st2 = p.stages || {}; let v = st2[s]; Object.keys(OLD).forEach(k => { if (OLD[k] === s && st2[k] != null) v = Math.max(v || 0, st2[k]); }); return v; };
  function lessonView(w) {
    const l = LS.get(param); if (!l) return home(w);
    if (l.rhythm) return go('rhythm', l.rhythm, true);
    const p = LS.progress.lesson(l.id), has = l.events.length > 0, sk = skillsOf(l), m = Math.round((p.mastery || 0) * 100);
    const ss = LS.steps(l);
    const stages = LS.stagesOf(l);
    w.append(h('div', { class: 'lx-hero' }, [h('div', { class: 'lx-art', html: coverSVG(l) }),
      h('div', { class: 'lx-bar' }, [h('button', { class: 'pz-ic lx-ic', 'aria-label': t('back'), html: ic.back, onclick: () => history.length > 1 ? history.back() : go('songs') }), h('span', { class: 'spacer' }), favBtn(l, LS.progress.favorites().includes(l.id))])]));
    w.append(h('div', { class: 'lx-head' }, [h('h1', { text: PD.i18n.pick(l.title) }),
      h('div', { class: 'lx-meta' }, [h('span', { class: 'lx-lv lv' + (l.level || 1), text: t('lvl.' + (l.level || 1)) }), h('span', { text: t('type.' + l.type) }), has ? h('span', { text: PD.fmtTime(durSec(l)) }) : null, h('span', { text: l.bpm + ' BPM' }), l.demo ? h('span', { class: 'tag demo', title: t('demo.badgeD'), text: t('demo.badge') }) : null]),
      l.desc ? h('p', { class: 'fg2', text: PD.i18n.pick(l.desc) }) : null,
      sk.length ? h('div', { class: 'lx-skills' }, sk.map(k => h('span', { text: t('sk.' + k) }))) : null,
      p.plays ? h('div', { class: 'lx-prog' }, [h('div', { class: 'hx-bar' }, [h('i', { style: 'width:' + m + '%' })]), h('span', { text: m + '%' })]) : null]));
    const chips = h('div', { class: 'row' });
    if (l.link) chips.append(h('a', { class: 'btn small', href: l.link, target: '_blank', rel: 'noopener', 'data-t': 'les.ref' }));
    if (l.user) chips.append(h('button', { class: 'btn small', html: PD.ic.mic + '<span data-t="les.record"></span>', onclick: () => PD.practice.record(l) }));
    if (PD.store.get('author', false)) chips.append(h('button', { class: 'btn small', html: ic.edit + '<span data-t="les.edit"></span>', onclick: () => PD.studio.open(l.id) }));
    if (!has) { w.append(chips, h('div', { class: 'empty', text: t('les.noNotes') })); return; }
    const firstUndone = stages.find(s => !(stagePct(p, s) >= 80)) || 'wait';
    w.append(h('div', { class: 'ls-actions lx-actions' }, [
      h('button', { class: 'btn primary big', 'data-t': 'ls.learnBtn', onclick: () => startStage(l, p.resume && stages.includes(p.resume.stage) ? p.resume.stage : firstUndone === 'demo' || firstUndone === 'intro' ? 'wait' : firstUndone, p.resume ? p.resume.beat : 0) }),
      h('button', { class: 'btn', 'data-t': 'ls.practiceBtn', onclick: () => startStage(l, 'loop') }),
      h('button', { class: 'btn', 'data-t': 'ls.fullBtn', onclick: () => startStage(l, 'perform') }),
      h('button', { class: 'btn quiet', html: ic.play + '<span data-t="ls.listen"></span>', onclick: () => startStage(l, 'demo') })]), chips);
    if (p.resume && stages.includes(p.resume.stage)) w.append(h('p', { class: 'muted', style: 'font-size:13px', text: t('les.resumeAt', { s: t('st.' + p.resume.stage), b: Math.floor(p.resume.beat / LS.bpb(l)) + 1 }) }));
    const sug = PD.coach.analyze(l);
    if (sug) w.append(h('section', { class: 'coach' }, [h('span', { class: 'kicker', 'data-t': 'les.coach' }), h('b', { text: t(sug.key) + ' ' + t('w.bars', { a: sug.barA, b: sug.barB }) }), h('p', { class: 'muted', style: 'font-size:13px', text: t('co.ladder', { a: sug.ladder.from, b: sug.ladder.to, s: sug.ladder.step, t: sug.ladder.thr }) }), h('div', { class: 'row' }, [h('button', { class: 'btn', 'data-t': 'co.go', onclick: () => PD.coach.start(sug) })])]));
    // lesson sections: Intro · Phrase 1… · Rhythm · Combined · Full performance (beginners are never dropped straight into the whole song)
    const secs = [];
    if (l.intro || (l.media && l.media.length)) secs.push({ k: 'ls.intro', d: 'ls.introD', go: () => startStage(l, 'intro'), pct: stagePct(p, 'intro') });
    (l.sections || []).forEach(sc => secs.push({ title: PD.i18n.pick(sc.name), d: 'ls.phraseD', go: () => PD.practice.open(l, { wait: true, tempo: .7, mode: 'learn', drill: { a: sc.from, b: sc.to } }, l.id, 'phrase') }));
    if (ss.some(s => s.st)) secs.push({ k: 'ls.rhythm', d: 'ls.rhythmD', go: () => startStage(l, 'technique'), pct: stagePct(p, 'technique') });
    secs.push({ k: 'ls.combined', d: 'ls.combinedD', go: () => startStage(l, 'slow'), pct: stagePct(p, 'slow') });
    secs.push({ k: 'ls.full', d: 'ls.fullD', go: () => startStage(l, 'perform'), pct: stagePct(p, 'perform') });
    const list = h('div', { class: 'list' });
    secs.forEach((x, i) => {
      const done = x.pct >= 80, body = h('div', { class: 'body' }, [h('b', x.k ? { 'data-t': x.k } : { text: x.title }), h('p', { 'data-t': x.d })]);
      if (x.pct != null) body.append(h('div', { class: 'row', style: 'max-width:240px' }, [h('div', { class: 'bar', style: 'flex:1' }, [h('i', { style: 'width:' + x.pct + '%' })]), h('span', { class: 'mono muted', style: 'font-size:11px', text: x.pct + '%' })]));
      list.appendChild(h('div', { class: 'step' }, [h('span', { class: 'num' + (done ? ' done' : ''), text: done ? '✓' : String(i + 1) }), body, h('button', { class: 'btn small', 'data-t': 'home.start', onclick: x.go })]));
    });
    w.append(h('h3', { 'data-t': 'ls.sections', style: 'margin-top:4px' }), list);
    if (p.lastResult) w.append(h('p', { class: 'muted', style: 'font-size:13px', text: t('st.result') + ': ' + PD.practice.summary(p.lastResult) }));
  }
  function introSheet(l) {
    PD.ui.sheet((box, close) => {
      box.append(h('h2', { text: PD.i18n.pick(l.title) }));
      if (l.intro) box.append(h('p', { class: 'fg2', style: 'white-space:pre-line;line-height:1.6', text: PD.i18n.pick(l.intro) }));
      else if (l.desc) box.append(h('p', { class: 'fg2', text: PD.i18n.pick(l.desc) }));
      const vid = h('div'); box.append(vid);
      if (l.media && l.media.length) { PD.media.load(l); PD.media.mount(vid); PD.media.sync(0, 1, false, true); }
      box.append(h('button', { class: 'btn primary', 'data-t': 'done', onclick: () => { const p = LS.progress.lesson(l.id); p.stages = p.stages || {}; p.stages.intro = 100; LS.progress.saveLesson(l.id, p); close(); } }));
    }, { onClose: () => { PD.media.unload(); render(); } });
  }
  function startStage(l, s, resumeBeat) {
    const p = LS.progress.lesson(l.id); p.lastStage = s; LS.progress.saveLesson(l.id, p);
    if (s === 'intro') return introSheet(l);
    const waitDef = PD.store.get('waitDefault', true);
    const o = { demo: { autoplay: true, tempo: 1, wait: false, mode: 'learn' }, guided: { stepMode: true, wait: true, tempo: .6, mode: 'learn', autoDemo: true }, wait: { wait: waitDef, tempo: .7, mode: waitDef ? 'learn' : 'practice' },
      slow: { wait: false, tempo: .6, mode: 'practice' }, perform: { wait: false, tempo: 1, mode: 'perform' }, technique: { wait: true, tempo: .7, mode: 'learn' },
      watch: { autoplay: true, tempo: .7, wait: false, mode: 'learn' }, metro: { wait: false, tempo: l.metro ? 1 : .8, mode: 'practice', metro: true },
      loop: { wait: false, tempo: .7, mode: 'practice', loop: { a: 0, b: LS.end(l), on: true } } }[s] || { wait: true, tempo: .7 };
    if (resumeBeat > 0) o.resumeBeat = resumeBeat;
    if (s === 'technique') {
      const tq = l.technique || { kind: 'rhythm' };
      if (tq.kind === 'section' && tq.from != null) return PD.practice.open(l, { wait: true, tempo: tq.tempo || .6, mode: 'learn', drill: { a: tq.from, b: tq.to } }, l.id, s);
      return PD.practice.open(LS.rhythmOf(l), o, l.id, s);
    }
    if (s === 'phrase') {
      const sug = PD.coach.analyze(l);
      if (sug) return PD.practice.open(l, { mode: 'practice', wait: false, drill: { a: sug.from, b: sug.to, ladder: sug.ladder } }, l.id, s);
      const heat = p.heat || [], bpb = LS.bpb(l); let worst = l.sections[0];
      if (heat.length) { const sc = l.sections.map(x => { const bars = heat.slice(Math.floor(x.from / bpb), Math.ceil(x.to / bpb)).filter(v => v >= 0); return { x, v: bars.length ? bars.reduce((a, b) => a + b, 0) / bars.length : 2 }; }); worst = sc.sort((a, b) => a.v - b.v)[0].x; }
      return PD.practice.open(l, { wait: true, tempo: .7, mode: 'practice', drill: { a: worst.from, b: worst.to } }, l.id, s);
    }
    PD.practice.open(l, o, l.id, s);
  }

  /* ---------- Practice hub ---------- */
  function practiceHub(w) {
    w.append(h('div', {}, [h('h1', { 'data-t': 'ph.title' }), h('p', { class: 'muted', style: 'margin-top:6px', 'data-t': 'ph.lead' })]));
    const plan = PD.daily.plan(), dn = plan.filter(x => x.done).length, nextSeg = plan.find(x => !x.done && x.go);
    w.append(h('section', { class: 'cont daily-hero' }, [h('span', { class: 'kicker', 'data-t': 'hm.daily' }), h('h2', { text: t('dl.lead', { m: PD.store.get('goalMin', 15) }) }),
      h('div', { class: 'steps-line', style: 'max-width:360px' }, plan.map(x => h('i', { class: x.done ? 'done' : '' }))), h('span', { class: 'muted', style: 'font-size:13px', text: plan.map(x => t(x.key)).join(' · ') }),
      h('div', { class: 'row', style: 'margin-top:8px' }, [h('button', { class: 'btn primary', 'data-t': dn === plan.length ? 'dl.done' : 'home.start', onclick: () => nextSeg ? PD.daily.start(nextSeg) : go('daily') }), h('button', { class: 'btn quiet', 'data-t': 'learn.open', onclick: () => go('daily') })])]));
    const tool = (r, icon, k, d) => h('button', { class: 'card path tool', onclick: () => go(r) }, [h('span', { class: 'tool-ic', html: icon }), h('h2', { 'data-t': k }), h('span', { class: 'muted', 'data-t': d })]);
    const items = [['trainer', ic.target, 'tr.title', 'ph.trainerD'], ['rhythms', ic.pulse, 'nav.rhythms', 'ph.rhythmsD'], ['metronome', ic.metro, 'mt.title', 'ph.metroD'], ['tuner', ic.tune, 'tools.tuner', 'tools.tunerD'], ['chords', ic.chord, 'tools.chords', 'tools.chordsD'], ['fretboard', ic.frets, 'tools.fret', 'tools.fretD'], ['explore', ic.cube, 'tools.3d', 'tools.3dD']];
    w.append(h('div', { class: 'paths' }, items.map(x => tool(...x))));
    if (PD.store.get('author', false)) w.append(h('div', { class: 'paths' }, [['studio', ic.edit, 'tools.studio', 'tools.studioD'], ['at:instrument', ic.frets, 'sd.instrument', 'at.instrument'], ['at:curriculum', ic.learn, 'sd.curriculum', 'at.curD'], ['at:samples', ic.mic, 'sd.samples', 'set.samples']].map(([r, icon, k, d]) => h('button', { class: 'card path tool', onclick: () => r === 'studio' ? PD.studio.open(null) : PD.authorTools[r.slice(3)]() }, [h('span', { class: 'tool-ic', html: icon }), h('h2', { 'data-t': k }), h('span', { class: 'muted', 'data-t': d })]))));
  }

  /* ---------- Profile ---------- */
  function achievements() {
    const ss = LS.progress.sessions(), sk = streaks();
    const melodyDone = ss.some(s => (s.type === 'melody' || s.type === 'song') && s.firstTry > 0);
    const notes = ss.reduce((a, s) => a + (s.correct || 0), 0) + ss.filter(s => String(s.id).startsWith('trainer:')).reduce((a, s) => a + Math.round((s.firstTry || 0) * 10), 0);
    const perfectRhythm = ss.some(s => s.rhythm && !s.waited && s.firstTry >= .999 && s.timing != null && s.timing >= .99);
    const fullSong = LS.all.some(l => l.type === 'song' && (LS.progress.lesson(l.id).stages || {}).perform >= 80);
    return [['firstMelody', melodyDone], ['sessions10', ss.length >= 10], ['perfectRhythm', perfectRhythm], ['notes100', notes >= 100], ['fullSong', fullSong], ['week', sk.longest >= 7]];
  }
  function profile(w) {
    const prof = PD.account.profile, sk = streaks(), sess = PD.account.session;
    const photo = h('input', { type: 'file', accept: 'image/*', hidden: true, onchange: async e => { const f = e.target.files[0]; if (!f) return; const url = await shrink(f); PD.account.setProfile({ avatar: url }); render(); } });
    const name = h('input', { class: 'input name-in', value: prof.name || '', placeholder: t('acct.guest'), 'aria-label': t('acct.name'), onchange: e => { PD.account.setProfile({ name: e.target.value.trim() }); } });
    w.append(h('div', { class: 'pf-head' }, [h('button', { class: 'avatar big', 'aria-label': t('pf.photo'), title: t('pf.photo'), onclick: () => photo.click(), html: prof.avatar ? '<img alt="" src="' + PD.esc(prof.avatar) + '">' : prof.name ? PD.esc(prof.name.charAt(0).toUpperCase()) : ic.user }), photo,
      h('div', { class: 'pf-id' }, [name, h('span', { class: 'muted', text: t('pr.level') + ': ' + levelName() + ' · ' + t('hm.streak', { n: sk.cur }) + ' · ' + t('pr.longest') + ' ' + t('pr.days', { n: sk.longest }) })])]));
    const goalSeg = h('div', { class: 'seg', role: 'group', 'aria-label': t('pf.goal') }, [5, 10, 15, 20, 30].map(m => h('button', { 'aria-pressed': String(PD.store.get('goalMin', 15) === m), text: t('dl.min', { n: m }), onclick: e => { PD.store.set('goalMin', m); goalSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); } })));
    w.append(h('section', { class: 'set-sec' }, [h('h2', { 'data-t': 'pf.goal' }), goalSeg]));
    w.append(h('section', { class: 'set-sec' }, [h('h2', { 'data-t': 'pf.account' }), h('div', { class: 'list' }, [
      h('div', { class: 'li' }, [h('div', { class: 'grow' }, [h('span', { text: sess && sess.email ? t('au.signedIn', { e: sess.email }) : t('pf.guest') }), h('small', { 'data-t': 'acct.noBackend' })]), h('button', { class: 'btn small', 'data-t': 'pf.signin', onclick: () => PD.auth.open('signin') })]),
      h('div', { class: 'li' }, [h('div', { class: 'grow' }, [h('span', { 'data-t': 'au.sync' }), h('small', { text: PD.account.remote.configured ? '' : t('au.syncOff') })])]),
      h('div', { class: 'li' }, [h('div', { class: 'grow' }, [h('span', { 'data-t': 'au.subscription' }), h('small', { 'data-t': 'au.subOff' })])]),
      h('div', { class: 'li' }, [h('div', { class: 'grow' }, [h('span', { 'data-t': 'acct.export' })]), h('span', { class: 'row', style: 'gap:6px' }, [
        h('button', { class: 'btn small', html: ic.dl + '<span data-t="acct.export"></span>', onclick: () => PD.ui.download('panduri-data.json', JSON.stringify({ schema: 'panduri-data', v: 1, data: PD.store.exportAll() }, null, 1)) }),
        h('button', { class: 'btn small', html: ic.ul + '<span data-t="acct.import"></span>', onclick: async () => { const f = await PD.ui.pickFile('application/json'); if (!f) return; try { const o = JSON.parse(await f.text()); PD.store.importAll(o.data || o); PD.ui.toast(t('toast.imported')); setTimeout(() => location.reload(), 600); } catch (e) { PD.ui.toast('JSON: ' + e.message); } } })])])])]));
    w.append(h('section', { class: 'set-sec' }, [h('h2', { 'data-t': 'pf.achievements' }), h('div', { class: 'ach' }, achievements().map(([k, ok]) => h('div', { class: 'ach-i' + (ok ? ' ok' : '') }, [h('span', { class: 'ach-mark', html: ok ? ic.check : '' }), h('div', {}, [h('b', { 'data-t': 'ac.' + k }), h('small', { 'data-t': 'ac.' + k + 'D' })])])))]));
    const favs = LS.progress.favorites().map(id => LS.get(id)).filter(Boolean);
    w.append(h('section', { class: 'set-sec' }, [h('h2', { 'data-t': 'pf.saved' }), favs.length ? h('div', { class: 'list' }, favs.map(lessonRow)) : h('p', { class: 'muted', style: 'font-size:13px', 'data-t': 'pr.none' })]));
    w.append(h('section', { class: 'set-sec' }, [h('h2', { 'data-t': 'pf.downloads' }), h('p', { class: 'muted', style: 'font-size:13px;line-height:1.6', 'data-t': 'pf.downloadsD' })]));
    w.append(h('section', { class: 'set-sec' }, [h('h2', { 'data-t': 'pf.links' }), h('div', { class: 'list' }, [
      h('button', { class: 'li', onclick: () => go('progress') }, [h('div', { class: 'grow' }, [h('span', { 'data-t': 'nav.progress' })]), h('span', { html: ic.chevron, class: 'chev' })]),
      h('button', { class: 'li', onclick: () => go('settings') }, [h('div', { class: 'grow' }, [h('span', { 'data-t': 'more.settings' }), h('small', { 'data-t': 'more.settingsD' })]), h('span', { html: ic.chevron, class: 'chev' })])])]));
  }
  function shrink(file) { return new Promise(res => { const img = new Image(), r = new FileReader(); r.onload = () => { img.onload = () => { const c = document.createElement('canvas'), k = 160 / Math.max(img.width, img.height); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', .85)); }; img.src = r.result; }; r.readAsDataURL(file); }); }

  /* ---------- Progress: real improvement, no game ---------- */
  function progress(w) {
    const ss = LS.progress.sessions(), played = LS.all.filter(l => visible(l) && LS.progress.lesson(l.id).plays);
    const mastered = played.filter(l => LS.progress.lesson(l.id).mastery >= .9), totalSec = ss.reduce((a, s) => a + (s.dur || 0), 0), sk = streaks();
    const avg = arr => { const a = arr.filter(v => v != null); return a.length ? a.reduce((x, y) => x + y, 0) / a.length : null; };
    const noteAcc = avg(ss.map(s => s.pitch)), timeAcc = avg(ss.filter(s => !s.waited).map(s => s.timing)), avgBpm = avg(ss.map(s => s.bpm));
    const rhythmsLearned = PD.curriculum.rhythms().filter(r => LS.progress.lesson('rhythm-' + r.id).mastery >= .9).length;
    w.append(h('div', { class: 'row', style: 'align-items:flex-end' }, [h('div', {}, [h('h1', { 'data-t': 'pr.title' }), h('p', { class: 'muted', style: 'margin-top:6px', 'data-t': 'pr.lead' })]), h('span', { class: 'spacer' }), h('button', { class: 'btn small', html: ic.back + '<span data-t="back"></span>', onclick: () => go('profile') })]));
    const pc = v => v == null ? '—' : Math.round(v * 100) + '%';
    w.append(h('div', { class: 'pgrid' }, [
      stat(Math.floor(totalSec / 3600) + ':' + String(Math.floor(totalSec % 3600 / 60)).padStart(2, '0'), t('pr.time')), stat(levelName(), t('pr.level')),
      stat(mastered.length + ' / ' + LS.all.filter(l => visible(l) && l.events.length).length, t('pr.completed')), stat(String(mastered.filter(l => l.type === 'song').length), t('pr.songs')),
      stat(String(rhythmsLearned) + ' / ' + PD.curriculum.rhythms().length, t('pr.rhythms')), stat(pc(noteAcc), t('pr.noteAcc')),
      stat(pc(timeAcc), t('pr.timeAcc')), stat(avgBpm ? Math.round(avgBpm) + ' BPM' : '—', t('pr.avgTempo')), stat(t('pr.days', { n: sk.longest }), t('pr.longest'))]));
    // real improvement: last 7 days vs the 7 before
    const wk = 7 * 864e5, now = Date.now(), lastW = ss.filter(s => s.date > now - wk), prevW = ss.filter(s => s.date <= now - wk && s.date > now - 2 * wk);
    const trends = [['pr.timeAcc', s => s.waited ? null : s.timing], ['pr.noteAcc', s => s.pitch]].map(([k, f]) => { const a = avg(prevW.map(f)), b = avg(lastW.map(f)); return a != null && b != null ? h('p', { class: 'trend', text: t('pr.trend', { k: t(k), a: pc(a), b: pc(b) }) }) : null; }).filter(Boolean);
    if (trends.length) w.append(h('section', { class: 'panel' }, trends));
    // skill map (calm horizontal bars; each from measured data)
    const mOf = pred => avg(LS.all.filter(l => visible(l) && l.events.length && pred(l) && LS.progress.lesson(l.id).plays).map(l => LS.progress.lesson(l.id).mastery));
    const skills = [['sk.notes', noteAcc], ['r.timing', timeAcc], ['sk.rhythm', avg(ss.filter(s => s.rhythm).map(s => s.firstTry))], ['sk.fingering', mOf(l => LS.steps(l).some(s => s.notes.some(n => n.f > 0)))],
      ['sk.strumming', mOf(l => LS.steps(l).some(s => s.kind !== 'note'))], ['sk.speed', avg(played.map(l => (LS.progress.lesson(l.id).maxTempo || 0) / 100).filter(v => v > 0))], ['nav.songs', mOf(l => l.type === 'song')]];
    w.append(h('section', { class: 'panel' }, [h('h2', { 'data-t': 'pr.skills' }), h('div', { class: 'skillmap' }, skills.map(([k, v]) => h('div', { class: 'sm-row' }, [h('span', { 'data-t': k }), h('div', { class: 'bar' }, [h('i', { style: 'width:' + (v == null ? 0 : Math.round(Math.min(1, v) * 100)) + '%' })]), h('span', { class: 'mono muted', text: pc(v) })])))]));
    const pitch = ss.filter(s => s.pitch != null).slice(-30), timing = ss.filter(s => s.timing != null && !s.waited).slice(-30);
    w.append(h('div', { class: 'two' }, [chartCard(t('pr.pitchTrend'), pitch.map(s => ({ v: s.pitch, d: s.date, id: s.id })), t('pr.noData')), chartCard(t('pr.timingTrend'), timing.map(s => ({ v: s.timing, d: s.date, id: s.id })), timing.length ? '' : t('pr.noTiming'))]));
    const diff = played.map(l => PD.coach.analyze(l)).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 4);
    w.append(h('section', { class: 'panel' }, [h('h2', { 'data-t': 'pr.difficult' }), h('p', { class: 'muted', style: 'font-size:13px', 'data-t': 'pr.difficultD' }),
      h('div', { class: 'list' }, diff.length ? diff.map(d => h('div', { class: 'li' }, [h('div', { class: 'grow' }, [h('span', { text: PD.i18n.pick(d.lesson.title) + ' · ' + t('w.bars', { a: d.barA, b: d.barB }) }), h('small', { text: t(d.key) })]), h('button', { class: 'btn small', 'data-t': 'co.go', onclick: () => PD.coach.start(d) })])) : [h('div', { class: 'li muted', 'data-t': 'pr.none' })])]));
    const probs = {}; ss.forEach(s => Object.keys(s.probs || {}).forEach(k => probs[k] = (probs[k] || 0) + s.probs[k]));
    w.append(h('section', { class: 'panel fretheat' }, [h('h2', { 'data-t': 'pr.problems' }), h('p', { class: 'muted', style: 'font-size:13px', 'data-t': 'pr.problemsD' }), h('div', { html: fretHeat(probs) })]));
    const recent = ss.slice(-8).reverse();
    w.append(h('section', { class: 'panel' }, [h('h2', { 'data-t': 'pr.sessions' }), h('div', { class: 'list' }, recent.length ? recent.map(s => { const l = LS.get(s.id); return h('div', { class: 'li' }, [h('div', { class: 'grow' }, [h('span', { text: l ? PD.i18n.pick(l.title) : String(s.id).startsWith('trainer:') ? t('tr.title') : s.id }), h('small', { text: PD.ui.daysAgo(s.date) + (s.tempo ? ' · ' + s.tempo + '%' : '') + ' · ' + t('l.min', { n: Math.max(1, Math.round((s.dur || 0) / 60)) }) })]), h('span', { class: 'mono', text: Math.round((s.firstTry || 0) * 100) + '%' })]); }) : [h('div', { class: 'li muted', 'data-t': 'pr.none' })])]));
  }
  /** single-series trend line with a hover readout (no legend needed: the title names the series) */
  function chartCard(title, pts, empty) {
    const card = h('section', { class: 'panel' }, [h('h2', { text: title })]);
    if (pts.length < 2) { card.append(h('p', { class: 'muted', style: 'font-size:13px', text: empty || t('pr.noData') })); return card; }
    const W = 600, H = 150, pl = 34, pr = 10, pt = 10, pb = 22, x = i => pl + i * (W - pl - pr) / (pts.length - 1), y = v => pt + (1 - v) * (H - pt - pb);
    let s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + PD.esc(title) + '">';
    [0, .5, 1].forEach(v => { s += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="rgba(242,232,218,.08)"/><text x="' + (pl - 6) + '" y="' + (y(v) + 4) + '" fill="#A39B91" font-size="11" text-anchor="end" font-family="IBM Plex Mono">' + Math.round(v * 100) + '</text>'; });
    s += '<polyline fill="none" stroke="#D6A15A" stroke-width="2" stroke-linejoin="round" points="' + pts.map((p, i) => x(i) + ',' + y(p.v)).join(' ') + '"/>';
    pts.forEach((p, i) => { const l = LS.get(p.id); s += '<circle cx="' + x(i) + '" cy="' + y(p.v) + '" r="4" fill="#D6A15A" stroke="#161412" stroke-width="2"><title>' + PD.esc((l ? PD.i18n.pick(l.title) + ' · ' : '') + new Date(p.d).toLocaleDateString() + ' · ' + Math.round(p.v * 100) + '%') + '</title></circle>'; });
    s += '</svg>';
    const tbl = h('details', {}, [h('summary', { class: 'muted', style: 'font-size:12px', text: '▤' }), h('div', { class: 'mono muted', style: 'font-size:12px;line-height:1.7', text: pts.map(p => new Date(p.d).toLocaleDateString() + ' — ' + Math.round(p.v * 100) + '%').join(' · ') })]);
    card.append(h('div', { html: s }), tbl); return card;
  }
  function fretHeat(probs) {
    const max = Math.max(1, ...Object.values(probs)), W = 760, H = 110, x0 = 40, cw = (W - x0 - 10) / 18, y = s => 14 + (3 - s) * 28;
    let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + PD.esc(t('pr.problems')) + '">';
    for (let st = 1; st <= 3; st++) { s += '<text x="10" y="' + (y(st) + 15) + '" fill="#CFC8BE" font-size="12" font-family="IBM Plex Mono">' + TH.stringName(st) + '</text>'; for (let f = 0; f <= 17; f++) { const v = (probs[st + ':' + f] || 0) / max; s += '<rect x="' + (x0 + f * cw) + '" y="' + y(st) + '" width="' + (cw - 2) + '" height="24" rx="4" fill="' + (v ? 'rgba(214,161,90,' + (.15 + .85 * v).toFixed(2) + ')' : '#191816') + '"><title>' + TH.stringName(st) + ' · ' + f + ' · ' + (probs[st + ':' + f] || 0) + '</title></rect>'; } }
    for (let f = 0; f <= 17; f++) s += '<text x="' + (x0 + f * cw + cw / 2 - 1) + '" y="' + (H - 4) + '" fill="#7C746A" font-size="10" text-anchor="middle" font-family="IBM Plex Mono">' + f + '</text>';
    return s + '</svg>';
  }


  /* ---------- Settings: Audio · Learning · Visual · Language · Accessibility · Account ---------- */
  function settings(w) {
    w.append(h('div', { class: 'row' }, [h('button', { class: 'btn small', html: ic.back + '<span data-t="back"></span>', onclick: () => go('profile') }), h('h1', { 'data-t': 'set.title', style: 'margin:0' })]));
    const sect = (k, rows) => h('section', { class: 'set-sec' }, [h('h2', { 'data-t': k }), h('div', { class: 'list' }, rows.filter(Boolean))]);
    const row = (k, d, ctrl) => h('div', { class: 'li' }, [h('div', { class: 'grow' }, [h('span', { 'data-t': k }), d ? h('small', { text: d }) : null]), ctrl]);
    const toggle = (key, def, on) => { const c = h('input', { type: 'checkbox', 'aria-label': t(key) }); c.checked = PD.store.get(key, def); c.onchange = () => { PD.store.set(key, c.checked); on && on(c.checked); }; return c; };
    const seg = (opts, cur, on) => { const s = h('div', { class: 'seg' }); opts.forEach(([v, k]) => s.appendChild(h('button', { 'aria-pressed': String(cur === v), 'data-t': k, 'data-v': v, onclick: () => { s.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === String(v)))); on(v); } }))); return s; };
    const range = (v, min, max, step, on, fmt) => { const out = h('span', { class: 'val', text: fmt ? fmt(v) : v }); const r = h('input', { type: 'range', min, max, step, value: v, oninput: e => { out.textContent = fmt ? fmt(+e.target.value) : e.target.value; on(+e.target.value); } }); return h('span', { class: 'set-ctl' }, [r, out]); };
    const cal = PD.detector.calib, ms = PD.detector.status();
    w.append(sect('set.audio', [
      row('set.microphone', ms.on ? t('mic.on') + (ms.label ? ' · ' + ms.label : '') : t('mic.off'), ms.on ? h('button', { class: 'btn small', 'data-t': 'set.micStop', onclick: () => { PD.detector.stop(); render(); } }) : h('button', { class: 'btn small', 'data-t': 'gate.on', onclick: () => PD.practice.micOn(() => render()) })),
      row('set.sens', null, range(cal.sens == null ? 60 : cal.sens, 0, 100, 1, v => PD.detector.setCalib({ sens: v }))),
      row('set.noise', null, seg([['quiet', 'room.quiet'], ['normal', 'room.normal'], ['noisy', 'room.noisy']], cal.room || 'normal', v => PD.detector.setCalib({ room: v }))),
      row('set.latency', cal.date ? t('set.calibLast', { d: PD.ui.daysAgo(cal.date), l: Math.round(cal.latencyMs) }) : t('set.calibNever'), h('button', { class: 'btn small', 'data-t': 'home.start', onclick: () => PD.calib.open() })),
      row('set.tol', null, range(PD.store.get('tolCents', 35), 15, 50, 1, v => PD.store.set('tolCents', v), v => v + '¢')),
      row('set.guard', t('set.guardD'), toggle('clickGuard', true, v => { PD.detector.guardOn = v; })),
      row('set.vFeedback', null, range(PD.audio.vol.ui, 0, 1, .05, v => PD.audio.setVol('ui', v), v => Math.round(v * 100))),
      row('set.vRef', null, range(PD.audio.vol.ref, 0, 1, .05, v => PD.audio.setVol('ref', v), v => Math.round(v * 100))),
      row('set.vMetro', null, range(PD.audio.vol.metro, 0, 1, .05, v => PD.audio.setVol('metro', v), v => Math.round(v * 100))),
      row('set.vInst', null, range(PD.audio.vol.inst, 0, 1, .05, v => PD.audio.setVol('inst', v), v => Math.round(v * 100)))]));
    const asSel = h('select', { class: 'input', 'aria-label': t('set.assist'), onchange: e => PD.engine.setAssist(e.target.value) }); ['auto', 'beginner', 'intermediate', 'advanced', 'performance'].forEach(v => { const o = h('option', { value: v, 'data-t': 'as.' + v }); if (PD.engine.S.assistOverride === v) o.selected = true; asSel.appendChild(o); });
    w.append(sect('set.learningSec', [
      row('set.waitDefault', null, toggle('waitDefault', true)),
      row('set.autoAdvance', null, toggle('autoAdvance', true)),
      row('set.fingerColors', null, toggle('fingerColors', true)),
      row('set.noteNames', null, toggle('showNames', true)),
      row('set.fretNums', null, toggle('showFrets', true)),
      row('set.lefty', t('set.leftyD'), toggle('lefty', false)),
      row('set.countIn', null, toggle('countIn', true, v => PD.engine.setCountIn(v))),
      row('set.metro', null, toggle('metro', true, v => PD.engine.setMetro(v))),
      row('set.assist', t('set.assistD'), asSel)]));
    const q = PD.store.get('quality', 'auto');
    w.append(sect('set.visualSec', [
      row('set.quality', null, seg([['auto', 'q.auto'], ['low', 'q.low'], ['medium', 'q.balanced'], ['high', 'q.high'], ['ultra', 'q.ultra']], q, v => { PD.store.set('quality', v); if (PD.has3D()) PD.R3D.quality = v; PD.bus.emit('quality', v); })),
      row('set.fps', null, seg([['auto', 'fps.auto'], ['30', 'fps.30']], PD.store.get('fps', 'auto'), v => PD.store.set('fps', v))),
      row('set.reduceMotion', t('set.motion'), toggle('reduceMotion', false, v => document.documentElement.classList.toggle('rm', v))),
      row('set.fretNums', null, toggle('showFrets', true))]));
    w.append(sect('set.lang', [row('set.lang', null, seg([['ka', 'lang.ka'], ['en', 'lang.en']], PD.i18n.lang, v => PD.i18n.set(v)))]));
    w.append(sect('set.a11y', [
      row('set.text', null, seg([['m', 'ts.m'], ['l', 'ts.l'], ['xl', 'ts.xl']], PD.store.get('textSize', 'm'), v => { PD.store.set('textSize', v); document.documentElement.classList.remove('ts-l', 'ts-xl'); if (v !== 'm') document.documentElement.classList.add('ts-' + v); })),
      row('set.hc', null, toggle('hc', false, v => document.documentElement.classList.toggle('hc', v))),
      row('set.colorblind', null, toggle('fingerSymbols', false)),
      row('set.haptics', null, toggle('haptics', true)),
      row('set.keys', t('kbd.help'), null)]));
    const tsel = h('select', { class: 'input', 'aria-label': t('set.tuning'), onchange: e => TH.setTuning(e.target.value) }); TH.TUNINGS.forEach(tu => { const o = h('option', { value: tu.id, text: PD.i18n.pick(tu.name) }); if (tu.id === TH.tuning.id) o.selected = true; tsel.appendChild(o); });
    w.append(sect('set.panduri', [row('set.tuning', TH.tuning.strings.map(m => TH.name(m)).join(' · '), tsel), row('set.a4', null, range(TH.a4(), 430, 450, 1, v => PD.store.set('a4', v), v => v + ' Hz')), row('set.samples', t('set.samplesD', { n: PD.samples.count }), null)]));
    w.append(sect('set.accountSec', [
      row('pf.account', PD.account.remote.configured ? '' : t('au.noBackend'), h('button', { class: 'btn small', 'data-t': 'pf.signin', onclick: () => PD.auth.open('signin') })),
      row('au.sync', t('au.syncOff'), null), row('au.subscription', t('au.subOff'), null),
      row('set.privacy', t('set.privacyD'), null),
      row('set.onboard', null, h('button', { class: 'btn small', 'data-t': 'learn.open', onclick: () => PD.onboard.open() })),
      row('set.install', t('set.installD'), null),
      row('set.wipe', t('set.wipeD'), h('button', { class: 'btn small', style: 'color:var(--fix)', 'data-t': 'delete', onclick: () => PD.ui.confirm(t('set.wipeD'), () => { PD.store.keys().forEach(k => PD.store.del(k)); location.reload(); }) }))]));
    w.append(sect('set.author', [row('set.author', t('set.authorD'), toggle('author', false))]));
    w.append(sect('set.dev', [row('set.devTouch', t('set.devTouchD'), toggle('devTouch', false))]));
  }

  return { shell, go, render, glyph, meta, lessonRow, startStage, get route() { return route; }, get param() { return param; } };
})();
