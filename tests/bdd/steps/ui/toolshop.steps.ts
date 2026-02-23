import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from '../../support/world';
import { assert } from 'console';

/**
 * Validates that EntityManager is initialized
 */
const ensureEntityManager = (world: CustomWorld) => {
  if (!world.entityManager) {
    throw new Error('EntityManager is not initialized');
  }
  return world.entityManager;
};

Given('Open the toolshop home page', async function (this: CustomWorld) {
  const entityManager = ensureEntityManager(this);
  const homePage = entityManager.getHomePage();
  await homePage.goto('/');
  // const isLoaded = await homePage.isPageLoaded();
  // if (!isLoaded) {
  //   throw new Error('Home page did not load successfully');
  // }
});

When('Search for {string}', async function (this: CustomWorld, term: string) {
  const entityManager = ensureEntityManager(this);
  const homePage = entityManager.getHomePage();
  
  // Store the search term in context for later validation
  this.testContext.setSearchTerm(term);
  await homePage.search(term);
});

When('Open the product details for {string}', async function (this: CustomWorld, name: string) {
  const entityManager = ensureEntityManager(this);
  const homePage = entityManager.getHomePage();
  const page = entityManager.getPage();
  
  // Store the selected product name in context
  this.testContext.setSelectedProductName(name);
  await homePage.openProduct(name);
  await expect(page).toHaveURL(/\/product\//);
});

When('Add the product to the cart', async function (this: CustomWorld) {
  const entityManager = ensureEntityManager(this);
  const productPage = entityManager.getProductPage();
  await productPage.addToCart();
});

When('Filter by category {string}', async function (this: CustomWorld, category: string) {
  const entityManager = ensureEntityManager(this);
  const homePage = entityManager.getHomePage();
  await homePage.filterByCategory(category);
});

When('Filter by brand {string}', async function (this: CustomWorld, brand: string) {
  const entityManager = ensureEntityManager(this);
  const homePage = entityManager.getHomePage();
  await homePage.filterByBrand(brand);
});

Then('search results include {string}', async function (this: CustomWorld, name: string) {
  const entityManager = ensureEntityManager(this);
  const homePage = entityManager.getHomePage();
  
  // Check that products matching the name exist
  const products = homePage.productCards(name);
  await expect(products).not.toHaveCount(0);
});

Then('the product page shows {string}', async function (this: CustomWorld, name: string) {
  const entityManager = ensureEntityManager(this);
  const productPage = entityManager.getProductPage();
  await expect(productPage.productHeading).toContainText(name);
});

Then('the product page stays open', async function (this: CustomWorld) {
  const entityManager = ensureEntityManager(this);
  const page = entityManager.getPage();
  await expect(page).toHaveURL(/\/product\//);
});

Then('search results are shown', async function (this: CustomWorld) {
  const entityManager = ensureEntityManager(this);
  const homePage = entityManager.getHomePage();
  await expect(homePage.productCards()).not.toHaveCount(0);
});
