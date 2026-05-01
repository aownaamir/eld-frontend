"use client";

import { DayLog, TripResponse } from "../types";
import LogCard from "./LogCard";

type Props = {
  data: TripResponse | null;
};

export default function TripLogsSection({ data }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
          Daily ELD Logs
        </h2>
        <span className="text-xs text-zinc-400">{data?.logs.length} days</span>
      </div>
      <div className="space-y-4">
        {data?.logs.map((day) => (
          <LogCard key={day.day} day={day} />
        ))}
      </div>
    </div>
  );
}
