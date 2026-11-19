# Panduri Studio — architecture and status

Panduri Studio is the music workspace inside the panduri app (route `pstudio`), with a plan
for the same instrument as a native plugin. This file records what exists, how it is built,
and what is still missing. Read it before working on any phase.

## 1. What the app already had (audit, 2026-11-19)

| Area | Where | What it gives the studio |
|---|---|---|
| Instrument profile | `src/instrument.js` | Strings, tuning, fret count (17) and a **per-string, per-fret pitch map in cents**, each value with its source (`measured` / `photo` / `estimate` / `computed`). The default is equal temperament, marked `computed`. Nothing may assume equal temperament: everything reads this profile. |
| Theory | `src/theory.js` | `midi(s, f)`, `positions(m)`, `stringName(s)`, `FRETS`. String 1 = **A, the bass** (the teacher's „მე-3 სიმი"), 2 = C♯, 3 = **E, the thin string**. Do not swap these. |
| Recorded panduri | `src/samples.js`, `media/strings/` | The teacher's instrument recorded on **every fret of every string** (`s1-00 … s3-17`), plus whole-chord strokes. Re-tuned by playback rate to the exact fret pitch. The index already supports articulations (`pluck / down / up / mute / chord`), dynamics (`p / mf / f`) and takes (round robin). Today there is **one take per note at one dynamic**. |
| Sound | `src/audio.js` | `note(s, f, {when, vel, dur, art, out})`, `strum(frets, dir, {when, gap, vel, mute, out})` (string by string, in the stroke's direction; down A → E, up E → A), `click`, and a physical-model fallback where no recording exists. `out` (added for the studio) routes a voice into a track's channel. |
| Rhythms | `src/curriculum.js` | The teacher's four rhythms (Kazbeguri ↓!↑↓, Mtiuluri ↓!↓↑!↓↑, Khorumi, Acharuli): their **strokes and accents are his**. Their **durations are not given yet** (`timing.src = 'default'`, even), and the studio says so on the page. Plus general rhythms. |
| Chord shapes | `PD.ai.shapeOf(root, q)` | Shapes and voicings computed from the tuning (the teacher's fingering rule). They are never copied from guitar charts. |
| Piano roll | `src/airoll.js` | The canvas roll of the AI studio. The studio uses it through an adapter. |
| Author studio | `src/studio.js` | The owner's lesson editor (route `studio`). It is separate and untouched. |

## 2. Modules

```
src/pstcore.js   PD.pstCore — the music model. No DOM, no audio: notes in beats, tracks,
                 rhythm patterns, chords by bar, events(), .panduri (de)serialisation with
                 versioning, MIDI write/read (SMF 1), quantize / humanize / transpose.
src/pstudio.js   PD.pstudio — the page and the engine: a per-track channel
                 (gain → pan → analyser → instrument bus), a look-ahead scheduler (25 ms tick,
                 160 ms ahead, seamless loop), and the five views.
qa/pstudio-core.cjs   the model against the app's real instrument + theory (Node)
qa/pstudio-ui.cjs     the studio end to end in Chromium
```

Both modules are `APP_ONLY` (the single-file build is ~4 KB under its 16 MiB limit).

### Project format `.panduri` (v1)

```json
{ "format": "panduri-project", "v": 1, "id": "…", "name": "…", "bpm": 90, "meter": [4, 4],
  "loop": { "on": false, "from": 0, "to": 16 }, "metro": false, "countIn": false,
  "tracks": [
    { "id": "…", "name": "Solo", "kind": "notes", "color": "#6fa9e0", "mute": false, "solo": false, "vol": 0.9, "pan": 0,
      "notes": [ { "id": "…", "m": 62, "s": 2, "f": 1, "t": 0.5, "d": 0.5, "v": 0.78, "art": "pluck", "off": 0 } ] },
    { "id": "…", "name": "Rhythm", "kind": "rhythm",
      "rhythm": { "preset": "mtiuluri", "src": "teacher", "timingSrc": "default", "bars": 4, "swing": 0,
        "steps": [ { "dir": "down", "acc": true, "vel": 0.95, "dur": 1, "mute": false, "str": [1, 1, 1], "off": 0 } ],
        "chords": [ { "bar": 0, "name": "Dm", "frets": [0, 1, 1] } ] } } ] }
```

- Time is in **beats** (a quarter = 1), so tempo changes never move the music.
- A note keeps its **string and fret**. Its pitch is re-read from the instrument when the file is loaded.
- A pitch the panduri does not have keeps `s: 0, f: -1`. It is drawn (striped) and is **not played**.
- `parse()` refuses other formats and newer versions (`newer-version`), and lifts older ones.
- MIDI carries pitch, time, length, velocity, tempo and metre. Strings, frets, articulations
  and rhythm steps exist **only in `.panduri`**: standard MIDI cannot hold them. A stroke becomes
  string notes spread in its direction (18 ms apart). An off never lands after the next on of the
  same pitch.

## 3. Status by phase

| Phase | Done and tested | Partly | Not yet |
|---|---|---|---|
| 1 Audit & architecture | this file | | |
| 2 Core studio | workspace; fretboard (tap to hear, write at a cursor, chord mode, length, velocity); piano roll (draw, move, resize, velocity, snap, quantize, humanize, transpose, duplicate, undo/redo); note inspector (string, fret, velocity, duration, articulation, offset, other places on the neck); projects (autosave, list, duplicate, delete); `.panduri` in/out; MIDI in/out | | multi-select / copy-paste of many notes; MIDI keyboard input (Web MIDI) |
| 3 Sound | recorded notes on every fret; strokes string by string; per-track volume / pan / mute / solo / peak meter | velocity only scales the level: there are no velocity layers or round robin yet | recordings at p / mf / f and several takes per note, tremolo, harmonics, noises (they need a recording session); sample-mapping editor UI (the index exists in `samples.js`) |
| 4 Rhythm & solo | rhythm designer (teacher presets, per stroke: direction, accent in red, velocity, length, strings, mute; swing; chords by bar with voicings from the tuning); several melody tracks at once | | performance-assist fingering, ornaments, slides, Live Performance Mode with MIDI zones and keyswitches |
| 5 Arrange & mixer | tracks, loop region, count-in, metronome | track lanes (no clips yet) | clips (cut / join / loop), automation, markers, tempo changes, EQ / compressor / reverb / delay / saturation / width, presets, audio export (WAV / FLAC / MP3) |
| 6 Native plugin | | | everything (see §4) |
| 7 Kontakt | | | everything (see §5) |
| 8 Sync | `.panduri` file | | cloud sync (Supabase), a plugin that reads `.panduri` |

## 4. The native plugin: plan and limits

- **Stack:** C++17 with JUCE (VST3, AU, Standalone; AAX through JUCE once the Avid SDK is there) or iPlug2. The music model is ported from `pstcore.js`, rule for rule. `qa/pstudio-core.cjs` becomes the shared test vector set (the same inputs must give the same events and MIDI). The audio engine is a sampler with voice management that reads the same sample set and mapping (string × fret × articulation × dynamic × take). The plugin does not depend on a browser `AudioContext`.
- **Realtime rules:** no allocation, locks, file or network I/O in the audio callback. Samples are preloaded or streamed from a disk thread. Parameters are atomics. Scheduling is sample-accurate from the host's PPQ position.
- **This machine (2026-11-19):** Command Line Tools and clang are present. Full Xcode, cmake and JUCE are not installed. Logic Pro is installed, so `auval` can validate an AU here once one is built.
- **AAX** needs Avid's SDK, an Avid developer agreement and PACE signing. None of these are present, so AAX is **not** available until they are.
- **VST3** requires the Steinberg VST3 SDK licence (MIT since 3.8), which is fine.

## 5. Kontakt

A Kontakt instrument is a separate product: KSP scripts, sample mapping in Kontakt and NKI/NKR files. Authoring needs the full Kontakt. Making it run in the free **Kontakt Player** needs Native Instruments' **NKS partner licence** (encoding). Without it, the library works only for owners of full Kontakt. Nothing for Kontakt exists yet.

## 6. Sound truthfully

The studio never presents the physical model or the re-pitched single take as a multi-sampled
library. The Mixer says what the sound is today. A professional library needs a recording
session on the teacher's panduri: every fret, every string, 3–5 dynamics, 3–4 takes, down /
up / mute / tremolo / harmonics, and release and fret noises, at 24-bit / 48 kHz or more, with
documented rights.

## 7. Studio 3.0 (2026-11-19)

The page now opens inside the unified Studio (`src/studio3.js`, docs/studio3/). `PD.pstudio.page(w, view, opt)`
takes `opt = { embed: true, open: <project id>, onState, onOpen }`: in embed mode it draws only the track chips
and the view — the Studio draws the header, the one transport and the view tabs, and drives the page through
`PD.pstudio.engine` (play/stop/seek/tempo/metre/loop/metronome/count-in/undo/redo/rename/setView). Also new:
`create(tpl)` (`'blank'`, `'rhythm:<id>'`), `importAsNew(file)`, `exportPanduri()`, `exportMidi(only)`;
`play()` claims `PD.transport` (s3core.js) and `stop()` releases it. Without `opt` the page is the standalone
studio described above (kept, no longer shown in the app). A rhythm preset is called the teacher's only while its
strokes and accents are his (`pst.tMine`, `pst.changedR`): the file keeps `src: 'teacher'` after an edit.
