const fs = require('fs');

const html = fs.readFileSync('page.html', 'utf8');

// Find all script tags src
const scriptSrcs = [...html.matchAll(/src="([^"]+\.js[^"]*)"/g)].map(m => m[1]);
console.log('Script sources count:', scriptSrcs.length);
console.log(scriptSrcs.slice(0, 10));

// Check if there are inline scripts with window or config
const inlineScripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
console.log('Inline scripts count:', inlineScripts.length);
inlineScripts.forEach((s, i) => {
  if (s.trim().length > 0 && !s.includes('self.__next_f.push')) {
    console.log(`Inline script #${i}:`, s.slice(0, 300));
  }
});
