#!/usr/bin/env python3
"""Additions to prep.py's cache for the quality study (round 2). Reads only.
* the garmoni of QALTA XEVSURULI as two units: 0005+0006 (one stereo garmoni, split L/R) and 0007 (another garmoni
  track) — so one can be held out while the other trains (the garmoni has no second session);
* 'other' sounds that are none of the four: Georgian polyphonic voices (Bani, VOCAL.mp3) and a piano
  (Every_Note_Piano.wav) — both already in the repository — to measure what a voice does to the four stems.
Usage: python prep2.py <dataset dir> <repository root> <work dir>"""
import json, os, sys
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
from math import gcd
DIR, REPO, OUT = sys.argv[1:4]; SR = 44100
def load(path):
    x, sr = sf.read(path, dtype='float32', always_2d=True); m = x.mean(axis=1)
    if sr != SR: g = gcd(sr, SR); m = resample_poly(m, SR // g, sr // g).astype('float32')
    return m
Q = 'QALTA XEVSURULI - 000{} - Audio - {}.wav'
add = {'qalta_garmoni_56': [os.path.join(DIR, Q.format(5, 'GARMONI')), os.path.join(DIR, Q.format(6, 'GARMONI (D)'))],
       'qalta_garmoni_7': [os.path.join(DIR, Q.format(7, 'GARMONI (D)'))],
       'other_vocal': [os.path.join(REPO, 'MUSIC/ბანი - აჭარული/VOCAL.mp3')],
       'other_piano': [os.path.join(REPO, 'MUSIC/Every_Note_Piano.wav')]}
man = json.load(open(os.path.join(OUT, 'manifest.json')))
for k, fs in add.items():
    xs = [load(f) for f in fs]; n = min(len(x) for x in xs); x = np.sum([a[:n] for a in xs], 0).astype('float32')
    np.save(os.path.join(OUT, 'cache', k + '.npy'), x)
    man['items'][k] = {'instrument': 'other' if k.startswith('other') else 'garmoni', 'files': [os.path.relpath(f, REPO) if f.startswith(REPO) and not f.startswith(DIR) else os.path.basename(f) for f in fs], 'split': 'round2', 'seconds': round(len(x) / SR, 2)}
    print(k, man['items'][k]['seconds'], 's', flush=True)
json.dump(man, open(os.path.join(OUT, 'manifest.json'), 'w'), ensure_ascii=False, indent=1)
