import{B as A,C as u}from"./core-rjX7nIO3.js";import{g as r}from"./services-DF6cB9Vv.js";class D extends A{constructor(i){super(i),this.paginator=i.paginators.roles,this.roleSortOrder="privilege-desc",this.filters={search:"",privilege:"all",type:"all"}}async render(i,s={}){let e=[];if(this.isConnected()){if(this.showLoading("Loading roles..."),e=this.getCached(u.ROLES.key),!e){const a=await r.getRoleDefinitions();a.success?(e=a.roles,this.setCached(u.ROLES.key,e)):this.showToast(`Failed to load roles: ${a.error}`,"error")}this.hideLoading()}e=e||[],e=this.sortRolesByPrivilege(e,this.roleSortOrder),this.paginator.updateItems(e);const l=this.paginator.getCurrentPageItems(),t=a=>{const o={critical:{class:"badge-critical",icon:"fa-skull-crossbones",label:"Critical"},high:{class:"badge-high",icon:"fa-exclamation-triangle",label:"High"},medium:{class:"badge-medium",icon:"fa-shield-alt",label:"Medium"},low:{class:"badge-low",icon:"fa-check-circle",label:"Low"}},n=o[a]||o.low;return`<span class="badge privilege-badge ${n.class}"><i class="fas ${n.icon}"></i> ${n.label}</span>`};i.innerHTML=`
            <div class="page-header-row">
                <h1 class="page-header">Entra ID Roles</h1>
            </div>

            <div class="toolbar">
                <input type="text" id="role-search" class="input" placeholder="Search roles..."
                       value="${this.filters.search}"
                       oninput="app.pages.roles.updateFilter('search', this.value)">

                <select id="privilege-filter" class="input input-select"
                        onchange="app.pages.roles.updateFilter('privilege', this.value)">
                    <option value="all" ${this.filters.privilege==="all"?"selected":""}>All Privileges</option>
                    <option value="critical" ${this.filters.privilege==="critical"?"selected":""}>Critical Only</option>
                    <option value="high" ${this.filters.privilege==="high"?"selected":""}>High Only</option>
                    <option value="medium" ${this.filters.privilege==="medium"?"selected":""}>Medium Only</option>
                    <option value="low" ${this.filters.privilege==="low"?"selected":""}>Low Only</option>
                </select>

                <select id="type-filter" class="input input-select"
                        onchange="app.pages.roles.updateFilter('type', this.value)">
                    <option value="all" ${this.filters.type==="all"?"selected":""}>All Types</option>
                    <option value="builtin" ${this.filters.type==="builtin"?"selected":""}>Built-in Only</option>
                    <option value="custom" ${this.filters.type==="custom"?"selected":""}>Custom Only</option>
                </select>

                <select id="role-sort" class="input input-select" onchange="app.pages.roles.sortRoles(this.value)">
                    <option value="privilege-desc" ${this.roleSortOrder==="privilege-desc"?"selected":""}>Privilege: High to Low</option>
                    <option value="privilege-asc" ${this.roleSortOrder==="privilege-asc"?"selected":""}>Privilege: Low to High</option>
                    <option value="name-asc" ${this.roleSortOrder==="name-asc"?"selected":""}>Name: A to Z</option>
                    <option value="name-desc" ${this.roleSortOrder==="name-desc"?"selected":""}>Name: Z to A</option>
                </select>

                ${this.filters.search||this.filters.privilege!=="all"||this.filters.type!=="all"?`
                    <button class="btn btn-secondary" onclick="app.pages.roles.clearFilters()" title="Clear all filters">
                        <i class="fas fa-times"></i> Clear Filters
                    </button>
                `:""}

                <button class="btn btn-secondary" onclick="app.showExportMenu('roles')" ${!this.isConnected()||e.length===0?"disabled":""}>
                    <i class="fas fa-file-export"></i> Export
                </button>
                <button class="btn btn-secondary" onclick="app.pages.roles.refreshPage()" ${this.isConnected()?"":"disabled"}>
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
                        ${l.length>0?l.map(a=>`
                            <tr data-id="${a.id}" data-privilege="${a.privilegeLevel}">
                                <td><strong>${this.escapeHtml(a.displayName)}</strong></td>
                                <td class="description-cell">${this.escapeHtml((a.description||"").substring(0,80))}${(a.description||"").length>80?"...":""}</td>
                                <td>${t(a.privilegeLevel)}</td>
                                <td>${a.isBuiltIn?'<span class="badge">Built-in</span>':'<span class="badge badge-secondary">Custom</span>'}</td>
                                <td>
                                    <button class="icon-btn" onclick="app.pages.roles.assignGroupToRole('${a.id}', '${this.escapeHtml(a.displayName)}')" title="Assign Group" aria-label="Assign group to ${this.escapeHtml(a.displayName)}">
                                        <i class="fas fa-user-plus" aria-hidden="true"></i>
                                    </button>
                                    <button class="icon-btn" onclick="app.pages.roles.configureRolePolicy('${a.id}')" title="Configure Policy" aria-label="Configure policy for ${this.escapeHtml(a.displayName)}">
                                        <i class="fas fa-cog" aria-hidden="true"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join(""):`
                            <tr>
                                <td colspan="5" class="empty-state">
                                    ${this.isConnected()?"No roles found":"Connect to view roles"}
                                </td>
                            </tr>
                        `}
                    </tbody>
                </table>

                ${this.paginator.renderControls("app.pages.roles.handlePageChange")}
            </div>

            <div class="privilege-legend">
                <span class="legend-title">Privilege Levels:</span>
                <span class="badge privilege-badge badge-critical"><i class="fas fa-skull-crossbones"></i> Critical</span>
                <span class="badge privilege-badge badge-high"><i class="fas fa-exclamation-triangle"></i> High</span>
                <span class="badge privilege-badge badge-medium"><i class="fas fa-shield-alt"></i> Medium</span>
                <span class="badge privilege-badge badge-low"><i class="fas fa-check-circle"></i> Low</span>
            </div>
        `}sortRolesByPrivilege(i,s){const e={critical:0,high:1,medium:2,low:3};return[...i].sort((l,t)=>s==="privilege-desc"?e[l.privilegeLevel]-e[t.privilegeLevel]:s==="privilege-asc"?e[t.privilegeLevel]-e[l.privilegeLevel]:s==="name-asc"?l.displayName.localeCompare(t.displayName):s==="name-desc"?t.displayName.localeCompare(l.displayName):0)}sortRoles(i){i==="privilege"?i=this.roleSortOrder==="privilege-desc"?"privilege-asc":"privilege-desc":i==="name"&&(i=this.roleSortOrder==="name-asc"?"name-desc":"name-asc"),this.roleSortOrder=i,this.app.router.refreshCurrentPage()}updateFilter(i,s){this.filters[i]=s,this.applyFilters()}applyFilters(){document.querySelectorAll("#roles-table tbody tr").forEach(s=>{const e=s.textContent.toLowerCase(),l=s.dataset.privilege,t=s.querySelector(".badge:not(.privilege-badge)")?.textContent.trim()==="Built-in",a=!this.filters.search||e.includes(this.filters.search.toLowerCase()),o=this.filters.privilege==="all"||l===this.filters.privilege,n=this.filters.type==="all"||this.filters.type==="builtin"&&t||this.filters.type==="custom"&&!t;s.style.display=a&&o&&n?"":"none"}),this.updateFilterCount()}updateFilterCount(){const i=document.querySelectorAll("#roles-table tbody tr"),s=Array.from(i).filter(l=>l.style.display!=="none").length,e=i.length;if(this.filters.search||this.filters.privilege!=="all"||this.filters.type!=="all"){const l=document.querySelector(".page-header");l&&(l.innerHTML=`Entra ID Roles <span class="badge badge-secondary">${s} of ${e}</span>`)}}clearFilters(){this.filters={search:"",privilege:"all",type:"all"},this.app.router.refreshCurrentPage()}handlePageChange(i){this.paginator.goToPage(i),this.app.router.refreshCurrentPage()}handlePageSizeChange(i){this.paginator.setPageSize(i),this.app.router.refreshCurrentPage()}async refreshPage(){this.app.cacheManager.invalidate(u.ROLES.key),await this.app.router.refreshCurrentPage()}async configureRolePolicy(i){const e=(this.getCached(u.ROLES.key)||[]).find(o=>o.id===i);if(!e){this.showToast("Role not found","error");return}this.showLoading("Loading policy settings...");const l=await r.getRolePolicy(i);if(this.hideLoading(),!l.success){this.showToast(`Failed to load policy: ${l.error}`,"error");return}const t=l.policy||{},a=`
            <div class="modal-header">
                <h2 class="modal-title">
                    <i class="fas fa-shield-alt"></i> Configure Policy: ${this.escapeHtml(e.displayName)}
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
                                <input type="checkbox" name="requireMfa" ${t.requireMfa?"checked":""}>
                                <strong>Require Multi-Factor Authentication (MFA)</strong>
                                <small class="form-hint">Users must complete MFA challenge to activate</small>
                            </label>

                            <label class="form-label">
                                <input type="checkbox" name="requireApproval" ${t.requireApproval?"checked":""}
                                       onchange="document.getElementById('approvers-section').style.display = this.checked ? 'block' : 'none'">
                                <strong>Require Approval</strong>
                                <small class="form-hint">Activation request must be approved by designated approvers</small>
                            </label>

                            <div id="approvers-section" style="display: ${t.requireApproval?"block":"none"}; margin-left: 2rem;">
                                <label class="form-label">
                                    Approvers (comma-separated emails)
                                    <textarea name="approvers" class="input" rows="2"
                                              placeholder="admin1@company.com, admin2@company.com">${t.approvers?.join(", ")||""}</textarea>
                                    <small class="form-hint">Leave empty to use default approvers</small>
                                </label>
                            </div>

                            <label class="form-label">
                                <input type="checkbox" name="requireJustification" ${t.requireJustification?"checked":""}>
                                <strong>Require Justification</strong>
                                <small class="form-hint">Users must provide business justification for activation</small>
                            </label>

                            <label class="form-label">
                                <input type="checkbox" name="requireTicket" ${t.requireTicket?"checked":""}>
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
                                           value="${t.maximumDurationHours||8}" style="flex: 1;">
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
                                       value="${t.defaultDurationHours||4}">
                                <small class="form-hint">Pre-filled duration when activating</small>
                            </label>
                        </div>
                    </div>

                    <div id="tab-assignment" class="tab-content" style="display: none;">
                        <h3><i class="fas fa-user-plus"></i> Assignment Settings</h3>
                        <p class="form-hint">Controls how users can be assigned as eligible for this role</p>

                        <div class="form-section">
                            <label class="form-label">
                                <input type="checkbox" name="allowPermanentEligible" ${t.allowPermanentEligible!==!1?"checked":""}>
                                <strong>Allow Permanent Eligible Assignments</strong>
                                <small class="form-hint">Administrators can assign users as permanently eligible</small>
                            </label>

                            <label class="form-label">
                                <input type="checkbox" name="requireJustificationOnAssignment" ${t.requireJustificationOnAssignment?"checked":""}>
                                <strong>Require Justification for Assignment</strong>
                                <small class="form-hint">Administrators must justify when making users eligible</small>
                            </label>

                            <label class="form-label">
                                Maximum Eligible Assignment Duration (days)
                                <input type="number" name="maxEligibleDurationDays" class="input" min="1" max="365"
                                       value="${t.maxEligibleDurationDays||365}">
                                <small class="form-hint">Maximum time-bound eligible assignment (1-365 days, 0 = no limit)</small>
                            </label>
                        </div>

                        <div class="form-section">
                            <h4>Active Assignment Settings</h4>
                            <label class="form-label">
                                <input type="checkbox" name="allowPermanentActive" ${t.allowPermanentActive?"checked":""}>
                                <strong>Allow Permanent Active Assignments</strong>
                                <small class="form-hint warning-text">⚠️ Not recommended for PIM - bypasses activation requirements</small>
                            </label>

                            <label class="form-label">
                                Maximum Active Assignment Duration (days)
                                <input type="number" name="maxActiveDurationDays" class="input" min="1" max="365"
                                       value="${t.maxActiveDurationDays||180}">
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
                                <input type="checkbox" name="notifyOnActivation" ${t.notifyOnActivation!==!1?"checked":""}>
                                <strong>Notify on Role Activation</strong>
                                <small class="form-hint">Send notification when role is activated</small>
                            </label>

                            <label class="form-label">
                                <input type="checkbox" name="notifyOnExpiration" ${t.notifyOnExpiration!==!1?"checked":""}>
                                <strong>Notify Before Expiration</strong>
                                <small class="form-hint">Send reminder before activation expires</small>
                            </label>

                            <label class="form-label">
                                Expiration Warning (hours before)
                                <input type="number" name="expirationWarningHours" class="input" min="0.5" max="24" step="0.5"
                                       value="${t.expirationWarningHours||1}">
                                <small class="form-hint">How early to send expiration warning</small>
                            </label>
                        </div>

                        <div class="form-section">
                            <h4>Assignment Notifications</h4>
                            <label class="form-label">
                                <input type="checkbox" name="notifyOnEligibleAssignment" ${t.notifyOnEligibleAssignment!==!1?"checked":""}>
                                <strong>Notify on Eligible Assignment</strong>
                                <small class="form-hint">Notify user when made eligible for role</small>
                            </label>

                            <label class="form-label">
                                <input type="checkbox" name="notifyAdminsOnAssignment" ${t.notifyAdminsOnAssignment?"checked":""}>
                                <strong>Notify Admins on Assignment</strong>
                                <small class="form-hint">Send notification to admins when eligibility changes</small>
                            </label>
                        </div>

                        <div class="form-section">
                            <h4>Additional Recipients</h4>
                            <label class="form-label">
                                Additional Notification Recipients (comma-separated emails)
                                <textarea name="additionalRecipients" class="input" rows="2"
                                          placeholder="security@company.com, audit@company.com">${t.additionalRecipients?.join(", ")||""}</textarea>
                                <small class="form-hint">These recipients will receive all notifications for this role</small>
                            </label>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="app.closeModal()">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="app.pages.roles.resetPolicyToDefaults('${i}')">
                            <i class="fas fa-undo"></i> Reset to Defaults
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Policy
                        </button>
                    </div>
                </form>
            </div>
        `;this.showModal(a),document.getElementById("policy-form").addEventListener("submit",async o=>{o.preventDefault(),await this.handleSavePolicy(i,o.target)})}switchPolicyTab(i){document.querySelectorAll(".tab-btn").forEach(e=>e.classList.remove("active")),document.querySelectorAll(".tab-content").forEach(e=>{e.style.display="none",e.classList.remove("active")}),document.querySelector(`.tab-btn[onclick*="${i}"]`)?.classList.add("active");const s=document.getElementById(`tab-${i}`);s&&(s.style.display="block",s.classList.add("active"))}resetPolicyToDefaults(i){if(!confirm("Reset this policy to default settings? Your custom configuration will be lost."))return;const s=document.getElementById("policy-form");s&&(s.reset(),s.querySelector('[name="maximumDurationHours"]').value=8,s.querySelector('[name="defaultDurationHours"]').value=4,s.querySelector('[name="maxEligibleDurationDays"]').value=365,s.querySelector('[name="maxActiveDurationDays"]').value=180,s.querySelector('[name="expirationWarningHours"]').value=1,s.querySelector('[name="notifyOnActivation"]').checked=!0,s.querySelector('[name="notifyOnExpiration"]').checked=!0,s.querySelector('[name="notifyOnEligibleAssignment"]').checked=!0,s.querySelector('[name="allowPermanentEligible"]').checked=!0,document.getElementById("approvers-section").style.display="none",this.showToast("Policy reset to defaults","info"))}async handleSavePolicy(i,s){const e=new FormData(s),l=o=>o?o.split(",").map(n=>n.trim()).filter(n=>n.length>0):[],t={requireMfa:e.get("requireMfa")==="on",requireApproval:e.get("requireApproval")==="on",requireJustification:e.get("requireJustification")==="on",requireTicket:e.get("requireTicket")==="on",maximumDurationHours:parseFloat(e.get("maximumDurationHours"))||8,defaultDurationHours:parseFloat(e.get("defaultDurationHours"))||4,approvers:l(e.get("approvers")),allowPermanentEligible:e.get("allowPermanentEligible")==="on",requireJustificationOnAssignment:e.get("requireJustificationOnAssignment")==="on",maxEligibleDurationDays:parseInt(e.get("maxEligibleDurationDays"))||365,allowPermanentActive:e.get("allowPermanentActive")==="on",maxActiveDurationDays:parseInt(e.get("maxActiveDurationDays"))||180,notifyOnActivation:e.get("notifyOnActivation")==="on",notifyOnExpiration:e.get("notifyOnExpiration")==="on",expirationWarningHours:parseFloat(e.get("expirationWarningHours"))||1,notifyOnEligibleAssignment:e.get("notifyOnEligibleAssignment")==="on",notifyAdminsOnAssignment:e.get("notifyAdminsOnAssignment")==="on",additionalRecipients:l(e.get("additionalRecipients"))};if(t.defaultDurationHours>t.maximumDurationHours){this.showToast("Default duration cannot exceed maximum duration","error");return}if(t.requireApproval&&t.approvers.length===0&&!confirm("No approvers specified. Continue with default approvers?")||t.allowPermanentActive&&!confirm("⚠️ Permanent active assignments bypass PIM protections. Are you sure?"))return;this.closeModal(),this.showLoading("Updating policy...");const a=await r.updateRolePolicy(i,t);this.hideLoading(),a.success?this.showToast("Policy updated successfully","success"):this.showToast(`Failed to update policy: ${a.error}`,"error")}async assignGroupToRole(i,s){this.showLoading("Loading groups...");const e=await r.getPIMGroups();if(this.hideLoading(),!e.success||!e.groups||e.groups.length===0){this.showToast("No PIM groups available to assign","error");return}const l=e.groups,t=`
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
                    <h3>${this.escapeHtml(s)}</h3>
                    <p class="text-muted">Assign a PIM group to this role</p>
                </div>

                <form id="assign-group-form">
                    <div class="form-section">
                        <label class="form-label">
                            <strong>Select Group <span class="required">*</span></strong>
                            <select name="groupId" class="input" required>
                                <option value="">-- Select a group --</option>
                                ${l.map(a=>`
                                    <option value="${a.id}">${this.escapeHtml(a.displayName)} (${a.memberCount} members)</option>
                                `).join("")}
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
        `;this.showModal(t),document.getElementById("assign-group-form").addEventListener("submit",async a=>{a.preventDefault(),await this.handleAssignGroup(i,s,a.target)})}async handleAssignGroup(i,s,e){const l=new FormData(e),t=l.get("groupId"),a=l.get("assignmentType"),o=parseInt(l.get("durationDays"))||365,n=l.get("justification")||`PIM assignment to ${s}`;if(!t){this.showToast("Please select a group","error");return}const[b,v]=a.split("-"),m=b==="active",d=v==="permanent";if(m&&!confirm(`⚠️ WARNING: Active assignments bypass PIM protections!

Group members will have IMMEDIATE access to this role without needing to activate.

This is NOT recommended for privileged roles. Consider using Eligible assignments instead.

Continue with Active assignment?`))return;const g=(await r.getPIMGroups()).groups?.find(p=>p.id===t)?.displayName||"Unknown Group";this.closeModal(),this.showLoading(`Assigning ${g} to ${s}...`);const h=new Date().toISOString(),f=d?null:new Date(Date.now()+o*24*60*60*1e3).toISOString();let c;if(m?c=await r.createDirectoryRoleActiveAssignment(t,i,n,h,f):c=await r.createDirectoryRoleEligibleAssignment(t,i,n,h,f),this.hideLoading(),c.success){const p=m?"Active":"Eligible",y=d?"permanently":`for ${o} days`;this.showToast(`Successfully assigned "${g}" as ${p} to "${s}" ${y}`,"success")}else this.showToast(`Failed to assign group: ${c.error}`,"error")}}export{D as R};
//# sourceMappingURL=page-rolespage-NLhHTgT_.js.map
