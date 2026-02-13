import { Locator, Page } from '@playwright/test';

/**
 * CategoryFilter element represents a single category or brand filter.
 * Contains label, checkbox, and optional sub-categories.
 */
export class CategoryFilter {
  private readonly root: Locator;
  private readonly page: Page;

  readonly label: Locator;
  readonly checkbox: Locator;
  readonly subCategories: Locator;

  constructor(page: Page, root: Locator) {
    this.page = page;
    this.root = root;
    this.label = root.locator('label').first();
    this.checkbox = root.locator('input[type="checkbox"]').first();
    this.subCategories = root.locator('[class*="sub-category"], [class*="subcategory"]');
  }

  /**
   * Get the label text for this category
   */
  async getLabel(): Promise<string> {
    return (await this.label.textContent()) ?? '';
  }

  /**
   * Check this category filter
   */
  async check(): Promise<void> {
    await this.checkbox.check();
  }

  /**
   * Uncheck this category filter
   */
  async uncheck(): Promise<void> {
    await this.checkbox.uncheck();
  }

  /**
   * Check if this category is checked
   */
  async isChecked(): Promise<boolean> {
    return this.checkbox.isChecked();
  }

  /**
   * Get all sub-categories count
   */
  async getSubCategoriesCount(): Promise<number> {
    return this.subCategories.count();
  }

  /**
   * Get a specific sub-category by index
   */
  getSubCategory(index: number): CategoryFilter {
    const subCat = this.subCategories.nth(index);
    return new CategoryFilter(this.page, subCat);
  }

  /**
   * Check if this filter is visible
   */
  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }
}

/**
 * CategoryFilters element represents the entire filter panel.
 * Contains category and brand filters for product filtering.
 */
export class CategoryFilters {
  private readonly page: Page;
  readonly filterPanel: Locator;
  readonly categorySection: Locator;
  readonly brandSection: Locator;
  readonly priceRangeSection: Locator;
  readonly categories: Locator;
  readonly brands: Locator;

  constructor(page: Page) {
    this.page = page;
    this.filterPanel = page.locator('[class*="filter"], [class*="sidebar"]').first();
    this.categorySection = this.filterPanel.locator('[class*="category"]').first();
    this.brandSection = this.filterPanel.locator('[class*="brand"]').first();
    this.priceRangeSection = this.filterPanel.locator('[class*="price"]').first();
    this.categories = this.categorySection.locator('[class*="filter-item"], label');
    this.brands = this.brandSection.locator('[class*="filter-item"], label');
  }

  /**
   * Get count of main categories
   */
  async getCategoryCount(): Promise<number> {
    return this.categories.count();
  }

  /**
   * Get a category by index
   */
  getCategory(index: number): CategoryFilter {
    const categoryItem = this.categories.nth(index);
    return new CategoryFilter(this.page, categoryItem);
  }

  /**
   * Get count of main brands
   */
  async getBrandCount(): Promise<number> {
    return this.brands.count();
  }

  /**
   * Get a brand by index
   */
  getBrand(index: number): CategoryFilter {
    const brandItem = this.brands.nth(index);
    return new CategoryFilter(this.page, brandItem);
  }

  /**
   * Filter by category name - uses the original working approach
   */
  async filterByCategory(name: string): Promise<void> {
    const checkbox = this.page.getByRole('checkbox', { name: new RegExp(name, 'i') });
    await checkbox.check();
  }

  /**
   * Filter by brand name - uses the original working approach
   */
  async filterByBrand(name: string): Promise<void> {
    const checkbox = this.page.getByRole('checkbox', { name: new RegExp(name, 'i') });
    await checkbox.check();
  }

  /**
   * Clear all active filters
   */
  async clearAllFilters(): Promise<void> {
    const categoryCount = await this.getCategoryCount();
    for (let i = 0; i < categoryCount; i++) {
      const category = this.getCategory(i);
      if (await category.isChecked()) {
        await category.uncheck();
      }
    }

    const brandCount = await this.getBrandCount();
    for (let i = 0; i < brandCount; i++) {
      const brand = this.getBrand(i);
      if (await brand.isChecked()) {
        await brand.uncheck();
      }
    }
  }

  /**
   * Check if filter panel is visible
   */
  async isVisible(): Promise<boolean> {
    return this.filterPanel.isVisible();
  }
}
