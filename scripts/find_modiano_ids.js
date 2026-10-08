const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('temp/svg-genovesi-baccarat-modiano/genovesi-baccarat-modiano.svgz');
const svg = zlib.gunzipSync(buf).toString('utf-8');

// Find all <g id="...">
const gMatches = [...svg.matchAll(/<g\s+[^>]*id="([^"]+)"/g)].map(m => m[1]);
console.log('Total <g> IDs in Modiano deck:', gMatches.length);
console.log('Sample <g> IDs:');
console.log(gMatches.slice(0, 40));
