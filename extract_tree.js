const fs = require('fs');

const mobile = JSON.parse(fs.readFileSync('mobile_full.json', 'utf8'));

function extractNodeSummary(node, depth = 0) {
  const indent = '  '.repeat(depth);
  let summary = [];
  const type = node.type || 'Unknown';
  const custom = node.custom || {};
  const props = node.props || {};

  let text = '';
  if (props.text) text = `text: "${props.text.slice(0, 50)}"`;
  if (props.src) text = `src: "${props.src.slice(0, 60)}"`;
  if (props.url) text = `url: "${props.url.slice(0, 60)}"`;
  if (props.title) text = `title: "${props.title}"`;

  summary.push(`${indent}- [${type}] (id: ${node.id || 'no-id'}) ${custom.name ? `[name: ${custom.name}]` : ''} ${text}`);

  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      summary = summary.concat(extractNodeSummary(child, depth + 1));
    }
  }
  return summary;
}

const report = [];
mobile.sections.forEach((sec, idx) => {
  report.push(`\n==================== SECTION ${idx + 1}: ${sec.custom?.name || sec.id} (${sec.type}) ====================`);
  report.push(`Props: ${JSON.stringify({
    background: sec.props?.backgroundColor,
    bgImage: sec.props?.backgroundImage,
    padding: sec.props?.padding,
    margin: sec.props?.margin,
    height: sec.props?.height,
    width: sec.props?.width
  })}`);
  report.push(...extractNodeSummary(sec, 1));
});

fs.writeFileSync('sections_detailed_tree.txt', report.join('\n'), 'utf8');
console.log('Tree report saved to sections_detailed_tree.txt, lines:', report.length);

// Also dump all unique image URLs and texts across all sections
const allImages = [];
const allTexts = [];
function collectAssets(node) {
  if (node.props) {
    if (node.props.src) allImages.push(node.props.src);
    if (node.props.backgroundImage) allImages.push(node.props.backgroundImage);
    if (node.props.text) allTexts.push(node.props.text);
    if (node.props.title) allTexts.push(node.props.title);
    if (node.props.content) allTexts.push(node.props.content);
  }
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach(collectAssets);
  }
}
mobile.sections.forEach(collectAssets);
fs.writeFileSync('all_images.json', JSON.stringify([...new Set(allImages)], null, 2));
fs.writeFileSync('all_texts.json', JSON.stringify([...new Set(allTexts)], null, 2));
console.log('Unique images:', allImages.length, 'Unique texts:', allTexts.length);
