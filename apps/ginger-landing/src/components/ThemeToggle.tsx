import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ginger-landing-theme";

type Theme = "light" | "dark";

function getSystemDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function readStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {
    /* ignore */
  }
  return null;
}

function applyThemeClass(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return readStoredTheme() ?? (getSystemDark() ? "dark" : "light");
  });

  useEffect(() => {
    applyThemeClass(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed right-4 bottom-4 z-10 rounded-md border border-zinc-300 bg-white/90 p-2 text-sm text-zinc-800 shadow-sm transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-ginger focus:ring-offset-2 focus:ring-offset-zinc-50 dark:border-zinc-600 dark:bg-zinc-900/90 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:focus:ring-offset-zinc-950"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2.5" />
          <path d="M12 19.5V22" />
          <path d="M2 12h2.5" />
          <path d="M19.5 12H22" />
          <path d="m4.93 4.93 1.77 1.77" />
          <path d="m17.3 17.3 1.77 1.77" />
          <path d="m19.07 4.93-1.77 1.77" />
          <path d="m6.7 17.3-1.77 1.77" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      )}
    </button>
  );
}
