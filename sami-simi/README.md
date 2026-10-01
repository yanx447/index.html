# სამი სიმი · Sami Simi

A precise tuner for the three-string Georgian panduri. Tuning: **A3 · C♯4 · E4** (ლა · დო♯ · მი).
The UI is in Georgian and English. It runs as a website (PWA, works offline) and as an iOS and Android app (Capacitor).

- **Website:** https://yanx447.github.io/index.html/sami-simi/
- **Tuner in the browser:** https://yanx447.github.io/index.html/sami-simi/app/
- **Android test build:** [Releases → android-latest](https://github.com/yanx447/index.html/releases/tag/android-latest)
- **Publishing guide (Georgian):** [docs/LAUNCH.md](docs/LAUNCH.md)
- **Store texts and graphics:** [store/](store/)

## Layout

```
index.html, privacy.html, support.html, site.css, site.js   website (GitHub Pages, repo root)
app/                    the tuner (vanilla JS, no dependencies) — also the native webDir
  js/pitch-detector.js  MPM / NSDF via FFT + octave validation
  js/tracker.js         stabilizer: noise floor, attack rejection, confidence, hold, hysteresis
  js/reference.js       procedural panduri pluck (extended Karplus–Strong)
  js/i18n.js            Georgian / English strings
  js/view/*             meter, strobe, headstock, trace, diagnostics
capacitor.config.json   native app config (com.samisimi.tuner)
scripts/native-setup.sh creates/updates ios/ and android/ (permissions, icons, versions)
scripts/make-art.py     icons + splash
scripts/screens.cjs     store screenshots (Playwright + fake microphone)
scripts/frame.py        captioned store screenshots + feature graphic
../.github/workflows/   Android APK/AAB build, iOS compile check (repo root)
../codemagic.yaml       signed iOS build → TestFlight (repo root, no Mac needed)
tests/run-tests.mjs     engine tests (npm test)
```

## Develop

```
npm test                         # engine tests
python3 -m http.server 8080      # open http://localhost:8080/app/
npm install && npm run android   # needs Android Studio
npm install && npm run ios       # needs a Mac with Xcode
```

Diagnostics: open the app with `?debug`, or long-press the title.
