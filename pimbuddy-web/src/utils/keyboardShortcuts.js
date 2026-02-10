/**
 * Keyboard Shortcuts Help Modal
 * Display and manage keyboard shortcuts
 */

/**
 * Get all keyboard shortcuts
 * @returns {Array<Object>} List of shortcuts
 */
export function getKeyboardShortcuts() {
    return [
        {
            category: 'Navigation',
            shortcuts: [
                {
                    keys: ['Alt', 'N'],
                    description: 'Focus navigation menu',
                    action: 'Jump to sidebar navigation'
                },
                {
                    keys: ['Alt', 'M'],
                    description: 'Focus main content',
                    action: 'Jump to main content area'
                },
                {
                    keys: ['Alt', 'S'],
                    description: 'Focus search',
                    action: 'Jump to search input (if available)'
                },
                {
                    keys: ['Tab'],
                    description: 'Next element',
                    action: 'Move to next focusable element'
                },
                {
                    keys: ['Shift', 'Tab'],
                    description: 'Previous element',
                    action: 'Move to previous focusable element'
                }
            ]
        },
        {
            category: 'Actions',
            shortcuts: [
                {
                    keys: ['Enter'],
                    description: 'Activate button/link',
                    action: 'Trigger the focused button or link'
                },
                {
                    keys: ['Space'],
                    description: 'Activate checkbox/button',
                    action: 'Toggle checkbox or activate button'
                },
                {
                    keys: ['Escape'],
                    description: 'Close modal/dialog',
                    action: 'Close any open modal or dialog'
                }
            ]
        },
        {
            category: 'Application',
            shortcuts: [
                {
                    keys: ['Ctrl', 'K'],
                    description: 'Open command palette',
                    action: 'Quick access to commands (future)'
                },
                {
                    keys: ['?'],
                    description: 'Show keyboard shortcuts',
                    action: 'Display this help modal'
                },
                {
                    keys: ['Ctrl', 'R'],
                    description: 'Refresh page',
                    action: 'Reload the application'
                }
            ]
        },
        {
            category: 'Tables & Lists',
            shortcuts: [
                {
                    keys: ['↑', '↓'],
                    description: 'Navigate rows',
                    action: 'Move up/down in table rows'
                },
                {
                    keys: ['Home'],
                    description: 'First item',
                    action: 'Jump to first item in list'
                },
                {
                    keys: ['End'],
                    description: 'Last item',
                    action: 'Jump to last item in list'
                }
            ]
        }
    ];
}

/**
 * Render keyboard shortcuts help modal
 * @returns {string} HTML for shortcuts modal
 */
export function renderKeyboardShortcutsModal() {
    const shortcuts = getKeyboardShortcuts();

    const categoriesHTML = shortcuts.map(category => `
        <div class="shortcuts-category">
            <h4 class="shortcuts-category-title">${category.category}</h4>
            <div class="shortcuts-list">
                ${category.shortcuts.map(shortcut => `
                    <div class="shortcut-item">
                        <div class="shortcut-keys">
                            ${shortcut.keys.map(key => `
                                <kbd class="shortcut-key">${key}</kbd>
                            `).join('<span class="key-separator">+</span>')}
                        </div>
                        <div class="shortcut-description">
                            <div class="shortcut-desc-title">${shortcut.description}</div>
                            <div class="shortcut-desc-action">${shortcut.action}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    return `
        <div class="modal-header">
            <h3 class="modal-title">
                <i class="fas fa-keyboard"></i>
                Keyboard Shortcuts
            </h3>
            <button class="modal-close" aria-label="Close modal">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <p class="shortcuts-intro">
                Use these keyboard shortcuts to navigate PIMBuddy more efficiently.
            </p>
            <div class="shortcuts-container">
                ${categoriesHTML}
            </div>
            <div class="shortcuts-footer">
                <p>
                    <i class="fas fa-info-circle"></i>
                    <strong>Tip:</strong> Press <kbd>?</kbd> anytime to show this help.
                </p>
            </div>
        </div>
        <style>
            .shortcuts-intro {
                color: var(--text-secondary);
                margin-bottom: 1.5rem;
                font-size: 0.875rem;
            }

            .shortcuts-container {
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }

            .shortcuts-category-title {
                color: var(--accent-primary);
                font-size: 1rem;
                font-weight: 600;
                margin-bottom: 0.75rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid var(--border-color);
            }

            .shortcuts-list {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            .shortcut-item {
                display: grid;
                grid-template-columns: 200px 1fr;
                gap: 1.5rem;
                align-items: center;
                padding: 0.5rem;
                border-radius: var(--radius-md);
                transition: background-color 0.2s;
            }

            .shortcut-item:hover {
                background-color: var(--bg-tertiary);
            }

            .shortcut-keys {
                display: flex;
                align-items: center;
                gap: 0.25rem;
                flex-wrap: wrap;
            }

            .shortcut-key {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0.25rem 0.5rem;
                background: var(--bg-tertiary);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                font-family: var(--font-mono);
                font-size: 0.75rem;
                font-weight: 600;
                color: var(--text-primary);
                min-width: 2rem;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1),
                            inset 0 1px 0 rgba(255, 255, 255, 0.05);
            }

            .key-separator {
                color: var(--text-tertiary);
                font-size: 0.75rem;
                padding: 0 0.125rem;
            }

            .shortcut-description {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }

            .shortcut-desc-title {
                font-weight: 500;
                color: var(--text-primary);
                font-size: 0.875rem;
            }

            .shortcut-desc-action {
                font-size: 0.75rem;
                color: var(--text-tertiary);
            }

            .shortcuts-footer {
                margin-top: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid var(--border-color);
            }

            .shortcuts-footer p {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: var(--text-secondary);
                font-size: 0.875rem;
                margin: 0;
            }

            .shortcuts-footer i {
                color: var(--accent-primary);
            }

            .shortcuts-footer kbd {
                padding: 0.125rem 0.375rem;
                background: var(--bg-tertiary);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                font-family: var(--font-mono);
                font-size: 0.75rem;
            }

            @media (max-width: 768px) {
                .shortcut-item {
                    grid-template-columns: 1fr;
                    gap: 0.5rem;
                }

                .shortcuts-category {
                    margin-bottom: 1.5rem;
                }
            }
        </style>
    `;
}

/**
 * Show keyboard shortcuts modal
 */
export function showKeyboardShortcutsModal() {
    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');

    if (!modalContainer || !modalContent) {
        console.error('Modal container not found');
        return;
    }

    // Render modal content
    modalContent.innerHTML = renderKeyboardShortcutsModal();

    // Show modal
    modalContainer.classList.remove('hidden');

    // Focus first element
    const closeButton = modalContent.querySelector('.modal-close');
    if (closeButton) {
        closeButton.focus();

        // Add close handler
        closeButton.addEventListener('click', () => {
            modalContainer.classList.add('hidden');
        });
    }

    // Close on backdrop click
    const backdrop = modalContainer.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', () => {
            modalContainer.classList.add('hidden');
        });
    }

    // Close on escape
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            modalContainer.classList.add('hidden');
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

/**
 * Initialize keyboard shortcuts
 * Sets up global keyboard listeners
 */
export function initializeKeyboardShortcuts() {
    // Listen for '?' key to show shortcuts
    document.addEventListener('keydown', (e) => {
        // Show shortcuts on '?' (Shift+/)
        if (e.key === '?' && !e.ctrlKey && !e.altKey) {
            // Don't trigger if typing in input
            const activeElement = document.activeElement;
            const isInput = activeElement?.tagName === 'INPUT' ||
                           activeElement?.tagName === 'TEXTAREA' ||
                           activeElement?.isContentEditable;

            if (!isInput) {
                e.preventDefault();
                showKeyboardShortcutsModal();
            }
        }
    });

    console.log('Keyboard shortcuts initialized. Press ? to view shortcuts.');
}
