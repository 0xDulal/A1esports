async function debug() {
  try {
    const url = 'https://liquipedia.net/pubgmobile/api.php?action=parse&page=A1_Esports/Results&format=json&origin=*';
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'A1EsportsWeb/1.0 (contact@a1esports.com)',
        'Accept-Encoding': 'gzip',
      }
    });
    const json = await res.json();
    const html = json.parse.text['*'];
    console.log('HTML Length:', html.length);
    const $ = cheerio.load(html);
    
    // Find all tables
    $('table').each((i, table) => {
      const className = $(table).attr('class') || '';
      console.log(`Table ${i} Classes: ${className}`);
      const rows = $(table).find('tr');
      console.log(`Rows in table: ${rows.length}`);
      
      if (rows.length > 0) {
          // Find first data row (skip headers)
          let dataRow = null;
          rows.each((j, tr) => {
            if ($(tr).find('td').length > 0) {
              dataRow = tr;
              return false; // break
            }
          });

          if (dataRow) {
            const cells = $(dataRow).find('td').map((j, el) => $(el).text().trim()).get();
            console.log(`First data row cells: ${JSON.stringify(cells)}`);
          }
      }
      console.log('-------------------');
    });
  } catch (e) {
    console.error(e);
  }
}
debug();
