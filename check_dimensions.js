const fs = require('fs');
const path = require('path');

function getJpegDimensions(buffer) {
  let i = 2;
  while (i < buffer.length - 8) {
    if (buffer[i] === 0xFF) {
      const marker = buffer[i + 1];
      if (marker === 0xC0 || marker === 0xC2) { // SOF0, SOF2
        const height = buffer.readUInt16BE(i + 5);
        const width = buffer.readUInt16BE(i + 7);
        return { width, height };
      }
      i += 2 + buffer.readUInt16BE(i + 2);
    } else {
      i++;
    }
  }
  return null;
}

const dir = path.join(__dirname, 'images', 'wedding');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg'));

const info = files.map(file => {
  const buf = fs.readFileSync(path.join(dir, file));
  const dim = getJpegDimensions(buf) || { width: 0, height: 0 };
  const isLandscape = dim.width > dim.height;
  const ratio = (dim.width / (dim.height || 1)).toFixed(2);
  return { file, width: dim.width, height: dim.height, isLandscape, ratio };
});

console.log('=== LANDSCAPE PHOTOS ===');
info.filter(i => i.isLandscape).forEach(i => console.log(`${i.file}: ${i.width}x${i.height} (ratio ${i.ratio})`));

console.log('\n=== PORTRAIT PHOTOS ===');
info.filter(i => !i.isLandscape).forEach(i => console.log(`${i.file}: ${i.width}x${i.height} (ratio ${i.ratio})`));
