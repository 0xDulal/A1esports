import { supabase } from "@/lib/supabase/client";
import {
  Product,
  Team,
  Player,
  NewsArticle,
  PaymentMethod,
  Coupon,
  DeliveryCharges,
  Achievement,
} from "@/types/domain";

export const DEFAULT_DELIVERY_CHARGES: DeliveryCharges = {
  inside_dhaka: 60,
  outside_dhaka: 120,
};

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [];
export const DEFAULT_COUPONS: Coupon[] = [];

/**
 * Products Service
 */
export async function getProductsFromSupabase(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.warn("Supabase products fetch note:", error?.message);
      return [];
    }

    return data.map((item: any) => ({
      id: String(item.id),
      slug: item.slug || "",
      title: item.title || "",
      price: Number(item.price) || 0,
      halfSleevePrice: item.half_sleeve_price ? Number(item.half_sleeve_price) : undefined,
      fullSleevePrice: item.full_sleeve_price ? Number(item.full_sleeve_price) : undefined,
      image: item.image || "",
      images: item.images || [item.image || ""],
      category: item.category || "JERSEYS",
      isSoldOut: Boolean(item.is_sold_out),
      description: item.description || "",
      canCustomise: Boolean(item.can_customise),
    }));
  } catch (err) {
    console.error("Failed to fetch products from Supabase:", err);
    return [];
  }
}

/**
 * Teams & Players Service
 */
export async function getTeamsFromSupabase(): Promise<Team[]> {
  try {
    const { data: teamsData, error: tErr } = await supabase.from("teams").select("*");
    const { data: playersData } = await supabase.from("players").select("*");

    if (tErr || !teamsData) {
      console.warn("Supabase teams fetch note:", tErr?.message);
      return [];
    }

    return teamsData.map((t: any) => ({
      id: String(t.id),
      name: t.name || "",
      game: t.game || "",
      logo: t.logo || "",
      banner: t.banner || "",
      players: (playersData || [])
        .filter((p: any) => String(p.team_id) === String(t.id))
        .map((p: any): Player => ({
          id: String(p.id),
          ign: p.ign || "",
          name: p.name || "",
          role: p.role || "",
          image: p.image || "",
          socials: p.socials || {},
        })),
    }));
  } catch (err) {
    console.error("Failed to fetch teams from Supabase:", err);
    return [];
  }
}

/**
 * News Articles Service
 */
export async function getNewsFromSupabase(): Promise<NewsArticle[]> {
  try {
    const { data, error } = await supabase
      .from("news_articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.warn("Supabase news fetch note:", error?.message);
      return [];
    }

    return data.map((item: any): NewsArticle => ({
      id: String(item.id),
      slug: item.slug || String(item.id),
      title: item.title || "",
      category: item.category || "ANNOUNCEMENT",
      date: item.date || new Date().toISOString().split("T")[0],
      readTime: item.read_time || item.readTime || "3 min read",
      author: item.author || "A1 Esports",
      image: item.image || "",
      summary: item.summary || "",
      content: Array.isArray(item.content) ? item.content : [item.content || ""],
      tags: Array.isArray(item.tags) ? item.tags : [],
    }));
  } catch (err) {
    console.error("Failed to fetch news from Supabase:", err);
    return [];
  }
}

/**
 * Single News Article Fetch by Slug
 */
export async function getNewsBySlugFromSupabase(slug: string): Promise<NewsArticle | null> {
  try {
    const { data, error } = await supabase
      .from("news_articles")
      .select("*")
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: String(data.id),
      slug: data.slug || String(data.id),
      title: data.title || "",
      category: data.category || "ANNOUNCEMENT",
      date: data.date || new Date().toISOString().split("T")[0],
      readTime: data.read_time || data.readTime || "3 min read",
      author: data.author || "A1 Esports",
      image: data.image || "",
      summary: data.summary || "",
      content: Array.isArray(data.content) ? data.content : [data.content || ""],
      tags: Array.isArray(data.tags) ? data.tags : [],
    };
  } catch {
    return null;
  }
}

/**
 * Payment Methods Service
 */
export async function getPaymentMethodsFromSupabase(): Promise<PaymentMethod[]> {
  try {
    const { data, error } = await supabase.from("payment_methods").select("*");
    if (error || !data) return [];
    return data as PaymentMethod[];
  } catch {
    return [];
  }
}

/**
 * Coupons Service
 */
export async function getCouponsFromSupabase(): Promise<Coupon[]> {
  try {
    const { data, error } = await supabase.from("coupons").select("*");
    if (error || !data) return [];
    return data as Coupon[];
  } catch {
    return [];
  }
}

/**
 * Delivery Charges Service
 */
export async function getDeliveryChargesFromSupabase(): Promise<DeliveryCharges> {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "delivery_charges")
      .single();
    if (error || !data || !data.value) return DEFAULT_DELIVERY_CHARGES;
    return data.value as DeliveryCharges;
  } catch {
    return DEFAULT_DELIVERY_CHARGES;
  }
}

/**
 * Achievements Service
 */
export async function getAchievementsFromSupabase(): Promise<Achievement[]> {
  try {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return [];

    return data.map((item: any): Achievement => ({
      id: String(item.id),
      date: item.date || item.year || new Date().toISOString().split("T")[0],
      place: item.rank || item.title || "1st",
      tier: item.tier || "B-Tier",
      tournament: item.event || item.title || "Tournament",
      prize: item.prize || "$0",
    }));
  } catch {
    return [];
  }
}

export async function getAchievementSourceMode(): Promise<"merged" | "liquipedia" | "custom"> {
  try {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "achievement_source")
      .single();
    return data?.value?.mode || "merged";
  } catch {
    return "merged";
  }
}

export async function getCombinedAchievements(): Promise<Achievement[]> {
  const { getLiquipediaAchievements } = await import("@/lib/liquipedia");

  try {
    const mode = await getAchievementSourceMode();

    if (mode === "liquipedia") {
      return await getLiquipediaAchievements();
    }

    const customItems = await getAchievementsFromSupabase();

    if (mode === "custom") {
      return customItems.length > 0 ? customItems : await getLiquipediaAchievements();
    }

    const liquipediaItems = await getLiquipediaAchievements();
    const existingTournaments = new Set(
      liquipediaItems.map((item) => item.tournament.toLowerCase().trim())
    );

    const uniqueCustom = customItems.filter(
      (c) => !existingTournaments.has(c.tournament.toLowerCase().trim())
    );

    const merged = [...liquipediaItems, ...uniqueCustom];

    merged.sort((a, b) => {
      const timeA = a.date ? new Date(a.date).getTime() : 0;
      const timeB = b.date ? new Date(b.date).getTime() : 0;
      return timeB - timeA;
    });

    return merged;
  } catch {
    return await getLiquipediaAchievements();
  }
}
