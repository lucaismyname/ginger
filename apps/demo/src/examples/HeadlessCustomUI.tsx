import { Ginger, useGinger } from "@lucaismyname/ginger";
import { demoTracks } from "../fixtures";

function CustomChrome() {
  const g = useGinger();
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm ring-1 ring-amber-100">
      <div className="text-sm font-medium text-amber-800">Headless via useGinger()</div>
      <div className="mt-3 font-mono text-sm text-amber-950">
        {g.currentTrack?.title ?? "—"} · {g.playbackUi} · {g.progress.toFixed(2)}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-600"
          onClick={g.togglePlayPause}
        >
          {g.state.isPaused ? "Play" : "Pause"}
        </button>
        <button
          type="button"
          className="rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-950 hover:bg-amber-100/80"
          onClick={g.next}
        >
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
