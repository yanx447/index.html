# სამი სიმი — გამოქვეყნების გეგმა

ეს ფაილი ნაბიჯ-ნაბიჯ ხსნის, როგორ მიიტანო „სამი სიმი“ App Store-სა და Google Play-მდე და როგორ გაავრცელო.
ტექნიკური ნაწილი უკვე მზადაა. დარჩენილია მხოლოდ ის ნაბიჯები, რომლებიც შენს ანგარიშებს და შენს ხელს სჭირდება.

---

## 0. რა უკვე მზადაა

- **ვებ-აპი (PWA):** `app/`. მუშაობს ბრაუზერში და ინტერნეტის გარეშეც.
- **საიტი:** `index.html` (მთავარი გვერდი), `privacy.html` (კონფიდენციალურობა), `support.html` (დახმარება). ორივე ენაზეა.
- **iOS და Android:** ერთი კოდიდან კეთდება (Capacitor). კონფიგურაცია `capacitor.config.json`-შია, ნატიური პროექტი კი იქმნება სკრიპტით `scripts/native-setup.sh`.
- **ავტომატური აწყობა GitHub-ზე:**
  - `.github/workflows/android.yml` — Android APK ყოველ ცვლილებაზე.
  - `.github/workflows/ios.yml` — ამოწმებს, რომ iOS ვერსია იწყობა.
- **iOS-ის ხელმოწერა და TestFlight Mac-ის გარეშე:** `codemagic.yaml` (რეპოზიტორის ძირში).
- **მაღაზიის მასალა:** `store/`. აქ არის ტექსტები ორ ენაზე (`store/listing.md`), სქრინშოტები, feature graphic და ხატულები.
- **ტესტები:** `npm test`. ამოწმებს აწყობის სიზუსტეს (62 ტესტი).

---

## 1. საიტი — უკვე ჩართულია

პროექტი დევს შენს რეპოზიტორიში `yanx447/index.html`, საქაღალდეში `sami-simi/`. ამ რეპოზიტორიში GitHub Pages უკვე ჩართულია.
- საიტი: `https://yanx447.github.io/index.html/sami-simi/`
- აპი: `https://yanx447.github.io/index.html/sami-simi/app/`

თუ მოგვიანებით ცალკე რეპოზიტორის (მაგ. `sami-simi`) შექმნა გადაწყვიტე, საქაღალდე იქ გადავა და ბმულები შეიცვლება. ეს ადვილი გადასატანია.

## 2. Android — სატესტო ვერსია ახლავე

ყოველ ცვლილებაზე GitHub თავისით აწყობს APK-ს. მას ნახავ **Releases → android-latest**-ში.
პირდაპირი ბმული: `https://github.com/yanx447/index.html/releases/download/android-latest/SamiSimi-test.apk`.

1. Android ტელეფონზე გახსენი ბმული და ჩამოტვირთე APK.
2. გახსენი ფაილი და დაუშვი „ამ წყაროდან ინსტალაცია“.
3. სატესტო APK ყოველ ჯერზე სხვა გასაღებითაა ხელმოწერილი. ახალი ვერსიის დასაყენებლად ჯერ ძველი წაშალე. მე-3 ნაბიჯის შემდეგ ეს აღარ დაგჭირდება.

## 3. Google Play

**ფასი:** $25, ერთხელ. **დრო:** ანგარიშის დადასტურებას რამდენიმე დღე სჭირდება.

1. დარეგისტრირდი **play.google.com/console**-ზე. აირჩიე **Personal** ანგარიში, გადაიხადე $25 და დაადასტურე პირადობა.
2. **ხელმოწერის გასაღები.** ის უკვე შევქმენი, ცალკე ფაილად გამოგიგზავნე (`sami-simi-keys`). **არასოდეს ატვირთო ის რეპოზიტორიში და არ დაკარგო.**
   GitHub-ზე: **Settings → Secrets and variables → Actions → New repository secret**. დაამატე ოთხი secret:
   - `ANDROID_KEYSTORE_BASE64` — მთელი შიგთავსი `upload.jks.base64.txt`-დან
   - `ANDROID_KEYSTORE_PASSWORD` — `secrets.txt`-დან
   - `ANDROID_KEY_PASSWORD` — `secrets.txt`-დან
   - `ANDROID_KEY_ALIAS` — `samisimi`

   ამის შემდეგ ყოველი აწყობა შექმნის `SamiSimi-play.aab`-ს. მას ნახავ Actions → ბოლო run → Artifacts-ში.
3. Play Console-ში: **Create app** → სახელი `Sami Simi: Panduri Tuner`, ენა Georgian ან English, App, Free.
4. შეავსე **App content**:
   - Privacy policy → `https://yanx447.github.io/index.html/sami-simi/privacy.html`;
   - Data safety → „No data collected“;
   - Content rating;
   - Target audience;
   - Ads → No.
5. **Store listing:** ტექსტები `store/listing.md`-დანაა, სურათები `store/screenshots/android-*`, `store/feature-graphic-1024x500.png` და `assets/store/play-icon-512.png`.
6. **მნიშვნელოვანი:** ახალ პირად ანგარიშებს Google სთხოვს **დახურულ ტესტს: მინიმუმ 12 ტესტერი, 14 დღე**, სანამ საჯაროდ გამოქვეყნდები.
   **Testing → Closed testing**-ში ატვირთე AAB და დაამატე 12+ ადამიანის Gmail: მეგობრები, ანსამბლის წევრები, მოსწავლეები. 14 დღის შემდეგ მოითხოვე Production.
7. **Production → Create release** → ატვირთე AAB → **Review**. განხილვას ჩვეულებრივ 1–7 დღე სჭირდება.

## 4. App Store (iPhone)

**ფასი:** $99/წელი. **Mac არ გჭირდება:** აწყობას Codemagic გააკეთებს.

1. **developer.apple.com/programs** → Enroll → Individual. გჭირდება Apple ID ორფაქტორიანი დაცვით. დადასტურებას 1–2 დღე სჭირდება.
2. **App Store Connect → Apps → +** → New App:
   - Platform: iOS;
   - Name: `Sami Simi: Panduri Tuner`;
   - Primary language: English ან Georgian;
   - Bundle ID: `com.samisimi.tuner` (თუ სიაში არ ჩანს, ჯერ დაამატე developer.apple.com → Identifiers-ში);
   - SKU: `samisimi`.
3. **API გასაღები:** App Store Connect → Users and Access → **Integrations → App Store Connect API** → Generate. როლი App Manager. ჩამოტვირთე `.p8` ფაილი (მხოლოდ ერთხელ იტვირთება) და ჩაიწერე Issuer ID და Key ID.
4. **codemagic.io**-ზე შედი GitHub-ით → Add application → `yanx447/index.html`.
   Team settings → Integrations → **App Store Connect** → დაამატე გასაღები სახელით **`Sami Simi ASC Key`** (ზუსტად ასე, `codemagic.yaml` (რეპოზიტორის ძირში) ამ სახელს ეძებს).
5. Codemagic-ში გაუშვი workflow **„iOS → TestFlight“**. 15–25 წუთში აწყობილი აპი TestFlight-ში გამოჩნდება.
6. iPhone-ზე დააყენე **TestFlight** აპი და გამოსცადე.
7. App Store Connect-ში შეავსე:
   - ტექსტები და სქრინშოტები — `store/listing.md` და `store/screenshots/ios-*`;
   - App Privacy → „Data Not Collected“;
   - Age rating → 4+.

   მერე **Submit for Review**.

**რისკი, რომელიც უნდა იცოდე:** Apple ზოგჯერ უარყოფს აპებს, რომლებიც „უბრალოდ ვებ-გვერდს“ ჰგავს (წესი 4.2).
„სამი სიმი“ სრულად ოფლაინ მუშაობს, მიკროფონს და ნატიურ ვიბრაციას იყენებს და კონკრეტულ საქმეს აკეთებს, ამიტომ ეს რისკი დაბალია. თუ მაინც დაწუნდება, პასუხში ჩამოწერე ეს ფუნქციები. საჭირო თუ იქნება, ნატიურ ნაწილს გავაძლიერებთ.

## 5. ახალი ვერსიის გამოშვება

1. `package.json` → `"version"` (მაგ. `1.0.1`).
2. `app/sw.js` → `VERSION` (მაგ. `sami-simi-v1.0.1`). ასე ბრაუზერის ვერსიაც განახლდება.
3. `app/index.html` → `<span id="version">`.
4. Push → Android ავტომატურად აეწყობა. iOS-ისთვის Codemagic-ში გაუშვი ახალი build.

---

## 6. გავრცელება

**ვისთვის:**
- ფანდურზე დამკვრელები და დამწყებები;
- ხალხური ანსამბლები, სამუსიკო სკოლები და წრეები;
- ემიგრაციაში მცხოვრები ქართველები;
- უცხოელი ეთნომუსიკოსები.

**პირველი 2 კვირა (გაშვებამდე):**
- 12+ ტესტერი Google Play-ის დახურული ტესტისთვის. ეს ერთდროულად არის პირველი მომხმარებლები და პირველი შეფასებები.
- მოკლე ვიდეოები (TikTok / Instagram Reels / YouTube Shorts, 15–30 წამი):
  - „როგორ ავაწყოთ ფანდური 30 წამში“ — ეკრანი + ფანდური კადრში;
  - სტრობის „გაჩერების“ მომენტი;
  - ნაბიჯ-ნაბიჯ რეჟიმი დამწყებისთვის.

  გამოიყენე შენი მუსიკალური არხებიც.
- საიტის ბმული ყველა ბიოში. QR კოდი ქაღალდზე რეპეტიციებისთვის.

**გაშვების დღეს:**
- პოსტები Facebook-ის ჯგუფებში (ფანდურის, ქართული ხალხური მუსიკის, მუსიკის მასწავლებლების), ორ ენაზე.
- პირადი მესიჯი 10–20 ანსამბლის ხელმძღვანელს და სამუსიკო სკოლას: „უფასო ტიუნერი ფანდურისთვის, მოსწავლეებისთვის“.
- შენი ფანდურის სიმღერების აპიდან ბმული „სამი სიმზე“ (და პირიქით). ორივე ერთმანეთს აძლიერებს.
- ქართული ტექნოლოგიური და კულტურული მედია: მოკლე პრეს-ტექსტი + feature graphic + 3 სქრინშოტი.

**შემდეგ:**
- სთხოვე კმაყოფილ მომხმარებლებს შეფასება მაღაზიაში. 20–30 შეფასება მნიშვნელოვნად ზრდის ძიებაში პოზიციას.
- ყოველ განახლებაზე ახალი მოკლე ვიდეო.
- ფესტივალები და კონცერტები: „ააწყვე ფანდური სამი სიმით“ QR სცენასთან.

**საზომი:** Play Console და App Store Connect აჩვენებს ჩამოტვირთვებს, ქვეყნებს და შეფასებებს.
თავად აპში თვალთვალი შეგნებულად არ არის: ეს კონფიდენციალურობის პოლიტიკის ნაწილია და მომხმარებლისთვის ღირსებაა.
