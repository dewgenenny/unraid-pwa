const fs = require('fs');
const path = require('path');

let failed = false;

// run each test file
fs.readdirSync(__dirname)
  .filter(f => f.endsWith('.test.js'))
  .forEach(file => {
    const result = require(path.join(__dirname, file));
    if (result === false) {
      console.error(`Test failed: ${file}`);
      failed = true;
    } else {
      console.log(`Test passed: ${file}`);
    }
  });

if (failed) {
  console.error('Tests failed');
  process.exit(1);
} else {
  console.log('All tests passed');
}
