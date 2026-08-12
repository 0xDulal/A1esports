import { supabase } from "./supabase/client";

export interface InvestorHighlight {
  id: string;
  title: string;
  category: string;
  metric: string;
  description: string;
  logo?: string;
  display_order?: number;
}

export const defaultInvestors: InvestorHighlight[] = [
  {
    id: "inv-1",
    title: "South Asian Market Leader",
    category: "Market Position",
    metric: "1.5M+ Fans",
    description: "Commanding the region's largest fan engagement in PUBG Mobile, with expanding operations in regional leagues.",
    logo: "",
    display_order: 1,
  },
  {
    id: "inv-2",
    title: "Multi-Channel Revenue Model",
    category: "Financials",
    metric: "4 Revenue Streams",
    description: "Diversified revenue model spanning e-commerce merchandise, brand sponsorships, tournament prize pools, and digital content.",
    logo: "",
    display_order: 2,
  },
  {
    id: "inv-3",
    title: "Bootcamp & HQ Infrastructure",
    category: "Assets",
    metric: "Dhaka HQ",
    description: "Dedicated pro bootcamps, media production facilities, and strategic infrastructure in Dhaka.",
    logo: "",
    display_order: 3,
  },
];

const LOCAL_STORAGE_KEY = "a1_investors_list_v1";

export function getLocalInvestors(): InvestorHighlight[] | null {
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

export function saveLocalInvestors(investors: InvestorHighlight[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(investors));
  } catch {}
}

export async function getInvestors(): Promise<InvestorHighlight[]> {
  const local = getLocalInvestors();

  try {
    let { data, error } = await supabase
      .from("investors")
      .select("*")
      .order("display_order", { ascending: true, nullsFirst: false });

    // Fallback if display_order column doesn't exist yet
    if (error && error.message?.includes("display_order")) {
      const fallback = await supabase.from("investors").select("*");
      data = fallback.data;
      error = fallback.error;
    }

    if (!error && data && data.length > 0) {
      const mapped: InvestorHighlight[] = data.map((i: any, idx: number) => ({
        id: String(i.id),
        title: i.title,
        category: i.category,
        metric: i.metric,
        description: i.description,
        logo: i.logo || "",
        display_order: i.display_order ?? idx + 1,
      }));
      if (data[0]?.display_order !== undefined) {
        mapped.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
      }
      saveLocalInvestors(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn("Supabase fetch note for investors:", err);
  }

  return local || defaultInvestors;
}

export async function saveInvestorToSupabase(investor: InvestorHighlight): Promise<boolean> {
  try {
    const rowWithOrder = {
      id: investor.id,
      title: investor.title,
      category: investor.category,
      metric: investor.metric,
      description: investor.description,
      logo: investor.logo || "",
      display_order: investor.display_order ?? 1,
    };

    let { error } = await supabase.from("investors").upsert(rowWithOrder);
    if (error && error.message?.includes("display_order")) {
      const { display_order, ...rowWithoutOrder } = rowWithOrder;
      const res = await supabase.from("investors").upsert(rowWithoutOrder);
      error = res.error;
    }

    if (error) {
      console.warn("Supabase note saving investor:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

export async function saveAllInvestorsToSupabase(investors: InvestorHighlight[]): Promise<boolean> {
  try {
    const rowsWithOrder = investors.map((i, idx) => ({
      id: i.id,
      title: i.title,
      category: i.category,
      metric: i.metric,
      description: i.description,
      logo: i.logo || "",
      display_order: idx + 1,
    }));

    let { error } = await supabase.from("investors").upsert(rowsWithOrder);
    if (error && error.message?.includes("display_order")) {
      const rowsWithoutOrder = rowsWithOrder.map(({ display_order, ...rest }) => rest);
      const res = await supabase.from("investors").upsert(rowsWithoutOrder);
      error = res.error;
    }

    if (error) {
      console.warn("Supabase note batch saving investors order:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

export async function deleteInvestorFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("investors").delete().eq("id", id);
    if (error) {
      console.error("Failed deleting investor from Supabase:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error deleting investor:", err);
    return false;
  }
}
