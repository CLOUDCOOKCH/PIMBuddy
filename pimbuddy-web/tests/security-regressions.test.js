import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('baseline search results do not interpolate Graph data into inline handlers', async () => {
    const source = await readFile(new URL('../src/pages/BaselinePage.js', import.meta.url), 'utf8');

    assert.doesNotMatch(source, /user-search-result[^>]+onclick=/);
    assert.match(source, /querySelectorAll\('\.user-search-result'\)/);
    assert.match(source, /addEventListener\('click'/);
});

test('PWA entry points are deployment-base relative', async () => {
    const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
    const manifest = JSON.parse(await readFile(new URL('../public/manifest.json', import.meta.url), 'utf8'));

    assert.match(html, /href="\.\/manifest\.json"/);
    assert.match(html, /register\('\.\/sw\.js'\)/);
    assert.equal(manifest.start_url, './');
    assert.equal(manifest.scope, './');
    assert.ok(manifest.icons.every(icon => icon.src.startsWith('./')));
});

test('sign in uses only the manually configured app registration', async () => {
    const appSource = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
    const authSource = await readFile(new URL('../src/services/authService.js', import.meta.url), 'utf8');

    assert.doesNotMatch(appSource, /bootstrapService|runBootstrap|bootstrapLogin/);
    assert.doesNotMatch(authSource, /bootstrapService|runBootstrap|bootstrapLogin/);
    assert.match(appSource, /localStorage\.setItem\('pimbuddy-app-config'/);
    assert.match(authSource, /this\.msalInstance\.loginPopup/);
});
