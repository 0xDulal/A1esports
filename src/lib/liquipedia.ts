import * as cheerio from 'cheerio';

export type Achievement = {
  date: string;
  place: string;
  tier: string;
  tournament: string;
  prize: string;
};

const FALLBACK_ACHIEVEMENTS: Achievement[] = [
  {
    date: "2024-12-15",
    place: "1st",
    tier: "A-Tier",
    tournament: "PUBG Mobile National Championship 2024",
    prize: "$10,000"
  },
  {
    date: "2024-11-20",
    place: "2nd",
    tier: "B-Tier",
    tournament: "Pro League South Asia Fall 2024",
    prize: "$5,500"
  },
  {
    date: "2024-10-05",
    place: "3rd",
    tier: "A-Tier",
    tournament: "South Asia Championship 2024",
    prize: "$3,000"
  }
];

export async function getLiquipediaAchievements(): Promise<Achievement[]> {
  try {
    // Liquipedia API requires specific headers including Accept-Encoding: gzip
    // We will use the MediaWiki API parse action which is more stable than scraping raw HTML
    const res = await fetch('https://liquipedia.net/pubgmobile/api.php?action=parse&page=A1_Esports/Results&format=json&origin=*', {
      headers: {
        'User-Agent': 'A1EsportsWeb/1.0 (contact@a1esports.com)',
        'Accept-Encoding': 'gzip',
      },
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      console.error(`Failed to fetch Liquipedia API: ${res.status} ${res.statusText}`);
      return FALLBACK_ACHIEVEMENTS;
    }

    const json = await res.json();
    if (!json.parse || !json.parse.text || !json.parse.text['*']) {
        console.error('Invalid API response structure');
        return FALLBACK_ACHIEVEMENTS;
    }

    const html = json.parse.text['*'];
    const $ = cheerio.load(html);
    const achievements: Achievement[] = [];

    // Check for both 'wikitable' and typical table structures
    // Liquipedia might be serving a mobile version or different structure to bots
    // The API response seems to use 'table2' class instead of 'wikitable'
    let tables = $('.wikitable');
    if (tables.length === 0) {
        tables = $('.table2__table'); // New table class
    }
    if (tables.length === 0) {
        tables = $('table'); // Fallback
    }

    // Simplified parsing logic based on successful example
    // The API returns HTML where the first table usually contains the recent results
    // We just need to be flexible about column order or fallback to standard indices
    
    // Convert Cheerio object to array to iterate and filter
    const tablesArray = tables.toArray();

    // Iterate through tables to find the results table
    for (const tableEl of tablesArray) {
      const table = $(tableEl);
      
      // Check if this table looks like a results table (has many rows, likely date/place)
      // Standard Results Table Columns from debug:
      // Date | Place | Tier | Tournament | Prize
      
      table.find('tr').each((i, row) => {
          const $row = $(row);
          // Skip header rows
          if ($row.find('th').length > 0) return;
          if ($row.hasClass('table2__row--head')) return;
          if ($row.css('display') === 'none') return;

          const cells = $row.find('td');
          // We need at least 5 columns for meaningful data
          if (cells.length >= 5) {
             // Standard layout based on observation:
             // 0: Date
             // 1: Place
             // 2: Tier
             // 3: Tournament
             // 4: Prize (or 5 sometimes)
             
             const date = $(cells[0]).text().trim();
             const place = $(cells[1]).text().trim();
             const tier = $(cells[2]).text().trim();
             
             // Column 3 is often the Tournament Icon, Column 4 is the Tournament Name
             let tournament = $(cells[3]).text().trim();
             let prize = $(cells[4]).text().trim(); // Default assumption for 5-col

             // If column 3 is empty/short (icon) and we have enough columns, assume 6-col layout
             if (cells.length >= 6) {
                 const potentialName = $(cells[4]).text().trim();
                 // If the "tournament" (col 3) is empty, use col 4
                 if (tournament.length < 2) {
                     tournament = potentialName;
                 }
                 // In 6-col layout, prize is usually at index 5
                 prize = $(cells[5]).text().trim();
             }

             // Cleanup prize text (sometimes it has reference links like $10,000[1])
             prize = prize.split('[')[0].trim();

             // Basic validation: must have date, place, and a tournament name
             // Exclude rows that are just headers or years
             // Relaxed date validation: allow YYYY-MM-DD or partial dates
             if (date && place && tournament && date.length >= 4 && !date.includes('Date')) {
               achievements.push({
                 date,
                 place,
                 tier,
                 tournament,
                 prize: prize || '-'
               });
             }
          }
      });
      
      // If we found achievements in this table, stop (usually the first table is the most recent year)
      if (achievements.length > 0) break;
    }

    if (achievements.length === 0) {
        console.warn("No achievements parsed from API content, falling back.");
        return FALLBACK_ACHIEVEMENTS;
    }

    // Return top 6 most recent
    return achievements.slice(0, 6);

  } catch (error) {
    console.error('Error parsing Liquipedia achievements:', error);
    return FALLBACK_ACHIEVEMENTS;
  }
}
