import { act, cleanup, fireEvent, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ErrorMessage } from "../components/current/Playback";
import { Title } from "../components/current/texts";
import { useGinger } from "../hooks/useGinger";
import { queryAudio, renderGinger } from "../testing";
import type { Track } from "../types";

afterEach(cleanup);

const tracks: Track[] = [
  { id: "a", title: "Alpha", fileUrl: "/a.mp3" },
  { id: "b", title: "Beta", fileUrl: "/b.mp3" },
];

function ClearQueueButton() {
  const { setQueue } = useGinger();
  return (
    <button type="button" onClick={() => setQueue([])}>
      clear-queue
    </button>
  );
}

function PlaybackRateAndNextButtons() {
  const { next, setPlaybackRate } = useGinger();
  return (
    <>
      <button type="button" onClick={() => setPlaybackRate(0.5)}>
        speed-0.5
      </button>
      <button type="button" onClick={() => next()}>
        next-track
      </button>
    </>
  );
}

describe("GingerPlayer + provider", () => {
  it("advances to the next track when the audio element fires ended", async () => {
    const { container } = renderGinger(<Title />, { tracks });
    const audio = queryAudio(container);
    expect(audio).toBeTruthy();
    await act(async () => {
      fireEvent.ended(audio!);
    });
    expect(within(container).getByText("Beta")).toBeTruthy();
  });

  it("invokes onError when the audio element fires error", async () => {
    const onError = vi.fn();
    const { container } = renderGinger(<ErrorMessage />, { tracks, onError });
    const audio = queryAudio(container)!;
    Object.defineProperty(audio, "error", { value: { code: 4 }, configurable: true });
    await act(async () => {
      fireEvent.error(audio);
    });
    expect(onError).toHaveBeenCalled();
    expect(within(container).getByText("MEDIA_ERR_SRC_NOT_SUPPORTED")).toBeTruthy();
  });

  it("sets data-ginger-playback to idle after clearing an active queue", async () => {
    const { container } = renderGinger(<ClearQueueButton />, { tracks });
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute("data-ginger-playback")).toBe("paused");

    await act(async () => {
      fireEvent.click(within(container).getByText("clear-queue"));
    });

    expect(root.getAttribute("data-ginger-playback")).toBe("idle");
  });

  it("re-applies playbackRate after next track source load", async () => {
    const loadSpy = vi
      .spyOn(window.HTMLMediaElement.prototype, "load")
      .mockImplementation(function mockLoad(this: HTMLMediaElement) {
        this.playbackRate = 1;
      });

    try {
      const { container } = renderGinger(<PlaybackRateAndNextButtons />, { tracks });
      const audio = queryAudio(container)!;

      await act(async () => {
        fireEvent.click(within(container).getByText("speed-0.5"));
      });
      expect(audio.playbackRate).toBe(0.5);

      await act(async () => {
        fireEvent.click(within(container).getByText("next-track"));
      });
      expect(audio.playbackRate).toBe(0.5);
    } finally {
      loadSpy.mockRestore();
    }
  });
});
