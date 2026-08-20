import Anthropic from "@anthropic-ai/sdk";
import type { AIChatOptions, AIService } from "./types";

/**
 * Claude implementation of the AIService interface.
 *
 * IMPORTANT: this file only runs on the server (imported by API routes). The
 * ANTHROPIC_API_KEY is read from the environment and is NEVER sent to the
 * browser. The rest of the app depends on the AIService interface, so the
 * model/provider can be swapped without touching callers.
 */

const DEFAULT_MODEL = process.env.CLAUDE_MODEL || "claude-opus-5";

/** Map our internal messages to the Anthropic SDK shape (user/assistant only). */
function toAnthropicMessages(
  messages: AIChatOptions["messages"],
): Anthropic.MessageParam[] {
  return messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));
}

export class ClaudeService implements AIService {
  readonly id = `claude:${DEFAULT_MODEL}`;
  private client: Anthropic;

  constructor(apiKey = process.env.ANTHROPIC_API_KEY) {
    if (!apiKey) {
      throw new Error("MISSING_API_KEY");
    }
    this.client = new Anthropic({ apiKey });
  }

  async chat({ systemPrompt, messages }: AIChatOptions): Promise<string> {
    const response = await this.client.messages.create({
      model: DEFAULT_MODEL,
      // Voice replies are short and conversational; keep it snappy.
      max_tokens: 1024,
      output_config: { effort: "low" },
      system: systemPrompt,
      messages: toAnthropicMessages(messages),
    });

    if (response.stop_reason === "refusal") {
      return "Sorry, main is baare mein baat nahi kar sakta. Kuch aur poochho?";
    }

    return response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
  }

  async *chatStream({
    systemPrompt,
    messages,
  }: AIChatOptions): AsyncIterable<string> {
    const stream = this.client.messages.stream({
      model: DEFAULT_MODEL,
      max_tokens: 1024,
      output_config: { effort: "low" },
      system: systemPrompt,
      messages: toAnthropicMessages(messages),
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        yield event.delta.text;
      }
    }
  }
}
