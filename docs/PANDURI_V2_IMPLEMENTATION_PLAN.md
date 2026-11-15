# PANDURI V2 — audit and staged implementation

Branch: codex/panduri-v2-foundation. Existing staged user media preserved. No commit or deployment performed.

## Verified architecture
Source is panduri/source/src, plain JavaScript in the PD namespace. CSS is src/app.css. Root npm run build invokes source/build.py and produces source/dist/app and artifact.html. panduri/app is the deployment copy; it has not been overwritten. The supplied audit's panduri/build.py path is stale. Current build reports 871 poses rather than the reference document's 819; no pose data was edited.

Tuner lives in source/ext/sami-simi, embedded by samisimi.js. Learning uses engine, detector, practice and curriculum; social.js handles feed; community.js handles chat/calls; chatkit.js handles pickers; billing/premium handle entitlements. These functional modules remain unchanged. Static presence does not establish live backend functionality.

## Implementation sequence and gates
1. Foundation: OLED tokens for existing dark themes, glass navigation, focus and reduced transparency fallback. Preserve theme choices and six routes.
2. Navigation: verify all six routes, back stack, safe areas and interruption before sliding indicator changes.
3. Tuner: presentation-only source CSS; compare real A/C♯/E, cents, calibration, modes, reference and 360 view on hardware.
4. Feed: retain media rights/reactions and active video lifecycle; test with two accounts before release.
5. Chat/calls: keyboard, attachments and existing pickers; verify WebRTC on two devices.
6. Emoji: Unicode unchanged, licensed assets only; local appearance setting.
7. Learning, AI, Premium and profile: preserve scoring and entitlement contracts.
8. QA: 320/375/390/430, tablet/desktop, accessibility and real microphone/network/payment sandbox checks.

## First implementation
Only source/src/app.css changes. Existing ink/midnight themes gain exact OLED surfaces and copper; bottom navigation gains translucent material, focus outline and platform fallbacks. No new inert controls. Generated output remains local in source/dist.

## Validation
Build passed: version 179c646479, single artifact 14636 KB, 871 poses.
Offline tuner engine: 116 passed, zero failed.
Live microphone, authenticated feed/chat, TURN calls and payment sandbox remain unverified. Do not interpret offline tests as end-to-end clearance.

## Rollback
Remove the final V2 foundation block from source/src/app.css and rebuild. The original deployment output is unchanged. Do not reset the user's staged media.

## Responsive shell verification — continuation
Corrected the source map: build.py loads app.css in legacy and design.css in ds. Current navigation uses .dock/.side/.nv (five phone destinations plus desktop destinations), not the obsolete .tabbar. Removed ineffective prior legacy overrides and applied tokens in design.css.

Production build passed. `node qa/v2-shell.cjs` passed across 18 viewports from 320x568 through 3840x2160: no outer horizontal overflow, no tuner iframe/dock overlap, no page runtime errors; computed main background is pure black. Reduced-motion navigation returns home. Screenshots and JSON: /tmp/panduri-v2. Visually inspected 390x844: reference/microphone/chord controls clear the dock; headstock unchanged. These checks cover the shell, not all internal tuner controls or native TV compatibility. Real hardware, calls, payments and authenticated social remain unverified.

## Updated reference audit — 13 November 2026
Read the supplied Downloads/panduri-concept-and-roadmap master prompt, roadmap and HTML concept. These are reference material; their proposed engine/hand rewrites and navigation changes do not override the user's preservation requirement. The existing source/build architecture and current branch remain authoritative. The new concept's six key screens are the next visual acceptance group; this phase does not certify them as finished.

### Foundation deliverable
Shared surface tokens and navigation are in source/src/design.css. Shared glass now covers sheets, chat composer, sticker portal and call controls, with opaque fallback. Chat bubbles use neutral elevated surfaces; AI containers share the surface system. TV detector controls TV styling; its remote handler now scopes focus to the open sticker portal and respects reduced motion during scrolling. Headstock and audio files unchanged.

### Evidence
- Production build: PASS, bc39b1dba9 before TV refinement; subsequent production build also exited 0.
- Shell matrix: 18 sizes, 320x568–3840x2160; reported in the earlier session; its temporary JSON is no longer available. This earlier matrix covers shell/tuner separation, not new overlays.
- Emoji/stickers: PASS, 3944 emoji catalogue, insertion, portal bounds, 20 stickers, Escape and cleanup.
- Social UI with mocked backend: completed phone and desktop scenarios with errors []; report v2-review/social-results.txt. This is not live Supabase/WebRTC validation.
- Before/after chat screenshots: v2-review/chat-before.png and chat-after.png. Before is repository HEAD test capture; after is the current mocked social scenario, so dynamic content can differ.

### Remaining acceptance gates
Review six key screens against the new HTML at mobile/tablet/desktop; finish emoji appearance with licensed local assets; verify tuner outer controls at short heights; validate TV focus at 720p/1080p/4K; run microphone, call and purchase tests on real devices/accounts. No production deployment or data changes authorized or performed.

## 13 November continuation — settings and page QA
Added local licensed Google Noto Emoji (monochrome) and System selection. PWA build copies the font and OFL license; single-file artifact keeps System because that artifact does not bundle the external font. Browser test confirmed theme=noto, font loaded=true, saved=noto. Stored message Unicode is untouched. Source changes: app.js, boot.js, build.py, design.css, assets/emoji.

Expanded shell QA to nine routes (home, learn, chords, AI, profile, settings, progress, metronome, rhythms). Network-isolated run passed at 390/820/1024/1280/1366/1440/1920/2560/3840 widths; earlier all-size run stopped on app startup timeout, not an assertion. routes-results.txt records the successful run. Checks cover navigation, outer overflow, tuner/dock separation and runtime errors; screenshots are not proof of live calls/payments/microphone.

Additional refinements: neutral glass feed action rail, all-overlay Reduce Transparency toggle, short landscape sheets/call controls, Home level text wrapping, AI dropzone surface. Production build passes. Full concept-by-concept visual acceptance and real-device checks remain outstanding.

## Final checks for the current local changes
Production build passed after tuner surrounding-surface refinement. Tuner tests: 116/116. Chatkit: PASS. Interaction regressions: PASS (nested Escape/Back, focus trap/restoration, labels, file selection/cancellation cleanup, changing Reduce Motion mid-animation, zero page errors). Updated the stale Home selector and removed checks for the retired spotlight effect; functional assertions remain.

The user-supplied headstock rendering was not edited. Tuner CSS changes touch body, meter surface, instruction/dock corners and slow-display mode-bar fallback only. Files and test reports remain local. Reference correspondence across every state, native TV support, physical microphone, WebRTC and purchase flows are not certified by these tests.
