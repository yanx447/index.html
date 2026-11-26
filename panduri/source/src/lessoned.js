/* =====================================================================
   Admin Lesson Editor — the owner's timeline for a song lesson.

   Eight tracks under one playhead: audio · chords · melody (piano roll) ·
   rhythm · lyrics · tablature · tempo (beat map) · sections. Drag to move,
   drag an edge to resize, double-click to add, snap to the beat / a grid /
   off, millisecond fields in the inspector, bars·beats or minutes·seconds,
   undo/redo, keyboard shortcuts, loop of a selection.

   Who may use it: the page opens only when the server says this account is
   the owner (cloud.isOwner ← rpc is_owner()). That is a convenience, not the
   protection: every save, publish, verify, restore and upload goes through
   security-definer functions that check is_owner() again on the server
   (migrations/202611250001_song_lessons.sql), and no table can be written
   directly. A learner who calls the API gets 'not-allowed'.

   What is saved where: every change is kept on this device at once (so a
   crash or a reload loses nothing); Save Draft writes it to the server
   (song_lesson_drafts, with a version row); Publish makes it what every
   learner gets. A new automatic analysis never replaces a saved draft —
   the owner loads it only on purpose (⋯ → Load the analysis).
   ===================================================================== */
PD.i18n.add({
  'le.title': ['გაკვეთილის რედაქტორი', 'Lesson editor'], 'le.close': ['დახურვა', 'Close'],
  'le.save': ['შავი ვერსიის შენახვა', 'Save Draft'], 'le.preview': ['წინასწარი ნახვა', 'Preview'], 'le.publish': ['გამოქვეყნება', 'Publish Changes'],
  'le.verify': ['დადასტურება', 'Verify Lesson'], 'le.unverify': ['დადასტურების მოხსნა', 'Remove verification'], 'le.revert': ['ცვლილებების გაუქმება', 'Revert Changes'],
  'le.history': ['ვერსიების ისტორია', 'Version History'], 'le.changes': ['ცვლილებების ისტორია', 'Change history'], 'le.restore': ['აღდგენა', 'Restore'],
  'le.undo': ['დაბრუნება', 'Undo'], 'le.redo': ['გამეორება', 'Redo'], 'le.more': ['მეტი', 'More'],
  'le.play': ['დაკვრა', 'Play'], 'le.stop': ['გაჩერება', 'Stop'], 'le.zoomIn': ['გადიდება', 'Zoom in'], 'le.zoomOut': ['დაპატარავება', 'Zoom out'], 'le.fit': ['მთლიანად', 'Fit'],
  'le.snap': ['მიბმა', 'Snap'], 'le.snap.beat': ['თვლაზე', 'Beat'], 'le.snap.off': ['გამორთული', 'Off'], 'le.loop': ['გამეორება', 'Loop'], 'le.follow': ['მიყოლა', 'Follow'],
  'le.mode.time': ['წთ:წმ', 'Min:Sec'], 'le.mode.bars': ['ტაქტი.თვლა', 'Bars.Beats'],
  'le.t.wave': ['აუდიო', 'Audio'], 'le.t.chords': ['აკორდები', 'Chords'], 'le.t.notes': ['ნოტები', 'Notes'], 'le.t.rhythm': ['რითმი', 'Rhythm'],
  'le.t.lyrics': ['ტექსტი', 'Lyrics'], 'le.t.tab': ['ტაბულატურა', 'Tablature'], 'le.t.tempo': ['ტემპი', 'Tempo'], 'le.t.sections': ['ნაწილები', 'Sections'],
  'le.status': ['სტატუსი', 'Status'], 'le.dirty': ['შეუნახავი ცვლილებები', 'Unsaved changes'], 'le.savedLocal': ['ამ მოწყობილობაზე შენახულია', 'Kept on this device'],
  'le.saved': ['შავი ვერსია შეინახა (ვერსია {r})', 'Draft saved (revision {r})'], 'le.published': ['გამოქვეყნდა — ყველა მომხმარებელი ამ ვერსიას მიიღებს', 'Published — every learner now gets this version'],
  'le.verified': ['გაკვეთილი დადასტურდა', 'Lesson verified'], 'le.unverified': ['დადასტურება მოიხსნა', 'Verification removed'],
  'le.reverted': ['შავი ვერსია დაუბრუნდა გამოქვეყნებულს', 'The draft is back to what is published'], 'le.notPub': ['ჯერ არაფერია გამოქვეყნებული — შავი ვერსია ჩანაწერის ანალიზს დაუბრუნდა.', 'Nothing is published yet — the draft went back to the analysis of the recording.'],
  'le.conflict': ['ეს გაკვეთილი სხვა მოწყობილობიდან შეიცვალა. გახსენი თავიდან, რომ ახალი ვერსია ნახო.', 'This lesson was changed on another device. Open it again to see the newer version.'],
  'le.noAllow': ['ამის გაკეთება მხოლოდ აპის მფლობელს შეუძლია.', 'Only the app\'s owner can do this.'], 'le.offline': ['სერვერთან კავშირი ვერ დამყარდა. ცვლილებები ამ მოწყობილობაზე რჩება.', 'Could not reach the server. Your changes stay on this device.'],
  'le.noMig': ['სერვერზე გაკვეთილების ცხრილი ჯერ არ არის (migration 202611250001). ცვლილებები ამ მოწყობილობაზე ინახება.', 'The server has no lesson tables yet (migration 202611250001). Changes are kept on this device.'],
  'le.wip': ['ამ მოწყობილობაზე შეუნახავი ცვლილებებია ({d}). აღვადგინო?', 'There are unsaved changes on this device ({d}). Restore them?'],
  'le.pubQ': ['გამოვაქვეყნო? ყველა მომხმარებელი ამ აკორდებს, ნოტებს და რითმს მიიღებს.', 'Publish? Every learner will get these chords, notes and rhythm.'],
  'le.revertQ': ['გავაუქმო შეუნახავი და შავი ცვლილებები და დავუბრუნდე გამოქვეყნებულს?', 'Discard the draft changes and go back to what is published?'],
  'le.analysisQ': ['ჩავტვირთო ჩანაწერის ავტომატური ანალიზი? ის შენს ცვლილებებს რედაქტორში ჩაანაცვლებს (დაბრუნება შეიძლება).', 'Load the automatic analysis of the recording? It replaces your changes in the editor (you can undo it).'],
  'le.loadAnalysis': ['ანალიზის ჩატვირთვა', 'Load the analysis'], 'le.upload': ['ჩანაწერის გამოქვეყნება', 'Publish the recording'],
  'le.uploadQ': ['ჩანაწერი საჯარო გახდება — ყველა მომხმარებელი მოისმენს. ადასტურებ, რომ მისი გამოქვეყნების უფლება გაქვს?', 'The recording becomes public — every learner can play it. Do you confirm you have the right to publish it?'],
  'le.uploaded': ['ჩანაწერი გამოქვეყნდა', 'Recording published'], 'le.uploading': ['იტვირთება… {p}%', 'Uploading… {p}%'], 'le.attach': ['ჩანაწერის მიმაგრება', 'Attach the recording'],
  'le.noAudio': ['ჩანაწერი ამ მოწყობილობაზე არ არის — დააჭირე აქ და მიამაგრე ფაილი MUSIC საქაღალდიდან. მანამდე ▶ აკორდებს, დარტყმებს და ნოტებს ფანდურის ხმით უკრავს (♪).', 'The recording is not on this device — tap here and attach the file from the MUSIC folder. Until then ▶ plays the chords, strokes and notes on the panduri (♪).'],
  'le.chordpro': ['ტექსტი აკორდებით', 'Lyrics with chords'], 'le.chordproD': ['[Am] შენამ ვინ გკითხავს… — ყოველი სტრიქონი ერთი ხაზია, აკორდი იქ იცვლება, სადაც ფრჩხილია. „გამოყენება“ სტრიქონებს ადგილზე ტოვებს და აკორდებს მარცვლის დროზე სვამს.', '[Am] Shenam vin… — one line per row; the chord changes where the bracket is. Apply keeps the lines where they are and puts the chords on the syllables\' times.'],
  'le.apply': ['გამოყენება', 'Apply'], 'le.cancel': ['გაუქმება', 'Cancel'], 'le.delete': ['წაშლა', 'Delete'], 'le.split': ['გაყოფა', 'Split'], 'le.dup': ['გამეორება შემდეგ', 'Repeat after'],
  'le.insert': ['ჩასმა აქ', 'Insert here'], 'le.hear': ['მოსმენა', 'Listen'], 'le.start': ['დასაწყისი', 'Start'], 'le.end': ['დასასრული', 'End'], 'le.dur': ['ხანგრძლივობა', 'Duration'],
  'le.name': ['აკორდი', 'Chord'], 'le.custom': ['სხვა (ჩაწერე)', 'Custom (type it)'], 'le.nc': ['N.C. — აკორდის გარეშე', 'N.C. — no chord'], 'le.play2': ['ფანდურზე', 'On the panduri'], 'le.same': ['იგივე', 'The same'],
  'le.pitch': ['ნოტი', 'Pitch'], 'le.string': ['სიმი', 'String'], 'le.fret': ['ლადი', 'Fret'], 'le.auto': ['ავტომატური', 'Automatic'], 'le.octUp': ['ოქტავით მაღლა', 'Octave up'], 'le.octDown': ['ოქტავით დაბლა', 'Octave down'],
  'le.impossible': ['ეს ნოტი ({m}) ფანდურის დიაპაზონს (A3–A5, 17 ლადი) სცდება — ფანდურის ვერსიაში ოქტავით გადაინაცვლებს.', 'This note ({m}) is outside the panduri\'s range (A3–A5, 17 frets) — the panduri version moves it by an octave.'],
  'le.badTab': ['სიმი {s} / ლადი {f} სხვა ნოტს იძლევა ({m}).', 'String {s} / fret {f} gives another note ({m}).'],
  'le.noShape': ['ამ აკორდს ფანდურის სამ სიმზე პოზიცია არ აქვს — აირჩიე ფანდურის ვერსია.', 'This chord has no three-string position — choose a panduri version.'],
  'le.adapted': ['ფანდურზე: {b} (ორიგინალი {a} შენახულია)', 'On the panduri: {b} (the original {a} is kept)'],
  'le.rhythm': ['რითმი', 'Rhythm'], 'le.span': ['ერთი წრე (თვლა)', 'One cycle (beats)'], 'le.strokes': ['დარტყმები', 'Strokes'], 'le.addStroke': ['დარტყმის დამატება', 'Add a stroke'],
  'le.pos': ['ადგილი (თვლა)', 'Place (beats)'], 'le.customR': ['საკუთარი რითმი', 'Custom rhythm'], 'le.wholeSong': ['მთელ სიმღერაზე', 'On the whole song'],
  'le.s.down': ['↓ ჩაკვრა', '↓ Down'], 'le.s.up': ['↑ ამოკვრა', '↑ Up'], 'le.s.downA': ['↓ ძლიერი', '↓ Accent'], 'le.s.upA': ['↑ ძლიერი', '↑ Accent'], 'le.s.rest': ['· პაუზა', '· Pause'], 'le.s.mute': ['× ჩახშობილი', '× Muted'], 'le.s.str': ['სიმი {s}', 'String {s}'],
  'le.text': ['ტექსტი', 'Text'], 'le.spread': ['მარცვლების თანაბრად განაწილება', 'Spread the syllables evenly'], 'le.addLine': ['სტრიქონის დამატება', 'Add a line'],
  'le.kind': ['ნაწილი', 'Part'], 'le.beat': ['თვლა {n}', 'Beat {n}'], 'le.time': ['დრო', 'Time'], 'le.bpmSet': ['ტემპი მონიშნულზე (BPM)', 'Tempo for the selection (BPM)'], 'le.shift': ['ყველა თვლის წაძვრა (მწმ)', 'Shift every beat (ms)'],
  'le.meta': ['სიმღერა', 'Song'], 'le.titleKa': ['სახელი (ქართ.)', 'Title (Georgian)'], 'le.titleEn': ['სახელი (ინგლ.)', 'Title (English)'], 'le.artistKa': ['შემსრულებელი (ქართ.)', 'Performer (Georgian)'], 'le.artistEn': ['შემსრულებელი (ინგლ.)', 'Performer (English)'],
  'le.level': ['სირთულე', 'Level'], 'le.key': ['ტონალობა', 'Key'], 'le.meter': ['ზომა', 'Meter'], 'le.bpb': ['თვლა ტაქტში', 'Beats per bar'], 'le.sub': ['დაყოფა', 'Subdivision'], 'le.octave': ['მელოდიის ოქტავა ფანდურზე', 'Melody octave on the panduri'],
  'le.review': ['გადასამოწმებელი', 'To review'], 'le.reviewNone': ['ამ ადგილას შენიშვნა არ არის.', 'Nothing noted here.'], 'le.conf': ['თანხმობა {p}%', 'Agreement {p}%'],
  'le.keys': ['Space დაკვრა · S გაყოფა · I აკორდის ჩასმა · Del წაშლა · ⌘Z / ⌘⇧Z · ⌘C ⌘V · ⌘D გამეორება · L წრე · +/− მასშტაბი · ⌥+ბორბალი სიმაღლე · B ტაქტი/დრო · N მიბმა · T Tap · M მარკერი · ← → 10 მწმ (⇧ 100, ⌥ 1)', 'Space play · S split · I insert chord · Del delete · ⌘Z / ⌘⇧Z · ⌘C ⌘V · ⌘D repeat · L loop · +/− zoom · ⌥+wheel height · B bars/time · N snap · T tap · M marker · ← → 10 ms (⇧ 100, ⌥ 1)'],
  'le.copied': ['{n} აკორდი დაკოპირდა', '{n} chords copied'], 'le.pasted': ['{n} ჩაისვა', '{n} pasted'], 'le.verifiedNote': ['ეს ვერსია დადასტურებულია', 'This revision is verified'],
  'le.t.beats': ['დარტყმები', 'Beat grid'], 'le.t.markers': ['მარკერები', 'Markers'], 'le.t.strokes': ['დარტყმა', 'Stroke'], 'le.t.tpts': ['ტემპის წერტილი', 'Tempo point'],
  'le.mute': ['ჩუმად', 'Mute'], 'le.solo': ['სოლო', 'Solo'], 'le.vzIn': ['სიმაღლე +', 'Taller'], 'le.vzOut': ['სიმაღლე −', 'Shorter'], 'le.snap.bar': ['ტაქტზე', 'Bar'],
  'le.tap': ['Tap', 'Tap'], 'le.tapD': ['დაკვრისას დააჭირე T-ს (ან ამ ღილაკს) ყოველ დარტყმაზე — დარტყმების რუკა შენს დაჭერებს გაჰყვება.', 'While it plays, press T (or this button) on every beat — the beat map follows your taps.'],
  'le.tapped': ['{n} დარტყმა შენი დაჭერებიდან ({b} BPM)', '{n} beats from your taps ({b} BPM)'], 'le.tapBpm': ['Tap: {b} BPM', 'Tap: {b} BPM'],
  'le.recC': ['აკორდების ჩაწერა', 'Record chords'], 'le.recR': ['რითმის ჩაწერა', 'Record rhythm'], 'le.recOn': ['ჩაწერა: დაკვრისას აირჩიე აკორდი (1–9) — ის მიმდინარე დროზე ჩაიწერება.', 'Recording: while it plays, pick a chord (1–9) — it is written at the current time.'],
  'le.recROn': ['ჩაწერა: {d} ↓ · {u} ↑ · Shift = აქცენტი · {m} ჩახშობილი · {r} პაუზა · {s} ერთი სიმი', 'Recording: {d} ↓ · {u} ↑ · Shift = accent · {m} muted · {r} pause · {s} one string'],
  'le.recDone': ['{n} დარტყმა ჩაიწერა', '{n} strokes recorded'], 'le.lat': ['დაყოვნების კომპენსაცია (მწმ)', 'Latency compensation (ms)'], 'le.calib': ['გაზომვა', 'Measure'],
  'le.calibD': ['დაკვრისას დააჭირე T-ს ზუსტად დარტყმაზე 8-ჯერ — გავზომავ, რამდენით აგვიანებ.', 'While it plays, press T exactly on the beat 8 times — I measure how late you press.'], 'le.calibDone': ['დაყოვნება: {ms} მწმ', 'Latency: {ms} ms'],
  'le.keysT': ['ჩაწერის ღილაკები', 'Recording keys'], 'le.keyPress': ['დააჭირე ღილაკს…', 'Press a key…'], 'le.recSet': ['ჩაწერის პარამეტრები', 'Recording settings'],
  'le.down': ['↓ ჩაკვრა', '↓ Down'], 'le.up': ['↑ ამოკვრა', '↑ Up'], 'le.k.m': ['× ჩახშობილი', '× Muted'], 'le.k.r': ['· პაუზა', '· Pause'], 'le.k.s': ['ერთი სიმი', 'One string'], 'le.k.c': ['სხვა დარტყმა', 'Custom stroke'],
  'le.toStrokes': ['ცალკეულ დარტყმებად', 'As single strokes'], 'le.toStrokesD': ['ნახატი ცალკეულ დარტყმებად იქცევა — თითოეული ჩაკვრა, ამოკვრა და პაუზა ცალკე გადაადგილდება.', 'The pattern becomes single strokes — each down, up and pause moves on its own.'],
  'le.fillSel': ['მონიშნულზე', 'On the selection'], 'le.label': ['წარწერა', 'Label'], 'le.sug': ['მიმართულება ნავარაუდევია (ხმიდან სანდოდ არ ისმის) — შეამოწმე.', 'The direction is suggested (it cannot be heard reliably) — check it.'],
  'le.tp': ['ტემპის წერტილი', 'Tempo point'], 'le.tpAdd': ['ტემპის წერტილის დამატება', 'Add a tempo point'], 'le.ramp': ['ცვლილება', 'Change'], 'le.rampOn': ['თანდათანობით (შემდეგ წერტილამდე)', 'Gradual (to the next point)'], 'le.rampOff': ['მკვეთრად', 'Abrupt'],
  'le.tpApply': ['დარტყმები ამ ტემპით — შემდეგ წერტილამდე', 'Beats at this tempo — to the next point'], 'le.tpApplyEnd': ['დარტყმები ამ ტემპით — ბოლომდე', 'Beats at this tempo — to the end'],
  'le.tpFromBeats': ['ტემპის წერტილები დარტყმებიდან', 'Tempo points from the beats'], 'le.tpNote': ['დარტყმები აუდიოს მიჰყვება; ტემპის წერტილი მხოლოდ ბადეს ცვლის — ჩანაწერი არ იცვლება.', 'The beats follow the audio; a tempo point only moves the grid — the recording never changes.'],
  'le.downbeat': ['აქ იწყება ტაქტი 1 (Downbeat)', 'Bar 1 starts here (downbeat)'], 'le.meterHere': ['ზომის ცვლილება აქ', 'Meter change here'], 'le.meterDel': ['ზომის ცვლილების წაშლა', 'Remove the meter change'],
  'le.beatIns': ['დარტყმის ჩასმა შემდეგ', 'Insert a beat after'], 'le.beatDel': ['დარტყმის წაშლა', 'Delete the beat'], 'le.bar': ['ტაქტი {b} · თვლა {n}', 'Bar {b} · beat {n}'],
  'le.marker': ['მარკერი', 'Marker'], 'le.finger': ['თითი', 'Finger'], 'le.art': ['შტრიხი', 'Articulation'], 'le.art.p': ['ჩვეულებრივი', 'Plucked'], 'le.art.h': ['Hammer-on', 'Hammer-on'], 'le.art.po': ['Pull-off', 'Pull-off'], 'le.art.sl': ['Slide', 'Slide'], 'le.art.tr': ['ტრემოლო', 'Tremolo'], 'le.art.gr': ['ფორშლაგი', 'Grace note'],
  'le.quant': ['Quantize', 'Quantize'], 'le.human': ['ცოცხალი დრო', 'Human timing'], 'le.loopSel': ['მონიშნულის გამეორება', 'Loop the selection'], 'le.dupN': ['გამეორება', 'Duplicate'],
  'le.outN': ['{n} ნოტი ფანდურის დიაპაზონს (A3–A5) სცდება. ჩუმად არაფერი შეცვლილა — აირჩიე:', '{n} notes are outside the panduri\'s range (A3–A5). Nothing was changed silently — choose:'],
  'le.fit.octave': ['ოქტავით გადატანა (მხოლოდ ესენი)', 'Octave transposition (only these)'], 'le.fit.transpose': ['მთელი მელოდიის ტრანსპოზიცია', 'Transpose the whole melody'], 'le.fit.arrange': ['ალტერნატიული არანჟირება', 'Alternative arrangement'], 'le.fit.manual': ['ხელით შესწორება', 'Correct by hand'],
  'le.retab': ['ფანდურის ტაბულატურის შექმნა', 'Generate the panduri tablature'], 'le.pref.auto': ['ყველაზე მოსახერხებელი', 'Most comfortable'], 'le.pref.open': ['ღია სიმები', 'Open strings'], 'le.pref.low': ['დაბალი პოზიცია', 'Low position'], 'le.pref.one': ['ერთ სიმზე', 'On one string'],
  'le.fb': ['ფანდურის ყელი', 'Panduri neck'], 'le.fbAdd': ['დაჭერა ამატებს ნოტს', 'A tap adds a note'], 'le.fbD': ['დააჭირე სიმს და ლადს: მოისმენ; მონიშნულ ნოტს ცვლის; „დამატებით" Playhead-ზე ჩასვამს.', 'Tap a string and fret to hear it; it changes the selected note; with “adds” it puts a note at the playhead.'],
  'le.transpose': ['ტრანსპოზიცია', 'Transpose'], 'le.semi': ['ნახევარტონი', 'Semitones'], 'le.trChords': ['აკორდები', 'Chords'], 'le.trNotes': ['მელოდია', 'Melody'], 'le.transposed': ['ტრანსპოზიცია: {k}', 'Transposed: {k}'],
  'le.metro': ['მეტრონომი', 'Metronome'], 'le.vol': ['ხმა', 'Volume'], 'le.sound': ['ხმის ტიპი', 'Click sound'], 'le.accent': ['ტაქტის პირველი დარტყმა ძლიერად', 'Accent the downbeat'], 'le.subd': ['დაყოფა', 'Subdivision'], 'le.countIn': ['წინასწარი თვლა (დარტყმა)', 'Count-in (beats)'],
  'le.snd.wood': ['ხე', 'Wood'], 'le.snd.click': ['კლიკი', 'Click'], 'le.snd.beep': ['ბიპი', 'Beep'], 'le.snd.rim': ['რიმი', 'Rim'], 'le.snd.cowbell': ['ზარი', 'Cowbell'],
  'le.autosaved': ['ავტომატურად შეინახა {t}', 'Autosaved {t}'], 'le.speedC': ['სიჩქარე %', 'Speed %'], 'le.hard': ['რთული მონაკვეთი', 'Hard passage'], 'le.inv': ['მობრუნებები', 'Inversions'], 'le.voicing': ['პოზიცია ფანდურზე', 'Position on the panduri'], 'le.missing': ['აკლია: {n}', 'Leaves out: {n}'],
  'le.mon': ['მოსმენა', 'Listen'], 'le.monD': ['♪ ხაზის სათაურთან: აკორდები, დარტყმები ან ნოტები ფანდურის ხმით ჟღერს, ჩანაწერთან ერთად — ასე ისმის, სად არ ემთხვევა.', '♪ by a track\'s name: its chords, strokes or notes sound on the panduri together with the recording — so you hear where they do not match.'],
  'le.audioStuck': ['ამ მოწყობილობის საცავმა ჩანაწერი დროულად ვერ მისცა — დააჭირე აქ და მიამაგრე ფაილი თავიდან. დაკვრა ჩანაწერის გარეშეც მუშაობს (♪).', 'This device\'s storage did not hand over the recording in time — tap here and attach the file again. Playback works without it too (♪).'],
  'le.audioBad': ['ეს ჩანაწერი ამ ბრაუზერში არ იკვრება — დააჭირე აქ და მიამაგრე MP3, M4A ან WAV.', 'This browser cannot play this recording — tap here and attach an MP3, M4A or WAV.'],
  'le.noWave': ['ტალღის ფორმა ვერ დაიხაზა, მაგრამ ჩანაწერი ჟღერს.', 'The waveform could not be drawn, but the recording plays.'],
  'le.attached': ['ჩანაწერი მიმაგრდა და ამ მოწყობილობაზე შეინახა', 'Recording attached and kept on this device'], 'le.attachedSession': ['ჩანაწერი ჟღერს, მაგრამ ამ მოწყობილობის საცავში ვერ შეინახა — შემდეგ ჯერზე თავიდან მიამაგრე.', 'The recording plays, but this device\'s storage could not keep it — attach it again next time.'],
  'le.durWarn': ['ეს ფაილი {a} წმ-ია, გაკვეთილი — {b} წმ. თუ სხვა ჩანაწერია, დარტყმები არ დაემთხვევა.', 'This file is {a} s, the lesson {b} s. If it is another recording, the beats will not match.'],
  'le.u.move': ['გადაადგილება', 'Move'], 'le.u.resize': ['ზომის შეცვლა', 'Resize'], 'le.u.add': ['დამატება', 'Add'], 'le.u.del': ['წაშლა', 'Delete'], 'le.u.edit': ['შეცვლა', 'Edit'], 'le.u.split': ['გაყოფა', 'Split'], 'le.u.paste': ['ჩასმა', 'Paste']
});

PD.lessonEditor = (() => {
  const h = PD.h, t = PD.i18n.t, ML = () => PD.musicLib;
  const NAMES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
  const BASE_TR = [['wave', 62], ['chords', 44], ['notes', 150], ['rhythm', 42], ['lyrics', 46], ['tab', 66], ['tempo', 56], ['beats', 30], ['sections', 30], ['markers', 26]];
  /** the tracks: the recording, then every other uploaded or separated audio (each its own lane), then the music */
  function TRK() { const out = []; BASE_TR.forEach(([k, hh]) => { out.push([k, k === 'notes' ? Math.round(hh * ((S && S.vz) || 1)) : hh]); if (k === 'wave' && S && S.extra) S.extra.forEach(p => out.push(['a:' + p.id, 40])); }); return out; }
  const RULER = 28, EDGE = 7, LO = 57, HI = 81;
  let S = null;

  /* ---------------- helpers ---------------- */
  const clone = o => JSON.parse(JSON.stringify(o));
  /** a playhead that runs on its own when there is no recording to follow (same face as an <audio> element) */
  function virtualClock(len) {
    let base = 0, t0 = 0, on = false, rate = 1, stopT = 0;
    const o = { onplay: null, onpause: null, muted: false, src: '', load() {}, preservesPitch: true,
      get currentTime() { return on ? base + (performance.now() - t0) / 1000 * rate : base; }, set currentTime(x) { base = Math.max(0, +x || 0); t0 = performance.now(); },
      get paused() { return !on; }, get duration() { return len(); },
      get playbackRate() { return rate; }, set playbackRate(r) { base = o.currentTime; t0 = performance.now(); rate = r; },
      play() { if (!on) { t0 = performance.now(); on = true; clearInterval(stopT); stopT = setInterval(() => { if (o.currentTime >= len()) { o.pause(); base = len(); } }, 100); o.onplay && o.onplay(); } return Promise.resolve(); },
      pause() { if (on) { base = o.currentTime; on = false; clearInterval(stopT); o.onpause && o.onpause(); } } };
    return o;
  }
  const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
  /** a note heard: on the panduri's own sound at its string and fret, else as a plain tone of that pitch */
  const hear = (m, s, f) => { try { if (!PD.audio.ensure()) return; if (s && f != null && Math.round(PD.theory.midi(s, f)) === m) PD.audio.note(s, f, { vel: .7 }); else PD.audio.tone(m, .6); } catch (_) {} };
  const strip = D => { const o = clone(D); delete o._from; delete o._verified; return o; };
  const fmt = x => { const s = Math.max(0, x); return Math.floor(s / 60) + ':' + (s % 60).toFixed(3).padStart(6, '0'); };
  const midiName = m => NAMES[((m % 12) + 12) % 12] + Math.floor(m / 12 - 1);
  const err = e => { const c = e && (e.code || e.message || ''); PD.ui.toast(t(/not-allowed|42501/.test(c) ? 'le.noAllow' : /conflict|40001/.test(c) ? 'le.conflict' : /PGRST20|relation|does not exist|404/.test(c) ? 'le.noMig' : 'le.offline'), 5000); };
  function beatAt(x) { return ML().beatAt(S.D, x); }
  function timeAt(b) { return ML().timeAt(S.D, b); }
  function fmtPos(x) {
    if (S.mode === 'time') return fmt(x);
    const b = beatAt(x), i = Math.floor(b), bo = ML().barOf(S.D, i);
    return bo.bar + '.' + bo.beat + '.' + String(Math.round((b - i) * 960)).padStart(3, '0');
  }
  function snapT(x, free) {
    if (free || S.snap === 'off') return Math.round(x * 1000) / 1000;
    if (S.snap === 'bar') { const i = Math.round(beatAt(x)); let best = null; for (let j = Math.max(0, i - 8); j <= i + 8 && j < S.D.beats.length; j++) if (ML().barOf(S.D, j).beat === 1 && (best == null || Math.abs(S.D.beats[j] - x) < Math.abs(S.D.beats[best] - x))) best = j; if (best != null) return S.D.beats[best]; }
    const per = { beat: 1, '1/2': 2, '1/3': 3, '1/4': 4 }[S.snap] || 1;
    return Math.round(timeAt(Math.round(beatAt(x) * per) / per) * 1000) / 1000;
  }
  const dur = () => (S.audio && S.audio.duration) || S.D.duration || (S.D.beats[S.D.beats.length - 1] + 2);
  function norm() {
    const D = S.D;
    (D.chords = D.chords || []).sort((a, b) => a.t - b.t);
    (D.notes = D.notes || []).sort((a, b) => a[0] - b[0]);
    if (D.lyrics) D.lyrics.sort((a, b) => a.t - b.t);
    (D.sections = D.sections || []).sort((a, b) => a.from - b.from);
    (D.rhythm = D.rhythm || []).sort((a, b) => a.from - b.from);
    if (!D.rhythm.length) D.rhythm.push({ from: 0, id: 'custom', span: 1, strokes: [{ dir: 'down', pos: 0, acc: false }] });
    if (D.strokes) D.strokes.sort((a, b) => a.t - b.t);
    if (D.tempoPts) D.tempoPts.sort((a, b) => a.t - b.t);
    if (D.markers) D.markers.sort((a, b) => a.t - b.t);
    if (D.meters) D.meters.sort((a, b) => a.b - b.b);
  }

  /* ---------------- undo / redo / keep ---------------- */
  const EDIT_KEYS = ['chords', 'notes', 'strokes', 'rhythm', 'beats', 'tempoPts', 'meters', 'lyrics', 'sections', 'markers'];
  function markEdited(before) { const D = S.D; let b = null; try { b = JSON.parse(before); } catch (_) { return; } D.edited = D.edited || {}; EDIT_KEYS.forEach(k => { if (JSON.stringify(b[k] || null) !== JSON.stringify(D[k] || null)) D.edited[k] = Date.now(); }); }
  function change(label, fn, auto) {
    const before = JSON.stringify(S.D);
    S.undo.push({ label, at: Date.now(), d: before }); if (S.undo.length > 300) S.undo.shift();
    S.redo = []; fn(S.D); norm(); if (!auto) { markEdited(before); S.nextStatus = null; } touched();
  }
  function touched() {
    S.dirty = true; S.ver = (S.ver || 0) + 1; clearTimeout(S.keepT);
    S.keepT = setTimeout(() => { PD.store.set('le.wip.' + S.id, { d: strip(S.D), at: Date.now(), rev: S.rev }); paintHead(); }, 400);
    draw(); inspector(); paintHead();
  }
  function undo() { const u = S.undo.pop(); if (!u) return; S.redo.push({ label: u.label, at: Date.now(), d: JSON.stringify(S.D) }); S.D = JSON.parse(u.d); S.sel = null; norm(); touched(); }
  function redo() { const u = S.redo.pop(); if (!u) return; S.undo.push({ label: u.label, at: Date.now(), d: JSON.stringify(S.D) }); S.D = JSON.parse(u.d); S.sel = null; norm(); touched(); }

  /* ---------------- server ---------------- */
  const rpc = (fn, args) => PD.cloud.db.rpc(fn, args);
  async function loadServer(id) {
    try {
      const rows = await PD.cloud.db.select('song_lesson_drafts', { select: 'draft,rev,status,verified_rev,updated_at', id: 'eq.' + id });
      return rows && rows[0] || null;
    } catch (e) { S && (S.serverErr = e); return null; }
  }
  async function save(note) {
    const st = S.status && !['published', 'teacher-verified', 'not-analyzed', 'analyzing'].includes(S.status) ? S.status : 'manually-edited';
    try {
      const rev = await rpc('song_lesson_save', { p_id: S.id, p_draft: strip(S.D), p_status: S.nextStatus || (S.dirty ? 'manually-edited' : st), p_note: note || (S.undo.length ? S.undo.slice(-3).map(u => u.label).join(', ') : null), p_base_rev: S.rev || null });
      S.rev = rev; S.status = S.nextStatus || (S.dirty ? 'manually-edited' : st); S.nextStatus = null; S.dirty = false; PD.store.del('le.wip.' + S.id);
      PD.ui.toast(t('le.saved', { r: rev })); paintHead(); return true;
    } catch (e) { err(e); return false; }
  }
  async function autosave() {
    if (!S || !S.dirty || !S.rev || S.saving || !(PD.cloud && PD.cloud.configured) || navigator.onLine === false) return;
    S.saving = true;
    try { const rev = await rpc('song_lesson_autosave', { p_id: S.id, p_draft: strip(S.D), p_base_rev: S.rev }); S.rev = rev; S.dirty = false; S.autoAt = Date.now(); PD.store.del('le.wip.' + S.id); paintHead(); }
    catch (e) { if (/conflict|40001/.test(e && (e.code || e.message) || '')) err(e); }
    finally { S.saving = false; }
  }
  async function publish() {
    if (PD.creator && /^cr-/.test(S.id)) return PD.creator.publishDialog(S.id, { save: () => (S.dirty || !S.rev) ? save() : Promise.resolve(true), data: () => strip(S.D), done: () => { S.status = 'published'; paintHead(); } });
    PD.ui.confirm(t('le.pubQ'), async () => {
      if ((S.dirty || !S.rev) && !await save()) return;
      try { await rpc('song_lesson_publish', { p_id: S.id, p_note: null }); S.status = 'published'; ML().setPreview(S.id, null); await ML().loadPublished(); PD.lessons.reload(); PD.ui.toast(t('le.published'), 3500); paintHead(); }
      catch (e) { err(e); }
    });
  }
  async function verify() {
    const on = !(S.verifiedRev && S.verifiedRev === S.rev && !S.dirty);
    if (on && (S.dirty || !S.rev) && !await save()) return;
    try { await rpc('song_lesson_verify', { p_id: S.id, p_on: on }); S.verifiedRev = on ? S.rev : null; S.status = on ? 'teacher-verified' : 'manually-edited'; await ML().loadPublished(); PD.lessons.reload(); PD.ui.toast(t(on ? 'le.verified' : 'le.unverified')); paintHead(); }
    catch (e) { err(e); }
  }
  function revert() {
    PD.ui.confirm(t('le.revertQ'), async () => {
      try { await rpc('song_lesson_revert', { p_id: S.id }); const r = await loadServer(S.id); if (r) { setData(r.draft); S.rev = r.rev; S.status = r.status; } PD.ui.toast(t('le.reverted')); }
      catch (e) {
        if (/not-published/.test(e && (e.message || e.code))) { change(t('le.revert'), () => {}); setData(clone(ML().shipped(S.id) || S.D)); PD.ui.toast(t('le.notPub'), 4000); }
        else err(e);
      }
      PD.store.del('le.wip.' + S.id); S.dirty = false; paintHead();
    });
  }
  function setData(d) { S.ver = (S.ver || 0) + 1; S.D = clone(d); delete S.D._from; delete S.D._verified; norm(); S.sel = null; draw(); inspector(); paintHead(); }
  function history() {
    PD.ui.sheet(async (box, close) => {
      box.append(h('h2', { 'data-t': 'le.history' }));
      const list = h('div', { class: 'le-vlist' }, [h('p', { class: 'muted', text: '…' })]); box.append(list);
      try {
        const rows = await PD.cloud.db.select('song_lesson_versions', { select: 'id,rev,kind,note,created_at', lesson_id: 'eq.' + S.id, order: 'id.desc', limit: 80 }) || [];
        list.innerHTML = '';
        rows.forEach(r => list.append(h('div', { class: 'le-vrow' }, [h('div', {}, [h('b', { text: '#' + r.rev + ' · ' + r.kind }), h('small', { class: 'muted', text: new Date(r.created_at).toLocaleString() + (r.note ? ' · ' + r.note : '') })]),
          h('button', { class: 'btn small', 'data-t': 'le.restore', onclick: async () => { try { const rev = await rpc('song_lesson_restore', { p_id: S.id, p_version: r.id }); const d = await loadServer(S.id); if (d) { change(t('le.restore'), () => {}); setData(d.draft); S.rev = rev; S.dirty = false; S.status = d.status; } close(); } catch (e) { err(e); } } })])));
        if (!rows.length) list.append(h('p', { class: 'muted', text: '—' }));
      } catch (e) { list.innerHTML = ''; list.append(h('p', { class: 'notice', text: t('le.noMig') })); }
      const ch = h('div', { class: 'le-vlist' }); box.append(h('h3', { 'data-t': 'le.changes' }), ch);
      S.undo.slice().reverse().forEach((u, k) => ch.append(h('button', { class: 'le-vrow btn ghost', onclick: () => { for (let i = 0; i <= k; i++) undo(); close(); } }, [h('span', { text: u.label }), h('small', { class: 'muted', text: new Date(u.at).toLocaleTimeString() })])));
      PD.i18n.apply(box);
    });
  }
  async function uploadAudio() {
    const b = await PD.blobs.get('ml.own.' + S.id).catch(() => null);
    if (!b) return attach();
    PD.ui.confirm(t('le.uploadQ'), async () => {
      const ext = (/mpeg|mp3/.test(b.type) ? 'mp3' : /mp4|m4a|aac/.test(b.type) ? 'm4a' : /wav/.test(b.type) ? 'wav' : /ogg/.test(b.type) ? 'ogg' : 'mp3');
      const path = S.id + '/' + Date.now().toString(36) + '.' + ext;
      try {
        await PD.cloud.storage.upload(path, b, p => PD.ui.toast(t('le.uploading', { p: Math.round(p * 100) }), 1500), 'lesson-audio');
        await rpc('song_lesson_set_audio', { p_id: S.id, p_path: path });
        await ML().loadPublished(); PD.lessons.reload(); PD.ui.toast(t('le.uploaded'));
      } catch (e) { err(e); }
    });
  }
  async function attach() {
    const f = await PD.ui.pickFile('audio/*,video/*'); if (!f || !S) return;
    await setSource(URL.createObjectURL(f), () => f.arrayBuffer());
    if (S && S.audioDur && S.D.duration && Math.abs(S.audioDur - S.D.duration) > 2.5) PD.ui.toast(t('le.durWarn', { a: Math.round(S.audioDur), b: Math.round(S.D.duration) }), 6000);
    try { await withTimeout(PD.blobs.put('ml.own.' + S.id, f), 15000); const m = PD.store.get('ml.hasOwn', {}); m[S.id] = true; PD.store.set('ml.hasOwn', m); PD.ui.toast(t('le.attached')); }
    catch (_) { PD.ui.toast(t('le.attachedSession'), 6000); }
  }

  /* ---------------- audio ---------------- */
  async function loadExtra() {
    (S.extra || []).forEach(p => { p.el.pause(); p.el.src = ''; }); S.extra = [];
    if (!(PD.creator && S.D.assets)) return;
    for (const a of S.D.assets.filter(x => x.kind === 'audio' && !x.main)) {
      const url = await PD.creator.assetUrl(S.id, a).catch(() => null); if (!url || !S) continue;
      const el = new Audio(url); el.preload = 'auto'; el.preservesPitch = el.mozPreservesPitch = el.webkitPreservesPitch = true;
      S.extra.push({ id: a.id, name: a.name || a.role, role: a.role, el, peaks: a.peaks ? PD.crdsp.unpeaks(a.peaks) : null });
    }
    applyMix(); draw();
  }
  const mixOff = k => { const m = S.mix[k] || {}, anyS = Object.keys(S.mix).some(x => S.mix[x].s); return !!m.m || (anyS && !m.s); };
  function applyMix() { if (!S) return; S.audio.muted = mixOff('wave'); (S.extra || []).forEach(p => { p.el.muted = mixOff('a:' + p.id); }); }
  function syncExtra(force) { const x = S.audio.currentTime; (S.extra || []).forEach(p => { p.el.playbackRate = S.audio.playbackRate; if (S.audio.paused) { if (!p.el.paused) p.el.pause(); } else if (p.el.paused) p.el.play().catch(() => {}); if (force || Math.abs(p.el.currentTime - x) > .06) { try { p.el.currentTime = x; } catch (_) {} } }); }
  async function loadAudio() {
    S.audioState = 'loading'; draw();
    if (PD.creator && /^cr-/.test(S.id)) await withTimeout(PD.creator.ensureLocal(S.id, S.D), 20000).catch(() => {});
    loadExtra();
    let a = null; try { a = await withTimeout(ML().audioOf(S.id), 8000); } catch (_) { S.audioState = 'stuck'; }   // a storage that never answers must not leave the editor silent
    if (!S) return;
    if (!a) return useVirtual(S.audioState === 'stuck' ? 'stuck' : 'none');
    setSource(a.url, () => fetch(a.url).then(r => r.arrayBuffer()));
  }
  /** no recording: the playhead runs on its own clock, and the tracks are heard on the panduri instead */
  function useVirtual(state) {
    const was = S.audio.currentTime; S.real.pause(); S.useVirt = true; S.noAudio = true; S.audioState = state || 'none'; S.virt.currentTime = was;
    S.mon.rhythm = true; S.mon.notes = true; paintHead(); draw();
  }
  async function setSource(url, getBuf) {
    const at = S.audio.currentTime, rate = S.audio.playbackRate; S.audio.pause();
    S.useVirt = false; S.noAudio = false; S.audioState = 'ok'; S.peaks = null;
    S.real.onerror = () => { if (S && S.real.src === url) useVirtual('bad'); };
    S.real.src = url; S.real.load(); S.real.playbackRate = rate; try { S.real.currentTime = at; } catch (_) {}
    applyMix(); paintHead(); draw();
    try {
      const buf = await getBuf(), ac = new (window.AudioContext || window.webkitAudioContext)();
      const ab = await new Promise((res, rej) => { const p = ac.decodeAudioData(buf, res, rej); if (p && p.then) p.then(res, rej); }); try { ac.close(); } catch (_) {}
      const x = ab.getChannelData(0), R = 200, n = Math.ceil(ab.duration * R), step = ab.sampleRate / R, pk = new Float32Array(n * 2);
      for (let i = 0; i < n; i++) { let lo = 0, hi = 0; for (let j = Math.floor(i * step), e = Math.min(x.length, Math.floor((i + 1) * step)); j < e; j += 2) { const v = x[j]; if (v < lo) lo = v; if (v > hi) hi = v; } pk[2 * i] = lo; pk[2 * i + 1] = hi; }
      if (!S) return; S.peaks = { pk, R }; S.audioDur = ab.duration;
    } catch (_) { if (S && S.audioState === 'ok') S.audioState = 'nowave'; }
    if (S) { paintHead(); draw(); }
  }
  async function playPause() {
    if (S.audio.paused) {
      if (S.range && S.loop && (S.audio.currentTime < S.range[0] || S.audio.currentTime > S.range[1])) S.audio.currentTime = S.range[0];
      const ci = (S.D.metronome || {}).countIn || 0; if (S.met.on && ci > 0) await S.met.countIn(S.audio.currentTime, ci);
      S.recFrom = S.audio.currentTime; S.audio.play().catch(() => {});
    } else S.audio.pause();
  }
  function stop() { S.audio.pause(); S.audio.currentTime = S.range ? S.range[0] : 0; syncExtra(true); draw(); }
  function seek(x) { S.audio.currentTime = Math.max(0, Math.min(dur() - .01, x)); syncExtra(true); draw(); inspector(true); }
  function tick() {
    if (!S || !S.root.isConnected) return;
    const x = S.audio.currentTime;
    if (!S.audio.paused) {
      if (S.loop && S.range && x >= S.range[1]) { S.audio.currentTime = S.range[0]; syncExtra(true); }
      syncExtra(false); if (S.fb) S.fb.paint();
      if (S.follow) { const w = S.cv.clientWidth - S.head; if (x > S.x0 + w / S.zoom * .85 || x < S.x0) S.x0 = Math.max(0, x - w / S.zoom * .15); }
      draw(); S.timeEl.textContent = fmtPos(x);
    }
    S.raf = requestAnimationFrame(tick);
  }

  /* ---------------- geometry ---------------- */
  const lanes = () => { let y = RULER; return TRK().map(([k, hh]) => { const o = { k, y, h: hh }; y += hh; return o; }); };
  const laneOf = k => lanes().find(l => l.k === k);
  const totalH = () => RULER + TRK().reduce((a, x) => a + x[1], 0);
  const tx = x => S.head + (x - S.x0) * S.zoom;
  const xt = px => S.x0 + (px - S.head) / S.zoom;
  function noteRange() { const ms = S.D.notes.map(n => n[2]); const lo = Math.min(...(ms.length ? ms : [57])) - 2, hi = Math.max(...(ms.length ? ms : [69])) + 2; return hi - lo < 14 ? [lo, lo + 14] : [lo, hi]; }
  const noteY = (L, m, rg, rh) => L.y + (rg[1] - m) * rh;
  const sectT = s => [timeAt(s.from), timeAt(s.to)];
  const rhEnd = k => S.D.rhythm[k + 1] ? S.D.rhythm[k + 1].from : S.D.beats.length - 1;
  const chEnd = k => S.D.chords[k + 1] ? S.D.chords[k + 1].t : dur();

  /* ---------------- listening: the tracks themselves on the panduri ---------------- */
  const MON = ['chords', 'rhythm', 'notes'];
  function monEvents() {
    if (S.monCache && S.monCache.v === S.ver) return S.monCache;
    const D = S.D, TB = ML().tab(D);
    const strokes = (D.strokes || patternStrokes(D)).filter(x => x.k !== 'r').slice().sort((a, b) => a.t - b.t);
    const changes = D.chords.filter(c => c.chord || c.play).map(c => ({ t: c.t, c }));
    const notes = D.notes.map((n, i) => ({ t: n[0], d: n[1], tb: TB.notes[i] })).filter(x => x.tb && x.tb.ok && x.tb.s).sort((a, b) => a.t - b.t);
    return (S.monCache = { v: S.ver, rhythm: strokes, chords: changes, notes });
  }
  function strumAt(t0, dir, when, vel, mute, str) {
    const c = ML().chordAt(S.D, t0 + .015), sh = c && ML().chordShape(c); if (!sh || !sh.frets) return;
    if (str) PD.audio.note(str, sh.frets[str - 1], { when, vel }); else PD.audio.strum(sh.frets, dir, { when, vel, mute, gap: .012 });
  }
  function monPump() {
    if (!S || S.audio.paused || !MON.some(k => S.mon[k])) { if (S) S.monAt = null; return; }
    if (!PD.audio.ensure()) return;
    const ac = PD.audio.ctx, t = S.audio.currentTime, r = S.audio.playbackRate || 1, E = monEvents();
    if (S.monAt == null || t < S.monAt - .05 || t > S.monAt + .6 || S.monV !== E.v) { S.monIdx = {}; MON.forEach(k => { let i = 0; while (i < E[k].length && E[k][i].t < t - .005) i++; S.monIdx[k] = i; }); S.monV = E.v; }
    S.monAt = t; const until = t + .12 * r;
    MON.forEach(k => { let i = S.monIdx[k]; const L = E[k];
      while (i < L.length && L[i].t <= until) { const e = L[i++], w = ac.currentTime + (e.t - t) / r; if (w < ac.currentTime - .01 || !S.mon[k] || mixOff(k)) continue;
        if (k === 'rhythm') strumAt(e.t, /[uU]/.test(e.k) ? 'up' : 'down', w, /[DU]/.test(e.k) || e.a ? .85 : .55, e.k === 'm', e.k === 's' ? (e.s || 1) : null);
        else if (k === 'chords') strumAt(e.t, 'down', w, .7);
        else PD.audio.note(e.tb.s, e.tb.f, { when: w, vel: .75, dur: Math.max(.08, e.d / r) }); }
      S.monIdx[k] = i; });
  }

  /* ---------------- drawing ---------------- */
  function draw() {
    if (!S) return;
    const cv = S.cv, dpr = window.devicePixelRatio || 1, W = cv.clientWidth, H = totalH();
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px'; }
    const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    const D = S.D, t0 = S.x0, t1 = xt(W), C = { cu: '#d08a5c', cuL: '#f0b48a', line: 'rgba(255,255,255,.08)', txt: '#e9e6e1', dim: '#8a8a90', bad: '#e2574c', blue: '#5b9bd5' };
    g.font = '600 11px system-ui,-apple-system'; g.textBaseline = 'middle';
    // lanes background + beat grid
    lanes().forEach((L, i) => { g.fillStyle = i % 2 ? 'rgba(255,255,255,.015)' : 'rgba(255,255,255,.03)'; g.fillRect(S.head, L.y, W - S.head, L.h); g.fillStyle = C.line; g.fillRect(0, L.y + L.h - 1, W, 1); });
    const bpb = (D.meter && D.meter.beatsPerBar) || 4, ph = (D.meter && D.meter.phase) || 0;
    const bstep = S.zoom * (D.beats[1] - D.beats[0] || .5);
    void bpb; void ph; const BO = i => ML().barOf(D, i);
    D.beats.forEach((b, i) => { if (b < t0 - 1 || b > t1 + 1) return; const x = tx(b), bar = BO(i).beat === 1; if (!bar && bstep < 5) return; g.fillStyle = bar ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.045)'; g.fillRect(x, RULER, 1, H - RULER); });
    // review bands (the owner's only)
    (S.review || []).forEach(r => { if (r.to < t0 || r.from > t1 || r.to - r.from > dur() * .9) return; g.fillStyle = 'rgba(226,87,76,.10)'; g.fillRect(tx(r.from), RULER, (r.to - r.from) * S.zoom, H - RULER); g.fillStyle = 'rgba(226,87,76,.7)'; g.fillRect(tx(r.from), RULER - 4, (r.to - r.from) * S.zoom, 3); });
    // ruler
    g.fillStyle = '#0d0d10'; g.fillRect(0, 0, W, RULER); g.fillStyle = C.dim;
    if (S.mode === 'time') {
      const steps = [.1, .25, .5, 1, 2, 5, 10, 15, 30, 60], st = steps.find(s => s * S.zoom >= 70) || 60;
      for (let x = Math.floor(t0 / st) * st; x <= t1; x += st) { const px = tx(x); if (px < S.head) continue; g.fillRect(px, RULER - 8, 1, 8); g.fillText(st < 1 ? fmt(x).slice(0, -1) : PD.fmtTime(x), px + 3, 10); }
    } else {
      let every = 1; while (bstep * bpb * every < 46) every *= 2;
      D.beats.forEach((b, i) => { if (b < t0 || b > t1) return; const bo = BO(i); if (bo.beat !== 1 || (bo.bar - 1) % every) return; const px = tx(b); g.fillRect(px, RULER - 10, 1, 10); g.fillText(String(bo.bar), px + 3, 10); });
    }
    if (S.range) { const a = tx(S.range[0]), b = tx(S.range[1]); g.fillStyle = S.loop ? 'rgba(240,180,138,.20)' : 'rgba(255,255,255,.08)'; g.fillRect(a, 0, b - a, H); g.fillStyle = C.cuL; g.fillRect(a, 0, 1.5, H); g.fillRect(b, 0, 1.5, H); }
    const sel = (k, i) => S.sel && S.sel.k === k && S.sel.i.includes(i);
    // 1 waveform (and every other audio track below it)
    const wave = (L2, P, col) => { const m2 = L2.y + L2.h / 2, { pk, R } = P; g.fillStyle = col; for (let px = S.head; px < W; px++) { const a = Math.floor(xt(px) * R), b = Math.max(a + 1, Math.floor(xt(px + 1) * R)); let lo = 0, hi = 0; for (let j = a; j < b && j < pk.length / 2; j++) { if (j < 0) continue; lo = Math.min(lo, pk[2 * j]); hi = Math.max(hi, pk[2 * j + 1]); } g.fillRect(px, m2 - hi * L2.h * .48, 1, Math.max(1, (hi - lo) * L2.h * .48)); } };
    let L = laneOf('wave'), mid = L.y + L.h / 2;
    if (S.peaks) wave(L, S.peaks, mixOff('wave') ? 'rgba(138,138,144,.35)' : 'rgba(208,138,92,.75)');
    else { g.fillStyle = S.audioState === 'nowave' ? C.dim : S.audioState === 'loading' ? C.dim : C.cuL; g.fillText(t({ none: 'le.noAudio', stuck: 'le.audioStuck', bad: 'le.audioBad', nowave: 'le.noWave' }[S.audioState] || 'p.recLoad').slice(0, 170), S.head + 8, mid); }
    (S.extra || []).forEach(p => { const L2 = laneOf('a:' + p.id); if (L2 && p.peaks) wave(L2, p.peaks, mixOff('a:' + p.id) ? 'rgba(138,138,144,.3)' : 'rgba(91,155,213,.7)'); });
    // 2 chords
    L = laneOf('chords');
    D.chords.forEach((c, k) => {
      const a = c.t, b = chEnd(k); if (b < t0 || a > t1) return;
      const x = tx(a), w = Math.max(1, (b - a) * S.zoom), conf = S.conf && S.conf[k], low = conf != null && conf < .6 && !S.editedChord[k];
      g.fillStyle = sel('chords', k) ? 'rgba(240,180,138,.55)' : c.chord ? (low ? 'rgba(226,87,76,.22)' : 'rgba(208,138,92,.26)') : 'rgba(255,255,255,.06)';
      g.fillRect(x + 1, L.y + 5, w - 2, L.h - 10);
      g.fillStyle = sel('chords', k) ? '#fff' : C.cuL; g.fillRect(x, L.y + 3, 2, L.h - 6);
      if (w > 18) { g.fillStyle = C.txt; g.font = '700 13px system-ui'; const sh = ML().shape(c.play || c.chord); g.fillText((c.chord || 'N.C.') + (c.play && c.play !== c.chord ? ' → ' + c.play : '') + (c.chord && !sh ? ' ⚠' : ''), x + 6, L.y + L.h / 2, w - 10); }
    });
    // 3 notes (piano roll)
    L = laneOf('notes'); const rg = noteRange(), rh = L.h / (rg[1] - rg[0] + 1), oct = ML().octaveFor(D);
    g.font = '600 9px system-ui';
    for (let m = rg[0]; m <= rg[1]; m++) { const y = noteY(L, m, rg, rh); if (m % 12 === 0 || m % 12 === 9) { g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(S.head, y, W, 1); } if (rh >= 9 && (m % 12 === 0 || m % 12 === 9)) { g.fillStyle = C.dim; g.fillText(midiName(m), S.head - 30, y + rh / 2); } }
    D.notes.forEach((n, i) => {
      if (n[0] + n[1] < t0 || n[0] > t1) return;
      const x = tx(n[0]), w = Math.max(3, n[1] * S.zoom), y = noteY(L, n[2], rg, rh), bad = n[2] + oct < LO || n[2] + oct > HI;
      g.fillStyle = sel('notes', i) ? C.cuL : 'rgba(208,138,92,.7)'; g.fillRect(x, y + 1, w, Math.max(3, rh - 2));
      if (bad) { g.strokeStyle = C.bad; g.lineWidth = 1.5; g.strokeRect(x, y + 1, w, Math.max(3, rh - 2)); }
    });
    if (S.marquee) { const m = S.marquee; g.strokeStyle = C.cuL; g.lineWidth = 1; g.strokeRect(Math.min(m.x0, m.x1), Math.min(m.y0, m.y1), Math.abs(m.x1 - m.x0), Math.abs(m.y1 - m.y0)); }
    // 4 rhythm
    L = laneOf('rhythm'); g.font = '700 12px system-ui';
    D.rhythm.forEach((r, k) => {
      const a = timeAt(r.from), b = timeAt(rhEnd(k)); if (b < t0 || a > t1) return;
      g.fillStyle = sel('rhythm', k) ? 'rgba(91,155,213,.45)' : 'rgba(91,155,213,.18)'; g.fillRect(tx(a) + 1, L.y + 4, (b - a) * S.zoom - 2, L.h - 8);
      const R = PD.curriculum.anyRhythm(r.id), P = ML().pattern(r);
      g.fillStyle = C.txt; g.fillText(r.id === 'custom' ? t('le.customR') : R ? PD.i18n.pick(R.name) : r.id, tx(a) + 6, L.y + 12);
      if (!D.strokes && bstep * P.span / Math.max(1, P.strokes.length) > 9) for (let bb = r.from; bb < rhEnd(k); bb += P.span) P.strokes.forEach(s => { const x = tx(timeAt(bb + s.pos)); if (x < S.head || x > W) return; g.fillStyle = s.acc ? C.bad : s.dir === 'rest' ? C.dim : C.cuL; g.fillText(s.dir === 'rest' ? '·' : s.dir === 'up' ? '↑' : s.dir === 'mute' ? '×' : s.str ? String(s.str) : '↓', x - 3, L.y + L.h - 11); });
    });
    // every stroke on its own (placed by hand, recorded live, or measured), editable one by one
    if (D.strokes) { g.font = '800 14px system-ui'; D.strokes.forEach((s, j) => { if (s.t < t0 || s.t > t1) return; const x = tx(s.t), on = sel('strokes', j), acc = /[DU]/.test(s.k) || s.a;
      if (on) { g.fillStyle = 'rgba(240,180,138,.35)'; g.fillRect(x - 6, L.y + L.h - 22, 12, 20); }
      g.fillStyle = s.k === 'r' ? C.dim : acc ? C.bad : s.sug ? 'rgba(240,180,138,.62)' : C.cuL; g.fillText(STK[s.k] || '↓', x - 4, L.y + L.h - 11); });
      (S.recBuf || []).forEach(s => { const x = tx(s.t); g.fillStyle = C.blue; g.fillText(STK[s.k] || '↓', x - 4, L.y + L.h - 11); }); }
    // 5 lyrics
    L = laneOf('lyrics'); g.font = '600 12px system-ui';
    (D.lyrics || []).forEach((ln, k) => {
      if (ln.e < t0 || ln.t > t1) return;
      const x = tx(ln.t), w = (ln.e - ln.t) * S.zoom;
      g.fillStyle = sel('lyrics', k) ? 'rgba(240,180,138,.35)' : 'rgba(255,255,255,.07)'; g.fillRect(x, L.y + 4, w, L.h - 8);
      g.fillStyle = C.txt; g.fillText(ln.text, x + 4, L.y + 14, Math.max(10, w - 6));
      (ln.syl || []).forEach(s => { const sx = tx(s.t); g.fillStyle = C.cuL; g.fillRect(sx, L.y + L.h - 16, 1.5, 10); });
    });
    // 6 tablature (E at the top, A at the bottom, like the practice neck)
    L = laneOf('tab'); const TB = ML().tab(D), ys = { 3: L.y + 14, 2: L.y + 33, 1: L.y + 52 };
    [1, 2, 3].forEach(s => { g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(S.head, ys[s], W, s === 1 ? 1.6 : 1); g.fillStyle = '#c38c63'; g.fillText(PD.theory.stringName(s), S.head - 14, ys[s]); });
    g.font = '700 11px system-ui';
    D.notes.forEach((n, i) => { const tb = TB.notes[i]; if (!tb || n[0] > t1 || n[0] + n[1] < t0) return; const x = tx(n[0]); const y = tb.s ? ys[tb.s] : L.y + L.h - 6; const txt = tb.f == null ? '×' : String(tb.f);
      g.fillStyle = '#0b0b0d'; g.fillRect(x - 1, y - 7, g.measureText(txt).width + 4, 14); g.fillStyle = !tb.ok ? C.bad : sel('notes', i) ? '#fff' : tb.own ? C.blue : C.cuL; g.fillText(txt, x + 1, y); });
    // 7 tempo
    L = laneOf('tempo'); const bp = []; for (let i = 0; i + 1 < D.beats.length; i++) bp.push(60 / (D.beats[i + 1] - D.beats[i]));
    const tpb = (D.tempoPts || []).map(q => q.bpm), lo = Math.min(...bp, ...tpb) - 3, hi = Math.max(...bp, ...tpb) + 3, by = v => L.y + 6 + (hi - v) / (hi - lo) * (L.h - 18);
    g.strokeStyle = C.cuL; g.lineWidth = 1.4; g.beginPath(); let started = false;
    bp.forEach((v, i) => { const x = tx((D.beats[i] + D.beats[i + 1]) / 2); if (x < S.head - 20 || x > W + 20) return; if (!started) { g.moveTo(x, by(v)); started = true; } else g.lineTo(x, by(v)); }); g.stroke();
    // the tempo points: steps hold, ramps glide to the next point
    const TP = D.tempoPts || []; S.tscale = { lo, hi, y: L.y, h: L.h };
    if (TP.length) { g.strokeStyle = C.blue; g.lineWidth = 1.6; g.beginPath(); TP.forEach((q, i) => { const x = tx(q.t), y = by(q.bpm), nx = TP[i + 1]; if (i === 0) g.moveTo(Math.max(S.head, x), y); else g.lineTo(x, y); const xe = nx ? tx(nx.t) : W; g.lineTo(xe, nx && q.ramp ? by(nx.bpm) : y); }); g.stroke();
      TP.forEach((q, i) => { const x = tx(q.t); if (x < S.head - 8 || x > W + 8) return; g.fillStyle = sel('tpts', i) ? '#fff' : C.blue; g.beginPath(); g.arc(x, by(q.bpm), sel('tpts', i) ? 5 : 4, 0, 7); g.fill(); g.fillStyle = C.txt; g.font = '600 10px system-ui'; g.fillText(q.bpm.toFixed(q.bpm % 1 ? 1 : 0) + (q.ramp ? ' ↗' : ''), x + 6, by(q.bpm) - 7); }); }
    else { g.fillStyle = C.dim; g.font = '600 10px system-ui'; (D.tempo || []).forEach(s => { const x = tx(timeAt(s.from)); if (x > S.head && x < W) g.fillText(Math.round(s.bpm) + ' BPM', x + 3, L.y + 8); }); }
    // the beat grid: every beat marker, bars and meter changes
    L = laneOf('beats'); g.font = '700 10px system-ui';
    D.beats.forEach((b, i) => { if (b < t0 - .2 || b > t1 + .2) return; const x = tx(b), bo = BO(i), on = sel('beats', i), down = bo.beat === 1;
      if (!down && bstep < 3 && !on) return;
      g.fillStyle = on ? '#fff' : down ? C.cuL : 'rgba(240,180,138,.45)'; g.fillRect(x - (on ? 1.5 : .5), L.y + (down ? 3 : 12), on ? 3 : down ? 1.5 : 1, L.h - (down ? 6 : 15));
      if (down && bstep * bo.bpb > 26) { g.fillStyle = C.dim; g.fillText(String(bo.bar), x + 3, L.y + 9); } });
    ML().meters(D).forEach(m => { const b = D.beats[m.b]; if (b == null || b < t0 || b > t1) return; g.fillStyle = C.blue; g.fillText(m.label || (m.sub === 3 ? m.bpb * 3 + '/8' : m.bpb + '/4'), tx(b) + 3, L.y + L.h - 5); });
    // markers
    L = laneOf('markers'); g.font = '700 11px system-ui';
    (D.markers || []).forEach((m, j) => { if (m.t < t0 - 5 || m.t > t1) return; const x = tx(m.t); g.fillStyle = sel('markers', j) ? '#fff' : '#e7c36a'; g.beginPath(); g.moveTo(x, L.y + 3); g.lineTo(x + 7, L.y + 3); g.lineTo(x, L.y + 12); g.fill(); g.fillRect(x, L.y + 3, 1.2, L.h - 6); g.fillStyle = C.txt; g.fillText(m.text || t('le.marker'), x + 9, L.y + L.h / 2 + 1, 160); });
    // 8 sections
    L = laneOf('sections'); g.font = '700 11px system-ui';
    D.sections.forEach((s, k) => { const [a, b] = sectT(s); if (b < t0 || a > t1) return; const col = { verse: 'rgba(208,138,92,.32)', chorus: 'rgba(240,180,138,.42)', intro: 'rgba(255,255,255,.1)', outro: 'rgba(255,255,255,.1)' }[s.kind] || 'rgba(91,155,213,.28)';
      g.fillStyle = sel('sections', k) ? 'rgba(255,255,255,.4)' : col; g.fillRect(tx(a) + 1, L.y + 3, (b - a) * S.zoom - 2, L.h - 6); g.fillStyle = C.txt; g.fillText(t('ml.sec.' + s.kind) + (s.letter ? ' ' + s.letter : ''), tx(a) + 5, L.y + L.h / 2, Math.max(6, (b - a) * S.zoom - 8)); });
    // headers (fixed on the left)
    g.fillStyle = '#060607'; g.fillRect(0, 0, S.head, H);
    lanes().forEach(L2 => { const ex = /^a:/.test(L2.k) ? (S.extra || []).find(p => 'a:' + p.id === L2.k) : null, name = ex ? (t('cr.role.' + ex.role) || ex.name) : t('le.t.' + L2.k);
      g.fillStyle = S.focus === L2.k ? C.cuL : C.dim; g.font = '700 11px system-ui'; g.fillText(S.head > 60 ? name.slice(0, 12) : name.slice(0, 4), 8, L2.y + 12); g.fillStyle = C.line; g.fillRect(0, L2.y + L2.h - 1, S.head, 1);
      if (MON.includes(L2.k)) { const on = S.mon[L2.k], x = S.head - 21, y = L2.y + L2.h - 18; g.fillStyle = on ? C.cu : 'rgba(255,255,255,.1)'; g.fillRect(x, y, 16, 13); g.fillStyle = on ? '#140b06' : C.txt; g.font = '800 10px system-ui'; g.fillText('♪', x + 4.5, y + 7); }
      if (L2.k === 'wave' || ex) [['m', 'M'], ['s', 'S']].forEach(([f, lab], j) => { const m = S.mix[L2.k] || {}, x = S.head - 40 + j * 19, y = L2.y + L2.h - 18; g.fillStyle = m[f] ? (f === 's' ? '#e7c36a' : C.bad) : 'rgba(255,255,255,.1)'; g.fillRect(x, y, 16, 13); g.fillStyle = m[f] ? '#111' : C.txt; g.font = '800 9px system-ui'; g.fillText(lab, x + 4.5, y + 7); }); });
    g.fillStyle = C.line; g.fillRect(S.head - 1, 0, 1, H);
    // playhead
    const px = tx(S.audio.currentTime || 0); if (px >= S.head) { g.fillStyle = '#fff'; g.fillRect(px - .5, 0, 1.5, H); g.fillStyle = C.cuL; g.beginPath(); g.moveTo(px - 5, 0); g.lineTo(px + 6, 0); g.lineTo(px + .5, 8); g.fill(); }
  }

  /* ---------------- hit testing ---------------- */
  function hit(px, py) {
    const L = lanes().find(l => py >= l.y && py < l.y + l.h), x = xt(px), D = S.D;
    if (py < RULER) return { lane: 'ruler', x };
    if (!L) return { lane: null, x };
    const near = (a, b) => Math.abs(tx(a) - b) <= EDGE;
    if (L.k === 'chords') { for (let k = D.chords.length - 1; k >= 0; k--) { const a = D.chords[k].t, b = chEnd(k); if (near(a, px)) return { lane: 'chords', k, part: 'left', x }; if (k + 1 < D.chords.length && near(b, px)) return { lane: 'chords', k, part: 'right', x }; if (x >= a && x < b) return { lane: 'chords', k, part: 'body', x }; } return { lane: 'chords', x }; }
    if (L.k === 'notes' || L.k === 'tab') {
      const rg = noteRange(), rh = laneOf('notes').h / (rg[1] - rg[0] + 1), TB = L.k === 'tab' ? ML().tab(D) : null, ys = { 3: L.y + 14, 2: L.y + 33, 1: L.y + 52 };
      for (let i = D.notes.length - 1; i >= 0; i--) { const n = D.notes[i], a = tx(n[0]), b = tx(n[0] + n[1]);
        if (L.k === 'notes') { const y = noteY(L, n[2], rg, rh); if (py >= y - 1 && py <= y + rh + 1 && px >= a - 2 && px <= Math.max(b, a + 4) + 2) return { lane: 'notes', k: i, part: px > Math.max(b, a + 4) - EDGE ? 'right' : 'body', x, m: n[2] }; }
        else { const tb = TB.notes[i]; if (tb && tb.s && Math.abs(py - ys[tb.s]) < 9 && px >= a - 3 && px <= a + 18) return { lane: 'tab', k: i, x }; } }
      return { lane: L.k, x, m: L.k === 'notes' ? Math.round(rg[1] - (py - L.y) / rh) : null };
    }
    if (L.k === 'rhythm' && D.strokes && py > L.y + L.h - 24) { let best = -1, bd = 7; D.strokes.forEach((s, j) => { const d = Math.abs(tx(s.t) - px); if (d < bd) { bd = d; best = j; } }); if (best >= 0) return { lane: 'strokes', k: best, x }; }
    if (L.k === 'rhythm') { for (let k = D.rhythm.length - 1; k >= 0; k--) { const a = timeAt(D.rhythm[k].from), b = timeAt(rhEnd(k)); if (k > 0 && near(a, px)) return { lane: 'rhythm', k, part: 'left', x }; if (x >= a && x < b) return { lane: 'rhythm', k, part: 'body', x }; } return { lane: 'rhythm', x }; }
    if (L.k === 'lyrics') { const ly = D.lyrics || []; for (let k = ly.length - 1; k >= 0; k--) { const ln = ly[k]; const si = (ln.syl || []).findIndex(s => near(s.t, px) && py > L.y + L.h - 20); if (si >= 0) return { lane: 'lyrics', k, part: 'syl', si, x }; if (near(ln.t, px)) return { lane: 'lyrics', k, part: 'left', x }; if (near(ln.e, px)) return { lane: 'lyrics', k, part: 'right', x }; if (x >= ln.t && x < ln.e) return { lane: 'lyrics', k, part: 'body', x }; } return { lane: 'lyrics', x }; }
    if (L.k === 'beats') { let best = -1, bd = 1e9; D.beats.forEach((b, i) => { const d = Math.abs(tx(b) - px); if (d < bd) { bd = d; best = i; } }); return bd <= 7 ? { lane: 'beats', k: best, x } : { lane: 'beats', x }; }
    if (L.k === 'tempo') { const sc = S.tscale; if (sc) { const by = v => sc.y + 6 + (sc.hi - v) / (sc.hi - sc.lo) * (sc.h - 18); for (let k = (D.tempoPts || []).length - 1; k >= 0; k--) { const q = D.tempoPts[k]; if (Math.hypot(tx(q.t) - px, by(q.bpm) - py) < 9) return { lane: 'tpts', k, x }; } } return { lane: 'tempo', x }; }
    if (L.k === 'markers') { for (let k = (D.markers || []).length - 1; k >= 0; k--) if (px >= tx(D.markers[k].t) - 4 && px <= tx(D.markers[k].t) + 60) return { lane: 'markers', k, x }; return { lane: 'markers', x }; }
    if (L.k === 'sections') { for (let k = D.sections.length - 1; k >= 0; k--) { const [a, b] = sectT(D.sections[k]); if (near(a, px)) return { lane: 'sections', k, part: 'left', x }; if (near(b, px)) return { lane: 'sections', k, part: 'right', x }; if (x >= a && x < b) return { lane: 'sections', k, part: 'body', x }; } return { lane: 'sections', x }; }
    return { lane: L.k, x };
  }

  /* ---------------- pointer ---------------- */
  function onDown(e) {
    const r = S.cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    S.pointers.set(e.pointerId, { x: px, y: py });
    if (S.pointers.size === 2) { const [a, b] = [...S.pointers.values()]; S.pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), z: S.zoom, x: xt((a.x + b.x) / 2) }; S.drag = null; return; }
    if (px < S.head) { const L = lanes().find(l => py >= l.y && py < l.y + l.h); if (L) {
      if (MON.includes(L.k) && py >= L.y + L.h - 19 && px >= S.head - 22) { S.mon[L.k] = !S.mon[L.k]; PD.store.set('le.mon', S.mon); S.monAt = null; if (S.mon[L.k]) PD.audio.ensure(); draw(); return; }
      if ((L.k === 'wave' || /^a:/.test(L.k)) && py >= L.y + L.h - 19 && px >= S.head - 41) { const f = px < S.head - 21 ? 'm' : 's', m = S.mix[L.k] = S.mix[L.k] || {}; m[f] = !m[f]; applyMix(); draw(); return; }
      S.focus = L.k; draw(); inspector(); } return; }
    S.cv.setPointerCapture(e.pointerId);
    const H2 = hit(px, py), D = S.D, free = e.altKey;
    S.focus = H2.lane && H2.lane !== 'ruler' ? H2.lane : S.focus;
    S.drag = { H: H2, px, py, moved: false, free, before: JSON.stringify(D) };
    if (H2.lane === 'wave' && S.noAudio && !S.peaks) { S.drag = null; attach(); return; }
    if (H2.lane === 'ruler' || H2.lane === 'wave' || /^a:/.test(H2.lane || '')) { S.drag.kind = 'range'; return; }
    if (H2.k == null) {
      if (H2.lane === 'notes') { S.drag.kind = 'marquee'; S.marquee = { x0: px, y0: py, x1: px, y1: py }; if (!e.shiftKey) S.sel = null; }
      else { S.sel = null; S.drag.kind = 'seek'; }
      inspector(); draw(); return;
    }
    const k = H2.lane === 'tab' ? 'notes' : H2.lane;
    if (e.shiftKey && S.sel && S.sel.k === k) { S.sel.i = S.sel.i.includes(H2.k) ? S.sel.i.filter(i => i !== H2.k) : S.sel.i.concat(H2.k); }
    else if (!(S.sel && S.sel.k === k && S.sel.i.includes(H2.k))) S.sel = { k, i: [H2.k] };
    S.drag.kind = 'item';
    S.drag.orig = clone({ chords: D.chords, notes: D.notes, lyrics: D.lyrics || [], sections: D.sections, rhythm: D.rhythm, beats: D.beats, strokes: D.strokes || [], tempoPts: D.tempoPts || [], markers: D.markers || [] });
    if (k === 'notes') { const n = D.notes[H2.k]; if (n) hear(n[2] + ML().octaveFor(D), n[3], n[4]); }
    if (PD.audio.ensure()) { if (k === 'chords' && H2.part === 'body' && D.chords[H2.k]) strumAt(D.chords[H2.k].t, 'down', 0, .7);
      if (k === 'strokes' && D.strokes[H2.k]) { const st = D.strokes[H2.k]; if (st.k !== 'r') strumAt(st.t, /[uU]/.test(st.k) ? 'up' : 'down', 0, /[DU]/.test(st.k) ? .85 : .6, st.k === 'm', st.k === 's' ? (st.s || 1) : null); } }
    draw(); inspector();
  }
  function onMove(e) {
    const r = S.cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    if (S.pointers.has(e.pointerId)) S.pointers.set(e.pointerId, { x: px, y: py });
    if (S.pinch && S.pointers.size === 2) { const [a, b] = [...S.pointers.values()], d = Math.hypot(a.x - b.x, a.y - b.y); setZoom(S.pinch.z * d / S.pinch.d, S.pinch.x, (a.x + b.x) / 2); return; }
    const G = S.drag;
    if (!G) { const H2 = hit(px, py); S.cv.style.cursor = H2.part === 'left' || H2.part === 'right' || H2.part === 'syl' || (H2.lane === 'beats' || H2.lane === 'strokes' || H2.lane === 'markers') && H2.k != null ? 'ew-resize' : H2.lane === 'tpts' ? 'move' : H2.k != null ? 'grab' : 'default'; return; }
    if (Math.abs(px - G.px) + Math.abs(py - G.py) > 3) G.moved = true; if (!G.moved) return;
    const D = S.D, x = xt(px), dx = (px - G.px) / S.zoom, free = e.altKey || G.free, H2 = G.H;
    if (G.kind === 'range') { const a = snapT(xt(G.px), free), b = snapT(x, free); S.range = [Math.min(a, b), Math.max(a, b)]; draw(); return; }
    if (G.kind === 'marquee') { S.marquee.x1 = px; S.marquee.y1 = py; const L = laneOf('notes'), rg = noteRange(), rh = L.h / (rg[1] - rg[0] + 1), m = S.marquee;
      const xa = xt(Math.min(m.x0, m.x1)), xb = xt(Math.max(m.x0, m.x1)), ya = Math.min(m.y0, m.y1), yb = Math.max(m.y0, m.y1);
      S.sel = { k: 'notes', i: D.notes.map((n, i) => (n[0] + n[1] >= xa && n[0] <= xb && noteY(L, n[2], rg, rh) + rh >= ya && noteY(L, n[2], rg, rh) <= yb) ? i : -1).filter(i => i >= 0) }; draw(); return; }
    if (G.kind !== 'item') return;
    if (!G.pushed) { S.undo.push({ label: t(H2.part === 'body' ? 'le.u.move' : 'le.u.resize') + ' · ' + t('le.t.' + (H2.lane === 'tab' ? 'notes' : H2.lane)), at: Date.now(), d: G.before }); S.redo = []; G.pushed = true; }
    const O = G.orig, k = H2.k;
    if (H2.lane === 'chords') {
      const c = D.chords, lim = (i, v) => Math.max(i > 0 ? c[i - 1].t + .02 : 0, Math.min(i + 1 < c.length ? c[i + 1].t - .02 : dur(), v));
      if (H2.part === 'left') c[k].t = lim(k, snapT(O.chords[k].t + dx, free));
      else if (H2.part === 'right') { if (k + 1 < c.length) c[k + 1].t = lim(k + 1, snapT(O.chords[k + 1].t + dx, free)); }
      else { const nt = snapT(O.chords[k].t + dx, free), d2 = nt - O.chords[k].t; c[k].t = lim(k, nt); if (k + 1 < c.length) c[k + 1].t = lim(k + 1, O.chords[k + 1].t + d2); }
      S.editedChord[k] = true;
    } else if (H2.lane === 'notes') {
      const L = laneOf('notes'), rg = noteRange(), rh = L.h / (rg[1] - rg[0] + 1), dm = -Math.round((py - G.py) / rh);
      if (H2.part === 'right') S.sel.i.forEach(i => { D.notes[i][1] = Math.max(.03, Math.round((O.notes[i][1] + dx) * 1000) / 1000); });
      else S.sel.i.forEach(i => { D.notes[i][0] = Math.max(0, (S.sel.i.length === 1 ? snapT(O.notes[i][0] + dx, free) : Math.round((O.notes[i][0] + dx) * 1000) / 1000)); D.notes[i][2] = O.notes[i][2] + dm; if (dm) { D.notes[i].length = 3; } });
    } else if (H2.lane === 'rhythm' && H2.part === 'left') {
      const nb = Math.round(beatAt(x)); D.rhythm[k].from = Math.max(D.rhythm[k - 1].from + 1, Math.min(rhEnd(k) - 1, nb));
    } else if (H2.lane === 'lyrics') {
      const ln = D.lyrics[k], o = O.lyrics[k];
      if (H2.part === 'syl') ln.syl[H2.si].t = Math.max(ln.t, Math.min(ln.e, Math.round((o.syl[H2.si].t + dx) * 1000) / 1000));
      else if (H2.part === 'left') ln.t = Math.min(ln.e - .1, snapT(o.t + dx, free));
      else if (H2.part === 'right') ln.e = Math.max(ln.t + .1, snapT(o.e + dx, free));
      else { const d2 = snapT(o.t + dx, free) - o.t; ln.t = o.t + d2; ln.e = o.e + d2; (ln.syl || []).forEach((s, i) => { s.t = Math.round((o.syl[i].t + d2) * 1000) / 1000; }); }
    } else if (H2.lane === 'beats') {
      const b = D.beats; b[k] = Math.round(Math.max(k > 0 ? b[k - 1] + .05 : 0, Math.min(k + 1 < b.length ? b[k + 1] - .05 : dur(), O.beats[k] + dx)) * 1000) / 1000;
    } else if (H2.lane === 'strokes') {
      S.sel.i.forEach(i => { D.strokes[i].t = Math.max(0, S.sel.i.length === 1 ? snapT(O.strokes[i].t + dx, free) : Math.round((O.strokes[i].t + dx) * 1000) / 1000); delete D.strokes[i].sug; });
    } else if (H2.lane === 'markers') { D.markers[k].t = Math.max(0, snapT(O.markers[k].t + dx, free));
    } else if (H2.lane === 'tpts') {
      const q = D.tempoPts[k], o = O.tempoPts[k], sc = S.tscale, P2 = D.tempoPts;
      q.t = Math.round(Math.max(k > 0 ? P2[k - 1].t + .05 : 0, Math.min(k + 1 < P2.length ? P2[k + 1].t - .05 : dur(), o.t + dx)) * 1000) / 1000;
      if (sc) q.bpm = Math.round(Math.max(20, Math.min(320, o.bpm - (py - G.py) / (sc.h - 18) * (sc.hi - sc.lo))) * 10) / 10;
    } else if (H2.lane === 'sections') {
      const s = D.sections[k], o = O.sections[k], nb = Math.round(beatAt(x));
      if (H2.part === 'left') { s.from = Math.max(k > 0 ? D.sections[k - 1].from + 1 : 0, Math.min(s.to - 1, nb)); if (k > 0) D.sections[k - 1].to = s.from; }
      else if (H2.part === 'right') { s.to = Math.min(k + 1 < D.sections.length ? D.sections[k + 1].to - 1 : D.beats.length - 1, Math.max(s.from + 1, nb)); if (k + 1 < D.sections.length) D.sections[k + 1].from = s.to; }
      void o;
    }
    draw(); inspector(true);
  }
  function onUp(e) {
    S.pointers.delete(e.pointerId); if (S.pointers.size < 2) S.pinch = null;
    const G = S.drag; S.drag = null; if (!G) return;
    if (G.kind === 'range' && !G.moved) { S.range = null; seek(snapT(G.H.x, true)); }
    else if (G.kind === 'seek' && !G.moved) seek(G.H.x);
    else if (G.kind === 'marquee') { S.marquee = null; draw(); inspector(); }
    else if (G.kind === 'item' && G.moved) { norm(); markEdited(G.before); touched(); }
    else draw();
  }
  function onDbl(e) {
    const r = S.cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top, H2 = hit(px, py), D = S.D, x = snapT(H2.x, e.altKey);
    if (H2.lane === 'chords') {
      if (H2.k != null && H2.part === 'body') { S.sel = { k: 'chords', i: [H2.k] }; inspector(); const f = S.insp.querySelector('select'); if (f) f.focus(); return; }
      insertChord(x);
    } else if (H2.lane === 'notes' && H2.k == null) {
      const len = Math.max(.1, (D.beats[1] - D.beats[0]) / 2);
      change(t('le.u.add') + ' · ' + t('le.t.notes'), () => D.notes.push([x, Math.round(len * 1000) / 1000, H2.m]));
      S.sel = { k: 'notes', i: [D.notes.findIndex(n => n[0] === x && n[2] === H2.m)] }; inspector(); draw();
    } else if (H2.lane === 'rhythm') {
      const b = Math.round(beatAt(H2.x)), cur = ML().pattern ? D.rhythm.filter(rr => rr.from <= b).pop() : null;
      if (!cur || cur.from === b) return;
      change(t('le.u.split') + ' · ' + t('le.t.rhythm'), () => D.rhythm.push(Object.assign(clone(cur), { from: b })));
      S.sel = { k: 'rhythm', i: [D.rhythm.findIndex(rr => rr.from === b)] }; inspector(); draw();
    } else if (H2.lane === 'lyrics' && H2.k == null) addLine(x);
    else if (H2.lane === 'strokes' || (H2.lane === 'rhythm' && D.strokes && py > laneOf('rhythm').y + laneOf('rhythm').h - 24)) addStroke(x);
    else if (H2.lane === 'tempo') addTempoPoint(x);
    else if (H2.lane === 'beats' && H2.k == null) change(t('le.beatIns'), () => { D.beats.push(Math.round(H2.x * 1000) / 1000); D.beats.sort((a, b) => a - b); });
    else if (H2.lane === 'markers' && H2.k == null) addMarker(x);
    else if (H2.lane === 'sections') splitSection(Math.round(beatAt(H2.x)));
  }
  function onWheel(e) {
    e.preventDefault();
    const r = S.cv.getBoundingClientRect(), px = e.clientX - r.left;
    if (e.altKey) { S.vz = Math.max(.5, Math.min(4, (S.vz || 1) * Math.exp(-e.deltaY * .002))); draw(); return; }
    if (e.ctrlKey || e.metaKey) setZoom(S.zoom * Math.exp(-e.deltaY * .0025), xt(px), px);
    else { const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : e.deltaY; S.x0 = Math.max(0, Math.min(dur() - 2, S.x0 + d / S.zoom)); draw(); }
  }
  function setZoom(z, at, px) { const W = S.cv.clientWidth - S.head; S.zoom = Math.max(W / Math.max(5, dur()), Math.min(1600, z)); if (at != null) S.x0 = Math.max(0, at - (px - S.head) / S.zoom); draw(); }

  /* ---------------- edit actions ---------------- */
  function insertChord(x) {
    const D = S.D, c = ML().chordAt(D, x);
    if (D.chords.some(cc => Math.abs(cc.t - x) < .02)) return;
    change(t('le.u.add') + ' · ' + t('le.t.chords'), () => D.chords.push({ t: x, chord: c ? c.chord : 'C' }));
    S.sel = { k: 'chords', i: [D.chords.findIndex(cc => cc.t === x)] }; inspector(); draw();   // the keys stay on the timeline (Delete, S, arrows); a double-click opens the name
  }
  function splitAt(x) {
    const D = S.D, s = S.sel;
    if (s && s.k === 'notes') { change(t('le.u.split') + ' · ' + t('le.t.notes'), () => s.i.forEach(i => { const n = D.notes[i]; if (x > n[0] + .02 && x < n[0] + n[1] - .02) { D.notes.push([x, Math.round((n[0] + n[1] - x) * 1000) / 1000, n[2]]); n[1] = Math.round((x - n[0]) * 1000) / 1000; } })); return; }
    if (s && s.k === 'sections') return splitSection(Math.round(beatAt(x)));
    insertChord(x);   // splitting a chord = the same chord starting again here, ready to be renamed
  }
  function splitSection(b) {
    const D = S.D, k = D.sections.findIndex(s => s.from < b && b < s.to); if (k < 0) return;
    change(t('le.u.split') + ' · ' + t('le.t.sections'), () => { const s = D.sections[k]; D.sections.splice(k + 1, 0, Object.assign(clone(s), { from: b })); s.to = b; });
  }
  function addLine(x) {
    const D = S.D; change(t('le.addLine'), () => { (D.lyrics = D.lyrics || []).push({ t: x, e: Math.min(dur(), x + 3), text: '…', syl: [], src: 'owner' }); });
    S.sel = { k: 'lyrics', i: [S.D.lyrics.findIndex(l => l.t === x)] }; inspector(); draw();
  }
  const STK = { d: '↓', D: '↓', u: '↑', U: '↑', r: '·', m: '×', s: '1', c: '•' };
  /** the song's strokes as single events, from its rhythm patterns (each down, up and pause then moves on its own) */
  function patternStrokes(D, from, to) {
    const out = [], n = D.beats.length - 1, a = from == null ? 0 : from, b = to == null ? n : to;
    for (let r = 0; r < n;) { const R = (D.rhythm || []).filter(x => x.from <= r + 1e-6).pop() || D.rhythm[0], P = ML().pattern(R), f0 = R ? R.from : 0;
      if ((r - f0) % P.span > 1e-6 && r > f0) { r++; continue; } const nextR = (D.rhythm || []).find(x => x.from > r + 1e-6);
      P.strokes.forEach(s => { const bb = r + s.pos; if (bb >= n || bb < a - 1e-6 || bb >= b - 1e-6 || (nextR && bb >= nextR.from)) return;
        out.push({ t: Math.round(timeAt(bb) * 1000) / 1000, k: s.dir === 'rest' ? 'r' : s.dir === 'mute' ? 'm' : s.str ? 's' : s.dir === 'up' ? (s.acc ? 'U' : 'u') : (s.acc ? 'D' : 'd'), s: s.str || undefined }); });
      r += P.span; }
    return out;
  }
  function ensureStrokes(D) { if (!D.strokes) D.strokes = patternStrokes(D); }
  function addStroke(x) { const D = S.D; change(t('le.u.add') + ' · ' + t('le.t.strokes'), () => { ensureStrokes(D); const prev = D.strokes.filter(s => s.t < x).pop(); D.strokes.push({ t: x, k: prev && /[dD]/.test(prev.k) ? 'u' : 'd' }); }); S.sel = { k: 'strokes', i: [S.D.strokes.findIndex(s => s.t === x)] }; inspector(); draw(); }
  function addMarker(x) { const D = S.D; x = Math.round(x * 1000) / 1000; change(t('le.u.add') + ' · ' + t('le.t.markers'), () => { (D.markers = D.markers || []).push({ t: x, text: t('le.marker') + ' ' + ((D.markers || []).length + 1) }); }); S.sel = { k: 'markers', i: [S.D.markers.findIndex(m => m.t === x)] }; inspector(); draw(); }
  function localBpm(x) { const B = S.D.beats; let i = 0; while (i + 2 < B.length && B[i + 1] <= x) i++; return Math.round(60 / (B[i + 1] - B[i]) * 10) / 10; }
  function addTempoPoint(x) { const D = S.D; x = Math.round(x * 1000) / 1000; change(t('le.tpAdd'), () => { (D.tempoPts = D.tempoPts || []).push({ t: x, bpm: localBpm(x), ramp: false }); }); S.sel = { k: 'tpts', i: [S.D.tempoPts.findIndex(q => q.t === x)] }; inspector(); draw(); }
  /** beats from a tempo point onwards follow the owner's tempo (until the next point, or the end) — the audio is not touched */
  function applyTempo(k, toEnd) {
    const D = S.D, P2 = D.tempoPts, q = P2[k]; if (!q) return;
    const end = toEnd || !P2[k + 1] ? dur() : P2[k + 1].t;
    change(t('le.tpApply'), () => { let a = 0; D.beats.forEach((b, i) => { if (Math.abs(b - q.t) < Math.abs(D.beats[a] - q.t)) a = i; }); const t0 = Math.abs(D.beats[a] - q.t) < .25 ? D.beats[a] : q.t;
      const nb = PD.crdsp.beatsFrom(P2, t0, end), last = nb[nb.length - 1], gap = nb.length > 1 ? (nb[nb.length - 1] - nb[nb.length - 2]) * .5 : .2;
      D.beats = D.beats.filter(b => b < t0 - 1e-3).concat(nb, D.beats.filter(b => b > last + gap)); });
  }
  /* tap tempo · live recording · latency */
  function tap() {
    const now = S.audio.currentTime - (S.lat || 0) / 1000;
    if (S.calib) { const B = S.D.beats; let nb = B[0]; B.forEach(b => { if (Math.abs(b - S.audio.currentTime) < Math.abs(nb - S.audio.currentTime)) nb = b; }); S.calib.push(S.audio.currentTime - nb);
      if (S.calib.length >= 8) { const v = S.calib.slice().sort((a, b) => a - b), ms = Math.round(v[4] * 1000); S.lat = ms; PD.store.set('le.lat', ms); S.calib = null; PD.ui.toast(t('le.calibDone', { ms })); } return; }
    if (S.audio.paused) { const n = performance.now(); S.tapsP = (S.tapsP || []).filter(x => n - x < 2500).concat(n); if (S.tapsP.length > 2) { const d = (S.tapsP[S.tapsP.length - 1] - S.tapsP[0]) / (S.tapsP.length - 1); PD.ui.toast(t('le.tapBpm', { b: (60000 / d).toFixed(1) }), 1200); } return; }
    (S.taps = S.taps || []).push(Math.round(now * 1000) / 1000); clearTimeout(S.tapT); S.tapT = setTimeout(commitTaps, 1600); draw();
  }
  function commitTaps() {
    const T2 = (S.taps || []).slice().sort((a, b) => a - b); S.taps = null; if (T2.length < 4) return;
    const ibi = (T2[T2.length - 1] - T2[0]) / (T2.length - 1);
    change(t('le.tap'), () => { const D = S.D; D.beats = D.beats.filter(b => b < T2[0] - ibi * .5 || b > T2[T2.length - 1] + ibi * .5).concat(T2).sort((a, b) => a - b); });
    PD.ui.toast(t('le.tapped', { n: T2.length, b: (60 / ibi).toFixed(1) }));
  }
  const recKeys = () => Object.assign({ d: 'd', u: 'u', m: 'm', r: 'p', s: 'x' }, PD.store.get('le.recKeys', {}));
  function recChord(i) {
    const nm = (S.pal || [])[i]; if (!nm || S.audio.paused) return;
    const x = snapT(Math.max(0, S.audio.currentTime - (S.lat || 0) / 1000));
    change(t('le.recC') + ' · ' + nm, () => { const D = S.D, near = D.chords.find(c => Math.abs(c.t - x) < .05); if (near) { near.chord = nm; delete near.play; delete near.v; } else D.chords.push({ t: x, chord: nm }); });
  }
  function recStroke(e) {
    const K = recKeys(), key = e.key.toLowerCase(), act = Object.keys(K).find(a => K[a] === key); if (!act) return false;
    e.preventDefault(); if (S.audio.paused) return true;
    const k = act === 'd' ? (e.shiftKey ? 'D' : 'd') : act === 'u' ? (e.shiftKey ? 'U' : 'u') : act;
    (S.recBuf = S.recBuf || []).push({ t: Math.round(Math.max(0, S.audio.currentTime - (S.lat || 0) / 1000) * 1000) / 1000, k, s: k === 's' ? 1 : undefined }); draw(); return true;
  }
  function commitRec() {
    const buf = S.recBuf; S.recBuf = null; if (!buf || !buf.length) return;
    const a = Math.min(S.recFrom != null ? S.recFrom : buf[0].t, buf[0].t), b = Math.max(S.audio.currentTime, buf[buf.length - 1].t);
    change(t('le.recR'), () => { const D = S.D; ensureStrokes(D); D.strokes = D.strokes.filter(s => s.t < a || s.t > b).concat(buf); });
    PD.ui.toast(t('le.recDone', { n: buf.length }));
  }
  function del() {
    const s = S.sel, D = S.D; if (!s) return;
    change(t('le.u.del') + ' · ' + t('le.t.' + s.k), () => {
      const idx = s.i.slice().sort((a, b) => b - a);
      if (s.k === 'strokes') idx.forEach(i => D.strokes.splice(i, 1));
      else if (s.k === 'beats') idx.forEach(i => { if (D.beats.length > 3) D.beats.splice(i, 1); });
      else if (s.k === 'tpts') idx.forEach(i => D.tempoPts.splice(i, 1));
      else if (s.k === 'markers') idx.forEach(i => D.markers.splice(i, 1));
      if (s.k === 'chords') idx.forEach(i => D.chords.splice(i, 1));
      else if (s.k === 'notes') idx.forEach(i => D.notes.splice(i, 1));
      else if (s.k === 'lyrics') idx.forEach(i => D.lyrics.splice(i, 1));
      else if (s.k === 'rhythm') idx.forEach(i => { if (i > 0) D.rhythm.splice(i, 1); });
      else if (s.k === 'sections') idx.forEach(i => { if (D.sections.length > 1) { const sc = D.sections[i]; if (i > 0) D.sections[i - 1].to = sc.to; else D.sections[1].from = sc.from; D.sections.splice(i, 1); } });
    });
    S.sel = null; inspector(); draw();
  }
  function copy() {
    const D = S.D;
    if (S.sel && S.sel.k === 'notes') { const ns = S.sel.i.map(i => D.notes[i]), t0 = Math.min(...ns.map(n => n[0])); S.clip = { k: 'notes', items: ns.map(n => [n[0] - t0, n[1], n[2]]) }; PD.ui.toast(t('le.copied', { n: ns.length })); return; }
    const [a, b] = S.range || (S.sel && S.sel.k === 'chords' ? [D.chords[S.sel.i[0]].t, chEnd(S.sel.i[S.sel.i.length - 1])] : [null, null]); if (a == null) return;
    const items = D.chords.filter((c, k) => c.t >= a - 1e-3 && c.t < b - 1e-3).map(c => Object.assign({}, c, { t: c.t - a }));
    const head = ML().chordAt(D, a); if (head && !items.some(c => c.t < .001)) items.unshift(Object.assign({}, head, { t: 0 }));
    const strokes = (D.strokes || []).filter(x => x.t >= a - 1e-3 && x.t < b - 1e-3).map(x => Object.assign({}, x, { t: x.t - a }));
    S.clip = { k: 'chords', items, len: b - a, strokes }; PD.ui.toast(t('le.copied', { n: items.length }));
  }
  function paste(at) {
    const c = S.clip, D = S.D; if (!c) return;
    change(t('le.u.paste'), () => {
      if (c.k === 'notes') c.items.forEach(n => D.notes.push([Math.round((at + n[0]) * 1000) / 1000, n[1], n[2]]));
      else { const end = at + c.len, after = ML().chordAt(D, end); D.chords = D.chords.filter(x => x.t < at - 1e-3 || x.t >= end - 1e-3); c.items.forEach(x => D.chords.push(Object.assign({}, x, { t: Math.round((at + x.t) * 1000) / 1000 }))); if (after && !D.chords.some(x => Math.abs(x.t - end) < .01)) D.chords.push(Object.assign({}, after, { t: Math.round(end * 1000) / 1000 }));
        if (D.strokes && c.strokes && c.strokes.length) { D.strokes = D.strokes.filter(x => x.t < at - 1e-3 || x.t >= end - 1e-3).concat(c.strokes.map(x => Object.assign({}, x, { t: Math.round((at + x.t) * 1000) / 1000 }))); } }
    });
    PD.ui.toast(t('le.pasted', { n: c.items.length }));
  }
  function duplicate() {
    if (S.sel && S.sel.k === 'notes' && !S.range) { const D = S.D, ns = S.sel.i.map(i => D.notes[i]), a = Math.min(...ns.map(n => n[0])), b = Math.max(...ns.map(n => n[0] + n[1])); change(t('le.dupN'), () => ns.forEach(n => { const m = n.slice(); m[0] = Math.round((n[0] + b - a) * 1000) / 1000; D.notes.push(m); })); return; }
    if (!S.range) { if (S.sel && S.sel.k === 'chords') { const a = S.D.chords[S.sel.i[0]].t, b = chEnd(S.sel.i[S.sel.i.length - 1]); S.range = [a, b]; } else return; } copy(); paste(S.range[1]); const L = S.range[1] - S.range[0]; S.range = [S.range[1], S.range[1] + L]; draw(); }
  function nudge(ms) {
    const s = S.sel, D = S.D; if (!s) return;
    change(t('le.u.move') + ' · ' + t('le.t.' + s.k), () => s.i.forEach(i => {
      if (s.k === 'chords') D.chords[i].t = Math.max(0, Math.round((D.chords[i].t + ms / 1000) * 1000) / 1000);
      else if (s.k === 'notes') D.notes[i][0] = Math.max(0, Math.round((D.notes[i][0] + ms / 1000) * 1000) / 1000);
      else if (s.k === 'lyrics') { const l = D.lyrics[i]; l.t += ms / 1000; l.e += ms / 1000; (l.syl || []).forEach(y => { y.t = Math.round((y.t + ms / 1000) * 1000) / 1000; }); }
      else if (s.k === 'beats') D.beats[i] = Math.round((D.beats[i] + ms / 1000) * 1000) / 1000;
      else if (s.k === 'strokes') { D.strokes[i].t = Math.max(0, Math.round((D.strokes[i].t + ms / 1000) * 1000) / 1000); delete D.strokes[i].sug; }
      else if (s.k === 'markers') D.markers[i].t = Math.max(0, Math.round((D.markers[i].t + ms / 1000) * 1000) / 1000);
      else if (s.k === 'tpts') D.tempoPts[i].t = Math.max(0, Math.round((D.tempoPts[i].t + ms / 1000) * 1000) / 1000);
    }));
  }
  function onKey(e) {
    if (!S || !S.root.isConnected) return;
    const tg = e.target, typing = tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA' || tg.tagName === 'SELECT' || tg.isContentEditable);
    const mod = e.metaKey || e.ctrlKey, k = e.key;
    if (mod && (k === 'z' || k === 'Z')) { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
    if (mod && (k === 'y' || k === 'Y')) { e.preventDefault(); redo(); return; }
    if (mod && (k === 's' || k === 'S')) { e.preventDefault(); save(); return; }
    if (typing) return;
    if (S.rec === 'rhythm' && !mod && k !== ' ' && k !== 'Escape' && recStroke(e)) return;
    if (S.rec === 'chords' && !mod && /^[1-9]$/.test(k)) { e.preventDefault(); recChord(+k - 1); return; }
    if ((k === 't' || k === 'T') && !mod) { e.preventDefault(); tap(); return; }
    if ((k === 'm' || k === 'M') && !mod) { addMarker(S.audio.currentTime); return; }
    if (k === ' ') { e.preventDefault(); playPause(); }
    else if (k === 'Enter' || k === 'Home') { e.preventDefault(); stop(); }
    else if (k === 'Delete' || k === 'Backspace') { e.preventDefault(); del(); }
    else if (mod && (k === 'c' || k === 'C')) { e.preventDefault(); copy(); }
    else if (mod && (k === 'v' || k === 'V')) { e.preventDefault(); paste(snapT(S.audio.currentTime)); }
    else if (mod && (k === 'd' || k === 'D')) { e.preventDefault(); duplicate(); }
    else if (k === 's' || k === 'S') splitAt(snapT(S.audio.currentTime));
    else if (k === 'i' || k === 'I') insertChord(snapT(S.audio.currentTime));
    else if (k === 'l' || k === 'L') { S.loop = !S.loop; paintHead(); draw(); }
    else if (k === 'b' || k === 'B') { S.mode = S.mode === 'time' ? 'bars' : 'time'; paintHead(); draw(); inspector(); }
    else if (k === 'n' || k === 'N') { S.snap = S.snap === 'off' ? 'beat' : 'off'; paintHead(); }
    else if (k === '+' || k === '=') setZoom(S.zoom * 1.4, S.audio.currentTime, tx(S.audio.currentTime));
    else if (k === '-' || k === '_') setZoom(S.zoom / 1.4, S.audio.currentTime, tx(S.audio.currentTime));
    else if (k === 'ArrowLeft' || k === 'ArrowRight') { e.preventDefault(); const ms = (k === 'ArrowLeft' ? -1 : 1) * (e.altKey ? 1 : e.shiftKey ? 100 : 10); if (S.sel) nudge(ms); else seek(S.audio.currentTime + ms / 100); }
    else if (k === 'Escape') { if (S.sel || S.range) { S.sel = null; S.range = null; draw(); inspector(); } else close(); }
  }

  /* ---------------- inspector ---------------- */
  const field = (label, input) => h('label', { class: 'le-f' }, [h('span', { text: label }), input]);
  const num = (v, on, step) => { const i = h('input', { class: 'input', type: 'number', step: step || '0.001', value: String(v) }); i.onchange = () => { const x = parseFloat(i.value); if (isFinite(x)) on(x); }; return i; };
  const txt = (v, on) => { const i = h('input', { class: 'input', type: 'text', value: v || '' }); i.onchange = () => on(i.value); return i; };
  const sel2 = (opts, v, on) => { const s = h('select', { class: 'input' }, opts.map(o => Array.isArray(o) ? h('option', { value: o[0], text: o[1], selected: o[0] === v }) : h('optgroup', { label: o.g }, o.items.map(x => h('option', { value: x[0], text: x[1], selected: x[0] === v }))))); s.onchange = () => on(s.value); return s; };
  function chordOptions() {
    const Q = (PD.theory.CHORD_TYPES || []).map(x => x.k), out = [['N.C.', t('le.nc')]];
    NAMES.forEach(r => out.push({ g: r, items: Q.map(q => [r + q, r + q]) }));
    out.push(['__custom', t('le.custom')]);
    return out;
  }
  function rhythmOptions() {
    const C = PD.curriculum, pk = r => [r.id, PD.i18n.pick(r.name)];
    return [{ g: t('rh.teacherSec'), items: C.rhythms().map(pk) }, { g: t('rh.regionSec'), items: (C.regionalRhythms ? C.regionalRhythms() : []).map(pk) }, { g: t('rh.commonSec'), items: C.commonRhythms().map(pk) }, ['custom', t('le.customR')]];
  }
  function inspector(light) {
    if (!S) return;
    if (light && S.insp._sel === JSON.stringify(S.sel) && !S.drag) return;
    const box = S.insp; box.innerHTML = ''; box._sel = JSON.stringify(S.sel);
    const D = S.D, s = S.sel, mut = (label, fn) => change(label, fn);
    const rv = (S.review || []).filter(r => { const x = S.audio.currentTime; return x >= r.from - .5 && x <= r.to + .5 && r.to - r.from < dur() * .9; });
    if (!s || !s.i.length) {
      box.append(h('h3', { 'data-t': S.focus === 'tempo' || S.focus === 'beats' ? 'le.t.tempo' : S.focus === 'markers' ? 'le.t.markers' : 'le.meta' }));
      if (S.focus === 'markers') box.append(h('p', { class: 'muted', text: 'M · ' + t('le.u.add') }), h('button', { class: 'btn small', 'data-t': 'le.u.add', onclick: () => addMarker(S.audio.currentTime) }));
      else if (S.focus === 'tempo' || S.focus === 'beats') {
        box.append(h('p', { class: 'muted', 'data-t': 'le.tpNote' }), h('div', { class: 'row', style: 'gap:6px;flex-wrap:wrap' }, [
          h('button', { class: 'btn small', 'data-t': 'le.tpAdd', onclick: () => addTempoPoint(S.audio.currentTime) }),
          h('button', { class: 'btn small', 'data-t': 'le.tpFromBeats', onclick: () => mut(t('le.tpFromBeats'), () => { D.tempoPts = PD.crdsp.tempoPoints(D.beats, 4); }) }),
          h('button', { class: 'btn small', text: 'Tap (T)', onclick: tap })]), h('small', { class: 'muted', 'data-t': 'le.tapD' }),
          h('small', { class: 'muted', text: (D.tempoPts || []).length + ' · ' + t('le.t.tpts') }));
        const bpm = h('input', { class: 'input', type: 'number', step: '0.1', placeholder: Math.round(D.bpm) + '' });
        box.append(field(t('le.bpmSet'), bpm), h('button', { class: 'btn small', 'data-t': 'le.apply', onclick: () => { const v = parseFloat(bpm.value); if (!(v > 20 && v < 300) || !S.range) return; mut(t('le.t.tempo'), () => { const a = Math.ceil(beatAt(S.range[0]) - 1e-6), b = Math.floor(beatAt(S.range[1]) + 1e-6); for (let i = a + 1; i <= b && i < D.beats.length; i++) D.beats[i] = Math.round((D.beats[a] + (i - a) * 60 / v) * 1000) / 1000; }); } }),
          field(t('le.shift'), num(0, v => mut(t('le.shift'), () => { D.beats = D.beats.map(b => Math.round((b + v / 1000) * 1000) / 1000); }), '1')));
      } else {
        D.title = D.title || { ka: '', en: '' };
        box.append(field(t('le.titleKa'), txt(D.title.ka, v => mut(t('le.meta'), () => { D.title.ka = v; }))), field(t('le.titleEn'), txt(D.title.en, v => mut(t('le.meta'), () => { D.title.en = v; }))),
          field(t('le.artistKa'), txt(D.artist && D.artist.ka, v => mut(t('le.meta'), () => { D.artist = Object.assign({}, D.artist, { ka: v }); }))), field(t('le.artistEn'), txt(D.artist && D.artist.en, v => mut(t('le.meta'), () => { D.artist = Object.assign({}, D.artist, { en: v }); }))),
          field(t('le.level'), sel2([['1', t('lvl.1')], ['2', t('lvl.2')], ['3', t('lvl.3')]], String(D.level || 2), v => mut(t('le.level'), () => { D.level = +v; }))),
          field(t('le.key'), txt(D.key, v => mut(t('le.key'), () => { D.key = v; }))),
          field(t('le.bpb'), sel2([['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7']], String((D.meter || {}).beatsPerBar || 4), v => mut(t('le.meter'), () => { D.meter = Object.assign({}, D.meter, { beatsPerBar: +v }); D.meter.label = D.meter.sub === 3 ? (+v * 3) + '/8' : v + '/4'; }))),
          field(t('le.sub'), sel2([['2', '2 (♩ = ♪♪)'], ['3', '3 (♩. = ♪♪♪)']], String((D.meter || {}).sub || 2), v => mut(t('le.meter'), () => { D.meter = Object.assign({}, D.meter, { sub: +v }); D.meter.label = +v === 3 ? (D.meter.beatsPerBar * 3) + '/8' : D.meter.beatsPerBar + '/4'; }))),
          field(t('le.meter'), txt((D.meter || {}).label, v => mut(t('le.meter'), () => { D.meter = Object.assign({}, D.meter, { label: v }); }))),
          D.noFold ? null : field(t('le.octave'), sel2([['', t('le.auto') + ' (' + ML().octaveFor(Object.assign({}, D, { octave: null })) / 12 + ')'], ['-12', '−1'], ['0', '0'], ['12', '+1'], ['24', '+2']], D.octave == null ? '' : String(D.octave), v => mut(t('le.octave'), () => { D.octave = v === '' ? null : +v; }))));
        if (PD.creator && /^cr-/.test(S.id)) box.append(PD.creator.metaFields(D, mut));
      }
    } else if (s.k === 'chords') {
      const k = s.i[0], c = D.chords[k]; if (!c) return;
      const opts = chordOptions(), known = c.chord == null ? 'N.C.' : opts.some(o => o.items ? o.items.some(x => x[0] === c.chord) : o[0] === c.chord) ? c.chord : '__custom';
      const custom = txt(known === '__custom' ? c.chord : '', v => mut(t('le.u.edit') + ' · ' + t('le.t.chords'), () => { c.chord = v.trim() || null; S.editedChord[k] = true; }));
      custom.hidden = known !== '__custom';
      const nameSel = sel2(opts, known, v => { if (v === '__custom') { custom.hidden = false; custom.focus(); return; } mut(t('le.u.edit') + ' · ' + t('le.t.chords'), () => { c.chord = v === 'N.C.' ? null : v; S.editedChord[k] = true; }); });
      const sh = ML().shape(c.play || c.chord);
      const playSel = sel2([['', t('le.same')]].concat(opts.filter(o => o.items).map(o => ({ g: o.g, items: o.items.filter(x => ML().shape(x[0]) && !ML().shape(x[0]).adapted) }))), c.play || '', v => mut(t('le.play2'), () => { if (v) c.play = v; else delete c.play; }));
      box.append(h('h3', { text: t('le.t.chords') + ' · ' + fmtPos(c.t) }), field(t('le.name'), nameSel), custom, field(t('le.play2'), playSel),
        !sh && c.chord ? h('p', { class: 'notice warn', text: t('le.noShape') }) : sh && sh.adapted && !c.play ? h('p', { class: 'muted', text: t('le.adapted', { a: c.chord, b: sh.name }) }) : null,
        sh ? h('div', { class: 'le-neck', html: ML().chordSVG(c.v ? ML().chordShape(c) : sh) }) : null, voicingPick(c, k),
        h('div', { class: 'le-2' }, [field(t('le.start') + ' (s)', num(c.t.toFixed(3), v => mut(t('le.u.move'), () => { c.t = Math.max(0, v); }))), field(t('le.end') + ' (s)', num(chEnd(k).toFixed(3), v => { if (D.chords[k + 1]) mut(t('le.u.resize'), () => { D.chords[k + 1].t = Math.max(c.t + .02, v); }); }))]),
        S.conf && S.conf[k] != null ? h('small', { class: 'muted', text: t('le.conf', { p: Math.round(S.conf[k] * 100) }) }) : null,
        h('div', { class: 'row', style: 'gap:6px;flex-wrap:wrap' }, [
          h('button', { class: 'btn small', 'data-t': 'le.hear', onclick: () => { if (sh && PD.audio.ensure()) PD.audio.strum(sh.frets, 'down', {}); } }),
          h('button', { class: 'btn small', 'data-t': 'le.split', onclick: () => splitAt(snapT(S.audio.currentTime)) }),
          h('button', { class: 'btn small', 'data-t': 'le.dup', onclick: duplicate }),
          h('button', { class: 'btn small ghost danger', 'data-t': 'le.delete', onclick: del })]));
    } else if (s.k === 'notes') {
      const oct = ML().octaveFor(D), TB = ML().tab(D);
      box.append(noteTools(s.i));
      if (s.i.length > 1) box.append(h('h3', { text: t('le.t.notes') + ' × ' + s.i.length }), h('div', { class: 'row', style: 'gap:6px' }, [h('button', { class: 'btn small', 'data-t': 'le.octUp', onclick: () => mut(t('le.octUp'), () => s.i.forEach(i => { D.notes[i][2] += 12; D.notes[i].length = 3; })) }), h('button', { class: 'btn small', 'data-t': 'le.octDown', onclick: () => mut(t('le.octDown'), () => s.i.forEach(i => { D.notes[i][2] -= 12; D.notes[i].length = 3; })) }), h('button', { class: 'btn small ghost danger', 'data-t': 'le.delete', onclick: del })]));
      else {
        const i = s.i[0], n = D.notes[i], tb = TB.notes[i]; if (!n) return;
        const ms = []; for (let m = 36; m <= 96; m++) ms.push([String(m), midiName(m)]);
        const strSel = sel2([['', t('le.auto')], ['1', PD.theory.stringName(1)], ['2', PD.theory.stringName(2)], ['3', PD.theory.stringName(3)]], n[3] ? String(n[3]) : '', v => mut(t('le.string'), () => { if (!v) n.length = 3; else { n[3] = +v; n[4] = Math.max(0, Math.round(n[2] + oct - PD.theory.midi(+v, 0))); } }));
        const fr = num(tb && tb.f != null ? tb.f : '', v => mut(t('le.fret'), () => { const st = n[3] || (tb && tb.s) || 1; n[3] = st; n[4] = Math.max(0, Math.min(17, Math.round(v))); }), '1');
        const bad = n[2] + oct < LO || n[2] + oct > HI;
        box.append(h('h3', { text: t('le.t.notes') + ' · ' + midiName(n[2]) + (oct ? ' (' + midiName(n[2] + oct) + ')' : '') }),
          field(t('le.pitch'), sel2(ms, String(n[2]), v => mut(t('le.u.edit') + ' · ' + t('le.t.notes'), () => { n[2] = +v; n.length = 3; }))),
          h('div', { class: 'le-2' }, [field(t('le.start') + ' (s)', num(n[0].toFixed(3), v => mut(t('le.u.move'), () => { n[0] = Math.max(0, v); }))), field(t('le.dur') + ' (s)', num(n[1].toFixed(3), v => mut(t('le.u.resize'), () => { n[1] = Math.max(.02, v); })))]),
          h('div', { class: 'le-2' }, [field(t('le.string'), strSel), field(t('le.fret'), fr)]),
          h('div', { class: 'le-2' }, [field(t('le.finger'), sel2([['', t('le.auto')], ['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['T', 'T']], n[5] == null ? '' : String(n[5]), v => mut(t('le.finger'), () => { while (n.length < 6) n.push(null); n[5] = v === '' ? null : v === 'T' ? 'T' : +v; }))),
            field(t('le.art'), sel2(['p', 'h', 'po', 'sl', 'tr', 'gr'].map(a => [a, t('le.art.' + a)]), n[6] || 'p', v => mut(t('le.art'), () => { while (n.length < 7) n.push(null); n[6] = v; })))]),
          h('small', { class: 'muted', text: midiName(n[2] + oct) + ' · MIDI ' + (n[2] + oct) + ' · ' + (440 * Math.pow(2, (n[2] + oct - 69) / 12)).toFixed(1) + ' Hz · ' + fmt(n[0]) + ' → ' + fmt(n[0] + n[1]) }),
          bad ? h('p', { class: 'notice warn', text: t('le.impossible', { m: midiName(n[2] + oct) }) }) : null,
          tb && tb.own && !tb.ok ? h('p', { class: 'notice warn', text: t('le.badTab', { s: PD.theory.stringName(n[3]), f: n[4], m: midiName(Math.round(PD.theory.midi(n[3], n[4]))) }) }) : null,
          h('div', { class: 'row', style: 'gap:6px;flex-wrap:wrap' }, [h('button', { class: 'btn small', 'data-t': 'le.hear', onclick: () => hear(n[2] + oct, n[3], n[4]) }), h('button', { class: 'btn small', 'data-t': 'le.octUp', onclick: () => mut(t('le.octUp'), () => { n[2] += 12; n.length = 3; }) }), h('button', { class: 'btn small', 'data-t': 'le.octDown', onclick: () => mut(t('le.octDown'), () => { n[2] -= 12; n.length = 3; }) }), h('button', { class: 'btn small', 'data-t': 'le.split', onclick: () => splitAt(S.audio.currentTime) }), h('button', { class: 'btn small ghost danger', 'data-t': 'le.delete', onclick: del })]));
      }
    } else if (s.k === 'rhythm') {
      const k = s.i[0], r = D.rhythm[k]; if (!r) return;
      const P = ML().pattern(r), strokes = h('div', { class: 'le-strokes' });
      const KIND = [['down', t('le.s.down')], ['up', t('le.s.up')], ['downA', t('le.s.downA')], ['upA', t('le.s.upA')], ['rest', t('le.s.rest')], ['mute', t('le.s.mute')], ['s1', t('le.s.str', { s: PD.theory.stringName(1) })], ['s2', t('le.s.str', { s: PD.theory.stringName(2) })], ['s3', t('le.s.str', { s: PD.theory.stringName(3) })]];
      const kindOf = x => x.str ? 's' + x.str : x.acc ? x.dir + 'A' : x.dir;
      const toCustom = () => { if (r.id !== 'custom') { const pp = ML().pattern(r); r.id = 'custom'; r.strokes = pp.strokes.map(x => ({ dir: x.dir, pos: +x.pos.toFixed(3), acc: x.acc, str: x.str || undefined })); delete r.pos; delete r.restPos; } };
      P.strokes.forEach((x, j) => strokes.append(h('div', { class: 'le-2' }, [sel2(KIND, kindOf(x), v => mut(t('le.strokes'), () => { toCustom(); const st = r.strokes[j]; delete st.str; if (/^s\d$/.test(v)) { st.dir = 'down'; st.str = +v[1]; st.acc = false; } else { st.dir = v.replace('A', ''); st.acc = /A$/.test(v); } })),
        h('div', { class: 'row', style: 'gap:4px' }, [num(x.pos.toFixed(3), v => mut(t('le.pos'), () => { toCustom(); r.strokes[j].pos = Math.max(0, Math.min((r.span || 1) - .01, v)); }), '0.01'), h('button', { class: 'btn small ghost', text: '✕', onclick: () => mut(t('le.u.del'), () => { toCustom(); r.strokes.splice(j, 1); }) })])])));
      box.append(h('h3', { text: t('le.t.rhythm') + ' · ' + t('le.beat', { n: r.from }) }),
        field(t('le.rhythm'), sel2(rhythmOptions(), r.id, v => mut(t('le.rhythm'), () => { if (v === 'custom') toCustom(); else { r.id = v; delete r.strokes; delete r.pos; delete r.restPos; } }))),
        field(t('le.span'), sel2([['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']], String(r.span || 1), v => mut(t('le.span'), () => { const old = r.span || 1; r.span = +v; if (r.strokes) r.strokes.forEach(x => { x.pos = +(x.pos * r.span / old).toFixed(3); }); }))),
        h('small', { class: 'muted', text: ML().patText(P) }), h('b', { 'data-t': 'le.strokes' }), strokes,
        h('div', { class: 'row', style: 'gap:6px;flex-wrap:wrap' }, [h('button', { class: 'btn small', 'data-t': 'le.addStroke', onclick: () => mut(t('le.addStroke'), () => { toCustom(); const last = r.strokes[r.strokes.length - 1]; r.strokes.push({ dir: last && last.dir === 'down' ? 'up' : 'down', pos: Math.min((r.span || 1) - .05, +((last ? last.pos : 0) + .25).toFixed(3)), acc: false }); }) }),
          h('button', { class: 'btn small', 'data-t': 'le.wholeSong', onclick: () => mut(t('le.wholeSong'), () => { D.rhythm = [Object.assign(clone(r), { from: 0 })]; if (D.strokes) D.strokes = patternStrokes(D); S.sel = null; }) }),
          S.range ? h('button', { class: 'btn small', 'data-t': 'le.fillSel', onclick: () => mut(t('le.fillSel'), () => { const a = Math.ceil(beatAt(S.range[0]) - 1e-6), b = Math.floor(beatAt(S.range[1]) + 1e-6), after = D.rhythm.filter(x => x.from <= b).pop();
            D.rhythm = D.rhythm.filter(x => x.from < a || x.from > b).concat([Object.assign(clone(r), { from: a })], after && after !== r && b < D.beats.length - 1 ? [Object.assign(clone(after), { from: b })] : []); if (D.strokes) { const ta = timeAt(a), tb = timeAt(b); D.strokes = D.strokes.filter(x => x.t < ta - 1e-3 || x.t >= tb - 1e-3).concat(patternStrokes(D, a, b)); } }) }) : null,
          !D.strokes ? h('button', { class: 'btn small', 'data-t': 'le.toStrokes', title: t('le.toStrokesD'), onclick: () => mut(t('le.toStrokes'), () => { D.strokes = patternStrokes(D); }) }) : null,
          k > 0 ? h('button', { class: 'btn small ghost danger', 'data-t': 'le.delete', onclick: del }) : null]));
    } else if (s.k === 'lyrics') {
      const k = s.i[0], ln = D.lyrics[k]; if (!ln) return;
      box.append(h('h3', { text: t('le.t.lyrics') + ' · ' + fmtPos(ln.t) }),
        field(t('le.text'), txt(ln.text, v => mut(t('le.u.edit') + ' · ' + t('le.t.lyrics'), () => { ln.text = v; spread(ln); }))),
        h('div', { class: 'le-2' }, [field(t('le.start') + ' (s)', num(ln.t.toFixed(3), v => mut(t('le.u.move'), () => { ln.t = v; }))), field(t('le.end') + ' (s)', num(ln.e.toFixed(3), v => mut(t('le.u.resize'), () => { ln.e = Math.max(ln.t + .1, v); })))]),
        h('div', { class: 'row', style: 'gap:6px;flex-wrap:wrap' }, [h('button', { class: 'btn small', 'data-t': 'le.spread', onclick: () => mut(t('le.spread'), () => spread(ln)) }), h('button', { class: 'btn small', 'data-t': 'le.chordpro', onclick: chordPro }), h('button', { class: 'btn small ghost danger', 'data-t': 'le.delete', onclick: del })]));
    } else if (s.k === 'sections') {
      const k = s.i[0], sc = D.sections[k]; if (!sc) return;
      box.append(h('h3', { text: t('le.t.sections') }),
        field(t('le.kind'), sel2(['intro', 'verse', 'chorus', 'inst', 'solo', 'bridge', 'outro', 'phrase'].map(x => [x, x === 'phrase' ? t('mlx.phrases') : t('ml.sec.' + x)]), sc.kind, v => mut(t('le.kind'), () => { sc.kind = v; }))),
        h('div', { class: 'le-2' }, [field(t('le.start'), num(sc.from, v => mut(t('le.u.move'), () => { sc.from = Math.round(v); if (k > 0) D.sections[k - 1].to = sc.from; }), '1')), field(t('le.end'), num(sc.to, v => mut(t('le.u.resize'), () => { sc.to = Math.round(v); if (D.sections[k + 1]) D.sections[k + 1].from = sc.to; }), '1'))]),
        h('small', { class: 'muted', text: fmtPos(timeAt(sc.from)) + ' – ' + fmtPos(timeAt(sc.to)) }),
        h('label', { class: 'row', style: 'gap:8px;align-items:center' }, [(() => { const c2 = h('input', { type: 'checkbox' }); c2.checked = !!sc.hard; c2.onchange = () => mut(t('le.hard'), () => { sc.hard = c2.checked; }); return c2; })(), h('span', { 'data-t': 'le.hard' })]),
        h('div', { class: 'row', style: 'gap:6px' }, [h('button', { class: 'btn small', 'data-t': 'le.split', onclick: () => splitSection(Math.round(beatAt(S.audio.currentTime))) }), h('button', { class: 'btn small ghost danger', 'data-t': 'le.delete', onclick: del })]));
    } else if (s.k === 'beats') {
      const i = s.i[0], bo = ML().barOf(D, i), mc = (D.meters || []).find(m => m.b === i);
      const bpbS = sel2(['2', '3', '4', '5', '6', '7', '9', '12'].map(v => [v, v]), String(mc ? mc.beatsPerBar : bo.bpb), () => {}), subS = sel2([['2', '2 (♩ = ♪♪)'], ['3', '3 (♩. = ♪♪♪)'], ['4', '4']], String(mc ? mc.sub : bo.sub || 2), () => {});
      box.append(h('h3', { text: t('le.bar', { b: bo.bar, n: bo.beat }) }), field(t('le.time') + ' (s)', num(D.beats[i].toFixed(3), v => mut(t('le.t.beats'), () => { D.beats[i] = v; }))),
        h('small', { class: 'muted', text: i + 1 < D.beats.length ? (60 / (D.beats[i + 1] - D.beats[i])).toFixed(1) + ' BPM' : '' }),
        h('button', { class: 'btn small', 'data-t': 'le.downbeat', onclick: () => mut(t('le.downbeat'), () => { const m0 = ML().meters(D)[0]; if (!(D.meters || []).some(m => m.b <= i)) D.meter = Object.assign({}, D.meter, { phase: i }); else { D.meters = (D.meters || []).filter(m => m.b !== i); D.meters.push({ b: i, beatsPerBar: m0.bpb, sub: m0.sub, label: m0.label }); } }) }),
        h('b', { 'data-t': 'le.meterHere' }), h('div', { class: 'le-2' }, [field(t('le.bpb'), bpbS), field(t('le.sub'), subS)]),
        h('div', { class: 'row', style: 'gap:6px;flex-wrap:wrap' }, [h('button', { class: 'btn small', 'data-t': 'le.apply', onclick: () => mut(t('le.meterHere'), () => { const bb = +bpbS.value, sb = +subS.value, lab = sb === 3 ? bb * 3 + '/8' : bb + '/4';
          if (i <= (D.meter && D.meter.phase || 0) && !(D.meters || []).some(m => m.b < i)) D.meter = Object.assign({}, D.meter, { beatsPerBar: bb, sub: sb, label: lab, phase: i }); else { D.meters = (D.meters || []).filter(m => m.b !== i); D.meters.push({ b: i, beatsPerBar: bb, sub: sb, label: lab }); } }) }),
          mc ? h('button', { class: 'btn small ghost', 'data-t': 'le.meterDel', onclick: () => mut(t('le.meterDel'), () => { D.meters = D.meters.filter(m => m.b !== i); }) }) : null,
          h('button', { class: 'btn small', 'data-t': 'le.beatIns', onclick: () => mut(t('le.beatIns'), () => { if (i + 1 < D.beats.length) D.beats.splice(i + 1, 0, Math.round((D.beats[i] + D.beats[i + 1]) / 2 * 1000) / 1000); }) }),
          h('button', { class: 'btn small ghost danger', 'data-t': 'le.beatDel', onclick: del })]));
    } else if (s.k === 'tpts') {
      const i = s.i[0], q = D.tempoPts[i]; if (!q) return;
      box.append(h('h3', { 'data-t': 'le.tp' }), h('div', { class: 'le-2' }, [field(t('le.time') + ' (s)', num(q.t.toFixed(3), v => mut(t('le.tp'), () => { q.t = Math.max(0, v); }))), field('BPM', num(q.bpm, v => mut(t('le.tp'), () => { q.bpm = Math.max(20, Math.min(320, v)); }), '0.1'))]),
        field(t('le.ramp'), sel2([['0', t('le.rampOff')], ['1', t('le.rampOn')]], q.ramp ? '1' : '0', v => mut(t('le.ramp'), () => { q.ramp = v === '1'; }))),
        h('p', { class: 'muted', 'data-t': 'le.tpNote' }),
        h('div', { class: 'row', style: 'gap:6px;flex-wrap:wrap' }, [h('button', { class: 'btn small primary', 'data-t': 'le.tpApply', onclick: () => applyTempo(i, false) }), h('button', { class: 'btn small', 'data-t': 'le.tpApplyEnd', onclick: () => applyTempo(i, true) }), h('button', { class: 'btn small ghost danger', 'data-t': 'le.delete', onclick: del })]));
    } else if (s.k === 'strokes') {
      const i = s.i[0], st = D.strokes[i]; if (!st) return;
      const KS = [['d', t('le.down')], ['u', t('le.up')], ['D', t('le.s.downA')], ['U', t('le.s.upA')], ['r', t('le.k.r')], ['m', t('le.k.m')], ['s', t('le.k.s')], ['c', t('le.k.c')]];
      box.append(h('h3', { text: t('le.t.strokes') + (s.i.length > 1 ? ' × ' + s.i.length : ' · ' + fmtPos(st.t)) }),
        field(t('le.strokes'), sel2(KS, st.k, v => mut(t('le.strokes'), () => s.i.forEach(j => { const x = D.strokes[j]; x.k = v; delete x.sug; if (v === 's') x.s = x.s || 1; else delete x.s; })))),
        st.k === 's' ? field(t('le.string'), sel2([1, 2, 3].map(n2 => [String(n2), PD.theory.stringName(n2)]), String(st.s || 1), v => mut(t('le.string'), () => { st.s = +v; }))) : null,
        st.k === 'c' ? field(t('le.label'), txt(st.l, v => mut(t('le.label'), () => { st.l = v.slice(0, 24); }))) : null,
        s.i.length === 1 ? field(t('le.time') + ' (s)', num(st.t.toFixed(3), v => mut(t('le.u.move'), () => { st.t = Math.max(0, v); delete st.sug; }))) : null,
        st.sug ? h('p', { class: 'notice warn', 'data-t': 'le.sug' }) : null,
        h('div', { class: 'row', style: 'gap:6px;flex-wrap:wrap' }, [h('button', { class: 'btn small ghost danger', 'data-t': 'le.delete', onclick: del })]));
    } else if (s.k === 'markers') {
      const i = s.i[0], m = D.markers[i]; if (!m) return;
      box.append(h('h3', { 'data-t': 'le.marker' }), field(t('le.label'), txt(m.text, v => mut(t('le.marker'), () => { m.text = v.slice(0, 80); }))), field(t('le.time') + ' (s)', num(m.t.toFixed(3), v => mut(t('le.u.move'), () => { m.t = Math.max(0, v); }))),
        h('button', { class: 'btn small ghost danger', 'data-t': 'le.delete', onclick: del }));
    }
    // what the analysis was unsure of, here (the owner's only)
    box.append(h('h3', { 'data-t': 'le.review', style: 'margin-top:12px' }), rv.length ? h('ul', { class: 'le-rv' }, rv.map(r => h('li', {}, [h('b', { text: r.what + ' · ' + fmt(r.from) }), h('span', { text: ' ' + (r.note || (r.heard ? JSON.stringify(r.heard) : '')) })]))) : h('p', { class: 'muted', 'data-t': 'le.reviewNone' }));
    PD.i18n.apply(box);
  }
  /** a chord's positions on this tuning (the teacher's finger rule), its inversions, and the simplified ones that leave a note out */
  function voicingPick(c, k) {
    const R = ML().parse ? ML().parse(c.chord || '') : null; if (!R || R.root == null) return null;
    const T = PD.theory, q = (PD.theory.CHORD_TYPES || []).find(x => x.k === R.q) || (PD.theory.CHORD_TYPES || []).find(x => x.k === (/^m(?!aj)/.test(R.q) ? 'm' : '')); if (!q) return null;
    const vs = T.voicings(R.root, q).slice(0, 10); if (!vs.length) return h('p', { class: 'notice warn', 'data-t': 'le.noShape' });
    const box = h('div', { class: 'le-vc' }, [h('b', { 'data-t': 'le.voicing' })]);
    vs.forEach(v => { const info = T.voicingInfo(R.root, q, v.frets), on = c.v && c.v.join() === v.frets.join(), miss = info.missing.map(iv => NAMES[(R.root + iv) % 12]);
      box.append(h('button', { class: 'le-vb' + (on ? ' on' : ''), title: v.frets.join(' ') + (miss.length ? ' · ' + t('le.missing', { n: miss.join(' ') }) : ''), onclick: () => change(t('le.voicing'), () => { const x = S.D.chords[k]; if (on) delete x.v; else x.v = v.frets.slice(); }) },
        [h('span', { text: v.frets.join('·') }), h('small', { text: v.fingers.join('') + (miss.length ? ' −' + miss.join('') : '') + (info.bass !== R.root ? ' /' + NAMES[info.bass] : '') })])); });
    const inv = [...new Set(vs.map(v => T.voicingInfo(R.root, q, v.frets).bass).filter(b => b !== R.root))].map(b => (c.chord || '').split('/')[0] + '/' + NAMES[b]);
    if (inv.length) box.append(h('b', { 'data-t': 'le.inv' }), h('div', { class: 'row', style: 'gap:4px;flex-wrap:wrap' }, inv.map(nm => h('button', { class: 'btn small', text: nm, onclick: () => change(t('le.inv'), () => { const x = S.D.chords[k], bpc = (PD.crdsp.rootOf(nm.split('/')[1]) || {}).pc; x.chord = nm; const v = vs.find(v2 => T.voicingInfo(R.root, q, v2.frets).bass === bpc); if (v) x.v = v.frets.slice(); }) }))));
    return box;
  }
  /** what applies to the selected notes: quantize, human timing, duplicate, loop — and the choice for notes out of range */
  function noteTools(idx) {
    const D = S.D, wrap = h('div', { class: 'le-nt' }), out = ML().tab(D).notes.map((x, i) => x && x.out ? i : -1).filter(i => i >= 0);
    wrap.append(h('div', { class: 'row', style: 'gap:6px;flex-wrap:wrap' }, [
      h('button', { class: 'btn small', 'data-t': 'le.quant', onclick: () => change(t('le.quant'), () => idx.forEach(i => { const n = D.notes[i]; while (n.length < 8) n.push(null); if (n[7] == null) n[7] = n[0]; n[0] = snapT(n[0]); })) }),
      h('button', { class: 'btn small', 'data-t': 'le.human', onclick: () => change(t('le.human'), () => idx.forEach(i => { const n = D.notes[i]; if (n[7] != null) { n[0] = n[7]; n[7] = null; } })) }),
      h('button', { class: 'btn small', 'data-t': 'le.dupN', onclick: duplicate }),
      h('button', { class: 'btn small', 'data-t': 'le.loopSel', onclick: () => { const ns = idx.map(i => D.notes[i]); S.range = [Math.min(...ns.map(n => n[0])), Math.max(...ns.map(n => n[0] + n[1]))]; S.loop = true; seek(S.range[0]); if (S.audio.paused) playPause(); paintHead(); } })]));
    if (out.length) wrap.append(h('div', { class: 'notice warn' }, [h('p', { text: t('le.outN', { n: out.length }) }), h('div', { class: 'row', style: 'gap:4px;flex-wrap:wrap' },
      ['octave', 'transpose', 'arrange', 'manual'].map(how => h('button', { class: 'btn small', 'data-t': 'le.fit.' + how, onclick: () => how === 'manual' ? (S.sel = { k: 'notes', i: out }, inspector(), draw()) : retab(how) })))]));
    return wrap;
  }
  /** the panduri tablature from the melody: the original stays in notesOrig, the panduri version is what the lesson plays */
  function retab(fitHow, prefer) {
    change(t('le.retab'), () => {
      const D = S.D, oct = ML().octaveFor(D); if (!D.notesOrig) D.notesOrig = D.notes.map(n => n.slice(0, 3));
      let ns = D.notes.map(n => ({ t: n[0], d: n[1], m: n[2] + oct }));
      if (fitHow) ns = PD.crdsp.fitRange(ns, fitHow, { lo: 57, hi: 81 }).notes;
      const T = PD.crdsp.tabulate(ns, { open: [1, 2, 3].map(x => Math.round(PD.theory.midi(x, 0))), frets: PD.instrument.fretCount, prefer: prefer || 'auto' });
      D.notes = ns.map((n, i) => { const r = T.tab[i], o = D.notes[i]; return r ? [n.t, n.d, n.m, r.s, r.f, r.fi, r.art, o[7] != null ? o[7] : null] : [n.t, n.d, n.m]; });
      D.octave = 0; D.noFold = true;
    });
  }
  /** syllable times spread evenly over the line (keeps the owner's own when the count is the same) */
  function spread(ln) {
    const sy = ML().syllables(ln.text).filter(x => x.s.trim()), old = ln.syl || [];
    ln.syl = sy.map((x, k) => ({ i: x.i, t: old.length === sy.length ? old[k].t : Math.round((ln.t + (ln.e - ln.t) * k / sy.length) * 1000) / 1000 }));
  }
  /** lyrics with chords as text ([Am] …): edit, then apply — lines keep their times, chords land on their syllable's time */
  function chordPro() {
    const D = S.D, ly = D.lyrics || [];
    const text = ly.map(ln => { const sy = ln.syl && ln.syl.length ? ln.syl : []; let out = '', last = 0; const marks = []; (D.chords || []).forEach(c => { if (c.t < ln.t - .3 || c.t >= ln.e) return; let si = 0; sy.forEach((y, k) => { if (y.t <= c.t + .05) si = k; }); marks.push({ i: sy[si] ? sy[si].i : 0, n: c.chord || 'N.C.' }); });
      marks.sort((a, b) => a.i - b.i).forEach(m => { out += ln.text.slice(last, m.i) + '[' + m.n + ']'; last = m.i; }); return out + ln.text.slice(last); }).join('\n');
    PD.ui.sheet((box, close) => {
      const ta = h('textarea', { class: 'input le-cp', rows: '10', spellcheck: 'false' }); ta.value = text;
      box.append(h('h2', { 'data-t': 'le.chordpro' }), h('p', { class: 'muted', 'data-t': 'le.chordproD' }), ta, h('div', { class: 'row' }, [h('button', { class: 'btn primary', 'data-t': 'le.apply', onclick: () => { applyChordPro(ta.value); close(); } }), h('button', { class: 'btn', 'data-t': 'le.cancel', onclick: close })]));
    });
  }
  function applyChordPro(src) {
    const D = S.D, rows = src.split('\n').map(x => x.trim()).filter(Boolean);
    change(t('le.chordpro'), () => {
      D.lyrics = D.lyrics || [];
      rows.forEach((row, k) => {
        const marks = []; let plain = '';
        // the text without brackets, single-spaced; a chord belongs to the syllable that follows it ("[E] ხმლი" → ხმლი)
        row.replace(/\[([^\]]*)\]|([^[]+)/g, (m, ch, tx2) => { if (ch != null) marks.push({ i: plain.length, n: ch.trim() }); else for (const c of tx2) { if (/\s/.test(c) && (!plain.length || /\s$/.test(plain))) continue; plain += /\s/.test(c) ? ' ' : c; } return m; });
        marks.forEach(m => { while (plain[m.i] === ' ') m.i++; });
        if (/\s$/.test(plain)) plain = plain.replace(/\s+$/, '');
        let ln = D.lyrics[k];
        if (!ln) { const prev = D.lyrics[k - 1], t0 = prev ? prev.e + .3 : S.audio.currentTime; ln = { t: t0, e: Math.min(dur(), t0 + 3), text: plain, syl: [], src: 'owner' }; D.lyrics.push(ln); }
        ln.text = plain.trim(); spread(ln);
        marks.forEach(m => {
          let at = ln.t; ln.syl.forEach(y => { if (y.i <= m.i) at = y.t; });
          const nm = /^n\.?c\.?$/i.test(m.n) ? null : m.n;
          const near = D.chords.find(c => Math.abs(c.t - at) < .15);
          if (near) { near.chord = nm; near.t = at; } else D.chords.push({ t: at, chord: nm });   // the chord starts on its syllable
        });
      });
      D.lyrics.splice(rows.length);
    });
  }

  /* ---------------- frame ---------------- */
  function css() {
    if (document.getElementById('le-css')) return;
    document.head.appendChild(h('style', { id: 'le-css', text: `
.le{position:fixed;inset:0;z-index:60;background:#000;color:#ece9e4;display:flex;flex-direction:column;font:14px/1.35 system-ui,-apple-system,sans-serif}
.le-top{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.08);background:rgba(18,18,20,.72);backdrop-filter:blur(22px) saturate(1.5);-webkit-backdrop-filter:blur(22px) saturate(1.5);flex-wrap:wrap}
.le-top h2{margin:0;font-size:16px;font-weight:700;letter-spacing:-.01em}.le-top .grow{flex:1;min-width:120px}
.le-pill{font-size:11px;padding:3px 9px;border-radius:99px;background:rgba(255,255,255,.08);white-space:nowrap}.le-pill.dirty{background:rgba(208,138,92,.22);color:#f0b48a}.le-pill.ver{background:rgba(110,200,140,.18);color:#8fd6a5}
.le-tr{display:flex;align-items:center;gap:6px;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.06);flex-wrap:wrap}
.le-tr .time{font:600 15px ui-monospace,SFMono-Regular,Menlo,monospace;min-width:108px;cursor:pointer;padding:4px 8px;border-radius:8px;background:rgba(255,255,255,.05)}
.le-tr select{width:auto;min-width:0;padding:6px 8px}
.le-ib{width:36px;height:36px;border-radius:10px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:inherit;font-size:15px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
.le-ib[aria-pressed=true]{background:rgba(208,138,92,.25);border-color:#d08a5c;color:#f0b48a}
.le-ib.pp{background:linear-gradient(180deg,#d08a5c,#a9603a);color:#140b06;border:0;width:42px;height:42px;border-radius:50%;font-weight:800}
.le-main{flex:1;display:grid;grid-template-columns:1fr 320px;min-height:0}
.le-tl{overflow:auto;position:relative;touch-action:pan-y}.le-tl canvas{display:block;width:100%;touch-action:none;user-select:none;-webkit-user-select:none}
.le-insp{border-left:1px solid rgba(255,255,255,.08);overflow:auto;padding:12px;display:flex;flex-direction:column;gap:8px;background:rgba(14,14,16,.9)}
.le-insp h3{margin:0;font-size:13px;color:#f0b48a;text-transform:uppercase;letter-spacing:.05em}
.le-f{display:flex;flex-direction:column;gap:3px;font-size:12px;color:#9a9aa0}.le-f .input{color:#ece9e4}
.le-2{display:grid;grid-template-columns:1fr 1fr;gap:6px}.le-strokes{display:flex;flex-direction:column;gap:4px}
.le-neck svg{width:100%;max-width:260px}.le-rv{margin:0;padding-left:16px;font-size:12px;color:#c8c4bf;display:flex;flex-direction:column;gap:4px}
.le-keys{font-size:11px;color:#7d7d84;padding:6px 12px;border-top:1px solid rgba(255,255,255,.06)}
.le-vc{display:flex;flex-wrap:wrap;gap:4px}.le-vc b{width:100%;font-size:12px;color:#9a9aa0;margin-top:4px}.le-vb{display:flex;flex-direction:column;align-items:center;gap:1px;padding:5px 7px;border-radius:9px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:inherit;cursor:pointer;font:600 12px ui-monospace,Menlo,monospace}.le-vb small{font-size:10px;color:#9a9aa0}.le-vb.on{border-color:#d08a5c;background:rgba(208,138,92,.22)}
.le-nt{display:flex;flex-direction:column;gap:6px}
.le-rec{display:flex;align-items:center;gap:6px;padding:6px 12px;border-bottom:1px solid rgba(255,255,255,.06);flex-wrap:wrap;background:rgba(226,87,76,.07)}.le-rec[hidden]{display:none}.le-rec .dot{width:9px;height:9px;border-radius:50%;background:#e2574c;box-shadow:0 0 12px #e2574c}
.le-rec .chip{min-width:44px}.le-rec input{width:90px}
.le-fb{border-top:1px solid rgba(255,255,255,.08);padding:8px 12px;background:rgba(10,10,12,.92)}.le-fb[hidden]{display:none}.le-fb svg{width:100%;height:86px;display:block;touch-action:manipulation}.le-fb .row{gap:8px;align-items:center}
.le-ib.rec[aria-pressed=true]{background:rgba(226,87,76,.25);border-color:#e2574c;color:#ff9a90}.le-pill.auto{background:rgba(110,200,140,.12);color:#8fd6a5}
.le-vlist{display:flex;flex-direction:column;gap:6px;max-height:40vh;overflow:auto}.le-vrow{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px;border:1px solid rgba(255,255,255,.08);border-radius:10px}
.le-vrow div{display:flex;flex-direction:column}.le-cp{font:14px/1.5 ui-monospace,Menlo,monospace;min-height:180px}
.le-menu{position:absolute;right:12px;top:54px;z-index:5;background:rgba(24,24,27,.96);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:6px;display:flex;flex-direction:column;min-width:220px;box-shadow:0 20px 50px rgba(0,0,0,.6)}
.le-menu button{text-align:left;background:none;border:0;color:inherit;padding:10px 12px;border-radius:9px;cursor:pointer;font:inherit}.le-menu button:hover{background:rgba(255,255,255,.07)}
@media (max-width:860px){.le{overflow-y:auto}.le>*{flex-shrink:0}.le-main{flex:none;grid-template-rows:minmax(300px,58vh) auto!important}.le-tl{max-height:58vh}.le-tr{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}.le-tr>*{flex:none}.le-rec{flex-wrap:nowrap;overflow-x:auto}.le-rec small,.le-fb small.muted{display:none}.le-rec>*{flex:none}.le-fb svg{height:64px}.le-top h2{font-size:15px}.le-tr .opt{display:none}.le-main{grid-template-columns:1fr;grid-template-rows:auto minmax(200px,42vh)}.le-insp{border-left:0;border-top:1px solid rgba(255,255,255,.1)}.le-keys{display:none}.le-top .btn{padding:6px 10px;font-size:13px}}
` }));
  }
  let headEls = null;
  function paintHead() {
    if (!S || !headEls) return;
    const ver = S.verifiedRev && S.verifiedRev === S.rev && !S.dirty;
    headEls.status.textContent = t('ml.st.' + (S.status || 'analysis-completed')); headEls.status.className = 'le-pill' + (ver ? ' ver' : '');
    headEls.dirty.hidden = !S.dirty; headEls.dirty.textContent = t('le.dirty');
    headEls.verify.textContent = t(ver ? 'le.unverify' : 'le.verify');
    headEls.undo.disabled = !S.undo.length; headEls.redo.disabled = !S.redo.length;
    headEls.pp.textContent = S.audio.paused ? '▶' : '❚❚'; headEls.pp.title = S.noAudio ? t('le.monD') : '';
    headEls.loop.setAttribute('aria-pressed', String(!!S.loop)); headEls.follow.setAttribute('aria-pressed', String(!!S.follow));
    headEls.mode.textContent = t('le.mode.' + S.mode); headEls.snap.value = S.snap;
    S.timeEl.textContent = fmtPos(S.audio.currentTime || 0);
    headEls.attach.hidden = /^cr-/.test(S.id) && !S.noAudio;   // a MUSIC song's recording can always be attached (again)
    headEls.met.setAttribute('aria-pressed', String(!!S.met.on)); headEls.recC.setAttribute('aria-pressed', String(S.rec === 'chords')); headEls.recR.setAttribute('aria-pressed', String(S.rec === 'rhythm')); headEls.fbB.setAttribute('aria-pressed', String(!S.fbEl.hidden));
    headEls.auto.hidden = !S.autoAt || S.dirty; if (S.autoAt) headEls.auto.textContent = t('le.autosaved', { t: new Date(S.autoAt).toLocaleTimeString().slice(0, 5) });
    paintRec();
  }
  /* the record bar: the chord palette (1–9) or the stroke keys, the latency */
  function paintRec() {
    const bar = S.recEl; if (!bar) return; bar.hidden = !S.rec; if (!S.rec) return; bar.innerHTML = '';
    const lat = h('input', { class: 'input', type: 'number', step: '5', value: String(S.lat || 0), 'aria-label': t('le.lat'), onchange: e => { S.lat = Math.round(+e.target.value || 0); PD.store.set('le.lat', S.lat); } });
    bar.append(h('span', { class: 'dot' }));
    if (S.rec === 'chords') {
      const used = [...new Set(S.D.chords.map(c => c.chord).filter(Boolean))], key = PD.crdsp.rootOf(S.D.key || ''), minor = /m(?!aj)/.test((S.D.key || '').slice(key ? key.len : 0));
      const dia = key ? (minor ? [[0, 'm'], [3, ''], [5, 'm'], [7, ''], [8, ''], [10, ''], [7, 'm']] : [[0, ''], [2, 'm'], [4, 'm'], [5, ''], [7, ''], [9, 'm'], [7, '7']]).map(([d, q]) => NAMES[(key.pc + d) % 12] + q) : [];
      S.pal = [...new Set(used.concat(dia))].slice(0, 9);
      bar.append(h('small', { 'data-t': 'le.recOn' }), ...S.pal.map((nm, i) => h('button', { class: 'chip', text: (i + 1) + ' · ' + nm, onpointerdown: e => { e.preventDefault(); recChord(i); } })),
        (() => { const add = h('input', { class: 'input', placeholder: '+ Am7', 'aria-label': t('le.custom'), onchange: e => { const v = e.target.value.trim(); if (v) { S.pal = [v].concat(S.pal).slice(0, 9); e.target.value = ''; S.D.chords.push({ t: -1, chord: v }); S.D.chords = S.D.chords.filter(c => c.t >= 0); recChord(0); } } }); return add; })());
    } else { const K = recKeys(); bar.append(h('small', { text: t('le.recROn', { d: K.d.toUpperCase(), u: K.u.toUpperCase(), m: K.m.toUpperCase(), r: K.r.toUpperCase(), s: K.s.toUpperCase() }) }),
      ...[['d', '↓'], ['u', '↑'], ['D', '↓>'], ['U', '↑>'], ['r', '·'], ['m', '×']].map(([k2, lab]) => h('button', { class: 'chip', text: lab, onpointerdown: e => { e.preventDefault(); if (!S.audio.paused) { (S.recBuf = S.recBuf || []).push({ t: Math.round(Math.max(0, S.audio.currentTime - (S.lat || 0) / 1000) * 1000) / 1000, k: k2 }); draw(); } } }))); }
    bar.append(h('span', { class: 'grow' }), h('label', { class: 'row', style: 'gap:4px;align-items:center' }, [h('small', { 'data-t': 'le.lat' }), lat]), h('button', { class: 'btn small', 'data-t': 'le.recSet', onclick: recSettings }));
    PD.i18n.apply(bar);
  }
  function recSettings() {
    PD.ui.sheet((box, close) => {
      const K = recKeys(), rows = h('div', { class: 'le-vlist' });
      [['d', 'le.down'], ['u', 'le.up'], ['m', 'le.k.m'], ['r', 'le.k.r'], ['s', 'le.k.s']].forEach(([a, lab]) => { const b = h('button', { class: 'btn small', text: K[a].toUpperCase() });
        b.onclick = () => { b.textContent = t('le.keyPress'); const f = e => { e.preventDefault(); e.stopPropagation(); window.removeEventListener('keydown', f, true); const k2 = e.key.toLowerCase(); if (k2.length === 1 && k2 !== ' ') { const m = Object.assign(recKeys(), { [a]: k2 }); PD.store.set('le.recKeys', m); b.textContent = k2.toUpperCase(); paintRec(); } else b.textContent = recKeys()[a].toUpperCase(); }; window.addEventListener('keydown', f, true); };
        rows.append(h('div', { class: 'le-vrow' }, [h('span', { 'data-t': lab }), b])); });
      box.append(h('h2', { 'data-t': 'le.recSet' }), h('h3', { 'data-t': 'le.keysT' }), rows, h('h3', { 'data-t': 'le.lat' }), h('p', { class: 'muted', 'data-t': 'le.calibD' }),
        h('button', { class: 'btn', 'data-t': 'le.calib', onclick: () => { S.calib = []; close(); if (S.audio.paused) playPause(); } }));
      PD.i18n.apply(box);
    });
  }
  function metroSettings() {
    PD.ui.sheet((box, close) => {
      const D = S.D, m = Object.assign({ vol: .7, sound: 'wood', accent: true, sub: 1, countIn: 0 }, D.metronome || {}), put = o => change(t('le.metro'), () => { S.D.metronome = Object.assign({}, m, o); Object.assign(m, o); });
      const vol = h('input', { type: 'range', min: '0', max: '1', step: '0.05', value: String(m.vol), oninput: e => { m.vol = +e.target.value; S.D.metronome = Object.assign({}, m); }, onchange: () => put({ vol: m.vol }) });
      const acc = h('input', { type: 'checkbox' }); acc.checked = m.accent; acc.onchange = () => put({ accent: acc.checked });
      box.append(h('h2', { 'data-t': 'le.metro' }), h('button', { class: 'btn' + (S.met.on ? ' primary' : ''), text: t('le.metro') + (S.met.on ? ' · ON' : ' · OFF'), onclick: () => { if (S.met.on) S.met.stop(); else S.met.start(); close(); paintHead(); } }),
        field(t('le.vol'), vol), field(t('le.sound'), sel2(['wood', 'click', 'beep', 'rim', 'cowbell'].map(k => [k, t('le.snd.' + k)]), m.sound, v => put({ sound: v }))),
        h('label', { class: 'row', style: 'gap:8px;align-items:center' }, [acc, h('span', { 'data-t': 'le.accent' })]),
        field(t('le.subd'), sel2([['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']], String(m.sub), v => put({ sub: +v }))),
        field(t('le.countIn'), sel2([['0', '0'], ['2', '2'], ['3', '3'], ['4', '4'], ['6', '6'], ['8', '8']], String(m.countIn), v => put({ countIn: +v }))),
        h('p', { class: 'muted', 'data-t': 'le.tpNote' }));
      PD.i18n.apply(box);
    });
  }
  function transposeSheet() {
    PD.ui.sheet((box, close) => {
      const k = h('input', { class: 'input', type: 'number', min: '-12', max: '12', step: '1', value: '0' }), cC = h('input', { type: 'checkbox' }), cN = h('input', { type: 'checkbox' }); cC.checked = cN.checked = true;
      box.append(h('h2', { 'data-t': 'le.transpose' }), field(t('le.semi'), k), h('label', { class: 'row', style: 'gap:8px' }, [cC, h('span', { 'data-t': 'le.trChords' })]), h('label', { class: 'row', style: 'gap:8px' }, [cN, h('span', { 'data-t': 'le.trNotes' })]),
        h('button', { class: 'btn primary', 'data-t': 'le.apply', onclick: () => { const n = Math.round(+k.value || 0); if (!n) return close(); const X = PD.crdsp;
          change(t('le.transposed', { k: (n > 0 ? '+' : '') + n }), () => { const D = S.D;
            if (cC.checked) { D.chords.forEach(c => { c.chord = X.transposeChord(c.chord, n); if (c.play) c.play = X.transposeChord(c.play, n); delete c.v; }); if (D.key) D.key = X.transposeChord(D.key, n); }
            if (cN.checked) { D.notes = D.notes.map(x => [x[0], x[1], x[2] + n]); if (D.notesOrig) D.notesOrig = D.notesOrig.map(x => [x[0], x[1], x[2] + n]); } });
          if (cN.checked && S.D.noFold) retab(null); close(); } }));
      PD.i18n.apply(box);
    });
  }
  /* the interactive neck: 3 strings × 17 frets; what sounds at the playhead is lit with its finger */
  function fretboard() {
    const el = h('div', { class: 'le-fb', hidden: true }), svgBox = h('div'), add = h('input', { type: 'checkbox' }), F = PD.instrument.fretCount;
    el.append(h('div', { class: 'row' }, [h('b', { 'data-t': 'le.fb' }), h('label', { class: 'row', style: 'gap:6px;align-items:center' }, [add, h('small', { 'data-t': 'le.fbAdd' })]), h('small', { class: 'muted grow', 'data-t': 'le.fbD' })]), svgBox);
    const W = 900, H = 84, x = f => 24 + (f === 0 ? 0 : (W - 34) * (1 - Math.pow(2, -f / 12)) / (1 - Math.pow(2, -(F + .5) / 12))), y = st => 14 + (3 - st) * 28;
    let lit = '';
    function paint() {
      if (el.hidden || !S) return; const D = S.D, now = S.audio.currentTime, TB = ML().tab(D), on = [];
      D.notes.forEach((n, i) => { const tb = TB.notes[i]; if (tb && tb.ok && n[0] <= now + .02 && n[0] + n[1] > now) on.push([tb.s, tb.f, n[5]]); });
      if (S.sel && S.sel.k === 'notes') S.sel.i.forEach(i => { const tb = TB.notes[i]; if (tb && tb.ok) on.push([tb.s, tb.f, 'sel']); });
      const sig = JSON.stringify(on); if (sig === lit && svgBox.firstChild) return; lit = sig;
      let g = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">';
      for (let f = 1; f <= F; f++) g += '<line x1="' + x(f) + '" y1="6" x2="' + x(f) + '" y2="' + (H - 6) + '" stroke="rgba(255,255,255,.18)" stroke-width="' + (f === 1 ? 2 : 1) + '"/>' + ([3, 5, 7, 10, 12, 15].includes(f) ? '<circle cx="' + (x(f) + x(f - 1)) / 2 + '" cy="' + H / 2 + '" r="3" fill="rgba(255,255,255,.12)"/>' : '');
      [1, 2, 3].forEach(st => { g += '<line x1="18" y1="' + y(st) + '" x2="' + W + '" y2="' + y(st) + '" stroke="#c38c63" stroke-width="' + (st === 1 ? 2.2 : 1.4) + '"/><text x="2" y="' + (y(st) + 4) + '" fill="#9a9aa0" font-size="11">' + PD.theory.stringName(st) + '</text>'; });
      on.forEach(([st, f, fi]) => { const cx = f ? (x(f) + x(f - 1)) / 2 : 12; g += '<circle cx="' + cx + '" cy="' + y(st) + '" r="10" fill="' + (fi === 'sel' ? '#fff' : '#d08a5c') + '"/><text x="' + cx + '" y="' + (y(st) + 4) + '" text-anchor="middle" font-size="11" font-weight="800" fill="#140b06">' + (fi === 'sel' ? f : fi != null ? fi : f) + '</text>'; });
      for (let f = 0; f <= F; f++) [1, 2, 3].forEach(st => { const cx = f ? (x(f) + x(f - 1)) / 2 : 12, w = f ? x(f) - x(f - 1) : 22; g += '<rect data-s="' + st + '" data-f="' + f + '" x="' + (cx - w / 2) + '" y="' + (y(st) - 13) + '" width="' + w + '" height="26" fill="transparent"/>'; });
      svgBox.innerHTML = g + '</svg>';
    }
    svgBox.addEventListener('pointerdown', e => { const r = e.target.closest('rect[data-s]'); if (!r) return; const st = +r.dataset.s, f = +r.dataset.f, m = Math.round(PD.theory.midi(st, f));
      hear(m, st, f);
      const D = S.D, sel = S.sel && S.sel.k === 'notes' && S.sel.i.length === 1 ? S.sel.i[0] : null, oct = ML().octaveFor(D);
      if (sel != null) change(t('le.u.edit') + ' · ' + t('le.t.notes'), () => { const n = D.notes[sel]; n[2] = m - oct; while (n.length < 5) n.push(null); n[3] = st; n[4] = f; });
      else if (add.checked) { const x0 = snapT(S.audio.currentTime), len = Math.max(.08, (timeAt(beatAt(x0) + 1) - x0) / ({ '1/2': 2, '1/3': 3, '1/4': 4 }[S.snap] || 1));
        change(t('le.u.add') + ' · ' + t('le.t.notes'), () => D.notes.push([x0, Math.round(len * 1000) / 1000, m - oct, st, f])); seek(x0 + len); }
      lit = ''; paint(); });
    return { el, paint };
  }
  async function open(id, track, given) {
    if (!(PD.cloud && PD.cloud.isOwner)) { PD.ui.toast(t('le.noAllow')); return; }
    if (S) close();
    css();
    await ML().boot();
    const base = given || ML().data(id) || (PD.creator && await PD.creator.draftOf(id)); if (!base) return;
    const root = h('div', { class: 'le', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('le.title') });
    const audio = new Audio(); audio.preservesPitch = true; audio.mozPreservesPitch = true; audio.webkitPreservesPitch = true; audio.preload = 'auto';
    S = { id, D: clone(base), rev: 0, status: null, verifiedRev: null, dirty: false, undo: [], redo: [], sel: null, range: null, loop: false, follow: true, mode: 'time', snap: 'beat',
      zoom: 60, x0: 0, head: window.innerWidth < 700 ? 46 : 96, peaks: null, root, focus: track && ['chords', 'notes', 'rhythm', 'lyrics', 'tab', 'tempo', 'beats', 'markers'].includes(track) ? track : 'chords', pointers: new Map(), editedChord: {}, review: [], conf: null,
      extra: [], mix: {}, vz: 1, lat: PD.store.get('le.lat', 0), rec: null, ver: 1, audioState: 'loading', mon: Object.assign({ chords: false, rhythm: false, notes: false }, PD.store.get('le.mon', {})) };
    S.real = audio; S.virt = virtualClock(() => (S && (S.D.duration || (S.D.beats[S.D.beats.length - 1] + 2))) || 1);
    Object.defineProperty(S, 'audio', { get: () => (S && S.useVirt ? S.virt : audio), configurable: true });
    S.met = ML().metronome({ t: () => S.audio.currentTime, rate: () => S.audio.playbackRate, playing: () => !S.audio.paused }, () => S ? S.D : base);
    delete S.D._from; delete S.D._verified; norm();
    // the top bar
    const btn = (k, fn, cls) => h('button', { class: 'btn small' + (cls ? ' ' + cls : ''), 'data-t': k, onclick: fn });
    headEls = { status: h('span', { class: 'le-pill' }), dirty: h('span', { class: 'le-pill dirty', hidden: true }), auto: h('span', { class: 'le-pill auto', hidden: true }), verify: btn('le.verify', verify), undo: h('button', { class: 'le-ib', title: t('le.undo'), 'aria-label': t('le.undo'), text: '↶', onclick: undo }), redo: h('button', { class: 'le-ib', title: t('le.redo'), 'aria-label': t('le.redo'), text: '↷', onclick: redo }) };
    const menuBtn = h('button', { class: 'le-ib', 'aria-label': t('le.more'), text: '⋯' });
    menuBtn.onclick = () => {
      const old = root.querySelector('.le-menu'); if (old) { old.remove(); return; }
      const cr = PD.creator && /^cr-/.test(id), api = { get data() { return S && S.D; }, apply: (label, fn) => change(label, fn, true), get audio() { return S && S.audio; }, id, retab, buffer: () => S && S.buffer };
      const m = h('div', { class: 'le-menu', role: 'menu' }, (cr ? [['cr.analyze', () => PD.creator.analysisSheet(id, api)], ['cr.builder', () => PD.creator.builderSheet(id, api)]] : []).concat([['le.metro', metroSettings], ['le.recSet', recSettings], ['le.transpose', transposeSheet],
        ['le.retab', () => PD.ui.sheet((box, close) => { box.append(h('h2', { 'data-t': 'le.retab' }), ...['auto', 'open', 'low', 'one'].map(pf => h('button', { class: 'btn', style: 'width:100%', 'data-t': 'le.pref.' + pf, onclick: () => { retab(null, pf); close(); } }))); PD.i18n.apply(box); })],
        ['le.revert', revert], ['le.history', history], ['le.chordpro', chordPro]], cr ? [['cr.dup', () => PD.creator.duplicate(id)], ['cr.unpub', () => PD.creator.unpublish(id)], ['cr.delete', () => PD.creator.remove(id, close)]] : [['le.attach', attach], ['le.upload', uploadAudio], ['le.loadAnalysis', () => PD.ui.confirm(t('le.analysisQ'), () => { const sh = ML().shipped(id); if (sh) { change(t('le.loadAnalysis'), () => {}); setData(sh); touched(); } })]])
        .map(([k, fn]) => h('button', { role: 'menuitem', 'data-t': k, onclick: () => { m.remove(); fn(); } })));
      root.append(m); PD.i18n.apply(m);
    };
    root.append(h('div', { class: 'le-top' }, [h('button', { class: 'le-ib', 'aria-label': t('le.close'), text: '✕', onclick: close }), h('div', { class: 'grow' }, [h('h2', { text: PD.i18n.pick(S.D.title) }), h('div', { class: 'row', style: 'gap:6px;margin-top:3px' }, [headEls.status, headEls.dirty])]),
      headEls.auto, headEls.undo, headEls.redo, btn('le.save', () => save()), btn('le.preview', () => { ML().setPreview(id, strip(S.D)); PD.store.set('ml.student', id); close(); PD.lessons.reload(); PD.app.go('lesson', id); }), btn('le.publish', publish, 'primary'), headEls.verify, menuBtn]));
    // transport
    S.timeEl = h('span', { class: 'time', title: t('le.mode.bars') + ' / ' + t('le.mode.time'), onclick: () => { S.mode = S.mode === 'time' ? 'bars' : 'time'; paintHead(); draw(); } });
    headEls.pp = h('button', { class: 'le-ib pp', 'aria-label': t('le.play'), text: '▶', onclick: playPause });
    headEls.loop = h('button', { class: 'le-ib', title: t('le.loop') + ' (L)', 'aria-label': t('le.loop'), text: '⟲', onclick: () => { S.loop = !S.loop; paintHead(); draw(); } });
    headEls.follow = h('button', { class: 'le-ib', title: t('le.follow'), 'aria-label': t('le.follow'), text: '⇥', onclick: () => { S.follow = !S.follow; paintHead(); } });
    headEls.mode = h('button', { class: 'btn small', onclick: () => { S.mode = S.mode === 'time' ? 'bars' : 'time'; paintHead(); draw(); } });
    headEls.snap = h('select', { class: 'input', 'aria-label': t('le.snap'), onchange: e => { S.snap = e.target.value; } }, [['beat', t('le.snap.beat')], ['bar', t('le.snap.bar')], ['1/2', '½'], ['1/3', '⅓'], ['1/4', '¼'], ['off', t('le.snap.off')]].map(([v, l]) => h('option', { value: v, text: t('le.snap') + ': ' + l })));
    const speed = h('select', { class: 'input', 'aria-label': t('ml.speed'), onchange: e => { if (e.target.value === 'c') { const v = parseFloat(prompt(t('le.speedC'), '85')); if (v >= 10 && v <= 200) { S.audio.playbackRate = v / 100; const o = h('option', { value: String(v / 100), text: v + '%' }); e.target.add(o, 0); e.target.value = String(v / 100); } return; } S.audio.playbackRate = +e.target.value; syncExtra(true); } },
      [1.5, 1.25, 1, .9, .75, .5, .25].map(v => h('option', { value: String(v), text: Math.round(v * 100) + '%', selected: v === 1 })).concat([h('option', { value: 'c', text: t('mlx.custom') + '…' })]));
    headEls.attach = btn('le.attach', attach);
    const ib = (txt2, title, fn, cls) => h('button', { class: 'le-ib' + (cls ? ' ' + cls : ''), title, 'aria-label': title, text: txt2, onclick: fn });
    headEls.met = ib('♩', t('le.metro'), () => { if (S.met.on) S.met.stop(); else S.met.start(); paintHead(); });
    const setRec = k => { if (S.rec === 'rhythm' && k !== 'rhythm') commitRec(); S.rec = S.rec === k ? null : k; paintHead(); };
    headEls.recC = ib('●C', t('le.recC'), () => setRec('chords'), 'rec'); headEls.recR = ib('●R', t('le.recR'), () => setRec('rhythm'), 'rec');
    headEls.fbB = ib('⋕', t('le.fb'), () => { S.fbEl.hidden = !S.fbEl.hidden; S.fb.paint(); paintHead(); });
    root.append(h('div', { class: 'le-tr' }, [h('button', { class: 'le-ib', title: t('le.stop'), 'aria-label': t('le.stop'), text: '■', onclick: stop }), headEls.pp, S.timeEl,
      h('button', { class: 'le-ib', 'aria-label': t('le.zoomOut'), text: '−', onclick: () => setZoom(S.zoom / 1.4, S.audio.currentTime, tx(S.audio.currentTime)) }), h('button', { class: 'le-ib', 'aria-label': t('le.zoomIn'), text: '+', onclick: () => setZoom(S.zoom * 1.4, S.audio.currentTime, tx(S.audio.currentTime)) }),
      h('button', { class: 'btn small', 'data-t': 'le.fit', onclick: () => { S.x0 = 0; setZoom(0); } }), ib('↕−', t('le.vzOut'), () => { S.vz = Math.max(.5, S.vz / 1.3); draw(); }, 'opt'), ib('↕+', t('le.vzIn'), () => { S.vz = Math.min(4, S.vz * 1.3); draw(); }, 'opt'),
      headEls.snap, headEls.loop, headEls.follow, headEls.mode, speed, headEls.met, ib('T', t('le.tap') + ' (T)', tap), headEls.recC, headEls.recR, headEls.fbB, headEls.attach]));
    S.recEl = h('div', { class: 'le-rec', hidden: true }); root.append(S.recEl);
    S.cv = h('canvas', { 'aria-label': t('le.title') }); S.insp = h('div', { class: 'le-insp' });
    const tl = h('div', { class: 'le-tl' }, [S.cv]);
    S.fb = fretboard(); S.fbEl = S.fb.el;
    root.append(h('div', { class: 'le-main' }, [tl, S.insp]), S.fbEl, h('div', { class: 'le-keys', 'data-t': 'le.keys' }));
    document.body.appendChild(root); PD.i18n.apply(root);
    S.lid = PD.layers.push(() => close(true));
    S.cv.addEventListener('pointerdown', onDown); S.cv.addEventListener('pointermove', onMove); S.cv.addEventListener('pointerup', onUp); S.cv.addEventListener('pointercancel', onUp);
    S.cv.addEventListener('dblclick', onDbl); S.cv.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey); S.onResize = () => draw(); window.addEventListener('resize', S.onResize);
    audio.onplay = S.virt.onplay = () => { syncExtra(true); paintHead(); };
    audio.onpause = S.virt.onpause = () => { syncExtra(true); if (S && S.rec === 'rhythm') commitRec(); if (S && S.taps) commitTaps(); paintHead(); };
    S.autoI = setInterval(autosave, 30000); S.monI = setInterval(monPump, 25);
    S.zoom = Math.max(20, (S.cv.clientWidth - S.head) / 24);
    // the server's draft, the review notes, the recording
    const R = await ML().reviewData(), rv = R[id] || {}; S.review = (S.D.review || []).concat(rv.review || []); S.conf = rv.chordConfidence || null; S.status = rv.status || base.status || 'analysis-completed';
    const row = await loadServer(id);
    if (row && row.draft && row.draft.beats) { setData(row.draft); S.rev = row.rev; S.status = row.status; S.verifiedRev = row.verified_rev; S.conf = null; S.review = (S.D.review || []).concat(rv.review || []); }
    else if (row) { S.rev = row.rev; S.status = row.status; }
    const wip = PD.store.get('le.wip.' + id, null);
    if (wip && wip.d && (wip.rev || 0) === (S.rev || 0) && JSON.stringify(wip.d) !== JSON.stringify(strip(S.D))) PD.ui.confirm(t('le.wip', { d: new Date(wip.at).toLocaleString() }), () => { change(t('le.restore'), () => {}); setData(wip.d); S.dirty = true; paintHead(); });
    if (track === 'verify') setTimeout(verify, 50);
    if (track === 'lyrics' && !(S.D.lyrics && S.D.lyrics.length)) setTimeout(chordPro, 50);
    paintHead(); draw(); inspector(); loadAudio(); S.raf = requestAnimationFrame(tick);
  }
  function close(fromBack) {
    if (!S) return; const s = S;
    if (s.dirty) PD.store.set('le.wip.' + s.id, { d: strip(s.D), at: Date.now(), rev: s.rev });
    if (s.rec === 'rhythm') commitRec();
    if (s.dirty) autosave();
    s.virt.pause(); s.real.pause(); s.real.src = ''; cancelAnimationFrame(s.raf); clearInterval(s.autoI); clearInterval(s.monI); s.met.close(); (s.extra || []).forEach(p => { p.el.pause(); p.el.src = ''; });
    window.removeEventListener('keydown', onKey); window.removeEventListener('resize', s.onResize);
    if (fromBack !== true) PD.layers.done(s.lid);
    s.root.remove(); S = null; headEls = null;
    PD.lessons.reload(); PD.app.render && PD.app.render();
  }
  return { open, close, get state() { return S; }, apply: (label, fn) => S && change(label, fn, true), save: () => S && save(), patternStrokes, geom: { lanes: () => lanes(), tx: x => tx(x) } };
})();
