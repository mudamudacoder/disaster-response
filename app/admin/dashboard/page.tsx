import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { DonationCenter } from "@/types";
import AdminSubmissionRow from "@/components/AdminSubmissionRow";
import SignOutButton from "@/components/SignOutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();

  const { data } = await supabase
    .from("donation_centers")
    .select("*")
    .order("created_at", { ascending: false });

  const centers = (data ?? []) as DonationCenter[];
  const pending = centers.filter((c) => c.status === "pending");
  const approved = centers.filter((c) => c.status === "approved");
  const rejected = centers.filter((c) => c.status === "rejected");

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/updates"
            className="min-h-[40px] rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Manage Updates
          </Link>
          <Link
            href="/admin/statistics"
            className="min-h-[40px] rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Manage Statistics
          </Link>
          <SignOutButton />
        </div>
      </div>

      <section className="mt-6">
        <h2 className="text-lg font-bold text-neutral-900">
          Pending Submissions ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="mt-2 italic text-neutral-500">No pending submissions.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {pending.map((c) => (
              <AdminSubmissionRow key={c.id} center={c} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-neutral-900">
          Approved Centers ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="mt-2 italic text-neutral-500">No approved centers yet.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {approved.map((c) => (
              <AdminSubmissionRow key={c.id} center={c} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-neutral-900">
          Rejected Submissions ({rejected.length})
        </h2>
        {rejected.length === 0 ? (
          <p className="mt-2 italic text-neutral-500">No rejected submissions.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {rejected.map((c) => (
              <AdminSubmissionRow key={c.id} center={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}