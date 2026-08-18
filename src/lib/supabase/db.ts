import { supabase } from "./client";
import { shopProducts, Product } from "@/lib/data/shop";
import { teams, Team } from "@/lib/teams";
import { newsArticles, NewsArticle } from "@/lib/data/news";

/**
 * Fetch products directly from Supabase Cloud DB with fallback to static dataset.
 */
export async function getProductsFromSupabase(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return shopProducts;
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
    return shopProducts;
  }
}

/**
 * Fetch teams and players directly from Supabase Cloud DB.
 */
export async function getTeamsFromSupabase(): Promise<Team[]> {
  try {
    const { data: teamsData, error: tErr } = await supabase.from("teams").select("*");
    const { data: playersData } = await supabase.from("players").select("*");

    if (tErr || !teamsData || teamsData.length === 0) {
      return teams;
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
    return teams;
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

    if (error || !data || data.length === 0) {
      return newsArticles;
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
    return newsArticles;
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

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm-cod",
    name: "Cash on Delivery",
    type: "cod",
    account_number: "",
    instructions: "Pay in cash upon delivery to your doorstep",
    is_active: true,
  },
  {
    id: "pm-bkash",
    name: "bKash",
    type: "digital",
    account_number: "01700000000",
    instructions: "Send Money (Personal) to 01700000000",
    is_active: true,
  },
  {
    id: "pm-nagad",
    name: "Nagad",
    type: "digital",
    account_number: "01700000000",
    instructions: "Send Money (Personal) to 01700000000",
    is_active: true,
  },
  {
    id: "pm-rocket",
    name: "Rocket",
    type: "digital",
    account_number: "01700000000-7",
    instructions: "Send Money (Personal) to 01700000000-7",
    is_active: true,
  },
];

export async function getPaymentMethodsFromSupabase(): Promise<PaymentMethod[]> {
  try {
    const { data, error } = await supabase.from("payment_methods").select("*");
    if (error || !data || data.length === 0) {
      return DEFAULT_PAYMENT_METHODS;
    }
    return data as PaymentMethod[];
  } catch {
    return DEFAULT_PAYMENT_METHODS;
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

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: "cpn-a1welcome",
    code: "A1WELCOME",
    discount_type: "fixed",
    discount_value: 100,
    min_order_amount: 500,
    is_active: true,
  },
  {
    id: "cpn-a1esports10",
    code: "A1ESPORTS10",
    discount_type: "percentage",
    discount_value: 10,
    min_order_amount: 1000,
    is_active: true,
  },
];

export async function getCouponsFromSupabase(): Promise<Coupon[]> {
  try {
    const { data, error } = await supabase.from("coupons").select("*");
    if (error || !data || data.length === 0) {
      return DEFAULT_COUPONS;
    }
    return data as Coupon[];
  } catch {
    return DEFAULT_COUPONS;
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

