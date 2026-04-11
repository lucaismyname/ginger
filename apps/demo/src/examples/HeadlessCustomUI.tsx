import { Ginger, useGinger } from "@lucaismyname/ginger";
import { demoTracks } from "../fixtures";

function CustomChrome() {
  const g = useGinger();
  return (
    <div className="rounded-xl border border-amber-900/50 bg-amber-950/40 p-4 text-amber-100">
      <div className="text-sm text-amber-200/80">Headless via useGinger()</div>
      <div className="mt-2 font-mono text-sm">
        {g.currentTrack?.title ?? "—"} · {g.playbackUi} · {g.progress.toFixed(2)}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="rounded bg-amber-600 px-3 py-1 text-sm text-black"
          onClick={g.togglePlayPause}
        >
          {g.state.isPaused ? "Play" : "Pause"}
        </button>
        <button type="button" className="rounded border border-amber-700 px-2 py-1 text-sm" onClick={g.next}>
          Next
        </button>
      </div>
    </div>
  );
}

export function HeadlessCustomUI() {
  return (
    <Ginger.Provider initialTracks={demoTracks}>
      <Ginger.Player className="hidden" />
      <CustomChrome />
    </Ginger.Provider>
  );
}
