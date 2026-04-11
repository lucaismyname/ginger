import { getCurrentTrack, resolvedAlbumLine } from "../../internal/selectors";
import { createTextDisplay, createTrackFieldDisplay } from "./createTextDisplay";

export const Title = createTrackFieldDisplay("Ginger.Current.Title", (t) => t?.title);
export const Artist = createTrackFieldDisplay("Ginger.Current.Artist", (t) => t?.artist);
export const Album = createTextDisplay("Ginger.Current.Album", (s) => resolvedAlbumLine(s));
export const Description = createTrackFieldDisplay(
  "Ginger.Current.Description",
  (t) => t?.description,
);
export const Copyright = createTextDisplay("Ginger.Current.Copyright", (s) => {
  const t = getCurrentTrack(s);
  return t?.copyright ?? s.playlistMeta?.copyright;
});
export const Genre = createTrackFieldDisplay("Ginger.Current.Genre", (t) => t?.genre);
export const Label = createTrackFieldDisplay("Ginger.Current.Label", (t) => t?.label);
export const Isrc = createTrackFieldDisplay("Ginger.Current.Isrc", (t) => t?.isrc);
export const TrackNumber = createTrackFieldDisplay("Ginger.Current.TrackNumber", (t) =>
  t?.trackNumber != null ? String(t.trackNumber) : undefined,
);
