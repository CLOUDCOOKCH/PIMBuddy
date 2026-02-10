/**
 * Policies Page
 * Configure PIM activation settings for Entra ID roles
 * Note: This is a simplified view - full policy editor is in RolesPage
 */

import { BasePage } from '../core/PageRouter.js';
import { graphService } from '../services/graphService.js';
import { CACHE_KEYS } from '../core/CacheManager.js';

export class PoliciesPage extends BasePage {
    constructor(app) {
        super(app);
    }

    /**
     * Render Policies page
     * @param {HTMLElement} container - Page container
     * @param {Object} params - Optional parameters
     */
    async render(container, params = {}) {
        container.innerHTML = `
            <div class="page-header-row">
                <h1 class="page-header">Role Policy Configuration</h1>
            </div>
            <p class="page-description">Configure PIM activation settings for Entra ID roles. Select a role from the list to view and edit its policy.</p>

            <div class="policy-layout">
                <div class="card policy-list">
                    <h3>Entra ID Roles</h3>
                    <p class="caption">Click a role to configure</p>
                    <input type="text" class="input" placeholder="Filter roles..." oninput="app.pages.policies.filterRoles(this.value)">
                    <div class="policy-items" id="policy-role-list">
                        ${this.isConnected() ? '<p class="loading-text">Loading roles...</p>' : '<p class="empty-text">Connect to view roles</p>'}
                    </div>
                </div>
                <div class="card policy-editor">
                    <div class="empty-state-large">
                        <i class="fas fa-file-alt"></i>
                        <h3>Select a role to configure its PIM policy</h3>
                        <p>Configure activation duration, MFA requirements, justification, approval, and more.</p>
                    </div>
                </div>
            </div>
        `;

        if (this.isConnected()) {
            await this.loadRoles();
        }
    }

    /**
     * Load roles list
     */
    async loadRoles() {
        // Try cache first
        let roles = this.getCached(CACHE_KEYS.ROLES.key);

        if (!roles) {
            const result = await graphService.getRoleDefinitions();
            if (result.success) {
                roles = result.roles;
                this.setCached(CACHE_KEYS.ROLES.key, roles);
            } else {
                this.showToast(`Failed to load roles: ${result.error}`, 'error');
                return;
            }
        }

        this.allRoles = roles;
        this.displayRoles(roles);
    }

    /**
     * Display roles in list
     * @param {Array} roles - Roles to display
     */
    displayRoles(roles) {
        const listContainer = document.getElementById('policy-role-list');
        if (!listContainer) return;

        listContainer.innerHTML = roles.map(r => `
            <div class="policy-item" onclick="app.pages.policies.selectRole('${r.id}', '${this.escapeHtml(r.displayName)}')">
                <strong>${this.escapeHtml(r.displayName)}</strong>
            </div>
        `).join('');
    }

    /**
     * Filter roles by search query
     * @param {string} query - Search query
     */
    filterRoles(query) {
        if (!this.allRoles) return;

        const filtered = this.allRoles.filter(role =>
            role.displayName.toLowerCase().includes(query.toLowerCase())
        );

        this.displayRoles(filtered);
    }

    /**
     * Select role for policy configuration
     * @param {string} roleId - Role ID
     * @param {string} roleName - Role display name
     */
    async selectRole(roleId, roleName) {
        // Navigate to roles page with this role selected for policy configuration
        // For now, show a message that full policy editor is in Roles page
        this.showToast(`Policy configuration for ${roleName} - Use Roles page for full editor`, 'info');

        // Optionally navigate to roles page
        // await this.app.router.navigateTo('entra-roles', { selectedRole: roleId });
    }

    /**
     * Refresh page data
     */
    async refreshPage() {
        this.app.cacheManager.invalidate(CACHE_KEYS.ROLES.key);
        await this.app.router.refreshCurrentPage();
    }
}
