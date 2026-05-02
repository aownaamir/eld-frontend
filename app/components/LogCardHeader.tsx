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
    <div className="flex items-center justify-between px-3 sm:px-5 py-3 sm:py-3.5 border-b border-zinc-100 gap-2">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex flex-col leading-tight min-w-0">
          <span className="font-semibold text-sm text-zinc-900">
            Day {day.day}
          </span>
          <span className="text-xs text-zinc-500">{dateStr}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <span className="flex items-center gap-1 sm:gap-1.5 text-xs text-zinc-500 border border-zinc-200 px-2 sm:px-2.5 py-1 whitespace-nowrap">
          {drivingHrs.toFixed(1)}h driving
        </span>
        <span className="flex items-center gap-1 sm:gap-1.5 text-xs text-zinc-500 border border-zinc-200 px-2 sm:px-2.5 py-1 whitespace-nowrap">
          {onDutyHrs.toFixed(1)}h on duty
        </span>
      </div>
    </div>
  );
}
