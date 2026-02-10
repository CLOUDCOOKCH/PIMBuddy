/**
 * Activations Page
 * Manage PIM role activations - view eligible roles, activate, and deactivate
 */

import { BasePage } from '../core/PageRouter.js';
import { graphService } from '../services/graphService.js';
import { CACHE_KEYS } from '../core/CacheManager.js';
import UIComponents from '../utils/uiComponents.js';

export class ActivationsPage extends BasePage {
    constructor(app) {
        super(app);
        this.currentTab = 'eligible';
    }

    /**
     * Render Activations page
     * @param {HTMLElement} container - Page container
     * @param {Object} params - Optional parameters
     */
    async render(container, params = {}) {
        let eligibleRoles = [];
        let activeRoles = [];

        if (this.isConnected()) {
            this.showLoading('Loading role assignments...');

            // Fetch eligible and active role assignments in parallel
            const [eligibleResult, activeResult] = await Promise.all([
                graphService.getMyEligibleRoles(),
                graphService.getMyActiveRoles()
            ]);

            if (eligibleResult.success) {
                eligibleRoles = eligibleResult.roles;
            } else {
                this.showToast(`Failed to load eligible roles: ${eligibleResult.error}`, 'error');
            }

            if (activeResult.success) {
                activeRoles = activeResult.roles;
            } else {
                this.showToast(`Failed to load active roles: ${activeResult.error}`, 'error');
            }

            this.hideLoading();
        }

        container.innerHTML = `
            <div class="page-header-row">
                <h1 class="page-header">
                    <i class="fas fa-user-clock"></i> My Role Activations
                </h1>
            </div>

            <div class="info-banner">
                <i class="fas fa-info-circle"></i>
                <div>
                    <strong>Just-in-Time Access</strong>
                    <p>Activate eligible roles when needed. Activations are time-limited and require justification.</p>
                </div>
            </div>

            <div class="tabs">
                <button class="tab-btn ${this.currentTab === 'eligible' ? 'active' : ''}"
                        onclick="app.pages.activations.switchTab('eligible')">
                    <i class="fas fa-unlock"></i> Eligible Roles (${eligibleRoles.length})
                </button>
                <button class="tab-btn ${this.currentTab === 'active' ? 'active' : ''}"
                        onclick="app.pages.activations.switchTab('active')">
                    <i class="fas fa-check-circle"></i> Active Roles (${activeRoles.length})
                </button>
            </div>

            <!-- Eligible Roles Tab -->
            <div id="tab-eligible" class="tab-content ${this.currentTab === 'eligible' ? 'active' : ''}"
                 style="display: ${this.currentTab === 'eligible' ? 'block' : 'none'};">
                ${this.renderEligibleRoles(eligibleRoles)}
            </div>

            <!-- Active Roles Tab -->
            <div id="tab-active" class="tab-content ${this.currentTab === 'active' ? 'active' : ''}"
                 style="display: ${this.currentTab === 'active' ? 'block' : 'none'};">
                ${this.renderActiveRoles(activeRoles)}
            </div>
        `;
    }

    /**
     * Render eligible roles list
     * @param {Array} roles - Eligible roles
     * @returns {string} HTML
     */
    renderEligibleRoles(roles) {
        if (!this.isConnected()) {
            return `<div class="empty-state"><i class="fas fa-plug"></i><p>Connect to view your eligible roles</p></div>`;
        }

        if (roles.length === 0) {
            return `<div class="empty-state"><i class="fas fa-inbox"></i><p>You have no eligible role assignments</p></div>`;
        }

        return `
            <div class="card">
                <div class="card-header">
                    <h3>Roles You Can Activate</h3>
                    <p class="card-subtitle">Click "Activate" to request time-limited access to a role</p>
                </div>

                <div class="roles-grid">
                    ${roles.map(role => `
                        <div class="role-card eligible-role">
                            <div class="role-card-header">
                                <div class="role-icon ${this.getPrivilegeClass(role.privilegeLevel)}">
                                    <i class="fas ${this.getPrivilegeIcon(role.privilegeLevel)}"></i>
                                </div>
                                <div class="role-info">
                                    <h4>${this.escapeHtml(role.displayName)}</h4>
                                    <p class="role-description">${this.escapeHtml(role.description || 'No description')}</p>
                                </div>
                            </div>

                            <div class="role-card-body">
                                <div class="role-meta">
                                    <div class="meta-item">
                                        <i class="fas fa-shield-alt"></i>
                                        <span>${this.formatPrivilegeLevel(role.privilegeLevel)}</span>
                                    </div>
                                    <div class="meta-item">
                                        <i class="fas fa-clock"></i>
                                        <span>Max: ${role.maxDuration || '8'} hours</span>
                                    </div>
                                    ${role.requiresApproval ? `
                                        <div class="meta-item warning">
                                            <i class="fas fa-user-check"></i>
                                            <span>Requires Approval</span>
                                        </div>
                                    ` : ''}
                                    ${role.requiresMfa ? `
                                        <div class="meta-item">
                                            <i class="fas fa-key"></i>
                                            <span>Requires MFA</span>
                                        </div>
                                    ` : ''}
                                </div>

                                ${role.assignmentEnd ? `
                                    <div class="assignment-expires">
                                        <i class="fas fa-hourglass-end"></i>
                                        <span>Eligibility expires: ${new Date(role.assignmentEnd).toLocaleDateString()}</span>
                                    </div>
                                ` : ''}
                            </div>

                            <div class="role-card-footer">
                                <button class="btn btn-primary btn-block"
                                        onclick="app.pages.activations.showActivationForm('${role.roleId}', '${this.escapeHtml(role.displayName)}', '${role.privilegeLevel}')">
                                    <i class="fas fa-play-circle"></i> Activate Role
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Render active roles list
     * @param {Array} roles - Active roles
     * @returns {string} HTML
     */
    renderActiveRoles(roles) {
        if (!this.isConnected()) {
            return `<div class="empty-state"><i class="fas fa-plug"></i><p>Connect to view your active roles</p></div>`;
        }

        if (roles.length === 0) {
            return `<div class="empty-state"><i class="fas fa-check-circle"></i><p>You have no active role assignments</p></div>`;
        }

        return `
            <div class="card">
                <div class="card-header">
                    <h3>Currently Active Roles</h3>
                    <p class="card-subtitle">These roles are currently active and will automatically expire</p>
                </div>

                <div class="roles-grid">
                    ${roles.map(role => {
                        const timeRemaining = this.calculateTimeRemaining(role.endDateTime);
                        const isExpiringSoon = timeRemaining.hours < 1;

                        return `
                            <div class="role-card active-role ${isExpiringSoon ? 'expiring-soon' : ''}">
                                <div class="role-card-header">
                                    <div class="role-icon active">
                                        <i class="fas fa-check-circle"></i>
                                    </div>
                                    <div class="role-info">
                                        <h4>${this.escapeHtml(role.displayName)}</h4>
                                        <p class="role-description">${this.escapeHtml(role.description || 'No description')}</p>
                                    </div>
                                </div>

                                <div class="role-card-body">
                                    <div class="activation-timeline">
                                        <div class="timeline-item">
                                            <i class="fas fa-play-circle"></i>
                                            <div>
                                                <strong>Activated</strong>
                                                <span>${new Date(role.startDateTime).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div class="timeline-item ${isExpiringSoon ? 'warning' : ''}">
                                            <i class="fas fa-stop-circle"></i>
                                            <div>
                                                <strong>Expires ${isExpiringSoon ? '(Soon)' : ''}</strong>
                                                <span>${new Date(role.endDateTime).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="time-remaining ${isExpiringSoon ? 'urgent' : ''}">
                                        <i class="fas fa-hourglass-${isExpiringSoon ? 'end' : 'half'}"></i>
                                        <span>
                                            <strong>Time Remaining:</strong>
                                            ${this.formatTimeRemaining(timeRemaining)}
                                        </span>
                                    </div>

                                    ${role.justification ? `
                                        <div class="activation-justification">
                                            <strong>Justification:</strong>
                                            <p>${this.escapeHtml(role.justification)}</p>
                                        </div>
                                    ` : ''}

                                    ${role.ticketNumber ? `
                                        <div class="activation-ticket">
                                            <i class="fas fa-ticket-alt"></i>
                                            <span>Ticket: ${this.escapeHtml(role.ticketNumber)}</span>
                                        </div>
                                    ` : ''}
                                </div>

                                <div class="role-card-footer">
                                    <button class="btn btn-secondary btn-sm"
                                            onclick="app.pages.activations.extendActivation('${role.id}', '${this.escapeHtml(role.displayName)}')"
                                            ${role.canExtend ? '' : 'disabled'}
                                            title="${role.canExtend ? 'Extend activation' : 'Cannot extend further'}">
                                        <i class="fas fa-clock"></i> Extend
                                    </button>
                                    <button class="btn btn-danger btn-sm"
                                            onclick="app.pages.activations.deactivateRole('${role.id}', '${this.escapeHtml(role.displayName)}')">
                                        <i class="fas fa-stop-circle"></i> Deactivate
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Switch between tabs
     * @param {string} tabName - Tab name
     */
    switchTab(tabName) {
        this.currentTab = tabName;
        this.app.router.refreshCurrentPage();
    }

    /**
     * Show activation form
     * @param {string} roleId - Role ID
     * @param {string} roleName - Role display name
     */
    async showActivationForm(roleId, roleName, privilegeLevel = 'medium') {
        // Get role policy requirements
        const policyResult = await graphService.getRoleAssignmentDetails(roleId);

        if (!policyResult.success) {
            this.showToast(`Failed to load role policy: ${policyResult.error}`, 'error');
            return;
        }

        // Policy requirements are returned directly (not nested under .role)
        const policy = policyResult;

        const content = `
            <div class="modal-header">
                <h2 class="modal-title">
                    <i class="fas fa-play-circle"></i> Activate Role
                </h2>
                <button class="modal-close" onclick="app.closeModal()" title="Close" aria-label="Close dialog">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="modal-body modal-lg">
                <div class="activation-header">
                    <div class="role-badge ${this.getPrivilegeClass(privilegeLevel)}">
                        <i class="fas ${this.getPrivilegeIcon(privilegeLevel)}"></i>
                    </div>
                    <div>
                        <h3>${this.escapeHtml(roleName)}</h3>
                        <p class="text-muted">Activate this role for just-in-time access</p>
                    </div>
                </div>

                <form id="activation-form">
                    <!-- Duration -->
                    <div class="form-section">
                        <label class="form-label">
                            <strong>Activation Duration <span class="required">*</span></strong>
                            <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 0.5rem;">
                                <input type="number"
                                       name="duration"
                                       class="input"
                                       min="0.5"
                                       max="${policy.maxDuration || 8}"
                                       step="0.5"
                                       value="${policy.defaultDuration || 4}"
                                       required
                                       style="flex: 1;"
                                       aria-label="Activation duration in hours">
                                <span>hours</span>
                            </div>
                            <small class="form-hint">Maximum: ${policy.maxDuration || 8} hours</small>
                        </label>

                        <div class="duration-presets">
                            <button type="button" class="btn btn-sm btn-secondary" onclick="document.querySelector('[name=duration]').value = 1">1h</button>
                            <button type="button" class="btn btn-sm btn-secondary" onclick="document.querySelector('[name=duration]').value = 4">4h</button>
                            <button type="button" class="btn btn-sm btn-secondary" onclick="document.querySelector('[name=duration]').value = 8">8h</button>
                            ${policy.maxDuration > 8 ? `<button type="button" class="btn btn-sm btn-secondary" onclick="document.querySelector('[name=duration]').value = ${policy.maxDuration}">${policy.maxDuration}h</button>` : ''}
                        </div>
                    </div>

                    <!-- Justification -->
                    ${policy.requiresJustification !== false ? `
                        <div class="form-section">
                            <label class="form-label">
                                <strong>Business Justification ${policy.requiresJustification ? '<span class="required">*</span>' : ''}</strong>
                                <textarea name="justification"
                                          class="input"
                                          rows="4"
                                          placeholder="Explain why you need this role activated..."
                                          ${policy.requiresJustification ? 'required' : ''}
                                          aria-label="Business justification for activation"></textarea>
                                <small class="form-hint">Provide a clear business reason for activating this role</small>
                            </label>
                        </div>
                    ` : ''}

                    <!-- Ticket Number -->
                    ${policy.requiresTicket ? `
                        <div class="form-section">
                            <label class="form-label">
                                <strong>Ticket/Change Number <span class="required">*</span></strong>
                                <input type="text"
                                       name="ticketNumber"
                                       class="input"
                                       placeholder="e.g., CHG0001234, INC0005678"
                                       required
                                       aria-label="Ticket or change number">
                                <small class="form-hint">Enter your change management or incident ticket number</small>
                            </label>
                        </div>
                    ` : ''}

                    <!-- Requirements Notice -->
                    ${policy.requiresApproval || policy.requiresMFA ? `
                        <div class="requirements-notice">
                            <h4><i class="fas fa-info-circle"></i> Additional Requirements</h4>
                            <ul>
                                ${policy.requiresMFA ? '<li><i class="fas fa-key"></i> You will be prompted for Multi-Factor Authentication (MFA)</li>' : ''}
                                ${policy.requiresApproval ? `
                                    <li>
                                        <i class="fas fa-user-check"></i> This activation requires approval
                                        ${policy.approvers && policy.approvers.length > 0 ? `
                                            <ul class="approvers-list">
                                                ${policy.approvers.map(a => `<li>${this.escapeHtml(a.displayName || a.userPrincipalName || a)}</li>`).join('')}
                                            </ul>
                                        ` : ''}
                                    </li>
                                ` : ''}
                            </ul>
                        </div>
                    ` : ''}

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="app.closeModal()">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-play-circle"></i> ${policy.requiresApproval ? 'Request Activation' : 'Activate Now'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        this.showModal(content);

        // Handle form submission
        document.getElementById('activation-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleActivationSubmit(roleId, roleName, e.target);
        });
    }

    /**
     * Handle activation form submission
     * @param {string} roleId - Role ID
     * @param {string} roleName - Role name
     * @param {HTMLFormElement} form - Form element
     */
    async handleActivationSubmit(roleId, roleName, form) {
        const formData = new FormData(form);

        const activationRequest = {
            roleId: roleId,
            duration: parseFloat(formData.get('duration')),
            justification: formData.get('justification')?.trim() || null,
            ticketNumber: formData.get('ticketNumber')?.trim() || null
        };

        this.closeModal();
        this.showLoading('Activating role...');

        const result = await graphService.activateRole(activationRequest);

        this.hideLoading();

        if (result.success) {
            if (result.requiresApproval) {
                this.showToast(`Activation request submitted for "${roleName}". Waiting for approval.`, 'info');
            } else {
                this.showToast(`Role "${roleName}" activated successfully!`, 'success');
            }

            // Refresh the page
            await this.app.router.refreshCurrentPage();

            // Switch to active tab
            this.currentTab = 'active';
        } else {
            this.showToast(`Failed to activate role: ${result.error}`, 'error');
        }
    }

    /**
     * Deactivate role
     * @param {string} assignmentId - Assignment ID
     * @param {string} roleName - Role name
     */
    deactivateRole(assignmentId, roleName) {
        const confirmDialog = UIComponents.renderConfirmDialog({
            title: 'Deactivate Role',
            message: `Are you sure you want to deactivate "${roleName}"? You will lose access immediately and will need to reactivate if needed again.`,
            confirmLabel: 'Deactivate Role',
            confirmVariant: 'btn-danger',
            icon: 'fa-stop-circle',
            iconColor: 'warning',
            onConfirm: `app.pages.activations.confirmDeactivate('${assignmentId}', '${this.escapeHtml(roleName)}')`
        });

        this.showModal(confirmDialog);
    }

    /**
     * Confirm deactivation
     * @param {string} assignmentId - Assignment ID
     * @param {string} roleName - Role name
     */
    async confirmDeactivate(assignmentId, roleName) {
        this.closeModal();
        this.showLoading('Deactivating role...');

        const result = await graphService.deactivateRole(assignmentId);

        this.hideLoading();

        if (result.success) {
            this.showToast(`Role "${roleName}" deactivated successfully`, 'success');
            await this.app.router.refreshCurrentPage();
        } else {
            this.showToast(`Failed to deactivate role: ${result.error}`, 'error');
        }
    }

    /**
     * Extend activation
     * @param {string} assignmentId - Assignment ID
     * @param {string} roleName - Role name
     */
    async extendActivation(assignmentId, roleName) {
        this.showToast('Extension functionality coming soon', 'info');
    }

    /**
     * Calculate time remaining
     * @param {string} endDateTime - End date time
     * @returns {Object} Time remaining object
     */
    calculateTimeRemaining(endDateTime) {
        const end = new Date(endDateTime);
        const now = new Date();
        const diff = end - now;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return { hours, minutes, total: diff };
    }

    /**
     * Format time remaining
     * @param {Object} timeRemaining - Time remaining object
     * @returns {string} Formatted string
     */
    formatTimeRemaining(timeRemaining) {
        if (timeRemaining.total < 0) {
            return 'Expired';
        }

        if (timeRemaining.hours === 0) {
            return `${timeRemaining.minutes} minutes`;
        }

        if (timeRemaining.minutes === 0) {
            return `${timeRemaining.hours} hour${timeRemaining.hours > 1 ? 's' : ''}`;
        }

        return `${timeRemaining.hours}h ${timeRemaining.minutes}m`;
    }

    /**
     * Get privilege class
     * @param {string} level - Privilege level
     * @returns {string} CSS class
     */
    getPrivilegeClass(level) {
        const classes = {
            critical: 'privilege-critical',
            high: 'privilege-high',
            medium: 'privilege-medium',
            low: 'privilege-low'
        };
        return classes[level] || 'privilege-low';
    }

    /**
     * Get privilege icon
     * @param {string} level - Privilege level
     * @returns {string} Icon class
     */
    getPrivilegeIcon(level) {
        const icons = {
            critical: 'fa-skull-crossbones',
            high: 'fa-exclamation-triangle',
            medium: 'fa-shield-alt',
            low: 'fa-check-circle'
        };
        return icons[level] || 'fa-check-circle';
    }

    /**
     * Format privilege level
     * @param {string} level - Privilege level
     * @returns {string} Formatted level
     */
    formatPrivilegeLevel(level) {
        return level ? level.charAt(0).toUpperCase() + level.slice(1) : 'Low';
    }

    /**
     * Refresh page
     */
    async refreshPage() {
        await this.app.router.refreshCurrentPage();
    }
}
