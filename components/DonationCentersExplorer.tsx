"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { DonationCenter } from "@/types";
import { distanceKm } from "@/lib/utils/distance";
import DonationCenterCard from "./DonationCenterCard";

const DonationCentersMap = dynamic(() => import("./DonationCentersMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-sm text-neutral-500">
      Loading map...
    </div>
  ),
});

type GeoState =
  | { status: "idle" }
  | { status: "requesting" }
  | { status: "granted"; lat: number; lng: number }
  | { status: "denied" }
  | { status: "error"; message: string };

export default function DonationCentersExplorer({
  centers,
}: {
  centers: DonationCenter[];
}) {
  const [geo, setGeo] = useState<GeoState>({ status: "idle" });

  const userPosition: [number, number] | null =
    geo.status === "granted" ? [geo.lat, geo.lng] : null;

  const sortedCenters = useMemo(() => {
    if (geo.status !== "granted") return centers;
    return [...centers].sort(
      (a, b) =>
        distanceKm(geo.lat, geo.lng, a.latitude, a.longitude) -
        distanceKm(geo.lat, geo.lng, b.latitude, b.longitude)
    );
  }, [centers, geo]);

  function findNearMe() {
    if (!("geolocation" in navigator)) {
      setGeo({ status: "error", message: "Geolocation is not supported on this device." });
      return;
    }
    setGeo({ status: "requesting" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({
          status: "granted",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGeo({ status: "denied" });
        } else {
          setGeo({ status: "error", message: "Could not determine your location." });
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={findNearMe}
          className="min-h-[44px] rounded-md bg-brand-navy px-4 py-2 font-semibold text-white hover:bg-brand-navy/90"
        >
          {geo.status === "requesting" ? "Locating..." : "Find nearest donation centers"}
        </button>

        {geo.status === "denied" && (
          <p className="text-sm text-neutral-600">
            Location permission was denied. You can still browse all verified
            centers below or on the map.
          </p>
        )}
        {geo.status === "error" && (
          <p className="text-sm text-neutral-600">{geo.message}</p>
        )}
        {geo.status === "granted" && (
          <p className="text-sm text-neutral-600">
            Showing centers sorted by distance from your current location.
          </p>
        )}
      </div>

      <p className="text-xs text-neutral-500">
        Your location is only used in your browser to sort nearby centers. It
        is never sent to our servers or stored.
      </p>

      <div className="h-[400px] w-full overflow-hidden rounded-lg border border-black/10">
        <DonationCentersMap centers={centers} userPosition={userPosition} />
      </div>

      {centers.length === 0 ? (
        <p className="italic text-neutral-500">
          No verified donation centers are available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sortedCenters.map((center) => (
            <DonationCenterCard
              key={center.id}
              center={center}
              distanceKm={
                geo.status === "granted"
                  ? distanceKm(geo.lat, geo.lng, center.latitude, center.longitude)
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}