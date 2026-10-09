const fs = require('fs');

async function main() {
  const code = await (await fetch('https://giao-dien-bustle-vip.mehappy.info/_next/static/chunks/427a9ts2ffe-y.js?dpl=fe-b122e835')).text();
  
  // Find where pageContent is set or where fetch/axios is called
  const fetchMatches = [...code.matchAll(/(fetch\([^)]+\)|axios\.[a-z]+\([^)]+\))/g)].map(x => x[1]);
  console.log('Fetch calls:', fetchMatches.slice(0, 15));

  // Find occurrences of giao-dien-bustle or mehappy.vn/api
  const apiOccurrences = [...code.matchAll(/https?:\/\/[a-zA-Z0-9_\-\.\/:]+/g)].map(x => x[0]);
  const mehappyApis = [...new Set(apiOccurrences.filter(x => x.includes('mehappy')))];
  console.log('Mehappy URLs:', mehappyApis);

  // Search in other chunks for mehappy URLs
  const html = fs.readFileSync('page.html', 'utf8');
  const chunks = [...html.matchAll(/src="(\/_next\/static\/chunks\/[^"]+)"/g)].map(m => m[1]);
  for (const c of chunks) {
    if (c.includes('427a9ts2ffe-y')) continue;
    const t = await (await fetch('https://giao-dien-bustle-vip.mehappy.info' + c)).text();
    const apis = [...t.matchAll(/https?:\/\/[a-zA-Z0-9_\-\.\/:]+/g)].map(x => x[0]).filter(x => x.includes('mehappy') || x.includes('/api/'));
    if (apis.length > 0) {
      console.log(`In chunk ${c}:`, [...new Set(apis)]);
    }
  }
}

main();
