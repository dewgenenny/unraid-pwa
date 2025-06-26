const assert = require('assert');
const path = require('path');
(async () => {
  const { default: express, staticMiddleware } = await import('../server/micro-express.js');
  const app = express();
  app.use(staticMiddleware(path.join(__dirname, '../src')));
  const server = app.listen(0, async () => {
    const port = server.address().port;
    try {
      const res = await fetch(`http://localhost:${port}/main.js`);
      const text = await res.text();
      const fs = require('fs');
      const original = fs.readFileSync(path.join(__dirname, '../src/main.js'), 'utf8');
      assert.strictEqual(res.headers.get('content-type'), 'text/javascript');
      assert.ok(text.includes('fetchUnraidData'), 'served file should contain script content');
      assert.strictEqual(text.trim(), original.trim());
      module.exports = true;
    } catch (err) {
      console.error(err);
      module.exports = false;
    } finally {
      server.close();
    }
  });
})();
