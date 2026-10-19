# სამი სიმი · Sami Simi — the tuner inside Panduri

„სამი სიმი“ used to be a separate app. It is now **part of the Panduri app**: the tuner tab and every
tuner link in Panduri open it full screen. There is no separate website, store app or APK any more.

- **The tuner itself (the code that runs):** [`../app/tuner/`](../app/tuner/) — vanilla JS, unchanged from Sami Simi 1.8.5
  - `js/pitch-detector.js` MPM / NSDF via FFT + octave validation
  - `js/tracker.js` stabiliser: noise floor, attack rejection, confidence, hold, hysteresis
  - `js/reference.js` procedural panduri pluck (extended Karplus–Strong) + `audio/` real panduri reference tones
  - `js/i18n.js` Georgian / English · `js/view/*` meter, strobe, headstock (2D/3D), trace, diagnostics · `js/tools/*` chords, metronome, ear, play-along, recorder, …
- **This folder (materials that came with it):**
  - `tests/run-tests.mjs` engine tests (`npm test`, 115 checks)
  - `privacy.html`, `support.html` privacy and support pages (linked from the apps page)
  - `store/`, `assets/`, `docs/LAUNCH.md`, `scripts/` store texts, screenshots, icons and the old publishing guide and build scripts of the separate app — kept for reference

Panduri opens the tuner from `app/js/samisimi.js` (the built app) — source `pd/src/samisimi.js`.
