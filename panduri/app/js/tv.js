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
  /** focusable and drawn — also when scrolled out of view (the page scrolls to it) */
  function shown(el) { if (el.closest('[inert],[hidden]')) return false; const r = el.getBoundingClientRect(); return r.width > 2 && r.height > 2 && getComputedStyle(el).visibility !== 'hidden'; }
  function move(dir) {
    const root = layer(), all = [...root.querySelectorAll(SEL)].filter(shown);
    const cur = document.activeElement && root.contains(document.activeElement) ? document.activeElement : null;
    if (!cur) { const vis = all.filter(visible), first = vis.find(e => e.matches('.btn.primary')) || vis[0] || all[0]; if (first) { first.focus(); first.scrollIntoView({ block: 'nearest' }); } return; }
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
    else if (dir === 'ArrowDown' || dir === 'ArrowUp') { const sc = root === document.body ? document.scrollingElement : root.querySelector('.sheet') || root; sc && sc.scrollBy({ top: (dir === 'ArrowDown' ? 1 : -1) * innerHeight * .5, behavior: 'smooth' }); }   // nothing more that way: show the rest of the page
  }
  function init() {
    if (isTV) document.documentElement.classList.add('tv');
    document.addEventListener('keydown', e => {
      if (!on()) return;
      const k = e.key, tag = (e.target && e.target.tagName) || '';
      if (/^Arrow/.test(k)) {
        if ((tag === 'INPUT' && !/checkbox|range|radio/.test(e.target.type)) || tag === 'TEXTAREA') return;
        // the lesson screen and the studio have their own arrow keys (bars, tempo, moving notes) when no control is focused
        const a = document.activeElement, idle = !a || a === document.body || !a.matches(SEL);
        if (idle && !document.querySelector('.sheet-back') && (PD.practice.active || document.querySelector('.studio'))) return;
        if (tag === 'INPUT' && e.target.type === 'range' && (k === 'ArrowLeft' || k === 'ArrowRight')) return;
        e.preventDefault(); e.stopPropagation(); move(k);
      } else if (k === 'Backspace' || k === 'Escape' || k === 'GoBack' || k === 'BrowserBack') {
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (k === 'Escape' && (document.querySelector('.sheet-back') || PD.practice.active)) return;   // sheets and the lesson screen close themselves on Esc
        if ((k === 'Escape' || k === 'Backspace') && document.querySelector('.studio') && !document.querySelector('.sheet-back')) return;   // the studio: Esc clears the selection, Backspace deletes notes
        if (PD.layers.back()) e.preventDefault();   // the top layer first (via the same Back as the browser's)
      }
    }, true);
  }
  return { init, get isTV() { return isTV; }, get on() { return on(); } };
})();
