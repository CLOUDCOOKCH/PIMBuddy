import{B as n}from"./core-rjX7nIO3.js";import{t as i}from"./services-DF6cB9Vv.js";class o extends n{constructor(e){super(e)}async render(e,s={}){const a=i.getAllTemplates();e.innerHTML=`
            <h1 class="page-header">Policy Templates</h1>
            <p class="page-description">Apply predefined policy configurations to your PIM groups. Templates help ensure consistent security settings across your organization.</p>

            <div class="templates-grid">
                ${Object.values(a).map(t=>`
                    <div class="card template-card">
                        <div class="template-icon ${t.color||"primary"}">
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
                                <span class="setting-value ${t.settings.activation.requireMfa?"enabled":"disabled"}">${t.settings.activation.requireMfa?"Required":"Optional"}</span>
                            </div>
                            <div class="template-setting">
                                <span class="setting-label">Approval:</span>
                                <span class="setting-value ${t.settings.activation.requireApproval?"enabled":"disabled"}">${t.settings.activation.requireApproval?"Required":"Optional"}</span>
                            </div>
                            <div class="template-setting">
                                <span class="setting-label">Justification:</span>
                                <span class="setting-value ${t.settings.activation.requireJustification?"enabled":"disabled"}">${t.settings.activation.requireJustification?"Required":"Optional"}</span>
                            </div>
                        </div>
                        <div class="template-actions">
                            <button class="btn btn-secondary btn-sm" onclick="app.pages.templates.viewDetails('${t.id}')" ${this.isConnected()?"":"disabled"} aria-label="View template details for ${this.escapeHtml(t.name)}">
                                <i class="fas fa-eye"></i> Details
                            </button>
                            <button class="btn btn-primary btn-sm" onclick="app.pages.templates.applyTemplate('${t.id}')" ${this.isConnected()?"":"disabled"} aria-label="Apply template ${this.escapeHtml(t.name)}">
                                <i class="fas fa-play"></i> Apply
                            </button>
                        </div>
                    </div>
                `).join("")}
            </div>
        `}viewDetails(e){const s=i.getTemplate(e);if(!s){this.showToast("Template not found","error");return}const a=s.settings,t=`
            <h2><i class="fas ${s.icon}"></i> ${this.escapeHtml(s.name)}</h2>
            <p>${this.escapeHtml(s.description)}</p>

            <div class="template-detail-sections">
                <div class="detail-section">
                    <h3>Activation Settings</h3>
                    <table class="settings-table">
                        <tr><td>Maximum Duration</td><td>${a.activation.maximumDurationHours} hours</td></tr>
                        <tr><td>Require MFA</td><td>${a.activation.requireMfa?'<span class="badge success">Yes</span>':'<span class="badge">No</span>'}</td></tr>
                        <tr><td>Require Justification</td><td>${a.activation.requireJustification?'<span class="badge success">Yes</span>':'<span class="badge">No</span>'}</td></tr>
                        <tr><td>Require Ticket Info</td><td>${a.activation.requireTicketInfo?'<span class="badge success">Yes</span>':'<span class="badge">No</span>'}</td></tr>
                        <tr><td>Require Approval</td><td>${a.activation.requireApproval?'<span class="badge warning">Yes</span>':'<span class="badge">No</span>'}</td></tr>
                    </table>
                </div>

                <div class="detail-section">
                    <h3>Eligible Assignment Settings</h3>
                    <table class="settings-table">
                        <tr><td>Allow Permanent</td><td>${a.eligibleAssignment.allowPermanent?'<span class="badge">Yes</span>':'<span class="badge warning">No</span>'}</td></tr>
                        <tr><td>Maximum Duration</td><td>${a.eligibleAssignment.maximumDurationDays} days</td></tr>
                    </table>
                </div>

                <div class="detail-section">
                    <h3>Active Assignment Settings</h3>
                    <table class="settings-table">
                        <tr><td>Allow Permanent</td><td>${a.activeAssignment.allowPermanent?'<span class="badge">Yes</span>':'<span class="badge warning">No</span>'}</td></tr>
                        <tr><td>Maximum Duration</td><td>${a.activeAssignment.maximumDurationDays} days</td></tr>
                    </table>
                </div>
            </div>

            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Close</button>
                <button type="button" class="btn btn-primary" onclick="app.closeModal(); app.pages.templates.applyTemplate('${e}')">
                    <i class="fas fa-play"></i> Apply Template
                </button>
            </div>
        `;this.showModal(t)}async applyTemplate(e){const s=i.getTemplate(e);if(!s){this.showToast("Template not found","error");return}this.showToast(`Template application for "${s.name}" - Full implementation pending`,"info")}async refreshPage(){await this.app.router.refreshCurrentPage()}}export{o as T};
//# sourceMappingURL=page-templatespage-C40ZrFiw.js.map
