import { Ginger, useGinger } from "@lucaismyname/ginger";
import { useGingerTranscriptSync } from "@lucaismyname/ginger/transcript";
import { demoTracks, demoTranscriptSrt } from "../fixtures";

function TranscriptPanel() {
  const g = useGinger();
  const { activeCue, activeCues, cues, activeIndex } = useGingerTranscriptSync({
    transcript: demoTranscriptSrt,
    format: "srt",
  });

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm ring-1 ring-amber-100">
      <div className="text-xs font-semibold uppercase tracking-wide text-amber-800">Transcript</div>
      <p className="mt-2 text-sm leading-relaxed text-amber-950">
        SRT cues synced to playback time (
        <code className="rounded bg-white/80 px-1 font-mono text-[11px]">
          @lucaismyname/ginger/transcript
        </code>
        ).
      </p>

      <div className="mt-4 min-h-[4.5rem] rounded-xl border border-amber-200/90 bg-white/90 px-4 py-3 text-sm leading-relaxed text-amber-950 shadow-inner">
        {activeCue ? (
          <p>
            <span className="mr-2 font-mono text-xs text-amber-600">
              {activeCues.length > 1 ? `${activeCues.length} cues · ` : ""}
            </span>
            {activeCue.text}
          </p>
        ) : (
          <p className="text-amber-600/90">
            Play the track — transcript lines appear as time crosses each cue.
          </p>
        )}
      </div>

      <ul className="mt-4 max-h-40 space-y-1 overflow-y-auto rounded-lg border border-amber-200/70 bg-white/60 p-2 text-xs text-amber-900">
        {cues.map((c, i) => (
          <li
            key={`${c.startTime}-${i}`}
            className={`rounded px-2 py-1 font-mono ${
              i === activeIndex ? "bg-amber-200/80 font-medium" : "text-amber-800/90"
            }`}
          >
            <span className="text-amber-600">
              {Math.floor(c.startTime / 60)}:{String(Math.floor(c.startTime % 60)).padStart(2, "0")}
            </span>{" "}
            {c.text.replace(/\n/g, " ")}
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-3 border-t border-amber-200/80 pt-4">
        <div className="flex items-center justify-between font-mono text-xs text-amber-900">
          <Ginger.Current.Elapsed />
          <span className="truncate text-[11px]">{g.currentTrack?.title}</span>
          <Ginger.Current.Duration />
        </div>
        <Ginger.Control.SeekBar className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-amber-200 accent-amber-700" />
        <div className="flex flex-wrap items-center gap-2">
          <Ginger.Control.PlayPause className="rounded-lg bg-amber-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-amber-800" />
          <Ginger.Control.Volume className="h-1.5 w-28 cursor-pointer appearance-none rounded-full bg-amber-200 accent-amber-700" />
        </div>
      </div>
    </div>
  );
}

export function TranscriptDemo() {
  return (
    <Ginger.Provider initialTracks={demoTracks}>
      <Ginger.Player preload="auto" className="sr-only" />
      <TranscriptPanel />
    </Ginger.Provider>
  );
}
