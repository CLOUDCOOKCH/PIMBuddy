class o{static encodeODataFilter(e){return e?e.replace(/'/g,"''").replace(/\\/g,"\\\\").replace(/\$/g,"\\$").replace(/\(/g,"\\(").replace(/\)/g,"\\)"):""}static buildODataFilter(e,t,a){const s=this.encodeODataFilter(a);if(!["eq","ne","gt","ge","lt","le","startswith","endswith","contains"].includes(t.toLowerCase()))throw new Error(`Invalid OData operator: ${t}`);return["startswith","endswith","contains"].includes(t.toLowerCase())?`${t}(${e},'${s}')`:`${e} ${t} '${s}'`}static escapeHtml(e){if(e==null)return"";typeof e!="string"&&(e=String(e));const t=document.createElement("div");return t.textContent=e,t.innerHTML}static escapeHtmlAttribute(e){return e==null?"":(typeof e!="string"&&(e=String(e)),e.replace(/&/g,"&amp;").replace(/'/g,"&#39;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"))}static sanitizeUrl(e){if(!e)return"";const t=e.trim().toLowerCase();return["javascript:","data:","vbscript:","file:"].some(s=>t.startsWith(s))?(console.warn(`Blocked dangerous URL: ${e}`),""):e}static validateInput(e,t={}){const{maxLength:a=1e3,minLength:s=0,allowedChars:i=null,required:n=!1}=t;return n&&(!e||e.trim().length===0)?{valid:!1,error:"This field is required",sanitized:""}:e&&e.length>a?{valid:!1,error:`Maximum length is ${a} characters`,sanitized:e.substring(0,a)}:e&&e.length<s?{valid:!1,error:`Minimum length is ${s} characters`,sanitized:e}:i&&e&&!new RegExp(i).test(e)?{valid:!1,error:"Input contains invalid characters",sanitized:e}:{valid:!0,sanitized:e||"",error:null}}}class g{constructor(){this.requests=new Map,this.limits={default:{maxRequests:60,windowMs:6e4},search:{maxRequests:30,windowMs:6e4},mutation:{maxRequests:20,windowMs:6e4}}}isAllowed(e,t="default"){const a=Date.now(),s=this.limits[t]||this.limits.default;this.requests.has(e)||this.requests.set(e,[]);const n=this.requests.get(e).filter(r=>a-r<s.windowMs);return n.length>=s.maxRequests?!1:(n.push(a),this.requests.set(e,n),!0)}getResetTime(e,t="default"){const a=this.limits[t]||this.limits.default;if(!this.requests.has(e))return 0;const s=this.requests.get(e);if(s.length===0)return 0;const n=Math.min(...s)+a.windowMs,r=Date.now();return Math.max(0,Math.ceil((n-r)/1e3))}clear(e){this.requests.delete(e)}clearAll(){this.requests.clear()}}class u{constructor(e=15,t=10){this.timeoutMs=e*60*1e3,this.warningMs=t*60*1e3,this.lastActivity=Date.now(),this.warningShown=!1,this.timeoutCallback=null,this.warningCallback=null,this.checkInterval=null}start(e,t){this.timeoutCallback=e,this.warningCallback=t,this.lastActivity=Date.now(),this.warningShown=!1,["mousedown","keydown","scroll","touchstart"].forEach(a=>{document.addEventListener(a,()=>this.recordActivity(),{passive:!0})}),this.checkInterval=setInterval(()=>this.checkSession(),3e4)}recordActivity(){this.lastActivity=Date.now(),this.warningShown=!1}checkSession(){const t=Date.now()-this.lastActivity;if(t>=this.timeoutMs){this.stop(),this.timeoutCallback&&this.timeoutCallback();return}if(t>=this.warningMs&&!this.warningShown&&(this.warningShown=!0,this.warningCallback)){const a=Math.ceil((this.timeoutMs-t)/6e4);this.warningCallback(a)}}stop(){this.checkInterval&&(clearInterval(this.checkInterval),this.checkInterval=null)}reset(){this.lastActivity=Date.now(),this.warningShown=!1}getRemainingMinutes(){const t=Date.now()-this.lastActivity,a=this.timeoutMs-t;return Math.max(0,Math.ceil(a/6e4))}}const p=new g,f=new u(15,10),m={DEFAULT_PAGE_SIZE:50,PAGE_SIZE_OPTIONS:[20,50,100,200]};class v{constructor(e=[],t=m.DEFAULT_PAGE_SIZE){this.allItems=e,this.pageSize=t,this.currentPage=1,this.totalPages=Math.ceil(e.length/t)}getCurrentPageItems(){const e=(this.currentPage-1)*this.pageSize,t=e+this.pageSize;return this.allItems.slice(e,t)}goToPage(e){return e<1||e>this.totalPages?!1:(this.currentPage=e,!0)}nextPage(){return this.goToPage(this.currentPage+1)}previousPage(){return this.goToPage(this.currentPage-1)}firstPage(){this.currentPage=1}lastPage(){this.currentPage=this.totalPages}updateItems(e){this.allItems=e,this.totalPages=Math.ceil(e.length/this.pageSize),this.currentPage>this.totalPages&&(this.currentPage=Math.max(1,this.totalPages))}setPageSize(e){this.pageSize=e,this.totalPages=Math.ceil(this.allItems.length/this.pageSize);const t=(this.currentPage-1)*this.pageSize;this.currentPage=Math.floor(t/e)+1}getInfo(){const e=(this.currentPage-1)*this.pageSize+1,t=Math.min(e+this.pageSize-1,this.allItems.length);return{currentPage:this.currentPage,totalPages:this.totalPages,pageSize:this.pageSize,totalItems:this.allItems.length,start:e,end:t,hasNext:this.currentPage<this.totalPages,hasPrevious:this.currentPage>1}}getPageNumbers(e=7){if(this.totalPages<=e)return Array.from({length:this.totalPages},(n,r)=>r+1);const t=Math.floor(e/2);let a=Math.max(1,this.currentPage-t),s=Math.min(this.totalPages,a+e-1);s-a<e-1&&(a=Math.max(1,s-e+1));const i=[];a>1&&(i.push(1),a>2&&i.push("..."));for(let n=a;n<=s;n++)i.push(n);return s<this.totalPages&&(s<this.totalPages-1&&i.push("..."),i.push(this.totalPages)),i}renderControls(e="app.handlePageChange"){const t=this.getInfo();if(t.totalPages<=1)return"";const a=this.getPageNumbers();return`
            <div class="pagination-controls" style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-md); border-top: 1px solid var(--border-subtle); gap: var(--space-md); flex-wrap: wrap;">
                <!-- Page Info -->
                <div style="font-size: 0.85rem; color: var(--text-secondary); font-family: var(--font-mono);">
                    Showing <strong>${t.start}-${t.end}</strong> of <strong>${t.totalItems}</strong> items
                </div>

                <!-- Page Navigation -->
                <div style="display: flex; align-items: center; gap: var(--space-xs);">
                    <!-- First Page -->
                    <button
                        class="btn btn-sm btn-secondary"
                        onclick="${e}(1)"
                        ${t.hasPrevious?"":"disabled"}
                        title="First Page"
                        style="padding: var(--space-xs) var(--space-sm);">
                        <i class="fas fa-angle-double-left"></i>
                    </button>

                    <!-- Previous Page -->
                    <button
                        class="btn btn-sm btn-secondary"
                        onclick="${e}(${t.currentPage-1})"
                        ${t.hasPrevious?"":"disabled"}
                        title="Previous Page"
                        style="padding: var(--space-xs) var(--space-sm);">
                        <i class="fas fa-angle-left"></i>
                    </button>

                    <!-- Page Numbers -->
                    ${a.map(s=>s==="..."?'<span style="padding: 0 var(--space-xs); color: var(--text-muted);">...</span>':`
                            <button
                                class="btn btn-sm ${s===t.currentPage?"btn-primary":"btn-secondary"}"
                                onclick="${e}(${s})"
                                style="min-width: 36px; padding: var(--space-xs) var(--space-sm); font-family: var(--font-mono); font-size: 0.85rem;">
                                ${s}
                            </button>
                        `).join("")}

                    <!-- Next Page -->
                    <button
                        class="btn btn-sm btn-secondary"
                        onclick="${e}(${t.currentPage+1})"
                        ${t.hasNext?"":"disabled"}
                        title="Next Page"
                        style="padding: var(--space-xs) var(--space-sm);">
                        <i class="fas fa-angle-right"></i>
                    </button>

                    <!-- Last Page -->
                    <button
                        class="btn btn-sm btn-secondary"
                        onclick="${e}(${t.totalPages})"
                        ${t.hasNext?"":"disabled"}
                        title="Last Page"
                        style="padding: var(--space-xs) var(--space-sm);">
                        <i class="fas fa-angle-double-right"></i>
                    </button>
                </div>

                <!-- Page Size Selector -->
                <div style="display: flex; align-items: center; gap: var(--space-sm);">
                    <label style="font-size: 0.85rem; color: var(--text-secondary); font-family: var(--font-mono);">Items per page:</label>
                    <select
                        class="input input-select"
                        onchange="${e.replace("handlePageChange","handlePageSizeChange")}(parseInt(this.value))"
                        style="padding: var(--space-xs) var(--space-sm); font-size: 0.85rem; min-width: 80px;">
                        ${m.PAGE_SIZE_OPTIONS.map(s=>`
                            <option value="${s}" ${s===t.pageSize?"selected":""}>${s}</option>
                        `).join("")}
                    </select>
                </div>
            </div>
        `}}class y{static exportToCSV(e,t,a=null){if(!e||e.length===0)throw new Error("No data to export");if(!a){const r=e[0];a=Object.keys(r).map(c=>({key:c,header:this.formatHeader(c)}))}const i=[a.map(r=>this.escapeCSVValue(r.header)).join(",")];for(const r of e){const c=a.map(d=>{const h=this.getNestedValue(r,d.key);return this.escapeCSVValue(this.formatCSVValue(h))});i.push(c.join(","))}const n=i.join(`
`);this.downloadFile(n,`${t}.csv`,"text/csv;charset=utf-8;")}static exportToJSON(e,t,a=!0){if(!e)throw new Error("No data to export");const s=JSON.stringify(e,null,a?2:0);this.downloadFile(s,`${t}.json`,"application/json;charset=utf-8;")}static formatHeader(e){return e.replace(/([A-Z])/g," $1").replace(/^./,t=>t.toUpperCase()).trim()}static getNestedValue(e,t){if(!t)return e;const a=t.split(".");let s=e;for(const i of a){if(s==null)return"";s=s[i]}return s}static formatCSVValue(e){return e==null?"":typeof e=="boolean"?e?"Yes":"No":e instanceof Date?e.toISOString():typeof e=="object"?JSON.stringify(e):String(e)}static escapeCSVValue(e){const t=String(e);return t.includes(",")||t.includes('"')||t.includes(`
`)?`"${t.replace(/"/g,'""')}"`:t}static downloadFile(e,t,a){const s=new Blob([e],{type:a}),i=URL.createObjectURL(s),n=document.createElement("a");n.href=i,n.download=t,n.style.display="none",document.body.appendChild(n),n.click(),setTimeout(()=>{document.body.removeChild(n),URL.revokeObjectURL(i)},100)}static generateFilename(e){const t=new Date().toISOString().replace(/[:.]/g,"-").slice(0,-5);return`${e}_${t}`}}const b={groups:{columns:[{key:"displayName",header:"Group Name"},{key:"description",header:"Description"},{key:"memberCount",header:"Members"},{key:"ownerCount",header:"Owners"},{key:"createdDateTime",header:"Created Date"},{key:"id",header:"Object ID"}]},roles:{columns:[{key:"displayName",header:"Role Name"},{key:"description",header:"Description"},{key:"privilegeLevel",header:"Privilege Level"},{key:"isBuiltIn",header:"Built-in"},{key:"id",header:"Role ID"}]},activity:{columns:[{key:"activityDateTime",header:"Date/Time"},{key:"activityDisplayName",header:"Activity"},{key:"initiatedBy.user.displayName",header:"Initiated By"},{key:"initiatedBy.user.userPrincipalName",header:"UPN"},{key:"category",header:"Category"},{key:"result",header:"Result"}]},policies:{columns:[{key:"displayName",header:"Policy Name"},{key:"scopeId",header:"Scope ID"},{key:"scopeType",header:"Scope Type"},{key:"isOrganizationDefault",header:"Is Default"}]},approvals:{columns:[{key:"principalDisplayName",header:"User"},{key:"principalUserPrincipalName",header:"UPN"},{key:"roleDisplayName",header:"Role"},{key:"requestedDateTime",header:"Requested"},{key:"justification",header:"Justification"},{key:"status",header:"Status"}]}};class ${constructor(){this.selectedItems=new Set,this.allItems=[],this.onSelectionChange=null}initialize(e,t=null){this.allItems=e,this.selectedItems.clear(),this.onSelectionChange=t}toggleItem(e){this.selectedItems.has(e)?this.selectedItems.delete(e):this.selectedItems.add(e),this.onSelectionChange&&this.onSelectionChange(this.getSelectedItems())}selectAll(){this.selectedItems.clear(),this.allItems.forEach(e=>{this.selectedItems.add(e.id)}),this.onSelectionChange&&this.onSelectionChange(this.getSelectedItems())}clearSelection(){this.selectedItems.clear(),this.onSelectionChange&&this.onSelectionChange(this.getSelectedItems())}isSelected(e){return this.selectedItems.has(e)}getSelectedIds(){return Array.from(this.selectedItems)}getSelectedItems(){return this.allItems.filter(e=>this.selectedItems.has(e.id))}getSelectionCount(){return this.selectedItems.size}areAllSelected(){return this.selectedItems.size===this.allItems.length&&this.allItems.length>0}areSomeSelected(){return this.selectedItems.size>0&&this.selectedItems.size<this.allItems.length}renderHeaderCheckbox(e="app.bulkOps.toggleAll"){const t=this.areAllSelected();return`
            <input
                type="checkbox"
                class="bulk-checkbox header-checkbox ${this.areSomeSelected()?"indeterminate":""}"
                ${t?"checked":""}
                onchange="${e}(this)"
                title="${t?"Deselect All":"Select All"}"
            >
        `}renderRowCheckbox(e,t="app.bulkOps.toggleItem"){return`
            <input
                type="checkbox"
                class="bulk-checkbox"
                ${this.isSelected(e)?"checked":""}
                onchange="${t}('${e}')"
                data-item-id="${e}"
            >
        `}renderBulkActionsToolbar(e=[]){const t=this.getSelectionCount();return t===0?"":`
            <div class="bulk-actions-toolbar" style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); background: var(--accent-primary-dim); border: 1px solid var(--accent-primary); border-radius: var(--radius-md); margin-bottom: var(--space-md); animation: slideDown 0.2s ease-out;">
                <div style="display: flex; align-items: center; gap: var(--space-sm); flex: 1;">
                    <div style="width: 32px; height: 32px; background: var(--accent-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-check" style="color: var(--bg-primary); font-size: 0.9rem;"></i>
                    </div>
                    <div>
                        <div style="font-family: var(--font-display); font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">
                            ${t} ${t===1?"item":"items"} selected
                        </div>
                        <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">
                            Choose an action below
                        </div>
                    </div>
                </div>

                <div style="display: flex; align-items: center; gap: var(--space-sm);">
                    ${e.map(a=>`
                        <button
                            class="btn btn-sm ${a.variant||"btn-secondary"}"
                            onclick="${a.onClick}"
                            ${a.disabled?"disabled":""}
                            title="${a.description||a.label}"
                            style="font-family: var(--font-mono); font-size: 0.75rem;">
                            <i class="fas ${a.icon}"></i> ${a.label}
                        </button>
                    `).join("")}

                    <button
                        class="btn btn-sm btn-secondary"
                        onclick="app.bulkOps.clearSelection()"
                        title="Clear Selection"
                        style="font-family: var(--font-mono); font-size: 0.75rem;">
                        <i class="fas fa-times"></i> Clear
                    </button>
                </div>
            </div>
        `}}async function x(l,e,t,a){const s={total:l.length,succeeded:0,failed:0,errors:[]};for(let i=0;i<l.length;i++){const n=l[i];try{await e(n),s.succeeded++}catch(r){s.failed++,s.errors.push({item:n,error:r.message})}t&&t({current:i+1,total:l.length,percentage:Math.round((i+1)/l.length*100)}),i<l.length-1&&await new Promise(r=>setTimeout(r,200))}return a&&a(s),s}function w(l){const e=l.percentage||0;return`
        <div style="text-align: center; padding: var(--space-xl);">
            <div style="width: 80px; height: 80px; margin: 0 auto var(--space-lg); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center; animation: pulse 2s ease-in-out infinite;">
                <i class="fas fa-cog fa-spin" style="font-size: 2.5rem; color: var(--accent-primary);"></i>
            </div>

            <h2 style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; margin-bottom: var(--space-sm);">
                Processing Bulk Operation
            </h2>

            <p style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--space-xl);">
                ${l.current} of ${l.total} items processed
            </p>

            <!-- Progress Bar -->
            <div style="width: 100%; height: 8px; background: var(--bg-elevated); border-radius: var(--radius-full); overflow: hidden; margin-bottom: var(--space-sm);">
                <div style="width: ${e}%; height: 100%; background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)); transition: width 0.3s ease-out;"></div>
            </div>

            <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: var(--accent-primary);">
                ${e}%
            </div>

            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: var(--space-lg); font-family: var(--font-mono);">
                Please wait while we process your request...
            </p>
        </div>
    `}function k(l){const e=l.failed>0;return`
        <div style="text-align: center; padding: var(--space-xl);">
            <div style="width: 100px; height: 100px; margin: 0 auto var(--space-lg); background: ${e?"var(--color-warning-dim)":"var(--color-success-dim)"}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <i class="fas ${e?"fa-exclamation-triangle":"fa-check-circle"}" style="font-size: 3.5rem; color: ${e?"var(--color-warning)":"var(--color-success)"};"></i>
            </div>

            <h2 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; margin-bottom: var(--space-md);">
                ${e?"Partially Complete":"Operation Complete"}
            </h2>

            <div class="stats-grid" style="margin-bottom: var(--space-lg);">
                <div class="card stat-card" style="text-align: center;">
                    <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; color: var(--color-success);">
                        ${l.succeeded}
                    </div>
                    <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">
                        Succeeded
                    </div>
                </div>

                ${e?`
                    <div class="card stat-card" style="text-align: center;">
                        <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; color: var(--color-error);">
                            ${l.failed}
                        </div>
                        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">
                            Failed
                        </div>
                    </div>
                `:""}
            </div>

            ${e&&l.errors.length>0?`
                <details style="text-align: left; margin-top: var(--space-lg); padding: var(--space-md); background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                    <summary style="cursor: pointer; font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">
                        View Errors (${l.errors.length})
                    </summary>
                    <div style="margin-top: var(--space-md); max-height: 200px; overflow-y: auto;">
                        ${l.errors.map(t=>`
                            <div style="padding: var(--space-sm); margin-bottom: var(--space-xs); background: var(--color-error-dim); border-left: 3px solid var(--color-error); border-radius: var(--radius-sm); font-size: 0.85rem; font-family: var(--font-mono);">
                                <strong>${t.item.displayName||t.item.id}:</strong> ${t.error}
                            </div>
                        `).join("")}
                    </div>
                </details>
            `:""}

            <button class="btn btn-primary" onclick="app.closeModal()" style="margin-top: var(--space-xl); font-family: var(--font-mono);">
                <i class="fas fa-check"></i> Done
            </button>
        </div>
    `}class S{static renderPageHeader(e,t=[]){return`
            <div class="page-header-row">
                <h1 class="page-header">${o.escapeHtml(e)}</h1>
                ${t.length>0?`
                    <div style="display: flex; gap: var(--space-sm);">
                        ${t.map(a=>`
                            <button
                                class="btn ${a.variant||"btn-primary"}"
                                onclick="${a.onClick}"
                                ${a.disabled?"disabled":""}
                                title="${a.description||a.label}">
                                ${a.icon?`<i class="fas ${a.icon}"></i>`:""} ${o.escapeHtml(a.label)}
                            </button>
                        `).join("")}
                    </div>
                `:""}
            </div>
        `}static renderToolbar(e={}){const{searchPlaceholder:t="Search...",searchId:a="search",searchCallback:s=null,actions:i=[],filters:n=[]}=e;return`
            <div class="toolbar">
                ${s?`
                    <input
                        type="text"
                        id="${a}"
                        class="input"
                        placeholder="${t}"
                        oninput="${s}(this.value)">
                `:""}

                ${n.map(r=>`
                    <select
                        id="${r.id}"
                        class="input input-select"
                        onchange="${r.onChange}(this.value)">
                        ${r.options.map(c=>`
                            <option value="${c.value}" ${c.selected?"selected":""}>
                                ${o.escapeHtml(c.label)}
                            </option>
                        `).join("")}
                    </select>
                `).join("")}

                ${i.map(r=>`
                    <button
                        class="btn ${r.variant||"btn-secondary"}"
                        onclick="${r.onClick}"
                        ${r.disabled?"disabled":""}
                        title="${r.description||r.label}">
                        ${r.icon?`<i class="fas ${r.icon}"></i>`:""} ${o.escapeHtml(r.label)}
                    </button>
                `).join("")}
            </div>
        `}static renderBadge(e,t="default"){return`<span class="badge ${t!=="default"?`badge-${t}`:""}">${o.escapeHtml(e)}</span>`}static renderPrivilegeBadge(e){const t={critical:{class:"badge-critical",icon:"fa-skull-crossbones",label:"Critical"},high:{class:"badge-high",icon:"fa-exclamation-triangle",label:"High"},medium:{class:"badge-medium",icon:"fa-shield-alt",label:"Medium"},low:{class:"badge-low",icon:"fa-check-circle",label:"Low"}},a=t[e]||t.low;return`<span class="badge privilege-badge ${a.class}"><i class="fas ${a.icon}"></i> ${a.label}</span>`}static renderIconButton(e,t,a={}){const{title:s="",variant:i="",disabled:n=!1,size:r=""}=a;return`
            <button
                class="icon-btn ${i} ${r}"
                onclick="${t}"
                ${n?"disabled":""}
                title="${s}">
                <i class="fas ${e}"></i>
            </button>
        `}static renderEmptyState(e={}){const{icon:t="fa-inbox",title:a="No Data",message:s="No items found",action:i=null}=e;return`
            <div class="empty-state" style="text-align: center; padding: var(--space-2xl) var(--space-lg); color: var(--text-secondary);">
                <div style="width: 120px; height: 120px; margin: 0 auto var(--space-xl); background: var(--bg-elevated); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas ${t}" style="font-size: 3.5rem; color: var(--text-muted); opacity: 0.5;"></i>
                </div>
                <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin-bottom: var(--space-sm); color: var(--text-primary);">
                    ${o.escapeHtml(a)}
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-muted); margin-bottom: ${i?"var(--space-xl)":"0"};">
                    ${o.escapeHtml(s)}
                </div>
                ${i?`
                    <button class="btn btn-primary" onclick="${i.onClick}">
                        ${i.icon?`<i class="fas ${i.icon}"></i>`:""} ${o.escapeHtml(i.label)}
                    </button>
                `:""}
            </div>
        `}static renderLoadingState(e="Loading..."){return`
            <div class="loading-state" style="text-align: center; padding: var(--space-2xl) var(--space-lg);">
                <div style="width: 80px; height: 80px; margin: 0 auto var(--space-lg); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center; animation: pulse 2s ease-in-out infinite;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 2.5rem; color: var(--accent-primary);"></i>
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-secondary);">
                    ${o.escapeHtml(e)}
                </div>
            </div>
        `}static renderStatCard(e={}){const{icon:t="fa-chart-bar",value:a="0",label:s="Stat",color:i="primary",trend:n=null}=e;return`
            <div class="card stat-card" style="position: relative; overflow: hidden;">
                <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, var(--accent-${i}-dim), transparent); filter: blur(40px);"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="width: 56px; height: 56px; background: var(--accent-${i}-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                        <i class="fas ${t}" style="font-size: 1.5rem; color: var(--accent-${i});"></i>
                    </div>
                    <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: var(--text-primary);">
                        ${o.escapeHtml(String(a))}
                    </div>
                    <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">
                        ${o.escapeHtml(s)}
                    </div>
                    ${n?`
                        <div style="margin-top: var(--space-sm); font-size: 0.8rem; color: ${n.direction==="up"?"var(--color-success)":"var(--color-error)"};">
                            <i class="fas fa-arrow-${n.direction}"></i> ${o.escapeHtml(n.value)}
                        </div>
                    `:""}
                </div>
            </div>
        `}static renderModal(e={}){const{title:t="Modal",content:a="",actions:s=[],size:i="md",showClose:n=!0}=e;return`
            <div class="modal-header">
                <h2 class="modal-title">${o.escapeHtml(t)}</h2>
                ${n?`
                    <button class="modal-close" onclick="app.closeModal()" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                `:""}
            </div>
            <div class="modal-body modal-${i}">
                ${a}
            </div>
            ${s.length>0?`
                <div class="modal-footer">
                    ${s.map(r=>`
                        <button
                            class="btn ${r.variant||"btn-primary"}"
                            onclick="${r.onClick}"
                            ${r.disabled?"disabled":""}>
                            ${r.icon?`<i class="fas ${r.icon}"></i>`:""} ${o.escapeHtml(r.label)}
                        </button>
                    `).join("")}
                </div>
            `:""}
        `}static renderConfirmDialog(e={}){const{title:t="Confirm Action",message:a="Are you sure you want to proceed?",confirmLabel:s="Confirm",cancelLabel:i="Cancel",confirmVariant:n="btn-danger",icon:r="fa-exclamation-triangle",iconColor:c="warning",onConfirm:d="",onCancel:h="app.closeModal()"}=e;return this.renderModal({title:t,content:`
                <div style="text-align: center; padding: var(--space-xl);">
                    <div style="width: 80px; height: 80px; margin: 0 auto var(--space-lg); background: var(--color-${c}-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fas ${r}" style="font-size: 2.5rem; color: var(--color-${c});"></i>
                    </div>
                    <p style="font-size: 1.1rem; color: var(--text-primary); line-height: 1.5;">
                        ${o.escapeHtml(a)}
                    </p>
                </div>
            `,actions:[{label:i,variant:"btn-secondary",onClick:h},{label:s,variant:n,onClick:d}],showClose:!1})}static renderTable(e={}){const{columns:t=[],data:a=[],emptyMessage:s="No data available",rowActions:i=[],multiSelect:n=!1}=e;return`
            <table class="data-table">
                <thead>
                    <tr>
                        ${n?'<th style="width: 40px;"></th>':""}
                        ${t.map(r=>`
                            <th ${r.sortable?`class="sortable" onclick="${r.onSort}"`:""}>
                                ${o.escapeHtml(r.label)}
                                ${r.sortable?'<i class="fas fa-sort"></i>':""}
                            </th>
                        `).join("")}
                        ${i.length>0?"<th>Actions</th>":""}
                    </tr>
                </thead>
                <tbody>
                    ${a.length>0?a.map((r,c)=>`
                        <tr data-id="${r.id||c}">
                            ${n?`<td>${this.renderCheckbox(r.id)}</td>`:""}
                            ${t.map(d=>`
                                <td>${d.render?d.render(r):o.escapeHtml(String(r[d.key]||"-"))}</td>
                            `).join("")}
                            ${i.length>0?`
                                <td>
                                    ${i.map(d=>this.renderIconButton(d.icon,`${d.onClick}('${r.id}')`,{title:d.label,variant:d.variant||""})).join("")}
                                </td>
                            `:""}
                        </tr>
                    `).join(""):`
                        <tr>
                            <td colspan="${t.length+(n?1:0)+(i.length>0?1:0)}" class="empty-state">
                                ${o.escapeHtml(s)}
                            </td>
                        </tr>
                    `}
                </tbody>
            </table>
        `}static renderCheckbox(e,t=!1,a="app.handleCheckbox"){return`
            <input
                type="checkbox"
                ${t?"checked":""}
                onchange="${a}('${e}', this.checked)"
                data-id="${e}"
            >
        `}static createToastConfig(e,t="info",a=5e3){return{message:e,type:t,duration:a}}}export{$ as B,y as E,v as P,o as S,S as U,w as a,k as b,m as c,b as d,x as e,p as r,f as s};
//# sourceMappingURL=utils-B68CIlTQ.js.map
