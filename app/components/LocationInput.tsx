"use client";

import { useState, useRef, useEffect } from "react";
import { searchPlaces } from "../lib/mapbox";

type Props = {
  label: string;
  placeholder?: string;
  icon?: string;
  onSelect: (value: string) => void;
};

export default function LocationInput({
  label,
  placeholder,
  icon,
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setResults([]);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      setLoading(true);
      const places = await searchPlaces(value);
      setResults(places);
      setLoading(false);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="flex flex-col gap-1" ref={containerRef}>
      <label className="text-xs text-zinc-400 uppercase tracking-widest">
        {label}
      </label>

      <div className="relative">
        {/* Input */}
        <div
          className={`flex items-center bg-zinc-800 border rounded-lg px-4 py-3 gap-3 transition ${
            focused
              ? "border-blue-500 ring-1 ring-blue-500/30"
              : "border-zinc-700"
          }`}
        >
          {/* Icon */}
          <span className="text-zinc-500 text-sm shrink-0">{icon ?? "📍"}</span>

          <input
            value={query}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            placeholder={placeholder ?? label}
            className="bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none w-full"
          />

          {/* Loading spinner */}
          {loading && (
            <div className="w-4 h-4 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin shrink-0" />
          )}

          {/* Clear button */}
          {query && !loading && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="text-zinc-600 hover:text-zinc-400 transition shrink-0 text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>

        {/* Dropdown */}
        {results.length > 0 && (
          <div className="absolute top-full mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden z-50 shadow-xl shadow-black/40">
            {results.map((place, i) => (
              <div
                key={i}
                onClick={() => {
                  setQuery(place.place_name);
                  onSelect(place.place_name);
                  setResults([]);
                  setFocused(false);
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-700 cursor-pointer transition border-b border-zinc-700/50 last:border-0"
              >
                <span className="text-zinc-500 text-xs shrink-0">📍</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm text-white truncate">
                    {place.place_name.split(",")[0]}
                  </span>
                  <span className="text-xs text-zinc-500 truncate">
                    {place.place_name.split(",").slice(1).join(",").trim()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
