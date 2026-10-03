/* =====================================================================
   Song data supplied with recordings.
   Bani-Acharuli: chords given by the teacher (Dm · B♭ · C); the rhythm is
   the teacher's Acharuli pattern (↓ · ↓> · ↑>). Tempo, bar grid and
   WHERE each chord sounds were detected from the supplied recording
   (beat tracking + bass/chroma, limited to those three chords) — marked
   'auto' so the teacher can correct any bar in the Studio.
   ===================================================================== */
PD.SONGS = {
  'bani-acharuli': {
    bpm: 100.0063, offset: -0.1241, beatsPerBar: 2, meterLabel: '6/8',
    chartSrc: 'auto',
    stems: { full: 'bani/full.mp3', music: 'bani/music.mp3', vocals: 'bani/vocals.mp3' },
    rhythm: 'acharuli',
    /** panduri shapes: strings A · C♯ · E (1 → 3). Dm = teacher's description (fret 1, middle and lower string barred);
        B♭ and C are the three-note barre shapes that give B♭–D–F and C–E–G — confirm in the Studio. */
    chords: {
      'Dm': { frets: [0, 1, 1], fingers: [0, 1, 1], src: 'teacher' },
      'B♭': { frets: [1, 1, 1], fingers: [1, 1, 1], src: 'derived' },
      'C': { frets: [3, 3, 3], fingers: [1, 1, 1], src: 'derived' }
    },
    bars: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, "Dm", "C", "Dm", "C", "Dm", "C", "Dm", "C", "Dm", "C", "Dm", "C", "Dm", "B♭", "Dm", "C", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "Dm", "Dm", "C", "Dm", "Dm", "Dm", "C", "Dm", "C", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "Dm", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "Dm", "Dm", "B♭", "Dm", "C", "Dm", "Dm", "Dm", "C", "Dm", "C", "Dm", "C", "Dm", "B♭", "Dm", "C", "Dm", "B♭", "B♭", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "Dm", "Dm", "B♭", "Dm", "B♭", "Dm", "C", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "C", "Dm", "Dm", "Dm", "C", "Dm", "Dm", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "Dm", "Dm", "Dm", "Dm", "Dm", "Dm", "C", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "Dm", "B♭", "C", "Dm", "Dm", "C", "Dm", "Dm", "Dm", "Dm", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    sections: [["listen", 0, 14], ["inst", 14, 22], ["verse", 22, 46], ["inst", 46, 62], ["verse", 62, 86], ["inst", 86, 100], ["verse", 100, 134], ["inst", 134, 150], ["listen", 150, 182], ["verse", 182, 198], ["inst", 198, 214], ["listen", 214, 232]]
  }
};
