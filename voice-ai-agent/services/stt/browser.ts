import type { STTService, STTSession, STTResult } from "./types";

/**
 * Browser-native Speech-to-Text using the Web Speech API
 * (SpeechRecognition / webkitSpeechRecognition).
 *
 * This is the default STT provider: it runs on-device, needs no API key, and
 * works in Chrome, Edge and Safari. It implements the same STTService
 * interface as any future server-side provider (Whisper, Google, Deepgram),
 * so callers never depend on this class directly.
 */

function getRecognitionCtor(): typeof SpeechRecognition | undefined {
  if (typeof window === "undefined") return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

class BrowserSTTSession implements STTSession {
  private recognition: SpeechRecognition;
  private resultCb: (r: STTResult) => void = () => {};
  private errorCb: (m: string) => void = () => {};
  private endCb: () => void = () => {};

  constructor(lang: string) {
    const Ctor = getRecognitionCtor()!;
    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = true; // keep listening across pauses
    recognition.interimResults = true; // stream partial results
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      // Walk new results from resultIndex; emit interim + final chunks.
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? "";
        this.resultCb({ transcript, isFinal: result.isFinal, lang });
      }
    };

    recognition.onerror = (event) => {
      this.errorCb(mapRecognitionError(event.error));
    };

    recognition.onend = () => this.endCb();

    this.recognition = recognition;
  }

  start() {
    try {
      this.recognition.start();
    } catch {
      // start() throws if called while already started — safe to ignore.
    }
  }

  stop() {
    try {
      this.recognition.stop();
    } catch {
      /* no-op */
    }
  }

  onResult(cb: (r: STTResult) => void) {
    this.resultCb = cb;
  }
  onError(cb: (m: string) => void) {
    this.errorCb = cb;
  }
  onEnd(cb: () => void) {
    this.endCb = cb;
  }
}

/** Translate raw Web Speech error codes into human-readable messages. */
function mapRecognitionError(code: string): string {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone access was blocked. Please allow the mic and try again.";
    case "no-speech":
      return "I didn't hear anything. Tap and try again.";
    case "audio-capture":
      return "No microphone was found. Please check your device.";
    case "network":
      return "Network problem during speech recognition. Check your connection.";
    case "aborted":
      return ""; // user-initiated stop; not a real error
    default:
      return "Speech recognition had a problem. Please try again.";
  }
}

export class BrowserSTTService implements STTService {
  readonly provider = "browser" as const;

  isSupported(): boolean {
    return getRecognitionCtor() !== undefined;
  }

  createSession(lang = "en-IN"): STTSession {
    return new BrowserSTTSession(lang);
  }
}
