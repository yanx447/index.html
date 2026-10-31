/* =====================================================================
   Smart practice: reads the learner's own history (per-bar second
   attempts, misses, timing spread, tempo reductions) and proposes ONE
   focused loop with a progressive tempo ladder. No points, no games.
   ===================================================================== */
PD.i18n.add({
  'co.second': ['ამ ოთხ ტაქტში ყველაზე ხშირად გჭირდება მეორე ცდა.', 'These four bars most often need a second try.'],
  'co.miss': ['ამ ოთხ ტაქტში ყველაზე ხშირად გამოგრჩება ნოტები.', 'These four bars are where notes get missed most.'],
  'co.timing': ['ამ ოთხ ტაქტში დრო ყველაზე არასტაბილურია.', 'Timing is least steady in these four bars.'],
  'co.tempo': ['ამ ადგილას ყველაზე ხშირად ანელებ ტემპს.', 'This is where you most often lower the tempo.'],
  'co.go': ['მხოლოდ ეს მონაკვეთი ვივარჯიშოთ', 'Practise just this section'],
  'co.ladder': ['ტემპის კიბე: {a} → {b} BPM, ნაბიჯი {s}. ტემპი მატულობს მხოლოდ ორი სუფთა წრის (≥{t}%) შემდეგ.', 'Tempo ladder: {a} → {b} BPM in steps of {s}. Tempo rises only after two clean passes (≥{t}%).'],
  'co.where': ['{l} · ტაქტები {a}–{b}', '{l} · bars {a}–{b}'], 'co.today': ['დღევანდელი ვარჯიში', "Today's practice"]
});

PD.coach = (() => {
  const LS = PD.lessons;
  const std = a => { if (a.length < 3) return 0; const m = a.reduce((x, y) => x + y, 0) / a.length; return Math.sqrt(a.reduce((x, y) => x + (y - m) * (y - m), 0) / a.length); };
  /** the weakest window of up to 4 bars in a lesson, from accumulated history; null when there is not enough data */
  function analyze(l) {
    const p = LS.progress.lesson(l.id), bars = p.bars; if (!bars) return null;
    const keys = Object.keys(bars).map(Number).sort((a, b) => a - b); if (!keys.length) return null;
    const total = keys.reduce((a, k) => a + bars[k].n, 0); if (total < 6) return null;
    const nb = Math.max(...keys) + 1, W = Math.min(4, nb); let best = null;
    for (let a = 0; a + W <= nb; a++) {
      let n = 0, second = 0, miss = 0, down = 0, offs = [];
      for (let k = a; k < a + W; k++) { const o = bars[k]; if (!o) continue; n += o.n; second += o.second; miss += o.miss; down += o.down || 0; offs = offs.concat(o.offs || []); }
      if (n < 3) continue;
      const parts = { second: second / n, miss: miss / n * 1.3, timing: Math.min(1, std(offs) / .12) * .8, tempo: Math.min(1, down / 2) * .9 };
      const score = parts.second + parts.miss + parts.timing + parts.tempo;
      if (!best || score > best.score) best = { a, b: a + W, score, parts };
    }
    if (!best || best.score < .25) return null;
    const reason = Object.keys(best.parts).sort((x, y) => best.parts[y] - best.parts[x])[0];
    const bb = LS.bpb(l), from = Math.max(40, Math.round(l.bpm * .6 / 2) * 2), to = l.bpm;
    return { lesson: l, from: best.a * bb, to: Math.min(best.b * bb, LS.end(l)), barA: best.a + 1, barB: best.b, reason, key: 'co.' + reason, score: best.score,
      ladder: { from: Math.min(from, to), to, step: Math.max(2, Math.round((to - from) / 4)) || 6, thr: 90, low: 70 } };
  }
  /** the single most useful focused practice across recently played lessons */
  function today() {
    const recent = LS.all.filter(l => l.events.length && LS.progress.lesson(l.id).last > Date.now() - 21 * 864e5);
    const found = recent.map(analyze).filter(Boolean).sort((a, b) => b.score - a.score);
    return found[0] || null;
  }
  function start(sug) { if (!PD.premium.allows('coach')) return PD.premium.paywall('coach'); PD.practice.open(sug.lesson, { mode: 'practice', wait: false, drill: { a: sug.from, b: sug.to, ladder: sug.ladder } }, sug.lesson.id, 'phrase'); }
  return { analyze, today, start };
})();
