/**
 * Pluggable per-IP rate limiting for the Express server.
 *
 * - Default: in-memory token-window buckets (single-instance, zero infra).
 * - Distributed: Upstash Redis (REST) when `UPSTASH_REDIS_REST_URL` and
 *   `UPSTASH_REDIS_REST_TOKEN` are set. This is REQUIRED for multi-instance
 *   deployments (e.g. Cloud Run > 1 replica), where each instance otherwise
 *   keeps its own counter and the effective limit becomes N×max.
 *
 * The public `rateLimit(bucketName, maxRequests, windowMs)` Express middleware
 * signature is identical to the previous in-memory implementation, so existing
 * route registrations in `server.ts` are unchanged.
 *
 * Fail-open policy: if the distributed backend is unreachable, the request is
 * allowed through (with a warning) rather than taking the whole app offline.
 * In-memory never throws here. Tune by swapping the backend if you need
 * fail-closed behavior.
 */
import type { Request, Response, NextFunction } from 'express';

/** Resolve the client IP, trusting the configured proxy hops (see server.ts trust proxy). */
export const clientIpOf = (req: Request): string =>
  (req.ip || req.socket?.remoteAddress || 'unknown').toString();

interface RateLimitBackend {
  readonly kind: 'memory' | 'upstash';
  /** Increment the counter for `key` within a `windowMs` window; return current count. */
  hit(key: string, windowMs: number): Promise<number>;
}

// ---------------------------------------------------------------------------
// In-memory backend (single instance).
// ---------------------------------------------------------------------------

interface RateBucket {
  count: number;
  resetAt: number;
}

class InMemoryBackend implements RateLimitBackend {
  readonly kind = 'memory' as const;
  private buckets = new Map<string, RateBucket>();

  constructor() {
    // Periodically evict expired buckets to bound memory.
    const timer = setInterval(() => this.sweep(), 5 * 60 * 1000);
    timer.unref?.();
  }

  private sweep(): void {
    const now = Date.now();
    for (const [key, bucket] of this.buckets) {
      if (now > bucket.resetAt) this.buckets.delete(key);
    }
  }

  async hit(key: string, windowMs: number): Promise<number> {
    const now = Date.now();
    let bucket = this.buckets.get(key);
    if (!bucket || now > bucket.resetAt) {
      bucket = { count: 0, resetAt: now + windowMs };
      this.buckets.set(key, bucket);
    }
    bucket.count += 1;
    return bucket.count;
  }
}

// ---------------------------------------------------------------------------
// Upstash Redis backend (distributed).
//
// Uses a single atomic EVAL script: INCR the counter, and EXPIRE it only on the
// first increment so the window is fixed (not extended on every hit).
// ---------------------------------------------------------------------------

const RATE_WINDOW_SCRIPT = `local c = redis.call('INCR', KEYS[1])
if c == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
return c`;

class UpstashBackend implements RateLimitBackend {
  readonly kind = 'upstash' as const;
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(url: string, token: string) {
    this.baseUrl = url.replace(/\/+$/, '');
    this.token = token;
  }

  async hit(key: string, windowMs: number): Promise<number> {
    const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
    const redisKey = `ratelimit:${key}`;
    const body = JSON.stringify([
      'EVAL',
      RATE_WINDOW_SCRIPT,
      '1',
      redisKey,
      String(windowSec),
    ]);
    const res = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body,
    });
    if (!res.ok) {
      throw new Error(`Upstash rate-limit HTTP ${res.status}: ${await res.text().catch(() => '')}`);
    }
    const data = (await res.json()) as { result?: unknown };
    const count = Number(data.result);
    if (!Number.isFinite(count)) {
      throw new Error(`Upstash rate-limit unexpected response: ${JSON.stringify(data)}`);
    }
    return count;
  }
}

// ---------------------------------------------------------------------------
// Backend selection (module-level singleton).
// ---------------------------------------------------------------------------

function createBackend(): RateLimitBackend {
  const url = (process.env.UPSTASH_REDIS_REST_URL || '').trim();
  const token = (process.env.UPSTASH_REDIS_REST_TOKEN || '').trim();
  if (url && token) {
    try {
      const backend = new UpstashBackend(url, token);
      console.info('[SurgiTrack] Rate limiting: distributed (Upstash Redis).');
      return backend;
    } catch (err) {
      console.warn(
        '[SurgiTrack] Upstash rate-limiter init failed; falling back to in-memory:',
        err instanceof Error ? err.message : err
      );
    }
  }
  return new InMemoryBackend();
}

const backend: RateLimitBackend = createBackend();

// ---------------------------------------------------------------------------
// Express middleware factory — same signature as the previous implementation.
// ---------------------------------------------------------------------------

/**
 * Returns an Express middleware that enforces a fixed-window per-IP limit.
 * @param bucketName  Logical bucket name (namespaced in the key).
 * @param maxRequests Max requests allowed within the window.
 * @param windowMs    Window size in milliseconds.
 */
export function rateLimit(bucketName: string, maxRequests: number, windowMs: number) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const ip = clientIpOf(req);
    const key = `${bucketName}:${ip}`;
    try {
      const count = await backend.hit(key, windowMs);
      if (count > maxRequests) {
        const retryAfterSec = Math.max(1, Math.ceil(windowMs / 1000));
        res.setHeader('Retry-After', String(retryAfterSec));
        console.warn(`[SurgiTrack Security] Rate limit hit (${bucketName}) for ${ip} [${backend.kind}]`);
        res
          .status(429)
          .json({ error: 'Too many requests. Please slow down and try again later.' });
        return;
      }
      next();
    } catch (err) {
      // Fail open: never block all traffic because the limiter backend is down.
      console.warn(
        `[SurgiTrack Security] Rate-limiter backend error (${bucketName}, ${backend.kind}); allowing request:`,
        err instanceof Error ? err.message : err
      );
      next();
    }
  };
}

/** Exposed for diagnostics / health checks. */
export const rateLimitBackendKind = backend.kind;
