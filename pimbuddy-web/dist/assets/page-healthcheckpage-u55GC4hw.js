import{B as n,C as i}from"./core-rjX7nIO3.js";import{g as o}from"./services-DF6cB9Vv.js";class p extends n{constructor(t){super(t)}async render(t,c={}){let a=null;if(this.isConnected()){this.showLoading("Running health check...");const e=this.getCached(i.HEALTH_CHECK.key);if(e)a=e;else{const r=await o.runHealthCheck();r.success?(a=r,this.setCached(i.HEALTH_CHECK.key,a)):this.showToast(`Failed to run health check: ${r.error}`,"error")}this.hideLoading()}t.innerHTML=`
            <!-- Dramatic Page Header -->
            <div style="position: relative; margin-bottom: var(--space-2xl); overflow: hidden;">
                <div style="position: absolute; top: -50%; left: -5%; width: 300px; height: 300px; background: radial-gradient(circle, ${a?.status==="healthy"?"var(--accent-primary-dim)":a?.status==="warning"?"var(--color-warning-dim)":"rgba(255, 0, 85, 0.1)"}, transparent); filter: blur(80px); animation: float 15s ease-in-out infinite; pointer-events: none;"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: inline-flex; align-items: center; gap: var(--space-xs); padding: var(--space-xs) var(--space-md); background: ${a?.status==="healthy"?"rgba(0, 255, 159, 0.05)":a?.status==="warning"?"rgba(255, 170, 0, 0.05)":"rgba(255, 0, 85, 0.05)"}; border: 1px solid ${a?.status==="healthy"?"var(--accent-primary)":a?.status==="warning"?"var(--color-warning)":"var(--color-error)"}; border-radius: var(--radius-full); margin-bottom: var(--space-md); font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em;">
                        <i class="fas fa-shield-check" style="color: ${a?.status==="healthy"?"var(--accent-primary)":a?.status==="warning"?"var(--color-warning)":"var(--color-error)"}; font-size: 0.7rem;"></i>
                        <span style="color: ${a?.status==="healthy"?"var(--accent-primary)":a?.status==="warning"?"var(--color-warning)":"var(--color-error)"}; font-weight: 600;">SECURITY SCAN</span>
                        <span style="color: var(--text-muted);">|</span>
                        <span style="color: var(--text-secondary);">${a?a.checksRun+" CHECKS":"READY"}</span>
                    </div>
                    <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; line-height: 1.1; margin-bottom: var(--space-sm); letter-spacing: -0.03em;">
                        <span style="background: linear-gradient(135deg, ${a?.status==="healthy"?"var(--accent-primary), #00ffff":a?.status==="warning"?"var(--color-warning), #ffdd00":"var(--color-error), #ff0099"}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 30px ${a?.status==="healthy"?"rgba(0, 255, 159, 0.3)":a?.status==="warning"?"rgba(255, 170, 0, 0.3)":"rgba(255, 0, 85, 0.3)"});">
                            HEALTH
                        </span>
                        <span style="color: var(--text-primary);"> CHECK</span>
                    </h1>
                    <p style="font-size: 0.95rem; color: var(--text-secondary); font-family: var(--font-mono);">
                        Automated security scanner for PIM configuration compliance
                    </p>
                </div>
            </div>

            ${a?`
                <!-- Massive Health Score Card -->
                <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 2px solid ${a.status==="healthy"?"var(--accent-primary)":a.status==="warning"?"var(--color-warning)":"var(--color-error)"}; margin-bottom: var(--space-2xl);">
                    <div style="position: absolute; inset: 0; background: radial-gradient(circle at center, ${a.status==="healthy"?"var(--accent-primary-dim)":a.status==="warning"?"rgba(255, 170, 0, 0.05)":"rgba(255, 0, 85, 0.05)"}, transparent); filter: blur(60px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1; text-align: center; padding: var(--space-2xl);">
                        <!-- Circular Score Display -->
                        <div style="display: inline-flex; align-items: center; justify-content: center; width: 200px; height: 200px; border-radius: 50%; border: 12px solid ${a.status==="healthy"?"var(--accent-primary)":a.status==="warning"?"var(--color-warning)":"var(--color-error)"}; margin-bottom: var(--space-lg); box-shadow: 0 0 60px ${a.status==="healthy"?"rgba(0, 255, 159, 0.4)":a.status==="warning"?"rgba(255, 170, 0, 0.4)":"rgba(255, 0, 85, 0.4)"};">
                            <div>
                                <div style="font-family: var(--font-display); font-size: 4rem; font-weight: 900; line-height: 1; background: linear-gradient(135deg, ${a.status==="healthy"?"var(--accent-primary), #00ffff":a.status==="warning"?"var(--color-warning), #ffdd00":"var(--color-error), #ff0099"}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                                    ${a.healthScore}
                                </div>
                                <div style="font-family: var(--font-mono); font-size: 1.2rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.15em;">
                                    %
                                </div>
                            </div>
                        </div>

                        <!-- Status -->
                        <h2 style="font-family: var(--font-display); font-size: 2rem; font-weight: 800; margin: 0 0 var(--space-sm) 0; text-transform: uppercase; letter-spacing: 0.05em; color: ${a.status==="healthy"?"var(--accent-primary)":a.status==="warning"?"var(--color-warning)":"var(--color-error)"};">
                            ${a.status==="healthy"?"✓ HEALTHY":a.status==="warning"?"⚠ WARNING":"✗ CRITICAL"}
                        </h2>
                        <p style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.9rem; margin-bottom: var(--space-lg);">
                            Based on ${a.checksRun} automated security checks
                        </p>
                        <button class="btn btn-primary" onclick="app.pages['health-check'].refreshPage()" style="font-family: var(--font-mono); padding: var(--space-md) var(--space-xl);" aria-label="Re-run security scan">
                            <i class="fas fa-redo"></i> RE-RUN SCAN
                        </button>
                    </div>
                </div>

                <!-- Issues & Warnings Grid -->
                <div class="dashboard-grid">
                    <!-- Critical Issues -->
                    <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid ${a.issues.length>0?"var(--color-error)":"var(--border-subtle)"};">
                        <div style="position: absolute; top: 0; left: 0; width: 300px; height: 300px; background: radial-gradient(circle, ${a.issues.length>0?"rgba(255, 0, 85, 0.05)":"var(--accent-primary-dim)"}, transparent); filter: blur(80px); pointer-events: none;"></div>
                        <div style="position: relative; z-index: 1;">
                            <div style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-lg); border-bottom: 1px solid var(--border-subtle);">
                                <div style="width: 48px; height: 48px; background: ${a.issues.length>0?"rgba(255, 0, 85, 0.1)":"var(--accent-primary-dim)"}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                    <i class="fas ${a.issues.length>0?"fa-times-circle":"fa-check-circle"}" style="color: ${a.issues.length>0?"var(--color-error)":"var(--accent-primary)"}; font-size: 1.3rem;"></i>
                                </div>
                                <div style="flex: 1;">
                                    <h2 style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                        Critical Issues
                                    </h2>
                                    <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                                        ${a.issues.length} items requiring immediate attention
                                    </div>
                                </div>
                                ${a.issues.length>0?`<span class="badge" style="background: var(--color-error-dim); color: var(--color-error); font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; animation: pulse 2s ease-in-out infinite;" aria-label="${a.issues.length} critical issues">${a.issues.length}</span>`:""}
                            </div>
                            <div style="max-height: 400px; overflow-y: auto; padding: var(--space-md);">
                                ${a.issues.length>0?a.issues.map((e,r)=>`
                                    <div style="background: rgba(255, 0, 85, 0.05); border-left: 3px solid var(--color-error); border-radius: var(--radius-sm); padding: var(--space-md); margin-bottom: var(--space-sm);" role="alert">
                                        <div style="display: flex; align-items: start; gap: var(--space-sm);">
                                            <i class="fas fa-times-circle" style="color: var(--color-error); margin-top: 2px; font-size: 1.1rem;" aria-hidden="true"></i>
                                            <div style="flex: 1;">
                                                <div style="font-weight: 700; font-family: var(--font-mono); font-size: 0.8rem; text-transform: uppercase; color: var(--color-error); margin-bottom: var(--space-xs);">
                                                    ${this.escapeHtml(e.category)}
                                                </div>
                                                <div style="color: var(--text-secondary); line-height: 1.5; font-size: 0.9rem;">
                                                    ${this.escapeHtml(e.message)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `).join(""):`
                                    <div style="text-align: center; padding: var(--space-xl); color: var(--text-secondary);">
                                        <div style="width: 80px; height: 80px; margin: 0 auto var(--space-md); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                            <i class="fas fa-shield-check" style="font-size: 2.5rem; color: var(--accent-primary);"></i>
                                        </div>
                                        <div style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin-bottom: var(--space-xs); color: var(--text-primary);">
                                            No Critical Issues
                                        </div>
                                        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">
                                            Your PIM configuration is secure
                                        </div>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>

                    <!-- Warnings -->
                    <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid ${a.warnings.length>0?"var(--color-warning)":"var(--border-subtle)"};">
                        <div style="position: absolute; top: 0; right: 0; width: 300px; height: 300px; background: radial-gradient(circle, ${a.warnings.length>0?"rgba(255, 170, 0, 0.05)":"var(--accent-secondary-dim)"}, transparent); filter: blur(80px); pointer-events: none;"></div>
                        <div style="position: relative; z-index: 1;">
                            <div style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-lg); border-bottom: 1px solid var(--border-subtle);">
                                <div style="width: 48px; height: 48px; background: ${a.warnings.length>0?"var(--color-warning-dim)":"var(--accent-secondary-dim)"}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                    <i class="fas ${a.warnings.length>0?"fa-exclamation-triangle":"fa-check-circle"}" style="color: ${a.warnings.length>0?"var(--color-warning)":"var(--accent-secondary)"}; font-size: 1.3rem;"></i>
                                </div>
                                <div style="flex: 1;">
                                    <h2 style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                        Warnings
                                    </h2>
                                    <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                                        ${a.warnings.length} recommendations for improvement
                                    </div>
                                </div>
                                ${a.warnings.length>0?`<span class="badge" style="background: var(--color-warning-dim); color: var(--color-warning); font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700;" aria-label="${a.warnings.length} warnings">${a.warnings.length}</span>`:""}
                            </div>
                            <div style="max-height: 400px; overflow-y: auto; padding: var(--space-md);">
                                ${a.warnings.length>0?a.warnings.map((e,r)=>`
                                    <div style="background: rgba(255, 170, 0, 0.05); border-left: 3px solid var(--color-warning); border-radius: var(--radius-sm); padding: var(--space-md); margin-bottom: var(--space-sm);" role="alert">
                                        <div style="display: flex; align-items: start; gap: var(--space-sm);">
                                            <i class="fas fa-exclamation-triangle" style="color: var(--color-warning); margin-top: 2px; font-size: 1.1rem;" aria-hidden="true"></i>
                                            <div style="flex: 1;">
                                                <div style="font-weight: 700; font-family: var(--font-mono); font-size: 0.8rem; text-transform: uppercase; color: var(--color-warning); margin-bottom: var(--space-xs);">
                                                    ${this.escapeHtml(e.category)}
                                                </div>
                                                <div style="color: var(--text-secondary); line-height: 1.5; font-size: 0.9rem; margin-bottom: var(--space-xs);">
                                                    ${this.escapeHtml(e.message)}
                                                </div>
                                                ${e.groups?`
                                                    <details style="margin-top: var(--space-sm);">
                                                        <summary style="cursor: pointer; color: var(--text-muted); font-size: 0.8rem; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.05em;">► View Details (${e.groups.length})</summary>
                                                        <ul style="margin-top: var(--space-sm); padding-left: var(--space-lg); color: var(--text-secondary); font-size: 0.85rem;">
                                                            ${e.groups.map(s=>`<li style="margin-bottom: var(--space-xs); font-family: var(--font-mono);">${this.escapeHtml(s)}</li>`).join("")}
                                                        </ul>
                                                    </details>
                                                `:""}
                                            </div>
                                        </div>
                                    </div>
                                `).join(""):`
                                    <div style="text-align: center; padding: var(--space-xl); color: var(--text-secondary);">
                                        <div style="width: 80px; height: 80px; margin: 0 auto var(--space-md); background: var(--accent-secondary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                            <i class="fas fa-thumbs-up" style="font-size: 2.5rem; color: var(--accent-secondary);"></i>
                                        </div>
                                        <div style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin-bottom: var(--space-xs); color: var(--text-primary);">
                                            No Warnings
                                        </div>
                                        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">
                                            Configuration meets best practices
                                        </div>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            `:`
                <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--accent-primary);">
                    <div style="position: absolute; inset: 0; background: radial-gradient(circle at center, var(--accent-primary-dim), transparent); filter: blur(80px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1; text-align: center; padding: var(--space-2xl);">
                        <div style="width: 150px; height: 150px; margin: 0 auto var(--space-xl); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 60px rgba(0, 255, 159, 0.3);">
                            <i class="fas fa-heart-pulse" style="font-size: 4.5rem; color: var(--accent-primary);"></i>
                        </div>
                        <h2 style="font-family: var(--font-display); font-size: 2rem; font-weight: 800; margin-bottom: var(--space-md); text-transform: uppercase; letter-spacing: 0.05em;">
                            <span style="background: linear-gradient(135deg, var(--accent-primary), #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                                SCANNER READY
                            </span>
                        </h2>
                        <p style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.95rem; margin-bottom: var(--space-xl); max-width: 500px; margin-left: auto; margin-right: auto;">
                            ${this.isConnected()?"Launch automated security analysis to evaluate your PIM configuration against best practices":"Connect to Microsoft Entra ID to run comprehensive security health checks"}
                        </p>
                        <button class="btn btn-primary" onclick="app.pages['health-check'].refreshPage()" ${this.isConnected()?"":"disabled"} style="font-family: var(--font-mono); padding: var(--space-md) var(--space-2xl); font-size: 1.1rem;" aria-label="Initiate security scan">
                            <i class="fas fa-play-circle"></i> INITIATE SCAN
                        </button>
                    </div>
                </div>
            `}
        `}async refreshPage(){this.app.cacheManager.invalidate(i.HEALTH_CHECK.key),await this.app.router.refreshCurrentPage()}}export{p as H};
//# sourceMappingURL=page-healthcheckpage-u55GC4hw.js.map
