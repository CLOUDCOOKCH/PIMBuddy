import{i as f,c as o,a as h,d as y,t as p,g as b}from"./services-DF6cB9Vv.js";import{P as l,c as d,B as x,E as n,s as g,d as w,S as A}from"./utils-B68CIlTQ.js";import{a as C,P as T,b as c}from"./core-rjX7nIO3.js";import{D as P}from"./page-dashboardpage-BK0TZRHp.js";import{G as I}from"./page-groupspage-CcLYulAn.js";import{R as S}from"./page-rolespage-NLhHTgT_.js";import{A as k}from"./page-activitypage-CAtFiV2V.js";import{A as M}from"./page-approvalspage-qJI2tH0l.js";import{E}from"./page-expiringpage-BJ2WTLHw.js";import{H as L}from"./page-healthcheckpage-u55GC4hw.js";import{C as z}from"./page-coveragepage-Bn2Weqhu.js";import{P as D}from"./page-pimmaidpage-GmsR1KOG.js";import{P as B}from"./page-policiespage-7QgKjrIf.js";import{T as R}from"./page-templatespage-C40ZrFiw.js";import{E as F}from"./page-exportpage-BJblAL28.js";import{S as $}from"./page-settingspage-CK1_T0S5.js";import{B as q}from"./page-baselinepage-QRc0DzZg.js";import{A as G}from"./page-activationspage-Ctb9nQuK.js";import"./vendor-msal-_oisOUhb.js";import"./vendor-libs-DR0WLJdd.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function a(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(t){if(t.ep)return;t.ep=!0;const i=a(t);fetch(t.href,i)}})();class N{constructor(){this.currentPage="dashboard",this.isConnected=!1,this.isConfigured=!1,this.isDarkMode=!1,this.cache={groups:null,roles:null,templates:null},this.paginators={groups:new l([],d.DEFAULT_PAGE_SIZE),roles:new l([],d.DEFAULT_PAGE_SIZE),activity:new l([],d.DEFAULT_PAGE_SIZE)},this.bulkOps={groups:new x},this.exportUtils=n,this.cacheManager=new C,this.pages={dashboard:new P(this),groups:new I(this),roles:new S(this),activity:new k(this),approvals:new M(this),expiring:new E(this),healthCheck:new L(this),coverage:new z(this),pimmaid:new D(this),baseline:new q(this),policies:new B(this),templates:new R(this),export:new F(this),settings:new $(this),activations:new G(this)},this.router=new T,this.router.registerPages({dashboard:this.pages.dashboard,groups:this.pages.groups,roles:this.pages.roles,"entra-roles":this.pages.roles,"pim-activity":this.pages.activity,"pending-approvals":this.pages.approvals,"expiring-assignments":this.pages.expiring,"health-check":this.pages.healthCheck,"role-coverage":this.pages.coverage,pimmaid:this.pages.pimmaid,baseline:this.pages.baseline,policies:this.pages.policies,templates:this.pages.templates,export:this.pages.export,settings:this.pages.settings,activations:this.pages.activations,"my-activations":this.pages.activations})}async init(){if(console.log("PIMBuddy Web initializing..."),c.initialize(),this.loadTheme(),this.isConfigured=f(),this.isConfigured)try{await o.initialize()&&o.isAuthenticated()&&this.handleSuccessfulLogin()}catch(e){console.error("Failed to initialize auth:",e),this.showToast("Failed to initialize authentication","error")}else this.showSetupRequired();this.setupEventListeners(),this.renderPage(this.currentPage),console.log("PIMBuddy Web initialized")}setupEventListeners(){document.getElementById("connect-btn").addEventListener("click",()=>this.handleConnect()),document.getElementById("theme-toggle").addEventListener("click",()=>this.toggleTheme()),document.querySelectorAll(".nav-item").forEach(e=>{e.addEventListener("click",a=>{const s=a.currentTarget.dataset.page;this.navigateTo(s)})}),document.querySelector(".modal-backdrop")?.addEventListener("click",()=>this.closeModal()),document.addEventListener("keydown",e=>{e.ctrlKey&&e.key==="f"&&(e.preventDefault(),this.showGlobalSearch()),e.key==="Escape"&&this.closeModal(),e.key==="F5"&&(e.preventDefault(),this.refreshCurrentPage())})}showSetupRequired(){document.getElementById("connect-text").textContent="Setup",document.getElementById("connection-text").textContent="Setup Required"}async handleConnect(){if(!this.isConfigured){await this.showSetupWizard();return}if(this.isConnected){this.showLoading("Signing out...");const e=await o.logout();this.hideLoading(),e.success?this.handleLogout():this.showToast(e.error,"error")}else{this.showLoading("Signing in...");const e=await o.login();this.hideLoading(),e.success?this.handleSuccessfulLogin():this.showToast(e.error,"error")}}handleSuccessfulLogin(){this.isConnected=!0;const e=o.getAccount();document.getElementById("connect-text").textContent="Disconnect",document.getElementById("connect-btn").classList.remove("btn-primary"),document.getElementById("connect-btn").classList.add("btn-danger"),document.getElementById("connection-indicator").classList.remove("disconnected"),document.getElementById("connection-indicator").classList.add("connected"),document.getElementById("connection-text").textContent=e?.username||"Connected",this.showToast("Connected successfully","success"),g.start(()=>{this.showToast("Session expired due to inactivity","warning"),this.handleLogout()},a=>{this.showToast(`Your session will expire in ${a} minutes due to inactivity`,"warning")}),this.refreshCurrentPage()}handleLogout(){this.isConnected=!1,this.cache={groups:null,roles:null,templates:null},g.stop(),document.getElementById("connect-text").textContent="Connect",document.getElementById("connect-btn").classList.remove("btn-danger"),document.getElementById("connect-btn").classList.add("btn-primary"),document.getElementById("connection-indicator").classList.remove("connected"),document.getElementById("connection-indicator").classList.add("disconnected"),document.getElementById("connection-text").textContent="Not Connected",this.showToast("Disconnected","info"),this.renderPage(this.currentPage)}async navigateTo(e,a={}){await this.router.navigateTo(e,a),this.currentPage=e}async renderPage(e,a={}){await this.router.navigateTo(e,a),c.announcePageChange(e)}async refreshCurrentPage(){await this.router.refreshCurrentPage()}async showSetupWizard(){const e=h(),a=window.location.origin,s=`
            <h2><i class="fas fa-cog"></i> PIMBuddy Setup</h2>
            <p>Configure PIMBuddy to connect to your Azure AD tenant.</p>

            <div class="setup-tabs">
                <button class="setup-tab active" onclick="app.switchSetupTab('manual')">
                    <i class="fas fa-edit"></i> Manual Setup
                </button>
                <button class="setup-tab" onclick="app.switchSetupTab('instructions')">
                    <i class="fas fa-book"></i> Instructions
                </button>
            </div>

            <div id="setup-tab-manual" class="setup-tab-content active">
                <form id="manual-setup-form" onsubmit="app.saveManualConfig(event)">
                    <div class="form-group">
                        <label for="client-id">Application (Client) ID *</label>
                        <input type="text" id="client-id" class="input" required
                            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                            value="${e?.clientId||""}"
                            pattern="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}">
                        <small class="form-hint">Found in Azure Portal → App registrations → Your app → Overview</small>
                    </div>

                    <div class="form-group">
                        <label for="tenant-id">Directory (Tenant) ID *</label>
                        <input type="text" id="tenant-id" class="input" required
                            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                            value="${e?.tenantId||""}"
                            pattern="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}">
                        <small class="form-hint">Found in Azure Portal → Azure Active Directory → Overview</small>
                    </div>

                    <div class="setup-note">
                        <i class="fas fa-info-circle"></i>
                        <span>Your Redirect URI must be: <code>${a}</code></span>
                    </div>

                    <div id="setup-result" class="setup-result hidden"></div>

                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
                        ${e?`
                            <button type="button" class="btn btn-secondary" onclick="app.resetSetup()">
                                <i class="fas fa-trash"></i> Clear
                            </button>
                        `:""}
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save & Connect
                        </button>
                    </div>
                </form>
            </div>

            <div id="setup-tab-instructions" class="setup-tab-content">
                <div class="setup-instructions">
                    <h3>Step 1: Create App Registration</h3>
                    <ol>
                        <li>Go to <a href="https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade" target="_blank">Azure Portal → App registrations</a></li>
                        <li>Click <strong>New registration</strong></li>
                        <li>Name: <code>PIMBuddy Web</code></li>
                        <li>Supported account types: <strong>Single tenant</strong></li>
                        <li>Redirect URI: Select <strong>Single-page application (SPA)</strong> and enter:<br>
                            <code class="copyable" onclick="app.copyToClipboard('${a}')">${a}</code>
                        </li>
                        <li>Click <strong>Register</strong></li>
                    </ol>

                    <h3>Step 2: Configure API Permissions</h3>
                    <ol>
                        <li>In your new app, go to <strong>API permissions</strong></li>
                        <li>Click <strong>Add a permission</strong> → <strong>Microsoft Graph</strong> → <strong>Delegated permissions</strong></li>
                        <li>Add these permissions:
                            <ul class="permissions-list">
                                <li><code>User.Read</code></li>
                                <li><code>Group.Read.All</code></li>
                                <li><code>Group.ReadWrite.All</code></li>
                                <li><code>RoleManagement.Read.Directory</code></li>
                                <li><code>RoleManagement.ReadWrite.Directory</code></li>
                                <li><code>PrivilegedAccess.Read.AzureADGroup</code></li>
                                <li><code>PrivilegedAccess.ReadWrite.AzureADGroup</code></li>
                                <li><code>PrivilegedEligibilitySchedule.Read.AzureADGroup</code></li>
                                <li><code>PrivilegedEligibilitySchedule.ReadWrite.AzureADGroup</code></li>
                                <li><code>PrivilegedAssignmentSchedule.Read.AzureADGroup</code></li>
                                <li><code>PrivilegedAssignmentSchedule.ReadWrite.AzureADGroup</code></li>
                            </ul>
                        </li>
                        <li>Click <strong>Grant admin consent</strong> (requires admin role)</li>
                    </ol>

                    <h3>Step 3: Copy IDs</h3>
                    <ol>
                        <li>Go to <strong>Overview</strong></li>
                        <li>Copy the <strong>Application (client) ID</strong></li>
                        <li>Copy the <strong>Directory (tenant) ID</strong></li>
                        <li>Paste them in the <strong>Manual Setup</strong> tab</li>
                    </ol>
                </div>

                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Close</button>
                    <button type="button" class="btn btn-primary" onclick="app.switchSetupTab('manual')">
                        <i class="fas fa-arrow-left"></i> Back to Setup
                    </button>
                </div>
            </div>
        `;this.showModal(s)}switchSetupTab(e){document.querySelectorAll(".setup-tab").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".setup-tab-content").forEach(a=>a.classList.remove("active")),document.querySelector(`.setup-tab-content#setup-tab-${e}`).classList.add("active"),event.currentTarget.classList.add("active")}copyToClipboard(e){navigator.clipboard.writeText(e).then(()=>{this.showToast("Copied to clipboard","success")}).catch(()=>{this.showToast("Failed to copy","error")})}async saveManualConfig(e){e.preventDefault();const a=document.getElementById("client-id").value.trim(),s=document.getElementById("tenant-id").value.trim(),t=document.getElementById("setup-result"),i=/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;if(!i.test(a)){t.innerHTML='<div class="error-message"><i class="fas fa-exclamation-circle"></i><div>Invalid Client ID format. Must be a GUID.</div></div>',t.classList.remove("hidden");return}if(!i.test(s)){t.innerHTML='<div class="error-message"><i class="fas fa-exclamation-circle"></i><div>Invalid Tenant ID format. Must be a GUID.</div></div>',t.classList.remove("hidden");return}const r={clientId:a,tenantId:s,createdAt:new Date().toISOString()};localStorage.setItem("pimbuddy-app-config",JSON.stringify(r)),this.isConfigured=!0;try{await o.reinitialize(),t.innerHTML=`
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <strong>Configuration saved!</strong>
                        <p>Click below to sign in.</p>
                    </div>
                </div>
            `,t.classList.remove("hidden"),document.getElementById("connect-text").textContent="Connect",document.getElementById("connection-text").textContent="Not Connected",setTimeout(async()=>{this.closeModal(),await this.handleConnect()},1e3)}catch(v){t.innerHTML=`
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <div>
                        <strong>Configuration Error</strong>
                        <p>${v.message}</p>
                    </div>
                </div>
            `,t.classList.remove("hidden")}}async resetSetup(){confirm("This will clear the saved configuration. You will need to run setup again. Continue?")&&(y(),this.isConfigured=!1,o.msalInstance=null,o.account=null,o.initialized=!1,this.closeModal(),this.showToast("Configuration cleared","info"),this.showSetupRequired(),this.renderPage(this.currentPage))}renderLandingPage(e){e.innerHTML=`
            <!-- Hero Section -->
            <div style="text-align: center; padding: var(--space-xl) 0; max-width: 1200px; margin: 0 auto;">
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 120px; height: 120px; background: linear-gradient(135deg, var(--accent-primary-dim), var(--accent-secondary-dim)); border-radius: 30px; margin-bottom: var(--space-lg); box-shadow: 0 20px 60px rgba(0, 212, 170, 0.3);">
                    <i class="fas fa-shield-alt" style="font-size: 4rem; color: var(--accent-primary);"></i>
                </div>

                <h1 style="font-family: var(--font-display); font-size: 3.5rem; font-weight: 800; margin-bottom: var(--space-md); background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    Welcome to PIMBuddy
                </h1>

                <p style="font-size: 1.3rem; color: var(--text-secondary); max-width: 700px; margin: 0 auto var(--space-xl);">
                    Your complete solution for Microsoft Entra PIM management. Deploy, monitor, and secure privileged access with enterprise-grade tools.
                </p>

                <button class="btn btn-primary" onclick="document.getElementById('connect-btn').click()" style="font-size: 1.1rem; padding: var(--space-md) var(--space-xl); box-shadow: 0 10px 30px rgba(0, 212, 170, 0.3);">
                    <i class="fas fa-plug"></i> Connect to Get Started
                </button>
            </div>

            <!-- Key Stats -->
            <div class="stats-grid" style="margin-bottom: var(--space-xl);">
                <div class="card stat-card" style="border-color: var(--accent-primary-dim);">
                    <div class="stat-icon primary">
                        <i class="fas fa-tachometer-alt"></i>
                    </div>
                    <div class="stat-value">5</div>
                    <div class="stat-label">Monitoring Tools</div>
                </div>
                <div class="card stat-card" style="border-color: var(--accent-secondary-dim);">
                    <div class="stat-icon secondary">
                        <i class="fas fa-rocket"></i>
                    </div>
                    <div class="stat-value">3</div>
                    <div class="stat-label">Baseline Templates</div>
                </div>
                <div class="card stat-card" style="border-color: var(--color-success-dim);">
                    <div class="stat-icon success">
                        <i class="fas fa-shield-check"></i>
                    </div>
                    <div class="stat-value">100%</div>
                    <div class="stat-label">Zero Trust Ready</div>
                </div>
            </div>

            <!-- Core Features -->
            <h2 style="font-family: var(--font-display); font-size: 2rem; font-weight: 700; text-align: center; margin-bottom: var(--space-lg);">
                <i class="fas fa-stars" style="color: var(--accent-primary);"></i> Core Features
            </h2>

            <div class="dashboard-grid" style="margin-bottom: var(--space-xl);">
                <!-- Baseline Deployment -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--accent-primary-dim);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--accent-primary-dim); border-radius: var(--radius-lg);">
                            <i class="fas fa-rocket" style="font-size: 1.8rem; color: var(--accent-primary);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">Baseline Deployment</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">One-Click PIM Setup</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Deploy complete PIM configurations instantly with industry best practices. Choose from Enterprise Standard, High Security (Zero Trust), or Quick Start templates.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-primary"><i class="fas fa-check"></i> Tiered Access (T0/T1/T2)</span>
                        <span class="badge badge-success"><i class="fas fa-check"></i> MFA Required</span>
                        <span class="badge badge-info"><i class="fas fa-check"></i> Approval Workflows</span>
                        <span class="badge badge-warning"><i class="fas fa-check"></i> Auto-Configuration</span>
                    </div>
                </div>

                <!-- PIM Health Check -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--color-success-dim);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--color-success-dim); border-radius: var(--radius-lg);">
                            <i class="fas fa-heart-pulse" style="font-size: 1.8rem; color: var(--color-success);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">Health Check Scanner</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Security Analysis</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Automated security scanner that analyzes your PIM configuration. Get a health score (0-100%) and actionable recommendations to improve security.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-success"><i class="fas fa-search"></i> Auto-Scan</span>
                        <span class="badge badge-primary"><i class="fas fa-chart-line"></i> Health Score</span>
                        <span class="badge badge-warning"><i class="fas fa-exclamation-triangle"></i> Issue Detection</span>
                        <span class="badge badge-info"><i class="fas fa-lightbulb"></i> Recommendations</span>
                    </div>
                </div>

                <!-- Activity Monitoring -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--accent-secondary-dim);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--accent-secondary-dim); border-radius: var(--radius-lg);">
                            <i class="fas fa-history" style="font-size: 1.8rem; color: var(--accent-secondary);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">PIM Activity Log</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Audit & Compliance</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Complete audit trail of all PIM role management activities. Track who did what, when, and why with detailed activity logs and filtering.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-secondary"><i class="fas fa-calendar"></i> 30-Day History</span>
                        <span class="badge badge-info"><i class="fas fa-filter"></i> Advanced Filtering</span>
                        <span class="badge badge-primary"><i class="fas fa-download"></i> Export Logs</span>
                    </div>
                </div>

                <!-- Approval Management -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--color-warning-dim);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--color-warning-dim); border-radius: var(--radius-lg);">
                            <i class="fas fa-clock" style="font-size: 1.8rem; color: var(--color-warning);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">Pending Approvals</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Request Management</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Manage PIM activation requests in one place. Review justifications, approve or deny requests, and maintain compliance with one-click actions.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-success"><i class="fas fa-check"></i> Quick Approve</span>
                        <span class="badge badge-danger"><i class="fas fa-times"></i> Quick Deny</span>
                        <span class="badge badge-info"><i class="fas fa-comment"></i> Justification View</span>
                    </div>
                </div>

                <!-- Expiring Assignments -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid rgba(245, 158, 11, 0.2);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--color-warning-dim); border-radius: var(--radius-lg);">
                            <i class="fas fa-hourglass-end" style="font-size: 1.8rem; color: var(--color-warning);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">Expiring Assignments</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Lifecycle Management</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Track role assignments expiring within 7 days. Proactive monitoring prevents access loss and ensures continuous operations.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-warning"><i class="fas fa-bell"></i> 7-Day Alerts</span>
                        <span class="badge badge-primary"><i class="fas fa-clock"></i> Time Remaining</span>
                        <span class="badge badge-info"><i class="fas fa-list"></i> Full Tracking</span>
                    </div>
                </div>

                <!-- Role Coverage -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid rgba(59, 130, 246, 0.2);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: rgba(59, 130, 246, 0.15); border-radius: var(--radius-lg);">
                            <i class="fas fa-chart-pie" style="font-size: 1.8rem; color: var(--color-info);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">Role Coverage Report</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Analytics Dashboard</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Analyze which roles are managed through PIM groups vs direct assignments. Visual reports help identify gaps and improve governance.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-info"><i class="fas fa-chart-pie"></i> Visual Reports</span>
                        <span class="badge badge-primary"><i class="fas fa-percent"></i> Coverage %</span>
                        <span class="badge badge-warning"><i class="fas fa-flag"></i> Gap Analysis</span>
                    </div>
                </div>
            </div>

            <!-- Additional Features -->
            <h2 style="font-family: var(--font-display); font-size: 2rem; font-weight: 700; text-align: center; margin-bottom: var(--space-lg);">
                <i class="fas fa-toolbox" style="color: var(--accent-primary);"></i> Additional Tools
            </h2>

            <div class="dashboard-grid" style="margin-bottom: var(--space-xl);">
                <!-- PIMMaid -->
                <div class="card">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-sm);">
                        <div class="stat-icon primary">
                            <i class="fas fa-project-diagram"></i>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0;">PIMMaid Visualizer</h3>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">
                        Export your PIM configuration as beautiful Mermaid diagrams. Visualize relationships between users, groups, and roles.
                    </p>
                    <span class="badge badge-secondary"><i class="fas fa-sitemap"></i> Visual Diagrams</span>
                </div>

                <!-- Group Management -->
                <div class="card">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-sm);">
                        <div class="stat-icon success">
                            <i class="fas fa-users"></i>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0;">Group Management</h3>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">
                        Create and manage role-assignable security groups. Add/remove members with an intuitive interface.
                    </p>
                    <span class="badge badge-success"><i class="fas fa-user-plus"></i> Member Management</span>
                </div>

                <!-- Role Explorer -->
                <div class="card">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-sm);">
                        <div class="stat-icon warning">
                            <i class="fas fa-user-shield"></i>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0;">Entra Roles Explorer</h3>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">
                        Browse all Azure AD roles with privilege levels. Search, filter, and understand role permissions.
                    </p>
                    <span class="badge badge-warning"><i class="fas fa-shield-alt"></i> Privilege Levels</span>
                </div>

                <!-- Import/Export -->
                <div class="card">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-sm);">
                        <div class="stat-icon info">
                            <i class="fas fa-file-export"></i>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0;">Import/Export</h3>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">
                        Export configurations for backup or compliance. Import templates to replicate setups across tenants.
                    </p>
                    <span class="badge badge-info"><i class="fas fa-download"></i> Backup & Restore</span>
                </div>
            </div>

            <!-- Call to Action -->
            <div class="card" style="background: linear-gradient(135deg, var(--accent-primary-dim), var(--accent-secondary-dim)); border: 2px solid var(--accent-primary); text-align: center; padding: var(--space-xl);">
                <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: var(--space-md);">
                    Ready to Transform Your PIM Management?
                </h2>
                <p style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: var(--space-lg); max-width: 600px; margin-left: auto; margin-right: auto;">
                    Connect to your Microsoft Entra ID tenant and start managing privileged access with enterprise-grade tools in minutes.
                </p>
                <button class="btn btn-primary" onclick="document.getElementById('connect-btn').click()" style="font-size: 1.2rem; padding: var(--space-md) var(--space-xl); box-shadow: 0 10px 30px rgba(0, 212, 170, 0.4);">
                    <i class="fas fa-plug"></i> Connect Now
                </button>
            </div>

            <!-- Footer Info -->
            <div style="text-align: center; margin-top: var(--space-xl); padding: var(--space-lg); color: var(--text-muted);">
                <p style="margin-bottom: var(--space-sm);">
                    <i class="fas fa-shield-check" style="color: var(--accent-primary);"></i>
                    Built with enterprise security in mind
                </p>
                <p style="font-size: 0.9rem;">
                    PIMBuddy v1.0.0 | Powered by Microsoft Graph API | Zero Trust Ready
                </p>
            </div>
        `}sortRolesByPrivilege(e,a){const s={critical:0,high:1,medium:2,low:3};return[...e].sort((t,i)=>a==="privilege-desc"?s[t.privilegeLevel]-s[i.privilegeLevel]:a==="privilege-asc"?s[i.privilegeLevel]-s[t.privilegeLevel]:a==="name-asc"?t.displayName.localeCompare(i.displayName):a==="name-desc"?i.displayName.localeCompare(t.displayName):0)}sortRoles(e){e==="privilege"?e=this.roleSortOrder==="privilege-desc"?"privilege-asc":"privilege-desc":e==="name"&&(e=this.roleSortOrder==="name-asc"?"name-desc":"name-asc"),this.roleSortOrder=e,this.renderPage("roles")}handleActivityPageChange(e){this.paginators.activity.goToPage(e),this.renderPage("pim-activity")}handleActivityPageSizeChange(e){this.paginators.activity.setPageSize(e),this.renderPage("pim-activity")}showGlobalSearch(){this.showToast("Global search coming soon","info")}exportActivityToCSV(){try{const e=this.paginators.activity.allItems||[];if(e.length===0){this.showToast("No activity logs to export","warning");return}const a=n.generateFilename("pim-activity");n.exportToCSV(e,a,w.activity.columns),this.showToast(`Exported ${e.length} activity logs to CSV`,"success")}catch(e){this.showToast(`Export failed: ${e.message}`,"error")}}exportActivityToJSON(){try{const e=this.paginators.activity.allItems||[];if(e.length===0){this.showToast("No activity logs to export","warning");return}const a=n.generateFilename("pim-activity");n.exportToJSON(e,a),this.showToast(`Exported ${e.length} activity logs to JSON`,"success")}catch(e){this.showToast(`Export failed: ${e.message}`,"error")}}showExportMenu(e){const a=`
            <div style="text-align: center; padding: var(--space-xl);">
                <div style="width: 80px; height: 80px; margin: 0 auto var(--space-lg); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-file-export" style="font-size: 2.5rem; color: var(--accent-primary);"></i>
                </div>

                <h2 style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; margin-bottom: var(--space-md);">
                    Export ${e.charAt(0).toUpperCase()+e.slice(1)}
                </h2>

                <p style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--space-xl);">
                    Choose your preferred export format
                </p>

                <div style="display: flex; flex-direction: column; gap: var(--space-md); max-width: 400px; margin: 0 auto;">
                    <button class="btn btn-primary" onclick="app.export${e.charAt(0).toUpperCase()+e.slice(1)}ToCSV(); app.closeModal();" style="justify-content: center; font-family: var(--font-mono); padding: var(--space-md);">
                        <i class="fas fa-file-csv"></i> Export as CSV
                        <span style="font-size: 0.75rem; opacity: 0.7; margin-left: auto;">Spreadsheet compatible</span>
                    </button>

                    <button class="btn btn-secondary" onclick="app.export${e.charAt(0).toUpperCase()+e.slice(1)}ToJSON(); app.closeModal();" style="justify-content: center; font-family: var(--font-mono); padding: var(--space-md);">
                        <i class="fas fa-file-code"></i> Export as JSON
                        <span style="font-size: 0.75rem; opacity: 0.7; margin-left: auto;">Developer friendly</span>
                    </button>
                </div>

                <button class="btn btn-secondary btn-sm" onclick="app.closeModal()" style="margin-top: var(--space-xl); font-family: var(--font-mono);">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        `;this.showModal(a)}async applyTemplateToRole(e){const a=p.getAllTemplates(),s=`
            <h2><i class="fas fa-copy"></i> Apply Template to Role</h2>
            <p>Select a template to apply its settings to this role's PIM policy.</p>

            <div class="template-select-list">
                ${Object.values(a).map(t=>`
                    <div class="template-select-item" onclick="app.executeApplyTemplateToRole('${e}', '${t.id}')">
                        <div class="template-icon ${t.color||"primary"}">
                            <i class="fas ${t.icon}"></i>
                        </div>
                        <div class="template-info">
                            <strong>${this.escapeHtml(t.name)}</strong>
                            <span>${t.settings.activation.maximumDurationHours}h | MFA: ${t.settings.activation.requireMfa?"Yes":"No"} | Approval: ${t.settings.activation.requireApproval?"Yes":"No"}</span>
                        </div>
                    </div>
                `).join("")}
            </div>

            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
            </div>
        `;this.showModal(s)}async executeApplyTemplateToRole(e,a){const s=p.getTemplate(a);if(!s){this.showToast("Template not found","error");return}this.closeModal(),this.showLoading("Applying template...");const t=await b.updateRolePolicy(e,{maximumDurationHours:s.settings.activation.maximumDurationHours,requireMfa:s.settings.activation.requireMfa,requireJustification:s.settings.activation.requireJustification,requireTicketInfo:s.settings.activation.requireTicketInfo,requireApproval:s.settings.activation.requireApproval});if(this.hideLoading(),t.success){this.showToast("Template applied successfully","success");const i=document.querySelector(".policy-editor h2")?.textContent;i&&await this.selectRoleForPolicy(e,i)}else this.showToast(t.error,"error")}exportConfig(){this.showToast("Export coming soon","info")}handleImport(e){e.length>0&&this.showToast(`Selected file: ${e[0].name}`,"info")}showLoading(e="Loading..."){document.getElementById("loading-text").textContent=e,document.getElementById("loading-overlay").classList.remove("hidden"),c.announceLoading(!0,e)}hideLoading(){document.getElementById("loading-overlay").classList.add("hidden"),c.announceLoading(!1)}showToast(e,a="info"){const s=document.getElementById("toast-container"),t=document.createElement("div");t.className=`toast toast-${a}`,t.innerHTML=`
            <i class="fas fa-${a==="success"?"check-circle":a==="error"?"exclamation-circle":"info-circle"}"></i>
            <span>${this.escapeHtml(e)}</span>
        `,s.appendChild(t),setTimeout(()=>{t.classList.add("fade-out"),setTimeout(()=>t.remove(),300)},3e3)}showModal(e){document.getElementById("modal-content").innerHTML=e,document.getElementById("modal-container").classList.remove("hidden")}closeModal(){document.getElementById("modal-container").classList.add("hidden")}toggleTheme(){this.isDarkMode=!this.isDarkMode,this.applyTheme(),localStorage.setItem("pimbuddy-theme",this.isDarkMode?"dark":"light")}setTheme(e){this.isDarkMode=e==="dark",this.applyTheme(),localStorage.setItem("pimbuddy-theme",e)}loadTheme(){const e=localStorage.getItem("pimbuddy-theme");this.isDarkMode=e!=="light",this.applyTheme()}applyTheme(){document.body.classList.toggle("dark-mode",this.isDarkMode);const e=document.querySelector("#theme-toggle i");e&&(e.className=this.isDarkMode?"fas fa-sun":"fas fa-moon")}escapeHtml(e){return A.escapeHtml(e)}}const m=new N;window.app=m;m.init();
//# sourceMappingURL=index-D2yQ3pK2.js.map
