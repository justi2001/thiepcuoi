const fs = require('fs');

async function testEndpoints() {
  const host = 'giao-dien-bustle-vip.mehappy.info';
  const sub = 'giao-dien-bustle-vip';
  
  const urls = [
    `https://mehappy.vn/api/v2/public/wedding-pages/by-domain/${host}`,
    `https://mehappy.vn/api/v2/public/wedding-pages/by-subdomain/${sub}`,
    `https://mehappy.vn/api/v2/public/wedding-pages/${sub}`,
    `https://mehappy.vn/api/v2/public/templates/${sub}`,
    `https://mehappy.vn/api/v2/wedding-pages/domain/${host}`,
    `https://mehappy.vn/api/v2/wedding-pages/subdomain/${sub}`,
    `https://mehappy.vn/api/v2/public/invitations/${sub}`,
    `https://mehappy.vn/api/wedding-pages?domain=${host}`,
    `https://giao-dien-bustle-vip.mehappy.info/api/page-content`,
    `https://giao-dien-bustle-vip.mehappy.info/_next/data/`,
  ];

  for (const u of urls) {
    try {
      const r = await fetch(u, { headers: { 'Accept': 'application/json' } });
      console.log(u, '=>', r.status);
      if (r.status === 200) {
        const data = await r.json();
        console.log('FOUND DATA! Keys:', Object.keys(data));
        fs.writeFileSync('found_data.json', JSON.stringify(data, null, 2));
      }
    } catch (e) {
      console.log(u, '=> err', e.message);
    }
  }
}

testEndpoints();
