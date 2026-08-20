/**
 * Text-to-Speech (TTS) service abstraction.
 *
 * Callers ask this interface to speak text and can stop playback instantly
 * (needed for barge-in / interrupt). The default implementation (Phase 4) uses
 * the browser's speechSynthesis; premium voices (ElevenLabs, OpenAI, Google)
 * can be added later behind the same interface.
 */
export type TTSProvider = "browser" | "elevenlabs" | "openai" | "google";

export interface TTSSpeakOptions {
  text: string;
  /** BCP-47 language tag, e.g. "hi-IN" or "en-US". */
  lang?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (message: string) => void;
}

export interface TTSService {
  readonly provider: TTSProvider;
  isSupported(): boolean;
  speak(options: TTSSpeakOptions): Promise<void>;
  /** Immediately stop any current playback (used for interrupt/barge-in). */
  stop(): void;
}
