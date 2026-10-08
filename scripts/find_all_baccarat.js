const fs = require('fs');

const html = fs.readFileSync('temp/altervista.html', 'utf-8');

// Find all occurrences of baccarat
const indices = [];
let pos = 0;
while ((pos = html.indexOf('baccarat', pos)) !== -1) {
  indices.push(pos);
  pos += 8;
}

console.log('Occurrences of baccarat:', indices.length);
indices.forEach((idx, i) => {
  console.log(`--- Match ${i + 1} at ${idx} ---`);
  console.log(html.slice(Math.max(0, idx - 200), idx + 400));
});
