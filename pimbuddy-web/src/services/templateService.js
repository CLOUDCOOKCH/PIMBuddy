/**
 * Template Service
 * Manages policy templates for PIM configuration
 */

// Predefined policy templates
const TEMPLATES = {
    'standard': {
        id: 'standard',
        name: 'Standard Security',
        description: 'Balanced security for typical enterprise use. Requires MFA and justification, with 8-hour activation window.',
        icon: 'fa-shield-alt',
        color: 'primary',
        settings: {
            activation: {
                maximumDurationHours: 8,
                requireMfa: true,
                requireJustification: true,
                requireTicketInfo: false,
                requireApproval: false
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
        }
    },
    'high-security': {
        id: 'high-security',
        name: 'High Security',
        description: 'Maximum security with mandatory approval workflows. Short activation window with all security controls enabled.',
        icon: 'fa-lock',
        color: 'danger',
        settings: {
            activation: {
                maximumDurationHours: 4,
                requireMfa: true,
                requireJustification: true,
                requireTicketInfo: true,
                requireApproval: true
            },
            eligibleAssignment: {
                allowPermanent: false,
                maximumDurationDays: 180
            },
            activeAssignment: {
                allowPermanent: false,
                maximumDurationDays: 7,
                requireMfa: true,
                requireJustification: true
            }
        }
    },
    'low-friction': {
        id: 'low-friction',
        name: 'Low Friction',
        description: 'Streamlined access for trusted environments. Extended activation window with minimal approval barriers.',
        icon: 'fa-bolt',
        color: 'warning',
        settings: {
            activation: {
                maximumDurationHours: 12,
                requireMfa: true,
                requireJustification: false,
                requireTicketInfo: false,
                requireApproval: false
            },
            eligibleAssignment: {
                allowPermanent: true,
                maximumDurationDays: 365
            },
            activeAssignment: {
                allowPermanent: false,
                maximumDurationDays: 90,
                requireMfa: false,
                requireJustification: false
            }
        }
    },
    'compliance': {
        id: 'compliance',
        name: 'Compliance Ready',
        description: 'Settings aligned with SOX, HIPAA, and other regulatory requirements. Full audit trail with ticket tracking.',
        icon: 'fa-clipboard-check',
        color: 'success',
        settings: {
            activation: {
                maximumDurationHours: 8,
                requireMfa: true,
                requireJustification: true,
                requireTicketInfo: true,
                requireApproval: true
            },
            eligibleAssignment: {
                allowPermanent: false,
                maximumDurationDays: 90
            },
            activeAssignment: {
                allowPermanent: false,
                maximumDurationDays: 14,
                requireMfa: true,
                requireJustification: true
            }
        }
    }
};

// Custom templates stored in localStorage
const CUSTOM_TEMPLATES_KEY = 'pimbuddy-custom-templates';

class TemplateService {
    constructor() {
        this.customTemplates = this.loadCustomTemplates();
    }

    /**
     * Get all available templates (built-in + custom)
     */
    getAllTemplates() {
        return {
            ...TEMPLATES,
            ...this.customTemplates
        };
    }

    /**
     * Get built-in templates only
     */
    getBuiltInTemplates() {
        return { ...TEMPLATES };
    }

    /**
     * Get custom templates only
     */
    getCustomTemplates() {
        return { ...this.customTemplates };
    }

    /**
     * Get a specific template by ID
     */
    getTemplate(templateId) {
        return this.getAllTemplates()[templateId] || null;
    }

    /**
     * Get template settings for application
     */
    getTemplateSettings(templateId) {
        const template = this.getTemplate(templateId);
        if (!template) {
            return null;
        }
        return template.settings;
    }

    /**
     * Save a custom template
     */
    saveCustomTemplate(template) {
        if (!template.id || !template.name || !template.settings) {
            throw new Error('Template must have id, name, and settings');
        }

        // Mark as custom
        template.isCustom = true;
        template.createdAt = template.createdAt || new Date().toISOString();
        template.updatedAt = new Date().toISOString();

        this.customTemplates[template.id] = template;
        this.persistCustomTemplates();

        return template;
    }

    /**
     * Delete a custom template
     */
    deleteCustomTemplate(templateId) {
        if (!this.customTemplates[templateId]) {
            return false;
        }

        delete this.customTemplates[templateId];
        this.persistCustomTemplates();
        return true;
    }

    /**
     * Create a template from current group settings
     */
    createTemplateFromSettings(name, description, settings) {
        const id = 'custom-' + Date.now();
        return this.saveCustomTemplate({
            id,
            name,
            description,
            icon: 'fa-file-alt',
            color: 'secondary',
            isCustom: true,
            settings
        });
    }

    /**
     * Compare two policy settings
     */
    compareSettings(current, template) {
        const differences = [];

        // Activation settings
        if (current.activation.maximumDurationHours !== template.activation.maximumDurationHours) {
            differences.push({
                setting: 'Maximum Activation Duration',
                current: `${current.activation.maximumDurationHours} hours`,
                template: `${template.activation.maximumDurationHours} hours`
            });
        }
        if (current.activation.requireMfa !== template.activation.requireMfa) {
            differences.push({
                setting: 'Require MFA',
                current: current.activation.requireMfa ? 'Yes' : 'No',
                template: template.activation.requireMfa ? 'Yes' : 'No'
            });
        }
        if (current.activation.requireJustification !== template.activation.requireJustification) {
            differences.push({
                setting: 'Require Justification',
                current: current.activation.requireJustification ? 'Yes' : 'No',
                template: template.activation.requireJustification ? 'Yes' : 'No'
            });
        }
        if (current.activation.requireApproval !== template.activation.requireApproval) {
            differences.push({
                setting: 'Require Approval',
                current: current.activation.requireApproval ? 'Yes' : 'No',
                template: template.activation.requireApproval ? 'Yes' : 'No'
            });
        }
        if (current.activation.requireTicketInfo !== template.activation.requireTicketInfo) {
            differences.push({
                setting: 'Require Ticket Info',
                current: current.activation.requireTicketInfo ? 'Yes' : 'No',
                template: template.activation.requireTicketInfo ? 'Yes' : 'No'
            });
        }

        return differences;
    }

    /**
     * Load custom templates from localStorage
     */
    loadCustomTemplates() {
        try {
            const saved = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    }

    /**
     * Persist custom templates to localStorage
     */
    persistCustomTemplates() {
        localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(this.customTemplates));
    }
}

export const templateService = new TemplateService();
