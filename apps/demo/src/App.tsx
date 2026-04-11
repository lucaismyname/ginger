import { useState } from "react";
import { CurrentAndQueueGallery } from "./examples/CurrentAndQueueGallery";
import { HeadlessCustomUI } from "./examples/HeadlessCustomUI";
import { ManualPlaylist } from "./examples/ManualPlaylist";
import { PlaylistBasic } from "./examples/PlaylistBasic";
import { SingleTrack } from "./examples/SingleTrack";
import { SpotifyMini } from "./examples/SpotifyMini";
import { ThemedCssVars } from "./examples/ThemedCssVars";

const examples = [
  { id: "single", label: "Single track", Component: SingleTrack },
  { id: "playlist", label: "Playlist + controls", Component: PlaylistBasic },
  { id: "manual-playlist", label: "Manual Playlist.Track", Component: ManualPlaylist },
  { id: "headless", label: "useGinger headless", Component: HeadlessCustomUI },
  { id: "theme", label: "CSS variables", Component: ThemedCssVars },
  { id: "spotify", label: "Spotify mini", Component: SpotifyMini },
  { id: "gallery", label: "Current + Queue gallery", Component: CurrentAndQueueGallery },
] as const;

export function App() {
  const [id, setId] = useState<(typeof examples)[number]["id"]>("playlist");
  const active = examples.find((e) => e.id === id) ?? examples[1]!;
  const Body = active.Component;

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-200 bg-white/90 px-4 py-6 shadow-sm backdrop-blur md:px-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Ginger demo</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
          Examples for <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800">@lucaismyname/ginger</code>.
          Each block uses its own{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800">Ginger.Provider</code>.
        </p>
      </header>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:gap-10 md:px-8">
        <nav className="flex shrink-0 flex-col gap-1 md:w-56" aria-label="Examples">
          {examples.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setId(e.id)}
              className={`rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${
                e.id === id
                  ? "bg-zinc-900 text-white shadow-md"
                  : "text-zinc-700 hover:bg-white hover:text-zinc-900 hover:shadow-sm"
              }`}
            >
              {e.label}
            </button>
          ))}
        </nav>
        <main className="min-w-0 flex-1 pb-12">
          <Body />
        </main>
      </div>
    </div>
  );
}
