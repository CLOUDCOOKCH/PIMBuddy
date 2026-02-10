/**
 * Templates Page
 * Policy templates for consistent PIM configuration
 */

import { BasePage } from '../core/PageRouter.js';
import { templateService } from '../services/templateService.js';

export class TemplatesPage extends BasePage {
    constructor(app) {
        super(app);
    }

    /**
     * Render Templates page
     * @param {HTMLElement} container - Page container
     * @param {Object} params - Optional parameters
     */
    async render(container, params = {}) {
        const templates = templateService.getAllTemplates();

        container.innerHTML = `
            <h1 class="page-header">Policy Templates</h1>
            <p class="page-description">Apply predefined policy configurations to your PIM groups. Templates help ensure consistent security settings across your organization.</p>

            <div class="templates-grid">
                ${Object.values(templates).map(t => `
                    <div class="card template-card">
                        <div class="template-icon ${t.color || 'primary'}">
                            <i class="fas ${t.icon}"></i>
                        </div>
                        <h3>${this.escapeHtml(t.name)}</h3>
                        <p class="template-description">${this.escapeHtml(t.description)}</p>
                        <div class="template-settings">
                            <div class="template-setting">
                                <span class="setting-label">Max Duration:</span>
                                <span class="setting-value">${t.settings.activation.maximumDurationHours}h</span>
                            </div>
                            <div class="template-setting">
                                <span class="setting-label">MFA:</span>
                                <span class="setting-value ${t.settings.activation.requireMfa ? 'enabled' : 'disabled'}">${t.settings.activation.requireMfa ? 'Required' : 'Optional'}</span>
                            </div>
                            <div class="template-setting">
                                <span class="setting-label">Approval:</span>
                                <span class="setting-value ${t.settings.activation.requireApproval ? 'enabled' : 'disabled'}">${t.settings.activation.requireApproval ? 'Required' : 'Optional'}</span>
                            </div>
                            <div class="template-setting">
                                <span class="setting-label">Justification:</span>
                                <span class="setting-value ${t.settings.activation.requireJustification ? 'enabled' : 'disabled'}">${t.settings.activation.requireJustification ? 'Required' : 'Optional'}</span>
                            </div>
                        </div>
                        <div class="template-actions">
                            <button class="btn btn-secondary btn-sm" onclick="app.pages.templates.viewDetails('${t.id}')" ${!this.isConnected() ? 'disabled' : ''} aria-label="View template details for ${this.escapeHtml(t.name)}">
                                <i class="fas fa-eye"></i> Details
                            </button>
                            <button class="btn btn-primary btn-sm" onclick="app.pages.templates.applyTemplate('${t.id}')" ${!this.isConnected() ? 'disabled' : ''} aria-label="Apply template ${this.escapeHtml(t.name)}">
                                <i class="fas fa-play"></i> Apply
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * View template details
     * @param {string} templateId - Template ID
     */
    viewDetails(templateId) {
        const template = templateService.getTemplate(templateId);
        if (!template) {
            this.showToast('Template not found', 'error');
            return;
        }

        const settings = template.settings;
        const html = `
            <h2><i class="fas ${template.icon}"></i> ${this.escapeHtml(template.name)}</h2>
            <p>${this.escapeHtml(template.description)}</p>

            <div class="template-detail-sections">
                <div class="detail-section">
                    <h3>Activation Settings</h3>
                    <table class="settings-table">
                        <tr><td>Maximum Duration</td><td>${settings.activation.maximumDurationHours} hours</td></tr>
                        <tr><td>Require MFA</td><td>${settings.activation.requireMfa ? '<span class="badge success">Yes</span>' : '<span class="badge">No</span>'}</td></tr>
                        <tr><td>Require Justification</td><td>${settings.activation.requireJustification ? '<span class="badge success">Yes</span>' : '<span class="badge">No</span>'}</td></tr>
                        <tr><td>Require Ticket Info</td><td>${settings.activation.requireTicketInfo ? '<span class="badge success">Yes</span>' : '<span class="badge">No</span>'}</td></tr>
                        <tr><td>Require Approval</td><td>${settings.activation.requireApproval ? '<span class="badge warning">Yes</span>' : '<span class="badge">No</span>'}</td></tr>
                    </table>
                </div>

                <div class="detail-section">
                    <h3>Eligible Assignment Settings</h3>
                    <table class="settings-table">
                        <tr><td>Allow Permanent</td><td>${settings.eligibleAssignment.allowPermanent ? '<span class="badge">Yes</span>' : '<span class="badge warning">No</span>'}</td></tr>
                        <tr><td>Maximum Duration</td><td>${settings.eligibleAssignment.maximumDurationDays} days</td></tr>
                    </table>
                </div>

                <div class="detail-section">
                    <h3>Active Assignment Settings</h3>
                    <table class="settings-table">
                        <tr><td>Allow Permanent</td><td>${settings.activeAssignment.allowPermanent ? '<span class="badge">Yes</span>' : '<span class="badge warning">No</span>'}</td></tr>
                        <tr><td>Maximum Duration</td><td>${settings.activeAssignment.maximumDurationDays} days</td></tr>
                    </table>
                </div>
            </div>

            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Close</button>
                <button type="button" class="btn btn-primary" onclick="app.closeModal(); app.pages.templates.applyTemplate('${templateId}')">
                    <i class="fas fa-play"></i> Apply Template
                </button>
            </div>
        `;

        this.showModal(html);
    }

    /**
     * Apply template (simplified - shows info message)
     * @param {string} templateId - Template ID
     */
    async applyTemplate(templateId) {
        const template = templateService.getTemplate(templateId);
        if (!template) {
            this.showToast('Template not found', 'error');
            return;
        }

        // For now, show a message that template application is a complex feature
        // In a full implementation, this would show a group selector modal and apply the policy
        this.showToast(`Template application for "${template.name}" - Full implementation pending`, 'info');

        // TODO: Implement full template application with group selection
        // See app.js lines 3332-3450 for reference implementation
    }

    /**
     * Refresh page data
     */
    async refreshPage() {
        await this.app.router.refreshCurrentPage();
    }
}
