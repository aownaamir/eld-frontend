"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type Stop = {
  coordinates: [number, number];
  type: "pickup" | "dropoff" | "fuel" | "rest";
  label: string;
};

type Props = {
  geometry?: number[][];
  stops?: Stop[];
};

const STOP_COLORS: Record<string, string> = {
  pickup: "#10b981",
  dropoff: "#ef4444",
  fuel: "#f59e0b",
  rest: "#6b7280",
};

const STOP_LABELS: Record<string, string> = {
  pickup: "P",
  dropoff: "D",
  fuel: "F",
  rest: "R",
};

const LEGEND_ICONS: Record<string, string> = {
  pickup: "Pickup",
  dropoff: "Dropoff",
  fuel: "Fuel",
  rest: "Rest",
};

export default function MapView({ geometry, stops = [] }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-98, 39],
      zoom: 3.5,
    });

    mapInstance.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-right",
    );

    return () => {
      mapInstance.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !geometry?.length) return;

    const map = mapInstance.current;

    const draw = () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      if (map.getLayer("route-line")) map.removeLayer("route-line");
      if (map.getLayer("route-glow")) map.removeLayer("route-glow");
      if (map.getSource("route")) map.removeSource("route");

      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates: geometry },
        },
      });

      map.addLayer({
        id: "route-glow",
        type: "line",
        source: "route",
        paint: {
          "line-width": 10,
          "line-color": "#3b82f6",
          "line-opacity": 0.15,
          "line-blur": 6,
        },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-width": 3,
          "line-color": "#3b82f6",
          "line-opacity": 0.95,
        },
      });

      stops.forEach((stop) => {
        const color = STOP_COLORS[stop.type] ?? "#fff";
        const letter = STOP_LABELS[stop.type] ?? "•";

        const el = document.createElement("div");
        el.style.cssText = `
          width: 26px; height: 26px; border-radius: 50%;
          background: ${color}; border: 2px solid rgba(255,255,255,0.9);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: white; cursor: pointer;
          box-shadow: 0 2px 12px rgba(0,0,0,0.5);
        `;
        el.innerText = letter;

        const popup = new mapboxgl.Popup({
          offset: 14,
          closeButton: false,
          className: "eld-popup",
        }).setHTML(`
          <div style="font-family: system-ui; font-size: 12px; font-weight: 500; padding: 2px 4px;">
            ${stop.label}
          </div>
        `);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(stop.coordinates)
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });

      const bounds = geometry.reduce(
        (b, coord) => b.extend(coord as [number, number]),
        new mapboxgl.LngLatBounds(
          geometry[0] as [number, number],
          geometry[0] as [number, number],
        ),
      );

      map.fitBounds(bounds, { padding: 50, duration: 900, maxZoom: 10 });
    };

    if (map.isStyleLoaded()) draw();
    else map.once("load", draw);
  }, [geometry, stops]);

  return (
    <div className="relative">
      {/* Map */}
      <div ref={mapRef} className="w-full h-[300px]" />

      {/* Legend — horizontal strip at bottom */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-zinc-900/90 backdrop-blur-sm border border-zinc-700/60 rounded-lg px-3 py-2">
        {Object.entries(STOP_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-[11px] text-zinc-400 capitalize leading-none">
              {LEGEND_ICONS[type]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
