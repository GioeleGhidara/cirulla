const fs = require('fs');
const path = require('path');

async function downloadDeck(id, filename) {
  const metaUrl = `https://api.opendesktop.org/ocs/v1/content/data/${id}`;
  const res = await fetch(metaUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const text = await res.text();
  const linkMatch = text.match(/<downloadlink\d+>([\s\S]*?)<\/downloadlink\d+>/);
  if (!linkMatch) {
    console.error('No download link for', id);
    return;
  }
  const dlUrl = linkMatch[1].trim();
  console.log(`Downloading ${filename} from:`, dlUrl.slice(0, 100) + '...');
  
  const dlRes = await fetch(dlUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  
  const dest = path.join('temp', filename);
  const buf = Buffer.from(await dlRes.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`Saved ${dest} (${buf.length} bytes)`);
}

async function run() {
  await downloadDeck('1262686', 'genovesi_modiano.tar.gz');
  await downloadDeck('2052183', 'lombarde_ticinesi.svgz');
  await downloadDeck('2052174', 'baroque.svgz');
}

run();
