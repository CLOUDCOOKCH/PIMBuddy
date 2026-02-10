/**
 * Application Constants
 * Centralized configuration values and magic strings
 */

// LocalStorage Keys
export const STORAGE_KEYS = {
    APP_CONFIG: 'pimbuddy-app-config',
    CUSTOM_TEMPLATES: 'pimbuddy-custom-templates',
    THEME: 'pimbuddy-theme',
    CACHE_TIMESTAMP: 'pimbuddy-cache-timestamp'
};

// Pagination Settings
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 50,
    PAGE_SIZE_OPTIONS: [20, 50, 100, 200],
    MAX_PAGE_SIZE: 500
};

// Session Settings
export const SESSION = {
    TIMEOUT_MINUTES: 15,
    WARNING_MINUTES: 10
};

// Rate Limit Settings
export const RATE_LIMITS = {
    DEFAULT: { maxRequests: 60, windowMs: 60000 },
    SEARCH: { maxRequests: 30, windowMs: 60000 },
    MUTATION: { maxRequests: 20, windowMs: 60000 }
};

// Graph API Endpoints
export const API_ENDPOINTS = {
    USERS: '/users',
    GROUPS: '/groups',
    DIRECTORY_ROLES: '/directoryRoles',
    ROLE_DEFINITIONS: '/roleManagement/directory/roleDefinitions',
    ROLE_ASSIGNMENTS: '/roleManagement/directory/roleAssignments',
    ROLE_ELIGIBILITY: '/roleManagement/directory/roleEligibilityScheduleRequests',
    ROLE_ELIGIBILITY_INSTANCES: '/roleManagement/directory/roleEligibilityScheduleInstances',
    ROLE_ASSIGNMENT_REQUESTS: '/roleManagement/directory/roleAssignmentScheduleRequests',
    ROLE_ASSIGNMENT_INSTANCES: '/roleManagement/directory/roleAssignmentScheduleInstances',
    PIM_POLICIES: '/policies/roleManagementPolicies',
    PIM_POLICY_ASSIGNMENTS: '/policies/roleManagementPolicyAssignments',
    AUDIT_LOGS: '/auditLogs/directoryAudits',
    APPROVAL_REQUESTS: '/roleManagement/directory/roleAssignmentApprovals'
};

// Privilege Levels
export const PRIVILEGE_LEVELS = {
    CRITICAL: 'critical',
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
};

// Critical Role GUIDs (Tier 0)
export const TIER_0_ROLES = [
    '62e90394-69f5-4237-9190-012177145e10', // Global Administrator
    'e8611ab8-c189-46e8-94e1-60213ab1f814', // Privileged Role Administrator
    '9b895d92-2cd3-44c7-9d02-a6ac2d5ea5c3', // Application Administrator
    '158c047a-c907-4556-b7ef-446551a6b5f7', // Cloud Application Administrator
    '7be44c8a-adaf-4e2a-84d6-ab2649e08a13', // Privileged Authentication Administrator
    'c4e39bd9-1100-46d3-8c65-fb160da0071f', // Authentication Administrator
    '194ae4cb-b126-40b2-bd5b-6091b380977d', // Security Administrator
    '29232cdf-9323-42fd-ade2-1d097af3e4de', // Exchange Administrator
    'f28a1f50-f6e7-4571-818b-6a12f2af6b6c', // SharePoint Administrator
    '729827e3-9c14-49f7-bb1b-9608f156bbb8', // Helpdesk Administrator
    'fe930be7-5e62-47db-91af-98c3a49a38b1', // User Administrator
];

// High Privilege Roles (Tier 1)
export const TIER_1_ROLES = [
    '5d6b6bb7-de71-4623-b4af-96380a352509', // Security Reader
    'be2f45a1-457d-42af-a067-6ec1fa63bc45', // Global Reader
    '4a5d8f65-41da-4de4-8968-e035b65339cf', // Reports Reader
    '17315797-102d-40b4-93e0-432062caca18', // Compliance Administrator
    '2b745bdf-0803-4d80-aa65-822c4493daac', // Service Support Administrator
    '11648597-926c-4cf3-9c36-bcebb0ba8dcc', // Power Platform Administrator
    'b1be1c3e-b65d-4f19-8427-f6fa0d97feb9', // Conditional Access Administrator
    'fdd7a751-b60b-444a-984c-02652fe8fa1c', // Groups Administrator
    '7698a772-787b-4ac8-901f-60d6b08affd2', // Cloud Device Administrator
];

// Validation Rules
export const VALIDATION = {
    MAX_GROUP_NAME_LENGTH: 256,
    MAX_DESCRIPTION_LENGTH: 1024,
    MAX_JUSTIFICATION_LENGTH: 2000,
    MIN_PASSWORD_LENGTH: 12,
    MAX_SEARCH_QUERY_LENGTH: 200
};

// UI Constants
export const UI = {
    TOAST_DURATION: 5000,
    LOADING_MIN_DURATION: 300,
    MODAL_ANIMATION_DURATION: 200,
    DEBOUNCE_DELAY: 300
};

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
    SEARCH: { ctrl: true, key: 'f', description: 'Focus search' },
    REFRESH: { key: 'F5', description: 'Refresh current page' },
    ESCAPE: { key: 'Escape', description: 'Close modal/dialog' },
    BULK_SELECT: { ctrl: true, key: 'b', description: 'Toggle bulk select mode' },
    EXPORT: { ctrl: true, key: 'e', description: 'Export current view' }
};

// Error Messages
export const ERROR_MESSAGES = {
    RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
    SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    PERMISSION_DENIED: 'You don\'t have permission to perform this action.',
    VALIDATION_FAILED: 'Validation failed. Please check your input.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
    GROUP_CREATED: 'Group created successfully',
    GROUP_UPDATED: 'Group updated successfully',
    GROUP_DELETED: 'Group deleted successfully',
    POLICY_UPDATED: 'Policy updated successfully',
    MEMBER_ADDED: 'Member added successfully',
    MEMBER_REMOVED: 'Member removed successfully',
    APPROVAL_PROCESSED: 'Approval processed successfully',
    EXPORT_COMPLETED: 'Export completed successfully'
};

// Feature Flags
export const FEATURES = {
    ENABLE_BULK_OPERATIONS: true,
    ENABLE_EXPORT: true,
    ENABLE_CHARTS: true,
    ENABLE_ADVANCED_FILTERS: true,
    ENABLE_KEYBOARD_SHORTCUTS: true
};
