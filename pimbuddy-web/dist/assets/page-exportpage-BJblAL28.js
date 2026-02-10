import{B as i}from"./core-rjX7nIO3.js";class c extends i{constructor(e){super(e)}async render(e,t={}){e.innerHTML=`
            <h1 class="page-header">Import / Export</h1>

            <div class="export-grid">
                <div class="card">
                    <div class="card-header-icon">
                        <i class="fas fa-file-export primary"></i>
                        <h2>Export</h2>
                    </div>
                    <p>Export your PIM configuration for backup or migration.</p>

                    <div class="checkbox-group">
                        <label><input type="checkbox" id="export-groups" checked> PIM Groups</label>
                        <label><input type="checkbox" id="export-policies" checked> Policy Configurations</label>
                        <label><input type="checkbox" id="export-assignments" checked> Role Assignments</label>
                    </div>

                    <select class="input" id="export-format" aria-label="Export format">
                        <option value="json">JSON (Full Configuration)</option>
                        <option value="csv">CSV (Audit Report)</option>
                    </select>

                    <button class="btn btn-primary" onclick="app.pages.export.exportConfig()" ${this.isConnected()?"":"disabled"} aria-label="Export configuration">
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>

                <div class="card">
                    <div class="card-header-icon">
                        <i class="fas fa-file-import secondary"></i>
                        <h2>Import</h2>
                    </div>
                    <p>Import PIM configuration from a JSON file.</p>

                    <div class="drop-zone" id="import-drop-zone">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>Drop file here or click to browse</p>
                    </div>

                    <button class="btn btn-secondary" onclick="document.getElementById('import-file').click()" ${this.isConnected()?"":"disabled"} aria-label="Browse for import file">
                        <i class="fas fa-folder-open"></i> Browse Files
                    </button>
                    <input type="file" id="import-file" accept=".json" style="display:none" onchange="app.pages.export.handleImport(this.files)">
                </div>
            </div>
        `,this.setupDropZone()}setupDropZone(){const e=document.getElementById("import-drop-zone");e&&(e.addEventListener("dragover",t=>{t.preventDefault(),e.classList.add("drag-over")}),e.addEventListener("dragleave",()=>{e.classList.remove("drag-over")}),e.addEventListener("drop",t=>{t.preventDefault(),e.classList.remove("drag-over"),this.handleImport(t.dataTransfer.files)}),e.addEventListener("click",()=>{document.getElementById("import-file").click()}))}async exportConfig(){document.getElementById("export-groups").checked,document.getElementById("export-policies").checked,document.getElementById("export-assignments").checked;const e=document.getElementById("export-format").value;this.showToast(`Export functionality - Implementation pending (${e} format)`,"info")}handleImport(e){if(!e||e.length===0)return;const t=e[0];if(!t.name.endsWith(".json")){this.showToast("Please select a JSON file","error");return}const o=new FileReader;o.onload=r=>{try{const a=JSON.parse(r.target.result);this.showToast(`Imported configuration from ${t.name} - Application pending`,"info")}catch{this.showToast("Invalid JSON file","error")}},o.readAsText(t)}async refreshPage(){await this.app.router.refreshCurrentPage()}}export{c as E};
//# sourceMappingURL=page-exportpage-BJblAL28.js.map
