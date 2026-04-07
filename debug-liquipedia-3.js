const https = require('https');

async function getRawPage() {
  const options = {
    hostname: 'liquipedia.net',
    path: '/pubgmobile/A1_Esports/Results',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    }
  };

  return new Promise((resolve, reject) => {
    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data
        });
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
}

getRawPage().then(res => {
  console.log('Status:', res.status);
  console.log('Content Type:', res.headers['content-type']);
  console.log('Data Length:', res.data.length);
  if (res.data.includes('A1 Esports')) console.log('Found A1 Esports in HTML');
  if (res.data.includes('wikitable')) console.log('Found wikitable in HTML');
  if (res.data.includes('table2')) console.log('Found table2 in HTML');
}).catch(console.error);
