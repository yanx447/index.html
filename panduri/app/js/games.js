/* =====================================================================
   Games: the hub, each game's start page, the play stage (HUD, count-
   down, pause, results), settings, the tuning check and the Arena.
   The real fanduri is the controller: a note counts only when the
   microphone hears it (PD.gameAudio → detector.js); touch completes a
   note only in the developer touch test, and such rounds are never saved.
   The rules live in gamecore.js, each game's screen in gameplay.js.
   XP, the practice streak and the daily minutes are the app's own: every
   finished round is one practice session (PD.lessons.progress).
   ===================================================================== */
PD.i18n.add({
  'gm.title': ['თამაშები', 'Games'], 'gm.lead': ['ითამაშე შენი ნამდვილი ფანდურით — აპი მიკროფონით გისმენს.', 'Play with your real fanduri — the app listens through the microphone.'],
  'gm.hubD': ['ნოტები, რიტმები, მელოდიები და აკორდები — ნამდვილ ფანდურზე', 'Notes, rhythms, melodies and chords — on a real fanduri'],
  'gm.homeT': ['ფანდურის თამაშები', 'Fanduri games'], 'gm.homeD': ['ინსტრუმენტი შენი კონტროლერია: დაუკარი და აპი გისმენს.', 'Your instrument is the controller: play, and the app listens.'],
  'gm.lvl': ['დონე {n}', 'Level {n}'], 'gm.xpOf': ['{a} / {b} XP შემდეგ დონემდე', '{a} / {b} XP to the next level'], 'gm.xpNote': ['XP საერთოა მთელი აპისთვის: სწორი ნოტები და ვარჯიშის წუთები.', 'XP is shared with the whole app: correct notes and minutes of practice.'],
  'gm.stStars': ['ვარსკვლავი', 'Stars'], 'gm.stPlays': ['თამაში', 'Rounds'], 'gm.stTime': ['წუთი', 'Minutes'], 'gm.stCombo': ['საუკეთესო კომბო', 'Best combo'],
  'gm.daily': ['დღის გამოწვევა', 'Daily challenge'], 'gm.dailyDone': ['შესრულებულია', 'Done'], 'gm.dailyStreak': ['{n} დღე ზედიზედ', '{n} days in a row'], 'gm.dailyNew': ['ახალი გამოწვევა ხვალ', 'A new challenge tomorrow'],
  'gm.goal.stars': ['მიიღე {v} ★ ან მეტი', 'Get {v} ★ or more'], 'gm.goal.acc': ['სიზუსტე {v}% ან მეტი', 'Accuracy {v}% or more'], 'gm.goal.combo': ['კომბო {v} ან მეტი', 'A combo of {v} or more'],
  'gm.continue': ['გაგრძელება', 'Continue'], 'gm.catalog': ['ყველა თამაში', 'All games'], 'gm.ach': ['მიღწევები', 'Achievements'], 'gm.recent': ['ბოლო შედეგები', 'Recent results'],
  'gm.none': ['ჯერ არ გითამაშია. აირჩიე თამაში და დაიწყე.', 'No rounds played yet. Pick a game and start.'], 'gm.locked': ['ჩაკეტილია', 'Locked'], 'gm.unlockHint': ['ჯერ წინა დონე გაიარე ერთი ★-ით', 'First clear the previous level with one ★'],
  'gm.start': ['დაწყება', 'Start'], 'gm.settings': ['თამაშის პარამეტრები', 'Game settings'], 'gm.beta': ['ბეტა', 'Beta'], 'gm.levels': ['დონეები', 'Levels'], 'gm.diff': ['სირთულე', 'Difficulty'], 'gm.best': ['რეკორდი: {s} · {a}%', 'Best: {s} · {a}%'], 'gm.noBest': ['ამ დონეზე ჯერ არ გითამაშია', 'Not played at this level yet'],
  'gm.how': ['როგორ თამაშობ', 'How to play'], 'gm.listens': ['რას ისმენს აპი', 'What the app hears'],
  'gm.g.rush': ['ნოტების ნაკადი', 'Note Rush'], 'gm.g.rhythm': ['რიტმული ბრძოლა', 'Rhythm Battle'], 'gm.g.memory': ['მელოდიური მეხსიერება', 'Melody Memory'], 'gm.g.hunt': ['ლადების მონადირე', 'Fret Hunter'],
  'gm.g.chord': ['აკორდების ოსტატი', 'Chord Master'], 'gm.g.song': ['მუსიკალური თავგადასავალი', 'Song Quest'], 'gm.g.band': ['ბენდთან ერთად', 'Band Jam'], 'gm.g.arena': ['ფანდურის არენა', 'Fanduri Arena'],
  'gm.gd.rush': ['ნოტები ზემოდან ჩამოდის. დაუკარი თითოეული ზუსტად მაშინ, როცა ხაზს მიაღწევს — აპი ამოწმებს ბგერასაც და დროსაც.', 'Notes fall from the top. Play each one just as it reaches the line — the app checks the pitch and the timing.'],
  'gm.gd.rhythm': ['მასწავლებლის რიტმები მეტრონომთან. ფასდება დრო, აქცენტები და სტაბილურობა.', "The teacher's rhythms with the metronome. Timing, accents and steadiness are scored."],
  'gm.gd.memory': ['მოუსმინე მოკლე მელოდიას და გაიმეორე ფანდურზე.', 'Listen to a short melody and play it back on the fanduri.'],
  'gm.gd.hunt': ['აპი ნოტს გეტყვის — იპოვე გრიფზე და დაუკარი.', 'The app names a note — find it on the neck and play it.'],
  'gm.gd.chord': ['აკორდები ნოტ-ნოტ: აპი თითოეულ ბგერას ცალკე ამოწმებს.', 'Chords note by note: the app checks every tone on its own.'],
  'gm.gd.song': ['აპის მასალა მოძრავ ტაბზე: ტემპი, სექციები, გამეორება.', "The app's material on a scrolling tab: tempo, sections, loops."],
  'gm.gd.band': ['დაუკარი ბანი-აჭარული ორიგინალ ჩანაწერთან ერთად.', 'Play Bani-Acharuli along with the original recording.'],
  'gm.gd.arena': ['ერთი დავალება ორ მოთამაშეს — შედეგები გვერდიგვერდ.', 'One task for two players — results side by side.'],
  'gm.rush.l.open': ['ღია სიმები', 'Open strings'], 'gm.rush.l.first': ['პირველი ლადები', 'First frets'], 'gm.rush.l.pos1': ['I პოზიცია', 'Position I'], 'gm.rush.l.melodic': ['მელოდიური ფიგურები', 'Melodic patterns'],
  'gm.rush.l.rhythm': ['რიტმი და ნოტები', 'Rhythm & notes'], 'gm.rush.l.pos5': ['V პოზიცია', 'Position V'], 'gm.rush.l.leaps': ['არპეჯიოები', 'Arpeggios'], 'gm.rush.l.adv': ['მოწინავე', 'Advanced'], 'gm.rush.l.expert': ['მთელი გრიფი', 'The whole neck'],
  'gm.rush.ld.open': ['A · C♯ · E — მხოლოდ ღია სიმები', 'A · C♯ · E — open strings only'], 'gm.rush.ld.first': ['ლადები 0–2', 'Frets 0–2'], 'gm.rush.ld.pos1': ['ლადები 0–4, გამის სვლები', 'Frets 0–4, scale steps'], 'gm.rush.ld.melodic': ['მოკლე მელოდიური სვლები', 'Short melodic runs'],
  'gm.rush.ld.rhythm': ['მერვედები და ნახევრები — დრო უფრო მნიშვნელოვანია', 'Eighths and halves — timing matters more'], 'gm.rush.ld.pos5': ['ლადები 3–7', 'Frets 3–7'], 'gm.rush.ld.leaps': ['A, D და E აკორდის ბგერები', 'Notes of the A, D and E chords'], 'gm.rush.ld.adv': ['ლადები 0–12, შერეული რიტმი', 'Frets 0–12, mixed rhythm'], 'gm.rush.ld.expert': ['17 ლადი, სწრაფი გადასვლები', '17 frets, fast moves'],
  'gm.d.easy': ['მარტივი', 'Easy'], 'gm.d.normal': ['ჩვეულებრივი', 'Normal'], 'gm.d.hard': ['რთული', 'Hard'], 'gm.d.expert': ['ექსპერტი', 'Expert'],
  'gm.rb.d.easy': ['დამწყები', 'Beginner'], 'gm.rb.d.normal': ['ჩვეულებრივი', 'Normal'], 'gm.rb.d.hard': ['მოწინავე', 'Advanced'], 'gm.rb.d.expert': ['ექსპერტი', 'Expert'],
  'gm.d.learn': ['სწავლა', 'Learning'], 'gm.d.challenge': ['გამოწვევა', 'Challenge'], 'gm.d.notes': ['ნოტ-ნოტ', 'Note by note'], 'gm.d.strum': ['მთლიანი აკორდი', 'Whole chord'], 'gm.d.practice': ['ვარჯიში', 'Practice'], 'gm.d.perform': ['შესრულება', 'Performance'],
  'gm.dd.learn': ['ყველა ადგილი გრიფზე ჩანს', 'Every place on the neck is shown'], 'gm.dd.challenge': ['მინიშნება 5 წამის შემდეგ', 'A hint after 5 seconds'], 'gm.dd.expert': ['7 წამი თითო ნოტზე, მინიშნების გარეშე', '7 seconds a note, no hints'],
  'gm.dd.notes': ['თითოეულ სიმს ცალკე უკრავ', 'You play each string on its own'], 'gm.dd.strum': ['ერთი დარტყმა — აპი სამივე ბგერას ეძებს', 'One stroke — the app looks for all three tones'],
  'gm.dd.practice': ['დაუკარი თავისუფლად — ქულა არ ითვლება', 'Play freely — nothing is scored'], 'gm.dd.perform': ['დარტყმები და აკორდები ფასდება', 'Strokes and chords are scored'],
  'gm.score': ['ქულა', 'Score'], 'gm.combo': ['კომბო', 'Combo'], 'gm.pause': ['პაუზა', 'Pause'], 'gm.resume': ['გაგრძელება', 'Resume'], 'gm.restart': ['თავიდან', 'Restart'], 'gm.exit': ['გასვლა', 'Exit'], 'gm.paused': ['პაუზა', 'Paused'],
  'gm.j.perfect': ['ზუსტი', 'Perfect'], 'gm.j.great': ['ძალიან კარგი', 'Great'], 'gm.j.good': ['კარგი', 'Good'], 'gm.j.miss': ['აცდენა', 'Miss'], 'gm.j.unsure': ['კარგად ვერ გავიგე', 'Not heard clearly'], 'gm.j.early': ['ძალიან ადრე', 'Too early'], 'gm.j.late': ['ძალიან გვიან', 'Too late'], 'gm.j.earlyS': ['ადრე', 'early'], 'gm.j.lateS': ['გვიან', 'late'],
  'gm.k.octave': ['სხვა ოქტავა', 'Other octave'], 'gm.k.sharp': ['მაღალია', 'Sharp'], 'gm.k.flat': ['დაბალია', 'Flat'], 'gm.k.semitone': ['ერთი ლადით აცდა', 'One fret off'], 'gm.k.wrong': ['სხვა ნოტი', 'Wrong note'],
  'gm.ready': ['მოემზადე', 'Get ready'], 'gm.go': ['დაუკარი!', 'Play!'], 'gm.prep': ['ვემზადებით…', 'Getting ready…'],
  'gm.mic': ['მიკროფონი', 'Microphone'], 'gm.micOn': ['ჩართულია — გისმენ', 'On — listening'], 'gm.micOff': ['გამორთულია', 'Off'], 'gm.micTurnOn': ['მიკროფონის ჩართვა', 'Turn on the microphone'],
  'gm.micNeed': ['თამაშს მიკროფონი სჭირდება: ნოტს მხოლოდ ნამდვილი ფანდურის ხმა ასრულებს.', 'The game needs the microphone: only the sound of a real fanduri completes a note.'],
  'gm.micLocal': ['ხმა მხოლოდ ამ მოწყობილობაზე ანალიზდება — არაფერი იწერება და არსად იგზავნება.', 'Sound is analysed only on this device — nothing is recorded or sent.'],
  'gm.micLost': ['მიკროფონი გაითიშა — თამაში შეჩერდა.', 'The microphone stopped — the game is paused.'], 'gm.hidden': ['აპი ფონზე გადავიდა — თამაში შეჩერდა.', 'The app went to the background — the game is paused.'],
  'gm.noMic': ['ამ მოწყობილობაზე მიკროფონი ვერ ვიპოვე. თამაშებს მიკროფონი სჭირდება — ტელევიზორზე შეაერთე მიკროფონი ან ითამაშე ტელეფონით.', 'No microphone was found on this device. The games need one — on a TV, connect a microphone or play on a phone.'],
  'gm.micDenied': ['მიკროფონზე წვდომა უარყოფილია. ჩართე ის ბრაუზერის ან ტელეფონის პარამეტრებში და სცადე თავიდან.', 'Microphone access was denied. Allow it in the browser or phone settings and try again.'],
  'gm.device': ['რომელი მიკროფონი', 'Which microphone'], 'gm.deviceDefault': ['სისტემის ნაგულისხმევი', 'System default'], 'gm.deviceN': ['მიკროფონი {n}', 'Microphone {n}'], 'gm.deviceHint': ['სახელები ჩანს მიკროფონის ჩართვის შემდეგ.', 'Names appear once the microphone is on.'],
  'gm.cal': ['კალიბრაცია', 'Calibration'], 'gm.calD': ['ოთახის ხმაური, მგრძნობელობა, ღია სიმები და დაყოვნება — ერთხელ თითო მოწყობილობაზე.', 'Room noise, sensitivity, open strings and latency — once per device.'],
  'gm.calNever': ['ამ მოწყობილობაზე ჯერ არ გაგიკეთებია — რეკომენდებულია.', 'Not done on this device yet — recommended.'], 'gm.calLast': ['ბოლოს: {d}', 'Last done: {d}'], 'gm.calNow': ['კალიბრაცია ახლა', 'Calibrate now'], 'gm.calSkip': ['გამოტოვება', 'Skip'],
  'gm.calAsk': ['ამ მოწყობილობაზე მიკროფონი ჯერ არ დაკალიბრებულა. ერთი წუთი — და ნოტებიც და დროც უფრო ზუსტად დაითვლება.', 'The microphone has not been calibrated on this device. One minute — and notes and timing are counted more accurately.'],
  'gm.off': ['დაკვრის დროის გასწორება', 'Play-along timing'], 'gm.offD': ['მოისმენ 4 ათვლას და 8 დაწკაპუნებას. ყოველ დაწკაპუნებაზე დაუკარი ღია სიმი. აპი ზომავს, რამდენით ადრე ან გვიან მოდის შენი დაკვრა, და ამას ყველა თამაშში გაითვალისწინებს.', 'You hear a count of 4, then 8 clicks. Strike an open string on every click. The app measures how early or late your strokes arrive and allows for it in every game.'],
  'gm.offGo': ['გაზომვა', 'Measure'], 'gm.offRes': ['შენი დარტყმები {ms} ms-ით {dir} მოდის — გათვალისწინებულია.', 'Your strokes arrive {ms} ms {dir} — allowed for.'], 'gm.offEarly': ['ადრე', 'early'], 'gm.offLate': ['გვიან', 'late'],
  'gm.offFail': ['საკმარისი დარტყმა ვერ გავიგე ({n}/8). აუწიე ხმას და სცადე თავიდან.', 'Not enough strokes heard ({n}/8). Turn the volume up and try again.'], 'gm.offNow': ['ახლა: {ms} ms', 'Now: {ms} ms'], 'gm.offReset': ['ნულზე დაბრუნება', 'Reset to zero'],
  'gm.offBt': ['Bluetooth ყურსასმენი დაყოვნებას ზრდის — გაზომე იმით, რითაც უკრავ.', 'Bluetooth headphones add delay — measure with what you play with.'], 'gm.offSpread': ['გაბნევა ±{ms} ms', 'Spread ±{ms} ms'], 'gm.offListen': ['ვისმენ… {k} / 8', 'Listening… {k} / 8'],
  'gm.res.done': ['დონე გავლილია!', 'Level cleared!'], 'gm.res.fail': ['ჯერ არა — სცადე კიდევ ერთხელ', 'Not yet — try once more'], 'gm.res.low': ['მიკროფონმა ნოტების უმეტესობა კარგად ვერ გაიგო — ეს რაუნდი არ ითვლება.', 'The microphone did not hear most notes clearly — this round does not count.'],
  'gm.res.lowD': ['შეამოწმე კალიბრაცია, აუწიე ფანდურს ან მიუახლოვდი მიკროფონს.', 'Check the calibration, play a little louder or move closer to the microphone.'], 'gm.res.end': ['რაუნდი დასრულდა', 'Round over'],
  'gm.acc': ['სიზუსტე', 'Accuracy'], 'gm.maxCombo': ['მაქს. კომბო', 'Max combo'], 'gm.record': ['ახალი რეკორდი!', 'New record!'], 'gm.retry': ['თავიდან', 'Retry'], 'gm.next': ['შემდეგი დონე', 'Next level'], 'gm.toHub': ['თამაშებზე', 'To the games'],
  'gm.pitchAcc': ['ბგერის სიზუსტე', 'Pitch accuracy'], 'gm.timingAcc': ['დროის სიზუსტე', 'Timing accuracy'], 'gm.mistakes': ['შეცდომები', 'Mistakes'], 'gm.unsureN': ['კარგად ვერ გავიგე: {n} — შეცდომად არ ითვლება', 'Not heard clearly: {n} — not counted as mistakes'],
  'gm.extraN': ['ზედმეტი დარტყმა: {n}', 'Extra strokes: {n}'], 'gm.offMean': ['საშუალოდ {ms} ms {dir}', 'On average {ms} ms {dir}'], 'gm.steady': ['სტაბილურობა ±{ms} ms', 'Steadiness ±{ms} ms'], 'gm.accentAcc': ['აქცენტები', 'Accents'],
  'gm.xp': ['+{n} XP', '+{n} XP'], 'gm.xpD': ['{a} სწორი · {b} წუთი · {c} ბონუსი', '{a} correct · {b} min · {c} bonus'], 'gm.challenge': ['მეგობრის გამოწვევა', 'Challenge a friend'], 'gm.testMode': ['შეხებით ტესტი — შედეგი არ ინახება.', 'Touch test — the result is not saved.'],
  'gm.dailyMet': ['დღის გამოწვევა შესრულებულია!', 'Daily challenge complete!'], 'gm.achNew': ['ახალი მიღწევა', 'New achievement'], 'gm.onTime': ['დროზე', 'on time'],
  'gm.n.pitch': ['მიკროფონი ბგერის სიმაღლეს ცნობს, სიმს — არა ყოველთვის: ერთი და იგივე ბგერა ორ სიმზე ერთნაირად ჟღერს და ორივე ითვლება.', 'The microphone recognises pitch, not always the string: the same pitch on two strings sounds alike, and both count.'],
  'gm.n.unsure': ['რაც კარგად ვერ გავიგე, შეცდომად არ ითვლება და ქულას არ იძლევა.', 'What was not heard clearly is never a mistake and earns nothing.'],
  'gm.n.dir': ['↓/↑ მიმართულებას ხმიდან ვერ ვიგებთ — ისრები მითითებაა და არ ფასდება. ფასდება დრო და აქცენტის სიძლიერე.', 'The ↓/↑ direction cannot be heard — the arrows are guidance and are not scored. Timing and accent strength are.'],
  'gm.n.timing': ['დარტყმების ხანგრძლივობა მასწავლებელს ჯერ არ მიუთითებია — ჯერჯერობით ყველა დარტყმა თანაბარია.', 'The teacher has not given the stroke lengths yet — for now every stroke is equal.'],
  'gm.n.khorumi': ['ხორუმი 5/8-ზე ითვლება (1-2-3, 1-2). რომელი დარტყმა რომელ თვლაზე მოდის, მასწავლებელს ჯერ არ უთქვამს — აქ შვიდი დარტყმა თანაბარია.', 'Khorumi is counted in 5/8 (1-2-3, 1-2). Which stroke falls on which count the teacher has not said yet — here the seven strokes are equal.'],
  'gm.n.headphones': ['ჩანაწერი დინამიკიდან მიკროფონშიც ხვდება და შეიძლება შენს დაკვრად ჩაითვალოს. საუკეთესოა ყურსასმენი; ექოს ჩახშობა ჩართულია.', 'The recording also reaches the microphone from the speaker and could be taken for your playing. Headphones are best; echo cancellation is on.'],
  'gm.n.strumBeta': ['მთლიანი აკორდის ამოცნობა ნამდვილი ფანდურის აკორდების ჩანაწერებით ჯერ ბოლომდე არ შემოწმებულა — ეს რეჟიმი ბეტაა, ქულა მხოლოდ მითითებაა.', 'Recognising a whole strummed chord has not yet been fully checked against recordings of real fanduri chords — this mode is a beta and its score is only a guide.'],
  'gm.set.metro': ['მეტრონომი ნოტების ნაკადში', 'Metronome in Note Rush'], 'gm.set.names': ['ნოტების სახელები ნოტებზე', 'Note names on the notes'], 'gm.set.fx': ['ეფექტები: ნაწილაკები და ნათება', 'Effects: particles and glow'],
  'gm.set.debug': ['დიაგნოსტიკის პანელი', 'Diagnostics panel'], 'gm.set.debugD': ['დეველოპერისთვის: ამოცნობილი ბგერა, სანდოობა, დროის აცდენა, დონე, დაყოვნება.', 'For developers: detected pitch, confidence, timing offset, level, latency.'],
  'gm.nextUp': ['შემდეგი ნოტები', 'Coming next'], 'gm.live': ['ახლა', 'This round'],
  'gm.set.mic': ['მიკროფონი და დრო', 'Microphone and timing'], 'gm.setShort': ['პარამეტრები', 'Settings'], 'gm.set.view': ['ხედი', 'View'], 'gm.set.dev': ['დეველოპერი', 'Developer'],
  'gm.dbg.pitch': ['ბგერა', 'Pitch'], 'gm.dbg.conf': ['სანდოობა', 'Confidence'], 'gm.dbg.off': ['აცდენა', 'Offset'], 'gm.dbg.level': ['დონე', 'Level'], 'gm.dbg.lat': ['დაყოვნება', 'Latency'], 'gm.dbg.exp': ['მოსალოდნელი', 'Expected'], 'gm.dbg.got': ['მოსმენილი', 'Heard'], 'gm.dbg.state': ['მდგომარეობა', 'State'],
  'gm.ses': ['თამაში · {g}', 'Game · {g}'],
  'gm.a.first': ['პირველი თამაში', 'First round'], 'gm.ad.first': ['დაასრულე ნებისმიერი თამაში', 'Finish any game'], 'gm.a.plays10': ['ათი რაუნდი', 'Ten rounds'], 'gm.ad.plays10': ['ითამაშე 10-ჯერ', 'Play 10 rounds'], 'gm.a.plays50': ['ორმოცდაათი რაუნდი', 'Fifty rounds'], 'gm.ad.plays50': ['ითამაშე 50-ჯერ', 'Play 50 rounds'],
  'gm.a.rush1': ['პირველი ნაკადი', 'First rush'], 'gm.ad.rush1': ['ნოტების ნაკადის ერთი დონე ★-ით', 'One Note Rush level with a ★'], 'gm.a.rush5': ['ნაკადის მეგობარი', 'Rush regular'], 'gm.ad.rush5': ['ნოტების ნაკადის 5 დონე', 'Five Note Rush levels'],
  'gm.a.rush3s': ['სამი ვარსკვლავი', 'Three stars'], 'gm.ad.rush3s': ['★★★ ნოტების ნაკადში', '★★★ in Note Rush'], 'gm.a.combo25': ['კომბო 25', 'Combo 25'], 'gm.ad.combo25': ['25 ნოტი ზედიზედ, შეცდომის გარეშე', '25 notes in a row without a miss'],
  'gm.a.combo50': ['კომბო 50', 'Combo 50'], 'gm.ad.combo50': ['50 ნოტი ზედიზედ', '50 notes in a row'], 'gm.a.combo100': ['კომბო 100', 'Combo 100'], 'gm.ad.combo100': ['100 ნოტი ან დარტყმა ზედიზედ', '100 notes or strokes in a row'],
  'gm.a.rhythm4': ['ოთხივე რიტმი', 'All four rhythms'], 'gm.ad.rhythm4': ['მასწავლებლის ოთხივე რიტმი ★-ით', "All four of the teacher's rhythms with a ★"], 'gm.a.rhythmFast': ['სწრაფი ხელი', 'Fast hand'], 'gm.ad.rhythmFast': ['რიტმი 110 BPM-ზე ან სწრაფად', 'A rhythm at 110 BPM or faster'],
  'gm.a.memory6': ['კარგი სმენა', 'Good ear'], 'gm.ad.memory6': ['6-ნოტიანი მელოდია უშეცდომოდ', 'A six-note melody without a mistake'], 'gm.a.hunt10': ['მონადირე', 'Hunter'], 'gm.ad.hunt10': ['10 ნოტი, საშუალოდ 3 წამზე ნაკლებში', '10 notes, under 3 s on average'],
  'gm.a.chord5': ['ხუთი აკორდი', 'Five chords'], 'gm.ad.chord5': ['5 სხვადასხვა აკორდი სწორად', 'Five different chords played right'], 'gm.a.daily3': ['სამი დღე', 'Three days'], 'gm.ad.daily3': ['დღის გამოწვევა 3 დღე ზედიზედ', 'The daily challenge 3 days in a row'],
  'gm.a.daily7': ['ერთი კვირა', 'One week'], 'gm.ad.daily7': ['დღის გამოწვევა 7 დღე ზედიზედ', 'The daily challenge 7 days in a row'], 'gm.a.stars50': ['50 ვარსკვლავი', '50 stars'], 'gm.ad.stars50': ['შეაგროვე 50 ★', 'Collect 50 ★'],
  'gm.ar.lead': ['ერთი და იგივე დავალება ორ მოთამაშეს, სხვადასხვა დროს. შედეგი კოდით ან ბმულით გადაეცემა.', 'The same task for two players, at different times. The result travels as a code or a link.'],
  'gm.ar.create': ['გამოწვევის შექმნა', 'Create a challenge'], 'gm.ar.createD': ['ითამაშე ნოტების ნაკადი ან რიტმული ბრძოლა და შედეგების ეკრანზე დააჭირე „მეგობრის გამოწვევა“.', 'Play Note Rush or Rhythm Battle and press “Challenge a friend” on the results screen.'],
  'gm.ar.accept': ['გამოწვევის მიღება', 'Accept a challenge'], 'gm.ar.paste': ['ჩასვი კოდი ან ბმული', 'Paste a code or a link'], 'gm.ar.open': ['გახსნა', 'Open'], 'gm.ar.bad': ['კოდი არასწორია — შეამოწმე, ბოლომდე ჩაისვა თუ არა.', 'That code is not valid — check that it was pasted in full.'],
  'gm.ar.from': ['{n}-ის გამოწვევა', 'A challenge from {n}'], 'gm.ar.anon': ['მეგობარი', 'a friend'], 'gm.ar.play': ['ამ დავალების თამაში', 'Play this task'], 'gm.ar.you': ['შენ', 'You'], 'gm.ar.them': ['მეგობარი', 'Friend'],
  'gm.ar.win': ['შენ მოიგე!', 'You win!'], 'gm.ar.lose': ['ამჯერად მეგობარმა მოიგო', 'Your friend wins this time'], 'gm.ar.tie': ['ფრე', 'A draw'],
  'gm.ar.honest': ['შედარება შენს მოწყობილობაზე ხდება. მეგობრის შედეგი კოდიდან მოდის და სერვერი მას არ ამოწმებს — ეს მეგობრული გამოწვევაა და არა რეიტინგი.', "The comparison happens on your device. Your friend's result comes from the code and no server checks it — it is a friendly challenge, not a ranking."],
  'gm.ar.share': ['გაზიარება', 'Share'], 'gm.ar.copy': ['კოდის კოპირება', 'Copy the code'], 'gm.ar.copied': ['დაკოპირდა', 'Copied'], 'gm.ar.shareT': ['ფანდურის გამოწვევა — {g}: {s} ქულა. შეძლებ მეტს?', 'Fanduri challenge — {g}: {s} points. Can you beat it?'],
  'gm.ar.live': ['ერთდროული, პირდაპირი თამაში ჯერ არ არის — მას სერვერი სჭირდება.', 'Live head-to-head play is not here yet — it needs a server.'], 'gm.ar.task': ['დავალება', 'Task'], 'gm.ar.pending': ['მეგობარმა გამოგიწვია — გახსენი არენაში', 'A friend challenged you — open it in the Arena'],
  'gm.pb': ['პირადი რეკორდი: {s}', 'Personal best: {s}'], 'gm.pbNew': ['ახალი პირადი რეკორდი (იყო {s})', 'A new personal best (was {s})'], 'gm.practiceNo': ['ვარჯიში — შედეგი არ ინახება, XP არ ემატება.', 'Practice — nothing is saved, no XP.'],
  'gm.tip.late': ['რიტმი სწორია, მაგრამ საშუალოდ {ms} ms-ით გვიან უკრავ — დაკვრა ცოტა ადრე დაიწყე.', 'The rhythm is right, but you play {ms} ms late on average — start each stroke a little earlier.'],
  'gm.tip.early': ['საშუალოდ {ms} ms-ით ადრე უკრავ — ნოტს ხაზამდე დაელოდე.', 'You play {ms} ms early on average — wait for the note to reach the line.'],
  'gm.tip.unsteady': ['ტემპი იცვლება (±{ms} ms) — ნელ ტემპზე მეტრონომთან ივარჯიშე.', 'Your tempo wanders (±{ms} ms) — practise at a slower tempo with the metronome.'],
  'gm.tip.accents': ['აქცენტები მხოლოდ {p}-ში ისმის — წითელ ისრებზე უფრო ძლიერად დაარტყი.', 'Accents come through only {p} of the time — strike the red arrows harder.'],
  'gm.tip.unsure': ['{n} ნოტი კარგად ვერ გავიგე — მიუახლოვდი მიკროფონს ან გაიმეორე კალიბრაცია.', '{n} notes were not heard clearly — move closer to the microphone or repeat the calibration.'],
  'gm.tip.wrong': ['{n} ნოტი სხვა ბგერად გაისმა — შეამოწმე ლადი და სიმი, სანამ დაუკრავ.', '{n} notes sounded as a different pitch — check the fret and string before you play.'],
  'gm.tip.octave': ['ბგერა სწორი იყო, ოქტავა — არა: იგივე ნოტი სხვა სიმზე ან ლადზე სცადე.', 'The note was right but in the wrong octave: try the same note on another string or fret.'],
  'gm.tip.missed': ['{n} ნოტი გამოგრჩა — სირთულე „მარტივზე" სცადე ან დონე გაიმეორე.', '{n} notes were missed — try the Easy difficulty or repeat the level.'],
  'gm.tip.great': ['ძალიან კარგი — დრო და ბგერა სწორია. სცადე უფრო რთული სირთულე.', 'Very good — timing and pitch are right. Try a harder difficulty.'],
  'gm.ar.codeT': ['გამოწვევის კოდი', 'Challenge code'], 'gm.ar.yourRes': ['შენი შედეგი', 'Your result'], 'gm.ar.result': ['შედარება', 'Comparison'],
  'gm.ar.old': ['ეს კოდი თამაშის ძველი ვერსიითაა შექმნილი: ნოტები ახლა სხვაა, ამიტომ შედეგები ვერ შედარდება. სთხოვე მეგობარს ახალი კოდი.', 'This code was made by an older version of the game: the notes are different now, so the results cannot be compared. Ask your friend for a new code.'],
  'gm.ar.pbYou': ['შენი რეკორდი ამ დონეზე: {s}', 'Your best on this level: {s}'], 'gm.ar.pbNone': ['ამ დონეზე ჯერ არ გითამაშია.', 'You have not played this level yet.'],
  'gm.ck.title': ['მიკროფონის შემოწმება', 'Microphone check'], 'gm.ck.sig': ['სიგნალი', 'Signal'], 'gm.ck.sigWait': ['დაუკარი ერთი სიმი…', 'Strike a string…'], 'gm.ck.sigOk': ['მოდის · {db} dBFS', 'Arriving · {db} dBFS'],
  'gm.ck.note': ['ბოლო ნოტი', 'Last note heard'], 'gm.ck.noteWait': ['ჯერ არაფერი', 'Nothing yet'], 'gm.ck.noteUnsure': ['ხმა მოვიდა, ნოტი ვერ გავარჩიე', 'Sound came, no clear note'],
  'gm.ck.cal': ['კალიბრაცია', 'Calibration'], 'gm.ck.calNeed': ['საჭიროა — ერთი წუთი', 'Needed — one minute'], 'gm.ck.tune': ['აწყობა', 'Tuning'], 'gm.ck.tuneNot': ['არ შემოწმებულა', 'Not checked'],
  'gm.ck.tuneOk': ['სამივე სიმი ±15¢-ში · {d}', 'All three strings within ±15¢ · {d}'], 'gm.ck.tuneOff': ['{c}¢-მდე აცდენა — ააწყვე', 'Up to {c}¢ off — tune up'],
  'gm.ck.ready': ['ყველაფერი მზადაა.', 'All set.'], 'gm.ck.offMic': ['მიკროფონი „დაწყებაზე“ ჩაირთვება. ჩართე უკვე ახლა, რომ ნახო, გესმის თუ არა.', 'The microphone turns on with Start. Turn it on now to see whether you are heard.'],
  'gm.ck.preview': ['მიკროფონის გარეშე მხოლოდ გადახედვაა: აპი თვითონ უკრავს, არაფერი ფასდება და არ ინახება.', 'Without a microphone there is only a preview: the app plays by itself, nothing is scored or saved.'],
  'gm.hm.cont': ['გაგრძელება', 'Continue'], 'gm.hm.daily': ['დღის გამოწვევა', 'Daily'], 'gm.hm.first': ['დაიწყე ღია სიმებით', 'Start with the open strings'],
  'gm.in.t1': ['ფანდური შენი კონტროლერია', 'Your fanduri is the controller'], 'gm.in.d1': ['ყველა თამაში მიკროფონით გისმენს. ნოტი მხოლოდ მაშინ ითვლება, როცა აპი მას გაიგებს — ეკრანზე შეხება ნოტს არ ასრულებს.', 'Every game listens through the microphone. A note counts only when the app hears it — touching the screen does not complete a note.'],
  'gm.in.t2': ['ჯერ მიკროფონი შეამოწმე', 'Check the microphone first'], 'gm.in.d2': ['თამაშის წინ ჩართე მიკროფონი, დაუკარი სიმი და ნახე შემოწმება. კალიბრაცია (ერთხელ თითო მოწყობილობაზე) ნოტებს და დროს უფრო ზუსტად ზომავს.', 'Before a game, turn the microphone on, strike a string and watch the check. Calibration (once per device) makes notes and timing more accurate.'],
  'gm.in.t3': ['ვარჯიში თუ ოფიციალური', 'Practice or official'], 'gm.in.d3': ['ოფიციალური რაუნდი ვარსკვლავს, რეკორდს და XP-ს იძლევა. მასალა, რომელიც მასწავლებელს ჯერ არ შეუმოწმებია, და ვარჯიშის რეჟიმები მხოლოდ ვარჯიშისთვისაა — ქულა არ ინახება.', 'Official rounds earn stars, records and XP. Material the teacher has not checked yet, and the practice modes, are for practice only — nothing is saved.'],
  'gm.in.skip': ['გამოტოვება', 'Skip'], 'gm.in.next': ['შემდეგი', 'Next'], 'gm.in.go': ['დავიწყოთ', "Let's play"], 'gm.in.step': ['{a} / {b}', '{a} / {b}']
});

PD.games = (() => {
  const h = PD.h, G = PD.gameCore, GA = PD.gameAudio, TH = PD.theory, ic = PD.ic, K = G.KEYS;
  const STORE = PD.store;
  const motionOK = () => !PD.motion || PD.motion.ok();

  /* ---------- art: one small picture per game (copper on charcoal) ---------- */
  const SV = (body, cls) => '<svg class="gm-art-svg' + (cls ? ' ' + cls : '') + '" viewBox="0 0 320 180" aria-hidden="true" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="gmc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F1B674"/><stop offset="1" stop-color="#A9683A"/></linearGradient><radialGradient id="gmg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="rgba(241,182,116,.55)"/><stop offset="1" stop-color="rgba(241,182,116,0)"/></radialGradient></defs><rect width="320" height="180" fill="#110e0c"/>' + body + '</svg>';
  const ART = {
    rush: () => SV('<g opacity=".5" stroke="rgba(241,182,116,.18)">' + [100, 160, 220].map(x => '<line x1="' + x + '" y1="0" x2="' + x + '" y2="180"/>').join('') + '</g><ellipse cx="160" cy="142" rx="150" ry="22" fill="url(#gmg)"/><line x1="40" y1="142" x2="280" y2="142" stroke="#F1B674" stroke-width="3"/>' + [[70, 40], [130, 92], [190, 18], [250, 66], [130, 0], [70, 118]].map(([x, y], i) => '<rect x="' + (x + 6) + '" y="' + y + '" width="48" height="22" rx="11" fill="url(#gmc)" opacity="' + (i === 5 ? 1 : .55 + i * .08) + '"/>').join('') + '<circle cx="100" cy="142" r="10" fill="none" stroke="#F1B674" stroke-width="2" opacity=".8"/>'),
    rhythm: () => SV('<line x1="20" y1="96" x2="300" y2="96" stroke="rgba(241,182,116,.2)" stroke-width="2"/><line x1="92" y1="30" x2="92" y2="160" stroke="#F1B674" stroke-width="3"/><ellipse cx="92" cy="96" rx="40" ry="60" fill="url(#gmg)"/>' + [[92, 1, 1], [150, 0, 0], [206, 1, 0], [262, 0, 1]].map(([x, down, acc]) => { const c = acc ? '#ED6464' : '#D9A06B', w = acc ? 9 : 5, d = down ? 1 : -1, L = acc ? 34 : 26; return '<path d="M' + x + ' ' + (96 - d * L) + 'L' + x + ' ' + (96 + d * L) + 'M' + (x - L * .55) + ' ' + (96 + d * L * .35) + 'L' + x + ' ' + (96 + d * L) + 'L' + (x + L * .55) + ' ' + (96 + d * L * .35) + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>'; }).join('')),
    memory: () => SV('<path d="M20 120 C60 120 70 60 110 60 S160 130 200 100 S250 40 300 56" fill="none" stroke="rgba(241,182,116,.35)" stroke-width="3"/>' + [[40, 118], [110, 60], [170, 112], [235, 64], [290, 57]].map(([x, y], i) => '<circle cx="' + x + '" cy="' + y + '" r="' + (i === 3 ? 15 : 11) + '" fill="' + (i < 3 ? 'url(#gmc)' : i === 3 ? '#F1B674' : 'rgba(241,182,116,.25)') + '"/>').join('') + '<ellipse cx="235" cy="64" rx="40" ry="40" fill="url(#gmg)"/>'),
    hunt: () => SV('<rect x="0" y="54" width="320" height="76" fill="#2a1c14"/>' + [40, 92, 140, 184, 224, 262, 296].map(x => '<rect x="' + x + '" y="54" width="3" height="76" fill="#cdb48a" opacity=".7"/>').join('') + [70, 92, 114].map(y => '<line x1="0" y1="' + y + '" x2="320" y2="' + y + '" stroke="#e9dcc0" stroke-width="' + (y === 114 ? 2.4 : 1.6) + '"/>').join('') + '<ellipse cx="162" cy="92" rx="46" ry="46" fill="url(#gmg)"/><circle cx="162" cy="92" r="14" fill="url(#gmc)"/><circle cx="162" cy="92" r="26" fill="none" stroke="#F1B674" stroke-width="2.5" stroke-dasharray="6 6"/>'),
    chord: () => SV('<rect x="70" y="20" width="180" height="140" rx="10" fill="none" stroke="rgba(241,182,116,.25)" stroke-width="2"/>' + [62, 104].map(y => '<line x1="70" y1="' + (y + 20) + '" x2="250" y2="' + (y + 20) + '" stroke="rgba(241,182,116,.2)" stroke-width="2"/>').join('') + [130, 160, 190].map(x => '<line x1="' + x + '" y1="20" x2="' + x + '" y2="160" stroke="#e9dcc0" stroke-width="1.6" opacity=".6"/>').join('') + '<circle cx="130" cy="104" r="13" fill="#ED6464"/><circle cx="160" cy="62" r="13" fill="url(#gmc)"/><circle cx="190" cy="104" r="13" fill="url(#gmc)"/><ellipse cx="160" cy="90" rx="90" ry="60" fill="url(#gmg)" opacity=".5"/>'),
    song: () => SV([60, 90, 120].map(y => '<line x1="0" y1="' + y + '" x2="320" y2="' + y + '" stroke="rgba(233,220,192,.45)" stroke-width="1.5"/>').join('') + '<line x1="84" y1="36" x2="84" y2="144" stroke="#F1B674" stroke-width="3"/><ellipse cx="84" cy="90" rx="30" ry="56" fill="url(#gmg)"/>' + [[84, 120, '0'], [134, 90, '2'], [180, 60, '0'], [226, 90, '1'], [266, 120, '4'], [300, 60, '2']].map(([x, y, n], i) => '<rect x="' + (x - 13) + '" y="' + (y - 13) + '" width="26" height="26" rx="8" fill="' + (i ? '#201A15' : 'url(#gmc)') + '" stroke="rgba(241,182,116,.6)"/><text x="' + x + '" y="' + (y + 6) + '" text-anchor="middle" font-size="16" font-weight="700" fill="' + (i ? '#F1B674' : '#1A0F07') + '" font-family="Inter,system-ui">' + n + '</text>').join('')),
    band: () => SV('<ellipse cx="160" cy="150" rx="150" ry="30" fill="url(#gmg)"/>' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(i => { const x = 24 + i * 21, hh = 18 + Math.abs(Math.sin(i * 1.3)) * 70; return '<rect x="' + x + '" y="' + (120 - hh) + '" width="11" height="' + hh + '" rx="5.5" fill="url(#gmc)" opacity="' + (.35 + (i % 4) * .17) + '"/>'; }).join('') + '<circle cx="250" cy="52" r="22" fill="none" stroke="#F1B674" stroke-width="3"/><circle cx="250" cy="52" r="6" fill="#F1B674"/>'),
    arena: () => SV('<rect x="34" y="70" width="110" height="20" rx="10" fill="url(#gmc)"/><rect x="34" y="100" width="84" height="20" rx="10" fill="rgba(241,182,116,.3)"/><rect x="176" y="70" width="96" height="20" rx="10" fill="rgba(241,182,116,.3)"/><rect x="176" y="100" width="112" height="20" rx="10" fill="url(#gmc)"/><circle cx="160" cy="95" r="22" fill="#201A15" stroke="#F1B674" stroke-width="2.5"/><text x="160" y="102" text-anchor="middle" font-size="18" font-weight="800" fill="#F1B674" font-family="Inter,system-ui">VS</text><ellipse cx="160" cy="95" rx="70" ry="50" fill="url(#gmg)" opacity=".5"/>')
  };
  const ORDER = ['rush', 'rhythm', 'memory', 'hunt', 'chord', 'song', 'band', 'arena'];
  const STAR = on => '<svg viewBox="0 0 24 24" class="gm-star' + (on ? ' on' : '') + '" aria-hidden="true"><path d="M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.4L12 17.2l-5.8 3.1 1.2-6.4L2.6 9.4l6.5-.8z"/></svg>';
  const stars = (n, max) => Array.from({ length: max || 3 }, (_, i) => STAR(i < n)).join('');
  const GEAR = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3.3"/><path d="M12 2.5v2.7M12 18.8v2.7M2.5 12h2.7M18.8 12h2.7M5.3 5.3l1.9 1.9M16.8 16.8l1.9 1.9M18.7 5.3l-1.9 1.9M7.2 16.8l-1.9 1.9"/></svg>';
  const MIC = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>';
  const PAUSE = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.4" fill="currentColor"/><rect x="13.5" y="5" width="4" height="14" rx="1.4" fill="currentColor"/></svg>';

  /* ---------- the records ---------- */
  const P = {
    best: () => G.norm(K.best, STORE.get(K.best, null)), hist: () => G.norm(K.hist, STORE.get(K.hist, null)),
    ach: () => G.norm(K.ach, STORE.get(K.ach, null)), daily: () => G.norm(K.daily, STORE.get(K.daily, null)),
    rec(g, l, d) { return P.best().map[G.lkey(g, l, d)] || null; },
    /** the most stars on any difficulty of a level */
    starsOf(g, l) { const B = P.best().map; let s = 0; Object.keys(B).forEach(k => { if (k.startsWith(g + ':' + l + ':')) s = Math.max(s, B[k].stars || 0); }); return s; },
    open(g, l) {
      if (PD.author()) return true;   // the owner checks every level
      if (g === 'rhythm' || g === 'song' || g === 'band') return true;
      return +l <= 1 || P.starsOf(g, +l - 1) > 0;
    },
    /** Rhythm Battle: a tempo opens once the one below it has a star on that rhythm */
    tempoOpen(rid, d) { const i = G.DIFFS.indexOf(d); if (i <= 0 || PD.author()) return true; const r = P.rec('rhythm', rid, G.DIFFS[i - 1]); return !!(r && r.stars > 0); },
    today: () => G.dayNum(new Date()),
    dailyCh: () => G.daily(P.today(), STORE.get(K.best, null)),
    dailyDone: () => { const d = P.daily().map[P.today()]; return !!(d && d.done); },
    stats: () => G.stats(STORE.get(K.best, null), STORE.get(K.hist, null), STORE.get(K.daily, null), P.today())
  };

  /** one finished round into the records, the app's practice history and XP. Never for the touch test */
  function save(S, r) {
    const date = Date.now(), dur = Math.max(1, Math.round(S.playMs / 1000));
    const rec = Object.assign({ g: S.g, l: S.l, d: S.d, date, dur, score: r.score, acc: r.acc, stars: r.stars, maxCombo: r.maxCombo, pitchAcc: r.pitchAcc, timing: r.timing, mistakes: r.miss || 0 }, r.save || {});   // a game's own facts (achievements read them)
    const R = G.record(STORE.get(K.best, null), rec); STORE.set(K.best, R.state);
    const H = P.hist(); H.list.push(rec); H.list = H.list.slice(-300); STORE.set(K.hist, H);
    let daily = false; const ch = P.dailyCh();
    if (!P.dailyDone() && G.dailyMet(ch, rec)) { const Dl = P.daily(); Dl.map[P.today()] = { done: 1, at: date, g: ch.g, l: ch.l }; STORE.set(K.daily, Dl); daily = true; }
    const A = P.ach(), got = G.newAchievements(P.stats(), A); got.forEach(id => { A.map[id] = date; }); if (got.length) STORE.set(K.ach, A);
    // the app's own practice record: XP (correct + 5 a minute), the streak and today's minutes all come from it
    const correct = r.hits || 0;
    PD.lessons.progress.addSession({ id: 'game:' + S.g + ':' + S.l, date, dur, firstTry: r.acc == null ? 0 : r.acc, pitch: r.pitchAcc, timing: r.timing, correct, notes: r.total, mode: 'game', input: 'mic', type: 'game', rhythm: S.g === 'rhythm', waited: false });
    const bonus = r.lowHeard ? 0 : G.bonusXP(R.improved) + (daily ? 25 : 0);
    if (bonus && PD.levels) PD.levels.add(bonus, 'game');
    return { improved: R.improved, record: R.improved.score && r.score > 0, daily, ach: got, xp: G.sessionXP(correct, dur) + bonus, xpParts: [correct, Math.round(dur / 60 * 5), bonus] };
  }

  /* ---------- styles: only in the installable app (this module is APP_ONLY) ---------- */
  function style() {
    if (PD.games._css) return; PD.games._css = true;
    document.head.appendChild(h('style', { id: 'gm-css', text: CSS }));
  }
  const CSS = `
.gm{--gm-bg:#080808;--gm-bg2:#141210;--gm-el:#201A15;--gm-cu:#C58A52;--gm-cu2:#F1B674;--gm-tx:#F8F5F1;--gm-tx2:#B6AAA0;--gm-ok:#55D697;--gm-err:#ED6464;--gm-line:rgba(241,182,116,.14);--gm-line2:rgba(241,182,116,.26);--gm-glow:rgba(197,138,82,.32)}
.gm .grow{flex:1;min-width:0}.gm .mono,.gm-n{font-variant-numeric:tabular-nums;font-feature-settings:'tnum'}
.gm h1,.gm h2,.gm h3,.gm b,.gm p,.gm small{overflow-wrap:anywhere;hyphens:auto}
.gm-hub{display:grid;gap:var(--s6);min-width:0}
.gm-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.gm-head h1{margin:0;font:700 var(--t-display)/1.08 var(--f-display);letter-spacing:-.015em}
.gm-head p{margin:6px 0 0;color:var(--gm-tx2);max-width:56ch}
.gm-ib{flex:none;width:44px;height:44px;border-radius:22px;display:grid;place-items:center;background:var(--gm-el);color:var(--gm-tx);border:1px solid var(--gm-line);cursor:pointer;transition:transform var(--d-press) var(--ease-out),background-color var(--d-micro)}
.gm-ib:active{transform:scale(.92)}.gm-ib:hover{background:#2a221b}
.gm-card{position:relative;border-radius:var(--r-l);background:linear-gradient(180deg,#191512,#110e0c);border:1px solid var(--gm-line);box-shadow:var(--e2);min-width:0}
.gm-player{display:grid;grid-template-columns:auto minmax(0,1fr);gap:16px;align-items:center;padding:18px;background:radial-gradient(130% 140% at 0% 0%,rgba(197,138,82,.2),transparent 58%),linear-gradient(180deg,#1b1612,#110e0c)}
.gm-badge{position:relative;width:64px;height:64px}.gm-badge svg{width:64px;height:64px}
.gm-player b{font-size:var(--t-title2);display:block}.gm-player small{color:var(--gm-tx2)}
.gm-xpbar{height:8px;border-radius:4px;background:rgba(255,255,255,.07);overflow:hidden;margin:10px 0 6px}
.gm-xpbar i{display:block;height:100%;width:0;border-radius:4px;background:linear-gradient(90deg,#A9683A,#F1B674);box-shadow:0 0 14px rgba(241,182,116,.5);transition:width 1.1s var(--ease-out)}
.gm-stats{grid-column:1/-1;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.gm-stat{padding:10px 12px;border-radius:var(--r-m);background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.05);min-width:0}
.gm-stat b{font-size:var(--t-title2);font-weight:700;color:var(--gm-tx)}.gm-stat small{display:block;color:var(--gm-tx2);font-size:var(--t-caption);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gm-row2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.gm-daily,.gm-cont{display:grid;grid-template-columns:96px minmax(0,1fr);gap:14px;align-items:center;padding:14px;cursor:pointer;text-align:left;color:inherit;font:inherit;width:100%;transition:transform var(--d-micro) var(--spring-soft),border-color var(--d-micro)}
.gm-daily:hover,.gm-cont:hover{border-color:var(--gm-line2)}.gm-daily:active,.gm-cont:active{transform:scale(.985)}
.gm-daily .gm-art,.gm-cont .gm-art{width:96px;height:72px;border-radius:12px;overflow:hidden}
.gm-k{font-size:var(--t-over);font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--gm-cu2)}
.gm-daily b,.gm-cont b{display:block;font-size:var(--t-headline);margin:2px 0}.gm-daily small,.gm-cont small{color:var(--gm-tx2)}
.gm-done{color:var(--gm-ok);font-weight:650}
.gm-sh{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 10px}
.gm-sh h2{margin:0;font:650 var(--t-title2)/1.2 var(--f-ui)}.gm-sh span{color:var(--gm-tx2);font-size:var(--t-foot)}
.gm-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,248px),1fr));gap:14px}
.gm-gc{display:flex;flex-direction:column;text-align:left;color:inherit;font:inherit;padding:0;overflow:hidden;cursor:pointer;transition:transform var(--d-tab) var(--spring-soft),border-color var(--d-micro),box-shadow var(--d-micro)}
.gm-gc:hover{border-color:var(--gm-line2);box-shadow:0 18px 44px -22px var(--gm-glow),var(--e2)}.gm-gc:active{transform:scale(.975)}
.gm-gc .gm-art{aspect-ratio:16/9;width:100%;overflow:hidden;border-bottom:1px solid var(--gm-line)}
.gm-art-svg{display:block;width:100%;height:100%}
.gm-gc-b{padding:12px 14px 14px;display:grid;gap:4px}.gm-gc-b b{font-size:var(--t-headline)}.gm-gc-b small{color:var(--gm-tx2);line-height:1.4}
.gm-gc-f{display:flex;align-items:center;gap:8px;margin-top:6px;flex-wrap:wrap}
.gm-star{width:16px;height:16px;fill:rgba(255,255,255,.12)}.gm-star.on{fill:#F1B674;filter:drop-shadow(0 0 6px rgba(241,182,116,.55))}
.gm-tag{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;font-weight:650;padding:3px 9px;border-radius:999px;background:rgba(241,182,116,.1);color:var(--gm-cu2);white-space:nowrap}
.gm-tag.beta{background:rgba(132,168,220,.14);color:#a9c4ef}.gm-tag.warn{background:rgba(237,100,100,.12);color:#f19a9a}
.gm-achs{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,150px),1fr));gap:10px}
.gm-ach{display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px;align-items:center;padding:10px 12px;border-radius:var(--r-m);background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05);opacity:.5}
.gm-ach.on{opacity:1;border-color:var(--gm-line2);background:linear-gradient(180deg,rgba(197,138,82,.1),rgba(197,138,82,.03))}
.gm-ach i{width:34px;height:34px;border-radius:17px;display:grid;place-items:center;background:#201A15;font-style:normal;font-size:17px}.gm-ach.on i{background:linear-gradient(180deg,#F1B674,#A9683A);color:#1A0F07}
.gm-ach b{font-size:var(--t-foot);display:block}.gm-ach small{font-size:var(--t-caption);color:var(--gm-tx2);line-height:1.3;display:block}
.gm-list{display:grid;gap:8px}
.gm-li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:11px 14px;border-radius:var(--r-m);background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05);color:inherit;font:inherit;text-align:left;cursor:pointer}
.gm-li small{color:var(--gm-tx2);display:block}.gm-li .gm-n{font-weight:700;color:var(--gm-cu2)}
.gm-note{font-size:var(--t-foot);color:var(--gm-tx2);line-height:1.5;margin:0}.gm-note b{color:var(--gm-tx)}
.gm-pre{display:grid;gap:var(--s5);min-width:0}
.gm-hero{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:18px;padding:0;overflow:hidden}
.gm-hero .gm-art{min-height:180px}.gm-hero-b{padding:18px 18px 18px 0;display:grid;gap:10px;align-content:center}
.gm-hero-b p{margin:0;color:var(--gm-tx2);line-height:1.5}.gm-hero-b .gm-tags{display:flex;gap:6px;flex-wrap:wrap}
.gm-sec{padding:16px;display:grid;gap:12px}.gm-sec h2{margin:0;font:650 var(--t-headline)/1.3 var(--f-ui)}
.gm-ul{margin:0;padding:0 0 0 18px;display:grid;gap:6px;color:var(--gm-tx2);line-height:1.45}.gm-ul li::marker{color:var(--gm-cu)}
.gm-levels{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,170px),1fr));gap:10px}
.gm-lv{position:relative;display:grid;gap:4px;padding:12px 12px 10px;border-radius:var(--r-m);background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.06);text-align:left;color:inherit;font:inherit;cursor:pointer;transition:transform var(--d-micro) var(--spring-soft),border-color var(--d-micro),background-color var(--d-micro)}
.gm-lv:active{transform:scale(.97)}.gm-lv[aria-pressed=true]{border-color:var(--gm-cu);background:linear-gradient(180deg,rgba(197,138,82,.18),rgba(197,138,82,.06));box-shadow:0 0 0 1px var(--gm-cu) inset,0 10px 30px -16px var(--gm-glow)}
.gm-lv .gm-lvn{font-size:var(--t-caption);color:var(--gm-cu2);font-weight:700;letter-spacing:.04em}.gm-lv b{font-size:var(--t-callout)}.gm-lv small{color:var(--gm-tx2);font-size:var(--t-caption);line-height:1.35}
.gm-lv.lock{opacity:.45;cursor:not-allowed}.gm-lv.lock::after{content:'🔒';position:absolute;top:10px;right:10px;font-size:13px}
.gm-lv .gm-st{display:flex;gap:2px}.gm-lv .gm-star{width:14px;height:14px}
.gm-seg{display:flex;flex-wrap:wrap;gap:6px}
.gm-seg button{min-height:38px;padding:0 14px;border-radius:999px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:var(--gm-tx2);font:600 var(--t-foot)/1 var(--f-ui);cursor:pointer;transition:background-color var(--d-micro),color var(--d-micro),border-color var(--d-micro)}
.gm-seg button[aria-pressed=true]{background:linear-gradient(180deg,#F1B674,#C58A52);color:#1A0F07;border-color:transparent}
.gm-seg button.lock{opacity:.4}
.gm-mic{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:center}
.gm-micdot{width:40px;height:40px;border-radius:20px;display:grid;place-items:center;background:#201A15;color:var(--gm-tx2);position:relative}
.gm-micdot.on{color:#1A0F07;background:linear-gradient(180deg,#7ee8b0,#3fbf7a)}.gm-micdot.on::after{content:'';position:absolute;inset:-4px;border-radius:24px;border:2px solid rgba(85,214,151,.5);transform:scale(var(--lv,1));transition:transform 80ms linear}
.gm-micdot.err{background:rgba(237,100,100,.16);color:var(--gm-err)}
.gm-meter{height:6px;border-radius:3px;background:rgba(255,255,255,.07);overflow:hidden;margin-top:6px}.gm-meter i{display:block;height:100%;width:0;background:linear-gradient(90deg,#3fbf7a,#F1B674 80%,#ED6464);transition:width 70ms linear}
.gm-acts{display:flex;flex-wrap:wrap;gap:8px}
.gm-chk{display:grid;gap:2px;margin:2px 0 4px}
.gm-chk-r{display:grid;grid-template-columns:22px minmax(0,auto) minmax(0,1fr) auto;gap:8px;align-items:center;min-height:36px;padding:2px 0;border-top:1px solid rgba(255,255,255,.05);font-size:var(--t-foot)}
.gm-chk-r:first-child{border-top:0}.gm-chk-r i{font-style:normal;font-weight:800;width:22px;height:22px;border-radius:11px;display:grid;place-items:center;background:rgba(255,255,255,.06);color:var(--gm-tx2);font-size:12px}
.gm-chk-r.ok i{background:rgba(85,214,151,.16);color:var(--gm-ok)}.gm-chk-r.no i{background:rgba(241,182,116,.16);color:var(--gm-cu2)}
.gm-chk-r span{color:var(--gm-tx2)}.gm-chk-r b{font-weight:600;text-align:right;color:var(--gm-tx);min-width:0}.gm-chk-r .btn{min-height:32px}
.gm-hm{display:grid;gap:10px;padding:10px}.gm-hm .gm-hm-main{border:0;background:none;padding:4px}
.gm-hm-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.gm-hm-b{display:grid;gap:2px;text-align:left;padding:10px 12px;border-radius:var(--r-m);border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.035);color:inherit;font:inherit;cursor:pointer;min-height:56px;min-width:0}
.gm-hm-b b{font-size:var(--t-foot);font-weight:600;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.gm-hm-b.done b{color:var(--gm-ok)}.gm-hm-b:hover{border-color:var(--gm-line2)}
.gm-cdia{width:min(64vw,250px)}.gm-cdia svg{display:block;width:100%;height:auto}@media (max-height:700px){.gm-cdia{display:none}}
.gm-intro .gm-art{height:140px;border-radius:14px;overflow:hidden;margin-bottom:12px}.gm-intro h2{margin:4px 0 8px}
.gm-in-dots{display:flex;gap:6px;justify-content:center;margin:14px 0}.gm-in-dots i{width:7px;height:7px;border-radius:4px;background:rgba(255,255,255,.18)}.gm-in-dots i.on{background:var(--gm-cu2);width:20px}
.gm-go{position:sticky;bottom:calc(var(--nav-h,64px) + env(safe-area-inset-bottom) + 14px);z-index:4;display:flex;justify-content:center}
.gm-go .btn{min-width:min(100%,320px);min-height:56px;font-size:var(--t-headline);font-weight:700;border-radius:28px;background:linear-gradient(180deg,#F1B674,#C58A52);color:#1A0F07;box-shadow:0 14px 40px -12px rgba(241,182,116,.55)}
@media (min-width:768px){.gm-go{bottom:20px}}
.gm-songs{display:grid;gap:8px}
.gm-song{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:12px 14px;border-radius:var(--r-m);background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.06);text-align:left;color:inherit;font:inherit;cursor:pointer}
.gm-song[aria-pressed=true]{border-color:var(--gm-cu);background:linear-gradient(180deg,rgba(197,138,82,.16),rgba(197,138,82,.05))}.gm-song small{color:var(--gm-tx2);display:block}
.gm-field2{display:grid;gap:6px}.gm-field2 label{font-size:var(--t-foot);color:var(--gm-tx2)}
.gm-range{width:100%;accent-color:#C58A52}
/* the stage */
html.gm-on .sm-fab{display:none!important}
.gm-stage{position:fixed;inset:0;z-index:60;background:radial-gradient(120% 70% at 50% 0%,#1a130e 0%,#080808 55%);color:var(--gm-tx);display:grid;grid-template-rows:auto minmax(0,1fr) auto;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);overflow:hidden;-webkit-user-select:none;user-select:none;touch-action:manipulation;animation:gm-in var(--d-screen) var(--ease-out)}
@keyframes gm-in{from{opacity:0;transform:scale(1.02)}to{opacity:1;transform:none}}
.gm-stage.out{animation:gm-outk var(--d-tab) var(--ease-in) forwards}@keyframes gm-outk{to{opacity:0;transform:scale(.985)}}
.gm-hud{display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;align-items:center;gap:10px;padding:10px 14px;max-width:1100px;width:100%;margin:0 auto;box-sizing:border-box}
.gm-hud .gm-ib{width:42px;height:42px}
.gm-hud-t{min-width:0}.gm-hud-t b{display:block;font-size:var(--t-callout);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.gm-hud-t small{display:block;color:var(--gm-tx2);font-size:var(--t-caption);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gm-sc{text-align:right}.gm-sc b{display:block;font:800 22px/1 var(--f-ui);letter-spacing:-.01em;color:var(--gm-tx)}.gm-sc small{font-size:var(--t-caption);color:var(--gm-cu2);font-weight:700}
.gm-sc small.mx{color:#1A0F07;background:linear-gradient(180deg,#F1B674,#C58A52);padding:1px 6px;border-radius:6px;margin-left:4px}
.gm-micmini{width:30px;height:30px;border-radius:15px;display:grid;place-items:center;color:var(--gm-tx2);background:#201A15;position:relative}
.gm-micmini.on{color:#7ee8b0}.gm-micmini.on::after{content:'';position:absolute;inset:-3px;border-radius:18px;border:2px solid rgba(85,214,151,.55);transform:scale(var(--lv,1));transition:transform 80ms linear}
.gm-micmini.off{color:var(--gm-err)}
.gm-prog{height:3px;background:rgba(255,255,255,.06);max-width:1100px;width:calc(100% - 28px);margin:0 auto;border-radius:2px;overflow:hidden}.gm-prog i{display:block;height:100%;width:0;background:linear-gradient(90deg,#A9683A,#F1B674)}
.gm-fieldw{position:relative;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr)}
.gm-field{position:relative;min-height:0;width:100%;max-width:var(--gm-fw,1100px);margin:0 auto;overflow:hidden}
.gm-field>canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.gm-foot{padding:8px 14px 14px;max-width:1100px;width:100%;margin:0 auto;box-sizing:border-box;display:grid;gap:8px;min-height:44px}
.gm-fb{min-height:22px;text-align:center;font-size:var(--t-callout);color:var(--gm-tx2);transition:color var(--d-micro)}
.gm-fb.ok{color:var(--gm-ok)}.gm-fb.bad{color:var(--gm-err)}.gm-fb.cu{color:var(--gm-cu2)}
.gm-pop{position:absolute;left:0;top:0;pointer-events:none;font:800 20px/1 var(--f-ui);letter-spacing:.02em;text-transform:uppercase;white-space:nowrap;transform:translate(-50%,-50%);animation:gm-pop .7s var(--ease-out) forwards;text-shadow:0 2px 18px rgba(0,0,0,.6)}
.gm-pop.perfect{color:#F1B674;text-shadow:0 0 22px rgba(241,182,116,.65)}.gm-pop.great{color:#e9cf9f}.gm-pop.good{color:#bfae98}.gm-pop.miss{color:var(--gm-err)}.gm-pop.unsure{color:#8d8d96;font-size:15px}
@keyframes gm-pop{0%{opacity:0;transform:translate(-50%,-30%) scale(.6)}18%{opacity:1;transform:translate(-50%,-60%) scale(1.12)}40%{transform:translate(-50%,-70%) scale(1)}100%{opacity:0;transform:translate(-50%,-130%) scale(.96)}}
.gm-combo{position:absolute;top:10px;left:50%;transform:translateX(-50%);pointer-events:none;text-align:center;font:800 15px/1 var(--f-ui);color:var(--gm-cu2);opacity:0;transition:opacity var(--d-micro)}
.gm-combo.on{opacity:.92}.gm-combo b{display:block;font-size:34px;letter-spacing:-.02em;color:var(--gm-tx)}.gm-combo.big b{color:#F1B674;text-shadow:0 0 24px rgba(241,182,116,.55)}
.gm-combo.bump b{animation:gm-bump .26s var(--spring)}@keyframes gm-bump{from{transform:scale(1.28)}to{transform:none}}
.gm-over{position:absolute;inset:0;z-index:5;display:grid;place-items:center;padding:20px;background:rgba(8,8,8,.74);-webkit-backdrop-filter:blur(14px) saturate(1.2);backdrop-filter:blur(14px) saturate(1.2);animation:gm-fade var(--d-tab) var(--ease-out)}
@keyframes gm-fade{from{opacity:0}to{opacity:1}}
.gm-over[hidden]{display:none}
.gm-panel{width:min(100%,460px);max-height:100%;overflow:auto;display:grid;gap:14px;padding:22px;border-radius:var(--r-xl);background:linear-gradient(180deg,#1d1814,#120f0c);border:1px solid var(--gm-line2);box-shadow:0 30px 80px -30px rgba(0,0,0,.9),0 0 0 1px rgba(255,255,255,.03) inset;text-align:center;animation:gm-rise var(--d-sheet) var(--spring-soft)}
@keyframes gm-rise{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}
.gm-panel h2{margin:0;font:750 var(--t-title1)/1.15 var(--f-display)}.gm-panel p{margin:0;color:var(--gm-tx2);line-height:1.5}
.gm-panel .btn{width:100%}.gm-panel .btn.primary,.gm-over .btn.primary{background:linear-gradient(180deg,#F1B674,#C58A52);color:#1A0F07}
.gm-cd{font:800 clamp(88px,22vw,150px)/1 var(--f-display);color:var(--gm-tx);text-shadow:0 0 60px rgba(241,182,116,.5);animation:gm-cd .9s var(--ease-out)}
@keyframes gm-cd{0%{opacity:0;transform:scale(1.6)}25%{opacity:1;transform:scale(1)}80%{opacity:1}100%{opacity:0;transform:scale(.8)}}
.gm-cdw{display:grid;gap:10px;justify-items:center;text-align:center}.gm-cdw small{color:var(--gm-tx2);font-size:var(--t-callout)}
.gm-rstars{display:flex;justify-content:center;gap:10px}.gm-rstars .gm-star{width:46px;height:46px}
.gm-rstars .gm-star.on{animation:gm-starin .55s var(--spring) backwards}.gm-rstars .gm-star:nth-child(2){animation-delay:.18s}.gm-rstars .gm-star:nth-child(3){animation-delay:.36s}
@keyframes gm-starin{from{transform:scale(0) rotate(-40deg);opacity:0}to{transform:none;opacity:1}}
.gm-rscore{font:800 44px/1 var(--f-display);letter-spacing:-.02em}
.gm-rgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
.gm-rgrid div{padding:8px 4px;border-radius:12px;background:rgba(255,255,255,.04);min-width:0}.gm-rgrid b{display:block;font-size:20px}.gm-rgrid small{font-size:11px;line-height:1.2;color:var(--gm-tx2);display:block;overflow-wrap:anywhere}
.gm-rgrid .p b{color:#F1B674}.gm-rgrid .m b{color:var(--gm-err)}
.gm-rrows{display:grid;gap:6px;text-align:left}.gm-rrows div{display:flex;justify-content:space-between;gap:10px;font-size:var(--t-callout);color:var(--gm-tx2)}.gm-rrows b{color:var(--gm-tx)}
.gm-rnote{font-size:var(--t-foot);color:var(--gm-tx2);text-align:left}
.gm-chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}
.gm-btns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.gm-btns .btn:only-child,.gm-btns .wide{grid-column:1/-1}
.gm-dbg{position:absolute;right:8px;top:8px;z-index:4;pointer-events:none;font:11px/1.45 var(--f-mono);color:#cfe;background:rgba(0,0,0,.72);border:1px solid rgba(120,200,255,.25);border-radius:8px;padding:6px 8px;white-space:pre;max-width:60vw;overflow:hidden}
.gm-spark{position:absolute;pointer-events:none}
/* tablets and wider: the room beside a narrow play field holds live statistics and the notes coming next */
.gm-side{position:absolute;top:84px;width:min(200px,calc(50% - 324px));display:none;gap:10px;align-content:start;padding:14px;border-radius:var(--r-l);background:linear-gradient(180deg,rgba(29,24,20,.82),rgba(18,15,12,.82));border:1px solid var(--gm-line);pointer-events:none}
.gm-side h3{margin:0;font:700 var(--t-over)/1 var(--f-ui);letter-spacing:.08em;text-transform:uppercase;color:var(--gm-cu2)}
.gm-side .gm-sr{display:flex;justify-content:space-between;gap:8px;font-size:var(--t-callout);color:var(--gm-tx2)}.gm-side .gm-sr b{color:var(--gm-tx);font-variant-numeric:tabular-nums}
.gm-side .gm-nx{display:grid;grid-template-columns:auto minmax(0,1fr);gap:2px 10px;align-items:center;padding:6px 0;border-top:1px solid rgba(255,255,255,.05)}.gm-side .gm-nx:first-of-type{border-top:0}
.gm-side .gm-nx b{font-size:20px;color:var(--gm-tx)}.gm-side .gm-nx small{color:var(--gm-tx2);font-size:var(--t-caption)}.gm-side .gm-nx.gm-now b{color:#F1B674}
.gm-side-l{left:max(12px,calc(50% - 516px))}.gm-side-r{right:max(12px,calc(50% - 516px))}
@media (min-width:1000px) and (min-height:560px){.gm-side{display:grid}}
@media (max-width:640px){.gm-row2{grid-template-columns:minmax(0,1fr)}.gm-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.gm-hero{grid-template-columns:minmax(0,1fr)}.gm-hero-b{padding:0 16px 16px}.gm-hero .gm-art{min-height:0;aspect-ratio:16/8}.gm-head h1{font-size:var(--t-title1)}.gm-sc b{font-size:19px}}
@media (prefers-reduced-motion:reduce){.gm-stage,.gm-panel,.gm-pop,.gm-cd,.gm-rstars .gm-star.on,.gm-combo.bump b{animation:none!important}.gm-xpbar i{transition:none}}
:root.rm .gm-stage,:root.rm .gm-panel,:root.rm .gm-pop,:root.rm .gm-cd,:root.rm .gm-rstars .gm-star.on{animation:none!important}
`;

  /* ---------- names ---------- */
  const gName = g => t('gm.g.' + g);
  const dName = (g, d) => t(g === 'rhythm' ? 'gm.rb.d.' + d : 'gm.d.' + d) + (g === 'rhythm' ? ' · ' + G.RB_BPM[d] : '');
  function lvName(g, l) {
    if (g === 'rush') { const L = G.RUSH.find(x => x.id === +l); return L ? t('gm.rush.l.' + L.key) : ''; }
    if (g === 'rhythm') { const r = PD.curriculum.rhythms().find(x => x.id === l); return r ? PD.i18n.pick(r.name) : String(l); }
    if (g === 'song') { const s = PD.lessons.get(l); return s ? PD.i18n.pick(s.title) : String(l); }
    if (g === 'band') return PD.i18n.pick((PD.lessons.get('bani-acharuli') || { title: { ka: 'ბანი-აჭარული', en: 'Bani-Acharuli' } }).title);
    return t('gm.lvl', { n: l });
  }
  const pct = x => x == null ? '—' : Math.round(x * 100) + '%';
  const micErr = e => e === 'denied' && !PD.ui.micBlocked() ? t('gm.micDenied') : e === 'notfound' ? t('gm.noMic') : PD.ui.micError(e);
  const sessionName = id => { const m = /^game:([a-z]+):(.*)$/.exec(String(id || '')); return m && t('gm.g.' + m[1]) !== 'gm.g.' + m[1] ? t('gm.ses', { g: t('gm.g.' + m[1]) }) : null; };

  /* ---------- the hub ---------- */
  function hub(w) {
    w.classList.add('gm', 'gm-hub');
    const st = P.stats(), lp = PD.levels ? PD.levels.progress : { level: 0, into: 0, need: 100, pct: 0 };
    w.append(h('header', { class: 'gm-head' }, [h('div', { class: 'grow' }, [h('h1', { 'data-t': 'gm.title' }), h('p', { 'data-t': 'gm.lead' })]),
      h('button', { class: 'gm-ib', type: 'button', 'aria-label': t('gm.settings'), title: t('gm.settings'), html: GEAR, onclick: () => settings() })]));
    // the player
    const bar = h('i'), card = h('section', { class: 'gm-card gm-player', 'aria-label': t('gm.lvl', { n: lp.level }) }, [
      h('div', { class: 'gm-badge', html: PD.levels ? PD.levels.badge(64) : '' }),
      h('div', {}, [h('b', { text: t('gm.lvl', { n: lp.level }) + (PD.levels ? ' · ' + PD.levels.tierName(lp.level) : '') }), h('div', { class: 'gm-xpbar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(Math.round(lp.pct * 100)) }, [bar]), h('small', { text: t('gm.xpOf', { a: lp.into, b: lp.need }) + ' · ' + t('gm.xpNote') })]),
      h('div', { class: 'gm-stats' }, [['gm.stStars', st.stars], ['gm.stPlays', st.plays], ['gm.stTime', Math.round(st.time / 60)], ['gm.stCombo', st.maxCombo]].map(([k, v]) => h('div', { class: 'gm-stat' }, [h('b', { class: 'gm-n', text: String(v) }), h('small', { 'data-t': k })])))]);
    w.append(card);
    requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = Math.round(Math.max(0, Math.min(1, lp.pct)) * 100) + '%'; }));
    card.querySelectorAll('.gm-stat b').forEach(b => PD.ui.countUp(b, 800));
    // a challenge waiting from a link
    const pend = STORE.get('gm.pending', null);
    if (pend && G.decodeChallenge(pend)) w.append(h('button', { class: 'gm-card gm-cont', type: 'button', onclick: () => PD.app.go('games', 'arena:' + pend) }, [h('span', { class: 'gm-art', html: ART.arena() }), h('span', {}, [h('span', { class: 'gm-k', 'data-t': 'gm.g.arena' }), h('b', { 'data-t': 'gm.ar.pending' })])]));
    // daily challenge + continue
    const row = h('div', { class: 'gm-row2' }), ch = P.dailyCh(), done = P.dailyDone();
    row.append(h('button', { class: 'gm-card gm-daily', type: 'button', onclick: () => PD.app.go('games', ch.g + ':' + ch.l + ':' + ch.d) }, [h('span', { class: 'gm-art', html: ART[ch.g]() }),
      h('span', {}, [h('span', { class: 'gm-k', 'data-t': 'gm.daily' }), h('b', { text: gName(ch.g) + ' · ' + lvName(ch.g, ch.l) }), h('small', { text: goalText(ch.goal) + ' · ' + dName(ch.g, ch.d) }),
        h('small', { class: done ? 'gm-done' : '', style: 'display:block;margin-top:4px', text: done ? '✓ ' + t('gm.dailyDone') + ' · ' + t('gm.dailyNew') : st.dailyStreak ? t('gm.dailyStreak', { n: st.dailyStreak }) : '' })])]));
    const last = P.hist().list.slice(-1)[0];
    if (last && PD.gameModes && PD.gameModes[last.g]) row.append(h('button', { class: 'gm-card gm-cont', type: 'button', onclick: () => PD.app.go('games', last.g + ':' + last.l + ':' + last.d) }, [h('span', { class: 'gm-art', html: ART[last.g]() }),
      h('span', {}, [h('span', { class: 'gm-k', 'data-t': 'gm.continue' }), h('b', { text: gName(last.g) }), h('small', { text: lvName(last.g, last.l) + ' · ' + dName(last.g, last.d) }), h('span', { class: 'gm-st', style: 'display:flex;gap:2px;margin-top:4px', html: stars(last.stars) })])]));
    w.append(row);
    // the catalogue
    const cards = h('div', { class: 'gm-cards', role: 'list' });
    ORDER.forEach(g => {
      const def = G.GAMES.find(x => x.id === g), mx = (def.levels || 0) * 3;
      // the most stars per level (its levels are the teacher's rhythms for Rhythm Battle, numbers elsewhere)
      let got = 0; const B = P.best().map, ids = g === 'rhythm' ? PD.curriculum.rhythms().map(r => r.id) : Array.from({ length: def.levels || 0 }, (_, i) => i + 1);
      if (def.levels) ids.forEach(l => { got += P.starsOf(g, l); }); else Object.keys(B).forEach(k => { if (k.startsWith(g + ':')) got += B[k].stars || 0; });
      const tags = [];
      if (g === 'rhythm') tags.push(h('span', { class: 'tp-src teacher', text: PD.ui.srcLabel('tp.src.teacher') }));
      if (g === 'band') tags.push(h('span', { class: 'gm-tag', text: '🎧' }));
      cards.append(h('button', { class: 'gm-card gm-gc', type: 'button', role: 'listitem', onclick: () => PD.app.go('games', g) }, [h('span', { class: 'gm-art', html: ART[g]() }),
        h('span', { class: 'gm-gc-b' }, [h('b', { text: gName(g) }), h('small', { text: t('gm.gd.' + g) }),
          h('span', { class: 'gm-gc-f' }, [mx ? h('span', { class: 'gm-st', style: 'display:flex;gap:2px', html: STAR(got > 0) }) : null, mx ? h('span', { class: 'gm-n', style: 'font-size:12.5px;color:var(--gm-tx2)', text: got + ' / ' + mx }) : null, ...tags])])]));
    });
    w.append(h('section', {}, [h('div', { class: 'gm-sh' }, [h('h2', { 'data-t': 'gm.catalog' })]), cards]));
    // achievements
    const A = P.ach().map, achs = h('div', { class: 'gm-achs' }, G.ACH.map(([id]) => h('div', { class: 'gm-ach' + (A[id] ? ' on' : ''), title: A[id] ? new Date(A[id]).toLocaleDateString(PD.i18n.locale) : '' }, [h('i', { text: A[id] ? '★' : '·' }), h('span', {}, [h('b', { 'data-t': 'gm.a.' + id }), h('small', { 'data-t': 'gm.ad.' + id })])])));
    w.append(h('section', {}, [h('div', { class: 'gm-sh' }, [h('h2', { 'data-t': 'gm.ach' }), h('span', { class: 'gm-n', text: Object.keys(A).length + ' / ' + G.ACH.length })]), achs]));
    // recent results
    const H = P.hist().list.slice(-6).reverse(), list = h('div', { class: 'gm-list' });
    if (!H.length) list.append(h('p', { class: 'gm-note', 'data-t': 'gm.none' }));
    H.forEach(x => list.append(h('button', { class: 'gm-li', type: 'button', onclick: () => PD.app.go('games', x.g + ':' + x.l + ':' + x.d) }, [h('span', {}, [h('b', { text: gName(x.g) + ' · ' + lvName(x.g, x.l) }), h('small', { text: new Date(x.date).toLocaleDateString(PD.i18n.locale, { day: 'numeric', month: 'short' }) + ' · ' + dName(x.g, x.d) + ' · ' + pct(x.acc) })]),
      h('span', { style: 'text-align:right' }, [h('span', { class: 'gm-n', text: String(x.score || 0) }), h('span', { style: 'display:flex;gap:1px;justify-content:flex-end', html: stars(x.stars) })])])));
    w.append(h('section', {}, [h('div', { class: 'gm-sh' }, [h('h2', { 'data-t': 'gm.recent' })]), list]));
    w.append(micCard());
    if (!STORE.get('gm.intro', 0)) setTimeout(() => { if (PD.app.route === 'games' && w.isConnected && !STORE.get('gm.intro', 0)) intro(); }, 350);
  }
  function goalText(g) { return g.kind === 'acc' ? t('gm.goal.acc', { v: Math.round(g.v * 100) }) : t('gm.goal.' + g.kind, { v: g.v }); }

  /* ---------- the microphone card (status, level, calibration) ---------- */
  function micCard(opt) {
    opt = opt || {};
    const dot = h('span', { class: 'gm-micdot', html: MIC }), title = h('b'), sub = h('small', { style: 'display:block;color:var(--gm-tx2)' }), meter = h('div', { class: 'gm-meter', hidden: true }, [h('i')]);
    const btn = h('button', { class: 'btn small primary', type: 'button' }), acts = h('div', { class: 'gm-acts' });
    const card = h('section', { class: 'gm-card gm-sec' }, [h('div', { class: 'gm-mic' }, [dot, h('div', {}, [title, sub, meter]), btn]), acts, h('p', { class: 'gm-note', 'data-t': 'gm.micLocal' })]);
    const draw = () => {
      const s = PD.detector.status(), on = PD.detector.active, err = s.err && !on, inf = GA.info();
      dot.className = 'gm-micdot' + (on ? ' on' : err ? ' err' : '');
      title.textContent = t('gm.mic') + ' · ' + t(on ? 'gm.micOn' : 'gm.micOff');
      sub.textContent = err ? micErr(s.err) : (inf.calibrated ? t('gm.calLast', { d: PD.ui.daysAgo(PD.detector.calib.date) }) : t('gm.calNever'));
      meter.hidden = !on; btn.hidden = on; btn.textContent = t('gm.micTurnOn');
    };
    btn.onclick = async () => { btn.classList.add('is-loading'); const r = await GA.acquire(); btn.classList.remove('is-loading'); if (!r.ok && r.err && r.err !== 'cancelled') PD.ui.toast(micErr(r.err), 4200); draw(); if (opt.onChange) opt.onChange(); };
    acts.append(
      h('button', { class: 'btn small', type: 'button', 'data-t': 'ob.tune', onclick: () => tuneCheck() }),
      h('button', { class: 'btn small', type: 'button', 'data-t': 'gm.cal', onclick: () => PD.calib.open(() => { draw(); }, { keep: true }) }),
      h('button', { class: 'btn small', type: 'button', 'data-t': 'gm.off', onclick: () => offsetSheet() }));
    let lv = 0;
    /* the pre-game check (opt.check): every line reads something measured — the microphone's state, a sound above the
       room's own noise floor in the last 2.5 s, the last note the detector heard, the calibration, the tuning check */
    const ck = { sig: -1e9, peak: 0, note: null, unsure: -1e9 }, list = opt.check ? h('div', { class: 'gm-chk', 'aria-live': 'polite' }) : null;
    const row = (ok, label, value, act) => h('div', { class: 'gm-chk-r' + (ok === true ? ' ok' : ok === false ? ' no' : '') }, [h('i', { 'aria-hidden': 'true', text: ok === true ? '✓' : ok === false ? '!' : '·' }), h('span', { text: label }), h('b', { text: value || '' }), act || null]);
    const drawChk = () => {
      if (!list) return;
      const on = PD.detector.active, inf = GA.info(), tn = STORE.get('gm.tuned', null), now = performance.now(), sig = on && now - ck.sig < 2500, fresh = tn && Date.now() - tn.at < 3 * 3600e3;
      const kids = [row(on, t('gm.mic'), t(on ? 'gm.micOn' : 'gm.micOff')),
        row(on ? (sig || null) : null, t('gm.ck.sig'), !on ? '—' : sig ? t('gm.ck.sigOk', { db: Math.round(GA.db(ck.peak) / 5) * 5 }) : t('gm.ck.sigWait')),
        row(ck.note ? true : null, t('gm.ck.note'), ck.note ? TH.name(ck.note.midi) + ' · ' + (ck.note.cents > 0 ? '+' : '') + Math.round(ck.note.cents || 0) + '¢' : ck.unsure && now - ck.unsure < 4000 ? t('gm.ck.noteUnsure') : on ? t('gm.ck.noteWait') : '—'),
        row(inf.calibrated ? true : false, t('gm.ck.cal'), inf.calibrated ? PD.ui.daysAgo(PD.detector.calib.date) : t('gm.ck.calNeed'), inf.calibrated ? null : h('button', { class: 'btn small', type: 'button', 'data-t': 'gm.calNow', onclick: () => PD.calib.open(() => { draw(); }, { keep: true }) })),
        row(fresh ? !!tn.ok : null, t('gm.ck.tune'), fresh ? (tn.ok ? t('gm.ck.tuneOk', { d: PD.ui.daysAgo(tn.at) }) : t('gm.ck.tuneOff', { c: tn.worst })) : t('gm.ck.tuneNot'), fresh && tn.ok ? null : h('button', { class: 'btn small', type: 'button', 'data-t': 'ob.tune', onclick: () => tuneCheck() }))];
      const tail = !on ? h('p', { class: 'gm-note', text: t('gm.ck.offMic') }) : sig && ck.note && inf.calibrated && fresh && tn.ok ? h('p', { class: 'gm-note', style: 'color:var(--gm-ok)', text: '✓ ' + t('gm.ck.ready') }) : null;
      // redrawn only when something changed, so a button is never replaced under the finger
      const sigKey = kids.map(k => k.className + k.textContent).join('|') + (tail ? tail.textContent : '');
      if (sigKey === list.dataset.k) return; list.dataset.k = sigKey;
      list.innerHTML = ''; kids.forEach(k => list.append(k)); if (tail) list.append(tail); PD.i18n.apply(list);
    };
    const offL = PD.detector.on('level', m => {
      lv = Math.max(lv * .7, m.rms); const w2 = Math.min(100, Math.sqrt(lv) * 260); meter.firstChild.style.width = w2 + '%'; dot.style.setProperty('--lv', (1 + Math.min(.35, lv * 6)).toFixed(3));
      if (list && m.rms > Math.max(.0018, (PD.detector.floor || 0) * 3)) { const was = performance.now() - ck.sig < 2500; ck.sig = performance.now(); ck.peak = Math.max(m.rms, was ? ck.peak * .97 : 0); if (!was) drawChk(); }
    });
    const offN = list ? PD.detector.on('note', m => { if (m.unsure || !(m.conf >= .55)) ck.unsure = performance.now(); else ck.note = m; drawChk(); }) : () => {};
    const tick = list ? setInterval(() => { if (!card.isConnected) return; drawChk(); }, 1200) : 0;
    const offS = PD.detector.on('state', () => { draw(); drawChk(); });
    const un = PD.bus.on('route', r => { offL(); offS(); offN(); clearInterval(tick); un(); if (r !== 'games' && !cur) GA.release(); });
    if (list) card.insertBefore(h('div', {}, [h('h3', { class: 'gm-k', 'data-t': 'gm.ck.title' }), list]), acts);
    draw(); drawChk();
    return card;
  }

  /* ---------- tuning check: the three open strings, from the microphone ---------- */
  function tuneCheck() {
    PD.ui.sheet((box, close) => {
      style(); box.classList.add('gm');
      const rows = h('div', { class: 'gm-list' }), res = {}, out = h('p', { class: 'gm-note', 'aria-live': 'polite' });
      const draw = () => {
        rows.innerHTML = '';
        [1, 2, 3].forEach(s => { const c = res[s]; rows.append(h('div', { class: 'gm-li', style: 'cursor:default' }, [h('span', {}, [h('b', { text: TH.stringName(s) + ' · ' + TH.name(TH.open(s)) }), h('small', { text: c == null ? '—' : Math.abs(c) <= 15 ? t('ob.tuneOk') : (c > 0 ? '+' : '') + c + '¢ · ' + t(c > 0 ? 'ob.tuneHigh' : 'ob.tuneLow') })]),
          h('span', { class: 'gm-n', style: 'color:' + (c == null ? 'var(--gm-tx2)' : Math.abs(c) <= 15 ? 'var(--gm-ok)' : Math.abs(c) <= 25 ? 'var(--gm-cu2)' : 'var(--gm-err)'), text: c == null ? '…' : (Math.abs(c) <= 15 ? '✓ ' : '') + (c > 0 ? '+' : '') + c + '¢' })])); });
      };
      box.append(h('h2', { 'data-t': 'ob.tune' }), h('p', { class: 'fg2', 'data-t': 'ob.tuneD' }), rows, out,
        h('div', { class: 'row' }, [h('button', { class: 'btn', type: 'button', 'data-t': 'ob.openTuner', onclick: () => { close(); PD.app.go('tuner'); } }), h('span', { class: 'spacer' }), h('button', { class: 'btn primary', type: 'button', 'data-t': 'cb.finish', onclick: () => close() })]));
      draw();
      /* a plucked string starts sharp and settles within a few tenths of a second (the teacher's open A: +20 cents in its
         attack, +8 settled), so the reading is the median of the pitch frames 0.25–0.9 s after the stroke, as in a tuner */
      let cur = null;
      const settle = () => {
        const c = cur; cur = null; if (!c || c.f.length < 5) return;
        const fs = c.f.sort((a, b) => a - b), med = fs[fs.length >> 1];
        res[c.s] = Math.round((TH.midiOf(med) - TH.open(c.s)) * 100); out.textContent = ''; draw();
        if ([1, 2, 3].every(k => res[k] != null && Math.abs(res[k]) <= 15)) out.textContent = '✓ ' + t('ob.tuneOk');
        if ([1, 2, 3].every(k => res[k] != null)) STORE.set('gm.tuned', { at: Date.now(), ok: [1, 2, 3].every(k => Math.abs(res[k]) <= 15), worst: Math.max(...[1, 2, 3].map(k => Math.abs(res[k]))) });
      };
      const offN = PD.detector.on('note', m => {
        if (m.unsure || m.conf < .7) return;
        settle();
        let s = 0, bd = 1.5; [1, 2, 3].forEach(k => { const d = Math.abs(m.midi - TH.open(k)); if (d < bd) { bd = d; s = k; } });
        if (!s) { out.textContent = t('tr.heard', { p: TH.name(m.midi), e: [1, 2, 3].map(k => TH.name(TH.open(k))).join(' · ') }); return; }
        const t0 = m.t + (PD.detector.calib.latencyMs || 0) / 1000;   // pitch frames carry the raw input time
        cur = { s, t0, f: [] }; setTimeout(() => { if (cur && cur.t0 === t0) settle(); }, 1000);
      });
      const offP = PD.detector.on('pitch', p => { if (!cur || p.conf < .8 || p.t < cur.t0 + .25 || p.t > cur.t0 + .9) return; if (Math.abs(TH.midiOf(p.f) - TH.open(cur.s)) < 1) cur.f.push(p.f); });
      const off = () => { offN(); offP(); };
      let started = false, closed = false;
      if (!PD.detector.active) GA.acquire().then(r => { if (closed) { if (r.ok) GA.release(); return; } started = r.ok; if (!r.ok) out.textContent = micErr(r.err); });
      return () => { closed = true; off(); if (started) GA.release(); };
    });
  }

  /* ---------- play-along timing (the per-device offset) ---------- */
  function offsetSheet() {
    PD.ui.sheet((box, close) => {
      style(); box.classList.add('gm');
      const out = h('p', { class: 'gm-note', 'aria-live': 'polite', text: t('gm.offNow', { ms: Math.round(GA.offset() * 1000) }) }), beat = h('div', { class: 'gm-micdot', style: 'margin:6px auto;width:56px;height:56px;border-radius:28px', html: MIC });
      let test = null, started = false, closed = false;
      const go = h('button', { class: 'btn primary', type: 'button', 'data-t': 'gm.offGo', onclick: async () => {
        if (!PD.detector.active) { const r = await GA.acquire(); if (closed) { if (r.ok) GA.release(); return; } if (!r.ok) { out.textContent = micErr(r.err); return; } started = true; }
        go.disabled = true; let k = 0; out.textContent = t('gm.offListen', { k: 0 });
        test = GA.offsetTest({ n: 8, bpm: 80 }, () => { k++; out.textContent = t('gm.offListen', { k }); });
        // the pulse follows the clicks, so the eye can help the ear
        const pulse = () => { if (!test) return; const now = PD.audio.now() - GA.lag(), ph = (now - test.t0) / test.spb; if (ph > -0.1 && ph < 12) { const f = ph - Math.floor(ph); beat.style.transform = 'scale(' + (1 + .25 * Math.max(0, 1 - f * 4)).toFixed(3) + ')'; beat.className = 'gm-micdot' + (f < .2 ? ' on' : ''); } requestAnimationFrame(pulse); };
        requestAnimationFrame(pulse);
        const r = await test; test = null; go.disabled = false; beat.style.transform = ''; beat.className = 'gm-micdot';
        if (!r.ok) { out.textContent = t('gm.offFail', { n: r.hits }); return; }
        GA.setOffset(r.ms, r.spread);
        out.textContent = (Math.abs(r.ms) < 8 ? t('gm.offNow', { ms: r.ms }) : t('gm.offRes', { ms: Math.abs(r.ms), dir: t(r.ms < 0 ? 'gm.offEarly' : 'gm.offLate') })) + ' · ' + t('gm.offSpread', { ms: r.spread });
      } });
      box.append(h('h2', { 'data-t': 'gm.off' }), h('p', { class: 'fg2', 'data-t': 'gm.offD' }), beat, out, h('p', { class: 'muted', 'data-t': 'gm.offBt' }),
        h('div', { class: 'row' }, [h('button', { class: 'btn', type: 'button', 'data-t': 'gm.offReset', onclick: () => { GA.setOffset(0); out.textContent = t('gm.offNow', { ms: 0 }); } }), h('span', { class: 'spacer' }), go]));
      return () => { closed = true; if (test) test.cancel(); test = null; if (started) GA.release(); };
    });
  }

  /* ---------- settings ---------- */
  function settings() {
    PD.ui.sheet((box, close) => {
      style(); box.classList.add('gm');
      const tog = (k, def, label, desc) => { const c = h('input', { type: 'checkbox', 'aria-label': t(label) }); c.checked = STORE.get(k, def) !== false && STORE.get(k, def) !== 0; c.onchange = () => STORE.set(k, c.checked); return h('label', { class: 'gm-li', style: 'cursor:pointer' }, [h('span', {}, [h('b', { 'data-t': label }), desc ? h('small', { 'data-t': desc }) : null]), c]); };
      const sel = h('select', { class: 'input', 'aria-label': t('gm.device') });
      const fill = async () => {
        const list = await GA.devices(), cur = STORE.get('mic.device', '');
        sel.innerHTML = ''; sel.append(h('option', { value: '', text: t('gm.deviceDefault') }));
        list.filter(d => d.id && d.id !== 'default' && d.id !== 'communications').forEach((d, i) => sel.append(h('option', { value: d.id, text: d.label || t('gm.deviceN', { n: i + 1 }) })));
        sel.value = [...sel.options].some(o => o.value === cur) ? cur : '';
      };
      sel.onchange = async () => { await PD.detector.setDevice(sel.value); PD.ui.toast(t(PD.detector.active ? 'gm.micOn' : 'gm.micOff')); };
      const offDev = GA.onDeviceChange(fill); fill();
      box.append(h('h2', { 'data-t': 'gm.settings' }),
        h('h3', { class: 'gm-k', 'data-t': 'gm.set.mic' }),
        h('div', { class: 'gm-field2' }, [h('label', { 'data-t': 'gm.device' }), sel, h('small', { class: 'muted', 'data-t': 'gm.deviceHint' })]),
        h('div', { class: 'gm-acts' }, [h('button', { class: 'btn small', type: 'button', 'data-t': 'gm.cal', onclick: () => { close(); PD.calib.open(null, { keep: true }); } }), h('button', { class: 'btn small', type: 'button', 'data-t': 'gm.off', onclick: () => { close(); offsetSheet(); } }), h('button', { class: 'btn small', type: 'button', 'data-t': 'ob.tune', onclick: () => { close(); tuneCheck(); } })]),
        h('h3', { class: 'gm-k', 'data-t': 'gm.set.view' }),
        h('div', { class: 'gm-list' }, [tog('gm.metro', true, 'gm.set.metro'), tog('gm.names', true, 'gm.set.names'), tog('gm.fx', true, 'gm.set.fx')]));
      // the diagnostics only for whoever switched on the developer touch test (or the owner)
      if (STORE.get('devTouch', false) || PD.author()) box.append(h('h3', { class: 'gm-k', 'data-t': 'gm.set.dev' }), h('div', { class: 'gm-list' }, [tog('gm.debug', false, 'gm.set.debug', 'gm.set.debugD')]));
      box.append(h('div', { class: 'row' }, [h('span', { class: 'spacer' }), h('button', { class: 'btn primary', type: 'button', 'data-t': 'cb.finish', onclick: () => close() })]));
      return () => offDev();
    });
  }
  const debugOn = () => !!STORE.get('gm.debug', false) && (STORE.get('devTouch', false) || PD.author());

  /* ---------- a game's start page ---------- */
  function pre(w, gid, sel) {
    w.classList.add('gm', 'gm-pre');
    const M = PD.gameModes && PD.gameModes[gid];
    w.append(h('div', { class: 'pg-top' }, [h('button', { class: 'btn small backbtn', type: 'button', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('games') }), h('h1', { text: gName(gid) })]));
    const tags = h('div', { class: 'gm-tags' });
    if (gid === 'rhythm' || gid === 'band') tags.append(h('span', { class: 'tp-src teacher', text: PD.ui.srcLabel('tp.src.teacher') }));
    w.append(h('section', { class: 'gm-card gm-hero' }, [h('div', { class: 'gm-art', html: ART[gid]() }), h('div', { class: 'gm-hero-b' }, [h('p', { text: t('gm.gd.' + gid) }), tags])]));
    if (!M || !M.page) return;
    const st = { g: gid, l: sel.l, d: sel.d, opts: {} };
    const startBtn = h('button', { class: 'btn primary big', type: 'button', html: ic.play + '<span>' + PD.esc(t('gm.start')) + '</span>' });
    const ctx = { st, w, P, h, G, gName, lvName, dName, stars, STAR, pct, micCard, start: () => begin(), refresh: () => upd(), btn: startBtn };
    const upd = M.page(ctx) || (() => {});
    const noMic = !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia;
    if (noMic && !STORE.get('devTouch', false)) w.append(h('p', { class: 'notice' }, [h('span', { 'data-t': 'gm.noMic' }), M.preview ? h('span', { text: ' ' + t('gm.ck.preview') }) : null]));
    if (M.timeline !== false || M.mic !== false) w.append(micCard({ onChange: () => upd(), check: true }));
    function begin() {
      if (noMic && !STORE.get('devTouch', false) && !st.opts.listen) { PD.ui.toast(t('gm.noMic') + (M.preview ? ' ' + t('gm.ck.preview') : ''), 5000); return; }   // a preview needs no microphone
      PD.audio.ensure();   // inside the tap: the audio clock may start only from a gesture (iOS)
      play(gid, Object.assign({}, st, { opts: Object.assign({}, st.opts) }));
    }
    startBtn.onclick = begin;
    w.append(h('div', { class: 'gm-go' }, [startBtn]));
    upd();
  }

  /* ---------- the play stage ---------- */
  let cur = null;
  function play(gid, o) {
    if (cur) cur.exit({ norender: true });
    const M = PD.gameModes && PD.gameModes[gid]; if (!M) return null;
    style();
    const S = {
      g: gid, l: o.l, d: o.d, o, opts: o.opts || {}, D: G.widen(G.diff(o.d), GA.jitter()), dev: !!STORE.get('devTouch', false), names: STORE.get('gm.names', true) !== false, fx: STORE.get('gm.fx', true) !== false && motionOK() && !PD.device.low,
      sc: null, clock: null, mode: null, playMs: 0, runAt: 0, raf: 0, timers: new Set(), ivs: new Set(), offs: [], lid: 0, reason: '', alive: true
    };
    const root = h('div', { class: 'gm gm-stage', role: 'dialog', 'aria-modal': 'true', 'aria-label': gName(gid) });
    const pause = h('button', { class: 'gm-ib', type: 'button', 'aria-label': t('gm.pause'), html: PAUSE });
    const title = h('div', { class: 'gm-hud-t' }, [h('b', { text: gName(gid) }), h('small', { text: (o.lname || lvName(gid, o.l)) + (o.d ? ' · ' + dName(gid, o.d) : '') })]);
    const scB = h('b', { class: 'gm-n', text: '0' }), scS = h('small'), sc = h('div', { class: 'gm-sc' }, [scB, scS]);
    const mic = h('span', { class: 'gm-micmini', title: t('gm.mic'), html: MIC });
    const hud = h('div', { class: 'gm-hud' }, [pause, title, sc, mic]);
    const prog = h('div', { class: 'gm-prog' }, [h('i')]);
    const field = h('div', { class: 'gm-field' }), combo = h('div', { class: 'gm-combo', 'aria-hidden': 'true' }, [h('b'), h('span', { 'data-t': 'gm.combo' })]);
    const fb = h('div', { class: 'gm-fb', 'aria-live': 'polite' }), foot = h('div', { class: 'gm-foot' }, [fb]);
    const over = h('div', { class: 'gm-over', hidden: true }), dbg = h('div', { class: 'gm-dbg', hidden: !debugOn() });
    field.append(combo, dbg);
    root.append(hud, h('div', { class: 'gm-fieldw' }, [prog, field]), foot, over);
    document.body.append(root); document.documentElement.classList.add('gm-on');
    PD.i18n.apply(root);
    const m = G.machine(n => { root.dataset.state = n; });
    S.root = root; S.field = field; S.foot = foot; S.fbEl = fb; S.machine = m;
    Object.defineProperty(S, 'state', { get: () => m.state });
    S.now = () => PD.audio.now();
    S.lag = GA.lag(); S.off = GA.offset();
    S.songNow = () => S.clock.at(S.now() - S.lag);
    S.toSong = tt => S.clock.song(tt - S.lag - S.off);
    S.after = (ms, fn) => { const id = setTimeout(() => { S.timers.delete(id); if (S.alive) fn(); }, ms); S.timers.add(id); return id; };
    S.every = (ms, fn) => { const id = setInterval(() => { if (S.alive) fn(); }, ms); S.ivs.add(id); return id; };
    S.clear = () => { S.timers.forEach(clearTimeout); S.timers.clear(); S.ivs.forEach(clearInterval); S.ivs.clear(); };
    let lastScore = 0, fbT = 0;
    S.hud = {
      score(n) { if (n === lastScore) return; lastScore = n; scB.textContent = String(n); },
      combo(n) {
        const mx = G.mult(n); scS.innerHTML = n ? PD.esc(t('gm.combo') + ' ' + n) + (mx > 1 ? '<small class="mx">×' + mx + '</small>' : '') : '';
        combo.classList.toggle('on', n >= 5); combo.classList.toggle('big', n >= 25); combo.firstChild.textContent = String(n);
        if (n >= 5 && motionOK()) { combo.classList.remove('bump'); void combo.offsetWidth; combo.classList.add('bump'); }
      },
      progress(p) { prog.firstChild.style.width = (Math.max(0, Math.min(1, p)) * 100).toFixed(1) + '%'; },
      say(text, cls, ms) { fb.textContent = text || ''; fb.className = 'gm-fb' + (cls ? ' ' + cls : ''); clearTimeout(fbT); if (ms) fbT = setTimeout(() => { fb.textContent = ''; fb.className = 'gm-fb'; }, ms); },
      sub(text) { title.lastChild.textContent = text; }
    };
    /** a judgment word floating up from (x, y) in the field */
    S.pop = (kind, text, x, y) => {
      const r = field.getBoundingClientRect(), el = h('div', { class: 'gm-pop ' + kind, text, style: 'left:' + Math.round(x == null ? r.width / 2 : x) + 'px;top:' + Math.round(y == null ? r.height * .6 : y) + 'px' });
      field.append(el); setTimeout(() => el.remove(), motionOK() ? 720 : 450);
    };
    S.debug = obj => { if (dbg.hidden) return; dbg.textContent = Object.keys(obj).map(k => (t('gm.dbg.' + k) !== 'gm.dbg.' + k ? t('gm.dbg.' + k) : k) + ': ' + obj[k]).join('\n'); };
    S.finish = () => finish();
    /** practice: the next block at once (nothing is saved) */
    S.again = () => { if (!S.alive) return; if (m.state === 'playing') { S.clock.stop(S.now()); S.playMs += performance.now() - S.runAt; m.go('completed'); } restart(); };
    S.say = (k, v, cls, ms) => S.hud.say(t(k, v), cls, ms);
    /** a game's own question before it starts (Band Jam's echo check): a panel of nodes on the overlay */
    S.panel = kids => showPanel(kids);
    S.exit = () => exit();

    // the microphone indicator follows the input level
    let lv = 0;
    const micDraw = () => { const on = PD.detector.active; mic.className = 'gm-micmini' + (on ? ' on' : S.dev ? '' : ' off'); };
    S.offs.push(GA.listen({
      level: e => { S.level = e.rms; lv = Math.max(lv * .72, e.rms); mic.style.setProperty('--lv', (1 + Math.min(.4, lv * 7)).toFixed(3)); },
      state: st2 => { micDraw(); if (!st2.on && !S.dev && (m.state === 'playing' || m.state === 'countdown')) doPause('gm.micLost'); },
      input: e => { if (m.state === 'playing') S.say(e.kind === 'clip' ? 'h.clip' : 'h.quiet', null, 'cu', 2200); },
      note: e => { if (m.state === 'playing' && S.mode && S.mode.onNote) S.mode.onNote(e); if (S.mode && S.mode.dbgNote) S.mode.dbgNote(e); },
      onset: e => { if (m.state === 'playing' && S.mode && S.mode.onOnset) S.mode.onOnset(e); },
      chord: e => { if (m.state === 'playing' && S.mode && S.mode.onChord) S.mode.onChord(e); }
    }));
    micDraw();

    // Back: during play it pauses; on the pause or result screen it leaves
    const onBack = () => { S.lid = 0; if (!S.alive) return; if (m.state === 'playing' || m.state === 'countdown') { doPause(); S.lid = PD.layers.push(onBack); } else exit({ back: true }); };
    S.lid = PD.layers.push(onBack);
    const vis = () => { if (document.hidden && (m.state === 'playing' || m.state === 'countdown')) doPause('gm.hidden'); };
    document.addEventListener('visibilitychange', vis);
    const key = e => {
      if (!S.alive || document.querySelector('.sheet-back:not(.out)')) return;
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') { e.preventDefault(); e.stopPropagation(); if (m.state === 'playing' || m.state === 'countdown') doPause(); else if (m.state === 'paused') resume(); }
      else if ((e.key === ' ' || e.key === 'Enter') && m.state === 'paused' && document.activeElement === document.body) { e.preventDefault(); resume(); }
    };
    document.addEventListener('keydown', key, true);
    // somewhere else was opened (a notification, a link): leave. A re-render of the games page itself is not leaving
    const r0 = PD.app ? PD.app.route : 'games';
    const unRoute = PD.bus.on('route', r => { if (r !== r0) exit({ routed: true }); });
    pause.onclick = () => { if (m.state === 'playing' || m.state === 'countdown') doPause(); else if (m.state === 'paused') resume(); };

    /* ---------- the flow: preparing → (calibrating) → countdown → playing ⇄ paused → completed | failed → exiting ---------- */
    let cdTimer = 0, cdRun = 0;
    async function prepare() {
      if (!m.go('preparing')) return;
      const prepT = h('small', { text: t('gm.prep') });
      S.status = txt => { prepT.textContent = txt; };
      S.showPrep = () => showOver(h('div', { class: 'gm-cdw' }, [h('div', { class: 'gm-micdot on', style: 'width:64px;height:64px;border-radius:32px', html: MIC }), prepT]));
      S.showPrep();
      S.sc = G.scorer(); S.clock = G.clock(); S.playMs = 0;
      if (S.mode && S.mode.destroy) try { S.mode.destroy(); } catch (e) { console.error(e); }
      field.querySelectorAll('canvas, .gm-mode').forEach(x => x.remove());
      S.hud.score(0); S.hud.combo(0); S.hud.progress(0); S.hud.say('');
      const needMic = M.mic !== false && !S.opts.listen;   // Song Quest's Listen only plays
      if (needMic && !PD.detector.active) {
        const r = await GA.acquire(); if (!S.alive) return;
        if (!r.ok && !S.dev) return micFail(r.err);
      }
      micDraw();
      if (needMic && !PD.detector.calib.date && !STORE.get('gm.calAsked', false) && !S.dev) {
        STORE.set('gm.calAsked', true);
        if (await askCal() === false) return;
      }
      S.mode = M.create(S);
      if (S.mode.mount) S.mode.mount();
      if (S.mode.prepare) { const ok = await S.mode.prepare(); if (!S.alive) return; if (ok === false) return; }
      countdown(0);
    }
    function askCal() {
      return new Promise(res => {
        if (!m.go('calibrating')) return res(true);
        showPanel([h('h2', { 'data-t': 'gm.cal' }), h('p', { 'data-t': 'gm.calAsk' }),
          h('button', { class: 'btn primary', type: 'button', 'data-t': 'gm.calNow', onclick: () => { over.hidden = true; PD.calib.open(() => { if (!S.alive) return res(false); m.go('preparing'); res(true); }, { keep: true }); } }),
          h('button', { class: 'btn', type: 'button', 'data-t': 'gm.calSkip', onclick: () => { m.go('preparing'); res(true); } })]);
      });
    }
    function micFail(err) {
      showPanel([h('h2', { 'data-t': 'gm.mic' }), h('p', { text: micErr(err) }), h('p', { 'data-t': 'gm.micNeed' }),
        h('div', { class: 'gm-btns' }, [h('button', { class: 'btn primary', type: 'button', 'data-t': 'gm.retry', onclick: () => { m.go('idle'); prepare(); } }), h('button', { class: 'btn', type: 'button', 'data-t': 'gm.exit', onclick: () => exit() })]),
        // without a microphone only a preview is possible: the app plays, nothing is scored or saved
        M.preview ? h('button', { class: 'btn quiet wide', type: 'button', html: ic.play + '<span>' + PD.esc(t('gm.preview')) + '</span>', onclick: () => { const o2 = Object.assign({}, o, { opts: Object.assign({}, o.opts, { listen: true }) }); exit({ norender: true }); play(gid, o2); } }) : null]);
      m.go('idle');
    }
    /** 3 · 2 · 1, then the song runs from song time `from` (a game with its own count-in starts at once) */
    function countdown(from) {
      if (!m.go('countdown')) return;
      const run = ++cdRun;
      if (S.mode.countIn && from === 0) { over.hidden = true; startRun(0); return; }   // its own count-in is part of the chart
      let n = 3;
      const tick = () => {
        if (run !== cdRun || m.state !== 'countdown') return;
        if (n === 0) { over.hidden = true; startRun(from); return; }
        showOver(h('div', { class: 'gm-cdw' }, [h('div', { class: 'gm-cd', text: String(n) }), h('small', { text: from ? t('gm.resume') : t('gm.ready') })]), true);
        n--; cdTimer = setTimeout(tick, 900);
      };
      tick();
    }
    function startRun(from) {
      S.clock.run(from, S.now()); S.runAt = performance.now();
      m.go('playing');
      if (from === 0 && S.mode.start) S.mode.start(); else if (S.mode.resume) S.mode.resume();
      if (!S.raf) S.raf = requestAnimationFrame(frame);
      if (!S.sched && S.mode.schedule) S.sched = S.every(25, () => { if (m.state === 'playing') S.mode.schedule(S.now() + .14); });
    }
    let fpsN = 0, fpsT = performance.now(), fps = 0;
    function frame(ts) {
      S.raf = 0; if (!S.alive) return;
      if (m.state === 'playing' || m.state === 'countdown' || m.state === 'paused') {
        const st2 = S.clock && S.clock.running ? S.songNow() : (S.clock ? S.clock.at(S.now()) : 0);
        try { if (S.mode && S.mode.frame) S.mode.frame(st2, m.state); } catch (e) { console.error(e); }
        if (m.state === 'playing' && S.mode && S.mode.done && S.mode.done(st2)) { finish(); return; }
        fpsN++; if (ts - fpsT > 1000) { fps = Math.round(fpsN * 1000 / (ts - fpsT)); fpsN = 0; fpsT = ts; }
        if (!dbg.hidden && S.mode && S.mode.dbg) S.debug(Object.assign({ state: m.state + ' · ' + fps + ' fps', lat: 'in ' + GA.info().inMs + ' · out ' + Math.round(S.lag * 1000) + ' · off ' + Math.round(S.off * 1000) + ' ms' }, S.mode.dbg()));
        S.raf = requestAnimationFrame(frame);
      }
    }
    function doPause(reason) {
      if (m.state !== 'playing' && m.state !== 'countdown') return;
      const wasCd = m.state === 'countdown'; cdRun++; clearTimeout(cdTimer);
      if (!wasCd || S.clock.running) { S.clock.stop(S.now()); S.playMs += performance.now() - S.runAt; }
      m.go('paused');
      if (S.mode && S.mode.pause) S.mode.pause();
      S.reason = reason || '';
      showPanel([h('h2', { 'data-t': 'gm.paused' }), reason ? h('p', { text: t(reason) }) : null,
        h('button', { class: 'btn primary', type: 'button', 'data-t': 'gm.resume', onclick: () => resume() }),
        h('div', { class: 'gm-btns' }, [h('button', { class: 'btn', type: 'button', 'data-t': 'gm.restart', onclick: () => restart() }), h('button', { class: 'btn', type: 'button', 'data-t': 'gm.setShort', onclick: () => settings() })]),
        S.mode && S.mode.endless ? h('button', { class: 'btn', type: 'button', 'data-t': 'gm.rb.finish', onclick: () => finish() }) : null,
        h('button', { class: 'btn quiet', type: 'button', 'data-t': 'gm.exit', onclick: () => exit() })]);
    }
    async function resume() {
      if (m.state !== 'paused') return;
      if (M.mic !== false && !PD.detector.active && !S.dev) { const r = await GA.acquire(); if (!S.alive) return; if (!r.ok) { PD.ui.toast(micErr(r.err), 4200); return; } }
      S.lag = GA.lag(); S.off = GA.offset(); dbg.hidden = !debugOn();
      countdown(S.clock.at(S.now()));
    }
    /** the same level again, on the same stage (paused, completed and failed may all go back to preparing) */
    function restart() { if (!m.can('preparing')) return; cleanupRound(); prepare(); }
    function cleanupRound() {
      cdRun++; clearTimeout(cdTimer); S.clear(); S.sched = 0;
      if (S.raf) cancelAnimationFrame(S.raf); S.raf = 0;
      if (S.mode && S.mode.destroy) try { S.mode.destroy(); } catch (e) { console.error(e); }
      S.mode = null;
    }
    function finish() {
      if (m.state !== 'playing' && m.state !== 'paused') return;
      if (m.state === 'playing') { S.clock.stop(S.now()); S.playMs += performance.now() - S.runAt; }
      const extra = S.mode.result ? S.mode.result() : {};
      const r = Object.assign(G.result(S.sc.s, extra.total != null ? extra.total : (S.mode.total || 0), S.D), extra);
      if (extra.acc !== undefined) r.acc = extra.acc;
      if (extra.stars !== undefined) r.stars = extra.stars;
      r.passed = r.stars >= 1;
      m.go(r.passed || r.lowHeard || S.mode.practice ? 'completed' : 'failed');
      if (S.raf) cancelAnimationFrame(S.raf); S.raf = 0; S.clear(); S.sched = 0;
      if (S.mode.pause) S.mode.pause();
      const prev = P.rec(S.g, S.l, S.d);   // before this round was saved
      const saved = S.dev || S.mode.practice ? null : save(S, r);
      results(r, saved, prev);
    }
    /** one sentence of advice from what this round measured (never made up: each rule reads a number) */
    function advice(r) {
      if (S.mode.practice && r.grid === false && !r.total) return null;
      const late = r.meanOff, sd = r.sdOff, judged = r.judged || 0;
      if (r.unsure >= 3 && r.unsure >= (r.total || 1) * .2) return t('gm.tip.unsure', { n: r.unsure });
      if (S.g !== 'rhythm' && S.g !== 'band' && r.wrong >= 2) return t('gm.tip.wrong', { n: r.wrong });
      if (late != null && late > .035) return t('gm.tip.late', { ms: Math.round(late * 1000) });
      if (late != null && late < -.035) return t('gm.tip.early', { ms: Math.round(-late * 1000) });
      if (r.accentAcc != null && r.accentN >= 6 && r.accentAcc < .7) return t('gm.tip.accents', { p: Math.round(r.accentAcc * 100) + '%' });
      if (sd != null && sd > .045 && (S.g === 'rhythm' || S.g === 'band')) return t('gm.tip.unsteady', { ms: Math.round(sd * 1000) });
      if (r.miss >= 3 && judged && r.miss / judged > .25) return t('gm.tip.missed', { n: r.miss });
      if (r.acc != null && r.acc >= .9 && G.DIFFS.indexOf(S.d) >= 0 && S.d !== 'expert') return t('gm.tip.great');
      return null;
    }
    function results(r, sv, prev) {
      const lowT = r.lowHeard;
      const head = S.mode.practice ? t('gm.res.end') : lowT ? t('gm.res.end') : r.passed ? t('gm.res.done') : t('gm.res.fail');
      const score = h('div', { class: 'gm-rscore gm-n', text: String(r.score || 0) });
      const kids = [S.mode.practice || S.dev ? null : h('div', { class: 'gm-rstars', html: stars(r.stars || 0) }), h('h2', { text: head })];
      if (sv && sv.record && !lowT) kids.push(h('div', { class: 'gm-chips' }, [h('span', { class: 'gm-tag', text: '🏆 ' + t('gm.record') })]));
      kids.push(score);
      if (lowT) kids.push(h('p', { text: t('gm.res.low') }), h('p', { class: 'gm-rnote', text: t('gm.res.lowD') }));
      if (r.grid !== false) kids.push(h('div', { class: 'gm-rgrid' }, [['p', 'perfect'], ['g', 'great'], ['o', 'good'], ['m', 'miss']].map(([c, k]) => h('div', { class: c }, [h('b', { class: 'gm-n', text: String(r[k] || 0) }), h('small', { 'data-t': 'gm.j.' + k })]))));
      const rows = r.acc == null && r.grid === false ? [] : [[t('gm.acc'), pct(r.acc)], [t('gm.maxCombo'), String(r.maxCombo || 0)]];
      if (r.grid !== false) {   // the timeline games: pitch and timing apart, the average offset, steadiness, accents
        if (r.pitchAcc != null && S.g !== 'rhythm' && S.g !== 'band') rows.push([t('gm.pitchAcc'), pct(r.pitchAcc)]);
        if (r.timing != null) rows.push([t('gm.timingAcc'), pct(r.timing)]);
        if (r.meanOff != null && Math.abs(r.meanOff) > .012) rows.push([t('gm.offMean', { ms: Math.round(Math.abs(r.meanOff) * 1000), dir: t(r.meanOff < 0 ? 'gm.offEarly' : 'gm.offLate') }), '']);
        if (r.sdOff != null && (S.g === 'rhythm' || S.g === 'band')) rows.push([t('gm.steady', { ms: Math.round(r.sdOff * 1000) }), '']);
        if (r.accentAcc != null) rows.push([t('gm.accentAcc'), pct(r.accentAcc)]);
      }
      (r.rows || []).forEach(x => rows.push(x));
      kids.push(h('div', { class: 'gm-rrows' }, rows.map(([a, b]) => h('div', {}, [h('span', { text: a }), h('b', { class: 'gm-n', text: b })]))));
      const notes = [];
      if (r.unsure) notes.push(t('gm.unsureN', { n: r.unsure }));
      if (r.extra && (S.g === 'rhythm' || S.g === 'band')) notes.push(t('gm.extraN', { n: r.extra }));
      if (notes.length) kids.push(h('p', { class: 'gm-rnote', text: notes.join(' · ') }));
      if (S.dev) kids.push(h('p', { class: 'gm-rnote', text: t('gm.testMode') }));
      else if (S.mode.practice) kids.push(h('p', { class: 'gm-rnote', text: t('gm.practiceNo') }));
      if (!S.dev && !S.mode.practice && prev && prev.best) kids.push(h('p', { class: 'gm-rnote', text: sv && sv.record ? t('gm.pbNew', { s: prev.best }) : t('gm.pb', { s: prev.best }) }));
      const tip = lowT ? null : advice(r); if (tip) kids.push(h('p', { class: 'gm-rnote', style: 'color:var(--gm-tx);border-left:3px solid var(--gm-cu);padding-left:10px', text: tip }));
      if (sv) {
        kids.push(h('div', { class: 'gm-chips' }, [h('span', { class: 'gm-tag', title: t('gm.xpD', { a: sv.xpParts[0], b: sv.xpParts[1], c: sv.xpParts[2] }), text: t('gm.xp', { n: sv.xp }) }),
          sv.daily ? h('span', { class: 'gm-tag', text: '✓ ' + t('gm.dailyMet') }) : null, ...sv.ach.map(a => h('span', { class: 'gm-tag', text: '★ ' + t('gm.a.' + a) }))]));
      }
      const nextL = M.nextOf ? M.nextOf(S, r) : null, btns = [];
      if (S.opts.listen) btns.push(h('button', { class: 'btn primary wide', type: 'button', html: ic.play + '<span>' + PD.esc(t('gm.start')) + '</span>', onclick: () => { const o2 = Object.assign({}, o, { opts: Object.assign({}, o.opts, { listen: false }) }); exit({ norender: true }); play(gid, o2); } }));
      if (nextL && r.passed) btns.push(h('button', { class: 'btn primary wide', type: 'button', 'data-t': 'gm.next', onclick: () => { const o2 = Object.assign({}, o, nextL, { arena: null }); exit({ norender: true }); PD.app.go('games', gid + ':' + o2.l + ':' + o2.d, true); play(gid, o2); } }));
      btns.push(h('button', { class: 'btn' + ((nextL && r.passed) || S.opts.listen ? '' : ' primary'), type: 'button', 'data-t': S.opts.listen ? 'gm.sq.listen' : 'gm.retry', onclick: () => restart() }));
      btns.push(h('button', { class: 'btn', type: 'button', 'data-t': 'gm.toHub', onclick: () => { exit({ norender: true }); PD.app.go('games'); } }));
      if (sv && (S.g === 'rush' || S.g === 'rhythm') && !lowT && S.mode.seed != null) btns.push(h('button', { class: 'btn quiet wide', type: 'button', 'data-t': 'gm.challenge', onclick: () => shareChallenge(S, r) }));
      if (S.o.arena) kids.push(arenaCompare(S.o.arena, r));
      kids.push(h('div', { class: 'gm-btns' }, btns));
      showPanel(kids);
      PD.ui.countUp(score, 900);
      if (r.passed && !lowT && !S.mode.practice && PD.fx) PD.fx.celebrate({ n: r.stars >= 3 ? 70 : 40 });
      else if (PD.fx) PD.fx.feedback(r.passed ? 'success' : 'error');
    }
    function showOver(node, keep) { over.hidden = false; over.innerHTML = ''; over.append(node); if (!keep) PD.i18n.apply(over); }
    function showPanel(kids) { over.hidden = false; over.innerHTML = ''; const p = h('div', { class: 'gm-panel', role: 'group' }, kids.filter(Boolean)); over.append(p); PD.i18n.apply(over); const b = p.querySelector('.btn.primary') || p.querySelector('.btn'); if (b) setTimeout(() => { try { b.focus({ preventScroll: true }); } catch (_) {} }, 60); }
    /** leave the stage: o.back — Back already took the history entry; o.routed — the page changed underneath; o.norender — another round follows at once */
    function exit(x) {
      x = x || {};
      if (!S.alive) return; S.alive = false;
      m.go('exiting');
      cleanupRound();
      S.offs.splice(0).forEach(f => f()); unRoute();
      document.removeEventListener('visibilitychange', vis); document.removeEventListener('keydown', key, true);
      GA.release();
      if (S.lid && !x.back) PD.layers.done(S.lid); S.lid = 0;
      document.documentElement.classList.remove('gm-on');
      if (motionOK()) { root.classList.add('out'); setTimeout(() => root.remove(), 230); } else root.remove();
      if (cur === api) cur = null;
      if (!x.routed && !x.norender && PD.app && PD.app.route === 'games') setTimeout(() => { if (!cur) PD.app.render(); }, 30);
    }
    const api = { S, exit, pause: doPause, resume, get state() { return m.state; } };
    cur = api;
    prepare();
    return api;
  }

  /* ---------- Arena ---------- */
  function shareChallenge(S, r) {
    const code = G.encodeChallenge({ g: S.g, l: S.l, d: S.d, seed: S.mode.seed, score: r.score, acc: r.acc, pitchAcc: r.pitchAcc, timing: r.timing, mistakes: r.miss || 0, maxCombo: r.maxCombo, name: (PD.account.profile.name || '').trim().split(/\s+/)[0], date: Date.now() });
    const url = location.origin + location.pathname + '?go=' + encodeURIComponent('games:arena:' + code), text = t('gm.ar.shareT', { g: gName(S.g), s: r.score });
    PD.ui.sheet((box, close) => {
      style(); box.classList.add('gm');
      const ta = h('textarea', { class: 'input', readonly: true, rows: 3, style: 'width:100%;font-family:var(--f-mono);font-size:12px', 'aria-label': t('gm.ar.codeT') }); ta.value = code;
      box.append(h('h2', { 'data-t': 'gm.challenge' }), h('p', { class: 'fg2', text }), h('label', { class: 'gm-k', 'data-t': 'gm.ar.codeT' }), ta, h('p', { class: 'muted', 'data-t': 'gm.ar.honest' }),
        h('div', { class: 'row' }, [h('button', { class: 'btn', type: 'button', 'data-t': 'gm.ar.copy', onclick: async () => { try { await navigator.clipboard.writeText(code); PD.ui.toast(t('gm.ar.copied')); } catch (_) { ta.select(); } } }), h('span', { class: 'spacer' }),
          navigator.share ? h('button', { class: 'btn primary', type: 'button', 'data-t': 'gm.ar.share', onclick: () => navigator.share({ title: t('app.name'), text, url }).catch(() => {}) }) : h('button', { class: 'btn primary', type: 'button', 'data-t': 'cb.finish', onclick: () => close() })]));
    });
  }
  function arenaCompare(them, r) {
    const me = { score: r.score, acc: r.acc, pitchAcc: r.pitchAcc, timing: r.timing, mistakes: r.miss || 0, maxCombo: r.maxCombo }, c = G.compare(me, them);
    const fmt = (k, v) => v == null ? '—' : ['acc', 'pitchAcc', 'timing'].includes(k) ? pct(v) : String(v);
    const lab = { score: 'gm.score', acc: 'gm.acc', pitchAcc: 'gm.pitchAcc', timing: 'gm.timingAcc', mistakes: 'gm.mistakes', maxCombo: 'gm.maxCombo' };
    return h('div', { class: 'gm-card gm-sec', style: 'text-align:left' }, [h('b', { text: t(c.win > 0 ? 'gm.ar.win' : c.win < 0 ? 'gm.ar.lose' : 'gm.ar.tie') }),
      h('div', { class: 'gm-rrows' }, [h('div', {}, [h('span'), h('b', { text: t('gm.ar.you') + ' · ' + (them.name || t('gm.ar.them')) })])].concat(c.rows.map(x => h('div', {}, [h('span', { text: t(lab[x.k]) }), h('b', { class: 'gm-n', style: x.win > 0 ? 'color:var(--gm-ok)' : x.win < 0 ? 'color:var(--gm-tx2)' : '', text: fmt(x.k, x.a) + ' · ' + fmt(x.k, x.b) })])))),
      h('p', { class: 'gm-rnote', 'data-t': 'gm.ar.honest' })]);
  }
  function arena(w, code) {
    w.classList.add('gm', 'gm-pre');
    w.append(h('div', { class: 'pg-top' }, [h('button', { class: 'btn small backbtn', type: 'button', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('games') }), h('h1', { 'data-t': 'gm.g.arena' })]));
    w.append(h('section', { class: 'gm-card gm-hero' }, [h('div', { class: 'gm-art', html: ART.arena() }), h('div', { class: 'gm-hero-b' }, [h('p', { 'data-t': 'gm.ar.lead' }), h('p', { class: 'gm-note', 'data-t': 'gm.ar.live' })])]));
    if (code) STORE.set('gm.pending', code);
    const ch = code ? G.decodeChallenge(code) : null;
    if (ch) {
      STORE.del('gm.pending');
      const nm = ch.name || t('gm.ar.anon'), task = gName(ch.g) + ' · ' + lvName(ch.g, ch.l) + ' · ' + dName(ch.g, ch.d), old = ch.g === 'rush' && (ch.cv || 1) !== G.CHART_V, mine = P.rec(ch.g, ch.l, ch.d);
      w.append(h('section', { class: 'gm-card gm-sec' }, [h('span', { class: 'gm-k', text: t('gm.ar.from', { n: nm }) }), h('h2', { text: task }),
        h('div', { class: 'gm-rrows' }, [[t('gm.score'), String(ch.score)], [t('gm.acc'), pct(ch.acc)], [t('gm.pitchAcc'), pct(ch.pitchAcc)], [t('gm.timingAcc'), pct(ch.timing)], [t('gm.mistakes'), String(ch.mistakes)], [t('gm.maxCombo'), String(ch.maxCombo)]].map(([a, b]) => h('div', {}, [h('span', { text: a }), h('b', { class: 'gm-n', text: b })]))),
        h('p', { class: 'gm-note', text: mine ? t('gm.ar.pbYou', { s: mine.best }) + ' · ' + pct(mine.acc) : t('gm.ar.pbNone') }),
        h('p', { class: 'gm-note', 'data-t': 'gm.ar.honest' }),
        old ? h('p', { class: 'notice', 'data-t': 'gm.ar.old' }) : h('button', { class: 'btn primary big', type: 'button', html: ic.play + '<span>' + PD.esc(t('gm.ar.play')) + '</span>', onclick: () => { PD.audio.ensure(); play(ch.g, { l: ch.l, d: ch.d, opts: { seed: ch.seed }, arena: ch }); } })]));
    } else if (code) w.append(h('p', { class: 'notice', 'data-t': 'gm.ar.bad' }));
    const inp = h('textarea', { class: 'input', rows: 3, style: 'width:100%;font-family:var(--f-mono);font-size:12px', placeholder: t('gm.ar.paste'), 'aria-label': t('gm.ar.paste') });
    w.append(h('section', { class: 'gm-card gm-sec' }, [h('h2', { 'data-t': 'gm.ar.accept' }), inp, h('button', { class: 'btn', type: 'button', 'data-t': 'gm.ar.open', onclick: () => { const c = G.decodeChallenge(inp.value); if (!c) { PD.ui.toast(t('gm.ar.bad'), 3500); return; } PD.app.go('games', 'arena:' + String(inp.value).trim().replace(/^.*[#?&]gmc=/, '').replace(/^.*arena%3A|^.*arena:/, '')); } })]),
      h('section', { class: 'gm-card gm-sec' }, [h('h2', { 'data-t': 'gm.ar.create' }), h('p', { class: 'gm-note', 'data-t': 'gm.ar.createD' }), h('div', { class: 'gm-acts' }, [h('button', { class: 'btn small', type: 'button', 'data-t': 'gm.g.rush', onclick: () => PD.app.go('games', 'rush') }), h('button', { class: 'btn small', type: 'button', 'data-t': 'gm.g.rhythm', onclick: () => PD.app.go('games', 'rhythm') })])]));
  }

  /* ---------- app hooks ---------- */
  /** route 'games', param: null (hub) · '<game>' · '<game>:<level>:<difficulty>' · 'arena:<code>' */
  function route(r, w, param) {
    if (r !== 'games') return false;
    style(); document.documentElement.dataset.col = 'wide';
    const p = param == null ? '' : String(param), [g, ...rest] = p.split(':');
    if (!g) hub(w);
    else if (g === 'arena') arena(w, rest.join(':'));
    else if (ORDER.includes(g)) {
      const def = G.GAMES.find(x => x.id === g), last = P.hist().list.filter(x => x.g === g).slice(-1)[0];
      const l = rest[0] != null && rest[0] !== '' ? (isNaN(+rest[0]) ? rest[0] : +rest[0]) : last ? last.l : (g === 'rhythm' ? 'kazbeguri' : g === 'song' ? null : 1);
      const d = rest[1] || (last ? last.d : def.diffs[g === 'rush' ? 1 : 0]);
      pre(w, g, { l, d });
    } else hub(w);
    return true;
  }
  const NAV_O = '<path d="M7.2 8.6h9.6a4.4 4.4 0 0 1 4.3 5.3l-.8 3.7a2.3 2.3 0 0 1-4 1L14.7 17H9.3l-1.6 1.6a2.3 2.3 0 0 1-4-1l-.8-3.7a4.4 4.4 0 0 1 4.3-5.3z"/><path d="M8 11.6v3M6.5 13.1h3"/><circle cx="15.6" cy="12.4" r=".6" fill="currentColor"/><circle cx="17.4" cy="14.2" r=".6" fill="currentColor"/>';
  const NAV_F = '<path fill="currentColor" d="M7.2 7.8h9.6a5.2 5.2 0 0 1 5.1 6.3l-.8 3.7a3.1 3.1 0 0 1-5.3 1.4l-1.3-1.4H9.5l-1.3 1.4a3.1 3.1 0 0 1-5.3-1.4l-.8-3.7a5.2 5.2 0 0 1 5.1-6.3z"/><path d="M8 11.6v3M6.5 13.1h3" stroke="#08090B" stroke-width="1.6" stroke-linecap="round"/><circle cx="15.6" cy="12.4" r=".9" fill="#08090B"/><circle cx="17.4" cy="14.2" r=".9" fill="#08090B"/>';
  const ICON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + NAV_O + '</svg>';
  /** the Home banner (app.js places it under the quick tools) */
  function homeCard() {
    style();
    const pend = STORE.get('gm.pending', null), st = P.stats(), last = P.hist().list.slice(-1)[0], ch = P.dailyCh(), done = P.dailyDone();
    const lp = PD.levels ? PD.levels.progress : null, lastOk = last && PD.gameModes && PD.gameModes[last.g];
    const main = h('button', { class: 'gm-cont gm-hm-main', type: 'button', onclick: () => PD.app.go('games', pend && G.decodeChallenge(pend) ? 'arena:' + pend : null) }, [h('span', { class: 'gm-art', html: ART[lastOk ? last.g : 'rush']() }),
      h('span', {}, [h('span', { class: 'gm-k', 'data-t': 'gm.title' }), h('b', { text: pend ? t('gm.ar.pending') : t('gm.homeT') }),
        h('small', { text: lp ? t('gm.lvl', { n: lp.level }) + ' · ' + t('gm.xpOf', { a: lp.into, b: lp.need }) + (st.stars ? ' · ★ ' + st.stars : '') : t('gm.homeD') })])]);
    // two ways straight into a round: the last level played (or the first one) and today's challenge
    const cont = lastOk ? h('button', { class: 'gm-hm-b', type: 'button', onclick: () => PD.app.go('games', last.g + ':' + last.l + ':' + last.d) }, [h('span', { class: 'gm-k', 'data-t': 'gm.hm.cont' }), h('b', { text: gName(last.g) + ' · ' + lvName(last.g, last.l) })])
      : h('button', { class: 'gm-hm-b', type: 'button', onclick: () => PD.app.go('games', 'rush:1:easy') }, [h('span', { class: 'gm-k', 'data-t': 'gm.hm.cont' }), h('b', { 'data-t': 'gm.hm.first' })]);
    const daily = h('button', { class: 'gm-hm-b' + (done ? ' done' : ''), type: 'button', onclick: () => PD.app.go('games', ch.g + ':' + ch.l + ':' + ch.d) }, [h('span', { class: 'gm-k', 'data-t': 'gm.hm.daily' }), h('b', { text: (done ? '✓ ' : '') + gName(ch.g) + ' · ' + goalText(ch.goal) })]);
    return h('section', { class: 'gm gm-card gm-hm', style: 'margin:0', 'aria-label': t('gm.homeT') }, [main, h('div', { class: 'gm-hm-row' }, [cont, daily])]);
  }
  /* ---------- the first visit: three short steps, any of them skippable ---------- */
  function intro(onDone) {
    PD.ui.sheet((box, close) => {
      style(); box.classList.add('gm', 'gm-intro');
      let k = 0; const N = 3, body = h('div'), dots = h('div', { class: 'gm-in-dots', 'aria-hidden': 'true' });
      const end = () => { STORE.set('gm.intro', Date.now()); close(); };
      const next = h('button', { class: 'btn primary', type: 'button' }), skip = h('button', { class: 'btn quiet', type: 'button', 'data-t': 'gm.in.skip', onclick: end });
      const draw = () => {
        body.innerHTML = ''; body.append(h('div', { class: 'gm-art', html: ART[['rush', 'hunt', 'arena'][k]]() }), h('span', { class: 'gm-k', text: t('gm.in.step', { a: k + 1, b: N }) }), h('h2', { 'data-t': 'gm.in.t' + (k + 1) }), h('p', { class: 'fg2', 'data-t': 'gm.in.d' + (k + 1) }));
        dots.innerHTML = ''; for (let i = 0; i < N; i++) dots.append(h('i', { class: i === k ? 'on' : '' }));
        next.textContent = t(k < N - 1 ? 'gm.in.next' : 'gm.in.go'); PD.i18n.apply(body);
      };
      next.onclick = () => { if (k < N - 1) { k++; draw(); } else end(); };
      box.append(body, dots, h('div', { class: 'row' }, [skip, h('span', { class: 'spacer' }), next]));
      draw();
      return () => { if (!STORE.get('gm.intro', 0)) STORE.set('gm.intro', Date.now()); if (onDone) onDone(); };
    });
  }

  return {
    route, hub, play, homeCard, intro, sessionName, settings, tuneCheck, offsetSheet, P, ART, style,
    nav: NI => ['games', 'gm.title', NI(NAV_O, NAV_F), 'wide'],
    top: { games: 'games' }, dock: { games: 'home' },
    hubItem: ['games', ICON, 'gm.title', 'gm.hubD'],
    get current() { return cur; }
  };
})();
