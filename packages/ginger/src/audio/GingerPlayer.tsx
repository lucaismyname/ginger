import { useEffect, useRef, type AudioHTMLAttributes, type CSSProperties } from "react";
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
  const lastTimeSnapshotRef = useRef({
    currentTime: -1,
    duration: -1,
    bufferedFraction: -1,
  });

  const syncTime = (el: HTMLAudioElement, force = false) => {
    const next = {
      currentTime: el.currentTime,
      duration: el.duration,
      bufferedFraction: readBufferedFraction(el),
    };
    const prev = lastTimeSnapshotRef.current;
    const changedEnough =
      Math.abs(next.currentTime - prev.currentTime) >= 0.25 ||
      Math.abs(next.duration - prev.duration) >= 0.01 ||
      Math.abs(next.bufferedFraction - prev.bufferedFraction) >= 0.01;
    if (!force && !changedEnough) return;
    lastTimeSnapshotRef.current = next;
    dispatch({
      type: "MEDIA_TIME_UPDATE",
      payload: next,
    });
  };

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = state.volume;
    el.muted = state.muted;
    el.playbackRate = state.playbackRate;
  }, [audioRef, state.volume, state.muted, state.playbackRate]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (!url) {
      el.removeAttribute("src");
      lastTimeSnapshotRef.current = { currentTime: -1, duration: -1, bufferedFraction: -1 };
      return;
    }
    if (el.getAttribute("src") !== url) {
      el.src = url;
      el.load();
      lastTimeSnapshotRef.current = { currentTime: -1, duration: -1, bufferedFraction: -1 };
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
      playsInline
      onTimeUpdate={(e) => {
        syncTime(e.currentTarget);
      }}
      onLoadedMetadata={(e) => {
        const el = e.currentTarget;
        lastTimeSnapshotRef.current = { currentTime: -1, duration: -1, bufferedFraction: -1 };
        dispatch({
          type: "MEDIA_LOADED_METADATA",
          payload: {
            duration: el.duration,
            bufferedFraction: readBufferedFraction(el),
          },
        });
      }}
      onSeeking={(e) => syncTime(e.currentTarget, true)}
      onSeeked={(e) => syncTime(e.currentTarget, true)}
      onEnded={() => notifyEnded()}
      onPlay={() => dispatch({ type: "MEDIA_PLAY" })}
      onPause={() => dispatch({ type: "MEDIA_PAUSE" })}
      onWaiting={() => dispatch({ type: "MEDIA_WAITING" })}
      onCanPlay={() => dispatch({ type: "MEDIA_CANPLAY" })}
      onProgress={(e) => syncTime(e.currentTarget, true)}
      onVolumeChange={(e) => {
        const el = e.currentTarget;
        dispatch({
          type: "MEDIA_VOLUME_SYNC",
          payload: { volume: el.volume, muted: el.muted },
        });
      }}
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
