import * as Accordion from "@radix-ui/react-accordion";
import { Ginger, useGingerState } from "@lucaismyname/ginger";
import type { Track, TrackChapter } from "@lucaismyname/ginger";
import type { LucideIcon } from "lucide-react";
import { Globe, Link2, EyeIcon, Package } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { PlaybackRateSelect } from "./components/PlaybackRateSelect";
import { ThemeToggle } from "./components/ThemeToggle";
import { scan } from "react-scan";
const NPM_CMD = "npm install @lucaismyname/ginger";
const NPM_URL = "https://www.npmjs.com/package/@lucaismyname/ginger";
const REPO_URL = "https://github.com/lucaismyname/ginger";
const TOOLTIP_EXAMPLE_SNIPPET = `// custom player with chapters + controls
<Ginger.Provider initialTracks={tracks}>
  <Ginger.Player />
  <Ginger.Current.Title className="font-semibold" />
  <Ginger.Control.SeekBar className="h-1" />
  <Ginger.Control.Volume className="w-24" />
</Ginger.Provider>`;
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

const CAPABILITIES = [
  {
    title: "Playlists",
    description: "Queue and switch tracks with a tiny API surface.",
  },
  {
    title: "Keyboard Shortcuts",
    description: "Wire your own key bindings without DOM coupling.",
  },
  {
    title: "Media Session",
    description: "Integrates with lock screen and OS transport controls.",
  },
  {
    title: "Remote Control",
    description: "Drive playback state from outside the visible player UI.",
  },
  {
    title: "Chapter Markers",
    description: "Expose track segments for podcasts and long mixes.",
  },
  {
    title: "Audio Analyzers",
    description: "Feed visualizers and metering from the same source.",
  },
  {
    title: "Composable Controls",
    description: "Mix and match primitives for your own layouts.",
  },
  {
    title: "TypeScript First",
    description: "Strongly typed data and component contracts by default.",
  },
];

const HOW_IT_WORKS = [
  {
    title: "Provide tracks",
    code: "<Ginger.Provider initialTracks={tracks}>",
    description: "Give Ginger your track list and metadata.",
  },
  {
    title: "Mount the engine",
    code: "<Ginger.Player />",
    description: "Attach the player primitive once in your tree.",
  },
  {
    title: "Compose your UI",
    code: "<Ginger.Control.* /> + <Ginger.Current.* />",
    description: "Build custom controls and now-playing views.",
  },
];

const API_GROUPS = [
  {
    label: "Core",
    items: ["Ginger.Provider", "Ginger.Player", "useGingerState"],
  },
  {
    label: "Controls",
    items: [
      "Ginger.Control.PlayPause",
      "Ginger.Control.SeekBar",
      "Ginger.Control.Volume",
      "Ginger.Control.Mute",
    ],
  },
  {
    label: "Current Track",
    items: [
      "Ginger.Current.Title",
      "Ginger.Current.Artist",
      "Ginger.Current.Duration",
      "Ginger.Current.Artwork",
    ],
  },
];

const USE_CASES = [
  "Podcast players with chapter-aware seek bars.",
  "Music products with custom branded control strips.",
  "Ambient and soundboard tools with lightweight controls.",
  "Accessibility-first UIs with explicit and semantic controls.",
];

const TRUST_POINTS = [
  "Headless React primitives",
  "TypeScript-first API",
  "Composable controls",
  "Minimal CSS assumptions",
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
          {chapters.map((ch: TrackChapter) => {
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
          <Ginger.Control.PlayPause className="p-1.5 text-xs text-zinc-900 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-50 dark:hover:border-zinc-500 [&_svg]:h-3.5 [&_svg]:w-3.5" />
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

function SectionLabel({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <p className="mb-2 flex items-center gap-2 font-pixel text-[0.80em] font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
      <Icon
        aria-hidden
        className="size-[1em] shrink-0 text-orange-600 dark:text-orange-500"
        strokeWidth={2}
      />
      {children}
    </p>
  );
}

function AccordionSection({
  value,
  title,
  children,
}: {
  value: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Accordion.Item
      value={value}
      className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100/80 dark:border-zinc-700 dark:bg-zinc-900/80"
    >
      <Accordion.Header>
        <Accordion.Trigger className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left">
          <span className="font-pixel text-sm tracking-wide text-zinc-800 dark:text-zinc-200">
            {title}
          </span>
          <span className="text-lg leading-none text-orange-600 transition-transform duration-150 data-[state=open]:rotate-45 dark:text-orange-500">
            +
          </span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="border-t border-zinc-200/90 px-3 pb-3 pt-3 dark:border-zinc-700/90">
        {children}
      </Accordion.Content>
    </Accordion.Item>
  );
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
        {copyLabel === "Copy"
          ? ""
          : `Install command ${copyLabel.toLowerCase()}.`}
      </output>
      <output id="tooltip-copy-status" aria-live="polite" className="sr-only">
        {tooltipCopyLabel === "Copy"
          ? ""
          : `Tooltip example ${tooltipCopyLabel.toLowerCase()}.`}
      </output>

      <main className="w-full max-w-2xl text-left mx-auto">
        <section className="flex flex-col items-start justify-start">
          <div
            aria-describedby="ginger-title-tooltip"
            className="group relative inline-flex flex-col items-start rounded-sm md:-ml-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950"
          >
            <h1 className="font-pixel text-4xl sm:text-5xl font-normal tracking-widest text-zinc-300 dark:text-zinc-700">
              &lt;
              <span className="text-orange-600 dark:text-orange-500">
                Ginger
              </span>{" "}
              /&gt;
            </h1>
            <span className="sr-only">
              Hover or focus the title to preview a Ginger player example.
            </span>
            <div
              className="pointer-events-none invisible absolute left-0 top-full z-20 w-[min(90vw,28rem)] pt-2.5 opacity-0 transition duration-150 ease-out group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100"
              id="ginger-title-tooltip"
              role="tooltip"
            >
              <div className="absolute left-8 top-1 h-3 w-3 rotate-45 border-l border-t border-zinc-300 bg-zinc-100/95 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/95" />
              <div className="translate-y-1 rounded-lg border border-zinc-300 bg-zinc-100/95 p-3 shadow-xl shadow-black/20 backdrop-blur-sm transition duration-150 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0 dark:border-zinc-700 dark:bg-zinc-900/95">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="font-pixel text-[11px] tracking-wide text-zinc-500 dark:text-zinc-400">
                    quick start
                  </p>
                  <button
                    aria-describedby="tooltip-copy-status"
                    aria-label={`Copy tooltip example code (${tooltipCopyLabel})`}
                    className="rounded-md border border-zinc-300/70 bg-zinc-50 p-1.5 text-xs text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-700"
                    onClick={handleCopyTooltipExample}
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
                      aria-hidden
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  </button>
                </div>
                <pre className="overflow-x-auto rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-xs leading-relaxed text-zinc-800 dark:border-zinc-700/80 dark:bg-zinc-950 dark:text-zinc-100">
                  <code>
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {"// custom player with chapters + controls"}
                    </span>
                    {"\n"}
                    <span className="text-orange-700 dark:text-orange-300">
                      {"<Ginger.Provider initialTracks={tracks}>"}
                    </span>
                    {"\n"}
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {"  <Ginger.Player />"}
                    </span>
                    {"\n"}
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {'  <Ginger.Current.Title className="font-semibold" />'}
                    </span>
                    {"\n"}
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {'  <Ginger.Control.SeekBar className="h-1" />'}
                    </span>
                    {"\n"}
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {'  <Ginger.Control.Volume className="w-24" />'}
                    </span>
                    {"\n"}
                    <span className="text-orange-700 dark:text-orange-300">
                      {"</Ginger.Provider>"}
                    </span>
                  </code>
                </pre>
              </div>
            </div>
          </div>

          <p className="mt-4 text-base md:-mr-0 md:ml-0 text-pretty leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            A headless React audio player primitive. Build your own UI with
            playlists, keyboard shortcuts, remote-control, spatial support,
            audio analyzers, media session support, and more — without fighting
            the DOM inside the library.
          </p>
          <div className="mt-8 w-full max-w-full">
            <SectionLabel icon={EyeIcon}>Example</SectionLabel>
            <Ginger.Provider initialTracks={LANDING_TRACKS}>
              <Ginger.Player className="hidden w-32" />
              <LandingPlayerControls />
            </Ginger.Provider>
          </div>
          {/* <div className="sr-only hidden mt-8 w-full max-w-full">
            <SectionLabel icon={Link2}>Guides</SectionLabel>
            <Accordion.Root
              type="single"
              collapsible
              defaultValue="capabilities"
              className="flex w-full flex-col gap-2"
            >
              <AccordionSection value="capabilities" title="Core Capabilities">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {CAPABILITIES.map((item) => (
                    <article
                      key={item.title}
                      className="rounded-md border border-zinc-200 bg-zinc-50/80 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950/60"
                    >
                      <h3 className="font-pixel text-xs tracking-wide text-zinc-900 dark:text-zinc-100">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {item.description}
                      </p>
                    </article>
                  ))}
                </div>
              </AccordionSection>

              <AccordionSection value="how-it-works" title="How It Works">
                <ol className="flex flex-col gap-2">
                  {HOW_IT_WORKS.map((step, index) => (
                    <li
                      key={step.title}
                      className="rounded-md border border-zinc-200 bg-zinc-50/80 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950/60"
                    >
                      <p className="font-pixel text-xs tracking-wide text-zinc-900 dark:text-zinc-100">
                        {index + 1}. {step.title}
                      </p>
                      <code className="mt-1 block font-mono text-xs text-orange-700 dark:text-orange-300">
                        {step.code}
                      </code>
                      <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                        {step.description}
                      </p>
                    </li>
                  ))}
                </ol>
              </AccordionSection>

              <AccordionSection value="api-snapshot" title="API Snapshot">
                <div className="flex flex-col gap-2">
                  {API_GROUPS.map((group) => (
                    <section
                      key={group.label}
                      className="rounded-md border border-zinc-200 bg-zinc-50/80 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950/60"
                    >
                      <p className="font-pixel text-xs tracking-wide text-zinc-900 dark:text-zinc-100">
                        {group.label}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                          <code
                            key={item}
                            className="rounded border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                          >
                            {item}
                          </code>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </AccordionSection>

              <AccordionSection value="use-cases" title="Use Cases">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {USE_CASES.map((useCase) => (
                    <p
                      key={useCase}
                      className="rounded-md border border-zinc-200 bg-zinc-50/80 px-3 py-2 text-xs leading-relaxed text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950/60 dark:text-zinc-300"
                    >
                      {useCase}
                    </p>
                  ))}
                </div>
              </AccordionSection>

              <AccordionSection value="trust-cta" title="Developer Trust + CTA">
                <div className="flex flex-col gap-3 ">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {TRUST_POINTS.map((point) => (
                      <p
                        key={point}
                        className="rounded-md border border-zinc-200 bg-zinc-50/80 px-3 py-2 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950/60 dark:text-zinc-300"
                      >
                        {point}
                      </p>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <button
                      aria-describedby="install-copy-status"
                      className="rounded-md border border-zinc-300/70 bg-zinc-50 px-3 py-2 text-xs text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-700"
                      onClick={handleCopyInstall}
                      type="button"
                    >
                      Copy install command
                    </button>
                    <a
                      href={NPM_URL}
                      rel="noreferrer"
                      target="_blank"
                      className="rounded-md border border-zinc-300/70 bg-zinc-50 px-3 py-2 text-center text-xs text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-700"
                    >
                      Open NPM docs
                    </a>
                    <a
                      href={REPO_URL}
                      rel="noreferrer"
                      target="_blank"
                      className="rounded-md border border-zinc-300/70 bg-zinc-50 px-3 py-2 text-center text-xs text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-700"
                    >
                      Open GitHub
                    </a>
                  </div>
                </div>
              </AccordionSection>
            </Accordion.Root>
          </div> */}
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
              <section className="flex flex-row gap-4 items-center justify-start">
                <a
                  href={NPM_URL}
                  className="font-mono block flex-1 shrink-1 grow-1 rounded-lg border border-zinc-300/70 bg-zinc-100/90 w-full px-4 py-3 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100"
                  rel="noreferrer"
                  target="_blank"
                >
                  NPM
                </a>
                <a
                  href={REPO_URL}
                  className="font-mono block flex-1 shrink-1 grow-1 rounded-lg border border-zinc-300/70 bg-zinc-100/90 w-full px-4 py-3 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100"
                  rel="noreferrer"
                  target="_blank"
                >
                  GH
                </a>
                <a
                  href={"https://lucamack.com"}
                  className="font-mono block flex-1 shrink-1 grow-1 rounded-lg border border-zinc-300/70 bg-zinc-100/90 w-full px-4 py-3 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100"
                  rel="noreferrer"
                  target="_blank"
                >
                  WWW
                </a>
              </section>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
