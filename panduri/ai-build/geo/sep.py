#!/usr/bin/env python3
"""Georgian instrument separation — prototype: doli · garmoni · duduki · panduri.

A small mask network on the spectrogram (Open-Unmix-like: a dense layer, a 3-layer BiLSTM, four soft masks that
sum to one), trained on mixtures made on the fly from the owner's own isolated recordings (prep.py). Nothing is
renamed: every estimate is the mixture's spectrogram times a mask the network computed, and every number below is
measured against the real track of that instrument.

Measured against, on the same test material:
  mix      the mixture itself as the estimate of every instrument (what "no separation" scores)
  nmf      supervised NMF: 32 spectral templates per instrument learned from the training audio, Wiener masks
  model    this network
  oracle   the ideal ratio mask from the true tracks — the ceiling for any mask on this spectrogram
Tests:
  A  unseen recordings, all four instruments at equal loudness, 8 s mixtures (garmoni: the held-out last 35 % of
     its only session — the same player and room, so its number is optimistic)
  B  real ensembles, time-held-out: QALTA XEVSURULI (doli + garmoni, recorded together) and the DOLI_07 /
     FANDURI 2_09 session (doli + panduri), at their own levels
Usage: python sep.py <work dir> train [minutes] | eval | all [minutes]
"""
import json, os, sys, time, math
import numpy as np, soundfile as sf, torch, torch.nn as nn

WORK = sys.argv[1]; CMD = sys.argv[2] if len(sys.argv) > 2 else 'all'; MINUTES = float(sys.argv[3]) if len(sys.argv) > 3 else 30
LEVEL = os.environ.get('LEVEL')   # dBFS: the mixture is shown to the network at this RMS (masks still go on the mixture as it is)
SRCLV = [float(v) for v in os.environ.get('SRCLV', '-30,-16').split(',')]   # each instrument's loudness in a training mixture, dBFS
SRC = ['doli', 'garmoni', 'duduki', 'panduri']; SR = 44100; NFFT = 2048; HOP = 512; F = NFFT // 2 + 1
dev = torch.device('mps' if torch.backends.mps.is_available() else 'cpu')
man = json.load(open(os.path.join(WORK, 'manifest.json')))
cache = {k: np.load(os.path.join(WORK, 'cache', k + '.npy'), mmap_mode='r') for k in man['items']}
torch.manual_seed(0); np.random.seed(0)
WIN = torch.hann_window(NFFT)

def stft(x):   # x: [B, T] (cpu or device) -> complex [B, F, frames]
    return torch.stft(x, NFFT, HOP, window=WIN.to(x.device), return_complex=True, center=True)
def istft(X, n):
    return torch.istft(X, NFFT, HOP, window=WIN.to(X.device), length=n, center=True)

# the held-out time of the sessions used both ways. QALTA: its last 35 %. Session 07: the panduri plays only from 20 s to
# 160 s, so its test is the last part of the time both play (111–160 s); everything before and after is training.
def test_window(k):
    n = len(cache[k])
    if k.startswith('s07_'): return int(111 * SR), int(160 * SR)
    return int(n * man['cut']), n

def ranges(split, unseen=False):
    """per instrument: (key, a, b) sample ranges usable for this split. unseen: only recordings the model never heard
    (the garmoni has none: its held-out time is used, and the report says so)"""
    out = {s: [] for s in SRC}
    for k, it in man['items'].items():
        n = len(cache[k]); a, b = test_window(k)
        if split == 'train' and it['split'] == 'train': out[it['instrument']].append((k, 0, n))
        if split == 'train' and it['split'] == 'time': out[it['instrument']] += [(k, 0, a)] + ([(k, b, n)] if b < n else [])
        if split == 'test' and it['split'] == 'test': out[it['instrument']].append((k, 0, n))
        if split == 'test' and it['split'] == 'time' and (not unseen or it['instrument'] == 'garmoni'): out[it['instrument']].append((k, a, b))
    return out

def active_starts(rng, seg, thr_db=-50, step=None):
    """starts of seg-long windows whose RMS is over thr_db (dBFS): silence teaches nothing"""
    step = step or seg // 4; res = []
    for k, a, b in rng:
        x = cache[k]
        for s in range(a, b - seg, step):
            w = np.asarray(x[s:s + seg]); r = float(np.sqrt(np.mean(w * w) + 1e-20))
            if 20 * math.log10(r) > thr_db: res.append((k, s))
    return res

def norm(w, db):
    r = float(np.sqrt(np.mean(w * w) + 1e-20)); return w * (10 ** (db / 20) / r)

class Net(nn.Module):
    def __init__(s, F=F, h=256, S=4):
        super().__init__(); s.S = S
        s.mean = nn.Parameter(torch.zeros(F), requires_grad=False); s.std = nn.Parameter(torch.ones(F), requires_grad=False)
        s.fc1 = nn.Linear(F, h); s.bn1 = nn.BatchNorm1d(h)
        s.lstm = nn.LSTM(h, h // 2, num_layers=3, bidirectional=True, batch_first=True, dropout=.3)
        s.fc2 = nn.Linear(2 * h, h); s.bn2 = nn.BatchNorm1d(h); s.fc3 = nn.Linear(h, S * F)
    def forward(s, mag):   # mag [B, F, T] -> masks [B, S, F, T]
        B, Fq, T = mag.shape
        x = (torch.log1p(mag).transpose(1, 2) - s.mean) / s.std          # [B, T, F]
        x = torch.tanh(s.bn1(s.fc1(x).transpose(1, 2)).transpose(1, 2))
        y, _ = s.lstm(x); x = torch.cat([x, y], -1)
        x = torch.relu(s.bn2(s.fc2(x).transpose(1, 2)).transpose(1, 2))
        m = s.fc3(x).view(B, T, s.S, Fq).permute(0, 2, 3, 1)
        return torch.softmax(m, dim=1)

def batch(pools, B, seg, rng):
    """B mixtures of seg samples; each instrument present with p=.8 (at least one), loudness -30…-16 dBFS"""
    X = np.zeros((B, seg), 'float32'); Y = np.zeros((B, 4, seg), 'float32')
    for b in range(B):
        on = rng.random(4) < .8
        if not on.any(): on[rng.integers(4)] = True
        for i, s in enumerate(SRC):
            if not on[i] or not pools[s]: continue
            k, st = pools[s][rng.integers(len(pools[s]))]
            w = norm(np.asarray(cache[k][st:st + seg], dtype='float32'), rng.uniform(*SRCLV)) * (1 if rng.random() < .5 else -1)
            Y[b, i] = w
        X[b] = Y[b].sum(0)
        pk = np.max(np.abs(X[b]))
        if pk > .99: X[b] /= pk / .99; Y[b] /= pk / .99
    return torch.from_numpy(X), torch.from_numpy(Y)

def train(minutes):
    seg = SR * 4; rng = np.random.default_rng(1)
    pools = {s: active_starts(r, seg) for s, r in ranges('train').items()}
    print('train windows:', {s: len(v) for s, v in pools.items()}, flush=True)
    net = Net().to(dev)
    # input statistics from training mixtures
    with torch.no_grad():
        X, _ = batch(pools, 64, seg, rng); g0 = 10 ** (float(LEVEL) / 20) / (X.pow(2).mean(1, keepdim=True).sqrt() + 1e-8) if LEVEL else 1.0
        L = torch.log1p(stft(X * g0).abs())
        net.mean.data = L.mean((0, 2)).to(dev); net.std.data = (L.std((0, 2)) + 1e-3).to(dev)
    opt = torch.optim.AdamW(net.parameters(), 1e-3, weight_decay=1e-5)
    t0 = time.time(); step = 0; hist = []; ema = None
    end = t0 + minutes * 60
    while time.time() < end:
        X, Y = batch(pools, 16, seg, rng)
        Xs = stft(X.to(dev)); M = Xs.abs(); Ys = stft(Y.to(dev).view(-1, seg)).abs().view(16, 4, F, -1)
        g = (10 ** (float(LEVEL) / 20) / (X.to(dev).pow(2).mean(1).sqrt() + 1e-8))[:, None, None] if LEVEL else 1.0
        masks = net(M * g)
        loss = (masks * M.unsqueeze(1) + 1e-8).pow(.3).sub((Ys + 1e-8).pow(.3)).abs().mean()
        opt.zero_grad(); loss.backward(); nn.utils.clip_grad_norm_(net.parameters(), 5); opt.step()
        step += 1; ema = loss.item() if ema is None else .98 * ema + .02 * loss.item()
        if step % 200 == 0:
            el = time.time() - t0; hist.append({'step': step, 'sec': round(el), 'loss': round(ema, 5)}); print(json.dumps(hist[-1]), flush=True)
            if el > minutes * 60 * .7 and opt.param_groups[0]['lr'] > 3e-4: opt.param_groups[0]['lr'] = 3e-4
    torch.save({'state': net.state_dict(), 'level': LEVEL, 'srclv': SRCLV, 'steps': step, 'seconds': round(time.time() - t0), 'hist': hist, 'params': sum(p.numel() for p in net.parameters())}, os.path.join(WORK, 'model.pt'))
    print('saved', step, 'steps', flush=True)

# ---------- separation ----------
def run_model(net, x):
    """x: 1-D numpy mixture -> [4, n] estimates (mixture phase, the network's masks), in 30 s chunks with 2 s overlap"""
    n = len(x); out = np.zeros((4, n), 'float32'); wsum = np.zeros(n, 'float32'); C, O = SR * 30, SR * 2
    starts = list(range(0, max(1, n - O), C - O))
    for s in starts:
        w = torch.from_numpy(np.ascontiguousarray(x[s:s + C], dtype='float32')).to(dev)[None]; m = w.shape[1]
        with torch.no_grad():
            X = stft(w); g = 10 ** (float(LEVEL) / 20) / (w.pow(2).mean().sqrt() + 1e-8) if LEVEL else 1.0
            masks = net(X.abs() * g)
            est = istft((masks * X.unsqueeze(1)).view(4, F, -1), m).cpu().numpy()
        fade = np.ones(m, 'float32')
        if s > 0: fade[:O] = np.linspace(0, 1, O)
        if s + C < n: fade[-O:] = np.linspace(1, 0, O)
        out[:, s:s + m] += est * fade; wsum[s:s + m] += fade
    return out / np.maximum(wsum, 1e-6)

class NMF:
    """supervised NMF (KL): K templates per instrument from training spectrograms; mixture -> activations -> Wiener masks"""
    def __init__(s, K=32, frames=12000, iters=150):
        rng = np.random.default_rng(2); pools = {k: active_starts(v, SR * 4) for k, v in ranges('train').items()}; Ws = []
        for i, src in enumerate(SRC):
            ms = []
            for j in rng.permutation(len(pools[src]))[:frames // 345 + 1]:
                k, st = pools[src][j]; ms.append(stft(torch.from_numpy(np.asarray(cache[k][st:st + SR * 4], 'float32'))[None]).abs()[0])
            V = torch.cat(ms, 1).to(dev) + 1e-9
            W = torch.rand(F, K, device=dev) + .1; H = torch.rand(K, V.shape[1], device=dev) + .1
            for _ in range(iters):
                H *= (W.T @ (V / (W @ H))) / W.sum(0)[:, None]; W *= ((V / (W @ H)) @ H.T) / H.sum(1)[None]
                nrm = W.sum(0); W /= nrm; H *= nrm[:, None]
            Ws.append(W)
        s.W = torch.cat(Ws, 1); s.K = K
    def __call__(s, x):
        X = stft(torch.from_numpy(np.ascontiguousarray(x, 'float32'))[None].to(dev))[0]; V = X.abs() + 1e-9
        H = torch.rand(s.W.shape[1], V.shape[1], device=dev) + .1
        for _ in range(100): H *= (s.W.T @ (V / (s.W @ H))) / s.W.sum(0)[:, None]
        P = torch.stack([(s.W[:, i * s.K:(i + 1) * s.K] @ H[i * s.K:(i + 1) * s.K]) ** 2 for i in range(4)])
        M = P / (P.sum(0) + 1e-20)
        return istft(M * X[None], len(x)).cpu().numpy()

def oracle(x, refs):
    X = stft(torch.from_numpy(np.ascontiguousarray(x, 'float32'))[None])[0]
    P = torch.stack([stft(torch.from_numpy(np.ascontiguousarray(r, 'float32'))[None])[0].abs() ** 2 for r in refs])
    return istft(P / (P.sum(0) + 1e-20) * X[None], len(x)).numpy()

def sdr(r, e):
    return float(10 * np.log10(np.sum(r * r) / max(np.sum((r - e) ** 2), 1e-20)))
def sisdr(r, e):
    a = np.dot(e, r) / max(np.dot(r, r), 1e-20); t = a * r; return float(10 * np.log10(np.sum(t * t) / max(np.sum((e - t) ** 2), 1e-20)))

def save(path, x):
    os.makedirs(os.path.dirname(path), exist_ok=True); sf.write(path, np.clip(x, -1, 1), SR, subtype='PCM_24')

def evaluate():
    ck = torch.load(os.path.join(WORK, 'model.pt'), map_location='cpu'); net = Net(); net.load_state_dict(ck['state']); net.to(dev).eval()
    print('model:', ck['steps'], 'steps,', ck['seconds'], 's of training,', ck['params'], 'parameters', flush=True)
    nmf = NMF(); rng = np.random.default_rng(7); LIS = os.path.join(WORK, 'listen'); res = {'model': {k: ck[k] for k in ('steps', 'seconds', 'params')}}
    meths = {'mix': lambda x, refs: np.stack([x] * 4), 'nmf': lambda x, refs: nmf(x), 'model': lambda x, refs: run_model(net, x), 'oracle': oracle}
    # ----- A: unseen recordings, four at once, equal loudness -----
    seg = SR * 8; pools = {s: active_starts(r, seg, -45, SR) for s, r in ranges('test', unseen=True).items()}
    print('test A windows:', {s: len(v) for s, v in pools.items()}, flush=True)
    A = {m: {s: {'sdr': [], 'sisdr': []} for s in SRC} for m in meths}
    cross = np.zeros((40, 4, 4))   # model: SDR of estimate i against the true track of instrument j — a renamed stem would light up off the diagonal
    for t in range(40):
        refs = []
        for s in SRC:
            k, st = pools[s][rng.integers(len(pools[s]))]; refs.append(norm(np.asarray(cache[k][st:st + seg], 'float32'), -23))
        refs = np.stack(refs); x = refs.sum(0); pk = np.max(np.abs(x))
        if pk > .99: x /= pk / .99; refs /= pk / .99
        for m, fn in meths.items():
            est = fn(x, refs)
            for i, s in enumerate(SRC): A[m][s]['sdr'].append(sdr(refs[i], est[i])); A[m][s]['sisdr'].append(sisdr(refs[i], est[i]))
            if m == 'model': cross[t] = [[sdr(refs[j], est[i]) for j in range(4)] for i in range(4)]
            if t < 3 and m == 'model':
                save(f'{LIS}/A{t + 1:02d}_mix.wav', x)
                for i, s in enumerate(SRC): save(f'{LIS}/A{t + 1:02d}_{s}_model.wav', est[i]); save(f'{LIS}/A{t + 1:02d}_{s}_true.wav', refs[i])
            if t < 3 and m == 'nmf':
                for i, s in enumerate(SRC): save(f'{LIS}/A{t + 1:02d}_{s}_nmf.wav', est[i])
        print('A', t + 1, json.dumps({s: round(A['model'][s]['sdr'][-1], 1) for s in SRC}), flush=True)
    res['A_cross'] = {'rows': 'estimate', 'cols': 'true track', 'order': SRC, 'medianSDR': np.round(np.median(cross, 0), 2).tolist()}
    res['A'] = {m: {s: {'medianSDR': round(float(np.median(v['sdr'])), 2), 'medianSISDR': round(float(np.median(v['sisdr'])), 2), 'n': len(v['sdr'])} for s, v in d.items()} for m, d in A.items()}
    # ----- B: real ensembles, the held-out part, their own levels -----
    res['B'] = {}
    for name, pair in [('qalta_xevsuruli', ('qalta_doli', 'qalta_garmoni')), ('session_07', ('s07_doli', 's07_panduri'))]:
        a0, b0 = test_window(pair[0])
        tr = {man['items'][k]['instrument']: np.asarray(cache[k][a0:b0], 'float32') for k in pair}
        x = sum(tr.values()); refs = np.stack([tr.get(s, np.zeros_like(x)) for s in SRC])
        row = {}
        for m, fn in meths.items():
            est = fn(x, refs) if m != 'oracle' else oracle(x, refs)
            # per 8 s window where that instrument is really playing (-45 dBFS), the median
            per = {}
            for i, s in enumerate(SRC):
                if s not in tr: per[s] = {'absentLeakDb': round(float(10 * np.log10(np.sum(est[i] ** 2) / max(np.sum(x ** 2), 1e-20))), 1)}; continue
                v = []
                for a in range(0, len(x) - seg, seg):
                    r = refs[i, a:a + seg]
                    if 20 * np.log10(np.sqrt(np.mean(r * r)) + 1e-12) > -45: v.append(sdr(r, est[i, a:a + seg]))
                per[s] = {'medianSDR': round(float(np.median(v)), 2), 'windows': len(v)}
            row[m] = per
            if m in ('model', 'nmf'):
                a0 = int(len(x) * .3); a1 = a0 + SR * 30
                if m == 'model': save(f'{LIS}/B_{name}_mix.wav', x[a0:a1])
                for i, s in enumerate(SRC):
                    save(f'{LIS}/B_{name}_{s}_{m}.wav', est[i, a0:a1])
                    if m == 'model' and s in tr: save(f'{LIS}/B_{name}_{s}_true.wav', refs[i, a0:a1])
        res['B'][name] = row; print('B', name, json.dumps({m: row[m] for m in ('mix', 'model')}), flush=True)
    # ----- a 60 s song from unseen material: the instruments come in one by one -----
    parts = []
    for i, s in enumerate(SRC[::-1]):   # panduri, duduki, garmoni, doli
        k, st = pools[s][rng.integers(len(pools[s]))]; w = np.zeros(SR * 60, 'float32')
        src = norm(np.asarray(cache[k][st:st + SR * 8], 'float32'), -24); a = SR * 15 * i
        reps = np.tile(src, int(np.ceil((SR * 60 - a) / len(src))))[:SR * 60 - a]; w[a:] = reps; parts.append((s, w))
    refs = np.stack([dict(parts)[s] for s in SRC]); x = refs.sum(0); x /= max(1, np.max(np.abs(x)) / .99); est = run_model(net, x)
    save(f'{LIS}/song_all4_mix.wav', x)
    for i, s in enumerate(SRC): save(f'{LIS}/song_all4_{s}_model.wav', est[i])
    json.dump(res, open(os.path.join(WORK, 'results.json'), 'w'), indent=1)
    print(json.dumps(res['A'], indent=0)[:3000], flush=True)

if CMD in ('train', 'all'): train(MINUTES)
if CMD in ('eval', 'all'): evaluate()
