async function findBustle() {
  for (let page = 1; page <= 5; page++) {
    const res = await fetch(`https://mehappy.vn/api/v2/public/templates?page=${page}&limit=50`);
    const data = await res.json();
    for (const t of data.data) {
      if (t.name.toLowerCase().includes('bustle')) {
        console.log('FOUND BUSTLE TEMPLATE:');
        console.log(JSON.stringify(t, null, 2));
        
        // Fetch detailed template by id
        const detailRes = await fetch(`https://mehappy.vn/api/v2/public/templates/${t.id}`);
        console.log('Detail status:', detailRes.status);
        const detailData = await detailRes.json();
        console.log('Detail keys:', Object.keys(detailData));
        require('fs').writeFileSync('bustle_template_detail.json', JSON.stringify(detailData, null, 2));
        return;
      }
    }
  }
}
findBustle();
