const fs = require('fs');

const mobile = JSON.parse(fs.readFileSync('mobile_full.json', 'utf8'));

console.log('Schema version:', mobile.schemaVersion);
console.log('Root node:', JSON.stringify(mobile.root, null, 2).slice(0, 500));
console.log('Sections count:', mobile.sections ? mobile.sections.length : 0);

if (mobile.sections) {
  mobile.sections.forEach((sec, idx) => {
    console.log(`\n=== SECTION ${idx + 1}: ${sec.name || sec.id || sec.type} ===`);
    console.log('Section keys:', Object.keys(sec));
    if (sec.type) console.log('Type:', sec.type);
    if (sec.title) console.log('Title:', sec.title);
    if (sec.settings) console.log('Settings:', JSON.stringify(sec.settings, null, 2).slice(0, 300));
  });
}
