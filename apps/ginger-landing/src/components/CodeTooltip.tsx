import { Rocket } from "lucide-react";
import { TOOLTIP_EXAMPLE_SNIPPET } from "../data/constants";

export function CodeTooltip({
  tooltipCopyLabel,
  onCopy,
}: {
  tooltipCopyLabel: string;
  onCopy: () => void;
}) {
  return (
    <div
      className="pointer-events-none invisible absolute left-0 top-full z-20 w-[min(90vw,28rem)] pt-2.5 opacity-0 transition duration-150 ease-out group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100"
      id="ginger-title-tooltip"
      role="tooltip"
    >
      <div className="absolute left-8 top-1 h-3 w-3 rotate-45 border-l border-t border-zinc-300 bg-zinc-100/95 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/95" />
      <div className="translate-y-1 rounded-lg border border-zinc-300 bg-zinc-50/75 p-3 shadow-xl shadow-black/20 backdrop-blur-sm transition duration-150 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0 dark:border-zinc-700 dark:bg-zinc-900/75">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 font-pixel text-[12px] tracking-wide text-orange-500 dark:text-orange-400">
            <Rocket className="inline-block h-[0.95em] w-[0.95em] align-[-0.12em] text-orange-400/70 dark:text-orange-500/70" />{" "}
            Quick Start
          </p>
          <button
            aria-describedby="tooltip-copy-status"
            aria-label={`Copy tooltip example code (${tooltipCopyLabel})`}
            className="rounded-md border border-zinc-300/70 bg-zinc-50 p-1.5 text-xs text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-700"
            onClick={onCopy}
            type="button"
          >
            <CopyIcon />
          </button>
        </div>
        <pre className="shadow-sm overflow-x-auto rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-xs leading-relaxed text-zinc-800 dark:border-zinc-700/80 dark:bg-zinc-950 dark:text-zinc-100">
          <code className="text-zinc-500 dark:text-zinc-400">{TOOLTIP_EXAMPLE_SNIPPET}</code>
        </pre>
      </div>
    </div>
  );
}

function CopyIcon() {
  return (
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
  );
}
