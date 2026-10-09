const fs = require('fs');
const secs = JSON.parse(fs.readFileSync('mobile_sections_clean.json', 'utf8'));
secs.forEach((s, i) => {
  console.log(`Sec ${i+1}: id=${s.id} bg=${s.props?.background || s.props?.backgroundColor || s.props?.bgImage || 'none'} h=${s.props?.height}`);
});
