import { Ginger, useGinger } from "@lucaismyname/ginger";
import { demoTracks } from "../fixtures";

function AlbumGridBody() {
  const { state, playTrackAt } = useGinger();
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Ginger.Control.Previous className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm hover:bg-zinc-50" />
        <Ginger.Control.PlayPause className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800" />
        <Ginger.Control.Next className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm hover:bg-zinc-50" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {state.tracks.map((track, index) => (
          <button
            key={`${track.fileUrl}-${index}`}
            type="button"
            onClick={() => playTrackAt(index)}
            className={`rounded-xl border p-3 text-left transition ${
              state.currentIndex === index
                ? "border-orange-300 bg-orange-50 shadow-sm"
                : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"
            }`}
          >
            <div className="text-sm font-semibold text-zinc-900">{track.title}</div>
            <div className="text-xs text-zinc-500">{track.artist ?? "Unknown artist"}</div>
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600">
        Current: <Ginger.Current.QueuePosition base={1} />
      </div>
    </div>
  );
}

export function AlbumGrid() {
  return (
    <Ginger.Provider initialTracks={demoTracks}>
      <Ginger.Player className="hidden" />
      <AlbumGridBody />
    </Ginger.Provider>
  );
}
