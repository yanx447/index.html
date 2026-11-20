# Panduri Studio 3.0 — არქიტექტურა (Phase 0 + 1 + 2)

**თარიღი:** 2026-11-19 · **branch:** `claude/studio3-phase01` · **საწყისი წერტილი:** `origin/main` `d484be9`
(backup: `backup/pre-studio3-2026-11-19`)

ეს დოკუმენტი აღწერს, რა იყო კოდში Studio 3.0-მდე (audit), რა აიგო Phase 1-ში და Phase 2-ში (§6)
და როგორ, და რა **არ** გაკეთებულა. სპეციფიკაცია: `Panduri_Studio_3_Master_Spec_KA.md`. დანარჩენი დოკუმენტები:
[MIGRATION.md](MIGRATION.md) · [QA.md](QA.md) · [ROADMAP.md](ROADMAP.md) ·
[GEORGIAN-INSTRUMENTS.md](GEORGIAN-INSTRUMENTS.md) (ქართული საკრავები: გაზომვა, კვლევა, ტესტების გეგმა). Panduri Studio-ს
ადრინდელი არქიტექტურა: [../studio/ARCHITECTURE.md](../studio/ARCHITECTURE.md); AI სტუდია:
[`panduri/source/AI-STUDIO.md`](../../panduri/source/AI-STUDIO.md).

---

## 0. მოკლედ

* მთავარ მენიუში ახლა **ერთი** ჩანაწერია — „სტუდია / Studio" (route `studio3`). „AI სტუდიის"
  ცალკე ჩანაწერი აღარ არის; Panduri Studio-ს ცალკე ჩანაწერი პრაქტიკის გვერდზე ერთ „სტუდიად" იქცა.
* ორივე ძველი route (`ai`, `pstudio`) და ყველა ძველი ბმული მუშაობს: ისინი ახლა **ერთ workspace-ში**
  იხსნება — ერთი header, **ერთი transport**, ერთი view-ების სისტემა, provenance-ის გვერდითი პანელი.
* ძველი მოდულები **არ გადაწერილა და არ წაშლილა**: ყოველი ხედი სწორედ AI სტუდიის ან Panduri
  Studio-ს საკუთარი pane-ია. მონაცემები ადგილზე დარჩა — არაფერი გადატანილა, არაფერი გადაწერილა.
* ახალი საერთო ფენა `PD.s3core`: ერთი transport-ის guard (`PD.transport` — ორი ძრავა ერთად
  ვეღარ ჟღერს), ერთი timebase (წამი ↔ დარტყმა), Studio Project schema 3 — როგორც **view** ორივე
  სტუდიის ჩანაწერზე, დამტკიცებული round trip-ით.

---

## 1. Audit (Phase 0): რა იყო კოდში

ყოველი სტრიქონი კოდში შემოწმდა (ფაილი და ხაზები მითითებულია). „რეალური" = მუშაობს და ტესტით
დასტურდება; „ნაწილობრივი" = მუშაობს შეზღუდვით; „არ არის" = კოდში არ არსებობს.

### 1.1 მარშრუტები და შესასვლელები (2026-11-19-მდე)

| Route | მოდული | შესასვლელები |
|---|---|---|
| `ai` | `PD.ai.page` (`ai.js`) | nav-ის „AI სტუდია" (მხოლოდ გვერდით ზოლში, ≥821px), Home-ის სწრაფი ხელსაწყო „AI", „სიმღერების" გვერდის ბარათი, პრაქტიკის გვერდი, songbook-ის `sb.toAi`, AI გაკვეთილის ღილაკი, შეტყობინება `?go=ai` |
| `pstudio` | `PD.pstudio.page` (`pstudio.js`, APP_ONLY) | პრაქტიკის გვერდის „Fanduri Studio" |
| `studio` | Author Studio (`studio.js`) | მხოლოდ owner-ისთვის — **სხვა ხელსაწყოა, ხელუხლებელი დარჩა** |

ნავიგაცია `history.pushState({ r, p })`-ზეა; URL-ში route არ ჩანს. „Bookmark"-ები აპში არის
`favorites` (გაკვეთილები, cloud-ში სინქრონდება) — Studio-ს ისინი არ ეხება.

### 1.2 AI სტუდია (`ai.js` 1575 ხაზი + `aideck`, `aiworker`, `aispl`, `aimus`, `aiscore`, `aipiano`, `airoll`, `aitab3d`, `ailesson`, `aistage`)

| ფუნქცია | სტატუსი | სად / შენიშვნა |
|---|---|---|
| ატვირთვა: ფაილი, drag & drop, მიკროფონით ჩაწერა (≤60 წმ) | რეალური | `ai.js` `open()`, `decode()` + `captureDecode()` fallback |
| ანალიზი: აკორდები, ტონალობა, ტემპი, დარტყმები | რეალური, **შეფასება** | მოწყობილობაზე, main thread-ზე. ბანზე გაზომილი: აკორდები 63 % თითო დარტყმაზე, გაკვეთილის ჩარტი 100 %, დარტყმები F 0.93. სწორი პასუხი მხოლოდ **ერთ** სიმღერაზეა — პარამეტრები ერთზეა მორგებული (AI-STUDIO.md §4.2) |
| რითმის ამოცნობა | ნაწილობრივი | ადარებს მხოლოდ მასწავლებლის 4 რითმს; ბანს „ყაზბეგურს" არქმევს, სწორია „აჭარული" (AI-STUDIO.md §7 #17) |
| ხმების გაყოფა (stems) | რეალური, Premium `ai.stems` | Spleeter 4 stem / Demucs v4 4 და 6 stem, ONNX Runtime Web 1.31.1, WebGPU ან WASM, **მოწყობილობაზე**. მთელი სიმღერა: ≤90 წმ კომპიუტერზე, ≤45 წმ ტელეფონზე (≥8 GB-ზე ≤6 წთ), გრძელზე `whole2` (ვოკალი + დანარჩენი) |
| stem-ების შენახვა | **არ არის** | მხოლოდ მეხსიერებაშია; სიმღერის დახურვისას იკარგება |
| ქართული საკრავების გაყოფა | **არ არის** | ღია მოდელს არ აქვს ფანდურის/დოლის/გარმონის კლასი. ფანდური 4 stem-ში `other`-შია, 6-ში ნაწილობრივ `guitar`-შიც |
| მელოდიის ტრანსკრიფცია | რეალური, Premium `ai.trans`, **შეფასება** | Basic Pitch (ONNX) + DSP, `fuse`; ერთი ხმა. ნამდვილ ჩანაწერზე სიზუსტე გაზომილი არ არის |
| ფანდურზე გადაწყობა | ნაწილობრივი | `aimus.mapNotes`, `aiscore.arrange`: სიმი/ლადი, დაუკრავი ნოტი ინიშნება (`range`/`conflict`) და ჩუმად არ გადაინაცვლებს; რეჟიმები **Original / Easy / Advanced / Fingerstyle** (fingerstyle-ის დამატებითი ბგერები მონიშნულია `generated`, `source: 'computed-arrangement'`) |
| სიმღერა → გაკვეთილი | რეალური, Premium `ai.learn`, **შეფასება** | `ailesson.js` + `aistage.js` (ბანი-აჭარულის ფორმატი) |
| deck: სიჩქარე 25–200 %, ტონი ±6, A–B loop, მეტრონომი სიმღერის დარტყმებზე, count-in, EQ/reverb/echo/compressor, მიქსის WAV | რეალური | `aideck.js` (WSOLA worker-ში). **საკუთარი `AudioContext`** |
| ექსპორტი: MIDI, MusicXML, TAB, JSON, ბეჭდვა; stem-ის და მიქსის WAV | რეალური, Premium `ai.export` | |
| უფასო სესია | რეალური | დღეში 1 სიმღერა, 4 საათით (`ai.pass`) |
| შენახვა | რეალური, **მხოლოდ მოწყობილობაზე** | localStorage `ai.recent` (12), IndexedDB `ai.song.<id>`, `ai.res.<id>`, `ai.tr.<id>`, `ai.rhy.<id>`; მოდელები Cache Storage-ში |

UI (baseline, [screens/baseline/](screens/baseline/)): ერთი გრძელი ვერტიკალური გვერდი. სიმღერის
გახსნისას 1440×900-ზე 1.55 ეკრანი, 390×844-ზე 1.86 ეკრანი; ტელეფონზე **დაკვრის ღილაკი პირველ
ეკრანზე არ ჩანს** (deck ~720px სიმაღლეზეა, dock-ის ქვეშ). ხედები: select + 4 ღილაკი, 9 pane.

### 1.3 Panduri Studio (`pstcore.js` 195 ხაზი, `pstudio.js` 449 → 527)

| ფუნქცია | სტატუსი | შენიშვნა |
|---|---|---|
| მოდელი (DOM-ის გარეშე): ნოტი დარტყმებში სიმითა და ლადით, notes/rhythm ტრეკები, რითმის დარტყმები, აკორდები ტაქტებზე | რეალური | `qa/pstudio-core.cjs` |
| `.panduri` v1 (უფრო ახალს უარყოფს, ძველს აწევს), MIDI SMF 1 in/out, quantize/humanize/transpose | რეალური | |
| ძრავა: track channel (gain/pan/meter) → `PD.audio`, look-ahead scheduler, loop, მეტრონომი, count-in | რეალური | `PD.audio`-ს საერთო context |
| ხედები: Fretboard, Piano roll (`airoll` adapter), Rhythm, Arrange, Mixer | რეალური | |
| პროექტები: autosave, undo/redo (120), დუბლირება, წაშლა | რეალური, **მხოლოდ მოწყობილობაზე** | localStorage `pst.list`, `pst.p.<id>`, `pst.last` |
| ხმა | ნაწილობრივი | მასწავლებლის ფანდური ყოველ ლადზე, **ერთი ჩანაწერი ნოტზე**; velocity მხოლოდ ხმას ცვლის (velocity layers/round robin არ არის) — გვერდი ამას ამბობს |
| მასწავლებლის რითმები | რეალური | დარტყმები და აქცენტები მისია; **ხანგრძლივობა მას არ მოუცია** (`timing.src: 'default'`) — გვერდი ამას ამბობს |

UI: ცალკე top bar, ცალკე transport (Play/■/pos/BPM/Metre/Loop/Metronome/Count-in), ცალკე 5 tab.
**ორი სხვადასხვა player და ორი tab-ის სისტემა** ორ სტუდიაში.

### 1.4 საერთო საფუძველი

| ნაწილი | სადაა | რას იძლევა |
|---|---|---|
| დამტკიცებული ინსტრუმენტის profile | `instrument.js` | `id: 'teacher-panduri'`, v1. სიმები 1 = **A (57, ბანი)**, 2 = C♯ (61), 3 = E (64); 17 ლადი (`src: photo`); ლადების ბგერის რუკა — თანაბარი ტემპერაცია, `src: 'computed'` (გაზომილი არ არის); `verifiedBy: null` |
| თეორია | `theory.js` | `midi(s,f)`, `positions(m)`; სიმების რიგი უცვლელია |
| კურიკულუმი | `curriculum.js` | მასწავლებლის 4 რითმი თავისი რიგით: ყაზბეგური ↓!↑↓, მთიულური ↓!↓↑!↓↑, ხორუმი ↓!↓↑↓↓!↓↑ (5/8 = 3+2, `src: teacher`), აჭარული ↓↓!↑!; ზოგადი რითმები `general` |
| ხმა | `audio.js`, `samples.js` | `note`, `strum` (სიმ-სიმ, დარტყმის მიმართულებით), `click`; ჩანაწერის გარეშე — ფიზიკური მოდელი |
| შენახვა | `core.js` | `PD.store` (localStorage `pd2:`, memory fallback), `PD.blobs` (IndexedDB `pd2-blobs`) |
| ანგარიში და cloud | `cloud.js` (Supabase) | ავტორიზაცია; სინქრონდება მხოლოდ პროგრესი (`prog.`, `sessions`, `favorites`, `xp`, `lessons.user` …). **სტუდიის მონაცემები (`ai.*`, `pst.*`) cloud-ში არ მიდის** |
| სერვერი | `panduri/backend/supabase/functions` | billing, checkout, market, push, sima, call-ice, webhooks — **აუდიოს დამუშავების სერვერი არ არსებობს** |
| Build | `build.py` | PWA `dist/app` + ერთფაილიანი `dist/artifact.html` (<16 MiB). ცვლილებამდე **4015 B** რჩებოდა |
| Deploy | — | `dist/app` → `panduri/app` → commit → push `main` → GitHub Pages; Electron (`panduri/desktop`), Capacitor (`scripts/native-setup.sh`) |
| ტესტები | `panduri/source/qa/` | 192 ფაილი, 47 `.cjs`; ბევრ ძველ `.js`-ს ხისტი path-ები აქვს და ამ მანქანაზე არ ეშვება |

### 1.5 Mock / placeholder / ყალბი ფუნქცია

ყალბი ფუნქცია ორივე სტუდიაში **ვერ ვიპოვე**: სადაც შედეგი შეფასებაა, UI ამბობს; სადაც რამე
არ არის (velocity layers, ხანგრძლივობა), ამბობს. **ორი სიმართლის ხარვეზი ვიპოვე და გავასწორე:**

1. Panduri Studio-ში მასწავლებლის რითმის დარტყმის ან აქცენტის შეცვლის შემდეგ ფაილში `src: 'teacher'`
   რჩებოდა, გვერდი კი კვლავ წერდა „მიმართულება და აქცენტები მისია" და select-ში „მასწავლებლის
   რითმი". ახლა preset-თან შედარდება: შეცვლილზე წერია „შენ შეცვალე … აღარ არის მასწავლებლის
   რითმი" (`pst.tMine`, `pst.changedR`), გვერდითი პანელი კი „შენ · შესწორებული".
2. `go('pstudio', 'rhythm')` (ძველი ბმული view-ით) არჩეულ მელოდიის ტრეკზე „აირჩიე რითმის ტრეკი"-ს
   აჩვენებდა. ახლა view თავად ირჩევს ტრეკს, რომელსაც აჩვენებს (`fitTrack`).

---

## 2. Phase 1: რა აიგო

### 2.1 მოდულები

```
src/s3core.js   PD.s3core (+ PD.transport) — DOM-ის და აუდიოს გარეშე: transport guard, timebase,
                instrument(), Studio Project schema 3 (fromSong/fromArrangement/migrate/down/index)
src/studio3.js  PD.studio3 — Studio-ს მთავარი გვერდი, workspace shell (header, transport, views,
                side panel), ორი engine adapter, საკუთარი CSS (inject-ით — single file-ში არ ხვდება)
```
ორივე `APP_ONLY` (`build.py`). ძველ მოდულებში მხოლოდ hook-ები:

| ფაილი | ცვლილება | ბაიტი single file-ში |
|---|---|---|
| `app.js` | nav-ის ერთი ჩანაწერი `PD.studio3.nav`; `TOP`/`DOCK_OF`-ის დამატება; `go('ai')` პარამეტრის გარეშე → `studio3`; route-ების გადაცემა `PD.studio3.route`-ისთვის; პრაქტიკის გვერდზე ერთი „სტუდია"; Home-ის ხელსაწყო | +227 |
| `ai.js` | `page(w, param)`: song id → `reopen`, `PD.ai.take` → `open(file)`; `PD.ai.current.id` | +301 |
| `aideck.js` | `play()` → `PD.transport.claim(api)` | +75 |
| `pstudio.js` (APP_ONLY) | embed რეჟიმი, `engine` API, `create(tpl)`, `importAsNew`, `fitTrack`, `seek`, transport claim/release, provenance-ის notice | 0 |

**Single file:** 16 773 201 → 16 773 804 B; რჩება **3412 B** 16 MiB-მდე. Studio 3 single file-ში
არ შედის (იქ არც Panduri Studio იყო): იქ nav-ში ისევ „AI სტუდიაა" — ყველა hook `PD.studio3`-ის
არსებობაზეა დამოკიდებული.

### 2.2 მარშრუტები და ძველი ბმულები

| ბმული | ადრე | ახლა |
|---|---|---|
| `go('studio3')` | — | Studio-ს მთავარი გვერდი |
| `go('ai')` (პარამეტრის გარეშე) | AI სტუდია (ატვირთვა + ბიბლიოთეკა) | **Studio-ს მთავარი** (იქ პირველი მოქმედება „სიმღერის ატვირთვაა") |
| `go('ai', <song id>)` | (პარამეტრი იგნორდებოდა) | სიმღერის workspace, სიმღერა იხსნება მოწყობილობიდან |
| `go('ai', 'lib')` | — | სიმღერის workspace ბიბლიოთეკის მდგომარეობაში (ატვირთვა, ჩაწერა, „ჩემი სიმღერები") |
| `go('ai', 'new')` + `PD.ai.take = file` | — | Studio-ს მთავარიდან არჩეული ფაილი იხსნება |
| `go('pstudio')` | Panduri Studio, ბოლო პროექტი | არანჟირების workspace, ბოლო პროექტი |
| `go('pstudio', <view>)` | ეს view | ეს view (და მისთვის შესაფერისი ტრეკი) |
| `go('pstudio', 'p:<id>[:<view>]')` | — | ეს პროექტი [და view] |
| შეტყობინება `?go=ai`, `?go=pstudio` | — | იგივე `go()` |
| history-ს ძველი ჩანაწერი `{r:'ai'}`, `{r:'pstudio'}` | — | სწორად იხსნება |

`ai` და `pstudio` ცალკე route-ებად დარჩა, რომ ყველა ძველი გამოძახება, history და ტესტი ვალიდური
იყოს; ორივე Studio-ს shell-ში იხსნება. history-ში workspace ინახავს რეალურ id-ს
(`history.replaceState`), რომ Back/Forward და გადატვირთვა იმავე სიმღერაზე/პროექტზე დაბრუნდეს.

### 2.3 Workspace shell

```
┌ header ─ ← · ტიპის ხატი · სათაური (რედაქტირებადი) · ტიპი / შენახვის სტატუსი · undo redo · ⓘ/პანელი · ⋯
├ transport (sticky) ─ ▶/❚❚ ■ « » · ტაქტი.დარტყმა + m:ss / სიგრძე · ⟳ ♩ ④
│                      seek ───────────── · BPM [წყარო] / BPM+ზომა · სიჩქარე
├ side panel (≥1100px; ზომა იცვლება და ინახება) │ view tabs (≥600px) ან Learn·Sounds·Notes·Edit (<600px)
│  წყარო · ანალიზი · stems · ტრეკები · რითმი ·  │ ┌ ძველი სტუდიის საკუთარი pane ┐
│  ინსტრუმენტი — ყველაფერი provenance-ით        │ └──────────────────────────────┘
```

**View-ების ცხრილი** (ერთი სახელები ორივე სტუდიაზე; `studio3.js` `VIEWS`):

| Studio view | ტელეფონის რეჟიმი | სიმღერა → AI სტუდიის tab | არანჟირება → Panduri Studio-ს view |
|---|---|---|---|
| დამკვრელი და ტარი | Learn | `overview` (ზოლი, ტარი, 3D ხელი, Controls) | — |
| გაკვეთილი | Learn | `learn` (+ „ფანდურის გაკვეთილის" ბარათი მხოლოდ აქ) | — |
| ხმები და მიქშერი / მიქშერი | Sounds | `instruments` | `mixer` |
| აკორდები | Notes | `chords` | — |
| TAB | Notes | `tab` | — |
| ტარი | Notes | — | `fret` |
| Piano roll | Notes | `roll` | `roll` |
| სანოტო | Notes | `notation` | — |
| მელოდია | Notes | `solo` | — |
| რითმი | Edit | `rhythm` | `rhythm` |
| ტრეკები | Edit | — | `arrange` |

არანჟირებას „Learn" რეჟიმი ჯერ არ აქვს (ტელეფონზე 3 რეჟიმია) — Phase 5. ხედი, რომელიც ტიპს არ
აქვს, **არ ჩანს** (ღილაკი, რომელიც არაფერს აკეთებს, არ არის).

ჩაშენებისას ძველ გვერდებზე CSS-ით იმალება მხოლოდ ის, რაც shell-მა ჩაანაცვლა: AI სტუდიის სათაური,
`.apr-navigation` (მისი tab-ები — shell მის select-ს თავად მართავს), `.ai-deck` (მისი transport) და
`.ai-name`; Panduri Studio embed რეჟიმში თავის top bar-ს, transport-ს და tab-ებს არ ხატავს.
AI სტუდიის „აუდიოს დამატება / ჩაწერა" და „ჩემი სიმღერები" Player view-ში დარჩა; header-ის მენიუშიც
არის „აუდიოს დამატება / ჩაწერა".

### 2.4 ერთი transport, ერთი timebase

* **`PD.transport`** (`s3core.js`): `claim(engine)` — ძრავა ჟღერადობამდე იჭერს transport-ს, და
  წინა მფლობელი **პაუზდება**; `release(engine)`; `active`; `on(fn)`. AI deck იჭერს `play()`-ზე,
  Panduri Studio — `play()`-ზე და ათავისუფლებს `stop()`-ზე. ტესტი ორივე მიმართულებით ამოწმებს:
  არანჟირება იწყება → AI deck ჩერდება; AI deck იწყება → არანჟირება ჩერდება.
* **Engine adapter-ები** (`studio3.js`): `songEngine` → `PD.ai.current.transport` (AI deck, წამებში,
  ტაქტი.დარტყმა deck-ის საკუთარი `beatAt`-ით — იგივე ციფრები, რასაც AI სტუდია აჩვენებდა);
  `arrEngine` → `PD.pstudio.engine` (დარტყმებში, ერთ ტემპზე). shell-ის transport ორივეს ერთნაირად
  მართავს: დაკვრა/პაუზა, გაჩერება (თავში), ±5 წმ ან ±1 ტაქტი, seek, ციკლი (სიმღერაზე — ტაქტი
  playhead-ის ქვეშ; არანჟირებაზე — პროექტის loop), მეტრონომი, count-in, სიჩქარე 50–150 % (სიმღერა,
  ტონი არ იცვლება), BPM და ზომა (არანჟირება, რედაქტირებადი), BPM + წყარო (სიმღერა).
* **Timebase** (`s3core.js`): `beatAt(sec, grid)`, `secAt(beat, grid)` — იზომილ დარტყმების ბადეზე
  (სიმღერა) ან ერთ ტემპზე (არანჟირება); იგივე წესი, რაც AI სტუდიის score-ს. `barBeat()` (5/8 = 2.5
  მეოთხედი), `clock()`.
* **ჯერ არ არის ერთიანი:** ორი `AudioContext` (AI deck-ის და `PD.audio`-ს); სიმღერა და არანჟირება
  ერთ workspace-ში ერთად ვერ იხსნება; ერთიანი მუსიკალური მოვლენების მოდელი და timeline ორივე ტიპზე
  — Phase 3. AI სტუდიის დეტალური კონტროლები (სიჩქარე 25–200 %, ტონი, A/B, FX) Player › Controls-ში
  დარჩა — იგივე deck-ს მართავს, ერთი მდგომარეობა.

### 2.5 Studio Project — schema 3

Schema 3 **view**-ა ორივე სტუდიის ჩანაწერზე და არა ახალი შენახული ფაილი (მიზეზი: მეორე
„სიმართლის წყარო" არ გაჩნდეს, მონაცემები არ დაიკარგოს). რეალური ფორმა (`s3core.fromSong`,
`fromArrangement`):

```json
{
  "schemaVersion": 3, "kind": "song | arrangement", "id": "ai:<id> | pst:<id>", "title": "…",
  "created": 0, "modified": 0, "ownerId": null,
  "sourceAssetId": "ai.song.<id> (IndexedDB) | null",
  "source": { "name": "…", "size": 0, "type": "audio/mpeg", "video": false, "stored": true },
  "audioClock": { "durationSeconds": 210,
    "tempoMap": { "kind": "beats | tempo | constant", "bpm": 96, "beats": 412, "phase": 1, "meter": [3, 4],
                  "source": "ai | manual", "status": "estimate | corrected | confirmed" } },
  "stems": [ { "kind": "vocals", "predictedInstrument": "vocals", "assetId": null, "kept": "memory", "from": 30, "seconds": 60 } ],
  "analyses": {
    "key":    { "name": "Dm", "scope": "nearest major/minor", "source": "ai", "status": "estimate" },
    "chords": { "count": 6, "segments": 10, "names": ["Dm", "B♭"], "source": "ai | manual", "status": "estimate | corrected" },
    "notes":  { "count": 3, "unplayable": 1, "source": "ai | manual", "status": "estimate | confirmed" },
    "rhythms": [ { "preset": "kazbeguri", "steps": [{ "dir": "down", "acc": true, "dur": 1 }],
                   "strokes": { "source": "teacher", "status": "confirmed" },
                   "timing":  { "source": "default", "status": "unavailable" },
                   "chords":  [ { "bar": 0, "name": "Dm", "frets": [0, 1, 1], "shape": { "source": "computed", "status": "confirmed" } } ] } ],
    "sections": [] },
  "instrumentProfileId": "teacher-panduri",
  "arrangements": [ { "id": "…", "format": "panduri-project", "v": 1, "tracks": [], "data": "<the .panduri project itself>" } ],
  "lessons": [ { "id": "ai-<id>", "source": "ai", "status": "estimate" } ],
  "processingJobs": [ { "kind": "analysis | separation", "engine": "on-device", "status": "complete", "kept": "memory" } ],
  "revision": 0, "saveStatus": "saved | unsaved",
  "legacy": { "store": "ai.recent | pst", "record | key": "…" }
}
```

* **გამიჯნულია:** source media (`sourceAssetId`, `source`), stems (ტიპი, ნავარაუდევი საკრავი,
  რეალური asset — დღეს `null`, რადგან stem არ ინახება — და `kept`), ანალიზის ფენები, არანჟირება,
  გაკვეთილები, დამუშავების ამოცანები.
* **Provenance:** `source` ∈ teacher · ai · manual · general · computed · default;
  `status` ∈ confirmed · corrected · estimate · unavailable (სპეციფიკაციის „დადასტურებული /
  შესწორებული / AI ვარაუდი / მიუწვდომელი"). მასწავლებლის რითმი მისად ითვლება **მხოლოდ** მანამ, სანამ
  მისი დარტყმები და აქცენტები უცვლელია (preset-თან შედარება — ფაილის `src`-ს აღარ ენდობა).
  AI-ის ორიგინალი შედეგი შესწორების შემდეგაც ინახება (`res.chords0`), ამიტომ „შესწორებული" ჩანს.
* `migrate(o)` იღებს `.panduri` v1-ს (Panduri Studio-ს `parse`-ით — ძველს აწევს) ან schema 3-ს;
  **უფრო ახალს უარყოფს** (`newer-version`). `down(v)` აბრუნებს ზუსტად იმ ჩანაწერს, რომელიც სტუდია
  ინახავს. იხ. [MIGRATION.md](MIGRATION.md).

### 2.6 Reuse map: ძველი კომპონენტი Studio 3-ში

| ძველი | Studio 3-ში | როგორ | დროებითი — სანამ |
|---|---|---|---|
| `PD.ai.page` (მთელი AI სტუდია) | სიმღერის workspace-ის შიგთავსი | embedded: სათაური/tab-ები/deck CSS-ით დამალული; view-ებს shell მისივე select-ით ცვლის; transport `PD.ai.current.transport`-ით | Phase 3 (საერთო view-ები და timeline) |
| `aideck` | სიმღერის ძრავა | `songEngine` adapter + `claim` | Phase 2–3 |
| `aistage` ბარათი | მხოლოდ „გაკვეთილი" view-ში | CSS | — |
| `PD.pstudio.page` | არანჟირების workspace-ის შიგთავსი | embed რეჟიმი, `engine`, `onState`, `onOpen` | Phase 3 |
| Panduri Studio-ს პროექტების sheet, import/export | header-ის მენიუ | იგივე ფუნქციები | — |
| `pstcore` | უცვლელი; `s3core` კითხულობს | — | — |
| `airoll` (canvas piano roll) | Piano roll ორივე ტიპში | უცვლელი | Phase 3: ერთი canonical editor |
| `instrument`, `theory`, `curriculum` | უცვლელი; side panel და schema კითხულობს | — | — |
| Author Studio (`studio`) | ხელუხლებელი | — | — |
| `pstudio`-ს standalone გვერდი (top bar, transport, tab-ებით) | კოდში დარჩა, აპში აღარ ჩანს | — | წაიშლება მხოლოდ Phase 3-ის რეგრესიული ტესტების შემდეგ |

### 2.7 მოწყობილობები

| სიგანე | navigation | side panel | transport |
|---|---|---|---|
| ≥1100px (desktop) | view tab-ები ერთ (საჭიროებისას ორ) რიგად | ჩანს; 220–440px, გადათრევით ან ←/→ კლავიშით, ინახება (`s3.sideW`); ჩართვა/გამორთვა (`s3.sideOn`) | ერთ მწკრივად + seek |
| 600–1099px (tablet) | view tab-ები (wrap) | „ⓘ" sheet-ში | იგივე |
| <600px (phone) | Learn · Sounds · Notes · Edit + ქვე-ხედების chip-ები | „ⓘ" sheet-ში | პირველი მწკრივი ერთ ხაზზე (გაზომილია 390 და 430 px-ზე), სიმღერაზე BPM არ მეორდება |

transport ყველა ზომაზე **sticky**-ა — დაკვრა ყოველთვის ხელთაა. გაზომილი: სიმღერის transport-ის
ზედა კიდე 79–96px-ზეა ყველა ხუთ ზომაზე (ადრე ტელეფონზე ~720px).

---

## 3. AI და სერვერი: საზღვრები და ხარჯი

* **დღეს ყველაფერი მოწყობილობაზეა:** ანალიზი, გაყოფა, ტრანსკრიფცია, მიკროფონი. სერვერი მხოლოდ
  მოდელის ფაილებს აძლევს (სტატიკურად, GitHub Pages; cache-დება): Demucs 4 stem 86 MB, 6 stem 57 MB,
  Spleeter 150 MB (თითო stem ~39 MB), Basic Pitch 248 KB, ONNX Runtime 1.31.1 42 MB (+ ძველი 1.20.1
  32 MB). ხარჯი = სტატიკური trafic; GPU-ს ანგარიში არ არსებობს. ზღვარი — მოწყობილობის მეხსიერება
  და სიჩქარე.
* **სერვერის GPU (Phase 2+ ან 6), თუ გადაწყდება:** ეს ახალი მონაცემთა ნაკადია — მომხმარებლის აუდიო
  სერვერზე აიტვირთება. CLAUDE.md-ის წესი („მიკროფონი მოწყობილობაზე ანალიზდება, არაფერი იტვირთება")
  და სპეციფიკაციის §11 მოითხოვს: ცალკე თანხმობა, private by default, წაშლა, ტრენინგში გამოყენება
  მხოლოდ opt-in-ით, privacy policy-ს განახლება და **მფლობელის გადაწყვეტილება**. საჭირო იქნება job
  orchestration, object storage, quota, model version-ის ჩაწერა, retry. ფასი ჯერ არ არის გათვლილი და
  არაფერი დაპირებულა.

---

## 4. Risk register

| # | რისკი | ალბათობა | გავლენა | შერბილება | ტესტი |
|---|---|---|---|---|---|
| 1 | ორი `AudioContext`: მომავალში ორი ძრავა ერთად აჟღერდეს | საშუალო | ორმაგი ხმა | `PD.transport.claim` ორივე ძრავაში | `studio3-ui` „PD.transport …" |
| 2 | AI სტუდია shell-ს DOM-ით უკავშირდება (`.apr-navigation select`, `.ai-body > .ai-deck`, `.ai-head`) — `ai.js`-ის ცვლილება ჩუმად დაარღვევს view-ებს | საშუალო | ხედი არ იცვლება | შეკრული ცხრილი ტესტში | `studio3-ui` „every song view opens …", „one transport …" |
| 3 | single file 3412 B-ზეა ლიმიტამდე | მაღალი | build ჩავარდება | ახალი კოდი მხოლოდ APP_ONLY; hook-ები მინიმალური | `build.py` assert |
| 4 | `pstudio`-ს ფაილში `src: 'teacher'` რჩება რედაქტირების შემდეგ | — | ტყუილი badge | provenance preset-თან შედარებით (გვერდიც, პანელიც) | `studio3-core` §3, `studio3-ui` „a stroke changed …" |
| 5 | history-ს `replaceState` და `app.js`-ის შიდა `param` ერთმანეთს ცდება | დაბალი | უმნიშვნელო (გადახატვა) | — | `studio3-ui` back/reopen |
| 6 | 133 ახალი სტრიქონი 14 ენაზე თარგმნილი არ არის | ცნობილი | ინგლისურად ჩანს | i18n-crawl: raw key 0; `i18n-extract` **არ** გაშვებულა (pack-ები 80 %-ს ქვემოთ ჩამოვიდოდა) | `i18n-crawl` |
| 7 | ძველი QA სკრიპტები ძველ განლაგებას ელიან | მოხდა | ტესტი ცდება | 3 სკრიპტი მინიმალურად განახლდა (`QA.md`) | |
| 8 | stem-ები და Studio-ს პროექტები მხოლოდ მოწყობილობაზეა (Phase 2-დან stem-ები **ინახება**, მაგრამ მხოლოდ ამ მოწყობილობაზე) | ცნობილი | მონაცემის დაკარგვა მოწყობილობის შეცვლისას | WAV export (16/32-bit) | Phase 7 |
| 12 | შენახული stem-ები დიდია: 4 stem × სტერეო × 44.1 kHz × Int16 ≈ 42 MB/წთ | მაღალი | მოწყობილობის ადგილი | ზომა ჩანს, `estimate()`-ით შემოწმება შენახვამდე, წაშლა, `gc()` | `studio3-phase2` |
| 13 | Spleeter-ის (მსუბუქი ძრავა) ONNX კონვერტაცია ქართულ და pop მასალაზე თითქმის არ ყოფს | გაზომილი | ცუდი stem-ები ტელეფონზე | UI წერს გაზომილ რიცხვებს და ურჩევს ზუსტ ძრავას; გამოსწორებას TensorFlow-ის საცნობარო სჭირდება | `sep-bench` |
| 14 | ამ მანქანის Web Audio-ს საათი არ მიდის (0.005 წმ / 0.8 წმ) — „დაკვრისას პოზიცია მიდის" აქ ვერ შემოწმდება | გარემო | დაუმოწმებელი | ტესტი საათს ზომავს და ნაბიჯს მიზეზით გამოტოვებს | `studio3-phase2` |
| 9 | Safari-ს private რეჟიმში Blob IndexedDB-ში არ ინახება; AI სტუდია მაშინ „ადგილი აღარ არის" წერს (ზუსტი მიზეზი სხვაა) | საშუალო | შეცდომაში შემყვანი ტექსტი | header წერს „ფაილი შენახული არ არის"; ტექსტის გასწორება შემდეგში | WebKit run |
| 10 | Premium-ის კარიბჭის გვერდის ავლით გახსნა shell-იდან | დაბალი | შემოსავალი | shell მხოლოდ AI სტუდიის pane-ებს რთავს; კარიბჭე `pro()`-შია | უფასო სესიით გავლილი ტესტები |
| 11 | `pstudio`-ს standalone კოდი აღარ ჩანს (dead code) | — | მოვლის ხარჯი | წაშლა Phase 3-ის შემდეგ | — |

## 5. Acceptance — Phase 1-ის exit criteria → ტესტი

| კრიტერიუმი | სად მოწმდება |
|---|---|
| ერთი Studio entry; ძველი route-ები თავსებადი | `studio3-ui` A, C |
| Import / New Project / Recent Projects | `studio3-ui` B, D, E |
| ერთი project/transport მდგომარეობა, ორმაგი ხმის გარეშე | `studio3-ui` D, F |
| ძველი workflow-ები მუშაობს | `pstudio-core`, `pstudio-ui`, `ai-studio`, `studio3-ui` |
| მონაცემი არ იკარგება | `studio3-core` §2, §5; `studio3-ui` C, E |
| desktop/tablet/phone | `studio3-ui` G (5 ზომა, სქრინშოთები) |

დეტალური შედეგები: [QA.md](QA.md).


---

## 6. Phase 2: import, stem-ები, job-ები, ერთი timeline (2026-11-19)

**branch:** `claude/studio3-phase02` (Vercel-ის Pillow-ის fix-ზე, `claude/vercel-pillow`, რომ preview build
გავიდეს). ახალი მოდული `src/s3stems.js` (APP_ONLY); hook-ები `ai.js`-ში (+815 B — single file-ში ლიმიტამდე
~2.3 KB რჩება), `aiworker.js`-ში (overlap/shift-ის პარამეტრები; ნაგულისხმევი ქცევა იგივეა), `s3core.js`-ში
(`fromSong`-ის `kept`, `media`), `studio3.js`-ში (Stems view, გვერდითი პანელი).

### 6.1 Import: ფაილი ისეთი, როგორიცაა
* `PD.s3media.probe(blob)` ფაილის **საკუთარ header-ს** კითხულობს: WAV/RF64 (PCM, float, extensible),
  AIFF/AIFC, FLAC (STREAMINFO), MP3 (Xing/Info/VBRI — VBR-ის ზუსტი სიგრძე), ADTS AAC, MP4/M4A/MOV/3GP
  (box-ები slice-ებით — ტელეფონის ვიდეო, რომლის `moov` ბოლოშია, მთლიანად არ იკითხება; `esds`-დან AAC-ის
  ტიპი, არხები, SBR/PS = HE-AAC v1/v2; `alac`, `dfLa`; edit list და `iTunSMPB` — encoder-ის priming-ის
  გარეშე სიგრძე), Ogg (Opus/Vorbis/FLAC, ბოლო გვერდის granule), WebM/Matroska (EBML: DocType, CodecID,
  SamplingFrequency, Channels).
* `PD.s3media.rate()` → `ai.js`-ის `decode()` ფაილს **მის საკუთარ sample rate-ზე** შიფრავს
  (`OfflineAudioContext(1, 1, rate)`), 48 kHz-მდე: 44.1 kHz-იანი სიმღერა აღარ გადადის 48 kHz-ზე და მერე ისევ
  44.1-ზე (Demucs). 48 kHz-ზე მაღალი (96 kHz) იშიფრება 48 kHz-ზე — ტელეფონზე ორმაგი მეხსიერება
  მსმენელისა და მოდელისთვის არაფერს იძლევა; side panel ამას წერს („48 kHz (ფაილი: 96 kHz)"). HE-AAC
  გამოუცხადებელი SBR-ით და AAC < 32 kHz ბრაუზერის ნაგულისხმევ სიხშირეზე რჩება. header თუ ვერ
  წაიკითხა — ისე, როგორც ადრე.
* **ორიგინალი ფაილი** ინახება ბაიტ-ბაიტ (`ai.song.<id>`, უცვლელი); „ორიგინალი ფაილის შენახვა"
  timeline-ზეც არის.
* ბრაუზერი თუ ფაილს ვერ შიფრავს (მაგ. ALAC Chrome-ში), Studio header-იდან წერს, რა არის და რა ქნას
  (`s3s.noDec`).
* გვერდით პანელში: ფორმატი, კოდეკი (უდანაკარგო/დანაკარგიანი), sample rate, ბიტები, არხები, bitrate,
  „გაშიფრულია: 44.1 kHz — ფაილის საკუთარი სიხშირე, გადაყვანის გარეშე".

### 6.2 Stem-ები მოწყობილობაზე
* ფორმატი: [MIGRATION.md §1](MIGRATION.md). Int16, თითო არხი ცალკე ჩანაწერად, track-ის `g = max(1, peak)`
  — clipping არ არის; გახსნისას ცდომილება ≤ 0.5 LSB × g (გაზომილი: 0.487 LSB).
* შენახვამდე `navigator.storage.estimate()`: ადგილი თუ არ არის — job „მზადაა, მაგრამ არ შეინახა" და
  მიზეზი (საჭიროა X, თავისუფალია Y); ღილაკი „შენახვა" მოგვიანებით. ჩანაწერი ნახევრად არასოდეს რჩება.
* სიმღერის ხელახლა გახსნისას (ნებისმიერ view-ში) შენახული stem-ები თავად ბრუნდება `CUR.adopt()`-ით —
  ხელახლა გაყოფის გარეშე; mixer-ის მდგომარეობაც (ხმა, mute, solo, pan, FX) ინახება და ბრუნდება.
* წაშლა: „შენახული ხმების წაშლა" (სიმღერა რჩება), სიმღერის წაშლა ბიბლიოთეკიდან, `gc()` Studio-ს მთავარზე.

### 6.3 Processing job-ები
* ყოველი გაყოფა (ზუსტი/მსუბუქი, ნებისმიერი მონაკვეთი, `whole2`) — job: `queued → loading → separating →
  saving → complete | partial | error | cancelled`; წინა სესიის დაუსრულებელი — `interrupted`.
* პროგრესი worker-ის საკუთარი შეტყობინებებიდან (ჩამოტვირთვა, unpack, სეგმენტები, ETA), WebGPU/WASM.
* **გაუქმება** worker-ს აჩერებს (`terminate`) და pane-ს საწყის მდგომარეობაში აბრუნებს; **ხელახლა ცდა**
  იმავე პარამეტრებით; **შეცდომა** ითარგმნება `ai.js`-ის ტექსტით (`ai.fail`, `ai.lowmem`, `ai.gpuBad`,
  `ai.stuck`).
* ბოლო 12 job — `s3.jobs` (აუდიოს გარეშე); გვერდით პანელში „ბოლო დამუშავებები".

### 6.4 ერთი timeline, ერთი transport
* Stems view-ს თავში: ორიგინალის ტალღა + თითო stem-ის ტალღა ერთ დროის ღერძზე, ტაქტის ხაზები
  სიმღერის საკუთარი დარტყმებიდან, loop-ის არე, **ერთი playhead** — AI სტუდიის deck-იდან
  (`PD.ai.current.transport`), იგივე, რასაც Studio-ს ზედა transport მართავს. შეხება/გადათრევა = seek;
  ←/→ = ±5 წმ.
* გაყოფილი მონაკვეთის გარეთ stem-ს არაფერი აქვს — დაჩრდილულია; თუ AI მიქსი ისმის და იქ დააჭირე,
  Studio ორიგინალზე გადადის. „გაყოფილი ნაწილი" timeline-ს ამ მონაკვეთზე ადიდებს.
* M / S / WAV თითო ზოლზე. M და S **იმავე** mixer-ს მართავს (AI სტუდიის `.ai-mix`; Phase 1-ის მსგავსად
  DOM-ით), ასე რომ ორი mixer-ი არ არსებობს; ხმა, pan, FX — mixer-ში, ზოლების ქვეშ.
* WAV: 16-bit ან **32-bit float** (უდანაკარგო — ტესტით bit-exact).

### 6.5 გაყოფის ხარისხი
გაზომილი ბანის „აჭარულზე" ცალკე ჩაწერილი ხმითა და მუსიკით — [GEORGIAN-INSTRUMENTS.md §2](GEORGIAN-INSTRUMENTS.md#2-ბაზისური-ხარისხი-ქართულ-სიმღერაზე-fact-გაზომილი).
* ახალი არჩევანი „მაღალი · 2 გავლა" (Demucs-ის shift trick, `ai.shifts = 2`): სამ მონაკვეთზე +0.03…+0.42
  dB ვოკალზე, არცერთზე უარესი; ~1.8× ნელი.
* 50 % overlap გაიზომა და **არ** ჩაირთო (−0.34 … +0.43 dB).
* Spleeter-ის ხარისხის პრობლემა გაიზომა და აღწერილია; ფიქსი ცალკე ამოცანაა.

### 6.6 Acceptance — Phase 2 → ტესტი
| კრიტერიუმი | სად მოწმდება |
|---|---|
| MP3/WAV/M4A/FLAC/MP4 (+AIFF, AAC, WebM, 96 kHz float) იმპორტი, ფორმატის სწორად წაკითხვა | `studio3-phase2` probe × 12 |
| ორიგინალის ხარისხი: საკუთარ rate-ზე, უდანაკარგოები bit-exact | `studio3-phase2` import × 7 |
| stem-ები მუდმივად პროექტში, ხელახლა გახსნა გაყოფის გარეშე | „after a reload …" |
| M / S / Volume / Pan / WAV თითო stem-ზე | „solo and mute …", „WAV export …", mixer (`ai-studio`) |
| პროგრესი, გაუქმება, შეცდომა, ხელახლა ცდა | „a job that fails …", „cancelled …", „interrupted" |
| ტალღა + stem-ები + timeline ერთ transport-ზე | „the timeline seeks …", „zooms …" |
| ძველი ფუნქციები და მონაცემები | ძველი ტესტები ([QA.md](QA.md)), „old data is untouched" |
| ქართული საკრავები — კვლევა, არა ფუნქცია | `geo-routing`, [GEORGIAN-INSTRUMENTS.md](GEORGIAN-INSTRUMENTS.md) |
