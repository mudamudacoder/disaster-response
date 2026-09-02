"use client";

import { FormEvent, useRef, useState, useTransition } from "react";
import { OfficialUpdate } from "@/types";
import { formatDateTime } from "@/lib/utils/format";
import { createOfficialUpdate, deleteOfficialUpdate } from "@/app/admin/updates/actions";

export default function AdminUpdatesManager({
  updates,
}: {
  updates: OfficialUpdate[];
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
        await createOfficialUpdate(formData);
        formRef.current?.reset();
      } catch {
        setErrorMessage("Could not save this update. Please check the fields and try again.");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteOfficialUpdate(id);
      } catch {
        setErrorMessage("Could not delete this update. Please try again.");
      }
    });
  }

  const inputClass =
    "min-h-[44px] w-full rounded-md border border-neutral-300 px-3 py-2 text-base focus:border-brand-navy";

  return (
    <div className="flex flex-col gap-8">
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-black/10 bg-white p-4">
        <h2 className="font-semibold text-neutral-900">Add Official Update</h2>

        {errorMessage && (
          <p className="text-sm text-red-700">{errorMessage}</p>
        )}

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Title</span>
          <input name="title" required className={inputClass} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Summary</span>
          <textarea name="summary" required rows={3} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Source organization</span>
          <input name="source_organization" required placeholder="e.g. NDRRMA" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Source URL</span>
          <input name="source_url" type="url" required placeholder="https://" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Published date/time</span>
          <input name="published_at" type="datetime-local" required className={inputClass} />
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="min-h-[44px] rounded-md bg-brand-navy px-4 py-2 font-semibold text-white hover:bg-brand-navy/90 disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Add update"}
        </button>
      </form>

      <div>
        <h2 className="font-semibold text-neutral-900">
          Existing Updates ({updates.length})
        </h2>
        {updates.length === 0 ? (
          <p className="mt-2 italic text-neutral-500">No updates yet.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {updates.map((u) => (
              <div key={u.id} className="rounded-lg border border-black/10 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-neutral-900">{u.title}</p>
                    <p className="mt-1 text-sm text-neutral-700">{u.summary}</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {u.source_organization} &middot; {formatDateTime(u.published_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(u.id)}
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