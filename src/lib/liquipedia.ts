export type Achievement = {
  date: string;
  place: string;
  tier: string;
  tournament: string;
  prize: string;
};

const ACHIEVEMENTS: Achievement[] = [
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
  },
  {
    date: "2024-08-12",
    place: "1st",
    tier: "B-Tier",
    tournament: "South Asia Pro League Spring 2024",
    prize: "$7,500"
  },
  {
    date: "2024-06-25",
    place: "4th",
    tier: "S-Tier",
    tournament: "World Invitational 2024",
    prize: "$25,000"
  },
  {
    date: "2024-04-10",
    place: "1st",
    tier: "C-Tier",
    tournament: "Regional Masters Spring",
    prize: "$2,000"
  }
];

export async function getLiquipediaAchievements(): Promise<Achievement[]> {
  // Returning static achievements data as requested, bypassing Liquipedia API
  return ACHIEVEMENTS;
}

