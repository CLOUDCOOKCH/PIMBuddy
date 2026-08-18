# PIMBuddy Quick Start Guide

Get PIMBuddy running in 10 minutes!

## ⚡ Prerequisites

- ✅ Node.js 18+ installed ([Download](https://nodejs.org/))
- ✅ Azure tenant with Entra ID Premium P2
- ✅ Global Admin or Privileged Role Admin access

## 🚀 5-Step Setup

### 1. Clone & Install (2 min)

```bash
git clone https://github.com/yourusername/PIMBuddy.git
cd PIMBuddy/pimbuddy-web
npm install
```

### 2. Create Azure App Registration (3 min)

1. Open [Azure Portal](https://portal.azure.com) → **Microsoft Entra ID** → **App registrations**
2. Click **+ New registration**:
   - Name: `PIMBuddy`
   - Account type: **Single tenant**
   - Redirect URI: `Single-page application` → `http://localhost:3000`
3. Click **Register**
4. **Copy these values** (you'll need them):
   - Application (client) ID: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - Directory (tenant) ID: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### 3. Grant API Permissions (2 min)

In your app registration:

1. Go to **API permissions** → **+ Add a permission** → **Microsoft Graph** → **Delegated permissions**
2. Add these permissions:

**Copy-paste checklist**:
```
✓ User.Read
✓ Directory.Read.All
✓ Group.Read.All
✓ Group.ReadWrite.All
✓ RoleManagement.Read.Directory
✓ RoleManagement.ReadWrite.Directory
✓ PrivilegedAccess.Read.AzureADGroup
✓ PrivilegedAccess.ReadWrite.AzureADGroup
✓ PrivilegedEligibilitySchedule.Read.AzureADGroup
✓ PrivilegedEligibilitySchedule.ReadWrite.AzureADGroup
✓ PrivilegedAssignmentSchedule.Read.AzureADGroup
✓ PrivilegedAssignmentSchedule.ReadWrite.AzureADGroup
✓ RoleEligibilitySchedule.Read.Directory
✓ RoleEligibilitySchedule.ReadWrite.Directory
✓ RoleAssignmentSchedule.Read.Directory
✓ RoleAssignmentSchedule.ReadWrite.Directory
```

3. Click **✓ Grant admin consent for [Your Org]**
4. Confirm by clicking **Yes**

### 4. Configure PIMBuddy (1 min)

PIMBuddy uses the app registration you created above; it never creates another
registration during sign-in. On first run, click **Setup**, enter the
**Application (client) ID** and **Directory (tenant) ID** from that registration,
then click **Save & Connect**.

### 5. Run PIMBuddy (1 min)

```bash
npm run dev
```

The app opens at `http://localhost:3000`.

Click **Connect** → Sign in with your admin account → ✨ Done!

## 🎯 First Tasks

Try these to get familiar:

### Create Your First PIM Group

1. Click **PIM Groups** in sidebar
2. Click **+ Create Group**
3. Fill in:
   - Display Name: `Test PIM Group`
   - Description: `My first PIM-enabled group`
   - Owner: (select yourself)
4. Click **Create** ✅

### Assign a Role to the Group

1. Click **Entra Roles** in sidebar
2. Search for "User Administrator"
3. Click **Assign Group**
4. Select:
   - Group: `Test PIM Group`
   - Type: `Permanent Eligible` (recommended)
   - Justification: `Testing PIMBuddy`
5. Click **Assign** ✅

### Activate Your First Role

1. Add yourself to the PIM group:
   - Go to [Azure Portal](https://portal.azure.com) → **Groups**
   - Find `Test PIM Group`
   - Add yourself as a member
2. In PIMBuddy, click **My Activations**
3. Find "User Administrator"
4. Click **Activate**
5. Enter:
   - Duration: `4` hours
   - Justification: `Testing activation workflow`
6. Click **Activate** ✅
7. Your role is now active! 🎉

## 🌐 Deploy to GitHub Pages (5 min)

Want to deploy for production use?

### Quick Deploy

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial PIMBuddy setup"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository **Settings** → **Pages**
   - Source: **GitHub Actions**
   - Save

3. **Update Azure App Registration**:
   - Go to app registration → **Authentication**
   - Add redirect URI: `https://yourusername.github.io/PIMBuddy/`
   - Save

4. **Wait for deployment** (2-3 minutes):
   - Check **Actions** tab for progress

5. **Access your app**:
   - Open `https://yourusername.github.io/PIMBuddy/`
   - Click Connect and sign in
   - ✅ Live!

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 🆘 Troubleshooting

### "Failed to acquire token"

**Solution**: Check that:
- Client ID and Tenant ID are correct
- Redirect URI matches exactly (case-sensitive)
- Admin consent was granted

### "Insufficient privileges"

**Solution**:
- Verify all API permissions are added
- Ensure admin consent was granted
- Wait 5 minutes for permissions to propagate
- Sign out and sign in again

### Groups not showing

**Solution**:
- Check `Group.Read.All` permission is granted
- Refresh page (Ctrl+R or Cmd+R)
- Check browser console for errors (F12)

### Build fails

**Solution**:
```bash
# Use Node 18 or higher
node --version

# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 Learn More

- **Full Documentation**: [README.md](README.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Report Issues**: [GitHub Issues](https://github.com/yourusername/PIMBuddy/issues)

## 🎓 Understanding PIM Concepts

### Eligible vs Active Assignments

- **Eligible Assignment** (✅ Recommended):
  - User can *activate* the role when needed
  - Requires justification
  - Time-limited activation (e.g., 8 hours)
  - Follows just-in-time access principles

- **Active Assignment** (⚠️ Use sparingly):
  - User *always has* the role
  - Bypasses PIM protections
  - Should be used only for break-glass accounts

### Assignment Duration

- **Permanent**: No expiration (eligible or active stays forever)
- **Time-Bound**: Expires after duration (e.g., P30D = 30 days)

Format: ISO 8601 Duration
- `P1D` = 1 day
- `P7D` = 1 week
- `P30D` = 30 days
- `P365D` = 1 year
- `PT8H` = 8 hours (for activations)

## 🔐 Security Best Practices

1. ✅ **Always use Eligible assignments** (not Active)
2. ✅ **Require MFA** for activation
3. ✅ **Require justification** for all activations
4. ✅ **Limit activation duration** (max 8 hours recommended)
5. ✅ **Require approval** for sensitive roles (Global Admin, etc.)
6. ✅ **Review PIM Activity** regularly
7. ✅ **Run Health Checks** weekly
8. ✅ **Monitor expiring assignments** and renew as needed

## ⌨️ Keyboard Shortcuts

- **Alt + N**: Jump to navigation
- **Alt + M**: Jump to main content
- **Alt + S**: Jump to search
- **Tab / Shift+Tab**: Navigate between elements
- **Enter / Space**: Activate buttons
- **Escape**: Close modals

## 🎯 Next Steps

Once you're comfortable with basics:

1. **Explore Advanced Features**:
   - **Health Check**: Scan for PIM misconfigurations
   - **PIMMaid**: Automated cleanup of stale assignments
   - **Baseline Deploy**: Deploy recommended PIM policies
   - **Templates**: Save and reuse policy configurations

2. **Set Up Monitoring**:
   - Navigate to **PIM Activity** to view audit logs
   - Use **Expiring Assignments** to track renewals
   - Check **Role Coverage** for redundancy

3. **Integrate with Workflows**:
   - Configure **Approval Workflows** for sensitive roles
   - Set up **Notifications** for expiring assignments
   - Use **Import/Export** for backup and disaster recovery

4. **Secure Your Environment**:
   - Apply **Conditional Access** policies to PIMBuddy app
   - Require **MFA** for all privileged accounts
   - Implement **break-glass procedures**

---

**Ready to manage your privileged identities like a pro!** 🚀

Need help? Check [README.md](README.md) or [create an issue](https://github.com/yourusername/PIMBuddy/issues).
