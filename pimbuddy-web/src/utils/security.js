/**
 * Security Utilities for PIMBuddy
 * Handles input validation, XSS protection, and OData query sanitization
 */

export class SecurityUtils {
    /**
     * Encode OData filter values to prevent injection
     * @param {string} value - Raw user input
     * @returns {string} - Safely encoded value
     */
    static encodeODataFilter(value) {
        if (!value) return '';

        // Encode single quotes and other special OData characters
        return value
            .replace(/'/g, "''")  // Escape single quotes
            .replace(/\\/g, '\\\\')  // Escape backslashes
            .replace(/\$/g, '\\$')   // Escape dollar signs
            .replace(/\(/g, '\\(')   // Escape parentheses
            .replace(/\)/g, '\\)');
    }

    /**
     * Build safe OData filter query
     * @param {string} field - Field name
     * @param {string} operator - OData operator (eq, ne, startswith, contains, etc.)
     * @param {string} value - User input value
     * @returns {string} - Safe OData filter string
     */
    static buildODataFilter(field, operator, value) {
        const safeValue = this.encodeODataFilter(value);

        // Validate operator against whitelist
        const validOperators = ['eq', 'ne', 'gt', 'ge', 'lt', 'le', 'startswith', 'endswith', 'contains'];
        if (!validOperators.includes(operator.toLowerCase())) {
            throw new Error(`Invalid OData operator: ${operator}`);
        }

        // Build filter based on operator type
        if (['startswith', 'endswith', 'contains'].includes(operator.toLowerCase())) {
            return `${operator}(${field},'${safeValue}')`;
        } else {
            return `${field} ${operator} '${safeValue}'`;
        }
    }

    /**
     * Comprehensive HTML escaping to prevent XSS
     * @param {string} text - Raw text to escape
     * @returns {string} - HTML-safe text
     */
    static escapeHtml(text) {
        if (text === null || text === undefined) return '';
        if (typeof text !== 'string') text = String(text);

        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Escape HTML attributes
     * @param {string} text - Raw text
     * @returns {string} - Attribute-safe text
     */
    static escapeHtmlAttribute(text) {
        if (text === null || text === undefined) return '';
        if (typeof text !== 'string') text = String(text);

        return text
            .replace(/&/g, '&amp;')
            .replace(/'/g, '&#39;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    /**
     * Sanitize URL to prevent javascript: protocol injection
     * @param {string} url - Raw URL
     * @returns {string} - Safe URL or empty string
     */
    static sanitizeUrl(url) {
        if (!url) return '';

        const trimmed = url.trim().toLowerCase();

        // Block dangerous protocols
        const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
        if (dangerousProtocols.some(proto => trimmed.startsWith(proto))) {
            console.warn(`Blocked dangerous URL: ${url}`);
            return '';
        }

        return url;
    }

    /**
     * Validate and sanitize user input
     * @param {string} input - Raw user input
     * @param {Object} options - Validation options
     * @returns {Object} - {valid: boolean, sanitized: string, error: string}
     */
    static validateInput(input, options = {}) {
        const {
            maxLength = 1000,
            minLength = 0,
            allowedChars = null,  // Regex pattern
            required = false
        } = options;

        // Check required
        if (required && (!input || input.trim().length === 0)) {
            return { valid: false, error: 'This field is required', sanitized: '' };
        }

        // Check length
        if (input && input.length > maxLength) {
            return { valid: false, error: `Maximum length is ${maxLength} characters`, sanitized: input.substring(0, maxLength) };
        }

        if (input && input.length < minLength) {
            return { valid: false, error: `Minimum length is ${minLength} characters`, sanitized: input };
        }

        // Check allowed characters
        if (allowedChars && input) {
            const regex = new RegExp(allowedChars);
            if (!regex.test(input)) {
                return { valid: false, error: 'Input contains invalid characters', sanitized: input };
            }
        }

        return { valid: true, sanitized: input || '', error: null };
    }
}

/**
 * Rate Limiter for API calls
 */
export class RateLimiter {
    constructor() {
        this.requests = new Map(); // endpoint -> [timestamps]
        this.limits = {
            default: { maxRequests: 60, windowMs: 60000 },      // 60 per minute
            search: { maxRequests: 30, windowMs: 60000 },       // 30 per minute for search
            mutation: { maxRequests: 20, windowMs: 60000 }      // 20 per minute for creates/updates/deletes
        };
    }

    /**
     * Check if request is allowed
     * @param {string} endpoint - API endpoint
     * @param {string} type - Request type (default, search, mutation)
     * @returns {boolean} - True if allowed
     */
    isAllowed(endpoint, type = 'default') {
        const now = Date.now();
        const limit = this.limits[type] || this.limits.default;

        // Get request history for this endpoint
        if (!this.requests.has(endpoint)) {
            this.requests.set(endpoint, []);
        }

        const history = this.requests.get(endpoint);

        // Remove old requests outside the time window
        const validRequests = history.filter(timestamp => now - timestamp < limit.windowMs);

        // Check if limit exceeded
        if (validRequests.length >= limit.maxRequests) {
            return false;
        }

        // Add current request
        validRequests.push(now);
        this.requests.set(endpoint, validRequests);

        return true;
    }

    /**
     * Get time until rate limit resets (in seconds)
     * @param {string} endpoint - API endpoint
     * @param {string} type - Request type
     * @returns {number} - Seconds until reset
     */
    getResetTime(endpoint, type = 'default') {
        const limit = this.limits[type] || this.limits.default;

        if (!this.requests.has(endpoint)) {
            return 0;
        }

        const history = this.requests.get(endpoint);
        if (history.length === 0) {
            return 0;
        }

        const oldestRequest = Math.min(...history);
        const resetTime = oldestRequest + limit.windowMs;
        const now = Date.now();

        return Math.max(0, Math.ceil((resetTime - now) / 1000));
    }

    /**
     * Clear rate limit history for endpoint
     * @param {string} endpoint - API endpoint
     */
    clear(endpoint) {
        this.requests.delete(endpoint);
    }

    /**
     * Clear all rate limit history
     */
    clearAll() {
        this.requests.clear();
    }
}

/**
 * Session Manager with timeout
 */
export class SessionManager {
    constructor(timeoutMinutes = 15, warningMinutes = 10) {
        this.timeoutMs = timeoutMinutes * 60 * 1000;
        this.warningMs = warningMinutes * 60 * 1000;
        this.lastActivity = Date.now();
        this.warningShown = false;
        this.timeoutCallback = null;
        this.warningCallback = null;
        this.checkInterval = null;
    }

    /**
     * Start session monitoring
     * @param {Function} onTimeout - Callback when session expires
     * @param {Function} onWarning - Callback for timeout warning
     */
    start(onTimeout, onWarning) {
        this.timeoutCallback = onTimeout;
        this.warningCallback = onWarning;
        this.lastActivity = Date.now();
        this.warningShown = false;

        // Set up activity listeners
        ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => this.recordActivity(), { passive: true });
        });

        // Check session every 30 seconds
        this.checkInterval = setInterval(() => this.checkSession(), 30000);
    }

    /**
     * Record user activity
     */
    recordActivity() {
        this.lastActivity = Date.now();
        this.warningShown = false;
    }

    /**
     * Check session status
     */
    checkSession() {
        const now = Date.now();
        const inactiveMs = now - this.lastActivity;

        // Session timeout
        if (inactiveMs >= this.timeoutMs) {
            this.stop();
            if (this.timeoutCallback) {
                this.timeoutCallback();
            }
            return;
        }

        // Show warning
        if (inactiveMs >= this.warningMs && !this.warningShown) {
            this.warningShown = true;
            if (this.warningCallback) {
                const remainingMinutes = Math.ceil((this.timeoutMs - inactiveMs) / 60000);
                this.warningCallback(remainingMinutes);
            }
        }
    }

    /**
     * Stop session monitoring
     */
    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    /**
     * Reset session timer
     */
    reset() {
        this.lastActivity = Date.now();
        this.warningShown = false;
    }

    /**
     * Get remaining time in minutes
     * @returns {number} - Minutes until timeout
     */
    getRemainingMinutes() {
        const now = Date.now();
        const inactiveMs = now - this.lastActivity;
        const remainingMs = this.timeoutMs - inactiveMs;
        return Math.max(0, Math.ceil(remainingMs / 60000));
    }
}

// Export singleton instances
export const rateLimiter = new RateLimiter();
export const sessionManager = new SessionManager(15, 10); // 15 min timeout, 10 min warning
