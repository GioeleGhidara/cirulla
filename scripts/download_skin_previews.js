const fs = require('fs');
const path = require('path');

const PREVIEWS_DIR = path.join(__dirname, '..', 'assets', 'skins_preview');
if (!fs.existsSync(PREVIEWS_DIR)) {
  fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
}

const PREVIEW_FILES = [
  'DECKS/AISLERIOT/card_images/01-ramino.png',
  'DECKS/AISLERIOT/card_images/02-ancient-french.png',
  'DECKS/AISLERIOT/card_images/03-russian.png',
  'DECKS/AISLERIOT/card_images/04-baccarat.png',
  'DECKS/AISLERIOT/card_images/05-baroque.png',
  'DECKS/AISLERIOT/card_images/06-napoletane.png',
  'DECKS/AISLERIOT/card_images/07-dondorf-haupstadte-spiel.png',
  'DECKS/AISLERIOT/card_images/08-folklore.png',
  'DECKS/AISLERIOT/card_images/09-carta-mundi-franzoesisches-bild.png',
  'DECKS/AISLERIOT/card_images/10-kaiser-jubilaum.png',
  'DECKS/AISLERIOT/card_images/11-lombarde-ticinesi.png',
  'DECKS/AISLERIOT/card_images/12-salon-karte-66.png',
  'DECKS/KPAT/card_images/01-ramino.png',
  'DECKS/KPAT/card_images/02-ancient-french-fr.png',
  'DECKS/KPAT/card_images/03-atlasnye.png',
  'DECKS/KPAT/card_images/04-belarusian-lapins.png',
  'DECKS/KPAT/card_images/05-genovesi-baccarat-dal-negro.png',
  'DECKS/KPAT/card_images/06-genovesi-baccarat-modiano.png',
  'DECKS/KPAT/card_images/07-lombarde-ticinesi.png',
  'DECKS/KPAT/card_images/08-napoletane.png',
  'DECKS/KPAT/card_images/09-irish-historic.png',
  'DECKS/KPAT/card_images/10-olsen.png',
  'DECKS/KPAT/card_images/11-baroque.png',
  'DECKS/KPAT/card_images/12-folklore.png',
  'DECKS/KPAT/card_images/13-kaiser.png',
  'DECKS/KPAT/card_images/14-standard.png',
  'DECKS/KPAT/card_images/15-dondorf-haupstadte-spiel.png',
  'DECKS/KPAT/card_images/16-salon-karte-no-66.png',
  'DECKS/KPAT/card_images/17-piatnik-milanesi.png',
  'DECKS/KPAT/card_images/18-franzosischer%20bild.png',
  'DECKS/KPAT/card_images/19-spanish-fantasy.png',
];

async function run() {
  console.log(`Downloading ${PREVIEW_FILES.length} skin previews from altervista...`);
  const base = 'https://vectorcarddecks.altervista.org/';
  for (const p of PREVIEW_FILES) {
    const filename = path.basename(decodeURIComponent(p));
    const dest = path.join(PREVIEWS_DIR, filename);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`[Already exists] ${filename}`);
      continue;
    }
    const url = base + p;
    try {
      const res = await fetch(url);
      if (res.status === 200) {
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(dest, buf);
        console.log(`Saved ${filename} (${buf.length} bytes)`);
      } else {
        console.log(`Failed HTTP ${res.status} for ${p}`);
      }
    } catch (e) {
      console.error(`Error downloading ${p}:`, e.message);
    }
  }
}

run();
