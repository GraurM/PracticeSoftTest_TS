/**
 * Request parameters for GET /products
 * Supports filtering, sorting, and pagination
 */
export interface GetProductsRequest {
  /**
   * Brand ID to filter by
   */
  by_brand?: string;

  /**
   * Category ID to filter by
   */
  by_category?: string;

  /**
   * Filter to show rental products (0 or 1)
   */
  is_rental?: boolean;

  /**
   * Filter for eco-friendly products with CO₂ rating A or B
   */
  eco_friendly?: boolean;

  /**
   * Price range filter: "price,min,max" (e.g., "price,10,100")
   */
  between?: string;

  /**
   * Sort by column and direction
   * Format: "column,direction" (e.g., "name,asc", "price,desc", "co2_rating,asc")
   */
  sort?: string;

  /**
   * Page number for pagination (1-based)
   */
  page?: number;
}

/**
 * Request body for POST /products (Create product)
 */
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category_id: string;
  brand_id: string;
  product_image_id: string;
  is_location_offer: boolean;
  is_rental: boolean;
  co2_rating: 'A' | 'B' | 'C' | 'D' | 'E';
}

/**
 * Request body for PUT /products/:id (Full update)
 */
export type UpdateProductRequest = CreateProductRequest;

/**
 * Request body for PATCH /products/:id (Partial update)
 */
export type PatchProductRequest = Partial<CreateProductRequest>;

/**
 * Request parameters for GET /products/search
 */
export interface SearchProductRequest {
  /**
   * Search query string
   */
  q: string;

  /**
   * Page number for pagination (1-based)
   */
  page?: number;
}
