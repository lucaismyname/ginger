import { Ginger, useGinger, useGingerMedia } from "@lucaismyname/ginger";
import { useState } from "react";
import { ThemeToggle } from "./components/ThemeToggle";

const NPM_CMD = "npm install @lucaismyname/ginger";
const NPM_URL = "https://www.npmjs.com/package/@lucaismyname/ginger";
const REPO_URL = "https://github.com/lucaismyname/ginger";
const LANDING_TRACKS = [
  {
    title: "SoundHelix Song 1",
    artist: "SoundHelix",
    fileUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    album: "Examples",
  },
];

function LandingPlayerControls() {
  const { state } = useGinger();
  const { muted } = useGingerMedia();

  return (
    <div className="flex w-full items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-100/80 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900/80">
      <Ginger.Control.PlayPause
        aria-label={state.isPaused ? "Play" : "Pause"}
        className="rounded-full border border-zinc-300 p-1.5 text-xs text-zinc-900 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-50 dark:hover:border-zinc-500"
      >
        {state.isPaused ? (
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5 fill-current"
            viewBox="0 0 16 16"
          >
            <path d="M5 3.5v9l7-4.5-7-4.5z" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5 fill-current"
            viewBox="0 0 16 16"
          >
            <rect x="4" y="3" width="3" height="10" rx="0.8" />
            <rect x="9" y="3" width="3" height="10" rx="0.8" />
          </svg>
        )}
      </Ginger.Control.PlayPause>
      <span className="w-11 text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
        <Ginger.Current.Elapsed />
      </span>
      <Ginger.Control.SeekBar className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-300 accent-zinc-700 dark:bg-zinc-700 dark:accent-zinc-200" />
      <span className="w-11 text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
        <Ginger.Current.Duration />
      </span>
      <Ginger.Control.Mute
        className="rounded-full border border-zinc-300 p-1.5 text-xs text-zinc-900 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-50 dark:hover:border-zinc-500"
        muteLabel={
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5 fill-current"
            viewBox="0 0 16 16"
          >
            <path d="M6.6 4.2 4.7 6H3.2A1.2 1.2 0 0 0 2 7.2v1.6c0 .66.54 1.2 1.2 1.2h1.5l1.9 1.8c.77.73 2.02.19 2.02-.87V5.07c0-1.06-1.25-1.6-2.02-.87zm4.05 2.33.85-.85L14 8.12l-2.5 2.5-.85-.85L12.3 8.1l-1.65-1.57z" />
          </svg>
        }
        unmuteLabel={
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5 fill-current"
            viewBox="0 0 16 16"
          >
            <path d="M6.6 4.2 4.7 6H3.2A1.2 1.2 0 0 0 2 7.2v1.6c0 .66.54 1.2 1.2 1.2h1.5l1.9 1.8c.77.73 2.02.19 2.02-.87V5.07c0-1.06-1.25-1.6-2.02-.87zM10.4 6a.8.8 0 0 1 1.13.06c.93 1.03.93 2.86 0 3.88a.8.8 0 1 1-1.19-1.08c.41-.45.41-1.28 0-1.73A.8.8 0 0 1 10.4 6zm1.93-1.93a.8.8 0 0 1 1.13.06c1.9 2.08 1.9 5.66 0 7.74a.8.8 0 0 1-1.19-1.08c1.35-1.49 1.35-4.1 0-5.58a.8.8 0 0 1 .06-1.14z" />
          </svg>
        }
        aria-label={muted ? "Unmute" : "Mute"}
      />
      <Ginger.Control.Volume className="h-1.5 !w-12 cursor-pointer appearance-none rounded-full bg-zinc-300 accent-zinc-700 dark:bg-zinc-700 dark:accent-zinc-200" />
      <Ginger.Control.PlaybackRate
        className="rounded-md border border-zinc-300 bg-transparent px-1.5 py-1 text-[10px] text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
        aria-label="Playback speed"
      />
    </div>
  );
}

export function App() {
  const [copyLabel, setCopyLabel] = useState("Copy");

  const handleCopyInstall = async () => {
    try {
      await navigator.clipboard.writeText(NPM_CMD);
      setCopyLabel("Copied");
      window.setTimeout(() => setCopyLabel("Copy"), 1400);
    } catch {
      setCopyLabel("Failed");
      window.setTimeout(() => setCopyLabel("Copy"), 1400);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-start justify-center px-6 py-16 sm:px-10 lg:px-16">
      <ThemeToggle />

      <main className="w-full max-w-xl text-left mx-auto">
        <section className="flex flex-col items-start justify-start">
          <h1 className="md:-ml-8 font-mono text-4xl font-semibold tracking-tight text-zinc-300 dark:text-zinc-700 sm:text-5xl">
            &lt;
            <span className=" font-bold text-orange-500 dark:text-orange-400">
              Ginger
            </span>{" "}
            /&gt;
          </h1>

          <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            A headless React audio player. Build your own UI with playlists,
            keyboard shortcuts, and media session support—without fighting the
            DOM inside the library.
          </p>
          <div className="mt-8 w-full max-w-full">
            <p className="mb-2 text-[0.66em] tracking-wider font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
              Playground
            </p>
            <Ginger.Provider initialTracks={LANDING_TRACKS}>
              <Ginger.Player className="hidden w-32" />
              <LandingPlayerControls />
            </Ginger.Provider>
          </div>
          <section className="md:flex flex-col md:flex-row gap-6 items-start justify-start">
            <div className="mt-8 w-full max-w-full flex-1 grow-1">
              <p className="mb-2 text-[0.66em] tracking-wider font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                Install
              </p>
              <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-100/80 pl-4 pr-2 py-2 dark:border-zinc-700 dark:bg-zinc-900/80">
                <pre className="min-w-0 flex-1 overflow-x-auto font-mono text-sm text-zinc-900 dark:text-zinc-100">
                  <code>{NPM_CMD}</code>
                </pre>
                <button
                  aria-live="polite"
                  className="rounded-md border border-zinc-300/70 bg-zinc-50 p-1.5 text-xs text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-700"
                  onClick={handleCopyInstall}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-copy-icon lucide-copy"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                </button>
              </div>
            </div>

            <p className="mt-8 text-zinc-600 dark:text-zinc-400">
              <p className="mb-2 text-[0.66em] tracking-wider font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                Links
              </p>
              <section className="flex flex-row gap-4 items-center justify-start">
                <a
                  href={NPM_URL}
                  className="block flex-1 shrink-1 grow-1 rounded-lg border border-zinc-300/70 bg-zinc-100/90 w-full px-4 py-3 font-mono w-full text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100"
                  rel="noreferrer"
                  target="_blank"
                >
                  NPM
                </a>
                <a
                  href={REPO_URL}
                  className="block flex-1 shrink-1 grow-1 rounded-lg border border-zinc-300/70 bg-zinc-100/90 w-full px-4 py-3 font-mono w-full text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100"
                  rel="noreferrer"
                  target="_blank"
                >
                  GitHub
                </a>
              </section>
            </p>
          </section>
        </section>
      </main>
    </div>
  );
}
