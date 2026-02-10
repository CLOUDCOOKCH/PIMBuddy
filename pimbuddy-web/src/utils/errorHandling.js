/**
 * Error Handling Utility
 * Standardized error handling and reporting
 */

import { ERROR_MESSAGES } from './constants.js';

/**
 * Error types
 */
export const ErrorType = {
    NETWORK: 'network',
    AUTH: 'auth',
    PERMISSION: 'permission',
    VALIDATION: 'validation',
    RATE_LIMIT: 'rate_limit',
    NOT_FOUND: 'not_found',
    CONFLICT: 'conflict',
    SERVER: 'server',
    UNKNOWN: 'unknown'
};

/**
 * Application Error class
 */
export class AppError extends Error {
    constructor(message, type = ErrorType.UNKNOWN, details = null, originalError = null) {
        super(message);
        this.name = 'AppError';
        this.type = type;
        this.details = details;
        this.originalError = originalError;
        this.timestamp = new Date();
    }

    /**
     * Get user-friendly error message
     */
    getUserMessage() {
        switch (this.type) {
            case ErrorType.NETWORK:
                return ERROR_MESSAGES.NETWORK_ERROR;
            case ErrorType.AUTH:
                return ERROR_MESSAGES.SESSION_EXPIRED;
            case ErrorType.PERMISSION:
                return ERROR_MESSAGES.PERMISSION_DENIED;
            case ErrorType.VALIDATION:
                return ERROR_MESSAGES.VALIDATION_FAILED;
            case ErrorType.RATE_LIMIT:
                return ERROR_MESSAGES.RATE_LIMIT;
            default:
                return this.message || ERROR_MESSAGES.UNKNOWN_ERROR;
        }
    }

    /**
     * Check if error is retriable
     */
    isRetriable() {
        return [ErrorType.NETWORK, ErrorType.RATE_LIMIT, ErrorType.SERVER].includes(this.type);
    }

    /**
     * Get suggested action
     */
    getSuggestedAction() {
        switch (this.type) {
            case ErrorType.NETWORK:
                return 'Check your internet connection and try again';
            case ErrorType.AUTH:
                return 'Please sign in again';
            case ErrorType.PERMISSION:
                return 'Contact your administrator for access';
            case ErrorType.VALIDATION:
                return 'Please check your input and try again';
            case ErrorType.RATE_LIMIT:
                return 'Please wait a moment and try again';
            case ErrorType.NOT_FOUND:
                return 'The requested resource was not found';
            default:
                return 'Please try again or contact support';
        }
    }
}

/**
 * Error Handler class
 */
export class ErrorHandler {
    constructor() {
        this.errorLog = [];
        this.maxLogSize = 100;
        this.onError = null;
    }

    /**
     * Handle error
     * @param {Error|AppError} error - Error to handle
     * @param {Object} context - Additional context
     * @returns {AppError} - Standardized app error
     */
    handle(error, context = {}) {
        // Convert to AppError if not already
        const appError = error instanceof AppError
            ? error
            : this.convertToAppError(error);

        // Log error
        this.logError(appError, context);

        // Call error callback if registered
        if (this.onError) {
            this.onError(appError, context);
        }

        return appError;
    }

    /**
     * Convert generic error to AppError
     */
    convertToAppError(error) {
        if (error instanceof AppError) {
            return error;
        }

        // Detect error type from message or HTTP status
        let type = ErrorType.UNKNOWN;
        let message = error.message || 'An error occurred';

        // Network errors
        if (message.includes('network') || message.includes('fetch failed')) {
            type = ErrorType.NETWORK;
        }
        // Auth errors
        else if (message.includes('auth') || message.includes('token') || message.includes('401')) {
            type = ErrorType.AUTH;
        }
        // Permission errors
        else if (message.includes('permission') || message.includes('403') || message.includes('forbidden')) {
            type = ErrorType.PERMISSION;
        }
        // Validation errors
        else if (message.includes('validation') || message.includes('invalid') || message.includes('400')) {
            type = ErrorType.VALIDATION;
        }
        // Rate limit errors
        else if (message.includes('rate limit') || message.includes('429') || message.includes('too many')) {
            type = ErrorType.RATE_LIMIT;
        }
        // Not found errors
        else if (message.includes('not found') || message.includes('404')) {
            type = ErrorType.NOT_FOUND;
        }
        // Conflict errors
        else if (message.includes('conflict') || message.includes('409') || message.includes('already exists')) {
            type = ErrorType.CONFLICT;
        }
        // Server errors
        else if (message.includes('500') || message.includes('503') || message.includes('server')) {
            type = ErrorType.SERVER;
        }

        return new AppError(message, type, null, error);
    }

    /**
     * Log error
     */
    logError(error, context) {
        const logEntry = {
            timestamp: new Date(),
            error: {
                message: error.message,
                type: error.type,
                stack: error.stack
            },
            context
        };

        this.errorLog.unshift(logEntry);

        // Trim log if too large
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog = this.errorLog.slice(0, this.maxLogSize);
        }

        // Log to console in development
        if (process.env.NODE_ENV !== 'production') {
            console.error('[Error]', error, context);
        }
    }

    /**
     * Get error log
     */
    getErrorLog() {
        return this.errorLog;
    }

    /**
     * Clear error log
     */
    clearErrorLog() {
        this.errorLog = [];
    }

    /**
     * Register error callback
     */
    registerErrorCallback(callback) {
        this.onError = callback;
    }
}

/**
 * Retry utility for transient failures
 */
export async function retryOperation(operation, options = {}) {
    const {
        maxRetries = 3,
        delayMs = 1000,
        exponentialBackoff = true,
        onRetry = null
    } = options;

    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;

            // Don't retry if not retriable
            if (error instanceof AppError && !error.isRetriable()) {
                throw error;
            }

            // Don't retry on last attempt
            if (attempt === maxRetries) {
                break;
            }

            // Calculate delay
            const delay = exponentialBackoff
                ? delayMs * Math.pow(2, attempt)
                : delayMs;

            // Call retry callback
            if (onRetry) {
                onRetry(attempt + 1, maxRetries, delay);
            }

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    // All retries exhausted
    throw lastError;
}

/**
 * Global error handler instance
 */
export const errorHandler = new ErrorHandler();

/**
 * Wrap async function with error handling
 */
export function withErrorHandling(fn, context = {}) {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            const appError = errorHandler.handle(error, context);
            throw appError;
        }
    };
}

/**
 * Create result object with error handling
 */
export function createResult(success, data = null, error = null) {
    return {
        success,
        data,
        error: error ? (error instanceof AppError ? error : errorHandler.convertToAppError(error)) : null,
        timestamp: new Date()
    };
}

/**
 * Safe execution wrapper
 * Returns result object instead of throwing
 */
export async function safeExecute(operation, context = {}) {
    try {
        const data = await operation();
        return createResult(true, data);
    } catch (error) {
        const appError = errorHandler.handle(error, context);
        return createResult(false, null, appError);
    }
}
