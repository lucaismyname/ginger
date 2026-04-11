import { Ginger } from "@lucaismyname/ginger";
import { demoTracks } from "../fixtures";

export function UnstyledShowcase() {
  return (
    <Ginger.Provider initialTracks={demoTracks} unstyled>
      <Ginger.Player className="hidden" />
      <div className="rounded-2xl border border-zinc-300 bg-white p-6">
        <div className="mb-3 text-sm font-semibold text-zinc-700">Fully unstyled mode</div>
        <div className="space-y-3">
          <div className="text-lg font-semibold text-zinc-900">
            <Ginger.Current.Title />
          </div>
          <div className="text-sm text-zinc-500">
            <Ginger.Current.Artist />
          </div>
          <Ginger.Control.SeekBar unstyled className="w-full accent-rose-600" />
          <div className="h-2 overflow-hidden rounded bg-zinc-200">
            <Ginger.Current.TimeRail unstyled className="h-full bg-rose-600" />
          </div>
          <div className="flex items-center gap-2">
            <Ginger.Control.Previous className="rounded border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50" />
            <Ginger.Control.PlayPause className="rounded bg-rose-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-rose-700" />
            <Ginger.Control.Next className="rounded border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50" />
          </div>
          <Ginger.Playlist unstyled className="space-y-1">
            {demoTracks.map((track, index) => (
              <Ginger.Playlist.Track
                key={`${track.fileUrl}-${index}`}
                index={index}
                unstyled
                className="block w-full rounded border border-zinc-200 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
              >
                {track.title}
              </Ginger.Playlist.Track>
            ))}
          </Ginger.Playlist>
        </div>
      </div>
    </Ginger.Provider>
  );
}
