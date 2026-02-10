/**
 * Page Router
 * Centralized navigation and page rendering logic
 */

export class PageRouter {
    constructor() {
        this.currentPage = 'dashboard';
        this.pages = new Map();
        this.beforeNavigate = null;
        this.afterNavigate = null;
    }

    /**
     * Register a page
     * @param {string} name - Page name/route
     * @param {Object} pageInstance - Page instance with render() method
     */
    registerPage(name, pageInstance) {
        if (!pageInstance || typeof pageInstance.render !== 'function') {
            throw new Error(`Page ${name} must have a render() method`);
        }
        this.pages.set(name, pageInstance);
    }

    /**
     * Register multiple pages at once
     * @param {Object} pageMap - Map of page names to instances
     */
    registerPages(pageMap) {
        Object.entries(pageMap).forEach(([name, instance]) => {
            this.registerPage(name, instance);
        });
    }

    /**
     * Navigate to a page
     * @param {string} pageName - Page to navigate to
     * @param {Object} params - Optional parameters to pass to page
     * @returns {Promise<boolean>} Success status
     */
    async navigateTo(pageName, params = {}) {
        // Check if page exists
        if (!this.pages.has(pageName)) {
            console.error(`[PageRouter] Page not found: ${pageName}`);
            return false;
        }

        // Before navigate hook
        if (this.beforeNavigate) {
            const canNavigate = await this.beforeNavigate(this.currentPage, pageName, params);
            if (canNavigate === false) {
                return false;
            }
        }

        // Update navigation UI
        this.updateNavigation(pageName);

        // Update page visibility
        this.updatePageVisibility(pageName);

        // Store current page
        const previousPage = this.currentPage;
        this.currentPage = pageName;

        try {
            // Get page instance and render
            const pageInstance = this.pages.get(pageName);
            const container = document.getElementById(`page-${pageName}`);

            if (!container) {
                console.error(`[PageRouter] Container not found for page: ${pageName}`);
                return false;
            }

            // Render page
            await pageInstance.render(container, params);

            // After navigate hook
            if (this.afterNavigate) {
                await this.afterNavigate(previousPage, pageName, params);
            }

            return true;

        } catch (error) {
            console.error(`[PageRouter] Error rendering page ${pageName}:`, error);

            // Show error state
            this.showErrorState(pageName, error);

            return false;
        }
    }

    /**
     * Update navigation UI (active state)
     * @param {string} pageName - Active page name
     */
    updateNavigation(pageName) {
        // Update nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === pageName) {
                item.classList.add('active');
            }
        });
    }

    /**
     * Update page visibility
     * @param {string} pageName - Page to show
     */
    updatePageVisibility(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(`page-${pageName}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }

    /**
     * Show error state for page
     * @param {string} pageName - Page that errored
     * @param {Error} error - Error object
     */
    showErrorState(pageName, error) {
        const container = document.getElementById(`page-${pageName}`);
        if (!container) return;

        container.innerHTML = `
            <div class="error-state" style="text-align: center; padding: var(--space-2xl);">
                <div style="width: 120px; height: 120px; margin: 0 auto var(--space-xl); background: var(--color-error-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3.5rem; color: var(--color-error);"></i>
                </div>
                <h2 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; margin-bottom: var(--space-md); color: var(--color-error);">
                    Error Loading Page
                </h2>
                <p style="color: var(--text-secondary); margin-bottom: var(--space-xl); font-family: var(--font-mono); font-size: 0.9rem;">
                    ${error.message || 'An unexpected error occurred'}
                </p>
                <button class="btn btn-primary" onclick="app.router.navigateTo('${pageName}')">
                    <i class="fas fa-redo"></i> Try Again
                </button>
                <button class="btn btn-secondary" onclick="app.router.navigateTo('dashboard')" style="margin-left: var(--space-sm);">
                    <i class="fas fa-home"></i> Go to Dashboard
                </button>
            </div>
        `;
    }

    /**
     * Refresh current page
     * @param {Object} params - Optional parameters
     * @returns {Promise<boolean>}
     */
    async refreshCurrentPage(params = {}) {
        return await this.navigateTo(this.currentPage, params);
    }

    /**
     * Get current page name
     * @returns {string}
     */
    getCurrentPage() {
        return this.currentPage;
    }

    /**
     * Check if page exists
     * @param {string} pageName - Page name to check
     * @returns {boolean}
     */
    hasPage(pageName) {
        return this.pages.has(pageName);
    }

    /**
     * Get registered pages
     * @returns {Array<string>}
     */
    getRegisteredPages() {
        return Array.from(this.pages.keys());
    }

    /**
     * Set before navigate hook
     * @param {Function} callback - Callback(fromPage, toPage, params) => boolean
     */
    setBeforeNavigate(callback) {
        this.beforeNavigate = callback;
    }

    /**
     * Set after navigate hook
     * @param {Function} callback - Callback(fromPage, toPage, params)
     */
    setAfterNavigate(callback) {
        this.afterNavigate = callback;
    }
}

/**
 * Base Page class that all pages extend
 */
export class BasePage {
    constructor(app) {
        this.app = app;
    }

    /**
     * Render page (must be implemented by subclass)
     * @param {HTMLElement} container - Container element
     * @param {Object} params - Optional parameters
     */
    async render(container, params = {}) {
        throw new Error('render() must be implemented by subclass');
    }

    /**
     * Show loading state
     * @param {string} message - Loading message
     */
    showLoading(message = 'Loading...') {
        if (this.app && this.app.showLoading) {
            this.app.showLoading(message);
        }
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        if (this.app && this.app.hideLoading) {
            this.app.hideLoading();
        }
    }

    /**
     * Show toast notification
     * @param {string} message - Message
     * @param {string} type - Type (success, error, warning, info)
     */
    showToast(message, type = 'info') {
        if (this.app && this.app.showToast) {
            this.app.showToast(message, type);
        }
    }

    /**
     * Show modal
     * @param {string} content - Modal HTML content
     */
    showModal(content) {
        if (this.app && this.app.showModal) {
            this.app.showModal(content);
        }
    }

    /**
     * Close modal
     */
    closeModal() {
        if (this.app && this.app.closeModal) {
            this.app.closeModal();
        }
    }

    /**
     * Escape HTML for XSS protection
     * @param {string} text - Text to escape
     * @returns {string}
     */
    escapeHtml(text) {
        if (this.app && this.app.escapeHtml) {
            return this.app.escapeHtml(text);
        }
        // Fallback
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Get cached data
     * @param {string} key - Cache key
     * @returns {*}
     */
    getCached(key) {
        return this.app?.cacheManager?.get(key) || null;
    }

    /**
     * Set cached data
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     */
    setCached(key, value) {
        this.app?.cacheManager?.set(key, value);
    }

    /**
     * Check if user is connected
     * @returns {boolean}
     */
    isConnected() {
        return this.app?.isConnected || false;
    }
}
