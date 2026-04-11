import type { CSSProperties } from "react";
import { Ginger } from "@lucaismyname/ginger";
import { demoTracks } from "../fixtures";

export function ThemedCssVars() {
  return (
    <Ginger.Provider
      initialTracks={demoTracks.slice(0, 2)}
      style={
        {
          "--ginger-primary-color": "#7c3aed",
          "--ginger-muted-color": "#a1a1aa",
          "--ginger-font-size": "15px",
          "--ginger-artwork-radius": "12px",
          "--ginger-artwork-bg": "#f3e8ff",
        } as CSSProperties
      }
    >
      <Ginger.Player className="hidden" />
      <div className="rounded-2xl border border-violet-200 bg-violet-50/80 p-6 shadow-sm ring-1 ring-violet-100">
        <div className="text-sm font-medium text-violet-800">CSS variables on Provider</div>
        <div className="mt-4 flex items-center gap-4">
          <Ginger.Current.Artwork className="h-16 w-16 rounded-xl shadow-md" />
          <div>
            <div className="font-semibold text-zinc-900">
              <Ginger.Current.Title />
            </div>
            <div className="text-sm text-zinc-600">
              <Ginger.Current.Artist />
            </div>
          </div>
        </div>
        <Ginger.Current.TimeRail className="mt-4 max-w-sm" />
        <Ginger.Control.PlayPause className="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700" />
      </div>
    </Ginger.Provider>
  );
}
