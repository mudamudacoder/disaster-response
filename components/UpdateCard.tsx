import { OfficialUpdate } from "@/types";
import { formatDateTime } from "@/lib/utils/format";
import SourceLink from "./SourceLink";

export default function UpdateCard({ update }: { update: OfficialUpdate }) {
  return (
    <article className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-neutral-900">{update.title}</h3>
      <p className="mt-1 text-sm text-neutral-700">{update.summary}</p>
      <SourceLink
        organization={update.source_organization}
        url={update.source_url}
        updatedAtLabel={formatDateTime(update.published_at)}
      />
    </article>
  );
}