/* =====================================================================
   Author tools (Author Mode only): approved instrument profile editor
   with source tags, curriculum package import/export, and the real
   panduri sample library manager.
   ===================================================================== */
PD.i18n.add({
  'at.instrument': ['დამტკიცებული ინსტრუმენტის პროფილი', 'Approved instrument profile'],
  'at.instrumentD': ['ყოველი ზომა და ბგერა ინახება წყაროსთან ერთად: გაზომილი · ფოტოდან · შეფასებული · გამოთვლილი. „გაზომილი“ მონიშნე მხოლოდ მაშინ, როცა ნამდვილად გაზომე.', 'Every dimension and pitch keeps its source: measured · photo · estimate · computed. Mark “measured” only when you actually measured it.'],
  'at.reload': ['ცვლილებები 3D მოდელში გვერდის განახლების შემდეგ გამოჩნდება.', 'Changes to the 3D model appear after reloading the page.'],
  'at.strings': ['სიმები (წინიდან, მარცხნიდან მარჯვნივ)', 'Strings (front view, left to right)'], 'at.label': ['სახელი', 'Label'], 'at.open': ['ღია სიმი (MIDI)', 'Open string (MIDI)'],
  'at.frets': ['ლადები', 'Frets'], 'at.count': ['რაოდენობა', 'Count'], 'at.scale': ['მენზურა (მმ)', 'Scale length (mm)'], 'at.recompute': ['პოზიციების გამოთვლა (თანაბარი ტემპერაცია)', 'Compute positions (equal temperament)'],
  'at.pos': ['ლადის მანძილი ნულოვანი ლადიდან (მმ)', 'Fret distance from the nut (mm)'], 'at.cents': ['ბგერის გადახრა (ცენტი) — თუ ლადი ზუსტად ნახევარტონზე არ ჟღერს', 'Pitch offset (cents) — if a fret is not exactly a semitone'],
  'at.geometry': ['ზომები', 'Dimensions'], 'at.hardware': ['აპარატურა', 'Hardware'], 'at.audit': ['დასამოწმებელი', 'To verify'], 'at.ok': ['ყველაფერი დამოწმებულია', 'Everything is verified'],
  'at.saveP': ['პროფილის შენახვა', 'Save profile'], 'at.resetP': ['ნაგულისხმევზე დაბრუნება', 'Reset to default'], 'at.exportP': ['პროფილის ექსპორტი', 'Export profile'], 'at.importP': ['პროფილის იმპორტი', 'Import profile'],
  'src.measured': ['გაზომილი', 'measured'], 'src.photo': ['ფოტოდან', 'photo'], 'src.estimate': ['შეფასებული', 'estimate'], 'src.computed': ['გამოთვლილი', 'computed'],
  'at.curD': ['კურიკულუმი = გაკვეთილები + სწავლის გზები + აკორდების ბიბლიოთეკა, ერთ JSON პაკეტში. ძრავა არ იცვლება.', 'Curriculum = lessons + learning paths + chord library in one JSON package. The engine does not change.'],
  'at.curNow': ['ახლა: {t}', 'Now: {t}'], 'at.curExport': ['პაკეტის ექსპორტი', 'Export package'], 'at.curImport': ['პაკეტის ჩატვირთვა', 'Install package'], 'at.curDemo': ['სადემონსტრაციოზე დაბრუნება', 'Back to demo'], 'at.curOk': ['კურიკულუმი ჩაიტვირთა', 'Curriculum installed'],
  'at.smpD': ['ჩაწერე შენი ფანდური: ღია სიმები, ყოველი ლადი, ჩაკვრა/ამოკვრა, დადუმებული დარტყმა, აკორდები, სხვადასხვა სიძლიერით. ფაილის სახელი: „A_05_pluck_mf_1.wav“ ან „chord_5-4-5_down_mf_1.wav“.', 'Record your panduri: open strings, every fret, down/up strokes, muted strokes, chords, at several dynamics. File name: “A_05_pluck_mf_1.wav” or “chord_5-4-5_down_mf_1.wav”.'],
  'at.smpAdd': ['ფაილების დამატება', 'Add files'], 'at.smpCov': ['დაფარვა: {a}', 'Coverage: {a}'], 'at.smpBad': ['სახელი ვერ გავარჩიე: {n}', 'Could not parse name: {n}'], 'at.smpAdded': ['დაემატა {n} ნიმუში', 'Added {n} samples'],
  'at.repitch': ['მაქს. გადაწევა უახლოესი ჩანაწერიდან (ნახევარტონი)', 'Max re-pitch from the nearest recording (semitones)'], 'at.smpNone': ['ჯერ ნიმუში არ არის — ყველა ბგერა ფიზიკური მოდელითაა.', 'No samples yet — every sound is the physical model.']
});

PD.authorTools = (() => {
  const h = PD.h, I = PD.instrument;
  function panel(titleKey, build) {
    const back = h('div', { class: 'studio', role: 'dialog', 'aria-modal': 'true', style: 'z-index:45;grid-template-rows:auto minmax(0,1fr)' });
    const close = () => { back.remove(); document.removeEventListener('keydown', esc, true); };
    const esc = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    document.addEventListener('keydown', esc, true);
    const body = h('div', { style: 'overflow:auto;padding:16px clamp(12px,3vw,32px) 40px' }, [h('div', { class: 'wrap', style: 'max-width:980px;gap:18px' })]);
    back.append(h('div', { class: 'st-top' }, [h('button', { class: 'btn icon quiet', 'aria-label': t('close'), html: PD.ic.back, onclick: close }), h('b', { text: t(titleKey) })]), body);
    document.body.appendChild(back);
    build(body.firstChild, close); PD.i18n.apply(back);
    return close;
  }
  const srcSel = (obj, onCh) => h('select', { class: 'input', style: 'min-height:32px;width:auto', 'aria-label': 'source', onchange: e => { obj.src = e.target.value; onCh && onCh(); } }, ['measured', 'photo', 'estimate', 'computed'].map(k => h('option', { value: k, text: t('src.' + k), selected: obj.src === k })));
  const num = (v, on, step) => h('input', { class: 'input', type: 'number', step: step || 'any', value: String(v), style: 'width:96px;min-height:34px', oninput: e => on(+e.target.value) });

  /* ---------- instrument profile ---------- */
  function instrument() {
    panel('at.instrument', (w, close) => {
      const P = JSON.parse(JSON.stringify(I.profile));
      const audit = h('div', { class: 'card', style: 'padding:12px' });
      const renderAudit = () => { const u = I.unverified(); audit.innerHTML = ''; audit.append(h('b', { text: t('at.audit') })); audit.append(u.length ? h('ul', { style: 'margin:6px 0 0 18px;font-size:13px;line-height:1.7' }, u.map(x => h('li', { text: x.path + ' — ' + t('src.' + x.src) }))) : h('p', { class: 'muted', text: t('at.ok') })); };
      renderAudit();
      w.append(h('p', { class: 'fg2', text: t('at.instrumentD') }), h('p', { class: 'muted', style: 'font-size:12px', text: t('at.reload') }), audit);
      // strings
      const sTab = h('div', { class: 'list' });
      P.strings.forEach(sx => sTab.append(h('div', { class: 'li', style: 'gap:10px;flex-wrap:wrap' }, [h('b', { class: 'mono', text: String(sx.n) }),
        h('label', { class: 'field', style: 'flex-direction:row;align-items:center' }, [h('span', { text: t('at.label') }), h('input', { class: 'input', value: sx.label, style: 'width:70px;min-height:34px', oninput: e => sx.label = e.target.value })]),
        h('label', { class: 'field', style: 'flex-direction:row;align-items:center' }, [h('span', { text: t('at.open') }), num(sx.open, v => sx.open = v, 1), h('span', { class: 'mono muted', text: PD.theory.name(sx.open) })]),
        h('input', { type: 'color', value: sx.color, 'aria-label': 'color', oninput: e => sx.color = e.target.value }), srcSel(sx)])));
      w.append(h('h2', { text: t('at.strings') }), sTab);
      // frets: count, scale length, positions, cent map
      const posBox = h('div', { style: 'display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px' });
      const centBox = h('div', { style: 'overflow-x:auto' });
      const drawPos = () => {
        posBox.innerHTML = ''; P.fretPos.mm.forEach((v, n) => { if (!n) return; posBox.append(h('label', { class: 'row', style: 'gap:6px;font-size:13px' }, [h('span', { class: 'mono', style: 'width:28px', text: String(n) }), num(v, x => { P.fretPos.mm[n] = x; P.fretPos.src = 'measured'; }, '.1')])); });
        let tb = '<table style="border-collapse:collapse;font-size:12px"><tr><th></th>' + P.fretPos.mm.map((_, f) => '<th class="mono" style="padding:2px 4px;color:var(--muted)">' + f + '</th>').join('') + '</tr>';
        P.strings.forEach((sx, si) => { tb += '<tr><th class="mono" style="padding:2px 6px">' + PD.esc(sx.label) + '</th>' + P.fretPos.mm.map((_, f) => '<td><input data-s="' + si + '" data-f="' + f + '" type="number" step="1" value="' + ((P.fretPitch.cents[si] || [])[f] || 0) + '" style="width:46px;min-height:28px;background:var(--bg2);border:1px solid var(--line2);color:var(--fg);border-radius:6px;padding:0 4px"></td>').join('') + '</tr>'; });
        centBox.innerHTML = tb + '</table>';
        centBox.querySelectorAll('input').forEach(inp => inp.oninput = () => { const si = +inp.dataset.s, f = +inp.dataset.f; P.fretPitch.cents[si] = P.fretPitch.cents[si] || []; P.fretPitch.cents[si][f] = +inp.value || 0; P.fretPitch.src = 'measured'; });
      };
      const countIn = num(P.frets.count, v => { v = Math.max(1, Math.min(30, Math.round(v))); P.frets.count = v; while (P.fretPos.mm.length < v + 1) P.fretPos.mm.push(+(P.scaleLength.mm * (1 - Math.pow(2, -P.fretPos.mm.length / 12))).toFixed(2)); P.fretPos.mm.length = v + 1; P.fretPitch.cents = P.fretPitch.cents.map(r => { const a = (r || []).slice(0, v + 1); while (a.length < v + 1) a.push(0); return a; }); drawPos(); }, 1);
      const scaleIn = num(P.scaleLength.mm, v => { P.scaleLength.mm = v; }, '.1');
      w.append(h('h2', { text: t('at.frets') }),
        h('div', { class: 'row' }, [h('span', { text: t('at.count') }), countIn, srcSel(P.frets), h('span', { text: t('at.scale') }), scaleIn, srcSel(P.scaleLength),
          h('button', { class: 'btn small', text: t('at.recompute'), onclick: () => { P.fretPos.mm = P.fretPos.mm.map((_, n) => +(P.scaleLength.mm * (1 - Math.pow(2, -n / 12))).toFixed(2)); P.fretPos.src = 'computed'; drawPos(); } })]),
        h('div', { class: 'row' }, [h('b', { text: t('at.pos') }), srcSel(P.fretPos)]), posBox,
        h('div', { class: 'row' }, [h('b', { text: t('at.cents') }), srcSel(P.fretPitch)]), centBox);
      drawPos();
      // dimensions
      const dims = [['scaleLength', 'mm'], ['neckJoin', 'mm'], ['fingerboardEnd', 'mm'], ['body', 'lengthMm'], ['body', 'maxWidthMm'], ['body', 'bottomWidthMm'], ['soundHole', 'diameterMm'], ['soundHole', 'fromBodyTopMm'], ['stringSpacing', 'nutMm'], ['stringSpacing', 'bridgeMm']];
      const dBox = h('div', { class: 'list' });
      dims.forEach(([o, k]) => dBox.append(h('div', { class: 'li', style: 'gap:10px' }, [h('div', { class: 'grow' }, [h('span', { class: 'mono', text: o + '.' + k })]), num(P[o][k], v => P[o][k] = v, '.1'), srcSel(P[o])])));
      const ring = P.soundHole.ring;
      dBox.append(h('div', { class: 'li', style: 'gap:10px' }, [h('div', { class: 'grow' }, [h('span', { class: 'mono', text: 'soundHole.ring (count · radius · Ø)' })]), num(ring.smallHoles, v => ring.smallHoles = Math.round(v), 1), num(ring.ringRadiusMm, v => ring.ringRadiusMm = v, '.1'), num(ring.holeDiameterMm, v => ring.holeDiameterMm = v, '.1'), srcSel(ring)]));
      dBox.append(h('div', { class: 'li', style: 'gap:10px' }, [h('div', { class: 'grow' }, [h('span', { class: 'mono', text: 'markers (single · double)' })]), h('input', { class: 'input', value: P.markers.single.join(','), style: 'width:140px;min-height:34px', oninput: e => P.markers.single = e.target.value.split(',').map(Number).filter(Boolean) }), h('input', { class: 'input', value: P.markers.double.join(','), style: 'width:80px;min-height:34px', oninput: e => P.markers.double = e.target.value.split(',').map(Number).filter(Boolean) }), srcSel(P.markers)]));
      w.append(h('h2', { text: t('at.geometry') }), dBox);
      const hw = h('div', { class: 'list' }); Object.keys(P.hardware).forEach(k => { const c = h('input', { type: 'checkbox' }); c.checked = !!P.hardware[k].present; c.onchange = () => P.hardware[k].present = c.checked; hw.append(h('div', { class: 'li', style: 'gap:10px' }, [h('div', { class: 'grow' }, [h('span', { class: 'mono', text: k })]), c, srcSel(P.hardware[k])])); });
      w.append(h('h2', { text: t('at.hardware') }), hw);
      w.append(h('div', { class: 'row' }, [
        h('button', { class: 'btn primary', text: t('at.saveP'), onclick: () => { const e = I.validate(P); if (e.length) return PD.ui.toast(e.join('; '), 5000); I.save(P); renderAudit(); PD.ui.toast(t('toast.saved')); } }),
        h('button', { class: 'btn', text: t('at.exportP'), onclick: () => PD.ui.download('panduri-instrument.json', JSON.stringify(P, null, 1)) }),
        h('button', { class: 'btn', text: t('at.importP'), onclick: async () => { const f = await PD.ui.pickFile('application/json,.json'); if (!f) return; try { I.fromJSON(await f.text()); PD.ui.toast(t('toast.imported')); close(); instrument(); } catch (e) { PD.ui.toast(e.message, 5000); } } }),
        h('button', { class: 'btn', style: 'color:var(--fix)', text: t('at.resetP'), onclick: () => PD.ui.confirm(t('at.resetP') + '?', () => { I.reset(); close(); instrument(); }) })]));
    });
  }

  /* ---------- curriculum package ---------- */
  function curriculum() {
    panel('sd.curriculum', (w, close) => {
      const C = PD.curriculum;
      w.append(h('p', { class: 'fg2', text: t('at.curD') }), h('p', { class: 'mono', text: t('at.curNow', { t: PD.i18n.pick(C.meta.title) + (C.isDemo ? ' · ' + t('demo.badge') : '') }) }),
        h('div', { class: 'row' }, [
          h('button', { class: 'btn', text: t('at.curExport'), onclick: () => PD.ui.download('panduri-curriculum.json', C.export(PD.lessons.all.filter(l => l.user))) }),
          h('button', { class: 'btn primary', text: t('at.curImport'), onclick: async () => { const f = await PD.ui.pickFile('application/json,.json'); if (!f) return; try { C.install(JSON.parse(await f.text())); PD.ui.toast(t('at.curOk')); close(); } catch (e) { PD.ui.toast(e.message, 5000); } } }),
          C.isDemo ? null : h('button', { class: 'btn', text: t('at.curDemo'), onclick: () => PD.ui.confirm(t('at.curDemo') + '?', () => { C.uninstall(); close(); }) })]),
        h('pre', { class: 'mono muted', style: 'font-size:11px;white-space:pre-wrap;background:var(--bg2);padding:12px;border-radius:10px', text: '{ "schema": "panduri-curriculum", "v": 1,\n  "meta": { "title": {"ka": "…", "en": "…"}, "author": "…", "verified": true },\n  "lessons": [ Lesson … ],   // see lesson JSON export in the Studio\n  "paths":   [ { "id", "title", "steps": [ {"kind":"lesson","id":"…"} ] } ],\n  "chords":  [ { "id", "name", "frets":[a,c,e], "fingers":[…] } ] }' }));
    });
  }

  /* ---------- sample library ---------- */
  function samples() {
    panel('sd.samples', (w) => {
      const S = PD.samples; let art = 'pluck';
      const cov = h('div', { class: 'fb card', style: 'padding:10px' }), list = h('div', { class: 'list' });
      const seg = h('div', { class: 'seg', role: 'group' }, S.ARTS.map(a => h('button', { 'aria-pressed': String(a === art), text: a, onclick: e => { art = a; seg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); draw(); } })));
      const rp = h('select', { class: 'input', style: 'width:auto', onchange: e => S.setMaxRepitch(+e.target.value) }, [0, 1, 2].map(v => h('option', { value: String(v), text: String(v), selected: S.maxRepitch() === v })));
      w.append(h('p', { class: 'fg2', text: t('at.smpD') }), h('div', { class: 'row' }, [h('button', { class: 'btn primary', text: t('at.smpAdd'), onclick: add }), seg, h('label', { class: 'row', style: 'gap:6px;font-size:13px' }, [h('span', { text: t('at.repitch') }), rp])]), cov, list);
      async function add() {
        const inp = h('input', { type: 'file', accept: 'audio/*', multiple: true });
        inp.onchange = async () => { let n = 0; for (const f of inp.files) { const r = await S.add(f); if (r) n++; else PD.ui.toast(t('at.smpBad', { n: f.name }), 3500); } PD.ui.toast(t('at.smpAdded', { n })); draw(); };
        inp.click();
      }
      function draw() {
        const c = S.coverage(art), NF = I.fretCount, NS = I.stringCount;
        let s = '<svg viewBox="0 0 ' + (60 + (NF + 1) * 34) + ' ' + (NS * 34 + 24) + '" role="img" aria-label="' + PD.esc(t('at.smpCov', { a: art })) + '">';
        for (let st = NS; st >= 1; st--) { const y = (NS - st) * 34; s += '<text x="6" y="' + (y + 22) + '" fill="' + I.color(st) + '" font-size="13" font-family="IBM Plex Mono">' + PD.esc(I.string(st).label) + '</text>'; for (let f = 0; f <= NF; f++) { const n = c[st + ':' + f] || 0; s += '<rect x="' + (50 + f * 34) + '" y="' + y + '" width="30" height="30" rx="5" fill="' + (n ? 'rgba(154,215,174,' + Math.min(1, .3 + n * .2) + ')' : '#1E1B18') + '"><title>' + st + ':' + f + ' · ' + n + '</title></rect>' + (n ? '<text x="' + (65 + f * 34) + '" y="' + (y + 20) + '" fill="#0B0A09" font-size="11" text-anchor="middle" font-family="IBM Plex Mono">' + n + '</text>' : ''); } }
        for (let f = 0; f <= NF; f++) s += '<text x="' + (65 + f * 34) + '" y="' + (NS * 34 + 16) + '" fill="#7C746A" font-size="10" text-anchor="middle" font-family="IBM Plex Mono">' + f + '</text>';
        cov.innerHTML = s + '</svg>';
        list.innerHTML = '';
        const items = S.list.filter(x => x.art === art);
        if (!items.length) list.append(h('div', { class: 'li muted', text: S.count ? '—' : t('at.smpNone') }));
        items.forEach(x => list.append(h('div', { class: 'li' }, [h('div', { class: 'grow' }, [h('span', { class: 'mono', text: (x.art === 'chord' ? x.shape + ' ' + x.dir : I.string(x.s).label + ' · ' + x.f) + ' · ' + x.dyn + ' · #' + x.take }), h('small', { text: x.name })]), h('button', { class: 'btn small', text: '▶', onclick: () => S.play(x.id) }), h('button', { class: 'btn small', style: 'color:var(--fix)', text: t('delete'), onclick: () => { S.remove(x.id); draw(); } })])));
      }
      draw();
    });
  }
  return { instrument, curriculum, samples };
})();
