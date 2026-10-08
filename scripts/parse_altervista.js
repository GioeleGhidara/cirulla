const fs = require('fs');

const html = fs.readFileSync('temp/altervista.html', 'utf-8');

// Find all <a> tags and their surrounding text or table rows
const links = [];
const aRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
let match;
while ((match = aRegex.exec(html)) !== null) {
  const href = match[1];
  const text = match[2].replace(/<[^>]+>/g, '').trim();
  links.push({ href, text });
}

console.log('Total <a> links:', links.length);

// Print links that look like downloads or decks
const deckLinks = links.filter(l => 
  l.href.includes('DECKS') || 
  l.href.includes('download') || 
  /\.(svg|svgz|tar|gz|zip|7z)/i.test(l.href) ||
  l.text.toLowerCase().includes('download') ||
  l.text.toLowerCase().includes('svg')
);

console.log('Deck links found:');
deckLinks.forEach((l, i) => {
  console.log(`[${i + 1}] text: "${l.text}" -> href: "${l.href}"`);
});

// Also search for all mentions of "DECKS" or "download" in the html
const downloadMatches = [...html.matchAll(/(https?:\/\/[^\s"'<>]+|\/[^\s"'<>]+|DECKS\/[^\s"'<>]+)/gi)]
  .map(m => m[1])
  .filter(u => /\.(svgz?|zip|tar|gz|7z)/i.test(u) || u.includes('DECKS'));

console.log('\nUnique potential resource URLs:', [...new Set(downloadMatches)]);
