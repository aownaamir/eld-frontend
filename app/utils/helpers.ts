import { Segment } from "../types";

export const getY = (type: string) => {
  switch (type) {
    case "off_duty":
      return 10;
    case "sleeper":
      return 30;
    case "driving":
      return 60;
    case "on_duty":
      return 90;
  }
};

export const buildStepPath = (segments: Segment[], width: number) => {
  const timeToX = (dateString: string) => {
    const d = new Date(dateString);
    const h = d.getHours() + d.getMinutes() / 60;
    return (h === 0 ? 24 : h) * (width / 24);
  };

  if (!segments.length) return "";

  let path = "";

  segments.forEach((seg, i) => {
    const xStart = timeToX(seg.start);
    const xEnd = timeToX(seg.end);
    const y = getY(seg.type);

    if (i === 0) {
      // Move to starting point
      path += `M ${xStart} ${y} `;
    }

    // Horizontal line
    path += `L ${xEnd} ${y} `;

    // Vertical transition to next segment
    const next = segments[i + 1];
    if (next) {
      const nextY = getY(next.type);
      path += `L ${xEnd} ${nextY} `;
    }
  });

  return path;
};
