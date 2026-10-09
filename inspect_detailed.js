const fs = require('fs');
const mobile = JSON.parse(fs.readFileSync('mobile_sections_clean.json', 'utf8'));

mobile.forEach((sec, idx) => {
  console.log(`\n=================== SECTION ${idx+1}: ${sec.id} (${sec.type}) ===================`);
  console.log('Props:', JSON.stringify({
    bg: sec.props?.backgroundColor || sec.props?.background,
    bgImg: sec.props?.backgroundImage || sec.props?.bgImage,
    height: sec.props?.height,
    width: sec.props?.width
  }));
  
  function dump(node, depth = 0) {
    const indent = '  '.repeat(depth);
    const p = node.props || {};
    let info = `[${node.type}] (id: ${node.id})`;
    if (p.text) info += ` text: "${p.text.replace(/\n/g, ' ').slice(0, 40)}"`;
    if (p.src) info += ` src: "${p.src.split('/').pop()}"`;
    if (p.fontFamily) info += ` font: "${p.fontFamily}"`;
    if (p.fontSize) info += ` size: "${p.fontSize}"`;
    if (p.color || p.textColor) info += ` color: "${p.color || p.textColor}"`;
    if (p.width || p.height) info += ` dim: ${p.width}x${p.height}`;
    if (p.left !== undefined || p.top !== undefined) info += ` pos: (${p.left}, ${p.top})`;
    console.log(indent + info);
    if (node.children) node.children.forEach(c => dump(c, depth + 1));
  }
  
  if (sec.children) sec.children.forEach(c => dump(c, 1));
});
