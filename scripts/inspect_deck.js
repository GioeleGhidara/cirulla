const zlib = require('zlib');
const fs = require('fs');

function checkDimensions(p) {
  const buf = fs.readFileSync(p);
  const svg = zlib.gunzipSync(buf).toString('utf8');
  console.log('=== ' + p + ' ===');
  const svgTag = svg.match(/<svg[^>]*>/);
  console.log('SVG Tag:', svgTag ? svgTag[0].slice(0, 150) : 'none');
  const sampleCard = svg.match(/<g[^>]*id="1_club"[^>]*>/);
  console.log('1_club tag:', sampleCard ? sampleCard[0] : 'none');
}

checkDimensions('temp/decks/svg-genovesi-baccarat-modiano/genovesi-baccarat-modiano.svgz');
checkDimensions('temp/decks/svg-napoletane/napoletane.svgz');

