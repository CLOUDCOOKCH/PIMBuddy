/**
 * Baseline Deployment Page
 * Wizard for deploying PIM baseline configurations
 */

import { BasePage } from '../core/PageRouter.js';
import { graphService } from '../services/graphService.js';
import { baselineService } from '../services/baselineService.js';

export class BaselinePage extends BasePage {
    constructor(app) {
        super(app);
        this.baselineState = {
            selectedBaseline: null,
            selectedTiers: [],
            validationResults: null,
            deploymentPlan: null,
            groupUsers: {},
            groupCustomizations: {}
        };
    }

    /**
     * Render Baseline Deployment page
     * @param {HTMLElement} container - Page container
     * @param {Object} params - Optional parameters
     */
    async render(container, params = {}) {
        const baselines = baselineService.getBaselineConfigurations();

        container.innerHTML = `
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
                        ${Object.entries(baselines).map(([key, baseline]) => `
                            <div class="card baseline-card" data-baseline="${key}">
                                <div class="baseline-header">
                                    <i class="fas ${baseline.icon} baseline-icon"></i>
                                    <h3>${baseline.name}</h3>
                                </div>
                                <p class="baseline-desc">${baseline.description}</p>

                                <div class="baseline-features">
                                    <h4>Key Features:</h4>
                                    <ul>
                                        ${baseline.features.map(f => `<li><i class="fas fa-check-circle"></i> ${f}</li>`).join('')}
                                    </ul>
                                </div>

                                <div class="baseline-stats">
                                    <span class="stat-badge"><i class="fas fa-layer-group"></i> ${baseline.tiers.length} Tiers</span>
                                    <span class="stat-badge"><i class="fas fa-users"></i> ${baseline.tiers.reduce((sum, t) => sum + t.groups.length, 0)} Groups</span>
                                </div>

                                <button class="btn btn-primary btn-block" onclick="app.pages.baseline.selectBaseline('${key}')" ${!this.isConnected() ? 'disabled' : ''} aria-label="Select ${baseline.name} baseline">
                                    <i class="fas fa-arrow-right"></i> Select This Baseline
                                </button>
                            </div>
                        `).join('')}
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
        `;

        // Reset state
        this.baselineState = {
            selectedBaseline: null,
            selectedTiers: [],
            validationResults: null,
            deploymentPlan: null,
            groupUsers: {},
            groupCustomizations: {}
        };
    }

    /**
     * Select a baseline and populate tier configuration
     */
    selectBaseline(baselineKey) {
        const baseline = baselineService.getBaseline(baselineKey);
        this.baselineState.selectedBaseline = baselineKey;

        // Populate tier configuration
        const tierConfigDiv = document.getElementById('baseline-tier-config');
        tierConfigDiv.innerHTML = `
            <div class="card">
                <h3><i class="fas fa-info-circle"></i> Selected: ${baseline.name}</h3>
                <p>${baseline.description}</p>
            </div>

            <div class="tiers-list">
                ${baseline.tiers.map((tier, index) => `
                    <div class="card tier-card">
                        <div class="tier-header">
                            <label class="checkbox-label tier-checkbox">
                                <input type="checkbox" class="tier-select" data-tier="${index}" checked>
                                <h3>
                                    ${tier.tier === 0 ? '💀' : tier.tier === 1 ? '⚠️' : '🔵'}
                                    ${tier.name}
                                </h3>
                            </label>
                        </div>

                        <div class="tier-policy-summary">
                            <h4>Policy Configuration:</h4>
                            <div class="policy-grid">
                                <div class="policy-item">
                                    <i class="fas fa-clock"></i>
                                    <span>Max Duration: ${tier.policy.maximumDurationHours}h</span>
                                </div>
                                <div class="policy-item">
                                    <i class="fas fa-shield-alt"></i>
                                    <span>MFA: ${tier.policy.requireMfa ? 'Required' : 'Optional'}</span>
                                </div>
                                <div class="policy-item">
                                    <i class="fas fa-clipboard-check"></i>
                                    <span>Approval: ${tier.policy.requireApproval ? 'Required' : 'Not Required'}</span>
                                </div>
                                <div class="policy-item">
                                    <i class="fas fa-comment-dots"></i>
                                    <span>Justification: ${tier.policy.requireJustification ? 'Required' : 'Optional'}</span>
                                </div>
                            </div>
                        </div>

                        <div class="tier-groups">
                            <h4>Groups to Create (${tier.groups.length}):</h4>
                            <p class="form-hint"><i class="fas fa-info-circle"></i> Click the arrow (▼) on each group to customize name and add users</p>
                            <div class="groups-list">
                                ${tier.groups.map((group, gIndex) => `
                                    <div class="group-item baseline-group-item" data-tier="${index}" data-group-index="${gIndex}">
                                        <div class="group-item-header">
                                            <label class="checkbox-label">
                                                <input type="checkbox" class="group-select" data-tier="${index}" data-group="${group.name}" checked>
                                                <div class="group-info-compact">
                                                    <i class="fas fa-users"></i>
                                                    <span>${group.name}</span>
                                                </div>
                                            </label>
                                            <button class="btn btn-sm btn-secondary" onclick="app.pages.baseline.toggleGroupDetails(${index}, ${gIndex})" aria-label="Toggle group details">
                                                <i class="fas fa-chevron-down"></i>
                                            </button>
                                        </div>

                                        <div class="group-item-details" id="group-details-${index}-${gIndex}">
                                            <div class="form-group">
                                                <label>Group Name</label>
                                                <input type="text" class="input group-name-input"
                                                    data-tier="${index}"
                                                    data-group-index="${gIndex}"
                                                    data-original="${group.name}"
                                                    value="${group.name}"
                                                    aria-label="Group name">
                                                <small class="form-hint">Customize the group name (must be unique)</small>
                                            </div>

                                            <div class="form-group">
                                                <label>Description</label>
                                                <textarea class="input group-desc-input"
                                                    data-tier="${index}"
                                                    data-group-index="${gIndex}"
                                                    rows="2"
                                                    aria-label="Group description">${group.description}</textarea>
                                            </div>

                                            <div class="form-group">
                                                <label>Assigned Roles</label>
                                                <div class="group-roles-list">
                                                    <i class="fas fa-user-shield"></i>
                                                    ${group.roles.length} role${group.roles.length !== 1 ? 's' : ''}
                                                </div>
                                            </div>

                                            <div class="form-group">
                                                <label>Assignment Type</label>
                                                <div class="assignment-type-toggle">
                                                    <label class="toggle-option ${!group.isActive ? 'active' : ''}" data-tier="${index}" data-group-index="${gIndex}" data-type="eligible">
                                                        <input type="radio" name="assignment-type-${index}-${gIndex}" value="eligible" checked>
                                                        <div class="toggle-content">
                                                            <i class="fas fa-clock"></i>
                                                            <span>Eligible</span>
                                                            <small>Users activate when needed</small>
                                                        </div>
                                                    </label>
                                                    <label class="toggle-option ${group.isActive ? 'active' : ''}" data-tier="${index}" data-group-index="${gIndex}" data-type="active">
                                                        <input type="radio" name="assignment-type-${index}-${gIndex}" value="active">
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
                                                        data-tier="${index}"
                                                        data-group-index="${gIndex}"
                                                        placeholder="Search users by name or email..."
                                                        aria-label="Search users">
                                                    <div class="user-search-results" id="user-search-results-${index}-${gIndex}"></div>
                                                </div>
                                                <div class="selected-users-list" id="selected-users-${index}-${gIndex}">
                                                    <small class="form-hint">No users added yet. Search above to add users.</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Navigate to step 2
        this.goToStep(2);

        // Initialize user selections storage
        this.baselineState.groupUsers = {};
        this.baselineState.groupCustomizations = {};

        // Add event listeners for tier checkboxes
        document.querySelectorAll('.tier-select').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const tierIndex = parseInt(e.target.dataset.tier);
                const groupCheckboxes = document.querySelectorAll(`.group-select[data-tier="${tierIndex}"]`);
                groupCheckboxes.forEach(gcb => {
                    gcb.checked = e.target.checked;
                    gcb.disabled = !e.target.checked;
                });
            });
        });

        // Add event listeners for assignment type toggle
        document.querySelectorAll('.toggle-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const label = e.currentTarget;
                const tierIndex = label.dataset.tier;
                const groupIndex = label.dataset.groupIndex;
                const type = label.dataset.type;

                // Update UI
                const siblingOptions = document.querySelectorAll(`.toggle-option[data-tier="${tierIndex}"][data-group-index="${groupIndex}"]`);
                siblingOptions.forEach(opt => opt.classList.remove('active'));
                label.classList.add('active');

                // Update radio button
                label.querySelector('input[type="radio"]').checked = true;

                // Store in state
                const key = `${tierIndex}-${groupIndex}`;
                if (!this.baselineState.groupCustomizations[key]) {
                    this.baselineState.groupCustomizations[key] = {};
                }
                this.baselineState.groupCustomizations[key].assignmentType = type;
            });
        });

        // Add event listeners for user search
        document.querySelectorAll('.user-search-input').forEach(input => {
            let searchTimeout;
            input.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();
                const tierIndex = e.target.dataset.tier;
                const groupIndex = e.target.dataset.groupIndex;

                if (query.length < 2) {
                    document.getElementById(`user-search-results-${tierIndex}-${groupIndex}`).innerHTML = '';
                    return;
                }

                searchTimeout = setTimeout(() => {
                    this.searchUsers(tierIndex, groupIndex, query);
                }, 300);
            });
        });
    }

    /**
     * Toggle group details visibility
     */
    toggleGroupDetails(tierIndex, groupIndex) {
        const detailsDiv = document.getElementById(`group-details-${tierIndex}-${groupIndex}`);
        const button = event.target.closest('button');
        const icon = button.querySelector('i');

        if (detailsDiv.style.display === 'none' || !detailsDiv.style.display) {
            detailsDiv.style.display = 'block';
            icon.className = 'fas fa-chevron-up';
        } else {
            detailsDiv.style.display = 'none';
            icon.className = 'fas fa-chevron-down';
        }
    }

    /**
     * Search users for baseline group
     */
    async searchUsers(tierIndex, groupIndex, query) {
        const resultsDiv = document.getElementById(`user-search-results-${tierIndex}-${groupIndex}`);
        resultsDiv.innerHTML = '<div class="search-loading"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';

        try {
            const result = await graphService.searchUsers(query);

            if (result.success && result.users.length > 0) {
                resultsDiv.innerHTML = result.users.map(user => `
                    <div class="user-search-result" onclick="app.pages.baseline.addUser(${tierIndex}, ${groupIndex}, '${user.id}', '${this.escapeHtml(user.displayName)}', '${this.escapeHtml(user.userPrincipalName)}')">
                        <div class="user-info">
                            <i class="fas fa-user"></i>
                            <div>
                                <div class="user-name">${this.escapeHtml(user.displayName)}</div>
                                <div class="user-email">${this.escapeHtml(user.userPrincipalName)}</div>
                            </div>
                        </div>
                        <i class="fas fa-plus-circle"></i>
                    </div>
                `).join('');
            } else {
                resultsDiv.innerHTML = '<div class="search-no-results">No users found</div>';
            }
        } catch (error) {
            resultsDiv.innerHTML = '<div class="search-error">Search failed</div>';
        }
    }

    /**
     * Add user to group
     */
    addUser(tierIndex, groupIndex, userId, displayName, userPrincipalName) {
        const key = `${tierIndex}-${groupIndex}`;

        // Initialize array if needed
        if (!this.baselineState.groupUsers[key]) {
            this.baselineState.groupUsers[key] = [];
        }

        // Check if user already added
        if (this.baselineState.groupUsers[key].some(u => u.id === userId)) {
            this.showToast('User already added to this group', 'info');
            return;
        }

        // Add user
        this.baselineState.groupUsers[key].push({ id: userId, displayName, userPrincipalName });

        // Update UI
        this.updateUsersList(tierIndex, groupIndex);

        // Clear search
        document.querySelector(`.user-search-input[data-tier="${tierIndex}"][data-group-index="${groupIndex}"]`).value = '';
        document.getElementById(`user-search-results-${tierIndex}-${groupIndex}`).innerHTML = '';

        this.showToast(`Added ${displayName} to group`, 'success');
    }

    /**
     * Remove user from group
     */
    removeUser(tierIndex, groupIndex, userId) {
        const key = `${tierIndex}-${groupIndex}`;

        if (this.baselineState.groupUsers[key]) {
            this.baselineState.groupUsers[key] = this.baselineState.groupUsers[key].filter(u => u.id !== userId);
            this.updateUsersList(tierIndex, groupIndex);
        }
    }

    /**
     * Update selected users list UI
     */
    updateUsersList(tierIndex, groupIndex) {
        const key = `${tierIndex}-${groupIndex}`;
        const users = this.baselineState.groupUsers[key] || [];
        const listDiv = document.getElementById(`selected-users-${tierIndex}-${groupIndex}`);

        if (users.length === 0) {
            listDiv.innerHTML = '<small class="form-hint">No users added yet. Search above to add users.</small>';
        } else {
            listDiv.innerHTML = `
                <div class="selected-users-header">
                    <strong>${users.length} user${users.length !== 1 ? 's' : ''} will be added:</strong>
                </div>
                ${users.map(user => `
                    <div class="selected-user-item">
                        <div class="user-info">
                            <i class="fas fa-user"></i>
                            <div>
                                <div class="user-name">${this.escapeHtml(user.displayName)}</div>
                                <div class="user-email">${this.escapeHtml(user.userPrincipalName)}</div>
                            </div>
                        </div>
                        <button class="btn btn-sm btn-danger" onclick="app.pages.baseline.removeUser(${tierIndex}, ${groupIndex}, '${user.id}')" aria-label="Remove user">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('')}
            `;
        }
    }

    /**
     * Validate baseline configuration
     */
    async validateConfiguration() {
        if (!this.baselineState.selectedBaseline) {
            this.showToast('No baseline selected', 'error');
            return;
        }

        this.showLoading('Validating configuration...');

        try {
            const baseline = baselineService.getBaseline(this.baselineState.selectedBaseline);

            // Collect selected tiers and groups
            const selectedConfig = {
                baseline: this.baselineState.selectedBaseline,
                tiers: []
            };

            document.querySelectorAll('.tier-select:checked').forEach(tierCb => {
                const tierIndex = parseInt(tierCb.dataset.tier);
                const tier = baseline.tiers[tierIndex];

                const selectedGroups = [];
                document.querySelectorAll(`.group-select[data-tier="${tierIndex}"]:checked`).forEach((groupCb) => {
                    const groupName = groupCb.dataset.group;
                    const groupIndex = tier.groups.findIndex(g => g.name === groupName);
                    const group = tier.groups[groupIndex];

                    if (group && groupIndex !== -1) {
                        // Get customized values
                        const nameInput = document.querySelector(`.group-name-input[data-tier="${tierIndex}"][data-group-index="${groupIndex}"]`);
                        const descInput = document.querySelector(`.group-desc-input[data-tier="${tierIndex}"][data-group-index="${groupIndex}"]`);
                        const assignmentTypeRadio = document.querySelector(`input[name="assignment-type-${tierIndex}-${groupIndex}"]:checked`);

                        const customizedGroup = {
                            ...group,
                            name: nameInput ? nameInput.value.trim() : group.name,
                            description: descInput ? descInput.value.trim() : group.description,
                            originalName: group.name,
                            assignmentType: assignmentTypeRadio ? assignmentTypeRadio.value : 'eligible'
                        };

                        // Store customizations
                        const key = `${tierIndex}-${groupIndex}`;
                        this.baselineState.groupCustomizations[key] = {
                            name: customizedGroup.name,
                            description: customizedGroup.description,
                            users: this.baselineState.groupUsers[key] || [],
                            assignmentType: customizedGroup.assignmentType
                        };

                        selectedGroups.push(customizedGroup);
                    }
                });

                if (selectedGroups.length > 0) {
                    selectedConfig.tiers.push({
                        ...tier,
                        groups: selectedGroups
                    });
                }
            });

            this.baselineState.selectedTiers = selectedConfig.tiers;

            // Validate against existing environment
            const existingGroups = await graphService.getPIMGroups();
            const existingRoles = await graphService.getRoleDefinitions();

            const validation = baselineService.validateBaseline(selectedConfig, {
                existingGroups: existingGroups.groups || [],
                existingRoles: existingRoles.roles || []
            });

            this.baselineState.validationResults = validation;

            // Calculate deployment plan
            const deploymentPlan = baselineService.calculateDeploymentPlan(selectedConfig, {
                existingGroups: existingGroups.groups || [],
                existingRoles: existingRoles.roles || []
            });

            this.baselineState.deploymentPlan = deploymentPlan;

            this.hideLoading();

            // Display validation results
            this.displayValidationResults(validation, deploymentPlan);
            this.goToStep(3);

        } catch (error) {
            this.hideLoading();
            this.showToast('Validation failed: ' + error.message, 'error');
        }
    }

    /**
     * Display validation results and deployment plan
     */
    displayValidationResults(validation, plan) {
        const resultsDiv = document.getElementById('baseline-validation-results');
        const planDiv = document.getElementById('baseline-deployment-plan');

        // Validation results
        const hasErrors = validation.errors.length > 0;
        const hasWarnings = validation.warnings.length > 0;

        resultsDiv.innerHTML = `
            <div class="card ${hasErrors ? 'validation-error' : hasWarnings ? 'validation-warning' : 'validation-success'}">
                <h3>
                    <i class="fas ${hasErrors ? 'fa-times-circle' : hasWarnings ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i>
                    Validation ${hasErrors ? 'Failed' : hasWarnings ? 'Passed with Warnings' : 'Passed'}
                </h3>

                ${validation.errors.length > 0 ? `
                    <div class="validation-section validation-errors">
                        <h4><i class="fas fa-times-circle"></i> Errors</h4>
                        <ul>
                            ${validation.errors.map(err => `<li>${this.escapeHtml(err)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${validation.warnings.length > 0 ? `
                    <div class="validation-section validation-warnings">
                        <h4><i class="fas fa-exclamation-triangle"></i> Warnings</h4>
                        <ul>
                            ${validation.warnings.map(warn => `<li>${this.escapeHtml(warn)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${!hasErrors && !hasWarnings ? `
                    <p><i class="fas fa-check"></i> Configuration is valid and ready for deployment.</p>
                ` : ''}

                ${validation.newGroups && validation.newGroups.length > 0 ? `
                    <div class="validation-summary">
                        <h4><i class="fas fa-info-circle"></i> Summary</h4>
                        <p><strong>${validation.newGroups.length} new group(s)</strong> will be created:</p>
                        <ul class="group-list-compact">
                            ${validation.newGroups.map(name => `<li><i class="fas fa-plus-circle"></i> ${this.escapeHtml(name)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${validation.existingGroups && validation.existingGroups.length > 0 ? `
                    <div class="validation-summary">
                        <p><strong>${validation.existingGroups.length} existing group(s)</strong> will be skipped:</p>
                        <ul class="group-list-compact">
                            ${validation.existingGroups.map(name => `<li><i class="fas fa-check-circle"></i> ${this.escapeHtml(name)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;

        // Deployment plan
        planDiv.innerHTML = `
            <div class="card deployment-plan-card">
                <h3><i class="fas fa-tasks"></i> Deployment Plan</h3>

                <div class="plan-summary">
                    <div class="plan-stat">
                        <span class="plan-value">${plan.groupsToCreate.length}</span>
                        <span class="plan-label">Groups to Create</span>
                    </div>
                    <div class="plan-stat">
                        <span class="plan-value">${plan.policiesToConfigure.length}</span>
                        <span class="plan-label">Policies to Configure</span>
                    </div>
                    <div class="plan-stat">
                        <span class="plan-value">${plan.roleAssignmentsToCreate.length}</span>
                        <span class="plan-label">Role Assignments</span>
                    </div>
                    <div class="plan-stat">
                        <span class="plan-value">${plan.estimatedTime}</span>
                        <span class="plan-label">Est. Time</span>
                    </div>
                </div>

                <div class="plan-details">
                    <h4>Deployment Steps:</h4>
                    <ol class="deployment-steps-list">
                        ${plan.steps.map(step => `
                            <li>
                                <i class="fas ${step.icon}"></i>
                                <strong>${this.escapeHtml(step.title)}</strong>
                                <p>${this.escapeHtml(step.description)}</p>
                            </li>
                        `).join('')}
                    </ol>
                </div>

                <div class="plan-groups-preview">
                    <h4>Groups to be created:</h4>
                    <div class="groups-preview-list">
                        ${plan.groupsToCreate.map(group => `
                            <div class="group-preview-item">
                                <i class="fas fa-users"></i>
                                <div>
                                    <strong>${this.escapeHtml(group.displayName)}</strong>
                                    <p>${this.escapeHtml(group.description)}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Enable/disable deploy button based on validation
        const deployBtn = document.getElementById('deploy-baseline-btn');
        if (deployBtn) {
            deployBtn.disabled = hasErrors;
        }
    }

    /**
     * Execute baseline deployment
     */
    async executeDeployment() {
        if (!this.baselineState.deploymentPlan) {
            this.showToast('No deployment plan available', 'error');
            return;
        }

        const confirmed = confirm(
            `This will create ${this.baselineState.deploymentPlan.groupsToCreate.length} groups and configure their policies.\n\n` +
            'This action cannot be undone automatically. Continue?'
        );

        if (!confirmed) return;

        this.goToStep(4);

        const progressDiv = document.getElementById('baseline-deployment-progress');
        const plan = this.baselineState.deploymentPlan;

        // Calculate total steps
        const totalRoleAssignments = plan.groupsToCreate.reduce((sum, g) => sum + (g.roles?.length || 0), 0);
        const totalSteps = plan.groupsToCreate.length + totalRoleAssignments + totalRoleAssignments;
        let completedSteps = 0;

        const updateProgress = (message, isError = false) => {
            completedSteps++;
            const percentage = Math.round((completedSteps / totalSteps) * 100);

            const logEntry = document.createElement('div');
            logEntry.className = `deployment-log-entry ${isError ? 'log-error' : 'log-success'}`;
            logEntry.innerHTML = `
                <i class="fas ${isError ? 'fa-times-circle' : 'fa-check-circle'}"></i>
                <span>${message}</span>
            `;

            const logContainer = progressDiv.querySelector('.deployment-log') || (() => {
                const container = document.createElement('div');
                container.className = 'deployment-log';
                progressDiv.appendChild(container);
                return container;
            })();

            logContainer.appendChild(logEntry);
            logContainer.scrollTop = logContainer.scrollHeight;

            // Update progress bar
            const progressBar = progressDiv.querySelector('.progress-bar-fill');
            if (progressBar) {
                progressBar.style.width = `${percentage}%`;
                progressBar.textContent = `${percentage}%`;
            }
        };

        progressDiv.innerHTML = `
            <div class="card">
                <h3><i class="fas fa-spinner fa-spin"></i> Deploying Baseline Configuration</h3>
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: 0%">0%</div>
                </div>
                <div class="deployment-log"></div>
            </div>
        `;

        try {
            // Fetch all roles for display names
            updateProgress('Fetching role information...');
            const rolesResult = await graphService.getRoleDefinitions();
            const rolesMap = new Map();
            if (rolesResult.success) {
                rolesResult.roles.forEach(role => {
                    rolesMap.set(role.id, role.displayName);
                });
            }

            // Step 1: Create groups
            updateProgress('Starting group creation...');
            const createdGroups = [];

            for (const groupConfig of plan.groupsToCreate) {
                try {
                    const result = await graphService.createPIMGroup(
                        groupConfig.displayName,
                        groupConfig.description,
                        groupConfig.mailNickname
                    );
                    if (result.success) {
                        createdGroups.push({ config: groupConfig, group: result.group });
                        updateProgress(`✓ Created group: ${groupConfig.displayName}`);
                    } else {
                        updateProgress(`✗ Failed to create group: ${groupConfig.displayName} - ${result.error}`, true);
                    }
                } catch (error) {
                    updateProgress(`✗ Error creating group: ${groupConfig.displayName} - ${error.message}`, true);
                }
            }

            // Step 2: Wait for groups to provision
            updateProgress('Waiting for groups to provision (30-60 seconds)...');
            await new Promise(resolve => setTimeout(resolve, 30000));

            // Step 3: Assign groups to roles
            updateProgress('Assigning groups to roles...');
            const roleAssignments = [];

            for (const createdGroup of createdGroups) {
                const roles = createdGroup.config.roles || [];

                // Find assignment type
                const customizationEntry = Object.entries(this.baselineState.groupCustomizations || {}).find(
                    ([key, value]) => value.name === createdGroup.config.displayName
                );
                const assignmentType = customizationEntry ? customizationEntry[1].assignmentType : 'eligible';

                for (const roleId of roles) {
                    try {
                        let assignResult;

                        if (assignmentType === 'active') {
                            assignResult = await graphService.createDirectoryRoleActiveAssignment(
                                createdGroup.group.id,
                                roleId,
                                `Baseline deployment (Active): ${createdGroup.config.displayName}`
                            );
                        } else {
                            assignResult = await graphService.createDirectoryRoleEligibilityAssignment(
                                createdGroup.group.id,
                                roleId,
                                `Baseline deployment (Eligible): ${createdGroup.config.displayName}`,
                                12
                            );
                        }

                        if (assignResult.success) {
                            const roleName = rolesMap.get(roleId) || roleId;
                            roleAssignments.push({
                                groupId: createdGroup.group.id,
                                groupName: createdGroup.config.displayName,
                                roleId: roleId,
                                roleName: roleName,
                                policy: createdGroup.config.policy
                            });
                            updateProgress(`✓ Assigned ${createdGroup.config.displayName} to ${roleName} (${assignmentType})`);
                        } else {
                            updateProgress(`✗ Failed to assign ${createdGroup.config.displayName}: ${assignResult.error}`, true);
                        }
                    } catch (error) {
                        updateProgress(`✗ Error assigning ${createdGroup.config.displayName}: ${error.message}`, true);
                    }
                }
            }

            // Step 4: Wait for assignments to propagate
            updateProgress('Waiting for role assignments to propagate (10 seconds)...');
            await new Promise(resolve => setTimeout(resolve, 10000));

            updateProgress(`✓ Role assignments complete. ${roleAssignments.length} groups assigned to roles.`);

            // Step 5: Configure role policies
            if (roleAssignments.length > 0) {
                updateProgress('Configuring role policies...');

                const roleConfigMap = new Map();
                roleAssignments.forEach(assignment => {
                    if (!roleConfigMap.has(assignment.roleId)) {
                        roleConfigMap.set(assignment.roleId, {
                            roleId: assignment.roleId,
                            roleName: assignment.roleName,
                            groupName: assignment.groupName,
                            policy: assignment.policy
                        });
                    }
                });

                for (const [roleId, config] of roleConfigMap) {
                    try {
                        updateProgress(`Fetching policy for ${config.roleName}...`);
                        const policiesResult = await graphService.getRolePolicy(roleId);

                        if (policiesResult.success && policiesResult.policy) {
                            let updatedCount = 0;

                            // Update expiration rule
                            try {
                                await graphService.updateRolePolicy(
                                    policiesResult.policy.id,
                                    'Expiration_EndUser_Assignment',
                                    {
                                        maximumDuration: `PT${config.policy.maximumDurationHours}H`,
                                        isExpirationRequired: true
                                    }
                                );
                                updatedCount++;
                            } catch (err) {
                                console.error('Expiration rule update failed:', err);
                            }

                            // Update enablement rule
                            try {
                                await graphService.updateRolePolicy(
                                    policiesResult.policy.id,
                                    'Enablement_EndUser_Assignment',
                                    {
                                        enabledRules: [
                                            config.policy.requireMfa ? 'MultiFactorAuthentication' : null,
                                            config.policy.requireJustification ? 'Justification' : null,
                                            config.policy.requireTicketInfo ? 'Ticketing' : null
                                        ].filter(r => r !== null)
                                    }
                                );
                                updatedCount++;
                            } catch (err) {
                                console.error('Enablement rule update failed:', err);
                            }

                            // Update approval rule
                            try {
                                await graphService.updateRolePolicy(
                                    policiesResult.policy.id,
                                    'Approval_EndUser_Assignment',
                                    {
                                        isApprovalRequired: config.policy.requireApproval
                                    }
                                );
                                updatedCount++;
                            } catch (err) {
                                console.error('Approval rule update failed:', err);
                            }

                            if (updatedCount > 0) {
                                updateProgress(`✓ Updated ${config.roleName} policy (${updatedCount}/3 rules)`);
                            } else {
                                updateProgress(`⚠ Could not update ${config.roleName} policy`, false);
                            }
                        } else {
                            const errorMsg = policiesResult.error || 'Unknown error';
                            updateProgress(`⚠ Could not fetch ${config.roleName} policy: ${errorMsg}`, false);
                        }
                    } catch (error) {
                        updateProgress(`⚠ Policy update error: ${error.message}`, false);
                    }
                }
            }

            // Step 6: Add users to groups
            const totalUsersToAdd = Object.values(this.baselineState.groupUsers || {}).reduce((sum, users) => sum + users.length, 0);

            if (totalUsersToAdd > 0) {
                updateProgress(`Adding ${totalUsersToAdd} users to groups...`);

                for (const createdGroup of createdGroups) {
                    const customizationEntry = Object.entries(this.baselineState.groupCustomizations || {}).find(
                        ([key, value]) => value.name === createdGroup.config.displayName
                    );

                    if (customizationEntry && customizationEntry[1].users && customizationEntry[1].users.length > 0) {
                        const users = customizationEntry[1].users;

                        for (const user of users) {
                            try {
                                const assignResult = await graphService.createEligibleAssignment(
                                    createdGroup.group.id,
                                    user.id,
                                    'member',
                                    null,
                                    null
                                );

                                if (assignResult.success) {
                                    updateProgress(`✓ Added ${user.displayName} to ${createdGroup.config.displayName}`);
                                } else {
                                    updateProgress(`✗ Failed to add ${user.displayName}: ${assignResult.error}`, true);
                                }
                            } catch (error) {
                                updateProgress(`✗ Error adding ${user.displayName}: ${error.message}`, true);
                            }
                        }
                    }
                }
            }

            // Complete
            updateProgress('Deployment completed!');

            progressDiv.innerHTML += `
                <div class="deployment-complete">
                    <i class="fas fa-check-circle"></i>
                    <h3>Baseline Deployed Successfully!</h3>
                    <p>Created ${createdGroups.length} groups with configured policies.</p>
                    <div class="deployment-actions">
                        <button class="btn btn-primary" onclick="app.navigateTo('groups')">
                            <i class="fas fa-users"></i> View Groups
                        </button>
                        <button class="btn btn-secondary" onclick="app.router.refreshCurrentPage()">
                            <i class="fas fa-redo"></i> Deploy Another Baseline
                        </button>
                    </div>
                </div>
            `;

            this.showToast('Baseline deployed successfully!', 'success');

        } catch (error) {
            updateProgress(`✗ Deployment failed: ${error.message}`, true);
            this.showToast('Deployment failed: ' + error.message, 'error');

            progressDiv.innerHTML += `
                <div class="deployment-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Deployment Failed</h3>
                    <p>${this.escapeHtml(error.message)}</p>
                    <button class="btn btn-secondary" onclick="app.pages.baseline.previousStep()">
                        <i class="fas fa-arrow-left"></i> Go Back
                    </button>
                </div>
            `;
        }
    }

    /**
     * Navigate to specific step
     */
    goToStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.baseline-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show target step
        const targetStep = document.getElementById(`baseline-step-${stepNumber}`);
        if (targetStep) {
            targetStep.classList.add('active');
            document.getElementById('baseline-wizard-step').dataset.step = stepNumber;
        }
    }

    /**
     * Navigate to previous step
     */
    previousStep() {
        const currentStep = parseInt(document.getElementById('baseline-wizard-step').dataset.step);
        if (currentStep > 1) {
            this.goToStep(currentStep - 1);
        }
    }

    /**
     * Refresh page data
     */
    async refreshPage() {
        await this.app.router.refreshCurrentPage();
    }
}
