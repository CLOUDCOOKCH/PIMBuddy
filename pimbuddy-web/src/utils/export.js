/**
 * Export Utility
 * Handles CSV and JSON export functionality
 */

export class ExportUtils {
    /**
     * Export data to CSV format
     * @param {Array} data - Array of objects to export
     * @param {string} filename - Filename without extension
     * @param {Array} columns - Optional column definitions [{key, header}]
     */
    static exportToCSV(data, filename, columns = null) {
        if (!data || data.length === 0) {
            throw new Error('No data to export');
        }

        // Auto-detect columns if not provided
        if (!columns) {
            const firstItem = data[0];
            columns = Object.keys(firstItem).map(key => ({
                key: key,
                header: this.formatHeader(key)
            }));
        }

        // Build CSV header
        const headers = columns.map(col => this.escapeCSVValue(col.header));
        const csvRows = [headers.join(',')];

        // Build CSV rows
        for (const item of data) {
            const row = columns.map(col => {
                const value = this.getNestedValue(item, col.key);
                return this.escapeCSVValue(this.formatCSVValue(value));
            });
            csvRows.push(row.join(','));
        }

        // Create CSV content
        const csvContent = csvRows.join('\n');

        // Trigger download
        this.downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
    }

    /**
     * Export data to JSON format
     * @param {Array|Object} data - Data to export
     * @param {string} filename - Filename without extension
     * @param {boolean} pretty - Pretty print JSON
     */
    static exportToJSON(data, filename, pretty = true) {
        if (!data) {
            throw new Error('No data to export');
        }

        const jsonContent = JSON.stringify(data, null, pretty ? 2 : 0);
        this.downloadFile(jsonContent, `${filename}.json`, 'application/json;charset=utf-8;');
    }

    /**
     * Format header name (camelCase to Title Case)
     */
    static formatHeader(key) {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    /**
     * Get nested value from object using dot notation
     */
    static getNestedValue(obj, path) {
        if (!path) return obj;

        const keys = path.split('.');
        let value = obj;

        for (const key of keys) {
            if (value === null || value === undefined) return '';
            value = value[key];
        }

        return value;
    }

    /**
     * Format value for CSV output
     */
    static formatCSVValue(value) {
        if (value === null || value === undefined) return '';
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (value instanceof Date) return value.toISOString();
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    }

    /**
     * Escape CSV value (handle quotes and commas)
     */
    static escapeCSVValue(value) {
        const str = String(value);

        // If value contains comma, quotes, or newline, wrap in quotes
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            // Escape existing quotes by doubling them
            return `"${str.replace(/"/g, '""')}"`;
        }

        return str;
    }

    /**
     * Trigger file download
     */
    static downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    }

    /**
     * Generate filename with timestamp
     */
    static generateFilename(prefix) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        return `${prefix}_${timestamp}`;
    }
}

/**
 * Predefined export configurations for common data types
 */
export const ExportConfigs = {
    groups: {
        columns: [
            { key: 'displayName', header: 'Group Name' },
            { key: 'description', header: 'Description' },
            { key: 'memberCount', header: 'Members' },
            { key: 'ownerCount', header: 'Owners' },
            { key: 'createdDateTime', header: 'Created Date' },
            { key: 'id', header: 'Object ID' }
        ]
    },
    roles: {
        columns: [
            { key: 'displayName', header: 'Role Name' },
            { key: 'description', header: 'Description' },
            { key: 'privilegeLevel', header: 'Privilege Level' },
            { key: 'isBuiltIn', header: 'Built-in' },
            { key: 'id', header: 'Role ID' }
        ]
    },
    activity: {
        columns: [
            { key: 'activityDateTime', header: 'Date/Time' },
            { key: 'activityDisplayName', header: 'Activity' },
            { key: 'initiatedBy.user.displayName', header: 'Initiated By' },
            { key: 'initiatedBy.user.userPrincipalName', header: 'UPN' },
            { key: 'category', header: 'Category' },
            { key: 'result', header: 'Result' }
        ]
    },
    policies: {
        columns: [
            { key: 'displayName', header: 'Policy Name' },
            { key: 'scopeId', header: 'Scope ID' },
            { key: 'scopeType', header: 'Scope Type' },
            { key: 'isOrganizationDefault', header: 'Is Default' }
        ]
    },
    approvals: {
        columns: [
            { key: 'principalDisplayName', header: 'User' },
            { key: 'principalUserPrincipalName', header: 'UPN' },
            { key: 'roleDisplayName', header: 'Role' },
            { key: 'requestedDateTime', header: 'Requested' },
            { key: 'justification', header: 'Justification' },
            { key: 'status', header: 'Status' }
        ]
    }
};
