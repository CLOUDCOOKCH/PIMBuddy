/**
 * Skeleton Loading Screens
 * Improved perceived performance with content placeholders
 */

/**
 * Create skeleton loader element
 * @param {string} type - Type of skeleton ('text', 'title', 'avatar', 'image', 'button', 'card')
 * @param {Object} options - Additional options
 * @returns {HTMLElement} Skeleton element
 */
export function createSkeleton(type = 'text', options = {}) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton';

    const {
        width = '100%',
        height = null,
        rows = 1,
        className = ''
    } = options;

    switch (type) {
        case 'text':
            skeleton.classList.add('skeleton-text');
            skeleton.style.width = width;
            if (height) skeleton.style.height = height;
            break;

        case 'title':
            skeleton.classList.add('skeleton-title');
            skeleton.style.width = width;
            break;

        case 'avatar':
            skeleton.classList.add('skeleton-avatar');
            if (height) skeleton.style.width = skeleton.style.height = height;
            break;

        case 'image':
            skeleton.classList.add('skeleton-image');
            skeleton.style.width = width;
            if (height) skeleton.style.height = height;
            break;

        case 'button':
            skeleton.classList.add('skeleton-button');
            skeleton.style.width = width;
            break;

        case 'card':
            skeleton.classList.add('skeleton-card');
            break;

        case 'table-row':
            skeleton.classList.add('skeleton-table-row');
            break;
    }

    if (className) {
        skeleton.className += ` ${className}`;
    }

    return skeleton;
}

/**
 * Skeleton template for table loading
 * @param {number} rows - Number of rows
 * @param {number} columns - Number of columns
 * @returns {string} HTML for skeleton table
 */
export function skeletonTable(rows = 5, columns = 5) {
    const headerCells = Array(columns).fill('').map(() =>
        '<th><div class="skeleton skeleton-text"></div></th>'
    ).join('');

    const bodyRows = Array(rows).fill('').map(() => `
        <tr>
            ${Array(columns).fill('').map(() =>
                '<td><div class="skeleton skeleton-text"></div></td>'
            ).join('')}
        </tr>
    `).join('');

    return `
        <table class="table skeleton-table">
            <thead>
                <tr>${headerCells}</tr>
            </thead>
            <tbody>
                ${bodyRows}
            </tbody>
        </table>
    `;
}

/**
 * Skeleton template for card grid
 * @param {number} count - Number of cards
 * @returns {string} HTML for skeleton cards
 */
export function skeletonCards(count = 6) {
    return Array(count).fill('').map(() => `
        <div class="card skeleton-card">
            <div class="skeleton skeleton-title" style="width: 60%;"></div>
            <div class="skeleton skeleton-text" style="width: 80%;"></div>
            <div class="skeleton skeleton-text" style="width: 90%;"></div>
            <div class="skeleton skeleton-text" style="width: 70%;"></div>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <div class="skeleton skeleton-button" style="width: 100px;"></div>
                <div class="skeleton skeleton-button" style="width: 100px;"></div>
            </div>
        </div>
    `).join('');
}

/**
 * Skeleton template for list items
 * @param {number} count - Number of items
 * @param {boolean} withAvatar - Include avatar
 * @returns {string} HTML for skeleton list
 */
export function skeletonList(count = 5, withAvatar = false) {
    return Array(count).fill('').map(() => `
        <div class="skeleton-list-item">
            ${withAvatar ? '<div class="skeleton skeleton-avatar"></div>' : ''}
            <div class="skeleton-list-content">
                <div class="skeleton skeleton-text" style="width: 40%;"></div>
                <div class="skeleton skeleton-text" style="width: 80%;"></div>
            </div>
        </div>
    `).join('');
}

/**
 * Skeleton template for dashboard stats
 * @param {number} count - Number of stat cards
 * @returns {string} HTML for skeleton stats
 */
export function skeletonStats(count = 4) {
    return Array(count).fill('').map(() => `
        <div class="stat-card skeleton-stat-card">
            <div class="skeleton skeleton-text" style="width: 50%; height: 1rem;"></div>
            <div class="skeleton skeleton-title" style="width: 70%; height: 2rem; margin-top: 0.5rem;"></div>
            <div class="skeleton skeleton-text" style="width: 40%; height: 0.75rem; margin-top: 0.5rem;"></div>
        </div>
    `).join('');
}

/**
 * Skeleton template for form
 * @param {number} fields - Number of form fields
 * @returns {string} HTML for skeleton form
 */
export function skeletonForm(fields = 5) {
    return Array(fields).fill('').map(() => `
        <div class="form-group" style="margin-bottom: 1.5rem;">
            <div class="skeleton skeleton-text" style="width: 30%; height: 0.875rem; margin-bottom: 0.5rem;"></div>
            <div class="skeleton skeleton-text" style="width: 100%; height: 2.5rem;"></div>
        </div>
    `).join('');
}

/**
 * Skeleton template for dashboard page
 * @returns {string} HTML for skeleton dashboard
 */
export function skeletonDashboard() {
    return `
        <div class="page-header">
            <div class="skeleton skeleton-title" style="width: 200px;"></div>
            <div class="skeleton skeleton-text" style="width: 300px; margin-top: 0.5rem;"></div>
        </div>

        <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            ${skeletonStats(4)}
        </div>

        <div class="content-grid" style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;">
            <div class="card">
                <div class="skeleton skeleton-title" style="width: 150px; margin-bottom: 1rem;"></div>
                ${skeletonTable(5, 4)}
            </div>
            <div class="card">
                <div class="skeleton skeleton-title" style="width: 120px; margin-bottom: 1rem;"></div>
                ${skeletonList(5, true)}
            </div>
        </div>
    `;
}

/**
 * Skeleton template for groups/roles page
 * @returns {string} HTML for skeleton list page
 */
export function skeletonListPage() {
    return `
        <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <div>
                <div class="skeleton skeleton-title" style="width: 200px;"></div>
                <div class="skeleton skeleton-text" style="width: 300px; margin-top: 0.5rem;"></div>
            </div>
            <div class="skeleton skeleton-button" style="width: 150px;"></div>
        </div>

        <div class="page-controls" style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
            <div class="skeleton skeleton-text" style="width: 300px; height: 2.5rem;"></div>
            <div class="skeleton skeleton-button" style="width: 120px;"></div>
        </div>

        <div class="table-container">
            ${skeletonTable(10, 5)}
        </div>
    `;
}

/**
 * Add skeleton CSS styles
 * @returns {HTMLStyleElement} Style element
 */
export function addSkeletonStyles() {
    const existingStyle = document.getElementById('skeleton-styles');
    if (existingStyle) {
        return existingStyle;
    }

    const style = document.createElement('style');
    style.id = 'skeleton-styles';
    style.textContent = `
        /* Skeleton loading animations */
        @keyframes skeleton-loading {
            0% {
                background-position: -200px 0;
            }
            100% {
                background-position: calc(200px + 100%) 0;
            }
        }

        .skeleton {
            background: linear-gradient(
                90deg,
                var(--bg-tertiary) 0%,
                var(--bg-secondary) 20%,
                var(--bg-tertiary) 40%,
                var(--bg-tertiary) 100%
            );
            background-size: 200px 100%;
            animation: skeleton-loading 1.5s ease-in-out infinite;
            border-radius: var(--radius-sm);
            display: inline-block;
        }

        .skeleton-text {
            height: 0.875rem;
            margin-bottom: 0.5rem;
        }

        .skeleton-text:last-child {
            margin-bottom: 0;
        }

        .skeleton-title {
            height: 1.5rem;
            margin-bottom: 0.75rem;
        }

        .skeleton-avatar {
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .skeleton-image {
            height: 200px;
            width: 100%;
        }

        .skeleton-button {
            height: 2.5rem;
            border-radius: var(--radius-md);
        }

        .skeleton-card {
            padding: 1.5rem;
            background: var(--bg-secondary);
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-color);
        }

        .skeleton-stat-card {
            padding: 1.5rem;
        }

        .skeleton-table {
            width: 100%;
        }

        .skeleton-table th,
        .skeleton-table td {
            padding: 0.75rem;
        }

        .skeleton-table-row {
            height: 3rem;
            margin-bottom: 0.5rem;
        }

        .skeleton-list-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--border-color);
        }

        .skeleton-list-item:last-child {
            border-bottom: none;
        }

        .skeleton-list-content {
            flex: 1;
        }

        /* Reduce animation in prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
            .skeleton {
                animation: none;
                background: var(--bg-tertiary);
            }
        }
    `;

    document.head.appendChild(style);
    return style;
}

/**
 * Show skeleton loader in container
 * @param {HTMLElement|string} container - Container element or selector
 * @param {string} template - Skeleton template function name
 * @param  {...any} args - Arguments for template function
 */
export function showSkeleton(container, template = 'skeletonListPage', ...args) {
    const element = typeof container === 'string'
        ? document.querySelector(container)
        : container;

    if (!element) {
        console.warn('Skeleton container not found');
        return;
    }

    // Ensure styles are added
    addSkeletonStyles();

    // Get template function
    const templateFn = {
        skeletonTable,
        skeletonCards,
        skeletonList,
        skeletonStats,
        skeletonForm,
        skeletonDashboard,
        skeletonListPage
    }[template];

    if (!templateFn) {
        console.warn(`Unknown skeleton template: ${template}`);
        return;
    }

    // Render skeleton
    element.innerHTML = templateFn(...args);
    element.classList.add('skeleton-container');
}

/**
 * Hide skeleton and show content
 * @param {HTMLElement|string} container - Container element or selector
 * @param {string|HTMLElement} content - Content to show
 */
export function hideSkeleton(container, content = null) {
    const element = typeof container === 'string'
        ? document.querySelector(container)
        : container;

    if (!element) {
        console.warn('Skeleton container not found');
        return;
    }

    if (content) {
        if (typeof content === 'string') {
            element.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            element.innerHTML = '';
            element.appendChild(content);
        }
    }

    element.classList.remove('skeleton-container');
}

// Initialize skeleton styles on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addSkeletonStyles);
} else {
    addSkeletonStyles();
}
