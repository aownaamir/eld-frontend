const HOS_RULES = [
  { rule: "11 h", desc: "Max driving per day" },
  { rule: "14 h", desc: "On-duty window" },
  { rule: "30 min", desc: "Break after 8 h driving" },
  { rule: "10 h", desc: "Off-duty reset required" },
  { rule: "70 h", desc: "Cycle limit (8 days)" },
  { rule: "34 h", desc: "Restart off-duty" },
];

export default function HOSRules() {
  return (
    <div className="px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-2.5">
        HOS Rules · 70 hr / 8 day cycle
      </p>
      <div className="grid grid-cols-2 gap-x-6">
        {HOS_RULES.map(({ rule, desc }) => (
          <div
            key={rule + desc}
            className="flex items-baseline gap-2 py-3 border-b border-zinc-100 last:border-0"
          >
            <span className="text-sm font-medium text-zinc-900 tabular-nums w-14 shrink-0">
              {rule}
            </span>
            <span className="text-[11px] text-zinc-400 leading-tight">
              {desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
