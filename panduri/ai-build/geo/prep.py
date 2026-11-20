#!/usr/bin/env python3
"""The dataset as the separator sees it: mono, 44.1 kHz, float32 — and the split.

The originals are only read. Each file (or, for a multitrack session, each instrument's tracks summed) becomes
one array in <out>/cache/*.npy. The split is by recording, so a test never hears a recording the model was
trained on — except where there is only one recording of an instrument (the garmoni: one session), and the two
real ensemble sessions that are also the only real mixtures we have: there the split is by time (first 65 % for
training, the rest for testing), and the report says so.

Usage: python prep.py <dataset dir> <out dir>
"""
import json, os, sys
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
from math import gcd

DIR, OUT = sys.argv[1], sys.argv[2]
SR = 44100
os.makedirs(os.path.join(OUT, 'cache'), exist_ok=True)

def load(name):
    x, sr = sf.read(os.path.join(DIR, name), dtype='float32', always_2d=True)
    m = x.mean(axis=1)
    if sr != SR:
        g = gcd(sr, SR); m = resample_poly(m, SR // g, sr // g).astype('float32')
    return m

CUT = .65   # time split for the sessions that are used both ways
Q = 'QALTA XEVSURULI - 000{} - Audio - {}.wav'
plan = {
    # name: (instrument, [files summed], split)
    'doli_satrfialo':  ('doli', ['DOLI SATRFIALO YAZBEGURI.wav'], 'train'),
    'doli_yazbeguri3': ('doli', ['doli yazbeguri 3 rva.wav'], 'train'),
    'doli_main':       ('doli', ['DOLI.wav'], 'test'),                                   # never heard in training
    'duduki_kintauri': ('duduki', ['KINTAURI DUDUKI 1.wav'], 'train'),
    'duduki_3':        ('duduki', ['DUDUKI 3.wav'], 'train'),
    'duduki_2':        ('duduki', ['DUDUKI 2.wav'], 'test'),
    'duduki_2b':       ('duduki', ['DUDUKI 2(2).wav'], 'test'),
    'panduri_d02':     ('panduri', ['FANDURI (D)_02.wav'], 'test'),
    'panduri_25':      ('panduri', ['FANDURI 2(5).wav'], 'test'),
    # sessions: time split
    'qalta_doli':      ('doli', [Q.format(1, 'DOLI'), Q.format(2, 'DOLI (D)'), Q.format(3, 'DOLI (D)')], 'time'),
    'qalta_garmoni':   ('garmoni', [Q.format(5, 'GARMONI'), Q.format(6, 'GARMONI (D)'), Q.format(7, 'GARMONI (D)')], 'time'),
    's07_doli':        ('doli', ['DOLI_07.wav'], 'time'),
    's07_panduri':     ('panduri', ['FANDURI 2_09.wav'], 'time'),
}
skipped = {'DUDUKI 2(3).wav': 'silent (100 % of 50 ms frames under -60 dBFS)', 'DUDUKI 2(4).wav': '0.7 s of mostly noise'}
manifest = {'sr': SR, 'cut': CUT, 'items': {}, 'skipped': skipped}
for key, (inst, files, split) in plan.items():
    xs = [load(f) for f in files]; n = min(len(x) for x in xs); x = np.sum([a[:n] for a in xs], axis=0).astype('float32')
    np.save(os.path.join(OUT, 'cache', key + '.npy'), x)
    manifest['items'][key] = {'instrument': inst, 'files': files, 'split': split, 'seconds': round(len(x) / SR, 2),
                              'cutSecond': round(len(x) / SR * CUT, 2) if split == 'time' else None, 'peak': float(np.max(np.abs(x)))}
    print(key, inst, split, manifest['items'][key]['seconds'], 's', flush=True)
json.dump(manifest, open(os.path.join(OUT, 'manifest.json'), 'w'), ensure_ascii=False, indent=1)
