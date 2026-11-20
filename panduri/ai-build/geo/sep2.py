#!/usr/bin/env python3
"""Georgian instrument separation — round 2: a strict comparison and what improves it.

Protocol (fixed before any round-2 number was seen; docs/studio3/GEORGIAN-SEPARATION.md §8):
  F1  selection fold — every variant and every hybrid weight is chosen here only
  F2  locked test fold — other sessions; run once, at the end, for the chosen method and the baselines
  Rule: the method with the highest worst-instrument median SDR on F1 (equal-loudness four-instrument mixtures)
        wins; within 0.2 dB, the higher mean over the four.
Every network is retrained under the fold it is measured on, for the same minutes. The two existing models
(model.pt = v1, v2/model.pt) are also measured as they are, on F1, where only their garmoni is not unseen.

Variants:
  nmf     supervised KL-NMF, 32 templates per instrument (baseline)
  v1      round-1 network: log-magnitude in, 4 soft masks; mixture shown at -18 dBFS at inference
  v2      v1 trained with that level normalisation and a wider loudness range
  v3      harmonic/percussive aware: the mixture is split by median-filter HPSS; the network sees the mixture,
          its harmonic and its percussive part, and gives every instrument one mask on the harmonic part and one on
          the percussive part (transients for doli and panduri, sustained partials for garmoni and duduki);
          loss = compressed-magnitude L1 + SI-SDR on the waveform; random EQ per source (microphones and rooms
          differ: the doli recordings' 99 % bands go from 0.6 to 3.9 kHz)
  v3o     v3 with a fifth class, 'other' (Georgian voices, a piano), so a voice has somewhere to go
  hybrid  per instrument: magnitude = a·network + (1-a)·NMF, Wiener-normalised; a chosen on F1
Usage:
  python sep2.py <work> train <fold> <variant> <minutes> [fraction] [name]
  python sep2.py <work> eval <fold> <name,name,...>        (names: nmf, v1, v2, v3, v3o, asis_v1, asis_v2, hybrid:<net>)
  python sep2.py <work> select                             (hybrid weights on F1)
  python sep2.py <work> listen <fold> <name,...>           (WAVs + blind listening kit)
"""
import json, os, sys, time, math, random
import numpy as np, soundfile as sf, torch, torch.nn as nn, torch.nn.functional as Fn
from scipy.signal import lfilter

WORK = sys.argv[1]; CMD = sys.argv[2]
SRC = ['doli', 'garmoni', 'duduki', 'panduri']; SR = 44100; NFFT = 2048; HOP = 512; F = NFFT // 2 + 1
dev = torch.device('mps' if torch.backends.mps.is_available() else 'cpu')
man = json.load(open(os.path.join(WORK, 'manifest.json')))
_cache = {}
def C(k):
    if k not in _cache: _cache[k] = np.load(os.path.join(WORK, 'cache', k + '.npy'), mmap_mode='r')
    return _cache[k]
WIN = torch.hann_window(NFFT)
R2 = os.path.join(WORK, 'round2'); os.makedirs(R2, exist_ok=True)

FOLDS = {
    'F1': {'train': {'doli': ['doli_satrfialo', 'doli_yazbeguri3', 'qalta_doli', 's07_doli'], 'garmoni': ['qalta_garmoni_56'], 'duduki': ['duduki_kintauri'], 'panduri': ['s07_panduri']},
           'test': {'doli': ['doli_main'], 'garmoni': ['qalta_garmoni_7'], 'duduki': ['duduki_2', 'duduki_2b', 'duduki_3'], 'panduri': ['panduri_d02', 'panduri_25']}, 'ensembles': []},
    'F2': {'train': {'doli': ['doli_main', 'doli_yazbeguri3'], 'garmoni': ['qalta_garmoni_7'], 'duduki': ['duduki_2', 'duduki_2b', 'duduki_3'], 'panduri': ['panduri_d02', 'panduri_25']},
           'test': {'doli': ['doli_satrfialo', 's07_doli', 'qalta_doli'], 'garmoni': ['qalta_garmoni_56'], 'duduki': ['duduki_kintauri'], 'panduri': ['s07_panduri']},
           'ensembles': [('qalta_xevsuruli', {'doli': 'qalta_doli', 'garmoni': 'qalta_garmoni_56'}, None), ('session_07', {'doli': 's07_doli', 'panduri': 's07_panduri'}, (20, 160))]},
}
OTHER = {'train': [('other_vocal', 0, .65), ('other_piano', 0, .65)], 'test': [('other_vocal', .65, 1)]}

def stft(x): return torch.stft(x, NFFT, HOP, window=WIN.to(x.device), return_complex=True, center=True)
def istft(X, n): return torch.istft(X, NFFT, HOP, window=WIN.to(X.device), length=n, center=True)
def norm(w, db): r = float(np.sqrt(np.mean(w * w) + 1e-20)); return w * (10 ** (db / 20) / r)
def rms_db(w): return 20 * math.log10(float(np.sqrt(np.mean(np.asarray(w, 'float64') ** 2))) + 1e-12)

def windows(keys, seg, thr=-50, step=SR, frac=1.0, span=None):
    """(key, start) of seg-long windows with RMS over thr dBFS. frac < 1 keeps the first part of every recording (less
    recording, not a random thinning). span: (a, b) as fractions of the recording."""
    out = []
    for k in keys:
        x = C(k); n = len(x); a0, b0 = (int(n * span[0]), int(n * span[1])) if span else (0, n); b0 = a0 + int((b0 - a0) * frac)
        for s in range(a0, b0 - seg, step):
            if rms_db(x[s:s + seg]) > thr: out.append((k, s))
    return out

# ---------------- networks ----------------
class Net(nn.Module):   # round-1 architecture (v1, v2): its state dicts load as they are
    # forward(mag, mh=None): mh is ignored (it has no harmonic/percussive input)
    def __init__(s, F=F, h=256, S=4):
        super().__init__(); s.S = S
        s.mean = nn.Parameter(torch.zeros(F), requires_grad=False); s.std = nn.Parameter(torch.ones(F), requires_grad=False)
        s.fc1 = nn.Linear(F, h); s.bn1 = nn.BatchNorm1d(h)
        s.lstm = nn.LSTM(h, h // 2, num_layers=3, bidirectional=True, batch_first=True, dropout=.3)
        s.fc2 = nn.Linear(2 * h, h); s.bn2 = nn.BatchNorm1d(h); s.fc3 = nn.Linear(h, S * F)
    def forward(s, mag, mh=None):
        B, Fq, T = mag.shape
        x = (torch.log1p(mag).transpose(1, 2) - s.mean) / s.std
        x = torch.tanh(s.bn1(s.fc1(x).transpose(1, 2)).transpose(1, 2)); y, _ = s.lstm(x); x = torch.cat([x, y], -1)
        x = torch.relu(s.bn2(s.fc2(x).transpose(1, 2)).transpose(1, 2))
        return torch.softmax(s.fc3(x).view(B, T, s.S, Fq).permute(0, 2, 3, 1), dim=1)
    def masks(s, mag): return s(mag)

from scipy.ndimage import median_filter
def hpss_np(M, k=17):
    """median-filter HPSS (Fitzgerald 2010) of one magnitude [F, T]: the soft mask of the harmonic part (CPU — on Apple's
    GPU torch's median takes ~7 s a batch)"""
    H = median_filter(M, size=(1, k), mode='nearest'); P = median_filter(M, size=(k, 1), mode='nearest')
    return (H * H / (H * H + P * P + 1e-12)).astype('float32')
def hpss_t(mag):   # [B, F, T] tensor (any device) -> mh on the same device
    m = mag.detach().float().cpu().numpy(); return torch.from_numpy(np.stack([hpss_np(x) for x in m])).to(mag.device)

class Net3(nn.Module):
    def __init__(s, F=F, h=256, S=4):
        super().__init__(); s.S = S
        s.mean = nn.Parameter(torch.zeros(3 * F), requires_grad=False); s.std = nn.Parameter(torch.ones(3 * F), requires_grad=False)
        s.fc1 = nn.Linear(3 * F, h); s.bn1 = nn.BatchNorm1d(h)
        s.lstm = nn.LSTM(h, h // 2, num_layers=3, bidirectional=True, batch_first=True, dropout=.3)
        s.fc2 = nn.Linear(2 * h, h); s.bn2 = nn.BatchNorm1d(h); s.fc3 = nn.Linear(h, 2 * S * F)
    def feats(s, mag, mh=None):
        mh = hpss_t(mag) if mh is None else mh; mp = 1 - mh
        return torch.cat([torch.log1p(mag), torch.log1p(mag * mh), torch.log1p(mag * mp)], 1), mh, mp
    def forward(s, mag, mh=None):
        B, Fq, T = mag.shape; f, mh, mp = s.feats(mag, mh)
        x = (f.transpose(1, 2) - s.mean) / s.std
        x = torch.tanh(s.bn1(s.fc1(x).transpose(1, 2)).transpose(1, 2)); y, _ = s.lstm(x); x = torch.cat([x, y], -1)
        x = torch.relu(s.bn2(s.fc2(x).transpose(1, 2)).transpose(1, 2))
        m = torch.softmax(s.fc3(x).view(B, T, 2, s.S, Fq).permute(0, 2, 3, 4, 1), dim=2)   # [B, 2, S, F, T]
        return m[:, 0] * mh.unsqueeze(1) + m[:, 1] * mp.unsqueeze(1)                        # sums to 1 over S
    def masks(s, mag): return s(mag)

CFG = {   # variant -> training recipe
    'v1': dict(net='Net', level_train=False, srclv=(-30, -16), sisdr=0.0, eq=False, other=False),
    'v2': dict(net='Net', level_train=True, srclv=(-40, -12), sisdr=0.0, eq=False, other=False),
    'v3': dict(net='Net3', level_train=True, srclv=(-36, -12), sisdr=0.002, eq=True, other=False),
    'v3o': dict(net='Net3', level_train=True, srclv=(-36, -12), sisdr=0.002, eq=True, other=True),
}
LEVEL = -18.0

def rand_eq(w, rng):
    """a random microphone/room colour: a first-order low and high shelf, each ±6 dB, corners 150–600 Hz and 2–6 kHz"""
    out = w
    for kind in ('low', 'high'):
        g = 10 ** (rng.uniform(-6, 6) / 20); fc = rng.uniform(150, 600) if kind == 'low' else rng.uniform(2000, 6000)
        a = math.exp(-2 * math.pi * fc / SR)
        lp = lfilter([1 - a], [1, -a], out)   # one-pole low-pass
        out = (out + (g - 1) * lp) if kind == 'low' else (g * out + (1 - g) * lp)
    return out.astype('float32')

def make_batch(pools, B, seg, rng, cfg, opool=None):
    S = 5 if cfg['other'] else 4
    X = np.zeros((B, seg), 'float32'); Y = np.zeros((B, S, seg), 'float32')
    for b in range(B):
        on = rng.random(4) < .8
        if not on.any(): on[rng.integers(4)] = True
        for i, s in enumerate(SRC):
            if not on[i]: continue
            k, st = pools[s][rng.integers(len(pools[s]))]; w = np.asarray(C(k)[st:st + seg], 'float32')
            if cfg['eq']: w = rand_eq(w, rng)
            Y[b, i] = norm(w, rng.uniform(*cfg['srclv'])) * (1 if rng.random() < .5 else -1)
        if S == 5 and rng.random() < .35:
            k, st = opool[rng.integers(len(opool))]; w = np.asarray(C(k)[st:st + seg], 'float32')
            Y[b, 4] = norm(rand_eq(w, rng), rng.uniform(*cfg['srclv']))
        X[b] = Y[b].sum(0); pk = np.max(np.abs(X[b]))
        if pk > .99: X[b] /= pk / .99; Y[b] /= pk / .99
    return torch.from_numpy(X), torch.from_numpy(Y)

class Batches(torch.utils.data.IterableDataset):
    def __init__(s, pools, opool, cfg, seg, B): super().__init__(); s.a = (pools, opool, cfg, seg, B)
    def __iter__(s):
        pools, opool, cfg, seg, B = s.a; wi = torch.utils.data.get_worker_info(); torch.set_num_threads(1)
        rng = np.random.default_rng(1000 + (wi.id if wi else 0) + int(time.time() * 1000) % 100000)
        while True:
            X, Y = make_batch(pools, B, seg, rng, cfg, opool)
            mh = torch.from_numpy(np.stack([hpss_np(m) for m in stft(X).abs().numpy()])).half() if cfg['net'] == 'Net3' else torch.zeros(1)
            yield X, Y, mh

def build(cfg, S):
    return (Net3 if cfg['net'] == 'Net3' else Net)(S=S)

def sisdr_t(r, e):
    a = (e * r).sum(-1, keepdim=True) / ((r * r).sum(-1, keepdim=True) + 1e-8); t = a * r
    return 10 * torch.log10((t * t).sum(-1) / ((e - t) ** 2).sum(-1).clamp_min(1e-8) + 1e-8)

def train(fold, variant, minutes, frac=1.0, name=None):
    cfg = CFG[variant]; name = name or f'{fold}_{variant}' + (f'_f{int(frac * 100)}' if frac < 1 else ''); S = 5 if cfg['other'] else 4
    seg = SR * 4; rng = np.random.default_rng(11); torch.manual_seed(11)
    pools = {s: windows(FOLDS[fold]['train'][s], seg, frac=frac) for s in SRC}
    opool = [w for k, a, b in OTHER['train'] for w in windows([k], seg, span=(a, b))] if cfg['other'] else None
    print(name, 'train windows:', {s: len(v) for s, v in pools.items()}, 'other:', len(opool) if opool else 0, flush=True)
    net = build(cfg, S).to(dev)
    with torch.no_grad():
        X, _ = make_batch(pools, 48, seg, rng, cfg, opool)
        g0 = 10 ** (LEVEL / 20) / (X.pow(2).mean(1, keepdim=True).sqrt() + 1e-8) if cfg['level_train'] else 1.0
        M = stft(X * g0).abs().to(dev)
        f = net.feats(M)[0] if cfg['net'] == 'Net3' else torch.log1p(M)
        net.mean.data = f.mean((0, 2)); net.std.data = f.std((0, 2)) + 1e-3
    opt = torch.optim.AdamW(net.parameters(), 1e-3, weight_decay=1e-5); step = 0; ema = None; hist = []
    dl = iter(torch.utils.data.DataLoader(Batches(pools, opool, cfg, seg, 16), batch_size=None, num_workers=7, prefetch_factor=3, persistent_workers=True))
    t0 = time.time()
    while time.time() - t0 < minutes * 60:
        X, Y, MH = next(dl); X = X.to(dev); Y = Y.to(dev); MH = MH.float().to(dev) if cfg['net'] == 'Net3' else None
        Xs = stft(X); M = Xs.abs(); Ys = stft(Y.view(-1, seg)).view(16, S, F, -1)
        g = (10 ** (LEVEL / 20) / (X.pow(2).mean(1).sqrt() + 1e-8))[:, None, None] if cfg['level_train'] else 1.0
        m = net(M * g, MH)
        loss = (m * M.unsqueeze(1) + 1e-8).pow(.3).sub((Ys.abs() + 1e-8).pow(.3)).abs().mean()
        if cfg['sisdr'] > 0:
            est = istft((m * Xs.unsqueeze(1)).reshape(-1, F, Xs.shape[-1]), seg).view(16, S, seg)
            present = (Y.pow(2).mean(-1) > 1e-7).float()
            loss = loss - cfg['sisdr'] * (sisdr_t(Y, est) * present).sum() / present.sum().clamp_min(1)
        opt.zero_grad(); loss.backward(); nn.utils.clip_grad_norm_(net.parameters(), 5); opt.step()
        step += 1; ema = loss.item() if ema is None else .98 * ema + .02 * loss.item()
        if step % 200 == 0:
            el = time.time() - t0; hist.append({'step': step, 'sec': round(el), 'loss': round(ema, 5)}); print(name, json.dumps(hist[-1]), flush=True)
            if el > minutes * 60 * .7 and opt.param_groups[0]['lr'] > 3e-4: opt.param_groups[0]['lr'] = 3e-4
    torch.save({'state': net.state_dict(), 'variant': variant, 'fold': fold, 'frac': frac, 'S': S, 'steps': step, 'seconds': round(time.time() - t0), 'hist': hist,
                'params': sum(p.numel() for p in net.parameters()), 'trainSeconds': {s: len(v) for s, v in pools.items()}}, os.path.join(R2, name + '.pt'))
    print(name, 'saved', step, 'steps', flush=True)

# ---------------- separation ----------------
def load_net(name):
    if name in ('asis_v1', 'asis_v2'):
        ck = torch.load(os.path.join(WORK, 'model.pt' if name == 'asis_v1' else 'v2/model.pt'), map_location='cpu'); net = Net(); net.load_state_dict(ck['state']); S = 4
    else:
        ck = torch.load(os.path.join(R2, name + '.pt'), map_location='cpu'); cfg = CFG[ck['variant']]; S = ck['S']; net = build(cfg, S); net.load_state_dict(ck['state'])
    return net.to(dev).eval(), S, ck

def sep_net(net, S, x):
    """[S, n] — the mixture shown at -18 dBFS, masks applied to the mixture itself; 30 s chunks, 2 s cross-fade"""
    n = len(x); out = np.zeros((S, n), 'float32'); ws = np.zeros(n, 'float32'); Cn, O = SR * 30, SR * 2
    for s in range(0, max(1, n - O), Cn - O):
        w = torch.from_numpy(np.ascontiguousarray(x[s:s + Cn], 'float32')).to(dev)[None]; m = w.shape[1]
        with torch.no_grad():
            X = stft(w); g = 10 ** (LEVEL / 20) / (w.pow(2).mean().sqrt() + 1e-8)
            est = istft((net(X.abs() * g) * X.unsqueeze(1)).view(S, F, -1), m).cpu().numpy()
        fade = np.ones(m, 'float32')
        if s > 0: fade[:O] = np.linspace(0, 1, O)
        if s + Cn < n: fade[-O:] = np.linspace(1, 0, O)
        out[:, s:s + m] += est * fade; ws[s:s + m] += fade
    return out / np.maximum(ws, 1e-6)

class NMF:
    def __init__(s, fold, K=32, iters=150):
        path = os.path.join(R2, f'{fold}_nmf.pt')
        if os.path.exists(path): s.W = torch.load(path).to(dev); s.K = K; return
        rng = np.random.default_rng(2); Ws = []
        for src in SRC:
            pool = windows(FOLDS[fold]['train'][src], SR * 4); ms = []
            for j in rng.permutation(len(pool))[:36]:
                k, st = pool[j]; ms.append(stft(torch.from_numpy(np.asarray(C(k)[st:st + SR * 4], 'float32'))[None]).abs()[0])
            V = torch.cat(ms, 1).to(dev) + 1e-9; W = torch.rand(F, K, device=dev) + .1; H = torch.rand(K, V.shape[1], device=dev) + .1
            for _ in range(iters):
                H *= (W.T @ (V / (W @ H))) / W.sum(0)[:, None]; W *= ((V / (W @ H)) @ H.T) / H.sum(1)[None]; nr = W.sum(0); W /= nr; H *= nr[:, None]
            Ws.append(W)
        s.W = torch.cat(Ws, 1); s.K = K; torch.save(s.W.cpu(), path)
    def mags(s, X):
        V = X.abs() + 1e-9; torch.manual_seed(0); H = torch.rand(s.W.shape[1], V.shape[1]).to(dev) + .1
        for _ in range(100): H *= (s.W.T @ (V / (s.W @ H))) / s.W.sum(0)[:, None]
        return torch.stack([s.W[:, i * s.K:(i + 1) * s.K] @ H[i * s.K:(i + 1) * s.K] for i in range(4)])
    def __call__(s, x):
        X = stft(torch.from_numpy(np.ascontiguousarray(x, 'float32'))[None].to(dev))[0]; P = s.mags(X) ** 2
        return istft(P / (P.sum(0) + 1e-20) * X[None], len(x)).cpu().numpy()

def hybrid(est_net, est_nmf, x, alpha):
    """per instrument: |S_i| = a_i·|net_i| + (1-a_i)·|nmf_i|, Wiener-normalised over the four (+ the net's 'other')"""
    X = stft(torch.from_numpy(np.ascontiguousarray(x, 'float32'))[None])[0]
    An = stft(torch.from_numpy(np.ascontiguousarray(est_net, 'float32'))).abs(); Am = stft(torch.from_numpy(np.ascontiguousarray(est_nmf, 'float32'))).abs()
    A = [alpha[i] * An[i] + (1 - alpha[i]) * Am[i] for i in range(4)] + ([An[4]] if An.shape[0] > 4 else [])
    P = torch.stack(A) ** 2; return istft(P / (P.sum(0) + 1e-20) * X[None], len(x)).numpy()

def oracle(x, refs):
    X = stft(torch.from_numpy(np.ascontiguousarray(x, 'float32'))[None])[0]
    P = torch.stack([stft(torch.from_numpy(np.ascontiguousarray(r, 'float32'))[None])[0].abs() ** 2 for r in refs])
    return istft(P / (P.sum(0) + 1e-20) * X[None], len(x)).numpy()

def sdr(r, e): return float(10 * np.log10(np.sum(r * r) / max(np.sum((r - e) ** 2), 1e-20)))
def sisdr(r, e):
    a = np.dot(e, r) / max(np.dot(r, r), 1e-20); t = a * r; return float(10 * np.log10(np.sum(t * t) / max(np.sum((e - t) ** 2), 1e-20)))

# ---------------- test sets (identical for every method) ----------------
def test_sets(fold):
    seg = SR * 8; rng = np.random.default_rng(101); T = FOLDS[fold]['test']
    pools = {s: windows(T[s], seg, thr=-45) for s in SRC}; vpool = windows([OTHER['test'][0][0]], seg, thr=-45, span=OTHER['test'][0][1:])
    pick = lambda s: (lambda ks: np.asarray(C(ks[0])[ks[1]:ks[1] + seg], 'float32'))(pools[s][rng.integers(len(pools[s]))])
    sets = {'eq': [], 'var': [], 'voc': [], 'solo': []}
    for _ in range(40): sets['eq'].append(np.stack([norm(pick(s), -23) for s in SRC]))
    for _ in range(40):
        lv = rng.uniform(-8, 8, 4); g = rng.uniform(-20, 8); sets['var'].append(np.stack([norm(pick(s), -23 + lv[i] + g) for i, s in enumerate(SRC)]))
    for _ in range(20):
        k, st = vpool[rng.integers(len(vpool))]; sets['voc'].append((np.stack([norm(pick(s), -23) for s in SRC]), norm(np.asarray(C(k)[st:st + seg], 'float32'), -23)))
    for i, s in enumerate(SRC):
        for _ in range(10): sets['solo'].append((i, norm(pick(s), -23)))
    for _ in range(10):
        k, st = vpool[rng.integers(len(vpool))]; sets['solo'].append((4, norm(np.asarray(C(k)[st:st + seg], 'float32'), -23)))
    return sets, pools

def fit(refs, x):
    pk = np.max(np.abs(x)); f = max(1, pk / .99); return refs / f, x / f

def evaluate(fold, names, alpha=None, keep=None):
    sets, pools = test_sets(fold); res = {}; nmf = NMF(fold); nets = {}
    def run(name, x):
        if name == 'nmf': return nmf(x)
        if name.startswith('hybrid:'):
            base = name.split(':')[1]; e = run(base, x); return hybrid(e, nmf(x), x, alpha)
        if name not in nets: nets[name] = load_net(name)
        net, S, _ = nets[name]; return sep_net(net, S, x)
    for name in names:
        t0 = time.time(); r = {}
        for key in ('eq', 'var'):
            d = {s: {'sdr': [], 'sisdr': []} for s in SRC}
            for refs in sets[key]:
                refs, x = fit(refs, refs.sum(0)); e = run(name, x)
                for i, s in enumerate(SRC): d[s]['sdr'].append(sdr(refs[i], e[i])); d[s]['sisdr'].append(sisdr(refs[i], e[i]))
            r[key] = {s: {'medianSDR': round(float(np.median(v['sdr'])), 2), 'medianSISDR': round(float(np.median(v['sisdr'])), 2), 'q25': round(float(np.percentile(v['sdr'], 25)), 2), 'q75': round(float(np.percentile(v['sdr'], 75)), 2)} for s, v in d.items()}
            if keep is not None and key == 'eq': keep[name] = d
        # a voice in the mixture: the four still measured; and where a voice alone ends up
        d = {s: [] for s in SRC}
        for refs, v in sets['voc']:
            refs, x = fit(refs, refs.sum(0) + v); e = run(name, x)
            for i, s in enumerate(SRC): d[s].append(sdr(refs[i], e[i]))
        r['voc'] = {s: round(float(np.median(v)), 2) for s, v in d.items()}
        # leakage: one source alone -> the share of its energy in every output stem
        L = np.zeros((5, 5)); cnt = np.zeros(5)
        for i, w in sets['solo']:
            e = run(name, w); en = np.array([float(np.sum(z * z)) for z in e]); en = en / max(en.sum(), 1e-20)
            L[i, :len(en)] += en; cnt[i] += 1
        L = L / cnt[:, None]; r['leak'] = {'rows': SRC + ['voice'], 'cols': SRC + ['other'], 'share': np.round(L, 3).tolist()}
        # real ensembles (F2): the whole held-out session, 8 s windows where the instrument plays
        r['ens'] = {}
        for ename, pair, span in FOLDS[fold]['ensembles']:
            n = min(len(C(k)) for k in pair.values()); a, b = (int(span[0] * SR), int(span[1] * SR)) if span else (0, n)
            tr = {s: np.asarray(C(k)[a:b], 'float32') for s, k in pair.items()}; x = sum(tr.values()); e = run(name, x); row = {}
            for i, s in enumerate(SRC):
                if s not in tr: row[s] = {'leakDb': round(float(10 * np.log10(np.sum(e[i] ** 2) / max(np.sum(x ** 2), 1e-20) + 1e-30)), 1)}; continue
                v = [sdr(tr[s][w:w + SR * 8], e[i, w:w + SR * 8]) for w in range(0, len(x) - SR * 8, SR * 8) if rms_db(tr[s][w:w + SR * 8]) > -45]
                vi = [sisdr(tr[s][w:w + SR * 8], e[i, w:w + SR * 8]) for w in range(0, len(x) - SR * 8, SR * 8) if rms_db(tr[s][w:w + SR * 8]) > -45]
                row[s] = {'medianSDR': round(float(np.median(v)), 2), 'medianSISDR': round(float(np.median(vi)), 2), 'windows': len(v)}
            r['ens'][ename] = row
        r['seconds'] = round(time.time() - t0); res[name] = r
        print(fold, name, 'eq', json.dumps({s: r['eq'][s]['medianSDR'] for s in SRC}), 'var', json.dumps({s: r['var'][s]['medianSDR'] for s in SRC}), 'voc', json.dumps(r['voc']), flush=True)
    return res

def oracle_eval(fold):
    sets, _ = test_sets(fold); d = {s: [] for s in SRC}
    for refs in sets['eq']:
        refs, x = fit(refs, refs.sum(0)); e = oracle(x, refs)
        for i, s in enumerate(SRC): d[s].append(sdr(refs[i], e[i]))
    return {s: round(float(np.median(v)), 2) for s, v in d.items()}

def select_alpha(net_name):
    """F1 only: per-instrument weight of the network vs NMF, coordinate search on the F1 equal-loudness set"""
    sets, _ = test_sets('F1'); nmf = NMF('F1'); net, S, _ = load_net(net_name)
    cache_e = [(fit(refs, refs.sum(0))) for refs in sets['eq']]
    E = [(refs, x, sep_net(net, S, x), nmf(x)) for refs, x in cache_e]
    grid = [0, .25, .5, .75, 1]; alpha = [.5] * 4
    def score(al):
        v = {s: [] for s in SRC}
        for refs, x, en, em in E:
            e = hybrid(en, em, x, al)
            for i, s in enumerate(SRC): v[s].append(sdr(refs[i], e[i]))
        med = [float(np.median(v[s])) for s in SRC]; return min(med) + 1e-3 * sum(med), med
    for _ in range(2):
        for i in range(4):
            best = None
            for g in grid:
                al = alpha.copy(); al[i] = g; sc, med = score(al)
                if best is None or sc > best[0]: best = (sc, g, med)
            alpha[i] = best[1]; print('alpha', alpha, [round(m, 2) for m in best[2]], flush=True)
    return alpha

def save(path, x): os.makedirs(os.path.dirname(path), exist_ok=True); sf.write(path, np.clip(x, -1, 1), SR, subtype='PCM_24')

def listen(fold, names, alpha):
    """WAVs for listening + a blind kit: the same excerpts by every method under random names, the key kept apart"""
    D = os.path.join(WORK, 'listen2', fold); sets, pools = test_sets(fold); nmf = NMF(fold); nets = {}
    def run(name, x):
        if name == 'nmf': return nmf(x)
        if name.startswith('hybrid:'): return hybrid(run(name.split(':')[1], x), nmf(x), x, alpha)
        if name not in nets: nets[name] = load_net(name)
        net, S, _ = nets[name]; return sep_net(net, S, x)
    tag = lambda n: n.replace(':', '-').replace(fold + '_', '')
    items = []
    for t in range(3):
        refs, x = fit(sets['eq'][t], sets['eq'][t].sum(0)); save(f'{D}/mix4_{t + 1}_mix.wav', x)
        for i, s in enumerate(SRC): save(f'{D}/mix4_{t + 1}_{s}_true.wav', refs[i])
        for n in names:
            e = run(n, x)
            for i, s in enumerate(SRC): save(f'{D}/mix4_{t + 1}_{s}_{tag(n)}.wav', e[i]); items.append((f'mix4_{t + 1}', s, tag(n), e[i]))
    refs, v = sets['voc'][0]; refs, x = fit(refs, refs.sum(0) + v); save(f'{D}/voice_mix.wav', x)
    for n in names:
        e = run(n, x)
        for i, s in enumerate(SRC): save(f'{D}/voice_{s}_{tag(n)}.wav', e[i])
    for ename, pair, span in FOLDS[fold]['ensembles']:
        n0 = min(len(C(k)) for k in pair.values()); a, b = (int(span[0] * SR), int(span[1] * SR)) if span else (0, n0)
        a1 = a + (b - a) // 3; b1 = min(b, a1 + SR * 30)
        tr = {s: np.asarray(C(k)[a1:b1], 'float32') for s, k in pair.items()}; x = sum(tr.values()); save(f'{D}/{ename}_mix.wav', x)
        for s, w in tr.items(): save(f'{D}/{ename}_{s}_true.wav', w)
        for n in names:
            e = run(n, x)
            for i, s in enumerate(SRC):
                save(f'{D}/{ename}_{s}_{tag(n)}.wav', e[i])
                if s in tr: items.append((ename, s, tag(n), e[i]))
    # blind kit: per excerpt and instrument, every method under a random number
    K = os.path.join(D, 'blind'); key = []; rnd = random.Random(7); groups = {}
    for ex, s, m, w in items: groups.setdefault((ex, s), []).append((m, w))
    for (ex, s), lst in sorted(groups.items()):
        rnd.shuffle(lst)
        for j, (m, w) in enumerate(lst): fn = f'{ex}_{s}_{chr(65 + j)}.wav'; save(f'{K}/{fn}', w); key.append({'file': fn, 'excerpt': ex, 'instrument': s, 'method': m})
    json.dump(key, open(os.path.join(D, 'blind_KEY_do_not_open_before_scoring.json'), 'w'), indent=1)
    with open(os.path.join(K, 'score_sheet.csv'), 'w') as f:
        f.write('file,instrument,score_1_to_5 (5 = only this instrument, clean; 1 = not separated),notes\n')
        for k in key: f.write(f"{k['file']},{k['instrument']},,\n")

if __name__ == '__main__':
    if CMD == 'train':
        fold, variant, minutes = sys.argv[3], sys.argv[4], float(sys.argv[5]); frac = float(sys.argv[6]) if len(sys.argv) > 6 else 1.0
        train(fold, variant, minutes, frac, sys.argv[7] if len(sys.argv) > 7 else None)
    elif CMD == 'eval':
        fold = sys.argv[3]; names = sys.argv[4].split(','); alpha = json.load(open(os.path.join(R2, 'alpha.json')))['alpha'] if os.path.exists(os.path.join(R2, 'alpha.json')) else None
        res = evaluate(fold, names, alpha); out = os.path.join(R2, f'results_{fold}.json'); old = json.load(open(out)) if os.path.exists(out) else {}
        old.update(res); old['_oracle'] = old.get('_oracle') or oracle_eval(fold); json.dump(old, open(out, 'w'), indent=1)
    elif CMD == 'select':
        net = sys.argv[3]; alpha = select_alpha(net); json.dump({'net': net, 'alpha': alpha, 'order': SRC}, open(os.path.join(R2, 'alpha.json'), 'w'))
    elif CMD == 'listen':
        fold = sys.argv[3]; names = sys.argv[4].split(','); alpha = json.load(open(os.path.join(R2, 'alpha.json')))['alpha'] if os.path.exists(os.path.join(R2, 'alpha.json')) else None
        listen(fold, names, alpha)
