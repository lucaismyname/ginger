import type { TextDisplayProps } from "./createTextDisplay";
import { useGingerState } from "../../context/GingerSplitContexts";
import { getCurrentTrack } from "../../internal/selectors";

export type YearProps = TextDisplayProps & {
  format?: (year: number) => string;
};

export function Year({ className, style, fallback, empty, children, format }: YearProps) {
  const state = useGingerState();
  const y = getCurrentTrack(state)?.year;
  if (typeof y !== "number" || !Number.isFinite(y)) {
    const node = empty ?? fallback ?? null;
    return node ? <span className={className} style={style}>{node}</span> : null;
  }
  const text = format ? format(y) : String(y);
  if (children) return <span className={className} style={style}>{children(text, state)}</span>;
  return (
    <span className={className} style={style}>
      {text}
    </span>
  );
}

Year.displayName = "Ginger.Current.Year";
