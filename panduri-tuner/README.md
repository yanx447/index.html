# ფანდურის ტიუნერი — Panduri Tuner 2.0

Tuner for the 3-string Georgian panduri. Default tuning **A3 · C♯4 · E4**.
It is written in vanilla HTML, CSS and JavaScript with no dependencies. It installs as a PWA and works offline after the first load.

## Run / deploy

The microphone works only over **https://** (or `localhost`). ES modules do not load from `file://`.

- Local: `python3 -m http.server 8080`, then open `http://localhost:8080`.
- Public: upload the whole folder to GitHub Pages, Netlify, Vercel or Cloudflare Pages. Then use Safari → Share → **Add to Home Screen** on iPhone, or Chrome → **Install app** on Android.
- When you release a new version, bump `VERSION` in `sw.js` so installed copies update.

## Structure

```
index.html            markup, sheets, accessibility labels
styles.css            design system (tokens at the top)
manifest.webmanifest  PWA manifest
sw.js                 offline shell (cache-first assets, network-first page)
icons/                app icons (192, 512, maskable, apple-touch)
js/
  main.js             controller: wiring, UI state, modes, permissions, lifecycle
  tuning.js           Panduri tuning model — presets, transposition, octave, note names
  guidance.js         cents → instruction text / direction (pure)
  pitch-detector.js   MPM/NSDF via FFT autocorrelation + octave validation
  tracker.js          stabilizer: noise floor, attack rejection, confidence, hold, hysteresis
  audio-input.js      microphone (raw: no AGC / noise suppression / echo cancellation)
  reference.js        procedural Panduri pluck (extended Karplus–Strong + body modes)
  settings.js         localStorage persistence
  view/meter.js       SVG needle meter (non-linear scale around 0 ¢)
  view/strobe.js      strobe display driven by real Δf
  view/headstock.js   SVG headstock: A + C♯ pegs left, E peg right
  view/trace.js       5-second pitch history
  view/diagnostics.js hidden developer panel
tests/run-tests.mjs   engine test-suite (node tests/run-tests.mjs)
```

## Adding a tuning

Add an entry to `PRESETS` in `js/tuning.js` (MIDI numbers, string 1 → 3). No other code needs to change. The settings sheet already shows the preset name and its notes.

## Diagnostics

Open the app with `?debug`, or long-press the **ფანდური** title. The panel shows:

- raw, smoothed and target frequency, cents, spread, clarity, confidence
- RMS, noise floor and gate
- sample rate, detector rate and cost per pass, render FPS

## Engine in short

- Analysis runs about 30 times per second on a 4096-sample window. Rendering runs at display rate, and only while something is moving.
- One analysis pass costs about 0.8 ms on a desktop core.
- The detector is MPM/NSDF computed via FFT, with parabolic interpolation. It adds octave-down validation (more periodic at 2τ → true period) and prior-guided tie-breaks toward the expected string.
- The tracker works in stages:
  - It measures the noise floor for about 0.9 s after start (auto sensitivity).
  - It ignores roughly the first 90 ms of each pluck (attack rejection).
  - It rejects outliers with medians, not means.
  - Smoothing adapts to the error: fast when the pitch is far off, calm near 0 ¢.
  - Confidence combines clarity, SNR and stability.
  - It holds the last reading for 650 ms after the note fades.
  - Auto mode switches strings only with hysteresis and consecutive-frame confirmation.
- While the reference tone plays, the tuner ignores the microphone.
