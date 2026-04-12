import { describe, expect, it } from "vitest";
import {
  parseSrt,
  parseTimestampToSeconds,
  parseTranscriptAuto,
  parseVtt,
} from "./parseTranscript";

describe("parseTimestampToSeconds", () => {
  it("parses SRT-style timestamps", () => {
    expect(parseTimestampToSeconds("01:02:03,456")).toBeCloseTo(3723.456, 5);
  });

  it("parses VTT-style timestamps", () => {
    expect(parseTimestampToSeconds("01:02:03.456")).toBeCloseTo(3723.456, 5);
  });

  it("parses MM:SS.mmm (WebVTT short form)", () => {
    expect(parseTimestampToSeconds("02:03.456")).toBeCloseTo(123.456, 5);
  });
});

describe("parseSrt", () => {
  it("parses a minimal SRT file", () => {
    const srt = `1
00:00:01,000 --> 00:00:04,000
Hello world

2
00:00:05,500 --> 00:00:08,000
Second cue
`;
    const cues = parseSrt(srt);
    expect(cues).toHaveLength(2);
    expect(cues[0]).toMatchObject({
      startTime: 1,
      endTime: 4,
      text: "Hello world",
    });
    expect(cues[1]).toMatchObject({
      startTime: 5.5,
      endTime: 8,
      text: "Second cue",
    });
  });

  it("returns empty array for empty input", () => {
    expect(parseSrt("")).toEqual([]);
  });

  it("skips malformed timestamp blocks", () => {
    const srt = `1
not a timing line
oops
`;
    expect(parseSrt(srt)).toEqual([]);
  });
});

describe("parseVtt", () => {
  it("parses WEBVTT with cues", () => {
    const vtt = `WEBVTT

00:00:01.000 --> 00:00:04.000
Hello <b>VTT</b>

cue-2
00:00:05.500 --> 00:00:08.000
Second line
`;
    const cues = parseVtt(vtt);
    expect(cues).toHaveLength(2);
    expect(cues[0]).toMatchObject({
      startTime: 1,
      endTime: 4,
      text: "Hello VTT",
    });
    expect(cues[1]).toMatchObject({
      id: "cue-2",
      startTime: 5.5,
      endTime: 8,
      text: "Second line",
    });
  });

  it("strips HTML tags from cue text", () => {
    const vtt = `WEBVTT

00:00:00.000 --> 00:00:01.000
<c.red>Colored</c> <i>italic</i>
`;
    const cues = parseVtt(vtt);
    expect(cues[0]!.text).toBe("Colored italic");
  });

  it("parses timing with cue settings after end time", () => {
    const vtt = `WEBVTT

00:00:01.000 --> 00:00:04.000 line:90% position:50%
Settings cue
`;
    const cues = parseVtt(vtt);
    expect(cues).toHaveLength(1);
    expect(cues[0]!.text).toBe("Settings cue");
  });
});

describe("parseTranscriptAuto", () => {
  it("chooses VTT when header is present", () => {
    const vtt = `WEBVTT

00:00:00.000 --> 00:00:01.000
A
`;
    expect(parseTranscriptAuto(vtt)).toHaveLength(1);
  });

  it("chooses SRT otherwise", () => {
    const srt = `1
00:00:01,000 --> 00:00:04,000
SRT only
`;
    const cues = parseTranscriptAuto(srt);
    expect(cues).toHaveLength(1);
    expect(cues[0]!.text).toBe("SRT only");
  });
});
