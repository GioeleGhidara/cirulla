const fs = require('fs');
const zlib = require('zlib');

function inspectSvgz(file) {
  try {
    const buf = fs.readFileSync(file);
    const svg = zlib.gunzipSync(buf).toString('utf-8');
    const vb = svg.match(/viewBox="([^"]+)"/);
    console.log(`\n=== ${file} ===`);
    console.log('viewBox:', vb ? vb[1] : 'none');
    const hasClubJack = svg.includes('club_jack') || svg.includes('jack_club') || svg.includes('club_8');
    const hasHeartQueen = svg.includes('heart_queen') || svg.includes('queen_heart');
    const hasBack = svg.includes('id="back"');
    console.log({ hasClubJack, hasHeartQueen, hasBack });
  } catch (e) {
    console.log(`Error reading ${file}:`, e.message);
  }
}

inspectSvgz('temp/svg-genovesi-baccarat-modiano/genovesi-baccarat-modiano.svgz');
inspectSvgz('temp/decks/A01_ramino-stretch.svgz');
inspectSvgz('temp/decks/A05_baroque.svgz');
inspectSvgz('temp/decks/A02_ancient-french.svgz');
