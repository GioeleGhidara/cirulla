const fs = require('fs');

async function main() {
  try {
    const res = await fetch('https://vectorcarddecks.altervista.org/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });
    console.log('Status:', res.status);
    const html = await res.text();
    console.log('HTML length:', html.length);
    fs.writeFileSync('temp/altervista.html', html);

    // Find all links
    const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)].map(m => m[1]);
    console.log('Total hrefs:', hrefs.length);

    const downloads = hrefs.filter(h => /\.(svgz|svg|zip|tar|gz|7z|png)/i.test(h));
    console.log('Download files found:', downloads);

    const internalLinks = hrefs.filter(h => h.includes('altervista.org') || h.startsWith('/'));
    console.log('Internal links:', internalLinks.slice(0, 30));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

main();
