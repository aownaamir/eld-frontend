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
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
        {label}
      </label>

      <div className="relative">
        <div
          className={`flex items-center bg-white border px-4 py-3 gap-3 transition-all ${
            focused
              ? "border-red-400 ring-1 ring-red-100"
              : "border-zinc-200 hover:border-zinc-300"
          }`}
        >
          {/* <span className="text-zinc-400 text-sm shrink-0">{icon ?? "📍"}</span> */}

          <input
            value={query}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            placeholder={placeholder ?? label}
            className="bg-transparent text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none w-full"
          />

          {loading && (
            <div className="w-3.5 h-3.5 border-2 border-zinc-200 border-t-red-500 rounded-full animate-spin shrink-0" />
          )}

          {query && !loading && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="w-4 h-4 flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:cursor-pointer transition shrink-0 text-xs leading-none"
            >
              X
            </button>
          )}
        </div>

        {/* Dropdown */}
        {results.length > 0 && (
          <div className="absolute top-full mt-0.5 w-full bg-white border border-zinc-200 overflow-hidden z-50 shadow-lg shadow-zinc-100">
            {results.map((place, i) => (
              <div
                key={i}
                onClick={() => {
                  setQuery(place.place_name);
                  onSelect(place.place_name);
                  setResults([]);
                  setFocused(false);
                }}
                className="flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 cursor-pointer transition border-b border-zinc-100 last:border-0"
              >
                {/* <span className="text-zinc-300 text-xs mt-0.5 shrink-0">
                  📍
                </span> */}
                <div className="flex flex-col min-w-0">
                  <span className="text-sm text-zinc-900 truncate font-medium">
                    {place.place_name.split(",")[0]}
                  </span>
                  <span className="text-xs text-zinc-400 truncate mt-0.5">
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
