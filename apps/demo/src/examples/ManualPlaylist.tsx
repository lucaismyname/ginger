import { Ginger, useGinger } from "@lucaismyname/ginger";
import { demoTracks } from "../fixtures";

function ManualPlaylistBody() {
  const { state } = useGinger();
  return (
    <Ginger.Playlist className="rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm">
      {state.tracks.map((track, index) => (
        <Ginger.Playlist.Track
          key={`${track.fileUrl}-${index}`}
          index={index}
          className={`rounded-xl px-3 py-2.5 text-left text-sm transition ${
            state.currentIndex === index
              ? "bg-emerald-50 font-medium text-emerald-950 ring-1 ring-emerald-200"
              : "text-zinc-800 hover:bg-zinc-50"
          }`}
        >
          <span className="font-medium">{track.title}</span>
          {track.artist ? <span className="ml-2 text-zinc-500">{track.artist}</span> : null}
        </Ginger.Playlist.Track>
      ))}
    </Ginger.Playlist>
  );
}

export function ManualPlaylist() {
  return (
    <Ginger.Provider initialTracks={demoTracks}>
      <Ginger.Player className="hidden" />
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-zinc-600">
          Manual mode: map{" "}
          <code className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800">state.tracks</code> and
          style each{" "}
          <code className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800">Ginger.Playlist.Track</code>.
        </p>
        <ManualPlaylistBody />
      </div>
    </Ginger.Provider>
  );
}
