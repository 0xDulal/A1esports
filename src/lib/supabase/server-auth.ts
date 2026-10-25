import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

function serviceClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function anonClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
  return createClient(url, key, { auth: { persistSession: false } });
}

function userClient(accessToken: string): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

export type AuthResult =
  | { ok: true; supabase: SupabaseClient; userId: string }
  | { ok: false; response: NextResponse };

/**
 * Server-side admin check for mutating API routes.
 * Validates the request's Bearer JWT against Supabase Auth, then confirms
 * membership in public.admin_users. Returns a user-scoped client whose
 * writes pass the is_admin() RLS policies, or a 401/403 response.
 */
export async function requireAdmin(req: Request): Promise<AuthResult> {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const supabase = anonClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const authenticatedSupabase = userClient(token);

  // Membership check via RLS: admin_users SELECT policy only lets the
  // user see their own row, so a row existing means they are an admin.
  const { data: membership } = await authenticatedSupabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!membership) {
    const email = data.user.email?.trim().toLowerCase();
    if (email && adminEmails.includes(email)) {
      const elevatedClient = serviceClient();
      if (elevatedClient) {
        return { ok: true, supabase: elevatedClient, userId: data.user.id };
      }

      return {
        ok: false,
        response: NextResponse.json(
          { error: "Admin email is allowlisted, but server admin credentials are not configured." },
          { status: 500 }
        ),
      };
    }

    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true, supabase: authenticatedSupabase, userId: data.user.id };
}

/** Client used for public (unauthenticated) operations: checkout order insert. */
export function publicClient(): SupabaseClient {
  return anonClient();
}
