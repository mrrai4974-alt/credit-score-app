import type { AIService } from "./types";
import { ClaudeService } from "./claude";
import { GroqService } from "./groq";

/**
 * AI provider factory — the single place that decides which model backs the
 * agent. Swap providers with the AI_PROVIDER env var, or let it auto-detect
 * from whichever API key is present.
 *
 *   AI_PROVIDER = "groq"   -> free Groq (Llama)   [needs GROQ_API_KEY]
 *   AI_PROVIDER = "claude" -> Claude              [needs ANTHROPIC_API_KEY]
 *   (unset)                -> use Groq if GROQ_API_KEY is set, else Claude
 *
 * Server-side only (reads secret API keys from the environment).
 */
let cached: AIService | null = null;

function build(): AIService {
  const provider = (process.env.AI_PROVIDER || "").toLowerCase();

  if (provider === "claude") return new ClaudeService();
  if (provider === "groq") return new GroqService();

  // Auto-detect: prefer the free provider when its key is present.
  if (process.env.GROQ_API_KEY) return new GroqService();
  if (process.env.ANTHROPIC_API_KEY) return new ClaudeService();

  // Nothing configured — surface a friendly, mappable error.
  throw new Error("MISSING_API_KEY");
}

export function getAIService(): AIService {
  if (!cached) cached = build();
  return cached;
}

export * from "./types";
