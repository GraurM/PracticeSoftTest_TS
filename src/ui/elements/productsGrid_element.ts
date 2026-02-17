import { Locator, Page } from '@playwright/test';
import { ProductCard } from './productCard_element';

/**
 * ProductsGrid element represents the main area containing product cards.
 * Provides methods to interact with individual products and pagination.
 */
export class ProductsGrid {
  private readonly page: Page;
  readonly gridContainer: Locator;
  readonly productCardsLocator: Locator;
  readonly pagination: Locator;
  readonly nextPageButton: Locator;
  readonly previousPageButton: Locator;
  readonly pageButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.gridContainer = page.locator('div.col-md-9, [class*="products"], [class*="grid"]').first();
    this.productCardsLocator = page.locator('[data-test^="product-"]');
    this.pagination = page.locator('[class*="pagination"], nav[aria-label*="Pagination"]');
    this.nextPageButton = this.pagination.locator('button:has-text("Next"), a:has-text("Next"), [aria-label*="Next"]').first();
    this.previousPageButton = this.pagination
      .locator('button:has-text("Prev"), a:has-text("Prev"), [aria-label*="Prev"]')
      .first();
    this.pageButtons = this.pagination.locator('button, a');
  }

  /**
   * Get the count of visible product cards
   */
  async getProductCount(): Promise<number> {
    return this.productCardsLocator.count();
  }

  /**
   * Get a specific product card by index
   */
  getProductByIndex(index: number): ProductCard {
    const card = this.productCardsLocator.nth(index);
    return new ProductCard(card);
  }

  /**
   * Open a product by name - uses the original approach of filtering cards by text
   * This was the working method before element refactoring
   */
  async openProductByName(name: string): Promise<void> {
    await this.productCardsLocator
      .filter({ hasText: name, hasNotText: /out of stock/i })
      .first()
      .click();
  }

  /**
   * Get all products visible on the current page
   */
  async getAllProducts(): Promise<ProductCard[]> {
    const count = await this.getProductCount();
    const products: ProductCard[] = [];
    for (let i = 0; i < count; i++) {
      products.push(this.getProductByIndex(i));
    }
    return products;
  }

  /**
   * Check if next page button is enabled
   */
  async canGoToNextPage(): Promise<boolean> {
    try {
      return await this.nextPageButton.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Check if previous page button is enabled
   */
  async canGoToPreviousPage(): Promise<boolean> {
    try {
      return await this.previousPageButton.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Click next page button
   */
  async goToNextPage(): Promise<void> {
    await this.nextPageButton.click();
  }

  /**
   * Click previous page button
   */
  async goToPreviousPage(): Promise<void> {
    await this.previousPageButton.click();
  }

  /**
   * Go to a specific page number
   */
  async goToPage(pageNumber: number): Promise<void> {
    const buttons = await this.pageButtons.all();
    for (const button of buttons) {
      const text = await button.textContent();
      if (text?.trim() === pageNumber.toString()) {
        await button.click();
        return;
      }
    }
    throw new Error(`Page ${pageNumber} not found in pagination`);
  }

  /**
   * Get current page number from pagination
   */
  async getCurrentPageNumber(): Promise<number | null> {
    try {
      const activeButton = this.pagination.locator('[class*="active"], [aria-current="page"]').first();
      const text = await activeButton.textContent();
      return text ? parseInt(text, 10) : null;
    } catch {
      return null;
    }
  }
}
