import { useState } from "react";
import { CurrentAndQueueGallery } from "./examples/CurrentAndQueueGallery";
import { GlassmorphismDeck } from "./examples/GlassmorphismDeck";
import { HeadlessCustomUI } from "./examples/HeadlessCustomUI";
import { ManualPlaylist } from "./examples/ManualPlaylist";
import { NeonConsole } from "./examples/NeonConsole";
import { PodcastTimeline } from "./examples/PodcastTimeline";
import { PlaylistBasic } from "./examples/PlaylistBasic";
import { SingleTrack } from "./examples/SingleTrack";
import { SpotifyMini } from "./examples/SpotifyMini";
import { ThemedCssVars } from "./examples/ThemedCssVars";
import { UnstyledShowcase } from "./examples/UnstyledShowcase";
import { AlbumGrid } from "./examples/AlbumGrid";
import { WaveformPlayer } from "./examples/WaveformPlayer";
import { scan } from "react-scan";
if (import.meta.env.DEV) {
  scan({
    enabled: true,
    showToolbar: true,
  });
}
const examples = [
  { id: "single", label: "Single track", Component: SingleTrack },
  { id: "playlist", label: "Playlist + controls", Component: PlaylistBasic },
  { id: "manual-playlist", label: "Manual Playlist.Track", Component: ManualPlaylist },
  { id: "headless", label: "useGinger headless", Component: HeadlessCustomUI },
  { id: "theme", label: "CSS variables", Component: ThemedCssVars },
  { id: "spotify", label: "Spotify mini", Component: SpotifyMini },
  { id: "waveform", label: "Waveform player", Component: WaveformPlayer },
  { id: "podcast", label: "Podcast timeline", Component: PodcastTimeline },
  { id: "glass", label: "Glassmorphism deck", Component: GlassmorphismDeck },
  { id: "neon", label: "Neon console", Component: NeonConsole },
  { id: "album-grid", label: "Album card grid", Component: AlbumGrid },
  { id: "unstyled", label: "Unstyled showcase", Component: UnstyledShowcase },
  { id: "gallery", label: "Current + Queue gallery", Component: CurrentAndQueueGallery },
] as const;

export function App() {
  const [id, setId] = useState<(typeof examples)[number]["id"]>("playlist");
  const active = examples.find((e) => e.id === id) ?? examples[1]!;
  const Body = active.Component;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-indigo-50/40">
      <header className="border-b border-zinc-200/80 bg-white/75 px-4 py-8 shadow-sm backdrop-blur md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700">
            Ginger UI Playground
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">Audio player styling demos</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
          Examples for <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800">@lucaismyname/ginger</code>.
          Each block uses its own{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800">Ginger.Provider</code>.
        </p>
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:gap-10 md:px-8">
        <nav className="flex shrink-0 flex-col gap-1 md:w-64" aria-label="Examples">
          {examples.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setId(e.id)}
              className={`rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${
                e.id === id
                  ? "bg-zinc-900 text-white shadow-md"
                  : "text-zinc-700 hover:bg-white/90 hover:text-zinc-900 hover:shadow-sm"
              }`}
            >
              {e.label}
            </button>
          ))}
        </nav>
        <main className="min-w-0 flex-1 rounded-2xl border border-zinc-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-sm md:p-6">
          <Body />
        </main>
      </div>
    </div>
  );
}
