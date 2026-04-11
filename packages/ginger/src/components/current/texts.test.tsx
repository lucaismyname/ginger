import { cleanup, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { renderGinger } from "../../testing";
import type { Track } from "../../types";
import { Album, Artist, Description, Genre, Title, TrackNumber } from "./texts";

afterEach(cleanup);

const track: Track = {
  id: "t1",
  title: "My Song",
  artist: "My Artist",
  album: "My Album",
  description: "A great track",
  genre: "Indie",
  trackNumber: 3,
  fileUrl: "/my-song.mp3",
};

describe("Title", () => {
  it("renders the current track title", () => {
    const { container } = renderGinger(<Title />, { tracks: [track] });
    expect(within(container).getByText("My Song")).toBeTruthy();
  });

  it("renders nothing when no tracks", () => {
    const { container } = renderGinger(<Title />);
    const spans = container.querySelectorAll("span");
    const titleSpan = Array.from(spans).find((s) => s.textContent === "My Song");
    expect(titleSpan).toBeUndefined();
  });

  it("renders fallback when no tracks", () => {
    const { container } = renderGinger(<Title fallback="No track" />);
    expect(within(container).getByText("No track")).toBeTruthy();
  });

  it("supports render-prop children", () => {
    const { container } = renderGinger(<Title>{(v) => <strong>{v.toUpperCase()}</strong>}</Title>, {
      tracks: [track],
    });
    expect(within(container).getByText("MY SONG")).toBeTruthy();
  });
});

describe("Artist", () => {
  it("renders the current track artist", () => {
    const { container } = renderGinger(<Artist />, { tracks: [track] });
    expect(within(container).getByText("My Artist")).toBeTruthy();
  });
});

describe("Album", () => {
  it("renders the album from the track", () => {
    const { container } = renderGinger(<Album />, { tracks: [track] });
    expect(within(container).getByText("My Album")).toBeTruthy();
  });
});

describe("Description", () => {
  it("renders the track description", () => {
    const { container } = renderGinger(<Description />, { tracks: [track] });
    expect(within(container).getByText("A great track")).toBeTruthy();
  });
});

describe("Genre", () => {
  it("renders the track genre", () => {
    const { container } = renderGinger(<Genre />, { tracks: [track] });
    expect(within(container).getByText("Indie")).toBeTruthy();
  });
});

describe("TrackNumber", () => {
  it("renders the track number as a string", () => {
    const { container } = renderGinger(<TrackNumber />, { tracks: [track] });
    expect(within(container).getByText("3")).toBeTruthy();
  });
});
