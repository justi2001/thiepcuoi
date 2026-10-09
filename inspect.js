const fs = require('fs');

async function main() {
  const url = 'https://giao-dien-bustle-vip.mehappy.info/';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8'
    }
  });
  const html = await res.text();
  console.log('HTML size:', html.length);
  fs.writeFileSync('page.html', html, 'utf-8');

  // Search for next_f pushes
  const pushMatches = [...html.matchAll(/self\.__next_f\.push\(\[(\d+),"(.*?)"\]\)/gs)];
  console.log('Next pushes found:', pushMatches.length);

  let fullNextStream = '';
  for (const m of pushMatches) {
    try {
      const unescaped = JSON.parse(`"${m[2]}"`);
      fullNextStream += unescaped + '\n';
    } catch (e) {
      fullNextStream += m[2] + '\n';
    }
  }
  fs.writeFileSync('next_stream.txt', fullNextStream, 'utf-8');
  console.log('Saved next_stream.txt, length:', fullNextStream.length);

  // Look for any API calls or json data
  const urls = [...html.matchAll(/https?:\/\/[^"'\s<>]+/g)].map(x => x[0]);
  console.log('Found URLs count:', urls.length);
  const mediaUrls = urls.filter(u => u.match(/\.(webp|jpg|jpeg|png|mp3|svg|mp4)(\?|$)/i));
  console.log('Found Media URLs:', mediaUrls);
  fs.writeFileSync('media_urls.json', JSON.stringify([...new Set(mediaUrls)], null, 2));

  // Extract titles / headings / text
  const textClean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                        .replace(/<[^>]+>/g, ' ')
                        .replace(/\s+/g, ' ');
  fs.writeFileSync('clean_text.txt', textClean, 'utf-8');
  console.log('Clean text preview:', textClean.slice(0, 1000));
}

main().catch(console.error);
