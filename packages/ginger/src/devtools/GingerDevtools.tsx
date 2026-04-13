import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { formatMmSs } from "../internal/formatTime";
import type { ProviderSnapshot } from "./registry";
import { ensureRegistry } from "./registry";

const TAILWIND_CDN = "https://cdn.tailwindcss.com";

function useTailwindCdn() {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (document.querySelector(`script[src="${TAILWIND_CDN}"]`)) return;
    const script = document.createElement("script");
    script.src = TAILWIND_CDN;
    script.async = true;
    document.head.appendChild(script);
    scriptRef.current = script;
    return () => {
      if (scriptRef.current?.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, []);
}

function useRegistrySnapshots() {
  const [snapshots, setSnapshots] = useState<ProviderSnapshot[]>([]);

  useEffect(() => {
    const registry = ensureRegistry();
    const sync = (map: Map<string, ProviderSnapshot>) => {
      setSnapshots(Array.from(map.values()));
    };
    sync(registry.getAll());
    return registry.subscribe(sync);
  }, []);

  return snapshots;
}

// ─── Sub-components for each section ─────────────────────────────────────────

function PlaybackSection({ snap }: { snap: ProviderSnapshot }) {
  const { state, actions } = snap;
  const track = state.tracks[state.currentIndex];

  return (
    <div className="ginger-dt-space-y-2">
      <h4 className="ginger-dt-text-[10px] ginger-dt-font-semibold ginger-dt-uppercase ginger-dt-tracking-wider ginger-dt-text-orange-400">
        Playback
      </h4>
      <div className="ginger-dt-flex ginger-dt-items-center ginger-dt-gap-1.5">
        <button
          type="button"
          onClick={actions.prev}
          className="ginger-dt-rounded ginger-dt-bg-neutral-700 ginger-dt-px-2 ginger-dt-py-0.5 ginger-dt-text-[11px] hover:ginger-dt-bg-neutral-600 ginger-dt-transition-colors"
          title="Previous"
        >
          ⏮
        </button>
        <button
          type="button"
          onClick={actions.togglePlayPause}
          className="ginger-dt-rounded ginger-dt-bg-orange-600 ginger-dt-px-3 ginger-dt-py-0.5 ginger-dt-text-[11px] ginger-dt-font-medium hover:ginger-dt-bg-orange-500 ginger-dt-transition-colors"
        >
          {state.isPaused ? "▶ Play" : "⏸ Pause"}
        </button>
        <button
          type="button"
          onClick={actions.next}
          className="ginger-dt-rounded ginger-dt-bg-neutral-700 ginger-dt-px-2 ginger-dt-py-0.5 ginger-dt-text-[11px] hover:ginger-dt-bg-neutral-600 ginger-dt-transition-colors"
          title="Next"
        >
          ⏭
        </button>
      </div>
      <div className="ginger-dt-grid ginger-dt-grid-cols-2 ginger-dt-gap-x-3 ginger-dt-gap-y-1 ginger-dt-text-[11px]">
        <Row
          label="Track"
          value={track ? `${state.currentIndex + 1}/${state.tracks.length}` : "—"}
        />
        <Row label="Mode" value={state.playbackMode}>
          <button
            type="button"
            onClick={() =>
              actions.setPlaybackMode(state.playbackMode === "playlist" ? "single" : "playlist")
            }
            className="ginger-dt-ml-1 ginger-dt-text-orange-400 hover:ginger-dt-text-orange-300 ginger-dt-text-[10px]"
          >
            ↻
          </button>
        </Row>
        <Row label="Repeat" value={state.repeatMode}>
          <button
            type="button"
            onClick={actions.cycleRepeat}
            className="ginger-dt-ml-1 ginger-dt-text-orange-400 hover:ginger-dt-text-orange-300 ginger-dt-text-[10px]"
          >
            ↻
          </button>
        </Row>
        <Row label="Shuffle" value={state.isShuffled ? "on" : "off"}>
          <button
            type="button"
            onClick={actions.toggleShuffle}
            className="ginger-dt-ml-1 ginger-dt-text-orange-400 hover:ginger-dt-text-orange-300 ginger-dt-text-[10px]"
          >
            ↻
          </button>
        </Row>
      </div>
    </div>
  );
}

function MediaSection({ snap }: { snap: ProviderSnapshot }) {
  const { state, actions } = snap;

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      actions.seek(Number(e.target.value));
    },
    [actions],
  );

  const handleVolume = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      actions.setVolume(Number(e.target.value));
    },
    [actions],
  );

  return (
    <div className="ginger-dt-space-y-2">
      <h4 className="ginger-dt-text-[10px] ginger-dt-font-semibold ginger-dt-uppercase ginger-dt-tracking-wider ginger-dt-text-orange-400">
        Media
      </h4>
      {/* Seek */}
      <div>
        <div className="ginger-dt-flex ginger-dt-items-center ginger-dt-justify-between ginger-dt-text-[11px] ginger-dt-mb-0.5">
          <span className="ginger-dt-text-neutral-400">Time</span>
          <span>
            {formatMmSs(state.currentTime)} / {formatMmSs(state.duration)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={state.duration || 0}
          step={0.1}
          value={state.currentTime}
          onChange={handleSeek}
          className="ginger-dt-w-full ginger-dt-h-1.5 ginger-dt-accent-orange-500 ginger-dt-cursor-pointer"
        />
        {/* Buffer bar */}
        <div className="ginger-dt-w-full ginger-dt-h-1 ginger-dt-bg-neutral-700 ginger-dt-rounded-full ginger-dt-mt-1 ginger-dt-overflow-hidden">
          <div
            className="ginger-dt-h-full ginger-dt-bg-orange-800 ginger-dt-rounded-full ginger-dt-transition-all"
            style={{ width: `${(state.bufferedFraction * 100).toFixed(1)}%` }}
          />
        </div>
        <div className="ginger-dt-text-[10px] ginger-dt-text-neutral-500 ginger-dt-mt-0.5">
          Buffered: {(state.bufferedFraction * 100).toFixed(1)}%
          {state.isBuffering && (
            <span className="ginger-dt-ml-2 ginger-dt-text-yellow-400">● buffering</span>
          )}
        </div>
      </div>

      {/* Volume */}
      <div>
        <div className="ginger-dt-flex ginger-dt-items-center ginger-dt-justify-between ginger-dt-text-[11px] ginger-dt-mb-0.5">
          <span className="ginger-dt-text-neutral-400">Volume</span>
          <span className="ginger-dt-flex ginger-dt-items-center ginger-dt-gap-1">
            {Math.round(state.volume * 100)}%
            <button
              type="button"
              onClick={actions.toggleMute}
              className={`ginger-dt-text-[10px] ginger-dt-px-1 ginger-dt-rounded ${state.muted ? "ginger-dt-bg-red-900 ginger-dt-text-red-300" : "ginger-dt-bg-neutral-700 ginger-dt-text-neutral-300"}`}
            >
              {state.muted ? "unmute" : "mute"}
            </button>
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={state.volume}
          onChange={handleVolume}
          className="ginger-dt-w-full ginger-dt-h-1.5 ginger-dt-accent-orange-500 ginger-dt-cursor-pointer"
        />
      </div>

      {/* Playback rate */}
      <div className="ginger-dt-flex ginger-dt-items-center ginger-dt-gap-2 ginger-dt-text-[11px]">
        <span className="ginger-dt-text-neutral-400">Rate</span>
        <div className="ginger-dt-flex ginger-dt-gap-0.5">
          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => actions.setPlaybackRate(r)}
              className={`ginger-dt-px-1.5 ginger-dt-py-0.5 ginger-dt-rounded ginger-dt-text-[10px] ginger-dt-transition-colors ${
                state.playbackRate === r
                  ? "ginger-dt-bg-orange-600 ginger-dt-text-white"
                  : "ginger-dt-bg-neutral-700 hover:ginger-dt-bg-neutral-600 ginger-dt-text-neutral-300"
              }`}
            >
              {r}x
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {state.errorMessage && (
        <div className="ginger-dt-text-[11px] ginger-dt-text-red-400 ginger-dt-bg-red-950 ginger-dt-rounded ginger-dt-px-2 ginger-dt-py-1">
          {state.errorMessage}
        </div>
      )}
    </div>
  );
}

function TrackSection({ snap }: { snap: ProviderSnapshot }) {
  const track = snap.state.tracks[snap.state.currentIndex];
  if (!track) {
    return (
      <div className="ginger-dt-space-y-2">
        <h4 className="ginger-dt-text-[10px] ginger-dt-font-semibold ginger-dt-uppercase ginger-dt-tracking-wider ginger-dt-text-orange-400">
          Current Track
        </h4>
        <div className="ginger-dt-text-[11px] ginger-dt-text-neutral-500 ginger-dt-italic">
          No track loaded
        </div>
      </div>
    );
  }
  return (
    <div className="ginger-dt-space-y-2">
      <h4 className="ginger-dt-text-[10px] ginger-dt-font-semibold ginger-dt-uppercase ginger-dt-tracking-wider ginger-dt-text-orange-400">
        Current Track
      </h4>
      <div className="ginger-dt-flex ginger-dt-gap-2">
        {track.artworkUrl && (
          <img
            src={track.artworkUrl}
            alt=""
            className="ginger-dt-w-10 ginger-dt-h-10 ginger-dt-rounded ginger-dt-object-cover ginger-dt-flex-shrink-0"
          />
        )}
        <div className="ginger-dt-min-w-0 ginger-dt-text-[11px]">
          <div className="ginger-dt-font-medium ginger-dt-truncate">{track.title}</div>
          {track.artist && (
            <div className="ginger-dt-text-neutral-400 ginger-dt-truncate">{track.artist}</div>
          )}
          {track.album && (
            <div className="ginger-dt-text-neutral-500 ginger-dt-truncate ginger-dt-text-[10px]">
              {track.album}
            </div>
          )}
        </div>
      </div>
      <div className="ginger-dt-grid ginger-dt-grid-cols-2 ginger-dt-gap-x-3 ginger-dt-gap-y-0.5 ginger-dt-text-[10px] ginger-dt-text-neutral-400">
        <span>src: {truncateUrl(track.fileUrl)}</span>
        {track.chapters && <span>chapters: {track.chapters.length}</span>}
        {track.lyricsTimed && <span>lyrics: timed ({track.lyricsTimed.length})</span>}
        {track.lyrics && !track.lyricsTimed && <span>lyrics: plain</span>}
      </div>
    </div>
  );
}

function QueueSection({ snap }: { snap: ProviderSnapshot }) {
  const { state, actions } = snap;

  return (
    <div className="ginger-dt-space-y-2">
      <h4 className="ginger-dt-text-[10px] ginger-dt-font-semibold ginger-dt-uppercase ginger-dt-tracking-wider ginger-dt-text-orange-400">
        Queue ({state.tracks.length})
      </h4>
      <div className="ginger-dt-max-h-32 ginger-dt-overflow-y-auto ginger-dt-space-y-px ginger-dt-scrollbar-thin">
        {state.tracks.length === 0 && (
          <div className="ginger-dt-text-[11px] ginger-dt-text-neutral-500 ginger-dt-italic">
            Empty queue
          </div>
        )}
        {state.tracks.map((track, i) => (
          <button
            key={track.id ?? `${track.fileUrl}-${i}`}
            type="button"
            onClick={() => actions.playTrackAt(i)}
            className={`ginger-dt-w-full ginger-dt-text-left ginger-dt-px-2 ginger-dt-py-1 ginger-dt-rounded ginger-dt-text-[11px] ginger-dt-flex ginger-dt-items-center ginger-dt-gap-2 ginger-dt-transition-colors ${
              i === state.currentIndex
                ? "ginger-dt-bg-orange-900/50 ginger-dt-text-orange-200"
                : "hover:ginger-dt-bg-neutral-700/50 ginger-dt-text-neutral-300"
            }`}
          >
            <span className="ginger-dt-w-5 ginger-dt-text-right ginger-dt-text-[10px] ginger-dt-text-neutral-500 ginger-dt-flex-shrink-0">
              {i === state.currentIndex ? "▸" : i + 1}
            </span>
            <span className="ginger-dt-truncate">{track.title}</span>
            {track.artist && (
              <span className="ginger-dt-text-neutral-500 ginger-dt-truncate ginger-dt-text-[10px] ginger-dt-ml-auto ginger-dt-flex-shrink-0">
                {track.artist}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Row({
  label,
  value,
  children,
}: { label: string; value: string; children?: React.ReactNode }) {
  return (
    <div className="ginger-dt-flex ginger-dt-items-center">
      <span className="ginger-dt-text-neutral-400">{label}:</span>
      <span className="ginger-dt-ml-1 ginger-dt-font-mono">{value}</span>
      {children}
    </div>
  );
}

function truncateUrl(url: string, max = 40): string {
  if (url.length <= max) return url;
  return `…${url.slice(-max)}`;
}

// ─── Main Overlay ─────────────────────────────────────────────────────────────

export function GingerDevtools() {
  useTailwindCdn();
  const snapshots = useRegistrySnapshots();

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const activeSnap = snapshots.find((s) => s.id === activeTab) ?? snapshots[0] ?? null;

  useEffect(() => {
    if (!activeTab && snapshots.length > 0) {
      setActiveTab(snapshots[0].id);
    }
    if (activeTab && !snapshots.find((s) => s.id === activeTab) && snapshots.length > 0) {
      setActiveTab(snapshots[0].id);
    }
  }, [snapshots, activeTab]);

  const portalRoot = typeof document !== "undefined" ? document.body : null;
  if (!portalRoot) return null;

  return createPortal(
    <div
      style={{
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
        zIndex: 2147483647,
        position: "fixed",
        bottom: 0,
        right: 0,
      }}
    >
      {/* Toggle button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: "12px",
            right: "12px",
            zIndex: 2147483647,
            background: "#ea580c",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span style={{ fontSize: "14px" }}>🍊</span>
          Ginger
          {snapshots.length > 0 && (
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                borderRadius: "4px",
                padding: "1px 5px",
                fontSize: "10px",
              }}
            >
              {snapshots.length}
            </span>
          )}
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          className="ginger-dt-fixed ginger-dt-bottom-3 ginger-dt-right-3 ginger-dt-w-[380px] ginger-dt-max-h-[80vh] ginger-dt-bg-neutral-900 ginger-dt-text-neutral-100 ginger-dt-rounded-xl ginger-dt-shadow-2xl ginger-dt-border ginger-dt-border-neutral-700/50 ginger-dt-flex ginger-dt-flex-col ginger-dt-overflow-hidden"
          style={{ zIndex: 2147483647 }}
        >
          {/* Header */}
          <div className="ginger-dt-flex ginger-dt-items-center ginger-dt-justify-between ginger-dt-px-3 ginger-dt-py-2 ginger-dt-bg-neutral-800 ginger-dt-border-b ginger-dt-border-neutral-700/50">
            <div className="ginger-dt-flex ginger-dt-items-center ginger-dt-gap-2">
              <span className="ginger-dt-text-sm">🍊</span>
              <span className="ginger-dt-text-xs ginger-dt-font-semibold ginger-dt-tracking-wide">
                Ginger Devtools
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ginger-dt-text-neutral-400 hover:ginger-dt-text-white ginger-dt-text-lg ginger-dt-leading-none ginger-dt-transition-colors"
            >
              ×
            </button>
          </div>

          {/* Tabs (when multiple providers) */}
          {snapshots.length > 1 && (
            <div className="ginger-dt-flex ginger-dt-gap-0 ginger-dt-bg-neutral-800 ginger-dt-px-1 ginger-dt-border-b ginger-dt-border-neutral-700/50 ginger-dt-overflow-x-auto">
              {snapshots.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveTab(s.id)}
                  className={`ginger-dt-px-3 ginger-dt-py-1.5 ginger-dt-text-[11px] ginger-dt-whitespace-nowrap ginger-dt-border-b-2 ginger-dt-transition-colors ${
                    activeSnap?.id === s.id
                      ? "ginger-dt-border-orange-500 ginger-dt-text-orange-300"
                      : "ginger-dt-border-transparent ginger-dt-text-neutral-400 hover:ginger-dt-text-neutral-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="ginger-dt-flex-1 ginger-dt-overflow-y-auto ginger-dt-px-3 ginger-dt-py-3 ginger-dt-space-y-4">
            {!activeSnap ? (
              <div className="ginger-dt-text-[11px] ginger-dt-text-neutral-500 ginger-dt-text-center ginger-dt-py-8">
                No Ginger providers detected.
                <br />
                <span className="ginger-dt-text-[10px]">
                  Add {"<Ginger.Provider>"} to your app.
                </span>
              </div>
            ) : (
              <>
                <PlaybackSection snap={activeSnap} />
                <Divider />
                <MediaSection snap={activeSnap} />
                <Divider />
                <TrackSection snap={activeSnap} />
                <Divider />
                <QueueSection snap={activeSnap} />
              </>
            )}
          </div>

          {/* Footer */}
          {activeSnap && (
            <div className="ginger-dt-px-3 ginger-dt-py-1.5 ginger-dt-bg-neutral-800 ginger-dt-border-t ginger-dt-border-neutral-700/50 ginger-dt-text-[10px] ginger-dt-text-neutral-500 ginger-dt-flex ginger-dt-justify-between">
              <span>ID: {activeSnap.id.slice(0, 8)}…</span>
              <span>Updated {msAgo(activeSnap.updatedAt)}</span>
            </div>
          )}
        </div>
      )}
    </div>,
    portalRoot,
  );
}

function Divider() {
  return <div className="ginger-dt-border-t ginger-dt-border-neutral-700/30" />;
}

function msAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 1000) return "just now";
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  return `${Math.floor(diff / 60_000)}m ago`;
}
