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
  fill?: boolean;
};

const STOP_COLORS: Record<string, string> = {
  pickup: "#16a34a",
  dropoff: "#dc2626",
  fuel: "#d97706",
  rest: "#9ca3af",
};

const STOP_LABELS: Record<string, string> = {
  pickup: "P",
  dropoff: "D",
  fuel: "F",
  rest: "R",
};

const LEGEND_NAMES: Record<string, string> = {
  pickup: "Pickup",
  dropoff: "Dropoff",
  fuel: "Fuel",
  rest: "Rest",
};

export default function MapView({ geometry, stops = [], fill = false }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-98, 39],
      zoom: 3.5,
      // attributionControl: false,
    });
    // mapInstance.current.addControl(
    //   new mapboxgl.NavigationControl({ showCompass: false }),
    //   "top-right",
    // );
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
      if (map.getLayer("route-casing")) map.removeLayer("route-casing");
      if (map.getSource("route")) map.removeSource("route");

      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates: geometry },
        },
      });

      // White casing for contrast on light map
      map.addLayer({
        id: "route-casing",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-width": 6,
          "line-color": "#ffffff",
          "line-opacity": 0.8,
        },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-width": 3, "line-color": "#dc2626", "line-opacity": 1 },
      });

      stops.forEach((stop) => {
        const color = STOP_COLORS[stop.type] ?? "#000";
        const letter = STOP_LABELS[stop.type] ?? "•";
        const el = document.createElement("div");
        el.style.cssText = `
          width:26px;height:26px;
          background:${color};border:2px solid white;
          display:flex;align-items:center;justify-content:center;
          font-size:10px;font-weight:700;color:white;cursor:pointer;
          box-shadow:0 2px 8px rgba(0,0,0,0.2);
        `;
        el.innerText = letter;

        const popup = new mapboxgl.Popup({ offset: 14, closeButton: false })
          .setHTML(`
          <div style="font-family:system-ui;font-size:12px;font-weight:500;padding:2px 4px;">
            ${stop.label}
          </div>
        `);

        markersRef.current.push(
          new mapboxgl.Marker({ element: el })
            .setLngLat(stop.coordinates)
            .setPopup(popup)
            .addTo(map),
        );
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
    <div className="relative h-full">
      <div
        ref={mapRef}
        className={fill ? "w-full h-full" : "w-full h-[300px]"}
        style={fill ? { minHeight: 260 } : undefined}
      />

      {/* Legend */}
      {/* <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-white border border-zinc-200 px-3 py-2 shadow-sm">
        {Object.entries(STOP_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-[11px] text-zinc-500 capitalize leading-none">
              {LEGEND_NAMES[type]}
            </span>
          </div>
        ))}
      </div> */}
    </div>
  );
}
