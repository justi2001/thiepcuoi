const fs = require('fs');

const filePath = 'C:\\Users\\Asus TUF\\.gemini\\antigravity-ide\\brain\\46509f1d-ce13-4419-b24f-28fa4d52d696\\.system_generated\\steps\\116\\content.md';
const content = fs.readFileSync(filePath, 'utf8');

// Regex for data-id="<ID>" ... data-tooltip="<filename> Image"
const regex = /data-id="([a-zA-Z0-9_-]+)"[^>]*data-tooltip="([^"]+)\s+Image"/g;
const photos = [];
let match;

while ((match = regex.exec(content)) !== null) {
  const fileId = match[1];
  const fileName = match[2].trim();
  if (fileName.toLowerCase().endsWith('.jpg') || fileName.toLowerCase().endsWith('.png') || fileName.toLowerCase().endsWith('.webp')) {
    photos.push({ id: fileId, name: fileName });
  }
}

// Remove duplicates
const unique = [];
const seen = new Set();
for (const p of photos) {
  if (!seen.has(p.name)) {
    seen.add(p.name);
    unique.push(p);
  }
}

console.log(`Found ${unique.length} unique photos!`);
unique.forEach((p, i) => {
  console.log(`${i + 1}. ${p.name} -> ID: ${p.id}`);
});

fs.writeFileSync('extracted_drive_photos.json', JSON.stringify(unique, null, 2));
