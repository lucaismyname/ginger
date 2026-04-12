import { Ginger } from "@lucaismyname/ginger";
import { useState } from "react";
import { ThemeToggle } from "./components/ThemeToggle";
import { scan } from "react-scan";
const NPM_CMD = "npm install @lucaismyname/ginger";
const NPM_URL = "https://www.npmjs.com/package/@lucaismyname/ginger";
const REPO_URL = "https://github.com/lucaismyname/ginger";
if (import.meta.env.DEV) {
  scan({
    enabled: true,
    showToolbar: true,
  });
}
const LANDING_TRACKS = [
  {
    title: "SoundHelix Song 1",
    artist: "SoundHelix",
    fileUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    album: "Examples",
  },
];

function LandingPlayerControls() {
  return (
    <div className="flex flex-col md:flex-row w-full items-between justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-100/80 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900/80">
      <section className="flex items-center flex-1 grow-1 w-full gap-4">
        <Ginger.Control.PlayPause className="rounded-full border border-zinc-300 p-1.5 text-xs text-zinc-900 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-50 dark:hover:border-zinc-500 [&_svg]:h-3.5 [&_svg]:w-3.5" />
        <span className="w-11 text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
          <Ginger.Current.Elapsed />
        </span>
        <Ginger.Control.SeekBar className="h-1 md:min-w-32 w-full cursor-pointer appearance-none rounded-full bg-zinc-300 accent-zinc-700 dark:bg-zinc-700 dark:accent-zinc-200" />

        <span className="w-11 text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
          <Ginger.Current.Duration />
        </span>
      </section>
      <section className="flex items-center justify-between w-full shrink-1 gap-4">
        <div className="flex items-center gap-2">
          <Ginger.Control.Mute className="p-1.5 text-xs text-zinc-900 dark:text-zinc-50 [&_svg]:h-3.5 [&_svg]:w-3.5" />
          <Ginger.Control.Volume className="h-1 md:w-12 !w-24 cursor-pointer appearance-none rounded-full bg-zinc-300 accent-zinc-700 dark:bg-zinc-700 dark:accent-zinc-200" />
        </div>
        <Ginger.Control.PlaybackRate
          className="rounded-md border border-zinc-300 bg-transparent px-1.5 py-1 text-[10px] text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
          aria-label="Playback speed"
        />
      </section>
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
          <h1 className="lg:-ml-8 font-mono text-4xl font-semibold tracking-tight text-zinc-300 dark:text-zinc-700 sm:text-5xl">
            &lt;
            <span className=" font-bold text-orange-600 dark:text-orange-500">
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
              Example
            </p>
            <Ginger.Provider initialTracks={LANDING_TRACKS}>
              <Ginger.Player className="hidden w-32" />
              <LandingPlayerControls />
            </Ginger.Provider>
          </div>
          <section className="md:flex flex-col w-full md:flex-row gap-6 items-start justify-start">
            <div className="mt-8 w-full max-w-full flex-1 grow-1">
              <p className="mb-2 text-[0.66em] tracking-wider font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                Install
              </p>
              <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-100/80 pl-4 pr-2 py-2 dark:border-zinc-700 dark:bg-zinc-900/80">
                <pre className="min-w-0 flex-1 overflow-x-hidden w-full whitespace-nowrap font-mono text-sm text-zinc-900 dark:text-zinc-100">
                  <code className="whitespace-nowrap">{NPM_CMD}</code>
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
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-copy-icon lucide-copy"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-8 text-zinc-600 dark:text-zinc-400">
              <p className="mb-2 text-[0.66em] tracking-wider font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                Links
              </p>
              <section className="flex flex-row gap-4 items-center justify-start">
                <a
                  href={NPM_URL}
                  className="block flex-1 shrink-1 grow-1 rounded-lg border border-zinc-300/70 bg-zinc-100/90 w-full px-4 py-3 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100"
                  rel="noreferrer"
                  target="_blank"
                >
                  NPM
                </a>
                <a
                  href={REPO_URL}
                  className="block flex-1 shrink-1 grow-1 rounded-lg border border-zinc-300/70 bg-zinc-100/90 w-full px-4 py-3 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100"
                  rel="noreferrer"
                  target="_blank"
                >
                  GitHub
                </a>
              </section>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
