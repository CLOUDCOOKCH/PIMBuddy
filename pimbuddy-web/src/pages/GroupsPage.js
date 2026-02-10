/**
 * Groups Page
 * Manage PIM-enabled security groups
 */

import { BasePage } from '../core/PageRouter.js';
import { graphService } from '../services/graphService.js';
import { CACHE_KEYS } from '../core/CacheManager.js';
import UIComponents from '../utils/uiComponents.js';
import { executeBulkOperation, renderBulkProgressModal, renderBulkResultsModal } from '../utils/bulkOperations.js';

export class GroupsPage extends BasePage {
    constructor(app) {
        super(app);
        this.paginator = app.paginators.groups;
        this.bulkOps = app.bulkOps.groups;
    }

    /**
     * Render Groups page
     * @param {HTMLElement} container - Page container
     * @param {Object} params - Optional parameters
     */
    async render(container, params = {}) {
        let allGroups = [];

        if (this.isConnected()) {
            this.showLoading('Loading groups...');

            // Try cache first
            allGroups = this.getCached(CACHE_KEYS.GROUPS.key);

            if (!allGroups) {
                const result = await graphService.getPIMGroups();
                if (result.success) {
                    allGroups = result.groups;
                    this.setCached(CACHE_KEYS.GROUPS.key, allGroups);
                } else {
                    this.showToast(`Failed to load groups: ${result.error}`, 'error');
                }
            }

            this.hideLoading();
        }

        allGroups = allGroups || [];

        // Initialize bulk operations with all groups
        this.bulkOps.initialize(allGroups, () => {
            this.app.router.refreshCurrentPage();
        });

        // Update paginator with all groups
        this.paginator.updateItems(allGroups);

        // Get current page items
        const groups = this.paginator.getCurrentPageItems();

        container.innerHTML = `
            <div class="page-header-row">
                <h1 class="page-header">PIM Groups</h1>
                <button class="btn btn-primary" onclick="app.pages.groups.showCreateGroup()" ${!this.isConnected() ? 'disabled' : ''}>
                    <i class="fas fa-plus"></i> Create Group
                </button>
            </div>

            <div class="toolbar">
                <input type="text" id="group-search" class="input" placeholder="Search groups..." oninput="app.pages.groups.filterGroups(this.value)">
                <button class="btn btn-secondary" onclick="app.exportUtils.showExportMenu('groups')" ${!this.isConnected() || allGroups.length === 0 ? 'disabled' : ''}>
                    <i class="fas fa-file-export"></i> Export
                </button>
                <button class="btn btn-secondary" onclick="app.pages.groups.refreshPage()" ${!this.isConnected() ? 'disabled' : ''}>
                    <i class="fas fa-sync"></i> Refresh
                </button>
            </div>

            ${this.bulkOps.renderBulkActionsToolbar([
                {
                    label: 'Delete',
                    icon: 'fa-trash',
                    variant: 'btn-danger',
                    onClick: 'app.pages.groups.bulkDeleteGroups()',
                    description: 'Delete selected groups'
                },
                {
                    label: 'Export',
                    icon: 'fa-file-export',
                    variant: 'btn-secondary',
                    onClick: 'app.pages.groups.bulkExportGroups()',
                    description: 'Export selected groups'
                }
            ])}

            <div class="card">
                <table class="data-table" id="groups-table">
                    <thead>
                        <tr>
                            <th style="width: 40px;">
                                ${this.bulkOps.renderHeaderCheckbox('app.pages.groups.toggleAll')}
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
                        ${groups.length > 0 ? groups.map(g => `
                            <tr data-id="${g.id}">
                                <td>
                                    ${this.bulkOps.renderRowCheckbox(g.id, 'app.pages.groups.toggleItem')}
                                </td>
                                <td><strong>${this.escapeHtml(g.displayName)}</strong></td>
                                <td>${this.escapeHtml(g.description || '-')}</td>
                                <td>${g.memberCount || 0}</td>
                                <td>${g.ownerCount || 0}</td>
                                <td>${g.createdDateTime ? new Date(g.createdDateTime).toLocaleDateString() : '-'}</td>
                                <td>
                                    <button class="icon-btn" onclick="app.pages.groups.manageGroup('${g.id}')" title="Manage" aria-label="Manage group ${this.escapeHtml(g.displayName)}">
                                        <i class="fas fa-cog" aria-hidden="true"></i>
                                    </button>
                                    <button class="icon-btn danger" onclick="app.pages.groups.deleteGroup('${g.id}')" title="Delete" aria-label="Delete group ${this.escapeHtml(g.displayName)}">
                                        <i class="fas fa-trash" aria-hidden="true"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('') : `
                            <tr>
                                <td colspan="7" class="empty-state">
                                    ${this.isConnected() ? 'No PIM groups found' : 'Connect to view groups'}
                                </td>
                            </tr>
                        `}
                    </tbody>
                </table>

                ${this.paginator.renderControls('app.pages.groups.handlePageChange')}
            </div>
        `;
    }

    /**
     * Filter groups by search query
     * @param {string} query - Search query
     */
    filterGroups(query) {
        const rows = document.querySelectorAll('#groups-table tbody tr');
        const q = query.toLowerCase();

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(q) ? '' : 'none';
        });
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
        this.app.cacheManager.invalidate(CACHE_KEYS.GROUPS.key);
        await this.app.router.refreshCurrentPage();
    }

    /**
     * Show create group dialog
     */
    showCreateGroup() {
        const content = `
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
        `;

        this.showModal(content);

        // Handle form submission
        document.getElementById('create-group-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleCreateGroup(e.target);
        });
    }

    /**
     * Handle create group form submission
     * @param {HTMLFormElement} form - Form element
     */
    async handleCreateGroup(form) {
        const formData = new FormData(form);
        const displayName = formData.get('displayName').trim();
        const description = formData.get('description').trim();
        const mailNickname = formData.get('mailNickname').trim();

        this.closeModal();
        this.showLoading('Creating group...');

        const result = await graphService.createPIMGroup(displayName, description, mailNickname);

        this.hideLoading();

        if (result.success) {
            this.showToast('Group created successfully', 'success');
            this.refreshPage();
        } else {
            this.showToast(`Failed to create group: ${result.error}`, 'error');
        }
    }

    /**
     * Delete group with confirmation
     * @param {string} groupId - Group ID
     */
    async deleteGroup(groupId) {
        const allGroups = this.getCached(CACHE_KEYS.GROUPS.key) || [];
        const group = allGroups.find(g => g.id === groupId);

        if (!group) {
            this.showToast('Group not found', 'error');
            return;
        }

        const confirmDialog = UIComponents.renderConfirmDialog({
            title: 'Delete PIM Group',
            message: `Are you sure you want to delete "${group.displayName}"? This action cannot be undone.`,
            confirmLabel: 'Delete Group',
            confirmVariant: 'btn-danger',
            icon: 'fa-trash',
            iconColor: 'error',
            onConfirm: `app.pages.groups.confirmDeleteGroup('${groupId}')`
        });

        this.showModal(confirmDialog);
    }

    /**
     * Confirm delete group
     * @param {string} groupId - Group ID
     */
    async confirmDeleteGroup(groupId) {
        this.closeModal();
        this.showLoading('Deleting group...');

        const result = await graphService.deleteGroup(groupId);

        this.hideLoading();

        if (result.success) {
            this.showToast('Group deleted successfully', 'success');
            this.refreshPage();
        } else {
            this.showToast(`Failed to delete: ${result.error}`, 'error');
        }
    }

    /**
     * Manage group (members, owners, policies)
     * @param {string} groupId - Group ID
     */
    async manageGroup(groupId) {
        const allGroups = this.getCached(CACHE_KEYS.GROUPS.key) || [];
        const group = allGroups.find(g => g.id === groupId);

        if (!group) {
            this.showToast('Group not found', 'error');
            return;
        }

        this.showLoading('Loading group details...');

        // Fetch members and owners
        const [membersResult, ownersResult] = await Promise.all([
            graphService.getGroupMembers(groupId),
            graphService.getGroupOwners(groupId)
        ]);

        this.hideLoading();

        const members = membersResult.success ? membersResult.members : [];
        const owners = ownersResult.success ? ownersResult.owners : [];

        const content = `
            <div class="modal-header">
                <h2 class="modal-title">Manage Group: ${this.escapeHtml(group.displayName)}</h2>
                <button class="modal-close" onclick="app.closeModal()" title="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body modal-lg">
                <div class="tabs">
                    <button class="tab-btn active" onclick="app.pages.groups.switchTab('members')">
                        Members (${members.length})
                    </button>
                    <button class="tab-btn" onclick="app.pages.groups.switchTab('owners')">
                        Owners (${owners.length})
                    </button>
                </div>

                <div id="tab-members" class="tab-content active">
                    <div class="tab-header">
                        <button class="btn btn-sm btn-primary" onclick="app.pages.groups.addMember('${groupId}')">
                            <i class="fas fa-plus"></i> Add Member
                        </button>
                    </div>
                    ${this.renderMembersList(members, groupId, 'member')}
                </div>

                <div id="tab-owners" class="tab-content" style="display: none;">
                    <div class="tab-header">
                        <button class="btn btn-sm btn-primary" onclick="app.pages.groups.addOwner('${groupId}')">
                            <i class="fas fa-plus"></i> Add Owner
                        </button>
                    </div>
                    ${this.renderMembersList(owners, groupId, 'owner')}
                </div>
            </div>
        `;

        this.showModal(content);
    }

    /**
     * Render members/owners list
     * @param {Array} members - List of members
     * @param {string} groupId - Group ID
     * @param {string} type - 'member' or 'owner'
     * @returns {string} HTML
     */
    renderMembersList(members, groupId, type) {
        if (members.length === 0) {
            return `<p class="empty-state">No ${type}s</p>`;
        }

        return `
            <ul class="member-list">
                ${members.map(m => `
                    <li class="member-item">
                        <div class="member-info">
                            <strong>${this.escapeHtml(m.displayName || m.userPrincipalName)}</strong>
                            <small>${this.escapeHtml(m.userPrincipalName || m.mail || '')}</small>
                        </div>
                        <button class="btn btn-sm btn-danger"
                                onclick="app.pages.groups.removeMember('${groupId}', '${m.id}', '${type}', '${this.escapeHtml(m.displayName || m.userPrincipalName)}')"
                                aria-label="Remove ${type}">
                            <i class="fas fa-times"></i> Remove
                        </button>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    /**
     * Switch between tabs in manage group modal
     * @param {string} tabName - Tab name
     */
    switchTab(tabName) {
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
     * Add member to group
     * @param {string} groupId - Group ID
     */
    async addMember(groupId) {
        // Implementation would show user search dialog
        this.showToast('Add member functionality - coming soon', 'info');
    }

    /**
     * Add owner to group
     * @param {string} groupId - Group ID
     */
    async addOwner(groupId) {
        // Implementation would show user search dialog
        this.showToast('Add owner functionality - coming soon', 'info');
    }

    /**
     * Remove member/owner from group
     * @param {string} groupId - Group ID
     * @param {string} memberId - Member ID
     * @param {string} type - 'member' or 'owner'
     */
    removeMember(groupId, memberId, type, displayName = 'this user') {
        // Show confirmation dialog
        const confirmDialog = UIComponents.renderConfirmDialog({
            title: `Remove ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            message: `Are you sure you want to remove "${displayName}" as a ${type}? They will lose access to this group's roles.`,
            confirmLabel: `Remove ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            confirmVariant: 'btn-danger',
            icon: 'fa-user-minus',
            iconColor: 'warning',
            onConfirm: `app.pages.groups.confirmRemoveMember('${groupId}', '${memberId}', '${type}')`
        });

        this.showModal(confirmDialog);
    }

    async confirmRemoveMember(groupId, memberId, type) {
        this.closeModal();
        this.showLoading(`Removing ${type}...`);

        const result = type === 'member'
            ? await graphService.removeGroupMember(groupId, memberId)
            : await graphService.removeGroupOwner(groupId, memberId);

        this.hideLoading();

        if (result.success) {
            this.showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} removed successfully`, 'success');
            // Refresh modal
            this.manageGroup(groupId);
        } else {
            this.showToast(`Failed to remove ${type}: ${result.error}`, 'error');
        }
    }

    /**
     * Toggle item selection (for bulk operations)
     * @param {string} itemId - Item ID
     */
    toggleItem(itemId) {
        this.bulkOps.toggleItem(itemId);
    }

    /**
     * Toggle all items selection (for bulk operations)
     * @param {HTMLInputElement} checkbox - Header checkbox element
     */
    toggleAll(checkbox) {
        if (checkbox.checked) {
            this.bulkOps.selectAll();
        } else {
            this.bulkOps.clearSelection();
        }
    }

    /**
     * Bulk delete groups
     */
    bulkDeleteGroups() {
        const selected = this.bulkOps.getSelectedItems();

        if (selected.length === 0) {
            this.showToast('No groups selected', 'warning');
            return;
        }

        const confirmDialog = UIComponents.renderConfirmDialog({
            title: 'Delete Multiple Groups',
            message: `You are about to delete ${selected.length} group${selected.length === 1 ? '' : 's'}. This action cannot be undone. Are you sure?`,
            confirmLabel: `Delete ${selected.length} Group${selected.length === 1 ? '' : 's'}`,
            confirmVariant: 'btn-danger',
            icon: 'fa-trash',
            iconColor: 'error',
            onConfirm: 'app.pages.groups.confirmBulkDeleteGroups()'
        });

        this.showModal(confirmDialog);
    }

    /**
     * Confirm bulk delete groups
     */
    async confirmBulkDeleteGroups() {
        this.closeModal();

        const selected = this.bulkOps.getSelectedItems();

        // Show progress modal
        this.showModal(renderBulkProgressModal({
            current: 0,
            total: selected.length,
            percentage: 0
        }));

        // Execute bulk operation
        await executeBulkOperation(
            selected,
            async (group) => {
                const result = await graphService.deleteGroup(group.id);
                if (!result.success) {
                    throw new Error(result.error);
                }
            },
            (progress) => {
                // Update progress modal
                const modalBody = document.querySelector('.modal-body');
                if (modalBody) {
                    modalBody.innerHTML = renderBulkProgressModal(progress);
                }
            },
            (results) => {
                // Show results modal
                this.showModal(renderBulkResultsModal(results));

                // Refresh page and clear selection
                if (results.succeeded > 0) {
                    this.refreshPage();
                }
                this.bulkOps.clearSelection();
            }
        );
    }

    /**
     * Bulk export groups
     */
    bulkExportGroups() {
        const selected = this.bulkOps.getSelectedItems();

        if (selected.length === 0) {
            this.showToast('No groups selected', 'warning');
            return;
        }

        // Use the existing export functionality but with selected items only
        this.app.exportUtils.exportGroups(selected);
        this.showToast(`Exported ${selected.length} group${selected.length === 1 ? '' : 's'}`, 'success');
    }
}
