# PIMBuddy Web

A static web application for managing Microsoft Entra ID Privileged Identity Management (PIM).

## Overview

PIMBuddy Web is a browser-based tool for managing PIM groups, policies, and role assignments. It uses MSAL.js for authentication and directly calls Microsoft Graph API.

## Features

- **Dashboard** - Overview of PIM groups, assignments, and recommendations
- **PIM Groups** - Create, manage, and delete role-assignable groups
- **Policies** - Configure activation duration, MFA, justification, and approval requirements
- **Entra Roles** - View and manage Entra ID role definitions
- **Templates** - Apply pre-configured policy templates
- **Import/Export** - Backup and restore PIM configurations
- **Dark/Light Theme** - User preference for UI theme

## Prerequisites

- Node.js 18+ (for development)
- Modern web browser
- Azure AD App Registration with required permissions

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Azure AD App

1. Go to [Azure Portal](https://portal.azure.com) > Microsoft Entra ID > App registrations
2. Create a new registration:
   - Name: `PIMBuddy Web`
   - Supported account types: Single tenant
   - Redirect URI: `Single-page application (SPA)` > `http://localhost:3000`
3. Copy the **Application (client) ID** and **Directory (tenant) ID**
4. Edit `src/config/authConfig.js` and replace:
   ```javascript
   clientId: "YOUR_CLIENT_ID_HERE",
   authority: "https://login.microsoftonline.com/YOUR_TENANT_ID_HERE",
   ```

### 3. Grant API Permissions

In your app registration, add these Microsoft Graph **Delegated** permissions:

| Permission | Description |
|------------|-------------|
| User.Read | Sign in and read user profile |
| Group.Read.All | Read all groups |
| Group.ReadWrite.All | Read and write all groups |
| RoleManagement.Read.Directory | Read role management data |
| RoleManagement.ReadWrite.Directory | Read and write role management data |
| PrivilegedAccess.Read.AzureADGroup | Read PIM for Groups |
| PrivilegedAccess.ReadWrite.AzureADGroup | Read and write PIM for Groups |
| PrivilegedEligibilitySchedule.Read.AzureADGroup | Read eligible schedules |
| PrivilegedEligibilitySchedule.ReadWrite.AzureADGroup | Manage eligible schedules |
| PrivilegedAssignmentSchedule.Read.AzureADGroup | Read assignment schedules |
| PrivilegedAssignmentSchedule.ReadWrite.AzureADGroup | Manage assignment schedules |

**Grant admin consent** for all permissions.

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 5. Build for Production

```bash
npm run build
```

Output files will be in the `dist/` folder.

## Deployment

### Azure Static Web Apps (Recommended)

1. Create an Azure Static Web App resource
2. Connect to your GitHub repository
3. Configure build settings:
   - App location: `/pimbuddy-web`
   - Output location: `dist`
4. Update your app registration with the production redirect URI

### Other Platforms

The `dist/` folder contains static files that can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static file hosting

## Project Structure

```
pimbuddy-web/
├── index.html              # Main HTML entry point
├── package.json            # NPM configuration
├── vite.config.js          # Vite build configuration
├── src/
│   ├── app.js              # Main application logic
│   ├── config/
│   │   └── authConfig.js   # MSAL and API configuration
│   ├── services/
│   │   ├── authService.js  # Authentication service
│   │   └── graphService.js # Microsoft Graph API calls
│   └── styles/
│       └── main.css        # Application styles
└── README.md               # This file
```

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
├─────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   app.js    │  │ authService │  │  MSAL   │ │
│  │  (UI/Logic) │  │   (.js)     │  │  .js    │ │
│  └──────┬──────┘  └──────┬──────┘  └────┬────┘ │
│         │                │               │      │
│         v                v               v      │
│  ┌─────────────────────────────────────────┐   │
│  │           graphService.js               │   │
│  │        (Microsoft Graph API)            │   │
│  └─────────────────┬───────────────────────┘   │
└────────────────────┼────────────────────────────┘
                     │
                     v
        ┌────────────────────────┐
        │   Microsoft Graph API  │
        │  graph.microsoft.com   │
        └────────────────────────┘
```

## Security Notes

- Uses PKCE flow (no client secrets stored in browser)
- Tokens stored in sessionStorage (cleared when tab closes)
- All API calls made directly to Microsoft Graph
- No backend server required

## Browser Support

- Chrome 80+
- Firefox 78+
- Edge 80+
- Safari 14+

## License

MIT
