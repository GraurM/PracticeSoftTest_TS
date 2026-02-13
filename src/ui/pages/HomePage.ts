import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { SearchElement } from '../elements/search-element';
import { ProductCard } from '../elements/product-card-element';
import { ProductsGrid } from '../elements/products-grid-element';
import { CategoryFilters } from '../elements/category-filters-element';

/**
 * HomePage represents the main product listing page of the Toolshop.
 * Provides access to product cards, search, and filtering functionality.
 * Inherits header navigation from BasePage.
 */
export class HomePage extends BasePage {
  readonly searchElement: SearchElement;
  readonly productsGrid: ProductsGrid;
  readonly filters: CategoryFilters;

  constructor(page: Page) {
    super(page);
    this.searchElement = new SearchElement(page);
    this.productsGrid = new ProductsGrid(page);
    this.filters = new CategoryFilters(page);
  }

  /**
   * Get product card locators, optionally filtered by name (backward compatibility)
   */
  productCards(name?: string): Locator {
    const cards = this.page.locator('[data-test^="product-"]');
    if (!name) {
      return cards;
    }

    return cards.filter({ hasText: name });
  }

  /**
   * Open a product by name, preferring in-stock items
   */
  async openProduct(name: string): Promise<void> {
    await this.productsGrid.openProductByName(name);
  }

  /**
   * Search for a product term
   */
  async search(term: string): Promise<void> {
    await this.searchElement.search(term);
  }

  /**
   * Filter products by category
   */
  async filterByCategory(name: string): Promise<void> {
    await this.filters.filterByCategory(name);
  }

  /**
   * Filter products by brand
   */
  async filterByBrand(name: string): Promise<void> {
    await this.filters.filterByBrand(name);
  }
}
