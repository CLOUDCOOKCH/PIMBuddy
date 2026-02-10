import{B as i}from"./core-rjX7nIO3.js";import{a as c}from"./services-DF6cB9Vv.js";class d extends i{constructor(a){super(a)}async render(a,t={}){const s=c();a.innerHTML=`
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
                            <option value="light" ${this.app.isDarkMode?"":"selected"}>Light</option>
                            <option value="dark" ${this.app.isDarkMode?"selected":""}>Dark</option>
                        </select>
                    </div>
                </div>

                <div class="card">
                    <h2>App Configuration</h2>
                    ${s?`
                        <div class="config-info">
                            <p><strong>Client ID:</strong> <code>${this.escapeHtml(s.clientId)}</code></p>
                            <p><strong>Tenant ID:</strong> <code>${this.escapeHtml(s.tenantId)}</code></p>
                            <p><strong>Configured:</strong> ${new Date(s.createdAt).toLocaleString()}</p>
                        </div>
                        <button class="btn btn-secondary" onclick="app.resetSetup()" aria-label="Reset configuration">
                            <i class="fas fa-redo"></i> Reset Configuration
                        </button>
                    `:`
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
        `}showCacheStats(){const a=this.app.cacheManager.getStats(),t=this.app.cacheManager.exportState(),s=`
            <h2><i class="fas fa-chart-bar"></i> Cache Statistics</h2>

            <div class="stats-grid" style="margin-bottom: var(--space-lg);">
                <div class="stat-card">
                    <div class="stat-value">${a.size}</div>
                    <div class="stat-label">Cached Items</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${a.hits}</div>
                    <div class="stat-label">Cache Hits</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${a.misses}</div>
                    <div class="stat-label">Cache Misses</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${a.hitRate}</div>
                    <div class="stat-label">Hit Rate</div>
                </div>
            </div>

            <h3>Cached Data</h3>
            <div style="max-height: 300px; overflow-y: auto; background: var(--bg-surface); padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.8rem;">
                ${Object.keys(t).length>0?Object.keys(t).map(e=>`
                    <div style="padding: var(--space-xs) 0; border-bottom: 1px solid var(--border-subtle);">
                        <strong>${this.escapeHtml(e)}</strong>
                        <span style="color: var(--text-muted); font-size: 0.75rem;">
                            (TTL: ${Math.floor(t[e].remainingTTL/1e3)}s remaining)
                        </span>
                    </div>
                `).join(""):'<p style="color: var(--text-muted);">No cached data</p>'}
            </div>

            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Close</button>
                <button type="button" class="btn btn-danger" onclick="app.closeModal(); app.pages.settings.clearCache()">
                    <i class="fas fa-trash"></i> Clear Cache
                </button>
            </div>
        `;this.showModal(s)}clearCache(){this.app.cacheManager.clear(),this.showToast("Cache cleared successfully","success"),this.app.router.refreshCurrentPage()}async refreshPage(){await this.app.router.refreshCurrentPage()}}export{d as S};
//# sourceMappingURL=page-settingspage-CK1_T0S5.js.map
