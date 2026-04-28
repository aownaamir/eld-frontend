"use client";
import { useState } from "react";

type Props = {
  onSubmit: (data: any) => void;
};

export default function TripForm({ onSubmit }: Props) {
  const [form, setForm] = useState({
    current_location: "",
    pickup: "",
    dropoff: "",
    cycle_used: 40,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4 border rounded-xl space-y-3">
      <input
        name="current_location"
        placeholder="Current Location"
        onChange={handleChange}
        className="w-full border p-2"
      />
      <input
        name="pickup"
        placeholder="Pickup"
        onChange={handleChange}
        className="w-full border p-2"
      />
      <input
        name="dropoff"
        placeholder="Dropoff"
        onChange={handleChange}
        className="w-full border p-2"
      />
      <input
        name="cycle_used"
        type="number"
        onChange={handleChange}
        className="w-full border p-2"
      />

      <button
        onClick={() => onSubmit(form)}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Generate Trip
      </button>
    </div>
  );
}
