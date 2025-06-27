const assert = require('assert');

(async () => {
  const calls = [];
  async function fakeFetch(url, opts) {
    calls.push(opts);
    return {
      headers: { get: () => null },
      json: async () => ({ data: { csrfToken: 'x' } }),
      text: async () => JSON.stringify({ data: { ok: true } }),
      status: 200
    };
  }
  const { createApp } = await import('../server/index.js');
  process.env.UNRAID_HOST = 'https://host';
  process.env.ALLOW_SELF_SIGNED = 'true';
  const app = createApp(fakeFetch);
  const server = app.listen(0, async () => {
    const port = server.address().port;
    await fetch(`http://localhost:${port}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{vars}' })
    });
    try {
      assert(calls[0].agent, 'agent should be provided for self-signed');
      assert.strictEqual(calls[0].agent.options.rejectUnauthorized, false);
      assert.strictEqual(process.env.NODE_TLS_REJECT_UNAUTHORIZED, '0');
      module.exports = true;
    } catch (err) {
      console.error(err);
      module.exports = false;
    } finally {
      server.close();
    }
  });
})();

