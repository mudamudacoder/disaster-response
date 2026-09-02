import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DonationCenter } from "@/types";
import DonationCentersExplorer from "@/components/DonationCentersExplorer";

export const dynamic = "force-dynamic";

async function getApprovedCenters() {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("donation_centers")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    return { centers: (data ?? []) as DonationCenter[], error: false };
  } catch {
    return { centers: [], error: true };
  }
}

export default async function DonationCentersPage() {
  const { centers, error } = await getApprovedCenters();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-neutral-900">
          Find Donation Centers
        </h1>
        <Link
          href="/register"
          className="min-h-[44px] rounded-md bg-brand-crimson px-4 py-2 font-semibold text-white hover:bg-brand-crimsonDark"
        >
          Register a Center
        </Link>
      </div>
      <p className="mt-1 text-sm text-neutral-600">
        Only donation centers that have passed admin verification appear
        here.
      </p>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          We&apos;re having trouble connecting to live data right now. Please
          try again shortly.
        </div>
      )}

      <div className="mt-6">
        <DonationCentersExplorer centers={centers} />
      </div>
    </div>
  );
}