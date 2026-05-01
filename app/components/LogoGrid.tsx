"use client";

import { useEffect, useRef, useState } from "react";
import { DayLog, Segment } from "@/types";

type Props = {
  logs: DayLog[];
};

const ROWS = [
  { label: "Off Duty", key: "off_duty" },
  { label: "Sleeper Berth", key: "sleeper" },
  { label: "Driving", key: "driving" },
  { label: "On Duty", key: "on_duty" },
];

const LINE_COLOR = "#dc2626"; // 18181b

const HOURS = Array.from({ length: 25 }, (_, i) => i);
const ROW_HEIGHT = 44;
const LABEL_WIDTH = 108;

function timeToFraction(dateString: string, isEnd = false): number {
  const d = new Date(dateString);
  const totalMinutes = d.getHours() * 60 + d.getMinutes();
  if (isEnd && totalMinutes === 0) return 1;
  return totalMinutes / (24 * 60);
}

function getRowIndex(type: Segment["type"]): number {
  return ROWS.findIndex((r) => r.key === type);
}

function summariseDayHours(segments: Segment[]) {
  const totals: Record<string, number> = {};
  for (const seg of segments) {
    const ms = new Date(seg.end).getTime() - new Date(seg.start).getTime();
    totals[seg.type] = (totals[seg.type] ?? 0) + ms / 3_600_000;
  }
  return totals;
}

function DayLogCard({ day }: { day: DayLog }) {
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
  const svgHeight = ROW_HEIGHT * ROWS.length;

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

  const fromTime = firstSegment
    ? new Date(firstSegment.start).toLocaleTimeString([], {
        day: "2-digit",
        month: "short",
      })
    : "";

  const toTime = lastSegment
    ? new Date(lastSegment.end).toLocaleTimeString([], {
        day: "2-digit",
        month: "short",
      })
    : "";

  return (
    <div className="bg-white border border-zinc-200 overflow-hidden">
      {/* Day Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100">
        <div className="flex items-center gap-3">
          {/* <div className="w-7 h-7 bg-red-600 flex items-center justify-center text-xs font-bold text-white">
            {day.day}
          </div> */}

          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-sm text-zinc-900">
              Day {day.day}
            </span>

            <span className="text-xs text-zinc-500">{dateStr}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-zinc-500 border border-zinc-200 px-2.5 py-1">
            {drivingHrs.toFixed(1)}h driving
          </span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500 border border-zinc-200 px-2.5 py-1">
            {onDutyHrs.toFixed(1)}h on duty
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="px-5 py-4">
        <div className="flex gap-0">
          {/* Row Labels */}
          <div
            className="shrink-0 flex flex-col"
            style={{ width: LABEL_WIDTH }}
          >
            {ROWS.map((r) => (
              <div
                key={r.key}
                className="flex items-center"
                style={{ height: ROW_HEIGHT }}
              >
                <span className="text-xs font-medium text-zinc-500">
                  {r.label}
                </span>
              </div>
            ))}
          </div>

          {/* SVG container — takes all remaining width */}
          <div ref={containerRef} className="flex-1 min-w-0">
            <svg
              width="100%"
              height={svgHeight}
              viewBox={`0 0 ${gridWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              style={{
                display: "block",
                background: "#ffffff",
                border: "1px solid #e4e4e7",
                borderRadius: 4,
              }}
            >
              {/* Row backgrounds */}
              {ROWS.map((_, i) => (
                <rect
                  key={i}
                  x={0}
                  y={i * ROW_HEIGHT}
                  width={gridWidth}
                  height={ROW_HEIGHT}
                  fill={i % 2 === 0 ? "#ffffff" : "#ffffff"}
                />
              ))}

              {/* Horizontal dividers */}
              {ROWS.map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1={0}
                  y1={i * ROW_HEIGHT}
                  x2={gridWidth}
                  y2={i * ROW_HEIGHT}
                  stroke="#e4e4e7"
                  strokeWidth={1}
                />
              ))}
              <line
                x1={0}
                y1={svgHeight}
                x2={gridWidth}
                y2={svgHeight}
                stroke="#e4e4e7"
                strokeWidth={1}
              />

              {/* Vertical hour lines */}
              {HOURS.map((h) => (
                <line
                  key={`v-${h}`}
                  x1={(h / 24) * gridWidth}
                  y1={0}
                  x2={(h / 24) * gridWidth}
                  y2={svgHeight}
                  stroke={"#d4d4d8"}
                  strokeWidth={h % 6 === 0 ? 1.5 : 1}
                />
              ))}

              {/* Single continuous step-line — real FMCSA style */}
              {(() => {
                if (sorted.length === 0) return null;

                // Build one SVG path: horizontal line for each segment,
                // vertical drop/rise between consecutive segments.
                const points: string[] = [];

                sorted.forEach((seg, i) => {
                  const rowIdx = getRowIndex(seg.type);
                  if (rowIdx < 0) return;
                  const x1 = timeToFraction(seg.start) * gridWidth;
                  const x2 = timeToFraction(seg.end, true) * gridWidth;
                  const y = rowIdx * ROW_HEIGHT + ROW_HEIGHT / 2;

                  if (i === 0) {
                    points.push(`M ${x1} ${y}`);
                  } else {
                    // vertical transition from previous row to this row
                    points.push(`V ${y}`);
                  }
                  // horizontal segment
                  points.push(`H ${x2}`);
                });

                return (
                  <path
                    d={points.join(" ")}
                    stroke={LINE_COLOR}
                    strokeWidth={1.27}
                    strokeLinecap="square"
                    fill="none"
                  />
                );
              })()}
            </svg>

            {/* Hour labels */}
            <div className="relative mt-1" style={{ height: 14 }}>
              {HOURS.map((h) => (
                <span
                  key={h}
                  className="absolute text-[10px] text-zinc-400 -translate-x-1/2"
                  style={{ left: `${(h / 24) * 100}%` }}
                >
                  {h === 0 ? "Mid" : h === 12 ? "Noon" : h === 24 ? "Mid" : h}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Remarks */}
        {day.segments.some((s) => s.note) && (
          <div className="mt-4 pt-3.5 border-t border-zinc-100">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-2 font-medium">
              Remarks
            </p>
            <div className="flex flex-wrap gap-1.5">
              {day.segments
                .filter((s) => s.note)
                .map((s, i) => (
                  <span
                    key={i}
                    className="text-xs text-zinc-500 px-3 py-1 border border-zinc-200"
                  >
                    {s.note.charAt(0).toUpperCase() + s.note.slice(1)} at{" "}
                    {new Date(s.start).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LogGrid({ logs }: Props) {
  return (
    <div className="space-y-4">
      {logs.map((day) => (
        <DayLogCard key={day.day} day={day} />
      ))}
    </div>
  );
}
