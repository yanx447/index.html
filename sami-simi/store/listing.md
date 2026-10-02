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
- EN: `Tune by plucking one string or strumming all three. Chords on a 3D neck, chord recognition, a metronome and reference tones recorded from a real panduri.`
- KA: `ააწყე ერთი სიმით ან სამივე ერთად. აკორდები 3D ტარზე, აკორდის ამოცნობა, მეტრონომი და ნამდვილი ფანდურიდან ჩაწერილი ბგერა.`

**Keywords [100]**
- EN: `panduri,georgian,tuner,chords,metronome,folk,strobe,tuning,string,georgia,pitch,ear training`
- KA: `ფანდური,ტიუნერი,წყობა,აწყობა,აკორდები,მეტრონომი,ხალხური,ქართული,სიმი,სტრობი`

**App Privacy (nutrition label):** choose **“Data Not Collected”**.

**Microphone purpose string:** already set in the app — *“Sami Simi listens to your panduri to measure its pitch and recognise chords. Sound is analysed on your device and is never sent anywhere. It is recorded only when you choose to make a recording, which stays on your device.”*

“Data Not Collected” stays correct: recordings, songs and settings never leave the device, and Apple counts data as collected only when it is sent off the device.

**Encryption:** the app declares `ITSAppUsesNonExemptEncryption = NO`, so there is no export-compliance questionnaire.

## Google Play

**Short description [80]**
- EN: `Tuner, chords & metronome for the Georgian panduri — A · C♯ · E`
- KA: `ტიუნერი, აკორდები და მეტრონომი ქართული ფანდურისთვის — ლა · დო♯ · მი`

**Data safety:**
- “Does your app collect or share user data?” → **No**.
- The microphone audio is processed on the device in real time and never leaves it. Recordings the user makes stay on the device. Under Google’s rules neither counts as “collected”.

**Content rating questionnaire:** category *Utility / Productivity / Communication / Other*. Answer **No** to every question.

**Target audience:** 13+ is the safe choice. You can include under-13s too, because the app has no ads and collects nothing. If you do, Google asks extra “Families” questions.

## Full description — English [4000]

```
Sami Simi is a tuner made for one instrument: the three-string Georgian panduri.

Pluck a string and the tuner tells you which string it is, how many cents it is off, and which way to turn the peg — “Tighten slightly”, “Loosen a bit more”, “Perfectly in tune”. The traditional tuning is built in: string 1 — A (220 Hz), string 2 — C♯ (277.18 Hz), string 3 — E (329.63 Hz).

PRECISE
• Pitch engine tuned on a real panduri: it measures the true fundamental even when the overtones are out of tune, ignores the pick attack and octave mistakes, and holds the last steady reading as the note fades.
• Fine scale around zero, so the last few cents are easy to see.
• Strobe mode for fine tuning — the bands stop when the string is exactly in tune.

FAST
• All three at once: strum the open strings once and see which string to tighten or loosen.
• Auto mode recognises the string you play.
• Guided tuning for beginners: A, then C♯, then E — it moves on by itself.
• Reference tones recorded from a real panduri, plus a chord button to hear all three strings.

PLAY
• Chords on a 17-fret 3D neck you can turn all the way round.
• Chord recognition: strum and the app names the chord and checks each string.
• Metronome with a panduri sound, ear training and play-along exercises.
• Your songbook with chords — tap a chord to see and hear it, transpose with one tap.
• Record your playing and see how in tune you were.

YOURS
• Transpose the whole tuning, change the octave, calibrate A4 from 430 to 450 Hz.
• Georgian and English.
• Works offline — at rehearsal, in the village, on stage.

PRIVATE
Sound is analysed on your phone only. Your recordings, songs and settings stay on your device. No account, no ads, no tracking.
```

## Full description — Georgian [4000]

```
სამი სიმი — ტიუნერი, რომელიც ერთი ინსტრუმენტისთვის შეიქმნა: სამსიმიანი ქართული ფანდურისთვის.

ჩამოკარი სიმი და ტიუნერი გეტყვის, რომელი სიმია, რამდენი ცენტით გადაცდა და საით დაატრიალო მომჭერი — „ოდნავ მოუჭირე“, „კიდევ ცოტათი მოუშვი“, „ზუსტად აწყობილია“. ტრადიციული წყობა უკვე ჩაშენებულია: სიმი 1 — ლა (220 ჰც), სიმი 2 — დო♯ (277.18 ჰც), სიმი 3 — მი (329.63 ჰც).

ზუსტი
• ძრავა ნამდვილ ფანდურზეა გამართული: ძირითად ტონს ზომავს მაშინაც, როცა ობერტონები აცდენილია; არ ერევა ჩამოკვრის ხმაური და ოქტავის შეცდომები; როცა ბგერა ქრება, ბოლო სტაბილურ ჩვენებას ინარჩუნებს.
• ნულთან შკალა უფრო წვრილია — ბოლო ცენტები კარგად ჩანს.
• სტრობ-რეჟიმი წვრილი აწყობისთვის — ზოლები ჩერდება, როცა სიმი ზუსტადაა აწყობილი.

სწრაფი
• სამივე სიმი ერთად: ერთხელ ჩამოკარი ღია სიმები და ნახე, რომელი უნდა მოუჭირო ან მოუშვა.
• „ავტო“ რეჟიმი თავად ცნობს, რომელ სიმს უკრავ.
• ნაბიჯ-ნაბიჯ აწყობა დამწყებთათვის: ჯერ ლა, მერე დო♯, ბოლოს მი.
• ეტალონური ბგერა ნამდვილი ფანდურიდანაა ჩაწერილი; აკორდით სამივე სიმს ერთად მოისმენ.

დაკვრა
• აკორდები 17-ლადიან 3D ტარზე, რომელსაც ყველა მხრიდან დაატრიალებ.
• აკორდის ამოცნობა: ჩამოკარი და აპი გეტყვის, რა აკორდია, და თითო სიმს შეამოწმებს.
• მეტრონომი ფანდურის ხმით, სმენის ვარჯიში და ნოტებზე დაკვრის სავარჯიშოები.
• შენი სიმღერები აკორდებით — შეეხე აკორდს, რომ ნახო და მოისმინო; ტრანსპოზიცია ერთი შეხებით.
• ჩაიწერე დაკვრა და ნახე, რამდენად აწყობილად უკრავდი.

შენზე მორგებული
• მთელი წყობის ტრანსპოზიცია, ოქტავის შეცვლა, A4 კალიბრაცია 430–450 ჰც.
• ქართული და ინგლისური ენები.
• მუშაობს ინტერნეტის გარეშე — რეპეტიციაზე, სოფელში, სცენაზე.

კონფიდენციალური
ხმა მუშავდება მხოლოდ შენს ტელეფონში. ჩანაწერები, სიმღერები და პარამეტრები შენთან რჩება. არც ანგარიში, არც რეკლამა.
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
There are 8 per device and language: Google Play accepts up to 8, the App Store up to 10. Suggested upload order: 1 (tighten), 6 (all three at once), 7 (chords on 3D neck), 2 (in tune), 3 (strobe), 4 (guided), 8 (tools), 5 (settings).

To regenerate: serve the repo root, then `node scripts/screens.cjs <url>/sami-simi/app/ store/screens-raw tune.wav guided.wav`, `node scripts/screens-tools.cjs <url>/sami-simi/app/ store/screens-raw strum.wav`, `python3 scripts/frame.py`.
