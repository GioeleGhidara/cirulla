const fs = require('fs');

const html = fs.readFileSync('temp/altervista.html', 'utf-8');

// Look for text around "baccarat" or "04-baccarat" or "genovesi"
const idx = html.indexOf('baccarat');
if (idx !== -1) {
  console.log('Snippet around baccarat:');
  console.log(html.slice(Math.max(0, idx - 400), idx + 800));
} else {
  console.log('baccarat not found');
}

// Let's also check for form, input, onclick, mega, drive, github, mediafire, sourceforge etc.
const downloadServices = [...html.matchAll(/(mega\.nz|mediafire|drive\.google|dropbox|github|sourceforge|opendesktop)[^\s"'<>]+/gi)].map(m => m[0]);
console.log('Third-party download links:', downloadServices);
