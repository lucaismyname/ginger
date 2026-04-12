import { Ginger, useGinger } from "@lucaismyname/ginger";
import { useAudioPeaks } from "@lucaismyname/ginger/waveform";
import { demoTracks } from "../fixtures";

function FilePeaksPanel() {
  const g = useGinger();
  const url = g.currentTrack?.fileUrl;
  const { peaks, isLoading, error } = useAudioPeaks(url, 72);

  const max = peaks.length > 0 ? Math.max(...peaks, 1e-6) : 1;

  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-5 shadow-sm ring-1 ring-orange-100">
      <div className="text-xs font-semibold uppercase tracking-wide text-orange-700">
        Waveform (file peaks)
      </div>
      <p className="mt-2 text-sm leading-relaxed text-orange-900">
        Decoded peak buckets for the current track URL (
        <code className="rounded bg-white/80 px-1 font-mono text-[11px]">useAudioPeaks</code> from{" "}
        <code className="rounded bg-white/80 px-1 font-mono text-[11px]">
          @lucaismyname/ginger/waveform
        </code>
        ). Distinct from the live analyzer waveform demo.
      </p>

      <div className="mt-4 flex h-32 items-end justify-between gap-px rounded-xl border border-orange-200 bg-gradient-to-b from-white to-orange-100/50 px-1 pb-1 pt-3">
        {isLoading && peaks.length === 0 ? (
          <span className="w-full text-center text-xs text-orange-600">Loading peaks…</span>
        ) : error ? (
          <span className="w-full text-center text-xs text-red-700">{error}</span>
        ) : (
          peaks.map((p, i) => (
            <div
              key={i}
              className="min-w-0 flex-1 rounded-t bg-orange-600/90 dark:bg-orange-400/90"
              style={{ height: `${Math.max(8, (p / max) * 100)}%` }}
              title={`${(p * 100).toFixed(1)}%`}
            />
          ))
        )}
      </div>

      <div className="mt-4 space-y-3 border-t border-orange-200/80 pt-4">
        <div className="flex items-center justify-between font-mono text-xs text-orange-800">
          <Ginger.Current.Elapsed />
          <span className="truncate text-[11px]">{g.currentTrack?.title}</span>
          <Ginger.Current.Duration />
        </div>
        <Ginger.Control.SeekBar className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-orange-200 accent-orange-700" />
        <div className="flex flex-wrap items-center gap-2">
          <Ginger.Control.Previous className="rounded-lg border border-orange-300 bg-white px-3 py-1.5 text-sm text-orange-900 hover:bg-orange-100" />
          <Ginger.Control.PlayPause className="rounded-lg bg-orange-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-orange-800" />
          <Ginger.Control.Next className="rounded-lg border border-orange-300 bg-white px-3 py-1.5 text-sm text-orange-900 hover:bg-orange-100" />
          <Ginger.Control.Volume className="h-1.5 w-28 cursor-pointer appearance-none rounded-full bg-orange-200 accent-orange-700" />
        </div>
      </div>
    </div>
  );
}

export function FilePeaksWaveform() {
  return (
    <Ginger.Provider initialTracks={demoTracks}>
      <Ginger.Player preload="auto" className="sr-only" />
      <FilePeaksPanel />
    </Ginger.Provider>
  );
}
