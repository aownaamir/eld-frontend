"use client";

import { useState } from "react";
import LocationInput from "./LocationInput";

type Props = {
  onSubmit: (data: any) => void;
  loading?: boolean;
};

export default function TripForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState({
    current_location: "",
    pickup: "",
    dropoff: "",
    cycle_used: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isReady = form.current_location && form.pickup && form.dropoff;

  return (
    <div className="flex flex-col flex-1 gap-5">
      <div className="flex flex-col gap-5 flex-1">
        {/* Row 1: Current Location + Cycle Used */}
        <div className="grid grid-cols-2 gap-3">
          <LocationInput
            label="Current Location"
            placeholder="e.g. Chicago, IL"
            icon="🚛"
            onSelect={(val) => setForm({ ...form, current_location: val })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
              Cycle Used (hrs)
            </label>
            <div className="flex items-center bg-white border border-zinc-200 px-4 py-3 gap-3 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-200 transition">
              <span className="text-zinc-400 text-sm shrink-0">⏱</span>
              <input
                name="cycle_used"
                type="number"
                min={0}
                max={70}
                placeholder="e.g. 20"
                onChange={handleChange}
                className="bg-transparent text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none w-full"
              />
              <span className="text-xs text-zinc-300 shrink-0">/ 70</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-100" />
          <span className="text-[10px] uppercase tracking-widest text-zinc-300 font-medium">
            Route
          </span>
          <div className="flex-1 h-px bg-zinc-100" />
        </div>

        {/* Row 2: Pickup + Dropoff */}
        <div className="grid grid-cols-2 gap-3">
          <LocationInput
            label="Pickup"
            placeholder="e.g. Dallas, TX"
            icon="📦"
            onSelect={(val) => setForm({ ...form, pickup: val })}
          />
          <LocationInput
            label="Dropoff"
            placeholder="e.g. Los Angeles, CA"
            icon="🏁"
            onSelect={(val) => setForm({ ...form, dropoff: val })}
          />
        </div>

        {/* Info strip */}
        <div className="flex-1 border border-zinc-100 bg-zinc-50 flex flex-col items-center justify-center gap-3 px-6 py-5 min-h-[80px]">
          <p className="text-xs text-zinc-400 text-center leading-relaxed">
            Fill in your origin, pickup, and dropoff to generate FMCSA-compliant
            ELD logs and a route map.
          </p>
          <div className="flex items-center gap-5 mt-1">
            {[
              { dot: "bg-emerald-500", label: "HOS compliant" },
              { dot: "bg-red-500", label: "Auto fuel stops" },
              { dot: "bg-amber-400", label: "30-min breaks" },
            ].map(({ dot, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 ${dot}`} />
                <span className="text-[11px] text-zinc-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={() => onSubmit(form)}
        disabled={loading || !isReady}
        className={`
          w-full font-semibold py-3.5 transition-all text-sm tracking-wide
          flex items-center justify-center gap-2
          ${
            loading
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              : isReady
                ? "bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white"
                : "bg-zinc-100 text-zinc-300 cursor-not-allowed border border-zinc-200"
          }
        `}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
            Generating Trip…
          </>
        ) : (
          <>
            Generate Trip <span className="text-base">→</span>
          </>
        )}
      </button>
    </div>
  );
}
