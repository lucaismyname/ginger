import { describe, expect, it, vi, afterEach } from "vitest";
import { cleanup, fireEvent, within } from "@testing-library/react";
import { renderGinger } from "../../testing";
import { PlayPause, Next, Previous, Shuffle, Mute, Repeat } from "./Controls";
import type { Track } from "../../types";

afterEach(cleanup);

const tracks: Track[] = [
  { id: "a", title: "Alpha", fileUrl: "/a.mp3" },
  { id: "b", title: "Beta", fileUrl: "/b.mp3" },
];

describe("PlayPause", () => {
  it("renders with default play label when paused", () => {
    const { container } = renderGinger(<PlayPause />, { tracks });
    const view = within(container);
    expect(view.getByRole("button", { name: "Play" })).toBeTruthy();
    expect(view.getByText("Play")).toBeTruthy();
  });

  it("calls consumer onClick alongside internal handler", () => {
    const spy = vi.fn();
    const { container } = renderGinger(<PlayPause onClick={spy} />, { tracks });
    fireEvent.click(within(container).getByRole("button"));
    expect(spy).toHaveBeenCalledOnce();
  });

  it("accepts custom play and pause labels", () => {
    const { container } = renderGinger(<PlayPause playLabel="Go" pauseLabel="Stop" />, { tracks });
    expect(within(container).getByText("Go")).toBeTruthy();
  });
});

describe("Next", () => {
  it("renders with default children", () => {
    const { container } = renderGinger(<Next />, { tracks });
    expect(within(container).getByText("Next")).toBeTruthy();
  });

  it("calls consumer onClick alongside internal handler", () => {
    const spy = vi.fn();
    const { container } = renderGinger(<Next onClick={spy} />, { tracks });
    fireEvent.click(within(container).getByRole("button"));
    expect(spy).toHaveBeenCalledOnce();
  });
});

describe("Previous", () => {
  it("renders with default children", () => {
    const { container } = renderGinger(<Previous />, { tracks });
    expect(within(container).getByText("Previous")).toBeTruthy();
  });

  it("calls consumer onClick alongside internal handler", () => {
    const spy = vi.fn();
    const { container } = renderGinger(<Previous onClick={spy} />, { tracks });
    fireEvent.click(within(container).getByRole("button"));
    expect(spy).toHaveBeenCalledOnce();
  });
});

describe("Shuffle", () => {
  it("renders with aria-pressed", () => {
    const { container } = renderGinger(<Shuffle />, { tracks });
    const btn = within(container).getByRole("button", { name: "Shuffle" });
    expect(btn.getAttribute("aria-pressed")).toBe("false");
  });

  it("calls consumer onClick alongside internal handler", () => {
    const spy = vi.fn();
    const { container } = renderGinger(<Shuffle onClick={spy} />, { tracks });
    fireEvent.click(within(container).getByRole("button"));
    expect(spy).toHaveBeenCalledOnce();
  });
});

describe("Repeat", () => {
  it("renders with repeat mode label", () => {
    const { container } = renderGinger(<Repeat />, { tracks });
    expect(within(container).getByRole("button")).toBeTruthy();
  });

  it("calls consumer onClick alongside internal handler", () => {
    const spy = vi.fn();
    const { container } = renderGinger(<Repeat onClick={spy} />, { tracks });
    fireEvent.click(within(container).getByRole("button"));
    expect(spy).toHaveBeenCalledOnce();
  });
});

describe("Mute", () => {
  it("renders with aria-pressed false by default", () => {
    const { container } = renderGinger(<Mute />, { tracks });
    const btn = within(container).getByRole("button");
    expect(btn.getAttribute("aria-pressed")).toBe("false");
  });

  it("calls consumer onClick alongside internal handler", () => {
    const spy = vi.fn();
    const { container } = renderGinger(<Mute onClick={spy} />, { tracks });
    fireEvent.click(within(container).getByRole("button"));
    expect(spy).toHaveBeenCalledOnce();
  });
});
