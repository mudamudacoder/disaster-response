import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DisasterStatistic, MaterialNeeded, OfficialUpdate } from "@/types";
import StatCard, { UnavailableStatCard } from "@/components/StatCard";
import UpdateCard from "@/components/UpdateCard";
import MaterialCard from "@/components/MaterialCard";
import PMReliefFund from "@/components/PMReliefFund";

export const dynamic = "force-dynamic";

const CORE_CATEGORIES = [
  "deaths",
  "rescued",
  "missing",
  "injured",
  "affected_people",
  "affected_households",
];

async function getHomepageData() {
  try {
    const supabase = createClient();

    const [{ data: stats }, { data: updates }, { data: materials }] =
      await Promise.all([
        supabase
          .from("disaster_statistics")
          .select("*")
          .order("reported_at", { ascending: false }),
        supabase
          .from("official_updates")
          .select("*")
          .order("published_at", { ascending: false })
          .limit(3),
        supabase
          .from("materials_needed")
          .select("*")
          .order("reported_at", { ascending: false })
          .limit(6),
      ]);

    return {
      stats: (stats ?? []) as DisasterStatistic[],
      updates: (updates ?? []) as OfficialUpdate[],
      materials: (materials ?? []) as MaterialNeeded[],
      error: false,
    };
  } catch {
    return { stats: [], updates: [], materials: [], error: true };
  }
}

function latestByCategory(stats: DisasterStatistic[], category: string) {
  return stats.find((s) => s.category === category) ?? null;
}

export default async function HomePage() {
  const { stats, updates, materials, error } = await getHomepageData();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <section>
        <h1 className="text-2xl font-bold text-neutral-900">
          Nepal Disaster Relief Information
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          A centralized, source-linked portal for official disaster
          information and verified donation centers in Nepal.
        </p>
      </section>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          We&apos;re having trouble connecting to live data right now. Please
          try again shortly.
        </div>
      )}

      <section className="mt-6">
        <h2 className="text-lg font-bold text-neutral-900">
          Emergency Information
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CORE_CATEGORIES.map((category) => {
            const stat = latestByCategory(stats, category);
            return stat ? (
              <StatCard key={category} stat={stat} />
            ) : (
              <UnavailableStatCard
                key={category}
                label={category.replace(/_/g, " ")}
              />
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">
            Materials Currently Needed
          </h2>
        </div>
        {materials.length === 0 ? (
          <p className="mt-2 italic text-neutral-500">
            Official information has not been added yet.
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {materials.map((m) => (
              <MaterialCard key={m.id} material={m} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">Latest Updates</h2>
          <Link
            href="/updates"
            className="text-sm font-medium text-brand-navy underline underline-offset-2"
          >
            View all
          </Link>
        </div>
        {updates.length === 0 ? (
          <p className="mt-2 italic text-neutral-500">
            Official information has not been added yet.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {updates.map((u) => (
              <UpdateCard key={u.id} update={u} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <PMReliefFund />
      </section>

      <section className="mt-8 rounded-lg bg-brand-navy p-5 text-white">
        <h2 className="text-lg font-bold">Find or Register a Donation Center</h2>
        <p className="mt-1 text-sm text-white/80">
          Browse verified donation centers near you, or register a new
          initiative for admin verification.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href="/donation-centers"
            className="min-h-[44px] rounded-md bg-white px-4 py-2 text-center font-semibold text-brand-navy"
          >
            Find Donation Centers
          </Link>
          <Link
            href="/register"
            className="min-h-[44px] rounded-md border border-white px-4 py-2 text-center font-semibold text-white"
          >
            Register Donation Center
          </Link>
        </div>
      </section>
    </div>
  );
}