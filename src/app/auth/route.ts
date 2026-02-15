import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(errorDescription || error)}`,
          request.url
        )
      );
    }

    if (code) {
      const supabase = await getSupabaseServerClient();
      await supabase.auth.exchangeCodeForSession(code);
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Authentication failed";
    console.error("Auth callback error:", err);
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(message)}`,
        request.url
      )
    );
  }
}
