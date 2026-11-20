# Georgian instrument separation — prototype (doli · garmoni · duduki · panduri)

Offline tools. Nothing here runs in the app, and no audio, cache or model is kept in the repository — the
recordings belong to the owner and stay on his machine (`Panduri-AI-Dataset/`, results in
`Panduri-AI-Separation/`, both listed in the local `.git/info/exclude`). Report: `docs/studio3/GEORGIAN-SEPARATION.md`.

```sh
python3 -m venv .venv && .venv/bin/pip install -r panduri/ai-build/geo/requirements.txt
.venv/bin/python panduri/ai-build/geo/audit.py Panduri-AI-Dataset Panduri-AI-Separation/audit.json   # read only
.venv/bin/python panduri/ai-build/geo/prep.py  Panduri-AI-Dataset Panduri-AI-Separation               # mono 44.1 kHz cache + split
.venv/bin/python panduri/ai-build/geo/sep.py   Panduri-AI-Separation all 35                           # train 35 min, then evaluate
```

| file | what it does |
|---|---|
| `audit.py` | levels, full-scale samples, DC, silence, noise floor, band, hum, harmonic/percussive share, stereo correlation, multitrack sessions (files of the same length) |
| `prep.py` | the split by recording; sessions used both ways are split by time; silent/noise files skipped |
| `sep.py` | the mask network (dense → 3-layer BiLSTM → 4 soft masks), training on mixtures made on the fly, evaluation against `mix` (no separation), supervised NMF and the oracle ratio mask; writes `results.json` and WAVs to `listen/` |

Apple Silicon uses the GPU (MPS); elsewhere it runs on the CPU (slower).
