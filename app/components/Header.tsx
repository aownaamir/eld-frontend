import React from "react";

export default function Header() {
  return (
    <header className="border-b border-zinc-200 px-8 py-4 flex items-center gap-3 bg-white">
      {/* <div className="w-7 h-7 bg-red-600 flex items-center justify-center text-white font-bold text-xs">
          EL
        </div> */}
      <h1 className="text-base font-semibold tracking-tight text-zinc-900">
        ELD Trip Planner
      </h1>
    </header>
  );
}
