import React from "react";

export default function TripError({ error }: { error: string }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
      {error}
    </div>
  );
}
