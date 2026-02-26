import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from '../../support/world';

/**
 * Validates that EntityManager is initialized
 */
const ensureEntityManager = (world: CustomWorld) => {
  if (!world.entityManager) {
    throw new Error('EntityManager is not initialized');
  }
  return world.entityManager;
};

Given('Open the Automation Test Store home page', async function (this: CustomWorld) {
  const entityManager = ensureEntityManager(this);
  const homePage = entityManager.getHomePage();
  await homePage.navigate();
});

When('Search for {string}', async function (this: CustomWorld, term: string) {
  const entityManager = ensureEntityManager(this);
  const homePage = entityManager.getHomePage();

  this.testContext.setSearchTerm(term);
  await homePage.header.search(term);
});

When('Add the product to cart', async function (this: CustomWorld) {
  const entityManager = ensureEntityManager(this);
  const productPage = entityManager.getProductPage();

  await productPage.addToCartButton.click();
});

Then('search results include a product', async function (this: CustomWorld) {
  const entityManager = ensureEntityManager(this);
  const page = entityManager.getProductPage();
  const title: string = this.testContext.getSearchTerm()!;
  await expect(page.productTitle).toBeVisible();
  await expect(page.productTitle).toContainText(title, { ignoreCase: true });
});

Then('the product is added to the cart', async function (this: CustomWorld) {
  const entityManager = ensureEntityManager(this);
  const cartPage = entityManager.getCartPage();

  await expect(cartPage.getPage()).toHaveURL(/checkout\/cart/);
  const itemCount = await cartPage.getCartItemCount();
  expect(itemCount).toBeGreaterThan(0);
});

When('click the Checkout button', async function (this: CustomWorld) {
  const entityManager = ensureEntityManager(this);
  const cartPage = entityManager.getCartPage();

  await expect(cartPage.getPage()).toHaveURL(/checkout\/cart/);
  await cartPage.proceedToCheckout();
});

Then('the Account Login page is displayed', async function (this: CustomWorld) {
  const entityManager = ensureEntityManager(this);
  const page = entityManager.getAccountLoginPage();

  await expect(page.getPage()).toHaveURL(/account\/login/);
  await expect(page.getPageTitle()).toBeVisible();
  await expect(page.getPageTitle()).toHaveText('Account Login', { ignoreCase: true });
});

Then('user is asked to authenticate or create an account', async function (this: CustomWorld) {
  const entityManager = ensureEntityManager(this);
  const page = entityManager.getAccountLoginPage();

  await expect(page.newCustomerFrame.pageTitle).toBeVisible();
  await expect(page.newCustomerFrame.pageTitle).toHaveText('I am a new customer.', { ignoreCase: true });
  await expect(page.returningCustomerFrame.pageTitle).toBeVisible();
  await expect(page.returningCustomerFrame.pageTitle).toHaveText('Returning Customer', { ignoreCase: true });
});

Then('the cart page displays with the product', async function (this: CustomWorld) {
  const entityManager = ensureEntityManager(this);
  const cartPage = entityManager.getCartPage();

  await expect(cartPage.getPage()).toHaveURL(/checkout\/cart/);
  const itemCount = await cartPage.getCartItemCount();
  expect(itemCount).toBeGreaterThan(0);
});
