# PIMBuddy Security Architecture

## Overview

PIMBuddy is a **static web application** (SPA) that uses industry-standard security practices for authentication and token management. This document explains how your credentials and tokens are handled securely.

---

## 🔐 Authentication: How It Works

### MSAL.js - Microsoft's Official Library

PIMBuddy uses [MSAL.js (Microsoft Authentication Library)](https://github.com/AzureAD/microsoft-authentication-library-for-js) - Microsoft's official, battle-tested library for OAuth 2.0 and OpenID Connect authentication.

**Why MSAL.js is secure:**
- ✅ Built and maintained by Microsoft's security team
- ✅ Used by millions of apps worldwide
- ✅ Follows OAuth 2.0 / OpenID Connect best practices
- ✅ Regular security updates and patches
- ✅ Implements PKCE (Proof Key for Code Exchange)

### Authentication Flow

```
1. User clicks "Sign In"
   ↓
2. PIMBuddy redirects to Microsoft login (login.microsoftonline.com)
   ↓
3. User authenticates with Microsoft (YOUR credentials go to Microsoft, NOT to PIMBuddy)
   ↓
4. Microsoft returns authorization code
   ↓
5. MSAL exchanges code for access token (using PKCE)
   ↓
6. Token stored securely in browser
   ↓
7. Token used for Graph API calls
```

**Key Security Point:** Your Azure AD password **NEVER** touches PIMBuddy. Authentication happens directly with Microsoft's servers.

---

## 🗄️ Where Are Tokens Stored?

### Access Tokens (Session Storage)

**Location:** Browser's `sessionStorage`

**Code Reference:** [authConfig.js:25](pimbuddy-web/src/config/authConfig.js#L25)
```javascript
cache: {
    cacheLocation: "sessionStorage",  // ← Tokens stored here
    storeAuthStateInCookie: false
}
```

**Why sessionStorage is secure:**

| Feature | Security Benefit |
|---------|-----------------|
| **Cleared on tab close** | Tokens automatically deleted when you close the browser tab |
| **Not shared across tabs** | Each tab has isolated storage |
| **Not accessible by other domains** | Protected by browser's Same-Origin Policy |
| **Immune to CSRF** | sessionStorage not sent with HTTP requests |
| **XSS protection** | Only JavaScript from pimbuddy.com can access it |

**What's stored:**
- Access tokens (JWT) - Valid for ~1 hour
- Refresh tokens - Used to get new access tokens
- ID tokens - Contains your identity info
- Token metadata (expiry, scopes)

**Lifetime:**
- Tokens expire after 1 hour
- When expired, MSAL automatically requests new tokens
- Closing browser tab = all tokens deleted

---

## 🔑 App Registration Info (Client ID & Tenant ID)

### Where Are They Stored?

**Location:** Browser's `localStorage`

**Code Reference:** [authConfig.js:54](pimbuddy-web/src/config/authConfig.js#L54)
```javascript
const saved = localStorage.getItem('pimbuddy-app-config');
```

**What's stored:**
```json
{
  "clientId": "12345678-1234-1234-1234-123456789abc",
  "tenantId": "87654321-4321-4321-4321-cba987654321"
}
```

### ⚠️ Is This Safe?

**YES! Here's why:**

#### Client ID is NOT a secret
- **Public by design** - OAuth 2.0 spec says client IDs are public
- Can be safely embedded in JavaScript, mobile apps, desktop apps
- Similar to your email address - identifies you but doesn't authenticate you
- Microsoft publishes client IDs in documentation examples

#### Tenant ID is NOT a secret
- **Public identifier** - Just identifies your Azure AD directory
- Can be discovered by anyone (e.g., via `https://login.microsoftonline.com/{domain}/.well-known/openid-configuration`)
- Same as your company domain (e.g., "contoso.onmicrosoft.com")

#### What IS a secret? (and what PIMBuddy NEVER stores)
❌ **Client Secrets** - Used by backend apps, NEVER by SPAs
❌ **User passwords** - Handled only by Microsoft
❌ **Private keys** - Not used in public client flows

### Public Client Application

PIMBuddy uses a **Public Client Application** registration:

```javascript
// authService.js:36
this.msalInstance = new PublicClientApplication(msalConfig);
```

**What this means:**
- ✅ No client secrets required
- ✅ Uses PKCE (Proof Key for Code Exchange) for security
- ✅ Recommended for SPAs by Microsoft
- ✅ Cannot be "hacked" by reading the client ID

**Why localStorage for app config?**
- Persists across browser sessions (so you don't reconfigure every time)
- NOT security-sensitive (client ID and tenant ID are public)
- Can be cleared anytime via Settings → Clear Configuration

---

## 🛡️ Security Best Practices Implemented

### 1. **PKCE (Proof Key for Code Exchange)**

PIMBuddy uses the Authorization Code flow with PKCE:

```
User → Login → Microsoft generates code_challenge
                     ↓
              Returns authorization code
                     ↓
              MSAL proves code_verifier matches
                     ↓
              Microsoft issues access token
```

**Why PKCE:**
- Prevents authorization code interception attacks
- Required for SPAs (recommended by OAuth 2.0 for Browser-Based Apps)
- No client secret needed

### 2. **No Hardcoded Credentials**

```javascript
// ✅ GOOD - User provides their own app registration
const config = getSavedAppConfig();

// ❌ BAD - Hardcoded credentials (PIMBuddy doesn't do this!)
const clientId = "hardcoded-client-id";
```

**Why this matters:**
- You control the app registration
- You control who has access
- You can revoke access anytime via Azure Portal
- No shared credentials with other users

### 3. **Minimal Scope Requests**

```javascript
// authConfig.js - Only requests necessary permissions
scopes: [
    "User.Read",
    "Group.Read.All",
    "RoleManagement.Read.Directory",
    // ... etc
]
```

**Principle of Least Privilege:**
- Only requests permissions PIMBuddy actually needs
- User/admin sees exactly what access is requested
- Can be limited further via Conditional Access policies

### 4. **Same-Origin Policy**

Browser enforces Same-Origin Policy:
- Only JavaScript from your PIMBuddy domain can access tokens
- Other websites cannot read your sessionStorage
- Protects against cross-site attacks

### 5. **No Backend = No Server-Side Attack Surface**

Because PIMBuddy is fully client-side:
- ✅ No database to hack
- ✅ No server to compromise
- ✅ No API keys stored server-side
- ✅ All authentication done by Microsoft

---

## 🚨 Threat Model & Mitigations

### Threat 1: XSS (Cross-Site Scripting)

**Risk:** Malicious JavaScript injected into PIMBuddy could steal tokens

**Mitigations:**
- ✅ Built with Vite (sanitizes HTML by default)
- ✅ No `eval()` or `innerHTML` with user input
- ✅ Content Security Policy headers (when deployed)
- ✅ sessionStorage cleared on tab close (limits exposure)

**Best Practice:** Only install PIMBuddy from trusted sources (e.g., your own deployment, official GitHub)

### Threat 2: Man-in-the-Middle (MITM)

**Risk:** Attacker intercepts traffic between browser and Microsoft

**Mitigations:**
- ✅ All authentication happens over HTTPS
- ✅ Microsoft login uses TLS 1.2+
- ✅ PKCE prevents code interception

**Best Practice:** Always access PIMBuddy via HTTPS (e.g., `https://yourcompany.github.io/pimbuddy`)

### Threat 3: Phishing

**Risk:** Fake login page steals credentials

**Mitigations:**
- ✅ Login happens on `login.microsoftonline.com` (Microsoft's domain)
- ✅ Users trained to verify URL before entering password
- ✅ Microsoft's anti-phishing features (anomaly detection, MFA)

**Best Practice:** Always verify you're on `login.microsoftonline.com` when entering credentials

### Threat 4: Malicious Browser Extensions

**Risk:** Browser extension reads sessionStorage

**Mitigations:**
- ⚠️ Browser extensions can access page context (this is a browser limitation)
- ✅ sessionStorage cleared on tab close (limits exposure)
- ✅ Tokens expire after 1 hour

**Best Practice:**
- Only install trusted browser extensions
- Use browser profiles to separate work from personal browsing
- Consider using Conditional Access to restrict access to trusted devices

### Threat 5: Stolen Device

**Risk:** Someone accesses PIMBuddy on unlocked device

**Mitigations:**
- ✅ sessionStorage cleared when tab closes
- ✅ Tokens expire after 1 hour
- ✅ Can revoke refresh tokens via Azure Portal

**Best Practice:**
- Lock your device when away
- Enable Conditional Access policies (e.g., require MFA, compliant device)
- Logout when finished

---

## 🔒 Additional Security Recommendations

### 1. **Deploy with HTTPS**

When deploying PIMBuddy:
- ✅ Always use HTTPS (GitHub Pages, Azure Static Web Apps provide this free)
- ✅ Enable HSTS (HTTP Strict Transport Security)
- ✅ Set CSP (Content Security Policy) headers

**Example CSP Header:**
```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  connect-src 'self' https://graph.microsoft.com https://login.microsoftonline.com;
  img-src 'self' data:;
```

### 2. **Configure Conditional Access**

In Azure AD, restrict PIMBuddy access:
- Require multi-factor authentication (MFA)
- Require compliant/managed devices
- Limit to specific IP ranges (office network)
- Block risky sign-ins

**How to:**
Azure Portal → Azure AD → Security → Conditional Access → Create policy

### 3. **Use Dedicated App Registration**

Don't reuse app registrations:
- ✅ Create a separate app registration just for PIMBuddy
- ✅ Name it clearly (e.g., "PIMBuddy - Production")
- ✅ Easier to audit and revoke if needed

### 4. **Monitor Sign-Ins**

Track PIMBuddy usage:
- Azure Portal → Azure AD → Sign-in logs
- Filter by application (Client ID)
- Look for anomalies (unusual locations, failed attempts)

### 5. **Regular Access Reviews**

Periodically review:
- Who has access to PIMBuddy app registration?
- What permissions are granted?
- Are all users still authorized?

---

## 🧪 Security Testing

### What You Can Test

1. **Token Storage:**
   ```javascript
   // Open browser DevTools (F12)
   // Go to: Application → Session Storage → {your-domain}
   // See tokens stored with keys like: msal.token.keys.xyz
   ```

2. **Token Expiry:**
   - Login to PIMBuddy
   - Wait 1+ hour (or manually delete token)
   - Navigate to a page → MSAL auto-refreshes token

3. **Tab Isolation:**
   - Login in Tab 1
   - Open Tab 2 → Not logged in (sessionStorage is tab-specific)

4. **Clear on Close:**
   - Login to PIMBuddy
   - Close browser tab
   - Reopen → Tokens gone

### Recommended Tools

- **Fiddler / Burp Suite** - Inspect HTTPS traffic (verify TLS)
- **OWASP ZAP** - Security scanning for deployed app
- **Browser DevTools** - Inspect storage, network requests

---

## 📋 Security Checklist

Before deploying PIMBuddy to production:

- [ ] Create dedicated app registration (don't reuse existing)
- [ ] Grant only necessary API permissions
- [ ] Require admin consent (don't allow user consent)
- [ ] Deploy via HTTPS (GitHub Pages / Azure Static Web Apps / etc.)
- [ ] Configure Content Security Policy headers
- [ ] Enable Conditional Access policies (MFA, device compliance)
- [ ] Review app permissions in Azure Portal
- [ ] Test token refresh and expiry
- [ ] Document who has access to app registration
- [ ] Set up sign-in log monitoring

---

## ❓ FAQ

### Q: Can someone steal my tokens by inspecting the page source?

**A:** No. Tokens are stored in `sessionStorage`, not in the HTML or JavaScript source code. You'd need to execute JavaScript in the browser console (same-origin) to access them.

### Q: What happens if I deploy PIMBuddy to a public website?

**A:** PIMBuddy requires authentication before showing any data. Anyone can load the page, but they must:
1. Sign in with their Azure AD account
2. Have permissions in YOUR tenant
3. Accept consent prompt

So only authorized users in your organization can access PIM data.

### Q: Should I use localStorage or sessionStorage for tokens?

**A:** **sessionStorage** (already configured). It's more secure because tokens are automatically cleared when you close the tab.

### Q: Can PIMBuddy work offline?

**A:** Partially. The PWA (Progressive Web App) can cache the app shell, but API calls to Microsoft Graph require an active internet connection and valid tokens.

### Q: How do I revoke access if my device is compromised?

**A:**
1. Azure Portal → Azure AD → Users → [Your User] → Devices → Delete device
2. Or: Azure AD → Enterprise Applications → PIMBuddy → Users and groups → Remove user
3. Or: Revoke refresh tokens: Azure AD → Users → [Your User] → Revoke sessions

### Q: Is my Client ID supposed to be visible in the browser?

**A:** Yes! Client IDs are public by design. This is normal and expected for SPAs. Only Client Secrets need to be kept private (and SPAs don't use them).

---

## 📚 Additional Resources

- [MSAL.js Documentation](https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-overview)
- [OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps)
- [Azure AD App Registration Best Practices](https://learn.microsoft.com/en-us/azure/active-directory/develop/security-best-practices-for-app-registration)
- [Conditional Access Policies](https://learn.microsoft.com/en-us/azure/active-directory/conditional-access/overview)
- [Microsoft Graph Permissions Reference](https://learn.microsoft.com/en-us/graph/permissions-reference)

---

## 🆘 Reporting Security Issues

If you discover a security vulnerability in PIMBuddy:

1. **DO NOT** open a public GitHub issue
2. Email the maintainer directly (see README.md)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if you have one)

We take security seriously and will respond promptly to all reports.

---

**Last Updated:** 2026-02-09
**Version:** 1.0
