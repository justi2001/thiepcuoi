const fs = require('fs');

const d = JSON.parse(fs.readFileSync('bustle_71_vip.json', 'utf8'));
console.log('Top level keys:', Object.keys(d));
if (d.data) {
  console.log('Data keys:', Object.keys(d.data));
  const data = d.data;
  console.log('Name:', data.name);
  console.log('Tier:', data.tier);
  console.log('Theme:', data.theme);
  console.log('Audio settings:', data.audioSettings);
  console.log('SEO settings:', data.seoSettings);
  console.log('Opening effect:', data.openingEffect);
  console.log('Custom effects:', data.customEffects);
  console.log('Viewport settings:', data.viewportSettings);
  if (data.pageContent) {
    console.log('pageContent type:', typeof data.pageContent);
    if (typeof data.pageContent === 'string') {
      try {
        const parsed = JSON.parse(data.pageContent);
        console.log('pageContent is JSON string! Top keys:', Object.keys(parsed));
        fs.writeFileSync('parsed_page_content.json', JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.log('pageContent string length:', data.pageContent.length);
      }
    } else {
      console.log('pageContent keys:', Object.keys(data.pageContent));
      fs.writeFileSync('parsed_page_content.json', JSON.stringify(data.pageContent, null, 2));
    }
  }
}
