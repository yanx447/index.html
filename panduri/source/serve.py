"""One local host for everything, laid out like the published site (yanx447.github.io/index.html/):

    /panduri/app/   the app, fresh from this build (dist/app) — not the deployed copy in panduri/app/
    /panduri/app/tuner/  the tuner („სამი სიმი“), built into the app
    /apps/          the Studio Plus+ apps page
    /panduri/...    everything else under the repository, e.g. /panduri/ai/ for the models the app loads
    /               → /panduri/app/

Paths match the live site, so code that looks at location.pathname (ai.js) behaves the same here.
`python3 -m http.server` keeps a queue of 5 waiting connections; the app asks for ~60 scripts at once,
macOS resets the rest, a module fails to load and the screen stays black — hence request_queue_size."""
import http.server, os, posixpath, sys, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
# longest prefix first; anything else is served from the repository root
ROUTES = [
    ('/panduri/app/', os.path.join(HERE, 'dist', 'app')),
]
HIDDEN = {'node_modules', '__pycache__'}

class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        path = urllib.parse.unquote(urllib.parse.urlsplit(path).path)
        parts = [p for p in posixpath.normpath(path).split('/') if p and p not in ('.', '..')]
        # never hand out .git, .claude, .env or installed packages, even on localhost
        if any(p.startswith('.') or p in HIDDEN for p in parts): return os.path.join(REPO, '.missing')
        clean = '/' + '/'.join(parts) + ('/' if path.endswith('/') and parts else '')
        for prefix, root in ROUTES:
            if clean == prefix.rstrip('/') or clean.startswith(prefix):
                return os.path.join(root, *clean[len(prefix):].split('/')) if clean.startswith(prefix) else root
        return os.path.join(REPO, *parts)

    def do_GET(self):
        # the app used to be served at / — a service worker registered there would still control
        # /panduri/app/ with an old cache. When the browser re-checks /sw.js, this one removes itself.
        if urllib.parse.urlsplit(self.path).path == '/sw.js':
            body = (b"self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',e=>e.waitUntil("
                    b"caches.keys().then(k=>Promise.all(k.map(n=>caches.delete(n)))).then(()=>self.registration.unregister())"
                    b".then(()=>self.clients.matchAll()).then(cs=>cs.forEach(c=>c.navigate(c.url)))));")
            self.send_response(200); self.send_header('Content-Type', 'text/javascript'); self.send_header('Content-Length', str(len(body))); self.end_headers(); self.wfile.write(body); return
        if urllib.parse.urlsplit(self.path).path == '/':
            self.send_response(302); self.send_header('Location', '/panduri/app/'); self.end_headers(); return
        super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')   # a fresh build must never be hidden behind a cached file
        super().end_headers()

class Server(http.server.ThreadingHTTPServer):
    request_queue_size = 256

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8181
# a server left running from an earlier `npm run dev` keeps the port: take the next free one instead of failing
for p in range(port, port + 20):
    try: srv = Server(('127.0.0.1', p), Handler); break
    except OSError: print(f'port {p} is busy, trying {p + 1}', flush=True)
else: sys.exit(f'no free port in {port}..{port + 19}')
u = f'http://localhost:{p}'
print(f'{u}/panduri/app/   the app (this build)\n{u}/panduri/app/tuner/   the tuner\n{u}/apps/          the apps page', flush=True)
try: srv.serve_forever()
except KeyboardInterrupt: pass
