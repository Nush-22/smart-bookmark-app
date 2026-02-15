import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export default async function Home() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  redirect("/dashboard");
}
