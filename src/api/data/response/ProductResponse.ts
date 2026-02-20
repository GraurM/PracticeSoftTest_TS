/**
 * Single product response from API
 */
export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  is_location_offer: boolean;
  is_rental: boolean;
  co2_rating: 'A' | 'B' | 'C' | 'D' | 'E';
  in_stock: boolean;
  is_eco_friendly: boolean;
  product_image?: {
    id: string;
    by_name?: string;
    by_url?: string;
    source_name?: string;
    source_url?: string;
    file_name?: string;
    title?: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
  };
}

export interface ChangeProductResponse {
  success: boolean;
}

/**
 * Paginated product list response
 */
export interface PaginatedProductResponse {
  current_page: number;
  data: ProductResponse[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

/**
 * Search results response (paginated)
 */
export type SearchProductResponse = PaginatedProductResponse;

/**
 * Related products response (array of products)
 */
export type RelatedProductsResponse = ProductResponse[];
