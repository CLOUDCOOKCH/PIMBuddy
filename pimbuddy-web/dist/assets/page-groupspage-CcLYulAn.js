import{B as h,C as l}from"./core-rjX7nIO3.js";import{g as r}from"./services-DF6cB9Vv.js";import{U as n,a as p,e as m,b as g}from"./utils-B68CIlTQ.js";class $ extends h{constructor(e){super(e),this.paginator=e.paginators.groups,this.bulkOps=e.bulkOps.groups}async render(e,t={}){let s=[];if(this.isConnected()){if(this.showLoading("Loading groups..."),s=this.getCached(l.GROUPS.key),!s){const a=await r.getPIMGroups();a.success?(s=a.groups,this.setCached(l.GROUPS.key,s)):this.showToast(`Failed to load groups: ${a.error}`,"error")}this.hideLoading()}s=s||[],this.bulkOps.initialize(s,()=>{this.app.router.refreshCurrentPage()}),this.paginator.updateItems(s);const o=this.paginator.getCurrentPageItems();e.innerHTML=`
            <div class="page-header-row">
                <h1 class="page-header">PIM Groups</h1>
                <button class="btn btn-primary" onclick="app.pages.groups.showCreateGroup()" ${this.isConnected()?"":"disabled"}>
                    <i class="fas fa-plus"></i> Create Group
                </button>
            </div>

            <div class="toolbar">
                <input type="text" id="group-search" class="input" placeholder="Search groups..." oninput="app.pages.groups.filterGroups(this.value)">
                <button class="btn btn-secondary" onclick="app.exportUtils.showExportMenu('groups')" ${!this.isConnected()||s.length===0?"disabled":""}>
                    <i class="fas fa-file-export"></i> Export
                </button>
                <button class="btn btn-secondary" onclick="app.pages.groups.refreshPage()" ${this.isConnected()?"":"disabled"}>
                    <i class="fas fa-sync"></i> Refresh
                </button>
            </div>

            ${this.bulkOps.renderBulkActionsToolbar([{label:"Delete",icon:"fa-trash",variant:"btn-danger",onClick:"app.pages.groups.bulkDeleteGroups()",description:"Delete selected groups"},{label:"Export",icon:"fa-file-export",variant:"btn-secondary",onClick:"app.pages.groups.bulkExportGroups()",description:"Export selected groups"}])}

            <div class="card">
                <table class="data-table" id="groups-table">
                    <thead>
                        <tr>
                            <th style="width: 40px;">
                                ${this.bulkOps.renderHeaderCheckbox("app.pages.groups.toggleAll")}
                            </th>
                            <th>Display Name</th>
                            <th>Description</th>
                            <th>Members</th>
                            <th>Owners</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${o.length>0?o.map(a=>`
                            <tr data-id="${a.id}">
                                <td>
                                    ${this.bulkOps.renderRowCheckbox(a.id,"app.pages.groups.toggleItem")}
                                </td>
                                <td><strong>${this.escapeHtml(a.displayName)}</strong></td>
                                <td>${this.escapeHtml(a.description||"-")}</td>
                                <td>${a.memberCount||0}</td>
                                <td>${a.ownerCount||0}</td>
                                <td>${a.createdDateTime?new Date(a.createdDateTime).toLocaleDateString():"-"}</td>
                                <td>
                                    <button class="icon-btn" onclick="app.pages.groups.manageGroup('${a.id}')" title="Manage" aria-label="Manage group ${this.escapeHtml(a.displayName)}">
                                        <i class="fas fa-cog" aria-hidden="true"></i>
                                    </button>
                                    <button class="icon-btn danger" onclick="app.pages.groups.deleteGroup('${a.id}')" title="Delete" aria-label="Delete group ${this.escapeHtml(a.displayName)}">
                                        <i class="fas fa-trash" aria-hidden="true"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join(""):`
                            <tr>
                                <td colspan="7" class="empty-state">
                                    ${this.isConnected()?"No PIM groups found":"Connect to view groups"}
                                </td>
                            </tr>
                        `}
                    </tbody>
                </table>

                ${this.paginator.renderControls("app.pages.groups.handlePageChange")}
            </div>
        `}filterGroups(e){const t=document.querySelectorAll("#groups-table tbody tr"),s=e.toLowerCase();t.forEach(o=>{const a=o.textContent.toLowerCase();o.style.display=a.includes(s)?"":"none"})}handlePageChange(e){this.paginator.goToPage(e),this.app.router.refreshCurrentPage()}handlePageSizeChange(e){this.paginator.setPageSize(e),this.app.router.refreshCurrentPage()}async refreshPage(){this.app.cacheManager.invalidate(l.GROUPS.key),await this.app.router.refreshCurrentPage()}showCreateGroup(){this.showModal(`
            <div class="modal-header">
                <h2 class="modal-title">Create PIM Group</h2>
                <button class="modal-close" onclick="app.closeModal()" title="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="create-group-form">
                    <label class="form-label">
                        Display Name*
                        <input type="text" name="displayName" class="input" required maxlength="256"
                               placeholder="e.g., PIM-Global-Administrators">
                    </label>

                    <label class="form-label">
                        Description
                        <textarea name="description" class="input" rows="3" maxlength="1024"
                                  placeholder="Purpose and scope of this group..."></textarea>
                    </label>

                    <label class="form-label">
                        Mail Nickname*
                        <input type="text" name="mailNickname" class="input" required
                               placeholder="e.g., pim-global-admins"
                               pattern="[a-zA-Z0-9-]+"
                               title="Only letters, numbers, and hyphens allowed">
                        <small class="form-hint">Used for group email address (no spaces)</small>
                    </label>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="app.closeModal()">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-plus"></i> Create Group
                        </button>
                    </div>
                </form>
            </div>
        `),document.getElementById("create-group-form").addEventListener("submit",async t=>{t.preventDefault(),await this.handleCreateGroup(t.target)})}async handleCreateGroup(e){const t=new FormData(e),s=t.get("displayName").trim(),o=t.get("description").trim(),a=t.get("mailNickname").trim();this.closeModal(),this.showLoading("Creating group...");const i=await r.createPIMGroup(s,o,a);this.hideLoading(),i.success?(this.showToast("Group created successfully","success"),this.refreshPage()):this.showToast(`Failed to create group: ${i.error}`,"error")}async deleteGroup(e){const s=(this.getCached(l.GROUPS.key)||[]).find(a=>a.id===e);if(!s){this.showToast("Group not found","error");return}const o=n.renderConfirmDialog({title:"Delete PIM Group",message:`Are you sure you want to delete "${s.displayName}"? This action cannot be undone.`,confirmLabel:"Delete Group",confirmVariant:"btn-danger",icon:"fa-trash",iconColor:"error",onConfirm:`app.pages.groups.confirmDeleteGroup('${e}')`});this.showModal(o)}async confirmDeleteGroup(e){this.closeModal(),this.showLoading("Deleting group...");const t=await r.deleteGroup(e);this.hideLoading(),t.success?(this.showToast("Group deleted successfully","success"),this.refreshPage()):this.showToast(`Failed to delete: ${t.error}`,"error")}async manageGroup(e){const s=(this.getCached(l.GROUPS.key)||[]).find(u=>u.id===e);if(!s){this.showToast("Group not found","error");return}this.showLoading("Loading group details...");const[o,a]=await Promise.all([r.getGroupMembers(e),r.getGroupOwners(e)]);this.hideLoading();const i=o.success?o.members:[],c=a.success?a.owners:[],d=`
            <div class="modal-header">
                <h2 class="modal-title">Manage Group: ${this.escapeHtml(s.displayName)}</h2>
                <button class="modal-close" onclick="app.closeModal()" title="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body modal-lg">
                <div class="tabs">
                    <button class="tab-btn active" onclick="app.pages.groups.switchTab('members')">
                        Members (${i.length})
                    </button>
                    <button class="tab-btn" onclick="app.pages.groups.switchTab('owners')">
                        Owners (${c.length})
                    </button>
                </div>

                <div id="tab-members" class="tab-content active">
                    <div class="tab-header">
                        <button class="btn btn-sm btn-primary" onclick="app.pages.groups.addMember('${e}')">
                            <i class="fas fa-plus"></i> Add Member
                        </button>
                    </div>
                    ${this.renderMembersList(i,e,"member")}
                </div>

                <div id="tab-owners" class="tab-content" style="display: none;">
                    <div class="tab-header">
                        <button class="btn btn-sm btn-primary" onclick="app.pages.groups.addOwner('${e}')">
                            <i class="fas fa-plus"></i> Add Owner
                        </button>
                    </div>
                    ${this.renderMembersList(c,e,"owner")}
                </div>
            </div>
        `;this.showModal(d)}renderMembersList(e,t,s){return e.length===0?`<p class="empty-state">No ${s}s</p>`:`
            <ul class="member-list">
                ${e.map(o=>`
                    <li class="member-item">
                        <div class="member-info">
                            <strong>${this.escapeHtml(o.displayName||o.userPrincipalName)}</strong>
                            <small>${this.escapeHtml(o.userPrincipalName||o.mail||"")}</small>
                        </div>
                        <button class="btn btn-sm btn-danger"
                                onclick="app.pages.groups.removeMember('${t}', '${o.id}', '${s}', '${this.escapeHtml(o.displayName||o.userPrincipalName)}')"
                                aria-label="Remove ${s}">
                            <i class="fas fa-times"></i> Remove
                        </button>
                    </li>
                `).join("")}
            </ul>
        `}switchTab(e){document.querySelectorAll(".tab-btn").forEach(s=>s.classList.remove("active")),document.querySelectorAll(".tab-content").forEach(s=>{s.style.display="none",s.classList.remove("active")}),document.querySelector(`.tab-btn[onclick*="${e}"]`)?.classList.add("active");const t=document.getElementById(`tab-${e}`);t&&(t.style.display="block",t.classList.add("active"))}async addMember(e){this.showToast("Add member functionality - coming soon","info")}async addOwner(e){this.showToast("Add owner functionality - coming soon","info")}removeMember(e,t,s,o="this user"){const a=n.renderConfirmDialog({title:`Remove ${s.charAt(0).toUpperCase()+s.slice(1)}`,message:`Are you sure you want to remove "${o}" as a ${s}? They will lose access to this group's roles.`,confirmLabel:`Remove ${s.charAt(0).toUpperCase()+s.slice(1)}`,confirmVariant:"btn-danger",icon:"fa-user-minus",iconColor:"warning",onConfirm:`app.pages.groups.confirmRemoveMember('${e}', '${t}', '${s}')`});this.showModal(a)}async confirmRemoveMember(e,t,s){this.closeModal(),this.showLoading(`Removing ${s}...`);const o=s==="member"?await r.removeGroupMember(e,t):await r.removeGroupOwner(e,t);this.hideLoading(),o.success?(this.showToast(`${s.charAt(0).toUpperCase()+s.slice(1)} removed successfully`,"success"),this.manageGroup(e)):this.showToast(`Failed to remove ${s}: ${o.error}`,"error")}toggleItem(e){this.bulkOps.toggleItem(e)}toggleAll(e){e.checked?this.bulkOps.selectAll():this.bulkOps.clearSelection()}bulkDeleteGroups(){const e=this.bulkOps.getSelectedItems();if(e.length===0){this.showToast("No groups selected","warning");return}const t=n.renderConfirmDialog({title:"Delete Multiple Groups",message:`You are about to delete ${e.length} group${e.length===1?"":"s"}. This action cannot be undone. Are you sure?`,confirmLabel:`Delete ${e.length} Group${e.length===1?"":"s"}`,confirmVariant:"btn-danger",icon:"fa-trash",iconColor:"error",onConfirm:"app.pages.groups.confirmBulkDeleteGroups()"});this.showModal(t)}async confirmBulkDeleteGroups(){this.closeModal();const e=this.bulkOps.getSelectedItems();this.showModal(p({current:0,total:e.length,percentage:0})),await m(e,async t=>{const s=await r.deleteGroup(t.id);if(!s.success)throw new Error(s.error)},t=>{const s=document.querySelector(".modal-body");s&&(s.innerHTML=p(t))},t=>{this.showModal(g(t)),t.succeeded>0&&this.refreshPage(),this.bulkOps.clearSelection()})}bulkExportGroups(){const e=this.bulkOps.getSelectedItems();if(e.length===0){this.showToast("No groups selected","warning");return}this.app.exportUtils.exportGroups(e),this.showToast(`Exported ${e.length} group${e.length===1?"":"s"}`,"success")}}export{$ as G};
//# sourceMappingURL=page-groupspage-CcLYulAn.js.map
