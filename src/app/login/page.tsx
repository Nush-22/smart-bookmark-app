"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/dashboard");
      }
    };

    void checkSession();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const supabase = getSupabaseBrowserClient();
      const origin =
        typeof window !== "undefined" ? window.location.origin : undefined;

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: origin ? `${origin}/auth` : undefined,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign-in failed. Please try again.";
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <section className="flex w-full max-w-md flex-col items-center rounded-xl border border-zinc-200 bg-white/80 p-8 text-center shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
        <h1 className="text-2xl font-semibold tracking-tight">
          Sign in to Smart Bookmark
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Use your Google account to continue.
        </p>
        {error && (
          <div className="mt-4 w-full rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-black dark:hover:bg-white"
        >
          <span>{isLoading ? "Signing in..." : "Sign in with Google"}</span>
        </button>
      </section>
    </main>
  );
}

