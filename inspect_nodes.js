const fs = require('fs');

const d = JSON.parse(fs.readFileSync('bustle_71_vip.json', 'utf8')).data;
console.log('--- TEMPLATE METADATA ---');
console.log('Audio settings:', JSON.stringify(d.template.audioSettings, null, 2));
console.log('Theme:', JSON.stringify(d.template.theme, null, 2));
console.log('Opening effect:', JSON.stringify(d.template.openingEffect, null, 2));
console.log('Effects:', JSON.stringify(d.template.effects, null, 2));
console.log('Custom effects:', JSON.stringify(d.template.customEffects, null, 2));
console.log('SEO settings:', JSON.stringify(d.template.seoSettings, null, 2));
console.log('Page settings:', JSON.stringify(d.template.pageSettings, null, 2));

console.log('--- CONTENT INSPECTION ---');
console.log('Desktop length:', typeof d.content.desktop, d.content.desktop ? d.content.desktop.length : 0);
console.log('Mobile length:', typeof d.content.mobile, d.content.mobile ? d.content.mobile.length : 0);

// Let's parse mobile content if it's Craft.js or serialized React tree or JSON
if (typeof d.content.mobile === 'string') {
  try {
    const parsedMobile = JSON.parse(d.content.mobile);
    console.log('Mobile is JSON! Node count:', Object.keys(parsedMobile).length);
    fs.writeFileSync('mobile_nodes.json', JSON.stringify(parsedMobile, null, 2));
    
    // List component names
    const nodeTypes = Object.values(parsedMobile).map(n => n.type && (n.type.resolvedName || n.type.name || n.type));
    console.log('Distinct node types:', [...new Set(nodeTypes)]);
  } catch (e) {
    console.log('Mobile is not JSON:', d.content.mobile.slice(0, 300));
  }
}
if (typeof d.content.desktop === 'string') {
  try {
    const parsedDesktop = JSON.parse(d.content.desktop);
    console.log('Desktop is JSON! Node count:', Object.keys(parsedDesktop).length);
    fs.writeFileSync('desktop_nodes.json', JSON.stringify(parsedDesktop, null, 2));
  } catch (e) {
    console.log('Desktop is not JSON');
  }
}
