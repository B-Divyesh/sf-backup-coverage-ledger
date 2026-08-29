import { readFile } from 'node:fs/promises';
import { expect, test, type Download, type Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

const DEMO_KEY = 'demo:backup-coverage-ledger:v1';
const REAL_KEY = 'backup-coverage-ledger:v1';

async function openDemo(page: Page): Promise<void> {
  await page.goto('/?demo=1');
  await expect(page.getByLabel('Demo mode')).toBeVisible();
  await expect(page.locator('[data-record-id]')).toHaveCount(5);
}

async function downloadText(download: Download): Promise<string> {
  return readFile(await download.path(), 'utf8');
}

async function expectNoAccountOrBillingControls(page: Page): Promise<void> {
  await expect(page.locator('input[type="password"], input[autocomplete*="username" i], input[autocomplete*="cc-" i], input[name*="password" i], input[name*="token" i], input[name*="credential" i], input[name*="card" i], input[name*="payment" i]')).toHaveCount(0);
  const controls = (await page.locator('a, button, input, select, textarea').allTextContents()).join(' ');
  expect(controls).not.toMatch(/\b(sign in|log in|create account|subscribe|checkout|payment|billing|upgrade|paywall)\b/i);
}

async function addSampleAsset(page: Page, asset: string): Promise<void> {
  await page.getByRole('button', { name: 'Add asset' }).click();
  await page.getByLabel('Asset or data set *').fill(asset);
  await page.getByLabel('Accountable owner *').fill('Operations');
  await page.getByLabel('Backup target *').fill('Encrypted archive');
  await page.getByLabel('Recovery location *').fill('Operations runbook');
  await page.getByLabel('Restore steps *').fill('Restore a representative sample in isolation.');
  await page.getByRole('button', { name: 'Save asset' }).click();
  await expect(page.getByRole('heading', { name: asset })).toBeVisible();
}

test('@claim:demo-isolation keeps sample changes away from the real ledger and resets them', async ({ page }) => {
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: REAL_KEY, value: JSON.stringify({ version: 1, records: [{ id: 'real-private', asset: 'Real private database', owner: 'Real team', criticality: 'critical', backupTarget: 'Real vault', recoveryLocation: 'Real runbook', retention: '', extractionMethod: 'Real restore', lastProofDate: '', proofNotes: '', proofCadenceDays: 30, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' }] }) });
  await openDemo(page);
  await page.getByRole('button', { name: 'Edit Customer database' }).click();
  await page.getByLabel('Asset or data set *').fill('Changed demo database');
  await page.getByRole('button', { name: 'Save asset' }).click();
  await expect(page.getByRole('heading', { name: 'Changed demo database' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('Customer database')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Changed demo database' })).toHaveCount(0);
  const realBefore = await page.evaluate((key) => localStorage.getItem(key), REAL_KEY);
  expect(realBefore).toContain('Real private database');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page.getByText('Real private database')).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), DEMO_KEY)).toBeNull();
});

test('@claim:ledger-fields renders and persists every recorded field in demo storage', async ({ page }) => {
  await openDemo(page);
  const record = page.locator('[data-record-id="demo-customer-db"]');
  await expect(record).toContainText('Customer database');
  await expect(record).toContainText('Platform team');
  await expect(record).toContainText('Encrypted object storage');
  await expect(record).toContainText('Operations runbook §4');
  await expect(record).toContainText('Restore the latest snapshot');
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || '{}'), DEMO_KEY);
  expect(stored.records[0]).toMatchObject({ id: 'demo-customer-db', retention: '30 daily, 12 monthly', proofCadenceDays: 30 });
  await page.reload();
  await expect(page.locator('[data-record-id="demo-customer-db"]')).toBeVisible();
});

test('@claim:missing-fields names missing coverage fields', async ({ page }) => {
  await openDemo(page);
  const gap = page.locator('[data-record-id="demo-dns-zones"]');
  await expect(gap).toContainText('Coverage gap');
  await expect(gap).toContainText('Missing owner, recovery location');
});

test('@claim:proof-statuses shows current, due, unproven, expired, and gap states', async ({ page }) => {
  await openDemo(page);
  for (const status of ['Proof current', 'Proof due soon', 'Never proven', 'Proof expired', 'Coverage gap']) await expect(page.getByText(status, { exact: true })).toHaveCount(1);
});

test('@claim:local-only keeps a complete demo flow same-origin and in demo storage', async ({ page }) => {
  const requests: string[] = []; page.on('request', (request) => requests.push(request.url()));
  await openDemo(page);
  await page.getByRole('button', { name: 'Record restore proof' }).first().click();
  await page.getByLabel('What was restored and checked? *').fill('Restored and opened ten sample rows.');
  await page.getByRole('button', { name: 'Record proof' }).click();
  const download = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export CSV' }).click(); await download;
  await page.reload();
  expect(await page.evaluate((key) => localStorage.getItem(key), DEMO_KEY)).toContain('Restored and opened ten sample rows');
  expect(await page.evaluate((key) => localStorage.getItem(key), REAL_KEY)).toBeNull();
  expect(requests.every((url) => new URL(url).origin === new URL(page.url()).origin)).toBe(true);
});

test('@claim:csv-roundtrip exports stable IDs and reimports without duplicates', async ({ page }) => {
  await openDemo(page);
  const event = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export CSV' }).click(); const text = await downloadText(await event);
  expect(text.split('\n')[0]).toContain('id,asset'); expect(text).toContain('demo-customer-db');
  await page.locator('#import-file').setInputFiles({ name: 'ledger.csv', mimeType: 'text/csv', buffer: Buffer.from(text) });
  await expect(page.getByText(/0 new.*0 newer.*5 unchanged.*0 conflicting/)).toBeVisible();
  await page.getByRole('button', { name: 'Merge file' }).click();
  await expect(page.locator('[data-record-id]')).toHaveCount(5);
});

test('@claim:yaml-roundtrip exports stable IDs and reimports flat YAML', async ({ page }) => {
  await openDemo(page);
  const event = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export YAML' }).click(); const text = await downloadText(await event);
  expect(text).toContain('id: "demo-customer-db"'); expect(text).toContain('records:');
  await page.locator('#import-file').setInputFiles({ name: 'ledger.yaml', mimeType: 'application/yaml', buffer: Buffer.from(text) });
  await expect(page.getByText(/5 unchanged/)).toBeVisible();
  await page.getByRole('button', { name: 'Merge file' }).click();
  await expect(page.locator('[data-record-id]')).toHaveCount(5);
});

test('@claim:portable-import imports CSV and YAML and rejects unsupported nested YAML', async ({ page }) => {
  await openDemo(page);
  const csv = 'id,asset,owner,criticality,backupTarget,recoveryLocation,retention,extractionMethod,lastProofDate,proofNotes,proofCadenceDays,createdAt,updatedAt\nnew-csv,Incident archive,SRE,routine,Archive,Runbook,,Download sample,,,30,2026-01-01T00:00:00.000Z,2026-01-01T00:00:00.000Z\n';
  await page.locator('#import-file').setInputFiles({ name: 'new.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) }); await page.getByRole('button', { name: 'Merge file' }).click(); await expect(page.getByText('Incident archive')).toBeVisible();
  const yaml = 'records:\n  - id: "new-yaml"\n    asset: "Audit export"\n    owner: "Security"\n    criticality: "routine"\n    backupTarget: "Archive"\n    recoveryLocation: "Runbook"\n    extractionMethod: "Open sample"\n    proofCadenceDays: "30"\n';
  await page.locator('#import-file').setInputFiles({ name: 'new.yaml', mimeType: 'application/yaml', buffer: Buffer.from(yaml) }); await page.getByRole('button', { name: 'Merge file' }).click(); await expect(page.getByText('Audit export')).toBeVisible();
  await page.locator('#import-file').setInputFiles({ name: 'nested.yaml', mimeType: 'application/yaml', buffer: Buffer.from('records:\n  - asset: Thing\n    nested:\n      key: value') });
  await expect(page.getByText(/Import failed: Unsupported YAML line/)).toBeVisible();
});

test('@claim:restore-drill builds an asset-specific printable checklist', async ({ page }) => {
  await openDemo(page); await page.getByRole('link', { name: 'Restore drill' }).click();
  await expect(page).toHaveURL(/\/drill\?demo=1/); await expect(page.getByRole('heading', { name: 'Restore checklist' })).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'Customer database' })).toContainText('Restore the latest snapshot');
  await expect(page.getByRole('article')).toHaveCount(5);
});

test('@claim:offline-reload reloads the populated demo after the first visit', async ({ page, context }) => {
  await openDemo(page); await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.waitForFunction(async () => {
    const keys = await caches.keys();
    const requests = keys.length ? await (await caches.open(keys[0]!)).keys() : [];
    return requests.some((request) => request.url.endsWith('.js')) && requests.some((request) => request.url.endsWith('.css'));
  });
  await page.reload();
  await expect(page.getByText('Customer database')).toBeVisible();
  await context.setOffline(true); await page.reload();
  await expect(page.getByText('Customer database')).toBeVisible(); await expect(page.getByText('Local · offline')).toBeVisible();
  await context.setOffline(false);
});

test('@claim:import-limit accepts 2000000 bytes and rejects 2000001 bytes', async ({ page }) => {
  await openDemo(page);
  const base = 'records:\n  - asset: "Sized file"\n    owner: "Ops"\n    backupTarget: "Archive"\n    recoveryLocation: "Runbook"\n    extractionMethod: "Open sample"\n';
  const exact = Buffer.from(`${base}#${'x'.repeat(2_000_000 - Buffer.byteLength(base) - 1)}`);
  expect(exact.byteLength).toBe(2_000_000);
  await page.locator('#import-file').setInputFiles({ name: 'exact.yaml', mimeType: 'application/yaml', buffer: exact }); await expect(page.getByRole('heading', { name: 'Review file changes' })).toBeVisible(); await page.getByRole('button', { name: 'Cancel' }).last().click();
  await page.locator('#import-file').setInputFiles({ name: 'large.yaml', mimeType: 'application/yaml', buffer: Buffer.concat([exact, Buffer.from('x')]) });
  await expect(page.getByText('Import failed: The file is larger than 2 MB. Split it into smaller ledgers.')).toBeVisible();
});

test('@claim:portable-schema exports IDs, enum values, ISO dates, and intervals from 1 to 3650 days', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: 'Edit Customer database' }).click();
  await expect(page.getByLabel('Criticality *').locator('option')).toHaveText(['Critical', 'Important', 'Routine']);
  await expect(page.getByLabel('Proof interval (days) *')).toHaveAttribute('min', '1');
  await expect(page.getByLabel('Proof interval (days) *')).toHaveAttribute('max', '3650');
  await page.getByRole('button', { name: 'Cancel' }).first().click();
  const event = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export CSV' }).click(); const text = await downloadText(await event);
  expect(text.split('\n')[0]).toBe('id,asset,owner,criticality,backupTarget,recoveryLocation,retention,extractionMethod,lastProofDate,proofNotes,proofCadenceDays,createdAt,updatedAt');
  expect(text).toMatch(/,critical,.*\d{4}-\d{2}-\d{2},/);
  const invalid = 'asset,owner,backupTarget,recoveryLocation,extractionMethod,proofCadenceDays\nBad,Ops,Vault,Guide,Open,3651';
  await page.locator('#import-file').setInputFiles({ name: 'bad.csv', mimeType: 'text/csv', buffer: Buffer.from(invalid) });
  await expect(page.getByText(/invalid proofCadenceDays/)).toBeVisible();
});

test('@claim:privacy-runtime loads no analytics, advertising, remote fonts, accounts, or third-party scripts', async ({ page }) => {
  const requests: string[] = []; page.on('request', (request) => requests.push(request.url())); await openDemo(page);
  const remoteElements = await page.locator('script[src^="http"], link[rel="stylesheet"][href^="http"], link[rel="preload"][href^="http"]').evaluateAll((nodes) => nodes.map((node) => node.outerHTML));
  expect(remoteElements).toEqual([]); expect(requests.every((url) => new URL(url).origin === new URL(page.url()).origin)).toBe(true);
  expect(await page.locator('script[src*="analytics" i], script[src*="advert" i], script[src*="font" i], iframe, [data-ad], [id*="advert" i], [class*="advert" i]').count()).toBe(0);
  await expectNoAccountOrBillingControls(page);
});

test('@claim:free completes every feature class with no account, subscription, or paid tier', async ({ page }) => {
  const requests: Array<{ url: string; method: string }> = [];
  page.on('request', (request) => requests.push({ url: request.url(), method: request.method() }));
  await openDemo(page);
  await addSampleAsset(page, 'Free feature sample');
  await page.getByRole('button', { name: 'Record restore proof' }).first().click();
  await page.getByLabel('What was restored and checked? *').fill('Restored and opened a representative sample.');
  await page.getByRole('button', { name: 'Record proof' }).click();
  const exportEvent = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export CSV' }).click();
  const csv = await downloadText(await exportEvent);
  await page.locator('#import-file').setInputFiles({ name: 'sample.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  await page.getByRole('button', { name: 'Merge file' }).click();
  await page.getByRole('link', { name: 'Restore drill' }).click();
  await expect(page.getByRole('heading', { name: 'Restore checklist' })).toBeVisible();
  await page.goBack();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('[data-record-id]')).toHaveCount(5);
  await expectNoAccountOrBillingControls(page);
  expect(requests.every(({ url, method }) => method === 'GET' && new URL(url).origin === new URL(page.url()).origin && !/billing|checkout|payment|subscription|account/i.test(url))).toBe(true);
});

test('@claim:safety-boundary runs ledger flows without credential controls or backup-system requests', async ({ page }) => {
  const requests: Array<{ url: string; method: string }> = [];
  page.on('request', (request) => requests.push({ url: request.url(), method: request.method() }));
  await openDemo(page);
  await page.getByRole('button', { name: 'Add asset' }).click();
  await expect(page.locator('input[type="password"], input[name*="credential" i], input[name*="token" i], textarea[name*="credential" i], textarea[name*="token" i]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Cancel' }).first().click();
  await addSampleAsset(page, 'Safety feature sample');
  const csv = 'asset,owner,criticality,backupTarget,recoveryLocation,retention,extractionMethod,lastProofDate,proofNotes,proofCadenceDays\nSafety sample,Ops,routine,Archive,Runbook,,Open a representative sample,,,30';
  await page.locator('#import-file').setInputFiles({ name: 'safety.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  await page.getByRole('button', { name: 'Merge file' }).click();
  await page.getByRole('button', { name: 'Record restore proof' }).first().click();
  await page.getByLabel('What was restored and checked? *').fill('Opened a representative sample.');
  await page.getByRole('button', { name: 'Record proof' }).click();
  await page.getByRole('link', { name: 'Restore drill' }).click();
  await expect(page.getByRole('heading', { name: 'Restore checklist' })).toBeVisible();
  expect(requests.every(({ url, method }) => method === 'GET' && new URL(url).origin === new URL(page.url()).origin && !/api|backup-system|credentials|token/i.test(url))).toBe(true);
});

test('@claim:merge-import compares additions, updates, unchanged rows, conflicts, replacement, and undo', async ({ page }) => {
  await openDemo(page);
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || '{}').records, DEMO_KEY) as Array<Record<string, string | number>>;
  const rows: Array<Record<string, string | number>> = [
    { ...stored[0], owner: 'Updated platform', updatedAt: '2099-01-01T00:00:00.000Z' },
    { ...stored[1] },
    { ...stored[2], owner: 'Imported support', updatedAt: '2000-01-01T00:00:00.000Z' },
    { ...stored[3] },
    { id: 'new-asset', asset: 'New archive', owner: 'Ops', criticality: 'routine', backupTarget: 'Vault', recoveryLocation: 'Guide', retention: '', extractionMethod: 'Open it', lastProofDate: '', proofNotes: '', proofCadenceDays: 30, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' }
  ];
  const columns = ['id','asset','owner','criticality','backupTarget','recoveryLocation','retention','extractionMethod','lastProofDate','proofNotes','proofCadenceDays','createdAt','updatedAt'];
  const cell = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const csv = `${columns.join(',')}\n${rows.map((row) => columns.map((key) => cell(row[key])).join(',')).join('\n')}\n`;
  await page.locator('#import-file').setInputFiles({ name: 'merge.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  await expect(page.getByText(/1 new.*1 newer.*2 unchanged.*1 conflicting/)).toBeVisible();
  await page.getByLabel('Support ticket export changed in both ledgers').selectOption('imported'); await page.getByRole('button', { name: 'Merge file' }).click();
  await expect(page.locator('[data-record-id]')).toHaveCount(6); await expect(page.getByText('Owner · Updated platform')).toBeVisible(); await expect(page.getByText('Owner · Imported support')).toBeVisible();
  await page.getByRole('button', { name: 'Undo' }).click(); await expect(page.locator('[data-record-id]')).toHaveCount(5); await expect(page.getByText('Owner · Platform team')).toBeVisible();
  await page.locator('#import-file').setInputFiles({ name: 'merge.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) }); await page.getByRole('button', { name: 'Replace ledger' }).click(); await expect(page.locator('[data-record-id]')).toHaveCount(5); await expect(page.getByText('New archive')).toBeVisible();
  await page.getByRole('button', { name: 'Undo' }).click(); await expect(page.getByText('Payroll archive')).toBeVisible();
});
