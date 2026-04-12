import * as Select from "@radix-ui/react-select";
import { useGingerLocale, useGingerMedia } from "@lucaismyname/ginger";
import { useMemo } from "react";

const defaultRates = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

export type PlaybackRateSelectProps = {
  className?: string;
  /** Same defaults as `Ginger.Control.PlaybackRate`. */
  rates?: readonly number[];
};

/**
 * Radix-based playback speed control using Ginger’s `useGingerMedia` / locale strings
 * (same behavior as the built-in `<select>`, custom UI).
 */
export function PlaybackRateSelect({
  className,
  rates = defaultRates,
}: PlaybackRateSelectProps) {
  const { playbackRate, setPlaybackRate } = useGingerMedia();
  const locale = useGingerLocale();

  const options = useMemo(
    () => Array.from(new Set([...rates, playbackRate])).sort((a, b) => a - b),
    [rates, playbackRate],
  );

  const labelFor = (r: number) =>
    r === 1 ? locale.playbackRateNormal : locale.playbackRateTimes(r);

  return (
    <Select.Root
      value={String(playbackRate)}
      onValueChange={(v) => {
        setPlaybackRate(Number(v));
      }}
    >
      <Select.Trigger
        type="button"
        className={`inline-flex min-w-16 items-center justify-between gap-1 rounded-md border border-zinc-300 bg-transparent px-1.5 py-1 text-left text-[10px] text-zinc-700 outline-none transition-colors hover:bg-zinc-200/60 focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800/80 dark:focus-visible:ring-zinc-500 ${className ?? ""}`}
        aria-label={locale.playbackSpeed}
      >
        <Select.Value>{labelFor(playbackRate)}</Select.Value>
        <Select.Icon className="shrink-0 text-zinc-500 dark:text-zinc-400">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className="z-[100] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 shadow-lg dark:border-zinc-600 dark:bg-zinc-800"
        >
          <Select.Viewport className="p-0.5">
            {options.map((r) => (
              <Select.Item
                key={r}
                value={String(r)}
                className="relative flex cursor-pointer select-none rounded px-2 py-1.5 text-[10px] text-zinc-800 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-200 data-[state=checked]:font-medium dark:text-zinc-100 dark:data-[highlighted]:bg-zinc-700"
              >
                <Select.ItemText>{labelFor(r)}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
