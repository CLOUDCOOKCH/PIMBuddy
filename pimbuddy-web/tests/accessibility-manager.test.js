import assert from 'node:assert/strict';
import test from 'node:test';

import { AccessibilityManager } from '../src/core/AccessibilityManager.js';

test('focus management ignores focus events from non-Element targets', () => {
    const originalDocument = globalThis.document;
    const originalWindow = globalThis.window;
    let focusHandler;

    globalThis.document = {
        addEventListener(type, handler) {
            if (type === 'focus') focusHandler = handler;
        }
    };
    globalThis.window = { addEventListener() {} };

    try {
        new AccessibilityManager().setupFocusManagement();

        assert.doesNotThrow(() => focusHandler({ target: globalThis.document }));
        assert.doesNotThrow(() => focusHandler({ target: globalThis.window }));
        assert.doesNotThrow(() => focusHandler({ target: null }));
    } finally {
        globalThis.document = originalDocument;
        globalThis.window = originalWindow;
    }
});

test('focus management still labels unlabeled buttons', () => {
    const originalDocument = globalThis.document;
    const originalWindow = globalThis.window;
    let focusHandler;
    const attributes = new Map();
    const button = {
        textContent: ' Build baseline ',
        matches: selector => selector === 'button:not([aria-label]):not([title])',
        setAttribute: (name, value) => attributes.set(name, value)
    };

    globalThis.document = {
        addEventListener(type, handler) {
            if (type === 'focus') focusHandler = handler;
        }
    };
    globalThis.window = { addEventListener() {} };

    try {
        new AccessibilityManager().setupFocusManagement();
        focusHandler({ target: button });

        assert.equal(attributes.get('aria-label'), 'Build baseline');
    } finally {
        globalThis.document = originalDocument;
        globalThis.window = originalWindow;
    }
});
