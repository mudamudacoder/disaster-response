export type DonationCenterStatus = "pending" | "approved" | "rejected";

export const DONATION_TYPES = [
  "Food",
  "Water",
  "Clothes",
  "Medicine",
  "Blood",
  "Hygiene supplies",
  "Blankets",
  "Financial donations",
  "Other",
] as const;

export type DonationType = (typeof DONATION_TYPES)[number];

export interface DonationCenter {
  id: string;
  initiative_name: string;
  address: string;
  latitude: number;
  longitude: number;
  contact_details: string;
  registration_number: string | null;
  operational_hours: string;
  donation_types: string[];
  website: string | null;
  notes: string | null;
  status: DonationCenterStatus;
  created_at: string;
  updated_at: string;
  verified_at: string | null;
  verified_by: string | null;
}

export type NewDonationCenter = Pick<
  DonationCenter,
  | "initiative_name"
  | "address"
  | "latitude"
  | "longitude"
  | "contact_details"
  | "operational_hours"
  | "donation_types"
> &
  Partial<
    Pick<DonationCenter, "registration_number" | "website" | "notes">
  >;

export interface GeoDonationCenter {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
}

export interface OfficialUpdate {
  id: string;
  title: string;
  summary: string;
  source_organization: string;
  source_url: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export type StatisticCategory =
  | "deaths"
  | "rescued"
  | "missing"
  | "injured"
  | "affected_people"
  | "affected_households"
  | string;

export interface DisasterStatistic {
  id: string;
  category: StatisticCategory;
  value: number;
  unit: string | null;
  location: string | null;
  source_organization: string;
  source_url: string;
  reported_at: string;
  created_at: string;
  updated_at: string;
}

export interface MaterialNeeded {
  id: string;
  material: string;
  description: string | null;
  location: string | null;
  quantity_or_requirement: string | null;
  source_organization: string;
  source_url: string;
  reported_at: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  is_admin: boolean;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}