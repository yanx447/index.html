// McLeod Pitch Method (NSDF) computed through FFT autocorrelation — O(N log N) per pass,
// all buffers preallocated, no allocation inside analyze().
//
// On top of plain MPM it adds:
//  • octave-down validation: if the NSDF is clearly MORE periodic at 2τ than at τ, the
//    chosen peak was a harmonic and the real fundamental is an octave lower
//  • prior-guided tie-breaking: when two octave-related peaks are equally strong, the one
//    closer to the expected Panduri string wins (prior is supplied by the tracker)
//  • sub-sample parabolic interpolation and a periodicity score used for confidence

export class PitchDetector {
  constructor(sampleRate, { windowSize = 4096, minFreq = 60, maxFreq = 1100 } = {}) {
    this.sr = sampleRate;
    this.W = windowSize;
    this.minLag = Math.max(2, Math.floor(sampleRate / maxFreq));
    this.maxLag = Math.min(Math.ceil(sampleRate / minFreq), (windowSize >> 1) + (windowSize >> 2));

    let n = 1;
    while (n < 2 * windowSize) n <<= 1;
    this.N = n;

    this.x = new Float64Array(windowSize);
    this.re = new Float64Array(n);
    this.im = new Float64Array(n);
    this.nsdf = new Float64Array(this.maxLag + 2);
    this.peakLag = new Int32Array(256);
    this.peakVal = new Float64Array(256);
    this.peakCount = 0;

    // FFT tables
    const bits = Math.log2(n);
    this.rev = new Uint32Array(n);
    for (let i = 0; i < n; i++) {
      let r = 0;
      for (let b = 0; b < bits; b++) r |= ((i >> b) & 1) << (bits - 1 - b);
      this.rev[i] = r;
    }
    this.cos = new Float64Array(n >> 1);
    this.sin = new Float64Array(n >> 1);
    for (let k = 0; k < n >> 1; k++) {
      this.cos[k] = Math.cos((2 * Math.PI * k) / n);
      this.sin[k] = Math.sin((2 * Math.PI * k) / n);
    }

    this.result = { freq: 0, clarity: 0, periodicity: 0, rms: 0, peak: 0, lag: 0, octaveCorrected: false };
  }

  fft(re, im) {
    const n = this.N, rev = this.rev, cs = this.cos, sn = this.sin;
    for (let i = 0; i < n; i++) {
      const j = rev[i];
      if (j > i) {
        let t = re[i]; re[i] = re[j]; re[j] = t;
        t = im[i]; im[i] = im[j]; im[j] = t;
      }
    }
    for (let size = 2; size <= n; size <<= 1) {
      const half = size >> 1, step = n / size;
      for (let i = 0; i < n; i += size) {
        for (let j = 0, k = 0; j < half; j++, k += step) {
          const a = i + j, b = a + half;
          const c = cs[k], s = sn[k];
          const tr = re[b] * c + im[b] * s;
          const ti = im[b] * c - re[b] * s;
          re[b] = re[a] - tr; im[b] = im[a] - ti;
          re[a] += tr; im[a] += ti;
        }
      }
    }
  }

  /** Parabolic peak refinement around integer lag t. Returns [lag, value]. */
  interp(t, out) {
    const d = this.nsdf;
    const a = d[t - 1], b = d[t], c = d[t + 1];
    const den = a - 2 * b + c;
    let shift = den !== 0 ? (0.5 * (a - c)) / den : 0;
    if (shift > 1) shift = 1; else if (shift < -1) shift = -1;
    out[0] = t + shift;
    out[1] = b - 0.25 * (a - c) * shift;
    return out;
  }

  findPeakNear(lag, tol) {
    let best = -1;
    for (let i = 0; i < this.peakCount; i++) {
      const l = this.peakLag[i];
      if (Math.abs(l - lag) <= tol && (best < 0 || this.peakVal[i] > this.peakVal[best])) best = i;
    }
    return best;
  }

  /**
   * @param {Float32Array} input  time-domain samples (last W samples are used)
   * @param {(f:number)=>number} [prior] plausibility 0..1 of a frequency for the current string(s)
   */
  analyze(input, prior) {
    const W = this.W, x = this.x, res = this.result;
    const off = input.length - W;
    let mean = 0;
    for (let i = 0; i < W; i++) { const v = input[off + i]; x[i] = v; mean += v; }
    mean /= W;
    let sum2 = 0, pk = 0;
    for (let i = 0; i < W; i++) {
      const v = x[i] - mean; x[i] = v; sum2 += v * v;
      const av = v < 0 ? -v : v; if (av > pk) pk = av;
    }
    res.rms = Math.sqrt(sum2 / W);
    res.peak = pk;
    res.freq = 0; res.clarity = 0; res.periodicity = 0; res.lag = 0; res.octaveCorrected = false;
    if (res.rms < 1e-6) return res;

    // autocorrelation via |FFT|² → IFFT (zero-padded, so it is linear, not circular)
    const re = this.re, im = this.im, N = this.N;
    for (let i = 0; i < W; i++) re[i] = x[i];
    re.fill(0, W);
    im.fill(0);
    this.fft(re, im);
    for (let i = 0; i < N; i++) { re[i] = re[i] * re[i] + im[i] * im[i]; im[i] = 0; }
    this.fft(re, im); // power spectrum is real & even → forward FFT == N · inverse

    const nsdf = this.nsdf, maxLag = this.maxLag;
    let m = 2 * sum2;
    for (let t = 0; t <= maxLag + 1; t++) {
      nsdf[t] = m > 1e-12 ? (2 * (re[t] / N)) / m : 0;
      const a = x[t], b = x[W - 1 - t];
      m -= a * a + b * b;
    }

    // key maxima between positive-going and negative-going zero crossings
    let t = 1;
    while (t < maxLag && nsdf[t] > 0) t++;           // skip the zero-lag lobe
    if (t < this.minLag) t = this.minLag;
    let count = 0, pos = false, bestV = -1, bestT = 0;
    for (; t < maxLag; t++) {
      const v = nsdf[t];
      if (!pos && v > 0 && nsdf[t - 1] <= 0) { pos = true; bestV = -1; }
      if (pos) {
        if (v > bestV) { bestV = v; bestT = t; }
        if (v <= 0) {
          pos = false;
          if (count < 256) { this.peakLag[count] = bestT; this.peakVal[count] = bestV; count++; }
        }
      }
    }
    if (pos && bestV > 0 && bestT < maxLag - 1 && count < 256) { this.peakLag[count] = bestT; this.peakVal[count] = bestV; count++; }
    this.peakCount = count;
    if (!count) return res;

    let maxV = 0;
    for (let i = 0; i < count; i++) if (this.peakVal[i] > maxV) maxV = this.peakVal[i];
    res.clarity = maxV;
    if (maxV < 0.45) return res;

    // 1) MPM: first key maximum above k · max
    let sel = 0;
    for (let i = 0; i < count; i++) { if (this.peakVal[i] >= 0.88 * maxV) { sel = i; break; } }

    // 2) octave-down validation — signal clearly more periodic at twice the period?
    for (let pass = 0; pass < 2; pass++) {
      const lag = this.peakLag[sel];
      const j = this.findPeakNear(2 * lag, Math.max(2, lag * 0.05));
      if (j >= 0 && this.peakVal[j] >= this.peakVal[sel] + 0.035) { sel = j; res.octaveCorrected = true; }
      else break;
    }

    // 3) prior-guided tie-break between equally strong octave-related peaks
    if (prior) {
      const lag = this.peakLag[sel];
      const fSel = this.sr / lag;
      const pSel = prior(fSel);
      if (pSel < 0.3) {
        // a longer lag only wins if it is at least as periodic (a real octave-high string must
        // stay an octave high); a shorter lag may win if it is nearly as periodic
        const jDown = this.findPeakNear(2 * lag, Math.max(2, lag * 0.05));
        const jUp = this.findPeakNear(lag / 2, Math.max(2, lag * 0.03));
        if (jDown >= 0 && jDown !== sel && this.peakVal[jDown] > this.peakVal[sel] + 0.004 &&
            prior(this.sr / this.peakLag[jDown]) > pSel + 0.4) {
          sel = jDown; res.octaveCorrected = true;
        } else if (jUp >= 0 && jUp !== sel && this.peakVal[jUp] >= 0.9 * maxV && this.peakVal[jUp] >= this.peakVal[sel] - 0.02 &&
            prior(this.sr / this.peakLag[jUp]) > pSel + 0.4) {
          sel = jUp; res.octaveCorrected = true;
        }
      }
    }

    const out = this._tmp || (this._tmp = new Float64Array(2));
    this.interp(this.peakLag[sel], out);
    const lag = out[0], val = out[1];
    res.lag = lag;
    res.freq = this.sr / lag;
    res.clarity = Math.min(1, val);

    // periodicity: the true period should repeat — check the NSDF at 2τ as well
    const l2 = Math.round(2 * lag);
    if (l2 + 1 <= maxLag) {
      let v2 = nsdf[l2];
      if (nsdf[l2 - 1] > v2) v2 = nsdf[l2 - 1];
      if (nsdf[l2 + 1] > v2) v2 = nsdf[l2 + 1];
      res.periodicity = Math.max(0, Math.min(1, 0.5 * (res.clarity + v2)));
    } else {
      res.periodicity = res.clarity;
    }
    return res;
  }
}
