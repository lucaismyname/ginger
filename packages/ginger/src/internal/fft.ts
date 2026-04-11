/** In-place radix-2 Cooley–Tukey FFT; `length` must be a power of 2 and >= 2. */
export function fftInPlace(re: Float64Array, im: Float64Array): void {
  const n = re.length;
  if (n !== im.length || n < 2 || (n & (n - 1)) !== 0) {
    throw new Error("fftInPlace: length must be equal powers of 2 >= 2");
  }

  let j = 0;
  for (let i = 0; i < n - 1; i += 1) {
    if (i < j) {
      const tr = re[i]!;
      const ti = im[i]!;
      re[i] = re[j]!;
      im[i] = im[j]!;
      re[j] = tr;
      im[j] = ti;
    }
    let k = n >> 1;
    while (k <= j) {
      j -= k;
      k >>= 1;
    }
    j += k;
  }

  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wlenR = Math.cos(ang);
    const wlenI = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let wr = 1;
      let wi = 0;
      const half = len >> 1;
      for (let k = 0; k < half; k += 1) {
        const u = i + k;
        const v = u + half;
        const tr = wr * re[v]! - wi * im[v]!;
        const ti = wr * im[v]! + wi * re[v]!;
        re[v] = re[u]! - tr;
        im[v] = im[u]! - ti;
        re[u] = re[u]! + tr;
        im[u] = im[u]! + ti;
        const nwr = wr * wlenR - wi * wlenI;
        const nwi = wr * wlenI + wi * wlenR;
        wr = nwr;
        wi = nwi;
      }
    }
  }
}

/** Magnitude spectrum for real input: length `n` (power of 2). Returns `n/2` magnitudes for bins 0..n/2-1. */
export function realFftMagnitudes(samples: Float64Array): Float64Array {
  const n = samples.length;
  if (n < 2 || (n & (n - 1)) !== 0) {
    throw new Error("realFftMagnitudes: length must be a power of 2 >= 2");
  }
  const re = new Float64Array(n);
  const im = new Float64Array(n);
  for (let i = 0; i < n; i += 1) re[i] = samples[i]!;
  fftInPlace(re, im);
  const out = new Float64Array(n >> 1);
  for (let k = 0; k < n >> 1; k += 1) {
    out[k] = Math.hypot(re[k]!, im[k]!);
  }
  return out;
}

export function hanningWindow(length: number): Float64Array {
  const w = new Float64Array(length);
  if (length === 1) {
    w[0] = 1;
    return w;
  }
  const denom = length - 1;
  for (let i = 0; i < length; i += 1) {
    w[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / denom));
  }
  return w;
}

export function clampFftSize(n: number): number {
  const p = 2 ** Math.round(Math.log2(n));
  return Math.min(8192, Math.max(32, p));
}
