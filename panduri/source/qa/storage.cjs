const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

// Exercise the real persistence module with storage failures, without booting the UI.
const source = fs.readFileSync(require('node:path').join(__dirname, '../src/core.js'), 'utf8').split('/** author mode:')[0];
function setup(blocked = false) {
  const data = new Map();
  const storage = {
    blocked, removeBlocked: false,
    get length() { return data.size; }, key: i => [...data.keys()][i],
    getItem: k => data.get(k) ?? null,
    setItem(k, v) { if (this.blocked) throw new Error('quota'); data.set(k, v); },
    removeItem(k) { if (this.removeBlocked) throw new Error('denied'); data.delete(k); }
  };
  const context = { window: {}, localStorage: storage };
  vm.runInNewContext(source, context);
  return { store: context.window.PD.store, storage, data };
}

test('quota failures preserve new and updated values in reads, keys and backups', () => {
  const { store, storage } = setup();
  store.set('progress', 1);
  storage.blocked = true;
  store.set('progress', 2); store.set('lesson', 7); store.set('cloud.session', 'private');
  assert.equal(store.get('progress'), 2);
  assert.equal(store.get('lesson'), 7);
  assert.deepEqual(Array.from(store.keys()).sort(), ['cloud.session', 'lesson', 'progress']);
  assert.equal(JSON.stringify(store.exportAll()), '{"progress":2,"lesson":7}');
  storage.blocked = false;
  store.set('progress', 3);
  assert.equal(store.get('progress'), 3, 'successful writes replace the temporary value');
  store.del('lesson');
  assert.equal(store.get('lesson', 'missing'), 'missing');
});

test('storage unavailable at startup still supports memory keys and export', () => {
  const { store } = setup(true);
  store.set('lesson', 7);
  assert.equal(store.get('lesson'), 7);
  assert.deepEqual(Array.from(store.keys()), ['lesson']);
  assert.equal(JSON.stringify(store.exportAll()), '{"lesson":7}');
  store.del('lesson');
  assert.equal(store.keys().length, 0);
});

test('a failed deletion cannot resurrect the stale stored value', () => {
  const { store, storage } = setup();
  store.set('progress', 1);
  storage.removeBlocked = true;
  store.del('progress');
  assert.equal(store.get('progress', 'missing'), 'missing');
  assert.equal(store.keys().length, 0);
  store.set('progress', 2);
  assert.equal(store.get('progress'), 2);
});
