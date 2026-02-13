import type { APIRequestContext, APIResponse } from '@playwright/test';

export class ProductsApi {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getProducts(params?: Record<string, string | number>): Promise<APIResponse> {
    return this.request.get('/products', { params });
  }

  async getProductById(id: string): Promise<APIResponse> {
    return this.request.get(`/products/${id}`);
  }
}
