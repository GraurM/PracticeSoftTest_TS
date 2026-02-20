import type { ProductClient } from '../controller/ProductController';
import type {
  PaginatedProductResponse,
  ProductResponse,
  RelatedProductsResponse,
} from '../data/response';
import { parseJson } from '../helpers/JsonParser';
import type { GetProductsRequest } from '../data/request/GetProductsRequest';

/**
 * ProductService - Handles all product business logic
 * Wraps ProductClient and provides typed response handling
 */
export class ProductService {
  constructor(private client: ProductClient) {}

  /**
   * Get all products with optional filters, sorting, and pagination
   */
  async getProducts(params?: Partial<GetProductsRequest>): Promise<PaginatedProductResponse> {
    const response = await this.client.getProducts(params);
    return parseJson<PaginatedProductResponse>(response);
  }

  /**
   * Get a specific product by ID
   */
  async getProductById(productId: string): Promise<ProductResponse> {
    const response = await this.client.getProductById(productId);
    return parseJson<ProductResponse>(response);
  }

  /**
   * Create a new product
   */
  async createProduct(data: Record<string, any>): Promise<ProductResponse> {
    const response = await this.client.createProduct(data);
    return parseJson<ProductResponse>(response);
  }

  /**
   * Update a product (full replacement)
   */
  async updateProduct(
    productId: string,
    data: Record<string, any>
  ): Promise<ProductResponse> {
    const response = await this.client.updateProduct(productId, data);
    return parseJson<ProductResponse>(response);
  }

  /**
   * Partially update a product
   */
  async patchProduct(
    productId: string,
    data: Record<string, any>
  ): Promise<ProductResponse> {
    const response = await this.client.patchProduct(productId, data);
    return parseJson<ProductResponse>(response);
  }

  /**
   * Delete a product
   */
  async deleteProduct(productId: string): Promise<void> {
    await this.client.deleteProduct(productId);
  }

  /**
   * Search products by query
   */
  async searchProducts(query: string, page?: number): Promise<PaginatedProductResponse> {
    const response = await this.client.searchProducts(query, page);
    return parseJson<PaginatedProductResponse>(response);
  }

  /**
   * Get related products for a given product
   */
  async getRelatedProducts(productId: string): Promise<RelatedProductsResponse> {
    const response = await this.client.getRelatedProducts(productId);
    return parseJson<RelatedProductsResponse>(response);
  }

  /**
   * Get the first available product
   */
  async getFirstProduct(): Promise<ProductResponse> {
    const products = await this.getProducts();
    if (!products.data || products.data.length === 0) {
      throw new Error('No products available');
    }
    return products.data[0];
  }
}
