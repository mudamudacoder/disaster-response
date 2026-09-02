import { MaterialNeeded } from "@/types";
import { formatDateTime } from "@/lib/utils/format";
import SourceLink from "./SourceLink";

export default function MaterialCard({ material }: { material: MaterialNeeded }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <p className="font-semibold text-neutral-900">
        {material.material}
        {material.location ? ` \u2014 ${material.location}` : ""}
      </p>
      {material.quantity_or_requirement && (
        <p className="mt-1 text-sm text-neutral-700">
          Needed: {material.quantity_or_requirement}
        </p>
      )}
      {material.description && (
        <p className="mt-1 text-sm text-neutral-600">{material.description}</p>
      )}
      <SourceLink
        organization={material.source_organization}
        url={material.source_url}
        updatedAtLabel={formatDateTime(material.reported_at)}
      />
    </div>
  );
}