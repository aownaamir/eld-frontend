"use client";

import { useState } from "react";
import axios from "axios";
import TripForm from "./components/TripForm";
import LogGrid from "./components/LogoGrid";
import { TripResponse } from "./types";

export default function Home() {
  const [data, setData] = useState<TripResponse | null>(null);

  const handleSubmit = async (form: any) => {
    const res = await axios.post<TripResponse>(
      "http://127.0.0.1:8000/api/trip/",
      form,
    );
    setData(res.data);
  };

  return (
    <main className="p-6 space-y-6">
      <TripForm onSubmit={handleSubmit} />

      {data && (
        <>
          <div className="p-4 border rounded">
            <h2 className="font-bold">Summary</h2>
            <p>Days: {data.summary.total_days}</p>
            <p>Distance: {data.summary.total_distance}</p>
          </div>

          <LogGrid logs={data.logs} />
        </>
      )}
    </main>
  );
}
