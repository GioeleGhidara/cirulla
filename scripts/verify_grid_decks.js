const fs = require('fs');
const zlib = require('zlib');

function verifyGrid(file) {
  const buf = fs.readFileSync(file);
  const svg = zlib.gunzipSync(buf).toString('utf-8');
  const ids = ['club_1', 'diamond_7', 'heart_jack', 'spade_queen', 'club_king', 'back'];
  const results = ids.map(id => ({ id, found: svg.includes(`id="${id}"`) }));
  console.log(file, results);
}

verifyGrid('temp/decks/A01_ramino-stretch.svgz');
verifyGrid('temp/decks/A05_baroque.svgz');
verifyGrid('temp/decks/A02_ancient-french.svgz');
verifyGrid('temp/decks/A11_lombarde-ticinesi.svgz');
