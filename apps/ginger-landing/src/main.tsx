import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/700.css";
import "@fontsource-variable/pixelify-sans";

import "./index.css";
import { App } from "./App";

if (import.meta.env.DEV) {
  void import("react-scan").then(({ scan }) => {
    scan({
      enabled: true,
      showToolbar: true,
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
