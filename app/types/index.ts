export type Segment = {
  type: "off_duty" | "sleeper" | "driving" | "on_duty";
  start: string;
  end: string;
  note?: string;
};

export type DayLog = {
  day: number;
  segments: Segment[];
};

export type TripResponse = {
  route: {
    distance: number;
    duration: number;
    geometry?: number[][];
  };
  logs: DayLog[];
  summary: {
    total_days: number;
    total_distance: number;
    total_hours: number;
  };
};
