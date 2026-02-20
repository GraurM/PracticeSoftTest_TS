import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { GetProductsRequest } from '../data/request/GetProductsRequest';

/**
 * ProductClient handles all Product API endpoints
 * Includes: List, Get, Create, Update, Delete, Patch, Search, Related
 */
export class ProductClient {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * GET /products - Retrieve all products with filters, sorting, pagination
   */
  async getProducts(params?: Partial<GetProductsRequest>): Promise<APIResponse> {
    return this.request.get('/products', {
      params: params ? this.buildQueryParams(params) : undefined
    });
  }

  /**
   * POST /products - Create a new product
   */
  async createProduct(data: Record<string, any>): Promise<APIResponse> {
    return this.request.post('/products', {
      data
    });
  }

  /**
   * GET /products/:productId - Retrieve specific product details
   */
  async getProductById(productId: string): Promise<APIResponse> {
    return this.request.get(`/products/${productId}`);
  }

  /**
   * PUT /products/:productId - Full update of product
   */
  async updateProduct(productId: string, data: Record<string, any>): Promise<APIResponse> {
    return this.request.put(`/products/${productId}`, {
      data
    });
  }

  /**
   * PATCH /products/:productId - Partial update of product
   */
  async patchProduct(productId: string, data: Record<string, any>): Promise<APIResponse> {
    return this.request.patch(`/products/${productId}`, {
      data
    });
  }

  /**
   * DELETE /products/:productId - Delete a product
   */
  async deleteProduct(productId: string): Promise<APIResponse> {
    return this.request.delete(`/products/${productId}`);
  }

  /**
   * GET /products/:productId/related - Retrieve related products
   */
  async getRelatedProducts(productId: string): Promise<APIResponse> {
    return this.request.get(`/products/${productId}/related`);
  }

  /**
   * GET /products/search - Search products by query
   */
  async searchProducts(query: string, page?: number): Promise<APIResponse> {
    const params: Record<string, any> = { q: query };
    if (page) params.page = page;
    
    return this.request.get('/products/search', { params });
  }

  /**
   * Build query parameters from request object, filtering out undefined values
   */
  private buildQueryParams(params: Partial<GetProductsRequest>): Record<string, any> {
    const result: Record<string, any> = {};

    if (params.by_brand) result.by_brand = params.by_brand;
    if (params.by_category) result.by_category = params.by_category;
    if (params.is_rental !== undefined) result.is_rental = params.is_rental;
    if (params.eco_friendly !== undefined) result.eco_friendly = params.eco_friendly;
    if (params.between) result.between = params.between;
    if (params.sort) result.sort = params.sort;
    if (params.page) result.page = params.page;

    return result;
  }
}
