/**
 * Roles Page
 * Manage Entra ID roles and their PIM policies
 */

import { BasePage } from '../core/PageRouter.js';
import { graphService } from '../services/graphService.js';
import { CACHE_KEYS } from '../core/CacheManager.js';

export class RolesPage extends BasePage {
    constructor(app) {
        super(app);
        this.paginator = app.paginators.roles;
        this.roleSortOrder = 'privilege-desc';
        this.filters = {
            search: '',
            privilege: 'all',
            type: 'all'
        };
    }

    /**
     * Render Roles page
     * @param {HTMLElement} container - Page container
     * @param {Object} params - Optional parameters
     */
    async render(container, params = {}) {
        let allRoles = [];

        if (this.isConnected()) {
            this.showLoading('Loading roles...');

            // Try cache first
            allRoles = this.getCached(CACHE_KEYS.ROLES.key);

            if (!allRoles) {
                const result = await graphService.getRoleDefinitions();
                if (result.success) {
                    allRoles = result.roles;
                    this.setCached(CACHE_KEYS.ROLES.key, allRoles);
                } else {
                    this.showToast(`Failed to load roles: ${result.error}`, 'error');
                }
            }

            this.hideLoading();
        }

        allRoles = allRoles || [];

        // Sort roles by privilege level
        allRoles = this.sortRolesByPrivilege(allRoles, this.roleSortOrder);

        // Update paginator with all roles
        this.paginator.updateItems(allRoles);

        // Get current page items
        const roles = this.paginator.getCurrentPageItems();

        const privilegeBadge = (level) => {
            const config = {
                critical: { class: 'badge-critical', icon: 'fa-skull-crossbones', label: 'Critical' },
                high: { class: 'badge-high', icon: 'fa-exclamation-triangle', label: 'High' },
                medium: { class: 'badge-medium', icon: 'fa-shield-alt', label: 'Medium' },
                low: { class: 'badge-low', icon: 'fa-check-circle', label: 'Low' }
            };
            const c = config[level] || config.low;
            return `<span class="badge privilege-badge ${c.class}"><i class="fas ${c.icon}"></i> ${c.label}</span>`;
        };

        container.innerHTML = `
            <div class="page-header-row">
                <h1 class="page-header">Entra ID Roles</h1>
            </div>

            <div class="toolbar">
                <input type="text" id="role-search" class="input" placeholder="Search roles..."
                       value="${this.filters.search}"
                       oninput="app.pages.roles.updateFilter('search', this.value)">

                <select id="privilege-filter" class="input input-select"
                        onchange="app.pages.roles.updateFilter('privilege', this.value)">
                    <option value="all" ${this.filters.privilege === 'all' ? 'selected' : ''}>All Privileges</option>
                    <option value="critical" ${this.filters.privilege === 'critical' ? 'selected' : ''}>Critical Only</option>
                    <option value="high" ${this.filters.privilege === 'high' ? 'selected' : ''}>High Only</option>
                    <option value="medium" ${this.filters.privilege === 'medium' ? 'selected' : ''}>Medium Only</option>
                    <option value="low" ${this.filters.privilege === 'low' ? 'selected' : ''}>Low Only</option>
                </select>

                <select id="type-filter" class="input input-select"
                        onchange="app.pages.roles.updateFilter('type', this.value)">
                    <option value="all" ${this.filters.type === 'all' ? 'selected' : ''}>All Types</option>
                    <option value="builtin" ${this.filters.type === 'builtin' ? 'selected' : ''}>Built-in Only</option>
                    <option value="custom" ${this.filters.type === 'custom' ? 'selected' : ''}>Custom Only</option>
                </select>

                <select id="role-sort" class="input input-select" onchange="app.pages.roles.sortRoles(this.value)">
                    <option value="privilege-desc" ${this.roleSortOrder === 'privilege-desc' ? 'selected' : ''}>Privilege: High to Low</option>
                    <option value="privilege-asc" ${this.roleSortOrder === 'privilege-asc' ? 'selected' : ''}>Privilege: Low to High</option>
                    <option value="name-asc" ${this.roleSortOrder === 'name-asc' ? 'selected' : ''}>Name: A to Z</option>
                    <option value="name-desc" ${this.roleSortOrder === 'name-desc' ? 'selected' : ''}>Name: Z to A</option>
                </select>

                ${this.filters.search || this.filters.privilege !== 'all' || this.filters.type !== 'all' ? `
                    <button class="btn btn-secondary" onclick="app.pages.roles.clearFilters()" title="Clear all filters">
                        <i class="fas fa-times"></i> Clear Filters
                    </button>
                ` : ''}

                <button class="btn btn-secondary" onclick="app.showExportMenu('roles')" ${!this.isConnected() || allRoles.length === 0 ? 'disabled' : ''}>
                    <i class="fas fa-file-export"></i> Export
                </button>
                <button class="btn btn-secondary" onclick="app.pages.roles.refreshPage()" ${!this.isConnected() ? 'disabled' : ''}>
                    <i class="fas fa-sync"></i> Refresh
                </button>
            </div>

            <div class="card">
                <table class="data-table" id="roles-table">
                    <thead>
                        <tr>
                            <th class="sortable" onclick="app.pages.roles.sortRoles('name')">Role Name <i class="fas fa-sort"></i></th>
                            <th>Description</th>
                            <th class="sortable" onclick="app.pages.roles.sortRoles('privilege')">Privilege <i class="fas fa-sort"></i></th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${roles.length > 0 ? roles.map(r => `
                            <tr data-id="${r.id}" data-privilege="${r.privilegeLevel}">
                                <td><strong>${this.escapeHtml(r.displayName)}</strong></td>
                                <td class="description-cell">${this.escapeHtml((r.description || '').substring(0, 80))}${(r.description || '').length > 80 ? '...' : ''}</td>
                                <td>${privilegeBadge(r.privilegeLevel)}</td>
                                <td>${r.isBuiltIn ? '<span class="badge">Built-in</span>' : '<span class="badge badge-secondary">Custom</span>'}</td>
                                <td>
                                    <button class="icon-btn" onclick="app.pages.roles.assignGroupToRole('${r.id}', '${this.escapeHtml(r.displayName)}')" title="Assign Group" aria-label="Assign group to ${this.escapeHtml(r.displayName)}">
                                        <i class="fas fa-user-plus" aria-hidden="true"></i>
                                    </button>
                                    <button class="icon-btn" onclick="app.pages.roles.configureRolePolicy('${r.id}')" title="Configure Policy" aria-label="Configure policy for ${this.escapeHtml(r.displayName)}">
                                        <i class="fas fa-cog" aria-hidden="true"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('') : `
                            <tr>
                                <td colspan="5" class="empty-state">
                                    ${this.isConnected() ? 'No roles found' : 'Connect to view roles'}
                                </td>
                            </tr>
                        `}
                    </tbody>
                </table>

                ${this.paginator.renderControls('app.pages.roles.handlePageChange')}
            </div>

            <div class="privilege-legend">
                <span class="legend-title">Privilege Levels:</span>
                <span class="badge privilege-badge badge-critical"><i class="fas fa-skull-crossbones"></i> Critical</span>
                <span class="badge privilege-badge badge-high"><i class="fas fa-exclamation-triangle"></i> High</span>
                <span class="badge privilege-badge badge-medium"><i class="fas fa-shield-alt"></i> Medium</span>
                <span class="badge privilege-badge badge-low"><i class="fas fa-check-circle"></i> Low</span>
            </div>
        `;
    }

    /**
     * Sort roles by privilege level
     * @param {Array} roles - Roles array
     * @param {string} order - Sort order
     * @returns {Array} Sorted roles
     */
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

    /**
     * Sort roles by user selection
     * @param {string} order - Sort order
     */
    sortRoles(order) {
        // Toggle direction if clicking same column header
        if (order === 'privilege') {
            order = this.roleSortOrder === 'privilege-desc' ? 'privilege-asc' : 'privilege-desc';
        } else if (order === 'name') {
            order = this.roleSortOrder === 'name-asc' ? 'name-desc' : 'name-asc';
        }

        this.roleSortOrder = order;
        this.app.router.refreshCurrentPage();
    }

    /**
     * Update filter and apply all filters
     * @param {string} filterType - Type of filter (search, privilege, type)
     * @param {string} value - Filter value
     */
    updateFilter(filterType, value) {
        this.filters[filterType] = value;
        this.applyFilters();
    }

    /**
     * Apply all active filters
     */
    applyFilters() {
        const rows = document.querySelectorAll('#roles-table tbody tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const privilegeLevel = row.dataset.privilege;
            const isBuiltIn = row.querySelector('.badge:not(.privilege-badge)')?.textContent.trim() === 'Built-in';

            // Search filter
            const matchesSearch = !this.filters.search ||
                text.includes(this.filters.search.toLowerCase());

            // Privilege filter
            const matchesPrivilege = this.filters.privilege === 'all' ||
                privilegeLevel === this.filters.privilege;

            // Type filter
            const matchesType = this.filters.type === 'all' ||
                (this.filters.type === 'builtin' && isBuiltIn) ||
                (this.filters.type === 'custom' && !isBuiltIn);

            // Show row only if all filters match
            row.style.display = (matchesSearch && matchesPrivilege && matchesType) ? '' : 'none';
        });

        // Update filter count badge
        this.updateFilterCount();
    }

    /**
     * Update visible count of filtered roles
     */
    updateFilterCount() {
        const rows = document.querySelectorAll('#roles-table tbody tr');
        const visibleCount = Array.from(rows).filter(row => row.style.display !== 'none').length;
        const totalCount = rows.length;

        // Update page header with count if filtering is active
        if (this.filters.search || this.filters.privilege !== 'all' || this.filters.type !== 'all') {
            const header = document.querySelector('.page-header');
            if (header) {
                header.innerHTML = `Entra ID Roles <span class="badge badge-secondary">${visibleCount} of ${totalCount}</span>`;
            }
        }
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.filters = {
            search: '',
            privilege: 'all',
            type: 'all'
        };
        this.app.router.refreshCurrentPage();
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
        this.app.cacheManager.invalidate(CACHE_KEYS.ROLES.key);
        await this.app.router.refreshCurrentPage();
    }

    /**
     * Configure role policy
     * @param {string} roleId - Role ID
     */
    async configureRolePolicy(roleId) {
        const allRoles = this.getCached(CACHE_KEYS.ROLES.key) || [];
        const role = allRoles.find(r => r.id === roleId);

        if (!role) {
            this.showToast('Role not found', 'error');
            return;
        }

        this.showLoading('Loading policy settings...');

        const result = await graphService.getRolePolicy(roleId);

        this.hideLoading();

        if (!result.success) {
            this.showToast(`Failed to load policy: ${result.error}`, 'error');
            return;
        }

        const policy = result.policy || {};

        const content = `
            <div class="modal-header">
                <h2 class="modal-title">
                    <i class="fas fa-shield-alt"></i> Configure Policy: ${this.escapeHtml(role.displayName)}
                </h2>
                <button class="modal-close" onclick="app.closeModal()" title="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body modal-lg">
                <form id="policy-form">
                    <div class="tabs">
                        <button type="button" class="tab-btn active" onclick="app.pages.roles.switchPolicyTab('activation')">
                            <i class="fas fa-play-circle"></i> Activation
                        </button>
                        <button type="button" class="tab-btn" onclick="app.pages.roles.switchPolicyTab('assignment')">
                            <i class="fas fa-user-plus"></i> Assignment
                        </button>
                        <button type="button" class="tab-btn" onclick="app.pages.roles.switchPolicyTab('notifications')">
                            <i class="fas fa-bell"></i> Notifications
                        </button>
                    </div>

                    <div id="tab-activation" class="tab-content active">
                        <h3><i class="fas fa-play-circle"></i> Activation Settings</h3>
                        <p class="form-hint">Controls how users can activate this role</p>

                        <div class="form-section">
                            <label class="form-label">
                                <input type="checkbox" name="requireMfa" ${policy.requireMfa ? 'checked' : ''}>
                                <strong>Require Multi-Factor Authentication (MFA)</strong>
                                <small class="form-hint">Users must complete MFA challenge to activate</small>
                            </label>

                            <label class="form-label">
                                <input type="checkbox" name="requireApproval" ${policy.requireApproval ? 'checked' : ''}
                                       onchange="document.getElementById('approvers-section').style.display = this.checked ? 'block' : 'none'">
                                <strong>Require Approval</strong>
                                <small class="form-hint">Activation request must be approved by designated approvers</small>
                            </label>

                            <div id="approvers-section" style="display: ${policy.requireApproval ? 'block' : 'none'}; margin-left: 2rem;">
                                <label class="form-label">
                                    Approvers (comma-separated emails)
                                    <textarea name="approvers" class="input" rows="2"
                                              placeholder="admin1@company.com, admin2@company.com">${policy.approvers?.join(', ') || ''}</textarea>
                                    <small class="form-hint">Leave empty to use default approvers</small>
                                </label>
                            </div>

                            <label class="form-label">
                                <input type="checkbox" name="requireJustification" ${policy.requireJustification ? 'checked' : ''}>
                                <strong>Require Justification</strong>
                                <small class="form-hint">Users must provide business justification for activation</small>
                            </label>

                            <label class="form-label">
                                <input type="checkbox" name="requireTicket" ${policy.requireTicket ? 'checked' : ''}>
                                <strong>Require Ticket Number</strong>
                                <small class="form-hint">Users must provide change management ticket reference</small>
                            </label>
                        </div>

                        <div class="form-section">
                            <h4>Activation Duration</h4>
                            <label class="form-label">
                                Maximum Duration (hours)
                                <div style="display: flex; gap: 0.5rem; align-items: center;">
                                    <input type="number" name="maximumDurationHours" class="input" min="0.5" max="24" step="0.5"
                                           value="${policy.maximumDurationHours || 8}" style="flex: 1;">
                                    <div class="duration-presets">
                                        <button type="button" class="btn btn-sm btn-secondary" onclick="document.querySelector('[name=maximumDurationHours]').value = 1">1h</button>
                                        <button type="button" class="btn btn-sm btn-secondary" onclick="document.querySelector('[name=maximumDurationHours]').value = 4">4h</button>
                                        <button type="button" class="btn btn-sm btn-secondary" onclick="document.querySelector('[name=maximumDurationHours]').value = 8">8h</button>
                                        <button type="button" class="btn btn-sm btn-secondary" onclick="document.querySelector('[name=maximumDurationHours]').value = 24">24h</button>
                                    </div>
                                </div>
                                <small class="form-hint">Maximum time the role can be active (0.5 to 24 hours)</small>
                            </label>

                            <label class="form-label">
                                Default Duration (hours)
                                <input type="number" name="defaultDurationHours" class="input" min="0.5" max="24" step="0.5"
                                       value="${policy.defaultDurationHours || 4}">
                                <small class="form-hint">Pre-filled duration when activating</small>
                            </label>
                        </div>
                    </div>

                    <div id="tab-assignment" class="tab-content" style="display: none;">
                        <h3><i class="fas fa-user-plus"></i> Assignment Settings</h3>
                        <p class="form-hint">Controls how users can be assigned as eligible for this role</p>

                        <div class="form-section">
                            <label class="form-label">
                                <input type="checkbox" name="allowPermanentEligible" ${policy.allowPermanentEligible !== false ? 'checked' : ''}>
                                <strong>Allow Permanent Eligible Assignments</strong>
                                <small class="form-hint">Administrators can assign users as permanently eligible</small>
                            </label>

                            <label class="form-label">
                                <input type="checkbox" name="requireJustificationOnAssignment" ${policy.requireJustificationOnAssignment ? 'checked' : ''}>
                                <strong>Require Justification for Assignment</strong>
                                <small class="form-hint">Administrators must justify when making users eligible</small>
                            </label>

                            <label class="form-label">
                                Maximum Eligible Assignment Duration (days)
                                <input type="number" name="maxEligibleDurationDays" class="input" min="1" max="365"
                                       value="${policy.maxEligibleDurationDays || 365}">
                                <small class="form-hint">Maximum time-bound eligible assignment (1-365 days, 0 = no limit)</small>
                            </label>
                        </div>

                        <div class="form-section">
                            <h4>Active Assignment Settings</h4>
                            <label class="form-label">
                                <input type="checkbox" name="allowPermanentActive" ${policy.allowPermanentActive ? 'checked' : ''}>
                                <strong>Allow Permanent Active Assignments</strong>
                                <small class="form-hint warning-text">⚠️ Not recommended for PIM - bypasses activation requirements</small>
                            </label>

                            <label class="form-label">
                                Maximum Active Assignment Duration (days)
                                <input type="number" name="maxActiveDurationDays" class="input" min="1" max="365"
                                       value="${policy.maxActiveDurationDays || 180}">
                                <small class="form-hint">Maximum time-bound active assignment (1-365 days)</small>
                            </label>
                        </div>
                    </div>

                    <div id="tab-notifications" class="tab-content" style="display: none;">
                        <h3><i class="fas fa-bell"></i> Notification Settings</h3>
                        <p class="form-hint">Configure who gets notified and when</p>

                        <div class="form-section">
                            <h4>Activation Notifications</h4>
                            <label class="form-label">
                                <input type="checkbox" name="notifyOnActivation" ${policy.notifyOnActivation !== false ? 'checked' : ''}>
                                <strong>Notify on Role Activation</strong>
                                <small class="form-hint">Send notification when role is activated</small>
                            </label>

                            <label class="form-label">
                                <input type="checkbox" name="notifyOnExpiration" ${policy.notifyOnExpiration !== false ? 'checked' : ''}>
                                <strong>Notify Before Expiration</strong>
                                <small class="form-hint">Send reminder before activation expires</small>
                            </label>

                            <label class="form-label">
                                Expiration Warning (hours before)
                                <input type="number" name="expirationWarningHours" class="input" min="0.5" max="24" step="0.5"
                                       value="${policy.expirationWarningHours || 1}">
                                <small class="form-hint">How early to send expiration warning</small>
                            </label>
                        </div>

                        <div class="form-section">
                            <h4>Assignment Notifications</h4>
                            <label class="form-label">
                                <input type="checkbox" name="notifyOnEligibleAssignment" ${policy.notifyOnEligibleAssignment !== false ? 'checked' : ''}>
                                <strong>Notify on Eligible Assignment</strong>
                                <small class="form-hint">Notify user when made eligible for role</small>
                            </label>

                            <label class="form-label">
                                <input type="checkbox" name="notifyAdminsOnAssignment" ${policy.notifyAdminsOnAssignment ? 'checked' : ''}>
                                <strong>Notify Admins on Assignment</strong>
                                <small class="form-hint">Send notification to admins when eligibility changes</small>
                            </label>
                        </div>

                        <div class="form-section">
                            <h4>Additional Recipients</h4>
                            <label class="form-label">
                                Additional Notification Recipients (comma-separated emails)
                                <textarea name="additionalRecipients" class="input" rows="2"
                                          placeholder="security@company.com, audit@company.com">${policy.additionalRecipients?.join(', ') || ''}</textarea>
                                <small class="form-hint">These recipients will receive all notifications for this role</small>
                            </label>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="app.closeModal()">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="app.pages.roles.resetPolicyToDefaults('${roleId}')">
                            <i class="fas fa-undo"></i> Reset to Defaults
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Policy
                        </button>
                    </div>
                </form>
            </div>
        `;

        this.showModal(content);

        // Handle form submission
        document.getElementById('policy-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSavePolicy(roleId, e.target);
        });
    }

    /**
     * Switch between tabs in policy modal
     * @param {string} tabName - Tab name
     */
    switchPolicyTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });

        document.querySelector(`.tab-btn[onclick*="${tabName}"]`)?.classList.add('active');
        const targetTab = document.getElementById(`tab-${tabName}`);
        if (targetTab) {
            targetTab.style.display = 'block';
            targetTab.classList.add('active');
        }
    }

    /**
     * Reset policy to default values
     * @param {string} roleId - Role ID
     */
    resetPolicyToDefaults(roleId) {
        if (!confirm('Reset this policy to default settings? Your custom configuration will be lost.')) {
            return;
        }

        // Set form to default values
        const form = document.getElementById('policy-form');
        if (form) {
            form.reset();

            // Set specific default values
            form.querySelector('[name="maximumDurationHours"]').value = 8;
            form.querySelector('[name="defaultDurationHours"]').value = 4;
            form.querySelector('[name="maxEligibleDurationDays"]').value = 365;
            form.querySelector('[name="maxActiveDurationDays"]').value = 180;
            form.querySelector('[name="expirationWarningHours"]').value = 1;

            // Enable default checkboxes
            form.querySelector('[name="notifyOnActivation"]').checked = true;
            form.querySelector('[name="notifyOnExpiration"]').checked = true;
            form.querySelector('[name="notifyOnEligibleAssignment"]').checked = true;
            form.querySelector('[name="allowPermanentEligible"]').checked = true;

            // Hide approvers section
            document.getElementById('approvers-section').style.display = 'none';

            this.showToast('Policy reset to defaults', 'info');
        }
    }

    /**
     * Handle save policy form submission
     * @param {string} roleId - Role ID
     * @param {HTMLFormElement} form - Form element
     */
    async handleSavePolicy(roleId, form) {
        const formData = new FormData(form);

        // Parse approvers and recipients lists
        const parseEmailList = (value) => {
            if (!value) return [];
            return value.split(',')
                .map(email => email.trim())
                .filter(email => email.length > 0);
        };

        const policyUpdate = {
            // Activation settings
            requireMfa: formData.get('requireMfa') === 'on',
            requireApproval: formData.get('requireApproval') === 'on',
            requireJustification: formData.get('requireJustification') === 'on',
            requireTicket: formData.get('requireTicket') === 'on',
            maximumDurationHours: parseFloat(formData.get('maximumDurationHours')) || 8,
            defaultDurationHours: parseFloat(formData.get('defaultDurationHours')) || 4,
            approvers: parseEmailList(formData.get('approvers')),

            // Assignment settings
            allowPermanentEligible: formData.get('allowPermanentEligible') === 'on',
            requireJustificationOnAssignment: formData.get('requireJustificationOnAssignment') === 'on',
            maxEligibleDurationDays: parseInt(formData.get('maxEligibleDurationDays')) || 365,
            allowPermanentActive: formData.get('allowPermanentActive') === 'on',
            maxActiveDurationDays: parseInt(formData.get('maxActiveDurationDays')) || 180,

            // Notification settings
            notifyOnActivation: formData.get('notifyOnActivation') === 'on',
            notifyOnExpiration: formData.get('notifyOnExpiration') === 'on',
            expirationWarningHours: parseFloat(formData.get('expirationWarningHours')) || 1,
            notifyOnEligibleAssignment: formData.get('notifyOnEligibleAssignment') === 'on',
            notifyAdminsOnAssignment: formData.get('notifyAdminsOnAssignment') === 'on',
            additionalRecipients: parseEmailList(formData.get('additionalRecipients'))
        };

        // Validate settings
        if (policyUpdate.defaultDurationHours > policyUpdate.maximumDurationHours) {
            this.showToast('Default duration cannot exceed maximum duration', 'error');
            return;
        }

        if (policyUpdate.requireApproval && policyUpdate.approvers.length === 0) {
            if (!confirm('No approvers specified. Continue with default approvers?')) {
                return;
            }
        }

        if (policyUpdate.allowPermanentActive) {
            if (!confirm('⚠️ Permanent active assignments bypass PIM protections. Are you sure?')) {
                return;
            }
        }

        this.closeModal();
        this.showLoading('Updating policy...');

        const result = await graphService.updateRolePolicy(roleId, policyUpdate);

        this.hideLoading();

        if (result.success) {
            this.showToast('Policy updated successfully', 'success');
        } else {
            this.showToast(`Failed to update policy: ${result.error}`, 'error');
        }
    }

    /**
     * Assign group to role (make group eligible for role)
     * @param {string} roleId - Role ID
     * @param {string} roleName - Role display name
     */
    async assignGroupToRole(roleId, roleName) {
        // Fetch available PIM groups
        this.showLoading('Loading groups...');
        const groupsResult = await graphService.getPIMGroups();
        this.hideLoading();

        if (!groupsResult.success || !groupsResult.groups || groupsResult.groups.length === 0) {
            this.showToast('No PIM groups available to assign', 'error');
            return;
        }

        const groups = groupsResult.groups;

        const content = `
            <div class="modal-header">
                <h2 class="modal-title">
                    <i class="fas fa-user-plus"></i> Assign Group to Role
                </h2>
                <button class="modal-close" onclick="app.closeModal()" title="Close" aria-label="Close dialog">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="modal-body">
                <div style="margin-bottom: var(--space-lg);">
                    <h3>${this.escapeHtml(roleName)}</h3>
                    <p class="text-muted">Assign a PIM group to this role</p>
                </div>

                <form id="assign-group-form">
                    <div class="form-section">
                        <label class="form-label">
                            <strong>Select Group <span class="required">*</span></strong>
                            <select name="groupId" class="input" required>
                                <option value="">-- Select a group --</option>
                                ${groups.map(g => `
                                    <option value="${g.id}">${this.escapeHtml(g.displayName)} (${g.memberCount} members)</option>
                                `).join('')}
                            </select>
                            <small class="form-hint">Choose which PIM group to assign to this role</small>
                        </label>
                    </div>

                    <div class="form-section">
                        <label class="form-label">
                            <strong>Assignment Type <span class="required">*</span></strong>
                            <select name="assignmentType" class="input" onchange="
                                const value = this.value;
                                const isPermanent = value.includes('permanent');
                                document.getElementById('duration-section').style.display = isPermanent ? 'none' : 'block';

                                // Update description
                                const descriptions = {
                                    'eligible-permanent': 'Group members can activate this role (no expiration)',
                                    'eligible-timebound': 'Group members can activate this role (expires after duration)',
                                    'active-permanent': '⚠️ Group members are ALWAYS active in this role (bypasses PIM)',
                                    'active-timebound': 'Group members are active in this role until expiration'
                                };
                                document.getElementById('assignment-type-hint').textContent = descriptions[value] || '';
                            " required>
                                <optgroup label="Eligible Assignments (Recommended)">
                                    <option value="eligible-permanent">Permanent Eligible (Recommended)</option>
                                    <option value="eligible-timebound">Time-Bound Eligible</option>
                                </optgroup>
                                <optgroup label="Active Assignments">
                                    <option value="active-permanent">Permanent Active (⚠️ Not Recommended)</option>
                                    <option value="active-timebound">Time-Bound Active</option>
                                </optgroup>
                            </select>
                            <small class="form-hint" id="assignment-type-hint">
                                Group members can activate this role (no expiration)
                            </small>
                        </label>
                    </div>

                    <div id="duration-section" style="display: none;">
                        <div class="form-section">
                            <label class="form-label">
                                <strong>Duration (days)</strong>
                                <input type="number" name="durationDays" class="input" min="1" max="365" value="365" step="1">
                                <small class="form-hint">How many days should this assignment last? (1-365 days)</small>
                            </label>
                        </div>
                    </div>

                    <div class="form-section">
                        <label class="form-label">
                            <strong>Justification</strong>
                            <textarea name="justification" class="input" rows="3"
                                      placeholder="Explain why this group needs access to this role..."></textarea>
                            <small class="form-hint">Provide business justification for this assignment</small>
                        </label>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="app.closeModal()">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-check"></i> Assign Group
                        </button>
                    </div>
                </form>
            </div>
        `;

        this.showModal(content);

        // Handle form submission
        document.getElementById('assign-group-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleAssignGroup(roleId, roleName, e.target);
        });
    }

    /**
     * Handle assign group form submission
     * @param {string} roleId - Role ID
     * @param {string} roleName - Role display name
     * @param {HTMLFormElement} form - Form element
     */
    async handleAssignGroup(roleId, roleName, form) {
        const formData = new FormData(form);
        const groupId = formData.get('groupId');
        const assignmentType = formData.get('assignmentType');
        const durationDays = parseInt(formData.get('durationDays')) || 365;
        const justification = formData.get('justification') || `PIM assignment to ${roleName}`;

        if (!groupId) {
            this.showToast('Please select a group', 'error');
            return;
        }

        // Parse assignment type
        const [assignmentMode, durationType] = assignmentType.split('-');
        const isActive = assignmentMode === 'active';
        const isPermanent = durationType === 'permanent';

        // Warn about active assignments (bypass PIM)
        if (isActive) {
            const confirmed = confirm(
                '⚠️ WARNING: Active assignments bypass PIM protections!\n\n' +
                'Group members will have IMMEDIATE access to this role without needing to activate.\n\n' +
                'This is NOT recommended for privileged roles. Consider using Eligible assignments instead.\n\n' +
                'Continue with Active assignment?'
            );

            if (!confirmed) {
                return;
            }
        }

        // Find group name for confirmation
        const groupsResult = await graphService.getPIMGroups();
        const group = groupsResult.groups?.find(g => g.id === groupId);
        const groupName = group?.displayName || 'Unknown Group';

        this.closeModal();
        this.showLoading(`Assigning ${groupName} to ${roleName}...`);

        // Calculate dates
        const startDateTime = new Date().toISOString();
        const endDateTime = isPermanent
            ? null
            : new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

        // Call the appropriate method based on assignment mode
        let result;
        if (isActive) {
            result = await graphService.createDirectoryRoleActiveAssignment(
                groupId,
                roleId,
                justification,
                startDateTime,
                endDateTime
            );
        } else {
            result = await graphService.createDirectoryRoleEligibleAssignment(
                groupId,
                roleId,
                justification,
                startDateTime,
                endDateTime
            );
        }

        this.hideLoading();

        if (result.success) {
            const mode = isActive ? 'Active' : 'Eligible';
            const duration = isPermanent ? 'permanently' : `for ${durationDays} days`;
            this.showToast(
                `Successfully assigned "${groupName}" as ${mode} to "${roleName}" ${duration}`,
                'success'
            );
        } else {
            this.showToast(
                `Failed to assign group: ${result.error}`,
                'error'
            );
        }
    }
}
