// Shared helpers for the tool pages.
import { pcLatin, pcKa } from '../music.js';

export function h(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Tiny per-module dictionary helper: tr(L, 'key', {vars}) using the current language. */
export function makeTr(lang) {
  return (L, key, vars) => {
    let s = (L[lang()] && L[lang()][key]) ?? L.en[key] ?? key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : ''));
    return s;
  };
}

/**
 * Vertical chord diagram (strings run top→bottom like the panduri neck held upright).
 * f: { frets:[a,b,c], barre }, labels: open-string names
 */
export function chordDiagram(f, labels = ['A', 'C♯', 'E']) {
  const fr = f.frets;
  const used = fr.filter((x) => x > 0);
  const lo = used.length ? Math.min(...used) : 1;
  const hi = used.length ? Math.max(...used) : 1;
  const base = hi <= 4 ? 1 : lo;
  const rows = Math.max(4, hi - base + 1);
  const W = 120, X0 = 24, DX = 36, Y0 = 34, DY = 30;
  const xs = [0, 1, 2].map((i) => X0 + i * DX);
  let s = `<svg class="chord-svg" viewBox="0 0 ${W} ${Y0 + rows * DY + 14}" role="img" aria-label="${labels.map((l, i) => `${l}: ${fr[i]}`).join(', ')}">`;
  // nut or fret number
  if (base === 1) s += `<rect x="${xs[0] - 4}" y="${Y0 - 5}" width="${xs[2] - xs[0] + 8}" height="5" rx="1.5" class="cd-nut"/>`;
  else s += `<text x="${xs[2] + 14}" y="${Y0 + DY / 2 + 4}" class="cd-base">${base}</text>`;
  for (let r = 0; r <= rows; r++) s += `<line x1="${xs[0]}" y1="${Y0 + r * DY}" x2="${xs[2]}" y2="${Y0 + r * DY}" class="cd-fret"/>`;
  xs.forEach((x) => { s += `<line x1="${x}" y1="${Y0}" x2="${x}" y2="${Y0 + rows * DY}" class="cd-str"/>`; });
  labels.forEach((l, i) => { s += `<text x="${xs[i]}" y="${Y0 + rows * DY + 13}" class="cd-lbl">${esc(l)}</text>`; });
  if (f.barre && fr.every((x) => x >= f.barre) && fr.filter((x) => x === f.barre).length >= 2) {
    const y = Y0 + (f.barre - base + 0.5) * DY;
    s += `<rect x="${xs[0] - 9}" y="${y - 9}" width="${xs[2] - xs[0] + 18}" height="18" rx="9" class="cd-barre"/>`;
  }
  fr.forEach((x, i) => {
    if (x === 0) s += `<circle cx="${xs[i]}" cy="${Y0 - 15}" r="6" class="cd-open"/>`;
    else s += `<circle cx="${xs[i]}" cy="${Y0 + (x - base + 0.5) * DY}" r="10" class="cd-dot"/>`;
  });
  return s + '</svg>';
}

export const noteLabel = (midi, lang) => (lang === 'ka' ? pcKa(midi) : pcLatin(midi)) + (Math.floor(midi / 12) - 1);

/** Rolling median for noisy readings. */
export function median(a) { const s = [...a].sort((x, y) => x - y); return s[s.length >> 1]; }
