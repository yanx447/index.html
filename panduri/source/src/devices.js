/* Server-owned login sessions; never infer other devices from local storage. */
PD.i18n.add({
 'rf.appearance':['გარეგნობა და შეგრძნებები','Appearance and feel'], 'rf.palette':['აპის ფერები','App colours'],
 'rf.paper':['ქაღალდი','Paper'], 'rf.night':['ღამე','Night'], 'rf.glass':['Liquid Glass ნავიგაცია','Liquid Glass navigation'],
 'rf.sound':['ხმის სტილი','Sound style'], 'rf.wood':['ხის რბილი ხმა','Wood'], 'rf.soft':['ნაზი','Soft'], 'rf.silent':['უხმო','Silent'],
 'rf.preview':['ხმის მოსმენა','Preview sound'], 'rf.tuner':['ტიუნერის პარამეტრები','Tuner settings'],
 'dv.title':['შენი მოწყობილობები','Your devices'], 'dv.loading':['სესიები იტვირთება…','Loading sessions…'],
 'dv.current':['ეს მოწყობილობა','This device'], 'dv.rename':['სახელის შეცვლა','Rename'], 'dv.remove':['გათიშვა','Sign out'],
 'dv.confirm':['გაითიშოს ანგარიში ამ მოწყობილობაზე?','Sign out this device?'],
 'dv.unavailable':['სესიების სია ვერ ჩაიტვირთა. შეამოწმე კავშირი; სერვერზე მოწყობილობების ფუნქციაც უნდა იყოს ჩართული.','Could not load sessions. Check your connection; device management must also be enabled on the server.'],
 'dv.retry':['თავიდან ცდა','Retry'], 'dv.signin':['მოწყობილობების სანახავად შედი ანგარიშში.','Sign in to see your devices.'],
 'dv.saved':['შენახულია','Saved'], 'dv.name':['მოწყობილობის სახელი','Device name'],
 'dv.removed':['სესია გათიშულია. უკვე გაცემული წვდომის token მოქმედებს ვადის გასვლამდე.','Session revoked. An already issued access token remains valid until it expires.']
});
PD.devices = (() => {
 const h = PD.h, t = PD.i18n.t;
 function section(w, { sect }) {
   const list = h('div', { class: 'device-list' });
   w.append(sect('dv.title', [list]));
   async function load() {
     list.replaceChildren(h('p', { text: t('dv.loading') }));
     if (!PD.cloud.session) { list.replaceChildren(h('p', { text: t('dv.signin') })); return; }
     try {
       const sessions = await PD.cloud.db.rpc('my_device_sessions');
       if (!list.isConnected) return;
       list.replaceChildren();
       for (const s of sessions) {
         const title = s.label || s.agent || t('dv.name');
         const rename = () => PD.ui.sheet((box, close) => {
           const input = h('input', { class: 'input', value: title, maxlength: 80, 'aria-label': t('dv.name') });
           box.append(h('h2', { text: t('dv.rename') }), input, h('button', { class: 'btn primary', text: t('dv.saved'), onclick: async e => {
             const b = e.currentTarget; b.disabled = true;
             try { await PD.cloud.db.rpc('rename_device_session', { target: s.id, new_label: input.value.trim() }); close(); load(); }
             catch (_) { b.disabled = false; PD.ui.toast(t('dv.unavailable')); }
           } }));
         });
         list.append(h('div', { class: 'li device-row' }, [
           h('div', { class: 'grow' }, [h('b', { text: title }), h('small', { text: (s.current_device ? t('dv.current') + ' · ' : '') + new Date(s.last_seen || s.created_at).toLocaleString(PD.i18n.locale) })]),
           h('button', { class: 'btn small', text: t('dv.rename'), onclick: rename }),
           !s.current_device ? h('button', { class: 'btn small quiet danger', text: t('dv.remove'), onclick: () => PD.ui.confirm(t('dv.confirm'), async () => {
             try { await PD.cloud.db.rpc('revoke_device_session', { target: s.id }); PD.ui.toast(t('dv.removed'), 7000); load(); }
             catch (_) { PD.ui.toast(t('dv.unavailable')); }
           }) }) : null
         ]));
       }
     } catch (_) {
       if (list.isConnected) list.replaceChildren(h('p', { text: t('dv.unavailable') }), h('button', { class: 'btn small', text: t('dv.retry'), onclick: load }));
     }
   }
   load();
 }
 return { section };
})();
