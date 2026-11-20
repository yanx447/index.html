# Georgian instrument separation — prototype (doli · garmoni · duduki · panduri)

Offline tools. Nothing here runs in the app, and no audio, cache or model is kept in the repository — the
recordings belong to the owner and stay on his machine (`Panduri-AI-Dataset/`, results in
`Panduri-AI-Separation/`, both listed in the local `.git/info/exclude`). Report: `docs/studio3/GEORGIAN-SEPARATION.md`.

```sh
python3 -m venv .venv && .venv/bin/pip install -r panduri/ai-build/geo/requirements.txt
.venv/bin/python panduri/ai-build/geo/audit.py Panduri-AI-Dataset Panduri-AI-Separation/audit.json   # read only
.venv/bin/python panduri/ai-build/geo/prep.py  Panduri-AI-Dataset Panduri-AI-Separation               # mono 44.1 kHz cache + split
.venv/bin/python panduri/ai-build/geo/sep.py   Panduri-AI-Separation all 35                           # round 1: train 35 min, then evaluate
.venv/bin/python panduri/ai-build/geo/prep2.py Panduri-AI-Dataset . Panduri-AI-Separation             # round 2 additions
.venv/bin/python panduri/ai-build/geo/sep2.py  Panduri-AI-Separation train F1 v3 25                   # round 2: one variant on one fold
.venv/bin/python panduri/ai-build/geo/sep2.py  Panduri-AI-Separation eval F1 nmf,F1_v3                # → round2/results_F1.json
.venv/bin/python panduri/ai-build/geo/sep2.py  Panduri-AI-Separation select F1_v3                     # hybrid weights (F1 only)
.venv/bin/python panduri/ai-build/geo/sep2.py  Panduri-AI-Separation listen F2 nmf,F2_v3,hybrid:F2_v3 # WAVs + blind kit
```

| file | what it does |
|---|---|
| `audit.py` | levels, full-scale samples, DC, silence, noise floor, band, hum, harmonic/percussive share, stereo correlation, multitrack sessions (files of the same length) |
| `prep.py` | the split by recording; sessions used both ways are split by time; silent/noise files skipped |
| `prep2.py` | round 2: garmoni tracks 0005+0006 and 0007 as separate units; Georgian voices + a piano as 'other' |
| `sep2.py` | round 2: the protocol (F1 selection / F2 locked test, by session), variants NMF · v1 · v2 · v3 (HPSS-aware masks, SI-SDR loss, EQ augmentation) · v3o (+ 'other') · per-instrument network/NMF hybrid, level/voice/leakage tests, learning curve, listening WAVs and a blind listening kit |
| `report2.py` | round 2 results JSON → the report's tables |
| `sep.py` | the mask network (dense → 3-layer BiLSTM → 4 soft masks), training on mixtures made on the fly, evaluation against `mix` (no separation), supervised NMF and the oracle ratio mask; writes `results.json` and WAVs to `listen/` |

Apple Silicon uses the GPU (MPS); elsewhere it runs on the CPU (slower).
