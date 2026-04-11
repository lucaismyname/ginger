import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./components/ThemeToggle";

const NPM_CMD = "npm install @lucaismyname/ginger";
const NPM_URL = "https://www.npmjs.com/package/@lucaismyname/ginger";
const REPO_URL = "https://github.com/lucaismyname/ginger";
const SAMPLE_MP3_URL =
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=calm-ambient-11157.mp3";

function formatTime(totalSeconds: number) {
  const safeSeconds = Number.isFinite(totalSeconds) ? Math.max(0, totalSeconds) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = Math.floor(safeSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    const audio = new Audio(SAMPLE_MP3_URL);
    audio.preload = "metadata";
    audio.volume = volume;
    audioRef.current = audio;

    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onPause = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }
    audio.pause();
  };

  const stopAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextTime = Number(event.target.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextVolume = Number(event.target.value);
    audio.volume = nextVolume;
    setVolume(nextVolume);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-start justify-center px-6 py-16 sm:px-10 lg:px-16">
      <ThemeToggle />

      <main className="w-full max-w-xl text-left mx-auto">
        <section className="flex flex-col items-start justify-start">
          <div className="mb-8 w-full rounded-xl border border-zinc-200 bg-zinc-100/80 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/80">
            <div className="flex w-full items-center gap-3">
              <button
                aria-label={isPlaying ? "Pause" : "Play"}
                className="rounded-full border border-zinc-300 p-1.5 text-zinc-900 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-50 dark:hover:border-zinc-500"
                onClick={togglePlayback}
                type="button"
              >
                {isPlaying ? (
                  <svg aria-hidden className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect height="16" rx="1" width="5" x="5" y="4" />
                    <rect height="16" rx="1" width="5" x="14" y="4" />
                  </svg>
                ) : (
                  <svg aria-hidden className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 4L20 12L7 20V4Z" />
                  </svg>
                )}
              </button>

              <button
                aria-label="Stop"
                className="text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                onClick={stopAudio}
                type="button"
              >
                <svg aria-hidden className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect height="12" rx="1" width="12" x="6" y="6" />
                </svg>
              </button>

              <span className="w-14 text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                {formatTime(currentTime)}
              </span>

              <input
                aria-label="Playback progress"
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-300 accent-zinc-700 dark:bg-zinc-700 dark:accent-zinc-200"
                max={Math.max(duration, 0)}
                min={0}
                onChange={handleProgressChange}
                step={0.1}
                type="range"
                value={Math.min(currentTime, duration || 0)}
              />

              <span className="w-14 text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                {duration > 0 ? formatTime(duration) : "--:--"}
              </span>

              <input
                aria-label="Volume"
                className="h-1.5 w-20 cursor-pointer appearance-none rounded-full bg-zinc-300 accent-zinc-700 dark:bg-zinc-700 dark:accent-zinc-200"
                max={1}
                min={0}
                onChange={handleVolumeChange}
                step={0.01}
                type="range"
                value={volume}
              />
            </div>
          </div>

          <h1 className="font-mono text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            &lt;Ginger /&gt;
          </h1>

          <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            A headless React audio player. Build your own UI with playlists,
            keyboard shortcuts, and media session support—without fighting the
            DOM inside the library.
          </p>

          <div className="mt-8">
            <p className="mb-2 text-[0.66em] tracking-wider font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
              Install
            </p>
            <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-100/80 px-4 py-3 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100">
              <code>{NPM_CMD}</code>
            </pre>
          </div>

          <p className="mt-8 text-sm text-zinc-600 dark:text-zinc-400">
            <a
              href={NPM_URL}
              className="font-medium text-ginger underline decoration-ginger underline-offset-4 transition-colors hover:text-ginger-dark dark:text-orange-400 dark:decoration-orange-400 dark:hover:text-orange-300"
              rel="noreferrer"
              target="_blank"
            >
              npm package
            </a>
            <span className="mx-2 text-zinc-400">·</span>
            <a
              href={REPO_URL}
              className="font-medium text-ginger underline decoration-ginger underline-offset-4 transition-colors hover:text-ginger-dark dark:text-orange-400 dark:decoration-orange-400 dark:hover:text-orange-300"
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}
