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
  banner?: string;
  players: Player[];
  achievements?: {
    title: string;
    rank: string;
    event: string;
    year: string;
  }[];
}

export const teams: Team[] = [];
