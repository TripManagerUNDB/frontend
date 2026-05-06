'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { MapPin } from '@/types/trip';
import 'leaflet/dist/leaflet.css';

const TYPE_COLORS: Record<string, string> = {
  passeio:     '#EA9940',
  restaurante: '#6CA3A2',
  hospedagem:  '#307082',
  transporte:  '#ECE7DC',
};

function createIcon(L: typeof import('leaflet'), type: string, label: number) {
  const color = TYPE_COLORS[type] ?? '#EA9940';
  const textColor = type === 'transporte' ? '#12212E' : '#fff';
  return L.divIcon({
    className: '',
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
  const color = TYPE_COLORS[pin.type] ?? '#EA9940';
  return `
    <div style="font-family:'DM Sans',sans-serif;min-width:140px">
      <strong style="font-size:13px;color:#12212E">${pin.activity}</strong>
      <div style="font-size:11px;color:#555;margin-top:2px">${pin.location}</div>
      <div style="margin-top:6px;display:flex;gap:6px;align-items:center">
        <span style="
          background:${color};color:#fff;border-radius:100px;
          padding:2px 8px;font-size:10px;font-weight:600;
        ">${pin.type}</span>
        <span style="font-size:10px;color:#888">Dia ${pin.day} · ${pin.time}</span>
      </div>
    </div>
  `;
}

export function LeafletMap({ pins, activeDay }: { pins: MapPin[]; activeDay?: number }) {
  const divRef    = useRef<HTMLDivElement>(null);
  const mapRef    = useRef<import('leaflet').Map | null>(null);
  const LRef      = useRef<typeof import('leaflet') | null>(null);
  const markersRef = useRef<import('leaflet').Marker[]>([]);

  // Keep latest props accessible from callbacks without re-creating them
  const pinsRef      = useRef(pins);
  const activeDayRef = useRef(activeDay);
  pinsRef.current      = pins;
  activeDayRef.current = activeDay;

  const syncMarkers = useCallback(() => {
    const L   = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const visible = activeDayRef.current != null
      ? pinsRef.current.filter(p => p.day === activeDayRef.current)
      : pinsRef.current;

    visible.forEach((pin, i) => {
      const marker = L.marker(
        [pin.coordinates.lat, pin.coordinates.lng],
        { icon: createIcon(L, pin.type, i + 1) },
      )
        .addTo(map)
        .bindPopup(popupHtml(pin), { className: 'leaflet-trip-popup' });
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

    import('leaflet').then((L) => {
      if (mapRef.current) return;

      const map = L.map(divRef.current!, { zoomControl: false })
        .setView([48.8566, 2.3522], 12);

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a> &copy; <a href="https://carto.com">CARTO</a>',
          maxZoom: 19,
        },
      ).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      LRef.current  = L;
      mapRef.current = map;
      syncMarkers();
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      LRef.current   = null;
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
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.35);
          border: none;
          padding: 0;
        }
        .leaflet-trip-popup .leaflet-popup-content { margin: 12px 14px; }
        .leaflet-trip-popup .leaflet-popup-tip { background: #fff; }
        .leaflet-container { font-family: 'DM Sans', sans-serif; }
      `}</style>
      <div ref={divRef} style={{ width: '100%', height: '100%' }} />
    </>
  );
}
