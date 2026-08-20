import type { AIChatOptions, AIService } from "./types";

/**
 * Groq implementation of the AIService interface — a FREE, fast AI option.
 *
 * Groq exposes an OpenAI-compatible chat API and hosts open models (Llama etc.)
 * with a generous free tier and no credit card required — ideal when a paid
 * Claude key isn't available. It runs server-side only; GROQ_API_KEY is never
 * exposed to the browser. Same interface as ClaudeService, so nothing else in
 * the app changes.
 */

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
// Strong, multilingual, free model — good with Hindi/Hinglish. Override with
// GROQ_MODEL (e.g. "llama-3.1-8b-instant" for even faster, lighter replies).
const DEFAULT_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

export class GroqService implements AIService {
  readonly id = `groq:${DEFAULT_MODEL}`;
  private apiKey: string;

  constructor(apiKey = process.env.GROQ_API_KEY) {
    if (!apiKey) {
      throw new Error("MISSING_API_KEY");
    }
    this.apiKey = apiKey;
  }

  async chat({ systemPrompt, messages }: AIChatOptions): Promise<string> {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        max_tokens: 1024,
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) throw new Error("AI_AUTH");
      if (res.status === 429) throw new Error("AI_RATE_LIMIT");
      throw new Error(`AI_ERROR_${res.status}`);
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return data.choices?.[0]?.message?.content?.trim() ?? "";
  }

  async *chatStream(options: AIChatOptions): AsyncIterable<string> {
    // Simple single-yield for now; true token streaming arrives in Phase 5.
    yield await this.chat(options);
  }
}
