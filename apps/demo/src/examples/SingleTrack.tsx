import { Ginger } from "@lucaismyname/ginger";
import { demoTracks } from "../fixtures";

const one = demoTracks[0]!;

export function SingleTrack() {
  return (
    <Ginger.Provider initialTracks={[one]} initialPlaylistMeta={{ title: "Single" }}>
      <Ginger.Player className="hidden" />
      <div className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
        <div className="text-sm text-neutral-400">Single track</div>
        <div className="text-lg font-medium">
          <Ginger.Current.Title /> — <Ginger.Current.Artist />
        </div>
        <div className="flex flex-wrap gap-2">
          <Ginger.Control.PlayPause className="rounded-md bg-emerald-600 px-3 py-1 text-sm text-white" />
          <Ginger.Control.SeekBar className="max-w-xs" />
        </div>
        <Ginger.Current.TimeRail className="max-w-md" />
      </div>
    </Ginger.Provider>
  );
}
