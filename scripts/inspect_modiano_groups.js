const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('temp/svg-genovesi-baccarat-modiano/genovesi-baccarat-modiano.svgz');
const svg = zlib.gunzipSync(buf).toString('utf-8');

['club_1', 'diamond_7', 'heart_queen', 'spade_king', 'back'].forEach(id => {
  const match = svg.match(new RegExp(`<g[^>]*id="${id}"[^>]*>`));
  if (match) {
    console.log(id, match[0]);
  } else {
    console.log(id, 'not found');
  }
});
