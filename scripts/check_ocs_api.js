const endpoints = [
  'https://api.opendesktop.org/ocs/v1/content/data/2052172',
  'https://api.pling.com/ocs/v1/content/data/2052172',
  'https://www.opendesktop.org/p/2052172/loadFiles',
  'https://www.pling.com/p/2052172/loadFiles',
  'https://www.opendesktop.org/p/2052172/files',
  'https://api.opendesktop.org/v1/content/data/2052172',
  'https://api.pling.com/v1/content/data/2052172',
  'https://www.opendesktop.org/ocs/v1/content/data/2052172',
];

async function check() {
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
          'Accept': 'application/json, text/xml, */*'
        }
      });
      console.log(res.status, ep);
      if (res.status === 200) {
        const text = await res.text();
        console.log('   Response snippet:', text.slice(0, 300));
      }
    } catch (e) {
      console.log('Error for', ep, e.message);
    }
  }
}

check();
