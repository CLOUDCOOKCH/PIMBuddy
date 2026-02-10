/**
 * Microsoft Graph API Service
 * Handles all Graph API calls for PIM operations
 */

import { authService } from './authService.js';
import { graphEndpoints, graphScopes } from '../config/authConfig.js';
import { SecurityUtils, rateLimiter } from '../utils/security.js';

class GraphService {
    constructor() {
        this.baseUrl = 'https://graph.microsoft.com/v1.0';
        this.betaUrl = 'https://graph.microsoft.com/beta';
    }

    /**
     * Make an authenticated Graph API request (with rate limiting)
     */
    async request(endpoint, options = {}) {
        // Determine rate limit type
        const method = options.method || 'GET';
        const rateLimitType = method === 'GET'
            ? (endpoint.includes('$filter') || endpoint.includes('$search') ? 'search' : 'default')
            : 'mutation';

        // Check rate limit
        if (!rateLimiter.isAllowed(endpoint, rateLimitType)) {
            const resetTime = rateLimiter.getResetTime(endpoint, rateLimitType);
            const error = new Error(`Rate limit exceeded. Try again in ${resetTime} seconds.`);
            error.code = 'RATE_LIMIT_EXCEEDED';
            error.resetTime = resetTime;
            throw error;
        }

        const token = await authService.getAccessToken();

        const defaultHeaders = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        const response = await fetch(endpoint, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            const error = new Error(errorBody.error?.message || `HTTP ${response.status}`);
            error.status = response.status;
            error.code = errorBody.error?.code;
            throw error;
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return null;
        }

        return response.json();
    }

    /**
     * GET request helper
     */
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    /**
     * GET request with custom headers
     */
    async getWithCustomHeaders(endpoint, customHeaders = {}) {
        return this.request(endpoint, {
            method: 'GET',
            headers: customHeaders
        });
    }

    /**
     * POST request helper
     */
    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    /**
     * PATCH request helper
     */
    async patch(endpoint, body) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body)
        });
    }

    /**
     * DELETE request helper
     */
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    /**
     * Batch request helper - sends multiple requests in a single HTTP call
     * Graph API limits: max 20 requests per batch
     * @param {Array} requests - Array of request objects { id, method, url, headers }
     * @returns {Object} Map of id -> response
     */
    async batch(requests) {
        if (!requests || requests.length === 0) {
            return {};
        }

        // Graph API batch limit is 20 requests per batch
        const BATCH_SIZE = 20;
        const chunks = this.chunkArray(requests, BATCH_SIZE);
        const allResponses = {};

        for (const chunk of chunks) {
            try {
                const batchPayload = {
                    requests: chunk.map((req, index) => ({
                        id: req.id || `${index}`,
                        method: req.method || 'GET',
                        url: req.url,
                        headers: req.headers || {}
                    }))
                };

                const response = await this.post(`${this.baseUrl}/$batch`, batchPayload);

                // Parse batch responses
                if (response && response.responses) {
                    response.responses.forEach(batchResponse => {
                        allResponses[batchResponse.id] = {
                            status: batchResponse.status,
                            body: batchResponse.body
                        };
                    });
                }
            } catch (error) {
                console.error('Batch request failed:', error);
                // Mark all requests in this chunk as failed
                chunk.forEach(req => {
                    allResponses[req.id] = {
                        status: 500,
                        body: { error: { message: error.message } }
                    };
                });
            }
        }

        return allResponses;
    }

    /**
     * Helper: chunk an array into smaller arrays
     * @param {Array} array - Array to chunk
     * @param {number} size - Chunk size
     * @returns {Array} Array of chunks
     */
    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    // ==========================================
    // User Operations
    // ==========================================

    /**
     * Get current user profile
     */
    async getMe() {
        return this.get(`${this.baseUrl}/me`);
    }

    // ==========================================
    // Group Operations
    // ==========================================

    /**
     * Get all role-assignable groups (PIM-eligible)
     */
    async getPIMGroups() {
        try {
            // Step 1: Fetch all PIM groups
            const response = await this.get(
                `${this.baseUrl}/groups?$filter=isAssignableToRole eq true&$select=id,displayName,description,createdDateTime,mailNickname`
            );

            const groups = response.value || [];

            if (groups.length === 0) {
                return { success: true, groups: [], count: 0 };
            }

            // Step 2: Build batch requests for member and owner counts
            // Using Graph batch API to reduce 200 requests to ~10 batch requests
            const batchRequests = [];

            groups.forEach((group, index) => {
                // Request for member count
                batchRequests.push({
                    id: `${index}-members`,
                    method: 'GET',
                    url: `/groups/${group.id}/members/$count`,
                    headers: { 'ConsistencyLevel': 'eventual' }
                });

                // Request for owner count
                batchRequests.push({
                    id: `${index}-owners`,
                    method: 'GET',
                    url: `/groups/${group.id}/owners/$count`,
                    headers: { 'ConsistencyLevel': 'eventual' }
                });
            });

            // Step 3: Execute batch requests
            const batchResponses = await this.batch(batchRequests);

            // Step 4: Map counts back to groups
            const groupsWithCounts = groups.map((group, index) => {
                const memberResponse = batchResponses[`${index}-members`];
                const ownerResponse = batchResponses[`${index}-owners`];

                const memberCount = (memberResponse?.status === 200 && typeof memberResponse.body === 'number')
                    ? memberResponse.body
                    : 0;

                const ownerCount = (ownerResponse?.status === 200 && typeof ownerResponse.body === 'number')
                    ? ownerResponse.body
                    : 0;

                return {
                    ...group,
                    memberCount,
                    ownerCount
                };
            });

            return {
                success: true,
                groups: groupsWithCounts,
                count: groupsWithCounts.length
            };
        } catch (error) {
            console.error('Failed to fetch PIM groups:', error);
            return {
                success: false,
                error: this.getFriendlyError(error),
                groups: []
            };
        }
    }

    /**
     * Get PIM groups with server-side pagination
     * @param {number} pageNumber - Page number (1-based)
     * @param {number} pageSize - Number of items per page
     * @returns {Object} Paginated result with items, totalCount, pageNumber, pageSize, totalPages
     */
    async getGroupsPage(pageNumber = 1, pageSize = 50) {
        try {
            const skip = (pageNumber - 1) * pageSize;

            // Fetch groups with pagination and total count
            const response = await this.getWithCustomHeaders(
                `${this.baseUrl}/groups?` +
                `$filter=isAssignableToRole eq true&` +
                `$select=id,displayName,description,createdDateTime,mailNickname&` +
                `$top=${pageSize}&` +
                `$skip=${skip}&` +
                `$count=true`,
                { 'ConsistencyLevel': 'eventual' }
            );

            const groups = response.value || [];
            const totalCount = response['@odata.count'] || 0;

            if (groups.length === 0) {
                return {
                    success: true,
                    items: [],
                    totalCount: 0,
                    pageNumber,
                    pageSize,
                    totalPages: 0
                };
            }

            // Build batch requests for member and owner counts
            const batchRequests = [];

            groups.forEach((group, index) => {
                batchRequests.push({
                    id: `${index}-members`,
                    method: 'GET',
                    url: `/groups/${group.id}/members/$count`,
                    headers: { 'ConsistencyLevel': 'eventual' }
                });

                batchRequests.push({
                    id: `${index}-owners`,
                    method: 'GET',
                    url: `/groups/${group.id}/owners/$count`,
                    headers: { 'ConsistencyLevel': 'eventual' }
                });
            });

            // Execute batch requests
            const batchResponses = await this.batch(batchRequests);

            // Map counts back to groups
            const groupsWithCounts = groups.map((group, index) => {
                const memberResponse = batchResponses[`${index}-members`];
                const ownerResponse = batchResponses[`${index}-owners`];

                const memberCount = (memberResponse?.status === 200 && typeof memberResponse.body === 'number')
                    ? memberResponse.body
                    : 0;

                const ownerCount = (ownerResponse?.status === 200 && typeof ownerResponse.body === 'number')
                    ? ownerResponse.body
                    : 0;

                return {
                    ...group,
                    memberCount,
                    ownerCount
                };
            });

            return {
                success: true,
                items: groupsWithCounts,
                totalCount,
                pageNumber,
                pageSize,
                totalPages: Math.ceil(totalCount / pageSize)
            };
        } catch (error) {
            console.error('Failed to fetch groups page:', error);
            return {
                success: false,
                error: this.getFriendlyError(error),
                items: [],
                totalCount: 0,
                pageNumber,
                pageSize,
                totalPages: 0
            };
        }
    }

    /**
     * Create a new PIM group
     */
    async createPIMGroup(displayName, description, mailNickname) {
        try {
            const group = await this.post(`${this.baseUrl}/groups`, {
                displayName,
                description,
                mailNickname: mailNickname || displayName.replace(/[^a-zA-Z0-9]/g, ''),
                mailEnabled: false,
                securityEnabled: true,
                isAssignableToRole: true,
                groupTypes: []
            });

            return {
                success: true,
                group
            };
        } catch (error) {
            console.error('Failed to create group:', error);
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    /**
     * Delete a group
     */
    async deleteGroup(groupId) {
        try {
            await this.delete(`${this.baseUrl}/groups/${groupId}`);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    /**
     * Get group members
     */
    async getGroupMembers(groupId) {
        try {
            const response = await this.get(
                `${this.baseUrl}/groups/${groupId}/members?$select=id,displayName,userPrincipalName,mail`
            );
            return {
                success: true,
                members: response.value || []
            };
        } catch (error) {
            return {
                success: false,
                error: this.getFriendlyError(error),
                members: []
            };
        }
    }

    /**
     * Add a member to a group
     */
    async addGroupMember(groupId, userId) {
        try {
            await this.post(`${this.baseUrl}/groups/${groupId}/members/$ref`, {
                '@odata.id': `https://graph.microsoft.com/v1.0/directoryObjects/${userId}`
            });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    /**
     * Remove a member from a group
     */
    async removeGroupMember(groupId, userId) {
        try {
            await this.delete(`${this.baseUrl}/groups/${groupId}/members/${userId}/$ref`);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    // ==========================================
    // PIM Policy Operations
    // ==========================================

    /**
     * Get PIM policy for a group
     */
    async getGroupPolicy(groupId, accessId = 'member') {
        try {
            // Get the policy assignment for this group
            const policiesResponse = await this.get(
                `${this.baseUrl}/policies/roleManagementPolicyAssignments?$filter=scopeId eq '${groupId}' and scopeType eq 'Group' and roleDefinitionId eq '${accessId}'`
            );

            if (!policiesResponse.value || policiesResponse.value.length === 0) {
                return {
                    success: false,
                    error: 'No PIM policy found for this group',
                    isDefault: true
                };
            }

            const policyAssignment = policiesResponse.value[0];
            const policyId = policyAssignment.policyId;

            // Get the policy rules
            const rulesResponse = await this.get(
                `${this.baseUrl}/policies/roleManagementPolicies/${policyId}/rules`
            );

            const rules = rulesResponse.value || [];
            const settings = this.parseRulesToSettings(rules);

            return {
                success: true,
                policyId,
                settings,
                rawRules: rules
            };
        } catch (error) {
            // Check if this is a permission error for PIM for Groups
            if (error.status === 403 && error.message?.includes('RoleManagementPolicy')) {
                // Silently handle - PIM for Groups requires additional permissions
                return {
                    success: false,
                    error: 'PIM for Groups not configured (requires additional permissions)',
                    requiresPermissions: true,
                    missingPermissions: ['RoleManagementPolicy.Read.AzureADGroup']
                };
            }

            console.error('Failed to get group policy:', error);
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    /**
     * Update PIM policy settings for a group
     * Uses beta endpoint for writes as v1.0 has limited support
     */
    async updateGroupPolicy(groupId, accessId, settings) {
        try {
            // First get the current policy
            const policyResult = await this.getGroupPolicy(groupId, accessId);
            if (!policyResult.success) {
                return policyResult;
            }

            const { policyId, rawRules } = policyResult;
            const updates = [];

            // Find and update relevant rules
            for (const rule of rawRules) {
                const ruleType = rule['@odata.type'];
                const ruleId = rule.id;

                // Update expiration rule (activation duration)
                if (ruleType === '#microsoft.graph.unifiedRoleManagementPolicyExpirationRule' &&
                    rule.target?.caller === 'EndUser') {
                    if (settings.maximumDurationHours !== undefined) {
                        updates.push(this.patch(
                            `${this.betaUrl}/policies/roleManagementPolicies/${policyId}/rules/${ruleId}`,
                            {
                                '@odata.type': ruleType,
                                id: ruleId,
                                isExpirationRequired: true,
                                maximumDuration: `PT${settings.maximumDurationHours}H`,
                                target: rule.target
                            }
                        ));
                    }
                }

                // Update enablement rule (MFA, justification)
                if (ruleType === '#microsoft.graph.unifiedRoleManagementPolicyEnablementRule' &&
                    rule.target?.caller === 'EndUser') {
                    const enabledRules = [];
                    if (settings.requireMfa) enabledRules.push('MultiFactorAuthentication');
                    if (settings.requireJustification) enabledRules.push('Justification');
                    if (settings.requireTicketInfo) enabledRules.push('Ticketing');

                    updates.push(this.patch(
                        `${this.betaUrl}/policies/roleManagementPolicies/${policyId}/rules/${ruleId}`,
                        {
                            '@odata.type': ruleType,
                            id: ruleId,
                            enabledRules,
                            target: rule.target
                        }
                    ));
                }

                // Update approval rule
                if (ruleType === '#microsoft.graph.unifiedRoleManagementPolicyApprovalRule') {
                    if (settings.requireApproval !== undefined) {
                        updates.push(this.patch(
                            `${this.betaUrl}/policies/roleManagementPolicies/${policyId}/rules/${ruleId}`,
                            {
                                '@odata.type': ruleType,
                                id: ruleId,
                                setting: {
                                    isApprovalRequired: settings.requireApproval,
                                    isApprovalRequiredForExtension: false,
                                    isRequestorJustificationRequired: true,
                                    approvalMode: 'SingleStage',
                                    approvalStages: settings.approverIds && settings.approverIds.length > 0 ? [{
                                        approvalStageTimeOutInDays: 1,
                                        isApproverJustificationRequired: true,
                                        escalationTimeInMinutes: 0,
                                        isEscalationEnabled: false,
                                        primaryApprovers: settings.approverIds.map(userId => ({
                                            '@odata.type': '#microsoft.graph.singleUser',
                                            userId: userId
                                        }))
                                    }] : []
                                },
                                target: rule.target
                            }
                        ));
                    }
                }
            }

            // Execute all updates in parallel
            await Promise.all(updates);

            return {
                success: true,
                updatedRules: updates.length
            };
        } catch (error) {
            console.error('Failed to update group policy:', error);
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    /**
     * Parse policy rules into a settings object
     */
    parseRulesToSettings(rules) {
        const settings = {
            activation: {
                maximumDurationHours: 8,
                requireMfa: true,
                requireJustification: true,
                requireTicketInfo: false,
                requireApproval: false,
                approvers: []
            },
            eligibleAssignment: {
                allowPermanent: true,
                maximumDurationDays: 365
            },
            activeAssignment: {
                allowPermanent: false,
                maximumDurationDays: 30,
                requireMfa: true,
                requireJustification: true
            }
        };

        for (const rule of rules) {
            const ruleType = rule['@odata.type'];
            const target = rule.target || {};

            // Expiration rules
            if (ruleType === '#microsoft.graph.unifiedRoleManagementPolicyExpirationRule') {
                const duration = rule.maximumDuration || 'PT8H';
                const hours = this.parseIsoDuration(duration);

                if (target.caller === 'EndUser') {
                    settings.activation.maximumDurationHours = hours;
                } else if (target.caller === 'Admin' && target.level === 'Eligibility') {
                    settings.eligibleAssignment.allowPermanent = !rule.isExpirationRequired;
                    settings.eligibleAssignment.maximumDurationDays = this.parseIsoDurationDays(duration);
                } else if (target.caller === 'Admin' && target.level === 'Assignment') {
                    settings.activeAssignment.allowPermanent = !rule.isExpirationRequired;
                    settings.activeAssignment.maximumDurationDays = this.parseIsoDurationDays(duration);
                }
            }

            // Enablement rules
            if (ruleType === '#microsoft.graph.unifiedRoleManagementPolicyEnablementRule') {
                const enabled = rule.enabledRules || [];
                if (target.caller === 'EndUser') {
                    settings.activation.requireMfa = enabled.includes('MultiFactorAuthentication');
                    settings.activation.requireJustification = enabled.includes('Justification');
                    settings.activation.requireTicketInfo = enabled.includes('Ticketing');
                }
            }

            // Approval rules
            if (ruleType === '#microsoft.graph.unifiedRoleManagementPolicyApprovalRule') {
                const approvalSetting = rule.setting || {};
                settings.activation.requireApproval = approvalSetting.isApprovalRequired || false;

                if (approvalSetting.approvalStages?.[0]?.primaryApprovers) {
                    settings.activation.approvers = approvalSetting.approvalStages[0].primaryApprovers
                        .filter(a => a.userId)
                        .map(a => a.userId);
                }
            }
        }

        return settings;
    }

    /**
     * Parse ISO 8601 duration to hours
     */
    parseIsoDuration(duration) {
        const match = duration.match(/PT(\d+)H/);
        return match ? parseInt(match[1]) : 8;
    }

    /**
     * Parse ISO 8601 duration to days
     */
    parseIsoDurationDays(duration) {
        const dayMatch = duration.match(/P(\d+)D/);
        if (dayMatch) return parseInt(dayMatch[1]);

        const hourMatch = duration.match(/PT(\d+)H/);
        if (hourMatch) return Math.ceil(parseInt(hourMatch[1]) / 24);

        return 365;
    }

    // ==========================================
    // Role Operations
    // ==========================================

    /**
     * Get all Entra ID role definitions
     */
    // Privilege level classification for Entra ID roles
    static PRIVILEGE_LEVELS = {
        critical: [
            '62e90394-69f5-4237-9190-012177145e10', // Global Administrator
            'e8611ab8-c189-46e8-94e1-60213ab1f814', // Privileged Role Administrator
            '194ae4cb-b126-40b2-bd5b-6091b380977d', // Security Administrator
            '9b895d92-2cd3-44c7-9d02-a6ac2d5ea5c3', // Application Administrator
            '158c047a-c907-4556-b7ef-446551a6b5f7', // Cloud Application Administrator
            '29232cdf-9323-42fd-ade2-1d097af3e4de', // Exchange Administrator
            'f28a1f50-f6e7-4571-818b-6a12f2af6b6c', // SharePoint Administrator
            'fe930be7-5e62-47db-91af-98c3a49a38b1', // User Administrator
        ],
        high: [
            '7be44c8a-adaf-4e2a-84d6-ab2649e08a13', // Privileged Authentication Administrator
            'c4e39bd9-1100-46d3-8c65-fb160da0071f', // Authentication Administrator
            'b1be1c3e-b65d-4f19-8427-f6fa0d97feb9', // Conditional Access Administrator
            '729827e3-9c14-49f7-bb1b-9608f156bbb8', // Helpdesk Administrator
            'b0f54661-2d74-4c50-afa3-1ec803f12efe', // Billing Administrator
            '966707d0-3269-4727-9be2-8c3a10f19b9d', // Password Administrator
            'fdd7a751-b60b-444a-984c-02652fe8fa1c', // Groups Administrator
            '3a2c62db-5318-420d-8d74-23affee5d9d5', // Intune Administrator
            '11648597-926c-4cf3-9c36-bcebb0ba8dcc', // Power Platform Administrator
        ],
        medium: [
            '44367163-eba1-44c3-98af-f5787879f96a', // Dynamics 365 Administrator
            '3d762c5a-1b6c-493f-843e-55a3b42923d4', // Teams Administrator
            '112f9467-49fe-4fc5-9abe-d52302e4f8c1', // Insights Administrator
            '31392ffb-586c-42d1-9346-e59415a2cc4e', // Exchange Recipient Administrator
            '892c5842-a9a6-463a-8041-72aa08ca3cf6', // Cloud Device Administrator
            '17315797-102d-40b4-93e0-432062caca18', // Compliance Administrator
            'd29b2b05-8046-44ba-8758-1e26182fcf32', // Directory Synchronization Accounts
        ],
        // All other roles are considered 'low' privilege
    };

    /**
     * Get privilege level for a role based on its templateId
     */
    getRolePrivilegeLevel(templateId) {
        if (GraphService.PRIVILEGE_LEVELS.critical.includes(templateId)) return 'critical';
        if (GraphService.PRIVILEGE_LEVELS.high.includes(templateId)) return 'high';
        if (GraphService.PRIVILEGE_LEVELS.medium.includes(templateId)) return 'medium';
        return 'low';
    }

    async getRoleDefinitions() {
        try {
            const response = await this.get(
                `${this.baseUrl}/roleManagement/directory/roleDefinitions?$select=id,displayName,description,isBuiltIn,templateId`
            );

            // Add privilege level to each role
            const roles = (response.value || []).map(role => ({
                ...role,
                privilegeLevel: this.getRolePrivilegeLevel(role.templateId || role.id)
            }));

            return {
                success: true,
                roles
            };
        } catch (error) {
            return {
                success: false,
                error: this.getFriendlyError(error),
                roles: []
            };
        }
    }

    /**
     * Get role definitions with server-side pagination
     * @param {number} pageNumber - Page number (1-based)
     * @param {number} pageSize - Number of items per page
     * @returns {Object} Paginated result with items, totalCount, pageNumber, pageSize, totalPages
     */
    async getRolesPage(pageNumber = 1, pageSize = 50) {
        try {
            const skip = (pageNumber - 1) * pageSize;

            const response = await this.getWithCustomHeaders(
                `${this.baseUrl}/roleManagement/directory/roleDefinitions?` +
                `$select=id,displayName,description,isBuiltIn,templateId&` +
                `$top=${pageSize}&` +
                `$skip=${skip}&` +
                `$count=true`,
                { 'ConsistencyLevel': 'eventual' }
            );

            const totalCount = response['@odata.count'] || 0;

            // Add privilege level to each role
            const roles = (response.value || []).map(role => ({
                ...role,
                privilegeLevel: this.getRolePrivilegeLevel(role.templateId || role.id)
            }));

            return {
                success: true,
                items: roles,
                totalCount,
                pageNumber,
                pageSize,
                totalPages: Math.ceil(totalCount / pageSize)
            };
        } catch (error) {
            return {
                success: false,
                error: this.getFriendlyError(error),
                items: [],
                totalCount: 0,
                pageNumber,
                pageSize,
                totalPages: 0
            };
        }
    }

    /**
     * Get role policy
     */
    async getRolePolicy(roleDefinitionId) {
        try {
            const policiesResponse = await this.get(
                `${this.baseUrl}/policies/roleManagementPolicyAssignments?$filter=scopeId eq '/' and scopeType eq 'DirectoryRole' and roleDefinitionId eq '${roleDefinitionId}'`
            );

            if (!policiesResponse.value || policiesResponse.value.length === 0) {
                return {
                    success: false,
                    error: 'No policy found for this role'
                };
            }

            const policyAssignment = policiesResponse.value[0];
            const policyId = policyAssignment.policyId;

            const rulesResponse = await this.get(
                `${this.baseUrl}/policies/roleManagementPolicies/${policyId}/rules`
            );

            const rules = rulesResponse.value || [];
            const settings = this.parseRulesToSettings(rules);

            return {
                success: true,
                policyId,
                settings,
                rawRules: rules
            };
        } catch (error) {
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    /**
     * Convert email addresses to user IDs
     * @param {Array<string>} emails - Array of email addresses
     * @returns {Promise<Array<string>>} Array of user IDs
     */
    async getUserIdsByEmails(emails) {
        if (!emails || emails.length === 0) {
            return [];
        }

        try {
            const userIds = [];

            for (const email of emails) {
                try {
                    const response = await this.get(
                        `${this.baseUrl}/users/${encodeURIComponent(email)}?$select=id`
                    );
                    userIds.push(response.id);
                } catch (error) {
                    console.warn(`Failed to find user ID for ${email}:`, error.message);
                    // Skip this email if user not found
                }
            }

            return userIds;
        } catch (error) {
            console.error('Failed to convert emails to user IDs:', error);
            return [];
        }
    }

    /**
     * Update PIM policy settings for a role
     * Uses beta endpoint for writes as v1.0 has limited support
     */
    async updateRolePolicy(roleDefinitionId, settings) {
        try {
            // First get the current policy
            const policyResult = await this.getRolePolicy(roleDefinitionId);
            if (!policyResult.success) {
                return policyResult;
            }

            const { policyId, rawRules } = policyResult;
            const updates = [];

            // Convert approver emails to user IDs if provided
            if (settings.approvers && settings.approvers.length > 0) {
                settings.approverIds = await this.getUserIdsByEmails(settings.approvers);
                if (settings.approverIds.length === 0) {
                    return {
                        success: false,
                        error: 'Could not find any of the specified approvers. Please check the email addresses.'
                    };
                }
            }

            // Find and update relevant rules
            for (const rule of rawRules) {
                const ruleType = rule['@odata.type'];
                const ruleId = rule.id;

                // Update expiration rule (activation duration)
                if (ruleType === '#microsoft.graph.unifiedRoleManagementPolicyExpirationRule' &&
                    rule.target?.caller === 'EndUser') {
                    if (settings.maximumDurationHours !== undefined) {
                        updates.push(this.patch(
                            `${this.betaUrl}/policies/roleManagementPolicies/${policyId}/rules/${ruleId}`,
                            {
                                '@odata.type': ruleType,
                                id: ruleId,
                                isExpirationRequired: true,
                                maximumDuration: `PT${settings.maximumDurationHours}H`,
                                target: rule.target
                            }
                        ));
                    }
                }

                // Update enablement rule (MFA, justification)
                if (ruleType === '#microsoft.graph.unifiedRoleManagementPolicyEnablementRule' &&
                    rule.target?.caller === 'EndUser') {
                    const enabledRules = [];
                    if (settings.requireMfa) enabledRules.push('MultiFactorAuthentication');
                    if (settings.requireJustification) enabledRules.push('Justification');
                    if (settings.requireTicketInfo) enabledRules.push('Ticketing');

                    updates.push(this.patch(
                        `${this.betaUrl}/policies/roleManagementPolicies/${policyId}/rules/${ruleId}`,
                        {
                            '@odata.type': ruleType,
                            id: ruleId,
                            enabledRules,
                            target: rule.target
                        }
                    ));
                }

                // Update approval rule
                if (ruleType === '#microsoft.graph.unifiedRoleManagementPolicyApprovalRule') {
                    if (settings.requireApproval !== undefined) {
                        updates.push(this.patch(
                            `${this.betaUrl}/policies/roleManagementPolicies/${policyId}/rules/${ruleId}`,
                            {
                                '@odata.type': ruleType,
                                id: ruleId,
                                setting: {
                                    isApprovalRequired: settings.requireApproval,
                                    isApprovalRequiredForExtension: false,
                                    isRequestorJustificationRequired: true,
                                    approvalMode: 'SingleStage',
                                    approvalStages: settings.approverIds && settings.approverIds.length > 0 ? [{
                                        approvalStageTimeOutInDays: 1,
                                        isApproverJustificationRequired: true,
                                        escalationTimeInMinutes: 0,
                                        isEscalationEnabled: false,
                                        primaryApprovers: settings.approverIds.map(userId => ({
                                            '@odata.type': '#microsoft.graph.singleUser',
                                            userId: userId
                                        }))
                                    }] : []
                                },
                                target: rule.target
                            }
                        ));
                    }
                }
            }

            // Execute all updates in parallel
            await Promise.all(updates);

            return {
                success: true,
                updatedRules: updates.length
            };
        } catch (error) {
            console.error('Failed to update role policy:', error);
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    // ==========================================
    // Assignment Operations
    // ==========================================

    /**
     * Get eligible assignments for a group
     */
    async getGroupEligibleAssignments(groupId) {
        try {
            const response = await this.get(
                `${this.baseUrl}/identityGovernance/privilegedAccess/group/eligibilityScheduleInstances?$filter=groupId eq '${groupId}'`
            );
            return {
                success: true,
                assignments: response.value || []
            };
        } catch (error) {
            return {
                success: false,
                error: this.getFriendlyError(error),
                assignments: []
            };
        }
    }

    /**
     * Get active assignments for a group
     */
    async getGroupActiveAssignments(groupId) {
        try {
            const response = await this.get(
                `${this.baseUrl}/identityGovernance/privilegedAccess/group/assignmentScheduleInstances?$filter=groupId eq '${groupId}'`
            );
            return {
                success: true,
                assignments: response.value || []
            };
        } catch (error) {
            return {
                success: false,
                error: this.getFriendlyError(error),
                assignments: []
            };
        }
    }

    /**
     * Get all assignments for multiple groups (for PIMMaid)
     */
    async getAllGroupAssignments(groups) {
        const assignments = {};

        for (const group of groups) {
            try {
                const [eligible, active] = await Promise.all([
                    this.getGroupEligibleAssignments(group.id),
                    this.getGroupActiveAssignments(group.id)
                ]);

                const eligibleUsers = (eligible.assignments || [])
                    .filter(a => a.principalId)
                    .map(a => ({
                        id: a.principalId,
                        displayName: a.principal?.displayName || 'Unknown User',
                        accessId: a.accessId
                    }));

                const activeUsers = (active.assignments || [])
                    .filter(a => a.principalId)
                    .map(a => ({
                        id: a.principalId,
                        displayName: a.principal?.displayName || 'Unknown User',
                        accessId: a.accessId
                    }));

                if (eligibleUsers.length > 0 || activeUsers.length > 0) {
                    assignments[group.id] = {
                        eligible: eligibleUsers,
                        active: activeUsers
                    };
                }
            } catch (error) {
                console.warn(`Failed to get assignments for group ${group.id}:`, error);
            }
        }

        return { success: true, assignments };
    }

    /**
     * Get role eligibility assignments
     */
    async getRoleEligibilityAssignments() {
        try {
            const response = await this.get(
                `${this.baseUrl}/roleManagement/directory/roleEligibilityScheduleInstances?$expand=principal`
            );
            return {
                success: true,
                assignments: response.value || []
            };
        } catch (error) {
            return {
                success: false,
                error: this.getFriendlyError(error),
                assignments: []
            };
        }
    }

    /**
     * Get role active assignments
     */
    async getRoleActiveAssignments() {
        try {
            const response = await this.get(
                `${this.baseUrl}/roleManagement/directory/roleAssignmentScheduleInstances?$expand=principal`
            );
            return {
                success: true,
                assignments: response.value || []
            };
        } catch (error) {
            return {
                success: false,
                error: this.getFriendlyError(error),
                assignments: []
            };
        }
    }

    /**
     * Get all role assignments grouped by role (for PIMMaid)
     */
    async getAllRoleAssignments() {
        try {
            const [eligible, active] = await Promise.all([
                this.getRoleEligibilityAssignments(),
                this.getRoleActiveAssignments()
            ]);

            const assignments = {};

            // Process eligible assignments
            for (const assignment of (eligible.assignments || [])) {
                const roleId = assignment.roleDefinitionId;
                if (!assignments[roleId]) {
                    assignments[roleId] = [];
                }
                assignments[roleId].push({
                    principalId: assignment.principalId,
                    principalDisplayName: assignment.principal?.displayName || 'Unknown',
                    principalType: assignment.principal?.['@odata.type']?.includes('group') ? 'Group' : 'User',
                    assignmentType: 'Eligible',
                    startDateTime: assignment.startDateTime,
                    endDateTime: assignment.endDateTime
                });
            }

            // Process active assignments
            for (const assignment of (active.assignments || [])) {
                const roleId = assignment.roleDefinitionId;
                if (!assignments[roleId]) {
                    assignments[roleId] = [];
                }
                assignments[roleId].push({
                    principalId: assignment.principalId,
                    principalDisplayName: assignment.principal?.displayName || 'Unknown',
                    principalType: assignment.principal?.['@odata.type']?.includes('group') ? 'Group' : 'User',
                    assignmentType: 'Active',
                    startDateTime: assignment.startDateTime,
                    endDateTime: assignment.endDateTime
                });
            }

            return { success: true, assignments };
        } catch (error) {
            return {
                success: false,
                error: this.getFriendlyError(error),
                assignments: {}
            };
        }
    }

    /**
     * Create eligible assignment for group membership
     */
    async createEligibleAssignment(groupId, principalId, accessId, startDateTime, endDateTime) {
        try {
            const body = {
                accessId,
                principalId,
                groupId,
                action: 'adminAssign',
                scheduleInfo: {
                    startDateTime: startDateTime || new Date().toISOString(),
                    expiration: endDateTime ? {
                        type: 'afterDateTime',
                        endDateTime
                    } : {
                        type: 'noExpiration'
                    }
                }
            };

            const result = await this.post(
                `${this.baseUrl}/identityGovernance/privilegedAccess/group/eligibilityScheduleRequests`,
                body
            );

            return {
                success: true,
                assignment: result
            };
        } catch (error) {
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    /**
     * Create directory role eligibility assignment
     * Assigns a group/user as eligible for an Entra ID role
     */
    async createDirectoryRoleEligibilityAssignment(principalId, roleDefinitionId, justification = 'Baseline deployment', durationMonths = 12) {
        try {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + durationMonths);

            const body = {
                action: 'adminAssign',
                justification: justification,
                roleDefinitionId: roleDefinitionId,
                directoryScopeId: '/',
                principalId: principalId,
                scheduleInfo: {
                    startDateTime: startDate.toISOString(),
                    expiration: {
                        type: 'afterDateTime',
                        endDateTime: endDate.toISOString()
                    }
                }
            };

            const result = await this.post(
                `${this.baseUrl}/roleManagement/directory/roleEligibilityScheduleRequests`,
                body
            );

            return {
                success: true,
                assignment: result
            };
        } catch (error) {
            console.error('Failed to create role eligibility assignment:', error);
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    /**
     * Create directory role active assignment
     * Assigns a group/user as permanently active for an Entra ID role
     */
    async createDirectoryRoleActiveAssignment(principalId, roleDefinitionId, justification = 'Baseline deployment - Active assignment') {
        try {
            const startDate = new Date();

            const body = {
                action: 'adminAssign',
                justification: justification,
                roleDefinitionId: roleDefinitionId,
                directoryScopeId: '/',
                principalId: principalId,
                scheduleInfo: {
                    startDateTime: startDate.toISOString(),
                    expiration: {
                        type: 'noExpiration'
                    }
                }
            };

            const result = await this.post(
                `${this.baseUrl}/roleManagement/directory/roleAssignmentScheduleRequests`,
                body
            );

            return {
                success: true,
                assignment: result
            };
        } catch (error) {
            console.error('Failed to create role active assignment:', error);
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    /**
     * Create directory role assignment (flexible - eligible or active, permanent or time-bound)
     * @param {string} principalId - User or group ID
     * @param {string} roleDefinitionId - Role definition ID
     * @param {string} assignmentType - 'eligible' or 'active'
     * @param {string} justification - Justification text
     * @param {string} startDateTime - Start date/time (ISO string)
     * @param {string|null} endDateTime - End date/time (ISO string) or null for permanent
     */
    async createDirectoryRoleEligibleAssignment(principalId, roleDefinitionId, justification, startDateTime, endDateTime) {
        try {
            const body = {
                action: 'adminAssign',
                justification: justification || 'Role assignment',
                roleDefinitionId: roleDefinitionId,
                directoryScopeId: '/',
                principalId: principalId,
                scheduleInfo: {
                    startDateTime: startDateTime,
                    expiration: endDateTime
                        ? {
                            type: 'afterDateTime',
                            endDateTime: endDateTime
                        }
                        : {
                            type: 'noExpiration'
                        }
                }
            };

            const result = await this.post(
                `${this.baseUrl}/roleManagement/directory/roleEligibilityScheduleRequests`,
                body
            );

            return {
                success: true,
                assignment: result
            };
        } catch (error) {
            console.error('Failed to create role eligible assignment:', error);
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    /**
     * Create directory role active assignment (flexible - permanent or time-bound)
     * @param {string} principalId - User or group ID
     * @param {string} roleDefinitionId - Role definition ID
     * @param {string} justification - Justification text
     * @param {string} startDateTime - Start date/time (ISO string)
     * @param {string|null} endDateTime - End date/time (ISO string) or null for permanent
     */
    async createDirectoryRoleActiveAssignment(principalId, roleDefinitionId, justification, startDateTime, endDateTime) {
        try {
            const body = {
                action: 'adminAssign',
                justification: justification || 'Active role assignment',
                roleDefinitionId: roleDefinitionId,
                directoryScopeId: '/',
                principalId: principalId,
                scheduleInfo: {
                    startDateTime: startDateTime,
                    expiration: endDateTime
                        ? {
                            type: 'afterDateTime',
                            endDateTime: endDateTime
                        }
                        : {
                            type: 'noExpiration'
                        }
                }
            };

            const result = await this.post(
                `${this.baseUrl}/roleManagement/directory/roleAssignmentScheduleRequests`,
                body
            );

            return {
                success: true,
                assignment: result
            };
        } catch (error) {
            console.error('Failed to create role active assignment:', error);
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    // ==========================================
    // Utility Methods
    // ==========================================

    /**
     * Search users (with OData injection protection)
     */
    async searchUsers(query) {
        try {
            // Validate and sanitize query
            const validation = SecurityUtils.validateInput(query, {
                maxLength: 200,
                required: true,
                minLength: 1
            });

            if (!validation.valid) {
                return {
                    success: false,
                    error: validation.error,
                    users: []
                };
            }

            // Build safe OData filters
            const displayNameFilter = SecurityUtils.buildODataFilter('displayName', 'startswith', validation.sanitized);
            const upnFilter = SecurityUtils.buildODataFilter('userPrincipalName', 'startswith', validation.sanitized);

            const response = await this.get(
                `${this.baseUrl}/users?$filter=${displayNameFilter} or ${upnFilter}&$select=id,displayName,userPrincipalName&$top=10`
            );
            return {
                success: true,
                users: response.value || []
            };
        } catch (error) {
            return {
                success: false,
                error: this.getFriendlyError(error),
                users: []
            };
        }
    }

    /**
     * Get PIM audit logs / directory audit logs
     */
    async getPIMAuditLogs(daysBack = 7) {
        try {
            const dateFilter = new Date();
            dateFilter.setDate(dateFilter.getDate() - daysBack);

            const response = await this.get(
                `${this.baseUrl}/auditLogs/directoryAudits?$filter=activityDateTime ge ${dateFilter.toISOString()} and category eq 'RoleManagement'&$top=50&$orderby=activityDateTime desc`
            );

            return {
                success: true,
                logs: response.value || []
            };
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
            return {
                success: false,
                error: this.getFriendlyError(error),
                logs: []
            };
        }
    }

    /**
     * Get pending PIM approval requests
     */
    async getPendingApprovals() {
        try {
            const response = await this.get(
                `${this.baseUrl}/roleManagement/directory/roleAssignmentScheduleRequests?$filter=status eq 'PendingApproval'&$expand=principal,roleDefinition`
            );

            return {
                success: true,
                requests: response.value || [],
                count: response.value?.length || 0
            };
        } catch (error) {
            console.error('Failed to fetch pending approvals:', error);
            return {
                success: false,
                error: this.getFriendlyError(error),
                requests: [],
                count: 0
            };
        }
    }

    /**
     * Approve or deny a PIM request
     */
    async reviewApprovalRequest(requestId, decision, justification) {
        try {
            // Step 1: Get the approval object for this request
            // Use the roleAssignmentApprovals endpoint (beta API)
            const approval = await this.get(
                `${this.betaUrl}/roleManagement/directory/roleAssignmentApprovals/${requestId}`
            );

            if (!approval.steps || approval.steps.length === 0) {
                return {
                    success: false,
                    error: 'No approval steps found'
                };
            }

            // Step 2: Find the pending step for the current approver
            const pendingStep = approval.steps.find(step =>
                step.status === 'InProgress' || step.status === 'NotStarted'
            );

            if (!pendingStep) {
                return {
                    success: false,
                    error: 'No pending approval step found. The request may have already been approved or denied.'
                };
            }

            // Step 3: Update the approval step with our decision
            const reviewResult = decision === 'approve' ? 'Approve' : 'Deny';

            await this.patch(
                `${this.betaUrl}/roleManagement/directory/roleAssignmentApprovals/${requestId}/steps/${pendingStep.id}`,
                {
                    reviewResult: reviewResult,
                    justification: justification
                }
            );

            return { success: true };
        } catch (error) {
            console.error('Failed to review approval:', error);
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    /**
     * Get active and eligible role assignments with expiration info
     */
    async getRoleAssignmentsWithExpiration() {
        try {
            // Get active assignments
            const activeResponse = await this.get(
                `${this.baseUrl}/roleManagement/directory/roleAssignmentScheduleInstances?$expand=principal,roleDefinition&$top=100`
            );

            // Get eligible assignments
            const eligibleResponse = await this.get(
                `${this.baseUrl}/roleManagement/directory/roleEligibilityScheduleInstances?$expand=principal,roleDefinition&$top=100`
            );

            const now = new Date();
            const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

            const activeAssignments = (activeResponse.value || []).map(a => ({
                ...a,
                type: 'active',
                isExpiring: a.endDateTime && new Date(a.endDateTime) <= sevenDaysFromNow
            }));

            const eligibleAssignments = (eligibleResponse.value || []).map(a => ({
                ...a,
                type: 'eligible',
                isExpiring: a.endDateTime && new Date(a.endDateTime) <= sevenDaysFromNow
            }));

            const expiringAssignments = [...activeAssignments, ...eligibleAssignments]
                .filter(a => a.isExpiring)
                .sort((a, b) => new Date(a.endDateTime) - new Date(b.endDateTime));

            return {
                success: true,
                activeCount: activeAssignments.length,
                eligibleCount: eligibleAssignments.length,
                expiringCount: expiringAssignments.length,
                expiringAssignments: expiringAssignments
            };
        } catch (error) {
            console.error('Failed to fetch role assignments:', error);
            return {
                success: false,
                error: this.getFriendlyError(error),
                activeCount: 0,
                eligibleCount: 0,
                expiringCount: 0,
                expiringAssignments: []
            };
        }
    }

    /**
     * Get role coverage report (which roles have PIM groups vs direct assignments)
     */
    async getRoleCoverageReport() {
        try {
            // Get all role-assignable groups
            const groupsResult = await this.getPIMGroups();
            const pimGroups = groupsResult.groups || [];

            // Get all role eligibilities
            const eligibilitiesResponse = await this.get(
                `${this.baseUrl}/roleManagement/directory/roleEligibilityScheduleInstances?$expand=principal,roleDefinition&$top=200`
            );

            const eligibilities = eligibilitiesResponse.value || [];

            // Categorize by principal type
            const groupAssignments = eligibilities.filter(e => e.principal?.['@odata.type']?.includes('group'));
            const userAssignments = eligibilities.filter(e => e.principal?.['@odata.type']?.includes('user'));

            // Group by role
            const roleMap = new Map();
            eligibilities.forEach(e => {
                const roleId = e.roleDefinition?.id;
                if (!roleId) return;

                if (!roleMap.has(roleId)) {
                    roleMap.set(roleId, {
                        roleId,
                        roleName: e.roleDefinition?.displayName || 'Unknown',
                        groupCount: 0,
                        userCount: 0,
                        isCovered: false
                    });
                }

                const role = roleMap.get(roleId);
                if (e.principal?.['@odata.type']?.includes('group')) {
                    role.groupCount++;
                    role.isCovered = true;
                } else if (e.principal?.['@odata.type']?.includes('user')) {
                    role.userCount++;
                }
            });

            const rolesArray = Array.from(roleMap.values());
            const coveredRoles = rolesArray.filter(r => r.isCovered);
            const uncoveredRoles = rolesArray.filter(r => !r.isCovered);

            return {
                success: true,
                totalRoles: rolesArray.length,
                coveredRoles: coveredRoles.length,
                uncoveredRoles: uncoveredRoles.length,
                totalPIMGroups: pimGroups.length,
                groupAssignmentsCount: groupAssignments.length,
                directUserAssignmentsCount: userAssignments.length,
                roles: rolesArray
            };
        } catch (error) {
            console.error('Failed to generate coverage report:', error);
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    /**
     * Run PIM health check
     */
    async runHealthCheck() {
        try {
            const issues = [];
            const warnings = [];

            // Check 1: Get all role assignments
            const assignmentsResult = await this.getRoleAssignmentsWithExpiration();

            if (assignmentsResult.expiringCount > 0) {
                warnings.push({
                    severity: 'warning',
                    category: 'Expiring Assignments',
                    message: `${assignmentsResult.expiringCount} role assignments expiring within 7 days`,
                    count: assignmentsResult.expiringCount
                });
            }

            // Check 2: Get coverage report
            const coverageResult = await this.getRoleCoverageReport();

            if (coverageResult.success && coverageResult.directUserAssignmentsCount > 0) {
                warnings.push({
                    severity: 'info',
                    category: 'Direct Assignments',
                    message: `${coverageResult.directUserAssignmentsCount} direct user assignments found (consider using groups)`,
                    count: coverageResult.directUserAssignmentsCount
                });
            }

            // Check 3: Check for groups without members
            const groupsResult = await this.getPIMGroups();
            const emptyGroups = (groupsResult.groups || []).filter(g => g.memberCount === 0);

            if (emptyGroups.length > 0) {
                warnings.push({
                    severity: 'info',
                    category: 'Empty Groups',
                    message: `${emptyGroups.length} PIM groups have no members`,
                    count: emptyGroups.length,
                    groups: emptyGroups.map(g => g.displayName)
                });
            }

            // Check 4: Get pending approvals
            const approvalsResult = await this.getPendingApprovals();

            if (approvalsResult.count > 0) {
                warnings.push({
                    severity: 'warning',
                    category: 'Pending Approvals',
                    message: `${approvalsResult.count} approval requests awaiting review`,
                    count: approvalsResult.count
                });
            }

            const healthScore = Math.max(0, 100 - (issues.length * 20) - (warnings.length * 5));

            return {
                success: true,
                healthScore,
                status: healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'warning' : 'critical',
                issues,
                warnings,
                checksRun: 4,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Health check failed:', error);
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    // ==========================================
    // PIM Activation Workflow Methods
    // ==========================================

    /**
     * Get current user's eligible role assignments
     * @returns {Promise<Object>} Result with eligible roles
     */
    async getMyEligibleRoles() {
        try {
            const response = await this.get(
                `${this.betaUrl}/roleManagement/directory/roleEligibilityScheduleInstances?` +
                `$filter=principalId eq '${await this.getCurrentUserId()}'&` +
                `$expand=roleDefinition`
            );

            const roles = (response.value || []).map(assignment => ({
                id: assignment.id,
                roleId: assignment.roleDefinitionId,
                displayName: assignment.roleDefinition?.displayName || 'Unknown Role',
                description: assignment.roleDefinition?.description || '',
                privilegeLevel: this.determinePrivilegeLevel(assignment.roleDefinition?.displayName),
                assignmentEnd: assignment.endDateTime,
                requiresApproval: false, // Would need to query policy
                requiresMfa: false, // Would need to query policy
                requiresJustification: true,
                requiresTicket: false,
                maxDuration: 8,
                defaultDuration: 4
            }));

            return {
                success: true,
                roles: roles
            };
        } catch (error) {
            console.error('Failed to get eligible roles:', error);
            return {
                success: false,
                error: this.getFriendlyError(error),
                roles: []
            };
        }
    }

    /**
     * Get current user's active role assignments
     * @returns {Promise<Object>} Result with active roles
     */
    async getMyActiveRoles() {
        try {
            const response = await this.get(
                `${this.betaUrl}/roleManagement/directory/roleAssignmentScheduleInstances?` +
                `$filter=principalId eq '${await this.getCurrentUserId()}' and assignmentType eq 'Activated'&` +
                `$expand=roleDefinition`
            );

            const roles = (response.value || []).map(assignment => ({
                id: assignment.id,
                roleId: assignment.roleDefinitionId,
                displayName: assignment.roleDefinition?.displayName || 'Unknown Role',
                description: assignment.roleDefinition?.description || '',
                privilegeLevel: this.determinePrivilegeLevel(assignment.roleDefinition?.displayName),
                startDateTime: assignment.startDateTime,
                endDateTime: assignment.endDateTime,
                justification: assignment.justification,
                ticketNumber: assignment.ticketInfo?.ticketNumber,
                canExtend: false // Would need to check policy
            }));

            return {
                success: true,
                roles: roles
            };
        } catch (error) {
            console.error('Failed to get active roles:', error);
            return {
                success: false,
                error: this.getFriendlyError(error),
                roles: []
            };
        }
    }

    /**
     * Get role assignment details
     * @param {string} roleId - Role ID
     * @returns {Promise<Object>} Result with role details
     */
    async getRoleAssignmentDetails(roleId) {
        try {
            // Try to get the actual policy from Microsoft Graph
            // Note: This uses the roleManagementPolicies endpoint which may require additional permissions
            try {
                const response = await this.get(
                    `${this.betaUrl}/policies/roleManagementPolicies?` +
                    `$filter=scopeId eq '/' and scopeType eq 'DirectoryRole'&` +
                    `$expand=rules`
                );

                // Find policy for this specific role
                const policy = response.value.find(p =>
                    p.rules?.some(r => r.target?.targetObjects?.some(obj => obj === roleId))
                );

                if (policy) {
                    // Parse activation rules
                    const activationRules = policy.rules || [];

                    // Find enablement rules (MFA, approval, justification, ticket)
                    const enablementRule = activationRules.find(r =>
                        r['@odata.type'] === '#microsoft.graph.unifiedRoleManagementPolicyEnablementRule' &&
                        r.target?.caller === 'EndUser' &&
                        r.target?.operations?.includes('All')
                    );

                    // Find approval rules
                    const approvalRule = activationRules.find(r =>
                        r['@odata.type'] === '#microsoft.graph.unifiedRoleManagementPolicyApprovalRule' &&
                        r.target?.caller === 'EndUser'
                    );

                    // Find expiration rules for duration
                    const expirationRule = activationRules.find(r =>
                        r['@odata.type'] === '#microsoft.graph.unifiedRoleManagementPolicyExpirationRule' &&
                        r.target?.caller === 'EndUser' &&
                        r.target?.operations?.includes('All')
                    );

                    const enabledRules = enablementRule?.enabledRules || [];

                    return {
                        success: true,
                        requiresMFA: enabledRules.includes('MultiFactorAuthentication'),
                        requiresApproval: approvalRule?.setting?.isApprovalRequired || false,
                        requiresJustification: enabledRules.includes('Justification'),
                        requiresTicket: enabledRules.includes('Ticketing'),
                        maxDuration: this.parseIsoDuration(expirationRule?.maximumDuration) || 8,
                        defaultDuration: 4,
                        approvers: approvalRule?.setting?.approvalStages?.[0]?.primaryApprovers || []
                    };
                }
            } catch (policyError) {
                // If policy fetch fails (permissions issue), fall back to defaults
                console.warn('Could not fetch policy, using defaults:', policyError.message);
            }

            // Return default policy requirements if we couldn't get the actual policy
            return {
                success: true,
                requiresMFA: false,
                requiresApproval: false,
                requiresJustification: true,
                requiresTicket: false,
                maxDuration: 8,
                defaultDuration: 4,
                approvers: []
            };
        } catch (error) {
            console.error('Failed to get role details:', error);
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    /**
     * Activate a role
     * @param {Object} request - Activation request
     * @returns {Promise<Object>} Result
     */
    async activateRole(request) {
        try {
            const userId = await this.getCurrentUserId();

            // Create activation request
            const activationRequest = {
                principalId: userId,
                roleDefinitionId: request.roleId,
                directoryScopeId: '/',
                action: 'selfActivate',
                justification: request.justification || 'Role activation',
                scheduleInfo: {
                    startDateTime: new Date().toISOString(),
                    expiration: {
                        type: 'afterDuration',
                        duration: `PT${request.duration}H`
                    }
                }
            };

            // Add ticket info if provided
            if (request.ticketNumber) {
                activationRequest.ticketInfo = {
                    ticketNumber: request.ticketNumber,
                    ticketSystem: 'Manual'
                };
            }

            await this.post(
                `${this.betaUrl}/roleManagement/directory/roleAssignmentScheduleRequests`,
                activationRequest
            );

            return {
                success: true,
                requiresApproval: false // Would be determined by policy
            };
        } catch (error) {
            console.error('Failed to activate role:', error);
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    /**
     * Deactivate a role
     * @param {string} assignmentId - Assignment ID
     * @returns {Promise<Object>} Result
     */
    async deactivateRole(assignmentId) {
        try {
            const userId = await this.getCurrentUserId();

            // Get the assignment details first
            const assignment = await this.get(
                `${this.betaUrl}/roleManagement/directory/roleAssignmentScheduleInstances/${assignmentId}`
            );

            // Create deactivation request
            const deactivationRequest = {
                principalId: userId,
                roleDefinitionId: assignment.roleDefinitionId,
                directoryScopeId: '/',
                action: 'selfDeactivate',
                justification: 'Manual deactivation'
            };

            await this.post(
                `${this.betaUrl}/roleManagement/directory/roleAssignmentScheduleRequests`,
                deactivationRequest
            );

            return {
                success: true
            };
        } catch (error) {
            console.error('Failed to deactivate role:', error);
            return {
                success: false,
                error: this.getFriendlyError(error)
            };
        }
    }

    /**
     * Get current user ID
     * @returns {Promise<string>} User ID
     */
    async getCurrentUserId() {
        try {
            const response = await this.get(`${this.baseUrl}/me?$select=id`);
            return response.id;
        } catch (error) {
            console.error('Failed to get current user ID:', error);
            throw error;
        }
    }

    /**
     * Determine privilege level based on role name
     * @param {string} roleName - Role name
     * @returns {string} Privilege level
     */
    determinePrivilegeLevel(roleName) {
        const name = (roleName || '').toLowerCase();

        if (name.includes('global admin') || name.includes('company admin')) {
            return 'critical';
        }
        if (name.includes('privileged') || name.includes('security') || name.includes('compliance')) {
            return 'high';
        }
        if (name.includes('admin') || name.includes('director')) {
            return 'medium';
        }

        return 'low';
    }

    /**
     * Convert error to user-friendly message
     */
    getFriendlyError(error) {
        const message = error.message || error.toString();

        if (error.status === 401) {
            return 'Session expired. Please sign in again.';
        }
        if (error.status === 403) {
            return 'You do not have permission to perform this action.';
        }
        if (error.status === 404) {
            return 'Resource not found.';
        }
        if (error.code === 'Authorization_RequestDenied') {
            return 'Access denied. Admin consent may be required.';
        }

        return message;
    }
}

// Export singleton instance
export const graphService = new GraphService();
