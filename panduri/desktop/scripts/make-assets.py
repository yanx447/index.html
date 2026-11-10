"""The installers' artwork, drawn from the app's own icon. Run by hand when the icon changes (needs Pillow):
   python3 scripts/make-assets.py   → build/icon-mac.png, dmg-background(@2x).png, installer-sidebar.bmp, appx/*.png, ../assets/tv-banner-en.png"""
import os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
BUILD = os.path.join(HERE, 'build')
ICON = Image.open(os.path.join(HERE, '..', 'assets', 'icon-only.png')).convert('RGB')
GEORGIAN = '/System/Library/Fonts/SFGeorgian.ttf'
SERIF = '/System/Library/Fonts/Supplemental/Georgia Bold.ttf'
LATIN = '/System/Library/Fonts/Supplemental/Georgia.ttf'
os.makedirs(os.path.join(BUILD, 'appx'), exist_ok=True)


def art(size):
    """the instrument, a little closer than in the phone icon"""
    return ICON.crop((92, 92, 932, 932)).resize((size, size), Image.LANCZOS)


def gradient(w, h, top=(44, 24, 12), bottom=(13, 8, 5)):
    g = Image.new('RGB', (1, h))
    for y in range(h):
        k = y / max(1, h - 1)
        g.putpixel((0, y), tuple(round(a + (b - a) * k) for a, b in zip(top, bottom)))
    return g.resize((w, h))


def rounded(img, radius):
    scale = 4
    mask = Image.new('L', (img.width * scale, img.height * scale), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, mask.width - 1, mask.height - 1), radius * scale, fill=255)
    out = img.convert('RGBA')
    out.putalpha(mask.resize(img.size, Image.LANCZOS))
    return out


def font(path, size):
    return ImageFont.truetype(path, size)


def centred(draw, cx, y, text, fnt, fill):
    w = draw.textlength(text, font=fnt)
    draw.text((cx - w / 2, y), text, font=fnt, fill=fill)


# macOS icon: Apple's grid, a rounded square with a margin
canvas = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
canvas.alpha_composite(rounded(art(824), 185), (100, 100))
canvas.save(os.path.join(BUILD, 'icon-mac.png'))


def dmg(scale):
    w, h = 660 * scale, 400 * scale
    img = gradient(w, h)
    d = ImageDraw.Draw(img)
    centred(d, w / 2, 42 * scale, 'გადაიტანე ფანდური პროგრამების საქაღალდეში', font(GEORGIAN, 21 * scale), (240, 226, 208))
    centred(d, w / 2, 76 * scale, 'Drag Panduri to Applications', font(LATIN, 14 * scale), (190, 170, 150))
    y = 205 * scale
    x0, x1 = 268 * scale, 392 * scale
    d.line((x0, y, x1 - 14 * scale, y), fill=(213, 154, 104), width=4 * scale)
    d.polygon([(x1, y), (x1 - 22 * scale, y - 13 * scale), (x1 - 22 * scale, y + 13 * scale)], fill=(213, 154, 104))
    centred(d, w / 2, 348 * scale, 'დეველოპერი ნუკრი ბერიძე', font(GEORGIAN, 12 * scale), (190, 170, 150))
    centred(d, w / 2, 366 * scale, 'Developer Nukri Beridze', font(LATIN, 11 * scale), (150, 132, 116))
    return img


dmg(1).save(os.path.join(BUILD, 'dmg-background.png'))
dmg(2).save(os.path.join(BUILD, 'dmg-background@2x.png'))

# the Windows installer's side picture: NSIS wants exactly 164×314, 24-bit
side = gradient(164, 314)
side.paste(rounded(art(116), 26), (24, 72), rounded(art(116), 26))
d = ImageDraw.Draw(side)
centred(d, 82, 204, 'ფანდური', font(GEORGIAN, 21), (240, 226, 208))
side.convert('RGB').save(os.path.join(BUILD, 'installer-sidebar.bmp'))

# Microsoft Store tiles
for name, size in [('StoreLogo', (50, 50)), ('Square44x44Logo', (44, 44)), ('Square150x150Logo', (150, 150)), ('Square310x310Logo', (310, 310))]:
    art(size[0]).save(os.path.join(BUILD, 'appx', name + '.png'))
wide = gradient(310, 150)
wide.paste(art(110), (100, 20))
wide.save(os.path.join(BUILD, 'appx', 'Wide310x150Logo.png'))

# Android TV: the banner needs the app's name in the device's language; assets/tv-banner.png is the Georgian one
banner = gradient(320, 180, (58, 34, 18), (22, 12, 7))
icon = rounded(art(96), 22)
banner.paste(icon, (22, 42), icon)
d = ImageDraw.Draw(banner)
d.text((134, 58), 'Panduri', font=font(SERIF, 34), fill=(245, 228, 200))
d.text((136, 104), 'Learn to play', font=font(LATIN, 16), fill=(213, 170, 120))
banner.save(os.path.join(HERE, '..', 'assets', 'tv-banner-en.png'))

# Google Play's store graphics
store = os.path.join(BUILD, 'store')
os.makedirs(store, exist_ok=True)
ICON.resize((512, 512), Image.LANCZOS).save(os.path.join(store, 'play-icon-512.png'))


def poster(w, h, name):
    img = gradient(w, h, (58, 34, 18), (16, 9, 5))
    size = int(h * .62)
    icon = rounded(art(size), int(size * .22))
    img.paste(icon, (int(w * .08), (h - size) // 2), icon)
    d = ImageDraw.Draw(img)
    x = int(w * .08) + size + int(w * .06)
    d.text((x, int(h * .27)), 'ფანდური', font=font(GEORGIAN, int(h * .2)), fill=(245, 228, 200))
    d.text((x, int(h * .55)), 'Panduri Learning', font=font(SERIF, int(h * .09)), fill=(213, 170, 120))
    img.save(os.path.join(store, name))


poster(1024, 500, 'play-feature-graphic-1024x500.png')
poster(1280, 720, 'play-tv-banner-1280x720.png')
print('assets written')
