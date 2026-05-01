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
    <main className="min-h-screen bg-white text-zinc-900">
      {/* HEADER */}
      <header className="border-b border-zinc-200 px-8 py-4 flex items-center gap-3 bg-white">
        <div className="w-7 h-7 bg-red-600 flex items-center justify-center text-white font-bold text-xs">
          EL
        </div>
        <h1 className="text-base font-semibold tracking-tight text-zinc-900">
          ELD Trip Planner
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-500 inline-block" />
          <span className="text-xs text-zinc-400">
            FMCSA Compliant · 70 hr / 8 day
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* TWO-COLUMN LAYOUT */}
        <div className="flex gap-5 items-stretch">
          {/* LEFT — Form (60%) */}
          <div className="w-[60%] shrink-0 flex flex-col gap-4">
            <div className="bg-white border border-zinc-200 p-6 flex flex-col flex-1">
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-zinc-900">
                  Plan Your Trip
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Enter trip details to generate ELD logs and your route.
                </p>
              </div>
              <TripForm onSubmit={handleSubmit} loading={loading} />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
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

            {/* Map */}
            <div className="bg-white border border-zinc-200 overflow-hidden flex flex-col flex-1">
              <div className="px-4 py-2.5 border-b border-zinc-200 flex items-center justify-between shrink-0">
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                  Route Map
                </h3>
                {data && (
                  <span className="text-[11px] text-zinc-400">
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
                <div className="flex-1 flex flex-col items-center justify-center gap-2 text-zinc-300">
                  <div className="w-8 h-8 border border-zinc-200 flex items-center justify-center text-zinc-300 text-lg">
                    ⊕
                  </div>
                  <span className="text-xs text-zinc-400">
                    Generate a trip to see the route
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DAILY ELD LOGS */}
        {data && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                Daily ELD Logs
              </h2>
              <span className="text-xs text-zinc-400">
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
    <div className="bg-white border border-zinc-200 p-4">
      <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1.5 font-medium">
        {label}
      </p>
      <p
        className={`text-xl font-bold ${isEmpty ? "text-zinc-200" : "text-red-600"}`}
      >
        {value}
        {unit && !isEmpty && (
          <span className="text-xs font-normal text-zinc-400 ml-1">{unit}</span>
        )}
      </p>
    </div>
  );
}
