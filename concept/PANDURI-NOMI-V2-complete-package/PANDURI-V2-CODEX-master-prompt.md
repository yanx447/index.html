# CODEX MASTER PROMPT — PANDURI (Existing GitHub Repository, Design Upgrade Only)

შენ ხარ Senior iOS/Web UI Engineer + Motion Designer + Regression QA. მუშაობ **არსებულ** პროექტში: `https://github.com/yanx447/index.html` → `panduri/`.

## საქმის არსი
ამ ფაილებთან ერთად გაძლევ:
- `PANDURI-current-state-audit-2026-11-11.md` — actual repo + screenshots grounded audit;
- `PANDURI-NOMI-V2-UX-spec.md` — detailed screen/interaction design specification;
- `PANDURI-NOMI-liquid-glass-concept-v2.html` — **presentation-only visual reference**, not a new app;
- `nomi-design-concept-v5-everything-motion(3)(7).html` — **design language reference**, not features to blindly copy.

**მიზანი:** არსებული ფანდურის აპლიკაციის UI/UX გარდაქმნა: **NOMI-style pure black OLED + refined copper accent + true Liquid Glass overlays + buttery Apple-like transitions + social feed like TikTok, messaging/calls like Instagram/NOMI**. **არავითარი არსებულ ფუნქციებში regression**.

## ბრძანება 0 — AUDIT სანამ რამეს შეეხები
1. გახსენი `panduri/README.md`, `panduri/app/ARCHITECTURE.md`, რეალური source folder, `panduri/build.py`, `panduri/app/js/app.js`, `js/social.js`, `js/community.js`, `js/chatkit.js`, `js/samisimi.js`, `tuner/js/main.js`, `js/motion.js`, `js/billing.js`, `js/premium.js`, `js/ai.js`.
2. გაიგე source → build → deployment. `panduri/app/` generated output-ია: შეცვალე source, არ დააშენო მხოლოდ output-ზე გადაუმოწმებლად.
3. შეინახე არსებული screenshot baseline: (i) Tuner, (ii) Society feed, (iii) Chat, (iv) Home, (v) Lesson, (vi) AI, (vii) Profile/Settings.
4. ჯერ გაიტანე `docs/PANDURI_V2_IMPLEMENTATION_PLAN.md`: ზუსტად რას ცვლი/არ ცვლი, risk register, regression matrix, CSS/component mapping.
5. არ შეცვალო credentials/secrets, DB schema, payment endpoints, Supabase policies, user data, source-of-truth lesson events/AI algorithms/3D models. No silent wholesale rewrite.

## უცვლელი ფუნქციები (ABSOLUTE)
- TUNER: `PD.samiSimi` iframe integration, A/C♯/E, 3 strings, auto/manual/tuning modes, mic permissions, live cents/pitch/hz, reference tones, chord mode, 360° headstock, drift/sensitivity/settings. **ტიუნერი უნდა გამოიყურებოდეს ახალ დიზაინში, მაგრამ გული/აუდიო/გეომეტრია იგივე დარჩეს.** No fake needle values.
- LEARNING: note/fret/mic/WAIT/assessment, 17 frets, lessons, chord finger placement, 3D training, lesson progress persist. Bm T=string3/fret2, I=string2/fret1, M=string1/fret2.
- SOCIAL: maintain routes `community` / chats / friends / help, existing global+friends feed, video autoplay on active card, photo/video/audio/text posting, comments, reaction types (including Panduri), shares, public/friends visibility, media limits, block/report.
- CHAT/CALL: do not break session IDs, message/media endpoints, emoji/sticker/GIF payloads, WebRTC signaling. Premium gating unchanged until independently approved.
- AI / Premium: only surface/design changes in initial phases, server entitlement remains source-of-truth.
- First iterations keep all **six current tabs** accessible: Home, Learn, Chords, Tuner, AI, Profile. Social entry via profile and prominent Home shortcut. Do not silently delete Chords tab to make room for social.

## DESIGN SYSTEM RULES
- black base `#000000`, raised surfaces `#0B0B0D`, `#141417`, `#1A1A1E` with hairline dividers; text `#F5F5F7`, gray `#A3A3AA`.
- Accent copper `#D5A778` sparingly. No overall chocolate background, toy-like 3D, excessive gold gradients, random neon glow, caricature, giant bouncy cards.
- **Liquid Glass MUST:** floating segmented tab bar, contextual sheets, chat composer, reaction rails, modal menus, call controls. `backdrop-filter:blur(22px) saturate(140%)` + specular edge; accessibility/performance fallback; Safari/WebKit support. Do not blind-blur video full screen or run heavy blurred layers every frame.
- Georgian and English: SF Pro where available + Noto Sans Georgian, robust text wrapping, dynamic type, 44px/pt targets, safe area (`env(safe-area-inset-bottom)`), keyboard resize/PWA handling.
- Motion: 90–140ms press, 200–280ms active tab morph, 300–420ms push/back with interruption, draggable bottom sheets, native vertical snap feed, small spring reaction, no pointless zoom in/out between pages. Respect `prefers-reduced-motion`, user's Reduce Motion and Reduce Transparency.

## SOCIAL UX — EXISTING CODE, NEW QUALITY
1. Feed: one video per viewport, true immersive black, overlay author info lower-left with gradient, right thumb-safe action rail; global/friends selector in glass. Media privacy preserved.
2. Use native scroll + snap, autoplay only 60%+ visible; pause/disconnect all offscreen video/audio; prefetch next media carefully; clean `IntersectionObserver` and RAF/listeners; avoid browser audio clashes with lesson/tuner/calls. Preserve existing `social.js` backend calls, load-more, mute storage, media captions.
3. Comments: glass draggable half/full sheet, replies and reaction animation **only if backend supports**; otherwise progressive enhancement with no false state.
4. Composer: photo/video/audio/text, stable draft, upload percentage, retry, cover, visibility public/friends; do not lose uploaded data on transient rerender.
5. Chat: NOMI-style black and restrained glass, message bubbles, composer with + emoji sticker GIF, shared post card, thread actions. Preserve existing message DTO/API and storage semantics.
6. Calls: radial dark layout, glass control tray, clear call states; do not claim background/PiP unless actually implemented and tested. Test networks requiring TURN.
7. Social profile, friend search, report/block, moderation; no unapproved API migrations.

## EMOJI / STICKERS — IMPORTANT LEGAL/TECH DETAILS
Implement appearance setting for emoji style: `System (native)` / `Noto Emoji` / `Twemoji-like` only where properly licensed assets can be distributed. Don't copy/bundle Apple's proprietary emoji or Microsoft's art. On Apple devices system default shows Apple look; on Windows the native look depends on OS. Store Unicode emoji in messages (unchanged), render through theme adapter. Sticker packs: keep existing Panduri stickers and add pack picker/favorites only once compatible. GIF tab appears only when existing server says configured, never show dead controls. Add setting preview with live sample and persist preference locally/per account if appropriate.

## EXACT EXECUTION ORDER
**Phase A (audit):** git clean state, baseline screenshot, tests; produce plan. No UI edits until baseline known.
**Phase B (tokens + shell):** CSS variables, typography, safe-area, tab bar liquid, shared sheets, navigation transitions. Acceptance: all 6 tabs and back stack work.
**Phase C (tuner DESIGN ONLY):** target only styling, no algorithm or iframe lifecycle changes. Test A, C♯, E/reference tones, microphone, auto/manual, chord and 360° on real device.
**Phase D (social feed):** feed glass selector, full immersive video/photo/audio/text, active video lifecycle, comments/rail/composer. Test upload, media rights and scroll performance.
**Phase E (chat/calls):** inbox/message/composer, sticker GIF, WebRTC views, loading/error cases; test two real accounts.
**Phase F (emoji theme + settings):** legally licensed glyph packs, system fallback, store/restore, image and text consistency.
**Phase G (learn/AI/profile/premium polish):** existing features' UI only and regression; don't rewrite models.
**Phase H (QA/publish):** responsive screenshots at 320, 375, 390, 430 px + tablet; 60fps aspiration; accessibility, focus, reduced motion, auth, share permission, audio permissions, purchase sandbox. Stage deploy then ship.

## REQUIRED OUTPUT AFTER EVERY PHASE
1. ქართულად: რა შეიცვალა, რას არ შევხებივართ, modified file paths.
2. Before/after screenshots + recorded 2–3 interaction clips where feasible.
3. Actual test command, pass/fail result, device/browser tested, known blockers.
4. Regression checklist for Tuner, lesson mic, feed, chat, calls, purchase.
5. Git commit and rollback instruction; next phase cannot begin if P0 regression fails.

**საწყისი დავალება ამ შეტყობინების წაკითხვის შემდეგ:** Phase A. Read the repo and deliver a grounded audit + source-to-build map + exact Phase B plan. Then implement Phase B in a small safe commit only; do not attempt every phase at once.
