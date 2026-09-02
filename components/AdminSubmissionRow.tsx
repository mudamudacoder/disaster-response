"use client";

import { useState, useTransition } from "react";
import { DonationCenter } from "@/types";
import { formatDateTime } from "@/lib/utils/format";
import { approveDonationCenter, rejectDonationCenter } from "@/app/admin/dashboard/actions";

export default function AdminSubmissionRow({ center }: { center: DonationCenter }) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleApprove() {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await approveDonationCenter(center.id);
      } catch {
        setErrorMessage("Could not approve this submission. Please try again.");
      }
    });
  }

  function handleReject() {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await rejectDonationCenter(center.id);
      } catch {
        setErrorMessage("Could not reject this submission. Please try again.");
      }
    });
  }

  return (
    <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-neutral-900">{center.initiative_name}</h3>
          <p className="text-sm text-neutral-600">{center.address}</p>
        </div>
        <StatusBadge status={center.status} />
      </div>

      <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 text-sm text-neutral-700 sm:grid-cols-2">
        <Detail label="Contact" value={center.contact_details} />
        <Detail label="Hours" value={center.operational_hours} />
        <Detail label="Coordinates" value={`${center.latitude}, ${center.longitude}`} />
        <Detail
          label="Donation types"
          value={center.donation_types.join(", ")}
        />
        {center.registration_number && (
          <Detail label="Registration #" value={center.registration_number} />
        )}
        {center.website && <Detail label="Website" value={center.website} />}
        {center.notes && <Detail label="Notes" value={center.notes} />}
        <Detail label="Submitted" value={formatDateTime(center.created_at)} />
        {center.verified_at && (
          <Detail label="Reviewed" value={formatDateTime(center.verified_at)} />
        )}
      </dl>

      {errorMessage && (
        <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
      )}

      {center.status === "pending" && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleApprove}
            disabled={isPending}
            className="min-h-[40px] rounded-md bg-green-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
          >
            Approve
          </button>
          <button
            onClick={handleReject}
            disabled={isPending}
            className="min-h-[40px] rounded-md bg-neutral-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-neutral-500">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function StatusBadge({ status }: { status: DonationCenter["status"] }) {
  const styles: Record<DonationCenter["status"], string> = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-neutral-200 text-neutral-700",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}