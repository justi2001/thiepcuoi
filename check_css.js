const fs = require('fs');

const html = fs.readFileSync('page.html', 'utf8');
// Check viewport settings and max-width in CSS
const cssFiles = [...html.matchAll(/href="(\/_next\/static\/css\/[^"]+|\/_next\/static\/chunks\/[^"]+\.css[^"]*)"/g)].map(m => m[1]);
console.log('CSS files:', cssFiles);

// Check if there is body / wrapper styles in page.html
const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]);
console.log('Styles count:', styles.length);
styles.forEach(s => {
  if (s.includes('max-width') || s.includes('400px') || s.includes('960px') || s.includes('viewport')) {
    console.log('Found responsive css in style tag:', s.slice(0, 500));
  }
});
