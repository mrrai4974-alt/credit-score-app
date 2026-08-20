import type { Message } from "@/types";

/**
 * AI service abstraction.
 *
 * The app talks to *this interface*, never to Claude directly. That lets us
 * swap the underlying model/provider (Claude, or anything else later) without
 * touching the UI or the agent orchestration.
 *
 * Implementations live server-side only, so the API key is never exposed to
 * the browser. Concrete implementation arrives in Phase 3.
 */
export interface AIChatOptions {
  systemPrompt: string;
  messages: Message[];
  /** When true, the implementation should stream tokens as they arrive. */
  stream?: boolean;
}

export interface AIService {
  /** The provider/model identifier, for logging and settings. */
  readonly id: string;

  /** Returns the full assistant reply. */
  chat(options: AIChatOptions): Promise<string>;

  /** Streams the assistant reply chunk by chunk. */
  chatStream(options: AIChatOptions): AsyncIterable<string>;
}
