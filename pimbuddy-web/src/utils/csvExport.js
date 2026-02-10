/**
 * CSV Export Utility
 * Export data to CSV format compatible with Excel
 */

/**
 * Convert array of objects to CSV string
 * @param {Array<Object>} data - Array of objects to convert
 * @param {Array<string>} columns - Column headers (object keys to include)
 * @returns {string} CSV string
 */
export function arrayToCSV(data, columns = null) {
    if (!data || data.length === 0) {
        return '';
    }

    // If no columns specified, use all keys from first object
    if (!columns) {
        columns = Object.keys(data[0]);
    }

    // Helper to escape CSV values
    const escapeCSV = (value) => {
        if (value === null || value === undefined) {
            return '';
        }

        const stringValue = String(value);

        // Escape double quotes and wrap in quotes if contains comma, newline, or quote
        if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
    };

    // Build CSV header
    const header = columns.map(col => escapeCSV(col)).join(',');

    // Build CSV rows
    const rows = data.map(row => {
        return columns.map(col => escapeCSV(row[col])).join(',');
    });

    return [header, ...rows].join('\n');
}

/**
 * Download CSV file
 * @param {string} csvContent - CSV content string
 * @param {string} filename - Filename for download
 */
export function downloadCSV(csvContent, filename = 'export.csv') {
    // Add BOM for Excel UTF-8 support
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
}

/**
 * Export PIM groups to CSV
 * @param {Array<Object>} groups - PIM groups data
 * @param {string} filename - Optional filename
 */
export function exportGroupsToCSV(groups, filename = null) {
    const columns = [
        'displayName',
        'description',
        'id',
        'mail',
        'mailEnabled',
        'securityEnabled',
        'isAssignableToRole',
        'createdDateTime'
    ];

    const csvContent = arrayToCSV(groups, columns);
    const defaultFilename = `pim-groups-${new Date().toISOString().split('T')[0]}.csv`;

    downloadCSV(csvContent, filename || defaultFilename);
}

/**
 * Export role assignments to CSV
 * @param {Array<Object>} assignments - Role assignments data
 * @param {string} filename - Optional filename
 */
export function exportAssignmentsToCSV(assignments, filename = null) {
    const columns = [
        'principalDisplayName',
        'roleDefinitionDisplayName',
        'directoryScopeDisplayName',
        'assignmentType',
        'status',
        'startDateTime',
        'endDateTime',
        'createdDateTime'
    ];

    const csvContent = arrayToCSV(assignments, columns);
    const defaultFilename = `role-assignments-${new Date().toISOString().split('T')[0]}.csv`;

    downloadCSV(csvContent, filename || defaultFilename);
}

/**
 * Export PIM activity to CSV
 * @param {Array<Object>} activities - PIM activity log data
 * @param {string} filename - Optional filename
 */
export function exportActivityToCSV(activities, filename = null) {
    const columns = [
        'activityDateTime',
        'activityDisplayName',
        'initiatedBy',
        'targetResources',
        'result',
        'resultReason'
    ];

    const csvContent = arrayToCSV(activities, columns);
    const defaultFilename = `pim-activity-${new Date().toISOString().split('T')[0]}.csv`;

    downloadCSV(csvContent, filename || defaultFilename);
}

/**
 * Export roles to CSV
 * @param {Array<Object>} roles - Roles data
 * @param {string} filename - Optional filename
 */
export function exportRolesToCSV(roles, filename = null) {
    const columns = [
        'displayName',
        'description',
        'id',
        'isBuiltIn',
        'isEnabled',
        'resourceScopes',
        'templateId'
    ];

    const csvContent = arrayToCSV(roles, columns);
    const defaultFilename = `entra-roles-${new Date().toISOString().split('T')[0]}.csv`;

    downloadCSV(csvContent, filename || defaultFilename);
}

/**
 * Export health check results to CSV
 * @param {Array<Object>} results - Health check results
 * @param {string} filename - Optional filename
 */
export function exportHealthCheckToCSV(results, filename = null) {
    const columns = [
        'check',
        'status',
        'severity',
        'message',
        'recommendation',
        'affectedResource'
    ];

    const csvContent = arrayToCSV(results, columns);
    const defaultFilename = `health-check-${new Date().toISOString().split('T')[0]}.csv`;

    downloadCSV(csvContent, filename || defaultFilename);
}

/**
 * Export coverage analysis to CSV
 * @param {Array<Object>} coverage - Coverage analysis data
 * @param {string} filename - Optional filename
 */
export function exportCoverageToCSV(coverage, filename = null) {
    const columns = [
        'roleName',
        'totalAssignments',
        'eligibleAssignments',
        'activeAssignments',
        'uniquePrincipals',
        'coverage',
        'risk'
    ];

    const csvContent = arrayToCSV(coverage, columns);
    const defaultFilename = `role-coverage-${new Date().toISOString().split('T')[0]}.csv`;

    downloadCSV(csvContent, filename || defaultFilename);
}

/**
 * Generic export to CSV
 * @param {Array<Object>} data - Data to export
 * @param {Array<string>} columns - Columns to include
 * @param {string} filename - Filename
 */
export function exportToCSV(data, columns, filename) {
    const csvContent = arrayToCSV(data, columns);
    downloadCSV(csvContent, filename);
}
