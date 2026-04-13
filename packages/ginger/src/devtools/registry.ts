import type { GingerState, PlaybackMode, RepeatMode } from "../types";

export type ProviderActions = {
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  setMuted: (m: boolean) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  cycleRepeat: () => void;
  toggleShuffle: () => void;
  playTrackAt: (index: number) => void;
  setPlaybackMode: (mode: PlaybackMode) => void;
};

export type ProviderSnapshot = {
  id: string;
  label: string;
  state: GingerState;
  actions: ProviderActions;
  audioSrc: string | null;
  registeredAt: number;
  updatedAt: number;
};

type RegistrationPayload = {
  label?: string;
  state: GingerState;
  actions: ProviderActions;
  audioSrc: string | null;
};

type UpdatePayload = {
  state: GingerState;
  audioSrc: string | null;
};

type Listener = (snapshots: Map<string, ProviderSnapshot>) => void;

export type DevtoolsRegistry = {
  register: (id: string, payload: RegistrationPayload) => void;
  unregister: (id: string) => void;
  update: (id: string, payload: UpdatePayload) => void;
  subscribe: (listener: Listener) => () => void;
  getAll: () => Map<string, ProviderSnapshot>;
};

const WINDOW_KEY = "__GINGER_DEVTOOLS__";

let counter = 0;

function buildRegistry(): DevtoolsRegistry {
  const providers = new Map<string, ProviderSnapshot>();
  const listeners = new Set<Listener>();

  const notify = () => {
    for (const fn of listeners) {
      fn(providers);
    }
  };

  return {
    register(id, payload) {
      counter += 1;
      const snapshot: ProviderSnapshot = {
        id,
        label: payload.label || `Player ${counter}`,
        state: payload.state,
        actions: payload.actions,
        audioSrc: payload.audioSrc,
        registeredAt: Date.now(),
        updatedAt: Date.now(),
      };
      providers.set(id, snapshot);
      notify();
    },

    unregister(id) {
      if (providers.delete(id)) {
        notify();
      }
    },

    update(id, payload) {
      const existing = providers.get(id);
      if (!existing) return;
      existing.state = payload.state;
      existing.audioSrc = payload.audioSrc;
      existing.updatedAt = Date.now();
      notify();
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getAll() {
      return providers;
    },
  };
}

export function getRegistry(): DevtoolsRegistry | null {
  if (typeof window === "undefined") return null;
  return (
    ((window as unknown as Record<string, unknown>)[WINDOW_KEY] as DevtoolsRegistry | null) ?? null
  );
}

export function ensureRegistry(): DevtoolsRegistry {
  if (typeof window === "undefined") {
    throw new Error("GingerDevtools requires a browser environment.");
  }
  const win = window as unknown as Record<string, unknown>;
  let reg = win[WINDOW_KEY] as DevtoolsRegistry | undefined;
  if (!reg) {
    reg = buildRegistry();
    win[WINDOW_KEY] = reg;
  }
  return reg;
}
