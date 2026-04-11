import { useMemo } from "react";
import { useGingerContext } from "../context/GingerContext";
import {
  derivePlaybackUiState,
  effectiveDuration,
  effectiveRemaining,
  getCurrentTrack,
  progressFraction,
  resolvedAlbumLine,
  resolvedArtwork,
} from "../internal/selectors";

export function useGinger() {
  const ctx = useGingerContext();
  const { state } = ctx;

  return useMemo(
    () => ({
      state,
      currentTrack: getCurrentTrack(state),
      playbackUi: derivePlaybackUiState(state),
      duration: effectiveDuration(state),
      remaining: effectiveRemaining(state),
      progress: progressFraction(state),
      artworkUrl: resolvedArtwork(state),
      albumLine: resolvedAlbumLine(state),
      play: ctx.play,
      pause: ctx.pause,
      togglePlayPause: ctx.togglePlayPause,
      seek: ctx.seek,
      setVolume: ctx.setVolume,
      setMuted: ctx.setMuted,
      toggleMute: ctx.toggleMute,
      setPlaybackRate: ctx.setPlaybackRate,
      next: ctx.next,
      prev: ctx.prev,
      setRepeatMode: ctx.setRepeatMode,
      cycleRepeat: ctx.cycleRepeat,
      toggleShuffle: ctx.toggleShuffle,
      setQueue: ctx.setQueue,
      playTrackAt: ctx.playTrackAt,
      selectTrackAt: ctx.selectTrackAt,
      setPlaylistMeta: ctx.setPlaylistMeta,
      dispatch: ctx.dispatch,
    }),
    [
      ctx.cycleRepeat,
      ctx.dispatch,
      ctx.next,
      ctx.pause,
      ctx.play,
      ctx.playTrackAt,
      ctx.selectTrackAt,
      ctx.prev,
      ctx.seek,
      ctx.setMuted,
      ctx.setPlaybackRate,
      ctx.setPlaylistMeta,
      ctx.setQueue,
      ctx.setRepeatMode,
      ctx.setVolume,
      ctx.toggleMute,
      ctx.togglePlayPause,
      ctx.toggleShuffle,
      state,
    ],
  );
}
