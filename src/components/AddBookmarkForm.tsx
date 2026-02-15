"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

type AddBookmarkFormProps = {
  userId: string;
};

export default function AddBookmarkForm({ userId }: AddBookmarkFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError("URL is required.");
      return;
    }

    try {
      // Basic URL validation
      // Will throw for invalid URLs
      // eslint-disable-next-line no-new
      new URL(url.trim());
    } catch {
      setError("Please enter a valid URL.");
      return;
    }

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: insertError } = await supabase.from("bookmarks").insert({
        user_id: userId,
        title: title.trim(),
        url: url.trim(),
      });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setTitle("");
      setUrl("");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong while saving the bookmark.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white/80 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-0 transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            placeholder="e.g. Next.js docs"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-0 transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            placeholder="https://example.com/article"
            required
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-md bg-black px-4 py-2 text-xs font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-black dark:hover:bg-white"
        >
          {loading ? "Saving..." : "Add bookmark"}
        </button>
      </div>
    </form>
  );
}

