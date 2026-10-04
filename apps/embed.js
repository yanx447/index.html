/* Studio Plus+ apps — embed for studioplus.ge (or any page).
 *
 *   <div id="studioplus-apps"></div>
 *   <script src="https://yanx447.github.io/index.html/apps/embed.js" defer></script>
 *
 * Optional: data-lang="en" on the div (default: the page's <html lang>, Georgian otherwise).
 * The block grows to its content height, so there is no inner scrollbar.
 */
(function () {
  var me = document.currentScript && document.currentScript.src;
  var BASE = me ? new URL('./', me).href : 'https://yanx447.github.io/index.html/apps/';
  function mount(host) {
    if (host.dataset.mounted) return; host.dataset.mounted = '1';
    var lang = host.dataset.lang || (document.documentElement.lang || 'ka').slice(0, 2);
    if (lang !== 'en') lang = 'ka';
    var f = document.createElement('iframe');
    f.src = BASE + '?embed&lang=' + lang;
    f.title = lang === 'en' ? 'Studio Plus+ apps' : 'სტუდიო+ — აპლიკაციები';
    f.loading = 'lazy';
    f.setAttribute('allow', 'clipboard-write');
    f.style.cssText = 'display:block;width:100%;border:0;background:transparent;height:1400px;overflow:hidden;color-scheme:dark';
    f.setAttribute('scrolling', 'no');
    host.appendChild(f);
    window.addEventListener('message', function (e) {
      if (e.source !== f.contentWindow || !e.data || e.data.type !== 'studioplus-apps:height') return;
      f.style.height = Math.max(300, e.data.height | 0) + 'px';
    });
  }
  function run() { var els = document.querySelectorAll('#studioplus-apps, [data-studioplus-apps]'); for (var i = 0; i < els.length; i++) mount(els[i]); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
