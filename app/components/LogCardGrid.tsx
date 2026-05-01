import { Segment } from "../types";

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

const ROWS = [
  { label: "Off Duty", key: "off_duty" },
  { label: "Sleeper Berth", key: "sleeper" },
  { label: "Driving", key: "driving" },
  { label: "On Duty", key: "on_duty" },
];

function getRowIndex(type: Segment["type"]): number {
  return ROWS.findIndex((r) => r.key === type);
}

export default function LogCardGrid({
  gridWidth,
  day,
  containerRef,
  sorted,
}: any) {
  const svgHeight = ROW_HEIGHT * ROWS.length;

  return (
    <div className="px-5 py-4">
      <div className="flex gap-0">
        {/* Row Labels */}
        <div className="shrink-0 flex flex-col" style={{ width: LABEL_WIDTH }}>
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

            {(() => {
              if (sorted.length === 0) return null;

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
  );
}
