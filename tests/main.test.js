const assert = require('assert');
const { fetchUnraidData } = require('../src/main.js');

async function dummyFetch() {
  return { json: async () => ({ ok: true }) };
}

(async () => {
  try {
    assert.strictEqual(typeof fetchUnraidData, 'function', 'fetchUnraidData should be a function');
    const result = fetchUnraidData('query { version }', dummyFetch);
    assert.ok(result instanceof Promise, 'fetchUnraidData should return a Promise');
    const data = await result;
    assert.deepStrictEqual(data, { ok: true });
    module.exports = true;
  } catch (err) {
    console.error(err);
    module.exports = false;
  }
})();
