/**
 * Bulk Operations Utility
 * Handles multi-select and batch operations
 */

export class BulkOperationsManager {
    constructor() {
        this.selectedItems = new Set();
        this.allItems = [];
        this.onSelectionChange = null;
    }

    /**
     * Initialize bulk operations for a dataset
     * @param {Array} items - Array of items with id property
     * @param {Function} onSelectionChange - Callback when selection changes
     */
    initialize(items, onSelectionChange = null) {
        this.allItems = items;
        this.selectedItems.clear();
        this.onSelectionChange = onSelectionChange;
    }

    /**
     * Toggle item selection
     * @param {string} itemId - Item ID to toggle
     */
    toggleItem(itemId) {
        if (this.selectedItems.has(itemId)) {
            this.selectedItems.delete(itemId);
        } else {
            this.selectedItems.add(itemId);
        }

        if (this.onSelectionChange) {
            this.onSelectionChange(this.getSelectedItems());
        }
    }

    /**
     * Select all items
     */
    selectAll() {
        this.selectedItems.clear();
        this.allItems.forEach(item => {
            this.selectedItems.add(item.id);
        });

        if (this.onSelectionChange) {
            this.onSelectionChange(this.getSelectedItems());
        }
    }

    /**
     * Clear all selections
     */
    clearSelection() {
        this.selectedItems.clear();

        if (this.onSelectionChange) {
            this.onSelectionChange(this.getSelectedItems());
        }
    }

    /**
     * Check if item is selected
     */
    isSelected(itemId) {
        return this.selectedItems.has(itemId);
    }

    /**
     * Get selected item IDs
     */
    getSelectedIds() {
        return Array.from(this.selectedItems);
    }

    /**
     * Get selected items (full objects)
     */
    getSelectedItems() {
        return this.allItems.filter(item => this.selectedItems.has(item.id));
    }

    /**
     * Get selection count
     */
    getSelectionCount() {
        return this.selectedItems.size;
    }

    /**
     * Check if all items are selected
     */
    areAllSelected() {
        return this.selectedItems.size === this.allItems.length && this.allItems.length > 0;
    }

    /**
     * Check if some (but not all) items are selected
     */
    areSomeSelected() {
        return this.selectedItems.size > 0 && this.selectedItems.size < this.allItems.length;
    }

    /**
     * Render multi-select checkbox for table header
     */
    renderHeaderCheckbox(onChangeCallback = 'app.bulkOps.toggleAll') {
        const allSelected = this.areAllSelected();
        const someSelected = this.areSomeSelected();
        const indeterminate = someSelected ? 'indeterminate' : '';

        return `
            <input
                type="checkbox"
                class="bulk-checkbox header-checkbox ${indeterminate}"
                ${allSelected ? 'checked' : ''}
                onchange="${onChangeCallback}(this)"
                title="${allSelected ? 'Deselect All' : 'Select All'}"
            >
        `;
    }

    /**
     * Render multi-select checkbox for table row
     */
    renderRowCheckbox(itemId, onChangeCallback = 'app.bulkOps.toggleItem') {
        const isSelected = this.isSelected(itemId);

        return `
            <input
                type="checkbox"
                class="bulk-checkbox"
                ${isSelected ? 'checked' : ''}
                onchange="${onChangeCallback}('${itemId}')"
                data-item-id="${itemId}"
            >
        `;
    }

    /**
     * Render bulk actions toolbar
     */
    renderBulkActionsToolbar(actions = []) {
        const count = this.getSelectionCount();

        if (count === 0) {
            return ''; // Hide toolbar when nothing selected
        }

        return `
            <div class="bulk-actions-toolbar" style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); background: var(--accent-primary-dim); border: 1px solid var(--accent-primary); border-radius: var(--radius-md); margin-bottom: var(--space-md); animation: slideDown 0.2s ease-out;">
                <div style="display: flex; align-items: center; gap: var(--space-sm); flex: 1;">
                    <div style="width: 32px; height: 32px; background: var(--accent-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-check" style="color: var(--bg-primary); font-size: 0.9rem;"></i>
                    </div>
                    <div>
                        <div style="font-family: var(--font-display); font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">
                            ${count} ${count === 1 ? 'item' : 'items'} selected
                        </div>
                        <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">
                            Choose an action below
                        </div>
                    </div>
                </div>

                <div style="display: flex; align-items: center; gap: var(--space-sm);">
                    ${actions.map(action => `
                        <button
                            class="btn btn-sm ${action.variant || 'btn-secondary'}"
                            onclick="${action.onClick}"
                            ${action.disabled ? 'disabled' : ''}
                            title="${action.description || action.label}"
                            style="font-family: var(--font-mono); font-size: 0.75rem;">
                            <i class="fas ${action.icon}"></i> ${action.label}
                        </button>
                    `).join('')}

                    <button
                        class="btn btn-sm btn-secondary"
                        onclick="app.bulkOps.clearSelection()"
                        title="Clear Selection"
                        style="font-family: var(--font-mono); font-size: 0.75rem;">
                        <i class="fas fa-times"></i> Clear
                    </button>
                </div>
            </div>
        `;
    }
}

/**
 * Execute bulk operation with progress tracking
 * @param {Array} items - Items to process
 * @param {Function} operation - Async operation to perform on each item
 * @param {Function} onProgress - Progress callback
 * @param {Function} onComplete - Completion callback
 */
export async function executeBulkOperation(items, operation, onProgress, onComplete) {
    const results = {
        total: items.length,
        succeeded: 0,
        failed: 0,
        errors: []
    };

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        try {
            await operation(item);
            results.succeeded++;
        } catch (error) {
            results.failed++;
            results.errors.push({
                item: item,
                error: error.message
            });
        }

        // Report progress
        if (onProgress) {
            onProgress({
                current: i + 1,
                total: items.length,
                percentage: Math.round(((i + 1) / items.length) * 100)
            });
        }

        // Small delay to prevent rate limiting
        if (i < items.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    // Report completion
    if (onComplete) {
        onComplete(results);
    }

    return results;
}

/**
 * Render progress modal for bulk operations
 */
export function renderBulkProgressModal(progress) {
    const percentage = progress.percentage || 0;

    return `
        <div style="text-align: center; padding: var(--space-xl);">
            <div style="width: 80px; height: 80px; margin: 0 auto var(--space-lg); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center; animation: pulse 2s ease-in-out infinite;">
                <i class="fas fa-cog fa-spin" style="font-size: 2.5rem; color: var(--accent-primary);"></i>
            </div>

            <h2 style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; margin-bottom: var(--space-sm);">
                Processing Bulk Operation
            </h2>

            <p style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--space-xl);">
                ${progress.current} of ${progress.total} items processed
            </p>

            <!-- Progress Bar -->
            <div style="width: 100%; height: 8px; background: var(--bg-elevated); border-radius: var(--radius-full); overflow: hidden; margin-bottom: var(--space-sm);">
                <div style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)); transition: width 0.3s ease-out;"></div>
            </div>

            <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: var(--accent-primary);">
                ${percentage}%
            </div>

            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: var(--space-lg); font-family: var(--font-mono);">
                Please wait while we process your request...
            </p>
        </div>
    `;
}

/**
 * Render results modal for bulk operations
 */
export function renderBulkResultsModal(results) {
    const hasErrors = results.failed > 0;

    return `
        <div style="text-align: center; padding: var(--space-xl);">
            <div style="width: 100px; height: 100px; margin: 0 auto var(--space-lg); background: ${hasErrors ? 'var(--color-warning-dim)' : 'var(--color-success-dim)'}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <i class="fas ${hasErrors ? 'fa-exclamation-triangle' : 'fa-check-circle'}" style="font-size: 3.5rem; color: ${hasErrors ? 'var(--color-warning)' : 'var(--color-success)'};"></i>
            </div>

            <h2 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; margin-bottom: var(--space-md);">
                ${hasErrors ? 'Partially Complete' : 'Operation Complete'}
            </h2>

            <div class="stats-grid" style="margin-bottom: var(--space-lg);">
                <div class="card stat-card" style="text-align: center;">
                    <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; color: var(--color-success);">
                        ${results.succeeded}
                    </div>
                    <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">
                        Succeeded
                    </div>
                </div>

                ${hasErrors ? `
                    <div class="card stat-card" style="text-align: center;">
                        <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; color: var(--color-error);">
                            ${results.failed}
                        </div>
                        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">
                            Failed
                        </div>
                    </div>
                ` : ''}
            </div>

            ${hasErrors && results.errors.length > 0 ? `
                <details style="text-align: left; margin-top: var(--space-lg); padding: var(--space-md); background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                    <summary style="cursor: pointer; font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">
                        View Errors (${results.errors.length})
                    </summary>
                    <div style="margin-top: var(--space-md); max-height: 200px; overflow-y: auto;">
                        ${results.errors.map(err => `
                            <div style="padding: var(--space-sm); margin-bottom: var(--space-xs); background: var(--color-error-dim); border-left: 3px solid var(--color-error); border-radius: var(--radius-sm); font-size: 0.85rem; font-family: var(--font-mono);">
                                <strong>${err.item.displayName || err.item.id}:</strong> ${err.error}
                            </div>
                        `).join('')}
                    </div>
                </details>
            ` : ''}

            <button class="btn btn-primary" onclick="app.closeModal()" style="margin-top: var(--space-xl); font-family: var(--font-mono);">
                <i class="fas fa-check"></i> Done
            </button>
        </div>
    `;
}
