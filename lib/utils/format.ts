export function formatDateTime(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function statCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    deaths: "Death Toll",
    rescued: "Rescued",
    missing: "Missing",
    injured: "Injured",
    affected_people: "Affected People",
    affected_households: "Affected Households",
  };
  return labels[category] ?? category.replace(/_/g, " ");
}