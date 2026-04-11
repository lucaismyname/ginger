import { Ginger } from "@lucaismyname/ginger";
import { demoPlaylistMeta, demoTracks } from "../fixtures";

export function PlaylistBasic() {
  return (
    <Ginger.Provider initialTracks={demoTracks} initialPlaylistMeta={demoPlaylistMeta}>
      <Ginger.Player className="hidden" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="mb-2 text-sm text-neutral-400">Now playing</div>
          <Ginger.Current.Artwork className="h-32 w-32" />
          <div className="mt-3 font-medium">
            <Ginger.Current.Title />
          </div>
          <div className="text-sm text-neutral-400">
            <Ginger.Current.Artist />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Ginger.Control.Previous className="rounded-md border border-neutral-700 px-2 py-1 text-sm" />
            <Ginger.Control.PlayPause className="rounded-md bg-emerald-600 px-3 py-1 text-sm text-white" />
            <Ginger.Control.Next className="rounded-md border border-neutral-700 px-2 py-1 text-sm" />
            <Ginger.Control.Shuffle className="rounded-md border border-neutral-700 px-2 py-1 text-sm" />
            <Ginger.Control.Repeat className="rounded-md border border-neutral-700 px-2 py-1 text-sm" />
          </div>
          <div className="mt-2 text-xs text-neutral-500">
            <Ginger.Current.Elapsed /> / <Ginger.Current.Duration />
          </div>
          <Ginger.Control.SeekBar className="mt-2" />
        </div>
        <div>
          <Ginger.Playlist className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-2" />
        </div>
      </div>
    </Ginger.Provider>
  );
}
