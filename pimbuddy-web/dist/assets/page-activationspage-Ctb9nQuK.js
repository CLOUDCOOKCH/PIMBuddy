import{B as n}from"./core-rjX7nIO3.js";import{g as o}from"./services-DF6cB9Vv.js";import{U as r}from"./utils-B68CIlTQ.js";class m extends n{constructor(e){super(e),this.currentTab="eligible"}async render(e,i={}){let a=[],t=[];if(this.isConnected()){this.showLoading("Loading role assignments...");const[s,l]=await Promise.all([o.getMyEligibleRoles(),o.getMyActiveRoles()]);s.success?a=s.roles:this.showToast(`Failed to load eligible roles: ${s.error}`,"error"),l.success?t=l.roles:this.showToast(`Failed to load active roles: ${l.error}`,"error"),this.hideLoading()}e.innerHTML=`
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
                <button class="tab-btn ${this.currentTab==="eligible"?"active":""}"
                        onclick="app.pages.activations.switchTab('eligible')">
                    <i class="fas fa-unlock"></i> Eligible Roles (${a.length})
                </button>
                <button class="tab-btn ${this.currentTab==="active"?"active":""}"
                        onclick="app.pages.activations.switchTab('active')">
                    <i class="fas fa-check-circle"></i> Active Roles (${t.length})
                </button>
            </div>

            <!-- Eligible Roles Tab -->
            <div id="tab-eligible" class="tab-content ${this.currentTab==="eligible"?"active":""}"
                 style="display: ${this.currentTab==="eligible"?"block":"none"};">
                ${this.renderEligibleRoles(a)}
            </div>

            <!-- Active Roles Tab -->
            <div id="tab-active" class="tab-content ${this.currentTab==="active"?"active":""}"
                 style="display: ${this.currentTab==="active"?"block":"none"};">
                ${this.renderActiveRoles(t)}
            </div>
        `}renderEligibleRoles(e){return this.isConnected()?e.length===0?'<div class="empty-state"><i class="fas fa-inbox"></i><p>You have no eligible role assignments</p></div>':`
            <div class="card">
                <div class="card-header">
                    <h3>Roles You Can Activate</h3>
                    <p class="card-subtitle">Click "Activate" to request time-limited access to a role</p>
                </div>

                <div class="roles-grid">
                    ${e.map(i=>`
                        <div class="role-card eligible-role">
                            <div class="role-card-header">
                                <div class="role-icon ${this.getPrivilegeClass(i.privilegeLevel)}">
                                    <i class="fas ${this.getPrivilegeIcon(i.privilegeLevel)}"></i>
                                </div>
                                <div class="role-info">
                                    <h4>${this.escapeHtml(i.displayName)}</h4>
                                    <p class="role-description">${this.escapeHtml(i.description||"No description")}</p>
                                </div>
                            </div>

                            <div class="role-card-body">
                                <div class="role-meta">
                                    <div class="meta-item">
                                        <i class="fas fa-shield-alt"></i>
                                        <span>${this.formatPrivilegeLevel(i.privilegeLevel)}</span>
                                    </div>
                                    <div class="meta-item">
                                        <i class="fas fa-clock"></i>
                                        <span>Max: ${i.maxDuration||"8"} hours</span>
                                    </div>
                                    ${i.requiresApproval?`
                                        <div class="meta-item warning">
                                            <i class="fas fa-user-check"></i>
                                            <span>Requires Approval</span>
                                        </div>
                                    `:""}
                                    ${i.requiresMfa?`
                                        <div class="meta-item">
                                            <i class="fas fa-key"></i>
                                            <span>Requires MFA</span>
                                        </div>
                                    `:""}
                                </div>

                                ${i.assignmentEnd?`
                                    <div class="assignment-expires">
                                        <i class="fas fa-hourglass-end"></i>
                                        <span>Eligibility expires: ${new Date(i.assignmentEnd).toLocaleDateString()}</span>
                                    </div>
                                `:""}
                            </div>

                            <div class="role-card-footer">
                                <button class="btn btn-primary btn-block"
                                        onclick="app.pages.activations.showActivationForm('${i.roleId}', '${this.escapeHtml(i.displayName)}', '${i.privilegeLevel}')">
                                    <i class="fas fa-play-circle"></i> Activate Role
                                </button>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `:'<div class="empty-state"><i class="fas fa-plug"></i><p>Connect to view your eligible roles</p></div>'}renderActiveRoles(e){return this.isConnected()?e.length===0?'<div class="empty-state"><i class="fas fa-check-circle"></i><p>You have no active role assignments</p></div>':`
            <div class="card">
                <div class="card-header">
                    <h3>Currently Active Roles</h3>
                    <p class="card-subtitle">These roles are currently active and will automatically expire</p>
                </div>

                <div class="roles-grid">
                    ${e.map(i=>{const a=this.calculateTimeRemaining(i.endDateTime),t=a.hours<1;return`
                            <div class="role-card active-role ${t?"expiring-soon":""}">
                                <div class="role-card-header">
                                    <div class="role-icon active">
                                        <i class="fas fa-check-circle"></i>
                                    </div>
                                    <div class="role-info">
                                        <h4>${this.escapeHtml(i.displayName)}</h4>
                                        <p class="role-description">${this.escapeHtml(i.description||"No description")}</p>
                                    </div>
                                </div>

                                <div class="role-card-body">
                                    <div class="activation-timeline">
                                        <div class="timeline-item">
                                            <i class="fas fa-play-circle"></i>
                                            <div>
                                                <strong>Activated</strong>
                                                <span>${new Date(i.startDateTime).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div class="timeline-item ${t?"warning":""}">
                                            <i class="fas fa-stop-circle"></i>
                                            <div>
                                                <strong>Expires ${t?"(Soon)":""}</strong>
                                                <span>${new Date(i.endDateTime).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="time-remaining ${t?"urgent":""}">
                                        <i class="fas fa-hourglass-${t?"end":"half"}"></i>
                                        <span>
                                            <strong>Time Remaining:</strong>
                                            ${this.formatTimeRemaining(a)}
                                        </span>
                                    </div>

                                    ${i.justification?`
                                        <div class="activation-justification">
                                            <strong>Justification:</strong>
                                            <p>${this.escapeHtml(i.justification)}</p>
                                        </div>
                                    `:""}

                                    ${i.ticketNumber?`
                                        <div class="activation-ticket">
                                            <i class="fas fa-ticket-alt"></i>
                                            <span>Ticket: ${this.escapeHtml(i.ticketNumber)}</span>
                                        </div>
                                    `:""}
                                </div>

                                <div class="role-card-footer">
                                    <button class="btn btn-secondary btn-sm"
                                            onclick="app.pages.activations.extendActivation('${i.id}', '${this.escapeHtml(i.displayName)}')"
                                            ${i.canExtend?"":"disabled"}
                                            title="${i.canExtend?"Extend activation":"Cannot extend further"}">
                                        <i class="fas fa-clock"></i> Extend
                                    </button>
                                    <button class="btn btn-danger btn-sm"
                                            onclick="app.pages.activations.deactivateRole('${i.id}', '${this.escapeHtml(i.displayName)}')">
                                        <i class="fas fa-stop-circle"></i> Deactivate
                                    </button>
                                </div>
                            </div>
                        `}).join("")}
                </div>
            </div>
        `:'<div class="empty-state"><i class="fas fa-plug"></i><p>Connect to view your active roles</p></div>'}switchTab(e){this.currentTab=e,this.app.router.refreshCurrentPage()}async showActivationForm(e,i,a="medium"){const t=await o.getRoleAssignmentDetails(e);if(!t.success){this.showToast(`Failed to load role policy: ${t.error}`,"error");return}const s=t,l=`
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
                    <div class="role-badge ${this.getPrivilegeClass(a)}">
                        <i class="fas ${this.getPrivilegeIcon(a)}"></i>
                    </div>
                    <div>
                        <h3>${this.escapeHtml(i)}</h3>
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
                                       max="${s.maxDuration||8}"
                                       step="0.5"
                                       value="${s.defaultDuration||4}"
                                       required
                                       style="flex: 1;"
                                       aria-label="Activation duration in hours">
                                <span>hours</span>
                            </div>
                            <small class="form-hint">Maximum: ${s.maxDuration||8} hours</small>
                        </label>

                        <div class="duration-presets">
                            <button type="button" class="btn btn-sm btn-secondary" onclick="document.querySelector('[name=duration]').value = 1">1h</button>
                            <button type="button" class="btn btn-sm btn-secondary" onclick="document.querySelector('[name=duration]').value = 4">4h</button>
                            <button type="button" class="btn btn-sm btn-secondary" onclick="document.querySelector('[name=duration]').value = 8">8h</button>
                            ${s.maxDuration>8?`<button type="button" class="btn btn-sm btn-secondary" onclick="document.querySelector('[name=duration]').value = ${s.maxDuration}">${s.maxDuration}h</button>`:""}
                        </div>
                    </div>

                    <!-- Justification -->
                    ${s.requiresJustification!==!1?`
                        <div class="form-section">
                            <label class="form-label">
                                <strong>Business Justification ${s.requiresJustification?'<span class="required">*</span>':""}</strong>
                                <textarea name="justification"
                                          class="input"
                                          rows="4"
                                          placeholder="Explain why you need this role activated..."
                                          ${s.requiresJustification?"required":""}
                                          aria-label="Business justification for activation"></textarea>
                                <small class="form-hint">Provide a clear business reason for activating this role</small>
                            </label>
                        </div>
                    `:""}

                    <!-- Ticket Number -->
                    ${s.requiresTicket?`
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
                    `:""}

                    <!-- Requirements Notice -->
                    ${s.requiresApproval||s.requiresMFA?`
                        <div class="requirements-notice">
                            <h4><i class="fas fa-info-circle"></i> Additional Requirements</h4>
                            <ul>
                                ${s.requiresMFA?'<li><i class="fas fa-key"></i> You will be prompted for Multi-Factor Authentication (MFA)</li>':""}
                                ${s.requiresApproval?`
                                    <li>
                                        <i class="fas fa-user-check"></i> This activation requires approval
                                        ${s.approvers&&s.approvers.length>0?`
                                            <ul class="approvers-list">
                                                ${s.approvers.map(c=>`<li>${this.escapeHtml(c.displayName||c.userPrincipalName||c)}</li>`).join("")}
                                            </ul>
                                        `:""}
                                    </li>
                                `:""}
                            </ul>
                        </div>
                    `:""}

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="app.closeModal()">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-play-circle"></i> ${s.requiresApproval?"Request Activation":"Activate Now"}
                        </button>
                    </div>
                </form>
            </div>
        `;this.showModal(l),document.getElementById("activation-form").addEventListener("submit",async c=>{c.preventDefault(),await this.handleActivationSubmit(e,i,c.target)})}async handleActivationSubmit(e,i,a){const t=new FormData(a),s={roleId:e,duration:parseFloat(t.get("duration")),justification:t.get("justification")?.trim()||null,ticketNumber:t.get("ticketNumber")?.trim()||null};this.closeModal(),this.showLoading("Activating role...");const l=await o.activateRole(s);this.hideLoading(),l.success?(l.requiresApproval?this.showToast(`Activation request submitted for "${i}". Waiting for approval.`,"info"):this.showToast(`Role "${i}" activated successfully!`,"success"),await this.app.router.refreshCurrentPage(),this.currentTab="active"):this.showToast(`Failed to activate role: ${l.error}`,"error")}deactivateRole(e,i){const a=r.renderConfirmDialog({title:"Deactivate Role",message:`Are you sure you want to deactivate "${i}"? You will lose access immediately and will need to reactivate if needed again.`,confirmLabel:"Deactivate Role",confirmVariant:"btn-danger",icon:"fa-stop-circle",iconColor:"warning",onConfirm:`app.pages.activations.confirmDeactivate('${e}', '${this.escapeHtml(i)}')`});this.showModal(a)}async confirmDeactivate(e,i){this.closeModal(),this.showLoading("Deactivating role...");const a=await o.deactivateRole(e);this.hideLoading(),a.success?(this.showToast(`Role "${i}" deactivated successfully`,"success"),await this.app.router.refreshCurrentPage()):this.showToast(`Failed to deactivate role: ${a.error}`,"error")}async extendActivation(e,i){this.showToast("Extension functionality coming soon","info")}calculateTimeRemaining(e){const t=new Date(e)-new Date,s=Math.floor(t/(1e3*60*60)),l=Math.floor(t%(1e3*60*60)/(1e3*60));return{hours:s,minutes:l,total:t}}formatTimeRemaining(e){return e.total<0?"Expired":e.hours===0?`${e.minutes} minutes`:e.minutes===0?`${e.hours} hour${e.hours>1?"s":""}`:`${e.hours}h ${e.minutes}m`}getPrivilegeClass(e){return{critical:"privilege-critical",high:"privilege-high",medium:"privilege-medium",low:"privilege-low"}[e]||"privilege-low"}getPrivilegeIcon(e){return{critical:"fa-skull-crossbones",high:"fa-exclamation-triangle",medium:"fa-shield-alt",low:"fa-check-circle"}[e]||"fa-check-circle"}formatPrivilegeLevel(e){return e?e.charAt(0).toUpperCase()+e.slice(1):"Low"}async refreshPage(){await this.app.router.refreshCurrentPage()}}export{m as A};
//# sourceMappingURL=page-activationspage-Ctb9nQuK.js.map
