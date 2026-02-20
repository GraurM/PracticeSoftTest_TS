import type { CategoryClient } from '../controller/CategoryController';
import { parseJson } from '../helpers/JsonParser';

/**
 * Category data structure
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
}

// /**
//  * Category list response with pagination
//  */
// export interface CategoryListResponse {
//   data: Category[];
//   current_page?: number;
//   per_page?: number;
//   total?: number;
//   last_page?: number;
// }

/**
 * CategoryService - Handles all category business logic
 * Wraps CategoryClient and provides typed response handling
 */
export class CategoryService {
  constructor(private client: CategoryClient) {}

  /**
   * Get all categories with pagination
   */
  async getCategories(): Promise<Category[]> {
    const response = await this.client.getCategories();
    const data = await parseJson<Category[]>(response);
    return data || [];
  }

  /**
   * Get a specific category by ID
   */
  async getCategoryById(categoryId: string): Promise<Category> {
    const response = await this.client.getCategoryById(categoryId);
    return parseJson<Category>(response);
  }

  /**
   * Get a random category from available categories
   */
  async getRandomCategory(): Promise<Category> {
    const categories = (await this.getCategories()).filter((cat) => cat.parent_id !== null); // Ensure categories have valid IDs
    if (categories.length === 0) {
      throw new Error('No categories available');
    }
    return categories[Math.floor(Math.random() * categories.length)];
  }

  /**
   * Get the first available category
   */
  async getFirstCategory(): Promise<Category> {
    const categories = (await this.getCategories()).filter((cat) => cat.parent_id !== null); // Ensure categories have valid IDs
    if (categories.length === 0) {
      throw new Error('No categories available');
    }
    return categories[0];
  }
}
