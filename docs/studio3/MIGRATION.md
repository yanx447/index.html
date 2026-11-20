# Studio 3.0 — მიგრაცია, თავსებადობა, rollback

**მთავარი:** Phase 1-ში **არცერთი მონაცემი არ გადატანილა და არ გადაწერილა.** ორივე სტუდია
თავის ჩანაწერებს იმავე ადგილას, იმავე ფორმატით ინახავს. Studio 3-ის project (schema 3) მათზე
**view**-ა: მეხსიერებაში იქმნება, არსად ინახება. ამიტომ rollback მონაცემს ვერ დააზიანებს.

## 1. სად რა ინახება (უცვლელია)

| ვინ | სად | key | რა |
|---|---|---|---|
| AI სტუდია | localStorage (`pd2:`) | `ai.recent` | ბოლო 12 სიმღერის სია: `{ id, name, title, size, type, at, key, bpm, chords, stored }` |
| AI სტუდია | IndexedDB `pd2-blobs` | `ai.song.<id>`, `ai.res.<id>`, `ai.tr.<id>`, `ai.rhy.<id>` | ორიგინალი ფაილი; ანალიზი (`res.chords0` = AI-ის აკორდები შესწორებამდე, `res.bpmBy = 'hand'`); ტრანსკრიფცია; რითმი |
| AI სტუდია | localStorage | `ai.lessons`, `ai.pass`, `ai.tab`, `ai.*` პარამეტრები | გაკვეთილები, უფასო სესია, UI |
| Panduri Studio | localStorage | `pst.list`, `pst.p.<id>`, `pst.last` | პროექტების სია; პროექტი (`.panduri` v1, `format: 'panduri-project'`); ბოლო გახსნილი |
| მოდელები | Cache Storage | `panduri-ai-v1`, `panduri-spl-v1` | Demucs, Spleeter |

cloud-ში (Supabase) ამათგან **არაფერი** მიდის (`cloud.js` `PKEYS`): ეს მხოლოდ ამ მოწყობილობის
მონაცემია. „ყველა მონაცემის წაშლა" (Settings) მათ შლის, როგორც ადრე.

**Phase 2-ის ახალი ჩანაწერები (2026-11-19, `src/s3stems.js`) — ყველა მხოლოდ ამ მოწყობილობაზე, cloud-ში არ მიდის:**

| სად | key | რა |
|---|---|---|
| IndexedDB `pd2-blobs` | `s3.stems.<songId>` | შენახული stem-ების აღწერა: `{ v: 1, song, at, sr, from, len, two, engine: 'heavy'\|'light', model: 'model'\|'model6'\|'spl', ep: 'webgpu'\|'wasm', shifts, tracks: [{ name, n, ch, g }], bytes, mix }` |
| IndexedDB `pd2-blobs` | `s3.stems.<songId>.<track>.<channel>` | თითო არხის sample-ები: `ArrayBuffer` Int16, `g`-ზე გაყოფილი (`g = max(1, peak)`), ასე რომ არაფერი იჭრება; გახსნისას ისევ `g`-ზე მრავლდება. ცდომილება ≤ 0.5 LSB × g |
| localStorage | `s3.jobs` | ბოლო 12 დამუშავება, აუდიოს გარეშე: `{ id, song, kind, engine, model, shifts, two, from, len, state, err, at, end, bytes, ep }`. დაუსრულებელი job შემდეგ გახსნაზე `interrupted` ხდება |
| localStorage | `ai.shifts` (1\|2), `s3.wavFmt` (`i16`\|`f32`), `s3.keep` (true) | ხარისხის, WAV-ის ფორმატის და შენახვის არჩევანი |

ძველი ჩანაწერი **არ იცვლება**: სიმღერა (`ai.song.<id>`), ანალიზი, ტრანსკრიფცია და `ai.recent` იგივეა.
stem-ები **გვერდით** იწერება. `migrate()`/`down()` უცვლელია: `down()` ისევ ზუსტად `ai.recent`-ის
ჩანაწერს აბრუნებს, stem-ები ძველ ჩანაწერში არასოდეს ხვდება. schema 3-ის view-ში
(`fromSong(…, { kept, media })`) stem-ს აქვს `kept: 'device'` და `assetId: 's3.stems.<id>'`, წყაროს კი
`source.media` (ფორმატი, კოდეკი, sample rate, ბიტები, არხები).

**წაშლა:** სიმღერის წაშლა ბიბლიოთეკიდან (`forget`) მის stem-ებსაც შლის. Studio-ს მთავარი გვერდი
(`gc()`) შლის იმ სიმღერების stem-ებს, რომლებიც ბიბლიოთეკაში აღარ არის. „შენახული ხმების წაშლა"
მხოლოდ stem-ებს შლის, სიმღერა რჩება. Settings-ის „ყველა მონაცემის წაშლა" `pd2-blobs`-ს მთლიანად შლის.

**Rollback Phase 2-დან:** ძველი აპი `s3.stems.*` და `s3.jobs` key-ებს უბრალოდ ვერ ხედავს. ისინი
ადგილს იკავებენ, სანამ მომხმარებელი Settings-იდან არ წაშლის, ან სანამ ახალი ვერსია `gc()`-ს არ
გაუშვებს. სიმღერები და ანალიზი ძველ აპში ისევე იხსნება, როგორც ადრე.

**Studio 3-ის ახალი key-ები (Phase 1) — მხოლოდ UI-ის არჩევანი:** `s3.view.song`, `s3.view.arr` (ბოლო ხედი),
`s3.m.<kind>.<mode>` (ბოლო ხედი რეჟიმში), `s3.sideW`, `s3.sideOn` (გვერდითი პანელი). ძველი აპი მათ
უბრალოდ ვერ ხედავს. `PD.ai.take` (Studio-ს მთავარიდან არჩეული ფაილი) მხოლოდ მეხსიერებაშია.

Studio 3-ში შექმნილი ყოველი პროექტი ჩვეულებრივი ჩანაწერია ზემოთ მოცემულ ადგილებში: შაბლონიდან
ან MIDI-დან შექმნილი არანჟირება — `pst.p.<id>`; ატვირთული სიმღერა — `ai.recent` + IndexedDB.

## 2. Schema 3: ვერსიები და round trip

`PD.s3core` (`src/s3core.js`):

* `fromArrangement(p)` — `.panduri` პროექტი → schema 3; პროექტი თავად ჩადებულია
  `arrangements[0].data`-ში (არ კოპირდება). `toArrangement(v)` აბრუნებს **იმავე ობიექტს**.
* `fromSong(entry, res, live)` — `ai.recent`-ის ჩანაწერი (+ ანალიზი, თუ ხელთაა) → schema 3;
  `toSong(v)` აბრუნებს იმავე ჩანაწერს.
* `migrate(o)` — `.panduri` v1 (Panduri Studio-ს `parse()`-ით: ძველს ნაკლული ველები ემატება,
  ნოტის ბგერა ინსტრუმენტიდან ხელახლა იკითხება), `ai.recent`-ის ჩანაწერი ან schema 3 → schema 3.
  `schemaVersion > 3` ან `.panduri` `v > 1` → **`newer-version`** (უარი; ნახევრად არ იკითხება).
  სხვა → `not-a-project`.
* `down(v)` — `migrate()`-ის შებრუნებული: ზუსტად ის ჩანაწერი, რომელსაც სტუდია ინახავს.

**ტესტით დამტკიცებული** (`qa/studio3-core.cjs`, ფიქსტურები `qa/fixtures/studio3/`):
* ძველი v1 ფაილი (`old-v1.panduri`, `countIn`/`metro` ველების გარეშე, ერთი ნოტი ფანდურის გარეთ):
  `serialize(down(migrate(file)))` == `serialize(parse(file))` — ანუ ზუსტად ის, რასაც Panduri Studio
  თავად კითხულობს; ფაილის **ყოველი** ველი, ყოველი ნოტის სიმაღლე/სიმი/ლადი/დრო/სიგრძე და რითმის
  დარტყმები/აქცენტები/ხანგრძლივობები/აკორდები უცვლელია; ფანდურის გარეთ მყოფი ნოტი შენახულია და
  მონიშნული (`s: 0, f: -1`).
* ორი `ai.recent` ჩანაწერი (შენახული აუდიო; შეუნახავი ვიდეო): `down(migrate(entry)) === entry`.
* უფრო ახალი schema და `.panduri` v2 უარყოფილია.

ბრაუზერში (`qa/studio3-ui.cjs`): Panduri Studio-ს მიერ შენახული ძველი პროექტი იხსნება ძველი
route-ით `go('pstudio')`; `.panduri` და MIDI-ის export → import ახალ პროექტებად (ორიგინალს
ახალი id არ ეხება); გადატვირთვის შემდეგ ყველაფერი ადგილზეა.

## 3. ძველი ბმულები

იხ. [ARCHITECTURE.md §2.2](ARCHITECTURE.md#22-მარშრუტები-და-ძველი-ბმულები). მოკლედ: `ai` და
`pstudio` route-ები დარჩა; `go('ai')` პარამეტრის გარეშე Studio-ს მთავარს ხსნის; history-ის ძველი
ჩანაწერები, შეტყობინებები `?go=ai` / `?go=pstudio` და ყოველი `go('ai' | 'pstudio', …)` გამოძახება
კოდში მუშაობს. single-file build-ში (Studio 3 იქ არ შედის) ყველაფერი ისეა, როგორც ადრე.

## 4. Rollback

1. **ვებ-ვერსია:** `git revert <Studio 3-ის commit>` `main`-ზე და push — GitHub Pages წინა აპს
   მისცემს. ან `main` დაბრუნდეს `backup/pre-studio3-2026-11-19`-ზე (`d484be9`) — ეს force push-ია და
   მხოლოდ მფლობელის თანხმობით.
2. **მონაცემი rollback-ის შემდეგ:** უცვლელი. Studio 3-ში შექმნილი სიმღერები ძველი AI სტუდიის
   ბიბლიოთეკაში ჩანს, არანჟირებები — Panduri Studio-ს პროექტებში. `s3.*` key-ები ძველ აპს არ ეხება.
3. **Installer-ები:** წინა ვერსია იგება `backup/pre-studio3-2026-11-19`-დან (`panduri/desktop`).

## 5. როცა schema 3 თავად შეინახება (Phase 2–3)

Phase 2-ში Studio 3 პირველად ფლობს მონაცემს — stem-ებს (ზემოთ, §1). ისინი ცალკე key-ებშია და ძველს
არ ცვლის. როცა სიმღერა და არანჟირება ერთ პროექტად შეინახება (Phase 3):
* ახალი ჩანაწერი იწერება **გვერდით** (`s3.p.<id>`), ძველი არ გადაიწერება ადგილზე;
* `down()` რჩება — ყოველი schema 3 პროექტიდან ძველი სტუდიის ჩანაწერი აღდგება;
* ყოველ ვერსიას ფიქსტურა და round-trip ტესტი აქვს; უცნობი უფრო ახალი ვერსია უარყოფილია;
* AI-ის ნედლი შედეგი, შესწორება და provenance ცალ-ცალკე ინახება (სპეციფიკაცია §9).
