import type { APIResponse } from '@playwright/test';
import type { ProductDto } from '../../../src/api/dto/ProductDto';

/**
 * Context class to manage shared data between test steps
 * Provides type-safe access to test state and variables
 */
export class Context {
  private apiData: {
    response?: APIResponse;
    data?: unknown;
    products?: ProductDto[];
    productId?: string;
    product?: ProductDto;
  };

  private uiData: {
    searchTerm?: string;
    selectedProductName?: string;
    cartItems?: number;
  };

  constructor() {
    this.apiData = {};
    this.uiData = {};
  }

  // API Data methods
  setApiResponse(response: APIResponse): void {
    this.apiData.response = response;
  }

  getApiResponse(): APIResponse | undefined {
    return this.apiData.response;
  }

  setApiData(data: unknown): void {
    this.apiData.data = data;
  }

  getApiData(): unknown {
    return this.apiData.data;
  }

  setProducts(products: ProductDto[]): void {
    this.apiData.products = products;
  }

  getProducts(): ProductDto[] | undefined {
    return this.apiData.products;
  }

  setProductId(id: string): void {
    this.apiData.productId = id;
  }

  getProductId(): string | undefined {
    return this.apiData.productId;
  }

  setProduct(product: ProductDto): void {
    this.apiData.product = product;
  }

  getProduct(): ProductDto | undefined {
    return this.apiData.product;
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
    this.apiData = {};
    this.uiData = {};
  }
}
