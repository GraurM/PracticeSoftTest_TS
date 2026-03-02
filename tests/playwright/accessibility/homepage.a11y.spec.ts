import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';
import { HomePage } from '../../../src/ui/pages/HomePage';
import { AccountLoginPage } from '../../../src/ui/pages/AccountLoginPage';

test.describe('Accessibility - Core pages', () => {
 test('Homepage should not have accessibility violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

  test('Account login page accessibility', async ({ page }) => {
    const accountLoginPage = new AccountLoginPage(page);
    await accountLoginPage.goto('/index.php?rt=account/login');

    const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
  });
});
