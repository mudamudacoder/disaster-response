"use client";

import { FormEvent, useRef, useState, useTransition } from "react";
import { DisasterStatistic } from "@/types";
import { formatDateTime, formatNumber } from "@/lib/utils/format";
import { createStatistic, deleteStatistic } from "@/app/admin/statistics/actions";

const CATEGORY_OPTIONS = [
  "deaths",
  "rescued",
  "missing",
  "injured",
  "affected_people",
  "affected_households",
];

export default function AdminStatisticsManager({
  stats,
}: {
  stats: DisasterStatistic[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createStatistic(formData);
        formRef.current?.reset();
      } catch {
        setErrorMessage("Could not save this statistic. Please check the fields and try again.");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteStatistic(id);
      } catch {
        setErrorMessage("Could not delete this statistic. Please try again.");
      }
    });
  }

  const inputClass =
    "min-h-[44px] w-full rounded-md border border-neutral-300 px-3 py-2 text-base focus:border-brand-navy";

  return (
    <div className="flex flex-col gap-8">
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-black/10 bg-white p-4">
        <h2 className="font-semibold text-neutral-900">Add Statistic</h2>

        {errorMessage && <p className="text-sm text-red-700">{errorMessage}</p>}

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Category</span>
          {customCategory ? (
            <input name="category" required placeholder="e.g. displaced_people" className={inputClass} />
          ) : (
            <select
              name="category"
              required
              className={inputClass}
              onChange={(e) => {
                if (e.target.value === "__custom") setCustomCategory(true);
              }}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c.replace(/_/g, " ")}
                </option>
              ))}
              <option value="__custom">Other (custom)...</option>
            </select>
          )}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Value</span>
          <input name="value" type="number" step="any" required className={inputClass} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Unit (optional)</span>
          <input name="unit" placeholder="e.g. people, households" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Location (optional)</span>
          <input name="location" placeholder="e.g. Kathmandu Valley" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Source organization</span>
          <input name="source_organization" required placeholder="e.g. Nepal Police" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Source URL</span>
          <input name="source_url" type="url" required placeholder="https://" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Reported date/time</span>
          <input name="reported_at" type="datetime-local" required className={inputClass} />
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="min-h-[44px] rounded-md bg-brand-navy px-4 py-2 font-semibold text-white hover:bg-brand-navy/90 disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Add statistic"}
        </button>
      </form>

      <div>
        <h2 className="font-semibold text-neutral-900">Existing Statistics ({stats.length})</h2>
        {stats.length === 0 ? (
          <p className="mt-2 italic text-neutral-500">No statistics yet.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {stats.map((s) => (
              <div key={s.id} className="rounded-lg border border-black/10 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {s.category.replace(/_/g, " ")}: {formatNumber(s.value)} {s.unit}
                      {s.location ? ` \u2014 ${s.location}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {s.source_organization} &middot; {formatDateTime(s.reported_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={isPending}
                    className="min-h-[36px] flex-shrink-0 rounded-md border border-red-300 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}