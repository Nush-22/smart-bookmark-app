import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // On the server it's usually better to fail fast and clearly during development.
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables"
  );
}

export async function getSupabaseServerClient(): Promise<SupabaseClient> {
  const cookieStore = cookies();

  return createServerClient(supabaseUrl as string, supabaseAnonKey as string, {
    cookies: {
      async get(name: string) {
        const cookieObject = await cookieStore;
        return cookieObject.get(name)?.value;
      },
      async set(name: string, value: string, options: any) {
        const cookieObject = await cookieStore;
        cookieObject.set(name, value, options);
      },
      async remove(name: string, options: any) {
        const cookieObject = await cookieStore;
        cookieObject.set(name, "", { ...options, maxAge: 0, expires: new Date(0) });
      },
    },
  });
}