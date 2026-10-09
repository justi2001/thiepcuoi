const fs = require('fs');

async function downloadChunks() {
  const html = fs.readFileSync('page.html', 'utf8');
  const scriptSrcs = [...html.matchAll(/src="(\/_next\/static\/chunks\/[^"]+)"/g)].map(m => m[1]);
  console.log('Total chunks:', scriptSrcs.length);

  const base = 'https://giao-dien-bustle-vip.mehappy.info';
  let allContent = '';
  for (const src of scriptSrcs) {
    try {
      const res = await fetch(base + src);
      const text = await res.text();
      // Look for interesting keywords
      if (text.includes('/api/') || text.includes('invitation') || text.includes('bustle') || text.includes('wedding')) {
        console.log(`Match in ${src}! length=${text.length}`);
        // search for endpoints
        const endpoints = [...text.matchAll(/["'](\/(?:api|_next\/data)[^"']+)["']/g)].map(m => m[1]);
        if (endpoints.length) console.log('Endpoints in chunk:', [...new Set(endpoints)]);

        const fullApis = [...text.matchAll(/["'](https?:\/\/[^"']*(?:api|mehappy)[^"']*)["']/g)].map(m => m[1]);
        if (fullApis.length) console.log('Full APIs:', [...new Set(fullApis)]);
      }
    } catch (e) {
      console.error(e.message);
    }
  }
}

downloadChunks().catch(console.error);
