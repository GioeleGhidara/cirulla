async function fetchPling(id) {
  const url = `https://www.pling.com/p/${id}/`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log('Status for', id, ':', res.status);
    const html = await res.text();
    console.log('HTML length:', html.length);
    // Pling has files in an API or in data attributes, e.g. /files/download or ocs/v1/content/data
    const files = [...html.matchAll(/(https?:\/\/[^\s"'<>]+\.(?:svgz?|tar\.gz|zip|7z))/gi)].map(m => m[1]);
    console.log('Direct archive links:', files);

    // Look for ocs or api endpoints
    const apiMatches = [...html.matchAll(/(\/p\/[^\s"'<>]+\/loadFiles[^\s"'<>]*|ocs\/v\d\/[^\s"'<>]*)/gi)].map(m => m[1]);
    console.log('API matches:', apiMatches);
  } catch (err) {
    console.error('Error fetching pling', id, err);
  }
}

fetchPling('2052172');
fetchPling('1262686');
