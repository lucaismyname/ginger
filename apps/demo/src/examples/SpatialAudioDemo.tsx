import { Ginger, useGinger } from "@lucaismyname/ginger";
import { useGingerSpatialAudio } from "@lucaismyname/ginger/spatial";
import { useEffect, useState } from "react";
import { demoTracks } from "../fixtures";

function SpatialPanel() {
  const g = useGinger();
  const [sourceX, setSourceX] = useState(0);
  const { setSourcePosition, setListenerPosition, error } = useGingerSpatialAudio({
    enabled: true,
    panningModel: "HRTF",
    position: [0, 0, 0],
    listenerPosition: [0, 0, 0],
  });

  useEffect(() => {
    setSourcePosition(sourceX, 0, 0);
  }, [sourceX, setSourcePosition]);

  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-5 shadow-sm ring-1 ring-orange-100">
      <div className="text-xs font-semibold uppercase tracking-wide text-orange-700">
        Spatial audio
      </div>
      <p className="mt-2 text-sm leading-relaxed text-orange-900">
        HRTF panner on the active media element (
        <code className="rounded bg-white/80 px-1 font-mono text-[11px]">
          @lucaismyname/ginger/spatial
        </code>
        ). Move the source on the X axis; listener stays at the origin.
      </p>

      {error ? (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
          {error}
        </div>
      ) : null}

      <div className="mt-4 space-y-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-orange-800">
          Source position X (meters)
          <input
            type="range"
            min={-4}
            max={4}
            step={0.05}
            value={sourceX}
            onChange={(e) => setSourceX(Number(e.target.value))}
            className="w-full accent-orange-600"
          />
          <span className="font-mono text-[11px] text-orange-600">{sourceX.toFixed(2)}</span>
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-orange-300 bg-white px-3 py-1.5 text-xs text-orange-900 hover:bg-orange-100"
            onClick={() => {
              setSourceX(0);
              setListenerPosition(0, 0, 0);
            }}
          >
            Reset source & listener
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3 border-t border-orange-200/80 pt-4">
        <div className="flex items-center justify-between font-mono text-xs text-orange-800">
          <Ginger.Current.Elapsed />
          <span className="truncate text-[11px]">{g.currentTrack?.title}</span>
          <Ginger.Current.Duration />
        </div>
        <Ginger.Control.SeekBar className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-orange-200 accent-orange-700" />
        <div className="flex flex-wrap items-center gap-2">
          <Ginger.Control.PlayPause className="rounded-lg bg-orange-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-orange-800" />
          <Ginger.Control.Volume className="h-1.5 w-28 cursor-pointer appearance-none rounded-full bg-orange-200 accent-orange-700" />
        </div>
      </div>
    </div>
  );
}

export function SpatialAudioDemo() {
  return (
    <Ginger.Provider initialTracks={demoTracks}>
      {/* sr-only: Web Audio routing can fail when <audio> is display:none on some browsers */}
      <Ginger.Player preload="auto" className="sr-only" />
      <SpatialPanel />
    </Ginger.Provider>
  );
}
