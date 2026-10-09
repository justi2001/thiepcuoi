const fs = require('fs');

const sections = JSON.parse(fs.readFileSync('mobile_sections_clean.json', 'utf8'));

// Find RSVPForm, WishForm, WishList, Video, QuickActions, AlbumModal
sections.forEach(sec => {
  function search(node) {
    if (!node) return;
    const type = node.type;
    if (['RSVPForm', 'WishForm', 'WishList', 'Video', 'QuickActions', 'AlbumModal', 'Calendar', 'Count'].includes(type)) {
      console.log(`\n=== TYPE: ${type} (id: ${node.id}) ===`);
      console.log(JSON.stringify(node.props, null, 2));
    }
    if (node.children) node.children.forEach(search);
  }
  search(sec);
});
