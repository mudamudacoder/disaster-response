"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createOfficialUpdate(formData: FormData) {
  const supabase = createClient();

  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const source_organization = String(formData.get("source_organization") || "").trim();
  const source_url = String(formData.get("source_url") || "").trim();
  const published_at = String(formData.get("published_at") || "").trim();

  if (!title || !summary || !source_organization || !source_url || !published_at) {
    throw new Error("All fields are required.");
  }

  const { error } = await supabase.from("official_updates").insert({
    title,
    summary,
    source_organization,
    source_url,
    published_at: new Date(published_at).toISOString(),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/updates");
  revalidatePath("/updates");
  revalidatePath("/");
}

export async function deleteOfficialUpdate(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("official_updates").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/updates");
  revalidatePath("/updates");
  revalidatePath("/");
}