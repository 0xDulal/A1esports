import * as cheerio from "cheerio";

export type Achievement = {
  date: string;
  place: string;
  tier: string;
  tournament: string;
  prize: string;
};

const FALLBACK_ACHIEVEMENTS: Achievement[] = [
  {
    date: "2026-05-17",
    place: "13th",
    tier: "A-Tier",
    tournament: "PUBG Mobile Global Open 2026 Season 1 - South Asia Finals",
    prize: "$1,000",
  },
  {
    date: "2026-04-15",
    place: "1st",
    tier: "B-Tier",
    tournament: "PUBG Mobile National Championship Bangladesh 2026 Spring",
    prize: "$2,440",
  },
  {
    date: "2025-10-18",
    place: "1st",
    tier: "B-Tier",
    tournament: "Airtel Gaming Arena",
    prize: "$2,456",
  },
  {
    date: "2025-09-02",
    place: "1st",
    tier: "B-Tier",
    tournament: "PUBG Mobile National Championship Bangladesh Fall 2025",
    prize: "$2,468",
  },
  {
    date: "2025-05-10",
    place: "1st",
    tier: "B-Tier",
    tournament: "PUBG Mobile National Championship Bangladesh Spring 2025",
    prize: "$2,470",
  },
  {
    date: "2024-12-15",
    place: "1st",
    tier: "A-Tier",
    tournament: "PUBG Mobile National Championship BD 2024",
    prize: "$10,000",
  },
  {
    date: "2023-10-15",
    place: "1st",
    tier: "A-Tier",
    tournament: "PUBG Mobile Pro League - South Asia Fall 2023",
    prize: "$10,000",
  },
  {
    date: "2021-01-26",
    place: "15th",
    tier: "S-Tier",
    tournament: "PUBG Mobile Global Championship 2020",
    prize: "$11,500",
  },
];

export async function getLiquipediaAchievements(): Promise<Achievement[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const url =
      "https://liquipedia.net/pubgmobile/api.php?action=parse&page=A1_RG_Esports/Results&format=json&origin=*";
    const res = await fetch(url, {
      headers: {
        "User-Agent": "A1EsportsWebsite/1.0 (contact@a1esportsbd.com)",
        Accept: "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return FALLBACK_ACHIEVEMENTS;
    }

    const json = await res.json();
    const html = json?.parse?.text?.["*"];

    if (!html) {
      return FALLBACK_ACHIEVEMENTS;
    }

    const $ = cheerio.load(html);
    const rawResults: Achievement[] = [];

    $("tr").each((_, tr) => {
      const tds = $(tr).find("td");
      if (tds.length >= 4) {
        const date = $(tds[0]).text().trim();
        const place = $(tds[1]).text().trim();
        const tier = $(tds[2]).text().trim();
        const tournament = $(tds[3]).text().trim() || $(tds[4]).text().trim();
        let prize = $(tds[5])?.text()?.trim() || $(tds[4])?.text()?.trim() || "$0";

        if (prize === "-" || !prize) prize = "$0";

        if (date && place && tournament && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
          rawResults.push({
            date,
            place,
            tier: tier || "B-Tier",
            tournament,
            prize,
          });
        }
      }
    });

    if (rawResults.length > 0) {
      // Sort strictly by date descending
      rawResults.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      return rawResults;
    }
  } catch (err) {
    console.error("Direct Liquipedia fetch note:", err);
  }

  return FALLBACK_ACHIEVEMENTS;
}
