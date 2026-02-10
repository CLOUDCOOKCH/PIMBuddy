/**
 * UI Components Utility
 * Reusable UI components for consistent design
 */

import { SecurityUtils } from './security.js';

/**
 * UI Components class
 */
export class UIComponents {
    /**
     * Render page header with title and actions
     */
    static renderPageHeader(title, actions = []) {
        return `
            <div class="page-header-row">
                <h1 class="page-header">${SecurityUtils.escapeHtml(title)}</h1>
                ${actions.length > 0 ? `
                    <div style="display: flex; gap: var(--space-sm);">
                        ${actions.map(action => `
                            <button
                                class="btn ${action.variant || 'btn-primary'}"
                                onclick="${action.onClick}"
                                ${action.disabled ? 'disabled' : ''}
                                title="${action.description || action.label}">
                                ${action.icon ? `<i class="fas ${action.icon}"></i>` : ''} ${SecurityUtils.escapeHtml(action.label)}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render toolbar with search and actions
     */
    static renderToolbar(config = {}) {
        const {
            searchPlaceholder = 'Search...',
            searchId = 'search',
            searchCallback = null,
            actions = [],
            filters = []
        } = config;

        return `
            <div class="toolbar">
                ${searchCallback ? `
                    <input
                        type="text"
                        id="${searchId}"
                        class="input"
                        placeholder="${searchPlaceholder}"
                        oninput="${searchCallback}(this.value)">
                ` : ''}

                ${filters.map(filter => `
                    <select
                        id="${filter.id}"
                        class="input input-select"
                        onchange="${filter.onChange}(this.value)">
                        ${filter.options.map(opt => `
                            <option value="${opt.value}" ${opt.selected ? 'selected' : ''}>
                                ${SecurityUtils.escapeHtml(opt.label)}
                            </option>
                        `).join('')}
                    </select>
                `).join('')}

                ${actions.map(action => `
                    <button
                        class="btn ${action.variant || 'btn-secondary'}"
                        onclick="${action.onClick}"
                        ${action.disabled ? 'disabled' : ''}
                        title="${action.description || action.label}">
                        ${action.icon ? `<i class="fas ${action.icon}"></i>` : ''} ${SecurityUtils.escapeHtml(action.label)}
                    </button>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render badge
     */
    static renderBadge(text, variant = 'default') {
        const variantClass = variant !== 'default' ? `badge-${variant}` : '';
        return `<span class="badge ${variantClass}">${SecurityUtils.escapeHtml(text)}</span>`;
    }

    /**
     * Render privilege badge
     */
    static renderPrivilegeBadge(level) {
        const config = {
            critical: { class: 'badge-critical', icon: 'fa-skull-crossbones', label: 'Critical' },
            high: { class: 'badge-high', icon: 'fa-exclamation-triangle', label: 'High' },
            medium: { class: 'badge-medium', icon: 'fa-shield-alt', label: 'Medium' },
            low: { class: 'badge-low', icon: 'fa-check-circle', label: 'Low' }
        };
        const c = config[level] || config.low;
        return `<span class="badge privilege-badge ${c.class}"><i class="fas ${c.icon}"></i> ${c.label}</span>`;
    }

    /**
     * Render icon button
     */
    static renderIconButton(icon, onClick, options = {}) {
        const {
            title = '',
            variant = '',
            disabled = false,
            size = ''
        } = options;

        return `
            <button
                class="icon-btn ${variant} ${size}"
                onclick="${onClick}"
                ${disabled ? 'disabled' : ''}
                title="${title}">
                <i class="fas ${icon}"></i>
            </button>
        `;
    }

    /**
     * Render empty state
     */
    static renderEmptyState(config = {}) {
        const {
            icon = 'fa-inbox',
            title = 'No Data',
            message = 'No items found',
            action = null
        } = config;

        return `
            <div class="empty-state" style="text-align: center; padding: var(--space-2xl) var(--space-lg); color: var(--text-secondary);">
                <div style="width: 120px; height: 120px; margin: 0 auto var(--space-xl); background: var(--bg-elevated); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas ${icon}" style="font-size: 3.5rem; color: var(--text-muted); opacity: 0.5;"></i>
                </div>
                <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin-bottom: var(--space-sm); color: var(--text-primary);">
                    ${SecurityUtils.escapeHtml(title)}
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-muted); margin-bottom: ${action ? 'var(--space-xl)' : '0'};">
                    ${SecurityUtils.escapeHtml(message)}
                </div>
                ${action ? `
                    <button class="btn btn-primary" onclick="${action.onClick}">
                        ${action.icon ? `<i class="fas ${action.icon}"></i>` : ''} ${SecurityUtils.escapeHtml(action.label)}
                    </button>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render loading state
     */
    static renderLoadingState(message = 'Loading...') {
        return `
            <div class="loading-state" style="text-align: center; padding: var(--space-2xl) var(--space-lg);">
                <div style="width: 80px; height: 80px; margin: 0 auto var(--space-lg); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center; animation: pulse 2s ease-in-out infinite;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 2.5rem; color: var(--accent-primary);"></i>
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-secondary);">
                    ${SecurityUtils.escapeHtml(message)}
                </div>
            </div>
        `;
    }

    /**
     * Render stat card
     */
    static renderStatCard(config = {}) {
        const {
            icon = 'fa-chart-bar',
            value = '0',
            label = 'Stat',
            color = 'primary',
            trend = null
        } = config;

        return `
            <div class="card stat-card" style="position: relative; overflow: hidden;">
                <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, var(--accent-${color}-dim), transparent); filter: blur(40px);"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="width: 56px; height: 56px; background: var(--accent-${color}-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                        <i class="fas ${icon}" style="font-size: 1.5rem; color: var(--accent-${color});"></i>
                    </div>
                    <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: var(--text-primary);">
                        ${SecurityUtils.escapeHtml(String(value))}
                    </div>
                    <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">
                        ${SecurityUtils.escapeHtml(label)}
                    </div>
                    ${trend ? `
                        <div style="margin-top: var(--space-sm); font-size: 0.8rem; color: ${trend.direction === 'up' ? 'var(--color-success)' : 'var(--color-error)'};">
                            <i class="fas fa-arrow-${trend.direction}"></i> ${SecurityUtils.escapeHtml(trend.value)}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Render modal
     */
    static renderModal(config = {}) {
        const {
            title = 'Modal',
            content = '',
            actions = [],
            size = 'md',
            showClose = true
        } = config;

        return `
            <div class="modal-header">
                <h2 class="modal-title">${SecurityUtils.escapeHtml(title)}</h2>
                ${showClose ? `
                    <button class="modal-close" onclick="app.closeModal()" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </div>
            <div class="modal-body modal-${size}">
                ${content}
            </div>
            ${actions.length > 0 ? `
                <div class="modal-footer">
                    ${actions.map(action => `
                        <button
                            class="btn ${action.variant || 'btn-primary'}"
                            onclick="${action.onClick}"
                            ${action.disabled ? 'disabled' : ''}>
                            ${action.icon ? `<i class="fas ${action.icon}"></i>` : ''} ${SecurityUtils.escapeHtml(action.label)}
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        `;
    }

    /**
     * Render confirmation dialog
     */
    static renderConfirmDialog(config = {}) {
        const {
            title = 'Confirm Action',
            message = 'Are you sure you want to proceed?',
            confirmLabel = 'Confirm',
            cancelLabel = 'Cancel',
            confirmVariant = 'btn-danger',
            icon = 'fa-exclamation-triangle',
            iconColor = 'warning',
            onConfirm = '',
            onCancel = 'app.closeModal()'
        } = config;

        return this.renderModal({
            title,
            content: `
                <div style="text-align: center; padding: var(--space-xl);">
                    <div style="width: 80px; height: 80px; margin: 0 auto var(--space-lg); background: var(--color-${iconColor}-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fas ${icon}" style="font-size: 2.5rem; color: var(--color-${iconColor});"></i>
                    </div>
                    <p style="font-size: 1.1rem; color: var(--text-primary); line-height: 1.5;">
                        ${SecurityUtils.escapeHtml(message)}
                    </p>
                </div>
            `,
            actions: [
                { label: cancelLabel, variant: 'btn-secondary', onClick: onCancel },
                { label: confirmLabel, variant: confirmVariant, onClick: onConfirm }
            ],
            showClose: false
        });
    }

    /**
     * Render table with pagination
     */
    static renderTable(config = {}) {
        const {
            columns = [],
            data = [],
            emptyMessage = 'No data available',
            rowActions = [],
            multiSelect = false
        } = config;

        return `
            <table class="data-table">
                <thead>
                    <tr>
                        ${multiSelect ? '<th style="width: 40px;"></th>' : ''}
                        ${columns.map(col => `
                            <th ${col.sortable ? `class="sortable" onclick="${col.onSort}"` : ''}>
                                ${SecurityUtils.escapeHtml(col.label)}
                                ${col.sortable ? '<i class="fas fa-sort"></i>' : ''}
                            </th>
                        `).join('')}
                        ${rowActions.length > 0 ? '<th>Actions</th>' : ''}
                    </tr>
                </thead>
                <tbody>
                    ${data.length > 0 ? data.map((row, idx) => `
                        <tr data-id="${row.id || idx}">
                            ${multiSelect ? `<td>${this.renderCheckbox(row.id)}</td>` : ''}
                            ${columns.map(col => `
                                <td>${col.render ? col.render(row) : SecurityUtils.escapeHtml(String(row[col.key] || '-'))}</td>
                            `).join('')}
                            ${rowActions.length > 0 ? `
                                <td>
                                    ${rowActions.map(action => this.renderIconButton(
                                        action.icon,
                                        `${action.onClick}('${row.id}')`,
                                        { title: action.label, variant: action.variant || '' }
                                    )).join('')}
                                </td>
                            ` : ''}
                        </tr>
                    `).join('') : `
                        <tr>
                            <td colspan="${columns.length + (multiSelect ? 1 : 0) + (rowActions.length > 0 ? 1 : 0)}" class="empty-state">
                                ${SecurityUtils.escapeHtml(emptyMessage)}
                            </td>
                        </tr>
                    `}
                </tbody>
            </table>
        `;
    }

    /**
     * Render checkbox
     */
    static renderCheckbox(id, checked = false, onChange = 'app.handleCheckbox') {
        return `
            <input
                type="checkbox"
                ${checked ? 'checked' : ''}
                onchange="${onChange}('${id}', this.checked)"
                data-id="${id}"
            >
        `;
    }

    /**
     * Render toast notification (returns config for app.showToast)
     */
    static createToastConfig(message, type = 'info', duration = 5000) {
        return { message, type, duration };
    }
}

export default UIComponents;
