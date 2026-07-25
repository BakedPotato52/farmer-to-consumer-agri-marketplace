import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "";
let redisClient: Redis | null = null;
let isRedisDisabled = false;

function getRedisInstance(): Redis | null {
  if (!REDIS_URL || isRedisDisabled) {
    return null;
  }

  if (!redisClient) {
    try {
      redisClient = new Redis(REDIS_URL, {
        maxRetriesPerRequest: 1,
        retryStrategy(times) {
          if (times > 1) {
            isRedisDisabled = true;
            return null;
          }
          return 50;
        },
        enableOfflineQueue: false,
        connectTimeout: 2000,
        lazyConnect: true,
      });

      redisClient.on("error", (err: any) => {
        if (!isRedisDisabled) {
          const msg = err?.message || String(err);
          if (
            msg.includes("WRONGPASS") ||
            msg.includes("Stream isn't writeable") ||
            msg.includes("NOAUTH")
          ) {
            isRedisDisabled = true;
            try {
              redisClient?.disconnect();
            } catch (_) {}
          }
        }
      });

      redisClient.connect().catch(() => {
        isRedisDisabled = true;
      });
    } catch (_) {
      isRedisDisabled = true;
      redisClient = null;
    }
  }

  if (redisClient && redisClient.status === "ready" && !isRedisDisabled) {
    return redisClient;
  }

  return null;
}

// In-Memory Fallback Sliding Window Store
const inMemoryStore = new Map<string, { count: number; resetAt: number }>();

// Periodic cleanup of expired in-memory entries every 2 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of inMemoryStore.entries()) {
      if (now > record.resetAt) {
        inMemoryStore.delete(key);
      }
    }
  }, 120000);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
}

/**
 * Check rate limit for a given identifier (e.g. IP address or User ID + action)
 *
 * @param identifier Unique rate limit key (e.g., 'upload:192.168.1.1' or 'order:usr_123')
 * @param limit Maximum allowed requests within the time window
 * @param windowSeconds Time window duration in seconds
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowSeconds: number = 60,
): Promise<RateLimitResult> {
  const rateLimitKey = `ratelimit:${identifier}`;
  const now = Date.now();
  const redis = getRedisInstance();

  // Tier 1: Redis Rate Limiting (Distributed)
  if (redis) {
    try {
      const pipeline = redis.pipeline();
      pipeline.incr(rateLimitKey);
      pipeline.ttl(rateLimitKey);
      const results = await pipeline.exec();

      if (results && results[0] && !results[0][0]) {
        const count = results[0][1] as number;
        let ttl = results[1] ? (results[1][1] as number) : -1;

        if (count === 1 || ttl === -1) {
          await redis.expire(rateLimitKey, windowSeconds);
          ttl = windowSeconds;
        }

        const remaining = Math.max(0, limit - count);
        const resetInSeconds = ttl > 0 ? ttl : windowSeconds;

        return {
          success: count <= limit,
          limit,
          remaining,
          resetInSeconds,
        };
      }
    } catch (_) {
      // If Redis fails, seamlessly fall through to In-Memory rate limiter
    }
  }

  // Tier 2: In-Memory Rate Limiting (Fallback)
  const existing = inMemoryStore.get(rateLimitKey);

  if (!existing || now > existing.resetAt) {
    const resetAt = now + windowSeconds * 1000;
    inMemoryStore.set(rateLimitKey, { count: 1, resetAt });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetInSeconds: windowSeconds,
    };
  }

  existing.count += 1;
  const resetInSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  const remaining = Math.max(0, limit - existing.count);

  return {
    success: existing.count <= limit,
    limit,
    remaining,
    resetInSeconds,
  };
}
