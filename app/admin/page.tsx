import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminIndexPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  redirect("/admin/dashboard");
}