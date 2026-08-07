import { sbSelect } from "./supabase/rest";

export interface Sponsor {
  id: string;
  name: string;
  category: string;
  badge: string;
  description: string;
  logo: string;
  websiteUrl?: string;
}

export const defaultSponsors: Sponsor[] = [
  {
    id: "sp-1",
    name: "Airtel Bangladesh",
    category: "Title & Telecom Partner",
    badge: "Official Sponsor",
    description: "Empowering fast 4G/5G connectivity and supporting competitive esports events across Bangladesh.",
    logo: "AIRTEL",
    websiteUrl: "https://bd.airtel.com",
  },
  {
    id: "sp-2",
    name: "ROG - Republic of Gamers",
    category: "Hardware & Device Partner",
    badge: "Gear Partner",
    description: "Providing high-performance gaming hardware, monitors, and laptops for A1 bootcamps and stage setups.",
    logo: "ROG",
    websiteUrl: "https://rog.asus.com",
  },
  {
    id: "sp-3",
    name: "Red Bull",
    category: "Energy Drink Partner",
    badge: "Official Partner",
    description: "Fueling the focus, stamina, and training of A1 Esports pro athletes.",
    logo: "RED BULL",
    websiteUrl: "https://redbull.com",
  },
  {
    id: "sp-4",
    name: "Logitech G",
    category: "Peripherals Partner",
    badge: "Official Partner",
    description: "Equipping our athletes with LIGHTSPEED wireless gaming mice and mechanical keyboards.",
    logo: "LOGITECH G",
    websiteUrl: "https://logitechg.com",
  },
];

export async function getSponsors(): Promise<Sponsor[]> {
  const dbData = await sbSelect<Sponsor>("sponsors");
  if (dbData && dbData.length > 0) {
    return dbData;
  }
  return defaultSponsors;
}
