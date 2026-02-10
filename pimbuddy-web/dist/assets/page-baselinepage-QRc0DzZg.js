import{B as S}from"./core-rjX7nIO3.js";import{b as $,g as v}from"./services-DF6cB9Vv.js";class C extends S{constructor(i){super(i),this.baselineState={selectedBaseline:null,selectedTiers:[],validationResults:null,deploymentPlan:null,groupUsers:{},groupCustomizations:{}}}async render(i,o={}){const c=$.getBaselineConfigurations();i.innerHTML=`
            <div class="page-header-row">
                <h1 class="page-header">
                    <i class="fas fa-rocket"></i> PIM Baseline Deployment
                </h1>
                <span class="page-subtitle">One-shot PIM configuration based on best practices</span>
            </div>
            <p class="page-description">Deploy a complete PIM configuration with groups, policies, and role assignments based on industry best practices and Zero Trust principles.</p>

            <div id="baseline-wizard-step" data-step="1">
                <!-- Step 1: Baseline Selection -->
                <div id="baseline-step-1" class="baseline-step active">
                    <h2 class="step-title"><i class="fas fa-list-check"></i> Step 1: Choose Your Baseline</h2>

                    <div class="baseline-grid">
                        ${Object.entries(c).map(([l,e])=>`
                            <div class="card baseline-card" data-baseline="${l}">
                                <div class="baseline-header">
                                    <i class="fas ${e.icon} baseline-icon"></i>
                                    <h3>${e.name}</h3>
                                </div>
                                <p class="baseline-desc">${e.description}</p>

                                <div class="baseline-features">
                                    <h4>Key Features:</h4>
                                    <ul>
                                        ${e.features.map(a=>`<li><i class="fas fa-check-circle"></i> ${a}</li>`).join("")}
                                    </ul>
                                </div>

                                <div class="baseline-stats">
                                    <span class="stat-badge"><i class="fas fa-layer-group"></i> ${e.tiers.length} Tiers</span>
                                    <span class="stat-badge"><i class="fas fa-users"></i> ${e.tiers.reduce((a,s)=>a+s.groups.length,0)} Groups</span>
                                </div>

                                <button class="btn btn-primary btn-block" onclick="app.pages.baseline.selectBaseline('${l}')" ${this.isConnected()?"":"disabled"} aria-label="Select ${e.name} baseline">
                                    <i class="fas fa-arrow-right"></i> Select This Baseline
                                </button>
                            </div>
                        `).join("")}
                    </div>
                </div>

                <!-- Step 2: Tier & Group Selection -->
                <div id="baseline-step-2" class="baseline-step">
                    <h2 class="step-title"><i class="fas fa-layer-group"></i> Step 2: Configure Tiers & Groups</h2>

                    <div class="step-navigation">
                        <button class="btn btn-secondary" onclick="app.pages.baseline.previousStep()" aria-label="Go back">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                    </div>

                    <div id="baseline-tier-config" class="tier-config-container">
                        <!-- Populated dynamically -->
                    </div>

                    <div class="step-actions">
                        <button class="btn btn-primary" onclick="app.pages.baseline.validateConfiguration()" aria-label="Validate configuration">
                            <i class="fas fa-check-circle"></i> Validate Configuration
                        </button>
                    </div>
                </div>

                <!-- Step 3: Validation & Review -->
                <div id="baseline-step-3" class="baseline-step">
                    <h2 class="step-title"><i class="fas fa-clipboard-check"></i> Step 3: Review & Deploy</h2>

                    <div class="step-navigation">
                        <button class="btn btn-secondary" onclick="app.pages.baseline.previousStep()" aria-label="Go back">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                    </div>

                    <div id="baseline-validation-results" class="validation-results">
                        <!-- Populated after validation -->
                    </div>

                    <div id="baseline-deployment-plan" class="deployment-plan">
                        <!-- Populated after validation -->
                    </div>

                    <div class="step-actions">
                        <button class="btn btn-success btn-lg" onclick="app.pages.baseline.executeDeployment()" id="deploy-baseline-btn" aria-label="Deploy baseline">
                            <i class="fas fa-rocket"></i> Deploy Baseline
                        </button>
                    </div>
                </div>

                <!-- Step 4: Deployment Progress -->
                <div id="baseline-step-4" class="baseline-step">
                    <h2 class="step-title"><i class="fas fa-tasks"></i> Deployment in Progress</h2>

                    <div id="baseline-deployment-progress" class="deployment-progress">
                        <!-- Populated during deployment -->
                    </div>
                </div>
            </div>
        `,this.baselineState={selectedBaseline:null,selectedTiers:[],validationResults:null,deploymentPlan:null,groupUsers:{},groupCustomizations:{}}}selectBaseline(i){const o=$.getBaseline(i);this.baselineState.selectedBaseline=i;const c=document.getElementById("baseline-tier-config");c.innerHTML=`
            <div class="card">
                <h3><i class="fas fa-info-circle"></i> Selected: ${o.name}</h3>
                <p>${o.description}</p>
            </div>

            <div class="tiers-list">
                ${o.tiers.map((l,e)=>`
                    <div class="card tier-card">
                        <div class="tier-header">
                            <label class="checkbox-label tier-checkbox">
                                <input type="checkbox" class="tier-select" data-tier="${e}" checked>
                                <h3>
                                    ${l.tier===0?"💀":l.tier===1?"⚠️":"🔵"}
                                    ${l.name}
                                </h3>
                            </label>
                        </div>

                        <div class="tier-policy-summary">
                            <h4>Policy Configuration:</h4>
                            <div class="policy-grid">
                                <div class="policy-item">
                                    <i class="fas fa-clock"></i>
                                    <span>Max Duration: ${l.policy.maximumDurationHours}h</span>
                                </div>
                                <div class="policy-item">
                                    <i class="fas fa-shield-alt"></i>
                                    <span>MFA: ${l.policy.requireMfa?"Required":"Optional"}</span>
                                </div>
                                <div class="policy-item">
                                    <i class="fas fa-clipboard-check"></i>
                                    <span>Approval: ${l.policy.requireApproval?"Required":"Not Required"}</span>
                                </div>
                                <div class="policy-item">
                                    <i class="fas fa-comment-dots"></i>
                                    <span>Justification: ${l.policy.requireJustification?"Required":"Optional"}</span>
                                </div>
                            </div>
                        </div>

                        <div class="tier-groups">
                            <h4>Groups to Create (${l.groups.length}):</h4>
                            <p class="form-hint"><i class="fas fa-info-circle"></i> Click the arrow (▼) on each group to customize name and add users</p>
                            <div class="groups-list">
                                ${l.groups.map((a,s)=>`
                                    <div class="group-item baseline-group-item" data-tier="${e}" data-group-index="${s}">
                                        <div class="group-item-header">
                                            <label class="checkbox-label">
                                                <input type="checkbox" class="group-select" data-tier="${e}" data-group="${a.name}" checked>
                                                <div class="group-info-compact">
                                                    <i class="fas fa-users"></i>
                                                    <span>${a.name}</span>
                                                </div>
                                            </label>
                                            <button class="btn btn-sm btn-secondary" onclick="app.pages.baseline.toggleGroupDetails(${e}, ${s})" aria-label="Toggle group details">
                                                <i class="fas fa-chevron-down"></i>
                                            </button>
                                        </div>

                                        <div class="group-item-details" id="group-details-${e}-${s}">
                                            <div class="form-group">
                                                <label>Group Name</label>
                                                <input type="text" class="input group-name-input"
                                                    data-tier="${e}"
                                                    data-group-index="${s}"
                                                    data-original="${a.name}"
                                                    value="${a.name}"
                                                    aria-label="Group name">
                                                <small class="form-hint">Customize the group name (must be unique)</small>
                                            </div>

                                            <div class="form-group">
                                                <label>Description</label>
                                                <textarea class="input group-desc-input"
                                                    data-tier="${e}"
                                                    data-group-index="${s}"
                                                    rows="2"
                                                    aria-label="Group description">${a.description}</textarea>
                                            </div>

                                            <div class="form-group">
                                                <label>Assigned Roles</label>
                                                <div class="group-roles-list">
                                                    <i class="fas fa-user-shield"></i>
                                                    ${a.roles.length} role${a.roles.length!==1?"s":""}
                                                </div>
                                            </div>

                                            <div class="form-group">
                                                <label>Assignment Type</label>
                                                <div class="assignment-type-toggle">
                                                    <label class="toggle-option ${a.isActive?"":"active"}" data-tier="${e}" data-group-index="${s}" data-type="eligible">
                                                        <input type="radio" name="assignment-type-${e}-${s}" value="eligible" checked>
                                                        <div class="toggle-content">
                                                            <i class="fas fa-clock"></i>
                                                            <span>Eligible</span>
                                                            <small>Users activate when needed</small>
                                                        </div>
                                                    </label>
                                                    <label class="toggle-option ${a.isActive?"active":""}" data-tier="${e}" data-group-index="${s}" data-type="active">
                                                        <input type="radio" name="assignment-type-${e}-${s}" value="active">
                                                        <div class="toggle-content">
                                                            <i class="fas fa-check-circle"></i>
                                                            <span>Active</span>
                                                            <small>Always active (permanent)</small>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>

                                            <div class="form-group">
                                                <label>Add Users (Optional)</label>
                                                <div class="user-search-container">
                                                    <input type="text"
                                                        class="input user-search-input"
                                                        data-tier="${e}"
                                                        data-group-index="${s}"
                                                        placeholder="Search users by name or email..."
                                                        aria-label="Search users">
                                                    <div class="user-search-results" id="user-search-results-${e}-${s}"></div>
                                                </div>
                                                <div class="selected-users-list" id="selected-users-${e}-${s}">
                                                    <small class="form-hint">No users added yet. Search above to add users.</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                    </div>
                `).join("")}
            </div>
        `,this.goToStep(2),this.baselineState.groupUsers={},this.baselineState.groupCustomizations={},document.querySelectorAll(".tier-select").forEach(l=>{l.addEventListener("change",e=>{const a=parseInt(e.target.dataset.tier);document.querySelectorAll(`.group-select[data-tier="${a}"]`).forEach(n=>{n.checked=e.target.checked,n.disabled=!e.target.checked})})}),document.querySelectorAll(".toggle-option").forEach(l=>{l.addEventListener("click",e=>{const a=e.currentTarget,s=a.dataset.tier,n=a.dataset.groupIndex,m=a.dataset.type;document.querySelectorAll(`.toggle-option[data-tier="${s}"][data-group-index="${n}"]`).forEach(y=>y.classList.remove("active")),a.classList.add("active"),a.querySelector('input[type="radio"]').checked=!0;const h=`${s}-${n}`;this.baselineState.groupCustomizations[h]||(this.baselineState.groupCustomizations[h]={}),this.baselineState.groupCustomizations[h].assignmentType=m})}),document.querySelectorAll(".user-search-input").forEach(l=>{let e;l.addEventListener("input",a=>{clearTimeout(e);const s=a.target.value.trim(),n=a.target.dataset.tier,m=a.target.dataset.groupIndex;if(s.length<2){document.getElementById(`user-search-results-${n}-${m}`).innerHTML="";return}e=setTimeout(()=>{this.searchUsers(n,m,s)},300)})})}toggleGroupDetails(i,o){const c=document.getElementById(`group-details-${i}-${o}`),e=event.target.closest("button").querySelector("i");c.style.display==="none"||!c.style.display?(c.style.display="block",e.className="fas fa-chevron-up"):(c.style.display="none",e.className="fas fa-chevron-down")}async searchUsers(i,o,c){const l=document.getElementById(`user-search-results-${i}-${o}`);l.innerHTML='<div class="search-loading"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';try{const e=await v.searchUsers(c);e.success&&e.users.length>0?l.innerHTML=e.users.map(a=>`
                    <div class="user-search-result" onclick="app.pages.baseline.addUser(${i}, ${o}, '${a.id}', '${this.escapeHtml(a.displayName)}', '${this.escapeHtml(a.userPrincipalName)}')">
                        <div class="user-info">
                            <i class="fas fa-user"></i>
                            <div>
                                <div class="user-name">${this.escapeHtml(a.displayName)}</div>
                                <div class="user-email">${this.escapeHtml(a.userPrincipalName)}</div>
                            </div>
                        </div>
                        <i class="fas fa-plus-circle"></i>
                    </div>
                `).join(""):l.innerHTML='<div class="search-no-results">No users found</div>'}catch{l.innerHTML='<div class="search-error">Search failed</div>'}}addUser(i,o,c,l,e){const a=`${i}-${o}`;if(this.baselineState.groupUsers[a]||(this.baselineState.groupUsers[a]=[]),this.baselineState.groupUsers[a].some(s=>s.id===c)){this.showToast("User already added to this group","info");return}this.baselineState.groupUsers[a].push({id:c,displayName:l,userPrincipalName:e}),this.updateUsersList(i,o),document.querySelector(`.user-search-input[data-tier="${i}"][data-group-index="${o}"]`).value="",document.getElementById(`user-search-results-${i}-${o}`).innerHTML="",this.showToast(`Added ${l} to group`,"success")}removeUser(i,o,c){const l=`${i}-${o}`;this.baselineState.groupUsers[l]&&(this.baselineState.groupUsers[l]=this.baselineState.groupUsers[l].filter(e=>e.id!==c),this.updateUsersList(i,o))}updateUsersList(i,o){const c=`${i}-${o}`,l=this.baselineState.groupUsers[c]||[],e=document.getElementById(`selected-users-${i}-${o}`);l.length===0?e.innerHTML='<small class="form-hint">No users added yet. Search above to add users.</small>':e.innerHTML=`
                <div class="selected-users-header">
                    <strong>${l.length} user${l.length!==1?"s":""} will be added:</strong>
                </div>
                ${l.map(a=>`
                    <div class="selected-user-item">
                        <div class="user-info">
                            <i class="fas fa-user"></i>
                            <div>
                                <div class="user-name">${this.escapeHtml(a.displayName)}</div>
                                <div class="user-email">${this.escapeHtml(a.userPrincipalName)}</div>
                            </div>
                        </div>
                        <button class="btn btn-sm btn-danger" onclick="app.pages.baseline.removeUser(${i}, ${o}, '${a.id}')" aria-label="Remove user">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join("")}
            `}async validateConfiguration(){if(!this.baselineState.selectedBaseline){this.showToast("No baseline selected","error");return}this.showLoading("Validating configuration...");try{const i=$.getBaseline(this.baselineState.selectedBaseline),o={baseline:this.baselineState.selectedBaseline,tiers:[]};document.querySelectorAll(".tier-select:checked").forEach(s=>{const n=parseInt(s.dataset.tier),m=i.tiers[n],f=[];document.querySelectorAll(`.group-select[data-tier="${n}"]:checked`).forEach(h=>{const y=h.dataset.group,t=m.groups.findIndex(g=>g.name===y),r=m.groups[t];if(r&&t!==-1){const g=document.querySelector(`.group-name-input[data-tier="${n}"][data-group-index="${t}"]`),d=document.querySelector(`.group-desc-input[data-tier="${n}"][data-group-index="${t}"]`),p=document.querySelector(`input[name="assignment-type-${n}-${t}"]:checked`),u={...r,name:g?g.value.trim():r.name,description:d?d.value.trim():r.description,originalName:r.name,assignmentType:p?p.value:"eligible"},b=`${n}-${t}`;this.baselineState.groupCustomizations[b]={name:u.name,description:u.description,users:this.baselineState.groupUsers[b]||[],assignmentType:u.assignmentType},f.push(u)}}),f.length>0&&o.tiers.push({...m,groups:f})}),this.baselineState.selectedTiers=o.tiers;const c=await v.getPIMGroups(),l=await v.getRoleDefinitions(),e=$.validateBaseline(o,{existingGroups:c.groups||[],existingRoles:l.roles||[]});this.baselineState.validationResults=e;const a=$.calculateDeploymentPlan(o,{existingGroups:c.groups||[],existingRoles:l.roles||[]});this.baselineState.deploymentPlan=a,this.hideLoading(),this.displayValidationResults(e,a),this.goToStep(3)}catch(i){this.hideLoading(),this.showToast("Validation failed: "+i.message,"error")}}displayValidationResults(i,o){const c=document.getElementById("baseline-validation-results"),l=document.getElementById("baseline-deployment-plan"),e=i.errors.length>0,a=i.warnings.length>0;c.innerHTML=`
            <div class="card ${e?"validation-error":a?"validation-warning":"validation-success"}">
                <h3>
                    <i class="fas ${e?"fa-times-circle":a?"fa-exclamation-triangle":"fa-check-circle"}"></i>
                    Validation ${e?"Failed":a?"Passed with Warnings":"Passed"}
                </h3>

                ${i.errors.length>0?`
                    <div class="validation-section validation-errors">
                        <h4><i class="fas fa-times-circle"></i> Errors</h4>
                        <ul>
                            ${i.errors.map(n=>`<li>${this.escapeHtml(n)}</li>`).join("")}
                        </ul>
                    </div>
                `:""}

                ${i.warnings.length>0?`
                    <div class="validation-section validation-warnings">
                        <h4><i class="fas fa-exclamation-triangle"></i> Warnings</h4>
                        <ul>
                            ${i.warnings.map(n=>`<li>${this.escapeHtml(n)}</li>`).join("")}
                        </ul>
                    </div>
                `:""}

                ${!e&&!a?`
                    <p><i class="fas fa-check"></i> Configuration is valid and ready for deployment.</p>
                `:""}

                ${i.newGroups&&i.newGroups.length>0?`
                    <div class="validation-summary">
                        <h4><i class="fas fa-info-circle"></i> Summary</h4>
                        <p><strong>${i.newGroups.length} new group(s)</strong> will be created:</p>
                        <ul class="group-list-compact">
                            ${i.newGroups.map(n=>`<li><i class="fas fa-plus-circle"></i> ${this.escapeHtml(n)}</li>`).join("")}
                        </ul>
                    </div>
                `:""}

                ${i.existingGroups&&i.existingGroups.length>0?`
                    <div class="validation-summary">
                        <p><strong>${i.existingGroups.length} existing group(s)</strong> will be skipped:</p>
                        <ul class="group-list-compact">
                            ${i.existingGroups.map(n=>`<li><i class="fas fa-check-circle"></i> ${this.escapeHtml(n)}</li>`).join("")}
                        </ul>
                    </div>
                `:""}
            </div>
        `,l.innerHTML=`
            <div class="card deployment-plan-card">
                <h3><i class="fas fa-tasks"></i> Deployment Plan</h3>

                <div class="plan-summary">
                    <div class="plan-stat">
                        <span class="plan-value">${o.groupsToCreate.length}</span>
                        <span class="plan-label">Groups to Create</span>
                    </div>
                    <div class="plan-stat">
                        <span class="plan-value">${o.policiesToConfigure.length}</span>
                        <span class="plan-label">Policies to Configure</span>
                    </div>
                    <div class="plan-stat">
                        <span class="plan-value">${o.roleAssignmentsToCreate.length}</span>
                        <span class="plan-label">Role Assignments</span>
                    </div>
                    <div class="plan-stat">
                        <span class="plan-value">${o.estimatedTime}</span>
                        <span class="plan-label">Est. Time</span>
                    </div>
                </div>

                <div class="plan-details">
                    <h4>Deployment Steps:</h4>
                    <ol class="deployment-steps-list">
                        ${o.steps.map(n=>`
                            <li>
                                <i class="fas ${n.icon}"></i>
                                <strong>${this.escapeHtml(n.title)}</strong>
                                <p>${this.escapeHtml(n.description)}</p>
                            </li>
                        `).join("")}
                    </ol>
                </div>

                <div class="plan-groups-preview">
                    <h4>Groups to be created:</h4>
                    <div class="groups-preview-list">
                        ${o.groupsToCreate.map(n=>`
                            <div class="group-preview-item">
                                <i class="fas fa-users"></i>
                                <div>
                                    <strong>${this.escapeHtml(n.displayName)}</strong>
                                    <p>${this.escapeHtml(n.description)}</p>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>
        `;const s=document.getElementById("deploy-baseline-btn");s&&(s.disabled=e)}async executeDeployment(){if(!this.baselineState.deploymentPlan){this.showToast("No deployment plan available","error");return}if(!confirm(`This will create ${this.baselineState.deploymentPlan.groupsToCreate.length} groups and configure their policies.

This action cannot be undone automatically. Continue?`))return;this.goToStep(4);const o=document.getElementById("baseline-deployment-progress"),c=this.baselineState.deploymentPlan,l=c.groupsToCreate.reduce((n,m)=>n+(m.roles?.length||0),0),e=c.groupsToCreate.length+l+l;let a=0;const s=(n,m=!1)=>{a++;const f=Math.round(a/e*100),h=document.createElement("div");h.className=`deployment-log-entry ${m?"log-error":"log-success"}`,h.innerHTML=`
                <i class="fas ${m?"fa-times-circle":"fa-check-circle"}"></i>
                <span>${n}</span>
            `;const y=o.querySelector(".deployment-log")||(()=>{const r=document.createElement("div");return r.className="deployment-log",o.appendChild(r),r})();y.appendChild(h),y.scrollTop=y.scrollHeight;const t=o.querySelector(".progress-bar-fill");t&&(t.style.width=`${f}%`,t.textContent=`${f}%`)};o.innerHTML=`
            <div class="card">
                <h3><i class="fas fa-spinner fa-spin"></i> Deploying Baseline Configuration</h3>
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: 0%">0%</div>
                </div>
                <div class="deployment-log"></div>
            </div>
        `;try{s("Fetching role information...");const n=await v.getRoleDefinitions(),m=new Map;n.success&&n.roles.forEach(t=>{m.set(t.id,t.displayName)}),s("Starting group creation...");const f=[];for(const t of c.groupsToCreate)try{const r=await v.createPIMGroup(t.displayName,t.description,t.mailNickname);r.success?(f.push({config:t,group:r.group}),s(`✓ Created group: ${t.displayName}`)):s(`✗ Failed to create group: ${t.displayName} - ${r.error}`,!0)}catch(r){s(`✗ Error creating group: ${t.displayName} - ${r.message}`,!0)}s("Waiting for groups to provision (30-60 seconds)..."),await new Promise(t=>setTimeout(t,3e4)),s("Assigning groups to roles...");const h=[];for(const t of f){const r=t.config.roles||[],g=Object.entries(this.baselineState.groupCustomizations||{}).find(([p,u])=>u.name===t.config.displayName),d=g?g[1].assignmentType:"eligible";for(const p of r)try{let u;if(d==="active"?u=await v.createDirectoryRoleActiveAssignment(t.group.id,p,`Baseline deployment (Active): ${t.config.displayName}`):u=await v.createDirectoryRoleEligibilityAssignment(t.group.id,p,`Baseline deployment (Eligible): ${t.config.displayName}`,12),u.success){const b=m.get(p)||p;h.push({groupId:t.group.id,groupName:t.config.displayName,roleId:p,roleName:b,policy:t.config.policy}),s(`✓ Assigned ${t.config.displayName} to ${b} (${d})`)}else s(`✗ Failed to assign ${t.config.displayName}: ${u.error}`,!0)}catch(u){s(`✗ Error assigning ${t.config.displayName}: ${u.message}`,!0)}}if(s("Waiting for role assignments to propagate (10 seconds)..."),await new Promise(t=>setTimeout(t,1e4)),s(`✓ Role assignments complete. ${h.length} groups assigned to roles.`),h.length>0){s("Configuring role policies...");const t=new Map;h.forEach(r=>{t.has(r.roleId)||t.set(r.roleId,{roleId:r.roleId,roleName:r.roleName,groupName:r.groupName,policy:r.policy})});for(const[r,g]of t)try{s(`Fetching policy for ${g.roleName}...`);const d=await v.getRolePolicy(r);if(d.success&&d.policy){let p=0;try{await v.updateRolePolicy(d.policy.id,"Expiration_EndUser_Assignment",{maximumDuration:`PT${g.policy.maximumDurationHours}H`,isExpirationRequired:!0}),p++}catch(u){console.error("Expiration rule update failed:",u)}try{await v.updateRolePolicy(d.policy.id,"Enablement_EndUser_Assignment",{enabledRules:[g.policy.requireMfa?"MultiFactorAuthentication":null,g.policy.requireJustification?"Justification":null,g.policy.requireTicketInfo?"Ticketing":null].filter(u=>u!==null)}),p++}catch(u){console.error("Enablement rule update failed:",u)}try{await v.updateRolePolicy(d.policy.id,"Approval_EndUser_Assignment",{isApprovalRequired:g.policy.requireApproval}),p++}catch(u){console.error("Approval rule update failed:",u)}p>0?s(`✓ Updated ${g.roleName} policy (${p}/3 rules)`):s(`⚠ Could not update ${g.roleName} policy`,!1)}else{const p=d.error||"Unknown error";s(`⚠ Could not fetch ${g.roleName} policy: ${p}`,!1)}}catch(d){s(`⚠ Policy update error: ${d.message}`,!1)}}const y=Object.values(this.baselineState.groupUsers||{}).reduce((t,r)=>t+r.length,0);if(y>0){s(`Adding ${y} users to groups...`);for(const t of f){const r=Object.entries(this.baselineState.groupCustomizations||{}).find(([g,d])=>d.name===t.config.displayName);if(r&&r[1].users&&r[1].users.length>0){const g=r[1].users;for(const d of g)try{const p=await v.createEligibleAssignment(t.group.id,d.id,"member",null,null);p.success?s(`✓ Added ${d.displayName} to ${t.config.displayName}`):s(`✗ Failed to add ${d.displayName}: ${p.error}`,!0)}catch(p){s(`✗ Error adding ${d.displayName}: ${p.message}`,!0)}}}}s("Deployment completed!"),o.innerHTML+=`
                <div class="deployment-complete">
                    <i class="fas fa-check-circle"></i>
                    <h3>Baseline Deployed Successfully!</h3>
                    <p>Created ${f.length} groups with configured policies.</p>
                    <div class="deployment-actions">
                        <button class="btn btn-primary" onclick="app.navigateTo('groups')">
                            <i class="fas fa-users"></i> View Groups
                        </button>
                        <button class="btn btn-secondary" onclick="app.router.refreshCurrentPage()">
                            <i class="fas fa-redo"></i> Deploy Another Baseline
                        </button>
                    </div>
                </div>
            `,this.showToast("Baseline deployed successfully!","success")}catch(n){s(`✗ Deployment failed: ${n.message}`,!0),this.showToast("Deployment failed: "+n.message,"error"),o.innerHTML+=`
                <div class="deployment-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Deployment Failed</h3>
                    <p>${this.escapeHtml(n.message)}</p>
                    <button class="btn btn-secondary" onclick="app.pages.baseline.previousStep()">
                        <i class="fas fa-arrow-left"></i> Go Back
                    </button>
                </div>
            `}}goToStep(i){document.querySelectorAll(".baseline-step").forEach(c=>{c.classList.remove("active")});const o=document.getElementById(`baseline-step-${i}`);o&&(o.classList.add("active"),document.getElementById("baseline-wizard-step").dataset.step=i)}previousStep(){const i=parseInt(document.getElementById("baseline-wizard-step").dataset.step);i>1&&this.goToStep(i-1)}async refreshPage(){await this.app.router.refreshCurrentPage()}}export{C as B};
//# sourceMappingURL=page-baselinepage-QRc0DzZg.js.map
