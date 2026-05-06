"use client";

import { useEffect, useRef, useCallback } from "react";
import type { MapPin } from "@/types/trip";
import "leaflet/dist/leaflet.css";

const TYPE_COLORS: Record<string, string> = {
  passeio: "#EA9940",
  restaurante: "#6CA3A2",
  hospedagem: "#307082",
  transporte: "#ECE7DC",
};

function createIcon(L: typeof import("leaflet"), type: string, label: number) {
  const color = TYPE_COLORS[type] ?? "#EA9940";
  const textColor = type === "transporte" ? "#12212E" : "#fff";
  return L.divIcon({
    className: "",
    html: `<div style="
      width:28px;height:28px;border-radius:50%;
      background:${color};border:2px solid rgba(255,255,255,0.25);
      display:flex;align-items:center;justify-content:center;
      font-size:10px;font-weight:700;color:${textColor};
      box-shadow:0 2px 8px rgba(0,0,0,0.6);
      font-family:'DM Mono',monospace;
    ">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -18],
  });
}

function popupHtml(pin: MapPin) {
  const color = TYPE_COLORS[pin.type] ?? "#EA9940";
  return `
    <div style="font-family:'DM Sans',sans-serif;min-width:180px;max-width:220px">
      <div style="font-size:14px;font-weight:600;color:#EA9940;line-height:1.3;margin-bottom:4px">${pin.activity}</div>
      <div style="font-size:11px;color:#8fa3b1;margin-bottom:10px">${pin.location}</div>
      <div style="display:flex;align-items:center;gap:8px">
        <span style="
          background:${color}22;color:${color};
          border:1px solid ${color}55;
          border-radius:100px;padding:2px 9px;
          font-size:10px;font-weight:600;letter-spacing:0.04em;
        ">${pin.type}</span>
        <span style="font-size:10px;color:#6b7e8a;font-family:'DM Mono',monospace">
          Dia ${pin.day} · ${pin.time}
        </span>
      </div>
    </div>
  `;
}

export function LeafletMap({
  pins,
  activeDay,
}: {
  pins: MapPin[];
  activeDay?: number;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const LRef = useRef<typeof import("leaflet") | null>(null);
  const markersRef = useRef<import("leaflet").Marker[]>([]);

  // Keep latest props accessible from callbacks without re-creating them
  const pinsRef = useRef(pins);
  const activeDayRef = useRef(activeDay);
  pinsRef.current = pins;
  activeDayRef.current = activeDay;

  const syncMarkers = useCallback(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const visible =
      activeDayRef.current != null
        ? pinsRef.current.filter((p) => p.day === activeDayRef.current)
        : pinsRef.current;

    visible.forEach((pin, i) => {
      const marker = L.marker([pin.coordinates.lat, pin.coordinates.lng], {
        icon: createIcon(L, pin.type, i + 1),
      })
        .addTo(map)
        .bindPopup(popupHtml(pin), { className: "leaflet-trip-popup" });
      markersRef.current.push(marker);
    });

    if (visible.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.35));
    }
  }, []);

  // Init map once
  useEffect(() => {
    if (!divRef.current || mapRef.current) return;

    import("leaflet").then((L) => {
      if (mapRef.current) return;

      const map = L.map(divRef.current!, { zoomControl: false }).setView(
        [48.8566, 2.3522],
        12,
      );

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a> &copy; <a href="https://carto.com">CARTO</a>',
          maxZoom: 19,
        },
      ).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      LRef.current = L;
      mapRef.current = map;
      syncMarkers();
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      LRef.current = null;
    };
  }, [syncMarkers]);

  // Re-sync markers whenever pins or activeDay change
  useEffect(() => {
    syncMarkers();
  }, [pins, activeDay, syncMarkers]);

  return (
    <>
      <style>{`
        .leaflet-trip-popup .leaflet-popup-content-wrapper {
          background: #12212e;
          border: 1px solid rgba(234,153,64,0.18);
          border-radius: 10px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.55);
          padding: 0;
        }
        .leaflet-trip-popup .leaflet-popup-content {
          margin: 14px 16px;
        }
        .leaflet-trip-popup .leaflet-popup-tip-container {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
        }
        .leaflet-trip-popup .leaflet-popup-tip {
          background: #12212e;
          border: none;
        }
        .leaflet-trip-popup .leaflet-popup-close-button {
          color: #4a6070 !important;
          font-size: 18px !important;
          top: 8px !important;
          right: 10px !important;
          padding: 0 !important;
          line-height: 1 !important;
        }
        .leaflet-trip-popup .leaflet-popup-close-button:hover {
          color: #EA9940 !important;
        }
        .leaflet-container { font-family: 'DM Sans', sans-serif; }
        .leaflet-control-zoom a {
          background: #1a2d3a !important;
          color: #8fa3b1 !important;
          border-color: rgba(255,255,255,0.08) !important;
        }
        .leaflet-control-zoom a:hover {
          background: #243d4e !important;
          color: #EA9940 !important;
        }
      `}</style>
      <div ref={divRef} style={{ width: "100%", height: "100%" }} />
    </>
  );
}
