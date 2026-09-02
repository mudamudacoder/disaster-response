import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { OfficialUpdate } from "@/types";
import AdminUpdatesManager from "@/components/AdminUpdatesManager";

export const dynamic = "force-dynamic";

export default async function AdminUpdatesPage() {
  const { supabase } = await requireAdmin();

  const { data } = await supabase
    .from("official_updates")
    .select("*")
    .order("published_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Manage Official Updates</h1>
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium text-brand-navy underline underline-offset-2"
        >
          Back to dashboard
        </Link>
      </div>

      <div className="mt-6">
        <AdminUpdatesManager updates={(data ?? []) as OfficialUpdate[]} />
      </div>
    </div>
  );
}