 "use client";

import { useEffect, useOptimistic, useTransition } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

type BookmarkListProps = {
  initialBookmarks: Bookmark[];
  onDelete: (id: string) => Promise<void>;
  userId: string;
};

export default function BookmarkList({
  initialBookmarks,
  onDelete,
  userId,
}: BookmarkListProps) {
  const [optimisticBookmarks, applyOptimisticUpdate] =
    useOptimistic<Bookmark[]>(initialBookmarks);
  const [isPending, startTransition] = useTransition();

  // Supabase Realtime subscription for this user's bookmarks
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel(`bookmarks:user:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newBookmark = payload.new as Bookmark;
          applyOptimisticUpdate((current) => {
            // Avoid duplicates
            if (current.some((b) => b.id === newBookmark.id)) {
              return current;
            }
            return [newBookmark, ...current];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const deletedId = (payload.old as { id: string }).id;
          applyOptimisticUpdate((current) =>
            current.filter((b) => b.id !== deletedId)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [applyOptimisticUpdate, userId]);

  const handleDelete = (id: string) => {
    applyOptimisticUpdate((current) =>
      current.filter((bookmark) => bookmark.id !== id)
    );

    startTransition(() => {
      void onDelete(id);
    });
  };

  if (!optimisticBookmarks.length) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-white/60 p-6 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
        <p className="font-medium text-zinc-800 dark:text-zinc-100">
          No bookmarks yet
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          When you save bookmarks, they’ll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      {optimisticBookmarks.map((bookmark) => (
        <article
          key={bookmark.id}
          className="group flex flex-col justify-between rounded-xl border border-zinc-200 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700"
        >
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 line-clamp-2 dark:text-zinc-50">
              {bookmark.title}
            </h3>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex max-w-full items-center text-xs text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
            >
              <span className="truncate">{bookmark.url}</span>
            </a>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => handleDelete(bookmark.id)}
              disabled={isPending}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

