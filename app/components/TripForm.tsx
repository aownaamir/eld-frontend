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

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
      <h2 className="text-lg font-semibold mb-1">Plan Your Trip</h2>
      <p className="text-zinc-500 text-sm mb-6">
        Enter trip details to generate your ELD logs and route
      </p>

      <div className="grid grid-cols-2 gap-4">
        {/* Current Location */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1">
          {/* <label className="text-xs text-zinc-400 uppercase tracking-widest">
            Current Location
          </label> */}
          <LocationInput
            label="Current Location"
            placeholder="e.g. Chicago, IL"
            icon="🚛"
            onSelect={(val) => setForm({ ...form, current_location: val })}
          />
        </div>

        {/* Cycle Used */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1">
          <label className="text-xs text-zinc-400 uppercase tracking-widest">
            Current Cycle Used (hrs)
          </label>
          <input
            name="cycle_used"
            type="number"
            min={0}
            max={70}
            placeholder="e.g. 20"
            onChange={handleChange}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Pickup */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1">
          {/* <label className="text-xs text-zinc-400 uppercase tracking-widest">
            Pickup Location
          </label> */}
          <LocationInput
            label="Pickup Location"
            placeholder="e.g. Dallas, TX"
            icon="📦"
            onSelect={(val) => setForm({ ...form, pickup: val })}
          />
        </div>

        {/* Dropoff */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1">
          {/* <label className="text-xs text-zinc-400 uppercase tracking-widest">
            Dropoff Location
          </label> */}
          <LocationInput
            label="Dropoff Location"
            placeholder="e.g. Los Angeles, CA"
            icon="🏁"
            onSelect={(val) => setForm({ ...form, dropoff: val })}
          />
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={() => onSubmit(form)}
        disabled={loading}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-semibold py-3 rounded-lg transition text-sm tracking-wide"
      >
        {loading ? "Generating Trip..." : "Generate Trip →"}
      </button>
    </div>
  );
}
