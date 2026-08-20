import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAIService } from "@/services/ai";
import { DEFAULT_SYSTEM_PROMPT } from "@/agents/personality";
import { rateLimit } from "@/lib/rate-limit";
import type { Message } from "@/types";

// The Anthropic SDK needs the Node.js runtime (not Edge).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Basic shape validation for the request body. */
function parseMessages(body: unknown): Message[] | null {
  if (!body || typeof body !== "object") return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const messages: Message[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") return null;
    const role = (m as Message).role;
    const content = (m as Message).content;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || content.length === 0) return null;
    if (content.length > 8000) return null; // guard against oversized input
    messages.push({
      id: (m as Message).id ?? "",
      role,
      content,
      createdAt: (m as Message).createdAt ?? new Date().toISOString(),
    });
  }
  return messages;
}

export async function POST(req: NextRequest) {
  // 1) Rate limit by client IP.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = rateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Aap bahut tezi se bhej rahe ho. Thodi der ruk kar try karo." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  // 2) Validate input.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const messages = parseMessages(body);
  if (!messages) {
    return NextResponse.json(
      { error: "Message samajh nahi aaya. Dobara try karo." },
      { status: 400 },
    );
  }
  const systemPrompt =
    typeof (body as { systemPrompt?: unknown }).systemPrompt === "string"
      ? ((body as { systemPrompt: string }).systemPrompt as string)
      : DEFAULT_SYSTEM_PROMPT;

  // 3) Call the AI service (Claude behind the interface).
  try {
    const ai = getAIService();
    const reply = await ai.chat({ systemPrompt, messages });
    return NextResponse.json({ reply });
  } catch (err) {
    // Map to friendly, non-technical messages. Never leak internals.
    const code = err instanceof Error ? err.message : "";

    if (code === "MISSING_API_KEY") {
      return NextResponse.json(
        { error: "AI abhi set up nahi hui hai. (API key missing.)" },
        { status: 500 },
      );
    }
    if (code === "AI_AUTH" || err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "AI ki key galat hai. Setup check karo." },
        { status: 500 },
      );
    }
    if (code === "AI_RATE_LIMIT" || err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "AI abhi busy hai. Thodi der baad try karo." },
        { status: 429 },
      );
    }
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "AI se baat karne mein dikkat aa gayi. Dobara try karo." },
      { status: 500 },
    );
  }
}
