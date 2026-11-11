"""Build: one modular PWA (dist/app/) + one self-contained HTML file + the artifact fragment.
Module order = dependency order. three3d.js is embedded as inert text and parsed only when 3D is first used."""
import base64, os, re, json, hashlib, shutil
ORDER = ['core','instrument','theory','geom','songdata','sounddata','curriculum','lessons','audio','samples','media','detector','engine','coach','ui','motion','fx','cloud','devices','auth','billing','premium','checkout','tv','rhythms','neck','lanes','trainers','three3d','practice','camera','community','social','chatkit','tools','notesart','simple','notes','fig','tips','solfege','exam','notify','shapes','genres','book','install','sima','aiworker','aispl','aideck','aimus','ailesson','ai','samisimi','studio','authortools','onboard','intro','pwa','app','boot']
LAZY = {'three3d'}
src = lambda n: open(f'src/{n}').read()
# The stylesheet is two cascade layers: the earlier screens' rules (app.css) in `legacy`, and the design
# system (design.css) after it. A later layer wins whatever the selector, so the design system never has to
# out-shout an old rule; `ds-imp` holds the few !important answers to legacy !important rules (for important
# declarations an earlier layer wins).
css = '@layer ds-imp, legacy, ds;\n@layer legacy {\n' + src('app.css') + '\n}\n' + src('design.css') + '\n@layer ds {\n' + src('checkout.css') + '\n}\n' + src('v2.css') + '\n'
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
# the recorded panduri notes and rhythms (strings/, rhythms/ — 2.4 MB, from sounds/make.cjs) are for the installable app only:
# the single file is within 1 MB of its limit, so there the physical model plays the notes and the rhythm recordings are not offered
NOT_INLINE = ('strings/', 'rhythms/')
media_inline = {m: 'data:audio/mpeg;base64,' + base64.b64encode(open(_inline_src(m), 'rb').read()).decode() for m in MEDIA if not _re.search(r'-\d\d\.mp3$', m) and not m.startswith(NOT_INLINE)}   # the ready-made slow versions stay out of the single file: it stretches in the browser instead, and the page must fit in 16 MB
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
CHORD_POSES = json.load(open('render/out/chord_poses.json')) if os.path.exists('render/out/chord_poses.json') else None
CHORD_KEYS = {k: True for k in CHORD_POSES} if CHORD_POSES is not None else None
def assets_js(inline):
    return 'PD.CHORD_POSES = ' + json.dumps(CHORD_KEYS, separators=(',', ':')) + '; PD.CONFIG = ' + json.dumps(CONFIG) + '; PD.assets = { hero: "' + hero + '", photos: ' + json.dumps(PHOTOS) + ', media: ' + json.dumps(media_inline if inline else {m: 'media/' + m for m in MEDIA}) + ', fig: ' + json.dumps(fig_map(inline)) + ' };'
for n in ORDER: assert '</script' not in src(n + '.js'), n
TITLE = 'ფანდური — Panduri Learning'
DESC = 'Learn the Georgian three-string panduri: lessons that wait for you, teacher video, tuner, chords, 3D instrument and a studio for teachers.'
# the languages other than Georgian and English: one pack per language, arrays aligned with a shared list of the
# English source, so the single-file build does not carry the English once per language
LANG_FILES = sorted(f[:-5] for f in os.listdir('i18n') if f.endswith('.json') and f != 'source.json') if os.path.isdir('i18n') else []
LANG_TR = {c: json.load(open(f'i18n/{c}.json', encoding='utf8')) for c in LANG_FILES}
LANG_SOURCE = json.load(open('i18n/source.json', encoding='utf8')) if LANG_FILES else {'templates': []}
# a language is offered only once most of its pack is there: a half-translated pack stays out of the picker and the build
_all_strings = LANG_SOURCE.get('exact', []) + LANG_SOURCE['templates']
_ready = [c for c in LANG_FILES if sum(k in LANG_TR[c] for k in _all_strings) >= .8 * len(_all_strings)]
LANG_HELD = [c for c in LANG_FILES if c not in _ready]
LANG_FILES = _ready; LANG_TR = {c: LANG_TR[c] for c in _ready}
LANG_KEYS = sorted({k for d in LANG_TR.values() for k in d})
LANG_JSON = {'_src': json.dumps({'keys': LANG_KEYS, 'templates': [k for k in LANG_SOURCE['templates'] if k in set(LANG_KEYS)]}, ensure_ascii=False, separators=(',', ':'))}
for c, d in LANG_TR.items(): LANG_JSON[c] = json.dumps([d.get(k) for k in LANG_KEYS], ensure_ascii=False, separators=(',', ':'))
LANG_TEMPLATES = [k for k in LANG_SOURCE['templates'] if k in set(LANG_KEYS)]
# the installable app reads one pack as a script; before core.js on start, so the first screen is already translated
LANG_BOOT = '<script>(function(){var L=' + json.dumps(LANG_FILES) + ',c;try{c=JSON.parse(localStorage.getItem("pd2:lang"))}catch(e){}if(!c){var n=navigator.languages||[navigator.language||"en"];for(var i=0;i<n.length;i++){var b=String(n[i]).toLowerCase().split(/[-_]/)[0];if(b==="ka"||b==="en"||L.indexOf(b)>=0){c=b;break}}}if(L.indexOf(c)>=0)document.write(\'<script src="js/lang/\'+c+\'.js"><\\/script>\')})()</script>'
for c, j in LANG_JSON.items(): assert '</script' not in j, c
LANG_LIST_TAG = '<script>window.PD_LANG_READY=' + json.dumps(LANG_FILES) + ';</script>'
LANG_INLINE = LANG_LIST_TAG + '\n' + '\n'.join(f'<script type="application/json" id="lang-{c}">{j}</script>' for c, j in LANG_JSON.items())
FONTS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Georgian:wght@300;400;500;600;700&family=Noto+Serif+Georgian:wght@600;700&display=swap'
def scripts_inline():
    out = [LANG_INLINE]   # before core.js, which reads the chosen language as soon as it runs
    for n in ORDER:
        js = src(n + '.js')
        if n in LAZY: out.append(f'<script type="text/plain" id="mod-{n}">\n{js}\n</script>')
        else: out.append(f'<script>/* {n}.js */\n{js}\n</script>')
        if n == 'core': out.append('<script>' + assets_js(True) + '</script>')
    return '\n'.join(out)
head_meta = f'''<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#08090B">
<meta name="description" content="{DESC}">
<title>{TITLE}</title>'''
# the first paint is only the app's background (no white flash while the scripts parse); the sign-in screen is the
# real opening, and the loading screen comes after signing in (PD.auth.arrive), while the profile and progress arrive.
SPLASH = """<div id="pd-splash" aria-hidden="true" style="position:fixed;inset:0;z-index:9999;background:#08090B;transition:opacity .28s ease"></div>"""
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
  add('meta', {{ name: 'theme-color', content: '#08090B' }});
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
shutil.copy('pwa/privacy.html', app + '/privacy.html')   # the privacy policy and data-deletion page Google and Meta link to
# the install prompt on Android, Windows and macOS shows these; without them it is a bare line of text
if os.path.isdir('pwa/shots'):
    shutil.rmtree(app + '/shots', ignore_errors=True)
    shutil.copytree('pwa/shots', app + '/shots')
open(app + '/app.css', 'w').write(css)
# Every script and the stylesheet carry the build's revision in their address. index.html is fetched from the network
# first, so a new build's page always asks for new addresses: a browser still run by the previous service worker cannot
# answer them from its old cache (with only four files versioned, the rest of an update stayed old until a second reload).
ASSET_REV = hashlib.sha1((css + ''.join(src(n + '.js') for n in ORDER)).encode()).hexdigest()[:10]
VERSIONED = set(ORDER)
tags = []
for n in ORDER:
    open(f'{app}/js/{n}.js', 'w').write(src(n + '.js'))
    if n not in LAZY: tags.append(f'<script src="js/{n}.js' + (f'?v={ASSET_REV}' if n in VERSIONED else '') + '"></script>')
    if n == 'core': tags.append(f'<script src="js/assets.js?v={ASSET_REV}"></script>'); tags.append(f'<script src="js/config.js?v={ASSET_REV}"></script>')
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
os.makedirs(app + '/js/lang', exist_ok=True)
for c, d in LANG_TR.items(): open(f'{app}/js/lang/{c}.js', 'w', encoding='utf8').write('(window.PD_LANG=window.PD_LANG||{})[' + json.dumps(c) + ']=' + json.dumps({'map': d, 'templates': LANG_TEMPLATES}, ensure_ascii=False, separators=(',', ':')) + ';\n')
for m in MEDIA: os.makedirs(os.path.dirname(app + '/media/' + m), exist_ok=True); shutil.copy(MEDIA_DIR + '/' + m, app + '/media/' + m)
if FIG_NAMES: shutil.copytree('assets/fig', app + '/fig')
lazy_loader = '<script>/* 3D renderer is fetched only when first used */\nObject.defineProperty(PD, "R3D", { configurable: true, get() { if (!PD._R3D) { const x = new XMLHttpRequest(); x.open("GET", "js/three3d.js", false); x.send(); const s = document.createElement("script"); s.textContent = x.responseText; document.head.appendChild(s); } return PD._R3D; } });\n</script>'
tags.insert(next(i for i, x in enumerate(tags) if x.startswith('<script src="js/instrument.js')), lazy_loader)
tags.insert(0, LANG_BOOT)
tags.insert(0, LANG_LIST_TAG)
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
<meta name="msapplication-TileColor" content="#08090B">
<meta name="color-scheme" content="dark">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="{FONTS}">
<link rel="stylesheet" href="app.css?v={ASSET_REV}">
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
# the teacher's own tuner app „სამი სიმი“, served beside the app at tuner/; it speaks the app's language
if os.path.exists('ext/sami-simi'): shutil.copytree('ext/sami-simi', app + '/tuner')
shell = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'] + [f'js/{n}.js' for n in ORDER if n in LAZY]
# The integrated tuner must work offline, and its engine changes must invalidate the app shell.
tuner_files = sorted(str(p).replace('\\', '/') for p in __import__('pathlib').Path('ext/sami-simi').rglob('*') if p.is_file() and p.suffix in ('.js', '.css', '.html', '.woff', '.woff2'))
shell += [p.replace('ext/sami-simi/', 'tuner/') for p in tuner_files]
tuner_digest = hashlib.sha1(b''.join(open(p, 'rb').read() for p in tuner_files)).hexdigest()
shell += [f'js/{n}.js?v={ASSET_REV}' for n in ORDER if n not in LAZY] + [f'js/assets.js?v={ASSET_REV}', f'js/config.js?v={ASSET_REV}', f'app.css?v={ASSET_REV}']
version = hashlib.sha1((tuner_digest + css + ''.join(src(n + '.js') for n in ORDER) + open('pwa/sw.js').read() + open(app + '/js/config.js').read() + ''.join(LANG_JSON.values()) + index + json.dumps(shell)).encode()).hexdigest()[:10]
sound_digest = hashlib.sha1(b''.join(open(p, 'rb').read() for p in ['src/sounddata.js'] + sorted(str(q) for q in __import__('pathlib').Path('ext/sami-simi/audio').glob('*.mp3')) if os.path.exists(p))).hexdigest()[:10]
open(app + '/sw.js', 'w').write(open('pwa/sw.js').read().replace('__VERSION__', version).replace('__SHELL__', json.dumps(shell)).replace('__SOUND__', sound_digest))
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
assert len(frag.encode('utf8')) < 16 * 1024 * 1024, 'artifact.html is over the 16 MiB limit'
print('held back (under 80%):', ', '.join(LANG_HELD) or 'none')
print('languages', ', '.join(f"{c} {len(d)}/{len(LANG_SOURCE.get('exact', [])) + len(LANG_SOURCE['templates'])}" for c, d in LANG_TR.items()) or 'none')
print('ok · single', len(single)//1024, 'KB · fragment', len(frag)//1024, 'KB · version', version)
