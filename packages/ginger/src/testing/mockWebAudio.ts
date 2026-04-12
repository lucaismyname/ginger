type MockAudioContextState = AudioContextState;

class MockAudioNode {
  readonly connections: MockAudioNode[] = [];
  readonly connectCalls: MockAudioNode[] = [];
  disconnectCalls = 0;

  connect(node: MockAudioNode) {
    this.connections.push(node);
    this.connectCalls.push(node);
    return node;
  }

  disconnect() {
    this.disconnectCalls += 1;
    this.connections.length = 0;
  }
}

export class MockAudioDestinationNode extends MockAudioNode {}

export class MockMediaElementAudioSourceNode extends MockAudioNode {
  constructor(readonly mediaElement: HTMLAudioElement) {
    super();
  }
}

export class MockAnalyserNode extends MockAudioNode {
  fftSize = 2048;
  smoothingTimeConstant = 0.8;
  minDecibels = -100;
  maxDecibels = -30;

  get frequencyBinCount() {
    return this.fftSize / 2;
  }

  getByteFrequencyData(array: Uint8Array) {
    for (let i = 0; i < array.length; i += 1) {
      array[i] = ((i + 1) * 17) % 256;
    }
  }

  getByteTimeDomainData(array: Uint8Array) {
    for (let i = 0; i < array.length; i += 1) {
      array[i] = 128 + (i % 32);
    }
  }
}

export class MockAudioContext extends EventTarget {
  readonly destination = new MockAudioDestinationNode();
  readonly sources: MockMediaElementAudioSourceNode[] = [];
  readonly analysers: MockAnalyserNode[] = [];

  sampleRate = 44_100;
  state: MockAudioContextState = "running";
  closeCalls = 0;
  resumeCalls = 0;

  createMediaElementSource(element: HTMLAudioElement) {
    const source = new MockMediaElementAudioSourceNode(element);
    this.sources.push(source);
    return source as unknown as MediaElementAudioSourceNode;
  }

  createAnalyser() {
    const analyser = new MockAnalyserNode();
    this.analysers.push(analyser);
    return analyser as unknown as AnalyserNode;
  }

  async resume() {
    this.resumeCalls += 1;
    if (this.state === "suspended") {
      this.setStateForTest("running");
    }
  }

  async close() {
    this.closeCalls += 1;
    this.setStateForTest("closed");
  }

  setStateForTest(nextState: MockAudioContextState) {
    if (this.state === nextState) return;
    this.state = nextState;
    this.dispatchEvent(new Event("statechange"));
  }
}

export type MockWebAudioInstall = {
  contexts: MockAudioContext[];
  flushAnimationFrame: (time?: number) => void;
  flushAnimationFrames: (count: number) => void;
  pendingAnimationFrameCount: () => number;
  restore: () => void;
};

export function installMockWebAudio(): MockWebAudioInstall {
  const previousAudioContext = window.AudioContext;
  const previousWebkitAudioContext = (
    window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }
  ).webkitAudioContext;
  const previousRequestAnimationFrame = globalThis.requestAnimationFrame;
  const previousCancelAnimationFrame = globalThis.cancelAnimationFrame;

  const contexts: MockAudioContext[] = [];

  class InstalledMockAudioContext extends MockAudioContext {
    constructor() {
      super();
      contexts.push(this);
    }
  }

  let nextFrameId = 1;
  let now = 0;
  const pendingFrames = new Map<number, FrameRequestCallback>();

  Object.defineProperty(window, "AudioContext", {
    configurable: true,
    writable: true,
    value: InstalledMockAudioContext as unknown as typeof AudioContext,
  });
  Object.defineProperty(window, "webkitAudioContext", {
    configurable: true,
    writable: true,
    value: InstalledMockAudioContext as unknown as typeof AudioContext,
  });

  globalThis.requestAnimationFrame = ((callback: FrameRequestCallback) => {
    const id = nextFrameId;
    nextFrameId += 1;
    pendingFrames.set(id, callback);
    return id;
  }) as typeof requestAnimationFrame;

  globalThis.cancelAnimationFrame = ((id: number) => {
    pendingFrames.delete(id);
  }) as typeof cancelAnimationFrame;

  return {
    contexts,
    flushAnimationFrame: (time = now + 16) => {
      now = time;
      const callbacks = Array.from(pendingFrames.entries());
      pendingFrames.clear();
      for (const [, callback] of callbacks) {
        callback(now);
      }
    },
    flushAnimationFrames: (count: number) => {
      for (let i = 0; i < count; i += 1) {
        now += 16;
        const callbacks = Array.from(pendingFrames.entries());
        pendingFrames.clear();
        for (const [, callback] of callbacks) {
          callback(now);
        }
      }
    },
    pendingAnimationFrameCount: () => pendingFrames.size,
    restore: () => {
      Object.defineProperty(window, "AudioContext", {
        configurable: true,
        writable: true,
        value: previousAudioContext,
      });
      Object.defineProperty(window, "webkitAudioContext", {
        configurable: true,
        writable: true,
        value: previousWebkitAudioContext,
      });
      globalThis.requestAnimationFrame = previousRequestAnimationFrame;
      globalThis.cancelAnimationFrame = previousCancelAnimationFrame;
      pendingFrames.clear();
    },
  };
}
