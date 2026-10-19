// Microphone input. Raw signal: no echo cancellation, noise suppression or AGC —
// those processors smear pitch and pump levels. A gentle band-limit removes rumble and hiss.

let sharedCtx = null;

export function audioContext() {
  if (!sharedCtx) {
    const C = window.AudioContext || window.webkitAudioContext;
    sharedCtx = new C({ latencyHint: 'interactive' });
  }
  return sharedCtx;
}

export async function resumeContext() {
  const c = audioContext();
  if (c.state !== 'running') { try { await c.resume(); } catch (e) { /* needs a gesture */ } }
  return c.state === 'running';
}

export class MicError extends Error {
  constructor(code, detail) { super(code); this.code = code; this.detail = detail; }
}

/** 'ok' | 'insecure' | 'unsupported' */
export function micSupport() {
  if (typeof window === 'undefined') return 'unsupported';
  if (!window.isSecureContext) return 'insecure';
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return 'unsupported';
  if (!(window.AudioContext || window.webkitAudioContext)) return 'unsupported';
  return 'ok';
}

export class AudioInput {
  constructor(windowSize = 4096) {
    this.windowSize = windowSize;
    this.stream = null;
    this.onEnded = null;
  }

  get active() { return !!this.stream; }
  get sampleRate() { return audioContext().sampleRate; }

  async start() {
    const sup = micSupport();
    if (sup !== 'ok') throw new MicError(sup);
    const ctx = audioContext();
    const resumed = resumeContext(); // started synchronously inside the user gesture (iOS)
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false, channelCount: 1 },
        video: false,
      });
    } catch (e) {
      const n = e && e.name;
      const code = n === 'NotAllowedError' || n === 'SecurityError' || n === 'PermissionDeniedError' ? 'denied'
        : n === 'NotFoundError' || n === 'OverconstrainedError' || n === 'DevicesNotFoundError' ? 'notfound'
        : n === 'NotReadableError' || n === 'AbortError' || n === 'TrackStartError' ? 'busy' : 'unknown';
      throw new MicError(code, e && e.message);
    }
    await resumed;
    this.source = ctx.createMediaStreamSource(this.stream);
    this.hp = ctx.createBiquadFilter(); this.hp.type = 'highpass'; this.hp.frequency.value = 50; this.hp.Q.value = 0.707;
    this.lp = ctx.createBiquadFilter(); this.lp.type = 'lowpass'; this.lp.frequency.value = 3000; this.lp.Q.value = 0.707;
    this.analyser = ctx.createAnalyser();
    let size = 2048; while (size < this.windowSize) size <<= 1;
    this.analyser.fftSize = size;
    this.analyser.smoothingTimeConstant = 0;
    this.source.connect(this.hp).connect(this.lp).connect(this.analyser);
    this.buf = new Float32Array(this.analyser.fftSize);
    const track = this.stream.getAudioTracks()[0];
    if (track) track.addEventListener('ended', () => { this.stop(); this.onEnded && this.onEnded(); });
  }

  read() { this.analyser.getFloatTimeDomainData(this.buf); return this.buf; }

  stop() {
    if (this.stream) this.stream.getTracks().forEach((t) => t.stop());
    this.stream = null;
    try { this.source && this.source.disconnect(); this.hp && this.hp.disconnect(); this.lp && this.lp.disconnect(); } catch (e) { /* noop */ }
    this.source = this.hp = this.lp = this.analyser = null;
  }
}
