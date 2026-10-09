const fs = require('fs');

const mobileSections = JSON.parse(fs.readFileSync('mobile_sections_clean.json', 'utf8'));

// Check positioning of children in each section
mobileSections.forEach(sec => {
  console.log(`\n--- Section ${sec.index}: id=${sec.id} type=${sec.type} bg=${sec.props?.backgroundColor || sec.props?.backgroundImage} height=${sec.props?.height} ---`);
  if (sec.children) {
    sec.children.forEach(c => {
      const p = c.props || {};
      const pos = {
        type: c.type,
        id: c.id,
        left: p.left || p.x,
        top: p.top || p.y,
        width: p.width,
        height: p.height,
        position: p.position,
        text: p.text ? p.text.slice(0, 30) : undefined,
        src: p.src ? p.src.split('/').pop() : undefined,
        fontSize: p.fontSize,
        fontFamily: p.fontFamily,
        color: p.color || p.textColor
      };
      console.log('  Child:', JSON.stringify(pos));
    });
  }
});
