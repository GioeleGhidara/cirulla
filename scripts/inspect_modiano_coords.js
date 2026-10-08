const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('temp/svg-genovesi-baccarat-modiano/genovesi-baccarat-modiano.svgz');
const svg = zlib.gunzipSync(buf).toString('utf-8');

['1_club', 'jack_club', '7_diamond', 'queen_heart', 'king_spade', 'back'].forEach(id => {
  const match = svg.match(new RegExp(`<g[^>]*id="${id}"[^>]*>`));
  if (match) {
    const start = match.index;
    let depth = 0, i = start, end = -1;
    while (i < svg.length) {
      if (svg.slice(i, i + 2) === '<g') depth++;
      else if (svg.slice(i, i + 4) === '</g>') {
        depth--;
        if (depth === 0) { end = i + 4; break; }
      }
      i++;
    }
    const chunk = svg.slice(start, end);
    const t = chunk.match(/transform="([^"]+)"/);
    const r = chunk.match(/<rect[^>]*width="([^"]+)"[^>]*height="([^"]+)"[^>]*x="([^"]+)"[^>]*y="([^"]+)"/);
    const r2 = chunk.match(/<rect[^>]*x="([^"]+)"[^>]*y="([^"]+)"[^>]*width="([^"]+)"[^>]*height="([^"]+)"/);
    console.log(id, 'transform:', t ? t[1] : 'none', 'rect:', r ? `${r[1]}x${r[2]} at (${r[3]},${r[4]})` : r2 ? `${r2[3]}x${r2[4]} at (${r2[1]},${r2[2]})` : 'none');
  }
});
