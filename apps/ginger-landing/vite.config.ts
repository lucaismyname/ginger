import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  const defaultSiteUrl = "https://github.com/lucaismyname/ginger";
  const defaultOgImageRaw =
    "https://raw.githubusercontent.com/lucaismyname/ginger/main/apps/ginger-landing/public/og.jpg";
  const siteUrl = (env.VITE_SITE_URL || defaultSiteUrl).replace(/\/$/, "");
  const ogImageUrl =
    (env.VITE_OG_IMAGE_URL || "").trim() ||
    (siteUrl === defaultSiteUrl ? defaultOgImageRaw : `${siteUrl}/og.jpg`);

  return {
    plugins: [
      react(),
      {
        name: "html-site-url",
        transformIndexHtml(html: string) {
          return html.replaceAll("__SITE_URL__", siteUrl).replaceAll("__OG_IMAGE_URL__", ogImageUrl);
        },
      },
    ],
    server: { port: 5175 },
    optimizeDeps: {
      exclude: ["@lucaismyname/ginger"],
    },
  };
});
