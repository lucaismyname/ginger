import { act, cleanup, fireEvent, renderHook, screen } from "@testing-library/react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Ginger } from "../ginger";
import { queryAudio, renderGinger } from "../testing";
import type { Track } from "../types";
import { usePlayPauseBinding, useSeekBarBinding, useVolumeSlider } from "./useControlBindings";
import { useGinger } from "./useGinger";
import { useGingerChapters } from "./useGingerChapters";
import { useGingerLyricsSync } from "./useGingerLyricsSync";
import { useNextTrackPrefetch } from "./useNextTrackPrefetch";
import { useSeekDrag } from "./useSeekDrag";

afterEach(cleanup);

const tracks: Track[] = [{ id: "a", title: "A", fileUrl: "/a.mp3" }];

const tracksChapters: Track[] = [
  {
    id: "c",
    title: "Chapter track",
    fileUrl: "/c.mp3",
    chapters: [
      { title: "Intro", startSeconds: 0 },
      { title: "Main", startSeconds: 60 },
    ],
  },
];

const tracksLyrics: Track[] = [
  {
    id: "l",
    title: "Lyrics track",
    fileUrl: "/l.mp3",
    lyricsTimed: [
      { time: 0, text: "Line0" },
      { time: 10, text: "Line1" },
    ],
  },
];

const tracksTwo: Track[] = [
  { id: "x", title: "X", fileUrl: "/x.mp3" },
  { id: "y", title: "Y", fileUrl: "/y.mp3" },
];

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <Ginger.Provider initialTracks={tracks}>
      <Ginger.Player />
      {children}
    </Ginger.Provider>
  );
}

describe("useSeekDrag", () => {
  it("seeks proportionally on pointer down", () => {
    const { result } = renderHook(() => useSeekDrag(100), {
      wrapper: Provider,
    });
    const div = document.createElement("div");
    div.getBoundingClientRect = () =>
      ({
        width: 100,
        height: 10,
        top: 0,
        left: 0,
        right: 100,
        bottom: 10,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;
    div.setPointerCapture = () => {};
    div.releasePointerCapture = () => {};

    act(() => {
      result.current.onPointerDown({
        currentTarget: div,
        clientX: 50,
        pointerId: 1,
        preventDefault: () => {},
      } as unknown as ReactPointerEvent<HTMLElement>);
    });

    const audio = document.querySelector("audio");
    expect(audio?.currentTime).toBe(50);
  });
});

function ChapterProbe() {
  const c = useGingerChapters();
  const { dispatch } = useGinger();
  return (
    <div>
      <span data-testid="chapter">{c.active?.title ?? "none"}</span>
      <button
        type="button"
        onClick={() =>
          dispatch({
            type: "MEDIA_TIME_UPDATE",
            payload: { currentTime: 65, duration: 200, bufferedFraction: 0 },
          })
        }
      >
        bump-time
      </button>
    </div>
  );
}

describe("useGingerChapters", () => {
  it("selects the active chapter from currentTime", async () => {
    renderGinger(<ChapterProbe />, { tracks: tracksChapters });
    expect(screen.getByTestId("chapter").textContent).toBe("Intro");
    await act(async () => {
      fireEvent.click(screen.getByText("bump-time"));
    });
    expect(screen.getByTestId("chapter").textContent).toBe("Main");
  });
});

function LyricsProbe() {
  const l = useGingerLyricsSync();
  const { dispatch } = useGinger();
  return (
    <div>
      <span data-testid="lyric">{l.activeLine?.text ?? "none"}</span>
      <button
        type="button"
        onClick={() =>
          dispatch({
            type: "MEDIA_TIME_UPDATE",
            payload: { currentTime: 11, duration: 200, bufferedFraction: 0 },
          })
        }
      >
        bump-lyrics
      </button>
    </div>
  );
}

describe("useGingerLyricsSync", () => {
  it("selects the active timed line", async () => {
    renderGinger(<LyricsProbe />, { tracks: tracksLyrics });
    expect(screen.getByTestId("lyric").textContent).toBe("Line0");
    await act(async () => {
      fireEvent.click(screen.getByText("bump-lyrics"));
    });
    expect(screen.getByTestId("lyric").textContent).toBe("Line1");
  });
});

function PrefetchProbe() {
  useNextTrackPrefetch();
  return null;
}

describe("useNextTrackPrefetch", () => {
  it("creates a detached audio element for the next track", () => {
    const spy = vi.spyOn(document, "createElement");
    renderGinger(
      <>
        <Ginger.Player />
        <PrefetchProbe />
      </>,
      { tracks: tracksTwo },
    );
    const audioCreates = spy.mock.calls.filter((c) => c[0] === "audio");
    expect(audioCreates.length).toBeGreaterThanOrEqual(2);
    spy.mockRestore();
  });
});

function SeekBarProbe() {
  const b = useSeekBarBinding();
  return (
    <span data-testid="seekbar">
      {b.min}-{b.max}-{b.ariaLabel}
    </span>
  );
}

function VolumeProbe() {
  const b = useVolumeSlider();
  return (
    <span data-testid="vol">
      {b.value}-{b.ariaValueText}
    </span>
  );
}

function PlayPauseProbe() {
  const b = usePlayPauseBinding({ playAriaLabel: "Go", pauseAriaLabel: "Stop" });
  return (
    <button type="button" aria-label={b.ariaLabel} onClick={b.toggle}>
      toggle
    </button>
  );
}

describe("useControlBindings", () => {
  it("useSeekBarBinding exposes range and label from locale after metadata loads", async () => {
    const { container } = renderGinger(<SeekBarProbe />, { tracks });
    const audio = queryAudio(container)!;
    await act(async () => {
      fireEvent.loadedMetadata(audio);
    });
    const text = screen.getByTestId("seekbar").textContent ?? "";
    expect(text.startsWith("0-1-")).toBe(true);
    expect(text).toContain("Seek");
  });

  it("useVolumeSlider reflects volume", () => {
    renderGinger(<VolumeProbe />, { tracks });
    const t = screen.getByTestId("vol").textContent ?? "";
    expect(t).toMatch(/^1-/);
    expect(t).toContain("100%");
  });

  it("usePlayPauseBinding toggles aria label with pause state", async () => {
    renderGinger(<PlayPauseProbe />, { tracks, initialPaused: true });
    const btn = screen.getByRole("button", { name: "Go" });
    await act(async () => {
      fireEvent.click(btn);
    });
    expect(screen.getByRole("button", { name: "Stop" })).toBeTruthy();
  });
});
