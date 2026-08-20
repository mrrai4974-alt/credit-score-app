import type { STTProvider, STTService } from "./types";
import { BrowserSTTService } from "./browser";

/**
 * STT provider factory — the single place that decides which implementation
 * the app uses. To switch providers later (Whisper/Google/Deepgram), add the
 * class and a case here; nothing else in the app changes.
 */
export function getSTTService(
  provider: STTProvider = "browser",
): STTService {
  switch (provider) {
    case "browser":
      return new BrowserSTTService();
    // case "whisper": return new WhisperSTTService();   // Phase: server STT
    // case "google": return new GoogleSTTService();
    // case "deepgram": return new DeepgramSTTService();
    default:
      return new BrowserSTTService();
  }
}

export * from "./types";
