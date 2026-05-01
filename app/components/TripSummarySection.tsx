import SummaryCard from "./SummaryCard";
import { TripResponse } from "../types";

export default function TripSummarySection({
  data,
}: {
  data: TripResponse | null;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {data ? (
        <>
          <SummaryCard label="Days" value={String(data.summary.total_days)} />
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
  );
}
