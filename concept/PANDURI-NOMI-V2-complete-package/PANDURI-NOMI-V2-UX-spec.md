# PANDURI — NOMI BLACK · LIQUID GLASS · SOCIAL EXPERIENCE
## Product Design / UX / Motion / Behavioural Specification v2.0
**by Yanx · 11 ნოემბერი, 2026**  
**საფუძველი:** NOMI 62-screen deck + შენი მიმდინარე 3 screenshot + `yanx447/index.html` რეალური Panduri codebase.  
**ფორმატი:** ეკრანები, UI, gestures, transitions, preserving invariants, acceptance criteria. ეს არის **კონცეფცია/სპეციფიკაცია**, არა უკვე დაკოდილი ვერსია.

### ერთი მთავარი აზრი
**ფანდური არის სკოლა + მუსიკალური საზოგადოება, NOMI-ის სიმშვიდით და TikTok/Instagram-ის ინტუიციური სოციალური მოქმედებებით.** ეკრანზე პირველ ადგილზე იყოს მუსიკა, შესრულება, ადამიანი. ზედმეტი ბარათები, გადატვირთული ყავისფერი ფონი, მუდმივი ნეონის ანიმაცია — არა. ყველა ტექსტი და action უნდა ერგებოდეს ქართულს.

## A. დაურღვეველი ტექნიკური კონტრაქტი
1. **არავითარი თავიდან გადაწერა.** ყველა არსებული route, db, auth state, storage, billing entitlement, lesson progress შენარჩუნებულია.
2. **ტიუნერი 100%-ით ინარჩუნებს ქცევას.** `js/samisimi.js → tuner/index.html → tuner/js/main.js`. არ შეიცვალოს pitch detector/auto/manual modes, A/C♯/E, cents, reference sound, microphone, chord mode, 360° view, precision/drift/settings.
3. სწავლება: microphone-only scoring, lesson engine, WAIT/step mode, chords, rhythmic input და 17-ლადი. ვიზუალი არ უნდა გამოიგონოს ნოტები.
4. სოციალური: public/friends visibility, friendship, chat data, attachment permissions, report/block, media size limit, posts/comments/reactions არ ირღვევა.
5. ზარები: existing WebRTC + signaling; „მუშაობს ყველგან“ არ თქვას TURN და რეალური network tests-ის გარეშე.
6. Premium: მხოლოდ server-verified entitlement; native store vs web provider სწორ გზაზე უნდა დარჩეს.
7. `app/` generated bundle-ია; წყარო შეცვალე და სწორად ააწყე, build output ხელით არ დააკოპირო.
8. ეტაპობრივი Git branch, screenshot baseline, unit/e2e tests, device QA, rollback.

## B. Design tokens — NOMI-ის მსგავსი, ფანდურის საკუთარი ხასიათით
| Token | მნიშვნელობა | გამოყენება |
|---|---|---|
| `--bg-0` | `#000000` | OLED black მთელი ფონებისთვის |
| `--bg-1` | `#0B0B0D` | წაკითხვის ზედაპირი |
| `--bg-2` | `#141417` | sheets, cards |
| `--bg-3` | `#1A1A1E` | უჯრები |
| `--bg-4` | `#24242A` | დაჭერილი/არჩეული |
| `--fg-1` | `#F5F5F7` | ძირითადი ტექსტი |
| `--fg-2` | `#A3A3AA` | მეტამონაცემები |
| `--copper` | `#D5A778` | მუსიკა, აქტიური ტაბი, მთავარი CTA |
| `--success` | `#62CC9B` | დაკვრა სწორია / online |
| `--warning` | `#E9B765` | mic permissions/uncertain |
| `--danger` | `#FF6D6D` | შეცდომა, საჩივარი; რითმის ძლიერი აქცენტისას ლოკალურად |
| `--glass` | `rgba(24,24,30,.56)` | floating nav, call tray, sheets; მხოლოდ სადაც ქვემოთ რეალური კონტენტია |
| `--glass-line` | `rgba(255,255,255,.11)` | 0.5–1 px edge |

Typography: SF Pro / native system + **Noto Sans Georgian**, scale 11/12/14/16/20/27/34. Dynamic Type; მძიმე ქართული სათაურები არ დაიწიოს ავტომატურად 8px-მდე. Corners: 12, 16, 22, 30. Touch target >= 44pt. შიდა ტექსტის contrast ≥ WCAG AA.

### Liquid Glass — MUST HAVE
- ქვედა tab bar: floating capsule, backdrop blur(22–30px), saturation, hairline highlights, subtle specular gradient, **რეალური blur როცა შესაძლებელია**.
- Scroll-მდე წინ მოთავსებული headers და sheets: glass + background dim; დახურვა swipe-down-ით, backdrop tap-ით და Esc/back-ით.
- Chat composer, GIF/sticker picker, call controls, post action rail: glass, მაგრამ ვიდეოს ხედვას არ ფარავს.
- `backdrop-filter` unsupported → კომპოზიტური გაუმჭვირვალე შავი surface; low GPU mode-ში blur მცირდება. Reduce Transparency / Reduce Motion გამართული.
- Material იგრძნობა დინამიკურ ფონზე: არ დავასვათ blur ბრტყელ შავ 100%-იან ეკრანს დეკორაციისთვის.

## C. Navigation — არსებული 6 tab არ გაქრეს
**ახლა კოდში:** მთავარი · სწავლა · აკორდები · ტიუნერი · AI ანალიზი · პროფილი. „საზოგადოება“ პროფილშია.

**პირველი უსაფრთხო ვერსია:** ექვსივე ტაბს ინარჩუნებს. Home-ზე/პროფილში/lesson finish-ზე გამოიტანოს *საზოგადოება* როგორც ძლიერი direct action. 社 social route `community` unchanged.

**ალტერნატიული, მხოლოდ UX დამტკიცების შემდეგ:** მთავარი · სწავლა · საზოგადოება · ტიუნერი · AI · პროფილი; „აკორდები“ ერთი tap-ით ხელმისაწვდომია Learn-სა და Home-ში. **ეს ცვლილება არ შესრულდეს პირველი sprint-ში** და აუცილებლად ჰქონდეს A/B user-flow ტესტი.

## D. ეკრანების კონსპექტები — V2 მოდულები
ყველა ეკრანის დიზაინზე ცალკე წარმოადგინე: ვიზუალი, მთავარი მოქმედება, ზუსტი შინაარსი, `loading / empty / error / offline / permission` მდგომარეობები, რეალური event, back/navigation, motion + Reduce Motion, mobile/desktop responsiveness.

### 01 — App & Home
1. Splash: შავი, ერთი დახვეწილი ფანდურის ანასახი, no infinite loader.
2. Onboarding: ენა, დონე, მიკროფონის დაშვება საჭირო დროს; „გამოტოვება“ სადაც შესაძლებელია.
3. Home: „გააგრძელე სწავლა“, დღევანდელი პროგრესი, ბოლო გაკვეთილი, ღილაკი „დაუკარი და გააზიარე“, activity.
4. Lesson cards: 1 ძირითადი CTA, მცირე progress, no oversized grids.
5. Search/library: Songs / Melodies / Solos, bookmarks და filters.

### 02 — Learning & Instrument
6. Lesson overview / intro.
7. Guidance with A · C♯ · E labels.
8. Realistic fretboard, 3 strings/17 frets, exact profile geometry.
9. Bm: T (3rd string, fret 2) · I (2nd string, fret 1) · M (1st string, fret 2).
10. Rhythm strip: Kazbeguri ↓strong ↑ ↓ / Mtieluri ↓strong ↓ ↑strong ↓ ↑; Khorumi/Acharuli use lesson-specific patterns.
11. WAIT/listening state, instant feedback but no invented scoring.
12. Results / progress / next lesson.
13. 3D interactive instrument; reduce effects when performance drops.

### 03 — Tuner — LOCKED FUNCTIONALITY
14. Sami Simi main: black canvas, glass mode bar, golden live cents needle, note C♯ (example only).
15. Manual/Auto/აწყობა selector: persists and does exactly current.
16. A/C♯/E headstock: original string order and exact octave/hertz reference.
17. Reference sound, microphone, chord tuner, 360°: keep working.
18. Mic denied/no sound/noisy/clipping/stable success: honest messages, no random values.
19. Tuner settings and instruments: preserve drift, smoothing, presets, styles, reference pitch.

### 04 — Society / TikTok-like video feed
20. Community landing: tabs `ფიდი · საუბრები · მეგობრები · დახმარება`; moderation admin section only for allowed account.
21. Feed subtab `გლობალური / მეგობრები` in glass pill.
22. Full bleed video reel: vertical swipe one card per screen, autoplay only current visible video; no black rectangles.
23. Media mode: photo / song audio waveform / text card; preserve existing mixed-media support.
24. On-video author, caption, tags, date and audience label in legible lower-left gradient.
25. Floating right action rail: Panduri reaction, comments, share, more; thumb-safe, 44pt targets.
26. Double tap → panduri accent heart-style burst; press-and-hold → reaction picker.
27. Swipe next/previous preserves active video, pauses all others and metronome, handles audio focus.
28. Comments: liquid bottom sheet, keyboard-safe reply, nested replies as a **new feature** (server migration needed).
29. Share: to friend chat / link / external; no leaking private posts.
30. Feed empty/offline/deleted, skeleton, network retry and muted/autoplay fallback.
31. Feed settings: muted by default / background audio / captions (product decision), preference persistence.

### 05 — Publishing, creator tools
32. Composer: choose photo, video, audio, text; current limits and privacy.
33. Video preview/crop / cover frame / trim; **new** editing is optional until backend compatibility tested.
34. Description, hashtags, mention/credit, audience; no accidental public posting.
35. Upload progress, retry/cancel, protect drafts when app backgrounds; call/lesson shouldn't steal upload.
36. Success morph → published card + view in feed.
37. My posts grid, saved (new), delete/undo respecting backend semantics.

### 06 — Messenger (NOMI-inspired)
38. Chat inbox: unread, pinned, search, avatar, last message, last online if server supports it.
39. 1:1 chat: incoming/outgoing, timestamps, read/delivery only if server supports; no fake checks.
40. Chat composer: + media, emoji, stickers, GIF, voice notes (new if backend supports), send.
41. Swipe actions: reply, copy, delete-for-me; edit/delete-for-all require server rules.
42. Long-press reaction picker; smooth anchored contextual glass popover.
43. Shared feed post inside chat; deep-link to correct public/friends-only post.
44. Media/GIF/sticker bubble sizes, loaders, failure retry and security.
45. Conversation profile: block/report/mute; no leakage between accounts.

### 07 — Calls
46. Outgoing audio/video call: dark radial glow, name, speaker/mic/camera toggles.
47. Incoming call: answer/reject, background privacy. App foreground/background transitions must be tested.
48. Connected call: video, floating glass tray, connection status; WebRTC ICE/TURN only real network tests.
49. Minimized call: optional **future** PiP/mini-widget if platform allows; do not promise before implementation.
50. Missed / denied mic / network failure / busy screens.

### 08 — Emoji / Stickers / Personalization
51. Emoji picker categories, recent, search, native font fallback.
52. Emoji appearance Settings: **System (default), Google Noto Emoji, Twemoji-style (licensed pack)**; Windows/Microsoft style only if legal asset rights exist. **Apple emoji cannot be bundled as a redistributable asset without permission.** On Apple devices `System` naturally displays native Apple emoji; other OS use native look.
53. Chat emoji composition: UTF-8 Unicode text unchanged in database; display theme local to sender/viewer. Avoid changing sent emoji bytes.
54. Sticker packs: existing original 6-ish illustrations + future themed free/premium packs, installs, favorites, search, recent; deliver as separately licensed/custom assets.
55. GIF search: show only with existing backend GIPHY support; attribution, content safety and latency states.
56. Appearance: True Black / Copper accent / Glass strength auto (high/medium/low) / Reduce Transparency.
57. Accessibility: reduced motion, text size, high contrast, screen-reader, haptics.

### 09 — AI, Premium, Profile
58. AI Music Studio upload with audio/video; actual analysis progress stages; edit results; confidence.
59. BPM, key, chords, rhythm (e.g., Acharuli/Bani-Acharuli), stems, piano roll and tablature as supported.
60. Premium paywall with actual entitlements; native purchase/restore, web TBC/PayPal via backend only.
61. User Profile: practice stats AND social posts/username and DM settings.
62. Public musician profile: bio, media grid, followers/friends (follow model requires new backend decision).
63. Privacy & Moderation: report, blocked users, content visibility, account deletion.
64. Notifications: replies/reactions/messages/calls with quiet defaults, linked to correct content.
65. Offline/read-only/wrong-access/error recovery.

## E. Motion system — NOMI-like, never fake physics
- **Tap:** 90–140 ms press 0.985 scale → return, no rubbery bounce for everything.
- **Main tab:** 200–280 ms active pill slide using shared geometry, page crossfade/translation ≤ 12px; scroll position retained.
- **Push/back:** 300–420 ms transform + slight parallax 10–20px; reverse on swipe back. Must be interruptible.
- **Liquid bottom sheet:** drag with finger, release to spring; 250–450 ms; body scroll locked; keyboard-aware.
- **Feed scroll:** native scrolling + `scroll-snap-type:y mandatory`, no 3D spinning; next video loads ahead; active media only.
- **Reaction:** 180–260 ms small burst with controlled overshoot; haptic only optional.
- **Video action rail:** 120 ms lift/fade on context; tap target stays fixed.
- **Chat message:** appears from composer direction with 160–220 ms slide; no entire chat rerender bounce.
- **Sticker:** subtle 100%→106%→100% on send, never breaks scroll.
- **Call:** radial breathing every few seconds only when dialing, no flashing; network state explicit.
- **Tuner:** needle driven by **actual smoothed detector values**, visual tween should not alter measurement; 60fps where possible, high confidence state stable.
- **Reduced Motion:** all animations resolve to opacity/instant state; no auto animated transitions, gestures still work.

### Performance policy
Target 60 fps on supported devices, 30 fps economy fallback; avoid giant blurred surfaces over full-screen video; pause off-screen video/audio, clean object URLs/observers, one active audio stream; haptics and transitions cannot disrupt microphone accuracy. Test 320px/375px/390px/430px widths and tablet/desktop. Keyboard / safe areas / Safari viewport / PWA mode.

## F. Definition of Done — mandatory for Codex
- [ ] All existing 6 tabs/routes reachable; settings/progress retained; no broken back navigation.
- [ ] Tuner exact baseline mic/reference/buttons and A/C♯/E verified before/after.
- [ ] Feed one post per viewport; active autoplay only visible; sound mute persisted; no audio overlaps.
- [ ] Comments, reactions, upload, share, friend requests, chat, GIF and sticker existing features preserved.
- [ ] Emoji selection works without storing platform-specific font glyph assets unlawfully.
- [ ] Calls still connect on baseline network; error/deny state correct.
- [ ] Payments cannot unlock VIP until server verification; purchase/restore error paths tested.
- [ ] UI screenshot comparisons including dark glass, content contrast, Georgian font and spacing.
- [ ] `prefers-reduced-motion`, Reduce Transparency, VoiceOver labels and keyboard focus.
- [ ] No migrations/destructive changes without approval. Build, tests, screenshots, changed files and rollback instructions documented.

## G. რეკომენდებული სამუშაოს განაწილება
**Codex:** codebase audit → UI tokens → tuner visual-only → feed → chat/calls → sticker/emoji themes → regression → staging deploy.  
**Claude Code:** independent UX critic, Georgian/English copy, accessibility audit, alternative design mockups; avoid concurrent edits on the same branch.  
**პირველი sprint:** მხოლოდ CSS/tokens + glass tabbar + tuner presentation + one feed screen, full regression; მეორე sprint-ში chat/social polish.
