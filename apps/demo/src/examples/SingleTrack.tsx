import { Ginger } from "@lucaismyname/ginger";
import { demoTracks } from "../fixtures";

const one = demoTracks[0]!;

export function SingleTrack() {
  return (
    <Ginger.Provider initialTracks={[one]} initialPlaylistMeta={{ title: "Single" }}>
      <Ginger.Player className="hidden" />
      <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="text-sm font-medium text-zinc-500">Single track</div>
        <div className="text-lg font-semibold text-zinc-900">
          <Ginger.Current.Title /> — <Ginger.Current.Artist />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Ginger.Control.PlayPause className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700" />
          <Ginger.Control.SeekBar className="max-w-xs accent-emerald-600" />
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-4">
          <Ginger.Control.Mute className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-white" />
          <label className="flex max-w-[200px] flex-1 items-center gap-2 text-sm text-zinc-600">
            Volume
            <Ginger.Control.Volume className="accent-emerald-600" />
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-600">
            Speed
            <Ginger.Control.PlaybackRate className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-zinc-800" />
          </label>
        </div>
        <Ginger.Current.TimeRail className="max-w-md" />
      </div>
    </Ginger.Provider>
  );
}
