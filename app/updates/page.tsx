import { createClient } from "@/lib/supabase/server";
import { OfficialUpdate } from "@/types";
import UpdateCard from "@/components/UpdateCard";

export const dynamic = "force-dynamic";

async function getUpdates() {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("official_updates")
      .select("*")
      .order("published_at", { ascending: false });
    return { updates: (data ?? []) as OfficialUpdate[], error: false };
  } catch {
    return { updates: [], error: true };
  }
}

export default async function UpdatesPage() {
  const { updates, error } = await getUpdates();

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-bold text-neutral-900">Latest Updates</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Official disaster announcements, statistics updates, and relief
        requirements from Nepal government sources.
      </p>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          We&apos;re having trouble connecting to live data right now. Please
          try again shortly.
        </div>
      )}

      {!error && updates.length === 0 && (
        <p className="mt-6 italic text-neutral-500">
          Official information has not been added yet.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {updates.map((update) => (
          <UpdateCard key={update.id} update={update} />
        ))}
      </div>
    </div>
  );
}