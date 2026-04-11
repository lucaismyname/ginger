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
        </div>
        <div>
          <Ginger.Playlist className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-2 shadow-inner" />
        </div>
      </div>
    </Ginger.Provider>
  );
}
