import { test, expect } from '@playwright/test';
import { HomePage } from '../../../src/ui/pages/HomePage';

test.describe('Visual - Homepage', () => {
  test('Header and navigation visual baseline', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveScreenshot('home-page.png');
  });
});

test.describe('Visual - ProductPage', () => {
  test('Product page visual baseline', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto('/');
    await homePage.header.search('Skinsheen');
    
    await expect(page).toHaveScreenshot('product-page.png');
  }
);
})
