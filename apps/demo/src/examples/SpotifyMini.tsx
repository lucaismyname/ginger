import { Ginger } from "@lucaismyname/ginger";
import { demoPlaylistMeta, demoTracks } from "../fixtures";

export function SpotifyMini() {
  return (
    <Ginger.Provider initialTracks={demoTracks} initialPlaylistMeta={demoPlaylistMeta}>
      <Ginger.Player className="hidden" />
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg ring-1 ring-zinc-100">
        <div className="flex items-center gap-4 border-b border-zinc-100 bg-zinc-50/50 p-4">
          <Ginger.Queue.Artwork className="h-16 w-16 shrink-0 rounded-xl shadow-md" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium uppercase tracking-wide text-zinc-500">
              <Ginger.Queue.Title />
            </div>
            <div className="truncate text-base font-semibold text-zinc-900">
              <Ginger.Current.Title />
            </div>
            <div className="truncate text-sm text-zinc-600">
              <Ginger.Current.Artist />
            </div>
          </div>
        </div>
        <div className="bg-white px-4 pb-2 pt-3">
          <Ginger.Current.TimeRail height={3} />
          <div className="mt-2 flex justify-between font-mono text-[11px] text-zinc-600">
            <Ginger.Current.Elapsed />
            <Ginger.Current.Remaining
              format={(s) =>
                `-${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`
              }
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 border-t border-zinc-100 bg-zinc-50/80 px-4 py-4">
          <Ginger.Control.Shuffle className="text-xs font-medium text-zinc-600 hover:text-zinc-900" />
          <Ginger.Control.Previous className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50" />
          <Ginger.Control.PlayPause className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-zinc-800" />
          <Ginger.Control.Next className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50" />
          <Ginger.Control.Repeat className="text-xs font-medium text-zinc-600 hover:text-zinc-900" />
        </div>
      </div>
    </Ginger.Provider>
  );
}
