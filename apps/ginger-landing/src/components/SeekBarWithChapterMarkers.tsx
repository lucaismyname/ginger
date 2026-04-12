import { Ginger, useGingerState } from "@lucaismyname/ginger";
import type { TrackChapter } from "@lucaismyname/ginger";

export function SeekBarWithChapterMarkers() {
  const state = useGingerState();
  const track = state.tracks[state.currentIndex];
  const { duration } = state;
  const chapters = track?.chapters;
  const showTicks = chapters && chapters.length > 0 && Number.isFinite(duration) && duration > 0;

  return (
    <div className="relative h-3 w-full min-w-0 shrink md:min-w-32">
      {showTicks ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-visible"
          aria-hidden
        >
          {chapters.map((ch: TrackChapter) => {
            const pct = (ch.startSeconds / duration) * 100;
            return (
              <div
                key={`${ch.startSeconds}-${ch.title}`}
                className="absolute top-0 h-full w-0.5 -translate-x-1/2 rounded-full bg-zinc-500/70 dark:bg-zinc-400/60"
                style={{ left: `${Math.min(100, Math.max(0, pct))}%` }}
                title={ch.title}
              />
            );
          })}
        </div>
      ) : null}
      <Ginger.Control.SeekBar className="absolute left-0 right-0 top-1/2 z-10 h-1 w-full -translate-y-1/2 cursor-pointer appearance-none rounded-full bg-zinc-300 accent-zinc-700 dark:bg-zinc-700 dark:accent-zinc-200" />
    </div>
  );
}
