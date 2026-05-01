export default function LogCardHeader({
  day,
  dateStr,
  drivingHrs,
  onDutyHrs,
}: {
  day: any;
  dateStr: string;
  drivingHrs: number;
  onDutyHrs: number;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100">
      <div className="flex items-center gap-3">
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
  );
}
