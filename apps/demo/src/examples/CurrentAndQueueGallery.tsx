import { Ginger } from "@lucaismyname/ginger";
import { demoPlaylistMeta, demoTracks } from "../fixtures";

const rich = demoTracks.map((t, i) =>
  i === 0
    ? {
        ...t,
        lyrics: "Line one\nLine two\n(lyrics demo)",
        isrc: "US-XXX-00-00001",
        label: "Demo label",
        trackNumber: 1,
      }
    : t,
);

export function CurrentAndQueueGallery() {
  return (
    <Ginger.Provider initialTracks={rich} initialPlaylistMeta={demoPlaylistMeta}>
      <Ginger.Player className="hidden" />
      <div className="grid gap-4 text-sm md:grid-cols-2">
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Ginger.Queue.*</h3>
          <ul className="space-y-2 leading-relaxed text-zinc-800">
            <li>
              <span className="text-zinc-500">Title:</span> <Ginger.Queue.Title />
            </li>
            <li>
              <span className="text-zinc-500">Subtitle:</span> <Ginger.Queue.Subtitle />
            </li>
            <li className="flex items-start gap-3">
              <span className="shrink-0 text-zinc-500">Artwork:</span>{" "}
              <Ginger.Queue.Artwork className="h-12 w-12 shrink-0 rounded-lg shadow-sm" />
            </li>
            <li>
              <span className="text-zinc-500">Description:</span> <Ginger.Queue.Description />
            </li>
            <li>
              <span className="text-zinc-500">Copyright:</span> <Ginger.Queue.Copyright />
            </li>
          </ul>
        </section>
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Ginger.Current.*</h3>
          <ul className="space-y-2 leading-relaxed text-zinc-800">
            <li>
              <span className="text-zinc-500">Title / Artist / Album:</span> <Ginger.Current.Title /> —{" "}
              <Ginger.Current.Artist /> — <Ginger.Current.Album />
            </li>
            <li>
              <span className="text-zinc-500">Genre / Year / # / ISRC / Label:</span> <Ginger.Current.Genre /> ·{" "}
              <Ginger.Current.Year /> · #<Ginger.Current.TrackNumber /> · <Ginger.Current.Isrc /> ·{" "}
              <Ginger.Current.Label />
            </li>
            <li>
              <span className="text-zinc-500">Position:</span> <Ginger.Current.QueuePosition base={1} /> (1-based)
            </li>
            <li>
              <span className="text-zinc-500">Playback:</span> <Ginger.Current.PlaybackState /> · err:{" "}
              <Ginger.Current.ErrorMessage empty="—" />
            </li>
            <li>
              <span className="text-zinc-500">Times:</span> <Ginger.Current.Elapsed /> / <Ginger.Current.Duration /> /
              rem <Ginger.Current.Remaining />
            </li>
            <li>
              <span className="text-zinc-500">Progress:</span> <Ginger.Current.Progress />
            </li>
            <li>
              <span className="text-zinc-500">Description:</span> <Ginger.Current.Description />
            </li>
            <li>
              <span className="text-zinc-500">Copyright:</span> <Ginger.Current.Copyright />
            </li>
            <li>
              <span className="text-zinc-500">File (hidden):</span> <Ginger.Current.FileUrl visible={false} />
            </li>
            <li className="whitespace-pre-wrap text-xs leading-relaxed text-zinc-700">
              <span className="font-medium text-zinc-500">Lyrics:</span>
              <Ginger.Current.Lyrics />
            </li>
          </ul>
          <Ginger.Current.TimeRail className="mt-4" />
        </section>
      </div>
    </Ginger.Provider>
  );
}
