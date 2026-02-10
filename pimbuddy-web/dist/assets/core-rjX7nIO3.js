const l={ROLES:{key:"roles",ttl:864e5},ROLE_DEFINITIONS:{key:"roleDefinitions",ttl:864e5},GROUPS:{key:"groups",ttl:3e5},TEMPLATES:{key:"templates",ttl:3e5},HEALTH_CHECK:{key:"healthCheck",ttl:3e5},COVERAGE:{key:"coverage",ttl:3e5},ASSIGNMENTS:{key:"assignments",ttl:12e4},EXPIRING_ASSIGNMENTS:{key:"expiringAssignments",ttl:12e4},APPROVALS:{key:"approvals",ttl:6e4},AUDIT_LOGS:{key:"auditLogs",ttl:6e4},DASHBOARD_STATS:{key:"dashboardStats",ttl:3e4}};class c{constructor(){this.cache=new Map,this.timestamps=new Map,this.hitCount=0,this.missCount=0}get(e,t=null){if(!this.cache.has(e))return this.missCount++,null;const s=Date.now()-this.timestamps.get(e),i=t||this.getDefaultTTL(e);return s>i?(this.cache.delete(e),this.timestamps.delete(e),this.missCount++,null):(this.hitCount++,this.cache.get(e))}set(e,t,s=null){this.cache.set(e,t),this.timestamps.set(e,Date.now()),s&&this.cache.set(`${e}__ttl`,s)}has(e){return this.get(e)!==null}invalidate(e){this.cache.delete(e),this.timestamps.delete(e),this.cache.delete(`${e}__ttl`)}invalidatePattern(e){const t=typeof e=="string"?new RegExp(e):e,s=[];for(const i of this.cache.keys())t.test(i)&&s.push(i);s.forEach(i=>this.invalidate(i))}clear(){this.cache.clear(),this.timestamps.clear(),this.hitCount=0,this.missCount=0}clearExpired(){let e=0;const t=[];for(const[s,i]of this.timestamps.entries()){const a=Date.now()-i,r=this.getDefaultTTL(s);a>r&&t.push(s)}return t.forEach(s=>{this.invalidate(s),e++}),e}getDefaultTTL(e){const t=this.cache.get(`${e}__ttl`);if(t)return t;const s=Object.values(l).find(i=>i.key===e);return s?s.ttl:5*60*1e3}getStats(){const e=this.hitCount+this.missCount,t=e>0?(this.hitCount/e*100).toFixed(2):0;return{size:this.cache.size,hits:this.hitCount,misses:this.missCount,hitRate:`${t}%`,totalRequests:e}}getAge(e){return this.timestamps.has(e)?Date.now()-this.timestamps.get(e):-1}getRemainingTTL(e){if(!this.timestamps.has(e))return-1;const t=this.getAge(e),s=this.getDefaultTTL(e);return Math.max(0,s-t)}warmCache(e){Object.entries(e).forEach(([t,s])=>{this.set(t,s)})}getKeys(){return Array.from(this.cache.keys()).filter(e=>!e.endsWith("__ttl"))}exportState(){const e={};for(const t of this.getKeys())e[t]={value:this.cache.get(t),age:this.getAge(t),remainingTTL:this.getRemainingTTL(t),ttl:this.getDefaultTTL(t)};return e}}const d=new c;setInterval(()=>{const o=d.clearExpired();o>0&&console.log(`[CacheManager] Auto-cleaned ${o} expired entries`)},5*60*1e3);class u{constructor(){this.currentPage="dashboard",this.pages=new Map,this.pageLoaders=new Map,this.loadedPages=new Map,this.beforeNavigate=null,this.afterNavigate=null}registerPage(e,t){if(!t||typeof t.render!="function")throw new Error(`Page ${e} must have a render() method`);this.pages.set(e,t)}registerPageLoader(e,t){if(typeof t!="function")throw new Error(`Page loader for ${e} must be a function`);this.pageLoaders.set(e,t)}registerPageLoaders(e){Object.entries(e).forEach(([t,s])=>{this.registerPageLoader(t,s)})}registerPages(e){Object.entries(e).forEach(([t,s])=>{this.registerPage(t,s)})}async navigateTo(e,t={}){if(!this.pages.has(e)&&!this.pageLoaders.has(e))return console.error(`[PageRouter] Page not found: ${e}`),!1;if(this.beforeNavigate&&await this.beforeNavigate(this.currentPage,e,t)===!1)return!1;this.updateNavigation(e),this.updatePageVisibility(e);const s=this.currentPage;this.currentPage=e;try{const i=document.getElementById(`page-${e}`);if(!i)return console.error(`[PageRouter] Container not found for page: ${e}`),!1;this.showLoadingState(i);let a=this.pages.get(e);if(!a&&this.pageLoaders.has(e)&&(a=await this.loadPage(e)),!a)throw new Error(`Failed to load page: ${e}`);return await a.render(i,t),this.afterNavigate&&await this.afterNavigate(s,e,t),!0}catch(i){return console.error(`[PageRouter] Error rendering page ${e}:`,i),this.showErrorState(e,i),!1}}async loadPage(e){if(this.loadedPages.has(e))return this.loadedPages.get(e);const t=this.pageLoaders.get(e);if(!t)throw new Error(`No loader found for page: ${e}`);console.log(`[PageRouter] Lazy loading page: ${e}`);const s=await t();let i;if(s.default)i=s.default;else if(s.render)i={render:s.render};else throw new Error(`Page module ${e} must export default or render function`);return this.loadedPages.set(e,i),i}showLoadingState(e){e.innerHTML=`
            <div class="page-loading" style="display: flex; align-items: center; justify-content: center; min-height: 400px;">
                <div style="text-align: center;">
                    <div class="spinner" style="margin: 0 auto var(--space-md);"></div>
                    <p style="color: var(--text-secondary);">Loading page...</p>
                </div>
            </div>
        `}updateNavigation(e){document.querySelectorAll(".nav-item").forEach(t=>{t.classList.remove("active"),t.dataset.page===e&&t.classList.add("active")})}updatePageVisibility(e){document.querySelectorAll(".page").forEach(s=>{s.classList.remove("active")});const t=document.getElementById(`page-${e}`);t&&t.classList.add("active")}showErrorState(e,t){const s=document.getElementById(`page-${e}`);s&&(s.innerHTML=`
            <div class="error-state" style="text-align: center; padding: var(--space-2xl);">
                <div style="width: 120px; height: 120px; margin: 0 auto var(--space-xl); background: var(--color-error-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3.5rem; color: var(--color-error);"></i>
                </div>
                <h2 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; margin-bottom: var(--space-md); color: var(--color-error);">
                    Error Loading Page
                </h2>
                <p style="color: var(--text-secondary); margin-bottom: var(--space-xl); font-family: var(--font-mono); font-size: 0.9rem;">
                    ${t.message||"An unexpected error occurred"}
                </p>
                <button class="btn btn-primary" onclick="app.router.navigateTo('${e}')">
                    <i class="fas fa-redo"></i> Try Again
                </button>
                <button class="btn btn-secondary" onclick="app.router.navigateTo('dashboard')" style="margin-left: var(--space-sm);">
                    <i class="fas fa-home"></i> Go to Dashboard
                </button>
            </div>
        `)}async refreshCurrentPage(e={}){return await this.navigateTo(this.currentPage,e)}getCurrentPage(){return this.currentPage}hasPage(e){return this.pages.has(e)||this.pageLoaders.has(e)}getRegisteredPages(){const e=Array.from(this.pages.keys()),t=Array.from(this.pageLoaders.keys());return[...new Set([...e,...t])]}clearPageCache(e=null){e?(this.loadedPages.delete(e),console.log(`[PageRouter] Cleared cache for page: ${e}`)):(this.loadedPages.clear(),console.log("[PageRouter] Cleared all page caches"))}setBeforeNavigate(e){this.beforeNavigate=e}setAfterNavigate(e){this.afterNavigate=e}}class g{constructor(e){this.app=e}async render(e,t={}){throw new Error("render() must be implemented by subclass")}showLoading(e="Loading..."){this.app&&this.app.showLoading&&this.app.showLoading(e)}hideLoading(){this.app&&this.app.hideLoading&&this.app.hideLoading()}showToast(e,t="info"){this.app&&this.app.showToast&&this.app.showToast(e,t)}showModal(e){this.app&&this.app.showModal&&this.app.showModal(e)}closeModal(){this.app&&this.app.closeModal&&this.app.closeModal()}escapeHtml(e){if(this.app&&this.app.escapeHtml)return this.app.escapeHtml(e);const t=document.createElement("div");return t.textContent=e,t.innerHTML}getCached(e){return this.app?.cacheManager?.get(e)||null}setCached(e,t){this.app?.cacheManager?.set(e,t)}isConnected(){return this.app?.isConnected||!1}}class h{constructor(){this.lastFocusedElement=null,this.modalStack=[],this.skipLinksAdded=!1}initialize(){this.addSkipLinks(),this.setupKeyboardNavigation(),this.setupFocusManagement(),this.enhanceModals(),this.setupLiveRegion(),console.log("AccessibilityManager initialized")}addSkipLinks(){if(this.skipLinksAdded)return;const e=document.createElement("div");e.className="skip-links",e.setAttribute("role","navigation"),e.setAttribute("aria-label","Skip links"),e.innerHTML=`
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
        `,document.body.insertBefore(e,document.body.firstChild),this.skipLinksAdded=!0,this.addSkipLinkStyles()}addSkipLinkStyles(){const e=document.createElement("style");e.textContent=`
            .skip-links {
                position: absolute;
                top: -1000px;
                left: -1000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            }

            .skip-link:focus {
                position: fixed;
                top: 10px;
                left: 10px;
                width: auto;
                height: auto;
                padding: 0.75rem 1.5rem;
                background: var(--accent-primary);
                color: var(--bg-primary);
                font-family: var(--font-display);
                font-weight: 700;
                text-decoration: none;
                border-radius: var(--radius-md);
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            .skip-link:focus:hover {
                background: var(--accent-primary-bright);
            }

            /* Focus visible styles for better keyboard navigation */
            *:focus-visible {
                outline: 2px solid var(--accent-primary);
                outline-offset: 2px;
            }

            /* Remove default focus for mouse users */
            *:focus:not(:focus-visible) {
                outline: none;
            }
        `,document.head.appendChild(e)}setupKeyboardNavigation(){document.addEventListener("keydown",e=>{if(e.altKey&&e.key==="n"&&(e.preventDefault(),this.focusNavigation(),this.announce("Navigation menu focused")),e.altKey&&e.key==="m"&&(e.preventDefault(),this.focusMainContent(),this.announce("Main content focused")),e.altKey&&e.key==="s"){e.preventDefault();const t=document.querySelector('[role="search"] input, #group-search, #role-search');t&&(t.focus(),this.announce("Search focused"))}})}setupFocusManagement(){window.addEventListener("popstate",()=>{requestAnimationFrame(()=>{this.focusMainContent()})}),document.addEventListener("focus",e=>{if(e.target.matches("button:not([aria-label]):not([title])")){const t=e.target.textContent.trim();t&&e.target.setAttribute("aria-label",t)}},!0)}enhanceModals(){const e=document.getElementById("modal-container");if(!e)return;new MutationObserver(s=>{s.forEach(i=>{i.attributeName==="class"&&(!e.classList.contains("hidden")?this.handleModalOpen(e):this.handleModalClose())})}).observe(e,{attributes:!0}),e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-hidden","true")}handleModalOpen(e){this.lastFocusedElement=document.activeElement,this.modalStack.push(this.lastFocusedElement),e.setAttribute("aria-hidden","false");const t=e.querySelector("#modal-content"),s=t?.querySelector("h2, h3, .modal-title");s&&!s.id&&(s.id=`modal-title-${Date.now()}`),s&&e.setAttribute("aria-labelledby",s.id),requestAnimationFrame(()=>{const i=this.getFocusableElements(t)[0];i&&i.focus()}),this.setupTabTrap(e),this.announce("Dialog opened")}handleModalClose(){document.getElementById("modal-container").setAttribute("aria-hidden","true");const t=this.modalStack.pop();t&&typeof t.focus=="function"&&setTimeout(()=>{try{t.focus()}catch{this.focusMainContent()}},100),this.announce("Dialog closed")}setupTabTrap(e){const t=e.querySelector("#modal-content");if(!t)return;const s=i=>{if(i.key!=="Tab")return;const a=this.getFocusableElements(t),r=a[0],n=a[a.length-1];if(a.length===0){i.preventDefault();return}i.shiftKey&&document.activeElement===r?(i.preventDefault(),n.focus()):!i.shiftKey&&document.activeElement===n&&(i.preventDefault(),r.focus())};e.removeEventListener("keydown",s),e.addEventListener("keydown",s)}getFocusableElements(e){return e?Array.from(e.querySelectorAll(`
            a[href]:not([disabled]),
            button:not([disabled]),
            textarea:not([disabled]),
            input:not([type="hidden"]):not([disabled]),
            select:not([disabled]),
            [tabindex]:not([tabindex="-1"]):not([disabled])
        `)).filter(s=>s.offsetParent!==null&&window.getComputedStyle(s).visibility!=="hidden"):[]}focusNavigation(){const e=document.querySelector('.sidebar, [role="navigation"]');if(e){const t=e.querySelector(".nav-item, a");t&&t.focus()}}focusMainContent(){const e=document.getElementById("main-content")||document.querySelector("main, .content-wrapper");e&&(e.hasAttribute("tabindex")||e.setAttribute("tabindex","-1"),e.focus(),setTimeout(()=>{e.removeAttribute("tabindex")},100))}setupLiveRegion(){let e=document.getElementById("a11y-live-region");if(!e){e=document.createElement("div"),e.id="a11y-live-region",e.setAttribute("role","status"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.className="sr-only";const t=document.createElement("style");t.textContent=`
                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }
            `,document.head.appendChild(t),document.body.appendChild(e)}this.liveRegion=e}announce(e,t="polite"){this.liveRegion||this.setupLiveRegion(),this.liveRegion.setAttribute("aria-live",t),this.liveRegion.textContent="",setTimeout(()=>{this.liveRegion.textContent=e},100),setTimeout(()=>{this.liveRegion.textContent=""},1e3)}enhanceForm(e){if(!e)return;e.querySelectorAll("input, select, textarea").forEach(i=>{i.id||(i.id=`input-${Date.now()}-${Math.random().toString(36).substr(2,9)}`);let a=e.querySelector(`label[for="${i.id}"]`);if(a||(a=i.closest("label")),!a&&(i.placeholder||i.name)){const r=i.placeholder||i.name;i.setAttribute("aria-label",r)}i.hasAttribute("required")&&!i.hasAttribute("aria-required")&&i.setAttribute("aria-required","true"),(i.classList.contains("error")||i.classList.contains("invalid"))&&i.setAttribute("aria-invalid","true")});const s=e.querySelectorAll(".error-message, .field-error");if(s.length>0){const i=Array.from(s).map(a=>a.textContent).join(", ");this.announce(`Form has ${s.length} error${s.length>1?"s":""}: ${i}`,"assertive")}}enhanceTable(e){if(!e)return;if(e.hasAttribute("role")||e.setAttribute("role","table"),!e.querySelector("caption")){const i=document.createElement("caption");i.className="sr-only",i.textContent=e.getAttribute("aria-label")||"Data table",e.insertBefore(i,e.firstChild)}const t=e.querySelector("thead");t&&(t.setAttribute("role","rowgroup"),t.querySelectorAll("tr").forEach(i=>{i.setAttribute("role","row")}),t.querySelectorAll("th").forEach(i=>{i.setAttribute("role","columnheader"),i.hasAttribute("scope")||i.setAttribute("scope","col")}));const s=e.querySelector("tbody");s&&(s.setAttribute("role","rowgroup"),s.querySelectorAll("tr").forEach(i=>{i.setAttribute("role","row")}),s.querySelectorAll("td").forEach(i=>{i.setAttribute("role","cell")})),e.querySelectorAll("th.sortable").forEach(i=>{i.hasAttribute("aria-sort")||i.setAttribute("aria-sort","none")})}announcePageChange(e){const t=e.split("-").map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join(" ");this.announce(`Navigated to ${t} page`,"polite")}announceLoading(e,t=""){e?this.announce(`Loading${t?": "+t:"..."}`,"polite"):this.announce("Loading complete","polite")}}const f=new h;export{g as B,l as C,u as P,c as a,f as b};
//# sourceMappingURL=core-rjX7nIO3.js.map
