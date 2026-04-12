import { Ginger, useGingerState } from "@lucaismyname/ginger";
import type { Track } from "@lucaismyname/ginger";
import { useState } from "react";
import { PlaybackRateSelect } from "./components/PlaybackRateSelect";
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
const LANDING_TRACKS: Track[] = [
  {
    title: "SoundHelix Song 1",
    artist: "SoundHelix",
    fileUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    album: "Examples",
    artworkUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=320&h=320&q=80",
    chapters: [
      { title: "Intro", startSeconds: 0 },
      { title: "Main theme", startSeconds: 60 },
      { title: "Variation", startSeconds: 180 },
      { title: "Bridge", startSeconds: 300 },
      { title: "Outro", startSeconds: 420 },
    ],
  },
];

function SeekBarWithChapterMarkers() {
  const state = useGingerState();
  const track = state.tracks[state.currentIndex];
  const { duration } = state;
  const chapters = track?.chapters;
  const showTicks =
    chapters &&
    chapters.length > 0 &&
    Number.isFinite(duration) &&
    duration > 0;

  return (
    <div className="relative h-3 w-full min-w-0 shrink md:min-w-32">
      {showTicks ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-visible"
          aria-hidden
        >
          {chapters.map((ch) => {
            const pct = (ch.startSeconds / duration) * 100;
            return (
              <div
                key={`${ch.startSeconds}-${ch.title}`}
                className="absolute top-0 h-full w-0.5 -translate-x-1/2 rounded-full bg-zinc-500/70 dark:bg-zinc-400/60"
                style={{ left: `${Math.min(100, Math.max(0, pct))}%` }}
                title={ch.title}
              />
            );
          })}
        </div>
      ) : null}
      <Ginger.Control.SeekBar className="absolute left-0 right-0 top-1/2 z-10 h-1 w-full -translate-y-1/2 cursor-pointer appearance-none rounded-full bg-zinc-300 accent-zinc-700 dark:bg-zinc-700 dark:accent-zinc-200" />
    </div>
  );
}

function LandingPlayerControls() {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100/80 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80">
      <div className="flex items-center gap-3 border-b border-zinc-200/90 px-3 py-3 dark:border-zinc-700/90">
        <Ginger.Current.Artwork
          className="border border-zinc-200/90 dark:border-zinc-600/80 h-14 w-14 shrink-0 rounded-lg shadow-sm ring-1 ring-zinc-200/90 dark:ring-zinc-600/80"
          loading="lazy"
          decoding="async"
        />
        <div className="min-w-0 flex-1">
          <Ginger.Current.Title className="block truncate text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-50" />
          <Ginger.Current.Artist className="mt-0.5 block truncate text-xs text-zinc-500 dark:text-zinc-400" />
        </div>
      </div>
      <div className="flex flex-col gap-3 px-3 py-2.5 md:flex-row md:items-center md:justify-between">
        <section className="flex w-full flex-1 items-center gap-4 md:min-w-0">
          <Ginger.Control.PlayPause className="rounded-full border border-zinc-300 p-1.5 text-xs text-zinc-900 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-50 dark:hover:border-zinc-500 [&_svg]:h-3.5 [&_svg]:w-3.5" />
          <span className="w-11 shrink-0 text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
            <Ginger.Current.Elapsed />
          </span>
          <SeekBarWithChapterMarkers />

          <span className="w-11 shrink-0 text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
            <Ginger.Current.Duration />
          </span>
        </section>
        <section className="flex w-full shrink-0 items-center justify-between gap-4 md:w-auto md:justify-end">
          <div className="flex items-center gap-2">
            <Ginger.Control.Mute className="p-1.5 text-xs text-zinc-900 dark:text-zinc-50 [&_svg]:h-3.5 [&_svg]:w-3.5" />
            <Ginger.Control.Volume className="h-1 md:w-12 !w-24 cursor-pointer appearance-none rounded-full bg-zinc-300 accent-zinc-700 dark:bg-zinc-700 dark:accent-zinc-200" />
          </div>
          <PlaybackRateSelect />
        </section>
      </div>
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
    <div className="relative flex min-h-screen w-full flex-col md:items-start md:justify-center px-6 py-6 md:py-16 sm:px-10 lg:px-16">
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

          <p className="mt-4 text-base md:-mr-0 md:ml-0 text-pretty leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            A headless React audio player. Build your own UI with playlists,
            keyboard shortcuts, remote-control, spatial-support, audio
            analyzers, and media session support—without fighting the DOM inside
            the library.
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
