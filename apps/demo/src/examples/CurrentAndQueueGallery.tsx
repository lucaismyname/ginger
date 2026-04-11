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
      <div className="grid gap-3 text-sm md:grid-cols-2">
        <section className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-3">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Ginger.Queue.*</h3>
          <ul className="space-y-1 text-neutral-300">
            <li>
              Title: <Ginger.Queue.Title />
            </li>
            <li>
              Subtitle: <Ginger.Queue.Subtitle />
            </li>
            <li className="flex items-start gap-2">
              Artwork: <Ginger.Queue.Artwork className="h-10 w-10 shrink-0" />
            </li>
            <li>
              Description: <Ginger.Queue.Description />
            </li>
            <li>
              Copyright: <Ginger.Queue.Copyright />
            </li>
          </ul>
        </section>
        <section className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-3">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Ginger.Current.*</h3>
          <ul className="space-y-1 text-neutral-300">
            <li>
              Title / Artist / Album: <Ginger.Current.Title /> — <Ginger.Current.Artist /> — <Ginger.Current.Album />
            </li>
            <li>
              Genre / Year / # / ISRC / Label: <Ginger.Current.Genre /> · <Ginger.Current.Year /> · #
              <Ginger.Current.TrackNumber /> · <Ginger.Current.Isrc /> · <Ginger.Current.Label />
            </li>
            <li>
              Position: <Ginger.Current.QueuePosition base={1} /> (1-based)
            </li>
            <li>
              Playback: <Ginger.Current.PlaybackState /> · err: <Ginger.Current.ErrorMessage empty="—" />
            </li>
            <li>
              Times: <Ginger.Current.Elapsed /> / <Ginger.Current.Duration /> / rem <Ginger.Current.Remaining />
            </li>
            <li>
              Progress: <Ginger.Current.Progress />
            </li>
            <li>
              Description: <Ginger.Current.Description />
            </li>
            <li>
              Copyright: <Ginger.Current.Copyright />
            </li>
            <li>
              File (hidden): <Ginger.Current.FileUrl visible={false} />
            </li>
            <li className="whitespace-pre-wrap text-xs text-neutral-400">
              Lyrics:
              <Ginger.Current.Lyrics />
            </li>
          </ul>
          <Ginger.Current.TimeRail className="mt-2" />
        </section>
      </div>
    </Ginger.Provider>
  );
}
