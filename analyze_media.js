const fs = require('fs');

const mobile = JSON.parse(fs.readFileSync('mobile_sections_clean.json', 'utf8'));
const desktop = JSON.parse(fs.readFileSync('desktop_sections_clean.json', 'utf8'));

console.log('Mobile sections count:', mobile.length);
console.log('Desktop sections count:', desktop.length);

// Compare section IDs
const mIds = mobile.map(s => s.id);
const dIds = desktop.map(s => s.id);
console.log('Shared IDs:', mIds.filter(id => dIds.includes(id)).length);

// List all image URLs
const images = new Set();
function findImages(obj) {
  if (!obj) return;
  if (typeof obj === 'string') {
    if (obj.match(/https?:\/\/[^\s"'<>]+\.(webp|png|jpg|jpeg|gif|svg|mp4|mov|mp3)/i)) {
      images.add(obj);
    }
  } else if (typeof obj === 'object') {
    for (const k in obj) {
      findImages(obj[k]);
    }
  }
}
findImages(mobile);
findImages(desktop);
findImages(JSON.parse(fs.readFileSync('bustle_71_vip.json', 'utf8')));

console.log('Total media files found:', images.size);
fs.writeFileSync('all_media_list.json', JSON.stringify([...images], null, 2));
