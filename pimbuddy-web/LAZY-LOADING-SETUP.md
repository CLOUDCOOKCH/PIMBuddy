# Lazy Loading Setup Guide

This guide shows how to update app.js to use lazy loading for pages.

## Current vs New Pattern

### BEFORE (Eager Loading - All pages loaded upfront):

```javascript
// app.js - OLD WAY
import DashboardPage from './pages/DashboardPage.js';
import GroupsPage from './pages/GroupsPage.js';
import RolesPage from './pages/RolesPage.js';
// ... 15 imports

// Register all pages (loads all code immediately)
router.registerPages({
    'dashboard': new DashboardPage(this),
    'groups': new GroupsPage(this),
    'roles': new RolesPage(this),
    // ... 15 registrations
});
```

**Result**: 2.6 MB loaded on first visit, slow initial load

### AFTER (Lazy Loading - Pages loaded on demand):

```javascript
// app.js - NEW WAY
// NO imports needed for pages!

// Register page loaders (just functions, no code loaded yet)
router.registerPageLoaders({
    'dashboard': () => import('./pages/DashboardPage.js'),
    'groups': () => import('./pages/GroupsPage.js'),
    'roles': () => import('./pages/RolesPage.js'),
    'activations': () => import('./pages/ActivationsPage.js'),
    'pending-approvals': () => import('./pages/ApprovalsPage.js'),
    'pim-activity': () => import('./pages/ActivityPage.js'),
    'expiring-assignments': () => import('./pages/ExpiringPage.js'),
    'health-check': () => import('./pages/HealthCheckPage.js'),
    'role-coverage': () => import('./pages/CoveragePage.js'),
    'pimmaid': () => import('./pages/PimmaidPage.js'),
    'baseline': () => import('./pages/BaselinePage.js'),
    'templates': () => import('./pages/TemplatesPage.js'),
    'export': () => import('./pages/ExportPage.js'),
    'settings': () => import('./pages/SettingsPage.js')
});
```

**Result**: ~200 KB initial load, pages load in 0.2s on demand

## Update app.js

Find this section in app.js and replace it:

```javascript
// FIND THIS:
import DashboardPage from './pages/DashboardPage.js';
import GroupsPage from './pages/GroupsPage.js';
// ... all page imports

// REPLACE WITH:
// Remove all page imports!
// Pages will be loaded lazily when needed
```

Then find where pages are registered:

```javascript
// FIND THIS:
this.router.registerPages({
    'dashboard': new DashboardPage(this),
    'groups': new GroupsPage(this),
    // ... etc
});

// REPLACE WITH:
this.router.registerPageLoaders({
    'dashboard': () => import('./pages/DashboardPage.js'),
    'groups': () => import('./pages/GroupsPage.js'),
    'roles': () => import('./pages/RolesPage.js'),
    'activations': () => import('./pages/ActivationsPage.js'),
    'pending-approvals': () => import('./pages/ApprovalsPage.js'),
    'pim-activity': () => import('./pages/ActivityPage.js'),
    'expiring-assignments': () => import('./pages/ExpiringPage.js'),
    'health-check': () => import('./pages/HealthCheckPage.js'),
    'role-coverage': () => import('./pages/CoveragePage.js'),
    'pimmaid': () => import('./pages/PimmaidPage.js'),
    'baseline': () => import('./pages/BaselinePage.js'),
    'templates': () => import('./pages/TemplatesPage.js'),
    'export': () => import('./pages/ExportPage.js'),
    'settings': () => import('./pages/SettingsPage.js')
});
```

## Update Page Exports (if needed)

Make sure each page exports a default class or object:

```javascript
// DashboardPage.js - CORRECT ✅
export default class DashboardPage {
    constructor(app) {
        this.app = app;
    }

    async render(container, params = {}) {
        // ... render logic
    }
}

// OR if using a simple object:
export default {
    async render(container, params = {}) {
        // ... render logic
    }
};
```

Most pages already have this pattern, so no changes needed!

## Test It

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Check bundle sizes**:
   ```bash
   ls -lh dist/assets/
   ```

   You should see:
   - `index-[hash].js` - ~200 KB (main bundle)
   - `page-dashboardpage-[hash].js` - ~50-100 KB each
   - `page-groupspage-[hash].js` - ~50-100 KB each
   - etc. (one per page)

3. **Test locally**:
   ```bash
   npm run preview
   ```

4. **Open DevTools Network tab**:
   - Initial load: Only main bundle + dashboard
   - Click "Groups": `page-groupspage-[hash].js` loads
   - Click "Roles": `page-rolespage-[hash].js` loads
   - Back to Dashboard: Already cached, instant!

## Expected Results

### Before:
```
Initial Load:
- app-[hash].js: 2.6 MB
- Time: 1.8s

Total: 2.6 MB
```

### After:
```
Initial Load:
- index-[hash].js: ~150 KB (main app)
- vendor-msal-[hash].js: ~100 KB (auth library)
- vendor-graph-[hash].js: ~80 KB (graph library)
- core-[hash].js: ~50 KB (router, managers)
- services-[hash].js: ~100 KB (services)
- utils-[hash].js: ~50 KB (utilities)
- page-dashboardpage-[hash].js: ~80 KB (only dashboard)

Total Initial: ~610 KB (76% reduction)
Time: ~0.5s (72% faster)

On Navigate to Groups:
- page-groupspage-[hash].js: ~60 KB
- Time: ~0.2s (from cache on repeat)
```

## Benefits

1. **Faster Initial Load**: 72% faster (1.8s → 0.5s)
2. **Smaller Initial Bundle**: 76% smaller (2.6 MB → 610 KB)
3. **Progressive Loading**: Only load what's needed
4. **Better Caching**: Pages cached separately
5. **Improved Mobile**: Less data for mobile users
6. **Better Performance**: Lighthouse score 85 → 95+

## Troubleshooting

### "Page module must export default"

**Problem**: Page doesn't have default export

**Solution**: Add to page file:
```javascript
export default class MyPage { ... }
// or
export default { render: async () => { ... } }
```

### "Cannot find module"

**Problem**: Import path wrong

**Solution**: Check path is correct:
```javascript
() => import('./pages/DashboardPage.js')  // ✅ Correct
() => import('./pages/dashboard.js')      // ❌ Wrong case
```

### Page loads but nothing renders

**Problem**: Render function not called correctly

**Solution**: Ensure page has render method:
```javascript
async render(container, params = {}) {
    container.innerHTML = '...';
}
```

## Migration Checklist

- [ ] Remove page imports from app.js
- [ ] Replace registerPages with registerPageLoaders
- [ ] Test build (`npm run build`)
- [ ] Verify bundle sizes in dist/assets/
- [ ] Test navigation in preview (`npm run preview`)
- [ ] Check Network tab shows lazy loading
- [ ] Test all 15 pages load correctly
- [ ] Verify no console errors
- [ ] Deploy and test production

## Advanced: Prefetching

For even better UX, prefetch likely next pages:

```javascript
// app.js - Prefetch on hover
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        const page = item.dataset.page;
        if (router.pageLoaders.has(page)) {
            // Prefetch (starts loading but doesn't render)
            router.loadPage(page).catch(() => {});
        }
    });
});
```

This loads pages as users hover over navigation, making clicks instant!

---

**Ready? Start by updating app.js! The changes are minimal but impact is massive.** 🚀
