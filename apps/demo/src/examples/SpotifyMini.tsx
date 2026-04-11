import { Ginger } from "@lucaismyname/ginger";
import { demoPlaylistMeta, demoTracks } from "../fixtures";

export function SpotifyMini() {
  return (
    <Ginger.Provider initialTracks={demoTracks} initialPlaylistMeta={demoPlaylistMeta}>
      <Ginger.Player className="hidden" />
      <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-xl">
        <div className="flex items-center gap-3 border-b border-neutral-800 p-3">
          <Ginger.Queue.Artwork className="h-14 w-14 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs text-neutral-500">
              <Ginger.Queue.Title />
            </div>
            <div className="truncate font-semibold">
              <Ginger.Current.Title />
            </div>
            <div className="truncate text-sm text-neutral-400">
              <Ginger.Current.Artist />
            </div>
          </div>
        </div>
        <div className="px-3 pb-1 pt-2">
          <Ginger.Current.TimeRail height={3} />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-neutral-500">
            <Ginger.Current.Elapsed />
            <Ginger.Current.Remaining format={(s) => `-${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`} />
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 p-3">
          <Ginger.Control.Shuffle className="text-xs text-neutral-400 hover:text-white" />
          <Ginger.Control.Previous className="rounded-full border border-neutral-600 px-3 py-1 text-sm" />
          <Ginger.Control.PlayPause className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black" />
          <Ginger.Control.Next className="rounded-full border border-neutral-600 px-3 py-1 text-sm" />
          <Ginger.Control.Repeat className="text-xs text-neutral-400 hover:text-white" />
        </div>
      </div>
    </Ginger.Provider>
  );
}
