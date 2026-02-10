/**
 * Cache Manager with TTL (Time To Live) Support
 * Intelligent caching strategy for different data types
 */

export const CACHE_KEYS = {
    // Immutable or rarely changing data (24 hours)
    ROLES: { key: 'roles', ttl: 24 * 60 * 60 * 1000 },
    ROLE_DEFINITIONS: { key: 'roleDefinitions', ttl: 24 * 60 * 60 * 1000 },

    // Semi-static data (5 minutes)
    GROUPS: { key: 'groups', ttl: 5 * 60 * 1000 },
    TEMPLATES: { key: 'templates', ttl: 5 * 60 * 1000 },
    HEALTH_CHECK: { key: 'healthCheck', ttl: 5 * 60 * 1000 },
    COVERAGE: { key: 'coverage', ttl: 5 * 60 * 1000 },

    // Frequently changing data (2 minutes)
    ASSIGNMENTS: { key: 'assignments', ttl: 2 * 60 * 1000 },
    EXPIRING_ASSIGNMENTS: { key: 'expiringAssignments', ttl: 2 * 60 * 1000 },

    // Real-time data (1 minute)
    APPROVALS: { key: 'approvals', ttl: 1 * 60 * 1000 },
    AUDIT_LOGS: { key: 'auditLogs', ttl: 1 * 60 * 1000 },

    // Dashboard aggregates (30 seconds)
    DASHBOARD_STATS: { key: 'dashboardStats', ttl: 30 * 1000 }
};

export class CacheManager {
    constructor() {
        this.cache = new Map();
        this.timestamps = new Map();
        this.hitCount = 0;
        this.missCount = 0;
    }

    /**
     * Get cached value if not expired
     * @param {string} key - Cache key
     * @param {number} customTTL - Optional custom TTL in milliseconds
     * @returns {*} Cached value or null if expired/missing
     */
    get(key, customTTL = null) {
        if (!this.cache.has(key)) {
            this.missCount++;
            return null;
        }

        const age = Date.now() - this.timestamps.get(key);
        const ttl = customTTL || this.getDefaultTTL(key);

        if (age > ttl) {
            // Expired - remove from cache
            this.cache.delete(key);
            this.timestamps.delete(key);
            this.missCount++;
            return null;
        }

        this.hitCount++;
        return this.cache.get(key);
    }

    /**
     * Set cached value with timestamp
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     * @param {number} customTTL - Optional custom TTL in milliseconds
     */
    set(key, value, customTTL = null) {
        this.cache.set(key, value);
        this.timestamps.set(key, Date.now());

        // Store custom TTL if provided
        if (customTTL) {
            this.cache.set(`${key}__ttl`, customTTL);
        }
    }

    /**
     * Check if key exists and is not expired
     * @param {string} key - Cache key
     * @returns {boolean}
     */
    has(key) {
        return this.get(key) !== null;
    }

    /**
     * Invalidate specific cache entry
     * @param {string} key - Cache key to invalidate
     */
    invalidate(key) {
        this.cache.delete(key);
        this.timestamps.delete(key);
        this.cache.delete(`${key}__ttl`);
    }

    /**
     * Invalidate multiple cache entries by pattern
     * @param {RegExp|string} pattern - Pattern to match keys
     */
    invalidatePattern(pattern) {
        const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
        const keysToDelete = [];

        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                keysToDelete.push(key);
            }
        }

        keysToDelete.forEach(key => this.invalidate(key));
    }

    /**
     * Clear all cache entries
     */
    clear() {
        this.cache.clear();
        this.timestamps.clear();
        this.hitCount = 0;
        this.missCount = 0;
    }

    /**
     * Clear expired entries
     * @returns {number} Number of entries cleared
     */
    clearExpired() {
        let clearedCount = 0;
        const keysToDelete = [];

        for (const [key, timestamp] of this.timestamps.entries()) {
            const age = Date.now() - timestamp;
            const ttl = this.getDefaultTTL(key);

            if (age > ttl) {
                keysToDelete.push(key);
            }
        }

        keysToDelete.forEach(key => {
            this.invalidate(key);
            clearedCount++;
        });

        return clearedCount;
    }

    /**
     * Get default TTL for a key
     * @param {string} key - Cache key
     * @returns {number} TTL in milliseconds
     */
    getDefaultTTL(key) {
        // Check if custom TTL stored
        const customTTL = this.cache.get(`${key}__ttl`);
        if (customTTL) return customTTL;

        // Look up in CACHE_KEYS
        const cacheKeyConfig = Object.values(CACHE_KEYS).find(c => c.key === key);
        if (cacheKeyConfig) return cacheKeyConfig.ttl;

        // Default: 5 minutes
        return 5 * 60 * 1000;
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache stats
     */
    getStats() {
        const totalRequests = this.hitCount + this.missCount;
        const hitRate = totalRequests > 0
            ? ((this.hitCount / totalRequests) * 100).toFixed(2)
            : 0;

        return {
            size: this.cache.size,
            hits: this.hitCount,
            misses: this.missCount,
            hitRate: `${hitRate}%`,
            totalRequests
        };
    }

    /**
     * Get age of cached entry
     * @param {string} key - Cache key
     * @returns {number} Age in milliseconds or -1 if not found
     */
    getAge(key) {
        if (!this.timestamps.has(key)) return -1;
        return Date.now() - this.timestamps.get(key);
    }

    /**
     * Get remaining TTL for cached entry
     * @param {string} key - Cache key
     * @returns {number} Remaining TTL in milliseconds or -1 if not found
     */
    getRemainingTTL(key) {
        if (!this.timestamps.has(key)) return -1;

        const age = this.getAge(key);
        const ttl = this.getDefaultTTL(key);

        return Math.max(0, ttl - age);
    }

    /**
     * Warm cache with data
     * @param {Object} data - Key-value pairs to cache
     */
    warmCache(data) {
        Object.entries(data).forEach(([key, value]) => {
            this.set(key, value);
        });
    }

    /**
     * Get all cache keys
     * @returns {Array<string>}
     */
    getKeys() {
        return Array.from(this.cache.keys()).filter(k => !k.endsWith('__ttl'));
    }

    /**
     * Export cache state (for debugging)
     * @returns {Object}
     */
    exportState() {
        const state = {};

        for (const key of this.getKeys()) {
            state[key] = {
                value: this.cache.get(key),
                age: this.getAge(key),
                remainingTTL: this.getRemainingTTL(key),
                ttl: this.getDefaultTTL(key)
            };
        }

        return state;
    }
}

/**
 * Global cache manager instance
 */
export const cacheManager = new CacheManager();

/**
 * Auto-cleanup expired entries every 5 minutes
 */
setInterval(() => {
    const cleared = cacheManager.clearExpired();
    if (cleared > 0) {
        console.log(`[CacheManager] Auto-cleaned ${cleared} expired entries`);
    }
}, 5 * 60 * 1000);
