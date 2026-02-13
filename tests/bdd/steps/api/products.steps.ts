import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from '../../support/world';
import { ProductDtoMapper } from '../../../../src/api/dto/ProductDto';

/**
 * Validates that EntityManager is initialized
 */
const ensureEntityManager = (world: CustomWorld) => {
  if (!world.entityManager) {
    throw new Error('EntityManager is not initialized');
  }
  return world.entityManager;
};

Given('Product API is available', async function (this: CustomWorld) {
  const entityManager = ensureEntityManager(this);
  // Ensure API is available and initialized
  expect(entityManager.getProductsApi()).toBeDefined();
});

When('Request product list', async function (this: CustomWorld) {
  const entityManager = ensureEntityManager(this);
  const api = entityManager.getProductsApi();
  const response = await api.getProducts();
  const data = await response.json();
  
  // Map response to ProductDto array
  const products = ProductDtoMapper.toProductList(data);

  // Store API response and typed data in context
  this.testContext.setApiResponse(response);
  this.testContext.setApiData(data);
  this.testContext.setProducts(products);
});

When('Request product details by stored id', async function (this: CustomWorld) {
  const entityManager = ensureEntityManager(this);
  const productId = this.testContext.getProductId();

  if (!productId) {
    throw new Error('Product id was not stored from previous step.');
  }

  const api = entityManager.getProductsApi();
  const response = await api.getProductById(productId);
  const data = await response.json();
  
  // Map response to ProductDto
  const product = ProductDtoMapper.toProduct(data);

  // Store response and typed product data in context
  this.testContext.setApiResponse(response);
  this.testContext.setProduct(product);
});

Then('API response status is {int}', async function (this: CustomWorld, status: number) {
  const response = this.testContext.getApiResponse();
  
  if (!response) {
    throw new Error('API response is not available.');
  }

  expect(response.status()).toBe(status);
});

Then('Response includes products', async function (this: CustomWorld) {
  const products = this.testContext.getProducts() ?? [];
  expect(products.length).toBeGreaterThan(0);
});

Then('Store first product id', async function (this: CustomWorld) {
  const products = this.testContext.getProducts() ?? [];
  const [first] = products;
  
  if (!first) {
    throw new Error('No products found in the response.');
  }
  
  const productId = ProductDtoMapper.getProductId(first);

  if (!productId) {
    throw new Error('Product id was not found in the product list response.');
  }

  this.testContext.setProductId(productId);
});

Then('Response product id matches stored id', async function (this: CustomWorld) {
  const storedId = this.testContext.getProductId();
  const product = this.testContext.getProduct();

  if (!storedId) {
    throw new Error('Product id is missing from stored context.');
  }
  
  if (!product) {
    throw new Error('Product is missing from response.');
  }
  
  const responseId = ProductDtoMapper.getProductId(product);

  if (!responseId) {
    throw new Error('Product id is missing from response.');
  }

  expect(responseId).toBe(storedId);
});
