"use client";

import { DayLog, Segment } from "../types";

type Props = {
  logs: DayLog[];
};

export default function LogGrid({ logs }: Props) {
  const width = 800;
  const height = 120;

  const timeToX = (dateString: string) => {
    const d = new Date(dateString);
    return (d.getHours() + d.getMinutes() / 60) * (width / 24);
  };

  const getY = (type: Segment["type"]) => {
    switch (type) {
      case "off_duty":
        return 10;
      case "sleeper":
        return 30;
      case "driving":
        return 60;
      case "on_duty":
        return 90;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      {logs.map((day) => (
        <div key={day.day} className="border p-2 rounded">
          <h3 className="font-semibold mb-2">Day {day.day}</h3>

          <svg width={width} height={height} className="border">
            {[...Array(25)].map((_, i) => (
              <line
                key={i}
                x1={(i * width) / 24}
                y1="0"
                x2={(i * width) / 24}
                y2={height}
                stroke="#ddd"
              />
            ))}

            {day.segments.map((seg, i) => {
              const x1 = timeToX(seg.start);
              const x2 = timeToX(seg.end);
              const y = getY(seg.type);

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke="black"
                  strokeWidth="4"
                />
              );
            })}
          </svg>
        </div>
      ))}
    </div>
  );
}
