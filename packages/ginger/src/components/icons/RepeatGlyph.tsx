/**
 * Path data from lucide-static (ISC, Lucide Icons). `off` uses the repeat glyph plus a strike line
 * (Lucide does not ship a dedicated repeat-off asset in lucide-static).
 */
import type { RepeatMode } from "../../types";
import { Wrapper } from "./Wrapper";

function RepeatAllPaths() {
  return (
    <>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </>
  );
}

export function RepeatGlyph({ mode }: { mode: RepeatMode }) {
  if (mode === "one") {
    return (
      <Wrapper>
        <RepeatAllPaths />
        <path data-ginger-component="RepeatGlyph" d="M11 10h1v4" />
      </Wrapper>
    );
  }
  if (mode === "all") {
    return (
      <Wrapper>
        <RepeatAllPaths />
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <RepeatAllPaths />
      <line data-ginger-component="RepeatGlyph" x1="3" x2="21" y1="3" y2="21" />
    </Wrapper>
  );
}
