// Turns a cents error into user-facing guidance. Pure functions — covered by tests.
// Pitch LOW  (negative cents) → tighten (მოუჭირე, ↑)
// Pitch HIGH (positive cents) → loosen  (მოუშვი, ↓)

export function accuracyBand(absCents) {
  if (absCents <= 2) return 'excellent';
  if (absCents <= 5) return 'close';
  if (absCents <= 10) return 'adjust';
  return 'out';
}

export function instruction(cents, tolerance) {
  const a = Math.abs(cents);
  if (a <= tolerance) {
    return { dir: 0, key: 'intune', text: 'ზუსტად აწყობილია', short: 'აწყობილია' };
  }
  const tighten = cents < 0;
  const verb = tighten ? 'მოუჭირე' : 'მოუშვი';
  let text;
  let key;
  if (a > 25) { text = verb; key = 'far'; }
  else if (a > 10) { text = 'კიდევ ცოტათი ' + verb; key = 'mid'; }
  else { text = 'ოდნავ ' + verb; key = 'near'; }
  return { dir: tighten ? 1 : -1, key: (tighten ? 'up-' : 'down-') + key, text, short: verb };
}
