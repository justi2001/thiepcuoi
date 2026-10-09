const fs = require('fs');

const sections = JSON.parse(fs.readFileSync('mobile_sections_clean.json', 'utf8'));

sections.forEach(s => {
  console.log(`\n======================================================`);
  console.log(`SECTION ${s.index} (id: ${s.id}, type: ${s.type})`);
  console.log(`PROPS:`, JSON.stringify(s.props, null, 2));
  console.log(`CHILDREN COUNT:`, s.children ? s.children.length : 0);
  if (s.children) {
    s.children.forEach((c, idx) => {
      console.log(`  [Child ${idx+1}] type: ${c.type}, id: ${c.id}`);
      console.log(`    props:`, JSON.stringify(c.props, null, 2));
      if (c.children && c.children.length > 0) {
        c.children.forEach((sub, subIdx) => {
          console.log(`      [Sub ${subIdx+1}] type: ${sub.type}, id: ${sub.id}`);
          console.log(`        props:`, JSON.stringify(sub.props, null, 2));
        });
      }
    });
  }
});
