"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function approveDonationCenter(id: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("donation_centers")
    .update({
      status: "approved",
      verified_at: new Date().toISOString(),
      verified_by: user.id,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/dashboard");
  revalidatePath("/donation-centers");
}

export async function rejectDonationCenter(id: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("donation_centers")
    .update({
      status: "rejected",
      verified_at: new Date().toISOString(),
      verified_by: user.id,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/dashboard");
  revalidatePath("/donation-centers");
}