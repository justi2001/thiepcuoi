const fs = require('fs');

async function findAllBustle() {
  for (let page = 1; page <= 5; page++) {
    const res = await fetch(`https://mehappy.vn/api/v2/public/templates?page=${page}&limit=50`);
    const data = await res.json();
    for (const t of data.data) {
      if (t.name.toLowerCase().includes('bustle')) {
        console.log(`Bustle match: ID=${t.id}, Name=${t.name}, Tier=${t.tier}`);
        const dRes = await fetch(`https://mehappy.vn/api/v2/public/templates/${t.id}`);
        const dJson = await dRes.json();
        fs.writeFileSync(`bustle_${t.id}_${t.tier}.json`, JSON.stringify(dJson, null, 2));
      }
    }
  }
}
findAllBustle();
