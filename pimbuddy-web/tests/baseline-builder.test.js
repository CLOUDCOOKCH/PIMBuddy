import assert from 'node:assert/strict';
import test from 'node:test';

import { baselineService } from '../src/services/baselineService.js';
import { graphService } from '../src/services/graphService.js';
import { BaselinePage } from '../src/pages/BaselinePage.js';

test('custom baseline builder remains clickable before connecting', async () => {
    let clickHandler;
    const builderButton = {
        addEventListener(eventName, handler) {
            assert.equal(eventName, 'click');
            clickHandler = handler;
        }
    };
    const container = {
        innerHTML: '',
        querySelector(selector) {
            assert.equal(selector, '#open-custom-baseline-builder');
            return builderButton;
        }
    };
    const page = new BaselinePage({ isConnected: false });
    let opened = false;
    page.openCustomBuilder = () => { opened = true; };

    await page.render(container);

    const buttonMarkup = container.innerHTML.match(/<button class="btn btn-primary btn-block" id="open-custom-baseline-builder"[^>]*>/)?.[0];
    assert.ok(buttonMarkup, 'builder button should be rendered');
    assert.doesNotMatch(buttonMarkup, /disabled/);
    assert.equal(typeof clickHandler, 'function');

    clickHandler();
    assert.equal(opened, true);
});

test('custom builder actions use bound listeners instead of the global app object', () => {
    const handlers = {};
    const controls = {
        '#close-custom-baseline-builder': {
            addEventListener(eventName, handler) { handlers[`close:${eventName}`] = handler; }
        },
        '#create-custom-baseline': {
            addEventListener(eventName, handler) { handlers[`create:${eventName}`] = handler; }
        }
    };
    const builder = {
        hidden: true,
        innerHTML: '',
        querySelector(selector) { return controls[selector]; },
        querySelectorAll() { return []; },
        scrollIntoView() {}
    };
    const originalDocument = globalThis.document;
    globalThis.document = { getElementById: () => builder };

    try {
        const page = new BaselinePage({ isConnected: false });
        let closed = false;
        let created = false;
        page.closeCustomBuilder = () => { closed = true; };
        page.createCustomBaseline = () => { created = true; };

        page.openCustomBuilder();

        assert.doesNotMatch(builder.innerHTML, /onclick=/);
        assert.equal(typeof handlers['close:click'], 'function');
        assert.equal(typeof handlers['create:click'], 'function');
        handlers['close:click']();
        handlers['create:click']();
        assert.equal(closed, true);
        assert.equal(created, true);
    } finally {
        globalThis.document = originalDocument;
    }
});

test('custom baselines use the standard baseline validation and deployment shape', () => {
    baselineService.setCustomBaseline({
        name: 'Test Baseline',
        description: 'A test configuration',
        features: ['Custom roles'],
        tiers: [{
            tier: 0,
            name: 'Tier 0',
            description: 'Critical roles',
            policy: {
                maximumDurationHours: 4,
                requireMfa: true,
                requireJustification: true,
                requireApproval: false,
                requireTicketInfo: false
            },
            groups: [{
                name: 'PIM-Custom-Global-Administrator',
                description: 'Custom global admin access',
                roles: ['62e90394-69f5-4237-9190-012177145e10']
            }]
        }]
    });

    const custom = baselineService.getBaseline('custom-baseline');

    assert.equal(custom.id, 'custom-baseline');
    assert.equal(custom.name, 'Test Baseline');
    assert.equal(custom.tiers[0].groups.length, 1);
    assert.equal(custom.tiers[0].policy.maximumDurationHours, 4);
});

test('group detail toggles do not depend on a browser-global event', () => {
    const attributes = {};
    let focused = false;
    const icon = { className: 'fas fa-chevron-down' };
    const button = {
        querySelector: () => icon,
        setAttribute(name, value) { attributes[name] = value; }
    };
    const details = {
        style: { display: 'none' },
        querySelector: () => ({ focus() { focused = true; } })
    };
    const originalDocument = globalThis.document;
    globalThis.document = { getElementById: () => details };

    try {
        const page = new BaselinePage({ isConnected: false });
        page.toggleGroupDetails(0, 0, button);
        assert.equal(details.style.display, 'block');
        assert.equal(icon.className, 'fas fa-chevron-up');
        assert.equal(attributes['aria-expanded'], 'true');
        assert.equal(focused, true);

        page.toggleGroupDetails(0, 0, button);
        assert.equal(details.style.display, 'none');
        assert.equal(attributes['aria-expanded'], 'false');
    } finally {
        globalThis.document = originalDocument;
    }
});

test('connected custom builder merges all tenant roles into the catalog', async () => {
    const originalGetRoleDefinitions = graphService.getRoleDefinitions;
    graphService.getRoleDefinitions = async () => ({
        success: true,
        roles: [{
            id: 'role-definition-id',
            templateId: 'custom-role-template',
            displayName: 'Authentication Administrator',
            privilegeLevel: 'high'
        }]
    });

    try {
        const page = new BaselinePage({ isConnected: true });
        await page.loadAvailableRoles();
        const role = page.customRoleCatalog.find(item => item.id === 'custom-role-template');
        assert.deepEqual(role, {
            id: 'custom-role-template',
            name: 'Authentication Administrator',
            tier: 1,
            icon: 'fa-user-shield'
        });
    } finally {
        graphService.getRoleDefinitions = originalGetRoleDefinitions;
    }
});

test('custom role search filters rendered role names and reports matches', () => {
    const makeOption = textContent => {
        const classes = new Set();
        return {
            textContent,
            hidden: false,
            classList: {
                toggle(name, enabled) {
                    if (enabled) classes.add(name);
                    else classes.delete(name);
                },
                contains: name => classes.has(name)
            }
        };
    };
    const roles = [
        makeOption('Authentication Administrator Tier 1'),
        makeOption('Global Administrator Tier 0'),
        makeOption('Éxchange Administrator Tier 1')
    ];
    const status = { textContent: '' };
    const builder = {
        querySelectorAll: selector => selector === '.custom-role-option' ? roles : [],
        querySelector: selector => selector === '#custom-role-search-status' ? status : null
    };
    const page = new BaselinePage({ isConnected: false });

    assert.equal(page.filterCustomRoles(builder, 'auth'), 1);
    assert.deepEqual(roles.map(role => role.hidden), [false, true, true]);
    assert.equal(roles[1].classList.contains('role-search-hidden'), true);
    assert.equal(status.textContent, '1 of 3 roles match “auth”');

    assert.equal(page.filterCustomRoles(builder, 'exchange'), 1, 'search should ignore accents');
    assert.deepEqual(roles.map(role => role.hidden), [true, true, false]);

    assert.equal(page.filterCustomRoles(builder, ''), 3);
    assert.deepEqual(roles.map(role => role.hidden), [false, false, false]);
    assert.equal(status.textContent, 'Showing all 3 roles');
});
