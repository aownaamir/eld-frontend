"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type Props = {
  geometry?: number[][];
  fill?: boolean;
};

export default function MapView({ geometry, fill = false }: Props) {
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
          properties: {},
          geometry: { type: "LineString", coordinates: geometry },
        },
      });

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
  }, [geometry]);

  return (
    <div className="relative h-full">
      <div
        ref={mapRef}
        className={fill ? "w-full h-full" : "w-full h-75"}
        style={fill ? { minHeight: 260 } : undefined}
      />
    </div>
  );
}
