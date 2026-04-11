import type { CSSProperties } from "react";
import { Ginger } from "@lucaismyname/ginger";
import { demoTracks } from "../fixtures";

export function ThemedCssVars() {
  return (
    <Ginger.Provider
      initialTracks={demoTracks.slice(0, 2)}
      style={
        {
          "--ginger-primary-color": "#a78bfa",
          "--ginger-muted-color": "#64748b",
          "--ginger-font-size": "15px",
          "--ginger-artwork-radius": "12px",
          "--ginger-artwork-bg": "#1e1b4b",
        } as CSSProperties
      }
    >
      <Ginger.Player className="hidden" />
      <div className="rounded-xl border border-violet-900/40 bg-violet-950/30 p-4">
        <div className="text-sm text-violet-200/80">CSS variables on Provider</div>
        <div className="mt-2 flex items-center gap-3">
          <Ginger.Current.Artwork className="h-16 w-16" />
          <div>
            <div className="font-medium">
              <Ginger.Current.Title />
            </div>
            <div className="text-sm opacity-80">
              <Ginger.Current.Artist />
            </div>
          </div>
        </div>
        <Ginger.Current.TimeRail className="mt-3 max-w-sm" />
        <Ginger.Control.PlayPause className="mt-3 rounded-lg bg-violet-600 px-3 py-1 text-sm text-white" />
      </div>
    </Ginger.Provider>
  );
}
