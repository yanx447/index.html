/* Studio uses its local library while offline. Individual records, including
   deletions, travel with the account. Microphone takes are device-only. */
PD.i18n.add({
  'ssy.local': ['შენახვა ამ მოწყობილობაზე', 'Saved on this device'],
  'ssy.ready': ['პროექტები სინქრონიზებულია', 'Projects synced'],
  'ssy.busy': ['პროექტების სინქრონიზაცია…', 'Syncing projects…'],
  'ssy.offline': ['სინქრონი განახლდება კავშირის დაბრუნებისას', 'Sync resumes when you’re back online'],
  'ssy.error': ['სინქრონი ვერ დასრულდა', 'Sync could not finish'],
  'ssy.retry': ['სინქრონიზაცია', 'Sync now'],
  'ssy.info': ['ანგარიშის პროექტები და 50 მბ-მდე შემოტანილი ფაილები სინქრონიზდება. მიკროფონით ჩაწერილი პროექტები ამ მოწყობილობაზე რჩება.', 'Account projects and imported files up to 50 MB sync. Projects recorded with the microphone stay on this device.'],
  'ssy.take': ['მიკროფონის ჩანაწერი · ამ მოწყობილობაზე', 'Microphone take · on this device'],
  'ssy.large': ['აუდიო ამ მოწყობილობაზეა · 50 მბ-ზე მეტი', 'Audio on this device · over 50 MB'],
  'ssy.fetchError': ['აუდიო ჯერ ვერ ჩამოიტვირთა. შეამოწმე კავშირი და სცადე თავიდან.', 'Audio isn’t available to download yet. Check your connection and try again.'],
  'ssy.deleteSong': ['წავშალოთ „{s}“ და მისი ანალიზი? სინქრონიზებული პროექტი სხვა მოწყობილობებზეც წაიშლება.', 'Delete “{s}” and its analysis? The synced project will also be removed from other devices.'],
  'ssy.deleteArr': ['წავშალოთ „{s}“? სინქრონიზებული პროექტი სხვა მოწყობილობებზეც წაიშლება.', 'Delete “{s}”? The synced project will also be removed from other devices.']
});
PD.studioSync = (() => {
  const base = PD.store, C = PD.cloud, bucket = 'studio-projects', songs = 'ai.recent', arrangements = 'pst.list';
  const kinds = ['song', 'arrangement'], assetTypes = ['res', 'tr', 'rhy'], maxAudio = 50 * 1024 * 1024;
  const uid = () => C.uid || 'guest';
  const legacy = 'studio.legacyOwner';
  const J = 'studio.journal';
  const key = (k, owner) => base.get(legacy, 'guest') === owner ? k : 'studio.account.' + owner + '.' + k;
  const get = (k, fallback, owner = uid()) => base.get(key(k, owner), fallback);
  const set = (k, value, owner = uid()) => base.set(key(k, owner), value);
  const del = (k, owner = uid()) => base.del(key(k, owner));
  const values = owner => get(J, {}, owner);
  const tag = (kind, id) => kind + ':' + id;
  const projectKey = id => 'pst.p.' + id;
  const path = (owner, id) => owner + '/' + id;
  const listKey = kind => kind === 'song' ? songs : arrangements;
  const recorded = r => !!(r?.recorded || /^Panduri-\d{4}-\d\d-\d\dT\d\d-\d\d-\d\d-\d{3}Z\.(webm|m4a)$/i.test(r?.name || ''));
  const present = (kind, id, owner) => kind === 'song' ? get(songs, [], owner).find(x => x.id === id) : get(projectKey(id), null, owner);
  const validId = id => typeof id === 'string' && /^[a-zA-Z0-9_-]{1,96}$/.test(id);
  const revision = at => String(Math.max(Date.now(), (+at?.slice(0, 15) || 0) + 1)).padStart(15, '0') + '-' + (Math.random().toString(36).slice(2) || '0');

  let timer, inFlight, again = false, state = 'local';
  function status(next) { state = next; PD.bus.emit('studio-sync-status', state); }
  function later(delay = 1200) {
    clearTimeout(timer);
    if (uid() === 'guest' || !C.configured) return;
    timer = setTimeout(sync, delay);
  }
  function mark(kind, id, deleted = false, owner = uid()) {
    if (!validId(id)) return;
    const journal = values(owner), idKey = tag(kind, id), before = journal[idKey];
    if (before?.deleted) return;
    journal[idKey] = { revision: revision(before?.revision), dirty: true, deleted };
    set(J, journal, owner);
    later();
  }
  const store = {
    get,
    set(k, value) {
      const owner = uid();
      if (k === songs) {
        const before = new Map(get(songs, [], owner).map(x => [x.id, x]));
        const row = r => { const { at, stored, remoteAudio, ...fields } = r; return JSON.stringify(fields); };
        for (const x of value) {
          const old = before.get(x.id);
          before.delete(x.id);
          if (!recorded(x) && (!old || row(old) !== row(x) || (!old.stored && x.stored))) mark('song', x.id, false, owner);
        }
        for (const old of before.values()) if (!recorded(old)) mark('song', old.id, true, owner);
      } else if (k.startsWith('pst.p.')) {
        mark('arrangement', k.slice(6), false, owner);
      }
      set(k, value, owner);
    },
    del(k) {
      const owner = uid();
      if (k.startsWith('pst.p.')) mark('arrangement', k.slice(6), true, owner);
      del(k, owner);
    }
  };

  function claimLegacy(owner) {
    if (owner === 'guest' || base.get(legacy, null)) return;
    base.set(legacy, owner);
  }
  function discover(owner) {
    for (const kind of kinds) {
      const journal = values(owner);
      for (const row of get(listKey(kind), [], owner)) {
        if (!recorded(row) && !journal[tag(kind, row.id)]) mark(kind, row.id, false, owner);
      }
    }
  }
  function updateJournal(owner, idKey, expected, item) {
    const journal = values(owner);
    if (journal[idKey]?.revision !== expected) return false;
    journal[idKey] = item;
    set(J, journal, owner);
    return true;
  }
  function removeLocalSong(id) {
    const keep = PD.aiLessons?.usesSong(id);
    for (const x of keep ? ['res'] : ['song', ...assetTypes]) PD.blobs.del('ai.' + x + '.' + id);
  }
  async function pull(row, owner) {
    const { kind, project_id: id, revision: ver, deleted, payload } = row;
    if (uid() !== owner || !kinds.includes(kind) || !validId(id)) return;
    const idKey = tag(kind, id), item = values(owner)[idKey];
    if (item?.revision === ver || item?.dirty && item.deleted || !deleted && (item?.deleted || item?.revision > ver)) return;
    let entryToSave;
    if (deleted) {
      if (kind === 'arrangement') {
        del(projectKey(id), owner);
        if (get('pst.last', null, owner) === id) del('pst.last', owner);
      } else removeLocalSong(id);
    } else if (kind === 'arrangement') {
      const p = PD.pstCore.parse(payload);
      if (p.id !== id) return;
      set(projectKey(id), p, owner);
      entryToSave = { id, name: p.name, modified: p.modified };
    } else {
      const { entry, audio } = payload;
      if (entry?.id !== id || recorded(entry)) return;
      const local = present(kind, id, owner);
      for (const type of assetTypes) {
        if (payload[type] != null && await PD.blobs.put('ai.' + type + '.' + id, payload[type]) == null) throw Error('local-storage');
        if (uid() !== owner || values(owner)[idKey]?.revision !== item?.revision) return;
      }
      entryToSave = { ...entry, stored: !!local?.stored, remoteAudio: !!audio };
    }
    const list = get(listKey(kind), [], owner).filter(x => x.id !== id);
    if (entryToSave) list.unshift(entryToSave);
    set(listKey(kind), list, owner);
    updateJournal(owner, idKey, item?.revision, { revision: ver, deleted, dirty: false });
    PD.bus.emit('studio-library', { kind, id, deleted });
  }
  async function push(owner, idKey, item) {
    const [kind, id] = idKey.split(':');
    const local = present(kind, id, owner);
    if (!item.deleted && (!local || recorded(local))) {
      updateJournal(owner, idKey, item.revision, { ...item, dirty: false });
      return;
    }
    let payload = item.deleted ? null : local;
    let blob;
    if (!item.deleted && kind === 'song') {
      const { stored, remoteAudio, ...entry } = local;
      if (stored && entry.size <= maxAudio) blob = await PD.blobs.get('ai.song.' + id);
      const data = await Promise.all(assetTypes.map(type => PD.blobs.get('ai.' + type + '.' + id)));
      payload = { entry, audio: !!(blob || remoteAudio) };
      assetTypes.forEach((type, i) => { payload[type] = data[i] ?? null; });
    }
    if (uid() !== owner || values(owner)[idKey]?.revision !== item.revision) return;
    const accepted = await C.studio.put(owner, { studio_kind: kind, studio_id: id, studio_revision: item.revision, studio_payload: payload });
    if (uid() !== owner) return;
    if (!accepted) {
      // A later revision or a deletion is already on the server. Pull it below.
      updateJournal(owner, idKey, item.revision, { ...item, revision: '', dirty: false, deleted: false });
      return;
    }
    if (kind === 'song' && item.deleted) {
      await C.storage.remove([path(owner, id)], bucket);
    } else if (blob && !local.remoteAudio && values(owner)[idKey]?.revision === item.revision) {
      await C.storage.upload(path(owner, id), blob, null, bucket).catch(e => {
        if (!(e.code === 'Duplicate' || e.code === '409' || /already exists|duplicate/i.test(e.message))) throw e;
      });
      if (uid() !== owner) return;
      const current = get(songs, [], owner);
      if (current.some(x => x.id === id)) {
        set(songs, current.map(x => x.id === id ? { ...x, remoteAudio: true } : x), owner);
        PD.bus.emit('studio-library', { kind, id, deleted: false });
      }
    }
    updateJournal(owner, idKey, item.revision, { ...item, dirty: false });
  }
  async function run(owner) {
    discover(owner);
    let failed = false;
    for (const [idKey, item] of Object.entries(values(owner))) {
      if (uid() !== owner) return;
      if (item.dirty) try { await push(owner, idKey, item); } catch (_) { failed = true; }
    }
    for (let offset = 0; uid() === owner; offset += 50) {
      const rows = await C.studio.list(owner, offset);
      for (const row of rows) await pull(row, owner);
      if (rows.length < 50) break;
    }
    if (uid() === owner) status(failed ? 'error' : 'ready');
  }
  function sync() {
    clearTimeout(timer);
    const owner = uid();
    if (owner === 'guest' || !C.configured) { status('local'); return Promise.resolve(); }
    if (!navigator.onLine) { status('offline'); return Promise.resolve(); }
    if (inFlight) { again = true; return inFlight; }
    status('busy');
    inFlight = run(owner).catch(() => { if (uid() === owner) status(navigator.onLine ? 'error' : 'offline'); })
      .finally(() => { inFlight = null; if (again) { again = false; later(150); } });
    return inFlight;
  }
  async function audio(r) {
    const localKey = 'ai.song.' + r.id, owner = uid(), blob = await PD.blobs.get(localKey);
    if (uid() !== owner || !present('song', r.id, owner)) return null;
    if (blob || !r.remoteAudio || owner === 'guest' || !navigator.onLine) return blob;
    if (values(owner)[tag('song', r.id)]?.deleted) return null;
    const downloaded = await C.storage.read(path(owner, r.id), bucket);
    if (uid() !== owner || !present('song', r.id, owner)) return null;
    if (await PD.blobs.put(localKey, downloaded) != null) {
      const list = get(songs, [], owner);
      set(songs, list.map(x => x.id === r.id ? { ...x, stored: true } : x), owner);
    }
    return downloaded;
  }
  let current = 'guest';
  const changeAccount = () => {
    const owner = uid();
    claimLegacy(owner);
    if (owner === current) return;
    current = owner; status('local'); PD.bus.emit('studio-account');
    later(100);
  };
  PD.bus.on('cloud', changeAccount);
  PD.bus.on('ready', () => { changeAccount(); later(100); });
  window.addEventListener('online', sync);
  window.addEventListener('offline', () => status(uid() === 'guest' ? 'local' : 'offline'));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) later(100); });
  function eraseAccount(owner) {
    if (!owner) return;
    const stored = new Set(get(songs, [], owner).map(row => row.id));
    Object.keys(values(owner)).filter(k => k.startsWith('song:')).forEach(k => stored.add(k.slice(5)));
    for (const id of stored) for (const type of ['song', ...assetTypes]) PD.blobs.del('ai.' + type + '.' + id);
    for (const row of get(arrangements, [], owner)) del(projectKey(row.id), owner);
    for (const k of [songs, arrangements, J, 'pst.last']) del(k, owner);
    if (base.get(legacy) === owner) base.del(legacy);
  }
  const isLibraryKey = k => /^(ai\.recent$|pst\.(list$|last$|p\.))/.test(k);
  function exportLocal() {
    const out = {};
    for (const k of [songs, arrangements, 'pst.last', ...get(arrangements, []).map(row => projectKey(row.id))]) {
      const value = get(k);
      if (value !== undefined) out[k] = value;
    }
    return out;
  }
  function importLocal(k, value) {
    if (k === 'pst.last') return;
    if (k === songs || k === arrangements) {
      if (!Array.isArray(value)) return;
      const current = get(k, []), have = new Set(current.map(row => row.id));
      const additions = value.filter(row => validId(row?.id) && !have.has(row.id) && !values(uid())[tag(k === songs ? 'song' : 'arrangement', row.id)]?.deleted);
      store.set(k, [...current, ...additions]);
      return;
    }
    const id = k.slice(6);
    if (!validId(id) || get(k) || values(uid())[tag('arrangement', id)]?.deleted) return;
    try { const project = PD.pstCore.parse(value); if (project.id === id) store.set(k, project); } catch (_) {}
  }
  return { store, sync, audio, recorded, maxAudio, eraseAccount, isLibraryKey, exportLocal, importLocal, get status() { return state; },
    songChanged: id => { const r = present('song', id, uid()); if (r && !recorded(r)) mark('song', id); } };
})();
