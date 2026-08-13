import assert from 'node:assert/strict';
import test from 'node:test';

import { baselineService } from '../src/services/baselineService.js';

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
