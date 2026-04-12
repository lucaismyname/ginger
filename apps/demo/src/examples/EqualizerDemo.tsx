import { Ginger, useGinger } from "@lucaismyname/ginger";
import { useGingerEqualizer } from "@lucaismyname/ginger/equalizer";
import { demoTracks } from "../fixtures";

function EqualizerPanel() {
  const g = useGinger();
  const { bands, setBandGain, error } = useGingerEqualizer({ enabled: true });

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm ring-1 ring-emerald-100">
      <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Equalizer</div>
      <p className="mt-2 text-sm leading-relaxed text-emerald-900">
        Parametric EQ in the Web Audio graph (
        <code className="rounded bg-white/80 px-1 font-mono text-[11px]">@lucaismyname/ginger/equalizer</code>
        ). Adjust gain per band (dB).
      </p>

      {error ? (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">{error}</div>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-5">
        {bands.map((band, index) => (
          <label
            key={band.frequency}
            className="flex flex-col gap-1 rounded-xl border border-emerald-200/80 bg-white/80 px-2 py-2"
          >
            <span className="text-center text-[10px] font-medium text-emerald-700">{band.frequency} Hz</span>
            <input
              type="range"
              min={-12}
              max={12}
              step={0.5}
              value={band.gain ?? 0}
              onChange={(e) => setBandGain(index, Number(e.target.value))}
              className="w-full cursor-pointer accent-emerald-600"
            />
            <span className="text-center font-mono text-[10px] text-emerald-800">{(band.gain ?? 0).toFixed(1)} dB</span>
          </label>
        ))}
      </div>

      <div className="mt-4 space-y-3 border-t border-emerald-200/80 pt-4">
        <div className="flex items-center justify-between font-mono text-xs text-emerald-800">
          <Ginger.Current.Elapsed />
          <span className="truncate text-[11px]">{g.currentTrack?.title}</span>
          <Ginger.Current.Duration />
        </div>
        <Ginger.Control.SeekBar className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-emerald-200 accent-emerald-700" />
        <div className="flex flex-wrap items-center gap-2">
          <Ginger.Control.PlayPause className="rounded-lg bg-emerald-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-800" />
          <Ginger.Control.Volume className="h-1.5 w-28 cursor-pointer appearance-none rounded-full bg-emerald-200 accent-emerald-700" />
        </div>
      </div>
    </div>
  );
}

export function EqualizerDemo() {
  return (
    <Ginger.Provider initialTracks={demoTracks}>
      <Ginger.Player preload="auto" className="sr-only" />
      <EqualizerPanel />
    </Ginger.Provider>
  );
}
