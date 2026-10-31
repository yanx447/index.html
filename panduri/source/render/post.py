"""Overlay finger badges / nail highlights on rendered frames and encode small MP4 loops + posters for the app."""
import json, os, subprocess, sys, math, glob
from PIL import Image, ImageDraw, ImageFont, ImageFilter
OUT = '/home/claude/pd/render/out'
DST = '/home/claude/pd/assets/fig'
os.makedirs(DST, exist_ok=True)
FONT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
COL = {'thumb': (242, 239, 234), 'index': (229, 83, 75), 'middle': (63, 191, 122)}
INK = {'thumb': (20, 17, 14), 'index': (255, 255, 255), 'middle': (6, 20, 12)}
LAB = {'thumb': 'T', 'index': '1', 'middle': '2'}

def encode(frames_glob, name, fps, width=600, crf=26):
    tmp = os.path.join(OUT, '_enc'); os.makedirs(tmp, exist_ok=True)
    for f in glob.glob(tmp + '/*.png'): os.remove(f)
    files = sorted(glob.glob(frames_glob))
    for i, f in enumerate(files): os.link(f, f'{tmp}/{i:04d}.png') if not os.path.exists(f'{tmp}/{i:04d}.png') else None
    mp4 = f'{DST}/{name}.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(fps), '-i', f'{tmp}/%04d.png', '-vf', f'scale={width}:-2:flags=lanczos', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', str(crf), '-preset', 'slow', '-movflags', '+faststart', '-an', mp4], check=True)
    Image.open(files[-1]).convert('RGB').resize((width, round(width * Image.open(files[-1]).height / Image.open(files[-1]).width)), Image.LANCZOS).save(f"{DST}/{name}.jpg", quality=72)
    for f in glob.glob(tmp + '/*.png'): os.remove(f)
    print(name, os.path.getsize(mp4) // 1024, 'KB')

def badge(d, at, key, frm):
    x, y = at; r = 12
    d.ellipse([x - r, y - r, x + r, y + r], fill=COL[key] + (235,), outline=(255, 255, 255, 200), width=2)
    tw = d.textlength(LAB[key], font=FONT); d.text((x - tw / 2, y - 9), LAB[key], font=FONT, fill=INK[key])

def bm():
    J = json.load(open(f'{OUT}/bm_anim.json'))
    for cam, mirror in [('front', True), ('player', False)]:
        pdir = f'{OUT}/p_bm_{cam}'; os.makedirs(pdir, exist_ok=True)
        for i, fr in enumerate(J['frames']):
            src = f'{OUT}/bm_{cam}_{i:03d}.png'
            if not os.path.exists(src): continue
            im = Image.open(src).convert('RGBA'); W, H = im.size
            if mirror: im = im.transpose(Image.FLIP_LEFT_RIGHT)
            ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
            sx = W / 720
            for k in ['thumb', 'index', 'middle']:
                L = fr['cams'][cam][k]
                if not L['on']: continue
                p = [L['p'][0] * sx, L['p'][1] * sx]; kn = [L['knuckle'][0] * sx, L['knuckle'][1] * sx]
                if mirror: p[0] = W - p[0]; kn[0] = W - kn[0]
                v = [p[0] - kn[0], p[1] - kn[1]]; n = math.hypot(*v) or 1; v = [v[0] / n, v[1] / n]
                # badge beyond the fingertip, outside the finger; a thin leader to the contact point
                b = [p[0] + v[0] * 30, p[1] + v[1] * 30]
                b = [min(W - 16, max(16, b[0])), min(H - 16, max(16, b[1]))]
                d.line([p[0] + v[0] * 9, p[1] + v[1] * 9, b[0] - v[0] * 12, b[1] - v[1] * 12], fill=COL[k] + (200,), width=2)
                badge(d, b, k, fr)
            Image.alpha_composite(im, ov).convert('RGB').save(f'{pdir}/{i:03d}.png')
        encode(f'{pdir}/*.png', f'bm_{cam}', J['fps'])

def strokes():
    J = json.load(open(f'{OUT}/st_anim.json'))
    for cam, mirror in [('side', False), ('front', True)]:
        pdir = f'{OUT}/p_st_{cam}'; os.makedirs(pdir, exist_ok=True)
        for i, fr in enumerate(J['frames']):
            src = f'{OUT}/st_{cam}_{i:03d}.png'
            if not os.path.exists(src): continue
            im = Image.open(src).convert('RGBA'); W, H = im.size; sx = W / 720
            if mirror: im = im.transpose(Image.FLIP_LEFT_RIGHT)
            ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
            C = fr['cams'][cam]
            ov2 = Image.new('RGBA', im.size, (0, 0, 0, 0)); d2 = ImageDraw.Draw(ov2)
            if cam == 'side':
                SCOL = [(217, 120, 63), (120, 183, 222), (239, 224, 184)]
                for j, q in enumerate(C['str']):
                    x, y = q[0] * sx, q[1] * sx
                    d2.ellipse([x - 4.5, y - 4.5, x + 4.5, y + 4.5], fill=(244, 238, 228, 255), outline=SCOL[j] + (255,), width=2)
                    lab = ['A', 'C♯', 'E'][j]; tw = d2.textlength(lab, font=FONT)
                    d2.text((x - 26 - tw / 2, y - 9), lab, font=FONT, fill=SCOL[j] + (255,))
            for k, on in ([('index', fr['dir'] > 0), ('thumb', fr['dir'] < 0)] if cam == 'side' else []):
                if not on: continue
                hit = C['hit'][k]; p = [C[k][0] * sx, C[k][1] * sx]
                if mirror: p[0] = W - p[0]
                a = int(max(0, min(1, 1 - (hit - 2) / 8)) * 220)
                if a > 10:
                    for rr, aa in [(14, a // 4), (9, a // 2), (5, a)]:
                        d.ellipse([p[0] - rr, p[1] - rr, p[0] + rr, p[1] + rr], fill=(142, 240, 180, aa))
            Image.alpha_composite(Image.alpha_composite(im, ov2), ov.filter(ImageFilter.GaussianBlur(1.2))).convert('RGB').save(f'{pdir}/{i:03d}.png')
        encode(f'{pdir}/*.png', f'strokes_{cam}', J['fps'])

FCOL = {'index': (229, 83, 75), 'middle': (63, 191, 122), 'ring': (232, 197, 71), 'pinky': (76, 142, 234), 'thumb': (242, 239, 234)}
FINK = {'index': (255, 255, 255), 'middle': (6, 20, 12), 'ring': (25, 18, 0), 'pinky': (255, 255, 255), 'thumb': (20, 17, 14)}
FLAB = {'index': '1', 'middle': '2', 'ring': '3', 'pinky': '4', 'thumb': 'T'}
BIG = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 19)
def fingers():
    J = json.load(open(f'{OUT}/fingers_anim.json')); order = ['index', 'middle', 'ring', 'pinky', 'thumb']
    pdir = f'{OUT}/p_fingers'; os.makedirs(pdir, exist_ok=True)
    for i, fr in enumerate(J['frames']):
        src = f'{OUT}/fingers_{i:03d}.png'
        if not os.path.exists(src): continue
        im = Image.open(src).convert('RGBA'); W, H = im.size; sx = W / 720
        ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
        act = order[min(4, fr['i'])]
        for k in order:
            x, y = fr['tips'][k][0] * sx, fr['tips'][k][1] * sx
            if k == 'thumb': x, y = x + 24, y - 6
            else: y -= 24
            on = k == act; r = 16 if on else 12
            if on: d.ellipse([x - r - 5, y - r - 5, x + r + 5, y + r + 5], outline=(142, 240, 180, 255), width=3)
            d.ellipse([x - r, y - r, x + r, y + r], fill=FCOL[k] + (240,), outline=(255, 255, 255, 210), width=2)
            f = BIG if on else FONT; tw = d.textlength(FLAB[k], font=f); d.text((x - tw / 2, y - (12 if on else 9)), FLAB[k], font=f, fill=FINK[k])
        Image.alpha_composite(im, ov).convert('RGB').save(f'{pdir}/{i:03d}.png')
    encode(f'{pdir}/*.png', 'fingers', J['fps'])
def warmup():
    J = json.load(open(f'{OUT}/warmup_anim.json'))
    encode(f'{OUT}/warmup_*.png', 'warmup', J['fps'])

if __name__ == '__main__':
    for job in sys.argv[1:]: globals()[job]()
