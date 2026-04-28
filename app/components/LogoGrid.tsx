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

function timeToX(dateString: string): number {
  const d = new Date(dateString);
  // return (d.getHours() + d.getMinutes() / 60) * (GRID_WIDTH / 24);
  const hours = d.getHours() + d.getMinutes() / 60;
  return hours === 0 ? GRID_WIDTH : hours * (GRID_WIDTH / 24);
}

function getRowIndex(type: Segment["type"]): number {
  return ROWS.findIndex((r) => r.key === type);
}

function getColor(type: Segment["type"]): string {
  return ROWS.find((r) => r.key === type)?.color ?? "#fff";
}

export default function LogGrid({ logs }: Props) {
  const svgHeight = ROW_HEIGHT * ROWS.length;
  console.log({ logs });
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
            <div className="flex items-center gap-4">
              {ROWS.map((r) => (
                <div key={r.key} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: r.color }}
                  />
                  <span className="text-xs text-zinc-400">{r.label}</span>
                </div>
              ))}
            </div>
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

                  {/* Segments */}
                  {day.segments.map((seg, i) => {
                    const x1 = timeToX(seg.start);
                    const x2 = timeToX(seg.end);
                    const rowIdx = getRowIndex(seg.type);
                    const y = rowIdx * ROW_HEIGHT;
                    const color = getColor(seg.type);
                    const segWidth = Math.max(x2 - x1, 2);

                    return (
                      <g key={i}>
                        {/* Background fill */}
                        <rect
                          x={x1}
                          y={y + 6}
                          width={segWidth}
                          height={ROW_HEIGHT - 12}
                          fill={color}
                          fillOpacity={0.15}
                          rx={3}
                        />
                        {/* Main line */}
                        <line
                          x1={x1}
                          y1={y + ROW_HEIGHT / 2}
                          x2={x1 + segWidth}
                          y2={y + ROW_HEIGHT / 2}
                          stroke={color}
                          strokeWidth={3}
                          strokeLinecap="round"
                        />
                        {/* Start dot */}
                        <circle
                          cx={x1}
                          cy={y + ROW_HEIGHT / 2}
                          r={4}
                          fill={color}
                        />
                        {/* End dot */}
                        <circle
                          cx={x1 + segWidth}
                          cy={y + ROW_HEIGHT / 2}
                          r={4}
                          fill={color}
                        />
                      </g>
                    );
                  })}
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
