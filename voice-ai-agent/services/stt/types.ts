/**
 * Speech-to-Text (STT) service abstraction.
 *
 * The app depends on this interface, not on a specific provider. The default
 * implementation (Phase 2) uses the browser's native SpeechRecognition. Later
 * we can drop in a server-side provider (Whisper, Google, Deepgram) behind the
 * same interface without changing callers.
 */
export type STTProvider = "browser" | "whisper" | "google" | "deepgram";

export interface STTResult {
  transcript: string;
  /** Interim results are partial; final results are stable. */
  isFinal: boolean;
  /** Detected/assumed language tag, e.g. "hi-IN" or "en-US". */
  lang?: string;
}

export interface STTSession {
  start(): void;
  stop(): void;
  /** Fired for each interim and final transcript chunk. */
  onResult(cb: (result: STTResult) => void): void;
  onError(cb: (message: string) => void): void;
  onEnd(cb: () => void): void;
}

export interface STTService {
  readonly provider: STTProvider;
  /** Whether this provider can run in the current environment. */
  isSupported(): boolean;
  createSession(lang?: string): STTSession;
}
