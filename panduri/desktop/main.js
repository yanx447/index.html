/* ფანდური for Windows and macOS: the built app (source/dist/app) in its own window.
   The microphone is analysed in the page, on this computer, exactly as in the browser; this file adds
   nothing that listens, reports or updates by itself. */
'use strict';
const { app, BrowserWindow, Menu, dialog, ipcMain, protocol, session, shell, systemPreferences } = require('electron');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

const SCHEME = 'panduri', HOST = 'app', ORIGIN = `${SCHEME}://${HOST}`;
const RETURN_SCHEME = 'com.yanx.panduri', RETURN = `${RETURN_SCHEME}://auth`;   // the same return link as the phone apps
const WEB = app.isPackaged ? path.join(process.resourcesPath, 'web') : path.join(__dirname, '..', 'source', 'dist', 'app');
const DEVELOPER_KA = 'ნუკრი ბერიძე', DEVELOPER_EN = 'Nukri Beridze';
const COPYRIGHT = `© 2026 ${DEVELOPER_KA} (${DEVELOPER_EN})`;
const ALLOWED = new Set(['media', 'notifications', 'fullscreen', 'clipboard-sanitized-write']);
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.wav': 'audio/wav', '.wasm': 'application/wasm', '.woff2': 'font/woff2' };

// secure: the microphone only works in a secure context; stream: audio and video can seek
protocol.registerSchemesAsPrivileged([{ scheme: SCHEME, privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true, codeCache: true } }]);
app.setPath('userData', path.join(app.getPath('appData'), 'Panduri'));   // the learner's progress: a plain path on every system

let win = null, pageListens = false;
const waitingLinks = [];
const ka = () => app.getLocale().toLowerCase().startsWith('ka');
const L = (georgian, english) => ka() ? georgian : english;
const ours = url => { try { return new URL(url).origin === ORIGIN || String(url).startsWith(ORIGIN); } catch (_) { return false; } };
const openOutside = url => { try { if (['http:', 'https:', 'mailto:'].includes(new URL(url).protocol)) return shell.openExternal(url); } catch (_) {} };
const focusWindow = () => { if (!win) return; if (win.isMinimized()) win.restore(); win.show(); win.focus(); };

/** one file of the app, with byte ranges so that the teacher's recordings can seek */
function serve(request) {
  const url = new URL(request.url);
  if (url.host !== HOST) return new Response(null, { status: 404 });
  const wanted = decodeURIComponent(url.pathname);
  const file = path.join(WEB, wanted.endsWith('/') ? wanted + 'index.html' : wanted);
  if (!file.startsWith(WEB + path.sep)) return new Response(null, { status: 403 });
  let size;
  try { const st = fs.statSync(file); if (!st.isFile()) throw 0; size = st.size; } catch (_) { return new Response(null, { status: 404 }); }
  const headers = { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' };
  const asked = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get('range') || '');
  if (asked && (asked[1] || asked[2])) {
    const start = asked[1] ? +asked[1] : Math.max(0, size - +asked[2]);
    const end = asked[1] && asked[2] ? Math.min(+asked[2], size - 1) : size - 1;
    if (start > end) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
    return new Response(Readable.toWeb(fs.createReadStream(file, { start, end })), { status: 206, headers: { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': String(end - start + 1) } });
  }
  return new Response(size ? Readable.toWeb(fs.createReadStream(file)) : null, { status: 200, headers: { ...headers, 'Content-Length': String(size) } });
}

/** the microphone, the camera and notifications: for this app only, and through the system's own question on macOS */
function permissions() {
  const ses = session.defaultSession;
  ses.setPermissionRequestHandler(async (_wc, permission, reply, details) => {
    if (!ALLOWED.has(permission) || !ours(details.requestingUrl)) return reply(false);
    if (permission !== 'media' || process.platform !== 'darwin') return reply(true);
    const kinds = { audio: 'microphone', video: 'camera' };
    for (const type of details.mediaTypes || []) if (kinds[type] && !(await systemPreferences.askForMediaAccess(kinds[type]))) return reply(false);
    reply(true);
  });
  ses.setPermissionCheckHandler((_wc, permission, origin) => ALLOWED.has(permission) && ours(origin));
}

function deliver(link) {
  if (!link || !link.startsWith(RETURN)) return;
  focusWindow();
  if (win && pageListens) win.webContents.send('app-url', link); else waitingLinks.push(link);
}

function about() {
  if (process.platform === 'darwin') return app.showAboutPanel();
  dialog.showMessageBox(win, { type: 'info', title: L('შესახებ', 'About'), message: 'ფანდური — Panduri Learning', detail: `${L('ვერსია', 'Version')} ${app.getVersion()}\n\nდეველოპერი: ${DEVELOPER_KA}\nDeveloper: ${DEVELOPER_EN}\n\n${COPYRIGHT}`, buttons: ['OK'] });
}

function menu() {
  const mac = process.platform === 'darwin';
  const aboutItem = { label: L('ფანდურის შესახებ', 'About Panduri'), click: about };
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    ...(mac ? [{ label: 'ფანდური', submenu: [aboutItem, { type: 'separator' }, { role: 'hide', label: L('დამალვა', 'Hide') }, { role: 'hideOthers', label: L('სხვების დამალვა', 'Hide Others') }, { type: 'separator' }, { role: 'quit', label: L('გასვლა', 'Quit') }] }] : []),
    { label: L('რედაქტირება', 'Edit'), submenu: [{ role: 'undo', label: L('გაუქმება', 'Undo') }, { role: 'redo', label: L('დაბრუნება', 'Redo') }, { type: 'separator' }, { role: 'cut', label: L('ამოჭრა', 'Cut') }, { role: 'copy', label: L('კოპირება', 'Copy') }, { role: 'paste', label: L('ჩასმა', 'Paste') }, { role: 'selectAll', label: L('ყველას მონიშვნა', 'Select All') }] },
    { label: L('ხედი', 'View'), submenu: [{ role: 'resetZoom', label: L('ჩვეულებრივი ზომა', 'Actual Size') }, { role: 'zoomIn', label: L('გადიდება', 'Zoom In') }, { role: 'zoomOut', label: L('დაპატარავება', 'Zoom Out') }, { type: 'separator' }, { role: 'togglefullscreen', label: L('მთელ ეკრანზე', 'Full Screen') }] },
    ...(mac ? [] : [{ label: L('დახმარება', 'Help'), submenu: [aboutItem] }])
  ]));
}

function open() {
  win = new BrowserWindow({
    width: 1280, height: 820, minWidth: 360, minHeight: 560, show: false, backgroundColor: '#0B0A09', autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true, nodeIntegration: false, backgroundThrottling: false }   // listening and the metronome keep time when another window is in front
  });
  win.once('ready-to-show', () => win.show());
  win.on('closed', () => { win = null; pageListens = false; });
  win.webContents.setWindowOpenHandler(({ url }) => { if (ours(url)) return { action: 'allow' }; openOutside(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (event, url) => { if (!ours(url)) { event.preventDefault(); openOutside(url); } });
  win.webContents.on('did-start-navigation', (_e, _url, inPlace, mainFrame) => { if (mainFrame && !inPlace) pageListens = false; });
  win.loadURL(`${ORIGIN}/index.html`);
}

if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on('second-instance', (_e, argv) => { focusWindow(); deliver(argv.find(a => a.startsWith(RETURN))); });
  app.on('open-url', (event, url) => { event.preventDefault(); deliver(url); });   // macOS
  ipcMain.on('app-url-ready', () => { pageListens = true; waitingLinks.splice(0).forEach(deliver); });
  ipcMain.on('focus', focusWindow);
  ipcMain.handle('open-external', (_e, url) => { try { if (new URL(url).protocol === 'https:') return shell.openExternal(url); } catch (_) {} });
  app.on('window-all-closed', () => app.quit());
  app.whenReady().then(() => {
    protocol.handle(SCHEME, serve);
    permissions();
    app.setAsDefaultProtocolClient(RETURN_SCHEME);
    app.setAboutPanelOptions({ applicationName: 'ფანდური — Panduri Learning', applicationVersion: app.getVersion(), version: '', credits: `დეველოპერი: ${DEVELOPER_KA}\nDeveloper: ${DEVELOPER_EN}`, copyright: COPYRIGHT });
    menu();
    open();
    deliver(process.argv.find(a => a.startsWith(RETURN)));   // Windows: the first start came from the link itself
  });
}
