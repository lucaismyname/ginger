/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ginger: {
          DEFAULT: "#ea580c",
          dark: "#c2410c",
        },
      },
      fontFamily: {
        sans: [
          "Geist Sans",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        pixel: [
          '"Fusion Pixel 12px Monospaced SC"',
          "ui-monospace",
          "monospace",
        ],
        mono: [
          "Geist Mono",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
