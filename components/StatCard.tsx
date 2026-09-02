import { DisasterStatistic } from "@/types";
import { formatDateTime, formatNumber, statCategoryLabel } from "@/lib/utils/format";
import SourceLink from "./SourceLink";

export default function StatCard({ stat }: { stat: DisasterStatistic }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-neutral-500">
        {statCategoryLabel(stat.category)}
        {stat.location ? ` \u2014 ${stat.location}` : ""}
      </p>
      <p className="mt-1 text-3xl font-bold text-brand-crimson">
        {formatNumber(stat.value)}
        {stat.unit ? (
          <span className="ml-1 text-base font-normal text-neutral-500">
            {stat.unit}
          </span>
        ) : null}
      </p>
      <SourceLink
        organization={stat.source_organization}
        url={stat.source_url}
        updatedAtLabel={formatDateTime(stat.reported_at)}
      />
    </div>
  );
}

export function UnavailableStatCard({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-black/20 bg-neutral-50 p-4">
      <p className="text-sm font-medium text-neutral-500">{label}</p>
      <p className="mt-1 text-base italic text-neutral-400">
        Information currently unavailable.
      </p>
    </div>
  );
}