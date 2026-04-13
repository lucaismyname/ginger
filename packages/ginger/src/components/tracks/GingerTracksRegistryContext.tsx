import { type ReactNode, createContext, useContext } from "react";
import type { Track } from "../../types";

/** Mutable registry cleared at the start of each `Ginger.Tracks` render, then filled by child `Ginger.Track` renders. */
export type GingerTracksRegistry = {
  slots: Map<string, Track>;
  order: string[];
};

const GingerTracksRegistryContext = createContext<GingerTracksRegistry | null>(null);

export function GingerTracksRegistryProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: GingerTracksRegistry;
}) {
  return (
    <GingerTracksRegistryContext.Provider value={value}>
      {children}
    </GingerTracksRegistryContext.Provider>
  );
}

export function useGingerTracksRegistry(): GingerTracksRegistry {
  const ctx = useContext(GingerTracksRegistryContext);
  if (!ctx) {
    throw new Error("Ginger.Track must be used inside <Ginger.Tracks>");
  }
  return ctx;
}
