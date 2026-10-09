const fs = require('fs');

const filePath = 'C:\\Users\\Asus TUF\\.gemini\\antigravity-ide\\brain\\46509f1d-ce13-4419-b24f-28fa4d52d696\\.system_generated\\steps\\116\\content.md';
const content = fs.readFileSync(filePath, 'utf8');

const sampleFiles = ['PQD06107.jpg', 'PQD06286.jpg', 'PQD06342.jpg'];

sampleFiles.forEach(fn => {
  let idx = content.indexOf(fn);
  while (idx !== -1) {
    console.log(`\n=== Found ${fn} at ${idx} ===`);
    const start = Math.max(0, idx - 250);
    const end = Math.min(content.length, idx + 250);
    console.log(content.slice(start, end));
    idx = content.indexOf(fn, idx + fn.length);
  }
});
