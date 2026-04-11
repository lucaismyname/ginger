type PlayLogoProps = {
  className?: string;
};

/**
 * Wordmark / mark SVG. Uses `currentColor` so light/dark contrast comes from Tailwind `text-*` on the `<svg>`.
 */
export function PlayLogo({ className }: PlayLogoProps) {
  return (
    <svg
      className={[
        "text-zinc-900 dark:text-zinc-50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      viewBox="0 0 14 6"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      aria-hidden
    >
      <path
        d="M1 1H2V2H3V2.5H4V3.5H3V4H2V5H1V6H0V0H1V1Z"
        fill="currentColor"
      />
      <rect x="6" y="1" width="1" height="1" fill="currentColor" />
      <rect x="8" y="1" width="1" height="1" fill="currentColor" />
      <rect x="6" y="2" width="1" height="1" fill="currentColor" />
      <rect x="8" y="2" width="1" height="1" fill="currentColor" />
      <rect x="6" y="3" width="1" height="1" fill="currentColor" />
      <rect x="8" y="3" width="1" height="1" fill="currentColor" />
      <rect x="6" y="4" width="1" height="1" fill="currentColor" />
      <rect x="8" y="4" width="1" height="1" fill="currentColor" />
      <rect x="6" y="5" width="1" height="1" fill="currentColor" />
      <rect x="8" y="5" width="1" height="1" fill="currentColor" />
      <rect x="6" width="1" height="1" fill="currentColor" />
      <rect x="8" width="1" height="1" fill="currentColor" />
      <rect x="11" y="2" width="1" height="1" fill="currentColor" />
      <rect x="12" y="2" width="1" height="1" fill="currentColor" />
      <rect
        width="1"
        height="1"
        transform="matrix(1 0 0 -1 12 5)"
        fill="currentColor"
      />
      <rect
        width="1"
        height="1"
        transform="matrix(1 0 0 -1 12 4)"
        fill="currentColor"
      />
      <rect x="13" y="2" width="1" height="1" fill="currentColor" />
      <rect x="11" y="3" width="1" height="1" fill="currentColor" />
      <rect x="13" y="3" width="1" height="1" fill="currentColor" />
      <rect x="11" y="4" width="1" height="1" fill="currentColor" />
      <rect x="13" y="4" width="1" height="1" fill="currentColor" />
    </svg>
  );
}
