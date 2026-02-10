# PIMBuddy Pre-Deployment Checklist

Use this checklist before deploying PIMBuddy to production (GitHub Pages or other platforms).

## ✅ Code Preparation

### Build & Test
- [ ] Code builds successfully without errors
  ```bash
  cd pimbuddy-web
  npm run build
  ```
- [ ] No console errors or warnings in browser (F12 → Console)
- [ ] All pages load correctly
- [ ] No broken links or missing assets
- [ ] Build size is reasonable (< 1MB total)

### Code Quality
- [ ] All backup files removed (*.backup, *.backup.*)
- [ ] No hardcoded credentials or API keys in code
- [ ] No debug console.log statements (except intentional logging)
- [ ] No TODO comments for critical features
- [ ] Code follows project conventions
- [ ] All files have proper encoding (UTF-8)

### Testing
- [ ] **Dashboard** loads and displays data
- [ ] **PIM Groups** - Create, view, delete operations work
- [ ] **Entra Roles** - Browse and assign roles
- [ ] **Activations** - Activate and deactivate roles
- [ ] **Approvals** - Approve/deny requests
- [ ] **PIM Activity** - View audit logs
- [ ] **Health Check** - Runs without errors
- [ ] **Export/Import** - Download and upload configurations
- [ ] **Theme Toggle** - Switch between light/dark modes
- [ ] **Settings** - Save preferences

### Browser Compatibility
- [ ] Tested in **Chrome** (latest)
- [ ] Tested in **Firefox** (latest)
- [ ] Tested in **Edge** (latest)
- [ ] Tested in **Safari** (if available)
- [ ] Mobile responsive (test at 320px, 768px, 1024px widths)
- [ ] No horizontal scrolling on mobile

### Accessibility
- [ ] Keyboard navigation works (Tab, Shift+Tab, Enter, Escape)
- [ ] Skip links appear on focus (Tab from top of page)
- [ ] All buttons have accessible labels
- [ ] Forms have proper labels
- [ ] Images have alt text
- [ ] Sufficient color contrast (4.5:1 minimum)
- [ ] Focus indicators visible
- [ ] Lighthouse accessibility score ≥ 90

## 🔐 Azure Configuration

### App Registration
- [ ] Azure App Registration created
- [ ] **Application (client) ID** copied
- [ ] **Directory (tenant) ID** copied
- [ ] App configured for **Single Tenant** only
- [ ] Authentication platform: **Single-page application (SPA)**

### Redirect URIs
- [ ] Development URI configured: `http://localhost:3000`
- [ ] Production URI configured (e.g., `https://yourusername.github.io/PIMBuddy/`)
- [ ] URIs match exactly (case-sensitive, trailing slash)
- [ ] No wildcards in redirect URIs

### API Permissions
All permissions added as **Delegated** (not Application):

#### Essential
- [ ] User.Read
- [ ] Directory.Read.All
- [ ] Group.Read.All
- [ ] Group.ReadWrite.All

#### Role Management
- [ ] RoleManagement.Read.Directory
- [ ] RoleManagement.ReadWrite.Directory
- [ ] RoleEligibilitySchedule.Read.Directory
- [ ] RoleEligibilitySchedule.ReadWrite.Directory
- [ ] RoleAssignmentSchedule.Read.Directory
- [ ] RoleAssignmentSchedule.ReadWrite.Directory

#### PIM for Groups
- [ ] PrivilegedAccess.Read.AzureADGroup
- [ ] PrivilegedAccess.ReadWrite.AzureADGroup
- [ ] PrivilegedEligibilitySchedule.Read.AzureADGroup
- [ ] PrivilegedEligibilitySchedule.ReadWrite.AzureADGroup
- [ ] PrivilegedAssignmentSchedule.Read.AzureADGroup
- [ ] PrivilegedAssignmentSchedule.ReadWrite.AzureADGroup

### Admin Consent
- [ ] **Admin consent granted** for all permissions
- [ ] Consent shows as **Granted for [Your Organization]**
- [ ] No permissions show "Not granted"

## 📝 Configuration Files

### Vite Configuration
- [ ] `vite.config.js` base path set correctly:
  - GitHub Pages: `base: '/PIMBuddy/'` (with repo name)
  - Custom domain: `base: '/'`
- [ ] Build output directory: `dist`
- [ ] Source maps enabled for debugging

### Package Configuration
- [ ] `package.json` version updated (if releasing)
- [ ] Repository URL updated in `package.json`
- [ ] Author information correct
- [ ] All dependencies have compatible versions
- [ ] Package-lock.json committed to git

### Git Configuration
- [ ] `.gitignore` includes:
  - `node_modules/`
  - `dist/` (optional, depends on deployment method)
  - `.env` files
  - Backup files
  - IDE files
- [ ] No sensitive files tracked in git
- [ ] All necessary files committed

## 🌐 GitHub Repository

### Repository Setup
- [ ] Repository created on GitHub
- [ ] Repository name matches base path in `vite.config.js`
- [ ] Repository description added
- [ ] Repository topics/tags added (pim, azure, entra-id)
- [ ] README.md pushed to repository
- [ ] LICENSE file included

### GitHub Pages Configuration
- [ ] GitHub Pages enabled in repository settings
- [ ] Source set to **GitHub Actions**
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enforced

### GitHub Actions Workflow
- [ ] `.github/workflows/deploy.yml` exists
- [ ] Workflow has correct permissions:
  - `contents: read`
  - `pages: write`
  - `id-token: write`
- [ ] Build directory correct: `pimbuddy-web`
- [ ] Output directory correct: `pimbuddy-web/dist`
- [ ] `GITHUB_PAGES=true` environment variable set in build step

## 🚀 Deployment

### Pre-Deployment
- [ ] All above checklist items completed
- [ ] Latest code committed to `main` branch
- [ ] Build tested locally one more time
- [ ] Backup current production version (if updating)

### Initial Deployment
- [ ] Code pushed to GitHub
  ```bash
  git push origin main
  ```
- [ ] GitHub Actions workflow triggered
- [ ] Workflow completes successfully (check Actions tab)
- [ ] No errors in workflow logs
- [ ] Site accessible at production URL
- [ ] HTTPS working (green padlock in browser)

### Post-Deployment Verification
- [ ] Production URL loads correctly
- [ ] All assets load (no 404 errors in Network tab)
- [ ] CSS styling applied correctly
- [ ] JavaScript running (check for interactivity)
- [ ] Authentication works (Connect button)
- [ ] Can sign in with Azure account
- [ ] Dashboard loads with data
- [ ] All navigation links work
- [ ] API calls successful (check Network tab)

## 🔒 Security

### Application Security
- [ ] No credentials hardcoded in source
- [ ] No API keys or secrets in repository
- [ ] PKCE flow enabled (default in MSAL.js)
- [ ] Tokens stored in sessionStorage (not localStorage)
- [ ] HTTPS enforced (HTTP redirects to HTTPS)

### Azure Security
- [ ] Conditional Access policy applied to PIMBuddy app (recommended)
- [ ] MFA required for privileged accounts
- [ ] Sign-in logs monitored
- [ ] Audit logs enabled

### HTTP Security Headers (if custom hosting)
- [ ] Content-Security-Policy configured
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Strict-Transport-Security (HSTS)
- [ ] Referrer-Policy configured

## 📊 Monitoring

### Initial Monitoring
- [ ] Test all major workflows after deployment:
  - Create PIM group
  - Assign role to group
  - Activate eligible role
  - Approve activation request
  - Export configuration
- [ ] Check Azure Sign-in logs for successful authentication
- [ ] Verify no errors in Microsoft Graph API calls
- [ ] Monitor application performance (load times)

### Ongoing Monitoring
- [ ] Set up alerting for deployment failures
- [ ] Monitor GitHub Actions workflow runs
- [ ] Check Azure sign-in logs regularly
- [ ] Review PIM Activity logs weekly
- [ ] Run Health Check monthly

## 📚 Documentation

### User Documentation
- [ ] README.md is comprehensive and up-to-date
- [ ] QUICK_START.md provides clear getting-started guide
- [ ] DEPLOYMENT.md covers all deployment scenarios
- [ ] All documentation links work
- [ ] Screenshots current (if included)

### Developer Documentation
- [ ] CONTRIBUTING.md explains contribution process
- [ ] Code comments explain complex logic
- [ ] API permissions documented
- [ ] Architecture diagram current

### Communication
- [ ] Users notified of deployment (if existing users)
- [ ] Deployment announcement prepared (if applicable)
- [ ] Support channels ready (GitHub Issues, etc.)
- [ ] Changelog updated (if versioning)

## ✅ Final Checks

Before going live:
- [ ] **Run complete test suite** one more time
- [ ] **Verify Azure permissions** are all granted
- [ ] **Test authentication** from production URL
- [ ] **Check all environment configs** are correct
- [ ] **Backup current state** (export configuration)
- [ ] **Notify stakeholders** of deployment
- [ ] **Monitor first hour** of production use
- [ ] **Be ready to rollback** if critical issues found

## 🆘 Rollback Plan

If critical issues occur:

### GitHub Pages
1. Go to repository → Actions
2. Find last successful deployment
3. Re-run that workflow
4. Or revert commit and push:
   ```bash
   git revert HEAD
   git push origin main
   ```

### Immediate Actions
1. Notify users of known issues
2. Disable problematic features if possible
3. Fix issues locally
4. Test thoroughly
5. Redeploy

## 📋 Deployment Notes

**Date**: _________________
**Deployed By**: _________________
**Version**: _________________
**Deployment URL**: _________________
**Issues Encountered**: _________________
**Notes**: _________________

---

## ✨ Deployment Complete!

Once all items are checked:
- ✅ PIMBuddy is live and ready to use
- ✅ Monitor for 24-48 hours
- ✅ Gather user feedback
- ✅ Address any issues promptly

**Congratulations on deploying PIMBuddy!** 🎉

For ongoing maintenance, see [README.md](README.md) → Monitoring and Maintenance section.
