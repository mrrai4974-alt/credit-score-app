import type { AIService } from "./types";
import { ClaudeService } from "./claude";

/**
 * AI provider factory — the single place that decides which model backs the
 * agent. To switch models/providers later, add a class and a branch here;
 * nothing else in the app changes.
 *
 * Server-side only (reads secret API keys from the environment).
 */
let cached: AIService | null = null;

export function getAIService(): AIService {
  if (!cached) {
    cached = new ClaudeService();
  }
  return cached;
}

export * from "./types";
