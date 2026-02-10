/**
 * PIMMaid Page
 * Visualize PIM configuration as Mermaid diagrams
 */

import { BasePage } from '../core/PageRouter.js';
import { graphService } from '../services/graphService.js';
import { pimmaidService } from '../services/pimmaidService.js';

export class PimmaidPage extends BasePage {
    constructor(app) {
        super(app);
    }

    /**
     * Render PIMMaid page
     * @param {HTMLElement} container - Page container
     * @param {Object} params - Optional parameters
     */
    async render(container, params = {}) {
        const diagramTypes = pimmaidService.getDiagramTypes();

        container.innerHTML = `
            <div class="page-header-row">
                <h1 class="page-header">
                    <i class="fas fa-project-diagram"></i> PIMMaid
                </h1>
                <span class="page-subtitle">Visualize PIM as Mermaid Diagrams</span>
            </div>
            <p class="page-description">Generate visual diagrams of your PIM configuration showing relationships between users, groups, and roles.</p>

            <div class="pimmaid-layout">
                <div class="pimmaid-controls card">
                    <h3><i class="fas fa-sliders-h"></i> Diagram Options</h3>

                    <div class="form-group">
                        <label>Diagram Type</label>
                        <div class="diagram-type-grid">
                            ${Object.entries(diagramTypes).map(([key, type]) => `
                                <label class="diagram-type-option ${key === 'full-hierarchy' ? 'selected' : ''}" data-type="${key}">
                                    <input type="radio" name="diagram-type" value="${key}" ${key === 'full-hierarchy' ? 'checked' : ''}>
                                    <i class="fas ${type.icon}"></i>
                                    <span class="type-name">${type.name}</span>
                                    <span class="type-desc">${type.description}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Options</label>
                        <div class="checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="pimmaid-eligible" checked>
                                <span>Show Eligible Assignments</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="pimmaid-active" checked>
                                <span>Show Active Assignments</span>
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Direction</label>
                        <select id="pimmaid-direction" class="input">
                            <option value="LR">Left to Right</option>
                            <option value="TB">Top to Bottom</option>
                            <option value="RL">Right to Left</option>
                            <option value="BT">Bottom to Top</option>
                        </select>
                    </div>

                    <button class="btn btn-primary btn-block" onclick="app.pages.pimmaid.generateDiagram()" ${!this.isConnected() ? 'disabled' : ''} aria-label="Generate Mermaid diagram">
                        <i class="fas fa-magic"></i> Generate Diagram
                    </button>

                    <div id="pimmaid-stats" class="pimmaid-stats hidden"></div>
                </div>

                <div class="pimmaid-output card">
                    <div class="pimmaid-output-header">
                        <h3><i class="fas fa-code"></i> Mermaid Output</h3>
                        <div class="pimmaid-actions">
                            <button class="btn btn-sm btn-secondary" onclick="app.pages.pimmaid.copyCode()" id="copy-mermaid-btn" disabled aria-label="Copy Mermaid code">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                            <button class="btn btn-sm btn-secondary" onclick="app.pages.pimmaid.downloadCode()" id="download-mermaid-btn" disabled aria-label="Download Mermaid code">
                                <i class="fas fa-download"></i> Download
                            </button>
                            <button class="btn btn-sm btn-secondary" onclick="app.pages.pimmaid.openInMermaidLive()" id="live-mermaid-btn" disabled aria-label="Open in Mermaid Live Editor">
                                <i class="fas fa-external-link-alt"></i> Open in Mermaid Live
                            </button>
                        </div>
                    </div>

                    <div class="pimmaid-code-container">
                        <pre id="pimmaid-code" class="pimmaid-code">${this.isConnected() ? '// Click "Generate Diagram" to create your PIM visualization' : '// Connect to Azure AD to generate diagrams'}</pre>
                    </div>

                    <div class="pimmaid-preview-section">
                        <h4><i class="fas fa-eye"></i> Preview</h4>
                        <p class="preview-hint">Paste the code above into <a href="https://mermaid.live" target="_blank" rel="noopener noreferrer">Mermaid Live Editor</a> to see the rendered diagram.</p>
                        <div id="pimmaid-preview" class="pimmaid-preview">
                            <div class="empty-preview">
                                <i class="fas fa-project-diagram"></i>
                                <p>Diagram preview will appear here</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners for diagram type selection
        document.querySelectorAll('.diagram-type-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.diagram-type-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                option.querySelector('input').checked = true;
            });
        });
    }

    /**
     * Generate PIMMaid diagram
     */
    async generateDiagram() {
        const diagramType = document.querySelector('input[name="diagram-type"]:checked')?.value || 'full-hierarchy';
        const showEligible = document.getElementById('pimmaid-eligible').checked;
        const showActive = document.getElementById('pimmaid-active').checked;
        const direction = document.getElementById('pimmaid-direction').value;

        this.showLoading('Fetching PIM data...');

        try {
            // Fetch all necessary data
            const [groupsResult, rolesResult] = await Promise.all([
                graphService.getPIMGroups(),
                graphService.getRoleDefinitions()
            ]);

            if (!groupsResult.success || !rolesResult.success) {
                throw new Error('Failed to fetch PIM data');
            }

            const groups = groupsResult.groups;
            const roles = rolesResult.roles;

            this.showLoading('Fetching assignments...');

            // Fetch assignments based on diagram type
            let groupAssignments = {};
            let roleAssignments = {};

            if (['user-group', 'full-hierarchy'].includes(diagramType)) {
                const assignmentsResult = await graphService.getAllGroupAssignments(groups);
                groupAssignments = assignmentsResult.assignments || {};
            }

            if (['group-role', 'full-hierarchy', 'role-assignments'].includes(diagramType)) {
                const roleAssignmentsResult = await graphService.getAllRoleAssignments();
                roleAssignments = roleAssignmentsResult.assignments || {};
            }

            this.hideLoading();

            // Generate the diagram
            const data = { groups, roles, groupAssignments, roleAssignments };
            const options = { showEligible, showActive, direction };

            const mermaidCode = pimmaidService.generateDiagram(diagramType, data, options);
            const stats = pimmaidService.getStats(data);

            // Update UI
            document.getElementById('pimmaid-code').textContent = mermaidCode;
            document.getElementById('copy-mermaid-btn').disabled = false;
            document.getElementById('download-mermaid-btn').disabled = false;
            document.getElementById('live-mermaid-btn').disabled = false;

            // Show stats
            const statsDiv = document.getElementById('pimmaid-stats');
            statsDiv.innerHTML = `
                <h4><i class="fas fa-chart-bar"></i> Statistics</h4>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-value">${stats.totalUsers}</span>
                        <span class="stat-label">Users</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${stats.totalGroups}</span>
                        <span class="stat-label">Groups</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${stats.totalRoles}</span>
                        <span class="stat-label">Roles</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${stats.eligibleAssignments}</span>
                        <span class="stat-label">Eligible</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${stats.activeAssignments}</span>
                        <span class="stat-label">Active</span>
                    </div>
                </div>
                <div class="role-stats">
                    <span class="badge privilege-badge badge-critical">${stats.rolesByPrivilege.critical} Critical</span>
                    <span class="badge privilege-badge badge-high">${stats.rolesByPrivilege.high} High</span>
                    <span class="badge privilege-badge badge-medium">${stats.rolesByPrivilege.medium} Medium</span>
                    <span class="badge privilege-badge badge-low">${stats.rolesByPrivilege.low} Low</span>
                </div>
            `;
            statsDiv.classList.remove('hidden');

            // Update preview hint
            document.getElementById('pimmaid-preview').innerHTML = `
                <div class="preview-placeholder">
                    <i class="fas fa-check-circle"></i>
                    <p>Diagram generated! Copy the code or open in Mermaid Live to view.</p>
                    <p class="code-lines">${mermaidCode.split('\n').length} lines generated</p>
                </div>
            `;

            this.showToast('Diagram generated successfully', 'success');

        } catch (error) {
            this.hideLoading();
            this.showToast('Failed to generate diagram: ' + error.message, 'error');
        }
    }

    /**
     * Copy Mermaid code to clipboard
     */
    copyCode() {
        const code = document.getElementById('pimmaid-code').textContent;
        navigator.clipboard.writeText(code).then(() => {
            this.showToast('Mermaid code copied to clipboard', 'success');
        }).catch(() => {
            this.showToast('Failed to copy', 'error');
        });
    }

    /**
     * Download Mermaid code as file
     */
    downloadCode() {
        const code = document.getElementById('pimmaid-code').textContent;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pimmaid-diagram-${new Date().toISOString().split('T')[0]}.mmd`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast('Diagram downloaded', 'success');
    }

    /**
     * Open diagram in Mermaid Live Editor
     */
    openInMermaidLive() {
        const code = document.getElementById('pimmaid-code').textContent;

        // Create state object for Mermaid Live
        const stateObj = {
            code: code,
            mermaid: { theme: 'dark' }
        };
        const state = btoa(JSON.stringify(stateObj));

        window.open(`https://mermaid.live/edit#base64:${state}`, '_blank');
    }

    /**
     * Refresh page data
     */
    async refreshPage() {
        await this.app.router.refreshCurrentPage();
    }
}
