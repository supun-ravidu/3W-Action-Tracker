/**
 * Firebase Query Cache
 * Prevents duplicate reads within a short time window to avoid quota exhaustion
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class FirebaseCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 300000; // 5 minutes default cache (optimized for quota)

  /**
   * Get cached data or null if expired/not found
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now > entry.expiresAt) {
      // Expired, remove from cache
      this.cache.delete(key);
      return null;
    }

    console.log(`✓ Cache hit for: ${key} (age: ${Math.round((now - entry.timestamp) / 1000)}s)`);
    return entry.data as T;
  }

  /**
   * Set cache data with optional custom TTL
   */
  set<T>(key: string, data: T, ttlMs?: number): void {
    const now = Date.now();
    const ttl = ttlMs ?? this.defaultTTL;
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });

    console.log(`✓ Cached: ${key} (TTL: ${Math.round(ttl / 1000)}s)`);
  }

  /**
   * Invalidate a specific cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key);
    console.log(`✓ Invalidated cache: ${key}`);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    console.log('✓ Cleared all cache');
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    let removed = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }
    
    if (removed > 0) {
      console.log(`✓ Cleaned up ${removed} expired cache entries`);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

// Singleton instance
export const firebaseCache = new FirebaseCache();

// Auto cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    firebaseCache.cleanup();
  }, 300000);
}

/**
 * Helper function to wrap Firebase queries with caching
 */
export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttlMs: number = 60000
): Promise<T> {
  // Check cache first
  const cached = firebaseCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Execute query
  console.log(`⚡ Firebase query: ${key}`);
  const result = await queryFn();
  
  // Cache result
  firebaseCache.set(key, result, ttlMs);
  
  return result;
}
