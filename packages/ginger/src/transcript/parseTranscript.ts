/**
 * A single timed transcript cue (SRT / WebVTT).
 */
export type TranscriptCue = {
  /** Start time in seconds. */
  startTime: number;
  /** End time in seconds. */
  endTime: number;
  text: string;
  /** Present for WebVTT cues that declare an identifier line. */
  id?: string;
};

function stripHtmlTags(text: string): string {
  return text.replace(/<[^>]+>/g, "").trim();
}

/** Parse `HH:MM:SS.mmm` / `HH:MM:SS,mmm` / `MM:SS.mmm` (WebVTT) to seconds. */
export function parseTimestampToSeconds(raw: string): number {
  const t = raw.trim().replace(",", ".");
  const segs = t.split(":");
  if (segs.length === 3) {
    const h = Number(segs[0]);
    const m = Number(segs[1]);
    const sec = Number(segs[2]);
    if (![h, m, sec].every(Number.isFinite)) return Number.NaN;
    return h * 3600 + m * 60 + sec;
  }
  if (segs.length === 2) {
    const m = Number(segs[0]);
    const sec = Number(segs[1]);
    if (![m, sec].every(Number.isFinite)) return Number.NaN;
    return m * 60 + sec;
  }
  return Number.NaN;
}

function parseTimingLine(line: string): { start: string; end: string } | null {
  const arrow = line.indexOf("-->");
  if (arrow < 0) return null;
  const start = line.slice(0, arrow).trim();
  const rest = line.slice(arrow + 3).trim();
  const endMatch = rest.match(/^(\S+)/);
  if (!endMatch) return null;
  return { start, end: endMatch[1]! };
}

/**
 * Parse SubRip (`.srt`) content into ordered cues.
 */
export function parseSrt(srt: string): TranscriptCue[] {
  const cues: TranscriptCue[] = [];
  const blocks = srt.replace(/\r\n/g, "\n").split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length === 0) continue;

    let i = 0;
    if (/^\d+$/.test(lines[0]!)) {
      i = 1;
    }
    const timingLine = lines[i];
    if (!timingLine) continue;
    const times = parseTimingLine(timingLine);
    if (!times) continue;
    const startTime = parseTimestampToSeconds(times.start);
    const endTime = parseTimestampToSeconds(times.end);
    if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) continue;
    const textLines = lines.slice(i + 1);
    const text = stripHtmlTags(textLines.join("\n"));
    if (!text) continue;
    cues.push({ startTime, endTime, text });
  }

  return cues.sort((a, b) => a.startTime - b.startTime);
}

/**
 * Parse WebVTT (`.vtt`) content into ordered cues. Ignores `NOTE` blocks and region/style headers.
 */
export function parseVtt(vtt: string): TranscriptCue[] {
  const cues: TranscriptCue[] = [];
  let body = vtt.replace(/\r\n/g, "\n");
  if (body.startsWith("WEBVTT")) {
    const firstBlank = body.search(/\n\s*\n/);
    body = firstBlank >= 0 ? body.slice(firstBlank).trim() : "";
  }

  const blocks = body.split(/\n\s*\n/);

  for (const block of blocks) {
    const rawLines = block.split("\n");
    const lines = rawLines.map((l) => l.trimEnd());
    if (lines.length === 0) continue;
    if (
      lines[0]!.startsWith("NOTE") ||
      lines[0]!.startsWith("STYLE") ||
      lines[0]!.startsWith("REGION")
    ) {
      continue;
    }

    let i = 0;
    let id: string | undefined;
    let timingLine = lines[i]!;
    if (!timingLine.includes("-->")) {
      id = lines[i]!;
      i += 1;
      timingLine = lines[i]!;
    }
    if (!timingLine?.includes("-->")) continue;

    const times = parseTimingLine(timingLine);
    if (!times) continue;
    const startTime = parseTimestampToSeconds(times.start);
    const endTime = parseTimestampToSeconds(times.end);
    if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) continue;

    const textLines = lines.slice(i + 1).filter((l) => l.trim().length > 0);
    const text = stripHtmlTags(textLines.join("\n"));
    if (!text) continue;
    cues.push({ startTime, endTime, text, ...(id ? { id } : {}) });
  }

  return cues.sort((a, b) => a.startTime - b.startTime);
}

/**
 * Auto-detect format: WebVTT if the string starts with `WEBVTT`, otherwise SRT.
 */
export function parseTranscriptAuto(input: string): TranscriptCue[] {
  const trimmed = input.trimStart();
  if (trimmed.startsWith("WEBVTT")) {
    return parseVtt(input);
  }
  return parseSrt(input);
}
