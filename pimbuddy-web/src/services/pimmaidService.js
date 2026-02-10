/**
 * PIMMaid Service
 * Generates Mermaid diagrams from PIM configuration data
 */

class PIMMaidService {
    constructor() {
        this.diagramTypes = {
            'user-group': {
                name: 'Users → Groups',
                description: 'Shows which users are eligible/active members of PIM groups',
                icon: 'fa-users'
            },
            'group-role': {
                name: 'Groups → Roles',
                description: 'Shows which groups have assignments to Entra ID roles',
                icon: 'fa-sitemap'
            },
            'full-hierarchy': {
                name: 'Full Hierarchy',
                description: 'Complete view: Users → Groups → Roles',
                icon: 'fa-project-diagram'
            },
            'role-assignments': {
                name: 'Role Assignments',
                description: 'Shows all role assignments (direct and through groups)',
                icon: 'fa-user-shield'
            }
        };
    }

    /**
     * Generate a Mermaid diagram based on type and data
     */
    generateDiagram(type, data, options = {}) {
        switch (type) {
            case 'user-group':
                return this.generateUserGroupDiagram(data, options);
            case 'group-role':
                return this.generateGroupRoleDiagram(data, options);
            case 'full-hierarchy':
                return this.generateFullHierarchyDiagram(data, options);
            case 'role-assignments':
                return this.generateRoleAssignmentsDiagram(data, options);
            default:
                return this.generateFullHierarchyDiagram(data, options);
        }
    }

    /**
     * Generate Users → Groups diagram
     */
    generateUserGroupDiagram(data, options = {}) {
        const { groups = [], groupAssignments = {} } = data;
        const { showEligible = true, showActive = true, direction = 'LR' } = options;

        let mermaid = `flowchart ${direction}\n`;
        mermaid += `    %% PIMMaid - Users to Groups Diagram\n`;
        mermaid += `    %% Generated: ${new Date().toISOString()}\n\n`;

        // Define subgraphs for users and groups
        mermaid += `    subgraph Users["👤 Users"]\n`;

        const users = new Map();
        const connections = [];

        // Collect all users from assignments
        for (const [groupId, assignments] of Object.entries(groupAssignments)) {
            const group = groups.find(g => g.id === groupId);
            if (!group) continue;

            if (showEligible && assignments.eligible) {
                for (const user of assignments.eligible) {
                    if (!users.has(user.id)) {
                        users.set(user.id, { ...user, type: 'user' });
                    }
                    connections.push({
                        from: user.id,
                        to: groupId,
                        type: 'eligible',
                        label: 'eligible'
                    });
                }
            }

            if (showActive && assignments.active) {
                for (const user of assignments.active) {
                    if (!users.has(user.id)) {
                        users.set(user.id, { ...user, type: 'user' });
                    }
                    connections.push({
                        from: user.id,
                        to: groupId,
                        type: 'active',
                        label: 'active'
                    });
                }
            }
        }

        // Add user nodes
        for (const [userId, user] of users) {
            const safeName = this.sanitizeId(user.displayName || userId);
            mermaid += `        ${this.sanitizeId(userId)}["${safeName}"]\n`;
        }
        mermaid += `    end\n\n`;

        // Add groups subgraph
        mermaid += `    subgraph Groups["🔐 PIM Groups"]\n`;
        for (const group of groups) {
            if (groupAssignments[group.id]) {
                const safeName = this.sanitizeId(group.displayName);
                mermaid += `        ${this.sanitizeId(group.id)}[["${safeName}"]]\n`;
            }
        }
        mermaid += `    end\n\n`;

        // Add connections
        mermaid += `    %% Connections\n`;
        for (const conn of connections) {
            const style = conn.type === 'eligible' ? '-.->' : '-->';
            const label = conn.type === 'eligible' ? '|eligible|' : '|active|';
            mermaid += `    ${this.sanitizeId(conn.from)} ${style}${label} ${this.sanitizeId(conn.to)}\n`;
        }

        // Add styling
        mermaid += this.getDefaultStyles();

        return mermaid;
    }

    /**
     * Generate Groups → Roles diagram
     */
    generateGroupRoleDiagram(data, options = {}) {
        const { groups = [], roles = [], roleAssignments = {} } = data;
        const { direction = 'LR' } = options;

        let mermaid = `flowchart ${direction}\n`;
        mermaid += `    %% PIMMaid - Groups to Roles Diagram\n`;
        mermaid += `    %% Generated: ${new Date().toISOString()}\n\n`;

        // Groups subgraph
        mermaid += `    subgraph Groups["🔐 PIM Groups"]\n`;
        const usedGroups = new Set();

        for (const [roleId, assignments] of Object.entries(roleAssignments)) {
            for (const assignment of assignments) {
                if (assignment.principalType === 'Group') {
                    usedGroups.add(assignment.principalId);
                }
            }
        }

        for (const group of groups) {
            if (usedGroups.has(group.id)) {
                mermaid += `        ${this.sanitizeId(group.id)}[["${this.sanitizeId(group.displayName)}"]]\n`;
            }
        }
        mermaid += `    end\n\n`;

        // Roles subgraph with privilege levels
        mermaid += `    subgraph Roles["🛡️ Entra ID Roles"]\n`;
        const usedRoles = new Set(Object.keys(roleAssignments));

        for (const role of roles) {
            if (usedRoles.has(role.id)) {
                const icon = this.getPrivilegeIcon(role.privilegeLevel);
                mermaid += `        ${this.sanitizeId(role.id)}[/"${icon} ${this.sanitizeId(role.displayName)}"\\]\n`;
            }
        }
        mermaid += `    end\n\n`;

        // Connections
        mermaid += `    %% Assignments\n`;
        for (const [roleId, assignments] of Object.entries(roleAssignments)) {
            for (const assignment of assignments) {
                if (assignment.principalType === 'Group') {
                    const style = assignment.assignmentType === 'Eligible' ? '-.->' : '-->';
                    const label = assignment.assignmentType === 'Eligible' ? '|eligible|' : '|active|';
                    mermaid += `    ${this.sanitizeId(assignment.principalId)} ${style}${label} ${this.sanitizeId(roleId)}\n`;
                }
            }
        }

        mermaid += this.getDefaultStyles();
        return mermaid;
    }

    /**
     * Generate full hierarchy diagram
     */
    generateFullHierarchyDiagram(data, options = {}) {
        const { groups = [], roles = [], groupAssignments = {}, roleAssignments = {} } = data;
        const { direction = 'LR', showEligible = true, showActive = true } = options;

        let mermaid = `flowchart ${direction}\n`;
        mermaid += `    %% PIMMaid - Full PIM Hierarchy\n`;
        mermaid += `    %% Generated: ${new Date().toISOString()}\n\n`;

        // Collect users
        const users = new Map();
        const userGroupLinks = [];
        const groupRoleLinks = [];

        // Process group assignments to get users
        for (const [groupId, assignments] of Object.entries(groupAssignments)) {
            if (showEligible && assignments.eligible) {
                for (const user of assignments.eligible) {
                    users.set(user.id, user);
                    userGroupLinks.push({ userId: user.id, groupId, type: 'eligible' });
                }
            }
            if (showActive && assignments.active) {
                for (const user of assignments.active) {
                    users.set(user.id, user);
                    userGroupLinks.push({ userId: user.id, groupId, type: 'active' });
                }
            }
        }

        // Process role assignments to get group-role links
        for (const [roleId, assignments] of Object.entries(roleAssignments)) {
            for (const assignment of assignments) {
                if (assignment.principalType === 'Group') {
                    groupRoleLinks.push({
                        groupId: assignment.principalId,
                        roleId,
                        type: assignment.assignmentType?.toLowerCase() || 'active'
                    });
                }
            }
        }

        // Users subgraph
        if (users.size > 0) {
            mermaid += `    subgraph Users["👤 Users"]\n`;
            mermaid += `        direction TB\n`;
            for (const [userId, user] of users) {
                mermaid += `        ${this.sanitizeId(userId)}["${this.sanitizeId(user.displayName || 'Unknown')}"]\n`;
            }
            mermaid += `    end\n\n`;
        }

        // Groups subgraph
        const usedGroups = new Set([
            ...userGroupLinks.map(l => l.groupId),
            ...groupRoleLinks.map(l => l.groupId)
        ]);

        if (usedGroups.size > 0) {
            mermaid += `    subgraph Groups["🔐 PIM Groups"]\n`;
            mermaid += `        direction TB\n`;
            for (const group of groups) {
                if (usedGroups.has(group.id)) {
                    mermaid += `        ${this.sanitizeId(group.id)}[["${this.sanitizeId(group.displayName)}"]]\n`;
                }
            }
            mermaid += `    end\n\n`;
        }

        // Roles subgraph
        const usedRoles = new Set(groupRoleLinks.map(l => l.roleId));

        if (usedRoles.size > 0) {
            mermaid += `    subgraph Roles["🛡️ Entra Roles"]\n`;
            mermaid += `        direction TB\n`;
            for (const role of roles) {
                if (usedRoles.has(role.id)) {
                    const icon = this.getPrivilegeIcon(role.privilegeLevel);
                    mermaid += `        ${this.sanitizeId(role.id)}[/"${icon} ${this.sanitizeId(role.displayName)}"\\]\n`;
                }
            }
            mermaid += `    end\n\n`;
        }

        // User → Group connections
        mermaid += `    %% User to Group assignments\n`;
        for (const link of userGroupLinks) {
            const style = link.type === 'eligible' ? '-.->' : '-->';
            mermaid += `    ${this.sanitizeId(link.userId)} ${style} ${this.sanitizeId(link.groupId)}\n`;
        }

        // Group → Role connections
        mermaid += `\n    %% Group to Role assignments\n`;
        for (const link of groupRoleLinks) {
            const style = link.type === 'eligible' ? '-.->' : '-->';
            mermaid += `    ${this.sanitizeId(link.groupId)} ${style} ${this.sanitizeId(link.roleId)}\n`;
        }

        mermaid += this.getDefaultStyles();
        return mermaid;
    }

    /**
     * Generate role assignments diagram
     */
    generateRoleAssignmentsDiagram(data, options = {}) {
        const { roles = [], roleAssignments = {} } = data;
        const { direction = 'TB' } = options;

        let mermaid = `flowchart ${direction}\n`;
        mermaid += `    %% PIMMaid - Role Assignments Overview\n`;
        mermaid += `    %% Generated: ${new Date().toISOString()}\n\n`;

        // Group roles by privilege level
        const criticalRoles = roles.filter(r => r.privilegeLevel === 'critical');
        const highRoles = roles.filter(r => r.privilegeLevel === 'high');
        const mediumRoles = roles.filter(r => r.privilegeLevel === 'medium');
        const lowRoles = roles.filter(r => r.privilegeLevel === 'low');

        const addRoleSubgraph = (roleList, label, emoji) => {
            if (roleList.length === 0) return '';
            let section = `    subgraph ${label.replace(/\s/g, '')}["${emoji} ${label}"]\n`;
            for (const role of roleList) {
                if (roleAssignments[role.id]) {
                    section += `        ${this.sanitizeId(role.id)}[/"${this.sanitizeId(role.displayName)}"\\]\n`;
                }
            }
            section += `    end\n\n`;
            return section;
        };

        mermaid += addRoleSubgraph(criticalRoles, 'Critical Roles', '💀');
        mermaid += addRoleSubgraph(highRoles, 'High Privilege', '⚠️');
        mermaid += addRoleSubgraph(mediumRoles, 'Medium Privilege', '🔵');
        mermaid += addRoleSubgraph(lowRoles, 'Low Privilege', '✅');

        // Principals (users/groups with assignments)
        const principals = new Map();

        for (const [roleId, assignments] of Object.entries(roleAssignments)) {
            for (const assignment of assignments) {
                if (!principals.has(assignment.principalId)) {
                    principals.set(assignment.principalId, {
                        id: assignment.principalId,
                        name: assignment.principalDisplayName || 'Unknown',
                        type: assignment.principalType
                    });
                }
            }
        }

        if (principals.size > 0) {
            mermaid += `    subgraph Principals["👥 Assigned Principals"]\n`;
            for (const [id, principal] of principals) {
                const shape = principal.type === 'Group' ? `[["${this.sanitizeId(principal.name)}"]]` : `["${this.sanitizeId(principal.name)}"]`;
                mermaid += `        ${this.sanitizeId(id)}${shape}\n`;
            }
            mermaid += `    end\n\n`;
        }

        // Connections
        mermaid += `    %% Assignments\n`;
        for (const [roleId, assignments] of Object.entries(roleAssignments)) {
            for (const assignment of assignments) {
                const style = assignment.assignmentType === 'Eligible' ? '-.->' : '-->';
                mermaid += `    ${this.sanitizeId(assignment.principalId)} ${style} ${this.sanitizeId(roleId)}\n`;
            }
        }

        mermaid += this.getDefaultStyles();
        return mermaid;
    }

    /**
     * Get privilege level icon
     */
    getPrivilegeIcon(level) {
        const icons = {
            critical: '💀',
            high: '⚠️',
            medium: '🔵',
            low: '✅'
        };
        return icons[level] || '📋';
    }

    /**
     * Sanitize ID for Mermaid compatibility
     */
    sanitizeId(str) {
        if (!str) return 'unknown';
        // Remove special characters and limit length
        return str
            .replace(/[^a-zA-Z0-9\s-]/g, '')
            .replace(/\s+/g, '_')
            .substring(0, 40);
    }

    /**
     * Get default Mermaid styles
     */
    getDefaultStyles() {
        return `
    %% Styling
    classDef userNode fill:#1e3a5f,stroke:#00d4aa,stroke-width:2px,color:#fff
    classDef groupNode fill:#2d1b4e,stroke:#7c3aed,stroke-width:2px,color:#fff
    classDef criticalRole fill:#4a1515,stroke:#ef4444,stroke-width:3px,color:#fff
    classDef highRole fill:#4a3415,stroke:#f59e0b,stroke-width:2px,color:#fff
    classDef mediumRole fill:#1e3a5f,stroke:#3b82f6,stroke-width:2px,color:#fff
    classDef lowRole fill:#1a3a2a,stroke:#10b981,stroke-width:2px,color:#fff
`;
    }

    /**
     * Get all diagram types
     */
    getDiagramTypes() {
        return this.diagramTypes;
    }

    /**
     * Generate diagram statistics
     */
    getStats(data) {
        const { groups = [], roles = [], groupAssignments = {}, roleAssignments = {} } = data;

        let totalUsers = new Set();
        let eligibleCount = 0;
        let activeCount = 0;

        for (const assignments of Object.values(groupAssignments)) {
            if (assignments.eligible) {
                assignments.eligible.forEach(u => totalUsers.add(u.id));
                eligibleCount += assignments.eligible.length;
            }
            if (assignments.active) {
                assignments.active.forEach(u => totalUsers.add(u.id));
                activeCount += assignments.active.length;
            }
        }

        const roleStats = {
            critical: roles.filter(r => r.privilegeLevel === 'critical').length,
            high: roles.filter(r => r.privilegeLevel === 'high').length,
            medium: roles.filter(r => r.privilegeLevel === 'medium').length,
            low: roles.filter(r => r.privilegeLevel === 'low').length
        };

        return {
            totalUsers: totalUsers.size,
            totalGroups: groups.length,
            totalRoles: roles.length,
            eligibleAssignments: eligibleCount,
            activeAssignments: activeCount,
            rolesByPrivilege: roleStats
        };
    }
}

export const pimmaidService = new PIMMaidService();
