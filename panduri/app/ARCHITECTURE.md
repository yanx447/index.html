# ფანდური — Panduri Learning · architecture

The engine knows HOW to teach. Data defines WHAT is taught and WHICH instrument it is taught on.

| Module | Responsibility | Must not contain |
|---|---|---|
| `core.js` | namespace, event bus, local persistence, IndexedDB blobs, i18n, account adapter contract, lazy 3D loader | content, theory |
| `instrument.js` | **Approved instrument profile**: strings, order, tuning, fret count, per-string fret pitch map (cents), physical fret positions, scale length, body/headstock geometry, hardware; every value tagged `measured · photo · estimate · computed` | teaching content |
| `theory.js` | note names, pitch/position lookup — always through the profile (no hard-coded equal temperament) | geometry, content |
| `curriculum.js` | **Curriculum data**: lessons, learning paths, chord library. Ships DEMO content (`demo:true`) until the teacher installs a package | engine logic |
| `lessons.js` | lesson schema v2, normalisation, steps (chords = one event), learning stages per lesson, progress records | content |
| `audio.js` | AudioContext, buses, physical-model fallback, metronome, reference audio | samples |
| `samples.js` | real panduri recordings: string × fret × articulation (pluck/down/up/mute/chord) × dynamic × take (round robin); re-pitch limited (default ±1 semitone) | synthesis |
| `media.js` | teacher video (front / left hand / right hand / player angle), synced to the lesson transport, pitch-preserving rate | rendering |
| `detector.js` | microphone: AudioWorklet YIN + onset + Goertzel chord check, confidence, calibration per device | judging |
| `engine.js` | transport (audio-clock, timer-driven), WAIT / step / auto-pause, judging (pitch, timing, onset, chord kept separate; *unsure* is never a mistake), drills and tempo ladder, results, per-bar history | DOM, content |
| `coach.js` | smart practice: weakest 4-bar window from history → one focused loop + tempo ladder | |
| `neck.js` | close-up fingerboard (wood rendered once into a bitmap; frets from the profile), strings with vibration, **fingertip markers** (finger colour + number) with approach → touch → press → hold → confirm; ghost of the next position; open-string glow. No hand is drawn | judging |
| `lanes.js` | note lanes in string order (E · C♯ · A) flowing to the play line; tokens: colour = finger, lane = string, number = finger; rhythm lessons get one big ↓/↑ beat track with Perfect/Early/Late/Miss | judging |
| `three3d.js` | WebGL instrument from the profile for the 3D tour/explorer (no hands); target and ghost rings; renders on demand; parsed lazily | |
| `practice.js` | the practice screen: header (back · title · pause · •••) + progress, lanes, prompt (play X · string · fret · finger), neck, stroke guide, listening state with live hints, results. Secondary controls live in the ••• sheet | |
| `tools.js` | tuner, chord explorer, fretboard explorer, 3D explorer + tour | |
| `studio.js` + `authortools.js` | author mode only: lesson editor, stages, intro, technique, teacher video, verification flag; instrument profile editor; curriculum package import/export; sample library | |
| `onboard.js` | 8-step first launch (welcome/language · panduri? · level+hand · goals · minutes/day · microphone · tuning check · first mini-lesson) and calibration (noise + room preset, sensitivity with too-quiet/clipping hints, open strings, latency) | |
| `auth.js` | sign in / sign up / reset / verify / Google · Facebook · Apple / guest UI. Calls `PD.account.remote`; without a configured backend it says so and never pretends to succeed | credentials storage |
| `trainers.js` | metronome (lookahead scheduler, tap, signature, subdivision, sound, accent, haptic, pulse), note & fret trainer (levels, mic-graded, spaced repetition, ear, speed), daily practice plan built from history | |
| `pwa.js`, `sw.js` | installable build: versioned shell cache, network-first navigation, explicit-only media caching, safe update prompt, persistent storage | learner data |
| `app.js` | shell, routing, bottom nav Home · Learn · Songs · Practice · Profile; Songs browser (categories, search, filters), Learn paths (Foundation → Advanced), song intro (Learn / Practice / Full / Listen + sections), Practice hub, Profile (achievements from real data), Progress (skill map, 7-day trends), Settings | |

## Input model (mic-first)
The real panduri is the controller. A note is completed only by a microphone event that matches the expected pitch (and, outside WAIT, the timing window). Touch is for navigation only. `engine.input` ignores touch events unless the developer switch **Settings › Developer › Touch test** (`devTouch`) is on; learners never see it.

Pipeline: `getUserMedia` (no AGC/NS/EC) → AudioWorklet (YIN pitch, RMS + HF-transient onset, onset strength over ~48 ms, release) → `detector.js` (room preset gate, self-play and metronome guards, latency offset) → `engine.input` → judge → UI/haptics.

What sound alone cannot tell (stated in the UI, never faked):
* stroke direction ↓/↑ — arrows are guidance only; accents are measured as relative strength;
* which string played a pitch that exists on two strings (e.g. open C♯ vs A-string fret 4) — accepted, with a hint.

Lesson event schema (per note): `t` time (beats), `d` duration, `s` string, `f` fret, `fi` finger, `st` stroke, `acc` accent, `wait` (false = never stops in WAIT), `tol` (timing tolerance override).

## Needs backend / native work
* Accounts, verification email, social sign-in, cloud sync, purchases: implement the adapter in `core.js` and call `PD.account.configure(adapter)`.
* Teacher content (curriculum packages, video) is imported in Author mode or served by that backend.
* Lower audio latency on Android / Bluetooth is limited by the browser; a native wrapper (Oboe/AAudio, AVAudioEngine) would cut it further.
* Haptics: `navigator.vibrate` works on Android; iOS Safari has no web vibration API.

## Data packages
* **Instrument profile** — `{ "schema": "panduri-instrument", "v": 1, … }` (Studio → Instrument → export/import)
* **Curriculum** — `{ "schema": "panduri-curriculum", "v": 1, "meta", "lessons", "paths", "chords" }`
* **Lesson** — `{ "schema": "panduri-lesson", "v": 2, "lesson": { id, type, title, bpm, meter, sections, stages, intro, technique, media, events:[{t,d,s,f,fi,st,acc,chordId,chord,technique,hint,hand,diff}] } }`
* **Samples** — files named `A_05_pluck_mf_1.wav`, `2_7_down_f_2.flac`, `chord_5-4-5_down_mf_1.wav`

## Accounts
Guest mode is real and local. A cloud backend implements the contract in `core.js` (email auth, sync with revisions, backup, entitlements for purchased/private lessons, teacher publishing). There is no fake login.

## Builds
`python3 build.py` → `dist/app/` (installable PWA, one file per module), `dist/panduri-app.html` (self-contained), `dist/artifact.html` (body fragment for hosts that supply the document skeleton). The build fails if any page has more or fewer than one `<!doctype>/<html>/<head>/<body>`.

## 2D practice stage (src/highway.js) and the hand system

One clock: everything moving on the practice screen is a pure function of
`engine.visualNow()` (beats, derived from the audio-clock anchor) and the current
BPM. Pause, seek, speed change, A/B loop and WAIT therefore resynchronise the
lane, both hands, strings and the 3D view at once. Springs (exact critically
damped steps) only smooth discontinuities such as a seek.

Layers, bottom to top:
1. Instrument: drawn once into a cached bitmap at true millimetre scale from
   `PD.geom` (which reads only the instrument profile). Nothing is widened to fit UI.
2. Strings: thin, live (vibration from the stopping point to the bridge).
3. Hands.
4. Teaching targets: contact rings, finger numbers on the fingertip, strum zone.
5. Timing lane (top band): notes, stroke notation, play line.
6. Feedback: short, small confirmations.

Scale: the whole instrument is shown when it fits at a readable scale;
otherwise (phones, tall portrait stages) the camera follows the playing hand at
true proportions and a small overview shows where you are.

Left hand: a note event (string, fret, finger, time, duration) drives:
- B: hand position. An anchor schedule changes only when a note is out of reach
  (stretch by one fret allowed for fingers 1 and 4); the palm travels shortly
  before the note that needs it.
- A: finger articulation. Each finger has press / release / prepare phases with
  look-ahead (the next finger approaches and lowers, never presses early); fingers
  overlap in transitions; a finger stays down under a higher fret on the same string.
- Joints: a 3-bone chain (MCP → PIP → DIP, DIP coupled to PIP) solved per finger in
  the vertical plane through knuckle and fingertip. Fingertips stop just behind the
  fret wire. Neighbouring fingers flex slightly (sympathetic motion).

Right hand: a stroke event (direction, accent, time) drives a wrist rotation
about a pivot on the lower bout; the fingertip crosses the middle string exactly
at the event time. Accent: faster, wider arc, firmer follow-through. Two strokes
in the same direction lift over the strings on the way back. In WAIT the hand
holds the prepared pose.

The 2D stage computes this pose every frame (also when only the lane is drawn)
and the 3D view consumes the same pose (`PD.R3D.setPose`).

Chords page: the same stage in preview mode (one still step, no lane).

QA scripts: qa/handqa.js (no teleporting, contact accuracy, stroke direction,
no penetration), qa/perf.js (frame cost), qa/screens.js (all routes, clipping,
horizontal overflow, missing strings), qa/st.js (practice at all viewport sizes).
