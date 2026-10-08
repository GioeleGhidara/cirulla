const fs = require('fs');

const html = fs.readFileSync('temp/altervista.html', 'utf-8');

// Find all occurrences of Images/Download.jpg
const regex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>\s*<img[^>]*src=["']Images\/Download\.jpg["'][^>]*><\/a>/gi;
let m;
let count = 0;
while ((m = regex.exec(html)) !== null) {
  count++;
  console.log(`[Download button ${count}] href: ${m[1]}`);
}

// Or without strict regex:
const posMatches = [...html.matchAll(/href=["']([^"']+)["'][^>]*>\s*(?:<font[^>]*>)?\s*<img[^>]*Download\.jpg/gi)];
console.log('Fuzzy download matches:', posMatches.map(m => m[1]));
