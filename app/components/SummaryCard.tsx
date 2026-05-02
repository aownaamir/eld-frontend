import React from "react";

export default function SummaryCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  const isEmpty = value === "—";
  return (
    <div className="bg-white border border-zinc-200 p-3 sm:p-4">
      <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1.5 font-medium">
        {label}
      </p>
      <p
        className={`text-lg sm:text-xl font-bold ${isEmpty ? "text-transparent" : "text-red-600"}`}
      >
        {value}
        {unit && !isEmpty && (
          <span className="text-xs font-normal text-zinc-400 ml-1">{unit}</span>
        )}
      </p>
    </div>
  );
}
