/**
 * Activity Page
 * Display PIM audit logs and activity history
 */

import { BasePage } from '../core/PageRouter.js';
import { graphService } from '../services/graphService.js';
import { CACHE_KEYS } from '../core/CacheManager.js';

export class ActivityPage extends BasePage {
    constructor(app) {
        super(app);
        this.paginator = app.paginators.activity;
    }

    /**
     * Render Activity page
     * @param {HTMLElement} container - Page container
     * @param {Object} params - Optional parameters
     */
    async render(container, params = {}) {
        let allLogs = [];

        if (this.isConnected()) {
            this.showLoading('Loading PIM activity...');

            const result = await graphService.getPIMAuditLogs(30); // Last 30 days
            if (result.success) {
                allLogs = result.logs;
            } else {
                this.showToast(`Failed to load activity: ${result.error}`, 'error');
            }

            this.hideLoading();
        }

        // Update paginator with all logs
        this.paginator.updateItems(allLogs);

        // Get current page items
        const logs = this.paginator.getCurrentPageItems();

        const formatDate = (dateStr) => {
            if (!dateStr) return 'N/A';
            const date = new Date(dateStr);
            return date.toLocaleString();
        };

        const getActivityIcon = (displayName) => {
            if (displayName?.includes('Add') || displayName?.includes('Create')) return 'fa-plus success';
            if (displayName?.includes('Remove') || displayName?.includes('Delete')) return 'fa-trash danger';
            if (displayName?.includes('Update')) return 'fa-edit warning';
            if (displayName?.includes('Assign')) return 'fa-user-check primary';
            return 'fa-circle info';
        };

        container.innerHTML = `
            <!-- Dramatic Page Header -->
            <div style="position: relative; margin-bottom: var(--space-2xl); overflow: hidden;">
                <div style="position: absolute; top: -50%; right: -5%; width: 300px; height: 300px; background: radial-gradient(circle, var(--accent-secondary-dim), transparent); filter: blur(80px); animation: float 10s ease-in-out infinite; pointer-events: none;"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: inline-flex; align-items: center; gap: var(--space-xs); padding: var(--space-xs) var(--space-md); background: rgba(255, 0, 128, 0.05); border: 1px solid var(--accent-secondary); border-radius: var(--radius-full); margin-bottom: var(--space-md); font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em;">
                        <i class="fas fa-database" style="color: var(--accent-secondary); font-size: 0.7rem;"></i>
                        <span style="color: var(--accent-secondary); font-weight: 600;">AUDIT TRAIL</span>
                        <span style="color: var(--text-muted);">|</span>
                        <span style="color: var(--text-secondary);">30 DAY HISTORY</span>
                    </div>
                    <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; line-height: 1.1; margin-bottom: var(--space-sm); letter-spacing: -0.03em;">
                        <span style="background: linear-gradient(135deg, var(--accent-secondary), #ff00ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 30px rgba(255, 0, 128, 0.3));">
                            ACTIVITY
                        </span>
                        <span style="color: var(--text-primary);"> LOG</span>
                    </h1>
                    <p style="font-size: 0.95rem; color: var(--text-secondary); font-family: var(--font-mono);">
                        Complete audit trail of privileged role management events
                    </p>
                </div>
            </div>

            <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--border-subtle);">
                <div style="position: absolute; top: 0; right: 0; width: 400px; height: 400px; background: radial-gradient(circle, var(--accent-secondary-dim), transparent); filter: blur(100px); pointer-events: none;"></div>

                <div style="position: relative; z-index: 1;">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-lg); border-bottom: 1px solid var(--border-subtle);">
                        <div style="display: flex; align-items: center; gap: var(--space-md);">
                            <div style="width: 48px; height: 48px; background: var(--accent-secondary-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-history" style="color: var(--accent-secondary); font-size: 1.3rem;"></i>
                            </div>
                            <div>
                                <h2 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                    Event Stream
                                </h2>
                                <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                                    ${allLogs.length} recorded events
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; gap: var(--space-sm);">
                            <button class="btn btn-secondary btn-sm" onclick="app.showExportMenu('activity')" ${!this.isConnected() || allLogs.length === 0 ? 'disabled' : ''} style="font-family: var(--font-mono);">
                                <i class="fas fa-file-export"></i> EXPORT
                            </button>
                            <button class="btn btn-secondary btn-sm" onclick="app.pages.activity.refreshPage()" ${!this.isConnected() ? 'disabled' : ''} style="font-family: var(--font-mono);">
                                <i class="fas fa-sync"></i> REFRESH
                            </button>
                        </div>
                    </div>

                    <div style="overflow-x: auto;">
                        ${logs.length > 0 ? `
                            <table class="table" style="margin: 0;">
                                <thead>
                                    <tr style="background: rgba(0, 0, 0, 0.3);">
                                        <th style="width: 40px; font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;"></th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Activity</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Initiated By</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Target</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Timestamp</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${logs.map((log, idx) => `
                                        <tr style="border-bottom: 1px solid var(--border-subtle); background: ${idx % 2 === 0 ? 'rgba(255, 0, 128, 0.02)' : 'transparent'};">
                                            <td>
                                                <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(255, 0, 128, 0.1); display: flex; align-items: center; justify-content: center;">
                                                    <i class="fas ${getActivityIcon(log.activityDisplayName).split(' ')[0]}" style="font-size: 0.75rem; color: var(--accent-secondary);"></i>
                                                </div>
                                            </td>
                                            <td>
                                                <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 2px; color: var(--text-primary);">${this.escapeHtml(log.activityDisplayName || 'Unknown Activity')}</div>
                                                <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${this.escapeHtml(log.category || 'N/A')}</div>
                                            </td>
                                            <td>
                                                <div style="font-size: 0.9rem; font-weight: 500; color: var(--text-primary);">${this.escapeHtml(log.initiatedBy?.user?.displayName || 'System')}</div>
                                                <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${this.escapeHtml(log.initiatedBy?.user?.userPrincipalName || 'N/A')}</div>
                                            </td>
                                            <td>
                                                ${log.targetResources?.map(t => `
                                                    <div style="font-size: 0.85rem; color: var(--text-secondary);">${this.escapeHtml(t.displayName || t.id || 'N/A')}</div>
                                                `).join('') || '<span style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.75rem;">N/A</span>'}
                                            </td>
                                            <td style="white-space: nowrap; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
                                                ${formatDate(log.activityDateTime)}
                                            </td>
                                            <td>
                                                <span class="badge" style="background: ${log.result === 'success' ? 'var(--color-success-dim)' : 'var(--color-error-dim)'}; color: ${log.result === 'success' ? 'var(--color-success)' : 'var(--color-error)'}; font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase;">
                                                    ${log.result === 'success' ? '✓ SUCCESS' : '✗ FAILED'}
                                                </span>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : `
                            <div style="text-align: center; padding: var(--space-2xl) var(--space-lg); color: var(--text-secondary);">
                                <div style="width: 120px; height: 120px; margin: 0 auto var(--space-xl); background: var(--accent-secondary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-history" style="font-size: 3.5rem; color: var(--accent-secondary); opacity: 0.5;"></i>
                                </div>
                                <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin-bottom: var(--space-sm); color: var(--text-primary);">
                                    No Activity Detected
                                </div>
                                <div style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-muted);">
                                    ${this.isConnected() ? 'No audit logs found in the last 30 days' : 'Connect to Microsoft Entra ID to view activity logs'}
                                </div>
                            </div>
                        `}
                    </div>

                    ${this.paginator.renderControls('app.pages.activity.handlePageChange')}
                </div>
            </div>
        `;
    }

    /**
     * Handle page change
     * @param {number} page - Page number
     */
    handlePageChange(page) {
        this.paginator.goToPage(page);
        this.app.router.refreshCurrentPage();
    }

    /**
     * Handle page size change
     * @param {number} size - Page size
     */
    handlePageSizeChange(size) {
        this.paginator.setPageSize(size);
        this.app.router.refreshCurrentPage();
    }

    /**
     * Refresh page data
     */
    async refreshPage() {
        await this.app.router.refreshCurrentPage();
    }
}
