import { Ginger } from "@lucaismyname/ginger";
import { demoPlaylistMeta, demoTracks } from "../fixtures";

export function PlaylistBasic() {
  return (
    <Ginger.Provider initialTracks={demoTracks} initialPlaylistMeta={demoPlaylistMeta}>
      <Ginger.Player className="hidden" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-3 text-sm font-medium text-zinc-500">Now playing</div>
          <Ginger.Current.Artwork className="h-32 w-32 rounded-xl shadow-md" />
          <div className="mt-4 text-lg font-semibold text-zinc-900">
            <Ginger.Current.Title />
          </div>
          <div className="text-sm text-zinc-600">
            <Ginger.Current.Artist />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Ginger.Control.Previous className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50" />
            <Ginger.Control.PlayPause className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700" />
            <Ginger.Control.Next className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50" />
            <Ginger.Control.Shuffle className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50" />
            <Ginger.Control.Repeat className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50" />
          </div>
          <div className="mt-3 font-mono text-xs text-zinc-600">
            <Ginger.Current.Elapsed /> / <Ginger.Current.Duration />
          </div>
          <Ginger.Control.SeekBar className="mt-3 accent-emerald-600" />
          <div className="mt-5 flex flex-col gap-3 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-2">
              <Ginger.Control.Mute className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50" />
              <label className="flex min-w-0 flex-1 items-center gap-2 text-xs font-medium text-zinc-600 sm:max-w-[200px]">
                <span className="shrink-0">Vol</span>
                <Ginger.Control.Volume className="accent-emerald-600" />
              </label>
            </div>
            <label className="flex items-center gap-2 text-xs font-medium text-zinc-600">
              Speed
              <Ginger.Control.PlaybackRate className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm text-zinc-800" />
            </label>
          </div>
        </div>
        <div>
          <Ginger.Playlist className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-2 shadow-inner" />
        </div>
      </div>
    </Ginger.Provider>
  );
}
