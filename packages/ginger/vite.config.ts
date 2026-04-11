import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [react(), dts({ entryRoot: "src", tsconfigPath: "./tsconfig.json" })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Ginger",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        exports: "named",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    sourcemap: true,
  },
});
