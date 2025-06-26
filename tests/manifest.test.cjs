const assert = require('assert');
const manifest = require('../src/manifest.json');

try {
  assert.strictEqual(manifest.name, 'Unraid PWA');
  assert.ok(manifest.start_url, 'start_url is required');
  assert.ok(manifest.display, 'display is required');
  module.exports = true;
} catch (err) {
  console.error(err);
  module.exports = false;
}
