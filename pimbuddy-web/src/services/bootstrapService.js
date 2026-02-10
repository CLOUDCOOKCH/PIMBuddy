/**
 * Bootstrap Service
 * Handles automatic app registration creation for first-time setup
 */

import { PublicClientApplication } from '@azure/msal-browser';

// Well-known Microsoft first-party app IDs that admins typically have consented to
const BOOTSTRAP_APPS = {
    // Azure PowerShell - widely used, usually consented
    azurePowerShell: {
        clientId: '1950a258-227b-4e31-a9cf-717495945fc2',
        name: 'Azure PowerShell'
    },
    // Azure CLI
    azureCli: {
        clientId: '04b07795-8ddb-461a-bbee-02f9e1bf7b46',
        name: 'Azure CLI'
    },
    // Microsoft Graph PowerShell
    graphPowerShell: {
        clientId: '14d82eec-204b-4c2f-b7e8-296a70dab67e',
        name: 'Microsoft Graph PowerShell'
    }
};

// Required permissions for PIMBuddy
const REQUIRED_PERMISSIONS = [
    { id: 'e1fe6dd8-ba31-4d61-89e7-88639da4683d', name: 'User.Read' },
    { id: '5b567255-7703-4780-807c-7be8301ae99b', name: 'Group.Read.All' },
    { id: '62a82d76-70ea-41e2-9197-370581804d09', name: 'Group.ReadWrite.All' },
    { id: '741f803b-c850-494e-b5df-cde7c675a1ca', name: 'RoleManagement.Read.Directory' },
    { id: 'd01b97e9-cbc0-49fe-810a-750afd5527a3', name: 'RoleManagement.ReadWrite.Directory' },
    { id: 'b2b87f60-9120-46e5-8216-db918ff7e7e2', name: 'PrivilegedAccess.Read.AzureADGroup' },
    { id: '2f6817f8-7b12-4f0f-bc18-eeaf60705a9e', name: 'PrivilegedAccess.ReadWrite.AzureADGroup' },
    { id: '8f44f1d5-9c18-4c4f-b354-1662e6d5fabd', name: 'PrivilegedEligibilitySchedule.Read.AzureADGroup' },
    { id: 'ba974594-d163-484e-ba39-c330d5897667', name: 'PrivilegedEligibilitySchedule.ReadWrite.AzureADGroup' },
    { id: '02a68f31-5e83-4d6e-b33c-b9d598c42c21', name: 'PrivilegedAssignmentSchedule.Read.AzureADGroup' },
    { id: '0da165c7-3f15-4236-b733-c0b0f6abe41d', name: 'PrivilegedAssignmentSchedule.ReadWrite.AzureADGroup' }
];

// Microsoft Graph resource ID
const GRAPH_RESOURCE_ID = '00000003-0000-0000-c000-000000000000';

class BootstrapService {
    constructor() {
        this.msalInstance = null;
        this.account = null;
        this.accessToken = null;
    }

    /**
     * Check if we have a saved app registration
     */
    getSavedAppConfig() {
        const saved = localStorage.getItem('pimbuddy-app-config');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return null;
            }
        }
        return null;
    }

    /**
     * Save app configuration
     */
    saveAppConfig(config) {
        localStorage.setItem('pimbuddy-app-config', JSON.stringify(config));
    }

    /**
     * Clear saved app configuration
     */
    clearAppConfig() {
        localStorage.removeItem('pimbuddy-app-config');
    }

    /**
     * Initialize bootstrap MSAL with a well-known app
     */
    async initializeBootstrap(appKey = 'azurePowerShell') {
        const bootstrapApp = BOOTSTRAP_APPS[appKey];
        if (!bootstrapApp) {
            throw new Error(`Unknown bootstrap app: ${appKey}`);
        }

        const msalConfig = {
            auth: {
                clientId: bootstrapApp.clientId,
                authority: 'https://login.microsoftonline.com/common',
                redirectUri: window.location.origin,
            },
            cache: {
                cacheLocation: 'sessionStorage',
                storeAuthStateInCookie: false
            }
        };

        this.msalInstance = new PublicClientApplication(msalConfig);
        await this.msalInstance.initialize();

        return bootstrapApp;
    }

    /**
     * Login with bootstrap app to get permissions to create app registrations
     */
    async bootstrapLogin() {
        // Scopes needed to create app registrations
        const scopes = [
            'User.Read',
            'Application.ReadWrite.All',
            'AppRoleAssignment.ReadWrite.All'
        ];

        try {
            const response = await this.msalInstance.loginPopup({
                scopes,
                prompt: 'select_account'
            });

            this.account = response.account;
            this.accessToken = response.accessToken;

            return {
                success: true,
                account: this.account
            };
        } catch (error) {
            console.error('Bootstrap login failed:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    /**
     * Get access token for Graph API calls
     */
    async getAccessToken() {
        if (!this.account) {
            throw new Error('Not logged in');
        }

        try {
            const response = await this.msalInstance.acquireTokenSilent({
                scopes: ['Application.ReadWrite.All'],
                account: this.account
            });
            return response.accessToken;
        } catch (error) {
            // Try popup if silent fails
            const response = await this.msalInstance.acquireTokenPopup({
                scopes: ['Application.ReadWrite.All'],
                account: this.account
            });
            return response.accessToken;
        }
    }

    /**
     * Make a Graph API request
     */
    async graphRequest(endpoint, options = {}) {
        const token = await this.getAccessToken();

        const response = await fetch(`https://graph.microsoft.com/v1.0${endpoint}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `HTTP ${response.status}`);
        }

        if (response.status === 204) return null;
        return response.json();
    }

    /**
     * Create the PIMBuddy app registration
     */
    async createAppRegistration() {
        const appName = 'PIMBuddy Web';
        const redirectUri = window.location.origin;

        // Check if app already exists
        const existingApps = await this.graphRequest(
            `/applications?$filter=displayName eq '${appName}'`
        );

        if (existingApps.value && existingApps.value.length > 0) {
            // App already exists, return it
            const existingApp = existingApps.value[0];
            console.log('Found existing PIMBuddy app registration:', existingApp.appId);

            return {
                success: true,
                appId: existingApp.appId,
                objectId: existingApp.id,
                isExisting: true
            };
        }

        // Create new app registration
        const appDefinition = {
            displayName: appName,
            signInAudience: 'AzureADMyOrg', // Single tenant
            spa: {
                redirectUris: [redirectUri, `${redirectUri}/`]
            },
            requiredResourceAccess: [{
                resourceAppId: GRAPH_RESOURCE_ID,
                resourceAccess: REQUIRED_PERMISSIONS.map(p => ({
                    id: p.id,
                    type: 'Scope' // Delegated permissions
                }))
            }]
        };

        try {
            const app = await this.graphRequest('/applications', {
                method: 'POST',
                body: JSON.stringify(appDefinition)
            });

            console.log('Created PIMBuddy app registration:', app.appId);

            return {
                success: true,
                appId: app.appId,
                objectId: app.id,
                isExisting: false
            };
        } catch (error) {
            console.error('Failed to create app registration:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Grant admin consent for the app (if user is admin)
     */
    async grantAdminConsent(appObjectId) {
        try {
            // Get the service principal for Microsoft Graph
            const graphSp = await this.graphRequest(
                `/servicePrincipals?$filter=appId eq '${GRAPH_RESOURCE_ID}'`
            );

            if (!graphSp.value || graphSp.value.length === 0) {
                throw new Error('Could not find Microsoft Graph service principal');
            }

            const graphSpId = graphSp.value[0].id;

            // Create service principal for our app (if it doesn't exist)
            const app = await this.graphRequest(`/applications/${appObjectId}`);

            let appSp;
            try {
                const existingSp = await this.graphRequest(
                    `/servicePrincipals?$filter=appId eq '${app.appId}'`
                );

                if (existingSp.value && existingSp.value.length > 0) {
                    appSp = existingSp.value[0];
                } else {
                    appSp = await this.graphRequest('/servicePrincipals', {
                        method: 'POST',
                        body: JSON.stringify({ appId: app.appId })
                    });
                }
            } catch (e) {
                // Service principal might already exist
                const existingSp = await this.graphRequest(
                    `/servicePrincipals?$filter=appId eq '${app.appId}'`
                );
                appSp = existingSp.value[0];
            }

            // Grant OAuth2 permission grants (admin consent)
            const existingGrants = await this.graphRequest(
                `/oauth2PermissionGrants?$filter=clientId eq '${appSp.id}' and resourceId eq '${graphSpId}'`
            );

            if (existingGrants.value && existingGrants.value.length > 0) {
                // Update existing grant
                await this.graphRequest(`/oauth2PermissionGrants/${existingGrants.value[0].id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        scope: REQUIRED_PERMISSIONS.map(p => p.name).join(' ')
                    })
                });
            } else {
                // Create new grant
                await this.graphRequest('/oauth2PermissionGrants', {
                    method: 'POST',
                    body: JSON.stringify({
                        clientId: appSp.id,
                        consentType: 'AllPrincipals',
                        resourceId: graphSpId,
                        scope: REQUIRED_PERMISSIONS.map(p => p.name).join(' ')
                    })
                });
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to grant admin consent:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get tenant ID from current account
     */
    getTenantId() {
        if (!this.account) return null;
        return this.account.tenantId;
    }

    /**
     * Full bootstrap process
     */
    async runBootstrap(onProgress) {
        const progress = (step, message, isError = false) => {
            console.log(`[Bootstrap] ${step}: ${message}`);
            if (onProgress) onProgress(step, message, isError);
        };

        try {
            // Step 1: Initialize bootstrap
            progress(1, 'Initializing...');
            await this.initializeBootstrap('azurePowerShell');

            // Step 2: Login
            progress(2, 'Please sign in with an admin account...');
            const loginResult = await this.bootstrapLogin();

            if (!loginResult.success) {
                progress(2, loginResult.error, true);
                return { success: false, error: loginResult.error };
            }

            progress(2, `Signed in as ${loginResult.account.username}`);

            // Step 3: Create app registration
            progress(3, 'Creating app registration...');
            const appResult = await this.createAppRegistration();

            if (!appResult.success) {
                progress(3, appResult.error, true);
                return { success: false, error: appResult.error };
            }

            if (appResult.isExisting) {
                progress(3, 'Found existing PIMBuddy app registration');
            } else {
                progress(3, 'App registration created');
            }

            // Step 4: Grant admin consent
            progress(4, 'Granting admin consent...');
            const consentResult = await this.grantAdminConsent(appResult.objectId);

            if (!consentResult.success) {
                progress(4, `Warning: ${consentResult.error}`, true);
                // Continue anyway - manual consent may be needed
            } else {
                progress(4, 'Admin consent granted');
            }

            // Step 5: Save configuration
            const tenantId = this.getTenantId();
            const config = {
                clientId: appResult.appId,
                tenantId: tenantId,
                createdAt: new Date().toISOString()
            };

            this.saveAppConfig(config);
            progress(5, 'Configuration saved!');

            return {
                success: true,
                config,
                needsConsent: !consentResult.success
            };
        } catch (error) {
            progress(0, error.message, true);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get user-friendly error message
     */
    getErrorMessage(error) {
        const msg = error.message || error.toString();

        if (msg.includes('user_cancelled')) {
            return 'Sign-in was cancelled';
        }
        if (msg.includes('consent_required') || msg.includes('AADSTS65001')) {
            return 'Admin consent is required. Please ask your administrator.';
        }
        if (msg.includes('AADSTS50076')) {
            return 'Multi-factor authentication is required';
        }
        if (msg.includes('AADSTS700016')) {
            return 'Application not found. Please contact your administrator.';
        }
        if (msg.includes('Authorization_RequestDenied')) {
            return 'You do not have permission to create app registrations. Global Administrator or Application Administrator role is required.';
        }

        return msg;
    }
}

export const bootstrapService = new BootstrapService();
