import { type ReactNode, createContext, useContext } from "react";
import type { GingerLocaleMessages } from "../types";

export const defaultGingerLocale: GingerLocaleMessages = {
  seek: "Seek",
  volume: "Volume",
  playbackSpeed: "Playback speed",
  chaptersList: "Chapters",
  syncedLyricsList: "Synced lyrics",
  nextTrack: "Next track",
  previousTrack: "Previous track",
  shuffle: "Shuffle",
  mute: "Mute",
  unmute: "Unmute",
  play: "Play",
  pause: "Pause",
  repeat: {
    off: "Repeat off",
    all: "Repeat all",
    one: "Repeat one",
  },
  playbackRateNormal: "1× normal",
  playbackRateTimes: (rate) => `${rate}×`,
};

function mergeLocale(partial?: Partial<GingerLocaleMessages>): GingerLocaleMessages {
  if (!partial) return defaultGingerLocale;
  return {
    ...defaultGingerLocale,
    ...partial,
    repeat: { ...defaultGingerLocale.repeat, ...partial.repeat },
  };
}

const GingerLocaleContext = createContext<GingerLocaleMessages>(defaultGingerLocale);

export function GingerLocaleProvider({
  locale,
  children,
}: {
  locale?: Partial<GingerLocaleMessages>;
  children: ReactNode;
}) {
  const value = mergeLocale(locale);
  return <GingerLocaleContext.Provider value={value}>{children}</GingerLocaleContext.Provider>;
}

export function useGingerLocale(): GingerLocaleMessages {
  return useContext(GingerLocaleContext);
}
