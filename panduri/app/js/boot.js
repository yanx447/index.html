/* boot: shell, first-launch onboarding, PWA (where the host allows it) */
(function () {
  try {
    document.documentElement.lang = PD.i18n.lang;
    const sp = document.getElementById('pd-splash'), spT = document.getElementById('pd-splash-t');
    if (spT) spT.textContent = PD.i18n.lang === 'en' ? 'Preparing…' : 'მზადდება…';
    PD.cloud.boot();
    PD.tv && PD.tv.init();
    PD.app.shell();
    PD.app.go('home', null, true);
    // first thing: sign in (Google · Facebook · phone · e-mail), then the short onboarding
    const afterAuth = () => { if (!PD.store.get('onboarded', false)) PD.onboard.open(); };
    if (!PD.cloud.session && !PD.store.get('auth.skip', false)) PD.auth.gate(afterAuth); else afterAuth();
    window.addEventListener('keydown', e => { if (e.key === '?' && !PD.practice.active) PD.ui.toast(t('kbd.list'), 6000); });
    PD.bus.on('lessons', () => PD.pwa.persist());
    if (sp) requestAnimationFrame(() => { sp.style.opacity = '0'; setTimeout(() => sp.remove(), 300); });
  } catch (e) {
    console.error(e);
    // calm, useful failure state (details stay in the console, not on screen)
    const ka = (navigator.language || '').startsWith('ka') || (PD.store && PD.store.get('lang', 'ka') === 'ka');
    const s0 = document.getElementById('pd-splash'); s0 && s0.remove();
    document.body.innerHTML = '<div style="min-height:100%;display:flex;align-items:center;justify-content:center;padding:24px;background:#0B0B0A;color:#F1ECE5;font:15px/1.5 system-ui"><div style="max-width:360px;display:flex;flex-direction:column;gap:12px"><b style="font-weight:600">' + (ka ? 'აპის გაშვება ვერ მოხერხდა' : 'The app could not start') + '</b><span style="color:#8B847B">' + (ka ? 'სცადე თავიდან ჩატვირთვა. შენი პროგრესი ამ მოწყობილობაზე შენახული რჩება.' : 'Try reloading. Your progress stays saved on this device.') + '</span><button onclick="location.reload()" style="align-self:flex-start;min-height:40px;padding:0 16px;border-radius:8px;border:0;background:#D2A15E;color:#18110A;font:600 14px system-ui;cursor:pointer">' + (ka ? 'თავიდან ჩატვირთვა' : 'Reload') + '</button></div></div>';
  }
  PD.pwa.register();
})();
