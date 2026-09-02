
"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { DonationCenter } from "@/types";

// Default Leaflet marker icons
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "hue-rotate-90",
});

const NEPAL_CENTER: [number, number] = [28.3949, 84.124];

function RecenterOnUser({
  position,
}: {
  position: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);

  return null;
}

export default function DonationCentersMap({
  centers,
  userPosition,
  geoJsonData,
}: {
  centers: DonationCenter[];
  userPosition: [number, number] | null;
  geoJsonData?: any;
}) {
  return (
    <MapContainer
      center={userPosition ?? NEPAL_CENTER}
      zoom={userPosition ? 13 : 7}
      className="h-full w-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterOnUser position={userPosition} />

      {/* User's approximate location */}
      {userPosition && (
        <Marker position={userPosition} icon={userIcon}>
          <Popup>Your approximate location</Popup>
        </Marker>
      )}

      {/* GeoJSON donation centers */}
      {geoJsonData && (
        <GeoJSON
          data={geoJsonData}
          pointToLayer={(_feature, latlng) => {
            return L.marker(latlng, {
              icon: markerIcon,
            });
          }}
          onEachFeature={(feature, layer) => {
            const properties = feature.properties;

            if (!properties) return;

            const popupContent = `
              <div class="text-sm">
                ${
                  properties.initiative_name
                    ? `<p class="font-semibold">${properties.initiative_name}</p>`
                    : ""
                }

                ${
                  properties.address
                    ? `<p>${properties.address}</p>`
                    : ""
                }

                ${
                  properties.contact_details
                    ? `<p class="mt-1">
                        <strong>Contact:</strong>
                        ${properties.contact_details}
                      </p>`
                    : ""
                }

                ${
                  properties.operational_hours
                    ? `<p>
                        <strong>Hours:</strong>
                        ${properties.operational_hours}
                      </p>`
                    : ""
                }

                ${
                  properties.donation_types
                    ? `<p class="mt-1">
                        ${Array.isArray(properties.donation_types)
                          ? properties.donation_types.join(", ")
                          : properties.donation_types}
                      </p>`
                    : ""
                }
              </div>
            `;

            layer.bindPopup(popupContent);
          }}
        />
      )}

      {/* Existing donation centers from Supabase */}
      {centers.map((center) => (
        <Marker
          key={center.id}
          position={[center.latitude, center.longitude]}
          icon={markerIcon}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{center.initiative_name}</p>

              <p>{center.address}</p>

              <p className="mt-1">
                <span className="font-medium">Contact:</span>{" "}
                {center.contact_details}
              </p>

              <p>
                <span className="font-medium">Hours:</span>{" "}
                {center.operational_hours}
              </p>

              <p className="mt-1">
                {center.donation_types.join(", ")}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
