import{B as l}from"./core-rjX7nIO3.js";import{g as c}from"./services-DF6cB9Vv.js";class v extends l{constructor(e){super(e),this.paginator=e.paginators.activity}async render(e,f={}){let a=[];if(this.isConnected()){this.showLoading("Loading PIM activity...");const t=await c.getPIMAuditLogs(30);t.success?a=t.logs:this.showToast(`Failed to load activity: ${t.error}`,"error"),this.hideLoading()}this.paginator.updateItems(a);const r=this.paginator.getCurrentPageItems(),o=t=>t?new Date(t).toLocaleString():"N/A",n=t=>t?.includes("Add")||t?.includes("Create")?"fa-plus success":t?.includes("Remove")||t?.includes("Delete")?"fa-trash danger":t?.includes("Update")?"fa-edit warning":t?.includes("Assign")?"fa-user-check primary":"fa-circle info";e.innerHTML=`
            <!-- Dramatic Page Header -->
            <div style="position: relative; margin-bottom: var(--space-2xl); overflow: hidden;">
                <div style="position: absolute; top: -50%; right: -5%; width: 300px; height: 300px; background: radial-gradient(circle, var(--accent-secondary-dim), transparent); filter: blur(80px); animation: float 10s ease-in-out infinite; pointer-events: none;"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: inline-flex; align-items: center; gap: var(--space-xs); padding: var(--space-xs) var(--space-md); background: rgba(255, 0, 128, 0.05); border: 1px solid var(--accent-secondary); border-radius: var(--radius-full); margin-bottom: var(--space-md); font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em;">
                        <i class="fas fa-database" style="color: var(--accent-secondary); font-size: 0.7rem;"></i>
                        <span style="color: var(--accent-secondary); font-weight: 600;">AUDIT TRAIL</span>
                        <span style="color: var(--text-muted);">|</span>
                        <span style="color: var(--text-secondary);">30 DAY HISTORY</span>
                    </div>
                    <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; line-height: 1.1; margin-bottom: var(--space-sm); letter-spacing: -0.03em;">
                        <span style="background: linear-gradient(135deg, var(--accent-secondary), #ff00ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 30px rgba(255, 0, 128, 0.3));">
                            ACTIVITY
                        </span>
                        <span style="color: var(--text-primary);"> LOG</span>
                    </h1>
                    <p style="font-size: 0.95rem; color: var(--text-secondary); font-family: var(--font-mono);">
                        Complete audit trail of privileged role management events
                    </p>
                </div>
            </div>

            <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--border-subtle);">
                <div style="position: absolute; top: 0; right: 0; width: 400px; height: 400px; background: radial-gradient(circle, var(--accent-secondary-dim), transparent); filter: blur(100px); pointer-events: none;"></div>

                <div style="position: relative; z-index: 1;">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-lg); border-bottom: 1px solid var(--border-subtle);">
                        <div style="display: flex; align-items: center; gap: var(--space-md);">
                            <div style="width: 48px; height: 48px; background: var(--accent-secondary-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-history" style="color: var(--accent-secondary); font-size: 1.3rem;"></i>
                            </div>
                            <div>
                                <h2 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                    Event Stream
                                </h2>
                                <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                                    ${a.length} recorded events
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; gap: var(--space-sm);">
                            <button class="btn btn-secondary btn-sm" onclick="app.showExportMenu('activity')" ${!this.isConnected()||a.length===0?"disabled":""} style="font-family: var(--font-mono);">
                                <i class="fas fa-file-export"></i> EXPORT
                            </button>
                            <button class="btn btn-secondary btn-sm" onclick="app.pages.activity.refreshPage()" ${this.isConnected()?"":"disabled"} style="font-family: var(--font-mono);">
                                <i class="fas fa-sync"></i> REFRESH
                            </button>
                        </div>
                    </div>

                    <div style="overflow-x: auto;">
                        ${r.length>0?`
                            <table class="table" style="margin: 0;">
                                <thead>
                                    <tr style="background: rgba(0, 0, 0, 0.3);">
                                        <th style="width: 40px; font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;"></th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Activity</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Initiated By</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Target</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Timestamp</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${r.map((t,i)=>`
                                        <tr style="border-bottom: 1px solid var(--border-subtle); background: ${i%2===0?"rgba(255, 0, 128, 0.02)":"transparent"};">
                                            <td>
                                                <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(255, 0, 128, 0.1); display: flex; align-items: center; justify-content: center;">
                                                    <i class="fas ${n(t.activityDisplayName).split(" ")[0]}" style="font-size: 0.75rem; color: var(--accent-secondary);"></i>
                                                </div>
                                            </td>
                                            <td>
                                                <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 2px; color: var(--text-primary);">${this.escapeHtml(t.activityDisplayName||"Unknown Activity")}</div>
                                                <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${this.escapeHtml(t.category||"N/A")}</div>
                                            </td>
                                            <td>
                                                <div style="font-size: 0.9rem; font-weight: 500; color: var(--text-primary);">${this.escapeHtml(t.initiatedBy?.user?.displayName||"System")}</div>
                                                <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${this.escapeHtml(t.initiatedBy?.user?.userPrincipalName||"N/A")}</div>
                                            </td>
                                            <td>
                                                ${t.targetResources?.map(s=>`
                                                    <div style="font-size: 0.85rem; color: var(--text-secondary);">${this.escapeHtml(s.displayName||s.id||"N/A")}</div>
                                                `).join("")||'<span style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.75rem;">N/A</span>'}
                                            </td>
                                            <td style="white-space: nowrap; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
                                                ${o(t.activityDateTime)}
                                            </td>
                                            <td>
                                                <span class="badge" style="background: ${t.result==="success"?"var(--color-success-dim)":"var(--color-error-dim)"}; color: ${t.result==="success"?"var(--color-success)":"var(--color-error)"}; font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase;">
                                                    ${t.result==="success"?"✓ SUCCESS":"✗ FAILED"}
                                                </span>
                                            </td>
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        `:`
                            <div style="text-align: center; padding: var(--space-2xl) var(--space-lg); color: var(--text-secondary);">
                                <div style="width: 120px; height: 120px; margin: 0 auto var(--space-xl); background: var(--accent-secondary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-history" style="font-size: 3.5rem; color: var(--accent-secondary); opacity: 0.5;"></i>
                                </div>
                                <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin-bottom: var(--space-sm); color: var(--text-primary);">
                                    No Activity Detected
                                </div>
                                <div style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-muted);">
                                    ${this.isConnected()?"No audit logs found in the last 30 days":"Connect to Microsoft Entra ID to view activity logs"}
                                </div>
                            </div>
                        `}
                    </div>

                    ${this.paginator.renderControls("app.pages.activity.handlePageChange")}
                </div>
            </div>
        `}handlePageChange(e){this.paginator.goToPage(e),this.app.router.refreshCurrentPage()}handlePageSizeChange(e){this.paginator.setPageSize(e),this.app.router.refreshCurrentPage()}async refreshPage(){await this.app.router.refreshCurrentPage()}}export{v as A};
//# sourceMappingURL=page-activitypage-CAtFiV2V.js.map
