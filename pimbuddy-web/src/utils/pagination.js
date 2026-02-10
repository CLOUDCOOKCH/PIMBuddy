/**
 * Pagination Utility
 * Handles client-side and server-side pagination logic
 */

import { PAGINATION } from './constants.js';

export class Paginator {
    constructor(items = [], pageSize = PAGINATION.DEFAULT_PAGE_SIZE) {
        this.allItems = items;
        this.pageSize = pageSize;
        this.currentPage = 1;
        this.totalPages = Math.ceil(items.length / pageSize);
    }

    /**
     * Get items for current page
     * @returns {Array} - Items for current page
     */
    getCurrentPageItems() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.allItems.slice(start, end);
    }

    /**
     * Go to specific page
     * @param {number} page - Page number (1-indexed)
     * @returns {boolean} - Success
     */
    goToPage(page) {
        if (page < 1 || page > this.totalPages) {
            return false;
        }
        this.currentPage = page;
        return true;
    }

    /**
     * Go to next page
     * @returns {boolean} - Success
     */
    nextPage() {
        return this.goToPage(this.currentPage + 1);
    }

    /**
     * Go to previous page
     * @returns {boolean} - Success
     */
    previousPage() {
        return this.goToPage(this.currentPage - 1);
    }

    /**
     * Go to first page
     */
    firstPage() {
        this.currentPage = 1;
    }

    /**
     * Go to last page
     */
    lastPage() {
        this.currentPage = this.totalPages;
    }

    /**
     * Update items and recalculate pagination
     * @param {Array} items - New items array
     */
    updateItems(items) {
        this.allItems = items;
        this.totalPages = Math.ceil(items.length / this.pageSize);

        // Adjust current page if it's now out of bounds
        if (this.currentPage > this.totalPages) {
            this.currentPage = Math.max(1, this.totalPages);
        }
    }

    /**
     * Change page size
     * @param {number} newSize - New page size
     */
    setPageSize(newSize) {
        this.pageSize = newSize;
        this.totalPages = Math.ceil(this.allItems.length / this.pageSize);

        // Try to maintain roughly the same position
        const firstItemOnPage = (this.currentPage - 1) * this.pageSize;
        this.currentPage = Math.floor(firstItemOnPage / newSize) + 1;
    }

    /**
     * Get pagination info
     * @returns {Object} - Pagination metadata
     */
    getInfo() {
        const start = (this.currentPage - 1) * this.pageSize + 1;
        const end = Math.min(start + this.pageSize - 1, this.allItems.length);

        return {
            currentPage: this.currentPage,
            totalPages: this.totalPages,
            pageSize: this.pageSize,
            totalItems: this.allItems.length,
            start,
            end,
            hasNext: this.currentPage < this.totalPages,
            hasPrevious: this.currentPage > 1
        };
    }

    /**
     * Generate page number array for UI
     * @param {number} maxButtons - Maximum page buttons to show
     * @returns {Array} - Page numbers to display
     */
    getPageNumbers(maxButtons = 7) {
        if (this.totalPages <= maxButtons) {
            return Array.from({ length: this.totalPages }, (_, i) => i + 1);
        }

        const half = Math.floor(maxButtons / 2);
        let start = Math.max(1, this.currentPage - half);
        let end = Math.min(this.totalPages, start + maxButtons - 1);

        // Adjust start if we're near the end
        if (end - start < maxButtons - 1) {
            start = Math.max(1, end - maxButtons + 1);
        }

        const pages = [];

        // Always show first page
        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('...');
        }

        // Show middle pages
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Always show last page
        if (end < this.totalPages) {
            if (end < this.totalPages - 1) pages.push('...');
            pages.push(this.totalPages);
        }

        return pages;
    }

    /**
     * Render pagination controls HTML
     * @param {string} onPageChangeCallback - Function name to call on page change
     * @returns {string} - HTML string for pagination controls
     */
    renderControls(onPageChangeCallback = 'app.handlePageChange') {
        const info = this.getInfo();

        if (info.totalPages <= 1) {
            return ''; // No pagination needed
        }

        const pageNumbers = this.getPageNumbers();

        return `
            <div class="pagination-controls" style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-md); border-top: 1px solid var(--border-subtle); gap: var(--space-md); flex-wrap: wrap;">
                <!-- Page Info -->
                <div style="font-size: 0.85rem; color: var(--text-secondary); font-family: var(--font-mono);">
                    Showing <strong>${info.start}-${info.end}</strong> of <strong>${info.totalItems}</strong> items
                </div>

                <!-- Page Navigation -->
                <div style="display: flex; align-items: center; gap: var(--space-xs);">
                    <!-- First Page -->
                    <button
                        class="btn btn-sm btn-secondary"
                        onclick="${onPageChangeCallback}(1)"
                        ${!info.hasPrevious ? 'disabled' : ''}
                        title="First Page"
                        style="padding: var(--space-xs) var(--space-sm);">
                        <i class="fas fa-angle-double-left"></i>
                    </button>

                    <!-- Previous Page -->
                    <button
                        class="btn btn-sm btn-secondary"
                        onclick="${onPageChangeCallback}(${info.currentPage - 1})"
                        ${!info.hasPrevious ? 'disabled' : ''}
                        title="Previous Page"
                        style="padding: var(--space-xs) var(--space-sm);">
                        <i class="fas fa-angle-left"></i>
                    </button>

                    <!-- Page Numbers -->
                    ${pageNumbers.map(page => {
                        if (page === '...') {
                            return `<span style="padding: 0 var(--space-xs); color: var(--text-muted);">...</span>`;
                        }
                        return `
                            <button
                                class="btn btn-sm ${page === info.currentPage ? 'btn-primary' : 'btn-secondary'}"
                                onclick="${onPageChangeCallback}(${page})"
                                style="min-width: 36px; padding: var(--space-xs) var(--space-sm); font-family: var(--font-mono); font-size: 0.85rem;">
                                ${page}
                            </button>
                        `;
                    }).join('')}

                    <!-- Next Page -->
                    <button
                        class="btn btn-sm btn-secondary"
                        onclick="${onPageChangeCallback}(${info.currentPage + 1})"
                        ${!info.hasNext ? 'disabled' : ''}
                        title="Next Page"
                        style="padding: var(--space-xs) var(--space-sm);">
                        <i class="fas fa-angle-right"></i>
                    </button>

                    <!-- Last Page -->
                    <button
                        class="btn btn-sm btn-secondary"
                        onclick="${onPageChangeCallback}(${info.totalPages})"
                        ${!info.hasNext ? 'disabled' : ''}
                        title="Last Page"
                        style="padding: var(--space-xs) var(--space-sm);">
                        <i class="fas fa-angle-double-right"></i>
                    </button>
                </div>

                <!-- Page Size Selector -->
                <div style="display: flex; align-items: center; gap: var(--space-sm);">
                    <label style="font-size: 0.85rem; color: var(--text-secondary); font-family: var(--font-mono);">Items per page:</label>
                    <select
                        class="input input-select"
                        onchange="${onPageChangeCallback.replace('handlePageChange', 'handlePageSizeChange')}(parseInt(this.value))"
                        style="padding: var(--space-xs) var(--space-sm); font-size: 0.85rem; min-width: 80px;">
                        ${PAGINATION.PAGE_SIZE_OPTIONS.map(size => `
                            <option value="${size}" ${size === info.pageSize ? 'selected' : ''}>${size}</option>
                        `).join('')}
                    </select>
                </div>
            </div>
        `;
    }
}

/**
 * Helper function to create paginator instance
 * @param {Array} items - Items to paginate
 * @param {number} pageSize - Items per page
 * @returns {Paginator} - Paginator instance
 */
export function createPaginator(items, pageSize) {
    return new Paginator(items, pageSize);
}
