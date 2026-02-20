import type { APIResponse } from '@playwright/test';
import type { ProductClient } from '../../../src/api/controller/ProductController';
import type { ProductResponse } from '../../../src/api/data/response';

/**
 * Context class to manage shared data between test steps
 * Provides type-safe access to test state and variables
 */
export class Context {
  private apiData: {
    response: APIResponse;
    data?: unknown;
    error?: string | null;
    productId?: string;
    storedProduct?: ProductResponse;
  };

  private uiData: {
    searchTerm?: string;
    selectedProductName?: string;
    cartItems?: number;
  };

  constructor() {
    this.apiData = { response: {} as APIResponse, error: null };
    this.uiData = {};
  }

  // API Data methods
  setApiResponse(response: APIResponse): void {
    this.apiData.response = response;
  }

  getApiResponse(): APIResponse {
    return this.apiData.response;
  }

  setApiData(data: unknown): void {
    this.apiData.data = data;
  }

  getApiData(): unknown {
    return this.apiData.data;
  }

  setApiError(error: string | null): void {
    this.apiData.error = error;
  }

  getApiError(): string | null | undefined {
    return this.apiData.error;
  }

  setProductId(id: string): void {
    this.apiData.productId = id;
  }

  getProductId(): string | undefined {
    return this.apiData.productId;
  }

  setStoredProduct(product: ProductResponse): void {
    this.apiData.storedProduct = product;
  }

  getStoredProduct(): ProductResponse | undefined {
    return this.apiData.storedProduct;
  }

  // UI Data methods
  setSearchTerm(term: string): void {
    this.uiData.searchTerm = term;
  }

  getSearchTerm(): string | undefined {
    return this.uiData.searchTerm;
  }

  setSelectedProductName(name: string): void {
    this.uiData.selectedProductName = name;
  }

  getSelectedProductName(): string | undefined {
    return this.uiData.selectedProductName;
  }

  setCartItems(count: number): void {
    this.uiData.cartItems = count;
  }

  getCartItems(): number | undefined {
    return this.uiData.cartItems;
  }

  // Clear all data
  clear(): void {
    this.apiData = { response: {} as APIResponse, error: null };
    this.uiData = {};
  }
}
