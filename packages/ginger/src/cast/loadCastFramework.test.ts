import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CastFrameworkNamespace, WindowWithCast } from "./castTypes";
import { loadCastFramework } from "./loadCastFramework";

describe("loadCastFramework", () => {
  const originalAppend = document.head.appendChild.bind(document.head);

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    for (const s of document.querySelectorAll("script[src*='cast_sender.js']")) {
      s.remove();
    }
  });

  it("rejects when window is undefined (SSR)", async () => {
    const w = globalThis.window;
    // @ts-expect-error simulate SSR
    globalThis.window = undefined;
    await expect(loadCastFramework()).rejects.toThrow(/browser/);
    globalThis.window = w;
  });

  it("resolves immediately when cast.framework is already present", async () => {
    const win = window as WindowWithCast;
    const framework: CastFrameworkNamespace = {
      CastContext: {
        getInstance: () => ({
          setOptions: () => {},
          getCastState: () => 0,
          getCurrentSession: () => null,
          addEventListener: () => {},
          removeEventListener: () => {},
          requestSession: async () => {},
        }),
      },
      CastContextEventType: { CAST_STATE_CHANGED: "x", SESSION_STATE_CHANGED: "y" },
      CastState: { NO_DEVICES: 0, NOT_CONNECTED: 1, CONNECTING: 2, CONNECTED: 3 },
      SessionState: {
        SESSION_STARTED: "s",
        SESSION_ENDED: "e",
        SESSION_RESUMED: "r",
      },
      RemotePlayer: class RemotePlayer {
        isPaused = true;
        currentTime = 0;
        duration = 0;
        addEventListener = () => {};
        removeEventListener = () => {};
      },
      RemotePlayerController: class RemotePlayerController {
        playOrPause = () => {};
        seek = () => {};
        stop = () => {};
      },
      RemotePlayerEventType: {
        IS_PAUSED_CHANGED: "p",
        CURRENT_TIME_CHANGED: "t",
        DURATION_CHANGED: "d",
      },
    };
    win.cast = { framework };

    await expect(loadCastFramework()).resolves.toBeUndefined();

    win.cast = undefined;
  });

  it("injects the script only once and resolves parallel callers after CAF is ready", async () => {
    const appendSpy = vi.spyOn(document.head, "appendChild").mockImplementation((node) => {
      return originalAppend(node);
    });

    const p1 = loadCastFramework();
    const p2 = loadCastFramework();

    const castScripts = appendSpy.mock.calls.filter(
      (c) =>
        c[0] instanceof HTMLScriptElement &&
        (c[0] as HTMLScriptElement).src.includes("cast_sender"),
    );
    expect(castScripts.length).toBe(1);

    const script = castScripts[0][0] as HTMLScriptElement;
    const win = window as WindowWithCast;
    const CastContext = {
      getInstance: () => ({
        setOptions: () => {},
        getCastState: () => 0,
        getCurrentSession: () => null,
        addEventListener: () => {},
        removeEventListener: () => {},
        requestSession: async () => {},
      }),
    };
    win.cast = {
      framework: {
        CastContext,
      },
    } as unknown as WindowWithCast["cast"];
    script.dispatchEvent(new Event("load"));

    await expect(Promise.all([p1, p2])).resolves.toEqual([undefined, undefined]);
    appendSpy.mockRestore();
    win.cast = undefined;
  });
});
