# Implementation Guide for v1.1 Enhancements

This guide shows how to integrate the new v1.1 enhancements into existing pages.

## 📚 Quick Reference

| Enhancement | Import | Usage |
|-------------|--------|-------|
| CSV Export | `import { exportGroupsToCSV } from './utils/csvExport.js'` | `exportGroupsToCSV(groups)` |
| Keyboard Shortcuts | `import { initializeKeyboardShortcuts } from './utils/keyboardShortcuts.js'` | `initializeKeyboardShortcuts()` |
| Enhanced Errors | `import { showEnhancedError } from './utils/errorDisplay.js'` | `showEnhancedError(error)` |
| Skeleton Loaders | `import { showSkeleton, hideSkeleton } from './utils/skeletonLoaders.js'` | `showSkeleton(container, 'skeletonTable')` |

## 1. Adding CSV Export to Pages

### Groups Page Example

**Add export button to UI**:

```javascript
// In GroupsPage.js renderGroupsPage()
const exportButton = document.createElement('button');
exportButton.className = 'btn btn-secondary';
exportButton.innerHTML = `
    <i class="fas fa-file-csv"></i>
    <span>Export CSV</span>
`;
exportButton.addEventListener('click', () => handleExportCSV());
toolbar.appendChild(exportButton);
```

**Add export handler**:

```javascript
import { exportGroupsToCSV } from '../utils/csvExport.js';

async function handleExportCSV() {
    try {
        // Get current groups (filtered or all)
        const groups = await graphService.getGroups();

        // Export to CSV
        exportGroupsToCSV(groups);

        // Show success message
        showToast('Groups exported successfully', 'success');
    } catch (error) {
        showToast('Failed to export groups', 'error');
        console.error(error);
    }
}
```

### Roles Page Example

```javascript
import { exportRolesToCSV } from '../utils/csvExport.js';

// Add to toolbar
document.getElementById('export-roles-btn').addEventListener('click', () => {
    const roles = getCurrentRoles(); // Get displayed roles
    exportRolesToCSV(roles, 'my-roles.csv');
});
```

### Activity Page Example

```javascript
import { exportActivityToCSV } from '../utils/csvExport.js';

// Export activity log
async function exportActivity() {
    const activities = await graphService.getPIMActivity();
    exportActivityToCSV(activities);
}
```

### Health Check Page Example

```javascript
import { exportHealthCheckToCSV } from '../utils/csvExport.js';

// Export health check results
function exportHealthResults() {
    const results = lastHealthCheckResults;
    exportHealthCheckToCSV(results);
}
```

## 2. Using Enhanced Error Display

### Replace Basic Error Handling

**Before**:
```javascript
try {
    await graphService.createGroup(groupData);
} catch (error) {
    alert('Failed to create group: ' + error.message);
}
```

**After**:
```javascript
import { showEnhancedError } from '../utils/errorDisplay.js';

try {
    await graphService.createGroup(groupData);
} catch (error) {
    showEnhancedError(error, {
        onAction: (action) => {
            if (action === 'retry') {
                // Retry the operation
                handleCreateGroup(groupData);
            } else if (action === 'view_permissions') {
                // Navigate to permissions page
                window.location.hash = '#settings';
            }
        },
        onClose: () => {
            // Optional: cleanup after error dismissed
        }
    });
}
```

### Creating Custom Errors

```javascript
import { AppError, ErrorType } from '../utils/errorHandling.js';
import { showEnhancedError } from '../utils/errorDisplay.js';

// Validation error
if (!groupName) {
    const error = new AppError(
        'Group name is required',
        ErrorType.VALIDATION,
        { field: 'groupName' }
    );
    showEnhancedError(error);
    return;
}

// Permission error
if (!hasPermission) {
    const error = new AppError(
        'You do not have permission to create groups',
        ErrorType.PERMISSION,
        { requiredPermission: 'Group.ReadWrite.All' }
    );
    showEnhancedError(error);
    return;
}
```

### Retry Operations

```javascript
import { retryOperation } from '../utils/errorHandling.js';
import { showEnhancedError } from '../utils/errorDisplay.js';

async function fetchGroups() {
    try {
        const groups = await retryOperation(
            () => graphService.getGroups(),
            {
                maxRetries: 3,
                delayMs: 1000,
                exponentialBackoff: true,
                onRetry: (attempt, maxAttempts, delay) => {
                    console.log(`Retry ${attempt}/${maxAttempts} after ${delay}ms`);
                }
            }
        );
        return groups;
    } catch (error) {
        showEnhancedError(error);
    }
}
```

## 3. Adding Skeleton Loaders

### Dashboard Page

```javascript
import { showSkeleton, hideSkeleton } from '../utils/skeletonLoaders.js';

export async function renderDashboardPage() {
    const container = document.getElementById('page-dashboard');

    // Show skeleton while loading
    showSkeleton(container, 'skeletonDashboard');

    try {
        // Fetch data
        const [groups, roles, stats] = await Promise.all([
            graphService.getGroups(),
            graphService.getRoles(),
            graphService.getStats()
        ]);

        // Render actual content
        const content = renderDashboard(groups, roles, stats);

        // Hide skeleton and show content
        hideSkeleton(container, content);
    } catch (error) {
        hideSkeleton(container);
        showEnhancedError(error);
    }
}
```

### Groups/Roles List Page

```javascript
import { showSkeleton, hideSkeleton } from '../utils/skeletonLoaders.js';

async function loadGroups() {
    const container = document.querySelector('.groups-container');

    // Show skeleton table
    showSkeleton(container, 'skeletonTable', 10, 5); // 10 rows, 5 columns

    // Load groups
    const groups = await graphService.getGroups();

    // Render and show
    hideSkeleton(container, renderGroupsTable(groups));
}
```

### Custom Skeleton

```javascript
import { createSkeleton } from '../utils/skeletonLoaders.js';

function renderCustomSkeleton() {
    const container = document.createElement('div');

    // Add custom skeleton elements
    container.appendChild(createSkeleton('title', { width: '200px' }));
    container.appendChild(createSkeleton('text', { width: '300px' }));
    container.appendChild(createSkeleton('image', { height: '200px' }));
    container.appendChild(createSkeleton('button', { width: '120px' }));

    return container;
}
```

### Loading States

```javascript
// Show skeleton before API call
showSkeleton('#content', 'skeletonListPage');

// Make API call
const data = await fetchData();

// Hide skeleton and show data
hideSkeleton('#content', renderData(data));
```

## 4. Keyboard Shortcuts Integration

### Initialize in app.js

```javascript
import { initializeKeyboardShortcuts } from './utils/keyboardShortcuts.js';

// Initialize keyboard shortcuts globally
initializeKeyboardShortcuts();
```

**That's it!** The module automatically:
- Listens for `?` key to show help
- Manages modal display
- Handles keyboard navigation

### Add Help Button to Header (Optional)

```javascript
const helpButton = document.getElementById('help-btn');
helpButton.addEventListener('click', () => {
    showKeyboardShortcutsModal();
});
```

### Custom Shortcuts (Optional)

```javascript
// Add page-specific shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+E to export on Groups page
    if (e.ctrlKey && e.key === 'e' && currentPage === 'groups') {
        e.preventDefault();
        handleExportCSV();
    }

    // Ctrl+F to focus search
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
    }
});
```

## 5. PWA Integration

### Already Configured!

The following are already set up:
- ✅ Service worker registration in `index.html`
- ✅ Manifest linked in `index.html`
- ✅ Install prompt after 5 seconds
- ✅ Update notification on new version

### Optional: Add Install Button

```javascript
// Add install button to header
const installButton = document.createElement('button');
installButton.className = 'btn btn-secondary';
installButton.innerHTML = '<i class="fas fa-download"></i> Install App';
installButton.style.display = 'none';

let deferredInstallPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    installButton.style.display = 'inline-flex';
});

installButton.addEventListener('click', async () => {
    if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        console.log('Install outcome:', outcome);
        deferredInstallPrompt = null;
        installButton.style.display = 'none';
    }
});

header.appendChild(installButton);
```

### Optional: Clear Service Worker Cache

```javascript
// Add to settings page
async function clearAppCache() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'CLEAR_CACHE'
        });
        showToast('Cache cleared successfully', 'success');
        setTimeout(() => window.location.reload(), 1000);
    }
}
```

## 6. Complete Page Example

Here's a complete example integrating all enhancements:

```javascript
/**
 * Groups Page with all v1.1 enhancements
 */

import { graphService } from '../services/graphService.js';
import { exportGroupsToCSV } from '../utils/csvExport.js';
import { showEnhancedError } from '../utils/errorDisplay.js';
import { showSkeleton, hideSkeleton } from '../utils/skeletonLoaders.js';
import { showToast } from '../utils/uiComponents.js';

export async function renderGroupsPage() {
    const container = document.getElementById('page-groups');

    // Show skeleton while loading
    showSkeleton(container, 'skeletonListPage');

    try {
        // Load groups
        const groups = await graphService.getGroups();

        // Render page
        const content = renderGroupsContent(groups);

        // Hide skeleton and show content
        hideSkeleton(container, content);

        // Setup event listeners
        setupGroupsEventListeners(groups);

    } catch (error) {
        // Hide skeleton
        hideSkeleton(container);

        // Show enhanced error with retry
        showEnhancedError(error, {
            onAction: (action) => {
                if (action === 'retry') {
                    renderGroupsPage(); // Retry loading
                }
            }
        });
    }
}

function renderGroupsContent(groups) {
    const content = document.createElement('div');
    content.className = 'page-content';

    content.innerHTML = `
        <div class="page-header">
            <div>
                <h2>PIM Groups</h2>
                <p>Manage role-assignable security groups</p>
            </div>
            <div class="page-actions">
                <button id="export-csv-btn" class="btn btn-secondary">
                    <i class="fas fa-file-csv"></i>
                    Export CSV
                </button>
                <button id="create-group-btn" class="btn btn-primary">
                    <i class="fas fa-plus"></i>
                    Create Group
                </button>
            </div>
        </div>

        <div class="table-container">
            ${renderGroupsTable(groups)}
        </div>
    `;

    return content;
}

function setupGroupsEventListeners(groups) {
    // Export CSV button
    document.getElementById('export-csv-btn')?.addEventListener('click', () => {
        try {
            exportGroupsToCSV(groups);
            showToast('Groups exported successfully', 'success');
        } catch (error) {
            showEnhancedError(error);
        }
    });

    // Create group button
    document.getElementById('create-group-btn')?.addEventListener('click', () => {
        showCreateGroupModal();
    });

    // ... other event listeners
}

function renderGroupsTable(groups) {
    // Table rendering logic
    return `<table>...</table>`;
}
```

## 7. Testing Checklist

After implementing enhancements:

- [ ] **CSV Export**:
  - [ ] CSV downloads correctly
  - [ ] Opens in Excel without errors
  - [ ] All data columns present
  - [ ] Special characters handled (commas, quotes)
  - [ ] Filename includes date

- [ ] **Enhanced Errors**:
  - [ ] Error modal displays correctly
  - [ ] Recovery actions work
  - [ ] Troubleshooting steps helpful
  - [ ] Technical details expandable
  - [ ] Close button works

- [ ] **Skeleton Loaders**:
  - [ ] Skeleton matches content layout
  - [ ] Animation smooth
  - [ ] Hides when content loads
  - [ ] Works on slow connections

- [ ] **Keyboard Shortcuts**:
  - [ ] `?` shows help modal
  - [ ] All shortcuts work
  - [ ] Modal keyboard accessible
  - [ ] Escape closes modal

- [ ] **PWA**:
  - [ ] Install prompt appears
  - [ ] Install works on desktop
  - [ ] App icon appears
  - [ ] Offline mode works
  - [ ] Update notification shows

## 8. Common Patterns

### Loading with Retry

```javascript
async function loadData() {
    showSkeleton(container, 'skeleton...');

    try {
        const data = await retryOperation(() => fetchData());
        hideSkeleton(container, renderData(data));
    } catch (error) {
        hideSkeleton(container);
        showEnhancedError(error, {
            onAction: (action) => {
                if (action === 'retry') loadData();
            }
        });
    }
}
```

### Export with Loading

```javascript
async function handleExport() {
    const button = document.getElementById('export-btn');
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';

    try {
        const data = await fetchData();
        exportToCSV(data, columns, 'export.csv');
        showToast('Export successful', 'success');
    } catch (error) {
        showEnhancedError(error);
    } finally {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-file-csv"></i> Export CSV';
    }
}
```

### Validation with Enhanced Errors

```javascript
function validateInput(formData) {
    const errors = [];

    if (!formData.name) {
        errors.push({ field: 'name', message: 'Name is required' });
    }

    if (!formData.email?.includes('@')) {
        errors.push({ field: 'email', message: 'Valid email required' });
    }

    if (errors.length > 0) {
        const error = new AppError(
            'Please fix the following errors',
            ErrorType.VALIDATION,
            { errors }
        );
        showEnhancedError(error);
        return false;
    }

    return true;
}
```

---

## Need Help?

- Check the enhancement documentation: [ENHANCEMENTS-V1.1.md](ENHANCEMENTS-V1.1.md)
- Review example implementations in this guide
- See inline code comments in utility files
- Report issues: [GitHub Issues](https://github.com/yourusername/PIMBuddy/issues)

**Happy coding!** 🚀
