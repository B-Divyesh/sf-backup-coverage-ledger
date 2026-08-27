import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('creates a record, records proof, persists it, and builds a drill', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Know what can/);
  await page.getByRole('button', { name: 'Add first asset' }).first().click();
  await page.getByLabel('Asset or data set *').fill('Production database');
  await page.getByLabel('Accountable owner *').fill('Platform team');
  await page.getByLabel('Backup target *').fill('Encrypted object store');
  await page.getByLabel('Recovery location *').fill('Runbook section 4');
  await page.getByLabel('Extraction method *').fill('Restore into an isolated PostgreSQL instance');
  await page.getByRole('button', { name: 'Save asset' }).click();

  const record = page.getByRole('article').filter({ hasText: 'Production database' });
  await expect(record).toContainText('Never proven');
  await record.getByRole('button', { name: 'Record restore proof' }).click();
  await page.getByLabel('What was extracted and checked? *').fill('Restored a sample and opened ten current rows.');
  await page.getByRole('button', { name: 'Record proof' }).click();
  await expect(record).toContainText('Proof current');

  await page.reload();
  await expect(page.getByText('Production database')).toBeVisible();
  await page.getByRole('link', { name: 'Restore drill' }).click();
  await expect(page.getByRole('heading', { name: 'Extraction checklist' })).toBeVisible();
  await expect(page.getByText('Restore into an isolated PostgreSQL instance')).toBeVisible();
  expect(errors).toEqual([]);
});

test('home and policy routes have no serious accessibility violations', async ({ page }) => {
  for (const route of ['/', '/privacy', '/terms']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  }
  await page.goto('/');
  await page.getByRole('button', { name: 'Use dark theme' }).click();
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
});
