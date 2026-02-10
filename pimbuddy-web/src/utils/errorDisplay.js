/**
 * Enhanced Error Display with Recovery Actions
 * Better error messages and user guidance
 */

import { AppError, ErrorType } from './errorHandling.js';

/**
 * Get error recovery actions based on error type
 * @param {AppError} error - The error to get actions for
 * @returns {Array<Object>} Recovery actions
 */
export function getRecoveryActions(error) {
    const actions = [];

    switch (error.type) {
        case ErrorType.NETWORK:
            actions.push(
                { label: 'Retry', action: 'retry', primary: true },
                { label: 'Check Connection', action: 'check_connection' },
                { label: 'Go Offline', action: 'offline_mode' }
            );
            break;

        case ErrorType.AUTH:
            actions.push(
                { label: 'Sign In Again', action: 'sign_in', primary: true },
                { label: 'Clear Cache', action: 'clear_cache' }
            );
            break;

        case ErrorType.PERMISSION:
            actions.push(
                { label: 'View Required Permissions', action: 'view_permissions', primary: true },
                { label: 'Contact Admin', action: 'contact_admin' }
            );
            break;

        case ErrorType.VALIDATION:
            actions.push(
                { label: 'Review Input', action: 'retry', primary: true },
                { label: 'View Guidelines', action: 'view_guidelines' }
            );
            break;

        case ErrorType.RATE_LIMIT:
            actions.push(
                { label: 'Wait and Retry', action: 'retry_delayed', primary: true },
                { label: 'View API Limits', action: 'view_limits' }
            );
            break;

        case ErrorType.NOT_FOUND:
            actions.push(
                { label: 'Go Back', action: 'go_back', primary: true },
                { label: 'Refresh', action: 'refresh' }
            );
            break;

        default:
            actions.push(
                { label: 'Try Again', action: 'retry', primary: true },
                { label: 'Report Issue', action: 'report' }
            );
    }

    actions.push({ label: 'Dismiss', action: 'dismiss' });

    return actions;
}

/**
 * Get detailed error information with troubleshooting steps
 * @param {AppError} error - The error
 * @returns {Object} Detailed error info
 */
export function getErrorDetails(error) {
    const details = {
        title: 'Error Occurred',
        message: error.getUserMessage(),
        suggestion: error.getSuggestedAction(),
        steps: [],
        icon: 'fa-exclamation-circle',
        color: 'error'
    };

    switch (error.type) {
        case ErrorType.NETWORK:
            details.title = 'Connection Problem';
            details.icon = 'fa-wifi';
            details.steps = [
                'Check your internet connection',
                'Verify you can access other websites',
                'Try disabling VPN or proxy if enabled',
                'Clear browser cache and reload'
            ];
            break;

        case ErrorType.AUTH:
            details.title = 'Authentication Required';
            details.icon = 'fa-lock';
            details.steps = [
                'Click "Sign In Again" to authenticate',
                'Ensure pop-ups are not blocked',
                'Check if your session has expired',
                'Clear browser cookies if problem persists'
            ];
            details.color = 'warning';
            break;

        case ErrorType.PERMISSION:
            details.title = 'Permission Denied';
            details.icon = 'fa-ban';
            details.steps = [
                'Contact your Azure AD administrator',
                'Request the required API permissions',
                'Ensure admin consent has been granted',
                'Wait 5-10 minutes after permissions are granted'
            ];
            break;

        case ErrorType.VALIDATION:
            details.title = 'Invalid Input';
            details.icon = 'fa-edit';
            details.steps = [
                'Check all required fields are filled',
                'Verify input format matches requirements',
                'Review any field-specific error messages',
                'Ensure dates are in correct format (ISO 8601)'
            ];
            details.color = 'warning';
            break;

        case ErrorType.RATE_LIMIT:
            details.title = 'Rate Limit Exceeded';
            details.icon = 'fa-hourglass-half';
            details.steps = [
                'Wait 1-2 minutes before trying again',
                'Reduce frequency of requests',
                'Consider using bulk operations',
                'Check Microsoft Graph API throttling limits'
            ];
            details.color = 'warning';
            break;

        case ErrorType.NOT_FOUND:
            details.title = 'Resource Not Found';
            details.icon = 'fa-search';
            details.steps = [
                'Verify the resource still exists',
                'Check if it was recently deleted',
                'Ensure you have permission to view it',
                'Try refreshing the page'
            ];
            break;

        case ErrorType.CONFLICT:
            details.title = 'Conflict Detected';
            details.icon = 'fa-exclamation-triangle';
            details.steps = [
                'Check if the resource already exists',
                'Verify no duplicate entries',
                'Refresh the page to see current state',
                'Use a different name if creating new resource'
            ];
            details.color = 'warning';
            break;

        case ErrorType.SERVER:
            details.title = 'Server Error';
            details.icon = 'fa-server';
            details.steps = [
                'Wait a moment and try again',
                'Check Microsoft 365 Service Health',
                'Verify Azure services are operational',
                'Report if problem persists'
            ];
            break;
    }

    return details;
}

/**
 * Render enhanced error modal
 * @param {AppError} error - The error to display
 * @param {Function} onAction - Callback for recovery actions
 * @returns {string} HTML for error modal
 */
export function renderErrorModal(error, onAction = null) {
    const details = getErrorDetails(error);
    const actions = getRecoveryActions(error);

    const stepsHTML = details.steps.length > 0 ? `
        <div class="error-troubleshooting">
            <h5 class="error-troubleshooting-title">
                <i class="fas fa-wrench"></i>
                Troubleshooting Steps
            </h5>
            <ol class="error-steps-list">
                ${details.steps.map(step => `
                    <li class="error-step">${step}</li>
                `).join('')}
            </ol>
        </div>
    ` : '';

    const technicalDetails = error.details || error.originalError?.message ? `
        <details class="error-technical-details">
            <summary>Technical Details</summary>
            <pre class="error-technical-pre">${JSON.stringify({
                type: error.type,
                message: error.message,
                details: error.details,
                originalMessage: error.originalError?.message,
                timestamp: error.timestamp
            }, null, 2)}</pre>
        </details>
    ` : '';

    return `
        <div class="modal-header modal-header-${details.color}">
            <h3 class="modal-title">
                <i class="fas ${details.icon}"></i>
                ${details.title}
            </h3>
            <button class="modal-close" aria-label="Close modal">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <div class="error-content">
                <div class="error-message">
                    <p class="error-main-message">${details.message}</p>
                    <p class="error-suggestion">
                        <i class="fas fa-lightbulb"></i>
                        ${details.suggestion}
                    </p>
                </div>

                ${stepsHTML}

                ${technicalDetails}
            </div>
        </div>
        <div class="modal-footer">
            <div class="error-actions">
                ${actions.map((action, index) => `
                    <button
                        class="btn ${action.primary ? 'btn-primary' : 'btn-secondary'}"
                        data-action="${action.action}"
                        ${index === 0 ? 'autofocus' : ''}
                    >
                        ${action.label}
                    </button>
                `).join('')}
            </div>
        </div>

        <style>
            .modal-header-error {
                border-left: 4px solid var(--color-error);
            }

            .modal-header-warning {
                border-left: 4px solid var(--color-warning);
            }

            .error-content {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            .error-message {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            .error-main-message {
                font-size: 1rem;
                color: var(--text-primary);
                margin: 0;
            }

            .error-suggestion {
                display: flex;
                align-items: flex-start;
                gap: 0.5rem;
                padding: 0.75rem;
                background: var(--bg-tertiary);
                border-radius: var(--radius-md);
                border-left: 3px solid var(--accent-primary);
                font-size: 0.875rem;
                color: var(--text-secondary);
                margin: 0;
            }

            .error-suggestion i {
                color: var(--accent-primary);
                margin-top: 0.125rem;
            }

            .error-troubleshooting {
                padding: 1rem;
                background: var(--bg-tertiary);
                border-radius: var(--radius-md);
            }

            .error-troubleshooting-title {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.875rem;
                font-weight: 600;
                color: var(--text-primary);
                margin: 0 0 0.75rem 0;
            }

            .error-troubleshooting-title i {
                color: var(--accent-secondary);
            }

            .error-steps-list {
                margin: 0;
                padding-left: 1.5rem;
                color: var(--text-secondary);
            }

            .error-step {
                margin-bottom: 0.5rem;
                font-size: 0.875rem;
            }

            .error-step:last-child {
                margin-bottom: 0;
            }

            .error-technical-details {
                margin-top: 1rem;
                padding: 0.75rem;
                background: var(--bg-tertiary);
                border-radius: var(--radius-md);
                font-size: 0.75rem;
            }

            .error-technical-details summary {
                cursor: pointer;
                color: var(--text-tertiary);
                font-weight: 500;
            }

            .error-technical-details summary:hover {
                color: var(--text-secondary);
            }

            .error-technical-pre {
                margin: 0.75rem 0 0 0;
                padding: 0.75rem;
                background: var(--bg-primary);
                border-radius: var(--radius-sm);
                overflow-x: auto;
                font-family: var(--font-mono);
                font-size: 0.75rem;
                color: var(--text-secondary);
            }

            .error-actions {
                display: flex;
                gap: 0.75rem;
                flex-wrap: wrap;
                justify-content: flex-end;
            }

            .error-actions .btn {
                min-width: 100px;
            }

            @media (max-width: 640px) {
                .error-actions {
                    flex-direction: column;
                }

                .error-actions .btn {
                    width: 100%;
                }
            }
        </style>
    `;
}

/**
 * Show enhanced error modal
 * @param {Error|AppError} error - Error to display
 * @param {Object} options - Display options
 */
export function showEnhancedError(error, options = {}) {
    const {
        onAction = null,
        onClose = null
    } = options;

    // Convert to AppError if needed
    const appError = error instanceof AppError
        ? error
        : new AppError(error.message || 'An error occurred');

    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');

    if (!modalContainer || !modalContent) {
        console.error('Modal container not found');
        alert(appError.getUserMessage());
        return;
    }

    // Render modal
    modalContent.innerHTML = renderErrorModal(appError, onAction);

    // Show modal
    modalContainer.classList.remove('hidden');

    // Handle actions
    const actionButtons = modalContent.querySelectorAll('[data-action]');
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;

            // Handle common actions
            switch (action) {
                case 'dismiss':
                    modalContainer.classList.add('hidden');
                    if (onClose) onClose();
                    break;

                case 'retry':
                    modalContainer.classList.add('hidden');
                    if (onAction) onAction('retry');
                    break;

                case 'sign_in':
                    modalContainer.classList.add('hidden');
                    window.location.reload();
                    break;

                case 'go_back':
                    modalContainer.classList.add('hidden');
                    window.history.back();
                    break;

                case 'refresh':
                    window.location.reload();
                    break;

                default:
                    if (onAction) onAction(action);
                    break;
            }
        });
    });

    // Close button
    const closeButton = modalContent.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modalContainer.classList.add('hidden');
            if (onClose) onClose();
        });
    }

    // Close on escape
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            modalContainer.classList.add('hidden');
            if (onClose) onClose();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}
