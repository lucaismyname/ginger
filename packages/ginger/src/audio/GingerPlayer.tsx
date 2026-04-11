import { useEffect, type AudioHTMLAttributes, type CSSProperties } from "react";
import { useGingerContext } from "../context/GingerContext";

export type GingerPlayerProps = {
  className?: string;
  style?: CSSProperties;
  preload?: AudioHTMLAttributes<HTMLAudioElement>["preload"];
  crossOrigin?: AudioHTMLAttributes<HTMLAudioElement>["crossOrigin"];
};

function readBufferedFraction(el: HTMLAudioElement): number {
  const { buffered, duration } = el;
  if (!(duration > 0) || buffered.length === 0) return 0;
  return Math.min(1, buffered.end(buffered.length - 1) / duration);
}

export function GingerPlayer({ className, style, preload = "metadata", crossOrigin }: GingerPlayerProps) {
  const { audioRef, dispatch, state, notifyEnded } = useGingerContext();
  const url = state.tracks[state.currentIndex]?.fileUrl ?? "";

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (!url) {
      el.removeAttribute("src");
      return;
    }
    if (el.getAttribute("src") !== url) {
      el.src = url;
      el.load();
    }
  }, [audioRef, state.currentIndex, state.tracks, url]);

  return (
    <audio
      ref={audioRef}
      className={className}
      style={style}
      preload={preload}
      crossOrigin={crossOrigin}
      controls={false}
      onTimeUpdate={(e) => {
        const el = e.currentTarget;
        dispatch({
          type: "MEDIA_TIME_UPDATE",
          payload: {
            currentTime: el.currentTime,
            duration: el.duration,
            bufferedFraction: readBufferedFraction(el),
          },
        });
      }}
      onLoadedMetadata={(e) => {
        const el = e.currentTarget;
        dispatch({
          type: "MEDIA_LOADED_METADATA",
          payload: {
            duration: el.duration,
            bufferedFraction: readBufferedFraction(el),
          },
        });
      }}
      onEnded={() => notifyEnded()}
      onPlay={() => dispatch({ type: "MEDIA_PLAY" })}
      onPause={() => dispatch({ type: "MEDIA_PAUSE" })}
      onWaiting={() => dispatch({ type: "MEDIA_WAITING" })}
      onCanPlay={() => dispatch({ type: "MEDIA_CANPLAY" })}
      onError={() => {
        const el = audioRef.current;
        const code = el?.error?.code;
        const message =
          code === 1
            ? "MEDIA_ERR_ABORTED"
            : code === 2
              ? "MEDIA_ERR_NETWORK"
              : code === 3
                ? "MEDIA_ERR_DECODE"
                : code === 4
                  ? "MEDIA_ERR_SRC_NOT_SUPPORTED"
                  : "MEDIA_ERR_UNKNOWN";
        dispatch({ type: "MEDIA_ERROR", payload: { message } });
      }}
    />
  );
}
