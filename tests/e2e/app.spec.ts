import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('creates a record, records proof, persists it, and builds a drill', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Track backup coverage and restore tests');
  await page.getByRole('button', { name: 'Add first asset' }).first().click();
  await page.getByLabel('Asset or data set *').fill('Production database');
  await page.getByLabel('Accountable owner *').fill('Platform team');
  await page.getByLabel('Backup target *').fill('Encrypted object store');
  await page.getByLabel('Recovery location *').fill('Runbook section 4');
  await page.getByLabel('Restore steps *').fill('Restore into an isolated PostgreSQL instance');
  await page.getByRole('button', { name: 'Save asset' }).click();

  const record = page.getByRole('article').filter({ hasText: 'Production database' });
  await expect(record).toContainText('Never proven');
  await record.getByRole('button', { name: 'Record restore proof' }).click();
  await page.getByLabel('What was restored and checked? *').fill('Restored a sample and opened ten current rows.');
  await page.getByRole('button', { name: 'Record proof' }).click();
  await expect(record).toContainText('Proof current');

  await page.reload();
  await expect(page.getByText('Production database')).toBeVisible();
  await page.getByRole('link', { name: 'Restore drill' }).click();
  await expect(page).toHaveURL(/\/drill$/);
  await expect(page.getByRole('heading', { name: 'Restore checklist' })).toBeVisible();
  await expect(page.getByText('Restore into an isolated PostgreSQL instance')).toBeVisible();
  expect(errors).toEqual([]);
});

test('all routes and states have no serious accessibility violations', async ({ page }) => {
  for (const route of ['/', '/?demo=1', '/drill?demo=1', '/privacy', '/terms', '/missing-route']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  }
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  const darkResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(darkResults.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
});

test('mobile view fits without horizontal page overflow and keyboard focus is visible', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile project only');
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.keyboard.press('Tab');
  await expect(page.getByText('Skip to main content')).toBeFocused();
  await expect(page.getByRole('link', { name: 'Try it with sample data' }).first()).toBeInViewport();
});

test('route navigation updates title, canonical URL, focus, announcements, and browser history', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await expect(page).toHaveTitle('Privacy — Backup Coverage Ledger');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://backup-coverage-ledger.sociobot.in/privacy');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Privacy page loaded');
  await page.goBack();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: 'Track backup coverage and restore tests' })).toBeFocused();
});

test('demo and unknown routes have their own titles, metadata, and page content', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Backup Coverage Ledger');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://backup-coverage-ledger.sociobot.in/?demo=1');
  await page.goto('/not-a-ledger-page');
  await expect(page).toHaveTitle('Page not found — Backup Coverage Ledger');
  await expect(page.getByRole('heading', { name: 'That ledger page is missing' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return to the ledger' })).toBeVisible();
});

test('keyboard dialog flow traps focus, closes with Escape, and restores its trigger', async ({ page }) => {
  await page.goto('/?demo=1');
  const trigger = page.getByRole('button', { name: 'Edit Customer database' });
  await trigger.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByLabel('Asset or data set *')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('calculates the 30-day goal from critical assets only and names the no-critical state', async ({ page }) => {
  const today = new Date().toISOString().slice(0, 10);
  const csv = [
    'asset,owner,criticality,backupTarget,recoveryLocation,retention,extractionMethod,lastProofDate,proofNotes,proofCadenceDays',
    `Customer database,Platform,critical,Object store,Runbook,30 days,Restore sample,${today},Opened sample,30`,
    'Old reports,Operations,routine,Archive bucket,Runbook,365 days,Download report,,,30'
  ].join('\n');
  await page.goto('/');
  await page.locator('#import-file').setInputFiles({ name: 'mixed-criticality.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  await page.getByRole('button', { name: 'Merge file' }).click();
  const summary = page.getByLabel('Coverage summary');
  await expect(summary).toContainText('Critical assets proved in 30 days');
  await expect(summary).toContainText('100%');
  await expect(summary).toContainText('Target met');

  const routineOnly = [
    'asset,owner,criticality,backupTarget,recoveryLocation,retention,extractionMethod,lastProofDate,proofNotes,proofCadenceDays',
    'Archived reports,Operations,routine,Archive bucket,Runbook,365 days,Download report,,,30'
  ].join('\n');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator('#import-file').setInputFiles({ name: 'routine-only.csv', mimeType: 'text/csv', buffer: Buffer.from(routineOnly) });
  await page.getByRole('button', { name: 'Merge file' }).click();
  await expect(page.getByLabel('Coverage summary')).toContainText('No critical assets listed');
});

test('rejects invalid portable proof dates before they can enter the ledger', async ({ page }) => {
  const header = 'asset,owner,criticality,backupTarget,recoveryLocation,retention,extractionMethod,lastProofDate,proofNotes,proofCadenceDays';
  const row = 'Customer database,Platform,critical,Object store,Runbook,30 days,Restore sample';
  await page.goto('/');
  const invalidDates: Array<[string, string]> = [['bad-date.csv', 'not-a-date'], ['impossible-date.csv', '2026-02-30']];
  for (const [name, date] of invalidDates) {
    const csv = `${header}\n${row},${date},Opened sample,30`;
    await page.locator('#import-file').setInputFiles({ name, mimeType: 'text/csv', buffer: Buffer.from(csv) });
    await expect(page.getByText(/Import failed: Row 2 has an invalid lastProofDate/)).toBeVisible();
    await expect(page.getByText('Customer database')).toHaveCount(0);
  }
  await expect(page.getByText('Infinity days since proof')).toHaveCount(0);
});
