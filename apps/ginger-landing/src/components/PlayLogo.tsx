type PlayLogoProps = {
  className?: string;
};

/** Right-pointing triangle as 1×1 unit squares (pixel art). */
const PLAY_PIXELS: [number, number][] = [
  [0, 3],
  [0, 4],
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [2, 1],
  [2, 2],
  [2, 3],
  [2, 4],
  [2, 5],
  [2, 6],
  [3, 0],
  [3, 1],
  [3, 2],
  [3, 3],
  [3, 4],
  [3, 5],
  [3, 6],
  [3, 7],
  [4, 1],
  [4, 2],
  [4, 3],
  [4, 4],
  [4, 5],
  [4, 6],
  [5, 2],
  [5, 3],
  [5, 4],
  [5, 5],
  [6, 3],
  [6, 4],
];

/** Single-pixel frame: 9×10 grid (play sits inset at 1,1 with 7×8 cells). */
const FRAME_PIXELS: [number, number][] = (() => {
  const seen = new Set<string>();
  const cells: [number, number][] = [];
  const add = (x: number, y: number) => {
    const k = `${x},${y}`;
    if (seen.has(k)) return;
    seen.add(k);
    cells.push([x, y]);
  };
  for (let x = 0; x < 9; x++) {
    add(x, 0);
    add(x, 9);
  }
  for (let y = 0; y < 10; y++) {
    add(0, y);
    add(8, y);
  }
  return cells;
})();

const PLAY_DX = 1;
const PLAY_DY = 1;

export function PlayLogo({ className }: PlayLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 9 10"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      aria-hidden
    >
      {FRAME_PIXELS.map(([x, y]) => (
        <rect
          key={`f-${x}-${y}`}
          x={x}
          y={y}
          width={1}
          height={1}
          className="fill-zinc-400 dark:fill-zinc-600"
        />
      ))}
      {PLAY_PIXELS.map(([x, y]) => (
        <rect
          key={`p-${x}-${y}`}
          x={x + PLAY_DX}
          y={y + PLAY_DY}
          width={1}
          height={1}
          className="fill-ginger dark:fill-orange-400"
        />
      ))}
    </svg>
  );
}
