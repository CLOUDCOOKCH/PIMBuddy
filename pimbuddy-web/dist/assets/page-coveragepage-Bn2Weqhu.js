import{B as s,C as o}from"./core-rjX7nIO3.js";import{g as n}from"./services-DF6cB9Vv.js";class p extends s{constructor(i){super(i)}async render(i,l={}){let e=null;if(this.isConnected()){this.showLoading("Generating coverage report...");const r=this.getCached(o.COVERAGE.key);if(r)e=r;else{const t=await n.getRoleCoverageReport();t.success?(e=t,this.setCached(o.COVERAGE.key,e)):this.showToast(`Failed to generate coverage report: ${t.error}`,"error")}this.hideLoading()}const a=(r,t)=>t===0?0:Math.round(r/t*100);i.innerHTML=`
            <!-- Dramatic Page Header -->
            <div style="position: relative; margin-bottom: var(--space-2xl); overflow: hidden;">
                <div style="position: absolute; top: -50%; right: -5%; width: 300px; height: 300px; background: radial-gradient(circle, var(--accent-primary-dim), transparent); filter: blur(80px); animation: float 13s ease-in-out infinite; pointer-events: none;"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: inline-flex; align-items: center; gap: var(--space-xs); padding: var(--space-xs) var(--space-md); background: rgba(0, 255, 159, 0.05); border: 1px solid var(--accent-primary); border-radius: var(--radius-full); margin-bottom: var(--space-md); font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em;">
                        <i class="fas fa-chart-line" style="color: var(--accent-primary); font-size: 0.7rem;"></i>
                        <span style="color: var(--accent-primary); font-weight: 600;">ANALYTICS</span>
                        <span style="color: var(--text-muted);">|</span>
                        <span style="color: var(--text-secondary);">COVERAGE ANALYSIS</span>
                    </div>
                    <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; line-height: 1.1; margin-bottom: var(--space-sm); letter-spacing: -0.03em;">
                        <span style="background: linear-gradient(135deg, var(--accent-primary), #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 30px rgba(0, 255, 159, 0.3));">
                            ROLE
                        </span>
                        <span style="color: var(--text-primary);"> COVERAGE</span>
                    </h1>
                    <p style="font-size: 0.95rem; color: var(--text-secondary); font-family: var(--font-mono);">
                        PIM group coverage vs direct role assignments analysis
                    </p>
                </div>
            </div>

            ${e?`
                <!-- Summary Cards with Enhanced Design -->
                <div class="stats-grid" style="margin-bottom: var(--space-2xl);">
                    <div class="card stat-card" style="position: relative; overflow: hidden;">
                        <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, var(--accent-primary-dim), transparent); filter: blur(40px); pointer-events: none;"></div>
                        <div style="position: relative; z-index: 1;">
                            <div style="width: 56px; height: 56px; background: var(--accent-primary-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                                <i class="fas fa-shield-check" style="font-size: 1.5rem; color: var(--accent-primary);"></i>
                            </div>
                            <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: var(--text-primary);">
                                ${e.totalRoles}
                            </div>
                            <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">TOTAL ROLES</div>
                        </div>
                    </div>

                    <div class="card stat-card" style="position: relative; overflow: hidden;">
                        <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, var(--color-success-dim), transparent); filter: blur(40px); pointer-events: none;"></div>
                        <div style="position: relative; z-index: 1;">
                            <div style="width: 56px; height: 56px; background: var(--color-success-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                                <i class="fas fa-users" style="font-size: 1.5rem; color: var(--color-success);"></i>
                            </div>
                            <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: var(--text-primary);">
                                ${e.totalPIMGroups}
                            </div>
                            <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">PIM GROUPS</div>
                        </div>
                    </div>

                    <div class="card stat-card" style="position: relative; overflow: hidden;">
                        <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, var(--accent-secondary-dim), transparent); filter: blur(40px); pointer-events: none;"></div>
                        <div style="position: relative; z-index: 1;">
                            <div style="width: 56px; height: 56px; background: var(--accent-secondary-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                                <i class="fas fa-check-double" style="font-size: 1.5rem; color: var(--accent-secondary);"></i>
                            </div>
                            <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: var(--text-primary);">
                                ${e.coveredRoles}
                            </div>
                            <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">COVERED</div>
                        </div>
                    </div>

                    <div class="card stat-card" style="position: relative; overflow: hidden; ${e.directUserAssignmentsCount>0?"border: 1px solid var(--color-warning);":""}">
                        <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, ${e.directUserAssignmentsCount>0?"var(--color-warning-dim)":"var(--bg-elevated)"}, transparent); filter: blur(40px); pointer-events: none;"></div>
                        <div style="position: relative; z-index: 1;">
                            <div style="width: 56px; height: 56px; background: ${e.directUserAssignmentsCount>0?"var(--color-warning-dim)":"var(--bg-elevated)"}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                                <i class="fas fa-user" style="font-size: 1.5rem; color: ${e.directUserAssignmentsCount>0?"var(--color-warning)":"var(--text-muted)"};"></i>
                            </div>
                            <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: ${e.directUserAssignmentsCount>0?"var(--color-warning)":"var(--text-primary)"};">
                                ${e.directUserAssignmentsCount}
                            </div>
                            <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">DIRECT ONLY</div>
                        </div>
                    </div>
                </div>

                <!-- Coverage Chart & Details -->
                <div class="dashboard-grid">
                    <!-- Coverage Pie Chart -->
                    <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--border-subtle);">
                        <div style="position: absolute; top: 0; left: 0; width: 300px; height: 300px; background: radial-gradient(circle, var(--accent-primary-dim), transparent); filter: blur(80px); pointer-events: none;"></div>
                        <div style="position: relative; z-index: 1;">
                            <div style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-lg); border-bottom: 1px solid var(--border-subtle);">
                                <div style="width: 48px; height: 48px; background: var(--accent-primary-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-chart-pie" style="color: var(--accent-primary); font-size: 1.3rem;"></i>
                                </div>
                                <h2 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                    Coverage Overview
                                </h2>
                            </div>
                            <div style="padding: var(--space-2xl); text-align: center;">
                                <!-- Pie Chart -->
                                <div style="max-width: 220px; margin: 0 auto var(--space-xl); position: relative;">
                                    <div style="background: conic-gradient(
                                        var(--accent-primary) 0deg ${a(e.coveredRoles,e.totalRoles)*3.6}deg,
                                        var(--color-error) ${a(e.coveredRoles,e.totalRoles)*3.6}deg 360deg
                                    ); width: 220px; height: 220px; border-radius: 50%; box-shadow: 0 0 60px rgba(0, 255, 159, 0.3);"></div>
                                    <!-- Center Circle with Percentage -->
                                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 140px; height: 140px; background: var(--bg-base); border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 3px solid var(--bg-elevated);">
                                        <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 900; line-height: 1; background: linear-gradient(135deg, var(--accent-primary), #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                                            ${a(e.coveredRoles,e.totalRoles)}
                                        </div>
                                        <div style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.15em; margin-top: 4px;">
                                            %
                                        </div>
                                    </div>
                                </div>
                                <!-- Legend -->
                                <div style="display: flex; flex-direction: column; gap: var(--space-md); max-width: 280px; margin: 0 auto;">
                                    <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-sm) var(--space-md); background: rgba(0, 255, 159, 0.05); border-left: 3px solid var(--accent-primary); border-radius: var(--radius-sm);">
                                        <div style="display: flex; align-items: center; gap: var(--space-sm);">
                                            <div style="width: 14px; height: 14px; background: var(--accent-primary); border-radius: 50%; box-shadow: 0 0 10px rgba(0, 255, 159, 0.5);"></div>
                                            <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-primary);">Covered</span>
                                        </div>
                                        <span style="font-family: var(--font-display); font-weight: 700; color: var(--accent-primary);">
                                            ${a(e.coveredRoles,e.totalRoles)}%
                                        </span>
                                    </div>
                                    <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-sm) var(--space-md); background: rgba(255, 0, 85, 0.05); border-left: 3px solid var(--color-error); border-radius: var(--radius-sm);">
                                        <div style="display: flex; align-items: center; gap: var(--space-sm);">
                                            <div style="width: 14px; height: 14px; background: var(--color-error); border-radius: 50%; box-shadow: 0 0 10px rgba(255, 0, 85, 0.5);"></div>
                                            <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-primary);">Uncovered</span>
                                        </div>
                                        <span style="font-family: var(--font-display); font-weight: 700; color: var(--color-error);">
                                            ${a(e.uncoveredRoles,e.totalRoles)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Recommendations -->
                    <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid ${e.uncoveredRoles>0||e.directUserAssignmentsCount>0?"var(--color-warning)":"var(--accent-primary)"};">
                        <div style="position: absolute; top: 0; right: 0; width: 300px; height: 300px; background: radial-gradient(circle, ${e.uncoveredRoles>0||e.directUserAssignmentsCount>0?"var(--color-warning-dim)":"var(--accent-primary-dim)"}, transparent); filter: blur(80px); pointer-events: none;"></div>
                        <div style="position: relative; z-index: 1;">
                            <div style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-lg); border-bottom: 1px solid var(--border-subtle);">
                                <div style="width: 48px; height: 48px; background: ${e.uncoveredRoles===0&&e.directUserAssignmentsCount===0?"var(--accent-primary-dim)":"var(--color-warning-dim)"}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                    <i class="fas ${e.uncoveredRoles===0&&e.directUserAssignmentsCount===0?"fa-check-circle":"fa-lightbulb"}" style="color: ${e.uncoveredRoles===0&&e.directUserAssignmentsCount===0?"var(--accent-primary)":"var(--color-warning)"}; font-size: 1.3rem;"></i>
                                </div>
                                <h2 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                    Recommendations
                                </h2>
                            </div>
                            <div style="padding: var(--space-md);">
                                ${e.uncoveredRoles>0?`
                                    <div style="background: rgba(255, 170, 0, 0.05); border-left: 3px solid var(--color-warning); border-radius: var(--radius-sm); padding: var(--space-md); margin-bottom: var(--space-sm);" role="alert">
                                        <div style="display: flex; align-items: start; gap: var(--space-sm);">
                                            <i class="fas fa-exclamation-triangle" style="color: var(--color-warning); margin-top: 2px; font-size: 1.1rem;" aria-hidden="true"></i>
                                            <div style="flex: 1;">
                                                <div style="font-weight: 700; font-family: var(--font-mono); font-size: 0.8rem; text-transform: uppercase; color: var(--color-warning); margin-bottom: var(--space-xs);">
                                                    IMPROVE COVERAGE
                                                </div>
                                                <div style="color: var(--text-secondary); line-height: 1.5; font-size: 0.9rem;">
                                                    ${e.uncoveredRoles} roles are managed through direct user assignments. Consider creating PIM groups for better management and audit trails.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `:""}
                                ${e.directUserAssignmentsCount>0?`
                                    <div style="background: rgba(59, 130, 246, 0.05); border-left: 3px solid var(--color-info); border-radius: var(--radius-sm); padding: var(--space-md); margin-bottom: var(--space-sm);" role="alert">
                                        <div style="display: flex; align-items: start; gap: var(--space-sm);">
                                            <i class="fas fa-users" style="color: var(--color-info); margin-top: 2px; font-size: 1.1rem;" aria-hidden="true"></i>
                                            <div style="flex: 1;">
                                                <div style="font-weight: 700; font-family: var(--font-mono); font-size: 0.8rem; text-transform: uppercase; color: var(--color-info); margin-bottom: var(--space-xs);">
                                                    DIRECT ASSIGNMENTS DETECTED
                                                </div>
                                                <div style="color: var(--text-secondary); line-height: 1.5; font-size: 0.9rem;">
                                                    ${e.directUserAssignmentsCount} direct user assignments found. Using PIM groups provides better access control and compliance.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `:""}
                                ${e.uncoveredRoles===0&&e.directUserAssignmentsCount===0?`
                                    <div style="text-align: center; padding: var(--space-xl);">
                                        <div style="width: 80px; height: 80px; margin: 0 auto var(--space-md); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                            <i class="fas fa-trophy" style="font-size: 2.5rem; color: var(--accent-primary);"></i>
                                        </div>
                                        <div style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; margin-bottom: var(--space-xs); color: var(--text-primary);">
                                            Perfect Coverage!
                                        </div>
                                        <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary);">
                                            All roles are properly managed through PIM groups
                                        </div>
                                    </div>
                                `:""}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Detailed Roles Table -->
                <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--border-subtle); margin-top: var(--space-lg);">
                    <div style="position: absolute; bottom: 0; right: 0; width: 400px; height: 400px; background: radial-gradient(circle, var(--accent-secondary-dim), transparent); filter: blur(100px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-lg); border-bottom: 1px solid var(--border-subtle);">
                            <div style="width: 48px; height: 48px; background: var(--accent-secondary-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-table" style="color: var(--accent-secondary); font-size: 1.3rem;"></i>
                            </div>
                            <div>
                                <h2 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                    Detailed Analysis
                                </h2>
                                <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                                    Role-by-role coverage breakdown
                                </div>
                            </div>
                        </div>
                        <div style="overflow-x: auto;">
                            <table class="table" style="margin: 0;">
                                <thead>
                                    <tr style="background: rgba(0, 0, 0, 0.3);">
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Role Name</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Group Assignments</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Direct Assignments</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${e.roles.map((r,t)=>`
                                        <tr style="border-bottom: 1px solid var(--border-subtle); background: ${t%2===0?"rgba(255, 0, 128, 0.02)":"transparent"};">
                                            <td style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary);">
                                                ${this.escapeHtml(r.roleName)}
                                            </td>
                                            <td>
                                                <span style="font-family: var(--font-mono); font-size: 0.9rem; font-weight: 600; color: ${r.groupCount>0?"var(--accent-primary)":"var(--text-muted)"};">
                                                    ${r.groupCount}
                                                </span>
                                            </td>
                                            <td>
                                                <span style="font-family: var(--font-mono); font-size: 0.9rem; font-weight: 600; color: ${r.userCount>0?"var(--color-warning)":"var(--text-muted)"};">
                                                    ${r.userCount}
                                                </span>
                                            </td>
                                            <td>
                                                <span class="badge" style="background: ${r.isCovered?"var(--color-success-dim)":"var(--color-warning-dim)"}; color: ${r.isCovered?"var(--color-success)":"var(--color-warning)"}; font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; font-weight: 700;">
                                                    ${r.isCovered?"✓ COVERED":"⚠ DIRECT ONLY"}
                                                </span>
                                            </td>
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `:`
                <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--accent-primary);">
                    <div style="position: absolute; inset: 0; background: radial-gradient(circle at center, var(--accent-primary-dim), transparent); filter: blur(80px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1; text-align: center; padding: var(--space-2xl);">
                        <div style="width: 150px; height: 150px; margin: 0 auto var(--space-xl); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 60px rgba(0, 255, 159, 0.3);">
                            <i class="fas fa-chart-pie" style="font-size: 4.5rem; color: var(--accent-primary);"></i>
                        </div>
                        <h2 style="font-family: var(--font-display); font-size: 2rem; font-weight: 800; margin-bottom: var(--space-md); text-transform: uppercase; letter-spacing: 0.05em;">
                            <span style="background: linear-gradient(135deg, var(--accent-primary), #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                                ANALYTICS READY
                            </span>
                        </h2>
                        <p style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.95rem; margin-bottom: var(--space-xl); max-width: 500px; margin-left: auto; margin-right: auto;">
                            ${this.isConnected()?"Generating comprehensive coverage analysis across all PIM roles and assignments":"Connect to Microsoft Entra ID to view role coverage analytics"}
                        </p>
                        ${this.isConnected()?`
                            <div style="display: inline-flex; align-items: center; gap: var(--space-sm); padding: var(--space-sm) var(--space-md); background: rgba(0, 255, 159, 0.1); border-radius: var(--radius-full); font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-primary);">
                                <div class="spinner" style="width: 16px; height: 16px;"></div>
                                <span>Loading data...</span>
                            </div>
                        `:""}
                    </div>
                </div>
            `}
        `}async refreshPage(){this.app.cacheManager.invalidate(o.COVERAGE.key),await this.app.router.refreshCurrentPage()}}export{p as C};
//# sourceMappingURL=page-coveragepage-Bn2Weqhu.js.map
