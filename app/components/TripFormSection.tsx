"use client";

import { useState } from "react";
import LocationInput from "./LocationInput";
import HOSRules from "./HOSRules";
import TextInput from "./TextInput";
import GenerateButton from "./GenerateButton";

type Props = {
  onSubmit: (data: any) => void;
  loading?: boolean;
};

export default function TripFormSection({ onSubmit, loading }: Props) {
  const [form, setForm] = useState({
    current_location: "",
    pickup: "",
    dropoff: "",
    cycle_used: 0,
  });

  const isReady = form.current_location && form.pickup && form.dropoff;

  return (
    <div className="bg-white border border-zinc-200 p-4 sm:p-6 flex flex-col flex-1">
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-zinc-900">Plan Your Trip</h2>
      </div>
      <div className="flex flex-col flex-1 gap-5">
        <div className="flex flex-col flex-1 gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <LocationInput
              label="Current Location"
              onSelect={(val) => setForm({ ...form, current_location: val })}
            />
            <TextInput
              label="Cycle Used (hrs)"
              placeholder="0"
              value={form.cycle_used.toString()}
              onChange={(val) => setForm({ ...form, cycle_used: Number(val) })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <LocationInput
              label="Pickup"
              onSelect={(val) => setForm({ ...form, pickup: val })}
            />
            <LocationInput
              label="Dropoff"
              onSelect={(val) => setForm({ ...form, dropoff: val })}
            />
          </div>

          <HOSRules />
        </div>

        <GenerateButton
          onSubmit={onSubmit}
          form={form}
          loading={loading}
          isReady={Boolean(isReady)}
        />
      </div>
    </div>
  );
}
