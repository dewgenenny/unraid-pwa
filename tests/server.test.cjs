const http = require('http');
const assert = require('assert');

(async () => {
  const { createApp } = await import('../server/index.js');

  // create dummy upstream Unraid server
  const upstream = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { query } = JSON.parse(body);
      if (query.includes('csrfToken')) {
        res.setHeader('Set-Cookie', 'csrf=dummy');
        res.end(JSON.stringify({ data: { csrfToken: 'dummy' } }));
      } else if (req.headers.cookie === 'csrf=dummy' && req.headers['x-csrf-token'] === 'dummy') {
        res.end(JSON.stringify({ data: { ok: true } }));
      } else {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: 'Invalid CSRF token' }));
      }
    });
  });

  await new Promise(resolve => upstream.listen(0, resolve));
  const upstreamPort = upstream.address().port;
  process.env.UNRAID_HOST = `http://localhost:${upstreamPort}`;

  const app = createApp();
  const server = app.listen(0, async () => {
    const port = server.address().port;
    try {
      const res = await fetch(`http://localhost:${port}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{vars}' })
      });
      const data = await res.json();
      assert.deepStrictEqual(data, { data: { ok: true } });
      module.exports = true;
    } catch (err) {
      console.error(err);
      module.exports = false;
    } finally {
      server.close();
      upstream.close();
    }
  });
})();
