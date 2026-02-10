/**
 * Approvals Page
 * Review and authorize PIM role activation requests
 */

import { BasePage } from '../core/PageRouter.js';
import { graphService } from '../services/graphService.js';
import { CACHE_KEYS } from '../core/CacheManager.js';

export class ApprovalsPage extends BasePage {
    constructor(app) {
        super(app);
    }

    /**
     * Render Approvals page
     * @param {HTMLElement} container - Page container
     * @param {Object} params - Optional parameters
     */
    async render(container, params = {}) {
        let approvals = [];
        let count = 0;

        if (this.isConnected()) {
            this.showLoading('Loading pending approvals...');

            // Try cache first
            const cached = this.getCached(CACHE_KEYS.APPROVALS.key);

            if (cached) {
                approvals = cached.requests || [];
                count = cached.count || 0;
            } else {
                const result = await graphService.getPendingApprovals();
                if (result.success) {
                    approvals = result.requests;
                    count = result.count;
                    this.setCached(CACHE_KEYS.APPROVALS.key, { requests: approvals, count });
                } else {
                    this.showToast(`Failed to load approvals: ${result.error}`, 'error');
                }
            }

            this.hideLoading();
        }

        const formatDate = (dateStr) => {
            if (!dateStr) return 'N/A';
            const date = new Date(dateStr);
            return date.toLocaleString();
        };

        container.innerHTML = `
            <!-- Dramatic Page Header -->
            <div style="position: relative; margin-bottom: var(--space-2xl); overflow: hidden;">
                <div style="position: absolute; top: -50%; left: -5%; width: 300px; height: 300px; background: radial-gradient(circle, var(--color-warning-dim), transparent); filter: blur(80px); animation: float 12s ease-in-out infinite; pointer-events: none;"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: inline-flex; align-items: center; gap: var(--space-xs); padding: var(--space-xs) var(--space-md); background: rgba(255, 170, 0, 0.05); border: 1px solid var(--color-warning); border-radius: var(--radius-full); margin-bottom: var(--space-md); font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em;">
                        <i class="fas fa-bell" style="color: var(--color-warning); font-size: 0.7rem;"></i>
                        <span style="color: var(--color-warning); font-weight: 600;">APPROVAL QUEUE</span>
                        <span style="color: var(--text-muted);">|</span>
                        <span style="color: var(--text-secondary);">${count} PENDING</span>
                    </div>
                    <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; line-height: 1.1; margin-bottom: var(--space-sm); letter-spacing: -0.03em;">
                        <span style="background: linear-gradient(135deg, var(--color-warning), #ffdd00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 30px rgba(255, 170, 0, 0.3));">
                            PENDING
                        </span>
                        <span style="color: var(--text-primary);"> APPROVALS</span>
                    </h1>
                    <p style="font-size: 0.95rem; color: var(--text-secondary); font-family: var(--font-mono);">
                        Review and authorize privileged role activation requests
                    </p>
                </div>
            </div>

            <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid ${count > 0 ? 'var(--color-warning)' : 'var(--border-subtle)'};">
                <div style="position: absolute; top: 0; left: 0; width: 400px; height: 400px; background: radial-gradient(circle, ${count > 0 ? 'rgba(255, 170, 0, 0.05)' : 'var(--accent-primary-dim)'}, transparent); filter: blur(100px); pointer-events: none;"></div>

                <div style="position: relative; z-index: 1;">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-lg); border-bottom: 1px solid var(--border-subtle);">
                        <div style="display: flex; align-items: center; gap: var(--space-md);">
                            <div style="width: 48px; height: 48px; background: ${count > 0 ? 'var(--color-warning-dim)' : 'var(--accent-primary-dim)'}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-clock" style="color: ${count > 0 ? 'var(--color-warning)' : 'var(--accent-primary)'}; font-size: 1.3rem;"></i>
                            </div>
                            <div>
                                <h2 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                    Approval Queue
                                </h2>
                                <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                                    ${count} requests awaiting review
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-secondary btn-sm" onclick="app.pages.approvals.refreshPage()" ${!this.isConnected() ? 'disabled' : ''} style="font-family: var(--font-mono);" aria-label="Refresh approvals">
                            <i class="fas fa-sync"></i> REFRESH
                        </button>
                    </div>

                    <div style="padding: var(--space-md);">
                        ${approvals.length > 0 ? approvals.map((approval, idx) => `
                            <div style="background: rgba(255, 170, 0, 0.05); border: 1px solid var(--color-warning); border-radius: var(--radius-lg); padding: var(--space-lg); margin-bottom: var(--space-md); position: relative; overflow: hidden;" role="article" aria-label="Approval request from ${this.escapeHtml(approval.principal?.displayName || 'Unknown User')}">
                                <div style="position: absolute; top: 0; right: 0; width: 150px; height: 150px; background: radial-gradient(circle, rgba(255, 170, 0, 0.1), transparent); filter: blur(40px); pointer-events: none;"></div>
                                <div style="position: relative; z-index: 1;">
                                    <div style="display: flex; justify-content: space-between; align-items: start; gap: var(--space-lg); margin-bottom: var(--space-lg);">
                                        <div style="flex: 1;">
                                            <!-- User Info -->
                                            <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-md);">
                                                <div style="width: 36px; height: 36px; background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                                    <i class="fas fa-user" style="color: var(--accent-primary); font-size: 1rem;"></i>
                                                </div>
                                                <div>
                                                    <div style="font-weight: 700; font-size: 1.1rem; color: var(--text-primary);">
                                                        ${this.escapeHtml(approval.principal?.displayName || 'Unknown User')}
                                                    </div>
                                                    <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">
                                                        ${this.escapeHtml(approval.principal?.userPrincipalName || 'N/A')}
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Role -->
                                            <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-md); padding: var(--space-sm) var(--space-md); background: rgba(0, 255, 159, 0.05); border-left: 3px solid var(--accent-primary); border-radius: var(--radius-sm);">
                                                <i class="fas fa-shield-check" style="color: var(--accent-primary);"></i>
                                                <div>
                                                    <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 2px;">
                                                        REQUESTING ROLE
                                                    </div>
                                                    <div style="font-weight: 600; color: var(--text-primary);">
                                                        ${this.escapeHtml(approval.roleDefinition?.displayName || 'Unknown Role')}
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Justification -->
                                            <div style="background: rgba(0, 0, 0, 0.2); padding: var(--space-md); border-radius: var(--radius-sm); margin-bottom: var(--space-md);">
                                                <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: var(--space-xs);">
                                                    <i class="fas fa-comment-dots"></i> JUSTIFICATION
                                                </div>
                                                <div style="color: var(--text-secondary); line-height: 1.5; font-size: 0.9rem;">
                                                    ${this.escapeHtml(approval.justification || 'No justification provided')}
                                                </div>
                                            </div>

                                            <!-- Timestamp -->
                                            <div style="display: flex; align-items: center; gap: var(--space-xs); font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">
                                                <i class="fas fa-clock"></i>
                                                <span>Requested: ${formatDate(approval.createdDateTime)}</span>
                                            </div>
                                        </div>

                                        <!-- Action Buttons -->
                                        <div style="display: flex; flex-direction: column; gap: var(--space-sm); min-width: 140px;">
                                            <button class="btn btn-success" onclick="app.pages.approvals.reviewApproval('${approval.id}', 'approve')" style="width: 100%; font-family: var(--font-mono); font-size: 0.85rem; padding: var(--space-md);" aria-label="Approve request from ${this.escapeHtml(approval.principal?.displayName || 'Unknown User')}">
                                                <i class="fas fa-check-circle"></i> APPROVE
                                            </button>
                                            <button class="btn btn-danger" onclick="app.pages.approvals.reviewApproval('${approval.id}', 'deny')" style="width: 100%; font-family: var(--font-mono); font-size: 0.85rem; padding: var(--space-md);" aria-label="Deny request from ${this.escapeHtml(approval.principal?.displayName || 'Unknown User')}">
                                                <i class="fas fa-times-circle"></i> DENY
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('') : `
                            <div style="text-align: center; padding: var(--space-2xl) var(--space-lg); color: var(--text-secondary);">
                                <div style="width: 120px; height: 120px; margin: 0 auto var(--space-xl); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-check-double" style="font-size: 3.5rem; color: var(--accent-primary); opacity: 0.5;"></i>
                                </div>
                                <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin-bottom: var(--space-sm); color: var(--text-primary);">
                                    All Caught Up
                                </div>
                                <div style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-muted);">
                                    ${this.isConnected() ? 'No pending approval requests in the queue' : 'Connect to Microsoft Entra ID to view pending approvals'}
                                </div>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Review approval request
     * @param {string} requestId - Request ID
     * @param {string} decision - Decision (approve/deny)
     */
    async reviewApproval(requestId, decision) {
        const justification = prompt(`${decision === 'approve' ? 'Approve' : 'Deny'} this request?\n\nEnter justification:`);
        if (!justification) return;

        this.showLoading(`${decision === 'approve' ? 'Approving' : 'Denying'} request...`);
        const result = await graphService.reviewApprovalRequest(requestId, decision, justification);
        this.hideLoading();

        if (result.success) {
            this.showToast(`Request ${decision === 'approve' ? 'approved' : 'denied'} successfully`, 'success');
            this.refreshPage();
        } else {
            this.showToast(result.error, 'error');
        }
    }

    /**
     * Refresh page data
     */
    async refreshPage() {
        this.app.cacheManager.invalidate(CACHE_KEYS.APPROVALS.key);
        await this.app.router.refreshCurrentPage();
    }
}
