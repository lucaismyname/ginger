import { type ReactNode, createContext, useContext } from "react";
import type { Track } from "../../types";

export type GingerDeclarativeMergeContextValue = {
  /** Latest `initialTracks` from `Ginger.Provider` props (via `latestInitRef`). */
  getInitialTracksSnapshot: () => Track[];
};

const GingerDeclarativeMergeContext = createContext<GingerDeclarativeMergeContextValue | null>(
  null,
);

export function GingerDeclarativeMergeProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: GingerDeclarativeMergeContextValue;
}) {
  return (
    <GingerDeclarativeMergeContext.Provider value={value}>
      {children}
    </GingerDeclarativeMergeContext.Provider>
  );
}

export function useGingerDeclarativeMerge(): GingerDeclarativeMergeContextValue | null {
  return useContext(GingerDeclarativeMergeContext);
}
