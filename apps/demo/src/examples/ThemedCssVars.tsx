import { Ginger } from "@lucaismyname/ginger";
import type { CSSProperties } from "react";
import { demoTracks } from "../fixtures";

export function ThemedCssVars() {
  return (
    <Ginger.Provider
      initialTracks={demoTracks.slice(0, 2)}
      style={
        {
          "--ginger-primary-color": "#ea580c",
          "--ginger-muted-color": "#a1a1aa",
          "--ginger-font-size": "15px",
          "--ginger-artwork-radius": "12px",
          "--ginger-artwork-bg": "#fff7ed",
        } as CSSProperties
      }
    >
      <Ginger.Player className="hidden" />
      <div className="rounded-2xl border border-orange-200 bg-orange-50/80 p-6 shadow-sm ring-1 ring-orange-100">
        <div className="text-sm font-medium text-orange-800">CSS variables on Provider</div>
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
        <Ginger.Control.PlayPause className="mt-4 rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700" />
      </div>
    </Ginger.Provider>
  );
}
