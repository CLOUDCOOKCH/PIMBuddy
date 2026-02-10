/**
 * Expiring Assignments Page
 * Monitor and track role assignments expiring within 7 days
 */

import { BasePage } from '../core/PageRouter.js';
import { graphService } from '../services/graphService.js';
import { CACHE_KEYS } from '../core/CacheManager.js';

export class ExpiringPage extends BasePage {
    constructor(app) {
        super(app);
    }

    /**
     * Render Expiring Assignments page
     * @param {HTMLElement} container - Page container
     * @param {Object} params - Optional parameters
     */
    async render(container, params = {}) {
        let assignments = [];
        let expiringCount = 0;

        if (this.isConnected()) {
            this.showLoading('Loading expiring assignments...');

            // Try cache first
            const cached = this.getCached(CACHE_KEYS.EXPIRING_ASSIGNMENTS.key);

            if (cached) {
                assignments = cached.expiringAssignments || [];
                expiringCount = cached.expiringCount || 0;
            } else {
                const result = await graphService.getRoleAssignmentsWithExpiration();
                if (result.success) {
                    assignments = result.expiringAssignments;
                    expiringCount = result.expiringCount;
                    this.setCached(CACHE_KEYS.EXPIRING_ASSIGNMENTS.key, {
                        expiringAssignments: assignments,
                        expiringCount
                    });
                } else {
                    this.showToast(`Failed to load expiring assignments: ${result.error}`, 'error');
                }
            }

            this.hideLoading();
        }

        const formatDate = (dateStr) => {
            if (!dateStr) return 'N/A';
            const date = new Date(dateStr);
            return date.toLocaleString();
        };

        const formatRelativeTime = (dateStr) => {
            if (!dateStr) return 'N/A';
            const date = new Date(dateStr);
            const now = new Date();
            const diff = date - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

            if (days > 0) return `${days}d ${hours}h`;
            if (hours > 0) return `${hours}h`;
            if (diff > 0) return '< 1h';
            return 'Expired';
        };

        container.innerHTML = `
            <!-- Dramatic Page Header -->
            <div style="position: relative; margin-bottom: var(--space-2xl); overflow: hidden;">
                <div style="position: absolute; top: -50%; right: -5%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(255, 100, 0, 0.1), transparent); filter: blur(80px); animation: float 10s ease-in-out infinite; pointer-events: none;"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: inline-flex; align-items: center; gap: var(--space-xs); padding: var(--space-xs) var(--space-md); background: rgba(255, 100, 0, 0.05); border: 1px solid #ff6400; border-radius: var(--radius-full); margin-bottom: var(--space-md); font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em;">
                        <i class="fas fa-exclamation-triangle" style="color: #ff6400; font-size: 0.7rem;"></i>
                        <span style="color: #ff6400; font-weight: 600;">TIME SENSITIVE</span>
                        <span style="color: var(--text-muted);">|</span>
                        <span style="color: var(--text-secondary);">${expiringCount} EXPIRING</span>
                    </div>
                    <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; line-height: 1.1; margin-bottom: var(--space-sm); letter-spacing: -0.03em;">
                        <span style="background: linear-gradient(135deg, #ff6400, #ff0080); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 30px rgba(255, 100, 0, 0.3));">
                            EXPIRING
                        </span>
                        <span style="color: var(--text-primary);"> ASSIGNMENTS</span>
                    </h1>
                    <p style="font-size: 0.95rem; color: var(--text-secondary); font-family: var(--font-mono);">
                        Role assignments expiring within 7 days - immediate attention required
                    </p>
                </div>
            </div>

            <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid ${expiringCount > 0 ? '#ff6400' : 'var(--border-subtle)'};">
                <div style="position: absolute; top: 0; right: 0; width: 400px; height: 400px; background: radial-gradient(circle, ${expiringCount > 0 ? 'rgba(255, 100, 0, 0.05)' : 'var(--accent-primary-dim)'}, transparent); filter: blur(100px); pointer-events: none;"></div>

                <div style="position: relative; z-index: 1;">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-lg); border-bottom: 1px solid var(--border-subtle);">
                        <div style="display: flex; align-items: center; gap: var(--space-md);">
                            <div style="width: 48px; height: 48px; background: ${expiringCount > 0 ? 'rgba(255, 100, 0, 0.1)' : 'var(--accent-primary-dim)'}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-hourglass-end" style="color: ${expiringCount > 0 ? '#ff6400' : 'var(--accent-primary)'}; font-size: 1.3rem;"></i>
                            </div>
                            <div>
                                <h2 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                    Expiring Assignments
                                </h2>
                                <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                                    ${expiringCount} assignments require renewal
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-secondary btn-sm" onclick="app.pages.expiring.refreshPage()" ${!this.isConnected() ? 'disabled' : ''} style="font-family: var(--font-mono);" aria-label="Refresh expiring assignments">
                            <i class="fas fa-sync"></i> REFRESH
                        </button>
                    </div>

                    <div style="overflow-x: auto;">
                        ${assignments.length > 0 ? `
                            <table class="table" style="margin: 0;">
                                <thead>
                                    <tr style="background: rgba(0, 0, 0, 0.3);">
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Principal</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Role</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Type</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Expiration Date</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Time Left</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${assignments.map((assignment, idx) => {
                                        const timeLeft = formatRelativeTime(assignment.endDateTime);
                                        const isUrgent = timeLeft.includes('h') || timeLeft === 'Expired';
                                        return `
                                        <tr style="border-bottom: 1px solid var(--border-subtle); background: ${idx % 2 === 0 ? 'rgba(255, 100, 0, 0.02)' : 'transparent'};">
                                            <td>
                                                <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 2px; color: var(--text-primary);">${this.escapeHtml(assignment.principal?.displayName || 'Unknown')}</div>
                                                <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">
                                                    ${this.escapeHtml(assignment.principal?.userPrincipalName || assignment.principal?.mail || 'N/A')}
                                                </div>
                                            </td>
                                            <td style="font-size: 0.9rem; font-weight: 500; color: var(--text-primary);">
                                                ${this.escapeHtml(assignment.roleDefinition?.displayName || 'Unknown Role')}
                                            </td>
                                            <td>
                                                <span class="badge" style="background: ${assignment.type === 'active' ? 'var(--color-success-dim)' : 'var(--bg-elevated)'}; color: ${assignment.type === 'active' ? 'var(--color-success)' : 'var(--text-secondary)'}; font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase;">
                                                    ${assignment.type}
                                                </span>
                                            </td>
                                            <td style="white-space: nowrap; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
                                                ${formatDate(assignment.endDateTime)}
                                            </td>
                                            <td>
                                                <span class="badge" style="background: ${isUrgent ? 'rgba(255, 0, 85, 0.1)' : 'rgba(255, 100, 0, 0.1)'}; color: ${isUrgent ? 'var(--color-error)' : '#ff6400'}; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; padding: var(--space-xs) var(--space-sm); ${isUrgent ? 'animation: pulse 2s ease-in-out infinite;' : ''}">
                                                    ${isUrgent ? '⚠ ' : ''}${timeLeft}
                                                </span>
                                            </td>
                                        </tr>
                                    `}).join('')}
                                </tbody>
                            </table>
                        ` : `
                            <div style="text-align: center; padding: var(--space-2xl) var(--space-lg); color: var(--text-secondary);">
                                <div style="width: 120px; height: 120px; margin: 0 auto var(--space-xl); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-check-circle" style="font-size: 3.5rem; color: var(--accent-primary); opacity: 0.5;"></i>
                                </div>
                                <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin-bottom: var(--space-sm); color: var(--text-primary);">
                                    All Clear
                                </div>
                                <div style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-muted);">
                                    ${this.isConnected() ? 'No role assignments expiring within the next 7 days' : 'Connect to Microsoft Entra ID to monitor expiring assignments'}
                                </div>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Refresh page data
     */
    async refreshPage() {
        this.app.cacheManager.invalidate(CACHE_KEYS.EXPIRING_ASSIGNMENTS.key);
        await this.app.router.refreshCurrentPage();
    }
}
