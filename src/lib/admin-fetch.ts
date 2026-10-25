"use client";

/**
 * Client-side helper to call an admin API route with the user's Supabase
 * session attached, so the route's server-side requireAdmin() check passes.
 */

function storageKey(): string {
  // supabase-js persists sessions under `sb-<first-label-of-host>-auth-token`.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  let ref = "supabase";
  try {
    const host = new URL(url).hostname;
    // supabase.com projects: <ref>.supabase.co; self-hosted: first label of host
    if (host.endsWith(".supabase.co")) ref = host.split(".")[0];
    else if (host.startsWith("supabase.")) ref = "supabase";
    else ref = host.split(".")[0];
  } catch {}
  return `sb-${ref}-auth-token`;
}

async function getSessionToken(): Promise<string> {
  try {
    const raw = window.localStorage.getItem(storageKey());
    if (!raw) return "";
    const session = JSON.parse(raw);
    return session?.access_token || "";
  } catch {
    return "";
  }
}

export async function adminFetch(
  input: string,
  init: RequestInit = {}
): Promise<Response> {
  const token = await getSessionToken();
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> | undefined),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return fetch(input, { ...init, headers });
}
