"""Build: one modular PWA (dist/app/) + one self-contained HTML file + the artifact fragment.
Module order = dependency order. three3d.js is embedded as inert text and parsed only when 3D is first used."""
import base64, os, re, json, hashlib, shutil
ORDER = ['core','instrument','theory','geom','songdata','curriculum','lessons','audio','samples','media','detector','engine','coach','ui','motion','fx','cloud','auth','premium','tv','rhythms','neck','lanes','trainers','three3d','practice','camera','community','tools','notesart','simple','notes','fig','tips','solfege','exam','notify','shapes','genres','book','install','sima','aiworker','aispl','aideck','aimus','ai','samisimi','studio','authortools','onboard','intro','cine','pwa','app','boot']
LAZY = {'three3d'}
src = lambda n: open(f'src/{n}').read()
css = src('app.css')
hero = 'data:image/jpeg;base64,' + base64.b64encode(open('assets/hero.jpg','rb').read()).decode() if os.path.exists('assets/hero.jpg') else ''
# supplied recordings (songs): files in media/ — linked in the PWA, embedded as data: URIs in the single-file builds
# the teacher's recordings: kept once in the repository, beside the built app, so the source tree
# does not carry a second 32 MB copy of the same files
# MEDIA_DIR is where the build READS the recordings from; the path written into the app is always
# 'media/...', because that is where they sit next to index.html once the app is built
MEDIA_DIR = 'media' if os.path.isdir('media') else ('../app/media' if os.path.isdir('../app/media') else None)
MEDIA = sorted(os.path.relpath(os.path.join(r, f), MEDIA_DIR) for r, _, fs in os.walk(MEDIA_DIR) for f in fs if f.endswith('.mp3')) if MEDIA_DIR else []
# the single-file builds carry only the original recordings; the ready-made slower versions (name-60.mp3 …) are for the installable app (the single file stretches in the browser instead)
import re as _re
# (media_inline/ holds lighter mono copies for them — the recording itself is mono — plus the default slow version, to stay under the 16 MB page limit)
def _inline_src(m):
    alt = os.path.join('media_inline', m)
    return alt if os.path.exists(alt) else MEDIA_DIR + '/' + m
media_inline = {m: 'data:audio/mpeg;base64,' + base64.b64encode(open(_inline_src(m), 'rb').read()).decode() for m in MEDIA if not _re.search(r'-\d\d\.mp3$', m)}   # the ready-made slow versions stay out of the single file: it stretches in the browser instead, and the page must fit in 16 MB
CONFIG = json.load(open('config.json')) if os.path.exists('config.json') else {}
PHOTOS = {k: 'data:image/jpeg;base64,' + base64.b64encode(open('assets/pan-' + k + '.jpg','rb').read()).decode() for k in ['front','head','body','splashP','splashL'] if os.path.exists('assets/pan-' + k + '.jpg')}
# rendered hand videos (render/ → assets/fig/): mp4 loops + jpg posters; linked in the PWA, embedded in the single-file builds
FIG_NAMES = sorted(os.path.splitext(f)[0] for f in os.listdir('assets/fig') if f.endswith('.mp4')) if os.path.isdir('assets/fig') else []
def fig_map(inline):
    out = {}
    for n in FIG_NAMES:
        if inline: out[n] = {'mp4': 'data:video/mp4;base64,' + base64.b64encode(open(f'assets/fig/{n}.mp4','rb').read()).decode(), 'jpg': 'data:image/jpeg;base64,' + base64.b64encode(open(f'assets/fig/{n}.jpg','rb').read()).decode()}
        else: out[n] = {'mp4': f'fig/{n}.mp4', 'jpg': f'fig/{n}.jpg'}
    return out
def assets_js(inline):
    return 'PD.CONFIG = ' + json.dumps(CONFIG) + '; PD.assets = { hero: "' + hero + '", photos: ' + json.dumps(PHOTOS) + ', media: ' + json.dumps(media_inline if inline else {m: 'media/' + m for m in MEDIA}) + ', fig: ' + json.dumps(fig_map(inline)) + ' };'
for n in ORDER: assert '</script' not in src(n + '.js'), n
TITLE = 'ფანდური — Panduri Learning'
DESC = 'Learn the Georgian three-string panduri: lessons that wait for you, teacher video, tuner, chords, 3D instrument and a studio for teachers.'
FONTS = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@200;300;400;500;600;700&family=Noto+Serif+Georgian:wght@600;700&display=swap'
def scripts_inline():
    out = []
    for n in ORDER:
        js = src(n + '.js')
        if n in LAZY: out.append(f'<script type="text/plain" id="mod-{n}">\n{js}\n</script>')
        else: out.append(f'<script>/* {n}.js */\n{js}\n</script>')
        if n == 'core': out.append('<script>' + assets_js(True) + '</script>')
    return '\n'.join(out)
head_meta = f'''<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#130C07">
<meta name="description" content="{DESC}">
<title>{TITLE}</title>'''
SPLASH = """<div id="pd-splash" role="status" aria-live="polite" style="position:fixed;inset:0;z-index:9999;background:#090A0C;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;color:#F3EEE7;font:500 15px system-ui,sans-serif;transition:opacity .28s ease"><style>@keyframes pdsp{0%{transform:translateX(-100%)}100%{transform:translateX(250%)}}@media (prefers-reduced-motion:reduce){#pd-splash b{animation:none!important}}</style><svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><ellipse cx="28" cy="38" rx="13" ry="15" fill="none" stroke="#D49A5A" stroke-width="2"/><circle cx="28" cy="38" r="4" fill="none" stroke="#D49A5A" stroke-width="1.5"/><path d="M28 23V4" stroke="#D49A5A" stroke-width="3" stroke-linecap="round"/></svg><span id="pd-splash-t">იტვირთება…</span><i style="display:block;width:120px;height:2px;border-radius:1px;background:#25262B;overflow:hidden"><b style="display:block;height:100%;width:40%;background:#D49A5A;animation:pdsp 1.1s ease-in-out infinite"></b></i></div>"""
os.makedirs('dist', exist_ok=True)
# 1) self-contained single file (standalone, offline-capable as a file)
single = f'''<!doctype html>
<html lang="ka">
<head>
{head_meta}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="{FONTS}">
<style>
{css}
</style>
</head>
<body>
<noscript>ფანდურის სასწავლო აპს JavaScript სჭირდება. · This app needs JavaScript.</noscript>
{SPLASH}
{scripts_inline()}
</body>
</html>
'''
open('dist/panduri-app.html','w').write(single)
# 2) artifact fragment: the host supplies the single <!doctype>/<html>/<head>/<body>; we add only body content.
frag = f'''<noscript>ფანდურის სასწავლო აპს JavaScript სჭირდება. · This app needs JavaScript.</noscript>
{SPLASH}
<script type="text/plain" id="pd-css">
{css}
</script>
<script>
(function () {{
  var d = document, h = d.head;
  d.title = {json.dumps(TITLE)};
  d.documentElement.lang = 'ka';
  var add = function (tag, attrs) {{ var e = d.createElement(tag); for (var k in attrs) e.setAttribute(k, attrs[k]); h.appendChild(e); return e; }};
  add('meta', {{ name: 'theme-color', content: '#130C07' }});
  add('meta', {{ name: 'description', content: {json.dumps(DESC)} }});
  add('link', {{ rel: 'preconnect', href: 'https://fonts.googleapis.com' }});
  add('link', {{ rel: 'stylesheet', href: {json.dumps(FONTS)} }});
  add('style', {{}}).textContent = d.getElementById('pd-css').textContent;
}})();
</script>
{scripts_inline()}
'''
open('dist/artifact.html','w').write(frag)
# 3) modular PWA
app = 'dist/app'
if os.path.exists(app): shutil.rmtree(app)
os.makedirs(app + '/js'); shutil.copytree('pwa/icons', app + '/icons')
shutil.copy('pwa/manifest.webmanifest', app + '/manifest.webmanifest')
# the install prompt on Android, Windows and macOS shows these; without them it is a bare line of text
if os.path.isdir('pwa/shots'):
    shutil.rmtree(app + '/shots', ignore_errors=True)
    shutil.copytree('pwa/shots', app + '/shots')
open(app + '/app.css', 'w').write(css)
tags = []
for n in ORDER:
    open(f'{app}/js/{n}.js', 'w').write(src(n + '.js'))
    if n not in LAZY: tags.append(f'<script src="js/{n}.js"></script>')
    if n == 'core': tags.append('<script src="js/assets.js"></script>'); tags.append('<script src="js/config.js"></script>')
open(app + '/js/assets.js', 'w').write(assets_js(False))
open(app + '/js/config.js', 'w').write('''/* ფანდური — სერვერის და გადახდის პარამეტრები · server and payment settings.
   შეავსე და შეინახე — აპის ხელახლა აწყობა არ არის საჭირო. Fill in and save — no rebuild needed.
   The publishable key (sb_publishable_...) or the older "anon public" key is meant to be public:
   row-level security protects the data. NEVER put a secret / service_role key here. */
PD.CONFIG = Object.assign(PD.CONFIG || {}, Object.fromEntries(Object.entries({
  supabaseUrl: '__SB_URL__',   // https://xxxx.supabase.co
  supabaseKey: '__SB_KEY__',   // Settings > API Keys > publishable key (sb_publishable_...)
  prices: null,      // { monthly: '9 ₾', yearly: '79 ₾' }
  payments: null,    // { monthly: 'https://buy.stripe.com/...', yearly: 'https://buy.stripe.com/...' }
  turn: null         // { urls: 'turn:turn.example.com:3478', username: '...', credential: '...' }
}).filter(function (e) { return e[1]; })));
'''.replace('__SB_URL__', CONFIG.get('supabaseUrl', '')).replace('__SB_KEY__', CONFIG.get('supabaseKey', '')))
for m in MEDIA: os.makedirs(os.path.dirname(app + '/media/' + m), exist_ok=True); shutil.copy(MEDIA_DIR + '/' + m, app + '/media/' + m)
if FIG_NAMES: shutil.copytree('assets/fig', app + '/fig')
lazy_loader = '<script>/* 3D renderer is fetched only when first used */\nObject.defineProperty(PD, "R3D", { configurable: true, get() { if (!PD._R3D) { const x = new XMLHttpRequest(); x.open("GET", "js/three3d.js", false); x.send(); const s = document.createElement("script"); s.textContent = x.responseText; document.head.appendChild(s); } return PD._R3D; } });\n</script>'
tags.insert(tags.index('<script src="js/instrument.js"></script>'), lazy_loader)
index = f'''<!doctype html>
<html lang="ka">
<head>
{head_meta}
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="ფანდური">
<meta name="application-name" content="ფანდური">
<meta name="msapplication-TileColor" content="#130C07">
<meta name="color-scheme" content="dark">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="{FONTS}">
<link rel="stylesheet" href="app.css">
</head>
<body>
<noscript>ფანდურის სასწავლო აპს JavaScript სჭირდება. · This app needs JavaScript.</noscript>
{SPLASH}
{chr(10).join(tags)}
</body>
</html>
'''
open(app + '/index.html', 'w').write(index)
shutil.copy('ARCHITECTURE.md', app + '/ARCHITECTURE.md')
# the teacher's own tuner app „სამი სიმი“, unchanged, served beside the app at tuner/
if os.path.exists('ext/sami-simi'): shutil.copytree('ext/sami-simi', app + '/tuner')
shell = ['./', 'index.html', 'app.css', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'] + [f'js/{n}.js' for n in ORDER] + ['js/assets.js', 'js/config.js']
version = hashlib.sha1((css + ''.join(src(n + '.js') for n in ORDER) + open('pwa/sw.js').read() + open(app + '/js/config.js').read()).encode()).hexdigest()[:10]
open(app + '/sw.js', 'w').write(open('pwa/sw.js').read().replace('__VERSION__', version).replace('__SHELL__', json.dumps(shell)))
# the running build's version, so Settings can show it and ask for an update
open(app + '/js/config.js', 'a').write('\nPD.BUILD = ' + json.dumps(version) + ';\n')
# validation: exactly one document skeleton per standalone page, none in the fragment
def count(html, pat): return len(re.findall(pat, html, re.I))
for name, html, want in [('panduri-app.html', single, 1), ('app/index.html', index, 1), ('artifact.html', frag, 0)]:
    c = {k: count(html, p) for k, p in [('doctype', r'<!doctype'), ('html', r'<html[\s>]'), ('/html', r'</html>'), ('head', r'<head[\s>]'), ('body', r'<body[\s>]'), ('/body', r'</body>')]}
    assert all(v == want for v in c.values()), (name, c)
# the 3D hand (chord pages): a separate file, loaded only when 3D is chosen
if os.path.exists('render/out/poses_final.json'):
    import subprocess; subprocess.run(['python3', 'src3d/build_hand3d.py', 'dist/app'], check=True)
print('ok · single', len(single)//1024, 'KB · fragment', len(frag)//1024, 'KB · version', version)
