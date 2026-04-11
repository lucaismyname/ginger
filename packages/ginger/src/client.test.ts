import { describe, expect, it } from "vitest";

describe("client entrypoint", () => {
  it("re-exports public API in a client-safe module", async () => {
    const mod = await import("./client");
    expect(mod.Ginger).toBeTruthy();
    expect(mod.useGinger).toBeTypeOf("function");
  });
});
