/**
 * Very small in-memory rate limiter (sliding window per key, usually an IP).
 *
 * Note: serverless functions are stateless across instances, so this is a
 * lightweight guard, not a hard guarantee. It's enough to stop casual abuse
 * of the chat endpoint. For production-grade limiting we'd use a shared store
 * (e.g. Upstash Redis) behind this same function signature.
 */
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 20; // per key per window

const hits = new Map<string, number[]>();

export function rateLimit(key: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const recent = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (recent.length >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((recent[0] + WINDOW_MS - now) / 1000);
    return { ok: false, retryAfter };
  }

  recent.push(now);
  hits.set(key, recent);
  return { ok: true, retryAfter: 0 };
}
