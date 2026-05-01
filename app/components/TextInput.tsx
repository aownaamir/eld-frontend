"use client";

export default function TextInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
        {label}
      </label>
      <div className="flex items-center bg-white border border-zinc-200 px-4 py-3 gap-3 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-200 transition">
        <input
          name="cycle_used"
          type="number"
          min={0}
          max={70}
          value={value}
          placeholder={placeholder ?? label}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-sm text-zinc-900 placeholder-zinc-300 focus:outline-none w-full"
        />
        <span className="text-xs text-zinc-300 shrink-0">/ 70</span>
      </div>
    </div>
  );
}
