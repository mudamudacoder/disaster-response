"use client";

import { FormEvent, useRef, useState, useTransition } from "react";
import { MaterialNeeded } from "@/types";
import { formatDateTime } from "@/lib/utils/format";
import { createMaterialNeeded, deleteMaterialNeeded } from "@/app/admin/statistics/actions";

export default function AdminMaterialsManager({
  materials,
}: {
  materials: MaterialNeeded[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createMaterialNeeded(formData);
        formRef.current?.reset();
      } catch {
        setErrorMessage("Could not save this entry. Please check the fields and try again.");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteMaterialNeeded(id);
      } catch {
        setErrorMessage("Could not delete this entry. Please try again.");
      }
    });
  }

  const inputClass =
    "min-h-[44px] w-full rounded-md border border-neutral-300 px-3 py-2 text-base focus:border-brand-navy";

  return (
    <div className="flex flex-col gap-8">
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-black/10 bg-white p-4">
        <h2 className="font-semibold text-neutral-900">Add Material Needed</h2>

        {errorMessage && <p className="text-sm text-red-700">{errorMessage}</p>}

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Material</span>
          <input name="material" required placeholder="e.g. Drinking water" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Description (optional)</span>
          <input name="description" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Location (optional)</span>
          <input name="location" placeholder="e.g. Bardiya district" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Quantity / requirement (optional)</span>
          <input name="quantity_or_requirement" placeholder="e.g. 5,000 liters" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Source organization</span>
          <input name="source_organization" required className={inputClass} />
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
          {isPending ? "Saving..." : "Add material"}
        </button>
      </form>

      <div>
        <h2 className="font-semibold text-neutral-900">Existing Entries ({materials.length})</h2>
        {materials.length === 0 ? (
          <p className="mt-2 italic text-neutral-500">No materials listed yet.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {materials.map((m) => (
              <div key={m.id} className="rounded-lg border border-black/10 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {m.material}
                      {m.location ? ` \u2014 ${m.location}` : ""}
                    </p>
                    {m.quantity_or_requirement && (
                      <p className="text-sm text-neutral-700">
                        Needed: {m.quantity_or_requirement}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-neutral-500">
                      {m.source_organization} &middot; {formatDateTime(m.reported_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(m.id)}
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