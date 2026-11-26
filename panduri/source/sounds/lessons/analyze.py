"""Measure a MUSIC recording for a panduri lesson: beats, tempo map, meter, key, chords, melody, sections, strokes.

Several methods per question, compared with each other; where they disagree the place is marked for review.
  beats    essentia RhythmExtractor2013 (multifeature) · librosa beat_track (percussive part) · the app's Studio analysis
  chords   A: bass-root + harmonic template (Demucs bass / mix / vocals) · B: essentia HPCP ChordsDetectionBeats ·
           C: Basic Pitch transcription folded to pitch classes · D: the app's Studio analysis (analysis.draft.json)
  key      essentia KeyExtractor (temperley · krumhansl · edma) · the chord histogram
  melody   pYIN (librosa) · Melodia (essentia PredominantPitchMelodia) · Basic Pitch — on the Demucs vocal stem
  strokes  spectral-flux onsets of the accompaniment (other + bass stems), folded onto the beat

Needs the stems from separate.py. Writes <cache>/<id>/analysis.json; build-data.py turns it into the app's lesson file.
Usage: python analyze.py [--bench] [song-id ...]
"""
import json, os, re, sys, pathlib, collections, warnings
import numpy as np, librosa, soundfile as sf
import essentia.standard as es

warnings.filterwarnings('ignore')
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[3]
MUSIC = pathlib.Path(os.environ.get('PANDURI_MUSIC', ROOT / 'MUSIC'))
CACHE = pathlib.Path(os.environ.get('LESSON_CACHE', HERE / 'cache'))
SR, HOP = 22050, 512
NAMES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B']
ESS_NAMES = {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11}
QUAL = {'': [0, 4, 7], 'm': [0, 3, 7], '7': [0, 4, 7, 10], 'm7': [0, 3, 7, 10], 'maj7': [0, 4, 7, 11], 'dim': [0, 3, 6], 'aug': [0, 4, 8], 'sus4': [0, 5, 7], 'sus2': [0, 2, 7]}
PEN = {'': 0, 'm': 0, '7': .06, 'm7': .06, 'maj7': .07, 'dim': .08, 'aug': .1, 'sus4': .08, 'sus2': .08}
LABELS = [(r, q) for q in QUAL for r in range(12)]


def cname(r, q): return NAMES[r] + q


def parse_chord(s):
    """'B♭m7' / 'Bbm7' / 'A#m' → (root, quality) or None"""
    if not s or s in ('N', 'N.C.'): return None
    s = s.replace('♭', 'b').replace('♯', '#')
    m = re.match(r'^([A-G](?:#|b)?)(.*)$', s)
    if not m or m.group(1) not in ESS_NAMES: return None
    return ESS_NAMES[m.group(1)], m.group(2)


def triad(rq):
    if rq is None: return None
    r, q = rq
    return (r, 'm' if q.startswith('m') and not q.startswith('maj') or q.startswith('dim') else '')


def tname(rq): return None if rq is None else cname(*triad(rq))


# ---------------------------------------------------------------- audio
def stems(sid):
    d = CACHE / sid
    out = {}
    for n in ('mix', 'vocals', 'bass', 'other', 'drums'):
        out[n] = librosa.load(d / (n + '.wav'), sr=SR, mono=True)[0]
    return out


def fscore(ref, est, win=.07):
    ref, est = np.asarray(ref), np.asarray(est)
    if not len(ref) or not len(est): return 0.0
    used, hit = set(), 0
    for r in ref:
        k = int(np.argmin(np.abs(est - r)))
        if abs(est[k] - r) <= win and k not in used: used.add(k); hit += 1
    p, rc = hit / len(est), hit / len(ref)
    return 0.0 if p + rc == 0 else 2 * p * rc / (p + rc)


# ---------------------------------------------------------------- beats, tempo, meter
def beats_of(S, studio):
    y44 = librosa.resample(S['mix'], orig_sr=SR, target_sr=44100).astype(np.float32)
    bpm_e, b_e, conf_e, _, _ = es.RhythmExtractor2013(method='multifeature')(y44)
    b_e = np.asarray(b_e, float)
    _, perc = librosa.effects.hpss(S['mix'])
    env = librosa.onset.onset_strength(y=perc, sr=SR, hop_length=HOP)
    tl, b_l = librosa.beat.beat_track(onset_envelope=env, sr=SR, hop_length=HOP, units='time')
    b_s = np.asarray(studio.get('beatsSeconds') or [], float) if studio else np.array([])
    cands = {'essentia': b_e, 'librosa': np.asarray(b_l, float), 'studio': b_s}
    agree = {}
    for a in cands:
        for b in cands:
            if a < b and len(cands[a]) and len(cands[b]):
                agree[a + '~' + b] = round(fscore(cands[a], cands[b]), 3)
    # the same pulse at another level (double / half / third) counts as agreement on the grid, not on the level
    levels = {}
    for name, est in (('librosa', cands['librosa']), ('studio', cands['studio'])):
        if not len(est): continue
        best = ('1', fscore(b_e, est))
        for lab, ref in (('×2', b_e[::2]), ('×2b', b_e[1::2]), ('×3', b_e[::3]), ('/2', np.sort(np.r_[b_e, (b_e[1:] + b_e[:-1]) / 2]))):
            f = fscore(ref, est)
            if f > best[1] + .05: best = (lab, f)
        levels[name] = {'level': best[0], 'f': round(best[1], 3)}
    return b_e, float(bpm_e), float(conf_e), agree, levels, env


def tempo_map(beats):
    ibi = np.diff(beats)
    bpm = 60 / np.maximum(ibi, 1e-3)
    sm = np.array([np.median(bpm[max(0, i - 4):i + 5]) for i in range(len(bpm))])
    segs, a = [], 0
    for i in range(1, len(sm) + 1):
        if i == len(sm) or abs(sm[i] - np.median(sm[a:i])) / np.median(sm[a:i]) > .045 and i - a >= 8:
            if i < len(sm):
                # a change has to last: the next 8 beats must stay away from the old tempo
                ahead = sm[i:i + 8]
                if len(ahead) < 8 or np.mean(np.abs(ahead - np.median(sm[a:i])) / np.median(sm[a:i]) > .04) < .75: continue
            segs.append({'fromBeat': a, 'toBeat': i, 'bpm': round(float(np.median(sm[a:i])), 2)})
            a = i
    return segs, sm


def subdivision(S, beats):
    """2 (simple) or 3 (compound): where the accompaniment's strokes fall inside the beat (peaks of the folded onsets)"""
    acc = S['other'] + S['bass']
    env = librosa.onset.onset_strength(y=acc, sr=SR, hop_length=128)
    on = librosa.onset.onset_detect(onset_envelope=env, sr=SR, hop_length=128, units='time', delta=.04)
    G = 48
    hist = np.zeros(G)
    for a, b in zip(beats[:-1], beats[1:]):
        for x in on[(on >= a - .02) & (on < b - .02)]:
            hist[int(round((x - a) / (b - a) * G)) % G] += env[min(len(env) - 1, int(x * SR / 128))]
    h = np.convolve(np.r_[hist[-2:], hist, hist[:2]], np.ones(5) / 5, 'same')[2:-2]
    h /= h.max() + 1e-9
    pk = [i / G for i in range(G) if h[i] >= h[i - 1] and h[i] >= h[(i + 1) % G] and h[i] > .15]
    strength = lambda lo, hi: max([float(h[int(round(p * G)) % G]) for p in pk if lo <= p < hi] or [0.0])
    third = min(strength(.25, .46), strength(.58, .76))    # both inner places of a triple beat (the 2nd stroke may come early)
    half = strength(.46, .58)
    quarter = min(strength(.18, .3), strength(.7, .82))
    sub = 3 if third > 0 and third >= half * .7 else 2
    return sub, {'thirds': round(third, 3), 'half': round(half, 3), 'quarters': round(quarter, 3)}, h


def downbeat(S, beats, chords_by_beat, prefer2=False):
    """bar length (2/3/4 beats) and phase: chord changes and bass onsets prefer the bar's first beat"""
    bass_env = librosa.onset.onset_strength(y=S['bass'], sr=SR, hop_length=HOP)
    bt = librosa.time_to_frames(beats, sr=SR, hop_length=HOP)
    bass_at = np.array([bass_env[max(0, f - 2):f + 3].max() if f < len(bass_env) else 0 for f in bt])
    bass_at = bass_at / (bass_at.mean() + 1e-9)
    change = np.array([1.0 if i and chords_by_beat[i] != chords_by_beat[i - 1] else 0.0 for i in range(len(chords_by_beat))] + [0.0])
    res = []
    for g in (2, 3, 4):
        for ph in range(g):
            idx = np.arange(ph, len(beats) - 1, g)
            if len(idx) < 4: continue
            other = np.setdiff1d(np.arange(len(beats) - 1), idx)
            sc = (change[idx].mean() - change[other].mean()) * 1.5 + (bass_at[idx].mean() - bass_at[other].mean()) * .5
            res.append((sc, g, ph))
    res.sort(reverse=True)
    best = res[0]
    if best[1] == 4:   # 4 and 2 with the same phase name the same downbeats (and more): take the shorter bar when it is close
        two = next((r for r in res if r[1] == 2 and r[2] == best[2] % 2), None)
        if two and (prefer2 or two[0] > .75 * best[0]): best = two
    # g=4 and g=2 with the same phase describe the same downbeats; prefer the shorter bar unless 4 is clearly better
    alt = [r for r in res if r[1] != best[1]]
    margin = best[0] - (alt[0][0] if alt else 0)
    return {'beatsPerBar': best[1], 'phase': best[2], 'score': round(float(best[0]), 3), 'margin': round(float(margin), 3),
            'ranking': [{'g': g, 'phase': p, 'score': round(float(s), 3)} for s, g, p in res[:5]]}


# ---------------------------------------------------------------- chords
def _sync(C, edges):
    fr = np.clip(librosa.time_to_frames(edges, sr=SR, hop_length=HOP), 0, C.shape[1] - 1)
    return np.array([C[:, a:max(b, a + 1)].mean(1) for a, b in zip(fr[:-1], fr[1:])]).T


def _bass_chroma(y):
    c = np.abs(librosa.cqt(y, sr=SR, hop_length=HOP, fmin=librosa.note_to_hz('E1'), n_bins=36, bins_per_octave=12)) ** 2
    o, m = np.zeros((12, c.shape[1])), librosa.note_to_midi('E1')
    for k in range(36): o[(m + k) % 12] += c[k]
    return o


class Features:
    def __init__(self, S):
        self.B = _bass_chroma(S['bass'])
        self.M = librosa.feature.chroma_cqt(y=S['mix'], sr=SR, hop_length=HOP, bins_per_octave=36)
        self.V = librosa.feature.chroma_cqt(y=S['vocals'], sr=SR, hop_length=HOP, bins_per_octave=36)
        self.bass_rms = librosa.feature.rms(y=S['bass'], hop_length=HOP)[0]
        self.mix_rms = librosa.feature.rms(y=S['mix'], hop_length=HOP)[0]


def method_a(F, edges, wb=.55, stay=.1):
    """bass root + harmonic template, Viterbi-smoothed. Returns labels per frame and the score margin."""
    B = _sync(F.B, edges); B = B / (B.sum(0, keepdims=True) + 1e-9)
    H = _sync(F.M, edges) + .35 * _sync(F.V, edges); H = H / (H.max(0, keepdims=True) + 1e-9)
    br = _sync(F.bass_rms[None], edges)[0] / (_sync(F.mix_rms[None], edges)[0] + 1e-9)
    wbass = wb * np.clip(br / (np.median(br) + 1e-9), 0, 1.5)   # where the bass is silent its chroma says nothing
    S = []
    for r, q in LABELS:
        t = np.zeros(12); t[[(r + i) % 12 for i in QUAL[q]]] = 1
        S.append((t @ H) / t.sum() - .5 * ((1 - t) @ H) / (12 - t.sum()) + 3 * wbass * B[r] - PEN[q])
    S = np.array(S)
    K, n = S.shape
    dp, bp = S[:, 0].copy(), np.zeros((K, n), int)
    for i in range(1, n):
        bi = dp.argmax(); sw = dp[bi] - stay
        keep = dp >= sw; bp[:, i] = np.where(keep, np.arange(K), bi); dp = np.where(keep, dp, sw) + S[:, i]
    p = [int(dp.argmax())]
    for i in range(n - 1, 0, -1): p.append(int(bp[p[-1], i]))
    p = p[::-1]
    srt = np.sort(S, axis=0)
    margin = srt[-1] - srt[-2]
    # silence: no chord
    lab = [LABELS[k] for k in p]
    rms = _sync(F.mix_rms[None], edges)[0]
    quiet = rms < .08 * np.percentile(rms, 90)
    return [None if quiet[i] else lab[i] for i in range(n)], margin, S


def method_b(S, beats):
    """essentia: HPCP of the accompaniment (mix without vocals), ChordsDetectionBeats"""
    y = (S['mix'] - S['vocals']).astype(np.float32)
    w, spec, peaks = es.Windowing(type='blackmanharris62'), es.Spectrum(), es.SpectralPeaks(orderBy='magnitude', magnitudeThreshold=1e-5, minFrequency=40, maxFrequency=5000, maxPeaks=60)
    hpcp = es.HPCP(size=36, referenceFrequency=440, harmonics=8, bandPreset=True, minFrequency=40, maxFrequency=5000, weightType='cosine', nonLinear=False, windowSize=1.)
    frames = []
    for fr in es.FrameGenerator(y, frameSize=4096, hopSize=2048, startFromZero=True):
        f, m = peaks(spec(w(fr)))
        frames.append(hpcp(f, m))
    frames = np.array(frames, dtype=np.float32)
    ch, st = es.ChordsDetectionBeats(sampleRate=SR, hopSize=2048, chromaPick='interbeat_median')(frames, np.asarray(beats, np.float32))
    out = []
    for c in ch:
        c = c.replace('m', 'm') if c else c
        out.append(parse_chord(c) if c and c != 'N' else None)
    return out, list(map(float, st))


_BP = {}


def basic_pitch(path):
    if path in _BP: return _BP[path]
    from basic_pitch.inference import predict
    from basic_pitch import ICASSP_2022_MODEL_PATH
    _, _, notes = predict(str(path), ICASSP_2022_MODEL_PATH)
    _BP[path] = [(float(s), float(e), int(p), float(a)) for s, e, p, a, *_ in notes]
    return _BP[path]


def method_c(notes, edges):
    """Basic Pitch notes (accompaniment), duration × amplitude per pitch class, the lowest note weighted as the bass"""
    out = []
    for a, b in zip(edges[:-1], edges[1:]):
        pc, low = np.zeros(12), None
        for s, e, p, amp in notes:
            ov = min(e, b) - max(s, a)
            if ov <= 0: continue
            pc[p % 12] += ov * amp
            if low is None or p < low[0]: low = (p, ov * amp)
        if pc.sum() < 1e-3: out.append(None); continue
        pc = pc / pc.max()
        best = None
        for r, q in LABELS:
            if q not in ('', 'm', '7', 'm7'): continue
            t = np.zeros(12); t[[(r + i) % 12 for i in QUAL[q]]] = 1
            sc = (t @ pc) / t.sum() - .5 * ((1 - t) @ pc) / (12 - t.sum()) - PEN[q] + (.25 if low and low[0] % 12 == r else 0)
            if best is None or sc > best[0]: best = (sc, (r, q))
        out.append(best[1])
    return out


def method_d(studio, edges):
    if not studio or not studio.get('chords'): return [None] * (len(edges) - 1)
    out = []
    for a, b in zip(edges[:-1], edges[1:]):
        mid = (a + b) / 2
        c = next((x for x in studio['chords'] if x['fromSeconds'] <= mid < x['toSeconds']), None)
        out.append(parse_chord(c['chord']) if c and c.get('chord') else None)
    return out


def consensus(A, Bm, C, Dm):
    """per beat: the triad most methods hear (weights A .4 · B .2 · C .2 · D .2); the full chord from A when its triad wins"""
    W = (.4, .2, .2, .2)
    out = []
    for i in range(len(A)):
        votes = collections.defaultdict(float)
        for w, m in zip(W, (A, Bm, C, Dm)):
            v = triad(m[i]) if m[i] else None
            if v: votes[v] += w
        if not votes: out.append((None, 0.0, {})); continue
        tri, sc = max(votes.items(), key=lambda kv: kv[1])
        full = A[i] if A[i] and triad(A[i]) == tri else tri
        out.append((full, round(sc / sum(W), 2), {k: (tname(m[i]) if m[i] else None) for k, m in zip('ABCD', (A, Bm, C, Dm))}))
    return out


def smooth_rare(names, frac=.015):
    cnt = collections.Counter(n for n in names if n)
    rare = lambda n: n and cnt[n] < max(2, len(names) * frac)
    out = list(names)
    for k in range(len(out)):
        if rare(out[k]):
            j = k - 1
            while j >= 0 and (rare(out[j]) or not out[j]): j -= 1
            out[k] = out[j] if j >= 0 else None
    return out


def half_beat_changes(F, beats, per_beat):
    """chords that change in the middle of a beat: method A on half beats, believed where both halves are clear"""
    half = np.sort(np.r_[beats, (beats[1:] + beats[:-1]) / 2])
    lab, margin, _ = method_a(F, half, stay=.05)
    out = []
    for i in range(len(per_beat)):
        a, b = 2 * i, 2 * i + 1
        if b >= len(lab): break
        la, lb = tname(lab[a]), tname(lab[b])
        if la and lb and la != lb and margin[a] > .04 and margin[b] > .04:
            cur = per_beat[i]
            nxt = per_beat[i + 1] if i + 1 < len(per_beat) else None
            tn = lambda n: tname(parse_chord(n)) if n else None
            if nxt and cur != nxt and la == tn(cur) and lb == tn(nxt): out.append((i, half[b]))
    return out


def refine_time(t, onsets, win):
    if not len(onsets): return t
    k = int(np.argmin(np.abs(onsets - t)))
    return float(onsets[k]) if abs(onsets[k] - t) <= win else t


def find_cycle(seq, max_p=16):
    idx = [k for k, n in enumerate(seq) if n]
    if len(idx) < 8: return None
    best = None
    for P in range(1, min(max_p, len(seq) // 3) + 1):
        cnt = [collections.Counter() for _ in range(P)]
        for k in idx: cnt[k % P][seq[k]] += 1
        modes = [c.most_common(1)[0][0] if c else None for c in cnt]
        agree = sum(seq[k] == modes[k % P] for k in idx) / len(idx)
        sc = agree - .006 * P
        if best is None or sc > best['score'] + 1e-9: best = {'P': P, 'modes': modes, 'agree': agree, 'score': sc}
    for d in range(1, best['P']):
        if best['P'] % d == 0 and all(m == best['modes'][i % d] for i, m in enumerate(best['modes'])):
            best = dict(best, P=d, modes=best['modes'][:d]); break
    return best


def chart(names, max_p=16):
    """the chart a panduri player keeps: the song's cycle where it follows it (±W beats agree ≥ 40 %), a stretch with a
    clear cycle of its own keeps that one, the rest keeps the measured chord and is marked unsure. ailesson.js chart()."""
    n = len(names)
    cyc = find_cycle(names, max_p)
    out, how = list(names), ['measured'] * n
    if not cyc or cyc['agree'] < .45 or cyc['P'] < 2: return out, how, cyc
    P, M = cyc['P'], cyc['modes']
    at = lambda k: M[k % P]
    W = max(8, 2 * P)
    use = [False] * n
    for k in range(n):
        lo, hi = max(0, k - W), min(n, k + W + 1)
        tot = sum(1 for j in range(lo, hi) if names[j]); ok = sum(1 for j in range(lo, hi) if names[j] and names[j] == at(j))
        if tot and ok / tot >= .4: out[k], how[k], use[k] = at(k), 'cycle', True
    k = 0
    while k < n:
        if use[k]: k += 1; continue
        e = k
        while e < n and not use[e]: e += 1
        L = find_cycle(names[k:e], max_p) if e - k >= 6 else None
        if L and L['agree'] >= .8 and L['P'] > 1 and len(set(L['modes'])) > 1 and sorted(L['modes']) != sorted(M):
            for j in range(k, e): out[j], how[j] = L['modes'][(j - k) % L['P']], 'local-cycle'
        else:
            for j in range(k, e): how[j] = 'unsure'
        k = e
    return out, how, cyc


# ---------------------------------------------------------------- key
def key_of(S, chords):
    y = librosa.resample(S['mix'] - S['vocals'] * .5, orig_sr=SR, target_sr=44100).astype(np.float32)
    res = {}
    for prof in ('temperley', 'krumhansl', 'edma'):
        k, sc, st = es.KeyExtractor(profileType=prof)(y)
        res[prof] = {'key': k + ('m' if sc == 'minor' else ''), 'strength': round(float(st), 3)}
    # the chord histogram: the tonic is the chord heard most, weighted toward phrase ends
    cnt = collections.Counter(c for c in chords if c)
    res['chords'] = {'key': cnt.most_common(1)[0][0] if cnt else None}
    votes = collections.Counter(v['key'] for v in res.values() if v['key'])
    key, n = votes.most_common(1)[0]
    norm = lambda s: s.replace('#', '♯').replace('Bb', 'B♭').replace('Eb', 'E♭').replace('Ab', 'A♭')
    return {'key': norm(key), 'agree': n, 'of': len(res), 'methods': {k: dict(v, key=norm(v['key']) if v['key'] else None) for k, v in res.items()}}


# ---------------------------------------------------------------- melody
def f0_notes(t, midi, voiced, min_dur=.09):
    notes, cur = [], []
    def flush():
        if len(cur) >= 2:
            ts = [x[0] for x in cur]; ps = np.array([x[1] for x in cur])
            if ts[-1] - ts[0] + (t[1] - t[0]) >= min_dur:
                notes.append([round(float(ts[0]), 3), round(float(ts[-1] + (t[1] - t[0]) - ts[0]), 3), int(round(np.median(ps)))])
    for i in range(len(t)):
        if not voiced[i] or not np.isfinite(midi[i]):
            flush(); cur = []; continue
        if cur and abs(midi[i] - np.median([x[1] for x in cur[-5:]])) > .75:
            flush(); cur = []
        cur.append((t[i], midi[i]))
    flush()
    return notes


def melody(S, vocal_path, stem='vocals'):
    y = S[stem]
    f0, vf, vp = librosa.pyin(y, fmin=70, fmax=1100, sr=SR, frame_length=2048, hop_length=HOP)
    t = librosa.times_like(f0, sr=SR, hop_length=HOP)
    m_p = librosa.hz_to_midi(np.where(vf, f0, np.nan))
    m_p = np.array(m_p); fin = np.isfinite(m_p)
    import scipy.ndimage as nd
    m_s = m_p.copy(); m_s[fin] = nd.median_filter(np.nan_to_num(m_p, nan=0), 5)[fin]
    n_p = f0_notes(t, m_s, vf & (vp > .12))
    y44 = librosa.resample(y, orig_sr=SR, target_sr=44100).astype(np.float32)
    pm, _ = es.PredominantPitchMelodia(frameSize=2048, hopSize=128, guessUnvoiced=False)(es.EqualLoudness()(y44))
    pm = np.asarray(pm); tm = np.arange(len(pm)) * 128 / 44100
    m_m = np.where(pm > 0, librosa.hz_to_midi(np.maximum(pm, 1e-3)), np.nan)
    bp = [n for n in basic_pitch(vocal_path) if n[3] > .25]
    out = []
    for s, d, p in n_p:
        e = s + d
        sel = (tm >= s) & (tm < e) & np.isfinite(m_m)
        mel = float(np.mean(np.abs(m_m[sel] - p) <= .6)) if sel.sum() else 0.0
        mel_oct = float(np.mean(np.abs(((m_m[sel] - p + 6) % 12) - 6) <= .6)) if sel.sum() else 0.0
        bpm = 0.0
        for bs, be, bpp, amp in bp:
            ov = min(be, e) - max(bs, s)
            if ov > .5 * d and (bpp == p or abs(bpp - p) == 12): bpm = 1.0 if bpp == p else .6; break
        conf = round((mel + bpm) / 2, 2)
        out.append({'t': s, 'd': d, 'm': p, 'conf': conf, 'melodia': round(mel, 2), 'melodiaOctave': round(mel_oct, 2), 'basicPitch': bpm})
    return out


# ---------------------------------------------------------------- sections
def vocal_activity(S, beats):
    v = librosa.feature.rms(y=S['vocals'], hop_length=HOP)[0]
    m = librosa.feature.rms(y=S['mix'], hop_length=HOP)[0]
    rel = _sync((v / (m + 1e-9))[None], beats)[0]
    lev = _sync(v[None], beats)[0]
    thr = max(.18, .35 * np.percentile(rel, 90))
    on = (rel > thr) & (lev > .05 * np.percentile(lev, 95))
    # a short gap inside singing (a breath) is still singing; a short burst alone is not
    on = on.astype(int)
    for _ in range(2):
        for i in range(1, len(on) - 1):
            if on[i - 1] == on[i + 1] != on[i]: on[i] = on[i - 1]
    return on.astype(bool), rel


def sections(on, chords, bpb):
    n = len(on)
    runs, a = [], 0
    for i in range(1, n + 1):
        if i == n or on[i] != on[a]: runs.append([bool(on[a]), a, i]); a = i
    # runs shorter than a bar join their neighbour
    merged = []
    for r in runs:
        if merged and (r[2] - r[1] < max(2, bpb)): merged[-1][2] = r[2]
        else: merged.append(r)
    first_v = next((i for i, r in enumerate(merged) if r[0]), None)
    last_v = max((i for i, r in enumerate(merged) if r[0]), default=None)
    out, letters, sigs = [], {}, []
    def sig(a, b):
        return tuple(c for c in chords[a:b] if c)
    for i, (voc, a, b) in enumerate(merged):
        if first_v is None: kind = 'inst'
        elif i < first_v: kind = 'intro'
        elif i > last_v: kind = 'outro'
        else: kind = 'verse' if voc else 'inst'
        out.append({'kind': kind, 'from': a, 'to': b})
    # sung parts with the same chord sequence get the same letter (A, B …); which one is the refrain is not heard — review
    for s in out:
        if s['kind'] != 'verse': continue
        cs = sig(s['from'], s['to'])
        best = None
        for L, ref in letters.items():
            m = min(len(cs), len(ref))
            if m and sum(x == y for x, y in zip(cs[:m], ref[:m])) / m > .7: best = L; break
        if best is None: best = chr(65 + len(letters)); letters[best] = cs
        s['letter'] = best
    return out


# ---------------------------------------------------------------- strokes
def strokes(S, beats, sections_, sub):
    acc = S['other'] + S['bass']
    env = librosa.onset.onset_strength(y=acc, sr=SR, hop_length=128)
    t = librosa.frames_to_time(np.arange(len(env)), sr=SR, hop_length=128)
    on = librosa.onset.onset_detect(onset_envelope=env, sr=SR, hop_length=128, units='time', backtrack=False, delta=.04)
    G = 48
    def fold(a_beat, b_beat):
        hist = np.zeros(G); cnt = 0
        for k in range(a_beat, min(b_beat, len(beats) - 1)):
            a, b = beats[k], beats[k + 1]
            for x in on[(on >= a - .02) & (on < b - .02)]:
                ph = int(round((x - a) / (b - a) * G)) % G
                fi = min(len(env) - 1, int(x * SR / 128))
                hist[ph] += env[fi]; cnt += 1
        return hist, cnt
    def peaks(hist):
        h = np.convolve(np.r_[hist[-2:], hist, hist[:2]], np.ones(5) / 5, 'same')[2:-2]
        if h.max() <= 0: return []
        pk = [i for i in range(G) if h[i] >= h[i - 1] and h[i] >= h[(i + 1) % G] and h[i] > .22 * h.max()]
        pk = sorted(pk, key=lambda i: -h[i])[:6]
        return sorted([{'pos': round(i / G, 3), 'strength': round(float(h[i] / h.max()), 3)} for i in pk], key=lambda x: x['pos'])
    whole, _ = fold(0, len(beats) - 1)
    out = {'whole': peaks(whole), 'sections': []}
    for s in sections_:
        h, c = fold(s['from'], s['to'])
        out['sections'].append({'from': s['from'], 'to': s['to'], 'onsets': c, 'grid': peaks(h)})
    return out


def tushuri_timing(grid):
    """↓ ↑ · : the two strongest stroke places in the beat and the gap after them, as fractions of the beat"""
    if len(grid) < 2: return None
    two = sorted(sorted(grid, key=lambda g: -g['strength'])[:2], key=lambda g: g['pos'])
    a, b = two[0]['pos'], two[1]['pos']
    d1, d2 = (b - a) % 1, (1 - (b - a)) % 1
    return {'down': round(a, 3), 'up': round(b, 3), 'downToUp': round(d1, 3), 'upToNextDown': round(d2, 3)}


# ---------------------------------------------------------------- one song
def analyze(item):
    sid = item['id']
    folder = MUSIC / item['folder']
    studio = json.load(open(folder / 'analysis.draft.json')) if (folder / 'analysis.draft.json').exists() else None
    if item.get('studioFile'): studio = json.load(open(folder / item['studioFile']))
    S = stems(sid)
    dur = len(S['mix']) / SR
    beats, bpm_e, conf_e, beat_agree, levels, _ = beats_of(S, studio)
    level_note = None
    if bpm_e > 150:
        benv = librosa.onset.onset_strength(y=S['bass'] + S['other'], sr=SR, hop_length=HOP)
        fr = np.clip(librosa.time_to_frames(beats, sr=SR, hop_length=HOP), 0, len(benv) - 1)
        ph = int(np.argmax([benv[fr[p::2]].mean() for p in (0, 1)]))
        beats = beats[ph::2]; bpm_e = bpm_e / 2; level_note = 'halved from ' + str(round(bpm_e * 2, 1))
    st_bpm = (studio or {}).get('estimatedBpm')
    tempo_review = None
    if st_bpm:
        ratio = bpm_e / st_bpm
        if not (.93 < ratio < 1.07 or 1.86 < ratio < 2.14 or .47 < ratio < .54):
            tempo_review = {'what': 'tempo-level', 'note': 'essentia %.1f BPM vs Studio %.1f BPM (ratio %.2f): the beat level may be a triple/compound grouping' % (bpm_e, st_bpm, ratio)}
    tsegs, _ = tempo_map(beats)
    sub, subd, _ = subdivision(S, beats)
    F = Features(S)
    A, marginA, _ = method_a(F, beats)
    Bm, _ = method_b(S, beats)
    acc_path = CACHE / sid / 'accomp.wav'
    if not acc_path.exists(): sf.write(acc_path, S['other'] + S['bass'], SR, subtype='PCM_16')
    C = method_c([n for n in basic_pitch(acc_path) if n[3] > .2], beats)
    Dm = method_d(studio, beats)
    cons = consensus(A, Bm, C, Dm)
    names = smooth_rare([cname(*c[0]) if c[0] else None for c in cons])
    conf = [c[1] for c in cons]
    for k in range(1, len(names) - 1):   # one unsure beat between two beats of the same chord is that chord
        if names[k - 1] and names[k - 1] == names[k + 1] != names[k] and conf[k] < .6: names[k] = names[k - 1]
    pair = lambda X, Y: round(float(np.mean([tname(x) == tname(y) for x, y in zip(X, Y) if x and y])), 3) if any(x and y for x, y in zip(X, Y)) else None
    method_agree = {'A~B': pair(A, Bm), 'A~C': pair(A, C), 'A~D': pair(A, Dm), 'B~C': pair(Bm, C), 'B~D': pair(Bm, Dm), 'C~D': pair(C, Dm)}
    meter = downbeat(S, beats, [tname(parse_chord(n)) if n else None for n in names], prefer2=sub == 3)
    # chord changes as times: on the beat, refined to the bass/accompaniment onset nearest to it; mid-beat changes kept
    acc_on = librosa.onset.onset_detect(y=S['other'] + S['bass'], sr=SR, hop_length=HOP, units='time', backtrack=True)
    mids = dict(half_beat_changes(F, beats, names))
    events = []
    for i, n in enumerate(names):
        if i and n == names[i - 1]: continue
        ibi = float(beats[min(i + 1, len(beats) - 1)] - beats[max(i - 1, 0)]) / 2 or .5
        if i and (i - 1) in mids:   # heard changing half way through the beat before
            events.append({'beat': i - .5, 't': round(refine_time(float(mids[i - 1]), acc_on, .1 * ibi), 3), 'chord': n, 'conf': conf[i], 'mid': True})
        else:
            events.append({'beat': float(i), 't': round(refine_time(float(beats[i]), acc_on, .12 * ibi), 3), 'chord': n, 'conf': conf[i]})
    events.sort(key=lambda e: e['t'])
    for k, e in enumerate(events):
        e['end'] = events[k + 1]['t'] if k + 1 < len(events) else round(float(beats[-1]), 3)
    on, rel = vocal_activity(S, beats)
    secs = sections(on, names, meter['beatsPerBar'])
    charted, how, cyc = chart(names)
    st = strokes(S, beats, secs, sub)
    key = key_of(S, names)
    sung = float(np.mean(on)) if len(on) else 0
    mel_stem = 'vocals' if sung >= .2 else 'other'
    mel = melody(S, CACHE / sid / (mel_stem + '.wav'), mel_stem)
    # review: beats where the chord methods disagree, runs of at least a bar
    low = [i for i, c in enumerate(conf) if c < .6]
    review = []
    for i in low:
        if review and i - review[-1]['toBeat'] <= 1: review[-1]['toBeat'] = i + 1
        else: review.append({'fromBeat': i, 'toBeat': i + 1})
    review = [r for r in review if r['toBeat'] - r['fromBeat'] >= max(2, meter['beatsPerBar'])]
    for r in review:
        r['from'] = round(float(beats[r['fromBeat']]), 3); r['to'] = round(float(beats[min(r['toBeat'], len(beats) - 1)]), 3)
        r['what'] = 'chords'
        r['heard'] = collections.Counter(tuple(sorted(set(v for v in cons[i][2].values() if v))) for i in range(r['fromBeat'], r['toBeat'])).most_common(2)
    return {
        'id': sid, 'durationSeconds': round(dur, 3),
        'beats': [round(float(b), 3) for b in beats], 'bpm': round(bpm_e, 2), 'beatConfidence': round(conf_e, 3),
        'beatAgreement': beat_agree, 'beatLevels': levels, 'tempoSegments': tsegs,
        'subdivision': sub, 'subdivisionEvidence': subd, 'meter': meter,
        'key': key, 'chordsPerBeat': names, 'chartPerBeat': charted, 'chartHow': how, 'chordConfidence': conf, 'chordMethodAgreement': method_agree,
        'chordVotes': [c[2] for c in cons], 'chordEvents': events, 'cycle': {k: cyc[k] for k in ('P', 'modes', 'agree')} if cyc else None,
        'vocalPerBeat': [bool(x) for x in on], 'sections': secs, 'strokes': st,
        'tushuri': [dict(tushuri_timing(s['grid']) or {}, fromBeat=s['from'], toBeat=s['to']) for s in st['sections']] if (item.get('hint') or {}).get('rhythm') == 'tushuri' else None,
        'melody': mel, 'melodyStem': mel_stem, 'beatLevelNote': level_note, 'review': review + ([dict(tempo_review, **{'from': 0, 'to': round(dur, 3)})] if tempo_review else []),
        'methods': {'beats': ['essentia RhythmExtractor2013 multifeature', 'librosa beat_track (HPSS percussive)', 'Studio (analysis.draft.json)'],
                    'chords': ['A bass-root + harmonic template, Viterbi (Demucs stems)', 'B essentia HPCP + ChordsDetectionBeats', 'C Basic Pitch notes → pitch classes', 'D Studio'],
                    'key': ['essentia KeyExtractor temperley/krumhansl/edma', 'chord histogram'],
                    'melody': ['librosa pYIN on Demucs vocals', 'essentia PredominantPitchMelodia', 'Basic Pitch']}
    }


def bench(res):
    """Bani-Acharuli: the teacher's chart and the beat map in songdata.js are the truth"""
    src = open(HERE.parents[1] / 'src' / 'songdata.js').read()
    tb = np.array([float(x) for x in re.search(r'beats: \[([^\]]+)\]', src).group(1).replace('\n', '').split(',') if x.strip()])
    cyc = ['Dm', 'Dm', 'B♭', 'C']
    est = np.array(res['beats'])
    out = {'beatF': round(fscore(tb, est), 3)}
    # chords measured against the teacher's cycle on his own beat map
    names = res['chordsPerBeat']
    ok = tot = 0
    secs = [["intro", 0, 44], ["verse", 44, 96], ["inst", 96, 124], ["verse", 124, 176], ["inst", 176, 200], ["verse", 200, 272], ["inst", 272, 364], ["verse", 364, 400], ["outro", 400, 464]]
    per = collections.defaultdict(lambda: [0, 0])
    for i in range(len(tb) - 1):
        mid = (tb[i] + tb[i + 1]) / 2
        k = int(np.searchsorted(est, mid)) - 1
        if k < 0 or k >= len(names): continue
        want, got = cyc[i % 4], tname(parse_chord(names[k])) if names[k] else None
        kind = next(s[0] for s in secs if s[1] <= i < s[2])
        per[kind][0] += want == got; per[kind][1] += 1
        ok += want == got; tot += 1
    out['chordAgreementWithTeacher'] = round(ok / tot, 3)
    ch = res['chartPerBeat']; ok2 = tot2 = 0
    for i in range(len(tb) - 1):
        k = int(np.searchsorted(est, (tb[i] + tb[i + 1]) / 2)) - 1
        if 0 <= k < len(ch): ok2 += cyc[i % 4] == (tname(parse_chord(ch[k])) if ch[k] else None); tot2 += 1
    out['chartAgreementWithTeacher'] = round(ok2 / tot2, 3)
    hw = res['chartHow']; okc = totc = 0
    for i in range(len(tb) - 1):
        k = int(np.searchsorted(est, (tb[i] + tb[i + 1]) / 2)) - 1
        if 0 <= k < len(ch) and hw[k] == 'cycle': okc += cyc[i % 4] == (tname(parse_chord(ch[k])) if ch[k] else None); totc += 1
    out['chartPrecisionWhereConfident'] = round(okc / max(1, totc), 3); out['confidentShare'] = round(totc / max(1, tot2), 3)
    out['cycle'] = res['cycle']; out['meter'] = res['meter']['beatsPerBar']; out['subdivision'] = res['subdivision']
    out['bySection'] = {k: round(a / b, 3) for k, (a, b) in per.items()}
    return out


def main():
    args = sys.argv[1:]
    do_bench = '--bench' in args; args = [a for a in args if a != '--bench']
    man = json.load(open(HERE / 'songs.json'))
    items = man['songs'] + ([dict(man['benchmark'], studioFile='analysis-original.draft.json')] if do_bench else [])
    for it in items:
        if args and it['id'] not in args: continue
        if do_bench and it['id'] != 'bani-acharuli' and not args: continue
        res = analyze(it)
        if it['id'] == 'bani-acharuli': res['benchmark'] = bench(res); print(json.dumps(res['benchmark'], ensure_ascii=False))
        json.dump(res, open(CACHE / it['id'] / 'analysis.json', 'w'), ensure_ascii=False)
        print(it['id'], res['bpm'], res['key']['key'], 'meter', res['meter']['beatsPerBar'], 'sub', res['subdivision'], 'agree', res['chordMethodAgreement'], 'review', len(res['review']), flush=True)


if __name__ == '__main__':
    main()
