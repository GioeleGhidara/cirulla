const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'temp', 'altervista_download_manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
const outDir = path.join(__dirname, '..', 'temp', 'decks');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function downloadItem(item) {
  const destPath = path.join(outDir, `${item.code}_${item.fileName}`);
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
    console.log(`[Already exists] ${item.code} - ${item.name}`);
    return;
  }

  // If downloadUrl is expired or needs fresh link, fetch via OCS
  let dlUrl = item.downloadUrl;
  try {
    const metaUrl = `https://api.opendesktop.org/ocs/v1/content/data/${item.id}`;
    const res = await fetch(metaUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const text = await res.text();
    const linkMatch = text.match(/<downloadlink\d+>([\s\S]*?)<\/downloadlink\d+>/);
    if (linkMatch) {
      dlUrl = linkMatch[1].trim();
    }
  } catch (e) {
    console.log('Using manifest downloadUrl for', item.code);
  }

  if (!dlUrl) {
    console.log(`[No URL] ${item.code} - ${item.name}`);
    return;
  }

  console.log(`Downloading [${item.code}] ${item.name}...`);
  try {
    const res = await fetch(dlUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    if (res.status === 200) {
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(destPath, buf);
      console.log(`  -> Saved ${destPath} (${buf.length} bytes)`);
    } else {
      console.log(`  -> Failed HTTP ${res.status} for ${item.code}`);
    }
  } catch (err) {
    console.error(`  -> Error downloading ${item.code}:`, err.message);
  }
}

async function run() {
  console.log('Downloading Aisleriot & KPat decks from Altervista / OpenDesktop...');
  for (const item of manifest) {
    await downloadItem(item);
  }
  console.log('Download batch completed.');
}

run();
