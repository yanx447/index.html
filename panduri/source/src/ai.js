/* =====================================================================
   AI studio — "load your own song".
   · Chords, key and tempo: analysed on the device in a second or two
     (chroma from the spectrum, 24 major/minor templates, Viterbi
     smoothing; key by Krumhansl profiles; tempo from onset autocorrelation).
     Every chord is shown on the panduri neck with the app's chord library.
     These are estimates and say so.
   · Playback: any speed 50–125 % without changing the pitch.
   · Instruments (premium): the Demucs v4 AI model (Meta, MIT) runs on the
     device in a worker (aiworker.js) and splits the song into vocals,
     drums, bass and the rest; each gets its own volume, mute and solo,
     and can be saved as a WAV file. Nothing is uploaded anywhere.
   ===================================================================== */
PD.i18n.add({
  'ai.title': ['AI სტუდია', 'AI studio'], 'ai.lead': ['ჩატვირთე შენი სიმღერა: AI ამოიცნობს აკორდებს, ტონალობას და ტემპს, ფანდურზე გაჩვენებს თითებს და ინსტრუმენტებად დაყოფს. ყველაფერი შენს მოწყობილობაზე ხდება — არსად იგზავნება.', 'Load your own song: the AI finds the chords, key and tempo, shows them on the panduri and splits the song into instruments. Everything happens on your device — nothing is uploaded.'],
  'ai.pick': ['სიმღერის ჩატვირთვა', 'Load a song'], 'ai.pickD': ['MP3, M4A, WAV, ვიდეოც — ტელეფონიდან ან კომპიუტერიდან', 'MP3, M4A, WAV, even video — from your phone or computer'], 'ai.reading': ['ვკითხულობ ფაილს…', 'Reading the file…'], 'ai.analysing': ['AI უსმენს: აკორდები, ტონალობა, ტემპი…', 'The AI is listening: chords, key, tempo…'],
  'ai.bad': ['ამ ფაილს ვერ ვკითხულობ. სცადე MP3, M4A ან WAV.', 'Could not read this file. Try MP3, M4A or WAV.'], 'ai.key': ['ტონალობა', 'Key'], 'ai.bpm': ['ტემპი', 'Tempo'], 'ai.chords': ['აკორდები', 'Chords'], 'ai.speed': ['სიჩქარე', 'Speed'], 'ai.transpose': ['ტრანსპოზიცია', 'Transpose'],
  'ai.est': ['AI-ის შეფასებაა — ყურით შეამოწმე. საუკეთესოდ მუშაობს მკაფიო აკორდებიან სიმღერებზე.', 'An AI estimate — check it by ear. Works best on songs with clear chords.'],
  'ai.now': ['ახლა', 'Now'], 'ai.next': ['შემდეგი', 'Next'], 'ai.nc': ['აკორდი არ არის', 'No chord'], 'ai.used': ['სიმღერაში: {n} აკორდი', 'In the song: {n} chords'],
  'ai.stems': ['ინსტრუმენტები', 'Instruments'], 'ai.stemsD': ['AI სიმღერას ყოფს ინსტრუმენტებად: ვოკალი · დრამი · ბასი · დანარჩენი (ფანდური…), სურვილისამებრ გიტარა და ფორტეპიანოც. თითოეულს აქვს ხმა, მარცხნივ/მარჯვნივ, M (ჩუმად) და S (მხოლოდ ეს) — ამოიღე ვოკალი და იმღერე, ან ინსტრუმენტი და თავად დაუკარი.', 'The AI splits the song into instruments: vocals · drums · bass · the rest (panduri…), optionally guitar and piano too. Each has volume, left/right, M (mute) and S (solo) — take the vocals out and sing, or the instrument out and play it yourself.'],
  'ai.split': ['ინსტრუმენტებად დაყოფა', 'Split into instruments'], 'ai.splitNote': ['პირველად AI მოდელი ერთხელ ჩამოიტვირთება (4 ინსტრ. ~85 MB, 6 ინსტრ. ~55 MB). 4-წუთიანი სიმღერა კომპიუტერზე რამდენიმე წუთი მუშავდება, ტელეფონზე — უფრო დიდხანს; ამ დროს აპი არ დახურო.', 'The first time, the AI model downloads once (4 instr. ~85 MB, 6 instr. ~55 MB). A 4-minute song takes a few minutes on a computer, longer on a phone; keep the app open meanwhile.'],
  'ai.passOn': ['უფასო სესია · „{s}“ · დარჩა {left}', 'Free session · “{s}” · {left} left'],
  'ai.passBusy': ['ეს უფასო სესია „{s}“-სთვისაა (დარჩა {left}). სხვა სიმღერა დღეს ვერ გაიხსნება — პრემიუმში შეზღუდვა არ არის.', 'This free session is for “{s}” ({left} left). Another song cannot be opened today — Premium has no limit.'],
  'ai.passOut': ['დღევანდელი უფასო {n}-საათიანი სესია დასრულდა. ახალი სესია ხვალ — პრემიუმში შეზღუდვა საერთოდ არ არის.', "Today's free {n}-hour session is over. A new session tomorrow — Premium has no limit at all."],
  'ai.passH': ['{h} სთ {m} წთ', '{h} h {m} min'], 'ai.passHh': ['{h} საათი', '{h} h'], 'ai.passM': ['{m} წთ', '{m} min'],
  'ai.vidPm': ['ვიდეოს ანალიზი პრემიუმშია. აუდიო ფაილები (mp3, m4a, wav…) უფასოდ მუშაობს.', 'Video analysis is in Premium. Audio files (mp3, m4a, wav…) work for free.'],
  'ai.dayOut': ['უფასოდ დღეში {n} ახალი სიმღერაა — დღევანდელი ამოიწურა. უკვე გახსნილი სიმღერების ხელახლა გახსნა ყოველთვის უფასოა.', 'Free is {n} new songs a day — today is used up. Reopening a song you already analysed is always free.'],
  'ai.premium': ['პრემიუმი', 'Premium'], 'ai.test': ['სატესტო წვდომა', 'Test access'], 'ai.locked': ['ინსტრუმენტებად დაყოფა პრემიუმის ფუნქციაა.', 'Splitting into instruments is a Premium feature.'],
  'ai.dl': ['მოდელი იტვირთება: {a} / {b} MB', 'Downloading the model: {a} / {b} MB'], 'ai.unpack': ['მოდელი მზადდება…', 'Preparing the model…'], 'ai.init': ['AI ეშვება…', 'Starting the AI…'], 'ai.proc': ['AI ყოფს: {p}% · დარჩა ~{m}', 'The AI is splitting: {p}% · ~{m} left'],
  'ai.fail': ['AI ვერ გაეშვა: {e}', 'The AI could not run: {e}'], 'ai.mem': ['მოწყობილობას მეხსიერება არ ეყო. სცადე უფრო მოკლე ნაწილი ან კომპიუტერი.', 'The device ran out of memory. Try a shorter part or a computer.'],
  'ai.range': ['რომელი ნაწილი', 'Which part'], 'ai.all': ['მთელი სიმღერა', 'Whole song'], 'ai.first': ['პირველი {n} წმ', 'First {n} s'], 'ai.fromHere': ['აქედან {n} წმ', '{n} s from here'],
  'ai.vocals': ['ვოკალი', 'Vocals'], 'ai.drums': ['დრამი', 'Drums'], 'ai.bass': ['ბასი', 'Bass'], 'ai.other': ['დანარჩენი (ფანდური…)', 'The rest (panduri…)'], 'ai.mute': ['ჩუმად', 'Mute'], 'ai.solo': ['მხოლოდ ეს', 'Solo'], 'ai.save': ['WAV', 'WAV'],
  'ai.stemsOn': ['ისმის AI-ით დაყოფილი ვერსია', 'Playing the AI-split version'], 'ai.orig': ['ორიგინალი', 'Original'], 'ai.mixed': ['AI მიქსი', 'AI mix'], 'ai.speedStems': ['AI მიქსში სიჩქარე ცვლის ბგერის სიმაღლესაც.', 'In the AI mix, speed also changes the pitch.'],
  'ai.recent': ['ბოლოს გაანალიზებული', 'Recently analysed'], 'ai.fx': ['ეფექტები', 'Effects'], 'ai.fxOpen': ['EQ · რევერბი · ექო', 'EQ · reverb · echo'], 'ai.comp': ['კომპრესორი', 'Compressor'], 'ai.fxStems': ['AI მიქსში ეფექტები თითოეულ ინსტრუმენტს ცალკე აქვს — FX ღილაკი ინსტრუმენტის ხაზზე.', 'In the AI mix each instrument has its own effects — the FX button on its row.'],
  'ai.fxLow': ['დაბლები', 'Lows'], 'ai.fxMid': ['შუა', 'Mids'], 'ai.fxHigh': ['მაღლები', 'Highs'], 'ai.fxRev': ['რევერბი', 'Reverb'], 'ai.fxEcho': ['ექო', 'Echo'],
  'ai.fxP_clean': ['გასუფთავება', 'Clean'], 'ai.fxP_hall': ['დარბაზი', 'Hall'], 'ai.fxP_echo': ['ექო', 'Echo'], 'ai.fxP_warm': ['თბილი', 'Warm'], 'ai.fxP_bright': ['ნათელი', 'Bright'], 'ai.fxP_radio': ['ძველი რადიო', 'Old radio'], 'ai.beats': ['ვპოულობ დარტყმებს და ტაქტებს…', 'Finding beats and bars…'], 'ai.prep': ['მზადდება…', 'Preparing…'], 'ai.seek': ['პოზიცია', 'Position'],
  'ai.bpmSet': ['ტემპი ხელით', 'Set the tempo'], 'ai.bpmD': ['AI-ის გაზომვა: {n} BPM. შეცვალე და დარტყმები ამ ტემპზე თავიდან დაეწყობა — ჩანაწერის ატაკებზე მიბმული.', 'The AI measured {n} BPM. Change it and the beats are tracked again at that tempo, still locked onto the attacks in the recording.'],
  'ai.bpmApply': ['დაყენება', 'Apply'],
  'ai.slowRead': ['ამ ფორმატს ბრაუზერი პირდაპირ ვერ კითხულობს — ხმას დაკვრისას ვიღებ.', 'This browser cannot read this format directly — the sound is being taken as it plays.'],
  'ai.slowReadP': ['ხმას ვიღებ: {p}%  · დარჩა ~{m}', 'Taking the sound: {p}% · ~{m} left'],
  'ai.slowNote': ['ასეთი ფაილი ორჯერ უფრო სწრაფად იკითხება, ვიდრე ისმის. ერთხელ წავიკითხავ და შემდეგ ჩვეულებრივად იმუშავებს.', 'A file like this is read about twice as fast as it plays. It is read once, and then everything works as usual.'],
  'ai.noPlay': ['ამ ფაილს ეს ბრაუზერი საერთოდ ვერ უკრავს. სცადე MP4, WebM, MP3, M4A ან WAV.', 'This browser cannot play this file at all. Try MP4, WebM, MP3, M4A or WAV.'],
  'ai.rhy': ['რითმი', 'Rhythm'], 'ai.rhyD': ['ტაქტები ერთმანეთს ზემოდან დავადე და ვნახე, სად მეორდება დარტყმა. სიმაღლე გაზომილი ძალაა.', 'The bars were laid on top of each other to see where the strokes repeat. The height is the measured strength.'],
  'ai.rhyRun': ['რითმის ამოცნობა', 'Find the rhythm'], 'ai.rhyWait': ['რითმს ვზომავ…', 'Measuring the rhythm…'],
  'ai.rhyNone': ['ამ ჩანაწერში მეორადი რითმული ნახატი ვერ ვიპოვე — დარტყმები ძალიან თავისუფლად მიდის.', 'No repeating rhythmic pattern was found here — the strokes run too freely.'],
  'ai.rhySub': ['ქვედაყოფა', 'Subdivision'], 'ai.sub2': ['მერვედები', 'eighths'], 'ai.sub3': ['ტრიოლები', 'triplets'], 'ai.sub4': ['მეთექვსმეტედები', 'sixteenths'], 'ai.sub6': ['მერვედი ტრიოლები', 'eighth triplets'],
  'ai.rhyBars': ['გაზომილი ტაქტები', 'Bars measured'], 'ai.rhySpan': ['ნახატი ორ ტაქტზეა გაწერილი', 'The pattern runs over two bars'],
  'ai.and': ['და', 'and'], 'ai.rhyAcc': ['აქცენტი', 'accent'], 'ai.rhyHit': ['დარტყმა', 'stroke'], 'ai.rhyWeak': ['სუსტი', 'weak'],
  'ai.rhyDir': ['ქვემოთ/ზემოთ მიმართულება აუდიოდან არ ისმის — ეს შემოთავაზებაა ტაქტში პოზიციის მიხედვით, და არა გაზომილი.', 'Whether a stroke goes down or up cannot be heard — this is a suggestion from the position in the bar, not a measurement.'],
  'ai.geoIs': ['ეს რითმი ყველაზე ახლოსაა:', 'This rhythm is closest to:'],
  'ai.geoMaybe': ['შესაძლოა იყოს:', 'It may be:'],
  'ai.geoOpen': ['გახსნა', 'Open'],
  'ai.rhyPerc': ['დარტყმები', 'The strokes'], 'ai.rhyMix': ['მთლიანი ჩანაწერი', 'The whole recording'],
  'ai.rhyPercD': ['„დარტყმები“ იმავე ჩანაწერიდან გამოყოფს მხოლოდ დარტყმით ბგერას — მოდელის გარეშე, ჩამოტვირთვის გარეშე, ტელეფონზეც მუშაობს. ეს არ არის ინსტრუმენტებად დაყოფა: ეს იგივე ჩანაწერია, ოღონდ გაჭიმული ბგერა ჩაჩუმებული.', '“The strokes” pulls just the struck sound out of the same recording — no model, no download, works on a phone. It is not instrument separation: it is the same recording with the sustained part held back.'],
  'ai.rhyFrom': ['რას ვუსმენ', 'What I listen to'], 'ai.rhyAuto': ['ავტომატურად', 'Automatic'],
  'ai.rhyFromD': ['დარტყმები ყველაზე სუფთად იმ ინსტრუმენტზე ისმის, რომელიც მათ უკრავს. დაყოფის შემდეგ ვუსმენ „დანარჩენს“ და არა მთლიან მიქსს.', 'The strokes are clearest on the instrument that plays them. After a split I listen to “the rest” rather than the whole mix.'],
  'ai.rhySplitHint': ['მთლიან მიქსში ვოკალი და დრამი დარტყმებს ფარავს. „ინსტრუმენტების“ ტაბში დაყავი სიმღერა და რითმი გაცილებით ზუსტად წაიკითხება.', 'In a full mix the vocals and drums cover the strokes. Split the song in the Instruments tab and the rhythm reads far more accurately.'],
  'ai.cHi': ['დამთხვევა მაღალია', 'a strong match'], 'ai.cMid': ['დამთხვევა საშუალოა', 'a fair match'], 'ai.cLo': ['დამთხვევა სუსტია', 'a weak match'],
  'ai.geoPer': ['წაკითხულია როგორც თითო დარტყმა — თითო თვლა; გაზომილია {n} წრე.', 'Read as one stroke per beat; {n} cycles measured.'],
  'ai.geoIn1': ['წაკითხულია როგორც მთელი ნახატი ერთ თვლაში; გაზომილია {n} წრე.', 'Read as the whole pattern inside one beat; {n} cycles measured.'],
  'ai.geoIn2': ['წაკითხულია როგორც ნახატი ორ თვლაზე; გაზომილია {n} წრე.', 'Read as the pattern across two beats; {n} cycles measured.'],
  'ai.geoNo': ['ქართულ რითმებთან ახლო დამთხვევა ვერ ვიპოვე.', 'No close match with the Georgian rhythms was found.'],
  'ai.geoD': ['ვადარებ იმ ოთხ რითმს, რომელიც მასწავლებელმა მოგვცა: ყაზბეგური, მთიულური, ხორუმი, აჭარული. ნარნარი, ოსური და დანარჩენები ჯერ არ გვაქვს — როგორც კი მათი დარტყმები შემოვა, AI მათაც იცნობს.', 'Compared with the four rhythms the teacher gave: Kazbeguri, Mtiuluri, Khorumi, Acharuli. Narnari, Osuri and the others are not in the app yet — as soon as their strokes are added, the AI will know them too.'],
  'ai.rhyNoStems': ['ინსტრუმენტების დაყოფა ამისთვის საჭირო არ არის — AI უსმენს მთლიან ჩანაწერში დრამისა და დოლის დარტყმებს.', 'No instrument separation is needed for this — the AI listens to the drum and doli strokes in the whole recording.'],
  'ai.rhyLike': ['რას ჰგავს', 'What it resembles'], 'ai.rhyLikeD': ['აპში არსებულ რითმებს ვადარებ: რამდენად ემთხვევა დარტყმები და აქცენტები ერთ თვლაში. ეს შედარებაა და არა დასკვნა.', 'Compared with the rhythms already in the app: how well the strokes and accents line up inside one beat. This is a comparison, not a verdict.'],
  'ai.rhyNoLike': ['ახლო მსგავსება ვერ ვიპოვე.', 'No close resemblance was found.'],
  'ai.rhyPlay': ['მოსმენა', 'Hear it'], 'ai.rhyStop': ['გაჩერება', 'Stop'],
  'ai.vid': ['ვიდეო', 'Video'], 'ai.vidHide': ['ვიდეოს დამალვა', 'Hide the video'], 'ai.vidShow': ['ვიდეოს ჩვენება', 'Show the video'],
  'ai.vidNo': ['ამ ვიდეოს ამ ბრაუზერში ვერ ვუკრავ, მაგრამ ხმა წავიკითხე — ანალიზი მუშაობს.', 'This browser cannot play this video, but its sound was read — the analysis works.'],
  'ai.vidBad': ['ამ ვიდეოს ხმა ვერ წავიკითხე. ამოიღე აუდიო (MP3/M4A/WAV) და ის ჩააგდე.', 'The sound of this video could not be read. Take the audio out (MP3/M4A/WAV) and drop that instead.'],
  'ai.goto': ['გადასვლა', 'Go to'], 'ai.gotoD': ['წუთი:წამი — მაგ. 1:24', 'minute:second — e.g. 1:24'], 'ai.gotoBar': ['ტაქტზე', 'To bar'],
  'ai.jump': ['გადახვევა', 'Jump'], 'ai.start': ['თავიდან', 'To the start'], 'ai.end': ['ბოლოში', 'To the end'],
  'ai.keys': ['ღილაკები: ჰარი — დაკვრა/პაუზა · ← → — 5 წმ · Shift+← → — 1 წმ · Home/End — თავი/ბოლო', 'Keys: space — play/pause · ← → — 5 s · Shift+← → — 1 s · Home/End — start/end'],
  'ai.spSlow': ['ნელა', 'Slower'], 'ai.spFast': ['სწრაფად', 'Faster'], 'ai.bpmAuto': ['AI-ის ტემპი', 'Back to the AI tempo'], 'ai.tap': ['დააკაკუნე', 'Tap'], 'ai.tapD': ['დააკაკუნე დარტყმაზე 4-ჯერ მაინც', 'Tap on the beat at least 4 times'],
  'ai.regrid': ['დარტყმებს თავიდან ვაწყობ…', 'Tracking the beats again…'], 'ai.bpmBy': ['ხელით დაყენებული', 'set by hand'],
  'ai.unsure': ['დარწმუნებული არ ვარ', 'Not sure'],
  'ai.unsureN': ['{n} აკორდში დარწმუნებული არ ვარ — ისინი მონიშნულია. შეეხე ზოლს „აკორდების შესწორებაში“ და თვითონ დააყენე.', 'I am not sure about {n} of these — they are marked. Tap the ribbon under “Correct the chords” and set them yourself.'],
  'ai.stop': ['გაჩერება და თავში დაბრუნება', 'Stop and go back to the start'],
  'ai.tOver': ['მიმოხილვა', 'Overview'], 'ai.tInst': ['ინსტრუმენტები', 'Instruments'], 'ai.tChords': ['აკორდები', 'Chords'],
  'ai.tRhythm': ['რითმი', 'Rhythm'], 'ai.tSolo': ['სოლო / მელოდია', 'Solo / melody'], 'ai.tRoll': ['პიანო რულონი', 'Piano roll'], 'ai.tNote': ['ნოტაცია', 'Notation'],
  'ai.hand': ['3D ხელი', '3D hand'], 'ai.handOn': ['ხელი უკრავს თან', 'The hand plays along'],
  'ai.handD': ['მარცხენა ხელი რეალურ 3D-ში იჭერს იმ აკორდს, რომელიც ახლა ჟღერს — იგივე ამოხსნილი პოზიციები, რაც აკორდების გვერდებზეა.', 'The left hand holds, in real 3D, the chord that is sounding — the same solved positions the chord pages use.'],
  'ai.h3now': ['{n} — ასე უჭირავს მარცხენა ხელს.', '{n} — this is how the left hand holds it.'],
  'ai.h3no': ['{n} — ამ აკორდს სამ სიმზე დასაჭერი ფორმა არ აქვს.', '{n} — this chord has no three-string shape to hold.'],
  'ai.sheet': ['აკორდების გადასვლები', 'Chord changes'],
  'ai.sheetD': ['ყოველი გადასვლა რიგზე: სად იცვლება, რა აკორდია და როგორ იჭერ ფანდურზე. შეეხე — იქვე გადახვალ.', 'Every change in order: where it falls, which chord it is and how you hold it on the panduri. Tap one to jump there.'],
  'ai.sheetN': ['{n} გადასვლა · {u} სხვადასხვა აკორდი', '{n} changes · {u} different chords'],
  'ai.sheetNone': ['აკორდი ვერ ამოვიცანი ამ ჩანაწერში.', 'No chord could be read in this recording.'],
  'ai.sheetNoShape': ['სამ სიმზე ფორმა არ აქვს', 'No three-string shape'],
  'ai.sheetTap': ['შეეხე აკორდს, რომ იმ ადგილას გადახვიდე.', 'Tap a chord to jump to that place.'],
  'ai.voc': ['რა აკორდებს ვეძებ', 'Which chords to look for'],
  'ai.vocS': ['მაჟორი/მინორი', 'Major/minor'], 'ai.vocE': ['გაფართოებული', 'Extended'], 'ai.vocA': ['ყველა', 'Everything'],
  'ai.vocD': ['გაფართოებული: სეპტაკორდები, sus, 6, dim, aug, add9. „ყველა“ ნონაკორდებსაც ეძებს — მეტს პოულობს, მაგრამ უფრო ხშირად ცდება.', 'Extended: sevenths, sus, 6, dim, aug, add9. “Everything” also looks for ninths — it finds more, but is wrong more often.'],
  'ai.sheetSlow': ['აკორდი იშვიათად იცვლება. თუ მელოდია სწრაფია (აჭარული, ტეხილები), ზემოთ აირჩიე „სწრაფი“ და დააჭირე „ხელახლა წაკითხვას“.', 'The chord rarely changes. If the melody is fast (Acharuli, tekhili), choose “Fast” above and press “Read again”.'],
  'ai.engine': ['რით დავყო', 'Which engine'],
  'ai.engLight': ['მსუბუქი (ტელეფონზეც)', 'Light (works on a phone)'], 'ai.engHeavy': ['ზუსტი (კომპიუტერი)', 'Accurate (computer)'],
  'ai.engLightD': ['თითო ინსტრუმენტი ცალკე, ~39 MB თითოეული — იტვირთება, მუშავდება და თავისუფლდება. ტელეფონს ყოფნის. ხარისხი ზუსტ ვარიანტზე დაბალია.', 'One instrument at a time, about 39 MB each — loaded, used and released. A phone can hold it. The quality is below the accurate engine.'],
  'ai.engHeavyD': ['ერთი დიდი მოდელი, ~340 MB მეხსიერებაში. ხარისხი უკეთესია, მაგრამ ტელეფონზე არ ეტევა.', 'One large model, about 340 MB in memory. Better quality, but it does not fit on a phone.'],
  'ai.engStart': ['მზადდება…', 'Getting ready…'],
  'ai.engGet': ['{n}: მოდელი იტვირთება ({i}/{k})', '{n}: downloading the model ({i}/{k})'],
  'ai.engDl': ['{n}: {a}/{b} MB ({i}/{k})', '{n}: {a}/{b} MB ({i}/{k})'],
  'ai.engRun': ['{n}: ვყოფ ({i}/{k})', '{n}: separating ({i}/{k})'],
  'ai.engRunP': ['{n}: ვყოფ {p}% ({i}/{k})', '{n}: separating {p}% ({i}/{k})'],
  'ai.lowmem': ['ამ მოწყობილობას დაყოფისთვის მეხსიერება არ ჰყოფნის — მოდელს დაახლოებით {n} MB სჭირდება და ბრაუზერმა ამდენი ვერ გამოყო. სცადე კომპიუტერიდან; ტელეფონზე ეს მოდელი ვერ ეტევა.', 'This device does not have enough memory to split — the model needs about {n} MB and the browser could not reserve it. Try from a computer; this model does not fit on a phone.'],
  'ai.stuck': ['დაყოფა გაჩერდა — სავარაუდოდ მოწყობილობას მეხსიერება არ ეყო. სცადე უფრო მოკლე მონაკვეთი.', 'The split stopped — most likely the device ran out of memory. Try a shorter piece.'],
  'ai.try30': ['სცადე 30 წამი', 'Try 30 seconds'],
  'ai.memWarn': ['დაყოფა მძიმე სამუშაოა: მოდელი და ოთხივე ინსტრუმენტი ერთდროულად უნდა დაეტიოს მეხსიერებაში. ტელეფონზე დაიწყე 30 წამით — თუ გაივლის, მერე უფრო გრძელი სცადე. დაყოფის დროს აპლიკაცია ღია დატოვე.', 'Splitting is heavy work: the model and all four instruments have to fit in memory at once. On a phone start with 30 seconds — if that goes through, try a longer piece. Leave the app open while it runs.'],
  'ai.fast': ['რამდენად ხშირად იცვლება', 'How often it changes'],
  'ai.fast0': ['ნელი', 'Slow'], 'ai.fast1': ['ჩვეულებრივი', 'Normal'], 'ai.fast2': ['სწრაფი', 'Fast'],
  'ai.fastD': ['აჭარული და სხვა სწრაფი მელოდიები — „სწრაფი“: აკორდი თითქმის ყოველ თვლაზე იცვლება. „ნელი“ — როცა ერთი აკორდი მთელ ტაქტს იკავებს.', 'Acharuli and other fast melodies — “Fast”: the chord changes on almost every beat. “Slow” — when one chord holds a whole bar.'],
  'ai.vocAgain': ['ხელახლა წაკითხვა', 'Read again'], 'ai.vocWait': ['ვკითხულობ…', 'Reading…'],
  'ai.chEdit': ['აკორდების შესწორება', 'Correct the chords'], 'ai.chEditD': ['ჩართე და ზოლზე შეეხე აკორდს', 'Turn this on and tap a chord on the ribbon'],
  'ai.chRoot': ['საფუძველი', 'Root'], 'ai.chQual': ['სახეობა', 'Type'], 'ai.chNone': ['აკორდის გარეშე', 'No chord'],
  'ai.chSplit': ['აქ გაყოფა', 'Split here'], 'ai.chMerge': ['წინას შეერთება', 'Join with the one before'], 'ai.chAuto': ['AI-ის აკორდები', 'Back to the AI chords'],

  'ai.pitch': ['ტონი', 'Pitch'], 'ai.pitchD': ['ნახევარტონი — ხმა და აკორდებიც იცვლება', 'semitones — the sound and the chords move together'], 'ai.metro': ['მეტრონომი', 'Metronome'], 'ai.click': ['კლიკი', 'Click'], 'ai.clickVol': ['კლიკის ხმა', 'Click volume'], 'ai.countIn': ['თვლა', 'Count-in'],
  'ai.loop': ['გამეორება', 'Loop'], 'ai.loopA': ['გამეორების დასაწყისი', 'Loop start'], 'ai.loopB': ['გამეორების დასასრული', 'Loop end'], 'ai.loopOff': ['გამეორების გამორთვა', 'Loop off'], 'ai.bars': ['{n} ტაქტი', '{n} bar(s)'], 'ai.barN': ['ტაქტი {n}', 'Bar {n}'],
  'ai.guitar': ['გიტარა', 'Guitar'], 'ai.piano': ['ფორტეპიანო', 'Piano'], 'ai.model': ['ინსტრუმენტები', 'Instruments'], 'ai.m4': ['4 · ვოკ., დრამი, ბასი, დანარჩ.', '4 · vocals, drums, bass, rest'], 'ai.m6': ['6 · + გიტარა, ფორტეპიანო', '6 · + guitar, piano'],
  'ai.vol': ['ხმა', 'Volume'], 'ai.pan': ['მარცხნივ / მარჯვნივ', 'Left / right'], 'ai.export': ['მიქსის შენახვა (WAV)', 'Save the mix (WAV)'], 'ai.mixName': ['ჩემი მიქსი', 'my mix'], 'ai.again': ['ხელახლა დაყოფა', 'Split again'],
  'ai.partInfo': ['დაყოფილია: {a}–{b}', 'Split: {a}–{b}'], 'ai.mixNote': ['მიქსის შენახვაში სიჩქარე, ტონი, ხმები, პანორამა და ეფექტები ისე შეინახება, როგორც ახლა ისმის.', 'The saved mix keeps the speed, pitch, levels, panning and effects you hear now.'],
  'ai.pAll': ['ყველა', 'All'], 'ai.pKaraoke': ['🎤 ვოკალის გარეშე', '🎤 No vocals'], 'ai.pVocal': ['მხოლოდ ვოკალი', 'Vocals only'], 'ai.pNoDrums': ['დრამის გარეშე', 'No drums'], 'ai.pNoBass': ['ბასის გარეშე', 'No bass'], 'ai.pPlay': ['🪕 შენ უკრავ (ინსტრუმენტის გარეშე)', '🪕 You play (instrument muted)'], 'ai.reload': ['ეს სიმღერა ჯერ არ იყო შენახული — აირჩიე ფაილი კიდევ ერთხელ, შემდეგ უკვე შენახული დარჩება.', 'This song was not saved yet — pick the file once more; after that it stays saved.'], 'ai.reloadS': ['შეეხე და ფაილი კიდევ ერთხელ აირჩიე', 'Tap and pick the file once more'], 'ai.forget': ['სიიდან წაშლა', 'Remove from list'], 'ai.home': ['AI: შენი სიმღერის აკორდები', 'AI: chords of your song'], 'ai.homeD': ['ჩატვირთე სიმღერა — AI აკორდებს ფანდურზე გაჩვენებს და ინსტრუმენტებს დაყოფს', 'Load a song — the AI shows its chords on the panduri and splits the instruments']
});

PD.ai = (() => {
  let CUR = null;   // the song open in the studio: its analysis and its transcription
  const KEEP = 12;   // songs kept on the device for reopening
  const h = PD.h, t = PD.i18n.t, ic = PD.ic, TH = PD.theory;
  const NAMES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
  const SR = 44100;
  const BASE = (() => { const p = location.pathname; return location.protocol.startsWith('http') && /\/panduri\/app\//.test(p) ? new URL('../ai/', location.href).href : 'https://yanx447.github.io/index.html/panduri/ai/'; })();
  /** one gate for every premium door in the studio (the author and the test switch always pass) */
  const pro = f => !!(PD.premium && PD.premium.allows(f)) || !!PD.store.get('author', false) || !!PD.store.get('ai.test', false);
  const lock = f => PD.premium.paywall(f);
  const allowed = () => pro('ai.stems');
  /* ---- the free studio session ------------------------------------------------
     Without Premium the studio opens one session a day, {FREE_AI_HOURS} hours long.
     A new song starts it; inside that window the song can be closed and opened
     again as often as the student likes. When the window ends the studio waits
     for tomorrow's session. With Premium nothing here applies at all. -------- */
  const freeH = () => (PD.premium && PD.premium.FREE_AI_HOURS) || 4;
  const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();
  /** the session that is running right now, or null */
  function pass() { const p = PD.store.get('ai.pass', null); return p && p.at && Date.now() - p.at < freeH() * 3600e3 ? p : null; }
  const passLeft = () => { const p = pass(); return p ? freeH() * 3600e3 - (Date.now() - p.at) : 0; };
  /** 'ok' this song is the session's · 'busy' another song is · 'day' today's session is spent · 'new' a session can start */
  function passFor(file) {
    const p = pass(); if (p) return p.name === file.name ? 'ok' : 'busy';
    const last = PD.store.get('ai.pass', null);
    return last && last.at && sameDay(last.at, Date.now()) ? 'day' : 'new';
  }
  function passStart(file) { PD.store.set('ai.pass', { at: Date.now(), name: file.name }); }
  function leftText(ms) {
    const m = Math.max(0, Math.round(ms / 60000)), hh = Math.floor(m / 60);
    return hh ? (m % 60 ? t('ai.passH', { h: hh, m: m % 60 }) : t('ai.passHh', { h: hh })) : t('ai.passM', { m: Math.max(1, m) });
  }

  /* ======================= analysis: chords · key · tempo ======================= */
  function fftMag(N) {   // a small real FFT for analysis (radix-2)
    const rev = new Uint32Array(N), b = Math.log2(N), cs = new Float32Array(N / 2), sn = new Float32Array(N / 2);
    for (let i = 0; i < N; i++) { let r = 0; for (let k = 0; k < b; k++) r |= ((i >> k) & 1) << (b - 1 - k); rev[i] = r; }
    for (let i = 0; i < N / 2; i++) { cs[i] = Math.cos(2 * Math.PI * i / N); sn[i] = -Math.sin(2 * Math.PI * i / N); }
    const re = new Float32Array(N), im = new Float32Array(N), w = new Float32Array(N); for (let i = 0; i < N; i++) w[i] = .5 - .5 * Math.cos(2 * Math.PI * i / N);
    return (x, off, out) => {
      for (let i = 0; i < N; i++) { const j = rev[i], v = x[off + i] || 0; re[j] = v * w[i]; im[j] = 0; }
      for (let size = 2; size <= N; size <<= 1) { const half = size >> 1, step = N / size; for (let i = 0; i < N; i += size) for (let j = 0, k = 0; j < half; j++, k += step) { const a = i + j, c = a + half, tr = re[c] * cs[k] - im[c] * sn[k], ti = re[c] * sn[k] + im[c] * cs[k]; re[c] = re[a] - tr; im[c] = im[a] - ti; re[a] += tr; im[a] += ti; } }
      for (let k = 0; k < N / 2; k++) out[k] = Math.sqrt(re[k] * re[k] + im[k] * im[k]);
    };
  }
  /* ---- the chord vocabulary --------------------------------------------------------------
     'simple' = the two triads · 'ext' = the everyday set (sevenths, sus, sixths, dim, aug)
     · 'all'  = every quality in the app's theory, extended chords included.
     A chord with more notes must explain more of what is heard before it wins: that is `cost`. */
  const VOC = {
    simple: ['', 'm'],
    ext: ['', 'm', '7', 'm7', 'maj7', 'sus2', 'sus4', '7sus4', '6', 'm6', 'dim', 'aug', 'add9', 'm(add9)', 'm7♭5', 'dim7', '5'],
    all: null   // filled from PD.theory.CHORD_TYPES
  };
  function qualities(voc) {
    const TY = (PD.theory && PD.theory.CHORD_TYPES) || [];
    if (voc === 'simple') return VOC.simple;
    if (voc === 'all') return TY.map(x => x.k);
    return VOC.ext.filter(k => TY.some(x => x.k === k));
  }
  /* How much a quality has to beat the plain triad by before it is believed. A seventh turns up in
     every second song; a diminished seventh almost never. Without this the richer templates win on
     one stray overtone and every bar comes back as an add9. */
  const PRIOR = {
    '': 0, 'm': 0, '7': .06, 'm7': .065, 'maj7': .065, 'sus4': .07, 'sus2': .08,
    '6': .10, 'm6': .11, '7sus4': .11, 'add9': .12, 'm(add9)': .13, 'dim': .12, 'aug': .13, 'm7♭5': .13,
    'm(maj7)': .17, 'dim7': .15, '7♯5': .16, '7♭5': .17, '5': .14,
    '9': .18, 'maj9': .19, 'm9': .19, '11': .21, '13': .21
  };
  /** one template per root and quality: the chord's intervals, weighted, with its own prior */
  function buildTemplates(voc, thirdW) {
    const TY = (PD.theory && PD.theory.CHORD_TYPES) || [], want = qualities(voc), out = [];
    const W = iv => iv === 0 ? 1 : (iv === 3 || iv === 4) ? thirdW : iv === 7 ? .9 : .62;
    want.forEach(q => {
      const ty = TY.find(x => x.k === q); const iv = ty ? ty.iv : (q === 'm' ? [0, 3, 7] : [0, 4, 7]);
      const base = /^(m|dim|m7|m6|m9|m11|m13|m\(add9\)|m\(maj7\)|m7♭5|dim7)$/.test(q) ? 'm' : '';
      for (let r = 0; r < 12; r++) {
        const v = new Float32Array(12);
        iv.forEach(i => { const pc = (r + i) % 12; v[pc] = Math.max(v[pc], W(i % 12)); });
        out.push({ r, q, base, v, cost: PRIOR[q] != null ? PRIOR[q] : .2 });
      }
    });
    return out;
  }
  /** mono 22.05 kHz signal → { chords:[{t0,t1,root,q,name}], key, bpm, beats } */
  async function analyse(mono, sr, onProgress, opt, onStage) {
    opt = Object.assign({ bassW: .12, change: .34, keyBonus: .06, smooth: .12, nc: .35, third: .85, voc: 'ext', minBeats: .28, fast: 1 }, opt || {});
    // the window has to be shorter than the chord. At 8192 (371 ms) two fast chords always arrived
    // mixed together and only the slow ones survived; 4096 is 186 ms, about half a beat at 160 BPM.
    // time resolution comes from the step, not from shortening the window further: below 4096 the
    // bins can no longer tell one semitone from the next in the low register and the chroma blurs.
    const N = opt.fast <= 0 ? 8192 : 4096, HOPA = opt.fast >= 2 ? N / 8 : N / 4;
    const fft = fftMag(N), mag = new Float32Array(N / 2), frames = Math.max(1, Math.floor((mono.length - N) / HOPA));
    // bins → pitch class, 55 Hz .. 1.76 kHz, weighted toward the middle register
    const pcOf = new Int8Array(N / 2).fill(-1), wOf = new Float32Array(N / 2);
    const tol = N >= 8192 ? .35 : .42;
    for (let k = 1; k < N / 2; k++) { const f = k * sr / N; if (f < 55 || f > 1760) continue; const m = 69 + 12 * Math.log2(f / 440), r = Math.round(m); if (Math.abs(m - r) > tol) continue; pcOf[k] = ((r % 12) + 12) % 12; wOf[k] = Math.exp(-Math.pow((m - 60) / 20, 2)); }
    const chroma = [], bass = [], flux = new Float32Array(frames); let prev = new Float32Array(N / 2);
    for (let i = 0; i < frames; i++) {
      fft(mono, i * HOPA, mag);
      const c = new Float32Array(12), bs = new Float32Array(12); let fl = 0;
      for (let k = 1; k < N / 2; k++) { const v = mag[k]; if (pcOf[k] >= 0) { const s = Math.sqrt(v) * wOf[k]; c[pcOf[k]] += s; const fb = k * sr / N; if (fb >= 60 && fb < 260) bs[pcOf[k]] += Math.sqrt(v); } const d = v - prev[k]; if (d > 0 && k < 1200) fl += d; }
      prev.set(mag); flux[i] = fl;
      const mx = Math.max(...c) || 1; for (let j = 0; j < 12; j++) c[j] /= mx;
      chroma.push(c); bass.push(bs);
      if (i % 200 === 0) { onProgress && onProgress(i / frames); await new Promise(r => setTimeout(r, 0)); }
    }
    const dt = HOPA / sr;
    onStage && onStage('tempo');
    // tempo: autocorrelation of the onset strength, 60–180 BPM, a gentle preference for ~100
    const fm = flux.reduce((a, b) => a + b, 0) / frames || 1, on = flux.map(v => Math.max(0, v / fm - 1));
    let bestL = 0, bestS = -1; for (let bpm = 60; bpm <= 180; bpm += .5) { const L = 60 / bpm / dt; let s = 0; for (let i = Math.ceil(L); i < frames; i++) { const a = i - L, i0 = Math.floor(a), f = a - i0; s += on[i] * (on[i0] * (1 - f) + (on[i0 + 1] || 0) * f); } s *= Math.exp(-Math.pow(Math.log2(bpm / 100), 2) * .5); if (s > bestS) { bestS = s; bestL = bpm; } }
    const bpm = Math.round(bestL);
    // smooth the chroma over ~half a beat
    const win = Math.max(0, Math.min(3, Math.round(opt.smooth * 60 / bpm / dt))), sm = chroma.map((_, i) => { const o = new Float32Array(12); let n = 0; for (let j = Math.max(0, i - win); j <= Math.min(frames - 1, i + win); j++) { for (let k = 0; k < 12; k++) o[k] += chroma[j][k]; n++; } for (let k = 0; k < 12; k++) o[k] /= n; return o; });
    onStage && onStage('key');
    // key: Krumhansl–Kessler profiles on the whole chroma
    const tot = new Float32Array(12); chroma.forEach(c => { for (let k = 0; k < 12; k++) tot[k] += c[k]; });
    const MAJ = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88], MIN = [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];
    const corr = (a, b) => { const ma = a.reduce((x, y) => x + y, 0) / 12, mb = b.reduce((x, y) => x + y, 0) / 12; let n = 0, da = 0, db = 0; for (let i = 0; i < 12; i++) { n += (a[i] - ma) * (b[i] - mb); da += (a[i] - ma) ** 2; db += (b[i] - mb) ** 2; } return n / Math.sqrt(da * db); };
    let key = { r: 0, q: '', s: -2 }; for (let r = 0; r < 12; r++) for (const [q, P] of [['', MAJ], ['m', MIN]]) { const rot = P.map((_, i) => P[(i - r + 12) % 12]); const c = corr(Array.from(tot), rot); if (c > key.s) key = { r, q, s: c }; }
    // chords that belong to the key get a small head start
    const dia = new Set((key.q ? [[0, 'm'], [3, ''], [5, 'm'], [7, 'm'], [7, ''], [8, ''], [10, '']] : [[0, ''], [2, 'm'], [4, 'm'], [5, ''], [7, ''], [9, 'm']]).map(([d, q]) => ((key.r + d) % 12) + q));
    // the chord vocabulary: every quality the app knows, or just the triads — the caller chooses.
    // Each template is the chord's own intervals; the more notes a chord has, the more evidence it needs.
    const T = buildTemplates(opt.voc, opt.third);
    const score = (c, b, tpl) => { let d = 0, nc = 0, nt = 0; for (let k = 0; k < 12; k++) { d += c[k] * tpl.v[k]; nc += c[k] * c[k]; nt += tpl.v[k] * tpl.v[k]; } let s = d / Math.sqrt(nc * nt + 1e-9); const bm = Math.max(...b) || 1; s += opt.bassW * (b[tpl.r] / bm); return s; };
    onStage && onStage('chord');
    const K = T.length, NC = K;   // state K = no chord
    const em = sm.map((c, i) => { const e = new Float32Array(K + 1), energy = c.reduce((a, b) => a + b, 0); for (let k = 0; k < K; k++) e[k] = score(c, bass[i], T[k]) + (dia.has(T[k].r + T[k].base) ? opt.keyBonus : 0) - T[k].cost; e[NC] = energy < 1.2 ? .75 : opt.nc; return e; });
    // Viterbi: staying is cheap, changing costs
    const stay = 0, change = -opt.change * (HOPA / sr) / .0929;   // scaled to the old frame step, so the setting keeps its meaning
    let dp = em[0].slice(), back = [];
    for (let i = 1; i < frames; i++) {
      let bi = 0; for (let k = 1; k <= K; k++) if (dp[k] > dp[bi]) bi = k;
      const nd = new Float32Array(K + 1), bk = new Int16Array(K + 1);
      for (let k = 0; k <= K; k++) { const a = dp[k] + stay, b = dp[bi] + change; if (a >= b) { nd[k] = a + em[i][k] * 1.6; bk[k] = k; } else { nd[k] = b + em[i][k] * 1.6; bk[k] = bi; } }
      back.push(bk); dp = nd;
    }
    let s = 0; for (let k = 1; k <= K; k++) if (dp[k] > dp[s]) s = k;
    const path = new Int16Array(frames); path[frames - 1] = s; for (let i = frames - 2; i >= 0; i--) { s = back[i][s]; path[i] = s; }
    const chords = []; let st = 0;
    for (let i = 1; i <= frames; i++) if (i === frames || path[i] !== path[st]) {
      const k = path[st], t0 = st * dt + N / 2 / sr, t1 = i * dt + N / 2 / sr;
      // how sure: the chosen template against the best other one, averaged over the segment
      let mine = 0, other = 0;
      for (let j = st; j < i; j++) { mine += em[j][k]; let b2 = -1e9; for (let m = 0; m <= K; m++) if (m !== k && em[j][m] > b2) b2 = em[j][m]; other += b2; }
      const n2 = Math.max(1, i - st), conf = Math.max(0, Math.min(1, ((mine - other) / n2) / .12));
      if (k !== NC) chords.push({ t0, t1, root: T[k].r, q: T[k].q, conf: +conf.toFixed(2) });
      else chords.push({ t0, t1, root: -1, q: '', conf: +conf.toFixed(2) });
      st = i;
    }
    // drop blips shorter than half a beat (merge into the neighbour)
    const minD = (opt.minBeats == null ? .28 : opt.minBeats) * 60 / bpm; const merged = [];
    chords.forEach(c => { const l = merged[merged.length - 1]; if (l && (c.t1 - c.t0 < minD || (l.root === c.root && l.q === c.q))) { l.t1 = c.t1; l.conf = Math.min(l.conf == null ? 1 : l.conf, c.conf == null ? 1 : c.conf); } else merged.push(Object.assign({}, c)); });
    onProgress && onProgress(1);
    return { chords: merged, key, bpm, dur: mono.length / sr };
  }
  /** pull every chord edge onto the nearest beat, when it is already close to one.
      A chord that changes on the beat should be written on the beat, not 40 ms before it. */
  function snapToBeats(chords, beats, bpm) {
    if (!chords || !beats || beats.length < 4) return chords;
    const tol = Math.min(.18, 60 / (bpm || 100) * .38);
    const near = tt => { let lo = 0, hi = beats.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (beats[m] < tt) lo = m + 1; else hi = m; }
      let best = beats[lo]; if (lo > 0 && Math.abs(beats[lo - 1] - tt) < Math.abs(best - tt)) best = beats[lo - 1];
      return Math.abs(best - tt) <= tol ? best : tt; };
    const out = chords.map(c => Object.assign({}, c));
    for (let i = 1; i < out.length; i++) { const e = near(out[i].t0); if (e > out[i - 1].t0 + .04 && e < out[i].t1 - .04) { out[i - 1].t1 = e; out[i].t0 = e; } }
    return out.filter(c => c.t1 - c.t0 > .05);
  }
  /** beat times (s) by dynamic programming on a fine onset envelope (Ellis 2007), plus the bar phase from chord changes */
  async function beatsOf(mono, sr, bpm0, chords, lock) {
    const N = 1024, HOPB = 256, fft = fftMag(N), mag = new Float32Array(N / 2), F = Math.max(2, Math.floor((mono.length - N) / HOPB));
    const env = new Float32Array(F); let prev = new Float32Array(N / 2);
    for (let i = 0; i < F; i++) { fft(mono, i * HOPB, mag); let fl = 0; for (let k = 2; k < N / 2; k++) { const v = Math.log1p(mag[k] * 10), d = v - prev[k]; if (d > 0) fl += d; prev[k] = v; } env[i] = fl; if (i % 4000 === 0) await new Promise(r => setTimeout(r, 0)); }
    const dt = HOPB / sr;
    // remove the slow trend, normalise
    const W = Math.round(.5 / dt), on = new Float32Array(F); let acc = 0; for (let i = 0; i < F; i++) { acc += env[i]; if (i >= W) acc -= env[i - W]; on[i] = Math.max(0, env[i] - acc / Math.min(i + 1, W)); }
    let sd = 0; for (let i = 0; i < F; i++) sd += on[i] * on[i]; sd = Math.sqrt(sd / F) || 1; for (let i = 0; i < F; i++) on[i] /= sd;
    // refine the tempo within ±8 %
    let bpm = bpm0, best = -1; if (!lock) for (let b = bpm0 * .92; b <= bpm0 * 1.08; b += .1) { const L = 60 / b / dt; let sc = 0; for (let i = Math.ceil(L); i < F; i++) { const a = i - L, i0 = Math.floor(a), f = a - i0; sc += on[i] * (on[i0] * (1 - f) + on[i0 + 1] * f); } if (sc > best) { best = sc; bpm = b; } }
    const P = 60 / bpm / dt, score = new Float32Array(F), from = new Int32Array(F).fill(-1), alpha = 100;
    for (let i = 0; i < F; i++) {
      let bs = 0, bj = -1; const lo = Math.max(0, Math.round(i - 2 * P)), hi = Math.round(i - P / 2);
      for (let j = lo; j <= hi; j++) { const r = Math.log((i - j) / P), v = score[j] - alpha * r * r; if (bj < 0 || v > bs) { bs = v; bj = j; } }
      score[i] = on[i] + (bj >= 0 ? Math.max(0, bs) : 0); from[i] = bs > 0 ? bj : -1;
    }
    let e = F - 1, mx = -1; for (let i = Math.max(0, F - Math.round(P)); i < F; i++) if (score[i] > mx) { mx = score[i]; e = i; }
    const idx = []; for (let i = e; i >= 0; i = from[i]) { idx.push(i); if (from[i] < 0) break; }
    idx.reverse();
    const beats = idx.map(i => i * dt + N / 2 / sr);
    // bar phase: chords tend to change on the first beat of a bar
    const g = (lock && lock.bpb) || 4, ch = (chords || []).map(c => c.t0).filter(x => x > 0); let phase = 0, pb = -1;
    for (let ph = 0; ph < g; ph++) { let n = 0; beats.forEach((b, k) => { if ((k - ph) % g === 0 && ch.some(x => Math.abs(x - b) < .12)) n++; }); if (n > pb) { pb = n; phase = ph; } }
    return { beats, bpm: Math.round(bpm * 10) / 10, phase };
  }
  const cname = (root, q, tr) => root < 0 ? '—' : NAMES[((root + (tr || 0)) % 12 + 12) % 12] + q;
  /** the app's chord library entry for a root and quality */
  function shapeOf(root, q) {
    if (root < 0) return null;
    const all = PD.curriculum.chords();
    const exact = all.find(c => c.root === root && c.q === q && !c.none && c.frets && c.frets.some(f => f >= 0));
    if (exact) return exact;
    // no playable three-string form for that quality: fall back to its own triad, so the neck still shows something
    const tri = /^(m|dim|m7|m6|m9|m11|m13|m\(add9\)|m\(maj7\)|m7♭5|dim7)$/.test(q) ? 'm' : '';
    return all.find(c => c.root === root && c.q === tri && !c.none) || null;
  }

  /* ======================= audio: decode, resample ======================= */
  async function decode(file) {
    const buf = await file.arrayBuffer(), ac = new (window.AudioContext || window.webkitAudioContext)();
    const ab = await new Promise((res, rej) => { const p = ac.decodeAudioData(buf.slice(0), res, rej); if (p && p.then) p.then(res, rej); });
    try { ac.close(); } catch (_) {}
    return ab;
  }
  /** last resort: a file this browser will not decode but can play — its sound is taken while it plays,
      at double speed with pitch preservation off, so the captured samples are the original at half the context rate */
  function captureDecode(file, isVid, onProgress) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file), el = document.createElement(isVid ? 'video' : 'audio');
      el.src = url; el.preload = 'auto'; el.playsInline = true; el.muted = false;
      const AC = window.AudioContext || window.webkitAudioContext, ac = new AC(), RATE = 2;
      let src = null, node = null, sink = null, done = false, total = 0, guard = 0;
      const L = [], R = [];
      const cleanup = () => { try { el.pause(); } catch (_) {} try { if (node) node.disconnect(); if (src) src.disconnect(); if (sink) sink.disconnect(); } catch (_) {} try { ac.close(); } catch (_) {} clearTimeout(guard); try { URL.revokeObjectURL(url); } catch (_) {} };
      const fail = e => { if (done) return; done = true; cleanup(); reject(e); };
      el.onerror = () => fail(new Error('play'));
      el.onloadedmetadata = async () => {
        try {
          ['preservesPitch', 'mozPreservesPitch', 'webkitPreservesPitch'].forEach(k => { try { el[k] = false; } catch (_) {} });
          el.playbackRate = RATE;
          src = ac.createMediaElementSource(el);
          node = ac.createScriptProcessor(4096, 2, 2);
          sink = ac.createGain(); sink.gain.value = 0;
          node.onaudioprocess = e => {
            if (done) return;
            const ib = e.inputBuffer, a0 = ib.getChannelData(0), a1 = ib.numberOfChannels > 1 ? ib.getChannelData(1) : a0;
            L.push(new Float32Array(a0)); R.push(new Float32Array(a1)); total += a0.length;
            if (el.duration) onProgress && onProgress(Math.min(1, total / (ac.sampleRate / RATE) / el.duration));
          };
          src.connect(node); node.connect(sink); sink.connect(ac.destination);
          el.onended = finish;
          try { await ac.resume(); } catch (_) {}
          await el.play();
          guard = setTimeout(() => { if (!done) finish(); }, Math.max(8000, (el.duration || 60) / RATE * 1000 + 8000));
        } catch (e) { fail(e); }
      };
      function finish() {
        if (done) return; done = true;
        if (!total) { cleanup(); return reject(new Error('empty')); }
        const sr = Math.max(3000, Math.round(ac.sampleRate / RATE));
        let buf;
        try {
          const out = new AC(); buf = out.createBuffer(2, total, sr);
          [L, R].forEach((ch, c) => { const d = buf.getChannelData(c); let o = 0; ch.forEach(x => { d.set(x, o); o += x.length; }); });
          try { out.close(); } catch (_) {}
        } catch (e) { cleanup(); return reject(e); }
        cleanup(); resolve(buf);
      }
    });
  }
  async function resample(ab, sr, ch, t0, t1) {
    // when only a window is needed, render only that window: resampling a whole song to 44.1 kHz
    // stereo makes a second full copy of it, and on a phone that copy alone can end the tab
    const a = Math.max(0, t0 || 0), b = Math.min(ab.duration, t1 == null ? ab.duration : t1);
    const len = Math.max(1, Math.ceil((b - a) * sr)), oc = new OfflineAudioContext(ch, len, sr), s = oc.createBufferSource();
    s.buffer = ab; s.connect(oc.destination); s.start(0, a, b - a); return oc.startRendering();
  }

  /* ======================= the separation worker ======================= */
  let worker = null, wready = null;
  let splWorker = null;
  function getSpl(onMsg) {
    if (!splWorker) { const src = '(' + AISPL.toString() + ')()'; splWorker = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' }))); }
    splWorker.onmessage = e => { if (e.data && e.data.type === 'ready') splWorker.ready = true; onMsg(e.data); };
    splWorker.onerror = e => onMsg({ type: 'error', msg: e.message || 'worker' });
    return splWorker;
  }
  function getWorker(onMsg) {
    if (!worker) { const src = '(' + AIW.toString() + ')()'; worker = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' }))); }
    worker.onmessage = e => { if (e.data && e.data.type === 'ready') worker.ready = true; onMsg(e.data); }; worker.onerror = e => onMsg({ type: 'error', msg: e.message || 'worker' });
    return worker;
  }
  const hasGPU = () => !!navigator.gpu;

  /* ======================= WAV export ======================= */
  function wav(L, R, sr) {
    const n = L.length, b = new ArrayBuffer(44 + n * 4), v = new DataView(b), w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 4, true);
    for (let i = 0, o = 44; i < n; i++, o += 4) { v.setInt16(o, Math.max(-1, Math.min(1, L[i])) * 32767, true); v.setInt16(o + 2, Math.max(-1, Math.min(1, R[i])) * 32767, true); }
    return new Blob([b], { type: 'audio/wav' });
  }

  /* ======================= the page ======================= */
  function page(w) {
    const own = (() => { const offs = []; const un = PD.bus.on('route', () => { offs.forEach(f => { try { f(); } catch (_) {} }); un(); }); return f => offs.push(f); })();
    const back = () => PD.app.back('songs');
    const leadP = h('p', { class: 'muted', 'data-t': 'ai.lead' });
    const headRow = h('div', { class: 'row pg-head' }, [PD.app.route === 'ai' ? null : h('button', { class: 'btn small backbtn', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: back }), h('h1', { 'data-t': 'ai.title', style: 'margin:0' }), h('span', { class: 'ai-badge', text: 'AI' })]);
    w.append(headRow, leadP);
    const input = h('input', { type: 'file', accept: 'audio/*,video/*,.mp3,.m4a,.wav,.ogg,.oga,.opus,.flac,.aac,.wma,.mp4,.m4v,.mov,.webm,.mkv,.avi,.3gp,.ogv,.ts', hidden: true, onchange: e => { const f = e.target.files && e.target.files[0]; if (f) open(f); e.target.value = ''; } });
    const drop = h('button', { class: 'ai-drop', onclick: () => input.click() }, [h('span', { class: 'ai-drop-ic', html: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M24 30V8M15 17l9-9 9 9"/><path d="M8 30v6a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4v-6"/></svg>' }), h('b', { 'data-t': 'ai.pick' }), h('small', { 'data-t': 'ai.pickD' })]);
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('over'); }); drop.addEventListener('dragleave', () => drop.classList.remove('over'));
    drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('over'); const f = e.dataTransfer.files && e.dataTransfer.files[0]; if (f) open(f); });
    const status = h('div', { class: 'ai-status', 'aria-live': 'polite' }), body = h('div', { class: 'ai-body' });
    const passEl = h('div', { class: 'ai-pass', hidden: true });
    w.append(input, drop, passEl, status, body);
    let S = null;   // the current song
    const stopAll = () => { if (S) { cancelAnimationFrame(S.raf); if (S.deck) S.deck.destroy(); S.deck = null; if (S.vid) { try { S.vid.pause(); S.vid.removeAttribute('src'); S.vid.load(); } catch (_) {} S.vid = null; } if (S.vidURL) { try { URL.revokeObjectURL(S.vidURL); } catch (_) {} S.vidURL = null; } } };
    own(stopAll); own(() => { if (worker) { try { worker.terminate(); } catch (_) {} worker = null; } });
    /** the free session's clock: how long is left, and the studio closes when it runs out */
    function showPass() {
      if (pro('ai.more')) { passEl.hidden = true; return; }
      const p = pass();
      if (p) { passEl.hidden = false; passEl.className = 'ai-pass'; passEl.textContent = t('ai.passOn', { s: p.name, left: leftText(passLeft()) }); return; }
      const last = PD.store.get('ai.pass', null), spent = last && last.at && sameDay(last.at, Date.now());
      passEl.hidden = !spent; passEl.className = 'ai-pass out';
      if (spent) { passEl.innerHTML = ''; passEl.append(h('span', { text: t('ai.passOut', { s: last.name || '', n: freeH() }) }), h('button', { class: 'btn small primary', 'data-t': 'pm.buy', onclick: () => lock('ai.more') })); PD.i18n.apply(passEl); }
      if (spent && S) { stopAll(); body.innerHTML = ''; }
    }
    showPass();
    const passT = setInterval(showPass, 30000); own(() => clearInterval(passT));
    function bar(label, p) { status.innerHTML = ''; status.append(h('span', { text: label }), h('div', { class: 'hx-bar' }, [h('i', { style: 'width:' + Math.round(p * 100) + '%' })])); }

    async function open(file, saved) {
      stopAll(); body.innerHTML = ''; bar(t('ai.reading'), .05);
      const isVid = /^video\//.test(file.type || '') || /\.(mp4|m4v|mov|webm|mkv|avi|ogv)$/i.test(file.name || '');
      if (isVid && !pro('ai.video')) { status.innerHTML = ''; status.append(h('p', { class: 'notice', 'data-t': 'ai.vidPm' }), h('button', { class: 'btn primary', 'data-t': 'pm.buy', onclick: () => lock('ai.video') })); PD.i18n.apply(status); return; }
      if (!pro('ai.more')) {
        const st = passFor(file), p0 = PD.store.get('ai.pass', null);
        if (st === 'busy' || st === 'day') {
          status.innerHTML = '';
          status.append(h('p', { class: 'notice', text: t(st === 'busy' ? 'ai.passBusy' : 'ai.passOut', { s: (p0 && p0.name) || '', n: freeH(), left: leftText(passLeft()) }) }),
            h('button', { class: 'btn primary', 'data-t': 'pm.buy', onclick: () => lock('ai.more') }));
          PD.i18n.apply(status); showPass(); return;
        }
        if (st === 'new') passStart(file);
      }
      let ab = null;
      if (!PD.store.get('ai.forceCapture', false)) { try { ab = await decode(file); } catch (e) { ab = null; } }
      if (!ab) {
        // the browser would not read the file itself; if it can play it, the sound is taken as it plays
        bar(t('ai.slowRead'), .05);
        const t0c = Date.now();
        try { ab = await captureDecode(file, isVid, p => { const el2 = Date.now() - t0c, left = p > .02 ? el2 / p - el2 : 0; bar(t('ai.slowReadP', { p: Math.round(p * 100), m: PD.fmtTime(Math.max(1, left / 1000)) }), .05 + .45 * p); }); }
        catch (e) { status.innerHTML = ''; status.append(h('p', { class: 'notice', text: t(/play|empty/.test(String(e && e.message)) ? 'ai.noPlay' : (isVid ? 'ai.vidBad' : 'ai.bad')) })); return; }
      }
      let res = saved && saved.res; const S0 = {};
      if (!res) {
        bar(t('ai.analysing'), .1);
        const mono22 = await resample(ab, 22050, 1);
        let stage = 'ai.sSpec';
        const o0 = { voc: PD.store.get('ai.voc', 'ext'), fast: PD.store.get('ai.fast', 1) };
        o0.change = o0.fast >= 2 ? .24 : o0.fast <= 0 ? .5 : .34; o0.smooth = o0.fast >= 2 ? .07 : o0.fast <= 0 ? .2 : .12; o0.minBeats = o0.fast >= 2 ? .18 : o0.fast <= 0 ? .5 : .28;
        res = await analyse(mono22.getChannelData(0), 22050, p => bar(t(stage), .1 + .85 * p), o0, s2 => { stage = { tempo: 'ai.sTempo', key: 'ai.sKey', chord: 'ai.sChord' }[s2] || stage; bar(t(stage), .95); });
        res.voc = o0.voc; res.fast = o0.fast;
        S0.mono = mono22.getChannelData(0);
      }
      if (!res.beats) {
        bar(t('ai.beats'), .96);
        const m = S0.mono || (await resample(ab, 22050, 1)).getChannelData(0), b = await beatsOf(m, 22050, res.bpm, res.chords);
        res.beats = b.beats; res.phase = b.phase; res.bpm = b.bpm; if (saved) saved.fresh = true;
        res.chords = snapToBeats(res.chords, res.beats, res.bpm);
      }
      status.innerHTML = '';
      S = { file, ab, res, stems: null, mode: 'orig', raf: 0, mix: null, id: null, mono22: S0.mono || null, isVid };
      if (isVid) { try { S.vidURL = URL.createObjectURL(file); } catch (_) { S.vidURL = null; } }
      try { const all = PD.store.get('ai.recent', []), rec = saved ? saved.id : (all.find(r => r.name === file.name) || {}).id; if (rec) { S.id = rec; S.trSaved = await PD.blobs.get('ai.tr.' + rec); const rr = await PD.blobs.get('ai.rhy.' + rec); if (rr && rr.rhy) { S.rhy = rr.rhy; S.rhyMt = rr.metre; } } } catch (_) {}
      S.deck = PD.aiDeck.create(D => S.onDeck && S.onDeck(D));
      S.origSet = { id: 'orig', sr: ab.sampleRate, from: 0, tracks: [{ name: 'mix', L: ab.getChannelData(0), R: ab.numberOfChannels > 1 ? ab.getChannelData(1) : ab.getChannelData(0) }] };
      S.deck.setBeats(res.beats, res.bpm, res.phase, (S.trSaved && S.trSaved.metre && S.trSaved.metre.beatsPerBar) || 4); S.deck.setSet(S.origSet);
      // the shape of the sound itself, drawn behind the chords
      try { const L = ab.getChannelData(0), NB = 1600, st = Math.max(1, Math.floor(L.length / NB)), pk = new Float32Array(NB); for (let i = 0; i < NB; i++) { let m = 0; const a0 = i * st, a1 = Math.min(L.length, a0 + st); for (let j = a0; j < a1; j += 3) { const v = L[j] < 0 ? -L[j] : L[j]; if (v > m) m = v; } pk[i] = m; } let mx = 0; for (let i = 0; i < NB; i++) if (pk[i] > mx) mx = pk[i]; if (mx > 0) for (let i = 0; i < NB; i++) pk[i] /= mx; S.peaks = pk; } catch (_) { S.peaks = null; }
      // keep the song + its analysis on the device so it can be reopened any time
      try {
        const all = PD.store.get('ai.recent', []), id = saved ? saved.id : 's' + Date.now().toString(36);
        const rest = all.filter(r => r.id !== id && r.name !== file.name), gone = all.filter(r => !rest.includes(r) && r.id && r.id !== id);
        const entry = { id, name: file.name, type: file.type, at: Date.now(), key: cname(res.key.r, res.key.q), bpm: res.bpm, chords: [...new Set(res.chords.filter(c => c.root >= 0).map(c => cname(c.root, c.q)))].slice(0, 8), stored: saved ? true : false };
        const keep = [entry].concat(rest).slice(0, KEEP), drop = gone.concat(rest.slice(KEEP - 1));
        drop.forEach(r => { if (r.id) { PD.blobs.del('ai.song.' + r.id); PD.blobs.del('ai.res.' + r.id); } });
        PD.store.set('ai.recent', keep);
        if (saved && saved.fresh) PD.blobs.put('ai.res.' + id, res);
        if (!saved) {
          try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (_) {}
          const blob = new Blob([await file.arrayBuffer()], { type: file.type || 'audio/mpeg' });
          const ok = await PD.blobs.put('ai.song.' + id, blob), ok2 = await PD.blobs.put('ai.res.' + id, res);
          if (ok !== null && ok2 !== null) { const r2 = PD.store.get('ai.recent', []), e2 = r2.find(r => r.id === id); if (e2) { e2.stored = true; PD.store.set('ai.recent', r2); } }
        }
      } catch (_) {}
      render(); showPass();
    }
    async function reopen(r) {
      if (!r.id || !r.stored) { status.textContent = t('ai.reload'); input.click(); return; }
      bar(t('ai.reading'), .03);
      const blob = await PD.blobs.get('ai.song.' + r.id), res = await PD.blobs.get('ai.res.' + r.id);
      if (!blob) { status.textContent = t('ai.reload'); input.click(); return; }
      const file = new File([blob], r.name, { type: r.type || blob.type });
      open(file, { id: r.id, res: res && res.chords ? res : null });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function forget(r) {
      if (r.id) { PD.blobs.del('ai.song.' + r.id); PD.blobs.del('ai.res.' + r.id); }
      PD.store.set('ai.recent', PD.store.get('ai.recent', []).filter(x => x !== r && !(x.id ? x.id === r.id : x.name === r.name)));
      recentList();
    }

    let render = function () {
      body.innerHTML = '';
      const { res } = S, dk = S.deck, D = dk.D;
      let rhyBox = null, rhyTimer = 0, chEdit = false, chBox = null, sheetBox = null, sheetCur = -1, reread = null;
      const used = [...new Map(res.chords.filter(c => c.root >= 0).map(c => [c.root + c.q, c])).values()];
      const TR = () => Math.round(D.semis);
      // header: name · key · tempo
      const keyB = h('b'), bpmB = h('b');
      body.append(h('section', { class: 'ai-head' }, [h('b', { class: 'ai-name', text: S.file.name.replace(/\.[^.]+$/, '') }),
        h('div', { class: 'ai-facts' }, [fact('ai.key', keyB), fact('ai.bpm', bpmB), fact('ai.chords', h('b', { text: String(used.length) }))])]));
      // chord ribbon with the loop region
      const ribbon = h('canvas', { class: 'ai-ribbon' }), loopZ = h('i', { class: 'ai-loopz', hidden: true }), rWrap = h('div', { class: 'ai-rwrap' }, [ribbon, loopZ]);
      const nowEl = h('div', { class: 'ai-now' }), nextEl = h('div', { class: 'ai-next' });
      const nv = h('div', { class: 'neckview ai-neck' }), ncv = h('canvas'); nv.appendChild(ncv);
      const neck = PD.Neck(ncv, { sticky: true }); neck.mirror = PD.store.get('lefty', false);
      const ro = new ResizeObserver(() => { const nh = neck.natH(nv.clientWidth) + 'px'; if (nv.style.height !== nh) nv.style.height = nh; neck.layout(); drawRibbon(); last = null; }); ro.observe(nv); own(() => ro.disconnect());
      // the left hand in 3D, moving along with the song — the same solved positions the chord pages use
      const h3on = h('input', { type: 'checkbox', checked: PD.store.get('ai.hand3d', true) });
      let H3 = null, h3want = null, h3box = null;
      const h3wrap = h('div', { class: 'ai-h3', hidden: !h3on.checked });
      const h3note = h('small', { class: 'muted' });
      function mountH3() {
        if (H3 || !h3on.checked) return;
        h3box = PD.shapes.handBox({ cls: 'ai-h3box' });
        h3wrap.innerHTML = ''; h3wrap.append(h3box.box, h3note);
        // handBox mounts by itself; wait for it, then follow the chord that is playing
        const wait = setInterval(() => { if (!h3wrap.isConnected) return clearInterval(wait);
          if (h3box.box.querySelector('canvas')) { clearInterval(wait); H3 = h3box; if (h3want) setH3(h3want[0], h3want[1], h3want[2]); } }, 250);
        own(() => clearInterval(wait));
      }
      function setH3(frets, fingers, name) {
        h3want = [frets, fingers, name];
        if (!H3) return;
        const ok = frets && frets.some(f => f > 0) ? H3.set(frets, fingers) : H3.set([0, 0, 0], [0, 0, 0]);
        h3note.textContent = !frets ? '' : ok === false ? t('ai.h3no', { n: name || '' }) : t('ai.h3now', { n: name || '' });
      }
      h3on.onchange = () => { PD.store.set('ai.hand3d', h3on.checked); h3wrap.hidden = !h3on.checked; if (h3on.checked) mountH3(); };
      if (h3on.checked) setTimeout(mountH3, 700);
      // transport
      const playB = h('button', { class: 'btn primary ai-play', html: ic.play, 'aria-label': 'play', onclick: () => dk.toggle() });
      const timeEl = h('span', { class: 'ai-time mono' }), prepEl = h('span', { class: 'ai-prep', hidden: true, text: t('ai.prep') });
      const seek = h('input', { type: 'range', min: 0, max: 1000, value: 0, class: 'ai-seek', 'aria-label': t('ai.seek'), oninput: e => dk.seek(e.target.value / 1000 * res.dur) });
      const dots = h('div', { class: 'ai-dots' }, [0, 1, 2, 3].map(() => h('i'))), barEl = h('span', { class: 'ai-bar mono' });
      // tempo and pitch
      const spV = h('b', { class: 'mono' }), sp = h('input', { type: 'range', min: 25, max: 200, step: 5, value: Math.round(D.speed * 100), 'aria-label': t('ai.speed'), oninput: e => { spV.textContent = e.target.value + '%'; }, onchange: e => dk.setSpeed(e.target.value / 100) });
      const spSet = v => { sp.value = v; spV.textContent = v + '%'; dk.setSpeed(v / 100); };
      const spStep = d => spSet(Math.max(25, Math.min(200, Math.round(D.speed * 100 / 5) * 5 + d)));
      const spReset = h('button', { class: 'btn small ghost', text: '100%', onclick: () => spSet(100) });
      const spRow = h('div', { class: 'ai-tc ai-sprow' }, [h('button', { class: 'btn small', text: '−', 'aria-label': t('ai.spSlow'), onclick: () => spStep(-5) }), sp, h('button', { class: 'btn small', text: '+', 'aria-label': t('ai.spFast'), onclick: () => spStep(5) }), spV, spReset,
        h('div', { class: 'ai-sppre' }, [50, 75, 90, 125, 150].map(v => h('button', { class: 'chip', text: v + '%', onclick: () => spSet(v) })))]);
      const piV = h('b', { class: 'mono' });
      const piBtn = d => h('button', { class: 'btn small', text: d > 0 ? '+' : '−', 'aria-label': t('ai.pitch') + (d > 0 ? ' +' : ' −'), onclick: () => { const v = Math.max(-6, Math.min(6, Math.round(D.semis) + d)); dk.setPitch(v); } });
      // metronome · count-in
      const clickT = h('button', { class: 'ai-tg', 'aria-pressed': String(D.click.on), onclick: () => dk.setClick(!D.click.on) }, [h('span', { text: '♩' }), h('span', { text: t('ai.click') })]);
      const clickV = h('input', { type: 'range', min: 0, max: 100, value: Math.round(D.click.vol * 100), 'aria-label': t('ai.clickVol'), oninput: e => dk.setClick(D.click.on, e.target.value / 100) });
      const ciT = h('button', { class: 'ai-tg', 'aria-pressed': String(D.countIn), onclick: () => dk.setCountIn(!D.countIn) }, [h('span', { text: '4' }), h('span', { text: t('ai.countIn') })]);
      // loop
      let la = null;
      const loopTxt = h('small', { class: 'muted mono' });
      const lA = h('button', { class: 'btn small', text: 'A', 'aria-label': t('ai.loopA'), onclick: () => { la = dk.pos(); if (D.loop.on && D.loop.b > la) dk.setLoop(la, D.loop.b); else { dk.clearLoop(); } paint(); } });
      const lB = h('button', { class: 'btn small', text: 'B', 'aria-label': t('ai.loopB'), onclick: () => { const b = dk.pos(), a = la != null ? la : (D.loop.on ? D.loop.a : Math.max(0, b - 8)); if (b > a + .3) dk.setLoop(a, b); } });
      const lBars = n => h('button', { class: 'btn small', text: t('ai.bars', { n }), onclick: () => { const bt = dk.beatAt(dk.pos()), B = res.beats || []; if (!bt) return dk.setLoop(dk.pos(), Math.min(res.dur, dk.pos() + 8)); const ks = bt.k - (((bt.k - D.phase) % 4) + 4) % 4, a = B[Math.max(0, ks)], b = B[ks + 4 * n] || res.dur; dk.setLoop(a, b); la = a; } });
      const lOff = h('button', { class: 'btn small ghost', text: '✕', 'aria-label': t('ai.loopOff'), onclick: () => { la = null; dk.clearLoop(); } });
      // effects for the song you hear (the original; in the AI mix each instrument has its own FX)
      S.origFx = S.origFx || fxStore();
      const fxWrap = h('div', { class: 'ai-fxwrap', hidden: true });
      const fxBtn = h('button', { class: 'ai-tg', 'aria-pressed': 'false', onclick: () => { const open = fxWrap.hidden; fxWrap.hidden = !open; fxBtn.setAttribute('aria-pressed', String(open)); if (open) { fxWrap.innerHTML = ''; fxWrap.append(S.mode === 'stems' ? h('p', { class: 'muted', style: 'font-size:12.5px;margin:0', text: t('ai.fxStems') }) : fxPanel(S.origFx, (k, v) => { if (S.mode !== 'stems') dk.setFx(0, k, v); })); } } }, [h('span', { text: 'FX' }), h('span', { text: t('ai.fxOpen') })]);
      const compT = h('button', { class: 'ai-tg', 'aria-pressed': String(D.comp), onclick: () => { dk.setComp(!D.comp); compT.setAttribute('aria-pressed', String(D.comp)); } }, [h('span', { text: '◐' }), h('span', { text: t('ai.comp') })]);
      const fxTool = h('div', { class: 'ai-tool ai-tool-fx' }, [h('span', { class: 'ai-tl', text: t('ai.fx') }), h('div', { class: 'ai-tc' }, [fxBtn, compT]), fxWrap]);
      const chipRow = h('div', { class: 'ai-chips' });
      const chips = () => { chipRow.innerHTML = ''; chipRow.append(h('small', { class: 'muted', text: t('ai.used', { n: used.length }) })); used.forEach(c => chipRow.append(h('button', { class: 'chip', text: cname(c.root, c.q, TR()), onclick: () => { const r = (c.root + TR() + 12) % 12, sh = shapeOf(r, c.q); if (sh) PD.app.go('chords', sh.id); } }))); };
      // the picture, when a video was dropped: it follows the deck's real position, its sound comes from the deck
      let vidBox = null;
      if (S.isVid && S.vidURL) {
        const v = h('video', { class: 'ai-video', src: S.vidURL, muted: true, playsinline: true, preload: 'auto', tabindex: -1 });
        v.muted = true; v.playsInline = true;
        const note = h('p', { class: 'notice', hidden: true, text: t('ai.vidNo') });
        v.addEventListener('error', () => { note.hidden = false; v.hidden = true; });
        const hide = h('button', { class: 'btn small ghost ai-vhide', text: t('ai.vidHide'), onclick: () => { const on = v.hidden; v.hidden = !on; hide.textContent = t(on ? 'ai.vidHide' : 'ai.vidShow'); } });
        S.vid = v; S.vidAt = -1;
        vidBox = h('div', { class: 'ai-vwrap' }, [v, note, h('div', { class: 'ai-vrow' }, [h('span', { class: 'ai-tl', text: t('ai.vid') }), hide])]);
      }
      const jump = (d) => dk.seek(Math.max(0, Math.min(res.dur, dk.pos() + d)));
      const goIn = h('input', { type: 'text', class: 'ai-num ai-time-in', placeholder: '0:00', 'aria-label': t('ai.goto'), inputmode: 'numeric',
        onkeydown: e => { if (e.key === 'Enter') { e.preventDefault(); goTo(); } } });
      function goTo() {
        const s = (goIn.value || '').trim(); if (!s) return;
        const m = s.match(/^(\d+):(\d{1,2}(?:[.,]\d+)?)$/), sec = m ? (+m[1]) * 60 + parseFloat(m[2].replace(',', '.')) : parseFloat(s.replace(',', '.'));
        if (!isFinite(sec)) return; dk.seek(Math.max(0, Math.min(res.dur, sec)));
      }
      const barIn = h('input', { type: 'number', class: 'ai-num ai-bar-in', min: 1, step: 1, placeholder: '1', 'aria-label': t('ai.gotoBar'),
        onkeydown: e => { if (e.key === 'Enter') { e.preventDefault(); goBar(); } } });
      function goBar() {   // the bar the player itself counts, so the number matches what it shows
        const n = Math.max(1, Math.round(+barIn.value || 1)), B = res.beats || [];
        for (let k = 0; k < B.length; k++) { const bt = dk.beatAt(B[k] + .005); if (bt && bt.bar === n && bt.beat === 1) return dk.seek(B[k] + .005); }
        const g = dk.D.bpb || 4; dk.seek(Math.min(res.dur, (n - 1) * g * 60 / res.bpm));
      }
      const stopB = h('button', { class: 'btn small', text: '■', 'aria-label': t('ai.stop'), onclick: () => { if (D.playing) dk.toggle(); dk.seek(0); } });
      const transport = h('div', { class: 'ai-tr' }, [playB, stopB,
        h('button', { class: 'btn small', text: '−10', 'aria-label': '-10s', onclick: () => jump(-10) }),
        h('button', { class: 'btn small', text: '−5', 'aria-label': '-5s', onclick: () => jump(-5) }),
        h('button', { class: 'btn small', text: '+5', 'aria-label': '+5s', onclick: () => jump(5) }),
        h('button', { class: 'btn small', text: '+10', 'aria-label': '+10s', onclick: () => jump(10) }),
        h('div', { class: 'ai-beat' }, [dots, barEl]), prepEl, timeEl]);
      const gotoRow = h('div', { class: 'ai-tool ai-goto' }, [h('span', { class: 'ai-tl', text: t('ai.jump') }),
        h('div', { class: 'ai-tc' }, [
          h('div', { class: 'ai-pair' }, [goIn, h('button', { class: 'btn small', text: t('ai.goto'), onclick: goTo })]),
          h('div', { class: 'ai-pair' }, [barIn, h('button', { class: 'btn small', text: t('ai.gotoBar'), onclick: goBar })]),
          h('div', { class: 'ai-pair' }, [h('button', { class: 'btn small ghost', text: '⏮', 'aria-label': t('ai.start'), onclick: () => dk.seek(0) }),
            h('button', { class: 'btn small ghost', text: '⏭', 'aria-label': t('ai.end'), onclick: () => dk.seek(Math.max(0, res.dur - 2)) })])]),
        h('small', { class: 'muted', text: t('ai.gotoD') })]);
      /* ---- the deck stays on screen: the transport, the ribbon and what is playing now.
              Everything else lives in a tab, and switching a tab never touches the sound. ---- */
      leadP.hidden = true; drop.classList.add('mini'); if (recentBox) recentBox.hidden = true;
      own(() => { leadP.hidden = false; drop.classList.remove('mini'); if (recentBox) recentBox.hidden = !PD.store.get('ai.recent', []).length; });
      const deck = h('section', { class: 'ai-deck' }, [vidBox, rWrap, transport, seek, h('div', { class: 'ai-nn' }, [nowEl, nextEl])]);
      const overview = h('section', { class: 'ai-pane ai-player' }, [gotoRow, nv,
        h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', text: t('ai.hand') }),
          h('div', { class: 'ai-tc' }, [h('label', { class: 'sw' }, [h3on, h('i'), h('span', { text: t('ai.handOn') })]), h('small', { class: 'muted', text: t('ai.handD') })])]),
        h3wrap,
        h('div', { class: 'ai-tools' }, [
          h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', text: t('ai.speed') }), spRow]),
          h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', text: t('ai.pitch') }), h('div', { class: 'ai-tc' }, [piBtn(-1), piV, piBtn(1), h('small', { class: 'muted', text: t('ai.pitchD') })])]),
          h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', text: t('ai.metro') }), h('div', { class: 'ai-tc' }, [clickT, clickV, ciT])]),
          h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', text: t('ai.loop') }), h('div', { class: 'ai-tc' }, [lA, lB, lBars(1), lBars(4), lOff, loopTxt])]),
          tempoTool(), chordTool(), fxTool]),
        chipRow, h('small', { class: 'muted ai-keys', text: t('ai.keys') }), h('p', { class: 'notice', 'data-t': 'ai.est' })]);
      const chordsPane = sheetPanel(), rhythmPane = rhythmPanel(), stemsPane = stemsPanel(), trPane = trPanel();
      [chordsPane, rhythmPane, stemsPane, trPane].forEach(e => e.classList.add('ai-pane'));
      const TABS = [['overview', 'ai.tOver'], ['instruments', 'ai.tInst'], ['chords', 'ai.tChords'], ['rhythm', 'ai.tRhythm'], ['solo', 'ai.tSolo'], ['roll', 'ai.tRoll'], ['notation', 'ai.tNote']];
      const PANE = { overview, instruments: stemsPane, chords: chordsPane, rhythm: rhythmPane, solo: trPane, roll: trPane, notation: trPane };
      const TRVIEW = { solo: 'let', roll: 'roll', notation: 'staff' };
      const tabBar = h('nav', { class: 'ai-tabs', role: 'tablist' });
      const paneBox = h('div', { class: 'ai-panes' }, [overview, stemsPane, chordsPane, rhythmPane, trPane]);
      let tab = PD.store.get('ai.tab', 'overview'); if (!PANE[tab]) tab = 'overview';
      function showTab(k) {
        tab = k; PD.store.set('ai.tab', k);
        const want = PANE[k];
        panes.forEach(e => { e.hidden = e !== want; });
        tabBar.querySelectorAll('button').forEach(b2 => { const on = b2.dataset.k === k; b2.classList.toggle('on', on); b2.setAttribute('aria-selected', String(on)); if (on) try { b2.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); } catch (_) {} });
        if (TRVIEW[k] && S.tr && S.tr.setView) S.tr.setView(TRVIEW[k]);
        // a canvas that was hidden has no width: give everything a chance to measure again
        requestAnimationFrame(() => { try { neck.layout(); } catch (_) {} last = null; drawRibbon(); if (S.tr && S.tr.regrid) S.tr.regrid(); });
      }
      TABS.forEach(([k, lab]) => tabBar.append(h('button', { class: 'tab', role: 'tab', 'data-k': k, 'data-t': lab, onclick: () => showTab(k) })));
      S.swapPane = (oldEl, newEl) => { Object.keys(PANE).forEach(k => { if (PANE[k] === oldEl) PANE[k] = newEl; }); const i = panes.indexOf(oldEl); if (i >= 0) panes[i] = newEl; };
      const panes = [overview, stemsPane, chordsPane, rhythmPane, trPane];
      body.append(deck, tabBar, paneBox);
      showTab(tab);
      PD.i18n.apply(body);
      function fact(k, v) { return h('div', { class: 'ai-fact' }, [h('small', { 'data-t': k }), v]); }

      /* ---- the tempo, by hand: the beats are tracked again at the tempo you set ---- */
      function tempoTool() {
        const auto = res.bpmAuto == null ? res.bpm : res.bpmAuto;
        const inp = h('input', { type: 'number', class: 'ai-num ai-bpm-in', min: 30, max: 300, step: 1, value: Math.round(res.bpm), 'aria-label': t('ai.bpmSet') });
        const msg = h('small', { class: 'muted' });
        const apply = async v => {
          v = Math.max(30, Math.min(300, +v || 0)); if (!v) return;
          inp.value = Math.round(v); msg.textContent = t('ai.regrid');
          const m = await mono22();
          const b = await beatsOf(m, 22050, v, res.chords, { bpb: (S.tr && S.tr.data && S.tr.data.metre.beatsPerBar) || 4 });
          res.bpmAuto = auto; res.beats = b.beats; res.phase = b.phase; res.bpm = v; if (res.bpmBy !== null || Math.abs(v - auto) > .05) res.bpmBy = Math.abs(v - auto) > .05 ? 'hand' : null;
          msg.textContent = ''; const bk = body.querySelector('.ai-bpmback'); if (bk) bk.hidden = res.bpmBy !== 'hand'; afterGrid();
        };
        let taps = [];
        const tap = h('button', { class: 'btn small', text: t('ai.tap'), title: t('ai.tapD'), onclick: () => {
          const now = performance.now(); if (taps.length && now - taps[taps.length - 1] > 2500) taps = [];
          taps.push(now); if (taps.length < 4) { msg.textContent = t('ai.tapD'); return; }
          const d = []; for (let i = 1; i < taps.length; i++) d.push(taps[i] - taps[i - 1]);
          d.sort((x, y) => x - y); const mid = d[d.length >> 1];
          inp.value = Math.round(60000 / mid); msg.textContent = '';
        } });
        const row = h('div', { class: 'ai-tc' }, [inp, h('span', { class: 'muted', text: 'BPM' }),
          h('button', { class: 'btn small', text: '÷2', onclick: () => apply(res.bpm / 2) }),
          h('button', { class: 'btn small', text: '×2', onclick: () => apply(res.bpm * 2) }),
          tap, h('button', { class: 'btn small primary', text: t('ai.bpmApply'), onclick: () => apply(inp.value) }),
          h('button', { class: 'btn small ghost ai-bpmback', text: t('ai.bpmAuto'), hidden: res.bpmBy !== 'hand', onclick: () => { res.bpmBy = null; apply(auto); } })]);
        return h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', text: t('ai.bpmSet') }), row, h('small', { class: 'muted', text: t('ai.bpmD', { n: Math.round(auto) }) }), msg]);
      }
      async function mono22() { if (!S.mono22) S.mono22 = (await resample(S.ab, 22050, 1)).getChannelData(0); return S.mono22; }
      /** after the beat grid moved: the deck, the ribbon and the written notes all follow */
      function afterGrid() {
        dk.setBeats(res.beats, res.bpm, res.phase, (S.tr && S.tr.data && S.tr.data.metre.beatsPerBar) || 4);
        saveRes(); drawRibbon(); last = null; paint();
        if (S.tr && S.tr.regrid) S.tr.regrid(res.beats, res.bpm);
        S.on = null; S.metre = null; if (S.rhy) { S.rhy = null; drawRhythm(); }
      }
      function saveRes() { try { if (S.id) PD.blobs.put('ai.res.' + S.id, res); } catch (_) {} }
      // the strokes are clearest on the instrument that plays them. When the song has been split,
      // the rhythm is read off the accompaniment stem rather than the full mix.
      let rhySrc = PD.store.get('ai.rhySrc', 'auto');
      function rhyStem() {
        const names = S.stems ? S.stems.tracks.map(x => x.name) : [];
        if (rhySrc === 'perc' || rhySrc === 'orig') return rhySrc;
        if (rhySrc !== 'auto' && names.includes(rhySrc)) return rhySrc;
        if (names.includes('other')) return 'other';
        if (names.includes('drums')) return 'drums';
        return 'perc';   // no split: the strokes still come out cleaner than the full mix
      }
      async function onsetsOf() {
        const want = rhyStem();
        if (S.on && S.onSrc === want) return S.on;
        let m, off = 0;
        if (want === 'perc') {
          // the strokes alone, taken from the same recording with no model and no download
          const base = await mono22();
          S.on = await PD.aimus.percOnsets(base, 22050); S.onSrc = want; return S.on;
        }
        if (want === 'orig') m = await mono22();
        else { const g = await S.tr.getMono ? null : null; const tk = S.stems.tracks.find(x => x.name === want);
          const ac = new (window.AudioContext || window.webkitAudioContext)(), bb = ac.createBuffer(2, tk.L.length, S.stems.sr);
          bb.copyToChannel(tk.L, 0); bb.copyToChannel(tk.R, 1); try { ac.close(); } catch (_) {}
          m = (await resample(bb, 22050, 1)).getChannelData(0); off = S.stems.from || 0; void g; }
        S.on = PD.aimus.onsets(m, 22050); S.onSrc = want;
        if (off) S.on = { env: S.on.env, dt: S.on.dt, t0off: S.on.t0off + off };
        return S.on;
      }

      /* ---- the rhythm: where the strokes fall inside a bar, measured over every bar ---- */
      function rhyHead() { return h('div', { class: 'row pg-head' }, [h('h2', { text: t('ai.rhy'), style: 'margin:0' }), h('span', { class: 'ai-badge', text: 'AI' })]); }
      function rhythmPanel() {
        rhyBox = h('section', { class: 'ai-rhy' });
        drawRhythm();
        // it listens to the strokes in the whole mix, so there is nothing to wait for and nothing to split first
        if (!S.rhy) setTimeout(() => { if (rhyBox && rhyBox.isConnected && !S.rhy) runRhythm(); }, 400);
        return rhyBox;
      }
      function metreNow() { return (S.tr && S.tr.data && S.tr.data.metre) || S.metre || { beatsPerBar: dk.D.bpb || 4, phase: res.phase || 0, num: dk.D.bpb || 4, den: 4, compound: false }; }
      async function runRhythm() {
        const st = h('div', { class: 'ai-status' }, [h('span', { text: t('ai.rhyWait') }), h('div', { class: 'hx-bar' }, [h('i', { style: 'width:40%' })])]);
        rhyBox.innerHTML = ''; rhyBox.append(rhyHead(), st); PD.i18n.apply(rhyBox);
        await new Promise(r => setTimeout(r, 30));
        try {
          const on = await onsetsOf();
          if (!S.metre) S.metre = PD.aimus.metre(res.beats, on.env, on.dt, on.t0off, res.chords);
          const mt = metreNow();
          const known = (PD.curriculum.rhythms() || []).concat(PD.curriculum.commonRhythms() || []);
          S.rhy = PD.aimus.rhythm(on, res.beats, mt, known);
          S.rhyMt = mt;
          try { if (S.id) PD.blobs.put('ai.rhy.' + S.id, { rhy: S.rhy, metre: mt }); } catch (_) {}
        } catch (e) { S.rhy = null; }
        drawRhythm();
      }
      function drawRhythm() {
        if (!rhyBox) return;
        rhyBox.innerHTML = ''; rhyBox.append(rhyHead());
        const R = S.rhy;
        if (!R) {
          rhyBox.append(h('p', { class: 'muted', text: t('ai.rhyD') }), h('p', { class: 'muted', text: t('ai.rhyNoStems') }), h('button', { class: 'btn primary', text: t('ai.rhyRun'), onclick: runRhythm }));
          PD.i18n.apply(rhyBox); return;
        }
        if (!R.cells || !R.cells.some(c => c.on)) {
          rhyBox.append(h('p', { class: 'notice', text: t('ai.rhyNone') }), h('button', { class: 'btn small ghost', text: t('ai.rhyRun'), onclick: runRhythm }));
          PD.i18n.apply(rhyBox); return;
        }
        const mt = S.rhyMt || metreNow(), subKey = 'ai.sub' + R.sub;
        const facts = h('div', { class: 'ai-facts tr-facts' }, [
          h('div', { class: 'ai-fact' }, [h('small', { text: t('tr.meter') }), h('b', { text: mt.num + '/' + mt.den })]),
          h('div', { class: 'ai-fact' }, [h('small', { text: t('ai.rhySub') }), h('b', { text: t(subKey) })]),
          h('div', { class: 'ai-fact' }, [h('small', { text: t('ai.bpm') }), h('b', { text: Math.round(res.bpm) + ' BPM' })]),
          h('div', { class: 'ai-fact' }, [h('small', { text: t('ai.rhyBars') }), h('b', { text: String(R.bars) }),
            h('em', { class: 'tr-c ' + (R.conf >= .66 ? 'hi' : R.conf >= .4 ? 'mid' : 'lo'), text: t(R.conf >= .66 ? 'tr.cHigh' : R.conf >= .4 ? 'tr.cMid' : 'tr.cLow') })])]);
        rhyBox.append(facts);
        // what this is, out of the rhythms the teacher gave — the question this panel is really for
        {
          // only named when the measurement is clearly ahead of the next candidate; never a percentage,
          // because the number is a correlation and not a probability
          const g0 = R.best && R.best.geo ? R.best : null;
          const head = h('div', { class: 'ai-geo' + (g0 && g0.score >= .62 ? ' sure' : '') });
          if (g0) {
            head.append(h('small', { text: t(g0.score >= .62 ? 'ai.geoIs' : 'ai.geoMaybe') }),
              h('b', { text: PD.i18n.pick(g0.name) }),
              h('span', { class: 'mono', text: t(g0.score >= .72 ? 'ai.cHi' : g0.score >= .55 ? 'ai.cMid' : 'ai.cLo') }),
              h('button', { class: 'btn small ghost', text: t('ai.geoOpen'), onclick: () => PD.app.go('rhythms', g0.id) }));
          } else head.append(h('small', { text: t('ai.geoNo') }));
          rhyBox.append(head);
          if (g0) rhyBox.append(h('small', { class: 'muted', text: t(g0.span === 1 ? 'ai.geoIn1' : g0.span === 2 ? 'ai.geoIn2' : 'ai.geoPer', { n: g0.cycles }) }));
          rhyBox.append(h('small', { class: 'muted', text: t('ai.geoD') }));
        {
          const names = ['auto', 'perc', 'orig'].concat(S.stems ? S.stems.tracks.map(x => x.name) : []);
          const lab = n2 => n2 === 'auto' ? t('ai.rhyAuto') : n2 === 'perc' ? t('ai.rhyPerc') : n2 === 'orig' ? t('ai.rhyMix') : t(LBL[n2] || 'ai.other');
          const row = h('div', { class: 'chips-row' }, names.map(n2 => h('button', { class: 'chip' + (rhySrc === n2 ? ' on' : ''), text: lab(n2), onclick: () => { rhySrc = n2; PD.store.set('ai.rhySrc', n2); S.on = null; runRhythm(); } })));
          rhyBox.append(h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', text: t('ai.rhyFrom') }), row,
            h('small', { class: 'muted', text: t(S.stems ? 'ai.rhyFromD' : 'ai.rhyPercD') })]));
        }
        }
        if (R.span === 2) rhyBox.append(h('p', { class: 'notice', text: t('ai.rhySpan') }));
        // the strip: one cell per subdivision, its height the measured strength
        const strip = h('div', { class: 'rhy-strip' });
        R.cells.forEach(c => {
          const lab = c.off === 0 ? String(c.beat) : (R.sub === 2 && c.off === 1) || (R.sub === 4 && c.off === 2) ? t('ai.and') : '·';
          strip.append(h('div', { class: 'rhy-cell' + (c.acc ? ' acc' : c.on ? ' on' : c.weak ? ' weak' : '') + (c.off === 0 ? ' beat' : ''), 'data-c': String(c.i) }, [
            h('i', { class: 'rhy-bar', style: '--v:' + Math.round(Math.max(3, c.v * 100)) + '%' }),
            h('span', { class: 'rhy-ar', html: c.on || c.weak ? PD.rhythmsUI.arrowSVG(c.off === 0 ? 'down' : 'up', !!c.acc, 26) : '' }),
            h('u', { class: 'rhy-lab', text: lab })]));
        });
        rhyBox.append(strip, h('small', { class: 'muted', text: t('ai.rhyD') }), h('small', { class: 'muted', text: t('ai.rhyDir') }));
        // hear it
        const play = h('button', { class: 'btn small', text: t('ai.rhyPlay'), onclick: () => {
          if (rhyTimer) { clearInterval(rhyTimer); rhyTimer = 0; play.textContent = t('ai.rhyPlay'); strip.querySelectorAll('.now').forEach(x => x.classList.remove('now')); return; }
          play.textContent = t('ai.rhyStop');
          const beat = 60 / (res.bpm || 100), cell = beat / R.sub; let i = 0;
          try { PD.audio.ensure(); } catch (_) {}
          rhyTimer = setInterval(() => {
            const c = R.cells[i % R.cells.length];
            strip.querySelectorAll('.now').forEach(x => x.classList.remove('now'));
            const node = strip.querySelector('[data-c="' + c.i + '"]'); if (node) node.classList.add('now');
            if (c.on || c.weak) { try { PD.audio.click(PD.audio.now(), !!c.acc, !c.on); } catch (_) {} }
            i++;
          }, Math.max(60, cell * 1000));
        } });
        own(() => { if (rhyTimer) clearInterval(rhyTimer); });
        // what it resembles, out of the rhythms the app already has
        const like = h('div', { class: 'ai-tc' });
        const good = (R.matches || []).filter(m => m.score >= .6);
        if (!good.length) like.append(h('small', { class: 'muted', text: t('ai.rhyNoLike') }));
        else good.slice(0, 3).forEach(m => like.append(h('button', { class: 'chip', text: PD.i18n.pick(m.name), onclick: () => PD.app.go('rhythms', m.id) })));
        rhyBox.append(h('div', { class: 'ai-tool' }, [h('div', { class: 'ai-tc' }, [play])]),
          h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', text: t('ai.rhyLike') }), like, h('small', { class: 'muted', text: t('ai.rhyLikeD') })]),
          h('button', { class: 'btn small ghost', text: t('ai.rhyRun'), onclick: runRhythm }));
        PD.i18n.apply(rhyBox);
      }

      /* ---- correcting a chord the AI heard wrong ---- */
      function chordTool() {
        const tg = h('button', { class: 'ai-tg', 'aria-pressed': 'false', onclick: () => { if (!pro('ai.edit')) return lock('ai.edit'); chEdit = !chEdit; tg.setAttribute('aria-pressed', String(chEdit)); rWrap.classList.toggle('editing', chEdit); if (!chEdit && chBox) { chBox.remove(); chBox = null; } } }, [h('span', { text: '✎' }), h('span', { text: t('ai.chEdit') })]);
        const back = h('button', { class: 'btn small ghost ai-chback', text: t('ai.chAuto'), hidden: !res.chordsBy, onclick: async () => { if (!res.chords0) return; res.chords = res.chords0.map(c => Object.assign({}, c)); res.chords0 = null; res.chordsBy = null; back.hidden = true; saveRes(); drawRibbon(); last = null; chips(); } });
        return h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', text: t('ai.chords') }), h('div', { class: 'ai-tc' }, [tg, back]), h('small', { class: 'muted', text: t('ai.chEditD') })]);
      }
      /* ---- the chord sheet: every change, written out and drawn on the neck ---- */
      function sheetPanel() {
        sheetBox = h('section', { class: 'ai-sheet' });
        drawSheet();
        return sheetBox;
      }
      function readOpt() {
        const f = PD.store.get('ai.fast', 1);
        return { voc: PD.store.get('ai.voc', 'ext'), fast: f,
          change: f >= 2 ? .24 : f <= 0 ? .5 : .34,
          smooth: f >= 2 ? .07 : f <= 0 ? .2 : .12,
          minBeats: f >= 2 ? .18 : f <= 0 ? .5 : .28 };
      }
      function speedTool() {
        let v = res.fast == null ? PD.store.get('ai.fast', 1) : res.fast;
        const seg = h('div', { class: 'seg' }, [[0, 'ai.fast0'], [1, 'ai.fast1'], [2, 'ai.fast2']].map(([k, lab]) =>
          h('button', { 'aria-pressed': String(k === v), text: t(lab), onclick: e => { v = k; PD.store.set('ai.fast', k); seg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); reread.hidden = (v === (res.fast == null ? 1 : res.fast)); } })));
        return h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', text: t('ai.fast') }), h('div', { class: 'ai-tc' }, [seg]), h('small', { class: 'muted', text: t('ai.fastD') })]);
      }
      function vocTool() {
        let v = (res.voc || PD.store.get('ai.voc', 'ext'));
        const seg = h('div', { class: 'seg' }, [['simple', 'ai.vocS'], ['ext', 'ai.vocE'], ['all', 'ai.vocA']].map(([k, lab]) =>
          h('button', { 'aria-pressed': String(k === v), text: t(lab), onclick: e => { v = k; PD.store.set('ai.voc', k); seg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); again.hidden = (v === (res.voc || 'ext')); } })));
        const again = h('button', { class: 'btn small', text: t('ai.vocAgain'), hidden: true, onclick: async () => {
          again.disabled = true; again.textContent = t('ai.vocWait');
          try {
            const m = S.mono22 || (await resample(S.ab, 22050, 1)).getChannelData(0); S.mono22 = m;
            const o = readOpt(), r2 = await analyse(m, 22050, null, o);
            res.chords = snapToBeats(r2.chords, res.beats, res.bpm); res.key = r2.key; res.voc = o.voc; res.fast = o.fast;
            res.chords0 = null; res.chordsBy = null;
            saveRes(); drawRibbon(); last = null; drawSheet(); chips();
          } catch (_) {}
          again.disabled = false; again.textContent = t('ai.vocAgain'); again.hidden = true;
        } });
        reread = again;
        return h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', text: t('ai.voc') }), h('div', { class: 'ai-tc' }, [seg, again]), h('small', { class: 'muted', text: t('ai.vocD') })]);
      }
      function drawSheet() {
        if (!sheetBox) return;
        sheetBox.innerHTML = '';
        sheetBox.append(h('div', { class: 'row pg-head' }, [h('h2', { text: t('ai.sheet'), style: 'margin:0' }), h('span', { class: 'ai-badge', text: 'AI' })]),
          h('p', { class: 'fg2', text: t('ai.sheetD') }), h('div', { class: 'ai-tools' }, [vocTool(), speedTool()]));
        const list = (res.chords || []).filter(c => c.root >= 0);
        if (!list.length) { sheetBox.append(h('p', { class: 'notice', text: t('ai.sheetNone') })); PD.i18n.apply(sheetBox); return; }
        const seen = new Map();
        list.forEach(c => { const k = ((c.root + TR()) % 12 + 12) % 12 + c.q; if (!seen.has(k)) seen.set(k, c); });
        sheetBox.append(h('p', { class: 'muted', text: t('ai.sheetN', { n: list.length, u: seen.size }) }));
        // few changes on a quick tune almost always means the reading was too slow for it
        const bars = Math.max(1, res.dur / (60 / (res.bpm || 100) * (dk.D.bpb || 4)));
        if ((res.fast == null ? 1 : res.fast) < 2 && list.length / bars < .8) sheetBox.append(h('p', { class: 'notice', text: t('ai.sheetSlow') }));
        const grid = h('div', { class: 'ai-sgrid' });
        list.forEach((c, i) => {
          const r = ((c.root + TR()) % 12 + 12) % 12, nm = cname(c.root, c.q, TR());
          const sh = shapeOf(r, c.q), v = sh && ((sh.voicings && sh.voicings[0]) || sh);
          const bt = dk.beatAt(c.t0 + .005);
          const unsure = c.conf != null && c.conf < .45;
          const cell = h('button', { class: 'ai-scell' + (unsure ? ' unsure' : ''), 'data-t0': String(c.t0), title: unsure ? t('ai.unsure') : '', onclick: () => dk.seek(Math.max(0, c.t0 + .01)) }, [
            h('span', { class: 'ai-sn mono', text: String(i + 1) }),
            h('b', { class: 'ai-sname', text: nm }),
            h('small', { class: 'mono', text: PD.fmtTime(c.t0) + (bt ? ' · ' + t('ai.barN', { n: Math.max(1, bt.bar) }) : '') }),
            v ? h('div', { class: 'ai-sdia', html: PD.tools.chordDiagram(Object.assign({}, sh, { frets: v.frets, fingers: v.fingers })) })
              : h('small', { class: 'notice', text: t('ai.sheetNoShape') }),
            h('small', { class: 'muted', text: v ? v.frets.map(f => f === 0 ? '0' : f < 0 ? '×' : f).join(' · ') : '' }),
            unsure ? h('small', { class: 'ai-unsure', text: t('ai.unsure') }) : null].filter(Boolean));
          grid.append(cell);
        });
        const nU = list.filter(c => c.conf != null && c.conf < .45).length;
        sheetBox.append(grid, h('small', { class: 'muted', text: t('ai.sheetTap') }));
        if (nU) sheetBox.append(h('small', { class: 'muted', text: t('ai.unsureN', { n: nU }) }));
        PD.i18n.apply(sheetBox);
      }
      function markSheet(i) {
        if (!sheetBox || i === sheetCur) return; sheetCur = i;
        const cells = sheetBox.querySelectorAll('.ai-scell');
        cells.forEach(c => c.classList.remove('on'));
        if (i >= 0 && cells[i]) cells[i].classList.add('on');
      }
      const QUALS = [['', 'maj'], ['m', 'm'], ['7', '7'], ['m7', 'm7'], ['maj7', 'maj7'], ['m(maj7)', 'm(maj7)'], ['6', '6'], ['m6', 'm6'], ['sus4', 'sus4'], ['sus2', 'sus2'], ['7sus4', '7sus4'], ['add9', 'add9'], ['m(add9)', 'm(add9)'], ['9', '9'], ['maj9', 'maj9'], ['m9', 'm9'], ['dim', 'dim'], ['dim7', 'dim7'], ['m7♭5', 'm7♭5'], ['aug', 'aug'], ['7♯5', '7♯5'], ['5', '5']];
      function chordEditor(i) {
        const c = res.chords[i]; if (!c) return;
        if (chBox) chBox.remove();
        const bt0 = dk.beatAt(c.t0 + .01);
        const mark = () => { if (!res.chords0) res.chords0 = res.chords.map(x => Object.assign({}, x)); res.chordsBy = 'hand'; };
        const redraw = () => { saveRes(); drawRibbon(); last = null; chips(); const b = body.querySelector('.ai-chback'); if (b) b.hidden = false; chordEditor(i); };
        const roots = h('div', { class: 'ai-ed-row' });
        for (let r = 0; r < 12; r++) roots.append(h('button', { class: 'chip' + (c.root === r ? ' on' : ''), text: NAMES[r], onclick: () => { mark(); c.root = r; redraw(); } }));
        const quals = h('div', { class: 'ai-ed-row' });
        QUALS.forEach(([q, lab]) => quals.append(h('button', { class: 'chip' + (c.q === q ? ' on' : ''), text: lab, onclick: () => { mark(); c.q = q; redraw(); } })));
        const acts = h('div', { class: 'ai-ed-row' }, [
          h('button', { class: 'btn small ghost', text: t('ai.chNone'), onclick: () => { mark(); c.root = -1; c.q = ''; redraw(); } }),
          h('button', { class: 'btn small', text: t('ai.chSplit'), onclick: () => { const p = dk.pos(); if (p <= c.t0 + .1 || p >= c.t1 - .1) return; mark(); const n2 = { t0: p, t1: c.t1, root: c.root, q: c.q }; c.t1 = p; res.chords.splice(i + 1, 0, n2); redraw(); } }),
          i > 0 ? h('button', { class: 'btn small', text: t('ai.chMerge'), onclick: () => { mark(); res.chords[i - 1].t1 = c.t1; res.chords.splice(i, 1); chBox.remove(); chBox = null; saveRes(); drawRibbon(); last = null; chips(); } }) : null,
          h('button', { class: 'btn small ghost', text: '✕', 'aria-label': t('close'), onclick: () => { chBox.remove(); chBox = null; } })].filter(Boolean));
        chBox = h('div', { class: 'ai-ed' }, [h('div', { class: 'ai-ed-h' }, [h('b', { text: cname(c.root, c.q, TR()) }), h('small', { text: PD.fmtTime(c.t0) + ' – ' + PD.fmtTime(c.t1) + (bt0 ? ' · ' + t('ai.barN', { n: Math.max(1, bt0.bar) }) : '') })]),
          h('small', { class: 'muted', text: t('ai.chRoot') }), roots, h('small', { class: 'muted', text: t('ai.chQual') }), quals, acts]);
        rWrap.after(chBox); PD.i18n.apply(chBox);
      }
      // everything that follows the deck's state
      function paint() {
        playB.innerHTML = D.playing ? ic.pause : ic.play; prepEl.hidden = !D.preparing;
        spV.textContent = Math.round(D.speed * 100) + '%'; sp.value = Math.round(D.speed * 100);
        const st = Math.round(D.semis); piV.textContent = (st > 0 ? '+' : '') + st;
        keyB.textContent = cname(res.key.r, res.key.q, st); bpmB.textContent = Math.round(res.bpm * D.speed) + ' BPM' + (res.bpmBy === 'hand' ? ' ·' : ''); bpmB.title = res.bpmBy === 'hand' ? t('ai.bpmBy') : '';
        clickT.setAttribute('aria-pressed', String(D.click.on)); ciT.setAttribute('aria-pressed', String(D.countIn));
        if (D.loop.on) { loopTxt.textContent = PD.fmtTime(D.loop.a) + '–' + PD.fmtTime(D.loop.b); } else loopTxt.textContent = la != null ? 'A ' + PD.fmtTime(la) : '';
        lA.classList.toggle('on', la != null || D.loop.on); lB.classList.toggle('on', D.loop.on);
        drawLoop(); if (S.chipsTr !== st) { S.chipsTr = st; chips(); drawRibbon(); last = null; }
      }
      S.onDeck = () => { paint(); if (S.mixPaint) S.mixPaint(); };
      const COL = ['#C9773F', '#8E3B22', '#D9A25B', '#6E8B5A', '#B4573A', '#A3814F', '#7A6BB0', '#4F8FA8'];
      const colOf = (() => { const m = {}; let n = 0; return k => m[k] || (m[k] = COL[n++ % COL.length]); })();
      function drawRibbon() {
        const r = rWrap.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1), W = Math.max(10, r.width), H = 64; ribbon.width = W * dpr; ribbon.height = H * dpr; ribbon.style.height = H + 'px';
        const x = ribbon.getContext('2d'); x.scale(dpr, dpr); x.clearRect(0, 0, W, H);
        if (S.peaks) { const P = S.peaks, mid = H / 2; x.fillStyle = 'rgba(255,236,210,.14)'; for (let i = 0; i < W; i++) { const k = Math.floor(i / W * P.length), v = P[k] * (H / 2 - 9); x.fillRect(i, mid - v, 1, v * 2); } }
        res.chords.forEach(c => { const a = c.t0 / res.dur * W, b = c.t1 / res.dur * W; if (c.root < 0) { x.fillStyle = 'rgba(255,236,210,.06)'; x.fillRect(a, 8, b - a, H - 16); return; } x.fillStyle = colOf(c.root + c.q); x.globalAlpha = .75; x.fillRect(a + .5, 8, Math.max(1, b - a - 1), H - 16); x.globalAlpha = 1; if (b - a > 26) { x.fillStyle = '#FFF4E6'; x.font = '700 12px ' + "'Noto Sans Georgian', system-ui"; x.textBaseline = 'middle'; x.fillText(cname(c.root, c.q, TR()), a + 4, H / 2); } });
        // bar lines
        const B = res.beats || [], G = D.bpb || 4; x.fillStyle = 'rgba(255,244,230,.28)'; B.forEach((b, k) => { if ((((k - D.phase) % G) + G) % G === 0) x.fillRect(b / res.dur * W, H - 7, 1, 5); });
        // the AI-split part
        if (S.stems) { const a = S.stems.from / res.dur * W, b = (S.stems.from + S.stems.len) / res.dur * W; x.fillStyle = 'rgba(143,224,167,.8)'; x.fillRect(a, 1, Math.max(2, b - a), 3); }
        S.rib = { W, H }; drawLoop();
      }
      function drawLoop() { const W = S.rib ? S.rib.W : 0; loopZ.hidden = !D.loop.on; if (D.loop.on) { loopZ.style.left = (D.loop.a / res.dur * W) + 'px'; loopZ.style.width = Math.max(2, (D.loop.b - D.loop.a) / res.dur * W) + 'px'; } }
      let last = null, lastBeat = -1;
      function tickOnce() {
        const p = dk.pos(), W = S.rib ? S.rib.W : 0;
        rWrap.style.setProperty('--ph', (p / res.dur * W) + 'px');
        seek.value = Math.round(p / res.dur * 1000); timeEl.textContent = PD.fmtTime(p) + ' / ' + PD.fmtTime(res.dur);
        const bt = dk.beatAt(p);
        if (bt && bt.k !== lastBeat) { lastBeat = bt.k; barEl.textContent = t('ai.barN', { n: Math.max(1, bt.bar) }); [...dots.children].forEach((d, i) => { d.className = i === bt.beat - 1 ? (bt.beat === 1 ? 'on one' : 'on') : ''; }); }
        else if (!bt && lastBeat !== -2) { lastBeat = -2; barEl.textContent = ''; [...dots.children].forEach(d => d.className = ''); }
        if (S.vid && !S.vid.hidden) {
          const v = S.vid, want = Math.max(0, Math.min((v.duration || res.dur) - .05, p));
          if (v.readyState >= 1) {
            const rate = Math.max(.0625, Math.min(16, D.speed));
            if (Math.abs(v.playbackRate - rate) > .01) { try { v.playbackRate = rate; } catch (_) {} }
            if (Math.abs(v.currentTime - want) > (D.playing ? .18 : .04)) { try { v.currentTime = want; } catch (_) {} }
            if (D.playing && v.paused) { const q = v.play(); if (q && q.catch) q.catch(() => {}); }
            else if (!D.playing && !v.paused) v.pause();
          }
        }
        if (S.tr) S.tr.tick(p);
        const i = res.chords.findIndex(c => p >= c.t0 && p < c.t1), c = res.chords[i], n = res.chords.slice(i + 1).find(x => x.root >= 0);
        const key = c ? c.root + c.q + ':' + TR() : 'none';
        if (key !== last) {
          last = key; const r = c && c.root >= 0 ? (c.root + TR() + 12) % 12 : -1;
          nowEl.innerHTML = ''; nowEl.append(h('small', { text: t('ai.now') }), h('b', { text: c && c.root >= 0 ? cname(c.root, c.q, TR()) : t('ai.nc') }));
          nextEl.innerHTML = ''; if (n) nextEl.append(h('small', { text: t('ai.next') }), h('b', { text: cname(n.root, n.q, TR()) }));
          const sh = c ? shapeOf(r, c.q) : null, v = sh && ((sh.voicings && sh.voicings[0]) || sh);
          if (!(S.tr && S.tr.ownsNeck())) neck.setTarget(v ? v.frets.map((f, k) => ({ s: k + 1, f, fi: (v.fingers || [])[k] || 0 })) : [], []);
          setH3(v ? v.frets : null, v ? (v.fingers || []).map(x => x || 0) : null, c && c.root >= 0 ? cname(c.root, c.q, TR()) : '');
          nowEl.classList.remove('pop'); void nowEl.offsetWidth; nowEl.classList.add('pop');
          markSheet(c && c.root >= 0 ? res.chords.filter(x => x.root >= 0).indexOf(c) : -1);
        }
      }
      function trPanel() {
        if (S.tr) { try { S.tr.destroy(); } catch (_) {} }
        S.tr = PD.aimus.panel({
          res, name: S.file.name, saved: S.trSaved || null, neck,
          pro: () => pro('ai.trans'), proEdit: () => pro('ai.edit'), proExp: () => pro('ai.export'), lock,
          pos: () => dk.pos(), seek: tt => dk.seek(tt), invalidate: () => { last = null; },
          stemNames: () => S.stems ? S.stems.tracks.map(x => x.name) : [],
          onMetre: mt => { S.metre = mt; dk.setBeats(res.beats, res.bpm, res.phase, mt.beatsPerBar || 4); drawRibbon(); if (S.rhy) runRhythm(); },
          getOnsets: onsetsOf,
          save: M => { S.trSaved = M; if (S.id) { try { PD.blobs.put('ai.tr.' + S.id, M); } catch (_) {} } },
          getMono: async name => {
            if (name === 'orig' || !S.stems) return { mono: (await resample(S.ab, 22050, 1)).getChannelData(0), offset: 0 };
            const tk = S.stems.tracks.find(x => x.name === name); if (!tk) throw new Error('stem');
            const ac = new (window.AudioContext || window.webkitAudioContext)(), b = ac.createBuffer(2, tk.L.length, S.stems.sr);
            b.copyToChannel(tk.L, 0); b.copyToChannel(tk.R, 1); try { ac.close(); } catch (_) {}
            return { mono: (await resample(b, 22050, 1)).getChannelData(0), offset: S.stems.from };
          }
        });
        CUR = { res, get transcription() { return S.tr && S.tr.data; }, file: S.file };
        return S.tr.el;
      }
      own(() => { if (S && S.tr) { try { S.tr.destroy(); } catch (_) {} S.tr = null; } });
      S.ui = { pos: () => dk.pos(), redraw: () => drawRibbon() };
      const loop = () => { S.raf = requestAnimationFrame(loop); if (document.hidden) return; tickOnce(); neck.draw(); };
      S.raf = requestAnimationFrame(loop); drawRibbon(); paint();
      let skipClick = false;
      const ribT = e => { const r = rWrap.getBoundingClientRect(); return Math.max(0, Math.min(res.dur, (e.clientX - r.left) / r.width * res.dur)); };
      rWrap.onclick = e => { if (skipClick) return; const tt = ribT(e); if (chEdit) { const i = res.chords.findIndex(c => tt >= c.t0 && tt < c.t1); if (i >= 0) return chordEditor(i); } dk.seek(tt); };
      rWrap.onpointerdown = e => {
        if (chEdit || e.pointerType === 'mouse' && e.button !== 0) return;
        let moved = false; const id = e.pointerId;
        const mv = e2 => { if (e2.pointerId !== id) return; moved = true; rWrap.classList.add('scrub'); dk.seek(ribT(e2)); };
        const up = () => { rWrap.classList.remove('scrub'); rWrap.removeEventListener('pointermove', mv); rWrap.removeEventListener('pointerup', up); rWrap.removeEventListener('pointercancel', up); if (moved) { skipClick = true; setTimeout(() => { skipClick = false; }, 60); } };
        try { rWrap.setPointerCapture(id); } catch (_) {}
        rWrap.addEventListener('pointermove', mv); rWrap.addEventListener('pointerup', up); rWrap.addEventListener('pointercancel', up);
      };
      // keyboard: space play/pause, ←/→ 5 s
      const onKey = e => {
        if (/INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || '')) return;
        const st = e.shiftKey ? 1 : 5;
        if (e.code === 'Space') { e.preventDefault(); dk.toggle(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); jump(-st); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); jump(st); }
        else if (e.key === 'Home') { e.preventDefault(); dk.seek(0); }
        else if (e.key === 'End') { e.preventDefault(); dk.seek(Math.max(0, res.dur - 2)); }
      };
      document.addEventListener('keydown', onKey); own(() => document.removeEventListener('keydown', onKey));
      own(() => { neck.destroy(); });
    };

    /* ---------------- effects panel: EQ + reverb + echo for one track ---------------- */
    const FXK = [['low', 'ai.fxLow', -12, 12, 1, 'dB'], ['mid', 'ai.fxMid', -12, 12, 1, 'dB'], ['high', 'ai.fxHigh', -12, 12, 1, 'dB'], ['rev', 'ai.fxRev', 0, 100, 5, '%'], ['echo', 'ai.fxEcho', 0, 100, 5, '%']];
    const FXP = { clean: { low: 0, mid: 0, high: 0, rev: 0, echo: 0 }, hall: { low: 0, mid: 0, high: 1, rev: .38, echo: 0 }, echo: { low: 0, mid: 0, high: 0, rev: .12, echo: .32 }, warm: { low: 3, mid: -1, high: -3, rev: .1, echo: 0 }, bright: { low: -2, mid: 1, high: 4, rev: 0, echo: 0 }, radio: { low: -12, mid: 5, high: -9, rev: 0, echo: 0 } };
    function fxPanel(store, apply) {
      const box = h('div', { class: 'ai-fx' });
      const rows = FXK.map(([k, lab, mn, mx, stp, unit]) => {
        const isPct = unit === '%', val = () => isPct ? Math.round(store[k] * 100) : store[k];
        const out = h('b', { class: 'mono' }), fmt = () => { const v = val(); out.textContent = (!isPct && v > 0 ? '+' : '') + v + (isPct ? '%' : ' dB'); };
        const r = h('input', { type: 'range', min: mn, max: mx, step: stp, value: val(), 'aria-label': t(lab), oninput: e => { store[k] = isPct ? e.target.value / 100 : +e.target.value; fmt(); apply(k, store[k]); box.classList.toggle('used', used()); }, ondblclick: e => { store[k] = 0; e.target.value = 0; fmt(); apply(k, 0); } });
        fmt(); return { k, r, fmt, el: h('label', { class: 'ai-fxr' }, [h('span', { text: t(lab) }), r, out]) };
      });
      const used = () => Object.keys(FXP.clean).some(k => Math.abs(store[k]) > 0.001);
      const pre = h('div', { class: 'ai-fxp' }, Object.keys(FXP).map(n => h('button', { class: 'chip', text: t('ai.fxP_' + n), onclick: () => { Object.assign(store, FXP[n]); rows.forEach(x => { x.r.value = x.k === 'rev' || x.k === 'echo' ? Math.round(store[x.k] * 100) : store[x.k]; x.fmt(); apply(x.k, store[x.k]); }); box.classList.toggle('used', used()); PD.fx && PD.fx.sound('select'); } })));
      box.append(pre, ...rows.map(x => x.el)); box.classList.toggle('used', used());
      return box;
    }
    const fxStore = () => ({ low: 0, mid: 0, high: 0, rev: 0, echo: 0 });

    /* ---------------- instruments (premium) ---------------- */
    const LBL = { vocals: 'ai.vocals', drums: 'ai.drums', bass: 'ai.bass', other: 'ai.other', guitar: 'ai.guitar', piano: 'ai.piano' };
    const ORDER = ['vocals', 'drums', 'bass', 'guitar', 'piano', 'other'];
    let has6 = null;
    const check6 = () => has6 !== null ? Promise.resolve(has6) : fetch(BASE + 'model6/manifest.json', { method: 'HEAD', cache: 'no-store' }).then(r => (has6 = r.ok)).catch(() => (has6 = false));
    function stemsPanel() {
      const box = h('section', { class: 'ai-stems' });
      const head = h('div', { class: 'row', style: 'gap:8px;align-items:center;flex-wrap:wrap' }, [h('h2', { 'data-t': 'ai.stems', style: 'margin:0' }), h('span', { class: 'ai-pm', text: allowed() && !(PD.premium && PD.premium.active) ? t('ai.test') : t('ai.premium') })]);
      box.append(head, h('p', { class: 'fg2', 'data-t': 'ai.stemsD' }));
      if (S.stems) { box.append(mixer()); return box; }
      if (!allowed()) { box.append(h('p', { class: 'muted', 'data-t': 'ai.locked' }), h('button', { class: 'btn primary', 'data-t': 'pm.buy', onclick: () => PD.premium.paywall('ai.stems') })); return box; }
      // Splitting holds the model and four stereo stems in memory at once. On a phone that is the
      // difference between finishing and the tab being killed, so the choice starts small there.
      const mem = navigator.deviceMemory || 0, small = (mem && mem <= 4) || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const maxSec = small ? 45 : 90;
      const dur = S.res.dur;
      const choices = [];
      if (dur > 32) choices.push(['30', t('ai.first', { n: 30 })], ['here30', t('ai.fromHere', { n: 30 })]);
      if (dur > 62 && maxSec >= 60) choices.push(['60', t('ai.first', { n: 60 })], ['here', t('ai.fromHere', { n: 60 })]);
      if (dur <= maxSec) choices.unshift(['all', t('ai.all')]);
      if (!choices.length) choices.push(['30', t('ai.first', { n: 30 })]);
      let pick = choices[0][0], model = PD.store.get('ai.model', '4');
      const seg = h('div', { class: 'seg' }, choices.map(([k, l]) => h('button', { 'aria-pressed': String(k === pick), text: l, onclick: e => { pick = k; seg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); } })));
      const mseg = h('div', { class: 'seg' }, [['4', 'ai.m4'], ['6', 'ai.m6']].map(([k, l]) => h('button', { 'aria-pressed': String(k === model), 'data-v': k, text: t(l), onclick: e => { model = k; PD.store.set('ai.model', k); mseg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); } })));
      // which engine: the big one is better but needs a computer's memory; the light one loads one
      // instrument at a time and fits on a phone
      let engine = PD.store.get('ai.engine', small ? 'light' : 'heavy');
      const eseg = h('div', { class: 'seg' }, [['light', 'ai.engLight'], ['heavy', 'ai.engHeavy']].map(([k, l]) =>
        h('button', { 'aria-pressed': String(k === engine), text: t(l), onclick: e => { engine = k; PD.store.set('ai.engine', k); eseg.querySelectorAll('button').forEach(b2 => b2.setAttribute('aria-pressed', String(b2 === e.currentTarget))); mrow.hidden = engine !== 'heavy' || !has6; eNote.textContent = t(engine === 'light' ? 'ai.engLightD' : 'ai.engHeavyD'); } })));
      const eNote = h('small', { class: 'muted', text: t(engine === 'light' ? 'ai.engLightD' : 'ai.engHeavyD') });
      const erow = h('div', { class: 'ai-row' }, [h('span', { class: 'muted', text: t('ai.engine') }), eseg]);
      const mrow = h('div', { class: 'ai-row', hidden: true }, [h('span', { class: 'muted', text: t('ai.model') }), mseg]);
      check6().then(ok => { mrow.hidden = !ok || engine !== 'heavy'; if (!ok) model = '4'; });
      const prog = h('div', { class: 'ai-prog', hidden: true }), msg = h('div', { class: 'ai-msg', 'aria-live': 'polite' });
      const go = h('button', { class: 'btn primary big', html: '<span class="ai-spark">✦</span> <span data-t="ai.split"></span>', onclick: () => run() });
      box.append(erow, eNote, mrow, h('div', { class: 'ai-row' }, [h('span', { class: 'muted', 'data-t': 'ai.range' }), seg]), go, h('p', { class: 'muted', style: 'font-size:12.5px', 'data-t': 'ai.splitNote' }), h('p', { class: 'notice', style: 'font-size:12.5px', text: t('ai.memWarn') }), prog, msg);
      async function run() {
        go.disabled = true; prog.hidden = false; msg.textContent = '';
        // work out the window first, then resample only that window
        const secs = (pick === '60' || pick === 'here') ? 60 : (pick === '30' || pick === 'here30') ? 30 : S.res.dur;
        const at = (pick === 'here' || pick === 'here30') ? Math.max(0, S.deck.pos()) : 0;
        const a0 = Math.min(at, Math.max(0, S.res.dur - .25)), a1 = Math.min(S.res.dur, a0 + secs);
        let st44 = await resample(S.ab, SR, 2, a0, a1);
        const Ls = st44.getChannelData(0).slice(), Rs = st44.numberOfChannels > 1 ? st44.getChannelData(1).slice() : Ls.slice();
        st44 = null;
        const from = 0, to = Ls.length;
        const setP = (label, p) => { prog.innerHTML = ''; prog.append(h('span', { text: label }), h('div', { class: 'hx-bar' }, [h('i', { style: 'width:' + Math.round(p * 100) + '%' })])); };
        if (engine === 'light') return runLight(Ls, Rs, a0, to - from, setP);
        setP(t('ai.dl', { a: 0, b: 85 }), 0);
        const prefer = hasGPU() ? 'webgpu' : 'wasm', dir = model === '6' && has6 ? 'model6' : 'model';
        if (worker && worker.dir !== dir) { try { worker.terminate(); } catch (_) {} worker = null; }
        const wk = getWorker(m => {
          seen = Date.now();
          if (m.type === 'dl') setP(t('ai.dl', { a: Math.round(m.got / 1048576), b: Math.round(m.total / 1048576) }), m.got / m.total * .3);
          else if (m.type === 'stage') setP(t(m.s === 'unpack' ? 'ai.unpack' : 'ai.init'), .32);
          else if (m.type === 'ready') { setP(t('ai.proc', { p: 0, m: '…' }), .35); const a = Ls, b2 = Rs === Ls ? Ls.slice() : Rs; wk.postMessage({ cmd: 'separate', L: a, R: b2 }, [a.buffer, b2.buffer]); }
          else if (m.type === 'progress') setP(t('ai.proc', { p: Math.round(m.done / m.total * 100), m: PD.fmtTime(Math.max(1, m.eta)) }), .35 + .65 * m.done / m.total);
          else if (m.type === 'done') {
            const tracks = ORDER.map(n => m.sources.indexOf(n)).filter(i => i >= 0).map(i => ({ name: m.sources[i], L: m.stems[i][0], R: m.stems[i][1] }));
            S.stems = { id: 'stems' + Date.now(), sr: SR, from: a0, len: (to - from) / SR, tracks };
            S.mix = { gain: tracks.map(() => 1), mute: tracks.map(() => false), solo: -1, pan: tracks.map(() => 0), fx: tracks.map(fxStore) };
            stopWatch(); useStems(true); prog.hidden = true; const sp = stemsPanel(); sp.className = box.className; sp.hidden = box.hidden; box.replaceWith(sp); if (S.swapPane) S.swapPane(box, sp); PD.i18n.apply(sp); S.ui && S.ui.redraw();
          }
          else if (m.type === 'error') { fail(m.msg === 'LOWMEM' ? t('ai.lowmem', { n: m.need || 340 }) : /memory|Out of|alloc|RuntimeError|abort/i.test(m.msg) ? t('ai.mem') : t('ai.fail', { e: m.msg })); }
        });
        // a worker that runs out of memory can die without saying anything; nothing must wait for ever
        let seen = Date.now(), watch = 0;
        const stopWatch = () => { if (watch) clearInterval(watch); watch = 0; };
        const fail = text => {
          stopWatch(); go.disabled = false; prog.hidden = true;
          msg.innerHTML = ''; msg.append(h('span', { text }));
          if (!/MB/.test(text) && pick !== '30' && pick !== 'here30') msg.append(h('button', { class: 'btn small', style: 'margin-inline-start:8px', text: t('ai.try30'), onclick: () => { pick = '30'; seg.querySelectorAll('button').forEach(b2 => b2.setAttribute('aria-pressed', String(b2.textContent === t('ai.first', { n: 30 })))); msg.textContent = ''; run(); } }));
          try { worker && worker.terminate(); } catch (_) {} worker = null;
        };
        own(stopWatch);
        watch = setInterval(() => { if (Date.now() - seen > 90000) fail(t('ai.stuck')); }, 5000);
        if (!wk.ready) { wk.dir = dir; wk.postMessage({ cmd: 'load', base: BASE, prefer, dir }); } else wk.onmessage({ data: { type: 'ready' } });
      }
      function runLight(Ls, Rs, at, nlen, setP) {
        let seen = Date.now(), watch = 0;
        const stop = () => { if (watch) clearInterval(watch); watch = 0; };
        own(stop);
        const wk = getSpl(m => {
          seen = Date.now();
          if (m.type === 'ready') { setP(t('ai.engStart'), .02); const a = Ls, b2 = Rs === Ls ? Ls.slice() : Rs; wk.postMessage({ cmd: 'separate', L: a, R: b2 }, [a.buffer, b2.buffer]); }
          else if (m.type === 'dl') setP(t('ai.engDl', { n: t(LBL[m.name] || 'ai.other'), a: Math.round(m.got / 1048576), b: Math.round((m.total || 39322000) / 1048576), i: m.i + 1, k: m.n }), (m.i + (m.total ? m.got / m.total : 0) * .5) / m.n);
          else if (m.type === 'stage') setP(t(m.s === 'dl' ? 'ai.engGet' : 'ai.engRun', { n: t(LBL[m.name] || 'ai.other'), i: m.i + 1, k: m.n }), m.i / m.n);
          else if (m.type === 'progress') setP(t('ai.engRunP', { n: t(LBL[m.name] || 'ai.other'), p: Math.round(m.done / m.total * 100), i: m.i + 1, k: m.n }), (m.i + .5 + .5 * m.done / m.total) / m.n);
          else if (m.type === 'done') {
            stop();
            const tracks = ORDER.map(n2 => m.sources.indexOf(n2)).filter(i => i >= 0).map(i => ({ name: m.sources[i], L: m.stems[i][0], R: m.stems[i][1] }));
            S.stems = { id: 'stems' + Date.now(), sr: SR, from: at, len: nlen / SR, tracks, engine: 'light' };
            S.mix = { gain: tracks.map(() => 1), mute: tracks.map(() => false), solo: -1, pan: tracks.map(() => 0), fx: tracks.map(fxStore) };
            useStems(true); prog.hidden = true; const sp = stemsPanel(); sp.className = box.className; sp.hidden = box.hidden; box.replaceWith(sp); if (S.swapPane) S.swapPane(box, sp); PD.i18n.apply(sp); S.ui && S.ui.redraw();
          }
          else if (m.type === 'error') { stop(); go.disabled = false; prog.hidden = true; msg.textContent = t('ai.fail', { e: m.msg }); try { splWorker && splWorker.terminate(); } catch (_) {} splWorker = null; }
        });
        watch = setInterval(() => { if (Date.now() - seen > 120000) { stop(); go.disabled = false; prog.hidden = true; msg.textContent = t('ai.stuck'); try { splWorker && splWorker.terminate(); } catch (_) {} splWorker = null; } }, 5000);
        setP(t('ai.engStart'), .01);
        if (!wk.ready) wk.postMessage({ cmd: 'load', base: BASE }); else wk.onmessage({ data: { type: 'ready' } });
      }
      return box;
    }
    function useStems(on) {
      const dk = S.deck; S.mode = on ? 'stems' : 'orig';
      dk.setSet(on ? S.stems : S.origSet, true);
      if (on) (S.mix.fx || []).forEach((f, i) => Object.keys(f).forEach(k => dk.setFx(i, k, f[k]))); else if (S.origFx) Object.keys(S.origFx).forEach(k => dk.setFx(0, k, S.origFx[k]));
      if (on) { const M = S.mix; M.gain.forEach((g, i) => dk.setGain(i, g)); M.mute.forEach((v, i) => dk.setMute(i, v)); dk.setSolo(M.solo); M.pan.forEach((v, i) => dk.setPan(i, v)); }
    }
    function saveWav(L, R, sr, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(wav(L, R, sr)); a.download = S.file.name.replace(/\.[^.]+$/, '') + ' - ' + name + '.wav'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000); }
    function mixer() {
      const st = S.stems, M = S.mix, dk = S.deck, tr = st.tracks;
      const modeSeg = h('div', { class: 'seg' }, [['orig', 'ai.orig'], ['stems', 'ai.mixed']].map(([k, l]) => h('button', { 'aria-pressed': String(S.mode === k), 'data-v': k, text: t(l), onclick: () => { useStems(k === 'stems'); paintMix(); } })));
      const live = () => S.mode === 'stems';
      const rows = tr.map((x, i) => {
        const v = h('b', { class: 'mono' }), vol = h('input', { type: 'range', min: 0, max: 150, value: Math.round(M.gain[i] * 100), 'aria-label': t(LBL[x.name] || x.name) + ' · ' + t('ai.vol'), oninput: e => { M.gain[i] = e.target.value / 100; v.textContent = e.target.value + '%'; if (live()) dk.setGain(i, M.gain[i]); } });
        v.textContent = Math.round(M.gain[i] * 100) + '%';
        const pan = h('input', { type: 'range', class: 'ai-pan', min: -100, max: 100, step: 5, value: Math.round(M.pan[i] * 100), 'aria-label': t(LBL[x.name] || x.name) + ' · ' + t('ai.pan'), oninput: e => { M.pan[i] = e.target.value / 100; if (live()) dk.setPan(i, M.pan[i]); }, ondblclick: e => { e.target.value = 0; M.pan[i] = 0; if (live()) dk.setPan(i, 0); } });
        const mute = h('button', { class: 'ai-ms m', text: 'M', title: t('ai.mute'), 'aria-label': t('ai.mute'), onclick: () => { M.mute[i] = !M.mute[i]; if (live()) dk.setMute(i, M.mute[i]); else useStems(true); paintMix(); } });
        const solo = h('button', { class: 'ai-ms s', text: 'S', title: t('ai.solo'), 'aria-label': t('ai.solo'), onclick: () => { M.solo = M.solo === i ? -1 : i; if (live()) dk.setSolo(M.solo); else useStems(true); paintMix(); } });
        const save = h('button', { class: 'ai-ms', html: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>', title: t('ai.save'), 'aria-label': t('ai.save'), onclick: () => saveWav(x.L, x.R, st.sr, x.name) });
        M.fx = M.fx || tr.map(fxStore);
        const fxw = h('div', { class: 'ai-fxwrap', hidden: true });
        const fxb = h('button', { class: 'ai-ms fx', text: 'FX', title: t('ai.fx'), 'aria-label': t(LBL[x.name] || x.name) + ' · ' + t('ai.fx'), onclick: () => { const open = fxw.hidden; fxw.hidden = !open; fxb.classList.toggle('on', open); if (open && !fxw.firstChild) fxw.append(fxPanel(M.fx[i], (k, val) => { if (live()) dk.setFx(i, k, val); fxb.classList.toggle('used', Object.values(M.fx[i]).some(z => Math.abs(z) > .001)); })); } });
        const row = h('div', { class: 'ai-st ' + x.name }, [h('div', { class: 'ai-stn' }, [h('i'), h('b', { text: t(LBL[x.name] || x.name) }), mute, solo, fxb, save]), h('div', { class: 'ai-stv' }, [vol, v]), h('div', { class: 'ai-stp' }, [h('small', { text: 'L' }), pan, h('small', { text: 'R' })]), fxw]);
        row._m = mute; row._s = solo; row._v = vol; row._vv = v; return row;
      });
      // presets: one tap, like a karaoke or play-along button
      const I = n => tr.findIndex(x => x.name === n);
      const preset = (k, fn) => h('button', { class: 'chip', text: t(k), onclick: () => { M.solo = -1; M.mute = tr.map(() => false); M.gain = tr.map(() => 1); fn(); if (!live()) useStems(true); else { M.gain.forEach((g, i) => dk.setGain(i, g)); M.mute.forEach((v, i) => dk.setMute(i, v)); dk.setSolo(M.solo); } paintMix(); } });
      const presets = h('div', { class: 'ai-presets' }, [
        preset('ai.pAll', () => {}),
        I('vocals') >= 0 ? preset('ai.pKaraoke', () => { M.mute[I('vocals')] = true; }) : null,
        I('vocals') >= 0 ? preset('ai.pVocal', () => { M.solo = I('vocals'); }) : null,
        I('drums') >= 0 ? preset('ai.pNoDrums', () => { M.mute[I('drums')] = true; }) : null,
        I('bass') >= 0 ? preset('ai.pNoBass', () => { M.mute[I('bass')] = true; }) : null,
        preset('ai.pPlay', () => { ['other', 'guitar'].forEach(n => { if (I(n) >= 0) M.mute[I(n)] = true; }); })].filter(Boolean));
      const expB = h('button', { class: 'btn', html: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg> <span>' + PD.esc(t('ai.export')) + '</span>', onclick: async () => { expB.disabled = true; try { if (!live()) useStems(true); const r = await dk.render(); saveWav(r.L, r.R, r.sr, 'mix' + (Math.round(S.deck.D.speed * 100) !== 100 ? ' ' + Math.round(S.deck.D.speed * 100) + '%' : '') + (Math.round(S.deck.D.semis) ? ' ' + (S.deck.D.semis > 0 ? '+' : '') + Math.round(S.deck.D.semis) : '')); } catch (e) { PD.ui.toast(t('ai.fail', { e: e.message || e })); } expB.disabled = false; } });
      const again = h('button', { class: 'btn ghost small', text: t('ai.again'), onclick: () => { useStems(false); S.stems = null; S.mix = null; const sp = stemsPanel(); box.replaceWith(sp); PD.i18n.apply(sp); S.ui && S.ui.redraw(); } });
      const box = h('div', { class: 'ai-mix' }, [h('div', { class: 'row', style: 'gap:10px;align-items:center;flex-wrap:wrap' }, [modeSeg, h('small', { class: 'muted', text: t('ai.partInfo', { a: PD.fmtTime(st.from), b: PD.fmtTime(st.from + st.len) }) })]), presets].concat(rows, [h('div', { class: 'row', style: 'gap:8px;flex-wrap:wrap;align-items:center' }, [expB, again]), h('p', { class: 'muted', style: 'font-size:12.5px;margin:0', text: t('ai.mixNote') })]));
      function paintMix() {
        modeSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === S.mode)));
        rows.forEach((r, i) => { r._m.classList.toggle('on', M.mute[i]); r._s.classList.toggle('on', M.solo === i); r.classList.toggle('dim', M.mute[i] || (M.solo >= 0 && M.solo !== i)); r._v.value = Math.round(M.gain[i] * 100); r._vv.textContent = Math.round(M.gain[i] * 100) + '%'; });
      }
      S.mixPaint = () => { if (box.isConnected) modeSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === S.mode))); };
      paintMix();
      return box;
    }
    // recent analyses: tap to reopen (song + chords are kept on this device)
    const recentBox = h('section', { class: 'ai-recent' }); w.append(recentBox);
    function recentList() {
      const rec = PD.store.get('ai.recent', []); recentBox.innerHTML = ''; recentBox.hidden = !rec.length; if (!rec.length) return;
      recentBox.append(h('h3', { text: t('ai.recent') }), h('div', { class: 'list' }, rec.map(r => h('div', { class: 'li ai-ri' }, [
        h('button', { class: 'ai-rb grow', onclick: () => reopen(r) }, [h('span', { class: 'ai-rplay', html: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>' }), h('span', { class: 'grow' }, [h('b', { text: r.name.replace(/\.[^.]+$/, '') }), h('small', { class: 'muted', text: r.key + ' · ' + r.bpm + ' BPM · ' + (r.chords || []).join(' ') }), r.stored ? null : h('small', { class: 'ai-rwarn', text: t('ai.reloadS') })])]),
        h('button', { class: 'btn small ghost ai-rdel', 'aria-label': t('ai.forget'), title: t('ai.forget'), text: '✕', onclick: () => forget(r) })]))));
    }
    recentList();
    const _render = render; render = function () { _render(); recentList(); };
  }
  return { page, analyse, allowed, BASE, _analyse: analyse, _beatsOf: beatsOf, cname, shapeOf, get current() { return CUR; } };
})();
