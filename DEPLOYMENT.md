# PIMBuddy Deployment Guide

This guide provides detailed instructions for deploying PIMBuddy to GitHub Pages and other platforms.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [GitHub Pages Deployment (Recommended)](#github-pages-deployment-recommended)
3. [Azure Static Web Apps](#azure-static-web-apps)
4. [Other Platforms](#other-platforms)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- [x] Completed local development setup (see [README.md](README.md))
- [x] Azure App Registration created with required permissions
- [x] Admin consent granted for all API permissions
- [x] Application builds successfully locally (`npm run build`)
- [x] GitHub account (for GitHub Pages deployment)

## GitHub Pages Deployment (Recommended)

GitHub Pages provides free, fast, and reliable hosting for static sites.

### Step 1: Prepare Your Repository

1. **Create a GitHub repository** (if not already created):
   ```bash
   # Initialize git (if not already done)
   cd c:/Users/RomanPadrun/PIMBuddy
   git init

   # Add all files
   git add .
   git commit -m "Initial commit: PIMBuddy v1.0.0"

   # Create repository on GitHub (via web interface or CLI)
   # Then add remote and push
   git remote add origin https://github.com/yourusername/PIMBuddy.git
   git branch -M main
   git push -u origin main
   ```

2. **Update repository name in Vite config**:

   The `vite.config.js` is already configured to use the base path `/PIMBuddy/`. If your repository has a different name, update line 6:

   ```javascript
   base: process.env.GITHUB_PAGES === 'true' ? '/YourRepoName/' : '/',
   ```

### Step 2: Configure Azure App Registration

1. Go to [Azure Portal](https://portal.azure.com) → **Microsoft Entra ID** → **App registrations**
2. Select your PIMBuddy app registration
3. Go to **Authentication** → **Platform configurations** → **Single-page application**
4. Add the production redirect URI:
   ```
   https://yourusername.github.io/PIMBuddy/
   ```

   **Important**:
   - Replace `yourusername` with your GitHub username
   - Replace `PIMBuddy` with your repository name (if different)
   - Include the trailing slash `/`
   - The URL is case-sensitive

5. Keep the development redirect URI (`http://localhost:3000`) for local testing
6. Click **Save**

### Step 3: Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - Source: **GitHub Actions**
4. Click **Save**

### Step 4: Deploy

The GitHub Actions workflow (`.github/workflows/deploy.yml`) is already configured to deploy automatically.

**Option A: Automatic Deployment (Recommended)**

Simply push to the `main` branch:

```bash
git add .
git commit -m "Deploy PIMBuddy"
git push origin main
```

The workflow will:
1. Install dependencies
2. Build the application (with `GITHUB_PAGES=true`)
3. Deploy to GitHub Pages

Check progress:
- Go to **Actions** tab in your repository
- Watch the "Deploy to GitHub Pages" workflow

**Option B: Manual Workflow Trigger**

1. Go to your repository → **Actions** tab
2. Select "Deploy to GitHub Pages" workflow
3. Click **Run workflow** → **Run workflow**

### Step 5: Verify Deployment

1. Wait for the workflow to complete (usually 2-5 minutes)
2. Visit `https://yourusername.github.io/PIMBuddy/`
3. You should see the PIMBuddy login page
4. Click **Connect** and sign in with your Azure account

### Step 6: Test the Application

1. **Authentication**: Click Connect and sign in
2. **Dashboard**: Verify dashboard loads with data
3. **PIM Groups**: Create a test group
4. **Roles**: Assign a role to a group
5. **Activations**: Test role activation flow
6. **Approvals**: Test approval workflow

### Updating the Deployment

To deploy updates:

```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push origin main
```

The workflow automatically redeploys on every push to `main`.

## Azure Static Web Apps

Azure Static Web Apps provides enterprise-grade hosting with custom domains, SSL, and staging environments.

### Step 1: Create Static Web App Resource

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **Create a resource** → Search "Static Web Apps"
3. Click **Create**
4. Configure:
   - **Subscription**: Your Azure subscription
   - **Resource group**: Create new or use existing
   - **Name**: `pimbuddy-app`
   - **Region**: Choose closest region
   - **Deployment source**: **GitHub**
5. Click **Sign in with GitHub** and authorize
6. Select:
   - **Organization**: Your GitHub username
   - **Repository**: `PIMBuddy`
   - **Branch**: `main`
7. **Build Details**:
   - **Build Presets**: Custom
   - **App location**: `/pimbuddy-web`
   - **Api location**: (leave empty)
   - **Output location**: `dist`
8. Click **Review + create** → **Create**

### Step 2: Update Azure App Registration

1. Azure will provide a URL like: `https://wonderful-ocean-123456.azurestaticapps.net`
2. Go to your Azure App Registration → **Authentication**
3. Add the Static Web Apps URL as a redirect URI:
   ```
   https://wonderful-ocean-123456.azurestaticapps.net/
   ```
4. Click **Save**

### Step 3: Update Vite Config (Optional)

For Azure Static Web Apps, you can use the root path. Edit `vite.config.js`:

```javascript
base: '/', // Use root for Azure Static Web Apps
```

Commit and push the change. Azure automatically redeploys.

### Step 4: Custom Domain (Optional)

1. Go to your Static Web App resource → **Custom domains**
2. Click **+ Add**
3. Follow instructions to configure DNS
4. Update Azure App Registration with custom domain redirect URI

## Other Platforms

### Netlify

1. **Sign up** at [netlify.com](https://netlify.com)
2. Click **Add new site** → **Import an existing project**
3. Connect GitHub and select `PIMBuddy` repository
4. Configure build:
   - **Base directory**: `pimbuddy-web`
   - **Build command**: `npm run build`
   - **Publish directory**: `pimbuddy-web/dist`
5. Click **Deploy**
6. Netlify provides a URL like: `https://pimbuddy-xyz.netlify.app`
7. Update Azure App Registration redirect URI
8. (Optional) Configure custom domain in Netlify settings

### Vercel

1. **Sign up** at [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import `PIMBuddy` repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `pimbuddy-web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**
6. Vercel provides a URL like: `https://pimbuddy.vercel.app`
7. Update Azure App Registration redirect URI
8. (Optional) Configure custom domain in Vercel settings

### AWS S3 + CloudFront

1. **Build the application**:
   ```bash
   cd pimbuddy-web
   npm run build
   ```

2. **Create S3 bucket**:
   - Go to AWS Console → S3
   - Create bucket (e.g., `pimbuddy-app`)
   - Enable static website hosting
   - Set index document: `index.html`
   - Set error document: `index.html` (for SPA routing)

3. **Upload files**:
   ```bash
   aws s3 sync dist/ s3://pimbuddy-app/ --delete
   ```

4. **Create CloudFront distribution**:
   - Origin: Your S3 bucket
   - Default root object: `index.html`
   - Error pages: 404 → `/index.html` (200 status code)

5. **Get CloudFront URL** (e.g., `https://d1234567890.cloudfront.net`)

6. **Update Azure App Registration** with CloudFront URL

7. **(Optional) Configure custom domain**:
   - Add alternate domain name (CNAME) in CloudFront
   - Request SSL certificate via ACM
   - Update Route 53 DNS records

### Custom Server (Apache/Nginx)

**Apache (.htaccess)**:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx**:

```nginx
server {
  listen 80;
  server_name pimbuddy.yourdomain.com;
  root /var/www/pimbuddy/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # Security headers
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;

  # Cache static assets
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

## Post-Deployment Configuration

### 1. Test All Features

After deployment, test the following:

- [ ] **Authentication**: Sign in works correctly
- [ ] **Dashboard**: Loads and displays data
- [ ] **PIM Groups**: Create, view, delete groups
- [ ] **Policies**: View and update policies
- [ ] **Roles**: Browse and assign roles
- [ ] **Activations**: Activate eligible roles
- [ ] **Approvals**: Review and approve requests
- [ ] **PIM Activity**: View audit logs
- [ ] **Health Check**: Run health checks
- [ ] **Export/Import**: Export and import configurations
- [ ] **Theme Toggle**: Switch between light and dark modes

### 2. Security Hardening

**Content Security Policy (CSP)**

Add CSP headers to your hosting platform:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
  img-src 'self' data: https:;
  connect-src 'self' https://login.microsoftonline.com https://graph.microsoft.com;
```

**HTTP Security Headers**

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### 3. Configure Conditional Access (Recommended)

Protect the PIMBuddy app with Azure Conditional Access:

1. Go to **Microsoft Entra ID** → **Security** → **Conditional Access**
2. Create new policy:
   - **Name**: Protect PIMBuddy Access
   - **Users**: All privileged role administrators
   - **Cloud apps**: Select PIMBuddy app
   - **Conditions**:
     - Require MFA
     - Trusted locations only (optional)
     - Compliant device (optional)
   - **Grant**: Require MFA
3. **Enable policy**

### 4. Monitor and Audit

**Enable Azure AD Sign-in Logs**:
- Monitor sign-ins to PIMBuddy app
- Set up alerts for suspicious activity

**Review PIM Activity Regularly**:
- Use PIMBuddy's PIM Activity page
- Export audit logs monthly

## Troubleshooting

### Deployment Fails on GitHub Actions

**Error**: `npm ci` fails

**Solution**:
```bash
# Generate package-lock.json locally
cd pimbuddy-web
npm install
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

---

**Error**: Build fails with module errors

**Solution**:
```bash
# Clear cache and rebuild locally
rm -rf node_modules dist .vite
npm install
npm run build

# If successful, commit and push
```

### Redirect URI Mismatch After Deployment

**Error**: `AADSTS50011: The redirect URI ... does not match`

**Solution**:
1. Check exact URL in browser (including protocol, case, trailing slash)
2. Go to Azure App Registration → Authentication
3. Ensure redirect URI exactly matches (case-sensitive)
4. Wait 5 minutes for changes to propagate
5. Clear browser cache and try again

### Application Loads but Shows "Not Configured"

**Error**: Bootstrap screen appears

**Solution**:
This is expected on first visit. Either:
1. **Bootstrap automatically**: Click "Bootstrap App Registration" and follow wizard
2. **Manual configuration**: Use the bootstrap feature to save config to localStorage

The configuration is saved in browser's localStorage, so users only need to configure once per browser.

### Assets Not Loading (404 errors)

**Error**: CSS/JS files return 404

**Solution**:
1. Check `vite.config.js` base path matches deployment path
2. For GitHub Pages: `base: '/PIMBuddy/'`
3. For root domain: `base: '/'`
4. Rebuild and redeploy after changing base path

### Mixed Content Warnings

**Error**: HTTPS page loading HTTP resources

**Solution**:
Ensure all resources use HTTPS:
1. Check `index.html` for HTTP links (Google Fonts, Font Awesome)
2. Update to HTTPS versions
3. Configure hosting to force HTTPS redirect

## Monitoring and Maintenance

### Monitor Application Performance

**GitHub Pages**:
- Check Actions tab for failed deployments
- Monitor repository size (stay under 1GB limit)

**Azure Static Web Apps**:
- Use Azure Monitor for metrics
- Set up alerts for errors and performance

### Update Dependencies

```bash
# Check for outdated packages
cd pimbuddy-web
npm outdated

# Update packages
npm update

# Test thoroughly
npm run build
npm run preview

# Commit and push
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Backup Configuration

Regularly export your PIM configuration:
1. Navigate to **Import/Export** in PIMBuddy
2. Click **Export Configuration**
3. Save JSON file to secure location
4. Store in version control or secure cloud storage

---

## Support

For deployment issues:
- Check [README.md](README.md) troubleshooting section
- Review [GitHub Issues](https://github.com/yourusername/PIMBuddy/issues)
- Create a new issue with deployment logs

**Happy deploying! 🚀**
