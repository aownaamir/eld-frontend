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

export default function MapView({ geometry, stops = [] }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Init map once
  useEffect(() => {
    if (!mapRef.current) return;

    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-98, 39],
      zoom: 3.5,
    });

    mapInstance.current.addControl(
      new mapboxgl.NavigationControl(),
      "top-right",
    );

    return () => {
      mapInstance.current?.remove();
    };
  }, []);

  // Update route and stops when data changes
  useEffect(() => {
    if (!mapInstance.current || !geometry?.length) return;

    const map = mapInstance.current;

    const draw = () => {
      // Remove old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Remove old layers/sources
      if (map.getLayer("route-line")) map.removeLayer("route-line");
      if (map.getLayer("route-glow")) map.removeLayer("route-glow");
      if (map.getSource("route")) map.removeSource("route");

      // Add route source
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: geometry,
          },
        },
      });

      // Glow layer under
      map.addLayer({
        id: "route-glow",
        type: "line",
        source: "route",
        paint: {
          "line-width": 8,
          "line-color": "#3b82f6",
          "line-opacity": 0.2,
          "line-blur": 4,
        },
      });

      // Main route line
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-width": 3,
          "line-color": "#3b82f6",
          "line-opacity": 0.9,
        },
      });

      // Add stop markers
      stops.forEach((stop) => {
        const color = STOP_COLORS[stop.type] ?? "#fff";
        const letter = STOP_LABELS[stop.type] ?? "•";

        const el = document.createElement("div");
        el.style.cssText = `
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: ${color};
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: bold;
          color: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        `;
        el.innerText = letter;

        const popup = new mapboxgl.Popup({ offset: 15 }).setHTML(`
          <div style="font-family: sans-serif; font-size: 13px; padding: 4px 6px;">
            <strong>${stop.label}</strong>
          </div>
        `);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(stop.coordinates)
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });

      // Fit map to route
      const bounds = geometry.reduce(
        (b, coord) => b.extend(coord as [number, number]),
        new mapboxgl.LngLatBounds(
          geometry[0] as [number, number],
          geometry[0] as [number, number],
        ),
      );

      map.fitBounds(bounds, { padding: 60, duration: 1000 });
    };

    if (map.isStyleLoaded()) {
      draw();
    } else {
      map.once("load", draw);
    }
  }, [geometry, stops]);

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-[450px]" />

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-zinc-900 bg-opacity-90 border border-zinc-700 rounded-xl px-4 py-3 flex flex-col gap-2">
        {Object.entries(STOP_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-white"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-zinc-300 capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
