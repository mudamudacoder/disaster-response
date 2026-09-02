import { DonationCenter } from "@/types";
import { formatDistance } from "@/lib/utils/distance";

export default function DonationCenterCard({
  center,
  distanceKm,
}: {
  center: DonationCenter;
  distanceKm?: number;
}) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-neutral-900">{center.initiative_name}</h3>
        <span className="flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
          Verified
        </span>
      </div>
      <p className="mt-1 text-sm text-neutral-700">{center.address}</p>
      {typeof distanceKm === "number" && (
        <p className="mt-1 text-xs font-medium text-brand-navy">
          {formatDistance(distanceKm)} away
        </p>
      )}
      <p className="mt-2 text-sm text-neutral-600">
        <span className="font-medium">Contact:</span> {center.contact_details}
      </p>
      <p className="text-sm text-neutral-600">
        <span className="font-medium">Hours:</span> {center.operational_hours}
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        {center.donation_types.map((type) => (
          <span
            key={type}
            className="rounded-full bg-brand-navy/10 px-2 py-0.5 text-xs font-medium text-brand-navy"
          >
            {type}
          </span>
        ))}
      </div>
      {center.website && (
        <a
          href={center.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm font-medium text-brand-navy underline underline-offset-2 hover:text-brand-crimson"
        >
          Website / social media
        </a>
      )}
      {center.notes && (
        <p className="mt-2 text-xs text-neutral-500">{center.notes}</p>
      )}
    </div>
  );
}