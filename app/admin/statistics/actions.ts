"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createStatistic(formData: FormData) {
  const supabase = createClient();

  const category = String(formData.get("category") || "").trim();
  const valueRaw = String(formData.get("value") || "").trim();
  const unit = String(formData.get("unit") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const source_organization = String(formData.get("source_organization") || "").trim();
  const source_url = String(formData.get("source_url") || "").trim();
  const reported_at = String(formData.get("reported_at") || "").trim();

  const value = Number(valueRaw);

  if (!category || Number.isNaN(value) || !source_organization || !source_url || !reported_at) {
    throw new Error("Category, value, source, and reported date are required.");
  }

  const { error } = await supabase.from("disaster_statistics").insert({
    category,
    value,
    unit: unit || null,
    location: location || null,
    source_organization,
    source_url,
    reported_at: new Date(reported_at).toISOString(),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/statistics");
  revalidatePath("/");
}

export async function deleteStatistic(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("disaster_statistics").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/statistics");
  revalidatePath("/");
}

export async function createMaterialNeeded(formData: FormData) {
  const supabase = createClient();

  const material = String(formData.get("material") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const quantity_or_requirement = String(formData.get("quantity_or_requirement") || "").trim();
  const source_organization = String(formData.get("source_organization") || "").trim();
  const source_url = String(formData.get("source_url") || "").trim();
  const reported_at = String(formData.get("reported_at") || "").trim();

  if (!material || !source_organization || !source_url || !reported_at) {
    throw new Error("Material, source, and reported date are required.");
  }

  const { error } = await supabase.from("materials_needed").insert({
    material,
    description: description || null,
    location: location || null,
    quantity_or_requirement: quantity_or_requirement || null,
    source_organization,
    source_url,
    reported_at: new Date(reported_at).toISOString(),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/statistics");
  revalidatePath("/");
}

export async function deleteMaterialNeeded(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("materials_needed").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/statistics");
  revalidatePath("/");
}