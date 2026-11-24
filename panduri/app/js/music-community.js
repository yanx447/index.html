'use strict';

PD.i18n.add({
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
      stop() {
        if (!started) end(false);
        else if (!ended) { node.port.postMessage('stop'); const timer = setTimeout(() => end(true), 1200); result.then(() => clearTimeout(timer)); }
        return result;
      },
      discard() { end(false); }
    };
  }

  return { types, key, tags, mediums, save, audio, pcm, wavHeader };
})();
