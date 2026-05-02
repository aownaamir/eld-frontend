import { FileQuestionMarkIcon, MapIcon, WatchIcon } from "lucide-react";
import { TripResponse } from "../types";
import MapView from "./MapView";

export default function TripMapSection({
  data,
}: {
  data: TripResponse | null;
}) {
  return (
    <div className="bg-white border border-zinc-200 overflow-hidden flex flex-col flex-1 min-h-[260px] lg:min-h-0">
      <div className="px-4 py-2.5 border-b border-zinc-200 flex items-center justify-between shrink-0">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
          Route Map
        </h3>
      </div>

      {data ? (
        <div className="flex-1 min-h-0">
          <MapView geometry={data.route.geometry} fill />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-zinc-300">
          <MapIcon className="w-6 h-6" />
          <span className="text-xs text-zinc-400">
            Generate a trip to see the route
          </span>
        </div>
      )}
    </div>
  );
}
