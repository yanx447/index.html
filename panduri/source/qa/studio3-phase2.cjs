/* Studio 3.0, phase 2, in a real browser with real audio files — nothing synthetic is separated.
   Import: the teacher's own recording (WAV 24-bit 48 kHz) and lossless copies of it (FLAC, ALAC, AIFF), a 16-bit and a
   96 kHz float WAV, AAC, three real MP3s, a real phone video (MP4, HE-AAC v2) and a WebM/Opus recorded by this browser the
   way the app's recorder does: each file's header is read right, it is decoded at its own rate (no resampling ≤ 48 kHz),
   and the lossless ones are bit-exact against the samples in the file.
   Stems on a real Georgian song (Bani, „Gandagana", 320 kbps): a job that fails (model not reachable) and is tried again;
   one that is cancelled and tried again; one cut off by a reload (interrupted); stems kept on the device and opened again
   after a reload without a new separation, within Int16 rounding; mute/solo from the timeline, WAV export 16-bit and
   32-bit float (bit-exact), seeking on the timeline, one transport, the mix remembered, the kept stems deleted while the
   song stays; the light engine too; old data untouched; the Stems view at five sizes.
   Usage: python3 build.py && node qa/studio3-phase2.cjs [shots dir = docs/studio3/screens/phase2]
   Needs: Chrome, the models in panduri/ai/, macOS afconvert (for the lossless copies; without it those rows are skipped). */
const fs = require('fs'), path = require('path'), http = require('http'), os = require('os'), cp = require('child_process'), assert = require('assert/strict');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../../..'), APP = '/panduri/source/dist/app/';
const SHOTS = path.resolve(process.argv[2] || path.join(ROOT, 'docs/studio3/screens/phase2'));
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 's3p2-'));
const R = p => path.join(ROOT, p);
const TEACHER = R('რითმები/აჭარული ნელი.wav'), SONG = R('MUSIC/ბანი - აჭარული/ჯგუფი "ბანი" | განდაგანა  "სხვა რაკურსში" - (320 Kbps).mp3');
const MUSIC_MP3 = R('panduri/app/media/bani/music.mp3'), RHY_MP3 = R('panduri/app/media/rhythms/acharuli-1.mp3'), VIDEO = R('MUSIC/snaptik_7330285484146478337_hd.mp4');
const results = []; let failed = 0;
const step = async (name, fn) => { const t0 = Date.now(); try { const info = await fn(), skipped = typeof info === 'string' && info.startsWith('skipped'); results.push({ name, ok: true, skipped, ms: Date.now() - t0, info: info === undefined ? null : info }); console.log((skipped ? '– ' : '✓ ') + name + (info !== undefined ? '  ' + JSON.stringify(info) : '')); }
  catch (e) { failed++; results.push({ name, ok: false, ms: Date.now() - t0, error: String(e && e.message || e).slice(0, 500) }); console.log('✗ ' + name + '\n    ' + String(e && e.message || e).slice(0, 500)); } };
// a server for the repository; /__block on|off makes the accurate model unreachable (the error path)
let BLOCK = false;
const TYPES = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.wasm': 'application/wasm', '.html': 'text/html', '.css': 'text/css', '.json': 'application/json', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/__block') { BLOCK = /on/.test(req.url); res.writeHead(200); res.end(String(BLOCK)); return; }
  if (BLOCK && u.startsWith('/panduri/ai/model/')) { res.writeHead(404); res.end(); return; }
  if (u.endsWith('/')) u += 'index.html';
  const f = path.resolve(ROOT, '.' + u);
  if (!f.startsWith(ROOT + path.sep) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Content-Length': fs.statSync(f).size }); fs.createReadStream(f).pipe(res);
});
const afconvert = (args) => { try { cp.execFileSync('afconvert', args, { stdio: 'ignore' }); return true; } catch (_) { return false; } };
const SIZES = [['desktop-1440x900', 1440, 900], ['desktop-1920x1080', 1920, 1080], ['tablet-768x1024', 768, 1024], ['phone-390x844', 390, 844], ['phone-430x932', 430, 932]];

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const origin = 'http://127.0.0.1:' + server.address().port;
  fs.mkdirSync(SHOTS, { recursive: true });
  const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'] });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block', acceptDownloads: true, deviceScaleFactor: 1 });
  await ctx.grantPermissions(['microphone']);
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load|net::|supabase|404|ERR_|download 404/.test(m.text())) errs.push('console: ' + m.text().slice(0, 200)); });
  p.on('dialog', d => d.accept());
  const ready = async () => {
    await p.waitForFunction(() => window.PD && PD.app && PD.studio3 && PD.s3stems && PD.s3media);
    // premium for this isolated page only, so the paid controls can be exercised; the lesson stays locked so it does not open by itself
    await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('intro.done', true); PD.i18n.set('en'); document.querySelectorAll('.ob,.ag,.intro,.cine,.cine-boot,.lf').forEach(o => o.remove()); PD.premium.allows = f => f !== 'ai.learn'; });
  };
  const settle = () => p.waitForFunction(() => document.querySelectorAll('#main > .page').length === 1, null, { timeout: 5000 }).catch(() => {});
  async function openFile(file) {
    await p.evaluate(() => PD.app.go('studio3')); await settle(); await p.waitForTimeout(300);
    const name = path.basename(typeof file === 'string' ? file : file.name);
    await p.setInputFiles('#page input[type=file]', file);
    await p.waitForFunction(n => PD.ai.current && PD.ai.current.file && PD.ai.current.file.name === n && PD.ai.current.res && document.querySelector('#page .ai-head'), name, { timeout: 240000 });
    await settle(); await p.waitForTimeout(400);
  }
  const lastJob = () => p.evaluate(() => { const j = PD.s3stems.list().filter(x => !x.old).slice(-1)[0]; return j ? { id: j.id, state: j.state, p: j.p, err: j.err, engine: j.engine, ep: j.ep, bytes: j.bytes } : null; });
  // not: the id of a job that is already over — wait for the one started after it
  async function waitJob(states, ms, not) { const seen = []; const t0 = Date.now(); for (;;) { let j = await lastJob(); if (j && not && j.id === not) j = null; if (j && seen[seen.length - 1] !== j.state) seen.push(j.state); if (j && states.includes(j.state)) return { j, seen }; if (Date.now() - t0 > ms) throw new Error('job stuck in ' + (j && j.state) + ' · seen ' + seen.join('→')); await p.waitForTimeout(150); } }
  async function split(engine, part) {
    await p.evaluate(([engine, part]) => {
      const st = document.querySelector('#page .ai-stems');
      for (const b of st.querySelectorAll('.seg button')) if ((engine === 'heavy' ? /Accurate/ : /Light/).test(b.textContent)) b.click();
      for (const b of st.querySelectorAll('.seg button')) if (b.textContent.trim() === part) b.click();
      st.querySelector('.btn.primary.big').click();
    }, [engine, part]);
  }
  try {
    await p.goto(origin + APP); await ready();
    // old data that must survive: two AI studio songs (one kept, one not) and a Panduri Studio project, as earlier versions wrote them
    const OLD = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/studio3/ai-recent.json'), 'utf8'));
    await p.evaluate(old => { PD.store.set('ai.recent', old); }, OLD);
    const oldPst = await p.evaluate(() => { const id = PD.pstudio.create('blank', 'Old project kept'); return { id, json: localStorage.getItem('pd2:pst.p.' + id) }; });

    /* ---------------- import: formats ---------------- */
    const F = {};
    F.wav24 = TEACHER;
    if (afconvert(['-f', 'flac', '-d', 'flac', TEACHER, path.join(TMP, 'teacher.flac')])) F.flac = path.join(TMP, 'teacher.flac');
    if (afconvert(['-f', 'm4af', '-d', 'alac', TEACHER, path.join(TMP, 'teacher-alac.m4a')])) F.alac = path.join(TMP, 'teacher-alac.m4a');
    if (afconvert(['-f', 'AIFF', '-d', 'BEI16@44100', TEACHER, path.join(TMP, 'teacher.aiff')])) F.aiff = path.join(TMP, 'teacher.aiff');
    if (afconvert(['-f', 'WAVE', '-d', 'LEI16@44100', '-c', '2', TEACHER, path.join(TMP, 'teacher-16-44k-stereo.wav')])) F.wav16 = path.join(TMP, 'teacher-16-44k-stereo.wav');
    if (afconvert(['-f', 'WAVE', '-d', 'LEF32@96000', TEACHER, path.join(TMP, 'teacher-f32-96k.wav')])) F.wav96 = path.join(TMP, 'teacher-f32-96k.wav');
    if (afconvert(['-f', 'm4af', '-d', 'aac@44100', '-b', '192000', TEACHER, path.join(TMP, 'teacher-aac.m4a')])) F.aac = path.join(TMP, 'teacher-aac.m4a');
    const EXPECT = {
      wav24: { container: 'WAV', codec: 'PCM', lossless: true, sr: 48000, ch: 1, bits: 24, dur: 9.6875 },
      flac: { container: 'FLAC', codec: 'FLAC', lossless: true, sr: 48000, ch: 1, bits: 24, dur: 9.6875 },
      alac: { container: 'M4A', codec: 'ALAC', lossless: true, sr: 48000, ch: 1, bits: 24, dur: 9.6875 },
      aiff: { container: 'AIFF', codec: 'PCM', lossless: true, sr: 44100, ch: 1, bits: 16, dur: 9.6875 },
      wav16: { container: 'WAV', codec: 'PCM', lossless: true, sr: 44100, ch: 2, bits: 16, dur: 9.6875 },
      wav96: { container: 'WAV', codec: 'IEEE float', lossless: true, sr: 96000, ch: 1, bits: 32, dur: 9.6875, decodeAt: 48000 },
      aac: { container: 'M4A', codec: 'AAC-LC', lossless: false, sr: 44100, ch: 1, dur: 9.69 },
      mp3music: { container: 'MP3', codec: 'MPEG-1 Layer III', lossless: false, sr: 44100, ch: 2, dur: 278.94, file: MUSIC_MP3 },
      mp3rhy: { container: 'MP3', lossless: false, sr: 48000, ch: 1, dur: 11.664, file: RHY_MP3 },
      mp3song: { container: 'MP3', codec: 'MPEG-1 Layer III', lossless: false, sr: 44100, ch: 2, kbps: 320, file: SONG },
      mp4video: { container: 'MP4', codec: 'HE-AAC v2', lossless: false, sr: 44100, video: true, dur: 47.37, file: VIDEO }
    };
    const probeOf = async file => { const buf = fs.readFileSync(file); return p.evaluate(async ([b64, name]) => { const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0)); return PD.s3media.probe(new File([bin], name)); }, [buf.toString('base64'), path.basename(file)]); };
    for (const [k, ex] of Object.entries(EXPECT)) {
      await step('probe · ' + k, async () => {
        const file = ex.file || F[k]; if (!file) return 'skipped: afconvert could not make this copy here';
        const r = await probeOf(file); assert.ok(r, 'no result');
        for (const key of ['container', 'codec', 'lossless', 'sr', 'ch', 'bits', 'video', 'kbps']) if (ex[key] !== undefined) assert.equal(r[key], ex[key], key + ': ' + JSON.stringify(r));
        if (ex.dur) assert.ok(Math.abs(r.dur - ex.dur) < Math.max(.06, ex.dur * .003), 'duration ' + r.dur + ' vs ' + ex.dur);
        return { container: r.container, codec: r.codec, sr: r.sr, ch: r.ch, bits: r.bits, kbps: r.kbps, dur: r.dur && +r.dur.toFixed(3) };
      });
    }
    await step('probe · WebM/Opus recorded in this browser from the microphone (as the app\'s recorder makes it)', async () => {
      const r = await p.evaluate(async () => {
        // the browser's own (fake) microphone, recorded the way the AI studio's „record" button does
        const s = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
        const rec = new MediaRecorder(s, { mimeType: 'audio/webm;codecs=opus' }), parts = []; rec.ondataavailable = e => { if (e.data.size) parts.push(e.data); };
        await new Promise(res => { rec.onstop = res; rec.start(500); setTimeout(() => rec.stop(), 2000); }); s.getTracks().forEach(t => t.stop());
        const bl = new Blob(parts, { type: 'audio/webm' }); return Object.assign(await PD.s3media.probe(bl), { bytes: bl.size });
      });
      if (r.bytes < 2000) return 'skipped: this machine\'s recorder made only ' + r.bytes + ' bytes (no audio frames here), nothing to read';
      assert.equal(r.container, 'WebM'); assert.equal(r.codec, 'Opus'); assert.equal(r.sr, 48000); assert.equal(r.lossless, false);
      return { container: r.container, codec: r.codec, sr: r.sr, ch: r.ch, bytes: r.bytes };
    });
    // decoded at the file's own rate, and the lossless files bit-exact against the samples in them
    const pcmOf = file => { const b = fs.readFileSync(file); let o = 12, fmt = null; while (o < b.length) { const id = b.toString('ascii', o, o + 4), n = b.readUInt32LE(o + 4); if (id === 'fmt ') fmt = { ch: b.readUInt16LE(o + 10), bits: b.readUInt16LE(o + 22) }; if (id === 'data') { const out = [], step2 = fmt.bits / 8 * fmt.ch; for (let i = 0; i < 4000; i++) { const q = o + 8 + i * step2; out.push(fmt.bits === 24 ? (b.readIntLE(q, 3)) / 8388608 : b.readInt16LE(q) / 32768); } return out; } o += 8 + n + (n & 1); } };
    const ref24 = pcmOf(TEACHER);
    await step('import · alac in Chrome: no decoder in this browser — the studio says it cannot play it (Safari can)', async () => {
      if (!F.alac) return 'skipped: afconvert could not make this copy here';
      await p.evaluate(() => PD.app.go('studio3')); await settle(); await p.waitForTimeout(300);
      await p.setInputFiles('#page input[type=file]', F.alac);
      await p.waitForFunction(() => { const s = document.querySelector('#page .ai-status'); return s && /cannot|could not|can't|not play|არ /i.test(s.textContent); }, null, { timeout: 60000 })
        .catch(async e => { throw new Error(e.message.split('\n')[0] + ' · status: ' + JSON.stringify(await p.evaluate(() => { const s = document.querySelector('#page .ai-status'); return [PD.app.route, PD.app.param, s ? s.textContent : null, document.querySelectorAll('#main > .page').length, !!document.querySelector('#page .ai-head')]; }))); });
      await p.waitForSelector('#page .s3-nodec', { timeout: 5000 });
      const hint = await p.evaluate(() => document.querySelector('#page .s3-nodec').textContent); assert.match(hint, /ALAC/); assert.match(hint, /Safari/);
      return { message: (await p.evaluate(() => document.querySelector('#page .ai-status').textContent)).slice(0, 70), hint: hint.slice(0, 110) };
    });
    for (const [k, file] of [['wav24', F.wav24], ['flac', F.flac], ['wav16', F.wav16], ['wav96', F.wav96], ['aac', F.aac], ['mp3rhy', RHY_MP3], ['mp4video', VIDEO]]) {
      await step('import · ' + k + ' decoded at its own rate' + (/wav24|flac|alac/.test(k) ? ', bit-exact' : ''), async () => {
        if (!file) return 'skipped: afconvert could not make this copy here';
        await openFile(file);
        const r = await p.evaluate(() => { const a = PD.ai.current.audio; return { sr: a.sampleRate, ch: a.numberOfChannels, dur: a.duration, head: Array.from(a.getChannelData(0).subarray(0, 4000)) }; });
        const ex = EXPECT[k], want = ex.decodeAt || Math.min(ex.sr, 48000);
        assert.equal(r.sr, want, 'decoded at ' + r.sr + ', want ' + want);
        let maxErr = null;
        if (/wav24|flac|alac/.test(k)) { maxErr = 0; for (let i = 0; i < 4000; i++) maxErr = Math.max(maxErr, Math.abs(r.head[i] - ref24[i])); assert.ok(maxErr < 1e-7, 'not bit-exact: ' + maxErr); }
        const side = await p.evaluate(() => document.querySelector('#page .s3-side') ? document.querySelector('#page .s3-side').innerText : '');
        assert.match(side, /Decoded at/); assert.match(side, ex.decodeAt ? /file: 96 kHz/ : /not resampled/);
        return { decodedAt: r.sr, ch: r.ch, dur: +r.dur.toFixed(3), maxErr };
      });
    }

    /* ---------------- stems on a real song ---------------- */
    await step('the song opens; the Stems view shows the original on the timeline and no stems', async () => {
      await openFile(SONG);
      await p.evaluate(() => PD.studio3.workspace.setView('stems', true)); await p.waitForTimeout(700);
      const s = await p.evaluate(() => ({ vis: document.querySelector('#page .s3s') && document.querySelector('#page .s3s').offsetParent !== null, lanes: document.querySelectorAll('#page .s3s-lh').length, empty: !document.querySelector('#page .s3s-empty').hidden, side: document.querySelector('#page .s3-side').innerText }));
      assert.ok(s.vis, 'stage not visible'); assert.equal(s.lanes, 1); assert.ok(s.empty); assert.match(s.side, /320 kbps/); assert.match(s.side, /44\.1 kHz/);
      return { lanes: s.lanes };
    });
    await step('a job that fails — the model cannot be reached — says so and can be tried again', async () => {
      await p.evaluate(async () => { await caches.delete('panduri-ai-v1'); }); await p.evaluate(u => fetch(u + '/__block?on').then(r => r.text()), origin);
      await split('heavy', 'First 30 s');
      const { j, seen } = await waitJob(['error'], 60000);
      const ui = await p.evaluate(() => ({ chip: document.querySelector('#page .s3s-chip').textContent, retry: !!document.querySelector('#page .s3s-retry'), err: (document.querySelector('#page .s3s-err') || {}).textContent }));
      assert.equal(ui.chip, 'Error'); assert.ok(ui.retry, 'no retry button'); assert.ok(ui.err && ui.err.length > 3, 'no message');
      await p.evaluate(u => fetch(u + '/__block?off').then(r => r.text()), origin);
      await p.click('#page .s3s-retry');
      const r2 = await waitJob(['complete', 'partial', 'error'], 240000, j.id); assert.equal(r2.j.state, 'complete', r2.j.err || '');
      return { failed: seen.join('→'), message: ui.err.slice(0, 80), retried: r2.seen.join('→'), ep: r2.j.ep };
    });
    let keptId = null, before = null, played = 0;
    await step('the stems are on the timeline and kept on the device (Int16, per track and channel)', async () => {
      await p.waitForTimeout(600);
      const s = await p.evaluate(async () => { const c = PD.ai.current, m = await PD.s3stems.meta(c.id), keys = (await PD.s3stems._keys()).filter(k => k.startsWith('s3.stems.' + c.id));
        return { id: c.id, lanes: document.querySelectorAll('#page .s3s-lh').length, names: c.stems.tracks.map(t => t.name), len: c.stems.tracks[0].L.length, keep: document.querySelector('#page .s3s-keep').innerText, meta: m && { bytes: m.bytes, sr: m.sr, from: m.from, len: m.len, engine: m.engine, ep: m.ep, tracks: m.tracks.length }, keys: keys.length }; });
      assert.equal(s.lanes, 5); assert.deepEqual(s.names, ['vocals', 'drums', 'bass', 'other']); assert.match(s.keep, /Kept on this device/);
      assert.equal(s.meta.bytes, s.len * 2 * 2 * 4); assert.equal(s.keys, 9); keptId = s.id;
      before = await p.evaluate(() => PD.ai.current.stems.tracks.map(t => [1000, 333333, 777777, t.L.length - 5].map(i => [t.L[i], t.R[i]])));
      return { mb: +(s.meta.bytes / 1048576).toFixed(1), ep: s.meta.ep, seconds: s.meta.len, keys: s.keys };
    });
    await step('solo and mute from the timeline drive the one mixer', async () => {
      await p.click('#page .s3s-lh[data-n="vocals"] .s3s-b.s'); await p.waitForTimeout(200);
      let s = await p.evaluate(() => ({ solo: PD.ai.current.mix.solo, mixerOn: !!document.querySelector('#page .ai-mix .ai-st.vocals .ai-ms.s.on'), dimDrums: document.querySelector('#page .s3s-lh[data-n="drums"]').classList.contains('dim'), mode: document.querySelector('#page .ai-mix .seg button[data-v="stems"]').getAttribute('aria-pressed') }));
      assert.equal(s.solo, 0); assert.ok(s.mixerOn); assert.ok(s.dimDrums); assert.equal(s.mode, 'true');
      await p.click('#page .s3s-lh[data-n="drums"] .s3s-b.m'); await p.waitForTimeout(200);
      s = Object.assign(s, await p.evaluate(() => ({ mute: PD.ai.current.mix.mute })));
      assert.equal(s.mute[1], true);
      return s;
    });
    await step('WAV export of one stem: 16-bit, and 32-bit float bit-exact', async () => {
      const grab = async () => { const [d] = await Promise.all([p.waitForEvent('download'), p.click('#page .s3s-lh[data-n="bass"] .s3s-b:last-child')]); const f = path.join(TMP, 'dl-' + Date.now() + '.wav'); await d.saveAs(f); return fs.readFileSync(f); };
      const a = await grab();
      await p.click('#page .s3s-f button[data-v="f32"]');
      const bf = await grab();
      const hdr = x => ({ fmt: x.readUInt16LE(20), ch: x.readUInt16LE(22), sr: x.readUInt32LE(24), bits: x.readUInt16LE(34), frames: x.readUInt32LE(40) / (x.readUInt16LE(22) * x.readUInt16LE(34) / 8) });
      const h16 = hdr(a), h32 = hdr(bf), n = await p.evaluate(() => PD.ai.current.stems.tracks[2].L.length);
      assert.deepEqual([h16.fmt, h16.ch, h16.sr, h16.bits, h16.frames], [1, 2, 44100, 16, n]); assert.deepEqual([h32.fmt, h32.ch, h32.sr, h32.bits, h32.frames], [3, 2, 44100, 32, n]);
      const ref = await p.evaluate(() => { const t = PD.ai.current.stems.tracks[2]; return [1000, 200000, 900000].map(i => [t.L[i], t.R[i]]); });
      [1000, 200000, 900000].forEach((i, k) => { assert.equal(bf.readFloatLE(44 + i * 8), ref[k][0]); assert.equal(bf.readFloatLE(44 + i * 8 + 4), ref[k][1]); });
      await p.click('#page .s3s-f button[data-v="i16"]');
      return { wav16: h16, wav32: h32, bytes32: bf.length };
    });
    await step('the timeline seeks the one transport; the playhead follows it', async () => {
      const box = await p.locator('#page .s3s-cv').boundingBox();
      await p.mouse.click(box.x + box.width * .5, box.y + 10); await p.waitForTimeout(200);
      const s = await p.evaluate(() => ({ pos: PD.ai.current.transport.pos(), dur: PD.ai.current.res.dur, mode: document.querySelector('#page .ai-mix .seg button[data-v="orig"]').getAttribute('aria-pressed') }));
      assert.ok(Math.abs(s.pos - s.dur / 2) < 1.5, 'pos ' + s.pos + ' of ' + s.dur); assert.equal(s.mode, 'true', 'outside the separated part the original should play');
      await p.mouse.click(box.x + box.width * (10 / s.dur), box.y + 10); await p.waitForTimeout(150);
      const inside = await p.evaluate(() => PD.ai.current.transport.pos()); assert.ok(Math.abs(inside - 10) < 1.5, 'inside ' + inside);
      await p.click('#page .s3-play'); await p.waitForTimeout(1200);
      const s2 = await p.evaluate(() => ({ playing: PD.ai.current.transport.playing, active: PD.transport.active === PD.ai.current.transport, pos: PD.ai.current.transport.pos(), pst: !!(PD.pstudio && PD.pstudio.engine && PD.pstudio.engine.playing) }));
      await p.click('#page .s3-play');
      assert.ok(s2.playing && s2.active && !s2.pst, 'one transport: ' + JSON.stringify(s2)); played = s2.pos - inside;
      // back to the stems mix for what follows (the mix is remembered with it)
      await p.click('#page .s3s-lh[data-n="vocals"] .s3s-b.s'); await p.click('#page .s3s-lh[data-n="vocals"] .s3s-b.s'); await p.waitForTimeout(150);
      return { seekTo: +s.pos.toFixed(2), ofDur: +s.dur.toFixed(1), switchedToOriginal: true, oneTransport: true };
    });
    await step('the playhead moves while the song plays', async () => {
      const clock = await p.evaluate(async () => { const ac = new AudioContext(); await ac.resume().catch(() => {}); const t0 = ac.currentTime; await new Promise(r => setTimeout(r, 800)); const d = ac.currentTime - t0; ac.close(); return d; });
      if (clock < .4) return 'skipped: this machine\'s audio clock does not run (Web Audio advanced ' + clock.toFixed(3) + ' s in 0.8 s), so no player here can move; played ' + played.toFixed(2) + ' s';
      assert.ok(played > .3, 'did not move: ' + played); return { moved: +played.toFixed(2), clock: +clock.toFixed(2) };
    });
    await step('the timeline zooms in on the separated part, and a tap there seeks inside it', async () => {
      await p.click('#page .s3s-z button[data-v="true"]'); await p.waitForTimeout(250);
      const box = await p.locator('#page .s3s-cv').boundingBox();
      await p.mouse.click(box.x + box.width * .5, box.y + 10); await p.waitForTimeout(150);
      const s = await p.evaluate(() => { const st = PD.ai.current.stems; return { pos: PD.ai.current.transport.pos(), mid: st.from + st.len / 2 }; });
      await p.click('#page .s3s-z button[data-v="false"]'); await p.waitForTimeout(150);
      assert.ok(Math.abs(s.pos - s.mid) < .6, 'zoomed seek ' + s.pos + ' vs ' + s.mid);
      return { seekTo: +s.pos.toFixed(2), middleOfPart: +s.mid.toFixed(2) };
    });
    await step('after a reload the kept stems open again without a new separation (within Int16 rounding), the mix with them', async () => {
      await p.waitForTimeout(4600);   // the mix is written every 4 s
      const jobs0 = await p.evaluate(() => PD.s3stems.list().length);
      await p.reload(); await ready();
      await p.evaluate(id => PD.app.go('ai', id), keptId);
      await p.waitForFunction(() => PD.ai.current && PD.ai.current.stems, null, { timeout: 120000 });
      const s = await p.evaluate(() => ({ jobs: PD.s3stems.list().length, tr: PD.ai.current.stems.tracks.map(t => [1000, 333333, 777777, t.L.length - 5].map(i => [t.L[i], t.R[i]])), mix: PD.ai.current.mix, line: (document.querySelector('#page .s3s-restore') || {}).textContent }));
      let worst = 0; before.forEach((tk, i) => tk.forEach((pt, k) => pt.forEach((v, c) => { worst = Math.max(worst, Math.abs(v - s.tr[i][k][c])); })));
      const g = await p.evaluate(async id => Math.max(...(await PD.s3stems.meta(id)).tracks.map(t => t.g)), keptId);
      assert.ok(worst <= .5 * g / 32767 + 1e-9, 'restore error ' + worst * 32767 + ' LSB');
      assert.equal(s.jobs, jobs0, 'a new job ran'); assert.equal(s.mix.solo, 0); assert.equal(s.mix.mute[1], true); assert.match(s.line || '', /no new separation/);
      return { worstLSB: +(worst * 32767).toFixed(3), scale: g, mixKept: true };
    });
    await step('a job can be cancelled and tried again', async () => {
      await p.evaluate(() => PD.studio3.workspace.setView('stems', true)); await p.waitForTimeout(400);
      await p.evaluate(() => { const b = [...document.querySelectorAll('#page .ai-mix button')].find(x => /Separate again|again/i.test(x.textContent)); b.click(); });
      await p.waitForTimeout(300);
      await split('heavy', 'First 30 s');
      await waitJob(['separating'], 120000);
      const cj = (await lastJob()).id;
      await p.click('#page .s3s-cancel');
      const s = await p.evaluate(() => ({ state: PD.s3stems.list().slice(-1)[0].state, stems: !!PD.ai.current.stems, go: !document.querySelector('#page .ai-stems .btn.primary.big').disabled, retry: !!document.querySelector('#page .s3s-retry') }));
      assert.equal(s.state, 'cancelled'); assert.equal(s.stems, false); assert.ok(s.go && s.retry);
      await p.waitForTimeout(1500);
      assert.equal(await p.evaluate(() => PD.s3stems.list().slice(-1)[0].state), 'cancelled', 'a cancelled job came back to life');
      await p.click('#page .s3s-retry');
      const r = await waitJob(['complete', 'partial', 'error'], 240000, cj); assert.equal(r.j.state, 'complete');
      return { cancelled: true, retried: r.seen.join('→') };
    });
    await step('a job cut off by a reload is listed as interrupted', async () => {
      await p.evaluate(() => { const b = [...document.querySelectorAll('#page .ai-mix button')].find(x => /again/i.test(x.textContent)); b.click(); });
      await p.waitForTimeout(300); await split('heavy', 'First 30 s'); await waitJob(['separating'], 120000);
      await p.reload(); await ready();
      const s = await p.evaluate(() => PD.store.get('s3.jobs').slice(-1)[0]);
      assert.equal(s.state, 'interrupted');
      await p.evaluate(id => PD.app.go('ai', id), keptId); await p.waitForFunction(() => PD.ai.current && PD.ai.current.stems, null, { timeout: 120000 }); await p.waitForTimeout(1200);
      const side = await p.evaluate(() => document.querySelector('#page .s3-side').innerText);
      assert.match(side, /Interrupted/);
      return { state: s.state };
    });
    await step('the light engine (Spleeter) runs as a job too and is kept, marked as light', async () => {
      await p.evaluate(() => PD.studio3.workspace.setView('stems', true)); await p.waitForTimeout(300);
      await p.evaluate(() => { const b = [...document.querySelectorAll('#page .ai-mix button')].find(x => /again/i.test(x.textContent)); b.click(); });
      await p.waitForTimeout(300); await split('light', 'First 30 s');
      const r = await waitJob(['complete', 'partial', 'error'], 300000); assert.equal(r.j.state, 'complete', r.j.err || '');
      const m = await p.evaluate(async id => PD.s3stems.meta(id), keptId); assert.equal(m.engine, 'light');
      return { seen: r.seen.join('→'), engine: m.engine, mb: +(m.bytes / 1048576).toFixed(1) };
    });
    await step('deleting the kept stems removes every record and keeps the song', async () => {
      await p.waitForTimeout(500);
      await p.click('#page .s3s-del'); await p.waitForTimeout(800);
      const s = await p.evaluate(async id => ({ keys: (await PD.s3stems._keys()).filter(k => k.startsWith('s3.stems.' + id)).length, song: !!(await PD.blobs.get('ai.song.' + id)), notKept: /Not kept/.test(document.querySelector('#page .s3s-keep').innerText) }), keptId);
      assert.equal(s.keys, 0); assert.ok(s.song); assert.ok(s.notKept);
      return s;
    });
    await step('stems of a song no longer in the library are cleared (gc); the library\'s own songs are not touched', async () => {
      const s = await p.evaluate(async id => {
        const fake = { tracks: [{ name: 'vocals', L: new Float32Array(4410), R: new Float32Array(4410) }], sr: 44100, from: 0, len: .1 };
        await PD.blobs.put('s3.stems.gone-song', { v: 1, song: 'gone-song', tracks: [{ name: 'vocals', n: 4, ch: 1, g: 1 }], bytes: 8 }); await PD.blobs.put('s3.stems.gone-song.0.0', new Int16Array(4).buffer);
        await PD.s3stems.save(id, fake, { engine: 'heavy' });
        const n = await PD.s3stems.gc(); const ks = await PD.s3stems._keys();
        const r = { removed: n, gone: ks.filter(k => k.startsWith('s3.stems.gone-song')).length, own: ks.filter(k => k.startsWith('s3.stems.' + id)).length };
        await PD.s3stems.drop(id); return r;
      }, keptId);
      assert.equal(s.gone, 0); assert.ok(s.own >= 2); assert.ok(s.removed >= 1);
      return s;
    });
    await step('old data is untouched: the earlier songs and the Panduri Studio project', async () => {
      const s = await p.evaluate(([old, id]) => { const all = PD.store.get('ai.recent', []); return { songs: old.map(o => !!all.find(r => r.id === o.id && r.name === o.name)), pst: localStorage.getItem('pd2:pst.p.' + id) }; }, [OLD, oldPst.id]);
      assert.ok(s.songs.every(Boolean), 'an old song is missing'); assert.equal(s.pst, oldPst.json);
      return { oldSongs: s.songs.length, project: 'unchanged' };
    });
    /* ---------------- the Stems view at five sizes ---------------- */
    await step('stems that are not kept can be kept again ("Keep them")', async () => {
      await p.evaluate(() => PD.studio3.workspace.setView('stems', true)); await p.waitForTimeout(400);
      await p.click('#page .s3s-keepb'); await p.waitForFunction(() => /Kept on this device/.test(document.querySelector('#page .s3s-keep').innerText), null, { timeout: 30000 });
      const n = await p.evaluate(async id => (await PD.s3stems._keys()).filter(k => k.startsWith('s3.stems.' + id)).length, keptId); assert.equal(n, 9);
      return { keys: n };
    });
    for (const [name, w, hh] of SIZES) {
      await step('Stems view at ' + name + ': no overflow, every lane drawn, buttons reachable', async () => {
        await p.setViewportSize({ width: w, height: hh }); await p.waitForTimeout(700);
        await p.evaluate(() => { const s = document.querySelector('#page .s3s'); if (s) s.scrollIntoView({ block: 'start' }); });
        await p.waitForTimeout(300);
        const s = await p.evaluate(() => { const cv = document.querySelector('#page .s3s-cv'), r = cv.getBoundingClientRect(), heads = [...document.querySelectorAll('#page .s3s-lh')];
          return { overflow: document.documentElement.scrollWidth > innerWidth + 1, cvW: Math.round(r.width), cvH: Math.round(r.height), lanes: heads.length, rowH: heads.map(x => x.offsetHeight), btns: [...document.querySelectorAll('#page .s3s-b')].filter(x => { const q = x.getBoundingClientRect(); return q.width < 22 || q.height < 22 || q.right > innerWidth; }).length,
            names: heads.map(x => { const n = x.querySelector('.s3s-ln'); return n.scrollWidth <= n.clientWidth + 1; }) }; });
        await p.screenshot({ path: path.join(SHOTS, name + '-stems.jpg'), type: 'jpeg', quality: 72 });
        assert.ok(!s.overflow, 'horizontal overflow'); assert.equal(s.lanes, 5); assert.ok(s.cvW > 120, 'canvas ' + s.cvW); assert.equal(s.btns, 0, 'buttons too small or off screen');
        assert.ok(Math.abs(s.cvH - s.rowH.reduce((a, x) => a + x, 0)) <= 2, 'canvas and lanes out of step');
        return { canvas: s.cvW + '×' + s.cvH, namesFit: s.names.filter(Boolean).length + '/' + s.names.length };
      });
    }
    await step('no page errors', async () => { assert.deepEqual(errs, []); });
  } finally {
    fs.writeFileSync(path.join(SHOTS, 'results.json'), JSON.stringify({ when: new Date().toISOString(), build: await p.evaluate(() => PD.BUILD).catch(() => null), failed, results }, null, 1));
    await b.close(); server.close();
    const sk = results.filter(r => r.skipped).length;
    console.log(`${results.length - failed - sk} passed, ${sk} skipped, ${failed} failed`);
    process.exitCode = failed ? 1 : 0;
  }
})().catch(e => { console.error(e); server.close(); process.exit(1); });
