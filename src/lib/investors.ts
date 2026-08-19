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

export const defaultInvestors: InvestorHighlight[] = [];

export async function getInvestors(): Promise<InvestorHighlight[]> {
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

    if (!error && data) {
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
      return mapped;
    }
  } catch (err) {
    console.warn("Supabase fetch note for investors:", err);
  }

  return [];
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
