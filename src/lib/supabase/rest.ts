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

export async function sbSelect<T = any>(table: string, query: Record<string, string> = {}): Promise<T[]> {
  const { url } = getSupabaseConfig();
  if (!url) return [];
  const qs = new URLSearchParams(query).toString();
  const res = await fetch(`${url}/rest/v1/${table}${qs ? `?${qs}` : ""}`, {
    headers: supabaseHeaders(),
    cache: "no-store",
  });
  if (!res.ok) return [];
  try {
    return await res.json();
  } catch {
    return [];
  }
}

export async function sbInsert<T = any>(table: string, payload: any): Promise<T | null> {
  const { url } = getSupabaseConfig();
  if (!url) return null;
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: supabaseHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) return null;
  try {
    const json = await res.json();
    return Array.isArray(json) ? json[0] : json;
  } catch {
    return null;
  }
}

export async function sbUpdate<T = any>(table: string, id: string, payload: any): Promise<T | null> {
  const { url } = getSupabaseConfig();
  if (!url) return null;
  const res = await fetch(`${url}/rest/v1/${table}?id=eq.${id}`, {
    method: "PATCH",
    headers: supabaseHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) return null;
  try {
    const json = await res.json();
    return Array.isArray(json) ? json[0] : json;
  } catch {
    return null;
  }
}

export async function sbDelete(table: string, id: string): Promise<boolean> {
  const { url } = getSupabaseConfig();
  if (!url) return false;
  const res = await fetch(`${url}/rest/v1/${table}?id=eq.${id}`, {
    method: "DELETE",
    headers: supabaseHeaders(),
  });
  return res.ok;
}
