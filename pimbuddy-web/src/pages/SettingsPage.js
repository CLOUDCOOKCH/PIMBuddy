/**
 * Settings Page
 * App configuration and preferences
 */

import { BasePage } from '../core/PageRouter.js';
import { getSavedAppConfig } from '../config/authConfig.js';

export class SettingsPage extends BasePage {
    constructor(app) {
        super(app);
    }

    /**
     * Render Settings page
     * @param {HTMLElement} container - Page container
     * @param {Object} params - Optional parameters
     */
    async render(container, params = {}) {
        const config = getSavedAppConfig();

        container.innerHTML = `
            <h1 class="page-header">Settings</h1>

            <div class="settings-container">
                <div class="card">
                    <h2>Appearance</h2>
                    <div class="setting-row">
                        <div>
                            <strong>Theme</strong>
                            <p>Choose between light and dark mode</p>
                        </div>
                        <select class="input" id="theme-select" onchange="app.setTheme(this.value)" aria-label="Theme selection">
                            <option value="light" ${!this.app.isDarkMode ? 'selected' : ''}>Light</option>
                            <option value="dark" ${this.app.isDarkMode ? 'selected' : ''}>Dark</option>
                        </select>
                    </div>
                </div>

                <div class="card">
                    <h2>App Configuration</h2>
                    ${config ? `
                        <div class="config-info">
                            <p><strong>Client ID:</strong> <code>${this.escapeHtml(config.clientId)}</code></p>
                            <p><strong>Tenant ID:</strong> <code>${this.escapeHtml(config.tenantId)}</code></p>
                            <p><strong>Configured:</strong> ${new Date(config.createdAt).toLocaleString()}</p>
                        </div>
                        <button class="btn btn-secondary" onclick="app.resetSetup()" aria-label="Reset configuration">
                            <i class="fas fa-redo"></i> Reset Configuration
                        </button>
                    ` : `
                        <p>App is not configured.</p>
                        <button class="btn btn-primary" onclick="app.showSetupWizard()" aria-label="Run setup wizard">
                            <i class="fas fa-magic"></i> Run Setup
                        </button>
                    `}
                </div>

                <div class="card">
                    <h2>Cache Management</h2>
                    <div class="setting-row">
                        <div>
                            <strong>Cache Statistics</strong>
                            <p>View and manage application cache</p>
                        </div>
                        <button class="btn btn-secondary" onclick="app.pages.settings.showCacheStats()" aria-label="View cache statistics">
                            <i class="fas fa-chart-bar"></i> View Stats
                        </button>
                    </div>
                    <div class="setting-row">
                        <div>
                            <strong>Clear Cache</strong>
                            <p>Clear all cached data and force fresh reload</p>
                        </div>
                        <button class="btn btn-danger" onclick="app.pages.settings.clearCache()" aria-label="Clear cache">
                            <i class="fas fa-trash"></i> Clear Cache
                        </button>
                    </div>
                </div>

                <div class="card">
                    <h2>About</h2>
                    <p><strong>PIMBuddy Web</strong> v1.0.0</p>
                    <p class="caption">Privileged Identity Management Tool for Microsoft Entra ID</p>
                    <p class="caption">Built with MSAL.js and Microsoft Graph API</p>
                    <div style="margin-top: var(--space-md);">
                        <p class="caption">
                            <i class="fas fa-code"></i> Modular architecture with TTL-based caching
                        </p>
                        <p class="caption">
                            <i class="fas fa-shield-alt"></i> Zero Trust compliant
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Show cache statistics
     */
    showCacheStats() {
        const stats = this.app.cacheManager.getStats();
        const cacheData = this.app.cacheManager.exportState();

        const html = `
            <h2><i class="fas fa-chart-bar"></i> Cache Statistics</h2>

            <div class="stats-grid" style="margin-bottom: var(--space-lg);">
                <div class="stat-card">
                    <div class="stat-value">${stats.size}</div>
                    <div class="stat-label">Cached Items</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.hits}</div>
                    <div class="stat-label">Cache Hits</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.misses}</div>
                    <div class="stat-label">Cache Misses</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.hitRate}</div>
                    <div class="stat-label">Hit Rate</div>
                </div>
            </div>

            <h3>Cached Data</h3>
            <div style="max-height: 300px; overflow-y: auto; background: var(--bg-surface); padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.8rem;">
                ${Object.keys(cacheData).length > 0 ? Object.keys(cacheData).map(key => `
                    <div style="padding: var(--space-xs) 0; border-bottom: 1px solid var(--border-subtle);">
                        <strong>${this.escapeHtml(key)}</strong>
                        <span style="color: var(--text-muted); font-size: 0.75rem;">
                            (TTL: ${Math.floor(cacheData[key].remainingTTL / 1000)}s remaining)
                        </span>
                    </div>
                `).join('') : '<p style="color: var(--text-muted);">No cached data</p>'}
            </div>

            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Close</button>
                <button type="button" class="btn btn-danger" onclick="app.closeModal(); app.pages.settings.clearCache()">
                    <i class="fas fa-trash"></i> Clear Cache
                </button>
            </div>
        `;

        this.showModal(html);
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.app.cacheManager.clear();
        this.showToast('Cache cleared successfully', 'success');

        // Refresh current page to reload data
        this.app.router.refreshCurrentPage();
    }

    /**
     * Refresh page data
     */
    async refreshPage() {
        await this.app.router.refreshCurrentPage();
    }
}
