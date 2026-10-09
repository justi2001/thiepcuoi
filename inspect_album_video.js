const fs = require('fs');

const sections = JSON.parse(fs.readFileSync('mobile_sections_clean.json', 'utf8'));

sections.forEach(sec => {
  function search(node) {
    if (!node) return;
    if (node.id === 'KrHiKo5NAv' || node.type === 'Video' || node.type === 'RSVPForm' || node.type === 'WishList' || node.type === 'WishForm') {
      console.log(`\n=== TYPE: ${node.type} (id: ${node.id}) ===`);
      console.log(JSON.stringify(node.props, null, 2));
    }
    if (node.children) node.children.forEach(search);
  }
  search(sec);
});
