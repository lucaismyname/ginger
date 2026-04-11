// @vitest-environment jsdom
import { describe, expect, it, vi, afterEach } from "vitest";
import { render, cleanup, fireEvent, act, within } from "@testing-library/react";
import { Ginger } from "../ginger";
import { PlayPause, Next, Previous } from "../components/controls/Controls";
import { Title, Artist } from "../components/current/texts";
import type { Track } from "../types";

afterEach(cleanup);

const tracks: Track[] = [
  { id: "one", title: "Song One", artist: "Artist A", fileUrl: "/one.mp3" },
  { id: "two", title: "Song Two", artist: "Artist B", fileUrl: "/two.mp3" },
  { id: "three", title: "Song Three", artist: "Artist C", fileUrl: "/three.mp3" },
];

function TestPlayer({ onTrackChange }: { onTrackChange?: (track: Track | null, index: number) => void }) {
  return (
    <Ginger.Provider initialTracks={tracks} onTrackChange={onTrackChange}>
      <Ginger.Player />
      <Title />
      <Artist />
      <PlayPause />
      <Next />
      <Previous />
    </Ginger.Provider>
  );
}

describe("GingerProvider integration", () => {
  it("renders the first track metadata", () => {
    const { container } = render(<TestPlayer />);
    const view = within(container);
    expect(view.getByText("Song One")).toBeTruthy();
    expect(view.getByText("Artist A")).toBeTruthy();
  });

  it("navigates to next track on Next click", async () => {
    const { container } = render(<TestPlayer />);
    const view = within(container);
    await act(() => {
      fireEvent.click(view.getByText("Next"));
    });
    expect(view.getByText("Song Two")).toBeTruthy();
  });

  it("navigates to previous track after going next", async () => {
    const { container } = render(<TestPlayer />);
    const view = within(container);
    await act(() => {
      fireEvent.click(view.getByText("Next"));
    });
    expect(view.getByText("Song Two")).toBeTruthy();
    await act(() => {
      fireEvent.click(view.getByText("Previous"));
    });
    expect(view.getByText("Song One")).toBeTruthy();
  });

  it("renders with no tracks without crashing", () => {
    const { container } = render(
      <Ginger.Provider initialTracks={[]}>
        <Ginger.Player />
        <Title fallback="Nothing playing" />
        <PlayPause />
      </Ginger.Provider>,
    );
    expect(within(container).getByText("Nothing playing")).toBeTruthy();
  });

  it("applies unstyled mode without default CSS variables", () => {
    const { container } = render(
      <Ginger.Provider initialTracks={tracks} unstyled>
        <Ginger.Player />
        <Title />
      </Ginger.Provider>,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.getPropertyValue("--ginger-primary-color")).toBe("");
  });

  it("sets data-ginger-playback attribute", () => {
    const { container } = render(
      <Ginger.Provider initialTracks={tracks}>
        <Ginger.Player />
      </Ginger.Provider>,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.getAttribute("data-ginger-playback")).toBeTruthy();
  });
});
