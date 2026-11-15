# AI Audio → Score → Panduri TAB

არსებული AI Studio-ს გაფართოება; ახალი პროექტი, ფასიანი API ან cloud upload არ დამატებულა.

## არქიტექტურა და გადაწყვეტილებები

- `ai.js`: არსებული upload/Drag & Drop, decoder, waveform, BPM/chord analysis და audio deck შენარჩუნებულია. დაემატა MediaRecorder (მაქსიმუმ 60 წამი), AudioWorklet-ით ცოცხალი აუდიოს აღება, live ML preview და ჩაწერის რესურსების დახურვა. აუდიო/webm ჩანაწერი აღარ ითვლება ვიდეოდ.
- `aimus.js`: არსებული Spotify Basic Pitch ONNX მოდელი მუშაობს Worker-ში. სრული პოლიფონია ხელმისაწვდომია; მოდელის შეცდომა აღარ იცვლება DSP შედეგით. Cancel წყვეტს Worker-ს, ასრულებს Promise-ს და ათავისუფლებს Blob URL-ს. ცალკე timeout: 5 წუთი. შემავალი ტრანსკრიფციის მაქსიმალური ხანგრძლივობა: 5 წუთი.
- `aiscore.js`: ნოტის canonical მოდელი (`pitch`, `octave`, `onset`, `duration`, `velocity`, `string`, `fret`, `finger`, `confidence`), 24-კანდიდატიანი beam search, დაკავებული სიმების/თითების შემოწმება, არანჟირება, metric score, MusicXML და interactive workspace.
- `notesart.js`: არსებული SVG სანოტო ძრავა გაფართოვდა keyboard-accessible ნოტებით, მრავალხმიანი stem direction-ით, ties-ით და dotted rests-ით. `aiscore.css` იზოლირებულია ახალი workspace-ის ფარგლებში.
- `aideck.js` უცვლელია: აუდიო, waveform, score cursor, TAB და გრიფი იყენებს `deck.pos()`-ს, რომელიც AudioContext-ის საათიდან გამოითვლება. სიჩქარე, Pause, seek და Loop დამატებით საათს არ ქმნის.
- `build.py`: ახალი მოდულის და CSS-ის ჩართვა არსებულ modular/standalone build-ებში.

გამოყენებულია ტიუნერის არსებული მონაცემები: MIDI 57/61/64 — A3/C♯4/E4, A4=440-ზე 220/277.183/329.628 Hz; 3 სიმი და 17 ლადი. პოზიციები გამოითვლება `PD.theory.positions()`-ით, რომელიც ინსტრუმენტის მიმდინარე fret map-ს და tuning-ს იყენებს. JSON export მიმდინარე tuning-ს და A4 calibration-საც ინახავს. ტიუნერის headstock, გეომეტრია და მოდულები ამ ცვლილებისთვის არ რედაქტირებულა.

Basic Pitch შეირჩა იმიტომ, რომ მოდელი უკვე რეპოზიტორიაშია, პოლიფონიური AMT-ია და API key არ სჭირდება. [Spotify-ის აღწერა](https://basicpitch.spotify.com/about), [კოდი/ლიცენზია](https://github.com/spotify/basic-pitch). საუკეთესო გამოყენება ერთი ინსტრუმენტის ცალკე ჩანაწერია; სრული მიქსი უფრო მეტ შეცდომას იძლევა. არსებული AI Studio-ს stem separation ხელმისაწვდომია.

შეფასდა [VexFlow](https://vexflow.github.io/vexflow-examples/guides/getting-started/); ამ ცვლილებაში გაფართოვდა არსებული SVG renderer, რათა შენარჩუნდეს standalone build, არსებული დიზაინი და dependency-free გაშვება. ეს სასწავლო სანოტო renderer-ია, არა სრულმასშტაბიანი საგამომცემლო engraving ძრავა.

[ScoreStarling MCP](https://scorestarling.com/mcp) არის OAuth-ით დაკავშირებული ასისტენტის ინსტრუმენტი. მისი არსებობა production API-ის ლიცენზიას არ ადასტურებს. [სერვისის პირობების განმარტება](https://scorestarling.com/support) ცალკე ტრანსკრიფციის ფასსაც აღწერს. ინტეგრაცია ან ფასიანი მოთხოვნა არ განხორციელებულა.

## გამოყენება

1. AI Studio-ში ატვირთე MP3/WAV/M4A, ჩააგდე ფაილი, ან ჩაწერე მიკროფონით. მხარდაჭერა დამოკიდებულია ბრაუზერის audio decoder-ზე.
2. მიკროფონის live ML preview იყენებს 4-წამიან ფანჯრებს, ყოველ 3 წამში. ერთდროულად მხოლოდ ერთი inference სრულდება; დატვირთულ მოწყობილობაზე შუალედური ფანჯარა შეიძლება გამოტოვდეს. preview არ ინახება საბოლოო ტრანსკრიფციად.
3. Notation → Note transcription. სრული პოლიფონია საწყისი არჩევანია ახალი მომხმარებლისთვის. არსებული Premium entitlement წესები შენარჩუნებულია.
4. Convert to Fanduri Tabs / Generate Fingering. Sheet, TAB და არსებული 2D neck ერთად ჩანს. ნოტზე დაჭერა გადასვლის პოზიციას ცვლის; keyboard: Enter/Space.
5. Correct the notes რეჟიმში შეცვალე pitch, octave, onset, duration ან პოზიცია; წაშალე მცდარი ნოტი ან დაამატე გამოტოვებული ნოტი კურსორთან. ყველა ცვლილება ხელახლა ამოწმებს ერთდროულ დაკვრას.
6. Original Melody / Beginner / Advanced / Fingerstyle Arrangement. საწყისი ნოტები ინახება `originalNotes`-ში. Easy/Fingerstyle გამოტოვებულ ნოტებს რაოდენობით აჩვენებს. თავდაპირველ/Advanced ჩანაწერში შეუძლებელი ნოტი რჩება გაფრთხილებით; ფარულად არ ტრანსპონირდება.
7. Listen: panduri version ქმნის სინთეზურ აუდიოს ზუსტად იმავე onset/duration-ით და მიმდინარე tuning-ით. Listen: source audio აბრუნებს შენახულ აუდიოს. დამუშავებული ვერსია ორიგინალ ფაილს არ ცვლის.
8. MIDI ინარჩუნებს ნოტების ფაქტობრივ დროს/velocity-ს. MusicXML შეიცავს voices, rests, backup, barline ties და string/fret ინფორმაციას. JSON შეიცავს canonical ველებს, confidence-ს და generated ჰარმონიის ნიშნებს.

## ავტომატური შემოწმება

```sh
cd panduri/source
python3 build.py
node --test qa/ai-score.cjs qa/ai-analysis.cjs
node qa/tuner-engine.mjs
node qa/ai-transcription.cjs
# გაშვებულ local server-ზე:
APP_URL=http://localhost:8182/panduri/app/ node qa/interaction-regressions.cjs
node qa/i18n-extract.cjs
node qa/i18n-merge.cjs --status
```

შედეგები ამ სამუშაო სესიაში:

- Score/TAB/exports: 11/11 ტესტი. აკორდების არსებული regression: 4/4.
- ტიუნერის არსებული engine suite: 116 passed, 0 failed.
- რეალური Basic Pitch inference რეპოზიტორიის ფანდურის pluck ჩანაწერებზე: 80/120/160 BPM-ზე თითო 4/4 საკონტროლო pitch/onset ამოცნობა. 120 BPM-ზე დამატებითი A3 შეცდომითაც ამოიცნო: ჯამში 12 სწორი და 1 ზედმეტი ნოტი. ეს მცირე regression fixture-ია და არა ზოგადი სიზუსტის შეფასება.
- სამი ერთდროული რეალური pluck-ის მიქსში A3/C♯4/E4 ამოიცნო; სიჩუმეზე — 0 ნოტი. დაბალი დონის ხმაურიან ჩანაწერზე ამოიცნო ოთხივე pitch: 57/61/64/66.
- Browser UI: რეალური WAV upload → ML → TAB/fingering; seek და ერთდროული score/TAB highlight; pitch/time correction; არანჟირება; 390/1280/1920 px განლაგებები; მოდელის 503 შეცდომა DSP fallback-ის გარეშე; Cancel; მიკროფონის ჩაწერა და tracks cleanup.
- Transport: 0.5×/0.75×/1×-ზე პოზიციის ცვლილება AudioContext elapsed × speed-ს დაემთხვა; 0.3–0.7 წმ Loop და Pause შემოწმებულია. დასაწყისში არსებული deck-ის 40 ms scheduling lead გათვალისწინებულია.
- არსებული interaction suite: nested dialogs, Escape/Back, focus restoration, file picker cleanup, reduced motion — PASS, page errors არ დაფიქსირდა.
- Build artifact დაახლოებით 14.4 MiB-ია, 16 MiB ლიმიტზე ნაკლები.

## დარჩენილი შეზღუდვები

- ML არ არის ფანდურზე სპეციალურად გაწვრთნილი. რთული მიქსი, ჰარმონიკები, სწრაფი ორნამენტები და ხმაური შეცდომებს იწვევს. Confidence მოდელის score-ია და არა სიზუსტის პროცენტი.
- Live preview-ს რამდენიმე წამის latency აქვს; ეს არ არის ნულოვანი დაყოვნების live score follower. საბოლოო შედეგი ჩაწერის დასრულების შემდეგ ხელახლა ითვლება.
- სანოტო quantization 1/16 ბადეზეა. Tuplets, ornament notation, ავტომატური anacrusis/downbeat engraving და თავისუფალი ტემპის სრულყოფილი გამოქვეყნება არ არის განხორციელებული. ფაქტობრივი აუდიო timing ცალკე ინახება.
- fingering არის შეზღუდვებით გამოთვლილი შეთავაზება: სამი სიმი, დაკავებული სიმები, ზედა თითების არსებული teacher rule, მაქსიმუმ სამი ლადის გაწვდენა. ინდივიდუალური ხელის ზომა/ბიომექანიკა და ყველა სწრაფი გადასვლა ფიზიკურ ინსტრუმენტზე მასწავლებელს არ შეუმოწმებია. ახალი 3D ხელის პოზები არ გამოგონილა.
- Fingerstyle დამატებით ბანსა და ჰარმონიას მხოლოდ ამოცნობილ აკორდებზე აგებს; მუსიკალური ხარისხი მასწავლებლის მიერ დაუდასტურებელია. აუდიო preview არის სინთეზური, არა ახალი ჩაწერილი ფანდური.
- მოდელის ფაილები არსებული AI assets-ის მისამართიდან იტვირთება. standalone/native wrapper-ს პირველი ჩატვირთვისას ქსელი შეიძლება დასჭირდეს; აუდიო არსად იტვირთება.
- Browser regression Chromium/macOS-ზე შესრულდა. iOS/Android/Windows/TV რეალურ მოწყობილობებზე შესრულება, M4A decoder-ის ყველა პლატფორმის ვარიანტი და native microphone permissions ცალკე არ შემოწმებულა.
- ქართული და ინგლისური UI დამატებულია. სხვა ენები ახალი ტექსტებისთვის არსებული English fallback-ით მუშაობს.
- Production deploy, commit და push არ შესრულებულა.

## Desktop build

არსებული installer pipeline-ით განახლდა:

- `საინსტალაციო/macos/Panduri-1.1.0-macOS-arm64.dmg` — 154.1 MB.
- `საინსტალაციო/macos/Panduri-1.1.0-macOS-x64.dmg` — 160.8 MB.
- `საინსტალაციო/windows/Panduri-1.1.0-Windows-Setup.exe` — 148.5 MB.

Build დასრულდა წარმატებით. macOS build არსებული ad-hoc signing-ითაა, notarization გამორთულია. Installers არ გამოქვეყნებულა; მათი რეალურ სისტემებზე ინსტალაციისა და native microphone-ის ცალკე შემოწმება არ ჩატარებულა.
