// Dependency-free static build: publish only browser assets.
const fs = require('node:fs');
const path = require('node:path');
const output = path.join(__dirname, 'dist');
fs.mkdirSync(output, { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'emergency.js']) {
  fs.copyFileSync(path.join(__dirname, file), path.join(output, file));
}
console.log('Built CrisisConnect static website in dist/');
