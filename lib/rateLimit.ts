/**
 * lib/rateLimit.ts
 * Simple rate limiting using in-memory store (production: gunakan Redis/Upstash)
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store untuk rate limiting
// Production: gunakan Redis atau Upstash untuk distributed systems
const rateLimitStore: Map<string, RateLimitEntry> = new Map();

/**
 * Check rate limit untuk endpoint
 * @param key - Unique key (misal: IP address + endpoint)
 * @param limit - Max requests allowed
 * @param windowMs - Time window dalam milliseconds
 * @returns Object dengan isAllowed, remaining, dan resetTime
 */
export const checkRateLimit = (
  key: string,
  limit: number = 10,
  windowMs: number = 60000, // 1 minute
): {
  isAllowed: boolean;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
} => {
  const now = Date.now();
  let entry = rateLimitStore.get(key);

  // Reset jika window sudah lewat
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, entry);
  }

  const isAllowed = entry.count < limit;
  const remaining = Math.max(0, limit - entry.count);
  const resetTime = new Date(entry.resetTime);

  if (isAllowed) {
    entry.count++;
  }

  return {
    isAllowed,
    remaining,
    resetTime,
    retryAfter: !isAllowed
      ? Math.ceil((entry.resetTime - now) / 1000)
      : undefined,
  };
};

/**
 * Get IP address dari request
 * @param request - NextRequest object
 * @returns IP address string
 */
export const getClientIP = (request: Request): string => {
  // Check various headers for IP (proxy support)
  const headers = request.headers;
  return (headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown") as string;
};

/**
 * Create rate limit key dari IP + endpoint
 * @param ip - Client IP address
 * @param endpoint - API endpoint
 * @returns Rate limit key
 */
export const createRateLimitKey = (ip: string, endpoint: string): string => {
  return `${ip}:${endpoint}`;
};

/**
 * Clear rate limit untuk testing
 * @param key - Rate limit key (opsional - clear semua jika tidak ada)
 */
export const clearRateLimit = (key?: string): void => {
  if (key) {
    rateLimitStore.delete(key);
  } else {
    rateLimitStore.clear();
  }
};

/**
 * Cleanup old entries dari store (run secara periodic)
 */
export const cleanupRateLimitStore = (): void => {
  const now = Date.now();
  const keysToDelete: string[] = [];

  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetTime) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach((key) => rateLimitStore.delete(key));
};

// Run cleanup setiap 5 menit
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
