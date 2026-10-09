const fs = require('fs');

const d = JSON.parse(fs.readFileSync('bustle_71_vip.json', 'utf8')).data;
console.log('Template keys:', Object.keys(d.template));
console.log('Content keys:', Object.keys(d.content));

fs.writeFileSync('template_info.json', JSON.stringify(d.template, null, 2));
fs.writeFileSync('content_info.json', JSON.stringify(d.content, null, 2));

console.log('Template name:', d.template.name);
console.log('Template tier:', d.template.tier);
console.log('Audio settings:', d.content.audioSettings);
console.log('Theme:', d.content.theme);
console.log('SEO:', d.content.seoSettings);
console.log('Opening effect:', d.content.openingEffect);
console.log('Effects:', d.content.effects);
console.log('Custom effects:', d.content.customEffects);
console.log('Content root keys:', Object.keys(d.content));
