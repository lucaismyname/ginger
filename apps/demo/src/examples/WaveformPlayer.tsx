import { Ginger, useGinger, useGingerLiveAnalyzer } from "@lucaismyname/ginger";
import { demoTracks } from "../fixtures";

function LiveWaveform() {
  const g = useGinger();
  const { error, isSuspended, resume, timeDomainData } = useGingerLiveAnalyzer({
    fftSize: 1024,
    smoothingTimeConstant: 0.72,
  });

  const width = 640;
  const height = 140;
  const padding = 10;
  const sampleCount = 96;

  let waveformPoints = "";
  if (timeDomainData.length > 0) {
    const points: string[] = [];
    for (let i = 0; i < sampleCount; i += 1) {
      const ratio = i / (sampleCount - 1);
      const sourceIndex = Math.floor(ratio * (timeDomainData.length - 1));
      const level = timeDomainData[sourceIndex] / 255;
      const x = padding + ratio * (width - padding * 2);
      const y = padding + (1 - level) * (height - padding * 2);
      points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    waveformPoints = points.join(" ");
  }

  return (
    <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-5 shadow-sm ring-1 ring-sky-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-sky-700">Waveform player</div>
          <div className="mt-1 text-sm text-sky-900">
            {g.currentTrack?.title ?? "No track loaded"} · {g.state.isPaused ? "Paused" : "Playing"}
          </div>
        </div>
        {isSuspended ? (
          <button
            type="button"
            onClick={() => void resume()}
            className="rounded-lg border border-sky-300 bg-white px-3 py-1.5 text-xs font-medium text-sky-900 hover:bg-sky-100"
          >
            Enable audio
          </button>
        ) : null}
      </div>

      <div className="mt-4 rounded-xl border border-sky-200 bg-gradient-to-b from-white to-sky-100/40 p-3">
        <svg className="h-32 w-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <line
            x1={padding}
            y1={height / 2}
            x2={width - padding}
            y2={height / 2}
            stroke="rgb(125 211 252)"
            strokeWidth="1"
          />
          {waveformPoints ? (
            <polyline
              points={waveformPoints}
              fill="none"
              stroke="rgb(14 116 144)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <text x={width / 2} y={height / 2} textAnchor="middle" fill="rgb(14 116 144)" fontSize="12">
              Start playback to render waveform
            </text>
          )}
        </svg>
      </div>

      {error ? <div className="mt-3 text-xs text-red-700">Analyzer error: {error}</div> : null}

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between font-mono text-xs text-sky-800">
          <Ginger.Current.Elapsed />
          <Ginger.Current.Duration />
        </div>
        <Ginger.Control.SeekBar className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-sky-200 accent-sky-700" />
        <div className="flex flex-wrap items-center gap-2">
          <Ginger.Control.Previous className="rounded-lg border border-sky-300 bg-white px-3 py-1.5 text-sm text-sky-900 hover:bg-sky-100" />
          <Ginger.Control.PlayPause className="rounded-lg bg-sky-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-800" />
          <Ginger.Control.Next className="rounded-lg border border-sky-300 bg-white px-3 py-1.5 text-sm text-sky-900 hover:bg-sky-100" />
          <Ginger.Control.Volume className="h-1.5 w-28 cursor-pointer appearance-none rounded-full bg-sky-200 accent-sky-700" />
          <Ginger.Control.PlaybackRate className="rounded-lg border border-sky-300 bg-white px-2 py-1 text-xs text-sky-900" />
        </div>
      </div>
    </div>
  );
}

export function WaveformPlayer() {
  return (
    <Ginger.Provider initialTracks={demoTracks}>
      <Ginger.Player className="hidden" />
      <LiveWaveform />
    </Ginger.Provider>
  );
}
