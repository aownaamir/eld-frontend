"use client";

import { DayLog, Segment } from "@/types";

type Props = {
  logs: DayLog[];
};

const ROWS = [
  { label: "Off Duty", key: "off_duty", color: "#6b7280" },
  { label: "Sleeper Berth", key: "sleeper", color: "#10b981" },
  { label: "Driving", key: "driving", color: "#3b82f6" },
  { label: "On Duty", key: "on_duty", color: "#f59e0b" },
];

const HOURS = Array.from({ length: 25 }, (_, i) => i);

const ROW_HEIGHT = 48;
const GRID_WIDTH = 800;
const LABEL_WIDTH = 120;

function timeToX(dateString: string, isEnd = false): number {
  const d = new Date(dateString);
  const totalMinutes = d.getHours() * 60 + d.getMinutes();
  if (isEnd && totalMinutes === 0) return GRID_WIDTH; // midnight end = right edge
  return (totalMinutes / (24 * 60)) * GRID_WIDTH;
}

function getRowIndex(type: Segment["type"]): number {
  return ROWS.findIndex((r) => r.key === type);
}

function getColor(type: Segment["type"]): string {
  return ROWS.find((r) => r.key === type)?.color ?? "#fff";
}

export default function LogGrid({ logs }: Props) {
  const svgHeight = ROW_HEIGHT * ROWS.length;

  return (
    <div className="space-y-6">
      {logs.map((day) => (
        <div
          key={day.day}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
        >
          {/* Day Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                {day.day}
              </div>
              <h3 className="font-semibold text-white">Day {day.day}</h3>
            </div>
            {/* Legend */}
            {/* <div className="flex items-center gap-4">
              {ROWS.map((r) => (
                <div key={r.key} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs text-zinc-400">{r.label}</span>
                </div>
              ))}
            </div> */}
          </div>

          {/* Grid */}
          <div className="px-6 py-5">
            <div className="flex">
              {/* Row Labels */}
              <div
                className="flex flex-col text-xs text-zinc-400 shrink-0"
                style={{ width: LABEL_WIDTH }}
              >
                {ROWS.map((r) => (
                  <div
                    key={r.key}
                    className="flex items-center"
                    style={{ height: ROW_HEIGHT }}
                  >
                    <span className="font-medium" style={{ color: r.color }}>
                      {r.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* SVG Grid */}
              <div className="overflow-x-auto w-full">
                <svg
                  width={GRID_WIDTH}
                  height={svgHeight}
                  className="rounded-lg"
                  style={{ background: "#18181b" }}
                >
                  {/* Row backgrounds alternating */}
                  {ROWS.map((_, i) => (
                    <rect
                      key={i}
                      x={0}
                      y={i * ROW_HEIGHT}
                      width={GRID_WIDTH}
                      height={ROW_HEIGHT}
                      fill={i % 2 === 0 ? "#18181b" : "#1f1f23"}
                    />
                  ))}

                  {/* Horizontal row lines */}
                  {ROWS.map((_, i) => (
                    <line
                      key={`h-${i}`}
                      x1={0}
                      y1={i * ROW_HEIGHT}
                      x2={GRID_WIDTH}
                      y2={i * ROW_HEIGHT}
                      stroke="#3f3f46"
                      strokeWidth={1}
                    />
                  ))}
                  <line
                    x1={0}
                    y1={svgHeight}
                    x2={GRID_WIDTH}
                    y2={svgHeight}
                    stroke="#3f3f46"
                    strokeWidth={1}
                  />

                  {/* Vertical hour lines */}
                  {HOURS.map((h) => (
                    <line
                      key={`v-${h}`}
                      x1={(h * GRID_WIDTH) / 24}
                      y1={0}
                      x2={(h * GRID_WIDTH) / 24}
                      y2={svgHeight}
                      stroke={h % 6 === 0 ? "#52525b" : "#27272a"}
                      strokeWidth={h % 6 === 0 ? 1.5 : 1}
                    />
                  ))}

                  {/* Step-line graph */}
                  {(() => {
                    const sorted = [...day.segments].sort(
                      (a, b) =>
                        new Date(a.start).getTime() -
                        new Date(b.start).getTime(),
                    );

                    const LINE_COLOR = "#3b82f6";
                    const VERT_COLOR = "#3b82f6";

                    const elements: React.ReactNode[] = [];

                    sorted.forEach((seg, i) => {
                      const x1 = timeToX(seg.start);
                      const x2 = timeToX(seg.end, true);
                      const rowIdx = getRowIndex(seg.type);
                      const y = rowIdx * ROW_HEIGHT + ROW_HEIGHT / 2;
                      const segWidth = Math.max(x2 - x1, 2);

                      // Background fill
                      elements.push(
                        <rect
                          key={`bg-${i}`}
                          x={x1}
                          y={rowIdx * ROW_HEIGHT + 4}
                          width={segWidth}
                          height={ROW_HEIGHT - 8}
                          fill={LINE_COLOR}
                          fillOpacity={0.08}
                          rx={2}
                        />,
                      );

                      // Horizontal line
                      elements.push(
                        <line
                          key={`line-${i}`}
                          x1={x1}
                          y1={y}
                          x2={x2}
                          y2={y}
                          stroke={LINE_COLOR}
                          strokeWidth={2.5}
                          strokeLinecap="round"
                        />,
                      );

                      // Start dot
                      elements.push(
                        <circle
                          key={`dot-start-${i}`}
                          cx={x1}
                          cy={y}
                          r={3}
                          fill={LINE_COLOR}
                        />,
                      );

                      // End dot
                      elements.push(
                        <circle
                          key={`dot-end-${i}`}
                          cx={x2}
                          cy={y}
                          r={3}
                          fill={LINE_COLOR}
                        />,
                      );

                      // Vertical transition to next
                      const next = sorted[i + 1];
                      if (next) {
                        const nextRowIdx = getRowIndex(next.type);
                        const nextY = nextRowIdx * ROW_HEIGHT + ROW_HEIGHT / 2;

                        elements.push(
                          <line
                            key={`vert-${i}`}
                            x1={x2}
                            y1={y}
                            x2={x2}
                            y2={nextY}
                            stroke={VERT_COLOR}
                            strokeWidth={2.5}
                            strokeLinecap="round"
                          />,
                        );
                      }
                    });

                    return elements;
                  })()}
                </svg>

                {/* Hour labels */}
                <div
                  className="flex justify-between text-xs text-zinc-600 mt-1 px-0"
                  style={{ width: GRID_WIDTH }}
                >
                  {HOURS.map((h) => (
                    <span key={h} className="w-0 text-center">
                      {h === 0
                        ? "Mid"
                        : h === 12
                          ? "Noon"
                          : h === 24
                            ? "Mid"
                            : h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes / Remarks */}
            {day.segments.some((s) => s.note) && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">
                  Remarks
                </p>
                <div className="flex flex-wrap gap-2">
                  {day.segments
                    .filter((s) => s.note)
                    .map((s, i) => (
                      <span
                        key={i}
                        className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full border border-zinc-700"
                      >
                        {s.note} —{" "}
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
      ))}
    </div>
  );
}
