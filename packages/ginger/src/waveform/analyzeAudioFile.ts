import { clampFftSize, hanningWindow, realFftMagnitudes } from "../internal/fft";
import { getAudioContextConstructor } from "./getAudioContextConstructor";

export type AnalyzeAudioFileOptions = {
  /** Number of time rows in the amplitude grid (and spectrogram if enabled). Default 128. */
  timeSlices?: number;
  /** Sub-buckets per time slice for the amplitude grid. Default 8. */
  samplesPerSlice?: number;
  /** When true, include `spectrogram` using windowed FFT per time slice. Default false. */
  spectrogram?: boolean;
  /** FFT length for spectrogram (power of 2). Default 1024. */
  fftSize?: number;
  /** Number of frequency bins to keep per row (first bins; capped by fftSize/2). Default 256. */
  frequencyBins?: number;
  /** Channel index, or `"mix"` for equal mix of all channels. Default 0. */
  channel?: number | "mix";
};

export type AudioFileAnalysis = {
  duration: number;
  sampleRate: number;
  /** Peak amplitudes in [0, 1]: `timeSlices` rows × `samplesPerSlice` columns. */
  amplitudeGrid: number[][];
  /** Optional magnitude spectrogram rows, each length `frequencyBins`, normalized to [0, 1] globally. */
  spectrogram?: number[][];
};

function mixChannels(buffer: AudioBuffer): Float32Array {
  const { numberOfChannels, length } = buffer;
  if (numberOfChannels === 1) {
    return buffer.getChannelData(0);
  }
  const out = new Float32Array(length);
  const scale = 1 / numberOfChannels;
  for (let c = 0; c < numberOfChannels; c += 1) {
    const ch = buffer.getChannelData(c);
    for (let i = 0; i < length; i += 1) {
      out[i] += ch[i]! * scale;
    }
  }
  return out;
}

function getChannel(buffer: AudioBuffer, channel: number | "mix"): Float32Array {
  if (channel === "mix") return mixChannels(buffer);
  const idx = Math.max(0, Math.min(buffer.numberOfChannels - 1, channel));
  return buffer.getChannelData(idx);
}

function buildAmplitudeGrid(
  channel: Float32Array,
  timeSlices: number,
  samplesPerSlice: number,
): number[][] {
  const grid: number[][] = [];
  const len = channel.length;
  if (len === 0) {
    for (let t = 0; t < timeSlices; t += 1) {
      grid.push(Array.from({ length: samplesPerSlice }, () => 0));
    }
    return grid;
  }

  const segmentLen = len / timeSlices;

  for (let t = 0; t < timeSlices; t += 1) {
    const row: number[] = [];
    const segStart = Math.floor(t * segmentLen);
    const segEnd = Math.floor((t + 1) * segmentLen);
    const segLen = Math.max(1, segEnd - segStart);
    const subLen = segLen / samplesPerSlice;

    for (let s = 0; s < samplesPerSlice; s += 1) {
      const a = Math.floor(segStart + s * subLen);
      const b = Math.min(segEnd, Math.floor(segStart + (s + 1) * subLen));
      let peak = 0;
      for (let i = a; i < b; i += 1) {
        peak = Math.max(peak, Math.abs(channel[i] ?? 0));
      }
      row.push(peak);
    }
    grid.push(row);
  }
  return grid;
}

function buildSpectrogram(
  channel: Float32Array,
  timeSlices: number,
  fftSize: number,
  frequencyBins: number,
): { rows: number[][]; maxMag: number } {
  const rows: number[][] = [];
  let maxMag = 1e-12;
  const len = channel.length;
  const n = clampFftSize(fftSize);
  const half = n >> 1;
  const bins = Math.min(frequencyBins, half);
  const window = hanningWindow(n);

  if (len < n) {
    for (let t = 0; t < timeSlices; t += 1) {
      rows.push(Array.from({ length: bins }, () => 0));
    }
    return { rows, maxMag: 1 };
  }

  for (let t = 0; t < timeSlices; t += 1) {
    const start =
      timeSlices <= 1 ? 0 : Math.min(Math.floor((t * (len - n)) / (timeSlices - 1)), len - n);
    const frame = new Float64Array(n);
    for (let i = 0; i < n; i += 1) {
      frame[i] = (channel[start + i] ?? 0) * (window[i] ?? 0);
    }
    const mags = realFftMagnitudes(frame);
    const row: number[] = [];
    for (let k = 0; k < bins; k += 1) {
      const v = mags[k] ?? 0;
      row.push(v);
      maxMag = Math.max(maxMag, v);
    }
    rows.push(row);
  }

  return { rows, maxMag };
}

/**
 * Decodes an `AudioBuffer` into visualization-friendly grids (no network).
 */
export function analyzeAudioBuffer(
  buffer: AudioBuffer,
  options: AnalyzeAudioFileOptions = {},
): AudioFileAnalysis {
  const timeSlices = Math.max(1, options.timeSlices ?? 128);
  const samplesPerSlice = Math.max(1, options.samplesPerSlice ?? 8);
  const wantSpec = Boolean(options.spectrogram);
  const fftSize = options.fftSize ?? 1024;
  const frequencyBins = Math.max(1, options.frequencyBins ?? 256);
  const channel = options.channel ?? 0;

  const data = getChannel(buffer, channel);
  const amplitudeGrid = buildAmplitudeGrid(data, timeSlices, samplesPerSlice);

  const result: AudioFileAnalysis = {
    duration: buffer.duration,
    sampleRate: buffer.sampleRate,
    amplitudeGrid,
  };

  if (wantSpec) {
    const { rows, maxMag } = buildSpectrogram(data, timeSlices, fftSize, frequencyBins);
    const norm = maxMag > 0 ? 1 / maxMag : 1;
    result.spectrogram = rows.map((row) => row.map((v) => v * norm));
  }

  return result;
}

/**
 * Fetches a URL, decodes audio to an `AudioBuffer`, runs {@link analyzeAudioBuffer}, then closes the temporary `AudioContext`.
 */
export async function analyzeAudioFile(
  fileUrl: string,
  options: AnalyzeAudioFileOptions = {},
): Promise<AudioFileAnalysis> {
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
  }
  const raw = await response.arrayBuffer();
  const Context = getAudioContextConstructor();
  if (!Context) {
    throw new Error("Web Audio API is not available");
  }
  const audioContext = new Context();
  try {
    const buffer = await audioContext.decodeAudioData(raw.slice(0));
    return analyzeAudioBuffer(buffer, options);
  } finally {
    await audioContext.close();
  }
}
