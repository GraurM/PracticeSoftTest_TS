import { Page, APIRequestContext } from '@playwright/test';
import { HomePage } from '../../../src/ui/pages/HomePage';
import { ProductPage } from '../../../src/ui/pages/ProductPage';
import { CartPage } from '../../../src/ui/pages/CartPage';
import { ProductsApi } from '../../../src/api/ProductsApi';

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
  }
}
