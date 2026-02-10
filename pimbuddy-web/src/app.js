/**
 * PIMBuddy Web Application
 * Main entry point and UI controller
 */

import { authService } from './services/authService.js';
import { graphService } from './services/graphService.js';
import { bootstrapService } from './services/bootstrapService.js';
import { templateService } from './services/templateService.js';
import { pimmaidService } from './services/pimmaidService.js';
import { baselineService } from './services/baselineService.js';
import { isAppConfigured, clearAppConfig, getSavedAppConfig } from './config/authConfig.js';
import { SecurityUtils, sessionManager } from './utils/security.js';
import { Paginator } from './utils/pagination.js';
import { PAGINATION } from './utils/constants.js';
import { ExportUtils, ExportConfigs } from './utils/export.js';
import { BulkOperationsManager, executeBulkOperation, renderBulkProgressModal, renderBulkResultsModal } from './utils/bulkOperations.js';
import { errorHandler, AppError, ErrorType, retryOperation, safeExecute } from './utils/errorHandling.js';
import UIComponents from './utils/uiComponents.js';
import { CacheManager } from './core/CacheManager.js';
import { PageRouter } from './core/PageRouter.js';
import { accessibilityManager } from './core/AccessibilityManager.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { GroupsPage } from './pages/GroupsPage.js';
import { RolesPage } from './pages/RolesPage.js';
import { ActivityPage } from './pages/ActivityPage.js';
import { ApprovalsPage } from './pages/ApprovalsPage.js';
import { ExpiringPage } from './pages/ExpiringPage.js';
import { HealthCheckPage } from './pages/HealthCheckPage.js';
import { CoveragePage } from './pages/CoveragePage.js';
import { PimmaidPage } from './pages/PimmaidPage.js';
import { PoliciesPage } from './pages/PoliciesPage.js';
import { TemplatesPage } from './pages/TemplatesPage.js';
import { ExportPage } from './pages/ExportPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { BaselinePage } from './pages/BaselinePage.js';
import { ActivationsPage } from './pages/ActivationsPage.js';

class PIMBuddyApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.isConnected = false;
        this.isConfigured = false;
        this.isDarkMode = false;
        this.cache = {
            groups: null,
            roles: null,
            templates: null
        };
        // Pagination instances
        this.paginators = {
            groups: new Paginator([], PAGINATION.DEFAULT_PAGE_SIZE),
            roles: new Paginator([], PAGINATION.DEFAULT_PAGE_SIZE),
            activity: new Paginator([], PAGINATION.DEFAULT_PAGE_SIZE)
        };
        // Bulk operations managers
        this.bulkOps = {
            groups: new BulkOperationsManager()
        };
        // Export utilities
        this.exportUtils = ExportUtils;

        // Initialize cache manager
        this.cacheManager = new CacheManager();

        // Initialize page instances
        this.pages = {
            dashboard: new DashboardPage(this),
            groups: new GroupsPage(this),
            roles: new RolesPage(this),
            activity: new ActivityPage(this),
            approvals: new ApprovalsPage(this),
            expiring: new ExpiringPage(this),
            healthCheck: new HealthCheckPage(this),
            coverage: new CoveragePage(this),
            pimmaid: new PimmaidPage(this),
            baseline: new BaselinePage(this),
            policies: new PoliciesPage(this),
            templates: new TemplatesPage(this),
            export: new ExportPage(this),
            settings: new SettingsPage(this),
            activations: new ActivationsPage(this)
        };

        // Initialize router
        this.router = new PageRouter();

        // Register all pages with the router
        this.router.registerPages({
            'dashboard': this.pages.dashboard,
            'groups': this.pages.groups,
            'roles': this.pages.roles,
            'entra-roles': this.pages.roles, // alias
            'pim-activity': this.pages.activity,
            'pending-approvals': this.pages.approvals,
            'expiring-assignments': this.pages.expiring,
            'health-check': this.pages.healthCheck,
            'role-coverage': this.pages.coverage,
            'pimmaid': this.pages.pimmaid,
            'baseline': this.pages.baseline,
            'policies': this.pages.policies,
            'templates': this.pages.templates,
            'export': this.pages.export,
            'settings': this.pages.settings,
            'activations': this.pages.activations,
            'my-activations': this.pages.activations // alias
        });
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('PIMBuddy Web initializing...');

        // Initialize accessibility features
        accessibilityManager.initialize();

        // Load saved theme preference
        this.loadTheme();

        // Check if app is configured
        this.isConfigured = isAppConfigured();

        if (this.isConfigured) {
            // Initialize MSAL with saved config
            try {
                const initialized = await authService.initialize();

                if (initialized && authService.isAuthenticated()) {
                    this.handleSuccessfulLogin();
                }
            } catch (error) {
                console.error('Failed to initialize auth:', error);
                this.showToast('Failed to initialize authentication', 'error');
            }
        } else {
            // Show setup required message
            this.showSetupRequired();
        }

        // Set up event listeners
        this.setupEventListeners();

        // Render initial page
        this.renderPage(this.currentPage);

        console.log('PIMBuddy Web initialized');
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Connect button
        document.getElementById('connect-btn').addEventListener('click', () => this.handleConnect());

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());

        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateTo(page);
            });
        });

        // Modal backdrop click to close
        document.querySelector('.modal-backdrop')?.addEventListener('click', () => this.closeModal());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+F for search
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                this.showGlobalSearch();
            }
            // Escape to close modal
            if (e.key === 'Escape') {
                this.closeModal();
            }
            // F5 to refresh
            if (e.key === 'F5') {
                e.preventDefault();
                this.refreshCurrentPage();
            }
        });
    }

    /**
     * Show setup required state
     */
    showSetupRequired() {
        document.getElementById('connect-text').textContent = 'Setup';
        document.getElementById('connection-text').textContent = 'Setup Required';
    }

    /**
     * Handle connect/disconnect button
     */
    async handleConnect() {
        if (!this.isConfigured) {
            // Show setup wizard
            await this.showSetupWizard();
            return;
        }

        if (this.isConnected) {
            // Disconnect
            this.showLoading('Signing out...');
            const result = await authService.logout();
            this.hideLoading();

            if (result.success) {
                this.handleLogout();
            } else {
                this.showToast(result.error, 'error');
            }
        } else {
            // Connect
            this.showLoading('Signing in...');
            const result = await authService.login();
            this.hideLoading();

            if (result.success) {
                this.handleSuccessfulLogin();
            } else {
                this.showToast(result.error, 'error');
            }
        }
    }

    /**
     * Handle successful login
     */
    handleSuccessfulLogin() {
        this.isConnected = true;
        const account = authService.getAccount();

        // Update UI
        document.getElementById('connect-text').textContent = 'Disconnect';
        document.getElementById('connect-btn').classList.remove('btn-primary');
        document.getElementById('connect-btn').classList.add('btn-danger');
        document.getElementById('connection-indicator').classList.remove('disconnected');
        document.getElementById('connection-indicator').classList.add('connected');
        document.getElementById('connection-text').textContent = account?.username || 'Connected';

        this.showToast('Connected successfully', 'success');

        // Start session management
        sessionManager.start(
            // On timeout callback
            () => {
                this.showToast('Session expired due to inactivity', 'warning');
                this.handleLogout();
            },
            // On warning callback
            (remainingMinutes) => {
                this.showToast(
                    `Your session will expire in ${remainingMinutes} minutes due to inactivity`,
                    'warning'
                );
            }
        );

        // Refresh current page data
        this.refreshCurrentPage();
    }

    /**
     * Handle logout
     */
    handleLogout() {
        this.isConnected = false;
        this.cache = { groups: null, roles: null, templates: null };

        // Stop session management
        sessionManager.stop();

        // Update UI
        document.getElementById('connect-text').textContent = 'Connect';
        document.getElementById('connect-btn').classList.remove('btn-danger');
        document.getElementById('connect-btn').classList.add('btn-primary');
        document.getElementById('connection-indicator').classList.remove('connected');
        document.getElementById('connection-indicator').classList.add('disconnected');
        document.getElementById('connection-text').textContent = 'Not Connected';

        this.showToast('Disconnected', 'info');
        this.renderPage(this.currentPage);
    }

    /**
     * Navigate to a page
     */
    async navigateTo(page, params = {}) {
        // Use the router to navigate
        await this.router.navigateTo(page, params);
        this.currentPage = page;
    }

    /**
     * Render a page
     */
    async renderPage(page, params = {}) {
        // Use the router to render the page
        await this.router.navigateTo(page, params);

        // Announce page change for screen readers
        accessibilityManager.announcePageChange(page);
    }

    /**
     * Refresh current page
     */
    async refreshCurrentPage() {
        // Use the router to refresh the current page
        await this.router.refreshCurrentPage();
    }

    // ==========================================
    // Setup Wizard
    // ==========================================

    async showSetupWizard() {
        const savedConfig = getSavedAppConfig();
        const redirectUri = window.location.origin;

        const html = `
            <h2><i class="fas fa-cog"></i> PIMBuddy Setup</h2>
            <p>Configure PIMBuddy to connect to your Azure AD tenant.</p>

            <div class="setup-tabs">
                <button class="setup-tab active" onclick="app.switchSetupTab('manual')">
                    <i class="fas fa-edit"></i> Manual Setup
                </button>
                <button class="setup-tab" onclick="app.switchSetupTab('instructions')">
                    <i class="fas fa-book"></i> Instructions
                </button>
            </div>

            <div id="setup-tab-manual" class="setup-tab-content active">
                <form id="manual-setup-form" onsubmit="app.saveManualConfig(event)">
                    <div class="form-group">
                        <label for="client-id">Application (Client) ID *</label>
                        <input type="text" id="client-id" class="input" required
                            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                            value="${savedConfig?.clientId || ''}"
                            pattern="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}">
                        <small class="form-hint">Found in Azure Portal → App registrations → Your app → Overview</small>
                    </div>

                    <div class="form-group">
                        <label for="tenant-id">Directory (Tenant) ID *</label>
                        <input type="text" id="tenant-id" class="input" required
                            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                            value="${savedConfig?.tenantId || ''}"
                            pattern="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}">
                        <small class="form-hint">Found in Azure Portal → Azure Active Directory → Overview</small>
                    </div>

                    <div class="setup-note">
                        <i class="fas fa-info-circle"></i>
                        <span>Your Redirect URI must be: <code>${redirectUri}</code></span>
                    </div>

                    <div id="setup-result" class="setup-result hidden"></div>

                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
                        ${savedConfig ? `
                            <button type="button" class="btn btn-secondary" onclick="app.resetSetup()">
                                <i class="fas fa-trash"></i> Clear
                            </button>
                        ` : ''}
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save & Connect
                        </button>
                    </div>
                </form>
            </div>

            <div id="setup-tab-instructions" class="setup-tab-content">
                <div class="setup-instructions">
                    <h3>Step 1: Create App Registration</h3>
                    <ol>
                        <li>Go to <a href="https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade" target="_blank">Azure Portal → App registrations</a></li>
                        <li>Click <strong>New registration</strong></li>
                        <li>Name: <code>PIMBuddy Web</code></li>
                        <li>Supported account types: <strong>Single tenant</strong></li>
                        <li>Redirect URI: Select <strong>Single-page application (SPA)</strong> and enter:<br>
                            <code class="copyable" onclick="app.copyToClipboard('${redirectUri}')">${redirectUri}</code>
                        </li>
                        <li>Click <strong>Register</strong></li>
                    </ol>

                    <h3>Step 2: Configure API Permissions</h3>
                    <ol>
                        <li>In your new app, go to <strong>API permissions</strong></li>
                        <li>Click <strong>Add a permission</strong> → <strong>Microsoft Graph</strong> → <strong>Delegated permissions</strong></li>
                        <li>Add these permissions:
                            <ul class="permissions-list">
                                <li><code>User.Read</code></li>
                                <li><code>Group.Read.All</code></li>
                                <li><code>Group.ReadWrite.All</code></li>
                                <li><code>RoleManagement.Read.Directory</code></li>
                                <li><code>RoleManagement.ReadWrite.Directory</code></li>
                                <li><code>PrivilegedAccess.Read.AzureADGroup</code></li>
                                <li><code>PrivilegedAccess.ReadWrite.AzureADGroup</code></li>
                                <li><code>PrivilegedEligibilitySchedule.Read.AzureADGroup</code></li>
                                <li><code>PrivilegedEligibilitySchedule.ReadWrite.AzureADGroup</code></li>
                                <li><code>PrivilegedAssignmentSchedule.Read.AzureADGroup</code></li>
                                <li><code>PrivilegedAssignmentSchedule.ReadWrite.AzureADGroup</code></li>
                            </ul>
                        </li>
                        <li>Click <strong>Grant admin consent</strong> (requires admin role)</li>
                    </ol>

                    <h3>Step 3: Copy IDs</h3>
                    <ol>
                        <li>Go to <strong>Overview</strong></li>
                        <li>Copy the <strong>Application (client) ID</strong></li>
                        <li>Copy the <strong>Directory (tenant) ID</strong></li>
                        <li>Paste them in the <strong>Manual Setup</strong> tab</li>
                    </ol>
                </div>

                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Close</button>
                    <button type="button" class="btn btn-primary" onclick="app.switchSetupTab('manual')">
                        <i class="fas fa-arrow-left"></i> Back to Setup
                    </button>
                </div>
            </div>
        `;

        this.showModal(html);
    }

    switchSetupTab(tab) {
        document.querySelectorAll('.setup-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.setup-tab-content').forEach(c => c.classList.remove('active'));

        document.querySelector(`.setup-tab-content#setup-tab-${tab}`).classList.add('active');
        event.currentTarget.classList.add('active');
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied to clipboard', 'success');
        }).catch(() => {
            this.showToast('Failed to copy', 'error');
        });
    }

    async saveManualConfig(event) {
        event.preventDefault();

        const clientId = document.getElementById('client-id').value.trim();
        const tenantId = document.getElementById('tenant-id').value.trim();
        const resultDiv = document.getElementById('setup-result');

        // Validate GUIDs
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

        if (!guidRegex.test(clientId)) {
            resultDiv.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-circle"></i><div>Invalid Client ID format. Must be a GUID.</div></div>`;
            resultDiv.classList.remove('hidden');
            return;
        }

        if (!guidRegex.test(tenantId)) {
            resultDiv.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-circle"></i><div>Invalid Tenant ID format. Must be a GUID.</div></div>`;
            resultDiv.classList.remove('hidden');
            return;
        }

        // Save configuration
        const config = {
            clientId,
            tenantId,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem('pimbuddy-app-config', JSON.stringify(config));

        // Update app state
        this.isConfigured = true;

        // Re-initialize auth service with new config
        try {
            await authService.reinitialize();

            resultDiv.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <strong>Configuration saved!</strong>
                        <p>Click below to sign in.</p>
                    </div>
                </div>
            `;
            resultDiv.classList.remove('hidden');

            // Update connect button text
            document.getElementById('connect-text').textContent = 'Connect';
            document.getElementById('connection-text').textContent = 'Not Connected';

            // Auto-close and connect after a brief delay
            setTimeout(async () => {
                this.closeModal();
                await this.handleConnect();
            }, 1000);

        } catch (error) {
            resultDiv.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <div>
                        <strong>Configuration Error</strong>
                        <p>${error.message}</p>
                    </div>
                </div>
            `;
            resultDiv.classList.remove('hidden');
        }
    }

    async resetSetup() {
        if (!confirm('This will clear the saved configuration. You will need to run setup again. Continue?')) {
            return;
        }

        clearAppConfig();
        this.isConfigured = false;

        // Clear auth state
        authService.msalInstance = null;
        authService.account = null;
        authService.initialized = false;

        this.closeModal();
        this.showToast('Configuration cleared', 'info');
        this.showSetupRequired();
        this.renderPage(this.currentPage);
    }

    // ==========================================
    // Page Renderers
    // ==========================================

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

                <button class="btn btn-primary" onclick="document.getElementById('connect-btn').click()" style="font-size: 1.1rem; padding: var(--space-md) var(--space-xl); box-shadow: 0 10px 30px rgba(0, 212, 170, 0.3);">
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
                <button class="btn btn-primary" onclick="document.getElementById('connect-btn').click()" style="font-size: 1.2rem; padding: var(--space-md) var(--space-xl); box-shadow: 0 10px 30px rgba(0, 212, 170, 0.4);">
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

    sortRolesByPrivilege(roles, order) {
        const privilegeOrder = { critical: 0, high: 1, medium: 2, low: 3 };

        return [...roles].sort((a, b) => {
            if (order === 'privilege-desc') {
                return privilegeOrder[a.privilegeLevel] - privilegeOrder[b.privilegeLevel];
            } else if (order === 'privilege-asc') {
                return privilegeOrder[b.privilegeLevel] - privilegeOrder[a.privilegeLevel];
            } else if (order === 'name-asc') {
                return a.displayName.localeCompare(b.displayName);
            } else if (order === 'name-desc') {
                return b.displayName.localeCompare(a.displayName);
            }
            return 0;
        });
    }

    sortRoles(order) {
        // Toggle direction if clicking same column header
        if (order === 'privilege') {
            order = this.roleSortOrder === 'privilege-desc' ? 'privilege-asc' : 'privilege-desc';
        } else if (order === 'name') {
            order = this.roleSortOrder === 'name-asc' ? 'name-desc' : 'name-asc';
        }

        this.roleSortOrder = order;
        this.renderPage('roles');
    }


    handleActivityPageChange(page) {
        this.paginators.activity.goToPage(page);
        this.renderPage('pim-activity');
    }

    handleActivityPageSizeChange(size) {
        this.paginators.activity.setPageSize(size);
        this.renderPage('pim-activity');
    }

    showGlobalSearch() {
        this.showToast('Global search coming soon', 'info');
    }

    // Export methods

    exportActivityToCSV() {
        try {
            const logs = this.paginators.activity.allItems || [];
            if (logs.length === 0) {
                this.showToast('No activity logs to export', 'warning');
                return;
            }

            const filename = ExportUtils.generateFilename('pim-activity');
            ExportUtils.exportToCSV(logs, filename, ExportConfigs.activity.columns);
            this.showToast(`Exported ${logs.length} activity logs to CSV`, 'success');
        } catch (error) {
            this.showToast(`Export failed: ${error.message}`, 'error');
        }
    }

    exportActivityToJSON() {
        try {
            const logs = this.paginators.activity.allItems || [];
            if (logs.length === 0) {
                this.showToast('No activity logs to export', 'warning');
                return;
            }

            const filename = ExportUtils.generateFilename('pim-activity');
            ExportUtils.exportToJSON(logs, filename);
            this.showToast(`Exported ${logs.length} activity logs to JSON`, 'success');
        } catch (error) {
            this.showToast(`Export failed: ${error.message}`, 'error');
        }
    }

    showExportMenu(type) {
        const content = `
            <div style="text-align: center; padding: var(--space-xl);">
                <div style="width: 80px; height: 80px; margin: 0 auto var(--space-lg); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-file-export" style="font-size: 2.5rem; color: var(--accent-primary);"></i>
                </div>

                <h2 style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; margin-bottom: var(--space-md);">
                    Export ${type.charAt(0).toUpperCase() + type.slice(1)}
                </h2>

                <p style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--space-xl);">
                    Choose your preferred export format
                </p>

                <div style="display: flex; flex-direction: column; gap: var(--space-md); max-width: 400px; margin: 0 auto;">
                    <button class="btn btn-primary" onclick="app.export${type.charAt(0).toUpperCase() + type.slice(1)}ToCSV(); app.closeModal();" style="justify-content: center; font-family: var(--font-mono); padding: var(--space-md);">
                        <i class="fas fa-file-csv"></i> Export as CSV
                        <span style="font-size: 0.75rem; opacity: 0.7; margin-left: auto;">Spreadsheet compatible</span>
                    </button>

                    <button class="btn btn-secondary" onclick="app.export${type.charAt(0).toUpperCase() + type.slice(1)}ToJSON(); app.closeModal();" style="justify-content: center; font-family: var(--font-mono); padding: var(--space-md);">
                        <i class="fas fa-file-code"></i> Export as JSON
                        <span style="font-size: 0.75rem; opacity: 0.7; margin-left: auto;">Developer friendly</span>
                    </button>
                </div>

                <button class="btn btn-secondary btn-sm" onclick="app.closeModal()" style="margin-top: var(--space-xl); font-family: var(--font-mono);">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        `;

        this.showModal(content);
    }


    async applyTemplateToRole(roleId) {
        const templates = templateService.getAllTemplates();

        const html = `
            <h2><i class="fas fa-copy"></i> Apply Template to Role</h2>
            <p>Select a template to apply its settings to this role's PIM policy.</p>

            <div class="template-select-list">
                ${Object.values(templates).map(t => `
                    <div class="template-select-item" onclick="app.executeApplyTemplateToRole('${roleId}', '${t.id}')">
                        <div class="template-icon ${t.color || 'primary'}">
                            <i class="fas ${t.icon}"></i>
                        </div>
                        <div class="template-info">
                            <strong>${this.escapeHtml(t.name)}</strong>
                            <span>${t.settings.activation.maximumDurationHours}h | MFA: ${t.settings.activation.requireMfa ? 'Yes' : 'No'} | Approval: ${t.settings.activation.requireApproval ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
            </div>
        `;

        this.showModal(html);
    }

    async executeApplyTemplateToRole(roleId, templateId) {
        const template = templateService.getTemplate(templateId);
        if (!template) {
            this.showToast('Template not found', 'error');
            return;
        }

        this.closeModal();
        this.showLoading('Applying template...');

        const result = await graphService.updateRolePolicy(roleId, {
            maximumDurationHours: template.settings.activation.maximumDurationHours,
            requireMfa: template.settings.activation.requireMfa,
            requireJustification: template.settings.activation.requireJustification,
            requireTicketInfo: template.settings.activation.requireTicketInfo,
            requireApproval: template.settings.activation.requireApproval
        });

        this.hideLoading();

        if (result.success) {
            this.showToast('Template applied successfully', 'success');
            // Refresh the policy view
            const roleName = document.querySelector('.policy-editor h2')?.textContent;
            if (roleName) {
                await this.selectRoleForPolicy(roleId, roleName);
            }
        } else {
            this.showToast(result.error, 'error');
        }
    }


    exportConfig() {
        this.showToast('Export coming soon', 'info');
    }

    handleImport(files) {
        if (files.length > 0) {
            this.showToast(`Selected file: ${files[0].name}`, 'info');
        }
    }

    // ==========================================
    // UI Helpers
    // ==========================================

    showLoading(text = 'Loading...') {
        document.getElementById('loading-text').textContent = text;
        document.getElementById('loading-overlay').classList.remove('hidden');

        // Announce loading state for screen readers
        accessibilityManager.announceLoading(true, text);
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.add('hidden');

        // Announce loading complete for screen readers
        accessibilityManager.announceLoading(false);
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${this.escapeHtml(message)}</span>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    showModal(content) {
        document.getElementById('modal-content').innerHTML = content;
        document.getElementById('modal-container').classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('modal-container').classList.add('hidden');
    }

    // ==========================================
    // New Feature Pages
    // ==========================================


    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        localStorage.setItem('pimbuddy-theme', this.isDarkMode ? 'dark' : 'light');
    }

    setTheme(theme) {
        this.isDarkMode = theme === 'dark';
        this.applyTheme();
        localStorage.setItem('pimbuddy-theme', theme);
    }

    loadTheme() {
        const saved = localStorage.getItem('pimbuddy-theme');
        // Default to dark mode if no preference saved
        this.isDarkMode = saved !== 'light';
        this.applyTheme();
    }

    applyTheme() {
        document.body.classList.toggle('dark-mode', this.isDarkMode);
        const icon = document.querySelector('#theme-toggle i');
        if (icon) {
            icon.className = this.isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    /**
     * Escape HTML to prevent XSS (delegates to SecurityUtils)
     */
    escapeHtml(text) {
        return SecurityUtils.escapeHtml(text);
    }
}

// Initialize app
const app = new PIMBuddyApp();
window.app = app; // Make available globally for onclick handlers
app.init();
