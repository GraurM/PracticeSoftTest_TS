import { test, expect } from '@playwright/test';
import { HomePage } from '../../../src/ui/pages/HomePage';
import { assert } from 'console';
import { ProductPage } from '../../../src/ui/pages/ProductPage';

test.describe('Visual - Homepage', () => {
  test('Header and navigation visual baseline', async ({ page }) => {
    const homePage = new HomePage(page);
    await test.step('Open homepage and wait for stable state', async () => {
      await homePage.goto('/');
      await homePage.waitForPageLoad();
      assert(await homePage.isPageLoaded(), 'Homepage did not load successfully')
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
    await homePage.waitForPageLoad();
    await homePage.header.search('Skinsheen');
    const productPage = new ProductPage(page);
      await productPage.waitForPageLoad();
    });

    await test.step('Capture product results baseline screenshot', async () => {
      await expect(page).toHaveScreenshot('product-page.png');
    });
  });
})
