"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

type UserMenuProps = {
  user: User;
};

export default function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const avatarUrl =
    (user.user_metadata && user.user_metadata.avatar_url) || undefined;
  const displayName =
    (user.user_metadata && user.user_metadata.full_name) ||
    user.email ||
    "User";

  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={displayName ?? "User avatar"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex flex-col items-start text-sm">
        <span className="font-medium text-zinc-900 dark:text-zinc-50">
          {displayName}
        </span>
        {user.email && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {user.email}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        className="ml-4 rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        Log out
      </button>
    </div>
  );
}

