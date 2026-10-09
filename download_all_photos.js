const fs = require('fs');
const https = require('https');
const path = require('path');

const photos = JSON.parse(fs.readFileSync('extracted_drive_photos.json', 'utf8'));
const destDir = path.join(__dirname, 'images', 'wedding');

function downloadFile(photo) {
  return new Promise((resolve, reject) => {
    const destPath = path.join(destDir, photo.name);
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 10000) {
      console.log(`[Exists] ${photo.name}`);
      return resolve();
    }

    const url = `https://lh3.googleusercontent.com/d/${photo.id}`;
    const file = fs.createWriteStream(destPath);

    function fetchUrl(currentUrl) {
      https.get(currentUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchUrl(res.headers.location);
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(destPath);
          return reject(new Error(`Failed to download ${photo.name}: status ${res.statusCode}`));
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            console.log(`[Downloaded] ${photo.name} (${fs.statSync(destPath).size} bytes)`);
            resolve();
          });
        });
      }).on('error', (err) => {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        reject(err);
      });
    }

    fetchUrl(url);
  });
}

async function run() {
  console.log(`Starting download of ${photos.length} photos...`);
  // Download with concurrency limit of 5
  const concurrency = 5;
  for (let i = 0; i < photos.length; i += concurrency) {
    const chunk = photos.slice(i, i + concurrency);
    await Promise.all(chunk.map(downloadFile));
  }
  console.log('All downloads completed successfully!');
}

run().catch(err => {
  console.error('Download error:', err);
});
