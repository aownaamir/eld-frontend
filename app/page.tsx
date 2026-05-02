"use client";

import { useState } from "react";
import axios from "axios";
import { TripResponse } from "./types";
import Header from "./components/Header";
import TripFormSection from "./components/TripFormSection";
import TripSummarySection from "./components/TripSummarySection";
import TripMapSection from "./components/TripMapSection";
import TripLogsSection from "./components/TripLogsSection";
import TripError from "./components/TripError";

export default function Home() {
  const [data, setData] = useState<TripResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (form: any) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post<TripResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/trip/`,
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
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div className="flex gap-5 items-stretch">
          <div className="w-[60%] shrink-0 flex flex-col gap-4">
            <TripFormSection onSubmit={handleSubmit} loading={loading} />
            {error && <TripError error={error} />}
          </div>

          <div className="flex-1 flex flex-col gap-3">
            <TripSummarySection data={data} />
            <TripMapSection data={data} />
          </div>
        </div>

        {data && <TripLogsSection data={data} />}
      </div>
    </main>
  );
}
