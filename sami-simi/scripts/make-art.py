"""Generates app icons, adaptive-icon layers and splash screens (run: python3 scripts/make-art.py)."""
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BG = (18, 13, 10)
SERIF = sys.argv[1] if len(sys.argv) > 1 else '/tmp/serif800.ttf'

def glow(S, img, box, color, blur):
    g = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(g)
    d.ellipse(box, fill=color); g = g.filter(ImageFilter.GaussianBlur(blur))
    return Image.alpha_composite(img, g)

def head_art(S, scale=0.78, transparent=False):
    """Panduri headstock: C♯ peg upper-left, A peg lower-left, E peg right (between them)."""
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0) if transparent else BG + (255,))
    if not transparent:
        img = glow(S, img, [S*0.08, -S*0.15, S*0.92, S*0.72], (130, 84, 42, 95), S*0.09)
    cx = S/2; h = S*scale; top = S/2 - h/2; w = h*0.42
    head = [cx-w/2, top, cx+w/2, top+h*0.78]
    sh = Image.new('RGBA', (S, S), (0, 0, 0, 0)); sd = ImageDraw.Draw(sh)
    sd.ellipse([head[0]+S*0.012, head[1]+S*0.025, head[2]+S*0.012, head[3]+S*0.025], fill=(0, 0, 0, 170))
    img = Image.alpha_composite(img, sh.filter(ImageFilter.GaussianBlur(S*0.022)))
    d = ImageDraw.Draw(img)
    nw = w*0.36
    d.rectangle([cx-nw/2, top+h*0.68, cx+nw/2, top+h], fill=(92, 57, 32, 255))
    d.ellipse(head, fill=(92, 57, 32, 255))
    d.ellipse([head[0]+w*0.13, head[1]+h*0.055, head[2]-w*0.13, head[3]-h*0.045], fill=(54, 32, 18, 255))
    # subtle highlight on the rim
    hl = Image.new('RGBA', (S, S), (0, 0, 0, 0)); hd = ImageDraw.Draw(hl)
    hd.arc(head, 200, 290, fill=(231, 178, 122, 120), width=max(2, int(S*0.006)))
    img = Image.alpha_composite(img, hl); d = ImageDraw.Draw(img)
    d.rectangle([cx-nw/2-S*0.008, top+h*0.715, cx+nw/2+S*0.008, top+h*0.745], fill=(238, 228, 206, 255))
    r = w*0.21
    # order of strings at the nut: A (left), C♯ (middle), E (right)
    pegs  = [(cx-w/2-r*0.95, top+h*0.42), (cx-w/2-r*0.95, top+h*0.2), (cx+w/2+r*0.95, top+h*0.31)]
    posts = [(cx-w*0.2, top+h*0.42), (cx-w*0.12, top+h*0.2), (cx+w*0.17, top+h*0.31)]
    nutx = [cx-nw*0.3, cx, cx+nw*0.3]
    for (px, py), (qx, qy) in zip(pegs, posts):
        d.line([px, py, qx, qy], fill=(36, 21, 11, 255), width=int(r*0.42))
    sw = max(2, int(S*0.0065))
    for i, (qx, qy) in enumerate(posts):
        d.line([nutx[i], top+h*0.73, qx, qy], fill=(236, 210, 150, 255), width=sw)
        d.line([nutx[i], top+h*0.745, nutx[i], top+h], fill=(236, 210, 150, 255), width=sw)
    for (px, py) in pegs:
        d.ellipse([px-r, py-r*1.1, px+r, py+r*1.1], fill=(208, 160, 80, 255))
        d.ellipse([px-r*0.62, py-r*0.8, px+r*0.18, py-r*0.12], fill=(243, 215, 150, 255))
    for (qx, qy) in posts:
        d.ellipse([qx-r*0.3, qy-r*0.3, qx+r*0.3, qy+r*0.3], fill=(243, 215, 150, 255))
    if transparent:
        # keep a soft fade at the neck end
        pass
    return img

def save(img, path, size):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.resize((size, size), Image.LANCZOS).save(path)

S = 2048
# store / iOS icon — opaque
save(head_art(S, 0.8).convert('RGB'), f'{ROOT}/assets/icon-only.png', 1024)
# Android adaptive layers (foreground must fit the inner 66 %)
save(head_art(S, 0.56, transparent=True), f'{ROOT}/assets/icon-foreground.png', 1024)
Image.new('RGB', (1024, 1024), BG).save(f'{ROOT}/assets/icon-background.png')
# web icons
save(head_art(S, 0.8).convert('RGB'), f'{ROOT}/app/icons/icon-512.png', 512)
save(head_art(S, 0.8).convert('RGB'), f'{ROOT}/app/icons/icon-192.png', 192)
save(head_art(S, 0.8).convert('RGB'), f'{ROOT}/app/icons/apple-touch-icon.png', 180)
save(head_art(S, 0.6).convert('RGB'), f'{ROOT}/app/icons/maskable-512.png', 512)
save(head_art(S, 0.8).convert('RGB'), f'{ROOT}/assets/store/icon-1024.png', 1024)
save(head_art(S, 0.8).convert('RGB'), f'{ROOT}/assets/store/play-icon-512.png', 512)

# splash 2732² — art + wordmark
Z = 2732
sp = Image.new('RGBA', (Z, Z), BG + (255,))
sp = glow(Z, sp, [Z*0.2, Z*0.1, Z*0.8, Z*0.6], (120, 78, 40, 70), Z*0.08)
art = head_art(1400, 0.86, transparent=True).resize((760, 760), Image.LANCZOS)
sp.alpha_composite(art, ((Z-760)//2, Z//2-520))
d = ImageDraw.Draw(sp)
f = ImageFont.truetype(SERIF, 120)
txt = 'სამი სიმი'
tw = d.textlength(txt, font=f)
d.text(((Z-tw)/2, Z//2+300), txt, font=f, fill=(242, 233, 218, 255))
sp = sp.convert('RGB')
sp.save(f'{ROOT}/assets/splash.png'); sp.save(f'{ROOT}/assets/splash-dark.png')
print('art done')
