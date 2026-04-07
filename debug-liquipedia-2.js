const https = require('https');

async function getLiquipedia() {
  const options = {
    hostname: 'liquipedia.net',
    path: '/pubgmobile/api.php?action=parse&page=A1_Esports/Results&format=json&origin=*',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept-Encoding': 'identity'
    }
  };

  return new Promise((resolve, reject) => {
    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
}

getLiquipedia().then(json => {
  if (json.parse && json.parse.text) {
    const html = json.parse.text['*'];
    console.log('HTML Length:', html.length);
    // Find table classes
    const classes = html.match(/class="([^"]*)"/g) || [];
    const tableClasses = classes.filter(c => c.includes('table'));
    console.log('Found table-related classes:', [...new Set(tableClasses)].slice(0, 10));
    
    // Check for some content
    if (html.includes('PMK')) console.log('Found PMK in HTML');
    if (html.includes('A1')) console.log('Found A1 in HTML');
    
    // Look for rows
    const rows = html.match(/<tr/g) || [];
    console.log('Number of tr tags:', rows.length);
  } else {
    console.log('No parse/text in JSON:', Object.keys(json));
    if (json.error) console.log('Error:', json.error);
  }
}).catch(console.error);
