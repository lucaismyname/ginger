import { describe, expect, it } from "vitest";

describe("testing entrypoint", () => {
  it("exports the core helpers", async () => {
    const mod = await import("./index");
    expect(mod.renderGinger).toBeTypeOf("function");
    expect(mod.queryAudio).toBeTypeOf("function");
    expect(mod.installNavigatorMediaSession).toBeTypeOf("function");
  });
});
