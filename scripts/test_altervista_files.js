const fs = require('fs');

async function testUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log(res.status, url);
    return res.status === 200;
  } catch (e) {
    console.log('Error', url, e.message);
    return false;
  }
}

async function run() {
  const base = 'https://vectorcarddecks.altervista.org/';
  const candidates = [
    'DECKS/AISLERIOT/baccarat.svgz',
    'DECKS/AISLERIOT/04-baccarat.svgz',
    'DECKS/AISLERIOT/baccarat.svg',
    'DECKS/AISLERIOT/ramino.svgz',
    'DECKS/AISLERIOT/napoletane.svgz',
    'DECKS/KPAT/genovesi-baccarat-dal-negro.svgz',
    'DECKS/KPAT/05-genovesi-baccarat-dal-negro.svgz',
  ];
  for (const c of candidates) {
    await testUrl(base + c);
  }
}

run();
