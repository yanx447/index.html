/* One tuner: Sami Simi. Keep its document warm and reuse it across routes. */
PD.i18n.add({ 'ss.title': ['სამი სიმი', 'Sami Simi'], 'ss.sub': ['ფანდურის ტიუნერი', 'Panduri tuner'], 'ss.back': ['ფანდური', 'Panduri'] });
PD.samiSimi = (() => {
  let frame;
  function prepare() {
    if (frame) return frame;
    frame = PD.h('iframe', { class: 'ss-integrated', title: PD.i18n.t('ss.title'), src: 'tuner/index.html?embedded=1', allow: 'microphone; autoplay; fullscreen; clipboard-write', hidden: true });
    document.getElementById('main').appendChild(frame);
    return frame;
  }
  function show() {
    if (PD.detector.active) PD.detector.stop();
    prepare().hidden = false;
    try { frame.contentWindow.__panduri?.activate(); } catch (_) {}
  }
  function hide() {
    if (!frame) return;
    // Same-origin call is synchronous: microphone is released before the next tool starts.
    try { frame.contentWindow.__panduri?.suspend(); } catch (_) {}
    frame.hidden = true;
  }
  PD.bus.on('route', r => { if (r !== 'tuner') hide(); });
  PD.bus.on('lang', () => { if (frame) { hide(); frame.remove(); frame = null; if (PD.app.route === 'tuner') show(); } });
  return { prepare, show, open() { PD.app.go('tuner'); }, close() { hide(); if (PD.app.route === 'tuner') PD.app.go('home'); }, get available() { return true; }, get isOpen() { return !!frame && !frame.hidden; } };
})();
