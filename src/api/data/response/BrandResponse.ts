/**
 * Brand data structure
 */
export interface Brand {
  id: string;
  name: string;
  slug: string;
}

/**
 * Brand list response with pagination
 */
export interface BrandListResponse {
  data: Brand[];
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
}
