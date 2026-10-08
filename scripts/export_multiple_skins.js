const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const http = require('http');
const { execFile } = require('child_process');

// Ranks and suits in standard Aisleriot
const suitMapping = [
  { cirullaSuit: 'cuori', aisleriotSuit: 'heart', row: 2 },
  { cirullaSuit: 'denari', aisleriotSuit: 'diamond', row: 1 },
  { cirullaSuit: 'fiori', aisleriotSuit: 'club', row: 0 },
  { cirullaSuit: 'picche', aisleriotSuit: 'spade', row: 3 },
];

const rankMapping = [
  { cirullaRank: 1, aisleriotRank: '1', col: 0 },
  { cirullaRank: 2, aisleriotRank: '2', col: 1 },
  { cirullaRank: 3, aisleriotRank: '3', col: 2 },
  { cirullaRank: 4, aisleriotRank: '4', col: 3 },
  { cirullaRank: 5, aisleriotRank: '5', col: 4 },
  { cirullaRank: 6, aisleriotRank: '6', col: 5 },
  { cirullaRank: 7, aisleriotRank: '7', col: 6 },
  { cirullaRank: 8, aisleriotRank: 'jack', col: 10 },
  { cirullaRank: 9, aisleriotRank: 'queen', col: 11 },
  { cirullaRank: 10, aisleriotRank: 'king', col: 12 },
];

function extractGroup(fullSvg, id) {
  const match = fullSvg.match(new RegExp(`<g[^>]*id="${id}"[^>]*>`));
  if (!match) return null;
  const start = match.index;
  let depth = 0, i = start, end = -1;
  while (i < fullSvg.length) {
    if (fullSvg.slice(i, i + 2) === '<g') depth++;
    else if (fullSvg.slice(i, i + 4) === '</g>') {
      depth--;
      if (depth === 0) { end = i + 4; break; }
    }
    i++;
  }
  return fullSvg.slice(start, end);
}

function processSkin(svgzPath, skinKey, port = 3893) {
  return new Promise((resolve, reject) => {
    const assetsDir = path.join(__dirname, '..', 'assets', 'cards', skinKey);
    const svgDir = path.join(assetsDir, 'svg');
    if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
    if (!fs.existsSync(svgDir)) fs.mkdirSync(svgDir, { recursive: true });

    const buf = fs.readFileSync(svgzPath);
    const fullSvg = zlib.gunzipSync(buf).toString('utf-8');

    const defsMatch = fullSvg.match(/<defs[\s\S]*?<\/defs>/);
    const defs = defsMatch ? defsMatch[0] : '';

    const cardList = [];
    suitMapping.forEach(s => {
      rankMapping.forEach(r => {
        cardList.push({
          key: `${s.cirullaSuit}_${r.cirullaRank}`,
          groupId: `${s.aisleriotSuit}_${r.aisleriotRank}`,
          row: s.row,
          col: r.col,
        });
      });
    });
    cardList.push({ key: 'back', groupId: 'back', row: 4, col: 2 });

    const svgMap = {};
    cardList.forEach(c => {
      const group = extractGroup(fullSvg, c.groupId);
      if (!group) {
        console.error(`Group not found for ${c.groupId} in ${skinKey}`);
        return;
      }
      const x = c.col * 79;
      const y = c.row * 123;
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink"
         xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
         xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
         viewBox="${x} ${y} 79 123" width="79" height="123">
      ${defs}
      ${group}
</svg>`;
      svgMap[c.key] = svgContent;
      fs.writeFileSync(path.join(svgDir, `${c.key}.svg`), svgContent);
    });

    console.log(`[${skinKey}] SVGs saved (${cardList.length} cards). Launching PNG render on port ${port}...`);

    let saved = 0;
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:${port}`);
      if (url.pathname === '/render.html') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<!DOCTYPE html><html><body>
<canvas id="cvs" width="316" height="492" style="display:none;"></canvas>
<script>
  const cards = ${JSON.stringify(cardList.map(c => c.key))};
  const cvs = document.getElementById('cvs');
  const ctx = cvs.getContext('2d');
  async function run() {
    for (const key of cards) {
      await new Promise((res, rej) => {
        const img = new Image();
        img.onload = async () => {
          ctx.clearRect(0, 0, 316, 492);
          ctx.drawImage(img, 0, 0, 316, 492);
          const data = cvs.toDataURL('image/png');
          await fetch('/save?key=' + encodeURIComponent(key), { method: 'POST', body: data });
          res();
        };
        img.onerror = rej;
        img.src = '/svg/' + encodeURIComponent(key) + '.svg';
      });
    }
    fetch('/done', { method: 'POST' });
  }
  run();
</script></body></html>`);
        return;
      }

      if (url.pathname.startsWith('/svg/')) {
        const k = url.pathname.replace('/svg/', '').replace('.svg', '');
        res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
        res.end(svgMap[k] || '');
        return;
      }

      if (url.pathname === '/save' && req.method === 'POST') {
        const key = url.searchParams.get('key');
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          const b64 = body.replace(/^data:image\/png;base64,/, '');
          fs.writeFileSync(path.join(assetsDir, `${key}.png`), Buffer.from(b64, 'base64'));
          saved++;
          res.writeHead(200); res.end('ok');
        });
        return;
      }

      if (url.pathname === '/done' && req.method === 'POST') {
        res.writeHead(200); res.end('ok');
        console.log(`[${skinKey}] All ${saved} PNG cards exported!`);
        server.close(() => resolve({ skinKey, count: saved }));
        return;
      }

      res.writeHead(404); res.end();
    });

    server.listen(port, () => {
      const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
      execFile(edge, ['--headless', '--disable-gpu', `http://localhost:${port}/render.html`], (err) => {
        if (err) console.error('Edge err:', err);
      });
    });
  });
}

async function exportDecks() {
  const decksToExport = [
    { key: 'russian_atlasnye', file: 'temp/decks/A03_russian.svgz', port: 3898 },
    { key: 'folklore_piatnik', file: 'temp/decks/A08_folklore.svgz', port: 3899 },
    { key: 'carta_mundi', file: 'temp/decks/A09_franzoesisches-bild.svgz', port: 3900 },
    { key: 'kaiser_piatnik', file: 'temp/decks/A10_kaiser-jubilaum.svgz', port: 3901 },
    { key: 'salon_karte_66', file: 'temp/decks/A12_salon-karte-66.svgz', port: 3902 },
  ];

  for (const d of decksToExport) {
    if (fs.existsSync(d.file)) {
      console.log(`\n=== Exporting ${d.key} ===`);
      await processSkin(d.file, d.key, d.port);
    } else {
      console.log(`File not found: ${d.file}`);
    }
  }
  console.log('\nAll selected skins exported successfully!');
}

exportDecks();
