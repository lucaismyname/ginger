import { Ginger } from "@lucaismyname/ginger";
import type { CSSProperties } from "react";
import { demoPlaylistMeta, demoTracks } from "../fixtures";

export function GlassmorphismDeck() {
  return (
    <Ginger.Provider
      initialTracks={demoTracks}
      initialPlaylistMeta={demoPlaylistMeta}
      style={
        {
          "--ginger-primary-color": "#ecfeff",
          "--ginger-muted-color": "#67e8f9",
          "--ginger-buffer-color": "rgba(103, 232, 249, 0.35)",
          "--ginger-playlist-active-bg": "rgba(8, 145, 178, 0.35)",
        } as CSSProperties
      }
    >
      <Ginger.Player className="hidden" />
      <div className="rounded-3xl border border-cyan-300/30 bg-cyan-500/10 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Ginger.Current.Artwork className="h-20 w-20 rounded-2xl ring-2 ring-cyan-200/50" />
          <div className="min-w-0">
            <div className="truncate text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/90">
              <Ginger.Queue.Title />
            </div>
            <div className="truncate text-lg font-semibold text-cyan-50">
              <Ginger.Current.Title />
            </div>
            <div className="truncate text-sm text-cyan-100/80">
              <Ginger.Current.Artist />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <Ginger.Current.TimeRail className="rounded-full bg-cyan-900/30" showBuffered />
          <div className="mt-2 flex justify-between text-[11px] font-mono text-cyan-100/80">
            <Ginger.Current.Elapsed />
            <Ginger.Current.Duration />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Ginger.Control.Previous className="rounded-xl border border-cyan-100/30 bg-cyan-200/10 px-3 py-2 text-xs font-medium text-cyan-50 hover:bg-cyan-200/20" />
          <Ginger.Control.PlayPause className="rounded-xl bg-cyan-300 px-4 py-2 text-xs font-semibold text-cyan-950 hover:bg-cyan-200" />
          <Ginger.Control.Next className="rounded-xl border border-cyan-100/30 bg-cyan-200/10 px-3 py-2 text-xs font-medium text-cyan-50 hover:bg-cyan-200/20" />
          <Ginger.Control.Repeat className="rounded-xl border border-cyan-100/30 bg-cyan-200/10 px-3 py-2 text-xs font-medium text-cyan-50 hover:bg-cyan-200/20" />
          <Ginger.Control.Shuffle className="rounded-xl border border-cyan-100/30 bg-cyan-200/10 px-3 py-2 text-xs font-medium text-cyan-50 hover:bg-cyan-200/20" />
        </div>
      </div>
    </Ginger.Provider>
  );
}
