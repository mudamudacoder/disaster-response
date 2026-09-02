import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Ensures the current request comes from an authenticated admin.
 * Redirects to /admin/login if not signed in, or shows nothing further
 * if signed in but not an admin (caller should handle that case).
 */
export async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/admin/not-authorized");
  }

  return { supabase, user };
}