// Panduri tuning model: presets, transposition, octave, calibration and note naming.
// New tunings are added to PRESETS only — nothing else in the app needs to change.

export const PRESETS = Object.freeze([
  {
    id: 'panduri-standard',
    name: 'ფანდური',
    // MIDI note numbers, string 1 → string 3
    strings: [57, 61, 64], // A3 · C♯4 · E4
  },
]);

const LATIN_SHARP = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const LATIN_FLAT  = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
const KA_SHARP = ['დო', 'დო♯', 'რე', 'რე♯', 'მი', 'ფა', 'ფა♯', 'სოლ', 'სოლ♯', 'ლა', 'ლა♯', 'სი'];
const KA_FLAT  = ['დო', 'რე♭', 'რე', 'მი♭', 'მი', 'ფა', 'სოლ♭', 'სოლ', 'ლა♭', 'ლა', 'სი♭', 'სი'];
// Roots whose major triad is conventionally spelled with flats (D♭, E♭, A♭, B♭)
const FLAT_ROOTS = new Set([1, 3, 8, 10]);

export const pitchClass = (m) => ((m % 12) + 12) % 12;
export const midiToFreq = (m, a4 = 440) => a4 * Math.pow(2, (m - 69) / 12);
export const freqToMidi = (f, a4 = 440) => 69 + 12 * Math.log2(f / a4);

export class TuningModel {
  constructor(opts = {}) { this.set(opts); }

  set({ presetId = PRESETS[0].id, transpose = 0, octave = 0, a4 = 440 } = {}) {
    this.preset = PRESETS.find((p) => p.id === presetId) || PRESETS[0];
    this.transpose = transpose;
    this.octave = octave;
    this.a4 = a4;
    this.flats = FLAT_ROOTS.has(pitchClass(this.preset.strings[0] + transpose));
    this.strings = this.preset.strings.map((base, index) => {
      const midi = base + transpose + 12 * octave;
      return { index, number: index + 1, midi, freq: midiToFreq(midi, a4), ...this.name(midi) };
    });
    return this;
  }

  name(midi) {
    const m = Math.round(midi);
    const p = pitchClass(m);
    return {
      latin: (this.flats ? LATIN_FLAT : LATIN_SHARP)[p],
      ka: (this.flats ? KA_FLAT : KA_SHARP)[p],
      octave: Math.floor(m / 12) - 1,
    };
  }

  freqToMidi(f) { return freqToMidi(f, this.a4); }
  label() { return this.strings.map((s) => s.latin).join(' · '); }
  labelWithOctaves() { return this.strings.map((s) => s.latin + s.octave).join(' · '); }
}
