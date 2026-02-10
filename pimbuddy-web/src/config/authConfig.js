/**
 * MSAL Configuration for PIMBuddy
 * Supports both manual configuration and auto-bootstrapped app registration
 */

/**
 * Get the MSAL configuration
 * Checks for saved config from bootstrap, otherwise uses manual config
 */
export function getMsalConfig() {
    // Check for bootstrapped app configuration
    const savedConfig = getSavedAppConfig();

    if (savedConfig && savedConfig.clientId && savedConfig.tenantId) {
        console.log('Using bootstrapped app configuration');
        return {
            auth: {
                clientId: savedConfig.clientId,
                authority: `https://login.microsoftonline.com/${savedConfig.tenantId}`,
                redirectUri: window.location.origin,
                postLogoutRedirectUri: window.location.origin,
                navigateToLoginRequestUrl: true
            },
            cache: {
                cacheLocation: "sessionStorage",
                storeAuthStateInCookie: false
            },
            system: {
                loggerOptions: {
                    logLevel: 3,
                    loggerCallback: (level, message, containsPii) => {
                        if (containsPii) return;
                        switch (level) {
                            case 0: console.error(message); break;
                            case 1: console.warn(message); break;
                            case 2: console.info(message); break;
                            case 3: console.debug(message); break;
                        }
                    }
                }
            }
        };
    }

    // Fall back to manual configuration
    console.log('No saved config found - will need to bootstrap or configure manually');
    return null;
}

/**
 * Get saved app configuration from localStorage
 */
export function getSavedAppConfig() {
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
 * Check if app is configured
 */
export function isAppConfigured() {
    const config = getSavedAppConfig();
    return config && config.clientId && config.tenantId;
}

/**
 * Clear saved app configuration
 */
export function clearAppConfig() {
    localStorage.removeItem('pimbuddy-app-config');
}

// Scopes for Microsoft Graph API
export const loginRequest = {
    scopes: ["User.Read"]
};

// Scopes for PIM operations
export const graphScopes = {
    // Basic user info
    user: ["User.Read"],

    // Group operations
    groups: [
        "Group.Read.All",
        "Group.ReadWrite.All"
    ],

    // PIM for Groups
    pimGroups: [
        "PrivilegedAccess.Read.AzureADGroup",
        "PrivilegedAccess.ReadWrite.AzureADGroup",
        "PrivilegedEligibilitySchedule.Read.AzureADGroup",
        "PrivilegedEligibilitySchedule.ReadWrite.AzureADGroup",
        "PrivilegedAssignmentSchedule.Read.AzureADGroup",
        "PrivilegedAssignmentSchedule.ReadWrite.AzureADGroup"
    ],

    // Role management
    roles: [
        "RoleManagement.Read.Directory",
        "RoleManagement.ReadWrite.Directory"
    ],

    // All scopes combined for full access
    all: [
        "User.Read",
        "Group.Read.All",
        "Group.ReadWrite.All",
        "RoleManagement.Read.Directory",
        "RoleManagement.ReadWrite.Directory",
        "PrivilegedAccess.Read.AzureADGroup",
        "PrivilegedAccess.ReadWrite.AzureADGroup",
        "PrivilegedEligibilitySchedule.Read.AzureADGroup",
        "PrivilegedEligibilitySchedule.ReadWrite.AzureADGroup",
        "PrivilegedAssignmentSchedule.Read.AzureADGroup",
        "PrivilegedAssignmentSchedule.ReadWrite.AzureADGroup"
    ]
};

// Graph API endpoints
export const graphEndpoints = {
    me: "https://graph.microsoft.com/v1.0/me",
    groups: "https://graph.microsoft.com/v1.0/groups",
    roleDefinitions: "https://graph.microsoft.com/v1.0/roleManagement/directory/roleDefinitions",
    roleAssignments: "https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignmentScheduleInstances",
    pimGroupPolicies: "https://graph.microsoft.com/v1.0/policies/roleManagementPolicies",
    pimGroupAssignments: "https://graph.microsoft.com/v1.0/identityGovernance/privilegedAccess/group"
};
