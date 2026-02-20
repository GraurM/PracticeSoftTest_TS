import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from '../../support/world';
import type {
 PaginatedProductResponse,
  ProductResponse,
  RelatedProductsResponse,
  ChangeProductResponse,
} from '../../../../src/api/data/response';
import { ProductFactory } from '../../../../src/api/data/factories/ProductFactory';
import { ProductService } from '../../../../src/api/service/ProductService';
import { BrandService } from '../../../../src/api/service/BrandService';
import { CategoryService } from '../../../../src/api/service/CategoryService';
import { UpdateProductRequest } from '../../../../src/api/data/request';
import { get } from 'http';
import { randomUUID } from 'crypto';

const ensureEntityManager = (world: CustomWorld) => {
  if (!world.entityManager) {
    throw new Error('EntityManager is not initialized');
  }
  return world.entityManager;
};

const getProductService = async (world: CustomWorld): Promise<ProductService> => {
  const entityManager = ensureEntityManager(world);
  return entityManager.getProductService();
};

const getBrandService = async (world: CustomWorld): Promise<BrandService> => {
  const entityManager = ensureEntityManager(world);
  return entityManager.getBrandService();
};

const getCategoryService = async (world: CustomWorld): Promise<CategoryService> => {
  const entityManager = ensureEntityManager(world);
  return entityManager.getCategoryService();
};

const validateProductStructure = (product: ProductResponse) => {
  expect(product).toHaveProperty('id');
  expect(product).toHaveProperty('name');
  expect(product).toHaveProperty('price');
  expect(product).toHaveProperty('in_stock');
  expect(product).toHaveProperty('description');
  expect(product).toHaveProperty('co2_rating');
  // Category and brand are optional in some responses, but id should be string
  expect(typeof product.id).toBe('string');
  expect(typeof product.name).toBe('string');
  expect(typeof product.price).toBe('number');
};

Given('Product API is available', async function (this: CustomWorld) {
  const service = await getProductService(this);
  expect(service).toBeDefined();
});

Given('Store first product from list', async function (this: CustomWorld) {
  const service = await getProductService(this);
  const data = await service.getProducts();

  expect(data.data).toBeDefined();
  expect(data.data.length).toBeGreaterThan(0);

  const firstProduct = data.data[0];
  this.testContext.setStoredProduct(firstProduct);
});

When('Request all products', async function (this: CustomWorld) {
  const service = await getProductService(this);
  const data = await service.getProducts();

  this.testContext.setApiData(data);
});

When('Request products filtered by valid category', async function (this: CustomWorld) {
  const service = await getProductService(this);
  const categoryId = (await getCategoryService(this).then(s => s.getRandomCategory())).id;
  const data = await service.getProducts({ by_category: categoryId });

  this.testContext.setApiData(data);
  this.testContext.setProductId(categoryId);
});

When('Request products filtered by valid brand', async function (this: CustomWorld) {
  const service = await getProductService(this);
  const brandId = (await getBrandService(this).then(s => s.getRandomBrand())).id;
  const data = await service.getProducts({ by_brand: brandId });

  this.testContext.setApiData(data);
  this.testContext.setProductId(brandId);
});

When('Request eco-friendly products only', async function (this: CustomWorld) {
  const service = await getProductService(this);
  const data = await service.getProducts({ eco_friendly: true });

  this.testContext.setApiData(data);
});

When('Request rental products only', async function (this: CustomWorld) {
  const service = await getProductService(this);
  const data = await service.getProducts({ is_rental: true });

  this.testContext.setApiData(data);
});

When('Request products in price range between {string} and {string}', async function (
  this: CustomWorld,
  minPrice: string,
  maxPrice: string
) {
  const service = await getProductService(this);
  const data = await service.getProducts({
    between: `${minPrice},${maxPrice}`,
  });

  this.testContext.setApiData(data);
});

When('Request products sorted by {string}', async function (
  this: CustomWorld,
  sortParam: string
) {
  const service = await getProductService(this);
  const data = await service.getProducts({ sort: sortParam });

  this.testContext.setApiData(data);
});

When('Request products with page {string}', async function (this: CustomWorld, page: string) {
  const service = await getProductService(this);
  const data = await service.getProducts({ page: parseInt(page) });

  this.testContext.setApiData(data);
});

// ========== WHEN STEPS - GET PRODUCT DETAILS ==========

When('Request product details by stored product ID', async function (this: CustomWorld) {
  const service = await getProductService(this);
  const productId = this.testContext.getStoredProduct()?.id;

  if (!productId) {
    throw new Error('Product ID was not stored from previous step');
  }

  const data = await service.getProductById(productId);
  this.testContext.setApiData(data);
});

When('Request product details for invalid ID {string}', async function (
  this: CustomWorld,
  invalidId: string
) {
  const service = await getProductService(this);
  try {
    const data = await service.getProductById(invalidId);
    this.testContext.setApiData(data);
  } catch (error: any) {
    this.testContext.setApiError(error?.message || 'Product not found');
  }
});

// ========== WHEN STEPS - SEARCH PRODUCTS ==========

When('Search products for {string}', async function (this: CustomWorld, searchTerm: string) {
  const service = await getProductService(this);
  const data = await service.searchProducts(searchTerm);

  this.testContext.setApiData(data);
  this.testContext.setSearchTerm(searchTerm);
});

When('Search products for {string} with page {string}', async function (
  this: CustomWorld,
  searchTerm: string,
  page: string
) {
  const service = await getProductService(this);
  const data = await service.searchProducts(searchTerm, parseInt(page));

  this.testContext.setApiData(data);
  this.testContext.setSearchTerm(searchTerm);
});

When('Request related products for stored product ID', async function (this: CustomWorld) {
  const service = await getProductService(this);
  const productId = this.testContext.getStoredProduct()?.id;

  if (!productId) {
    throw new Error('Product ID was not stored from previous step');
  }

  const data = await service.getRelatedProducts(productId);
  this.testContext.setApiData(data);
});

When('Request related products for non-existent product ID', async function (this: CustomWorld) {
  const service = await getProductService(this);
  try {
    const data = await service.getRelatedProducts(randomUUID.toString());
    this.testContext.setApiData(data);
  } catch (error: any) {
    this.testContext.setApiError(error?.message || 'Not found');
  }
});

When('Create product with valid data', async function (this: CustomWorld) {
  const productService = await getProductService(this);
  const categoryService = await getCategoryService(this);
  const brandService = await getBrandService(this);

  // Try to fetch real category and brand IDs from API
  let categoryId = await categoryService.getRandomCategory().then(cat => cat?.id);
  let brandId = await brandService.getRandomBrand().then(brand => brand?.id);

  const productData = ProductFactory.createValidProduct(categoryId, brandId).build();

  const data = await productService.createProduct(productData);

  this.testContext.setApiData(data);
  this.testContext.setProductId(data.id);
});

When('Update product with new valid data', async function (this: CustomWorld) {
  const productService = await getProductService(this);
  const productId = this.testContext.getStoredProduct()?.id;

  if (!productId) {
    throw new Error('Product ID was not stored from previous step');
  }

  const updatedData = ProductFactory.createValidProduct()
    .withName('Updated Product')
    .build();

  const data = await productService.updateProduct(productId, updatedData);

  this.testContext.setApiData(data);
});

When('Update non-existent product with valid data', async function (this: CustomWorld) {
  const productService = await getProductService(this);
  const productData = ProductFactory.createValidProduct().build();

  try {
    const data = await productService.updateProduct(randomUUID.toString(), productData);
    this.testContext.setApiData(data);
  } catch (error: any) {
    this.testContext.setApiError(error?.message || 'Not found');
  }
});

When('Partially update stored product with new name', async function (this: CustomWorld) {
  const productService = await getProductService(this);
  const productId = this.testContext.getStoredProduct()?.id;

  if (!productId) {
    throw new Error('Product ID was not stored from previous step');
  }

  const patchData = { name: 'Patched Product Name' };

  const data = await productService.patchProduct(productId, patchData);

  this.testContext.setApiData(data);
});

When('Partially update non-existent product', async function (this: CustomWorld) {
  const productService = await getProductService(this);
  const patchData = { name: 'Updated Name' };

  try {
    const data = await productService.patchProduct(randomUUID.toString(), patchData);
    this.testContext.setApiData(data);
  } catch (error: any) {
    this.testContext.setApiError(error?.message || 'Not found');
  }
});

When('Delete stored product', async function (this: CustomWorld) {
  const productService = await getProductService(this);
  const productId = this.testContext.getStoredProduct()?.id;

  if (!productId) {
    throw new Error('Product ID was not stored from previous step');
  }

  const data = await productService.deleteProduct(productId);

  this.testContext.setApiData(data);
});

When('Delete non-existent product', async function (this: CustomWorld) {
  const productService = await getProductService(this);

  try {
    const data = await productService.deleteProduct(randomUUID.toString());
    this.testContext.setApiData(data);
  } catch (error: any) {
    this.testContext.setApiError(error?.message || 'Not found');
  }
});

When('Store first product from response', async function (this: CustomWorld) {
  const data = this.testContext.getApiData() as PaginatedProductResponse;

  if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
    throw new Error('No products found in API response');
  }

  const firstProduct = data.data[0];
  this.testContext.setStoredProduct(firstProduct);
});

When('Search products for first product name', async function (this: CustomWorld) {
  const productService = await getProductService(this);
  const storedProduct = this.testContext.getStoredProduct();

  if (!storedProduct) {
    throw new Error('Stored product is not available');
  }

  const data = await productService.searchProducts(storedProduct.name);

  this.testContext.setApiData(data);
});

Then('API response status is {int}', async function (this: CustomWorld, expectedStatus: number) {
  const error = this.testContext.getApiError();

  if (expectedStatus === 200) {
    expect(error).toBeNull();
  }
  
  if (expectedStatus === 404) {
    expect(error).not.toBeNull();
    expect(error?.toLowerCase()).toContain('not found');
  }
});

Then('Response contains paginated products', async function (this: CustomWorld) {
  const data = this.testContext.getApiData() as PaginatedProductResponse;

  expect(data).toHaveProperty('data');
  expect(Array.isArray(data.data)).toBe(true);
  expect(data.data.length).toBeGreaterThan(0);
});

Then('Response has valid product structure', async function (this: CustomWorld) {
  const data = this.testContext.getApiData() as PaginatedProductResponse;

  data.data.forEach((product) => {
    validateProductStructure(product);
  });
});

Then('Response contains paginated search results', async function (this: CustomWorld) {
  const data = this.testContext.getApiData() as PaginatedProductResponse;

  expect(data).toHaveProperty('data');
  expect(Array.isArray(data.data)).toBe(true);
});

Then('Response contains array of related products', async function (this: CustomWorld) {
  const data = this.testContext.getApiData();

  expect(Array.isArray(data)).toBe(true);
});

Then('Related products have valid structure', async function (this: CustomWorld) {
  const data = this.testContext.getApiData() as RelatedProductsResponse;

  if (Array.isArray(data) && data.length > 0) {
    data.forEach((product) => {
      validateProductStructure(product);
    });
  }
});

Then('Response contains created product', async function (this: CustomWorld) {
  const data = this.testContext.getApiData() as ProductResponse;

  expect(data).toHaveProperty('id');
  validateProductStructure(data);
});

Then('Created product has valid ID', async function (this: CustomWorld) {
  const data = this.testContext.getApiData() as ProductResponse;

  expect(data.id).toBeDefined();
  expect(typeof data.id).toBe('string');
  expect(data.id.length).toBeGreaterThan(0);
});

Then('Store created product ID for cleanup', async function (this: CustomWorld) {
  const data = this.testContext.getApiData() as ProductResponse;
  this.testContext.setProductId(data.id);
});

Then('Response indicates {string} update', async function (
  this: CustomWorld, 
  updateStatus: string
) {
  const data = this.testContext.getApiData() as ChangeProductResponse;

  if (updateStatus === 'successful') {

    expect(data.success).toBeTruthy();
  }

  if (updateStatus === 'failed') {
    expect(data.success).toBeFalsy();
  }
});

Then('All products in response belong to requested category', async function (this: CustomWorld) {
  const data = this.testContext.getApiData() as PaginatedProductResponse;
  const catId = this.testContext.getProductId();

  data.data.forEach((product) => {
    expect(product.category?.id).toBe(catId);
  });
});

Then('All products in response belong to requested brand', async function (this: CustomWorld) {
  const data = this.testContext.getApiData() as PaginatedProductResponse;
  const bId = this.testContext.getProductId();

  data.data.forEach((product) => {
    expect(product.brand?.id).toBe(bId);
  });
});

Then('All products have CO2 rating A or B', async function (this: CustomWorld) {
  const data = this.testContext.getApiData() as PaginatedProductResponse;

  data.data.forEach((product) => {
    expect(['A', 'B']).toContain(product.co2_rating);
  });
});

Then('All products are marked as rental', async function (this: CustomWorld) {
  const data = this.testContext.getApiData() as PaginatedProductResponse;

  data.data.forEach((product) => {
    expect(product.is_rental).toBe(true);
  });
});

Then('All products have price between {int} and {int}', async function (
  this: CustomWorld,
  minPrice: number,
  maxPrice: number
) {
  const data = this.testContext.getApiData() as PaginatedProductResponse;

  data.data.forEach((product) => {
    expect(product.price).toBeGreaterThanOrEqual(minPrice);
    expect(product.price).toBeLessThanOrEqual(maxPrice);
  });
});

Then('Products are sorted by name in ascending order', async function (this: CustomWorld) {
  const data = this.testContext.getApiData() as PaginatedProductResponse;
  const names = data.data.map((p) => p.name);
  const sortedNames = [...names].sort();

  expect(names).toEqual(sortedNames);
});

Then('Products are sorted by price in descending order', async function (this: CustomWorld) {
  const data = this.testContext.getApiData() as PaginatedProductResponse;
  const prices = data.data.map((p) => p.price);
  const sortedPrices = [...prices].sort((a, b) => b - a);

  expect(prices).toEqual(sortedPrices);
});

Then('Current page is {string}', async function (this: CustomWorld, pageNum: string) {
  const data = this.testContext.getApiData() as PaginatedProductResponse;
  const page = parseInt(pageNum);

  expect(data.current_page).toBe(page);
});

Then('Response product matches stored product', async function (this: CustomWorld) {
  const storedProduct = this.testContext.getStoredProduct();
  const responseData = this.testContext.getApiData() as ProductResponse;

  if (!storedProduct) {
    throw new Error('Stored product is not available');
  }

  expect(responseData.id).toBe(storedProduct.id);
  expect(responseData.name).toBe(storedProduct.name);
});

Then('Response has complete product details', async function (this: CustomWorld) {
  const data = this.testContext.getApiData() as ProductResponse;

  expect(data).toHaveProperty('description');
  expect(data).toHaveProperty('name');
  expect(data).toHaveProperty('price');
  expect(data).toHaveProperty('in_stock');
  expect(data).toHaveProperty('co2_rating');
});

Then('All results match search term {string}', async function (this: CustomWorld, searchTerm: string) {
  const data = this.testContext.getApiData() as PaginatedProductResponse;
  const lowerSearchTerm = searchTerm.toLowerCase();

  data.data.forEach((product) => {
    expect(product.name.toLowerCase()).toContain(lowerSearchTerm);
  });
});

Then('All API calls returned status 200', async function (this: CustomWorld) {
  const error = this.testContext.getApiError();

  expect(error).toBeNull();
});

Then('Response contains matching products in search results', async function (
  this: CustomWorld
) {
  const data = this.testContext.getApiData() as PaginatedProductResponse;
  const storedProduct = this.testContext.getStoredProduct();

  if (!storedProduct) {
    throw new Error('Stored product is not available');
  }

  const hasMatchingProduct = data.data.some((p) => p.id === storedProduct.id);
  expect(hasMatchingProduct).toBe(true);
});
