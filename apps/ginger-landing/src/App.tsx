import { Ginger } from "@lucaismyname/ginger";
import {
  Activity,
  ChartNoAxesColumn,
  CircleEllipsis,
  Code,
  Command,
  EyeIcon,
  Globe,
  Hammer,
  Link2,
  List,
  MonitorUp,
  Package,
  Palette,
  Shell,
} from "lucide-react";
import { useState } from "react";
import { scan } from "react-scan";
import { CodeTooltip } from "./components/CodeTooltip";
import { LandingPlayerControls } from "./components/LandingPlayerControls";
import { SectionLabel } from "./components/SectionLabel";
import { ThemeToggle } from "./components/ThemeToggle";
import { NPM_CMD, NPM_URL, REPO_URL, TOOLTIP_EXAMPLE_SNIPPET } from "./data/constants";
import { LANDING_TRACKS } from "./data/tracks";

if (import.meta.env.DEV) {
  scan({
    enabled: true,
    showToolbar: true,
  });
}

export function App() {
  const [copyLabel, setCopyLabel] = useState("Copy");
  const [tooltipCopyLabel, setTooltipCopyLabel] = useState("Copy");

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

  const handleCopyTooltipExample = async () => {
    try {
      await navigator.clipboard.writeText(TOOLTIP_EXAMPLE_SNIPPET);
      setTooltipCopyLabel("Copied");
      window.setTimeout(() => setTooltipCopyLabel("Copy"), 1400);
    } catch {
      setTooltipCopyLabel("Failed");
      window.setTimeout(() => setTooltipCopyLabel("Copy"), 1400);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col md:items-start md:justify-center px-6 py-6 md:py-16 sm:px-10 lg:px-16">
      <ThemeToggle />
      <output id="install-copy-status" aria-live="polite" className="sr-only">
        {copyLabel === "Copy" ? "" : `Install command ${copyLabel.toLowerCase()}.`}
      </output>
      <output id="tooltip-copy-status" aria-live="polite" className="sr-only">
        {tooltipCopyLabel === "Copy" ? "" : `Tooltip example ${tooltipCopyLabel.toLowerCase()}.`}
      </output>

      <main className="w-full max-w-2xl text-left mx-auto">
        <section className="flex flex-col items-start justify-start">
          {/* Title with hover code tooltip */}
          <div
            aria-describedby="ginger-title-tooltip"
            className="group relative inline-flex flex-col items-start rounded-sm md:-ml-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950"
          >
            <h1 className="font-pixel text-3xl sm:text-5xl font-normal text-zinc-300 dark:text-zinc-700">
              &lt;
              <span className="font-mono font-bold text-orange-600 dark:text-orange-500">
                Ginger
              </span>{" "}
              /&gt;
            </h1>
            <span className="sr-only">
              Hover or focus the title to preview a Ginger player example.
            </span>
            <CodeTooltip tooltipCopyLabel={tooltipCopyLabel} onCopy={handleCopyTooltipExample} />
          </div>

          {/* Tagline */}
          <p className="mt-4 text-base md:-mr-0 md:ml-0 text-balance leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            A headless React audio player primitive component{" "}
            <Code
              aria-hidden
              className="inline-block h-[0.95em] w-[0.95em] align-[-0.12em] text-zinc-400/70 dark:text-zinc-500/70"
            />
            . Build your own UI{" "}
            <Palette className="inline-block h-[0.95em] w-[0.95em] align-[-0.12em] text-zinc-400/70 dark:text-zinc-500/70" />{" "}
            with playlists{" "}
            <List
              aria-hidden
              className="inline-block h-[0.95em] w-[0.95em] align-[-0.12em] text-zinc-400/70 dark:text-zinc-500/70"
            />
            , keyboard shortcuts{" "}
            <Command
              aria-hidden
              className="inline-block h-[0.95em] w-[0.95em] align-[-0.12em] text-zinc-400/70 dark:text-zinc-500/70"
            />
            , remote-control{" "}
            <MonitorUp
              aria-hidden
              className="inline-block h-[0.95em] w-[0.95em] align-[-0.12em] text-zinc-400/70 dark:text-zinc-500/70"
            />
            , spatial{" "}
            <Activity
              aria-hidden
              className="inline-block h-[0.95em] w-[0.95em] align-[-0.12em] text-zinc-400/70 dark:text-zinc-500/70"
            />
            , audio analyzers{" "}
            <ChartNoAxesColumn
              aria-hidden
              className="inline-block h-[0.95em] w-[0.95em] align-[-0.12em] text-zinc-400/70 dark:text-zinc-500/70"
            />
            , media sessions{" "}
            <Shell
              aria-hidden
              className="inline-block h-[0.95em] w-[0.95em] align-[-0.12em] text-zinc-400/70 dark:text-zinc-500/70"
            />
            , and much more{" "}
            <CircleEllipsis
              aria-hidden
              className="inline-block h-[0.95em] w-[0.95em] align-[-0.12em] text-zinc-400/70 dark:text-zinc-500/70"
            />{" "}
            — without fighting{" "}
            <Hammer
              aria-hidden
              className="inline-block h-[0.95em] w-[0.95em] align-[-0.12em] text-zinc-400/70 dark:text-zinc-500/70"
            />{" "}
            the DOM{" "}
            <Globe
              aria-hidden
              className="inline-block h-[0.95em] w-[0.95em] align-[-0.12em] text-zinc-400/70 dark:text-zinc-500/70"
            />{" "}
            inside the library{" "}
            <Package
              aria-hidden
              className="inline-block h-[0.95em] w-[0.95em] align-[-0.12em] text-zinc-400/70 dark:text-zinc-500/70"
            />
            .
          </p>

          {/* Live player example */}
          <div className="mt-8 w-full max-w-full">
            <SectionLabel icon={EyeIcon}>Example</SectionLabel>
            <Ginger.Provider initialTracks={LANDING_TRACKS}>
              <Ginger.Player className="hidden" />
              <LandingPlayerControls />
            </Ginger.Provider>
          </div>

          {/* Install + Links */}
          <section className="md:flex flex-col w-full md:flex-row gap-6 items-start justify-start">
            <div className="mt-8 w-full max-w-full flex-1 grow-1">
              <SectionLabel icon={Package}>Install</SectionLabel>
              <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-100/80 pl-4 pr-2 py-2 dark:border-zinc-700 dark:bg-zinc-900/80">
                <pre className="min-w-0 flex-1 overflow-x-hidden w-full whitespace-nowrap font-mono text-base text-zinc-900 dark:text-zinc-100">
                  <code className="font-mono whitespace-nowrap">{NPM_CMD}</code>
                </pre>
                <button
                  aria-describedby="install-copy-status"
                  aria-label="Copy install command"
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
              <SectionLabel icon={Globe}>Links</SectionLabel>
              <section className="flex flex-row gap-0 items-center justify-start">
                <a
                  href={NPM_URL}
                  aria-label="Open NPM package"
                  title="NPM"
                  className="inline-flex rounded-tr-none rounded-br-none h-11 w-11 items-center justify-center rounded-lg border border-orange-300/70 bg-orange-50/90 text-orange-950 transition-colors hover:border-orange-500 hover:bg-orange-100/80 dark:border-orange-700/80 dark:bg-orange-950/50 dark:text-orange-200 dark:hover:border-orange-600 dark:hover:bg-orange-900/60"
                  rel="noreferrer"
                  target="_blank"
                >
                  <Package className="h-4 w-4" aria-hidden />
                </a>
                <a
                  href={REPO_URL}
                  aria-label="Open GitHub repository"
                  title="GitHub"
                  className="inline-flex h-11 w-11 items-center justify-center border border-zinc-300/70 bg-zinc-50/90 text-zinc-950 transition-colors hover:border-zinc-500 hover:bg-zinc-100/80 dark:border-zinc-700/80 dark:bg-zinc-950/50 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/60"
                  rel="noreferrer"
                  target="_blank"
                >
                  <Link2 className="h-4 w-4" aria-hidden />
                </a>
                <a
                  href="https://lucamack.com"
                  aria-label="Open personal website"
                  title="Website"
                  className="inline-flex h-11 w-11 rounded-tl-none rounded-bl-none items-center justify-center rounded-lg border border-zinc-300/70 bg-zinc-50/90 text-zinc-950 transition-colors hover:border-zinc-500 hover:bg-zinc-100/80 dark:border-zinc-700/80 dark:bg-zinc-950/50 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/60"
                  rel="noreferrer"
                  target="_blank"
                >
                  <Globe className="h-4 w-4" aria-hidden />
                </a>
              </section>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
