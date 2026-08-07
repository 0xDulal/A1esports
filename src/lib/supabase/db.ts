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
