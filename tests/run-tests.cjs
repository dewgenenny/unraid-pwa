const fs = require('fs');
const path = require('path');

let failed = false;

// run each test file
fs.readdirSync(__dirname)
  // only execute files following the .test.cjs naming pattern
  .filter(f => f.endsWith('.test.cjs'))
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
