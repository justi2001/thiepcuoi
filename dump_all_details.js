const fs = require('fs');

const mobile = JSON.parse(fs.readFileSync('mobile_full.json', 'utf8'));
const desktop = JSON.parse(fs.readFileSync('desktop_full.json', 'utf8'));
const template = JSON.parse(fs.readFileSync('bustle_71_vip.json', 'utf8')).data.template;

// 1. Audio and Opening and Effects
const config = {
  audio: template.audioSettings,
  opening: template.openingEffect,
  effects: template.effects,
  customEffects: template.customEffects,
  seo: template.seoSettings,
  pageSettings: template.pageSettings
};
fs.writeFileSync('config_dump.json', JSON.stringify(config, null, 2));

// 2. Extract detailed sections
function dumpSections(sections, filename) {
  const result = sections.map((sec, i) => {
    return {
      index: i + 1,
      id: sec.id,
      type: sec.type,
      props: sec.props,
      custom: sec.custom,
      children: sec.children
    };
  });
  fs.writeFileSync(filename, JSON.stringify(result, null, 2));
}

dumpSections(mobile.sections, 'mobile_sections_clean.json');
dumpSections(desktop.sections, 'desktop_sections_clean.json');

console.log('Saved config_dump.json, mobile_sections_clean.json, desktop_sections_clean.json');
