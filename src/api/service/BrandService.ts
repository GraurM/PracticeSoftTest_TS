import type { BrandClient } from '../controller/BrandController';
import type { Brand } from '../data/response';
import { parseJson } from '../helpers/JsonParser';

/**
 * BrandService - Handles all brand business logic
 * Wraps BrandClient and provides typed response handling
 */
export class BrandService {
  constructor(private client: BrandClient) {}

  /**
   * Get all brands with pagination
   */
  async getBrands(): Promise<Brand[]> {
    const response = await this.client.getBrands();
    const data = await parseJson<Brand[]>(response);
    return data || [];
  }

  /**
   * Get a specific brand by ID
   */
  async getBrandById(brandId: string): Promise<Brand> {
    const response = await this.client.getBrandById(brandId);
    return parseJson<Brand>(response);
  }

  /**
   * Get a random brand from available brands
   */
  async getRandomBrand(): Promise<Brand> {
    const brands = await this.getBrands();
    if (brands.length === 0) {
      throw new Error('No brands available');
    }
    return brands[Math.floor(Math.random() * brands.length)];
  }

  /**
   * Get the first available brand
   */
  async getFirstBrand(): Promise<Brand> {
    const brands = await this.getBrands();
    if (brands.length === 0) {
      throw new Error('No brands available');
    }
    return brands[0];
  }
}
