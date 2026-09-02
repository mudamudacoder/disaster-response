"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

// Default Leaflet marker icons reference image URLs that don't resolve under
// bundlers by default. Point them at a CDN so the marker renders correctly.
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const NEPAL_CENTER: [number, number] = [28.3949, 84.124];

function ClickHandler({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({
  value,
  onChange,
}: {
  value: { lat: number; lng: number } | null;
  onChange: (lat: number, lng: number) => void;
}) {
  const [locating, setLocating] = useState(false);

  function useMyLocation() {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      () => setLocating(false)
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="h-64 w-full overflow-hidden rounded-md border border-neutral-300">
        <MapContainer
          center={value ?? NEPAL_CENTER}
          zoom={value ? 15 : 7}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={onChange} />
          {value && <Marker position={value} icon={markerIcon} />}
        </MapContainer>
      </div>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="min-h-[36px] rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
        >
          {locating ? "Locating..." : "Use my current location"}
        </button>
        <span className="text-xs text-neutral-500">
          {value
            ? `Selected: ${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}`
            : "Tap the map to drop a pin"}
        </span>
      </div>
    </div>
  );
}
