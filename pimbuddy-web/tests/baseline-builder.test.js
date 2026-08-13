import assert from 'node:assert/strict';
import test from 'node:test';

import { baselineService } from '../src/services/baselineService.js';
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
