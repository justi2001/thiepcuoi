const fs = require('fs');

async function main() {
  const code = await (await fetch('https://giao-dien-bustle-vip.mehappy.info/_next/static/chunks/301k39tuqxl46.js?dpl=fe-b122e835')).text();
  console.log('Chunk length:', code.length);
  // Look for occurrences of /api/ or fetch or mehappy
  const matches = [...code.matchAll(/([a-zA-Z0-9_\$]+\.get\([^)]+\)|fetch\([^)]+\)|["'][^"']*\/api\/[^"']*["'])/g)].map(x => x[0]);
  console.log('Matches:', matches.slice(0, 30));
  
  // Look for any string mentioning public, template, subdomain, bustle, wedding-page
  const endpoints = [...code.matchAll(/["'](\/v2\/[^"']+)["']/g)].map(x => x[1]);
  console.log('v2 endpoints:', [...new Set(endpoints)]);
}

main();
