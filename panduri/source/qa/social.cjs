/* The community as a person sees it: the feed (global / friends), a post's comments, reactions, the composer,
   friends by nickname, a chat with a photo and a reaction, and Sima's notification inside the app.
   The server is played by this script (page.route): every answer below is what the real RPC returns in
   backend/social-sql.test.mjs, so this checks the screens, not the SQL.
   Run: python3 build.py && node qa/social.cjs   (needs dist/app; serves it itself; screenshots → qa/out/social-*.png) */
const path = require('path'), fs = require('fs'), http = require('http');
const { chromium } = require(path.join(__dirname, '..', 'node_modules', 'playwright'));
const ROOT = path.join(__dirname, '..', 'dist', 'app'), OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
const SB = 'https://tecynfffgjgrcafmfqty.supabase.co', ME = '11111111-1111-1111-1111-111111111111', NINO = '22222222-2222-2222-2222-222222222222', GIO = '33333333-3333-3333-3333-333333333333';
const now = Date.now(), iso = m => new Date(now - m * 60000).toISOString();
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webmanifest': 'application/manifest+json', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (f.endsWith('/')) f += 'index.html'; if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });

const V = (id, who, name, nick, o) => Object.assign({ id, author: who, author_name: name, author_nick: nick, author_avatar: null, author_level: 3, kind: 'video', caption: '', song: '', media_path: who + '/p/v' + id + '.webm', thumb_path: who + '/p/v' + id + '.jpg', media_meta: { dur: 2, w: 1080, h: 1920 }, visibility: 'public', reactions: 0, comments: 0, shares: 0, views: 0, created_at: iso(60), my_reaction: null, top: [], friend: false, seen: false, saved: false }, o);
const posts = [
  V(41, NINO, 'ნინო', 'nino.panduri', { caption: 'მრავალჟამიერი — პირველად სამივე ხმით 🎶 #ფანდური', song: 'მრავალჟამიერი', reactions: 128, comments: 2, shares: 3, views: 1540, created_at: iso(42), friend: true }),
  V(40, GIO, 'გიორგი', 'gio', { caption: 'ახალი ფანდური ხელოსნისგან', song: 'მთიულური', reactions: 12, views: 88, created_at: iso(300), my_reaction: 'panduri', media_meta: { dur: 2, w: 1920, h: 1080 } }),
  V(39, NINO, 'ნინო', 'nino.panduri', { caption: 'შენ როგორ უკრავ ამ ადგილს?', visibility: 'friends', reactions: 5, comments: 1, views: 20, created_at: iso(1500), friend: true, seen: true, saved: true }),
  V(38, GIO, 'გიორგი', 'gio', { caption: 'ხორუმი, ნელა', song: 'ხორუმი', views: 3, created_at: iso(2900), seen: true }),
  V(37, GIO, 'გიორგი', 'gio', { caption: 'აჭარული', song: 'აჭარული', views: 1, created_at: iso(4000), seen: true }),
  { id: 36, author: GIO, author_name: 'გიორგი', author_nick: 'gio', kind: 'photo', caption: 'ძველი ფოტო', media_path: GIO + '/p/a.jpg', thumb_path: null, media_meta: {}, visibility: 'public', reactions: 0, comments: 0, shares: 0, views: 0, created_at: iso(5000), my_reaction: null, top: [], friend: false, seen: true }
];
const friends = [
  { id: NINO, nickname: 'nino.panduri', display_name: 'ნინო', avatar_url: null, level: 4, vip: false, relation: 'friend', since: iso(9000), last_seen: iso(3) },
  { id: GIO, nickname: 'gio', display_name: 'გიორგი', avatar_url: null, level: 2, vip: false, relation: 'incoming', since: iso(30), last_seen: iso(30) }
];
const CONV = '99999999-0000-0000-0000-000000000001';
const messages = [
  { id: 1, sender: NINO, body: 'გამარჯობა! ჩემი ახალი ვიდეო ნახე?', created_at: iso(30), media_path: null, thumb_path: null, media_kind: null, media_meta: {}, post_ref: null },
  { id: 2, sender: NINO, body: '', created_at: iso(29), media_path: null, thumb_path: null, media_kind: null, media_meta: {}, post_ref: 41 },
  { id: 3, sender: ME, body: '', created_at: iso(20), media_path: ME + '/c/p.jpg', thumb_path: null, media_kind: 'photo', media_meta: { w: 1200, h: 900 }, post_ref: null },
  { id: 4, sender: ME, body: 'ესაა ჩემი ფანდური 🙂', created_at: iso(19), media_path: null, thumb_path: null, media_kind: null, media_meta: {}, post_ref: null },
  { id: 5, sender: NINO, body: '', created_at: iso(18), media_path: null, thumb_path: null, media_kind: null, media_meta: {}, post_ref: null, sticker: 'bravo' },
  { id: 6, sender: NINO, body: '', created_at: iso(17), media_path: null, thumb_path: null, media_kind: null, media_meta: { w: 200, h: 150 }, post_ref: null, gif: 'https://media2.giphy.com/media/qa/200w.gif' }
];
const sent = [];
const notes = [{ id: 7, kind: 'friend_post', actor: NINO, params: { name: 'ნინო', what: 'video', s: 'მრავალჟამიერი', post: 41 }, title: 'სიმა · მეგობრის ახალი პოსტი', body: 'ნინო ახალ ვიდეოს აზიარებს: „მრავალჟამიერი“', go: 'community:p:41', tag: 'fp:41', created_at: iso(40), read_at: null }];
let later = [];   // notifications the "server" adds during the run
const calls = [];

async function fakeServer(route, media) {
  const u = new URL(route.request().url()), p = u.pathname, m = route.request().method();
  const body = (() => { try { return JSON.parse(route.request().postData() || 'null'); } catch (_) { return null; } })();
  const json = (v, s) => route.fulfill({ status: s || 200, contentType: 'application/json', body: JSON.stringify(v) });
  calls.push(m + ' ' + p + (p.includes('/rpc/') && body ? ' ' + JSON.stringify(body).slice(0, 80) : ''));
  if (process.env.LEGACY) {   // a server without the community upgrade: no new columns, functions or tables
    if (p === '/rest/v1/messages' && m === 'GET' && /sticker/.test(u.searchParams.get('select') || '')) return json({ code: '42703', message: 'column messages.sticker does not exist' }, 400);
    if (/\/rpc\/(feed|my_friends|find_nickname|save_notify_settings|notifications_read|chat_mark_read)$/.test(p)) return json({ code: 'PGRST202', message: 'Could not find the function' }, 404);
    if (/\/rest\/v1\/(notifications|message_reactions)$/.test(p)) return json({ code: 'PGRST205', message: 'Could not find the table' }, 404);
    if (p === '/rest/v1/messages' && m === 'GET') return json(messages.slice(0, 1).map(x => ({ id: x.id, sender: x.sender, body: x.body, created_at: x.created_at })));
  }
  if (p.startsWith('/media/')) return route.fulfill({ status: 200, contentType: media[p].type, body: media[p].buf });
  if (p === '/auth/v1/user') return json({ id: ME, email: 'me@test.ge', created_at: iso(99999) });
  if (p === '/auth/v1/settings') return json({ external: { email: true, google: true } });
  if (p === '/rest/v1/profiles') return json(m === 'GET' ? [{ id: ME, display_name: 'ნუკრი', nickname: 'nukri', role: 'user', level: 3, xp: 120, avatar_url: null }] : []);
  if (p === '/rest/v1/progress') return json([]);
  if (p === '/rest/v1/rpc/is_owner') return json(false);
  if (p === '/rest/v1/rpc/feed') { const tab = body.tab; let rows = tab === 'foryou' ? posts.filter(x => x.visibility === 'public') : tab === 'friends' ? posts.filter(x => x.friend) : tab === 'saved' ? posts.filter(x => x.saved) : tab === 'one' ? posts.filter(x => x.id === body.before_id) : tab === 'user' ? posts.filter(x => x.author === body.target) : [];
    if (body.skip_ids) rows = rows.filter(x => !body.skip_ids.includes(x.id)); if (body.before_id && tab === 'friends') rows = rows.filter(x => x.id < body.before_id); return json(rows.slice(0, body.lim || 8)); }
  if (p === '/storage/v1/object/sign/social') return json(body.paths.map(x => ({ path: x, signedURL: '/object/sign/social/' + x + '?token=t', error: null })));
  if (p.startsWith('/storage/v1/object/sign/social/')) { const f = p.endsWith('.webm') ? '/media/v.webm' : p.endsWith('.mp3') ? '/media/s.mp3' : '/media/a.jpg'; const buf = media[f].buf, rg = /bytes=(\d+)-(\d*)/.exec(route.request().headers().range || '');
    if (rg) { const a = +rg[1], z = rg[2] ? Math.min(+rg[2], buf.length - 1) : buf.length - 1; return route.fulfill({ status: 206, headers: { 'Content-Type': media[f].type, 'Content-Range': 'bytes ' + a + '-' + z + '/' + buf.length, 'Accept-Ranges': 'bytes' }, body: buf.subarray(a, z + 1) }); }
    return route.fulfill({ status: 200, headers: { 'Content-Type': media[f].type, 'Accept-Ranges': 'bytes' }, body: buf }); }
  if (p === '/rest/v1/rpc/my_friends') return json(friends);
  if (p === '/rest/v1/rpc/find_nickname') return json(body.nick === 'gio' ? [{ id: GIO, nickname: 'gio', display_name: 'გიორგი', avatar_url: null, level: 2, relation: 'incoming' }] : []);
  if (p === '/rest/v1/rpc/my_conversations') return json([{ id: CONV, other: NINO, other_name: 'ნინო', other_avatar: null, other_nick: 'nino.panduri', last_at: iso(19), last_body: 'ესაა ჩემი ფანდური 🙂', last_sender: ME, last_kind: null, unread: 2 }]);
  if (p === '/rest/v1/feed_posts' && m === 'POST') { sent.push(body[0]); return json([Object.assign({ id: 99, author: ME, reactions: 0, comments: 0, shares: 0, views: 0, created_at: new Date().toISOString() }, body[0])], 201); }
  if (p.startsWith('/storage/v1/object/social/') && m === 'POST') return json({ Key: p });
  if (p === '/rest/v1/rpc/save_post') return json(!!body.keep);
  if (p === '/rest/v1/messages') { if (m === 'POST') { sent.push(body[0]); return json(body); } return json(u.searchParams.get('id') ? [] : messages.slice().reverse()); }
  if (p === '/functions/v1/gifs') return json(u.searchParams.get('probe') ? { on: true } : [1, 2, 3, 4].map(i => ({ id: 'g' + i, title: 'gif ' + i, url: 'https://media2.giphy.com/media/qa' + i + '/200w.gif', preview: 'https://media2.giphy.com/media/qa' + i + '/100w.gif', w: 200, h: 150 })));
  if (p === '/rest/v1/message_reactions') return json([{ message_id: 3, user_id: NINO, emoji: 'panduri' }, { message_id: 1, user_id: ME, emoji: 'heart' }]);
  if (p === '/rest/v1/feed_comments') return json([{ id: 1, author: GIO, author_name: 'გიორგი', body: 'ძალიან კარგია! 👏', created_at: iso(20) }, { id: 2, author: ME, author_name: 'ნუკრი', body: 'შესანიშნავია', created_at: iso(10) }]);
  if (p === '/rest/v1/notifications') { const after = +(u.searchParams.get('id') || '').replace('gt.', '') || 0; if (u.searchParams.get('read_at')) return json([]); return json(notes.concat(later).filter(n => n.id > after).sort((a, b) => b.id - a.id)); }
  if (p === '/functions/v1/push') return json({ key: 'BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' });
  if (p.startsWith('/rest/v1/rpc/')) return json(p.endsWith('react_post') ? body.emoji : p.endsWith('react_message') ? body.emoji : null);
  return json([]);
}

(async () => {
  await new Promise(r => srv.listen(0, r)); const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const b = await chromium.launch({ args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'] });   // a pretend camera, for filming on the computer
  // a short video, made in the browser (no ffmpeg needed), and a photo
  const mk = await b.newPage();
  const film = (w, hh, sec) => mk.evaluate(async ([w, hh, sec]) => {
    const c = document.createElement('canvas'); c.width = w; c.height = hh; const g = c.getContext('2d'); const st = c.captureStream(30);
    const ac = new AudioContext(), dst = ac.createMediaStreamDestination(), osc = ac.createOscillator(), gn = ac.createGain(); gn.gain.value = .05; osc.frequency.value = 220; osc.connect(gn).connect(dst); osc.start();
    dst.stream.getAudioTracks().forEach(tr => st.addTrack(tr));
    const rec = new MediaRecorder(st, { mimeType: 'video/webm' }), parts = []; rec.ondataavailable = e => parts.push(e.data);
    rec.start(); const t0 = performance.now();
    await new Promise(res => { (function f() { const k = (performance.now() - t0) / 1000; g.fillStyle = '#3B2414'; g.fillRect(0, 0, w, hh); g.fillStyle = '#C98B5B'; g.beginPath(); g.arc(w / 2 + Math.sin(k * 3) * w / 4, hh / 2, w / 6, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = Math.round(w / 12) + 'px sans-serif'; g.fillText('ფანდური ' + k.toFixed(1), w / 4, hh / 5); if (k < sec) requestAnimationFrame(f); else res(); })(); });
    rec.stop(); await new Promise(r => rec.onstop = r); osc.stop();
    const buf = await new Blob(parts).arrayBuffer(); return [...new Uint8Array(buf)];
  }, [w, hh, sec]);
  const webm = Buffer.from(await film(360, 640, 2));
  const TMP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'pd-reel-'));
  fs.writeFileSync(path.join(TMP, 'small.webm'), webm); fs.writeFileSync(path.join(TMP, 'ok.webm'), Buffer.from(await film(720, 1280, 2)));
  await mk.close();
  const media = { '/media/v.webm': { type: 'video/webm', buf: webm }, '/media/a.jpg': { type: 'image/jpeg', buf: fs.readFileSync(path.join(__dirname, '..', 'assets', 'pan-front.jpg')) }, '/media/s.mp3': { type: 'audio/mpeg', buf: fs.readFileSync(path.join(__dirname, '..', '..', 'app', 'media', 'bani', 'music-60.mp3')) } };
  const report = [];
  for (const [label, vp] of [['phone', { width: 390, height: 844 }], ['desktop', { width: 1440, height: 900 }]]) {
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1, hasTouch: label === 'phone' });
    const pg = await ctx.newPage(); const errs = [];
    pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_|Failed to load resource|favicon/.test(m.text())) errs.push(m.text()); });
    await pg.route(SB + '/**', r => fakeServer(r, media));
    await pg.route('https://media2.giphy.com/**', r => r.fulfill({ status: 200, contentType: 'image/jpeg', body: media['/media/a.jpg'].buf }));
    await pg.addInitScript(([me]) => {
      const S = (k, v) => localStorage.setItem('pd2:' + k, JSON.stringify(v));
      if (!localStorage.getItem('pd2:qa')) {
        S('qa', 1); S('lang', 'ka'); S('language.chosen', true); S('onboarded', true); S('intro.done', true); S('md.rules.' + me, true); S('cm.tab', 'feed'); S('fd.tab', 'foryou');
        S('cloud.session', { access_token: 'x.y.z', refresh_token: 'r', expires_at: Math.floor(Date.now() / 1000) + 3600, user: { id: me, email: 'me@test.ge', created_at: '2026-01-01T00:00:00Z' } });
        S('notify', { on: true, hour: 19, quiet: false, kinds: {} });
      }
    }, [ME]);
    // NEEDTAP=1: a browser that refuses sound before a tap (as a phone may): play() with sound fails until a real click has happened
    if (process.env.NEEDTAP) await pg.addInitScript(() => { let ok = false; addEventListener('click', () => { ok = true; }, true); const real = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () { if (!this.muted && !ok) return Promise.reject(new DOMException('needs a tap', 'NotAllowedError')); return real.call(this); }; });
    await pg.goto(base + 'index.html'); await pg.waitForTimeout(1500);
    if (process.env.LEGACY) {
      await pg.evaluate(() => { document.querySelectorAll('.ob,.lf,.ag').forEach(x => x.remove()); PD.app.go('community'); }); await pg.waitForTimeout(1500);
      const feedMsg = await pg.evaluate(() => (document.querySelector('.fd-scroll, .cm-body') || {}).textContent);
      await pg.evaluate(c => PD.app.go('community', 'c:' + c + ':ნინო'), CONV); await pg.waitForTimeout(2000);
      const chat = await pg.evaluate(() => [...document.querySelectorAll('.cm-msg p')].map(x => x.textContent));
      await pg.click('.ck-toggle'); await pg.click('.ck-tabs button:nth-child(2)'); await pg.click('.ck-stb >> nth=0'); await pg.waitForTimeout(400);
      report.push([label, 'legacy server', { feedMsg, chat, toast: await pg.evaluate(() => (document.querySelector('.toast') || {}).textContent), errs }]);
      await ctx.close(); continue;
    }
    await pg.evaluate(() => { document.querySelectorAll('.ob,.lf,.ag').forEach(x => x.remove()); PD.app.go('community'); }); await pg.waitForTimeout(1800);
    const shot = n => pg.screenshot({ path: path.join(OUT, `social-${label}-${n}.png`) });
    await shot('1-feed');
    const geo = () => pg.evaluate(() => { const st = document.querySelector('.fd-stage'), s = document.querySelector('.fd-scroll'), c = s && s.querySelector('.fd-card.act'), r = st && st.getBoundingClientRect(), nav = document.querySelector('.dock');
      const v = c && c.querySelector('video'), box = q => { const e = document.querySelector(q); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.width)]; };
      return { cards: s ? s.querySelectorAll('.fd-card[data-id]').length : 0, stage: r && [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], navTop: nav && getComputedStyle(nav).display !== 'none' ? Math.round(nav.getBoundingClientRect().top) : null, vw: innerWidth, vh: innerHeight,
        act: c && c.dataset.id, playing: v ? !v.paused : null, muted: v ? v.muted : null, t: v ? +v.currentTime.toFixed(2) : null, needTap: st.classList.contains('need-tap'), players: document.querySelectorAll('.fd-scroll video').length,
        ahead: [...s.querySelectorAll('.fd-card[data-id]')].map(x => { const q = x.querySelector('video'); return x.dataset.id + ':' + (q ? 'rs' + q.readyState + (q.paused ? 'p' : '>') : '-'); }).join(' '),
        friends: box('.fd-friends'), seg: box('.fd-seg'), msgs: box('.fd-msgs'), plus: box('.fd-new'), badge: (document.querySelector('.fd-msgs .cm-dot') || {}).textContent, reqs: (document.querySelector('.fd-friends .cm-dot') || {}).textContent,
        overflowX: document.documentElement.scrollWidth > innerWidth, info: c && [...c.querySelectorAll('.fd-info b')].map(x => x.textContent), rail: c && [...c.querySelectorAll('.fd-rail .fd-act, .fd-rail .fd-facebtn, .fd-rail .fd-disc')].map(x => x.getAttribute('aria-label')), nav: [...document.querySelectorAll('.dock .nv')].map(b => (b.textContent || b.getAttribute('aria-label')) + (b.getAttribute('aria-current') ? '*' : '')), navW: document.querySelector('.dock') && getComputedStyle(document.querySelector('.dock')).display !== 'none' ? [...document.querySelectorAll('.dock .nv')].map(b => Math.round(b.getBoundingClientRect().width)) : null, clipped: [...document.querySelectorAll('.dock .nv-l')].filter(x => x.offsetWidth && x.scrollWidth > x.clientWidth + 1).map(x => x.textContent), fit: v && getComputedStyle(v).objectFit, simaFab: !!document.querySelector('.sm-fab') && getComputedStyle(document.querySelector('.sm-fab')).display }; });
    const g = await geo();
    report.push([label, 'feed opens', g]);
    if (g.needTap) { await pg.click('.fd-tapsnd'); await pg.waitForTimeout(500); report.push([label, 'after tap', await pg.evaluate(() => { const v = document.querySelector('.fd-card.act video'); return { muted: v.muted, playing: !v.paused, chip: getComputedStyle(document.querySelector('.fd-tapsnd')).display }; })]); }
    // the motion: what runs, measured while it runs (screenshots cannot show it)
    {
      const mv = {};
      mv.intro = await pg.evaluate(() => { const c = document.querySelector('.fd-card.act'); return { cls: c.classList.contains('fd-in'), rail: getComputedStyle(c.querySelector('.fd-rail > *')).animationName, info: getComputedStyle(c.querySelector('.fd-info > *')).animationName, disc: getComputedStyle(c.querySelector('.fd-vinyl')).animationPlayState, marq: getComputedStyle(c.querySelector('.fd-marq > span')).animationName }; });
      const r0 = await pg.evaluate(() => { const r = document.querySelector('.fd-card.act .fd-media').getBoundingClientRect(); return [r.left + r.width * .3, r.top + r.height * .55]; });
      await pg.mouse.click(r0[0], r0[1]); await pg.waitForTimeout(60); await pg.mouse.click(r0[0], r0[1]); await pg.waitForTimeout(120);
      mv.doubleTap = await pg.evaluate(() => { const c = document.querySelector('.fd-card.act'), b = c.querySelector('.rx-burst'); return { burst: !!b, sparks: c.querySelectorAll('.fd-spark').length, notes: c.querySelectorAll('.fd-spark.note').length }; });
      await pg.waitForTimeout(1200);
      mv.cleaned = await pg.evaluate(() => document.querySelectorAll('.rx-burst,.fd-spark,.fd-ring').length);
      await pg.click('.fd-card.act .fd-rx'); await pg.waitForTimeout(30);
      await pg.click('.fd-card.act .fd-rx'); await pg.waitForTimeout(60);
      mv.likeRing = await pg.evaluate(() => ({ ring: document.querySelectorAll('.fd-card.act .fd-ring').length, sparks: document.querySelectorAll('.fd-card.act .fd-rail .fd-spark').length }));
      await pg.click('.fd-card.act .fd-rx'); await pg.waitForTimeout(500);
      const ind0 = await pg.evaluate(() => getComputedStyle(document.querySelector('.fd-seg-ind')).transform);
      await pg.click('.fd-seg button[data-k=friends]'); await pg.waitForTimeout(90);
      mv.tabSwitch = await pg.evaluate(() => ({ scrollAnim: document.querySelector('.fd-scroll').getAnimations().length, ind: getComputedStyle(document.querySelector('.fd-seg-ind')).transform }));
      mv.tabSwitch.indMoved = mv.tabSwitch.ind !== ind0; delete mv.tabSwitch.ind;
      await pg.waitForTimeout(1200); await pg.click('.fd-seg button[data-k=foryou]'); await pg.waitForTimeout(1300);
      await pg.click('.fd-msgs'); await pg.waitForTimeout(120);
      mv.pushToMessages = await pg.evaluate(() => ({ leaving: !!document.querySelector('.page.leave'), anims: [...document.querySelectorAll('.page')].reduce((n, x) => n + x.getAnimations().length, 0) }));
      await pg.waitForTimeout(900);
      await pg.evaluate(() => PD.app.back('community')); await pg.waitForTimeout(120);
      mv.backToFeed = await pg.evaluate(() => ({ anims: [...document.querySelectorAll('.page')].reduce((n, x) => n + x.getAnimations().length, 0) }));
      await pg.waitForTimeout(1500);
      mv.feedBack = await pg.evaluate(() => ({ cards: document.querySelectorAll('.fd-card[data-id]').length, playing: !!document.querySelector('.fd-card.act.playing') }));
      report.push([label, 'motion', mv]);
    }
    // tap = pause, tap = play; two taps = like
    const mid = await pg.evaluate(() => { const r = document.querySelector('.fd-stage').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height * .4]; });
    await pg.mouse.click(mid[0], mid[1]); await pg.waitForTimeout(500); const paused = await pg.evaluate(() => { const c = document.querySelector('.fd-card.act'); return [c.querySelector('video').paused, c.classList.contains('paused')]; }); await shot('2-paused');
    await pg.mouse.click(mid[0], mid[1]); await pg.waitForTimeout(500); const again = await pg.evaluate(() => !document.querySelector('.fd-card.act video').paused);
    await pg.mouse.click(mid[0], mid[1]); await pg.waitForTimeout(90); await pg.mouse.click(mid[0], mid[1]); await pg.waitForTimeout(500);
    report.push([label, 'tap', { paused, playsAgain: again, doubleTap: await pg.evaluate(() => { const c = document.querySelector('.fd-card.act'); return { liked: c.querySelector('.fd-rx').classList.contains('on'), n: c.querySelector('.fd-col small').textContent, stillPlaying: !c.querySelector('video').paused }; }) }]);
    // like off again, save, comments, share
    await pg.click('.fd-card.act .fd-rx'); await pg.click('.fd-card.act .fd-save'); await pg.waitForTimeout(400);
    const rail = await pg.evaluate(() => { const c = document.querySelector('.fd-card.act'); return { liked: c.querySelector('.fd-rx').classList.contains('on'), n: c.querySelector('.fd-col small').textContent, saved: c.querySelector('.fd-save').classList.contains('on') }; });
    await pg.click('.fd-card.act .fd-cm'); await pg.waitForTimeout(500); await shot('3-comments');
    rail.comments = await pg.evaluate(() => [...document.querySelectorAll('.fd-cms .cm-reply p')].map(x => x.textContent));
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(300);
    await pg.click('.fd-card.act .fd-sh'); await pg.waitForTimeout(600); await shot('4-share');
    rail.shareTo = await pg.evaluate(() => [...document.querySelectorAll('.sheet .cm-row b')].map(x => x.textContent));
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(300);
    report.push([label, 'rail', rail]);
    // one swipe, one video — and how evenly the frames come while it moves (a desktop browser without a screen: a hint, not a phone)
    const swipe = await pg.evaluate(async () => {
      const s = document.querySelector('.fd-scroll'), hh = s.clientHeight, gaps = []; let last = performance.now(), on = true;
      (function f(now) { gaps.push(now - last); last = now; if (on) requestAnimationFrame(f); })(last);
      const stops = [];
      for (let i = 1; i <= 3; i++) { s.scrollBy({ top: hh, behavior: 'smooth' }); await new Promise(r => setTimeout(r, 900)); stops.push(+(s.scrollTop / hh).toFixed(3)); }
      on = false; gaps.shift();
      const sorted = gaps.slice().sort((a, b) => a - b);
      return { stops, frames: gaps.length, median: +sorted[sorted.length >> 1].toFixed(1), p95: +sorted[Math.floor(sorted.length * .95)].toFixed(1), over25ms: gaps.filter(x => x > 25).length };
    });
    await pg.waitForTimeout(600);
    const g2 = await geo(); await shot('5-fourth');
    report.push([label, 'swipes', Object.assign(swipe, { act: g2.act, playing: g2.playing, muted: g2.muted, players: g2.players, ahead: g2.ahead, othersPaused: await pg.evaluate(() => [...document.querySelectorAll('.fd-card:not(.act) video')].every(v => v.paused)) })]);
    await pg.evaluate(() => document.querySelector('.fd-scroll').scrollTo({ top: 0, behavior: 'instant' })); await pg.waitForTimeout(700);
    await pg.evaluate(() => { const q = document.querySelector('.fd-scroll'); q.scrollTo({ top: q.clientHeight, behavior: 'instant' }); }); await pg.waitForTimeout(900); await shot('6-wide');
    report.push([label, 'sideways video', await pg.evaluate(() => { const c = document.querySelector('.fd-card.act'), v = c.querySelector('video'); return { id: c.dataset.id, top: document.querySelector('.fd-scroll').scrollTop, acts: document.querySelectorAll('.fd-card.act').length, fit: getComputedStyle(v).objectFit, song: (c.querySelector('.fd-song b') || {}).textContent, add: !!c.querySelector('.fd-add') }; })]);
    // friends' videos
    await pg.click('.fd-seg button[data-k=friends]'); await pg.waitForTimeout(1300); await shot('7-friends-feed');
    report.push([label, 'friends feed', await pg.evaluate(() => ({ ids: [...document.querySelectorAll('.fd-card[data-id]')].map(c => c.dataset.id), on: document.querySelector('.fd-seg .on').textContent, playing: !(document.querySelector('.fd-card.act video') || { paused: true }).paused }))]);
    await pg.click('.fd-seg button[data-k=foryou]'); await pg.waitForTimeout(900);
    // a new video: too small is refused, 720p goes through as it is
    await pg.click('.fd-new'); await pg.waitForTimeout(400); await shot('8-compose');
    const comp = { buttons: await pg.evaluate(() => [...document.querySelectorAll('.fd-pick')].map(x => x.textContent)), rules: await pg.evaluate(() => document.querySelector('.fd-rules').textContent), feedPausedBehind: await pg.evaluate(() => (document.querySelector('.fd-card.act video') || {}).paused) };
    let fc = pg.waitForEvent('filechooser'); await pg.click('.fd-pick >> nth=1'); await (await fc).setFiles(path.join(TMP, 'small.webm')); await pg.waitForTimeout(2500);
    comp.small = await pg.evaluate(() => document.querySelector('.fd-state').textContent);
    fc = pg.waitForEvent('filechooser'); await pg.click('.fd-pick >> nth=1'); await (await fc).setFiles(path.join(TMP, 'ok.webm')); await pg.waitForTimeout(3000);
    comp.ok = await pg.evaluate(() => ({ state: document.querySelector('.fd-state').textContent, facts: (document.querySelector('.fd-prev small') || {}).textContent, form: !document.querySelector('.fd-form').hidden, songs: [...document.querySelectorAll('.fd-form datalist option')].map(o => o.value) }));
    if (comp.ok.form) { await pg.fill('.fd-form textarea', 'ჩემი პირველი ვიდეო'); await pg.fill('.fd-songrow input', 'ყაზბეგური'); await shot('9-compose-ready'); await pg.click('.sheet .btn.primary.big'); await pg.waitForTimeout(1500);
      const row = sent.splice(0)[0] || {}; comp.posted = { kind: row.kind, song: row.song, caption: row.caption, meta: row.media_meta, thumb: !!row.thumb_path, visibility: row.visibility, bytesSame: null };
      comp.first = await pg.evaluate(() => { const c = document.querySelector('.fd-card[data-id]'); return c && { id: c.dataset.id, song: (c.querySelector('.fd-song b') || {}).textContent }; }); await shot('10-posted'); }
    else await pg.keyboard.press('Escape');
    if (label === 'desktop') {   // filming in the app: start, two seconds, stop → the same form
      await pg.click('.fd-new'); await pg.waitForTimeout(400); await pg.click('.fd-pick >> nth=0'); await pg.waitForTimeout(1500);
      const rec = { open: await pg.evaluate(() => { const v = document.querySelector('.rec-view'); return v && [v.videoWidth, v.videoHeight]; }) };
      if (rec.open) { await pg.click('.rec-go'); await pg.waitForTimeout(2300); await shot('9b-filming'); rec.clock = await pg.evaluate(() => document.querySelector('.rec-time').textContent); await pg.click('.rec-go'); await pg.waitForTimeout(3500);
        rec.after = await pg.evaluate(() => ({ recGone: !document.querySelector('.rec'), state: (document.querySelector('.fd-state') || {}).textContent, facts: (document.querySelector('.fd-prev small') || {}).textContent, camOff: true })); }
      else rec.toast = await pg.evaluate(() => (document.querySelector('.toast') || {}).textContent);
      comp.filming = rec; await pg.keyboard.press('Escape'); await pg.waitForTimeout(300);
    }
    report.push([label, 'new video', comp]);
    // behind the corners: messages, friends, saved
    await pg.click('.fd-msgs'); await pg.waitForTimeout(2200); await shot('11-messages');
    report.push([label, 'messages', await pg.evaluate(() => ({ head: (document.querySelector('.cm-h1') || {}).textContent, strip: [...document.querySelectorAll('.cm-pal small')].map(x => x.textContent), stripFace: (() => { const f = document.querySelector('.cm-pal .cm-face'), b = document.querySelector('.cm-pal'), s2 = document.querySelector('.cm-pal small'); if (!f) return null; const r = f.getBoundingClientRect(), q = b.getBoundingClientRect(), l = s2.getBoundingClientRect(); return { inButton: r.left >= q.left - 1 && r.right <= q.right + 1, labelBelow: l.top >= r.bottom - 1 }; })(), rows: [...document.querySelectorAll('.cm-crow b')].map(x => x.textContent), unread: !!document.querySelector('.cm-udot'), overflowX: document.documentElement.scrollWidth > innerWidth, feedGone: !document.querySelector('.fd-scroll'), padTop: getComputedStyle(document.getElementById('page')).paddingTop }))]);
    await pg.evaluate(() => { PD.store.set('fr.tab', 'list'); PD.app.go('community', 'friends'); }); await pg.waitForTimeout(1200); await shot('12-friends');
    const fr = await pg.evaluate(() => ({ head: (document.querySelector('.cm-h1') || {}).textContent, me: (document.querySelector('.fr-me b') || {}).textContent, tabs: [...document.querySelectorAll('.fr-seg button')].map(x => x.textContent), list: [...document.querySelectorAll('.fr-pane .cm-crow b')].map(x => x.textContent), thumb: !!document.querySelector('.fr-seg .seg-thumb'), links: [...document.querySelectorAll('.cm-link')].map(x => x.textContent), overflowX: document.documentElement.scrollWidth > innerWidth }));
    await pg.click('.fr-seg button >> nth=1'); await pg.waitForTimeout(600); await shot('12b-requests');
    fr.requests = await pg.evaluate(() => [...document.querySelectorAll('.fr-pane .cm-crow')].map(x => x.textContent));
    await pg.click('.fr-seg button >> nth=2'); await pg.waitForTimeout(400); await pg.fill('.fr-pane input', '@gio'); await pg.press('.fr-pane input', 'Enter'); await pg.waitForTimeout(800); await shot('12c-find');
    fr.found = await pg.evaluate(() => [...document.querySelectorAll('.fr-pane .cm-clist .cm-crow')].map(x => x.textContent));
    report.push([label, 'friends', fr]);
    await pg.evaluate(() => PD.store.set('fr.tab', 'list'));
    await pg.click('.cm-link >> nth=0'); await pg.waitForTimeout(1300); await shot('13-saved');
    report.push([label, 'saved', await pg.evaluate(() => ({ title: (document.querySelector('.fd-title') || {}).textContent, ids: [...document.querySelectorAll('.fd-card[data-id]')].map(c => c.dataset.id), savedOn: !!document.querySelector('.fd-card.act .fd-save.on') }))]);
    await pg.evaluate(() => PD.app.go('community', 'p:41')); await pg.waitForTimeout(1300);
    report.push([label, 'one video', await pg.evaluate(() => ({ ids: [...document.querySelectorAll('.fd-card[data-id]')].map(c => c.dataset.id), back: !!document.querySelector('.fd-top .fd-ic') }))]);
    // a chat: photo, shared post, reactions
    await pg.evaluate(c => PD.app.go('community', 'c:' + c + ':ნინო'), CONV); await pg.waitForTimeout(2200); await shot('8-chat');
    report.push([label, 'chat', await pg.evaluate(() => ({ bubbles: document.querySelectorAll('.cm-msg').length, photo: !!document.querySelector('.cm-msg .md-img'), shared: (document.querySelector('.cm-shared') || {}).textContent, rx: [...document.querySelectorAll('.cm-rx:not([hidden])')].map(x => x.innerHTML.includes('svg') ? 'panduri' : x.textContent), attach: !!document.querySelector('.cm-att') }))]);
    // the chat kit: emoji, stickers, GIFs, the + menu
    await pg.click('.ck-toggle'); await pg.waitForTimeout(500);
    const emo = await pg.evaluate(() => ({ panel: !document.querySelector('.ck-panel').hidden, tabs: [...document.querySelectorAll('.ck-tabs button')].map(b => b.getAttribute('aria-label')), emoji: document.querySelectorAll('.ck-e').length }));
    await pg.click('.ck-e >> nth=3'); await pg.click('.ck-e >> nth=20');
    emo.input = await pg.inputValue('.cm-in');
    await pg.click('.ck-tabs button:nth-child(2)'); await pg.waitForTimeout(300); await shot('8b-stickers');
    emo.stickers = await pg.evaluate(() => document.querySelectorAll('.ck-stb').length);
    await pg.click('.ck-stb >> nth=0'); await pg.waitForTimeout(500);
    await pg.click('.ck-toggle'); await pg.click('.ck-tabs button:nth-child(3)'); await pg.waitForTimeout(600); await shot('8c-gifs');
    emo.gifs = await pg.evaluate(() => document.querySelectorAll('.ck-gif img').length);
    await pg.click('.ck-gif >> nth=1'); await pg.waitForTimeout(500);
    await pg.click('.cm-bar .cm-att >> nth=0'); await pg.waitForTimeout(400); await shot('8d-plus');
    emo.plus = await pg.evaluate(() => [...document.querySelectorAll('.ck-opt')].map(x => x.textContent)); emo.tip = await pg.evaluate(() => (document.querySelector('.sheet .small-note') || {}).textContent);
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(300);
    emo.sent = sent.splice(0).map(x => x.sticker || x.gif);
    emo.rendered = await pg.evaluate(() => ({ sticker: !!document.querySelector('.cm-msg.is-sticker .ck-art svg'), gif: !!document.querySelector('.cm-gif img') }));
    report.push([label, 'chat kit', emo]);
    // Sima tells something new while the app is open
    later = [{ id: 8 + (label === 'desktop' ? 10 : 0), kind: 'chat_reaction', actor: NINO, params: { name: 'ნინო', e: 'fire', what: 'photo', conv: 'x' }, title: 'სიმა · რეაქცია', body: 'ნინო რეაგირებს შენს ფოტოზე: 🔥', go: 'community:friends', tag: 'cr:x', created_at: new Date().toISOString(), read_at: null }];
    await pg.evaluate(() => PD.app.go('home')); await pg.waitForTimeout(400);
    await pg.evaluate(() => PD.notify.pull()); await pg.waitForTimeout(700); await shot('9-sima');
    report.push([label, 'sima popup', await pg.evaluate(() => ({ pop: (document.querySelector('.sn-pop') || {}).textContent, unread: PD.notify.unread(), inbox: PD.notify.log().map(x => x.title + ' — ' + x.body) }))]);
    await pg.evaluate(() => PD.app.go('inbox')); await pg.waitForTimeout(600); await shot('10-inbox');
    // the settings: Sima's note, the kinds, this device's status
    await pg.evaluate(() => PD.app.go('settings')); await pg.waitForTimeout(700);
    await pg.evaluate(() => document.querySelectorAll('.sn-pop').forEach(x => x.remove()));
    const sec = await pg.evaluateHandle(() => { const el = document.querySelector('.sn-from'); return el && (el.closest('section,.sx-sec,.card,.sect') || el.parentElement); });
    if (sec && sec.asElement()) await sec.asElement().screenshot({ path: path.join(OUT, `social-${label}-11-settings.png`) });
    report.push([label, 'settings', await pg.evaluate(() => ({ from: (document.querySelector('.sn-from') || {}).textContent, kinds: [...document.querySelectorAll('.li span[data-t^="nt.k."]')].map(x => x.textContent).length || [...document.querySelectorAll('[data-t^="nt.k."]')].length, status: (document.querySelector('[data-t^="nt.dev"]') || {}).textContent }))]);
    // Sima answers about the new things
    report.push([label, 'sima', await pg.evaluate(() => { const a = PD.sima.answer ? PD.sima.answer('როგორ დავამატო მეგობარი?') : null; return a ? a.title + ' — ' + (a.lines || [])[0] : 'no answer()'; })]);
    report.push([label, 'errors', errs]);
    await ctx.close();
  }
  await b.close(); srv.close();
  for (const r of report) console.log(r[0].padEnd(8), r[1].padEnd(14), JSON.stringify(r[2]));
  console.log('server calls:', [...new Set(calls.map(c => c.split(' ').slice(0, 2).join(' ')))].join(' · '));
})().catch(e => { console.error(e); process.exit(1); });
