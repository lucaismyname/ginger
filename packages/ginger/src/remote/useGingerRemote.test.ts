import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { type ReactNode, createElement, Fragment } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Ginger } from "../ginger";
import { useGingerRemote } from "./useGingerRemote";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const registry = new Map<string, Set<MockBroadcastChannel>>();

class MockBroadcastChannel {
  name: string;
  private listener: ((ev: MessageEvent) => void) | null = null;

  constructor(name: string) {
    this.name = name;
    let set = registry.get(name);
    if (!set) {
      set = new Set();
      registry.set(name, set);
    }
    set.add(this);
  }

  postMessage(data: unknown): void {
    const set = registry.get(this.name);
    if (!set) return;
    for (const peer of set) {
      if (peer !== this) {
        queueMicrotask(() => peer.listener?.({ data: data } as MessageEvent));
      }
    }
  }

  addEventListener(type: string, listener: EventListener): void {
    if (type === "message") {
      this.listener = listener as (ev: MessageEvent) => void;
    }
  }

  removeEventListener(): void {
    this.listener = null;
  }

  close(): void {
    registry.get(this.name)?.delete(this);
  }
}

function wrapper({ children }: { children: ReactNode }) {
  return createElement(Ginger.Provider, {
    initialTracks: [{ title: "A", fileUrl: "/a.mp3" }],
    children: createElement(Fragment, null, createElement(Ginger.Player, null), children),
  });
}

describe("useGingerRemote", () => {
  beforeEach(() => {
    registry.clear();
    vi.stubGlobal("BroadcastChannel", MockBroadcastChannel);
  });

  it("sets an error when BroadcastChannel is unavailable", () => {
    vi.unstubAllGlobals();
    vi.stubGlobal("BroadcastChannel", undefined);

    const { result } = renderHook(() => useGingerRemote(), { wrapper });

    expect(result.current.error).toBe("BroadcastChannel is not available in this environment");
    expect(result.current.isPending).toBe(true);
  });

  it("elects a single tab as leader after the election timeout", () => {
    vi.useFakeTimers();

    const { result } = renderHook(
      () => useGingerRemote({ electionTimeoutMs: 300, heartbeatMs: 10_000 }),
      { wrapper },
    );

    expect(result.current.isPending).toBe(true);

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current.isLeader).toBe(true);
    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("connects two tabs on the same channel so the second becomes a follower", async () => {
    vi.spyOn(crypto, "randomUUID")
      .mockReturnValueOnce("ffffffff-ffff-4fff-bfff-ffffffffffff")
      .mockReturnValueOnce("00000000-0000-4000-8000-000000000001");

    const { result: first } = renderHook(
      () =>
        useGingerRemote({ channelName: "t-remote", electionTimeoutMs: 300, heartbeatMs: 10_000 }),
      { wrapper },
    );

    await waitFor(() => expect(first.current.isLeader).toBe(true));

    const { result: second } = renderHook(
      () =>
        useGingerRemote({ channelName: "t-remote", electionTimeoutMs: 300, heartbeatMs: 10_000 }),
      { wrapper },
    );

    await waitFor(() => expect(second.current.isFollower).toBe(true));

    expect(second.current.isLeader).toBe(false);
  });
});
