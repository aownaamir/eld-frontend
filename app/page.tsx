"use client";

import { useState } from "react";
import axios from "axios";
import TripForm from "./components/TripForm";
import LogGrid from "./components/LogoGrid";
import { TripResponse } from "./types";
import MapView from "./components/MapView";

export default function Home() {
  const [data, setData] = useState<TripResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (form: any) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post<TripResponse>(
        "http://127.0.0.1:8000/api/trip/",
        form,
      );
      setData(res.data);
    } catch {
      setError("Failed to generate trip. Check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* HEADER */}
      <header className="border-b border-zinc-800/80 px-8 py-4 flex items-center gap-3">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
          EL
        </div>
        <h1 className="text-base font-semibold tracking-tight text-white">
          ELD Trip Planner
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          <span className="text-xs text-zinc-500">
            FMCSA Compliant · 70 hr / 8 day
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* TWO-COLUMN LAYOUT — items-stretch makes both columns equal height */}
        <div className="flex gap-5 items-stretch">
          {/* LEFT — Form (60%) */}
          <div className="w-[60%] shrink-0 flex flex-col gap-4">
            {/* Card stretches to fill the column via flex-1 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col flex-1">
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-white">
                  Plan Your Trip
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Enter trip details to generate ELD logs and your route.
                </p>
              </div>
              {/* TripForm fills remaining space; its button stays at bottom */}
              <TripForm onSubmit={handleSubmit} loading={loading} />
            </div>

            {error && (
              <div className="bg-red-950/60 border border-red-800/60 text-red-300 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
          </div>

          {/* RIGHT — Summary Cards + Map (40%) */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              {data ? (
                <>
                  <SummaryCard
                    label="Days"
                    value={String(data.summary.total_days)}
                  />
                  <SummaryCard
                    label="Distance"
                    value={String(data.summary.total_distance)}
                    unit="mi"
                  />
                  <SummaryCard
                    label="Cycle"
                    value={String(data.summary.cycle_used ?? "—")}
                    unit="hrs"
                  />
                </>
              ) : (
                <>
                  <SummaryCard label="Days" value="—" />
                  <SummaryCard label="Distance" value="—" />
                  <SummaryCard label="Cycle" value="—" />
                </>
              )}
            </div>

            {/* Map card grows to fill all remaining right-column height */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col flex-1">
              <div className="px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between shrink-0">
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                  Route Map
                </h3>
                {data && (
                  <span className="text-[11px] text-zinc-600">
                    {data.stops?.length ?? 0} stops
                  </span>
                )}
              </div>

              {data ? (
                <div className="flex-1 min-h-0">
                  <MapView
                    geometry={data.route.geometry}
                    stops={data.stops}
                    fill
                  />
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 text-zinc-700">
                  <div className="w-8 h-8 rounded-full border-2 border-zinc-800 flex items-center justify-center text-lg">
                    ⊕
                  </div>
                  <span className="text-xs">
                    Generate a trip to see the route
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DAILY ELD LOGS — Full width */}
        {data && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                Daily ELD Logs
              </h2>
              <span className="text-xs text-zinc-600">
                {data.logs.length} days
              </span>
            </div>
            <LogGrid logs={data.logs} />
          </div>
        )}
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  const isEmpty = value === "—";
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1.5 font-medium">
        {label}
      </p>
      <p
        className={`text-xl font-bold ${isEmpty ? "text-zinc-700" : "text-blue-400"}`}
      >
        {value}
        {unit && !isEmpty && (
          <span className="text-xs font-normal text-zinc-500 ml-1">{unit}</span>
        )}
      </p>
    </div>
  );
}
