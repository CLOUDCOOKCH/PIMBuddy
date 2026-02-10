# PIMBuddy

**Professional Microsoft Entra ID Privileged Identity Management Tool**

PIMBuddy is a comprehensive, browser-based tool for managing Microsoft Entra ID (formerly Azure AD) Privileged Identity Management (PIM). It provides an intuitive interface for managing PIM groups, role assignments, activations, approvals, and more—all without requiring a backend server.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## 🚀 Features

### Core Management
- **Dashboard** - Real-time overview of PIM groups, active assignments, and health metrics
- **PIM Groups** - Create, configure, and manage role-assignable security groups
- **Entra Roles** - Browse and assign Entra ID directory roles to groups
- **Policies** - Configure activation duration, MFA requirements, justification, and approval workflows

### Activation & Approval Workflows
- **My Activations** - View and manage your active and eligible role assignments
  - Activate eligible roles with justification
  - Extend or deactivate active assignments
  - Real-time status updates
- **Approvals** - Review and process pending activation requests
  - Approve or deny role activation requests
  - Add approval justifications
  - Multi-stage approval support
- **PIM Activity** - Comprehensive audit log of all PIM operations
  - Role activations, assignments, and policy changes
  - Filterable by date, user, and action type

### Health & Compliance
- **Health Check** - Proactive monitoring of PIM configuration
  - Detect groups without owners
  - Identify inactive eligible assignments
  - Find missing MFA requirements
  - Discover overly permissive activation durations
- **Expiring Assignments** - Track assignments nearing expiration
  - Automated notifications
  - Bulk renewal capabilities
- **Role Coverage** - Analyze role assignment distribution
  - Identify single points of failure
  - Ensure adequate coverage for critical roles

### Advanced Features
- **PIMMaid** - Automated cleanup and maintenance
  - Remove stale assignments
  - Archive inactive groups
  - Optimize policy configurations
- **Baseline Deploy** - Quick-start PIM configuration
  - Deploy recommended baseline policies
  - Industry best practices included
  - Customizable templates
- **Templates** - Reusable policy configurations
  - Save and apply policy templates
  - Share configurations across groups
- **Import/Export** - Backup and restore capabilities
  - Export entire PIM configuration to JSON
  - Import configurations for disaster recovery

### User Experience
- **Dark/Light Theme** - User preference persistence
- **Accessibility** - WCAG 2.1 AA compliant
  - Keyboard navigation (Alt+N, Alt+M, Alt+S shortcuts)
  - Screen reader support
  - Focus management
  - Skip links
- **Real-time Updates** - Live status indicators
- **Responsive Design** - Mobile and tablet friendly

## 📋 Prerequisites

### Technical Requirements
- **Node.js 18+** (for development)
- **Modern web browser** (Chrome 80+, Firefox 78+, Edge 80+, Safari 14+)
- **Microsoft Entra ID tenant** with Premium P2 licensing
- **Global Administrator or Privileged Role Administrator** access (for initial setup)

### Required Knowledge
- Basic understanding of Microsoft Entra ID
- Familiarity with PIM concepts (eligible vs active assignments)
- Azure App Registration setup

## 🛠️ Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/PIMBuddy.git
cd PIMBuddy/pimbuddy-web
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Azure App Registration

1. Navigate to [Azure Portal](https://portal.azure.com) → **Microsoft Entra ID** → **App registrations**
2. Click **+ New registration**
3. Configure:
   - **Name**: `PIMBuddy`
   - **Supported account types**: Accounts in this organizational directory only (Single tenant)
   - **Redirect URI**:
     - Type: `Single-page application (SPA)`
     - URI: `http://localhost:3000` (for development)
4. Click **Register**
5. Note the **Application (client) ID** and **Directory (tenant) ID**

### Step 4: Grant API Permissions

In your app registration, go to **API permissions** and add these **Microsoft Graph Delegated** permissions:

#### Essential Permissions
| Permission | Purpose |
|------------|---------|
| `User.Read` | Sign in and read user profile |
| `Directory.Read.All` | Read directory data |
| `Group.Read.All` | Read all groups |
| `Group.ReadWrite.All` | Create and manage groups |

#### PIM for Groups
| Permission | Purpose |
|------------|---------|
| `PrivilegedAccess.Read.AzureADGroup` | Read PIM for Groups data |
| `PrivilegedAccess.ReadWrite.AzureADGroup` | Manage PIM for Groups |
| `PrivilegedEligibilitySchedule.Read.AzureADGroup` | Read eligible assignments |
| `PrivilegedEligibilitySchedule.ReadWrite.AzureADGroup` | Manage eligible assignments |
| `PrivilegedAssignmentSchedule.Read.AzureADGroup` | Read active assignments |
| `PrivilegedAssignmentSchedule.ReadWrite.AzureADGroup` | Manage active assignments |

#### Role Management
| Permission | Purpose |
|------------|---------|
| `RoleManagement.Read.Directory` | Read Entra role definitions |
| `RoleManagement.ReadWrite.Directory` | Manage role assignments |
| `RoleEligibilitySchedule.Read.Directory` | Read eligible role schedules |
| `RoleEligibilitySchedule.ReadWrite.Directory` | Manage eligible role schedules |
| `RoleAssignmentSchedule.Read.Directory` | Read active role schedules |
| `RoleAssignmentSchedule.ReadWrite.Directory` | Manage active role schedules |

**Important**: Click **Grant admin consent** for your organization after adding permissions.

### Step 5: Configure Authentication

Edit `pimbuddy-web/src/config/authConfig.js`:

```javascript
export const msalConfig = {
    auth: {
        clientId: "YOUR_APPLICATION_CLIENT_ID_HERE",
        authority: "https://login.microsoftonline.com/YOUR_TENANT_ID_HERE",
        redirectUri: "http://localhost:3000"
    },
    // ... rest of config
};
```

Replace:
- `YOUR_APPLICATION_CLIENT_ID_HERE` with your Application (client) ID
- `YOUR_TENANT_ID_HERE` with your Directory (tenant) ID

### Step 6: Run Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`.

### Step 7: First Login

1. Click **Connect** in the sidebar
2. Sign in with your Microsoft account
3. Accept the permission consent prompt
4. You're ready to use PIMBuddy!

## 📦 Building for Production

Build the application for deployment:

```bash
npm run build
```

Output files are generated in the `dist/` folder (approx. 750KB total).

## 🌐 Deployment

### GitHub Pages (Recommended for Static Hosting)

#### Step 1: Update Configuration for GitHub Pages

Edit `pimbuddy-web/vite.config.js`:

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/PIMBuddy/', // Replace with your repository name
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  }
});
```

#### Step 2: Update Redirect URI

In your Azure App Registration, add the production redirect URI:
- Go to **Authentication** → **Platform configurations** → **Single-page application**
- Add URI: `https://yourusername.github.io/PIMBuddy/`

Also update `src/config/authConfig.js`:

```javascript
export const msalConfig = {
    auth: {
        clientId: "YOUR_CLIENT_ID",
        authority: "https://login.microsoftonline.com/YOUR_TENANT_ID",
        redirectUri: window.location.origin // Dynamic redirect
    },
    // ... rest
};
```

#### Step 3: Deploy to GitHub Pages

**Option A: Using GitHub Actions (Automated)**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: pimbuddy-web/package-lock.json

      - name: Install dependencies
        run: |
          cd pimbuddy-web
          npm ci

      - name: Build
        run: |
          cd pimbuddy-web
          npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: pimbuddy-web/dist

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Then:
1. Push to GitHub
2. Go to repository **Settings** → **Pages**
3. Source: **GitHub Actions**
4. The workflow will deploy automatically on every push to `main`

**Option B: Manual Deployment**

```bash
# Build the project
cd pimbuddy-web
npm run build

# Install gh-pages (if not already installed)
npm install -g gh-pages

# Deploy to gh-pages branch
gh-pages -d dist
```

Then enable GitHub Pages:
1. Go to repository **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `gh-pages` → `/ (root)`
4. Save

Your app will be live at `https://yourusername.github.io/PIMBuddy/`

### Azure Static Web Apps

1. Create an **Azure Static Web App** resource in Azure Portal
2. Connect to your GitHub repository
3. Configure build:
   - **App location**: `/pimbuddy-web`
   - **Output location**: `dist`
4. Azure will auto-deploy on commits
5. Update your app registration redirect URI with the Azure URL

### Other Platforms

The `dist/` folder can be deployed to:
- **Netlify**: Drag & drop the `dist` folder
- **Vercel**: Import GitHub repository
- **AWS S3 + CloudFront**: Upload `dist` contents
- **Any static web hosting**: Upload `dist` contents

## 🏗️ Architecture

### Technology Stack

- **Frontend Framework**: Vanilla JavaScript (ES6+)
- **Build Tool**: Vite 5
- **Authentication**: MSAL.js 3 (Microsoft Authentication Library)
- **API Client**: Microsoft Graph Client 3
- **Styling**: Custom CSS with CSS Variables for theming

### Application Architecture

```
┌───────────────────────────────────────────────────────────┐
│                        Browser                             │
├───────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │   app.js     │  │  PageRouter    │  │ Accessibility│  │
│  │ (Bootstrap)  │  │  (Navigation)  │  │   Manager    │  │
│  └──────┬───────┘  └────────┬───────┘  └──────────────┘  │
│         │                   │                              │
│         v                   v                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                   Page Components                     │ │
│  │  Dashboard | Groups | Roles | Activations | etc.     │ │
│  └─────────────────────────┬────────────────────────────┘ │
│                            │                               │
│                            v                               │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                Service Layer                          │ │
│  │  ┌──────────┐  ┌───────────┐  ┌──────────────────┐  │ │
│  │  │authService│  │graphService│  │templateService │  │ │
│  │  └────┬─────┘  └─────┬─────┘  └────────┬─────────┘  │ │
│  └───────┼──────────────┼─────────────────┼────────────┘ │
│          │              │                  │               │
│          v              │                  │               │
│  ┌──────────────┐       │                  │               │
│  │   MSAL.js    │       │                  │               │
│  │ (Auth Tokens)│       │                  │               │
│  └──────┬───────┘       │                  │               │
│         │               │                  │               │
└─────────┼───────────────┼──────────────────┼───────────────┘
          │               │                  │
          v               v                  v
    ┌────────────────────────────────────────────────────┐
    │         Microsoft Graph API                        │
    │         graph.microsoft.com                        │
    │  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │
    │  │   Groups    │  │    Roles    │  │    PIM    │  │
    │  └─────────────┘  └─────────────┘  └───────────┘  │
    └────────────────────────────────────────────────────┘
```

### Project Structure

```
PIMBuddy/
├── pimbuddy-web/                 # Web application
│   ├── index.html                # Entry point
│   ├── package.json              # Dependencies
│   ├── vite.config.js            # Build configuration
│   ├── src/
│   │   ├── app.js                # Application bootstrap
│   │   ├── config/
│   │   │   └── authConfig.js     # MSAL configuration
│   │   ├── core/
│   │   │   ├── PageRouter.js     # SPA routing
│   │   │   ├── AccessibilityManager.js
│   │   │   └── CacheManager.js   # Local caching
│   │   ├── pages/
│   │   │   ├── DashboardPage.js
│   │   │   ├── GroupsPage.js
│   │   │   ├── RolesPage.js
│   │   │   ├── ActivationsPage.js
│   │   │   ├── ApprovalsPage.js
│   │   │   ├── ActivityPage.js
│   │   │   ├── ExpiringPage.js
│   │   │   ├── HealthCheckPage.js
│   │   │   ├── CoveragePage.js
│   │   │   ├── PimmaidPage.js
│   │   │   ├── BaselinePage.js
│   │   │   ├── TemplatesPage.js
│   │   │   ├── ExportPage.js
│   │   │   └── SettingsPage.js
│   │   ├── services/
│   │   │   ├── authService.js    # Authentication
│   │   │   ├── graphService.js   # Graph API calls
│   │   │   ├── templateService.js
│   │   │   ├── pimmaidService.js
│   │   │   └── baselineService.js
│   │   ├── utils/
│   │   │   ├── uiComponents.js   # Reusable UI
│   │   │   ├── errorHandling.js
│   │   │   ├── pagination.js
│   │   │   ├── bulkOperations.js
│   │   │   └── security.js
│   │   └── styles/
│   │       └── main.css          # Application styles
│   └── dist/                     # Build output (generated)
├── Modules/                      # PowerShell modules (legacy)
├── GUI/                          # WPF GUI (legacy)
└── README.md                     # This file
```

## 🔐 Security

### Authentication & Authorization
- **PKCE Flow**: Uses Proof Key for Code Exchange (no client secrets in browser)
- **Token Storage**: Session storage (cleared on tab close)
- **Least Privilege**: Requests only required permissions
- **Admin Consent**: Required for organization-wide permissions

### Data Protection
- **No Backend**: All API calls direct to Microsoft Graph
- **In-Transit Encryption**: HTTPS only (enforced)
- **No Data Persistence**: No PII stored locally (except session tokens)
- **CSP Headers**: Content Security Policy recommended for production

### Best Practices
- Review and approve all permission requests
- Use Conditional Access policies for PIMBuddy app
- Enable MFA for all privileged accounts
- Regularly audit PIM activity logs
- Implement break-glass accounts

## 📚 Usage Guide

### Creating a PIM Group

1. Navigate to **PIM Groups**
2. Click **+ Create Group**
3. Fill in:
   - **Display Name**: Group name
   - **Description**: Purpose of the group
   - **Owner**: Select an owner (yourself or another user)
4. Click **Create**
5. The group is created as role-assignable and PIM-enabled

### Assigning a Role to a Group

1. Navigate to **Entra Roles**
2. Find the role you want to assign
3. Click **Assign Group**
4. Select:
   - **Group**: The PIM group
   - **Assignment Type**:
     - **Permanent Eligible** (Recommended): Users can activate anytime
     - **Time-Bound Eligible**: Eligible for a specific duration
     - **Permanent Active** ⚠️: Users always have the role (bypasses PIM)
     - **Time-Bound Active**: Active for a specific duration
   - **Duration** (if time-bound): e.g., "P30D" for 30 days
   - **Justification**: Business reason
5. Click **Assign**

### Activating an Eligible Role

1. Navigate to **My Activations**
2. Find your eligible role
3. Click **Activate**
4. Provide:
   - **Duration**: How long you need the role (max: policy limit)
   - **Justification**: Why you need it
   - **Ticket Number** (if required by policy)
5. Click **Activate**
6. If approval is required, status shows "Pending Approval"
7. Once approved, role becomes active

### Approving a Role Request

1. Navigate to **Approvals**
2. Review pending requests
3. Click **Review** on a request
4. Choose **Approve** or **Deny**
5. Provide justification
6. Click **Submit**

### Running a Health Check

1. Navigate to **Health Check**
2. Click **Run Health Check**
3. Review findings:
   - ❌ **Critical**: Immediate action required
   - ⚠️ **Warning**: Should be addressed
   - ✅ **Passed**: No issues
4. Click **View Details** for remediation steps
5. Click **Export Report** to save results

### Deploying Baseline Configuration

1. Navigate to **Baseline Deploy**
2. Review recommended settings:
   - Max activation duration: 8 hours
   - MFA required on activation
   - Justification required
   - Approval required for Global Admin
3. Select groups to apply baseline
4. Click **Deploy Baseline**
5. Confirm deployment

## 🎯 Keyboard Shortcuts

- **Alt + N**: Focus navigation menu
- **Alt + M**: Focus main content
- **Alt + S**: Focus search (if available on page)
- **Tab / Shift+Tab**: Navigate between elements
- **Enter / Space**: Activate buttons and links
- **Escape**: Close modals and dialogs

## 🐛 Troubleshooting

### "Failed to acquire token" Error

**Cause**: Authentication issue

**Solution**:
1. Check `authConfig.js` has correct client ID and tenant ID
2. Verify redirect URI matches in Azure app registration
3. Clear browser cache and cookies
4. Try signing in again

### "Insufficient privileges" Error

**Cause**: Missing API permissions

**Solution**:
1. Check all required permissions are granted
2. Ensure admin consent was granted
3. Wait 5-10 minutes for permissions to propagate
4. Sign out and sign in again

### "AADSTS50011: Redirect URI mismatch" Error

**Cause**: Redirect URI mismatch

**Solution**:
1. Go to Azure App Registration → Authentication
2. Ensure redirect URI exactly matches your deployment URL
3. For GitHub Pages: `https://yourusername.github.io/PIMBuddy/`
4. Case-sensitive, including trailing slash

### Groups Not Showing

**Cause**: API permissions or filtering

**Solution**:
1. Verify `Group.Read.All` permission is granted
2. Check if you have any groups in your tenant
3. Try refreshing the page (Ctrl+R)
4. Check browser console for errors (F12)

### Build Fails

**Cause**: Node version or dependency issues

**Solution**:
```bash
# Check Node version (should be 18+)
node --version

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Add comments for complex logic
- Test thoroughly before submitting
- Update README if adding new features
- Ensure accessibility compliance (WCAG 2.1 AA)

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2026 PIMBuddy Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Support

- **Issues**: Report bugs via [GitHub Issues](https://github.com/yourusername/PIMBuddy/issues)
- **Discussions**: Ask questions in [GitHub Discussions](https://github.com/yourusername/PIMBuddy/discussions)
- **Documentation**: See `/docs` folder for detailed guides

## 🙏 Acknowledgments

- Microsoft Graph API team for excellent documentation
- MSAL.js team for robust authentication library
- Entra ID PIM team for powerful privileged access management
- Community contributors

## 🗺️ Roadmap

- [ ] Multi-tenant support
- [ ] Azure Resource PIM support
- [ ] Advanced analytics and reporting
- [ ] Custom policy templates marketplace
- [ ] Mobile app (React Native)
- [ ] PowerShell module integration
- [ ] Automated compliance reports

---

**Built with ❤️ for secure identity management**
