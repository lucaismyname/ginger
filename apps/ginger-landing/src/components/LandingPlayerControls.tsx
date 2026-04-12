import { Ginger, useGingerPlayback } from "@lucaismyname/ginger";
import { PlaybackRateSelect } from "./PlaybackRateSelect";
import { SeekBarWithChapterMarkers } from "./SeekBarWithChapterMarkers";

export function LandingPlayerControls() {
  const { tracks, currentIndex, playTrackAt } = useGingerPlayback();

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100/80 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80">
      <div className="flex items-center gap-3 border-b border-zinc-200/90 px-3 py-3 dark:border-zinc-700/90">
        <Ginger.Current.Artwork
          className="border shadow-lg shadow-zinc-200/90 dark:shadow-zinc-950/80 border-zinc-200/90 dark:border-zinc-600/80 h-14 w-14 shrink-0 rounded-lg shadow-sm ring-1 ring-zinc-200/90 dark:ring-zinc-600/80"
          loading="lazy"
          decoding="async"
        />
        <div className="min-w-0 flex-1">
          <Ginger.Current.Title className="block font-mono font-bold text-shadow-[1px_1px_0px_rgba(0,0,0,0.2)] truncate text-base leading-snug text-zinc-900 dark:text-zinc-50" />
          <Ginger.Current.Artist className="mt-0.5 font-pixel uppercase block truncate text-xs text-zinc-500 dark:text-zinc-400" />
        </div>
      </div>
      <div className="flex flex-col gap-3 px-3 py-2.5 md:flex-row md:items-center md:justify-between">
        <section className="flex w-full flex-1 items-center gap-4 md:min-w-0">
          <Ginger.Control.PlayPause className="py-1.5 px-1.5 rounded text-xs text-zinc-900 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-50 dark:hover:border-zinc-500 [&_svg]:h-3.5 [&_svg]:w-3.5" />
          <span className="w-11 shrink-0 text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
            <Ginger.Current.Elapsed className="font-pixel" />
          </span>
          <SeekBarWithChapterMarkers />
          <span className="w-11 font-pixel shrink-0 text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
            <Ginger.Current.Duration />
          </span>
        </section>
        <section className="flex w-full shrink-0 items-center justify-between gap-4 md:w-auto md:justify-end">
          <div className="flex items-center gap-2">
            <Ginger.Control.Mute className="p-1.5 text-xs text-zinc-900 dark:text-zinc-50 [&_svg]:h-3.5 [&_svg]:w-3.5" />
            <Ginger.Control.Volume className="h-1 md:w-12 !w-24 cursor-pointer appearance-none rounded-full bg-zinc-300 accent-zinc-700 dark:bg-zinc-700 dark:accent-zinc-200" />
          </div>
          <PlaybackRateSelect />
        </section>
      </div>
      <section className="border-t border-zinc-200/90 dark:border-zinc-700/90">
        <ul className="flex flex-col">
          {tracks.slice(0, 3).map((track, index) => {
            const active = index === currentIndex;
            return (
              <li
                key={track.fileUrl}
                className="px-2 py-1 border-b border-zinc-200/80 last:border-b-0 dark:border-zinc-700/80"
              >
                <button
                  type="button"
                  onClick={() => playTrackAt(index)}
                  className={`flex w-full items-center justify-between px-0.5 py-1.5 text-left text-xs transition-colors ${
                    active
                      ? "text-orange-700 dark:text-orange-400"
                      : "text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
                  }`}
                  aria-current={active ? "true" : undefined}
                >
                  <span className="truncate pl-2.5">
                    <span className=" font-pixel text-zinc-400 dark:text-zinc-500 pr-2">
                      {index + 1}.
                    </span>{" "}
                    <span className="font-mono text-zinc-800 dark:text-zinc-100">
                      {track.title}
                    </span>
                  </span>
                  <span className="ml-3 font-pixel shrink-0 text-[11px] text-zinc-500 dark:text-zinc-400">
                    {active ? (
                      <>
                        <span className="text-[9px] uppercase text-orange-700 dark:text-orange-400 px-1 py-0.5 mr-4 rounded-md bg-orange-50 dark:bg-orange-950/50 border border-orange-500/50 dark:border-orange-700/50">
                          playing
                        </span>{" "}
                        {track.artist}
                      </>
                    ) : (
                      (track.artist ?? "-")
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
