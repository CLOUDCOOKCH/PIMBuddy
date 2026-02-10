/**
 * Authentication Service using MSAL.js
 * Handles login, logout, and token acquisition
 */

import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { getMsalConfig, graphScopes, isAppConfigured } from '../config/authConfig.js';

class AuthService {
    constructor() {
        this.msalInstance = null;
        this.account = null;
        this.initialized = false;
    }

    /**
     * Check if the app is configured (has client ID)
     */
    isConfigured() {
        return isAppConfigured();
    }

    /**
     * Initialize MSAL instance
     */
    async initialize() {
        if (this.initialized) return true;

        const msalConfig = getMsalConfig();
        if (!msalConfig) {
            console.log('MSAL not configured - bootstrap required');
            return false;
        }

        try {
            this.msalInstance = new PublicClientApplication(msalConfig);
            await this.msalInstance.initialize();

            // Handle redirect response
            const response = await this.msalInstance.handleRedirectPromise();
            if (response) {
                this.account = response.account;
            } else {
                // Check for existing accounts
                const accounts = this.msalInstance.getAllAccounts();
                if (accounts.length > 0) {
                    this.account = accounts[0];
                }
            }

            this.initialized = true;
            console.log('MSAL initialized successfully');
            return true;
        } catch (error) {
            console.error('MSAL initialization failed:', error);
            throw error;
        }
    }

    /**
     * Re-initialize after bootstrap (when config changes)
     */
    async reinitialize() {
        this.msalInstance = null;
        this.account = null;
        this.initialized = false;
        return await this.initialize();
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.account !== null;
    }

    /**
     * Get current account info
     */
    getAccount() {
        return this.account;
    }

    /**
     * Login with popup
     */
    async login() {
        if (!this.msalInstance) {
            return {
                success: false,
                error: 'App not configured. Please run setup first.'
            };
        }

        try {
            const response = await this.msalInstance.loginPopup({
                scopes: graphScopes.all,
                prompt: "select_account"
            });
            this.account = response.account;
            return {
                success: true,
                account: this.account
            };
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    /**
     * Login with redirect (alternative to popup)
     */
    async loginRedirect() {
        if (!this.msalInstance) {
            throw new Error('App not configured');
        }

        try {
            await this.msalInstance.loginRedirect({
                scopes: graphScopes.all
            });
        } catch (error) {
            console.error('Login redirect failed:', error);
            throw error;
        }
    }

    /**
     * Logout
     */
    async logout() {
        if (!this.msalInstance) {
            this.account = null;
            return { success: true };
        }

        try {
            await this.msalInstance.logoutPopup({
                account: this.account,
                postLogoutRedirectUri: window.location.origin
            });
            this.account = null;
            return { success: true };
        } catch (error) {
            console.error('Logout failed:', error);
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    /**
     * Get access token for API calls
     */
    async getAccessToken(scopes = graphScopes.all) {
        if (!this.account) {
            throw new Error('No account found. Please login first.');
        }

        const tokenRequest = {
            scopes: scopes,
            account: this.account
        };

        try {
            // Try silent token acquisition first
            const response = await this.msalInstance.acquireTokenSilent(tokenRequest);
            return response.accessToken;
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                // Silent acquisition failed, need interaction
                try {
                    const response = await this.msalInstance.acquireTokenPopup(tokenRequest);
                    return response.accessToken;
                } catch (popupError) {
                    console.error('Token acquisition failed:', popupError);
                    throw popupError;
                }
            }
            throw error;
        }
    }

    /**
     * Convert error to user-friendly message
     */
    getFriendlyError(error) {
        const errorMessage = error.message || error.toString();

        if (errorMessage.includes('user_cancelled')) {
            return 'Login was cancelled.';
        }
        if (errorMessage.includes('consent_required')) {
            return 'Admin consent is required for this application.';
        }
        if (errorMessage.includes('interaction_required')) {
            return 'Please sign in again.';
        }
        if (errorMessage.includes('invalid_client')) {
            return 'Application configuration error. Please check client ID.';
        }
        if (errorMessage.includes('unauthorized_client')) {
            return 'This application is not authorized in your tenant.';
        }
        if (errorMessage.includes('AADSTS700016')) {
            return 'Application not found. You may need to run setup again.';
        }

        return errorMessage;
    }
}

// Export singleton instance
export const authService = new AuthService();
