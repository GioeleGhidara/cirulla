async function getOcs(id) {
  const url = `https://api.opendesktop.org/ocs/v1/content/data/${id}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const text = await res.text();
  console.log(`=== Product ${id} ===`);
  // print downloadlink tags
  const links = [...text.matchAll(/<downloadname[^>]*>([\s\S]*?)<\/downloadname[\s\S]*?<downloadlink[^>]*>([\s\S]*?)<\/downloadlink>/gi)];
  if (links.length > 0) {
    links.forEach(l => {
      console.log('   File:', l[1], '->', l[2]);
    });
  } else {
    // print all downloadlink
    const allLinks = [...text.matchAll(/<downloadlink[^>]*>([\s\S]*?)<\/downloadlink>/gi)].map(m => m[1]);
    console.log('   Download links:', allLinks);
    // check if <downloadname1>, <downloadlink1> etc
    const numLinks = [...text.matchAll(/<downloadlink\d+>([\s\S]*?)<\/downloadlink\d+>/gi)].map(m => m[1]);
    console.log('   Numbered download links:', numLinks);
  }
  // Also check if any preview or description
  const name = text.match(/<name>([\s\S]*?)<\/name>/);
  console.log('   Name:', name ? name[1] : 'unknown');
}

async function run() {
  await getOcs('2052172'); // Baccarat Aisleriot
  await getOcs('1262686'); // Baccarat Modiano Kpat
  await getOcs('2052184'); // Napoletane Aisleriot
  await getOcs('2052183'); // Lombarde-Ticinesi Dal Negro Aisleriot
  await getOcs('1262687'); // Genovesi Dal Negro KPat
}

run();
