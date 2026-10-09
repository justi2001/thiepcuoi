const fs = require('fs');

async function main() {
  const res = await fetch('https://giao-dien-bustle-vip.mehappy.info/_next/static/chunks/3dznn-a4gaqhj.js?dpl=fe-b122e835');
  const code1 = await res.text();
  console.log('Chunk 1 matches for api:');
  const m1 = [...code1.matchAll(/(\/api\/[a-zA-Z0-9_\-\/]+)/g)].map(x => x[1]);
  console.log([...new Set(m1)]);

  const res2 = await fetch('https://giao-dien-bustle-vip.mehappy.info/_next/static/chunks/427a9ts2ffe-y.js?dpl=fe-b122e835');
  const code2 = await res2.text();
  console.log('Chunk 2 matches for api:');
  const m2 = [...code2.matchAll(/(\/api\/[a-zA-Z0-9_\-\/]+)/g)].map(x => x[1]);
  console.log([...new Set(m2)].slice(0, 30));

  // Also check if domain "giao-dien-bustle-vip" or slug is sent somewhere
  const slugMatches = [...code2.matchAll(/['"`]([^'"`]*(?:invitation|wedding|slug|subdomain|domain)[^'"`]*)['"`]/gi)].map(x => x[1]);
  console.log('Slug matches:', [...new Set(slugMatches)].slice(0, 30));
}

main();
