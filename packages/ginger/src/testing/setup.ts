import { beforeAll } from "vitest";

beforeAll(() => {
  if (typeof window === "undefined" || typeof window.HTMLMediaElement === "undefined") return;
  const noop = () => {};
  const noopPromise = () => Promise.resolve();
  window.HTMLMediaElement.prototype.load = noop;
  window.HTMLMediaElement.prototype.pause = noop;
  window.HTMLMediaElement.prototype.play = noopPromise;
});
