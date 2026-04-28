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
    } catch (e) {
      setError("Failed to generate trip. Check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* HEADER */}
      <header className="border-b border-zinc-800 px-8 py-5 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          EL
        </div>
        <h1 className="text-xl font-semibold tracking-tight">
          ELD Trip Planner
        </h1>
        <span className="ml-auto text-xs text-zinc-500">
          FMCSA Compliant · 70hr/8day
        </span>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        <TripForm onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {data && (
          <>
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
                  Total Days
                </p>
                <p className="text-3xl font-bold text-blue-400">
                  {data.summary.total_days}
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
                  Total Distance
                </p>
                <p className="text-3xl font-bold text-blue-400">
                  {data.summary.total_distance}{" "}
                  <span className="text-base font-normal text-zinc-400">
                    mi
                  </span>
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
                  Cycle Used
                </p>
                <p className="text-3xl font-bold text-blue-400">
                  {data.summary.cycle_used ?? "—"}{" "}
                  <span className="text-base font-normal text-zinc-400">
                    hrs
                  </span>
                </p>
              </div>
            </div>

            {/* MAP */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-800">
                <h2 className="font-semibold text-sm uppercase tracking-widest text-zinc-400">
                  Route Map
                </h2>
              </div>
              <MapView geometry={data.route.geometry} stops={data.stops} />
            </div>

            {/* LOGS */}
            <div>
              <h2 className="font-semibold text-sm uppercase tracking-widest text-zinc-400 mb-4">
                Daily ELD Logs
              </h2>
              <LogGrid logs={data.logs} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
