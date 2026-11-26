# Song lessons from `MUSIC/`

The recordings in `MUSIC/` become song lessons in three steps. The recordings are only read; nothing in `MUSIC/` is changed (the analysis is saved next to each one as `lesson-analysis.draft.json`).

```sh
python3 -m venv venv && ./venv/bin/pip install -r requirements.txt
export PANDURI_MUSIC=/path/to/MUSIC LESSON_CACHE=/path/to/cache   # the cache holds the stems (≈ 2.5 GB), never commit it
./venv/bin/python separate.py          # Demucs htdemucs: vocals / bass / other / drums per recording
./venv/bin/python analyze.py --bench   # Bani-Acharuli against the teacher's chart (the accuracy check)
./venv/bin/python analyze.py           # every song in songs.json
./venv/bin/python build-data.py        # → ../../lessons/songs.json (learners) + review.json (owner's editor)
cd ../.. && python3 build.py
```

`songs.json` (here) lists the recordings, their clean titles and performers, and what the owner said about a song (`hint`). `Every_Note_Piano.wav` is not a song.

## What is measured, and how

| Question | Methods compared |
|---|---|
| Beats, tempo map | essentia RhythmExtractor2013 (multifeature) · librosa beat_track · the app's Studio analysis; a stretch where the tracker took another level of the pulse is spaced again at the song's beat (`repair_beats`) |
| Meter | stroke places inside the beat (2 or 3) · chord changes and bass onsets per bar length |
| Key | essentia KeyExtractor (temperley · krumhansl · edma) · chord histogram |
| Chords | A: bass-root + harmonic template on the Demucs stems, Viterbi · B: essentia HPCP + ChordsDetectionBeats · C: Basic Pitch notes · D: Studio. Vote per beat; the song's repeating cycle where it follows one; triads for the lesson |
| Melody | pYIN on the vocal stem (the instrument stem for dances) · Melodia · Basic Pitch; notes below 45 % agreement are dropped |
| Sections | where the voice sings; parts with the same chords share a letter |
| Strokes | spectral-flux onsets of other + bass, folded onto the beat |

## Accuracy on the one song with a known answer

Bani-Acharuli (the teacher's chart Dm · Dm · B♭ · C and his beat map, `songdata.js`):

- beats: F = 0.99 (±70 ms)
- meter: 2 beats × 3 strokes = 6/8, key Dm
- the measured cycle is his cycle (Dm · B♭ · C · Dm, one beat rotated)
- where the analysis says it follows the cycle (69 % of the song) it agrees with him on 100 % of the beats; the other 31 % is marked for review (it hears Am · F · G · A in the long instrumental and A in the ending)
- raw per-beat chords without the cycle: 54.9 % — the reason the lessons use the cycle and the review list

No other song has a known answer, so every passage where the methods disagree is listed in `review.json`, and every lesson starts as *Needs review* in the owner's dashboard. Tests passing is not proof that a transcription is right: listen.
