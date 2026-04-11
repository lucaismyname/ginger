export type TimedLyricLine = {
  time: number;
  text: string;
};

const lrcTag = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g;

export function parseLrc(lrc: string): TimedLyricLine[] {
  const lines: TimedLyricLine[] = [];
  for (const rawLine of lrc.split(/\r?\n/)) {
    const matches = [...rawLine.matchAll(lrcTag)];
    if (matches.length === 0) continue;
    const text = rawLine.replace(lrcTag, "").trim();
    for (const m of matches) {
      const minutes = Number(m[1] ?? 0);
      const seconds = Number(m[2] ?? 0);
      const millis = Number((m[3] ?? "0").padEnd(3, "0"));
      const time = minutes * 60 + seconds + millis / 1000;
      if (Number.isFinite(time) && time >= 0) {
        lines.push({ time, text });
      }
    }
  }
  return lines.sort((a, b) => a.time - b.time);
}
