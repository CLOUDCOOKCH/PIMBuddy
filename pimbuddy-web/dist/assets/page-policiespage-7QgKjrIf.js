import{B as o,C as t}from"./core-rjX7nIO3.js";import{g as a}from"./services-DF6cB9Vv.js";class n extends o{constructor(e){super(e)}async render(e,s={}){e.innerHTML=`
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
                        ${this.isConnected()?'<p class="loading-text">Loading roles...</p>':'<p class="empty-text">Connect to view roles</p>'}
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
        `,this.isConnected()&&await this.loadRoles()}async loadRoles(){let e=this.getCached(t.ROLES.key);if(!e){const s=await a.getRoleDefinitions();if(s.success)e=s.roles,this.setCached(t.ROLES.key,e);else{this.showToast(`Failed to load roles: ${s.error}`,"error");return}}this.allRoles=e,this.displayRoles(e)}displayRoles(e){const s=document.getElementById("policy-role-list");s&&(s.innerHTML=e.map(i=>`
            <div class="policy-item" onclick="app.pages.policies.selectRole('${i.id}', '${this.escapeHtml(i.displayName)}')">
                <strong>${this.escapeHtml(i.displayName)}</strong>
            </div>
        `).join(""))}filterRoles(e){if(!this.allRoles)return;const s=this.allRoles.filter(i=>i.displayName.toLowerCase().includes(e.toLowerCase()));this.displayRoles(s)}async selectRole(e,s){this.showToast(`Policy configuration for ${s} - Use Roles page for full editor`,"info")}async refreshPage(){this.app.cacheManager.invalidate(t.ROLES.key),await this.app.router.refreshCurrentPage()}}export{n as P};
//# sourceMappingURL=page-policiespage-7QgKjrIf.js.map
