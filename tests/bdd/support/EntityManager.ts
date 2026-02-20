import { Page, APIRequestContext } from '@playwright/test';
import { HomePage } from '../../../src/ui/pages/HomePage';
import { ProductPage } from '../../../src/ui/pages/ProductPage';
import { CartPage } from '../../../src/ui/pages/CartPage';
import { ProductsApi } from '../../../src/api/ProductsApi';
import { ProductClient } from '../../../src/api/controller/ProductController';
import { BrandClient } from '../../../src/api/controller/BrandController';
import { CategoryClient } from '../../../src/api/controller/CategoryController';
import { ProductService } from '../../../src/api/service/ProductService';
import { BrandService } from '../../../src/api/service/BrandService';
import { CategoryService } from '../../../src/api/service/CategoryService';

/**
 * EntityManager class to manage and initialize all pages and API entities
 * Provides lazy initialization and singleton-like access to all entities
 */
export class EntityManager {
  private page: Page;
  private apiRequest?: APIRequestContext;

  private homePage?: HomePage;
  private productPage?: ProductPage;
  private cartPage?: CartPage;
  private productsApi?: ProductsApi;
  private productClient?: ProductClient;
  private brandClient?: BrandClient;
  private categoryClient?: CategoryClient;
  private productService?: ProductService;
  private brandService?: BrandService;
  private categoryService?: CategoryService;

  constructor(page: Page, apiRequest?: APIRequestContext) {
    this.page = page;
    this.apiRequest = apiRequest;
  }

  /**
   * Get or initialize HomePage
   */
  getHomePage(): HomePage {
    if (!this.homePage) {
      this.homePage = new HomePage(this.page);
    }
    return this.homePage;
  }

  /**
   * Get or initialize ProductPage
   */
  getProductPage(): ProductPage {
    if (!this.productPage) {
      this.productPage = new ProductPage(this.page);
    }
    return this.productPage;
  }

  /**
   * Get or initialize CartPage
   */
  getCartPage(): CartPage {
    if (!this.cartPage) {
      this.cartPage = new CartPage(this.page);
    }
    return this.cartPage;
  }

  /**
   * Get or initialize ProductsApi
   */
  getProductsApi(): ProductsApi {
    if (!this.productsApi) {
      if (!this.apiRequest) {
        throw new Error('APIRequestContext is not initialized');
      }
      this.productsApi = new ProductsApi(this.apiRequest);
    }
    return this.productsApi;
  }

  /**
   * Get or initialize ProductClient
   */
  getProductClient(): ProductClient {
    if (!this.productClient) {
      if (!this.apiRequest) {
        throw new Error('APIRequestContext is not initialized');
      }
      this.productClient = new ProductClient(this.apiRequest);
    }
    return this.productClient;
  }

  /**
   * Get or initialize BrandClient
   */
  getBrandClient(): BrandClient {
    if (!this.brandClient) {
      if (!this.apiRequest) {
        throw new Error('APIRequestContext is not initialized');
      }
      this.brandClient = new BrandClient(this.apiRequest);
    }
    return this.brandClient;
  }

  /**
   * Get or initialize CategoryClient
   */
  getCategoryClient(): CategoryClient {
    if (!this.categoryClient) {
      if (!this.apiRequest) {
        throw new Error('APIRequestContext is not initialized');
      }
      this.categoryClient = new CategoryClient(this.apiRequest);
    }
    return this.categoryClient;
  }

  /**
   * Get or initialize ProductService
   */
  getProductService(): ProductService {
    if (!this.productService) {
      this.productService = new ProductService(this.getProductClient());
    }
    return this.productService;
  }

  /**
   * Get or initialize BrandService
   */
  getBrandService(): BrandService {
    if (!this.brandService) {
      this.brandService = new BrandService(this.getBrandClient());
    }
    return this.brandService;
  }

  /**
   * Get or initialize CategoryService
   */
  getCategoryService(): CategoryService {
    if (!this.categoryService) {
      this.categoryService = new CategoryService(this.getCategoryClient());
    }
    return this.categoryService;
  }

  /**
   * Get the underlying Page object
   */
  getPage(): Page {
    return this.page;
  }

  /**
   * Get the underlying APIRequestContext object
   */
  getApiRequest(): APIRequestContext | undefined {
    return this.apiRequest;
  }

  /**
   * Reset all cached page instances
   * Useful when you need to reinitialize pages
   */
  resetPages(): void {
    this.homePage = undefined;
    this.productPage = undefined;
    this.cartPage = undefined;
  }

  /**
   * Reset all cached entities
   */
  reset(): void {
    this.resetPages();
    this.productsApi = undefined;
    this.productClient = undefined;
    this.brandClient = undefined;
    this.categoryClient = undefined;
    this.productService = undefined;
    this.brandService = undefined;
    this.categoryService = undefined;
  }
}
