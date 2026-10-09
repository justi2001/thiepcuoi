const fs = require('fs');

const sections = JSON.parse(fs.readFileSync('mobile_sections_clean.json', 'utf8'));

let out = '';
sections.forEach((sec, i) => {
  out += `\n================== SECTION ${i+1}: ${sec.id} (${sec.type}) ==================\n`;
  out += 'Props: ' + JSON.stringify({ height: sec.props?.height, bg: sec.props?.backgroundColor, bgImg: sec.props?.backgroundImage }) + '\n';
  function printChildren(children, prefix = '  ') {
    if (!children) return;
    children.forEach((c, ci) => {
      out += `${prefix}#${ci+1} [${c.type}] id=${c.id}\n`;
      if (c.props) {
        const p = c.props;
        const info = {};
        ['text', 'src', 'title', 'url', 'left', 'top', 'width', 'height', 'fontSize', 'fontFamily', 'color', 'textAlign', 'backgroundColor', 'borderRadius', 'display', 'flexDirection', 'justifyContent', 'alignItems', 'gap', 'zIndex'].forEach(k => {
          if (p[k] !== undefined) info[k] = p[k];
        });
        out += `${prefix}   props: ` + JSON.stringify(info) + '\n';
      }
      if (c.children && c.children.length) {
        printChildren(c.children, prefix + '    ');
      }
    });
  }
  printChildren(sec.children);
});

fs.writeFileSync('section_structure_utf8.txt', out, 'utf8');
console.log('Saved section_structure_utf8.txt, size:', out.length);
