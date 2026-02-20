import type { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * BrandClient handles Brand API endpoints
 */
export class BrandClient {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * GET /brands - Retrieve all brands with pagination
   */
  async getBrands(): Promise<APIResponse> {
    return this.request.get('/brands');
  }

  /**
   * GET /brands/:brandId - Retrieve specific brand details
   */
  async getBrandById(brandId: string): Promise<APIResponse> {
    return this.request.get(`/brands/${brandId}`);
  }
}
