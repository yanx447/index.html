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
 * Horizontal chord diagram — the neck lies the way you hold the panduri: head (nut) on the
 * left, frets running to the right, and the strings top → bottom: string 3 (E) on top,
 * string 1 (A) at the bottom (the app's front view turned head-left, like a tab).
 * f: { frets:[a,b,c], barre }, labels: open-string names (string 1 → 3)
 */
export function chordDiagram(f, labels = ['A', 'C♯', 'E']) {
  const fr = f.frets;
  const used = fr.filter((x) => x > 0);
  const lo = used.length ? Math.min(...used) : 1;
  const hi = used.length ? Math.max(...used) : 1;
  const base = hi <= 4 ? 1 : lo;
  const cols = Math.max(4, hi - base + 1);
  const hasLbl = labels.some((l) => l);
  const LX = hasLbl ? 30 : 6, OX = LX + 12, X0 = OX + 12, DX = 34, Y0 = 14, DY = 26;
  const W = X0 + cols * DX + 8, H = Y0 + 2 * DY + 24;
  const ys = [0, 1, 2].map((i) => Y0 + (2 - i) * DY);            // string i → its row
  const fx = (n) => X0 + (n - base + 0.5) * DX;                     // centre of fret n's cell
  let s = `<svg class="chord-svg h" viewBox="0 0 ${W} ${H}" role="img" aria-label="${labels.map((l, i) => `${l || i + 1}: ${fr[i]}`).join(', ')}">`;
  // nut (open position) or a plain first fret line
  if (base === 1) s += `<rect x="${X0 - 5}" y="${Y0 - 6}" width="5" height="${2 * DY + 12}" rx="1.5" class="cd-nut"/>`;
  for (let c = 0; c <= cols; c++) s += `<line x1="${X0 + c * DX}" y1="${Y0 - 4}" x2="${X0 + c * DX}" y2="${Y0 + 2 * DY + 4}" class="cd-fret"/>`;
  ys.forEach((y) => { s += `<line x1="${X0}" y1="${y}" x2="${X0 + cols * DX}" y2="${y}" class="cd-str"/>`; });
  // fret numbers under the columns
  for (let c = 0; c < cols; c++) s += `<text x="${X0 + (c + 0.5) * DX}" y="${Y0 + 2 * DY + 19}" class="cd-num${c === 0 && base > 1 ? ' first' : ''}">${base + c}</text>`;
  if (hasLbl) labels.forEach((l, i) => { s += `<text x="${LX - 4}" y="${ys[i] + 4}" class="cd-lbl">${esc(l)}</text>`; });
  if (f.barre && fr.every((x) => x >= f.barre) && fr.filter((x) => x === f.barre).length >= 2) {
    const rows = [0, 1, 2].filter((i) => fr[i] === f.barre).map((i) => ys[i]);
    const top = Math.min(...rows), bot = Math.max(...rows);
    s += `<rect x="${fx(f.barre) - 9}" y="${top - 10}" width="18" height="${bot - top + 20}" rx="9" class="cd-barre"/>`;
  }
  fr.forEach((x, i) => {
    if (x === 0) s += `<circle cx="${OX}" cy="${ys[i]}" r="6" class="cd-open"/>`;
    else s += `<circle cx="${fx(x)}" cy="${ys[i]}" r="10" class="cd-dot"/>`;
  });
  return s + '</svg>';
}

export const noteLabel = (midi, lang) => (lang === 'ka' ? pcKa(midi) : pcLatin(midi)) + (Math.floor(midi / 12) - 1);

/** Rolling median for noisy readings. */
export function median(a) { const s = [...a].sort((x, y) => x - y); return s[s.length >> 1]; }
