import { beforeAll } from "vitest";

beforeAll(() => {
  if (typeof globalThis.MediaMetadata === "undefined") {
    globalThis.MediaMetadata = class MediaMetadata {
      title?: string;
      artist?: string;
      album?: string;
      artwork?: Array<{ src: string }>;
      constructor(init?: MediaMetadataInit) {
        if (init) Object.assign(this, init);
      }
    } as unknown as typeof MediaMetadata;
  }

  if (typeof window === "undefined" || typeof window.HTMLMediaElement === "undefined") return;
  const noop = () => {};
  const noopPromise = () => Promise.resolve();
  window.HTMLMediaElement.prototype.load = noop;
  window.HTMLMediaElement.prototype.pause = noop;
  window.HTMLMediaElement.prototype.play = noopPromise;
});
