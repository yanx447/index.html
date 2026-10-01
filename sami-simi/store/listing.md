# Store listing — Sami Simi / სამი სიმი

Copy these fields into App Store Connect and Google Play Console.
Character limits are noted in brackets. All texts are counted to fit.

## Basics (both stores)

| Field | Value |
|---|---|
| App name — English [30] | `Sami Simi: Panduri Tuner` |
| App name — Georgian [30] | `სამი სიმი — ფანდურის ტიუნერი` |
| Bundle ID / package name | `com.samisimi.tuner` (permanent — never change it after the first upload) |
| Category | Music |
| Price | Free |
| Age rating | 4+ (Apple) / Everyone (Google) — no objectionable content |
| Privacy policy URL | https://yanx447.github.io/index.html/sami-simi/privacy.html |
| Support URL | https://yanx447.github.io/index.html/sami-simi/support.html |
| Marketing URL | https://yanx447.github.io/index.html/sami-simi/ |
| Contact e-mail | *your e-mail — both stores require one* |

## App Store (Apple)

**Subtitle [30]**
- EN: `Tuner for the Georgian panduri`
- KA: `ქართული ფანდურის ტიუნერი`

**Promotional text [170]**
- EN: `Pluck a string and see exactly which way to turn the peg. Traditional A · C♯ · E tuning, strobe mode and guided tuning for beginners.`
- KA: `ჩამოკარი სიმი და ნახე, საით დაატრიალო მომჭერი. ტრადიციული წყობა ლა · დო♯ · მი, სტრობ-რეჟიმი და ნაბიჯ-ნაბიჯ აწყობა დამწყებთათვის.`

**Keywords [100]**
- EN: `panduri,georgian,tuner,folk,strobe,tuning,string,instrument,georgia,chromatic,pitch`
- KA: `ფანდური,ტიუნერი,წყობა,აწყობა,ხალხური,ქართული,სიმი,ინსტრუმენტი,სტრობი,ლა,მი`

**App Privacy (nutrition label):** choose **“Data Not Collected”**.

**Microphone purpose string:** already set in the app — *“Sami Simi listens to your panduri through the microphone to measure its pitch. Sound is analysed on the device and is never recorded or sent.”*

**Encryption:** the app declares `ITSAppUsesNonExemptEncryption = NO`, so there is no export-compliance questionnaire.

## Google Play

**Short description [80]**
- EN: `Precise tuner for the three-string Georgian panduri — A · C♯ · E, strobe, guided`
- KA: `ზუსტი ტიუნერი სამსიმიანი ქართული ფანდურისთვის — ლა · დო♯ · მი, სტრობი`

**Data safety:**
- “Does your app collect or share user data?” → **No**.
- The microphone audio is processed on the device in real time and never leaves it. Under Google’s rules this does not count as “collected”.

**Content rating questionnaire:** category *Utility / Productivity / Communication / Other*. Answer **No** to every question.

**Target audience:** 13+ is the safe choice. You can include under-13s too, because the app has no ads and collects nothing. If you do, Google asks extra “Families” questions.

## Full description — English [4000]

```
Sami Simi is a tuner made for one instrument: the three-string Georgian panduri.

Pluck a string and the tuner tells you which string it is, how many cents it is off, and which way to turn the peg — “Tighten slightly”, “Loosen a bit more”, “Perfectly in tune”. The traditional tuning is built in: string 1 — A (220 Hz), string 2 — C♯ (277.18 Hz), string 3 — E (329.63 Hz).

PRECISE
• Pitch engine designed for plucked strings: it ignores the pick attack, rejects overtones and octave mistakes, and holds the last steady reading as the note fades.
• Fine scale around zero, so the last few cents are easy to see.
• Strobe mode for fine tuning — the bands stop when the string is exactly in tune.

EASY
• Auto mode recognises the string you play.
• Guided tuning for beginners: A, then C♯, then E — it moves on by itself.
• Simple view without hertz or cents for those who just want “tighten / loosen”.
• Reference tones that sound like a plucked panduri, plus a chord button to hear all three strings.

YOURS
• Transpose the whole tuning, change the octave, calibrate A4 from 430 to 450 Hz.
• Georgian and English.
• Works offline — at rehearsal, in the village, on stage.

PRIVATE
Sound is analysed on your phone only. No recordings, no account, no ads, no tracking.
```

## Full description — Georgian [4000]

```
სამი სიმი — ტიუნერი, რომელიც ერთი ინსტრუმენტისთვის შეიქმნა: სამსიმიანი ქართული ფანდურისთვის.

ჩამოკარი სიმი და ტიუნერი გეტყვის, რომელი სიმია, რამდენი ცენტით გადაცდა და საით დაატრიალო მომჭერი — „ოდნავ მოუჭირე“, „კიდევ ცოტათი მოუშვი“, „ზუსტად აწყობილია“. ტრადიციული წყობა უკვე ჩაშენებულია: სიმი 1 — ლა (220 ჰც), სიმი 2 — დო♯ (277.18 ჰც), სიმი 3 — მი (329.63 ჰც).

ზუსტი
• ჩამოკრული სიმისთვის შექმნილი ძრავა: არ ერევა ჩამოკვრის ხმაური, ობერტონები და ოქტავის შეცდომები; როცა ბგერა ქრება, ბოლო სტაბილურ ჩვენებას ინარჩუნებს.
• ნულთან შკალა უფრო წვრილია — ბოლო ცენტები კარგად ჩანს.
• სტრობ-რეჟიმი წვრილი აწყობისთვის — ზოლები ჩერდება, როცა სიმი ზუსტადაა აწყობილი.

მარტივი
• „ავტო“ რეჟიმი თავად ცნობს, რომელ სიმს უკრავ.
• ნაბიჯ-ნაბიჯ აწყობა დამწყებთათვის: ჯერ ლა, მერე დო♯, ბოლოს მი.
• მარტივი ჩვენება ჰერცების და ცენტების გარეშე — მხოლოდ „მოუჭირე / მოუშვი“.
• ეტალონური ბგერა, რომელიც ჩამოკრულ ფანდურის სიმს ჰგავს, და აკორდი სამივე სიმის მოსასმენად.

შენზე მორგებული
• მთელი წყობის ტრანსპოზიცია, ოქტავის შეცვლა, A4 კალიბრაცია 430–450 ჰც.
• ქართული და ინგლისური ენები.
• მუშაობს ინტერნეტის გარეშე — რეპეტიციაზე, სოფელში, სცენაზე.

კონფიდენციალური
ხმა მუშავდება მხოლოდ შენს ტელეფონში. არც ჩანაწერი, არც ანგარიში, არც რეკლამა.
```

## Graphics (in this folder)

| File | Use |
|---|---|
| `screenshots/ios-*.png` (1320×2868) | App Store — iPhone 6.9″ (Apple scales these for the smaller iPhones) |
| `screenshots/android-*.png` (1080×1920) | Google Play — phone screenshots |
| `screens-raw/` | Plain screenshots without captions |
| `feature-graphic-1024x500.png` | Google Play feature graphic |
| `../assets/store/icon-1024.png` | App Store icon |
| `../assets/store/play-icon-512.png` | Google Play icon |

Use the `ka` screenshots for the Georgian listing and the `en` ones for the English listing.
