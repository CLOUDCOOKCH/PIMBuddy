/**
 * Dashboard Page
 * Command center with stats, quick actions, recent activity
 */

import { BasePage } from '../core/PageRouter.js';
import { graphService } from '../services/graphService.js';
import { CACHE_KEYS } from '../core/CacheManager.js';

export class DashboardPage extends BasePage {
    constructor(app) {
        super(app);
    }

    /**
     * Render Dashboard page
     * @param {HTMLElement} container - Page container
     * @param {Object} params - Optional parameters
     */
    async render(container, params = {}) {
        // Show landing page if not connected
        if (!this.isConnected()) {
            this.renderLandingPage(container);
            return;
        }

        let stats = {
            totalGroups: 0,
            eligibleAssignments: 0,
            activeAssignments: 0,
            pendingApprovals: 0,
            expiringAssignments: 0,
            healthScore: 0,
            healthStatus: 'unknown'
        };

        let recentActivities = [];
        let expiringList = [];
        let healthWarnings = [];

        if (this.isConnected()) {
            this.showLoading('Loading dashboard data...');
            try {
                // Try cache first
                const cached = this.getCached(CACHE_KEYS.DASHBOARD_STATS.key);

                if (cached) {
                    stats = cached.stats;
                    recentActivities = cached.recentActivities;
                    expiringList = cached.expiringList;
                    healthWarnings = cached.healthWarnings;
                } else {
                    // Load all data in parallel
                    const [groupsResult, assignmentsResult, approvalsResult, healthResult, auditResult] = await Promise.all([
                        graphService.getPIMGroups(),
                        graphService.getRoleAssignmentsWithExpiration(),
                        graphService.getPendingApprovals(),
                        graphService.runHealthCheck(),
                        graphService.getPIMAuditLogs(7)
                    ]);

                    if (groupsResult.success) {
                        stats.totalGroups = groupsResult.count;
                    }

                    if (assignmentsResult.success) {
                        stats.activeAssignments = assignmentsResult.activeCount;
                        stats.eligibleAssignments = assignmentsResult.eligibleCount;
                        stats.expiringAssignments = assignmentsResult.expiringCount;
                        expiringList = assignmentsResult.expiringAssignments.slice(0, 5);
                    }

                    if (approvalsResult.success) {
                        stats.pendingApprovals = approvalsResult.count;
                    }

                    if (healthResult.success) {
                        stats.healthScore = healthResult.healthScore;
                        stats.healthStatus = healthResult.status;
                        healthWarnings = healthResult.warnings || [];
                    }

                    if (auditResult.success) {
                        recentActivities = auditResult.logs.slice(0, 5);
                    }

                    // Cache the dashboard data
                    this.setCached(CACHE_KEYS.DASHBOARD_STATS.key, {
                        stats,
                        recentActivities,
                        expiringList,
                        healthWarnings
                    });
                }
            } catch (error) {
                console.error('Dashboard load error:', error);
            }
            this.hideLoading();
        }

        const setupMessage = !this.app.isConfigured ? `
            <div class="setup-banner">
                <i class="fas fa-info-circle"></i>
                <div>
                    <strong>Setup Required</strong>
                    <p>Click the <strong>Setup</strong> button in the sidebar to configure PIMBuddy for your tenant.</p>
                </div>
                <button class="btn btn-primary btn-sm" onclick="app.showSetupWizard()">Run Setup</button>
            </div>
        ` : '';

        const getHealthColor = (status) => {
            switch(status) {
                case 'healthy': return 'success';
                case 'warning': return 'warning';
                case 'critical': return 'danger';
                default: return 'secondary';
            }
        };

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

            if (days > 0) return `in ${days}d ${hours}h`;
            if (hours > 0) return `in ${hours}h`;
            return 'soon';
        };

        container.innerHTML = `
            <!-- Dramatic Dashboard Header -->
            <div style="position: relative; margin-bottom: var(--space-2xl); overflow: hidden;">
                <div style="position: absolute; top: -100%; right: -10%; width: 400px; height: 400px; background: radial-gradient(circle, var(--accent-primary-dim), transparent); filter: blur(100px); animation: float 12s ease-in-out infinite; pointer-events: none;"></div>

                <div style="position: relative; z-index: 1;">
                    <div style="display: inline-flex; align-items: center; gap: var(--space-xs); padding: var(--space-xs) var(--space-md); background: rgba(0, 255, 159, 0.05); border: 1px solid var(--accent-primary); border-radius: var(--radius-full); margin-bottom: var(--space-md); font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em;">
                        <span style="width: 6px; height: 6px; background: var(--accent-primary); border-radius: 50%; box-shadow: 0 0 10px var(--accent-primary); animation: pulse 2s ease-in-out infinite;"></span>
                        <span style="color: var(--accent-primary); font-weight: 600;">SYSTEM STATUS</span>
                        <span style="color: var(--text-muted);">|</span>
                        <span style="color: var(--text-secondary);">REALTIME MONITORING</span>
                    </div>

                    <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 800; line-height: 1.1; margin-bottom: var(--space-sm); letter-spacing: -0.03em;">
                        <span style="background: linear-gradient(135deg, var(--accent-primary), #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 30px rgba(0, 255, 159, 0.3));">
                            COMMAND
                        </span>
                        <span style="color: var(--text-primary);"> CENTER</span>
                    </h1>
                    <p style="font-size: 0.95rem; color: var(--text-secondary); font-family: var(--font-mono);">
                        Privileged Access Management Overview
                    </p>
                </div>
            </div>

            ${setupMessage}

            <!-- Dramatic Stats Grid -->
            <div class="stats-grid" style="margin-bottom: var(--space-2xl);">
                <!-- Health Score - Hero Card -->
                <div class="card stat-card ${stats.healthScore > 0 ? 'clickable' : ''}"
                     onclick="${stats.healthScore > 0 ? 'app.router.navigateTo(\'health-check\')' : ''}"
                     style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 2px solid ${stats.healthStatus === 'healthy' ? 'var(--accent-primary)' : stats.healthStatus === 'warning' ? 'var(--color-warning)' : 'var(--color-error)'};" role="button" ${stats.healthScore > 0 ? 'aria-label="View health check details"' : ''} tabindex="${stats.healthScore > 0 ? '0' : '-1'}">
                    <div style="position: absolute; inset: 0; background: radial-gradient(circle at top right, ${stats.healthStatus === 'healthy' ? 'var(--accent-primary-dim)' : stats.healthStatus === 'warning' ? 'rgba(255, 170, 0, 0.1)' : 'rgba(255, 0, 85, 0.1)'}, transparent); filter: blur(40px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="width: 64px; height: 64px; background: ${stats.healthStatus === 'healthy' ? 'var(--accent-primary-dim)' : stats.healthStatus === 'warning' ? 'var(--color-warning-dim)' : 'rgba(255, 0, 85, 0.1)'}; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md); box-shadow: 0 0 30px ${stats.healthStatus === 'healthy' ? 'rgba(0, 255, 159, 0.3)' : stats.healthStatus === 'warning' ? 'rgba(255, 170, 0, 0.3)' : 'rgba(255, 0, 85, 0.3)'};">
                            <i class="fas fa-heart-pulse" style="font-size: 2rem; color: ${stats.healthStatus === 'healthy' ? 'var(--accent-primary)' : stats.healthStatus === 'warning' ? 'var(--color-warning)' : 'var(--color-error)'};"></i>
                        </div>
                        <div style="font-family: var(--font-display); font-size: 3rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); background: linear-gradient(135deg, ${stats.healthStatus === 'healthy' ? 'var(--accent-primary), #00ffff' : stats.healthStatus === 'warning' ? 'var(--color-warning), #ffdd00' : 'var(--color-error), #ff0099'}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                            ${stats.healthScore}%
                        </div>
                        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono); margin-bottom: var(--space-xs);">HEALTH SCORE</div>
                        ${stats.healthScore > 0 ? '<div style="font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono);">⚡ CLICK FOR ANALYSIS</div>' : ''}
                    </div>
                </div>

                <!-- Other Stat Cards -->
                <div class="card stat-card" style="position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, rgba(0, 255, 159, 0.05), transparent); filter: blur(40px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="width: 56px; height: 56px; background: var(--accent-primary-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                            <i class="fas fa-users" style="font-size: 1.5rem; color: var(--accent-primary);"></i>
                        </div>
                        <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: var(--text-primary);">
                            ${stats.totalGroups}
                        </div>
                        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">PIM GROUPS</div>
                    </div>
                </div>

                <div class="card stat-card" style="position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, rgba(255, 0, 128, 0.05), transparent); filter: blur(40px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="width: 56px; height: 56px; background: var(--accent-secondary-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                            <i class="fas fa-user-check" style="font-size: 1.5rem; color: var(--accent-secondary);"></i>
                        </div>
                        <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: var(--text-primary);">
                            ${stats.eligibleAssignments}
                        </div>
                        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">ELIGIBLE</div>
                    </div>
                </div>

                <div class="card stat-card" style="position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, rgba(0, 255, 159, 0.05), transparent); filter: blur(40px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="width: 56px; height: 56px; background: var(--color-success-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                            <i class="fas fa-user-shield" style="font-size: 1.5rem; color: var(--color-success);"></i>
                        </div>
                        <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: var(--text-primary);">
                            ${stats.activeAssignments}
                        </div>
                        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">ACTIVE</div>
                    </div>
                </div>

                <div class="card stat-card ${stats.expiringAssignments > 0 ? 'clickable' : ''}"
                     onclick="${stats.expiringAssignments > 0 ? 'app.router.navigateTo(\'expiring-assignments\')' : ''}"
                     style="position: relative; overflow: hidden; ${stats.expiringAssignments > 0 ? 'border: 1px solid var(--color-warning);' : ''}" role="${stats.expiringAssignments > 0 ? 'button' : ''}" ${stats.expiringAssignments > 0 ? 'aria-label="View expiring assignments"' : ''} tabindex="${stats.expiringAssignments > 0 ? '0' : '-1'}">
                    <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, rgba(255, 170, 0, 0.05), transparent); filter: blur(40px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="width: 56px; height: 56px; background: ${stats.expiringAssignments > 0 ? 'var(--color-warning-dim)' : 'var(--bg-elevated)'}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                            <i class="fas fa-hourglass-end" style="font-size: 1.5rem; color: ${stats.expiringAssignments > 0 ? 'var(--color-warning)' : 'var(--text-muted)'};"></i>
                        </div>
                        <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: ${stats.expiringAssignments > 0 ? 'var(--color-warning)' : 'var(--text-primary)'};">
                            ${stats.expiringAssignments}
                        </div>
                        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">EXPIRING</div>
                        ${stats.expiringAssignments > 0 ? '<div style="font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono);">⚡ CLICK TO VIEW</div>' : ''}
                    </div>
                </div>

                <div class="card stat-card ${stats.pendingApprovals > 0 ? 'clickable' : ''}"
                     onclick="${stats.pendingApprovals > 0 ? 'app.router.navigateTo(\'pending-approvals\')' : ''}"
                     style="position: relative; overflow: hidden; ${stats.pendingApprovals > 0 ? 'border: 1px solid var(--color-warning);' : ''}" role="${stats.pendingApprovals > 0 ? 'button' : ''}" ${stats.pendingApprovals > 0 ? 'aria-label="Review pending approvals"' : ''} tabindex="${stats.pendingApprovals > 0 ? '0' : '-1'}">
                    <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, rgba(255, 170, 0, 0.05), transparent); filter: blur(40px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="width: 56px; height: 56px; background: ${stats.pendingApprovals > 0 ? 'var(--color-warning-dim)' : 'var(--bg-elevated)'}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                            <i class="fas fa-clock" style="font-size: 1.5rem; color: ${stats.pendingApprovals > 0 ? 'var(--color-warning)' : 'var(--text-muted)'};"></i>
                        </div>
                        <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: ${stats.pendingApprovals > 0 ? 'var(--color-warning)' : 'var(--text-primary)'};">
                            ${stats.pendingApprovals}
                        </div>
                        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">APPROVALS</div>
                        ${stats.pendingApprovals > 0 ? '<div style="font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono);">⚡ CLICK TO REVIEW</div>' : ''}
                    </div>
                </div>
            </div>

            <!-- Dashboard Grid with Asymmetric Layout -->
            <div class="dashboard-grid">
                <!-- Quick Actions - Cyberpunk Panel -->
                <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--border-subtle);">
                    <div style="position: absolute; top: -50%; right: -20%; width: 250px; height: 250px; background: radial-gradient(circle, var(--accent-primary-dim), transparent); filter: blur(60px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-lg); padding-bottom: var(--space-md); border-bottom: 1px solid var(--border-subtle);">
                            <div style="width: 40px; height: 40px; background: var(--accent-primary-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-bolt" style="color: var(--accent-primary); font-size: 1.2rem;"></i>
                            </div>
                            <h2 style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                Quick Actions
                            </h2>
                        </div>
                        <div class="quick-actions" style="display: flex; flex-direction: column; gap: var(--space-sm);">
                            <button class="btn btn-primary btn-block" onclick="app.router.navigateTo('baseline')" ${!this.isConnected() ? 'disabled' : ''} style="position: relative; overflow: hidden; text-align: left; justify-content: flex-start; gap: var(--space-md);" aria-label="Deploy baseline configuration">
                                <i class="fas fa-rocket"></i>
                                <span>Deploy Baseline Configuration</span>
                            </button>
                            <button class="btn btn-secondary btn-block" onclick="app.router.navigateTo('health-check')" ${!this.isConnected() ? 'disabled' : ''} style="text-align: left; justify-content: flex-start; gap: var(--space-md);" aria-label="Run security health scan">
                                <i class="fas fa-heart-pulse"></i>
                                <span>Run Security Health Scan</span>
                            </button>
                            <button class="btn btn-secondary btn-block" onclick="app.router.navigateTo('pim-activity')" ${!this.isConnected() ? 'disabled' : ''} style="text-align: left; justify-content: flex-start; gap: var(--space-md);" aria-label="View audit activity log">
                                <i class="fas fa-history"></i>
                                <span>View Audit Activity Log</span>
                            </button>
                            <button class="btn btn-secondary btn-block" onclick="app.router.navigateTo('role-coverage')" ${!this.isConnected() ? 'disabled' : ''} style="text-align: left; justify-content: flex-start; gap: var(--space-md);" aria-label="Analyze coverage report">
                                <i class="fas fa-chart-pie"></i>
                                <span>Analyze Coverage Report</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Health Warnings - Alert Panel -->
                <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid ${healthWarnings.length > 0 ? 'var(--color-warning)' : 'var(--border-subtle)'};">
                    <div style="position: absolute; top: -50%; left: -20%; width: 250px; height: 250px; background: radial-gradient(circle, ${healthWarnings.length > 0 ? 'rgba(255, 170, 0, 0.05)' : 'var(--accent-secondary-dim)'}, transparent); filter: blur(60px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-lg); padding-bottom: var(--space-md); border-bottom: 1px solid var(--border-subtle);">
                            <div style="width: 40px; height: 40px; background: ${healthWarnings.length > 0 ? 'var(--color-warning-dim)' : 'var(--accent-secondary-dim)'}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                <i class="fas ${healthWarnings.length > 0 ? 'fa-exclamation-triangle' : 'fa-shield-check'}" style="color: ${healthWarnings.length > 0 ? 'var(--color-warning)' : 'var(--accent-secondary)'}; font-size: 1.2rem;"></i>
                            </div>
                            <div style="flex: 1;">
                                <h2 style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                    Alerts & Warnings
                                </h2>
                            </div>
                            ${healthWarnings.length > 0 ? `<span class="badge" style="background: var(--color-warning-dim); color: var(--color-warning); font-family: var(--font-mono); font-size: 0.7rem;" aria-label="${healthWarnings.length} warnings">${healthWarnings.length}</span>` : ''}
                        </div>
                        <div class="recommendations-list" style="max-height: 300px; overflow-y: auto;">
                            ${healthWarnings.length > 0 ? healthWarnings.map(w => `
                                <div style="padding: var(--space-md); margin-bottom: var(--space-sm); background: rgba(255, 170, 0, 0.05); border-left: 3px solid ${w.severity === 'warning' ? 'var(--color-warning)' : 'var(--color-info)'}; border-radius: var(--radius-sm);" role="alert">
                                    <div style="display: flex; align-items: start; gap: var(--space-sm);">
                                        <i class="fas ${w.severity === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}" style="color: ${w.severity === 'warning' ? 'var(--color-warning)' : 'var(--color-info)'}; margin-top: 2px;" aria-hidden="true"></i>
                                        <div style="flex: 1;">
                                            <div style="font-weight: 600; font-family: var(--font-mono); font-size: 0.8rem; text-transform: uppercase; color: ${w.severity === 'warning' ? 'var(--color-warning)' : 'var(--color-info)'}; margin-bottom: var(--space-xs);">
                                                ${this.escapeHtml(w.category)}
                                            </div>
                                            <div style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5;">
                                                ${this.escapeHtml(w.message)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('') : `
                                <div style="text-align: center; padding: var(--space-2xl); color: var(--text-secondary);">
                                    <div style="width: 80px; height: 80px; margin: 0 auto var(--space-lg); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-shield-check" style="font-size: 2.5rem; color: var(--accent-primary);"></i>
                                    </div>
                                    <div style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; margin-bottom: var(--space-xs); color: var(--text-primary);">
                                        All Systems Operational
                                    </div>
                                    <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted);">
                                        No security issues detected
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>
                </div>

                <!-- Recent Activity - Data Stream Panel -->
                <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--border-subtle);">
                    <div style="position: absolute; bottom: -50%; left: -20%; width: 250px; height: 250px; background: radial-gradient(circle, var(--accent-secondary-dim), transparent); filter: blur(60px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-lg); padding-bottom: var(--space-md); border-bottom: 1px solid var(--border-subtle);">
                            <div style="display: flex; align-items: center; gap: var(--space-sm);">
                                <div style="width: 40px; height: 40px; background: var(--accent-secondary-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-history" style="color: var(--accent-secondary); font-size: 1.2rem;"></i>
                                </div>
                                <h2 style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                    Recent Activity
                                </h2>
                            </div>
                            <button class="btn btn-sm btn-secondary" onclick="app.router.navigateTo('pim-activity')" ${!this.isConnected() ? 'disabled' : ''} style="font-family: var(--font-mono); font-size: 0.7rem;" aria-label="View all activity">
                                VIEW ALL →
                            </button>
                        </div>
                        <div style="max-height: 300px; overflow-y: auto;">
                            ${recentActivities.length > 0 ? recentActivities.map((activity, idx) => `
                                <div style="padding: var(--space-md); margin-bottom: var(--space-xs); background: ${idx % 2 === 0 ? 'rgba(255, 0, 128, 0.02)' : 'rgba(0, 255, 159, 0.02)'}; border-left: 2px solid ${idx % 2 === 0 ? 'var(--accent-secondary)' : 'var(--accent-primary)'}; border-radius: var(--radius-sm);">
                                    <div style="display: flex; justify-content: space-between; align-items: start; gap: var(--space-md);">
                                        <div style="flex: 1; min-width: 0;">
                                            <div style="font-weight: 600; font-size: 0.95rem; margin-bottom: var(--space-xs); color: var(--text-primary); overflow: hidden; text-overflow: ellipsis;">
                                                ${this.escapeHtml(activity.activityDisplayName || 'Activity')}
                                            </div>
                                            <div style="display: flex; align-items: center; gap: var(--space-xs); font-size: 0.8rem; color: var(--text-secondary); font-family: var(--font-mono);">
                                                <i class="fas fa-user" style="font-size: 0.7rem;"></i>
                                                <span>${this.escapeHtml(activity.initiatedBy?.user?.displayName || 'System')}</span>
                                            </div>
                                        </div>
                                        <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); white-space: nowrap;">
                                            ${formatDate(activity.activityDateTime)}
                                        </div>
                                    </div>
                                </div>
                            `).join('') : `
                                <div style="text-align: center; padding: var(--space-2xl); color: var(--text-secondary);">
                                    <div style="width: 80px; height: 80px; margin: 0 auto var(--space-lg); background: var(--accent-secondary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-inbox" style="font-size: 2.5rem; color: var(--accent-secondary); opacity: 0.5;"></i>
                                    </div>
                                    <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted);">
                                        ${this.isConnected() ? 'No recent activity detected' : 'Connect to view activity stream'}
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>
                </div>

                <!-- Expiring Assignments - Warning Panel -->
                <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid ${expiringList.length > 0 ? 'var(--color-warning)' : 'var(--border-subtle)'};">
                    <div style="position: absolute; bottom: -50%; right: -20%; width: 250px; height: 250px; background: radial-gradient(circle, ${expiringList.length > 0 ? 'rgba(255, 170, 0, 0.05)' : 'var(--accent-primary-dim)'}, transparent); filter: blur(60px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-lg); padding-bottom: var(--space-md); border-bottom: 1px solid var(--border-subtle);">
                            <div style="display: flex; align-items: center; gap: var(--space-sm);">
                                <div style="width: 40px; height: 40px; background: ${expiringList.length > 0 ? 'var(--color-warning-dim)' : 'var(--accent-primary-dim)'}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-hourglass-end" style="color: ${expiringList.length > 0 ? 'var(--color-warning)' : 'var(--accent-primary)'}; font-size: 1.2rem;"></i>
                                </div>
                                <div style="flex: 1;">
                                    <h2 style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                        Expiring Soon
                                    </h2>
                                </div>
                                ${expiringList.length > 0 ? `<span class="badge" style="background: var(--color-warning-dim); color: var(--color-warning); font-family: var(--font-mono); font-size: 0.7rem;" aria-label="${expiringList.length} expiring">${expiringList.length}</span>` : ''}
                            </div>
                            <button class="btn btn-sm btn-secondary" onclick="app.router.navigateTo('expiring-assignments')" ${!this.isConnected() || expiringList.length === 0 ? 'disabled' : ''} style="font-family: var(--font-mono); font-size: 0.7rem;" aria-label="View all expiring assignments">
                                VIEW ALL →
                            </button>
                        </div>
                        <div style="max-height: 300px; overflow-y: auto;">
                            ${expiringList.length > 0 ? expiringList.map(assignment => `
                                <div style="padding: var(--space-md); margin-bottom: var(--space-sm); background: rgba(255, 170, 0, 0.05); border-left: 3px solid var(--color-warning); border-radius: var(--radius-sm);">
                                    <div style="display: flex; justify-content: space-between; align-items: start; gap: var(--space-md);">
                                        <div style="flex: 1; min-width: 0;">
                                            <div style="font-weight: 600; font-size: 0.95rem; margin-bottom: var(--space-xs); color: var(--text-primary);">
                                                ${this.escapeHtml(assignment.principal?.displayName || 'Unknown')}
                                            </div>
                                            <div style="display: flex; align-items: center; gap: var(--space-xs); font-size: 0.8rem; color: var(--text-secondary); flex-wrap: wrap;">
                                                <span style="font-family: var(--font-mono);">${this.escapeHtml(assignment.roleDefinition?.displayName || 'Unknown Role')}</span>
                                                <span class="badge" style="background: ${assignment.type === 'active' ? 'var(--color-success-dim)' : 'var(--bg-elevated)'}; color: ${assignment.type === 'active' ? 'var(--color-success)' : 'var(--text-secondary)'}; font-size: 0.7rem; text-transform: uppercase;">
                                                    ${assignment.type}
                                                </span>
                                            </div>
                                        </div>
                                        <div style="display: flex; align-items: center; gap: var(--space-xs); font-size: 0.8rem; color: var(--color-warning); font-family: var(--font-mono); white-space: nowrap; font-weight: 600;">
                                            <i class="fas fa-clock" style="font-size: 0.7rem;"></i>
                                            <span>${formatRelativeTime(assignment.endDateTime)}</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('') : `
                                <div style="text-align: center; padding: var(--space-2xl); color: var(--text-secondary);">
                                    <div style="width: 80px; height: 80px; margin: 0 auto var(--space-lg); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-check-circle" style="font-size: 2.5rem; color: var(--accent-primary);"></i>
                                    </div>
                                    <div style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; margin-bottom: var(--space-xs); color: var(--text-primary);">
                                        All Clear
                                    </div>
                                    <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted);">
                                        ${this.isConnected() ? 'No assignments expiring within 7 days' : 'Connect to monitor expiring assignments'}
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render landing page (shown when not connected)
     * @param {HTMLElement} container - Page container
     */
    renderLandingPage(container) {
        container.innerHTML = `
            <!-- Hero Section -->
            <div style="text-align: center; padding: var(--space-xl) 0; max-width: 1200px; margin: 0 auto;">
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 120px; height: 120px; background: linear-gradient(135deg, var(--accent-primary-dim), var(--accent-secondary-dim)); border-radius: 30px; margin-bottom: var(--space-lg); box-shadow: 0 20px 60px rgba(0, 212, 170, 0.3);">
                    <i class="fas fa-shield-alt" style="font-size: 4rem; color: var(--accent-primary);"></i>
                </div>

                <h1 style="font-family: var(--font-display); font-size: 3.5rem; font-weight: 800; margin-bottom: var(--space-md); background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    Welcome to PIMBuddy
                </h1>

                <p style="font-size: 1.3rem; color: var(--text-secondary); max-width: 700px; margin: 0 auto var(--space-xl);">
                    Your complete solution for Microsoft Entra PIM management. Deploy, monitor, and secure privileged access with enterprise-grade tools.
                </p>

                <button class="btn btn-primary" onclick="document.getElementById('connect-btn').click()" style="font-size: 1.1rem; padding: var(--space-md) var(--space-xl); box-shadow: 0 10px 30px rgba(0, 212, 170, 0.3);" aria-label="Connect to Microsoft Entra ID">
                    <i class="fas fa-plug"></i> Connect to Get Started
                </button>
            </div>

            <!-- Key Stats -->
            <div class="stats-grid" style="margin-bottom: var(--space-xl);">
                <div class="card stat-card" style="border-color: var(--accent-primary-dim);">
                    <div class="stat-icon primary">
                        <i class="fas fa-tachometer-alt"></i>
                    </div>
                    <div class="stat-value">5</div>
                    <div class="stat-label">Monitoring Tools</div>
                </div>
                <div class="card stat-card" style="border-color: var(--accent-secondary-dim);">
                    <div class="stat-icon secondary">
                        <i class="fas fa-rocket"></i>
                    </div>
                    <div class="stat-value">3</div>
                    <div class="stat-label">Baseline Templates</div>
                </div>
                <div class="card stat-card" style="border-color: var(--color-success-dim);">
                    <div class="stat-icon success">
                        <i class="fas fa-shield-check"></i>
                    </div>
                    <div class="stat-value">100%</div>
                    <div class="stat-label">Zero Trust Ready</div>
                </div>
            </div>

            <!-- Core Features -->
            <h2 style="font-family: var(--font-display); font-size: 2rem; font-weight: 700; text-align: center; margin-bottom: var(--space-lg);">
                <i class="fas fa-stars" style="color: var(--accent-primary);"></i> Core Features
            </h2>

            <div class="dashboard-grid" style="margin-bottom: var(--space-xl);">
                <!-- Baseline Deployment -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--accent-primary-dim);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--accent-primary-dim); border-radius: var(--radius-lg);">
                            <i class="fas fa-rocket" style="font-size: 1.8rem; color: var(--accent-primary);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">Baseline Deployment</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">One-Click PIM Setup</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Deploy complete PIM configurations instantly with industry best practices. Choose from Enterprise Standard, High Security (Zero Trust), or Quick Start templates.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-primary"><i class="fas fa-check"></i> Tiered Access (T0/T1/T2)</span>
                        <span class="badge badge-success"><i class="fas fa-check"></i> MFA Required</span>
                        <span class="badge badge-info"><i class="fas fa-check"></i> Approval Workflows</span>
                        <span class="badge badge-warning"><i class="fas fa-check"></i> Auto-Configuration</span>
                    </div>
                </div>

                <!-- PIM Health Check -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--color-success-dim);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--color-success-dim); border-radius: var(--radius-lg);">
                            <i class="fas fa-heart-pulse" style="font-size: 1.8rem; color: var(--color-success);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">Health Check Scanner</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Security Analysis</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Automated security scanner that analyzes your PIM configuration. Get a health score (0-100%) and actionable recommendations to improve security.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-success"><i class="fas fa-search"></i> Auto-Scan</span>
                        <span class="badge badge-primary"><i class="fas fa-chart-line"></i> Health Score</span>
                        <span class="badge badge-warning"><i class="fas fa-exclamation-triangle"></i> Issue Detection</span>
                        <span class="badge badge-info"><i class="fas fa-lightbulb"></i> Recommendations</span>
                    </div>
                </div>

                <!-- Activity Monitoring -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--accent-secondary-dim);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--accent-secondary-dim); border-radius: var(--radius-lg);">
                            <i class="fas fa-history" style="font-size: 1.8rem; color: var(--accent-secondary);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">PIM Activity Log</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Audit & Compliance</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Complete audit trail of all PIM role management activities. Track who did what, when, and why with detailed activity logs and filtering.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-secondary"><i class="fas fa-calendar"></i> 30-Day History</span>
                        <span class="badge badge-info"><i class="fas fa-filter"></i> Advanced Filtering</span>
                        <span class="badge badge-primary"><i class="fas fa-download"></i> Export Logs</span>
                    </div>
                </div>

                <!-- Approval Management -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--color-warning-dim);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--color-warning-dim); border-radius: var(--radius-lg);">
                            <i class="fas fa-clock" style="font-size: 1.8rem; color: var(--color-warning);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">Pending Approvals</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Request Management</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Manage PIM activation requests in one place. Review justifications, approve or deny requests, and maintain compliance with one-click actions.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-success"><i class="fas fa-check"></i> Quick Approve</span>
                        <span class="badge badge-danger"><i class="fas fa-times"></i> Quick Deny</span>
                        <span class="badge badge-info"><i class="fas fa-comment"></i> Justification View</span>
                    </div>
                </div>

                <!-- Expiring Assignments -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid rgba(245, 158, 11, 0.2);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--color-warning-dim); border-radius: var(--radius-lg);">
                            <i class="fas fa-hourglass-end" style="font-size: 1.8rem; color: var(--color-warning);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">Expiring Assignments</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Lifecycle Management</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Track role assignments expiring within 7 days. Proactive monitoring prevents access loss and ensures continuous operations.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-warning"><i class="fas fa-bell"></i> 7-Day Alerts</span>
                        <span class="badge badge-primary"><i class="fas fa-clock"></i> Time Remaining</span>
                        <span class="badge badge-info"><i class="fas fa-list"></i> Full Tracking</span>
                    </div>
                </div>

                <!-- Role Coverage -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid rgba(59, 130, 246, 0.2);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: rgba(59, 130, 246, 0.15); border-radius: var(--radius-lg);">
                            <i class="fas fa-chart-pie" style="font-size: 1.8rem; color: var(--color-info);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">Role Coverage Report</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Analytics Dashboard</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Analyze which roles are managed through PIM groups vs direct assignments. Visual reports help identify gaps and improve governance.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-info"><i class="fas fa-chart-pie"></i> Visual Reports</span>
                        <span class="badge badge-primary"><i class="fas fa-percent"></i> Coverage %</span>
                        <span class="badge badge-warning"><i class="fas fa-flag"></i> Gap Analysis</span>
                    </div>
                </div>
            </div>

            <!-- Additional Features -->
            <h2 style="font-family: var(--font-display); font-size: 2rem; font-weight: 700; text-align: center; margin-bottom: var(--space-lg);">
                <i class="fas fa-toolbox" style="color: var(--accent-primary);"></i> Additional Tools
            </h2>

            <div class="dashboard-grid" style="margin-bottom: var(--space-xl);">
                <!-- PIMMaid -->
                <div class="card">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-sm);">
                        <div class="stat-icon primary">
                            <i class="fas fa-project-diagram"></i>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0;">PIMMaid Visualizer</h3>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">
                        Export your PIM configuration as beautiful Mermaid diagrams. Visualize relationships between users, groups, and roles.
                    </p>
                    <span class="badge badge-secondary"><i class="fas fa-sitemap"></i> Visual Diagrams</span>
                </div>

                <!-- Group Management -->
                <div class="card">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-sm);">
                        <div class="stat-icon success">
                            <i class="fas fa-users"></i>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0;">Group Management</h3>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">
                        Create and manage role-assignable security groups. Add/remove members with an intuitive interface.
                    </p>
                    <span class="badge badge-success"><i class="fas fa-user-plus"></i> Member Management</span>
                </div>

                <!-- Role Explorer -->
                <div class="card">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-sm);">
                        <div class="stat-icon warning">
                            <i class="fas fa-user-shield"></i>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0;">Entra Roles Explorer</h3>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">
                        Browse all Azure AD roles with privilege levels. Search, filter, and understand role permissions.
                    </p>
                    <span class="badge badge-warning"><i class="fas fa-shield-alt"></i> Privilege Levels</span>
                </div>

                <!-- Import/Export -->
                <div class="card">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-sm);">
                        <div class="stat-icon info">
                            <i class="fas fa-file-export"></i>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0;">Import/Export</h3>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">
                        Export configurations for backup or compliance. Import templates to replicate setups across tenants.
                    </p>
                    <span class="badge badge-info"><i class="fas fa-download"></i> Backup & Restore</span>
                </div>
            </div>

            <!-- Call to Action -->
            <div class="card" style="background: linear-gradient(135deg, var(--accent-primary-dim), var(--accent-secondary-dim)); border: 2px solid var(--accent-primary); text-align: center; padding: var(--space-xl);">
                <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: var(--space-md);">
                    Ready to Transform Your PIM Management?
                </h2>
                <p style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: var(--space-lg); max-width: 600px; margin-left: auto; margin-right: auto;">
                    Connect to your Microsoft Entra ID tenant and start managing privileged access with enterprise-grade tools in minutes.
                </p>
                <button class="btn btn-primary" onclick="document.getElementById('connect-btn').click()" style="font-size: 1.2rem; padding: var(--space-md) var(--space-xl); box-shadow: 0 10px 30px rgba(0, 212, 170, 0.4);" aria-label="Connect to Microsoft Entra ID">
                    <i class="fas fa-plug"></i> Connect Now
                </button>
            </div>

            <!-- Footer Info -->
            <div style="text-align: center; margin-top: var(--space-xl); padding: var(--space-lg); color: var(--text-muted);">
                <p style="margin-bottom: var(--space-sm);">
                    <i class="fas fa-shield-check" style="color: var(--accent-primary);"></i>
                    Built with enterprise security in mind
                </p>
                <p style="font-size: 0.9rem;">
                    PIMBuddy v1.0.0 | Powered by Microsoft Graph API | Zero Trust Ready
                </p>
            </div>
        `;
    }

    /**
     * Refresh page data
     */
    async refreshPage() {
        this.app.cacheManager.invalidate(CACHE_KEYS.DASHBOARD_STATS.key);
        await this.app.router.refreshCurrentPage();
    }
}
