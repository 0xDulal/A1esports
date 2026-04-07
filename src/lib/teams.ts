export interface Player {
  ign: string;
  name: string;
  role: string;
  image: string;
  socials?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
}

export interface Team {
  id: string;
  name: string;
  game: string;
  logo: string;
  banner: string;
  players: Player[];
  achievements?: {
    title: string;
    rank: string;
    event: string;
    year: string;
  }[];
}

export const teams: Team[] = [
  {
    id: "pubgm-pro",
    name: "A1 Esports Professional",
    game: "PUBG Mobile",
    logo: "/images/games/pubgm.png",
    banner: "/images/banners/pubgm-team.jpg",
    players: [
      {
        ign: "SiNiSTER",
        name: "MD Abdul Jabbar Shakil",
        role: "IGL",
        image: "/images/players/SiNiSTER.png",
        socials: {
          facebook: "https://facebook.com/a1esportsbd",
          instagram: "https://instagram.com/a1esportsbd",
          youtube: "https://youtube.com/@a1esportsbd",
        }
      },
      {
        ign: "ROWDY",
        name: "Emon Sheikh",
        role: "FRAGGER",
        image: "/images/players/ROWDY.png",
        socials: {
          facebook: "https://facebook.com/a1esportsbd",
          instagram: "https://instagram.com/a1esportsbd",
          youtube: "https://youtube.com/@a1esportsbd",
        }
      },
      {
        ign: "DEATHSTORM",
        name: "Hasan Mahmood",
        role: "SNIPER",
        image: "/images/players/DEATHSTORM.png",
        socials: {
          facebook: "https://facebook.com/a1esportsbd",
          instagram: "https://instagram.com/a1esportsbd",
          youtube: "https://youtube.com/@a1esportsbd",
        }
      },
      {
        ign: "CJBOYY",
        name: "Tahmid Aronno",
        role: "RUSHER",
        image: "/images/players/CJBOYY.png",
        socials: {
          facebook: "https://facebook.com/a1esportsbd",
          instagram: "https://instagram.com/a1esportsbd",
          youtube: "https://youtube.com/@a1esportsbd",
        }
      },
      {
        ign: "FLASH",
        name: "Tausif Rahman",
        role: "SUPPORT",
        image: "/images/players/FLASH.png",
        socials: {
          facebook: "https://facebook.com/a1esportsbd",
          instagram: "https://instagram.com/a1esportsbd",
          youtube: "https://youtube.com/@a1esportsbd",
        }
      },
    ],
    achievements: [
      { title: "Champions", rank: "1st", event: "PMPL South Asia Spring 2023", year: "2023" },
      { title: "Finalists", rank: "Top 16", event: "PMGC 2022", year: "2022" },
    ]
  },
  {
    id: "management",
    name: "Management Team",
    game: "Owner & Management",
    logo: "/A1esports_logo_white.svg",
    banner: "/images/banners/staff.jpg",
    players: [
      {
        ign: "MD Abdul Jabbar Shakil",
        name: "SiNiSTER",
        role: "Owner of A1 Esports",
        image: "/images/management/shakil.jpg",
        socials: {
          facebook: "https://facebook.com/a1esportsbd",
          instagram: "https://instagram.com/a1esportsbd",
          youtube: "https://youtube.com/@a1esportsbd",
        }
      },
      {
        ign: "Srabon Shanto",
        name: "Manager",
        role: "Strabon Thought",
        image: "/images/management/srabon.jpg",
        socials: {
          facebook: "https://facebook.com/a1esportsbd",
          instagram: "https://instagram.com/a1esportsbd",
          youtube: "https://youtube.com/@a1esportsbd",
        }
      },
      {
        ign: "Dulal Shikdar",
        name: "Owner of Zer0byte",
        role: "Lead Developer",
        image: "/images/management/dulal.png",
        socials: {
          facebook: "https://facebook.com/a1esportsbd",
          instagram: "https://instagram.com/a1esportsbd",
          youtube: "https://youtube.com/@a1esportsbd",
        }
      }
    ]
  }
];
