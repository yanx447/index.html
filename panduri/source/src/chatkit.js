/* =====================================================================
   Chat kit: emoji, panduri stickers and GIFs for chats and comments.
   · Emoji are ordinary text: they go into the message as typed.
   · Stickers are the app's own drawings (the panduri, Sima, a metronome…),
     sent by name — nothing is uploaded, every device draws them itself.
   · GIFs come from GIPHY through the server (the key never reaches the
     app). The GIF tab appears only when the server says it is set up.
   ===================================================================== */
PD.i18n.add({
  'ck.emoji': ['ემოჯი', 'Emoji'], 'ck.stickers': ['სტიკერები', 'Stickers'], 'ck.gif': ['GIF', 'GIF'], 'ck.recent': ['ბოლოს გამოყენებული', 'Recently used'],
  'ck.attach': ['მიმაგრება', 'Attach'], 'ck.media': ['ფოტო ან ვიდეო', 'Photo or video'], 'ck.audio': ['აუდიო ან მუსიკა', 'Audio or music'],
  'ck.gifSearch': ['მოძებნე GIF…', 'Search GIFs…'], 'ck.gifNone': ['ვერაფერი მოიძებნა.', 'Nothing found.'], 'ck.gifBy': ['GIF-ები: GIPHY', 'GIFs by GIPHY'],
  'ck.cat.smile': ['სახეები', 'Faces'], 'ck.cat.hand': ['ჟესტები და გულები', 'Gestures and hearts'], 'ck.cat.music': ['მუსიკა', 'Music'], 'ck.cat.food': ['ბუნება და სუფრა', 'Nature and food'], 'ck.cat.misc': ['სხვა', 'Other'],
  'ck.st.panduri': ['ფანდური', 'Panduri'], 'ck.st.love': ['მიყვარს', 'Love it'], 'ck.st.bravo': ['ყოჩაღ!', 'Well done!'], 'ck.st.play': ['ვუკრავ', 'Playing'],
  'ck.st.again': ['კიდევ ერთხელ!', 'Once more!'], 'ck.st.string': ['სიმი გამიწყდა', 'A string broke'], 'ck.st.fire': ['ცეცხლი!', 'Fire!'], 'ck.st.hi': ['გამარჯობა!', 'Hello!'],
  'ck.st.thanks': ['მადლობა', 'Thank you'], 'ck.st.tempo': ['ტემპი!', 'Tempo!'], 'ck.st.night': ['ძილი ნებისა', 'Good night'], 'ck.st.think': ['როგორ?', 'How?']
});

PD.chatkit = (() => {
  const h = PD.h, C = PD.cloud;
  /* ---------------- emoji ---------------- */
  const SET = {
    smile: '😀 😃 😄 😁 😆 😅 🤣 😂 🙂 😉 😊 😇 🥰 😍 🤩 😘 😋 😜 🤪 🤗 🤭 🤫 🤔 😐 😏 😴 😌 😎 🥳 🤓 😮 😲 😳 🥺 😢 😭 😤 😡 🤯 😱 🙄 😬 🤐 😷 🤒 🫡 🫠',
    hand: '👍 👎 👏 🙌 🙏 🤝 👋 ✌️ 🤞 🤟 🤘 👌 💪 🫶 ❤️ 🧡 💛 💚 💙 💜 🤎 🖤 🤍 💔 ❣️ 💕 💞 💖 ✨ 🔥 ⭐ 🌟 💯 ✅ ❌ ⚡ 🎉 🎊',
    music: '🎵 🎶 🎼 🎤 🎧 🎸 🎻 🥁 🎹 🎺 🎷 🪘 🪗 🪕 📯 🔔 🎙️ 📻 🎬 🎥 📸 🎞️ 💃 🕺',
    food: '🌸 🌹 🌻 🌷 🍀 🌿 🌳 🏔️ 🌙 ☀️ 🌈 ❄️ 🌊 🍇 🍷 🥂 🍞 🧀 🥟 🍖 🍕 🍰 ☕ 🫖 🍎 🍑 🍒',
    misc: '🇬🇪 ⛪ 🏠 🎓 📚 ✏️ 📝 ⏰ ⌛ 🎁 🏆 🥇 🎯 🚗 ✈️ 📱 💻 💡 📌 ❓ ❗ 💤'
  };
  const recent = () => PD.store.get('ck.recent', []);
  const remember = e => PD.store.set('ck.recent', [e].concat(recent().filter(x => x !== e)).slice(0, 24));
  /** put text where the cursor is (without opening the phone's keyboard if it is closed) */
  function insert(ta, txt) {
    const s = ta.selectionStart != null ? ta.selectionStart : ta.value.length, e = ta.selectionEnd != null ? ta.selectionEnd : s;
    ta.value = ta.value.slice(0, s) + txt + ta.value.slice(e);
    const at = s + txt.length; try { ta.setSelectionRange(at, at); } catch (_) {}
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    if (!PD.isTouch()) ta.focus();
  }
  function emojiGrid(onPick) {
    const box = h('div', { class: 'ck-emo' });
    const add = (key, list) => { if (!list.length) return; box.append(h('small', { class: 'ck-cat', 'data-t': key }), h('div', { class: 'ck-grid' }, list.map(e => h('button', { type: 'button', class: 'ck-e', text: e, 'aria-label': e })))); };
    add('ck.recent', recent()); Object.keys(SET).forEach(k => add('ck.cat.' + k, SET[k].split(' ')));
    box.addEventListener('click', ev => { const b = ev.target.closest('.ck-e'); if (!b) return; remember(b.textContent); onPick(b.textContent); });
    PD.i18n.apply(box);
    return box;
  }

  /* ---------------- stickers (drawn here; the panduri is the same one as the reaction) ---------------- */
  const PAN = () => PD.social.PANDURI.replace(/^<svg[^>]*>|<\/svg>$/g, '');
  const P = (x, y, s, r) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')' + (r ? ' rotate(' + r + ' 16 16)' : '') + '">' + PAN() + '</g>';
  const heart = (x, y, s, c) => '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M10 18s-8-5.2-8-10.4A4.6 4.6 0 0 1 10 4.8a4.6 4.6 0 0 1 8 2.8C18 12.8 10 18 10 18z" fill="' + (c || '#E5534B') + '"/>';
  const note = (x, y, s, c) => '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M7 2v11.2A3 3 0 1 0 9 16V6h5V2z" fill="' + (c || '#EAD3A3') + '"/>';
  const star = (x, y, s, c) => '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M10 0l2.9 6.6 7.1.7-5.4 4.8 1.6 7L10 15.4 3.8 19.1l1.6-7L0 7.3l7.1-.7z" fill="' + (c || '#FFD27A') + '"/>';
  const disc = c => '<circle cx="60" cy="60" r="54" fill="' + c + '"/>';
  const ART = {
    panduri: () => disc('#2A1A10') + '<circle cx="60" cy="60" r="50" fill="none" stroke="#E0A878" stroke-width="2" opacity=".5"/>' + P(16, 12, 2.75),
    love: () => disc('#3B1A1A') + P(10, 20, 2.55, -6) + heart(66, 10, 1.7) + heart(86, 44, 1.05, '#FF8FA3'),
    bravo: () => disc('#3B2E10') + P(16, 18, 2.55) + star(76, 8, 1.35) + star(92, 46, .8) + star(10, 14, .75),
    play: () => disc('#14283B') + P(6, 22, 2.5, 8) + note(70, 10, 2.3) + note(90, 46, 1.5, '#78B7DE'),
    again: () => disc('#1E1A16') + '<path d="M62 16a44 44 0 1 1-38 22" fill="none" stroke="#E0A878" stroke-width="7" stroke-linecap="round"/><path d="M10 32l14 6 6-14" fill="none" stroke="#E0A878" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' + P(26, 24, 2.1),
    string: () => disc('#1E1A16') + P(12, 18, 2.6, -10) + '<path d="M78 28c10 4 4 14 13 16s3 13 13 12" stroke="#F1ECE6" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M30 12c5 7 7 10 7 13a7 7 0 0 1-14 0c0-3 2-6 7-13z" fill="#78B7DE"/>',
    fire: () => '<path d="M60 4c9 17 34 24 34 56a34 34 0 0 1-68 0c0-16 9-25 14-34 2 9 7 14 11 14-2-16 2-27 9-36z" fill="#E2574C"/><path d="M60 40c6 10 18 15 18 33a18 18 0 0 1-36 0c0-10 7-16 9-22 2 6 5 8 7 8-1-8 0-14 2-19z" fill="#FFD27A"/>' + P(16, 22, 2.55),
    hi: () => '<circle cx="56" cy="62" r="44" fill="#C98B5B"/><circle cx="56" cy="62" r="38" fill="#E0A878" opacity=".35"/><text x="56" y="80" text-anchor="middle" font-size="50" font-weight="800" fill="#1A0F08">ს</text><text x="96" y="40" text-anchor="middle" font-size="34">👋</text>',
    thanks: () => heart(8, 6, 5.2, '#E5534B') + P(37, 28, 1.45),
    tempo: () => disc('#1E1A16') + '<path d="M36 106h48L71 16H49z" fill="#6B2A17"/><path d="M42 96h36" stroke="#E0A878" stroke-width="4"/><path d="M60 86L84 30" stroke="#EAD3A3" stroke-width="5" stroke-linecap="round"/><circle cx="77" cy="46" r="7" fill="#E0A878"/><path d="M92 22l8-6M96 34l10-2" stroke="#FFD27A" stroke-width="4" stroke-linecap="round"/>',
    night: () => disc('#101830') + '<path d="M84 18a26 26 0 1 0 16 44 32 32 0 0 1-16-44z" fill="#FFD27A"/>' + star(18, 18, .65) + star(40, 8, .45) + P(14, 44, 2.1, -58) + '<text x="94" y="96" font-size="18" font-weight="700" fill="#EAD3A3">z z</text>',
    think: () => disc('#1E1A16') + P(6, 24, 2.5, 4) + '<text x="90" y="58" text-anchor="middle" font-size="46" font-weight="800" fill="#FFD27A">?</text><text x="104" y="30" text-anchor="middle" font-size="22" font-weight="800" fill="#E0A878">?</text>'
  };
  const STICKERS = Object.keys(ART);
  /** a sticker as shown in a chat or in the picker */
  function sticker(id, small) {
    const draw = ART[id];
    return h('span', { class: 'ck-st' + (small ? ' small' : ''), role: 'img', 'aria-label': t('ck.st.' + id) }, [
      h('span', { class: 'ck-art', html: draw ? '<svg viewBox="0 0 120 120" aria-hidden="true">' + draw() + '</svg>' : '' }),
      h('b', { text: draw ? t('ck.st.' + id) : '' })]);
  }
  function stickerGrid(onPick) {
    const g = h('div', { class: 'ck-sts' }, STICKERS.map(id => { const b = h('button', { type: 'button', class: 'ck-stb', 'aria-label': t('ck.st.' + id) }, [sticker(id, true)]); b.onclick = () => onPick(id); return b; }));
    return g;
  }

  /* ---------------- GIFs (through the server) ---------------- */
  let gifOn = null;
  async function gifsAvailable() {
    if (gifOn != null) return gifOn;
    try { const j = await C.gifs.probe(); gifOn = !!(j && j.on); } catch (_) { gifOn = false; }
    return gifOn;
  }
  function gifGrid(onPick) {
    const q = h('input', { class: 'input', type: 'search', placeholder: t('ck.gifSearch'), 'aria-label': t('ck.gifSearch') });
    const grid = h('div', { class: 'ck-gifs' }), by = h('small', { class: 'muted ck-by', 'data-t': 'ck.gifBy' });
    let tm = 0, seq = 0;
    async function load() {
      const my = ++seq; grid.innerHTML = '';
      try {
        const rows = (await C.gifs.search(q.value.trim(), PD.i18n.lang)) || [];
        if (my !== seq) return;
        if (!rows.length) { grid.appendChild(h('p', { class: 'muted', 'data-t': 'ck.gifNone' })); PD.i18n.apply(grid); return; }
        rows.forEach(r => { const b = h('button', { type: 'button', class: 'ck-gif', 'aria-label': r.title || 'GIF' }, [h('img', { alt: '', src: r.preview || r.url, loading: 'lazy' })]); b.onclick = () => onPick(r); grid.appendChild(b); });
      } catch (e) { if (my === seq) grid.textContent = PD.community.util.err(e); }
    }
    q.oninput = () => { clearTimeout(tm); tm = setTimeout(load, 350); };
    load();
    const box = h('div', { class: 'ck-gifbox' }, [q, grid, by]); PD.i18n.apply(box);
    return box;
  }

  /* ---------------- the panel above a chat's input ---------------- */
  /** opts: { input, onSticker(id), onGif(row) } → { el, toggle(tab), close() } */
  function panel(opts) {
    const el = h('div', { class: 'ck-panel', hidden: true });
    const tabs = h('div', { class: 'ck-tabs', role: 'tablist' }), body = h('div', { class: 'ck-body' });
    el.append(tabs, body);
    let cur = null;
    async function paintTabs() {
      const list = [['emoji', '😊', 'ck.emoji']].concat(opts.onSticker ? [['stickers', null, 'ck.stickers']] : []).concat(opts.onGif && await gifsAvailable() ? [['gif', 'GIF', 'ck.gif']] : []);
      tabs.innerHTML = '';
      list.forEach(([k, icon, key]) => tabs.appendChild(h('button', { type: 'button', role: 'tab', 'aria-selected': String(cur === k), class: cur === k ? 'on' : '', 'aria-label': t(key), title: t(key),
        html: k === 'stickers' ? '<span class="rx-pan">' + PD.social.PANDURI + '</span>' : PD.esc(icon), onclick: () => show(k) })));
    }
    function show(k) {
      cur = k; body.innerHTML = '';
      if (k === 'emoji') body.appendChild(emojiGrid(e => insert(opts.input, e)));
      else if (k === 'stickers') body.appendChild(stickerGrid(id => { close(); opts.onSticker(id); }));
      else if (k === 'gif') body.appendChild(gifGrid(r => { close(); opts.onGif(r); }));
      paintTabs();
    }
    function toggle(k) { if (!el.hidden && (!k || k === cur)) return close(); el.hidden = false; show(k || cur || 'emoji'); }
    function close() { el.hidden = true; }
    return { el, toggle, close, get open() { return !el.hidden; } };
  }
  /** a small emoji button for any text box (comments, captions): opens the emoji grid in a popover */
  function emojiButton(input) {
    const b = h('button', { type: 'button', class: 'pz-ic ck-eb', 'aria-label': t('ck.emoji'), title: t('ck.emoji'), text: '😊' });
    b.onclick = e => {
      e.stopPropagation();
      const old = document.querySelector('.ck-pop'); if (old) { old.remove(); return; }
      const pop = h('div', { class: 'ck-pop' }, [emojiGrid(x => insert(input, x))]);
      document.body.appendChild(pop);
      const r = b.getBoundingClientRect(), w = Math.min(340, innerWidth - 16);
      pop.style.width = w + 'px'; pop.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.right - w)) + 'px';
      pop.style.top = Math.max(8, r.top - pop.offsetHeight - 8) + 'px';
      const away = ev => { if (!pop.contains(ev.target) && ev.target !== b) { pop.remove(); document.removeEventListener('pointerdown', away, true); } };
      setTimeout(() => document.addEventListener('pointerdown', away, true), 0);
    };
    return b;
  }
  return { panel, emojiButton, sticker, STICKERS, insert, gifsAvailable, get gifReady() { return gifOn === true; } };
})();
