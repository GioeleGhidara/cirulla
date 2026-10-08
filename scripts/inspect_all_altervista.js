const fs = require('fs');
const path = require('path');

const DECKS_DIR = path.join(__dirname, '..', 'temp', 'downloaded_decks');
if (!fs.existsSync(DECKS_DIR)) {
  fs.mkdirSync(DECKS_DIR, { recursive: true });
}

// Complete map of all decks from vectorcarddecks.altervista.org
const CATALOGUE = [
  // Aisleriot decks (pure SVGZ grids)
  { id: '2052185', code: 'A01', name: 'Ramino (Modiano)', type: 'aisleriot' },
  { id: '1272190', code: 'A02', name: 'Ancient French', type: 'aisleriot' },
  { id: '2052186', code: 'A03', name: 'Russian', type: 'aisleriot' },
  { id: '2052172', code: 'A04', name: 'Baccarat / Genovesi (Dal Negro)', type: 'aisleriot' },
  { id: '2052174', code: 'A05', name: 'Baroque (Piatnik N. 2118)', type: 'aisleriot' },
  { id: '2052184', code: 'A06', name: 'Napoletane', type: 'aisleriot' },
  { id: '2052176', code: 'A07', name: 'Haupstadte Spiel (Dondorf)', type: 'aisleriot' },
  { id: '2052177', code: 'A08', name: 'Folklore (Piatnik N. 2169)', type: 'aisleriot' },
  { id: '2052180', code: 'A09', name: 'Franzoesisches Bild (Carta Mundi)', type: 'aisleriot' },
  { id: '2052182', code: 'A10', name: 'Kaiser Jubilaum (Piatnik N. 2138)', type: 'aisleriot' },
  { id: '2052183', code: 'A11', name: 'Lombarde - Ticinesi (Dal Negro)', type: 'aisleriot' },
  { id: '2052188', code: 'A12', name: 'Salon Karte No. 66 (Altenburger)', type: 'aisleriot' },

  // KPat decks (tar.gz or svgz)
  { id: '1262474', code: 'K01', name: 'Ramino 98 (Modiano)', type: 'kpat' },
  { id: '1262683', code: 'K02', name: 'Ancient French', type: 'kpat' },
  { id: '1262682', code: 'K03', name: 'Russian (Atlasnye)', type: 'kpat' },
  { id: '1262684', code: 'K04', name: 'Belarusian-Lapin’s', type: 'kpat' },
  { id: '1262687', code: 'K05', name: 'Baccarat / Genovesi (Dal Negro)', type: 'kpat' },
  { id: '1262686', code: 'K06', name: 'Baccarat / Genovesi (Modiano)', type: 'kpat' },
  { id: '1262690', code: 'K07', name: 'Lombarde - Ticinesi (Dal Negro)', type: 'kpat' },
  { id: '1262691', code: 'K08', name: 'Napoletane', type: 'kpat' },
  { id: '1262688', code: 'K09', name: 'Irish Historic', type: 'kpat' },
  { id: '1262693', code: 'K10', name: 'Olsen', type: 'kpat' },
  { id: '1262694', code: 'K11', name: 'Baroque', type: 'kpat' },
  { id: '1262695', code: 'K12', name: 'Folklore', type: 'kpat' },
  { id: '1262696', code: 'K13', name: 'Kaiser', type: 'kpat' },
  { id: '1297604', code: 'K17', name: 'Piatnik Milanesi', type: 'kpat' },
  { id: '1300142', code: 'K18', name: 'Franzosischer Bild', type: 'kpat' },
];

async function getDownloadInfo(deck) {
  try {
    const metaUrl = `https://api.opendesktop.org/ocs/v1/content/data/${deck.id}`;
    const res = await fetch(metaUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const text = await res.text();
    const linkMatch = text.match(/<downloadlink\d+>([\s\S]*?)<\/downloadlink\d+>/);
    const nameMatch = text.match(/<downloadname\d+>([\s\S]*?)<\/downloadname\d+>/);
    return {
      ...deck,
      downloadUrl: linkMatch ? linkMatch[1].trim() : null,
      fileName: nameMatch ? nameMatch[1].trim() : null,
    };
  } catch (err) {
    return { ...deck, error: err.message };
  }
}

async function inspectAll() {
  console.log(`Inspecting all ${CATALOGUE.length} decks on OpenDesktop/Pling for Altervista...`);
  const results = [];
  for (const item of CATALOGUE) {
    const info = await getDownloadInfo(item);
    console.log(`[${info.code}] ${info.name}: ${info.fileName || 'N/A'}`);
    results.push(info);
  }
  fs.writeFileSync(path.join(__dirname, '..', 'temp', 'altervista_download_manifest.json'), JSON.stringify(results, null, 2));
  console.log('Saved manifest to temp/altervista_download_manifest.json');
}

inspectAll();
