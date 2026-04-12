import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useGinger } from "../hooks/useGinger";
import { renderGinger } from "../testing";
import type { TranscriptCue } from "./parseTranscript";
import { useGingerTranscriptSync } from "./useGingerTranscriptSync";

const cueSet: TranscriptCue[] = [
  { startTime: 5, endTime: 7, text: "Later" },
  { startTime: 0, endTime: 6, text: "Intro overlap" },
  { startTime: -1, endTime: 2, text: "Invalid negative" },
  { startTime: 8, endTime: 6, text: "Invalid range" },
];

function CueProbe() {
  const { dispatch } = useGinger();
  const { cues, activeCue, activeCues, activeIndex } = useGingerTranscriptSync({
    transcript: cueSet,
  });

  return (
    <div>
      <span data-testid="cue-count">{String(cues.length)}</span>
      <span data-testid="active-index">{String(activeIndex)}</span>
      <span data-testid="active-cue">{activeCue?.text ?? "none"}</span>
      <span data-testid="active-cues">{activeCues.map((c) => c.text).join("|")}</span>
      <button
        type="button"
        onClick={() =>
          dispatch({
            type: "MEDIA_TIME_UPDATE",
            payload: { currentTime: 5.5, duration: 200, bufferedFraction: 0 },
          })
        }
      >
        seek
      </button>
    </div>
  );
}

function VttProbe() {
  const { dispatch } = useGinger();
  const { activeCue } = useGingerTranscriptSync({
    transcript: `WEBVTT

00:00:01.000 --> 00:00:03.000
First line

00:00:03.500 --> 00:00:05.000
Second line`,
    format: "auto",
  });

  return (
    <div>
      <span data-testid="vtt-active">{activeCue?.text ?? "none"}</span>
      <button
        type="button"
        onClick={() =>
          dispatch({
            type: "MEDIA_TIME_UPDATE",
            payload: { currentTime: 3.6, duration: 200, bufferedFraction: 0 },
          })
        }
      >
        jump
      </button>
    </div>
  );
}

describe("useGingerTranscriptSync", () => {
  it("filters/sorts cues and returns overlapping active cues", async () => {
    renderGinger(<CueProbe />);

    expect(screen.getByTestId("cue-count").textContent).toBe("2");
    expect(screen.getByTestId("active-index").textContent).toBe("0");
    expect(screen.getByTestId("active-cue").textContent).toBe("Intro overlap");
    expect(screen.getByTestId("active-cues").textContent).toBe("Intro overlap");

    await act(async () => {
      fireEvent.click(screen.getByText("seek"));
    });

    expect(screen.getByTestId("active-index").textContent).toBe("1");
    expect(screen.getByTestId("active-cue").textContent).toBe("Later");
    expect(screen.getByTestId("active-cues").textContent).toBe("Intro overlap|Later");
  });

  it("parses VTT text when format is auto", async () => {
    renderGinger(<VttProbe />);
    expect(screen.getByTestId("vtt-active").textContent).toBe("none");

    await act(async () => {
      fireEvent.click(screen.getByText("jump"));
    });
    expect(screen.getByTestId("vtt-active").textContent).toBe("Second line");
  });
});
