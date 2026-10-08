const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const http = require('http');
const { execFile } = require('child_process');

const SVGZ_PATH = path.join(__dirname, '..', 'temp', 'baccarat.svgz');
const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'cards', 'genovesi');
const SVG_DIR = path.join(ASSETS_DIR, 'svg');

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}
if (!fs.existsSync(SVG_DIR)) {
  fs.mkdirSync(SVG_DIR, { recursive: true });
}

// 1. Read and decompress baccarat.svgz
const buffer = fs.readFileSync(SVGZ_PATH);
const fullSvg = zlib.gunzipSync(buffer).toString('utf-8');

const defsMatch = fullSvg.match(/<defs[\s\S]*?<\/defs>/);
const defs = defsMatch ? defsMatch[0] : '';

function extractGroup(id) {
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

const cardList = [];

suitMapping.forEach(s => {
  rankMapping.forEach(r => {
    const cardKey = `${s.cirullaSuit}_${r.cirullaRank}`;
    const groupId = `${s.aisleriotSuit}_${r.aisleriotRank}`;
    cardList.push({
      key: cardKey,
      groupId,
      row: s.row,
      col: r.col,
    });
  });
});

// Retro (back)
cardList.push({
  key: 'back',
  groupId: 'back',
  row: 4,
  col: 2,
});

console.log(`Extracting ${cardList.length} cards from baccarat.svgz...`);

const svgMap = {};

cardList.forEach(c => {
  const group = extractGroup(c.groupId);
  if (!group) {
    console.error(`Group not found for ${c.groupId}`);
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
  fs.writeFileSync(path.join(SVG_DIR, `${c.key}.svg`), svgContent);
});

console.log(`All ${cardList.length} SVG files saved to ${SVG_DIR}`);

// 2. Start HTTP server to render PNGs via Canvas and Edge Headless
const PORT = 3892;
let savedCount = 0;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  
  if (url.pathname === '/render.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Render Cards</title>
</head>
<body style="background: #222; color: #fff;">
  <h2>Rendering Genovesi Cards to PNG...</h2>
  <div id="status">Starting...</div>
  <canvas id="cvs" width="316" height="492" style="display:none;"></canvas>

  <script>
    const cards = ${JSON.stringify(cardList.map(c => c.key))};
    const cvs = document.getElementById('cvs');
    const ctx = cvs.getContext('2d');
    const status = document.getElementById('status');

    async function processAll() {
      for (let i = 0; i < cards.length; i++) {
        const key = cards[i];
        status.textContent = 'Processing ' + (i + 1) + '/' + cards.length + ': ' + key;
        
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = async () => {
            ctx.clearRect(0, 0, 316, 492);
            ctx.drawImage(img, 0, 0, 316, 492);
            const dataUrl = cvs.toDataURL('image/png');
            
            try {
              await fetch('/save?key=' + encodeURIComponent(key), {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: dataUrl
              });
              resolve();
            } catch (err) {
              reject(err);
            }
          };
          img.onerror = (e) => reject(new Error('Failed to load SVG for ' + key));
          img.src = '/svg/' + encodeURIComponent(key) + '.svg';
        });
      }
      status.textContent = 'DONE! All cards rendered.';
      fetch('/done', { method: 'POST' });
    }

    processAll().catch(err => {
      console.error(err);
      status.textContent = 'ERROR: ' + err.message;
    });
  </script>
</body>
</html>`);
    return;
  }

  if (url.pathname.startsWith('/svg/')) {
    const key = url.pathname.replace('/svg/', '').replace('.svg', '');
    const svg = svgMap[key];
    if (svg) {
      res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
      res.end(svg);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
    return;
  }

  if (url.pathname === '/save' && req.method === 'POST') {
    const key = url.searchParams.get('key');
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const base64Data = body.replace(/^data:image\/png;base64,/, '');
      const outPath = path.join(ASSETS_DIR, `${key}.png`);
      fs.writeFileSync(outPath, Buffer.from(base64Data, 'base64'));
      savedCount++;
      console.log(`[${savedCount}/${cardList.length}] Saved PNG: ${key}.png`);
      res.writeHead(200);
      res.end('ok');
    });
    return;
  }

  if (url.pathname === '/done' && req.method === 'POST') {
    res.writeHead(200);
    res.end('ok');
    console.log(`SUCCESS: All ${savedCount} PNG cards exported to ${ASSETS_DIR}`);
    finish();
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

function finish() {
  generateTypeScriptRegistry();
  setTimeout(() => {
    server.close();
    process.exit(0);
  }, 1000);
}

function generateTypeScriptRegistry() {
  const tsLines = [
    `// Autogenerated asset mapping for Carte Genovesi (Aisleriot Baccarat theme)`,
    `import { ImageSourcePropType } from 'react-native';`,
    `import { Card, Suit } from '../types/card';`,
    ``,
    `export const GENOVESI_CARD_IMAGES: Record<string, ImageSourcePropType> = {`,
  ];

  cardList.forEach(c => {
    tsLines.push(`  '${c.key}': require('../../assets/cards/genovesi/${c.key}.png'),`);
  });

  tsLines.push(`};`);
  tsLines.push(``);
  tsLines.push(`export function getGenovesiCardImage(card: Card): ImageSourcePropType | null {`);
  tsLines.push(`  let normSuit = (card.suit || '').toLowerCase();`);
  tsLines.push(`  if (normSuit === 'quadri') normSuit = 'denari';`);
  tsLines.push(`  const key = \`\${normSuit}_\${card.rank}\`;`);
  tsLines.push(`  return GENOVESI_CARD_IMAGES[key] ?? null;`);
  tsLines.push(`}`);
  tsLines.push(``);
  tsLines.push(`export function getGenovesiCardBack(): ImageSourcePropType {`);
  tsLines.push(`  return GENOVESI_CARD_IMAGES['back'];`);
  tsLines.push(`}`);
  tsLines.push(``);

  const tsPath = path.join(__dirname, '..', 'src', 'assets', 'genovesiDeck.ts');
  const tsDir = path.dirname(tsPath);
  if (!fs.existsSync(tsDir)) {
    fs.mkdirSync(tsDir, { recursive: true });
  }
  fs.writeFileSync(tsPath, tsLines.join('\n'));
  console.log(`Generated TypeScript registry at ${tsPath}`);
}

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}. Launching Edge headless renderer...`);
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const args = [
    '--headless',
    '--disable-gpu',
    `http://localhost:${PORT}/render.html`,
  ];
  execFile(edgePath, args, (err) => {
    if (err) {
      console.error('Edge execution error:', err);
    }
  });
});
