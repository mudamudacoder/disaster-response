/**
 * Government data source integration point.
 *
 * For the MVP, official updates and statistics are entered manually through
 * the admin panel and read from Supabase (see lib/data-sources/supabase.ts
 * via the page components' direct Supabase queries).
 *
 * If a Nepal government body (NDRRMA, Ministry of Home Affairs, DHM, Nepal
 * Police, etc.) later provides a stable public API/RSS/feed, implement a
 * fetcher here that conforms to this interface and writes into the same
 * `official_updates` / `disaster_statistics` / `materials_needed` tables
 * (e.g. via a scheduled job or admin-triggered sync). No UI changes should
 * be required since pages already read from those tables.
 *
 * TODO: Integrate a live source once one is confirmed stable and official.
 * Do not scrape general news sites.
 */

import type { DisasterStatistic, MaterialNeeded, OfficialUpdate } from "@/types";

export interface OfficialDataSource {
  /** Human-readable name of the source, e.g. "NDRRMA". */
  name: string;
  fetchUpdates(): Promise<Omit<OfficialUpdate, "id" | "created_at" | "updated_at">[]>;
  fetchStatistics(): Promise<Omit<DisasterStatistic, "id" | "created_at" | "updated_at">[]>;
  fetchMaterialsNeeded(): Promise<Omit<MaterialNeeded, "id" | "created_at" | "updated_at">[]>;
}

/**
 * No live sources are wired up yet. This array intentionally stays empty
 * until a stable official feed is confirmed and implemented above.
 */
export const officialDataSources: OfficialDataSource[] = [];