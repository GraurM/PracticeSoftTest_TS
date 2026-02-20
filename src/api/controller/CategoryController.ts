import type { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * CategoryClient handles Category API endpoints
 */
export class CategoryClient {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * GET /categories - Retrieve all categories with pagination
   */
  async getCategories(): Promise<APIResponse> {
    return this.request.get('/categories');
  }

  /**
   * GET /categories/:categoryId - Retrieve specific category details
   */
  async getCategoryById(categoryId: string): Promise<APIResponse> {
    return this.request.get(`/categories/tree/${categoryId}`);
  }
}
