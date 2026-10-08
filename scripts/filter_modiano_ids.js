const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('temp/svg-genovesi-baccarat-modiano/genovesi-baccarat-modiano.svgz');
const svg = zlib.gunzipSync(buf).toString('utf-8');

const gMatches = [...svg.matchAll(/<g\s+[^>]*id="([^"]+)"/g)].map(m => m[1]);
const cardIds = gMatches.filter(id => /(club|diamond|heart|spade|back)/i.test(id));
console.log('Modiano card-related IDs:');
console.log(cardIds);
