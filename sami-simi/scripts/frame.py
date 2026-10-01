"""Framed store screenshots + Play feature graphic. Run after scripts/screens.cjs.
python3 scripts/frame.py"""
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = f'{R}/store/screens-raw'
OUT = f'{R}/store/screenshots'
SERIF = f'{R}/assets/fonts-src/NotoSerifGeorgian-ExtraBold.ttf'
SANS = f'{R}/assets/fonts-src/NotoSansGeorgian-Medium.ttf'
from fontTools.ttLib import TTFont as _TT
FALLBACK = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
_cmaps = {}
def _has(path, ch):
    if path not in _cmaps: _cmaps[path] = _TT(path).getBestCmap()
    return ord(ch) in _cmaps[path]
def draw_text(d, xy, txt, font, fill):
    """Draws text, falling back to DejaVu for glyphs the font lacks (e.g. ♯)."""
    x, y = xy
    for ch in txt:
        f = font if _has(font.path, ch) else ImageFont.truetype(FALLBACK, int(font.size * 0.92))
        d.text((x, y + (0 if f is font else font.size * 0.08)), ch, font=f, fill=fill); x += d.textlength(ch, font=f)
def text_len(d, txt, font):
    return sum(d.textlength(ch, font=font if _has(font.path, ch) else ImageFont.truetype(FALLBACK, int(font.size * 0.92))) for ch in txt)
BG = (18, 13, 10); IVORY = (242, 233, 218); BRASS = (212, 166, 85); MUTE = (170, 152, 128)

CAP = {
 '1-tighten': {'ka': ('ზუსტად იცი, რამდენი მოუჭირო', 'ისარი და მინიშნება ცენტების სიზუსტით'),
               'en': ('Know exactly how far to turn', 'Needle and guidance down to the cent')},
 '2-intune':  {'ka': ('სამი სიმი — ერთი წყობა', 'ლა · დო♯ · მი, ტრადიციული A · C♯ · E'),
               'en': ('Three strings, one tuning', 'The traditional panduri A · C♯ · E')},
 '3-strobe':  {'ka': ('სტრობი წვრილი აწყობისთვის', 'როცა ზოლები ჩერდება — აწყობილია'),
               'en': ('Strobe for fine tuning', 'When the bands stop, you are in tune')},
 '4-guided':  {'ka': ('ნაბიჯ-ნაბიჯ აწყობა', 'დამწყებთათვის: ჯერ ლა, მერე დო♯, ბოლოს მი'),
               'en': ('Guided, string by string', 'For beginners: A, then C♯, then E')},
 '5-settings':{'ka': ('შენს ფანდურზე მორგებული', 'ტრანსპოზიცია, ოქტავა, A4 კალიბრაცია'),
               'en': ('Made for your panduri', 'Transpose, octave and A4 calibration')},
}

def rounded(im, r):
    m = Image.new('L', im.size, 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, im.size[0]-1, im.size[1]-1], r, fill=255)
    out = Image.new('RGBA', im.size); out.paste(im, (0, 0), m); return out

def frame(raw, size, title, sub):
    W, H = size
    c = Image.new('RGBA', (W, H), BG + (255,))
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
    gd.ellipse([-W*0.2, -H*0.25, W*1.2, H*0.35], fill=(120, 78, 40, 80)); c = Image.alpha_composite(c, g.filter(ImageFilter.GaussianBlur(W*0.08)))
    d = ImageDraw.Draw(c)
    ft = ImageFont.truetype(SERIF, int(W*0.064)); fs = ImageFont.truetype(SANS, int(W*0.034))
    def center(txt, y, f, col):
        # wrap if too wide
        words = txt.split(' '); lines = ['']
        for wd in words:
            t = (lines[-1] + ' ' + wd).strip()
            if text_len(d, t, f) > W*0.86 and lines[-1]: lines.append(wd)
            else: lines[-1] = t
        for ln in lines:
            draw_text(d, ((W - text_len(d, ln, f))/2, y), ln, f, col); y += f.size*1.3
        return y
    y = center(title, H*0.055, ft, IVORY)
    y = center(sub, y + H*0.008, fs, MUTE)
    shot = Image.open(raw).convert('RGB')
    top = int(y + H*0.035); avail = H - top - int(H*0.04)
    sw = int(avail * shot.size[0] / shot.size[1]); sh = avail
    if sw > W*0.84: sw = int(W*0.84); sh = int(sw * shot.size[1] / shot.size[0])
    shot = rounded(shot.resize((sw, sh), Image.LANCZOS), int(sw*0.07))
    x = (W - sw)//2
    sd = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sd).rounded_rectangle([x, top+18, x+sw, top+sh+18], int(sw*0.07), fill=(0, 0, 0, 200))
    c = Image.alpha_composite(c, sd.filter(ImageFilter.GaussianBlur(28)))
    ImageDraw.Draw(c).rounded_rectangle([x-3, top-3, x+sw+2, top+sh+2], int(sw*0.07)+3, outline=(90, 70, 50, 255), width=3)
    c.alpha_composite(shot, (x, top))
    return c.convert('RGB')

os.makedirs(OUT, exist_ok=True)
for dev, size in [('ios', (1320, 2868)), ('android', (1080, 1920))]:
    for lang in ['ka', 'en']:
        for key, caps in CAP.items():
            raw = f'{RAW}/{dev}-{lang}-{key}.png'
            if not os.path.exists(raw): continue
            frame(raw, size, *caps[lang]).save(f'{OUT}/{dev}-{lang}-{key}.png', optimize=True)

# Google Play feature graphic 1024x500
W, H = 1024, 500
fg = Image.new('RGBA', (W, H), BG + (255,))
g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).ellipse([-100, -260, 620, 520], fill=(130, 84, 42, 110))
fg = Image.alpha_composite(fg, g.filter(ImageFilter.GaussianBlur(80)))
icon = Image.open(f'{R}/assets/icon-foreground.png').convert('RGBA').resize((560, 560), Image.LANCZOS)
fg.alpha_composite(icon, (-10, -30))
d = ImageDraw.Draw(fg)
draw_text(d, (470, 150), 'სამი სიმი', ImageFont.truetype(SERIF, 76), IVORY)
draw_text(d, (474, 262), 'Sami Simi — Panduri Tuner', ImageFont.truetype(SANS, 34), BRASS)
draw_text(d, (474, 316), 'ფანდურის ტიუნერი · A · C♯ · E', ImageFont.truetype(SANS, 28), MUTE)
fg.convert('RGB').save(f'{R}/store/feature-graphic-1024x500.png')
print('framed')
