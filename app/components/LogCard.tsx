import { useEffect, useRef, useState } from "react";
import { DayLog, Segment } from "../types";
import LogCardHeader from "./LogCardHeader";
import LogCardGrid from "./LogCardGrid";

function summariseDayHours(segments: Segment[]) {
  const totals: Record<string, number> = {};
  for (const seg of segments) {
    const ms = new Date(seg.end).getTime() - new Date(seg.start).getTime();
    totals[seg.type] = (totals[seg.type] ?? 0) + ms / 3_600_000;
  }
  return totals;
}

export default function LogCard({ day }: { day: DayLog }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridWidth, setGridWidth] = useState(600);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setGridWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const totals = summariseDayHours(day.segments);
  const drivingHrs = totals["driving"] ?? 0;
  const onDutyHrs = (totals["on_duty"] ?? 0) + drivingHrs;

  const sorted = [...day.segments].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );

  const firstSegment = sorted[0];
  const lastSegment = sorted[sorted.length - 1];

  const dateStr = firstSegment
    ? new Date(firstSegment.start).toLocaleDateString([], {
        day: "2-digit",
        month: "short",
      })
    : "";

  return (
    <div className="bg-white border border-zinc-200 overflow-hidden">
      <LogCardHeader
        day={day}
        dateStr={dateStr}
        drivingHrs={drivingHrs}
        onDutyHrs={onDutyHrs}
      />

      <LogCardGrid
        day={day}
        gridWidth={gridWidth}
        containerRef={containerRef}
        sorted={sorted}
      />
    </div>
  );
}
