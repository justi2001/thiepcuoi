const fs = require('fs');

const sections = JSON.parse(fs.readFileSync('mobile_sections_clean.json', 'utf8'));

sections.forEach((sec, i) => {
  console.log(`\n================== SECTION ${i+1}: ${sec.id} ==================`);
  console.log('Props:', {
    height: sec.props?.height,
    bg: sec.props?.backgroundColor,
    bgImg: sec.props?.backgroundImage,
    padding: sec.props?.padding
  });
  
  function printChildren(children, prefix = '  ') {
    if (!children) return;
    children.forEach((c, ci) => {
      console.log(`${prefix}#${ci+1} [${c.type}] id=${c.id}`);
      if (c.props) {
        const p = c.props;
        const info = {};
        ['text', 'src', 'title', 'url', 'left', 'top', 'width', 'height', 'fontSize', 'fontFamily', 'color', 'textAlign', 'backgroundColor', 'borderRadius'].forEach(k => {
          if (p[k] !== undefined) info[k] = p[k];
        });
        console.log(`${prefix}   props:`, JSON.stringify(info));
      }
      if (c.children && c.children.length) {
        printChildren(c.children, prefix + '    ');
      }
    });
  }
  
  printChildren(sec.children);
});
