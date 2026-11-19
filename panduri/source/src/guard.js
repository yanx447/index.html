/* =====================================================================
   PD.guard — სიმა უსმენს ვიდეოს, სანამ საზოგადოებაში აიტვირთება.
   Sima listens to a clip before it goes to the community, on this device,
   and lets it through only when:
     · it sounds like plucked strings in the panduri's range — steady,
       tuned notes between A3 and the 17th fret of E4 — not talk, not
       silence, not a band with drums and a bass guitar;
     · the sound is good: not clipped, not too quiet, not drowned in
       noise, not squeezed into a phone-call band by a weak encoder;
     · the picture is good: HD at least, enough bits for its size, sharp,
       not dark.
   It is a measurement, not a recognition of „the panduri" itself: a
   guitar or a chonguri in the same range can pass, and the app says so.
   Every number comes out of the file; nothing is uploaded to be judged.
   The calibration (qa/guard-calibrate.cjs) runs the teacher's own
   recordings, a piano, speech and noise through the same code.
   ===================================================================== */
'use strict';
PD.i18n.add({
  'sq.title': ['სიმამ მოუსმინა', 'Sima listened'], 'sq.busy': ['სიმა უსმენს ვიდეოს…', 'Sima is listening to the video…'],
  'sq.ok': ['ფანდური ისმის, ხმა და სურათი კარგი ხარისხისაა — შეგიძლია გამოაქვეყნო.', 'A fanduri is heard, and the sound and picture are good — you can post it.'],
  'sq.no': ['ეს ვიდეო საზოგადოებაში ვერ აიტვირთება:', 'This video cannot go to the community:'],
  'sq.notSent': ['ვიდეო არსად გაგზავნილა — ის მხოლოდ ამ მოწყობილობაზეა.', 'The video was not sent anywhere — it is only on this device.'],
  'sq.rule': ['საზოგადოებაში მხოლოდ ფანდურზე დაკრული ვიდეოები და ფანდურის მუსიკა იდება, კარგი ხმითა და სურათით. სიმა ყველა ვიდეოს ამ მოწყობილობაზე ამოწმებს, ატვირთვამდე.', 'The community takes only videos played on the fanduri and fanduri music, with good sound and picture. Sima checks every video on this device, before it is uploaded.'],
  'sq.limit': ['სიმა ზომავს: სიმებიანი ინსტრუმენტის აწყობილ ნოტებს ფანდურის დიაპაზონში. ფანდურს სხვა მსგავსი ინსტრუმენტისგან (გიტარა, ჩონგური) ყოველთვის ვერ განასხვავებს.', 'What Sima measures: tuned notes of a plucked string instrument in the fanduri’s range. She cannot always tell a fanduri from a similar instrument (a guitar, a chonguri).'],
  'sq.r.silent': ['ხმა თითქმის არ ისმის.', 'There is almost no sound.'],
  'sq.r.noAudio': ['ვიდეოს ხმა ვერ წავიკითხე — უხმო ან ამ მოწყობილობისთვის უცნობი ფორმატია.', 'I could not read the video’s sound — it is silent, or in a format this device cannot read.'],
  'sq.r.notes': ['აწყობილი ნოტები თითქმის არ ისმის — ეს ლაპარაკს ან ხმაურს ჰგავს და არა ფანდურზე დაკვრას.', 'Almost no tuned notes are heard — it sounds like talking or noise, not fanduri playing.'],
  'sq.r.range': ['ნოტების უმეტესობა ფანდურის დიაპაზონს (ლა მცირე — ლა მეორე ოქტავა) სცდება.', 'Most of the notes lie outside the fanduri’s range (A3 to A5).'],
  'sq.r.pluck': ['ნოტები ხანგრძლივად ჟღერს და არ ქრება, როგორც მოჭიდებულ სიმზე — ფანდური ასე არ ჟღერს.', 'The notes hold on instead of dying away as a plucked string does — a fanduri does not sound like this.'],
  'sq.r.band': ['ძლიერი ბასი და დასარტყამები ისმის — ეს ბენდის ან ჩანაწერის მუსიკაა და არა ფანდური.', 'Strong bass and drums are heard — this is band or recorded music, not a fanduri.'],
  'sq.r.clip': ['ხმა ძალიან ხმამაღლა ჩაიწერა და ჭრის (clipping) — მიკროფონი ოდნავ მოაშორე.', 'The sound was recorded too loud and clips — move the microphone a little further away.'],
  'sq.r.quiet': ['ხმა ძალიან ჩუმია — მიკროფონთან ახლოს დაუკარი.', 'The sound is too quiet — play closer to the microphone.'],
  'sq.r.noise': ['ხმაური ძალიან ბევრია — ფანდური ფონურ ხმაურს ძლივს სცდება ({n} dB).', 'There is too much noise — the fanduri is barely above the background ({n} dB).'],
  'sq.r.narrow': ['ხმა დაბალი ხარისხისაა: მაღალი სიხშირეები {n} kHz-ზე წყდება (ტელეფონის ზარის ან ძლიერ შეკუმშული ფაილის ხმა).', 'The sound is low quality: it stops at {n} kHz (like a phone call, or a heavily compressed file).'],
  'sq.r.small': ['სურათი {n}p-ია — საჭიროა მინიმუმ 720p.', 'The picture is {n}p — at least 720p is needed.'],
  'sq.r.bits': ['ვიდეო ძალიან შეკუმშულია ({n} Mb/s) — სურათი დაბალი ხარისხის იქნება. გადაიღე უფრო მოკლე ვიდეო.', 'The video is compressed too hard ({n} Mb/s) — the picture would be low quality. Film a shorter video.'],
  'sq.r.blur': ['სურათი ბუნდოვანია — კამერა გაწმინდე ან ფოკუსი შეასწორე.', 'The picture is blurred — clean the lens or let it focus.'],
  'sq.r.dark': ['სურათი ძალიან ბნელია — მეტი შუქი საჭიროა.', 'The picture is too dark — more light is needed.'],
  'sq.r.slow': ['ვიდეოს კადრების სიხშირე ძალიან დაბალია.', 'The video’s frame rate is too low.'],
  'sq.m.notes': ['აწყობილი ნოტები', 'tuned notes'], 'sq.m.range': ['ფანდურის დიაპაზონში', 'in the fanduri’s range'], 'sq.m.snr': ['ხმა / ხმაური', 'signal / noise'],
  'sq.m.band': ['ხმის სიგანე', 'sound bandwidth'], 'sq.m.pic': ['სურათი', 'picture'],
  'sq.wav': ['ხმა WAV-ად შენახვა', 'Save the sound as WAV'], 'sq.wavNote': ['კამერამ ხმა ასევე უშეკუმშოდ ჩაწერა (WAV, {k} kHz, {c}) — ეს ფაილი მხოლოდ შენთანაა.', 'The camera also recorded the sound uncompressed (WAV, {k} kHz, {c}) — this file stays with you.'],
  'sq.stereo': ['სტერეო', 'stereo'], 'sq.mono': ['მონო', 'mono'],
  'sq.modeOff': ['უფრო გრძელი ვიდეო კარგ ხარისხში სერვერის ლიმიტს ({n} MB) ვერ ეტევა.', 'A longer video at good quality does not fit the server’s limit ({n} MB).']
});

PD.guard = (() => {
  /* the floors — what „good" means here, in one place */
  const Q = {
    minSide: 720,          // px, the short side
    bpp: 0.015,            // bits per pixel per frame below which any file is starved (720p30 ≈ 0.4 Mb/s): a still scene filmed
                           // well needs few bits, so the floor is low and the blur check catches the blocky rest
    recBpp: 0.05,          // what the camera itself aims at (1080p30 ≈ 3.1 Mb/s, 720p30 ≈ 1.4 Mb/s): a length that cannot reach it is not offered
    minFps: 20,
    sharp: 14,             // Laplacian spread of a 360-pixel frame (a focused room ≈ 25–80, a smeared lens < 10)
    dark: 32,              // mean brightness out of 255
    clip: 0.002,           // share of the sound that sits on full scale
    quiet: -42,            // dBFS, the loud part (90th percentile) of the playing
    snr: 11,               // dB the playing rises above the room's steady noise (the teacher's takes: 14–51; a voice under hiss: 7)
    band: 14500,           // Hz the encoder keeps: AAC 32 kb/s ≈ 9.5 kHz fails, 64 kb/s ≈ 16 kHz and an MP3 ≈ 15.3 kHz pass, a phone's own ≈ 20 kHz
    notes: 0.65,           // share of the playing that holds tuned notes (the teacher's: 0.79–0.96; speech: 0.42–0.58)
    range: 0.55,           // share of those frames with a strong note in the panduri's range
    bass: 0.75,            // share of the energy below 110 Hz: a bass guitar and a kick drum (the ensemble „ბანი": 0.47–0.59)
    sustain: 0.85          // dB lost per 100 ms after an attack: less is a held note, not a plucked one (the teacher's: 3.2–7.4)
  };
  const LO_F = 200, HI_F = 950;   // A3 ≈ 220 Hz … the 17th fret of E4 ≈ 880 Hz, with a little room for tuning

  /* ---------- a small FFT ---------- */
  function fftPow(N) {
    const lg = Math.log2(N), rev = new Uint32Array(N), cs = new Float64Array(N / 2), sn = new Float64Array(N / 2), win = new Float64Array(N);
    for (let i = 0; i < N; i++) { let r = 0; for (let k = 0; k < lg; k++) r |= ((i >> k) & 1) << (lg - 1 - k); rev[i] = r; win[i] = .5 - .5 * Math.cos(2 * Math.PI * i / N); }
    for (let i = 0; i < N / 2; i++) { cs[i] = Math.cos(2 * Math.PI * i / N); sn[i] = -Math.sin(2 * Math.PI * i / N); }
    const re = new Float64Array(N), im = new Float64Array(N);
    return (x, off, out) => {
      for (let i = 0; i < N; i++) { re[rev[i]] = (x[off + i] || 0) * win[i]; im[rev[i]] = 0; }
      for (let size = 2; size <= N; size <<= 1) {
        const half = size >> 1, step = N / size;
        for (let i = 0; i < N; i += size) for (let j = 0, k = 0; j < half; j++, k += step) {
          const a = i + j, c = a + half, tr = re[c] * cs[k] - im[c] * sn[k], ti = re[c] * sn[k] + im[c] * cs[k];
          re[c] = re[a] - tr; im[c] = im[a] - ti; re[a] += tr; im[a] += ti;
        }
      }
      for (let i = 0; i <= N / 2; i++) out[i] = re[i] * re[i] + im[i] * im[i];
    };
  }
  const db = p => 10 * Math.log10(p + 1e-20);
  const pct = (a, q) => { if (!a.length) return -120; const s = Float64Array.from(a).sort(); return s[Math.min(s.length - 1, Math.floor(q * s.length))]; };

  /** which stretches of a long clip are listened to: all of a short one, twelve 5-second pieces of a long one */
  function spans(n, sr) {
    const W = 5 * sr; if (n <= 60 * sr) return [[0, n]];
    const out = []; for (let i = 0; i < 12; i++) { const s = Math.floor((n - W) * (i + .5) / 12); out.push([s, s + W]); } return out;
  }

  /** the sound, measured. chs: Float32Array per channel; sr: sample rate. Pure: runs in Node for the calibration too.
   *  · level and clipping on the samples themselves;
   *  · noise: a room's noise is steady, playing is not — per frequency band, how far the playing rises above the
   *    band's own quietest tenth (a strummed rhythm has no silent gaps, so the gaps alone cannot tell);
   *  · bandwidth: where an encoder's low-pass cuts the sound off;
   *  · tuned notes: spectral peaks that stand 12 dB above their neighbourhood and hold their frequency from one
   *    frame to the next (a chord of three strings is three of them; speech glides and has none that hold);
   *  · range: among the strong notes of a frame (within 12 dB of the strongest) one lies on the panduri (A3 … the
   *    17th fret of E4, with room) — an ensemble's bass or low voices may sound beneath it;
   *  · plucked: after each attack the sound dies away (dB per 100 ms), as a plucked string does — a voice, an
   *    organ or a bowed string holds it. */
  function measure(chs, sr) {
    const n = chs[0].length, C = chs.length, mono = new Float32Array(n);
    for (let c = 0; c < C; c++) { const x = chs[c]; for (let i = 0; i < n; i++) mono[i] += x[i] / C; }
    const S = spans(n, sr), m = { sr, dur: n / sr };
    // level, clipping, and the attacks
    const F = 512, lev = []; let clipped = 0, counted = 0, peak = 0; const decays = [];
    for (const [a, b] of S) {
      for (let c = 0; c < C; c++) { const x = chs[c]; let run = 0; for (let i = a; i < b; i++) { const v = Math.abs(x[i]); if (v > peak) peak = v; if (v >= .995) { if (++run === 3) clipped += 3; else if (run > 3) clipped++; } else run = 0; } counted += b - a; }
      const L = []; for (let i = a; i + F <= b; i += F) { let e = 0; for (let k = 0; k < F; k++) e += mono[i + k] * mono[i + k]; L.push(db(e / F)); }
      lev.push(...L);
      const fr = sr / F, gap = Math.round(fr * .06), look = Math.round(fr * .15);
      for (let i = 4; i + look + 4 < L.length; i++) {
        if (L[i] - L[i - 4] < 6) continue;
        let p = i; for (let k = i; k < i + 4; k++) if (L[k] > L[p]) p = k;
        decays.push((L[p] - Math.min(...L.slice(p + 1, p + look + 1))) / (look / fr * 10)); i = p + gap;
      }
    }
    m.peak = db(peak * peak); m.clip = clipped / Math.max(1, counted);
    m.loud = pct(lev, .9); m.floor = pct(lev, .1); m.gaps = m.loud - m.floor;
    m.decay = decays.length ? pct(decays, .5) : null; m.attacks = decays.length;
    const act = m.loud - 18;   // the playing: within 18 dB of its loud part
    // the spectrum, frame by frame
    const N = 4096, H = 2048, fp = fftPow(N), pw = new Float64Array(N / 2 + 1), sum = new Float64Array(N / 2 + 1), hz = k => k * sr / N, bin = f => Math.round(f * N / sr);
    const edges = []; for (let f = 150; f < Math.min(9000, sr / 2); f *= 1.25) edges.push(bin(f));
    const bands = edges.slice(0, -1).map(() => []);
    const k0 = Math.max(2, bin(60)), k1 = bin(4000), loR = bin(190), hiR = bin(1000);
    let frames = 0, tonal = 0, inRange = 0, prev = new Uint8Array(N / 2 + 1), cur = new Uint8Array(N / 2 + 1);
    for (const [a, b] of S) {
      prev.fill(0);
      for (let i = a; i + N <= b; i += H) {
        fp(mono, i, pw);
        let e = 0; for (let k = 1; k <= N / 2; k++) e += pw[k];
        for (let j = 0; j < bands.length; j++) { let s = 0; for (let k = edges[j]; k < edges[j + 1]; k++) s += pw[k]; bands[j].push(db(s)); }
        cur.fill(0);
        if (db(e / (N * N / 8)) < act) { const t = prev; prev = cur; cur = t; continue; }
        frames++; for (let k = 0; k <= N / 2; k++) sum[k] += pw[k];
        // peaks 12 dB above the median of ±24 bins, from 60 Hz (a bass note below the panduri must be seen) to 4 kHz
        let held = 0, strong = 0, inP = 0;
        for (let k = k0; k < k1; k++) {
          if (!(pw[k] > pw[k - 1] && pw[k] >= pw[k + 1])) continue;
          const nb = []; for (let j = Math.max(1, k - 24); j <= k + 24; j += 3) nb.push(pw[j]); nb.sort((x, y) => x - y);
          if (db(pw[k]) - db(nb[nb.length >> 1]) < 12 || db(pw[k]) < db(e) - 45) continue;
          cur[k] = 1;
          if (prev[k] || prev[k - 1] || prev[k + 1]) { held++; if (pw[k] > strong) strong = pw[k]; if (k >= loR && k <= hiR && pw[k] > inP) inP = pw[k]; }
        }
        if (held >= 2) { tonal++; if (inP && db(inP) >= db(strong) - 12) inRange++; }
        const t = prev; prev = cur; cur = t;
      }
    }
    m.frames = frames; m.notes = frames ? tonal / frames : 0; m.range = tonal ? inRange / tonal : 0;
    // noise: per band, how far its loud tenth stands above its quiet tenth; the median band speaks for the clip
    const rises = bands.filter(x => x.length).map(x => pct(x, .9) - pct(x, .1)).sort((x, y) => x - y);
    m.steady = rises.length ? rises[rises.length >> 1] : 0;
    m.snr = Math.max(m.gaps, m.steady);
    if (frames) {
      let top = 0, tot = 0, bass = 0; for (let k = 1; k <= N / 2; k++) { if (sum[k] > top) top = sum[k]; tot += sum[k]; if (hz(k) < 110) bass += sum[k]; }
      // bandwidth: the highest frequency where the sound is still within 65 dB of its strongest — an encoder's
      // low-pass is a cliff, so the edge is read on a lightly smoothed spectrum and must hold for 300 Hz
      let edge = 0; const sm = k => { let s = 0, c = 0; for (let j = Math.max(1, k - 3); j <= Math.min(N / 2, k + 3); j++) { s += sum[j]; c++; } return s / c; };
      const hold = Math.ceil(300 / (sr / N));
      for (let k = N / 2 - hold; k > 1; k--) { let ok = true; for (let j = 0; j < hold; j += 2) if (db(sm(k + j)) < db(top) - 65) { ok = false; break; } if (ok) { edge = hz(k + hold); break; } }
      m.band = Math.min(sr / 2, edge); m.bass = bass / (tot || 1);
    } else { m.band = 0; m.bass = 0; }
    m.active = frames;
    return m;
  }

  /** what the numbers mean: a list of reasons, empty when the clip may go */
  function judgeSound(m) {
    const r = [];
    if (!m || m.loud < -60 || !m.active) { r.push(['sq.r.silent']); return r; }
    if (m.clip > Q.clip) r.push(['sq.r.clip']);
    if (m.loud < Q.quiet) r.push(['sq.r.quiet']);
    if (m.snr < Q.snr) r.push(['sq.r.noise', { n: Math.round(m.snr) }]);
    if (m.band && m.band < Q.band) r.push(['sq.r.narrow', { n: (m.band / 1000).toFixed(1) }]);
    if (m.notes < Q.notes) r.push(['sq.r.notes']);
    else {
      if (m.range < Q.range) r.push(['sq.r.range']);
      if (m.decay != null && m.attacks >= 6 && m.decay < Q.sustain) r.push(['sq.r.pluck']);
    }
    if (m.bass > Q.bass) r.push(['sq.r.band']);
    return r;
  }
  function judgePicture(v) {
    const r = []; if (!v) return r;
    const lo = Math.min(v.w || 0, v.h || 0);
    if (lo && lo < Q.minSide) r.push(['sq.r.small', { n: lo }]);
    if (v.bpp != null && v.bpp < Q.bpp) r.push(['sq.r.bits', { n: (v.vbr / 1e6).toFixed(1) }]);
    if (v.fps && v.fps < Q.minFps) r.push(['sq.r.slow']);
    if (v.sharp != null && v.sharp < Q.sharp) r.push(['sq.r.blur']);
    if (v.light != null && v.light < Q.dark) r.push(['sq.r.dark']);
    return r;
  }

  /* ---------- in the browser: the file's own sound, and a few of its frames ---------- */
  async function decode(blob) {
    const AC = window.OfflineAudioContext || window.webkitOfflineAudioContext; if (!AC) return null;
    const buf = await blob.arrayBuffer();
    const ctx = new AC(2, 48000, 48000);   // decoding resamples to the context's rate: 48 kHz keeps everything up to 24 kHz
    const ab = await new Promise((res, rej) => { const p = ctx.decodeAudioData(buf, res, rej); if (p && p.then) p.then(res, rej); });
    const chs = []; for (let c = 0; c < Math.min(2, ab.numberOfChannels); c++) chs.push(ab.getChannelData(c));
    return { chs, sr: ab.sampleRate };
  }
  /** sharpness (spread of the Laplacian) and brightness of five frames, drawn 360 pixels tall */
  async function picture(blob, meta) {
    const out = { w: meta.w, h: meta.h, fps: meta.fps || 0 };
    const dur = meta.dur || 0, abits = meta.abr || 192000;
    if (dur) { out.vbr = Math.max(0, blob.size * 8 / dur - abits); out.bpp = meta.w && meta.h ? out.vbr / (meta.w * meta.h * (meta.fps || 30)) : null; }
    const url = URL.createObjectURL(blob), v = document.createElement('video'); v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = url;
    try {
      await new Promise((res, rej) => { v.onloadeddata = res; v.onerror = rej; setTimeout(rej, 8000); });
      if (!v.videoWidth) return out;
      const k = 360 / Math.min(v.videoWidth, v.videoHeight), cw = Math.round(v.videoWidth * k), ch = Math.round(v.videoHeight * k);
      const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; const g = cv.getContext('2d', { willReadFrequently: true });
      const sharp = [], light = [], D = dur || v.duration || 1;
      for (let i = 0; i < 5; i++) {
        await new Promise(res => { v.onseeked = res; setTimeout(res, 2500); v.currentTime = D * (i + .5) / 5; });
        g.drawImage(v, 0, 0, cw, ch); const px = g.getImageData(0, 0, cw, ch).data, Y = new Float32Array(cw * ch);
        let s = 0; for (let p = 0, q = 0; q < Y.length; p += 4, q++) { Y[q] = .299 * px[p] + .587 * px[p + 1] + .114 * px[p + 2]; s += Y[q]; }
        let n = 0, sum = 0, sq = 0;
        for (let y = 1; y < ch - 1; y += 2) for (let x = 1; x < cw - 1; x += 2) { const q = y * cw + x, l = 4 * Y[q] - Y[q - 1] - Y[q + 1] - Y[q - cw] - Y[q + cw]; sum += l; sq += l * l; n++; }
        sharp.push(Math.sqrt(Math.max(0, sq / n - (sum / n) ** 2))); light.push(s / Y.length);
      }
      sharp.sort((a, b) => a - b); light.sort((a, b) => a - b);
      out.sharp = sharp[sharp.length - 1]; out.light = light[2];   // the sharpest frame (a hand in motion blurs some), the middle brightness
    } catch (_) {} finally { v.removeAttribute('src'); try { v.load(); } catch (_) {} URL.revokeObjectURL(url); }
    return out;
  }
  /** the whole check. prep: what social.prepare made ({ blob, meta }); opts.wav: the camera's own uncompressed sound */
  async function check(prep, opts) {
    opts = opts || {};
    let m = null;
    // what the viewers will hear is the file's own (compressed) sound: that is what is judged
    try { const a = await decode(prep.blob); if (a) m = measure(a.chs, a.sr); } catch (_) {}
    let reasons;
    if (!m && opts.wav) { try { m = measure(opts.wav.chs, opts.wav.sr); } catch (_) {} }
    if (!m) reasons = [['sq.r.noAudio']]; else reasons = judgeSound(m);
    let v = null; try { v = await picture(prep.blob, Object.assign({}, prep.meta || {}, { abr: opts.abr })); } catch (_) {}
    reasons = reasons.concat(judgePicture(v));
    return { ok: !reasons.length, reasons, sound: m, picture: v };
  }
  /** what is stored with the post: the measurements, rounded (the server refuses a video post without it) */
  const stamp = res => {
    const m = res.sound || {}, v = res.picture || {}, r1 = x => x == null ? null : Math.round(x * 100) / 100;
    return { v: 1, ok: res.ok, notes: r1(m.notes), range: r1(m.range), snr: r1(m.snr), band: m.band ? Math.round(m.band) : null, bass: r1(m.bass), clip: r1(m.clip * 1000), bpp: r1(v.bpp), sharp: r1(v.sharp) };
  };

  /** the camera's uncompressed sound as a WAV file (24-bit when it fits easily, else 16-bit) */
  function wav(chs, sr, bits) {
    bits = bits || 24; const C = chs.length, n = chs[0].length, B = bits / 8, size = 44 + n * C * B, buf = new ArrayBuffer(size), d = new DataView(buf);
    const w = (o, s) => { for (let i = 0; i < s.length; i++) d.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); d.setUint32(4, size - 8, true); w(8, 'WAVE'); w(12, 'fmt '); d.setUint32(16, 16, true); d.setUint16(20, 1, true); d.setUint16(22, C, true);
    d.setUint32(24, sr, true); d.setUint32(28, sr * C * B, true); d.setUint16(32, C * B, true); d.setUint16(34, bits, true); w(36, 'data'); d.setUint32(40, n * C * B, true);
    let o = 44; const M = bits === 24 ? 8388607 : 32767;
    for (let i = 0; i < n; i++) for (let c = 0; c < C; c++) {
      const v = Math.max(-1, Math.min(1, chs[c][i])) * M;
      if (bits === 24) { const q = Math.round(v); d.setUint8(o, q & 255); d.setUint8(o + 1, (q >> 8) & 255); d.setUint8(o + 2, (q >> 16) & 255); o += 3; }
      else { d.setInt16(o, Math.round(v), true); o += 2; }
    }
    return new Blob([buf], { type: 'audio/wav' });
  }

  /** the microphone, taken sample for sample beside the camera's own recording (an AudioWorklet; a ScriptProcessor where
   *  there is none). Up to `maxSec` seconds are kept — 10 minutes of 48 kHz stereo is 230 MB, too much for a phone. */
  function tap(ctx, track, maxSec) {
    const chunks = [[], []]; let n = 0, node = null, src = null, stopped = false, chN = 1;
    const max = (maxSec || 300) * ctx.sampleRate;
    const take = arr => { if (stopped || n >= max) return; chN = arr.length; for (let c = 0; c < arr.length && c < 2; c++) chunks[c].push(arr[c].slice(0)); n += arr[0].length; };
    const ready = (async () => {
      src = ctx.createMediaStreamSource(new MediaStream([track]));
      if (ctx.audioWorklet && window.AudioWorkletNode) {
        try {
          const code = 'registerProcessor("pd-tap",class extends AudioWorkletProcessor{process(i){const x=i[0];if(x&&x.length)this.port.postMessage(x.map(c=>c.slice(0)));return true}})';
          const u = URL.createObjectURL(new Blob([code], { type: 'application/javascript' }));
          try { await ctx.audioWorklet.addModule(u); } finally { URL.revokeObjectURL(u); }
          node = new AudioWorkletNode(ctx, 'pd-tap', { numberOfInputs: 1, numberOfOutputs: 0, channelCount: 2, channelCountMode: 'explicit' });
          node.port.onmessage = e => take(e.data); src.connect(node); return;
        } catch (_) { node = null; }
      }
      const sp = ctx.createScriptProcessor(4096, 2, 2); node = sp;
      const mute = ctx.createGain(); mute.gain.value = 0;
      sp.onaudioprocess = e => { const b = e.inputBuffer, a = []; for (let c = 0; c < b.numberOfChannels; c++) a.push(b.getChannelData(c)); take(a); };
      src.connect(sp); sp.connect(mute); mute.connect(ctx.destination);
    })();
    return {
      ready,
      stop() {
        stopped = true; try { src && src.disconnect(); } catch (_) {} try { node && node.disconnect(); } catch (_) {}
        if (!n) return null;
        const C = Math.min(2, chN), chs = [];
        for (let c = 0; c < C; c++) { const o = new Float32Array(n); let p = 0; for (const a of chunks[c]) { o.set(a.subarray(0, Math.min(a.length, n - p)), p); p += a.length; if (p >= n) break; } chs.push(o); }
        // two identical channels are a mono microphone: kept once
        if (C === 2) { let diff = 0; for (let i = 0; i < n; i += 97) diff += Math.abs(chs[0][i] - chs[1][i]); if (diff < 1e-6) chs.pop(); }
        return { chs, sr: ctx.sampleRate, full: n < max };
      }
    };
  }

  return { Q, measure, judgeSound, judgePicture, check, stamp, wav, tap, decode };
})();
