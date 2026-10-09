const fs = require('fs');

const filePath = 'C:\\Users\\Asus TUF\\.gemini\\antigravity-ide\\brain\\46509f1d-ce13-4419-b24f-28fa4d52d696\\.system_generated\\steps\\116\\content.md';
const content = fs.readFileSync(filePath, 'utf8');

// Find all matches of drive file IDs
const idMatches = [...content.matchAll(/https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/g)].map(m => m[1]);
console.log('Drive file IDs count:', idMatches.length);

// Search for drive item titles, filenames (.jpg, .jpeg, .png, .webp)
const fileNames = [...content.matchAll(/([a-zA-Z0-9_ -]+\.(?:jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP))/g)].map(m => m[1]);
console.log('Filenames found:', new Set(fileNames));

// Search for googleusercontent URLs
const usercontent = [...content.matchAll(/https:\/\/[a-zA-Z0-9._-]+\.googleusercontent\.com\/[^\s\"\'<>]+/g)].map(m => m[0]);
console.log('Googleusercontent URLs count:', usercontent.length);

// Look for data-id or jsdata or JSON chunks
const jsonMatches = [...content.matchAll(/\[\"([a-zA-Z0-9_-]{25,})\",\[\"([^\"]+\.(?:jpg|jpeg|png|webp|JPG|PNG))\"/g)];
console.log('JSON pairs:', jsonMatches.map(m => ({ id: m[1], name: m[2] })));

// Let's dump all occurrences of .jpg, .png or long IDs
const longIds = new Set([...content.matchAll(/"([a-zA-Z0-9_-]{28,35})"/g)].map(m => m[1]));
console.log('Potential file IDs count:', longIds.size);
fs.writeFileSync('drive_dump.json', JSON.stringify({
  filenames: [...new Set(fileNames)],
  fileIds: idMatches,
  jsonPairs: jsonMatches.map(m => ({ id: m[1], name: m[2] })),
  potentialIds: [...longIds].slice(0, 50)
}, null, 2));
