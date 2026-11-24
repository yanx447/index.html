'use strict';

PD.i18n.add({
  'mc.pauseTake': ['ჩაწერის პაუზა', 'Pause recording'], 'mc.resumeTake': ['ჩაწერის გაგრძელება', 'Resume recording'],
  'mc.reviewTake': ['რედაქტირება', 'Edit recording'], 'mc.paused': ['პაუზაზეა', 'Paused'],
  'mc.losslessOnly': ['აუდიოსთვის აირჩიე PCM WAV ან FLAC ფაილი.', 'Choose a PCM WAV or FLAC file for audio.'],
  'mc.minVideo': ['ვიდეოს მოკლე მხარე მინიმუმ 720 პიქსელი უნდა იყოს.', 'The shorter side of the video must be at least 720 pixels.'],
  'mc.cropQuality': ['ამ პროპორციით 720p აღარ რჩება. აირჩიე სხვა პროპორცია ან უფრო მაღალი გარჩევადობის ვიდეო.', 'This crop leaves less than 720p. Choose another aspect ratio or a higher-resolution source.'],
  'mc.sizeEdit': ['ფაილი უნდა ჩაეტიოს {n} MB-ში. შეამოკლე მონაკვეთი ან შეინახე ორიგინალი.', 'Your file must fit within {n} MB. Trim the clip or save the original.'],
  'mc.recordSong': ['აუდიოს ჩაწერა', 'Record audio'], 'mc.import': ['ვიდეო ან სიმღერა', 'Video or song'],
  'mc.camera': ['ვიდეოს გადაღება', 'Record video'], 'mc.song': ['სიმღერა', 'Song'],
  'mc.next': ['შემდეგი', 'Next'], 'mc.saveWav': ['WAV · 24 ბიტი', 'WAV · 24 bit'],
  'mc.recordError': ['ჩანაწერი ვერ შეიქმნა. შეამოწმე მიკროფონი და სცადე ისევ.', 'Recording failed. Check the microphone and try again.'],
  'mc.fit': ['სერვერზე ერთ ფაილს {n} MB აქვს. ორიგინალი შეგიძლია შეინახო და გამოსაქვეყნებლად ვიდეოს ზომა შეამცირო.', 'The upload limit is {n} MB per file. You can save the original and make a smaller publishing copy.'],
  'mc.original': ['ორიგინალის შენახვა', 'Save original'],
  'mc.storage': ['ატვირთვის ლიმიტი · {n} MB', 'Upload limit · {n} MB'],
  'mc.ready': ['გამოქვეყნება შეგიძლია', 'Ready to publish'],
  'mc.checking': ['სიმა ამოწმებს ჩანაწერს…', 'Sima is analysing the recording…'],
  'mc.quality': ['სიმას შენიშვნები ხარისხზე', 'Sima’s quality notes'],
  'mc.heard': ['შესაძლოა ისმოდეს {name}', 'May contain {name}'],
  'mc.unknown': ['მიუთითე ინსტრუმენტი ან ვოკალი', 'Choose the instrument or vocals'],
  'mc.instrument': ['ინსტრუმენტი / ვოკალი', 'Instrument / vocals'],
  'mc.genre': ['ჟანრი', 'Genre'], 'mc.region': ['კუთხე', 'Region'],
  'mc.type': ['ფორმა', 'Format'], 'mc.browse': ['პოსტების ნახვა', 'Browse posts'], 'mc.discover': ['აღმოაჩინე მუსიკა', 'Discover music'],
  'mc.posts': ['მუსიკალური პოსტები', 'Music posts'], 'mc.new': ['ახალი პოსტი', 'New post'],
  'mc.empty': ['ჯერ მუსიკა არ გამოუქვეყნებიათ.', 'No music has been posted yet.'],
  'mc.optional': ['არჩევითი', 'Optional'], 'mc.recommended': ['რეკომენდებული', 'For You'],
  'mc.mention': ['მონიშნე გამომწერი ან გამოწერილი', 'Mention a follower or someone you follow'],
  'mc.noMention': ['ასეთი კავშირი ვერ მოიძებნა.', 'No matching connections.'],
  'fd.captionLong': ['აღწერა და ჰაშთეგები ერთად მაქსიმუმ 2 200 სიმბოლოა.', 'Caption and hashtags can have up to 2,200 characters in total.'],
  'mc.hashtag': ['ჰაშთეგები', 'Hashtags'], 'mc.hashtagPh': ['მაგ. #ფოლკი #LiveMusic', 'e.g. #Folk #LiveMusic'],
  'mc.backend': ['გამოქვეყნებას სერვერის განახლება სჭირდება.', 'Publishing requires a server update.'],
  'mc.waveSource': ['ორიგინალი მიკროფონის ჩანაწერი', 'Original microphone recording']
});

PD.musicCommunity = (() => {
  const genres = {
    rock: ['როკი', 'Rock'], pop: ['პოპი', 'Pop'], jazz: ['ჯაზი', 'Jazz'], folk: ['ფოლკი', 'Folk'],
    'georgian-folk': ['ქართული ფოლკლორი', 'Georgian folk'], classical: ['კლასიკა', 'Classical'],
    electronic: ['ელექტრონული', 'Electronic'], 'hip-hop': ['ჰიპ-ჰოპი', 'Hip-hop'], blues: ['ბლუზი', 'Blues'],
    soul: ['სოული / R&B', 'Soul / R&B'], world: ['მსოფლიო მუსიკა', 'World music'], other: ['სხვა', 'Other']
  };
  const regions = {
    kazbegi: ['ყაზბეგური', 'Kazbegi'], adjara: ['აჭარული', 'Adjara'], kakheti: ['კახური', 'Kakheti'],
    mtiuleti: ['მთიულური', 'Mtiuleti'], khevsureti: ['ხევსურული', 'Khevsureti'], tusheti: ['თუშური', 'Tusheti'],
    pshavi: ['ფშაური', 'Pshavi'], kartli: ['ქართლური', 'Kartli'], guria: ['გურული', 'Guria'],
    samegrelo: ['მეგრული', 'Samegrelo'], svaneti: ['სვანური', 'Svaneti'], imereti: ['იმერული', 'Imereti'],
    racha: ['რაჭული', 'Racha'], lechkhumi: ['ლეჩხუმური', 'Lechkhumi'], meskheti: ['მესხური', 'Meskheti'],
    javakheti: ['ჯავახური', 'Javakheti'], abkhazeti: ['აფხაზური', 'Abkhazeti'], lazeti: ['ლაზური', 'Lazeti'],
    other: ['სხვა კუთხე', 'Other region']
  };
  const forms = {
    song: ['სიმღერა', 'Song'], melody: ['მელოდია', 'Melody'], instrumental: ['ინსტრუმენტული', 'Instrumental'],
    rhythm: ['რიტმი', 'Rhythm'], improvisation: ['იმპროვიზაცია', 'Improvisation'], cover: ['ქავერი', 'Cover']
  };
  const instruments = {
    vocals: ['ვოკალი', 'Vocals'], panduri: ['ფანდური', 'Fanduri'], chonguri: ['ჩონგური', 'Chonguri'],
    doli: ['დოლი', 'Doli'], garmoni: ['გარმონი', 'Garmoni'], salamuri: ['სალამური', 'Salamuri'],
    duduki: ['დუდუკი', 'Duduki'], guitar: ['გიტარა', 'Guitar'], bass: ['ბას გიტარა', 'Bass guitar'],
    piano: ['ფორტეპიანო / კლავიში', 'Piano / keys'], drums: ['დრამი / პერკუსია', 'Drums / percussion'],
    violin: ['ვიოლინო', 'Violin'], cello: ['ჩელო', 'Cello'], winds: ['ჩასაბერი', 'Wind instrument'],
    brass: ['სპილენძის ჩასაბერი', 'Brass'], accordion: ['აკორდეონი', 'Accordion'],
    mandolin: ['მანდოლინა', 'Mandolin'], banjo: ['ბანჯო', 'Banjo'], harp: ['არფა', 'Harp'],
    strings: ['სიმებიანი', 'String instrument'], ensemble: ['ანსამბლი / ბენდი', 'Ensemble / band'],
    other: ['სხვა ინსტრუმენტი', 'Other instrument']
  };
  const types = { genre: genres, region: regions, form: forms, instrument: instruments };
  for (const [group, values] of Object.entries(types)) {
    PD.i18n.add(Object.fromEntries(Object.entries(values).map(([id, pair]) => ['mc.' + group + '.' + id, pair])));
  }
  const key = (group, id) => types[group] && Object.hasOwn(types[group], id) ? 'mc.' + group + '.' + id : null;
  const tags = input => [...new Set((input.match(/[\p{L}\p{N}_]{1,50}/gu) || []).map(tag => tag.toLowerCase()))];
  const mediums = row => row.kind === 'video' || row.kind === 'audio';

  function save(blob, name) {
    const url = URL.createObjectURL(blob), a = PD.h('a', { href: url, download: name });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  const audio = { echoCancellation: false, noiseSuppression: false, autoGainControl: false,
    channelCount: { ideal: 2 }, sampleRate: { ideal: 48000 } };

  function wavHeader(bytes, count, rate) {
    const header = new ArrayBuffer(44), d = new DataView(header);
    function write(at, s) { for (let i = 0; i < s.length; i++) d.setUint8(at + i, s.charCodeAt(i)); }
    write(0, 'RIFF'); d.setUint32(4, bytes + 36 + bytes % 2, true); write(8, 'WAVEfmt ');
    d.setUint32(16, 16, true); d.setUint16(20, 1, true); d.setUint16(22, count, true);
    d.setUint32(24, rate, true); d.setUint32(28, rate * count * 3, true);
    d.setUint16(32, count * 3, true); d.setUint16(34, 24, true);
    write(36, 'data'); d.setUint32(40, bytes, true);
    return header;
  }

  // Store packed PCM incrementally. A ten-minute take never needs a second full Float32 copy.
  const processor = `registerProcessor('pd-community-pcm', class extends AudioWorkletProcessor {
    constructor() {
      super(); this.active = false; this.size = 0; this.buffer = null;
      this.port.onmessage = ({data}) => {
        if (data === 'start') this.active = true;
        else if (data === 'pause') this.active = false;
        else { this.active = false; this.flush(); this.port.postMessage({ done: true }); }
      };
    }
    flush() {
      if (!this.size) return;
      const bytes = this.buffer.slice(0, this.size);
      this.port.postMessage({ bytes, channels: this.channels }, [bytes.buffer]); this.size = 0;
    }
    process(inputs) {
      const input = inputs[0];
      if (!this.active || !input?.length) return true;
      if (!this.buffer) { this.channels = Math.min(input.length, 2); this.buffer = new Uint8Array(24576); }
      for (let i = 0; i < input[0].length; i++) {
        if (this.size + this.channels * 3 > this.buffer.length) this.flush();
        for (let channel = 0; channel < this.channels; channel++) {
          const n = Math.round(Math.min(1, Math.max(-1, (input[channel] || input[0])[i])) * 8388607);
          this.buffer[this.size++] = n; this.buffer[this.size++] = n >> 8; this.buffer[this.size++] = n >> 16;
        }
      }
      return true;
    }
  });`;
  const registered = new WeakMap();
  async function pcm(ctx, track, seconds) {
    if (!ctx?.audioWorklet || !track || !window.AudioWorkletNode) return null;
    if (!registered.has(ctx)) {
      const url = URL.createObjectURL(new Blob([processor], { type: 'application/javascript' }));
      registered.set(ctx, ctx.audioWorklet.addModule(url).finally(() => URL.revokeObjectURL(url)));
    }
    await registered.get(ctx);
    const source = ctx.createMediaStreamSource(new MediaStream([track]));
    const node = new AudioWorkletNode(ctx, 'pd-community-pcm', { numberOfOutputs: 0, channelCountMode: 'max' });
    const parts = [];
    let size = 0, channels = 0, finish, started = false, ended = false;
    const result = new Promise(resolve => { finish = resolve; });
    function end(keep) {
      if (ended) return;
      ended = true; source.disconnect(); node.disconnect(); node.port.close();
      const tail = size % 2 ? [new Uint8Array(1)] : [];
      finish(keep && channels && size ? { blob: new Blob([wavHeader(size, channels, ctx.sampleRate), ...parts, ...tail], { type: 'audio/wav' }),
        sr: ctx.sampleRate, channels, dur: size / (channels * 3 * ctx.sampleRate) } : null);
      parts.length = 0;
    }
    node.port.onmessage = ({ data }) => {
      if (data.done) { end(true); return; }
      channels = data.channels;
      const left = Math.ceil(seconds * ctx.sampleRate) * channels * 3 - size;
      if (left <= 0) return;
      const part = data.bytes.subarray(0, left);
      parts.push(part); size += part.length;
    };
    source.connect(node);
    return {
      start() { if (!started && !ended) { started = true; node.port.postMessage('start'); } },
      pause() { if (started && !ended) node.port.postMessage('pause'); },
      resume() { if (started && !ended) node.port.postMessage('start'); },
      stop() {
        if (!started) end(false);
        else if (!ended) { node.port.postMessage('stop'); const timer = setTimeout(() => end(true), 1200); result.then(() => clearTimeout(timer)); }
        return result;
      },
      discard() { end(false); }
    };
  }

  const MIN_VIDEO = 720;
  const isHD = (w, h) => Number.isInteger(w) && Number.isInteger(h) && Math.min(w, h) >= MIN_VIDEO;

  function captureClock(now = () => performance.now()) {
    let elapsed = 0, since = null;
    const seconds = () => (elapsed + (since == null ? 0 : Math.max(0, now() - since))) / 1000;
    return {
      seconds,
      start() { elapsed = 0; since = now(); },
      pause() { elapsed = seconds() * 1000; since = null; return elapsed / 1000; },
      resume() { if (since == null) since = now(); }
    };
  }

  /** Read metadata from the audio container. A filename or a MIME label can be misleading. */
  async function losslessInfo(file) {
    const header = new DataView(await file.slice(0, 42).arrayBuffer());
    const ascii = (at, n) => Array.from({ length: n }, (_, i) => String.fromCharCode(header.getUint8(at + i))).join('');
    if (header.byteLength < 12) return null;
    if (ascii(0, 4) === 'fLaC' && header.byteLength >= 42 && (header.getUint8(4) & 127) === 0 && header.getUint8(5) === 0 && header.getUint16(6) === 34) {
      const rate = header.getUint32(18) >>> 12;
      const channels = ((header.getUint8(20) >> 1) & 7) + 1;
      const bits = (((header.getUint8(20) & 1) << 4) | (header.getUint8(21) >> 4)) + 1;
      const frames = (header.getUint8(21) & 15) * 2 ** 32 + header.getUint32(22);
      return rate > 0 && file.size > 42 ? { codec: 'flac', rate, channels, bits, seconds: frames / rate } : null;
    }
    if (ascii(0, 4) !== 'RIFF' || ascii(8, 4) !== 'WAVE') return null;
    const end = Math.min(file.size, header.getUint32(4, true) + 8);
    let fmt = null, bytes = 0;
    // Metadata chunks can precede or follow PCM data. Skip them through Blob slices.
    for (let at = 12, count = 0; at + 8 <= end && count < 256; count++) {
      const part = new DataView(await file.slice(at, Math.min(end, at + 48)).arrayBuffer());
      const tag = part.getUint32(0), size = part.getUint32(4, true);
      if (size > end - at - 8) return null;
      if (tag === 0x666d7420 && size >= 16) {
        let code = part.getUint16(8, true);
        if (code === 65534 && size >= 40) {
          const id = Array.from({ length: 16 }, (_, i) => part.getUint8(32 + i));
          const suffix = [0, 0, 0, 0, 0, 16, 0, 128, 0, 0, 170, 0, 56, 155, 113];
          code = suffix.every((x, i) => id[i + 1] === x) ? id[0] : -1;
        }
        const channels = part.getUint16(10, true), rate = part.getUint32(12, true);
        const align = part.getUint16(20, true), bits = part.getUint16(22, true);
        const supported = code === 1 ? [16, 24, 32].includes(bits) : code === 3 && [32, 64].includes(bits);
        if (!supported || !rate || !channels || align !== channels * bits / 8) return null;
        fmt = { codec: 'wav', rate, channels, bits, align };
      } else if (tag === 0x64617461) bytes = size;
      if (fmt && bytes) return bytes % fmt.align ? null : { ...fmt, seconds: bytes / fmt.align / fmt.rate };
      at += 8 + size + (size % 2);
    }
    return null;
  }

  async function encodeWav(buffer, skip, cancelling, progress) {
    const channels = buffer.numberOfChannels, frames = buffer.length - skip, size = frames * channels * 3;
    const parts = [wavHeader(size, channels, buffer.sampleRate)], samples = Array.from({ length: channels }, (_, i) => buffer.getChannelData(i));
    for (let a = skip; a < buffer.length; a += 32768) {
      if (cancelling()) throw Object.assign(new Error('cancel'), { code: 'cancel' });
      const b = Math.min(a + 32768, buffer.length), part = new Uint8Array((b - a) * channels * 3);
      let offset = 0;
      for (let i = a; i < b; i++) {
        for (const channel of samples) {
          const x = Math.max(-1, Math.min(1, channel[i]));
          const n = Math.round(x * (x < 0 ? 8388608 : 8388607));
          part[offset++] = n; part[offset++] = n >> 8; part[offset++] = n >> 16;
        }
      }
      parts.push(part);
      progress((b - skip) / frames);
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    if (size % 2) parts.push(new Uint8Array(1));
    return new File(parts, 'fanduri-master.wav', { type: 'audio/wav' });
  }

  return { types, key, tags, mediums, save, audio, pcm, wavHeader, captureClock, losslessInfo, encodeWav, isHD };
})();
