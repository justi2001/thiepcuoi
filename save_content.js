const fs = require('fs');

const d = JSON.parse(fs.readFileSync('bustle_71_vip.json', 'utf8')).data;
console.log('Mobile keys:', Object.keys(d.content.mobile || {}));
console.log('Desktop keys:', Object.keys(d.content.desktop || {}));

fs.writeFileSync('mobile_full.json', JSON.stringify(d.content.mobile, null, 2));
fs.writeFileSync('desktop_full.json', JSON.stringify(d.content.desktop, null, 2));

console.log('Saved mobile_full.json and desktop_full.json');
