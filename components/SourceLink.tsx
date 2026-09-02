export default function SourceLink({
  organization,
  url,
  updatedAtLabel,
}: {
  organization: string;
  url: string;
  updatedAtLabel: string;
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
      <span>Source: {organization}</span>
      <span aria-hidden="true">&middot;</span>
      <span>Updated: {updatedAtLabel}</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-brand-navy underline underline-offset-2 hover:text-brand-crimson"
      >
        View original source
      </a>
    </div>
  );
}