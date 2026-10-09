async function check() {
  const r = await fetch('https://mehappy.vn/api/v2/public/templates/giao-dien-bustle-vip');
  console.log('Status:', r.status);
  console.log('Body:', await r.text());

  const r2 = await fetch('https://mehappy.vn/api/v2/public/templates?slug=giao-dien-bustle-vip');
  console.log('Templates list status:', r2.status);
  console.log('Templates list body:', await r2.text());
}
check();
