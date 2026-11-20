#!/usr/bin/env python3
"""Dataset audit: every WAV in the folder, read as it is (never written to).

Per file: format, length, peak and RMS (dBFS), samples at full scale (clipping), DC offset, the share of
silence, the noise floor and the loudness range (50 ms frames), stereo correlation (a mono recording stored
as stereo shows ~1.0), the frequency under which 99 % of the energy lies (a file that was upsampled has
nothing above its original band), mains hum (50 Hz against its surroundings).
Between files that have the same length (one multitrack session): the correlation of their envelopes and of
their signals — identical copies, the same microphone duplicated, or real separate tracks with bleed.

Usage: python audit.py <dataset dir> <out.json>
"""
import json, os, sys, glob, re
import numpy as np, soundfile as sf
from scipy.signal import resample_poly, welch

DIR, OUT = sys.argv[1], sys.argv[2]
INSTR = [('doli', r'DOLI'), ('garmoni', r'GARMONI'), ('duduki', r'DUDUKI'), ('panduri', r'FANDURI|PANDURI')]

def instrument(name):
    for k, rx in INSTR:
        if re.search(rx, name, re.I): return k
    return None

def db(x): return float(20 * np.log10(max(x, 1e-12)))

def audit(path):
    info = sf.info(path)
    x, sr = sf.read(path, dtype='float32', always_2d=True)
    n, ch = x.shape
    full = 1.0 if info.subtype.startswith('FLOAT') else (2 ** (int(re.sub(r'\D', '', info.subtype) or 16) - 1) - 1) / 2 ** (int(re.sub(r'\D', '', info.subtype) or 16) - 1)
    peak = float(np.max(np.abs(x))) if n else 0.0
    clip = int(np.sum(np.abs(x) >= full - 1e-6))
    over = int(np.sum(np.abs(x) > 1.0))
    mono = x.mean(axis=1)
    fl = int(sr * .05); nf = n // fl
    fr = np.sqrt(np.mean(mono[:nf * fl].reshape(nf, fl) ** 2, axis=1) + 1e-20) if nf else np.array([1e-10])
    frdb = 20 * np.log10(fr)
    silent = float(np.mean(frdb < -60))
    act = fr[frdb >= -60]
    # spectrum of the active part (Welch), mono, up to Nyquist
    f, p = welch(mono, fs=sr, nperseg=8192, noverlap=4096) if n > 8192 else (np.array([0.0]), np.array([1.0]))
    cum = np.cumsum(p) / max(np.sum(p), 1e-30)
    roll99 = float(f[np.searchsorted(cum, .99)]) if len(f) > 1 else None
    roll999 = float(f[np.searchsorted(cum, .999)]) if len(f) > 1 else None
    cen = float(np.sum(f * p) / max(np.sum(p), 1e-30))
    above16 = float(np.sum(p[f > 16000]) / max(np.sum(p), 1e-30)) if sr > 32000 else None
    hum = None
    if len(f) > 1:
        i50 = np.argmin(np.abs(f - 50)); nb = (np.abs(f - 50) > 6) & (np.abs(f - 50) < 25)
        hum = float(10 * np.log10(p[i50] / max(np.median(p[nb]), 1e-30)))
    # harmonic / percussive share (median-filter HPSS, Fitzgerald 2010) on up to 60 s of the loudest part:
    # a drum is mostly percussive, a reed or a voice mostly harmonic — a 'duduki' file that is half percussive is worth a listen
    from scipy.ndimage import median_filter
    from scipy.signal import stft
    seg = mono
    if n > sr * 60:
        k = int(sr * 60); e = np.convolve(mono[::sr // 10] ** 2, np.ones(600), 'valid'); a0 = int(np.argmax(e)) * (sr // 10); seg = mono[a0:a0 + k]
    _, _, Z = stft(seg, fs=sr, nperseg=2048, noverlap=1536); S = np.abs(Z)
    H = median_filter(S, size=(1, 17)); P = median_filter(S, size=(17, 1))
    perc = float(np.sum((P ** 2 / (H ** 2 + P ** 2 + 1e-20)) * S ** 2) / max(np.sum(S ** 2), 1e-30))
    st = None
    if ch == 2:
        L, R = x[:, 0], x[:, 1]
        c = float(np.corrcoef(L, R)[0, 1]) if np.std(L) > 0 and np.std(R) > 0 else None
        st = {'corr': c, 'levelDiffDb': db(np.sqrt(np.mean(L ** 2))) - db(np.sqrt(np.mean(R ** 2))), 'identical': bool(np.array_equal(L, R))}
    return {
        'file': os.path.basename(path), 'instrument': instrument(os.path.basename(path)), 'bytes': os.path.getsize(path),
        'format': info.format, 'subtype': info.subtype, 'sr': sr, 'channels': ch, 'seconds': round(n / sr, 3),
        'peakDbfs': round(db(peak), 2), 'rmsDbfs': round(db(np.sqrt(np.mean(mono ** 2))), 2),
        'activeRmsDbfs': round(db(np.sqrt(np.mean(act ** 2))) if len(act) else -120, 2),
        'clippedSamples': clip, 'overFullScale': over, 'dcOffset': round(float(np.mean(mono)), 6),
        'silentShare': round(silent, 3), 'noiseFloorDbfs': round(float(np.percentile(frdb, 10)), 1),
        'loudnessRangeDb': round(float(np.percentile(frdb, 95) - np.percentile(frdb, 10)), 1),
        'rolloff99Hz': roll99 and round(roll99), 'rolloff999Hz': roll999 and round(roll999), 'centroidHz': round(cen),
        'energyAbove16kHz': above16 and round(above16, 6), 'hum50Db': hum and round(hum, 1), 'percussiveShare': round(perc, 3), 'stereo': st,
    }, x, sr

def env(x, sr, hop=0.05):
    m = x.mean(axis=1) if x.ndim == 2 else x
    h = int(sr * hop); k = len(m) // h
    return np.sqrt(np.mean(m[:k * h].reshape(k, h) ** 2, axis=1) + 1e-20)

files = sorted(glob.glob(os.path.join(DIR, '*.wav')) + glob.glob(os.path.join(DIR, '*.WAV')))
rows, keep = [], {}
for p in files:
    r, x, sr = audit(p); rows.append(r); print(json.dumps(r, ensure_ascii=False), flush=True)
    keep[r['file']] = (x, sr)
# sessions: files of exactly the same length and rate
groups = {}
for r in rows: groups.setdefault((r['sr'], r['seconds']), []).append(r['file'])
sessions = []
for (sr, sec), names in groups.items():
    if len(names) < 2: continue
    pairs = []
    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            a, _ = keep[names[i]]; b, _ = keep[names[j]]
            am, bm = a.mean(axis=1), b.mean(axis=1)
            ea, eb = np.log(env(a, sr)), np.log(env(b, sr))
            pairs.append({'a': names[i], 'b': names[j], 'identical': bool(np.array_equal(a, b)),
                          'signalCorr': round(float(np.corrcoef(am, bm)[0, 1]), 4) if np.std(am) > 0 and np.std(bm) > 0 else None,
                          'envelopeCorr': round(float(np.corrcoef(ea, eb)[0, 1]), 4),
                          'levelDiffDb': round(db(np.sqrt(np.mean(am ** 2))) - db(np.sqrt(np.mean(bm ** 2))), 2)})
    sessions.append({'sr': sr, 'seconds': sec, 'files': names, 'pairs': pairs})
    print(json.dumps(sessions[-1], ensure_ascii=False), flush=True)
json.dump({'dir': DIR, 'files': rows, 'sessions': sessions}, open(OUT, 'w'), ensure_ascii=False, indent=1)
