import { act, cleanup, fireEvent, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { renderGinger } from "../../testing";
import type { Track } from "../../types";
import { Chapters } from "./Chapters";
import { LyricsSynced } from "./LyricsSynced";

afterEach(cleanup);

const trackWithChapters: Track = {
  id: "c1",
  title: "Chapter song",
  fileUrl: "/c.mp3",
  chapters: [
    { title: "Intro", startSeconds: 0 },
    { title: "Verse", startSeconds: 30 },
  ],
};

const trackWithLyrics: Track = {
  id: "l1",
  title: "Lyrics song",
  fileUrl: "/l.mp3",
  lyricsTimed: [
    { time: 0, text: "A" },
    { time: 5, text: "B" },
  ],
};

describe("Chapters", () => {
  it("renders chapter titles and seeks on click", async () => {
    const { container } = renderGinger(<Chapters />, { tracks: [trackWithChapters] });
    expect(within(container).getByText("Verse")).toBeTruthy();
    const audio = container.querySelector("audio");
    await act(async () => {
      fireEvent.loadedMetadata(audio!);
    });
    await act(async () => {
      fireEvent.click(within(container).getByRole("button", { name: /Verse/i }));
    });
    expect(audio?.currentTime).toBe(30);
  });
});

describe("LyricsSynced", () => {
  it("renders timed lines and marks the active line", async () => {
    renderGinger(<LyricsSynced />, { tracks: [trackWithLyrics] });
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]?.getAttribute("aria-current")).toBe("true");
    expect(items[1]?.getAttribute("aria-current")).toBeNull();
  });
});
