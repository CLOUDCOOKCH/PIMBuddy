/**
 * Page Router
 * Centralized navigation and page rendering logic
 */

export class PageRouter {
    constructor() {
        this.currentPage = 'dashboard';
        this.pages = new Map();
        this.pageLoaders = new Map(); // For lazy loading
        this.loadedPages = new Map(); // Cache loaded pages
        this.beforeNavigate = null;
        this.afterNavigate = null;
    }

    /**
     * Register a page (immediate loading)
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
     * Register a page loader (lazy loading)
     * @param {string} name - Page name/route
     * @param {Function} loader - Function that returns import() promise
     */
    registerPageLoader(name, loader) {
        if (typeof loader !== 'function') {
            throw new Error(`Page loader for ${name} must be a function`);
        }
        this.pageLoaders.set(name, loader);
    }

    /**
     * Register multiple page loaders at once
     * @param {Object} loaderMap - Map of page names to loader functions
     */
    registerPageLoaders(loaderMap) {
        Object.entries(loaderMap).forEach(([name, loader]) => {
            this.registerPageLoader(name, loader);
        });
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
     * Navigate to a page (supports both eager and lazy loaded pages)
     * @param {string} pageName - Page to navigate to
     * @param {Object} params - Optional parameters to pass to page
     * @returns {Promise<boolean>} Success status
     */
    async navigateTo(pageName, params = {}) {
        // Check if page exists (either registered or has loader)
        if (!this.pages.has(pageName) && !this.pageLoaders.has(pageName)) {
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
            const container = document.getElementById(`page-${pageName}`);

            if (!container) {
                console.error(`[PageRouter] Container not found for page: ${pageName}`);
                return false;
            }

            // Show loading state while loading page module
            this.showLoadingState(container);

            // Get or load page instance
            let pageInstance = this.pages.get(pageName);

            // If not registered, try lazy loading
            if (!pageInstance && this.pageLoaders.has(pageName)) {
                pageInstance = await this.loadPage(pageName);
            }

            if (!pageInstance) {
                throw new Error(`Failed to load page: ${pageName}`);
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
     * Lazy load a page module
     * @param {string} pageName - Page name
     * @returns {Promise<Object>} Page instance
     */
    async loadPage(pageName) {
        // Return cached if already loaded
        if (this.loadedPages.has(pageName)) {
            return this.loadedPages.get(pageName);
        }

        const loader = this.pageLoaders.get(pageName);
        if (!loader) {
            throw new Error(`No loader found for page: ${pageName}`);
        }

        console.log(`[PageRouter] Lazy loading page: ${pageName}`);

        // Execute loader (dynamic import)
        const module = await loader();

        // Get page instance from module
        let pageInstance;

        if (module.default) {
            pageInstance = module.default;
        } else if (module.render) {
            // If module exports render directly, wrap it
            pageInstance = { render: module.render };
        } else {
            throw new Error(`Page module ${pageName} must export default or render function`);
        }

        // Cache the loaded page
        this.loadedPages.set(pageName, pageInstance);

        return pageInstance;
    }

    /**
     * Show loading state in container
     * @param {HTMLElement} container - Container element
     */
    showLoadingState(container) {
        container.innerHTML = `
            <div class="page-loading" style="display: flex; align-items: center; justify-content: center; min-height: 400px;">
                <div style="text-align: center;">
                    <div class="spinner" style="margin: 0 auto var(--space-md);"></div>
                    <p style="color: var(--text-secondary);">Loading page...</p>
                </div>
            </div>
        `;
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
     * Check if page exists (registered or has loader)
     * @param {string} pageName - Page name to check
     * @returns {boolean}
     */
    hasPage(pageName) {
        return this.pages.has(pageName) || this.pageLoaders.has(pageName);
    }

    /**
     * Get registered pages (both eager and lazy)
     * @returns {Array<string>}
     */
    getRegisteredPages() {
        const eagerPages = Array.from(this.pages.keys());
        const lazyPages = Array.from(this.pageLoaders.keys());
        return [...new Set([...eagerPages, ...lazyPages])];
    }

    /**
     * Clear loaded page cache
     * @param {string} pageName - Optional: specific page to clear, or all if not specified
     */
    clearPageCache(pageName = null) {
        if (pageName) {
            this.loadedPages.delete(pageName);
            console.log(`[PageRouter] Cleared cache for page: ${pageName}`);
        } else {
            this.loadedPages.clear();
            console.log('[PageRouter] Cleared all page caches');
        }
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
