import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { DisasterStatistic, MaterialNeeded } from "@/types";
import AdminStatisticsManager from "@/components/AdminStatisticsManager";
import AdminMaterialsManager from "@/components/AdminMaterialsManager";

export const dynamic = "force-dynamic";

export default async function AdminStatisticsPage() {
  const { supabase } = await requireAdmin();

  const [{ data: stats }, { data: materials }] = await Promise.all([
    supabase
      .from("disaster_statistics")
      .select("*")
      .order("reported_at", { ascending: false }),
    supabase
      .from("materials_needed")
      .select("*")
      .order("reported_at", { ascending: false }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">
          Manage Statistics &amp; Materials Needed
        </h1>
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium text-brand-navy underline underline-offset-2"
        >
          Back to dashboard
        </Link>
      </div>

      <section className="mt-6">
        <AdminStatisticsManager stats={(stats ?? []) as DisasterStatistic[]} />
      </section>

      <hr className="my-10 border-black/10" />

      <section>
        <AdminMaterialsManager materials={(materials ?? []) as MaterialNeeded[]} />
      </section>
    </div>
  );
}