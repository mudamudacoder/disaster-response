import { GeoDonationCenter } from "@/types";
import { formatDistance } from "@/lib/utils/distance";
import { googleMapsDirectionsUrl } from "@/lib/utils/maps";

export default function GeoDonationCenterCard({
  center,
  distanceKm,
}: {
  center: GeoDonationCenter;
  distanceKm?: number;
}) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-neutral-900">{center.name}</h3>
        <span className="flex-shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
          Community-reported
        </span>
      </div>
      {typeof distanceKm === "number" && (
        <p className="mt-1 text-xs font-medium text-brand-navy">
          {formatDistance(distanceKm)} away
        </p>
      )}
      {center.description && (
        <p className="mt-2 whitespace-pre-line text-sm text-neutral-600">
          {center.description}
        </p>
      )}
      <a
        href={googleMapsDirectionsUrl(center.latitude, center.longitude)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex min-h-[36px] items-center justify-center rounded-md bg-brand-navy px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-navy/90"
      >
        Get directions
      </a>
    </div>
  );
}
