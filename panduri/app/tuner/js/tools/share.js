// Share the app: native share sheet, copy link, and a QR code to show at rehearsals.
import { h, esc } from './ui.js';
import qrcode from '../../vendor/qrcode.js';

const L = {
  ka: { title: 'გაზიარება', text: 'გაუზიარე „სამი სიმი“ მეგობრებს, ანსამბლს ან მოსწავლეებს. QR კოდი დაასკანერონ ტელეფონის კამერით.', share: 'გაზიარება', copy: 'ბმულის კოპირება', copied: 'ბმული დაკოპირდა', msg: 'სამი სიმი — ზუსტი ტიუნერი ქართული ფანდურისთვის', page: 'გაზიარდეს:', site: 'საიტი', app: 'ტიუნერი' },
  en: { title: 'Share', text: 'Share Sami Simi with friends, your ensemble or students. They can scan the QR code with the phone camera.', share: 'Share', copy: 'Copy link', copied: 'Link copied', msg: 'Sami Simi — a precise tuner for the Georgian panduri', page: 'Share:', site: 'Website', app: 'Tuner' },
};

export function create(ctx) {
  const tr = (k, v) => ctx.tr(L, k, v);
  let target = 'site';
  const url = () => (target === 'site' ? ctx.siteUrl : ctx.siteUrl + 'app/');
  const el = h(`<div class="tool share">
    <p class="tool-hint"></p>
    <div class="chips which"></div>
    <div class="qr-wrap"><div class="qr"></div><code class="qr-url"></code></div>
    <div class="row-btns"><button type="button" class="btn-primary" data-a="share"></button><button type="button" class="btn-ghost bordered" data-a="copy"></button></div>
  </div>`);

  function render() {
    el.querySelector('.tool-hint').textContent = tr('text');
    el.querySelector('.which').innerHTML = [['site', 'site'], ['app', 'app']].map(([v, k]) => `<button type="button" role="radio" aria-checked="${v === target}" data-w="${v}">${tr(k)}</button>`).join('');
    const q = qrcode(0, 'M'); q.addData(url()); q.make();
    el.querySelector('.qr').innerHTML = q.createSvgTag({ cellSize: 6, margin: 3, scalable: true });
    el.querySelector('.qr-url').textContent = url();
    el.querySelector('[data-a="share"]').textContent = tr('share');
    el.querySelector('[data-a="copy"]').textContent = tr('copy');
  }
  el.addEventListener('click', async (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.w) { target = b.dataset.w; return render(); }
    if (b.dataset.a === 'share') {
      if (navigator.share) { try { await navigator.share({ title: 'Sami Simi', text: tr('msg'), url: url() }); } catch (er) { /* cancelled */ } return; }
      b.dataset.a = 'copy';
    }
    if (b.dataset.a === 'copy') {
      try { await navigator.clipboard.writeText(url()); ctx.toast(tr('copied')); }
      catch (er) { const r = document.createRange(); r.selectNodeContents(el.querySelector('.qr-url')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
      render();
    }
  });
  return { el, title: () => tr('title'), open() { render(); }, close() {} };
}
