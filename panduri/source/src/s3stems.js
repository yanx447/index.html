/* =====================================================================
   Studio 3.0, phase 2 — the media behind a song: what the imported file
   is, the separated stems kept on the device, the processing jobs, and
   the one timeline of the Stems view. App only (APP_ONLY in build.py).

   PD.s3media   reads a file's own header (WAV, AIFF, FLAC, MP3, AAC, MP4/
                M4A/MOV, Ogg, WebM): codec, sample rate, bit depth, channels,
                length, lossless or not. PD.ai's decode() asks it for the rate
                and decodes at that rate, so a 44.1 kHz file is not resampled
                on the way in (above 48 kHz it decodes at 48 kHz: see rate()).
   PD.s3stems   keeps the stems of a song in IndexedDB (pd2-blobs) as Int16
                with a per-track scale (so nothing clips), next to the song
                and never instead of it: `s3.stems.<songId>` (what they are)
                and `s3.stems.<songId>.<track>.<channel>` (the samples).
                The jobs: every separation PD.ai starts is a job here, with
                its state, progress, cancel and retry; the last ones are
                listed in localStorage `s3.jobs` (no audio there).
   Nothing leaves the device. Nothing here invents a stem: the timeline
   draws only what a real separation produced or a real record holds.
   ===================================================================== */
PD.i18n.add({
  's3s.title': ['ხმები, ტალღა და დროის ზოლი', 'Stems, waveform and timeline'],
  's3s.orig': ['ორიგინალი', 'Original'], 's3s.origD': ['ფაილი ზუსტად ისაა, როგორც ატვირთე', 'The file exactly as you imported it'],
  's3s.notSep': ['აქ არ არის გაყოფილი', 'Not separated here'],
  's3s.noStems': ['ჯერ არ არის გაყოფილი. აირჩიე ძრავა და მონაკვეთი ქვემოთ და დააჭირე „გაყოფას“ — ხმები აქ, იმავე დროის ზოლზე გამოჩნდება.', 'Not separated yet. Pick an engine and a part below and press Split — the stems appear here, on the same timeline.'],
  's3s.m': ['ჩაჩუმება', 'Mute'], 's3s.s': ['სოლო', 'Solo'], 's3s.wav': ['WAV-ის შენახვა', 'Save as WAV'], 's3s.origFile': ['ორიგინალი ფაილის შენახვა', 'Save the original file'],
  's3s.playing': ['ისმის', 'Playing'], 's3s.useOrig': ['ორიგინალის მოსმენა', 'Listen to the original'], 's3s.useMix': ['ხმების მიქსის მოსმენა', 'Listen to the stems mix'],
  's3s.zAll': ['მთელი სიმღერა', 'Whole song'], 's3s.zPart': ['გაყოფილი ნაწილი', 'Separated part'], 's3s.zoom': ['რა ჩანს დროის ზოლზე', 'What the timeline shows'],
  's3s.seek': ['დროის ზოლი: შეეხე ან გადაათრიე', 'Timeline: tap or drag'],
  's3s.kept': ['შენახულია ამ მოწყობილობაზე', 'Kept on this device'], 's3s.keptD': ['{n} ხმა · {mb} · {when}', '{n} stems · {mb} · {when}'],
  's3s.notKept': ['ამ მოწყობილობაზე არ შეინახა', 'Not kept on this device'], 's3s.keepNow': ['შენახვა', 'Keep them'],
  's3s.del': ['შენახული ხმების წაშლა', 'Delete the kept stems'], 's3s.delQ': ['წაიშალოს ამ სიმღერის შენახული ხმები ({mb})? სიმღერა თავად და მისი ანალიზი რჩება.', 'Delete this song\'s kept stems ({mb})? The song itself and its analysis stay.'],
  's3s.deleted': ['ხმები წაიშალა', 'Stems deleted'], 's3s.restoring': ['შენახულ ხმებს ვხსნი…', 'Opening the kept stems…'], 's3s.restored': ['შენახული ხმები გაიხსნა — თავიდან გაყოფა არ დასჭირდა ({when})', 'The kept stems opened — no new separation needed ({when})'],
  's3s.restoreBad': ['შენახული ხმების გახსნა ვერ მოხერხდა; ჩანაწერი წაიშალა. შეგიძლია ხელახლა გაყო.', 'The kept stems could not be opened; the record was removed. You can separate again.'],
  's3s.room': ['ადგილი არ არის: საჭიროა {need}, თავისუფალია {free}', 'Not enough room: needs {need}, {free} free'], 's3s.noIdb': ['ეს ბრაუზერი აქ აუდიოს ვერ ინახავს', 'This browser cannot keep audio here'],
  's3s.q': ['ხარისხი (ზუსტი ძრავა)', 'Quality (accurate engine)'], 's3s.q1': ['ჩვეულებრივი', 'Standard'], 's3s.q2': ['მაღალი · 2 გავლა', 'High · 2 passes'],
  's3s.qD': ['„მაღალი“ სიმღერას ორჯერ ყოფს, მონაკვეთების საზღვრების გადაწევით, და შედეგს აშუალებს (Demucs-ის „shift trick“). ~1.8-ჯერ ნელია. ბანის „აჭარულზე“ (ცალკე ჩაწერილი ხმა და მუსიკა) ვოკალი 3 მონაკვეთზე +0.03…+0.42 dB SDR-ით გაუმჯობესდა, არცერთზე არ გაუარესდა.', '“High” separates the song twice with the segment edges moved and averages the two (Demucs\' shift trick). About 1.8× slower. On Bani\'s “Acharuli” (voice and music recorded apart) the vocals improved by +0.03 … +0.42 dB SDR in 3 windows and got worse in none.'],
  's3s.fmt': ['WAV-ის ფორმატი', 'WAV format'], 's3s.f16': ['16-bit', '16-bit'], 's3s.f32': ['32-bit float (უდანაკარგო)', '32-bit float (lossless)'],
  's3s.engD': ['გაზომილი ქართულ სიმღერაზე (ბანი, „აჭარული“, 3 × 40 წმ, ცალკე ჩაწერილ ხმასთან და მუსიკასთან): ზუსტი ძრავა (Demucs v4) — ვოკალი 6.9–10.8 dB SDR, 6 ხმიანი — 7.2–13.0 dB; მსუბუქი (Spleeter) — ვოკალი 0.0–0.7 dB: ამ მასალაზე თითქმის არ ყოფს. მსუბუქი გამოიყენე მხოლოდ მაშინ, როცა ზუსტი არ ეტევა.', 'Measured on a Georgian song (Bani, “Acharuli”, 3 × 40 s, against the voice and the music recorded apart): accurate engine (Demucs v4) — vocals 6.9–10.8 dB SDR, the 6-stem model 7.2–13.0 dB; light engine (Spleeter) — vocals 0.0–0.7 dB: on this material it barely separates. Use the light one only when the accurate one does not fit.'],
  's3s.geo': ['ქართული საკრავები (ფანდური, დოლი, გარმონი, ჩონგური, სალამური) ცალკე ჯერ არ იყოფა — ეს კვლევაა, არა ფუნქცია. გაზომილი მასწავლებლის საკუთარ ჩანაწერებზე: მარტო ფანდურს 4 ხმიანი მოდელი 98–100%-ით „დანარჩენში“ სვამს, 6 ხმიანი 55–100%-ით „გიტარაში“; ბანის ქართული მრავალხმიანი სიმღერა 100%-ით „ვოკალში“ ხვდება. დოლის, გარმონის, დუდუკისა და ფანდურის გამყოფის პროტოტიპი ცალკე იზომება და აპში ჯერ არ არის; ჩონგურისა და სალამურის ჩანაწერი არ გვაქვს.', 'Georgian instruments (panduri, doli, garmoni, chonguri, salamuri) are not separated on their own yet — that is research, not a feature. Measured on the teacher\'s own recordings: the 4-stem model puts a panduri alone 98–100% into “other”, the 6-stem model 55–100% into “guitar”; Bani\'s Georgian polyphonic singing goes 100% into “vocals”. A separator prototype for doli, garmoni, duduki and panduri is being measured apart and is not in the app yet; there is no recording of chonguri or salamuri.'],
  's3s.j': ['დამუშავება', 'Processing'], 's3s.jobs': ['ბოლო დამუშავებები', 'Recent processing'],
  's3s.st.queued': ['რიგშია', 'Queued'], 's3s.st.loading': ['მოდელი იტვირთება', 'Loading the model'], 's3s.st.separating': ['იყოფა', 'Separating'], 's3s.st.saving': ['ინახება', 'Saving'],
  's3s.st.complete': ['მზადაა', 'Done'], 's3s.st.partial': ['მზადაა, მაგრამ არ შეინახა', 'Done, not kept'], 's3s.st.error': ['შეცდომა', 'Error'], 's3s.st.cancelled': ['გაუქმდა', 'Cancelled'], 's3s.st.interrupted': ['შეწყდა', 'Interrupted'],
  's3s.interruptedD': ['გვერდი დაიხურა, სანამ ეს მუშაობდა', 'The page closed while this was running'],
  's3s.cancel': ['გაუქმება', 'Cancel'], 's3s.retry': ['ხელახლა ცდა', 'Try again'], 's3s.eta': ['დარჩა ~{t}', '~{t} left'],
  's3s.eng.heavy': ['ზუსტი (Demucs v4)', 'Accurate (Demucs v4)'], 's3s.eng.light': ['მსუბუქი (Spleeter)', 'Light (Spleeter)'], 's3s.passes': ['{n} გავლა', '{n} passes'],
  's3s.part': ['{a}–{b}', '{a}–{b}'], 's3s.whole2': ['ვოკალი და დანარჩენი', 'voice and the rest'],
  's3s.fmtB': ['ფორმატი', 'Format'], 's3s.codec': ['კოდეკი', 'Codec'], 's3s.rate': ['Sample rate', 'Sample rate'], 's3s.depth': ['ბიტები', 'Bit depth'], 's3s.chs': ['არხები', 'Channels'], 's3s.kbps': ['Bitrate', 'Bitrate'],
  's3s.lossless': ['უდანაკარგო', 'Lossless'], 's3s.lossy': ['დანაკარგიანი (შეკუმშული)', 'Lossy (compressed)'], 's3s.decoded': ['გაშიფრულია', 'Decoded at'],
  's3s.decodedSame': ['{r} — ფაილის საკუთარი სიხშირე, გადაყვანის გარეშე', '{r} — the file\'s own rate, not resampled'],
  's3s.decodedOther': ['{r} (ფაილი: {f})', '{r} (file: {f})'], 's3s.keptOrig': ['ორიგინალი ფაილი ინახება ბაიტ-ბაიტ, უცვლელად', 'The original file is kept byte for byte, unchanged'],
  's3s.lossyD': ['დანაკარგიან ფაილში დაკარგული დეტალი გაყოფით არ ბრუნდება', 'Detail a lossy file has lost does not come back by separating it'],
  's3s.noDec': ['ფაილი არის {c} ({f}{r}) — ამ ბრაუზერს ამ კოდეკის გამშიფრავი არ აქვს. {tip}', 'The file is {c} ({f}{r}) — this browser has no decoder for this codec. {tip}'],
  's3s.tipAlac': ['Safari მას ხსნის; ან გადაიყვანე FLAC-ად ან WAV-ად (უდანაკარგოდ).', 'Safari opens it; or convert it to FLAC or WAV (no loss).'],
  's3s.tipAny': ['სცადე სხვა ბრაუზერი, ან გადაიყვანე WAV-ად, FLAC-ად ან MP3-ად.', 'Try another browser, or convert it to WAV, FLAC or MP3.'],
  's3s.mono': ['მონო', 'mono'], 's3s.stereo': ['სტერეო', 'stereo'], 's3s.chN': ['{n} არხი', '{n} channels'], 's3s.video': ['ვიდეო + აუდიო', 'video + audio']
});

/* ---------------- the file's own header ---------------- */
PD.s3media = (() => {
  const head = async (blob, a, n) => new DataView(await blob.slice(a, a + n).arrayBuffer());
  const str = (v, o, n) => { let s = ''; for (let i = 0; i < n && o + i < v.byteLength; i++) s += String.fromCharCode(v.getUint8(o + i)); return s; };
  const ext80 = (v, o) => { const e = v.getUint16(o) & 0x7fff, hi = v.getUint32(o + 2), lo = v.getUint32(o + 6); return e === 0 && hi === 0 ? 0 : (hi * 2 ** 32 + lo) * Math.pow(2, e - 16383 - 63); };
  const SR_AAC = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];
  function wav(v, size) {
    const rf64 = str(v, 0, 4) === 'RF64'; let o = 12, f = null, data = 0, ds64 = 0;
    while (o + 8 <= v.byteLength) {
      const id = str(v, o, 4), n = v.getUint32(o + 4, true);
      if (id === 'ds64' && rf64) ds64 = v.getUint32(o + 8 + 16, true) + v.getUint32(o + 8 + 20, true) * 2 ** 32;
      if (id === 'fmt ') { const tag = v.getUint16(o + 8, true); f = { tag: tag === 0xfffe && n >= 40 ? v.getUint16(o + 32, true) : tag, ch: v.getUint16(o + 10, true), sr: v.getUint32(o + 12, true), align: v.getUint16(o + 20, true), bits: v.getUint16(o + 22, true) }; }
      if (id === 'data') { data = rf64 && n === 0xffffffff ? ds64 : n; break; }
      o += 8 + n + (n & 1);
    }
    if (!f) return null;
    if (!data) data = Math.max(0, size - o - 8);
    const codec = f.tag === 1 ? 'PCM' : f.tag === 3 ? 'IEEE float' : f.tag === 6 ? 'A-law' : f.tag === 7 ? 'µ-law' : 'WAV 0x' + f.tag.toString(16);
    return { container: rf64 ? 'RF64' : 'WAV', codec, lossless: f.tag === 1 || f.tag === 3, sr: f.sr, ch: f.ch, bits: f.bits, dur: f.align && f.sr ? data / f.align / f.sr : null };
  }
  function aiff(v) {
    let o = 12; const c = str(v, 8, 4) === 'AIFC';
    while (o + 8 <= v.byteLength) { const id = str(v, o, 4), n = v.getUint32(o + 4);
      if (id === 'COMM') { const ch = v.getUint16(o + 8), fr = v.getUint32(o + 10), bits = v.getUint16(o + 14), sr = Math.round(ext80(v, o + 16)), ct = c ? str(v, o + 26, 4) : 'NONE';
        const pcm = ct === 'NONE' || ct === 'sowt' || ct === 'twos' || ct === 'fl32' || ct === 'fl64';
        return { container: c ? 'AIFF-C' : 'AIFF', codec: pcm ? (ct.startsWith('fl') ? 'IEEE float' : 'PCM') : ct, lossless: pcm, sr, ch, bits, dur: sr ? fr / sr : null }; }
      o += 8 + n + (n & 1); }
    return null;
  }
  function flac(v, o) {
    // STREAMINFO: the first metadata block, 34 bytes after its 4-byte header
    const b = o + 8, x = v.getUint32(b + 10), sr = x >>> 12, ch = ((x >>> 9) & 7) + 1, bits = ((x >>> 4) & 31) + 1, total = (x & 15) * 2 ** 32 + v.getUint32(b + 14);
    return { container: 'FLAC', codec: 'FLAC', lossless: true, sr, ch, bits, dur: sr && total ? total / sr : null };
  }
  function id3(v) { return str(v, 0, 3) === 'ID3' ? 10 + ((v.getUint8(6) & 127) << 21 | (v.getUint8(7) & 127) << 14 | (v.getUint8(8) & 127) << 7 | (v.getUint8(9) & 127)) + (v.getUint8(5) & 16 ? 10 : 0) : 0; }
  function mpeg(v, o, size) {
    for (let i = o; i + 4 <= v.byteLength && i < o + 65536; i++) {
      if (v.getUint8(i) !== 0xff || (v.getUint8(i + 1) & 0xe0) !== 0xe0) continue;
      const h1 = v.getUint8(i + 1), h2 = v.getUint8(i + 2), h3 = v.getUint8(i + 3), ver = (h1 >> 3) & 3, layer = (h1 >> 1) & 3;
      if (layer === 0) {   // ADTS (AAC): layer bits are 00
        if ((h1 & 0xf6) !== 0xf0) continue;
        const prof = (h2 >> 6) + 1, si = (h2 >> 2) & 15, ch = ((h2 & 1) << 2) | (h3 >> 6); if (!SR_AAC[si]) continue;
        return { container: 'AAC (ADTS)', codec: prof === 2 ? 'AAC-LC' : 'AAC', lossless: false, sr: SR_AAC[si], ch, bits: null, dur: null, aot: prof };
      }
      if (ver === 1) continue;
      const bi = h2 >> 4, si = (h2 >> 2) & 3; if (bi === 0 || bi === 15 || si === 3) continue;
      const SR = [[11025, 12000, 8000], null, [22050, 24000, 16000], [44100, 48000, 32000]][ver][si];
      const L = 4 - layer, v1 = ver === 3;
      const BR = { '1,1': [32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448], '1,2': [32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384], '1,3': [32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320], '2,1': [32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256], '2,2': [8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160] };
      const br = (BR[(v1 ? 1 : 2) + ',' + (v1 ? L : (L === 1 ? 1 : 2))] || [])[bi - 1]; if (!br) continue;
      const ch = (h3 >> 6) === 3 ? 1 : 2, spf = L === 1 ? 384 : (L === 3 && !v1 ? 576 : 1152);
      // a Xing / Info / VBRI header in the first frame gives the true length of a VBR file
      let frames = 0; const side = v1 ? (ch === 1 ? 17 : 32) : (ch === 1 ? 9 : 17), xo = i + 4 + side, tag = str(v, xo, 4);
      if ((tag === 'Xing' || tag === 'Info') && (v.getUint32(xo + 4) & 1)) frames = v.getUint32(xo + 8);
      else if (str(v, i + 36, 4) === 'VBRI') frames = v.getUint32(i + 36 + 14);
      const dur = frames ? frames * spf / SR : (size - i) * 8 / (br * 1000);
      return { container: 'MP3', codec: 'MPEG-' + (v1 ? 1 : ver === 2 ? 2 : 2.5) + ' Layer ' + ['', 'III', 'II', 'I'][layer], lossless: false, sr: SR, ch, bits: null, dur, kbps: frames ? Math.round((size - i) * 8 / dur / 1000) : br, vbr: !!frames && tag !== 'Info' };
    }
    return null;
  }
  /* MP4 / M4A / MOV / 3GP: the boxes, read in slices so a phone video with its index at the end is not read whole */
  async function mp4(blob) {
    let o = 0, moov = null, brand = '';
    while (o + 8 <= blob.size) {
      const v = await head(blob, o, 16); let n = v.getUint32(0); const t = str(v, 4, 4);
      if (n === 1) n = v.getUint32(8) * 2 ** 32 + v.getUint32(12); else if (n === 0) n = blob.size - o;
      if (n < 8) break;
      if (t === 'ftyp') brand = str(v, 8, 4);
      if (t === 'moov') { moov = new DataView(await blob.slice(o, o + Math.min(n, 64 * 1048576)).arrayBuffer()); break; }
      o += n;
    }
    if (!moov) return { container: brand.trim() === 'qt' ? 'MOV' : 'MP4', codec: null, lossless: null, sr: null, ch: null, bits: null, dur: null };
    const kids = (v, a, b) => { const out = []; let p = a; while (p + 8 <= b) { let n = v.getUint32(p); const t = str(v, p + 4, 4), hs = n === 1 ? 16 : 8; if (n === 1) n = v.getUint32(p + 8) * 2 ** 32 + v.getUint32(p + 12); if (n < 8 || p + n > b) break; out.push({ t, a: p + hs, b: p + n }); p += n; } return out; };
    const find = (v, a, b, path) => { let cur = [{ a, b }]; for (const name of path) { const nx = []; cur.forEach(c => kids(v, c.a, c.b).forEach(k => { if (k.t === name) nx.push(k); })); cur = nx; } return cur; };
    let audio = null, video = false;
    for (const tk of find(moov, 8, moov.byteLength, ['trak'])) {
      const hd = find(moov, tk.a, tk.b, ['mdia', 'hdlr'])[0]; if (!hd) continue; const kind = str(moov, hd.a + 8, 4);
      if (kind === 'vide') video = true;
      if (kind !== 'soun' || audio) continue;
      const md = find(moov, tk.a, tk.b, ['mdia', 'mdhd'])[0], ver = md ? moov.getUint8(md.a) : 0;
      const ts = md ? moov.getUint32(md.a + (ver ? 20 : 12)) : 0, du = md ? (ver ? moov.getUint32(md.a + 24) * 2 ** 32 + moov.getUint32(md.a + 28) : moov.getUint32(md.a + 16)) : 0;
      const sd = find(moov, tk.a, tk.b, ['mdia', 'minf', 'stbl', 'stsd'])[0]; if (!sd) continue;
      const e = sd.a + 8, fmt = str(moov, e + 4, 4), qv = moov.getUint16(e + 16);
      const ch = moov.getUint16(e + 24), ss = moov.getUint16(e + 26), sr16 = moov.getUint32(e + 32) / 65536;
      const inner = e + 8 + 28 + (qv === 1 ? 16 : qv === 2 ? 36 : 0), end = e + moov.getUint32(e);
      const a = { fmt, ch, bits: ss, sr: qv === 2 ? null : Math.round(sr16) || ts, dur: ts ? du / ts : null };
      const el = find(moov, tk.a, tk.b, ['edts', 'elst'])[0], mv = find(moov, 8, moov.byteLength, ['mvhd'])[0];
      if (el && mv) { const ev = moov.getUint8(el.a), cnt = moov.getUint32(el.a + 4), mts = moov.getUint32(mv.a + (moov.getUint8(mv.a) ? 20 : 12)); let sum = 0;
        for (let i = 0, q = el.a + 8; i < cnt && q < el.b; i++) { const segd = ev ? moov.getUint32(q) * 2 ** 32 + moov.getUint32(q + 4) : moov.getUint32(q), mt = ev ? moov.getInt32(q + 8) : moov.getInt32(q + 4); if (mt >= 0) sum += segd; q += ev ? 20 : 12; }
        if (sum && mts) a.dur = sum / mts; }
      kids(moov, inner, end).forEach(k => {
        if (k.t === 'alac' && k.b - k.a >= 28) { a.bits = moov.getUint8(k.a + 4 + 5); a.ch = moov.getUint8(k.a + 4 + 9); a.sr = moov.getUint32(k.a + 4 + 20); }
        if (k.t === 'dfLa') { const f = flac(moov, k.a - 4); a.sr = f.sr; a.ch = f.ch; a.bits = f.bits; }
        if (k.t === 'esds') {   // the AAC decoder config: object type, rate, SBR (HE-AAC)
          let p = k.a + 4; const len = () => { let n = 0; for (let i = 0; i < 4; i++) { const c = moov.getUint8(p++); n = n << 7 | (c & 127); if (!(c & 128)) break; } return n; };
          while (p < k.b) { const tag = moov.getUint8(p++), n = len(), q = p;
            if (tag === 3) { p += 3; continue; }
            if (tag === 4) { a.oti = moov.getUint8(q); a.kbps = Math.round(moov.getUint32(q + 9) / 1000) || null; p = q + 13; continue; }
            if (tag === 5 && n >= 2) { const b0 = moov.getUint8(q), b1 = moov.getUint8(q + 1); a.aot = b0 >> 3; const si = ((b0 & 7) << 1) | (b1 >> 7), cc = (b1 >> 3) & 15; if (SR_AAC[si]) a.core = SR_AAC[si];
              if (cc >= 1 && cc <= 7) a.ch = [0, 1, 2, 3, 4, 5, 6, 8][cc];
              if (a.aot === 5 || a.aot === 29) { a.sbr = true; if (a.aot === 29) a.ch = 2; } break; }
            p = q + n; }
        }
      });
      audio = a;
    }
    const C = { mp4a: a => a.oti === 0x6b || a.oti === 0x69 ? 'MP3' : a.sbr ? (a.aot === 29 ? 'HE-AAC v2' : 'HE-AAC') : 'AAC-LC', alac: () => 'ALAC', fLaC: () => 'FLAC', Opus: () => 'Opus', 'ac-3': () => 'AC-3', 'ec-3': () => 'E-AC-3', lpcm: () => 'PCM', sowt: () => 'PCM', twos: () => 'PCM', in24: () => 'PCM', fl32: () => 'IEEE float' };
    const cont = brand === 'qt  ' ? 'MOV' : /^M4A|^M4B/.test(brand) ? 'M4A' : /^3g/.test(brand) ? '3GP' : 'MP4';
    if (!audio) return { container: cont, codec: null, lossless: null, sr: null, ch: null, bits: null, dur: null, video };
    const codec = (C[audio.fmt] || (() => audio.fmt))(audio), lossless = /ALAC|FLAC|PCM|float/.test(codec);
    const sr = audio.fmt === 'mp4a' && audio.core ? audio.core * (audio.sbr ? 2 : 1) : audio.sr;
    const sm = (() => { for (let i = 0; i + 8 < moov.byteLength; i++) if (moov.getUint8(i) === 0x69 && str(moov, i, 8) === 'iTunSMPB') return i; return -1; })();
    if (sm >= 0) { for (let i = sm; i < Math.min(moov.byteLength - 16, sm + 64); i++) if (str(moov, i, 4) === 'data') { const f = str(moov, i + 12, 120).trim().split(/\s+/); const n = parseInt(f[3], 16); if (n > 0 && sr) audio.dur = n / sr; break; } }
    return { container: cont, codec, lossless, sr, ch: audio.ch, bits: lossless ? audio.bits : null, dur: audio.dur, kbps: audio.kbps || null, video, aot: audio.aot, implicitSbr: audio.fmt === 'mp4a' && !audio.sbr && sr && sr <= 24000 };
  }
  async function ogg(blob, v) {
    const p = 26 + v.getUint8(26) + 1, kind = str(v, p, 8);
    let r = null;
    if (kind === 'OpusHead') r = { codec: 'Opus', sr: 48000, inRate: v.getUint32(p + 12, true), ch: v.getUint8(p + 9), pre: v.getUint16(p + 10, true) };
    else if (str(v, p + 1, 6) === 'vorbis') r = { codec: 'Vorbis', sr: v.getUint32(p + 12, true), ch: v.getUint8(p + 11) };
    else if (str(v, p + 1, 4) === 'FLAC') { const f = flac(v, p + 9 + 4); r = { codec: 'FLAC', sr: f.sr, ch: f.ch, bits: f.bits }; }
    if (!r) return { container: 'Ogg', codec: null, lossless: null, sr: null, ch: null, bits: null, dur: null };
    // the length: the granule position of the last page
    let dur = null; try { const tail = await head(blob, Math.max(0, blob.size - 65536), 65536); for (let i = tail.byteLength - 14; i >= 0; i--) if (str(tail, i, 4) === 'OggS') { const g = tail.getUint32(i + 6, true) + tail.getUint32(i + 10, true) * 2 ** 32; dur = (g - (r.pre || 0)) / r.sr; break; } } catch (_) {}
    return { container: 'Ogg', codec: r.codec, lossless: r.codec === 'FLAC', sr: r.sr, ch: r.ch, bits: r.bits || null, dur };
  }
  /* WebM / Matroska: the EBML tree down to the first audio track (enough of it is in the first megabyte) */
  function ebml(v) {
    const vint = (p, mask) => { const b = v.getUint8(p); let l = 1; while (l <= 8 && !(b & (0x80 >> (l - 1)))) l++; let x = mask ? b & (0xff >> l) : b; for (let i = 1; i < l; i++) x = x * 256 + v.getUint8(p + i); return { x, l }; };
    const uint = (p, n) => { let x = 0; for (let i = 0; i < n; i++) x = x * 256 + v.getUint8(p + i); return x; };
    const flt = (p, n) => n === 4 ? v.getFloat32(p) : v.getFloat64(p);
    const out = { tracks: [], scale: 1e6, dur: null, doc: '' };
    const walk = (a, b, depth, tr) => {
      let p = a;
      while (p < b && p + 2 < v.byteLength) {
        const id = vint(p, false), sz = vint(p + id.l, true), d = p + id.l + sz.l, unknown = sz.x >= 2 ** (7 * sz.l) - 1, e = unknown ? b : Math.min(b, d + sz.x);
        const I = id.x;
        if (I === 0x4282) out.doc = str(v, d, sz.x);
        else if (I === 0x1A45DFA3 || I === 0x18538067 || I === 0x1549A966 || I === 0x1654AE6B || I === 0xE1) walk(d, e, depth + 1, tr);   // EBML header, Segment, Info, Tracks, Audio
        else if (I === 0xAE) { const t = {}; out.tracks.push(t); walk(d, e, depth + 1, t); }   // TrackEntry
        else if (I === 0x2AD7B1) out.scale = uint(d, sz.x);
        else if (I === 0x4489) out.dur = flt(d, sz.x);
        else if (tr && I === 0x83) tr.type = uint(d, sz.x);
        else if (tr && I === 0x86) tr.codec = str(v, d, sz.x);
        else if (tr && I === 0xB5) tr.sr = flt(d, sz.x);
        else if (tr && I === 0x9F) tr.ch = uint(d, sz.x);
        else if (tr && I === 0x6264) tr.bits = uint(d, sz.x);
        else if (I === 0x1F43B675) return;   // a Cluster: the samples begin, the header is over
        if (unknown && I !== 0x18538067) return;
        p = e;
      }
    };
    try { walk(0, v.byteLength, 0, null); } catch (_) {}
    const a = out.tracks.find(t => t.type === 2), cn = a && a.codec ? a.codec.replace(/^A_/, '') : null;
    const codec = cn ? ({ OPUS: 'Opus', VORBIS: 'Vorbis', AAC: 'AAC', FLAC: 'FLAC', 'PCM/INT/LIT': 'PCM', 'PCM/FLOAT/IEEE': 'IEEE float', MPEG: 'MP3' }[cn.split('/')[0] === 'PCM' ? cn : cn.split('/')[0]] || cn) : null;
    return { container: out.doc === 'webm' ? 'WebM' : 'Matroska', codec, lossless: codec ? /FLAC|PCM|float/.test(codec) : null, sr: a ? (codec === 'Opus' ? 48000 : a.sr) : null, ch: a ? a.ch : null, bits: a && /FLAC|PCM/.test(codec || '') ? a.bits : null, dur: out.dur ? out.dur * out.scale / 1e9 : null, video: out.tracks.some(t => t.type === 1) };
  }
  const memo = new WeakMap();
  /** what the file is, from its own bytes; null when the format is not one of these (the file still opens if the browser reads it) */
  function probe(blob) {
    if (!blob || !blob.slice) return Promise.resolve(null);
    if (memo.has(blob)) return memo.get(blob);
    const p = (async () => {
      const v = await head(blob, 0, Math.min(blob.size, 1048576)), m4 = str(v, 0, 4), size = blob.size;
      let r = null;
      if ((m4 === 'RIFF' || m4 === 'RF64') && str(v, 8, 4) === 'WAVE') r = wav(v, size);
      else if (m4 === 'FORM' && /AIF[FC]/.test(str(v, 8, 4))) r = aiff(v);
      else if (str(v, 4, 4) === 'ftyp') r = await mp4(blob);
      else if (m4 === 'OggS') r = await ogg(blob, v);
      else if (v.byteLength > 4 && v.getUint32(0) === 0x1A45DFA3) r = ebml(v);
      else { const o = id3(v); if (str(v, o, 4) === 'fLaC') r = flac(v, o); else r = mpeg(v, o, size); }
      if (r) { r.size = size; if (r.dur && !r.kbps && !r.video) r.kbps = Math.round(size * 8 / r.dur / 1000); if (r.sr && (r.sr < 3000 || r.sr > 768000)) r.sr = null; }
      return r;
    })().catch(() => null);
    memo.set(blob, p); return p;
  }
  /** the rate to decode at: the file's own, when it is known for certain and ≤ 48 kHz. Above that 48 kHz: a phone holds a
      96 kHz song as twice the memory for nothing a listener or a separation model (44.1 kHz) can use. 0 = the browser's default.
      HE-AAC whose extension is not signalled, and an AAC under 32 kHz, are left to the browser: its decoded rate may be twice the core. */
  async function rate(blob) {
    const r = await probe(blob); if (!r || !r.sr) return 0;
    if (/AAC/.test(r.codec || '') && (r.implicitSbr || r.sr < 32000)) return 0;
    return Math.min(r.sr, 48000);
  }
  return { probe, rate };
})();

/* ---------------- stems on the device, and the jobs ---------------- */
PD.s3stems = (() => {
  const t = (k, o) => PD.i18n.t(k, o), h = PD.h;
  const KEY = id => 's3.stems.' + id, DKEY = (id, i, c) => 's3.stems.' + id + '.' + i + '.' + c;
  const fmtMB = b => b == null ? '—' : b >= 1048576 ? (b / 1048576).toFixed(b >= 104857600 ? 0 : 1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
  // the store PD.blobs uses, opened again here only to list and remove keys by prefix (PD.blobs has no list)
  let dbp = null;
  // closes itself when Settings deletes the database, so it never blocks that
  const db = () => dbp || (dbp = new Promise((res, rej) => { const r = indexedDB.open('pd2-blobs', 1); r.onupgradeneeded = () => r.result.createObjectStore('b'); r.onsuccess = () => { r.result.onversionchange = () => { try { r.result.close(); } catch (_) {} dbp = null; }; res(r.result); }; r.onerror = () => rej(r.error); }));
  const keys = () => db().then(d => new Promise((res, rej) => { const q = d.transaction('b', 'readonly').objectStore('b').getAllKeys(); q.onsuccess = () => res(q.result || []); q.onerror = () => rej(q.error); })).catch(() => []);
  const metaCache = new Map();
  async function meta(id) { if (!id) return null; if (metaCache.has(id)) return metaCache.get(id); const m = await PD.blobs.get(KEY(id)); const v = m && m.v === 1 ? m : null; metaCache.set(id, v); return v; }
  function bytesOf(st) { return st.tracks.reduce((a, x) => a + x.L.length * 2 * (x.R && x.R !== x.L ? 2 : 1), 0); }
  async function room(need) {
    try { const e = await navigator.storage.estimate(); if (e && e.quota) { const free = e.quota - (e.usage || 0); return { ok: free > need * 1.15 + 32 * 1048576, free }; } } catch (_) {}
    return { ok: true, free: null };
  }
  const q16 = (x, g) => { const n = x.length, o = new Int16Array(n), k = 32767 / g; for (let i = 0; i < n; i++) { let y = x[i] * k; o[i] = y > 32767 ? 32767 : y < -32767 ? -32767 : Math.round(y); } return o.buffer; };
  /** keep a song's stems: meta (what they are) + one record per channel. Something fails half way → nothing is left half kept. */
  async function save(id, st, info) {
    if (!id || !st || !st.tracks || !st.tracks.length) return { kept: false, reason: 'none' };
    const bytes = bytesOf(st), rm = await room(bytes);
    if (!rm.ok) return { kept: false, reason: t('s3s.room', { need: fmtMB(bytes), free: fmtMB(rm.free) }), bytes };
    try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (_) {}
    await drop(id);
    const tracks = [];
    for (let i = 0; i < st.tracks.length; i++) {
      const x = st.tracks[i], two = x.R && x.R !== x.L; let pk = 0;
      [x.L].concat(two ? [x.R] : []).forEach(a => { for (let j = 0; j < a.length; j++) { const y = a[j] < 0 ? -a[j] : a[j]; if (y > pk) pk = y; } });
      const g = Math.max(1, pk);   // a stem louder than full scale is scaled down when kept and back up when opened: nothing clips
      for (let c = 0; c < (two ? 2 : 1); c++) { const ok = await PD.blobs.put(DKEY(id, i, c), q16(c ? x.R : x.L, g)); if (ok === null) { await drop(id); return { kept: false, reason: t('s3s.noIdb'), bytes }; } }
      tracks.push({ name: x.name, n: x.L.length, ch: two ? 2 : 1, g });
    }
    const m = { v: 1, song: id, at: Date.now(), sr: st.sr, from: st.from || 0, len: st.len, two: !!st.two, engine: info.engine || st.engine || 'heavy', model: info.model || null, ep: info.ep || null, shifts: info.shifts || 1, tracks, bytes, mix: null };
    if (await PD.blobs.put(KEY(id), m) === null) { await drop(id); return { kept: false, reason: t('s3s.noIdb'), bytes }; }
    metaCache.set(id, m); gc(); return { kept: true, bytes, meta: m };
  }
  async function load(id) {
    const m = await meta(id); if (!m) return null;
    const tracks = [];
    for (let i = 0; i < m.tracks.length; i++) {
      const tk = m.tracks[i], ch = [];
      for (let c = 0; c < tk.ch; c++) { const b = await PD.blobs.get(DKEY(id, i, c)); if (!b || b.byteLength !== tk.n * 2) return { bad: true }; const a = new Int16Array(b), f = new Float32Array(tk.n), k = tk.g / 32767; for (let j = 0; j < tk.n; j++) f[j] = a[j] * k; ch.push(f); }
      tracks.push({ name: tk.name, L: ch[0], R: ch[1] || ch[0] });
    }
    return { meta: m, st: { id: 'kept' + m.at, sr: m.sr, from: m.from, len: m.len, tracks, two: m.two || undefined, engine: m.engine === 'light' ? 'light' : undefined } };
  }
  async function drop(id) {
    if (!id) return; metaCache.delete(id);
    const pre = KEY(id) + '.', all = await keys();
    await Promise.all(all.filter(k => typeof k === 'string' && (k === KEY(id) || k.startsWith(pre))).map(k => PD.blobs.del(k)));
  }
  async function setMix(id, mix) { const m = await meta(id); if (!m || !mix) return; const j = JSON.stringify(mix); if (JSON.stringify(m.mix) === j) return; m.mix = JSON.parse(j); await PD.blobs.put(KEY(id), m); }
  /** stems of songs that are no longer in the library go (a song forgotten in an older version, or pushed out of the 12) */
  async function gc() {
    const ids = new Set((PD.store.get('ai.recent', []) || []).map(r => r.id).filter(Boolean)), all = await keys(), gone = new Set();
    all.forEach(k => { const m = typeof k === 'string' && /^s3\.stems\.([^.]+)(\.|$)/.exec(k); if (m && !ids.has(m[1])) gone.add(m[1]); });
    for (const id of gone) await drop(id);
    return gone.size;
  }
  async function total() { const all = await keys(); let n = 0; for (const k of all) if (typeof k === 'string' && /^s3\.stems\.[^.]+$/.test(k)) { const m = await PD.blobs.get(k); if (m && m.bytes) n += m.bytes; } return n; }

  /* ---- jobs ---- */
  const FINAL = new Set(['complete', 'partial', 'error', 'cancelled', 'interrupted']);
  const subs = new Set(), jobs = [];
  const emit = j => subs.forEach(f => { try { f(j); } catch (_) {} });
  const persist = () => { try { PD.store.set('s3.jobs', jobs.slice(-12).map(j => ({ id: j.id, song: j.song, kind: j.kind, engine: j.engine, model: j.model, shifts: j.shifts, two: j.two, from: j.from, len: j.len, state: j.state, err: j.err || null, at: j.at, end: j.end || null, bytes: j.bytes || null, ep: j.ep || null }))); } catch (_) {} };
  // jobs of an earlier session: one that never finished was cut off when its page closed
  (PD.store.get('s3.jobs', []) || []).forEach(j => { const x = Object.assign({}, j, { old: true }); if (!FINAL.has(x.state)) { x.state = 'interrupted'; x.err = 'interrupted'; } jobs.push(x); });
  persist();
  function start(o) {
    jobs.filter(j => !FINAL.has(j.state) && !j.old).forEach(j => { j.state = 'cancelled'; j.end = Date.now(); emit(j); });   // one separation at a time: a new run replaces a running one
    const j = { id: 'j' + Date.now().toString(36), kind: 'separate', song: o.song, engine: o.engine, model: o.model, two: !!o.two, from: o.from, len: o.len, shifts: o.engine === 'heavy' ? PD.store.get('ai.shifts', 1) : 1,
      state: 'queued', p: 0, eta: null, err: null, at: Date.now(), ep: o.engine === 'light' ? 'wasm' : null, cancel: null, _retry: o.retry, st: null };
    j.m = m => {
      if (FINAL.has(j.state)) return;
      const light = j.engine === 'light';
      if (m.type === 'dl') { if (!(light && j.state === 'separating')) j.state = 'loading'; j.p = light ? Math.min(.99, (m.i + (m.total ? m.got / m.total : 0) * .5) / (m.n || 1)) : .3 * (m.total ? m.got / m.total : 0); j.dl = { got: m.got, total: m.total }; }
      else if (m.type === 'stage') { if (light && m.s === 'run') j.state = 'separating'; else if (!(light && j.state === 'separating')) j.state = 'loading'; if (light && m.n) j.p = Math.max(j.p, m.i / m.n); if (!light) j.p = Math.max(j.p, .32); }
      else if (m.type === 'ready') { if (!light) { j.state = 'separating'; j.p = Math.max(j.p, .35); j.ep = m.ep || j.ep; } else j.state = 'loading'; }
      else if (m.type === 'progress') { j.state = 'separating'; j.p = light ? Math.min(.99, (m.i + .5 + .5 * m.done / m.total) / m.n) : .35 + .65 * m.done / m.total; j.eta = m.eta != null ? m.eta : null; }
      // PD.ai reports every other error itself, translated, through j.fail; only the GPU check it handles by running again on the CPU
      else if (m.type === 'error' && m.msg === 'GPUBAD') { j.state = 'error'; j.err = t('ai.gpuBad'); j.end = Date.now(); persist(); }
      emit(j);
    };
    j.fail = text => { if (FINAL.has(j.state)) return; j.state = 'error'; j.err = String(text || 'error'); j.end = Date.now(); persist(); emit(j); };
    j.done = async st => {
      if (FINAL.has(j.state)) return;
      j.state = 'saving'; j.p = 1; j.st = st; emit(j);
      const r = PD.store.get('s3.keep', true) ? await save(j.song, st, { engine: j.engine, model: j.model, ep: j.ep, shifts: j.shifts }) : { kept: false, reason: '' };
      j.bytes = r.bytes || bytesOf(st); j.state = r.kept ? 'complete' : 'partial'; j.err = r.kept ? null : r.reason; j.end = Date.now(); persist(); emit(j);
    };
    j.cancelNow = () => { if (FINAL.has(j.state)) return; try { j.cancel && j.cancel(); } catch (_) {} j.state = 'cancelled'; j.end = Date.now(); persist(); emit(j); };
    j.retry = () => { if (j._retry) j._retry(); };
    j.keepAgain = async () => { if (j.state !== 'partial' || !j.st) return; j.state = 'saving'; emit(j); const r = await save(j.song, j.st, { engine: j.engine, model: j.model, ep: j.ep, shifts: j.shifts }); j.state = r.kept ? 'complete' : 'partial'; j.err = r.kept ? null : r.reason; persist(); emit(j); };
    jobs.push(j); if (jobs.length > 40) jobs.splice(0, jobs.length - 40); persist(); emit(j);
    return j;
  }
  const list = () => jobs.slice();
  const on = f => { subs.add(f); return () => subs.delete(f); };
  if (PD.ai) PD.ai.job = start;

  /* ---- WAV: 16-bit PCM or 32-bit float, stereo or mono ---- */
  function wav(L, R, sr, fmt) {
    const ch = R && R !== L ? 2 : 1, f32 = fmt === 'f32', bps = f32 ? 4 : 2, n = L.length, data = n * ch * bps, b = new ArrayBuffer(44 + data), v = new DataView(b);
    const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + data, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, f32 ? 3 : 1, true); v.setUint16(22, ch, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr * ch * bps, true); v.setUint16(32, ch * bps, true); v.setUint16(34, bps * 8, true); w(36, 'data'); v.setUint32(40, data, true);
    let o = 44;
    for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++) { const x = (c ? R : L)[i]; if (f32) v.setFloat32(o, x, true); else v.setInt16(o, Math.round(Math.max(-1, Math.min(1, x)) * 32767), true); o += bps; }
    return new Blob([b], { type: 'audio/wav' });
  }

  /* ---- the Stems view: one timeline, one playhead ---- */
  const COL = { mix: '#B9B2A8', vocals: '#E4B363', drums: '#E07A5F', bass: '#7DD3A0', other: '#8AB4F8', guitar: '#C792EA', piano: '#F2A0C8' };
  const NAME = { vocals: 'ai.vocals', drums: 'ai.drums', bass: 'ai.bass', other: 'ai.other', guitar: 'ai.guitar', piano: 'ai.piano' };
  const DL = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>';
  const clock = s => PD.s3core ? PD.s3core.clock(s) : PD.fmtTime(s);
  const when = ms => ms ? new Date(ms).toLocaleString(PD.i18n.locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
  /** o: { host: the workspace's AI page (its mixer is driven, not copied), song: () => the song's file name } */
  function css() {
    if (document.getElementById('s3s-css')) return;
    document.head.appendChild(h('style', { id: 's3s-css', text: `
.s3s{--s3s-line:var(--line);scroll-margin-top:150px;display:grid;gap:12px;padding:14px;border:1px solid var(--line);border-radius:var(--r-m,14px);background:var(--surface);min-width:0}
.s3s[hidden]{display:none}.s3s .grow{flex:1}.s3s-h{margin:0;font:600 var(--t-callout,15px)/1.3 var(--f-ui)}
.s3s-tl{display:grid;grid-template-columns:var(--s3s-hw,212px) minmax(0,1fr);border:1px solid var(--line);border-radius:10px;overflow:hidden;background:var(--bg,#0b0b0a)}
.s3s-heads{display:grid;align-content:start;border-inline-end:1px solid var(--line);background:var(--surface2,rgba(255,255,255,.03))}
.s3s-lh{height:var(--s3s-rh,44px);display:flex;align-items:center;gap:6px;padding:0 6px 0 8px;border-bottom:1px solid var(--line);min-width:0}
.s3s-lh i{flex:0 0 auto;width:8px;height:8px;border-radius:50%}.s3s-lh.dim{opacity:.5}
.s3s-ln{flex:1 1 auto;min-width:0;font:600 12.5px var(--f-ui);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.s3s-bs{display:flex;gap:3px;flex:0 0 auto}
.s3s-b{min-width:26px;height:26px;padding:0 5px;border-radius:7px;border:1px solid var(--line2,var(--line));background:transparent;color:var(--fg2);font:700 11px var(--f-ui);display:grid;place-items:center;cursor:pointer}
.s3s-b.on{background:var(--acc);color:#18110A;border-color:var(--acc)}.s3s-b.m.on{background:#E07A5F;border-color:#E07A5F}.s3s-b:focus-visible{outline:2px solid var(--acc);outline-offset:1px}
.s3s-cvw{position:relative;min-width:0}.s3s-cv{display:block;width:100%;touch-action:none;cursor:pointer}.s3s-cv:focus-visible{outline:2px solid var(--acc);outline-offset:-2px}
.s3s-top{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px}.s3s-z[hidden]{display:none}.s3s-empty{margin:0;font-size:13px}.s3s-keep{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px}.s3s-keep[hidden]{display:none}
.s3s-ok{color:var(--ok);font:600 13px var(--f-ui)}.s3s-warn{color:var(--almost);font:600 13px var(--f-ui)}
.s3s-opts{display:grid;gap:6px}.s3s-opt{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px}.s3s-fine{display:block;font-size:12px;line-height:1.45;max-width:78ch}
.s3s-notes{display:grid;gap:6px;border-top:1px solid var(--line);padding-top:10px}
.s3s-job{display:grid;gap:6px;padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:var(--surface2,rgba(255,255,255,.03))}.s3s-job[hidden]{display:none}
.s3s-jt{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px}
.s3s-chip{font:700 11.5px var(--f-ui);padding:3px 9px;border-radius:999px;border:1px solid var(--line2,var(--line));color:var(--fg2)}
.s3s-loading,.s3s-separating,.s3s-saving,.s3s-queued{color:var(--acc);border-color:var(--acc-line,var(--acc))}.s3s-complete{color:var(--ok);border-color:rgba(125,211,160,.4)}
.s3s-partial{color:var(--almost);border-color:rgba(224,176,114,.45)}.s3s-error,.s3s-interrupted{color:#F28B82;border-color:rgba(242,139,130,.45)}.s3s-cancelled{color:var(--muted)}
.s3s-bar{height:6px;border-radius:999px;background:var(--surface3,rgba(255,255,255,.08));overflow:hidden}.s3s-bar i{display:block;height:100%;background:var(--acc);transition:width .2s}
.s3s-err{color:#F28B82;font-size:12.5px}.s3s-restore{color:var(--fg2);font-size:12.5px}.s3s-restore[hidden]{display:none}
@media (max-width:599px){.s3s{padding:10px;gap:10px}.s3s-tl{--s3s-hw:104px;--s3s-rh:54px}.s3s-lh{flex-wrap:wrap;align-content:center;gap:3px 4px;padding:0 4px 0 6px}.s3s-ln{flex:1 1 60px;font-size:12px}.s3s-bs{flex:1 0 100%}.s3s-b{min-width:26px;height:24px;padding:0 4px}}
` }));
  }
  function stage(o) {
    css();
    const cur = () => PD.ai && PD.ai.current;
    const el = h('section', { class: 's3s', 'aria-label': t('s3s.title') });
    const jobBox = h('div', { class: 's3s-job', hidden: true, 'aria-live': 'polite' });
    const lanesHead = h('div', { class: 's3s-heads' }), cv = h('canvas', { class: 's3s-cv', tabindex: '0', role: 'slider', 'aria-label': t('s3s.seek'), 'aria-valuemin': '0' });
    const tl = h('div', { class: 's3s-tl' }, [lanesHead, h('div', { class: 's3s-cvw' }, [cv])]);
    const empty = h('p', { class: 's3s-empty muted', text: t('s3s.noStems') });
    const keepRow = h('div', { class: 's3s-keep' });
    const qSeg = h('div', { class: 'seg s3s-q' }, [[1, 's3s.q1'], [2, 's3s.q2']].map(([v, k]) => h('button', { type: 'button', 'data-v': String(v), 'aria-pressed': String(PD.store.get('ai.shifts', 1) === v), text: t(k), onclick: () => { PD.store.set('ai.shifts', v); qSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.v === v))); } })));
    const fSeg = h('div', { class: 'seg s3s-f' }, [['i16', 's3s.f16'], ['f32', 's3s.f32']].map(([v, k]) => h('button', { type: 'button', 'data-v': v, 'aria-pressed': String(PD.store.get('s3.wavFmt', 'i16') === v), text: t(k), onclick: () => { PD.store.set('s3.wavFmt', v); fSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v))); } })));
    const opts = h('div', { class: 's3s-opts' }, [h('div', { class: 's3s-opt' }, [h('span', { class: 'muted', text: t('s3s.q') }), qSeg]), h('small', { class: 'muted s3s-fine', text: t('s3s.qD') }),
      h('div', { class: 's3s-opt' }, [h('span', { class: 'muted', text: t('s3s.fmt') }), fSeg])]);
    const notes = h('div', { class: 's3s-notes' }, [h('small', { class: 'muted s3s-fine', text: t('s3s.engD') }), h('small', { class: 'muted s3s-fine', text: t('s3s.geo') })]);
    const restoreLine = h('small', { class: 's3s-restore', hidden: true, role: 'status' });
    const top = h('div', { class: 's3s-top' }, [h('h2', { class: 's3s-h', text: t('s3s.title') })]);   // the zoom switch joins it below, once it exists
    el.append(top, jobBox, restoreLine, tl, empty, keepRow, opts, notes);

    const mixRow = name => o.host.querySelector('.ai-mix .ai-st.' + name);
    const mode = () => { const b = o.host.querySelector('.ai-mix .seg button[data-v="stems"]'); return b && b.getAttribute('aria-pressed') === 'true' ? 'stems' : 'orig'; };
    const setMode = m => { const b = o.host.querySelector('.ai-mix .seg button[data-v="' + m + '"]'); if (b) b.click(); };
    const baseName = () => String((o.song && o.song()) || 'song').replace(/\.[a-z0-9]{1,5}$/i, '');
    function saveWav(tk, sr) { PD.ui.download(baseName() + ' - ' + tk.name + '.wav', wav(tk.L, tk.R, sr, PD.store.get('s3.wavFmt', 'i16')), 'audio/wav'); }
    let lanes = [], sig = '', peaks = [], W = 0, H = 0, dpr = 1, drag = false, zoom = PD.store.get('s3.tlZoom', false);
    /** what the timeline shows: the whole song, or only the separated part (zoomed in on it) */
    const view = () => { const c = cur(), dur = c && c.res ? c.res.dur : 0, st = c && c.stems; return zoom && st && st.len ? [st.from || 0, Math.min(dur || 1e9, (st.from || 0) + st.len)] : [0, dur]; };
    const zSeg = h('div', { class: 'seg s3s-z', role: 'group', 'aria-label': t('s3s.zoom'), hidden: true }, [[false, 's3s.zAll'], [true, 's3s.zPart']].map(([v, k]) => h('button', { type: 'button', 'data-v': String(v), 'aria-pressed': String(zoom === v), text: t(k), onclick: () => { zoom = v; PD.store.set('s3.tlZoom', v); zSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === String(v)))); resize(); } })));
    top.append(zSeg);
    function build() {
      const c = cur(), st = c && c.stems, ab = c && c.audio;
      lanes = [{ name: 'mix', label: t('s3s.orig'), L: ab ? ab.getChannelData(0) : null, R: ab && ab.numberOfChannels > 1 ? ab.getChannelData(1) : null, sr: ab ? ab.sampleRate : 44100, from: 0, orig: true }]
        .concat(st ? st.tracks.map(x => ({ name: x.name, label: t(NAME[x.name] || 'ai.other'), L: x.L, R: x.R, sr: st.sr, from: st.from || 0 })) : []);
      lanesHead.innerHTML = '';
      lanes.forEach(ln => {
        const bt = (txt, key, fn, cls) => h('button', { type: 'button', class: 's3s-b ' + (cls || ''), text: txt, title: t(key), 'aria-label': ln.label + ' · ' + t(key), onclick: fn });
        const kids = ln.orig
          ? [st ? bt('▶', 's3s.useOrig', () => setMode('orig'), 'play') : null, h('button', { type: 'button', class: 's3s-b', html: DL, title: t('s3s.origFile'), 'aria-label': t('s3s.origFile'), onclick: async () => { const id = c && c.id, b = id && await PD.blobs.get('ai.song.' + id); const f = b || (c && c.file); if (f) PD.ui.download((c.file && c.file.name) || 'song', f, f.type); } })]
          : [bt('M', 's3s.m', () => { const r = mixRow(ln.name); const b = r && r.querySelector('.ai-ms.m'); if (b) b.click(); paintHeads(); }, 'm'), bt('S', 's3s.s', () => { const r = mixRow(ln.name); const b = r && r.querySelector('.ai-ms.s'); if (b) b.click(); paintHeads(); }, 's'),
            h('button', { type: 'button', class: 's3s-b', html: DL, title: t('s3s.wav'), 'aria-label': ln.label + ' · ' + t('s3s.wav'), onclick: () => saveWav(ln, ln.sr) })];
        const row = h('div', { class: 's3s-lh', 'data-n': ln.name }, [h('i', { style: 'background:' + (COL[ln.name] || COL.other) }), h('span', { class: 's3s-ln', text: ln.label, title: ln.label }), h('span', { class: 's3s-bs' }, kids.filter(Boolean))]);
        ln.row = row; lanesHead.append(row);
      });
      empty.hidden = !!st; zSeg.hidden = !st; resize(); paintHeads(); paintKeep();
    }
    function paintHeads() {
      const st = cur() && cur().stems, md = mode();
      lanes.forEach(ln => {
        if (ln.orig) { ln.dim = !!st && md === 'stems'; ln.row.classList.toggle('dim', ln.dim); const p = ln.row.querySelector('.play'); if (p) { p.classList.toggle('on', md === 'orig'); p.setAttribute('aria-pressed', String(md === 'orig')); } return; }
        const r = mixRow(ln.name), m = !!(r && r.querySelector('.ai-ms.m.on')), s = !!(r && r.querySelector('.ai-ms.s.on')), anyS = !!o.host.querySelector('.ai-mix .ai-ms.s.on');
        ln.dim = md !== 'stems' || m || (anyS && !s);
        ln.row.classList.toggle('dim', ln.dim);
        const bm = ln.row.querySelector('.m'), bs = ln.row.querySelector('.s'); bm.classList.toggle('on', m); bm.setAttribute('aria-pressed', String(m)); bs.classList.toggle('on', s); bs.setAttribute('aria-pressed', String(s));
      });
    }
    function resize() {
      const box = cv.parentElement; if (!box) return; dpr = Math.min(2, window.devicePixelRatio || 1);
      const rowH = lanes[0] && lanes[0].row ? lanes[0].row.offsetHeight || 40 : 40;
      W = Math.max(120, box.clientWidth); H = lanes.length * rowH; cv.style.height = H + 'px'; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      const v = view(); peaks = lanes.map(ln => peakOf(ln, v)); draw();
    }
    function peakOf(ln, v) {
      const r0 = v[0], span = v[1] - v[0]; if (!ln.L || !(span > 0)) return null;
      const n = W, out = new Float32Array(n), a0 = ln.from, step = 3;
      for (let x = 0; x < n; x++) {
        const s0 = Math.floor((r0 + x / n * span - a0) * ln.sr), s1 = Math.floor((r0 + (x + 1) / n * span - a0) * ln.sr); if (s1 <= 0 || s0 >= ln.L.length) { out[x] = -1; continue; }
        let m = 0; for (let i = Math.max(0, s0); i < Math.min(ln.L.length, s1); i += step) { const y = Math.abs(ln.L[i]) + (ln.R && ln.R !== ln.L ? Math.abs(ln.R[i]) : Math.abs(ln.L[i])); if (y > m) m = y; }
        out[x] = m / 2;
      }
      return out;
    }
    function draw() {
      const g = cv.getContext('2d'); if (!g || !W) return; const c = cur(), dur = c && c.res ? c.res.dur : 0, dk = c && c.transport, rh = H / Math.max(1, lanes.length);
      const v = view(), span = v[1] - v[0], X = s => (s - v[0]) / span * W;   // seconds → x in the visible range
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      const css = getComputedStyle(el), line = css.getPropertyValue('--s3s-line').trim() || 'rgba(255,255,255,.08)', dimA = .32;
      // bars: from the song's own beats
      if (c && c.res && c.res.beats && dur) { const B = c.res.beats, bpb = (dk && dk.D && dk.D.bpb) || 4, ph = (dk && dk.D && dk.D.phase) || 0; g.fillStyle = line; for (let k = ph; k < B.length; k += bpb) { const x = Math.round(X(B[k])) + .5; if (x >= 0 && x <= W) g.fillRect(x, 0, 1, H); } }
      lanes.forEach((ln, i) => {
        const y0 = i * rh, mid = y0 + rh / 2, pk = peaks[i], col = COL[ln.name] || COL.other;
        g.fillStyle = line; g.fillRect(0, y0 + rh - 1, W, 1);
        if (!pk) return;
        g.globalAlpha = ln.dim ? dimA : 1; g.fillStyle = col;
        for (let x = 0; x < W; x++) { const v = pk[x]; if (v < 0) continue; const hh = Math.max(.5, Math.min(1, v) * (rh / 2 - 3)); g.fillRect(x, mid - hh, 1, hh * 2); }
        g.globalAlpha = 1;
        if (!ln.orig && dur) {   // where this stem has nothing because that part was not separated
          const a = X(ln.from), b = X(ln.from + ln.L.length / ln.sr); g.fillStyle = 'rgba(128,128,128,.10)';
          if (a > 1) g.fillRect(0, y0, a, rh - 1); if (b < W - 1) g.fillRect(b, y0, W - b, rh - 1);
        }
      });
      if (dk && dk.D && dk.D.loop && dk.D.loop.on && dur) { const a = X(dk.D.loop.a), b = X(dk.D.loop.b); g.fillStyle = 'rgba(210,161,94,.14)'; g.fillRect(a, 0, Math.max(2, b - a), H); }
      if (dk && dur) { const x = Math.round(X(Math.min(dur, dk.pos()))); if (x >= 0 && x <= W) { g.fillStyle = '#D2A15E'; g.fillRect(x - 1, 0, 2, H); } cv.setAttribute('aria-valuenow', String(Math.round(dk.pos()))); cv.setAttribute('aria-valuemax', String(Math.round(dur))); cv.setAttribute('aria-valuetext', clock(dk.pos()) + ' / ' + clock(dur)); }
    }
    const seekAt = e => { const c = cur(), dk = c && c.transport, dur = c && c.res ? c.res.dur : 0; if (!dk || !dur) return; const r = cv.getBoundingClientRect(), v = view(), x = Math.max(0, Math.min(dur, v[0] + (e.clientX - r.left) / r.width * (v[1] - v[0]))), st = c.stems;
      if (st && mode() === 'stems' && (x < st.from - .05 || x > st.from + st.len + .05)) setMode('orig');   // the stems have nothing there: the original plays
      dk.seek(x); };
    cv.addEventListener('pointerdown', e => { drag = true; try { cv.setPointerCapture(e.pointerId); } catch (_) {} seekAt(e); });
    cv.addEventListener('pointermove', e => { if (drag) seekAt(e); });
    cv.addEventListener('pointerup', () => { drag = false; }); cv.addEventListener('pointercancel', () => { drag = false; });
    cv.addEventListener('keydown', e => { const c = cur(), dk = c && c.transport; if (!dk) return; const k = { ArrowLeft: -5, ArrowRight: 5 }[e.key]; if (k) { e.preventDefault(); dk.seek(Math.max(0, dk.pos() + k)); } });
    // the job of this song, and what is kept
    let kept = null;
    async function paintKeep() {
      const c = cur(), id = c && c.id, st = c && c.stems; keepRow.innerHTML = '';
      if (!st || !id) { keepRow.hidden = true; return; }
      kept = await meta(id); if (cur() !== c) return; keepRow.hidden = false; keepRow.innerHTML = '';
      if (kept) keepRow.append(h('span', { class: 's3s-ok', text: '✓ ' + t('s3s.kept') }), h('small', { class: 'muted', text: t('s3s.keptD', { n: kept.tracks.length, mb: fmtMB(kept.bytes), when: when(kept.at) }) + ' · ' + t('s3s.eng.' + (kept.engine === 'light' ? 'light' : 'heavy')) + (kept.shifts > 1 ? ' · ' + t('s3s.passes', { n: kept.shifts }) : '') + (kept.ep ? ' · ' + kept.ep.toUpperCase() : '') }),
        h('button', { type: 'button', class: 'btn small ghost s3s-del', text: t('s3s.del'), onclick: () => { if (!confirm(t('s3s.delQ', { mb: fmtMB(kept.bytes) }))) return; drop(id).then(() => { PD.ui.toast(t('s3s.deleted')); paintKeep(); if (o.changed) o.changed(); }); } }));
      else { const j = jobs.slice().reverse().find(x => x.song === id && x.st === st);
        keepRow.append(...[h('span', { class: 's3s-warn', text: t('s3s.notKept') }), j && j.err ? h('small', { class: 'muted', text: j.err }) : null].filter(Boolean), h('button', { type: 'button', class: 'btn small s3s-keepb', text: t('s3s.keepNow'), onclick: async () => { const r = await save(id, st, j ? { engine: j.engine, model: j.model, ep: j.ep, shifts: j.shifts } : { engine: st.engine || 'heavy' }); if (!r.kept) PD.ui.toast(r.reason || t('s3s.noIdb'), 6000); paintKeep(); if (o.changed) o.changed(); } })); }
    }
    function paintJob() {
      const c = cur(), id = c && c.id, j = jobs.slice().reverse().find(x => !x.old && x.song === id) || null;
      if (!j) { jobBox.hidden = true; return; }
      jobBox.hidden = false; jobBox.dataset.state = j.state; jobBox.innerHTML = '';
      const live = !FINAL.has(j.state);
      const what = t('s3s.eng.' + (j.engine === 'light' ? 'light' : 'heavy')) + (j.model === 'model6' ? ' · 6' : '') + (j.shifts > 1 ? ' · ' + t('s3s.passes', { n: j.shifts }) : '') + ' · ' + (j.two ? t('s3s.whole2') + ' · ' : '') + t('s3s.part', { a: clock(j.from || 0), b: clock((j.from || 0) + (j.len || 0)) });
      jobBox.append(h('div', { class: 's3s-jt' }, [h('span', { class: 's3s-chip s3s-' + j.state, text: t('s3s.st.' + j.state) }), h('small', { class: 'muted', text: what }), h('span', { class: 'grow' }),
        live ? h('button', { type: 'button', class: 'btn small s3s-cancel', text: t('s3s.cancel'), onclick: () => j.cancelNow() }) : null,
        (j.state === 'error' || j.state === 'cancelled') && j._retry ? h('button', { type: 'button', class: 'btn small primary s3s-retry', text: t('s3s.retry'), onclick: () => j.retry() }) : null]));
      if (live) jobBox.append(h('div', { class: 's3s-bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(Math.round(j.p * 100)) }, [h('i', { style: 'width:' + Math.round(j.p * 100) + '%' })]),
        h('small', { class: 'muted', text: Math.round(j.p * 100) + '%' + (j.eta != null && j.state === 'separating' ? ' · ' + t('s3s.eta', { t: PD.fmtTime(Math.max(1, j.eta)) }) : '') + (j.ep ? ' · ' + j.ep.toUpperCase() : '') }));
      if (j.err && (j.state === 'error' || j.state === 'partial')) jobBox.append(h('small', { class: 's3s-err', text: j.err }));
    }
    const offJ = on(j => { if (!el.isConnected) return; paintJob(); if (FINAL.has(j.state)) { paintKeep(); if (o.changed) o.changed(); } });
    // restore: a song that has stems kept takes them back without separating again
    let restored = null;
    async function restore() {
      const c = cur(), id = c && c.id; if (!id || c.stems || restored === id) return; restored = id;
      const m = await meta(id); if (!m || cur() !== c) return;
      restoreLine.hidden = false; restoreLine.textContent = t('s3s.restoring');
      const r = await load(id); if (cur() !== c) return;
      if (!r || r.bad) { await drop(id); restoreLine.textContent = t('s3s.restoreBad'); return; }
      c.adopt(r.st, r.meta.mix || null); restoreLine.textContent = t('s3s.restored', { when: when(m.at) }); if (o.changed) o.changed();
    }
    // follows the song: a new song, new stems, a resize
    let raf = 0, saveT = 0, lastMix = '';
    const ro = window.ResizeObserver ? new ResizeObserver(() => resize()) : null; if (ro) ro.observe(tl);
    let stale = true;
    function tick() {
      raf = requestAnimationFrame(tick); if (!el.isConnected || document.hidden) return;
      const c = cur(), s2 = [c && c.id, c && c.stems && c.stems.id, c && c.audio && c.audio.length].join('|');
      if (s2 !== sig) { sig = s2; stale = true; restore(); }   // kept stems come back whatever view is open
      if (el.offsetParent === null) return;
      if (stale) { stale = false; build(); paintJob(); } else { paintHeads(); draw(); }
    }
    function saveMix() { const c = cur(); if (!c || !c.id || !c.stems || !c.mix || !kept) return; const j = JSON.stringify(c.mix); if (j !== lastMix) { lastMix = j; setMix(c.id, c.mix); } }
    saveT = setInterval(saveMix, 4000);
    raf = requestAnimationFrame(tick);
    const off = PD.bus.on('route', () => { saveMix(); cancelAnimationFrame(raf); clearInterval(saveT); offJ(); if (ro) ro.disconnect(); off(); });
    return { el, refresh: () => { stale = true; } };
  }
  return { save, load, drop, meta, gc, total, setMix, list, on, start, wav, stage, bytesOf, fmtMB, _keys: keys };
})();
