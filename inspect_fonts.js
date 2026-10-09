const fs = require('fs');

const d = JSON.parse(fs.readFileSync('bustle_71_vip.json', 'utf8')).data.template;
console.log('fontMap:', d.fontMap);
console.log('theme:', d.theme);
