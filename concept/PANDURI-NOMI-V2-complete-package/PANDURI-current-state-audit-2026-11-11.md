# PANDURI — არსებული მდგომარეობის აუდიტი
**თარიღი:** 11 ნოემბერი, 2026 · **ავტორი:** Product design concept by Yanx  
**საფუძველი:** მომხმარებლის 3 მიმდინარე სქრინი + საჯარო GitHub რეპოზიტორიის `main` კოდი (ბოლო ნანახი Panduri app commit: `162efc5`, 10 ნოემბერი, 2026 UTC).  
**რეპოზიტორია:** https://github.com/yanx447/index.html/tree/main/panduri  
**გამოქვეყნებული ვერსიის მისამართი:** https://yanx447.github.io/index.html/panduri/app/

> **მნიშვნელოვანი სიზუსტე:** ცოცხალი საიტის ინტერფეისი ამ გარემოდან პირდაპირ ვერ გავხსენი. GitHub-ზე კოდი და მომხმარებლის სქრინები შევამოწმე. აქ „კოდში არსებობს“ **არ ნიშნავს**, რომ ფუნქცია ყველა მოწყობილობაზე და ყველა ანგარიშით უკვე უპრობლემოდ მუშაობს. რეალური QA ცალკე აუცილებელია. ამ დოკუმენტში **ფაქტი / კოდის ინტერპრეტაცია / ახალი მოთხოვნა** ერთმანეთისგან გამიჯნულია.

## 1. რა არსებობს დღეს (კოდით ან სქრინებით დადასტურებული)

| მიმართულება | სტატუსი და მტკიცებულება | ვერსია V2-ში |
|---|---|---|
| აპის პლატფორმა | არსებობს GitHub Pages PWA და Android/iOS აწყობის ინსტრუქცია `panduri/README.md`. `panduri/app/` არის build output | არ შევქმნათ ახალი პროექტი; ცვლილება პირველ რიგში წყაროში |
| Bottom navigation | `js/app.js`: **მთავარი / სწავლა / აკორდები / ტიუნერი / AI ანალიზი / პროფილი** — ზუსტად 6 ტაბი | პირველ ეტაპზე შევინარჩუნოთ ყველა გზა. „საზოგადოება“ სწრაფად მისაწვდომი გახდეს, ტაბების საბოლოო გადაწყობა ცალკე UX გადაწყვეტილებაა |
| ტიუნერი | `js/samisimi.js` ტვირთავს `tuner/index.html?embedded=1` iframe-ით; `tuner/js/main.js` მართავს მიკროფონს, რეჟიმებს, სიმებს, ეკრანის ინდიკატორს | **აუდიო ალგორითმი, A/C♯/E, რეჟიმები, ჰერცები, დაკვრის ღილაკები ხელუხლებელი**; იცვლება მხოლოდ დიზაინი და ვიზუალური ინტეგრაცია |
| სწავლება | `js/engine.js`, `detector.js`, `practice.js`, `curriculum.js`, `lessons.js` — mic-first გაკვეთილები და შეფასება | არ შეიცვალოს event/score/WAIT/transport; მხოლოდ UX შრე |
| აკორდები / ხელები / 3D | `js/tools.js`, `neck.js`, `three3d.js`, `hand3d.js`, ფიგურების ვიდეოები | რეალისტური finger placement, Bm შემოწმება, performance check |
| Rhythm + theory | `rhythms.js`, `theory.js`, `solfege.js`, `book.js`, `notes.js` | არსებული კონტენტი არ გადაიწეროს; დაემატოს ვიზუალური ერთიანობა |
| AI ანალიზი | `ai.js`, `aimus.js`, `aispl.js`, `ailesson.js` — tempo, chords, transcription, on-device/worker pipeline | არ დავარქვათ ყველა პასუხს „100% ზუსტი“; დაემატოს trust/confidence/error UI |
| სოციალური ფიდი | `js/social.js`: „გლობალური“ + „მეგობრები“, ერთპოსტიანი ვერტიკალური სქროლი, ვიდეო autoplay/pause IntersectionObserver-ით | გადაიქცეს მართლა immersive, TikTok-ის ხარისხის სანახავ გარემოდ |
| პოსტები | ფოტო, ვიდეო, აუდიო/მუსიკა, ტექსტი; caption, audience **ყველა / მხოლოდ მეგობრები** | მეტად ძლიერი editor, progress, drafts, cover, privacy |
| ვიდეო-მონაცემები | `social.js` კოდით ლიმიტები: ფოტო 20 MB, ვიდეო 50 MB და 10 წთ; აუდიო 30 MB და 15 წთ | UI-ში მკაფიოდ ჩანდეს მიმდინარე ლიმიტები; შეცვლა მხოლოდ backend-ის შესაბამისი მხარდაჭერით |
| რეაქციები | `social.js`: ფანდური, გული, ცეცხლი, ტაში, სიცილი, გაოცება, სევდა; double tap ფანდურის რეაქცია | დახვეწილი ჟესტები/მსუბუქი ანიმაცია, არ დაიკარგოს რეაქციის state |
| კომენტარები/გაზიარება | `social.js` comments sheet და გაზიარება ჩატში/გარეთ | Liquid Glass sheet, keyboard-safe composer, threaded replies შემდგომ ეტაპად |
| ადამიანები | `social.js` nickname, friends, member profile | პროფილის grid, badges, video library, public/private სტატუსი |
| ჩატი | `community.js`: 1:1 მიმოწერა, სერვერის კონფიგურაციაზე დამოკიდებული media, reactions, photos; screenshot-ზეც ჩანს DM | NOMI-ს მსგავსი chat, reliable keyboard, read/reply state, reactions, composer |
| სტიკერები / ემოჯები / GIF | `chatkit.js`: emoji picker, შიდა Panduri სტიკერები, GIF მხოლოდ თუ backend-ს აქვს მხარდაჭერა | Sticker Store, recent/favorites, emoji display theme (System / Noto / Twemoji); licensing აუცილებელია |
| ვიდეოზარი | `community.js`: WebRTC, მიკროფონი/კამერა, signaling; some networks need TURN; Premium ფუნქციად არის აღწერილი | iOS-like call screen + minimization/restore; TURN/reconnect QA |
| დახმარების საზოგადოება | `community.js`: Help board, Q&A | ცალკე კარგად დალაგებული სექცია |
| უსაფრთხოება | `community.js`: report/block/rules; backend enforcement is claimed in code comments | server-side moderation, reports, minors/safety QA |
| Premium | `premium.js` და `billing.js`: entitlement, web TBC/PayPal, native store/RevenueCat-style plugin logic | **ფუნქციის შეცვლა მხოლოდ ტესტებით**, UI და purchase/restore/error states დახვეწა |
| ენები | `index.html` იტვირთება მრავალი დამატებითი ლოკალი და app Georgian/English | სოციალური კოპი/გახანგრძლივებული ქართული ტექსტები/RTL testing |
| Motion | `motion.js`, `app.js`: უკვე არის page transitions, swipe-back და Reduce Motion | არსებული მოძრაობის სისტემა გაამდიდროს, არა ჩაანაცვლოს ქაოსური ანიმაციებით |
| ასისტენტი „სიმა“ | `sima.js`: ცოდნის ბაზაზე დაფუძნებული ასისტენტის UI; voice hooks კოდში stub-ებია | არ მივაწეროთ არარსებული ხმოვანი შესაძლებლობა; UI-ის გაუმჯობესება ცალკე |

## 2. რას აჩვენებს შენი სამი სქრინი

1. **ტიუნერი „სამი სიმი“:** ხისფერი UI; ნახევარწრიული cents-ინდიკატორი, A/C♯/E სიმები, ხელით/ავტო/აწყობა, მიკროფონი, ეტალონი, აკორდი, 360° headstock. ქვედა 6-ტაბიანი navigation. **შესანარჩუნებელია ყველა ეს კონტროლი და აუდიო შეფასება.**
2. **პირადი მიმოწერა:** chat „ნუკრი“; ფანდურის თემატური სტიკერები, „დაწერე“ composer, +/emoji/send, ჩატის უკნიდან დაბრუნება; საზოგადოების გვერდი ამჟამად **პროფილის ზონიდან** იხსნება. **კონტენტი და სერვერის მონაცემები არ უნდა დაიკარგოს.**
3. **საზოგადოების ფიდი:** ზედა ქვეგვერდები „ფიდი“, „საუბრები“, „მეგობრები“, „დახმარება“, „საჩივრები“; „გლობალური / მეგობრები“ switch; „ახალი პოსტი“; vertical video/music card; action rail მარჯვნივ; პროფილი, ქვედა navigation. **ეს ფუნქცია არსებობს — მოთხოვნაა მისთვის უფრო თანამედროვე ვიზუალური იერი.**

## 3. ღია საკითხები — კოდით ვერ დადასტურდება მარტო

- რეალურ iPhone/Android მოწყობილობაზე მინიმალური audio latency, tuner note accuracy, permissions, mic collision.
- წვდომის/ვიზიტის ნამდვილ server-side უფლებები, RLS სრული მიგრაცია, media signed URLs, blocked users edge cases.
- ვიდეოზარის ICE/TURN ყველა მობილურ ქსელში; background interruptions და incoming call reliability.
- Premium purchase end-to-end წარმატება, webhook reconciliation, app store sandbox purchases.
- სქროლის FPS დაბალ მოწყობილობაზე, memory leaks, video lifecycle და accessibility.
- ეკრანის სქრინების გადაღების დრო ზუსტია მომხმარებლის დართული მასალის ფარგლებში; GitHub commit მიუთითებს მხოლოდ იმას, რაც კოდში ჩანს, არა deployed artifact hash-ს.

## 4. მთავარი პროდუქტის გადაწყვეტილება

**არსებული ფუნქციების შენარჩუნება > ახალი UI.** არ წაიშალოს რაიმე მოქმედი module ან არ გადაიწეროს data schema ვიზუალური მიზნის გამო. `panduri/app/` არის generated output; იპოვე პირველწყარო (`panduri/build.py` და source სტრუქტურა) და შეცვალე source, შემდეგ build და publish. `panduri/app/js/config.js` / server keys / billing credentials არ შეცვალო.

### რეკომენდებული UI პრიორიტეტი

- P0: საერთო design tokens, შავი NOMI-style surface, Liquid Glass floating controls, უკვე არსებული **6 tab-ის** სტრუქტურით; ტიუნერი უცვლელი ფუნქციით.
- P1: **საზოგადოების** feed/chats/profiles/post editor/social interactions redesign; ვერტიკალური feed მართლა ეკრანისთვის შექმნილი.
- P2: emoji themes, sticker packs, DM/Call UX; ეს ჯერ მოთხოვნაა, არა მიმდინარე ფუნქცია.
- P3: AI, lesson, premium, profile/settings ვიზუალური გამართვა და cross-device QA.

## 5. სანდო წყაროები პროექტის შიგნით

- `panduri/app/ARCHITECTURE.md` — https://github.com/yanx447/index.html/blob/main/panduri/app/ARCHITECTURE.md
- `panduri/app/js/app.js` — https://github.com/yanx447/index.html/blob/main/panduri/app/js/app.js
- `panduri/app/js/social.js` — https://github.com/yanx447/index.html/blob/main/panduri/app/js/social.js
- `panduri/app/js/community.js` — https://github.com/yanx447/index.html/blob/main/panduri/app/js/community.js
- `panduri/app/js/chatkit.js` — https://github.com/yanx447/index.html/blob/main/panduri/app/js/chatkit.js
- `panduri/app/js/samisimi.js` — https://github.com/yanx447/index.html/blob/main/panduri/app/js/samisimi.js
- `panduri/app/tuner/js/main.js` — https://github.com/yanx447/index.html/blob/main/panduri/app/tuner/js/main.js
- `panduri/app/js/billing.js` — https://github.com/yanx447/index.html/blob/main/panduri/app/js/billing.js
