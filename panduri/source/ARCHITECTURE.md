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
| `gamecore.js` | **Games, the rules** (no DOM, no audio; tested in Node by `qa/games-core.cjs`): charts from the instrument's note map, note and stroke matching, scoring, combo, stars, records + their merge for sync, achievements, daily challenge, Arena challenge codes, the session state machine, the clock across pauses | screens |
| `gameaudio.js` | Games, the microphone and the clock: one owner of the shared detector for every game (start, let go), metronome clicks on the audio clock (kept out of the judging), microphone choice, play-along timing calibration | judging |
| `gameplay.js` | Games, each game's start page and screen: Note Rush, Rhythm Battle, Melody Memory, Fret Hunter, Chord Master, Song Quest, Band Jam | rules |
| `games.js` | Games hub, start pages, the play stage (HUD, count-down, pause, results), settings, tuning check, Arena, records into the app's XP / streak / sessions | |
| `app.js` | shell, routing, bottom nav Home · Learn · Songs · Practice · Profile; Songs browser (categories, search, filters), Learn paths (Foundation → Advanced), song intro (Learn / Practice / Full / Listen + sections), Practice hub, Profile (achievements from real data), Progress (skill map, 7-day trends), Settings | |

## Input model (mic-first)
The real panduri is the controller. A note is completed only by a microphone event that matches the expected pitch (and, outside WAIT, the timing window). Touch is for navigation only. `engine.input` ignores touch events unless the developer switch **Settings › Developer › Touch test** (`devTouch`) is on; learners never see it.

Pipeline: `getUserMedia` (no AGC/NS/EC) → AudioWorklet (YIN pitch, RMS + HF-transient onset, onset strength over ~48 ms, release) → `detector.js` (room preset gate, self-play and metronome guards, latency offset) → `engine.input` → judge → UI/haptics.

What sound alone cannot tell (stated in the UI, never faked):
* stroke direction ↓/↑ — arrows are guidance only; accents are measured as relative strength;
* which string played a pitch that exists on two strings (e.g. open C♯ vs A-string fret 4) — accepted, with a hint.

Lesson event schema (per note): `t` time (beats), `d` duration, `s` string, `f` fret, `fi` finger, `st` stroke, `acc` accent, `wait` (false = never stops in WAIT), `tol` (timing tolerance override).

## Games (gamecore · gameaudio · gameplay · games — installable app only)
The real fanduri is the controller; the four modules are `APP_ONLY` (the single file stays under 16 MiB) and app.js,
cloud.js reach them through `PD.games` / `PD.gameCore` guards. Route `games` (hub), `games/<game>[:<level>:<difficulty>]`,
`games/arena:<code>`; the side bar has a Games entry, the phone dock keeps its five tabs (Home and the Practice hub link it).

* **One clock.** Song time ↔ audio clock through segments (`gameCore.clock`), so pause and resume freeze and continue
  exactly and a stroke reported late from before a pause still maps. Visuals use `audio time − outputLatency` (what is
  heard now); a stroke at detector time t is judged at `t − outputLatency − offset`, where the offset is this device's
  play-along calibration (`gm.offset.<device>`, not synced). Clicks are scheduled ahead on the audio clock and passed to
  `detector.guard`, so the metronome itself is never a stroke.
* **What is judged.** Notes: pitch decides right or wrong (tolerance per difficulty; *unsure* is never a mistake, a wrong
  note only with a confident reading, an octave only above 0.8), timing decides Perfect / Great / Good. A plucked string
  reads sharpest in its first ~0.2 s (the teacher's open A: +26 ¢ there, +8 ¢ settled; his A string +23…+58 ¢ high on the
  neck), so the sharp side of each tolerance is wider (`sharp`, 10–20 ¢) and pitch only caps a note near the edge at Great.
  A confident wrong reading of the right note played a moment ago (its string still ringing) is *unsure*, not wrong. A
  device whose play-along taps spread more than the listening's own ~8 ms gets its timing windows widened by the excess
  (at most 15 ms, `gameCore.widen`). Strokes: onset time; accent from relative strength; direction never (stated on screen);
  the later strings of one strum (75–90 ms after the first) are the same stroke. Chords: note by note; the whole-chord
  Goertzel check is a beta and labelled so.
* **Records.** `games.best · games.hist · games.ach · games.daily` (versioned `{ v: 1 }`), merged per key by
  `gameCore.merge` when the account syncs. Every finished round is one practice session (`game:<g>:<l>`), so the app's XP,
  streak and daily minutes count it; the touch test (`devTouch`) is never saved.
* **Material.** Note Rush, Melody Memory, Fret Hunter: positions from the instrument profile, lines made of ordinary
  practice phrases (scale steps, turns, repeated notes, arpeggios of A, D, E, sequences) that rest on A · C♯ · E
  (`gameCore.phrases`; chart version `CHART_V`, carried by Arena codes). Rhythm Battle: the teacher's four rhythms (order
  and accents untouched); stroke lengths are his own once set in the Studio, else measured from his slowest recordings
  (`gameCore.measuredTiming`: acharuli ≈ 2 : 1 : 2.3, mtiuluri ≈ 1.8 : 1 : 1 : 0.8 : 1), else equal steps — which nobody
  confirmed, so kazbeguri and khorumi are practice only (no stars, records or XP) until he does. Chord Master: the computed
  library, the teacher's fingering rule, the app's chord box (`tools.chordDiagram`). Song Quest: only the teacher's own
  material counts officially; demo / spec drafts, the learner's own and AI estimates are practice, and each is labelled.
  Band Jam: Bani-Acharuli with its recording (stems full · music · vocals) on its measured beat map; B♭ and C shapes are
  marked draft. Before a scored round with the recording on the speaker it plays 4 s while the learner is silent: 3 or more
  strokes heard → the microphone hears the speaker, and the learner chooses headphones (check again), practice or the
  metronome alone.
* **Before a round** the start page shows what is measured about the listening: microphone, a sound above the room's
  floor, the last note heard, calibration, the last tuning check. Without a microphone only a preview plays (the app plays,
  nothing is scored or saved).
* **Arena** is a code (base64url JSON + checksum against typing errors); the comparison runs on the device and says it is
  not a ranking. Live head-to-head play needs a server and does not exist.
* QA: `qa/games-core.cjs` (Node, the rules), `qa/games-mic.cjs` (the teacher's recorded notes through Chromium's fake
  microphone and the real detector), `qa/games-ui.cjs` (every screen and the session's life; `BROWSER=webkit`),
  `qa/games-audit.cjs` (the verification matrix: every game played by the virtual fanduri, `qa/vpanduri.cjs`),
  `qa/games-audio.cjs` (how well the listening works: pitch across the neck, fast notes, soft and loud, ringing strings,
  noise, claps), `qa/games-offline.cjs` (offline through the service worker, and an update after a deploy).
  `docs/v2-review/games/real-device-tests.md`: the 12 checks still to make on a real fanduri.

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

## Rendered hand videos (render/ → assets/fig/)
The close-up hand clips (Bm on the neck, strokes, finger numbers, warm-up) are rendered offline from a real
3D arm model (supplied as fps-arms.blend; mesh, UVs and vertex groups read with render/../tools/blend.py) on the
app's own 3D panduri model (three3d.js `export`). A skeleton is derived from the vertex groups; poses are joint
rotations only (bone lengths never change), solved so fingertip pads sit on their string/fret targets, nothing
passes through the neck, fingers stay arched above the strings and the palm keeps a gap ("ball") to the neck.
render/run.js opens the built app in headless Chromium, render/scene.js builds the Three.js scene, the job scripts
(bmanim.js, strokes.js, handalone.js) write frames, render/post.py adds finger badges / nail highlights and
encodes small H.264 loops + posters into assets/fig/, which build.py embeds (single file) or links (PWA).
Teacher data used: Bm = thumb on the bass (3rd string) fret 2 · index on the 2nd voice fret 1 · middle on the
1st voice fret 2; strokes: down with the nail tips as the fingers open, up with the thumbnail tip, wrist only.
