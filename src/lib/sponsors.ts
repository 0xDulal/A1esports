import { supabase } from "./supabase/client";

export interface Sponsor {
  id: string;
  name: string;
  category: string;
  badge: string;
  description: string;
  logo: string;
  websiteUrl?: string;
  display_order?: number;
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
    display_order: 1,
  },
  {
    id: "sp-2",
    name: "ROG - Republic of Gamers",
    category: "Hardware & Device Partner",
    badge: "Gear Partner",
    description: "Providing high-performance gaming hardware, monitors, and laptops for A1 bootcamps and stage setups.",
    logo: "ROG",
    websiteUrl: "https://rog.asus.com",
    display_order: 2,
  },
  {
    id: "sp-3",
    name: "Red Bull",
    category: "Energy Drink Partner",
    badge: "Official Partner",
    description: "Fueling the focus, stamina, and training of A1 Esports pro athletes.",
    logo: "RED BULL",
    websiteUrl: "https://redbull.com",
    display_order: 3,
  },
  {
    id: "sp-4",
    name: "Logitech G",
    category: "Peripherals Partner",
    badge: "Official Partner",
    description: "Equipping our athletes with LIGHTSPEED wireless gaming mice and mechanical keyboards.",
    logo: "LOGITECH G",
    websiteUrl: "https://logitechg.com",
    display_order: 4,
  },
];

const LOCAL_STORAGE_KEY = "a1_sponsors_list_v1";

export function getLocalSponsors(): Sponsor[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return null;
}

export function saveLocalSponsors(sponsors: Sponsor[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sponsors));
  } catch {}
}

export async function getSponsors(): Promise<Sponsor[]> {
  const local = getLocalSponsors();

  try {
    let { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .order("display_order", { ascending: true, nullsFirst: false });

    // Fallback if display_order column doesn't exist yet
    if (error && error.message?.includes("display_order")) {
      const fallback = await supabase.from("sponsors").select("*");
      data = fallback.data;
      error = fallback.error;
    }

    if (!error && data && data.length > 0) {
      const mapped: Sponsor[] = data.map((s: any, idx: number) => ({
        id: String(s.id),
        name: s.name,
        category: s.category,
        badge: s.badge,
        description: s.description,
        logo: s.logo,
        websiteUrl: s.website_url || s.websiteUrl || "",
        display_order: s.display_order ?? idx + 1,
      }));
      if (data[0]?.display_order !== undefined) {
        mapped.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
      }
      saveLocalSponsors(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn("Supabase fetch note for sponsors:", err);
  }

  return local || defaultSponsors;
}

export async function saveSponsorToSupabase(sponsor: Sponsor): Promise<boolean> {
  try {
    const rowWithOrder = {
      id: sponsor.id,
      name: sponsor.name,
      category: sponsor.category,
      badge: sponsor.badge,
      description: sponsor.description,
      logo: sponsor.logo,
      website_url: sponsor.websiteUrl || "",
      display_order: sponsor.display_order ?? 1,
    };

    let { error } = await supabase.from("sponsors").upsert(rowWithOrder);
    if (error && error.message?.includes("display_order")) {
      const { display_order, ...rowWithoutOrder } = rowWithOrder;
      const res = await supabase.from("sponsors").upsert(rowWithoutOrder);
      error = res.error;
    }

    if (error) {
      console.warn("Supabase note saving sponsor:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

export async function saveAllSponsorsToSupabase(sponsors: Sponsor[]): Promise<boolean> {
  try {
    const rowsWithOrder = sponsors.map((s, idx) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      badge: s.badge,
      description: s.description,
      logo: s.logo,
      website_url: s.websiteUrl || "",
      display_order: idx + 1,
    }));

    let { error } = await supabase.from("sponsors").upsert(rowsWithOrder);
    if (error && error.message?.includes("display_order")) {
      const rowsWithoutOrder = rowsWithOrder.map(({ display_order, ...rest }) => rest);
      const res = await supabase.from("sponsors").upsert(rowsWithoutOrder);
      error = res.error;
    }

    if (error) {
      console.warn("Supabase note batch saving sponsors order:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

export async function deleteSponsorFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("sponsors").delete().eq("id", id);
    if (error) {
      console.error("Failed deleting sponsor from Supabase:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error deleting sponsor:", err);
    return false;
  }
}
