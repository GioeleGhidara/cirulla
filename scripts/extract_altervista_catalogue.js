const fs = require('fs');

const html = fs.readFileSync('temp/altervista.html', 'utf-8');

// The table rows generally look like:
// <tr ...><td ...><font ...>Art. ... - Name ...</font></td></tr>
// ...
// <a href="https://www.pling.com/p/..."><img src="Images/Download.jpg"></a>
// ...
// <img src="DECKS/...">

const entries = [];

// Split by <tr or table segments
const items = html.split(/<tr[^>]*style="font-weight:\s*bold;?"[^>]*align="center">/gi);

console.log('Split segments:', items.length);

items.slice(1).forEach((seg, i) => {
  const titleMatch = seg.match(/<font[^>]*size="4"[^>]*>([\s\S]*?)<\/font>/i);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Unknown';
  
  const linkMatch = seg.match(/href=["'](https?:\/\/(?:www\.)?pling\.com\/p\/[^"']+)["']/i);
  const plingUrl = linkMatch ? linkMatch[1] : null;

  const imgMatch = seg.match(/src=["'](DECKS\/[^"']+)["']/i);
  const previewImg = imgMatch ? imgMatch[1] : null;

  entries.push({
    index: i + 1,
    title,
    plingUrl,
    previewImg,
  });
});

console.log('Extracted decks count:', entries.length);
entries.forEach(e => {
  console.log(`[${e.index}] ${e.title}`);
  console.log(`   Pling: ${e.plingUrl}`);
  console.log(`   Img: ${e.previewImg}`);
});

fs.writeFileSync('temp/altervista_decks.json', JSON.stringify(entries, null, 2));
