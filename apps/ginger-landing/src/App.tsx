import { Ginger } from "@lucaismyname/ginger";
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

export function App() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-start justify-center px-6 py-16 sm:px-10 lg:px-16">
      <ThemeToggle />

      <main className="w-full max-w-xl text-left mx-auto">
        <section className="flex flex-col items-start justify-start">
          <div className="mb-8 w-full max-w-96">
            <Ginger.Provider initialTracks={LANDING_TRACKS}>
              <Ginger.Player className="hidden w-32" />
              <div className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-100/80 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/80">
                <Ginger.Control.PlayPause className="rounded-full border border-zinc-300 px-2 py-1 text-xs text-zinc-900 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-50 dark:hover:border-zinc-500" />
                <span className="w-11 text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                  <Ginger.Current.Elapsed />
                </span>
                <Ginger.Control.SeekBar className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-300 accent-zinc-700 dark:bg-zinc-700 dark:accent-zinc-200" />
                <span className="w-11 text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                  <Ginger.Current.Duration />
                </span>
                <Ginger.Control.Volume className="h-1.5 !w-12 cursor-pointer appearance-none rounded-full bg-zinc-300 accent-zinc-700 dark:bg-zinc-700 dark:accent-zinc-200" />
              </div>
            </Ginger.Provider>
          </div>

          <h1 className="font-mono text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            &lt;Ginger /&gt;
          </h1>

          <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            A headless React audio player. Build your own UI with playlists,
            keyboard shortcuts, and media session support—without fighting the
            DOM inside the library.
          </p>

          <div className="mt-8">
            <p className="mb-2 text-[0.66em] tracking-wider font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
              Install
            </p>
            <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-100/80 px-4 py-3 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100">
              <code>{NPM_CMD}</code>
            </pre>
          </div>

          <p className="mt-8 text-sm text-zinc-600 dark:text-zinc-400">
            <a
              href={NPM_URL}
              className="font-medium text-ginger underline decoration-ginger underline-offset-4 transition-colors hover:text-ginger-dark dark:text-orange-400 dark:decoration-orange-400 dark:hover:text-orange-300"
              rel="noreferrer"
              target="_blank"
            >
              npm package
            </a>
            <span className="mx-2 text-zinc-400">·</span>
            <a
              href={REPO_URL}
              className="font-medium text-ginger underline decoration-ginger underline-offset-4 transition-colors hover:text-ginger-dark dark:text-orange-400 dark:decoration-orange-400 dark:hover:text-orange-300"
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}
