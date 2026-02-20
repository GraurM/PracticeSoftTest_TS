/**
 * Category data structure
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
}

/**
 * Category list response with pagination
 */
export interface CategoryListResponse {
  data: Category[];
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
}
