import type { TextDisplayProps } from "./createTextDisplay";
import { useGingerContext } from "../../context/GingerContext";
import { getCurrentTrack } from "../../internal/selectors";

export type FileUrlProps = TextDisplayProps & {
  /** When false (default), renders nothing unless you explicitly opt in */
  visible?: boolean;
};

export function FileUrl({ visible = false, className, style, fallback, empty, children }: FileUrlProps) {
  const { state } = useGingerContext();
  if (!visible) return null;
  const value = getCurrentTrack(state)?.fileUrl ?? "";
  if (!value) {
    const node = empty ?? fallback ?? null;
    return node ? <span className={className} style={style}>{node}</span> : null;
  }
  if (children) return <span className={className} style={style}>{children(value, state)}</span>;
  return (
    <span className={className} style={style}>
      {value}
    </span>
  );
}

FileUrl.displayName = "Ginger.Current.FileUrl";
