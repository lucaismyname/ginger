import { Ginger } from "@lucaismyname/ginger";
import { demoTracks } from "../fixtures";

export function PodcastTimeline() {
  return (
    <Ginger.Provider
      initialTracks={demoTracks}
      initialPlaybackRate={1.25}
      initialPlaylistMeta={{ title: "Podcast Queue", subtitle: "Engineering Talks" }}
    >
      <Ginger.Player className="hidden" />
      <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <Ginger.Current.Artwork className="h-16 w-16 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold uppercase tracking-wide text-indigo-500">
              <Ginger.Queue.Subtitle fallback="Podcast" />
            </div>
            <div className="truncate text-lg font-semibold text-zinc-900">
              <Ginger.Current.Title />
            </div>
            <div className="mt-1 truncate text-sm text-zinc-600">
              <Ginger.Current.Description fallback={<Ginger.Current.Artist />} />
            </div>
          </div>
          <Ginger.Control.PlaybackRate className="rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-1 text-sm text-indigo-700" />
        </div>

        <div className="mt-5 grid gap-2">
          <Ginger.Control.SeekBar className="accent-indigo-600" />
          <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
            <Ginger.Current.Elapsed />
            <Ginger.Current.Remaining
              format={(seconds) => {
                const m = Math.floor(seconds / 60);
                const s = String(Math.floor(seconds % 60)).padStart(2, "0");
                return `-${m}:${s}`;
              }}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Ginger.Control.Previous className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50" />
          <Ginger.Control.PlayPause className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700" />
          <Ginger.Control.Next className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50" />
          <Ginger.Control.Mute className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50" />
          <label className="ml-auto flex min-w-[180px] items-center gap-2 text-xs text-zinc-500">
            Volume
            <Ginger.Control.Volume className="accent-indigo-600" />
          </label>
        </div>
      </div>
    </Ginger.Provider>
  );
}
