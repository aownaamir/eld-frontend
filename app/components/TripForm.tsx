"use client";

import { useState } from "react";
import LocationInput from "./LocationInput";

type Props = {
  onSubmit: (data: any) => void;
  loading?: boolean;
};

const HOS_RULES = [
  { rule: "11 h", desc: "Max driving per day" },
  { rule: "14 h", desc: "On-duty window" },
  { rule: "30 min", desc: "Break after 8 h driving" },
  { rule: "10 h", desc: "Off-duty reset required" },
  { rule: "70 h", desc: "Cycle limit (8 days)" },
  { rule: "34 h", desc: "Restart off-duty" },
];

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
        <div className="grid grid-cols-2 gap-3">
          <LocationInput
            label="Current Location"
            onSelect={(val) => setForm({ ...form, current_location: val })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
              Cycle Used (hrs)
            </label>
            <div className="flex items-center bg-white border border-zinc-200 px-4 py-3 gap-3 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-200 transition">
              <input
                name="cycle_used"
                type="number"
                min={0}
                max={70}
                placeholder="Cycles"
                onChange={handleChange}
                className="bg-transparent text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none w-full"
              />
              <span className="text-xs text-zinc-300 shrink-0">/ 70</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        {/* <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-100" />
          <span className="text-[10px] uppercase tracking-widest text-zinc-300 font-medium">
            Route
          </span>
          <div className="flex-1 h-px bg-zinc-100" />
        </div> */}

        <div className="grid grid-cols-2 gap-3">
          <LocationInput
            label="Pickup"
            onSelect={(val) => setForm({ ...form, pickup: val })}
          />
          <LocationInput
            label="Dropoff"
            onSelect={(val) => setForm({ ...form, dropoff: val })}
          />
        </div>

        {/* HOS Quick-Reference */}
        <div className="px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-2.5">
            HOS Rules · 70 hr / 8 day cycle
          </p>
          <div className="grid grid-cols-2 gap-x-6">
            {HOS_RULES.map(({ rule, desc }) => (
              <div
                key={rule + desc}
                className="flex items-baseline gap-2 py-1.5 border-b border-zinc-100 last:border-0"
              >
                <span className="text-sm font-medium text-zinc-900 tabular-nums w-14 shrink-0">
                  {rule}
                </span>
                <span className="text-[11px] text-zinc-400 leading-tight">
                  {desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

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
          <>Generate Trip</>
        )}
      </button>
    </div>
  );
}
