import { PlayLogo } from "./components/PlayLogo";
import { ThemeToggle } from "./components/ThemeToggle";

const NPM_CMD = "npm install @lucaismyname/ginger";
const NPM_URL = "https://www.npmjs.com/package/@lucaismyname/ginger";
const REPO_URL = "https://github.com/lucaismyname/ginger";

export function App() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-start justify-center px-6 py-16 sm:px-10 lg:px-16">
      <ThemeToggle />

      <main className="w-full max-w-xl text-left">
        <PlayLogo className="mb-8 h-[clamp(5rem,18vw,7rem)] w-auto aspect-[9/10]" />

        <h1 className="font-sans text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Ginger
        </h1>

        <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
          A headless React audio player. Build your own UI with playlists, keyboard
          shortcuts, and media session support—without fighting the DOM inside the
          library.
        </p>

        <div className="mt-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
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
      </main>
    </div>
  );
}
