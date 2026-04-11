import { useMemo } from "react";
import { gingerStateFromContextValues, useGingerMedia, useGingerPlayback } from "../context/GingerSplitContexts";
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
  const pb = useGingerPlayback();
  const md = useGingerMedia();

  return useMemo(
    () => {
      const state = gingerStateFromContextValues(pb, md);
      return {
        state,
        currentTrack: getCurrentTrack(state),
        playbackUi: derivePlaybackUiState(state),
        duration: effectiveDuration(state),
        remaining: effectiveRemaining(state),
        progress: progressFraction(state),
        artworkUrl: resolvedArtwork(state),
        albumLine: resolvedAlbumLine(state),
        play: pb.play,
        pause: pb.pause,
        togglePlayPause: pb.togglePlayPause,
        seek: md.seek,
        setVolume: md.setVolume,
        setMuted: md.setMuted,
        toggleMute: md.toggleMute,
        setPlaybackRate: md.setPlaybackRate,
        next: pb.next,
        prev: pb.prev,
        setRepeatMode: pb.setRepeatMode,
        cycleRepeat: pb.cycleRepeat,
        toggleShuffle: pb.toggleShuffle,
        setQueue: pb.setQueue,
        playTrackAt: pb.playTrackAt,
        selectTrackAt: pb.selectTrackAt,
        setPlaylistMeta: pb.setPlaylistMeta,
        init: pb.init,
        audioRef: md.audioRef,
        dispatch: pb.dispatch,
      };
    },
    [pb, md],
  );
}
