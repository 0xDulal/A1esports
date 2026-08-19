import { supabase } from "./client";
import { shopProducts, Product } from "@/lib/data/shop";
import { teams, Team } from "@/lib/teams";
import { newsArticles, NewsArticle } from "@/lib/data/news";

/**
 * Fetch products directly from Supabase Cloud DB.
 */
export async function getProductsFromSupabase(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((item: any) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      price: Number(item.price),
      halfSleevePrice: item.half_sleeve_price ? Number(item.half_sleeve_price) : undefined,
      fullSleevePrice: item.full_sleeve_price ? Number(item.full_sleeve_price) : undefined,
      image: item.image,
      images: item.images || [item.image],
      category: item.category,
      isSoldOut: item.is_sold_out || false,
      description: item.description || "",
      canCustomise: item.can_customise || false,
    }));
  } catch {
    return [];
  }
}

/**
 * Fetch teams and players directly from Supabase Cloud DB.
 */
export async function getTeamsFromSupabase(): Promise<Team[]> {
  try {
    const { data: teamsData, error: tErr } = await supabase.from("teams").select("*");
    const { data: playersData } = await supabase.from("players").select("*");

    if (tErr || !teamsData) {
      return [];
    }

    return teamsData.map((t: any) => ({
      id: t.id,
      name: t.name,
      game: t.game,
      logo: t.logo,
      banner: t.banner,
      players: (playersData || [])
        .filter((p: any) => p.team_id === t.id)
        .map((p: any) => ({
          ign: p.ign,
          name: p.name,
          role: p.role,
          image: p.image,
          socials: p.socials || {},
        })),
    }));
  } catch {
    return [];
  }
}

/**
 * Fetch news articles from Supabase Cloud DB.
 */
export async function getNewsFromSupabase(): Promise<NewsArticle[]> {
  try {
    const { data, error } = await supabase
      .from("news_articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((item: any) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      category: item.category,
      date: item.date,
      readTime: item.read_time,
      author: item.author,
      image: item.image,
      summary: item.summary,
      content: item.content || [],
      tags: item.tags || [],
    }));
  } catch {
    return [];
  }
}

export type PaymentMethod = {
  id: string;
  name: string;
  type: "cod" | "digital";
  account_number: string;
  instructions: string;
  is_active: boolean;
};

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [];

export async function getPaymentMethodsFromSupabase(): Promise<PaymentMethod[]> {
  try {
    const { data, error } = await supabase.from("payment_methods").select("*");
    if (error || !data) {
      return [];
    }
    return data as PaymentMethod[];
  } catch {
    return [];
  }
}

export type Coupon = {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number;
  max_uses?: number;
  uses_count?: number;
  is_active: boolean;
  expires_at?: string;
};

export const DEFAULT_COUPONS: Coupon[] = [];

export async function getCouponsFromSupabase(): Promise<Coupon[]> {
  try {
    const { data, error } = await supabase.from("coupons").select("*");
    if (error || !data) {
      return [];
    }
    return data as Coupon[];
  } catch {
    return [];
  }
}

export type DeliveryCharges = {
  inside_dhaka: number;
  outside_dhaka: number;
};

export const DEFAULT_DELIVERY_CHARGES: DeliveryCharges = {
  inside_dhaka: 60,
  outside_dhaka: 120,
};

export async function getDeliveryChargesFromSupabase(): Promise<DeliveryCharges> {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "delivery_charges")
      .single();
    if (error || !data || !data.value) {
      return DEFAULT_DELIVERY_CHARGES;
    }
    return data.value as DeliveryCharges;
  } catch {
    return DEFAULT_DELIVERY_CHARGES;
  }
}

export type DBItemAchievement = {
  id?: string;
  title: string;
  rank: string;
  event: string;
  year: string;
  date?: string;
  tier?: string;
  prize?: string;
};

export async function getAchievementsFromSupabase(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((item: any) => ({
      id: item.id,
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

export async function getCombinedAchievements(): Promise<any[]> {
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

    // Default 'merged': Combine Liquipedia + Custom achievements
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


