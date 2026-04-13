import { GingerPlayer } from "./audio/GingerPlayer";
import * as Control from "./components/controls/Controls";
import * as Current from "./components/current";
import * as Icon from "./components/icons";
import { GingerPlaylistCompound } from "./components/playlist/GingerPlaylist";
import * as Queue from "./components/queue/QueueDisplay";
import { GingerTrack } from "./components/tracks/GingerTrack";
import { GingerTracks } from "./components/tracks/GingerTracks";
import { GingerProvider } from "./context/GingerProvider";

const GingerTracksCompound = Object.assign(GingerTracks, {
  Track: GingerTrack,
});

export const Ginger = {
  Provider: GingerProvider,
  Player: GingerPlayer,
  Tracks: GingerTracksCompound,
  Current: {
    Title: Current.Title,
    Artist: Current.Artist,
    Album: Current.Album,
    Description: Current.Description,
    Copyright: Current.Copyright,
    Genre: Current.Genre,
    Label: Current.Label,
    Isrc: Current.Isrc,
    TrackNumber: Current.TrackNumber,
    Year: Current.Year,
    Lyrics: Current.Lyrics,
    LyricsSynced: Current.LyricsSynced,
    Chapters: Current.Chapters,
    FileUrl: Current.FileUrl,
    Artwork: Current.Artwork,
    QueueIndex: Current.QueueIndex,
    QueueLength: Current.QueueLength,
    QueuePosition: Current.QueuePosition,
    Elapsed: Current.Elapsed,
    Duration: Current.Duration,
    Remaining: Current.Remaining,
    Progress: Current.Progress,
    TimeRail: Current.TimeRail,
    BufferRail: Current.BufferRail,
    PlaybackState: Current.PlaybackState,
    ErrorMessage: Current.ErrorMessage,
  },
  Queue: {
    Title: Queue.Title,
    Subtitle: Queue.Subtitle,
    Description: Queue.Description,
    Copyright: Queue.Copyright,
    Artwork: Queue.Artwork,
  },
  Control: {
    PlayPause: Control.PlayPause,
    Repeat: Control.Repeat,
    Next: Control.Next,
    Previous: Control.Previous,
    Shuffle: Control.Shuffle,
    SeekBar: Control.SeekBar,
    Volume: Control.Volume,
    Mute: Control.Mute,
    PlaybackRate: Control.PlaybackRate,
  },
  Icon: {
    Play: Icon.Play,
    Pause: Icon.Pause,
    SkipForward: Icon.SkipForward,
    SkipBack: Icon.SkipBack,
    Shuffle: Icon.ShuffleIcon,
    Volume2: Icon.Volume2,
    VolumeX: Icon.VolumeX,
    RepeatGlyph: Icon.RepeatGlyph,
    Wrapper: Icon.Wrapper,
  },
  Playlist: GingerPlaylistCompound,
};
