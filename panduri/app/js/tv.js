/* =====================================================================
   TV and remote controls: on a TV (or when "remote control" is on in
   Settings) the arrow keys move focus to the nearest control in that
   direction, OK/Enter presses it, Back closes the top layer.
   ===================================================================== */
PD.i18n.add({ 'set.remote': ['პულტით მართვა (ტელევიზორი)', 'Remote control (TV)'], 'set.remoteD': ['ისრები გადაადგილებს მონიშვნას, OK აჭერს.', 'Arrows move the highlight, OK presses it.'] });
PD.tv = (() => {
  const isTV = /Android TV|AFT[A-Z]|BRAVIA|SmartTV|SMART-TV|Tizen|Web0S|webOS|GoogleTV|CrKey|HbbTV/i.test(navigator.userAgent);
  const on = () => isTV || PD.store.get('remoteNav', false);
  const SEL = 'button:not([disabled]), a[href], input:not([type=hidden]):not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
  function layer() {
    const tops = ['.call', '.lvup', '.sheet-back', '.ag', '.ob', '.pz'];
    for (const s of tops) { const els = document.querySelectorAll(s); if (els.length) return els[els.length - 1]; }
    return document.body;
  }
  function visible(el) { const r = el.getBoundingClientRect(); return r.width > 2 && r.height > 2 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth && getComputedStyle(el).visibility !== 'hidden'; }
  function move(dir) {
    const root = layer(), all = [...root.querySelectorAll(SEL)].filter(visible);
    const cur = document.activeElement && root.contains(document.activeElement) ? document.activeElement : null;
    if (!cur) { const first = all.find(e => e.matches('.btn.primary')) || all[0]; if (first) { first.focus(); first.scrollIntoView({ block: 'nearest' }); } return; }
    const a = cur.getBoundingClientRect(), ax = a.left + a.width / 2, ay = a.top + a.height / 2;
    let best = null, bd = 1e9;
    all.forEach(el => {
      if (el === cur) return;
      const b = el.getBoundingClientRect(), bx = b.left + b.width / 2, by = b.top + b.height / 2, dx = bx - ax, dy = by - ay;
      const ok = dir === 'ArrowRight' ? dx > 4 : dir === 'ArrowLeft' ? dx < -4 : dir === 'ArrowDown' ? dy > 4 : dy < -4;
      if (!ok) return;
      const main = dir === 'ArrowRight' || dir === 'ArrowLeft' ? Math.abs(dx) : Math.abs(dy), side = dir === 'ArrowRight' || dir === 'ArrowLeft' ? Math.abs(dy) : Math.abs(dx);
      const d = main + side * 2.2;
      if (d < bd) { bd = d; best = el; }
    });
    if (best) { best.focus({ preventScroll: true }); best.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' }); }
  }
  function init() {
    if (isTV) document.documentElement.classList.add('tv');
    document.addEventListener('keydown', e => {
      if (!on()) return;
      const k = e.key, tag = (e.target && e.target.tagName) || '';
      if (/^Arrow/.test(k)) {
        if ((tag === 'INPUT' && !/checkbox|range|radio/.test(e.target.type)) || tag === 'TEXTAREA') return;
        if (tag === 'INPUT' && e.target.type === 'range' && (k === 'ArrowLeft' || k === 'ArrowRight')) return;
        e.preventDefault(); e.stopPropagation(); move(k);
      } else if (k === 'Backspace' || k === 'Escape' || k === 'GoBack' || k === 'BrowserBack') {
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        const sb = document.querySelector('.sheet-back'); if (sb) { sb.click(); e.preventDefault(); return; }
        if (PD.practice.active) { PD.practice.close(); e.preventDefault(); return; }
        if (history.length > 1) { history.back(); e.preventDefault(); }
      }
    }, true);
  }
  return { init, get isTV() { return isTV; }, get on() { return on(); } };
})();
