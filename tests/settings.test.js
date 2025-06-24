const assert = require('assert');
const { fetchUnraidData, setSettings } = require('../src/main.js');

// minimal localStorage mock
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key]; },
  setItem(key, val) { this.store[key] = val; }
};

(async () => {
  let captured;
  async function dummyFetch(url, options) {
    captured = { url, options };
    return { json: async () => ({ ok: true }) };
  }

  setSettings({ host: 'http://host', token: 'secret', allowSelfSigned: true });
  const data = await fetchUnraidData('query { vars { version } }', dummyFetch);

  try {
    assert.deepStrictEqual(data, { ok: true });
    assert.strictEqual(captured.url, 'http://host/graphql');
    assert.strictEqual(captured.options.headers['Authorization'], 'Bearer secret');
    assert.ok(captured.options.agent, 'agent should be passed when self-signed allowed');
    assert.strictEqual(captured.options.agent.options.rejectUnauthorized, false);
    module.exports = true;
  } catch (err) {
    console.error(err);
    module.exports = false;
  }
})();
