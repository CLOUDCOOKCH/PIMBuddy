/**
 * Accessibility Manager
 * Handles focus management, keyboard navigation, and screen reader support
 */

export class AccessibilityManager {
    constructor() {
        this.lastFocusedElement = null;
        this.modalStack = [];
        this.skipLinksAdded = false;
    }

    /**
     * Initialize accessibility features
     */
    initialize() {
        this.addSkipLinks();
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.enhanceModals();
        this.setupLiveRegion();

        console.log('AccessibilityManager initialized');
    }

    /**
     * Add skip links for keyboard navigation
     */
    addSkipLinks() {
        if (this.skipLinksAdded) return;

        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.setAttribute('role', 'navigation');
        skipLinks.setAttribute('aria-label', 'Skip links');

        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
        `;

        document.body.insertBefore(skipLinks, document.body.firstChild);
        this.skipLinksAdded = true;

        // Add CSS for skip links (visible on focus)
        this.addSkipLinkStyles();
    }

    /**
     * Add CSS for skip links
     */
    addSkipLinkStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .skip-links {
                position: absolute;
                top: -1000px;
                left: -1000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            }

            .skip-link:focus {
                position: fixed;
                top: 10px;
                left: 10px;
                width: auto;
                height: auto;
                padding: 0.75rem 1.5rem;
                background: var(--accent-primary);
                color: var(--bg-primary);
                font-family: var(--font-display);
                font-weight: 700;
                text-decoration: none;
                border-radius: var(--radius-md);
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            .skip-link:focus:hover {
                background: var(--accent-primary-bright);
            }

            /* Focus visible styles for better keyboard navigation */
            *:focus-visible {
                outline: 2px solid var(--accent-primary);
                outline-offset: 2px;
            }

            /* Remove default focus for mouse users */
            *:focus:not(:focus-visible) {
                outline: none;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        // Enhanced keyboard shortcuts with announcements
        document.addEventListener('keydown', (e) => {
            // Alt+N for navigation menu
            if (e.altKey && e.key === 'n') {
                e.preventDefault();
                this.focusNavigation();
                this.announce('Navigation menu focused');
            }

            // Alt+M for main content
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                this.focusMainContent();
                this.announce('Main content focused');
            }

            // Alt+S for search (if search exists)
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                const search = document.querySelector('[role="search"] input, #group-search, #role-search');
                if (search) {
                    search.focus();
                    this.announce('Search focused');
                }
            }
        });

        // Tab trap in modals (handled in enhanceModals)
    }

    /**
     * Setup focus management
     */
    setupFocusManagement() {
        // Restore focus when navigating back
        window.addEventListener('popstate', () => {
            // Focus main content after navigation
            requestAnimationFrame(() => {
                this.focusMainContent();
            });
        });

        // Monitor focus and provide helpful feedback
        document.addEventListener('focus', (e) => {
            // Announce buttons on focus for screen readers
            if (e.target.matches('button:not([aria-label]):not([title])')) {
                const text = e.target.textContent.trim();
                if (text) {
                    e.target.setAttribute('aria-label', text);
                }
            }
        }, true);
    }

    /**
     * Enhance modals with accessibility features
     */
    enhanceModals() {
        // Observe modal container for changes
        const modalContainer = document.getElementById('modal-container');
        if (!modalContainer) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isVisible = !modalContainer.classList.contains('hidden');

                    if (isVisible) {
                        this.handleModalOpen(modalContainer);
                    } else {
                        this.handleModalClose();
                    }
                }
            });
        });

        observer.observe(modalContainer, { attributes: true });

        // Add aria attributes to modal
        modalContainer.setAttribute('role', 'dialog');
        modalContainer.setAttribute('aria-modal', 'true');
        modalContainer.setAttribute('aria-hidden', 'true');
    }

    /**
     * Handle modal open
     * @param {HTMLElement} modal - Modal element
     */
    handleModalOpen(modal) {
        // Save current focus
        this.lastFocusedElement = document.activeElement;
        this.modalStack.push(this.lastFocusedElement);

        // Update aria-hidden
        modal.setAttribute('aria-hidden', 'false');

        // Find modal title for aria-labelledby
        const modalContent = modal.querySelector('#modal-content');
        const title = modalContent?.querySelector('h2, h3, .modal-title');
        if (title && !title.id) {
            title.id = `modal-title-${Date.now()}`;
        }
        if (title) {
            modal.setAttribute('aria-labelledby', title.id);
        }

        // Focus first focusable element in modal
        requestAnimationFrame(() => {
            const firstFocusable = this.getFocusableElements(modalContent)[0];
            if (firstFocusable) {
                firstFocusable.focus();
            }
        });

        // Setup tab trapping
        this.setupTabTrap(modal);

        // Announce modal opened
        this.announce('Dialog opened');
    }

    /**
     * Handle modal close
     */
    handleModalClose() {
        const modal = document.getElementById('modal-container');
        modal.setAttribute('aria-hidden', 'true');

        // Restore focus to last focused element
        const focusElement = this.modalStack.pop();
        if (focusElement && typeof focusElement.focus === 'function') {
            // Use setTimeout to avoid focus issues
            setTimeout(() => {
                try {
                    focusElement.focus();
                } catch (e) {
                    // If focus fails, focus main content
                    this.focusMainContent();
                }
            }, 100);
        }

        // Announce modal closed
        this.announce('Dialog closed');
    }

    /**
     * Setup tab trapping in modal
     * @param {HTMLElement} modal - Modal element
     */
    setupTabTrap(modal) {
        const modalContent = modal.querySelector('#modal-content');
        if (!modalContent) return;

        const handleTabKey = (e) => {
            if (e.key !== 'Tab') return;

            const focusableElements = this.getFocusableElements(modalContent);
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            // If no focusable elements, prevent tab
            if (focusableElements.length === 0) {
                e.preventDefault();
                return;
            }

            // Shift+Tab on first element -> focus last
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
            // Tab on last element -> focus first
            else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        };

        // Remove previous listener if exists
        modal.removeEventListener('keydown', handleTabKey);
        modal.addEventListener('keydown', handleTabKey);
    }

    /**
     * Get all focusable elements in container
     * @param {HTMLElement} container - Container element
     * @returns {Array} Array of focusable elements
     */
    getFocusableElements(container) {
        if (!container) return [];

        const selector = `
            a[href]:not([disabled]),
            button:not([disabled]),
            textarea:not([disabled]),
            input:not([type="hidden"]):not([disabled]),
            select:not([disabled]),
            [tabindex]:not([tabindex="-1"]):not([disabled])
        `;

        return Array.from(container.querySelectorAll(selector))
            .filter(el => {
                // Filter out invisible elements
                return el.offsetParent !== null &&
                       window.getComputedStyle(el).visibility !== 'hidden';
            });
    }

    /**
     * Focus navigation menu
     */
    focusNavigation() {
        const nav = document.querySelector('.sidebar, [role="navigation"]');
        if (nav) {
            const firstNavItem = nav.querySelector('.nav-item, a');
            if (firstNavItem) {
                firstNavItem.focus();
            }
        }
    }

    /**
     * Focus main content
     */
    focusMainContent() {
        const main = document.getElementById('main-content') || document.querySelector('main, .content-wrapper');
        if (main) {
            // Make main focusable if it isn't
            if (!main.hasAttribute('tabindex')) {
                main.setAttribute('tabindex', '-1');
            }
            main.focus();
            // Remove tabindex after focus to not interfere with normal tab flow
            setTimeout(() => {
                main.removeAttribute('tabindex');
            }, 100);
        }
    }

    /**
     * Setup live region for screen reader announcements
     */
    setupLiveRegion() {
        let liveRegion = document.getElementById('a11y-live-region');

        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'a11y-live-region';
            liveRegion.setAttribute('role', 'status');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';

            // Add CSS for screen-reader-only content
            const style = document.createElement('style');
            style.textContent = `
                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }
            `;
            document.head.appendChild(style);

            document.body.appendChild(liveRegion);
        }

        this.liveRegion = liveRegion;
    }

    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     * @param {string} priority - 'polite' or 'assertive'
     */
    announce(message, priority = 'polite') {
        if (!this.liveRegion) {
            this.setupLiveRegion();
        }

        // Update aria-live attribute
        this.liveRegion.setAttribute('aria-live', priority);

        // Clear and set message
        this.liveRegion.textContent = '';

        // Small delay to ensure screen readers pick up the change
        setTimeout(() => {
            this.liveRegion.textContent = message;
        }, 100);

        // Clear after announcement
        setTimeout(() => {
            this.liveRegion.textContent = '';
        }, 1000);
    }

    /**
     * Enhance form accessibility
     * @param {HTMLFormElement} form - Form element
     */
    enhanceForm(form) {
        if (!form) return;

        // Add labels to inputs without labels
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (!input.id) {
                input.id = `input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            }

            // Find associated label
            let label = form.querySelector(`label[for="${input.id}"]`);

            // If no label, check if input is inside a label
            if (!label) {
                label = input.closest('label');
            }

            // If still no label, create one from placeholder or name
            if (!label && (input.placeholder || input.name)) {
                const labelText = input.placeholder || input.name;
                input.setAttribute('aria-label', labelText);
            }

            // Add aria-required for required fields
            if (input.hasAttribute('required') && !input.hasAttribute('aria-required')) {
                input.setAttribute('aria-required', 'true');
            }

            // Add aria-invalid for fields with errors
            if (input.classList.contains('error') || input.classList.contains('invalid')) {
                input.setAttribute('aria-invalid', 'true');
            }
        });

        // Announce form errors
        const errorMessages = form.querySelectorAll('.error-message, .field-error');
        if (errorMessages.length > 0) {
            const errors = Array.from(errorMessages).map(el => el.textContent).join(', ');
            this.announce(`Form has ${errorMessages.length} error${errorMessages.length > 1 ? 's' : ''}: ${errors}`, 'assertive');
        }
    }

    /**
     * Enhance table accessibility
     * @param {HTMLTableElement} table - Table element
     */
    enhanceTable(table) {
        if (!table) return;

        // Add role if not present
        if (!table.hasAttribute('role')) {
            table.setAttribute('role', 'table');
        }

        // Add caption if not present
        if (!table.querySelector('caption')) {
            const caption = document.createElement('caption');
            caption.className = 'sr-only';
            caption.textContent = table.getAttribute('aria-label') || 'Data table';
            table.insertBefore(caption, table.firstChild);
        }

        // Enhance thead
        const thead = table.querySelector('thead');
        if (thead) {
            thead.setAttribute('role', 'rowgroup');
            thead.querySelectorAll('tr').forEach(tr => {
                tr.setAttribute('role', 'row');
            });
            thead.querySelectorAll('th').forEach(th => {
                th.setAttribute('role', 'columnheader');
                if (!th.hasAttribute('scope')) {
                    th.setAttribute('scope', 'col');
                }
            });
        }

        // Enhance tbody
        const tbody = table.querySelector('tbody');
        if (tbody) {
            tbody.setAttribute('role', 'rowgroup');
            tbody.querySelectorAll('tr').forEach(tr => {
                tr.setAttribute('role', 'row');
            });
            tbody.querySelectorAll('td').forEach(td => {
                td.setAttribute('role', 'cell');
            });
        }

        // Add sortable attributes to sortable columns
        table.querySelectorAll('th.sortable').forEach(th => {
            if (!th.hasAttribute('aria-sort')) {
                th.setAttribute('aria-sort', 'none');
            }
        });
    }

    /**
     * Announce page change
     * @param {string} pageName - Name of the page
     */
    announcePageChange(pageName) {
        const formattedName = pageName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        this.announce(`Navigated to ${formattedName} page`, 'polite');
    }

    /**
     * Announce loading state
     * @param {boolean} isLoading - Whether loading
     * @param {string} message - Loading message
     */
    announceLoading(isLoading, message = '') {
        if (isLoading) {
            this.announce(`Loading${message ? ': ' + message : '...'}`, 'polite');
        } else {
            this.announce('Loading complete', 'polite');
        }
    }
}

// Export singleton instance
export const accessibilityManager = new AccessibilityManager();
