"""Split every MUSIC recording into vocals / bass / other / drums with Demucs (htdemucs, 4 stems).

The recordings are only read. Stems go to a cache folder (default: $LESSON_CACHE or ./cache), never into MUSIC/.
Usage: python separate.py [--cache DIR] [song-id ...]
"""
import json, os, subprocess, sys, pathlib
import numpy as np, soundfile as sf, torch

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[3]
MUSIC = pathlib.Path(os.environ.get('PANDURI_MUSIC', ROOT / 'MUSIC'))   # the main checkout's MUSIC/ when run from a worktree
SR = 44100


def decode(path):
    """any recording (mp3, wav, mp4) → float32 stereo at 44.1 kHz, through ffmpeg"""
    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    raw = subprocess.run([ff, '-v', 'error', '-i', str(path), '-vn', '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).T.copy()


def main():
    args = sys.argv[1:]
    cache = pathlib.Path(os.environ.get('LESSON_CACHE', HERE / 'cache'))
    if args[:1] == ['--cache']: cache, args = pathlib.Path(args[1]), args[2:]
    man = json.load(open(HERE / 'songs.json'))
    items = man['songs'] + [man['benchmark']]
    from demucs.pretrained import get_model
    from demucs.apply import apply_model
    model = get_model('htdemucs'); model.eval()
    dev = 'mps' if torch.backends.mps.is_available() else 'cpu'
    model.to(dev)
    for s in items:
        if args and s['id'] not in args: continue
        out = cache / s['id']
        if (out / 'vocals.wav').exists(): print('kept', s['id']); continue
        out.mkdir(parents=True, exist_ok=True)
        x = decode(MUSIC / s['folder'] / s['file'])
        sf.write(out / 'mix.wav', x.T, SR, subtype='PCM_16')
        ref = x.mean(0); mean, std = ref.mean(), ref.std() + 1e-8
        wav = torch.from_numpy((x - mean) / std)[None].to(dev)
        with torch.no_grad():
            y = apply_model(model, wav, shifts=1, split=True, overlap=0.25, device=dev, progress=False)[0]
        y = (y * std + mean).cpu().numpy()
        for name, stem in zip(model.sources, y):
            sf.write(out / (name + '.wav'), stem.T, SR, subtype='PCM_16')
        print('split', s['id'], round(x.shape[1] / SR, 1), 's', flush=True)


if __name__ == '__main__':
    main()
