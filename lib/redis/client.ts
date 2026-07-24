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
          if (msg.includes("WRONGPASS") || msg.includes("Stream isn't writeable") || msg.includes("NOAUTH")) {
            console.warn("[Redis Service] Auth or connection issue. Direct database mode active.");
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

/**
 * Retrieve cached JSON value from Redis
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const client = getRedisInstance();
    if (!client) return null;
    const value = await client.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch (_) {
    return null;
  }
}

/**
 * Set cached JSON value in Redis with Time-To-Live (TTL in seconds)
 */
export async function setCache<T>(
  key: string,
  data: T,
  ttlSeconds: number = 120,
): Promise<void> {
  try {
    const client = getRedisInstance();
    if (!client) return;
    const serialized = JSON.stringify(data);
    await client.set(key, serialized, "EX", ttlSeconds);
  } catch (_) {}
}

/**
 * Delete a specific cache key
 */
export async function deleteCacheKey(key: string): Promise<void> {
  try {
    const client = getRedisInstance();
    if (!client) return;
    await client.del(key);
  } catch (_) {}
}

/**
 * Invalidate multiple keys matching a pattern (e.g., 'cache:products:*')
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const client = getRedisInstance();
    if (!client) return;
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch (_) {}
}
