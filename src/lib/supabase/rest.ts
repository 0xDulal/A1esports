export function getSupabaseConfig() {
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "";
  const key =
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";
  return { url, key };
}

export function supabaseHeaders() {
  const { key } = getSupabaseConfig();
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  } as Record<string, string>;
}

export async function sbSelect(table: string, query: Record<string, string> = {}) {
  const { url } = getSupabaseConfig();
  if (!url) return [];
  const qs = new URLSearchParams(query).toString();
  const res = await fetch(`${url}/rest/v1/${table}${qs ? `?${qs}` : ""}`, {
    headers: supabaseHeaders(),
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

