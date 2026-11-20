# Studio 3.0 — ტესტირების ანგარიში (Phase 0 + 1, Phase 2 — §7)

**თარიღი:** 2026-11-19 · **მანქანა:** macOS (Darwin 27), Node 22.23.4, Python 3.9.6, Playwright 1.64.1
(Chromium 1248, WebKit 2370), Google Chrome (`channel: 'chrome'` ტესტებისთვის).
**შედარება:** `base` = `origin/main` `d484be9` (ცვლილებამდე, ცალკე worktree-ში აგებული) ·
`new` = `claude/studio3-phase01`.

ყველა რიცხვი ქვემოთ ამ გაშვებებიდანაა. რაც არ შემოწმებულა, §5-ში წერია.

## 1. გაშვება

```sh
cd panduri/source && python3 build.py
node qa/studio3-core.cjs                      # Node: schema 3, migration, provenance, timebase, transport
node qa/studio3-ui.cjs                        # Chromium: ყველაფერი + 5 ზომა → docs/studio3/screens/after/
BROWSER=webkit node qa/studio3-ui.cjs panduri/source/dist/app <dir>   # იგივე WebKit-ში (Safari-ს ძრავა)
node qa/studio3-baseline.cjs ../app           # ცვლილებამდელი UI-ის სქრინშოთები (Phase 0)
```

## 2. ახალი ტესტები

### `qa/studio3-core.cjs` — **71 შემოწმება, ყველა გავიდა**
ინსტრუმენტის profile (A · C♯ · E, 17 ლადი, ბგერის რუკა `computed · estimate`); ძველი `.panduri` v1
round trip (ყოველი ველი, ნოტი, რითმი); provenance: მასწავლებლის ყაზბეგური უცვლელად „teacher ✓",
ხანგრძლივობა „default · not given", აქცენტის შეცვლის შემდეგ „you · corrected", სიგრძის შეცვლის შემდეგ
დარტყმები ისევ მისია, სიგრძე შენი; `newer-version` უარი; სიმღერის ჩანაწერის round trip; აკორდების,
ტემპის შესწორება; stem-ები `kept: 'memory'`, `assetId: null`; `index()` ორივე სტუდიიდან, დროის
მიხედვით; timebase (inverse, 120 BPM, 5/8); `PD.transport` (claim/release/listeners).

### `qa/studio3-ui.cjs` — Chromium **38/38**, WebKit **37 + 1 გამოტოვებული**

| ჯგუფი | ნაბიჯები | შედეგი |
|---|---|---|
| A. შესასვლელი | nav-ში ერთი „Studio", „AI studio" აღარ; `go('ai')` → Studio-ს მთავარი, Studio-ს tab ანთია; პრაქტიკის გვერდზე ერთი „Studio"; Home-ის ხელსაწყო „Studio" | ✓ |
| B. მთავარი | 3 მოქმედება; შაბლონი მასწავლებლის 4 რითმით, მისი რიგით და დარტყმებით (ყაზბეგური ↓! ↑ ↓, მთიულური ↓! ↓ ↑! ↓ ↑, ხორუმი ↓! ↓ ↑ ↓ ↓! ↓ ↑, აჭარული ↓ ↓! ↑!); პირველი file input — სიმღერის | ✓ |
| C. ძველი პროექტი | Panduri Studio-ს მიერ შენახული v1 პროექტი იხსნება `go('pstudio')`-ით: სახელი, 84 BPM, 3/4, ნოტები `[57,1,0] [62,2,1] [40,0,-1]`, რითმი D! U D; პანელი: teacher ✓, default · not given, „1 notes the fanduri lacks"; `go('pstudio','roll')` → Piano roll | ✓ |
| D. სიმღერა | Studio-ს მთავარიდან ატვირთვა → AI სტუდიის ანალიზი მოწყობილობაზე (Dm, 96 BPM, 10 აკორდის მონაკვეთი, 7.68 წმ), history-ში song id; **ერთი transport** (`.s3-tr` 1; `.ai-deck` 0, `.ai-tr` 0, `.pst-transport` 0, AI-ის tab bar 0); play → deck უკრავს, პოზიცია მიდის, `PD.transport.active` = deck; pause; ■ → 0; loop (ტაქტი playhead-ის ქვეშ 1.00–3.54 წმ), მეტრონომი, count-in, სიჩქარე 75 % deck-ს აღწევს და ბრუნდება; 9-ვე view AI სტუდიის საკუთარ pane-ს რთავს; „ფანდურის გაკვეთილის" ბარათი მხოლოდ Lesson-ში; პანელი: tempo/key/chords „AI · estimate", „Not separated yet"; `go('ai', id)` სიმღერას თავიდან ხსნის; Back → Studio-ს მთავარი | ✓ (WebKit: იხ. ქვემოთ) |
| E. არანჟირება | ახალი ცარიელი პროექტი (1 მელოდიის ტრეკი); 3 ნოტი ტარიდან `[57,1,0,0] [62,2,1,.5] [67,3,3,1]`; header-ის undo/redo (2/3); სახელი, 120 BPM, 3/4; დაკვრა — 3 ნოტი ძრავას აღწევს, `active` = `pst`, ■ → 0; შაბლონი „მთიულური": D! D U! D U, გვერდი ამბობს, რომ ხანგრძლივობა მისი არ არის; დარტყმის შეცვლა → პანელი „you · corrected", გვერდი „no longer his rhythm", select „changed by you"; undo → „teacher ✓"; გადატვირთვის შემდეგ ყველაფერი ადგილზეა; `.panduri` და MIDI export header-იდან; ორივე ფაილი Studio-ს მთავარიდან ახალ პროექტად იხსნება (MIDI: 84 BPM, 3/4, ტრეკები 18 და 2 ნოტით) | ✓ |
| F. ერთი player | AI deck უკრავს → არანჟირება იწყება → deck ჩერდება; deck იწყება → არანჟირება ჩერდება | ✓ |
| G. 5 ზომა | იხ. §4 | ✓ |
| შეცდომები | console / page error არცერთ ზომაზე | 0 |

**WebKit:** ერთადერთი გამოტოვება — „`go('ai', id)` reopen": Playwright-ის WebKit-ის ephemeral
კონტექსტში Blob IndexedDB-ში არ ინახება (შემოწმდა `PD.blobs.put(Blob)` → `null`; ობიექტი ინახება).
ზუსტად ასევე იქცევა **ცვლილებამდელი** AI სტუდია (`base`-ზე იგივე: `stored: false` და toast
„No room left on this device…"). ასეთ შემთხვევაში ტესტი ამოწმებს, რომ header წერს „The file is not
saved — pick it again" — გადის. ნამდვილ Safari-ში (არა private) ეს შენახვა მუშაობს — iPhone-ზე
**არ შემოწმებულა**.

## 3. ძველი ტესტები: ადრე და ახლა

| ტესტი | base (`d484be9`) | new | შენიშვნა |
|---|---|---|---|
| `pstudio-core.cjs` | ✓ | ✓ | 2 ტრეკი · 8 დარტყმა · 275 MIDI ბაიტი, ორივეგან |
| `pstudio-ui.cjs` | ✓ | ✓ | ✎ selector-ები: tab-ები და Undo ახლა Studio-ს shell-შია (`.s3-tab`, `.s3-head`); პრაქტიკის გვერდზე „Studio". assertion-ები უცვლელია: 3 ნოტი, 11 დარტყმა, loop, undo, reload, `.panduri`/MIDI, mute, 5 view 390px-ზე |
| `ai-studio.cjs` (ნამდვილი Spleeter) | ✓ | ✓ | ✎ `#page input[type=file]`: `go('ai')` ახლა Studio-ს მთავარს ხსნის ეკრანის გადასვლით, და გამავალი ეკრანი ~0.7 წმ DOM-ში რჩება. გაყოფა **იდენტურია**: 4 stem × 926 100 sample, იგივე tail მნიშვნელობები |
| `ai-transcription.cjs` | ✗ ხაზი 114: ღილაკი „Listen: panduri version" ვერ მოიძებნა | ✗ იმავე ნაბიჯზე | **ცვლილებამდე არსებული**. ✎ view-ების select → Studio-ს tab-ები. მანამდე ყველაფერი გადის (Basic Pitch ტრანსკრიფცია, piano roll-ის რედაქტირება და undo, TAB / fingering / fingerstyle, ნოტის შესწორება, deck-ის საათი 0.5 / 0.75 / 1 სიჩქარეზე, loop, pause). ამის შემდეგ მდგომი ნაწილები (score რამდენიმე ზომაზე, მიკროფონით ჩაწერა) **არ შესრულებულა — არც base-ზე, არც new-ზე** |
| `geo-card.cjs` | ✗ timeout 300 წმ (`.ai-rhy .ai-geo`) | ✗ იგივე | ცვლილებამდე არსებული |
| `navigation-glass.cjs` | ✗ dock-ში 6 ღილაკია, ტესტი 5-ს ელის | ✗ იგივე | ცვლილებამდე არსებული (community tab-ის შემდეგ) |
| `v2-shell.cjs` (9 ზომა, 390 → 3840) | ✓ | ✓ | ✎ route-ების სიაში `'ai'` → `'studio3'` (nav-ის ჩანაწერი); overflow 0, errors 0 |
| `settings-reset.cjs`, `first-run.cjs`, `interaction-regressions.cjs`, `refresh-regressions.cjs`, `ui-refresh.cjs`, `devices-ui.cjs`, `storage.cjs` | ✓ | ✓ | უცვლელად |
| `i18n-crawl.cjs` ka / en / ru (33 ეკრანი; ✎ +3 Studio-ს route) | errors 0, raw keys 0, overflow `music/geo` (ka, ru), SVG ტექსტი `tips` | იგივე; **Studio-ს ეკრანებზე raw key 0, overflow 0** | Studio-ს ახალი 133 სტრიქონი სხვა 14 ენაზე ინგლისურად ჩანს (თარგმანი ჯერ არ არის — CLAUDE.md-ის წესით). `i18n-extract` **არ გაშვებულა**: pack-ები 80 %-ის ქვემოთ ჩამოვიდოდა |

✎ = ტესტი განახლდა. ყოველი განახლება მხოლოდ ახალ განლაგებას მიჰყვება; რასაც ტესტი ამოწმებს, არ
შეცვლილა.

**build:** `python3 build.py` ✓; `dist/artifact.html` 16 773 804 B — **3412 B** 16 MiB-მდე (ადრე 4015 B).

## 4. Responsive (Chromium; WebKit-ში იგივე შედეგი)

| ზომა | ხედები | გვერდითი პანელი | transport-ის ზედა კიდე (სიმღერა / არანჟ.) | transport-ის 1-ლი მწკრივი ერთ ხაზზე | overflow | სქრინშოთები |
|---|---|---|---|---|---|---|
| 1920×1080 | tab-ები | ✓ | 96 / 96 px | ✓ | 0 | [home](screens/after/desktop-1920x1080-home.jpg) · [song](screens/after/desktop-1920x1080-song.jpg) · [arr](screens/after/desktop-1920x1080-arrangement.jpg) |
| 1440×900 | tab-ები | ✓ | 96 / 99 px | ✓ | 0 | [home](screens/after/desktop-1440x900-home.jpg) · [song](screens/after/desktop-1440x900-song.jpg) · [arr](screens/after/desktop-1440x900-arrangement.jpg) |
| 768×1024 | tab-ები (wrap) | ⓘ sheet | 84 / 87 px | ✓ | 0 | [home](screens/after/tablet-768x1024-home.jpg) · [song](screens/after/tablet-768x1024-song.jpg) · [arr](screens/after/tablet-768x1024-arrangement.jpg) |
| 430×932 | Learn · Sounds · Notes · Edit | ⓘ sheet | 79 / 81 px | ✓ | 0 | [home](screens/after/phone-430x932-home.jpg) · [song](screens/after/phone-430x932-song.jpg) · [arr](screens/after/phone-430x932-arrangement.jpg) |
| 390×844 | Learn · Sounds · Notes · Edit | ⓘ sheet | 79 / 84 px | ✓ | 0 | [home](screens/after/phone-390x844-home.jpg) · [song](screens/after/phone-390x844-song.jpg) · [arr](screens/after/phone-390x844-arrangement.jpg) |

**ადრე და ახლა** ([baseline](screens/baseline/)): ტელეფონზე სიმღერის გახსნის შემდეგ დაკვრის ღილაკი
ცვლილებამდე ~720px-ზე იყო, dock-ის ქვეშ (პირველ ეკრანზე არ ჩანდა); ახლა 79px-ზეა და sticky-ა.
ორი სხვადასხვა player და ორი tab-ის სისტემა → ერთი. WebKit-ის ტელეფონის სქრინშოთები:
[screens/after-webkit/](screens/after-webkit/). ქართული ტექსტი 390 და 1440px-ზე ხელით შემოწმდა
(სქრინშოთებით): გადავსება არ არის; ერთი შეჯახება (გვერდით პანელში გრძელი მნიშვნელობა ლეიბლზე)
ნაპოვნი და გასწორებულია.

## 5. რა არ შემოწმებულა

* ნამდვილი მოწყობილობები: iPhone (Safari), Android (Chrome), iPad — მხოლოდ Playwright-ის
  Chromium და WebKit;
* ხმა ყურით: ტესტები ითვლის, რამდენი ნოტი/დარტყმა მიაღწია ძრავას და რომ deck უკრავს — ხმის ხარისხი
  ყურით არ შემოწმებულა;
* მიკროფონი ნამდვილ მოწყობილობაზე; Electron-ის desktop აპი; Capacitor-ის Android/iOS build;
* screen reader-ები (VoiceOver, TalkBack): ARIA როლები დაყენებულია (tablist/tab/tabpanel, separator,
  group), მაგრამ ხმოვანი წაკითხვა არ შემოწმებულა;
* სუსტი ტელეფონის წარმადობა და მეხსიერება;
* Premium-ის ფუნქციები shell-ში (stem-ები, ტრანსკრიფცია): `ai-studio.cjs` და `ai-transcription.cjs`
  მათ QA-ში ხსნის (`PD.premium.allows = () => true`), ნამდვილი გადახდით — არა.

## 6. გზად ნაპოვნი, არ შეცვლილა

* `pi.*` (12 key) ორჯერაა განსაზღვრული — `tips.js` და `three3d.js`; ტექსტი **იდენტურია**, ამიტომ
  არასწორი ტექსტი არ ჩანს.
* AI სტუდია Blob-ის შენახვის ნებისმიერ ჩავარდნაზე წერს „ადგილი აღარ დარჩა"; Safari-ს private რეჟიმში
  მიზეზი სხვაა — ტექსტი შეცდომაში შემყვანია.
* `panduri/app/intro3d.js` build-ში არ იქმნება (ძველი ფაილი deploy-ის საქაღალდეში).
* `ai-transcription.cjs`, `geo-card.cjs`, `navigation-glass.cjs` აპს ჩამორჩა (§3).


---

## 7. Phase 2 (2026-11-19, branch `claude/studio3-phase02`)

**გარემო:** იგივე მანქანა; Google Chrome (`channel: 'chrome'`, WebGPU ჩართულია — Demucs WebGPU-ზე გაეშვა).
ყველა აუდიო **ნამდვილია**: მასწავლებლის ჩანაწერი (`რითმები/აჭარული ნელი.wav`, WAV 24-bit 48 kHz მონო) და
მისი უდანაკარგო/შეკუმშული ასლები (macOS `afconvert`), აპის MP3-ები, ბანის 320 kbps MP3 (4:39), ნამდვილი
ტელეფონის ვიდეო (`MUSIC/snaptik_….mp4`, HE-AAC v2), ბრაუზერის მიკროფონით ჩაწერილი WebM/Opus.

```sh
cd panduri/source && python3 build.py
node qa/studio3-core.cjs                       # 75 შემოწმება (Phase 2-მა 4 დაამატა: kept, media, down())
node qa/studio3-phase2.cjs                     # Chrome, ნამდვილი ფაილები → docs/studio3/screens/phase2/
node qa/sep-bench.cjs 40 d4,d4o50,d4s2,d6,spl docs/studio3/data/sep-bench-<from>.json <from>   # ხარისხი, ქართული სიმღერა
node qa/geo-routing.cjs 20 docs/studio3/data/geo-routing.json                                 # ქართული წყაროები stem-ებში
```

### 7.1 `qa/studio3-phase2.cjs` — **41 გავიდა, 1 გამოტოვებული, 0 ჩავარდნილი**

| ჯგუფი | რა შემოწმდა | შედეგი |
|---|---|---|
| header × 12 | WAV 24/48 მონო · FLAC 24/48 · ALAC 24/48 · AIFF 16/44.1 · WAV 16/44.1 სტერეო · WAV float32/96 · AAC-LC 192k · MP3 ×3 (96 kbps 48 kHz მონო, 96 kbps 44.1, 320 kbps 44.1) · MP4 ვიდეო HE-AAC v2 · WebM/Opus მიკროფონიდან | ✓ კონტეინერი, კოდეკი, sample rate, არხები, ბიტები, bitrate, სიგრძე (±0.06 წმ) ყველაში |
| import × 7 | ფაილი Studio-ს მთავარიდან; `PD.ai.current.audio.sampleRate` | ✓ 48 000 / 48 000 / 44 100 / 48 000 (96k → 48k, პანელი წერს „ფაილი: 96 kHz") / 44 100 / 48 000 / 44 100 (HE-AAC v2) |
| bit-exact | WAV 24 და FLAC 24: პირველი 4000 sample ფაილის PCM-თან | ✓ max error **0** |
| ALAC Chrome-ში | Chrome-ს ALAC-ის გამშიფრავი არ აქვს (`decodeAudioData` და `<audio>` — error 4; Safari-ს აქვს) | ✓ AI სტუდია წერს „ვერ უკრავს", Studio დაამატებს: „ფაილი არის ALAC (M4A · 48 kHz) … Safari მას ხსნის; ან FLAC/WAV" |
| შეცდომა → ხელახლა | მოდელის URL 404 (სერვერის გადამრთველი), cache წაშლილი | ✓ job `error`, ტექსტი „The AI could not run: download 404 manifest.json", ღილაკი „ხელახლა ცდა" → `loading → separating → saving → complete` (WebGPU) |
| შენახვა | 30 წმ, 4 stem | ✓ 9 ჩანაწერი (1 აღწერა + 8 არხი), 20.2 MB = n × 2 არხი × 2 B × 4 |
| M / S | timeline-ის ზოლიდან | ✓ AI სტუდიის იმავე mixer-ში: solo = vocals, mute = drums, ზოლები მკრთალდება, AI მიქსი ირთვება |
| WAV | ერთი stem, 16-bit და 32-bit float | ✓ header-ები (1/16 და 3/32, 44.1 kHz, 2 არხი, 1 323 000 frame); float **bit-exact** stem-თან |
| seek | timeline-ზე შეხება შუაში (გაყოფილი მონაკვეთის გარეთ) და მონაკვეთში | ✓ 139.47 / 278.9 წმ, ორიგინალზე გადართვით; zoom-ში შუა = 15.00 წმ; ერთი transport (`PD.transport.active` = deck, Panduri Studio ჩუმად) |
| **დაკვრისას პოზიცია** | — | **– გამოტოვებული:** ამ მანქანაზე Web Audio-ს საათი არ მიდის (0.005 წმ 0.8 წამში — headless-შიც და headed-შიც, ჩვენი კოდის გარეშეც), ასე რომ აქ ვერც ერთი player ვერ წავა. ნამდვილ ბრაუზერში შესამოწმებელია |
| გადატვირთვა | reload → სიმღერა ხელახლა | ✓ stem-ები დაბრუნდა **ახალი job-ის გარეშე**, ცდომილება 0.487 LSB (ზღვარი 0.5), mixer-ის solo/mute დაბრუნდა |
| გაუქმება | `separating`-ში „გაუქმება" | ✓ `cancelled`, stem-ები არ არის, „გაყოფა" ხელმისაწვდომია, 1.5 წმ-ში თავისით არ „გაცოცხლდა"; „ხელახლა ცდა" → `complete` |
| შეწყვეტა | reload `separating`-ში | ✓ `s3.jobs`-ში `interrupted`, გვერდით პანელში „შეწყდა" |
| მსუბუქი ძრავა | Spleeter, 30 წმ | ✓ job → `complete`, შენახულია `engine: 'light'` |
| წაშლა | „შენახული ხმების წაშლა" | ✓ 0 ჩანაწერი, სიმღერა (`ai.song.<id>`) რჩება, „ამ მოწყობილობაზე არ შეინახა" + „შენახვა" → ისევ 9 ჩანაწერი |
| gc | ბიბლიოთეკაში არმყოფი სიმღერის ჩანაწერი | ✓ წაიშალა; ბიბლიოთეკის სიმღერისა — არა |
| ძველი მონაცემი | ორი ძველი `ai.recent` ჩანაწერი + Panduri Studio-ს პროექტი | ✓ უცვლელი (პროექტის JSON ბაიტ-ბაიტ) |
| 5 ზომა | 1440×900, 1920×1080, 768×1024, 390×844, 430×932 | ✓ horizontal overflow არ არის, 5 ზოლი, canvas = ზოლების სიმაღლე, ღილაკები ≥ 22 px და ეკრანზე; 4/5 სახელი ეტევა („დანარჩენი (ფანდური…)" იჭრება, სრულად — title-ში) |
| page errors | | ✓ 0 |

სქრინშოთები: [screens/phase2/](screens/phase2/).

**ამ ტესტმა დაიჭირა ჩემი ორი შეცდომა, სანამ commit-ი გაკეთდებოდა:** (1) timeline-ის zoom-ის ცვლადი
გამოცხადებამდე გამოიყენებოდა — სიმღერის workspace საერთოდ არ იხსნებოდა; (2) `Element.append(null)` წერდა
„null"-ს. ორივე გასწორდა და ტესტი თავიდან გავიდა. parser-ის ხარვეზებიც ტესტმა იპოვა და გასწორდა: AAC-ის
არხები (stsd-ის მუდმივი 2-ის ნაცვლად AudioSpecificConfig-იდან), `iTunSMPB`-ის სიგრძე, WebM-ის DocType.

### 7.2 გაყოფა: ნაგულისხმევი უცვლელია, ხარისხი გაზომილია

* **`aiworker.js`-ის ნაგულისხმევი (1 გავლა, 25 % overlap) `main`-ის worker-ის bitwise ტოლია:** ბანის
  `full.mp3`, 12 წმ (60–72 წმ), WASM — 4 stem × 2 არხი = 4 233 600 sample, max |სხვაობა| **0**.
* ხარისხი ქართულ სიმღერაზე (ცალკე ჩაწერილი ხმა და მუსიკა) და ქართული წყაროების routing —
  [GEORGIAN-INSTRUMENTS.md §1–2](GEORGIAN-INSTRUMENTS.md), ნედლი მონაცემი `data/sep-bench-{20,120,200}.json`,
  `data/geo-routing.json`. SDR ორ გაშვებაზე ციფრი-ციფრამდე იგივე გამოვიდა.

### 7.3 ძველი და Phase 1-ის ტესტები — ახალი build და `origin/main` (`6d5a93e932`), ერთსა და იმავე დროს, ერთ მანქანაზე

ამ სესიის შუაში ამ მანქანაზე ორი რამ შეიცვალა, რაც კოდზე არ არის დამოკიდებული: Web Audio-ს საათი
გაჩერდა (§7.1), და Playwright-ის საკუთარ Chromium-ში `fonts.gstatic.com`-ის მოთხოვნები აღარ
სრულდება (curl-ით იგივე ფონტი 0.5 წმ-ში მოდის), ამიტომ გვერდის `load` აღარ დგება. ამის
გასარჩევად ყოველი ჩავარდნილი ტესტი `origin/main`-ის build-ზეც გაეშვა, ცალკე worktree-ში.

| ტესტი | ახალი (Phase 2) | `origin/main` ახლა | დასკვნა |
|---|---|---|---|
| `studio3-core` | **75/75** ✓ | — | |
| `pstudio-core`, `storage` | ✓ | — | |
| `studio3-ui` Chromium | 36 ✓, 2 ✗ | 36 ✓, **იგივე 2 ✗** | ✗ = „პოზიცია მოძრაობს" (song pos 0, arrangement head 0, `playing: true`, owner სწორი) — აუდიოს საათი |
| `studio3-ui` WebKit | 35 ✓, 1 –, 2 ✗ | — | იგივე 2 + ცნობილი Blob-ის გამოტოვება (Phase 1) |
| `ai-studio` (ნამდვილი Spleeter, UI-ით გაყოფა, აკორდები ხმებიდან) | ✓ 4 × 926 100 | — | |
| `pstudio-ui` | ✗ „rhythm strokes reached the engine" (`t: 0.0053`) | ✗ უფრო ადრე: „three notes written from the neck" | აუდიოს საათი; ახალი build შორს მიდის |
| `ai-transcription` | ✗ TimeoutError | ✗ TimeoutError | ცვლილებამდეც ვარდებოდა (§3) |
| `refresh-regressions` | suite-ში 1 ✗ (timeout, პარალელურად WASM-ის შედარება მიდიოდა); ცალკე **2/2 ✓** | 2/2 ✓ | regression არ არის |
| `v2-shell` (9 ზომა), `first-run`, `interaction-regressions`, `ui-refresh`, `devices-ui` | ✓ | — | |
| `settings-reset` | 3/5 | (ადრე 4/10) | ცნობილი race (memory: qa-known-failures) |
| `i18n-crawl` ka/en/ru | ✗ `page.goto` timeout | ✗ იგივე | Google Fonts Playwright-ის Chromium-ში იჭედება; raw key-ის შემოწმება აქ ვერ ჩატარდა. ახალი `s3s.*` key-ები (`PD.i18n.add`) — prefix თავისუფალია (`grep`), ქართული + ინგლისური ყველას აქვს |

### 7.4 რა არ შემოწმებულა
* დაკვრის დროს playhead-ის მოძრაობა (ამ მანქანაზე საათი არ მიდის) — სხვა მანქანაზე/ბრაუზერში.
* ნამდვილი iPhone/Android: stem-ების შენახვის ადგილი და დრო, Demucs ტელეფონზე; Safari-ში ALAC და
  IndexedDB-ის ზღვრები.
* ხმა ყურით: გაყოფის ხარისხი SDR-ით იზომა, მოსმენით — არა.
* `i18n-crawl` (იხ. ზემოთ); Phase 2-ის 77 ახალი სტრიქონი (`s3s.*`) 14 ენაზე ინგლისურად ჩანს.
* Ogg/Vorbis ფაილი (parser არის, ნამდვილი ფაილით ტესტი — არა); RF64, AIFF-C, MOV v2.
