// Límite básico de peticiones del formulario de contacto (por conexión).

import "server-only";

/**
 * Minimal fixed-window rate limiter kept in memory.
 * On Vercel each serverless instance has its own memory, so this is a
 * basic speed bump, not a guarantee. For stronger protection use a shared
 * store (e.g. Upstash Redis) — see README.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string) {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    if (hits.size > 1000) {
      for (const [k, v] of hits) if (v.resetAt < now) hits.delete(k);
    }
    return { allowed: true };
  }

  entry.count += 1;
  return { allowed: entry.count <= MAX_REQUESTS, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
}
