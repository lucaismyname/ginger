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
        <Ginger.Current.TimeRail className="max-w-md" />
      </div>
    </Ginger.Provider>
  );
}
