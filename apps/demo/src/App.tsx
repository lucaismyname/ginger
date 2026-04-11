import { useState } from "react";
import { CurrentAndQueueGallery } from "./examples/CurrentAndQueueGallery";
import { HeadlessCustomUI } from "./examples/HeadlessCustomUI";
import { PlaylistBasic } from "./examples/PlaylistBasic";
import { SingleTrack } from "./examples/SingleTrack";
import { SpotifyMini } from "./examples/SpotifyMini";
import { ThemedCssVars } from "./examples/ThemedCssVars";

const examples = [
  { id: "single", label: "Single track", Component: SingleTrack },
  { id: "playlist", label: "Playlist + controls", Component: PlaylistBasic },
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
      <header className="border-b border-neutral-800 bg-neutral-900/80 px-4 py-4 backdrop-blur">
        <h1 className="text-xl font-semibold tracking-tight">Ginger demo</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-400">
          Examples for <code className="text-neutral-300">@lucaismyname/ginger</code>. Each block uses its own{" "}
          <code className="text-neutral-300">Ginger.Provider</code>.
        </p>
      </header>
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row">
        <nav className="flex shrink-0 flex-col gap-1 md:w-52">
          {examples.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setId(e.id)}
              className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                e.id === id ? "bg-neutral-800 text-white" : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
              }`}
            >
              {e.label}
            </button>
          ))}
        </nav>
        <main className="min-w-0 flex-1">
          <Body />
        </main>
      </div>
    </div>
  );
}
