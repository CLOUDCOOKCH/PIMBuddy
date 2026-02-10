import{B as y}from"./core-rjX7nIO3.js";import{p as o,g as n}from"./services-DF6cB9Vv.js";class L extends y{constructor(a){super(a)}async render(a,d={}){const t=o.getDiagramTypes();a.innerHTML=`
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
                            ${Object.entries(t).map(([e,s])=>`
                                <label class="diagram-type-option ${e==="full-hierarchy"?"selected":""}" data-type="${e}">
                                    <input type="radio" name="diagram-type" value="${e}" ${e==="full-hierarchy"?"checked":""}>
                                    <i class="fas ${s.icon}"></i>
                                    <span class="type-name">${s.name}</span>
                                    <span class="type-desc">${s.description}</span>
                                </label>
                            `).join("")}
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

                    <button class="btn btn-primary btn-block" id="generate-diagram-btn" ${this.isConnected()?"":"disabled"} aria-label="Generate Mermaid diagram">
                        <i class="fas fa-magic"></i> Generate Diagram
                    </button>

                    <div id="pimmaid-stats" class="pimmaid-stats hidden"></div>
                </div>

                <div class="pimmaid-output card">
                    <div class="pimmaid-output-header">
                        <h3><i class="fas fa-code"></i> Mermaid Output</h3>
                        <div class="pimmaid-actions">
                            <button class="btn btn-sm btn-secondary" id="copy-mermaid-btn" disabled aria-label="Copy Mermaid code">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                            <button class="btn btn-sm btn-secondary" id="download-mermaid-btn" disabled aria-label="Download Mermaid code">
                                <i class="fas fa-download"></i> Download
                            </button>
                            <button class="btn btn-sm btn-secondary" id="live-mermaid-btn" disabled aria-label="Open in Mermaid Live Editor">
                                <i class="fas fa-external-link-alt"></i> Open in Mermaid Live
                            </button>
                        </div>
                    </div>

                    <div class="pimmaid-code-container">
                        <pre id="pimmaid-code" class="pimmaid-code">${this.isConnected()?'// Click "Generate Diagram" to create your PIM visualization':"// Connect to Azure AD to generate diagrams"}</pre>
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
        `,document.querySelectorAll(".diagram-type-option").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".diagram-type-option").forEach(s=>s.classList.remove("selected")),e.classList.add("selected"),e.querySelector("input").checked=!0})}),document.getElementById("generate-diagram-btn")?.addEventListener("click",()=>{this.generateDiagram()}),document.getElementById("copy-mermaid-btn")?.addEventListener("click",()=>{this.copyCode()}),document.getElementById("download-mermaid-btn")?.addEventListener("click",()=>{this.downloadCode()}),document.getElementById("live-mermaid-btn")?.addEventListener("click",()=>{this.openInMermaidLive()})}async generateDiagram(){const a=document.querySelector('input[name="diagram-type"]:checked')?.value||"full-hierarchy",d=document.getElementById("pimmaid-eligible").checked,t=document.getElementById("pimmaid-active").checked,e=document.getElementById("pimmaid-direction").value;this.showLoading("Fetching PIM data...");try{const[s,l]=await Promise.all([n.getPIMGroups(),n.getRoleDefinitions()]);if(!s.success||!l.success)throw new Error("Failed to fetch PIM data");const c=s.groups,v=l.roles;this.showLoading("Fetching assignments...");let r={},m={};["user-group","full-hierarchy"].includes(a)&&(r=(await n.getAllGroupAssignments(c)).assignments||{}),["group-role","full-hierarchy","role-assignments"].includes(a)&&(m=(await n.getAllRoleAssignments()).assignments||{}),this.hideLoading();const p={groups:c,roles:v,groupAssignments:r,roleAssignments:m},b={showEligible:d,showActive:t,direction:e},g=o.generateDiagram(a,p,b),i=o.getStats(p);document.getElementById("pimmaid-code").textContent=g,document.getElementById("copy-mermaid-btn").disabled=!1,document.getElementById("download-mermaid-btn").disabled=!1,document.getElementById("live-mermaid-btn").disabled=!1;const u=document.getElementById("pimmaid-stats");u.innerHTML=`
                <h4><i class="fas fa-chart-bar"></i> Statistics</h4>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-value">${i.totalUsers}</span>
                        <span class="stat-label">Users</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${i.totalGroups}</span>
                        <span class="stat-label">Groups</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${i.totalRoles}</span>
                        <span class="stat-label">Roles</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${i.eligibleAssignments}</span>
                        <span class="stat-label">Eligible</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${i.activeAssignments}</span>
                        <span class="stat-label">Active</span>
                    </div>
                </div>
                <div class="role-stats">
                    <span class="badge privilege-badge badge-critical">${i.rolesByPrivilege.critical} Critical</span>
                    <span class="badge privilege-badge badge-high">${i.rolesByPrivilege.high} High</span>
                    <span class="badge privilege-badge badge-medium">${i.rolesByPrivilege.medium} Medium</span>
                    <span class="badge privilege-badge badge-low">${i.rolesByPrivilege.low} Low</span>
                </div>
            `,u.classList.remove("hidden"),document.getElementById("pimmaid-preview").innerHTML=`
                <div class="preview-placeholder">
                    <i class="fas fa-check-circle"></i>
                    <p>Diagram generated! Copy the code or open in Mermaid Live to view.</p>
                    <p class="code-lines">${g.split(`
`).length} lines generated</p>
                </div>
            `,this.showToast("Diagram generated successfully","success")}catch(s){this.hideLoading(),this.showToast("Failed to generate diagram: "+s.message,"error")}}copyCode(){const a=document.getElementById("pimmaid-code").textContent;navigator.clipboard.writeText(a).then(()=>{this.showToast("Mermaid code copied to clipboard","success")}).catch(()=>{this.showToast("Failed to copy","error")})}downloadCode(){const a=document.getElementById("pimmaid-code").textContent,d=new Blob([a],{type:"text/plain"}),t=URL.createObjectURL(d),e=document.createElement("a");e.href=t,e.download=`pimmaid-diagram-${new Date().toISOString().split("T")[0]}.mmd`,document.body.appendChild(e),e.click(),document.body.removeChild(e),URL.revokeObjectURL(t),this.showToast("Diagram downloaded","success")}openInMermaidLive(){const d={code:document.getElementById("pimmaid-code").textContent,mermaid:{theme:"dark"}},t=btoa(JSON.stringify(d));window.open(`https://mermaid.live/edit#base64:${t}`,"_blank")}async refreshPage(){await this.app.router.refreshCurrentPage()}}export{L as P};
//# sourceMappingURL=page-pimmaidpage-BzO5PJHb.js.map
