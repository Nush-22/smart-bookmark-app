import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import UserMenu from "./UserMenu";

async function deleteBookmark(id: string) {
  "use server";

  const supabase = await getSupabaseServerClient();
  await supabase.from("bookmarks").delete().eq("id", id);
}

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  const { user } = session;

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("id, title, url, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-10 text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-[-8rem] h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-8rem] right-[-4rem] h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl flex-col gap-8 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.9)] backdrop-blur-xl sm:p-8 lg:p-10">
        <header className="flex flex-col gap-4 border-b border-slate-800/80 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              Smart Bookmark
            </h1>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Save and revisit your favorite links with a calm, focused
              workspace.
            </p>
          </div>
          <UserMenu user={user} />
        </header>

        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            Add bookmark
          </h2>
          <AddBookmarkForm userId={user.id} />
        </section>

        <section>
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Your bookmarks
            </h2>
            {bookmarks && bookmarks.length > 0 && (
              <span className="text-xs text-slate-500">
                {bookmarks.length} saved
              </span>
            )}
          </div>
          <BookmarkList
            initialBookmarks={bookmarks ?? []}
            onDelete={deleteBookmark}
            userId={user.id}
          />
        </section>
      </div>
    </main>
  );
}

