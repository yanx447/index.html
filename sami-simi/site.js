// Language switch for the website (ka / en). Remembers the choice; defaults to the device language.
(function () {
  var KEY = 'sami-simi:site-lang';
  var root = document.documentElement;
  function detect() {
    try { var s = localStorage.getItem(KEY); if (s === 'ka' || s === 'en') return s; } catch (e) {}
    var l = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
    return /^ka/i.test(l) ? 'ka' : 'en';
  }
  function set(l) {
    root.dataset.lang = l; root.lang = l;
    var t = document.querySelector('meta[name="title-' + l + '"]');
    if (t) document.title = t.content;
    document.querySelectorAll('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.l === l)); });
    try { localStorage.setItem(KEY, l); } catch (e) {}
  }
  set(new URLSearchParams(location.search).get('lang') || detect());
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.lang button');
    if (b) set(b.dataset.l);
  });
})();
