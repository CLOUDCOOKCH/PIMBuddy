/**
 * PIM Baseline Service
 * Implements industry best practices for PIM configuration
 * Based on Microsoft Zero Trust and Privileged Access Workstation (PAW) models
 */

class BaselineService {
    constructor() {
        // Tier-based access model (Microsoft privileged access strategy)
        this.baselineConfigurations = {
            'enterprise-standard': {
                id: 'enterprise-standard',
                name: 'Enterprise Standard',
                description: 'Balanced security for typical enterprise environments. Implements tiered access with MFA and approval workflows for critical roles.',
                icon: 'fa-building',
                color: 'primary',
                features: [
                    'Tiered access model (T0/T1/T2)',
                    'MFA required for all roles',
                    'Approval required for Tier 0',
                    'Justification tracking',
                    '4-8 hour activation windows'
                ],
                tiers: [
                    {
                        tier: 0,
                        name: 'Tier 0 - Critical Infrastructure',
                        description: 'Highest privilege roles with maximum security controls',
                        policy: {
                            maximumDurationHours: 4,
                            requireMfa: true,
                            requireJustification: true,
                            requireTicketInfo: true,
                            requireApproval: true
                        },
                        groups: [
                            {
                                name: 'PIM-T0-Global-Administrators',
                                description: 'Tier 0: Global Administrator role access',
                                roles: ['62e90394-69f5-4237-9190-012177145e10'] // Global Administrator
                            },
                            {
                                name: 'PIM-T0-Privileged-Role-Administrators',
                                description: 'Tier 0: Privileged Role Administrator access',
                                roles: ['e8611ab8-c189-46e8-94e1-60213ab1f814'] // Privileged Role Administrator
                            },
                            {
                                name: 'PIM-T0-Security-Administrators',
                                description: 'Tier 0: Security Administrator access',
                                roles: ['194ae4cb-b126-40b2-bd5b-6091b380977d'] // Security Administrator
                            }
                        ]
                    },
                    {
                        tier: 1,
                        name: 'Tier 1 - High Privilege Operations',
                        description: 'High privilege operational roles',
                        policy: {
                            maximumDurationHours: 8,
                            requireMfa: true,
                            requireJustification: true,
                            requireTicketInfo: false,
                            requireApproval: false
                        },
                        groups: [
                            {
                                name: 'PIM-T1-User-Administrators',
                                description: 'Tier 1: User Administrator access',
                                roles: ['fe930be7-5e62-47db-91af-98c3a49a38b1'] // User Administrator
                            },
                            {
                                name: 'PIM-T1-Exchange-Administrators',
                                description: 'Tier 1: Exchange Administrator access',
                                roles: ['29232cdf-9323-42fd-ade2-1d097af3e4de'] // Exchange Administrator
                            },
                            {
                                name: 'PIM-T1-SharePoint-Administrators',
                                description: 'Tier 1: SharePoint Administrator access',
                                roles: ['f28a1f50-f6e7-4571-818b-6a12f2af6b6c'] // SharePoint Administrator
                            },
                            {
                                name: 'PIM-T1-Application-Administrators',
                                description: 'Tier 1: Application Administrator access',
                                roles: ['9b895d92-2cd3-44c7-9d02-a6ac2d5ea5c3'] // Application Administrator
                            }
                        ]
                    },
                    {
                        tier: 2,
                        name: 'Tier 2 - Standard Operations',
                        description: 'Standard operational roles with moderate privilege',
                        policy: {
                            maximumDurationHours: 8,
                            requireMfa: true,
                            requireJustification: true,
                            requireTicketInfo: false,
                            requireApproval: false
                        },
                        groups: [
                            {
                                name: 'PIM-T2-Helpdesk-Administrators',
                                description: 'Tier 2: Helpdesk Administrator access',
                                roles: ['729827e3-9c14-49f7-bb1b-9608f156bbb8'] // Helpdesk Administrator
                            },
                            {
                                name: 'PIM-T2-Groups-Administrators',
                                description: 'Tier 2: Groups Administrator access',
                                roles: ['fdd7a751-b60b-444a-984c-02652fe8fa1c'] // Groups Administrator
                            },
                            {
                                name: 'PIM-T2-Teams-Administrators',
                                description: 'Tier 2: Teams Administrator access',
                                roles: ['69091246-20e8-4a56-aa4d-066075b2a7a8'] // Teams Administrator
                            }
                        ]
                    }
                ]
            },
            'high-security': {
                id: 'high-security',
                name: 'High Security (Zero Trust)',
                description: 'Maximum security baseline for highly regulated industries. All roles require approval, short activation windows, and comprehensive audit trails.',
                icon: 'fa-shield-alt',
                color: 'danger',
                features: [
                    'Zero Trust security model',
                    'Approval required for all tiers',
                    'Ticket tracking mandatory',
                    'Short activation (2-6 hours)',
                    'Comprehensive audit trails',
                    'MFA + Justification always required'
                ],
                tiers: [
                    {
                        tier: 0,
                        name: 'Tier 0 - Critical Infrastructure',
                        description: 'Maximum security for critical roles',
                        policy: {
                            maximumDurationHours: 2,
                            requireMfa: true,
                            requireJustification: true,
                            requireTicketInfo: true,
                            requireApproval: true
                        },
                        groups: [
                            {
                                name: 'PIM-ZT-T0-Global-Administrators',
                                description: 'Zero Trust Tier 0: Global Administrator (2h max, full approval)',
                                roles: ['62e90394-69f5-4237-9190-012177145e10']
                            },
                            {
                                name: 'PIM-ZT-T0-Privileged-Role-Administrators',
                                description: 'Zero Trust Tier 0: Privileged Role Administrator',
                                roles: ['e8611ab8-c189-46e8-94e1-60213ab1f814']
                            },
                            {
                                name: 'PIM-ZT-T0-Security-Administrators',
                                description: 'Zero Trust Tier 0: Security Administrator',
                                roles: ['194ae4cb-b126-40b2-bd5b-6091b380977d']
                            }
                        ]
                    },
                    {
                        tier: 1,
                        name: 'Tier 1 - High Privilege Operations',
                        description: 'Strict controls for operational roles',
                        policy: {
                            maximumDurationHours: 4,
                            requireMfa: true,
                            requireJustification: true,
                            requireTicketInfo: true,
                            requireApproval: true
                        },
                        groups: [
                            {
                                name: 'PIM-ZT-T1-User-Administrators',
                                description: 'Zero Trust Tier 1: User Administrator',
                                roles: ['fe930be7-5e62-47db-91af-98c3a49a38b1']
                            },
                            {
                                name: 'PIM-ZT-T1-Exchange-Administrators',
                                description: 'Zero Trust Tier 1: Exchange Administrator',
                                roles: ['29232cdf-9323-42fd-ade2-1d097af3e4de']
                            },
                            {
                                name: 'PIM-ZT-T1-SharePoint-Administrators',
                                description: 'Zero Trust Tier 1: SharePoint Administrator',
                                roles: ['f28a1f50-f6e7-4571-818b-6a12f2af6b6c']
                            }
                        ]
                    },
                    {
                        tier: 2,
                        name: 'Tier 2 - Standard Operations',
                        description: 'Enhanced security for standard roles',
                        policy: {
                            maximumDurationHours: 6,
                            requireMfa: true,
                            requireJustification: true,
                            requireTicketInfo: true,
                            requireApproval: false
                        },
                        groups: [
                            {
                                name: 'PIM-ZT-T2-Helpdesk-Administrators',
                                description: 'Zero Trust Tier 2: Helpdesk Administrator',
                                roles: ['729827e3-9c14-49f7-bb1b-9608f156bbb8']
                            },
                            {
                                name: 'PIM-ZT-T2-Groups-Administrators',
                                description: 'Zero Trust Tier 2: Groups Administrator',
                                roles: ['fdd7a751-b60b-444a-984c-02652fe8fa1c']
                            }
                        ]
                    }
                ]
            },
            'quick-start': {
                id: 'quick-start',
                name: 'Quick Start (Development/POC)',
                description: 'Simplified configuration for development environments and proof of concepts. Lower friction with basic security controls.',
                icon: 'fa-rocket',
                color: 'success',
                features: [
                    'Simplified 2-tier model',
                    'MFA required only',
                    'No approval workflows',
                    'Extended activation (8-12 hours)',
                    'Ideal for dev/test environments'
                ],
                tiers: [
                    {
                        tier: 0,
                        name: 'Critical Roles',
                        description: 'Essential admin roles with basic PIM',
                        policy: {
                            maximumDurationHours: 8,
                            requireMfa: true,
                            requireJustification: false,
                            requireTicketInfo: false,
                            requireApproval: false
                        },
                        groups: [
                            {
                                name: 'PIM-Global-Administrators',
                                description: 'Global Administrator access',
                                roles: ['62e90394-69f5-4237-9190-012177145e10']
                            },
                            {
                                name: 'PIM-User-Administrators',
                                description: 'User Administrator access',
                                roles: ['fe930be7-5e62-47db-91af-98c3a49a38b1']
                            }
                        ]
                    },
                    {
                        tier: 1,
                        name: 'Operational Roles',
                        description: 'Common operational roles',
                        policy: {
                            maximumDurationHours: 12,
                            requireMfa: true,
                            requireJustification: false,
                            requireTicketInfo: false,
                            requireApproval: false
                        },
                        groups: [
                            {
                                name: 'PIM-Helpdesk-Administrators',
                                description: 'Helpdesk Administrator access',
                                roles: ['729827e3-9c14-49f7-bb1b-9608f156bbb8']
                            },
                            {
                                name: 'PIM-Teams-Administrators',
                                description: 'Teams Administrator access',
                                roles: ['69091246-20e8-4a56-aa4d-066075b2a7a8']
                            }
                        ]
                    }
                ]
            }
        };

        // Best practices documentation
        this.bestPractices = {
            naming: {
                title: 'Naming Convention',
                description: 'Groups follow the pattern: PIM-[Tier]-[RoleName]. This makes it easy to identify privilege level at a glance.',
                example: 'PIM-T0-Global-Administrators'
            },
            tiering: {
                title: 'Tiered Access Model',
                description: 'Tier 0 = Critical infrastructure, Tier 1 = High privilege operations, Tier 2 = Standard operations. Each tier has appropriate security controls.',
                reference: 'Microsoft Privileged Access Strategy'
            },
            policies: {
                title: 'Security Controls by Tier',
                tier0: 'Shortest activation (2-4h), always MFA+Approval+Justification+Ticketing',
                tier1: 'Medium activation (4-8h), MFA+Justification, optional approval',
                tier2: 'Standard activation (6-12h), MFA+Justification'
            },
            assignments: {
                title: 'Assignment Strategy',
                description: 'Use eligible assignments (not active). Set time-bound eligibility (90-180 days) and require periodic revalidation.',
                recommendation: 'Never use permanent active assignments for privileged roles'
            }
        };
    }

    /**
     * Get all baseline configurations
     */
    getBaselineConfigurations() {
        return this.baselineConfigurations;
    }

    /**
     * Get a specific baseline configuration
     */
    getBaseline(baselineId) {
        return this.baselineConfigurations[baselineId] || null;
    }

    /**
     * Get best practices documentation
     */
    getBestPractices() {
        return this.bestPractices;
    }

    /**
     * Calculate deployment plan for a baseline
     * @param {Object|string} config - Either a config object {baseline, tiers} or baseline ID string
     * @param {Object} environment - Existing environment {existingGroups, existingRoles}
     */
    calculateDeploymentPlan(config, environment = {}) {
        // Handle both config object and baseline ID string
        let baseline, tiers;
        if (typeof config === 'string') {
            baseline = this.getBaseline(config);
            tiers = baseline?.tiers || [];
        } else {
            baseline = this.getBaseline(config.baseline);
            tiers = config.tiers || baseline?.tiers || [];
        }

        if (!baseline) return null;

        const { existingGroups = [] } = environment;
        const existingGroupNames = new Set(existingGroups.map(g => g.displayName));

        // Build lists for deployment
        const groupsToCreate = [];
        const policiesToConfigure = [];
        const roleAssignmentsToCreate = [];

        for (const tier of tiers) {
            for (const group of tier.groups) {
                // Only add if group doesn't exist
                if (!existingGroupNames.has(group.name)) {
                    groupsToCreate.push({
                        displayName: group.name,
                        description: group.description,
                        mailEnabled: false,
                        mailNickname: group.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase(),
                        securityEnabled: true,
                        isAssignableToRole: true,
                        roles: group.roles,
                        tier: tier.tier,
                        policy: tier.policy
                    });

                    policiesToConfigure.push({
                        groupName: group.name,
                        policy: tier.policy
                    });

                    roleAssignmentsToCreate.push(...group.roles.map(roleId => ({
                        groupName: group.name,
                        roleId: roleId
                    })));
                }
            }
        }

        // Calculate estimated time
        const totalSeconds = (groupsToCreate.length * 15) + (policiesToConfigure.length * 10) + (roleAssignmentsToCreate.length * 5);
        const estimatedMinutes = Math.ceil(totalSeconds / 60);

        return {
            baseline: baseline.name,
            groupsToCreate,
            policiesToConfigure,
            roleAssignmentsToCreate,
            estimatedTime: estimatedMinutes > 1 ? `${estimatedMinutes} minutes` : '< 1 minute',
            steps: this.getDeploymentStepsList(groupsToCreate.length, policiesToConfigure.length)
        };
    }

    /**
     * Get deployment steps list for UI display
     */
    getDeploymentStepsList(groupCount, policyCount) {
        return [
            {
                icon: 'fa-users',
                title: 'Create PIM Groups',
                description: `Create ${groupCount} role-assignable security groups with appropriate naming`
            },
            {
                icon: 'fa-clock',
                title: 'Wait for Provisioning',
                description: 'Allow time for groups to be fully provisioned in Azure AD'
            },
            {
                icon: 'fa-shield-alt',
                title: 'Configure Policies',
                description: `Apply ${policyCount} tier-specific policies (expiration, enablement, approval)`
            },
            {
                icon: 'fa-check-circle',
                title: 'Verify Deployment',
                description: 'Confirm all groups and policies are correctly configured'
            }
        ];
    }

    /**
     * Estimate deployment time in minutes
     */
    estimateDeploymentTime(groups, policies, assignments) {
        // Rough estimates: 15s per group, 10s per policy, 5s per assignment
        const totalSeconds = (groups * 15) + (policies * 10) + (assignments * 5);
        return Math.ceil(totalSeconds / 60);
    }

    /**
     * Get deployment steps for a baseline
     */
    getDeploymentSteps(baselineId, options = {}) {
        const baseline = this.getBaseline(baselineId);
        if (!baseline) return [];

        const steps = [];
        const { selectedTiers = null } = options;

        let tiers = baseline.tiers;
        if (selectedTiers) {
            tiers = tiers.filter(t => selectedTiers.includes(t.tier));
        }

        // Step 1: Create groups
        for (const tier of tiers) {
            for (const group of tier.groups) {
                steps.push({
                    type: 'create-group',
                    tier: tier.tier,
                    tierName: tier.name,
                    group: group,
                    description: `Create group: ${group.name}`
                });
            }
        }

        // Step 2: Apply policies
        for (const tier of tiers) {
            for (const group of tier.groups) {
                steps.push({
                    type: 'apply-policy',
                    tier: tier.tier,
                    tierName: tier.name,
                    group: group,
                    policy: tier.policy,
                    description: `Configure policy for: ${group.name}`
                });
            }
        }

        // Step 3: Create role assignments (if users are specified)
        if (options.userAssignments) {
            for (const tier of tiers) {
                for (const group of tier.groups) {
                    if (options.userAssignments[group.name]) {
                        for (const userId of options.userAssignments[group.name]) {
                            steps.push({
                                type: 'assign-user',
                                tier: tier.tier,
                                tierName: tier.name,
                                group: group,
                                userId: userId,
                                description: `Assign user to: ${group.name}`
                            });
                        }
                    }
                }
            }
        }

        return steps;
    }

    /**
     * Validate baseline configuration against existing environment
     * @param {Object|string} config - Either a config object {baseline, tiers} or baseline ID string
     * @param {Object} environment - Existing environment {existingGroups, existingRoles}
     */
    validateBaseline(config, environment = {}) {
        // Handle both config object and baseline ID string
        let baseline, tiers;
        if (typeof config === 'string') {
            baseline = this.getBaseline(config);
            tiers = baseline?.tiers || [];
        } else {
            baseline = this.getBaseline(config.baseline);
            tiers = config.tiers || baseline?.tiers || [];
        }

        if (!baseline) {
            return {
                valid: false,
                errors: ['Baseline not found'],
                warnings: []
            };
        }

        const { existingGroups = [] } = environment;
        const errors = [];
        const warnings = [];
        const existingGroupNames = new Set(existingGroups.map(g => g.displayName));

        // Check for naming conflicts and count groups to create
        let newGroupsCount = 0;
        const existingGroupsList = [];
        const newGroupsList = [];

        for (const tier of tiers) {
            for (const group of tier.groups) {
                if (existingGroupNames.has(group.name)) {
                    existingGroupsList.push(group.name);
                    warnings.push(`Group "${group.name}" already exists and will be skipped`);
                } else {
                    newGroupsCount++;
                    newGroupsList.push(group.name);
                }
            }
        }

        // Only error if NO groups will be created and user hasn't acknowledged
        if (newGroupsCount === 0 && existingGroupsList.length > 0) {
            warnings.push(`All ${existingGroupsList.length} groups already exist. Nothing to deploy.`);
            warnings.push('Tip: Customize group names or delete existing groups first.');
        }

        return {
            valid: newGroupsCount > 0, // Valid as long as at least one group can be created
            errors,
            warnings,
            groupsToCreate: newGroupsCount,
            existingGroups: existingGroupsList,
            newGroups: newGroupsList
        };
    }

    /**
     * Get summary statistics for a baseline
     */
    getBaselineSummary(baselineId) {
        const baseline = this.getBaseline(baselineId);
        if (!baseline) return null;

        const summary = {
            name: baseline.name,
            description: baseline.description,
            tiers: baseline.tiers.length,
            totalGroups: 0,
            totalRoles: 0,
            policies: {},
            securityLevel: this.calculateSecurityLevel(baseline)
        };

        for (const tier of baseline.tiers) {
            summary.totalGroups += tier.groups.length;
            summary.totalRoles += tier.groups.reduce((sum, g) => sum + g.roles.length, 0);

            // Count policy types
            const policyKey = JSON.stringify(tier.policy);
            if (!summary.policies[policyKey]) {
                summary.policies[policyKey] = {
                    ...tier.policy,
                    count: 0
                };
            }
            summary.policies[policyKey].count += tier.groups.length;
        }

        return summary;
    }

    /**
     * Calculate overall security level score (0-100)
     */
    calculateSecurityLevel(baseline) {
        let score = 0;
        let totalGroups = 0;

        for (const tier of baseline.tiers) {
            for (const group of tier.groups) {
                totalGroups++;
                const policy = tier.policy;

                // Scoring criteria
                if (policy.requireMfa) score += 20;
                if (policy.requireJustification) score += 15;
                if (policy.requireApproval) score += 25;
                if (policy.requireTicketInfo) score += 15;
                if (policy.maximumDurationHours <= 4) score += 15;
                else if (policy.maximumDurationHours <= 8) score += 10;
                else score += 5;
            }
        }

        return totalGroups > 0 ? Math.round(score / totalGroups) : 0;
    }
}

export const baselineService = new BaselineService();
