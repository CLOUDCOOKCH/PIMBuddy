# Umami Analytics Setup for PIMBuddy

## Overview

PIMBuddy now supports [Umami Analytics](https://umami.is/) - a privacy-focused, open-source web analytics platform that respects user privacy and doesn't require cookie consent banners.

---

## Why Umami?

✅ **Privacy-First**: GDPR, CCPA, and PECR compliant
✅ **No Cookies**: Doesn't use cookies, no consent banners needed
✅ **Lightweight**: ~2KB script, doesn't slow down your site
✅ **No Data Ownership**: You own all your data
✅ **Open Source**: Self-hostable or use Umami Cloud
✅ **Simple**: Clean, easy-to-use dashboard

---

## Quick Setup

### Option 1: Umami Cloud (Easiest)

1. **Create Umami Cloud Account**:
   - Go to [https://cloud.umami.is/signup](https://cloud.umami.is/signup)
   - Sign up for free (up to 100K pageviews/month)

2. **Create a Website**:
   - Click "Add Website"
   - **Name**: PIMBuddy
   - **Domain**: Your domain (e.g., `yourcompany.github.io`)
   - **Timezone**: Your timezone
   - Click "Save"

3. **Get Tracking Code**:
   - Click "Edit" on your website
   - Click "Tracking code" tab
   - Copy your **Website ID** (looks like: `12345678-1234-1234-1234-123456789abc`)
   - Note the script URL (e.g., `https://cloud.umami.is/script.js`)

4. **Update PIMBuddy**:

   Edit `pimbuddy-web/index.html` line 15-16:

   **Replace:**
   ```html
   <script async src="https://your-umami-instance.com/script.js" data-website-id="YOUR_WEBSITE_ID"></script>
   ```

   **With:**
   ```html
   <script async src="https://cloud.umami.is/script.js" data-website-id="YOUR_ACTUAL_WEBSITE_ID"></script>
   ```

   Example:
   ```html
   <script async src="https://cloud.umami.is/script.js" data-website-id="a1b2c3d4-e5f6-7890-abcd-ef1234567890"></script>
   ```

5. **Build and Deploy**:
   ```bash
   cd pimbuddy-web
   npm run build
   # Deploy to GitHub Pages / Azure / etc.
   ```

6. **Verify Tracking**:
   - Visit your deployed PIMBuddy site
   - Go to Umami dashboard
   - Click on your website
   - You should see real-time visitors!

---

### Option 2: Self-Hosted Umami (Advanced)

If you want complete control and unlimited pageviews:

1. **Deploy Umami**:

   Choose your hosting:
   - **Vercel** (Free): [Deploy to Vercel](https://vercel.com/new/clone?repository-url=https://github.com/umami-software/umami)
   - **Railway**: [Deploy to Railway](https://railway.app/new/template?template=https://github.com/umami-software/umami)
   - **Docker**: `docker run -d -p 3000:3000 ghcr.io/umami-software/umami:postgresql-latest`
   - **Manual**: Follow [official docs](https://umami.is/docs/install)

2. **Configure Database**:
   - PostgreSQL or MySQL required
   - Follow Umami setup wizard

3. **Create Website**:
   - Login to your Umami instance
   - Settings → Websites → Add Website
   - Get your tracking code

4. **Update PIMBuddy**:

   Edit `pimbuddy-web/index.html`:
   ```html
   <script async src="https://analytics.yourcompany.com/script.js" data-website-id="YOUR_WEBSITE_ID"></script>
   ```

---

## Configuration Options

### Basic Tracking (Default)

```html
<script async src="https://cloud.umami.is/script.js" data-website-id="YOUR_ID"></script>
```

Tracks:
- Page views
- Referrers
- Browsers
- Operating systems
- Devices
- Countries

### Custom Events

Track specific actions in PIMBuddy:

```javascript
// Track when user connects to Azure AD
umami.track('azure-connect', { method: 'popup' });

// Track when PIMMaid diagram is generated
umami.track('pimmaid-generate', { diagramType: 'full-hierarchy' });

// Track when health check is run
umami.track('health-check-run', { checkCount: 5 });
```

**Add to your JavaScript:**

```javascript
// Example: Track PIMMaid generation in PimmaidPage.js
async generateDiagram() {
    const diagramType = document.querySelector('input[name="diagram-type"]:checked')?.value;

    // Track event
    if (window.umami) {
        umami.track('pimmaid-generate', { type: diagramType });
    }

    // ... rest of your code
}
```

### Respect Do Not Track

Umami respects DNT by default, but you can disable if needed:

```html
<script async src="https://cloud.umami.is/script.js"
        data-website-id="YOUR_ID"
        data-do-not-track="true"></script>
```

### Auto-Track Events

Automatically track clicks on specific elements:

```html
<script async src="https://cloud.umami.is/script.js"
        data-website-id="YOUR_ID"
        data-auto-track="true"></script>
```

Then add `data-umami-event` to elements:

```html
<button data-umami-event="connect-button">Connect to Azure</button>
```

---

## What Gets Tracked?

### Automatically Tracked

- ✅ **Page views**: Dashboard, Groups, Roles, PIMMaid, etc.
- ✅ **Referrers**: Where visitors came from
- ✅ **Browser**: Chrome, Firefox, Edge, etc.
- ✅ **OS**: Windows, macOS, Linux
- ✅ **Device**: Desktop, Mobile, Tablet
- ✅ **Country**: Based on IP (no precise location)
- ✅ **Session duration**: How long users stay

### NOT Tracked (Privacy)

- ❌ **Personal data**: No names, emails, or identifiable info
- ❌ **Cookies**: No cookies set
- ❌ **IP addresses**: Not stored (only used for geolocation)
- ❌ **Cross-site tracking**: Only tracks your domain
- ❌ **Keyboard/mouse**: No session recording
- ❌ **Form data**: No form field values captured

---

## Viewing Analytics

### Dashboard

Access your Umami dashboard:
- **Cloud**: [https://cloud.umami.is](https://cloud.umami.is)
- **Self-hosted**: Your custom domain

### Key Metrics

1. **Real-time visitors**: See live users on your site
2. **Page views**: Most visited pages
3. **Traffic sources**: Where users come from
4. **Devices**: Desktop vs mobile usage
5. **Locations**: Geographic distribution
6. **Events**: Custom event tracking

### Useful Insights for PIMBuddy

Track:
- **Which features are most used** (Dashboard vs PIMMaid vs Health Check)
- **User engagement** (session duration, pages per session)
- **Geographic distribution** (where your organization accesses from)
- **Device types** (desktop vs mobile adoption)
- **Browser compatibility** (which browsers to prioritize)

---

## Advanced: Filtering Internal Traffic

If you want to exclude your own traffic:

### Option 1: Filter by IP (Self-Hosted Only)

In Umami settings:
- Go to Settings → Websites → Your Website
- Add your office IP to exclusion list

### Option 2: Filter in Browser

Add to your Umami script:

```javascript
// In app.js or index.html
if (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    localStorage.getItem('umami-disable') === 'true') {
    // Don't load Umami
} else {
    // Load Umami script
}
```

### Option 3: Browser Extension

Install "Umami Blocker" browser extension for Chrome/Firefox

---

## Compliance & Privacy

### GDPR Compliant ✅

- No personal data collected
- No cookies used
- Data minimization by design
- No consent banner needed

### Why No Consent Banner Needed?

According to GDPR:
- Umami doesn't use cookies or similar technologies
- Doesn't collect personal data
- Doesn't track users across websites
- Falls under "legitimate interest" (understanding site usage)

**Reference**: [GDPR Recital 47](https://gdpr-info.eu/recitals/no-47/)

However, check with your legal team if you want to be extra cautious.

---

## Troubleshooting

### Analytics Not Showing Up?

1. **Check script is loaded**:
   - Open browser DevTools (F12)
   - Go to Network tab
   - Refresh page
   - Look for `script.js` from your Umami domain
   - Should return 200 OK

2. **Check Website ID is correct**:
   - Copy-paste carefully (no extra spaces)
   - Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

3. **Check domain matches**:
   - Umami website domain should match deployed domain
   - `localhost` won't track unless enabled in settings

4. **Check ad blockers**:
   - Some ad blockers block analytics
   - Try in incognito mode
   - Umami is less likely to be blocked than GA4

5. **Check browser console for errors**:
   - Look for CORS or CSP errors
   - May need to update Content Security Policy headers

### Umami Script Blocked by CSP?

If you have Content Security Policy headers, add:

```http
Content-Security-Policy:
  script-src 'self' https://cloud.umami.is;
  connect-src 'self' https://cloud.umami.is;
```

Or for self-hosted:

```http
Content-Security-Policy:
  script-src 'self' https://analytics.yourcompany.com;
  connect-src 'self' https://analytics.yourcompany.com;
```

---

## Cost

### Umami Cloud Pricing

| Plan | Price | Pageviews | Websites |
|------|-------|-----------|----------|
| **Hobby** | Free | 100K/month | 3 |
| **Pro** | $9/month | 1M/month | 10 |
| **Business** | $29/month | 5M/month | 50 |

**For PIMBuddy**: Hobby plan (free) is usually sufficient for internal tools.

### Self-Hosted

**Free** (except hosting costs):
- Vercel: Free tier available
- Railway: $5/month
- DigitalOcean: $6/month
- AWS/Azure: ~$10-20/month

---

## Example Configuration

Here's a complete example setup:

```html
<!-- pimbuddy-web/index.html -->
<head>
    <!-- ... other meta tags ... -->

    <!-- Umami Analytics -->
    <script async
            src="https://cloud.umami.is/script.js"
            data-website-id="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
            data-domains="pimbuddy.yourcompany.com,yourcompany.github.io"
            data-auto-track="true"></script>
</head>
```

```javascript
// Optional: Custom event tracking in app.js
class PIMBuddyApp {
    async connect() {
        // ... connection logic ...

        // Track successful connection
        if (window.umami) {
            umami.track('azure-connected', {
                tenantId: this.tenantId.substring(0, 8) // Don't send full ID
            });
        }
    }
}
```

---

## Resources

- **Umami Docs**: [https://umami.is/docs](https://umami.is/docs)
- **Umami Cloud**: [https://cloud.umami.is](https://cloud.umami.is)
- **GitHub**: [https://github.com/umami-software/umami](https://github.com/umami-software/umami)
- **Community**: [https://github.com/umami-software/umami/discussions](https://github.com/umami-software/umami/discussions)

---

## Next Steps

1. ✅ Sign up for Umami Cloud (or deploy self-hosted)
2. ✅ Get your Website ID
3. ✅ Update `index.html` with your Website ID
4. ✅ Build and deploy PIMBuddy
5. ✅ Verify tracking works
6. 📊 Enjoy privacy-friendly analytics!

---

**Questions?** Check the [Umami documentation](https://umami.is/docs) or [open an issue](https://github.com/yourusername/pimbuddy/issues).
