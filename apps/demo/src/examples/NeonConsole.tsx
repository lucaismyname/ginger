import { Ginger, useGinger } from "@lucaismyname/ginger";
import { demoTracks } from "../fixtures";

function NeonBody() {
  const g = useGinger();
  const pct = Math.round(g.progress * 100);
  return (
    <div className="rounded-2xl border border-emerald-500/40 bg-zinc-950 p-6 font-mono text-emerald-300 shadow-[0_0_0_1px_rgba(16,185,129,0.2),0_0_30px_rgba(16,185,129,0.1)]">
      <div className="text-xs uppercase tracking-[0.2em] text-emerald-400/80">Neon Console</div>
      <div className="mt-3 text-xl text-emerald-200">{g.currentTrack?.title ?? "No track"}</div>
      <div className="mt-1 text-sm text-emerald-400/80">
        {g.currentTrack?.artist ?? "Unknown artist"}
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded bg-emerald-900/50">
        <div className="h-full bg-emerald-400 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-emerald-400/80">
        <span>
          {g.state.currentTime.toFixed(1)}s / {g.duration.toFixed(1)}s
        </span>
        <span>{pct}%</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-emerald-400/50 px-3 py-1.5 text-xs text-emerald-200 hover:bg-emerald-500/10"
          onClick={g.prev}
        >
          PREV
        </button>
        <button
          type="button"
          className="rounded border border-emerald-400/70 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-500/25"
          onClick={g.togglePlayPause}
        >
          {g.state.isPaused ? "PLAY" : "PAUSE"}
        </button>
        <button
          type="button"
          className="rounded border border-emerald-400/50 px-3 py-1.5 text-xs text-emerald-200 hover:bg-emerald-500/10"
          onClick={g.next}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}

export function NeonConsole() {
  return (
    <Ginger.Provider initialTracks={demoTracks} unstyled>
      <Ginger.Player className="hidden" />
      <NeonBody />
    </Ginger.Provider>
  );
}
