import type { WindowWithCast } from "./castTypes";

const CAST_SCRIPT_SRC =
  "https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";

let loadPromise: Promise<void> | null = null;

function getWindow(): WindowWithCast | undefined {
  if (typeof window === "undefined") return undefined;
  return window as WindowWithCast;
}

/**
 * Loads the Google Cast Web Sender script (Cast Application Framework) once.
 * Resolves when `window.cast.framework` is available. Safe to call multiple times.
 *
 * In SSR environments (no `window`), rejects with an error.
 */
export function loadCastFramework(): Promise<void> {
  const win = getWindow();
  if (!win) {
    return Promise.reject(new Error("Cast is only available in a browser environment."));
  }

  if (win.cast?.framework?.CastContext) {
    return Promise.resolve();
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${CAST_SCRIPT_SRC}"]`);
    if (existing) {
      const onLoad = () => {
        if (win.cast?.framework?.CastContext) {
          resolve();
        } else {
          reject(new Error("Cast script loaded but cast.framework is missing."));
        }
      };
      if ((existing as HTMLScriptElement).dataset.gingerCastLoaded === "true") {
        onLoad();
        return;
      }
      existing.addEventListener("load", onLoad, { once: true });
      existing.addEventListener("error", () => reject(new Error("Cast script failed to load.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = CAST_SCRIPT_SRC;
    script.async = true;
    script.addEventListener("load", () => {
      script.dataset.gingerCastLoaded = "true";
      if (win.cast?.framework?.CastContext) {
        resolve();
      } else {
        reject(new Error("Cast script loaded but cast.framework is missing."));
      }
    });
    script.addEventListener("error", () => {
      reject(new Error("Cast script failed to load."));
    });
    document.head.appendChild(script);
  });

  return loadPromise;
}
