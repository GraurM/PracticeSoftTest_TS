import { test, expect } from '@playwright/test';
import { HomePage } from '../../../src/ui/pages/HomePage';

test.describe('Visual - Homepage', () => {
  test('Header and navigation visual baseline', async ({ page }) => {
    await test.step('Open homepage and wait for stable state', async () => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('main')).toHaveCount(1);
    });

    await test.step('Capture homepage baseline screenshot', async () => {
      await expect(page).toHaveScreenshot('home-page.png');
    });
  });
});

test.describe('Visual - ProductPage', () => {
  test('Product page visual baseline', async ({ page }) => {
    const homePage = new HomePage(page);
    await test.step('Search product and wait for stable results', async () => {
      await homePage.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await homePage.header.search('Skinsheen');
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByRole('heading', { name: 'search results' })).toHaveCount(1);
    });

    await test.step('Capture product results baseline screenshot', async () => {
      await expect(page).toHaveScreenshot('product-page.png');
    });
  });
})
